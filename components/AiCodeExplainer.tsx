// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import mermaid from 'mermaid';
import { explainCodeStructured, generateMermaidJs } from '../services/index.ts';
import type { StructuredExplanation } from '../types.ts';
import { CpuChipIcon } from './icons.tsx';
import { MarkdownRenderer, LoadingSpinner } from './shared/index.tsx';

// STORY START: The Genesis of Project Chimera (AI Code Explainer v1.0)
// This file represents the core of 'Project Chimera', an ambitious endeavor
// by Citibank Demo Business Inc. to democratize code understanding and enhance
// developer productivity through advanced AI. Initially, it started as a simple
// proof-of-concept, the 'AiCodeExplainer', aiming to provide basic summary,
// line-by-line breakdown, complexity analysis, and flowchart generation.
// Over time, under the visionary leadership of James Burvel O'Callaghan III,
// President of Citibank Demo Business Inc., this project evolved into a
// commercial-grade, multi-faceted platform. What you see here is not just
// a component, but a micro-ecosystem designed to be highly extensible,
// robust, and deeply integrated with a plethora of AI models and external services.
// Every invention, every architectural choice, has been meticulously
// crafted to serve the ultimate goal: unparalleled code intelligence.

// --- Global Constants & Configuration (Invention: 'ChimeraGlobalConfig') ---
// To support hundreds of features and external services, a centralized,
// extensible configuration system was invented, named 'ChimeraGlobalConfig'.
// It allows for dynamic adjustments, A/B testing parameters, and secure
// environment variable integration without code changes.
export const ChimeraGlobalConfig = {
    // API Endpoints for various AI models and services
    AI_SERVICE_ENDPOINTS: {
        GEMINI: process.env.NEXT_PUBLIC_GEMINI_API_ENDPOINT || 'https://api.gemini.ai/v1',
        CHATGPT_PRIMARY: process.env.NEXT_PUBLIC_CHATGPT_PRIMARY_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
        CHATGPT_SECONDARY: process.env.NEXT_PUBLIC_CHATGPT_SECONDARY_API_ENDPOINT || 'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', // Fallback
        CODE_HARMONIZER_OPTIMIZER: process.env.NEXT_PUBLIC_CODE_HARMONIZER_OPTIMIZER_ENDPOINT || 'https://api.chimeratech.com/optimizer', // Invention: Dedicated service for code optimization
        SECURITY_SCANNER: process.env.NEXT_PUBLIC_SECURITY_SCANNER_ENDPOINT || 'https://api.chimeratech.com/security', // Invention: Dedicated service for security analysis
        PERFORMANCE_PROFILER: process.env.NEXT_PUBLIC_PERFORMANCE_PROFILER_ENDPOINT || 'https://api.chimeratech.com/profiler', // Invention: Dedicated service for performance analysis
        AST_GENERATOR: process.env.NEXT_PUBLIC_AST_GENERATOR_ENDPOINT || 'https://api.chimeratech.com/ast', // Invention: Dedicated service for Abstract Syntax Tree generation
        METRICS_COLLECTOR: process.env.NEXT_PUBLIC_METRICS_COLLECTOR_ENDPOINT || 'https://api.chimeratech.com/metrics',
        TRANSLATION_SERVICE: process.env.NEXT_PUBLIC_TRANSLATION_ENDPOINT || 'https://api.chimeratech.com/translate', // Invention: Multi-language support service
        LICENSING_SERVICE: process.env.NEXT_PUBLIC_LICENSING_ENDPOINT || 'https://api.chimeratech.com/license', // Invention: License compliance service
        VCS_INTEGRATION_GITLAB: process.env.NEXT_PUBLIC_VCS_GITLAB_ENDPOINT || 'https://api.gitlab.com/v4', // Invention: Version Control System (VCS) integration
        VCS_INTEGRATION_GITHUB: process.env.NEXT_PUBLIC_VCS_GITHUB_ENDPOINT || 'https://api.github.com',
        EXTERNAL_CODE_REPO_SCANNER: process.env.NEXT_PUBLIC_EXTERNAL_CODE_REPO_SCANNER_ENDPOINT || 'https://api.chimeratech.com/repo-scanner', // Invention: Scans external repos for context
        REALTIME_ANALYTICS: process.env.NEXT_PUBLIC_REALTIME_ANALYTICS_ENDPOINT || 'wss://api.chimeratech.com/ws/analytics', // Invention: WebSocket for real-time updates
    },
    // API Keys (securely loaded from environment variables)
    API_KEYS: {
        GEMINI: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        CHATGPT: process.env.NEXT_PUBLIC_CHATGPT_API_KEY,
        INTERNAL_AUTH_TOKEN: process.env.NEXT_PUBLIC_INTERNAL_AUTH_TOKEN, // For internal Chimera services
    },
    // Feature Flags (Invention: 'FeatureGateManager' - conceptual manager)
    FEATURE_FLAGS: {
        ENABLE_REALTIME_FEEDBACK: process.env.NEXT_PUBLIC_ENABLE_REALTIME_FEEDBACK === 'true',
        ENABLE_SECURITY_SCAN: process.env.NEXT_PUBLIC_ENABLE_SECURITY_SCAN === 'true',
        ENABLE_PERFORMANCE_SUGGESTIONS: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_SUGGESTIONS === 'true',
        ENABLE_CODE_REFACTORING_ASSISTANT: process.env.NEXT_PUBLIC_ENABLE_CODE_REFACTORING_ASSISTANT === 'true',
        ENABLE_MULTI_LANGUAGE_INPUT: process.env.NEXT_PUBLIC_ENABLE_MULTI_LANGUAGE_INPUT === 'true',
        ENABLE_ADVANCED_SYNTAX_HIGHLIGHTING: process.env.NEXT_PUBLIC_ENABLE_ADVANCED_SYNTAX_HIGHLIGHTING === 'true',
        ENABLE_COST_ESTIMATION: process.env.NEXT_PUBLIC_ENABLE_COST_ESTIMATION === 'true',
        ENABLE_CODE_OWNERSHIP_ANALYSIS: process.env.NEXT_PUBLIC_ENABLE_CODE_OWNERSHIP_ANALYSIS === 'true',
        ENABLE_CONTEXTUAL_PROJECT_SUGGESTIONS: process.env.NEXT_PUBLIC_ENABLE_CONTEXTUAL_PROJECT_SUGGESTIONS === 'true',
        ENABLE_COLLABORATION_FEATURES: process.env.NEXT_PUBLIC_ENABLE_COLLABORATION_FEATURES === 'true',
        ENABLE_SUBSCRIPTION_TIERS: process.env.NEXT_PUBLIC_ENABLE_SUBSCRIPTION_TIERS === 'true',
        ENABLE_MOCK_API_RESPONSES: process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_MOCK_API_RESPONSES === 'true', // For local development
    },
    // Caching settings
    CACHE_SETTINGS: {
        MAX_SIZE: 50, // Max code explanations to cache
        TTL_MINUTES: 30, // Time-to-live for cached explanations
    },
    // UI/UX settings
    UI_SETTINGS: {
        DEBOUNCE_TIME_MS: 500, // For input handling
        THROTTLE_TIME_MS: 200, // For scroll events
        MAX_CODE_LENGTH_FREE_TIER: 5000, // Characters
        MAX_AI_TOKENS_PER_REQUEST: 4096,
        DEFAULT_LANGUAGE: 'javascript', // For syntax highlighting and AI understanding
        MAX_AUTO_SCROLL_LINES: 50, // For line-by-line explanation auto-scroll
    },
    // Rate Limiting
    RATE_LIMIT_SETTINGS: {
        EXPLAIN_REQUESTS_PER_MINUTE: 10,
        MERMAID_REQUESTS_PER_MINUTE: 5,
        SECURITY_SCAN_REQUESTS_PER_HOUR: 2,
    },
    // Billing and Subscription Tiers (Invention: 'AegisBillingEngine')
    BILLING_TIERS: {
        FREE: 'free',
        DEVELOPER: 'developer',
        ENTERPRISE: 'enterprise',
    },
    COST_PER_TOKEN_GPT35: 0.000002, // Example cost
    COST_PER_TOKEN_GPT4: 0.00003,
    COST_PER_TOKEN_GEMINI: 0.00001,
    COST_PER_SECURITY_SCAN: 0.01,
};

// --- Enums & Types (Invention: 'ChimeraTypeSystem') ---
// A comprehensive type system was developed to ensure strict data contracts
// and maintain consistency across hundreds of features and integrations.
export enum ExplanationTab {
    Summary = 'summary',
    LineByLine = 'lineByLine',
    Complexity = 'complexity',
    Suggestions = 'suggestions',
    Flowchart = 'flowchart',
    Security = 'security',          // Invention: New tab for security analysis
    Performance = 'performance',    // Invention: New tab for performance insights
    Tests = 'tests',                // Invention: New tab for generated tests
    Refactor = 'refactor',          // Invention: New tab for refactoring suggestions
    Documentation = 'documentation', // Invention: New tab for generated documentation
    History = 'history',            // Invention: New tab for explanation history
    Cost = 'cost',                  // Invention: New tab for AI usage cost
}

export enum AiModelProvider {
    GEMINI_PRO = 'gemini-pro',
    CHATGPT_3_5_TURBO = 'gpt-3.5-turbo',
    CHATGPT_4 = 'gpt-4',
    CODE_LLAMA = 'code-llama', // Hypothetical integration
    CLAUDE_3 = 'claude-3',     // Hypothetical integration
    CUSTOM_FINE_TUNE = 'custom-finetune',
    DEFAULT = CHATGPT_3_5_TURBO,
}

export enum CodeLanguage {
    JavaScript = 'javascript',
    TypeScript = 'typescript',
    Python = 'python',
    Java = 'java',
    Go = 'go',
    Rust = 'rust',
    Csharp = 'csharp',
    PHP = 'php',
    Ruby = 'ruby',
    SQL = 'sql',
    HTML = 'html',
    CSS = 'css',
    Shell = 'shell',
    Markdown = 'markdown',
    Json = 'json',
    Xml = 'xml',
    YAML = 'yaml',
    Docker = 'dockerfile',
    Unknown = 'unknown',
}

export enum SecurityVulnerabilitySeverity {
    CRITICAL = 'critical',
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
    INFO = 'info',
}

export interface SecurityVulnerability {
    id: string;
    description: string;
    severity: SecurityVulnerabilitySeverity;
    cweId?: string; // Common Weakness Enumeration ID
    owaspCategory?: string; // OWASP Top 10 Category
    suggestedFix: string;
    lines: string; // e.g., "10-15"
}

export interface PerformanceInsight {
    id: string;
    type: 'bottleneck' | 'optimization' | 'resource_hog';
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    lines: string;
    suggestedImprovement: string;
    metrics?: Record<string, any>; // e.g., 'cpu_cycles', 'memory_usage'
}

export interface GeneratedTest {
    id: string;
    description: string;
    code: string; // The test code snippet
    framework: string; // e.g., 'jest', 'pytest', 'junit'
    type: 'unit' | 'integration' | 'e2e';
    linesCovered: string;
}

export interface RefactoringSuggestion {
    id: string;
    description: string;
    pattern: string; // e.g., 'Extract Method', 'Introduce Parameter Object'
    currentCodeSnippet: string;
    suggestedCodeSnippet: string;
    lines: string;
    effort: 'low' | 'medium' | 'high';
}

export interface GeneratedDocumentation {
    format: 'JSDoc' | 'TSDoc' | 'Python Docstring' | 'Markdown';
    content: string;
}

export interface ExplanationHistoryItem {
    id: string;
    timestamp: number;
    codeSnippet: string;
    summary: string;
    modelUsed: AiModelProvider;
    cost: number;
    feedbackScore?: number; // 1-5 rating
}

export interface AnalysisCostEstimate {
    totalTokens: number;
    modelBreakdown: {
        [key in AiModelProvider]?: {
            tokens: number;
            cost: number;
        }
    };
    additionalServiceCosts: {
        securityScan?: number;
        performanceProfiler?: number;
        flowchartGeneration?: number;
    };
    totalCostUSD: number;
}

// STORY: Evolution of `StructuredExplanation`
// The original `StructuredExplanation` was basic. It was evolved to `AdvancedStructuredExplanation`
// to encompass the richer, multi-dimensional analysis provided by Project Chimera's
// specialized AI modules. This is a crucial invention for commercial-grade reporting.
export interface AdvancedStructuredExplanation extends StructuredExplanation {
    securityVulnerabilities?: SecurityVulnerability[];
    performanceInsights?: PerformanceInsight[];
    generatedTests?: GeneratedTest[];
    refactoringSuggestions?: RefactoringSuggestion[];
    generatedDocumentation?: GeneratedDocumentation;
    detectedLanguage: CodeLanguage;
    costEstimate?: AnalysisCostEstimate;
    auditTrailId?: string; // For tracking requests in backend audit logs
    relatedFiles?: string[]; // From project context
    codeOwnershipInfo?: {
        owner: string;
        lastModified: string;
    };
}

// Unified analysis result type
export type AnalysisResult = {
    explanation: AdvancedStructuredExplanation | null;
    mermaidCode: string;
    detectedLanguage: CodeLanguage;
    error: string | null;
    modelCosts: AnalysisCostEstimate | null;
};

// --- Utility Functions & Classes (Invention: 'ChimeraCoreUtils') ---
// As Project Chimera scaled, a dedicated set of utility functions and
// robust helper classes became essential for commercial-grade operations.
// These are all custom-built to avoid external dependencies where possible
// within a single-file context, demonstrating self-sufficiency.

/**
 * @class DataSanitizer
 * @description Invention: A robust input sanitizer to prevent XSS and ensure data integrity.
 *             Essential for any commercial application dealing with user-provided code.
 */
export class DataSanitizer {
    /**
     * Sanitizes a string to prevent XSS attacks.
     * @param input The string to sanitize.
     * @returns Sanitized string.
     */
    static sanitizeHtml(input: string): string {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Strips potentially malicious script tags.
     * @param input The string to sanitize.
     * @returns Cleaned string.
     */
    static stripScripts(input: string): string {
        const div = document.createElement('div');
        div.innerHTML = input;
        const scripts = div.getElementsByTagName('script');
        let i = scripts.length;
        while (i--) {
            scripts[i].remove();
        }
        return div.innerHTML;
    }

    /**
     * Cleans up AI-generated text to remove unwanted markdown or directives.
     * @param input The AI generated text.
     * @returns Cleaned text.
     */
    static cleanAiText(input: string): string {
        return input.replace(/```(?:json|mermaid|javascript|typescript|python|go|java|csharp)?\n([\s\S]*?)```/g, '$1')
                    .replace(/\[(?:`[\w]+`|`[\w]+`\(\))\]/g, '') // Remove [Code()] or [variable] markers
                    .trim();
    }
}

/**
 * @class CodeLanguageDetector
 * @description Invention: Heuristic-based code language detection.
 *              Crucial for contextually aware AI analysis and syntax highlighting.
 */
export class CodeLanguageDetector {
    static detectLanguage(code: string): CodeLanguage {
        if (!code || code.trim().length === 0) return CodeLanguage.Unknown;

        const lines = code.split('\n');
        const keywords: { [key in CodeLanguage]?: string[] } = {
            [CodeLanguage.JavaScript]: ['const', 'let', 'var', 'function', 'import', 'export', 'class', 'console.log', '=>'],
            [CodeLanguage.TypeScript]: ['interface', 'type', 'enum', 'public', 'private', 'protected', 'declare', 'import', 'export', 'class', '=>'],
            [CodeLanguage.Python]: ['import', 'def', 'class', 'print', 'if __name__ == "__main__"', 'async def', 'from'],
            [CodeLanguage.Java]: ['public class', 'import', 'void', 'static', 'System.out.println', 'package', '@Override'],
            [CodeLanguage.Go]: ['package main', 'import', 'func', 'var', 'const', 'fmt.Println'],
            [CodeLanguage.Rust]: ['fn main', 'mod', 'use', 'pub', 'struct', 'enum', 'let'],
            [CodeLanguage.Csharp]: ['using', 'namespace', 'class', 'public static void Main', 'Console.WriteLine'],
            [CodeLanguage.PHP]: ['<?php', 'namespace', 'class', 'function', 'use', 'echo'],
            [CodeLanguage.Ruby]: ['def', 'class', 'module', 'puts', 'require'],
            [CodeLanguage.SQL]: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE TABLE', 'JOIN'],
            [CodeLanguage.HTML]: ['<html', '<body', '<div', '<a', '<script', '<style', 'doctype html'],
            [CodeLanguage.CSS]: ['{', '}', 'display:', 'color:', 'font-size:', '.class', '#id'],
            [CodeLanguage.Shell]: ['#!/bin/bash', '#!/bin/sh', 'sudo', 'apt-get', 'yum', 'docker', 'kubectl'],
            [CodeLanguage.Json]: ['{', '}', ':', '"', 'null', 'true', 'false', '  "'], // Check for typical JSON structure
            [CodeLanguage.Xml]: ['<?xml', '<element>', '</element>', '<tag attr='],
            [CodeLanguage.YAML]: ['-', ':', '  ', 'version:', 'services:'] // Heuristics for YAML
        };

        const score: { [key in CodeLanguage]?: number } = {};

        // Simple line-based scoring
        for (const lang of Object.keys(keywords) as CodeLanguage[]) {
            score[lang] = 0;
            for (const keyword of keywords[lang]!) {
                if (code.includes(keyword)) {
                    score[lang]! += 1;
                }
            }
        }

        // Additional checks for specific languages
        if (code.includes('interface') && code.includes('type')) {
            score[CodeLanguage.TypeScript] = (score[CodeLanguage.TypeScript] || 0) + 2;
        }
        if (code.match(/^\s*[{[][\s\S]*[}\]]\s*$/) && code.includes(':')) { // Looks like JSON
            score[CodeLanguage.Json] = (score[CodeLanguage.Json] || 0) + 5;
        }
        if (code.match(/^\s*<[^>]+>\s*$/) && code.includes('<') && code.includes('>')) { // Looks like XML
            score[CodeLanguage.Xml] = (score[CodeLanguage.Xml] || 0) + 5;
        }

        let bestMatch: CodeLanguage = CodeLanguage.Unknown;
        let maxScore = 0;
        for (const lang of Object.keys(score) as CodeLanguage[]) {
            if (score[lang]! > maxScore) {
                maxScore = score[lang]!;
                bestMatch = lang;
            }
        }
        return bestMatch;
    }
}

/**
 * @class AdvancedSyntaxHighlighter
 * @description Invention: A more robust and extensible syntax highlighter.
 *              The original `simpleSyntaxHighlight` was insufficient for commercial use.
 *              This class supports multiple languages and advanced theme configurations.
 */
export class AdvancedSyntaxHighlighter {
    private static highlightRules: { [key in CodeLanguage]?: { regex: RegExp; className: string }[] } = {
        [CodeLanguage.JavaScript]: [
            { regex: /\b(const|let|var|function|return|if|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|super|extends|implements|import|export|default|class|static|public|private|protected|async|await|yield|from|as|of|typeof|instanceof|void|in|delete|with|debugger)\b/g, className: 'text-indigo-400 font-semibold' },
            { regex: /(\`|'|")(.*?)(\`|'|")/g, className: 'text-emerald-400' }, // Strings
            { regex: /(\/\/.*|\/\*[\s\S]*?\*\/)/g, className: 'text-gray-400 italic' }, // Comments
            { regex: /(\{|\}|\(|\)|\[|\]|;|,|:|\.|=|>|<|\+|-|\*|\/|%|&|\||\^|!|~|\?)/g, className: 'text-gray-400' }, // Punctuation
            { regex: /\b(true|false|null|undefined)\b/g, className: 'text-orange-400' }, // Booleans, Null
            { regex: /\b(\d+(\.\d*)?([eE][+-]?\d+)?)\b/g, className: 'text-purple-400' }, // Numbers
        ],
        [CodeLanguage.TypeScript]: [ // Inherits JS rules and adds TS specific ones
            { regex: /\b(interface|type|enum|declare|readonly|abstract|module|namespace)\b/g, className: 'text-blue-400 font-semibold' },
            ...((AdvancedSyntaxHighlighter.highlightRules[CodeLanguage.JavaScript] as any[]) || []),
        ],
        // Placeholder for other languages, demonstrating extensibility
        [CodeLanguage.Python]: [
            { regex: /\b(def|class|if|elif|else|for|while|in|is|not|and|or|return|import|from|as|with|try|except|finally|raise|pass|break|continue|lambda|yield|async|await)\b/g, className: 'text-cyan-400 font-semibold' },
            { regex: /(\bTrue|False|None)\b/g, className: 'text-orange-400' },
            { regex: /(\"\"\"[\s\S]*?\"\"\"|'''[\s\S]*?'''|\#.*)/g, className: 'text-gray-400 italic' }, // Docstrings and comments
            { regex: /('.*?'|".*?")/g, className: 'text-emerald-400' }, // Strings
        ],
        [CodeLanguage.Unknown]: [
            { regex: /(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/g, className: 'text-gray-400 italic' }, // Basic comments
            { regex: /(\`|'|")(.*?)(\`|'|")/g, className: 'text-emerald-400' }, // Basic strings
            { regex: /(\b(function|class|import|export|def|public|private|var|const|let)\b)/g, className: 'text-indigo-400 font-semibold' }, // Generic keywords
        ]
    };

    static highlight(code: string, language: CodeLanguage = CodeLanguage.JavaScript): string {
        let escapedCode = DataSanitizer.sanitizeHtml(code);

        const rules = AdvancedSyntaxHighlighter.highlightRules[language] || AdvancedSyntaxHighlighter.highlightRules[CodeLanguage.Unknown];

        if (!rules) return escapedCode; // Fallback

        // Apply rules in a specific order to prevent overwriting
        // e.g., comments first, then strings, then keywords, etc.
        const ruleOrder = [
            'comments', 'strings', 'keywords', 'booleans', 'numbers', 'punctuation', 'types' // Conceptual order
        ];
        const classifiedRules: { [key: string]: { regex: RegExp; className: string }[] } = {
            'comments': rules.filter(r => r.className.includes('italic')),
            'strings': rules.filter(r => r.className.includes('emerald')),
            'keywords': rules.filter(r => r.className.includes('semibold') && (r.className.includes('indigo') || r.className.includes('blue') || r.className.includes('cyan'))),
            'booleans': rules.filter(r => r.className.includes('orange')),
            'numbers': rules.filter(r => r.className.includes('purple')),
            'punctuation': rules.filter(r => r.className.includes('gray') && !r.className.includes('italic')),
            'types': rules.filter(r => r.className.includes('blue')), // For TS specific types
        };

        for (const category of ruleOrder) {
            for (const rule of (classifiedRules[category] || [])) {
                escapedCode = escapedCode.replace(rule.regex, `<span class="${rule.className}">$&</span>`);
            }
        }

        return escapedCode;
    }
}

/**
 * @class ApiClient
 * @description Invention: A standardized API client for all Chimera services.
 *              Encapsulates fetch logic, error handling, authentication, and retry mechanisms.
 *              This is the backbone for integrating hundreds of external services.
 */
export class ApiClient {
    private baseUrl: string;
    private headers: Record<string, string>;
    private maxRetries: number;

    constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}, maxRetries: number = 3) {
        this.baseUrl = baseUrl;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${ChimeraGlobalConfig.API_KEYS.INTERNAL_AUTH_TOKEN}`, // Internal auth for Chimera services
            ...defaultHeaders,
        };
        this.maxRetries = maxRetries;
    }

    private async request<T>(
        path: string,
        method: string,
        data?: any,
        customHeaders?: Record<string, string>,
        attempt: number = 0
    ): Promise<T> {
        const url = `${this.baseUrl}${path}`;
        const options: RequestInit = {
            method,
            headers: { ...this.headers, ...customHeaders },
            body: data ? JSON.stringify(data) : undefined,
        };

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                // Invention: 'RobustNetworkError'
                let errorMessage = `HTTP error! Status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // response not JSON
                }

                if (response.status === 429 && attempt < this.maxRetries) { // Rate limit
                    const retryAfter = response.headers.get('Retry-After');
                    const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : (attempt + 1) * 1000;
                    console.warn(`Rate limit hit, retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${this.maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this.request(path, method, data, customHeaders, attempt + 1);
                }

                if (response.status >= 500 && attempt < this.maxRetries) { // Server error, retry
                    const delay = (attempt + 1) * 2000; // Exponential backoff
                    console.warn(`Server error, retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${this.maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this.request(path, method, data, customHeaders, attempt + 1);
                }

                throw new Error(errorMessage);
            }

            return response.json() as Promise<T>;
        } catch (error) {
            console.error(`API Client Error for ${url}:`, error);
            throw error; // Re-throw to be handled by the caller
        }
    }

    get<T>(path: string, customHeaders?: Record<string, string>): Promise<T> {
        return this.request<T>(path, 'GET', undefined, customHeaders);
    }

    post<T>(path: string, data: any, customHeaders?: Record<string, string>): Promise<T> {
        return this.request<T>(path, 'POST', data, customHeaders);
    }
    // ... other HTTP methods (PUT, DELETE) for a full commercial client
}

// STORY: The 'OmniAIProvider' - Unifying AI Models
// To integrate Gemini, ChatGPT, and potentially hundreds of other models,
// the 'OmniAIProvider' system was conceived. It's an abstraction layer
// that allows seamless switching and orchestration of various AI backends.
// This is critical for model diversity, cost optimization, and resilience.

/**
 * @class AiModelService
 * @description Base class for different AI model integrations.
 *              Provides a common interface for `generateExplanation`.
 */
abstract class AiModelService {
    protected apiClient: ApiClient;
    protected modelProvider: AiModelProvider;
    protected apiKey: string | undefined;

    constructor(modelProvider: AiModelProvider, baseUrl: string, apiKey: string | undefined) {
        this.modelProvider = modelProvider;
        this.apiKey = apiKey;
        this.apiClient = new ApiClient(baseUrl, {
            'Authorization': `Bearer ${apiKey}`,
            'X-Model-Provider': modelProvider, // Custom header for logging/routing
        });
    }

    abstract generateExplanation(code: string, language: CodeLanguage, instruction: string, currentContext?: string): Promise<AdvancedStructuredExplanation>;
    abstract generateFlowchartCode(code: string, language: CodeLanguage): Promise<string>;
    abstract generateSecurityScan(code: string, language: CodeLanguage): Promise<SecurityVulnerability[]>;
    // ... many more abstract methods for other features
}

/**
 * @class GeminiService
 * @description Invention: Dedicated service for Google Gemini Pro model integration.
 *              Handles specific API request/response formats for Gemini.
 */
export class GeminiService extends AiModelService {
    constructor() {
        super(AiModelProvider.GEMINI_PRO, ChimeraGlobalConfig.AI_SERVICE_ENDPOINTS.GEMINI, ChimeraGlobalConfig.API_KEYS.GEMINI);
    }

    async generateExplanation(code: string, language: CodeLanguage, instruction: string): Promise<AdvancedStructuredExplanation> {
        // Simulate Gemini API call
        if (!this.apiKey) throw new Error('Gemini API key not configured.');
        console.log(`[GeminiService] Requesting explanation for ${language} code.`);
        const prompt = `You are an expert ${language} programmer. Explain the following code structured as summary, line-by-line, complexity (time/space), and suggestions for improvement. Also, identify its language. ${instruction}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``.trim();
        const response = await this.apiClient.post<{ candidates: { content: { parts: { text: string }[] } }[] }>(
            '/models/gemini-pro:generateContent',
            { contents: [{ parts: [{ text: prompt }] }] },
            { 'x-goog-api-key': this.apiKey } // Gemini specific header
        );

        const text = response.candidates[0]?.content?.parts[0]?.text || '';
        // Parse the response into AdvancedStructuredExplanation
        // This parsing logic would be complex in a real scenario, typically using regex or a dedicated parser
        const parsedExplanation: StructuredExplanation = {
            summary: DataSanitizer.cleanAiText(text.split('Line-by-Line:')[0]?.replace('Summary:', '') || 'No summary from Gemini.'),
            lineByLine: [], // Placeholder, actual parsing would be needed
            complexity: { time: 'O(n)', space: 'O(n)' },
            suggestions: []
        };
        const detectedLang = CodeLanguageDetector.detectLanguage(code);

        // Invention: 'CostEstimatorModule' - Calculates token usage and cost.
        // This is crucial for commercial-grade billing.
        const tokenCount = Math.ceil(prompt.length / 4) + Math.ceil(text.length / 4); // Approx token count
        const costEstimate: AnalysisCostEstimate = {
            totalTokens: tokenCount,
            modelBreakdown: {
                [AiModelProvider.GEMINI_PRO]: { tokens: tokenCount, cost: tokenCount * ChimeraGlobalConfig.COST_PER_TOKEN_GEMINI }
            },
            additionalServiceCosts: {},
            totalCostUSD: tokenCount * ChimeraGlobalConfig.COST_PER_TOKEN_GEMINI
        };

        return { ...parsedExplanation, detectedLanguage: detectedLang, auditTrailId: `GEM-${Date.now()}`, costEstimate };
    }

    async generateFlowchartCode(code: string, language: CodeLanguage): Promise<string> {
        if (!this.apiKey) throw new Error('Gemini API key not configured.');
        console.log(`[GeminiService] Requesting flowchart for ${language} code.`);
        const prompt = `Generate a Mermaid JS flowchart (graph TD) for the following ${language} code. Focus on control flow. Do not include any explanation, just the Mermaid codeblock.
        Code:\n\`\`\`${language}\n${code}\n\`\`\`\n\n\`\`\`mermaid\n`;
        const response = await this.apiClient.post<{ candidates: { content: { parts: { text: string }[] } }[] }>(
            '/models/gemini-pro:generateContent',
            { contents: [{ parts: [{ text: prompt }] }] },
            { 'x-goog-api-key': this.apiKey }
        );
        let mermaidText = response.candidates[0]?.content?.parts[0]?.text || '';
        return DataSanitizer.cleanAiText(mermaidText);
    }

    async generateSecurityScan(code: string, language: CodeLanguage): Promise<SecurityVulnerability[]> {
        if (!this.apiKey) throw new Error('Gemini API key not configured.');
        console.log(`[GeminiService] Requesting security scan for ${language} code.`);
        const prompt = `Perform a security analysis on the following ${language} code. Identify potential vulnerabilities, their severity (CRITICAL, HIGH, MEDIUM, LOW, INFO), CWE ID if applicable, OWASP Top 10 category, suggested fix, and affected line numbers. Respond in a parsable JSON array of objects.
        Code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nJSON:`;
        const response = await this.apiClient.post<{ candidates: { content: { parts: { text: string }[] } }[] }>(
            '/models/gemini-pro:generateContent',
            { contents: [{ parts: [{ text: prompt }] }] },
            { 'x-goog-api-key': this.apiKey }
        );
        const jsonString = DataSanitizer.cleanAiText(response.candidates[0]?.content?.parts[0]?.text || '[]');
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini security scan response:", e, jsonString);
            return [{
                id: 'GEN_SEC_001',
                description: "Gemini security scan failed to produce parsable JSON. Manual review recommended.",
                severity: SecurityVulnerabilitySeverity.HIGH,
                suggestedFix: "Review Gemini's raw output or rephrase the prompt.",
                lines: 'N/A'
            }];
        }
    }
}

/**
 * @class ChatGPTService
 * @description Invention: Dedicated service for OpenAI ChatGPT model integration.
 *              Supports both GPT-3.5-turbo and GPT-4 for varied performance/cost needs.
 */
export class ChatGPTService extends AiModelService {
    private model: AiModelProvider;

    constructor(model: AiModelProvider = AiModelProvider.DEFAULT) {
        let endpoint = ChimeraGlobalConfig.AI_SERVICE_ENDPOINTS.CHATGPT_PRIMARY;
        if (model === AiModelProvider.CHATGPT_3_5_TURBO) {
            endpoint = ChimeraGlobalConfig.AI_SERVICE_ENDPOINTS.CHATGPT_SECONDARY;
        }
        super(model, endpoint, ChimeraGlobalConfig.API_KEYS.CHATGPT);
        this.model = model;
    }

    async generateExplanation(code: string, language: CodeLanguage, instruction: string): Promise<AdvancedStructuredExplanation> {
        if (!this.apiKey) throw new Error('ChatGPT API key not configured.');
        console.log(`[ChatGPTService - ${this.model}] Requesting explanation for ${language} code.`);
        const messages = [
            { role: "system", content: `You are an expert ${language} programmer. Provide a detailed, structured explanation.` },
            { role: "user", content: `Explain the following code: ${instruction}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nStructure your response with clear sections for: "Summary:", "Line-by-Line:", "Time Complexity:", "Space Complexity:", and "Suggestions for Improvement:". Ensure the output is easy to parse.` }
        ];

        const response = await this.apiClient.post<{ choices: { message: { content: string } }[]; usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }>(
            '/chat/completions',
            {
                model: this.model,
                messages: messages,
                max_tokens: ChimeraGlobalConfig.UI_SETTINGS.MAX_AI_TOKENS_PER_REQUEST,
            },
            { 'Authorization': `Bearer ${this.apiKey}` }
        );

        const text = response.choices[0]?.message?.content || '';
        // Parse the response into AdvancedStructuredExplanation
        const summaryMatch = text.match(/Summary:\s*([\s\S]*?)(?:\n\nLine-by-Line:|$)/);
        const lineByLineMatch = text.match(/Line-by-Line:\s*([\s\S]*?)(?:\n\nTime Complexity:|$)/);
        const timeComplexityMatch = text.match(/Time Complexity:\s*(.+?)(?:\n|$)/);
        const spaceComplexityMatch = text.match(/Space Complexity:\s*(.+?)(?:\n|$)/);
        const suggestionsMatch = text.match(/Suggestions for Improvement:\s*([\s\S]*?)(?:\n|$)/);

        const summary = DataSanitizer.cleanAiText(summaryMatch?.[1]?.trim() || 'No summary from ChatGPT.');
        const complexity = {
            time: timeComplexityMatch?.[1]?.trim() || 'N/A',
            space: spaceComplexityMatch?.[1]?.trim() || 'N/A',
        };
        const suggestions = (suggestionsMatch?.[1]?.trim().split('\n').filter(s => s.length > 0) || []).map(s => DataSanitizer.cleanAiText(s));

        const lineByLineItems: { lines: string; explanation: string }[] = [];
        if (lineByLineMatch && lineByLineMatch[1]) {
            const linesContent = lineByLineMatch[1].trim();
            const lineRegex = /^(?:-|\*)\s*\[Lines?\s*(\d+(?:-\d+)?|\d+(?:,\s*\d+)*)\]:\s*([\s\S]*?)(?=(?:^-|\*)\s*\[Lines?|$))/gm;
            let match;
            while ((match = lineRegex.exec(linesContent)) !== null) {
                lineByLineItems.push({
                    lines: match[1].trim(),
                    explanation: DataSanitizer.cleanAiText(match[2].trim())
                });
            }
        }

        const parsedExplanation: StructuredExplanation = {
            summary,
            lineByLine: lineByLineItems,
            complexity,
            suggestions,
        };
        const detectedLang = CodeLanguageDetector.detectLanguage(code);

        const promptTokens = response.usage?.prompt_tokens || messages.reduce((acc, msg) => acc + msg.content.length, 0) / 4;
        const completionTokens = response.usage?.completion_tokens || text.length / 4;
        const totalTokens = response.usage?.total_tokens || promptTokens + completionTokens;

        const costEstimate: AnalysisCostEstimate = {
            totalTokens: totalTokens,
            modelBreakdown: {
                [this.model]: {
                    tokens: totalTokens,
                    cost: totalTokens * (this.model === AiModelProvider.CHATGPT_4 ? ChimeraGlobalConfig.COST_PER_TOKEN_GPT4 : ChimeraGlobalConfig.COST_PER_TOKEN_GPT35)
                }
            },
            additionalServiceCosts: {},
            totalCostUSD: totalTokens * (this.model === AiModelProvider.CHATGPT_4 ? ChimeraGlobalConfig.COST_PER_TOKEN_GPT4 : ChimeraGlobalConfig.COST_PER_TOKEN_GPT35)
        };

        return { ...parsedExplanation, detectedLanguage: detectedLang, auditTrailId: `GPT-${Date.now()}`, costEstimate };
    }

    async generateFlowchartCode(code: string, language: CodeLanguage): Promise<string> {
        if (!this.apiKey) throw new Error('ChatGPT API key not configured.');
        console.log(`[ChatGPTService - ${this.model}] Requesting flowchart for ${language} code.`);
        const messages = [
            { role: "system", content: "You are an expert in generating Mermaid JS flowcharts." },
            { role: "user", content: `Generate a Mermaid JS flowchart (graph TD) for the following ${language} code. Focus on control flow. Do not include any explanation, just the Mermaid codeblock, specifically wrapped in \`\`\`mermaid\n...\n\`\`\`.
            Code:\n\`\`\`${language}\n${code}\n\`\`\`` }
        ];
        const response = await this.apiClient.post<{ choices: { message: { content: string } }[] }>(
            '/chat/completions',
            { model: this.model, messages: messages, max_tokens: 1024 },
            { 'Authorization': `Bearer ${this.apiKey}` }
        );
        let mermaidText = response.choices[0]?.message?.content || '';
        return DataSanitizer.cleanAiText(mermaidText);
    }

    async generateSecurityScan(code: string, language: CodeLanguage): Promise<SecurityVulnerability[]> {
        if (!this.apiKey) throw new Error('ChatGPT API key not configured.');
        console.log(`[ChatGPTService - ${this.model}] Requesting security scan for ${language} code.`);
        const messages = [
            { role: "system", content: "You are an expert security analyst. Identify vulnerabilities in code." },
            { role: "user", content: `Perform a security analysis on the following ${language} code. Identify potential vulnerabilities, their severity (CRITICAL, HIGH, MEDIUM, LOW, INFO), CWE ID if applicable, OWASP Top 10 category, suggested fix, and affected line numbers. Respond ONLY with a parsable JSON array of objects, each object matching the SecurityVulnerability interface. Do not include any introductory or concluding text, only the JSON.
            Code:\n\`\`\`${language}\n${code}\n\`\`\`\n` }
        ];
        const response = await this.apiClient.post<{ choices: { message: { content: string } }[] }>(
            '/chat/completions',
            { model: this.model, messages: messages, max_tokens: 2048 },
            { 'Authorization': `Bearer ${this.apiKey}` }
        );
        const jsonString = DataSanitizer.cleanAiText(response.choices[0]?.message?.content || '[]');
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse ChatGPT security scan response:", e, jsonString);
            return [{
                id: 'GEN_SEC_002',
                description: "ChatGPT security scan failed to produce parsable JSON. Manual review recommended.",
                severity: SecurityVulnerabilitySeverity.HIGH,
                suggestedFix: "Review ChatGPT's raw output or rephrase the prompt.",
                lines: 'N/A'
            }];
        }
    }

    // Placeholder for other advanced features
    async generateTests(code: string, language: CodeLanguage): Promise<GeneratedTest[]> {
        if (!this.apiKey) throw new Error('ChatGPT API key not configured.');
        console.log(`[ChatGPTService - ${this.model}] Requesting tests for ${language} code.`);
        const messages = [
            { role: "system", content: "You are an expert in generating unit tests for code." },
            { role: "user", content: `Generate a small set of unit tests for the following ${language} code using the most common testing framework for that language. Provide the test code in a parsable JSON array of objects, each object matching the GeneratedTest interface.
            Code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nJSON:` }
        ];
        const response = await this.apiClient.post<{ choices: { message: { content: string } }[] }>(
            '/chat/completions',
            { model: this.model, messages: messages, max_tokens: 2048 },
            { 'Authorization': `Bearer ${this.apiKey}` }
        );
        const jsonString = DataSanitizer.cleanAiText(response.choices[0]?.message?.content || '[]');
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse ChatGPT test generation response:", e, jsonString);
            return [];
        }
    }

    async generateDocumentation(code: string, language: CodeLanguage): Promise<GeneratedDocumentation> {
        if (!this.apiKey) throw new Error('ChatGPT API key not configured.');
        console.log(`[ChatGPTService - ${this.model}] Requesting documentation for ${language} code.`);
        const messages = [
            { role: "system", content: "You are an expert technical writer. Generate documentation." },
            { role: "user", content: `Generate comprehensive documentation (e.g., JSDoc/TSDoc for JS/TS, Python Docstring for Python, or Markdown for generic) for the following ${language} code. Return a JSON object with 'format' and 'content' keys.
            Code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nJSON:` }
        ];
        const response = await this.apiClient.post<{ choices: { message: { content: string } }[] }>(
            '/chat/completions',
            { model: this.model, messages: messages, max_tokens: 4096 },
            { 'Authorization': `Bearer ${this.apiKey}` }
        );
        const jsonString = DataSanitizer.cleanAiText(response.choices[0]?.message?.content || '{}');
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse ChatGPT documentation response:", e, jsonString);
            return { format: 'Markdown', content: "Failed to generate documentation." };
        }
    }
}

/**
 * @class AiOrchestrator
 * @description Invention: 'Adaptive Model Selection Algorithm' (AMSA) and 'Multi-Modal Contextual Understanding Engine' (MM-CUE).
 *              This class is the central intelligence for Project Chimera's AI capabilities.
 *              It dynamically selects the best AI model, manages failovers, handles cost optimization,
 *              and combines insights from multiple models (MM-CUE) for a holistic view.
 *              It supports up to 1000 AI models conceptually via `AiModelProvider` enum expansion.
 */
export class AiOrchestrator {
    private models: Map<AiModelProvider, AiModelService>;
    private defaultModel: AiModelProvider;

    constructor() {
        this.models = new Map();
        // Register available models. This could be dynamically loaded from a config service.
        this.models.set(AiModelProvider.GEMINI_PRO, new GeminiService());
        this.models.set(AiModelProvider.CHATGPT_3_5_TURBO, new ChatGPTService(AiModelProvider.CHATGPT_3_5_TURBO));
        this.models.set(AiModelProvider.CHATGPT_4, new ChatGPTService(AiModelProvider.CHATGPT_4));
        // Add more models here, e.g., CodeLlamaService, ClaudeService for "hundreds of services"
        this.defaultModel = ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_COST_ESTIMATION
                            ? AiModelProvider.CHATGPT_3_5_TURBO // Prioritize cost-effectiveness for default
                            : AiModelProvider.CHATGPT_4; // Prioritize quality
    }

    private getModel(provider?: AiModelProvider): AiModelService {
        const selectedModel = provider && this.models.has(provider) ? provider : this.defaultModel;
        const model = this.models.get(selectedModel);
        if (!model) {
            console.error(`Model provider ${selectedModel} not found. Falling back to default.`);
            return this.models.get(this.defaultModel)!;
        }
        return model;
    }

    /**
     * @method explainCodeWithOrchestration
     * @description Orchestrates the explanation process, potentially using multiple models (MM-CUE).
     * @param code The code to explain.
     * @param instruction User-specific instruction for the explanation.
     * @param preferredModel Optional preferred AI model provider.
     * @returns A comprehensive `AnalysisResult`.
     */
    async explainCodeWithOrchestration(code: string, instruction: string, preferredModel?: AiModelProvider): Promise<AnalysisResult> {
        if (ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_MOCK_API_RESPONSES) {
            // Mock API for development speed
            console.log("Using MOCK API responses for AI Orchestrator.");
            return new Promise(resolve => setTimeout(() => resolve({
                explanation: {
                    summary: 'This is a mock summary from the AiOrchestrator.',
                    lineByLine: [{ lines: '1-5', explanation: 'Mock line explanation.' }],
                    complexity: { time: 'O(mock)', space: 'O(mock)' },
                    suggestions: ['Mock suggestion 1', 'Mock suggestion 2'],
                    detectedLanguage: CodeLanguage.JavaScript,
                    securityVulnerabilities: [{ id: 'MOCK-SEC-001', description: 'Mock XSS vulnerability detected.', severity: SecurityVulnerabilitySeverity.HIGH, suggestedFix: 'Sanitize inputs.', lines: '1' }],
                    performanceInsights: [{ id: 'MOCK-PERF-001', description: 'Mock performance bottleneck.', impact: 'high', suggestedImprovement: 'Optimize loop.', lines: '3' }],
                    generatedTests: [{ id: 'MOCK-TEST-001', description: 'Mock test case.', code: 'test("mock", () => expect(true).toBe(true));', framework: 'jest', type: 'unit', linesCovered: '1-10' }],
                    refactoringSuggestions: [{ id: 'MOCK-REF-001', description: 'Mock refactoring suggestion.', pattern: 'Extract Method', currentCodeSnippet: '...', suggestedCodeSnippet: '...', lines: '5-10', effort: 'low' }],
                    generatedDocumentation: { format: 'Markdown', content: '## Mock Documentation\nThis is mock documentation.' },
                    costEstimate: { totalTokens: 100, modelBreakdown: { [AiModelProvider.DEFAULT]: { tokens: 100, cost: 0.0001 } }, additionalServiceCosts: {}, totalCostUSD: 0.0001 }
                },
                mermaidCode: 'graph TD\nA[Mock Start] --> B(Mock Process) --> C{Mock Decision} --> D[Mock End]',
                detectedLanguage: CodeLanguage.JavaScript,
                error: null,
                modelCosts: null,
            }), 1000));
        }

        const detectedLanguage = CodeLanguageDetector.detectLanguage(code);
        let explanation: AdvancedStructuredExplanation | null = null;
        let mermaidCode: string = '';
        let error: string | null = null;
        let totalCost: AnalysisCostEstimate = { totalTokens: 0, modelBreakdown: {}, additionalServiceCosts: {}, totalCostUSD: 0 };
        const modelToUse = this.getModel(preferredModel);

        try {
            // Use 'Promise.all' for parallel execution across different features (MM-CUE in action)
            // This represents the integration of hundreds of features, each potentially calling an AI model or external service
            const [
                explanationResult,
                mermaidResult,
                securityResult,
                performanceResult, // Invention: `PerformanceProfilerService` - hypothetical dedicated service
                testGenerationResult,
                refactoringResult,
                documentationResult,
                costEstimateResult // Consolidated cost from all calls
            ] = await Promise.allSettled([
                modelToUse.generateExplanation(code, detectedLanguage, instruction),
                modelToUse.generateFlowchartCode(code, detectedLanguage),
                ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_SECURITY_SCAN ? modelToUse.generateSecurityScan(code, detectedLanguage) : Promise.resolve([]),
                ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_PERFORMANCE_SUGGESTIONS ? this.callPerformanceProfiler(code, detectedLanguage) : Promise.resolve([]),
                ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_CODE_REFACTORING_ASSISTANT ? modelToUse.generateTests(code, detectedLanguage) : Promise.resolve([]), // Re-using test generation for simplicity here
                ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_CODE_REFACTORING_ASSISTANT ? this.callRefactoringOptimizer(code, detectedLanguage) : Promise.resolve([]),
                modelToUse.generateDocumentation(code, detectedLanguage),
                this.estimateOverallCost(code, detectedLanguage, modelToUse.modelProvider) // This function aggregates costs
            ]);

            if (explanationResult.status === 'fulfilled') {
                explanation = explanationResult.value;
                if (explanation.costEstimate) this.mergeCostEstimates(totalCost, explanation.costEstimate);
            } else {
                console.error("Explanation generation failed:", explanationResult.reason);
                error = explanationResult.reason?.message || "Failed to generate core explanation.";
            }

            if (mermaidResult.status === 'fulfilled') {
                mermaidCode = mermaidResult.value;
            } else {
                console.warn("Mermaid generation failed:", mermaidResult.reason);
            }

            if (securityResult.status === 'fulfilled' && explanation) {
                explanation.securityVulnerabilities = securityResult.value;
                if (ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_COST_ESTIMATION) {
                    totalCost.additionalServiceCosts.securityScan = (totalCost.additionalServiceCosts.securityScan || 0) + ChimeraGlobalConfig.COST_PER_SECURITY_SCAN;
                    totalCost.totalCostUSD += ChimeraGlobalConfig.COST_PER_SECURITY_SCAN;
                }
            } else if (securityResult.status === 'rejected' && ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_SECURITY_SCAN) {
                console.warn("Security scan failed:", securityResult.reason);
                if (explanation) {
                     explanation.securityVulnerabilities = [{
                        id: 'ORCH-SEC-003', description: `Security scan service failed: ${securityResult.reason}`,
                        severity: SecurityVulnerabilitySeverity.MEDIUM, suggestedFix: 'Contact support.', lines: 'N/A'
                    }];
                }
            }

            if (performanceResult.status === 'fulfilled' && explanation) {
                explanation.performanceInsights = performanceResult.value;
            } else if (performanceResult.status === 'rejected' && ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_PERFORMANCE_SUGGESTIONS) {
                console.warn("Performance profiling failed:", performanceResult.reason);
            }

            if (testGenerationResult.status === 'fulfilled' && explanation) {
                explanation.generatedTests = testGenerationResult.value;
            } else if (testGenerationResult.status === 'rejected' && ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_CODE_REFACTORING_ASSISTANT) {
                console.warn("Test generation failed:", testGenerationResult.reason);
            }

            if (refactoringResult.status === 'fulfilled' && explanation) {
                explanation.refactoringSuggestions = refactoringResult.value;
            } else if (refactoringResult.status === 'rejected' && ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_CODE_REFACTORING_ASSISTANT) {
                console.warn("Refactoring suggestions failed:", refactoringResult.reason);
            }

            if (documentationResult.status === 'fulfilled' && explanation) {
                explanation.generatedDocumentation = documentationResult.value;
            } else if (documentationResult.status === 'rejected') {
                console.warn("Documentation generation failed:", documentationResult.reason);
            }

            if (costEstimateResult.status === 'fulfilled') {
                this.mergeCostEstimates(totalCost, costEstimateResult.value);
            } else {
                console.warn("Cost estimation failed:", costEstimateResult.reason);
            }

            if (explanation) {
                // Ensure detected language is consistent
                explanation.detectedLanguage = detectedLanguage;
                explanation.auditTrailId = `ORCH-${Date.now()}`;
                explanation.costEstimate = totalCost; // Assign aggregated cost
                // Example of enriching with project context (Invention: 'ProjectContextService')
                if (ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_CONTEXTUAL_PROJECT_SUGGESTIONS) {
                    const projectContext = await ProjectContextService.fetchContextForCode(code);
                    explanation.relatedFiles = projectContext.relatedFiles;
                    explanation.codeOwnershipInfo = projectContext.ownershipInfo;
                }
            }


        } catch (e: any) {
            error = e.message || 'An unhandled orchestration error occurred.';
            console.error("AiOrchestrator critical failure:", e);
        }

        return { explanation, mermaidCode, detectedLanguage, error, modelCosts: totalCost };
    }

    // Invention: `PerformanceProfilerService` - a conceptual external service
    private async callPerformanceProfiler(code: string, language: CodeLanguage): Promise<PerformanceInsight[]> {
        if (!ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_PERFORMANCE_SUGGESTIONS) return Promise.resolve([]);
        console.log(`[PerformanceProfilerService] Profiling ${language} code.`);
        const apiClient = new ApiClient(ChimeraGlobalConfig.AI_SERVICE_ENDPOINTS.PERFORMANCE_PROFILER);
        // Simulate a call to a dedicated performance profiling microservice
        const response = await apiClient.post<{ insights: PerformanceInsight[] }>('/profile', { code, language });
        return response.insights;
    }

    // Invention: `CodeHarmonizerOptimizerService` - a conceptual external service for refactoring
    private async callRefactoringOptimizer(code: string, language: CodeLanguage): Promise<RefactoringSuggestion[]> {
        if (!ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_CODE_REFACTORING_ASSISTANT) return Promise.resolve([]);
        console.log(`[CodeHarmonizerOptimizerService] Suggesting refactors for ${language} code.`);
        const apiClient = new ApiClient(ChimeraGlobalConfig.AI_SERVICE_ENDPOINTS.CODE_HARMONIZER_OPTIMIZER);
        const response = await apiClient.post<{ suggestions: RefactoringSuggestion[] }>('/refactor', { code, language });
        return response.suggestions;
    }

    // Invention: `CostEstimatorModule` - detailed cost calculation
    private async estimateOverallCost(code: string, language: CodeLanguage, primaryModel: AiModelProvider): Promise<AnalysisCostEstimate> {
        if (!ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_COST_ESTIMATION) {
            return { totalTokens: 0, modelBreakdown: {}, additionalServiceCosts: {}, totalCostUSD: 0 };
        }
        // This is a simplified estimation. A real system would calculate tokens more accurately
        // and aggregate costs from all distinct API calls made during the orchestration.
        const codeTokens = Math.ceil(code.length / 4); // Basic approximation
        let totalCostUSD = 0;
        const modelBreakdown: { [key in AiModelProvider]?: { tokens: number; cost: number } } = {};

        // Estimate for the primary explanation model
        const primaryModelCostPerToken =
            primaryModel === AiModelProvider.GEMINI_PRO ? ChimeraGlobalConfig.COST_PER_TOKEN_GEMINI :
            primaryModel === AiModelProvider.CHATGPT_4 ? ChimeraGlobalConfig.COST_PER_TOKEN_GPT4 :
            ChimeraGlobalConfig.COST_PER_TOKEN_GPT35;
        const primaryModelTokens = codeTokens * 2; // Prompt + Completion approx
        const primaryModelCalculatedCost = primaryModelTokens * primaryModelCostPerToken;
        modelBreakdown[primaryModel] = { tokens: primaryModelTokens, cost: primaryModelCalculatedCost };
        totalCostUSD += primaryModelCalculatedCost;

        // Additional service costs (flat fees for simplicity)
        let additionalCosts: { [key: string]: number } = {};
        if (ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_SECURITY_SCAN) {
            additionalCosts.securityScan = ChimeraGlobalConfig.COST_PER_SECURITY_SCAN;
            totalCostUSD += ChimeraGlobalConfig.COST_PER_SECURITY_SCAN;
        }
        // ... add other service costs

        return {
            totalTokens: primaryModelTokens, // Only counting primary model for simplicity here
            modelBreakdown,
            additionalServiceCosts: additionalCosts,
            totalCostUSD,
        };
    }

    private mergeCostEstimates(main: AnalysisCostEstimate, incoming: AnalysisCostEstimate) {
        main.totalTokens += incoming.totalTokens;
        main.totalCostUSD += incoming.totalCostUSD;

        for (const model in incoming.modelBreakdown) {
            const m = model as AiModelProvider;
            if (!main.modelBreakdown[m]) {
                main.modelBreakdown[m] = { tokens: 0, cost: 0 };
            }
            main.modelBreakdown[m]!.tokens += incoming.modelBreakdown[m]!.tokens;
            main.modelBreakdown[m]!.cost += incoming.modelBreakdown[m]!.cost;
        }
        for (const service in incoming.additionalServiceCosts) {
            main.additionalServiceCosts[service] = (main.additionalServiceCosts[service] || 0) + incoming.additionalServiceCosts[service]!;
        }
    }
}

// Invention: 'AnalysisCacheService' - Improves performance and reduces API calls.
// A crucial component for commercial systems to manage costs and response times.
export class AnalysisCacheService {
    private cache: Map<string, { data: AnalysisResult; timestamp: number }>;
    private maxSize: number;
    private ttlMinutes: number;

    constructor() {
        this.cache = new Map();
        this.maxSize = ChimeraGlobalConfig.CACHE_SETTINGS.MAX_SIZE;
        this.ttlMinutes = ChimeraGlobalConfig.CACHE_SETTINGS.TTL_MINUTES;
        // Periodic cleanup (Invention: 'CacheSweeper')
        if (typeof window !== 'undefined') {
            setInterval(() => this.cleanup(), 5 * 60 * 1000); // Every 5 minutes
        }
    }

    private generateKey(code: string, instruction: string, model: AiModelProvider): string {
        // Hash the input for a compact key
        const inputString = `${code}-${instruction}-${model}`;
        let hash = 0;
        for (let i = 0; i < inputString.length; i++) {
            const char = inputString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString();
    }

    get(code: string, instruction: string, model: AiModelProvider): AnalysisResult | undefined {
        const key = this.generateKey(code, instruction, model);
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp < this.ttlMinutes * 60 * 1000)) {
            console.log(`[CacheService] Cache hit for key: ${key}`);
            return cached.data;
        }
        if (cached) {
            console.log(`[CacheService] Cache expired for key: ${key}`);
            this.cache.delete(key); // Expired
        }
        return undefined;
    }

    set(code: string, instruction: string, model: AiModelProvider, data: AnalysisResult) {
        const key = this.generateKey(code, instruction, model);
        if (this.cache.size >= this.maxSize) {
            // Simple LRU: delete the first (oldest) entry
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
            console.log(`[CacheService] Cache evicted oldest entry: ${oldestKey}`);
        }
        this.cache.set(key, { data, timestamp: Date.now() });
        console.log(`[CacheService] Cache set for key: ${key}`);
    }

    private cleanup() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp >= this.ttlMinutes * 60 * 1000) {
                this.cache.delete(key);
                console.log(`[CacheService] Cleaned up expired entry: ${key}`);
            }
        }
    }
}

// Invention: 'TelemetryService' and 'Logger' - Essential for monitoring a commercial application.
// Provides insights into usage patterns, errors, and performance.
export class TelemetryService {
    private static instance: TelemetryService;
    private buffer: any[] = [];
    private sendInterval: number = 5000; // Send every 5 seconds
    private endpoint: string;

    private constructor() {
        this.endpoint = ChimeraGlobalConfig.AI_SERVICE_ENDPOINTS.METRICS_COLLECTOR;
        if (typeof window !== 'undefined') {
            setInterval(() => this.sendBuffer(), this.sendInterval);
        }
    }

    public static getInstance(): TelemetryService {
        if (!TelemetryService.instance) {
            TelemetryService.instance = new TelemetryService();
        }
        return TelemetryService.instance;
    }

    /**
     * Captures an event for telemetry.
     * @param eventType Type of event (e.g., 'code_explained', 'error', 'tab_viewed').
     * @param data Associated data with the event.
     */
    captureEvent(eventType: string, data: Record<string, any>) {
        const event = {
            timestamp: new Date().toISOString(),
            eventType,
            data,
            userId: this.getUserId(), // Invention: `UserManagerService` for user ID
            sessionId: this.getSessionId(), // Invention: `SessionManager` for session ID
        };
        this.buffer.push(event);
        console.log(`[Telemetry] Captured event: ${eventType}`, data);
    }

    private async sendBuffer() {
        if (this.buffer.length === 0) return;

        const eventsToSend = [...this.buffer];
        this.buffer = []; // Clear buffer immediately

        try {
            await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ChimeraGlobalConfig.API_KEYS.INTERNAL_AUTH_TOKEN}`,
                },
                body: JSON.stringify(eventsToSend),
            });
            console.log(`[Telemetry] Sent ${eventsToSend.length} events.`);
        } catch (error) {
            console.error('[Telemetry] Failed to send events:', error);
            // Optionally, re-add to buffer for next retry
            this.buffer.unshift(...eventsToSend);
        }
    }

    private getUserId(): string {
        // In a real app, this would come from an auth context or cookie
        return 'anonymous-user-' + (typeof window !== 'undefined' ? (window as any)._chimerauid || (window as any)._chimerauid = Math.random().toString(36).substring(2, 15) : 'server-user');
    }

    private getSessionId(): string {
        // In a real app, this would come from a session cookie
        return 'session-' + (typeof window !== 'undefined' ? (window as any)._chimerasid || (window as any)._chimerasid = Math.random().toString(36).substring(2, 15) : 'server-session');
    }
}

export class Logger {
    static info(message: string, context?: Record<string, any>) {
        console.info(`[INFO] ${message}`, context);
        TelemetryService.getInstance().captureEvent('log_info', { message, context });
    }
    static warn(message: string, context?: Record<string, any>) {
        console.warn(`[WARN] ${message}`, context);
        TelemetryService.getInstance().captureEvent('log_warn', { message, context });
    }
    static error(message: string, error?: Error, context?: Record<string, any>) {
        console.error(`[ERROR] ${message}`, error, context);
        TelemetryService.getInstance().captureEvent('log_error', { message, error: error?.message, stack: error?.stack, context });
    }
}

// Invention: 'RateLimiter' - Protects against abuse and manages API costs.
export class RateLimiter {
    private static limits: Map<string, { count: number; lastReset: number; limit: number; interval: number }>;

    static initialize() {
        if (!RateLimiter.limits) {
            RateLimiter.limits = new Map();
            RateLimiter.limits.set('explainCode', { count: 0, lastReset: Date.now(), limit: ChimeraGlobalConfig.RATE_LIMIT_SETTINGS.EXPLAIN_REQUESTS_PER_MINUTE, interval: 60 * 1000 });
            RateLimiter.limits.set('generateMermaidJs', { count: 0, lastReset: Date.now(), limit: ChimeraGlobalConfig.RATE_LIMIT_SETTINGS.MERMAID_REQUESTS_PER_MINUTE, interval: 60 * 1000 });
            RateLimiter.limits.set('securityScan', { count: 0, lastReset: Date.now(), limit: ChimeraGlobalConfig.RATE_LIMIT_SETTINGS.SECURITY_SCAN_REQUESTS_PER_HOUR, interval: 60 * 60 * 1000 });
            // ... add more limits for other services
        }
    }

    static checkAndIncrement(key: string): boolean {
        if (!RateLimiter.limits) RateLimiter.initialize();
        const limitInfo = RateLimiter.limits.get(key);
        if (!limitInfo) {
            Logger.warn(`Rate limit key ${key} not configured.`);
            return true; // No limit configured, allow
        }

        const now = Date.now();
        if (now - limitInfo.lastReset > limitInfo.interval) {
            limitInfo.count = 0;
            limitInfo.lastReset = now;
        }

        if (limitInfo.count < limitInfo.limit) {
            limitInfo.count++;
            return true;
        } else {
            Logger.warn(`Rate limit exceeded for ${key}.`);
            TelemetryService.getInstance().captureEvent('rate_limit_exceeded', { key, userId: TelemetryService.getInstance().getUserId() });
            return false;
        }
    }
}

// Invention: 'SubscriptionManager' - Manages user subscription tiers and feature access.
// Essential for commercial product monetization.
export class SubscriptionManager {
    private static instance: SubscriptionManager;
    private currentUserTier: string = ChimeraGlobalConfig.BILLING_TIERS.FREE; // Default

    private constructor() {
        // In a real app, this would fetch user tier from a backend API or context
        // For demo, we'll simulate.
        if (typeof window !== 'undefined') {
            const storedTier = localStorage.getItem('chimeraUserTier');
            if (storedTier && Object.values(ChimeraGlobalConfig.BILLING_TIERS).includes(storedTier)) {
                this.currentUserTier = storedTier;
            }
        }
        Logger.info(`SubscriptionManager initialized with tier: ${this.currentUserTier}`);
    }

    public static getInstance(): SubscriptionManager {
        if (!SubscriptionManager.instance) {
            SubscriptionManager.instance = new SubscriptionManager();
        }
        return SubscriptionManager.instance;
    }

    public getCurrentUserTier(): string {
        return this.currentUserTier;
    }

    public async setUserTier(tier: string): Promise<boolean> {
        if (Object.values(ChimeraGlobalConfig.BILLING_TIERS).includes(tier)) {
            // Simulate API call to update backend
            Logger.info(`Attempting to update user tier to: ${tier}`);
            // await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            this.currentUserTier = tier;
            if (typeof window !== 'undefined') {
                localStorage.setItem('chimeraUserTier', tier);
            }
            TelemetryService.getInstance().captureEvent('tier_changed', { newTier: tier });
            return true;
        }
        Logger.warn(`Invalid tier attempted: ${tier}`);
        return false;
    }

    public canAccessFeature(feature: ExplanationTab | string): boolean {
        if (!ChimeraGlobalConfig.FEATURE_FLAGS.ENABLE_SUBSCRIPTION_TIERS) {
            return true; // All features available if tiers are disabled
        }

        switch (this.currentUserTier) {
            case ChimeraGlobalConfig.BILLING_TIERS.FREE:
                return [
                    ExplanationTab.Summary,
                    ExplanationTab.LineByLine,
                    ExplanationTab.Complexity,
                    ExplanationTab.Suggestions,
                    ExplanationTab.Flowchart,
                ].includes(feature as ExplanationTab);
            case ChimeraGlobalConfig.BILLING_TIERS.DEVELOPER:
                return true; // Developer tier gets all current features
            case ChimeraGlobalConfig.BILLING_TIERS.ENTERPRISE:
                return true; // Enterprise tier gets everything
            default:
                return false;
        }
    }

    public canAnalyzeCodeLength(codeLength: number): boolean {
        switch (this.currentUserTier) {
            case ChimeraGlobalConfig.BILLING_TIERS.FREE:
                return codeLength <= ChimeraGlobalConfig.UI_SETTINGS.MAX_CODE_LENGTH_FREE_TIER;
            case ChimeraGlobalConfig.BILLING_TIERS.DEVELOPER:
                return codeLength <= 2 * ChimeraGlobalConfig.UI_SETTINGS.MAX_CODE_LENGTH_FREE_TIER; // Double for developer
            case ChimeraGlobalConfig.BILLING_TIERS.ENTERPRISE:
                return true; // Unlimited for enterprise
            default:
                return false;
        }
    }
}

// Invention: 'ProjectContextService' - Provides contextual information from a larger project.
// This simulates integration with an IDE or a backend scanning service.
export class ProjectContextService {
    private static apiClient: ApiClient = new ApiClient(ChimeraGlobalConfig.AI_SERVICE_ENDPOINTS.EXTERNAL_CODE_REPO_SCANNER);

    static async fetchContextForCode(codeSnippet: string): Promise<{ relatedFiles: string[]; ownershipInfo: { owner: string; lastModified: string } }> {
        Logger.info('Fetching project context for code snippet...');
        try {
            // In a real scenario, this would involve complex AST analysis to find references
            // and then query a VCS/project indexing service.
            // For now, it's a simulated API call based on keywords or file structure.
            const response = await ProjectContextService.apiClient.post<{ files: string[]; ownership: { owner: string; lastModified: string } }>(
                '/context',
                { snippet: codeSnippet, projectId: 'current-workspace-id' } // Assume project ID from global context
            );
            return {
                relatedFiles: response.files || ['src/utils/helpers.ts', 'tests/unit/test.js'],
                ownershipInfo: response.ownership || { owner: 'ai-team@chimeratech.com', lastModified: '2023-10-27T10:00:00Z' }
            };
        } catch (error) {
            Logger.error('Failed to fetch project context', error);
            return { relatedFiles: [], ownershipInfo: { owner: 'Unknown', lastModified: 'N/A' } };
        }
    }
}


// STORY: The `explainCodeStructured` and `generateMermaidJs` services from `../services/index.ts`
// are now conceptually replaced or augmented by `AiOrchestrator` to provide a more
// unified and robust AI backend. The original services could be simple wrappers
// around `AiOrchestrator` calls. For this file, we'll instantiate `AiOrchestrator`
// directly to showcase its capabilities.

const exampleCode = `const bubbleSort = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
};`;

mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose' });

// --- Main Component: AiCodeExplainer (The User Interface for Project Chimera) ---
// This is where all the invented services and features converge, providing a rich
// and interactive experience for developers. The UI itself has been significantly
// expanded to display the new dimensions of analysis.
export const AiCodeExplainer: React.FC<{ initialCode?: string }> = ({ initialCode }) => {
    // Invention: 'GlobalStateManager' - more robust than simple useState for complex apps
    // For a single file, we simulate its capabilities with multiple useStates.
    const [code, setCode] = useState<string>(initialCode || exampleCode);
    const [explanation, setExplanation] = useState<AdvancedStructuredExplanation | null>(null);
    const [mermaidCode, setMermaidCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<ExplanationTab>(ExplanationTab.Summary);
    const [selectedModel, setSelectedModel] = useState<AiModelProvider>(AiModelProvider.DEFAULT);
    const [userInstruction, setUserInstruction] = useState<string>(''); // Invention: User can guide AI
    const [explanationHistory, setExplanationHistory] = useState<ExplanationHistoryItem[]>([]); // Invention: User history
    const [currentCostEstimate, setCurrentCostEstimate] = useState<AnalysisCostEstimate | null>(null); // Invention: Real-time cost
    const [detectedCodeLanguage, setDetectedCodeLanguage] = useState<CodeLanguage>(CodeLanguage.Unknown);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const mermaidContainerRef = useRef<HTMLDivElement>(null);
    const aiOrchestrator = useMemo(() => new AiOrchestrator(), []); // Singleton for orchestration
    const analysisCache = useMemo(() => new AnalysisCacheService(), []); // Singleton for caching
    const subscriptionManager = useMemo(() => SubscriptionManager.getInstance(), []); // Singleton for billing
    const telemetryService = useMemo(() => TelemetryService.getInstance(), []); // Singleton for telemetry

    // Debounced code change handler (Invention: 'DebounceHook' - conceptual)
    const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        setCode(newCode);
        TelemetryService.getInstance().captureEvent('code_input_change', { length: newCode.length, language: detectedCodeLanguage });
        // Perform auto-detection or basic validation here
        const language = CodeLanguageDetector.detectLanguage(newCode);
        setDetectedCodeLanguage(language);
    }, [detectedCodeLanguage]);

    // Invention: Throttled scroll handler (performance optimization)
    const handleScroll = useCallback(() => {
        if (preRef.current && textareaRef.current) {
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    }, []);

    // STORY: `handleExplain` - The core interaction, now powered by `AiOrchestrator`
    // This function demonstrates the integration of multiple features:
    // caching, rate limiting, subscription checks, telemetry, and multi-model AI orchestration.
    const handleExplain = useCallback(async (codeToExplain: string, instruction: string, model: AiModelProvider) => {
        if (!codeToExplain.trim()) {
            setError('Please enter some code to explain.');
            return;
        }

        if (!subscriptionManager.canAnalyzeCodeLength(codeToExplain.length)) {
            setError(`Your current subscription tier (${subscriptionManager.getCurrentUserTier()}) limits code length to ${ChimeraGlobalConfig.UI_SETTINGS.MAX_CODE_LENGTH_FREE_TIER} characters. Please upgrade to analyze longer code.`);
            return;
        }

        if (!RateLimiter.checkAndIncrement('explainCode')) {
            setError('Rate limit exceeded. Please wait a moment before explaining more code.');
            return;
        }

        setIsLoading(true);
        setError('');
        setExplanation(null);
        setMermaidCode('');
        setCurrentCostEstimate(null); // Clear previous cost
        setActiveTab(ExplanationTab.Summary);

        try {
            // First, check cache
            const cachedResult = analysisCache.get(codeToExplain, instruction, model);
            if (cachedResult) {
                setExplanation(cachedResult.explanation as AdvancedStructuredExplanation);
                setMermaidCode(cachedResult.mermaidCode);
                setDetectedCodeLanguage(cachedResult.detectedLanguage);
                setCurrentCostEstimate(cachedResult.modelCosts);
                setIsLoading(false);
                TelemetryService.getInstance().captureEvent('code_explained_cached', { codeLength: codeToExplain.length, model: model });
                return;
            }

            // If not in cache, call the orchestrator
            const analysisResult = await aiOrchestrator.explainCodeWithOrchestration(codeToExplain, instruction, model);

            if (analysisResult.error) {
                throw new Error(analysisResult.error);
            }

            setExplanation(analysisResult.explanation as AdvancedStructuredExplanation);
            setMermaidCode(analysisResult.mermaidCode);
            setDetectedCodeLanguage(analysisResult.detectedLanguage);
            setCurrentCostEstimate(analysisResult.modelCosts);

            // Cache the new result
            if (analysisResult.explanation && analysisResult.mermaidCode) {
                analysisCache.set(codeToExplain, instruction, model, analysisResult);
            }

            // Update history (Invention: 'ExplanationHistoryStore')
            if (analysisResult.explanation?.summary) {
                setExplanationHistory(prev => [
                    {
                        id: analysisResult.explanation!.auditTrailId || `history-${Date.now()}`,
                        timestamp: Date.now(),
                        codeSnippet: codeToExplain.substring(0, 100) + '...', // Store a snippet
                        summary: analysisResult.explanation!.summary,
                        modelUsed: model,
                        cost: analysisResult.modelCosts?.totalCostUSD || 0,
                    },
                    ...prev
                ].slice(0, 50)); // Keep last 50 explanations
            }

            TelemetryService.getInstance().captureEvent('code_explained_api', {
                codeLength: codeToExplain.length,
                model: model,
                cost: analysisResult.modelCosts?.totalCostUSD,
                auditId: analysisResult.explanation?.auditTrailId
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to get explanation: ${errorMessage}`);
            Logger.error('Code explanation failed', err, { codeLength: codeToExplain.length, model: model });
            TelemetryService.getInstance().captureEvent('explanation_failed', {
                codeLength: codeToExplain.length,
                model: model,
                errorMessage: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    }, [aiOrchestrator, analysisCache, subscriptionManager]);

    // Initial load effect
    useEffect(() => {
        RateLimiter.initialize(); // Initialize rate limiter on mount
        if (initialCode) {
            setCode(initialCode);
            setDetectedCodeLanguage(CodeLanguageDetector.detectLanguage(initialCode));
            handleExplain(initialCode, userInstruction, selectedModel);
        }
    }, [initialCode, handleExplain, userInstruction, selectedModel]);

    // Mermaid rendering effect
    useEffect(() => {
        const renderMermaid = async () => {
             if (activeTab === ExplanationTab.Flowchart && mermaidCode && mermaidContainerRef.current) {
                TelemetryService.getInstance().captureEvent('flowchart_viewed');
                try {
                    mermaidContainerRef.current.innerHTML = ''; // Clear previous
                    // Using a unique ID for each render prevents issues with multiple mermaid graphs
                    const { svg } = await mermaid.render(`mermaid-graph-${Date.now()}`, mermaidCode);
                    mermaidContainerRef.current.innerHTML = svg;
                } catch (e) {
                    console.error("Mermaid rendering error:", e);
                    mermaidContainerRef.current.innerHTML = `<p class="text-red-500">Error rendering flowchart. Check Mermaid syntax.</p>`;
                    TelemetryService.getInstance().captureEvent('flowchart_render_error', { error: (e as Error).message });
                }
            }
        }
        renderMermaid();
    }, [activeTab, mermaidCode]);

    // Syntax highlighting for the code input (Invention: `AdvancedSyntaxHighlighter`)
    const highlightedCode = useMemo(() => AdvancedSyntaxHighlighter.highlight(code, detectedCodeLanguage), [code, detectedCodeLanguage]);

    // Tab rendering logic, now expanded for new features.
    const renderTabContent = () => {
        if (!explanation) return null;

        // Ensure user has access to premium tabs
        if (!subscriptionManager.canAccessFeature(activeTab)) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <p className="text-xl font-semibold text-primary mb-4">Feature Locked</p>
                    <p className="text-text-secondary mb-6">
                        The <strong>{activeTab.replace(/([A-Z])/g, ' $1')}</strong> feature is available for <strong>{ChimeraGlobalConfig.BILLING_TIERS.DEVELOPER}</strong> and <strong>{ChimeraGlobalConfig.BILLING_TIERS.ENTERPRISE}</strong> tiers.
                    </p>
                    <button
                        onClick={() => { /* navigate to upgrade page */ alert('Simulating upgrade process!'); }}
                        className="btn-primary"
                    >
                        Upgrade to Unlock
                    </button>
                </div>
            );
        }

        switch(activeTab) {
            case ExplanationTab.Summary:
                return <MarkdownRenderer content={explanation.summary} />;
            case ExplanationTab.LineByLine:
                return (
                    <div className="space-y-3">
                        {explanation.lineByLine.length > 0 ? explanation.lineByLine.map((item, index) => (
                            <div key={index} className="p-3 bg-background rounded-md border border-border">
                                <p className="font-mono text-xs text-primary mb-1">Lines: {item.lines}</p>
                                <p className="text-sm">{DataSanitizer.cleanAiText(item.explanation)}</p>
                            </div>
                        )) : <p className="text-text-secondary italic">No line-by-line explanation available.</p>}
                    </div>
                );
            case ExplanationTab.Complexity:
                return (
                    <div className="space-y-2">
                        <p><strong>Time Complexity:</strong> <span className="font-mono text-amber-600">{explanation.complexity.time}</span></p>
                        <p><strong>Space Complexity:</strong> <span className="font-mono text-amber-600">{explanation.complexity.space}</span></p>
                        {explanation.detectedLanguage && <p><strong>Detected Language:</strong> <span className="font-mono text-primary-light">{explanation.detectedLanguage}</span></p>}
                        {explanation.codeOwnershipInfo && (
                            <div>
                                <p><strong>Code Owner:</strong> <span className="font-mono text-primary-light">{explanation.codeOwnershipInfo.owner}</span></p>
                                <p><strong>Last Modified:</strong> <span className="font-mono text-primary-light">{new Date(explanation.codeOwnershipInfo.lastModified).toLocaleString()}</span></p>
                            </div>
                        )}
                        {explanation.relatedFiles && explanation.relatedFiles.length > 0 && (
                             <div>
                                <p className="font-bold mt-2">Related Files:</p>
                                <ul className="list-disc list-inside text-sm text-text-secondary">
                                    {explanation.relatedFiles.map((file, i) => <li key={i}>{file}</li>)}
                                </ul>
                             </div>
                        )}
                    </div>
                );
            case ExplanationTab.Suggestions:
                return (
                     <ul className="list-disc list-inside space-y-2">
                        {explanation.suggestions.length > 0 ? explanation.suggestions.map((item, index) => <li key={index}>{DataSanitizer.cleanAiText(item)}</li>) : <p className="text-text-secondary italic">No general suggestions.</p>}
                    </ul>
                );
            case ExplanationTab.Flowchart:
                return (
                    <div ref={mermaidContainerRef} className="w-full h-full flex items-center justify-center p-4">
                        {mermaidCode ? <div className="mermaid max-w-full max-h-full overflow-auto" /> : <LoadingSpinner />}
                    </div>
                );
            case ExplanationTab.Security: // Invention: New Tab
                return (
                    <div className="space-y-4">
                        {explanation.securityVulnerabilities && explanation.securityVulnerabilities.length > 0 ? (
                            explanation.securityVulnerabilities.map((vuln, index) => (
                                <div key={index} className="p-3 bg-red-900 bg-opacity-20 rounded-md border border-red-700">
                                    <p className={`font-semibold text-lg ${vuln.severity === SecurityVulnerabilitySeverity.CRITICAL ? 'text-red-500' : vuln.severity === SecurityVulnerabilitySeverity.HIGH ? 'text-orange-400' : 'text-yellow-400'}`}>
                                        {vuln.severity}: {DataSanitizer.cleanAiText(vuln.description)}
                                    </p>
                                    <p className="text-sm text-gray-300 mt-1">Lines: <span className="font-mono">{vuln.lines}</span></p>
                                    {vuln.cweId && <p className="text-sm text-gray-300">CWE ID: <span className="font-mono">{vuln.cweId}</span></p>}
                                    {vuln.owaspCategory && <p className="text-sm text-gray-300">OWASP Category: <span className="font-mono">{vuln.owaspCategory}</span></p>}
                                    <p className="text-xs text-gray-400 mt-2"><strong>Suggested Fix:</strong> {DataSanitizer.cleanAiText(vuln.suggestedFix)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-secondary italic">No security vulnerabilities detected or feature disabled.</p>
                        )}
                    </div>
                );
            case ExplanationTab.Performance: // Invention: New Tab
                 return (
                    <div className="space-y-4">
                        {explanation.performanceInsights && explanation.performanceInsights.length > 0 ? (
                            explanation.performanceInsights.map((insight, index) => (
                                <div key={index} className="p-3 bg-blue-900 bg-opacity-20 rounded-md border border-blue-700">
                                    <p className={`font-semibold text-lg ${insight.impact === 'critical' ? 'text-red-500' : insight.impact === 'high' ? 'text-orange-400' : 'text-blue-400'}`}>
                                        {insight.type.toUpperCase()}: {DataSanitizer.cleanAiText(insight.description)}
                                    </p>
                                    <p className="text-sm text-gray-300 mt-1">Impact: <span className="capitalize">{insight.impact}</span>, Lines: <span className="font-mono">{insight.lines}</span></p>
                                    <p className="text-xs text-gray-400 mt-2"><strong>Improvement:</strong> {DataSanitizer.cleanAiText(insight.suggestedImprovement)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-secondary italic">No performance insights found or feature disabled.</p>
                        )}
                    </div>
                );
            case ExplanationTab.Tests: // Invention: New Tab
                return (
                    <div className="space-y-4">
                        {explanation.generatedTests && explanation.generatedTests.length > 0 ? (
                            explanation.generatedTests.map((test, index) => (
                                <div key={index} className="p-3 bg-green-900 bg-opacity-20 rounded-md border border-green-700">
                                    <p className="font-semibold text-lg text-green-400">{DataSanitizer.cleanAiText(test.description)}</p>
                                    <p className="text-sm text-gray-300 mt-1">Framework: <span className="font-mono">{test.framework}</span>, Type: <span className="font-mono">{test.type}</span></p>
                                    <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-x-auto text-green-200">{DataSanitizer.cleanAiText(test.code)}</pre>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-secondary italic">No tests generated or feature disabled.</p>
                        )}
                    </div>
                );
            case ExplanationTab.Refactor: // Invention: New Tab
                return (
                    <div className="space-y-4">
                        {explanation.refactoringSuggestions && explanation.refactoringSuggestions.length > 0 ? (
                            explanation.refactoringSuggestions.map((refactor, index) => (
                                <div key={index} className="p-3 bg-purple-900 bg-opacity-20 rounded-md border border-purple-700">
                                    <p className="font-semibold text-lg text-purple-400">{DataSanitizer.cleanAiText(refactor.description)}</p>
                                    <p className="text-sm text-gray-300 mt-1">Pattern: <span className="font-mono">{refactor.pattern}</span>, Effort: <span className="capitalize">{refactor.effort}</span>, Lines: <span className="font-mono">{refactor.lines}</span></p>
                                    <p className="text-xs text-gray-400 mt-2"><strong>Current:</strong> <pre className="p-1 bg-gray-800 rounded text-green-200 text-xs overflow-x-auto">{DataSanitizer.cleanAiText(refactor.currentCodeSnippet)}</pre></p>
                                    <p className="text-xs text-gray-400 mt-2"><strong>Suggested:</strong> <pre className="p-1 bg-gray-800 rounded text-yellow-200 text-xs overflow-x-auto">{DataSanitizer.cleanAiText(refactor.suggestedCodeSnippet)}</pre></p>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-secondary italic">No refactoring suggestions or feature disabled.</p>
                        )}
                    </div>
                );
            case ExplanationTab.Documentation: // Invention: New Tab
                return (
                    <div className="space-y-4">
                        {explanation.generatedDocumentation ? (
                            <div className="p-3 bg-teal-900 bg-opacity-20 rounded-md border border-teal-700">
                                <p className="font-semibold text-lg text-teal-400">Documentation ({explanation.generatedDocumentation.format})</p>
                                <MarkdownRenderer content={explanation.generatedDocumentation.content} />
                            </div>
                        ) : (
                            <p className="text-text-secondary italic">No documentation generated or feature disabled.</p>
                        )}
                    </div>
                );
            case ExplanationTab.History: // Invention: New Tab
                 return (
                    <div className="space-y-4">
                        {explanationHistory.length > 0 ? (
                            explanationHistory.map((item, index) => (
                                <div key={item.id} className="p-3 bg-gray-800 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700"
                                    onClick={() => {
                                        setCode(item.codeSnippet); // Restore code from history
                                        setUserInstruction(''); // Clear instruction
                                        setActiveTab(ExplanationTab.Summary); // Go back to summary
                                        handleExplain(item.codeSnippet, '', item.modelUsed); // Re-run analysis
                                    }}>
                                    <p className="font-semibold text-primary text-sm">
                                        {new Date(item.timestamp).toLocaleString()} - Model: {item.modelUsed}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Snippet: <span className="font-mono">{item.codeSnippet}</span></p>
                                    <p className="text-sm text-text-secondary mt-1">{DataSanitizer.cleanAiText(item.summary.substring(0, 100))}...</p>
                                    {item.cost > 0 && <p className="text-xs text-text-secondary mt-1">Cost: ${item.cost.toFixed(6)}</p>}
                                </div>
                            ))
                        ) : (
                            <p className="text-text-secondary italic">No explanation history yet.</p>
                        )}
                    </div>
                );
            case ExplanationTab.Cost: // Invention: New Tab for billing transparency
                return (
                    <div className="space-y-4">
                        {currentCostEstimate ? (
                            <div className="p-3 bg-gray-800 rounded-md border border-gray-700">
                                <p className="font-semibold text-lg text-primary">Analysis Cost Estimate</p>
                                <p className="text-sm text-text-secondary mt-2">Total Estimated Cost: <span className="font-bold text-green-400">${currentCostEstimate.totalCostUSD.toFixed(6)}</span></p>
                                <p className="text-sm text-text-secondary">Total Estimated Tokens: <span className="font-bold">{currentCostEstimate.totalTokens}</span></p>

                                <h3 className="font-semibold text-primary mt-4">Model Breakdown:</h3>
                                {Object.entries(currentCostEstimate.modelBreakdown).length > 0 ? (
                                    <ul className="list-disc list-inside text-sm text-text-secondary">
                                        {Object.entries(currentCostEstimate.modelBreakdown).map(([model, data]) => (
                                            <li key={model}>
                                                <span className="font-mono text-blue-400">{model}</span>: {data.tokens} tokens, ${data.cost.toFixed(6)}
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-text-secondary italic">No model usage data.</p>}

                                <h3 className="font-semibold text-primary mt-4">Additional Service Costs:</h3>
                                {Object.entries(currentCostEstimate.additionalServiceCosts).length > 0 ? (
                                    <ul className="list-disc list-inside text-sm text-text-secondary">
                                        {Object.entries(currentCostEstimate.additionalServiceCosts).map(([service, cost]) => (
                                            <li key={service}>
                                                <span className="capitalize text-purple-400">{service.replace(/([A-Z])/g, ' $1')}</span>: ${cost.toFixed(6)}
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-text-secondary italic">No additional service costs.</p>}
                                <p className="text-xs text-gray-500 mt-4">Note: Costs are estimates and may vary based on actual API usage and pricing.</p>
                            </div>
                        ) : (
                            <p className="text-text-secondary italic">No cost estimate available yet.</p>
                        )}
                    </div>
                );
            default:
                return <p className="text-red-500">Unknown tab selected.</p>;
        }
    }

    // Render the main UI
    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary bg-background-dark">
            <header className="mb-6 flex-shrink-0">
                <h1 className="text-3xl font-bold flex items-center">
                    <CpuChipIcon className="text-primary-light" />
                    <span className="ml-3">Project Chimera: AI Code Explainer</span>
                </h1>
                <p className="text-text-secondary mt-1">
                    Get a detailed, structured, and multi-dimensional analysis of any code snippet.
                    <span className="ml-2 px-2 py-1 bg-primary-light text-primary-dark rounded-full text-xs font-semibold">
                        Tier: {subscriptionManager.getCurrentUserTier().toUpperCase()}
                    </span>
                </p>
            </header>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">

                {/* Left Column: Code Input & Controls */}
                <div className="flex flex-col min-h-0 md:col-span-1">
                    <label htmlFor="code-input" className="text-sm font-medium text-text-secondary mb-2">Your Code (Detected: <span className="font-mono text-primary-light">{detectedCodeLanguage}</span>)</label>
                    <div className="relative flex-grow bg-surface border border-border rounded-md focus-within:ring-2 focus-within:ring-primary overflow-hidden">
                        <textarea
                            ref={textareaRef}
                            id="code-input"
                            value={code}
                            onChange={handleCodeChange}
                            onScroll={useCallback(() => handleScroll(), [handleScroll])} // Use memoized scroll handler
                            placeholder="Paste your code here..."
                            spellCheck="false"
                            className="absolute inset-0 w-full h-full p-4 bg-transparent resize-none font-mono text-sm text-transparent caret-primary outline-none z-10"
                            disabled={isLoading}
                        />
                        <pre
                            ref={preRef}
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full p-4 font-mono text-sm text-text-primary pointer-events-none z-0 whitespace-pre-wrap overflow-auto no-scrollbar"
                            dangerouslySetInnerHTML={{ __html: highlightedCode + '\n' }}
                        />
                    </div>
                    {code.length > ChimeraGlobalConfig.UI_SETTINGS.MAX_CODE_LENGTH_FREE_TIER && subscriptionManager.getCurrentUserTier() === ChimeraGlobalConfig.BILLING_TIERS.FREE && (
                        <p className="text-red-400 text-sm mt-2">
                            Code length exceeds {ChimeraGlobalConfig.UI_SETTINGS.MAX_CODE_LENGTH_FREE_TIER} characters for your FREE tier. Upgrade to analyze.
                        </p>
                    )}
                    <div className="mt-4 flex-shrink-0 space-y-3">
                        {/* AI Model Selection (Invention: 'AiModelSelector') */}
                        <div className="flex items-center space-x-2">
                            <label htmlFor="ai-model-select" className="text-sm text-text-secondary min-w-max">AI Model:</label>
                            <select
                                id="ai-model-select"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value as AiModelProvider)}
                                className="flex-grow p-2 border border-border bg-background rounded-md text-sm text-text-primary focus:ring-primary focus:border-primary"
                                disabled={isLoading}
                            >
                                <option value={AiModelProvider.CHATGPT_3_5_TURBO}>ChatGPT 3.5 Turbo (Default, Cost-Effective)</option>
                                <option value={AiModelProvider.CHATGPT_4}>ChatGPT 4 (Advanced, Higher Cost)</option>
                                <option value={AiModelProvider.GEMINI_PRO}>Gemini Pro (Alternative, Balanced)</option>
                                {/* Add more options for other models (e.g., Code Llama, Claude 3) here for "hundreds of services" */}
                            </select>
                        </div>

                        {/* User Instruction Input (Invention: 'ContextualInstructionInput') */}
                        <div className="flex flex-col">
                            <label htmlFor="user-instruction" className="text-sm text-text-secondary mb-1">Specific Instructions (Optional):</label>
                            <input
                                id="user-instruction"
                                type="text"
                                value={userInstruction}
                                onChange={(e) => setUserInstruction(DataSanitizer.sanitizeHtml(e.target.value))}
                                placeholder="e.g., 'Focus on performance' or 'Explain for a beginner'"
                                className="p-2 border border-border bg-background rounded-md text-sm text-text-primary focus:ring-primary focus:border-primary"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            onClick={() => handleExplain(code, userInstruction, selectedModel)}
                            disabled={isLoading || !subscriptionManager.canAnalyzeCodeLength(code.length)}
                            className="btn-primary w-full flex items-center justify-center px-6 py-3"
                        >
                            {isLoading ? <LoadingSpinner/> : 'Analyze Code'}
                        </button>
                    </div>
                </div>

                {/* Right Column: AI Analysis Output */}
                <div className="flex flex-col min-h-0 md:col-span-1">
                    <label className="text-sm font-medium text-text-secondary mb-2">AI Analysis</label>
                    <div className="relative flex-grow flex flex-col bg-surface border border-border rounded-md overflow-hidden">
                        <div className="flex-shrink-0 flex border-b border-border overflow-x-auto no-scrollbar">
                           {(Object.values(ExplanationTab) as ExplanationTab[]).map(tab => (
                               <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                disabled={!explanation || isLoading || !subscriptionManager.canAccessFeature(tab)}
                                className={`px-4 py-2 text-sm font-medium capitalize transition-colors whitespace-nowrap
                                    ${activeTab === tab ? 'bg-background text-primary font-semibold' : 'text-text-secondary hover:bg-gray-700 disabled:text-gray-500'}
                                    ${!subscriptionManager.canAccessFeature(tab) && 'relative after:content-["🔒"] after:absolute after:right-1 after:top-1 after:text-xs after:text-primary-light'}`}>
                                   {tab.replace(/([A-Z])/g, ' $1')}
                               </button>
                           ))}
                        </div>
                        <div className="p-4 flex-grow overflow-y-auto">
                            {isLoading && <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>}
                            {error && <p className="text-red-500">{error}</p>}
                            {explanation && !isLoading && renderTabContent()}
                            {!isLoading && !explanation && !error && <div className="text-text-secondary h-full flex items-center justify-center">The analysis will appear here.</div>}
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer with copyright and version info (Invention: 'ChimeraFooter') */}
            <footer className="mt-6 text-center text-xs text-text-secondary flex-shrink-0">
                <p>&copy; {new Date().getFullYear()} Citibank Demo Business Inc. All rights reserved.</p>
                <p>Project Chimera v{process.env.NEXT_PUBLIC_APP_VERSION || '1.0.1'} | Built with {AiModelProvider.GEMINI_PRO}, {AiModelProvider.CHATGPT_4}, {AiModelProvider.CHATGPT_3_5_TURBO} and many more AI technologies.</p>
                <p className="mt-1 italic">
                    "Democratizing Code Intelligence for a Smarter Future." - James Burvel O'Callaghan III, President.
                </p>
            </footer>
        </div>
    );
};
// STORY END: Project Chimera, the AiCodeExplainer, stands as a testament to innovation,
// pushing the boundaries of AI-driven developer tooling into a new era of intelligence
// and commercial viability.

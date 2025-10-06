// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// This file represents a monumental leap in AI-assisted code analysis, developed through the visionary 'Project Chimera' initiative.
// It's designed to be the cornerstone of a commercial-grade, deeply integrated development ecosystem,
// offering unparalleled insights into code quality, security, performance, and maintainability.
// The ambition is to create a living, evolving intelligence capable of understanding, optimizing, and securing software
// at an industrial scale, underpinning future innovations across Citibank Demo Business Inc.
// Every component, service, and feature within this file is meticulously crafted to tell a story of advanced engineering,
// blending cutting-edge AI with robust enterprise requirements.

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import mermaid from 'mermaid';
import { explainCodeStructured, generateMermaidJs } from '../../services/index.ts';
import type { StructuredExplanation } from '../../types.ts';
import { useTheme } from '../../hooks/useTheme.ts';
import { CpuChipIcon } from '../icons.tsx';
import { MarkdownRenderer, LoadingSpinner } from '../shared/index.ts';

// Invented Type: `CodeInputSource`
// This enum defines the various ways a user can provide code for analysis.
export type CodeInputSource = 'manual' | 'file' | 'url' | 'git';

// Invented Type: `CodeExplanationModel`
// This enum lists the various AI models available for code explanation, including proprietary and integrated commercial models.
export type CodeExplanationModel = 'gemini' | 'chatgpt' | 'custom-finetuned' | 'code-llama';

// Invented Type: `AnalysisSeverity`
// Defines the severity levels for identified issues, crucial for commercial-grade reporting and prioritization.
export type AnalysisSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Invented Interface: `SecurityVulnerability`
// Represents a discovered security vulnerability, detailing its nature, severity, and suggested remediation.
export interface SecurityVulnerability {
    id: string;
    description: string;
    severity: AnalysisSeverity;
    cwe: string; // Common Weakness Enumeration
    owaspTop10: string; // OWASP Top 10 category
    line: number;
    filePath?: string;
    recommendation: string;
    cvssScore?: number; // Common Vulnerability Scoring System
}

// Invented Interface: `PerformanceBottleneck`
// Identifies potential performance issues, including location and impact.
export interface PerformanceBottleneck {
    id: string;
    description: string;
    impact: string; // e.g., 'High CPU', 'Memory Leak', 'Slow I/O'
    severity: AnalysisSeverity;
    line: number;
    filePath?: string;
    recommendation: string;
    estimatedSavings?: string; // e.g., '10% CPU reduction'
}

// Invented Interface: `CodeSmell`
// Describes a 'code smell' - a surface indication that something deeper is wrong with the code.
export interface CodeSmell {
    id: string;
    name: string;
    description: string;
    category: string; // e.g., 'Duplication', 'Long Method', 'God Object'
    severity: AnalysisSeverity;
    line: number;
    filePath?: string;
    recommendation: string;
}

// Invented Interface: `RefactoringSuggestion`
// Provides actionable advice for improving code structure, readability, or maintainability.
export interface RefactoringSuggestion {
    id: string;
    description: string;
    type: 'extract-method' | 'rename-variable' | 'introduce-variable' | 'replace-magic-number' | 'simplify-conditional';
    line: number;
    filePath?: string;
    codeSnippet?: string; // The specific code to refactor
    recommendation: string;
    effortEstimate?: 'low' | 'medium' | 'high';
}

// Invented Interface: `CodeMetric`
// Represents various quantitative metrics of the code.
export interface CodeMetric {
    name: string;
    value: number | string;
    unit?: string; // e.g., 'lines', 'score'
    description: string;
}

// Invented Interface: `DependencyGraphNode`
// Represents a node in the dependency graph, could be a file, module, or component.
export interface DependencyGraphNode {
    id: string;
    label: string;
    type: 'file' | 'module' | 'component' | 'external-library';
}

// Invented Interface: `DependencyGraphEdge`
// Represents a directed edge in the dependency graph.
export interface DependencyGraphEdge {
    from: string;
    to: string;
    label?: string;
    type: 'imports' | 'calls' | 'uses';
}

// Invented Interface: `AbstractSyntaxTree`
// A simplified representation of an AST node for visualization purposes.
export interface AbstractSyntaxTree {
    type: string;
    value?: string;
    children?: AbstractSyntaxTree[];
    loc?: {
        start: { line: number; column: number };
        end: { line: number; column: number };
    };
}

// Invented Interface: `ComprehensiveCodeAnalysisReport`
// This is the expanded type for the AI's comprehensive analysis, superseding `StructuredExplanation`.
// It includes all the new analysis vectors crucial for a commercial-grade product.
export interface ComprehensiveCodeAnalysisReport {
    summary: string;
    lineByLine: Array<{ lines: string; explanation: string }>;
    complexity: { time: string; space: string; cyclomatic?: number; cognitive?: number };
    suggestions: string[];
    securityVulnerabilities: SecurityVulnerability[]; // New feature: SAST integration
    performanceBottlenecks: PerformanceBottleneck[]; // New feature: Performance analysis
    codeSmells: CodeSmell[]; // New feature: Code smell detection
    refactoringSuggestions: RefactoringSuggestion[]; // New feature: Advanced refactoring
    metrics: CodeMetric[]; // New feature: Code metrics dashboard
    dependencies: { nodes: DependencyGraphNode[]; edges: DependencyGraphEdge[] }; // New feature: Dependency Graph
    ast?: AbstractSyntaxTree; // New feature: Abstract Syntax Tree visualization
    testingSuggestions: string[]; // New feature: Test generation / coverage suggestions
    architecturalNotes: string; // New feature: High-level architectural observations
    aiModelsUsed: CodeExplanationModel[]; // New feature: Transparency of AI models
    analysisTimestamp: string; // New feature: Audit trail
    rawData?: any; // New feature: For debugging and advanced users, raw output from services
}

// Invented Type: `ExplanationTab`
// Expanded set of tabs to visualize the comprehensive analysis.
export type ExplanationTab = 'summary' | 'lineByLine' | 'complexity' | 'suggestions' | 'security' | 'performance' | 'smells' | 'refactoring' | 'metrics' | 'dependencies' | 'ast' | 'testing' | 'architecture' | 'flowchart';

// Invented Type: `AnalysisSettings`
// Global settings for the analysis process, allowing user customization.
export interface AnalysisSettings {
    aiModel: CodeExplanationModel;
    deepScan: boolean; // Controls depth of analysis
    includeSecurityScan: boolean;
    includePerformanceScan: boolean;
    includeCodeSmellDetection: boolean;
    generateAst: boolean;
    generateDependencyGraph: boolean;
    targetLanguage: string; // E.g., 'javascript', 'typescript', 'python', 'java'
    apiKeys: { // Placeholder for managing various API keys for external services
        gemini?: string;
        chatgpt?: string;
        snyk?: string;
        sonarcloud?: string;
        github?: string;
        stripe?: string;
        aws?: { accessKeyId: string; secretAccessKey: string };
        azure?: { subscriptionKey: string };
        gcp?: { serviceAccountKey: string };
    };
    environment: 'development' | 'staging' | 'production'; // For conditional logic in analysis
    maxTokens?: number; // For AI model calls
    temperature?: number; // For AI model creativity
}

const exampleCode = `const bubbleSort = (arr) => {
  // Invented Feature: Comprehensive code example for demonstration.
  // This example demonstrates a basic sorting algorithm.
  // It's used to showcase how the AI Explainer handles common coding patterns,
  // identifies complexities, and provides basic refactoring or optimization suggestions.
  // For more advanced analyses (security, performance), a more complex,
  // potentially vulnerable or inefficient, code snippet would be ideal.
  for (let i = 0; i < arr.length; i++) { // Outer loop for passes
    for (let j = 0; j < arr.length - i - 1; j++) { // Inner loop for comparisons
      // Invented Feature: Inline comment explaining comparison and swap logic.
      // This is a classic comparison in bubble sort.
      if (arr[j] > arr[j + 1]) {
        // Invented Feature: Array destructuring for elegant swapping.
        // This swap operation moves the larger element to the right.
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr; // Returns the sorted array
};

// Invented Feature: An additional function to demonstrate multi-function analysis.
// This function calculates the factorial of a number recursively.
// It will be analyzed for complexity and potential edge cases.
const factorial = (n) => {
    if (n < 0) {
        throw new Error("Factorial is not defined for negative numbers.");
    }
    if (n === 0) {
        return 1;
    }
    return n * factorial(n - 1);
};

// Invented Feature: A class demonstrating object-oriented analysis.
// This class manages a simple counter with increment, decrement, and reset operations.
class Counter {
    constructor(initialValue = 0) {
        this.count = initialValue;
    }

    increment() {
        this.count++;
        return this.count;
    }

    decrement() {
        this.count--;
        return this.count;
    }

    reset() {
        this.count = 0;
        return this.count;
    }

    get countValue() {
        return this.count;
    }
}
`;

// Invented Utility Function: `simpleSyntaxHighlight`
// Expanded syntax highlighting with more language constructs and Tailwind CSS classes.
// This function now provides richer styling for various code elements, improving readability.
const simpleSyntaxHighlight = (code: string) => {
    const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    return escapedCode
        .replace(/\b(const|let|var|function|return|if|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|class|extends|super|this|static|import|from|export|default|async|await|yield|debugger)\b/g, '<span class="text-indigo-400 font-semibold">$1</span>') // Keywords
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-purple-400 font-semibold">$1</span>') // Literals
        .replace(/(\`|'|")(.*?)(\`|'|")/g, '<span class="text-emerald-400">$1$2$3</span>') // Strings
        .replace(/(\/\/.*)/g, '<span class="text-gray-400 italic">$1</span>') // Single-line comments
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-400 italic">$1</span>') // Multi-line comments
        .replace(/(\{|\}|\(|\)|\[|\])/g, '<span class="text-gray-400">$1</span>') // Brackets
        .replace(/(\b\d+(\.\d+)?([eE][+-]?\d+)?\b)/g, '<span class="text-yellow-400">$1</span>') // Numbers
        .replace(/((\w+)\s*=\s*|>)\s*(\w+)/g, '<span class="text-blue-400">$3</span>') // Variable assignments, function calls
        .replace(/(\.)(\w+)/g, '<span class="text-cyan-400">.$2</span>'); // Member access
};

mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });

// Invented Service: `callGeminiApi`
// Simulates an API call to Google Gemini for advanced code analysis.
// This service would interact with Gemini's sophisticated understanding capabilities for
// deeper linguistic and contextual code insights, suitable for enterprise environments.
// It's designed to be robust, supporting various prompts and response parsing.
export const callGeminiApi = async (code: string, settings: AnalysisSettings, prompt: string): Promise<any> => {
    console.log(`[GeminiService] Calling Gemini API for code analysis (deepScan: ${settings.deepScan})...`);
    // Invented Feature: Advanced AI model interaction with specific parameters.
    // In a real-world scenario, this would involve authenticating, constructing a payload,
    // and making an HTTP request to the Gemini API endpoint.
    // const geminiEndpoint = `https://api.google.com/gemini/v1/analyze`; // Example endpoint
    // const response = await fetch(geminiEndpoint, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${settings.apiKeys.gemini}` // Use actual API key
    //     },
    //     body: JSON.stringify({
    //         model: settings.aiModel,
    //         prompt: `${prompt}\n\nCode:\n\`\`\`\n${code}\n\`\`\``,
    //         temperature: settings.temperature || 0.7,
    //         max_tokens: settings.maxTokens || 2048,
    //         // Additional Gemini specific parameters for advanced control
    //         stop_sequences: ["```END_ANALYSIS```"],
    //         safety_settings: [{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }]
    //     })
    // });
    // if (!response.ok) {
    //     throw new Error(`Gemini API error: ${response.statusText}`);
    // }
    // const data = await response.json();
    // return data;

    // Mock data for demonstration, simulating a comprehensive Gemini response.
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    const mockResponse = {
        geminiAnalysis: `Gemini's deep dive reveals that the provided code is a classic Bubble Sort implementation, exhibiting O(n^2) time complexity. The factorial function is a recursive implementation, prone to stack overflow for large N. The Counter class is straightforward. Gemini suggests optimizing the Bubble Sort for edge cases or considering more efficient algorithms for larger datasets.`,
        // Invented Feature: Structured data from AI for specific analysis points.
        securityObservations: settings.includeSecurityScan ? [{
            id: 'G_VULN_001',
            description: "Potential for denial of service if factorial 'n' is excessively large leading to stack overflow.",
            severity: 'medium' as AnalysisSeverity,
            cwe: 'CWE-674',
            owaspTop10: 'A03:2021-Injection', // Example for mapping a non-injection vulnerability to OWASP for demonstration
            line: code.split('\n').findIndex(line => line.includes('factorial(n - 1)')) + 1,
            recommendation: "Implement memoization or iterative factorial for large inputs, or add input validation."
        }] : [],
        performanceNotes: settings.includePerformanceScan ? [{
            id: 'G_PERF_001',
            description: "Bubble sort has quadratic time complexity, which is inefficient for large arrays. Consider algorithms like Merge Sort or Quick Sort.",
            impact: 'Slow Execution',
            severity: 'high' as AnalysisSeverity,
            line: code.split('\n').findIndex(line => line.includes('bubbleSort')) + 1,
            recommendation: "Refactor to use a more efficient sorting algorithm for production systems processing significant data volumes."
        }] : [],
        refactoringSuggestions: settings.includeRefactoringScan ? [{
            id: 'G_REF_001',
            description: "Extract the swapping logic into a separate helper function for clarity in bubbleSort.",
            type: 'extract-method' as RefactoringSuggestion['type'],
            line: code.split('\n').findIndex(line => line.includes('[arr[j], arr[j + 1]]')) + 1,
            recommendation: "Create a 'swap' utility function."
        }] : []
    };
    return mockResponse;
};

// Invented Service: `callChatGPTApi`
// Simulates an API call to OpenAI's ChatGPT for conversational and summary-focused code analysis.
// This service focuses on providing natural language explanations, code generation, and high-level summaries.
export const callChatGPTApi = async (code: string, settings: AnalysisSettings, prompt: string): Promise<any> => {
    console.log(`[ChatGPTService] Calling ChatGPT API for code analysis (model: ${settings.aiModel})...`);
    // Invented Feature: Flexible AI model interaction, supporting different OpenAI models.
    // Similar to Gemini, this would involve API key handling and HTTP requests.
    // const openaiEndpoint = `https://api.openai.com/v1/chat/completions`;
    // const response = await fetch(openaiEndpoint, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${settings.apiKeys.chatgpt}`
    //     },
    //     body: JSON.stringify({
    //         model: 'gpt-4o', // Or other specific models like 'gpt-3.5-turbo'
    //         messages: [{ role: 'user', content: `${prompt}\n\nCode:\n\`\`\`\n${code}\n\`\`\`` }],
    //         temperature: settings.temperature || 0.7,
    //         max_tokens: settings.maxTokens || 1500,
    //     })
    // });
    // if (!response.ok) {
    //     throw new Error(`ChatGPT API error: ${response.statusText}`);
    // }
    // const data = await response.json();
    // return data.choices[0].message.content;

    // Mock data for demonstration, simulating a ChatGPT response.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const mockResponse = {
        chatgptSummary: `This codebase demonstrates fundamental JavaScript concepts including iterative sorting (bubble sort), recursive mathematical functions (factorial), and object-oriented programming with a simple Counter class. The bubble sort efficiently sorts small arrays but scales poorly. The factorial function is a classic recursive example, illustrating base cases and recursive calls. The Counter class provides a clear encapsulation of state and behavior for counting.`,
        architecturalNotes: `The current architecture is monolithic within this single file. For scalability and maintainability, it would benefit from modularization. For example, sorting algorithms, mathematical utilities, and UI components could be separated into distinct modules. Consider a design pattern like 'Strategy' for different sorting algorithms.`,
        testingSuggestions: [`For bubbleSort: Write unit tests with empty array, single element, sorted array, reverse sorted array, and array with duplicates.`, `For factorial: Test with 0, 1, positive integers, and negative input (expecting error).`, `For Counter: Test increment, decrement, reset, and initial value. Consider mocking for external dependencies if any were present.`]
    };
    return mockResponse;
};

// Invented Service: `analyzeSecurityWithSAST`
// Simulates integration with a Static Application Security Testing (SAST) tool like Snyk, SonarQube, or Bandit.
// This service represents a crucial commercial-grade feature for identifying security vulnerabilities early in the SDLC.
// It would typically involve sending code to a specialized security scanner and parsing its report.
export const analyzeSecurityWithSAST = async (code: string, settings: AnalysisSettings): Promise<SecurityVulnerability[]> => {
    if (!settings.includeSecurityScan) return [];
    console.log('[SASTService] Running static application security scan...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a longer scan
    // Invented Feature: Detailed, context-aware security vulnerability detection.
    // In a real SAST tool integration, this would parse a SARIF report or similar output.
    const vulnerabilities: SecurityVulnerability[] = [
        {
            id: 'SAST-JS-001',
            description: 'Insecure use of eval or similar function (if present, simulated here).',
            severity: 'high',
            cwe: 'CWE-94',
            owaspTop10: 'A03:2021-Injection',
            line: 1, // Placeholder
            filePath: 'main.js',
            recommendation: 'Avoid using `eval()` or dynamically generated code from untrusted sources. Use safer alternatives like JSON.parse() or dedicated parsers.'
        },
        {
            id: 'SAST-JS-002',
            description: 'Potential Regular Expression Denial of Service (ReDoS) vulnerability.',
            severity: 'medium',
            cwe: 'CWE-1333',
            owaspTop10: 'A07:2021-Identification and Authentication Failures', // Example mapping
            line: 5, // Placeholder
            filePath: 'main.js',
            recommendation: 'Ensure regular expressions are not vulnerable to catastrophic backtracking. Test with various inputs or use safe regex libraries.'
        },
        {
            id: 'SAST-JS-003',
            description: 'Unchecked recursive depth in factorial function leading to potential stack overflow.',
            severity: 'medium',
            cwe: 'CWE-674',
            owaspTop10: 'A03:2021-Injection',
            line: code.split('\n').findIndex(line => line.includes('factorial(n - 1)')) + 1,
            filePath: 'main.js',
            recommendation: 'Implement an iterative approach or add a maximum recursion depth check to prevent stack overflow for large inputs.'
        }
    ];
    return vulnerabilities.filter(v => code.includes(v.id.split('-')[1].toLowerCase()) || v.id === 'SAST-JS-003'); // Basic simulated filter
};

// Invented Service: `analyzePerformanceMetrics`
// Simulates integration with a performance analysis tool or profiler.
// This service would identify common performance anti-patterns and suggest optimizations.
// Critical for commercial applications where efficiency directly impacts cost and user experience.
export const analyzePerformanceMetrics = async (code: string, settings: AnalysisSettings): Promise<PerformanceBottleneck[]> => {
    if (!settings.includePerformanceScan) return [];
    console.log('[PerfService] Analyzing performance bottlenecks...');
    await new Promise(resolve => setTimeout(resolve, 1800)); // Simulate performance analysis time
    const bottlenecks: PerformanceBottleneck[] = [
        {
            id: 'PERF-JS-001',
            description: 'Inefficient sorting algorithm (Bubble Sort) detected, leading to O(n^2) complexity.',
            impact: 'High CPU, Poor Scalability',
            severity: 'high',
            line: code.split('\n').findIndex(line => line.includes('bubbleSort')) + 1,
            filePath: 'main.js',
            recommendation: 'For large datasets, consider more efficient algorithms like Quick Sort (O(n log n)) or Merge Sort (O(n log n)).',
            estimatedSavings: 'Up to 90% execution time for large N'
        },
        {
            id: 'PERF-JS-002',
            description: 'Repeated array lookups within nested loops could be optimized.',
            impact: 'Minor CPU overhead',
            severity: 'low',
            line: code.split('\n').findIndex(line => line.includes('arr.length - i - 1')) + 1,
            filePath: 'main.js',
            recommendation: 'Cache `arr.length` in a variable outside the loop to avoid repeated property access.'
        }
    ];
    return bottlenecks;
};

// Invented Service: `detectCodeSmells`
// Simulates integration with a code quality tool like SonarLint or ESLint (with advanced rules).
// This service helps maintain code health, readability, and consistency, reducing technical debt.
export const detectCodeSmells = async (code: string, settings: AnalysisSettings): Promise<CodeSmell[]> => {
    if (!settings.includeCodeSmellDetection) return [];
    console.log('[SmellService] Detecting code smells...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate quick scan
    const smells: CodeSmell[] = [
        {
            id: 'SMELL-JS-001',
            name: 'Long Method',
            description: 'The bubbleSort function, while small, could be split if it grew larger. For demonstration purposes, it highlights the principle.',
            category: 'Size',
            severity: 'info',
            line: code.split('\n').findIndex(line => line.includes('bubbleSort')) + 1,
            filePath: 'main.js',
            recommendation: 'Break down methods that perform multiple distinct operations into smaller, focused functions. Apply "Single Responsibility Principle".'
        },
        {
            id: 'SMELL-JS-002',
            name: 'Magic Number',
            description: 'The number `0` and `1` in factorial function might be considered magic numbers if their meaning isn\'t immediately clear.',
            category: 'Readability',
            severity: 'low',
            line: code.split('\n').findIndex(line => line.includes('if (n === 0)')) + 1,
            filePath: 'main.js',
            recommendation: 'Replace magic numbers with named constants to improve code readability and maintainability.'
        }
    ];
    return smells;
};

// Invented Service: `suggestCodeRefactorings`
// Simulates an AI-powered refactoring engine.
// This service provides concrete, actionable refactoring steps to improve code design.
export const suggestCodeRefactorings = async (code: string, settings: AnalysisSettings): Promise<RefactoringSuggestion[]> => {
    console.log('[RefactoringService] Generating refactoring suggestions...');
    await new Promise(resolve => setTimeout(resolve, 1300));
    const suggestions: RefactoringSuggestion[] = [
        {
            id: 'REF-JS-001',
            description: 'Introduce a `swap` helper function for cleaner array element exchange.',
            type: 'extract-method',
            line: code.split('\n').findIndex(line => line.includes('[arr[j], arr[j + 1]]')) + 1,
            filePath: 'main.js',
            codeSnippet: `[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];`,
            recommendation: `function swap(arr, idx1, idx2) { [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]]; } Then call swap(arr, j, j+1).`,
            effortEstimate: 'low'
        },
        {
            id: 'REF-JS-002',
            description: 'Consider making the Counter class properties private using # prefix (ECMAScript private class fields) for better encapsulation.',
            type: 'introduce-variable', // Represents conceptual change
            line: code.split('\n').findIndex(line => line.includes('this.count = initialValue')) + 1,
            filePath: 'main.js',
            codeSnippet: `this.count = initialValue;`,
            recommendation: `Change 'this.count' to '#count' and adjust all usages accordingly.`,
            effortEstimate: 'medium'
        }
    ];
    return suggestions;
};

// Invented Service: `calculateCodeMetrics`
// Calculates various quantitative metrics about the code.
// Essential for tracking code quality trends and enforcing coding standards in commercial projects.
export const calculateCodeMetrics = async (code: string): Promise<CodeMetric[]> => {
    console.log('[MetricsService] Calculating code metrics...');
    await new Promise(resolve => setTimeout(resolve, 500));
    const linesOfCode = code.split('\n').length;
    const functionsCount = (code.match(/\bfunction\s+\w+\b|\bconst\s+\w+\s*=\s*\([^)]*\)\s*=>|class\s+\w+/g) || []).length;
    const commentsCount = (code.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length;
    // Invented Feature: Advanced complexity metrics calculation.
    // In a real system, this would involve AST parsing and specific algorithms for Cyclomatic and Cognitive Complexity.
    const cyclomaticComplexity = Math.floor(Math.random() * 10) + 3; // Simulated
    const cognitiveComplexity = Math.floor(Math.random() * 8) + 2;   // Simulated

    return [
        { name: 'Lines of Code (LOC)', value: linesOfCode, unit: 'lines', description: 'Total number of lines in the code snippet.' },
        { name: 'Functions/Classes', value: functionsCount, unit: 'count', description: 'Number of functions and classes detected.' },
        { name: 'Comments', value: commentsCount, unit: 'count', description: 'Number of comment lines or blocks.' },
        { name: 'Cyclomatic Complexity', value: cyclomaticComplexity, unit: 'score', description: 'A quantitative measure of the number of linearly independent paths through a program\'s source code.' },
        { name: 'Cognitive Complexity', value: cognitiveComplexity, unit: 'score', description: 'Measures how hard code is to understand, specifically how difficult it is to mentally parse control flow.' },
        { name: 'Halstead Difficulty', value: (Math.random() * 100).toFixed(2), unit: 'score', description: 'Halstead complexity measures the quantitative relationship between software metrics and development effort.' }
    ];
};

// Invented Service: `generateDependencyGraphData`
// Generates data for visualizing module/component dependencies.
// Crucial for understanding codebase architecture and identifying耦合 (coupling) issues.
export const generateDependencyGraphData = async (code: string): Promise<{ nodes: DependencyGraphNode[]; edges: DependencyGraphEdge[] }> => {
    console.log('[DepGraphService] Generating dependency graph...');
    await new Promise(resolve => setTimeout(resolve, 700));
    // Invented Feature: Sophisticated dependency parsing, supporting various module systems.
    // In a real system, this would involve static analysis of import/export statements,
    // function calls across files, or component usage.
    const nodes: DependencyGraphNode[] = [
        { id: 'bubbleSort', label: 'bubbleSort.js', type: 'file' },
        { id: 'factorial', label: 'factorial.js', type: 'file' },
        { id: 'Counter', label: 'Counter.js', type: 'file' },
        { id: 'Array', label: 'Native Array', type: 'external-library' },
        { id: 'Error', label: 'Native Error', type: 'external-library' }
    ];

    const edges: DependencyGraphEdge[] = [
        { from: 'bubbleSort', to: 'Array', label: 'uses', type: 'uses' },
        { from: 'factorial', to: 'factorial', label: 'calls itself', type: 'calls' }, // Self-recursion
        { from: 'factorial', to: 'Error', label: 'throws', type: 'uses' }
    ];
    return { nodes, edges };
};

// Invented Service: `generateAbstractSyntaxTree`
// Generates a simplified Abstract Syntax Tree (AST) for the code.
// Useful for advanced developers and debugging, providing a structural view of the code.
export const generateAbstractSyntaxTree = async (code: string, settings: AnalysisSettings): Promise<AbstractSyntaxTree | undefined> => {
    if (!settings.generateAst) return undefined;
    console.log('[ASTService] Generating Abstract Syntax Tree...');
    await new Promise(resolve => setTimeout(resolve, 900));
    // Invented Feature: Language-agnostic AST generation.
    // In a real system, this would use a parser like Acorn (for JS), ANTLR, or Tree-sitter.
    const mockAst: AbstractSyntaxTree = {
        type: 'Program',
        children: [
            {
                type: 'VariableDeclaration',
                value: 'bubbleSort',
                children: [
                    { type: 'FunctionExpression', value: '(arr)', loc: { start: { line: 1, column: 0 }, end: { line: 10, column: 1 } } }
                ]
            },
            {
                type: 'VariableDeclaration',
                value: 'factorial',
                children: [
                    { type: 'FunctionExpression', value: '(n)', loc: { start: { line: 13, column: 0 }, end: { line: 20, column: 1 } } }
                ]
            },
            {
                type: 'ClassDeclaration',
                value: 'Counter',
                children: [
                    { type: 'MethodDefinition', value: 'constructor', loc: { start: { line: 24, column: 0 }, end: { line: 26, column: 1 } } },
                    { type: 'MethodDefinition', value: 'increment', loc: { start: { line: 28, column: 0 }, end: { line: 31, column: 1 } } },
                    { type: 'MethodDefinition', value: 'decrement', loc: { start: { line: 33, column: 0 }, end: { line: 36, column: 1 } } },
                    { type: 'MethodDefinition', value: 'reset', loc: { start: { line: 38, column: 0 }, end: { line: 41, column: 1 } } },
                    { type: 'AccessorProperty', value: 'countValue', loc: { start: { line: 43, column: 0 }, end: { line: 45, column: 1 } } }
                ]
            }
        ]
    };
    return mockAst;
};

// Invented Service: `retrieveCodeFromGitRepo`
// Simulates fetching code from a Git repository (e.g., GitHub, GitLab, Bitbucket).
// This service is essential for integrating the explainer into CI/CD pipelines or development workflows.
export const retrieveCodeFromGitRepo = async (repoUrl: string, branch: string = 'main', filePath?: string): Promise<string> => {
    console.log(`[GitService] Retrieving code from ${repoUrl}/${filePath || ''} on branch ${branch}...`);
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate cloning/fetching
    // Invented Feature: Git integration with authentication and file path specificity.
    // In a real implementation, this would involve using Octokit (for GitHub) or similar SDKs,
    // handling authentication tokens, and potentially cloning/fetching specific file content.
    if (repoUrl.includes('insecure-repo')) {
        throw new Error('Access denied to insecure-repo. Please use a secure repository.');
    }
    if (filePath && !filePath.endsWith('.js')) {
        return `// ${filePath} content (simulated):
        // This is a non-JavaScript file, demonstrating language flexibility.
        // For example, this could be a Python script or a configuration file.
        # Python example
        def hello_world():
            print("Hello from Python!")
        hello_world()`;
    }
    return `// Code retrieved from simulated Git repository: ${repoUrl}
// Branch: ${branch}, File: ${filePath || 'default_index.js'}

// This is a more complex Git-sourced code example.
// It includes multiple functions and potential interactions.
function processUserData(user) {
    if (!user || !user.id || !user.name) {
        console.error("Invalid user data provided.");
        return null;
    }
    const processedId = \`USR-\${user.id}\`;
    const fullName = user.name.firstName + " " + user.name.lastName;
    // Potentially sensitive operation, requiring security analysis
    console.log(\`Processing user \${fullName} with ID \${processedId}\`);
    return { id: processedId, name: fullName, timestamp: new Date().toISOString() };
}

// Another complex function
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return null;
    }
}
`;
};

// Invented Service: `uploadCodeToFileStorage`
// Simulates uploading an analysis report or code snippet to cloud storage (e.g., AWS S3, Google Cloud Storage).
// Provides persistence and archival capabilities, critical for enterprise data management.
export const uploadCodeToFileStorage = async (fileName: string, content: string, contentType: string = 'text/plain'): Promise<string> => {
    console.log(`[CloudStorageService] Uploading ${fileName} to cloud storage...`);
    await new Promise(resolve => setTimeout(resolve, 800));
    // Invented Feature: Cloud storage integration with metadata and access control.
    // In a real implementation, this would use AWS S3 SDK, Google Cloud Storage client, etc.
    const mockFileUrl = `https://citibankdemobusiness.cloudstorage.com/reports/${fileName}-${Date.now()}.json`;
    console.log(`[CloudStorageService] Upload complete. Accessible at: ${mockFileUrl}`);
    return mockFileUrl;
};

// Invented Service: `sendNotification`
// Simulates sending a notification via Slack, Email, or internal messaging system.
// For critical vulnerabilities or important analysis updates, this ensures timely communication.
export const sendNotification = async (channel: 'slack' | 'email' | 'teams', message: string, recipient?: string): Promise<boolean> => {
    console.log(`[NotificationService] Sending ${channel} notification to ${recipient || 'admin'}...`);
    await new Promise(resolve => setTimeout(resolve, 300));
    // Invented Feature: Multi-channel notification support, configurable based on event.
    // This would integrate with Slack APIs, SendGrid, Microsoft Graph, etc.
    console.log(`Notification sent: "${message}"`);
    return true;
};

// Invented Service: `logAuditEntry`
// Logs an audit trail entry for compliance and security monitoring.
// Essential for commercial applications to track user actions and system behavior.
export const logAuditEntry = async (eventType: string, userId: string, details: any): Promise<boolean> => {
    console.log(`[AuditService] Logging audit entry for user ${userId}: ${eventType}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    // Invented Feature: Comprehensive audit logging for regulatory compliance (e.g., SOX, GDPR).
    // This would send data to a centralized logging system like Splunk, ELK stack, or a dedicated audit database.
    console.log('Audit Entry:', { eventType, userId, timestamp: new Date().toISOString(), details });
    return true;
};

// Invented Component: `ASTViewer`
// A simplified component to visualize the Abstract Syntax Tree.
export const ASTViewer: React.FC<{ ast: AbstractSyntaxTree }> = ({ ast }) => {
    const renderNode = (node: AbstractSyntaxTree, depth: number = 0) => (
        <div key={`${node.type}-${node.value}-${depth}-${Math.random()}`} className="ml-4 border-l border-border pl-2">
            <span className="font-mono text-xs text-blue-400">{node.type}</span>
            {node.value && <span className="text-sm text-text-primary ml-1">({node.value})</span>}
            {node.loc && <span className="text-gray-500 ml-2 text-xs">L{node.loc.start.line}:{node.loc.start.column}</span>}
            {node.children && (
                <div className="mt-1">
                    {node.children.map(child => renderNode(child, depth + 1))}
                </div>
            )}
        </div>
    );
    if (!ast) return <p className="text-text-secondary">AST data not available.</p>;
    return (
        <div className="font-mono text-sm max-h-96 overflow-auto bg-background p-3 rounded-md border border-border">
            {renderNode(ast)}
        </div>
    );
};

// Invented Component: `DependencyGraphVisualization`
// Component to render dependency graphs using a custom SVG or a simple list.
export const DependencyGraphVisualization: React.FC<{ nodes: DependencyGraphNode[]; edges: DependencyGraphEdge[] }> = ({ nodes, edges }) => {
    // Invented Feature: Basic in-browser dependency graph rendering or data display.
    // For advanced visualization, integration with D3.js, React Flow, or GoJS would be necessary.
    if (!nodes || nodes.length === 0) return <p className="text-text-secondary">Dependency data not available.</p>;

    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">Nodes ({nodes.length})</h3>
                <ul className="list-disc list-inside text-sm text-text-primary max-h-48 overflow-auto">
                    {nodes.map(node => (
                        <li key={node.id} className="font-mono">{node.label} <span className="text-text-secondary">({node.type})</span></li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Edges ({edges.length})</h3>
                <ul className="list-disc list-inside text-sm text-text-primary max-h-48 overflow-auto">
                    {edges.map((edge, index) => (
                        <li key={index} className="font-mono">
                            {nodeMap.get(edge.from)?.label || edge.from} --({edge.label || edge.type})--&gt; {nodeMap.get(edge.to)?.label || edge.to}
                        </li>
                    ))}
                </ul>
            </div>
            <p className="text-text-secondary text-sm italic mt-4">
                (Invented Feature: This is a textual representation. In a full commercial product,
                this would be an interactive SVG graph generated by libraries like D3.js or GoJS.)
            </p>
        </div>
    );
};

// Invented Component: `CodeInputPanel`
// Manages different code input methods (manual, file upload, URL, Git).
export const CodeInputPanel: React.FC<{
    code: string;
    setCode: (code: string) => void;
    currentSource: CodeInputSource;
    setCurrentSource: (source: CodeInputSource) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    preRef: React.RefObject<HTMLPreElement>;
    handleScroll: () => void;
    highlightedCode: string;
    onGitFetch: (repoUrl: string, branch: string, filePath?: string) => Promise<void>;
    isLoading: boolean;
}> = ({ code, setCode, currentSource, setCurrentSource, textareaRef, preRef, handleScroll, highlightedCode, onGitFetch, isLoading }) => {
    // Invented Feature: Dynamic input method switching.
    const [gitRepoUrl, setGitRepoUrl] = useState<string>('');
    const [gitBranch, setGitBranch] = useState<string>('main');
    const [gitFilePath, setGitFilePath] = useState<string>('');
    const [fileUploadError, setFileUploadError] = useState<string>('');

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFileUploadError('');
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024 * 5) { // 5MB limit for demonstration
                setFileUploadError('File size exceeds 5MB limit.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setCode(content);
                setFileUploadError('');
            };
            reader.onerror = () => {
                setFileUploadError('Failed to read file.');
            };
            reader.readAsText(file);
        }
    }, [setCode]);

    const handleGitFetchClick = useCallback(async () => {
        if (!gitRepoUrl.trim()) {
            setFileUploadError('Git repository URL cannot be empty.');
            return;
        }
        await onGitFetch(gitRepoUrl, gitBranch, gitFilePath);
        setFileUploadError('');
    }, [gitRepoUrl, gitBranch, gitFilePath, onGitFetch]);

    return (
        <div className="flex flex-col min-h-0 md:col-span-1">
            <label htmlFor="code-input" className="text-sm font-medium text-text-secondary mb-2">Your Code</label>
            {/* Invented Feature: Input Source Selection Tabs */}
            <div className="flex-shrink-0 flex border-b border-border mb-4">
                {(['manual', 'file', 'git'] as CodeInputSource[]).map(source => (
                    <button key={source} onClick={() => setCurrentSource(source)}
                        className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${currentSource === source ? 'bg-background text-primary font-semibold' : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                        {source}
                    </button>
                ))}
            </div>

            {currentSource === 'manual' && (
                <div className="relative flex-grow bg-surface border border-border rounded-md focus-within:ring-2 focus-within:ring-primary overflow-hidden">
                    <textarea
                        ref={textareaRef}
                        id="code-input"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onScroll={handleScroll}
                        placeholder="Paste your code here..."
                        spellCheck="false"
                        className="absolute inset-0 w-full h-full p-4 bg-transparent resize-none font-mono text-sm text-transparent caret-primary outline-none z-10"
                    />
                    <pre
                        ref={preRef}
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full p-4 font-mono text-sm text-text-primary pointer-events-none z-0 whitespace-pre-wrap overflow-auto no-scrollbar"
                        dangerouslySetInnerHTML={{ __html: highlightedCode + '\n' }}
                    />
                </div>
            )}

            {currentSource === 'file' && (
                <div className="flex-grow flex flex-col items-center justify-center border border-border rounded-md bg-surface p-4">
                    <input type="file" onChange={handleFileChange} className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark" />
                    {fileUploadError && <p className="text-red-500 text-sm mt-2">{fileUploadError}</p>}
                    <p className="text-text-secondary text-xs mt-2">Max file size: 5MB. Supports all text-based code files.</p>
                </div>
            )}

            {currentSource === 'git' && (
                <div className="flex-grow flex flex-col justify-start border border-border rounded-md bg-surface p-4 space-y-3">
                    <label className="block text-sm font-medium text-text-secondary">Git Repository URL</label>
                    <input type="text" value={gitRepoUrl} onChange={(e) => setGitRepoUrl(e.target.value)}
                        placeholder="e.g., https://github.com/org/repo"
                        className="input-field" />

                    <label className="block text-sm font-medium text-text-secondary">Branch (optional, default: main)</label>
                    <input type="text" value={gitBranch} onChange={(e) => setGitBranch(e.target.value)}
                        placeholder="e.g., main, dev"
                        className="input-field" />

                    <label className="block text-sm font-medium text-text-secondary">File Path (optional, e.g., src/index.js)</label>
                    <input type="text" value={gitFilePath} onChange={(e) => setGitFilePath(e.target.value)}
                        placeholder="e.g., components/myComponent.js"
                        className="input-field" />

                    <button onClick={handleGitFetchClick} disabled={isLoading || !gitRepoUrl.trim()}
                        className="btn-secondary w-full flex items-center justify-center px-6 py-3">
                        {isLoading ? <LoadingSpinner /> : 'Fetch from Git'}
                    </button>
                    {fileUploadError && <p className="text-red-500 text-sm mt-2">{fileUploadError}</p>}
                    <p className="text-text-secondary text-xs mt-2">
                        (Invented Feature: This integrates with a simulated Git service. In production,
                        it would use GitHub/GitLab/Bitbucket APIs with appropriate authentication.)
                    </p>
                </div>
            )}
        </div>
    );
};

// Invented Component: `AnalysisSettingsPanel`
// Provides controls for configuring analysis parameters.
export const AnalysisSettingsPanel: React.FC<{
    settings: AnalysisSettings;
    onSettingsChange: (newSettings: Partial<AnalysisSettings>) => void;
}> = ({ settings, onSettingsChange }) => {
    // Invented Feature: User-configurable analysis parameters for fine-grained control.
    // This allows tailoring the analysis to specific needs (e.g., prioritizing security, or detailed performance).
    return (
        <div className="p-4 border-t border-border mt-4 flex-shrink-0 bg-background rounded-md shadow-inner">
            <h3 className="text-lg font-semibold mb-3 text-text-primary">Analysis Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="aiModel" className="block text-sm font-medium text-text-secondary">AI Model</label>
                    <select id="aiModel" value={settings.aiModel} onChange={(e) => onSettingsChange({ aiModel: e.target.value as CodeExplanationModel })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-surface text-text-primary">
                        <option value="gemini">Google Gemini (Advanced)</option>
                        <option value="chatgpt">OpenAI ChatGPT (Conversational)</option>
                        <option value="custom-finetuned">Citibank FT-CodeBot (Proprietary)</option>
                        <option value="code-llama">Code Llama (Open Source)</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <input id="deepScan" type="checkbox" checked={settings.deepScan} onChange={(e) => onSettingsChange({ deepScan: e.target.checked })}
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                    <label htmlFor="deepScan" className="ml-2 block text-sm text-text-secondary">Deep Scan (More thorough, slower)</label>
                </div>
                <div className="flex items-center">
                    <input id="securityScan" type="checkbox" checked={settings.includeSecurityScan} onChange={(e) => onSettingsChange({ includeSecurityScan: e.target.checked })}
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                    <label htmlFor="securityScan" className="ml-2 block text-sm text-text-secondary">Security Scan (SAST)</label>
                </div>
                <div className="flex items-center">
                    <input id="performanceScan" type="checkbox" checked={settings.includePerformanceScan} onChange={(e) => onSettingsChange({ includePerformanceScan: e.target.checked })}
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                    <label htmlFor="performanceScan" className="ml-2 block text-sm text-text-secondary">Performance Analysis</label>
                </div>
                <div className="flex items-center">
                    <input id="codeSmellScan" type="checkbox" checked={settings.includeCodeSmellDetection} onChange={(e) => onSettingsChange({ includeCodeSmellDetection: e.target.checked })}
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                    <label htmlFor="codeSmellScan" className="ml-2 block text-sm text-text-secondary">Code Smell Detection</label>
                </div>
                <div className="flex items-center">
                    <input id="generateAst" type="checkbox" checked={settings.generateAst} onChange={(e) => onSettingsChange({ generateAst: e.target.checked })}
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                    <label htmlFor="generateAst" className="ml-2 block text-sm text-text-secondary">Generate AST</label>
                </div>
                <div className="flex items-center">
                    <input id="generateDependencyGraph" type="checkbox" checked={settings.generateDependencyGraph} onChange={(e) => onSettingsChange({ generateDependencyGraph: e.target.checked })}
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                    <label htmlFor="generateDependencyGraph" className="ml-2 block text-sm text-text-secondary">Generate Dependency Graph</label>
                </div>
                <div>
                    <label htmlFor="targetLanguage" className="block text-sm font-medium text-text-secondary">Target Language</label>
                    <input id="targetLanguage" type="text" value={settings.targetLanguage} onChange={(e) => onSettingsChange({ targetLanguage: e.target.value })}
                        placeholder="javascript"
                        className="mt-1 input-field" />
                </div>
                <div>
                    <label htmlFor="maxTokens" className="block text-sm font-medium text-text-secondary">Max Tokens (AI)</label>
                    <input id="maxTokens" type="number" value={settings.maxTokens || ''} onChange={(e) => onSettingsChange({ maxTokens: parseInt(e.target.value) || undefined })}
                        placeholder="2048"
                        className="mt-1 input-field" />
                </div>
                <div>
                    <label htmlFor="temperature" className="block text-sm font-medium text-text-secondary">Temperature (AI)</label>
                    <input id="temperature" type="number" step="0.1" min="0" max="1" value={settings.temperature || ''} onChange={(e) => onSettingsChange({ temperature: parseFloat(e.target.value) || undefined })}
                        placeholder="0.7"
                        className="mt-1 input-field" />
                </div>
                <div>
                    <label htmlFor="environment" className="block text-sm font-medium text-text-secondary">Environment</label>
                    <select id="environment" value={settings.environment} onChange={(e) => onSettingsChange({ environment: e.target.value as AnalysisSettings['environment'] })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-surface text-text-primary">
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                    </select>
                </div>
            </div>
            <p className="text-text-secondary text-xs mt-4">
                (Invented Feature: API Keys management, though not fully implemented in UI, would be managed securely in a production system,
                potentially through an environment variable system or a dedicated secrets manager like AWS Secrets Manager or HashiCorp Vault.)
            </p>
        </div>
    );
};

export const AiCodeExplainer: React.FC<{ initialCode?: string }> = ({ initialCode }) => {
    // Invented State: `code` now supports multiple input sources.
    const [code, setCode] = useState<string>(initialCode || exampleCode);
    const [explanation, setExplanation] = useState<ComprehensiveCodeAnalysisReport | null>(null);
    const [mermaidCode, setMermaidCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<ExplanationTab>('summary');
    const [themeState] = useTheme();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const mermaidContainerRef = useRef<HTMLDivElement>(null);

    // Invented State: Manages the active code input source.
    const [codeInputSource, setCodeInputSource] = useState<CodeInputSource>('manual');
    // Invented State: Manages user-configurable analysis settings.
    const [analysisSettings, setAnalysisSettings] = useState<AnalysisSettings>(() => ({
        aiModel: 'gemini',
        deepScan: true,
        includeSecurityScan: true,
        includePerformanceScan: true,
        includeCodeSmellDetection: true,
        generateAst: true,
        generateDependencyGraph: true,
        targetLanguage: 'javascript',
        apiKeys: {}, // Placeholder, actual keys would be managed server-side or via secure environment variables
        environment: 'development',
        maxTokens: 3000,
        temperature: 0.7
    }));

    // Invented Callback: `handleAnalysisSettingsChange`
    // Allows updating specific analysis settings without replacing the entire object.
    const handleAnalysisSettingsChange = useCallback((newSettings: Partial<AnalysisSettings>) => {
        setAnalysisSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
    }, []);

    // Invented Callback: `handleGitFetchAndAnalyze`
    // Orchestrates fetching code from Git and initiating analysis.
    const handleGitFetchAndAnalyze = useCallback(async (repoUrl: string, branch: string, filePath?: string) => {
        setIsLoading(true);
        setError('');
        setCode(''); // Clear existing code while fetching
        setExplanation(null);
        setMermaidCode('');
        try {
            const fetchedCode = await retrieveCodeFromGitRepo(repoUrl, branch, filePath);
            setCode(fetchedCode);
            // After fetching, immediately analyze the new code.
            await handleExplain(fetchedCode, analysisSettings);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during Git fetch.';
            setError(`Failed to fetch code from Git: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [handleExplain, analysisSettings]);


    // Invented Callback: `handleExplain`
    // This is the core orchestration function, combining multiple AI and external services.
    // It's designed to be robust, handle errors, and manage different analysis phases.
    const handleExplain = useCallback(async (codeToExplain: string, settings: AnalysisSettings) => {
        if (!codeToExplain.trim()) {
            setError('Please enter some code to explain.');
            return;
        }
        setIsLoading(true);
        setError('');
        setExplanation(null);
        setMermaidCode('');
        setActiveTab('summary');

        await logAuditEntry('CodeAnalysisInitiated', 'user_session_123', { codeLength: codeToExplain.length, settings }); // Invented Service Call: Audit log

        try {
            // Invented Feature: Parallel execution of multiple sophisticated analysis services.
            // This pipeline approach significantly speeds up comprehensive analysis for commercial use.
            const [
                structuredExplanationResult,
                mermaidResult,
                geminiAnalysis,
                chatgptAnalysis,
                securityVulnerabilities,
                performanceBottlenecks,
                codeSmells,
                refactoringSuggestions,
                codeMetrics,
                dependencyGraph,
                ast
            ] = await Promise.all([
                // Standard explanation service, now enhanced to integrate with specific AI models
                explainCodeStructured(codeToExplain, settings.aiModel === 'gemini' ? callGeminiApi : callChatGPTApi, settings),
                generateMermaidJs(codeToExplain),
                callGeminiApi(codeToExplain, settings, `Provide a deep technical analysis for the following ${settings.targetLanguage} code, focusing on core logic, potential optimizations, and complex patterns.`),
                callChatGPTApi(codeToExplain, settings, `Summarize the following ${settings.targetLanguage} code, provide high-level architectural notes, and suggest comprehensive unit tests.`),
                analyzeSecurityWithSAST(codeToExplain, settings),
                analyzePerformanceMetrics(codeToExplain, settings),
                detectCodeSmells(codeToExplain, settings),
                suggestCodeRefactorings(codeToExplain, settings),
                calculateCodeMetrics(codeToExplain),
                generateDependencyGraphData(codeToExplain),
                generateAbstractSyntaxTree(codeToExplain, settings)
            ]);

            // Invented Feature: Aggregating results from diverse sources into a single, comprehensive report.
            const comprehensiveReport: ComprehensiveCodeAnalysisReport = {
                ...structuredExplanationResult as StructuredExplanation, // Cast back to basic for base properties
                summary: (structuredExplanationResult as StructuredExplanation).summary + `\n\n**Gemini Deep Insight:** ${geminiAnalysis.geminiAnalysis || ''}\n\n**ChatGPT Overview:** ${chatgptAnalysis.chatgptSummary || ''}`,
                securityVulnerabilities: securityVulnerabilities.concat(geminiAnalysis.securityObservations || []),
                performanceBottlenecks: performanceBottlenecks.concat(geminiAnalysis.performanceNotes || []),
                codeSmells: codeSmells,
                refactoringSuggestions: refactoringSuggestions.concat(geminiAnalysis.refactoringSuggestions || []),
                metrics: codeMetrics,
                dependencies: dependencyGraph,
                ast: ast,
                testingSuggestions: chatgptAnalysis.testingSuggestions || [],
                architecturalNotes: chatgptAnalysis.architecturalNotes || '',
                aiModelsUsed: [settings.aiModel, 'gemini', 'chatgpt', 'custom-finetuned'], // Example of multiple models contributing
                analysisTimestamp: new Date().toISOString(),
                rawData: {
                    gemini: geminiAnalysis,
                    chatgpt: chatgptAnalysis,
                    mermaidRaw: mermaidResult
                }
            };

            setExplanation(comprehensiveReport);
            setMermaidCode(mermaidResult.replace(/```mermaid\n|```/g, ''));

            await uploadCodeToFileStorage(`analysis-report-${Date.now()}.json`, JSON.stringify(comprehensiveReport), 'application/json'); // Invented Service Call: Cloud storage for reports
            if (securityVulnerabilities.some(v => v.severity === 'critical')) {
                await sendNotification('slack', `Critical vulnerabilities detected in code analysis! Review report immediately.`); // Invented Service Call: Notification
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to get explanation: ${errorMessage}. Please check your code and API configurations.`);
            await logAuditEntry('CodeAnalysisFailed', 'user_session_123', { error: errorMessage, codeLength: codeToExplain.length }); // Invented Service Call: Audit log on failure
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialCode) {
            setCode(initialCode);
            handleExplain(initialCode, analysisSettings);
        }
    }, [initialCode, handleExplain, analysisSettings]);

    // Invented Feature: Responsive Mermaid theme based on global theme state.
    // Ensures consistent UI/UX across the application.
    useEffect(() => {
        const renderMermaid = async () => {
             if (activeTab === 'flowchart' && mermaidCode && mermaidContainerRef.current) {
                try {
                    mermaid.initialize({ startOnLoad: false, theme: themeState.mode === 'dark' ? 'dark' : 'neutral', securityLevel: 'loose' });
                    mermaidContainerRef.current.innerHTML = ''; // Clear previous
                    const { svg } = await mermaid.render(`mermaid-graph-${Date.now()}`, mermaidCode);
                    mermaidContainerRef.current.innerHTML = svg;
                } catch (e) {
                    console.error("Mermaid rendering error:", e);
                    mermaidContainerRef.current.innerHTML = `<p class="text-red-500">Error rendering flowchart.</p>`;
                }
            }
        }
        renderMermaid();
    }, [activeTab, mermaidCode, themeState.mode]);


    const handleScroll = () => {
        if (preRef.current && textareaRef.current) {
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    const highlightedCode = useMemo(() => simpleSyntaxHighlight(code), [code]);

    // Invented Function: `renderTabContent`
    // Renders content for each expanded analysis tab, providing a rich, multi-faceted view.
    const renderTabContent = () => {
        if (!explanation) return null;
        switch(activeTab) {
            case 'summary':
                return <MarkdownRenderer content={explanation.summary} />;
            case 'lineByLine':
                return (
                    <div className="space-y-3">
                        {explanation.lineByLine.map((item, index) => (
                            <div key={index} className="p-3 bg-background rounded-md border border-border">
                                <p className="font-mono text-xs text-primary mb-1">Lines: {item.lines}</p>
                                <p className="text-sm">{item.explanation}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'complexity':
                return (
                    <div>
                        <p><strong>Time Complexity:</strong> <span className="font-mono text-amber-600">{explanation.complexity.time}</span></p>
                        <p><strong>Space Complexity:</strong> <span className="font-mono text-amber-600">{explanation.complexity.space}</span></p>
                        {explanation.complexity.cyclomatic && <p><strong>Cyclomatic Complexity:</strong> <span className="font-mono text-amber-600">{explanation.complexity.cyclomatic}</span></p>}
                        {explanation.complexity.cognitive && <p><strong>Cognitive Complexity:</strong> <span className="font-mono text-amber-600">{explanation.complexity.cognitive}</span></p>}
                    </div>
                );
            case 'suggestions':
                return (
                     <ul className="list-disc list-inside space-y-2">
                        {explanation.suggestions.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                );
            case 'security': // Invented Feature: Security Tab
                return explanation.securityVulnerabilities.length > 0 ? (
                    <div className="space-y-4">
                        {explanation.securityVulnerabilities.map((vuln, index) => (
                            <div key={index} className="p-3 bg-background rounded-md border border-border shadow-sm">
                                <p className={`font-semibold text-lg ${vuln.severity === 'critical' ? 'text-red-600' : vuln.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'}`}>
                                    {vuln.description} <span className="text-sm">({vuln.severity.toUpperCase()})</span>
                                </p>
                                <p className="text-xs text-text-secondary mt-1">ID: {vuln.id} | CWE: {vuln.cwe} | OWASP: {vuln.owaspTop10}</p>
                                <p className="text-sm mt-2">{vuln.recommendation}</p>
                                <p className="font-mono text-xs text-gray-500 mt-1">Line: {vuln.line} {vuln.filePath ? `in ${vuln.filePath}` : ''}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-text-secondary">No significant security vulnerabilities detected. (Or security scan was not enabled.)</p>;
            case 'performance': // Invented Feature: Performance Tab
                return explanation.performanceBottlenecks.length > 0 ? (
                    <div className="space-y-4">
                        {explanation.performanceBottlenecks.map((bottleneck, index) => (
                            <div key={index} className="p-3 bg-background rounded-md border border-border shadow-sm">
                                <p className={`font-semibold text-lg ${bottleneck.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'}`}>
                                    {bottleneck.description} <span className="text-sm">({bottleneck.severity.toUpperCase()})</span>
                                </p>
                                <p className="text-xs text-text-secondary mt-1">Impact: {bottleneck.impact}</p>
                                <p className="text-sm mt-2">{bottleneck.recommendation}</p>
                                {bottleneck.estimatedSavings && <p className="text-xs text-gray-500 mt-1">Estimated Savings: {bottleneck.estimatedSavings}</p>}
                                <p className="font-mono text-xs text-gray-500 mt-1">Line: {bottleneck.line} {bottleneck.filePath ? `in ${bottleneck.filePath}` : ''}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-text-secondary">No major performance bottlenecks identified. (Or performance scan was not enabled.)</p>;
            case 'smells': // Invented Feature: Code Smells Tab
                return explanation.codeSmells.length > 0 ? (
                    <div className="space-y-4">
                        {explanation.codeSmells.map((smell, index) => (
                            <div key={index} className="p-3 bg-background rounded-md border border-border shadow-sm">
                                <p className="font-semibold text-lg text-primary">{smell.name}</p>
                                <p className="text-xs text-text-secondary mt-1">Category: {smell.category} | Severity: {smell.severity}</p>
                                <p className="text-sm mt-2">{smell.description}</p>
                                <p className="text-sm mt-1">{smell.recommendation}</p>
                                <p className="font-mono text-xs text-gray-500 mt-1">Line: {smell.line} {smell.filePath ? `in ${smell.filePath}` : ''}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-text-secondary">No significant code smells detected. (Or code smell detection was not enabled.)</p>;
            case 'refactoring': // Invented Feature: Refactoring Tab
                return explanation.refactoringSuggestions.length > 0 ? (
                    <div className="space-y-4">
                        {explanation.refactoringSuggestions.map((suggestion, index) => (
                            <div key={index} className="p-3 bg-background rounded-md border border-border shadow-sm">
                                <p className="font-semibold text-lg text-primary">{suggestion.description}</p>
                                <p className="text-xs text-text-secondary mt-1">Type: {suggestion.type} | Effort: {suggestion.effortEstimate || 'N/A'}</p>
                                {suggestion.codeSnippet && (
                                    <pre className="bg-surface-dark p-2 text-xs font-mono rounded mt-2 overflow-auto">
                                        <code>{suggestion.codeSnippet}</code>
                                    </pre>
                                )}
                                <p className="text-sm mt-2">{suggestion.recommendation}</p>
                                <p className="font-mono text-xs text-gray-500 mt-1">Line: {suggestion.line} {suggestion.filePath ? `in ${suggestion.filePath}` : ''}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-text-secondary">No specific refactoring suggestions at this time.</p>;
            case 'metrics': // Invented Feature: Metrics Tab
                return explanation.metrics.length > 0 ? (
                    <div className="space-y-4">
                        {explanation.metrics.map((metric, index) => (
                            <div key={index} className="p-3 bg-background rounded-md border border-border shadow-sm">
                                <p className="font-semibold text-lg text-primary">{metric.name}</p>
                                <p className="text-sm text-text-primary"><strong>Value:</strong> <span className="font-mono text-amber-600">{metric.value} {metric.unit}</span></p>
                                <p className="text-sm text-text-secondary mt-1">{metric.description}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-text-secondary">No code metrics calculated.</p>;
            case 'dependencies': // Invented Feature: Dependencies Tab
                return explanation.dependencies ? (
                    <DependencyGraphVisualization nodes={explanation.dependencies.nodes} edges={explanation.dependencies.edges} />
                ) : <p className="text-text-secondary">Dependency graph data not available. (Or graph generation was not enabled.)</p>;
            case 'ast': // Invented Feature: AST Tab
                return explanation.ast ? (
                    <ASTViewer ast={explanation.ast} />
                ) : <p className="text-text-secondary">Abstract Syntax Tree not available. (Or AST generation was not enabled.)</p>;
            case 'testing': // Invented Feature: Testing Suggestions Tab
                return explanation.testingSuggestions.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                        {explanation.testingSuggestions.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                ) : <p className="text-text-secondary">No specific testing suggestions at this time.</p>;
            case 'architecture': // Invented Feature: Architectural Notes Tab
                return explanation.architecturalNotes ? (
                    <MarkdownRenderer content={explanation.architecturalNotes} />
                ) : <p className="text-text-secondary">No architectural notes available.</p>;
            case 'flowchart':
                return (
                    <div ref={mermaidContainerRef} className="w-full h-full flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                );
            default:
                return <p className="text-text-secondary">Select a tab to view analysis.</p>;
        }
    }

    // Invented Feature: Comprehensive Tab List for multi-faceted analysis.
    const allExplanationTabs: ExplanationTab[] = [
        'summary', 'lineByLine', 'complexity', 'suggestions', 'security', 'performance',
        'smells', 'refactoring', 'metrics', 'dependencies', 'ast', 'testing', 'architecture', 'flowchart'
    ];

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary">
            <header className="mb-6 flex-shrink-0">
                <h1 className="text-3xl font-bold flex items-center">
                    <CpuChipIcon />
                    <span className="ml-3">AI Code Explainer (Project Chimera)</span>
                </h1>
                <p className="text-text-secondary mt-1">Get a detailed, structured, and multi-dimensional analysis of any code snippet.</p>
            </header>

            {/* Invented Feature: Global analysis settings panel */}
            <AnalysisSettingsPanel settings={analysisSettings} onSettingsChange={handleAnalysisSettingsChange} />

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 mt-6">

                {/* Left Column: Code Input */}
                <CodeInputPanel
                    code={code}
                    setCode={setCode}
                    currentSource={codeInputSource}
                    setCurrentSource={setCodeInputSource}
                    textareaRef={textareaRef}
                    preRef={preRef}
                    handleScroll={handleScroll}
                    highlightedCode={highlightedCode}
                    onGitFetch={handleGitFetchAndAnalyze}
                    isLoading={isLoading}
                />
                <div className="mt-4 flex-shrink-0 md:col-span-1">
                    <button
                        onClick={() => handleExplain(code, analysisSettings)}
                        disabled={isLoading}
                        className="btn-primary w-full flex items-center justify-center px-6 py-3"
                    >
                        {isLoading ? <LoadingSpinner/> : 'Perform Comprehensive Analysis'}
                    </button>
                    {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                </div>

                {/* Right Column: AI Analysis Output */}
                <div className="flex flex-col min-h-0 md:col-span-1 row-span-2"> {/* Takes up more vertical space */}
                    <label className="text-sm font-medium text-text-secondary mb-2">AI Analysis Report</label>
                    <div className="relative flex-grow flex flex-col bg-surface border border-border rounded-md overflow-hidden">
                        <div className="flex-shrink-0 flex border-b border-border overflow-x-auto custom-scrollbar"> {/* Added custom scrollbar for many tabs */}
                           {allExplanationTabs.map(tab => (
                               <button key={tab} onClick={() => setActiveTab(tab)} disabled={!explanation}
                                className={`flex-shrink-0 px-4 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-background text-primary font-semibold' : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-700 disabled:text-gray-400 dark:disabled:text-slate-500'}`}>
                                   {tab.replace(/([A-Z])/g, ' $1')}
                               </button>
                           ))}
                        </div>
                        <div className="p-4 flex-grow overflow-y-auto">
                            {isLoading && <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>}
                            {explanation && !isLoading && renderTabContent()}
                            {!isLoading && !explanation && !error && <div className="text-text-secondary h-full flex items-center justify-center">The comprehensive analysis will appear here. Configure settings and click "Perform Comprehensive Analysis".</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Invented Feature: Footer with version and copyright information, crucial for commercial products. */}
            <footer className="mt-8 text-xs text-text-secondary text-center flex-shrink-0">
                <p>&copy; {new Date().getFullYear()} Citibank Demo Business Inc. All rights reserved.</p>
                <p>Project Chimera - AI Code Explainer v5.3.7 (Enterprise Edition)</p>
                <p>Powered by Gemini, ChatGPT, and proprietary deep-learning models.</p>
                <p className="mt-2 italic">Disclaimer: This tool is for illustrative and analytical purposes. Always review and validate AI-generated suggestions.</p>
            </footer>
        </div>
    );
};
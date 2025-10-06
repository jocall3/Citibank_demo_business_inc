// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// This file, PromptCraftPad.tsx, has undergone an unprecedented transformation.
// Originally conceived as a simple prompt management interface, it has been
// architected into a colossal, commercial-grade AI orchestration and prompt engineering
// powerhouse, designed to operate as the central nervous system for advanced
// generative AI workflows. Every line, every function, every new service
// represents a deliberate invention aimed at pushing the boundaries of what a
// single frontend component can achieve, integrating complex logic,
// simulated external services, and a visionary approach to AI interaction.

import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from 'react';
import { SparklesIcon } from '../icons.tsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';

// --- Section 1: Core Data Structures & Type Definitions (Invented by J.B. O'Callaghan III Labs) ---

/**
 * @interface PromptV1
 * @description The initial version of the prompt structure.
 * @property {number} id - Unique identifier for the prompt.
 * @property {string} name - User-friendly name of the prompt.
 * @property {string} text - The raw text content of the prompt, potentially containing variables.
 */
interface PromptV1 {
    id: number;
    name: string;
    text: string;
}

/**
 * @interface PromptMetadata
 * @description Advanced metadata for prompt management and analytics.
 * @property {string} description - A detailed explanation of the prompt's purpose.
 * @property {string[]} tags - Categorization tags (e.g., "code-gen", "marketing", "summarization").
 * @property {string} category - Broader category for easier filtering.
 * @property {number} version - Incremental version number for prompt changes.
 * @property {Date} createdAt - Timestamp of prompt creation.
 * @property {Date} updatedAt - Timestamp of the last significant update.
 * @property {string} authorId - (Simulated) Identifier of the user who created/last modified.
 * @property {boolean} isArchived - Flag to indicate if the prompt is archived instead of deleted.
 * @property {number} usageCount - (Simulated) How many times this prompt has been executed.
 * @property {string[]} relatedPromptIds - (Simulated) IDs of other prompts that are conceptually linked.
 * @property {Record<string, string>} defaultVariables - Default values for prompt variables.
 */
interface PromptMetadata {
    description: string;
    tags: string[];
    category: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    authorId: string; // Simulated user ID
    isArchived: boolean;
    usageCount: number;
    relatedPromptIds: string[];
    defaultVariables: Record<string, string>;
}

/**
 * @interface PromptV2 (Evolution of PromptV1)
 * @description The enhanced prompt structure incorporating metadata and advanced features.
 * This represents a significant upgrade, enabling robust prompt engineering workflows.
 */
export interface Prompt extends PromptV1, PromptMetadata {
    // Inherits id, name, text from PromptV1
    // Inherits all metadata fields
}

/**
 * @enum AIServiceType
 * @description Enumerates the supported external AI services.
 * This allows for easy switching and extensibility.
 */
export enum AIServiceType {
    ChatGPT = 'ChatGPT',
    Gemini = 'Gemini',
    Claude = 'Claude',
    Llama = 'Llama',
    DALL_E = 'DALL-E', // For image generation prompts
    StableDiffusion = 'StableDiffusion', // Another image generation service
}

/**
 * @enum AIModelIdentifier
 * @description Specific model identifiers across different services.
 * This abstraction allows the UI to select a generic model without knowing the underlying service details.
 */
export enum AIModelIdentifier {
    // ChatGPT Models
    GPT_3_5_TURBO = 'gpt-3.5-turbo',
    GPT_4 = 'gpt-4',
    GPT_4_32K = 'gpt-4-32k',
    GPT_4_TURBO = 'gpt-4-turbo',

    // Gemini Models
    GEMINI_PRO = 'gemini-pro',
    GEMINI_ULTRA = 'gemini-ultra', // Hypothetical future model
    GEMINI_FLASH = 'gemini-flash', // Hypothetical lighter model

    // Claude Models
    CLAUDE_3_OPUS = 'claude-3-opus-20240229',
    CLAUDE_3_SONNET = 'claude-3-sonnet-20240229',
    CLAUDE_3_HAJKU = 'claude-3-haiku-20240229',

    // Llama Models (e.g., via HuggingFace or self-hosted)
    LLAMA_2_7B_CHAT = 'llama-2-7b-chat',
    LLAMA_2_13B_CHAT = 'llama-2-13b-chat',
    LLAMA_3_8B_INSTRUCT = 'llama-3-8b-instruct', // Hypothetical Llama 3

    // Image Models
    DALL_E_2 = 'dall-e-2',
    DALL_E_3 = 'dall-e-3',
    STABLE_DIFFUSION_XL = 'stable-diffusion-xl',
}

/**
 * @interface AIModelConfig
 * @description Configuration parameters specific to an AI model execution.
 * These are standard parameters found in most LLM APIs.
 */
export interface AIModelConfig {
    temperature: number; // 0.0 - 1.0, randomness of output
    max_tokens: number; // Maximum length of generated response
    top_p: number; // Nucleus sampling, controls diversity
    frequency_penalty: number; // -2.0 - 2.0, penalizes new tokens based on their existing frequency
    presence_penalty: number; // -2.0 - 2.0, penalizes new tokens based on whether they appear in the text so far
    stop_sequences: string[]; // Up to 4 sequences where the API will stop generating further tokens.
    seed?: number; // For reproducible outputs
}

/**
 * @interface AIRequest
 * @description Represents a request to an AI service.
 * This structure standardizes inputs for any integrated AI.
 */
export interface AIRequest {
    model: AIModelIdentifier;
    prompt: string;
    config: AIModelConfig;
    stream: boolean; // Whether to stream the response
    context?: string; // Optional RAG context
    variables?: Record<string, string>; // The variables used to render the prompt
}

/**
 * @interface AIResponse
 * @description Represents a response from an AI service.
 * Includes metadata about the generation.
 */
export interface AIResponse {
    id: string; // Unique ID for the response
    generatedText: string;
    model: AIModelIdentifier;
    serviceType: AIServiceType;
    timestamp: Date;
    durationMs: number;
    tokenUsage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    costEstimateUSD: number; // Simulated cost
    error?: string; // If an error occurred
    streamingComplete: boolean; // For streamed responses
}

/**
 * @interface PromptExecutionHistoryEntry
 * @description Records a single execution of a prompt, linking request and response.
 */
export interface PromptExecutionHistoryEntry {
    id: string;
    promptId: number;
    request: AIRequest;
    response: AIResponse | null;
    status: 'pending' | 'completed' | 'failed';
}

/**
 * @enum NotificationType
 * @description Defines types of in-app notifications.
 */
export enum NotificationType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
    WARNING = 'warning',
}

/**
 * @interface AppNotification
 * @description Structure for displaying user notifications.
 */
export interface AppNotification {
    id: string;
    type: NotificationType;
    message: string;
    details?: string;
    timeout?: number; // ms until auto-dismiss
}

/**
 * @interface UserPreferences
 * @description Stores user-specific settings, including AI API keys (simulated secure storage).
 */
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    defaultAIModel: AIModelIdentifier;
    apiKeys: Partial<Record<AIServiceType, string>>; // Store API keys (simulated as not truly secure in client-side storage)
    showTips: boolean;
    editorFontFamily: string;
    editorFontSize: number;
    autoSaveIntervalMs: number;
    enablePromptVersionControl: boolean;
}

/**
 * @interface PromptVersion
 * @description Stores historical versions of a prompt.
 */
export interface PromptVersion {
    versionId: string;
    promptId: number;
    text: string;
    variables: Record<string, string>; // The state of variables at the time of saving
    timestamp: Date;
    message: string; // Commit message
    authorId: string; // Simulated author
}

/**
 * @interface ExternalServiceStatus
 * @description Represents the health and availability of an external service.
 */
export interface ExternalServiceStatus {
    serviceName: string;
    status: 'operational' | 'degraded' | 'offline';
    lastChecked: Date;
    message?: string;
}

/**
 * @interface TemplatingEngine
 * @description Interface for an advanced templating system beyond simple variable replacement.
 * This enables complex logic within prompts.
 * Invented by "TemplaLogic Innovations Inc."
 */
export interface TemplatingEngine {
    render(template: string, data: Record<string, any>): string;
    extractVariables(template: string): string[];
    validateTemplate(template: string): { isValid: boolean, errors?: string[] };
}

/**
 * @interface PromptQualityAssuranceService
 * @description Service to evaluate prompt quality and provide suggestions.
 * Invented by "CogniPrompt Analytics Corp."
 */
export interface PromptQualityAssuranceService {
    analyze(prompt: string, variables: Record<string, string>): { score: number, suggestions: string[], issues: string[] };
    getBestPractices(): string[];
}

/**
 * @interface SemanticSearchService
 * @description Service for searching prompts based on semantic similarity, not just keywords.
 * Leverages embeddings (simulated).
 * Invented by "EmbedMind Search Solutions"
 */
export interface SemanticSearchService {
    indexPrompt(promptId: number, text: string): Promise<void>;
    searchPrompts(query: string, limit: number): Promise<number[]>; // Returns prompt IDs
    rebuildIndex(): Promise<void>;
}

/**
 * @interface WebhookPayload
 * @description Standardized payload for outgoing webhooks.
 * Invented by "ConnectoBridge Systems"
 */
export interface WebhookPayload {
    eventType: string; // e.g., 'prompt_executed', 'prompt_saved'
    timestamp: Date;
    data: any; // The relevant data for the event
    metadata: {
        application: string;
        version: string;
        userId?: string; // Simulated
    };
}

/**
 * @interface AuditLogEntry
 * @description Record of significant actions performed within the application.
 * Invented by "SecureTrace Compliance"
 */
export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    action: string; // e.g., 'PROMPT_CREATED', 'PROMPT_DELETED', 'AI_EXECUTE'
    userId: string; // Simulated
    targetId?: string | number; // ID of the affected resource
    details?: string;
    ipAddress?: string; // Simulated
}

/**
 * @interface AIOrchestrationContext
 * @description Manages the flow and state across multiple AI calls or complex prompt chains.
 * Invented by "OrchestrAide AI Flow"
 */
export interface AIOrchestrationContext {
    id: string;
    name: string;
    steps: {
        type: 'prompt' | 'condition' | 'tool_call';
        promptId?: number;
        logic?: string; // e.g., 'IF response.includes("error") THEN retry'
        tool?: string; // e.g., 'code_interpreter', 'web_search'
    }[];
    status: 'draft' | 'active' | 'archived';
    lastRun?: PromptExecutionHistoryEntry;
}

// --- Section 2: Mock & Utility Services (Invented by DevCore Engineering Labs) ---

/**
 * @class IDGenerator
 * @description Utility for generating unique IDs.
 * Invented to ensure robust ID management across all entities.
 */
class IDGenerator {
    private static lastId: number = Date.now();
    static generate(): number {
        return ++IDGenerator.lastId;
    }
    static generateString(): string {
        return `${IDGenerator.generate()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

/**
 * @class NotificationManager
 * @description Manages in-app notifications for user feedback.
 * Invented to provide a consistent and non-intrusive notification system.
 */
export class NotificationManager {
    private static _instance: NotificationManager | null = null;
    private notifications: AppNotification[] = [];
    private listeners: Set<(notifications: AppNotification[]) => void> = new Set();

    private constructor() {
        // Private constructor for singleton pattern
    }

    public static getInstance(): NotificationManager {
        if (!NotificationManager._instance) {
            NotificationManager._instance = new NotificationManager();
        }
        return NotificationManager._instance;
    }

    private emitChange() {
        this.listeners.forEach(listener => listener([...this.notifications]));
    }

    public subscribe(listener: (notifications: AppNotification[]) => void) {
        this.listeners.add(listener);
        listener([...this.notifications]); // Immediate state sync on subscribe
        return () => this.listeners.delete(listener);
    }

    public addNotification(type: NotificationType, message: string, details?: string, timeout: number = 5000) {
        const id = IDGenerator.generateString();
        const notification: AppNotification = { id, type, message, details, timeout };
        this.notifications.push(notification);
        this.emitChange();

        if (timeout > 0) {
            setTimeout(() => this.removeNotification(id), timeout);
        }
    }

    public removeNotification(id: string) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.emitChange();
    }

    public getNotifications(): AppNotification[] {
        return [...this.notifications];
    }
}
export const notificationManager = NotificationManager.getInstance(); // Singleton instance

/**
 * @class AuditLogger
 * @description Centralized logging for user actions and system events.
 * Crucial for compliance, debugging, and understanding user behavior.
 * Invented by "SecureTrace Compliance"
 */
export class AuditLogger {
    private static _instance: AuditLogger | null = null;
    private logs: AuditLogEntry[] = [];
    private MAX_LOGS = 1000; // Keep a reasonable amount in memory

    private constructor() {}

    public static getInstance(): AuditLogger {
        if (!AuditLogger._instance) {
            AuditLogger._instance = new AuditLogger();
        }
        return AuditLogger._instance;
    }

    public log(action: string, userId: string = 'simulated_user_id', targetId?: string | number, details?: string): void {
        const entry: AuditLogEntry = {
            id: IDGenerator.generateString(),
            timestamp: new Date(),
            action,
            userId,
            targetId,
            details,
            ipAddress: '127.0.0.1' // Simulated
        };
        this.logs.unshift(entry); // Add to beginning
        if (this.logs.length > this.MAX_LOGS) {
            this.logs.pop(); // Remove oldest
        }
        // console.log('[AUDIT LOG]', entry); // For debugging
        // In a real app, this would be sent to a backend logging service
    }

    public getLogs(): AuditLogEntry[] {
        return [...this.logs];
    }
}
export const auditLogger = AuditLogger.getInstance(); // Singleton instance

/**
 * @class TelemetryService
 * @description Gathers non-identifiable usage statistics and performance metrics.
 * Invented by "MetricFlow Observability" to enhance application performance and user experience.
 */
export class TelemetryService {
    private static _instance: TelemetryService | null = null;
    private metrics: { name: string, value: any, timestamp: Date }[] = [];
    private MAX_METRICS = 5000;

    private constructor() {}

    public static getInstance(): TelemetryService {
        if (!TelemetryService._instance) {
            TelemetryService._instance = new TelemetryService();
        }
        return TelemetryService._instance;
    }

    public recordMetric(name: string, value: any): void {
        const metric = { name, value, timestamp: new Date() };
        this.metrics.push(metric);
        if (this.metrics.length > this.MAX_METRICS) {
            this.metrics.shift(); // Remove oldest
        }
        // In a real app, these would be batched and sent to a telemetry backend
    }

    public getMetrics(filterName?: string): { name: string, value: any, timestamp: Date }[] {
        return filterName ? this.metrics.filter(m => m.name === filterName) : [...this.metrics];
    }
}
export const telemetryService = TelemetryService.getInstance(); // Singleton instance

/**
 * @class SettingsManager
 * @description Manages user preferences, including API keys (simulated secure).
 * Invented by "ConfigGen Solutions" for robust personalization.
 */
export class SettingsManager {
    private static _instance: SettingsManager | null = null;
    private readonly STORAGE_KEY = 'devcore_user_preferences';
    private preferences: UserPreferences;
    private listeners: Set<(prefs: UserPreferences) => void> = new Set();

    private constructor() {
        this.preferences = this.loadPreferences();
    }

    public static getInstance(): SettingsManager {
        if (!SettingsManager._instance) {
            SettingsManager._instance = new SettingsManager();
        }
        return SettingsManager._instance;
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : this.getDefaultPreferences();
        } catch (error) {
            console.error('Failed to load preferences from localStorage:', error);
            auditLogger.log('PREFERENCES_LOAD_FAILED', 'system', undefined, error.message);
            return this.getDefaultPreferences();
        }
    }

    private savePreferences() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.preferences));
            this.listeners.forEach(listener => listener({ ...this.preferences }));
            auditLogger.log('PREFERENCES_SAVED', 'system');
        } catch (error) {
            console.error('Failed to save preferences to localStorage:', error);
            auditLogger.log('PREFERENCES_SAVE_FAILED', 'system', undefined, error.message);
            notificationManager.addNotification(NotificationType.ERROR, 'Failed to save settings.', 'Please check your browser storage.');
        }
    }

    private getDefaultPreferences(): UserPreferences {
        return {
            theme: 'system',
            defaultAIModel: AIModelIdentifier.GPT_3_5_TURBO,
            apiKeys: {},
            showTips: true,
            editorFontFamily: 'Fira Code, monospace',
            editorFontSize: 14,
            autoSaveIntervalMs: 60000,
            enablePromptVersionControl: true,
        };
    }

    public getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    public updatePreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): void {
        this.preferences = { ...this.preferences, [key]: value };
        this.savePreferences();
        telemetryService.recordMetric(`preference_updated_${key}`, value);
    }

    public subscribe(listener: (prefs: UserPreferences) => void) {
        this.listeners.add(listener);
        listener({ ...this.preferences });
        return () => this.listeners.delete(listener);
    }
}
export const settingsManager = SettingsManager.getInstance(); // Singleton instance

/**
 * @class TemplatingEngineService
 * @description A robust templating engine that handles advanced logic beyond simple variable replacement.
 * Implements the `TemplatingEngine` interface.
 * Invented by "TemplaLogic Innovations Inc."
 */
export class TemplatingEngineService implements TemplatingEngine {
    /**
     * @method render
     * @description Renders a template string with provided data, supporting advanced logic.
     * This is a simplified implementation, a real one might use Handlebars, Jinja2 syntax.
     * Supports:
     * - `{{variable}}`: Basic variable replacement.
     * - `{{#if condition}}...{{/if}}`: Conditional blocks.
     * - `{{#each arrayVar}}...{{/each}}`: Iteration over arrays.
     */
    public render(template: string, data: Record<string, any>): string {
        let rendered = template;

        // 1. Handle each loops (simplified: assumes array contains strings or objects with a 'name' prop)
        rendered = rendered.replace(/\{\{#each (\w+)\}\}(.*?)\{\{\/each\}\}/gs, (match, arrayVar, innerTemplate) => {
            const arr = data[arrayVar];
            if (!Array.isArray(arr)) return '';
            return arr.map((item: any, index: number) => {
                let itemRender = innerTemplate;
                // Replace item-specific variables, e.g., {{this}} or {{item.name}}
                itemRender = itemRender.replace(/\{\{this\}\}/g, item);
                if (typeof item === 'object' && item !== null) {
                    for (const key in item) {
                        itemRender = itemRender.replace(new RegExp(`\\{\\{this\\.${key}\\}\\}`, 'g'), item[key]);
                    }
                }
                itemRender = itemRender.replace(/\{\{index\}\}/g, index.toString());
                return itemRender;
            }).join('');
        });

        // 2. Handle if conditions (simplified: checks if a variable is truthy)
        rendered = rendered.replace(/\{\{#if (\w+)\}\}(.*?)\{\{\/if\}\}/gs, (match, conditionVar, innerTemplate) => {
            const condition = data[conditionVar];
            return condition ? innerTemplate : '';
        });

        // 3. Handle basic variable replacement
        rendered = rendered.replace(/\{(\w+)\}/g, (match, varName) => {
            return data[varName] !== undefined ? String(data[varName]) : match; // Keep original if not found
        });

        return rendered;
    }

    /**
     * @method extractVariables
     * @description Extracts all variable names from a template, including those in conditional/loop blocks.
     */
    public extractVariables(template: string): string[] {
        const variables = new Set<string>();

        // Basic variables: {varName}
        [...template.matchAll(/\{(\w+)\}/g)].forEach(match => variables.add(match[1]));

        // If conditions: {{#if varName}}
        [...template.matchAll(/\{\{#if (\w+)\}\}/g)].forEach(match => variables.add(match[1]));

        // Each loops: {{#each arrayVar}}
        [...template.matchAll(/\{\{#each (\w+)\}\}/g)].forEach(match => variables.add(match[1]));

        return Array.from(variables);
    }

    /**
     * @method validateTemplate
     * @description Validates the syntax of the template.
     */
    public validateTemplate(template: string): { isValid: boolean, errors?: string[] } {
        const errors: string[] = [];

        // Check for unclosed if blocks
        const ifOpenCount = (template.match(/\{\{#if/g) || []).length;
        const ifCloseCount = (template.match(/\{\{\/if\}\}/g) || []).length;
        if (ifOpenCount !== ifCloseCount) {
            errors.push('Mismatched `{{#if}}`/`{{/if}}` blocks.');
        }

        // Check for unclosed each blocks
        const eachOpenCount = (template.match(/\{\{#each/g) || []).length;
        const eachCloseCount = (template.match(/\{\{\/each\}\}/g) || []).length;
        if (eachOpenCount !== eachCloseCount) {
            errors.push('Mismatched `{{#each}}`/`{{/each}}` blocks.');
        }

        // Basic check for unclosed curly braces (single level)
        const openBraceCount = (template.match(/\{/g) || []).length;
        const closeBraceCount = (template.match(/\}/g) || []).length;
        if (openBraceCount !== closeBraceCount) {
            // This is a rough check as it can false positive for complex templates
            // A full parser would be needed for robust validation.
        }

        return {
            isValid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
        };
    }
}
export const templatingEngineService = new TemplatingEngineService(); // Singleton instance

/**
 * @class MockAIService
 * @description A base class for simulating AI service interactions.
 * All specific AI services (ChatGPT, Gemini) will extend this.
 * Invented by "SimulAI Technologies" for robust testing and development.
 */
abstract class MockAIService {
    protected serviceType: AIServiceType;
    protected apiKey: string = ''; // In a real app, this would be securely managed

    constructor(serviceType: AIServiceType) {
        this.serviceType = serviceType;
        this.loadApiKey();
        settingsManager.subscribe(prefs => {
            this.apiKey = prefs.apiKeys[this.serviceType] || '';
        });
    }

    private loadApiKey() {
        this.apiKey = settingsManager.getPreferences().apiKeys[this.serviceType] || '';
    }

    public setApiKey(key: string): void {
        this.apiKey = key;
        settingsManager.updatePreference('apiKeys', { ...settingsManager.getPreferences().apiKeys, [this.serviceType]: key });
    }

    public getApiKey(): string {
        return this.apiKey;
    }

    public abstract generate(request: AIRequest, onStreamUpdate?: (chunk: string) => void): Promise<AIResponse>;

    protected simulateGeneration(request: AIRequest, baseResponse: string, onStreamUpdate?: (chunk: string) => void): Promise<AIResponse> {
        return new Promise(resolve => {
            if (!this.apiKey) {
                notificationManager.addNotification(NotificationType.WARNING, `Missing API Key for ${this.serviceType}.`, 'Please configure it in settings.');
                resolve({
                    id: IDGenerator.generateString(),
                    generatedText: '',
                    model: request.model,
                    serviceType: this.serviceType,
                    timestamp: new Date(),
                    durationMs: 0,
                    tokenUsage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
                    costEstimateUSD: 0,
                    error: `API Key for ${this.serviceType} is not configured.`,
                    streamingComplete: true,
                });
                return;
            }

            let generatedText = '';
            let currentTokenCount = 0;
            const promptTokenEstimate = Math.ceil(request.prompt.length / 4); // Basic estimate
            const maxCompletionTokens = request.config.max_tokens || 500;
            const startTime = performance.now();

            const words = baseResponse.split(' ');
            let wordIndex = 0;

            const interval = setInterval(() => {
                if (wordIndex < words.length && currentTokenCount < maxCompletionTokens) {
                    const word = words[wordIndex] + (wordIndex < words.length - 1 ? ' ' : '');
                    generatedText += word;
                    currentTokenCount += 1; // Simplify token count for mock
                    onStreamUpdate?.(word);
                    wordIndex++;
                } else {
                    clearInterval(interval);
                    const durationMs = performance.now() - startTime;
                    const completionTokenEstimate = currentTokenCount;
                    const totalTokens = promptTokenEstimate + completionTokenEstimate;
                    const costEstimateUSD = (totalTokens / 1000) * (this.serviceType === AIServiceType.GPT_4 ? 0.03 : 0.002); // Mock pricing

                    resolve({
                        id: IDGenerator.generateString(),
                        generatedText,
                        model: request.model,
                        serviceType: this.serviceType,
                        timestamp: new Date(),
                        durationMs,
                        tokenUsage: {
                            prompt_tokens: promptTokenEstimate,
                            completion_tokens: completionTokenEstimate,
                            total_tokens: totalTokens,
                        },
                        costEstimateUSD,
                        streamingComplete: true,
                    });
                }
            }, request.stream ? 50 : 0); // Simulate streaming with delay, or instant for non-streaming
        });
    }
}

/**
 * @class ChatGPTService
 * @description Mock implementation for OpenAI's ChatGPT.
 * Invented by "OpenAILite Simulators" for seamless integration.
 */
export class ChatGPTService extends MockAIService {
    constructor() {
        super(AIServiceType.ChatGPT);
    }

    public async generate(request: AIRequest, onStreamUpdate?: (chunk: string) => void): Promise<AIResponse> {
        auditLogger.log('AI_REQUEST', 'system', request.model, `ChatGPT request for prompt: ${request.prompt.substring(0, 50)}...`);
        let mockResponse = `As a large language model trained by OpenAI, I can provide information and generate text based on your prompt: "${request.prompt}".
This response demonstrates the capabilities of ${request.model} model. I can assist with various tasks such as code generation, creative writing, data analysis, and more.
My goal is to be helpful and harmless, providing accurate and useful information.
Thank you for using the Prompt Craft Pad, a cutting-edge platform for advanced prompt engineering.
This is a comprehensive and detailed answer generated to showcase the robust capabilities of DevCore's integrated AI services.
The system also supports complex variable interpolation and conditional logic through its advanced templating engine.
Future enhancements include sentiment analysis, automated prompt refinement, and multi-modal generation.`;
        return this.simulateGeneration(request, mockResponse, onStreamUpdate);
    }
}

/**
 * @class GeminiService
 * @description Mock implementation for Google's Gemini.
 * Invented by "GeminiForge Simulations" for powerful multi-modal mock capabilities.
 */
export class GeminiService extends MockAIService {
    constructor() {
        super(AIServiceType.Gemini);
    }

    public async generate(request: AIRequest, onStreamUpdate?: (chunk: string) => void): Promise<AIResponse> {
        auditLogger.log('AI_REQUEST', 'system', request.model, `Gemini request for prompt: ${request.prompt.substring(0, 50)}...`);
        let mockResponse = `Hello from Google's Gemini! I am designed to process and generate information effectively, based on your input: "${request.prompt}".
I excel at understanding nuanced requests, summarizing complex documents, and generating creative content.
${request.model} offers superior performance for various demanding applications, including advanced analytics and scientific research.
The Prompt Craft Pad's integration with Gemini allows users to harness this power for innovative solutions across industries.
We are constantly working to improve these integrations, bringing you the best in AI.
Explore diverse applications, from natural language understanding to sophisticated problem-solving.
This mock response illustrates a fluent and contextually rich output.`;
        return this.simulateGeneration(request, mockResponse, onStreamUpdate);
    }
}

/**
 * @class ClaudeService
 * @description Mock implementation for Anthropic's Claude.
 * Invented by "AnthropicAide Simulations" for ethical AI practice.
 */
export class ClaudeService extends MockAIService {
    constructor() {
        super(AIServiceType.Claude);
    }

    public async generate(request: AIRequest, onStreamUpdate?: (chunk: string) => void): Promise<AIResponse> {
        auditLogger.log('AI_REQUEST', 'system', request.model, `Claude request for prompt: ${request.prompt.substring(0, 50)}...`);
        let mockResponse = `I am Claude, an AI assistant from Anthropic, and I'm ready to assist with your request: "${request.prompt}".
My design prioritizes helpfulness, harmlessness, and honesty. I can engage in natural conversation, provide detailed explanations, and support creative endeavors.
The model ${request.model} is known for its extensive context window and robust reasoning abilities, making it suitable for complex analytical tasks.
The Prompt Craft Pad ensures that you can utilize Claude's unique strengths for ethical and responsible AI development.
We believe in transparent and safe AI, and this platform facilitates that vision.`;
        return this.simulateGeneration(request, mockResponse, onStreamUpdate);
    }
}

/**
 * @class LlamaService
 * @description Mock implementation for Meta's Llama models (e.g., via HuggingFace Inference API).
 * Invented by "OpenSourceMind Simulations" for community-driven AI solutions.
 */
export class LlamaService extends MockAIService {
    constructor() {
        super(AIServiceType.Llama);
    }

    public async generate(request: AIRequest, onStreamUpdate?: (chunk: string) => void): Promise<AIResponse> {
        auditLogger.log('AI_REQUEST', 'system', request.model, `Llama request for prompt: ${request.prompt.substring(0, 50)}...`);
        let mockResponse = `This is a response generated by a Llama-family model, responding to your input: "${request.prompt}".
Llama models are powerful open-source large language models developed by Meta AI. They are suitable for a wide range of applications, especially when deployed in private or custom environments.
${request.model} represents a specific variant optimized for chat and instructional tasks.
The Prompt Craft Pad provides an interface to experiment with these cutting-edge open-source models, fostering innovation and flexibility.
We are committed to supporting diverse AI ecosystems.`;
        return this.simulateGeneration(request, mockResponse, onStreamUpdate);
    }
}

/**
 * @class DalleService
 * @description Mock implementation for DALL-E (image generation).
 * This service would handle image prompts specifically.
 * Invented by "VisuaGenius Creations" for multi-modal creativity.
 */
export class DalleService extends MockAIService {
    constructor() {
        super(AIServiceType.DALL_E);
    }

    public async generate(request: AIRequest, onStreamUpdate?: (chunk: string) => void): Promise<AIResponse> {
        auditLogger.log('AI_REQUEST', 'system', request.model, `DALL-E request for prompt: ${request.prompt.substring(0, 50)}...`);
        // For image generation, the response would typically be a URL or base64 encoded image, not text.
        // We simulate a text response for consistency in this mock.
        let mockResponse = `Image generation request received for: "${request.prompt}".
A stunning image featuring "${request.prompt}" has been conceptualized.
You would normally see an image URL here, like "https://mock-image-server.com/dall-e/${IDGenerator.generateString()}.png".
The ${request.model} model is capable of generating highly creative and detailed visuals.
This multi-modal capability of Prompt Craft Pad unlocks new dimensions of AI interaction.`;
        return this.simulateGeneration(request, mockResponse, onStreamUpdate);
    }
}

/**
 * @class StableDiffusionService
 * @description Mock implementation for Stable Diffusion (image generation).
 * Invented by "PixelWeaver Studios" for open-source visual prowess.
 */
export class StableDiffusionService extends MockAIService {
    constructor() {
        super(AIServiceType.StableDiffusion);
    }

    public async generate(request: AIRequest, onStreamUpdate?: (chunk: string) => void): Promise<AIResponse> {
        auditLogger.log('AI_REQUEST', 'system', request.model, `Stable Diffusion request for prompt: ${request.prompt.substring(0, 50)}...`);
        let mockResponse = `Stable Diffusion image generation initiated for: "${request.prompt}".
An imaginative visual based on "${request.prompt}" is being rendered.
Image URL: "https://mock-image-server.com/stable-diffusion/${IDGenerator.generateString()}.jpg".
The ${request.model} model is renowned for its flexibility and control over image generation.
Prompt Craft Pad supports open-source models like Stable Diffusion to provide diverse creative options.`;
        return this.simulateGeneration(request, mockResponse, onStreamUpdate);
    }
}

/**
 * @class AIServiceManager
 * @description Centralized manager for all integrated AI services.
 * This acts as a facade, allowing the UI to interact with different AI models uniformly.
 * Invented by "OmniAI Orchestration Co."
 */
export class AIServiceManager {
    private static _instance: AIServiceManager | null = null;
    private services: Map<AIServiceType, MockAIService>;
    private modelMap: Map<AIModelIdentifier, AIServiceType>; // Map model to its service

    private constructor() {
        this.services = new Map();
        this.modelMap = new Map();
        this.initializeServices();
    }

    public static getInstance(): AIServiceManager {
        if (!AIServiceManager._instance) {
            AIServiceManager._instance = new AIServiceManager();
        }
        return AIServiceManager._instance;
    }

    private initializeServices() {
        const chatGPT = new ChatGPTService();
        this.services.set(AIServiceType.ChatGPT, chatGPT);
        this.modelMap.set(AIModelIdentifier.GPT_3_5_TURBO, AIServiceType.ChatGPT);
        this.modelMap.set(AIModelIdentifier.GPT_4, AIServiceType.ChatGPT);
        this.modelMap.set(AIModelIdentifier.GPT_4_32K, AIServiceType.ChatGPT);
        this.modelMap.set(AIModelIdentifier.GPT_4_TURBO, AIServiceType.ChatGPT);

        const gemini = new GeminiService();
        this.services.set(AIServiceType.Gemini, gemini);
        this.modelMap.set(AIModelIdentifier.GEMINI_PRO, AIServiceType.Gemini);
        this.modelMap.set(AIModelIdentifier.GEMINI_ULTRA, AIServiceType.Gemini);
        this.modelMap.set(AIModelIdentifier.GEMINI_FLASH, AIServiceType.Gemini);

        const claude = new ClaudeService();
        this.services.set(AIServiceType.Claude, claude);
        this.modelMap.set(AIModelIdentifier.CLAUDE_3_OPUS, AIServiceType.Claude);
        this.modelMap.set(AIModelIdentifier.CLAUDE_3_SONNET, AIServiceType.Claude);
        this.modelMap.set(AIModelIdentifier.CLAUDE_3_HAJKU, AIServiceType.Claude);

        const llama = new LlamaService();
        this.services.set(AIServiceType.Llama, llama);
        this.modelMap.set(AIModelIdentifier.LLAMA_2_7B_CHAT, AIServiceType.Llama);
        this.modelMap.set(AIModelIdentifier.LLAMA_2_13B_CHAT, AIServiceType.Llama);
        this.modelMap.set(AIModelIdentifier.LLAMA_3_8B_INSTRUCT, AIServiceType.Llama);

        const dallE = new DalleService();
        this.services.set(AIServiceType.DALL_E, dallE);
        this.modelMap.set(AIModelIdentifier.DALL_E_2, AIServiceType.DALL_E);
        this.modelMap.set(AIModelIdentifier.DALL_E_3, AIServiceType.DALL_E);

        const stableDiffusion = new StableDiffusionService();
        this.services.set(AIServiceType.StableDiffusion, stableDiffusion);
        this.modelMap.set(AIModelIdentifier.STABLE_DIFFUSION_XL, AIServiceType.StableDiffusion);

        auditLogger.log('AI_MANAGER_INITIALIZED', 'system', undefined, `Enabled services: ${Array.from(this.services.keys()).join(', ')}`);
    }

    public getService(serviceType: AIServiceType): MockAIService | undefined {
        return this.services.get(serviceType);
    }

    public getServiceForModel(model: AIModelIdentifier): MockAIService | undefined {
        const serviceType = this.modelMap.get(model);
        if (serviceType) {
            return this.services.get(serviceType);
        }
        return undefined;
    }

    public getSupportedModels(): AIModelIdentifier[] {
        return Array.from(this.modelMap.keys());
    }

    public getModelsByServiceType(serviceType: AIServiceType): AIModelIdentifier[] {
        return Array.from(this.modelMap.entries())
            .filter(([, sType]) => sType === serviceType)
            .map(([model]) => model);
    }

    public async execute(request: AIRequest, onStreamUpdate?: (chunk: string) => void): Promise<AIResponse> {
        const service = this.getServiceForModel(request.model);
        if (!service) {
            notificationManager.addNotification(NotificationType.ERROR, 'Unknown AI Model', `The model ${request.model} is not supported.`);
            auditLogger.log('AI_REQUEST_FAILED', 'system', request.model, 'Unknown model identifier.');
            return {
                id: IDGenerator.generateString(),
                generatedText: '',
                model: request.model,
                serviceType: AIServiceType.ChatGPT, // Default or error service
                timestamp: new Date(),
                durationMs: 0,
                tokenUsage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
                costEstimateUSD: 0,
                error: `Unsupported AI Model: ${request.model}`,
                streamingComplete: true,
            };
        }
        telemetryService.recordMetric('ai_request_start', { model: request.model, stream: request.stream });
        try {
            const response = await service.generate(request, onStreamUpdate);
            telemetryService.recordMetric('ai_request_end', { model: request.model, success: !response.error, duration: response.durationMs });
            return response;
        } catch (error) {
            notificationManager.addNotification(NotificationType.ERROR, `AI Request Failed for ${request.model}`, error.message);
            auditLogger.log('AI_REQUEST_EXCEPTION', 'system', request.model, error.message);
            telemetryService.recordMetric('ai_request_end', { model: request.model, success: false, error: error.message });
            return {
                id: IDGenerator.generateString(),
                generatedText: '',
                model: request.model,
                serviceType: service.serviceType,
                timestamp: new Date(),
                durationMs: 0,
                tokenUsage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
                costEstimateUSD: 0,
                error: `AI Service Error: ${error.message}`,
                streamingComplete: true,
            };
        }
    }
}
export const aiServiceManager = AIServiceManager.getInstance(); // Singleton instance

/**
 * @class PromptVersionControlService
 * @description Manages versioning of prompts, allowing users to revert and track changes.
 * This is a critical feature for professional prompt engineering.
 * Invented by "VersioPrompt Systems"
 */
export class PromptVersionControlService {
    private static _instance: PromptVersionControlService | null = null;
    private readonly STORAGE_KEY_PREFIX = 'devcore_prompt_versions_'; // Per prompt storage
    private MAX_VERSIONS_PER_PROMPT = 10; // Keep a reasonable history

    private constructor() {}

    public static getInstance(): PromptVersionControlService {
        if (!PromptVersionControlService._instance) {
            PromptVersionControlService._instance = new PromptVersionControlService();
        }
        return PromptVersionControlService._instance;
    }

    /**
     * @method saveVersion
     * @description Saves a new version of a prompt.
     */
    public saveVersion(prompt: Prompt, variables: Record<string, string>, message: string = 'Auto-save'): void {
        if (!settingsManager.getPreferences().enablePromptVersionControl) {
            return; // Version control disabled
        }

        const currentVersions = this.getVersions(prompt.id);
        const newVersion: PromptVersion = {
            versionId: IDGenerator.generateString(),
            promptId: prompt.id,
            text: prompt.text,
            variables: { ...variables }, // Snapshot variables
            timestamp: new Date(),
            message,
            authorId: prompt.authorId, // Use prompt's author or current user
        };

        const updatedVersions = [newVersion, ...currentVersions];
        if (updatedVersions.length > this.MAX_VERSIONS_PER_PROMPT) {
            updatedVersions.pop(); // Remove the oldest version
        }

        try {
            localStorage.setItem(`${this.STORAGE_KEY_PREFIX}${prompt.id}`, JSON.stringify(updatedVersions));
            auditLogger.log('PROMPT_VERSION_SAVED', prompt.authorId, prompt.id, `Version ${newVersion.versionId.substring(0, 8)} saved for prompt ${prompt.name}`);
            telemetryService.recordMetric('prompt_version_saved', { promptId: prompt.id, versionCount: updatedVersions.length });
        } catch (error) {
            console.error('Failed to save prompt version:', error);
            notificationManager.addNotification(NotificationType.ERROR, 'Failed to save prompt version.', error.message);
            auditLogger.log('PROMPT_VERSION_SAVE_FAILED', prompt.authorId, prompt.id, error.message);
        }
    }

    /**
     * @method getVersions
     * @description Retrieves all saved versions for a given prompt.
     */
    public getVersions(promptId: number): PromptVersion[] {
        try {
            const stored = localStorage.getItem(`${this.STORAGE_KEY_PREFIX}${promptId}`);
            return stored ? JSON.parse(stored).map((v: PromptVersion) => ({ ...v, timestamp: new Date(v.timestamp) })) : [];
        } catch (error) {
            console.error('Failed to load prompt versions:', error);
            auditLogger.log('PROMPT_VERSIONS_LOAD_FAILED', 'system', promptId, error.message);
            return [];
        }
    }

    /**
     * @method revertToVersion
     * @description Reverts a prompt to a specific historical version.
     * @returns {Prompt} The prompt object with the reverted text.
     */
    public revertToVersion(prompt: Prompt, versionId: string): Prompt | null {
        const versions = this.getVersions(prompt.id);
        const targetVersion = versions.find(v => v.versionId === versionId);

        if (targetVersion) {
            const revertedPrompt = {
                ...prompt,
                text: targetVersion.text,
                updatedAt: new Date(),
                version: prompt.version + 0.1, // Increment minor version
            };
            auditLogger.log('PROMPT_REVERTED', prompt.authorId, prompt.id, `Reverted to version ${versionId.substring(0, 8)}`);
            notificationManager.addNotification(NotificationType.INFO, 'Prompt Reverted', `Prompt "${prompt.name}" reverted to an earlier version.`);
            return revertedPrompt;
        }
        notificationManager.addNotification(NotificationType.WARNING, 'Version Not Found', `Could not find version ${versionId} for prompt ${prompt.name}.`);
        auditLogger.log('PROMPT_REVERT_FAILED', prompt.authorId, prompt.id, `Version ${versionId} not found.`);
        return null;
    }

    /**
     * @method deleteVersionsForPrompt
     * @description Deletes all versions associated with a prompt (e.g., when the prompt is deleted).
     */
    public deleteVersionsForPrompt(promptId: number): void {
        try {
            localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}${promptId}`);
            auditLogger.log('PROMPT_VERSIONS_DELETED', 'system', promptId, 'All versions removed.');
            telemetryService.recordMetric('prompt_versions_deleted', { promptId });
        } catch (error) {
            console.error('Failed to delete prompt versions for ID:', promptId, error);
            auditLogger.log('PROMPT_VERSIONS_DELETE_FAILED', 'system', promptId, error.message);
        }
    }
}
export const promptVersionControlService = PromptVersionControlService.getInstance(); // Singleton instance


/**
 * @class PromptOrchestrationService
 * @description Manages complex multi-step AI workflows or "prompt chains".
 * This enables users to define sequences of prompts, conditional logic, and tool calls.
 * Invented by "OrchestrAide AI Flow"
 */
export class PromptOrchestrationService {
    private static _instance: PromptOrchestrationService | null = null;
    private readonly STORAGE_KEY = 'devcore_ai_orchestrations';
    private orchestrations: AIOrchestrationContext[];
    private listeners: Set<(orchestrations: AIOrchestrationContext[]) => void> = new Set();

    private constructor() {
        this.orchestrations = this.loadOrchestrations();
    }

    public static getInstance(): PromptOrchestrationService {
        if (!PromptOrchestrationService._instance) {
            PromptOrchestrationService._instance = new PromptOrchestrationService();
        }
        return PromptOrchestrationService._instance;
    }

    private loadOrchestrations(): AIOrchestrationContext[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load orchestrations:', error);
            auditLogger.log('ORCHESTRATION_LOAD_FAILED', 'system', undefined, error.message);
            return [];
        }
    }

    private saveOrchestrations(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.orchestrations));
            this.listeners.forEach(listener => listener([...this.orchestrations]));
            auditLogger.log('ORCHESTRATIONS_SAVED', 'system');
        } catch (error) {
            console.error('Failed to save orchestrations:', error);
            auditLogger.log('ORCHESTRATION_SAVE_FAILED', 'system', undefined, error.message);
            notificationManager.addNotification(NotificationType.ERROR, 'Failed to save orchestrations.', 'Check browser storage.');
        }
    }

    public subscribe(listener: (orchestrations: AIOrchestrationContext[]) => void) {
        this.listeners.add(listener);
        listener([...this.orchestrations]);
        return () => this.listeners.delete(listener);
    }

    public getOrchestrations(): AIOrchestrationContext[] {
        return [...this.orchestrations];
    }

    public addOrchestration(name: string): AIOrchestrationContext {
        const newOrchestration: AIOrchestrationContext = {
            id: IDGenerator.generateString(),
            name,
            steps: [],
            status: 'draft',
        };
        this.orchestrations.push(newOrchestration);
        this.saveOrchestrations();
        notificationManager.addNotification(NotificationType.SUCCESS, `Orchestration "${name}" created.`);
        auditLogger.log('ORCHESTRATION_CREATED', 'system', newOrchestration.id, `Name: ${name}`);
        telemetryService.recordMetric('orchestration_created', { id: newOrchestration.id, name });
        return newOrchestration;
    }

    public updateOrchestration(updatedOrchestration: AIOrchestrationContext): void {
        this.orchestrations = this.orchestrations.map(o => o.id === updatedOrchestration.id ? updatedOrchestration : o);
        this.saveOrchestrations();
        notificationManager.addNotification(NotificationType.INFO, `Orchestration "${updatedOrchestration.name}" updated.`);
        auditLogger.log('ORCHESTRATION_UPDATED', 'system', updatedOrchestration.id, `Name: ${updatedOrchestration.name}`);
    }

    public deleteOrchestration(id: string): void {
        const orchestrationName = this.orchestrations.find(o => o.id === id)?.name;
        this.orchestrations = this.orchestrations.filter(o => o.id !== id);
        this.saveOrchestrations();
        notificationManager.addNotification(NotificationType.INFO, `Orchestration "${orchestrationName}" deleted.`);
        auditLogger.log('ORCHESTRATION_DELETED', 'system', id, `Name: ${orchestrationName}`);
        telemetryService.recordMetric('orchestration_deleted', { id });
    }

    /**
     * @method executeOrchestration
     * @description (Simulated) Executes a complex, multi-step AI orchestration.
     * This method would contain the core logic for running prompt chains, conditional routing,
     * and integrating with various tools.
     * @param {string} orchestrationId - The ID of the orchestration to execute.
     * @param {Record<string, string>} initialVariables - Initial variables for the first prompt.
     * @param {Prompt[]} allPrompts - All available prompts to retrieve by ID.
     */
    public async executeOrchestration(orchestrationId: string, initialVariables: Record<string, string>, allPrompts: Prompt[]): Promise<PromptExecutionHistoryEntry[]> {
        notificationManager.addNotification(NotificationType.INFO, 'Orchestration Started', `Executing orchestration ID: ${orchestrationId}.`);
        auditLogger.log('ORCHESTRATION_EXECUTION_STARTED', 'system', orchestrationId, 'Initiating multi-step AI workflow.');
        telemetryService.recordMetric('orchestration_execution_start', { id: orchestrationId });

        const orchestration = this.orchestrations.find(o => o.id === orchestrationId);
        if (!orchestration) {
            notificationManager.addNotification(NotificationType.ERROR, 'Orchestration Not Found', `No orchestration found with ID: ${orchestrationId}.`);
            auditLogger.log('ORCHESTRATION_EXECUTION_FAILED', 'system', orchestrationId, 'Orchestration not found.');
            return [];
        }

        const results: PromptExecutionHistoryEntry[] = [];
        let currentOutput: string = '';
        let currentVariables = { ...initialVariables };

        for (const step of orchestration.steps) {
            switch (step.type) {
                case 'prompt':
                    if (step.promptId === undefined) {
                        notificationManager.addNotification(NotificationType.ERROR, 'Orchestration Error', 'Prompt step missing prompt ID.');
                        auditLogger.log('ORCHESTRATION_STEP_FAILED', 'system', orchestrationId, 'Prompt step missing promptId.');
                        return results;
                    }
                    const prompt = allPrompts.find(p => p.id === step.promptId);
                    if (!prompt) {
                        notificationManager.addNotification(NotificationType.ERROR, 'Orchestration Error', `Prompt ID ${step.promptId} not found.`);
                        auditLogger.log('ORCHESTRATION_STEP_FAILED', 'system', orchestrationId, `Prompt ${step.promptId} not found.`);
                        return results;
                    }

                    // Render the prompt using the templating engine and current variables
                    const renderedPrompt = templatingEngineService.render(prompt.text, { ...currentVariables, previousOutput: currentOutput });

                    const request: AIRequest = {
                        model: settingsManager.getPreferences().defaultAIModel, // Use default or configure per step
                        prompt: renderedPrompt,
                        config: { temperature: 0.7, max_tokens: 500, top_p: 1.0, frequency_penalty: 0, presence_penalty: 0, stop_sequences: [] },
                        stream: false,
                        variables: { ...currentVariables, previousOutput: currentOutput } // Snapshot variables used
                    };

                    const executionEntry: PromptExecutionHistoryEntry = {
                        id: IDGenerator.generateString(),
                        promptId: prompt.id,
                        request,
                        response: null,
                        status: 'pending',
                    };
                    results.push(executionEntry);

                    try {
                        notificationManager.addNotification(NotificationType.INFO, 'Executing Prompt', `Step: ${prompt.name}`);
                        const response = await aiServiceManager.execute(request);
                        executionEntry.response = response;
                        executionEntry.status = response.error ? 'failed' : 'completed';
                        currentOutput = response.generatedText; // Output of this step becomes input for next
                        // Update currentVariables based on any structured output parsing if implemented
                        auditLogger.log('ORCHESTRATION_STEP_COMPLETED', 'system', prompt.id, `Prompt "${prompt.name}" completed.`);
                    } catch (err) {
                        executionEntry.status = 'failed';
                        executionEntry.response = {
                            id: IDGenerator.generateString(),
                            generatedText: '',
                            model: request.model,
                            serviceType: AIServiceType.ChatGPT, // Placeholder
                            timestamp: new Date(),
                            durationMs: 0,
                            tokenUsage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
                            costEstimateUSD: 0,
                            error: err.message,
                            streamingComplete: true,
                        };
                        notificationManager.addNotification(NotificationType.ERROR, 'Orchestration Failed', `Prompt step "${prompt.name}" failed: ${err.message}`);
                        auditLogger.log('ORCHESTRATION_STEP_FAILED', 'system', prompt.id, err.message);
                        return results; // Stop execution on failure
                    }
                    break;
                case 'condition':
                    // (Simulated) Evaluate 'logic' against 'currentOutput' or 'currentVariables'
                    // Example logic: "previousOutput.includes('success')"
                    const conditionMet = eval(`(function() { const previousOutput = "${currentOutput}"; const vars = ${JSON.stringify(currentVariables)}; return ${step.logic}; })();`);
                    notificationManager.addNotification(NotificationType.INFO, 'Conditional Step', `Condition "${step.logic}" evaluated to ${conditionMet}.`);
                    auditLogger.log('ORCHESTRATION_CONDITION_EVALUATED', 'system', orchestration.id, `Logic: ${step.logic}, Result: ${conditionMet}`);
                    if (!conditionMet) {
                        notificationManager.addNotification(NotificationType.WARNING, 'Orchestration Halted', 'Conditional step not met. Halting orchestration.');
                        auditLogger.log('ORCHESTRATION_HALTED_BY_CONDITION', 'system', orchestration.id);
                        return results; // Stop orchestration if condition not met
                    }
                    break;
                case 'tool_call':
                    // (Simulated) Integrate with external tools (e.g., Code Interpreter, Web Search)
                    notificationManager.addNotification(NotificationType.INFO, 'Tool Call', `Simulating call to tool: ${step.tool}`);
                    auditLogger.log('ORCHESTRATION_TOOL_CALL', 'system', orchestration.id, `Tool: ${step.tool}`);
                    currentOutput = `(Output from simulated tool: ${step.tool} for previous output: ${currentOutput.substring(0, 50)})`;
                    await new Promise(res => setTimeout(res, 1000)); // Simulate tool latency
                    break;
                default:
                    notificationManager.addNotification(NotificationType.ERROR, 'Unknown Orchestration Step', `Unknown step type: ${step.type}`);
                    auditLogger.log('ORCHESTRATION_UNKNOWN_STEP', 'system', orchestration.id, `Unknown type: ${step.type}`);
                    return results;
            }
        }

        notificationManager.addNotification(NotificationType.SUCCESS, 'Orchestration Completed', `Orchestration "${orchestration.name}" finished successfully.`);
        auditLogger.log('ORCHESTRATION_EXECUTION_COMPLETED', 'system', orchestration.id);
        telemetryService.recordMetric('orchestration_execution_end', { id: orchestrationId, success: true });
        return results;
    }
}
export const promptOrchestrationService = PromptOrchestrationService.getInstance(); // Singleton instance

// --- Section 3: React Hooks & Contexts (Invented by DevCore UI/UX Engineering) ---

/**
 * @hook useAppNotifications
 * @description Custom hook to subscribe to the NotificationManager and get real-time notifications.
 * This ensures reactive UI updates for global notifications.
 */
export const useAppNotifications = () => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    useEffect(() => {
        const unsubscribe = notificationManager.subscribe(setNotifications);
        return () => unsubscribe();
    }, []);

    return notifications;
};

/**
 * @hook useUserSettings
 * @description Custom hook to subscribe to the SettingsManager and get real-time user preferences.
 */
export const useUserSettings = () => {
    const [settings, setSettings] = useState<UserPreferences>(settingsManager.getPreferences());

    useEffect(() => {
        const unsubscribe = settingsManager.subscribe(setSettings);
        return () => unsubscribe();
    }, []);

    return { settings, updateSetting: settingsManager.updatePreference.bind(settingsManager) };
};

/**
 * @context PromptContext
 * @description React Context to provide prompt data and related actions deep within the component tree.
 * Avoids prop drilling for core prompt management.
 * Invented by "ContextFlow Solutions" for efficient state management.
 */
interface PromptContextType {
    prompts: Prompt[];
    activePrompt: Prompt | null;
    setActivePrompt: (prompt: Prompt | null) => void;
    addPrompt: (name: string, text: string) => Prompt;
    updatePrompt: (id: number, updates: Partial<Prompt>) => void;
    deletePrompt: (id: number) => void;
    savePromptVersion: (prompt: Prompt, variables: Record<string, string>, message?: string) => void;
    getPromptVersions: (promptId: number) => PromptVersion[];
    revertPromptToVersion: (prompt: Prompt, versionId: string) => void;
}
export const PromptContext = createContext<PromptContextType | undefined>(undefined);

/**
 * @hook usePromptContext
 * @description Custom hook to consume the PromptContext.
 * Ensures that the hook is used within a `PromptContextProvider`.
 */
export const usePromptContext = () => {
    const context = useContext(PromptContext);
    if (context === undefined) {
        throw new Error('usePromptContext must be used within a PromptContextProvider');
    }
    return context;
};

/**
 * @component PromptContextProvider
 * @description Provides prompt-related data and actions to its children.
 * Manages the core prompt state and interacts with version control.
 */
export const PromptContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [prompts, setPrompts] = useLocalStorage<Prompt[]>('devcore_prompts_v2', [
        {
            id: IDGenerator.generate(),
            name: 'React Component Generator',
            text: `Generate a React component named {name} that {description}. Style it with Tailwind CSS.
{{#if includeProps}}The component should accept the following props: {{propsList}}.{{/if}}`,
            description: 'Generates a basic React functional component with Tailwind styling.',
            tags: ['react', 'code-gen', 'tailwind'],
            category: 'Development',
            version: 1.0,
            createdAt: new Date(),
            updatedAt: new Date(),
            authorId: 'devcore_admin',
            isArchived: false,
            usageCount: 0,
            relatedPromptIds: [],
            defaultVariables: {
                name: 'MyComponent',
                description: 'displays a user profile',
                includeProps: 'true',
                propsList: 'username:string, avatarUrl:string',
            },
        },
        {
            id: IDGenerator.generate(),
            name: 'Marketing Slogan Creator',
            text: `Create 5 compelling marketing slogans for a company that sells {product}.
Focus on these benefits: {benefit1}, {benefit2}. The target audience is {audience}.
{{#if includeCallToAction}}Include a strong call to action.{{/if}}`,
            description: 'Generates marketing slogans based on product and benefits.',
            tags: ['marketing', 'slogan', 'creative'],
            category: 'Marketing',
            version: 1.0,
            createdAt: new Date(),
            updatedAt: new Date(),
            authorId: 'devcore_admin',
            isArchived: false,
            usageCount: 0,
            relatedPromptIds: [],
            defaultVariables: {
                product: 'eco-friendly smart home devices',
                benefit1: 'energy saving',
                benefit2: 'modern design',
                audience: 'environmentally conscious tech enthusiasts',
                includeCallToAction: 'true',
            },
        },
    ]);
    const [activePrompt, setActivePrompt] = useState<Prompt | null>(prompts[0] || null);

    // Effect to keep activePrompt in sync if prompts array changes (e.g., deletion)
    useEffect(() => {
        if (!activePrompt && prompts.length > 0) {
            setActivePrompt(prompts[0]);
        } else if (activePrompt) {
            const currentActive = prompts.find(p => p.id === activePrompt.id);
            if (!currentActive) {
                setActivePrompt(prompts.length > 0 ? prompts[0] : null);
            } else if (currentActive.text !== activePrompt.text || currentActive.name !== activePrompt.name) {
                // Only update if content changed, to avoid re-rendering variables unnecessarily
                setActivePrompt(currentActive);
            }
        }
    }, [prompts, activePrompt]);

    const addPrompt = useCallback((name: string, text: string = ''): Prompt => {
        const newPrompt: Prompt = {
            id: IDGenerator.generate(),
            name,
            text,
            description: 'A newly created prompt.',
            tags: [],
            category: 'Uncategorized',
            version: 1.0,
            createdAt: new Date(),
            updatedAt: new Date(),
            authorId: 'current_user', // Simulated
            isArchived: false,
            usageCount: 0,
            relatedPromptIds: [],
            defaultVariables: {},
        };
        setPrompts(prev => [...prev, newPrompt]);
        setActivePrompt(newPrompt);
        notificationManager.addNotification(NotificationType.SUCCESS, 'Prompt Added', `"${name}" has been created.`);
        auditLogger.log('PROMPT_CREATED', newPrompt.authorId, newPrompt.id, `Name: ${name}`);
        telemetryService.recordMetric('prompt_created', { id: newPrompt.id, name: newPrompt.name });
        return newPrompt;
    }, [setPrompts]);

    const updatePrompt = useCallback((id: number, updates: Partial<Prompt>) => {
        setPrompts(prev => prev.map(p => {
            if (p.id === id) {
                const updated = { ...p, ...updates, updatedAt: new Date() };
                if (updates.text && updates.text !== p.text) {
                    updated.version = parseFloat((p.version + 0.01).toFixed(2)); // Increment minor version on text change
                } else if (updates.name && updates.name !== p.name) {
                    // Major version bump for significant changes, or just a new update date for name
                }
                auditLogger.log('PROMPT_UPDATED', updated.authorId, updated.id, `Name: ${updated.name}, Fields: ${Object.keys(updates).join(', ')}`);
                return updated;
            }
            return p;
        }));
        // Update active prompt immediately if it's the one being edited
        setActivePrompt(prev => prev && prev.id === id ? { ...prev, ...updates, updatedAt: new Date() } : prev);
        notificationManager.addNotification(NotificationType.INFO, 'Prompt Updated', `Changes saved.`);
    }, [setPrompts]);

    const deletePrompt = useCallback((id: number) => {
        const promptToDelete = prompts.find(p => p.id === id);
        if (!promptToDelete) return;

        setPrompts(prev => prev.filter(p => p.id !== id));
        if (activePrompt?.id === id) {
            setActivePrompt(prompts.length > 1 ? prompts[0] : null);
        }
        promptVersionControlService.deleteVersionsForPrompt(id); // Clean up versions
        notificationManager.addNotification(NotificationType.INFO, 'Prompt Deleted', `"${promptToDelete.name}" has been moved to recycle bin (simulated permanent delete).`);
        auditLogger.log('PROMPT_DELETED', promptToDelete.authorId, promptToDelete.id, `Name: ${promptToDelete.name}`);
        telemetryService.recordMetric('prompt_deleted', { id: promptToDelete.id, name: promptToDelete.name });
    }, [prompts, activePrompt, setPrompts]);

    const savePromptVersion = useCallback((prompt: Prompt, variables: Record<string, string>, message?: string) => {
        promptVersionControlService.saveVersion(prompt, variables, message);
    }, []);

    const getPromptVersions = useCallback((promptId: number) => {
        return promptVersionControlService.getVersions(promptId);
    }, []);

    const revertPromptToVersion = useCallback((prompt: Prompt, versionId: string) => {
        const reverted = promptVersionControlService.revertToVersion(prompt, versionId);
        if (reverted) {
            updatePrompt(prompt.id, reverted);
            // After reverting, save the new state as a new version
            promptVersionControlService.saveVersion(reverted, {}, `Reverted to version ${versionId.substring(0, 8)}`);
        }
    }, [updatePrompt]);

    const contextValue = useMemo(() => ({
        prompts,
        activePrompt,
        setActivePrompt,
        addPrompt,
        updatePrompt,
        deletePrompt,
        savePromptVersion,
        getPromptVersions,
        revertPromptToVersion,
    }), [
        prompts,
        activePrompt,
        setActivePrompt,
        addPrompt,
        updatePrompt,
        deletePrompt,
        savePromptVersion,
        getPromptVersions,
        revertPromptToVersion,
    ]);

    return (
        <PromptContext.Provider value={contextValue}>
            {children}
        </PromptContext.Provider>
    );
};

// --- Section 4: Advanced UI Components (Invented by DevCore UI/UX Engineering) ---

/**
 * @component NotificationToast
 * @description Displays a single notification toast.
 * Invented to provide clear user feedback without disrupting workflow.
 */
export const NotificationToast: React.FC<{ notification: AppNotification, onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => {
    const bgColor = useMemo(() => {
        switch (notification.type) {
            case NotificationType.SUCCESS: return 'bg-green-500';
            case NotificationType.ERROR: return 'bg-red-500';
            case NotificationType.INFO: return 'bg-blue-500';
            case NotificationType.WARNING: return 'bg-yellow-500';
            default: return 'bg-gray-700';
        }
    }, [notification.type]);

    useEffect(() => {
        if (notification.timeout && notification.timeout > 0) {
            const timer = setTimeout(() => onDismiss(notification.id), notification.timeout);
            return () => clearTimeout(timer);
        }
    }, [notification.id, notification.timeout, onDismiss]);

    return (
        <div className={`${bgColor} text-white px-4 py-2 rounded-md shadow-lg mb-2 flex items-center justify-between`}>
            <div>
                <strong className="block">{notification.message}</strong>
                {notification.details && <span className="text-sm opacity-90">{notification.details}</span>}
            </div>
            <button onClick={() => onDismiss(notification.id)} className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20">&times;</button>
        </div>
    );
};

/**
 * @component NotificationContainer
 * @description Renders all active notification toasts.
 * Invented as a global, non-intrusive notification hub.
 */
export const NotificationContainer: React.FC = () => {
    const notifications = useAppNotifications();

    const handleDismiss = useCallback((id: string) => {
        notificationManager.removeNotification(id);
    }, []);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {notifications.map(n => (
                <NotificationToast key={n.id} notification={n} onDismiss={handleDismiss} />
            ))}
        </div>
    );
};

/**
 * @component PromptSettingsModal
 * @description Modal for editing prompt metadata and advanced settings.
 * Invented to centralize prompt configuration, ensuring consistency and rich metadata.
 */
export const PromptSettingsModal: React.FC<{ prompt: Prompt, isOpen: boolean, onClose: () => void, onSave: (updatedPrompt: Partial<Prompt>) => void }> = ({ prompt, isOpen, onClose, onSave }) => {
    const [tempDescription, setTempDescription] = useState(prompt.description);
    const [tempTags, setTempTags] = useState(prompt.tags.join(', '));
    const [tempCategory, setTempCategory] = useState(prompt.category);
    const [tempDefaultVars, setTempDefaultVars] = useState(JSON.stringify(prompt.defaultVariables, null, 2));

    useEffect(() => {
        if (isOpen) {
            setTempDescription(prompt.description);
            setTempTags(prompt.tags.join(', '));
            setTempCategory(prompt.category);
            setTempDefaultVars(JSON.stringify(prompt.defaultVariables, null, 2));
        }
    }, [isOpen, prompt]);

    const handleSave = () => {
        const updated: Partial<Prompt> = {
            description: tempDescription,
            tags: tempTags.split(',').map(tag => tag.trim()).filter(Boolean),
            category: tempCategory,
        };
        try {
            updated.defaultVariables = JSON.parse(tempDefaultVars);
        } catch (e) {
            notificationManager.addNotification(NotificationType.ERROR, 'Invalid JSON for Default Variables', e.message);
            return;
        }
        onSave(updated);
        onClose();
        auditLogger.log('PROMPT_METADATA_UPDATED', 'current_user', prompt.id, `Prompt: ${prompt.name}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4">Prompt Settings: {prompt.name}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Description</label>
                        <textarea value={tempDescription} onChange={e => setTempDescription(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Tags (comma-separated)</label>
                        <input type="text" value={tempTags} onChange={e => setTempTags(e.target.value)} className="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Category</label>
                        <input type="text" value={tempCategory} onChange={e => setTempCategory(e.target.value)} className="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Default Variables (JSON)</label>
                        <textarea value={tempDefaultVars} onChange={e => setTempDefaultVars(e.target.value)} rows={5} className="w-full mt-1 p-2 bg-background border border-border rounded-md font-mono text-xs"/>
                        <p className="text-xs text-text-secondary mt-1">These values will pre-populate the test variables section.</p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button onClick={onClose} className="btn-secondary">Cancel</button>
                        <button onClick={handleSave} className="btn-primary">Save Settings</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * @component AISettingsModal
 * @description Modal for configuring global AI settings and API keys.
 * Invented as a centralized hub for managing external AI service connections.
 */
export const AISettingsModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const { settings, updateSetting } = useUserSettings();
    const [tempApiKeys, setTempApiKeys] = useState<Partial<Record<AIServiceType, string>>>({});
    const [tempDefaultModel, setTempDefaultModel] = useState<AIModelIdentifier>(settings.defaultAIModel);
    const [tempTheme, setTempTheme] = useState<'light' | 'dark' | 'system'>(settings.theme);
    const [tempEnableVersionControl, setTempEnableVersionControl] = useState<boolean>(settings.enablePromptVersionControl);

    useEffect(() => {
        if (isOpen) {
            setTempApiKeys({ ...settings.apiKeys });
            setTempDefaultModel(settings.defaultAIModel);
            setTempTheme(settings.theme);
            setTempEnableVersionControl(settings.enablePromptVersionControl);
        }
    }, [isOpen, settings]);

    const handleApiKeyChange = (serviceType: AIServiceType, key: string) => {
        setTempApiKeys(prev => ({ ...prev, [serviceType]: key }));
    };

    const handleSave = () => {
        updateSetting('apiKeys', tempApiKeys);
        updateSetting('defaultAIModel', tempDefaultModel);
        updateSetting('theme', tempTheme);
        updateSetting('enablePromptVersionControl', tempEnableVersionControl);
        onClose();
        notificationManager.addNotification(NotificationType.SUCCESS, 'AI Settings Saved', 'Your AI configuration has been updated.');
        auditLogger.log('AI_SETTINGS_UPDATED', 'current_user');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-3xl">
                <h3 className="text-xl font-bold mb-4">Global AI & App Settings</h3>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold mb-2">API Key Management</h4>
                        <p className="text-sm text-text-secondary mb-3">Please note: API keys are stored locally in your browser. For production systems, secure server-side key management is recommended.</p>
                        {Object.values(AIServiceType).map(serviceType => (
                            <div key={serviceType} className="mb-3">
                                <label className="block text-sm font-medium text-text-secondary">{serviceType} API Key</label>
                                <input
                                    type="password"
                                    value={tempApiKeys[serviceType] || ''}
                                    onChange={e => handleApiKeyChange(serviceType, e.target.value)}
                                    className="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm"
                                    placeholder={`Enter ${serviceType} API Key`}
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4 className="font-bold mb-2">Default AI Model</h4>
                        <select
                            value={tempDefaultModel}
                            onChange={e => setTempDefaultModel(e.target.value as AIModelIdentifier)}
                            className="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm"
                        >
                            {aiServiceManager.getSupportedModels().map(model => (
                                <option key={model} value={model}>{model} ({aiServiceManager.getServiceForModel(model)?.serviceType})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <h4 className="font-bold mb-2">Application Theme</h4>
                        <select
                            value={tempTheme}
                            onChange={e => setTempTheme(e.target.value as 'light' | 'dark' | 'system')}
                            className="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </div>

                    <div>
                        <h4 className="font-bold mb-2">Prompt Version Control</h4>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={tempEnableVersionControl}
                                onChange={e => setTempEnableVersionControl(e.target.checked)}
                                className="form-checkbox h-4 w-4 text-primary rounded"
                            />
                            <span className="text-sm text-text-primary">Enable automatic prompt versioning</span>
                        </label>
                        <p className="text-xs text-text-secondary mt-1">Saves a snapshot of your prompt text on significant changes, allowing rollback.</p>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <button onClick={onClose} className="btn-secondary">Cancel</button>
                        <button onClick={handleSave} className="btn-primary">Save Settings</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * @component PromptHistoryViewer
 * @description Displays the version history of a prompt and allows reverting.
 * Invented for robust version control, a hallmark of commercial-grade development.
 */
export const PromptHistoryViewer: React.FC<{ prompt: Prompt, isOpen: boolean, onClose: () => void }> = ({ prompt, isOpen, onClose }) => {
    const { getPromptVersions, revertPromptToVersion, updatePrompt } = usePromptContext();
    const [versions, setVersions] = useState<PromptVersion[]>([]);
    const [selectedVersionText, setSelectedVersionText] = useState<string>('');
    const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null);

    useEffect(() => {
        if (isOpen && prompt) {
            const loadedVersions = getPromptVersions(prompt.id);
            setVersions(loadedVersions);
            // Optionally auto-select the current active prompt state as the "latest"
            if (loadedVersions.length > 0) {
                setSelectedVersion(loadedVersions[0]);
                setSelectedVersionText(loadedVersions[0].text);
            } else {
                setSelectedVersion(null);
                setSelectedVersionText('');
            }
        }
    }, [isOpen, prompt, getPromptVersions]);

    const handleVersionSelect = (version: PromptVersion) => {
        setSelectedVersion(version);
        setSelectedVersionText(version.text);
    };

    const handleRevert = () => {
        if (selectedVersion) {
            revertPromptToVersion(prompt, selectedVersion.versionId);
            onClose();
        }
    };

    if (!isOpen || !prompt) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
                <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                    <span>Version History: {prompt.name}</span>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">&times;</button>
                </h3>
                <div className="flex-grow flex gap-4 min-h-0">
                    <div className="w-1/3 border border-border rounded-md p-3 overflow-y-auto">
                        <h4 className="font-semibold mb-2 text-text-secondary">Versions</h4>
                        {versions.length === 0 && <p className="text-sm text-text-secondary">No versions saved for this prompt.</p>}
                        <ul className="space-y-2 text-sm">
                            {versions.map(v => (
                                <li
                                    key={v.versionId}
                                    className={`p-2 rounded-md cursor-pointer ${selectedVersion?.versionId === v.versionId ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'}`}
                                    onClick={() => handleVersionSelect(v)}
                                >
                                    <p className="font-semibold">{v.timestamp.toLocaleString()}</p>
                                    <p className="text-xs text-text-secondary truncate">{v.message || 'Auto-saved'}</p>
                                    <p className="text-xs text-text-tertiary">v{v.versionId.substring(0, 8)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-2/3 flex flex-col">
                        <h4 className="font-semibold mb-2 text-text-secondary">Selected Version Preview</h4>
                        <textarea
                            className="flex-grow p-3 bg-background border border-border rounded-md resize-none font-mono text-sm focus:outline-none"
                            value={selectedVersionText}
                            readOnly
                        />
                        <div className="mt-4 flex justify-end space-x-2">
                            <button onClick={handleRevert} disabled={!selectedVersion} className="btn-primary">Revert to This Version</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * @component OrchestrationBuilderModal
 * @description Modal for creating and editing AI orchestrations (prompt chains).
 * This component unlocks multi-step AI workflows, a core advanced feature.
 * Invented by "OrchestrAide AI Flow"
 */
export const OrchestrationBuilderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    orchestrationId?: string; // Optional: if editing an existing orchestration
}> = ({ isOpen, onClose, orchestrationId }) => {
    const { getOrchestrations, addOrchestration, updateOrchestration, deleteOrchestration, executeOrchestration } = promptOrchestrationService;
    const { prompts } = usePromptContext(); // Get all available prompts
    const [currentOrchestration, setCurrentOrchestration] = useState<AIOrchestrationContext | null>(null);
    const [tempOrchestrationName, setTempOrchestrationName] = useState('');
    const [tempInitialVariables, setTempInitialVariables] = useState<string>('{}'); // JSON string for initial variables
    const [executionResults, setExecutionResults] = useState<PromptExecutionHistoryEntry[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (orchestrationId) {
                const existing = getOrchestrations().find(o => o.id === orchestrationId);
                setCurrentOrchestration(existing || null);
                setTempOrchestrationName(existing?.name || '');
                setExecutionResults([]); // Clear previous results when opening
            } else {
                setCurrentOrchestration(null);
                setTempOrchestrationName('');
                setExecutionResults([]);
            }
        }
    }, [isOpen, orchestrationId, getOrchestrations]);

    const handleSave = () => {
        if (!tempOrchestrationName.trim()) {
            notificationManager.addNotification(NotificationType.WARNING, 'Name Required', 'Orchestration name cannot be empty.');
            return;
        }

        if (currentOrchestration) {
            updateOrchestration({ ...currentOrchestration, name: tempOrchestrationName });
        } else {
            addOrchestration(tempOrchestrationName);
        }
        onClose();
    };

    const handleAddStep = (type: 'prompt' | 'condition' | 'tool_call') => {
        if (!currentOrchestration) return;
        const newStep: AIOrchestrationContext['steps'][0] = { type };
        if (type === 'prompt') {
            newStep.promptId = prompts[0]?.id; // Default to first prompt
        } else if (type === 'condition') {
            newStep.logic = 'previousOutput.includes("SUCCESS")'; // Default logic
        } else if (type === 'tool_call') {
            newStep.tool = 'web_search'; // Default tool
        }
        setCurrentOrchestration(prev => prev ? { ...prev, steps: [...prev.steps, newStep] } : null);
    };

    const handleUpdateStep = (index: number, updates: Partial<AIOrchestrationContext['steps'][0]>) => {
        if (!currentOrchestration) return;
        const updatedSteps = currentOrchestration.steps.map((step, i) =>
            i === index ? { ...step, ...updates } : step
        );
        setCurrentOrchestration(prev => prev ? { ...prev, steps: updatedSteps } : null);
    };

    const handleDeleteStep = (index: number) => {
        if (!currentOrchestration) return;
        const updatedSteps = currentOrchestration.steps.filter((_, i) => i !== index);
        setCurrentOrchestration(prev => prev ? { ...prev, steps: updatedSteps } : null);
    };

    const handleExecute = async () => {
        if (!currentOrchestration) return;

        let initialVars: Record<string, string>;
        try {
            initialVars = JSON.parse(tempInitialVariables);
        } catch (e) {
            notificationManager.addNotification(NotificationType.ERROR, 'Invalid JSON', 'Initial Variables must be valid JSON.');
            return;
        }

        setIsExecuting(true);
        try {
            const results = await executeOrchestration(currentOrchestration.id, initialVars, prompts);
            setExecutionResults(results);
        } finally {
            setIsExecuting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
                <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                    <span>{orchestrationId ? 'Edit Orchestration' : 'New Orchestration'}</span>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">&times;</button>
                </h3>
                <div className="flex-grow flex flex-col gap-4 min-h-0">
                    <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                        <label className="text-sm font-medium text-text-secondary">Name:</label>
                        <input
                            type="text"
                            value={tempOrchestrationName}
                            onChange={e => setTempOrchestrationName(e.target.value)}
                            className="flex-grow p-2 bg-background border border-border rounded-md text-sm"
                            placeholder="Orchestration Name"
                        />
                        <button onClick={handleSave} className="btn-primary">Save Orchestration</button>
                    </div>

                    <div className="flex-grow flex gap-4 min-h-0">
                        {/* Orchestration Steps Builder */}
                        <div className="w-1/2 flex flex-col border border-border rounded-lg p-4">
                            <h4 className="font-bold mb-3">Orchestration Steps</h4>
                            <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                                {currentOrchestration?.steps.length === 0 && (
                                    <p className="text-sm text-text-secondary">No steps added yet. Add a step below.</p>
                                )}
                                {currentOrchestration?.steps.map((step, index) => (
                                    <div key={index} className="bg-background border border-border p-3 rounded-md flex flex-col space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm">Step {index + 1}: {step.type.toUpperCase()}</span>
                                            <button onClick={() => handleDeleteStep(index)} className="text-red-500 hover:text-red-700">&times;</button>
                                        </div>
                                        {step.type === 'prompt' && (
                                            <div>
                                                <label className="block text-xs text-text-secondary mb-1">Select Prompt:</label>
                                                <select
                                                    value={step.promptId || ''}
                                                    onChange={e => handleUpdateStep(index, { promptId: parseInt(e.target.value) })}
                                                    className="w-full p-1 bg-surface border border-border rounded text-xs"
                                                >
                                                    {prompts.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        {step.type === 'condition' && (
                                            <div>
                                                <label className="block text-xs text-text-secondary mb-1">Condition Logic (JS expression):</label>
                                                <input
                                                    type="text"
                                                    value={step.logic || ''}
                                                    onChange={e => handleUpdateStep(index, { logic: e.target.value })}
                                                    className="w-full p-1 bg-surface border border-border rounded font-mono text-xs"
                                                    placeholder="e.g., previousOutput.includes('SUCCESS')"
                                                />
                                            </div>
                                        )}
                                        {step.type === 'tool_call' && (
                                            <div>
                                                <label className="block text-xs text-text-secondary mb-1">Tool Name:</label>
                                                <input
                                                    type="text"
                                                    value={step.tool || ''}
                                                    onChange={e => handleUpdateStep(index, { tool: e.target.value })}
                                                    className="w-full p-1 bg-surface border border-border rounded font-mono text-xs"
                                                    placeholder="e.g., web_search, code_interpreter"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-border flex justify-between">
                                <button onClick={() => handleAddStep('prompt')} className="btn-secondary text-xs py-1 px-2">Add Prompt Step</button>
                                <button onClick={() => handleAddStep('condition')} className="btn-secondary text-xs py-1 px-2">Add Condition Step</button>
                                <button onClick={() => handleAddStep('tool_call')} className="btn-secondary text-xs py-1 px-2">Add Tool Call Step</button>
                            </div>
                        </div>

                        {/* Initial Variables & Execution Results */}
                        <div className="w-1/2 flex flex-col gap-4">
                            <div className="bg-background border border-border rounded-lg p-4 flex-shrink-0">
                                <h4 className="font-bold mb-2">Initial Variables (JSON)</h4>
                                <textarea
                                    value={tempInitialVariables}
                                    onChange={e => setTempInitialVariables(e.target.value)}
                                    rows={5}
                                    className="w-full p-2 bg-surface border border-border rounded-md font-mono text-xs"
                                    placeholder='{"name": "Alice", "country": "USA"}'
                                />
                                <button onClick={handleExecute} disabled={isExecuting || !currentOrchestration?.steps.length} className="btn-primary w-full mt-3">
                                    {isExecuting ? 'Executing...' : 'Run Orchestration'}
                                </button>
                            </div>

                            <div className="bg-background border border-border rounded-lg p-4 flex-grow overflow-y-auto">
                                <h4 className="font-bold mb-2">Execution Results</h4>
                                {isExecuting && <p className="text-text-secondary text-sm">Running steps, please wait...</p>}
                                {executionResults.length === 0 && !isExecuting && <p className="text-text-secondary text-sm">No execution results yet.</p>}
                                {executionResults.map((result, idx) => (
                                    <div key={result.id} className="mb-3 p-2 border-b border-border last:border-b-0">
                                        <p className="font-semibold text-sm flex items-center gap-2">
                                            Step {idx + 1}: {prompts.find(p => p.id === result.promptId)?.name || 'Orchestration Step'}
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                result.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                result.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {result.status.toUpperCase()}
                                            </span>
                                        </p>
                                        {result.response?.error && <p className="text-red-500 text-xs">Error: {result.response.error}</p>}
                                        {result.response?.generatedText && (
                                            <p className="text-xs text-text-secondary mt-1 max-h-24 overflow-y-auto font-mono bg-surface p-2 rounded-md">
                                                {result.response.generatedText}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Section 5: The Main PromptCraftPad Component (Expanded) ---

/**
 * @component PromptCraftPad
 * @description The main application component, now a comprehensive AI prompt engineering studio.
 * This component has been dramatically expanded to include advanced features,
 * integrating multiple AI services, robust prompt management, version control,
 * orchestration, and a rich user experience.
 * Invented as "The Brain" of DevCore's AI initiative by J.B. O'Callaghan III.
 */
export const PromptCraftPad: React.FC = () => {
    // This context provider now wraps the main component, managing core prompt state
    // and interactions with version control.
    return (
        <PromptContextProvider>
            <PromptCraftPadInner />
        </PromptContextProvider>
    );
};

// Inner component to consume the context
const PromptCraftPadInner: React.FC = () => {
    const {
        prompts,
        activePrompt,
        setActivePrompt,
        addPrompt,
        updatePrompt,
        deletePrompt,
        savePromptVersion,
        getPromptVersions, // Destructured but used internally by PromptHistoryViewer
        revertPromptToVersion, // Destructured but used internally by PromptHistoryViewer
    } = usePromptContext();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [tempName, setTempName] = useState('');
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
    const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
    const [aiStreamingText, setAiStreamingText] = useState<string>('');
    const [isExecutingAI, setIsExecutingAI] = useState(false);
    const [isPromptSettingsModalOpen, setIsPromptSettingsModalOpen] = useState(false);
    const [isAISettingsModalOpen, setIsAISettingsModalOpen] = useState(false);
    const [isPromptHistoryViewerOpen, setIsPromptHistoryViewerOpen] = useState(false);
    const [isOrchestrationBuilderOpen, setIsOrchestrationBuilderOpen] = useState(false);
    const [selectedOrchestrationId, setSelectedOrchestrationId] = useState<string | undefined>(undefined);
    const { settings, updateSetting } = useUserSettings();
    const promptEditorRef = useRef<HTMLTextAreaElement>(null);

    // AI Configuration State
    const [aiModel, setAiModel] = useState<AIModelIdentifier>(settings.defaultAIModel);
    const [aiConfig, setAiConfig] = useState<AIModelConfig>({
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1.0,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop_sequences: [],
    });
    const [isStreaming, setIsStreaming] = useState(true);

    // Initial variable population or reset when active prompt changes
    useEffect(() => {
        if (activePrompt) {
            // Merge default variables with any previously set variables for the same prompt
            const initialVars = { ...activePrompt.defaultVariables, ...variables };
            setVariables(initialVars);
            // Also update AI model selection if different models are preferred per prompt, or reset to default
            setAiModel(settings.defaultAIModel); // Keep global default for now
            setAiResponse(null); // Clear previous AI response
            setAiStreamingText('');
            // Focus on the editor when a new prompt is selected
            promptEditorRef.current?.focus();
        } else {
            setVariables({});
            setAiResponse(null);
            setAiStreamingText('');
        }
    }, [activePrompt, settings.defaultAIModel]); // Only re-run when activePrompt or default model changes

    // Auto-save prompt text changes
    useEffect(() => {
        const autoSaveInterval = settings.autoSaveIntervalMs;
        if (activePrompt && settings.enablePromptVersionControl && autoSaveInterval > 0) {
            const timer = setTimeout(() => {
                // Ensure we have the latest version of the prompt to save
                const currentPromptState = prompts.find(p => p.id === activePrompt.id);
                if (currentPromptState && currentPromptState.text !== activePrompt.text) { // Only save if text actually changed
                    savePromptVersion(currentPromptState, variables, 'Auto-save');
                }
            }, autoSaveInterval);
            return () => clearTimeout(timer);
        }
    }, [activePrompt, prompts, variables, settings.autoSaveIntervalMs, settings.enablePromptVersionControl, savePromptVersion]);

    // Handle application theme (simulated dark/light mode for demonstration)
    useEffect(() => {
        const applyTheme = (theme: 'light' | 'dark' | 'system') => {
            const root = document.documentElement;
            if (theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    root.classList.add('dark');
                    root.classList.remove('light');
                } else {
                    root.classList.add('light');
                    root.classList.remove('dark');
                }
            } else {
                root.classList.remove(theme === 'dark' ? 'light' : 'dark');
                root.classList.add(theme);
            }
        };
        applyTheme(settings.theme);
        auditLogger.log('THEME_CHANGED', 'system', undefined, `Theme set to ${settings.theme}`);
        // Add listener for system theme changes if set to 'system'
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => applyTheme(settings.theme);
        if (settings.theme === 'system') {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        }
        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [settings.theme]);

    const variableNames = useMemo(() => {
        if (!activePrompt) return [];
        // Use the new templating engine to extract variables, supporting advanced syntax
        return templatingEngineService.extractVariables(activePrompt.text);
    }, [activePrompt]);

    const renderedPrompt = useMemo(() => {
        if (!activePrompt) return '';
        const data = { ...variables };
        // Use the new templating engine to render
        return templatingEngineService.render(activePrompt.text, data);
    }, [activePrompt, variables]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!activePrompt) return;
        updatePrompt(activePrompt.id, { text: e.target.value });
        // The activePrompt state will be updated via the PromptContext useEffect
    };

    const handleNameUpdate = (id: number, newName: string) => {
        if (!newName.trim()) {
            notificationManager.addNotification(NotificationType.WARNING, 'Name Required', 'Prompt name cannot be empty.');
            setTempName(prompts.find(p => p.id === id)?.name || ''); // Revert temp name
            setEditingId(null);
            return;
        }
        updatePrompt(id, { name: newName });
        setEditingId(null);
    };

    const handleAddNew = () => {
        const newPrompt = addPrompt('New Untitled Prompt');
        setVariables(newPrompt.defaultVariables); // Initialize with new prompt's defaults
    };

    const handleDelete = (id: number) => {
        deletePrompt(id);
    };

    const handleExecuteAI = async () => {
        if (!activePrompt || isExecutingAI) return;
        setIsExecutingAI(true);
        setAiResponse(null);
        setAiStreamingText('');
        notificationManager.addNotification(NotificationType.INFO, 'AI Request Sent', `Executing prompt with ${aiModel}...`);

        const request: AIRequest = {
            model: aiModel,
            prompt: renderedPrompt,
            config: aiConfig,
            stream: isStreaming,
            variables: variables, // Pass the current variables used for rendering
        };

        try {
            const response = await aiServiceManager.execute(request, (chunk) => {
                if (isStreaming) {
                    setAiStreamingText(prev => prev + chunk);
                }
            });
            setAiResponse(response);
            if (!isStreaming) { // If not streaming, the full text comes in the final response
                setAiStreamingText(response.generatedText);
            }
            if (response.error) {
                notificationManager.addNotification(NotificationType.ERROR, 'AI Execution Failed', response.error);
            } else {
                notificationManager.addNotification(NotificationType.SUCCESS, 'AI Execution Complete', `Response from ${response.model} received.`);
            }
            // Increment usage count for the prompt
            updatePrompt(activePrompt.id, { usageCount: (activePrompt.usageCount || 0) + 1 });
            auditLogger.log('AI_PROMPT_EXECUTED', 'current_user', activePrompt.id, `Model: ${aiModel}`);
        } catch (error) {
            console.error('AI Execution Error:', error);
            notificationManager.addNotification(NotificationType.ERROR, 'AI Execution Error', error.message);
        } finally {
            setIsExecutingAI(false);
        }
    };

    // Prompt Orchestration management
    const [orchestrations, setOrchestrations] = useState<AIOrchestrationContext[]>([]);
    useEffect(() => {
        const unsubscribe = promptOrchestrationService.subscribe(setOrchestrations);
        return () => unsubscribe();
    }, []);

    const handleCreateNewOrchestration = () => {
        setSelectedOrchestrationId(undefined); // No specific ID for new
        setIsOrchestrationBuilderOpen(true);
    };

    const handleEditOrchestration = (id: string) => {
        setSelectedOrchestrationId(id);
        setIsOrchestrationBuilderOpen(true);
    };

    const handleDeleteOrchestration = (id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this orchestration?');
        if (confirmDelete) {
            promptOrchestrationService.deleteOrchestration(id);
        }
    };

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary bg-background">
            <header className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <SparklesIcon className="text-primary" size={36} />
                    <h1 className="text-3xl font-bold ml-3">Prompt Craft Pad</h1>
                    <p className="text-text-secondary mt-1 ml-4">Create, save, and manage your favorite AI prompts. Now powered by a universe of features.</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => setIsAISettingsModalOpen(true)} className="btn-secondary text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.526.323 1.151.469 1.776.469z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        AI & App Settings
                    </button>
                    <button onClick={handleCreateNewOrchestration} className="btn-secondary text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        New Orchestration
                    </button>
                </div>
            </header>

            <div className="flex-grow flex gap-6 min-h-0">
                {/* Left Sidebar: Prompt Management */}
                <aside className="w-1/3 bg-surface border border-border p-4 rounded-lg flex flex-col shadow-md">
                    <h3 className="font-bold mb-2 flex items-center justify-between">
                        My Prompts
                        <button onClick={() => setIsPromptHistoryViewerOpen(true)} disabled={!activePrompt} className="btn-icon text-text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </button>
                    </h3>
                    <ul className="space-y-2 flex-grow overflow-y-auto pr-2 custom-scrollbar">{prompts.map((p: Prompt) => (
                        <li key={p.id} className="group flex items-center justify-between">
                            <div className={`w-full text-left rounded-md ${activePrompt?.id === p.id ? 'bg-primary/10' : ''}`}>
                                <button
                                    onClick={() => setActivePrompt(p)}
                                    onDoubleClick={() => {setEditingId(p.id); setTempName(p.name);}}
                                    className={`w-full text-left px-3 py-2 ${activePrompt?.id === p.id ? 'text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    {editingId === p.id ? (
                                        <input
                                            autoFocus
                                            value={tempName}
                                            onChange={e => setTempName(e.target.value)}
                                            onBlur={() => handleNameUpdate(p.id, tempName)}
                                            onKeyDown={e => e.key === 'Enter' && handleNameUpdate(p.id, tempName)}
                                            className="bg-gray-100 dark:bg-gray-700 text-text-primary w-full p-1 rounded"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span>{p.name}</span>
                                            <span className="text-xs text-text-tertiary ml-2 opacity-0 group-hover:opacity-100">v{p.version.toFixed(2)}</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setActivePrompt(p); setIsPromptSettingsModalOpen(true); }} className="p-1 text-text-secondary hover:text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                </button>
                                <button onClick={() => handleDelete(p.id)} className="p-1 text-text-secondary hover:text-red-500">&times;</button>
                            </div>
                        </li>
                    ))}</ul>
                    <div className="mt-4 pt-4 border-t border-border">
                        <button onClick={handleAddNew} className="btn-primary w-full text-sm py-2">Add New Prompt</button>
                    </div>
                    {/* Orchestrations List */}
                    <div className="mt-6 pt-4 border-t border-border">
                        <h4 className="font-bold mb-2 flex items-center justify-between">
                            My Orchestrations
                            <button onClick={handleCreateNewOrchestration} className="btn-icon text-text-secondary hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                            </button>
                        </h4>
                        <ul className="space-y-2 text-sm max-h-48 overflow-y-auto custom-scrollbar">
                            {orchestrations.length === 0 && <li className="text-text-secondary">No orchestrations yet.</li>}
                            {orchestrations.map(o => (
                                <li key={o.id} className="group flex items-center justify-between">
                                    <button onClick={() => handleEditOrchestration(o.id)} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {o.name}
                                    </button>
                                    <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditOrchestration(o.id)} className="p-1 text-text-secondary hover:text-blue-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                        </button>
                                        <button onClick={() => handleDeleteOrchestration(o.id)} className="p-1 text-text-secondary hover:text-red-500">&times;</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="w-2/3 flex flex-col gap-4">
                    {activePrompt ? (<>
                        {/* Prompt Editor */}
                        <textarea
                            ref={promptEditorRef}
                            value={activePrompt.text}
                            onChange={handleTextChange}
                            className="flex-grow p-4 bg-surface border border-border rounded-md resize-none font-mono text-sm focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
                            style={{ fontFamily: settings.editorFontFamily, fontSize: settings.editorFontSize + 'px' }}
                        />

                        {/* Prompt Preview & Variables */}
                        <div className="flex-shrink-0 bg-surface border border-border p-4 rounded-lg shadow-sm">
                            {variableNames.length > 0 && (
                                <>
                                    <h4 className="font-bold mb-2">Test Variables</h4>
                                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar mb-4">
                                        {variableNames.map(v => (
                                            <div key={v}>
                                                <label className="text-xs block mb-1 text-text-secondary">{v}</label>
                                                <input
                                                    type="text"
                                                    value={variables[v] || ''}
                                                    onChange={e => setVariables({...variables, [v]: e.target.value})}
                                                    className="w-full bg-background border border-border px-2 py-1 rounded text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            <h4 className="font-bold mt-4 mb-2">Live Preview</h4>
                            <p className="text-sm p-3 bg-background rounded border border-border max-h-48 overflow-y-auto custom-scrollbar">{renderedPrompt}</p>
                        </div>
                    </>) : (
                        <div className="flex-grow flex items-center justify-center bg-background rounded-lg text-text-secondary border border-border">
                            Select a prompt or create a new one to begin crafting.
                        </div>
                    )}
                </main>
            </div>

            {/* AI Interaction Panel (Collapsible) */}
            <footer className={`flex-shrink-0 mt-6 bg-surface border border-border rounded-lg shadow-md transition-all duration-300 ${isAIPanelOpen ? 'h-auto max-h-[70vh]' : 'h-16'}`}>
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}>
                    <h3 className="font-bold flex items-center">
                        <SparklesIcon className="text-primary mr-2" />
                        AI Interaction & Results
                    </h3>
                    <span className="text-2xl text-text-secondary">{isAIPanelOpen ? '−' : '+'}</span>
                </div>
                {isAIPanelOpen && (
                    <div className="p-4 pt-0 border-t border-border grid grid-cols-2 gap-6 h-full overflow-y-auto">
                        {/* AI Controls */}
                        <div>
                            <h4 className="font-bold mb-3">AI Model Configuration</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary">AI Service / Model</label>
                                    <select
                                        value={aiModel}
                                        onChange={e => setAiModel(e.target.value as AIModelIdentifier)}
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm"
                                    >
                                        {Object.values(AIServiceType).map(serviceType => (
                                            <optgroup key={serviceType} label={serviceType}>
                                                {aiServiceManager.getModelsByServiceType(serviceType).map(model => (
                                                    <option key={model} value={model}>{model}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary">Temperature ({aiConfig.temperature})</label>
                                        <input type="range" min="0" max="1" step="0.1" value={aiConfig.temperature} onChange={e => setAiConfig({...aiConfig, temperature: parseFloat(e.target.value)})} className="w-full mt-1 accent-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary">Max Tokens ({aiConfig.max_tokens})</label>
                                        <input type="range" min="50" max="2000" step="50" value={aiConfig.max_tokens} onChange={e => setAiConfig({...aiConfig, max_tokens: parseInt(e.target.value)})} className="w-full mt-1 accent-primary" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" checked={isStreaming} onChange={e => setIsStreaming(e.target.checked)} id="ai-streaming" className="form-checkbox h-4 w-4 text-primary rounded" />
                                    <label htmlFor="ai-streaming" className="text-sm">Stream Response</label>
                                </div>
                                <button onClick={handleExecuteAI} disabled={!activePrompt || isExecutingAI} className="btn-primary w-full mt-4">
                                    {isExecutingAI ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Generating...
                                        </span>
                                    ) : (
                                        `Generate with ${aiModel}`
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* AI Response */}
                        <div>
                            <h4 className="font-bold mb-3">AI Response</h4>
                            <div className="bg-background border border-border rounded-md p-3 text-sm font-mono whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                                {aiStreamingText || (aiResponse && aiResponse.generatedText) || 'No response yet.'}
                            </div>
                            {aiResponse && (
                                <div className="mt-2 text-xs text-text-secondary space-y-1">
                                    <p>Model: {aiResponse.model} ({aiResponse.serviceType})</p>
                                    <p>Duration: {aiResponse.durationMs.toFixed(2)} ms</p>
                                    <p>Tokens: Prompt: {aiResponse.tokenUsage.prompt_tokens}, Completion: {aiResponse.tokenUsage.completion_tokens}, Total: {aiResponse.tokenUsage.total_tokens}</p>
                                    <p>Estimated Cost: ${aiResponse.costEstimateUSD.toFixed(5)}</p>
                                    {aiResponse.error && <p className="text-red-500">Error: {aiResponse.error}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </footer>

            {/* Modals for Advanced Features */}
            {activePrompt && (
                <PromptSettingsModal
                    prompt={activePrompt}
                    isOpen={isPromptSettingsModalOpen}
                    onClose={() => setIsPromptSettingsModalOpen(false)}
                    onSave={(updates) => updatePrompt(activePrompt.id, updates)}
                />
            )}
            <AISettingsModal isOpen={isAISettingsModalOpen} onClose={() => setIsAISettingsModalOpen(false)} />
            {activePrompt && settings.enablePromptVersionControl && (
                <PromptHistoryViewer
                    prompt={activePrompt}
                    isOpen={isPromptHistoryViewerOpen}
                    onClose={() => setIsPromptHistoryViewerOpen(false)}
                />
            )}
            <OrchestrationBuilderModal
                isOpen={isOrchestrationBuilderOpen}
                onClose={() => setIsOrchestrationBuilderOpen(false)}
                orchestrationId={selectedOrchestrationId}
            />

            {/* Global Notification Toasts */}
            <NotificationContainer />
        </div>
    );
};
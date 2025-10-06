// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.


import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ALL_FEATURES } from './features/index.ts';
import type { ViewType } from '../types.ts';

// --- Start of New Inventions and Integrations (Story in Comments) ---

/**
 * @story
 * In the early days of Project 'OmniPal', the command palette was a simple navigation tool.
 * As Citibank Demo Business Inc. grew, the need for a truly intelligent, comprehensive,
 * and deeply integrated operational hub became paramount. This file, `CommandPalette.tsx`,
 * evolved from a humble search bar into the central nervous system of our enterprise platform.
 *
 * It started with basic navigation, then incorporated feature flags, AI-driven suggestions,
 * and eventually became a unified interface for hundreds of internal microservices and
 * external SaaS providers. This transformation was driven by the vision of President
 * James Burvel O'Callaghan III, who envisioned a single point of control for an
 * increasingly complex digital ecosystem.
 *
 * Every component, utility, and service integration described below represents a milestone
 * in OmniPal's journey towards being the most efficient, intelligent, and scalable
 * financial technology platform.
 */

// --- SECTION 1: CORE UTILITIES AND CONSTANTS ---

/**
 * @invention
 * `CommandType` Enum: A robust classification system for different kinds of commands,
 * enabling sophisticated routing, permission checks, and UI rendering logic.
 * This was a key architectural decision for scalability.
 */
export enum CommandType {
  Navigation = 'navigation',
  Feature = 'feature',
  Action = 'action',
  Setting = 'setting',
  AI = 'ai',
  DataQuery = 'data_query',
  DevTool = 'dev_tool',
  System = 'system',
  Report = 'report',
  Approval = 'approval',
  Monitoring = 'monitoring',
  Integration = 'integration',
  Communication = 'communication',
  Security = 'security',
  Utility = 'utility',
  Help = 'help',
}

/**
 * @invention
 * `CommandCategory` Enum: Provides a semantic grouping for commands, improving
 * discoverability and user experience. It's distinct from `CommandType` to allow
 * for cross-cutting categories (e.g., 'Financial Reports' could contain both 'Report' and 'Action' types).
 */
export enum CommandCategory {
  General = 'General',
  Navigation = 'Navigation',
  AI = 'AI & ML',
  Data = 'Data Management',
  Settings = 'User Settings',
  Development = 'Development Tools',
  Security = 'Security & Compliance',
  Operations = 'System Operations',
  Reports = 'Financial Reports',
  Approvals = 'Workflow Approvals',
  Monitoring = 'System Monitoring',
  Integrations = 'External Integrations',
  CustomerManagement = 'Customer Management',
  ProductManagement = 'Product Management',
  Marketing = 'Marketing & Sales',
  HR = 'Human Resources',
  Legal = 'Legal & Regulatory',
  Analytics = 'Business Analytics',
  Support = 'Support & Help',
  Communication = 'Communication',
  Automation = 'Automation',
  Compliance = 'Compliance',
  Administration = 'Administration',
}

/**
 * @invention
 * `CommandPaletteItem` Interface: Extends the basic command structure with richer metadata.
 * This allows for advanced features like permission checks, target service routing,
 * and dynamic rendering based on the command's nature.
 */
export interface CommandPaletteItem {
  id: string;
  name: string;
  category: CommandCategory; // Changed from string to enum
  icon: React.ReactNode;
  description: string;
  type: CommandType; // New field
  keywords?: string[]; // For enhanced search
  requiresAuth?: boolean; // For security checks
  permissionLevel?: 'admin' | 'user' | 'guest' | 'developer' | 'finance_manager' | 'auditor' | 'support'; // Granular access control
  targetService?: string; // Which microservice or external API this command interacts with
  execute?: (args?: any) => Promise<any>; // For direct execution within the palette
  contextual?: boolean; // If the command is context-dependent
}

/**
 * @invention
 * `ExternalServiceIntegration` Interface: Defines the structure for external service metadata.
 * This centralized definition allows for dynamic integration management, health checks,
 * and documentation linking directly from the command palette.
 */
export interface ExternalServiceIntegration {
  id: string;
  name: string;
  description: string;
  baseUrl?: string;
  apiKeyEnvVar?: string;
  docsUrl?: string;
  statusUrl?: string;
  tags: string[];
  integrationType: 'AI' | 'CRM' | 'Analytics' | 'Payments' | 'Cloud' | 'DevOps' | 'Communication' | 'DataWarehouse' | 'Auth' | 'Monitoring' | 'ERP' | 'HR' | 'Marketing' | 'Security';
  featuresProvided: string[];
}

/**
 * @invention
 * `LoggerService`: A centralized logging utility. Essential for debugging, auditing,
 * and compliance in a commercial-grade application. It supports different log levels
 * and can be integrated with external log aggregation services.
 */
export class LoggerService {
  private static instance: LoggerService;
  private constructor() {}

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  log(level: 'info' | 'warn' | 'error' | 'debug', message: string, context?: object) {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}][${level.toUpperCase()}] ${message}`, context);
    // In a real commercial system, this would push to a log aggregation service like Splunk, ELK, Datadog.
    // E.g., fetch('/api/log', { method: 'POST', body: JSON.stringify({ level, message, context, timestamp }) });
  }

  info(message: string, context?: object) { this.log('info', message, context); }
  warn(message: string, context?: object) { this.log('warn', message, context); }
  error(message: string, context?: object) { this.log('error', message, context); }
  debug(message: string, context?: object) { this.log('debug', message, context); }
}
export const logger = LoggerService.getInstance(); // Singleton instance for easy access.

/**
 * @invention
 * `TelemetryService`: For tracking user interactions, performance metrics, and errors.
 * Crucial for understanding user behavior, optimizing the application, and proactive issue detection.
 * Integrates with services like Datadog, New Relic, or Google Analytics.
 */
export class TelemetryService {
  private static instance: TelemetryService;
  private constructor() {}

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  trackEvent(eventName: string, properties?: object) {
    logger.debug(`Tracking event: ${eventName}`, properties);
    // Placeholder for actual telemetry integration (e.g., Mixpanel, Segment, Google Analytics)
    // window.analytics.track(eventName, properties);
  }

  trackPageView(pageName: string, properties?: object) {
    logger.debug(`Tracking page view: ${pageName}`, properties);
    // window.analytics.page(pageName, properties);
  }

  trackError(error: Error, context?: object) {
    logger.error(`Caught error: ${error.message}`, { error, context });
    // This would send to an error tracking service like Sentry or Bugsnag
    // Sentry.captureException(error, { extra: context });
  }

  measurePerformance(metricName: string, durationMs: number, properties?: object) {
    logger.debug(`Performance metric: ${metricName} - ${durationMs}ms`, properties);
    // Push to APM systems like New Relic, Datadog
  }
}
export const telemetry = TelemetryService.getInstance();

/**
 * @invention
 * `AuthService`: Manages user authentication status and permissions.
 * Essential for any commercial application to ensure secure access to features.
 * Integrates with OAuth providers, SSO solutions, and internal identity management.
 */
export class AuthService {
  private static instance: AuthService;
  private _currentUser: { id: string; name: string; roles: string[]; permissions: string[] } | null = null;
  private constructor() {
    // Simulate user loading from a session or token
    this._currentUser = {
      id: 'user_12345',
      name: 'John Doe',
      roles: ['admin', 'developer', 'finance_manager', 'auditor'],
      permissions: ['can_view_all_reports', 'can_approve_transactions', 'can_manage_users', 'can_access_dev_tools', 'can_use_ai_features', 'can_view_audit_logs'],
    };
    logger.info('AuthService initialized.', { user: this._currentUser?.name });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  isAuthenticated(): boolean {
    return !!this._currentUser;
  }

  getCurrentUser() {
    return this._currentUser;
  }

  hasPermission(permission: string): boolean {
    return this._currentUser?.permissions.includes(permission) || false;
  }

  hasRole(role: string): boolean {
    return this._currentUser?.roles.includes(role) || false;
  }

  canAccessCommand(command: CommandPaletteItem): boolean {
    if (!command.requiresAuth) return true; // Command doesn't require authentication

    if (!this.isAuthenticated()) {
      logger.debug(`Auth check failed for "${command.name}": Not authenticated.`);
      return false; // Not authenticated
    }

    // Check permission level
    if (command.permissionLevel) {
      if (command.permissionLevel === 'admin' && !this.hasRole('admin')) {
        logger.debug(`Auth check failed for "${command.name}": Requires admin role.`);
        return false;
      }
      if (command.permissionLevel === 'developer' && !this.hasRole('developer')) {
        logger.debug(`Auth check failed for "${command.name}": Requires developer role.`);
        return false;
      }
      if (command.permissionLevel === 'finance_manager' && !this.hasRole('finance_manager')) {
        logger.debug(`Auth check failed for "${command.name}": Requires finance_manager role.`);
        return false;
      }
      if (command.permissionLevel === 'auditor' && !this.hasRole('auditor')) {
        logger.debug(`Auth check failed for "${command.name}": Requires auditor role.`);
        return false;
      }
      // General user permission check
      if (command.permissionLevel === 'user' && !this.hasRole('user') && !this.hasRole('admin')) {
         logger.debug(`Auth check failed for "${command.name}": Requires user role.`);
         return false;
      }
    }
    // Additional granular permission checks if needed, e.g., command.requiredPermissions.some(p => this.hasPermission(p))
    return true;
  }

  login(username: string, passwordHash: string): Promise<boolean> {
    logger.info('Attempting login...', { username });
    // In a real app, this would hit an SSO/Auth endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        this._currentUser = {
          id: 'user_12345',
          name: 'John Doe',
          roles: ['admin', 'developer', 'finance_manager', 'auditor'],
          permissions: ['can_view_all_reports', 'can_approve_transactions', 'can_manage_users', 'can_access_dev_tools', 'can_use_ai_features', 'can_view_audit_logs'],
        };
        logger.info('Login successful.');
        resolve(true);
      }, 500);
    });
  }

  logout(): void {
    logger.info('User logged out.');
    this._currentUser = null;
    // Clear session, redirect to login
  }
}
export const authService = AuthService.getInstance();

/**
 * @invention
 * `ConfigService`: Manages application configuration, allowing for dynamic updates
 * and feature toggles. Critical for A/B testing, rollout management, and environment-specific settings.
 */
export class ConfigService {
  private static instance: ConfigService;
  private config: Record<string, any> = {};
  private constructor() {
    // Simulate loading config from an API or environment variables
    this.config = {
      ai: {
        geminiApiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        chatGptApiKey: 'sk-yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
        defaultModel: 'gemini-pro',
        smartSearchEnabled: true,
        chatbotEnabled: true,
      },
      telemetry: {
        enabled: true,
        endpoint: 'https://telemetry.citibank-demo.com/events',
      },
      featureFlags: {
        aiCodeGenerator: true,
        darkModeBanner: false,
        newReportingDashboard: true,
        contextualCommands: true,
        advancedSearchFilters: true,
        commandHotkeys: true,
      },
      externalServices: {
        salesforce: { enabled: true, endpoint: 'https://crm.citibank-demo.com/api' },
        datadog: { enabled: true, endpoint: 'https://api.datadoghq.com/api' },
        slack: { enabled: true, webhookUrl: 'https://hooks.slack.com/services/...' },
        jira: { enabled: true, endpoint: 'https://jira.citibank-demo.com/rest/api/2' },
        // ... hundreds more
      },
      commandPalette: {
        maxRecentCommands: 10,
        enableFavorites: true,
        aiSuggestionsEnabled: true,
        enableSmartSearch: true,
        showDescriptions: true,
        keyboardShortcut: 'Meta+K', // Example shortcut
      }
    };
    logger.info('ConfigService initialized.', { configKeys: Object.keys(this.config) });
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  get<T>(key: string, defaultValue?: T): T {
    const value = key.split('.').reduce((acc, part) => (acc && typeof acc === 'object' ? acc[part] : undefined), this.config);
    return (value !== undefined ? value : defaultValue) as T;
  }

  isFeatureEnabled(flag: string): boolean {
    return this.get(`featureFlags.${flag}`, false);
  }

  updateConfig(newConfig: Record<string, any>): void {
    // In a production system, this might trigger a remote update or a hot reload
    this.config = { ...this.config, ...newConfig };
    logger.warn('Config updated dynamically (simulated).', { newConfigKeys: Object.keys(newConfig) });
  }
}
export const configService = ConfigService.getInstance();

/**
 * @invention
 * `FeatureFlagService`: A dedicated facade for interacting with feature flags,
 * built on top of `ConfigService`. Allows for granular control over feature rollouts.
 */
export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private constructor() {}

  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  isEnabled(flagName: string): boolean {
    return configService.isFeatureEnabled(flagName);
  }

  // Potentially add methods for A/B testing, user segment targeting etc.
}
export const featureFlagService = FeatureFlagService.getInstance();

/**
 * @invention
 * `DebounceUtility`: A utility for debouncing function calls. Crucial for performance
 * in UI components, especially search inputs, to prevent excessive re-renders or API calls.
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}
export const debounceUtility = debounce; // Exporting the utility function directly.

/**
 * @invention
 * `LocalStorageManager`: A robust utility for managing local storage,
 * providing type safety and serialization for complex objects.
 * Used for persistent user preferences, recent commands, etc.
 */
export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private constructor() {}

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      logger.error(`Error reading from localStorage for key: ${key}`, { error: e });
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      logger.error(`Error writing to localStorage for key: ${key}`, { error: e, value });
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      logger.error(`Error removing from localStorage for key: ${key}`, { error: e });
    }
  }
}
export const localStorageManager = LocalStorageManager.getInstance();

// --- SECTION 2: AI INTEGRATION SERVICES ---

/**
 * @invention
 * `AIServiceFactory`: A factory pattern for creating AI service instances.
 * This abstracts away the underlying AI model (Gemini, ChatGPT) allowing the
 * application to easily switch or integrate new AI providers.
 * Supports different AI capabilities like text generation, code completion, content summarization.
 */
export class AIServiceFactory {
  private static instances: Map<string, AIServiceBase> = new Map();

  public static getService(type: 'gemini' | 'chatgpt'): AIServiceBase {
    if (!AIServiceFactory.instances.has(type)) {
      let service: AIServiceBase;
      if (type === 'gemini') {
        service = new GeminiAIService(configService.get('ai.geminiApiKey', ''));
      } else if (type === 'chatgpt') {
        service = new ChatGPTAIService(configService.get('ai.chatGptApiKey', ''));
      } else {
        throw new Error(`Unknown AI service type: ${type}`);
      }
      AIServiceFactory.instances.set(type, service);
    }
    return AIServiceFactory.instances.get(type)!;
  }
}

/**
 * @invention
 * `AIServiceBase`: Abstract base class for AI services.
 * Defines the common interface for all AI providers, promoting interoperability.
 */
export abstract class AIServiceBase {
  protected apiKey: string;
  constructor(apiKey: string) {
    if (!apiKey) {
      logger.warn(`AI Service initialized without API key. Features may be limited.`, { service: this.constructor.name });
    }
    this.apiKey = apiKey;
  }
  abstract generateText(prompt: string, options?: any): Promise<string>;
  abstract generateCode(prompt: string, language?: string, options?: any): Promise<string>;
  abstract summarize(text: string, options?: any): Promise<string>;
  abstract getSuggestions(input: string, context?: any): Promise<string[]>;
}

/**
 * @invention
 * `GeminiAIService`: Concrete implementation for Google Gemini AI.
 * Handles API calls, error handling, and response parsing specific to Gemini.
 */
export class GeminiAIService extends AIServiceBase {
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'; // Example endpoint
  private model = configService.get('ai.defaultModel', 'gemini-pro');

  constructor(apiKey: string) {
    super(apiKey);
    logger.info('GeminiAIService initialized.');
  }

  private async callApi(endpoint: string, data: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Gemini API Key is not configured.');
    }
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error.message}`);
      }
      return await response.json();
    } catch (e: any) {
      telemetry.trackError(e, { service: 'GeminiAIService', endpoint });
      throw new Error(`Failed to call Gemini API: ${e.message}`);
    }
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    logger.debug('Gemini: Generating text...', { prompt });
    const response = await this.callApi(`models/${this.model}:generateContent`, {
      contents: [{ parts: [{ text: prompt }] }],
      ...options,
    });
    return response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No text generated.';
  }

  async generateCode(prompt: string, language: string = 'typescript', options?: any): Promise<string> {
    logger.debug('Gemini: Generating code...', { prompt, language });
    const fullPrompt = `Generate a ${language} code snippet for the following request: ${prompt}\n\nCode:`;
    const response = await this.generateText(fullPrompt, options);
    // Basic extraction, a more robust parser might be needed for real scenarios
    const codeMatch = response.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : response;
  }

  async summarize(text: string, options?: any): Promise<string> {
    logger.debug('Gemini: Summarizing text...', { textLength: text.length });
    const fullPrompt = `Summarize the following text concisely:\n\n${text}\n\nSummary:`;
    return this.generateText(fullPrompt, options);
  }

  async getSuggestions(input: string, context?: any): Promise<string[]> {
    logger.debug('Gemini: Getting suggestions...', { input, context });
    const fullPrompt = `Given the user input "${input}" and the current context ${JSON.stringify(context || {})}, provide 5 relevant and concise command suggestions for a financial application command palette. Each suggestion should be a short phrase. Separate them with newlines.`;
    const response = await this.generateText(fullPrompt, { temperature: 0.5 });
    return response.split('\n').filter(s => s.trim() !== '').map(s => s.replace(/^\d+\.\s*/, '').trim());
  }
}

/**
 * @invention
 * `ChatGPTAIService`: Concrete implementation for OpenAI ChatGPT.
 * Similar to Gemini, handles specific API interactions.
 */
export class ChatGPTAIService extends AIServiceBase {
  private baseUrl = 'https://api.openai.com/v1'; // Example endpoint
  private model = configService.get('ai.defaultModel', 'gpt-3.5-turbo');

  constructor(apiKey: string) {
    super(apiKey);
    logger.info('ChatGPTAIService initialized.');
  }

  private async callApi(endpoint: string, data: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('ChatGPT API Key is not configured.');
    }
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ChatGPT API error: ${response.status} - ${errorData.error.message}`);
      }
      return await response.json();
    } catch (e: any) {
      telemetry.trackError(e, { service: 'ChatGPTAIService', endpoint });
      throw new Error(`Failed to call ChatGPT API: ${e.message}`);
    }
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    logger.debug('ChatGPT: Generating text...', { prompt });
    const response = await this.callApi('chat/completions', {
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      ...options,
    });
    return response?.choices?.[0]?.message?.content || 'No text generated.';
  }

  async generateCode(prompt: string, language: string = 'typescript', options?: any): Promise<string> {
    logger.debug('ChatGPT: Generating code...', { prompt, language });
    const fullPrompt = `Generate a ${language} code snippet for the following request: ${prompt}\n\nCode:`;
    return this.generateText(fullPrompt, options);
  }

  async summarize(text: string, options?: any): Promise<string> {
    logger.debug('ChatGPT: Summarizing text...', { textLength: text.length });
    const fullPrompt = `Summarize the following text concisely:\n\n${text}\n\nSummary:`;
    return this.generateText(fullPrompt, options);
  }

  async getSuggestions(input: string, context?: any): Promise<string[]> {
    logger.debug('ChatGPT: Getting suggestions...', { input, context });
    const fullPrompt = `Given the user input "${input}" and the current context ${JSON.stringify(context || {})}, provide 5 relevant and concise command suggestions for a financial application command palette. Each suggestion should be a short phrase. Separate them with newlines.`;
    const response = await this.generateText(fullPrompt, { temperature: 0.5 });
    return response.split('\n').filter(s => s.trim() !== '').map(s => s.replace(/^\d+\.\s*/, '').trim());
  }
}

// --- SECTION 3: EXTERNAL SERVICES REGISTRY ---

/**
 * @invention
 * `EXTERNAL_SERVICE_REGISTRY`: A comprehensive catalog of all integrated external services.
 * This registry powers dynamic feature discovery, status monitoring, and provides
 * a central reference for developers. It supports up to 1000 integrations.
 * Each entry details capabilities, access points, and tags for intelligent search.
 */
export const EXTERNAL_SERVICE_REGISTRY: ExternalServiceIntegration[] = [
  // AI Integrations
  { id: 'gemini_ai', name: 'Google Gemini AI', description: 'Advanced conversational AI for text generation, code, and summarization.', tags: ['AI', 'ML', 'Generative'], integrationType: 'AI', featuresProvided: ['text_gen', 'code_gen', 'summarization', 'smart_suggestions'] },
  { id: 'chatgpt_openai', name: 'OpenAI ChatGPT', description: 'Powerful large language model for diverse natural language tasks.', tags: ['AI', 'ML', 'NLP'], integrationType: 'AI', featuresProvided: ['text_gen', 'code_gen', 'summarization', 'smart_suggestions', 'sentiment_analysis'] },
  { id: 'huggingface_models', name: 'Hugging Face Hub', description: 'Access to open-source ML models for various tasks.', tags: ['AI', 'ML', 'Models', 'NLP'], integrationType: 'AI', featuresProvided: ['custom_nlp_models', 'image_recognition', 'data_science'] },
  // CRM & Customer Data
  { id: 'salesforce', name: 'Salesforce CRM', description: 'Customer relationship management for sales, service, and marketing.', tags: ['CRM', 'Sales', 'Customer'], integrationType: 'CRM', featuresProvided: ['customer_lookup', 'case_management', 'lead_generation', 'sales_pipeline'] },
  { id: 'zendesk', name: 'Zendesk Support', description: 'Customer service and support platform.', tags: ['Support', 'Customer', 'Ticketing'], integrationType: 'CRM', featuresProvided: ['ticket_creation', 'customer_history', 'knowledge_base_search'] },
  { id: 'segment', name: 'Segment CDP', description: 'Customer Data Platform for collecting and routing customer data.', tags: ['CDP', 'Analytics', 'Data'], integrationType: 'Analytics', featuresProvided: ['event_tracking', 'user_segmentation', 'data_routing'] },
  // Analytics & BI
  { id: 'tableau', name: 'Tableau Analytics', description: 'Business intelligence and data visualization platform.', tags: ['Analytics', 'BI', 'Reporting'], integrationType: 'Analytics', featuresProvided: ['dashboard_access', 'report_generation', 'data_exploration'] },
  { id: 'powerbi', name: 'Microsoft Power BI', description: 'Interactive data visualization and business intelligence product.', tags: ['Analytics', 'BI', 'Microsoft'], integrationType: 'Analytics', featuresProvided: ['dashboard_access', 'report_generation', 'data_modeling'] },
  { id: 'mixpanel', name: 'Mixpanel Product Analytics', description: 'Event-based analytics for understanding user behavior.', tags: ['Analytics', 'Product', 'UserBehavior'], integrationType: 'Analytics', featuresProvided: ['funnel_analysis', 'cohort_tracking', 'experiment_analysis'] },
  { id: 'google_analytics', name: 'Google Analytics 4', description: 'Web and app analytics service.', tags: ['Analytics', 'Web', 'GA4'], integrationType: 'Analytics', featuresProvided: ['traffic_reports', 'conversion_tracking', 'audience_insights'] },
  // Payments & Finance
  { id: 'stripe', name: 'Stripe Payments', description: 'Online payment processing for internet businesses.', tags: ['Payments', 'Fintech', 'Ecommerce'], integrationType: 'Payments', featuresProvided: ['payment_processing', 'refund_management', 'subscription_billing'] },
  { id: 'paypal', name: 'PayPal Business', description: 'Online payment system for businesses.', tags: ['Payments', 'Ecommerce'], integrationType: 'Payments', featuresProvided: ['payment_processing', 'transaction_history', 'invoice_generation'] },
  { id: 'adyen', name: 'Adyen Payments', description: 'All-in-one payment solution.', tags: ['Payments', 'Global'], integrationType: 'Payments', featuresProvided: ['omnichannel_payments', 'risk_management', 'fraud_detection'] },
  { id: 'netsuite', name: 'Oracle NetSuite ERP', description: 'Cloud-based business management software suite.', tags: ['ERP', 'Finance', 'Accounting'], integrationType: 'ERP', featuresProvided: ['financial_reporting', 'inventory_management', 'order_management'] },
  // Cloud & Infrastructure
  { id: 'aws_s3', name: 'AWS S3', description: 'Object storage for scalability, data availability, security, and performance.', tags: ['Cloud', 'AWS', 'Storage'], integrationType: 'Cloud', featuresProvided: ['file_upload', 'data_backup', 'static_hosting'] },
  { id: 'azure_storage', name: 'Azure Storage', description: 'Cloud storage solution for modern data storage scenarios.', tags: ['Cloud', 'Azure', 'Storage'], integrationType: 'Cloud', featuresProvided: ['blob_storage', 'file_shares', 'queue_storage'] },
  { id: 'google_cloud_storage', name: 'Google Cloud Storage', description: 'Unified object storage for developers and enterprises.', tags: ['Cloud', 'GCP', 'Storage'], integrationType: 'Cloud', featuresProvided: ['object_storage', 'data_archiving', 'content_delivery'] },
  { id: 'kubernetes', name: 'Kubernetes Orchestration', description: 'Automated deployment, scaling, and management of containerized applications.', tags: ['Cloud', 'DevOps', 'Orchestration'], integrationType: 'DevOps', featuresProvided: ['cluster_status', 'pod_management', 'deployment_rollback'] },
  // DevOps & Monitoring
  { id: 'github', name: 'GitHub Repositories', description: 'Platform for version control and collaborative software development.', tags: ['DevOps', 'Git', 'Code'], integrationType: 'DevOps', featuresProvided: ['repo_search', 'pull_request_status', 'issue_tracking'] },
  { id: 'jira', name: 'Jira Software', description: 'Issue tracking and project management for software teams.', tags: ['DevOps', 'ProjectManagement', 'Ticketing'], integrationType: 'DevOps', featuresProvided: ['issue_creation', 'sprint_boards', 'roadmap_planning'] },
  { id: 'datadog', name: 'Datadog Monitoring', description: 'Monitoring and security platform for cloud applications.', tags: ['Monitoring', 'Observability', 'APM'], integrationType: 'Monitoring', featuresProvided: ['dashboard_view', 'alert_management', 'log_search'] },
  { id: 'splunk', name: 'Splunk Log Management', description: 'Operational intelligence platform for machine data.', tags: ['Monitoring', 'Logging', 'SIEM'], integrationType: 'Monitoring', featuresProvided: ['log_search', 'security_incidents', 'compliance_reporting'] },
  { id: 'grafana', name: 'Grafana Dashboards', description: 'Open-source platform for monitoring and observability.', tags: ['Monitoring', 'Dashboards', 'Metrics'], integrationType: 'Monitoring', featuresProvided: ['dashboard_access', 'alerting', 'data_source_management'] },
  // Communication & Collaboration
  { id: 'slack', name: 'Slack Messaging', description: 'Channel-based messaging platform.', tags: ['Communication', 'Collaboration', 'Chat'], integrationType: 'Communication', featuresProvided: ['send_message', 'channel_search', 'user_lookup'] },
  { id: 'microsoft_teams', name: 'Microsoft Teams', description: 'Platform for teamwork and collaboration.', tags: ['Communication', 'Collaboration', 'Microsoft'], integrationType: 'Communication', featuresProvided: ['chat', 'meetings', 'file_sharing'] },
  { id: 'twilio', name: 'Twilio Communications', description: 'Programmable communications platform for voice, SMS, video.', tags: ['Communication', 'SMS', 'Voice'], integrationType: 'Communication', featuresProvided: ['send_sms', 'make_call', 'verify_phone'] },
  // Data Warehousing & ETL
  { id: 'snowflake', name: 'Snowflake Data Cloud', description: 'Cloud data warehousing for analytics.', tags: ['DataWarehouse', 'Analytics', 'Cloud'], integrationType: 'DataWarehouse', featuresProvided: ['query_execution', 'data_loading', 'warehouse_monitoring'] },
  { id: 'databricks', name: 'Databricks Lakehouse Platform', description: 'Unified data analytics platform.', tags: ['DataWarehouse', 'BigData', 'ML'], integrationType: 'DataWarehouse', featuresProvided: ['notebook_execution', 'data_engineering', 'ml_model_training'] },
  { id: 'fivetran', name: 'Fivetran Data Integration', description: 'Automated data connectors for ETL.', tags: ['DataIntegration', 'ETL', 'Analytics'], integrationType: 'DataWarehouse', featuresProvided: ['connector_status', 'sync_management', 'schema_migration'] },
  // Security & Identity
  { id: 'okta', name: 'Okta Identity Cloud', description: 'Identity and access management solution.', tags: ['Security', 'Auth', 'SSO'], integrationType: 'Auth', featuresProvided: ['user_management', 'sso_setup', 'multi_factor_auth'] },
  { id: 'duo_security', name: 'Duo Security MFA', description: 'Cloud-based multi-factor authentication (MFA).', tags: ['Security', 'MFA', 'Auth'], integrationType: 'Auth', featuresProvided: ['enroll_device', 'mfa_status', 'authentication_logs'] },
  { id: 'palo_alto', name: 'Palo Alto Networks', description: 'Cybersecurity solutions, including firewalls and cloud security.', tags: ['Security', 'Network', 'Firewall'], integrationType: 'Security', featuresProvided: ['threat_alerts', 'policy_management', 'traffic_analysis'] },
  // Marketing & Sales Automation
  { id: 'hubspot', name: 'HubSpot Marketing Hub', description: 'Inbound marketing, sales, service, and CRM software.', tags: ['Marketing', 'Sales', 'CRM'], integrationType: 'Marketing', featuresProvided: ['campaign_management', 'lead_scoring', 'email_automation'] },
  { id: 'marketo', name: 'Adobe Marketo Engage', description: 'Marketing automation software for lead management and email marketing.', tags: ['Marketing', 'Automation', 'CRM'], integrationType: 'Marketing', featuresProvided: ['lead_nurturing', 'email_campaigns', 'event_management'] },
  // HR & Internal Tools
  { id: 'workday', name: 'Workday HCM', description: 'Cloud-based human capital management and financial management software.', tags: ['HR', 'HCM', 'Payroll'], integrationType: 'HR', featuresProvided: ['employee_lookup', 'time_off_requests', 'payroll_reports'] },
  { id: 'concur', name: 'SAP Concur Expense', description: 'Expense, travel, and invoice management solution.', tags: ['HR', 'Finance', 'Travel'], integrationType: 'HR', featuresProvided: ['expense_submission', 'travel_booking', 'invoice_processing'] },
  // And many more... to reach up to 1000, this list would be dynamically loaded
  // or generated, perhaps using an internal service registry API.
  // For demonstration, these few dozen provide the concept.
  { id: 'internal_audit_api', name: 'Internal Audit Service', description: 'API for compliance and audit trail management.', tags: ['Internal', 'Audit', 'Compliance'], integrationType: 'Monitoring', featuresProvided: ['audit_log_search', 'compliance_reports'] },
  { id: 'risk_management_engine', name: 'Risk Management Engine', description: 'Analyzes and mitigates financial risks.', tags: ['Internal', 'Risk', 'Finance'], integrationType: 'Monitoring', featuresProvided: ['risk_assessment', 'fraud_alerts'] },
  { id: 'customer_data_platform_internal', name: 'Internal CDP', description: 'Unified internal customer data platform.', tags: ['Internal', 'CDP', 'Customer'], integrationType: 'DataWarehouse', featuresProvided: ['customer_profile_fetch', 'segmentation'] },
  { id: 'transaction_processing_service', name: 'Transaction Processor', description: 'Core service for handling financial transactions.', tags: ['Internal', 'Payments', 'Transactions'], integrationType: 'Payments', featuresProvided: ['initiate_transaction', 'transaction_status'] },
  { id: 'regulatory_reporting_service', name: 'Regulatory Reporting', description: 'Generates reports for regulatory bodies.', tags: ['Internal', 'Compliance', 'Reporting'], integrationType: 'ERP', featuresProvided: ['generate_basel_report', 'view_mifid_data'] },
  { id: 'market_data_api', name: 'Market Data API', description: 'Provides real-time and historical financial market data.', tags: ['Internal', 'Finance', 'Data'], integrationType: 'DataWarehouse', featuresProvided: ['stock_quotes', 'currency_rates', 'historical_charts'] },
  { id: 'identity_verification_service', name: 'Identity Verification (KYC)', description: 'Performs Know Your Customer (KYC) checks.', tags: ['Internal', 'Security', 'Compliance'], integrationType: 'Security', featuresProvided: ['verify_customer', 'kyc_status'] },
  { id: 'document_management_system', name: 'Document Management System', description: 'Stores and manages all official documents.', tags: ['Internal', 'Documents', 'Compliance'], integrationType: 'DataWarehouse', featuresProvided: ['search_documents', 'upload_document'] },
  { id: 'pricing_engine_service', name: 'Pricing Engine', description: 'Calculates dynamic pricing for products and services.', tags: ['Internal', 'Finance', 'Product'], integrationType: 'ProductManagement', featuresProvided: ['get_product_price', 'update_pricing_rule'] },
  { id: 'campaign_management_service', name: 'Campaign Management', description: 'Manages marketing and sales campaigns.', tags: ['Internal', 'Marketing', 'Sales'], integrationType: 'Marketing', featuresProvided: ['create_campaign', 'campaign_status', 'performance_report'] },
  { id: 'legal_compliance_checker', name: 'Legal Compliance Checker', description: 'Ensures operations adhere to legal frameworks.', tags: ['Internal', 'Legal', 'Compliance'], integrationType: 'Security', featuresProvided: ['check_policy_adherence', 'regulatory_updates'] },
  { id: 'fraud_detection_system', name: 'Fraud Detection System', description: 'Identifies and flags suspicious activities.', tags: ['Internal', 'Security', 'Fraud'], integrationType: 'Security', featuresProvided: ['flag_transaction', 'review_suspicious_activity'] },
];

/**
 * @invention
 * `commandIcons`: A collection of React Node icons for commands.
 * Centralized icon management ensures consistency and simplifies updates.
 */
export const commandIcons = {
  navigation: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25l-.547 2.328a4.5 4.5 0 0 0-2.091 1.01l-1.054.747-.534 1.272m9.458-9.185a.75.75 0 0 0 .002 1.054l-.427.427a.75.75 0 0 1-1.06 0l-.096-.095M16.5 6.75l-4.249 4.25c-.179.178-.44.275-.705.275H9.75a.75.75 0 0 1-.75-.75V7.5c0-.181.047-.355.132-.513l.427-.427M18 15.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
  feature: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.061.365.36.651.71.651h4.2c.491 0 .969.351 1.067.832l.702 3.513c.03.148.01.296-.044.434-.1.271-.254.48-.465.636l-1.026.769c-.28.21-.527.42-.738.636-.21.216-.356.47-.44.75l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.061-.365-.36-.651-.71-.651H5.4c-.491 0-.969-.351-1.067-.832L3.63 10.05c-.03-.148-.01-.296.044-.434.1-.271.254-.48.465-.636l1.026-.769c.28-.21.527-.42.738-.636.21-.216.356-.47.44-.75l.213-1.28C9.034 4.338 9.504 3.94 10.054 3.94Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
  action: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
  setting: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.167 1.005c.017.1.06.19.12.269l.73.73c.075.075.174.12.274.135l1.056.141c.55.074.95.53.95 1.082v1.093c0 .55-.398 1.02-.94 1.11l-1.005.167c-.1.017-.19.06-.269.12l-.73.73c-.075.075-.12.174-.135.274l-.141 1.056c-.074.55-.53.95-1.082.95h-1.093c-.55 0-1.02-.398-1.11-.94l-.167-1.005c-.017-.1-.06-.19-.12-.269l-.73-.73c-.075-.075-.174-.12-.274-.135l-1.056-.141c-.55-.074-.95-.53-.95-1.082V12c0-.55.398-1.02.94-1.11l1.005-.167c.1-.017.19-.06.269-.12l.73-.73c.075-.075.12-.174.135-.274l.141-1.056ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" /></svg>,
  ai: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9.75 9.75l-.063.154Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18.75 16.5L12 19.5l-6.75-3V8.25L12 5.25l6.75 3V16.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5L12 10.5 7.5 7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 16.5V12A1.5 1.5 0 0 1 9 10.5h7.5" /></svg>,
  dataQuery: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.749-.128h10.502c.262 0 .514.045.749.128m-12 0A2.25 2.25 0 0 0 4.5 9.128v7.744c0 1.037.84 1.878 1.878 1.878h10.244c1.038 0 1.878-.84 1.878-1.878V9.128A2.25 2.25 0 0 0 18 6.878m-12 0h12" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6H12a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H10.5" /></svg>,
  devTool: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
  system: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25V10.5m0 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm0 0V17.25m0 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 7.5V4.5a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v3m15 0h-3V10.5M4.5 7.5h3V10.5m0 0h6m-3 0a2.25 2.25 0 1 0 0 4.5h-.75" /></svg>,
  report: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2H12a2.25 2.25 0 0 1 2.25 2.25v2.25M12 12a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75V8.25m0 3a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75m-6.75 0a.75.75 0 0 0-.75.75H6a.75.75 0 0 0 .75.75H7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.875 14.25h-1.5A2.625 2.625 0 0 1 12.75 11.625v-1.5a2.625 2.625 0 0 1 2.625-2.625h1.5m-.75 12h3M12 21.75V12.75a2.25 2.25 0 0 1 2.25-2.25h1.5M4.5 21.75V15.75m1.5 0h7.5" /></svg>,
  approval: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 17.25v1.006a1.5 1.5 0 0 0 1.5 1.5h3.622a1.5 1.5 0 0 0 1.5-1.5V15.75m-3.622-1.5L11.25 11.25M4.5 7.5l7.5 7.5 7.5-7.5" /></svg>,
  monitoring: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25m0-1.5V21a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75V15.75m0-1.5h2.25a2.25 2.25 0 0 0 2.25-2.25V3M6 16.5H3.75a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0V14.25a2.25 2.25 0 0 1-2.25 2.25H16.5m-14.25-9a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V7.5M16.5 14.25h2.25a2.25 2.25 0 0 0 2.25-2.25V6.75m-4.5 7.5h-1.5" /></svg>,
  integration: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>,
  star: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400"><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.226 2.953.292.704.759.063 3.092.258c.767.066 1.071.97.597 1.549l-2.218 2.154-.564.547.134.75l.547 3.092c.16.904-.755 1.683-1.508 1.257l-2.766-1.82-.618-.409-.618.41-2.766 1.819c-.753.426-1.668-.348-1.508-1.257l.547-3.092.134-.75-.564-.546-2.218-2.155c-.474-.579-.17-.14-.597-1.549l3.092-.258.759-.063.292-.704 1.226-2.953Z" clipRule="evenodd" /></svg>,
  recent: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
  alert: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.174 3.374 1.945 3.374h14.71c1.771 0 2.81-1.874 1.945-3.374L12 3.373a1.75 1.75 0 0 0-2.903 0l-7.054 12.003Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.007v.008H12v-.008Z" /></svg>,
  info: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063 0l.041.02V15a.75.75 0 0 1-1.5 0V11.25Zm-3.75 0h.008v.008H7.5V11.25Zm.375 0h.008v.008H7.875V11.25ZM11.25 6.75h.008v.008H11.25V6.75Zm.375 0h.008v.008H11.625V6.75Zm0 3.75h.008v.008H11.625V10.5Zm.375 0h.008v.008H12V10.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.32 0-9.75 4.383-9.75 9.75s4.383 9.75 9.75 9.75 9.75-4.383 9.75-9.75S17.32 2.25 12 2.25Z" /></svg>,
};

// --- SECTION 4: ENHANCED COMMAND DEFINITION ---

/**
 * @invention
 * `INTERNAL_COMMANDS`: A comprehensive list of core system commands.
 * This extends the basic navigation to include sophisticated actions,
 * AI interactions, and developer utilities.
 */
export const INTERNAL_COMMANDS: CommandPaletteItem[] = [
  // Core Navigation
  { id: 'ai-feature-builder', name: 'Go to AI Builder', category: CommandCategory.Navigation, icon: commandIcons.navigation, description: 'Navigate to the AI feature builder dashboard.', type: CommandType.Navigation, permissionLevel: 'developer' },
  { id: 'dashboard-overview', name: 'Go to Main Dashboard', category: CommandCategory.Navigation, icon: commandIcons.navigation, description: 'Navigate to the primary operational dashboard.', type: CommandType.Navigation },
  { id: 'user-profile', name: 'Open User Profile', category: CommandCategory.Navigation, icon: commandIcons.navigation, description: 'View and edit your personal user profile settings.', type: CommandType.Navigation, requiresAuth: true },
  { id: 'settings-global', name: 'Open Global Settings', category: CommandCategory.Settings, icon: commandIcons.setting, description: 'Configure system-wide settings and preferences.', type: CommandType.Setting, permissionLevel: 'admin' },
  { id: 'audit-logs', name: 'View Audit Logs', category: CommandCategory.Security, icon: commandIcons.monitoring, description: 'Access system audit trails for compliance and security.', type: CommandType.Monitoring, permissionLevel: 'auditor', targetService: 'internal_audit_api' },
  { id: 'api-documentation', name: 'View API Documentation', category: CommandCategory.Development, icon: commandIcons.devTool, description: 'Access internal and external API documentation.', type: CommandType.DevTool, permissionLevel: 'developer' },
  { id: 'manage-users', name: 'Manage User Accounts', category: CommandCategory.Administration, icon: commandIcons.system, description: 'Create, modify, or delete user accounts and roles.', type: CommandType.Action, requiresAuth: true, permissionLevel: 'admin' },
  { id: 'open-support-ticket', name: 'Open Support Ticket', category: CommandCategory.Support, icon: commandIcons.help, description: 'Create a new support ticket for technical assistance.', type: CommandType.Communication, targetService: 'zendesk' },

  // AI-Powered Commands
  {
    id: 'ai-generate-report-summary',
    name: 'AI: Generate Report Summary',
    category: CommandCategory.AI,
    icon: commandIcons.ai,
    description: 'Use AI to summarize recent financial reports.',
    type: CommandType.AI,
    requiresAuth: true,
    permissionLevel: 'finance_manager', // Example custom permission
    execute: async () => {
      telemetry.trackEvent('ai_report_summary_initiated');
      try {
        const textToSummarize = "Here is a very long financial report text that needs summarization. It details quarterly earnings, market trends, and investment opportunities. Specifically, it mentions a 15% increase in Q3 profits, driven by strong performance in emerging markets. The report also highlights potential risks from geopolitical instability and rising interest rates. Overall, the outlook for the next fiscal year is cautiously optimistic, with projected growth of 8-10%."; // In reality, fetch from a report service
        const aiService = AIServiceFactory.getService(configService.get('ai.defaultModel', 'gemini') === 'gemini-pro' ? 'gemini' : 'chatgpt');
        const summary = await aiService.summarize(textToSummarize);
        alert(`AI Summary: ${summary}`);
        logger.info('AI report summary generated.');
        telemetry.trackEvent('ai_report_summary_success');
      } catch (e: any) {
        logger.error('Failed to generate AI report summary.', { error: e.message });
        telemetry.trackError(e, { command: 'ai-generate-report-summary' });
        alert(`Error: ${e.message}`);
      }
    },
  },
  {
    id: 'ai-code-suggestion',
    name: 'AI: Suggest Code Snippet',
    category: CommandCategory.AI,
    icon: commandIcons.ai,
    description: 'Leverage AI to generate code snippets based on a prompt (for developers).',
    type: CommandType.AI,
    permissionLevel: 'developer',
    contextual: true, // Might depend on current file/context in an IDE-like setup
    execute: async () => {
      if (!featureFlagService.isEnabled('aiCodeGenerator')) {
        alert('AI Code Generator is currently disabled by feature flag.');
        return;
      }
      telemetry.trackEvent('ai_code_suggestion_initiated');
      const prompt = window.prompt('Enter a natural language description for the code you need:');
      if (!prompt) return;
      try {
        const aiService = AIServiceFactory.getService(configService.get('ai.defaultModel', 'gemini') === 'gemini-pro' ? 'gemini' : 'chatgpt');
        const code = await aiService.generateCode(prompt, 'typescript');
        // In a real scenario, this would inject code into an editor or open a modal
        window.prompt('Generated Code (Copy to clipboard):', code); // Using prompt for display only
        logger.info('AI code snippet generated.');
        telemetry.trackEvent('ai_code_suggestion_success');
      } catch (e: any) {
        logger.error('Failed to generate AI code snippet.', { error: e.message });
        telemetry.trackError(e, { command: 'ai-code-suggestion' });
        alert(`Error: ${e.message}`);
      }
    }
  },
  {
    id: 'ai-smart-search',
    name: 'AI: Smart Search & Recommendations',
    category: CommandCategory.AI,
    icon: commandIcons.ai,
    description: 'Use AI to interpret complex queries and suggest relevant commands or data points.',
    type: CommandType.AI,
    execute: async (input: string) => {
      if (!configService.get('commandPalette.aiSuggestionsEnabled')) {
        alert('AI Smart Search is disabled in settings.');
        return;
      }
      telemetry.trackEvent('ai_smart_search_initiated');
      try {
        logger.info(`AI Smart Search invoked with input: "${input}"`);
        alert(`AI Smart Search would process "${input}" and provide contextual results. This command is primarily for triggering AI suggestions within the palette's search.`);
        telemetry.trackEvent('ai_smart_search_success');
      } catch (e: any) {
        logger.error('Failed to perform AI smart search.', { error: e.message });
        telemetry.trackError(e, { command: 'ai-smart-search' });
        alert(`Error: ${e.message}`);
      }
    }
  },
  {
    id: 'ai-customer-sentiment-analysis',
    name: 'AI: Analyze Customer Sentiment',
    category: CommandCategory.AI,
    icon: commandIcons.ai,
    description: 'Analyze sentiment of customer feedback or communications.',
    type: CommandType.AI,
    requiresAuth: true,
    permissionLevel: 'user',
    targetService: 'chatgpt_openai', // Or a custom NLP service
    execute: async () => {
      const text = window.prompt('Enter text to analyze sentiment:');
      if (!text) return;
      alert(`Analyzing sentiment for: "${text}" (Simulated. In real life, AI would return a sentiment score).`);
      telemetry.trackEvent('ai_sentiment_analysis_initiated');
      return Promise.resolve();
    }
  },

  // Data & Reporting
  { id: 'data-query-builder', name: 'Open Data Query Builder', category: CommandCategory.Data, icon: commandIcons.dataQuery, description: 'Build and execute custom queries against the data warehouse.', type: CommandType.DataQuery, permissionLevel: 'developer', targetService: 'snowflake' },
  { id: 'view-financial-statements', name: 'View Financial Statements', category: CommandCategory.Reports, icon: commandIcons.report, description: 'Access consolidated balance sheets, income statements, and cash flows.', type: CommandType.Report, requiresAuth: true, permissionLevel: 'finance_manager' },
  { id: 'generate-compliance-report', name: 'Generate Compliance Report', category: CommandCategory.Reports, icon: commandIcons.report, description: 'Produce reports required for regulatory compliance (e.g., Basel III, MiFID II).', type: CommandType.Report, requiresAuth: true, permissionLevel: 'auditor', targetService: 'regulatory_reporting_service' },
  { id: 'customer-data-lookup', name: 'Customer Data Lookup', category: CommandCategory.CustomerManagement, icon: commandIcons.dataQuery, description: 'Search for customer profiles across integrated CRM systems.', type: CommandType.DataQuery, requiresAuth: true, targetService: 'salesforce' },
  { id: 'product-sales-analytics', name: 'Product Sales Analytics', category: CommandCategory.Analytics, icon: commandIcons.report, description: 'Analyze sales performance by product line and region.', type: CommandType.Report, targetService: 'mixpanel' },
  { id: 'export-data-to-csv', name: 'Export Data to CSV', category: CommandCategory.Data, icon: commandIcons.dataQuery, description: 'Export currently viewed table data to a CSV file.', type: CommandType.Action, requiresAuth: true, execute: () => { alert('Exporting data to CSV (simulated).'); telemetry.trackEvent('data_exported', { format: 'csv' }); return Promise.resolve(); } },

  // System Operations & Monitoring
  { id: 'system-health-check', name: 'Run System Health Check', category: CommandCategory.Operations, icon: commandIcons.monitoring, description: 'Perform diagnostic checks on core system services.', type: CommandType.System, permissionLevel: 'admin', targetService: 'datadog' },
  { id: 'clear-cache', name: 'Clear Local Cache', category: CommandCategory.Utility, icon: commandIcons.system, description: 'Clears client-side cached data for a fresh start.', type: CommandType.Action, execute: () => { localStorageManager.removeItem('commandPalette:recent'); alert('Local cache cleared.'); telemetry.trackEvent('cache_cleared'); return Promise.resolve(); } },
  { id: 'toggle-dark-mode', name: 'Toggle Dark Mode', category: CommandCategory.Settings, icon: commandIcons.setting, description: 'Switch between light and dark UI themes.', type: CommandType.Setting, execute: () => { const current = document.documentElement.classList.toggle('dark'); localStorageManager.setItem('theme', current ? 'dark' : 'light'); alert(`Theme switched to ${current ? 'dark' : 'light'} mode.`); telemetry.trackEvent('theme_toggled', { theme: current ? 'dark' : 'light' }); return Promise.resolve(); } },
  { id: 'view-api-logs', name: 'View API Gateway Logs', category: CommandCategory.Monitoring, icon: commandIcons.monitoring, description: 'Access real-time logs from the API Gateway.', type: CommandType.Monitoring, permissionLevel: 'developer', targetService: 'splunk' },
  { id: 'send-slack-alert', name: 'Send Slack Alert', category: CommandCategory.Communication, icon: commandIcons.action, description: 'Send an urgent alert message to a specific Slack channel.', type: CommandType.Communication, requiresAuth: true, permissionLevel: 'admin', targetService: 'slack', execute: () => { const message = window.prompt('Enter message for Slack alert:'); if(message) alert(`Sending "${message}" to Slack (simulated).`); return Promise.resolve(); } },

  // Workflow & Approvals
  { id: 'approve-pending-transaction', name: 'Approve Pending Transaction', category: CommandCategory.Approvals, icon: commandIcons.approval, description: 'Review and approve financial transactions awaiting authorization.', type: CommandType.Approval, requiresAuth: true, permissionLevel: 'finance_manager', targetService: 'transaction_processing_service' },
  { id: 'review-new-account-requests', name: 'Review New Account Requests', category: CommandCategory.Approvals, icon: commandIcons.approval, description: 'Manage and approve new customer account applications.', type: CommandType.Approval, requiresAuth: true, permissionLevel: 'admin', targetService: 'identity_verification_service' },
  { id: 'assign-task-jira', name: 'Assign Task in Jira', category: CommandCategory.Automation, icon: commandIcons.action, description: 'Create and assign a new task in Jira for a colleague.', type: CommandType.Communication, requiresAuth: true, permissionLevel: 'developer', targetService: 'jira', execute: () => { const task = window.prompt('Enter Jira task description:'); if(task) alert(`Creating Jira task "${task}" (simulated).`); return Promise.resolve(); } },

  // Developer & Debugging Tools
  { id: 'dev-console-toggle', name: 'Toggle Dev Console', category: CommandCategory.Development, icon: commandIcons.devTool, description: 'Show/hide the developer console for debugging purposes.', type: CommandType.DevTool, permissionLevel: 'developer', execute: () => { console.log('Developer console toggled (simulated).'); alert('Dev console toggled (check browser console).'); return Promise.resolve(); } },
  { id: 'feature-flag-dashboard', name: 'Open Feature Flag Dashboard', category: CommandCategory.Development, icon: commandIcons.devTool, description: 'Manage and override feature flags in development environments.', type: CommandType.DevTool, permissionLevel: 'developer', targetService: 'internal_config_service' },
  { id: 'simulate-error', name: 'Simulate Error', category: CommandCategory.Development, icon: commandIcons.devTool, description: 'Trigger a controlled error for testing error handling and telemetry.', type: CommandType.DevTool, permissionLevel: 'developer', execute: () => { telemetry.trackError(new Error('Simulated UI error from command palette'), { component: 'CommandPalette' }); alert('Simulated error logged to telemetry.'); throw new Error('Simulated error for testing purposes'); } },
  { id: 'profile-performance', name: 'Profile UI Performance', category: CommandCategory.Development, icon: commandIcons.devTool, description: 'Start a UI performance profiling session.', type: CommandType.DevTool, permissionLevel: 'developer', execute: () => { console.time('UI_Profile'); alert('UI performance profiling started. Check console for results.'); setTimeout(() => console.timeEnd('UI_Profile'), 2000); return Promise.resolve(); } },
];

/**
 * @invention
 * `ContextualCommandProvider`: A mechanism for injecting commands based on the
 * current application context (e.g., active route, selected entity).
 * This allows for dynamic and intelligent command suggestions.
 */
export class ContextualCommandProvider {
  private static instance: ContextualCommandProvider;
  private constructor() {}

  public static getInstance(): ContextualCommandProvider {
    if (!ContextualCommandProvider.instance) {
      ContextualCommandProvider.instance = new ContextualCommandProvider();
    }
    return ContextualCommandProvider.instance;
  }

  // In a real application, this would take the current route, selected IDs, etc.
  getCommands(currentContext: { route: string; selectedEntityId?: string; entityType?: string }): CommandPaletteItem[] {
    logger.debug('Fetching contextual commands for:', currentContext);
    const commands: CommandPaletteItem[] = [];

    if (featureFlagService.isEnabled('contextualCommands')) {
      if (currentContext.route.startsWith('/customer/')) {
        const customerId = currentContext.selectedEntityId;
        commands.push({
          id: 'customer-send-email',
          name: `Email Customer ${customerId || ''}`,
          category: CommandCategory.CustomerManagement,
          icon: commandIcons.action,
          description: `Send an email to the customer with ID ${customerId}.`,
          type: CommandType.Action,
          contextual: true,
          requiresAuth: true,
          permissionLevel: 'user',
          targetService: 'salesforce', // Example, could be a CRM email system
          execute: () => { alert(`Sending email to customer ${customerId}`); return Promise.resolve(); }
        });
        commands.push({
          id: 'customer-view-transactions',
          name: `View Transactions for ${customerId || ''}`,
          category: CommandCategory.CustomerManagement,
          icon: commandIcons.dataQuery,
          description: `Open transaction history for customer with ID ${customerId}.`,
          type: CommandType.Navigation,
          contextual: true,
          requiresAuth: true,
          permissionLevel: 'user',
          targetService: 'transaction_processing_service',
          // In a real app, this would use `onSelect` with a structured payload or navigate
          execute: () => { alert(`Navigating to transactions for ${customerId}`); return Promise.resolve(); }
        });
      }
      // Add more context-specific commands here
      if (currentContext.route.startsWith('/reports/')) {
        commands.push({
          id: 'report-export-pdf',
          name: `Export Current Report as PDF`,
          category: CommandCategory.Reports,
          icon: commandIcons.action,
          description: 'Export the currently viewed report as a PDF document.',
          type: CommandType.Action,
          contextual: true,
          requiresAuth: true,
          permissionLevel: 'user',
          execute: () => { alert('Exporting report as PDF...'); return Promise.resolve(); }
        });
        commands.push({
          id: 'report-schedule-delivery',
          name: `Schedule Report Delivery`,
          category: CommandCategory.Reports,
          icon: commandIcons.action,
          description: 'Schedule the current report to be delivered automatically.',
          type: CommandType.Automation,
          contextual: true,
          requiresAuth: true,
          permissionLevel: 'finance_manager',
          execute: () => { alert('Scheduling report delivery...'); return Promise.resolve(); }
        });
      }
      if (currentContext.route.startsWith('/admin/settings')) {
        commands.push({
          id: 'admin-backup-config',
          name: `Backup Configuration`,
          category: CommandCategory.Administration,
          icon: commandIcons.action,
          description: 'Initiate a backup of the current system configuration.',
          type: CommandType.Security,
          contextual: true,
          requiresAuth: true,
          permissionLevel: 'admin',
          execute: () => { alert('Initiating configuration backup...'); return Promise.resolve(); }
        });
      }
    }

    return commands;
  }
}
export const contextualCommandProvider = ContextualCommandProvider.getInstance();


// --- SECTION 5: COMMAND PALETTE COMPONENT ENHANCEMENTS ---

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (view: ViewType) => void;
  currentAppContext?: { route: string; selectedEntityId?: string; entityType?: string }; // New: for contextual commands
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelect, currentAppContext }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<CommandPaletteItem[]>([]);
  const [recentCommands, setRecentCommands] = useState<CommandPaletteItem[]>(() => localStorageManager.getItem('commandPalette:recent') || []);
  const [favoriteCommands, setFavoriteCommands] = useState<CommandPaletteItem[]>(() => localStorageManager.getItem('commandPalette:favorites') || []);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * @invention
   * `useAIChatbot`: A custom hook for integrating a basic chatbot functionality
   * within the command palette, allowing users to ask questions directly.
   */
  const useAIChatbot = () => {
    const [chatResponse, setChatResponse] = useState<string | null>(null);
    const [isChatting, setIsChatting] = useState(false);

    const askAI = useCallback(async (question: string) => {
      setIsChatting(true);
      setChatResponse(null);
      telemetry.trackEvent('ai_chatbot_question', { question });
      try {
        const aiService = AIServiceFactory.getService(configService.get('ai.defaultModel', 'gemini') === 'gemini-pro' ? 'gemini' : 'chatgpt');
        const response = await aiService.generateText(`Answer the following question about a financial enterprise application: "${question}". Be concise.`);
        setChatResponse(response);
        telemetry.trackEvent('ai_chatbot_answer_success');
      } catch (e: any) {
        logger.error('AI Chatbot failed to get response.', { error: e.message, question });
        telemetry.trackError(e, { feature: 'ai_chatbot' });
        setChatResponse(`Error: ${e.message}`);
      } finally {
        setIsChatting(false);
      }
    }, []);

    return { chatResponse, isChatting, askAI, setChatResponse }; // Added setChatResponse to allow clearing
  };

  const { chatResponse, isChatting, askAI, setChatResponse } = useAIChatbot();


  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
      setAiSuggestions([]); // Clear AI suggestions on close
      setChatResponse(null); // Clear chat response on close
      telemetry.trackEvent('command_palette_closed');
    } else {
      inputRef.current?.focus();
      telemetry.trackEvent('command_palette_opened');
    }
  }, [isOpen, setChatResponse]);

  // Save recent/favorite commands to local storage on change
  useEffect(() => {
    localStorageManager.setItem('commandPalette:recent', recentCommands);
  }, [recentCommands]);

  useEffect(() => {
    localStorageManager.setItem('commandPalette:favorites', favoriteCommands);
  }, [favoriteCommands]);

  /**
   * @invention
   * `debouncedFetchAiSuggestions`: Debounced function for fetching AI suggestions.
   * Prevents excessive API calls while typing, enhancing performance.
   */
  const debouncedFetchAiSuggestions = useMemo(() => {
    return debounceUtility(async (query: string, context: any) => {
      if (query.length < 3 || !configService.get('commandPalette.aiSuggestionsEnabled') || !authService.hasPermission('can_use_ai_features')) {
        setAiSuggestions([]);
        setIsLoadingSuggestions(false);
        return;
      }
      setIsLoadingSuggestions(true);
      try {
        const aiService = AIServiceFactory.getService(configService.get('ai.defaultModel', 'gemini') === 'gemini-pro' ? 'gemini' : 'chatgpt');
        const suggestions = await aiService.getSuggestions(query, context);
        const suggestedCommands: CommandPaletteItem[] = suggestions.map((s, idx) => ({
          id: `ai-suggest-${idx}-${s.replace(/\W/g, '_').substring(0, 30)}`, // Ensure unique and shorter ID
          name: `AI Suggestion: ${s}`,
          category: CommandCategory.AI,
          icon: commandIcons.ai,
          description: `AI-generated suggestion based on your query: "${s}"`,
          type: CommandType.AI,
          execute: () => {
            setSearchTerm(s); // Auto-fill search with AI suggestion
            // Potentially auto-execute the most relevant command or refine search
            logger.info(`AI suggestion "${s}" selected.`);
            telemetry.trackEvent('ai_suggestion_selected', { suggestion: s });
            return Promise.resolve();
          }
        }));
        setAiSuggestions(suggestedCommands);
      } catch (e: any) {
        logger.error('Failed to fetch AI suggestions.', { error: e.message });
        telemetry.trackError(e, { feature: 'ai_suggestions' });
        setAiSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300); // 300ms debounce for snappier feel
  }, [currentAppContext]); // Recreate if context changes

  useEffect(() => {
    if (configService.get('commandPalette.aiSuggestionsEnabled') && searchTerm.length > 2 && isOpen && !searchTerm.toLowerCase().startsWith('chat:')) {
      debouncedFetchAiSuggestions(searchTerm, currentAppContext);
    } else {
      setAiSuggestions([]); // Clear if search term is too short or AI is disabled or it's a chat command
    }
  }, [searchTerm, isOpen, debouncedFetchAiSuggestions, currentAppContext]);


  const allAvailableCommands = useMemo(() => {
    const navigationCommands: CommandPaletteItem[] = [
      { id: 'ai-feature-builder', name: 'Go to AI Builder', category: CommandCategory.Navigation, icon: commandIcons.navigation, description: 'Navigate to the AI feature builder dashboard.', type: CommandType.Navigation, permissionLevel: 'developer'},
    ];

    // Map existing ALL_FEATURES to CommandPaletteItem structure
    const featureCommands: CommandPaletteItem[] = ALL_FEATURES.map(f => ({
      id: f.id,
      name: `Open: ${f.name}`,
      category: CommandCategory.Feature, // Assuming all ALL_FEATURES are type 'Feature'
      icon: f.icon || commandIcons.feature, // Use existing icon or default feature icon
      description: f.description || '',
      type: CommandType.Feature,
      keywords: f.keywords,
      requiresAuth: f.requiresAuth, // Assuming these fields exist in ALL_FEATURES if needed
      permissionLevel: f.permissionLevel,
    }));

    // Filter and combine all internal and external service commands
    const serviceCommands: CommandPaletteItem[] = EXTERNAL_SERVICE_REGISTRY
      .filter(service => configService.get(`externalServices.${service.id}.enabled`, true)) // Only enabled services
      .map(service => ({
        id: `service-open-${service.id}`,
        name: `Open ${service.name} Integration`,
        category: CommandCategory.Integrations,
        icon: commandIcons.integration,
        description: `Access the ${service.name} external service integration settings or dashboard.`,
        type: CommandType.Integration,
        keywords: [service.id, ...service.tags, ...service.featuresProvided],
        requiresAuth: true,
        permissionLevel: service.integrationType === 'DevOps' || service.integrationType === 'Security' || service.integrationType === 'Monitoring' ? 'admin' : 'user', // Heuristic for permission
      }));

    const contextualCommands = contextualCommandProvider.getCommands(currentAppContext || { route: window.location.pathname });

    // Combine and filter all commands
    const combinedCommands = [
      ...navigationCommands,
      ...featureCommands,
      ...INTERNAL_COMMANDS,
      ...serviceCommands,
      ...contextualCommands,
    ];

    // Filter by user permissions
    return combinedCommands.filter(cmd => authService.canAccessCommand(cmd));
  }, [currentAppContext]); // Recompute if current app context changes

  /**
   * @invention
   * `commandOptions`: Memoized and refined command options list, incorporating
   * search, recents, favorites, and AI suggestions. This complex filtering
   * and sorting logic is central to the intelligent palette experience.
   */
  const commandOptions: CommandPaletteItem[] = useMemo(() => {
    let filtered = allAvailableCommands;
    const lowerSearchTerm = searchTerm.toLowerCase();

    // Check for special command prefixes
    if (lowerSearchTerm.startsWith('/')) { // Special command prefix for internal commands, e.g., /config, /logs
      filtered = filtered.filter(cmd => cmd.id.startsWith(lowerSearchTerm.substring(1)));
    } else if (lowerSearchTerm.startsWith('chat:')) {
      // If it's a chat command, don't filter other commands immediately
      filtered = [];
    }
    else {
      // Standard keyword-based filtering
      filtered = filtered.filter(
        (cmd) =>
          cmd.name.toLowerCase().includes(lowerSearchTerm) ||
          (configService.get('commandPalette.showDescriptions') && cmd.description.toLowerCase().includes(lowerSearchTerm)) ||
          cmd.category.toLowerCase().includes(lowerSearchTerm) ||
          cmd.keywords?.some(k => k.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Prioritize AI suggestions, then favorites, then recents, then filtered results
    let finalOptions: CommandPaletteItem[] = [];

    // Add AI suggestions if available and search term matches
    if (aiSuggestions.length > 0 && searchTerm.length >= 3 && configService.get('commandPalette.aiSuggestionsEnabled') && !lowerSearchTerm.startsWith('chat:')) {
      finalOptions.push(
        { id: 'header-ai-suggestions', name: '✨ AI Suggestions', category: CommandCategory.AI, icon: commandIcons.ai, description: 'Intelligent recommendations from AI.', type: CommandType.System, execute: () => Promise.resolve() },
        ...aiSuggestions.map(s => ({ ...s, name: s.name.startsWith('AI Suggestion:') ? s.name : `✨ ${s.name}` }))
      );
    }

    // Add favorites
    if (configService.get('commandPalette.enableFavorites', true)) {
      const favoritedFiltered = favoriteCommands.filter(fav =>
        filtered.some(f => f.id === fav.id) && !finalOptions.some(opt => opt.id === fav.id)
      );
      if (favoritedFiltered.length > 0) {
        finalOptions.push(
          { id: 'header-favorites', name: '⭐️ Favorites', category: CommandCategory.General, icon: commandIcons.star, description: 'Your frequently used or marked commands.', type: CommandType.System, execute: () => Promise.resolve() },
          ...favoritedFiltered
        );
      }
    }

    // Add recent commands
    const recentFiltered = recentCommands.filter(rec =>
      filtered.some(f => f.id === rec.id) && !finalOptions.some(opt => opt.id === rec.id)
    ).slice(0, configService.get('commandPalette.maxRecentCommands', 5));

    if (recentFiltered.length > 0) {
      finalOptions.push(
        { id: 'header-recent', name: '🕒 Recent', category: CommandCategory.General, icon: commandIcons.recent, description: 'Recently executed commands.', type: CommandType.System, execute: () => Promise.resolve() },
        ...recentFiltered
      );
    }

    // Add remaining filtered commands, avoiding duplicates from AI/favorites/recents
    const uniqueFiltered = filtered.filter(cmd => !finalOptions.some(opt => opt.id === cmd.id));
    finalOptions = [...finalOptions, ...uniqueFiltered];

    // If search term is 'chat:', allow direct chat input, prioritizing it
    if (lowerSearchTerm.startsWith('chat:') && authService.hasPermission('can_use_ai_features') && configService.get('ai.chatbotEnabled')) {
      const chatQuestion = searchTerm.substring(5).trim();
      finalOptions.unshift({
        id: 'ai-chatbot-direct',
        name: `Chat with AI: "${chatQuestion || 'Type your question'}"`,
        category: CommandCategory.AI,
        icon: commandIcons.ai,
        description: 'Ask a question directly to the AI assistant.',
        type: CommandType.AI,
        execute: async () => {
          if (chatQuestion) {
            await askAI(chatQuestion);
            setSearchTerm(''); // Clear search term after asking AI
          } else {
            alert('Please type a question after "chat:".');
          }
          return Promise.resolve();
        }
      });
    }

    // If no results, offer AI search if enabled and not already a chat command
    if (finalOptions.length === 0 && searchTerm.length > 0 && configService.get('commandPalette.aiSuggestionsEnabled') && !lowerSearchTerm.startsWith('chat:')) {
      finalOptions.push({
        id: 'ai-no-results-help',
        name: `💡 Ask AI for help with "${searchTerm}"`,
        category: CommandCategory.AI,
        icon: commandIcons.ai,
        description: 'No direct matches found. Ask AI for suggestions or answers.',
        type: CommandType.AI,
        execute: async () => {
          await askAI(`What can I do with "${searchTerm}" in this financial application?`);
          setSearchTerm('');
          return Promise.resolve();
        }
      });
    }


    return finalOptions;
  }, [searchTerm, allAvailableCommands, aiSuggestions, recentCommands, favoriteCommands, chatResponse, askAI]);

  // Reset selected index when command options change (e.g., new search results)
  useEffect(() => {
    setSelectedIndex(0);
  }, [commandOptions.length]);

  /**
   * @invention
   * `handleCommandExecution`: Centralized function for executing commands.
   * This handles logging, telemetry, permission checks, and determines
   * whether to navigate or run an inline function.
   * It also manages recent commands and favorites.
   */
  const handleCommandExecution = useCallback(async (command: CommandPaletteItem) => {
    logger.info(`Executing command: ${command.name}`, { commandId: command.id, type: command.type });
    telemetry.trackEvent('command_executed', { commandId: command.id, commandName: command.name, commandType: command.type });

    // Add to recent commands (if not a header or system command that shouldn't be tracked)
    if (command.type !== CommandType.System && !command.id.startsWith('header-')) {
      setRecentCommands(prev => {
        const existing = prev.filter(c => c.id !== command.id);
        const newRecents = [command, ...existing].slice(0, configService.get('commandPalette.maxRecentCommands', 5));
        return newRecents;
      });
    }

    if (!authService.canAccessCommand(command)) {
      alert(`Permission denied: You do not have access to "${command.name}".`);
      logger.warn('Permission denied for command.', { commandId: command.id, user: authService.getCurrentUser()?.id });
      telemetry.trackEvent('command_permission_denied', { commandId: command.id });
      return;
    }

    if (command.execute) {
      onClose(); // Close palette before executing inline action
      try {
        await command.execute();
      } catch (e: any) {
        logger.error(`Error during inline command execution for ${command.id}: ${e.message}`, { error: e });
        telemetry.trackError(e, { commandId: command.id, executionType: 'inline' });
        alert(`Error executing command: ${e.message}`);
      }
    } else {
      // Default to navigation for most commands
      onSelect(command.id as ViewType);
      onClose();
    }
  }, [onSelect, onClose, recentCommands]); // Add recentCommands to dependency array

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        // Global shortcut to open the palette
        if (configService.isFeatureEnabled('commandHotkeys') && e.metaKey && e.key === 'k') { // Cmd+K or Ctrl+K
          e.preventDefault();
          onSelect('command-palette-toggle' as ViewType); // This would be intercepted by parent to open
          telemetry.trackEvent('command_palette_hotkey_open');
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % commandOptions.length);
        telemetry.trackEvent('command_palette_nav', { direction: 'down' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + commandOptions.length) % commandOptions.length);
        telemetry.trackEvent('command_palette_nav', { direction: 'up' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = commandOptions[selectedIndex];
        if (selected && selected.type !== CommandType.System) { // Prevent executing headers
          handleCommandExecution(selected);
        } else if (selected && selected.id.startsWith('header-')) {
          // If a header is selected, try to move to the first actual command after it
          const nextIndex = commandOptions.findIndex((cmd, idx) => idx > selectedIndex && cmd.type !== CommandType.System);
          if (nextIndex !== -1) {
            setSelectedIndex(nextIndex);
          } else {
            setSelectedIndex(0); // Wrap around if no more commands after header
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        telemetry.trackEvent('command_palette_escape');
      } else if (e.metaKey && e.key === 'f') { // Example: Cmd+F (or Ctrl+F) to favorite the selected item
        e.preventDefault();
        const selected = commandOptions[selectedIndex];
        if (selected && selected.type !== CommandType.System && selected.id && configService.get('commandPalette.enableFavorites')) {
          setFavoriteCommands(prev => {
            if (prev.some(f => f.id === selected.id)) {
              alert(`"${selected.name}" removed from favorites.`);
              telemetry.trackEvent('command_unfavorited', { commandId: selected.id });
              return prev.filter(f => f.id !== selected.id);
            } else {
              alert(`"${selected.name}" added to favorites.`);
              telemetry.trackEvent('command_favorited', { commandId: selected.id });
              return [...prev, selected];
            }
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commandOptions, selectedIndex, handleCommandExecution, onClose, configService.get('commandPalette.enableFavorites'), configService.isFeatureEnabled('commandHotkeys'), onSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-surface border border-border rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={isChatting ? "AI is typing..." : "Type a command, search, or 'chat: <question>' for AI..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full p-4 bg-surface text-text-primary text-lg focus:outline-none border-b border-border"
            disabled={isChatting} // Disable input while AI is chatting
          />
          {isLoadingSuggestions && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary animate-pulse">
              <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>

        {chatResponse && (
          <div className="p-4 bg-gray-800 border-b border-border text-text-secondary text-sm">
            <h4 className="font-semibold text-primary mb-2">AI Response:</h4>
            <p className="whitespace-pre-wrap">{chatResponse}</p>
            <button
              onClick={() => setChatResponse(null)}
              className="mt-2 text-xs text-blue-400 hover:text-blue-200"
            >
              Clear AI Response
            </button>
          </div>
        )}

        <ul className="max-h-96 overflow-y-auto p-2">
          {commandOptions.length > 0 ? (
            commandOptions.map((item, index) => {
              const isFavorite = favoriteCommands.some(f => f.id === item.id);
              const isHeader = item.type === CommandType.System && item.id.startsWith('header-');

              return (
                <li
                  key={item.id + index}
                  // Disable interaction for headers
                  onMouseDown={(e) => {
                    if (isHeader) {
                      e.stopPropagation();
                      return;
                    }
                    handleCommandExecution(item);
                  }}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer group ${
                    selectedIndex === index ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                  } ${isHeader ? 'cursor-default text-text-secondary font-semibold pt-4 mt-2 border-t border-border first:pt-2 first:mt-0 first:border-t-0' : ''}`}
                  // Add a data attribute for testing or analytics if needed
                  data-command-id={item.id}
                  data-command-type={item.type}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-text-secondary ${isHeader ? 'text-lg' : ''}`}>{item.icon}</div>
                    <span className="text-text-primary">{item.name}</span>
                    {isFavorite && !isHeader && <span className="text-yellow-400 ml-1">⭐️</span>}
                    {!isHeader && item.contextual && <span className="ml-2 text-xs text-blue-400">Contextual</span>}
                  </div>
                  {!isHeader && (
                    <span className="text-xs text-text-secondary bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                  )}
                </li>
              );
            })
          ) : (
            <li className="p-4 text-center text-text-secondary">No results found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};
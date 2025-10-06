// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React from 'react';
import type { ViewType, SidebarItem } from '../types.ts';
import { useGlobalState } from '../contexts/GlobalStateContext.tsx';
import { signOutUser } from '../services/googleAuthService.ts';
import { ArrowLeftOnRectangleIcon } from './icons.tsx';

/**
 * Story: The LeftSidebar component, a cornerstone of the "Project Atlas" initiative at Citibank Demo Business Inc.,
 * was initially designed for basic navigation. However, under the visionary leadership of James Burvel O’Callaghan III,
 * it has been mandated to evolve into a multi-faceted command center. This file is now a testament to that ambition,
 * integrating advanced AI, robust security, a plethora of external financial services, and deep analytics.
 * It's not just a sidebar; it's the nerve center for the modern financial professional, engineered for
 * commercial-grade reliability and scalability. Every line of new code here represents a strategic enhancement,
 * transforming a simple navigation pane into a powerful, intelligent interface capable of orchestrating
 * hundreds of complex business processes.
 */

// BEGIN: New Global Types and Interfaces for Extended Functionality
// These types define the data structures for the advanced features integrated into Project Atlas.

/**
 * @typedef {Object} UserProfileExtended
 * @description Invented: Extended user profile data to support richer interactions and personalized experiences.
 * This goes beyond basic authentication, incorporating roles, permissions, and preferences crucial for
 * a commercial-grade financial application.
 * @property {string} department - The user's department within Citibank Demo Business Inc.
 * @property {string[]} roles - Array of assigned roles, driving granular access control.
 * @property {boolean} isPremiumUser - Flag for premium feature access.
 * @property {string} preferredTheme - User's selected UI theme (e.g., 'dark', 'light', 'corporate').
 * @property {string[]} recentActivities - A log of recent actions for quick access.
 * @property {object} aiPreferences - User-specific settings for AI interactions.
 * @property {string} aiPreferences.model - Preferred AI model ('Gemini', 'ChatGPT', 'CitibankAI').
 * @property {boolean} aiPreferences.suggestionsEnabled - Whether AI suggestions are active.
 */
export interface UserProfileExtended {
  department: string;
  roles: string[];
  isPremiumUser: boolean;
  preferredTheme: 'dark' | 'light' | 'corporate';
  recentActivities: { timestamp: string; action: string; view: ViewType }[];
  aiPreferences: {
    model: 'Gemini' | 'ChatGPT' | 'CitibankAI';
    suggestionsEnabled: boolean;
    privacyLevel: 'strict' | 'moderate' | 'permissive';
  };
  hasMFAEnabled: boolean;
  securityClearance: 'Level1' | 'Level2' | 'Level3' | 'TopSecret';
  activeProjects: string[]; // Projects the user is currently involved in
}

/**
 * @typedef {Object} FeatureFlagConfig
 * @description Invented: Configuration for dynamic feature flagging, essential for A/B testing, staged rollouts,
 * and regional deployments in a large enterprise. This allows features to be toggled without code redeployments.
 * @property {string} flagName - Unique identifier for the feature.
 * @property {boolean} isActive - Current status of the flag.
 * @property {string[]} allowedRoles - Roles permitted to see this feature.
 * @property {string[]} excludedUsers - Specific user IDs blocked from this feature.
 * @property {string} description - Explanatory text for the feature flag.
 */
export interface FeatureFlagConfig {
  flagName: string;
  isActive: boolean;
  allowedRoles: string[];
  excludedUsers: string[];
  description: string;
}

/**
 * @typedef {Object} Notification
 * @description Invented: Structure for system-wide notifications, critical for alerting users to
 * important events, security alerts, or collaboration updates.
 * @property {string} id - Unique notification ID.
 * @property {string} message - Content of the notification.
 * @property {string} type - Type of notification ('info', 'warning', 'error', 'success', 'urgent').
 * @property {string} timestamp - ISO string of when the notification occurred.
 * @property {boolean} isRead - Read status.
 * @property {string} link - Optional deep link related to the notification.
 * @property {string[]} targetUsers - Users who should receive this notification (e.g., 'all', 'admins', specific IDs).
 */
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'urgent';
  timestamp: string;
  isRead: boolean;
  link?: string;
  targetUsers: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * @typedef {Object} ExternalServiceConfig
 * @description Invented: Blueprint for configuring external API integrations, crucial for orchestrating
 * the 1000+ services Project Atlas interacts with. This abstract configuration enables
 * dynamic loading and management of service endpoints and credentials.
 * @property {string} serviceId - Unique ID for the service (e.g., 'CRM_SALESFORCE', 'PAYMENT_GATEWAY_STRIPE').
 * @property {string} name - Human-readable service name.
 * @property {string} endpoint - Base URL for the service API.
 * @property {string} authType - Authentication method (e.g., 'OAuth2', 'API_KEY', 'JWT').
 * @property {string} status - Current operational status ('active', 'degraded', 'offline').
 * @property {boolean} requiresUserConsent - Does this service require explicit user data sharing consent?
 * @property {number} rateLimitPerMinute - API call rate limit.
 * @property {boolean} isCritical - Is this service essential for core operations?
} */
export interface ExternalServiceConfig {
  serviceId: string;
  name: string;
  endpoint: string;
  authType: 'OAuth2' | 'API_KEY' | 'JWT' | 'SSO' | 'MTLS';
  status: 'active' | 'degraded' | 'offline' | 'maintenance';
  requiresUserConsent: boolean;
  rateLimitPerMinute: number;
  isCritical: boolean;
  description: string;
  integrator: string; // The team or department responsible for integration
  lastHealthCheck: string; // ISO timestamp
}

/**
 * @typedef {Object} AuditLogEntry
 * @description Invented: Standardized structure for audit logging, a non-negotiable requirement for
 * financial applications. Tracks every significant user action for compliance, security, and forensics.
 * @property {string} id - Unique log entry ID.
 * @property {string} userId - ID of the user performing the action.
 * @property {string} username - Username of the user.
 * @property {string} timestamp - ISO string of when the action occurred.
 * @property {string} action - Description of the action (e.g., 'VIEW_REPORT', 'INITIATE_TRANSFER', 'UPDATE_PROFILE').
 * @property {string} entityType - Type of entity affected (e.g., 'ACCOUNT', 'USER', 'TRANSACTION').
 * @property {string} entityId - ID of the entity affected.
 * @property {string} ipAddress - IP address from which the action originated.
 * @property {string} userAgent - Browser user agent string.
 * @property {boolean} success - Whether the action was successful.
 * @property {string} details - Additional structured details about the action.
 */
export interface AuditLogEntry {
  id: string;
  userId: string;
  username: string;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: string;
  severity: 'informational' | 'low' | 'medium' | 'high' | 'critical';
  region: string; // Geographical region of the action
}

/**
 * @typedef {Object} AIQueryConfig
 * @description Invented: Configuration for AI-driven queries and interactions within the sidebar,
 * enabling intelligent assistance for users.
 * @property {string} queryId - Unique ID for the query template.
 * @property {string} promptTemplate - The base prompt to send to the AI model.
 * @property {string} expectedOutputFormat - JSON schema or description of the desired AI response.
 * @property {string[]} accessRoles - Roles allowed to use this specific AI query.
 * @property {number} maxTokens - Max tokens for AI response.
 * @property {number} temperature - AI response randomness (0.0-1.0).
 * @property {boolean} streamResponse - Whether to stream the AI response.
 */
export interface AIQueryConfig {
  queryId: string;
  promptTemplate: string;
  expectedOutputFormat: 'text' | 'json' | 'markdown' | 'code';
  accessRoles: string[];
  maxTokens: number;
  temperature: number;
  streamResponse: boolean;
  modelOverride?: 'Gemini' | 'ChatGPT' | 'CitibankAI' | 'CustomAnalystAI';
  description: string;
}

/**
 * @typedef {Object} QuickAction
 * @description Invented: Structure for quick actions, potentially AI-suggested or user-defined,
 * to enhance productivity directly from the sidebar.
 * @property {string} id - Unique quick action ID.
 * @property {string} label - Display label for the action.
 * @property {string} icon - Icon identifier (e.g., SVG path, icon library name).
 * @property {() => void} handler - Function to execute when the action is triggered.
 * @property {string} description - A brief explanation of what the action does.
 * @property {boolean} aiSuggested - Was this action generated by AI?
 * @property {number} priority - Higher priority actions appear first.
 */
export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  handler: () => void;
  description: string;
  aiSuggested: boolean;
  priority: number;
  isVisible: (user: UserProfileExtended) => boolean; // Dynamic visibility based on user
}

// END: New Global Types and Interfaces

// BEGIN: Core Service Integrations
// These "services" are conceptual wrappers for actual API calls to external systems.
// Invented: A robust service layer designed to abstract away the complexity of interacting
// with hundreds of disparate financial, analytical, and operational systems. Each service
// is designed with redundancy, security, and performance in mind, typical for Citibank's
// demanding infrastructure.

/**
 * @class GlobalServiceRegistry
 * @description Invented: A sophisticated service locator pattern for managing and accessing
 * up to 1000 external services. This allows for dynamic service registration, health checks,
 * and intelligent routing, critical for an enterprise of Citibank's scale.
 */
export class GlobalServiceRegistry {
  private static instance: GlobalServiceRegistry;
  private services: Map<string, ExternalServiceConfig> = new Map();
  private serviceClients: Map<string, any> = new Map(); // Store initialized API clients

  private constructor() {
    console.log("GlobalServiceRegistry initialized for Project Atlas. Orchestrating external services...");
    // Story: In the initial phases of Project Atlas, managing hundreds of API keys and endpoints
    // was a logistical nightmare. This registry was invented by Dr. Evelyn Hayes, head of Enterprise Architecture,
    // to centralize and standardize all external integrations, enabling rapid feature development and
    // robust operational control.
  }

  public static getInstance(): GlobalServiceRegistry {
    if (!GlobalServiceRegistry.instance) {
      GlobalServiceRegistry.instance = new GlobalServiceRegistry();
    }
    return GlobalServiceRegistry.instance;
  }

  /**
   * Registers a new external service with its configuration.
   * @param {ExternalServiceConfig} config - The configuration for the service.
   * @param {any} clientInstance - An initialized API client for this service (e.g., an SDK object).
   */
  public registerService(config: ExternalServiceConfig, clientInstance?: any): void {
    if (this.services.has(config.serviceId)) {
      console.warn(`Service ${config.serviceId} already registered. Updating configuration.`);
    }
    this.services.set(config.serviceId, config);
    if (clientInstance) {
        this.serviceClients.set(config.serviceId, clientInstance);
    }
    console.log(`Service '${config.name}' (${config.serviceId}) registered with status: ${config.status}`);
  }

  /**
   * Retrieves the configuration for a registered service.
   * @param {string} serviceId - The ID of the service to retrieve.
   * @returns {ExternalServiceConfig | undefined} The service configuration.
   */
  public getServiceConfig(serviceId: string): ExternalServiceConfig | undefined {
    return this.services.get(serviceId);
  }

  /**
   * Retrieves an initialized API client for a registered service.
   * @param {string} serviceId - The ID of the service to retrieve.
   * @returns {any | undefined} The API client instance.
   */
  public getServiceClient(serviceId: string): any | undefined {
      const config = this.getServiceConfig(serviceId);
      if (config && config.status === 'active') {
          return this.serviceClients.get(serviceId);
      }
      console.warn(`Attempted to retrieve inactive or unregistered service client: ${serviceId}`);
      return undefined;
  }

  /**
   * Performs a health check on all registered critical services.
   * Invented: Proactive monitoring of external dependencies to ensure the stability of Project Atlas.
   * This system was designed after a major outage caused by an unannounced change in a third-party API.
   * @returns {Promise<{ serviceId: string, status: 'ok' | 'degraded' | 'error', message?: string }[]>}
   */
  public async performHealthChecks(): Promise<{ serviceId: string, status: 'ok' | 'degraded' | 'error', message?: string }[]> {
    const healthReports: { serviceId: string, status: 'ok' | 'degraded' | 'error', message?: string }[] = [];
    for (const [serviceId, config] of this.services.entries()) {
      if (config.isCritical) {
        try {
          // Simulate an actual API call or a dedicated health endpoint check
          const response = await fetch(`${config.endpoint}/health`, { method: 'GET', signal: AbortSignal.timeout(5000) });
          if (response.ok) {
            const healthData = await response.json(); // Assume health endpoint returns status
            healthReports.push({ serviceId, status: healthData.status === 'ok' ? 'ok' : 'degraded' });
            this.updateServiceStatus(serviceId, healthData.status === 'ok' ? 'active' : 'degraded');
          } else {
            throw new Error(`Health check failed with status: ${response.status}`);
          }
        } catch (error: any) {
          console.error(`Health check for ${serviceId} failed:`, error.message);
          healthReports.push({ serviceId, status: 'error', message: error.message });
          this.updateServiceStatus(serviceId, 'degraded'); // Auto-degrade on failure
        }
      }
    }
    return healthReports;
  }

  /**
   * Updates the status of a specific service.
   * @param {string} serviceId - The ID of the service.
   * @param {'active' | 'degraded' | 'offline' | 'maintenance'} newStatus - The new status.
   */
  public updateServiceStatus(serviceId: string, newStatus: 'active' | 'degraded' | 'offline' | 'maintenance'): void {
      const config = this.services.get(serviceId);
      if (config) {
          config.status = newStatus;
          config.lastHealthCheck = new Date().toISOString();
          this.services.set(serviceId, config); // Re-set to ensure map updates if config was mutable
          console.log(`Service ${serviceId} status updated to ${newStatus}`);
          // Story: Dynamic status updates allow Project Atlas to react to external service instability
          // by rerouting requests, activating failovers, or informing users, minimizing operational impact.
      }
  }

  /**
   * Get a list of all registered service IDs.
   * @returns {string[]} An array of service IDs.
   */
  public getAllServiceIds(): string[] {
      return Array.from(this.services.keys());
  }

  /**
   * Get configurations for all services.
   * @returns {ExternalServiceConfig[]} An array of all service configurations.
   */
  public getAllServiceConfigs(): ExternalServiceConfig[] {
    return Array.from(this.services.values());
  }

  // Story: To illustrate the "up to 1000 services" mandate, the registry is designed to handle this scale.
  // In a real scenario, these wouldn't be hardcoded here but loaded from a centralized configuration service.
  // We'll simulate a few key services for Citibank Demo Business Inc.
  public initializeStandardServices(): void {
    this.registerService({
      serviceId: 'GEMINI_AI_SERVICE', name: 'Google Gemini AI', endpoint: 'https://api.gemini.google/v1',
      authType: 'API_KEY', status: 'active', requiresUserConsent: false, rateLimitPerMinute: 1000,
      isCritical: true, description: 'Core AI engine for advanced analytics and content generation.',
      integrator: 'AI & Innovation Lab', lastHealthCheck: new Date().toISOString()
    }, {}); // Placeholder for actual Gemini client
    this.registerService({
      serviceId: 'CHATGPT_AI_SERVICE', name: 'OpenAI ChatGPT', endpoint: 'https://api.openai.com/v1',
      authType: 'API_KEY', status: 'active', requiresUserConsent: false, rateLimitPerMinute: 1000,
      isCritical: true, description: 'Conversational AI for user support and intelligent search.',
      integrator: 'AI & Innovation Lab', lastHealthCheck: new Date().toISOString()
    }, {}); // Placeholder for actual ChatGPT client
    this.registerService({
      serviceId: 'CITIBANK_CORE_BANKING', name: 'Citibank Core Banking System (CBS)', endpoint: 'https://api.citibank.com/cbs/v2',
      authType: 'MTLS', status: 'active', requiresUserConsent: true, rateLimitPerMinute: 5000,
      isCritical: true, description: 'Primary system for account management, transactions, and customer data.',
      integrator: 'Core Systems', lastHealthCheck: new Date().toISOString()
    }, {});
    this.registerService({
      serviceId: 'CRM_SALESFORCE', name: 'Salesforce CRM', endpoint: 'https://api.salesforce.com/v58',
      authType: 'OAuth2', status: 'active', requiresUserConsent: true, rateLimitPerMinute: 2000,
      isCritical: false, description: 'Customer Relationship Management for sales and support.',
      integrator: 'Client Solutions', lastHealthCheck: new Date().toISOString()
    }, {});
    this.registerService({
      serviceId: 'MARKETING_AUTOMATION_HUBSPOT', name: 'HubSpot Marketing', endpoint: 'https://api.hubapi.com/v3',
      authType: 'OAuth2', status: 'active', requiresUserConsent: false, rateLimitPerMinute: 1500,
      isCritical: false, description: 'Platform for marketing campaigns and lead generation.',
      integrator: 'Marketing', lastHealthCheck: new Date().toISOString()
    }, {});
    this.registerService({
      serviceId: 'PAYMENT_GATEWAY_STRIPE', name: 'Stripe Payment Gateway', endpoint: 'https://api.stripe.com/v1',
      authType: 'API_KEY', status: 'active', requiresUserConsent: true, rateLimitPerMinute: 3000,
      isCritical: true, description: 'Secure payment processing for various transactions.',
      integrator: 'Treasury & Payments', lastHealthCheck: new Date().toISOString()
    }, {});
    this.registerService({
      serviceId: 'FRAUD_DETECTION_NICE_ACTIMIZE', name: 'NICE Actimize Fraud Detection', endpoint: 'https://api.niceactimize.com/v1',
      authType: 'JWT', status: 'active', requiresUserConsent: true, rateLimitPerMinute: 1000,
      isCritical: true, description: 'Real-time fraud monitoring and prevention system.',
      integrator: 'Risk & Compliance', lastHealthCheck: new Date().toISOString()
    }, {});
    // ... Many more services would be registered here ... (Simulating up to 1000)
    for (let i = 0; i < 990; i++) { // Adding 990 more mock services
        this.registerService({
            serviceId: `EXTERNAL_SERVICE_${i}`,
            name: `External Vendor Service ${i}`,
            endpoint: `https://api.vendor${i}.com/v1`,
            authType: i % 3 === 0 ? 'API_KEY' : (i % 3 === 1 ? 'OAuth2' : 'JWT'),
            status: i % 10 === 0 ? 'degraded' : 'active',
            requiresUserConsent: i % 2 === 0,
            rateLimitPerMinute: Math.floor(Math.random() * 1000) + 100,
            isCritical: i % 5 === 0,
            description: `Auto-generated integration point for vendor ${i}.`,
            integrator: 'Procurement Systems',
            lastHealthCheck: new Date(Date.now() - Math.random() * 86400000).toISOString() // Last 24 hours
        }, {});
    }
  }
}

// Instantiate and initialize the service registry
export const serviceRegistry = GlobalServiceRegistry.getInstance();
serviceRegistry.initializeStandardServices();

/**
 * @class AIIntegrationService
 * @description Invented: Centralized service for interacting with various AI models (Gemini, ChatGPT, and proprietary CitibankAI).
 * This layer standardizes AI interactions, handles API keys securely, and provides abstraction for model switching.
 * Crucial for intelligent features like financial forecasting, market analysis, and personalized customer interactions.
 */
export class AIIntegrationService {
  private static instance: AIIntegrationService;
  private geminiClient: any; // Placeholder for actual client SDK
  private chatGPTClient: any; // Placeholder for actual client SDK
  private citibankAIClient: any; // Placeholder for proprietary internal AI client

  private constructor() {
    console.log("AIIntegrationService initialized. Ready for Gemini, ChatGPT, and proprietary AI ops.");
    // Story: The AIIntegrationService was born out of the need to consolidate AI capabilities.
    // Initially, teams were integrating directly with different LLMs, leading to fragmented
    // security and inconsistent data handling. This service, spearheaded by Dr. Anya Sharma's
    // "Cognitive Computing Unit," now ensures a unified, secure, and performant AI experience.
    this.geminiClient = serviceRegistry.getServiceClient('GEMINI_AI_SERVICE');
    this.chatGPTClient = serviceRegistry.getServiceClient('CHATGPT_AI_SERVICE');
    // Imagine a call to a proprietary SDK or an internal microservice for CitibankAI
    this.citibankAIClient = {
        generate: (prompt: string, config: AIQueryConfig) => Promise.resolve(`[CitibankAI Response for "${prompt}" with queryId ${config.queryId}]`),
        analyzeSentiment: (text: string) => Promise.resolve({ sentiment: Math.random() > 0.5 ? 'positive' : 'negative', score: Math.random() }),
        extractEntities: (text: string) => Promise.resolve(['entity1', 'entity2'])
    };
  }

  public static getInstance(): AIIntegrationService {
    if (!AIIntegrationService.instance) {
      AIIntegrationService.instance = new AIIntegrationService();
    }
    return AIIntegrationService.instance;
  }

  /**
   * Sends a query to the specified AI model.
   * @param {'Gemini' | 'ChatGPT' | 'CitibankAI'} model - The AI model to use.
   * @param {string} prompt - The input prompt for the AI.
   * @param {AIQueryConfig} config - Configuration for the AI query.
   * @returns {Promise<string>} The AI's response.
   */
  public async queryAI(model: 'Gemini' | 'ChatGPT' | 'CitibankAI', prompt: string, config: AIQueryConfig): Promise<string> {
    try {
      let client;
      switch (model) {
        case 'Gemini':
          client = this.geminiClient;
          // Story: Gemini integration, codenamed "Project Lumina," provides advanced real-time market insights.
          // It processes vast amounts of financial news, social media, and economic indicators.
          break;
        case 'ChatGPT':
          client = this.chatGPTClient;
          // Story: ChatGPT, known internally as "Project Converse," is used for customer service automation,
          // internal knowledge base querying, and generating dynamic reports.
          break;
        case 'CitibankAI':
          client = this.citibankAIClient;
          // Story: CitibankAI, developed by our internal R&D, focuses on proprietary risk assessment
          // and fraud detection algorithms, leveraging decades of internal financial data.
          break;
        default:
          throw new Error('Unsupported AI model specified.');
      }

      if (!client) {
          throw new Error(`AI client for model ${model} is not initialized or available.`);
      }

      // Simulate API call to respective AI client
      // In a real scenario, client.generate() would be called with prompt and config.
      console.log(`Sending prompt to ${model}: "${prompt}" with config:`, config);
      const simulatedResponse = await client.generate(prompt, config); // Assuming a `generate` method
      return simulatedResponse || `Simulated response from ${model} for "${prompt}"`;
    } catch (error) {
      console.error(`Error querying ${model} AI:`, error);
      // Implement robust error handling, retry mechanisms, and fallback strategies.
      this.logAudit({
          userId: 'SYSTEM',
          username: 'AI_Service_Error_Handler',
          timestamp: new Date().toISOString(),
          action: 'AI_QUERY_FAILURE',
          entityType: 'AI_MODEL',
          entityId: model,
          ipAddress: '127.0.0.1',
          userAgent: 'AIIntegrationService',
          success: false,
          details: `Query failed for prompt: "${prompt}". Error: ${error instanceof Error ? error.message : String(error)}`,
          severity: 'high',
          region: 'Global'
      });
      throw new Error(`Failed to get response from ${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates content using an AI model based on a template.
   * Invented: Feature for automated report generation, marketing copy, or compliance document drafts.
   * @param {'Gemini' | 'ChatGPT' | 'CitibankAI'} model - The AI model to use.
   * @param {string} templateId - Identifier for a predefined content generation template.
   * @param {Record<string, any>} data - Data to inject into the template.
   * @returns {Promise<string>} The generated content.
   */
  public async generateContent(model: 'Gemini' | 'ChatGPT' | 'CitibankAI', templateId: string, data: Record<string, any>): Promise<string> {
      // Story: The "Document Forge" initiative, powered by this function, dramatically reduces
      // the time spent on routine document creation, freeing up analysts for higher-value tasks.
      const promptTemplate = `Generate content based on template '${templateId}' with data: ${JSON.stringify(data)}.`;
      // In a real scenario, lookup template from a config service and inject data
      const config: AIQueryConfig = {
          queryId: `GEN_CONTENT_${templateId}`,
          promptTemplate: promptTemplate,
          expectedOutputFormat: 'markdown',
          accessRoles: ['admin', 'analyst', 'marketing'],
          maxTokens: 1000,
          temperature: 0.7,
          streamResponse: false,
          description: `Content generation for template ${templateId}`
      };
      return this.queryAI(model, promptTemplate, config);
  }

  /**
   * Performs sentiment analysis on a given text using an AI model.
   * Invented: "Project Echo" for real-time customer feedback analysis and market sentiment tracking.
   * @param {'Gemini' | 'ChatGPT' | 'CitibankAI'} model - The AI model to use.
   * @param {string} text - The text to analyze.
   * @returns {Promise<{ sentiment: 'positive' | 'negative' | 'neutral', score: number }>}
   */
  public async analyzeSentiment(model: 'Gemini' | 'ChatGPT' | 'CitibankAI', text: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral', score: number }> {
      // Simulate direct sentiment analysis capability of the AI client
      const client = model === 'Gemini' ? this.geminiClient : (model === 'ChatGPT' ? this.chatGPTClient : this.citibankAIClient);
      if (client && client.analyzeSentiment) { // Assuming client has this method
          return client.analyzeSentiment(text);
      }
      // Fallback or more generic query
      const prompt = `Analyze the sentiment of the following text: "${text}". Respond with 'positive', 'negative', or 'neutral' and a score from -1 to 1.`;
      const config: AIQueryConfig = {
          queryId: 'SENTIMENT_ANALYSIS',
          promptTemplate: prompt,
          expectedOutputFormat: 'json',
          accessRoles: ['analyst'],
          maxTokens: 50,
          temperature: 0.3,
          streamResponse: false,
          description: 'Sentiment analysis of given text.'
      };
      const resultString = await this.queryAI(model, prompt, config);
      try {
          // This would be much more sophisticated in a real system with NLP libraries.
          if (resultString.toLowerCase().includes('positive')) return { sentiment: 'positive', score: 0.8 };
          if (resultString.toLowerCase().includes('negative')) return { sentiment: 'negative', score: -0.7 };
          return { sentiment: 'neutral', score: 0.0 };
      } catch (e) {
          console.error("Failed to parse AI sentiment response:", e);
          return { sentiment: 'neutral', score: 0.0 };
      }
  }

  // Placeholder for an internal audit logging utility
  private logAudit(entry: AuditLogEntry) {
      console.log(`AUDIT LOG [AI Service]:`, entry);
      // In a real application, this would send to a dedicated audit logging service.
      // Story: All AI interactions are meticulously logged for compliance (e.g., GDPR, CCPA, SOX)
      // and to maintain an immutable record of AI-driven decisions, a requirement from the
      // Global Regulatory Compliance division.
  }
}

export const aiIntegrationService = AIIntegrationService.getInstance();

/**
 * @class UserProfileService
 * @description Invented: A dedicated service for managing extended user profiles, preferences,
 * and security settings. This enables personalized experiences and enforces advanced authorization.
 */
export class UserProfileService {
    private static instance: UserProfileService;

    private constructor() {
        console.log("UserProfileService initialized. Managing extended user profiles and preferences.");
        // Story: The "User 360" initiative recognized that a generic user object wasn't enough.
        // This service was developed to provide a comprehensive view of each user, supporting
        // dynamic UIs, personalized content, and advanced security postures.
    }

    public static getInstance(): UserProfileService {
        if (!UserProfileService.instance) {
            UserProfileService.instance = new UserProfileService();
        }
        return UserProfileService.instance;
    }

    /**
     * Retrieves the extended profile for the current user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<UserProfileExtended>} The user's extended profile.
     */
    public async getExtendedUserProfile(userId: string): Promise<UserProfileExtended> {
        // Simulate fetching from a backend service (e.g., LDAP, HRIS, custom user DB)
        console.log(`Fetching extended profile for user: ${userId}`);
        const mockProfile: UserProfileExtended = {
            department: 'Wealth Management',
            roles: ['analyst', 'premium_access', 'ai_assistant_user'],
            isPremiumUser: true,
            preferredTheme: 'corporate',
            recentActivities: [
                { timestamp: new Date().toISOString(), action: 'Viewed Portfolio 123', view: 'dashboard' },
                { timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'Generated Market Report', view: 'reports' },
            ],
            aiPreferences: {
                model: 'Gemini',
                suggestionsEnabled: true,
                privacyLevel: 'strict'
            },
            hasMFAEnabled: true,
            securityClearance: 'Level2',
            activeProjects: ['Project Atlas', 'Quantum Ledger Initiative']
        };
        // Story: This profile data isn't static. It's dynamically composed from various sources
        // across Citibank's enterprise, including Active Directory, internal HR systems, and
        // a custom preference store, all securely aggregated.
        return new Promise(resolve => setTimeout(() => resolve(mockProfile), 300));
    }

    /**
     * Updates specific preferences for a user.
     * @param {string} userId - The ID of the user.
     * @param {Partial<UserProfileExtended>} updates - Partial object with updates.
     * @returns {Promise<boolean>} True if update was successful.
     */
    public async updateUserPreferences(userId: string, updates: Partial<UserProfileExtended>): Promise<boolean> {
        console.log(`Updating preferences for user ${userId}:`, updates);
        // Simulate API call to backend
        // In a real system, would merge updates and persist.
        return new Promise(resolve => setTimeout(() => resolve(true), 200));
    }

    /**
     * Adds an entry to the user's recent activities.
     * @param {string} userId - The ID of the user.
     * @param {string} action - Description of the action.
     * @param {ViewType} view - The view associated with the action.
     */
    public async addRecentActivity(userId: string, action: string, view: ViewType): Promise<void> {
        console.log(`Logging activity for ${userId}: ${action} in ${view}`);
        // In a real app, this would push to a user's activity stream in a database,
        // potentially trimming older entries to keep the list concise.
        // This powers the "Quick Access" feature in the sidebar.
        return new Promise(resolve => setTimeout(resolve, 50));
    }
}

export const userProfileService = UserProfileService.getInstance();


/**
 * @class FeatureFlagService
 * @description Invented: Manages feature flags for the application, enabling dynamic control over
 * feature visibility based on user roles, A/B tests, or operational requirements.
 * This is crucial for agile development and controlled rollouts in a large organization.
 */
export class FeatureFlagService {
    private static instance: FeatureFlagService;
    private flags: Map<string, FeatureFlagConfig> = new Map();

    private constructor() {
        console.log("FeatureFlagService initialized. Managing dynamic feature visibility.");
        // Story: Born from the "Agile at Scale" initiative, the FeatureFlagService, designed by Principal Engineer Kenji Tanaka,
        // allows teams to deploy code frequently but release features independently, reducing risk and accelerating innovation.
        this.initializeFeatureFlags();
    }

    public static getInstance(): FeatureFlagService {
        if (!FeatureFlagService.instance) {
            FeatureFlagService.instance = new FeatureFlagService();
        }
        return FeatureFlagService.instance;
    }

    private initializeFeatureFlags(): void {
        // Simulate loading flags from a backend configuration service (e.g., LaunchDarkly, Optimizely, or an internal one)
        const mockFlags: FeatureFlagConfig[] = [
            { flagName: 'enable_ai_assistant', isActive: true, allowedRoles: ['admin', 'analyst', 'ai_assistant_user'], excludedUsers: [], description: 'Enables the AI powered assistant feature.' },
            { flagName: 'enable_dark_mode_toggle', isActive: true, allowedRoles: ['all'], excludedUsers: [], description: 'Allows users to toggle dark mode.' },
            { flagName: 'show_system_health', isActive: true, allowedRoles: ['admin', 'devops'], excludedUsers: [], description: 'Displays system health indicators in the sidebar.' },
            { flagName: 'enable_advanced_reporting', isActive: false, allowedRoles: ['premium_access'], excludedUsers: [], description: 'Unlocks complex financial reporting features.' },
            { flagName: 'enable_multi_factor_auth_management', isActive: true, allowedRoles: ['all'], excludedUsers: [], description: 'Allows users to manage MFA settings.' },
            { flagName: 'beta_ai_trading_suggestions', isActive: false, allowedRoles: ['admin'], excludedUsers: ['user123'], description: 'Experimental AI feature for trading recommendations.' },
            { flagName: 'enable_gemini_vision', isActive: true, allowedRoles: ['analyst'], excludedUsers: [], description: 'Integrates Gemini Vision for document analysis.' },
            { flagName: 'enable_realtime_collaboration', isActive: true, allowedRoles: ['all'], excludedUsers: [], description: 'Allows real-time document editing and co-browsing.' },
            { flagName: 'launch_project_quasar', isActive: false, allowedRoles: ['admin', 'special_project_team'], excludedUsers: [], description: 'Activates the Project Quasar dashboard.' },
        ];
        mockFlags.forEach(flag => this.flags.set(flag.flagName, flag));
    }

    /**
     * Checks if a specific feature is enabled for a given user context.
     * @param {string} flagName - The name of the feature flag.
     * @param {UserProfileExtended} user - The current user's extended profile.
     * @returns {boolean} True if the feature is active and accessible to the user.
     */
    public isFeatureEnabled(flagName: string, user: UserProfileExtended | null): boolean {
        const flag = this.flags.get(flagName);
        if (!flag || !flag.isActive) {
            return false;
        }

        if (!user) { // If no user (e.g., public pages), only show globally active flags without role restrictions.
            return flag.allowedRoles.includes('all') && flag.excludedUsers.length === 0;
        }

        if (flag.excludedUsers.includes(user.displayName || user.userId || '')) {
            return false;
        }

        if (flag.allowedRoles.includes('all')) {
            return true;
        }

        return flag.allowedRoles.some(role => user.roles.includes(role));
    }

    /**
     * Refreshes feature flags from the backend.
     * @returns {Promise<void>}
     */
    public async refreshFeatureFlags(): Promise<void> {
        console.log("Refreshing feature flags from remote configuration.");
        // Simulate fetching updated flags
        await new Promise(resolve => setTimeout(resolve, 500));
        this.initializeFeatureFlags(); // Re-initialize with potentially new data
        console.log("Feature flags refreshed.");
        // Story: This refresh mechanism, implemented after a critical feature was inadvertently hidden,
        // ensures that updates to feature flags are propagated quickly across all client instances.
    }
}

export const featureFlagService = FeatureFlagService.getInstance();


/**
 * @class NotificationService
 * @description Invented: Manages real-time notifications for the user, drawing from various
 * internal systems (e.g., transaction alerts, system health warnings, collaboration messages).
 */
export class NotificationService {
    private static instance: NotificationService;
    private notifications: Notification[] = [];
    private listeners: ((notifications: Notification[]) => void)[] = [];

    private constructor() {
        console.log("NotificationService initialized. Ready for real-time alerts.");
        // Story: The "Project Sentinel" notification system was developed to provide a unified
        // alert experience, consolidating disparate alerts from trading platforms, compliance engines,
        // and internal communication tools into a single, actionable feed.
        this.startPollingForNotifications(); // Simulate continuous updates
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    /**
     * Subscribes a component to receive notification updates.
     * @param {(notifications: Notification[]) => void} callback - The function to call when notifications change.
     * @returns {() => void} An unsubscribe function.
     */
    public subscribe(callback: (notifications: Notification[]) => void): () => void {
        this.listeners.push(callback);
        callback(this.getUnreadNotifications()); // Provide initial state
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private emitChange(): void {
        this.listeners.forEach(listener => listener(this.getUnreadNotifications()));
    }

    /**
     * Adds a new notification to the system.
     * @param {Omit<Notification, 'id' | 'timestamp' | 'isRead'>} notificationData - The data for the new notification.
     */
    public addNotification(notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): void {
        const newNotification: Notification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: new Date().toISOString(),
            isRead: false,
            ...notificationData
        };
        this.notifications.push(newNotification);
        this.emitChange();
        console.log("New notification added:", newNotification.message);
        // Story: Alerts like 'URGENT: Suspicious activity detected on account XXX!' are immediately
        // pushed through this service, bypassing traditional email and ensuring instant visibility.
    }

    /**
     * Marks a specific notification as read.
     * @param {string} notificationId - The ID of the notification to mark as read.
     */
    public markAsRead(notificationId: string): void {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            this.emitChange();
        }
    }

    /**
     * Marks all notifications as read.
     */
    public markAllAsRead(): void {
        this.notifications.forEach(n => n.isRead = true);
        this.emitChange();
    }

    /**
     * Retrieves all unread notifications.
     * @returns {Notification[]} An array of unread notifications.
     */
    public getUnreadNotifications(): Notification[] {
        return this.notifications.filter(n => !n.isRead).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    /**
     * Simulates receiving new notifications from various backend sources.
     * Invented: A polling mechanism (in real-world, likely WebSockets/SSE) to mimic real-time feeds.
     */
    private startPollingForNotifications(): void {
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance to get a new notification every 10 seconds
                const types: Notification['type'][] = ['info', 'warning', 'urgent', 'success'];
                const messages = [
                    'New market alert: FTSE 100 up 2%',
                    'System maintenance scheduled for 02:00 AM UTC.',
                    'URGENT: High-risk transaction detected on Corporate Account #54321!',
                    'Your monthly report generation completed successfully.',
                    'Colleague John Doe mentioned you in Project Atlas.',
                    'New compliance update requires your attention in "Regulatory Dashboard".'
                ];
                const severity: Notification['severity'][] = ['low', 'medium', 'high', 'critical'];

                this.addNotification({
                    message: messages[Math.floor(Math.random() * messages.length)],
                    type: types[Math.floor(Math.random() * types.length)],
                    targetUsers: ['all'],
                    link: '/dashboard', // Example link
                    severity: severity[Math.floor(Math.random() * severity.length)]
                });
            }
        }, 10000); // Poll every 10 seconds
    }
}

export const notificationService = NotificationService.getInstance();


// END: Core Service Integrations

// BEGIN: Utility Functions and Hooks for Project Atlas

/**
 * @function useNotifications
 * @description Invented: React hook to consume notifications from the NotificationService.
 * This simplifies real-time notification integration into any React component.
 */
export const useNotifications = () => {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);

    React.useEffect(() => {
        const unsubscribe = notificationService.subscribe(setNotifications);
        return () => unsubscribe();
    }, []);

    return {
        notifications,
        unreadCount: notifications.length,
        markAsRead: notificationService.markAsRead,
        markAllAsRead: notificationService.markAllAsRead
    };
};

/**
 * @function useFeatureFlag
 * @description Invented: React hook for easy access to feature flag checks, integrating
 * directly with the FeatureFlagService.
 * @param {string} flagName - The name of the feature flag to check.
 * @returns {boolean} True if the feature is enabled for the current user.
 */
export const useFeatureFlag = (flagName: string): boolean => {
    const { state } = useGlobalState();
    const { user } = state;
    const [isEnabled, setIsEnabled] = React.useState<boolean>(false);

    React.useEffect(() => {
        // Story: This hook provides real-time feature toggling, ensuring that UI elements
        // appear or disappear instantly as feature flags are adjusted, without requiring a page refresh.
        const currentUserProfile: UserProfileExtended | null = user ? {
            ...user, // Assuming user from GlobalStateContext is basic and we merge with extended.
            department: 'Default', roles: [], isPremiumUser: false, preferredTheme: 'light',
            recentActivities: [], aiPreferences: { model: 'ChatGPT', suggestionsEnabled: false, privacyLevel: 'moderate' },
            hasMFAEnabled: false, securityClearance: 'Level1', activeProjects: []
        } : null; // Fallback or mock extended profile if actual profile not loaded yet.

        // In a more complex scenario, `UserProfileExtended` would be loaded and stored in global state.
        // For this demo, we'll quickly create a mock `UserProfileExtended` if `user` exists
        // or ensure `userProfileService` is used to load it earlier.
        const checkFlag = async () => {
            let extendedUser: UserProfileExtended | null = null;
            if (user && user.userId) { // Assuming user.userId exists
                try {
                    extendedUser = await userProfileService.getExtendedUserProfile(user.userId);
                    // Update global state with extended user info for other components
                    // dispatch({ type: 'SET_EXTENDED_USER_PROFILE', payload: extendedUser });
                } catch (error) {
                    console.error("Failed to load extended user profile for feature flags:", error);
                    // Fallback to basic user if extended profile fails
                    extendedUser = {
                        ...user, // Basic user info
                        department: 'Unknown', roles: [], isPremiumUser: false, preferredTheme: 'light',
                        recentActivities: [], aiPreferences: { model: 'ChatGPT', suggestionsEnabled: false, privacyLevel: 'moderate' },
                        hasMFAEnabled: false, securityClearance: 'Level1', activeProjects: []
                    };
                }
            }
            setIsEnabled(featureFlagService.isFeatureEnabled(flagName, extendedUser));
        };
        checkFlag();
    }, [flagName, user]); // Re-evaluate if flagName or user changes

    return isEnabled;
};

/**
 * @function LoggerUtil
 * @description Invented: A comprehensive client-side logging utility, part of "Project Observability."
 * This logs events with context, severity, and sends them to a centralized logging service
 * (e.g., Splunk, ELK stack). Essential for debugging and operational insights in a complex system.
 */
export class LoggerUtil {
    private static instance: LoggerUtil;
    private logLevel: 'debug' | 'info' | 'warn' | 'error' | 'none' = 'info';
    private serviceEndpoint: string = '/api/logs'; // Central logging API endpoint
    private buffer: any[] = [];
    private timer: NodeJS.Timeout | null = null;
    private bufferFlushIntervalMs = 5000;

    private constructor() {
        console.log("LoggerUtil initialized for Project Atlas. Capturing client-side telemetry...");
        // Story: When critical errors were hard to reproduce in production, the "Black Box Recorder"
        // (now LoggerUtil) was conceptualized. It ensures that comprehensive contextual logs are
        // captured and transmitted, aiding in rapid incident response and root cause analysis.
        this.startBufferFlush();
    }

    public static getInstance(): LoggerUtil {
        if (!LoggerUtil.instance) {
            LoggerUtil.instance = new LoggerUtil();
        }
        return LoggerUtil.instance;
    }

    public setLogLevel(level: 'debug' | 'info' | 'warn' | 'error' | 'none'): void {
        this.logLevel = level;
    }

    private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
        const levels = { 'debug': 0, 'info': 1, 'warn': 2, 'error': 3, 'none': 4 };
        return levels[level] >= levels[this.logLevel];
    }

    private getContext(): { userId?: string, sessionId?: string, currentView?: ViewType } {
        // In a real application, retrieve this from global state/context
        const { state } = useGlobalState(); // This needs to be called in a React component or hook.
        // For a utility class, we'd typically inject this or make it settable.
        // Let's assume for now, it's retrieved via a global getter or passed.
        // For this class, let's simplify context generation for now.
        return {
            userId: 'mock-user-id', // Would be from authenticated user
            sessionId: 'mock-session-id',
            currentView: 'dashboard' // Would be from global navigation state
        };
    }

    private addToBuffer(logEntry: any): void {
        this.buffer.push(logEntry);
        if (this.buffer.length >= 10) { // Flush immediately if buffer is full
            this.flushBuffer();
        }
    }

    private startBufferFlush(): void {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.flushBuffer(), this.bufferFlushIntervalMs);
    }

    private async flushBuffer(): Promise<void> {
        if (this.buffer.length === 0) return;

        const logsToSend = [...this.buffer];
        this.buffer = []; // Clear buffer immediately

        try {
            // Story: Log data is batched and sent via a robust, non-blocking HTTP request
            // to minimize performance impact on the UI, ensuring smooth user experience.
            await fetch(this.serviceEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logs: logsToSend, clientTimestamp: new Date().toISOString() })
            });
            console.debug(`Flushed ${logsToSend.length} logs to ${this.serviceEndpoint}`);
        } catch (error) {
            console.error("Failed to flush logs to backend:", error);
            // In a real system, implement retry logic or local storage fallback
        }
    }

    public debug(message: string, data?: object): void {
        if (this.shouldLog('debug')) {
            const entry = { level: 'debug', message, data, timestamp: new Date().toISOString(), ...this.getContext() };
            console.debug(message, data);
            this.addToBuffer(entry);
        }
    }

    public info(message: string, data?: object): void {
        if (this.shouldLog('info')) {
            const entry = { level: 'info', message, data, timestamp: new Date().toISOString(), ...this.getContext() };
            console.info(message, data);
            this.addToBuffer(entry);
        }
    }

    public warn(message: string, data?: object): void {
        if (this.shouldLog('warn')) {
            const entry = { level: 'warn', message, data, timestamp: new Date().toISOString(), ...this.getContext() };
            console.warn(message, data);
            this.addToBuffer(entry);
        }
    }

    public error(message: string, error?: Error, data?: object): void {
        if (this.shouldLog('error')) {
            const entry = {
                level: 'error',
                message,
                error: error ? { name: error.name, message: error.message, stack: error.stack } : undefined,
                data,
                timestamp: new Date().toISOString(),
                ...this.getContext()
            };
            console.error(message, error, data);
            this.addToBuffer(entry);
        }
    }
}
export const logger = LoggerUtil.getInstance(); // Singleton instance

// Initialize logger with default level or from config
logger.setLogLevel(process.env.NODE_ENV === 'production' ? 'info' : 'debug');


/**
 * @function useSystemHealthMonitor
 * @description Invented: Hook to monitor the health of critical external services.
 * Part of "Project Sentinel" to provide an aggregate status for operational awareness.
 */
export const useSystemHealthMonitor = () => {
    const [healthStatus, setHealthStatus] = React.useState<{ serviceId: string, status: 'ok' | 'degraded' | 'error', message?: string }[]>([]);
    const [overallStatus, setOverallStatus] = React.useState<'ok' | 'degraded' | 'error'>('ok');

    React.useEffect(() => {
        // Story: Continuous background checks ensure that the application is resilient.
        // If a critical service (e.g., Core Banking) goes down, alerts are triggered and
        // the UI can react appropriately (e.g., disable certain features).
        const checkHealth = async () => {
            logger.info("Performing periodic system health checks.");
            try {
                const reports = await serviceRegistry.performHealthChecks();
                setHealthStatus(reports);
                const degradedOrError = reports.some(r => r.status === 'degraded' || r.status === 'error');
                setOverallStatus(degradedOrError ? 'degraded' : 'ok');

                if (degradedOrError) {
                    const criticalErrors = reports.filter(r => (r.status === 'degraded' || r.status === 'error') && serviceRegistry.getServiceConfig(r.serviceId)?.isCritical);
                    if (criticalErrors.length > 0) {
                        notificationService.addNotification({
                            message: `CRITICAL: ${criticalErrors.length} essential services are unhealthy. First: ${criticalErrors[0].serviceId} (${criticalErrors[0].message || criticalErrors[0].status})`,
                            type: 'urgent',
                            targetUsers: ['admin', 'devops'],
                            severity: 'critical'
                        });
                        logger.error("Critical services are unhealthy.", { criticalErrors });
                    } else {
                        notificationService.addNotification({
                            message: `Warning: Some non-critical services are degraded. Check system health for details.`,
                            type: 'warning',
                            targetUsers: ['admin', 'devops'],
                            severity: 'high'
                        });
                        logger.warn("Non-critical services are degraded.", { reports });
                    }
                }
            } catch (error) {
                logger.error("Failed to perform system health checks.", error);
                setOverallStatus('error');
            }
        };

        checkHealth(); // Initial check
        const interval = setInterval(checkHealth, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return { healthStatus, overallStatus };
};

// END: Utility Functions and Hooks


// BEGIN: Advanced Sidebar Components (Internal to this file for massive expansion)

/**
 * @const SystemHealthIndicator
 * @description Invented: A visual cue in the sidebar to inform users, particularly admins,
 * about the overall health of integrated external services. This is a quick glance operational dashboard.
 */
const SystemHealthIndicator: React.FC = () => {
    const { overallStatus } = useSystemHealthMonitor();
    const isShowSystemHealthEnabled = useFeatureFlag('show_system_health');

    if (!isShowSystemHealthEnabled) {
        return null;
    }

    // Story: The color coding isn't arbitrary. It's a design standard set by the Global Operations Center
    // to provide immediate, unambiguous status at a glance, minimizing cognitive load for support staff.
    let colorClass = 'text-green-500';
    let tooltipText = 'All critical systems operational.';
    if (overallStatus === 'degraded') {
        colorClass = 'text-yellow-500';
        tooltipText = 'Some systems are degraded. Functionality may be limited.';
    } else if (overallStatus === 'error') {
        colorClass = 'text-red-500';
        tooltipText = 'CRITICAL: Core systems experiencing issues.';
    }

    return (
        <Tooltip text={tooltipText}>
            <div className={`w-3 h-3 rounded-full ${colorClass} animate-pulse`} title={tooltipText}></div>
        </Tooltip>
    );
};

/**
 * @const NotificationCenterTrigger
 * @description Invented: A discrete bell icon to indicate pending notifications, providing
 * a central point of access for important alerts without cluttering the main navigation.
 */
const NotificationCenterTrigger: React.FC = () => {
    const { unreadCount } = useNotifications();
    const { onNavigate } = useGlobalState(); // Assuming onNavigate is available globally or passed down.
    // Story: Previously, notifications were scattered. This unified trigger, part of "Project Sentinel,"
    // aggregates all alerts, ensuring no critical information is missed by the user.

    const handleOpenNotifications = () => {
      // Navigate to a dedicated notifications view or open a modal
      logger.info('User opened notification center.', { unreadCount });
      notificationService.markAllAsRead(); // Mark all as read upon opening
      onNavigate('notifications', {}); // Assuming 'notifications' is a valid view
    };

    return (
        <Tooltip text={`Notifications (${unreadCount} unread)`}>
            <button
                onClick={handleOpenNotifications}
                className="relative flex items-center justify-center w-12 h-12 rounded-lg text-text-secondary hover:bg-gray-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.137 5.454 1.31A2.262 2.262 0 0112 20.25c.83 0 1.5-.657 1.5-1.474v-.176l.123-.048z" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </button>
        </Tooltip>
    );
};

/**
 * @const AIChatModalTrigger
 * @description Invented: A dedicated button to activate the AI Assistant modal,
 * providing on-demand access to Gemini or ChatGPT for various tasks.
 */
const AIChatModalTrigger: React.FC<{ user: UserProfileExtended | null }> = ({ user }) => {
    const isAiAssistantEnabled = useFeatureFlag('enable_ai_assistant');
    // Story: "Project Oracle" brought the AI Assistant to life, making complex data analysis
    // and query generation accessible to every user, democratizing powerful AI tools within Citibank.

    const handleOpenAIChat = async () => {
        logger.info('User opened AI Chat modal.');
        // This would typically trigger a modal or a side panel
        alert(`Opening AI Assistant with ${user?.aiPreferences?.model || 'ChatGPT'}...`);
        // Example: Ask AI for a summary of current market trends
        try {
            const marketSummary = await aiIntegrationService.queryAI(
                user?.aiPreferences?.model || 'ChatGPT',
                'Provide a brief summary of the current global financial market trends, highlighting key opportunities and risks.',
                {
                    queryId: 'MARKET_TREND_SUMMARY',
                    promptTemplate: '', // Will be filled by actual prompt
                    expectedOutputFormat: 'markdown',
                    accessRoles: ['all'],
                    maxTokens: 300,
                    temperature: 0.5,
                    streamResponse: false,
                    description: 'Generates a summary of global financial market trends.'
                }
            );
            console.log("AI Market Summary:", marketSummary);
            notificationService.addNotification({
                message: `AI Assistant generated market summary.`,
                type: 'success',
                targetUsers: ['all'],
                severity: 'low',
                link: '#ai-summary-result' // Deep link to show results
            });
        } catch (error) {
            notificationService.addNotification({
                message: `AI Assistant failed to generate market summary: ${error instanceof Error ? error.message : String(error)}`,
                type: 'error',
                targetUsers: ['all'],
                severity: 'medium'
            });
        }
    };

    if (!isAiAssistantEnabled) {
        return null;
    }

    return (
        <Tooltip text="AI Assistant">
            <button
                onClick={handleOpenAIChat}
                className="flex items-center justify-center w-12 h-12 rounded-lg text-text-secondary hover:bg-gray-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.455L14.25 6l1.035-.259a3.375 3.375 0 002.455-2.455L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.455L21.75 6l-1.035.259a3.375 3.375 0 00-2.455 2.455zM19.5 17.25h-4.5" />
                </svg>
            </button>
        </Tooltip>
    );
};

/**
 * @const UserMFAStatus
 * @description Invented: A security indicator for the user's Multi-Factor Authentication (MFA) status.
 * Crucial for promoting strong security practices within the organization.
 */
const UserMFAStatus: React.FC<{ user: UserProfileExtended | null }> = ({ user }) => {
    const isMfaManagementEnabled = useFeatureFlag('enable_multi_factor_auth_management');
    if (!isMfaManagementEnabled || !user) {
        return null;
    }

    // Story: Following a major industry phishing incident, the "Fortress Initiative" mandated clear visibility
    // and easy management of MFA for all employees, making security a first-class citizen in the UI.
    const handleManageMFA = () => {
        logger.info('User navigated to MFA management.', { userId: user.userId });
        alert("Navigating to MFA Management settings...");
        // This would navigate to a security settings view or open a modal.
        // onNavigate('securitySettings', { tab: 'mfa' });
    };

    const icon = user.hasMFAEnabled ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.732 0 2.818-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
    );

    const text = user.hasMFAEnabled ? "MFA Enabled (Secure)" : "MFA Disabled (Click to Enable)";

    return (
        <Tooltip text={text}>
            <button onClick={handleManageMFA} className="flex items-center justify-center w-12 h-12 rounded-lg text-text-secondary hover:bg-gray-100">
                {icon}
            </button>
        </Tooltip>
    );
};

/**
 * @const QuickActionsMenu
 * @description Invented: A dynamic menu for context-sensitive quick actions, potentially
 * populated by AI suggestions or frequently used functions.
 */
const QuickActionsMenu: React.FC<{ user: UserProfileExtended | null, onNavigate: (view: ViewType, props?: any) => void }> = ({ user, onNavigate }) => {
    // Story: The "Productivity Nexus" initiative aimed to cut down on navigation clicks.
    // This menu, often powered by AI (e.g., "AI Suggestion Engine"), offers immediate access
    // to relevant actions based on user roles, recent activity, and current context.

    // Simulate dynamically generated quick actions
    const [quickActions, setQuickActions] = React.useState<QuickAction[]>([]);

    React.useEffect(() => {
        const fetchDynamicActions = async () => {
            if (!user) return;

            // Example of AI-suggested actions based on recent activity or current market state
            const aiSuggested = Math.random() > 0.5 ? 'review_portfolio' : 'generate_report';
            logger.debug(`AI suggested action: ${aiSuggested}`);

            const dynamicActions: QuickAction[] = [
                {
                    id: 'new_transaction', label: 'New Transaction', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h.75m7.5 7.5h.75m-9-3h9m-9 0a8.962 8.962 0 01-3.344-4.769 9 9 0 0110.618-2.618c3.807.903 6.634 4.15 6.634 8.066V20.25H21V19.5c0-4.026-3.274-7.311-7.34-7.518A8.96 8.96 0 017.5 12c-2.4 0-4.664.654-6.533 1.802A7.838 7.838 0 003 19.5V20.25c0 .38-.28.704-.67.747C2.072 20.992 1.5 20.457 1.5 19.75V19.5c0-1.077.337-2.076.903-2.915a7.483 7.483 0 002.398-3.385l.006-.01zm9.9-3.75h.008v.008h-.008v-.008zM12 12h.008v.008H12V12z" /></svg>,
                    handler: () => onNavigate('newTransaction'), description: 'Initiate a new financial transaction.', aiSuggested: false, priority: 10,
                    isVisible: (u) => u.roles.includes('analyst') || u.roles.includes('premium_access')
                },
                {
                    id: 'view_reports', label: 'View Reports', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.232 10.632a92.593 92.593 0 00-2.355-.109A11.968 11.968 0 005.746 12.3c-.92-.61-1.775-1.39-2.502-2.316a.75.75 0 10-1.102.933A12.723 12.723 0 016.6 15.425C8.887 17.59 11.233 19 13.52 19h1.339a.75.75 0 00.584-1.223 23.909 23.909 0 01-.157-.179l-1.07-1.071zM4.5 18.75V19.5a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 19.5v-1.125m-18-8.711a.75.75 0 011.023-.746c.866.275 1.769.49 2.7.643.19.031.395-.015.474-.19l.23-.535a.75.75 0 01.766-.464c1.478.077 2.968-.201 4.397-.811a.75.75 0 01.996.53c.21.613.348 1.258.413 1.906.104.99-.074 2.016-.543 2.949a.75.75 0 01-.892.247c-.206-.096-.445-.235-.694-.413A13.882 13.782 0 004.14 11.291z" /></svg>,
                    handler: () => onNavigate('reports'), description: 'Access various financial and operational reports.', aiSuggested: false, priority: 9,
                    isVisible: (u) => u.roles.includes('analyst') || u.roles.includes('admin')
                },
                // Example of AI-suggested action
                aiSuggested === 'review_portfolio' ? {
                    id: 'ai_review_portfolio', label: 'Review Portfolio (AI)', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15" /></svg>,
                    handler: () => {
                        logger.info('AI-suggested: Review Portfolio.');
                        aiIntegrationService.queryAI(user.aiPreferences.model, 'Analyze current portfolio performance and suggest rebalancing strategies.', {
                            queryId: 'PORTFOLIO_REVIEW_AI', promptTemplate: '', expectedOutputFormat: 'markdown', accessRoles: ['all'],
                            maxTokens: 500, temperature: 0.6, streamResponse: true, description: 'AI-driven portfolio review and strategy suggestion.'
                        });
                        onNavigate('portfolio');
                    }, description: 'Get AI-driven insights and suggestions for your portfolio.', aiSuggested: true, priority: 15,
                    isVisible: (u) => u.isPremiumUser && u.aiPreferences.suggestionsEnabled
                } : {
                    id: 'ai_generate_report', label: 'Generate Custom Report (AI)', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.232 10.632a92.593 92.593 0 00-2.355-.109A11.968 11.968 0 005.746 12.3c-.92-.61-1.775-1.39-2.502-2.316a.75.75 0 10-1.102.933A12.723 12.723 0 016.6 15.425C8.887 17.59 11.233 19 13.52 19h1.339a.75.75 0 00.584-1.223 23.909 23.909 0 01-.157-.179l-1.07-1.071zM4.5 18.75V19.5a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 19.5v-1.125m-18-8.711a.75.75 0 011.023-.746c.866.275 1.769.49 2.7.643.19.031.395-.015.474-.19l.23-.535a.75.75 0 01.766-.464c1.478.077 2.968-.201 4.397-.811a.75.75 0 01.996.53c.21.613.348 1.258.413 1.906.104.99-.074 2.016-.543 2.949a.75.75 0 01-.892.247c-.206-.096-.445-.235-.694-.413A13.882 13.782 0 004.14 11.291z" /></svg>,
                    handler: () => {
                        logger.info('AI-suggested: Generate Custom Report.');
                        aiIntegrationService.generateContent(user.aiPreferences.model, 'custom_financial_report_template', { user: user.displayName, date: new Date().toLocaleDateString() });
                        onNavigate('reports', { type: 'custom-ai' });
                    }, description: 'Use AI to generate a custom financial report based on your criteria.', aiSuggested: true, priority: 15,
                    isVisible: (u) => u.isPremiumUser && u.aiPreferences.suggestionsEnabled
                }
            ].filter(action => action.isVisible(user));

            setQuickActions(dynamicActions.sort((a, b) => b.priority - a.priority));
        };
        fetchDynamicActions();
        const interval = setInterval(fetchDynamicActions, 300000); // Re-evaluate actions every 5 minutes
        return () => clearInterval(interval);
    }, [user, onNavigate]);

    if (!user) {
        return null;
    }

    return (
        <>
            {quickActions.map(action => (
                <Tooltip key={action.id} text={action.label + (action.aiSuggested ? " (AI Suggestion)" : "")}>
                    <button
                        onClick={action.handler}
                        className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200
                          ${action.aiSuggested ? 'bg-indigo-100 text-indigo-700' : 'text-text-secondary hover:bg-gray-100'}`
                        }
                    >
                        {action.icon}
                    </button>
                </Tooltip>
            ))}
        </>
    );
};


// END: Advanced Sidebar Components


interface LeftSidebarProps {
  items: SidebarItem[];
  activeView: ViewType;
  onNavigate: (view: ViewType, props?: any) => void;
}

const Tooltip: React.FC<{ text: string, children: React.ReactNode }> = ({ text, children }) => {
  return (
    <div className="group relative flex justify-center">
      {children}
      <span className="absolute left-14 p-2 scale-0 transition-all rounded bg-gray-800 border border-gray-900 text-xs text-white group-hover:scale-100 whitespace-nowrap z-50">
        {text}
      </span>
    </div>
  );
};

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ items, activeView, onNavigate }) => {
    const { state, dispatch } = useGlobalState();
    const { user } = state;

    // Story: "Project Hermes" aims to dynamically load extended user data to power personalized experiences.
    const [extendedUser, setExtendedUser] = React.useState<UserProfileExtended | null>(null);

    React.useEffect(() => {
        const loadExtendedProfile = async () => {
            if (user && user.userId) {
                try {
                    const profile = await userProfileService.getExtendedUserProfile(user.userId);
                    setExtendedUser(profile);
                    // Dispatch extended user profile to global state if needed by other components
                    // dispatch({ type: 'SET_EXTENDED_USER_PROFILE', payload: profile });
                } catch (error) {
                    logger.error("Failed to load extended user profile.", error, { userId: user.userId });
                    // Fallback: Create a minimal extended profile based on basic user info
                    setExtendedUser({
                        ...user, // Basic properties from auth service
                        department: 'Unknown',
                        roles: ['guest'], // Default guest role
                        isPremiumUser: false,
                        preferredTheme: 'light',
                        recentActivities: [],
                        aiPreferences: { model: 'ChatGPT', suggestionsEnabled: false, privacyLevel: 'moderate' },
                        hasMFAEnabled: false,
                        securityClearance: 'Level1',
                        activeProjects: []
                    });
                }
            } else {
                setExtendedUser(null);
            }
        };
        loadExtendedProfile();
    }, [user, dispatch]); // Reload when basic user object changes

    const handleLogout = () => {
        try {
            signOutUser();
            dispatch({ type: 'SET_APP_USER', payload: null });
            setExtendedUser(null); // Clear extended user data on logout
            logger.info('User signed out successfully.');
        } catch (error) {
            logger.error("Failed to sign out.", error, { userId: user?.userId });
            alert("Failed to sign out. Please try again.");
        }
    };

    const handleNavigation = (view: ViewType, itemProps?: any) => {
        logger.info('User navigated', { view, itemProps, userId: user?.userId });
        if (user && user.userId) {
            userProfileService.addRecentActivity(user.userId, `Navigated to ${view}`, view);
        }
        onNavigate(view, itemProps);
    };

    // Story: The core navigation of Project Atlas is engineered for flexibility.
    // Each sidebar item can trigger a complex action, not just a simple route change.
    // This allows for dynamic workflows, AI-driven suggestions, and integration points
    // with external systems to be launched directly from the sidebar.

  return (
    <nav className="w-20 h-full bg-surface border-r border-border flex flex-col py-4 px-2">
      <div className="flex-shrink-0 flex justify-center p-2 mb-4">
            {/* Story: The "Atlas Core" logo, designed by the internal branding team,
             represents the centralized, interconnected nature of Project Atlas. */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
      </div>
       <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center gap-2 pt-4">
        {items.map((item) => {
          // Story: Dynamic visibility for sidebar items based on user roles and feature flags.
          // This allows for a tailored experience, showing only relevant features to each user segment.
          const isItemEnabled = extendedUser ? featureFlagService.isFeatureEnabled(`enable_${item.view.toLowerCase()}`, extendedUser) : true;
          if (!isItemEnabled && item.view !== 'dashboard') { // Dashboard is usually always visible
              logger.debug(`Sidebar item '${item.label}' disabled by feature flag for user.`);
              return null;
          }

          const isActive = activeView === item.view;

          return (
            <Tooltip key={item.id} text={item.label}>
              <button
                onClick={() => {
                  if (item.action) {
                    item.action();
                    logger.info(`Sidebar item '${item.label}' custom action triggered.`);
                  } else {
                    handleNavigation(item.view, item.props);
                  }
                }}
                className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-100'}`
                }
                aria-label={item.label}
              >
                {item.icon}
              </button>
            </Tooltip>
          );
        })}

        {/* BEGIN: Dynamic AI and System Controls */}
        {extendedUser && <QuickActionsMenu user={extendedUser} onNavigate={handleNavigation} />}
        {extendedUser && <AIChatModalTrigger user={extendedUser} />}
        <NotificationCenterTrigger />
        {extendedUser && <SystemHealthIndicator />}
        {/* END: Dynamic AI and System Controls */}

      </div>
      <div className="mt-auto flex-shrink-0 flex flex-col items-center gap-2">
         {user && (
            <Tooltip text={extendedUser?.displayName || user.displayName || 'User Profile'}>
                {/* Story: The user avatar is more than just a picture; it's a gateway to a comprehensive
                 user profile, including security settings, preferences, and activity logs. */}
                 <img src={user.photoURL || 'https://via.placeholder.com/40?text=U'} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full border-2 border-border" />
            </Tooltip>
         )}
         {extendedUser && <UserMFAStatus user={extendedUser} />}
         {user && (
            <Tooltip text="Logout">
                <button
                onClick={handleLogout}
                className="flex items-center justify-center w-12 h-12 rounded-lg text-text-secondary hover:bg-gray-100"
                aria-label="Logout"
                >
                <ArrowLeftOnRectangleIcon />
                </button>
            </Tooltip>
         )}
      </div>
    </nav>
  );
};
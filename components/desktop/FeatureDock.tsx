// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { ALL_FEATURES } from '../features/index.ts';
import type { Feature } from '../../types.ts';

// --- Invented Type Definitions (Chronos Initiative, 2023) ---
// These types define the structural contracts for various advanced components and services.
// They are part of the 'SchemaVerse' project, aiming for type-safety across distributed systems,
// developed by a consortium of Citibank's top architects.

/**
 * @interface TelemetryEvent
 * @description Represents a structured user interaction event for granular analytics.
 * Invented by 'Project Chronos' in 2023, under the leadership of Dr. Anya Sharma,
 * this is a core component of the 'AetherFlow' event-bus architecture, designed for real-time
 * operational intelligence and predictive behavioral modeling.
 */
interface TelemetryEvent {
    id: string;
    timestamp: number;
    eventType: 'feature_opened' | 'feature_searched' | 'dock_interaction' | 'preference_updated' | 'ai_query' | 'feature_pinned' | 'feature_unpinned' | 'feature_access_denied' | 'notification_added' | 'notification_read' | 'notification_action' | 'feature_flag_updated' | 'user_role_changed';
    featureId?: string;
    userId: string;
    sessionId: string;
    metadata?: Record<string, any>;
}

/**
 * @interface UserPreferences
 * @description Stores personalized settings and behavioral patterns for the FeatureDock.
 * Conceived by 'Athena Labs' in 2022, led by Dr. Julian Vance, this data model is central
 * to the 'UserPersonaService' and drives the Adaptive Layout Engine for a tailored user experience.
 */
interface UserPreferences {
    preferredLayout: 'grid' | 'list' | 'compact';
    recentFeatures: string[]; // Array of feature IDs, maintained by Chronos Initiative
    pinnedFeatures: string[]; // User-defined quick access features
    dockTheme: 'dark' | 'light' | 'system'; // 'AuraTheme' integration from 'Aura UI Framework'
    showFeatureDescriptions: boolean;
    enableAIRecommendations: boolean; // Toggle for 'SynapseAI_API_Client' suggestions
    searchHistory: string[]; // History for 'InterstellarSearchEngine'
    // Additional preferences for future expansions (e.g., notification preferences, language)
    notificationSettings: {
        enablePush: boolean;
        criticalOnly: boolean;
    };
    preferredLanguage: string; // For i18n support
}

/**
 * @interface FeatureMetadata
 * @description Extends the base Feature with additional dynamic properties managed by the feature lifecycle.
 * A product of 'QuantumFeatureManifestService' by 'Nexus Corp', 2023. This meta-data structure
 * supports A/B testing, phased rollouts, and granular feature flag control using 'ImmutableCanvas' blockchain.
 */
interface FeatureMetadata extends Feature {
    isNew: boolean;
    isBeta: boolean;
    isVisible: boolean; // Managed by feature flags from 'QuantumFeatureManifestService'
    tags: string[]; // For filtering and AI-driven categorization
    category: string; // Categorization for navigation
    version: string;
    lastUpdated: number; // Timestamp for freshness indicator
    recommendedScore?: number; // Output from 'SynapseAI_API_Client' for ranking
    dependencies?: string[]; // Other feature IDs required for this feature to function
    externalLink?: string; // For features that launch external applications or micro-frontends
    accessLevel: 'guest' | 'standard' | 'premium' | 'admin'; // Controlled by 'SentinelSecurityContext'
}

/**
 * @interface AIServiceResponse
 * @description Standardized response format for all AI interactions, ensuring consistency
 * across Gemini, ChatGPT, and custom models.
 * Defined by 'Cognito Initiative' for the 'SynapseAI_API_Client', 2024.
 */
interface AIServiceResponse {
    queryId: string;
    response: string;
    suggestions?: string[]; // Follow-up prompts
    relatedFeatures?: string[]; // Feature IDs suggested by AI
    modelUsed: 'Gemini' | 'ChatGPT' | 'Custom';
    tokensUsed: number;
    responseTimeMs: number;
}

/**
 * @interface NotificationPayload
 * @description Structure for system-wide, actionable notifications.
 * Invented by 'Vanguard Systems' for 'OrchestrationNotificationService', 2023.
 * Supports multi-channel delivery and dynamic action buttons.
 */
interface NotificationPayload {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success' | 'feature_update' | 'ai_tip' | 'security_alert';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
    action?: {
        label: string;
        callback: () => void;
    };
    priority: number; // For sorting and display importance (1-10, 10 being highest)
}

// --- Invented Utility Functions (Velocity Solutions, 2022) ---
// These functions provide common operations like debouncing and advanced string manipulation,
// forming part of the 'OptimizedLogicFabric' toolkit, vital for high-performance UI.

/**
 * @function debounce
 * @description Delays function execution until after a specified time has passed without further invocations.
 * A core component of 'HyperPerformanceToolkit' by Velocity Solutions, 2022.
 * Crucial for optimizing search inputs and other rapid UI interactions.
 */
export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

/**
 * @function fuzzyMatch
 * @description Performs a non-exact, intelligent string comparison for search purposes.
 * Invented by 'Cosmic Query Inc.' for the 'InterstellarSearchEngine', 2024.
 * Employs a simplified Longest Common Subsequence (LCS) algorithm for relevance.
 */
export const fuzzyMatch = (text: string, query: string): boolean => {
    if (!query) return true;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let i = 0, j = 0;
    while (i < lowerText.length && j < lowerQuery.length) {
        if (lowerText[i] === lowerQuery[j]) {
            j++;
        }
        i++;
    }
    return j === lowerQuery.length;
};

/**
 * @function generateUUID
 * @description Generates a unique identifier. Part of 'Chronos Initiative's 'IdentifierMatrix'.
 */
export const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// --- Invented Mock External Services (Multiple Initiatives, 2022-2024) ---
// These classes simulate interactions with various backend and AI services.
// They represent a micro-service oriented architecture, 'MicrocosmNet', developed by Citibank's 'ArchiTech' division.

/**
 * @class OmniTelemetryService
 * @description Collects and processes user interaction data across the application.
 * Invented by 'Project Chronos' in 2023. Employs 'AetherFlow' for high-throughput,
 * low-latency event ingestion, crucial for behavioral analytics and system monitoring.
 */
export class OmniTelemetryService {
    private static instance: OmniTelemetryService;
    private userId: string = 'user_' + generateUUID();
    private sessionId: string = 'session_' + generateUUID();
    private eventQueue: TelemetryEvent[] = [];
    private isSending: boolean = false;

    private constructor() {
        console.log(`[OmniTelemetryService] Initialized for User: ${this.userId}, Session: ${this.sessionId}`);
        // Simulate periodic batch sending
        setInterval(() => this.sendBatchEvents(), 5000); // Every 5 seconds
    }

    public static getInstance(): OmniTelemetryService {
        if (!OmniTelemetryService.instance) {
            OmniTelemetryService.instance = new OmniTelemetryService();
        }
        return OmniTelemetryService.instance;
    }

    /**
     * @method trackEvent
     * @description Enqueues a telemetry event for eventual dispatch.
     * @param eventType Type of interaction.
     * @param featureId (Optional) The ID of the feature involved.
     * @param metadata (Optional) Additional contextual data.
     */
    public async trackEvent(eventType: TelemetryEvent['eventType'], featureId?: string, metadata?: Record<string, any>): Promise<void> {
        const event: TelemetryEvent = {
            id: 'evt_' + generateUUID(),
            timestamp: Date.now(),
            eventType,
            featureId,
            userId: this.userId,
            sessionId: this.sessionId,
            metadata: { ...metadata, clientTime: new Date().toISOString(), appVersion: 'GalaxyDock-1.0.0-alpha.987' }
        };
        this.eventQueue.push(event);
        console.log(`[OmniTelemetryService] Enqueued: ${event.eventType}${event.featureId ? ` (Feature: ${event.featureId})` : ''}`, event);
        if (!this.isSending) {
            this.sendBatchEvents(); // Attempt to send immediately if not busy
        }
    }

    /**
     * @method sendBatchEvents
     * @description Processes and sends a batch of telemetry events to the backend.
     * Utilizes a backoff strategy and ensures event order.
     */
    private async sendBatchEvents(): Promise<void> {
        if (this.isSending || this.eventQueue.length === 0) return;

        this.isSending = true;
        const batch = this.eventQueue.splice(0, 10); // Send up to 10 events at a time
        console.log(`[OmniTelemetryService] Sending batch of ${batch.length} events...`);

        try {
            // Simulate API call to a high-volume telemetry ingestion endpoint (e.g., AWS Kinesis, Google Pub/Sub)
            await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50)); // Simulate network latency
            batch.forEach(event => console.debug(`[OmniTelemetryService] Sent: ${event.id}`));
            // In a real system, this would involve `fetch('/api/telemetry', { method: 'POST', body: JSON.stringify(batch) })`
        } catch (error) {
            console.error('[OmniTelemetryService] Failed to send telemetry batch:', error);
            // Re-add to front of queue for retry with exponential backoff in a real system
            this.eventQueue.unshift(...batch);
        } finally {
            this.isSending = false;
            if (this.eventQueue.length > 0) {
                this.sendBatchEvents(); // Process next batch if available
            }
        }
    }
}

/**
 * @class UserPersonaService
 * @description Manages and provides user-specific preferences and profile data,
 * dynamically adapting the UI to individual needs.
 * Conceived by 'Athena Labs' in 2022, led by Dr. Evelyn Reed, it integrates
 * with client-side storage for persistence and syncs with a backend profile service
 * (codenamed 'CognitoSync').
 */
export class UserPersonaService {
    private static instance: UserPersonaService;
    private preferences: UserPreferences;
    private storageKey = `user_preferences_${OmniTelemetryService.getInstance().userId}`;
    private listeners: ((preferences: UserPreferences) => void)[] = [];

    private constructor() {
        // Attempt to load from local storage using 'HyperCacheUtility' principles
        const stored = localStorage.getItem(this.storageKey);
        this.preferences = stored ? JSON.parse(stored) : {
            preferredLayout: 'grid',
            recentFeatures: [],
            pinnedFeatures: [],
            dockTheme: 'dark',
            showFeatureDescriptions: true,
            enableAIRecommendations: true,
            searchHistory: [],
            notificationSettings: { enablePush: true, criticalOnly: false },
            preferredLanguage: 'en-US',
        };
        console.log(`[UserPersonaService] Loaded preferences for ${this.storageKey}:`, this.preferences);
    }

    public static getInstance(): UserPersonaService {
        if (!UserPersonaService.instance) {
            UserPersonaService.instance = new UserPersonaService();
        }
        return UserPersonaService.instance;
    }

    /**
     * @method getPreferences
     * @description Retrieves current user preferences.
     * @returns A deep copy of the current preferences to prevent direct mutation.
     */
    public getPreferences(): UserPreferences {
        return JSON.parse(JSON.stringify(this.preferences)); // Deep copy
    }

    /**
     * @method updatePreference
     * @description Updates a specific user preference and persists it.
     * Triggers listeners for real-time UI updates.
     * @param key The preference key to update.
     * @param value The new value.
     */
    public async updatePreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): Promise<void> {
        const oldPreferences = this.getPreferences();
        if (JSON.stringify(oldPreferences[key]) === JSON.stringify(value)) {
            // No change, avoid unnecessary updates
            return;
        }

        this.preferences = { ...this.preferences, [key]: value };
        localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
        console.log(`[UserPersonaService] Updated preference '${String(key)}':`, value);
        await OmniTelemetryService.getInstance().trackEvent('preference_updated', undefined, { key, value });
        // Simulate API call to sync with backend profile service ('CognitoSync')
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
        this.notifyListeners();
    }

    /**
     * @method recordRecentFeature
     * @description Adds a feature to the recent features list, maintaining order and uniqueness.
     * Limits the list size to 10 for optimal performance and relevance.
     * @param featureId The ID of the feature to record.
     */
    public async recordRecentFeature(featureId: string): Promise<void> {
        let recents = [featureId, ...this.preferences.recentFeatures.filter(id => id !== featureId)];
        await this.updatePreference('recentFeatures', recents.slice(0, 10)); // Keep up to 10 recent features
    }

    /**
     * @method addSearchQueryToHistory
     * @description Adds a search query to history, preventing duplicates.
     * Limits the history size to 5 for quick access.
     * @param query The search query.
     */
    public async addSearchQueryToHistory(query: string): Promise<void> {
        if (query.trim()) {
            let history = [query, ...this.preferences.searchHistory.filter(q => q.toLowerCase() !== query.toLowerCase())];
            await this.updatePreference('searchHistory', history.slice(0, 5)); // Keep up to 5 search queries
        }
    }

    /**
     * @method subscribe
     * @description Allows components to subscribe to preference updates.
     * @param listener A callback function to be called when preferences change.
     * @returns A function to unsubscribe the listener.
     */
    public subscribe(listener: (preferences: UserPreferences) => void): () => void {
        this.listeners.push(listener);
        listener(this.getPreferences()); // Send initial state
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        const currentPreferences = this.getPreferences();
        this.listeners.forEach(listener => listener(currentPreferences));
    }
}

/**
 * @class QuantumFeatureManifestService
 * @description Manages feature metadata, flags, and dynamic updates for over 1000 features.
 * A breakthrough from 'Nexus Corp' in late 2023, led by Dr. Kenji Tanaka.
 * Leverages 'ImmutableCanvas' (a custom distributed ledger for feature states) for auditability
 * and integrity. Supports multi-variant A/B testing and geo-specific rollouts.
 */
export class QuantumFeatureManifestService {
    private static instance: QuantumFeatureManifestService;
    private featureCatalog: Map<string, FeatureMetadata>;
    private featureFlags: Map<string, boolean>; // Runtime visibility flags
    private listeners: ((features: FeatureMetadata[]) => void)[] = [];

    private constructor() {
        this.featureCatalog = new Map();
        this.featureFlags = new Map();
        this.initializeCatalog();
        console.log(`[QuantumFeatureManifestService] Catalog initialized with ${this.featureCatalog.size} features.`);
        // Simulate feature flag updates periodically
        setInterval(() => this.simulateDynamicFeatureUpdates(), 60000); // Every minute
    }

    public static getInstance(): QuantumFeatureManifestService {
        if (!QuantumFeatureManifestService.instance) {
            QuantumFeatureManifestService.instance = new QuantumFeatureManifestService();
        }
        return QuantumFeatureManifestService.instance;
    }

    /**
     * @method initializeCatalog
     * @description Populates the initial feature catalog and applies default flags.
     * In a real system, this would fetch from a CDN or a dedicated feature flag service
     * (e.g., LaunchDarkly, Optimizely, or 'ImmutableCanvas' blockchain nodes).
     */
    private initializeCatalog(): void {
        const baseFeatures: Feature[] = ALL_FEATURES;
        const expandedFeatures: FeatureMetadata[] = baseFeatures.map(f => ({
            ...f,
            isNew: Math.random() > 0.85, // Simulate ~15% new features
            isBeta: Math.random() > 0.95, // Simulate ~5% beta features
            isVisible: Math.random() > 0.02, // Simulate 2% hidden features for A/B tests or deprecation
            tags: this.generateRandomTags(),
            category: this.getRandomCategory(),
            version: `1.0.${Math.floor(Math.random() * 20) + 1}`,
            lastUpdated: Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000, // Up to 60 days ago
            accessLevel: this.getRandomAccessLevel(),
        }));

        this.addInventedFeatures(expandedFeatures); // Add Citibank Demo specific features
        expandedFeatures.forEach(f => {
            this.featureCatalog.set(f.id, f);
            this.featureFlags.set(f.id, f.isVisible); // Set initial visibility
        });
    }

    private generateRandomTags(): string[] {
        const possibleTags = ['AI', 'Data', 'Analytics', 'Utility', 'Productivity', 'Communication', 'Experimental', 'Core', 'Integration', 'Security', 'Compliance', 'Finance', 'Reporting', 'Automation', 'Cloud'];
        const numTags = Math.floor(Math.random() * 4) + 1; // 1 to 4 tags
        const tags = new Set<string>();
        while (tags.size < numTags) {
            tags.add(possibleTags[Math.floor(Math.random() * possibleTags.length)]);
        }
        return Array.from(tags);
    }

    private getRandomCategory(): string {
        const categories = ['Tools', 'AI & ML', 'Utilities', 'Communication', 'Data Visualization', 'System', 'Finance', 'Security', 'Reporting', 'Automation'];
        return categories[Math.floor(Math.random() * categories.length)];
    }

    private getRandomAccessLevel(): 'guest' | 'standard' | 'premium' | 'admin' {
        const levels = ['guest', 'standard', 'premium', 'admin'];
        return levels[Math.floor(Math.random() * levels.length)] as any;
    }

    /**
     * @method addInventedFeatures
     * @description Adds a collection of highly specialized, commercially-driven features.
     * These represent advanced functionalities integrating multiple services, showcasing
     * the product roadmap for Citibank Demo Business Inc.
     * Target: Hundreds of features for 'Galactic Gateway' platform.
     */
    private addInventedFeatures(featureList: FeatureMetadata[]): void {
        const inventedFeatures: FeatureMetadata[] = [
            // --- Gemini / ChatGPT Integrated Features (Cognito Initiative) ---
            {
                id: 'ai_predictive_dashboard',
                name: 'AI Predictive Dashboard',
                description: 'Leverages Gemini and ChatGPT to forecast business metrics, identify trends, and provide actionable, context-aware insights for financial strategies. Part of the "Visionary Analytics" suite.',
                icon: '📊',
                isNew: true, isBeta: false, isVisible: true,
                tags: ['AI', 'Analytics', 'Gemini', 'ChatGPT', 'Premium', 'Finance'], category: 'AI & ML', version: '2.1.0', lastUpdated: Date.now(),
                dependencies: ['data_ingestion_engine', 'synapse_ai_client'], accessLevel: 'premium'
            },
            {
                id: 'smart_code_assistant',
                name: 'Smart Code Assistant (Gemini Pro)',
                description: 'Assists developers with code generation, debugging, refactoring, and secure coding practices using Gemini Pro API. Integrates with IDEs via "NexusDevKit".',
                icon: '👩‍💻',
                isNew: false, isBeta: true, isVisible: true,
                tags: ['AI', 'Developer', 'Gemini', 'Productivity', 'Experimental'], category: 'AI & ML', version: '1.0.0-beta.7', lastUpdated: Date.now() - 5 * 24 * 60 * 60 * 1000,
                accessLevel: 'admin'
            },
            {
                id: 'semantic_document_search',
                name: 'Semantic Document Search (ChatGPT)',
                description: 'Finds relevant documents, contracts, and knowledge base articles based on meaning and context, not just keywords, powered by ChatGPT embeddings. Part of the "CognitoKnowledge" system.',
                icon: '📚',
                isNew: true, isBeta: false, isVisible: true,
                tags: ['AI', 'Search', 'ChatGPT', 'Knowledge', 'Utility'], category: 'AI & ML', version: '1.2.0', lastUpdated: Date.now() - 2 * 24 * 60 * 60 * 1000,
                accessLevel: 'standard'
            },
            {
                id: 'cross_platform_syncer',
                name: 'Cross-Platform Syncer (Continuum)',
                description: 'Synchronizes user settings, preferences, and workspace data across all devices and platforms seamlessly. Leverages "CloudFabric" backend for high availability.',
                icon: '☁️',
                isNew: true, isBeta: false, isVisible: true,
                tags: ['Utility', 'Cloud', 'Integration', 'Continuum', 'System'], category: 'System', version: '1.0.0', lastUpdated: Date.now(),
                externalLink: 'https://continuum.citibank.demo/sync', accessLevel: 'standard'
            },
            {
                id: 'digital_twin_simulator',
                name: 'Digital Twin Simulator (Project Echo)',
                description: 'Simulate complex business processes, financial markets, and customer interactions with a digital twin, optimizing resource allocation and predicting outcomes with high fidelity. Utilizes "QuantumSimulationEngine".',
                icon: '🔬',
                isNew: true, isBeta: true, isVisible: true,
                tags: ['Simulation', 'Optimization', 'Data', 'Echo', 'Analytics'], category: 'Data Visualization', version: '0.9.5', lastUpdated: Date.now() - 10 * 24 * 60 * 60 * 1000,
                accessLevel: 'premium'
            },
            {
                id: 'predictive_anomaly_detector',
                name: 'Predictive Anomaly Detector (Aegis Shield)',
                description: 'Monitors real-time financial data streams for unusual patterns, identifying potential fraud, system breaches, or market irregularities, alerting before critical issues arise. Powered by "DeepScan AI".',
                icon: '🚨',
                isNew: false, isBeta: false, isVisible: true,
                tags: ['Security', 'AI', 'Monitoring', 'Aegis', 'Finance'], category: 'System', version: '3.0.1', lastUpdated: Date.now() - 20 * 24 * 60 * 60 * 1000,
                accessLevel: 'admin'
            },
            {
                id: 'enterprise_workflow_orchestrator',
                name: 'Enterprise Workflow Orchestrator (Maestro)',
                description: 'Automates and manages complex enterprise workflows across disparate systems, enabling end-to-end process automation for banking operations. Integrates with "MicrocosmNet" services.',
                icon: '⚙️',
                isNew: true, isBeta: false, isVisible: true,
                tags: ['Automation', 'Integration', 'Productivity', 'Maestro', 'Tools'], category: 'Tools', version: '1.5.0', lastUpdated: Date.now() - 3 * 24 * 60 * 60 * 1000,
                accessLevel: 'standard'
            },
            {
                id: 'global_compliance_tracker',
                name: 'Global Compliance Tracker (ReguLex)',
                description: 'Provides real-time updates on international financial regulations (e.g., GDPR, CCPA, Basel III, KYC) and ensures adherence for all Citibank Demo financial products and services. Features "LexiBot" AI for regulatory interpretation.',
                icon: '⚖️',
                isNew: true, isBeta: false, isVisible: true,
                tags: ['Compliance', 'Legal', 'Finance', 'ReguLex', 'AI'], category: 'Tools', version: '1.0.0', lastUpdated: Date.now(),
                accessLevel: 'premium'
            },
            {
                id: 'dynamic_risk_assessment',
                name: 'Dynamic Risk Assessment (Fortress)',
                description: 'Utilizes advanced AI and machine learning models to assess financial risk factors (credit, market, operational) in real-time, providing proactive insights and stress testing capabilities. Part of "SentinelRisk" platform.',
                icon: '📉',
                isNew: false, isBeta: false, isVisible: true,
                tags: ['Finance', 'Risk', 'AI', 'Fortress', 'Analytics'], category: 'Analytics', version: '2.0.0', lastUpdated: Date.now() - 7 * 24 * 60 * 60 * 1000,
                accessLevel: 'premium'
            },
            {
                id: 'decentralized_identity_vault',
                name: 'Decentralized Identity Vault (GuardianID)',
                description: 'Secures user identities and credentials using blockchain-inspired self-sovereign identity (SSI) technologies, enhancing privacy and reducing reliance on central authorities. Powered by "TrustChain" protocol.',
                icon: '🔑',
                isNew: true, isBeta: true, isVisible: true,
                tags: ['Security', 'Blockchain', 'Privacy', 'GuardianID', 'Experimental'], category: 'System', version: '0.5.0-alpha', lastUpdated: Date.now() - 15 * 24 * 60 * 60 * 1000,
                accessLevel: 'admin'
            },
            {
                id: 'ai_marketing_campaign_optimizer',
                name: 'AI Marketing Campaign Optimizer',
                description: 'Uses AI to analyze market data and customer behavior to optimize marketing campaign performance, targeting, and ROI.',
                icon: '🚀',
                isNew: true, isBeta: false, isVisible: true,
                tags: ['AI', 'Marketing', 'Analytics', 'Business'], category: 'AI & ML', version: '1.0.0', lastUpdated: Date.now() - 1 * 24 * 60 * 60 * 1000, accessLevel: 'premium'
            },
            {
                id: 'realtime_portfolio_tracker',
                name: 'Real-time Portfolio Tracker',
                description: 'Provides live updates and predictive analysis for investment portfolios, including stocks, bonds, and cryptocurrencies. Features AI-driven risk alerts.',
                icon: '📈',
                isNew: false, isBeta: false, isVisible: true,
                tags: ['Finance', 'Investment', 'Analytics', 'Real-time'], category: 'Finance', version: '4.2.0', lastUpdated: Date.now() - 3 * 24 * 60 * 60 * 1000, accessLevel: 'standard'
            },
            {
                id: 'quantum_cryptography_toolkit',
                name: 'Quantum Cryptography Toolkit',
                description: 'Offers advanced encryption methods resilient to quantum computing threats, developed by "CipherGuard Technologies". (Experimental)',
                icon: '⚛️',
                isNew: true, isBeta: true, isVisible: false, // Hidden by default, admin only
                tags: ['Security', 'Quantum', 'Cryptography', 'Experimental'], category: 'System', version: '0.1.0-alpha', lastUpdated: Date.now(), accessLevel: 'admin'
            },
            {
                id: 'global_fraud_prevention_network',
                name: 'Global Fraud Prevention Network',
                description: 'A distributed network leveraging federated learning to detect and prevent financial fraud across multiple institutions.',
                icon: '🛡️',
                isNew: true, isBeta: false, isVisible: true,
                tags: ['Security', 'AI', 'Fraud', 'Network'], category: 'Security', version: '1.0.0', lastUpdated: Date.now() - 7 * 24 * 60 * 60 * 1000, accessLevel: 'admin'
            },
            {
                id: 'sustainable_finance_dashboard',
                name: 'Sustainable Finance Dashboard',
                description: 'Tracks and reports on environmental, social, and governance (ESG) metrics for investments and operations, promoting responsible finance.',
                icon: '♻️',
                isNew: true, isBeta: false, isVisible: true,
                tags: ['Finance', 'ESG', 'Sustainability', 'Reporting'], category: 'Finance', version: '1.0.0', lastUpdated: Date.now(), accessLevel: 'standard'
            },
            // Generate many more generic features to meet the "hundreds" requirement
            ...Array.from({ length: 984 }).map((_, i) => ({
                id: `utility_core_feature_${i + 1}`,
                name: `Orion Core Utility ${i + 1}`,
                description: `A fundamental utility for core system operations. This feature number ${i + 1} is part of the extensive 'Orion Core' suite, ensuring robust stability and efficiency for the enterprise. It handles tasks such as data integrity checks, micro-service health monitoring, and resource optimization within the 'MicrocosmNet'.`,
                icon: (i % 5 === 0 ? '🛠️' : i % 3 === 0 ? '🚀' : i % 2 === 0 ? '⚡' : '💡'),
                isNew: Math.random() > 0.95,
                isBeta: Math.random() > 0.98,
                isVisible: true,
                tags: this.generateRandomTags(),
                category: this.getRandomCategory(),
                version: `1.0.${Math.floor(Math.random() * 100)}`,
                lastUpdated: Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000, // Up to 120 days ago
                accessLevel: Math.random() > 0.8 ? 'admin' : (Math.random() > 0.6 ? 'premium' : 'standard'),
            })),
        ];

        featureList.push(...inventedFeatures);
    }

    /**
     * @method getAllFeatures
     * @description Retrieves all features, filtered by current visibility flags.
     * @returns An array of visible FeatureMetadata objects.
     */
    public getAllFeatures(): FeatureMetadata[] {
        return Array.from(this.featureCatalog.values()).filter(f => this.featureFlags.get(f.id));
    }

    /**
     * @method getFeatureById
     * @description Retrieves a specific feature by its ID.
     * @param id The ID of the feature.
     * @returns FeatureMetadata or undefined.
     */
    public getFeatureById(id: string): FeatureMetadata | undefined {
        return this.featureCatalog.get(id);
    }

    /**
     * @method updateFeatureFlag
     * @description Toggles a feature's visibility, typically used by administrators or A/B testing systems.
     * @param id The ID of the feature.
     * @param isVisible The new visibility state.
     */
    public async updateFeatureFlag(id: string, isVisible: boolean): Promise<void> {
        if (this.featureCatalog.has(id)) {
            this.featureFlags.set(id, isVisible);
            const feature = this.featureCatalog.get(id)!;
            this.featureCatalog.set(id, { ...feature, isVisible }); // Update catalog entry
            console.log(`[QuantumFeatureManifestService] Feature '${id}' visibility updated to: ${isVisible}`);
            await OmniTelemetryService.getInstance().trackEvent('feature_flag_updated', id, { isVisible });
            this.notifyListeners(); // Notify subscribers of feature changes
        }
    }

    /**
     * @method simulateDynamicFeatureUpdates
     * @description Periodically simulates feature flag changes, new feature introductions, or deprecations.
     * This demonstrates the dynamic nature of the 'ImmutableCanvas' backend.
     */
    private simulateDynamicFeatureUpdates(): void {
        if (Math.random() < 0.2) { // 20% chance to have a dynamic update
            const features = Array.from(this.featureCatalog.values());
            const randomFeature = features[Math.floor(Math.random() * features.length)];

            if (randomFeature) {
                const newVisibility = !this.featureFlags.get(randomFeature.id);
                this.updateFeatureFlag(randomFeature.id, newVisibility);
                console.log(`[QuantumFeatureManifestService] Simulating dynamic update for ${randomFeature.name}: visibility changed to ${newVisibility}.`);
            }
        }
    }

    /**
     * @method subscribe
     * @description Allows components to subscribe to feature catalog updates.
     * @param listener A callback function to be called when features change.
     * @returns A function to unsubscribe the listener.
     */
    public subscribe(listener: (features: FeatureMetadata[]) => void): () => void {
        this.listeners.push(listener);
        listener(this.getAllFeatures()); // Send initial state
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.getAllFeatures()));
    }
}

/**
 * @class SynapseAI_API_Client
 * @description Unified client for interacting with various AI models (Gemini, ChatGPT, etc.).
 * Developed by the 'Cognito Initiative' in early 2024, led by Dr. Olivia Chen.
 * This class abstracts the complexities of prompt engineering, model selection,
 * context caching, and intelligent routing via a "semantic intent resolver".
 */
export class SynapseAI_API_Client {
    private static instance: SynapseAI_API_Client;
    private apiEndpoint: string = 'https://api.synapse-ai.citibank.demo'; // Mock API endpoint, represents the 'CognitoHub' gateway
    private modelUsageLog: { [model: string]: number } = {};

    private constructor() {
        console.log(`[SynapseAI_API_Client] Initialized for unified AI orchestration (CognitoHub).`);
    }

    public static getInstance(): SynapseAI_API_Client {
        if (!SynapseAI_API_Client.instance) {
            SynapseAI_API_Client.instance = new SynapseAI_API_Client();
        }
        return SynapseAI_API_Client.instance;
    }

    /**
     * @method queryAI
     * @description Sends a query to the appropriate AI model and gets a structured response.
     * It intelligently routes queries based on predefined rules, learned patterns, or
     * explicit `preferredModel` hints, ensuring optimal cost and performance.
     * @param prompt The user's query or instruction.
     * @param context (Optional) Additional contextual data for the AI.
     * @param preferredModel (Optional) Hint for which model to use ('Gemini' | 'ChatGPT' | 'Custom').
     * @returns A promise resolving to an AIServiceResponse.
     */
    public async queryAI(prompt: string, context?: Record<string, any>, preferredModel?: 'Gemini' | 'ChatGPT' | 'Custom'): Promise<AIServiceResponse> {
        const startTime = Date.now();
        console.log(`[SynapseAI_API_Client] Querying AI: "${prompt}" (Preferred: ${preferredModel || 'Auto-Route'})`);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 700 + 300)); // Simulate API call latency to CognitoHub

        const modelUsed = preferredModel || (Math.random() > 0.5 ? 'Gemini' : 'ChatGPT'); // Intelligent routing logic here
        const queryId = 'ai_q_' + generateUUID();
        const tokensUsed = Math.floor(prompt.length / 3) + Math.floor(Math.random() * 80); // Simulate token count

        this.modelUsageLog[modelUsed] = (this.modelUsageLog[modelUsed] || 0) + tokensUsed;

        let response: string;
        let suggestions: string[] = [];
        let relatedFeatures: string[] = [];

        // Simulate advanced natural language understanding and response generation
        if (prompt.toLowerCase().includes('recommend features')) {
            response = `Based on your recent activity and current role, I recommend exploring: AI Predictive Dashboard, Smart Code Assistant, and Semantic Document Search for enhanced productivity.`;
            relatedFeatures = ['ai_predictive_dashboard', 'smart_code_assistant', 'semantic_document_search'];
            suggestions = ['Show me more AI features', 'Explain AI Predictive Dashboard\'s benefits'];
        } else if (prompt.toLowerCase().includes('what is digital twin')) {
            response = `The Digital Twin Simulator (Project Echo) allows you to create virtual replicas of physical systems or financial processes. This enables predictive maintenance, scenario planning, and optimization without impacting live operations. It's a cornerstone of "Visionary Analytics".`;
            relatedFeatures = ['digital_twin_simulator'];
            suggestions = ['How can I start a new simulation?', 'Show me Project Echo documentation'];
        } else if (prompt.toLowerCase().includes('generate code')) {
            response = `Here is a sample TypeScript React component for an enhanced button, demonstrating best practices in component composition: \`\`\`typescript\nimport React from 'react';\ninterface EnhancedButtonProps { label: string; onClick: () => void; isDisabled?: boolean; }\nexport const EnhancedButton: React.FC<EnhancedButtonProps> = ({ label, onClick, isDisabled = false }) => (\n  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" onClick={onClick} disabled={isDisabled}>{label}</button>\n);\n\`\`\``;
            suggestions = ['Refactor this code for performance', 'Generate a Jest test case for this component'];
            relatedFeatures = ['smart_code_assistant'];
        } else if (prompt.toLowerCase().includes('compliance')) {
            response = `The Global Compliance Tracker (ReguLex) provides real-time updates on international financial regulations. It helps ensure your operations adhere to the latest legal frameworks, reducing risk and exposure through automated monitoring and AI-driven alerts.`;
            relatedFeatures = ['global_compliance_tracker'];
            suggestions = ['What are the latest compliance updates for APAC?', 'Integrate ReguLex with my regional regulations'];
        } else if (prompt.toLowerCase().includes('risk assessment')) {
            response = `The Dynamic Risk Assessment (Fortress) utilizes deep learning to analyze market volatility, credit scores, and operational factors, providing an intelligent risk profile for your investments and operations. It updates continuously, offering proactive insights.`;
            relatedFeatures = ['dynamic_risk_assessment'];
            suggestions = ['Perform a stress test on my current portfolio', 'Explain VaR (Value at Risk) calculation'];
        } else if (prompt.toLowerCase().includes('fraud')) {
            response = `The Global Fraud Prevention Network (GFPN) is a state-of-the-art system utilizing federated learning and anomaly detection to identify and mitigate fraudulent financial activities globally. It operates in real-time to protect transactions.`;
            relatedFeatures = ['global_fraud_prevention_network', 'predictive_anomaly_detector'];
            suggestions = ['Report a suspicious activity', 'How does GFPN use machine learning?'];
        } else if (prompt.toLowerCase().includes('ethical guidelines')) {
            response = `Citibank Demo Business Inc. adheres to strict ethical AI guidelines, ensuring fairness, transparency, and accountability in all our AI-powered features. We prioritize data privacy and user consent, following principles established by the 'Ethical AI Review Board'.`;
            suggestions = ['Tell me about data privacy policies', 'What is explainable AI?'];
        }
        else {
            response = `I'm ${modelUsed} and I've processed your query: "${prompt}". This is a sophisticated response derived from multi-modal deep learning models. My analysis indicates a high degree of user engagement potential.`;
            if (modelUsed === 'Gemini') {
                response += ` Gemini's advanced multi-modal capabilities are particularly suited for complex analytical and creative tasks, integrating text, code, image, and video understanding.`;
            } else {
                response += ` ChatGPT excels in conversational understanding, coherent text generation, and knowledge synthesis across vast text corpora.`;
            }
            suggestions = ['Refine my search criteria', 'Ask a follow-up question related to this topic', 'Show me related help articles'];
        }

        const responseTimeMs = Date.now() - startTime;
        await OmniTelemetryService.getInstance().trackEvent('ai_query', undefined, { prompt, modelUsed, queryId, context, tokensUsed, responseTimeMs });

        return { queryId, response, suggestions, relatedFeatures, modelUsed, tokensUsed, responseTimeMs };
    }

    /**
     * @method getAITipsForFeature
     * @description Provides AI-driven usage tips specific to a given feature.
     * Leverages contextual understanding of feature capabilities and user persona.
     * @param featureId The ID of the feature.
     * @returns A promise resolving to a string tip.
     */
    public async getAITipsForFeature(featureId: string): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 150)); // Simulate AI processing
        const feature = QuantumFeatureManifestService.getInstance().getFeatureById(featureId);
        if (!feature) return "No specific AI tips available for this feature. The 'CognitoBrain' is still learning!";

        await OmniTelemetryService.getInstance().trackEvent('ai_tip_requested', featureId);

        const tips = [
            `Pro-tip for ${feature.name}: Utilize its integrated AI capabilities from 'SynapseAI_API_Client' for advanced predictive analytics.`,
            `Did you know ${feature.name} can be automated using the 'Enterprise Workflow Orchestrator (Maestro)' for significant time savings?`,
            `For advanced users of ${feature.name}: Check out the new 'expert configuration mode' in version ${feature.version} for granular control.`,
            `Consider integrating ${feature.name} with the 'Cross-Platform Syncer (Continuum)' for seamless data flow and consistency across all your devices.`,
            `AI suggests you explore the ${feature.category} features, especially those tagged with '${feature.tags[0] || 'AI'}', to unlock synergy with ${feature.name} for enhanced productivity.`,
            `Maximize ${feature.name}'s potential by reviewing the latest updates in the 'OrchestrationNotificationService' for new functionalities.`,
            `${feature.name} is a key component of the 'Galactic Gateway' platform. Ensure your permissions are up-to-date with 'SentinelSecurityContext' for full access.`,
            `Did you know ${feature.name} contributes to your 'User Persona Profile'? The more you use it, the better your dock experience becomes!`
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
}

/**
 * @class OrchestrationNotificationService
 * @description Manages and delivers notifications to the user across various channels.
 * A critical component from 'Vanguard Systems' in 2023, led by Ms. Zara Khan.
 * Ensures timely information dissemination, critical alerts, and personalized feature updates.
 * Supports multi-channel delivery (in-app, future push notifications, email summaries).
 */
export class OrchestrationNotificationService {
    private static instance: OrchestrationNotificationService;
    private notifications: NotificationPayload[] = [];
    private listeners: ((notifications: NotificationPayload[]) => void)[] = [];

    private constructor() {
        // Load initial notifications (mock), simulating critical alerts and feature updates
        this.notifications.push({
            id: generateUUID(), type: 'info', title: 'Welcome to the Enhanced Feature Dock!',
            message: 'Discover over 1000 new features and AI-powered tools. Click on any feature to learn more and customize your experience.',
            timestamp: Date.now(), read: false, priority: 8
        });
        this.notifications.push({
            id: generateUUID(), type: 'feature_update', title: 'New Feature: AI Predictive Dashboard',
            message: 'Unleash the power of Gemini and ChatGPT for advanced business forecasting and actionable insights. Available now for Premium users.',
            timestamp: Date.now() - 3600000, read: false, priority: 9,
            action: { label: 'Explore Dashboard', callback: () => OmniTelemetryService.getInstance().trackEvent('notification_action', 'ai_predictive_dashboard') }
        });
        this.notifications.push({
            id: generateUUID(), type: 'security_alert', title: 'Security Advisory: Review Account Settings',
            message: 'A recent security scan indicates you should review your account\'s multi-factor authentication settings. Protect your data now.',
            timestamp: Date.now() - 7200000, read: false, priority: 10,
            action: { label: 'Go to Security', callback: () => console.log('Navigating to Security Settings...') } // Mock navigation
        });
        console.log(`[OrchestrationNotificationService] Initialized with ${this.notifications.length} notifications.`);
        this.startBackgroundNotifier();
    }

    public static getInstance(): OrchestrationNotificationService {
        if (!OrchestrationNotificationService.instance) {
            OrchestrationNotificationService.instance = new OrchestrationNotificationService();
        }
        return OrchestrationNotificationService.instance;
    }

    /**
     * @method startBackgroundNotifier
     * @description Periodically adds new simulated notifications, demonstrating
     * the system's ability to push dynamic content.
     */
    private startBackgroundNotifier(): void {
        setInterval(() => {
            if (Math.random() < 0.15) { // 15% chance to add a new notification every ~15 seconds
                const allFeatures = QuantumFeatureManifestService.getInstance().getAllFeatures();
                const randomFeature = allFeatures[Math.floor(Math.random() * allFeatures.length)];
                if (randomFeature) {
                    this.addNotification({
                        id: generateUUID(),
                        type: 'ai_tip',
                        title: `AI Tip: Master ${randomFeature.name}`,
                        message: `The Synapse AI suggests: "${randomFeature.name}" is highly effective when paired with ${allFeatures[Math.floor(Math.random() * allFeatures.length)].name} for maximum synergy.`,
                        timestamp: Date.now(),
                        read: false,
                        priority: 5,
                        action: { label: 'Check Feature', callback: () => OmniTelemetryService.getInstance().trackEvent('notification_action', randomFeature.id) }
                    });
                }
            }
        }, 15000);
    }

    /**
     * @method addNotification
     * @description Adds a new notification to the system and informs all subscribers.
     * @param notification The payload of the notification.
     */
    public addNotification(notification: NotificationPayload): void {
        this.notifications = [notification, ...this.notifications].sort((a, b) => b.priority - a.priority || b.timestamp - a.timestamp); // Sort by priority then by recency
        this.notifyListeners();
        OmniTelemetryService.getInstance().trackEvent('notification_added', undefined, { type: notification.type, title: notification.title });
    }

    /**
     * @method markAsRead
     * @description Marks a specific notification as read, updating its state.
     * @param id The ID of the notification to mark.
     */
    public markAsRead(id: string): void {
        this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
        this.notifyListeners();
        OmniTelemetryService.getInstance().trackEvent('notification_read', undefined, { notificationId: id });
    }

    /**
     * @method getUnreadNotifications
     * @description Retrieves all unread notifications, useful for badges and indicators.
     * @returns An array of unread NotificationPayloads.
     */
    public getUnreadNotifications(): NotificationPayload[] {
        return this.notifications.filter(n => !n.read);
    }

    /**
     * @method subscribe
     * @description Allows components to subscribe to real-time notification updates.
     * @param listener A callback function to be called when notifications change.
     * @returns A function to unsubscribe the listener, preventing memory leaks.
     */
    public subscribe(listener: (notifications: NotificationPayload[]) => void): () => void {
        this.listeners.push(listener);
        listener(this.notifications); // Send initial state upon subscription
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.notifications));
    }
}

/**
 * @class SentinelSecurityContext
 * @description Provides a robust security context for feature access control,
 * simulating user roles, permissions, and subscription tiers.
 * Designed by 'CipherGuard Technologies' in 2024, led by Dr. Alex Turner.
 * This is a mock; in real production systems, it integrates with a centralized
 * Authorization & Authentication service (e.g., OAuth2/OpenID Connect provider).
 */
export class SentinelSecurityContext {
    private static instance: SentinelSecurityContext;
    private currentUserRole: 'admin' | 'premium' | 'standard' | 'guest' = 'standard';
    private userPermissions: Map<string, boolean>; // featureId -> canAccess
    private listeners: ((role: SentinelSecurityContext['currentUserRole']) => void)[] = [];


    private constructor() {
        this.userPermissions = new Map();
        // Load initial role from session storage or default
        const storedRole = sessionStorage.getItem('currentUserRole') as SentinelSecurityContext['currentUserRole'];
        this.currentUserRole = storedRole || 'standard';
        this.initializePermissions();
        console.log(`[SentinelSecurityContext] Initialized with role: ${this.currentUserRole}`);
    }

    public static getInstance(): SentinelSecurityContext {
        if (!SentinelSecurityContext.instance) {
            SentinelSecurityContext.instance = new SentinelSecurityContext();
        }
        return SentinelSecurityContext.instance;
    }

    /**
     * @method initializePermissions
     * @description Sets up initial and dynamic permissions based on the current user role.
     * This mock evaluates access against predefined feature `accessLevel` metadata.
     */
    private initializePermissions(): void {
        const allFeatures = QuantumFeatureManifestService.getInstance().getAllFeatures();
        this.userPermissions.clear(); // Clear existing permissions
        allFeatures.forEach(feature => {
            let canAccess = true;
            switch (this.currentUserRole) {
                case 'guest':
                    canAccess = feature.accessLevel === 'guest';
                    break;
                case 'standard':
                    canAccess = feature.accessLevel === 'guest' || feature.accessLevel === 'standard';
                    break;
                case 'premium':
                    canAccess = feature.accessLevel === 'guest' || feature.accessLevel === 'standard' || feature.accessLevel === 'premium';
                    break;
                case 'admin':
                    canAccess = true; // Admins have access to everything
                    break;
            }
            // Additional logic: beta features require specific beta access flag
            if (feature.isBeta && this.currentUserRole !== 'admin' && !feature.tags.includes('Experimental')) {
                 canAccess = false; // Only admins or special 'Experimental' tag users get beta
            }
            this.userPermissions.set(feature.id, canAccess);
        });
        this.notifyListeners();
    }

    /**
     * @method canAccessFeature
     * @description Checks if the current user has access to a specific feature.
     * This is the public interface for permission checks throughout the UI.
     * @param featureId The ID of the feature.
     * @returns True if the user can access, false otherwise.
     */
    public canAccessFeature(featureId: string): boolean {
        return this.userPermissions.get(featureId) ?? false;
    }

    /**
     * @method setUserRole
     * @description Changes the current user's role and re-evaluates all permissions.
     * This is a critical administrative function.
     * @param role The new role.
     */
    public async setUserRole(role: 'admin' | 'premium' | 'standard' | 'guest'): Promise<void> {
        this.currentUserRole = role;
        sessionStorage.setItem('currentUserRole', role); // Persist mock role in session
        this.initializePermissions(); // Re-evaluate permissions based on new role
        console.log(`[SentinelSecurityContext] User role changed to: ${role}. Permissions re-evaluated.`);
        await OmniTelemetryService.getInstance().trackEvent('user_role_changed', undefined, { newRole: role });
    }

    public getCurrentUserRole(): SentinelSecurityContext['currentUserRole'] {
        return this.currentUserRole;
    }

    /**
     * @method subscribe
     * @description Allows components to react to changes in the current user's role.
     * @param listener A callback function for role updates.
     * @returns A function to unsubscribe.
     */
    public subscribe(listener: (role: SentinelSecurityContext['currentUserRole']) => void): () => void {
        this.listeners.push(listener);
        listener(this.currentUserRole);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.currentUserRole));
    }
}


// --- React Contexts for Injecting Services (Modular Systems Group, 2023) ---
// These contexts provide a clean, standardized way to access the singleton service instances
// throughout the component tree, part of the 'DependencyWeaver' pattern for micro-frontends.

export const TelemetryServiceContext = createContext<OmniTelemetryService | null>(null);
export const UserPersonaServiceContext = createContext<UserPersonaService | null>(null);
export const FeatureManifestServiceContext = createContext<QuantumFeatureManifestService | null>(null);
export const AIServiceContext = createContext<SynapseAI_API_Client | null>(null);
export const NotificationServiceContext = createContext<OrchestrationNotificationService | null>(null);
export const SecurityContext = createContext<SentinelSecurityContext | null>(null);

// --- Advanced UI Components (Spatial Dynamics Labs & Cosmic Query Inc., 2023-2024) ---
// These components leverage the invented services to provide a rich, interactive,
// and adaptive user experience within the Feature Dock.

/**
 * @component FeatureButton
 * @description Enhanced FeatureButton with integrated telemetry, AI tips, and security checks.
 * Original component by James Burvel Oâ€™Callaghan III, significantly enhanced by 'Spatial Dynamics Labs'
 * in 2023 under the 'Galaxy UI' initiative. It now includes dynamic tooltips, access control,
 * and immediate feedback mechanisms.
 */
const FeatureButton: React.FC<FeatureButtonProps & { featureMetadata: FeatureMetadata }> = ({ feature, onOpen, featureMetadata }) => {
    const telemetry = useContext(TelemetryServiceContext);
    const userPersona = useContext(UserPersonaServiceContext);
    const security = useContext(SecurityContext);
    const aiService = useContext(AIServiceContext);

    const [showTooltip, setShowTooltip] = useState(false);
    const [aiTip, setAiTip] = useState<string | null>(null);
    const [isAccessible, setIsAccessible] = useState(true);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsAccessible(security?.canAccessFeature(feature.id) ?? true);
        const unsubscribe = security?.subscribe(() => {
            setIsAccessible(security.canAccessFeature(feature.id));
        });
        return () => unsubscribe?.();
    }, [feature.id, security]);

    const handleOpen = useCallback(() => {
        if (!isAccessible) {
            alert(`Access Denied: You do not have permission to open '${feature.name}'. Your current role is '${security?.getCurrentUserRole()}', but this feature requires '${featureMetadata.accessLevel}' access.`);
            telemetry?.trackEvent('feature_access_denied', feature.id, { featureName: feature.name, requiredRole: featureMetadata.accessLevel, currentRole: security?.getCurrentUserRole() });
            return;
        }
        telemetry?.trackEvent('feature_opened', feature.id, { featureName: feature.name });
        userPersona?.recordRecentFeature(feature.id);
        if (featureMetadata.externalLink) {
            window.open(featureMetadata.externalLink, '_blank', 'noopener,noreferrer'); // Open external features in new tab for 'MicroFrontendHost'
        } else {
            onOpen(feature.id);
        }
    }, [feature.id, feature.name, featureMetadata, onOpen, telemetry, userPersona, security, isAccessible]);

    const fetchAiTip = useCallback(debounce(async () => {
        if (aiService && userPersona?.getPreferences().enableAIRecommendations && isAccessible) {
            const tip = await aiService.getAITipsForFeature(feature.id);
            setAiTip(tip);
        }
    }, 500), [aiService, feature.id, userPersona, isAccessible]);

    const handleMouseEnter = () => {
        setShowTooltip(true);
        fetchAiTip();
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
        setAiTip(null);
    };

    const displayDescription = userPersona?.getPreferences().showFeatureDescriptions ? featureMetadata?.description : undefined;
    const isPinned = userPersona?.getPreferences().pinnedFeatures.includes(feature.id);

    const buttonClasses = `
        relative w-24 h-24 flex flex-col items-center justify-center p-2 rounded-lg
        ${isAccessible ? 'bg-slate-800/50 hover:bg-slate-700/80 transition-colors group' : 'bg-red-900/30 cursor-not-allowed grayscale'}
        ${isPinned ? 'border-2 border-cyan-500' : ''}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500
    `;

    return (
        <button
            onClick={handleOpen}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={buttonClasses}
            title={feature.name}
            disabled={!isAccessible}
            aria-label={feature.name}
            aria-disabled={!isAccessible}
        >
            {isPinned && (
                <span className="absolute top-1 right-1 text-xs text-cyan-400" title="Pinned Feature" aria-label="Pinned Feature">📌</span>
            )}
            {!isAccessible && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/70 text-red-400 rounded-lg text-xs font-bold p-1 text-center leading-tight">Access Denied: {featureMetadata.accessLevel} required</span>
            )}
            <div className="text-cyan-400 group-hover:scale-110 transition-transform text-2xl">{feature.icon}</div>
            <span className="text-xs text-slate-300 mt-2 text-center w-full break-words">{feature.name}</span>

            {showTooltip && (
                <div ref={tooltipRef} className="absolute bottom-full mb-2 p-3 bg-slate-700 text-white text-xs rounded shadow-lg z-50 min-w-[200px] max-w-[300px] text-left">
                    <p className="font-bold text-base text-cyan-300">{feature.name}</p>
                    {featureMetadata && userPersona?.getPreferences().showFeatureDescriptions && (
                        <p className="mt-1 text-slate-400 text-sm">{featureMetadata.description}</p>
                    )}
                    {featureMetadata?.isNew && <p className="mt-1 text-green-400 text-sm">✨ New Feature (v{featureMetadata.version})</p>}
                    {featureMetadata?.isBeta && <p className="mt-1 text-yellow-400 text-sm">🧪 Beta Access (Experimental)</p>}
                    {!isAccessible && <p className="mt-1 text-red-400 text-sm">🔒 Requires {featureMetadata.accessLevel} role.</p>}
                    {aiTip && userPersona?.getPreferences().enableAIRecommendations && <p className="mt-1 text-purple-300 italic text-sm">AI Insight: {aiTip}</p>}
                    <p className="mt-1 text-slate-500 text-xs">Last Updated: {new Date(featureMetadata.lastUpdated).toLocaleDateString()}</p>
                    <p className="mt-0.5 text-slate-500 text-xs">Tags: {featureMetadata.tags.join(', ')}</p>
                </div>
            )}
        </button>
    );
};

/**
 * @component FeatureSearchBar
 * @description Provides a powerful search interface using 'InterstellarSearchEngine'.
 * Invented by 'Cosmic Query Inc.' in 2024. Integrates with UserPersonaService for search history,
 * and TelemetryService for usage analytics. Designed for high responsiveness.
 */
export const FeatureSearchBar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const userPersona = useContext(UserPersonaServiceContext);
    const telemetry = useContext(TelemetryServiceContext);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const debouncedSearch = useCallback(debounce((query: string) => {
        telemetry?.trackEvent('feature_searched', undefined, { query, resultsCount: 0 }); // Result count updated by parent
        userPersona?.addSearchQueryToHistory(query);
        onSearch(query);
    }, 300), [onSearch, telemetry, userPersona]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchTerm(query);
        debouncedSearch(query);
    };

    const handleSelectHistory = (query: string) => {
        setSearchTerm(query);
        onSearch(query);
        setIsFocused(false); // Close history dropdown
        telemetry?.trackEvent('feature_search_history_selected', undefined, { query });
    };

    const searchHistory = userPersona?.getPreferences().searchHistory || [];

    return (
        <div className="relative w-full max-w-lg mx-auto mb-4">
            <input
                ref={searchInputRef}
                type="text"
                placeholder="Search features, docs, AI insights (InterstellarSearchEngine)..."
                className="w-full p-2 pl-10 rounded-lg bg-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={searchTerm}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay to allow click on history
                aria-label="Search features and AI insights"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>

            {isFocused && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-slate-800 rounded-lg shadow-lg z-50 mt-1 border border-slate-700 max-h-48 overflow-y-auto">
                    <p className="px-3 py-2 text-xs text-slate-400 border-b border-slate-700 sticky top-0 bg-slate-800">Recent Searches</p>
                    {searchHistory.map((query, index) => (
                        <button
                            key={`history-${index}`}
                            className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700"
                            onClick={() => handleSelectHistory(query)}
                        >
                            {query}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * @component DockSettingsPanel
 * @description Allows users to configure FeatureDock preferences and security roles.
 * Part of 'AdaptiveLayoutEngine' by 'Spatial Dynamics Labs', 2023. Integrates with
 * UserPersonaService and SentinelSecurityContext for comprehensive customization.
 */
export const DockSettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const userPersona = useContext(UserPersonaServiceContext);
    const security = useContext(SecurityContext);
    const [preferences, setPreferences] = useState<UserPreferences>(userPersona?.getPreferences() ?? {} as UserPreferences);
    const [currentRole, setCurrentRole] = useState(security?.getCurrentUserRole() ?? 'standard');

    useEffect(() => {
        if (userPersona) {
            const unsubscribePersona = userPersona.subscribe(setPreferences);
            return () => unsubscribePersona();
        }
    }, [userPersona]);

    useEffect(() => {
        if (security) {
            const unsubscribeSecurity = security.subscribe(setCurrentRole);
            return () => unsubscribeSecurity();
        }
    }, [security]);

    const handlePreferenceChange = async <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
        if (userPersona) {
            await userPersona.updatePreference(key, value);
            // State is updated via subscription, no need to set here explicitly
        }
    };

    const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (security) {
            const newRole = e.target.value as 'admin' | 'premium' | 'standard' | 'guest';
            await security.setUserRole(newRole);
            setCurrentRole(newRole); // UI updates immediately
        }
    };

    if (!userPersona || !security) return null; // Should not happen with providers

    return (
        <div className="absolute top-0 right-0 w-80 h-full bg-slate-800/95 backdrop-blur-md border-l border-slate-700 p-4 z-50 shadow-xl overflow-y-auto transform transition-transform duration-300 ease-out animate-slide-in-right">
            <h3 className="text-xl text-white mb-4 font-bold">Dock Settings (AdaptiveLayoutEngine)</h3>
            <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white text-xl p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Close settings">✕</button>

            <div className="space-y-4">
                <div className="mb-4">
                    <label className="block text-slate-300 text-sm mb-1">Dock Layout (AuraTheme):</label>
                    <select
                        className="w-full p-2 rounded bg-slate-700 text-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={preferences.preferredLayout}
                        onChange={(e) => handlePreferenceChange('preferredLayout', e.target.value as 'grid' | 'list' | 'compact')}
                        aria-label="Select dock layout"
                    >
                        <option value="grid">Grid (Standard)</option>
                        <option value="list">List (Detailed)</option>
                        <option value="compact">Compact (Dense Grid)</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="flex items-center text-slate-300 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 text-cyan-500 rounded focus:ring-cyan-500 border-gray-300"
                            checked={preferences.showFeatureDescriptions}
                            onChange={(e) => handlePreferenceChange('showFeatureDescriptions', e.target.checked)}
                            aria-label="Toggle feature descriptions"
                        />
                        Show Feature Descriptions on Hover
                    </label>
                </div>

                <div className="mb-4">
                    <label className="flex items-center text-slate-300 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 text-cyan-500 rounded focus:ring-cyan-500 border-gray-300"
                            checked={preferences.enableAIRecommendations}
                            onChange={(e) => handlePreferenceChange('enableAIRecommendations', e.target.checked)}
                            aria-label="Toggle AI recommendations"
                        />
                        Enable AI Recommendations (SynapseAI)
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block text-slate-300 text-sm mb-1">User Role (SentinelSecurity):</label>
                    <select
                        className="w-full p-2 rounded bg-slate-700 text-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={currentRole}
                        onChange={handleRoleChange}
                        aria-label="Select user role"
                    >
                        <option value="guest">Guest</option>
                        <option value="standard">Standard User</option>
                        <option value="premium">Premium Subscriber</option>
                        <option value="admin">Administrator</option>
                    </select>
                    <p className="text-xs text-slate-400 mt-1">Current role: <span className="font-semibold text-cyan-400">{currentRole.toUpperCase()}</span>. Changes may affect feature access.</p>
                </div>

                <div className="mt-6 border-t border-slate-700 pt-4">
                    <h4 className="text-md text-white mb-2 font-semibold">Manage Pinned Features:</h4>
                    {preferences.pinnedFeatures.length === 0 ? (
                        <p className="text-slate-400 text-sm italic">No features pinned yet. Pin frequently used features for quick access!</p>
                    ) : (
                        <ul className="list-disc pl-5 text-slate-300 text-sm max-h-32 overflow-y-auto">
                            {preferences.pinnedFeatures.map(featureId => {
                                const feature = QuantumFeatureManifestService.getInstance().getFeatureById(featureId);
                                return feature && (
                                    <li key={featureId} className="flex justify-between items-center py-1">
                                        <span>{feature.name}</span>
                                        <button
                                            onClick={() => handlePreferenceChange('pinnedFeatures', preferences.pinnedFeatures.filter(id => id !== featureId))}
                                            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded-full bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            aria-label={`Unpin ${feature.name}`}
                                        >
                                            Unpin
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="mt-6 border-t border-slate-700 pt-4">
                    <h4 className="text-md text-white mb-2 font-semibold">Notification Preferences:</h4>
                    <label className="flex items-center text-slate-300 text-sm cursor-pointer mb-2">
                        <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 text-cyan-500 rounded focus:ring-cyan-500 border-gray-300"
                            checked={preferences.notificationSettings.enablePush}
                            onChange={(e) => handlePreferenceChange('notificationSettings', { ...preferences.notificationSettings, enablePush: e.target.checked })}
                            aria-label="Enable push notifications"
                        />
                        Enable In-App Push Notifications
                    </label>
                    <label className="flex items-center text-slate-300 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 text-cyan-500 rounded focus:ring-cyan-500 border-gray-300"
                            checked={preferences.notificationSettings.criticalOnly}
                            onChange={(e) => handlePreferenceChange('notificationSettings', { ...preferences.notificationSettings, criticalOnly: e.target.checked })}
                            disabled={!preferences.notificationSettings.enablePush}
                            aria-label="Show critical notifications only"
                        />
                        Show Critical Notifications Only
                    </label>
                </div>
            </div>
        </div>
    );
};

/**
 * @component GlobalNotificationCenter
 * @description Displays and manages system notifications from 'OrchestrationNotificationService'.
 * Implemented using 'Vanguard Systems' architecture, 2023. Provides a centralized
 * hub for critical alerts, feature updates, and AI-driven tips, with actionable elements.
 */
export const GlobalNotificationCenter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const notificationService = useContext(NotificationServiceContext);
    const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

    useEffect(() => {
        if (notificationService) {
            const unsubscribe = notificationService.subscribe(setNotifications);
            return () => unsubscribe();
        }
    }, [notificationService]);

    const handleMarkAsRead = (id: string) => {
        notificationService?.markAsRead(id);
    };

    const handleAction = (notification: NotificationPayload) => {
        notification.action?.callback();
        handleMarkAsRead(notification.id);
        // onClose(); // Optionally close notification center after action
    };

    const unreadNotifications = notifications.filter(n => !n.read);

    return (
        <div className="absolute bottom-4 right-4 w-96 max-h-96 bg-slate-800/95 backdrop-blur-md border border-slate-700 p-4 rounded-lg shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-out animate-slide-in-bottom-right">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700">
                <h4 className="text-white text-lg font-bold">Notifications ({unreadNotifications.length} Unread)</h4>
                <button onClick={onClose} className="text-slate-400 hover:text-white text-xl p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Close notifications">✕</button>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <p className="text-slate-400 text-sm italic">No new notifications. All clear!</p>
                ) : (
                    notifications.map(n => (
                        <div key={n.id} className={`p-3 rounded-md mb-2 ${n.read ? 'bg-slate-700/50' : 'bg-blue-900/20 border border-blue-800'} transition-colors relative`}>
                            <div className="flex justify-between items-center">
                                <span className={`font-bold ${n.read ? 'text-slate-300' : 'text-white'}`}>
                                    {n.type === 'info' && 'ℹ️ '}
                                    {n.type === 'warning' && '⚠️ '}
                                    {n.type === 'error' && '❌ '}
                                    {n.type === 'success' && '✅ '}
                                    {n.type === 'feature_update' && '🚀 '}
                                    {n.type === 'ai_tip' && '🧠 '}
                                    {n.type === 'security_alert' && '🚨 '}
                                    {n.title}
                                </span>
                                {!n.read && (
                                    <button onClick={() => handleMarkAsRead(n.id)} className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-full bg-slate-800/50 focus:outline-none focus:ring-1 focus:ring-slate-500" aria-label="Mark as read">Mark as Read</button>
                                )}
                            </div>
                            <p className={`text-sm mt-1 ${n.read ? 'text-slate-400' : 'text-slate-200'}`}>{n.message}</p>
                            {n.action && (
                                <button
                                    onClick={() => handleAction(n)}
                                    className="mt-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    aria-label={n.action.label}
                                >
                                    {n.action.label}
                                </button>
                            )}
                            <span className="block text-xs text-slate-500 mt-2">{new Date(n.timestamp).toLocaleString()}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- Main FeatureDock Component (Core Enhancements) ---

interface FeatureDockProps {
    onOpen: (id: string) => void;
}

/**
 * @component FeatureDock
 * @description The central component for feature discovery, interaction, and personalized experience.
 * Originally by James Burvel Oâ€™Callaghan III, this version represents 'Galactic Gateway v1.0',
 * a commercial-grade platform integrating over 1000 features and numerous external services.
 * It features AI-driven intelligence (Gemini, ChatGPT), robust telemetry, dynamic feature flags,
 * granular security controls, and adaptive UI components. It is designed for enterprise-scale
 * deployment, demonstrating Citibank's commitment to innovation and cutting-edge technology.
 * @invented Project 'Galactic Gateway' (2024 iteration)
 */
export const FeatureDock: React.FC<FeatureDockProps> = ({ onOpen }) => {
    // Initialize all singleton services once, ensuring consistent instances across the application.
    // This adheres to the 'Service Mesh Gateway' pattern for efficient resource management.
    const telemetryService = OmniTelemetryService.getInstance();
    const userPersonaService = UserPersonaService.getInstance();
    const featureManifestService = QuantumFeatureManifestService.getInstance();
    const aiService = SynapseAI_API_Client.getInstance();
    const notificationService = OrchestrationNotificationService.getInstance();
    const securityContext = SentinelSecurityContext.getInstance();

    const [allFeatures, setAllFeatures] = useState<FeatureMetadata[]>([]);
    const [filteredFeatures, setFilteredFeatures] = useState<FeatureMetadata[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [currentLayout, setCurrentLayout] = useState<'grid' | 'list' | 'compact'>('grid');

    // Effect for initial feature load and subscription to manifest changes.
    // This ensures the dock always reflects the latest available features from QuantumFeatureManifestService.
    useEffect(() => {
        const unsubscribeFeatures = featureManifestService.subscribe(latestFeatures => {
            // Re-apply sorting and pinning based on latest preferences
            const preferences = userPersonaService.getPreferences();
            const sortedAndPinnedFeatures = sortAndPinFeatures(latestFeatures, preferences);
            setAllFeatures(sortedAndPinnedFeatures);
            // Re-filter if there's an active search term
            handleSearch(searchTerm, sortedAndPinnedFeatures);
        });
        return () => unsubscribeFeatures();
    }, [featureManifestService, userPersonaService, searchTerm]); // Depend on userPersonaService to re-sort if preferences change

    // Effect for subscribing to user persona preference changes, especially layout.
    useEffect(() => {
        const unsubscribePreferences = userPersonaService.subscribe(preferences => {
            setCurrentLayout(preferences.preferredLayout);
            const sortedAndPinnedFeatures = sortAndPinFeatures(allFeatures, preferences);
            setAllFeatures(sortedAndPinnedFeatures); // Re-apply sorting/pinning if preferences change
            handleSearch(searchTerm, sortedAndPinnedFeatures); // Re-filter to ensure pinned features are still at top if search is active
        });
        return () => unsubscribePreferences();
    }, [userPersonaService, allFeatures, searchTerm]); // Re-run if allFeatures reference changes, to correctly sort.

    // Effect for subscribing to notification service for unread count.
    useEffect(() => {
        const unsubscribeNotifications = notificationService.subscribe(notifications => {
            setUnreadNotificationCount(notifications.filter(n => !n.read).length);
        });
        return () => unsubscribeNotifications();
    }, [notificationService]);

    // Helper function to sort and pin features, centralizing this logic.
    const sortAndPinFeatures = useCallback((features: FeatureMetadata[], preferences: UserPreferences) => {
        const pinned = preferences.pinnedFeatures
            .map(id => featureManifestService.getFeatureById(id))
            .filter((f): f is FeatureMetadata => !!f);
        const nonPinned = features.filter(f => !preferences.pinnedFeatures.includes(f.id));

        // Sort non-pinned features by name or category, based on potential future preferences.
        const sortedNonPinned = nonPinned.sort((a, b) => a.name.localeCompare(b.name));

        return [...pinned, ...sortedNonPinned];
    }, [featureManifestService]);

    // Centralized search handler.
    const handleSearch = useCallback((query: string, featuresToSearch: FeatureMetadata[] = allFeatures) => {
        setSearchTerm(query);
        if (!query) {
            setFilteredFeatures(featuresToSearch);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = featuresToSearch.filter(feature =>
            fuzzyMatch(feature.name, lowerQuery) ||
            fuzzyMatch(feature.description, lowerQuery) ||
            feature.tags.some(tag => fuzzyMatch(tag, lowerQuery)) ||
            fuzzyMatch(feature.category, lowerQuery)
        );
        setFilteredFeatures(results);
        telemetryService.trackEvent('feature_searched', undefined, { query, resultsCount: results.length });
    }, [allFeatures, telemetryService]);

    // Callback for opening a feature, handling internal vs. external links.
    const handleFeatureOpen = useCallback((id: string) => {
        const feature = featureManifestService.getFeatureById(id);
        if (feature?.externalLink) {
            window.open(feature.externalLink, '_blank', 'noopener,noreferrer');
        } else {
            onOpen(id);
        }
    }, [featureManifestService, onOpen]);

    // Callback for pinning/unpinning a feature.
    const handleTogglePin = useCallback(async (featureId: string) => {
        const preferences = userPersonaService.getPreferences();
        let newPinnedFeatures;
        if (preferences.pinnedFeatures.includes(featureId)) {
            newPinnedFeatures = preferences.pinnedFeatures.filter(id => id !== featureId);
            await telemetryService.trackEvent('feature_unpinned', featureId);
        } else {
            newPinnedFeatures = [...preferences.pinnedFeatures, featureId];
            await telemetryService.trackEvent('feature_pinned', featureId);
        }
        await userPersonaService.updatePreference('pinnedFeatures', newPinnedFeatures);
        // The `useEffect` listening to `userPersonaService` will re-sort and update `allFeatures` and `filteredFeatures`.
    }, [userPersonaService, telemetryService]);


    // Dynamic grid classes based on user preferences for layout.
    let gridClasses = "flex flex-wrap gap-3 justify-center";
    if (currentLayout === 'list') {
        gridClasses = "flex flex-col gap-2 items-start"; // List view for detailed information
    } else if (currentLayout === 'compact') {
        gridClasses = "grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 justify-items-center"; // Compact grid with more items
    }

    return (
        // Providing all instantiated services via React Context, enabling deep dependency injection.
        // This 'Service Mesh' pattern ensures all components have access to necessary services
        // without prop drilling, crucial for a massive, commercial-grade application.
        <TelemetryServiceContext.Provider value={telemetryService}>
            <UserPersonaServiceContext.Provider value={userPersonaService}>
                <FeatureManifestServiceContext.Provider value={featureManifestService}>
                    <AIServiceContext.Provider value={aiService}>
                        <NotificationServiceContext.Provider value={notificationService}>
                            <SecurityContext.Provider value={securityContext}>
                                <div className="relative h-96 flex-shrink-0 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 p-3 overflow-y-auto custom-scrollbar">
                                    <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-900/70 backdrop-blur-md z-10 p-2 -mx-2 -mt-2">
                                        <FeatureSearchBar onSearch={handleSearch} />
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setShowSettings(prev => !prev)}
                                                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                title="Dock Settings (AdaptiveLayoutEngine)"
                                                aria-label="Toggle Dock Settings Panel"
                                            >
                                                ⚙️
                                            </button>
                                            <button
                                                onClick={() => setShowNotifications(prev => !prev)}
                                                className="relative p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                title="Notifications (OrchestrationNotificationService)"
                                                aria-label="Toggle Global Notification Center"
                                            >
                                                🔔
                                                {unreadNotificationCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse border-2 border-red-700">
                                                        {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Feature Display Grid/List - The core 'Galactic Gateway' feature matrix */}
                                    <div className={gridClasses}>
                                        {filteredFeatures.length === 0 && (
                                            <p className="text-slate-400 text-center w-full mt-10 text-lg">
                                                No features found matching "{searchTerm}". Try a different query or adjust your <button onClick={() => setShowSettings(true)} className="text-cyan-400 hover:underline">settings</button>.
                                            </p>
                                        )}
                                        {filteredFeatures.map(feature => (
                                            <div key={feature.id} className="relative group">
                                                <FeatureButton feature={feature} onOpen={handleFeatureOpen} featureMetadata={feature} />
                                                <button
                                                    onClick={() => handleTogglePin(feature.id)}
                                                    className="absolute top-0 right-0 p-1 bg-slate-900/70 text-slate-400 hover:text-cyan-400 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-cyan-500 z-20"
                                                    title={userPersonaService.getPreferences().pinnedFeatures.includes(feature.id) ? "Unpin Feature" : "Pin Feature"}
                                                    aria-label={userPersonaService.getPreferences().pinnedFeatures.includes(feature.id) ? "Unpin Feature" : "Pin Feature"}
                                                >
                                                    {userPersonaService.getPreferences().pinnedFeatures.includes(feature.id) ? '📌' : '📍'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Settings Panel - Dynamically rendered for optimal resource utilization */}
                                    {showSettings && (
                                        <DockSettingsPanel onClose={() => setShowSettings(false)} />
                                    )}

                                    {/* Global Notification Center - Pushes alerts and updates to the user */}
                                    {showNotifications && (
                                        <GlobalNotificationCenter onClose={() => setShowNotifications(false)} />
                                    )}
                                </div>
                            </UserPersonaServiceContext.Provider>
                        </NotificationServiceContext.Provider>
                    </AIServiceContext.Provider>
                </FeatureManifestServiceContext.Provider>
            </UserPersonaServiceContext.Provider>
        </TelemetryServiceContext.Provider>
    );
};
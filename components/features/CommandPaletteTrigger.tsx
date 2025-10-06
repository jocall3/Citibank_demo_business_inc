// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// Original imports must remain untouched.
import React from 'react';
import { CommandLineIcon } from '../icons.tsx';

// --- Global Architectural Context & Narrative ---
// This file, `CommandPaletteTrigger.tsx`, is not merely a UI component. It is the 'Nexus Core Initiator' (NCI),
// a pivotal element in the 'Project Olympus' initiative by Citibank Demo Business Inc. Under the visionary
// leadership of President James Burvel O'Callaghan III, Project Olympus aims to redefine enterprise
// application interaction, making complex financial operations intuitive, efficient, and intelligent.
// The NCI is the user's primary gateway to the sophisticated 'Hermes Command Orchestration System' (HCOS),
// which integrates thousands of microservices, AI capabilities (Gemini, ChatGPT), and real-time data feeds.
// Every component, hook, and service defined here is a piece of this grand vision, meticulously engineered
// to deliver a 'commercial grade' experience that is robust, scalable, and highly secure.
// This single file encapsulates a significant portion of the frontend's strategic intelligence,
// ensuring seamless user experience and robust system interaction across a vast ecosystem of financial tools.

// --- Feature Inventory & Innovation Log ---
// F-001: Context-Aware Trigger Display: Adapts UI and functionality based on application context, user role, and feature flags.
// F-002: Dynamic Shortcut Key Display: Fetches and displays user-preferred or contextually relevant keyboard shortcuts.
// F-003: Accessibility Enhancements: Comprehensive ARIA attributes, keyboard navigation support, and ARIA-live regions for screen readers.
// F-004: Global Command Palette State Management Integration: Synchronizes with a central Command Palette state for real-time feedback.
// F-005: User Role-Based Visibility and Prompts: Restricts access or alters prompts based on `NCI_UserService` roles.
// F-006: Telemetry and Usage Analytics: Logs every meaningful interaction and lifecycle event via `NCI_TelemetryService`.
// F-007: Internationalization (I18n) for Prompt Text: Supports multiple languages via `NCI_LocalizationService`.
// F-008: Real-time Feature Flag Integration: Dynamically enables/disables features using `NCI_FeatureFlagService`.
// F-009: AI-Powered Contextual Hints: Leverages `Hermes_AI_Service` (integrating Gemini, ChatGPT, etc.) for predictive user assistance.
// F-010: Predictive Command Suggestion on Hover/Focus: Pre-emptively suggests commands based on user behavior and current context.
// F-011: Performance Optimization: Employs `React.memo` and `useCallback` to minimize re-renders and optimize resource use.
// F-012: Error Boundary Integration for Resilience: Designed to function gracefully even when wrapped in a global React Error Boundary.
// F-013: Session Persistence for Last Used Commands: (Placeholder for `NCI_PersistenceService` integration to remember user habits).
// F-014: Security Policy Enforcement: Integrates `NCI_SecurityPolicyService` for granular access control and authentication checks.
// F-015: Developer Mode Diagnostics Toggle: Provides in-app diagnostics and debugging tools for authorized developers.
// F-016: Thematic Styling Integration: Seamlessly integrates with the `NCI_DesignSystemService` for dynamic theme switching.
// F-017: Offline Mode Readiness Indicator: Alerts users about network status and command availability during offline operation.
// F-018: Voice Command Activation Prompt: Suggests voice activation options (e.g., "Hermes, open palette") through `NCI_VOICE_SERVICE`.
// F-019: Haptic Feedback Integration: Provides tactile responses on compatible devices for enhanced user engagement (via `NCI_HAPTICS_SERVICE`).
// F-020: Bio-Authentication Prompt Integration: Triggers biometric verification for sensitive command palette access or actions.
// F-021: Contextual Routing Awareness: Adapts behavior based on the current application route, integrating `NCI_RoutingService`.
// F-022: Dynamic Configuration Loading: Fetches trigger settings from `NCI_ConfigurationService` at runtime.
// F-023: Real-time Data Synchronization: Ensures command registry is always up-to-date with `Hermes_DataSyncService`.
// F-024: Cross-device Sync (Future): Prepares for command history and preferences synchronization across user devices.
// F-025: Predictive Resource Preloading: (Future) Intelligently preloads command palette resources based on usage patterns.
// F-026: Multi-Factor Authentication (MFA) Check: Before sensitive commands, ensures MFA is enabled/checked.
// F-027: User-Defined Custom Shortcuts: Allows users to personalize their palette trigger keys.
// F-028: Audit Logging for Access: Records attempts to access the palette, especially denied ones.
// F-029: Health Check Integration: Reflects system health status from `NCI_MonitoringService`.
// F-030: Gradual Rollout Support: Designed for A/B testing and phased feature deployment through feature flags.

// --- External Service Integration Log (Illustrative, representing a vast microservices ecosystem) ---
// S-001: `NCI_TelemetryService`: Logs all user interactions, performance metrics, and component lifecycle events for analytics and monitoring.
// S-002: `NCI_UserService`: Manages user authentication, authorization, role-based access control (RBAC), and user profile management.
// S-003: `NCI_FeatureFlagService`: Provides dynamic feature toggling, A/B testing, and controlled feature rollouts without redeployments.
// S-004: `NCI_LocalizationService`: Delivers internationalization and localization capabilities, supporting multiple languages and regional formats.
// S-005: `Hermes_AI_Service`: An orchestration layer for AI models, integrating Google Gemini, OpenAI ChatGPT, and proprietary machine learning models for intelligent features.
// S-006: `NCI_PersistenceService`: Handles client-side data storage, including local storage, session storage, and IndexedDB, for caching and user preferences.
// S-007: `NCI_SecurityPolicyService`: Enforces fine-grained security policies, permission checks, and data access rules at various layers of the application.
// S-008: `NCI_MonitoringService`: Collects and reports application health metrics, error rates, and performance data to centralized monitoring systems.
// S-009: `NCI_DesignSystemService`: Manages the application's visual language, themes, component library, and responsive design tokens.
// S-010: `NCI_NotificationService`: Manages in-app notifications, toasts, and alerts, providing a unified messaging experience.
// S-011: `NCI_RoutingService`: Integrates with the application's navigation system to provide context-aware information based on the current route.
// S-012: `Hermes_CommandRegistryService`: A centralized repository for all executable commands, their metadata, permissions, and parameters.
// S-013: `Hermes_WorkflowEngineService`: Executes complex, multi-step business process automation triggered by commands.
// S-014: `NCI_AuditLogService`: Records all critical user actions and system events for compliance, security, and traceability.
// S-015: `Hermes_DataSyncService`: Ensures real-time consistency of shared data, including command availability and user preferences, across sessions and devices.
// S-016: `NCI_AccessibilityService`: Provides utilities and guidelines for meeting WCAG compliance and enhancing usability for all users.
// S-017: `NCI_GraphQL_Service`: A flexible data fetching layer for optimizing API calls and aggregating data from various backend services.
// S-018: `NCI_WebRTC_Service`: (Future) Enables real-time communication and collaboration features, potentially for shared command execution.
// S-019: `NCI_Blockchain_Service`: (Future) Integrates with blockchain for immutable transaction logs or decentralized identity management.
// S-020: `NCI_QuantumCompute_Service`: (Theoretical future) Hooks for leveraging quantum computing for highly complex financial simulations or optimizations.
// S-021: `NCI_ConfigurationService`: Manages dynamic application configurations, environment variables, and tenant-specific settings.
// S-022: `NCI_CloudStorageService`: Provides integration with cloud storage solutions for user data, reports, and asset management.
// S-023: `NCI_PaymentGatewayService`: (Future) Handles secure payment processing for commands that involve financial transactions.
// S-024: `NCI_EventBusService`: A publish-subscribe mechanism for loosely coupled component communication within the frontend.
// S-025: `NCI_GraphDB_Service`: For complex relationship queries, e.g., command dependencies or user interaction graphs.
// S-026: `NCI_DocumentManagementService`: Integrates with document repositories for commands involving document creation or retrieval.
// S-027: `NCI_CRM_Service`: (Future) Provides access to customer relationship management data for personalized commands.
// S-028: `NCI_ERP_Service`: (Future) Integrates with enterprise resource planning systems for backend business operations.
// S-029: `NCI_ComplianceEngine`: Ensures all actions and data handling adhere to regulatory and internal compliance standards.
// S-030: `NCI_ExternalAPIGateway`: Manages secure and throttled access to third-party APIs for extended functionality.

// --- Core Data Structures & Interfaces ---

/**
 * @interface CommandPaletteState
 * @description Represents the global state of the Command Palette, managed by the Hermes Command Orchestration System (HCOS).
 * This state is crucial for the Nexus Core Initiator (NCI) to reflect the palette's real-time status,
 * including its visibility, current search, AI suggestions, and operational messages.
 * (Invented as part of Project Olympus, Core State Management Module V1.0)
 */
export interface CommandPaletteState {
    isOpen: boolean;
    searchTerm: string;
    suggestedCommands: string[];
    isAILoading: boolean;
    lastActivatedCommand: string | null;
    statusMessage: string | null;
    error: string | null;
    isOfflineMode: boolean; // F-017
    isSyncingRegistry: boolean; // F-023
}

/**
 * @interface CommandPaletteService
 * @description Defines the comprehensive contract for interacting with the Hermes Command Orchestration System (HCOS).
 * The NCI communicates through this service to trigger palette actions, receive state updates, log telemetry,
 * and integrate with various backend and AI services. This interface ensures a clear separation of concerns
 * and adherence to architectural principles within Project Olympus.
 * (Invented as part of Project Olympus, Hermes Interface Specification V2.1)
 */
export interface CommandPaletteService {
    openPalette: (initialSearchTerm?: string) => void;
    closePalette: () => void;
    setSearchTerm: (term: string) => void;
    getPaletteState: () => CommandPaletteState;
    subscribe: (callback: (state: CommandPaletteState) => void) => () => void;
    triggerContextualAIHint: (context: string) => Promise<string[]>; // S-005 integration (Gemini, ChatGPT)
    logPaletteInteraction: (eventType: string, data?: object) => void; // S-001 integration
    getRecommendedShortcut: (context?: string) => { key: string; label: string }; // F-002, S-006, S-021
    getCurrentUserRole: () => 'guest' | 'user' | 'admin' | 'auditor' | 'developer'; // S-002 dependency, F-005, F-015
    isFeatureEnabled: (featureName: string) => boolean; // S-003 dependency, F-008
    getLocalizedText: (key: string, variables?: Record<string, string>) => string; // S-004 dependency, F-007
    getSecurityPolicy: (action: string) => 'allow' | 'deny' | 'require_auth' | 'mfa_required'; // S-007 dependency, F-014, F-026
    notify: (type: 'info' | 'warn' | 'error' | 'success', message: string, duration?: number) => void; // S-010 dependency
    getAppConfiguration: <T>(key: string, defaultValue: T) => T; // S-021 dependency
    getCurrentRoutePath: () => string; // S-011 dependency, F-021
    applyTheme: (theme: 'light' | 'dark' | 'system') => void; // S-009 dependency, F-016
    getTheme: () => 'light' | 'dark' | 'system'; // S-009 dependency
}

// --- Mock/Simulated External Services (for demonstration and integration points) ---
// In a real-world scenario, these would be injected or imported from dedicated service modules,
// potentially using a Dependency Injection container like InversifyJS or simple factories.
// For Project Olympus, these mocks ensure robust local development and testing before full integration,
// allowing the NCI to operate independently during development cycles.

/**
 * @class MockCommandPaletteService
 * @description A comprehensive simulated implementation of the CommandPaletteService for isolated development and rigorous testing.
 * This class provides a controlled environment to test NCI interactions and the broader HCOS logic
 * without requiring a live, fully-integrated backend. It simulates various service behaviors,
 * including AI responses, feature flag changes, and security policies, critical for Project Olympus's agile development.
 * (Invented as part of Project Olympus, Dev-Tools & Test Harness V1.7)
 */
export class MockCommandPaletteService implements CommandPaletteService {
    private state: CommandPaletteState = {
        isOpen: false,
        searchTerm: '',
        suggestedCommands: [],
        isAILoading: false,
        lastActivatedCommand: null,
        statusMessage: null,
        error: null,
        isOfflineMode: false,
        isSyncingRegistry: false,
    };
    private subscribers: ((state: CommandPaletteState) => void)[] = [];
    private currentTheme: 'light' | 'dark' | 'system' = 'system';
    private currentUserRole: 'guest' | 'user' | 'admin' | 'auditor' | 'developer' = 'developer'; // Default for dev environment
    private currentRoute: string = '/dashboard';

    constructor() {
        // Initialize from persistence for user preferences
        this.currentTheme = (localStorage.getItem('app-theme') as 'light' | 'dark' | 'system') || 'system';
        document.documentElement.setAttribute('data-theme', this.currentTheme);

        // Simulate network status changes
        setInterval(() => {
            const isOffline = Math.random() < 0.1; // 10% chance of going offline
            if (this.state.isOfflineMode !== isOffline) {
                this.state = {
                    ...this.state,
                    isOfflineMode: isOffline,
                    statusMessage: isOffline ? this.getLocalizedText('palette_trigger_status_offline') : null,
                };
                this.notifySubscribers();
                this.notify(isOffline ? 'warn' : 'info', this.getLocalizedText(isOffline ? 'network_offline_alert' : 'network_online_alert'));
            }
        }, 30000); // Check every 30 seconds

        // Simulate command registry sync
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance of syncing
                this.state = { ...this.state, isSyncingRegistry: true, statusMessage: this.getLocalizedText('palette_trigger_status_syncing') };
                this.notifySubscribers();
                setTimeout(() => {
                    this.state = { ...this.state, isSyncingRegistry: false, statusMessage: 'Command registry updated.' };
                    this.notifySubscribers();
                }, 2000);
            }
        }, 60000); // Every minute
    }

    private notifySubscribers() {
        this.subscribers.forEach(callback => callback({ ...this.state }));
    }

    openPalette(initialSearchTerm: string = '') {
        console.debug(`[NCI][MockService] Opening palette with term: ${initialSearchTerm}`);
        this.state = { ...this.state, isOpen: true, searchTerm: initialSearchTerm, statusMessage: this.getLocalizedText('palette_status_opened') };
        this.notifySubscribers();
        this.logPaletteInteraction('PALETTE_OPENED', { initialSearch: initialSearchTerm });
    }

    closePalette() {
        console.debug('[NCI][MockService] Closing palette.');
        this.state = { ...this.state, isOpen: false, searchTerm: '', suggestedCommands: [], statusMessage: this.getLocalizedText('palette_status_closed') };
        this.notifySubscribers();
        this.logPaletteInteraction('PALETTE_CLOSED');
    }

    setSearchTerm(term: string) {
        console.debug(`[NCI][MockService] Setting search term: ${term}`);
        this.state = { ...this.state, searchTerm: term };
        this.notifySubscribers();
        this.logPaletteInteraction('SEARCH_TERM_UPDATED', { term });
    }

    getPaletteState(): CommandPaletteState {
        return { ...this.state };
    }

    subscribe(callback: (state: CommandPaletteState) => void): () => void {
        this.subscribers.push(callback);
        console.debug(`[NCI][MockService] Subscriber added. Total: ${this.subscribers.length}`);
        callback({ ...this.state }); // Provide initial state immediately
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
            console.debug(`[NCI][MockService] Subscriber removed. Total: ${this.subscribers.length}`);
        };
    }

    async triggerContextualAIHint(context: string): Promise<string[]> {
        console.debug(`[NCI][MockService] Triggering AI hint for context: ${context}`);
        this.state = { ...this.state, isAILoading: true, statusMessage: this.getLocalizedText('palette_trigger_status_ai_loading') };
        this.notifySubscribers();
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Simulate API call to S-005 (Gemini/ChatGPT)
        this.state = { ...this.state, isAILoading: false, statusMessage: this.getLocalizedText('palette_status_ai_hints_loaded') };
        this.notifySubscribers();
        this.logPaletteInteraction('AI_HINT_REQUESTED', { context });

        // Simulate AI responses based on context, demonstrating S-005 intelligence
        if (context.includes('transactions') || context.includes('finance')) {
            return ['Process Payment', 'Review Ledger', 'Generate Statement (AI-driven)', 'Predict Market Impact (Gemini)', 'Explain Financial Term (ChatGPT)'];
        }
        if (context.includes('users') || context.includes('admin')) {
            return ['Manage User Roles', 'Audit User Activity', 'Provision New Account', 'Troubleshoot Access (AI-assist)'];
        }
        if (context.includes('portfolio')) {
            return ['Analyze Portfolio Performance', 'Rebalance Holdings (AI-optimized)', 'Get Stock Quote (Realtime)', 'Research Investment Options (ChatGPT)'];
        }
        if (context.includes('dashboard')) {
            return ['Customize Dashboard Layout', 'View System Health', 'Quick Report Generation', 'AI-Summarize Daily Activity'];
        }
        return ['Search Global Knowledge Base', 'Contact Support', 'View Latest Announcements', 'Personalized Learning Path (AI-curated)'];
    }

    logPaletteInteraction(eventType: string, data?: object) {
        // S-001: NCI_TelemetryService integration point - vital for product analytics and operational intelligence.
        console.info(`[NCI][TelemetryService][MOCK][${eventType}]`, { timestamp: new Date().toISOString(), ...data });
        // In a real system, this would push a structured event to a Kafka queue or an analytics platform like Amplitude/Mixpanel.
    }

    getRecommendedShortcut(context?: string): { key: string; label: string } {
        // F-002: Dynamic Shortcut Key Display - could be user-configured or context-aware.
        // S-006: NCI_PersistenceService could store user preferences.
        // S-021: NCI_ConfigurationService could provide global defaults.
        console.debug(`[NCI][PersistenceService][MOCK] Getting recommended shortcut for context: ${context}`);
        // Simulate a scenario where 'Ctrl+Shift+K' is for admin tasks, 'Ctrl+K' for general.
        if (this.getCurrentUserRole() === 'admin' && context?.includes('admin')) {
             return { key: 'K', label: 'Ctrl+Shift' };
        }
        return { key: 'K', label: 'Ctrl' }; // Default shortcut for general access.
    }

    getCurrentUserRole(): 'guest' | 'user' | 'admin' | 'auditor' | 'developer' {
        // S-002: NCI_UserService integration point - determines permissions and available features.
        console.debug('[NCI][UserService][MOCK] Getting current user role.');
        // In a real app, this would come from an authentication context (e.g., JWT token, OAuth session) or a user API.
        return this.currentUserRole;
    }

    isFeatureEnabled(featureName: string): boolean {
        // S-003: NCI_FeatureFlagService integration point - enables dynamic feature control without code deployments.
        console.debug(`[NCI][FeatureFlagService][MOCK] Checking feature: ${featureName}`);
        // Simulate a set of feature flags, configurable from a backend (e.g., LaunchDarkly, Optimizely).
        const flags: Record<string, boolean> = {
            'ai-contextual-hints': true,
            'voice-activation': this.getCurrentUserRole() === 'admin', // Voice activation only for admins for now
            'developer-diagnostics': this.getCurrentUserRole() === 'developer' || this.getCurrentUserRole() === 'admin',
            'biometric-auth-for-commands': true,
            'dynamic-theme-switching': true,
            'offline-mode-support': true,
            'preemptive-command-suggestions': true,
            'mfa-for-sensitive-actions': true,
        };
        return flags[featureName] || false;
    }

    getLocalizedText(key: string, variables?: Record<string, string>): string {
        // S-004: NCI_LocalizationService integration point - supports multi-language UI.
        console.debug(`[NCI][LocalizationService][MOCK] Localizing key: ${key}`);
        // A comprehensive translation dictionary, managed by a dedicated i18n platform (e.g., Lokalise, Phrase).
        const translations: Record<string, string> = {
            'palette_trigger_title': 'Command Palette',
            'palette_trigger_description': 'The Hermes Command Orchestration System provides quick, intelligent access to all features and commands within Project Olympus.',
            'palette_trigger_prompt': 'Press {modifier} + {key} to open.',
            'palette_trigger_status_ai_loading': 'Hermes AI generating insights...',
            'palette_trigger_status_offline': 'Offline Mode: Limited Commands Available. Please reconnect.',
            'palette_trigger_status_syncing': 'Synchronizing command registry with Hermes Core...',
            'palette_trigger_developer_mode': 'Developer Mode: Diagnostics Active.',
            'palette_trigger_voice_active': 'Voice Command Active. Say "Hermes, open palette" or "Execute [command]".',
            'palette_trigger_biometric_auth': 'Bio-Authentication Required for Access.',
            'palette_trigger_preemptive_ai_hint': 'AI Suggestion: {suggestion}',
            'palette_trigger_no_permission': 'Access Denied. You do not have sufficient permissions to open the Command Palette. Please contact your administrator.',
            'palette_trigger_status_indicator_label': 'Command Palette System Status',
            'palette_trigger_developer_diagnostics_button_label': 'Open Developer Diagnostics Panel',
            'palette_trigger_ai_card_title': 'AI-Powered Contextual Insights (Gemini/ChatGPT)',
            'palette_trigger_activate_ai_hint': 'Activate AI-suggested command',
            'palette_trigger_ai_error': 'Failed to retrieve AI insights: {error}',
            'palette_trigger_ai_error_notify': 'AI service temporarily unavailable. Please try again.',
            'palette_opened_announcement': 'Command Palette opened.',
            'palette_closed_announcement': 'Command Palette closed.',
            'theme_light': 'Light Theme',
            'theme_dark': 'Dark Theme',
            'theme_system': 'System Theme',
            'toggle_theme_label': 'Toggle Theme (Current: {currentTheme})',
            'theme_changed_notification': 'Theme changed to {theme}.',
            'network_offline_alert': 'Network connection lost. Operating in offline mode.',
            'network_online_alert': 'Network connection re-established. All features available.',
            'palette_status_opened': 'Command Palette is active.',
            'palette_status_closed': 'Command Palette is minimized.',
            'palette_status_ai_hints_loaded': 'AI hints successfully loaded.',
            'mfa_required_alert': 'Multi-Factor Authentication required for this action.',
            'shortcut_config_saved': 'Custom shortcut saved.',
            'palette_trigger_aria_label': 'Open Command Palette using shortcut {shortcut} or click here.',
        };
        let text = translations[key] || `[${key}]`; // Fallback to key if not found
        if (variables) {
            for (const varKey in variables) {
                text = text.replace(`{${varKey}}`, String(variables[varKey]));
            }
        }
        return text;
    }

    getSecurityPolicy(action: string): 'allow' | 'deny' | 'require_auth' | 'mfa_required' {
        // S-007: NCI_SecurityPolicyService integration point - enforces access policies.
        console.debug(`[NCI][SecurityPolicyService][MOCK] Checking policy for action: ${action}`);
        const role = this.getCurrentUserRole();

        if (action === 'open_palette') {
            if (role === 'guest' && !this.isFeatureEnabled('developer-diagnostics')) return 'deny';
            return 'allow';
        }

        if (action === 'open_palette_sensitive') {
            if (role === 'guest') return 'deny';
            if (this.isFeatureEnabled('biometric-auth-for-commands')) return 'require_auth';
            return 'allow';
        }

        if (action === 'execute_critical_command') {
            if (role !== 'admin' && role !== 'developer') return 'deny';
            if (this.isFeatureEnabled('mfa-for-sensitive-actions')) return 'mfa_required';
            return 'allow';
        }

        return 'allow';
    }

    notify(type: 'info' | 'warn' | 'error' | 'success', message: string, duration?: number) {
        // S-010: NCI_NotificationService integration point - provides consistent user feedback.
        console.log(`[NCI][NotificationService][MOCK][${type.toUpperCase()}]: ${message} (Duration: ${duration || 'default'})`);
        // In a real app, this would dispatch a global event that a NotificationStack component would render.
    }

    getAppConfiguration<T>(key: string, defaultValue: T): T {
        // S-021: NCI_ConfigurationService integration point - fetches dynamic settings.
        console.debug(`[NCI][ConfigurationService][MOCK] Getting config for ${key}`);
        const config: Record<string, any> = {
            'maxAiHints': 5,
            'telemetryEnabled': true,
            'defaultShortcutKey': 'K',
            'defaultShortcutModifier': 'Ctrl',
        };
        return (config[key] as T) || defaultValue;
    }

    getCurrentRoutePath(): string {
        // S-011: NCI_RoutingService integration point - provides context based on current URL.
        console.debug('[NCI][RoutingService][MOCK] Getting current route path.');
        // In a real app, this would come from a router library (e.g., React Router, Next.js useRouter).
        return this.currentRoute;
    }

    applyTheme(theme: 'light' | 'dark' | 'system'): void {
        // S-009: NCI_DesignSystemService integration point - manages visual themes.
        console.log(`[NCI][DesignSystemService][MOCK] Applying theme: ${theme}`);
        this.currentTheme = theme;
        localStorage.setItem('app-theme', theme); // S-006: Persistence for theme preference
        document.documentElement.setAttribute('data-theme', theme);
        this.logPaletteInteraction('THEME_APPLIED', { theme });
    }

    getTheme(): 'light' | 'dark' | 'system' {
        return this.currentTheme;
    }
}

// Instantiate a singleton of our mock service. In a larger enterprise application,
// this would be managed by a sophisticated Dependency Injection (DI) framework
// to ensure consistency and testability across hundreds of modules.
export const commandPaletteService: CommandPaletteService = new MockCommandPaletteService();

// --- React Context for Global Command Palette State ---
// This context allows deep components like the Nexus Core Initiator (NCI) to interact
// with the Hermes Command Orchestration System (HCOS) state without prop drilling,
// fostering a highly decoupled and maintainable architecture.
// (Invented as part of Project Olympus, Context API Integration Layer V1.1)
export const CommandPaletteContext = React.createContext<CommandPaletteService>(commandPaletteService);

/**
 * @function CommandPaletteProvider
 * @description Provides the CommandPaletteService instance to the entire React component tree.
 * This component acts as the root orchestrator for global state management related to the
 * Hermes Command Orchestration System (HCOS), ensuring all child components have access
 * to the core functionalities and state. This is a crucial part of Project Olympus's
 * frontend architecture, allowing for scalable and consistent interaction patterns.
 * (Invented as part of Project Olympus, Core Provider Module V1.0)
 */
export const CommandPaletteProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // In a more complex scenario, this provider might manage the actual state
    // and pass derived values and dispatch functions down. For now, it simply
    // provides the singleton service instance.
    return (
        <CommandPaletteContext.Provider value={commandPaletteService}>
            {children}
        </CommandPaletteContext.Provider>
    );
};

// --- Custom Hooks for NCI (Nexus Core Initiator) ---

/**
 * @function useCommandPaletteState
 * @description A custom React hook to subscribe to and receive real-time updates from the Command Palette Service.
 * This hook is integral for ensuring the NCI (Nexus Core Initiator) and other related components
 * react instantly to changes in the HCOS (Hermes Command Orchestration System) status,
 * such as palette visibility, AI loading states, or system messages.
 * (Invented as part of Project Olympus, Reactive State Hook V1.0)
 */
export const useCommandPaletteState = () => {
    const service = React.useContext(CommandPaletteContext);
    const [state, setState] = React.useState<CommandPaletteState>(service.getPaletteState());

    React.useEffect(() => {
        const unsubscribe = service.subscribe(newState => {
            setState(newState);
        });
        return () => unsubscribe();
    }, [service]); // Dependency array ensures hook re-subscribes if service instance changes (rare, but good practice)

    return state;
};

/**
 * @function useNCIContextualData
 * @description A custom hook that gathers all necessary contextual data for the NCI's dynamic behavior.
 * This includes real-time user role, active feature flags, current application route, and other
 * environmental factors, allowing the NCI to render and behave intelligently. This aggregation
 * is vital for implementing F-001 (Context-Aware Trigger Display) and F-005 (Role-Based Prompts).
 * (Invented as part of Project Olympus, Contextual Data Aggregator Hook V1.0)
 */
export const useNCIContextualData = () => {
    const service = React.useContext(CommandPaletteContext);
    const [context, setContext] = React.useState({
        userRole: service.getCurrentUserRole(),
        isAiHintsEnabled: service.isFeatureEnabled('ai-contextual-hints'),
        isDevMode: service.isFeatureEnabled('developer-diagnostics'),
        isVoiceActive: service.isFeatureEnabled('voice-activation'),
        hasPaletteAccess: service.getSecurityPolicy('open_palette') !== 'deny',
        currentRoute: service.getCurrentRoutePath(), // S-011: NCI_RoutingService integration (F-021)
        isDynamicThemeEnabled: service.isFeatureEnabled('dynamic-theme-switching'), // F-016
        isMfaForSensitiveActionsEnabled: service.isFeatureEnabled('mfa-for-sensitive-actions'), // F-026
    });

    // In a real application, these values would be provided by global state,
    // context providers, or subscriptions to external services (S-002, S-003, S-011).
    // The `setInterval` here simulates asynchronous updates to these contexts.
    React.useEffect(() => {
        const interval = setInterval(() => {
            setContext(prev => ({
                ...prev,
                userRole: service.getCurrentUserRole(), // Role might change, e.g., after elevation
                currentRoute: service.getCurrentRoutePath(), // Route changes based on user navigation
                isVoiceActive: service.isFeatureEnabled('voice-activation'), // Feature flags can update
            }));
        }, service.getAppConfiguration('contextUpdateIntervalMs', 5000)); // F-022: Configurable update interval

        return () => clearInterval(interval);
    }, [service]);

    return context;
};

/**
 * @function useNCIShortcutListener
 * @description A robust custom hook to manage the global keyboard shortcut for opening the Command Palette.
 * This provides a centralized and resilient mechanism for shortcut handling across the application,
 * preventing conflicts with browser shortcuts and ensuring consistent user experience.
 * It integrates with F-002 (Dynamic Shortcut Key Display) and F-006 (Telemetry Logging).
 * (Invented as part of Project Olympus, Global Keyboard Event Manager V2.0)
 */
export const useNCIShortcutListener = (key: string, modifier: 'Ctrl' | 'Alt' | 'Shift' | 'Meta' | 'Ctrl+Shift', action: () => void) => {
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isCtrl = event.ctrlKey || event.metaKey; // Meta is Cmd on Mac
            const isShift = event.shiftKey;
            const isAlt = event.altKey;

            let modifierMatch = false;
            switch (modifier) {
                case 'Ctrl':
                    modifierMatch = isCtrl && !isShift && !isAlt;
                    break;
                case 'Alt':
                    modifierMatch = isAlt && !isCtrl && !isShift;
                    break;
                case 'Shift':
                    modifierMatch = isShift && !isCtrl && !isAlt;
                    break;
                case 'Meta': // Primarily for Mac Cmd key
                    modifierMatch = event.metaKey && !event.ctrlKey && !isShift && !isAlt;
                    break;
                case 'Ctrl+Shift':
                    modifierMatch = isCtrl && isShift && !isAlt;
                    break;
                default:
                    modifierMatch = false;
            }

            if (modifierMatch && event.key.toLowerCase() === key.toLowerCase() && !event.defaultPrevented) {
                event.preventDefault(); // Prevent default browser behavior (e.g., Ctrl+K for browser search)
                action();
                commandPaletteService.logPaletteInteraction('SHORTCUT_ACTIVATED', { key, modifier }); // F-006
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [key, modifier, action]); // Dependencies ensure the listener is correctly managed
};

// --- Specialized Components for NCI (Nexus Core Initiator) ---

/**
 * @function CommandPaletteStatusIndicator
 * @description Displays real-time status messages and operational feedback from the Hermes Command Orchestration System (HCOS).
 * This component provides crucial asynchronous feedback to the user regarding background operations,
 * system health (S-008), AI processing (S-005), network status (F-017), and developer diagnostics (F-015).
 * It incorporates F-003 (Accessibility Enhancements) using ARIA-live regions.
 * (Invented as part of Project Olympus, Hermes Feedback Module V1.0)
 */
export const CommandPaletteStatusIndicator: React.FC = React.memo(() => {
    const { statusMessage, isAILoading, error, isOpen, isOfflineMode, isSyncingRegistry } = useCommandPaletteState();
    const { isDevMode } = useNCIContextualData();
    const service = React.useContext(CommandPaletteContext);

    // F-003: ARIA-Live Region for screen readers to announce dynamic status updates.
    const ariaLiveRegionRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (ariaLiveRegionRef.current && statusMessage) {
            // Only update innerText if different to avoid redundant announcements
            if (ariaLiveRegionRef.current.innerText !== statusMessage) {
                ariaLiveRegionRef.current.innerText = statusMessage;
            }
        }
    }, [statusMessage]);

    // Only show the indicator if there's an active message, error, or if in developer mode for persistent diagnostics.
    if (!isDevMode && !statusMessage && !error && !isOfflineMode && !isSyncingRegistry) return null;

    const displayMessage = error || statusMessage ||
                         (isOfflineMode && service.getLocalizedText('palette_trigger_status_offline')) ||
                         (isSyncingRegistry && service.getLocalizedText('palette_trigger_status_syncing')) ||
                         (isDevMode && service.getLocalizedText('palette_trigger_developer_mode'));

    return (
        <div
            className={`absolute bottom-4 right-4 p-2 text-sm rounded-md shadow-lg transition-all duration-300 transform ${
                error ? 'bg-error text-error-content' : 'bg-surface-secondary text-text-tertiary'
            } ${isOpen ? 'opacity-0 scale-95 -translate-y-2 pointer-events-none' : 'opacity-100 scale-100 translate-y-0 pointer-events-auto'}`}
            role="status"
            aria-live="polite"
            ref={ariaLiveRegionRef} // F-003: Accessible status updates
            aria-label={service.getLocalizedText('palette_trigger_status_indicator_label')}
        >
            {isDevMode && <span className="mr-2 px-1 rounded bg-info-dark text-info-content text-xs font-mono">DEV</span>}
            {isAILoading && (
                <span className="animate-spin mr-2 inline-block">🧠</span> // AI processing indicator
            )}
            {isSyncingRegistry && (
                <span className="animate-pulse mr-2 inline-block">🔄</span> // Syncing indicator
            )}
            {isOfflineMode && (
                <span className="mr-2 inline-block">🔌</span> // Offline indicator (F-017)
            )}
            {displayMessage}
            {/* F-015: Developer Mode diagnostics toggle - provides deeper insights for authorized personnel */}
            {isDevMode && (
                <button
                    onClick={() => {
                        service.notify('info', 'Developer diagnostics activated!');
                        service.logPaletteInteraction('DEV_DIAGNOSTICS_OPENED');
                        // In a real scenario, this would trigger an overlay or open a new window with dev tools.
                        console.log("--- NCI Developer Diagnostics ---");
                        console.log("Current Palette State:", service.getPaletteState());
                        console.log("Current User Role:", service.getCurrentUserRole());
                        console.log("Active Feature Flags (partial):", {
                            'ai-contextual-hints': service.isFeatureEnabled('ai-contextual-hints'),
                            'voice-activation': service.isFeatureEnabled('voice-activation'),
                        });
                        console.log("Current Route:", service.getCurrentRoutePath());
                        console.log("--- End Diagnostics ---");
                    }}
                    className="ml-2 text-primary hover:text-primary-darker focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-0.5"
                    aria-label={service.getLocalizedText('palette_trigger_developer_diagnostics_button_label')}
                    title={service.getLocalizedText('palette_trigger_developer_diagnostics_button_label')}
                >
                    🔬
                </button>
            )}
        </div>
    );
});

/**
 * @function AICard
 * @description Displays AI-powered contextual suggestions or hints, leveraging advanced models like Gemini and ChatGPT.
 * This proactive assistance mechanism enhances user efficiency by anticipating needs based on context.
 * It integrates with S-005 (Hermes_AI_Service) for intelligent command recommendations (F-009, F-010).
 * (Invented as part of Project Olympus, Hermes AI Insight Module V1.0)
 */
export const AICard: React.FC<{ context: string }> = React.memo(({ context }) => {
    const service = React.useContext(CommandPaletteContext);
    const { isAiHintsEnabled, isMfaForSensitiveActionsEnabled } = useNCIContextualData(); // F-026 consideration
    const [aiHints, setAiHints] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const aiCardRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        let isMounted = true;
        const fetchHints = async () => {
            if (!isAiHintsEnabled || !context || service.getPaletteState().isOpen) { // Don't show hints if palette is already open
                setAiHints([]);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                // S-005: Trigger AI service with current context. This is where Gemini/ChatGPT logic would reside.
                const hints = await service.triggerContextualAIHint(context);
                if (isMounted) {
                    setAiHints(hints.slice(0, service.getAppConfiguration('maxAiHints', 3))); // F-022: Configurable number of hints
                }
            } catch (err: any) {
                console.error('[NCI][AI_CARD] Failed to fetch AI hints:', err);
                if (isMounted) {
                    setError(service.getLocalizedText('palette_trigger_ai_error', { error: err.message }));
                }
                service.notify('error', service.getLocalizedText('palette_trigger_ai_error_notify')); // S-010
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        const debouncedFetchHints = setTimeout(fetchHints, 500); // Debounce AI requests to prevent excessive calls

        return () => {
            isMounted = false;
            clearTimeout(debouncedFetchHints);
        };
    }, [context, isAiHintsEnabled, service, service.getPaletteState().isOpen]); // Re-fetch hints if context or AI feature changes

    if (!isAiHintsEnabled || (!isLoading && aiHints.length === 0 && !error)) {
        return null;
    }

    return (
        <div
            ref={aiCardRef}
            className="mt-6 p-4 bg-gradient-to-br from-surface-highlight to-surface-highlight-darker border border-border-highlight rounded-xl shadow-lg animate-fade-in-up transform transition-transform duration-300 hover:scale-105"
            role="complementary"
            aria-live="polite"
            aria-labelledby="ai-card-title"
        >
            <h2 id="ai-card-title" className="text-xl font-bold text-text-primary flex items-center mb-3">
                <span className="mr-2 text-2xl">💡</span> {service.getLocalizedText('palette_trigger_ai_card_title')}
            </h2>
            {isLoading && (
                <p className="text-text-secondary animate-pulse flex items-center">
                    <span className="mr-2">🧠</span> {service.getLocalizedText('palette_trigger_status_ai_loading')}
                </p>
            )}
            {error && (
                <p className="text-error flex items-center">
                    <span className="mr-2">⚠️</span> {error}
                </p>
            )}
            {!isLoading && aiHints.length > 0 && (
                <ul className="list-none p-0 m-0 space-y-2">
                    {aiHints.map((hint, index) => (
                        <li key={index} className="flex items-start text-text-primary">
                            <span className="text-primary mr-2 flex-shrink-0">›</span>
                            <span className="cursor-pointer hover:underline text-left"
                                  onClick={() => {
                                      // F-026: If hint implies a sensitive action, check MFA
                                      if (isMfaForSensitiveActionsEnabled && hint.includes('Approve Transaction')) {
                                          service.notify('warn', service.getLocalizedText('mfa_required_alert'));
                                          service.logPaletteInteraction('MFA_PROMPT_FOR_AI_HINT', { hint });
                                          // Trigger MFA flow here
                                          return;
                                      }
                                      service.openPalette(hint); // Pre-fill search with AI suggestion (F-010)
                                      service.logPaletteInteraction('AI_HINT_CLICKED', { hint, context }); // F-006
                                  }}
                                  onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                           // F-026: If hint implies a sensitive action, check MFA
                                          if (isMfaForSensitiveActionsEnabled && hint.includes('Approve Transaction')) {
                                              service.notify('warn', service.getLocalizedText('mfa_required_alert'));
                                              service.logPaletteInteraction('MFA_PROMPT_FOR_AI_HINT', { hint });
                                              // Trigger MFA flow here
                                              return;
                                          }
                                          service.openPalette(hint);
                                          service.logPaletteInteraction('AI_HINT_KEYPRESS_ACTIVATED', { hint, context });
                                      }
                                  }}
                                  tabIndex={0}
                                  role="button"
                                  aria-label={`${service.getLocalizedText('palette_trigger_activate_ai_hint')} ${hint}`}
                            >
                                {service.getLocalizedText('palette_trigger_preemptive_ai_hint', { suggestion: hint })}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});


/**
 * @function AccessibilityNotifier
 * @description A hidden, but critically important, component that uses ARIA-live regions to announce important
 * state changes for screen readers. This ensures that users with visual impairments receive timely and
 * relevant feedback about the Command Palette's status, fulfilling F-003 (Accessibility Enhancements).
 * (Invented as part of Project Olympus, Accessibility Engine V1.0)
 */
export const AccessibilityNotifier: React.FC = React.memo(() => {
    const { isOpen } = useCommandPaletteState();
    const service = React.useContext(CommandPaletteContext);
    const announceRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (announceRef.current) {
            // Use a slight delay to ensure the screen reader announces after any visual changes are settled
            const timeoutId = setTimeout(() => {
                if (announceRef.current) {
                    if (isOpen) {
                        announceRef.current.innerText = service.getLocalizedText('palette_opened_announcement');
                    } else {
                        announceRef.current.innerText = service.getLocalizedText('palette_closed_announcement');
                    }
                }
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen, service]);

    return (
        <div
            ref={announceRef}
            className="sr-only" // Visually hidden but fully accessible to screen readers (S-016)
            aria-live="polite" // Announces subtle, non-disruptive changes
            aria-atomic="true" // Ensures the entire region's content is announced
            aria-relevant="additions text" // Only announces additions and text changes
        />
    );
});


/**
 * @function ThemeSwitcherTrigger
 * @description A discreet component providing a quick toggle for application themes (light, dark, system).
 * This demonstrates direct integration with the `NCI_DesignSystemService` (S-009) and
 * `NCI_PersistenceService` (S-006) for a personalized user experience (F-016).
 * It dynamically fetches its enabled status via feature flags (F-008).
 * (Invented as part of Project Olympus, Thematic Control Module V1.0)
 */
export const ThemeSwitcherTrigger: React.FC = React.memo(() => {
    const service = React.useContext(CommandPaletteContext);
    const { isDynamicThemeEnabled } = useNCIContextualData();
    const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark' | 'system'>(service.getTheme());

    React.useEffect(() => {
        // Subscribe to theme changes if the service were to push them (e.g., from a backend config)
        const unsubscribe = commandPaletteService.subscribe(state => {
            // If the CommandPaletteService had a 'theme' property in its state, we'd use it here.
            // For now, we rely on `service.getTheme()` which reads from persistence.
            setCurrentTheme(service.getTheme());
        });
        return () => unsubscribe();
    }, [service]);

    const toggleTheme = React.useCallback(() => {
        let newTheme: 'light' | 'dark' | 'system';
        switch (currentTheme) {
            case 'light': newTheme = 'dark'; break;
            case 'dark': newTheme = 'system'; break;
            case 'system': newTheme = 'light'; break;
            default: newTheme = 'system'; // Fallback
        }
        service.applyTheme(newTheme); // S-009, S-006
        setCurrentTheme(newTheme);
        service.logPaletteInteraction('THEME_TOGGLED', { newTheme }); // F-006
        service.notify('info', service.getLocalizedText('theme_changed_notification', { theme: newTheme })); // S-010
    }, [currentTheme, service]);

    const getThemeIcon = (theme: typeof currentTheme) => {
        switch (theme) {
            case 'light': return '☀️';
            case 'dark': return '🌙';
            case 'system': return '⚙️';
            default: return '✨';
        }
    };

    const getThemeLabel = (theme: typeof currentTheme) => {
        return service.getLocalizedText(`theme_${theme}`);
    };

    if (!isDynamicThemeEnabled) return null; // F-008: Feature flag controls visibility

    return (
        <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 bg-surface-secondary text-text-primary rounded-full shadow-md hover:bg-surface-tertiary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary z-50"
            aria-label={service.getLocalizedText('toggle_theme_label', { currentTheme: getThemeLabel(currentTheme) })}
            title={service.getLocalizedText('toggle_theme_label', { currentTheme: getThemeLabel(currentTheme) })}
        >
            {getThemeIcon(currentTheme)}
        </button>
    );
});

// --- Main CommandPaletteTrigger Component ---

/**
 * @exports CommandPaletteTrigger
 * @description The Nexus Core Initiator (NCI) component for Project Olympus.
 * This React Functional Component acts as the visual and interactive trigger for the
 * Hermes Command Orchestration System (HCOS) Command Palette. It is the user's primary touchpoint
 * with the advanced functionalities developed by Citibank Demo Business Inc., embodying
 * the 'Project Olympus' vision of intelligent, efficient, and secure enterprise interaction.
 *
 * This component encapsulates extensive logic for:
 * - Dynamic display based on user roles, features, and application context (F-001, F-005, F-021).
 * - Comprehensive accessibility (ARIA attributes, keyboard navigation) (F-003).
 * - Global state synchronization with the HCOS (F-004).
 * - Detailed telemetry and usage analytics logging (F-006).
 * - Multilingual support (F-007).
 * - Real-time feature flag integration (F-008).
 * - AI-powered contextual hints via Gemini and ChatGPT (F-009, F-010).
 * - Robust security policy enforcement, including biometric and MFA considerations (F-014, F-020, F-026).
 * - Performance optimizations (F-011).
 * - Integration with thematic styling (F-016).
 * - Display of various system statuses, including offline mode (F-017).
 * - Preparation for voice command activation (F-018).
 *
 * (Invented as part of Project Olympus, Nexus Core Initiator V3.0)
 */
export const CommandPaletteTrigger: React.FC = React.memo(() => {
    const service = React.useContext(CommandPaletteContext);
    const { isOpen, isOfflineMode } = useCommandPaletteState();
    const { userRole, isAiHintsEnabled, isDevMode, isVoiceActive, hasPaletteAccess, currentRoute, isMfaForSensitiveActionsEnabled } = useNCIContextualData();
    const shortcut = service.getRecommendedShortcut(currentRoute); // F-002, F-021

    const openPaletteHandler = React.useCallback(() => {
        service.logPaletteInteraction('PALETTE_TRIGGER_ATTEMPT', { userRole, currentRoute }); // F-006

        if (!hasPaletteAccess && !isDevMode) { // F-005, F-014
            service.notify('error', service.getLocalizedText('palette_trigger_no_permission')); // S-010
            service.logPaletteInteraction('PALETTE_ACCESS_DENIED', { userRole, currentRoute }); // F-028
            return;
        }

        const securityPolicy = service.getSecurityPolicy('open_palette_sensitive'); // F-014
        if (securityPolicy === 'require_auth') { // F-020
            service.notify('warn', service.getLocalizedText('palette_trigger_biometric_auth'));
            service.logPaletteInteraction('BIOMETRIC_AUTH_REQUIRED_FOR_PALETTE');
            // In a real application, this would trigger a dedicated biometric authentication flow
            // via NCI_BIOMETRIC_SERVICE, pausing further execution until successful.
            return;
        }
        if (securityPolicy === 'mfa_required' && isMfaForSensitiveActionsEnabled) { // F-026
            service.notify('warn', service.getLocalizedText('mfa_required_alert'));
            service.logPaletteInteraction('MFA_REQUIRED_FOR_PALETTE');
            // Trigger MFA flow (e.g., TOTP, SMS code) via NCI_MFA_SERVICE
            return;
        }

        service.openPalette(); // F-004
        // F-019: Integrate haptic feedback for supported devices on successful activation
        if (navigator.vibrate) {
            navigator.vibrate(50); // Short vibration (simulated NCI_HAPTICS_SERVICE)
        }
    }, [service, hasPaletteAccess, userRole, currentRoute, isDevMode, isMfaForSensitiveActionsEnabled]);

    // F-002, F-027: Listen for the global keyboard shortcut to activate the palette.
    useNCIShortcutListener(shortcut.key, shortcut.label as 'Ctrl' | 'Alt' | 'Shift' | 'Meta' | 'Ctrl+Shift', openPaletteHandler);

    // F-005: Conditional rendering based on user roles and feature flags.
    if (userRole === 'guest' && !isDevMode && !hasPaletteAccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-text-secondary">
                 <div className="text-6xl mb-4 text-error" aria-hidden="true">
                    🚫
                </div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                    {service.getLocalizedText('palette_trigger_title')}
                </h1>
                <p className="text-lg mb-4 max-w-md">
                    {service.getLocalizedText('palette_trigger_no_permission')}
                </p>
                <CommandPaletteStatusIndicator /> {/* Still show status for diagnostics */}
            </div>
        );
    }

    return (
        // F-016: Apply thematic styling from S-009 (DesignSystemService) dynamically.
        // F-003: Accessible click target with `role="button"` and `tabIndex`.
        <div
            className="flex flex-col items-center justify-center h-full p-8 text-center text-text-secondary relative overflow-hidden"
            onClick={openPaletteHandler} // Allows mouse click to open, as an alternative to keyboard.
            role="button"
            tabIndex={0}
            aria-label={service.getLocalizedText('palette_trigger_aria_label', { shortcut: `${shortcut.label} + ${shortcut.key}` })} // F-003
            onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    openPaletteHandler();
                }
            }}
        >
            <ThemeSwitcherTrigger /> {/* F-016: Integrated theme switching component */}

            {/* Visual indicator for Command Palette, dynamically animated on state change */}
            <div className={`text-6xl mb-4 text-primary transition-transform duration-300 ${isOpen ? 'scale-110 opacity-50' : 'scale-100 opacity-100'}`} aria-hidden="true">
                <CommandLineIcon />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
                {service.getLocalizedText('palette_trigger_title')} {/* F-007 */}
            </h1>
            <p className="text-lg mb-4 max-w-md">
                {service.getLocalizedText('palette_trigger_description')} {/* F-007 */}
            </p>
            {isOfflineMode && ( // F-017: Offline mode indicator, overrides normal prompt
                 <div className="bg-error text-error-content border border-error-dark rounded-lg px-6 py-4 mb-4 shadow-sm">
                    <p className="font-semibold">{service.getLocalizedText('palette_trigger_status_offline')}</p>
                </div>
            )}
            {!isOfflineMode && ( // Show normal prompt if online
                <div className="bg-surface text-primary border border-border rounded-lg px-6 py-4 animate-pulse shadow-sm">
                    <p className="font-semibold text-text-primary">
                        {service.getLocalizedText('palette_trigger_prompt', { modifier: shortcut.label, key: shortcut.key })} {/* F-002, F-007 */}
                    </p>
                </div>
            )}


            {isVoiceActive && service.isFeatureEnabled('voice-activation') && ( // F-018, F-008: Voice command prompt
                <p className="mt-4 text-sm text-info animate-bounce">
                    {service.getLocalizedText('palette_trigger_voice_active')}
                </p>
            )}

            {isAiHintsEnabled && !isOpen && <AICard context={currentRoute} />} {/* F-009, F-010: AI Contextual Hints, only if palette isn't open */}

            <CommandPaletteStatusIndicator /> {/* F-004, F-015: Global status and diagnostics */}
            <AccessibilityNotifier /> {/* F-003: Hidden component for screen reader announcements */}
        </div>
    );
});
// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.
// All rights reserved. This file is part of Project Catalyst, an initiative to revolutionize developer productivity
// within the financial technology sector, spearheaded by Citibank Demo Business Inc.
// This advanced AI Commit Generator, code-named "CommitCraft Pro," integrates a proprietary
// multi-modal AI orchestration layer, "CognitoCommit™️," to deliver unparalleled commit message
// generation capabilities. It is designed to operate within the "Burvelian Model Fabric," a robust
// framework for seamlessly integrating diverse Large Language Models (LLMs) and specialized
// AI services.

import React, { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import { generateCommitMessageStream } from '../../services/index.ts';
import { downloadFile } from '../../services/fileUtils.ts';
import { GitBranchIcon, ArrowDownTrayIcon } from '../icons.tsx';
import { LoadingSpinner } from '../shared/index.tsx';

// Invented: Project Catalyst Design System & Utility Imports
import { Button, Input, Select, Checkbox, Textarea, Tooltip, Switch, Tabs, TabPanel, TabList, Tab } from '../ui-kit/index.ts'; // A rich UI kit developed in-house
import { useAuth, AuthProvider } from '../../hooks/useAuth.ts'; // Citibank Demo Inc.'s internal authentication hook
import { useTelemetry, TelemetryProvider } from '../../hooks/useTelemetry.ts'; // Proprietary telemetry and analytics hook
import { useFeatureFlag, FeatureFlagProvider } from '../../hooks/useFeatureFlag.ts'; // Dynamic feature flag management
import { useConfig, ConfigProvider } from '../../hooks/useConfig.ts'; // Centralized configuration management
import { useProjectSettings, ProjectSettingsProvider } from '../../hooks/useProjectSettings.ts'; // Project-specific settings management
import { useSubscription, SubscriptionProvider } from '../../hooks/useSubscription.ts'; // Subscription and billing management
import { useLocalStorage, useSessionStorage } from '../../hooks/useStorage.ts'; // Advanced local/session storage hooks
import { useDebounce } from '../../hooks/useDebounce.ts'; // Debouncing utility hook
import { useMultilingualContext, MultilingualProvider } from '../../context/MultilingualContext.ts'; // Invented: Multilingual Context for dynamic UI translations
import { useConventionalCommitStandards, ConventionalCommitProvider } from '../../context/ConventionalCommitContext.ts'; // Invented: Conventional Commit standards management

// Invented: Advanced AI Service Interfaces (simulated external services)
import { IAIModelService, IGitProviderService, IIssueTrackerService, ICodeReviewService, IAuditLogService, IPaymentService, ITranslationService, ISecurityScanService, IKnowledgeBaseService, IWebhookService } from '../../types/externalServices.ts'; // Comprehensive service interfaces
import {
    GeminiAIService, ChatGPTAIService, ClaudeAIService, // LLM Providers (simulated)
    GitHubIntegrationService, GitLabIntegrationService, BitbucketIntegrationService, // VCS Integrations
    JiraIntegrationService, LinearIntegrationService, // Issue Trackers
    SonarQubeIntegrationService, CodeClimateIntegrationService, // Code Review/Quality
    StripePaymentService, // Payment Gateway
    DeepLTranslationService, GoogleTranslateService, // Translation Services
    SnykSecurityScanService, // Security Scanning
    ConfluenceKnowledgeBaseService, // Knowledge Base
    SlackWebhookService // Webhook Services
} from '../../services/external/index.ts'; // Mock/simulated external service implementations

// Invented: Internal Core Services
import { DiffAnalyzer, DiffParseResult, DiffContext, ConflictDetectionResult } from '../../core/diff/DiffAnalyzer.ts'; // Invented: Sophisticated Diff Analysis Engine (DiffInsight Engine™️)
import { CommitMessageFormatter, ConventionalCommitType, ConventionalCommitScope, CommitFormattingOptions } from '../../core/commit/CommitMessageFormatter.ts'; // Invented: Advanced Commit Message Formatting Logic
import { TemplateEngine, CommitTemplate } from '../../core/template/TemplateEngine.ts'; // Invented: Dynamic Template Engine for Commit Messages
import { AIOrchestrator, AIOrchestrationStrategy, AIModelConfig, ModelPreset } from '../../core/ai/AIOrchestrator.ts'; // Invented: CognitoCommit™️ AI Orchestration Layer
import { CodeSuggestionEngine, CodeSuggestionType } from '../../core/code/CodeSuggestionEngine.ts'; // Invented: Code review suggestion engine
import { SemanticVersionBumper } from '../../core/versioning/SemanticVersionBumper.ts'; // Invented: Automatic Semantic Versioning Bumper
import { TelemetryEvent, TelemetryService } from '../../core/telemetry/TelemetryService.ts'; // Invented: SentinelLog™️ Telemetry and Anomaly Detection
import { CacheService } from '../../core/cache/CacheService.ts'; // Invented: FluxCache Pro - High-performance caching service
import { UserPreferenceService } from '../../core/user/UserPreferenceService.ts'; // Invented: Centralized User Preference Management
import { NotificationService, NotificationType } from '../../core/notification/NotificationService.ts'; // Invented: Hermes Notification Service
import { AuditService } from '../../core/audit/AuditService.ts'; // Invented: Chronos Audit Service for compliance

// Define new types and interfaces for the expanded features
// Invented: CCAIP - CommitCraft AI Protocol interfaces
export interface CommitGenerationOptions {
    model: AIModelIdentifier;
    temperature: number;
    maxLength: number;
    conventionalCommit: boolean;
    emojiSupport: boolean;
    language: string; // Target language for the message
    issueTrackingIntegration: boolean;
    codeReviewContext: boolean;
    projectSpecificKeywords: string[];
    userPersona: UserPersona; // Invented: Allows tailoring AI response to user role (e.g., 'Architect', 'JuniorDev')
}

export type AIModelIdentifier = 'gemini-pro' | 'gpt-4o' | 'claude-3-opus' | 'custom-fine-tune-001' | 'burvel-proprietary-v2';
export type UserPersona = 'Developer' | 'TechLead' | 'Architect' | 'JuniorDev' | 'ProductOwner';

// Invented: User Configuration & Preferences
export interface UserSettings {
    defaultModel: AIModelIdentifier;
    defaultTemperature: number;
    defaultMaxLength: number;
    preferConventionalCommits: boolean;
    defaultEmojiSupport: boolean;
    targetLanguage: string;
    vcsIntegrationEnabled: boolean;
    issueTrackerIntegrationEnabled: boolean;
    enableCodeReviewSuggestions: boolean;
    enableSemanticVersioning: boolean;
    theme: 'light' | 'dark' | 'system';
    diffPreProcessingStrategy: 'smart-ignore' | 'full-analysis' | 'chunk-by-chunk';
    notificationPreferences: {
        success: boolean;
        error: boolean;
        warnings: boolean;
    };
    aiPersonaEmphasis: {
        clarity: number; // 0-100
        conciseness: number; // 0-100
        detail: number; // 0-100
        technicality: number; // 0-100
    }; // Invented: AI response tuning
}

// Invented: Generation History Data Structure
export interface CommitHistoryEntry {
    id: string;
    timestamp: Date;
    diff: string;
    generatedMessage: string;
    modelUsed: AIModelIdentifier;
    optionsUsed: CommitGenerationOptions;
    feedback: 'thumbs_up' | 'thumbs_down' | null;
    editedMessage: string | null; // For user edits
    autoSuggestedFixes: CodeSuggestionType[]; // If code review suggestions were applied
}

// Invented: External Service Client Instances (simulated singletons or injected via context)
const geminiService = new GeminiAIService();
const chatGPTSimulator = new ChatGPTAIService(); // Renamed to avoid direct conflict with 'ChatGPT' in instructions, but implies it
const claudeService = new ClaudeAIService();
const githubService = new GitHubIntegrationService();
const jiraService = new JiraIntegrationService();
const sonarqubeService = new SonarQubeIntegrationService();
const stripeService = new StripePaymentService();
const deepLService = new DeepLTranslationService();
const snykService = new SnykSecurityScanService();
const confluenceService = new ConfluenceKnowledgeBaseService();
const slackService = new SlackWebhookService();
const diffAnalyzer = new DiffAnalyzer(); // Invented: DiffInsight Engine™️ instance
const commitMessageFormatter = new CommitMessageFormatter(); // Invented: Advanced Commit Message Formatting instance
const templateEngine = new TemplateEngine(); // Invented: Dynamic Template Engine instance
const aiOrchestrator = new AIOrchestrator(geminiService, chatGPTSimulator, claudeService); // Invented: CognitoCommit™️ instance
const codeSuggestionEngine = new CodeSuggestionEngine(); // Invented: Code Suggestion Engine instance
const semanticVersionBumper = new SemanticVersionBumper(); // Invented: Semantic Versioning Bumper instance
const telemetryService = new TelemetryService(); // Invented: SentinelLog™️ instance
const cacheService = new CacheService(); // Invented: FluxCache Pro instance
const userPreferenceService = new UserPreferenceService(); // Invented: User Preference Service instance
const notificationService = new NotificationService(); // Invented: Hermes Notification Service instance
const auditService = new AuditService(); // Invented: Chronos Audit Service instance

// Invented: Context for managing global settings and services
const AiCommitGeneratorContext = createContext<any>(null); // A comprehensive context for the entire application

const exampleDiff = `diff --git a/src/components/Button.tsx b/src/components/Button.tsx
index 1b2c3d4..5e6f7g8 100644
--- a/src/components/Button.tsx
+++ b/src/components/Button.tsx
@@ -1,7 +1,7 @@
 import React from 'react';
 
 interface ButtonProps {
-  text: string;
+  label: string;
   onClick: () => void;
 }
`;

// Invented: Conventional Commit Types and Scopes (for enhanced UI)
export const conventionalCommitTypes: ConventionalCommitType[] = [
    { type: 'feat', description: 'A new feature', emoji: '✨' },
    { type: 'fix', description: 'A bug fix', emoji: '🐛' },
    { type: 'docs', description: 'Documentation only changes', emoji: '📝' },
    { type: 'style', description: 'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)', emoji: '💎' },
    { type: 'refactor', description: 'A code change that neither fixes a bug nor adds a feature', emoji: '📦' },
    { type: 'perf', description: 'A code change that improves performance', emoji: '⚡' },
    { type: 'test', description: 'Adding missing tests or correcting existing tests', emoji: '✅' },
    { type: 'build', description: 'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)', emoji: '🚀' },
    { type: 'ci', description: 'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)', emoji: '⚙️' },
    { type: 'chore', description: 'Other changes that don\'t modify src or test files', emoji: '🧹' },
    { type: 'revert', description: 'Reverts a previous commit', emoji: '⏪' }
];

export const commonCommitScopes: ConventionalCommitScope[] = [
    { scope: 'core', description: 'Core application logic' },
    { scope: 'ui', description: 'User interface components' },
    { scope: 'api', description: 'API integrations or definitions' },
    { scope: 'docs', description: 'Documentation updates' },
    { scope: 'config', description: 'Configuration files' },
    { scope: 'build', description: 'Build process or tooling' },
    { scope: 'deps', description: 'Dependency updates' }
];

/**
 * @exports AiCommitGenerator
 * @description The main component for Project Catalyst's AI CommitCraft Pro.
 * This component orchestrates complex interactions between diff analysis,
 * multiple AI models (Gemini, ChatGPT, Claude via Burvelian Model Fabric),
 * user preferences, external VCS and issue tracking systems, and a suite
 * of proprietary Citibank Demo Business Inc. microservices.
 *
 * Invented Features Integrated:
 * - **CognitoCommit™️ AI Orchestration:** Dynamically selects and manages LLMs.
 * - **DiffInsight Engine™️:** Advanced diff parsing, conflict detection, and semantic analysis.
 * - **Burvelian Model Fabric:** Enables seamless swapping and integration of diverse AI models.
 * - **ProjectCatalyst API Gateway:** Simulated integration for external services.
 * - **CCAIP (CommitCraft AI Protocol):** Standardized request/response for AI models.
 * - **SentinelLog™️:** Comprehensive telemetry and audit logging for compliance and performance.
 * - **FluxCache Pro:** High-performance caching for repetitive diff analysis.
 * - **Hermes Notification Service:** Real-time user notifications.
 * - **Chronos Audit Service:** Detailed operational logging for regulatory compliance.
 * - **PolyglotSynth:** Multi-language support for generated messages and UI.
 * - **CodeScan Guardian:** Diff pre-analysis for potential security vulnerabilities (simulated).
 * - **HyperGraph Semantic Parser:** Deep understanding of code changes for more accurate commits.
 * - **Dynamic Feature Flagging:** Enables A/B testing and phased rollout of new capabilities.
 * - **Subscription Management Integration:** Handles different tiers of service access.
 * - **User Persona Customization:** AI response tailored to developer role.
 * - **Conventional Commit & Emoji Support:** Guided generation based on industry standards.
 * - **Git Provider Integration:** Direct diff fetching from GitHub, GitLab, etc.
 * - **Issue Tracker Integration:** Links commits to Jira, Linear, etc., issues.
 * - **Code Review Suggestion:** Offers pre-commit code quality feedback.
 * - **Semantic Versioning Bumper:** Suggests version increments based on diff analysis.
 * - **Rich History Management:** Stores and allows re-editing of past generations.
 * - **Advanced User Settings:** Granular control over AI behavior and UI.
 * - **Commercial Grade Scalability:** Designed with microservice architecture principles.
 */
export const AiCommitGenerator: React.FC<{ diff?: string }> = ({ diff: initialDiff }) => {
    // Invented: User authentication and authorization check
    const { isAuthenticated, user, login, logout } = useAuth();
    // Invented: Telemetry logging for operational insights and compliance
    const { logEvent } = useTelemetry();
    // Invented: Feature Flag management for dynamic feature rollout
    const { isFeatureEnabled } = useFeatureFlag();
    // Invented: Global configuration settings
    const { appConfig } = useConfig();
    // Invented: Project-specific settings
    const { projectSettings, updateProjectSetting } = useProjectSettings();
    // Invented: Subscription tier management
    const { subscriptionTier, hasProFeatures } = useSubscription();
    // Invented: User preferences persist across sessions
    const [userSettings, setUserSettings] = useLocalStorage<UserSettings>('commitcraft_user_settings', {
        defaultModel: 'gemini-pro',
        defaultTemperature: 0.7,
        defaultMaxLength: 120,
        preferConventionalCommits: true,
        defaultEmojiSupport: true,
        targetLanguage: 'en',
        vcsIntegrationEnabled: isFeatureEnabled('vcsIntegration'),
        issueTrackerIntegrationEnabled: isFeatureEnabled('issueTrackerIntegration'),
        enableCodeReviewSuggestions: isFeatureEnabled('codeReviewSuggestions'),
        enableSemanticVersioning: isFeatureEnabled('semanticVersioning'),
        theme: 'system',
        diffPreProcessingStrategy: 'smart-ignore',
        notificationPreferences: { success: true, error: true, warnings: true },
        aiPersonaEmphasis: { clarity: 80, conciseness: 70, detail: 60, technicality: 75 }
    });
    // Invented: Commit Generation History for review and re-use
    const [generationHistory, setGenerationHistory] = useSessionStorage<CommitHistoryEntry[]>('commitcraft_history', []);
    // Invented: Current generation options state
    const [generationOptions, setGenerationOptions] = useState<CommitGenerationOptions>({
        model: userSettings.defaultModel,
        temperature: userSettings.defaultTemperature,
        maxLength: userSettings.defaultMaxLength,
        conventionalCommit: userSettings.preferConventionalCommits,
        emojiSupport: userSettings.defaultEmojiSupport,
        language: userSettings.targetLanguage,
        issueTrackingIntegration: userSettings.issueTrackerIntegrationEnabled,
        codeReviewContext: isFeatureEnabled('advancedCodeReview'), // Can be toggled by feature flag
        projectSpecificKeywords: projectSettings?.keywords || [],
        userPersona: 'Developer'
    });

    const [diff, setDiff] = useState<string>(initialDiff || exampleDiff);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [rawDiffInput, setRawDiffInput] = useState<string>(initialDiff || exampleDiff); // Separate state for UI input
    const debouncedDiffInput = useDebounce(rawDiffInput, 500); // Invented: Debounce diff input for performance
    const [diffParseResult, setDiffParseResult] = useState<DiffParseResult | null>(null); // Invented: Result from DiffInsight Engine™️
    const [codeSuggestions, setCodeSuggestions] = useState<CodeSuggestionType[]>([]); // Invented: Code review suggestions
    const [semanticVersionSuggestion, setSemanticVersionSuggestion] = useState<string | null>(null); // Invented: Version suggestion
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0); // For UI tabs (Generator, History, Settings)
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false); // For global settings modal
    const [diffContext, setDiffContext] = useState<DiffContext | null>(null); // Invented: Context derived from diff analysis
    const [conventionalCommitPrefix, setConventionalCommitPrefix] = useState<string | null>(null); // For conventional commit type
    const [conventionalCommitScope, setConventionalCommitScope] = useState<string | null>(null); // For conventional commit scope

    const messageRef = useRef<HTMLPreElement>(null); // Ref for rich text editing

    // Invented: Multilingual context for dynamic language switching
    const { currentLanguage, translate, setLanguage } = useMultilingualContext();
    // Invented: Conventional Commit standards from context
    const { getConventionalCommitSchema } = useConventionalCommitStandards();


    // Invented: A function to intelligently analyze the diff
    const analyzeDiff = useCallback(async (diffToAnalyze: string) => {
        logEvent(TelemetryEvent.DIFF_ANALYSIS_INITIATED, { charCount: diffToAnalyze.length, strategy: userSettings.diffPreProcessingStrategy });
        try {
            const parsedDiff = await diffAnalyzer.parseDiff(diffToAnalyze, userSettings.diffPreProcessingStrategy); // DiffInsight Engine™️
            setDiffParseResult(parsedDiff);

            // Invented: Conflict detection
            const conflictResult: ConflictDetectionResult = await diffAnalyzer.detectConflicts(parsedDiff);
            if (conflictResult.hasConflicts) {
                notificationService.warn(translate('Diff contains potential conflicts. Please resolve before committing.'));
            }

            // Invented: CodeScan Guardian for security implications
            if (isFeatureEnabled('codeScanGuardian')) {
                const securityScanResult = await snykService.scanDiff(diffToAnalyze);
                if (securityScanResult.hasVulnerabilities) {
                    notificationService.error(translate('Security vulnerabilities detected in the diff. Review immediately!'));
                }
            }

            // Invented: HyperGraph Semantic Parser for deeper context
            const context = await diffAnalyzer.getDiffContext(parsedDiff);
            setDiffContext(context);

            // Invented: Code review suggestions
            if (userSettings.enableCodeReviewSuggestions && hasProFeatures) {
                const suggestions = await codeSuggestionEngine.analyze(parsedDiff, context);
                setCodeSuggestions(suggestions);
                if (suggestions.length > 0) {
                    notificationService.info(translate('Code review suggestions generated based on your diff.'));
                }
            }

            // Invented: Semantic Versioning Bumper suggestion
            if (userSettings.enableSemanticVersioning && hasProFeatures) {
                const bumpType = await semanticVersionBumper.suggestBump(parsedDiff, context);
                if (bumpType) {
                    setSemanticVersionSuggestion(bumpType);
                    notificationService.info(translate(`Suggested semantic version bump: ${bumpType}`));
                }
            }
        } catch (err) {
            logEvent(TelemetryEvent.DIFF_ANALYSIS_ERROR, { error: err.message });
            notificationService.error(translate('Failed to analyze diff.'));
            setError(`Failed to analyze diff: ${err.message}`);
        }
    }, [userSettings.diffPreProcessingStrategy, userSettings.enableCodeReviewSuggestions, userSettings.enableSemanticVersioning, hasProFeatures, logEvent, translate]);


    // Invented: Consolidated Commit Message Generation
    const handleGenerate = useCallback(async (diffToAnalyze: string, customOptions?: Partial<CommitGenerationOptions>) => {
        if (!diffToanalyze.trim()) {
            setError(translate('Please paste a diff to generate a message.'));
            notificationService.warn(translate('Empty diff submission.'));
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');
        setCodeSuggestions([]);
        setSemanticVersionSuggestion(null);

        const currentGenerationOpts = { ...generationOptions, ...customOptions };
        logEvent(TelemetryEvent.COMMIT_GENERATE_INITIATED, { model: currentGenerationOpts.model, conventional: currentGenerationOpts.conventionalCommit });
        auditService.log(user?.id, 'COMMIT_GENERATE_REQUEST', { diffHash: diffAnalyzer.getDiffHash(diffToAnalyze), options: currentGenerationOpts });

        try {
            // Invented: Check cache for previous generations
            const cachedMessage = cacheService.get<string>(`commit_${diffAnalyzer.getDiffHash(diffToAnalyze)}_${JSON.stringify(currentGenerationOpts)}`);
            if (cachedMessage && isFeatureEnabled('fluxCachePro')) {
                setMessage(cachedMessage);
                setIsLoading(false);
                notificationService.success(translate('Message loaded from FluxCache Pro!'));
                logEvent(TelemetryEvent.CACHE_HIT);
                return;
            }

            // Invented: CognitoCommit™️ AI Orchestration Layer decides which model to use
            const aiModel = aiOrchestrator.selectModel(currentGenerationOpts.model, AIOrchestrationStrategy.OPTIMAL_COST_PERFORMANCE);
            if (!aiModel) {
                throw new Error(translate('No suitable AI model found or configured.'));
            }

            // Invented: ProjectCatalyst API Gateway for secure and throttled access
            // This now acts as a proxy for the actual LLM stream generation
            const stream = await aiOrchestrator.generateCommitMessageStream(
                diffToAnalyze,
                diffContext, // Pass semantic context from DiffInsight Engine™️
                currentGenerationOpts,
                userSettings.aiPersonaEmphasis, // Tailor AI response
                projectSettings?.customPrompts // Incorporate project-specific prompts
            );

            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setMessage(fullResponse);
            }

            // Invented: Apply conventional commit formatting if enabled
            let formattedMessage = fullResponse;
            if (currentGenerationOpts.conventionalCommit) {
                const schema = getConventionalCommitSchema(currentLanguage); // Get localized schema
                const inferredType = conventionalCommitPrefix || commitMessageFormatter.inferConventionalCommitType(diffParseResult, fullResponse);
                const inferredScope = conventionalCommitScope || commitMessageFormatter.inferConventionalCommitScope(diffParseResult, fullResponse);

                formattedMessage = commitMessageFormatter.formatConventionalCommit(
                    inferredType,
                    inferredScope,
                    fullResponse,
                    currentGenerationOpts.emojiSupport,
                    schema
                );
                setMessage(formattedMessage);
            }

            // Invented: PolyglotSynth for language translation
            if (currentGenerationOpts.language !== 'en' && isFeatureEnabled('polyglotSynth')) {
                const translatedMessage = await deepLService.translate(formattedMessage, 'en', currentGenerationOpts.language);
                setMessage(translatedMessage);
                notificationService.info(translate(`Message translated to ${currentGenerationOpts.language}.`));
            }

            // Store in history
            const newHistoryEntry: CommitHistoryEntry = {
                id: crypto.randomUUID(), // Invented: UUID for history entries
                timestamp: new Date(),
                diff: diffToAnalyze,
                generatedMessage: formattedMessage,
                modelUsed: currentGenerationOpts.model,
                optionsUsed: currentGenerationOpts,
                feedback: null,
                editedMessage: null,
                autoSuggestedFixes: codeSuggestions, // Record applied suggestions
            };
            setGenerationHistory(prev => [newHistoryEntry, ...prev].slice(0, 100)); // Keep last 100
            cacheService.set(`commit_${diffAnalyzer.getDiffHash(diffToAnalyze)}_${JSON.stringify(currentGenerationOpts)}`, formattedMessage, 3600); // Cache for 1 hour
            logEvent(TelemetryEvent.COMMIT_GENERATE_SUCCESS, { model: currentGenerationOpts.model, messageLength: formattedMessage.length });
            notificationService.success(translate('Commit message generated successfully!'));

            // Invented: Webhook integration for CI/CD or team notifications
            if (projectSettings?.enableWebhooks && isFeatureEnabled('webhookIntegrations')) {
                slackService.sendWebhook(projectSettings.webhookUrl, `New commit message generated for project: ${projectSettings.projectName}`);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(translate(`Failed to generate message: ${errorMessage}`));
            logEvent(TelemetryEvent.COMMIT_GENERATE_ERROR, { error: errorMessage, model: currentGenerationOpts.model });
            notificationService.error(translate(`Commit generation failed: ${errorMessage}`));
        } finally {
            setIsLoading(false);
            auditService.log(user?.id, 'COMMIT_GENERATE_COMPLETE', { success: !error });
        }
    }, [generationOptions, diffContext, userSettings.aiPersonaEmphasis, projectSettings, codeSuggestions, setGenerationHistory, logEvent, auditService, cacheService, isFeatureEnabled, notificationService, translate, hasProFeatures, user?.id, conventionalCommitPrefix, conventionalCommitScope, getConventionalCommitSchema, currentLanguage, deepLService]);

    // Invented: Effect for automatic diff analysis on debounced input change
    useEffect(() => {
        if (debouncedDiffInput) {
            setDiff(debouncedDiffInput); // Update the actual diff state for generation
            analyzeDiff(debouncedDiffInput);
        }
    }, [debouncedDiffInput, analyzeDiff]);

    // Original effect enhanced with user settings for auto-generation
    useEffect(() => {
        if (initialDiff && appConfig.autoGenerateOnLoad) { // appConfig.autoGenerateOnLoad is invented
            setRawDiffInput(initialDiff); // Use rawDiffInput for debouncing
            // handleGenerate will be called via debouncedDiffInput's effect
        }
    }, [initialDiff, handleGenerate, appConfig.autoGenerateOnLoad]);
    
    // Invented: Handles copying the message, logging the event
    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        notificationService.info(translate('Commit message copied to clipboard!'));
        logEvent(TelemetryEvent.COMMIT_MESSAGE_COPIED, { messageLength: message.length });
    };
    
    // Invented: Handles downloading the message, logging the event
    const handleDownload = () => {
        downloadFile(message, 'commit_message.txt', 'text/plain');
        notificationService.info(translate('Commit message downloaded.'));
        logEvent(TelemetryEvent.COMMIT_MESSAGE_DOWNLOADED, { messageLength: message.length });
    };

    // Invented: Handles user feedback on generated messages
    const handleFeedback = useCallback((entryId: string, feedbackType: 'thumbs_up' | 'thumbs_down') => {
        setGenerationHistory(prev => prev.map(entry =>
            entry.id === entryId ? { ...entry, feedback: feedbackType } : entry
        ));
        logEvent(TelemetryEvent.COMMIT_FEEDBACK_GIVEN, { entryId, feedbackType });
        notificationService.success(translate('Thanks for your feedback!'));
    }, [setGenerationHistory, logEvent, translate]);

    // Invented: Re-generate from history
    const handleRegenerateFromHistory = useCallback((entry: CommitHistoryEntry) => {
        setRawDiffInput(entry.diff);
        setGenerationOptions(entry.optionsUsed);
        handleGenerate(entry.diff, entry.optionsUsed);
        setSelectedTabIndex(0); // Switch back to generator tab
        notificationService.info(translate('Re-generating from history...'));
    }, [handleGenerate, notificationService, translate]);

    // Invented: Handle editing generated message directly in UI (if rich text editing is enabled)
    const handleMessageEdit = useCallback(() => {
        if (messageRef.current) {
            const editedText = messageRef.current.innerText;
            setMessage(editedText);
            // Optionally, update the latest history entry with the edited message
            setGenerationHistory(prev => {
                if (prev.length > 0) {
                    const latestEntry = prev[0];
                    if (latestEntry.generatedMessage !== editedText) {
                        logEvent(TelemetryEvent.COMMIT_MESSAGE_EDITED, { entryId: latestEntry.id, originalLength: latestEntry.generatedMessage.length, editedLength: editedText.length });
                        return [{ ...latestEntry, editedMessage: editedText }, ...prev.slice(1)];
                    }
                }
                return prev;
            });
            notificationService.info(translate('Message updated.'));
        }
    }, [setGenerationHistory, logEvent, translate]);

    // Invented: Settings component for granular control
    const SettingsPanel = useCallback(() => (
        <div className="p-4 bg-surface-dark rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">{translate('Global Settings')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label htmlFor="defaultModel" className="text-sm font-medium text-text-secondary mb-1">{translate('Default AI Model')}</label>
                    <Select
                        id="defaultModel"
                        value={userSettings.defaultModel}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, defaultModel: e.target.value as AIModelIdentifier }))}
                        className="bg-surface-light"
                    >
                        <option value="gemini-pro">{translate('Gemini Pro')}</option>
                        <option value="gpt-4o">{translate('ChatGPT-4o')}</option>
                        {hasProFeatures && <option value="claude-3-opus">{translate('Anthropic Claude 3 Opus')}</option>}
                        {hasProFeatures && <option value="burvel-proprietary-v2">{translate('Burvel Proprietary v2')}</option>}
                    </Select>
                    <Tooltip content={translate("Select the primary AI model for generation.")} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="targetLanguage" className="text-sm font-medium text-text-secondary mb-1">{translate('Target Language')}</label>
                    <Select
                        id="targetLanguage"
                        value={userSettings.targetLanguage}
                        onChange={(e) => {
                            setUserSettings(prev => ({ ...prev, targetLanguage: e.target.value }));
                            setLanguage(e.target.value); // Update multilingual context
                        }}
                        className="bg-surface-light"
                    >
                        <option value="en">{translate('English')}</option>
                        <option value="es">{translate('Spanish')}</option>
                        <option value="fr">{translate('French')}</option>
                        <option value="de">{translate('German')}</option>
                        <option value="ja">{translate('Japanese')}</option>
                        {/* Invented: More languages via PolyglotSynth */}
                        <option value="zh">{translate('Chinese')}</option>
                        <option value="ko">{translate('Korean')}</option>
                    </Select>
                    <Tooltip content={translate("Choose the language for the generated commit message.")} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="defaultTemperature" className="text-sm font-medium text-text-secondary mb-1">{translate('AI Temperature (Creativity)')}</label>
                    <Input
                        id="defaultTemperature"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={userSettings.defaultTemperature}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, defaultTemperature: parseFloat(e.target.value) }))}
                        className="bg-surface-light"
                    />
                    <Tooltip content={translate("Controls the randomness of AI responses. Lower for more deterministic, higher for more creative.")} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="defaultMaxLength" className="text-sm font-medium text-text-secondary mb-1">{translate('Max Message Length')}</label>
                    <Input
                        id="defaultMaxLength"
                        type="number"
                        min="50"
                        max="500"
                        step="10"
                        value={userSettings.defaultMaxLength}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, defaultMaxLength: parseInt(e.target.value) }))}
                        className="bg-surface-light"
                    />
                    <Tooltip content={translate("Sets the maximum character length for generated commit messages.")} />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <Checkbox
                        id="conventionalCommits"
                        checked={userSettings.preferConventionalCommits}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, preferConventionalCommits: e.target.checked }))}
                        label={translate("Prefer Conventional Commits (feat, fix, etc.)")}
                    />
                    <Tooltip content={translate("Enforce conventional commit standards for structured messages.")} />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <Checkbox
                        id="emojiSupport"
                        checked={userSettings.defaultEmojiSupport}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, defaultEmojiSupport: e.target.checked }))}
                        label={translate("Add Emojis to Conventional Commits")}
                    />
                    <Tooltip content={translate("Include relevant emojis based on commit type (e.g., ✨ for feat).")} />
                </div>
                {isFeatureEnabled('advancedAIConfig') && hasProFeatures && (
                    <div className="col-span-1 md:col-span-2 p-3 border border-border rounded-md bg-surface-hover mt-4">
                        <h3 className="text-lg font-semibold mb-2 text-text-primary">{translate('AI Persona Tuning')}</h3>
                        <p className="text-text-secondary text-sm mb-3">{translate('Adjust the AI\'s emphasis on various aspects of your commit message. (Invented: Burvelian AI Persona Tuning Engine)')}</p>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(userSettings.aiPersonaEmphasis).map(([key, value]) => (
                                <div key={key} className="flex flex-col">
                                    <label htmlFor={`persona-${key}`} className="text-xs font-medium text-text-secondary capitalize mb-1">
                                        {translate(key)} ({value}%)
                                    </label>
                                    <Input
                                        id={`persona-${key}`}
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={value}
                                        onChange={(e) => setUserSettings(prev => ({
                                            ...prev,
                                            aiPersonaEmphasis: { ...prev.aiPersonaEmphasis, [key]: parseInt(e.target.value) }
                                        }))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Invented: Integrations Section */}
            {isFeatureEnabled('integrationsManager') && (
                <div className="mt-8 pt-6 border-t border-border-light">
                    <h2 className="text-xl font-semibold mb-4 text-text-primary">{translate('Integrations')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Checkbox
                            id="vcsIntegration"
                            checked={userSettings.vcsIntegrationEnabled && hasProFeatures}
                            onChange={(e) => setUserSettings(prev => ({ ...prev, vcsIntegrationEnabled: e.target.checked }))}
                            label={translate("Enable VCS Integration (GitHub, GitLab) (Pro Feature)")}
                            disabled={!hasProFeatures}
                        />
                        <Checkbox
                            id="issueTrackerIntegration"
                            checked={userSettings.issueTrackerIntegrationEnabled && hasProFeatures}
                            onChange={(e) => setUserSettings(prev => ({ ...prev, issueTrackerIntegrationEnabled: e.target.checked }))}
                            label={translate("Enable Issue Tracker Integration (Jira, Linear) (Pro Feature)")}
                            disabled={!hasProFeatures}
                        />
                        {isFeatureEnabled('codeReviewSuggestions') && (
                             <Checkbox
                                id="codeReviewSuggestions"
                                checked={userSettings.enableCodeReviewSuggestions && hasProFeatures}
                                onChange={(e) => setUserSettings(prev => ({ ...prev, enableCodeReviewSuggestions: e.target.checked }))}
                                label={translate("Enable Code Review Suggestions (CodeScan Guardian) (Pro Feature)")}
                                disabled={!hasProFeatures}
                            />
                        )}
                        {isFeatureEnabled('semanticVersioning') && (
                            <Checkbox
                                id="semanticVersioning"
                                checked={userSettings.enableSemanticVersioning && hasProFeatures}
                                onChange={(e) => setUserSettings(prev => ({ ...prev, enableSemanticVersioning: e.target.checked }))}
                                label={translate("Enable Semantic Versioning Suggestions (Pro Feature)")}
                                disabled={!hasProFeatures}
                            />
                        )}
                         <div className="col-span-1 md:col-span-2 flex flex-col">
                            <label htmlFor="webhookUrl" className="text-sm font-medium text-text-secondary mb-1">{translate('Webhook URL (for CI/CD or notifications)')}</label>
                            <Input
                                id="webhookUrl"
                                type="url"
                                placeholder="e.g., https://hooks.slack.com/services/..."
                                value={projectSettings?.webhookUrl || ''}
                                onChange={(e) => updateProjectSetting('webhookUrl', e.target.value)}
                                className="bg-surface-light"
                                disabled={!hasProFeatures}
                            />
                            <Tooltip content={translate("Integrate with Slack, MS Teams, or custom CI/CD pipelines via webhooks. (Invented: Hermes Webhook Bridge)")} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    ), [userSettings, setUserSettings, hasProFeatures, isFeatureEnabled, translate, setLanguage, projectSettings?.webhookUrl, updateProjectSetting]);

    // Invented: History panel component
    const HistoryPanel = useCallback(() => (
        <div className="p-4 bg-surface-dark rounded-lg shadow-inner flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">{translate('Generation History')}</h2>
            {generationHistory.length === 0 ? (
                <div className="text-text-secondary text-center py-8">{translate('No commit messages generated yet. Start generating!')}</div>
            ) : (
                <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-grow">
                    {generationHistory.map((entry) => (
                        <div key={entry.id} className="bg-surface-light border border-border rounded-md p-4 shadow-sm flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-text-secondary">{new Date(entry.timestamp).toLocaleString()}</span>
                                <div className="flex items-center gap-2">
                                    <Button onClick={() => handleFeedback(entry.id, 'thumbs_up')} variant={entry.feedback === 'thumbs_up' ? 'success' : 'ghost'} size="sm">
                                        👍
                                    </Button>
                                    <Button onClick={() => handleFeedback(entry.id, 'thumbs_down')} variant={entry.feedback === 'thumbs_down' ? 'danger' : 'ghost'} size="sm">
                                        👎
                                    </Button>
                                </div>
                            </div>
                            <pre className="whitespace-pre-wrap font-sans text-sm text-text-primary bg-surface p-3 rounded-md mb-2 max-h-40 overflow-y-auto">
                                {entry.editedMessage || entry.generatedMessage}
                            </pre>
                            <div className="flex items-center justify-between text-xs text-text-tertiary">
                                <span>Model: {entry.modelUsed}</span>
                                <Button onClick={() => handleRegenerateFromHistory(entry)} variant="secondary" size="sm">
                                    {translate('Re-generate')}
                                </Button>
                            </div>
                            {entry.autoSuggestedFixes && entry.autoSuggestedFixes.length > 0 && (
                                <div className="mt-2 text-xs text-blue-500">
                                    {translate('Applied Code Suggestions')}: {entry.autoSuggestedFixes.map(s => s.type).join(', ')}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    ), [generationHistory, handleFeedback, handleRegenerateFromHistory, translate]);

    // Invented: Global context provider for the entire application
    const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <ConfigProvider>
            <FeatureFlagProvider>
                <TelemetryProvider>
                    <AuthProvider>
                        <MultilingualProvider>
                            <ConventionalCommitProvider>
                                <ProjectSettingsProvider>
                                    <SubscriptionProvider>
                                        {children}
                                    </SubscriptionProvider>
                                </ProjectSettingsProvider>
                            </ConventionalCommitProvider>
                        </MultilingualProvider>
                    </AuthProvider>
                </TelemetryProvider>
            </FeatureFlagProvider>
        </ConfigProvider>
    );

    // This is the primary render function for the AiCommitGenerator component
    return (
        <AppProviders> {/* Wrap the entire component in invented providers */}
            <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary bg-background-main">
                <header className="mb-6 flex flex-col sm:flex-row justify-between items-center">
                    <h1 className="text-3xl font-bold flex items-center text-primary-brand">
                        <GitBranchIcon className="w-8 h-8 mr-3 text-primary-dark" />
                        <span className="ml-3">{translate('AI Commit Message Generator')}</span>
                    </h1>
                    <div className="flex items-center mt-3 sm:mt-0 gap-3">
                        {isAuthenticated ? (
                            <span className="text-sm text-text-secondary">{translate('Welcome,')} {user?.name || 'User'}! ({subscriptionTier})</span>
                        ) : (
                            <Button onClick={login} variant="secondary" size="sm">{translate('Login')}</Button>
                        )}
                        <Select
                            value={currentLanguage}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-surface-dark text-text-primary px-2 py-1 text-sm rounded-md"
                        >
                            <option value="en">🇬🇧 {translate('English')}</option>
                            <option value="es">🇪🇸 {translate('Spanish')}</option>
                            <option value="fr">🇫🇷 {translate('French')}</option>
                            <option value="de">🇩🇪 {translate('German')}</option>
                            <option value="ja">🇯🇵 {translate('Japanese')}</option>
                            <option value="zh">🇨🇳 {translate('Chinese')}</option>
                        </Select>
                        <Button onClick={() => setIsSettingsModalOpen(true)} variant="outline" size="sm">⚙️ {translate('Settings')}</Button>
                    </div>
                </header>
                <p className="text-text-secondary mt-1 mb-6 text-lg">
                    {translate('Leverage advanced AI to craft precise and conventional commit messages from your Git diffs. Powered by ')}
                    <span className="font-semibold text-primary-brand">CognitoCommit™️</span>.
                </p>

                {/* Invented: Tabs for Generator, History, Settings */}
                <Tabs selectedIndex={selectedTabIndex} onSelect={setSelectedTabIndex} className="flex-grow flex flex-col min-h-0">
                    <TabList className="flex border-b border-border-light mb-4">
                        <Tab className={`px-4 py-2 text-lg font-medium cursor-pointer ${selectedTabIndex === 0 ? 'text-primary-brand border-b-2 border-primary-brand' : 'text-text-secondary hover:text-text-primary'}`}>
                            {translate('Generator')}
                        </Tab>
                        <Tab className={`px-4 py-2 text-lg font-medium cursor-pointer ${selectedTabIndex === 1 ? 'text-primary-brand border-b-2 border-primary-brand' : 'text-text-secondary hover:text-text-primary'}`}>
                            {translate('History')} ({generationHistory.length})
                        </Tab>
                        <Tab className={`px-4 py-2 text-lg font-medium cursor-pointer ${selectedTabIndex === 2 ? 'text-primary-brand border-b-2 border-primary-brand' : 'text-text-secondary hover:text-text-primary'}`}>
                            {translate('Configuration')}
                        </Tab>
                    </TabList>

                    <TabPanel className="flex-grow flex flex-col min-h-0">
                        {/* Generator Panel Content */}
                        <div className="flex-grow flex flex-col gap-4 min-h-0">
                            <div className="flex flex-col flex-1 min-h-0">
                                <label htmlFor="diff-input" className="text-sm font-medium text-text-secondary mb-2">{translate('Git Diff Input')}</label>
                                {/* Invented: Input with optional VCS integration */}
                                <div className="relative flex-grow">
                                    <Textarea
                                        id="diff-input"
                                        value={rawDiffInput}
                                        onChange={(e) => setRawDiffInput(e.target.value)}
                                        placeholder={translate("Paste your git diff here, or connect to a VCS for automatic diff fetching...")}
                                        className="flex-grow p-4 bg-surface-dark border border-border rounded-md resize-none font-mono text-sm text-text-primary focus:ring-2 focus:ring-primary-brand focus:outline-none"
                                        rows={10} // More rows for better UX
                                    />
                                    {isFeatureEnabled('vcsIntegration') && hasProFeatures && (
                                        <div className="absolute top-2 right-2">
                                            <Tooltip content={translate("Fetch diff directly from your GitHub, GitLab, or Bitbucket repository.")}>
                                                <Button
                                                    onClick={async () => {
                                                        notificationService.info(translate('Connecting to GitHub to fetch latest diff...'));
                                                        // Invented: Call to VCS integration service
                                                        const latestDiff = await githubService.fetchLatestDiff(user?.vcsToken, projectSettings?.repoUrl);
                                                        if (latestDiff) {
                                                            setRawDiffInput(latestDiff);
                                                            notificationService.success(translate('Diff fetched successfully from GitHub!'));
                                                        } else {
                                                            notificationService.error(translate('Failed to fetch diff from GitHub.'));
                                                        }
                                                    }}
                                                    variant="secondary"
                                                    size="xs"
                                                    className="flex items-center gap-1"
                                                >
                                                    <GitBranchIcon className="w-4 h-4" /> {translate('Fetch Diff')}
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    )}
                                </div>
                                {diffParseResult && (
                                    <div className="text-xs text-text-tertiary mt-2">
                                        {translate('Files Changed:')} {diffParseResult.fileChanges.length}, {translate('Lines Added:')} {diffParseResult.linesAdded}, {translate('Lines Deleted:')} {diffParseResult.linesDeleted}
                                    </div>
                                )}
                            </div>

                            {/* Invented: Advanced Generation Options */}
                            <div className="flex flex-wrap items-center gap-3 py-2 border-t border-b border-border-light my-2">
                                <label className="text-sm font-medium text-text-secondary">{translate('Model:')}</label>
                                <Select
                                    value={generationOptions.model}
                                    onChange={(e) => setGenerationOptions(prev => ({ ...prev, model: e.target.value as AIModelIdentifier }))}
                                    className="bg-surface-dark px-2 py-1 text-sm rounded-md"
                                >
                                    <option value="gemini-pro">{translate('Gemini Pro')}</option>
                                    <option value="gpt-4o">{translate('ChatGPT-4o')}</option>
                                    {hasProFeatures && <option value="claude-3-opus">{translate('Anthropic Claude 3 Opus')}</option>}
                                    {hasProFeatures && <option value="burvel-proprietary-v2">{translate('Burvel Proprietary v2')}</option>}
                                </Select>

                                <Checkbox
                                    id="conventionalCommitOpt"
                                    checked={generationOptions.conventionalCommit}
                                    onChange={(e) => setGenerationOptions(prev => ({ ...prev, conventionalCommit: e.target.checked }))}
                                    label={translate("Conventional")}
                                />
                                {generationOptions.conventionalCommit && (
                                    <>
                                        <Select
                                            value={conventionalCommitPrefix || ''}
                                            onChange={(e) => setConventionalCommitPrefix(e.target.value)}
                                            className="bg-surface-dark px-2 py-1 text-sm rounded-md max-w-[150px]"
                                            aria-label={translate("Conventional Commit Type")}
                                        >
                                            <option value="">-- {translate('Type')} --</option>
                                            {conventionalCommitTypes.map(cc => (
                                                <option key={cc.type} value={cc.type}>{cc.emoji} {cc.type}</option>
                                            ))}
                                        </Select>
                                        <Select
                                            value={conventionalCommitScope || ''}
                                            onChange={(e) => setConventionalCommitScope(e.target.value)}
                                            className="bg-surface-dark px-2 py-1 text-sm rounded-md max-w-[150px]"
                                            aria-label={translate("Conventional Commit Scope")}
                                        >
                                            <option value="">-- {translate('Scope')} --</option>
                                            {commonCommitScopes.map(cs => (
                                                <option key={cs.scope} value={cs.scope}>{cs.scope}</option>
                                            ))}
                                        </Select>
                                    </>
                                )}

                                <Checkbox
                                    id="emojiSupportOpt"
                                    checked={generationOptions.emojiSupport}
                                    onChange={(e) => setGenerationOptions(prev => ({ ...prev, emojiSupport: e.target.checked }))}
                                    label={translate("Emojis")}
                                />

                                {isFeatureEnabled('issueTrackerIntegration') && hasProFeatures && (
                                    <Checkbox
                                        id="issueTrackingIntegrationOpt"
                                        checked={generationOptions.issueTrackingIntegration}
                                        onChange={(e) => setGenerationOptions(prev => ({ ...prev, issueTrackingIntegration: e.target.checked }))}
                                        label={translate("Link Issues")}
                                    />
                                )}
                            </div>

                            <div className="flex-shrink-0">
                                <Button
                                    onClick={() => handleGenerate(diff)}
                                    disabled={isLoading}
                                    className="btn-primary w-full max-w-xs mx-auto flex items-center justify-center px-6 py-3"
                                >
                                    {isLoading ? <LoadingSpinner /> : translate('Generate Commit Message')}
                                </Button>
                            </div>

                            <div className="flex flex-col flex-1 min-h-0">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-text-secondary">{translate('Generated Message')}</label>
                                    {message && !isLoading && (
                                        <div className="flex items-center gap-2">
                                            {isFeatureEnabled('richTextEditing') && hasProFeatures && (
                                                <Button onClick={handleMessageEdit} variant="outline" size="xs" className="px-3 py-1">
                                                    {translate('Save Edits')}
                                                </Button>
                                            )}
                                            <Button onClick={handleCopy} variant="outline" size="xs" className="px-3 py-1">
                                                {translate('Copy')}
                                            </Button>
                                            <Button onClick={handleDownload} variant="outline" size="xs" className="flex items-center gap-1 px-3 py-1">
                                                <ArrowDownTrayIcon className="w-4 h-4" /> {translate('Download')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="relative flex-grow p-4 bg-surface-dark border border-border rounded-md overflow-y-auto">
                                    {isLoading && (
                                        <div className="flex items-center justify-center h-full">
                                            <LoadingSpinner />
                                        </div>
                                    )}
                                    {error && <p className="text-red-500">{error}</p>}
                                    {message && !isLoading && (
                                        <pre
                                            ref={messageRef}
                                            className="whitespace-pre-wrap font-sans text-text-primary focus:outline-none"
                                            contentEditable={isFeatureEnabled('richTextEditing') && hasProFeatures} // Invented: Rich text editing
                                            suppressContentEditableWarning={true}
                                        >
                                            {message}
                                        </pre>
                                    )}
                                    {!isLoading && !message && !error && (
                                        <div className="text-text-secondary h-full flex items-center justify-center">
                                            {translate('The commit message will appear here after generation.')}
                                        </div>
                                    )}
                                </div>
                                {/* Invented: Code Review Suggestions & Semantic Versioning */}
                                {codeSuggestions.length > 0 && !isLoading && (
                                    <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-md">
                                        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">{translate('Code Review Suggestions (CodeScan Guardian)')}</h3>
                                        <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300">
                                            {codeSuggestions.map((suggestion, index) => (
                                                <li key={index}>{translate(suggestion.description)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {semanticVersionSuggestion && !isLoading && (
                                    <div className="mt-2 p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-md">
                                        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">{translate('Semantic Versioning Suggestion')}</h3>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            {translate('Based on your changes, we suggest a')} <span className="font-bold">{semanticVersionSuggestion}</span> {translate('version bump.')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel className="flex-grow flex flex-col min-h-0">
                        {/* History Panel Content */}
                        <HistoryPanel />
                    </TabPanel>

                    <TabPanel className="flex-grow flex flex-col min-h-0">
                        {/* Configuration Panel Content */}
                        <SettingsPanel />
                    </TabPanel>
                </Tabs>
            </div>
        </AppProviders>
    );
};

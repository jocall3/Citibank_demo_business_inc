// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React from 'react';
import { logError } from '../services/telemetryService.ts';
import { debugErrorStream } from '../services/aiService.ts';
import { SparklesIcon } from './icons.tsx';
import { MarkdownRenderer, LoadingSpinner } from './shared/index.tsx';

// --- BEGIN: New Imports for Advanced Error Handling & Services ---
// This section introduces a plethora of new services and utilities that have been
// developed or integrated over the years at Citibank Demo Business Inc.
// These imports are crucial for the advanced, commercial-grade functionality
// of this enhanced ErrorBoundary.

// Core Error Management & Utilities
import { generateUniqueId, debounce, throttle } from '../utils/utilityFunctions.ts'; // Invented: UtilityKit v1.0 by Project Chimera R&D Team
import { getApplicationConfig, FeatureFlagService } from '../config/appConfigService.ts'; // Invented: ConfigForge v2.1 by Corporate Standards Unit
import { ErrorContextManager, ErrorContextPayload } from '../services/error/errorContextManager.ts'; // Invented: ContextCapture Engine v3.0 by Diagnostic Guild
import { ErrorClassificationService, ErrorCategory, ErrorPriority } from '../services/error/errorClassificationService.ts'; // Invented: Categorization Nexus v1.5 by Semantic AI Lab
import { ErrorDeduplicationService } from '../services/error/errorDeduplicationService.ts'; // Invented: AnomalyShield Protocol v1.2 by Data Integrity Group
import { LocalErrorCacheService } from '../services/error/localErrorCacheService.ts'; // Invented: PersistSense Layer v0.9 by Offline Resilience Taskforce
import { ReportingCircuitBreaker, CircuitBreakerState } from '../services/error/reportingCircuitBreaker.ts'; // Invented: SentinelGuard v1.0 by Infrastructure Resilience Team
import { DataRedactionService } from '../services/security/dataRedactionService.ts'; // Invented: PII Scrubber Pro v2.0 by Compliance & Security Division
import { EventBusService } from '../services/eventBusService.ts'; // Invented: Intercom Fabric v1.0 by Microservices Core Team
import { GlobalStateSnapshotService } from '../services/state/globalStateSnapshotService.ts'; // Invented: ChronoCache v1.0 by State Management Innovations
import { UserJourneyService, UserJourneyStep } from '../services/userJourneyService.ts'; // Invented: PathTracer v1.0 by UX Analytics & Forensics
import { NetworkMonitorService, NetworkRequestInfo } from '../services/networkMonitorService.ts'; // Invented: NetScope Pro v2.0 by Connectivity Diagnostics
import { PerformanceMetricRecorder, PerformanceMetrics } from '../services/telemetry/performanceMetricRecorder.ts'; // Invented: VelocityGauge v1.0 by Performance Optics Team
import { ResourceMonitorService } from '../services/system/resourceMonitorService.ts'; // Invented: SystemHarvest v1.0 by Core Systems Metrics
import { AssetPreloadingService } from '../services/optimization/assetPreloadingService.ts'; // Invented: AheadLoader v1.0 by Frontend Performance Group

// AI Integrations (Beyond the initial debugErrorStream)
import { GeminiAIAssistant, GeminiResponse } from '../services/ai/geminiAIAssistant.ts'; // Invented: Gemini-Connect v1.0 by AI Integration Hub
import { ChatGPTAssistant, ChatGPTResponse } from '../services/ai/chatGPTAssistant.ts'; // Invented: GPT-Bridge v1.0 by AI Integration Hub
import { PredictiveFailureAnalysisModel, PredictiveAnalysisResult } from '../services/ai/predictiveFailureAnalysisModel.ts'; // Invented: Oracle-Predict v1.0 by Advanced AI Solutions
import { AutomatedFixSuggestionModel, FixSuggestion } from '../services/ai/automatedFixSuggestionModel.ts'; // Invented: AutoHeal v1.0 by AI Self-Correction Unit
import { AIOrchestratorService } from '../services/ai/aiOrchestratorService.ts'; // Invented: AIConductor v1.0 by Multi-AI Strategy Office
import { AnomalyDetectionService } from '../services/ai/anomalyDetectionService.ts'; // Invented: PatternBreaker v1.0 by Data Science Forensics

// External Service Integrations (Simulated for demonstration, representing up to 1000 services)
// These represent the vast ecosystem of monitoring, alerting, analytics, and incident management tools
// that a commercial-grade application like Citibank Demo Business Inc. would leverage.
import { SentryReportingService } from '../services/external/sentryReportingService.ts'; // Integrated: SentryBridge v4.0 by Third-Party Integrations Dept.
import { NewRelicMonitoringService } from '../services/external/newRelicMonitoringService.ts'; // Integrated: RelicProbe v3.0 by Observability Platform Team
import { DatadogErrorService } from '../services/external/datadogErrorService.ts'; // Integrated: DogStats Gateway v2.5 by Infrastructure Monitoring Group
import { RollbarIntegrationService } from '../services/external/rollbarIntegrationService.ts'; // Integrated: RollbarSync v2.0 by Frontend Reliability Bureau
import { BugsnagReportingService } from '../services/external/bugsnagReportingService.ts'; // Integrated: BugsnagLink v1.8 by Quality Assurance Automation
import { PagerDutyAlertService } from '../services/external/pagerDutyAlertService.ts'; // Integrated: PagerDutyRelay v3.1 by On-Call Operations Command
import { OpsgenieAlertService } from '../services/external/opsgenieAlertService.ts'; // Integrated: OpsgenieDirect v2.2 by Incident Response Center
import { SlackNotificationService } from '../services/external/slackNotificationService.ts'; // Integrated: SlackComm Link v5.0 by Internal Communications Hub
import { MicrosoftTeamsNotificationService } from '../services/external/msTeamsNotificationService.ts'; // Integrated: TeamsConnect v1.0 by Enterprise Collaboration Suite
import { JiraServiceDeskIntegration } from '../services/external/jiraServiceDeskIntegration.ts'; // Integrated: JiraBridge v3.5 by IT Service Management Solutions
import { ServiceNowIncidentManagement } from '../services/external/serviceNowIncidentManagement.ts'; // Integrated: ServiceNowFlow v2.0 by Enterprise IT Operations
import { ZendeskSupportService } from '../services/external/zendeskSupportService.ts'; // Integrated: ZendeskGateway v1.0 by Customer Support Systems
import { AmplitudeAnalyticsService } from '../services/external/amplitudeAnalyticsService.ts'; // Integrated: AmplitudeStream v2.0 by Marketing Intelligence Unit
import { MixpanelAnalyticsService } from '../services/external/mixpanelAnalyticsService.ts'; // Integrated: MixpanelFlow v1.5 by Product Analytics Division
import { GoogleAnalyticsService } from '../services/external/googleAnalyticsService.ts'; // Integrated: GA-Connector v4.0 by Web Performance & SEO Team
import { AdobeAnalyticsService } from '../services/external/adobeAnalyticsService.ts'; // Integrated: AdobeDataBridge v1.0 by Enterprise Data Platform
import { FullStorySessionReplay } from '../services/external/fullStorySessionReplay.ts'; // Integrated: FullStoryLens v2.0 by Customer Experience Lab
import { HotjarHeatmapIntegration } from '../services/external/hotjarHeatmapIntegration.ts'; // Integrated: HotjarSensor v1.0 by UI/UX Research Group
import { SecurityAuditLogService } from '../services/security/securityAuditLogService.ts'; // Integrated: SecuriTrace v1.0 by CyberSecurity Operations
import { GDPRComplianceService } from '../services/compliance/gdprComplianceService.ts'; // Integrated: GDPRGuard v1.0 by Legal & Regulatory Affairs
import { HIPAAComplianceService } from '../services/compliance/hipaaComplianceService.ts'; // Integrated: HIPAAWatch v1.0 by Healthcare Solutions Compliance
import { LaunchDarklyIntegration } from '../services/external/launchDarklyIntegration.ts'; // Integrated: FlagToggler v1.0 by Feature Management Office
import { OktaIntegrationService } from '../services/external/oktaIntegrationService.ts'; // Integrated: OktaAuthLink v2.0 by Identity & Access Management
import { Auth0UserManagement } from '../services/external/auth0UserManagement.ts'; // Integrated: Auth0Connect v1.0 by User Identity Services
import { APICallMonitorService } from '../services/network/apiCallMonitorService.ts'; // Invented: APIWatchtower v1.0 by Microservices Observability
import { CDNEdgeCacheInvalidationService } from '../services/network/cdnEdgeCacheInvalidationService.ts'; // Invented: EdgeFlush v1.0 by Network Operations & Delivery
import { GitOpsDeploymentService } from '../services/deployment/gitOpsDeploymentService.ts'; // Integrated: GitOpsReporter v1.0 by DevOps Automation Guild
import { ArgoCDRollbackTrigger } from '../services/deployment/argoCDRollbackTrigger.ts'; // Integrated: ArgoCD-Flow v1.0 by Continuous Delivery Systems
import { VoiceInputService } from '../services/ux/voiceInputService.ts'; // Invented: SonicCapture v1.0 by Accessibility & Innovation Lab
import { QRCodeGeneratorService } from '../services/ux/qrCodeGeneratorService.ts'; // Invented: QR-Linker v1.0 by Mobile Engagement Team
import { UserFeedbackService } from '../services/ux/userFeedbackService.ts'; // Invented: VoiceOfCustomer v1.0 by Product Insights Team
import { ScreenshotService } from '../services/ux/screenshotService.ts'; // Invented: PixelCapture v1.0 by Frontend Tooling Unit
import { ComponentRegistryService } from '../services/component/componentRegistryService.ts'; // Invented: ReactComponentHub v1.0 by Frontend Architecture Group
import { NotificationService } from '../services/notificationService.ts'; // Invented: AlertStream v1.0 by Communication Platform

// Icons and UI Components (Expanded)
import { BugIcon, RefreshCwIcon, LifeBuoyIcon, AlertCircleIcon, ShieldOffIcon, GitForkIcon, MicIcon, QrCodeIcon, MessageSquareTextIcon, InfoIcon, ClockIcon } from 'lucide-react'; // External icon library for richer UI

// --- END: New Imports ---

// --- BEGIN: New Interfaces, Enums, and Types ---
// These definitions provide the structure for the vast amount of data and
// functionality managed by the enhanced ErrorBoundary.
// Invented by: Data Schema & Governance Board

export enum RecoveryStrategy {
  RELOAD_APPLICATION = 'RELOAD_APPLICATION',
  RESET_COMPONENT_STATE = 'RESET_COMPONENT_STATE',
  CLEAR_LOCAL_STORAGE = 'CLEAR_LOCAL_STORAGE',
  ACTIVATE_SAFE_MODE = 'ACTIVATE_SAFE_MODE',
  REPORT_TO_DEV_TEAM = 'REPORT_TO_DEV_TEAM',
  ASK_AI_DEBUGGER = 'ASK_AI_DEBUGGER',
  TRY_ROLLBACK = 'TRY_ROLLBACK', // For critical deployment-related issues
  NONE = 'NONE',
}

export interface RecoveryOption {
  strategy: RecoveryStrategy;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  severity: ErrorPriority;
  requiresConfirmation?: boolean;
}

export interface ErrorDiagnosticContext {
  id: string; // Unique ID for this error instance
  timestamp: string;
  userAgent: string;
  url: string;
  routeHistory: UserJourneyStep[];
  applicationStateSnapshot: Record<string, any>;
  networkRequests: NetworkRequestInfo[];
  featureFlags: Record<string, any>;
  localStorageSnapshot: Record<string, string | null>;
  sessionStorageSnapshot: Record<string, string | null>;
  deviceInfo: Record<string, any>; // e.g., screen size, CPU/RAM usage from ResourceMonitorService
  userProfile?: Record<string, any>; // Sanitized user info from Auth0/Okta
  componentStack: string | null;
  errorCategory: ErrorCategory;
  errorPriority: ErrorPriority;
  predictedRootCause?: PredictiveAnalysisResult;
  suggestedFixes?: FixSuggestion[];
  aiDebugAnalysis?: string;
  fullStorySessionURL?: string; // Link to session replay
  incidentTicketId?: string; // ID from Jira/ServiceNow
  isCriticalDeploymentIssue?: boolean;
  performanceMetrics?: PerformanceMetrics;
}

// Global configuration for the ErrorBoundary, invented by the "Configuration Overlord" module.
export interface ErrorBoundaryConfig {
  enableAiDebugging: boolean;
  enableAdvancedTelemetry: boolean;
  enableSessionReplay: boolean;
  enablePredictiveAnalysis: boolean;
  enableAutomatedFixSuggestions: boolean;
  enableUserFeedback: boolean;
  enableVoiceCommands: boolean;
  maxErrorCacheSize: number;
  reportIntervalMs: number;
  criticalErrorThreshold: number; // Number of errors per interval to trigger critical alerts
  safeModeRoute: string;
  debugMode: boolean; // Shows extra developer info
  aiTimeoutMs: number;
  redactPII: boolean;
  allowedRecoveryStrategies: RecoveryStrategy[];
}

// State interface for the enhanced ErrorBoundary
interface EnhancedState extends State {
  errorId: string;
  errorContext: ErrorDiagnosticContext | null;
  recoveryOptions: RecoveryOption[];
  isRecovering: boolean;
  isReporting: boolean;
  isAiAnalyzingRootCause: boolean;
  aiRootCauseAnalysis: string;
  isAiSuggestingFixes: boolean;
  aiSuggestedFixes: FixSuggestion[];
  showAdvancedDiagnostics: boolean;
  userFeedbackModalOpen: boolean;
  screenshotDataUrl: string | null;
  voiceCommandActive: boolean;
  qrCodeUrl: string | null;
  errorBoundaryPerformance: PerformanceMetrics | null;
}

// --- END: New Interfaces, Enums, and Types ---

// --- BEGIN: New Top-Level Services and Utilities ---

// Story: "The Rise of Error Intelligence Platform (EIP)"
// Citibank Demo Business Inc. recognized that merely logging errors was insufficient.
// They needed an intelligent platform to collect, classify, analyze, and react to errors.
// This led to the creation of several specialized services, each meticulously crafted
// to provide commercial-grade reliability and insight.

// Global instance for configuration, invented by "Configuration Overlord"
export const errorBoundaryConfig: ErrorBoundaryConfig = {
  enableAiDebugging: getApplicationConfig('errorBoundary.enableAiDebugging', true),
  enableAdvancedTelemetry: getApplicationConfig('errorBoundary.enableAdvancedTelemetry', true),
  enableSessionReplay: getApplicationConfig('errorBoundary.enableSessionReplay', true),
  enablePredictiveAnalysis: getApplicationConfig('errorBoundary.enablePredictiveAnalysis', false), // Initially cautious with new AI features
  enableAutomatedFixSuggestions: getApplicationConfig('errorBoundary.enableAutomatedFixSuggestions', false),
  enableUserFeedback: getApplicationConfig('errorBoundary.enableUserFeedback', true),
  enableVoiceCommands: getApplicationConfig('errorBoundary.enableVoiceCommands', false), // Enabled only on specific platforms
  maxErrorCacheSize: getApplicationConfig('errorBoundary.maxErrorCacheSize', 100),
  reportIntervalMs: getApplicationConfig('errorBoundary.reportIntervalMs', 30000), // Report every 30 seconds
  criticalErrorThreshold: getApplicationConfig('errorBoundary.criticalErrorThreshold', 5), // 5 errors in 30s is critical
  safeModeRoute: getApplicationConfig('errorBoundary.safeModeRoute', '/safe-mode'),
  debugMode: getApplicationConfig('app.debugMode', false), // Inherit from general app debug mode
  aiTimeoutMs: getApplicationConfig('errorBoundary.aiTimeoutMs', 60000), // 60 seconds for AI response
  redactPII: getApplicationConfig('security.redactPII', true),
  allowedRecoveryStrategies: getApplicationConfig('errorBoundary.allowedRecoveryStrategies', [
    RecoveryStrategy.RELOAD_APPLICATION,
    RecoveryStrategy.ASK_AI_DEBUGGER,
    RecoveryStrategy.REPORT_TO_DEV_TEAM,
    RecoveryStrategy.CLEAR_LOCAL_STORAGE,
  ]),
};

// --- Error Reporting & Management Services ---
// Invented by: Reliability Engineering Division, Lead: Dr. Anya Sharma

export class EnhancedErrorReporter {
  private deduplicationService = ErrorDeduplicationService.getInstance();
  private circuitBreaker = ReportingCircuitBreaker.getInstance();
  private localErrorCache = LocalErrorCacheService.getInstance();
  private lastReportTime = 0;
  private criticalErrorCount = 0;

  constructor() {
    // Attempt to send any cached errors on startup
    this.sendCachedErrors();
    setInterval(() => this.checkCriticalErrors(), errorBoundaryConfig.reportIntervalMs / 2); // Check every half interval
  }

  // Story: "Project Phoenix - Automated Resilience"
  // The `sendCachedErrors` was an early win from Project Phoenix, ensuring that even if
  // a user lost network connectivity during an error, the report would eventually be sent.
  private async sendCachedErrors() {
    const cachedErrors = this.localErrorCache.getErrors();
    if (cachedErrors.length > 0) {
      console.log(`[EnhancedErrorReporter] Found ${cachedErrors.length} cached errors. Attempting to send.`);
      for (const errorData of cachedErrors) {
        await this.reportErrorToAllServices(errorData.error, errorData.context);
        this.localErrorCache.removeError(errorData.id); // Remove after successful send
      }
    }
  }

  private checkCriticalErrors() {
    if (this.criticalErrorCount >= errorBoundaryConfig.criticalErrorThreshold) {
      console.warn(`[EnhancedErrorReporter] Critical error threshold reached: ${this.criticalErrorCount} errors. Triggering critical incident.`);
      PagerDutyAlertService.triggerCriticalIncident(`Critical Error Spikes Detected: ${this.criticalErrorCount} errors within ${errorBoundaryConfig.reportIntervalMs / 1000}s`);
      OpsgenieAlertService.createHighPriorityAlert(`Application instability detected due to ${this.criticalErrorCount} errors.`);
      SlackNotificationService.sendCriticalAlert('ops-alerts', `<!channel> CRITICAL: High volume of errors detected. Application may be unstable. Count: ${this.criticalErrorCount}`);
      this.criticalErrorCount = 0; // Reset after alerting
    }
  }

  // Story: "Global Sentinel - Multi-Channel Error Distribution"
  // When an error occurs, it's not enough to send it to one place. Global Sentinel ensures
  // that all relevant stakeholders – developers, operations, product, security – are informed
  // through their preferred channels and tools, while respecting rate limits and circuit breakers.
  public async reportError(error: Error, context: ErrorDiagnosticContext): Promise<void> {
    if (this.deduplicationService.isDuplicate(error, context)) {
      console.log('[EnhancedErrorReporter] Deduplicating error:', error.message);
      return;
    }

    if (this.circuitBreaker.getState() === CircuitBreakerState.OPEN) {
      console.warn('[EnhancedErrorReporter] Circuit breaker is OPEN. Not reporting error to external services.');
      this.localErrorCache.addError({ id: context.id, error, context });
      return;
    }

    // Story: "The Data Sanitizer"
    // Developed by the Compliance & Security Division, the DataRedactionService ensures
    // that no Personally Identifiable Information (PII) or sensitive corporate data
    // inadvertently leaks into external logging and monitoring systems.
    const sanitizedContext = errorBoundaryConfig.redactPII
      ? DataRedactionService.redactSensitiveData(context)
      : context;

    // Local logging
    logError(error, sanitizedContext);
    this.localErrorCache.addError({ id: context.id, error, context: sanitizedContext });
    this.criticalErrorCount++;

    // Asynchronously report to all configured external services
    this.reportErrorToAllServices(error, sanitizedContext);

    this.deduplicationService.addError(error, context);
  }

  // Story: "OmniChannel Reporting Framework"
  // A core component of the EIP, this framework orchestrates error reporting
  // to a multitude of internal and external services.
  private async reportErrorToAllServices(error: Error, context: ErrorDiagnosticContext): Promise<void> {
    const errorPayload = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context,
    };

    try {
      if (FeatureFlagService.isEnabled('sentryReporting')) {
        SentryReportingService.captureException(error, errorPayload);
      }
      if (FeatureFlagService.isEnabled('newRelicReporting')) {
        NewRelicMonitoringService.recordError(error, errorPayload);
      }
      if (FeatureFlagService.isEnabled('datadogReporting')) {
        DatadogErrorService.sendError(errorPayload);
      }
      if (FeatureFlagService.isEnabled('rollbarReporting')) {
        RollbarIntegrationService.reportError(error, errorPayload);
      }
      if (FeatureFlagService.isEnabled('bugsnagReporting')) {
        BugsnagReportingService.notify(error, errorPayload);
      }

      // Incident Management
      if (FeatureFlagService.isEnabled('jiraServiceDesk')) {
        const ticketId = await JiraServiceDeskIntegration.createIssue(error.message, JSON.stringify(errorPayload, null, 2), context.errorPriority);
        if (ticketId) {
          context.incidentTicketId = ticketId;
          console.log(`[EnhancedErrorReporter] Jira ticket created: ${ticketId}`);
        }
      }
      if (FeatureFlagService.isEnabled('serviceNowIncident')) {
        const incidentId = await ServiceNowIncidentManagement.createIncident(error.message, JSON.stringify(errorPayload, null, 2), context.errorPriority);
        if (incidentId) {
          context.incidentTicketId = incidentId;
          console.log(`[EnhancedErrorReporter] ServiceNow incident created: ${incidentId}`);
        }
      }

      // Analytics
      if (FeatureFlagService.isEnabled('amplitudeAnalytics')) {
        AmplitudeAnalyticsService.trackEvent('Application Error', { errorName: error.name, category: context.errorCategory });
      }
      if (FeatureFlagService.isEnabled('mixpanelAnalytics')) {
        MixpanelAnalyticsService.trackEvent('Application Error', { errorName: error.name, category: context.errorCategory });
      }
      if (FeatureFlagService.isEnabled('googleAnalytics')) {
        GoogleAnalyticsService.trackEvent('Error', 'Application Crash', error.message);
      }
      if (FeatureFlagService.isEnabled('adobeAnalytics')) {
        AdobeAnalyticsService.track('applicationError', { errorName: error.name, category: context.errorCategory });
      }

      // UX Monitoring
      if (FeatureFlagService.isEnabled('fullStorySessionReplay')) {
        // Assume FullStory context is already collected or a session URL can be generated.
        // For simplicity here, we'll just log its intent. In a real scenario, this would
        // involve getting the session URL from the FullStory SDK.
        const sessionUrl = FullStorySessionReplay.getSessionURL();
        if (sessionUrl) {
          context.fullStorySessionURL = sessionUrl;
          console.log(`[EnhancedErrorReporter] FullStory session replay URL: ${sessionUrl}`);
        }
      }
      if (FeatureFlagService.isEnabled('hotjarHeatmap')) {
        // Hotjar typically tracks page interactions, no direct error reporting here,
        // but useful for observing user behavior on the error page itself.
        HotjarHeatmapIntegration.trackEvent('Error Page Displayed');
      }

      // Security Logging (if deemed a security-related error)
      if (context.errorCategory === ErrorCategory.SECURITY) {
        SecurityAuditLogService.logSecurityIncident(`Potential security incident: ${error.message}`, errorPayload);
      }

      // Notify internal teams
      SlackNotificationService.sendMessage('dev-errors', `New error detected: *${error.name}* - ${error.message} (Priority: ${context.errorPriority})`);
      MicrosoftTeamsNotificationService.sendMessage('dev-alerts', `Error Alert: ${error.name} - ${error.message}`);
      NotificationService.showNotification({
        title: `Error: ${error.name}`,
        message: 'An application error has been reported to the development team.',
        type: 'error',
      });

      // Clear the critical error count for successful reporting
      this.criticalErrorCount = 0;

    } catch (serviceError) {
      console.error('[EnhancedErrorReporter] Failed to report error to one or more external services:', serviceError);
      // If many services fail, consider opening the circuit breaker for reporting
      this.circuitBreaker.recordFailure();
      // Re-add to local cache for retry
      this.localErrorCache.addError({ id: context.id, error, context });
    } finally {
      this.circuitBreaker.recordSuccess();
    }
  }

  // Story: "The Critical Deployment Issue Detector"
  // For errors related to deployment, it's crucial to differentiate and potentially
  // trigger automated rollbacks or specialized alerts.
  public async detectAndHandleDeploymentErrors(error: Error, context: ErrorDiagnosticContext): Promise<boolean> {
    if (error.message.includes('ChunkLoadError') || error.message.includes('failed to fetch dynamically imported module')) {
      console.warn('[EnhancedErrorReporter] Detected potential deployment-related error (ChunkLoadError).');
      context.isCriticalDeploymentIssue = true;
      context.errorCategory = ErrorCategory.DEPLOYMENT;
      context.errorPriority = ErrorPriority.CRITICAL;

      GitOpsDeploymentService.reportStaleAssetError(error.message, context);
      CDNEdgeCacheInvalidationService.invalidateCache(window.location.origin);
      PagerDutyAlertService.triggerHighPriorityIncident('Deployment Failure Detected: Stale Assets/ChunkLoadError');

      if (FeatureFlagService.isEnabled('autoArgoCDRollback') && context.errorPriority === ErrorPriority.CRITICAL) {
        console.log('[EnhancedErrorReporter] Attempting automated ArgoCD rollback due to critical deployment error.');
        ArgoCDRollbackTrigger.triggerRollback('Automated rollback due to client-side deployment error.');
        NotificationService.showNotification({
          title: 'Critical Deployment Error!',
          message: 'An automated rollback has been initiated. Please wait for the application to stabilize.',
          type: 'critical',
        });
      }
      return true;
    }
    return false;
  }
}

export const enhancedErrorReporter = new EnhancedErrorReporter(); // Singleton instance

// --- AI Orchestration and Analysis Services ---
// Invented by: AI Integration Hub, Lead: Dr. Aris Thorne

export class EnhancedAIAssistant {
  private aiOrchestrator = AIOrchestratorService.getInstance();
  private geminiAssistant = GeminiAIAssistant.getInstance();
  private chatGPTAssistant = ChatGPTAssistant.getInstance();

  // Story: "Cognitive Nexus - Multi-AI Debugging"
  // The `analyzeErrorWithAI` function is the cornerstone of the Cognitive Nexus initiative.
  // It intelligently routes error debugging requests to the most suitable AI model (Gemini, ChatGPT, or custom)
  // based on the context and desired outcome.
  public async analyzeErrorWithAI(error: Error, context: ErrorDiagnosticContext, type: 'debug' | 'root_cause' | 'fix_suggestion'): Promise<string | FixSuggestion[] | PredictiveAnalysisResult> {
    const prompt = this.generateAIPrompt(error, context, type);

    try {
      if (type === 'debug') {
        // Use streaming for initial debug help (like the original implementation)
        const stream = debugErrorStream(error, prompt); // This still uses the existing aiService, now with enriched prompt.
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk;
        }
        return fullResponse;
      }

      // For more structured analysis, use specific AI models via orchestrator
      const aiModel = this.aiOrchestrator.determineBestAIForTask(type, context.errorCategory);
      console.log(`[EnhancedAIAssistant] Routing AI request to: ${aiModel}`);

      switch (aiModel) {
        case 'Gemini':
          const geminiResponse: GeminiResponse = await this.geminiAssistant.getStructuredAnalysis(prompt, type);
          if (type === 'root_cause') return geminiResponse.rootCauseAnalysis || 'No root cause identified by Gemini.';
          if (type === 'fix_suggestion') return geminiResponse.suggestedFixes || [];
          break; // Should not happen for 'debug' type here
        case 'ChatGPT':
          const chatGPTResponse: ChatGPTResponse = await this.chatGPTAssistant.getConversationalAnalysis(prompt, type);
          if (type === 'root_cause') return chatGPTResponse.detailedAnalysis || 'No detailed analysis from ChatGPT.';
          if (type === 'fix_suggestion') return chatGPTResponse.actionableSteps || [];
          break;
        case 'CustomML':
          // Story: "Oracle-Predict & AutoHeal - The Foretelling Algorithms"
          // These custom models, trained on Citibank Demo Business Inc.'s historical error data,
          // provide highly specialized predictive and prescriptive capabilities.
          if (type === 'root_cause' && errorBoundaryConfig.enablePredictiveAnalysis) {
            return await PredictiveFailureAnalysisModel.predictRootCause(error, context);
          }
          if (type === 'fix_suggestion' && errorBoundaryConfig.enableAutomatedFixSuggestions) {
            return await AutomatedFixSuggestionModel.suggestFixes(error, context);
          }
          break;
        default:
          console.warn(`[EnhancedAIAssistant] Unknown AI model requested: ${aiModel}`);
          return `AI assistant could not process request with model: ${aiModel}.`;
      }
    } catch (e) {
      console.error('[EnhancedAIAssistant] Error during AI analysis:', e);
      return `Sorry, AI analysis failed: ${(e as Error).message}`;
    }
    return `AI analysis service failed for type: ${type}.`;
  }

  // Helper to generate a comprehensive prompt
  private generateAIPrompt(error: Error, context: ErrorDiagnosticContext, type: string): string {
    let basePrompt = `An error occurred in a React application. Please provide a ${type === 'root_cause' ? 'root cause analysis' : type === 'fix_suggestion' ? 'fix suggestions' : 'debugging help'} based on the following information.\n`;
    basePrompt += `Error Message: ${error.message}\n`;
    basePrompt += `Error Name: ${error.name}\n`;
    basePrompt += `Stack Trace: ${error.stack}\n`;
    basePrompt += `Error Category: ${context.errorCategory}\n`;
    basePrompt += `Error Priority: ${context.errorPriority}\n`;
    basePrompt += `User Agent: ${context.userAgent}\n`;
    basePrompt += `Current URL: ${context.url}\n`;
    basePrompt += `User Journey: ${context.routeHistory.map(step => `${step.timestamp}: ${step.path}`).join(' -> ')}\n`;
    basePrompt += `Feature Flags: ${JSON.stringify(context.featureFlags)}\n`;
    basePrompt += `Application State Snapshot (relevant parts): ${JSON.stringify(context.applicationStateSnapshot?.mainModule || {}, null, 2)}\n`;
    basePrompt += `Network Requests (recent failures): ${JSON.stringify(context.networkRequests.filter(req => req.status >= 400), null, 2)}\n`;
    basePrompt += `Device Info: ${JSON.stringify(context.deviceInfo, null, 2)}\n`;
    // Add more context as needed
    return basePrompt;
  }
}

export const enhancedAIAssistant = new EnhancedAIAssistant(); // Singleton instance

// --- Self-Healing & Recovery Services ---
// Invented by: Resilience Engineering Squad, Lead: Dr. Kai Chen

export class SelfHealingService {
  // Story: "Phoenix Protocol - Intelligent Recovery"
  // The Phoenix Protocol enables the application to attempt various recovery strategies,
  // from simple reloads to clearing corrupted local state, all while providing feedback.
  public async executeRecovery(strategy: RecoveryStrategy, errorContext: ErrorDiagnosticContext | null = null) {
    NotificationService.showNotification({
      title: 'Attempting Recovery',
      message: `Executing strategy: ${strategy.replace(/_/g, ' ')}...`,
      type: 'info',
      duration: 5000,
    });
    console.log(`[SelfHealingService] Executing recovery strategy: ${strategy}`);
    try {
      switch (strategy) {
        case RecoveryStrategy.RELOAD_APPLICATION:
          window.location.reload();
          break;
        case RecoveryStrategy.RESET_COMPONENT_STATE:
          // This would require individual components to register their reset logic
          // Invented by: Component Lifecycle Management Team, "StateCustodian" module
          ComponentRegistryService.resetAllRegisteredComponents();
          NotificationService.showNotification({
            title: 'Component States Reset',
            message: 'Attempted to reset individual component states.',
            type: 'success',
          });
          break;
        case RecoveryStrategy.CLEAR_LOCAL_STORAGE:
          localStorage.clear();
          sessionStorage.clear();
          NotificationService.showNotification({
            title: 'Cleared Local Data',
            message: 'All local storage and session storage has been cleared. Reloading...',
            type: 'warning',
          });
          window.location.reload();
          break;
        case RecoveryStrategy.ACTIVATE_SAFE_MODE:
          window.location.href = errorBoundaryConfig.safeModeRoute;
          break;
        case RecoveryStrategy.REPORT_TO_DEV_TEAM:
          if (errorContext) {
            enhancedErrorReporter.reportError(new Error('User-initiated report'), {
              ...errorContext,
              id: generateUniqueId(),
              errorCategory: ErrorCategory.USER_FEEDBACK,
              errorPriority: ErrorPriority.MEDIUM,
            });
            NotificationService.showNotification({
              title: 'Issue Reported',
              message: 'Thank you! The issue has been reported to our development team.',
              type: 'success',
            });
          }
          break;
        case RecoveryStrategy.TRY_ROLLBACK:
          if (errorContext?.isCriticalDeploymentIssue) {
            await ArgoCDRollbackTrigger.triggerRollback(`User-requested rollback for error ID: ${errorContext.id}`);
            NotificationService.showNotification({
              title: 'Rollback Initiated',
              message: 'A deployment rollback has been requested. Please wait while the system recovers.',
              type: 'critical',
            });
          } else {
            NotificationService.showNotification({
              title: 'Rollback Not Applicable',
              message: 'This recovery strategy is only for critical deployment issues.',
              type: 'error',
            });
          }
          break;
        case RecoveryStrategy.ASK_AI_DEBUGGER:
        case RecoveryStrategy.NONE:
          // These are handled separately or are passive
          break;
      }
    } catch (e) {
      console.error(`[SelfHealingService] Error during recovery strategy ${strategy}:`, e);
      NotificationService.showNotification({
        title: 'Recovery Failed',
        message: `Failed to execute ${strategy.replace(/_/g, ' ')}. Please try another option.`,
        type: 'error',
      });
    }
  }
}

export const selfHealingService = new SelfHealingService(); // Singleton instance

// --- User Feedback & Interaction Services ---
// Invented by: Customer Engagement & Product Experience Team, Lead: Dr. Lena Petrova

export class UserExperienceEnhancer {
  private voiceInputService = VoiceInputService.getInstance();

  // Story: "VoiceOfCustomer Suite - Empowering Users"
  // To give users more control and a direct line to support, the VoiceOfCustomer Suite
  // introduced user feedback forms, screenshot capture, and even voice commands on error pages.
  public async captureUserFeedback(error: Error, context: ErrorDiagnosticContext, feedback: string, screenshot?: string) {
    await UserFeedbackService.submitFeedback({
      errorId: context.id,
      errorSummary: error.message,
      feedback,
      screenshotDataUrl: screenshot,
      userAgent: context.userAgent,
      url: context.url,
      userProfile: context.userProfile,
      appVersion: getApplicationConfig('app.version', 'unknown'),
    });
    console.log('[UserExperienceEnhancer] User feedback submitted.');
  }

  public async startVoiceCommandRecognition(onCommand: (command: string) => void, onError: (error: string) => void) {
    if (!errorBoundaryConfig.enableVoiceCommands) {
      onError('Voice commands are not enabled for this environment.');
      return;
    }
    this.voiceInputService.startRecognition(onCommand, onError);
  }

  public stopVoiceCommandRecognition() {
    this.voiceInputService.stopRecognition();
  }

  public async generateErrorQRCode(errorId: string, errorSummary: string): Promise<string | null> {
    const errorPageUrl = `${window.location.origin}/error?id=${errorId}&summary=${encodeURIComponent(errorSummary)}`;
    return await QRCodeGeneratorService.generateQRCode(errorPageUrl, 256);
  }

  public async captureScreenshot(): Promise<string | null> {
    try {
      return await ScreenshotService.captureViewportScreenshot();
    } catch (e) {
      console.error('[UserExperienceEnhancer] Failed to capture screenshot:', e);
      return null;
    }
  }
}

export const userExperienceEnhancer = new UserExperienceEnhancer(); // Singleton instance

// --- END: New Top-Level Services and Utilities ---

// Story: "The Sentinel Prime - ErrorBoundary Evolution"
// Over multiple iterations, the `ErrorBoundary` evolved from a simple catch-all to a sophisticated
// "Sentinel Prime" – a highly configurable, intelligent, and resilient component, crucial for
// maintaining the high availability and user trust expected from Citibank Demo Business Inc.'s applications.

export class ErrorBoundary extends React.Component<Props, EnhancedState> {
  // Invented by: ErrorBoundary Core Team, Lead: James Burvel O'Callaghan III
  // "Our mission is to make sure no error goes unhandled or unanalyzed." - J.B.O. III

  private errorReporter = enhancedErrorReporter;
  private aiAssistant = enhancedAIAssistant;
  private selfHealing = selfHealingService;
  private uxEnhancer = userExperienceEnhancer;
  private performanceMonitor = new PerformanceMetricRecorder('ErrorBoundary'); // Invented: VelocityGauge v1.0

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      aiHelp: '',
      isAiLoading: false,
      errorId: generateUniqueId(),
      errorContext: null,
      recoveryOptions: [],
      isRecovering: false,
      isReporting: false,
      isAiAnalyzingRootCause: false,
      aiRootCauseAnalysis: '',
      isAiSuggestingFixes: false,
      aiSuggestedFixes: [],
      showAdvancedDiagnostics: errorBoundaryConfig.debugMode,
      userFeedbackModalOpen: false,
      screenshotDataUrl: null,
      voiceCommandActive: false,
      qrCodeUrl: null,
      errorBoundaryPerformance: null,
    };
    // Story: "The Event Dispatcher" - Centralized communication within the boundary
    EventBusService.on('errorBoundary:command', this.handleVoiceCommand);
    EventBusService.on('errorBoundary:toggleDiagnostics', this.toggleAdvancedDiagnostics);
  }

  static getDerivedStateFromError(error: Error): Partial<EnhancedState> {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.performanceMonitor.start('componentDidCatch');
    const errorId = generateUniqueId();

    // Story: "Context Harvest - The Full Picture"
    // The `ErrorContextManager` was a breakthrough. It gathers a comprehensive snapshot
    // of the application's state, user journey, network activity, and environment
    // at the exact moment of error, providing invaluable context for debugging.
    const context: ErrorDiagnosticContext = {
      id: errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      routeHistory: UserJourneyService.getJourney(),
      applicationStateSnapshot: GlobalStateSnapshotService.getSnapshot(),
      networkRequests: NetworkMonitorService.getRecentRequests(),
      featureFlags: FeatureFlagService.getAllFlags(),
      localStorageSnapshot: ErrorContextManager.getLocalStorageSnapshot(),
      sessionStorageSnapshot: ErrorContextManager.getSessionStorageSnapshot(),
      deviceInfo: ResourceMonitorService.getDeviceMetrics(),
      userProfile: OktaIntegrationService.getUserProfile() || Auth0UserManagement.getUserProfile(),
      componentStack: errorInfo.componentStack,
      errorCategory: ErrorCategory.UNKNOWN, // Will be classified
      errorPriority: ErrorPriority.MEDIUM, // Will be prioritized
    };

    // Classify and prioritize the error
    context.errorCategory = ErrorClassificationService.classify(error, context);
    context.errorPriority = ErrorClassificationService.prioritize(error, context);

    // Story: "Automated Deployment Error Detection" - A proactive measure
    const isDeploymentError = await this.errorReporter.detectAndHandleDeploymentErrors(error, context);
    if (isDeploymentError) {
      context.isCriticalDeploymentIssue = true;
    }

    this.setState({
      errorId,
      errorContext: context,
      qrCodeUrl: await this.uxEnhancer.generateErrorQRCode(errorId, error.message),
    }, async () => {
      // Report error after state is updated with full context
      await this.errorReporter.reportError(error, this.state.errorContext!);
      this.performanceMonitor.stop('componentDidCatch');
      this.setState({ errorBoundaryPerformance: this.performanceMonitor.getMetrics() });
      this.determineRecoveryOptions();
    });
  }

  componentWillUnmount() {
    EventBusService.off('errorBoundary:command', this.handleVoiceCommand);
    EventBusService.off('errorBoundary:toggleDiagnostics', this.toggleAdvancedDiagnostics);
    this.uxEnhancer.stopVoiceCommandRecognition(); // Ensure voice recognition is off
  }

  // Story: "The Tactical Recovery Unit"
  // Dynamically determines available recovery options based on the error context,
  // user permissions, and enabled feature flags.
  private determineRecoveryOptions = () => {
    const { errorContext } = this.state;
    if (!errorContext) return;

    const options: RecoveryOption[] = [];

    if (errorBoundaryConfig.allowedRecoveryStrategies.includes(RecoveryStrategy.RELOAD_APPLICATION)) {
      options.push({
        strategy: RecoveryStrategy.RELOAD_APPLICATION,
        label: 'Reload Application',
        icon: <RefreshCwIcon size={16} />,
        action: this.handleRevert,
        severity: ErrorPriority.LOW,
      });
    }

    if (errorBoundaryConfig.enableAiDebugging && errorBoundaryConfig.allowedRecoveryStrategies.includes(RecoveryStrategy.ASK_AI_DEBUGGER)) {
      options.push({
        strategy: RecoveryStrategy.ASK_AI_DEBUGGER,
        label: 'Ask AI for Help',
        icon: <SparklesIcon />,
        action: this.handleAskAi,
        severity: ErrorPriority.MEDIUM,
      });
    }

    if (errorBoundaryConfig.allowedRecoveryStrategies.includes(RecoveryStrategy.CLEAR_LOCAL_STORAGE)) {
      options.push({
        strategy: RecoveryStrategy.CLEAR_LOCAL_STORAGE,
        label: 'Clear Local Data & Reload',
        icon: <AlertCircleIcon size={16} />,
        action: () => this.selfHealing.executeRecovery(RecoveryStrategy.CLEAR_LOCAL_STORAGE),
        severity: ErrorPriority.HIGH,
        requiresConfirmation: true,
      });
    }

    if (errorBoundaryConfig.allowedRecoveryStrategies.includes(RecoveryStrategy.ACTIVATE_SAFE_MODE) && errorContext.errorPriority === ErrorPriority.CRITICAL) {
      options.push({
        strategy: RecoveryStrategy.ACTIVATE_SAFE_MODE,
        label: 'Activate Safe Mode',
        icon: <ShieldOffIcon size={16} />,
        action: () => this.selfHealing.executeRecovery(RecoveryStrategy.ACTIVATE_SAFE_MODE),
        severity: ErrorPriority.CRITICAL,
      });
    }

    if (errorContext.isCriticalDeploymentIssue && errorBoundaryConfig.allowedRecoveryStrategies.includes(RecoveryStrategy.TRY_ROLLBACK)) {
      options.push({
        strategy: RecoveryStrategy.TRY_ROLLBACK,
        label: 'Attempt Deployment Rollback',
        icon: <GitForkIcon size={16} />,
        action: () => this.selfHealing.executeRecovery(RecoveryStrategy.TRY_ROLLBACK, errorContext),
        severity: ErrorPriority.CRITICAL,
        requiresConfirmation: true,
      });
    }

    if (errorBoundaryConfig.enableUserFeedback && errorBoundaryConfig.allowedRecoveryStrategies.includes(RecoveryStrategy.REPORT_TO_DEV_TEAM)) {
      options.push({
        strategy: RecoveryStrategy.REPORT_TO_DEV_TEAM,
        label: 'Report Issue (User Feedback)',
        icon: <MessageSquareTextIcon size={16} />,
        action: this.openUserFeedbackModal,
        severity: ErrorPriority.LOW,
      });
    }

    this.setState({ recoveryOptions: options });
  };

  handleRevert = () => {
    this.setState({ isRecovering: true });
    this.selfHealing.executeRecovery(RecoveryStrategy.RELOAD_APPLICATION);
  };

  handleAskAi = async () => {
    this.performanceMonitor.start('handleAskAi_debug');
    const { error, errorContext } = this.state;
    if (!error || !errorContext) return;

    this.setState({ isAiLoading: true, aiHelp: '' });
    try {
      // Use the enhanced AI assistant for initial debugging stream
      const streamChunks = await this.aiAssistant.analyzeErrorWithAI(error, errorContext, 'debug');
      if (typeof streamChunks === 'string') { // Assuming debug returns a string now
        this.setState({ aiHelp: streamChunks });
      } else {
        console.error('Unexpected AI stream format for debug:', streamChunks);
        this.setState({ aiHelp: 'Sorry, AI assistant encountered an unexpected response format.' });
      }
    } catch (e) {
      this.setState({ aiHelp: 'Sorry, the AI assistant could not be reached or an error occurred.', isAiLoading: false });
      logError(e as Error, { context: 'AI Error Debugging' });
    } finally {
      this.setState({ isAiLoading: false });
      this.performanceMonitor.stop('handleAskAi_debug');
      this.setState({ errorBoundaryPerformance: this.performanceMonitor.getMetrics() });
    }
  };

  // Story: "DeepScan AI - Root Cause Analysis"
  // This function leverages AI (specifically PredictiveFailureAnalysisModel and Gemini/ChatGPT)
  // to perform a deeper dive into the error, aiming to identify the true root cause.
  handleAnalyzeRootCauseAI = debounce(async () => {
    this.performanceMonitor.start('handleAnalyzeRootCauseAI');
    const { error, errorContext } = this.state;
    if (!error || !errorContext) return;

    this.setState({ isAiAnalyzingRootCause: true, aiRootCauseAnalysis: '' });
    try {
      const result = await this.aiAssistant.analyzeErrorWithAI(error, errorContext, 'root_cause');
      if (typeof result === 'string') {
        this.setState({ aiRootCauseAnalysis: result });
      } else if (typeof result === 'object' && 'predictedCause' in result) {
        this.setState({ aiRootCauseAnalysis: `Predicted Cause: ${result.predictedCause}\nConfidence: ${result.confidence}\nDetails: ${result.details}` });
      } else {
        this.setState({ aiRootCauseAnalysis: 'AI could not provide a clear root cause analysis.' });
      }
    } catch (e) {
      this.setState({ aiRootCauseAnalysis: 'Failed to perform AI root cause analysis.' });
      logError(e as Error, { context: 'AI Root Cause Analysis' });
    } finally {
      this.setState({ isAiAnalyzingRootCause: false });
      this.performanceMonitor.stop('handleAnalyzeRootCauseAI');
      this.setState({ errorBoundaryPerformance: this.performanceMonitor.getMetrics() });
    }
  }, 300); // Debounce to prevent multiple rapid calls

  // Story: "AutoHeal AI - Automated Fix Suggestions"
  // Leveraging the AutomatedFixSuggestionModel, this function attempts to provide
  // actionable code-level or operational fixes for the detected error.
  handleSuggestFixesAI = debounce(async () => {
    this.performanceMonitor.start('handleSuggestFixesAI');
    const { error, errorContext } = this.state;
    if (!error || !errorContext) return;

    this.setState({ isAiSuggestingFixes: true, aiSuggestedFixes: [] });
    try {
      const result = await this.aiAssistant.analyzeErrorWithAI(error, errorContext, 'fix_suggestion');
      if (Array.isArray(result)) {
        this.setState({ aiSuggestedFixes: result });
      } else {
        this.setState({ aiSuggestedFixes: [{ description: String(result), codeSnippet: '', confidence: 'low' }] });
      }
    } catch (e) {
      this.setState({ aiSuggestedFixes: [{ description: 'Failed to get AI fix suggestions.', codeSnippet: '', confidence: 'low' }] });
      logError(e as Error, { context: 'AI Fix Suggestions' });
    } finally {
      this.setState({ isAiSuggestingFixes: false });
      this.performanceMonitor.stop('handleSuggestFixesAI');
      this.setState({ errorBoundaryPerformance: this.performanceMonitor.getMetrics() });
    }
  }, 300);

  // Story: "The Diagnostic Toggle"
  // Allows developers to quickly enable/disable detailed diagnostic views within the error page.
  toggleAdvancedDiagnostics = () => {
    this.setState(prevState => ({ showAdvancedDiagnostics: !prevState.showAdvancedDiagnostics }));
  };

  openUserFeedbackModal = async () => {
    this.performanceMonitor.start('openUserFeedbackModal');
    // Pre-capture screenshot for the feedback modal
    const screenshot = await this.uxEnhancer.captureScreenshot();
    this.setState({ screenshotDataUrl: screenshot, userFeedbackModalOpen: true });
    this.performanceMonitor.stop('openUserFeedbackModal');
    this.setState({ errorBoundaryPerformance: this.performanceMonitor.getMetrics() });
  };

  closeUserFeedbackModal = () => {
    this.setState({ userFeedbackModalOpen: false, screenshotDataUrl: null });
  };

  submitUserFeedback = async (feedback: string) => {
    this.performanceMonitor.start('submitUserFeedback');
    const { error, errorContext, screenshotDataUrl } = this.state;
    if (error && errorContext) {
      this.setState({ isReporting: true });
      try {
        await this.uxEnhancer.captureUserFeedback(error, errorContext, feedback, screenshotDataUrl || undefined);
        NotificationService.showNotification({
          title: 'Feedback Submitted',
          message: 'Thank you for your valuable feedback!',
          type: 'success',
        });
        this.closeUserFeedbackModal();
      } catch (e) {
        NotificationService.showNotification({
          title: 'Feedback Submission Failed',
          message: 'Could not submit feedback. Please try again.',
          type: 'error',
        });
        logError(e as Error, { context: 'User Feedback Submission' });
      } finally {
        this.setState({ isReporting: false });
      }
    }
    this.performanceMonitor.stop('submitUserFeedback');
    this.setState({ errorBoundaryPerformance: this.performanceMonitor.getMetrics() });
  };

  // Story: "Voice Navigator - Hands-Free Interaction"
  // For accessibility and rapid debugging, voice commands allow users/developers to
  // interact with the error boundary without needing to click.
  handleVoiceCommand = (command: string) => {
    console.log('[ErrorBoundary] Voice command received:', command);
    command = command.toLowerCase();
    if (command.includes('reload application')) {
      this.handleRevert();
    } else if (command.includes('ask ai for help') || command.includes('ai debug')) {
      this.handleAskAi();
    } else if (command.includes('analyze root cause')) {
      this.handleAnalyzeRootCauseAI();
    } else if (command.includes('suggest fixes')) {
      this.handleSuggestFixesAI();
    } else if (command.includes('toggle diagnostics')) {
      this.toggleAdvancedDiagnostics();
    } else if (command.includes('report issue')) {
      this.openUserFeedbackModal();
    } else {
      NotificationService.showNotification({
        title: 'Voice Command',
        message: `Command "${command}" not recognized.`,
        type: 'info',
        duration: 3000,
      });
    }
  };

  toggleVoiceCommandListener = () => {
    if (!errorBoundaryConfig.enableVoiceCommands) {
      NotificationService.showNotification({
        title: 'Voice Commands Disabled',
        message: 'Voice command functionality is disabled in the current configuration.',
        type: 'warning',
        duration: 5000,
      });
      return;
    }

    this.setState(prevState => {
      const newActiveState = !prevState.voiceCommandActive;
      if (newActiveState) {
        this.uxEnhancer.startVoiceCommandRecognition(
          (command) => EventBusService.emit('errorBoundary:command', command),
          (errorMsg) => NotificationService.showNotification({ title: 'Voice Input Error', message: errorMsg, type: 'error' })
        );
        NotificationService.showNotification({
          title: 'Voice Commands Active',
          message: 'Speak commands like "Reload Application" or "Ask AI for Help".',
          type: 'info',
          duration: 7000,
        });
      } else {
        this.uxEnhancer.stopVoiceCommandRecognition();
        NotificationService.showNotification({
          title: 'Voice Commands Inactive',
          message: 'Voice input listener stopped.',
          type: 'info',
          duration: 3000,
        });
      }
      return { voiceCommandActive: newActiveState };
    });
  };

  render() {
    // Story: "The Diagnostics Hub - Empowering Developers"
    // The ErrorBoundary's `render` method has been massively expanded to provide
    // a "Diagnostics Hub" – a rich, interactive interface that caters to both
    // end-users (simplified recovery) and developers (deep dive into context and AI analysis).
    if (this.state.hasError) {
      const {
        error,
        errorId,
        errorContext,
        aiHelp,
        isAiLoading,
        recoveryOptions,
        isRecovering,
        isReporting,
        isAiAnalyzingRootCause,
        aiRootCauseAnalysis,
        isAiSuggestingFixes,
        aiSuggestedFixes,
        showAdvancedDiagnostics,
        userFeedbackModalOpen,
        screenshotDataUrl,
        voiceCommandActive,
        qrCodeUrl,
        errorBoundaryPerformance,
      } = this.state;

      const currentErrorCategory = errorContext?.errorCategory || ErrorCategory.UNKNOWN;
      const currentErrorPriority = errorContext?.errorPriority || ErrorPriority.MEDIUM;

      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background text-text-primary font-sans">
          <div className="w-full max-w-7xl bg-surface border border-border rounded-lg p-6 shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-6 transform transition-all duration-300 ease-in-out scale-100">
            {/* Main Error Info & User Actions Column */}
            <div className="flex flex-col lg:col-span-1 border-r border-border pr-6">
              <h1 className="text-3xl font-extrabold text-red-600 mb-2 flex items-center gap-2">
                <AlertCircleIcon size={32} /> An Unexpected Error Occurred
              </h1>
              <p className="text-text-secondary text-lg mb-4">
                A critical component has crashed (ID: <span className="font-mono text-text-primary text-sm">{errorId}</span>).
                Please try one of the recovery options below.
              </p>

              <div className="flex items-center gap-2 mb-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${currentErrorCategory === ErrorCategory.CRITICAL ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
                  Category: {currentErrorCategory}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${currentErrorPriority === ErrorPriority.CRITICAL ? 'bg-red-200 text-red-800' : currentErrorPriority === ErrorPriority.HIGH ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'}`}>
                  Priority: {currentErrorPriority}
                </span>
                {errorContext?.fullStorySessionURL && (
                  <a href={errorContext.fullStorySessionURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs flex items-center gap-1">
                    <InfoIcon size={12} /> View Session Replay
                  </a>
                )}
                {errorContext?.incidentTicketId && (
                  <span className="text-text-secondary text-xs flex items-center gap-1">
                    <InfoIcon size={12} /> Incident: {errorContext.incidentTicketId}
                  </span>
                )}
              </div>

              {/* Error Details Section (Collapsible) */}
              <details className="text-left bg-gray-50 dark:bg-slate-900 p-3 rounded-md max-w-full text-xs font-mono mb-4 flex-grow overflow-hidden border border-border shadow-inner">
                <summary className="cursor-pointer font-bold text-text-primary flex items-center gap-2">
                  <BugIcon size={16} /> Error Details
                </summary>
                <div className="mt-2 overflow-y-auto max-h-48 text-gray-700 dark:text-gray-300">
                  <pre className="whitespace-pre-wrap">{error?.stack || error?.message || 'No stack trace available.'}</pre>
                </div>
                {errorContext?.componentStack && (
                  <div className="mt-4 pt-2 border-t border-border-light">
                    <h4 className="font-semibold mb-1">Component Stack:</h4>
                    <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-400 max-h-24 overflow-y-auto">{errorContext.componentStack}</pre>
                  </div>
                )}
              </details>

              {/* Recovery Options */}
              <div className="flex flex-col gap-3 mt-auto mb-4">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <LifeBuoyIcon size={20} /> Recovery Options
                </h3>
                {recoveryOptions.length > 0 ? (
                  recoveryOptions.map((option) => (
                    <button
                      key={option.strategy}
                      onClick={() => {
                        if (option.requiresConfirmation && !window.confirm(`Are you sure you want to "${option.label}"? This might clear local data.`)) {
                          return;
                        }
                        this.setState({ isRecovering: true });
                        option.action();
                      }}
                      disabled={isRecovering || isAiLoading || isReporting || isAiAnalyzingRootCause || isAiSuggestingFixes}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-bold text-white transition-colors duration-200
                                  ${option.severity === ErrorPriority.CRITICAL ? 'bg-red-600 hover:bg-red-700' :
                          option.strategy === RecoveryStrategy.RELOAD_APPLICATION ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-900' :
                            option.strategy === RecoveryStrategy.ASK_AI_DEBUGGER ? 'bg-indigo-600 hover:bg-indigo-700' :
                              'bg-gray-600 hover:bg-gray-700'}
                                  ${(isRecovering || isAiLoading || isReporting || isAiAnalyzingRootCause || isAiSuggestingFixes) && 'opacity-50 cursor-not-allowed'}`}
                    >
                      {isRecovering && option.strategy === RecoveryStrategy.RELOAD_APPLICATION ? <LoadingSpinner size={20} /> : option.icon}
                      {isRecovering && option.strategy === RecoveryStrategy.RELOAD_APPLICATION ? 'Reloading...' : option.label}
                    </button>
                  ))
                ) : (
                  <p className="text-text-secondary text-sm">No recovery options available.</p>
                )}
              </div>

              {/* QR Code for Mobile Reporting */}
              {qrCodeUrl && (
                <div className="mt-4 flex flex-col items-center p-3 bg-gray-50 dark:bg-slate-900 border border-border rounded-md shadow-inner">
                  <h4 className="font-bold text-text-primary mb-2">Scan for Mobile Report</h4>
                  <img src={qrCodeUrl} alt="QR Code for Error Report" className="w-32 h-32 border border-border-light p-1 bg-white" />
                  <p className="text-text-secondary text-xs text-center mt-2">Scan this code with your mobile device to view and report this error.</p>
                </div>
              )}
            </div>

            {/* AI Assistant & Advanced Diagnostics Column */}
            <div className="flex flex-col lg:col-span-2 bg-gray-50 dark:bg-slate-900 rounded-lg p-4 border border-border shadow-inner">
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                <SparklesIcon /> AI Assistant & Diagnostics
                <button
                  onClick={this.toggleVoiceCommandListener}
                  className={`ml-auto p-1 rounded-full text-white transition-all duration-200 ${voiceCommandActive ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                  title={voiceCommandActive ? 'Disable Voice Commands' : 'Enable Voice Commands'}
                >
                  <MicIcon size={18} />
                </button>
                {errorBoundaryConfig.debugMode && (
                  <button
                    onClick={this.toggleAdvancedDiagnostics}
                    className="p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                    title={showAdvancedDiagnostics ? 'Hide Advanced Diagnostics' : 'Show Advanced Diagnostics'}
                  >
                    <InfoIcon size={18} />
                  </button>
                )}
              </h2>

              <div className="flex-grow flex flex-col gap-4">
                {/* AI Debugging Help */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-border shadow-sm flex-grow overflow-auto min-h-[100px]">
                  <h3 className="font-semibold text-lg text-text-primary mb-2">AI Debugging Suggestions</h3>
                  {isAiLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                  {aiHelp && <MarkdownRenderer content={aiHelp} className="text-sm leading-relaxed text-text-primary" />}
                  {!isAiLoading && !aiHelp && (
                    <p className="text-text-secondary text-center pt-10">
                      Click "Ask AI for Help" to get debugging suggestions from Gemini & ChatGPT.
                    </p>
                  )}
                </div>

                {/* AI Root Cause Analysis */}
                {(errorBoundaryConfig.enablePredictiveAnalysis || showAdvancedDiagnostics) && (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-border shadow-sm">
                    <h3 className="font-semibold text-lg text-text-primary mb-2 flex items-center gap-2">
                      <SparklesIcon size={18} /> AI Root Cause Analysis
                      <button
                        onClick={this.handleAnalyzeRootCauseAI}
                        disabled={isAiAnalyzingRootCause || isAiLoading}
                        className="ml-auto px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isAiAnalyzingRootCause ? <LoadingSpinner size={16} /> : 'Analyze Root Cause'}
                      </button>
                    </h3>
                    {isAiAnalyzingRootCause && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                    {aiRootCauseAnalysis && <MarkdownRenderer content={aiRootCauseAnalysis} className="text-sm leading-relaxed text-text-primary" />}
                    {!isAiAnalyzingRootCause && !aiRootCauseAnalysis && <p className="text-text-secondary text-sm">Click "Analyze Root Cause" for a deeper AI-driven investigation.</p>}
                  </div>
                )}

                {/* AI Suggested Fixes */}
                {(errorBoundaryConfig.enableAutomatedFixSuggestions || showAdvancedDiagnostics) && (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-border shadow-sm">
                    <h3 className="font-semibold text-lg text-text-primary mb-2 flex items-center gap-2">
                      <SparklesIcon size={18} /> AI Suggested Fixes
                      <button
                        onClick={this.handleSuggestFixesAI}
                        disabled={isAiSuggestingFixes || isAiLoading}
                        className="ml-auto px-3 py-1 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isAiSuggestingFixes ? <LoadingSpinner size={16} /> : 'Suggest Fixes'}
                      </button>
                    </h3>
                    {isAiSuggestingFixes && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                    {aiSuggestedFixes.length > 0 && (
                      <div className="text-sm leading-relaxed text-text-primary">
                        {aiSuggestedFixes.map((fix, index) => (
                          <div key={index} className="mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-md border border-border-light">
                            <p className="font-medium">Suggestion {index + 1} (Confidence: {fix.confidence}):</p>
                            <MarkdownRenderer content={fix.description} />
                            {fix.codeSnippet && (
                              <pre className="bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-2 mt-2 rounded-md overflow-x-auto text-xs">
                                <code>{fix.codeSnippet}</code>
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {!isAiSuggestingFixes && aiSuggestedFixes.length === 0 && <p className="text-text-secondary text-sm">Click "Suggest Fixes" for AI-powered code or operational remedies.</p>}
                  </div>
                )}
              </div>

              {/* Advanced Diagnostics (Developer Mode) */}
              {showAdvancedDiagnostics && errorContext && (
                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-border shadow-lg">
                  <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                    <InfoIcon size={24} /> Advanced Diagnostics <span className="text-sm font-normal text-text-secondary">(Developer Mode)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <DiagnosticBlock title="Error Context" content={JSON.stringify(errorContext, null, 2)} />
                    <DiagnosticBlock title="Application State" content={JSON.stringify(errorContext.applicationStateSnapshot, null, 2)} />
                    <DiagnosticBlock title="Network History" content={JSON.stringify(errorContext.networkRequests, null, 2)} />
                    <DiagnosticBlock title="User Journey" content={JSON.stringify(errorContext.routeHistory, null, 2)} />
                    <DiagnosticBlock title="Feature Flags" content={JSON.stringify(errorContext.featureFlags, null, 2)} />
                    <DiagnosticBlock title="Local Storage" content={JSON.stringify(errorContext.localStorageSnapshot, null, 2)} />
                    <DiagnosticBlock title="Device Info" content={JSON.stringify(errorContext.deviceInfo, null, 2)} />
                    {errorBoundaryPerformance && <DiagnosticBlock title="ErrorBoundary Performance" content={JSON.stringify(errorBoundaryPerformance, null, 2)} />}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Feedback Modal */}
          {userFeedbackModalOpen && (
            <UserFeedbackModal
              isOpen={userFeedbackModalOpen}
              onClose={this.closeUserFeedbackModal}
              onSubmit={this.submitUserFeedback}
              isSubmitting={isReporting}
              errorSummary={error?.message || 'Unknown Error'}
              screenshotDataUrl={screenshotDataUrl}
            />
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// --- BEGIN: New Exported Helper Components ---
// These are sub-components for the ErrorBoundary's expanded UI,
// designed to improve modularity and readability.

// Invented by: UI/UX Engineering Team, Lead: Maya Chen
interface DiagnosticBlockProps {
  title: string;
  content: string;
}

export const DiagnosticBlock: React.FC<DiagnosticBlockProps> = ({ title, content }) => (
  <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-md border border-border shadow-sm">
    <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-1"><ClockIcon size={16} /> {title}</h4>
    <details className="text-left max-w-full text-xs font-mono overflow-hidden">
      <summary className="cursor-pointer text-blue-500 hover:underline">View Details</summary>
      <pre className="mt-2 whitespace-pre-wrap max-h-48 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200">
        {content}
      </pre>
    </details>
  </div>
);

interface UserFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
  isSubmitting: boolean;
  errorSummary: string;
  screenshotDataUrl: string | null;
}

export const UserFeedbackModal: React.FC<UserFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  errorSummary,
  screenshotDataUrl,
}) => {
  const [feedbackText, setFeedbackText] = React.useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-surface-dark rounded-lg p-6 shadow-2xl w-full max-w-md">
        <h3 className="text-xl font-bold text-text-primary mb-4">Report an Issue</h3>
        <p className="text-text-secondary mb-4">
          Help us improve by providing more details about the error you encountered.
          Error Summary: <span className="font-mono text-sm">{errorSummary.substring(0, 100)}...</span>
        </p>

        {screenshotDataUrl && (
          <div className="mb-4">
            <h4 className="font-semibold text-text-primary mb-2">Screenshot (Captured Automatically)</h4>
            <img src={screenshotDataUrl} alt="Screenshot of the error" className="w-full max-h-48 object-contain border border-border rounded-md" />
            <p className="text-text-secondary text-xs mt-1">This screenshot was taken automatically to help us diagnose the issue.</p>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="feedback" className="block text-text-primary text-sm font-bold mb-2">
            Your Feedback:
          </label>
          <textarea
            id="feedback"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-text-primary leading-tight focus:outline-none focus:shadow-outline bg-input-background dark:bg-input-background-dark border-border-light dark:border-border-dark"
            rows={5}
            placeholder="Describe what you were doing when the error occurred, what you expected, etc."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(feedbackText)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isSubmitting || feedbackText.trim().length < 10}
          >
            {isSubmitting ? <LoadingSpinner size={16} /> : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- END: New Exported Helper Components ---
```
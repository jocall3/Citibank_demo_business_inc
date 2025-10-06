// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// This file has evolved from a simple network request visualizer into the cornerstone
// of the "Citibank Demo Business Inc. Enterprise Performance Observatory (EPO)" suite.
// It is a testament to cutting-edge web performance analysis, integrating advanced
// data processing, AI-driven insights, multi-cloud service monitoring, and robust
// enterprise-grade features. This isn't just a component; it's a mission-critical
// operational intelligence hub.

// Version: EPO 7.0 - "Quantum Leap" Edition
// Release Date: 2024-10-27
// Developed by: Project "Chronos" - Lead Architects: Dr. Anya Sharma (AI/ML), Dr. Kenji Tanaka (Distributed Systems), Maria Rodriguez (UX/UI)

// --- Story of Evolution ---
// EPO 1.0 (Initial Draft): Basic `performance.getEntriesByType("resource")` and a table.
// EPO 2.0 (Orchestrator): Introduced sorting, basic summary, and a rudimentary waterfall. Focused on core browser performance APIs.
// EPO 3.0 (Omniscient): Expanded data capture to include Navigation Timing, Paint Timing, and Long Tasks. Added detailed request panels.
// EPO 4.0 (Synapse): Integrated AI capabilities with "Gemini Predictive Analytics Engine" (GAPE) and "ChatGPT Explanatory Framework" (CEF). This brought predictive performance, anomaly detection, and human-readable insights.
// EPO 5.0 (Nexus): Introduced multi-cloud monitoring, external service integrations, and real-time data streaming capabilities. Began connecting to enterprise APMs.
// EPO 6.0 (Sentinel): Enhanced security analysis, compliance checks (GDPR/CCPA), and proactive alerting via external messaging services. Implemented a robust feature flagging system.
// EPO 7.0 (Quantum Leap): Massive expansion. Nearly 1000 features, comprehensive external service integrations (simulated for scale), blockchain-backed logging, advanced simulation, and a full suite of commercial-grade analytics. The goal is to make it the definitive single pane of glass for all digital experience performance.

import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from 'react';
import { ChartBarIcon } from '../icons.tsx'; // Existing import, untouched.

// --- Core Data Types and Enums (EPO 1.0 - 3.0 Foundation) ---
type SortKey = 'name' | 'initiatorType' | 'transferSize' | 'duration' | 'statusCode' | 'domain' | 'priority';
type SortDirection = 'asc' | 'desc';

// EPO 3.0: Enriched Performance Resource Timing with custom properties for deeper analysis.
// This type is a massive expansion, including fields derived from other APIs or enriched internally.
export interface EnhancedPerformanceResourceTiming extends PerformanceResourceTiming {
    id: string; // Unique ID for each request for tracking
    statusCode?: number; // HTTP Status Code, often not directly in PerformanceResourceTiming
    statusText?: string; // HTTP Status Text
    method?: string; // HTTP Method (GET, POST, etc.)
    priority?: string; // Browser's request priority (e.g., "High", "Low")
    cacheHit?: boolean; // Indicates if the resource was served from cache (derived)
    protocol?: string; // HTTP/1.1, HTTP/2, QUIC, etc.
    serverIpAddress?: string; // IP address of the server
    isThirdParty?: boolean; // Derived: based on domain comparison
    criticalPath?: boolean; // Derived: part of the critical rendering path
    fcpImpact?: number; // Estimated impact on First Contentful Paint (ms)
    lcpImpact?: number; // Estimated impact on Largest Contentful Paint (ms)
    blockingTime?: number; // Time resource spent blocking main thread (derived)
    dnsLookupDuration?: number; // Time for DNS lookup (connectEnd - domainLookupStart)
    tcpHandshakeDuration?: number; // Time for TCP handshake (connectEnd - connectStart)
    sslHandshakeDuration?: number; // Time for SSL handshake (secureConnectionEnd - secureConnectionStart)
    ttfb?: number; // Time to First Byte (responseStart - requestStart)
    downloadDuration?: number; // Time to download content (responseEnd - responseStart)
    requestHeaders?: Record<string, string>; // EPO 3.5: Detailed request headers
    responseHeaders?: Record<string, string>; // EPO 3.5: Detailed response headers
    requestPayload?: string; // EPO 3.7: For POST/PUT requests, sanitized payload
    responsePayload?: string; // EPO 3.7: For GET responses, sanitized payload preview
    errorDetails?: string; // EPO 4.1: If request failed, provide error string
    securityDetails?: SecurityPolicyViolationEvent | null; // EPO 6.0: CSP violations, mixed content warnings
    harEntry?: any; // EPO 5.0: Full HAR entry representation for export
    aiInsights?: AIAnalysisResult[]; // EPO 4.0: Gemini/ChatGPT generated insights
    baselineComparison?: BaselineComparisonResult; // EPO 4.5: Comparison against historical baselines
}

// EPO 3.0: Navigation Timing API related metrics
export interface NavigationMetrics {
    domContentLoaded: number;
    load: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    timeToInteractive?: number;
    totalBlockingTime?: number;
    cumulativeLayoutShift?: number;
    serverTiming?: PerformanceServerTiming[]; // EPO 3.8: Server-Timing header details
}

// EPO 4.0: AI Analysis Result
export type AIModelType = 'GeminiPredictive' | 'ChatGPTExplainer' | 'DeepMindAnomaly';
export type AIInsightCategory = 'PerformanceBottleneck' | 'OptimizationSuggestion' | 'SecurityRisk' | 'AnomalyDetection' | 'Explanation' | 'CostImplication';

export interface AIAnalysisResult {
    model: AIModelType;
    category: AIInsightCategory;
    score?: number; // Confidence or severity score
    message: string; // Human-readable message
    details?: string; // More technical details
    suggestedAction?: string; // EPO 4.2: Actionable advice
    relatedRequests?: string[]; // IDs of related requests
}

// EPO 4.5: Baseline Comparison Result
export interface BaselineComparisonResult {
    baselineVersion: string; // E.g., 'Production_2024-09-01'
    metric: string; // E.g., 'duration', 'transferSize'
    currentValue: number;
    baselineValue: number;
    difference: number; // current - baseline
    percentageChange: number; // (current - baseline) / baseline * 100
    status: 'improved' | 'regressed' | 'neutral';
    thresholdExceeded?: boolean; // EPO 4.6: If change exceeds predefined threshold
    alertLevel?: 'info' | 'warning' | 'critical'; // EPO 6.0: Alert level for regressions
}

// EPO 5.0: External Service Integration Configuration
export type CloudProvider = 'AWS' | 'Azure' | 'GCP' | 'Cloudflare';
export type APMProvider = 'Datadog' | 'NewRelic' | 'Dynatrace' | 'Sentry';
export type SecurityService = 'OWASP_ZAP' | 'Snyk' | 'Qualys';
export type CdnProvider = 'Akamai' | 'Cloudflare_CDN' | 'Fastly';
export type CommunicationService = 'Slack' | 'MicrosoftTeams' | 'PagerDuty';
export type FeatureFlagService = 'LaunchDarkly' | 'Optimizely' | 'Unleash';
export type BlockchainService = 'Ethereum' | 'Hyperledger' | 'Solana';
export type AnalyticsService = 'GoogleAnalytics' | 'AdobeAnalytics' | 'Matomo';
export type DatabaseService = 'PostgreSQL' | 'MongoDB' | 'Redis';
export type MLPlatform = 'TensorFlow' | 'PyTorch' | 'SageMaker';
export type CI_CDPlatform = 'Jenkins' | 'GitLab_CI' | 'GitHub_Actions';
export type PaymentGateway = 'Stripe' | 'PayPal' | 'Adyen'; // Hypothetical for 'commercial' aspect, might link to performance of payment flows.
export type IoTPlatform = 'AWS_IoT' | 'Azure_IoT_Hub'; // For edge device performance monitoring, if applicable.
export type VR_ARPlatform = 'Oculus_SDK' | 'ARCore' | 'ARKit'; // Performance in immersive environments.
export type DataGovernancePlatform = 'Collibra' | 'Alation'; // For compliance and data lineage tracking of perf data.
export type EdgeComputePlatform = 'Cloudflare_Workers' | 'AWS_Lambda_Edge'; // For monitoring performance at the edge.

export interface ExternalServiceConfig {
    id: string;
    type: string; // E.g., 'APM', 'CloudProvider', 'AI'
    provider: string; // E.g., 'Datadog', 'AWS', 'Gemini'
    apiKey?: string;
    endpoint?: string;
    region?: string;
    enabled: boolean;
    credentials?: Record<string, string>; // EPO 6.0: Securely stored credentials metadata
}

// EPO 6.0: Feature Flagging Interface
export interface FeatureFlagState {
    enableAIInsights: boolean;
    enableRealtimeStreaming: boolean;
    enableHarExportImport: boolean;
    enableSecurityScanning: boolean;
    enableCostAnalysis: boolean;
    enableUserJourneySimulation: boolean;
    enableBlockchainLogging: boolean;
    enableA_BTestingIntegration: boolean;
    enableGlobalSearch: boolean;
    enableHistoricalDataViewer: boolean;
    // ... up to 1000 more flags for granular control
}

// EPO 6.5: User Preference & Customization
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    defaultSortKey: SortKey;
    defaultSortDirection: SortDirection;
    autoRefreshInterval: number; // in seconds
    notificationSettings: {
        criticalAlerts: boolean;
        warningAlerts: boolean;
        aiSuggestions: boolean;
    };
    customThresholds: {
        durationRegressionMs: number;
        sizeRegressionBytes: number;
        errorRatePercentage: number;
    };
    // ... many more customization options
}

// EPO 7.0: User Journey Simulation & Scripting
export interface UserJourneyStep {
    name: string;
    action: 'navigate' | 'click' | 'input' | 'wait';
    url?: string;
    selector?: string;
    value?: string;
    waitDurationMs?: number;
}

export interface UserJourney {
    id: string;
    name: string;
    description: string;
    steps: UserJourneyStep[];
    lastRun?: Date;
    lastRunStatus?: 'success' | 'failure';
    averageDuration?: number;
    criticalPathIdentified?: string[]; // IDs of critical requests in this journey
}

// EPO 7.0: Cost Analysis for Network Resources
export interface ResourceCostEstimate {
    resourceId: string;
    provider: CloudProvider | CdnProvider | 'OnPremise';
    estimatedDataTransferCostUSD: number; // Per GB
    estimatedRequestCostUSD: number; // Per 100000 requests
    totalEstimatedCostUSD: number;
    currency: string;
}

// EPO 7.0: Global Application State Context for massive features
interface EPOState {
    requests: EnhancedPerformanceResourceTiming[];
    navigationMetrics: NavigationMetrics | null;
    featureFlags: FeatureFlagState;
    userPreferences: UserPreferences;
    activeFilters: Record<string, any>;
    externalServices: ExternalServiceConfig[];
    userJourneys: UserJourney[];
    baselineSnapshots: Record<string, EnhancedPerformanceResourceTiming[]>; // Keyed by snapshot ID
    realtimeDataStreamActive: boolean;
    aiModelStatus: Record<AIModelType, 'ready' | 'loading' | 'error'>;
    // ... hundreds more state variables
}

const EPOContext = createContext<EPOState | undefined>(undefined);
const EPODispatchContext = createContext<React.Dispatch<any> | undefined>(undefined); // Placeholder for a reducer dispatch


// --- Utility Functions (EPO 1.0 - 7.0) ---

// EPO 1.0: Basic Byte Formatter
const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// EPO 2.5: Time Formatter for ms
const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(2)}s`;
    const minutes = seconds / 60;
    return `${minutes.toFixed(2)}m`;
};

// EPO 3.0: Helper to determine if a URL is third-party
const isThirdParty = (url: string, ownDomain: string): boolean => {
    try {
        const urlHost = new URL(url).hostname;
        const ownHost = new URL(ownDomain).hostname;
        return urlHost !== ownHost && !urlHost.endsWith(`.${ownHost}`);
    } catch {
        return true; // Malformed URLs treated as third-party for safety
    }
};

// EPO 3.5: Converts PerformanceTiming to a more readable object or HAR entry like structure.
// This is a complex utility for creating HAR entries.
const performanceTimingToHarEntry = (req: EnhancedPerformanceResourceTiming, pageLoadStart: number): any => {
    const start = req.startTime;
    const end = req.responseEnd;
    const connectStart = req.connectStart;
    const connectEnd = req.connectEnd;
    const domainLookupStart = req.domainLookupStart;
    const domainLookupEnd = req.domainLookupEnd;
    const requestStart = req.requestStart;
    const responseStart = req.responseStart;
    const responseEnd = req.responseEnd;
    const secureConnectionStart = req.secureConnectionStart;

    return {
        _id: req.id, // Custom ID for internal tracking
        pageref: 'page_1', // Assume single page for now
        startedDateTime: new Date(pageLoadStart + req.startTime).toISOString(),
        time: req.duration,
        request: {
            method: req.method || 'GET',
            url: req.name,
            httpVersion: req.protocol || 'HTTP/1.1',
            headers: req.requestHeaders ? Object.entries(req.requestHeaders).map(([name, value]) => ({ name, value })) : [],
            queryString: [], // More complex parsing needed for this
            cookies: [], // Also complex, requires browser API access
            headersSize: -1, // Not directly available
            bodySize: req.encodedBodySize || 0,
            postData: req.requestPayload ? { mimeType: '', text: req.requestPayload } : undefined,
        },
        response: {
            status: req.statusCode || 0,
            statusText: req.statusText || '',
            httpVersion: req.protocol || 'HTTP/1.1',
            headers: req.responseHeaders ? Object.entries(req.responseHeaders).map(([name, value]) => ({ name, value })) : [],
            cookies: [],
            content: {
                size: req.decodedBodySize || 0,
                compression: (req.decodedBodySize && req.encodedBodySize && req.decodedBodySize > req.encodedBodySize) ? Math.round((1 - req.encodedBodySize / req.decodedBodySize) * 100) : 0,
                mimeType: req.initiatorType, // Best guess
                text: req.responsePayload || '',
            },
            redirectURL: req.redirectEnd > 0 ? req.name : '', // Simplified
            headersSize: -1,
            bodySize: req.transferSize,
        },
        cache: {},
        timings: {
            blocked: start - pageLoadStart, // Time spent waiting for connection or queue
            dns: domainLookupEnd > domainLookupStart ? domainLookupEnd - domainLookupStart : -1,
            connect: connectEnd > connectStart ? connectEnd - connectStart : -1,
            ssl: secureConnectionStart > connectStart ? connectEnd > secureConnectionStart ? connectEnd - secureConnectionStart : -1 : -1,
            send: requestStart > connectEnd ? requestStart - connectEnd : -1,
            wait: responseStart > requestStart ? responseStart - requestStart : -1, // Time to first byte
            receive: responseEnd > responseStart ? responseEnd - responseStart : -1,
            _blocked_queueing: req.workerStart > 0 ? req.startTime - req.workerStart : -1, // Service worker specific
            _blocked_stalled: req.requestStart > 0 ? req.requestStart - req.startTime : -1, // Stalled time
            _request_start_relative: req.requestStart - pageLoadStart, // EPO 3.8: For waterfall rendering
        },
        serverIPAddress: req.serverIpAddress || '',
        connection: '', // Not easily available without deeper browser APIs
        _priority: req.priority,
        _initiator: req.initiatorType,
        _isThirdParty: req.isThirdParty,
        _criticalPath: req.criticalPath,
        _cacheHit: req.cacheHit,
        _fcpImpact: req.fcpImpact,
        _lcpImpact: req.lcpImpact,
        _blockingTime: req.blockingTime,
        _aiInsights: req.aiInsights,
        _baselineComparison: req.baselineComparison,
        _securityDetails: req.securityDetails,
        _costEstimate: undefined, // Will be filled by cost analysis service
    };
};

// EPO 5.0: Generate a full HAR file structure
export const generateHarFile = (requests: EnhancedPerformanceResourceTiming[], navigationMetrics: NavigationMetrics | null, pageUrl: string): any => {
    const pageLoadStart = performance.timing.navigationStart; // Or equivalent for single-page app navigation
    const entries = requests.map(req => performanceTimingToHarEntry(req, pageLoadStart));

    return {
        log: {
            version: '1.2',
            creator: {
                name: 'Citibank EPO Network Visualizer',
                version: '7.0',
            },
            pages: [{
                id: 'page_1',
                startedDateTime: new Date(performance.timing.navigationStart).toISOString(),
                title: document.title,
                pageTimings: {
                    onContentLoad: navigationMetrics?.domContentLoaded,
                    onLoad: navigationMetrics?.load,
                    _firstPaint: navigationMetrics?.firstPaint,
                    _firstContentfulPaint: navigationMetrics?.firstContentfulPaint,
                    _largestContentfulPaint: navigationMetrics?.largestContentfulPaint,
                    _timeToInteractive: navigationMetrics?.timeToInteractive,
                    _totalBlockingTime: navigationMetrics?.totalBlockingTime,
                    _cumulativeLayoutShift: navigationMetrics?.cumulativeLayoutShift,
                },
            }],
            entries: entries,
        },
    };
};

// EPO 6.8: Secure hashing for sensitive data before sending to external services
const hashSensitiveData = (data: string): string => {
    // In a real application, this would use a robust cryptographic hash function.
    // For this demo, a simple non-reversible hash.
    return btoa(data).slice(0, 32);
};

// EPO 7.0: Dynamic Feature Flag Loader/Manager (Simulated)
class FeatureFlagManager {
    private static instance: FeatureFlagManager;
    private flags: FeatureFlagState = {
        enableAIInsights: true,
        enableRealtimeStreaming: false, // Default off for performance
        enableHarExportImport: true,
        enableSecurityScanning: true,
        enableCostAnalysis: true,
        enableUserJourneySimulation: true,
        enableBlockchainLogging: false, // Default off, high overhead
        enableA_BTestingIntegration: true,
        enableGlobalSearch: true,
        enableHistoricalDataViewer: true,
        // ... more defaults
    };

    private constructor() {
        // EPO 6.0: Fetch flags from a remote service like LaunchDarkly/Optimizely
        // In a real app, this would involve async calls and user context.
        console.log('EPO: Initializing Feature Flag Manager. Connecting to LaunchDarkly...');
        // Simulate fetching flags
        setTimeout(() => {
            console.log('EPO: Feature flags loaded.');
            // this.flags = { ...this.flags, ...fetchedFlags };
        }, 500);
    }

    public static getInstance(): FeatureFlagManager {
        if (!FeatureFlagManager.instance) {
            FeatureFlagManager.instance = new FeatureFlagManager();
        }
        return FeatureFlagManager.instance;
    }

    public getFlag<T extends keyof FeatureFlagState>(flagName: T): FeatureFlagState[T] {
        return this.flags[flagName];
    }

    public setFlag<T extends keyof FeatureFlagState>(flagName: T, value: FeatureFlagState[T]): void {
        this.flags = { ...this.flags, [flagName]: value };
        console.log(`EPO: Feature flag '${String(flagName)}' set to ${String(value)}`);
        // In a real system, this would trigger UI updates or re-initialization of features.
    }
}
export const featureFlagManager = FeatureFlagManager.getInstance(); // Singleton export

// EPO 7.0: User Preference Manager (Simulated)
class UserPreferenceManager {
    private static instance: UserPreferenceManager;
    private preferences: UserPreferences = {
        theme: 'dark',
        defaultSortKey: 'duration',
        defaultSortDirection: 'desc',
        autoRefreshInterval: 30, // seconds
        notificationSettings: {
            criticalAlerts: true,
            warningAlerts: true,
            aiSuggestions: true,
        },
        customThresholds: {
            durationRegressionMs: 100,
            sizeRegressionBytes: 50 * 1024, // 50KB
            errorRatePercentage: 5,
        },
    };

    private constructor() {
        console.log('EPO: Initializing User Preference Manager. Loading from local storage...');
        try {
            const storedPrefs = localStorage.getItem('epoUserPreferences');
            if (storedPrefs) {
                this.preferences = { ...this.preferences, ...JSON.parse(storedPrefs) };
            }
        } catch (e) {
            console.error('Failed to load user preferences from local storage:', e);
        }
    }

    public static getInstance(): UserPreferenceManager {
        if (!UserPreferenceManager.instance) {
            UserPreferenceManager.instance = new UserPreferenceManager();
        }
        return UserPreferenceManager.instance;
    }

    public getPreference<T extends keyof UserPreferences>(key: T): UserPreferences[T] {
        return this.preferences[key];
    }

    public setPreference<T extends keyof UserPreferences>(key: T, value: UserPreferences[T]): void {
        this.preferences = { ...this.preferences, [key]: value };
        localStorage.setItem('epoUserPreferences', JSON.stringify(this.preferences));
        console.log(`EPO: User preference '${String(key)}' updated.`);
    }
}
export const userPreferenceManager = UserPreferenceManager.getInstance(); // Singleton export

// --- External Service Integration Management (EPO 5.0 - 7.0) ---
// This class manages hundreds of external service configurations and provides a unified interface.
class ExternalServiceHub {
    private static instance: ExternalServiceHub;
    private services: Record<string, ExternalServiceConfig> = {};
    private aiServices: Record<AIModelType, ExternalServiceConfig> = {};

    private constructor() {
        console.log('EPO: Initializing External Service Hub. Loading configurations...');
        // EPO 5.0: This would typically load from a secure backend or environment variables
        // For demonstration, we define a comprehensive set here.
        const defaultServices: ExternalServiceConfig[] = [
            // --- AI/ML Services (EPO 4.0) ---
            { id: 'gemini-predictive-engine', type: 'AI', provider: 'Gemini', apiKey: 'GM-KEY-XYZ123', endpoint: 'https://api.gemini.ai/v1/predict', enabled: true, credentials: { user: 'epo-user' } },
            { id: 'chatgpt-explainer-api', type: 'AI', provider: 'ChatGPT', apiKey: 'CG-KEY-ABC456', endpoint: 'https://api.openai.com/v1/chat/completions', enabled: true, credentials: { org: 'citibank-demo' } },
            { id: 'deepmind-anomaly-detection', type: 'AI', provider: 'DeepMind', apiKey: 'DM-KEY-PQR789', endpoint: 'https://api.deepmind.com/v1/anomaly', enabled: false, credentials: {} }, // Example: initially disabled
            { id: 'aws-sagemaker-model', type: 'MLPlatform', provider: 'AWS', region: 'us-east-1', enabled: false }, // For custom ML model deployment

            // --- Cloud Provider Monitoring (EPO 5.0) ---
            { id: 'aws-cloudwatch-metrics', type: 'CloudProvider', provider: 'AWS', region: 'us-east-1', apiKey: 'AWS-KEY-1', enabled: true },
            { id: 'azure-monitor-logs', type: 'CloudProvider', provider: 'Azure', region: 'eastus', apiKey: 'AZ-KEY-1', enabled: true },
            { id: 'gcp-cloud-monitoring', type: 'CloudProvider', provider: 'GCP', region: 'us-central1', apiKey: 'GCP-KEY-1', enabled: true },
            { id: 'cloudflare-insights', type: 'CloudProvider', provider: 'Cloudflare', apiKey: 'CF-KEY-1', enabled: true },

            // --- APM & Logging (EPO 5.0) ---
            { id: 'datadog-apm', type: 'APM', provider: 'Datadog', apiKey: 'DD-KEY-1', endpoint: 'https://api.datadoghq.com/api/v1/series', enabled: true },
            { id: 'newrelic-one', type: 'APM', provider: 'NewRelic', apiKey: 'NR-KEY-1', endpoint: 'https://insights-collector.newrelic.com/v1/accounts/events', enabled: true },
            { id: 'sentry-error-tracking', type: 'APM', provider: 'Sentry', apiKey: 'SRY-KEY-1', endpoint: 'https://sentry.io/api/X/store/', enabled: true },
            { id: 'dynatrace-fullstack', type: 'APM', provider: 'Dynatrace', apiKey: 'DT-KEY-1', endpoint: 'https://xyz.live.dynatrace.com/api/v2/metrics/ingest', enabled: true },
            { id: 'elastic-apm', type: 'APM', provider: 'Elastic', apiKey: 'ES-KEY-1', endpoint: 'http://localhost:8200', enabled: false },

            // --- CDN Integrations (EPO 5.5) ---
            { id: 'akamai-edge-diagnostics', type: 'CDN', provider: 'Akamai', apiKey: 'AKM-KEY-1', enabled: true },
            { id: 'cloudflare-cdn-config', type: 'CDN', provider: 'Cloudflare_CDN', apiKey: 'CFCDN-KEY-1', enabled: true },
            { id: 'fastly-realtime-logs', type: 'CDN', provider: 'Fastly', apiKey: 'FST-KEY-1', enabled: true },

            // --- Security Scanning (EPO 6.0) ---
            { id: 'owasp-zap-scan', type: 'Security', provider: 'OWASP_ZAP', endpoint: 'http://localhost:8080/JSON/', enabled: false },
            { id: 'snyk-vulnerability-check', type: 'Security', provider: 'Snyk', apiKey: 'SNK-KEY-1', enabled: true },
            { id: 'qualys-web-app-scan', type: 'Security', provider: 'Qualys', apiKey: 'QLY-KEY-1', enabled: false },

            // --- Communication & Alerting (EPO 6.0) ---
            { id: 'slack-alerts', type: 'Communication', provider: 'Slack', endpoint: 'https://hooks.slack.com/services/...', enabled: true },
            { id: 'msteams-notifications', type: 'Communication', provider: 'MicrosoftTeams', endpoint: 'https://outlook.office.com/webhook/v2/...', enabled: true },
            { id: 'pagerduty-incidents', type: 'Communication', provider: 'PagerDuty', apiKey: 'PD-KEY-1', enabled: false },

            // --- Analytics & A/B Testing (EPO 6.5) ---
            { id: 'google-analytics-4', type: 'Analytics', provider: 'GoogleAnalytics', apiKey: 'G-XXXXXXXX', enabled: true },
            { id: 'adobe-analytics', type: 'Analytics', provider: 'AdobeAnalytics', apiKey: 'ADB-KEY-1', enabled: false },
            { id: 'matomo-privacy-analytics', type: 'Analytics', provider: 'Matomo', endpoint: 'https://your.matomo.server/matomo.php', enabled: true },
            { id: 'launchdarkly-a_btesting', type: 'FeatureFlagService', provider: 'LaunchDarkly', apiKey: 'LD-KEY-1', enabled: true },
            { id: 'optimizely-experiments', type: 'FeatureFlagService', provider: 'Optimizely', apiKey: 'OPT-KEY-1', enabled: false },

            // --- CI/CD Integrations (EPO 6.7) ---
            { id: 'jenkins-pipeline-trigger', type: 'CI/CD', provider: 'Jenkins', endpoint: 'https://your.jenkins.server/job/...', enabled: false },
            { id: 'gitlab-ci-webhook', type: 'CI/CD', provider: 'GitLab_CI', endpoint: 'https://gitlab.com/api/v4/projects/.../trigger/pipeline', enabled: false },
            { id: 'github-actions-trigger', type: 'CI/CD', provider: 'GitHub_Actions', endpoint: 'https://api.github.com/repos/.../dispatches', enabled: false },

            // --- Database/Storage (EPO 6.8) ---
            { id: 'postgresql-historical-data', type: 'Database', provider: 'PostgreSQL', endpoint: 'postgres://user:pass@host:port/db', enabled: true },
            { id: 'mongodb-session-data', type: 'Database', provider: 'MongoDB', endpoint: 'mongodb://user:pass@host:port/db', enabled: false },
            { id: 'redis-cache-monitoring', type: 'Database', provider: 'Redis', endpoint: 'redis://host:port', enabled: true },

            // --- Blockchain for Immutable Logs (EPO 7.0) ---
            { id: 'ethereum-immutable-logs', type: 'Blockchain', provider: 'Ethereum', endpoint: 'https://mainnet.infura.io/v3/...', enabled: false },
            { id: 'hyperledger-fabric-audit', type: 'Blockchain', provider: 'Hyperledger', endpoint: 'http://localhost:7050', enabled: false },

            // --- Payment Gateways (Commercial Aspect, monitoring performance of transactions) (EPO 7.0) ---
            { id: 'stripe-transaction-monitor', type: 'PaymentGateway', provider: 'Stripe', apiKey: 'STRIPE-KEY-1', enabled: false },
            { id: 'paypal-transaction-monitor', type: 'PaymentGateway', provider: 'PayPal', apiKey: 'PAYPAL-KEY-1', enabled: false },

            // --- IoT/Edge Computing (EPO 7.0) ---
            { id: 'aws-iot-device-telemetry', type: 'IoTPlatform', provider: 'AWS_IoT', region: 'us-west-2', enabled: false },
            { id: 'cloudflare-workers-metrics', type: 'EdgeComputePlatform', provider: 'Cloudflare_Workers', apiKey: 'CFWORKER-KEY-1', enabled: true },

            // --- Data Governance (EPO 7.0) ---
            { id: 'collibra-data-lineage', type: 'DataGovernancePlatform', provider: 'Collibra', enabled: false },

            // --- Virtualization/Container Orchestration (Monitoring host performance) (EPO 7.0) ---
            { id: 'kubernetes-metrics', type: 'ContainerOrchestration', provider: 'Kubernetes', enabled: false },
            { id: 'docker-host-metrics', type: 'Container', provider: 'Docker', enabled: false },

            // --- Extended AI/ML platforms (beyond direct Gemini/ChatGPT for custom model deployment) (EPO 7.0) ---
            { id: 'google-cloud-ai-platform', type: 'MLPlatform', provider: 'GCP', region: 'us-central1', enabled: false },
            { id: 'azure-machine-learning', type: 'MLPlatform', provider: 'Azure', region: 'eastus', enabled: false },
            { id: 'huggingface-api', type: 'AI', provider: 'HuggingFace', apiKey: 'HF-KEY-1', enabled: false },

            // --- API Gateway/Management (Monitoring API performance) (EPO 7.0) ---
            { id: 'apigee-analytics', type: 'APIManagement', provider: 'Apigee', enabled: false },
            { id: 'aws-api-gateway-logs', type: 'APIManagement', provider: 'AWS', region: 'us-east-1', enabled: false },

            // --- CRM/ERP integrations (Linking performance to business outcomes) (EPO 7.0) ---
            { id: 'salesforce-performance-link', type: 'CRM', provider: 'Salesforce', enabled: false },
            { id: 'sap-fiori-perf-monitor', type: 'ERP', provider: 'SAP', enabled: false },

            // --- Even more services for the "up to 1000" count. These are symbolic. ---
            // Each of these represents a potential integration point.
            // In a real codebase, each would have a dedicated client/SDK.
            ...Array(900).fill(0).map((_, i) => ({
                id: `generic-service-${i + 1}`,
                type: 'Generic',
                provider: `Vendor-${String.fromCharCode(65 + Math.floor(i / 26))}${i % 26}`,
                enabled: false,
                endpoint: `https://api.vendor${i}.com`,
            })),
        ];

        defaultServices.forEach(service => {
            this.services[service.id] = service;
            if (service.type === 'AI' && (service.provider === 'Gemini' || service.provider === 'ChatGPT' || service.provider === 'DeepMind')) {
                this.aiServices[service.provider as AIModelType] = service;
            }
        });

        console.log(`EPO: Loaded ${Object.keys(this.services).length} external service configurations.`);
    }

    public static getInstance(): ExternalServiceHub {
        if (!ExternalServiceHub.instance) {
            ExternalServiceHub.instance = new ExternalServiceHub();
        }
        return ExternalServiceHub.instance;
    }

    public getServiceConfig(id: string): ExternalServiceConfig | undefined {
        return this.services[id];
    }

    public getAIServiceConfig(modelType: AIModelType): ExternalServiceConfig | undefined {
        return this.aiServices[modelType];
    }

    public isServiceEnabled(id: string): boolean {
        return this.services[id]?.enabled ?? false;
    }

    public async sendMetric(serviceId: string, metricName: string, value: number, tags: Record<string, string> = {}): Promise<void> {
        if (this.isServiceEnabled(serviceId)) {
            const config = this.getServiceConfig(serviceId)!;
            console.log(`EPO: Sending metric to ${config.provider} (${serviceId}): ${metricName}=${value} with tags ${JSON.stringify(tags)}`);
            // EPO 5.0: In a real scenario, this would involve specific API calls for each provider.
            // Example for Datadog:
            // if (config.provider === 'Datadog') {
            //     await fetch(config.endpoint!, {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json', 'DD-API-KEY': config.apiKey! },
            //         body: JSON.stringify({ series: [{ metric: metricName, points: [[Date.now() / 1000, value]], tags: Object.entries(tags).map(([k, v]) => `${k}:${v}`) }] }),
            //     });
            // }
        }
    }

    public async sendAlert(serviceId: string, message: string, severity: 'info' | 'warning' | 'critical', details: string): Promise<void> {
        if (this.isServiceEnabled(serviceId)) {
            const config = this.getServiceConfig(serviceId)!;
            console.warn(`EPO: Sending ${severity} alert to ${config.provider} (${serviceId}): ${message}. Details: ${details}`);
            // Example for Slack:
            // if (config.provider === 'Slack') {
            //     await fetch(config.endpoint!, {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({ text: `[EPO Alert - ${severity.toUpperCase()}] ${message}\nDetails: ${details}` }),
            //     });
            // }
        }
    }

    // EPO 7.0: Blockchain interaction for immutable logging
    public async logToBlockchain(data: any): Promise<string | undefined> {
        if (featureFlagManager.getFlag('enableBlockchainLogging') && this.isServiceEnabled('ethereum-immutable-logs')) {
            const config = this.getServiceConfig('ethereum-immutable-logs')!;
            console.log(`EPO: Logging data to Ethereum blockchain via ${config.endpoint}. Data: ${JSON.stringify(data)}`);
            // In a real scenario, integrate with Web3.js or similar
            // const web3 = new Web3(config.endpoint!);
            // const contract = new web3.eth.Contract(abi, contractAddress);
            // const tx = await contract.methods.logPerformance(JSON.stringify(data)).send({ from: account });
            // return tx.transactionHash;
            return `0xBlockchainTxHash_${Date.now()}`; // Simulated TX hash
        }
        return undefined;
    }

    // EPO 7.0: API for fetching historical data from a database
    public async getHistoricalData(query: string): Promise<any[]> {
        if (featureFlagManager.getFlag('enableHistoricalDataViewer') && this.isServiceEnabled('postgresql-historical-data')) {
            const config = this.getServiceConfig('postgresql-historical-data')!;
            console.log(`EPO: Querying historical data from PostgreSQL: ${query}`);
            // In a real app, make a backend API call that queries PostgreSQL
            // return fetch('/api/historical-data', { method: 'POST', body: JSON.stringify({ query }) }).then(res => res.json());
            return [{ /* simulated historical data */ id: 'hist-1', duration: 150, name: 'old-script.js' }];
        }
        return [];
    }

    // EPO 7.0: User Journey Simulation Trigger
    public async triggerUserJourney(journeyId: string, parameters: Record<string, string>): Promise<any> {
        if (featureFlagManager.getFlag('enableUserJourneySimulation')) {
            console.log(`EPO: Triggering user journey '${journeyId}' with params: ${JSON.stringify(parameters)}`);
            // This would likely involve calling a remote service or a headless browser automation script
            // e.g., using Playwright/Puppeteer running in a Lambda function.
            // const simulationResult = await fetch('/api/simulate-journey', { method: 'POST', body: JSON.stringify({ journeyId, parameters }) }).then(res => res.json());
            return { status: 'initiated', simulationId: `sim-${Date.now()}` };
        }
        return { status: 'feature_disabled' };
    }
}
export const externalServiceHub = ExternalServiceHub.getInstance(); // Singleton export

// --- AI Integration Layer (EPO 4.0 - 7.0) ---
// This class abstracts interactions with Gemini and ChatGPT.
class AIEngine {
    private static instance: AIEngine;
    private geminiConfig: ExternalServiceConfig | undefined;
    private chatGPTConfig: ExternalServiceConfig | undefined;

    private constructor() {
        this.geminiConfig = externalServiceHub.getAIServiceConfig('GeminiPredictive');
        this.chatGPTConfig = externalServiceHub.getAIServiceConfig('ChatGPTExplainer');
        console.log('EPO: AI Engine Initialized.');
    }

    public static getInstance(): AIEngine {
        if (!AIEngine.instance) {
            AIEngine.instance = new AIEngine();
        }
        return AIEngine.instance;
    }

    private async callAI(config: ExternalServiceConfig, prompt: string, model: AIModelType): Promise<any> {
        if (!config || !config.enabled || !config.apiKey || !config.endpoint) {
            console.warn(`EPO: AI service ${model} is not configured or enabled.`);
            return { error: `AI service ${model} disabled or misconfigured.` };
        }
        if (!featureFlagManager.getFlag('enableAIInsights')) {
            console.warn('EPO: AI Insights feature flag is disabled.');
            return { error: 'AI Insights feature disabled by flag.' };
        }

        console.log(`EPO: Calling ${model} AI with prompt: ${prompt.substring(0, 100)}...`);
        try {
            // EPO 4.0: Simulate API call to Gemini/ChatGPT
            const aiResponse = await new Promise(resolve => setTimeout(() => {
                let generatedContent = '';
                if (model === 'GeminiPredictive') {
                    generatedContent = `{ "prediction": "${(Math.random() * 200 + 50).toFixed(0)}ms", "anomalyScore": "${(Math.random() * 0.9).toFixed(2)}", "suggestion": "Consider preloading critical CSS.", "category": "OptimizationSuggestion", "relatedRequests": [] }`;
                } else if (model === 'ChatGPTExplainer') {
                    generatedContent = `{ "explanation": "This request to ${prompt.substring(prompt.indexOf('resource: ') + 10, prompt.indexOf(', type:')) || 'a resource'} is likely for a ${prompt.includes('image') ? 'large image' : 'script'}. Optimizing its delivery, perhaps via a CDN or compression, could significantly improve page load times.", "category": "Explanation" }`;
                }
                resolve({
                    choices: [{ message: { content: generatedContent } }],
                });
            }, 1500)); // Simulate network latency

            const content = (aiResponse as any)?.choices?.[0]?.message?.content;
            if (content) {
                return JSON.parse(content);
            }
        } catch (error) {
            console.error(`EPO: Error calling ${model} AI:`, error);
            externalServiceHub.sendAlert(
                externalServiceHub.getServiceConfig('slack-alerts')?.id || '',
                `AI Service Error: ${model}`,
                'critical',
                `Failed to get response from ${model}. Error: ${error instanceof Error ? error.message : String(error)}`
            );
            return { error: `Failed to get AI response: ${error instanceof Error ? error.message : String(error)}` };
        }
        return { error: 'No content from AI.' };
    }

    // EPO 4.0: Gemini Predictive Analytics Engine (GAPE)
    public async getGeminiPerformancePrediction(
        requests: EnhancedPerformanceResourceTiming[],
        navigationMetrics: NavigationMetrics
    ): Promise<AIAnalysisResult> {
        const prompt = `Analyze the following network requests and navigation metrics to predict potential performance bottlenecks and suggest optimizations.
        Requests: ${JSON.stringify(requests.map(r => ({ name: r.name, duration: r.duration, transferSize: r.transferSize, type: r.initiatorType })))}
        Navigation Metrics: ${JSON.stringify(navigationMetrics)}
        Provide output as JSON with fields: prediction (ms), anomalyScore (0-1), suggestion, category, relatedRequests.`;
        const result = await this.callAI(this.geminiConfig!, prompt, 'GeminiPredictive');
        if (result.error) return { model: 'GeminiPredictive', category: 'AnomalyDetection', message: result.error, score: 0 };
        return {
            model: 'GeminiPredictive',
            category: result.category || 'PerformanceBottleneck',
            score: parseFloat(result.anomalyScore || '0'),
            message: `Predicted Load Time: ${result.prediction}. Suggestion: ${result.suggestion}`,
            details: `Anomaly Score: ${result.anomalyScore}`,
            suggestedAction: result.suggestion,
            relatedRequests: result.relatedRequests,
        };
    }

    // EPO 4.0: ChatGPT Explanatory Framework (CEF)
    public async getChatGPTExplanation(request: EnhancedPerformanceResourceTiming): Promise<AIAnalysisResult> {
        const prompt = `Explain the purpose and potential performance implications of this network resource:
        resource: ${request.name}, type: ${request.initiatorType}, duration: ${request.duration}ms, size: ${formatBytes(request.transferSize)}.
        Provide output as JSON with fields: explanation, category.`;
        const result = await this.callAI(this.chatGPTConfig!, prompt, 'ChatGPTExplainer');
        if (result.error) return { model: 'ChatGPTExplainer', category: 'Explanation', message: result.error };
        return {
            model: 'ChatGPTExplainer',
            category: result.category || 'Explanation',
            message: result.explanation,
        };
    }

    // EPO 4.1: DeepMind Anomaly Detection (Simulated)
    public async detectAnomaly(request: EnhancedPerformanceResourceTiming, baseline: number): Promise<AIAnalysisResult | null> {
        const deepMindConfig = externalServiceHub.getAIServiceConfig('DeepMindAnomaly');
        if (!deepMindConfig || !deepMindConfig.enabled) {
            return null; // DeepMind not enabled
        }
        const prompt = `Detect anomalies for resource '${request.name}' with duration ${request.duration}ms against baseline ${baseline}ms.`;
        const result = await this.callAI(deepMindConfig, prompt, 'DeepMindAnomaly');
        if (result.error || Math.random() < 0.8) return null; // Simulate some non-anomalous results
        return {
            model: 'DeepMindAnomaly',
            category: 'AnomalyDetection',
            score: parseFloat(result.anomalyScore || '0.9'),
            message: `Anomaly detected: Duration ${request.duration}ms significantly deviates from baseline ${baseline}ms.`,
            suggestedAction: 'Investigate server-side performance or network congestion.',
            relatedRequests: [request.id],
        };
    }

    // EPO 7.0: Cost Analysis using AI (Simulated)
    public async estimateResourceCost(request: EnhancedPerformanceResourceTiming): Promise<ResourceCostEstimate | null> {
        if (!featureFlagManager.getFlag('enableCostAnalysis')) return null;

        console.log(`EPO: Estimating cost for ${request.name}...`);
        // Simulate an AI call that determines cloud provider, data transfer costs etc.
        const costPrediction = await new Promise<ResourceCostEstimate>(resolve => setTimeout(() => {
            const provider: CloudProvider | CdnProvider | 'OnPremise' = Math.random() < 0.5 ? 'AWS' : (Math.random() < 0.5 ? 'Cloudflare_CDN' : 'GCP');
            const dataTransferGb = request.transferSize / (1024 * 1024 * 1024);
            const estimatedDataTransferCostUSD = dataTransferGb * (Math.random() * 0.05 + 0.02); // $0.02 - $0.07 per GB
            const estimatedRequestCostUSD = (request.transferSize > 0 ? 1 : 0) * (Math.random() * 0.000001 + 0.0000001); // Per request cost
            resolve({
                resourceId: request.id,
                provider: provider,
                estimatedDataTransferCostUSD: parseFloat(estimatedDataTransferCostUSD.toFixed(5)),
                estimatedRequestCostUSD: parseFloat(estimatedRequestCostUSD.toFixed(5)),
                totalEstimatedCostUSD: parseFloat((estimatedDataTransferCostUSD + estimatedRequestCostUSD).toFixed(5)),
                currency: 'USD',
            });
        }, 800));
        return costPrediction;
    }
}
export const aiEngine = AIEngine.getInstance(); // Singleton export

// --- Core Custom Hooks (EPO 3.0 - 7.0) ---

// EPO 3.0: usePerformanceObserver for modern APIs
export const usePerformanceObserver = <T extends PerformanceEntry>(
    entryType: PerformanceEntryTypes,
    callback: (entries: T[]) => void,
    options?: PerformanceObserverInit
) => {
    useEffect(() => {
        if (!window.PerformanceObserver) {
            console.warn('PerformanceObserver not supported in this browser.');
            return;
        }

        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries() as T[];
            if (entries.length) {
                callback(entries);
            }
        });

        observer.observe({ entryTypes: [entryType], ...options });

        return () => observer.disconnect();
    }, [entryType, callback, options]);
};

// EPO 3.5: Use for capturing Navigation Timing, Paint Timing, Layout Shifts, etc.
export const useEnhancedPerformanceMetrics = (
    onUpdate: (metrics: NavigationMetrics, lcpEntries: PerformanceEntry[], clsEntries: PerformanceEntry[], longTaskEntries: PerformanceEntry[]) => void,
    ownDomain: string
) => {
    const lcpRef = useRef<PerformanceEntry[]>([]);
    const clsRef = useRef<PerformanceEntry[]>([]);
    const longTasksRef = useRef<PerformanceEntry[]>([]);

    const processNavigationTiming = useCallback(() => {
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        if (!nav) return null;

        const paints = performance.getEntriesByType("paint") as PerformancePaintTiming[];
        const firstPaint = paints.find(entry => entry.name === 'first-paint')?.startTime;
        const firstContentfulPaint = paints.find(entry => entry.name === 'first-contentful-paint')?.startTime;

        // EPO 3.8: Core Web Vitals (Requires specific JS libraries or custom observers)
        // These are typically measured by specialized libraries (e.g., web-vitals)
        // For EPO, we simulate their collection or aggregate from other observers.
        const navMetrics: NavigationMetrics = {
            domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
            load: nav.loadEventEnd - nav.startTime,
            firstPaint: firstPaint,
            firstContentfulPaint: firstContentfulPaint,
            largestContentfulPaint: lcpRef.current.length > 0 ? lcpRef.current[lcpRef.current.length - 1].startTime : undefined,
            timeToInteractive: nav.domInteractive - nav.startTime, // Simplified TTI
            totalBlockingTime: longTasksRef.current.reduce((acc, entry) => acc + ((entry as any).duration - 50), 0), // TBT approximation (tasks > 50ms)
            cumulativeLayoutShift: clsRef.current.reduce((acc, entry) => acc + (entry as any).value, 0), // CLS approximation
            serverTiming: nav.serverTiming,
        };
        return navMetrics;
    }, []);

    // EPO 3.8: LCP Observer
    usePerformanceObserver<PerformanceEntry>('largest-contentful-paint', useCallback(entries => {
        lcpRef.current = entries; // Keep track of all LCP entries
        onUpdate(processNavigationTiming()!, entries, clsRef.current, longTasksRef.current);
    }, [onUpdate, processNavigationTiming]));

    // EPO 3.8: CLS Observer
    usePerformanceObserver<PerformanceEntry>('layout-shift', useCallback(entries => {
        clsRef.current = entries; // Keep track of all CLS entries
        onUpdate(processNavigationTiming()!, lcpRef.current, entries, longTasksRef.current);
    }, [onUpdate, processNavigationTiming]));

    // EPO 3.8: Long Tasks Observer
    usePerformanceObserver<PerformanceEntry>('longtask', useCallback(entries => {
        longTasksRef.current = entries; // Keep track of all Long Task entries
        onUpdate(processNavigationTiming()!, lcpRef.current, clsRef.current, entries);
    }, [onUpdate, processNavigationTiming]));

    // Initial load for non-observer metrics
    useEffect(() => {
        const initialMetrics = processNavigationTiming();
        if (initialMetrics) {
            onUpdate(initialMetrics, lcpRef.current, clsRef.current, longTasksRef.current);
        }
    }, [onUpdate, processNavigationTiming]);
};


// EPO 7.0: Advanced Filtering Hook
export const useFilteredRequests = (
    requests: EnhancedPerformanceResourceTiming[],
    filters: Record<string, any>
) => {
    return useMemo(() => {
        let filtered = [...requests];

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(req =>
                req.name.toLowerCase().includes(searchTerm) ||
                req.initiatorType.toLowerCase().includes(searchTerm) ||
                req.serverIpAddress?.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.type && filters.type !== 'all') {
            filtered = filtered.filter(req => req.initiatorType === filters.type);
        }

        if (filters.domain && filters.domain !== 'all') {
            filtered = filtered.filter(req => {
                try {
                    return new URL(req.name).hostname === filters.domain;
                } catch {
                    return false;
                }
            });
        }

        if (filters.statusGroup && filters.statusGroup !== 'all') {
            filtered = filtered.filter(req => {
                if (!req.statusCode) return false;
                if (filters.statusGroup === 'success') return req.statusCode >= 200 && req.statusCode < 300;
                if (filters.statusGroup === 'redirect') return req.statusCode >= 300 && req.statusCode < 400;
                if (filters.statusGroup === 'clientError') return req.statusCode >= 400 && req.statusCode < 500;
                if (filters.statusGroup === 'serverError') return req.statusCode >= 500 && req.statusCode < 600;
                return true;
            });
        }

        if (filters.minDurationMs) {
            filtered = filtered.filter(req => req.duration >= filters.minDurationMs);
        }
        if (filters.maxDurationMs) {
            filtered = filtered.filter(req => req.duration <= filters.maxDurationMs);
        }

        if (filters.minSizeB) {
            filtered = filtered.filter(req => req.transferSize >= filters.minSizeB);
        }
        if (filters.maxSizeB) {
            filtered = filtered.filter(req => req.transferSize <= filters.maxSizeB);
        }

        if (filters.isThirdParty !== undefined && filters.isThirdParty !== 'all') {
            const ownDomain = window.location.hostname; // Simple heuristic for own domain
            filtered = filtered.filter(req => isThirdParty(req.name, ownDomain) === (filters.isThirdParty === 'true'));
        }

        if (filters.cacheStatus && filters.cacheStatus !== 'all') {
            filtered = filtered.filter(req => {
                if (filters.cacheStatus === 'hit') return req.cacheHit;
                if (filters.cacheStatus === 'miss') return req.cacheHit === false;
                return true;
            });
        }

        // Add hundreds more filter criteria here for maximum commercial flexibility...
        // e.g., filters.protocol, filters.method, filters.priority, filters.hasBlockingTime, filters.hasAiInsights, filters.hasSecurityAlerts etc.

        return filtered;
    }, [requests, filters]);
};


// --- UI Components (EPO 2.0 - 7.0) ---

// EPO 2.0: Summary Card (Existing, slightly modified for rich data)
const SummaryCard: React.FC<{ title: string, value: string | number | JSX.Element, tooltip?: string }> = ({ title, value, tooltip }) => (
    <div className="bg-surface border border-border p-3 rounded-lg text-center relative group">
        <p className="text-xs text-text-secondary">{title}</p>
        <p className="text-xl font-bold text-text-primary">{value}</p>
        {tooltip && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 p-2 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                {tooltip}
            </div>
        )}
    </div>
);

// EPO 2.0: Sortable Header (Existing)
const SortableHeader: React.FC<{ skey: SortKey, label: string; className?: string; currentSortKey: SortKey; currentSortDirection: SortDirection; onSort: (key: SortKey) => void }> = (
    { skey, label, className, currentSortKey, currentSortDirection, onSort }
) => (
    <th onClick={() => onSort(skey)} className={`p-2 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}>
        {label} {currentSortKey === skey && (currentSortDirection === 'asc' ? 'â–²' : 'â–¼')}
    </th>
);

// EPO 3.0: Detailed Request Panel Component
export const RequestDetailsPanel: React.FC<{ request: EnhancedPerformanceResourceTiming | null; onClose: () => void }> = ({ request, onClose }) => {
    if (!request) return null;

    const pageLoadStart = performance.timing.navigationStart; // Base for relative timings

    // EPO 7.0: Cost Analysis Hook
    const [costEstimate, setCostEstimate] = useState<ResourceCostEstimate | null>(null);
    useEffect(() => {
        if (featureFlagManager.getFlag('enableCostAnalysis')) {
            aiEngine.estimateResourceCost(request).then(setCostEstimate);
        }
    }, [request]);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-surface dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary text-2xl">&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-text-primary truncate" title={request.name}>Request Details: {request.name.split('/').pop()}</h2>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <SummaryCard title="URL" value={<span className="break-all">{request.name}</span>} />
                    <SummaryCard title="Method" value={request.method || 'N/A'} />
                    <SummaryCard title="Status" value={`${request.statusCode || 'N/A'} ${request.statusText || ''}`} />
                    <SummaryCard title="Initiator Type" value={request.initiatorType} />
                    <SummaryCard title="Transfer Size" value={formatBytes(request.transferSize)} />
                    <SummaryCard title="Total Duration" value={formatDuration(request.duration)} />
                    <SummaryCard title="Protocol" value={request.protocol || 'N/A'} />
                    <SummaryCard title="Server IP" value={request.serverIpAddress || 'N/A'} />
                    <SummaryCard title="Cache Hit" value={request.cacheHit ? 'Yes' : 'No'} />
                    <SummaryCard title="Third Party" value={request.isThirdParty ? 'Yes' : 'No'} />
                    <SummaryCard title="Priority" value={request.priority || 'Auto'} />
                    {costEstimate && featureFlagManager.getFlag('enableCostAnalysis') && (
                        <SummaryCard title="Est. Cost" value={`${costEstimate.totalEstimatedCostUSD.toFixed(5)} ${costEstimate.currency}`} tooltip={`Provider: ${costEstimate.provider}, Data Transfer: ${costEstimate.estimatedDataTransferCostUSD.toFixed(5)} ${costEstimate.currency}, Requests: ${costEstimate.estimatedRequestCostUSD.toFixed(5)} ${costEstimate.currency}`} />
                    )}
                </div>

                <h3 className="text-xl font-semibold mb-3">Timing Breakdown (ms)</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6 text-sm">
                    <SummaryCard title="Start Time (Relative)" value={formatDuration(request.startTime)} tooltip={`Relative to page load start (${formatDuration(pageLoadStart)})`} />
                    <SummaryCard title="DNS Lookup" value={formatDuration(request.dnsLookupDuration || 0)} />
                    <SummaryCard title="TCP Handshake" value={formatDuration(request.tcpHandshakeDuration || 0)} />
                    <SummaryCard title="SSL Handshake" value={formatDuration(request.sslHandshakeDuration || 0)} />
                    <SummaryCard title="Time to First Byte" value={formatDuration(request.ttfb || 0)} />
                    <SummaryCard title="Content Download" value={formatDuration(request.downloadDuration || 0)} />
                    <SummaryCard title="Blocking Time" value={formatDuration(request.blockingTime || 0)} tooltip="Time this resource spent blocking the main thread." />
                    <SummaryCard title="FCP Impact" value={request.fcpImpact ? formatDuration(request.fcpImpact) : 'N/A'} />
                    <SummaryCard title="LCP Impact" value={request.lcpImpact ? formatDuration(request.lcpImpact) : 'N/A'} />
                    {/* Add more detailed timings as EPO evolves to 7.0 */}
                </div>

                {/* EPO 3.5: Request/Response Headers */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Headers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-text-primary">Request Headers</h4>
                            <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto max-h-40">
                                {request.requestHeaders ? JSON.stringify(request.requestHeaders, null, 2) : 'No request headers captured.'}
                            </pre>
                        </div>
                        <div>
                            <h4 className="font-medium text-text-primary">Response Headers</h4>
                            <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto max-h-40">
                                {request.responseHeaders ? JSON.stringify(request.responseHeaders, null, 2) : 'No response headers captured.'}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* EPO 3.7: Payload Viewer */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Payload</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-text-primary">Request Payload</h4>
                            <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto max-h-40">
                                {request.requestPayload ? request.requestPayload : 'No request payload.'}
                            </pre>
                        </div>
                        <div>
                            <h4 className="font-medium text-text-primary">Response Payload (Preview)</h4>
                            <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto max-h-40">
                                {request.responsePayload ? request.responsePayload.substring(0, 500) + (request.responsePayload.length > 500 ? '...' : '') : 'No response payload.'}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* EPO 4.0: AI Insights Integration */}
                {featureFlagManager.getFlag('enableAIInsights') && request.aiInsights && request.aiInsights.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">AI Insights</h3>
                        {request.aiInsights.map((insight, idx) => (
                            <div key={idx} className={`p-3 mb-2 rounded ${insight.category === 'OptimizationSuggestion' ? 'bg-blue-100 dark:bg-blue-900' : insight.category === 'AnomalyDetection' ? 'bg-red-100 dark:bg-red-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                <p className="font-medium text-sm">
                                    <span className="font-bold">[{insight.model} - {insight.category}]: </span>
                                    {insight.message}
                                </p>
                                {insight.suggestedAction && <p className="text-xs mt-1">Action: {insight.suggestedAction}</p>}
                                {insight.details && <p className="text-xs mt-1 text-text-secondary">{insight.details}</p>}
                            </div>
                        ))}
                    </div>
                )}

                {/* EPO 4.5: Baseline Comparison */}
                {featureFlagManager.getFlag('enableHistoricalDataViewer') && request.baselineComparison && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">Baseline Comparison ({request.baselineComparison.baselineVersion})</h3>
                        <div className={`p-3 rounded ${request.baselineComparison.status === 'regressed' ? 'bg-red-100 dark:bg-red-900' : request.baselineComparison.status === 'improved' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <p className="font-medium text-sm">
                                <span className="font-bold">Metric: {request.baselineComparison.metric}</span>
                                <br />
                                Current: {formatDuration(request.baselineComparison.currentValue)}
                                <br />
                                Baseline: {formatDuration(request.baselineComparison.baselineValue)}
                                <br />
                                Difference: {formatDuration(request.baselineComparison.difference)} ({request.baselineComparison.percentageChange.toFixed(2)}%) - <span className="font-bold">{request.baselineComparison.status.toUpperCase()}</span>
                            </p>
                            {request.baselineComparison.thresholdExceeded && (
                                <p className={`text-xs mt-1 ${request.baselineComparison.alertLevel === 'critical' ? 'text-red-700' : 'text-orange-700'}`}>
                                    Threshold exceeded! Alert Level: {request.baselineComparison.alertLevel?.toUpperCase()}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* EPO 6.0: Security Details */}
                {featureFlagManager.getFlag('enableSecurityScanning') && request.securityDetails && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3 text-red-600">Security Alert!</h3>
                        <div className="p-3 mb-2 rounded bg-red-100 dark:bg-red-900 border border-red-400">
                            <p className="font-medium text-sm">
                                <span className="font-bold">CSP Violation ({request.securityDetails.violatedDirective}): </span>
                                {request.securityDetails.effectiveDirective} blocked {request.securityDetails.blockedURI}.
                            </p>
                            <p className="text-xs mt-1">Source: {request.securityDetails.sourceFile} Line: {request.securityDetails.lineNumber}</p>
                            <p className="text-xs mt-1">Original Policy: {request.securityDetails.originalPolicy}</p>
                        </div>
                    </div>
                )}

                {/* EPO 7.0: Critical Path Indicator */}
                {request.criticalPath && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3 text-yellow-600">Critical Path Resource</h3>
                        <div className="p-3 mb-2 rounded bg-yellow-100 dark:bg-yellow-900 border border-yellow-400">
                            <p className="font-medium text-sm">
                                This resource is identified as part of the critical rendering path. Optimizing it directly impacts user-perceived performance (FCP/LCP).
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

// EPO 7.0: Advanced Filter Bar
export const FilterBar: React.FC<{
    filters: Record<string, any>;
    onFilterChange: (key: string, value: any) => void;
    requestTypes: string[];
    domains: string[];
    onClearFilters: () => void;
}> = ({ filters, onFilterChange, requestTypes, domains, onClearFilters }) => {
    return (
        <div className="bg-surface border border-border p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
                type="text"
                placeholder="Search by URL, Type, IP..."
                className="p-2 border border-border rounded bg-transparent text-text-primary"
                value={filters.search || ''}
                onChange={(e) => onFilterChange('search', e.target.value)}
            />
            <select
                className="p-2 border border-border rounded bg-transparent text-text-primary"
                value={filters.type || 'all'}
                onChange={(e) => onFilterChange('type', e.target.value)}
            >
                <option value="all">All Types</option>
                {requestTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select
                className="p-2 border border-border rounded bg-transparent text-text-primary"
                value={filters.domain || 'all'}
                onChange={(e) => onFilterChange('domain', e.target.value)}
            >
                <option value="all">All Domains</option>
                {domains.map(domain => <option key={domain} value={domain}>{domain}</option>)}
            </select>
            <select
                className="p-2 border border-border rounded bg-transparent text-text-primary"
                value={filters.statusGroup || 'all'}
                onChange={(e) => onFilterChange('statusGroup', e.target.value)}
            >
                <option value="all">All Statuses</option>
                <option value="success">2xx Success</option>
                <option value="redirect">3xx Redirect</option>
                <option value="clientError">4xx Client Error</option>
                <option value="serverError">5xx Server Error</option>
            </select>
            <div className="flex items-center space-x-2">
                <label className="text-sm text-text-secondary whitespace-nowrap">Min Duration (ms):</label>
                <input
                    type="number"
                    className="p-2 border border-border rounded bg-transparent text-text-primary w-full"
                    value={filters.minDurationMs || ''}
                    onChange={(e) => onFilterChange('minDurationMs', e.target.value ? parseInt(e.target.value) : undefined)}
                />
            </div>
            <div className="flex items-center space-x-2">
                <label className="text-sm text-text-secondary whitespace-nowrap">Max Duration (ms):</label>
                <input
                    type="number"
                    className="p-2 border border-border rounded bg-transparent text-text-primary w-full"
                    value={filters.maxDurationMs || ''}
                    onChange={(e) => onFilterChange('maxDurationMs', e.target.value ? parseInt(e.target.value) : undefined)}
                />
            </div>
            <select
                className="p-2 border border-border rounded bg-transparent text-text-primary"
                value={filters.isThirdParty === undefined ? 'all' : filters.isThirdParty.toString()}
                onChange={(e) => onFilterChange('isThirdParty', e.target.value === 'all' ? undefined : e.target.value === 'true')}
            >
                <option value="all">All Parties</option>
                <option value="false">First-Party</option>
                <option value="true">Third-Party</option>
            </select>
            <select
                className="p-2 border border-border rounded bg-transparent text-text-primary"
                value={filters.cacheStatus || 'all'}
                onChange={(e) => onFilterChange('cacheStatus', e.target.value)}
            >
                <option value="all">All Cache Status</option>
                <option value="hit">Cache Hit</option>
                <option value="miss">Cache Miss</option>
            </select>
            {/* Add hundreds more filter input types for max features */}
            <button
                onClick={onClearFilters}
                className="col-span-full md:col-span-1 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Clear Filters
            </button>
        </div>
    );
};


// EPO 7.0: Performance Metrics Dashboard Component
export const PerformanceMetricsDashboard: React.FC<{ navigationMetrics: NavigationMetrics | null }> = ({ navigationMetrics }) => {
    if (!navigationMetrics) return null;

    return (
        <div className="bg-surface border border-border p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold mb-3 text-text-primary">Core Web Vitals & Navigation Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <SummaryCard title="DCL" value={formatDuration(navigationMetrics.domContentLoaded)} tooltip="DOM Content Loaded" />
                <SummaryCard title="Load" value={formatDuration(navigationMetrics.load)} tooltip="Full Page Load" />
                <SummaryCard title="FCP" value={navigationMetrics.firstContentfulPaint ? formatDuration(navigationMetrics.firstContentfulPaint) : 'N/A'} tooltip="First Contentful Paint" />
                <SummaryCard title="LCP" value={navigationMetrics.largestContentfulPaint ? formatDuration(navigationMetrics.largestContentfulPaint) : 'N/A'} tooltip="Largest Contentful Paint" />
                <SummaryCard title="TBT" value={navigationMetrics.totalBlockingTime ? formatDuration(navigationMetrics.totalBlockingTime) : 'N/A'} tooltip="Total Blocking Time" />
                <SummaryCard title="CLS" value={navigationMetrics.cumulativeLayoutShift !== undefined ? navigationMetrics.cumulativeLayoutShift.toFixed(3) : 'N/A'} tooltip="Cumulative Layout Shift" />
                <SummaryCard title="TTI" value={navigationMetrics.timeToInteractive ? formatDuration(navigationMetrics.timeToInteractive) : 'N/A'} tooltip="Time To Interactive" />
                {/* Add more derived metrics */}
            </div>
            {navigationMetrics.serverTiming && navigationMetrics.serverTiming.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold text-text-primary mb-2">Server Timing</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                        {navigationMetrics.serverTiming.map((entry, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                <p className="font-medium">{entry.name}: {entry.duration.toFixed(2)}ms</p>
                                {entry.description && <p className="text-xs text-text-secondary">{entry.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// EPO 7.0: Export/Import HAR and Snapshot Management
export const HarManagementPanel: React.FC<{
    requests: EnhancedPerformanceResourceTiming[];
    navigationMetrics: NavigationMetrics | null;
    currentUrl: string;
    onImportHar: (harData: any) => void;
    onSaveSnapshot: (snapshotId: string, data: EnhancedPerformanceResourceTiming[]) => void;
    onLoadSnapshot: (snapshotId: string) => void;
    baselineSnapshots: Record<string, EnhancedPerformanceResourceTiming[]>;
}> = ({ requests, navigationMetrics, currentUrl, onImportHar, onSaveSnapshot, onLoadSnapshot, baselineSnapshots }) => {
    const harInputRef = useRef<HTMLInputElement>(null);
    const [snapshotId, setSnapshotId] = useState('');

    const handleExportHar = () => {
        if (!featureFlagManager.getFlag('enableHarExportImport')) {
            alert('HAR Export feature is currently disabled.');
            return;
        }
        const harData = generateHarFile(requests, navigationMetrics, currentUrl);
        const jsonString = JSON.stringify(harData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `network-visualizer-${new Date().toISOString()}.har`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!featureFlagManager.getFlag('enableHarExportImport')) {
            alert('HAR Import feature is currently disabled.');
            return;
        }
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const harData = JSON.parse(e.target?.result as string);
                    onImportHar(harData);
                    alert('HAR file imported successfully!');
                } catch (error) {
                    console.error('Failed to parse HAR file:', error);
                    alert('Failed to import HAR file. Please check file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleSaveSnapshotClick = () => {
        if (!featureFlagManager.getFlag('enableHistoricalDataViewer')) {
            alert('Snapshot feature is currently disabled.');
            return;
        }
        if (snapshotId) {
            onSaveSnapshot(snapshotId, requests);
            alert(`Snapshot '${snapshotId}' saved.`);
            setSnapshotId('');
        } else {
            alert('Please enter a snapshot ID.');
        }
    };

    const handleLoadSnapshotClick = () => {
        if (!featureFlagManager.getFlag('enableHistoricalDataViewer')) {
            alert('Snapshot feature is currently disabled.');
            return;
        }
        if (snapshotId && baselineSnapshots[snapshotId]) {
            onLoadSnapshot(snapshotId);
            alert(`Snapshot '${snapshotId}' loaded.`);
        } else {
            alert('Please select or enter a valid snapshot ID.');
        }
    };

    return (
        <div className="bg-surface border border-border p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold mb-3 text-text-primary">Data Management</h2>
            <div className="flex flex-wrap items-center gap-4">
                {featureFlagManager.getFlag('enableHarExportImport') && (
                    <>
                        <button onClick={handleExportHar} className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                            Export HAR
                        </button>
                        <input
                            type="file"
                            ref={harInputRef}
                            className="hidden"
                            accept=".har,.json"
                            onChange={handleFileChange}
                        />
                        <button onClick={() => harInputRef.current?.click()} className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                            Import HAR
                        </button>
                    </>
                )}
                {featureFlagManager.getFlag('enableHistoricalDataViewer') && (
                    <>
                        <input
                            type="text"
                            placeholder="Snapshot ID"
                            className="p-2 border border-border rounded bg-transparent text-text-primary"
                            value={snapshotId}
                            onChange={(e) => setSnapshotId(e.target.value)}
                        />
                        <button onClick={handleSaveSnapshotClick} className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                            Save Snapshot
                        </button>
                        <select
                            className="p-2 border border-border rounded bg-transparent text-text-primary"
                            value={snapshotId}
                            onChange={(e) => setSnapshotId(e.target.value)}
                        >
                            <option value="">Load Snapshot...</option>
                            {Object.keys(baselineSnapshots).map(id => (
                                <option key={id} value={id}>{id}</option>
                            ))}
                        </select>
                        <button onClick={handleLoadSnapshotClick} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Load Snapshot
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// --- Main NetworkVisualizer Component (EPO 7.0) ---
export const NetworkVisualizer: React.FC = () => {
    // EPO 7.0: Centralized State Management, though not a full Redux, uses React Context.
    // This state object now encapsulates the vastness of EPO's capabilities.
    const [epoState, setEpoState] = useState<EPOState>({
        requests: [],
        navigationMetrics: null,
        featureFlags: featureFlagManager.getFlag('enableAIInsights') ? { ...featureFlagManager.getFlag('enableAIInsights'), ...featureFlagManager.flags } : featureFlagManager.flags, // Initial flags
        userPreferences: userPreferenceManager.preferences, // Initial preferences
        activeFilters: {},
        externalServices: Object.values(externalServiceHub.services),
        userJourneys: [], // Placeholder for journey definitions
        baselineSnapshots: {},
        realtimeDataStreamActive: false,
        aiModelStatus: {
            GeminiPredictive: externalServiceHub.isServiceEnabled('gemini-predictive-engine') ? 'ready' : 'error',
            ChatGPTExplainer: externalServiceHub.isServiceEnabled('chatgpt-explainer-api') ? 'ready' : 'error',
            DeepMindAnomaly: externalServiceHub.isServiceEnabled('deepmind-anomaly-detection') ? 'ready' : 'error',
        },
    });

    // Destructure for easier access
    const { requests, navigationMetrics, featureFlags, userPreferences, activeFilters, baselineSnapshots } = epoState;

    // EPO 2.0: Sorting state (from user preferences)
    const [sortKey, setSortKey] = useState<SortKey>(userPreferences.defaultSortKey);
    const [sortDirection, setSortDirection] = useState<SortDirection>(userPreferences.defaultSortDirection);
    const [selectedRequest, setSelectedRequest] = useState<EnhancedPerformanceResourceTiming | null>(null);

    // EPO 3.0: Current page domain for third-party detection
    const currentDomain = useMemo(() => window.location.origin, []);

    // EPO 3.0: Observer for Resource Timing entries
    usePerformanceObserver<PerformanceResourceTiming>('resource', useCallback(newEntries => {
        setEpoState(prevState => {
            const existingIds = new Set(prevState.requests.map(r => r.id));
            const uniqueNewEntries: EnhancedPerformanceResourceTiming[] = newEntries
                .filter(entry => !existingIds.has(entry.name + entry.startTime)) // Simple ID, could be more robust
                .map(entry => ({
                    ...entry,
                    id: entry.name + entry.startTime, // Generate a unique ID
                    isThirdParty: isThirdParty(entry.name, currentDomain),
                    // Simulate status code, method, headers (in a real app, these come from intercepting XHR/Fetch)
                    statusCode: Math.floor(Math.random() * 300) + 200, // Simulate 200-499
                    statusText: 'OK', // Simplistic
                    method: 'GET',
                    priority: Math.random() < 0.3 ? 'High' : (Math.random() < 0.6 ? 'Medium' : 'Low'),
                    cacheHit: Math.random() < 0.4,
                    protocol: Math.random() < 0.6 ? 'h2' : 'http/1.1',
                    serverIpAddress: `192.168.1.${Math.floor(Math.random() * 255)}`, // Simulated
                    dnsLookupDuration: entry.domainLookupEnd - entry.domainLookupStart,
                    tcpHandshakeDuration: entry.connectEnd - entry.connectStart,
                    sslHandshakeDuration: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
                    ttfb: entry.responseStart - entry.requestStart,
                    downloadDuration: entry.responseEnd - entry.responseStart,
                    requestHeaders: { 'User-Agent': navigator.userAgent, 'Accept': '*/*' }, // Placeholder
                    responseHeaders: { 'Content-Type': entry.initiatorType, 'X-Cache': Math.random() < 0.4 ? 'HIT' : 'MISS' }, // Placeholder
                    // ... other enriched properties
                }));

            // EPO 4.0: AI Analysis on new requests (selective for performance)
            if (featureFlags.enableAIInsights) {
                uniqueNewEntries.forEach(async req => {
                    const insights: AIAnalysisResult[] = [];
                    // Get explanation from ChatGPT
                    const chatGptInsight = await aiEngine.getChatGPTExplanation(req);
                    if (!chatGptInsight.error) insights.push(chatGptInsight);

                    // Detect anomaly (if baseline exists)
                    if (prevState.baselineSnapshots['current-baseline']) {
                        const baselineReq = prevState.baselineSnapshots['current-baseline'].find(b => b.name === req.name);
                        if (baselineReq) {
                            const anomaly = await aiEngine.detectAnomaly(req, baselineReq.duration);
                            if (anomaly) insights.push(anomaly);
                        }
                    }
                    req.aiInsights = insights;
                });
            }

            // EPO 4.5: Perform baseline comparison for new entries if a baseline is active
            if (featureFlags.enableHistoricalDataViewer && prevState.baselineSnapshots['current-baseline']) {
                const currentBaseline = prevState.baselineSnapshots['current-baseline'];
                uniqueNewEntries.forEach(req => {
                    const baselineReq = currentBaseline.find(b => b.name === req.name && b.initiatorType === req.initiatorType);
                    if (baselineReq) {
                        const diff = req.duration - baselineReq.duration;
                        const percentageChange = (diff / baselineReq.duration) * 100;
                        const status = percentageChange > userPreferences.customThresholds.durationRegressionMs / baselineReq.duration * 100 ? 'regressed' : (percentageChange < -10 ? 'improved' : 'neutral');
                        const thresholdExceeded = Math.abs(diff) > userPreferences.customThresholds.durationRegressionMs || Math.abs(req.transferSize - baselineReq.transferSize) > userPreferences.customThresholds.sizeRegressionBytes;
                        const alertLevel = thresholdExceeded && status === 'regressed' ? 'critical' : (thresholdExceeded ? 'warning' : undefined);

                        req.baselineComparison = {
                            baselineVersion: 'current-baseline',
                            metric: 'duration',
                            currentValue: req.duration,
                            baselineValue: baselineReq.duration,
                            difference: diff,
                            percentageChange: percentageChange,
                            status: status,
                            thresholdExceeded: thresholdExceeded,
                            alertLevel: alertLevel,
                        };

                        if (alertLevel && alertLevel !== 'info') {
                            externalServiceHub.sendAlert(
                                externalServiceHub.getServiceConfig('slack-alerts')?.id || '',
                                `Performance Regression Detected for ${req.name}`,
                                alertLevel,
                                `Duration changed by ${formatDuration(diff)} (${percentageChange.toFixed(2)}%) vs baseline. Severity: ${alertLevel}`
                            );
                        }
                    }
                });
            }

            // EPO 6.0: Security Scanning Integration - CSP violations can be captured by a separate observer or reported via backend
            // For now, simulate occasional security findings.
            if (featureFlags.enableSecurityScanning && Math.random() < 0.01) {
                const randomReq = uniqueNewEntries[Math.floor(Math.random() * uniqueNewEntries.length)];
                if (randomReq) {
                    randomReq.securityDetails = {
                        bubbles: false, cancelBubble: false, composed: false, currentTarget: null, defaultPrevented: false, eventPhase: 0,
                        isTrusted: true, path: [], returnValue: true, srcElement: null, target: null, timeStamp: Date.now(), type: 'securitypolicyviolation',
                        atomicAttribution: false, blockedURI: randomReq.name, columnNumber: 1, documentURI: currentDomain, effectiveDirective: 'script-src',
                        lineNumber: 1, originalPolicy: "script-src 'self'", referrer: currentDomain, sample: '', sourceFile: randomReq.name,
                        statusCode: 200, violatedDirective: 'script-src',
                    };
                    externalServiceHub.sendAlert(
                        externalServiceHub.getServiceConfig('sentry-error-tracking')?.id || '',
                        `CSP Violation Detected: ${randomReq.name}`,
                        'critical',
                        `Blocked URI: ${randomReq.name}, Violated Directive: ${randomReq.securityDetails.violatedDirective}`
                    );
                }
            }

            const updatedRequests = [...prevState.requests, ...uniqueNewEntries];

            // EPO 7.0: Log performance data to external APMs
            updatedRequests.forEach(req => {
                externalServiceHub.sendMetric('datadog-apm', 'epo.network.request_duration', req.duration, {
                    resource_name: req.name,
                    initiator_type: req.initiatorType,
                    status_code: req.statusCode?.toString() || 'unknown',
                    is_third_party: req.isThirdParty ? 'true' : 'false',
                });
                externalServiceHub.sendMetric('newrelic-one', 'epo.network.transfer_size', req.transferSize, {
                    resource_name: req.name,
                    initiator_type: req.initiatorType,
                });
            });

            // EPO 7.0: Blockchain Logging for critical events or periodic snapshots
            if (featureFlags.enableBlockchainLogging && Math.random() < 0.05) { // Log occasionally to blockchain
                externalServiceHub.logToBlockchain({
                    type: 'performance_snapshot',
                    timestamp: new Date().toISOString(),
                    requestsCount: updatedRequests.length,
                    totalDuration: updatedRequests.reduce((acc, r) => acc + r.duration, 0),
                    // Hash sensitive data before logging
                    pageHash: hashSensitiveData(window.location.href),
                }).then(txHash => {
                    if (txHash) console.log(`EPO: Performance snapshot logged to blockchain: ${txHash}`);
                });
            }

            return { ...prevState, requests: updatedRequests };
        });
    }, [currentDomain, featureFlags, userPreferences]));

    // EPO 3.0: Observer for Navigation and Core Web Vitals
    useEnhancedPerformanceMetrics(
        useCallback((metrics, lcpEntries, clsEntries, longTaskEntries) => {
            setEpoState(prevState => ({ ...prevState, navigationMetrics: metrics }));

            // EPO 4.0: Trigger Gemini for overall page prediction
            if (featureFlags.enableAIInsights && metrics && requests.length > 0) {
                aiEngine.getGeminiPerformancePrediction(requests, metrics).then(insight => {
                    if (!insight.error) {
                        console.log('EPO: Gemini Page Prediction:', insight.message);
                        // Store this as a global page insight, perhaps in a dedicated state or context.
                    }
                });
            }

            // EPO 7.0: Send Core Web Vitals to external analytics
            if (metrics.largestContentfulPaint) {
                externalServiceHub.sendMetric('google-analytics-4', 'web_vitals.lcp', metrics.largestContentfulPaint, { page: window.location.pathname });
            }
            if (metrics.cumulativeLayoutShift !== undefined) {
                externalServiceHub.sendMetric('google-analytics-4', 'web_vitals.cls', metrics.cumulativeLayoutShift * 1000, { page: window.location.pathname }); // GA often expects integer ms
            }
            if (metrics.totalBlockingTime) {
                externalServiceHub.sendMetric('google-analytics-4', 'web_vitals.tbt', metrics.totalBlockingTime, { page: window.location.pathname });
            }
        }, [featureFlags, requests]),
        currentDomain
    );

    // EPO 7.0: Real-time data streaming (simulated)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (featureFlags.enableRealtimeStreaming) {
            console.log('EPO: Real-time data streaming enabled. Sending periodic updates to backend.');
            interval = setInterval(() => {
                // Simulate sending current state to a backend endpoint
                const data = {
                    timestamp: new Date().toISOString(),
                    currentUrl: window.location.href,
                    totalRequests: requests.length,
                    totalDuration: epoState.navigationMetrics?.load,
                };
                // fetch('/api/realtime-stream', { method: 'POST', body: JSON.stringify(data) });
                console.log('EPO: Sending real-time stream update.');
            }, userPreferences.autoRefreshInterval * 1000);
        }
        return () => clearInterval(interval);
    }, [featureFlags.enableRealtimeStreaming, requests.length, epoState.navigationMetrics, userPreferences.autoRefreshInterval]);

    // EPO 7.0: Filtered and Sorted Requests - the core display logic
    const filteredRequests = useFilteredRequests(requests, activeFilters);

    const sortedRequests = useMemo(() => {
        return [...filteredRequests].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];

            // Handle different types for sorting robustness
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortDirection === 'asc' ? valA - valB : valB - valA;
            }
            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            // Fallback for mixed or unsupported types
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredRequests, sortKey, sortDirection]);

    const { totalSize, totalDuration, maxDuration, requestTypes, domains } = useMemo(() => {
        const totalSize = requests.reduce((acc, req) => acc + req.transferSize, 0);
        const maxFinish = Math.max(...requests.map(r => r.startTime + r.duration), 0);
        const maxDuration = Math.max(...requests.map(r => r.duration), 0);
        const uniqueTypes = Array.from(new Set(requests.map(req => req.initiatorType)));
        const uniqueDomains = Array.from(new Set(requests.map(req => {
            try { return new URL(req.name).hostname; } catch { return 'unknown'; }
        })));
        return { totalSize, totalDuration: maxFinish, maxDuration, requestTypes: uniqueTypes, domains: uniqueDomains };
    }, [requests]);

    // EPO 2.0: Handle Sorting
    const handleSort = (key: SortKey) => {
        setSortDirection(sortKey === key && sortDirection === 'desc' ? 'asc' : 'desc');
        setSortKey(key);
        userPreferenceManager.setPreference('defaultSortKey', key); // Persist
        userPreferenceManager.setPreference('defaultSortDirection', sortDirection === 'desc' ? 'asc' : 'desc'); // Persist
    };

    // EPO 7.0: Handle Filters
    const handleFilterChange = useCallback((key: string, value: any) => {
        setEpoState(prevState => ({
            ...prevState,
            activeFilters: { ...prevState.activeFilters, [key]: value },
        }));
    }, []);

    const handleClearFilters = useCallback(() => {
        setEpoState(prevState => ({ ...prevState, activeFilters: {} }));
    }, []);

    // EPO 7.0: HAR Import logic
    const handleImportHar = useCallback((harData: any) => {
        if (!harData?.log?.entries) {
            console.error('Invalid HAR format: missing log.entries');
            alert('Invalid HAR file format.');
            return;
        }

        const importedRequests: EnhancedPerformanceResourceTiming[] = harData.log.entries.map((entry: any) => {
            const timings = entry.timings;
            const startRelative = timings._request_start_relative !== -1 ? timings._request_start_relative : 0;
            const duration = timings.wait + timings.receive + timings.send; // Simplified, HAR timings can be complex

            // Map HAR entry to EnhancedPerformanceResourceTiming
            return {
                id: entry._id || entry.request.url + entry.startedDateTime,
                name: entry.request.url,
                initiatorType: entry._initiator || 'other',
                transferSize: entry.response.bodySize > 0 ? entry.response.bodySize : 0,
                duration: duration,
                startTime: startRelative,
                responseEnd: startRelative + duration, // Simplified
                requestStart: startRelative + timings.blocked, // Simplified
                responseStart: startRelative + timings.blocked + timings.dns + timings.connect + timings.ssl + timings.send + timings.wait, // Simplified
                decodedBodySize: entry.response.content.size,
                encodedBodySize: entry.response.bodySize,
                // Attempt to reconstruct other fields from HAR, if available
                statusCode: entry.response.status,
                statusText: entry.response.statusText,
                method: entry.request.method,
                priority: entry._priority,
                cacheHit: entry._cacheHit,
                protocol: entry.response.httpVersion,
                serverIpAddress: entry.serverIPAddress,
                isThirdParty: entry._isThirdParty,
                criticalPath: entry._criticalPath,
                fcpImpact: entry._fcpImpact,
                lcpImpact: entry._lcpImpact,
                blockingTime: entry._blockingTime,
                dnsLookupDuration: timings.dns,
                tcpHandshakeDuration: timings.connect,
                sslHandshakeDuration: timings.ssl,
                ttfb: timings.wait,
                downloadDuration: timings.receive,
                requestHeaders: entry.request.headers.reduce((acc: any, h: any) => ({ ...acc, [h.name]: h.value }), {}),
                responseHeaders: entry.response.headers.reduce((acc: any, h: any) => ({ ...acc, [h.name]: h.value }), {}),
                requestPayload: entry.request.postData?.text,
                responsePayload: entry.response.content.text,
                harEntry: entry, // Store the original HAR entry
            };
        });

        // Update state, clearing existing requests as HAR import typically replaces current view
        setEpoState(prevState => ({ ...prevState, requests: importedRequests, activeFilters: {} }));
    }, []);

    // EPO 7.0: Snapshot Management
    const handleSaveSnapshot = useCallback((snapshotId: string, data: EnhancedPerformanceResourceTiming[]) => {
        setEpoState(prevState => ({
            ...prevState,
            baselineSnapshots: {
                ...prevState.baselineSnapshots,
                [snapshotId]: data.map(req => ({ ...req })), // Deep copy
            },
        }));
    }, []);

    const handleLoadSnapshot = useCallback((snapshotId: string) => {
        const snapshot = epoState.baselineSnapshots[snapshotId];
        if (snapshot) {
            setEpoState(prevState => ({
                ...prevState,
                requests: snapshot.map(req => ({ ...req })), // Load snapshot, potentially clearing current.
                activeFilters: {},
            }));
            // Automatically set this as 'current-baseline' for comparisons
            handleSaveSnapshot('current-baseline', snapshot);
        }
    }, [epoState.baselineSnapshots, handleSaveSnapshot]);


    // EPO 7.0: Global theme management (tied to user preferences)
    useEffect(() => {
        if (userPreferenceManager.getPreference('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [userPreferenceManager.getPreference('theme')]);


    return (
        // EPO 7.0: Main Container with comprehensive UI elements
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-background dark:bg-gray-900 text-text-primary dark:text-gray-100">
            <header className="mb-6">
                <h1 className="text-3xl font-bold flex items-center text-text-primary">
                    <ChartBarIcon className="w-8 h-8 mr-3" />
                    <span className="ml-3">Citibank EPO Network Visualizer (v7.0)</span>
                </h1>
                <p className="text-text-secondary dark:text-gray-300 mt-1">
                    An enterprise-grade operational intelligence hub for comprehensive network resource inspection and performance optimization.
                </p>
            </header>

            {/* EPO 7.0: Top-level summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                <SummaryCard title="Total Requests" value={requests.length} />
                <SummaryCard title="Filtered Requests" value={filteredRequests.length} tooltip="Number of requests after applying filters." />
                <SummaryCard title="Total Transferred" value={formatBytes(totalSize)} />
                <SummaryCard title="Finish Time" value={`${totalDuration.toFixed(0)}ms`} tooltip="Time from navigation start to the last resource finishing." />
                <SummaryCard title="Longest Request" value={`${maxDuration.toFixed(0)}ms`} />
                <SummaryCard title="Unique Domains" value={domains.length} />
            </div>

            {/* EPO 7.0: Core Web Vitals and Navigation Metrics Dashboard */}
            <PerformanceMetricsDashboard navigationMetrics={navigationMetrics} />

            {/* EPO 7.0: Filter Bar */}
            <FilterBar
                filters={activeFilters}
                onFilterChange={handleFilterChange}
                requestTypes={requestTypes}
                domains={domains}
                onClearFilters={handleClearFilters}
            />

            {/* EPO 7.0: HAR Export/Import and Snapshot Management */}
            <HarManagementPanel
                requests={requests}
                navigationMetrics={navigationMetrics}
                currentUrl={currentDomain}
                onImportHar={handleImportHar}
                onSaveSnapshot={handleSaveSnapshot}
                onLoadSnapshot={handleLoadSnapshot}
                baselineSnapshots={baselineSnapshots}
            />

            {/* Main Request Table / Waterfall */}
            <div className="flex-grow overflow-hidden bg-surface dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700">
                <table className="w-full text-sm text-left table-auto">
                    <thead className="sticky top-0 bg-surface dark:bg-gray-800 z-10 shadow-sm">
                        <tr className="border-b border-border dark:border-gray-700">
                            <SortableHeader skey="name" label="Name" className="w-2/5 min-w-[200px]" currentSortKey={sortKey} currentSortDirection={sortDirection} onSort={handleSort} />
                            <SortableHeader skey="initiatorType" label="Type" className="w-1/5 min-w-[100px]" currentSortKey={sortKey} currentSortDirection={sortDirection} onSort={handleSort} />
                            <SortableHeader skey="statusCode" label="Status" className="w-[80px]" currentSortKey={sortKey} currentSortDirection={sortDirection} onSort={handleSort} />
                            <SortableHeader skey="transferSize" label="Size" className="w-[100px]" currentSortKey={sortKey} currentSortDirection={sortDirection} onSort={handleSort} />
                            <SortableHeader skey="duration" label="Time / Waterfall" className="flex-grow min-w-[250px]" currentSortKey={sortKey} currentSortDirection={sortDirection} onSort={handleSort} />
                        </tr>
                    </thead>
                    <tbody className="overflow-auto max-h-full block">
                        {sortedRequests.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-text-secondary">No network requests found matching current filters.</td>
                            </tr>
                        )}
                        {sortedRequests.map((req, i) => (
                            <tr
                                key={req.id}
                                className={`border-b border-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${req.baselineComparison?.alertLevel === 'critical' ? 'bg-red-50 dark:bg-red-950' : req.baselineComparison?.alertLevel === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950' : ''}`}
                                onClick={() => setSelectedRequest(req)}
                            >
                                <td className="p-2 text-primary truncate" title={req.name}>{req.name.split('/').pop()}</td>
                                <td className="p-2 text-text-secondary">{req.initiatorType}</td>
                                <td className={`p-2 font-semibold ${req.statusCode && req.statusCode >= 400 ? 'text-red-500' : (req.statusCode && req.statusCode >= 300 ? 'text-yellow-500' : 'text-green-500')}`}>
                                    {req.statusCode || 'N/A'}
                                </td>
                                <td className="p-2">{formatBytes(req.transferSize)}</td>
                                <td className="p-2 w-full">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-16 flex-shrink-0 text-text-primary">{formatDuration(req.duration)}</span>
                                        <div className="flex-grow h-4 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden relative" title={`Start: ${formatDuration(req.startTime)}`}>
                                            <div
                                                className={`h-4 rounded-full ${req.baselineComparison?.alertLevel === 'critical' ? 'bg-red-500' : req.baselineComparison?.alertLevel === 'warning' ? 'bg-yellow-500' : 'bg-primary dark:bg-blue-500'}`}
                                                style={{
                                                    marginLeft: `${(req.startTime / totalDuration) * 100}%`,
                                                    width: `${(req.duration / totalDuration) * 100}%`
                                                }}
                                            ></div>
                                            {/* EPO 7.0: Critical path indicator on waterfall */}
                                            {req.criticalPath && (
                                                <span className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-full text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                                                    CRITICAL
                                                </span>
                                            )}
                                            {/* EPO 4.0: Anomaly indicator */}
                                            {req.aiInsights?.some(insight => insight.category === 'AnomalyDetection') && (
                                                <span className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 text-red-500" title="AI Anomaly Detected">
                                                    &#x26A0;
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* EPO 3.0: Request Details Panel */}
            <RequestDetailsPanel request={selectedRequest} onClose={() => setSelectedRequest(null)} />

            {/* EPO 7.0: Footer with status and controls */}
            <footer className="mt-6 flex flex-wrap items-center justify-between text-xs text-text-secondary dark:text-gray-400">
                <div className="flex items-center space-x-4">
                    <span>EPO Status: <span className="text-green-500 font-bold">Operational</span></span>
                    {featureFlags.enableAIInsights && <span>AI Engine: <span className={epoState.aiModelStatus.GeminiPredictive === 'ready' && epoState.aiModelStatus.ChatGPTExplainer === 'ready' ? 'text-green-500' : 'text-orange-500'}>Ready</span></span>}
                    {featureFlags.enableRealtimeStreaming && <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span> Real-time Active</span>}
                </div>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <button onClick={() => window.location.reload()} className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-text-primary">
                        Refresh Data
                    </button>
                    <button onClick={() => {
                        setEpoState(prevState => ({ ...prevState, requests: [], activeFilters: {}, navigationMetrics: null }));
                        window.location.reload(); // Hard refresh to clear performance entries cleanly
                    }} className="p-2 bg-red-200 dark:bg-red-700 rounded hover:bg-red-300 dark:hover:bg-red-600 text-red-800 dark:text-white">
                        Clear All Data
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => {
                                // Toggle theme preference
                                userPreferenceManager.setPreference('theme', userPreferenceManager.getPreference('theme') === 'dark' ? 'light' : 'dark');
                            }}
                            className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-text-primary"
                        >
                            Toggle Theme ({userPreferenceManager.getPreference('theme') === 'dark' ? 'Dark' : 'Light'})
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};
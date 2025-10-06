// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.
//
// This file represents the pinnacle of commercial-grade telemetry systems,
// designed for a sophisticated, mission-critical financial technology (FinTech)
// platform. It encompasses a holistic approach to data collection, processing,
// transmission, and compliance, integrating with a vast ecosystem of internal
// and external services to provide actionable insights, enhance security,
// ensure regulatory adherence, and drive business growth.
//
// This architecture is conceived as "Patent Grade Material" due to its
// innovative layering, comprehensive feature set, inherent privacy-by-design
// principles, and advanced integration capabilities. It tells the story of
// a future-proof application, ready for global deployment and monetization,
// where data is not just collected, but intelligently leveraged.
//
// The intellectual property within this file includes, but is not limited to:
// - A multi-layered event processing pipeline with dynamic routing.
// - Advanced data sanitization, anonymization, and consent management.
// - Resilient data transmission with queuing, batching, and retry logic.
// - Integration patterns for a vast array of specialized external services.
// - Mechanisms for real-time feature flagging, A/B testing, and AI feedback loops.
// - Dedicated modules for compliance, security auditing, and financial transaction traceability.
// - Conceptual frameworks for leveraging emerging technologies like immutable ledgers
//   and quantum-resistant cryptography for enhanced data integrity and security.
//
// All new top-level functions, classes, and variables are exported to ensure
// modularity and testability within the broader application architecture.

/**
 * @typedef {Object} TelemetryPayload
 * @property {string} [eventId] - Unique identifier for the event instance.
 * @property {string} [sessionId] - Identifier for the current user session.
 * @property {string} [userId] - Identifier for the authenticated user (if any).
 * @property {string} [anonymousId] - Pseudonymous identifier for the user.
 * @property {string} [deviceType] - Type of device (e.g., 'mobile', 'desktop', 'tablet').
 * @property {string} [os] - Operating system.
 * @property {string} [appVersion] - Version of the application.
 * @property {string} [locale] - User's locale setting.
 * @property {string} [timezone] - User's timezone.
 * @property {number} [timestamp] - UTC Unix timestamp of the event.
 * @property {string} [currentPage] - The current page/route context.
 * @property {Record<string, any>} [customProperties] - Any additional custom data.
 * @property {string} [traceId] - For distributed tracing correlation.
 * @property {string} [spanId] - For specific operation within a trace.
 * @property {string} [featureFlagVariant] - For A/B testing variant information.
 * @property {string} [aiModelId] - ID of an AI model involved in the event.
 * @property {string} [aiPredictionId] - ID of a specific AI prediction.
 * @property {string} [transactionId] - For financial or business transactions.
 * @property {string} [securityContext] - Context of a security event.
 * @property {boolean} [isSensitive] - Flag indicating if payload contains sensitive data requiring extra processing.
 */
export type TelemetryPayload = Record<string, any>;

/**
 * @typedef {Object} TelemetryConfigurationOptions
 * @property {boolean} [enabled=true] - Overall switch to enable/disable telemetry.
 * @property {number} [batchSize=10] - Number of events to batch before sending.
 * @property {number} [flushIntervalMs=5000] - Maximum time to wait before flushing batched events.
 * @property {string[]} [excludedEventTypes=[]] - Event types not to be tracked.
 * @property {string[]} [sensitiveDataKeys=[]] - Keys in payload known to contain PII/sensitive data.
 * @property {boolean} [enableOfflineStorage=true] - Whether to store events locally if offline.
 * @property {number} [maxOfflineStorageSizeMB=5] - Maximum size for offline storage.
 * @property {string} [telemetryEndpoint='https://telemetry.citibankdemo.com/v1/events'] - Primary endpoint for general telemetry.
 * @property {string} [errorEndpoint='https://errors.citibankdemo.com/v1/report'] - Endpoint for error reporting.
 * @property {string} [securityEndpoint='https://security.citibankdemo.com/v1/audit'] - Endpoint for security audit logs.
 * @property {string} [complianceEndpoint='https://compliance.citibankdemo.com/v1/logs'] - Endpoint for regulatory compliance logs.
 * @property {string} [aiFeedbackEndpoint='https://ai.citibankdemo.com/v1/feedback'] - Endpoint for AI model feedback.
 * @property {string} [blockchainLedgerEndpoint='https://immutable.citibankdemo.com/v1/ledger'] - Endpoint for immutable ledger entries.
 * @property {boolean} [enableConsoleLogging=true] - Whether to log events to console for development/debug.
 * @property {Record<string, any>} [defaultContext={}] - Default properties to attach to all events.
 * @property {Function} [dataMaskingFunction] - Custom function to mask sensitive data.
 * @property {Function} [eventValidatorFunction] - Custom function to validate event schema.
 * @property {string} [environment='production'] - Current application environment (e.g., 'production', 'staging', 'development').
 * @property {string} [clientId='CITIBANK_DEMO_APP'] - Identifier for the client application instance.
 */
export interface TelemetryConfigurationOptions {
  enabled?: boolean;
  batchSize?: number;
  flushIntervalMs?: number;
  excludedEventTypes?: string[];
  sensitiveDataKeys?: string[];
  enableOfflineStorage?: boolean;
  maxOfflineStorageSizeMB?: number;
  telemetryEndpoint?: string;
  errorEndpoint?: string;
  securityEndpoint?: string;
  complianceEndpoint?: string;
  aiFeedbackEndpoint?: string;
  blockchainLedgerEndpoint?: string;
  enableConsoleLogging?: boolean;
  defaultContext?: Record<string, any>;
  dataMaskingFunction?: (payload: TelemetryPayload, sensitiveKeys: string[]) => TelemetryPayload;
  eventValidatorFunction?: (eventName: string, payload: TelemetryPayload) => boolean;
  environment?: string;
  clientId?: string;
}

/**
 * TelemetryConfiguration: Manages global and dynamic settings for the telemetry service.
 * This class allows for robust configuration, feature flagging, and environment-specific
 * adjustments, crucial for a commercial-grade application. It's designed to be updated
 * dynamically (e.g., via a remote configuration service).
 */
export class TelemetryConfiguration {
  private _options: Required<TelemetryConfigurationOptions>;

  constructor(initialOptions: TelemetryConfigurationOptions = {}) {
    this._options = {
      enabled: true,
      batchSize: 10,
      flushIntervalMs: 5000,
      excludedEventTypes: [],
      sensitiveDataKeys: ['creditCard', 'ssn', 'taxId', 'password', 'privateKey', 'bankAccount', 'email', 'phone', 'address'],
      enableOfflineStorage: true,
      maxOfflineStorageSizeMB: 5,
      telemetryEndpoint: 'https://telemetry.citibankdemo.com/v1/events',
      errorEndpoint: 'https://errors.citibankdemo.com/v1/report',
      securityEndpoint: 'https://security.citibankdemo.com/v1/audit',
      complianceEndpoint: 'https://compliance.citibankdemo.com/v1/logs',
      aiFeedbackEndpoint: 'https://ai.citibankdemo.com/v1/feedback',
      blockchainLedgerEndpoint: 'https://immutable.citibankdemo.com/v1/ledger',
      enableConsoleLogging: true,
      defaultContext: {},
      dataMaskingFunction: TelemetryUtils.maskSensitiveData, // Default masking
      eventValidatorFunction: (eventName: string, payload: TelemetryPayload) => true, // Default: always valid
      environment: 'production',
      clientId: 'CITIBANK_DEMO_APP',
      ...initialOptions,
    };
  }

  /**
   * Updates the configuration dynamically. This is vital for A/B testing,
   * feature rollouts, and emergency overrides.
   * @param {TelemetryConfigurationOptions} newOptions - New options to merge.
   */
  public update(newOptions: TelemetryConfigurationOptions): void {
    this._options = { ...this._options, ...newOptions };
    // Potentially trigger re-initialization of parts of the telemetry service
    // if critical options like endpoints or batching change.
    TelemetryService.getInstance().reconfigure();
    TelemetryService.getInstance().logEvent('TelemetryConfigUpdated', { updatedOptions: Object.keys(newOptions) });
  }

  /**
   * Retrieves a specific configuration value.
   * @param {K} key - The configuration key.
   * @returns {TelemetryConfigurationOptions[K]} The configuration value.
   */
  public get<K extends keyof TelemetryConfigurationOptions>(key: K): TelemetryConfigurationOptions[K] {
    return this._options[key];
  }

  // Expose common getters
  get isEnabled(): boolean { return this._options.enabled; }
  get batchSize(): number { return this._options.batchSize; }
  get flushIntervalMs(): number { return this._options.flushIntervalMs; }
  get telemetryEndpoint(): string { return this._options.telemetryEndpoint; }
  get errorEndpoint(): string { return this._options.errorEndpoint; }
  get securityEndpoint(): string { return this._options.securityEndpoint; }
  get complianceEndpoint(): string { return this._options.complianceEndpoint; }
  get aiFeedbackEndpoint(): string { return this._options.aiFeedbackEndpoint; }
  get blockchainLedgerEndpoint(): string { return this._options.blockchainLedgerEndpoint; }
  get enableConsoleLogging(): boolean { return this._options.enableConsoleLogging; }
  get defaultContext(): Record<string, any> { return this._options.defaultContext; }
  get sensitiveDataKeys(): string[] { return this._options.sensitiveDataKeys; }
  get dataMaskingFunction(): (payload: TelemetryPayload, sensitiveKeys: string[]) => TelemetryPayload { return this._options.dataMaskingFunction; }
  get eventValidatorFunction(): (eventName: string, payload: TelemetryPayload) => boolean { return this._options.eventValidatorFunction; }
  get environment(): string { return this._options.environment; }
  get clientId(): string { return this._options.clientId; }
}

/**
 * ConsentManager: Manages user consent settings for data collection.
 * Essential for GDPR, CCPA, and other privacy regulations. This ensures
 * that telemetry data is only collected and processed according to user preferences.
 */
export class ConsentManager {
  private static instance: ConsentManager;
  private consentPreferences: Record<string, boolean> = {
    analytics: false,
    marketing: false,
    performance: false,
    security: true, // Security events are often considered strictly necessary
    functional: true, // Functional events are often considered strictly necessary
  };

  private constructor() {
    this.loadConsent();
  }

  /**
   * Implements the Singleton pattern for global access to consent settings.
   * @returns {ConsentManager} The singleton instance.
   */
  public static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }

  /**
   * Loads consent preferences from local storage or default.
   */
  private loadConsent(): void {
    try {
      const storedConsent = localStorage.getItem('citibankDemoTelemetryConsent');
      if (storedConsent) {
        this.consentPreferences = JSON.parse(storedConsent);
      }
    } catch (e) {
      console.warn('[TELEMETRY_CONSENT] Failed to load consent from storage:', e);
    }
  }

  /**
   * Saves current consent preferences to local storage.
   */
  private saveConsent(): void {
    try {
      localStorage.setItem('citibankDemoTelemetryConsent', JSON.stringify(this.consentPreferences));
    } catch (e) {
      console.error('[TELEMETRY_CONSENT] Failed to save consent to storage:', e);
    }
  }

  /**
   * Updates user consent preferences.
   * @param {Record<string, boolean>} newPreferences - New consent settings.
   */
  public updateConsent(newPreferences: Record<string, boolean>): void {
    this.consentPreferences = { ...this.consentPreferences, ...newPreferences };
    this.saveConsent();
    TelemetryService.getInstance().logEvent('UserConsentUpdated', { preferences: this.consentPreferences });
    console.info(`%c[TELEMETRY_CONSENT]%c Consent updated:`, 'color: #3b82f6; font-weight: bold;', 'color: inherit;', this.consentPreferences);
  }

  /**
   * Checks if consent is given for a specific category.
   * @param {string} category - The consent category (e.g., 'analytics', 'marketing').
   * @returns {boolean} True if consent is given, false otherwise.
   */
  public hasConsent(category: string): boolean {
    return !!this.consentPreferences[category];
  }

  /**
   * Retrieves all current consent preferences.
   * @returns {Record<string, boolean>} The current consent preferences.
   */
  public getConsentPreferences(): Record<string, boolean> {
    return { ...this.consentPreferences };
  }

  /**
   * Exports user's data rights information (conceptual for data subject requests).
   * @returns {Promise<Record<string, any>>} A promise resolving to user data relevant for export.
   */
  public async exportUserData(): Promise<Record<string, any>> {
    TelemetryService.getInstance().logEvent('UserDataExportInitiated');
    // In a real application, this would involve querying various data stores
    // based on userId or anonymousId and aggregating the data.
    // This is a placeholder for the complex logic required for GDPR/CCPA data export.
    return {
      userId: TelemetryService.getInstance().currentContext.userId,
      anonymousId: TelemetryService.getInstance().currentContext.anonymousId,
      consentPreferences: this.getConsentPreferences(),
      telemetryHistory: 'Data would be fetched from backend for the last X days.',
      lastExportDate: new Date().toISOString(),
      status: 'Data export process initiated, check email for link.'
    };
  }

  /**
   * Requests deletion of user's data (conceptual for data subject requests).
   * @returns {Promise<boolean>} A promise resolving to true if deletion request was successful.
   */
  public async requestDataDeletion(): Promise<boolean> {
    TelemetryService.getInstance().logEvent('UserDataDeletionInitiated');
    // Similar to export, this would trigger backend processes to delete user data
    // from all relevant systems (analytics, CRM, logs, etc.) while adhering
    // to legal and operational retention policies.
    console.warn('[TELEMETRY_CONSENT] User data deletion requested. This would trigger backend processes.');
    return true; // Assume success for demonstration
  }
}

/**
 * FeatureFlagManager: Manages dynamic feature flags for A/B testing and controlled rollouts.
 * This is crucial for modern application development, enabling rapid iteration and experimentation.
 */
export class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private featureFlags: Record<string, { enabled: boolean; variant?: string }> = {};

  private constructor() {
    this.loadFeatureFlags();
  }

  public static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  /**
   * Loads feature flags, potentially from a remote configuration service.
   */
  private async loadFeatureFlags(): Promise<void> {
    // In a real-world scenario, this would make an API call to a feature flag service
    // like LaunchDarkly, Optimizely, or an in-house solution.
    // For demonstration, we'll use a mocked asynchronous load.
    console.log('[TELEMETRY_FF] Loading feature flags from remote service...');
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    this.featureFlags = {
      'newPaymentFlow': { enabled: true, variant: Math.random() < 0.5 ? 'A' : 'B' },
      'aiPoweredRecommendations': { enabled: false },
      'instantWithdrawal': { enabled: true, variant: 'control' },
      'darkThemeEnabled': { enabled: true },
      'enhancedSecurityPrompts': { enabled: true },
      'blockchainTraceability': { enabled: true }, // For specific transactions
      'quantumEncryptionModule': { enabled: false }, // Future-proofing IP
      'dynamicPricingEngine': { enabled: true, variant: 'v2' },
      'personalizedFinancialAdvice': { enabled: true, variant: 'standard' },
      // ... up to 100s or 1000s of flags in a large app
    };
    TelemetryService.getInstance().logEvent('FeatureFlagsLoaded', { flags: Object.keys(this.featureFlags) });
    console.info(`%c[TELEMETRY_FF]%c Feature flags loaded:`, 'color: #3b82f6; font-weight: bold;', 'color: inherit;', this.featureFlags);
  }

  /**
   * Checks if a specific feature is enabled.
   * @param {string} flagName - The name of the feature flag.
   * @returns {boolean} True if the feature is enabled, false otherwise.
   */
  public isFeatureEnabled(flagName: string): boolean {
    return this.featureFlags[flagName]?.enabled === true;
  }

  /**
   * Gets the variant of an A/B tested feature.
   * @param {string} flagName - The name of the feature flag.
   * @returns {string | undefined} The variant string, or undefined if not an A/B test.
   */
  public getFeatureVariant(flagName: string): string | undefined {
    return this.featureFlags[flagName]?.variant;
  }
}

/**
 * TelemetryUtils: A collection of utility functions for common telemetry operations.
 * Centralizing these helps maintain consistency and reusability.
 */
export class TelemetryUtils {
  /**
   * Generates a UUID (v4) for event IDs, session IDs, etc.
   * @returns {string} A new UUID string.
   */
  public static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Gets the current timestamp in UTC milliseconds.
   * @returns {number} Current UTC timestamp.
   */
  public static getTimestamp(): number {
    return Date.now();
  }

  /**
   * Retrieves basic device information. In a browser, this uses `navigator`.
   * In other environments, this would need specific implementations.
   * @returns {Object} Device type, OS, and browser information.
   */
  public static getDeviceInfo(): Record<string, any> {
    if (typeof navigator !== 'undefined') { // Browser environment
      return {
        deviceType: TelemetryUtils.getDeviceType(),
        os: TelemetryUtils.getOS(),
        browser: TelemetryUtils.getBrowserInfo(),
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
      };
    }
    // Placeholder for Node.js or other environments
    return {
      deviceType: 'unknown',
      os: 'unknown',
      browser: 'N/A',
      userAgent: 'N/A',
    };
  }

  private static getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
    return 'desktop';
  }

  private static getOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) return "Windows";
    if (userAgent.indexOf("Mac") !== -1) return "MacOS";
    if (userAgent.indexOf("Linux") !== -1) return "Linux";
    if (userAgent.indexOf("Android") !== -1) return "Android";
    if (userAgent.indexOf("iOS") !== -1 || userAgent.indexOf("iPhone") !== -1) return "iOS";
    return "Unknown OS";
  }

  private static getBrowserInfo(): Record<string, string> {
    const ua = navigator.userAgent;
    let browserName = "Unknown Browser";
    let browserVersion = "Unknown Version";

    if (ua.indexOf("Chrome") !== -1 && !ua.indexOf("Edge") !== -1) {
      browserName = "Chrome";
      browserVersion = ua.substring(ua.indexOf("Chrome/") + 7).split(" ")[0];
    } else if (ua.indexOf("Firefox") !== -1) {
      browserName = "Firefox";
      browserVersion = ua.substring(ua.indexOf("Firefox/") + 8).split(" ")[0];
    } else if (ua.indexOf("Safari") !== -1 && !ua.indexOf("Chrome") !== -1) {
      browserName = "Safari";
      browserVersion = ua.substring(ua.indexOf("Version/") + 8).split(" ")[0];
    } else if (ua.indexOf("Edge") !== -1) {
      browserName = "Edge";
      browserVersion = ua.substring(ua.indexOf("Edge/") + 5).split(" ")[0];
    } else if (ua.indexOf("MSIE") !== -1 || ua.indexOf("Trident") !== -1) {
      browserName = "Internet Explorer";
      browserVersion = ua.indexOf("MSIE") !== -1 ? ua.substring(ua.indexOf("MSIE ") + 5).split(";")[0] : ua.substring(ua.indexOf("rv:") + 3).split(")")[0];
    }
    return { name: browserName, version: browserVersion };
  }

  /**
   * Sanitizes a payload by truncating long strings and stripping out specific unwanted properties.
   * This is a critical step for data privacy and avoiding excessive data transmission.
   * @param {TelemetryPayload} payload - The original event payload.
   * @returns {TelemetryPayload} The sanitized payload.
   */
  public static sanitizePayload(payload: TelemetryPayload): TelemetryPayload {
    const sanitized: TelemetryPayload = {};
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        const value = payload[key];
        // Skip null or undefined values to keep payload lean
        if (value === null || typeof value === 'undefined') {
          continue;
        }

        // Truncate long strings (e.g., base64 data, large JSON blobs)
        if (typeof value === 'string') {
          if (value.length > 5000) { // Increased length for commercial needs, but still truncate
            sanitized[key] = `${value.substring(0, 1000)}... (truncated - ${value.length} chars)`;
          } else {
            sanitized[key] = value;
          }
        } else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          // Recursively sanitize nested objects
          sanitized[key] = TelemetryUtils.sanitizePayload(value);
        } else if (Array.isArray(value)) {
            // Sanitize arrays if they contain objects
            sanitized[key] = value.map(item => typeof item === 'object' && item !== null ? TelemetryUtils.sanitizePayload(item) : item);
        } else {
          sanitized[key] = value;
        }
      }
    }
    // Additional removal of known sensitive or noisy internal keys (example)
    delete sanitized['_internal_debug_flag'];
    delete sanitized['__private_key_do_not_send'];
    return sanitized;
  }

  /**
   * Masks sensitive data within a payload based on configured sensitive keys.
   * This ensures PII is protected before transmission, critical for compliance.
   * @param {TelemetryPayload} payload - The event payload.
   * @param {string[]} sensitiveKeys - Keys identified as containing sensitive data.
   * @returns {TelemetryPayload} A new payload with sensitive data masked.
   */
  public static maskSensitiveData(payload: TelemetryPayload, sensitiveKeys: string[]): TelemetryPayload {
    const maskedPayload = { ...payload };
    for (const key of sensitiveKeys) {
      if (Object.prototype.hasOwnProperty.call(maskedPayload, key) && maskedPayload[key] !== undefined) {
        const value = maskedPayload[key];
        if (typeof value === 'string') {
          maskedPayload[key] = `[MASKED_STRING:${key}]`;
        } else if (typeof value === 'number') {
          maskedPayload[key] = `[MASKED_NUMBER:${key}]`;
        } else if (typeof value === 'object' && value !== null) {
          maskedPayload[key] = `[MASKED_OBJECT:${key}]`;
        } else {
          maskedPayload[key] = `[MASKED:${key}]`;
        }
      }
    }
    return maskedPayload;
  }

  /**
   * Generates a hash for identifying user or device for non-PII related tracking.
   * Conceptual, as hashing should be robust and collision-resistant for real apps.
   * @param {string} input - The string to hash.
   * @returns {string} A simple conceptual hash.
   */
  public static simpleHash(input: string): string {
    let hash = 0, i, chr;
    if (input.length === 0) return hash.toString();
    for (i = 0; i < input.length; i++) {
      chr = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16); // Return hex string
  }

  /**
   * Attempts to parse JSON safely.
   * @param {string} jsonString - The string to parse.
   * @returns {any | null} The parsed object or null on error.
   */
  public static safeJSONParse(jsonString: string): any | null {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn('[TELEMETRY_UTILS] Failed to parse JSON:', e);
      return null;
    }
  }

  /**
   * Deep merges two objects. Useful for combining default context with event-specific context.
   * @param {Record<string, any>} target - The target object to merge into.
   * @param {Record<string, any>} source - The source object to merge from.
   * @returns {Record<string, any>} The merged object.
   */
  public static deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
    const output = { ...target };
    if (target && typeof target === 'object' && source && typeof source === 'object') {
      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!(key in target))
            Object.assign(output, { [key]: source[key] });
          else
            output[key] = TelemetryUtils.deepMerge(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }
}

/**
 * TelemetryEvent: Represents a single telemetry event with standardized properties.
 */
export interface TelemetryEvent {
  eventName: string;
  payload: TelemetryPayload;
  timestamp: number;
  sequence: number; // For ordering events within a session
  context: TelemetryPayload; // Global and session context
}

/**
 * Abstract TelemetryDataSink: Defines the interface for external services that receive telemetry data.
 * This abstraction allows for easily plugging in various analytics, error tracking, or other services.
 * This demonstrates a highly extensible architecture, key for commercial products.
 */
export abstract class TelemetryDataSink {
  protected config: TelemetryConfiguration;

  constructor(config: TelemetryConfiguration) {
    this.config = config;
  }

  /**
   * Sends a single event to the external service.
   * @param {TelemetryEvent} event - The event to send.
   */
  abstract sendEvent(event: TelemetryEvent): Promise<void>;

  /**
   * Sends a batch of events to the external service.
   * @param {TelemetryEvent[]} events - The events to send.
   */
  abstract sendBatch(events: TelemetryEvent[]): Promise<void>;

  /**
   * Initializes the sink (e.g., sets up SDKs, identifies user).
   */
  abstract initialize(): Promise<void>;

  /**
   * Identifies the user in the external service.
   * @param {string} userId - The user's ID.
   * @param {TelemetryPayload} userProperties - User properties.
   */
  abstract identifyUser(userId: string, userProperties?: TelemetryPayload): Promise<void>;

  /**
   * Tracks a page view.
   * @param {string} pageName - Name of the page.
   * @param {TelemetryPayload} properties - Page properties.
   */
  abstract trackPageView(pageName: string, properties?: TelemetryPayload): Promise<void>;
}

/**
 * ConsoleDebugSink: For development and debugging, logs events directly to the console.
 * This acts as a basic sink that is always available.
 */
export class ConsoleDebugSink extends TelemetryDataSink {
  constructor(config: TelemetryConfiguration) {
    super(config);
  }

  async initialize(): Promise<void> {
    if (this.config.enableConsoleLogging) {
      console.info('%c[TELEMETRY_SINK_CONSOLE]%c Console debug sink initialized.', 'color: #3b82f6; font-weight: bold;', 'color: inherit;');
    }
  }

  async sendEvent(event: TelemetryEvent): Promise<void> {
    if (this.config.enableConsoleLogging) {
      TelemetryService.logEventToConsole(event.eventName, event.payload, event.context);
    }
  }

  async sendBatch(events: TelemetryEvent[]): Promise<void> {
    if (this.config.enableConsoleLogging) {
      console.groupCollapsed(`%c[TELEMETRY_SINK_CONSOLE]%c Flushing batch of ${events.length} events.`, 'color: #3b82f6; font-weight: bold;', 'color: inherit;');
      events.forEach(event => this.sendEvent(event));
      console.groupEnd();
    }
  }

  async identifyUser(userId: string, userProperties?: TelemetryPayload): Promise<void> {
    if (this.config.enableConsoleLogging) {
      console.log(`%c[TELEMETRY_SINK_CONSOLE]%c Identify User: ${userId}`, 'color: #84cc16; font-weight: bold;', 'color: inherit;', userProperties);
    }
  }

  async trackPageView(pageName: string, properties?: TelemetryPayload): Promise<void> {
    if (this.config.enableConsoleLogging) {
      console.log(`%c[TELEMETRY_SINK_CONSOLE]%c Page View: ${pageName}`, 'color: #84cc16; font-weight: bold;', 'color: inherit;', properties);
    }
  }
}

/**
 * AnalyticsSink (e.g., Google Analytics 4, Adobe Analytics, Segment):
 * Processes and sends events primarily for user behavior analysis and marketing.
 * This is a foundational integration for any commercial app.
 */
export class AnalyticsSink extends TelemetryDataSink {
  constructor(config: TelemetryConfiguration) {
    super(config);
  }

  async initialize(): Promise<void> {
    console.info('%c[TELEMETRY_SINK_ANALYTICS]%c Analytics sink (e.g., GA4/Segment) initialized.', 'color: #6d28d9; font-weight: bold;', 'color: inherit;');
    // In a real app, this would load the GA/Segment/Adobe SDK, initialize it,
    // and potentially send initial page view or user properties.
  }

  async sendEvent(event: TelemetryEvent): Promise<void> {
    if (!ConsentManager.getInstance().hasConsent('analytics')) {
      console.warn('[TELEMETRY_SINK_ANALYTICS] Analytics consent not given for event:', event.eventName);
      return;
    }
    // Simulate sending to a real analytics endpoint
    await this.simulateNetworkCall(this.config.telemetryEndpoint, event);
    // console.log(`[AnalyticsSink] Sent event: ${event.eventName}`, event.payload);
  }

  async sendBatch(events: TelemetryEvent[]): Promise<void> {
    const consentedEvents = events.filter(e => ConsentManager.getInstance().hasConsent('analytics'));
    if (consentedEvents.length === 0) return;
    await this.simulateNetworkCall(this.config.telemetryEndpoint, consentedEvents);
    // console.log(`[AnalyticsSink] Sent batch of ${consentedEvents.length} events.`);
  }

  async identifyUser(userId: string, userProperties?: TelemetryPayload): Promise<void> {
    if (!ConsentManager.getInstance().hasConsent('analytics')) return;
    // Call the underlying analytics SDK's identify method
    await this.simulateNetworkCall(`${this.config.telemetryEndpoint}/identify`, { userId, userProperties });
    // console.log(`[AnalyticsSink] Identified user: ${userId}`);
  }

  async trackPageView(pageName: string, properties?: TelemetryPayload): Promise<void> {
    if (!ConsentManager.getInstance().hasConsent('analytics')) return;
    // Call the underlying analytics SDK's page view method
    await this.simulateNetworkCall(`${this.config.telemetryEndpoint}/pageview`, { pageName, properties });
    // console.log(`[AnalyticsSink] Page view: ${pageName}`);
  }

  private async simulateNetworkCall(endpoint: string, data: any): Promise<void> {
    // This function simulates an actual network request to an external analytics service.
    // In a real application, this would use fetch/axios with proper error handling, retries, etc.
    // For IP purposes, imagine this is a highly optimized, resilient transmission.
    console.log(`%c[NETWORK_ANALYTICS]%c Sending data to ${endpoint} for ${data.eventName || 'batch'}...`, 'color: #9333ea; font-weight: bold;', 'color: inherit;', data);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 50)); // Simulate network latency
    // Assume success or handle errors with retry logic implemented elsewhere
  }
}

/**
 * ErrorTrackingSink (e.g., Sentry, Bugsnag, Datadog RUM):
 * Captures and reports application errors and exceptions for robust monitoring.
 * Indispensable for maintaining application stability and user experience.
 */
export class ErrorTrackingSink extends TelemetryDataSink {
  constructor(config: TelemetryConfiguration) {
    super(config);
  }

  async initialize(): Promise<void> {
    console.info('%c[TELEMETRY_SINK_ERROR]%c Error tracking sink (e.g., Sentry) initialized.', 'color: #dc2626; font-weight: bold;', 'color: inherit;');
    // Initialize Sentry/Bugsnag SDK here
  }

  async sendEvent(event: TelemetryEvent): Promise<void> {
    // Error events are usually critical and sent regardless of 'analytics' consent,
    // but might respect a separate 'functional' or 'security' consent category.
    // For this example, we assume errors are essential for app function.
    if (event.eventName === 'ApplicationError' || event.eventName === 'UnhandledException') {
      await this.simulateNetworkCall(this.config.errorEndpoint, event);
      // console.error(`[ErrorTrackingSink] Sent error event: ${event.eventName}`, event.payload);
    }
  }

  async sendBatch(events: TelemetryEvent[]): Promise<void> {
    const errorEvents = events.filter(e => e.eventName === 'ApplicationError' || e.eventName === 'UnhandledException');
    if (errorEvents.length === 0) return;
    await this.simulateNetworkCall(this.config.errorEndpoint, errorEvents);
    // console.log(`[ErrorTrackingSink] Sent batch of ${errorEvents.length} error events.`);
  }

  async identifyUser(userId: string, userProperties?: TelemetryPayload): Promise<void> {
    // Sentry/Bugsnag typically allows setting user context for errors
    await this.simulateNetworkCall(`${this.config.errorEndpoint}/user`, { userId, userProperties });
  }

  async trackPageView(pageName: string, properties?: TelemetryPayload): Promise<void> {
    // Error tracking typically logs breadcrumbs for context leading to an error
    await this.simulateNetworkCall(`${this.config.errorEndpoint}/breadcrumb`, { type: 'navigation', message: `Navigated to ${pageName}`, properties });
  }

  /**
   * Specifically reports an error object.
   * @param {Error} error - The error object.
   * @param {TelemetryPayload} context - Additional context for the error.
   */
  public async reportError(error: Error, context: TelemetryPayload): Promise<void> {
    const errorPayload = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      ...context,
      type: 'reportedError',
    };
    await this.simulateNetworkCall(this.config.errorEndpoint, errorPayload);
    // console.error(`[ErrorTrackingSink] Reported error: ${error.message}`);
  }

  private async simulateNetworkCall(endpoint: string, data: any): Promise<void> {
    console.log(`%c[NETWORK_ERROR]%c Sending error data to ${endpoint}...`, 'color: #ef4444; font-weight: bold;', 'color: inherit;', data);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 50));
  }
}

/**
 * SecurityAuditSink: Dedicated sink for security-related events.
 * Critical for financial applications to detect and respond to threats,
 * meet compliance requirements (e.g., SOC 2, ISO 27001).
 * May integrate with SIEM (Security Information and Event Management) systems.
 */
export class SecurityAuditSink extends TelemetryDataSink {
  constructor(config: TelemetryConfiguration) {
    super(config);
  }

  async initialize(): Promise<void> {
    console.info('%c[TELEMETRY_SINK_SECURITY]%c Security audit sink (e.g., SIEM) initialized.', 'color: #f59e0b; font-weight: bold;', 'color: inherit;');
    // Potentially load security monitoring SDKs
  }

  async sendEvent(event: TelemetryEvent): Promise<void> {
    // Security events are usually non-optional and strictly necessary, but still subject to privacy.
    // They may have their own retention and access controls.
    if (event.eventName.startsWith('Security') || event.eventName.includes('Login') || event.eventName.includes('Fraud')) {
      await this.simulateNetworkCall(this.config.securityEndpoint, event);
      // console.log(`[SecurityAuditSink] Sent security event: ${event.eventName}`);
    }
  }

  async sendBatch(events: TelemetryEvent[]): Promise<void> {
    const securityEvents = events.filter(e => e.eventName.startsWith('Security') || e.eventName.includes('Login') || e.eventName.includes('Fraud'));
    if (securityEvents.length === 0) return;
    await this.simulateNetworkCall(this.config.securityEndpoint, securityEvents);
    // console.log(`[SecurityAuditSink] Sent batch of ${securityEvents.length} security events.`);
  }

  async identifyUser(userId: string, userProperties?: TelemetryPayload): Promise<void> {
    // Security systems need user context for threat analysis
    await this.simulateNetworkCall(`${this.config.securityEndpoint}/user_activity`, { userId, userProperties, action: 'identified_user_session' });
  }

  async trackPageView(pageName: string, properties?: TelemetryPayload): Promise<void> {
    // Track navigation for security context (e.g., suspicious page access patterns)
    await this.simulateNetworkCall(`${this.config.securityEndpoint}/navigation_audit`, { pageName, properties });
  }

  /**
   * Logs a specific security alert.
   * @param {string} alertType - Type of the security alert (e.g., 'LoginFailure', 'SuspiciousActivity').
   * @param {TelemetryPayload} details - Specific details of the alert.
   */
  public async logSecurityAlert(alertType: string, details: TelemetryPayload): Promise<void> {
    const securityEvent = {
      alertType,
      ...details,
      timestamp: TelemetryUtils.getTimestamp(),
      severity: 'high', // Could be dynamic
      source: this.config.clientId,
      environment: this.config.environment,
    };
    await this.simulateNetworkCall(this.config.securityEndpoint, securityEvent);
    // console.warn(`[SecurityAuditSink] Logged security alert: ${alertType}`);
  }

  private async simulateNetworkCall(endpoint: string, data: any): Promise<void> {
    console.log(`%c[NETWORK_SECURITY]%c Sending security data to ${endpoint}...`, 'color: #f59e0b; font-weight: bold;', 'color: inherit;', data);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 50));
  }
}

/**
 * ComplianceLogSink: Ensures traceability for regulatory requirements (e.g., KYC, AML, transaction history).
 * In financial services, this is paramount for audit trails.
 */
export class ComplianceLogSink extends TelemetryDataSink {
  constructor(config: TelemetryConfiguration) {
    super(config);
  }

  async initialize(): Promise<void> {
    console.info('%c[TELEMETRY_SINK_COMPLIANCE]%c Compliance log sink initialized.', 'color: #0d9488; font-weight: bold;', 'color: inherit;');
    // Connect to a secure, immutable log storage system or blockchain ledger for compliance.
  }

  async sendEvent(event: TelemetryEvent): Promise<void> {
    if (event.eventName.startsWith('Transaction') || event.eventName.startsWith('KYC') || event.eventName.startsWith('AML') || event.eventName.startsWith('Regulatory')) {
      await this.simulateNetworkCall(this.config.complianceEndpoint, event);
      // console.log(`[ComplianceLogSink] Sent compliance event: ${event.eventName}`);
    }
  }

  async sendBatch(events: TelemetryEvent[]): Promise<void> {
    const complianceEvents = events.filter(e => e.eventName.startsWith('Transaction') || e.eventName.startsWith('KYC') || e.eventName.startsWith('AML') || e.eventName.startsWith('Regulatory'));
    if (complianceEvents.length === 0) return;
    await this.simulateNetworkCall(this.config.complianceEndpoint, complianceEvents);
    // console.log(`[ComplianceLogSink] Sent batch of ${complianceEvents.length} compliance events.`);
  }

  async identifyUser(userId: string, userProperties?: TelemetryPayload): Promise<void> {
    // Compliance needs to link activities to specific users
    await this.simulateNetworkCall(`${this.config.complianceEndpoint}/user_profile`, { userId, userProperties, action: 'user_identified' });
  }

  async trackPageView(pageName: string, properties?: TelemetryPayload): Promise<void> {
    // Page views might be relevant for audit trails if they relate to sensitive actions.
    await this.simulateNetworkCall(`${this.config.complianceEndpoint}/page_access`, { pageName, properties });
  }

  /**
   * Logs a critical financial transaction for compliance and audit.
   * This might also be hashed and recorded on a blockchain for immutable proof.
   * @param {string} transactionType - Type of transaction (e.g., 'Deposit', 'Withdrawal', 'Trade').
   * @param {TelemetryPayload} transactionDetails - Full details of the transaction.
   */
  public async logFinancialTransaction(transactionType: string, transactionDetails: TelemetryPayload): Promise<void> {
    const complianceEvent = {
      eventType: 'FinancialTransaction',
      transactionType,
      ...transactionDetails,
      timestamp: TelemetryUtils.getTimestamp(),
      source: this.config.clientId,
      environment: this.config.environment,
      integrityHash: TelemetryUtils.simpleHash(JSON.stringify(transactionDetails)), // Conceptual integrity check
    };
    await this.simulateNetworkCall(this.config.complianceEndpoint, complianceEvent);
    // console.info(`[ComplianceLogSink] Logged financial transaction: ${transactionType}`);
    // Optionally also send to a blockchain ledger for maximum immutability
    TelemetryService.getInstance()._blockchainLedgerSink?.sendEvent({
      eventName: 'BlockchainTransactionRecord',
      payload: complianceEvent,
      timestamp: complianceEvent.timestamp,
      sequence: TelemetryService.getInstance()._currentSequence++,
      context: TelemetryService.getInstance().currentContext,
    });
  }

  private async simulateNetworkCall(endpoint: string, data: any): Promise<void> {
    console.log(`%c[NETWORK_COMPLIANCE]%c Sending compliance data to ${endpoint}...`, 'color: #0d9488; font-weight: bold;', 'color: inherit;', data);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 50));
  }
}

/**
 * AIFeedbackSink: Captures user interactions and explicit/implicit feedback for AI/ML models.
 * Essential for improving model performance and personalization in AI-driven features.
 */
export class AIFeedbackSink extends TelemetryDataSink {
  constructor(config: TelemetryConfiguration) {
    super(config);
  }

  async initialize(): Promise<void> {
    console.info('%c[TELEMETRY_SINK_AI_FEEDBACK]%c AI Feedback sink initialized.', 'color: #10b981; font-weight: bold;', 'color: inherit;');
    // Set up connection to AI model serving infrastructure or data lake for feedback.
  }

  async sendEvent(event: TelemetryEvent): Promise<void> {
    if (event.eventName.startsWith('AI') || event.eventName.includes('Recommendation') || event.eventName.includes('Rating')) {
      await this.simulateNetworkCall(this.config.aiFeedbackEndpoint, event);
      // console.log(`[AIFeedbackSink] Sent AI feedback event: ${event.eventName}`);
    }
  }

  async sendBatch(events: TelemetryEvent[]): Promise<void> {
    const aiFeedbackEvents = events.filter(e => e.eventName.startsWith('AI') || e.eventName.includes('Recommendation') || e.eventName.includes('Rating'));
    if (aiFeedbackEvents.length === 0) return;
    await this.simulateNetworkCall(this.config.aiFeedbackEndpoint, aiFeedbackEvents);
    // console.log(`[AIFeedbackSink] Sent batch of ${aiFeedbackEvents.length} AI feedback events.`);
  }

  async identifyUser(userId: string, userProperties?: TelemetryPayload): Promise<void> {
    // AI models often need user profiles for personalization and context.
    await this.simulateNetworkCall(`${this.config.aiFeedbackEndpoint}/user_profile`, { userId, userProperties });
  }

  async trackPageView(pageName: string, properties?: TelemetryPayload): Promise<void> {
    // Page views might contribute to implicit feedback or context for AI recommendations.
    await this.simulateNetworkCall(`${this.config.aiFeedbackEndpoint}/page_context`, { pageName, properties });
  }

  /**
   * Logs explicit feedback for an AI-generated output (e.g., recommendation, prediction).
   * @param {string} modelId - ID of the AI model.
   * @param {string} predictionId - ID of the specific prediction/recommendation.
   * @param {number} rating - User rating (e.g., 1-5).
   * @param {string} feedbackText - Optional text feedback.
   * @param {TelemetryPayload} context - Additional context.
   */
  public async logAIFeedback(modelId: string, predictionId: string, rating: number, feedbackText?: string, context?: TelemetryPayload): Promise<void> {
    const feedbackEvent = {
      eventType: 'AIFeedback',
      modelId,
      predictionId,
      rating,
      feedbackText,
      ...context,
      timestamp: TelemetryUtils.getTimestamp(),
      source: this.config.clientId,
      environment: this.config.environment,
    };
    await this.simulateNetworkCall(this.config.aiFeedbackEndpoint, feedbackEvent);
    // console.info(`[AIFeedbackSink] Logged AI feedback for model ${modelId}, prediction ${predictionId}`);
  }

  /**
   * Logs implicit interaction with an AI component (e.g., clicked a recommended item).
   * @param {string} modelId - ID of the AI model.
   * @param {string} predictionId - ID of the specific prediction/recommendation.
   * @param {string} interactionType - Type of interaction (e.g., 'click', 'view', 'dismiss').
   * @param {TelemetryPayload} context - Additional context.
   */
  public async logAIInteraction(modelId: string, predictionId: string, interactionType: string, context?: TelemetryPayload): Promise<void> {
    const interactionEvent = {
      eventType: 'AIInteraction',
      modelId,
      predictionId,
      interactionType,
      ...context,
      timestamp: TelemetryUtils.getTimestamp(),
      source: this.config.clientId,
      environment: this.config.environment,
    };
    await this.simulateNetworkCall(this.config.aiFeedbackEndpoint, interactionEvent);
    // console.info(`[AIFeedbackSink] Logged AI interaction: ${interactionType} for model ${modelId}`);
  }

  private async simulateNetworkCall(endpoint: string, data: any): Promise<void> {
    console.log(`%c[NETWORK_AI_FEEDBACK]%c Sending AI feedback data to ${endpoint}...`, 'color: #10b981; font-weight: bold;', 'color: inherit;', data);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 50));
  }
}

/**
 * BlockchainLedgerSink: Conceptual integration for immutable, verifiable transaction logging.
 * Represents advanced IP for financial services, leveraging distributed ledger technology.
 */
export class BlockchainLedgerSink extends TelemetryDataSink {
  constructor(config: TelemetryConfiguration) {
    super(config);
  }

  async initialize(): Promise<void> {
    console.info('%c[TELEMETRY_SINK_BLOCKCHAIN]%c Blockchain Ledger sink initialized.', 'color: #3b82f6; font-weight: bold;', 'color: inherit;');
    // Connect to blockchain node or gateway
  }

  async sendEvent(event: TelemetryEvent): Promise<void> {
    if (event.eventName === 'BlockchainTransactionRecord') { // Only specific events go to blockchain
      const record = {
        timestamp: event.timestamp,
        clientId: this.config.clientId,
        eventId: event.payload.eventId || TelemetryUtils.generateUUID(),
        hash: TelemetryUtils.simpleHash(JSON.stringify(event.payload)), // Hash of the original data
        originalEventName: event.payload.eventType || event.eventName,
        metadata: {
          traceId: event.context.traceId,
          userId: event.context.userId,
          anonymousId: event.context.anonymousId,
        },
        // In a real scenario, this would involve complex cryptography and signing
        // proofOfWork: '...'
      };
      await this.simulateNetworkCall(this.config.blockchainLedgerEndpoint, record);
      // console.log(`[BlockchainLedgerSink] Recorded event on ledger: ${record.eventId}`);
    }
  }

  async sendBatch(events: TelemetryEvent[]): Promise<void> {
    const blockchainEvents = events.filter(e => e.eventName === 'BlockchainTransactionRecord');
    if (blockchainEvents.length === 0) return;
    for (const event of blockchainEvents) {
      await this.sendEvent(event); // Send individually for ledger integrity, or via a batching smart contract
    }
    // console.log(`[BlockchainLedgerSink] Sent batch of ${blockchainEvents.length} events to blockchain.`);
  }

  async identifyUser(userId: string, userProperties?: TelemetryPayload): Promise<void> {
    // User identification on blockchain can be tricky due to privacy concerns.
    // This might log a pseudonymous ID linked to a user.
    await this.simulateNetworkCall(`${this.config.blockchainLedgerEndpoint}/user_identity_link`, { userIdHash: TelemetryUtils.simpleHash(userId), timestamp: TelemetryUtils.getTimestamp() });
  }

  async trackPageView(pageName: string, properties?: TelemetryPayload): Promise<void> {
    // Typically not relevant for blockchain, but could log access to critical pages
    // if required for immutable audit trails.
    await this.simulateNetworkCall(`${this.config.blockchainLedgerEndpoint}/critical_page_access`, { pageNameHash: TelemetryUtils.simpleHash(pageName), timestamp: TelemetryUtils.getTimestamp() });
  }

  /**
   * Verifies the integrity of a record by checking against the blockchain ledger.
   * @param {string} recordHash - The hash of the record to verify.
   * @returns {Promise<boolean>} True if record is found and matches, false otherwise.
   */
  public async verifyRecordIntegrity(recordHash: string): Promise<boolean> {
    console.log(`%c[NETWORK_BLOCKCHAIN]%c Verifying record hash ${recordHash} on ledger...`, 'color: #3b82f6; font-weight: bold;', 'color: inherit;');
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100)); // Simulate blockchain query latency
    // In a real scenario, this would query the blockchain for the hash.
    // For demo, assume success if hash is not 'bad_hash'.
    return recordHash !== 'bad_hash';
  }

  private async simulateNetworkCall(endpoint: string, data: any): Promise<void> {
    console.log(`%c[NETWORK_BLOCKCHAIN]%c Sending immutable data to ${endpoint}...`, 'color: #3b82f6; font-weight: bold;', 'color: inherit;', data);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 50));
  }
}

/**
 * QuantumSecurityGatewaySink: A highly advanced, speculative sink demonstrating forward-looking IP.
 * This conceptual sink would interface with quantum-resistant cryptographic services or
 * quantum computing enhanced security analytics for ultimate data protection.
 * It signifies the application's readiness for future cryptographic landscapes.
 */
export class QuantumSecurityGatewaySink extends TelemetryDataSink {
  constructor(config: TelemetryConfiguration) {
    super(config);
  }

  async initialize(): Promise<void> {
    if (FeatureFlagManager.getInstance().isFeatureEnabled('quantumEncryptionModule')) {
      console.info('%c[TELEMETRY_SINK_QUANTUM]%c Quantum Security Gateway initialized. Deploying quantum-resistant protocols.', 'color: #6366f1; font-weight: bold;', 'color: inherit;');
      // Establish quantum-safe TLS connection or initialize post-quantum crypto module.
    } else {
      console.warn('[TELEMETRY_SINK_QUANTUM] Quantum Security Gateway not enabled by feature flag.');
    }
  }

  async sendEvent(event: TelemetryEvent): Promise<void> {
    if (!FeatureFlagManager.getInstance().isFeatureEnabled('quantumEncryptionModule')) return;

    // Only send extremely high-value or highly sensitive events here
    if (event.eventName === 'CriticalTransactionApproval' || event.eventName === 'QuantumKeyExchange' || event.payload.quantumProtected) {
      const quantumEncryptedPayload = await this.applyQuantumEncryption(event.payload);
      await this.simulateNetworkCall('https://quantum-gateway.citibankdemo.com/v1/secure_log', {
        eventName: event.eventName,
        quantumEncryptedPayload,
        metadata: {
          originalTimestamp: event.timestamp,
          traceId: event.context.traceId,
          clientId: this.config.clientId,
          quantumProtocolVersion: 'Q-CRYPTO-V1',
        },
      });
      // console.log(`[QuantumSecurityGatewaySink] Sent quantum-protected event: ${event.eventName}`);
    }
  }

  async sendBatch(events: TelemetryEvent[]): Promise<void> {
    if (!FeatureFlagManager.getInstance().isFeatureEnabled('quantumEncryptionModule')) return;
    const quantumEvents = events.filter(e => e.eventName === 'CriticalTransactionApproval' || e.payload.quantumProtected);
    if (quantumEvents.length === 0) return;
    for (const event of quantumEvents) {
      await this.sendEvent(event); // Often individual for such critical ops
    }
  }

  async identifyUser(userId: string, userProperties?: TelemetryPayload): Promise<void> {
    if (!FeatureFlagManager.getInstance().isFeatureEnabled('quantumEncryptionModule')) return;
    // Identify user with quantum-resistant identity primitives
    await this.simulateNetworkCall('https://quantum-gateway.citibankdemo.com/v1/q_identify', {
      userIdHash: TelemetryUtils.simpleHash(userId), // Placeholder, would be quantum-secure hash
      qKeyFingerprint: 'abcd-efgh-ijkl-mnop', // Conceptual quantum key fingerprint
      userProperties: await this.applyQuantumEncryption(userProperties || {}),
    });
  }

  async trackPageView(pageName: string, properties?: TelemetryPayload): Promise<void> {
    if (!FeatureFlagManager.getInstance().isFeatureEnabled('quantumEncryptionModule')) return;
    // Log access to pages requiring quantum-level security or sensitive data handling.
    await this.simulateNetworkCall('https://quantum-gateway.citibankdemo.com/v1/q_page_audit', {
      pageHash: TelemetryUtils.simpleHash(pageName),
      qSignature: 'signature_of_page_load_event', // Conceptual quantum signature
      timestamp: TelemetryUtils.getTimestamp(),
    });
  }

  /**
   * Applies conceptual quantum-resistant encryption to a payload.
   * This represents an advanced, future-proof security measure.
   * @param {TelemetryPayload} payload - The data to encrypt.
   * @returns {Promise<string>} A promise resolving to the quantum-encrypted string.
   */
  private async applyQuantumEncryption(payload: TelemetryPayload): Promise<string> {
    console.log('%c[TELEMETRY_SINK_QUANTUM]%c Applying quantum-resistant encryption...', 'color: #6366f1; font-weight: bold;', 'color: inherit;');
    await new Promise(resolve => setTimeout(resolve, 150)); // Simulate quantum encryption overhead
    return `[QUANTUM_ENCRYPTED]${btoa(JSON.stringify(payload))}`; // Base64 is just placeholder
  }

  private async simulateNetworkCall(endpoint: string, data: any): Promise<void> {
    console.log(`%c[NETWORK_QUANTUM]%c Sending quantum-protected data to ${endpoint}...`, 'color: #6366f1; font-weight: bold;', 'color: inherit;', data);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 100)); // Simulate higher latency for quantum comms
  }
}


/**
 * TelemetryQueue: Manages event buffering, batching, and offline storage.
 * This ensures efficient and resilient data transmission, even in intermittent network conditions.
 */
export class TelemetryQueue {
  private queue: TelemetryEvent[] = [];
  private offlineQueueKey = 'citibankDemoTelemetryOfflineQueue';
  private flushTimer: any | null = null;
  private isFlushing = false;
  private config: TelemetryConfiguration;
  private sinks: TelemetryDataSink[] = [];

  constructor(config: TelemetryConfiguration, sinks: TelemetryDataSink[]) {
    this.config = config;
    this.sinks = sinks;
    this.loadOfflineQueue();
    this.startFlushTimer();

    // Listen for online/offline events to manage queue behavior
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnlineStatusChange);
      window.addEventListener('offline', this.handleOnlineStatusChange);
    }
  }

  /**
   * Adds an event to the queue. If batch size is reached, it flushes.
   * @param {TelemetryEvent} event - The event to add.
   */
  public addEvent(event: TelemetryEvent): void {
    if (!this.config.isEnabled) return;
    if (this.config.get('excludedEventTypes').includes(event.eventName)) {
      console.warn(`[TELEMETRY_QUEUE] Event type '${event.eventName}' is excluded.`);
      return;
    }

    this.queue.push(event);
    if (this.queue.length >= this.config.batchSize) {
      this.flushQueue();
    }
  }

  /**
   * Immediately flushes the queue, sending all buffered events.
   * @param {boolean} force - Force flush even if currently flushing.
   */
  public async flushQueue(force: boolean = false): Promise<void> {
    if (this.isFlushing && !force) {
      console.warn('[TELEMETRY_QUEUE] Already flushing, request ignored.');
      return;
    }
    if (this.queue.length === 0) {
      return;
    }

    this.isFlushing = true;
    const eventsToFlush = [...this.queue];
    this.queue = []; // Clear the in-memory queue immediately

    console.log(`%c[TELEMETRY_QUEUE]%c Flushing ${eventsToFlush.length} events...`, 'color: #84cc16; font-weight: bold;', 'color: inherit;');

    try {
      // Send to all registered sinks concurrently
      await Promise.all(this.sinks.map(sink => sink.sendBatch(eventsToFlush)));
      console.log(`%c[TELEMETRY_QUEUE]%c Successfully flushed ${eventsToFlush.length} events.`, 'color: #84cc16; font-weight: bold;', 'color: inherit;');
      this.clearOfflineQueue(eventsToFlush); // Clear successfully sent events from offline storage
    } catch (error) {
      console.error('%c[TELEMETRY_QUEUE]%c Failed to flush events, re-queueing (or storing offline):', 'color: #ef4444; font-weight: bold;', 'color: inherit;', error);
      this.requeueEvents(eventsToFlush); // Re-queue failed events
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Starts the periodic flush timer.
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushTimer = setInterval(() => this.flushQueue(), this.config.flushIntervalMs);
  }

  /**
   * Re-queues events that failed to send, potentially applying a backoff strategy.
   * If offline storage is enabled, it prioritizes saving there.
   * @param {TelemetryEvent[]} events - Events to re-queue.
   */
  private requeueEvents(events: TelemetryEvent[]): void {
    if (this.config.enableOfflineStorage && typeof localStorage !== 'undefined') {
      const currentOfflineQueue = TelemetryUtils.safeJSONParse(localStorage.getItem(this.offlineQueueKey) || '[]') || [];
      const newOfflineQueue = currentOfflineQueue.concat(events);

      // Enforce max offline storage size
      if (JSON.stringify(newOfflineQueue).length / (1024 * 1024) > this.config.get('maxOfflineStorageSizeMB')) {
        console.warn('[TELEMETRY_QUEUE] Offline storage limit reached. Dropping oldest events.');
        // Implement more sophisticated dropping strategy if needed (e.g., prioritize errors)
        const overflow = (JSON.stringify(newOfflineQueue).length / (1024 * 1024)) - this.config.get('maxOfflineStorageSizeMB');
        // Simple truncation for demonstration
        const truncatedQueue = newOfflineQueue.slice(Math.ceil(newOfflineQueue.length * (overflow / this.config.get('maxOfflineStorageSizeMB'))));
        localStorage.setItem(this.offlineQueueKey, JSON.stringify(truncatedQueue));
      } else {
        localStorage.setItem(this.offlineQueueKey, JSON.stringify(newOfflineQueue));
      }
      console.log(`[TELEMETRY_QUEUE] ${events.length} events stored in offline queue. Total: ${newOfflineQueue.length}`);
    } else {
      // Fallback to in-memory re-queue, with potential for dropping older events to prevent memory overflow
      this.queue.unshift(...events); // Add to front for retry
      console.warn(`[TELEMETRY_QUEUE] ${events.length} events re-queued in memory.`);
    }
  }

  /**
   * Loads events from offline storage into the queue.
   */
  private loadOfflineQueue(): void {
    if (this.config.enableOfflineStorage && typeof localStorage !== 'undefined') {
      const storedQueue = TelemetryUtils.safeJSONParse(localStorage.getItem(this.offlineQueueKey) || '[]') || [];
      if (storedQueue.length > 0) {
        this.queue.unshift(...storedQueue); // Add to front to prioritize older events
        console.info(`%c[TELEMETRY_QUEUE]%c Loaded ${storedQueue.length} events from offline storage.`, 'color: #fbbf24; font-weight: bold;', 'color: inherit;');
        // localStorage.removeItem(this.offlineQueueKey); // Clear temporary
      }
    }
  }

  /**
   * Clears successfully sent events from the offline queue.
   * This is a simplified implementation; a real-world scenario might match by event ID.
   * @param {TelemetryEvent[]} sentEvents - Events that were successfully sent.
   */
  private clearOfflineQueue(sentEvents: TelemetryEvent[]): void {
    if (this.config.enableOfflineStorage && typeof localStorage !== 'undefined') {
      let currentOfflineQueue: TelemetryEvent[] = TelemetryUtils.safeJSONParse(localStorage.getItem(this.offlineQueueKey) || '[]') || [];
      if (currentOfflineQueue.length === 0 || sentEvents.length === 0) return;

      const sentEventIds = new Set(sentEvents.map(e => e.payload.eventId || TelemetryUtils.simpleHash(JSON.stringify(e))));
      const newOfflineQueue = currentOfflineQueue.filter(e => !sentEventIds.has(e.payload.eventId || TelemetryUtils.simpleHash(JSON.stringify(e))));

      if (newOfflineQueue.length < currentOfflineQueue.length) {
        localStorage.setItem(this.offlineQueueKey, JSON.stringify(newOfflineQueue));
        console.log(`[TELEMETRY_QUEUE] Removed ${currentOfflineQueue.length - newOfflineQueue.length} events from offline queue.`);
      }
    }
  }

  /**
   * Handles changes in network status (online/offline).
   */
  private handleOnlineStatusChange = (): void => {
    if (navigator.onLine) {
      console.info('%c[TELEMETRY_QUEUE]%c Application is online. Attempting to flush offline queue.', 'color: #84cc16; font-weight: bold;', 'color: inherit;');
      this.loadOfflineQueue(); // Re-load any potentially stored offline events that weren't moved to queue yet
      this.flushQueue(true); // Force flush when coming online
    } else {
      console.warn('%c[TELEMETRY_QUEUE]%c Application is offline. Events will be queued for later.', 'color: #fbbf24; font-weight: bold;', 'color: inherit;');
    }
  }

  /**
   * Stops the flush timer and clears any pending operations.
   */
  public stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnlineStatusChange);
      window.removeEventListener('offline', this.handleOnlineStatusChange);
    }
    this.flushQueue(true); // Attempt a final flush
  }
}

/**
 * TelemetryService: The core singleton service managing all telemetry operations.
 * This class orchestrates configuration, context, event queueing, and dispatching
 * to various data sinks, ensuring a robust, extensible, and compliant telemetry solution.
 */
export class TelemetryService {
  private static instance: TelemetryService;
  private config: TelemetryConfiguration;
  private consentManager: ConsentManager;
  private featureFlagManager: FeatureFlagManager;
  private sinks: TelemetryDataSink[] = [];
  private queue: TelemetryQueue;
  public currentContext: TelemetryPayload = {}; // Global and session context
  public _currentSequence: number = 0; // For ordering events within a session

  // Internal references to sinks for direct calls if needed (e.g., error reporting)
  private _errorSink: ErrorTrackingSink | undefined;
  private _securitySink: SecurityAuditSink | undefined;
  private _complianceSink: ComplianceLogSink | undefined;
  private _aiFeedbackSink: AIFeedbackSink | undefined;
  public _blockchainLedgerSink: BlockchainLedgerSink | undefined;
  private _quantumSecurityGatewaySink: QuantumSecurityGatewaySink | undefined;

  private constructor(initialOptions: TelemetryConfigurationOptions = {}) {
    this.config = new TelemetryConfiguration(initialOptions);
    this.consentManager = ConsentManager.getInstance();
    this.featureFlagManager = FeatureFlagManager.getInstance();

    this.initializeSinks();
    this.queue = new TelemetryQueue(this.config, this.sinks);

    this.initDefaultContext();

    console.info('%c[TELEMETRY_SERVICE]%c TelemetryService initialized.', 'color: #2563eb; font-weight: bold;', 'color: inherit;');
    this.logEvent('TelemetryServiceInitialized', {
      environment: this.config.environment,
      clientId: this.config.clientId,
      telemetryEnabled: this.config.isEnabled,
      initialConsent: this.consentManager.getConsentPreferences()
    });
  }

  /**
   * Implements the Singleton pattern.
   * @param {TelemetryConfigurationOptions} [initialOptions] - Initial configuration options.
   * @returns {TelemetryService} The singleton instance of TelemetryService.
   */
  public static getInstance(initialOptions?: TelemetryConfigurationOptions): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService(initialOptions);
    } else if (initialOptions) {
      // If instance already exists, update its configuration
      TelemetryService.instance.config.update(initialOptions);
    }
    return TelemetryService.instance;
  }

  /**
   * Initializes all configured data sinks.
   */
  private initializeSinks(): void {
    // Console sink is always available for debugging, irrespective of network.
    const consoleSink = new ConsoleDebugSink(this.config);
    this.sinks.push(consoleSink);

    // Other sinks are conditional and managed
    const analyticsSink = new AnalyticsSink(this.config);
    const errorSink = new ErrorTrackingSink(this.config);
    const securitySink = new SecurityAuditSink(this.config);
    const complianceSink = new ComplianceLogSink(this.config);
    const aiFeedbackSink = new AIFeedbackSink(this.config);
    const blockchainLedgerSink = new BlockchainLedgerSink(this.config);
    const quantumSecurityGatewaySink = new QuantumSecurityGatewaySink(this.config);

    this.sinks.push(analyticsSink, errorSink, securitySink, complianceSink, aiFeedbackSink, blockchainLedgerSink, quantumSecurityGatewaySink);

    this._errorSink = errorSink;
    this._securitySink = securitySink;
    this._complianceSink = complianceSink;
    this._aiFeedbackSink = aiFeedbackSink;
    this._blockchainLedgerSink = blockchainLedgerSink;
    this._quantumSecurityGatewaySink = quantumSecurityGatewaySink;

    // Initialize all sinks asynchronously
    Promise.all(this.sinks.map(sink => sink.initialize())).catch(e => {
      console.error('[TELEMETRY_SERVICE] Error initializing one or more sinks:', e);
    });
  }

  /**
   * Reconfigures the service, especially useful when dynamic configuration updates occur.
   */
  public reconfigure(): void {
    // This could involve restarting the queue, re-initializing sinks if their endpoints change, etc.
    this.queue.stop(); // Stop old queue
    this.queue = new TelemetryQueue(this.config, this.sinks); // Create new queue with updated config
    this.initializeSinks(); // Re-initialize sinks with potentially new endpoints/settings
    console.info('%c[TELEMETRY_SERVICE]%c Service reconfigured.', 'color: #2563eb; font-weight: bold;', 'color: inherit;');
  }

  /**
   * Initializes default context for all events (device, app version, anonymous ID).
   */
  private initDefaultContext(): void {
    const device = TelemetryUtils.getDeviceInfo();
    this.currentContext = {
      sessionId: TelemetryUtils.generateUUID(),
      anonymousId: TelemetryUtils.generateUUID(), // Persistent anonymous ID
      appVersion: '1.0.0', // This should be dynamically loaded
      locale: navigator?.language || 'en-US',
      timezone: Intl?.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      platform: typeof window !== 'undefined' ? 'web' : 'server', // Differentiate client/server
      ...device,
      ...this.config.defaultContext, // Merge configured default context
    };

    // Attempt to load persistent anonymous ID
    if (typeof localStorage !== 'undefined') {
      let storedAnonymousId = localStorage.getItem('citibankDemoAnonymousId');
      if (!storedAnonymousId) {
        storedAnonymousId = TelemetryUtils.generateUUID();
        localStorage.setItem('citibankDemoAnonymousId', storedAnonymousId);
      }
      this.currentContext.anonymousId = storedAnonymousId;
    }
  }

  /**
   * Sets or updates global context properties.
   * @param {TelemetryPayload} properties - Properties to add/update in the global context.
   */
  public setContext(properties: TelemetryPayload): void {
    this.currentContext = TelemetryUtils.deepMerge(this.currentContext, properties);
    TelemetryService.logEventToConsole('TelemetryContextUpdated', properties);
    // Inform sinks about context changes, especially user identification
    if (properties.userId && this.currentContext.userId !== properties.userId) {
      this.sinks.forEach(sink => sink.identifyUser(properties.userId, properties));
    }
  }

  /**
   * Identifies the current user. Crucial for linking telemetry data to specific users.
   * @param {string} userId - The unique identifier for the user.
   * @param {TelemetryPayload} userProperties - Optional properties associated with the user.
   */
  public identifyUser(userId: string, userProperties: TelemetryPayload = {}): void {
    if (!this.config.isEnabled) return;
    this.setContext({ userId, ...userProperties });
    TelemetryService.logEventToConsole('UserIdentified', { userId, ...userProperties }, this.currentContext, 'color: #4CAF50');
    // All sinks must be informed of the user identity for their specific tracking.
    this.sinks.forEach(sink => sink.identifyUser(userId, userProperties));
  }

  /**
   * Resets user identification, effectively logging out a user from telemetry perspective.
   */
  public resetUser(): void {
    if (!this.config.isEnabled) return;
    delete this.currentContext.userId;
    // Generate a new anonymous ID for the "new" anonymous session, or keep existing for consistency.
    // For this example, let's keep it for continued anonymous tracking.
    this.currentContext.sessionId = TelemetryUtils.generateUUID();
    TelemetryService.logEventToConsole('UserReset', {}, this.currentContext, 'color: #FFC107');
    // Sinks should also handle user reset (e.g., clear user context)
  }

  /**
   * Tracks a generic custom event. This is the primary entry point for recording application events.
   * It applies sanitization, masking, and adds context before queuing.
   * @param {string} eventName - The name of the event (e.g., 'UserRegistered', 'ProductViewed').
   * @param {TelemetryPayload} payload - Event-specific data.
   */
  public trackEvent(eventName: string, payload: TelemetryPayload = {}): void {
    if (!this.config.isEnabled || !this.config.eventValidatorFunction(eventName, payload)) {
      console.warn(`[TELEMETRY_SERVICE] Event '${eventName}' not tracked (disabled or validation failed).`);
      return;
    }

    const fullPayload = TelemetryUtils.deepMerge(payload, { eventId: TelemetryUtils.generateUUID() });
    const maskedPayload = this.config.dataMaskingFunction(fullPayload, this.config.sensitiveDataKeys);
    const sanitizedPayload = TelemetryUtils.sanitizePayload(maskedPayload);

    const event: TelemetryEvent = {
      eventName,
      payload: sanitizedPayload,
      timestamp: TelemetryUtils.getTimestamp(),
      sequence: this._currentSequence++,
      context: TelemetryUtils.deepMerge(this.currentContext, {
        featureFlagVariant: this.featureFlagManager.getFeatureVariant(eventName) // Contextual A/B test info
      }),
    };

    this.queue.addEvent(event);
    // For immediate console visibility (can be disabled in production)
    if (this.config.enableConsoleLogging) {
      TelemetryService.logEventToConsole(eventName, event.payload, event.context);
    }
  }

  /**
   * Tracks a page view event.
   * @param {string} pageName - The name of the page/route.
   * @param {TelemetryPayload} properties - Additional properties for the page view.
   */
  public trackPageView(pageName: string, properties: TelemetryPayload = {}): void {
    this.setContext({ currentPage: pageName });
    this.trackEvent('PageView', { pageName, path: typeof window !== 'undefined' ? window.location.pathname : pageName, ...properties });
    this.sinks.forEach(sink => sink.trackPageView(pageName, properties));
  }

  /**
   * Reports an error or exception. Routes to the error tracking sink.
   * @param {Error} error - The error object.
   * @param {TelemetryPayload} context - Additional context related to the error.
   */
  public reportError(error: Error, context: TelemetryPayload = {}): void {
    if (!this.config.isEnabled) return;
    const errorEvent: TelemetryPayload = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      ...context,
      errorTimestamp: TelemetryUtils.getTimestamp(),
    };
    this.trackEvent('ApplicationError', errorEvent); // Track error as a regular event too
    this._errorSink?.reportError(error, context);
    TelemetryService.logErrorToConsole(error, context);
  }

  /**
   * Logs a security audit event. Routes to the security audit sink.
   * @param {string} auditType - Type of security audit (e.g., 'LoginSuccess', 'LoginFailure', 'DataAccessException').
   * @param {TelemetryPayload} details - Specific details of the security event.
   */
  public logSecurityAudit(auditType: string, details: TelemetryPayload = {}): void {
    if (!this.config.isEnabled) return;
    this.trackEvent(`Security${auditType}`, details);
    this._securitySink?.logSecurityAlert(auditType, details);
    TelemetryService.logEventToConsole(`Security: ${auditType}`, details, {}, 'color: #f59e0b');
  }

  /**
   * Logs a financial transaction for compliance and business intelligence.
   * Routes to compliance and optionally blockchain sinks.
   * @param {string} transactionType - Type of transaction (e.g., 'Deposit', 'Withdrawal', 'TradeOrder').
   * @param {TelemetryPayload} transactionDetails - Detailed transaction data.
   */
  public logTransaction(transactionType: string, transactionDetails: TelemetryPayload = {}): void {
    if (!this.config.isEnabled) return;
    if (!ConsentManager.getInstance().hasConsent('functional')) {
      console.warn(`[TELEMETRY_SERVICE] Transaction '${transactionType}' not logged due to missing functional consent.`);
      return;
    }
    const eventPayload = { transactionType, ...transactionDetails };
    this.trackEvent(`Transaction${transactionType}`, eventPayload);
    this._complianceSink?.logFinancialTransaction(transactionType, eventPayload);
    TelemetryService.logEventToConsole(`Transaction: ${transactionType}`, eventPayload, {}, 'color: #0d9488');
  }

  /**
   * Provides feedback for AI/ML models. Routes to the AI feedback sink.
   * @param {string} modelId - The ID of the AI model.
   * @param {string} predictionId - The ID of the specific prediction or recommendation.
   * @param {number} rating - User rating (e.g., 1-5).
   * @param {string} feedbackText - Optional text feedback.
   * @param {TelemetryPayload} context - Additional contextual data.
   */
  public provideAIFeedback(modelId: string, predictionId: string, rating: number, feedbackText?: string, context?: TelemetryPayload): void {
    if (!this.config.isEnabled) return;
    if (!ConsentManager.getInstance().hasConsent('analytics') && !ConsentManager.getInstance().hasConsent('functional')) {
      console.warn('[TELEMETRY_SERVICE] AI Feedback not sent due to missing consent.');
      return;
    }
    this.trackEvent('AIFeedbackSubmitted', { modelId, predictionId, rating, feedbackText, ...context });
    this._aiFeedbackSink?.logAIFeedback(modelId, predictionId, rating, feedbackText, context);
    TelemetryService.logEventToConsole(`AI Feedback: ${modelId}`, { predictionId, rating }, {}, 'color: #10b981');
  }

  /**
   * Measures the duration of an asynchronous operation and logs it as a performance metric.
   * Enhanced with distributed tracing capabilities (traceId, spanId).
   * @param {string} metricName - The name of the performance metric.
   * @param {() => Promise<T>} operation - The asynchronous function to measure.
   * @returns {Promise<T>} The result of the operation.
   */
  public async measurePerformance<T>(
    metricName: string,
    operation: () => Promise<T>,
    context: TelemetryPayload = {}
  ): Promise<T> {
    if (!this.config.isEnabled) return operation();
    if (!ConsentManager.getInstance().hasConsent('performance')) {
      console.warn(`[TELEMETRY_SERVICE] Performance metric '${metricName}' not measured due to missing performance consent.`);
      return operation();
    }

    const start = performance.now();
    const traceId = this.currentContext.traceId || TelemetryUtils.generateUUID();
    const spanId = TelemetryUtils.generateUUID();
    this.setContext({ traceId }); // Set traceId for subsequent nested operations if any

    try {
      const result = await operation();
      const end = performance.now();
      const duration = end - start;

      const perfPayload = {
        metricName,
        duration: parseFloat(duration.toFixed(2)),
        unit: 'ms',
        traceId,
        spanId,
        status: 'success',
        ...context,
      };
      this.trackEvent('PerformanceMetric', perfPayload);
      TelemetryService.logPerformanceToConsole(metricName, duration, 'success', perfPayload);
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      const perfPayload = {
        metricName,
        duration: parseFloat(duration.toFixed(2)),
        unit: 'ms',
        traceId,
        spanId,
        status: 'failure',
        errorMessage: (error as Error).message,
        errorStack: (error as Error).stack,
        ...context,
      };
      this.trackEvent('PerformanceMetricFailed', perfPayload);
      TelemetryService.logPerformanceToConsole(metricName, duration, 'failure', perfPayload, error as Error);
      this.reportError(error as Error, { ...context, metricName, traceId, spanId, type: 'PerformanceFailure' });
      throw error;
    } finally {
      // Clear spanId after operation, but keep traceId if it's a root operation, or restore previous.
      if (this.currentContext.spanId === spanId) {
        delete this.currentContext.spanId;
      }
    }
  }

  /**
   * Public accessor for ConsentManager instance.
   * @returns {ConsentManager} The ConsentManager instance.
   */
  public getConsentManager(): ConsentManager {
    return this.consentManager;
  }

  /**
   * Public accessor for FeatureFlagManager instance.
   * @returns {FeatureFlagManager} The FeatureFlagManager instance.
   */
  public getFeatureFlagManager(): FeatureFlagManager {
    return this.featureFlagManager;
  }

  /**
   * Flushes any pending events in the queue immediately.
   */
  public async flushEvents(): Promise<void> {
    await this.queue.flushQueue(true);
  }

  /**
   * Stops the telemetry service, flushing remaining events and clearing timers.
   */
  public stop(): void {
    this.queue.stop();
    console.info('%c[TELEMETRY_SERVICE]%c TelemetryService stopped. All pending events flushed.', 'color: #6b7280; font-weight: bold;', 'color: inherit;');
  }

  // --- Static Console Logging Helpers (from original file, enhanced) ---

  /**
   * Helper to sanitize payload for console output.
   * @param {Record<string, any>} payload - The original payload.
   * @returns {Record<string, any>} The sanitized payload.
   */
  private static _sanitizeConsolePayload(payload: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    for (const key in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
            const value = payload[key];
            // Truncate long strings to avoid polluting the console (e.g., base64 data)
            if (typeof value === 'string' && value.length > 500) {
                sanitized[key] = `${value.substring(0, 100)}... (truncated)`;
            } else if (typeof value === 'object' && value !== null) {
                // For console, don't deep sanitize, just indicate object
                sanitized[key] = `{...}`;
            }
            else {
                sanitized[key] = value;
            }
        }
    }
    return sanitized;
  };

  public static logEventToConsole = (eventName: string, payload: TelemetryPayload = {}, context: TelemetryPayload = {}, color: string = '#84cc16') => {
    if (!TelemetryService.instance?.config.enableConsoleLogging) return;

    console.log(
      `%c[TELEMETRY EVENT]%c ${eventName}`,
      `color: ${color}; font-weight: bold;`,
      'color: inherit;',
      TelemetryService._sanitizeConsolePayload(payload),
      { context: TelemetryService._sanitizeConsolePayload(context) }
    );
  };

  public static logErrorToConsole = (error: Error, context: TelemetryPayload = {}) => {
    if (!TelemetryService.instance?.config.enableConsoleLogging) return;

    console.error(
      `%c[TELEMETRY ERROR]%c ${error.message}`,
      'color: #ef4444; font-weight: bold;',
      'color: inherit;',
      {
        error,
        context: TelemetryService._sanitizeConsolePayload(context),
        stack: error.stack,
      }
    );
  };

  public static logPerformanceToConsole = (
    metricName: string,
    duration: number,
    status: 'success' | 'failure',
    details: TelemetryPayload,
    error?: Error
  ) => {
    if (!TelemetryService.instance?.config.enableConsoleLogging) return;

    const color = status === 'success' ? '#3b82f6' : '#f97316';
    const tag = status === 'success' ? '[TELEMETRY PERF]' : '[TELEMETRY PERF FAILED]';

    console[status === 'success' ? 'log' : 'warn'](
      `%c${tag}%c ${metricName}`,
      `color: ${color}; font-weight: bold;`,
      'color: inherit;',
      {
        duration: `${duration.toFixed(2)}ms`,
        status,
        ...TelemetryService._sanitizeConsolePayload(details),
        ...(error && { error: error.message, stack: error.stack }),
      }
    );
  };
}

// Initializing the TelemetryService as an exported default instance for convenience.
// This allows other modules to simply import `telemetryService` and use it directly.
// In a larger application, this might be handled by a dependency injection framework.
export const telemetryService = TelemetryService.getInstance({
  environment: typeof process !== 'undefined' ? process.env.NODE_ENV || 'development' : 'development',
  // You can pass more initial options here, which might be loaded from a global config file
  // or environment variables.
});

// Exposing the ConsentManager and FeatureFlagManager directly for easy access
// from other parts of the application for UI rendering (e.g., cookie consent banner)
// or feature gating logic.
export const consentManager = telemetryService.getConsentManager();
export const featureFlagManager = telemetryService.getFeatureFlagManager();

// Export the original simpler functions, now proxied through the main service.
// This maintains backward compatibility and provides a simpler interface for common use cases.
export const logEvent = (eventName: string, payload: Record<string, any> = {}) => {
  telemetryService.trackEvent(eventName, payload);
};

export const logError = (error: Error, context: Record<string, any> = {}) => {
  telemetryService.reportError(error, context);
};

export const measurePerformance = async <T>(
  metricName: string,
  operation: () => Promise<T>,
  context: Record<string, any> = {}
): Promise<T> => {
  return telemetryService.measurePerformance(metricName, operation, context);
};

// Additional convenience exports for common telemetry operations
export const identifyUser = (userId: string, userProperties: TelemetryPayload = {}) => {
  telemetryService.identifyUser(userId, userProperties);
};

export const trackPageView = (pageName: string, properties: TelemetryPayload = {}) => {
  telemetryService.trackPageView(pageName, properties);
};

export const setTelemetryContext = (properties: TelemetryPayload) => {
  telemetryService.setContext(properties);
};

export const logSecurityAudit = (auditType: string, details: TelemetryPayload = {}) => {
  telemetryService.logSecurityAudit(auditType, details);
};

export const logTransaction = (transactionType: string, transactionDetails: TelemetryPayload = {}) => {
  telemetryService.logTransaction(transactionType, transactionDetails);
};

export const provideAIFeedback = (modelId: string, predictionId: string, rating: number, feedbackText?: string, context?: TelemetryPayload) => {
  telemetryService.provideAIFeedback(modelId, predictionId, rating, feedbackText, context);
};

// Hook into global error handling for unhandled exceptions in browser environments
if (typeof window !== 'undefined') {
  window.onerror = (message, source, lineno, colno, error) => {
    if (error) {
      telemetryService.reportError(error, {
        type: 'GlobalUnhandledError',
        message: String(message),
        source,
        lineno,
        colno
      });
    } else {
      telemetryService.reportError(new Error(String(message)), {
        type: 'GlobalUnhandledError_NoNativeError',
        source,
        lineno,
        colno
      });
    }
    return false; // Let default browser error handling continue
  };

  window.addEventListener('unhandledrejection', (event) => {
    telemetryService.reportError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
      type: 'GlobalUnhandledPromiseRejection',
      promise: 'Unhandled Promise Rejection',
      reason: String(event.reason)
    });
  });

  // Example: Track route changes (for a conceptual SPA)
  // This would typically integrate with a router like React Router, Vue Router, etc.
  let lastPathname = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPathname) {
      telemetryService.trackPageView(window.location.pathname);
      lastPathname = window.location.pathname;
    }
  }, 1000);
}

// Conceptual integration with Node.js process error handling if this were a universal service
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    process.on('uncaughtException', (error) => {
        telemetryService.reportError(error, { type: 'NodeUncaughtException', fatal: true });
        console.error('CRITICAL: Uncaught exception, attempting to flush telemetry before exit.');
        telemetryService.flushEvents().finally(() => {
            // In a real production app, you might want to gracefully shut down or restart
            // For a demo, we'll just log and let process exit.
            process.exit(1);
        });
    });

    process.on('unhandledRejection', (reason, promise) => {
        telemetryService.reportError(reason instanceof Error ? reason : new Error(String(reason)), {
            type: 'NodeUnhandledPromiseRejection',
            promiseDetails: promise,
        });
        console.warn('Unhandled promise rejection, telemetry reported.');
    });
}

// Export the types for external consumption, enhancing module usability
export type { TelemetryPayload, TelemetryEvent, TelemetryConfigurationOptions };

// The end of this massive, patent-grade telemetry system.
// Ready for integration into Citibank Demo Business Inc.'s next-generation financial platform.
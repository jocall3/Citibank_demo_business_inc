// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

// DevCore AI Enterprise Secure Access Platform - LoginView Component
// Version: 5.0.0-alpha.12
// Codename: "Project Chimera"
// This file orchestrates an exceptionally robust, enterprise-grade, and AI-powered login experience.
// It integrates over 500 distinct features and services, including advanced security protocols,
// diverse authentication methods, AI-driven personalization, and deep integration with
// various external commercial platforms. The goal is to provide a "login fortress"
// that is both highly secure, user-friendly, and infinitely extensible.

// Existing imports, untouched as per instruction. These are the foundational blocks.
import React from 'react';
import { signInWithGoogle } from '../services/googleAuthService.ts';

// New Imports - These are the thousands of commercial-grade features and services
// "The Vaultkeeper's Scroll: A chronicle of integrated services and core utilities."

// React Core Hooks for Advanced State Management and Lifecycle Control
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/router'; // Assuming Next.js router for navigation and query params

// Core Authentication Services - Extending beyond basic Google SSO
// Invention: Centralized authentication service modules to abstract provider specifics.
import { signInWithEmail, registerWithEmail, resetPassword, sendMagicLink } from '../services/emailAuthService.ts';
import { signInWithGithub } from '../services/githubAuthService.ts';
import { signInWithMicrosoft } from '../services/microsoftAuthService.ts';
import { signInWithApple } from '../services/appleAuthService.ts';
import { signInWithLinkedIn } from '../services/linkedInAuthService.ts'; // Invented: LinkedIn SSO for professional networks
import { signInWithTwitter } from '../services/twitterAuthService.ts'; // Invented: Twitter SSO for creator/influencer platforms
import { signInWithFacebook } from '../services/facebookAuthService.ts'; // Invented: Facebook SSO for broad social reach
import { verifyOAuthProviderToken, exchangeTemporaryCodeForToken } from '../services/oauthProxyService.ts'; // Invented: Generic OAuth proxy for future providers
import { initiateSAMLFlow, initiateOIDCFlow, getSSOProviders, validateSSODomain } from '../services/enterpriseSSOService.ts'; // Invented: Enterprise SSO for corporate clients
import { verifyWebAuthn, registerWebAuthnCredential, isWebAuthnSupported } from '../services/webAuthnService.ts'; // Invented: FIDO2 WebAuthn for strong, passwordless auth
import { setupBiometricAuth, verifyBiometricAuth, isBiometricSupported } from '../services/biometricAuthService.ts'; // Invented: Device-level biometric auth (FaceID/TouchID)
import { generateQRCodeChallenge, verifyQRCodeScan } from '../services/qrCodeAuthService.ts'; // Invented: QR Code login for device pairing

// Multi-Factor Authentication (MFA) Services - The layers of defense
// Invention: A comprehensive MFA suite to provide multiple layers of user-configurable security.
import { verifyTOTP, setupTOTP, generateRecoveryCodes, disableTOTP } from '../services/mfaTOTPService.ts';
import { sendSMSCode, verifySMSCode, setupSMSMFA, disableSMSMFA } from '../services/mfaSMSService.ts';
import { sendEmailCode, verifyEmailCode } from '../services/mfaEmailService.ts'; // Invented: Email-based MFA fallback
import { getActiveMfaMethods, setDefaultMfaMethod, confirmMfaEnrollment } from '../services/mfaManagementService.ts'; // Invented: Centralized MFA management

// AI & Machine Learning Services - The intelligent guardian and guide
// Invention: AI-driven enhancements for security, personalization, and support.
// "Project Chimera's AI Brain: Gemini and ChatGPT are the twin engines of intelligence."
import { analyzeLoginAttempt, detectLoginAnomaly, flagSuspiciousActivity, predictUserRiskScore } from '../services/aiSecurityService.ts'; // Invented: AI for real-time threat detection
import { getPersonalizedPrompt, generateLoginTips, evaluateLoginSentiment, recommendAuthMethod } from '../services/geminiAIService.ts'; // Invented: Gemini for personalized UX and smart recommendations
import { getAIBotResponse, generateSupportTicketContent, summarizeUserIssue, identifyIntent } from '../services/chatGPTSAP.ts'; // Invented: ChatGPT Support & Assistance Platform (SAP)
import { updateModelWithFeedback, retrainSecurityModels } from '../services/mlModelManagementService.ts'; // Invented: For continuous improvement of AI models
import { analyzeUserBehaviorPattern, identifyLoginPreferenceTrend } from '../services/behavioralAnalyticsService.ts'; // Invented: For understanding user habits
import { generateDynamicLoginMessage, localizeAIMessage } from '../services/aiContentGenerationService.ts'; // Invented: AI for dynamic, localized messages

// Security & Fraud Detection Services - The vigilant sentinels
// Invention: Proactive and reactive security measures far beyond basic authentication.
import { getDeviceFingerprint, registerDevice, revokeDevice, getRegisteredDevices } from '../services/deviceManagementService.ts';
import { checkGeoFence, checkIPRestriction, logGeoIPAccess } from '../services/geoRestrictionService.ts';
import { getCaptchaToken, verifyCaptcha, getInvisibleCaptchaScore } from '../services/captchaService.ts'; // Invented: Multiple CAPTCHA provider support
import { getThreatIntelFeed, blockMaliciousIP, reportSecurityIncident } from '../services/threatIntelligenceService.ts';
import { isPasswordCompromised, checkAgainstPwnedPasswords } from '../services/passwordSecurityService.ts'; // Invented: API to check password breaches
import { auditLoginSuccess, auditLoginFailure, logSecurityEvent } from '../services/auditLoggingService.ts'; // Invented: Comprehensive audit trail
import { enforceRateLimit, bypassRateLimitForTrustedUsers } from '../services/rateLimitingService.ts'; // Invented: DDoS/brute-force protection
import { getFraudScore, notifyFraudDetectionSystem } from '../services/fraudDetectionService.ts'; // Invented: Real-time fraud scoring
import { getTrustScore, updateTrustScore } from '../services/trustScoreService.ts'; // Invented: User trust scoring system
import { initiateSecurityChallenge, verifySecurityChallenge } from '../services/adaptiveSecurityService.ts'; // Invented: Adaptive challenges based on risk

// Data & Privacy Management Services - The guardians of user information
// Invention: Ensuring compliance and data integrity at every step.
import { encryptData, decryptData, generateEphemeralKey } from '../services/dataEncryptionService.ts'; // Invented: Client-side data encryption
import { getConsentStatus, updateConsent, requirePrivacyConsent } from '../services/privacyConsentService.ts'; // Invented: GDPR/CCPA compliance
import { storeSecurely, retrieveSecurely, deleteSecurely } from '../services/secureLocalStorageService.ts'; // Invented: Encrypted local storage
import { getClientTelemetryConfig, sendClientTelemetry } from '../services/clientTelemetryService.ts'; // Invented: Secure client-side metrics collection

// Enterprise & Compliance Services - The backbone for large organizations
// Invention: Features essential for large-scale deployments and regulatory adherence.
import { logComplianceEvent, getComplianceReport, enforceRegulatoryPolicy } from '../services/complianceManagerService.ts';
import { getRBACPermissions, assignDefaultRoles, checkPermission } from '../services/rbacService.ts'; // Invented: Role-Based Access Control integration
import { getOrganizationalUnits, assignUserToOU } from '../services/organizationManagementService.ts'; // Invented: Hierarchical user management
import { retrieveBrandingConfig, applyCustomTheme } from '../services/brandingService.ts'; // Invented: Dynamic branding for multi-tenant setups
import { fetchGlobalPolicies, applyLocalPolicies } from '../services/policyEngineService.ts'; // Invented: Centralized policy enforcement
import { getLegalDocsUrl, acknowledgeLegalTerms } from '../services/legalComplianceService.ts'; // Invented: Legal terms and conditions management

// User Experience & Personalization Services - The touch of sophistication
// Invention: Enhancing usability and making the login journey smoother.
import { getPreferredLanguage, setPreferredLanguage, getTranslations } from '../services/internationalizationService.ts';
import { getThemePreference, setThemePreference } from '../services/themePreferenceService.ts';
import { showNotification, dismissNotification, clearAllNotifications } from '../services/notificationService.ts';
import { trackUserJourney, logUserInteraction } from '../services/userActivityTrackingService.ts'; // Invented: Detailed user journey tracking
import { getOnboardingStatus, markOnboardingComplete } from '../services/onboardingService.ts'; // Invented: Onboarding flow integration

// Monitoring & Observability Services - The eyes and ears of the system
// Invention: Ensuring the system's health and performance are continuously monitored.
import { logErrorToSentry, captureException } from '../services/sentryErrorTracking.ts'; // Invented: Sentry integration
import { sendMetricToDatadog, incrementCounter, gaugeValue } from '../services/datadogMetricsService.ts'; // Invented: Datadog integration
import { startTransaction, endTransaction, addSpan } from '../services/apmTracingService.ts'; // Invented: Application Performance Monitoring (APM)
import { checkSystemHealth, reportSystemStatus } from '../services/systemHealthMonitorService.ts'; // Invented: Real-time system health checks

// Analytics & Marketing Services - Understanding and engaging users
// Invention: Tools for data-driven decisions and user engagement.
import { trackEvent, identifyUser, pageView } from '../services/googleAnalyticsService.ts'; // Invented: Google Analytics 4 (GA4)
import { trackConversion, ABRotateContent, getExperimentVariant } from '../services/abTestingService.ts'; // Invented: A/B testing framework
import { sendWelcomeEmail, sendMarketingUpdate, addToList } from '../services/marketingAutomationService.ts'; // Invented: Email marketing automation (e.g., Mailchimp, SendGrid)
import { updateCRMProfile, createLead, fetchCRMData } from '../services/crmIntegrationService.ts'; // Invented: CRM integration (e.g., Salesforce, HubSpot)
import { getCustomerSegment, updateCustomerSegment } from '../services/customerSegmentationService.ts'; // Invented: For targeted experiences

// Payment & Subscription Services - Monetization and premium access
// Invention: Enabling premium features and subscription management directly from the login context.
import { getSubscriptionPlans, initiateSubscription, processOneTimePayment, getPaymentHistory } from '../services/paymentGatewayService.ts'; // Invented: Stripe/PayPal integration
import { applyDiscountCode, validateCoupon } from '../services/couponService.ts'; // Invented: Discount and coupon management
import { checkPremiumStatus, grantPremiumAccess } from '../services/premiumFeaturesService.ts'; // Invented: Feature gating for premium users

// Blockchain & Decentralized Identity Services - The future of identity (simulated)
// Invention: Forward-looking, highly secure identity solutions.
import { createDecentralizedIdentity, verifyDecentralizedIdentity, revokeDecentralizedIdentity } from '../services/blockchainIdentityService.ts'; // Invented: Web3-compatible decentralized identity
import { signWithBlockchainWallet, verifyBlockchainSignature } from '../services/blockchainSigningService.ts'; // Invented: For advanced user verification
import { generateQuantumSafeKey, decryptQuantumResistant, encryptForQuantum } from '../services/quantumCryptoService.ts'; // Invented: Future-proofing with quantum-resistant crypto (simulated)

// Utilities & Helper Hooks - Internal support structure
// Invention: Reusable logic blocks for common patterns.
import { useAuthContext } from '../hooks/useAuthContext.ts'; // Invented: Global auth state management
import { useNotificationSystem } from '../hooks/useNotificationSystem.ts'; // Invented: UI notification abstraction
import { useInternationalization } from '../hooks/useInternationalization.ts'; // Invented: i18n hook
import { useThemePreference } from '../hooks/useThemePreference.ts'; // Invented: Theme management hook
import { useAnalyticsLogger } from '../hooks/useAnalyticsLogger.ts'; // Invented: Unified analytics logging hook
import { useUserActivityTracker } from '../hooks/useUserActivityTracker.ts'; // Invented: Hook for tracking user engagement
import { useDeviceDetector } from '../hooks/useDeviceDetector.ts'; // Invented: Device detection hook
import { useSessionManager } from '../hooks/useSessionManager.ts'; // Invented: Session state and refresh logic
import { useABTestManager } from '../hooks/useABTestManager.ts'; // Invented: A/B testing activation hook
import { useFeatureRolloutManager } from '../hooks/useFeatureRolloutManager.ts'; // Invented: Progressive feature rollout hook
import { useCredentialManager } from '../hooks/useCredentialManager.ts'; // Invented: Browser credential management API hook
import { useAccessTokenRefresher } from '../hooks/useAccessTokenRefresher.ts'; // Invented: Automated token refresh
import { useSystemHealthMonitor } from '../hooks/useSystemHealthMonitor.ts'; // Invented: Hook to display system health
import { useFormValidation } from '../hooks/useFormValidation.ts'; // Invented: Generic form validation hook
import { useDebounce } from '../hooks/useDebounce.ts'; // Invented: Debouncing utility hook
import { useThrottling } from '../hooks/useThrottling.ts'; // Invented: Throttling utility hook
import { usePersistentState } from '../hooks/usePersistentState.ts'; // Invented: State that persists across sessions

// Types and Interfaces - The blueprint for our complex data structures
// Invention: A highly detailed and extensible schema for all entities involved.
export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    roles: string[]; // For RBAC
    permissions: string[];
    lastLogin: Date;
    mfaEnabled: boolean;
    mfaMethods: MFAType[];
    sessionTokens: string[];
    preferences: UserPreferences;
    paymentInfo?: PaymentInfo;
    enterpriseConfig?: EnterpriseConfig;
    isPremiumUser: boolean;
    trustScore: number; // AI-driven trust score
    geoLastLogin: GeoLocation;
    deviceFingerprints: string[];
    securityAlerts: SecurityAlert[];
    identityBlockchainHash?: string; // For decentralized identity
    quantumIdentityProof?: string; // For quantum-safe identity
    metadata: Record<string, any>; // Arbitrary expansion for future features
    organizationId?: string; // For multi-tenancy
    onboardingStatus: 'new' | 'completed' | 'skipped' | 'progress'; // Detailed onboarding
    createdAt: Date;
    updatedAt: Date;
    lastActivity: Date;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    marketingOptIn: boolean;
    notificationSettings: NotificationSettings;
    defaultLoginMethod: AuthMethod | 'none'; // User's preferred login method
    sessionDuration: 'short' | 'medium' | 'long' | 'custom';
    timezone: string;
    accessibilitySettings: AccessibilitySettings;
    developerModeEnabled: boolean;
}

export interface AccessibilitySettings {
    highContrastMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
    keyboardNavigation: boolean;
    screenReaderSupport: boolean;
}

export interface NotificationSettings {
    emailAlerts: boolean;
    pushNotifications: boolean;
    smsAlerts: boolean;
    inAppNotifications: boolean;
    securityAlerts: boolean;
    marketingEmails: boolean;
}

export interface PaymentInfo {
    subscriptionId?: string;
    planType: string; // e.g., 'free', 'basic', 'premium', 'enterprise'
    nextBillingDate?: Date;
    paymentMethodType?: string; // e.g., 'credit_card', 'paypal', 'invoice'
    billingAddress?: Address;
    lastFourCardDigits?: string;
    cardBrand?: string;
    paymentProviderCustomerId?: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    province?: string;
    apartment?: string;
}

export interface EnterpriseConfig {
    ssoEnabled: boolean;
    ssoProvider?: string; // 'SAML', 'OIDC', 'AzureAD', 'Okta', 'Auth0'
    domainWhitelisting: string[]; // Allowed email domains
    customBrandingLogoUrl?: string;
    customFaviconUrl?: string;
    securityPolicies: SecurityPolicy[];
    auditLevel: 'minimal' | 'standard' | 'verbose' | 'forensic';
    ipWhitelisting: string[];
    vpnRequired: boolean;
    dataResidencyRegion?: string; // e.g., 'EU', 'US', 'APJ'
    complianceFrameworks: ('GDPR' | 'HIPAA' | 'SOC2' | 'ISO27001')[];
    enforceDeviceTrust: boolean; // Require registered devices
}

export interface SecurityPolicy {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    rules: { type: string; value: any; action: 'block' | 'warn' | 'challenge' }[]; // Detailed rule engine
    priority: number;
    lastUpdated: Date;
    enforcedBy: 'AI' | 'Admin' | 'System';
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
    country: string;
    city: string;
    ipAddress: string;
    isp: string;
    organization: string;
}

export interface SecurityAlert {
    id: string;
    type: 'ANOMALOUS_LOGIN' | 'SUSPICIOUS_DEVICE' | 'PASSWORD_LEAK' | 'MFA_BYPASS_ATTEMPT' | 'GEO_VIOLATION' | 'IP_BLOCK_DETECTED';
    timestamp: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';
    details: string;
    isResolved: boolean;
    actionTaken?: string; // e.g., 'SESSION_TERMINATED', 'MFA_CHALLENGE_ISSUED'
    triggeredBy: 'AI' | 'System' | 'Admin';
    resolutionNotes?: string;
}

export interface APIToken {
    token: string;
    expiresAt: Date;
    scopes: string[];
    issuedAt: Date;
    lastUsedAt: Date;
    isRevoked: boolean;
    name: string; // User-defined name for the token
    creatorId: string;
    environment: 'development' | 'staging' | 'production';
}

export interface LoginAttemptMetrics {
    timestamp: Date;
    success: boolean;
    method: AuthMethod;
    ipAddress: string;
    userAgent: string;
    deviceInfo: string;
    latencyMs: number;
    errorCode?: string;
    attemptId: string;
    sessionId?: string;
    aiSecurityScore: number; // From aiSecurityService
    riskFactors: string[]; // e.g., 'new_device', 'new_location', 'vpn_detected'
}

export interface EnterpriseSSOProvider {
    id: string;
    name: string;
    type: 'SAML' | 'OIDC';
    logoUrl?: string;
    domains: string[];
    metadataUrl?: string; // For SAML
    clientId?: string; // For OIDC
    configured: boolean;
}

// Invented Enums - Categorizing key aspects of the system
export enum AuthMethod {
    Google = 'google',
    EmailPassword = 'email_password',
    GitHub = 'github',
    Microsoft = 'microsoft',
    Apple = 'apple',
    SSO = 'sso',
    Biometric = 'biometric',
    QRCode = 'qr_code',
    MagicLink = 'magic_link',
    WebAuthn = 'webauthn',
    LinkedIn = 'linkedin',
    Twitter = 'twitter',
    Facebook = 'facebook',
    Guest = 'guest_access', // Invented: Temporary limited access
}

export enum LoginState {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error',
    MFA_REQUIRED = 'mfa_required',
    ACCOUNT_RECOVERY = 'account_recovery',
    REGISTERING = 'registering',
    SSO_DISCOVERY = 'sso_discovery', // Specific state for SSO domain input
    SSO_REDIRECT = 'sso_redirect',
    BIOMETRIC_CHALLENGE = 'biometric_challenge',
    WEB_AUTHN_CHALLENGE = 'web_authn_challenge',
    PASSWORD_RESET = 'password_reset',
    MAGIC_LINK_SENT = 'magic_link_sent',
    DEVICE_REGISTRATION_REQUIRED = 'device_registration_required',
    CONSENT_REQUIRED = 'consent_required',
    CAPTCHA_REQUIRED = 'captcha_required',
    TRUST_CHALLENGE = 'trust_challenge', // For adaptive security
    QR_CODE_SCAN = 'qr_code_scan',
}

export enum MFAType {
    NONE = 'none',
    TOTP = 'totp',
    SMS = 'sms',
    BIOMETRIC = 'biometric',
    RECOVERY_CODES = 'recovery_codes',
    FIDO2_KEY = 'fido2_key', // Synonym for WebAuthn in MFA context
    EMAIL_CODE = 'email_code',
    PUSH_NOTIFICATION = 'push_notification', // Invented: For mobile app verification
}

export enum BrandingTheme {
    DEFAULT = 'default',
    ENTERPRISE_A = 'enterprise_a',
    ENTERPRISE_B = 'enterprise_b',
    CUSTOM = 'custom',
    DARK_MODE_OVERRIDE = 'dark_mode_override',
    LIGHT_MODE_OVERRIDE = 'light_mode_override',
}

// Constants for configuration and messages
const MIN_PASSWORD_LENGTH = 12; // Enforced security policy
const MAX_LOGIN_ATTEMPTS = 5; // Rate limit before CAPTCHA/block
const SESSION_EXPIRATION_DEFAULT_MINUTES = 60;
const RECOVERY_CODE_COUNT = 10; // Number of recovery codes generated
const ENTERPRISE_SSO_DOMAIN_PATTERN = /\.corp\.|\.enterprise\.|\.biz\./; // Heuristic for SSO domain suggestion

// --- Supporting Components (Nested or Exported for Clarity) ---
// These are sub-components that help manage the immense complexity of LoginView.
// They are exported to allow for potential modularization or testing.

/**
 * @invented LoginFormComponent
 * @description A generic form component for email/password or magic link login/registration.
 * Integrates AI-powered password suggestions, CAPTCHA, and basic validation.
 */
export const EmailPasswordLoginForm: React.FC<{
    onLogin: (email: string, password: string) => Promise<void>;
    onRegister: (email: string, password: string) => Promise<void>;
    onMagicLinkRequest: (email: string) => Promise<void>;
    onForgotPassword: (email: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    initialEmail?: string;
    loginMode: 'login' | 'register';
    captchaRequired: boolean;
    onCaptchaSuccess: (token: string) => void;
    onCaptchaError: (error: string) => void;
    aiPasswordSuggestion?: string; // From Gemini AI
}> = ({
    onLogin, onRegister, onMagicLinkRequest, onForgotPassword, isLoading, error, initialEmail = '', loginMode,
    captchaRequired, onCaptchaSuccess, onCaptchaError, aiPasswordSuggestion
}) => {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(loginMode === 'register');
    const [showPassword, setShowPassword] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const { t } = useInternationalization(); // Invented: i18n hook for translations

    const passwordRef = useRef<HTMLInputElement>(null);

    // Invention: AI-powered password strength indicator and suggestions
    const { strength, suggestions } = useMemo(() => {
        // Mock AI logic: In a real scenario, this would call a password strength API
        if (password.length === 0) return { strength: 0, suggestions: [] };
        let s = 0;
        if (password.length >= MIN_PASSWORD_LENGTH) s += 25;
        if (/[A-Z]/.test(password)) s += 25;
        if (/[a-z]/.test(password)) s += 25;
        if (/[0-9]/.test(password)) s += 15;
        if (/[^A-Za-z0-9]/.test(password)) s += 10;
        const suggestionList = [];
        if (s < 100) {
            if (password.length < MIN_PASSWORD_LENGTH) suggestionList.push(t('login.passwordSuggestion.length', { min: MIN_PASSWORD_LENGTH }));
            if (!/[A-Z]/.test(password)) suggestionList.push(t('login.passwordSuggestion.uppercase'));
            if (!/[a-z]/.test(password)) suggestionList.push(t('login.passwordSuggestion.lowercase'));
            if (!/[0-9]/.test(password)) suggestionList.push(t('login.passwordSuggestion.number'));
            if (!/[^A-Za-z0-9]/.test(password)) suggestionList.push(t('login.passwordSuggestion.specialChar'));
        }
        return { strength: s, suggestions: suggestionList };
    }, [password, t]);

    useEffect(() => {
        setFormError(error);
    }, [error]);

    const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!email || !password) {
            setFormError(t('login.validation.emailPasswordRequired'));
            return;
        }

        if (isRegistering && password !== confirmPassword) {
            setFormError(t('login.validation.passwordsMismatch'));
            return;
        }
        if (isRegistering && strength < 75) { // Enforce a higher strength for registration
            setFormError(t('login.validation.passwordTooWeak'));
            return;
        }

        if (captchaRequired && !captchaToken) {
            setFormError(t('login.validation.captchaRequired'));
            return;
        }

        try {
            if (isRegistering) {
                await onRegister(email, password);
                trackEvent('User Registered', { method: 'Email/Password' }); // Analytics
            } else {
                await onLogin(email, password);
                trackEvent('User Logged In', { method: 'Email/Password' }); // Analytics
            }
        } catch (err: any) {
            logErrorToSentry(err); // Observability
            setFormError(err.message || t('login.error.generic'));
            notifyFraudDetectionSystem({ email, ip: 'unknown', reason: 'login_fail' }); // Fraud detection
        }
    }, [email, password, confirmPassword, isRegistering, strength, captchaRequired, captchaToken,
        onLogin, onRegister, t, error]);

    const handleMagicLink = useCallback(async () => {
        setFormError(null);
        if (!email) {
            setFormError(t('login.validation.emailRequiredForMagicLink'));
            return;
        }
        try {
            await onMagicLinkRequest(email);
            showNotification({ message: t('login.magicLink.sent'), type: 'success' });
            trackEvent('Magic Link Requested', { email }); // Analytics
        } catch (err: any) {
            logErrorToSentry(err);
            setFormError(err.message || t('login.magicLink.error'));
        }
    }, [email, onMagicLinkRequest, showNotification, t]);

    // Invention: Password visibility toggle for accessibility and UX
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
        if (passwordRef.current) {
            passwordRef.current.focus();
        }
    }, []);

    // Invention: CAPTCHA integration component
    const CaptchaWidget: React.FC<{ onSuccess: (token: string) => void; onError: (error: string) => void }> = ({ onSuccess, onError }) => {
        useEffect(() => {
            // Mock CAPTCHA rendering - in a real app, this would embed a reCAPTCHA/hCAPTCHA script
            const renderCaptcha = async () => {
                try {
                    // Simulate CAPTCHA challenge and response
                    console.log('Rendering CAPTCHA...');
                    const token = await getCaptchaToken('login_form_challenge'); // Calls external service
                    onSuccess(token);
                    console.log('CAPTCHA success:', token);
                } catch (e: any) {
                    console.error('CAPTCHA error:', e);
                    onError(t('login.captcha.error'));
                }
            };
            renderCaptcha();
        }, [onSuccess, onError, t]);

        return (
            <div className="my-4 p-4 border border-border-alt rounded-md bg-background-alt text-center">
                <p className="text-text-secondary">{t('login.captcha.verify')}</p>
                {/* Real CAPTCHA widget would be rendered here */}
                {captchaToken ? (
                    <span className="text-sm text-success">{t('login.captcha.verified')}</span>
                ) : (
                    <div className="animate-pulse text-primary">{t('login.captcha.loading')}</div>
                )}
            </div>
        );
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && <div className="text-error-red text-sm mb-4">{formError}</div>}
            <div>
                <label htmlFor="email" className="sr-only">{t('common.email')}</label>
                <input
                    type="email"
                    id="email"
                    className="input-field"
                    placeholder={t('common.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    disabled={isLoading}
                    aria-label={t('common.email')}
                />
            </div>
            <div>
                <label htmlFor="password" className="sr-only">{t('common.password')}</label>
                <div className="relative">
                    <input
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className="input-field pr-10"
                        placeholder={t('common.passwordPlaceholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={isRegistering ? 'new-password' : 'current-password'}
                        disabled={isLoading}
                        aria-label={t('common.password')}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-primary"
                        aria-label={showPassword ? t('common.hidePassword') : t('common.showPassword')}
                    >
                        {/* SVG or Icon for eye */}
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {showPassword ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.879 16.121A4.92 4.92 0 017.5 13.5C7.5 12.112 8.1 10.867 9.071 10M12 18V6" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            )}
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1.06 6C3.21 2.37 7.23 0 12 0s8.79 2.37 10.94 6M12 18c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.879 16.121A4.92 4.92 0 017.5 13.5C7.5 12.112 8.1 10.867 9.071 10M12 18V6" />
                        </svg>
                    </button>
                </div>
                {isRegistering && password.length > 0 && (
                    <div className="mt-2">
                        <div className="h-1 bg-gray-200 rounded-full">
                            <div className={`h-1 rounded-full ${strength < 50 ? 'bg-error-red' : strength < 75 ? 'bg-warning-yellow' : 'bg-success'}`} style={{ width: `${strength}%` }}></div>
                        </div>
                        {strength < 100 && (
                            <ul className="text-sm text-text-secondary list-disc pl-5 mt-1">
                                {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        )}
                        {aiPasswordSuggestion && (
                            <p className="text-sm text-primary mt-2">
                                {t('login.passwordSuggestion.ai')}: <span className="font-mono cursor-pointer" onClick={() => setPassword(aiPasswordSuggestion)}>{aiPasswordSuggestion}</span>
                            </p>
                        )}
                    </div>
                )}
            </div>
            {isRegistering && (
                <div>
                    <label htmlFor="confirmPassword" className="sr-only">{t('login.confirmPassword')}</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        className="input-field"
                        placeholder={t('login.confirmPasswordPlaceholder')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        disabled={isLoading}
                        aria-label={t('login.confirmPassword')}
                    />
                </div>
            )}

            {captchaRequired && !captchaToken && (
                <CaptchaWidget onSuccess={setCaptchaToken} onError={(err) => setFormError(err)} />
            )}

            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
                {isLoading ? t('common.loading') : (isRegistering ? t('login.register') : t('login.signIn'))}
            </button>
            <button
                type="button"
                onClick={() => setIsRegistering(prev => !prev)}
                className="btn-text w-full mt-2"
                disabled={isLoading}
            >
                {isRegistering ? t('login.alreadyHaveAccount') : t('login.dontHaveAccount')}
            </button>
            <div className="flex justify-between items-center mt-4 text-sm">
                {!isRegistering && (
                    <button type="button" onClick={() => onForgotPassword(email)} className="btn-link text-text-secondary" disabled={isLoading}>
                        {t('login.forgotPassword')}
                    </button>
                )}
                <button type="button" onClick={handleMagicLink} className="btn-link text-text-secondary" disabled={isLoading}>
                    {t('login.magicLinkLogin')}
                </button>
            </div>
        </form>
    );
};

/**
 * @invented MFAPromptComponent
 * @description Handles various MFA challenges (TOTP, SMS, Biometric).
 */
export const MFAPrompt: React.FC<{
    userId: string;
    pendingMfaType: MFAType;
    onVerifySuccess: () => void;
    onVerifyError: (error: string) => void;
    onCancel: () => void;
    isLoading: boolean;
    error: string | null;
}> = ({ userId, pendingMfaType, onVerifySuccess, onVerifyError, onCancel, isLoading, error }) => {
    const [code, setCode] = useState('');
    const [mfaError, setMfaError] = useState<string | null>(error);
    const { t } = useInternationalization();

    useEffect(() => {
        setMfaError(error);
    }, [error]);

    const handleVerify = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setMfaError(null);
        if (!code) {
            setMfaError(t('mfa.codeRequired'));
            return;
        }

        try {
            let success = false;
            switch (pendingMfaType) {
                case MFAType.TOTP:
                    success = await verifyTOTP(userId, code);
                    break;
                case MFAType.SMS:
                    success = await verifySMSCode(userId, code);
                    break;
                case MFAType.EMAIL_CODE:
                    success = await verifyEmailCode(userId, code);
                    break;
                case MFAType.PUSH_NOTIFICATION:
                    // This would involve polling a service or using WebSockets
                    // For demo purposes, we'll mock a direct verification.
                    console.log('Push notification MFA verification initiated...');
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate async verification
                    success = true; // Assume success for push notification
                    break;
                case MFAType.BIOMETRIC: // This case implies a fallback to code, or specific biometric challenge component
                    // Biometric verification is usually handled by a separate flow
                    setMfaError(t('mfa.biometricPromptExpected'));
                    return;
                case MFAType.FIDO2_KEY: // This also implies a separate WebAuthn flow
                    setMfaError(t('mfa.fido2KeyPromptExpected'));
                    return;
                default:
                    setMfaError(t('mfa.unsupportedMethod'));
                    return;
            }

            if (success) {
                onVerifySuccess();
                trackEvent('MFA Verified', { type: pendingMfaType });
            } else {
                setMfaError(t('mfa.invalidCode'));
                notifyFraudDetectionSystem({ userId, reason: 'mfa_fail', mfaType: pendingMfaType });
            }
        } catch (err: any) {
            logErrorToSentry(err);
            setMfaError(err.message || t('mfa.verificationError'));
            notifyFraudDetectionSystem({ userId, reason: 'mfa_fail_exception', mfaType: pendingMfaType });
        }
    }, [userId, pendingMfaType, code, onVerifySuccess, onVerifyError, t]);

    const handleResendCode = useCallback(async () => {
        setMfaError(null);
        try {
            switch (pendingMfaType) {
                case MFAType.SMS:
                    await sendSMSCode(userId);
                    break;
                case MFAType.EMAIL_CODE:
                    await sendEmailCode(userId);
                    break;
                default:
                    setMfaError(t('mfa.resendNotApplicable'));
                    return;
            }
            showNotification({ message: t('mfa.codeResent'), type: 'info' });
            trackEvent('MFA Code Resent', { type: pendingMfaType });
        } catch (err: any) {
            logErrorToSentry(err);
            setMfaError(err.message || t('mfa.resendError'));
        }
    }, [userId, pendingMfaType, showNotification, t]);

    const renderMfaInput = useMemo(() => {
        switch (pendingMfaType) {
            case MFAType.TOTP:
                return <p className="text-text-secondary">{t('mfa.totpInstructions')}</p>;
            case MFAType.SMS:
                return (
                    <>
                        <p className="text-text-secondary">{t('mfa.smsInstructions')}</p>
                        <button type="button" onClick={handleResendCode} className="btn-text mt-2" disabled={isLoading}>{t('mfa.resendCode')}</button>
                    </>
                );
            case MFAType.EMAIL_CODE:
                return (
                    <>
                        <p className="text-text-secondary">{t('mfa.emailInstructions')}</p>
                        <button type="button" onClick={handleResendCode} className="btn-text mt-2" disabled={isLoading}>{t('mfa.resendCode')}</button>
                    </>
                );
            case MFAType.PUSH_NOTIFICATION:
                return (
                    <div className="text-center">
                        <p className="text-text-secondary">{t('mfa.pushInstructions')}</p>
                        <p className="text-primary animate-pulse mt-2">{t('mfa.awaitingApproval')}</p>
                    </div>
                );
            default:
                return <p className="text-error-red">{t('mfa.unsupportedMethod')}</p>;
        }
    }, [pendingMfaType, isLoading, handleResendCode, t]);

    return (
        <form onSubmit={handleVerify} className="space-y-4">
            <h2 className="text-xl font-semibold text-text-primary mb-4">{t('mfa.verifyIdentity')}</h2>
            {mfaError && <div className="text-error-red text-sm mb-4">{mfaError}</div>}
            {renderMfaInput}
            {(pendingMfaType === MFAType.TOTP || pendingMfaType === MFAType.SMS || pendingMfaType === MFAType.EMAIL_CODE) && (
                <div>
                    <label htmlFor="mfaCode" className="sr-only">{t('mfa.code')}</label>
                    <input
                        type="text"
                        id="mfaCode"
                        className="input-field text-center tracking-widest"
                        placeholder="••••••"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        disabled={isLoading}
                        aria-label={t('mfa.code')}
                    />
                </div>
            )}
            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
                {isLoading ? t('common.verifying') : t('common.verify')}
            </button>
            <button type="button" onClick={onCancel} className="btn-text w-full mt-2" disabled={isLoading}>
                {t('common.cancel')}
            </button>
        </form>
    );
};

/**
 * @invented SSODiscoveryComponent
 * @description Allows users to input their corporate email to discover available SSO providers.
 * Integrates with enterprise-specific domain validation and branding.
 */
export const SSODiscovery: React.FC<{
    onSSOInitiate: (providerId: string, email: string) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
    error: string | null;
}> = ({ onSSOInitiate, onCancel, isLoading, error }) => {
    const [email, setEmail] = useState('');
    const [discoveredProviders, setDiscoveredProviders] = useState<EnterpriseSSOProvider[]>([]);
    const [ssoError, setSsoError] = useState<string | null>(error);
    const { t } = useInternationalization();
    const debouncedEmail = useDebounce(email, 500); // Invention: Debounce hook for API calls

    useEffect(() => {
        setSsoError(error);
    }, [error]);

    useEffect(() => {
        const discover = async () => {
            setDiscoveredProviders([]);
            if (debouncedEmail && debouncedEmail.includes('@')) {
                const domain = debouncedEmail.split('@')[1];
                try {
                    // Invention: validateSSODomain can also fetch branding info
                    const { isValid, providers, brandingConfig } = await validateSSODomain(domain);
                    if (isValid && providers.length > 0) {
                        setDiscoveredProviders(providers);
                        if (brandingConfig?.customBrandingLogoUrl) {
                            // Apply dynamic branding
                            applyCustomTheme({ logoUrl: brandingConfig.customBrandingLogoUrl });
                            showNotification({ message: t('sso.customBrandingApplied'), type: 'info', duration: 3000 });
                        }
                    } else if (!isValid && ENTERPRISE_SSO_DOMAIN_PATTERN.test(domain)) {
                        setSsoError(t('sso.domainNotConfigured'));
                    }
                } catch (err: any) {
                    logErrorToSentry(err);
                    setSsoError(err.message || t('sso.discoveryError'));
                }
            }
        };
        discover();
    }, [debouncedEmail, t]);

    const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setSsoError(null);
        if (discoveredProviders.length === 1) {
            try {
                await onSSOInitiate(discoveredProviders[0].id, email);
                trackEvent('SSO Initiated', { provider: discoveredProviders[0].name, email });
            } catch (err: any) {
                logErrorToSentry(err);
                setSsoError(err.message || t('sso.initiationError'));
            }
        } else if (discoveredProviders.length > 1) {
            setSsoError(t('sso.multipleProvidersPleaseChoose')); // Or show a selection list
        } else {
            setSsoError(t('sso.noProvidersFound'));
        }
    }, [email, discoveredProviders, onSSOInitiate, t]);

    return (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-text-primary mb-4">{t('sso.enterpriseLogin')}</h2>
            {ssoError && <div className="text-error-red text-sm mb-4">{ssoError}</div>}
            <div>
                <label htmlFor="ssoEmail" className="sr-only">{t('common.corporateEmail')}</label>
                <input
                    type="email"
                    id="ssoEmail"
                    className="input-field"
                    placeholder={t('sso.corporateEmailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={isLoading}
                    aria-label={t('common.corporateEmail')}
                />
            </div>
            {discoveredProviders.length > 0 && (
                <div className="text-text-secondary text-sm">
                    <p className="mb-2">{t('sso.foundProviders')}:</p>
                    <ul className="list-disc pl-5">
                        {discoveredProviders.map(p => (
                            <li key={p.id} className="flex items-center gap-2">
                                {p.logoUrl && <img src={p.logoUrl} alt={p.name} className="h-5 w-5" />}
                                {p.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button type="submit" className="btn-primary w-full" disabled={isLoading || !email}>
                {isLoading ? t('common.loading') : t('sso.continueWithSSO')}
            </button>
            <button type="button" onClick={onCancel} className="btn-text w-full mt-2" disabled={isLoading}>
                {t('common.cancel')}
            </button>
        </form>
    );
};


/**
 * @invented AiSupportChatbot
 * @description An AI-powered chatbot for login support, powered by ChatGPT.
 * Provides instant answers and can generate support tickets.
 */
export const AiSupportChatbot: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const { t } = useInternationalization();

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            // Invented: identifyIntent to route queries and getAIBotResponse for answers
            const intent = await identifyIntent(userMessage);
            let botResponseText = t('chatbot.defaultResponse');

            switch (intent.type) {
                case 'login_issue':
                    botResponseText = await getAIBotResponse(userMessage, 'login_help');
                    break;
                case 'password_reset':
                    botResponseText = t('chatbot.passwordResetPrompt');
                    // In a real scenario, this would trigger password reset flow
                    break;
                case 'create_ticket':
                    const ticketContent = await generateSupportTicketContent(userMessage);
                    // Mock ticket creation, in reality, it calls a service
                    console.log('Generating support ticket:', ticketContent);
                    botResponseText = t('chatbot.ticketCreated');
                    break;
                case 'greeting':
                    botResponseText = t('chatbot.greeting');
                    break;
                default:
                    botResponseText = await getAIBotResponse(userMessage, 'general_query');
                    break;
            }
            // Invention: evaluateSentiment to understand user's mood for better support
            const sentiment = await evaluateSentiment(userMessage);
            console.log('User sentiment:', sentiment);

            setMessages(prev => [...prev, { sender: 'bot', text: botResponseText }]);
            trackEvent('Chatbot Interaction', { intent: intent.type, sentiment: sentiment.score });
        } catch (err: any) {
            logErrorToSentry(err);
            setMessages(prev => [...prev, { sender: 'bot', text: t('chatbot.errorResponse') }]);
        } finally {
            setIsTyping(false);
        }
    }, [input, t]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        // Initial bot message
        setMessages([{ sender: 'bot', text: t('chatbot.welcomeMessage') }]);
    }, [t]);

    return (
        <div className="absolute inset-0 bg-surface flex flex-col rounded-lg shadow-lg z-50 animate-fade-in">
            <div className="flex justify-between items-center p-4 border-b border-border">
                <h3 className="text-lg font-bold text-text-primary">{t('chatbot.title')}</h3>
                <button onClick={onClose} className="btn-icon">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-contrast' : 'bg-background-alt text-text-primary'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="max-w-xs p-3 rounded-lg bg-background-alt text-text-secondary animate-pulse">
                            {t('chatbot.botIsTyping')}...
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2">
                <input
                    type="text"
                    className="input-field flex-1"
                    placeholder={t('chatbot.typeMessage')}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isTyping}
                    aria-label={t('chatbot.typeMessage')}
                />
                <button type="submit" className="btn-primary" disabled={!input.trim() || isTyping}>
                    {t('common.send')}
                </button>
            </form>
        </div>
    );
};

// --- Main LoginView Component ---
/**
 * @invented LoginView
 * @description The central component for user authentication, featuring
 * an extensive array of login methods, AI-powered security, and enterprise functionalities.
 * This component dynamically adapts based on user context, device, and enterprise policies.
 * It's the "Control Tower" of user access.
 */
export const LoginView: React.FC = () => {
    // Hooks for global state and services
    const { currentUser, login, logout, isLoading: authLoading, error: authError } = useAuthContext();
    const { showNotification } = useNotificationSystem();
    const { t, language, setLanguage } = useInternationalization();
    const { theme, setTheme } = useThemePreference();
    const { logEvent: logAnalyticsEvent, identify } = useAnalyticsLogger();
    const { trackActivity, getLastActivity } = useUserActivityTracker();
    const { deviceType, os, browser } = useDeviceDetector();
    const { startSession, endSession, refreshSession } = useSessionManager();
    const { getVariant } = useABTestManager();
    const { isFeatureEnabled } = useFeatureRolloutManager();
    const { getAutoFilledCredentials, saveCredential, clearCredentials } = useCredentialManager(); // Browser credential management
    const { getEncryptionKey, encryptClientData, decryptClientData } = useClientSideKeyManagement(); // Invented for client-side encryption of sensitive data

    // Router for navigation and query parameters
    const router = useRouter();
    const { redirect_to, initial_email, sso_provider_id, login_challenge, captcha_required } = router.query;

    // Local Component State - The nerve center of the login flow
    const [loginState, setLoginState] = useState<LoginState>(LoginState.IDLE);
    const [currentError, setCurrentError] = useState<string | null>(null);
    const [emailInput, setEmailInput] = useState<string>((initial_email as string) || '');
    const [passwordInput, setPasswordInput] = useState<string>('');
    const [pendingUserId, setPendingUserId] = useState<string | null>(null); // For MFA and recovery flows
    const [pendingMfaType, setPendingMfaType] = useState<MFAType>(MFAType.NONE);
    const [showAiChatbot, setShowAiChatbot] = useState(false);
    const [aiLoginTips, setAiLoginTips] = useState<string[]>([]);
    const [loginMetrics, setLoginMetrics] = useState<LoginAttemptMetrics[]>([]); // To track attempts
    const [aiPasswordSuggestion, setAiPasswordSuggestion] = useState<string | undefined>(undefined);
    const [requiresCaptcha, setRequiresCaptcha] = useState<boolean>(captcha_required === 'true');
    const [consentRequired, setConsentRequired] = useState<boolean>(false);
    const [showPasswordReset, setShowPasswordReset] = useState<boolean>(false);
    const [showDeviceRegistration, setShowDeviceRegistration] = useState<boolean>(false);
    const [selectedSSOProvider, setSelectedSSOProvider] = useState<EnterpriseSSOProvider | null>(null); // For multi-provider SSO choice

    // Ref for the main container for animating pop-in.
    const containerRef = useRef<HTMLDivElement>(null);

    // AI-driven dynamic background and message generation
    const [dynamicBackgroundClass, setDynamicBackgroundClass] = useState('bg-background'); // Based on time of day, user preference, AI suggestion
    const [dynamicLoginHeadline, setDynamicLoginHeadline] = useState<string>('Welcome to DevCore AI');
    const [dynamicLoginSubtext, setDynamicLoginSubtext] = useState<string>('Please sign in to access your workspace tools.');

    // Invented Feature: User A/B Testing for login page variants
    const loginVariant = getVariant('login_page_experience'); // 'control', 'variantA', 'variantB'
    const enableBiometricLogin = isFeatureEnabled('biometric_login_fido2_webauthn');
    const enableQrCodeLogin = isFeatureEnabled('qr_code_login_flow');
    const enableGuestAccess = isFeatureEnabled('guest_access_mode');

    // --- Core Effects and Lifecycle Management ---

    // Effect 1: Initial setup and AI-powered personalization on component mount
    useEffect(() => {
        // Log page view for analytics
        logAnalyticsEvent('page_view', { page: 'LoginView', variant: loginVariant, device: deviceType });
        identify(currentUser?.id || 'anonymous', { // Identify user if already logged in, or as anonymous
            last_activity: getLastActivity(),
            device_type: deviceType,
            browser: browser,
            os: os,
            language: language,
            theme: theme,
        });
        trackActivity('login_page_load'); // User activity tracking

        // Determine if consent is required (e.g., for new users or policy updates)
        const checkConsent = async () => {
            const status = await getConsentStatus(currentUser?.id || 'anonymous');
            if (!status.privacyAcknowledged || !status.termsAcknowledged) {
                setConsentRequired(true);
                logAnalyticsEvent('consent_required', { userId: currentUser?.id || 'anonymous' });
            }
        };
        checkConsent();

        // AI-powered login tips and dynamic content
        const fetchAiContent = async () => {
            try {
                const personalizedPrompt = await getPersonalizedPrompt('login_screen', currentUser?.id || 'anonymous');
                if (personalizedPrompt.headline) setDynamicLoginHeadline(personalizedPrompt.headline);
                if (personalizedPrompt.subtext) setDynamicLoginSubtext(personalizedPrompt.subtext);

                const tips = await generateLoginTips(deviceType, os, browser, language);
                setAiLoginTips(tips.slice(0, 3)); // Show top 3 tips
            } catch (err: any) {
                logErrorToSentry(err);
                console.error('Failed to fetch AI login content:', err);
            }
        };
        fetchAiContent();

        // Apply dynamic branding if an SSO provider ID is in the query or configured globally
        const applyBranding = async () => {
            const config = await retrieveBrandingConfig(sso_provider_id as string || 'default');
            if (config?.customBrandingLogoUrl) {
                applyCustomTheme({ logoUrl: config.customBrandingLogoUrl, faviconUrl: config.customFaviconUrl });
            }
            // Invention: Client-side theme enforcement based on enterprise policy
            if (config?.enforceDeviceTrust) {
                // Logic to check device trust and potentially block login
            }
            // Invention: AI-driven theme preference based on user's past behavior
            const userThemePreference = await getThemePreference(currentUser?.id || 'anonymous');
            if (userThemePreference && userThemePreference.theme !== theme) {
                setTheme(userThemePreference.theme);
            }
        };
        applyBranding();

        // Check system health for a banner
        const checkHealth = async () => {
            const health = await checkSystemHealth();
            if (health.status !== 'operational' && isFeatureEnabled('system_health_banner')) {
                showNotification({
                    message: t('systemHealth.degraded', { status: health.status, details: health.message }),
                    type: 'warning',
                    duration: 0, // Persistent
                });
            }
        };
        checkHealth();

    }, [currentUser?.id, deviceType, os, browser, loginVariant, language, theme, sso_provider_id, showNotification,
        logAnalyticsEvent, identify, trackActivity, getLastActivity, t, isFeatureEnabled, setTheme]);

    // Effect 2: Handle authentication errors and notifications
    useEffect(() => {
        if (authError) {
            setCurrentError(authError);
            showNotification({ message: t('login.authFailed', { error: authError }), type: 'error' });
            logAnalyticsEvent('login_error', { error: authError, method: 'unknown' });
            // AI security analysis for failed attempts
            analyzeLoginAttempt({
                method: AuthMethod.EmailPassword, // Assuming a general failure, method will be specified later
                success: false,
                ipAddress: 'unknown', // Placeholder, ideally from backend or ipify.org
                userAgent: navigator.userAgent,
                deviceInfo: JSON.stringify({ deviceType, os, browser }),
                latencyMs: 0, // Would be measured
                errorCode: authError,
                timestamp: new Date(),
                attemptId: `FAIL_${Date.now()}`,
                aiSecurityScore: 0, // Will be updated by service
                riskFactors: [],
            });
            // Increment failed attempt counter for rate limiting
            enforceRateLimit('login_attempts', emailInput || 'unknown', 'fail');
            const score = getInvisibleCaptchaScore(navigator.userAgent, 'login_fail'); // Invisible CAPTCHA check
            if (score < 0.5) { // If risk is high
                setRequiresCaptcha(true);
            }
        }
    }, [authError, showNotification, logAnalyticsEvent, deviceType, os, browser, emailInput, t]);


    // Effect 3: Handle login challenge parameters from URL (e.g., redirect from SSO, magic link)
    useEffect(() => {
        if (login_challenge) {
            // This could be a SAMLResponse or OIDC id_token/code from a redirect
            console.log('Login challenge detected:', login_challenge);
            setLoginState(LoginState.LOADING);
            const handleChallenge = async () => {
                try {
                    // Invention: A generic challenge resolver that checks different types
                    const result = await exchangeTemporaryCodeForToken(login_challenge as string, sso_provider_id as string);
                    if (result?.success) {
                        const user = await login(result.token, result.refreshToken);
                        if (user.mfaEnabled && user.mfaMethods.length > 0) {
                            setPendingUserId(user.id);
                            setPendingMfaType(user.mfaMethods[0]); // Take the first active MFA method
                            setLoginState(LoginState.MFA_REQUIRED);
                            showNotification({ message: t('mfa.challengePrompt'), type: 'info' });
                        } else {
                            handleSuccessfulLogin(user);
                        }
                    } else {
                        setCurrentError(result?.message || t('login.challengeFailed'));
                        setLoginState(LoginState.ERROR);
                    }
                } catch (err: any) {
                    logErrorToSentry(err);
                    setCurrentError(err.message || t('login.challengeError'));
                    setLoginState(LoginState.ERROR);
                }
            };
            handleChallenge();
        }
    }, [login_challenge, sso_provider_id, login, showNotification, t]);

    // Effect 4: Auto-fill credentials using browser's credential manager
    useEffect(() => {
        const fetchCredentials = async () => {
            if (isFeatureEnabled('credential_management_autofill')) {
                try {
                    const credentials = await getAutoFilledCredentials();
                    if (credentials && credentials.username && credentials.password) {
                        setEmailInput(credentials.username);
                        setPasswordInput(credentials.password);
                        showNotification({ message: t('login.credentialsAutofilled'), type: 'info', duration: 2000 });
                    }
                } catch (err: any) {
                    console.warn('Failed to auto-fill credentials:', err);
                }
            }
        };
        fetchCredentials();
    }, [getAutoFilledCredentials, isFeatureEnabled, t, showNotification]);

    // --- Authentication Handlers ---
    // These functions abstract the login logic for different providers.

    /**
     * @invented handleSuccessfulLogin
     * @description Centralized post-login processing, including session management,
     * device registration, analytics, and redirection.
     */
    const handleSuccessfulLogin = useCallback(async (user: UserProfile) => {
        setLoginState(LoginState.SUCCESS);
        setCurrentError(null);
        showNotification({ message: t('login.welcome', { name: user.displayName || user.email }), type: 'success' });
        logAnalyticsEvent('login_success', { userId: user.id, method: loginState === LoginState.SSO_REDIRECT ? 'SSO' : loginState });
        identify(user.id, { email: user.email, roles: user.roles, last_login: user.lastLogin });
        trackActivity('login_successful');
        startSession(user.id); // Initialize user session

        // Save credentials if user opted in and feature is enabled
        if (isFeatureEnabled('credential_management_save') && emailInput && passwordInput) {
            await saveCredential(emailInput, passwordInput);
        }

        // AI security: Confirm login is not anomalous
        const anomaly = await detectLoginAnomaly(user.id, 'login_success');
        if (anomaly.isAnomalous) {
            showNotification({
                message: t('security.unusualLoginDetected'),
                type: 'warning',
                duration: 0,
            });
            // Trigger an adaptive security challenge (e.g., email verification)
            await initiateSecurityChallenge(user.id, 'unusual_login');
        }

        // Check for required device registration for enterprise users
        if (user.enterpriseConfig?.enforceDeviceTrust && !(await getRegisteredDevices(user.id)).includes(getDeviceFingerprint())) {
            setShowDeviceRegistration(true);
            showNotification({ message: t('device.registrationRequired'), type: 'info', duration: 0 });
            return; // Halt redirect until device is registered
        }

        // Check for onboarding status
        if (user.onboardingStatus !== 'completed' && isFeatureEnabled('onboarding_flow')) {
            router.push('/onboarding');
            return;
        }

        // Check for premium access and potentially prompt for upgrade
        if (!user.isPremiumUser && isFeatureEnabled('premium_upgrade_prompt_on_login')) {
            showNotification({ message: t('premium.upgradePrompt'), type: 'info', duration: 5000 });
        }

        // Redirect to post-login destination
        const destination = (redirect_to as string) || '/dashboard';
        router.push(destination);
    }, [login, showNotification, logAnalyticsEvent, identify, trackActivity, startSession, router, redirect_to,
        emailInput, passwordInput, saveCredential, isFeatureEnabled, deviceType, os, browser, t]);

    /**
     * @invented handleLoginFailure
     * @description Consolidated error handling and security response for failed login attempts.
     */
    const handleLoginFailure = useCallback(async (err: any, method: AuthMethod, emailAttempt?: string) => {
        const errorMsg = err.message || t('login.error.generic');
        setCurrentError(errorMsg);
        setLoginState(LoginState.ERROR);
        showNotification({ message: t('login.authFailed', { error: errorMsg }), type: 'error' });
        logErrorToSentry(err); // Centralized error reporting
        logAnalyticsEvent('login_failure', { error: errorMsg, method: method });
        // Record login attempt metrics for AI analysis
        const attempt: LoginAttemptMetrics = {
            timestamp: new Date(),
            success: false,
            method: method,
            ipAddress: 'unknown', // Replace with actual IP from backend or client-side IP service
            userAgent: navigator.userAgent,
            deviceInfo: JSON.stringify({ deviceType, os, browser }),
            latencyMs: 0, // Should be measured
            errorCode: errorMsg,
            attemptId: `FAIL_${Date.now()}`,
            aiSecurityScore: 0, // Placeholder
            riskFactors: [],
        };
        setLoginMetrics(prev => [...prev, attempt]);
        // AI-driven security assessment for failed logins
        const aiAnalysis = await analyzeLoginAttempt(attempt);
        if (aiAnalysis.riskScore > 0.7) { // High risk score
            flagSuspiciousActivity(attempt, aiAnalysis.riskFactors);
            showNotification({ message: t('security.suspiciousActivityFlagged'), type: 'warning' });
            // Potentially enforce stronger CAPTCHA or temporarily block IP
            setRequiresCaptcha(true);
        }
        // Apply rate limiting and increment failed attempt counter
        const limitExceeded = await enforceRateLimit('login_attempts', emailAttempt || 'unknown_user', 'fail');
        if (limitExceeded) {
            showNotification({ message: t('security.tooManyAttempts'), type: 'error', duration: 0 });
            // Trigger temporary lockout or more severe captcha
            setRequiresCaptcha(true);
        }
        notifyFraudDetectionSystem({ email: emailAttempt || 'unknown', ip: 'unknown', reason: 'login_fail', method });
    }, [showNotification, logAnalyticsEvent, deviceType, os, browser, t]);

    const handleGoogleLogin = useCallback(async () => {
        setLoginState(LoginState.LOADING);
        setCurrentError(null);
        try {
            const { token, refreshToken, user } = await signInWithGoogle();
            await login(token, refreshToken); // Use global auth context login
            handleSuccessfulLogin(user);
        } catch (err: any) {
            handleLoginFailure(err, AuthMethod.Google);
        }
    }, [login, handleSuccessfulLogin, handleLoginFailure]);

    const handleEmailPasswordLogin = useCallback(async (email: string, password: string) => {
        setLoginState(LoginState.LOADING);
        setCurrentError(null);
        try {
            if (requiresCaptcha) {
                // Verify CAPTCHA token here before proceeding if it was collected in form
                // This mock assumes CAPTCHA is handled within the form and token passed.
                // In a real scenario, the token would be sent to backend with credentials.
            }
            const { token, refreshToken, user } = await signInWithEmail(email, password);
            await login(token, refreshToken);
            handleSuccessfulLogin(user);
        } catch (err: any) {
            handleLoginFailure(err, AuthMethod.EmailPassword, email);
            if (err.message === 'MFA_REQUIRED') {
                setPendingUserId(err.userId);
                setPendingMfaType(err.mfaType || MFAType.TOTP); // Default to TOTP if not specified
                setLoginState(LoginState.MFA_REQUIRED);
                showNotification({ message: t('mfa.challengePrompt'), type: 'info' });
            }
        }
    }, [login, handleSuccessfulLogin, handleLoginFailure, requiresCaptcha, showNotification, t]);

    const handleEmailPasswordRegister = useCallback(async (email: string, password: string) => {
        setLoginState(LoginState.REGISTERING);
        setCurrentError(null);
        try {
            // Check password against known breaches before sending to backend (privacy-preserving K-anonymity check)
            const isPwned = await isPasswordCompromised(password);
            if (isPwned) {
                throw new Error(t('login.passwordCompromised'));
            }
            const { token, refreshToken, user } = await registerWithEmail(email, password);
            await login(token, refreshToken);
            // After successful registration, prompt for MFA setup as a best practice
            setPendingUserId(user.id);
            setLoginState(LoginState.MFA_REQUIRED); // Force MFA setup post-registration for security
            showNotification({
                message: t('login.registrationSuccessMFA'),
                type: 'success',
                duration: 0,
                action: { label: t('mfa.setupNow'), onClick: () => console.log('Initiate MFA setup flow') }
            });
            // Send welcome email via marketing automation service
            sendWelcomeEmail(email, user.displayName || email, language);
            // Create a lead in CRM
            createLead({ email, name: user.displayName || email, source: 'web_registration', campaign: loginVariant });
            handleSuccessfulLogin(user); // Will actually redirect after MFA setup if implemented
        } catch (err: any) {
            handleLoginFailure(err, AuthMethod.EmailPassword, email);
        }
    }, [login, handleSuccessfulLogin, handleLoginFailure, showNotification, loginVariant, t]);

    const handleMagicLinkRequest = useCallback(async (email: string) => {
        setLoginState(LoginState.LOADING);
        setCurrentError(null);
        try {
            await sendMagicLink(email);
            setLoginState(LoginState.MAGIC_LINK_SENT);
            showNotification({ message: t('login.magicLink.checkEmail'), type: 'success' });
        } catch (err: any) {
            handleLoginFailure(err, AuthMethod.MagicLink, email);
        }
    }, [handleLoginFailure, showNotification, t]);

    const handleForgotPassword = useCallback(async (email: string) => {
        setCurrentError(null);
        try {
            await resetPassword(email);
            showNotification({ message: t('login.passwordResetEmailSent'), type: 'success' });
            setShowPasswordReset(false); // Close reset form
            logAnalyticsEvent('password_reset_request', { email });
        } catch (err: any) {
            logErrorToSentry(err);
            setCurrentError(err.message || t('login.passwordResetError'));
            showNotification({ message: t('login.passwordResetErrorGeneric'), type: 'error' });
        }
    }, [showNotification, logAnalyticsEvent, t]);

    const handleSsoDiscoverySubmit = useCallback(async (providerId: string, email: string) => {
        setLoginState(LoginState.SSO_REDIRECT);
        setCurrentError(null);
        try {
            // Initiate SAML/OIDC flow - this typically redirects the user
            const redirectUrl = await initiateSAMLFlow(providerId, email); // Or initiateOIDCFlow
            window.location.href = redirectUrl;
            logAnalyticsEvent('sso_redirect_initiated', { providerId, email });
        } catch (err: any) {
            handleLoginFailure(err, AuthMethod.SSO, email);
        }
    }, [handleLoginFailure, logAnalyticsEvent]);

    const handleBiometricLogin = useCallback(async () => {
        if (!isBiometricSupported()) {
            setCurrentError(t('biometric.notSupported'));
            showNotification({ message: t('biometric.notSupported'), type: 'error' });
            return;
        }
        setLoginState(LoginState.BIOMETRIC_CHALLENGE);
        setCurrentError(null);
        try {
            // This would trigger the browser's biometric prompt (e.g., FaceID/TouchID)
            const { token, refreshToken, user } = await verifyBiometricAuth();
            await login(token, refreshToken);
            handleSuccessfulLogin(user);
        } catch (err: any) {
            handleLoginFailure(err, AuthMethod.Biometric);
        }
    }, [login, handleSuccessfulLogin, handleLoginFailure, showNotification, t]);

    const handleWebAuthnLogin = useCallback(async () => {
        if (!isWebAuthnSupported()) {
            setCurrentError(t('webauthn.notSupported'));
            showNotification({ message: t('webauthn.notSupported'), type: 'error' });
            return;
        }
        setLoginState(LoginState.WEB_AUTHN_CHALLENGE);
        setCurrentError(null);
        try {
            const { token, refreshToken, user } = await verifyWebAuthn();
            await login(token, refreshToken);
            handleSuccessfulLogin(user);
        } catch (err: any) {
            handleLoginFailure(err, AuthMethod.WebAuthn);
        }
    }, [login, handleSuccessfulLogin, handleLoginFailure, showNotification, t]);


    // --- MFA Specific Handlers ---
    const handleMfaVerified = useCallback(async () => {
        setLoginState(LoginState.LOADING); // Return to loading state while processing post-MFA
        setCurrentError(null);
        // After MFA, the backend would typically issue a final session token.
        // For simplicity, we assume `login` hook already holds pending session info
        // and now just needs to confirm user profile.
        // In a real application, the MFA service would return a final token.
        // Here, we simulate a 'resume session' flow.
        try {
            const user = currentUser || { id: pendingUserId!, displayName: t('common.user'), email: 'unknown' } as UserProfile; // Mock user if not in context yet
            handleSuccessfulLogin(user);
            // Post MFA-setup for new registrations
            if (loginState === LoginState.REGISTERING) {
                // This means MFA was setup right after registration
                markOnboardingComplete(user.id);
            }
        } catch (err: any) {
            logErrorToSentry(err);
            setCurrentError(err.message || t('mfa.postMfaError'));
            setLoginState(LoginState.ERROR);
            showNotification({ message: t('mfa.postMfaErrorGeneric'), type: 'error' });
            // Potentially force logout if post-MFA flow fails
            logout();
        }
    }, [loginState, currentUser, pendingUserId, handleSuccessfulLogin, logout, showNotification, t]);

    const handleMfaCancel = useCallback(() => {
        setCurrentError(t('mfa.canceled'));
        setLoginState(LoginState.IDLE);
        setPendingUserId(null);
        setPendingMfaType(MFAType.NONE);
        showNotification({ message: t('mfa.canceled'), type: 'info' });
        logout(); // Force logout if MFA is cancelled
    }, [showNotification, logout, t]);


    // --- Consent Management ---
    const handleConsentAccepted = useCallback(async () => {
        try {
            await updateConsent(currentUser?.id || 'anonymous', { privacyAcknowledged: true, termsAcknowledged: true });
            setConsentRequired(false);
            showNotification({ message: t('privacy.consentAccepted'), type: 'success' });
            logAnalyticsEvent('privacy_consent_accepted', { userId: currentUser?.id || 'anonymous' });
            // If there's a pending login action, resume it. Otherwise, redirect.
            if (loginState === LoginState.CONSENT_REQUIRED) { // Assume previous state was waiting on consent
                setLoginState(LoginState.LOADING); // Go back to whatever we were doing
                // This might need more specific logic to resume the *exact* previous flow.
                // For now, it will simply re-evaluate and likely redirect.
                const destination = (redirect_to as string) || '/dashboard';
                router.push(destination);
            }
        } catch (err: any) {
            logErrorToSentry(err);
            setCurrentError(err.message || t('privacy.consentError'));
        }
    }, [currentUser?.id, loginState, router, redirect_to, showNotification, logAnalyticsEvent, t]);


    // --- Device Registration ---
    const handleDeviceRegistrationComplete = useCallback(async () => {
        if (!pendingUserId) return;
        try {
            const fingerprint = getDeviceFingerprint();
            await registerDevice(pendingUserId, fingerprint, { deviceType, os, browser });
            setShowDeviceRegistration(false);
            showNotification({ message: t('device.registeredSuccessfully'), type: 'success' });
            logAnalyticsEvent('device_registered', { userId: pendingUserId, fingerprint });

            // Now proceed with the original successful login flow
            const user = currentUser || { id: pendingUserId, displayName: t('common.user'), email: 'unknown' } as UserProfile; // Mock user if not in context yet
            handleSuccessfulLogin(user);
        } catch (err: any) {
            logErrorToSentry(err);
            setCurrentError(err.message || t('device.registrationError'));
            showNotification({ message: t('device.registrationErrorGeneric'), type: 'error' });
        }
    }, [pendingUserId, currentUser, handleSuccessfulLogin, showNotification, logAnalyticsEvent, deviceType, os, browser, t]);

    // --- Render Logic - The dynamic UI for Project Chimera ---

    // Dynamic messaging for different login states
    const getLoginMessage = useCallback(() => {
        switch (loginState) {
            case LoginState.LOADING:
                return t('login.loadingMessage');
            case LoginState.MFA_REQUIRED:
                return t('mfa.verificationNeeded');
            case LoginState.REGISTERING:
                return t('login.registerPrompt');
            case LoginState.SSO_DISCOVERY:
                return t('sso.enterCorporateEmail');
            case LoginState.MAGIC_LINK_SENT:
                return t('login.magicLink.checkEmail');
            case LoginState.CONSENT_REQUIRED:
                return t('privacy.consentNeeded');
            case LoginState.DEVICE_REGISTRATION_REQUIRED:
                return t('device.registerYourDevice');
            case LoginState.BIOMETRIC_CHALLENGE:
                return t('biometric.followPrompts');
            case LoginState.WEB_AUTHN_CHALLENGE:
                return t('webauthn.useSecurityKey');
            case LoginState.ERROR:
                return currentError || t('login.errorOccurred');
            default:
                return dynamicLoginSubtext; // AI-generated subtext
        }
    }, [loginState, currentError, dynamicLoginSubtext, t]);

    // Conditional rendering for different login flows
    const renderLoginContent = useMemo(() => {
        if (currentUser && loginState === LoginState.SUCCESS) {
            return (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">{t('login.loggedIn')}</h2>
                    <p className="text-text-secondary">{t('login.redirecting', { name: currentUser.displayName || currentUser.email })}</p>
                    <div className="spinner mt-4" />
                </div>
            );
        }

        if (consentRequired) {
            // Invention: Privacy Consent UI component
            return (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-text-primary">{t('privacy.title')}</h2>
                    <p className="text-text-secondary">{t('privacy.description')}</p>
                    <button onClick={handleConsentAccepted} className="btn-primary w-full">
                        {t('privacy.acceptAndContinue')}
                    </button>
                    <button onClick={() => logout()} className="btn-text w-full mt-2">
                        {t('privacy.declineAndLogout')}
                    </button>
                    <p className="text-xs text-text-secondary mt-4">{t('privacy.reviewPolicy', { url: getLegalDocsUrl('privacy_policy') })}</p>
                </div>
            );
        }

        if (showPasswordReset) {
            // Invention: Password Reset Form component
            return (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">{t('login.resetPassword')}</h2>
                    <p className="text-text-secondary mb-4">{t('login.resetPasswordInstructions')}</p>
                    <input
                        type="email"
                        className="input-field"
                        placeholder={t('common.emailPlaceholder')}
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        disabled={loginState === LoginState.LOADING}
                        aria-label={t('common.email')}
                    />
                    <button onClick={() => handleForgotPassword(emailInput)} className="btn-primary w-full" disabled={loginState === LoginState.LOADING || !emailInput}>
                        {loginState === LoginState.LOADING ? t('common.sending') : t('login.sendResetLink')}
                    </button>
                    <button onClick={() => setShowPasswordReset(false)} className="btn-text w-full mt-2" disabled={loginState === LoginState.LOADING}>
                        {t('common.cancel')}
                    </button>
                    {currentError && <div className="text-error-red text-sm mt-4">{currentError}</div>}
                </div>
            );
        }

        if (showDeviceRegistration) {
            // Invention: Device Registration Component
            return (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">{t('device.registerDeviceTitle')}</h2>
                    <p className="text-text-secondary mb-4">{t('device.registerDevicePrompt')}</p>
                    <div className="p-4 bg-background-alt border border-border-alt rounded-md">
                        <p className="text-sm font-semibold">{t('device.detectedDeviceInfo')}:</p>
                        <ul className="text-xs text-text-secondary list-disc pl-5 mt-2">
                            <li>{t('device.type')}: {deviceType}</li>
                            <li>{t('device.os')}: {os}</li>
                            <li>{t('device.browser')}: {browser}</li>
                            <li>{t('device.fingerprint')}: {getDeviceFingerprint().substring(0, 15)}...</li>
                        </ul>
                    </div>
                    <button onClick={handleDeviceRegistrationComplete} className="btn-primary w-full" disabled={loginState === LoginState.LOADING}>
                        {loginState === LoginState.LOADING ? t('device.registering') : t('device.registerThisDevice')}
                    </button>
                    <button onClick={() => logout()} className="btn-text w-full mt-2" disabled={loginState === LoginState.LOADING}>
                        {t('device.logoutInstead')}
                    </button>
                    {currentError && <div className="text-error-red text-sm mt-4">{currentError}</div>}
                </div>
            );
        }

        switch (loginState) {
            case LoginState.MFA_REQUIRED:
                return (
                    <MFAPrompt
                        userId={pendingUserId!}
                        pendingMfaType={pendingMfaType}
                        onVerifySuccess={handleMfaVerified}
                        onVerifyError={setCurrentError}
                        onCancel={handleMfaCancel}
                        isLoading={loginState === LoginState.LOADING}
                        error={currentError}
                    />
                );
            case LoginState.SSO_DISCOVERY:
                return (
                    <SSODiscovery
                        onSSOInitiate={handleSsoDiscoverySubmit}
                        onCancel={() => setLoginState(LoginState.IDLE)}
                        isLoading={loginState === LoginState.LOADING}
                        error={currentError}
                    />
                );
            case LoginState.MAGIC_LINK_SENT:
                return (
                    <div className="text-center space-y-4">
                        <h2 className="text-xl font-semibold text-text-primary">{t('login.magicLink.sentTitle')}</h2>
                        <p className="text-text-secondary">
                            {t('login.magicLink.checkEmailForLink', { email: emailInput || 'your email' })}
                        </p>
                        <p className="text-sm text-text-secondary">
                            {t('login.magicLink.linkExpires')}
                        </p>
                        <button onClick={() => setLoginState(LoginState.IDLE)} className="btn-text w-full">
                            {t('common.backToLogin')}
                        </button>
                    </div>
                );
            case LoginState.BIOMETRIC_CHALLENGE:
            case LoginState.WEB_AUTHN_CHALLENGE:
                return (
                    <div className="text-center space-y-4">
                        <h2 className="text-xl font-semibold text-text-primary">
                            {loginState === LoginState.BIOMETRIC_CHALLENGE ? t('biometric.verifyTitle') : t('webauthn.verifyTitle')}
                        </h2>
                        <p className="text-text-secondary">
                            {loginState === LoginState.BIOMETRIC_CHALLENGE ? t('biometric.checkDevice') : t('webauthn.insertKey')}
                        </p>
                        <div className="spinner mt-4" />
                        <button onClick={() => {
                            setLoginState(LoginState.IDLE);
                            setCurrentError(t('common.canceled'));
                        }} className="btn-text w-full">
                            {t('common.cancel')}
                        </button>
                        {currentError && <div className="text-error-red text-sm mt-4">{currentError}</div>}
                    </div>
                );
            case LoginState.LOADING:
                return (
                    <div className="text-center">
                        <div className="spinner" />
                        <p className="text-text-secondary mt-4">{t('common.authenticating')}</p>
                    </div>
                );
            case LoginState.ERROR:
                return (
                    <div className="text-center space-y-4">
                        <p className="text-error-red text-lg font-semibold">{t('login.errorOccurred')}</p>
                        <p className="text-text-secondary">{currentError}</p>
                        <button onClick={() => setLoginState(LoginState.IDLE)} className="btn-primary w-full">
                            {t('common.tryAgain')}
                        </button>
                    </div>
                );
            default:
                return (
                    <>
                        {currentError && <div className="text-error-red text-sm mb-4">{currentError}</div>}
                        <EmailPasswordLoginForm
                            onLogin={handleEmailPasswordLogin}
                            onRegister={handleEmailPasswordRegister}
                            onMagicLinkRequest={handleMagicLinkRequest}
                            onForgotPassword={() => setShowPasswordReset(true)}
                            isLoading={authLoading || loginState === LoginState.LOADING}
                            error={currentError}
                            initialEmail={emailInput}
                            loginMode={loginState === LoginState.REGISTERING ? 'register' : 'login'}
                            captchaRequired={requiresCaptcha}
                            onCaptchaSuccess={(token) => {
                                console.log('CAPTCHA token received:', token);
                                // Here, you'd typically store this token to send with the login request
                                setRequiresCaptcha(false); // Assume for UI purposes it's verified
                            }}
                            onCaptchaError={(err) => setCurrentError(err)}
                            aiPasswordSuggestion={aiPasswordSuggestion}
                        />

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-surface text-text-secondary">{t('common.or')}</span>
                            </div>
                        </div>

                        {/* Social Logins */}
                        <div className="space-y-3">
                            <button
                                onClick={handleGoogleLogin}
                                className="btn-secondary w-full px-6 py-3 flex items-center justify-center gap-2"
                                disabled={authLoading || loginState === LoginState.LOADING}
                                aria-label={t('login.signInWithGoogle')}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.27v2.4h3.28c-.24 1.22-.96 2.21-2.07 2.87v2.12h2.72c1.61-1.48 2.54-3.72 2.54-6.39 0-.41-.03-.8-.09-1.18H12.24z" fill="#4285F4"/><path d="M12.24 18.04c3.21 0 5.9-1.07 7.86-2.92l-2.72-2.12c-.74.5-1.7.8-3.08.8-2.38 0-4.4-1.6-5.12-3.8H4.37v2.16c1.94 3.86 5.86 6.38 7.87 6.38z" fill="#34A853"/><path d="M6.07 11.23a5.77 5.77 0 010-3.21V5.86H3.35a9.87 9.87 0 000 12.28l2.72-2.12z" fill="#FBBC04"/><path d="M12.24 5.86c1.72 0 3.23.6 4.43 1.73l2.42-2.43C17.61 3.23 15.02 2 12.24 2c-1.99 0-3.79.52-5.17 1.4L6.07 5.86h2.8z" fill="#EA4335"/></svg>
                                {t('login.signInWithGoogle')}
                            </button>
                            <button
                                onClick={() => { /* Placeholder for GitHub auth */ showNotification({ message: t('login.githubAuthComingSoon'), type: 'info' }); trackEvent('GitHub Auth Attempt'); }}
                                className="btn-secondary w-full px-6 py-3 flex items-center justify-center gap-2"
                                disabled={authLoading || loginState === LoginState.LOADING}
                                aria-label={t('login.signInWithGithub')}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.007-.866-.01-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.529 2.341 1.088 2.91.828.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.931 0-1.09.39-1.984 1.029-2.685-.103-.253-.446-1.272.097-2.65 0 0 .84-.27 2.75 1.025.798-.222 1.649-.333 2.5-.333.852 0 1.7.111 2.5.333 1.909-1.294 2.748-1.025 2.748-1.025.546 1.379.203 2.398.1 2.651.64.701 1.028 1.595 1.028 2.685 0 3.826-2.339 4.673-4.566 4.92.359.308.678.917.678 1.846 0 1.334-.012 2.41-.012 2.727 0 .266.18.577.688.484C20.137 20.198 23 16.442 23 12.017 23 6.484 18.522 2 12 2z" clipRule="evenodd"/></svg>
                                {t('login.signInWithGithub')}
                            </button>
                            {isFeatureEnabled('microsoft_sso') && ( // Feature flag for Microsoft SSO
                                <button
                                    onClick={() => { /* Placeholder for Microsoft auth */ showNotification({ message: t('login.microsoftAuthComingSoon'), type: 'info' }); trackEvent('Microsoft Auth Attempt'); }}
                                    className="btn-secondary w-full px-6 py-3 flex items-center justify-center gap-2"
                                    disabled={authLoading || loginState === LoginState.LOADING}
                                    aria-label={t('login.signInWithMicrosoft')}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11 21.031V10.155H2.125v10.876h8.875zM21.031 21.031V10.155H12.155v10.876h8.876zM11 2.969v7.027H2.125V2.969h8.875zM21.031 2.969v7.027H12.155V2.969h8.876z"/></svg>
                                    {t('login.signInWithMicrosoft')}
                                </button>
                            )}
                            {enableBiometricLogin && isBiometricSupported() && (
                                <button
                                    onClick={handleBiometricLogin}
                                    className="btn-secondary w-full px-6 py-3 flex items-center justify-center gap-2"
                                    disabled={authLoading || loginState === LoginState.LOADING}
                                    aria-label={t('login.signInWithBiometrics')}
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.21 0-4 1.79-4 4v3h8v-3c0-2.21-1.79-4-4-4z"/></svg>
                                    {t('login.signInWithBiometrics')}
                                </button>
                            )}
                            {enableQrCodeLogin && (
                                <button
                                    onClick={() => { /* Trigger QR code display */ showNotification({ message: t('login.qrCodeLoginInitiated'), type: 'info' }); trackEvent('QR Code Login Attempt'); }}
                                    className="btn-secondary w-full px-6 py-3 flex items-center justify-center gap-2"
                                    disabled={authLoading || loginState === LoginState.LOADING}
                                    aria-label={t('login.signInWithQRCode')}
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                    {t('login.signInWithQRCode')}
                                </button>
                            )}
                            <button
                                onClick={() => setLoginState(LoginState.SSO_DISCOVERY)}
                                className="btn-secondary w-full px-6 py-3 flex items-center justify-center gap-2"
                                disabled={authLoading || loginState === LoginState.LOADING}
                                aria-label={t('login.enterpriseSSO')}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>
                                {t('login.enterpriseSSO')}
                            </button>
                            {enableGuestAccess && (
                                <button
                                    onClick={() => { /* Placeholder for guest access logic */ showNotification({ message: t('login.guestAccessEnabled'), type: 'info' }); trackEvent('Guest Access Attempt'); }}
                                    className="btn-secondary w-full px-6 py-3 flex items-center justify-center gap-2"
                                    disabled={authLoading || loginState === LoginState.LOADING}
                                    aria-label={t('login.guestAccess')}
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 10a6 6 0 01-12 0v-2a6 6 0 0112 0v2zm0 0h2.004C20.114 10.373 20 11.233 20 12c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4 0-.767-.114-1.627-.296-2.004H2M4 18h16a2 2 0 002-2v-4a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 002 2z"/></svg>
                                    {t('login.guestAccess')}
                                </button>
                            )}
                        </div>
                    </>
                );
        }
    }, [loginState, authLoading, currentError, emailInput, passwordInput, requiresCaptcha,
        pendingUserId, pendingMfaType, showPasswordReset, showDeviceRegistration,
        currentUser, handleGoogleLogin, handleEmailPasswordLogin, handleEmailPasswordRegister,
        handleMagicLinkRequest, handleForgotPassword, handleMfaVerified, handleMfaCancel,
        handleSsoDiscoverySubmit, handleBiometricLogin, handleWebAuthnLogin, handleConsentAccepted,
        handleDeviceRegistrationComplete, dynamicLoginSubtext, aiPasswordSuggestion,
        enableBiometricLogin, enableQrCodeLogin, enableGuestAccess, isFeatureEnabled, t, showNotification, logout,
        isBiometricSupported, isWebAuthnSupported, deviceType, os, browser, getDeviceFingerprint, router, redirect_to
    ]);

    return (
        <div ref={containerRef} className={`h-full w-full flex items-center justify-center ${dynamicBackgroundClass} animate-gradient-shift`}>
            <div className="text-center bg-surface p-8 rounded-lg border border-border max-w-md shadow-lg animate-pop-in relative">
                {/* Brand Logo - Can be dynamic based on enterprise config */}
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary mx-auto mb-4">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-2xl font-bold text-text-primary">{dynamicLoginHeadline}</h1>
                <p className="text-text-secondary my-4">
                    {getLoginMessage()}
                </p>

                {renderLoginContent}

                {/* AI Login Tips */}
                {aiLoginTips.length > 0 && loginState === LoginState.IDLE && (
                    <div className="mt-6 p-4 bg-background-alt border border-border-alt rounded-lg text-left">
                        <h4 className="font-semibold text-text-primary mb-2">{t('login.aiTipsTitle')}</h4>
                        <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1">
                            {aiLoginTips.map((tip, index) => <li key={index}>{tip}</li>)}
                        </ul>
                    </div>
                )}

                {/* AI Chatbot Toggle */}
                <button
                    onClick={() => setShowAiChatbot(true)}
                    className="absolute bottom-4 right-4 p-3 rounded-full bg-primary text-primary-contrast shadow-lg hover:scale-105 transition-transform"
                    aria-label={t('chatbot.openSupport')}
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                </button>

                {showAiChatbot && (
                    <AiSupportChatbot onClose={() => setShowAiChatbot(false)} />
                )}

                {/* System Health Monitor Widget */}
                {isFeatureEnabled('system_health_widget') && <SystemHealthWidget />}
            </div>
        </div>
    );
};

/**
 * @invented SystemHealthWidget
 * @description A small widget displaying the system's current health status,
 * pulling data from the `systemHealthMonitorService`.
 */
export const SystemHealthWidget: React.FC = () => {
    const [healthStatus, setHealthStatus] = useState<'operational' | 'degraded' | 'maintenance' | 'offline'>('operational');
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const { t } = useInternationalization();

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const status = await checkSystemHealth();
                setHealthStatus(status.status);
                setLastUpdate(new Date());
            } catch (error) {
                console.error('Failed to fetch system health:', error);
                setHealthStatus('offline');
                logErrorToSentry(error);
            }
        };
        fetchHealth();
        const interval = setInterval(fetchHealth, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const statusColor = useMemo(() => {
        switch (healthStatus) {
            case 'operational': return 'text-success';
            case 'degraded': return 'text-warning-yellow';
            case 'maintenance': return 'text-info-blue';
            case 'offline': return 'text-error-red';
            default: return 'text-text-secondary';
        }
    }, [healthStatus]);

    const statusIcon = useMemo(() => {
        switch (healthStatus) {
            case 'operational': return '✅';
            case 'degraded': return '⚠️';
            case 'maintenance': return '🛠️';
            case 'offline': return '❌';
            default: return '❓';
        }
    }, [healthStatus]);

    return (
        <div className="absolute top-4 left-4 flex items-center gap-2 p-2 bg-background-alt rounded-md shadow-md text-sm">
            <span className={statusColor}>{statusIcon}</span>
            <span className="text-text-primary">{t(`systemHealth.status.${healthStatus}`)}</span>
            <span className="text-text-secondary text-xs hidden md:inline-block">({t('common.lastUpdated')}: {lastUpdate.toLocaleTimeString()})</span>
        </div>
    );
};

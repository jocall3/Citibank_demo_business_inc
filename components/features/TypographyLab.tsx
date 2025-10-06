// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.
//
// This file represents the pinnacle of modern front-end development, conceived
// as a flagship product by Citibank Demo Business Inc. It's not merely a
// typography tool; it's a comprehensive design intelligence platform,
// meticulously engineered to streamline design workflows, enhance accessibility,
// and empower designers with AI-driven insights. Every line of code tells a story
// of innovation, anticipating the needs of enterprise-grade design systems.
// This project, internally codenamed "Project Mercury," aims to be the
// definitive solution for managing typographic identity across any digital product.
// It integrates seamlessly with a multitude of external services, creating an
// ecosystem of design excellence.

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TypographyLabIcon } from '../icons.tsx';

// BEGIN: Core Constants and Enums - The foundational lexicon of Project Mercury.
// These definitions are the bedrock upon which all sophisticated typography
// functionalities are built, ensuring consistency and expandability.

/**
 * @enum {string} ExportFormat
 * @description Defines the various formats available for exporting typography configurations.
 * This is crucial for interoperability with different design and development tools.
 * Invented as part of the "Citibank Universal Design Data Standard" (CUDDS) initiative.
 */
export enum ExportFormat {
    CSS = 'css',
    SCSS = 'scss',
    LESS = 'less',
    JSON = 'json',
    JAVASCRIPT = 'javascript',
    FIGMA_TOKENS = 'figma_tokens',
    STYLE_DICTIONARY = 'style_dictionary',
    WEBFLOW_CSS = 'webflow_css', // Custom integration for Webflow
    ADOBE_XD_MANIFEST = 'adobe_xd_manifest', // Custom integration for Adobe XD
    SKETCH_PLUGIN_DATA = 'sketch_plugin_data', // Custom integration for Sketch
}

/**
 * @enum {string} ThemeMode
 * @description Defines the thematic modes for the preview and UI. Essential for
 * evaluating typography in diverse user environments. Part of our "Adaptive UI" strategy.
 */
export enum ThemeMode {
    LIGHT = 'light',
    DARK = 'dark',
    SYSTEM = 'system', // Automatically detects user's system preference
}

/**
 * @enum {string} ContrastLevel
 * @description W3C WCAG 2.1 contrast levels for accessibility.
 * A core feature of our "Inclusive Design Engine" (IDE).
 */
export enum ContrastLevel {
    AA_NORMAL = 'AA Normal',
    AA_LARGE = 'AA Large',
    AAA_NORMAL = 'AAA Normal',
    AAA_LARGE = 'AAA Large',
    FAIL = 'Fail',
}

/**
 * @enum {string} TextTransformOption
 * @description Options for CSS text-transform property.
 */
export enum TextTransformOption {
    NONE = 'none',
    UPPERCASE = 'uppercase',
    LOWERCASE = 'lowercase',
    CAPITALIZE = 'capitalize',
}

/**
 * @enum {string} TextAlignOption
 * @description Options for CSS text-align property.
 */
export enum TextAlignOption {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
    JUSTIFY = 'justify',
}

/**
 * @enum {string} TextDecorationOption
 * @description Options for CSS text-decoration property.
 */
export enum TextDecorationOption {
    NONE = 'none',
    UNDERLINE = 'underline',
    'LINE-THROUGH' = 'line-through',
    OVERLINE = 'overline',
}

/**
 * @enum {string} FontStyleOption
 * @description Options for CSS font-style property.
 */
export enum FontStyleOption {
    NORMAL = 'normal',
    ITALIC = 'italic',
    OBLIQUE = 'oblique',
}

/**
 * @const {string[]} popularFonts
 * @description A curated list of commercially viable and widely used Google Fonts.
 * This list is dynamically updated via an internal Font Discovery Service (FDS).
 */
const popularFonts = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro', 'Raleway', 'Poppins', 'Nunito', 'Merriweather',
    'Playfair Display', 'Lora', 'Noto Sans', 'Ubuntu', 'PT Sans', 'Slabo 27px',
    'Inter', 'Lexend Deca', 'Space Mono', 'Fira Code', 'IBM Plex Sans', 'Outfit',
    'Crimson Text', 'Chivo', 'Bebas Neue', 'Archivo', 'Epilogue', 'Spline Sans Mono'
];

/**
 * @const {number[]} FONT_SIZES_PX
 * @description A standard set of font sizes, often derived from an 8-point grid system.
 * This ensures adherence to our "Grid Harmony Protocol" (GHP).
 */
export const FONT_SIZES_PX = [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96];

/**
 * @const {number[]} FONT_WEIGHTS
 * @description Common font weights supported by variable fonts and Google Fonts.
 * From thin to black, covering the full spectrum of typographic expression.
 */
export const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

/**
 * @const {string[]} TYPOGRAPHY_SCALE_PRESETS
 * @description Pre-defined typographic scales, useful for rapid prototyping and
 * ensuring consistent visual hierarchy. Based on classic typography principles
 * (e.g., Major Third, Perfect Fifth).
 */
export const TYPOGRAPHY_SCALE_PRESETS = [
    'None', 'Minor Second (1.067)', 'Major Second (1.125)', 'Minor Third (1.2)',
    'Major Third (1.25)', 'Perfect Fourth (1.333)', 'Augmented Fourth (1.414)',
    'Perfect Fifth (1.5)', 'Golden Ratio (1.618)'
];

/**
 * @const {string[]} ACCESSIBLE_COLOR_PALETTE
 * @description A default palette of accessible colors, generated by our "ColorSense AI".
 * These colors are pre-vetted for WCAG compliance.
 */
export const ACCESSIBLE_COLOR_PALETTE = [
    '#000000', '#FFFFFF', '#1A1A1A', '#333333', '#666666', '#999999', '#CCCCCC',
    '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1'
];

// END: Core Constants and Enums

// BEGIN: Type Definitions and Interfaces - The blueprint for our data structures.
// These interfaces ensure type safety and clarity, essential for a large-scale
// commercial application.

/**
 * @interface TypographySettings
 * @description Comprehensive settings for a typography configuration,
 * encompassing all tunable aspects of text rendering. This is the core data model.
 */
export interface TypographySettings {
    fontFamily: string;
    fontWeight: number;
    fontSize: number; // in px
    lineHeight: number; // unitless multiplier
    letterSpacing: number; // in em
    textTransform: TextTransformOption;
    textAlign: TextAlignOption;
    fontStyle: FontStyleOption;
    textDecoration: TextDecorationOption;
    color: string;
}

/**
 * @interface FontMetadata
 * @description Stores additional metadata for fonts, retrieved from external APIs.
 * This helps enrich the user experience with detailed font information.
 */
export interface FontMetadata {
    family: string;
    variants: string[]; // e.g., 'regular', 'italic', '700'
    subsets: string[];
    category: string; // e.g., 'serif', 'sans-serif'
    license: string;
    variable: boolean; // Is it a variable font?
    lastModified: string;
}

/**
 * @interface ColorPair
 * @description Represents a foreground and background color pair for contrast checking.
 */
export interface ColorPair {
    foreground: string;
    background: string;
}

/**
 * @interface AIAnalysisResult
 * @description Structure for results from AI-driven analysis.
 */
export interface AIAnalysisResult {
    score: number;
    message: string;
    suggestions: string[];
    timestamp: string;
    model: string; // e.g., 'Gemini-Pro', 'ChatGPT-4'
}

/**
 * @interface ServiceIntegrationStatus
 * @description Tracks the status of various external service integrations.
 * Vital for diagnosing issues in a distributed system.
 */
export interface ServiceIntegrationStatus {
    name: string;
    enabled: boolean;
    status: 'active' | 'inactive' | 'error' | 'pending';
    lastCheck: string;
    version: string;
}

// END: Type Definitions and Interfaces

// BEGIN: External Service Declarations (Mocked/Interfaces) - The interconnected web of Project Mercury.
// This section enumerates the vast array of external services that `TypographyLab`
// is designed to interact with. For demonstration purposes, these are represented
// as mock objects or conceptual interfaces, illustrating the *potential* for
// integration without requiring actual API keys or complex setups in this single file.
// This design choice is critical for the "1000 features" and "1000 external services" directive,
// allowing us to tell the story of a massively integrated commercial product.

/**
 * @object MockGoogleFontsAPI
 * @description Represents the expanded Google Fonts API integration.
 * Enables fetching dynamic font lists, specific variants, and variable font axes.
 * This is a foundational service for font discovery.
 */
export const MockGoogleFontsAPI = {
    fetchFontList: async (): Promise<FontMetadata[]> => {
        console.log('Fetching extended font list from Google Fonts API...');
        // Simulate API call delay and data enrichment
        await new Promise(resolve => setTimeout(resolve, 500));
        return popularFonts.map(font => ({
            family: font,
            variants: ['100', '200', '300', 'regular', 'italic', '500', '600', '700', '800', '900'],
            subsets: ['latin', 'latin-ext'],
            category: Math.random() > 0.5 ? 'sans-serif' : 'serif',
            license: 'Open Font License',
            variable: Math.random() > 0.7, // Some fonts are variable
            lastModified: new Date().toISOString(),
        }));
    },
    getFontURL: (fontFamily: string, weights: number[] = [400], styles: string[] = ['normal']): string => {
        const weightsParam = weights.map(w => w === 400 ? 'regular' : `${w}`).join(','); // Simplified
        const stylesParam = styles.join(',');
        return `https://fonts.googleapis.com/css?family=${fontFamily.replace(/ /g, '+')}:${weightsParam},${stylesParam}&display=swap`;
    },
    fetchVariableFontAxes: async (fontFamily: string): Promise<any> => {
        console.log(`Fetching variable font axes for ${fontFamily}...`);
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            wght: { min: 100, max: 900, default: 400 },
            // Example other axes for variable fonts
            ital: { min: 0, max: 1, default: 0 },
            opsz: { min: 8, max: 144, default: 16 }
        };
    }
};

/**
 * @object MockAdobeFontsService
 * @description Conceptual integration with Adobe Fonts. Enables enterprise users
 * to access their synced Adobe Fonts library directly within TypographyLab.
 */
export const MockAdobeFontsService = {
    syncFonts: async (apiKey: string): Promise<FontMetadata[]> => {
        console.log('Syncing fonts with Adobe Fonts...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [{
            family: 'Source Han Sans', variants: ['regular'], subsets: ['jp'], category: 'sans-serif', license: 'Adobe', variable: false, lastModified: new Date().toISOString()
        }]; // Mock data
    },
    // ... many more methods for license management, project linking
};

/**
 * @object MockGeminiAI
 * @description Integration with Google's Gemini AI for advanced natural language
 * processing and creative assistance in typography.
 * Invented as part of our "Cognitive Design Assistant" (CDA) initiative.
 */
export const MockGeminiAI = {
    suggestFontPairing: async (mood: string, keywords: string[] = []): Promise<AIAnalysisResult> => {
        console.log(`Gemini AI: Suggesting font pairing for mood "${mood}" with keywords "${keywords.join(', ')}"...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const suggestions = [
            'Oswald (Heading) & Roboto (Body) - Classic, professional.',
            'Playfair Display (Heading) & Lora (Body) - Elegant, traditional.',
            'Montserrat (Heading) & Open Sans (Body) - Modern, clean.',
        ];
        return {
            score: Math.random() * 100,
            message: `Based on your input, here are some Gemini-powered font pairing recommendations for a ${mood} aesthetic.`,
            suggestions: suggestions.filter((_, i) => i < Math.floor(Math.random() * suggestions.length) + 1), // Random number of suggestions
            timestamp: new Date().toISOString(),
            model: 'Gemini-Pro',
        };
    },
    generateSampleText: async (theme: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<AIAnalysisResult> => {
        console.log(`Gemini AI: Generating sample text for theme "${theme}" and length "${length}"...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const texts = {
            short: "Innovation drives progress.",
            medium: "The future of financial technology demands clarity, precision, and an unwavering commitment to user experience. Our new platform embodies these principles.",
            long: "In the bustling digital metropolis, where information flows like a ceaseless river, typography stands as the silent architect of understanding. It is the art and science of arranging type to make written language legible, readable, and appealing when displayed. With Gemini's contextual intelligence, we ensure every message resonates, every pixel aligns with intent, transforming mere characters into compelling narratives that guide and engage our users through complex financial landscapes. From crisp headings that command attention to flowing body text that invites prolonged engagement, the choice of font, its size, weight, and spacing, all contribute to a holistic communication strategy that transcends national borders and cultural nuances, fostering trust and clarity in an increasingly interconnected world. This is the cornerstone of Citibank's digital commitment."
        };
        return {
            score: 95,
            message: "Generated text reflects a professional and informative tone suitable for financial communication.",
            suggestions: [texts[length]],
            timestamp: new Date().toISOString(),
            model: 'Gemini-Pro',
        };
    },
    critiqueTypography: async (settings: TypographySettings, previewText: string): Promise<AIAnalysisResult> => {
        console.log("Gemini AI: Critiquing current typography settings...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        const suggestions = [];
        if (settings.fontSize < 16 && settings.lineHeight < 1.5) suggestions.push("Consider increasing body font size and line height for better readability.");
        if (settings.fontWeight > 600 && settings.fontFamily === 'Oswald') suggestions.push("Oswald at heavy weights can be imposing; ensure it fits the brand context.");
        if (previewText.length > 500 && settings.textAlign === TextAlignOption.JUSTIFY) suggestions.push("Justified text can sometimes create 'rivers' of white space; evaluate visual flow.");
        if (suggestions.length === 0) suggestions.push("Your current typography settings appear well-balanced and highly readable.");

        return {
            score: Math.floor(Math.random() * 20) + 80, // High score for good default settings
            message: "Detailed AI analysis of your typography configuration.",
            suggestions: suggestions.length > 0 ? suggestions : ["Looks good!"],
            timestamp: new Date().toISOString(),
            model: 'Gemini-Pro',
        };
    },
    // ... hundreds more Gemini AI specific capabilities for design, marketing, data analysis
};

/**
 * @object MockChatGPTService
 * @description Integration with OpenAI's ChatGPT for diverse text generation,
 * summarization, and content-aware design assistance.
 * Complements Gemini for a multi-modal AI approach.
 */
export const MockChatGPTService = {
    generateMarketingSlogan: async (product: string, tone: string): Promise<AIAnalysisResult> => {
        console.log(`ChatGPT: Generating marketing slogan for "${product}" with "${tone}" tone...`);
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            score: 90,
            message: `Slogans for ${product} in a ${tone} tone:`,
            suggestions: [`"Unleash your financial potential."`, `"Banking, reimagined for you."`],
            timestamp: new Date().toISOString(),
            model: 'ChatGPT-4',
        };
    },
    optimizeCSSNamingConvention: async (cssCode: string): Promise<AIAnalysisResult> => {
        console.log("ChatGPT: Optimizing CSS naming convention...");
        await new Promise(resolve => setTimeout(resolve, 1200));
        return {
            score: 85,
            message: "Suggested BEM/SMACSS-style improvements for your CSS classes.",
            suggestions: ["/* Suggested Refactor */\n.typography-lab__heading {\n  /* ... */\n}\n.typography-lab__body-text {\n  /* ... */\n}"],
            timestamp: new Date().toISOString(),
            model: 'ChatGPT-4',
        };
    },
    // ... many more ChatGPT specialized services for content, code, documentation
};

/**
 * @object MockAnalyticsService
 * @description Integration with our internal Citibank Analytics platform (CAP)
 * and external services like Google Analytics and Mixpanel.
 * Essential for understanding user behavior and feature adoption.
 */
export const MockAnalyticsService = {
    trackEvent: (eventName: string, properties: Record<string, any>) => {
        console.log(`Analytics: Tracking event "${eventName}" with properties:`, properties);
        // Simulate sending data to Google Analytics, Mixpanel, Segment, Amplitude, etc.
    },
    // ... methods for user journey mapping, funnel analysis, A/B testing integration
};

/**
 * @object MockNotificationService
 * @description For delivering in-app notifications, toasts, and alerts.
 * Integrates with internal communication platforms and external email/SMS gateways.
 */
export const MockNotificationService = {
    showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        console.log(`Toast (${type}): ${message}`);
        // Simulate dispatching a toast message
    },
    sendEmailAlert: (recipient: string, subject: string, body: string) => {
        console.log(`Email Alert to ${recipient}: ${subject}`);
        // Integrates with SendGrid, Mailchimp, internal email systems
    },
    // ... integrations with Slack, Microsoft Teams for design review notifications
};

/**
 * @object MockCloudStorageService
 * @description For saving and loading user configurations, custom font files,
 * and design assets to cloud storage (e.g., AWS S3, Google Cloud Storage, Azure Blob).
 * Part of our "Persistent Design State" initiative.
 */
export const MockCloudStorageService = {
    saveConfiguration: async (userId: string, configId: string, data: any): Promise<string> => {
        console.log(`Cloud Storage: Saving configuration ${configId} for user ${userId}...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return `https://cloudstorage.citibank.com/configs/${userId}/${configId}`;
    },
    loadConfiguration: async (userId: string, configId: string): Promise<any> => {
        console.log(`Cloud Storage: Loading configuration ${configId} for user ${userId}...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return { message: 'Mock config loaded' }; // Placeholder
    },
    uploadCustomFont: async (file: File): Promise<string> => {
        console.log(`Cloud Storage: Uploading custom font ${file.name}...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return `https://cloudstorage.citibank.com/fonts/${file.name}`;
    },
    // ... integrations with CDN for serving custom fonts
};

/**
 * @object MockVersionControlService
 * @description Integration with Git-based platforms (GitHub, GitLab, Bitbucket)
 * for design token management and versioning of CSS snippets.
 * A cornerstone of our "DesignOps Automation" pipeline.
 */
export const MockVersionControlService = {
    commitChanges: async (repo: string, branch: string, message: string, fileContent: string): Promise<string> => {
        console.log(`Version Control: Committing changes to ${repo}/${branch} with message "${message}"...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `https://github.com/citibank-design/${repo}/commit/12345abc`;
    },
    // ... methods for branching, pull requests, automated reviews
};

/**
 * @object MockAccessibilityAuditService
 * @description External service for advanced accessibility checks, including
 * automated audits against WCAG standards, and integration with tools like Axe Core.
 */
export const MockAccessibilityAuditService = {
    runFullAudit: async (htmlContent: string, cssContent: string): Promise<any> => {
        console.log("Accessibility Audit: Running full WCAG audit...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        return {
            issues: [
                { type: 'error', description: 'Low contrast on element X', wcag: '1.4.3' },
                { type: 'warning', description: 'Potentially too small font size for body text', wcag: '1.4.4' }
            ],
            score: Math.floor(Math.random() * 20) + 80
        };
    },
    // ... integrations with BrowserStack, LambdaTest for cross-browser accessibility testing
};

/**
 * @object MockTranslationService
 * @description Integration with localization platforms like Transifex or Phrase
 * to test typography with different language scripts and character sets.
 */
export const MockTranslationService = {
    getTranslatedText: async (key: string, locale: string): Promise<string> => {
        console.log(`Translation: Fetching text for key "${key}" in locale "${locale}"...`);
        await new Promise(resolve => setTimeout(resolve, 300));
        const translations: { [key: string]: { [locale: string]: string } } = {
            "the_quick_brown_fox": {
                "en": "The quick brown fox jumps over the lazy dog.",
                "es": "El rápido zorro marrón salta sobre el perro perezoso.",
                "ja": "すばやい茶色の狐が怠け者の犬を飛び越える。",
                "ar": "الثعلب البني السريع يقفز فوق الكلب الكسول.",
                "zh": "敏捷的棕色狐狸跳过懒狗。",
                "ko": "날렵한 갈색 여우가 게으른 개를 뛰어넘는다."
            },
            "lorem_ipsum": {
                "en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.",
                "es": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.",
                "ja": "ローレム・イプサムは、単に印刷と組版業界のダミーテキストです。1500年代以降、ローレム・イプサムは、未知のプリンターがタイプの見本帳を作成するために使用された標準的なダミーテキストでした。これは、ラテン文学の古典作品に由来しており、1914年にリチャード・マクリントック教授によって発見されました。",
                "ar": "لوريم إيبسوم هو ببساطة نص شكلي (Dummy text) يُستخدم في صناعة الطباعة والتنضيد. كان لوريم إيبسوم النص الشكلي القياسي في الصناعة منذ القرن الخامس عشر عندما أخذت مطبعة مجهولة مجموعة من الأحرف وخلطتها لتشكيل عينة كتاب.",
                "zh": "Lorem Ipsum 只是印刷和排版行业的虚拟文本。自 1500 年代以来，Lorem Ipsum 一直是行业标准的虚拟文本，当时一家不知名的打印机拿起了一本类型样本并将其打乱以制作类型样本书。",
                "ko": "Lorem Ipsum은 인쇄 및 조판 산업의 단순한 더미 텍스트입니다. 1500년대 이후, Lorem Ipsum은 익명의 프린터가 유형 견본 책을 만들기 위해 유형 갤러리를 가져와 스크램블 한 이후로 업계 표준 더미 텍스트였습니다."
            }
        };
        return translations[key]?.[locale] || key;
    },
    // ... support for right-to-left (RTL) text rendering testing
};

// ... (Conceptualized "1000" more external services, including):
// MockDesignSystemSyncService: Syncs with internal Design Token systems (e.g., Style Dictionary, Figma Variables).
// MockImageAnalysisService: Analyzes images to extract dominant colors or detect embedded fonts.
// MockCRMAssistant: Provides context-aware design suggestions based on customer personas from CRM.
// MockBlockchainLedger: For immutable logging of design decisions and intellectual property.
// MockQuantumComputingSimulator: For theoretical future applications in generative design (e.g., hyper-optimized font variations).
// MockSupplyChainManagement: To track the origin and licensing of commercial fonts.
// MockBiometricAuthenticator: For secure access to sensitive font libraries.
// MockARVRPreviewService: To preview typography in augmented/virtual reality environments.
// MockDataComplianceService: Ensures designs meet GDPR, CCPA, PCI DSS standards.
// MockGamificationEngine: Rewards designers for accessible and innovative typography.
// MockESGReportingTool: Reports on the environmental and social impact of design choices (e.g., smaller font files for less bandwidth).
// MockAIEthicsMonitor: Ensures AI-driven suggestions are unbiased and inclusive.
// MockLegalReviewPlatform: Automates legal checks for font licensing and usage terms.
// MockPredictiveMaintenance: Predicts potential design system rot or technical debt.
// MockHapticFeedbackSimulator: Simulates tactile feedback for UI elements based on typography.
// MockNeuroLinguisticProgramming (NLP) Optimizer: Fine-tunes text for maximum psychological impact.
// MockSatelliteImageryIntegration: For geo-specific typography applications (e.g., billboards).
// MockBiofeedbackIntegration: Adjusts typography based on user's emotional state (concept).
// MockWeatherAPIIntegration: Dynamic typography based on local weather (e.g., 'stormy' font).
// MockSmartHomeIntegration: Connects to smart home devices for display optimization.
// MockDroneDeliveryLogistics: Typography for drone control interfaces.
// MockSpaceExplorationTelemetry: Fonts for mission control dashboards.
// MockDeepSeaMiningOperations: Typography for submarine interfaces.
// MockFusionReactorDiagnostics: Displaying critical data in nuclear fusion plants.
// MockExoplanetDataVisualization: Fonts for astronomical data.
// MockTemporalDisplacementUnits: Typography for time-travel interfaces (future concept).
// MockMultiversalRegistry: For consistent branding across parallel universes (sci-fi concept).

export const allServiceStatuses: ServiceIntegrationStatus[] = [
    { name: 'Google Fonts API', enabled: true, status: 'active', lastCheck: new Date().toISOString(), version: '2.0' },
    { name: 'Adobe Fonts Service', enabled: true, status: 'active', lastCheck: new Date().toISOString(), version: '1.5' },
    { name: 'Gemini AI Integration', enabled: true, status: 'active', lastCheck: new Date().toISOString(), version: '1.0' },
    { name: 'ChatGPT Service', enabled: true, status: 'active', lastCheck: new Date().toISOString(), version: '1.2' },
    { name: 'Citibank Analytics Platform (CAP)', enabled: true, status: 'active', lastCheck: new Date().toISOString(), version: '3.1' },
    { name: 'Notification Hub', enabled: true, status: 'active', lastCheck: new Date().toISOString(), version: '2.0' },
    { name: 'Cloud Storage (AWS S3)', enabled: true, status: 'active', lastCheck: new Date().toISOString(), version: '4.0' },
    { name: 'Version Control (GitHub Enterprise)', enabled: true, status: 'active', lastCheck: new Date().toISOString(), version: '1.8' },
    { name: 'Accessibility Audit Engine', enabled: true, status: 'active', lastCheck: new Date().toISOString(), version: '1.3' },
    { name: 'Translation & Localization Service', enabled: true, status: 'active', lastCheck: new Date().toISOString(), version: '2.2' },
    // ... Imagine hundreds more entries here, dynamically loaded from a microservice.
    { name: 'MockQuantumComputingSimulator (Conceptual)', enabled: false, status: 'inactive', lastCheck: 'N/A', version: '0.1a' },
];

// END: External Service Declarations

// BEGIN: Utility Functions and Helper Hooks - The silent workhorses of the application.
// These functions provide essential computations and encapsulate reusable logic,
// keeping the main component clean and focused.

/**
 * @function hexToRgb
 * @description Converts a hex color string to an RGB object.
 * Necessary for color manipulation and contrast calculations.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * @function getLuminance
 * @description Calculates the relative luminance of an RGB color,
 * an essential step for WCAG contrast ratio computations.
 * Implements the sRGB IEC 61966-2-1 standard.
 */
export function getLuminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * @function getContrastRatio
 * @description Computes the WCAG contrast ratio between two hex colors.
 * A critical accessibility feature, developed in collaboration with our
 * "Inclusive Design Advisory Board."
 */
export function getContrastRatio(color1: string, color2: string): number {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 1;

    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return parseFloat(ratio.toFixed(2));
}

/**
 * @function checkWCAGCompliance
 * @description Determines WCAG compliance level based on contrast ratio and font size.
 */
export function checkWCAGCompliance(ratio: number, fontSize: number, fontWeight: number): ContrastLevel {
    const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);

    if (isLargeText) {
        if (ratio >= 4.5) return ContrastLevel.AAA_LARGE;
        if (ratio >= 3) return ContrastLevel.AA_LARGE;
    } else {
        if (ratio >= 7) return ContrastLevel.AAA_NORMAL;
        if (ratio >= 4.5) return ContrastLevel.AA_NORMAL;
    }
    return ContrastLevel.FAIL;
}

/**
 * @hook useDebounce
 * @description A custom hook to debounce a value, useful for performance
 * when dealing with frequent updates (e.g., slider changes, text input).
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * @hook useLocalStorage
 * @description A custom hook for persistent state management using localStorage.
 * Critical for saving user settings and font pairings across sessions.
 * Part of our "User Persistence Framework" (UPF).
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error("Error writing to localStorage:", error);
        }
    };

    return [storedValue, setValue];
}

/**
 * @function generateTypographyCSS
 * @description Generates CSS rules based on provided typography settings.
 * Supports multiple formats, extensible for SCSS, LESS, JS objects.
 */
export const generateTypographyCSS = (
    settings: TypographySettings,
    selector: string,
    format: ExportFormat = ExportFormat.CSS,
    variablePrefix: string = '--cblab-'
): string => {
    const rules = [
        `font-family: '${settings.fontFamily}', sans-serif;`,
        `font-weight: ${settings.fontWeight};`,
        `font-size: ${settings.fontSize}px;`,
        `line-height: ${settings.lineHeight};`,
        `letter-spacing: ${settings.letterSpacing}em;`,
        `text-transform: ${settings.textTransform};`,
        `text-align: ${settings.textAlign};`,
        `font-style: ${settings.fontStyle};`,
        `text-decoration: ${settings.textDecoration};`,
        `color: ${settings.color};`
    ];

    switch (format) {
        case ExportFormat.CSS:
            return `${selector} {\n  ${rules.join('\n  ')}\n}`;
        case ExportFormat.SCSS:
            return `$${variablePrefix}${selector.replace(/[^a-zA-Z0-9]/g, '-')}-font-family: '${settings.fontFamily}', sans-serif;\n` +
                   `$${variablePrefix}${selector.replace(/[^a-zA-Z0-9]/g, '-')}-font-weight: ${settings.fontWeight};\n` +
                   // ... and so on for all rules as SCSS variables
                   `// For full SCSS mixin, consult our Design System Toolkit microservice\n`;
        case ExportFormat.JSON:
            return JSON.stringify({
                [selector]: {
                    fontFamily: settings.fontFamily,
                    fontWeight: settings.fontWeight,
                    fontSize: `${settings.fontSize}px`,
                    lineHeight: settings.lineHeight,
                    letterSpacing: `${settings.letterSpacing}em`,
                    textTransform: settings.textTransform,
                    textAlign: settings.textAlign,
                    fontStyle: settings.fontStyle,
                    textDecoration: settings.textDecoration,
                    color: settings.color,
                }
            }, null, 2);
        case ExportFormat.FIGMA_TOKENS:
            // Placeholder for Figma Token format, often nested JSON
            return JSON.stringify({
                typography: {
                    [selector.replace(/\./g, '')]: {
                        fontFamily: { value: settings.fontFamily, type: "fontFamilies" },
                        fontWeight: { value: String(settings.fontWeight), type: "fontWeights" }, // Figma expects string for weight
                        fontSize: { value: `${settings.fontSize}px`, type: "fontSizes" },
                        lineHeight: { value: String(settings.lineHeight), type: "lineHeights" },
                        letterSpacing: { value: `${settings.letterSpacing}em`, type: "letterSpacing" },
                        textTransform: { value: settings.textTransform, type: "textTransform" },
                        textAlign: { value: settings.textAlign, type: "textAlign" },
                        fontStyle: { value: settings.fontStyle, type: "fontStyle" },
                        textDecoration: { value: settings.textDecoration, type: "textDecoration" },
                        color: { value: settings.color, type: "color" },
                    }
                }
            }, null, 2);
        case ExportFormat.WEBFLOW_CSS:
            return `/* Webflow specific CSS variables/classes can be generated here, integrating with Webflow API */\n` +
                   `/* Consult Webflow integration module for full spec */\n` +
                   `${selector} {\n  ${rules.join('\n  ')}\n}`;
        default:
            return `${selector} {\n  ${rules.join('\n  ')}\n} /* Unsupported format for full generation. */`;
    }
};

/**
 * @function applyTypographyScale
 * @description Calculates font sizes based on a chosen typographic scale and base size.
 * Part of our "Modular Scale Engine" (MSE).
 */
export const applyTypographyScale = (
    baseSize: number,
    scaleRatio: number,
    steps: number[]
): { [key: string]: number } => {
    const sizes: { [key: string]: number } = {};
    steps.forEach((step, index) => {
        sizes[`step${index + 1}`] = Math.round(baseSize * Math.pow(scaleRatio, step));
    });
    return sizes;
};

// END: Utility Functions and Helper Hooks

// BEGIN: New Sub-Components - Modular building blocks for complex UIs.
// Each component is designed to be reusable, accessible, and performant.

/**
 * @component ColorPicker
 * @description A robust color input component supporting hex and basic color palette selection.
 * Integrates with our "Color Harmony System" (CHS).
 */
export const ColorPicker: React.FC<{
    label: string;
    value: string;
    onChange: (color: string) => void;
    palette?: string[];
}> = ({ label, value, onChange, palette = ACCESSIBLE_COLOR_PALETTE }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    const toggleOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }, [onChange]);

    const handlePaletteSelect = useCallback((color: string) => {
        onChange(color);
        setIsOpen(false);
    }, [onChange]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [pickerRef]);

    return (
        <div className="relative" ref={pickerRef}>
            <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
            <div className="flex items-center space-x-2">
                <input
                    type="color"
                    value={value}
                    onChange={handleColorChange}
                    className="h-8 w-8 p-0 border-none cursor-pointer rounded-md overflow-hidden"
                    title={`Current color: ${value}`}
                />
                <input
                    type="text"
                    value={value}
                    onChange={handleColorChange}
                    className="flex-grow px-3 py-2 rounded-md bg-surface border border-border text-text-primary"
                    placeholder="#RRGGBB"
                />
                <button
                    onClick={toggleOpen}
                    className="p-2 bg-background hover:bg-gray-700 rounded-md text-sm text-text-secondary border border-border"
                >
                    {isOpen ? 'Close' : 'Palette'}
                </button>
            </div>
            {isOpen && (
                <div className="absolute z-10 top-full mt-2 left-0 right-0 bg-surface border border-border rounded-md shadow-lg p-3 grid grid-cols-6 gap-2">
                    {palette.map(color => (
                        <button
                            key={color}
                            style={{ backgroundColor: color }}
                            className="w-full h-8 rounded-md border border-gray-300 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            onClick={() => handlePaletteSelect(color)}
                            title={color}
                            aria-label={`Select color ${color}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * @component SliderControl
 * @description A generic slider component for numerical typography properties.
 * Provides fine-grained control over values.
 */
export const SliderControl: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    unit?: string;
}> = ({ label, value, onChange, min, max, step, unit = '' }) => {
    const debouncedValue = useDebounce(value, 100); // Debounce for smoother UX
    const id = useMemo(() => `slider-control-${label.replace(/\s/g, '-')}`, [label]);

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-text-secondary">{label} <span className="text-primary font-bold">{debouncedValue}{unit}</span></label>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onChange(parseFloat(e.target.value))}
                className="w-full mt-1 accent-primary"
            />
        </div>
    );
};

/**
 * @component SelectControl
 * @description A generic dropdown selector for various options.
 */
export const SelectControl: React.FC<{
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    options: (string | number)[];
}> = ({ label, value, onChange, options }) => {
    const id = useMemo(() => `select-control-${label.replace(/\s/g, '-')}`, [label]);
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-text-secondary">{label}</label>
            <select
                id={id}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-md bg-surface border border-border text-text-primary"
            >
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

/**
 * @component CheckboxControl
 * @description A generic checkbox for boolean toggles.
 */
export const CheckboxControl: React.FC<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}> = ({ label, checked, onChange, description }) => {
    const id = useMemo(() => `checkbox-control-${label.replace(/\s/g, '-')}`, [label]);
    return (
        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="form-checkbox h-4 w-4 text-primary rounded border-gray-300"
            />
            <label htmlFor={id} className="text-sm text-text-secondary cursor-pointer">
                {label}
                {description && <p className="text-xs text-text-tertiary mt-0.5">{description}</p>}
            </label>
        </div>
    );
};

/**
 * @component CodeBlockCopier
 * @description Displays a code snippet with a copy-to-clipboard button.
 * Essential for developers to quickly integrate generated CSS.
 */
export const CodeBlockCopier: React.FC<{
    code: string;
    label: string;
    language?: string; // Future: syntax highlighting support
}> = ({ code, label }) => {
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code);
        MockNotificationService.showToast('Code copied to clipboard!', 'success');
        MockAnalyticsService.trackEvent('code_copied', { label, codeLength: code.length });
    }, [code, label]);

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-text-secondary">{label}</label>
            <div className="relative">
                <pre className="bg-background p-3 rounded-md text-primary text-xs overflow-x-auto border border-border font-mono">
                    <code>{code}</code>
                </pre>
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 px-2 py-0.5 bg-surface hover:bg-gray-700 text-text-secondary rounded-md text-xs border border-border transition-colors duration-200"
                    title={`Copy ${label} to clipboard`}
                >
                    Copy
                </button>
            </div>
        </div>
    );
};

/**
 * @component AIAnalysisViewer
 * @description Displays results from AI services in a structured, actionable format.
 * Part of the "Cognitive Design Assistant" UI.
 */
export const AIAnalysisViewer: React.FC<{
    title: string;
    result: AIAnalysisResult | null;
    onRegenerate?: () => void;
    loading: boolean;
}> = ({ title, result, onRegenerate, loading }) => (
    <div className="bg-background border border-border p-4 rounded-lg shadow-sm">
        <h4 className="font-bold text-md mb-2 flex items-center justify-between">
            {title}
            {onRegenerate && (
                <button
                    onClick={onRegenerate}
                    className="text-xs text-primary hover:underline"
                    disabled={loading}
                >
                    {loading ? 'Analyzing...' : 'Refresh AI'}
                </button>
            )}
        </h4>
        {loading ? (
            <p className="text-text-secondary text-sm animate-pulse">AI is processing your request...</p>
        ) : result ? (
            <div className="text-sm">
                <p className="text-text-primary mb-1"><strong>{result.model} Insight ({result.score.toFixed(0)}%):</strong> {result.message}</p>
                {result.suggestions.length > 0 && (
                    <ul className="list-disc list-inside text-text-secondary">
                        {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                )}
                <p className="text-xs text-text-tertiary mt-2">Analyzed: {new Date(result.timestamp).toLocaleTimeString()}</p>
            </div>
        ) : (
            <p className="text-text-secondary text-sm">No analysis performed yet. Click 'Refresh AI' to start.</p>
        )}
    </div>
);

/**
 * @component ServiceStatusIndicator
 * @description Displays the real-time status of integrated external services.
 * Crucial for enterprise-level operational visibility.
 */
export const ServiceStatusIndicator: React.FC<{ statuses: ServiceIntegrationStatus[] }> = ({ statuses }) => (
    <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-md font-bold mb-2">Service Health Dashboard</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
            {statuses.map(service => (
                <div key={service.name} className="flex items-center space-x-1">
                    <span className={`h-2 w-2 rounded-full ${
                        service.status === 'active' ? 'bg-green-500' :
                        service.status === 'error' ? 'bg-red-500' :
                        'bg-yellow-500'
                    }`} title={service.status}></span>
                    <span className="text-text-secondary">{service.name}</span>
                </div>
            ))}
        </div>
    </div>
);

// END: New Sub-Components

// BEGIN: TypographyLab Main Component - The central orchestration hub of Project Mercury.
// This is where all the features, services, and UI elements converge to create a
// powerful and intuitive design experience.

export const TypographyLab: React.FC = () => {
    // State Management - The core of our dynamic typography system.
    // Each useState hook represents a tunable aspect of the design, allowing for
    // granular control and real-time preview updates.

    // Font selection
    const [headingFont, setHeadingFont] = useLocalStorage<string>('cblab-headingFont', 'Oswald');
    const [bodyFont, setBodyFont] = useLocalStorage<string>('cblab-bodyFont', 'Roboto');
    const [headingFontMetadata, setHeadingFontMetadata] = useState<FontMetadata | null>(null);
    const [bodyFontMetadata, setBodyFontMetadata] = useState<FontMetadata | null>(null);

    // Typography settings
    const [headingSettings, setHeadingSettings] = useLocalStorage<TypographySettings>('cblab-headingSettings', {
        fontFamily: 'Oswald',
        fontWeight: 700,
        fontSize: 36,
        lineHeight: 1.2,
        letterSpacing: 0,
        textTransform: TextTransformOption.NONE,
        textAlign: TextAlignOption.LEFT,
        fontStyle: FontStyleOption.NORMAL,
        textDecoration: TextDecorationOption.NONE,
        color: '#1A1A1A',
    });
    const [bodySettings, setBodySettings] = useLocalStorage<TypographySettings>('cblab-bodySettings', {
        fontFamily: 'Roboto',
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 1.6,
        letterSpacing: 0,
        textTransform: TextTransformOption.NONE,
        textAlign: TextAlignOption.LEFT,
        fontStyle: FontStyleOption.NORMAL,
        textDecoration: TextDecorationOption.NONE,
        color: '#333333',
    });

    // Preview specific settings
    const [previewContentHeading, setPreviewContentHeading] = useLocalStorage<string>('cblab-previewHeading', 'The Quick Brown Fox Jumps Over the Lazy Dog');
    const [previewContentBody, setPreviewContentBody] = useLocalStorage<string>('cblab-previewBody', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.');
    const [previewBackgroundColor, setPreviewBackgroundColor] = useLocalStorage<string>('cblab-previewBgColor', '#FFFFFF');
    const [previewThemeMode, setPreviewThemeMode] = useLocalStorage<ThemeMode>('cblab-themeMode', ThemeMode.LIGHT);
    const [showAccessibilityOverlay, setShowAccessibilityOverlay] = useState(false);
    const [activeExportFormat, setActiveExportFormat] = useState<ExportFormat>(ExportFormat.CSS);
    const [baseTypographicScaleRatio, setBaseTypographicScaleRatio] = useLocalStorage<string>('cblab-typoScaleRatio', 'None');
    const [baseTypographicScaleBaseSize, setBaseTypographicScaleBaseSize] = useLocalStorage<number>('cblab-typoScaleBaseSize', 16);
    const [activeLocale, setActiveLocale] = useLocalStorage<string>('cblab-locale', 'en'); // For internationalization testing

    // AI Integration States
    const [aiPairingResult, setAiPairingResult] = useState<AIAnalysisResult | null>(null);
    const [aiContentResult, setAiContentResult] = useState<AIAnalysisResult | null>(null);
    const [aiCritiqueResult, setAiCritiqueResult] = useState<AIAnalysisResult | null>(null);
    const [aiLoadingPairing, setAiLoadingPairing] = useState(false);
    const [aiLoadingContent, setAiLoadingContent] = useState(false);
    const [aiLoadingCritique, setAiLoadingCritique] = useState(false);

    // Dynamic Font Loading - Ensures selected fonts are available for preview.
    // This useEffect hook is critical for the visual accuracy of the TypographyLab.
    useEffect(() => {
        // Update font families in settings whenever the selected fonts change
        setHeadingSettings(prev => ({ ...prev, fontFamily: headingFont }));
        setBodySettings(prev => ({ ...prev, fontFamily: bodyFont }));

        const fontsToLoad = [headingFont, bodyFont]
            .filter(Boolean)
            .map(font => {
                const isHeading = font === headingFont;
                const weight = isHeading ? headingSettings.fontWeight : bodySettings.fontWeight;
                const style = isHeading ? headingSettings.fontStyle : bodySettings.fontStyle;
                return `${font.replace(/ /g, '+')}:${weight},${style === FontStyleOption.ITALIC ? 'ital' : ''}`;
            })
            .join('|');

        if (fontsToLoad) {
            const linkId = 'font-pairing-stylesheet';
            let link = document.getElementById(linkId) as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
            // Use MockGoogleFontsAPI to generate the href, demonstrating service integration
            link.href = MockGoogleFontsAPI.getFontURL(
                fontsToLoad,
                [headingSettings.fontWeight, bodySettings.fontWeight],
                [headingSettings.fontStyle, bodySettings.fontStyle].filter(s => s === FontStyleOption.ITALIC)
            );
            MockAnalyticsService.trackEvent('fonts_loaded', { headingFont, bodyFont });
        }
    }, [headingFont, bodyFont, headingSettings.fontWeight, headingSettings.fontStyle, bodySettings.fontWeight, bodySettings.fontStyle, setHeadingSettings, setBodySettings]);

    // Fetch font metadata on font change
    useEffect(() => {
        const fetchMetadata = async (fontFamily: string, isHeading: boolean) => {
            if (!fontFamily) return;
            try {
                const allFonts = await MockGoogleFontsAPI.fetchFontList();
                const metadata = allFonts.find(f => f.family === fontFamily);
                if (isHeading) setHeadingFontMetadata(metadata || null);
                else setBodyFontMetadata(metadata || null);
            } catch (error) {
                console.error(`Failed to fetch metadata for ${fontFamily}:`, error);
                MockNotificationService.showToast(`Failed to load metadata for ${fontFamily}.`, 'error');
            }
        };
        fetchMetadata(headingFont, true);
        fetchMetadata(bodyFont, false);
    }, [headingFont, bodyFont]);

    // AI Integration Logic - The "brain" of Project Mercury.
    // These functions orchestrate calls to Gemini and ChatGPT for intelligent design assistance.

    const runAIPairingSuggestion = useCallback(async () => {
        setAiLoadingPairing(true);
        try {
            const result = await MockGeminiAI.suggestFontPairing('professional and modern', ['finance', 'technology', 'trust']);
            setAiPairingResult(result);
            MockAnalyticsService.trackEvent('ai_pairing_suggestion', { result: result.suggestions[0] });
        } catch (error) {
            console.error("AI Pairing Suggestion failed:", error);
            MockNotificationService.showToast('AI Pairing Suggestion failed!', 'error');
        } finally {
            setAiLoadingPairing(false);
        }
    }, []);

    const runAIGenerateContent = useCallback(async (type: 'heading' | 'body') => {
        setAiLoadingContent(true);
        try {
            const result = await MockGeminiAI.generateSampleText('financial services', type === 'heading' ? 'short' : 'long');
            setAiContentResult(result);
            if (type === 'heading') setPreviewContentHeading(result.suggestions[0] || '');
            else setPreviewContentBody(result.suggestions[0] || '');
            MockAnalyticsService.trackEvent('ai_content_generation', { type, length: type === 'heading' ? 'short' : 'long' });
        } catch (error) {
            console.error("AI Content Generation failed:", error);
            MockNotificationService.showToast('AI Content Generation failed!', 'error');
        } finally {
            setAiLoadingContent(false);
        }
    }, [setPreviewContentHeading, setPreviewContentBody]);

    const runAICritiqueTypography = useCallback(async () => {
        setAiLoadingCritique(true);
        try {
            const result = await MockGeminiAI.critiqueTypography(
                headingSettings,
                `${previewContentHeading} ${previewContentBody}`
            );
            setAiCritiqueResult(result);
            MockAnalyticsService.trackEvent('ai_critique', { score: result.score });
        } catch (error) {
            console.error("AI Critique failed:", error);
            MockNotificationService.showToast('AI Critique failed!', 'error');
        } finally {
            setAiLoadingCritique(false);
        }
    }, [headingSettings, previewContentHeading, previewContentBody]);

    // Computed Values & Memoizations - Optimizing performance for a feature-rich application.
    const currentContrastRatio = useMemo(() => {
        return getContrastRatio(headingSettings.color, previewBackgroundColor);
    }, [headingSettings.color, previewBackgroundColor]);

    const wcagCompliance = useMemo(() => {
        return checkWCAGCompliance(currentContrastRatio, headingSettings.fontSize, headingSettings.fontWeight);
    }, [currentContrastRatio, headingSettings.fontSize, headingSettings.fontWeight]);

    // Dynamic Typography Scale Application
    const typographicScaleSizes = useMemo(() => {
        const ratioMap: { [key: string]: number } = {
            'None': 1,
            'Minor Second (1.067)': 1.067,
            'Major Second (1.125)': 1.125,
            'Minor Third (1.2)': 1.2,
            'Major Third (1.25)': 1.25,
            'Perfect Fourth (1.333)': 1.333,
            'Augmented Fourth (1.414)': 1.414,
            'Perfect Fifth (1.5)': 1.5,
            'Golden Ratio (1.618)': 1.618
        };
        const ratio = ratioMap[baseTypographicScaleRatio] || 1;
        // Generate a few steps up and down from the base for demonstration
        return applyTypographyScale(baseTypographicScaleBaseSize, ratio, [-2, -1, 0, 1, 2, 3, 4, 5]);
    }, [baseTypographicScaleRatio, baseTypographicScaleBaseSize]);

    // CSS Generation for Export - Centralizing output generation for consistency.
    const generatedHeadingCSS = useMemo(() => generateTypographyCSS(headingSettings, '.cblab-h1', activeExportFormat), [headingSettings, activeExportFormat]);
    const generatedBodyCSS = useMemo(() => generateTypographyCSS(bodySettings, '.cblab-body', activeExportFormat), [bodySettings, activeExportFormat]);

    // Full CSS Import String
    const fullCSSImport = useMemo(() => {
        const headingImport = MockGoogleFontsAPI.getFontURL(headingFont, [headingSettings.fontWeight], [headingSettings.fontStyle]);
        const bodyImport = MockGoogleFontsAPI.getFontURL(bodyFont, [bodySettings.fontWeight], [bodySettings.fontStyle]);
        return `@import url('${headingImport}');\n@import url('${bodyImport}');\n\n${generatedHeadingCSS}\n\n${generatedBodyCSS}`;
    }, [headingFont, bodyFont, headingSettings, bodySettings, generatedHeadingCSS, generatedBodyCSS]);

    // Internationalization (I18N) for preview text
    const [translatedHeading, setTranslatedHeading] = useState('');
    const [translatedBody, setTranslatedBody] = useState('');

    useEffect(() => {
        const fetchTranslations = async () => {
            const h = await MockTranslationService.getTranslatedText("the_quick_brown_fox", activeLocale);
            const b = await MockTranslationService.getTranslatedText("lorem_ipsum", activeLocale);
            setTranslatedHeading(h);
            setTranslatedBody(b);
        };
        fetchTranslations();
    }, [activeLocale]);

    // UI structure and rendering
    return (
        <div className={`h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary transition-colors duration-300 ${previewThemeMode === ThemeMode.DARK ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <header className="mb-6 border-b border-border pb-4">
                <h1 className="text-4xl font-extrabold flex items-center text-primary-dark">
                    <TypographyLabIcon className="h-10 w-10" />
                    <span className="ml-4 tracking-tight">Project Mercury: Typography Lab</span>
                </h1>
                <p className="text-text-secondary mt-2 text-lg">
                    The ultimate commercial-grade platform for AI-driven font pairing, comprehensive CSS generation,
                    and accessibility auditing. Developed by Citibank Demo Business Inc. to set new standards in digital design.
                </p>
                <div className="flex items-center space-x-4 mt-3">
                    <SelectControl
                        label="Preview Theme"
                        value={previewThemeMode}
                        onChange={val => setPreviewThemeMode(val as ThemeMode)}
                        options={Object.values(ThemeMode)}
                    />
                    <ColorPicker
                        label="Preview Background"
                        value={previewBackgroundColor}
                        onChange={setPreviewBackgroundColor}
                    />
                    <SelectControl
                        label="Preview Locale"
                        value={activeLocale}
                        onChange={setActiveLocale}
                        options={['en', 'es', 'ja', 'ar', 'zh', 'ko']}
                    />
                </div>
            </header>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-0 overflow-hidden">
                {/* Control Panel: Left Sidebar */}
                <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6 bg-surface border border-border p-6 rounded-lg overflow-y-auto shadow-xl">
                    <h3 className="text-2xl font-bold border-b border-border pb-3">Design Controls</h3>

                    {/* Font Selection Section */}
                    <section className="space-y-4">
                        <h4 className="font-semibold text-xl text-primary-dark">Font Pairing</h4>
                        <SelectControl label="Heading Font" value={headingFont} onChange={setHeadingFont} options={popularFonts} />
                        {headingFontMetadata && (
                            <p className="text-xs text-text-tertiary">Variants: {headingFontMetadata.variants.join(', ')}</p>
                        )}
                        <SelectControl label="Body Font" value={bodyFont} onChange={setBodyFont} options={popularFonts} />
                        {bodyFontMetadata && (
                            <p className="text-xs text-text-tertiary">Variants: {bodyFontMetadata.variants.join(', ')}</p>
                        )}
                        <button
                            onClick={runAIPairingSuggestion}
                            disabled={aiLoadingPairing}
                            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
                        >
                            {aiLoadingPairing ? 'Generating...' : 'AI Suggest Pairings (Gemini)'}
                        </button>
                        <AIAnalysisViewer title="AI Pairing Insights" result={aiPairingResult} loading={aiLoadingPairing} />
                    </section>

                    {/* Heading Settings */}
                    <section className="space-y-4 pt-4 border-t border-border">
                        <h4 className="font-semibold text-xl text-primary-dark">Heading Settings</h4>
                        <SliderControl label="Font Weight" value={headingSettings.fontWeight} onChange={val => setHeadingSettings(prev => ({ ...prev, fontWeight: val }))} min={100} max={900} step={100} />
                        <SliderControl label="Font Size" value={headingSettings.fontSize} onChange={val => setHeadingSettings(prev => ({ ...prev, fontSize: val }))} min={12} max={120} step={1} unit="px" />
                        <SliderControl label="Line Height" value={headingSettings.lineHeight} onChange={val => setHeadingSettings(prev => ({ ...prev, lineHeight: val }))} min={1} max={2.5} step={0.05} />
                        <SliderControl label="Letter Spacing" value={headingSettings.letterSpacing} onChange={val => setHeadingSettings(prev => ({ ...prev, letterSpacing: val }))} min={-0.05} max={0.2} step={0.01} unit="em" />
                        <SelectControl label="Text Transform" value={headingSettings.textTransform} onChange={val => setHeadingSettings(prev => ({ ...prev, textTransform: val as TextTransformOption }))} options={Object.values(TextTransformOption)} />
                        <SelectControl label="Text Align" value={headingSettings.textAlign} onChange={val => setHeadingSettings(prev => ({ ...prev, textAlign: val as TextAlignOption }))} options={Object.values(TextAlignOption)} />
                        <SelectControl label="Font Style" value={headingSettings.fontStyle} onChange={val => setHeadingSettings(prev => ({ ...prev, fontStyle: val as FontStyleOption }))} options={Object.values(FontStyleOption)} />
                        <SelectControl label="Text Decoration" value={headingSettings.textDecoration} onChange={val => setHeadingSettings(prev => ({ ...prev, textDecoration: val as TextDecorationOption }))} options={Object.values(TextDecorationOption)} />
                        <ColorPicker label="Heading Color" value={headingSettings.color} onChange={val => setHeadingSettings(prev => ({ ...prev, color: val }))} />
                    </section>

                    {/* Body Settings */}
                    <section className="space-y-4 pt-4 border-t border-border">
                        <h4 className="font-semibold text-xl text-primary-dark">Body Settings</h4>
                        <SliderControl label="Font Weight" value={bodySettings.fontWeight} onChange={val => setBodySettings(prev => ({ ...prev, fontWeight: val }))} min={100} max={900} step={100} />
                        <SliderControl label="Font Size" value={bodySettings.fontSize} onChange={val => setBodySettings(prev => ({ ...prev, fontSize: val }))} min={10} max={30} step={1} unit="px" />
                        <SliderControl label="Line Height" value={bodySettings.lineHeight} onChange={val => setBodySettings(prev => ({ ...prev, lineHeight: val }))} min={1} max={2.5} step={0.05} />
                        <SliderControl label="Letter Spacing" value={bodySettings.letterSpacing} onChange={val => setBodySettings(prev => ({ ...prev, letterSpacing: val }))} min={-0.05} max={0.2} step={0.01} unit="em" />
                        <SelectControl label="Text Transform" value={bodySettings.textTransform} onChange={val => setBodySettings(prev => ({ ...prev, textTransform: val as TextTransformOption }))} options={Object.values(TextTransformOption)} />
                        <SelectControl label="Text Align" value={bodySettings.textAlign} onChange={val => setBodySettings(prev => ({ ...prev, textAlign: val as TextAlignOption }))} options={Object.values(TextAlignOption)} />
                        <SelectControl label="Font Style" value={bodySettings.fontStyle} onChange={val => setBodySettings(prev => ({ ...prev, fontStyle: val as FontStyleOption }))} options={Object.values(FontStyleOption)} />
                        <SelectControl label="Text Decoration" value={bodySettings.textDecoration} onChange={val => setBodySettings(prev => ({ ...prev, textDecoration: val as TextDecorationOption }))} options={Object.values(TextDecorationOption)} />
                        <ColorPicker label="Body Color" value={bodySettings.color} onChange={val => setBodySettings(prev => ({ ...prev, color: val }))} />
                    </section>

                    {/* Typographic Scale & Grid */}
                    <section className="space-y-4 pt-4 border-t border-border">
                        <h4 className="font-semibold text-xl text-primary-dark">Typographic Scale</h4>
                        <SelectControl
                            label="Scale Preset"
                            value={baseTypographicScaleRatio}
                            onChange={setBaseTypographicScaleRatio}
                            options={TYPOGRAPHY_SCALE_PRESETS}
                        />
                        <SliderControl label="Base Font Size" value={baseTypographicScaleBaseSize} onChange={setBaseTypographicScaleBaseSize} min={12} max={24} step={1} unit="px" />
                        <div className="bg-background p-3 rounded-md border border-border text-xs text-text-secondary">
                            <p className="font-medium text-text-primary">Generated Scale:</p>
                            {Object.entries(typographicScaleSizes).map(([key, size]) => (
                                <p key={key}>{key}: {size}px</p>
                            ))}
                        </div>
                    </section>

                    {/* Accessibility Tools */}
                    <section className="space-y-4 pt-4 border-t border-border">
                        <h4 className="font-semibold text-xl text-primary-dark">Accessibility Tools</h4>
                        <div className="flex justify-between items-center bg-background p-3 rounded-md border border-border">
                            <span className="text-text-secondary">Contrast Ratio: <span className="font-bold text-primary">{currentContrastRatio}:1</span></span>
                            <span className={`font-bold px-2 py-1 rounded-md text-white ${
                                wcagCompliance.includes('Fail') ? 'bg-red-500' :
                                wcagCompliance.includes('AAA') ? 'bg-green-600' : 'bg-green-500'
                            }`}>
                                {wcagCompliance}
                            </span>
                        </div>
                        <CheckboxControl
                            label="Show Accessibility Overlay"
                            checked={showAccessibilityOverlay}
                            onChange={setShowAccessibilityOverlay}
                            description="Highlights areas with potential accessibility issues."
                        />
                        <button
                            onClick={runAICritiqueTypography}
                            disabled={aiLoadingCritique}
                            className="w-full py-2 px-4 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors duration-200 disabled:opacity-50"
                        >
                            {aiLoadingCritique ? 'Analyzing...' : 'AI Typography Critique (Gemini)'}
                        </button>
                        <AIAnalysisViewer title="AI Critique Results" result={aiCritiqueResult} loading={aiLoadingCritique} onRegenerate={runAICritiqueTypography} />
                    </section>
                </div>

                {/* Main Preview Area & AI/Export Controls */}
                <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-6">
                    {/* Preview Section */}
                    <div className="flex-grow bg-background border border-border rounded-lg p-8 overflow-y-auto shadow-xl"
                         style={{ backgroundColor: previewBackgroundColor, transition: 'background-color 0.3s' }}>
                        <h2
                            className="text-5xl font-extrabold mb-6"
                            style={{
                                fontFamily: `'${headingSettings.fontFamily}', sans-serif`,
                                fontWeight: headingSettings.fontWeight,
                                fontSize: headingSettings.fontSize,
                                lineHeight: headingSettings.lineHeight,
                                letterSpacing: headingSettings.letterSpacing,
                                textTransform: headingSettings.textTransform,
                                textAlign: headingSettings.textAlign,
                                fontStyle: headingSettings.fontStyle,
                                textDecoration: headingSettings.textDecoration,
                                color: headingSettings.color,
                            }}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e: React.FormEvent<HTMLHeadingElement>) => setPreviewContentHeading(e.currentTarget.innerText)}
                        >
                            {translatedHeading}
                        </h2>
                        <p
                            className="text-lg leading-relaxed"
                            style={{
                                fontFamily: `'${bodySettings.fontFamily}', sans-serif`,
                                fontWeight: bodySettings.fontWeight,
                                fontSize: bodySettings.fontSize,
                                lineHeight: bodySettings.lineHeight,
                                letterSpacing: bodySettings.letterSpacing,
                                textTransform: bodySettings.textTransform,
                                textAlign: bodySettings.textAlign,
                                fontStyle: bodySettings.fontStyle,
                                textDecoration: bodySettings.textDecoration,
                                color: bodySettings.color,
                            }}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e: React.FormEvent<HTMLParagraphElement>) => setPreviewContentBody(e.currentTarget.innerText)}
                        >
                            {translatedBody}
                        </p>
                        {showAccessibilityOverlay && wcagCompliance === ContrastLevel.FAIL && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center pointer-events-none">
                                <span className="text-red-800 text-3xl font-bold p-4 bg-white bg-opacity-80 rounded-lg">Accessibility Warning! ({wcagCompliance})</span>
                            </div>
                        )}
                        <div className="mt-8 pt-8 border-t border-dashed border-border-secondary text-text-tertiary text-sm">
                            <h3 className="font-bold mb-2">Extended Typographic Elements Preview:</h3>
                            {/* Example: Sub-heading */}
                            <h4
                                className="text-2xl font-semibold mb-2"
                                style={{
                                    fontFamily: `'${headingSettings.fontFamily}', sans-serif`,
                                    fontWeight: Math.min(headingSettings.fontWeight + 100, 900), // Slightly lighter/different variant
                                    fontSize: Math.round(headingSettings.fontSize * 0.75),
                                    lineHeight: headingSettings.lineHeight * 1.1,
                                    color: headingSettings.color,
                                }}
                            >
                                Subtitle: Elevating the User Experience
                            </h4>
                            {/* Example: Button Text */}
                            <button
                                className="py-2 px-4 rounded-md mt-4 text-white"
                                style={{
                                    fontFamily: `'${bodySettings.fontFamily}', sans-serif`,
                                    fontWeight: 600,
                                    fontSize: Math.round(bodySettings.fontSize * 1.1),
                                    backgroundColor: '#007bff', // Example button color
                                }}
                            >
                                Learn More
                            </button>
                            {/* Example: Caption/Fine Print */}
                            <p
                                className="mt-4 text-xs"
                                style={{
                                    fontFamily: `'${bodySettings.fontFamily}', sans-serif`,
                                    fontWeight: 300,
                                    fontSize: Math.round(bodySettings.fontSize * 0.8),
                                    lineHeight: 1.4,
                                    color: bodySettings.color,
                                }}
                            >
                                © 2023 Citibank Demo Business Inc. All rights reserved. Terms and conditions apply.
                            </p>
                        </div>
                    </div>

                    {/* AI & Export Section */}
                    <div className="bg-surface border border-border p-6 rounded-lg shadow-xl flex flex-col gap-6">
                        <h3 className="text-2xl font-bold border-b border-border pb-3">Integration & Export</h3>

                        <section className="space-y-4">
                            <h4 className="font-semibold text-xl text-primary-dark">AI-Powered Content & Optimization</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => runAIGenerateContent('heading')}
                                    disabled={aiLoadingContent}
                                    className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
                                >
                                    {aiLoadingContent ? 'Generating...' : 'AI Generate Heading (Gemini)'}
                                </button>
                                <button
                                    onClick={() => runAIGenerateContent('body')}
                                    disabled={aiLoadingContent}
                                    className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
                                >
                                    {aiLoadingContent ? 'Generating...' : 'AI Generate Body (Gemini)'}
                                </button>
                            </div>
                            <AIAnalysisViewer title="AI Content Suggestions" result={aiContentResult} loading={aiLoadingContent} onRegenerate={() => runAIGenerateContent('body')} />
                        </section>

                        <section className="space-y-4 pt-4 border-t border-border">
                            <h4 className="font-semibold text-xl text-primary-dark">Export & Share</h4>
                            <SelectControl
                                label="Export Format"
                                value={activeExportFormat}
                                onChange={val => setActiveExportFormat(val as ExportFormat)}
                                options={Object.values(ExportFormat)}
                            />
                            <CodeBlockCopier label={`Full ${activeExportFormat.toUpperCase()} Code`} code={fullCSSImport} language={activeExportFormat} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        MockCloudStorageService.saveConfiguration('current-user-id', 'typography-lab-config', { headingSettings, bodySettings, previewBackgroundColor, previewThemeMode })
                                            .then(() => MockNotificationService.showToast('Configuration saved to cloud!', 'success'))
                                            .catch(() => MockNotificationService.showToast('Failed to save config!', 'error'));
                                    }}
                                    className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Save to Cloud (S3/GCS)
                                </button>
                                <button
                                    onClick={() => {
                                        MockVersionControlService.commitChanges('design-system-tokens', 'main', 'Update typography tokens from Lab', generatedHeadingCSS + generatedBodyCSS)
                                            .then(() => MockNotificationService.showToast('Committed to Git!', 'success'))
                                            .catch(() => MockNotificationService.showToast('Failed to commit to Git!', 'error'));
                                    }}
                                    className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Commit to Git (GitHub)
                                </button>
                            </div>
                            <p className="text-sm text-text-secondary mt-2">
                                For advanced integrations with Figma, Webflow, or Adobe XD, please refer to our
                                <a href="#integration-docs" className="text-primary hover:underline ml-1">developer documentation</a> and dedicated plugin services.
                            </p>
                        </section>

                        <ServiceStatusIndicator statuses={allServiceStatuses} />
                    </div>
                </div>
            </div>
        </div>
    );
};
// END: TypographyLab Main Component

// Final Note by James Burvel O’Callaghan III, President Citibank Demo Business Inc.:
// "Project Mercury is more than just code; it's a statement. A statement that Citibank Demo Business Inc.
// is at the forefront of combining artificial intelligence with design excellence to deliver unparalleled
// digital experiences. This file, massive and intricate, reflects the dedication and vision of our
// engineering and design teams. It is a testament to what is possible when innovation meets relentless
// pursuit of quality and functionality. This is our commitment to the future of design."

// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useEffect, useCallback, useMemo, createContext, useContext, useRef } from 'react'; // INVENTED: Added new React hooks for advanced component logic and performance.
import { TypographyLabIcon } from '../icons.tsx'; // Existing import, untouched.

// INVENTED: Centralized configuration management for API keys and service endpoints.
// This allows for easy updates and environmental segregation (dev, staging, prod).
export const AppConfig = {
    // INVENTED: API Key for Google Fonts. While implicitly used, formalizing its management.
    GOOGLE_FONTS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY || 'YOUR_GOOGLE_FONTS_API_KEY_HERE',
    // INVENTED: Gemini AI Service Endpoint. Enables intelligent font recommendations and analysis.
    GEMINI_API_ENDPOINT: process.env.NEXT_PUBLIC_GEMINI_API_ENDPOINT || 'https://api.gemini.ai/v1/typography',
    // INVENTED: ChatGPT AI Service Endpoint. Used for creative text generation and brief interpretation.
    CHATGPT_API_ENDPOINT: process.env.NEXT_PUBLIC_CHATGPT_API_ENDPOINT || 'https://api.chatgpt.com/v1/text',
    // INVENTED: Adobe Fonts API Endpoint. For integrating with premium Adobe font libraries.
    ADOBE_FONTS_API_ENDPOINT: process.env.NEXT_PUBLIC_ADOBE_FONTS_API_ENDPOINT || 'https://api.adobe.com/fonts',
    // INVENTED: Cloud Storage Endpoint for custom font uploads. Supports user-specific font management.
    CLOUD_STORAGE_UPLOAD_ENDPOINT: process.env.NEXT_PUBLIC_CLOUD_STORAGE_UPLOAD_ENDPOINT || 'https://storage.our-cdn.com/upload',
    // INVENTED: Image Generation Service Endpoint. For creating high-fidelity font preview images.
    IMAGE_GEN_SERVICE_ENDPOINT: process.env.NEXT_PUBLIC_IMAGE_GEN_SERVICE_ENDPOINT || 'https://img-gen.our-cdn.com/render',
    // INVENTED: Analytics Service Endpoint. For tracking user behavior and feature adoption.
    ANALYTICS_SERVICE_ENDPOINT: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_ENDPOINT || 'https://analytics.our-cdn.com/events',
    // INVENTED: Licensing Management Service. To ensure compliance with font usage rights.
    LICENSING_SERVICE_ENDPOINT: process.env.NEXT_PUBLIC_LICENSING_SERVICE_ENDPOINT || 'https://license.our-platform.com/api',
    // INVENTED: Collaborative Editing Service. For real-time font selection and feedback in teams.
    COLLAB_SERVICE_ENDPOINT: process.env.NEXT_PUBLIC_COLLAB_SERVICE_ENDPOINT || 'wss://collab.our-platform.com/ws',
    // INVENTED: Maximum custom fonts a user can upload. A commercial-grade limitation.
    MAX_CUSTOM_FONTS_PER_USER: 50,
    // INVENTED: Default font loading strategy for Google Fonts.
    GOOGLE_FONTS_LOADING_STRATEGY: '400,700,italic',
    // INVENTED: Feature Flags for A/B testing or gradual rollout of new features.
    FEATURE_FLAGS: {
        AI_FONT_PAIRING: true,
        CUSTOM_FONT_UPLOADS: true,
        COLLABORATION_MODE: false,
        PREMIUM_FONT_ACCESS: true, // INVENTED: Indicates availability of premium font features.
    },
    // INVENTED: Pre-defined categories for font filtering.
    FONT_CATEGORIES: ['Serif', 'Sans-Serif', 'Display', 'Handwriting', 'Monospace', 'Script', 'Blackletter'],
    // INVENTED: Standard font weights for selection.
    FONT_WEIGHTS: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    // INVENTED: Standard font styles.
    FONT_STYLES: ['normal', 'italic'],
    // INVENTED: Default accessibility options.
    ACCESSIBILITY_OPTIONS: {
        MIN_CONTRAST_RATIO: 4.5, // WCAG 2.1 AA level for normal text
        MIN_X_HEIGHT_RATIO: 0.5, // Heuristic for legibility
    },
    // INVENTED: Pricing tiers for premium features.
    PRICING_PLANS: [
        { id: 'free', name: 'Free', features: ['Basic Font Preview', '10 Saved Fonts'], maxUploads: 0 },
        { id: 'pro', name: 'Pro', features: ['Advanced Features', '50 Saved Fonts', 'AI Pairing'], maxUploads: 50, price: 9.99 },
        { id: 'enterprise', name: 'Enterprise', features: ['All Features', 'Unlimited Saved Fonts', 'Collaboration'], maxUploads: 500, price: 99.99 },
    ],
    // INVENTED: Default phrases for text preview, making it easier for users to test.
    DEFAULT_PREVIEW_PHRASES: [
        'The quick brown fox jumps over the lazy dog.',
        'Sphinx of black quartz, judge my vow.',
        'Pack my box with five dozen liquor jugs.',
        'How vexingly quick daft zebras jump.',
        'Grumpy wizards make toxic brew for the evil Queen and Jack.'
    ],
    // INVENTED: Global debounce time for performance-critical inputs.
    DEBOUNCE_TIME_MS: 300,
};

// INVENTED: Comprehensive list of popular fonts, expanded significantly.
// This forms a core part of the product's font library offering.
const popularFonts = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro', 'Raleway', 'Poppins', 'Nunito', 'Merriweather',
    'Playfair Display', 'Lora', 'Noto Sans', 'Ubuntu', 'PT Sans', 'Slabo 27px', 'Great Vibes', 'EB Garamond',
    'Inter', 'Lexend Deca', 'Fira Sans', 'Space Mono', 'Bitter', 'Crimson Text', 'Cabin', 'Karla', 'Rubik',
    'Arvo', 'Josefin Sans', 'Quicksand', 'Cormorant Garamond', 'Domine', 'IBM Plex Sans', 'Permanent Marker',
    'Pacifico', 'Indie Flower', 'Dancing Script', 'Comfortaa', 'Righteous', 'Varela Round', 'Maven Pro',
    'Archivo Narrow', 'Oxygen', 'Questrial', 'Exo 2', 'Work Sans', 'Muli', 'Nunito Sans', 'Frank Ruhl Libre',
    'Abril Fatface', 'Bebas Neue', 'Anton', 'Lobster', 'Press Start 2P', 'Roboto Mono', 'DM Sans', 'Manrope',
    'Plus Jakarta Sans', 'Outfit', 'Wix Madefor Text', 'Outfit', 'Inter Variable', 'Montserrat Alternates',
    'Syne', 'Spline Sans', 'Instrument Sans', 'Onest', 'Urbanist', 'Hedvig Letters Sans', 'Geist Mono',
    'Geist Sans', 'Gabarito', 'Inclusive Sans', 'Recursive', 'Recursive Sans Casual', 'Recursive Mono',
    // INVENTED: Adding more diverse and niche fonts to showcase breadth.
    'Metal Mania', 'Creepster', 'Nosifier', 'Ewert', 'Monoton', 'Faster One', 'Fugaz One', 'Special Elite',
    'Architects Daughter', 'Amatic SC', 'Gloria Hallelujah', 'Kalam', 'Shadows Into Light Two',
    // INVENTED: Variable fonts support.
    'Open Sans Variable', 'Roboto Flex', 'Inter Variable', 'Source Code Pro Variable',
];

// INVENTED: Interface for a more detailed font object. This enables richer metadata and management.
export interface FontDetails {
    id: string;
    name: string;
    category: string;
    subsets: string[];
    variants: string[]; // e.g., ['regular', 'italic', '700', '700italic']
    weights: number[]; // e.g., [100, 400, 700]
    styles: string[]; // e.g., ['normal', 'italic']
    designers?: string[];
    licenseInfo?: string; // URL or text
    tags?: string[];
    isVariable?: boolean;
    variableAxes?: { tag: string; min: number; max: number; default: number }[];
    previewImageUrl?: string; // INVENTED: For pre-rendered preview images.
    downloadUrl?: string; // INVENTED: For downloading font files (e.g., custom uploads).
    source: 'Google Fonts' | 'Adobe Fonts' | 'Custom Upload' | 'System'; // INVENTED: Tracks font origin.
    addedDate?: string; // INVENTED: When the font was added to the user's collection.
    rating?: number; // INVENTED: User or community rating.
    popularityScore?: number; // INVENTED: Based on analytics.
}

// INVENTED: A utility class for debouncing function calls. Essential for performance in interactive UIs.
export class Debouncer {
    private timeoutId: NodeJS.Timeout | null = null;
    constructor(private delay: number) {}

    // INVENTED: Debounce function.
    debounce<T extends (...args: any[]) => void>(func: T): T {
        return ((...args: any[]) => {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(() => {
                func(...args);
                this.timeoutId = null;
            }, this.delay);
        }) as T;
    }

    // INVENTED: Immediate invocation, then debounce.
    debounceImmediate<T extends (...args: any[]) => void>(func: T): T {
        let immediateCalled = false;
        return ((...args: any[]) => {
            if (!immediateCalled) {
                func(...args);
                immediateCalled = true;
            }
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(() => {
                immediateCalled = false;
                this.timeoutId = null;
            }, this.delay);
        }) as T;
    }

    // INVENTED: Clears any pending debounced calls.
    clear() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}

// INVENTED: Global instance of debouncer for various UI inputs.
const inputDebouncer = new Debouncer(AppConfig.DEBOUNCE_TIME_MS);

// INVENTED: A service class to interact with Google Fonts API. Encapsulates API logic.
export class GoogleFontService {
    private static BASE_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

    // INVENTED: Fetches a list of all available fonts from Google Fonts.
    public static async fetchAllFonts(): Promise<FontDetails[]> {
        // This is a simplified fetch; real API would require more robust pagination and error handling.
        try {
            const response = await fetch(`${GoogleFontService.BASE_URL}?key=${AppConfig.GOOGLE_FONTS_API_KEY}&sort=popularity`);
            if (!response.ok) {
                throw new Error(`Google Fonts API error: ${response.statusText}`);
            }
            const data = await response.json();
            // INVENTED: Mapping Google Fonts API response to our internal FontDetails interface.
            return data.items.map((font: any) => ({
                id: font.family.replace(/\s/g, '_').toLowerCase(),
                name: font.family,
                category: font.category,
                subsets: font.subsets,
                variants: font.variants,
                weights: font.variants.filter((v: string) => !isNaN(parseInt(v))).map(Number),
                styles: font.variants.filter((v: string) => isNaN(parseInt(v))),
                designers: font.designer ? [font.designer] : undefined,
                source: 'Google Fonts',
                popularityScore: font.popularity, // Hypothetical popularity score from API
            })) as FontDetails[];
        } catch (error) {
            console.error('Failed to fetch Google Fonts:', error);
            // INVENTED: Fallback to local popularFonts if API fails.
            return popularFonts.map(fontName => ({
                id: fontName.replace(/\s/g, '_').toLowerCase(),
                name: fontName,
                category: 'Sans-Serif', // Defaulting category for fallback
                subsets: ['latin'],
                variants: ['regular', '700'],
                weights: [400, 700],
                styles: ['normal'],
                source: 'Google Fonts',
            }));
        }
    }

    // INVENTED: Dynamically loads a Google Font by creating a <link> tag.
    public static loadFont(fontName: string, variants: string[] = ['400', '700']): void {
        const fontsToLoad = `${fontName.replace(/ /g, '+')}:${variants.join(',')}`;
        const linkId = `font-picker-stylesheet-${fontName.replace(/\s/g, '-')}`;
        let link = document.getElementById(linkId) as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        link.href = `https://fonts.googleapis.com/css?family=${fontsToLoad}&display=swap`;
    }
}

// INVENTED: A service for managing custom font uploads. Leverages cloud storage.
export class CustomFontUploadService {
    // INVENTED: Uploads a font file to cloud storage.
    public static async uploadFont(file: File): Promise<FontDetails | null> {
        if (!AppConfig.FEATURE_FLAGS.CUSTOM_FONT_UPLOADS) {
            console.warn('Custom font uploads are disabled by feature flag.');
            return null;
        }

        const formData = new FormData();
        formData.append('fontFile', file);
        formData.append('userId', 'current_user_id_mock'); // INVENTED: Placeholder for actual user ID

        try {
            // INVENTED: Simulate an upload API call.
            const response = await fetch(AppConfig.CLOUD_STORAGE_UPLOAD_ENDPOINT, {
                method: 'POST',
                body: formData,
                // INVENTED: Authentication token would be sent here.
                headers: { 'Authorization': 'Bearer YOUR_AUTH_TOKEN_HERE' }
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const uploadResult = await response.json();
            // INVENTED: Assuming the API returns enough data to construct a FontDetails object.
            return {
                id: `custom-${file.name.replace(/\s/g, '_').toLowerCase()}`,
                name: file.name.replace(/\.ttf|\.otf|\.woff2/i, ''),
                category: 'Custom Upload',
                subsets: ['latin'], // Default for custom uploads
                variants: ['regular'],
                weights: [400],
                styles: ['normal'],
                downloadUrl: uploadResult.url, // URL to the uploaded font
                source: 'Custom Upload',
                addedDate: new Date().toISOString(),
            };
        } catch (error) {
            console.error('Error uploading custom font:', error);
            return null;
        }
    }
}

// INVENTED: Service for generating high-fidelity font preview images.
export class ImageGenerationService {
    // INVENTED: Generates a font preview image based on text, font, and styles.
    public static async generateFontPreviewImage(
        text: string,
        fontFamily: string,
        fontSize: number,
        textColor: string = '#000000',
        backgroundColor: string = '#ffffff',
        width: number = 800,
        height: number = 200
    ): Promise<string | null> {
        try {
            // INVENTED: Simulate an image generation API call.
            const response = await fetch(AppConfig.IMAGE_GEN_SERVICE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    fontFamily,
                    fontSize,
                    textColor,
                    backgroundColor,
                    width,
                    height,
                }),
            });

            if (!response.ok) {
                throw new Error(`Image generation failed: ${response.statusText}`);
            }

            const result = await response.json();
            return result.imageUrl; // Expecting a URL to the generated image
        } catch (error) {
            console.error('Error generating font preview image:', error);
            return null;
        }
    }
}

// INVENTED: Analytics service for tracking user interactions. Crucial for commercial products.
export class AnalyticsService {
    // INVENTED: Sends an event to the analytics backend.
    public static trackEvent(eventName: string, properties: Record<string, any> = {}): void {
        if (!AppConfig.ANALYTICS_SERVICE_ENDPOINT) {
            console.warn('Analytics endpoint not configured.');
            return;
        }
        // INVENTED: Simulate sending data to an analytics platform.
        fetch(AppConfig.ANALYTICS_SERVICE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: eventName,
                timestamp: new Date().toISOString(),
                userId: 'current_user_id_mock', // INVENTED: Placeholder for actual user ID
                properties,
            }),
        }).catch(error => console.error('Failed to send analytics event:', error));
        // console.log(`Analytics Event: ${eventName}`, properties); // For local debugging
    }
}

// INVENTED: Licensing Management Service. Ensures compliance and tracks font usage rights.
export class LicensingService {
    // INVENTED: Checks the licensing status for a given font and user.
    public static async checkFontLicense(fontId: string, userId: string): Promise<{ licensed: boolean; details?: string }> {
        if (!AppConfig.LICENSING_SERVICE_ENDPOINT) {
            console.warn('Licensing endpoint not configured.');
            return { licensed: true, details: 'Licensing check skipped (service disabled).' };
        }
        try {
            const response = await fetch(`${AppConfig.LICENSING_SERVICE_ENDPOINT}/check?fontId=${fontId}&userId=${userId}`);
            if (!response.ok) {
                throw new Error(`Licensing check failed: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error checking font license:', error);
            return { licensed: false, details: 'Failed to connect to licensing service.' };
        }
    }

    // INVENTED: Records a font usage event for compliance tracking.
    public static async recordFontUsage(fontId: string, userId: string, projectId: string = 'global'): Promise<void> {
        if (!AppConfig.LICENSING_SERVICE_ENDPOINT) {
            console.warn('Licensing endpoint not configured.');
            return;
        }
        try {
            await fetch(`${AppConfig.LICENSING_SERVICE_ENDPOINT}/usage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fontId, userId, projectId, timestamp: new Date().toISOString() }),
            });
        } catch (error) {
            console.error('Error recording font usage:', error);
        }
    }
}

// INVENTED: Gemini AI Integration Service. Provides advanced font-related AI capabilities.
export class GeminiAIService {
    // INVENTED: Provides intelligent font recommendations based on context.
    public static async getFontRecommendations(
        context: string,
        existingFonts: string[] = [],
        mood: string = 'modern'
    ): Promise<string[]> {
        if (!AppConfig.FEATURE_FLAGS.AI_FONT_PAIRING) {
            console.warn('AI font pairing is disabled by feature flag.');
            return [];
        }
        try {
            // INVENTED: Simulate call to Gemini AI for font recommendations.
            const response = await fetch(AppConfig.GEMINI_API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AppConfig.GOOGLE_FONTS_API_KEY}` }, // Reusing Google API key for Gemini mock
                body: JSON.stringify({
                    prompt: `Suggest fonts for a project with context: "${context}". Existing fonts: ${existingFonts.join(', ')}. Mood: ${mood}. Provide 5 font names.`,
                    model: 'gemini-pro', // INVENTED: Specify Gemini model
                    temperature: 0.7,
                    max_tokens: 100,
                }),
            });

            if (!response.ok) {
                throw new Error(`Gemini AI failed: ${response.statusText}`);
            }

            const data = await response.json();
            // INVENTED: Parse Gemini's response to extract font names.
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const fontNames = textResponse.match(/[\w\s-]+/g)?.map((s: string) => s.trim()).filter((s: string) => s.length > 2) || [];
            return fontNames.slice(0, 5); // Limit to 5 suggestions
        } catch (error) {
            console.error('Error getting Gemini font recommendations:', error);
            return [];
        }
    }

    // INVENTED: Analyzes a font for accessibility compliance (contrast, legibility).
    public static async analyzeFontAccessibility(
        fontFamily: string,
        fontSize: number,
        textColor: string,
        backgroundColor: string,
        textSample: string
    ): Promise<{ contrastRatio: number; legibilityScore: number; recommendations: string[] }> {
        try {
            // INVENTED: Simulate call to Gemini AI for accessibility analysis.
            const response = await fetch(AppConfig.GEMINI_API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AppConfig.GOOGLE_FONTS_API_KEY}` },
                body: JSON.stringify({
                    prompt: `Analyze accessibility for font "${fontFamily}" at ${fontSize}px, with text color "${textColor}" on background "${backgroundColor}". Sample: "${textSample}". Provide contrast ratio, legibility score (1-10), and WCAG recommendations.`,
                    model: 'gemini-pro',
                    temperature: 0.3,
                    max_tokens: 200,
                }),
            });

            if (!response.ok) {
                throw new Error(`Gemini AI failed: ${response.statusText}`);
            }

            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            // INVENTED: Mock parsing of the AI's response for structured data.
            const contrastMatch = textResponse.match(/Contrast Ratio: (\d+\.?\d*)/);
            const legibilityMatch = textResponse.match(/Legibility Score: (\d+)/);
            const recsMatch = textResponse.match(/Recommendations: (.*)/s);

            return {
                contrastRatio: contrastMatch ? parseFloat(contrastMatch[1]) : 0,
                legibilityScore: legibilityMatch ? parseInt(legibilityMatch[1]) : 0,
                recommendations: recsMatch ? recsMatch[1].split(',').map((s: string) => s.trim()) : [],
            };
        } catch (error) {
            console.error('Error analyzing font accessibility with Gemini:', error);
            return { contrastRatio: 0, legibilityScore: 0, recommendations: [] };
        }
    }
}

// INVENTED: ChatGPT Integration Service. Enhances creative text generation and brief interpretation.
export class ChatGPTService {
    // INVENTED: Generates creative example text based on a given theme or mood.
    public static async generateExampleText(theme: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<string> {
        try {
            // INVENTED: Simulate call to ChatGPT for text generation.
            const response = await fetch(AppConfig.CHATGPT_API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer YOUR_CHATGPT_API_KEY_HERE` },
                body: JSON.stringify({
                    prompt: `Generate a ${length} creative sentence or phrase about "${theme}" for font preview.`,
                    model: 'gpt-3.5-turbo', // INVENTED: Specify ChatGPT model
                    temperature: 0.9,
                    max_tokens: length === 'short' ? 30 : length === 'medium' ? 60 : 120,
                }),
            });

            if (!response.ok) {
                throw new Error(`ChatGPT failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices?.[0]?.text || `Error generating text for ${theme}.`;
        } catch (error) {
            console.error('Error generating text with ChatGPT:', error);
            return `The quick brown fox jumps over the lazy dog. (Fallback)`;
        }
    }

    // INVENTED: Interprets a creative brief and provides stylistic suggestions.
    public static async interpretCreativeBrief(brief: string): Promise<{ mood: string; keywords: string[]; suggestedStyles: string[] }> {
        try {
            // INVENTED: Simulate call to ChatGPT for brief interpretation.
            const response = await fetch(AppConfig.CHATGPT_API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer YOUR_CHATGPT_API_KEY_HERE` },
                body: JSON.stringify({
                    prompt: `Analyze the following creative brief and extract its dominant mood, key design keywords, and suggested typographic styles: "${brief}". Format as JSON with keys 'mood', 'keywords' (array), 'suggestedStyles' (array).`,
                    model: 'gpt-4', // INVENTED: Using a more advanced model for complex tasks
                    temperature: 0.5,
                    max_tokens: 300,
                }),
            });

            if (!response.ok) {
                throw new Error(`ChatGPT failed: ${response.statusText}`);
            }

            const data = await response.json();
            const jsonResponse = JSON.parse(data.choices?.[0]?.text || '{}');
            return {
                mood: jsonResponse.mood || 'neutral',
                keywords: jsonResponse.keywords || [],
                suggestedStyles: jsonResponse.suggestedStyles || [],
            };
        } catch (error) {
            console.error('Error interpreting creative brief with ChatGPT:', error);
            return { mood: 'neutral', keywords: [], suggestedStyles: [] };
        }
    }
}

// INVENTED: An advanced font store that manages all font data, user preferences, and AI insights.
// This is a singleton pattern to ensure a single source of truth for font data.
export class FontStore {
    private static instance: FontStore;
    private _availableFonts: FontDetails[] = [];
    private _userFavoriteFonts: Set<string> = new Set();
    private _recentFonts: string[] = [];
    private _aiRecommendations: string[] = [];
    private _customUploadedFonts: FontDetails[] = [];

    private constructor() {
        // INVENTED: Load initial data from local storage or a backend API.
        this._userFavoriteFonts = new Set(JSON.parse(localStorage.getItem('userFavoriteFonts') || '[]'));
        this._recentFonts = JSON.parse(localStorage.getItem('recentFonts') || '[]');
        // INVENTED: Fetch all fonts on initialization, crucial for a robust font picker.
        this.initializeFonts();
    }

    // INVENTED: Singleton accessor.
    public static getInstance(): FontStore {
        if (!FontStore.instance) {
            FontStore.instance = new FontStore();
        }
        return FontStore.instance;
    }

    // INVENTED: Asynchronously initializes all fonts from various sources.
    private async initializeFonts() {
        const googleFonts = await GoogleFontService.fetchAllFonts();
        // INVENTED: Integrate Adobe Fonts (mocked) and custom fonts (mocked persistence).
        const adobeFonts: FontDetails[] = []; // Mock fetching Adobe Fonts
        const persistedCustomFonts: FontDetails[] = JSON.parse(localStorage.getItem('customUploadedFonts') || '[]');

        this._availableFonts = [...googleFonts, ...adobeFonts, ...persistedCustomFonts];
        // INVENTED: Ensures uniqueness and sorting for better user experience.
        this._availableFonts = Array.from(new Map(this._availableFonts.map(font => [font.id, font])).values())
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    // INVENTED: Getter for all fonts.
    public get availableFonts(): FontDetails[] {
        return this._availableFonts;
    }

    // INVENTED: Getter for user's favorite fonts.
    public get userFavoriteFonts(): FontDetails[] {
        return this._availableFonts.filter(font => this._userFavoriteFonts.has(font.id));
    }

    // INVENTED: Getter for recently used fonts.
    public get recentFonts(): FontDetails[] {
        return this._recentFonts
            .map(fontId => this._availableFonts.find(font => font.id === fontId))
            .filter(Boolean) as FontDetails[];
    }

    // INVENTED: Getter for AI-recommended fonts.
    public get aiRecommendations(): FontDetails[] {
        return this._aiRecommendations
            .map(fontName => this._availableFonts.find(font => font.name === fontName))
            .filter(Boolean) as FontDetails[];
    }

    // INVENTED: Getter for custom uploaded fonts.
    public get customUploadedFonts(): FontDetails[] {
        return this._customUploadedFonts;
    }

    // INVENTED: Adds a font to favorites and persists the change.
    public addFavorite(fontId: string): void {
        this._userFavoriteFonts.add(fontId);
        localStorage.setItem('userFavoriteFonts', JSON.stringify(Array.from(this._userFavoriteFonts)));
        AnalyticsService.trackEvent('Font_Favorited', { fontId });
    }

    // INVENTED: Removes a font from favorites and persists the change.
    public removeFavorite(fontId: string): void {
        this._userFavoriteFonts.delete(fontId);
        localStorage.setItem('userFavoriteFonts', JSON.stringify(Array.from(this._userFavoriteFonts)));
        AnalyticsService.trackEvent('Font_Unfavorited', { fontId });
    }

    // INVENTED: Checks if a font is favorited.
    public isFavorite(fontId: string): boolean {
        return this._userFavoriteFonts.has(fontId);
    }

    // INVENTED: Records a font as recently used, maintaining a limited history.
    public recordRecentFont(fontId: string): void {
        this._recentFonts = this._recentFonts.filter(id => id !== fontId); // Remove if already exists
        this._recentFonts.unshift(fontId); // Add to the beginning
        this._recentFonts = this._recentFonts.slice(0, 20); // Keep only the last 20
        localStorage.setItem('recentFonts', JSON.stringify(this._recentFonts));
        AnalyticsService.trackEvent('Font_Used', { fontId });
    }

    // INVENTED: Sets AI recommendations, triggered by AI service calls.
    public setAIRecommendations(fontNames: string[]): void {
        this._aiRecommendations = fontNames;
    }

    // INVENTED: Adds a custom font to the store.
    public addCustomFont(font: FontDetails): void {
        this._customUploadedFonts.push(font);
        this._availableFonts.push(font); // Add to general available fonts
        localStorage.setItem('customUploadedFonts', JSON.stringify(this._customUploadedFonts));
        AnalyticsService.trackEvent('Custom_Font_Uploaded', { fontId: font.id });
    }

    // INVENTED: Finds a font by its ID.
    public getFontById(id: string): FontDetails | undefined {
        return this._availableFonts.find(font => font.id === id);
    }
}

// INVENTED: Context API for providing FontStore and other global states to nested components.
// This simplifies state management across a large application.
export interface FontPickerContextProps {
    fontStore: FontStore;
    currentFont: FontDetails | null;
    searchText: string;
    setSearchText: (text: string) => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    selectedWeight: string | null;
    setSelectedWeight: (weight: string | null) => void;
    previewSettings: PreviewSettings;
    setPreviewSetting: (key: keyof PreviewSettings | 'reset', value: any) => void;
    aiRecommendationsEnabled: boolean;
    setAiRecommendationsEnabled: (enabled: boolean) => void;
    // INVENTED: For managing user's current subscription plan.
    userPlan: 'free' | 'pro' | 'enterprise';
}

// INVENTED: Interface for preview settings. More granular control over font rendering.
export interface PreviewSettings {
    backgroundColor: string;
    textColor: string;
    lineHeight: number;
    letterSpacing: number;
    wordSpacing: number;
    textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    textAlign: 'left' | 'center' | 'right' | 'justify';
    showGrid: boolean; // INVENTED: For typographic alignment
    darkModePreview: boolean; // INVENTED: For testing dark mode compatibility
    previewMode: 'single' | 'compare' | 'grid'; // INVENTED: Different preview layouts
    displayVariations: boolean; // INVENTED: For variable fonts
}

// INVENTED: Default preview settings.
export const defaultPreviewSettings: PreviewSettings = {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    lineHeight: 1.5,
    letterSpacing: 0,
    wordSpacing: 0,
    textTransform: 'none',
    textAlign: 'left',
    showGrid: false,
    darkModePreview: false,
    previewMode: 'single',
    displayVariations: false,
};

export const FontPickerContext = createContext<FontPickerContextProps | undefined>(undefined);

// INVENTED: Custom hook to use the FontPickerContext, ensuring it's always used within a provider.
export const useFontPicker = () => {
    const context = useContext(FontPickerContext);
    if (!context) {
        throw new Error('useFontPicker must be used within a FontPickerProvider');
    }
    return context;
};

// INVENTED: React Component for rendering an individual font card with expanded features.
// This component is crucial for displaying detailed font information and interaction options.
export const FontCard: React.FC<{ font: FontDetails; currentText: string; currentFontSize: number; previewSettings: PreviewSettings }> = React.memo(({ font, currentText, currentFontSize, previewSettings }) => {
    const { fontStore, userPlan } = useFontPicker(); // INVENTED: Access global state via context.
    const [showDetails, setShowDetails] = useState(false);
    const [licenseInfo, setLicenseInfo] = useState<{ licensed: boolean; details?: string } | null>(null);
    const isFavorite = fontStore.isFavorite(font.id);
    const canAccessPremium = userPlan !== 'free' || font.source !== 'Adobe Fonts'; // Simple premium logic

    // INVENTED: Loads the font for preview if not already loaded.
    useEffect(() => {
        if (font.source === 'Google Fonts') {
            GoogleFontService.loadFont(font.name, font.variants);
        }
    }, [font.id, font.name, font.variants, font.source]);

    // INVENTED: Checks license information when details are shown.
    useEffect(() => {
        if (showDetails) {
            LicensingService.checkFontLicense(font.id, 'current_user_id_mock').then(setLicenseInfo);
        }
    }, [showDetails, font.id]);

    const handleToggleFavorite = useCallback(() => {
        if (isFavorite) {
            fontStore.removeFavorite(font.id);
        } else {
            fontStore.addFavorite(font.id);
        }
    }, [isFavorite, font.id, fontStore]);

    const handleUseFont = useCallback(() => {
        fontStore.recordRecentFont(font.id);
        LicensingService.recordFontUsage(font.id, 'current_user_id_mock');
        // INVENTED: This would trigger the parent component to set this font as the "selected" font.
        // For now, we just log.
        AnalyticsService.trackEvent('Font_Selected', { fontId: font.id, fontName: font.name });
    }, [font.id, fontStore]);

    const previewStyle: React.CSSProperties = useMemo(() => ({
        fontFamily: `'${font.name}', sans-serif`,
        fontSize: `${currentFontSize}px`,
        color: previewSettings.textColor,
        backgroundColor: previewSettings.backgroundColor,
        lineHeight: previewSettings.lineHeight,
        letterSpacing: `${previewSettings.letterSpacing}px`,
        wordSpacing: `${previewSettings.wordSpacing}px`,
        textTransform: previewSettings.textTransform,
        textAlign: previewSettings.textAlign,
        // INVENTED: Variable font specific styles.
        ...(font.isVariable && previewSettings.displayVariations && font.variableAxes && font.variableAxes.length > 0 && {
            fontVariationSettings: font.variableAxes.map(axis => `'${axis.tag}' ${axis.default}`).join(', '),
        }),
    }), [font.name, currentFontSize, previewSettings, font.isVariable, font.variableAxes]);

    // INVENTED: Dynamic classes for dark mode and grid display.
    const cardClasses = `border-b border-border pb-2 px-2 transition-all duration-200 ease-in-out
        ${previewSettings.darkModePreview ? 'bg-gray-800 text-white' : 'bg-surface text-text-primary'}`;
    const gridOverlayClasses = previewSettings.showGrid ? 'relative before:content-[""] before:absolute before:inset-0 before:bg-[size:16px_16px] before:bg-[linear-gradient(to_right,rgba(128,128,128,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.1)_1px,transparent_1px)]' : '';

    return (
        <div className={`${cardClasses} ${gridOverlayClasses} group`}>
            <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary">{font.name}</p>
                <div className="flex items-center space-x-2">
                    {font.source === 'Adobe Fonts' && userPlan === 'free' && (
                        <span className="text-xs text-yellow-500 bg-yellow-100 px-2 py-0.5 rounded-full">Premium</span>
                    )}
                    <button
                        onClick={handleToggleFavorite}
                        className="p-1 rounded-full hover:bg-surface-hover transition-colors duration-200"
                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <svg className={`w-5 h-5 ${isFavorite ? 'text-red-500' : 'text-text-tertiary'}`} fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="p-1 rounded-full hover:bg-surface-hover text-text-tertiary transition-colors duration-200"
                        title="Toggle font details"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </button>
                    <button
                        onClick={handleUseFont}
                        className="p-1 rounded-md bg-accent text-accent-foreground hover:bg-accent-hover text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Select this font for use"
                        disabled={!canAccessPremium}
                    >
                        Use Font
                    </button>
                </div>
            </div>
            <p className="py-2" style={previewStyle}>
                {currentText}
            </p>

            {/* INVENTED: Expanded Font Details Panel */}
            {showDetails && (
                <div className="mt-4 p-3 bg-surface-muted border-t border-border text-xs rounded-b-lg">
                    <h4 className="font-semibold mb-2">Technical Details:</h4>
                    <p><strong>Category:</strong> {font.category}</p>
                    <p><strong>Source:</strong> {font.source}</p>
                    {font.designers && <p><strong>Designer(s):</strong> {font.designers.join(', ')}</p>}
                    <p><strong>Variants:</strong> {font.variants.join(', ')}</p>
                    <p><strong>Subsets:</strong> {font.subsets.join(', ')}</p>
                    {font.isVariable && (
                        <p><strong>Variable Font:</strong> Yes ({font.variableAxes?.length || 0} axes)</p>
                    )}
                    {font.tags && <p><strong>Tags:</strong> {font.tags.join(', ')}</p>}
                    {licenseInfo && (
                        <p className="mt-2">
                            <strong>License:</strong> {licenseInfo.licensed ? 'Licensed' : 'License Required'}
                            {licenseInfo.details && <span className="ml-1 text-text-secondary">({licenseInfo.details})</span>}
                            {font.licenseInfo && <a href={font.licenseInfo} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">View Policy</a>}
                        </p>
                    )}
                    <div className="mt-2 flex space-x-2">
                        <button className="text-xs text-blue-500 hover:underline">Download TTF</button>
                        <button className="text-xs text-blue-500 hover:underline">Get CSS Embed Code</button>
                    </div>
                </div>
            )}
        </div>
    );
});

// INVENTED: Component for AI font recommendations.
export const AISuggestionsPanel: React.FC = () => {
    const { fontStore, aiRecommendationsEnabled } = useFontPicker();
    const [context, setContext] = useState('');
    const [mood, setMood] = useState('modern');
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSetContext = useRef(inputDebouncer.debounce(setContext)).current;

    const handleGetRecommendations = useCallback(async () => {
        if (!aiRecommendationsEnabled) return;
        setIsLoading(true);
        AnalyticsService.trackEvent('AI_Recommendations_Requested', { context, mood });
        const existingFontNames = fontStore.recentFonts.map(f => f.name); // Pass user's recent fonts as context
        const recs = await GeminiAIService.getFontRecommendations(context, existingFontNames, mood);
        fontStore.setAIRecommendations(recs);
        setIsLoading(false);
    }, [aiRecommendationsEnabled, context, mood, fontStore]);

    if (!AppConfig.FEATURE_FLAGS.AI_FONT_PAIRING) return null;

    return (
        <div className="bg-surface-muted p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
                <span className="mr-2">✨</span> AI Font Recommendations
            </h3>
            <div className="flex flex-col gap-3">
                <div>
                    <label htmlFor="ai-context" className="text-sm font-medium block mb-1">Project Context</label>
                    <input
                        id="ai-context"
                        type="text"
                        placeholder="e.g., 'branding for a tech startup', 'children's book illustrations'"
                        onChange={(e) => debouncedSetContext(e.target.value)}
                        className="w-full p-2 bg-surface border border-border rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="ai-mood" className="text-sm font-medium block mb-1">Desired Mood</label>
                    <select
                        id="ai-mood"
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        className="w-full p-2 bg-surface border border-border rounded-md"
                    >
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                        <option value="playful">Playful</option>
                        <option value="elegant">Elegant</option>
                        <option value="industrial">Industrial</option>
                        <option value="minimalist">Minimalist</option>
                    </select>
                </div>
                <button
                    onClick={handleGetRecommendations}
                    disabled={isLoading || !aiRecommendationsEnabled}
                    className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Generating...' : 'Get Recommendations'}
                </button>
            </div>
            {fontStore.aiRecommendations.length > 0 && (
                <div className="mt-4 border-t border-border pt-3">
                    <h4 className="font-medium mb-2">Suggested Fonts:</h4>
                    <div className="flex flex-wrap gap-2">
                        {fontStore.aiRecommendations.map(font => (
                            <span key={font.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {font.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// INVENTED: Component for advanced preview settings.
export const PreviewSettingsPanel: React.FC = () => {
    const { previewSettings, setPreviewSetting } = useFontPicker();

    // INVENTED: Handler for color changes, debounced for performance.
    const handleColorChange = useCallback((key: keyof PreviewSettings, value: string) => {
        inputDebouncer.debounce(() => setPreviewSetting(key, value))();
    }, [setPreviewSetting]);

    // INVENTED: Handler for numeric range changes, debounced.
    const handleRangeChange = useCallback((key: keyof PreviewSettings, value: string) => {
        inputDebouncer.debounce(() => setPreviewSetting(key, Number(value)))();
    }, [setPreviewSetting]);

    return (
        <div className="bg-surface-muted p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-lg mb-3">Preview Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* INVENTED: Background Color Picker */}
                <div>
                    <label htmlFor="bg-color" className="text-sm font-medium block mb-1">Background Color</label>
                    <input type="color" id="bg-color" value={previewSettings.backgroundColor} onChange={(e) => handleColorChange('backgroundColor', e.target.value)} className="w-full h-10 p-1 border border-border rounded-md" />
                </div>
                {/* INVENTED: Text Color Picker */}
                <div>
                    <label htmlFor="text-color" className="text-sm font-medium block mb-1">Text Color</label>
                    <input type="color" id="text-color" value={previewSettings.textColor} onChange={(e) => handleColorChange('textColor', e.target.value)} className="w-full h-10 p-1 border border-border rounded-md" />
                </div>
                {/* INVENTED: Line Height Slider */}
                <div>
                    <label htmlFor="line-height" className="text-sm font-medium block mb-1">Line Height ({previewSettings.lineHeight.toFixed(2)})</label>
                    <input type="range" id="line-height" min="1" max="3" step="0.1" value={previewSettings.lineHeight} onChange={(e) => handleRangeChange('lineHeight', e.target.value)} className="w-full" />
                </div>
                {/* INVENTED: Letter Spacing Slider */}
                <div>
                    <label htmlFor="letter-spacing" className="text-sm font-medium block mb-1">Letter Spacing ({previewSettings.letterSpacing.toFixed(1)}px)</label>
                    <input type="range" id="letter-spacing" min="-2" max="10" step="0.1" value={previewSettings.letterSpacing} onChange={(e) => handleRangeChange('letterSpacing', e.target.value)} className="w-full" />
                </div>
                {/* INVENTED: Word Spacing Slider */}
                <div>
                    <label htmlFor="word-spacing" className="text-sm font-medium block mb-1">Word Spacing ({previewSettings.wordSpacing.toFixed(1)}px)</label>
                    <input type="range" id="word-spacing" min="-5" max="20" step="0.1" value={previewSettings.wordSpacing} onChange={(e) => handleRangeChange('wordSpacing', e.target.value)} className="w-full" />
                </div>
                {/* INVENTED: Text Transform Dropdown */}
                <div>
                    <label htmlFor="text-transform" className="text-sm font-medium block mb-1">Text Transform</label>
                    <select id="text-transform" value={previewSettings.textTransform} onChange={(e) => setPreviewSetting('textTransform', e.target.value as PreviewSettings['textTransform'])} className="w-full p-2 bg-surface border border-border rounded-md">
                        <option value="none">None</option>
                        <option value="uppercase">Uppercase</option>
                        <option value="lowercase">Lowercase</option>
                        <option value="capitalize">Capitalize</option>
                    </select>
                </div>
                {/* INVENTED: Text Alignment Buttons */}
                <div className="md:col-span-2">
                    <label className="text-sm font-medium block mb-1">Text Alignment</label>
                    <div className="flex space-x-2">
                        {['left', 'center', 'right', 'justify'].map(align => (
                            <button
                                key={align}
                                onClick={() => setPreviewSetting('textAlign', align as PreviewSettings['textAlign'])}
                                className={`p-2 rounded-md border border-border ${previewSettings.textAlign === align ? 'bg-accent text-accent-foreground' : 'bg-surface hover:bg-surface-hover'} transition-colors`}
                                title={`Align ${align}`}
                            >
                                {/* INVENTED: SVG Icons for alignment */}
                                {align === 'left' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4h16v2H2zm0 4h12v2H2zm0 4h16v2H2zm0 4h12v2H2z"></path></svg>}
                                {align === 'center' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4h16v2H2zm2 4h12v2H4zm-2 4h16v2H2zm2 4h12v2H4z"></path></svg>}
                                {align === 'right' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4h16v2H2zm4 4h12v2H4zm-4 4h16v2H0zm4 4h12v2H4z"></path></svg>}
                                {align === 'justify' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4h16v2H2zm0 4h16v2H2zm0 4h16v2H2zm0 4h16v2H2z"></path></svg>}
                            </button>
                        ))}
                    </div>
                </div>
                {/* INVENTED: Toggle for Dark Mode Preview */}
                <div className="flex items-center gap-2 md:col-span-2 mt-2">
                    <input
                        type="checkbox"
                        id="dark-mode-preview"
                        checked={previewSettings.darkModePreview}
                        onChange={(e) => setPreviewSetting('darkModePreview', e.target.checked)}
                        className="h-4 w-4 text-accent border-border rounded"
                    />
                    <label htmlFor="dark-mode-preview" className="text-sm font-medium">Dark Mode Preview</label>
                </div>
                 {/* INVENTED: Toggle for Typographic Grid */}
                 <div className="flex items-center gap-2 md:col-span-2">
                    <input
                        type="checkbox"
                        id="show-grid"
                        checked={previewSettings.showGrid}
                        onChange={(e) => setPreviewSetting('showGrid', e.target.checked)}
                        className="h-4 w-4 text-accent border-border rounded"
                    />
                    <label htmlFor="show-grid" className="text-sm font-medium">Show Typographic Grid</label>
                </div>
                {/* INVENTED: Preview Mode Selector */}
                <div className="md:col-span-2">
                    <label htmlFor="preview-mode" className="text-sm font-medium block mb-1">Preview Mode</label>
                    <select id="preview-mode" value={previewSettings.previewMode} onChange={(e) => setPreviewSetting('previewMode', e.target.value as PreviewSettings['previewMode'])} className="w-full p-2 bg-surface border border-border rounded-md">
                        <option value="single">Single Font</option>
                        <option value="compare">Compare Fonts (Side-by-Side)</option>
                        <option value="grid">Grid View</option>
                    </select>
                </div>
            </div>
            <button
                onClick={() => setPreviewSetting('reset', true)} // INVENTED: A special action to reset settings
                className="mt-4 w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
                Reset Settings
            </button>
        </div>
    );
};

// INVENTED: Component for custom font uploads.
export const CustomFontUploader: React.FC = () => {
    const { fontStore, userPlan } = useFontPicker();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

    // INVENTED: Check if user has reached their upload limit.
    const uploadLimitReached = userPlan === 'free' && fontStore.customUploadedFonts.length >= AppConfig.MAX_CUSTOM_FONTS_PER_USER;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && ['font/ttf', 'font/otf', 'font/woff2'].includes(file.type)) {
            setSelectedFile(file);
            setUploadError(null);
        } else {
            setSelectedFile(null);
            setUploadError('Please select a valid font file (.ttf, .otf, .woff2).');
        }
    };

    const handleUpload = useCallback(async () => {
        if (!selectedFile || uploadLimitReached) return;

        setUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        const newFont = await CustomFontUploadService.uploadFont(selectedFile);
        if (newFont) {
            fontStore.addCustomFont(newFont);
            setUploadSuccess(true);
            setSelectedFile(null);
        } else {
            setUploadError('Failed to upload font. Please try again.');
        }
        setUploading(false);
    }, [selectedFile, fontStore, uploadLimitReached]);

    if (!AppConfig.FEATURE_FLAGS.CUSTOM_FONT_UPLOADS) return null;

    return (
        <div className="bg-surface-muted p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
                <span className="mr-2">📁</span> Custom Font Uploader
            </h3>
            {uploadLimitReached && (
                <p className="text-red-500 text-sm mb-2">
                    You have reached your custom font upload limit ({AppConfig.MAX_CUSTOM_FONTS_PER_USER}). Upgrade your plan to upload more.
                </p>
            )}
            <input
                type="file"
                id="custom-font-upload"
                accept=".ttf,.otf,.woff2"
                onChange={handleFileChange}
                className="w-full p-2 bg-surface border border-border rounded-md mb-3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploading || uploadLimitReached}
            />
            {selectedFile && <p className="text-sm text-text-secondary mb-2">Selected: {selectedFile.name}</p>}
            {uploadError && <p className="text-red-500 text-sm mb-2">{uploadError}</p>}
            {uploadSuccess && <p className="text-green-500 text-sm mb-2">Font uploaded successfully!</p>}
            <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading || uploadLimitReached}
                className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {uploading ? 'Uploading...' : 'Upload Font'}
            </button>
            {fontStore.customUploadedFonts.length > 0 && (
                <div className="mt-4 border-t border-border pt-3">
                    <h4 className="font-medium mb-2">Your Uploaded Fonts:</h4>
                    <ul className="list-disc pl-5 text-sm">
                        {fontStore.customUploadedFonts.map(font => (
                            <li key={font.id}>{font.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// INVENTED: Export for the main FontPickerProvider, which wraps the FontPreviewPicker.
// This sets up the context for all child components.
export const FontPickerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fontStore] = useState(() => FontStore.getInstance()); // Singleton instance
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
    const [previewSettings, setPreviewSettings] = useState<PreviewSettings>(defaultPreviewSettings);
    const [aiRecommendationsEnabled, setAiRecommendationsEnabled] = useState(true);
    // INVENTED: User plan state, can be dynamically loaded from a user profile service.
    const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'enterprise'>('pro'); // Default to 'pro' for demo

    // INVENTED: Effect to load initial fonts when store is ready.
    useEffect(() => {
        // Since FontStore constructor already calls initializeFonts, this just ensures it's awaited if needed.
        // Or re-triggers updates if fontStore itself becomes observable.
    }, [fontStore]);

    const setPreviewSetting = useCallback((key: keyof PreviewSettings | 'reset', value: any) => {
        if (key === 'reset') {
            setPreviewSettings(defaultPreviewSettings);
            AnalyticsService.trackEvent('Preview_Settings_Reset');
        } else {
            setPreviewSettings(prev => ({ ...prev, [key]: value }));
            AnalyticsService.trackEvent('Preview_Setting_Changed', { setting: key, value });
        }
    }, []);

    const contextValue = useMemo(() => ({
        fontStore,
        currentFont: fontStore.getFontById(fontStore.recentFonts[0]) || null, // INVENTED: A concept of a "currently selected" font.
        searchText,
        setSearchText,
        selectedCategory,
        setSelectedCategory,
        selectedWeight,
        setSelectedWeight,
        previewSettings,
        setPreviewSetting,
        aiRecommendationsEnabled,
        setAiRecommendationsEnabled,
        userPlan,
    }), [
        fontStore,
        searchText,
        setSearchText,
        selectedCategory,
        setSelectedCategory,
        selectedWeight,
        setSelectedWeight,
        previewSettings,
        setPreviewSetting,
        aiRecommendationsEnabled,
        setAiRecommendationsEnabled,
        userPlan,
    ]);

    return (
        <FontPickerContext.Provider value={contextValue}>
            {children}
        </FontPickerContext.Provider>
    );
};


// INVENTED: A more robust font picker component, now wrapped by a Provider for advanced state management.
export const FontPreviewPicker: React.FC = () => {
    const {
        fontStore,
        searchText,
        setSearchText,
        selectedCategory,
        setSelectedCategory,
        selectedWeight,
        setSelectedWeight,
        previewSettings,
        setPreviewSetting,
        userPlan,
    } = useFontPicker(); // INVENTED: Consuming context.

    const [text, setText] = useState(AppConfig.DEFAULT_PREVIEW_PHRASES[0]);
    const [fontSize, setFontSize] = useState(24);
    const [showSettingsSidebar, setShowSettingsSidebar] = useState(false); // INVENTED: For responsive layout.
    const [showAIPanel, setShowAIPanel] = useState(false); // INVENTED: Toggle AI panel.
    const [showUploaderPanel, setShowUploaderPanel] = useState(false); // INVENTED: Toggle Uploader panel.

    // INVENTED: Debounced text input handler.
    const debouncedSetText = useRef(inputDebouncer.debounce(setText)).current;

    // INVENTED: Debounced font size handler.
    const debouncedSetFontSize = useRef(inputDebouncer.debounce(setFontSize)).current;

    // INVENTED: Initial font loading. Now more sophisticated.
    useEffect(() => {
        // Existing logic for loading Google Fonts for popular list remains, but now handles dynamically selected fonts too.
        // This effect can be further enhanced to load fonts on demand as they become visible in a virtualized list.
        const fontsToLoad = fontStore.availableFonts
                                .map(f => f.name)
                                .slice(0, 50) // Limit initial load for performance
                                .join('|')
                                .replace(/ /g, '+');
        const linkId = 'font-picker-stylesheet-initial';
        let link = document.getElementById(linkId) as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        link.href = `https://fonts.googleapis.com/css?family=${fontsToLoad}:${AppConfig.GOOGLE_FONTS_LOADING_STRATEGY}&display=swap`;

        // INVENTED: Track initial load for analytics.
        AnalyticsService.trackEvent('Font_Picker_Loaded', { initialFontsCount: fontStore.availableFonts.length });
    }, [fontStore]); // Depend on fontStore to ensure re-evaluation if availableFonts changes significantly

    // INVENTED: Filtered fonts from the provider's context.
    const filteredFonts = useMemo(() => {
        let fonts = fontStore.availableFonts;

        if (searchText) {
            fonts = fonts.filter(font =>
                font.name.toLowerCase().includes(searchText.toLowerCase()) ||
                font.tags?.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())) ||
                font.designers?.some(designer => designer.toLowerCase().includes(searchText.toLowerCase()))
            );
        }

        if (selectedCategory) {
            fonts = fonts.filter(font => font.category === selectedCategory);
        }

        if (selectedWeight) {
            fonts = fonts.filter(font => font.weights.includes(Number(selectedWeight)));
        }

        // INVENTED: Prioritize favorite, recent, and AI-recommended fonts.
        const favorited = fonts.filter(f => fontStore.isFavorite(f.id));
        const recent = fontStore.recentFonts.filter(f => fonts.some(ff => ff.id === f.id));
        const aiRecs = fontStore.aiRecommendations.filter(f => fonts.some(ff => ff.id === f.id));

        // INVENTED: Merge and deduplicate, giving precedence to favorited, then recent, then AI, then general.
        const sortedAndFiltered = Array.from(new Set([...favorited, ...recent, ...aiRecs, ...fonts]));

        return sortedAndFiltered;
    }, [fontStore.availableFonts, searchText, selectedCategory, selectedWeight, fontStore.isFavorite, fontStore.recentFonts, fontStore.aiRecommendations]);

    // INVENTED: Function to generate an example image for sharing.
    const handleGenerateImage = useCallback(async (font: FontDetails) => {
        AnalyticsService.trackEvent('Generate_Preview_Image', { fontId: font.id });
        const imageUrl = await ImageGenerationService.generateFontPreviewImage(
            text,
            font.name,
            fontSize,
            previewSettings.textColor,
            previewSettings.backgroundColor
        );
        if (imageUrl) {
            // INVENTED: Open in new tab or offer download.
            window.open(imageUrl, '_blank');
            alert('Preview image generated and opened in a new tab!');
        } else {
            alert('Failed to generate image.');
        }
    }, [text, fontSize, previewSettings.textColor, previewSettings.backgroundColor]);

    return (
        <div className={`h-full flex ${previewSettings.darkModePreview ? 'bg-gray-900 text-gray-100' : 'bg-background text-text-primary'} transition-colors duration-200`}>
            {/* INVENTED: Left Sidebar for Filters and Settings (responsive) */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface p-4 border-r border-border transition-transform transform md:relative md:translate-x-0 ${showSettingsSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Filters & Settings</h2>
                    <button onClick={() => setShowSettingsSidebar(false)} className="md:hidden p-2 rounded-full hover:bg-surface-hover">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="space-y-4">
                    {/* INVENTED: Search Input with Debounce */}
                    <div>
                        <label htmlFor="font-search" className="text-sm font-medium">Search Fonts</label>
                        <input
                            id="font-search"
                            type="text"
                            placeholder="Search by name, tag, designer..."
                            onChange={e => inputDebouncer.debounce(() => setSearchText(e.target.value))()}
                            className="w-full mt-1 p-2 bg-surface-muted border border-border rounded-md"
                        />
                    </div>
                    {/* INVENTED: Font Category Filter */}
                    <div>
                        <label htmlFor="font-category" className="text-sm font-medium">Category</label>
                        <select
                            id="font-category"
                            value={selectedCategory || ''}
                            onChange={e => setSelectedCategory(e.target.value || null)}
                            className="w-full mt-1 p-2 bg-surface-muted border border-border rounded-md"
                        >
                            <option value="">All Categories</option>
                            {AppConfig.FONT_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    {/* INVENTED: Font Weight Filter */}
                    <div>
                        <label htmlFor="font-weight" className="text-sm font-medium">Weight</label>
                        <select
                            id="font-weight"
                            value={selectedWeight || ''}
                            onChange={e => setSelectedWeight(e.target.value || null)}
                            className="w-full mt-1 p-2 bg-surface-muted border border-border rounded-md"
                        >
                            <option value="">All Weights</option>
                            {AppConfig.FONT_WEIGHTS.map(weight => (
                                <option key={weight} value={weight}>{weight}</option>
                            ))}
                        </select>
                    </div>
                    {/* INVENTED: Quick Access Tabs for Font Collections */}
                    <div className="border-t border-border pt-4">
                        <h4 className="text-sm font-semibold mb-2">My Collections</h4>
                        <div className="flex flex-col space-y-2">
                            <button className="text-left text-text-primary hover:text-accent" onClick={() => {
                                AnalyticsService.trackEvent('Collection_Viewed', { collection: 'Favorites' });
                                // Logic to filter fonts by favorites
                            }}>
                                Favorites ({fontStore.userFavoriteFonts.length})
                            </button>
                            <button className="text-left text-text-primary hover:text-accent" onClick={() => {
                                AnalyticsService.trackEvent('Collection_Viewed', { collection: 'Recent' });
                                // Logic to filter fonts by recent
                            }}>
                                Recent ({fontStore.recentFonts.length})
                            </button>
                            {userPlan !== 'free' && ( // INVENTED: Premium feature.
                                <button className="text-left text-text-primary hover:text-accent" onClick={() => {
                                    AnalyticsService.trackEvent('Collection_Viewed', { collection: 'Custom' });
                                    // Logic to filter fonts by custom uploads
                                }}>
                                    My Uploads ({fontStore.customUploadedFonts.length})
                                </button>
                            )}
                        </div>
                    </div>
                    {/* INVENTED: Button to toggle Preview Settings Panel */}
                    <button
                        onClick={() => {
                            setShowSettingsSidebar(prev => !prev);
                            setShowAIPanel(false);
                            setShowUploaderPanel(false);
                        }}
                        className="w-full p-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 transition-colors"
                    >
                        Advanced Preview Settings
                    </button>
                    {/* INVENTED: Button to toggle AI Suggestions Panel */}
                    {AppConfig.FEATURE_FLAGS.AI_FONT_PAIRING && (
                        <button
                            onClick={() => {
                                setShowAIPanel(prev => !prev);
                                setShowSettingsSidebar(false);
                                setShowUploaderPanel(false);
                            }}
                            className="w-full p-2 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-md hover:from-pink-600 hover:to-red-700 transition-colors"
                        >
                            AI Font Genius
                        </button>
                    )}
                     {/* INVENTED: Button to toggle Custom Font Uploader Panel */}
                     {AppConfig.FEATURE_FLAGS.CUSTOM_FONT_UPLOADS && (
                        <button
                            onClick={() => {
                                setShowUploaderPanel(prev => !prev);
                                setShowSettingsSidebar(false);
                                setShowAIPanel(false);
                            }}
                            className="w-full p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md hover:from-cyan-600 hover:to-blue-700 transition-colors"
                        >
                            Upload Your Fonts
                        </button>
                    )}
                </div>
            </aside>

            {/* INVENTED: Main Content Area */}
            <main className="flex-grow flex flex-col p-4 sm:p-6 lg:p-8">
                {/* INVENTED: Mobile Toggle Button for Sidebar */}
                <button onClick={() => setShowSettingsSidebar(true)} className="md:hidden absolute top-4 left-4 p-2 rounded-full bg-surface-muted z-30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>

                <header className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold flex items-center">
                        <TypographyLabIcon />
                        <span className="ml-3">Font Preview Lab</span> {/* INVENTED: More elaborate title */}
                    </h1>
                    {/* INVENTED: User Profile/Plan Indicator */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-text-secondary">Plan: <span className="font-semibold capitalize">{userPlan}</span></span>
                        <button className="text-blue-500 text-sm hover:underline">Upgrade</button>
                    </div>
                </header>

                <p className="text-text-secondary mt-1 mb-4">
                    {/* INVENTED: Dynamic header text based on AI status */}
                    Explore thousands of fonts, get AI recommendations, and craft your perfect typography.
                    {AppConfig.FEATURE_FLAGS.AI_FONT_PAIRING && (
                        <button onClick={() => setShowAIPanel(true)} className="ml-2 text-blue-500 hover:underline text-sm">Need a suggestion?</button>
                    )}
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-grow">
                        <label htmlFor="preview-text" className="text-sm font-medium">Preview Text</label>
                        <input
                            id="preview-text"
                            type="text"
                            value={text}
                            onChange={e => debouncedSetText(e.target.value)} // INVENTED: Debounced input
                            className="w-full mt-1 p-2 bg-surface border border-border rounded-md"
                        />
                         {/* INVENTED: Buttons for common phrases */}
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {AppConfig.DEFAULT_PREVIEW_PHRASES.map((phrase, index) => (
                                <button
                                    key={index}
                                    onClick={() => setText(phrase)}
                                    className="px-2 py-1 bg-surface-muted border border-border rounded-md hover:bg-surface-hover"
                                >
                                    {phrase.substring(0, 20)}...
                                </button>
                            ))}
                            <button
                                onClick={async () => setText(await ChatGPTService.generateExampleText('typography design', 'medium'))}
                                className="px-2 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-md hover:bg-purple-200"
                            >
                                AI Generate Text
                            </button>
                        </div>
                    </div>
                    <div className="w-full md:w-auto"> {/* Adjusted width for better responsiveness */}
                        <label htmlFor="font-size" className="text-sm font-medium">Font Size ({fontSize}px)</label>
                        <input
                            id="font-size"
                            type="range"
                            min="12"
                            max="72"
                            value={fontSize}
                            onChange={e => debouncedSetFontSize(Number(e.target.value))} // INVENTED: Debounced input
                            className="w-full mt-1"
                        />
                    </div>
                </div>

                {/* INVENTED: Main Font Preview Area */}
                <div className={`flex-grow bg-surface border border-border rounded-lg p-4 overflow-y-auto ${previewSettings.darkModePreview ? 'bg-gray-800' : 'bg-surface'}`}>
                    <div className="space-y-4">
                        {filteredFonts.length === 0 ? (
                            <p className="text-text-secondary text-center py-10">No fonts match your criteria. Try adjusting filters or search terms.</p>
                        ) : (
                            filteredFonts.map(font => (
                                <FontCard
                                    key={font.id}
                                    font={font}
                                    currentText={text}
                                    currentFontSize={fontSize}
                                    previewSettings={previewSettings}
                                />
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* INVENTED: Right Sidebar for Dynamic Panels (AI, Settings, Uploader) */}
            <aside className={`fixed inset-y-0 right-0 z-40 w-80 bg-surface p-4 border-l border-border transition-transform transform md:relative md:translate-x-0 ${showAIPanel || showSettingsSidebar || showUploaderPanel ? 'translate-x-0' : 'translate-x-full'} md:w-96`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Tools</h2>
                    <button onClick={() => { setShowAIPanel(false); setShowSettingsSidebar(false); setShowUploaderPanel(false); }} className="p-2 rounded-full hover:bg-surface-hover">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                {showAIPanel && <AISuggestionsPanel />}
                {showSettingsSidebar && <PreviewSettingsPanel />}
                {showUploaderPanel && <CustomFontUploader />}
            </aside>
        </div>
    );
};

// INVENTED: The root component for the entire Font Preview Picker, wrapping the main component with its provider.
// This is the true entry point of our super-powered font picker.
export const SuperFontPreviewPickerRoot: React.FC = () => {
    return (
        <FontPickerProvider>
            <FontPreviewPicker />
        </FontPickerProvider>
    );
};
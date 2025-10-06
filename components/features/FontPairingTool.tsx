// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

// This feature is an alias for the Typography Lab.
// Re-exporting it here to keep the codebase DRY while satisfying the feature registry.
// This original export ensures backward compatibility and maintains the foundational link to TypographyLab.
export { TypographyLab as FontPairingTool } from './TypographyLab.tsx';

// BEGIN: The Great Expansion of Type Intelligence
//
// Storyline:
// In the year 2024, James Burvel O’Callaghan III, a visionary leader at Citibank Demo Business Inc.,
// recognized a critical need: the existing 'FontPairingTool' (an alias for 'TypographyLab')
// was powerful for basic typographic exploration but lacked the enterprise-grade intelligence,
// automation, and deep integration required for a truly commercial, global design operation.
// He commissioned Project "Type-Intelligence Nexus" (TIN), aiming to transform a simple alias
// into a sprawling, AI-powered font ecosystem. This file, 'FontPairingTool.tsx', was chosen
// as the nexus point for this monumental expansion, leveraging its strategic position
// within the 'features' directory.
//
// The goal was audacious: integrate cutting-edge AI (Gemini, ChatGPT), hundreds of specialized
// services, and a robust architecture capable of managing typography across thousands of
// brands, regions, and digital touchpoints. This is the story of how TIN evolved,
// layer by layer, into the 'EnterpriseFontDesignStudio' - a testament to innovation
// and the relentless pursuit of design excellence at scale.

// Invented Module 1: Core Utilities and Constants
// Purpose: Provide foundational types, enums, and constants for the entire Type-Intelligence Nexus.
// This ensures type safety and consistency across the myriad features.

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  ReactNode,
} from 'react';
import { produce } from 'immer'; // Invented External Service 1: Immer for immutable state updates. (Simulated import)
import debounce from 'lodash.debounce'; // Invented External Service 2: Lodash Debounce for performance. (Simulated import)
import { v4 as uuidv4 } from 'uuid'; // Invented External Service 3: UUID for unique IDs. (Simulated import)
import * as D3 from 'd3'; // Invented External Service 4: D3 for advanced visualizations. (Simulated import)
import confetti from 'canvas-confetti'; // Invented External Service 5: Canvas Confetti for celebratory UI. (Simulated import)
import moment from 'moment'; // Invented External Service 6: Moment.js for date/time utilities. (Simulated import)
import { AnimatePresence, motion } from 'framer-motion'; // Invented External Service 7: Framer Motion for animations. (Simulated import)

// --- TYPE-INTELLIGENCE NEXUS (TIN) Core Infrastructure ---

// Invented Feature 1: Font Classification System (FCS)
// A highly granular system for categorizing fonts, beyond basic serif/sans-serif.
export enum FontStyleClassification {
  SERIF = 'Serif',
  SANS_SERIF = 'Sans-Serif',
  DISPLAY = 'Display',
  SCRIPT = 'Script',
  MONOSPACE = 'Monospace',
  DECORATIVE = 'Decorative',
  HANDWRITING = 'Handwriting',
  GEOMETRIC_SANS = 'Geometric Sans',
  HUMANIST_SANS = 'Humanist Sans',
  GROTESQUE_SANS = 'Grotesque Sans',
  OLD_STYLE_SERIF = 'Old Style Serif',
  TRANSITIONAL_SERIF = 'Transitional Serif',
  MODERN_SERIF = 'Modern Serif',
  SLAB_SERIF = 'Slab Serif',
  CALLIGRAPHIC = 'Calligraphic',
  BLACKLETTER = 'Blackletter',
  TYPEWRITER = 'Typewriter',
  PICTORIAL = 'Pictorial', // For icon fonts or highly illustrative fonts
}

// Invented Feature 2: Font Mood & Contextual Tags (FMCT)
// AI-driven tags to describe the emotional and contextual suitability of a font.
export enum FontMoodTag {
  PROFESSIONAL = 'Professional',
  ELEGANT = 'Elegant',
  PLAYFUL = 'Playful',
  MODERN = 'Modern',
  CLASSIC = 'Classic',
  FORMAL = 'Formal',
  FRIENDLY = 'Friendly',
  TRUSTWORTHY = 'Trustworthy',
  CREATIVE = 'Creative',
  BOLD = 'Bold',
  SUBTLE = 'Subtle',
  LUXURY = 'Luxury',
  TECHY = 'Techy',
  VINTAGE = 'Vintage',
  MINIMALIST = 'Minimalist',
  APPROACHABLE = 'Approachable',
  AUTHORITATIVE = 'Authoritative',
  ENERGETIC = 'Energetic',
  CALM = 'Calm',
}

// Invented Feature 3: Font Usage Context (FUC)
// Defines typical application areas for fonts, aiding AI recommendations.
export enum FontUsageContext {
  HEADLINE = 'Headline',
  BODY_TEXT = 'Body Text',
  SUBHEADING = 'Subheading',
  CALL_TO_ACTION = 'Call to Action',
  LOGO = 'Logo',
  BRANDING = 'Branding',
  UI_ELEMENT = 'UI Element',
  PRINT = 'Print',
  WEB = 'Web',
  MOBILE_APP = 'Mobile App',
  PRESENTATION = 'Presentation',
  SIGNAGE = 'Signage',
  EDITORIAL = 'Editorial',
  ADVERTISING = 'Advertising',
  GAMING = 'Gaming',
  FINANCIAL_REPORT = 'Financial Report',
  MEDICAL_DOCUMENT = 'Medical Document',
}

// Invented Feature 4: Brand Identity Parameters (BIP)
// Structured data for defining a brand's visual and tonal identity.
export interface BrandIdentity {
  id: string;
  name: string;
  industry: string;
  targetAudience: string[];
  coreValues: string[];
  brandTone: FontMoodTag[];
  primaryColors: string[]; // Hex codes
  secondaryColors: string[];
  typographyGuidelinesId?: string; // Link to specific guidelines document
}

// Invented Feature 5: Font Metric Data (FMD)
// Comprehensive metrics for each font, critical for AI analysis and rendering.
export interface FontMetrics {
  xHeight: number;
  capHeight: number;
  ascender: number;
  descender: number;
  lineHeight: number; // default
  avgCharWidth: number;
  minCharWidth: number;
  maxCharWidth: number;
  slant: number; // in degrees
  contrastRatio: number; // internal contrast of strokes
  readabilityScore: number; // AI-computed score
  legibilityScore: number; // AI-computed score
  kerningPairs: { [key: string]: number }; // Specific kerning data
  ligatureSupport: string[]; // List of supported ligatures
}

// Invented Feature 6: Font Asset Metadata (FAM)
// Detailed information about a font file, including licensing and performance data.
export interface FontAsset {
  id: string;
  name: string;
  fileName: string;
  version: string;
  foundry: string;
  designer: string[];
  licenseType: 'Commercial' | 'Open Source' | 'Trial' | 'Enterprise';
  licenseKey?: string; // For commercial licenses
  licenseExpires?: string; // ISO date string
  fileSizeKB: number;
  cdnUrl?: string; // For hosted fonts
  localPath?: string; // For locally managed fonts
  tags: string[]; // User-defined tags
  classification: FontStyleClassification[];
  supportedLanguages: string[];
  moodTags: FontMoodTag[]; // AI-inferred or manually assigned
  metrics: FontMetrics;
  lastUpdated: string; // ISO date string
  checksum: string; // For integrity verification
}

// Invented Feature 7: Font Pairing Definition (FPD)
// Represents a single recommended font pairing.
export interface FontPairing {
  id: string;
  headlineFontId: string;
  bodyFontId: string;
  subheadingFontId?: string;
  displayFontId?: string;
  rationale: string; // AI-generated or expert-curated
  compatibilityScore: number; // AI-computed score (0-100)
  aestheticsScore: number; // AI-computed score (0-100)
  readabilityScore: number; // AI-computed score (0-100)
  contextSuitability: {
    context: FontUsageContext;
    score: number;
    reason: string;
  }[];
  isApproved: boolean; // For enterprise approval workflows
  approvedBy?: string;
  approvedDate?: string;
  comments: { userId: string; comment: string; timestamp: string }[];
  associatedBrandId?: string; // If this pairing is specific to a brand
  lastModified: string;
}

// Invented Feature 8: User Preferences and Context (UPC)
// Captures user-specific settings, design project context, and historical data.
export interface UserPreferences {
  theme: 'light' | 'dark';
  accessibilityMode: boolean;
  preferredClassifications: FontStyleClassification[];
  preferredMoods: FontMoodTag[];
  favoriteFonts: string[]; // Font IDs
  recentPairings: string[]; // Pairing IDs
  activeProjectID?: string;
}

// Invented Feature 9: Design System Integration (DSI) Configuration
export interface DesignSystemConfig {
  name: string;
  version: string;
  integrationType: 'Figma' | 'Storybook' | 'Custom CMS';
  apiUrl: string;
  syncFrequency: 'realtime' | 'daily' | 'weekly';
  lastSyncDate: string;
  // Mappings for design token standards (e.g., style-dictionary)
  tokenMappings: {
    fontFamily: string;
    fontSizeBase: string;
    lineHeightBase: string;
    fontWeightBase: string;
  };
}

// Invented Feature 10: Performance Monitoring Configuration (PMC)
export interface PerformanceMonitoringConfig {
  provider: 'Google Analytics' | 'Datadog' | 'Custom';
  trackingId: string;
  eventCategories: {
    fontLoad: string;
    fontRender: string;
    fontInteraction: string;
  };
  thresholds: {
    maxLoadTimeMs: number;
    maxRenderTimeMs: number;
  };
}

// Invented Module 2: AI & ML Services Integration Layer
// Purpose: Standardize interactions with external AI models (Gemini, ChatGPT)
// and internal ML models for enhanced font intelligence.

export enum AIServiceProvider {
  GEMINI = 'Google Gemini',
  CHATGPT = 'OpenAI ChatGPT',
  AZURE_AI = 'Azure AI',
  AWS_SAGEMAKER = 'AWS Sagemaker',
  HUGGINGFACE = 'HuggingFace',
  CUSTOM_ML = 'Custom ML Model',
}

export interface AIRequestOptions {
  model: string; // e.g., "gemini-pro", "gpt-4"
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
  provider: AIServiceProvider;
}

// Invented Feature 11: AI-Powered Font Analyzer (AIFA)
// Analyzes font characteristics, suggests tags, and computes metrics using AI vision.
export interface FontAnalysisResult {
  fontId: string;
  detectedClassification: FontStyleClassification[];
  inferredMoodTags: FontMoodTag[];
  readabilityImprovements: string[];
  legibilityIssues: string[];
  culturalContextSuitability: { region: string; score: number; notes: string }[];
  sentimentScore: number; // How "positive" or "negative" the font feels
  brandingAlignmentScore: number;
}

// Invented Feature 12: AI-Powered Pairing Suggestion Engine (AIPSE)
// Leverages Gemini/ChatGPT to generate font pairing recommendations.
export interface PairingSuggestionParameters {
  brandIdentity: BrandIdentity;
  context: FontUsageContext;
  targetMoods: FontMoodTag[];
  existingTextSample?: string; // To analyze stylistic needs
  preferredClassifications?: FontStyleClassification[];
  exclusionList?: string[]; // Font IDs to exclude
  numSuggestions: number;
}

// Invented Feature 13: Accessibility & Compliance Checker (ACC)
// Uses AI to evaluate font pairings against WCAG and other accessibility standards.
export interface AccessibilityReport {
  pairingId: string;
  contrastRatioIssues: { element: string; required: number; actual: number }[];
  fontSizeIssues: { element: string; recommended: string; actual: string }[];
  lineHeightIssues: { element: string; recommended: number; actual: number }[];
  legibilityFeedback: string[];
  wcag2_1_compliance: {
    AA: { status: 'Pass' | 'Fail'; issues: string[] };
    AAA: { status: 'Pass' | 'Fail'; issues: string[] };
  };
  pallyReportUrl?: string; // Link to detailed accessibility report from an external tool
}

// Invented Feature 14: Predictive Performance Analyzer (PPA)
// Predicts font load times and rendering performance based on font assets and usage context.
export interface PerformancePrediction {
  fontAssetId: string;
  estimatedLoadTimeMs: number;
  estimatedRenderTimeMs: number;
  blockingRenderProbability: number; // 0-1
  cdnImpactFactor: number; // How much CDN helps
  recommendations: string[];
}

// Invented Service Layer 1: Gemini AI Service (GAS)
// Orchestrates calls to Google Gemini API for complex reasoning and content generation.
export class GeminiAIService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta'; // Simulated
  private initialized: boolean = false;

  // Invented Feature 15: Contextual Memory Storage (CMS) for AI
  // Stores conversation history and specific brand/user data to give AI better context.
  private conversationHistory: { role: string; parts: { text: string }[] }[] = [];

  constructor(apiKey: string) {
    if (!apiKey) {
      console.warn("GeminiAIService initialized without an API key. AI functionalities may be limited.");
    }
    this.apiKey = apiKey;
    this.initialized = true;
    console.log("GeminiAIService: Initialized with advanced contextual memory and multi-modal capabilities.");
  }

  // Invented Feature 16: Multi-Modal Input Processing
  // Allows sending text, image URLs, and potentially other media to Gemini for analysis.
  private async makeGeminiRequest(prompt: string, options: AIRequestOptions, imageUrl?: string): Promise<any> {
    if (!this.initialized) {
      throw new Error("GeminiAIService not initialized. Please provide an API key.");
    }
    console.log(`GeminiAIService: Sending request for model ${options.model}. Image URL: ${imageUrl || 'N/A'}`);

    // Simulate API call with complex multi-modal input
    const requestBody: any = {
      contents: [
        ...this.conversationHistory, // Include historical context
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 1024,
      },
    };

    if (imageUrl) {
      // Add image part if available (simulated base64 conversion or URL)
      requestBody.contents[requestBody.contents.length - 1].parts.push({
        text: `Analyze this image contextually for font suggestions:`,
        inlineData: {
          mimeType: "image/jpeg", // Assume JPEG for simplicity
          data: btoa(imageUrl) // Very simplified base64 encoding for illustration
        }
      });
    }

    // In a real scenario, this would be an actual fetch call.
    // fetch(`${this.baseUrl}/models/${options.model}:generateContent?key=${this.apiKey}`, { ... })
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

    const simulatedResponse = {
      candidates: [{
        content: {
          parts: [{
            text: `(AI via Gemini) Based on your prompt and current context, here are some insights and suggestions. This is a highly sophisticated, context-aware response generated using Gemini's multi-modal capabilities, analyzing not just text but also the implied visual style if an image was provided. This response incorporates ${Math.ceil(Math.random() * 50) + 50} complex linguistic and visual processing features.`,
          }],
        },
      }],
      usageMetadata: {
        promptTokenCount: prompt.length + (imageUrl ? 200 : 0) + this.conversationHistory.length * 100, // Simulated token count
        totalTokenCount: 500 + Math.random() * 500,
      }
    };

    // Update conversation history for persistent context
    this.conversationHistory.push({ role: 'user', parts: [{ text: prompt }] });
    this.conversationHistory.push({ role: 'model', parts: simulatedResponse.candidates[0].content.parts });

    return simulatedResponse.candidates[0].content.parts[0].text;
  }

  // Invented Feature 17: Semantic Font Pairing Suggestion
  public async suggestPairings(params: PairingSuggestionParameters, options?: AIRequestOptions): Promise<FontPairing[]> {
    const prompt = `Given the brand identity '${params.brandIdentity.name}' (industry: ${params.brandIdentity.industry}, tone: ${params.brandIdentity.brandTone.join(', ')}), for a '${params.context}' usage, suggest ${params.numSuggestions} font pairings. Focus on ${params.targetMoods.join(', ')} moods. If provided, analyze the text sample: "${params.existingTextSample || ''}". Exclude fonts: ${params.exclusionList?.join(', ') || 'none'}. Provide a detailed rationale and score for each.`;
    const responseText = await this.makeGeminiRequest(prompt, options || { provider: AIServiceProvider.GEMINI, model: 'gemini-pro' });

    // Invented Feature 18: AI-Powered Response Parsing & Structuring
    // Use an internal ML model (or another AI call) to parse free-form text into structured FontPairing objects.
    const parsedPairings: FontPairing[] = this.parseAIResponseToPairings(responseText, params.brandIdentity.id);
    return parsedPairings;
  }

  // Invented Feature 19: Visual Font Analysis (VFA) for image-based font detection
  public async analyzeImageForFontStyles(imageUrl: string, options?: AIRequestOptions): Promise<FontAnalysisResult> {
    const prompt = `Analyze the typography visible in this image. Identify font styles, classifications, implied mood, and potential design issues. Suggest improvements.`;
    const responseText = await this.makeGeminiRequest(prompt, options || { provider: AIServiceProvider.GEMINI, model: 'gemini-pro-vision' }, imageUrl);

    // Simulate parsing the complex AI response for font analysis
    return {
      fontId: uuidv4(), // Placeholder, as actual font ID might require OCR/font recognition
      detectedClassification: [FontStyleClassification.SANS_SERIF, FontStyleClassification.DISPLAY],
      inferredMoodTags: [FontMoodTag.MODERN, FontMoodTag.BOLD],
      readabilityImprovements: ['Increase line-height by 1.2x for body text.', 'Adjust letter-spacing for headlines.'],
      legibilityIssues: [],
      culturalContextSuitability: [{ region: 'Global', score: 0.9, notes: 'Broad appeal.' }],
      sentimentScore: 0.85,
      brandingAlignmentScore: 0.92,
    };
  }

  // Invented Feature 20: AI-driven Accessibility Audit
  public async conductAccessibilityAudit(pairing: FontPairing, textSample: string, options?: AIRequestOptions): Promise<AccessibilityReport> {
    const prompt = `Evaluate the accessibility of this font pairing (Headline: ${pairing.headlineFontId}, Body: ${pairing.bodyFontId}) with the following text sample: "${textSample}". Focus on contrast, font size, line height, and overall legibility against WCAG 2.1 AA/AAA standards.`;
    const responseText = await this.makeGeminiRequest(prompt, options || { provider: AIServiceProvider.GEMINI, model: 'gemini-pro' });

    // Simulate parsing
    return {
      pairingId: pairing.id,
      contrastRatioIssues: [], // AI would detect these
      fontSizeIssues: [{ element: 'Body Text', recommended: '16px', actual: '14px' }],
      lineHeightIssues: [{ element: 'Body Text', recommended: 1.5, actual: 1.3 }],
      legibilityFeedback: ['Ensure sufficient letter-spacing for optimal readability on small screens.'],
      wcag2_1_compliance: {
        AA: { status: 'Fail', issues: ['Insufficient contrast for small text.'] },
        AAA: { status: 'Fail', issues: ['Requires increased line-height for body text.'] },
      },
      pallyReportUrl: `https://example.com/pally/report/${pairing.id}`, // Example external report
    };
  }

  // Invented Feature 21: Brand Tone Alignment AI
  public async checkBrandToneAlignment(pairing: FontPairing, brand: BrandIdentity, options?: AIRequestOptions): Promise<{ score: number; feedback: string }> {
    const prompt = `Assess how well the font pairing (Headline: ${pairing.headlineFontId}, Body: ${pairing.bodyFontId}) aligns with the brand identity '${brand.name}' which has a tone of '${brand.brandTone.join(', ')}'.`;
    const responseText = await this.makeGeminiRequest(prompt, options || { provider: AIServiceProvider.GEMINI, model: 'gemini-pro' });
    // Simulate parsing for score and feedback
    return { score: 0.88, feedback: "Excellent alignment. The pairing effectively conveys the brand's sophisticated yet modern tone, particularly through the use of [specific font characteristics]." };
  }

  private parseAIResponseToPairings(responseText: string, brandId?: string): FontPairing[] {
    // This is a highly complex, invented feature requiring advanced NLP.
    // In a real system, this would involve a finely tuned parser or a dedicated LLM call
    // to extract structured JSON from the natural language response.
    // For this demo, we'll simulate the creation of structured data.
    console.log("GeminiAIService: Parsing AI response into structured FontPairing objects...");
    const basePairing: FontPairing = {
      id: uuidv4(),
      headlineFontId: 'Inter-Bold', // Simulated AI-selected font
      bodyFontId: 'Roboto-Regular', // Simulated AI-selected font
      rationale: responseText.substring(0, 200) + '...', // Truncated AI rationale
      compatibilityScore: Math.random() * 40 + 60, // 60-100
      aestheticsScore: Math.random() * 40 + 60,
      readabilityScore: Math.random() * 40 + 60,
      contextSuitability: [{ context: FontUsageContext.WEB, score: 0.9, reason: 'High legibility on screens.' }],
      isApproved: false,
      comments: [],
      associatedBrandId: brandId,
      lastModified: new Date().toISOString(),
    };
    // Return a few simulated pairings to demonstrate the engine's capability
    return [
      { ...basePairing, headlineFontId: 'Montserrat-Bold', bodyFontId: 'OpenSans-Regular', rationale: 'A robust and versatile pairing for digital-first brands.' },
      { ...basePairing, id: uuidv4(), headlineFontId: 'PlayfairDisplay-Bold', bodyFontId: 'Lora-Regular', rationale: 'An elegant and classic combination, perfect for luxury brands.', aestheticsScore: 95 },
      { ...basePairing, id: uuidv4(), headlineFontId: 'Oswald-Bold', bodyFontId: 'Lato-Regular', rationale: 'Modern and impactful, ideal for advertising and headlines.', compatibilityScore: 88 },
    ];
  }
}

// Invented Service Layer 2: ChatGPT AI Service (CAS)
// Orchestrates calls to OpenAI ChatGPT API, specializing in nuanced textual analysis and creative generation.
export class ChatGPTAIService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1'; // Simulated
  private initialized: boolean = false;

  // Invented Feature 22: Fine-Tuning Model Integration
  // Ability to specify custom fine-tuned models for specific brand voices or design rules.
  private defaultFineTunedModel: string | null = null;

  constructor(apiKey: string, fineTunedModel?: string) {
    if (!apiKey) {
      console.warn("ChatGPTAIService initialized without an API key. AI functionalities may be limited.");
    }
    this.apiKey = apiKey;
    this.defaultFineTunedModel = fineTunedModel || null;
    this.initialized = true;
    console.log(`ChatGPTAIService: Initialized. ${fineTunedModel ? `Using fine-tuned model: ${fineTunedModel}.` : 'No fine-tuned model specified.'}`);
  }

  private async makeChatGPTRequest(prompt: string, options: AIRequestOptions): Promise<string> {
    if (!this.initialized) {
      throw new Error("ChatGPTAIService not initialized. Please provide an API key.");
    }
    console.log(`ChatGPTAIService: Sending request for model ${options.model}`);

    // Simulate API call
    // fetch(`${this.baseUrl}/chat/completions`, { ... })
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency

    const simulatedResponse = {
      choices: [{
        message: {
          content: `(AI via ChatGPT) Here's a creative insight from ChatGPT, incorporating ${Math.ceil(Math.random() * 40) + 60} advanced linguistic and contextual analysis features. This response is tailored for nuance and creative problem-solving.`,
        },
      }],
      usage: {
        prompt_tokens: prompt.length,
        completion_tokens: 200,
        total_tokens: prompt.length + 200,
      },
    };
    return simulatedResponse.choices[0].message.content;
  }

  // Invented Feature 23: Creative Copy & Font Synergy Generation
  // Generates marketing copy suggestions that naturally complement chosen font pairings.
  public async generateCopyForPairing(pairing: FontPairing, context: FontUsageContext, tone: FontMoodTag[], keywords: string[], options?: AIRequestOptions): Promise<string> {
    const prompt = `Given the font pairing: Headline - ${pairing.headlineFontId}, Body - ${pairing.bodyFontId}, generate compelling marketing copy for a '${context}' use case. The tone should be '${tone.join(', ')}' and incorporate these keywords: ${keywords.join(', ')}. Explain how the copy synergizes with the chosen fonts.`;
    return await this.makeChatGPTRequest(prompt, options || { provider: AIServiceProvider.CHATGPT, model: this.defaultFineTunedModel || 'gpt-4' });
  }

  // Invented Feature 24: Font Name Ideation & Branding (FNIB)
  // Assists in generating unique and resonant names for custom fonts or font families.
  public async ideateFontNames(style: FontStyleClassification[], mood: FontMoodTag[], inspirations: string[], options?: AIRequestOptions): Promise<string[]> {
    const prompt = `Brainstorm 10 unique and impactful font names for a font with these characteristics: Style - ${style.join(', ')}, Mood - ${mood.join(', ')}. Draw inspiration from: ${inspirations.join(', ')}.`;
    const responseText = await this.makeChatGPTRequest(prompt, options || { provider: AIServiceProvider.CHATGPT, model: 'gpt-4' });
    // Simulate parsing for a list of names
    return responseText.split('\n').filter(Boolean).map(line => line.replace(/^\d+\.\s*/, '').trim()).slice(0, 10);
  }

  // Invented Feature 25: Cultural Sensitivity & Localization Analysis (CSLA)
  // Analyzes font choices for cultural appropriateness and potential misinterpretations in different locales.
  public async checkCulturalSensitivity(fontAsset: FontAsset, targetLocales: string[], options?: AIRequestOptions): Promise<{ locale: string; feedback: string }[]> {
    const prompt = `Analyze font '${fontAsset.name}' (classification: ${fontAsset.classification.join(', ')}, mood: ${fontAsset.moodTags.join(', ')}) for cultural sensitivity and appropriateness in the following locales: ${targetLocales.join(', ')}. Highlight any potential negative connotations, historical baggage, or readability issues in non-Latin scripts if applicable.`;
    const responseText = await this.makeChatGPTRequest(prompt, options || { provider: AIServiceProvider.CHATGPT, model: 'gpt-4' });
    // Simulate parsing
    return targetLocales.map(locale => ({
      locale,
      feedback: `(Simulated feedback for ${locale}) Ensure proper rendering of local characters. The perceived mood might vary.`,
    }));
  }
}

// Invented Module 3: Data Management & Repository Layer
// Purpose: Centralized management of all font assets, pairings, brands, and user data.
// This ensures a single source of truth and facilitates efficient data retrieval.

export interface DataRepository<T> {
  findById(id: string): Promise<T | undefined>;
  findAll(): Promise<T[]>;
  save(item: T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T | undefined>;
  delete(id: string): Promise<boolean>;
  query(filter: Record<string, any>): Promise<T[]>; // Invented Feature 26: Advanced Querying
}

// Invented Feature 27: In-Memory Data Store with Persistent Sync (IMDS-PS)
// For demo purposes, we'll use a simple in-memory store. In production, this would
// integrate with a distributed database (e.g., MongoDB, PostgreSQL, Firebase).
export class InMemoryDataRepository<T extends { id: string }> implements DataRepository<T> {
  private data: Map<string, T> = new Map();
  private entityName: string;

  constructor(entityName: string, initialData: T[] = []) {
    this.entityName = entityName;
    initialData.forEach(item => this.data.set(item.id, item));
    console.log(`InMemoryDataRepository for ${entityName}: Initialized with ${initialData.length} items.`);
    // Invented Feature 28: Simulated Cloud Sync Service (SCSS)
    // In a real-world scenario, this would hook into a cloud database.
    setInterval(() => this.simulateCloudSync(), 60000); // Sync every minute
  }

  private async simulateCloudSync(): Promise<void> {
    // Invented External Service 8: Google Cloud Firestore (Simulated)
    // Invented External Service 9: AWS DynamoDB (Simulated)
    // Invented External Service 10: Azure Cosmos DB (Simulated)
    console.log(`SCSS: Attempting to sync ${this.entityName} data to cloud... (Simulated success)`);
    // Example: send this.data to a REST endpoint or SDK
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network
    console.log(`SCSS: ${this.entityName} data synced.`);
  }

  async findById(id: string): Promise<T | undefined> {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async
    return this.data.get(id);
  }

  async findAll(): Promise<T[]> {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async
    return Array.from(this.data.values());
  }

  async save(item: T): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const newItem = { ...item, id: item.id || uuidv4() };
    this.data.set(newItem.id, newItem);
    console.log(`Repository: Saved ${this.entityName} with ID: ${newItem.id}`);
    return newItem;
  }

  async update(id: string, updates: Partial<T>): Promise<T | undefined> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const existing = this.data.get(id);
    if (!existing) return undefined;
    const updated = produce(existing, draft => {
      Object.assign(draft, updates);
    });
    this.data.set(id, updated);
    console.log(`Repository: Updated ${this.entityName} with ID: ${id}`);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const success = this.data.delete(id);
    console.log(`Repository: Deleted ${this.entityName} with ID: ${id}: ${success}`);
    return success;
  }

  async query(filter: Record<string, any>): Promise<T[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return Array.from(this.data.values()).filter(item => {
      for (const key in filter) {
        if (Object.prototype.hasOwnProperty.call(filter, key)) {
          // Invented Feature 29: Dynamic Filter Logic
          // Supports nested property filtering, array containment, etc.
          const filterValue = filter[key];
          const itemValue = (item as any)[key];

          if (Array.isArray(filterValue) && Array.isArray(itemValue)) {
            if (!filterValue.some(fv => itemValue.includes(fv))) {
              return false;
            }
          } else if (typeof filterValue === 'string' && typeof itemValue === 'string') {
            if (!itemValue.toLowerCase().includes(filterValue.toLowerCase())) {
              return false;
            }
          } else if (itemValue !== filterValue) {
            return false;
          }
        }
      }
      return true;
    });
  }
}

// Invented Module 4: Font Asset Management System (FAMS)
// Purpose: Manage all aspects of font assets, including upload, storage, licensing, and CDN delivery.

// Invented Feature 30: Font Storage & CDN Integration
export enum FontStorageProvider {
  LOCAL = 'Local',
  AWS_S3 = 'AWS S3', // Invented External Service 11
  GCP_CLOUD_STORAGE = 'GCP Cloud Storage', // Invented External Service 12
  AZURE_BLOB_STORAGE = 'Azure Blob Storage', // Invented External Service 13
  TYPEKIT = 'Adobe Typekit', // Invented External Service 14
  GOOGLE_FONTS_API = 'Google Fonts API', // Invented External Service 15
  FONT_SQUIRREL = 'Font Squirrel', // Invented External Service 16
  CUSTOM_CDN = 'Custom CDN',
}

// Invented Feature 31: Font License Management (FLM)
export interface FontLicense {
  licenseId: string;
  fontAssetId: string;
  licenseeId: string; // e.g., brand ID or user ID
  licenseKey: string;
  type: 'Desktop' | 'Web' | 'App' | 'Ebook' | 'Broadcast' | 'Enterprise';
  startDate: string; // ISO date
  endDate?: string; // ISO date, if applicable
  terms: string; // Full text of license terms
  usageLimits: {
    pageViewsPerMonth?: number;
    userCount?: number;
    domainWhitelist?: string[];
  };
  renewalOptions: 'auto' | 'manual';
  status: 'Active' | 'Expired' | 'Pending Renewal' | 'Revoked';
  lastAuditDate: string;
}

// Invented Feature 32: Font Transcoding & Optimization Service
export enum FontFormat {
  WOFF2 = 'woff2',
  WOFF = 'woff',
  TTF = 'ttf',
  OTF = 'otf',
  EOT = 'eot',
  SVG = 'svg',
}

export interface FontTranscodingJob {
  jobId: string;
  fontAssetId: string;
  sourceFormat: FontFormat;
  targetFormats: FontFormat[];
  subsettingOptions?: {
    characters: string; // e.g., 'latin-ext' or specific char set
    ligatures: boolean;
    kerning: boolean;
  };
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  outputUrls: { format: FontFormat; url: string }[];
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export class FontAssetManager {
  private fontRepo: DataRepository<FontAsset>;
  private licenseRepo: DataRepository<FontLicense>;
  private transcodingQueue: DataRepository<FontTranscodingJob>;

  constructor(fontRepo: DataRepository<FontAsset>, licenseRepo: DataRepository<FontLicense>, transcodingQueue: DataRepository<FontTranscodingJob>) {
    this.fontRepo = fontRepo;
    this.licenseRepo = licenseRepo;
    this.transcodingQueue = transcodingQueue;
    console.log("FontAssetManager: Initialized with integrated font, license, and transcoding repositories.");
  }

  // Invented Feature 33: Secure Font Upload & Virus Scan
  public async uploadFont(file: File, metadata: Partial<FontAsset>): Promise<FontAsset> {
    console.log(`FAMS: Initiating secure upload for ${file.name}...`);
    // Invented External Service 17: VirusTotal API (Simulated)
    // Invented External Service 18: Anti-Malware Scan Service (Simulated)
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload & scan
    const newFont: FontAsset = {
      id: uuidv4(),
      name: metadata.name || file.name.split('.')[0],
      fileName: file.name,
      version: '1.0.0',
      foundry: metadata.foundry || 'Unknown',
      designer: metadata.designer || [],
      licenseType: metadata.licenseType || 'Trial',
      fileSizeKB: file.size / 1024,
      tags: metadata.tags || [],
      classification: metadata.classification || [FontStyleClassification.SANS_SERIF],
      supportedLanguages: metadata.supportedLanguages || ['en-US'],
      moodTags: metadata.moodTags || [],
      metrics: metadata.metrics || {
        xHeight: 0.5, capHeight: 0.7, ascender: 0.8, descender: 0.2, lineHeight: 1.5,
        avgCharWidth: 0.5, minCharWidth: 0.3, maxCharWidth: 0.8, slant: 0, contrastRatio: 4.5,
        readabilityScore: 0.7, legibilityScore: 0.7, kerningPairs: {}, ligatureSupport: [],
      },
      lastUpdated: new Date().toISOString(),
      checksum: 'simulated_checksum_' + uuidv4(),
      // Simulated storage to a CDN or local path
      cdnUrl: `https://cdn.example.com/fonts/${uuidv4()}/${file.name}`,
    };
    console.log(`FAMS: Upload and initial processing complete for ${newFont.name}.`);
    return this.fontRepo.save(newFont);
  }

  // Invented Feature 34: Automated Font Transcoding Pipeline
  public async processFontForWeb(fontAssetId: string, targetFormats: FontFormat[] = [FontFormat.WOFF2, FontFormat.WOFF]): Promise<FontTranscodingJob> {
    const font = await this.fontRepo.findById(fontAssetId);
    if (!font) throw new Error('Font asset not found.');

    console.log(`FAMS: Initiating transcoding job for ${font.name} to ${targetFormats.join(', ')}...`);
    const job: FontTranscodingJob = {
      jobId: uuidv4(),
      fontAssetId: fontAssetId,
      sourceFormat: FontFormat.TTF, // Assume source is TTF for this demo
      targetFormats: targetFormats,
      status: 'Pending',
      outputUrls: [],
      createdAt: new Date().toISOString(),
    };
    const savedJob = await this.transcodingQueue.save(job);
    // Invented External Service 19: Cloudinary Font Optimization (Simulated)
    // Invented External Service 20: Font Squirrel Generator API (Simulated)
    // In a real system, this would trigger a microservice or serverless function.
    await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate transcoding time
    const updatedJob = await this.transcodingQueue.update(savedJob.jobId, {
      status: 'Completed',
      outputUrls: targetFormats.map(f => ({ format: f, url: `${font.cdnUrl?.split('.')[0]}.${f}` })),
      completedAt: new Date().toISOString(),
    });
    console.log(`FAMS: Transcoding job ${savedJob.jobId} completed.`);
    return updatedJob!;
  }

  // Invented Feature 35: Centralized Font License Audit
  public async conductLicenseAudit(brandId?: string): Promise<FontLicense[]> {
    console.log(`FAMS: Starting font license audit for ${brandId ? `brand ${brandId}` : 'all brands'}...`);
    const allLicenses = await this.licenseRepo.findAll();
    const relevantLicenses = brandId ? allLicenses.filter(lic => lic.licenseeId === brandId) : allLicenses;

    // Invented External Service 21: Legal Compliance Checker API (Simulated)
    // Invented External Service 22: Blockchain-based License Verification (Simulated for future)
    for (const license of relevantLicenses) {
      if (license.status === 'Active' && license.endDate && moment().isAfter(moment(license.endDate))) {
        await this.licenseRepo.update(license.licenseId, { status: 'Expired' });
        console.warn(`License ${license.licenseId} for font ${license.fontAssetId} has expired.`);
      }
      // More complex checks: usage limits, domain whitelists, etc.
    }
    console.log(`FAMS: License audit completed. Found ${relevantLicenses.length} relevant licenses.`);
    return relevantLicenses;
  }
}

// Invented Module 5: Context & State Management for EnterpriseFontDesignStudio
// Purpose: Provide a robust, centralized state management solution for the entire application,
// utilizing React Context and Reducers for complex interactions.

export interface EnterpriseFontDesignStudioState {
  allFonts: FontAsset[];
  allPairings: FontPairing[];
  allBrands: BrandIdentity[];
  userPreferences: UserPreferences;
  activeBrand?: BrandIdentity;
  activePairing?: FontPairing;
  currentTextSample: string;
  loading: boolean;
  error: string | null;
  aiRecommendations: FontPairing[];
  accessibilityReport: AccessibilityReport | null;
  performancePredictions: PerformancePrediction[];
  designSystemConfig?: DesignSystemConfig;
  performanceMonitoringConfig?: PerformanceMonitoringConfig;
  aiProviderConfigs: {
    gemini: { apiKey: string | null; service: GeminiAIService | null };
    chatgpt: { apiKey: string | null; service: ChatGPTAIService | null; fineTunedModel: string | null };
  };
  auditReports: { type: 'license' | 'accessibility'; reportId: string; timestamp: string }[];
}

// Invented Feature 36: Reducer-based State Management (RSM)
type Action =
  | { type: 'SET_FONTS'; payload: FontAsset[] }
  | { type: 'ADD_FONT'; payload: FontAsset }
  | { type: 'UPDATE_FONT'; payload: FontAsset }
  | { type: 'DELETE_FONT'; payload: string }
  | { type: 'SET_PAIRINGS'; payload: FontPairing[] }
  | { type: 'ADD_PAIRING'; payload: FontPairing }
  | { type: 'UPDATE_PAIRING'; payload: FontPairing }
  | { type: 'DELETE_PAIRING'; payload: string }
  | { type: 'SET_BRANDS'; payload: BrandIdentity[] }
  | { type: 'ADD_BRAND'; payload: BrandIdentity }
  | { type: 'SET_ACTIVE_BRAND'; payload: BrandIdentity | undefined }
  | { type: 'SET_ACTIVE_PAIRING'; payload: FontPairing | undefined }
  | { type: 'SET_USER_PREFERENCES'; payload: UserPreferences }
  | { type: 'SET_CURRENT_TEXT_SAMPLE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_AI_RECOMMENDATION'; payload: FontPairing[] }
  | { type: 'SET_ACCESSIBILITY_REPORT'; payload: AccessibilityReport | null }
  | { type: 'ADD_PERFORMANCE_PREDICTION'; payload: PerformancePrediction }
  | { type: 'SET_DESIGN_SYSTEM_CONFIG'; payload: DesignSystemConfig }
  | { type: 'SET_PERFORMANCE_MONITORING_CONFIG'; payload: PerformanceMonitoringConfig }
  | { type: 'SET_GEMINI_API_KEY'; payload: string | null }
  | { type: 'SET_CHATGPT_API_KEY'; payload: string | null }
  | { type: 'SET_CHATGPT_FINE_TUNED_MODEL'; payload: string | null }
  | { type: 'INITIALIZE_AI_SERVICES' };

const initialState: EnterpriseFontDesignStudioState = {
  allFonts: [],
  allPairings: [],
  allBrands: [],
  userPreferences: {
    theme: 'light',
    accessibilityMode: false,
    preferredClassifications: [],
    preferredMoods: [],
    favoriteFonts: [],
    recentPairings: [],
  },
  currentTextSample: 'The quick brown fox jumps over the lazy dog.',
  loading: false,
  error: null,
  aiRecommendations: [],
  accessibilityReport: null,
  performancePredictions: [],
  aiProviderConfigs: {
    gemini: { apiKey: null, service: null },
    chatgpt: { apiKey: null, service: null, fineTunedModel: null },
  },
  auditReports: [],
};

// Invented Feature 37: Immutable State Updates with Immer
const fontDesignStudioReducer = (state: EnterpriseFontDesignStudioState, action: Action): EnterpriseFontDesignStudioState => {
  return produce(state, draft => {
    switch (action.type) {
      case 'SET_FONTS':
        draft.allFonts = action.payload;
        break;
      case 'ADD_FONT':
        draft.allFonts.push(action.payload);
        break;
      case 'UPDATE_FONT':
        const fontIndex = draft.allFonts.findIndex(f => f.id === action.payload.id);
        if (fontIndex !== -1) draft.allFonts[fontIndex] = action.payload;
        break;
      case 'DELETE_FONT':
        draft.allFonts = draft.allFonts.filter(f => f.id !== action.payload);
        break;
      case 'SET_PAIRINGS':
        draft.allPairings = action.payload;
        break;
      case 'ADD_PAIRING':
        draft.allPairings.push(action.payload);
        break;
      case 'UPDATE_PAIRING':
        const pairingIndex = draft.allPairings.findIndex(p => p.id === action.payload.id);
        if (pairingIndex !== -1) draft.allPairings[pairingIndex] = action.payload;
        break;
      case 'DELETE_PAIRING':
        draft.allPairings = draft.allPairings.filter(p => p.id !== action.payload);
        break;
      case 'SET_BRANDS':
        draft.allBrands = action.payload;
        break;
      case 'ADD_BRAND':
        draft.allBrands.push(action.payload);
        break;
      case 'SET_ACTIVE_BRAND':
        draft.activeBrand = action.payload;
        break;
      case 'SET_ACTIVE_PAIRING':
        draft.activePairing = action.payload;
        break;
      case 'SET_USER_PREFERENCES':
        draft.userPreferences = action.payload;
        break;
      case 'SET_CURRENT_TEXT_SAMPLE':
        draft.currentTextSample = action.payload;
        break;
      case 'SET_LOADING':
        draft.loading = action.payload;
        break;
      case 'SET_ERROR':
        draft.error = action.payload;
        break;
      case 'ADD_AI_RECOMMENDATION':
        draft.aiRecommendations.push(...action.payload);
        break;
      case 'SET_ACCESSIBILITY_REPORT':
        draft.accessibilityReport = action.payload;
        if (action.payload) {
          draft.auditReports.push({ type: 'accessibility', reportId: action.payload.pairingId, timestamp: new Date().toISOString() });
        }
        break;
      case 'ADD_PERFORMANCE_PREDICTION':
        draft.performancePredictions.push(action.payload);
        break;
      case 'SET_DESIGN_SYSTEM_CONFIG':
        draft.designSystemConfig = action.payload;
        break;
      case 'SET_PERFORMANCE_MONITORING_CONFIG':
        draft.performanceMonitoringConfig = action.payload;
        break;
      case 'SET_GEMINI_API_KEY':
        draft.aiProviderConfigs.gemini.apiKey = action.payload;
        draft.aiProviderConfigs.gemini.service = action.payload ? new GeminiAIService(action.payload) : null;
        break;
      case 'SET_CHATGPT_API_KEY':
        draft.aiProviderConfigs.chatgpt.apiKey = action.payload;
        draft.aiProviderConfigs.chatgpt.service = action.payload ? new ChatGPTAIService(action.payload, draft.aiProviderConfigs.chatgpt.fineTunedModel || undefined) : null;
        break;
      case 'SET_CHATGPT_FINE_TUNED_MODEL':
        draft.aiProviderConfigs.chatgpt.fineTunedModel = action.payload;
        if (draft.aiProviderConfigs.chatgpt.apiKey) {
          draft.aiProviderConfigs.chatgpt.service = new ChatGPTAIService(draft.aiProviderConfigs.chatgpt.apiKey, action.payload || undefined);
        }
        break;
      case 'INITIALIZE_AI_SERVICES':
        if (state.aiProviderConfigs.gemini.apiKey && !state.aiProviderConfigs.gemini.service) {
          draft.aiProviderConfigs.gemini.service = new GeminiAIService(state.aiProviderConfigs.gemini.apiKey);
        }
        if (state.aiProviderConfigs.chatgpt.apiKey && !state.aiProviderConfigs.chatgpt.service) {
          draft.aiProviderConfigs.chatgpt.service = new ChatGPTAIService(state.aiProviderConfigs.chatgpt.apiKey, state.aiProviderConfigs.chatgpt.fineTunedModel || undefined);
        }
        break;
      default:
        // Invented Feature 38: Unhandled Action Logging
        console.warn(`Unhandled action type: ${(action as any).type}`);
        break;
    }
  });
};

// Invented Feature 39: Font Design Studio Context (FDSC)
// Provides global state and actions to all components within the studio.
interface EnterpriseFontDesignStudioContextType {
  state: EnterpriseFontDesignStudioState;
  dispatch: React.Dispatch<Action>;
  repositories: {
    fonts: InMemoryDataRepository<FontAsset>;
    pairings: InMemoryDataRepository<FontPairing>;
    brands: InMemoryDataRepository<BrandIdentity>;
    licenses: InMemoryDataRepository<FontLicense>;
    transcodingQueue: InMemoryDataRepository<FontTranscodingJob>;
  };
  aiServices: {
    gemini: GeminiAIService | null;
    chatgpt: ChatGPTAIService | null;
  };
  fontAssetManager: FontAssetManager;
  actions: { // Encapsulated actions for better DX
    loadAllData: () => Promise<void>;
    suggestFontPairings: (params: PairingSuggestionParameters) => Promise<void>;
    analyzeImageForFonts: (imageUrl: string) => Promise<FontAnalysisResult | undefined>;
    runAccessibilityAudit: (pairing: FontPairing, text: string) => Promise<void>;
    generateCreativeCopy: (pairing: FontPairing, context: FontUsageContext, tone: FontMoodTag[], keywords: string[]) => Promise<string | undefined>;
    uploadNewFont: (file: File, metadata: Partial<FontAsset>) => Promise<FontAsset | undefined>;
    processFontForWeb: (fontAssetId: string) => Promise<FontTranscodingJob | undefined>;
    performLicenseAudit: (brandId?: string) => Promise<void>;
    simulateUserPreferenceUpdate: (updates: Partial<UserPreferences>) => Promise<void>;
  };
}

// Default context value (will be overridden by Provider)
const EnterpriseFontDesignStudioContext = createContext<EnterpriseFontDesignStudioContextType | undefined>(undefined);

// Invented Feature 40: Enterprise Font Design Studio Provider (EFDSP)
// The main entry point for the entire Type-Intelligence Nexus.
export const EnterpriseFontDesignStudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(fontDesignStudioReducer, initialState);

  // Initialize Repositories (Invented Feature 41: Dynamic Repository Instantiation)
  const fontRepoRef = useRef(new InMemoryDataRepository<FontAsset>('Fonts', []));
  const pairingRepoRef = useRef(new InMemoryDataRepository<FontPairing>('Pairings', []));
  const brandRepoRef = useRef(new InMemoryDataRepository<BrandIdentity>('Brands', []));
  const licenseRepoRef = useRef(new InMemoryDataRepository<FontLicense>('Licenses', []));
  const transcodingQueueRepoRef = useRef(new InMemoryDataRepository<FontTranscodingJob>('TranscodingQueue', []));

  // Initialize AI Services (Invented Feature 42: Lazy AI Service Initialization)
  const geminiServiceRef = useRef<GeminiAIService | null>(null);
  const chatgptServiceRef = useRef<ChatGPTAIService | null>(null);

  // Initialize Font Asset Manager (Invented Feature 43: Integrated Asset Management)
  const fontAssetManagerRef = useRef<FontAssetManager>(new FontAssetManager(
    fontRepoRef.current,
    licenseRepoRef.current,
    transcodingQueueRepoRef.current
  ));

  useEffect(() => {
    // Invented Feature 44: Initial Data Loading & Hydration
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [fonts, pairings, brands] = await Promise.all([
          fontRepoRef.current.findAll(),
          pairingRepoRef.current.findAll(),
          brandRepoRef.current.findAll(),
        ]);
        dispatch({ type: 'SET_FONTS', payload: fonts });
        dispatch({ type: 'SET_PAIRINGS', payload: pairings });
        dispatch({ type: 'SET_BRANDS', payload: brands });
        // Simulate initial brand/user setup
        if (brands.length > 0) {
          dispatch({ type: 'SET_ACTIVE_BRAND', payload: brands[0] });
        }
        console.log("EFDSP: Initial data loaded and studio hydrated.");
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: `Failed to load initial data: ${err.message}` });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadInitialData();

    // Invented Feature 45: API Key Management & Secure Storage Hooks
    // In a real app, these would come from environment variables or a secure vault.
    const setupAPIKeys = async () => {
      // Invented External Service 23: AWS Secrets Manager (Simulated)
      // Invented External Service 24: Azure Key Vault (Simulated)
      // Invented External Service 25: HashiCorp Vault (Simulated)
      console.log("EFDSP: Attempting to retrieve AI API keys from secure vault...");
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async fetch

      const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'DEMO_GEMINI_KEY_ABC123';
      const chatgptKey = process.env.NEXT_PUBLIC_CHATGPT_API_KEY || 'DEMO_CHATGPT_KEY_DEF456';
      const chatgptFineTuned = process.env.NEXT_PUBLIC_CHATGPT_FINE_TUNED_MODEL || null;

      dispatch({ type: 'SET_GEMINI_API_KEY', payload: geminiKey });
      dispatch({ type: 'SET_CHATGPT_API_KEY', payload: chatgptKey });
      dispatch({ type: 'SET_CHATGPT_FINE_TUNED_MODEL', payload: chatgptFineTuned });
      dispatch({ type: 'INITIALIZE_AI_SERVICES' }); // Re-initialize services with keys
      console.log("EFDSP: AI API keys configured and services initialized (or re-initialized).");
    };
    setupAPIKeys();

    // Invented Feature 46: Global Error Boundary Integration
    // Simulate error logging to an external service
    const handleError = (error: ErrorEvent) => {
      console.error("Global Error Caught by EFDSP:", error);
      // Invented External Service 26: Sentry (Simulated)
      // Invented External Service 27: LogRocket (Simulated)
      // Invented External Service 28: Datadog RUM (Simulated)
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []); // Run once on mount

  // Re-initialize AI services if API keys change
  useEffect(() => {
    if (state.aiProviderConfigs.gemini.apiKey) {
      geminiServiceRef.current = new GeminiAIService(state.aiProviderConfigs.gemini.apiKey);
    } else {
      geminiServiceRef.current = null;
    }
    if (state.aiProviderConfigs.chatgpt.apiKey) {
      chatgptServiceRef.current = new ChatGPTAIService(state.aiProviderConfigs.chatgpt.apiKey, state.aiProviderConfigs.chatgpt.fineTunedModel || undefined);
    } else {
      chatgptServiceRef.current = null;
    }
  }, [state.aiProviderConfigs.gemini.apiKey, state.aiProviderConfigs.chatgpt.apiKey, state.aiProviderConfigs.chatgpt.fineTunedModel]);


  // Invented Feature 47: Encapsulated Action Dispatchers
  // These functions provide a clean API for interacting with the studio's state and services.
  const actions = useMemo(() => ({
    loadAllData: async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [fonts, pairings, brands] = await Promise.all([
          fontRepoRef.current.findAll(),
          pairingRepoRef.current.findAll(),
          brandRepoRef.current.findAll(),
        ]);
        dispatch({ type: 'SET_FONTS', payload: fonts });
        dispatch({ type: 'SET_PAIRINGS', payload: pairings });
        dispatch({ type: 'SET_BRANDS', payload: brands });
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: `Error loading data: ${err.message}` });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    suggestFontPairings: async (params: PairingSuggestionParameters) => {
      if (!geminiServiceRef.current) {
        dispatch({ type: 'SET_ERROR', payload: 'Gemini AI service not configured.' });
        return;
      }
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        console.log(`EFDSP Action: Requesting AI font pairing suggestions for brand ${params.brandIdentity.name}.`);
        const suggestions = await geminiServiceRef.current.suggestPairings(params);
        dispatch({ type: 'ADD_AI_RECOMMENDATION', payload: suggestions });
        console.log(`EFDSP Action: Received ${suggestions.length} AI suggestions.`);
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: `AI pairing suggestion failed: ${err.message}` });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    analyzeImageForFonts: async (imageUrl: string) => {
      if (!geminiServiceRef.current) {
        dispatch({ type: 'SET_ERROR', payload: 'Gemini AI service not configured.' });
        return;
      }
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        console.log(`EFDSP Action: Analyzing image ${imageUrl} for font styles.`);
        const result = await geminiServiceRef.current.analyzeImageForFontStyles(imageUrl);
        console.log("EFDSP Action: Image analysis complete.", result);
        // Optionally, store this result in state or associate it with a project
        return result;
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: `Image font analysis failed: ${err.message}` });
        return undefined;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    runAccessibilityAudit: async (pairing: FontPairing, text: string) => {
      if (!geminiServiceRef.current) {
        dispatch({ type: 'SET_ERROR', payload: 'Gemini AI service not configured.' });
        return;
      }
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        console.log(`EFDSP Action: Running accessibility audit for pairing ${pairing.id}.`);
        const report = await geminiServiceRef.current.conductAccessibilityAudit(pairing, text);
        dispatch({ type: 'SET_ACCESSIBILITY_REPORT', payload: report });
        console.log("EFDSP Action: Accessibility audit completed.", report);
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: `Accessibility audit failed: ${err.message}` });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    generateCreativeCopy: async (pairing: FontPairing, context: FontUsageContext, tone: FontMoodTag[], keywords: string[]) => {
      if (!chatgptServiceRef.current) {
        dispatch({ type: 'SET_ERROR', payload: 'ChatGPT AI service not configured.' });
        return;
      }
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        console.log(`EFDSP Action: Generating creative copy for pairing ${pairing.id}.`);
        const copy = await chatgptServiceRef.current.generateCopyForPairing(pairing, context, tone, keywords);
        console.log("EFDSP Action: Creative copy generated.", copy);
        return copy;
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: `Creative copy generation failed: ${err.message}` });
        return undefined;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    uploadNewFont: async (file: File, metadata: Partial<FontAsset>) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const newFont = await fontAssetManagerRef.current.uploadFont(file, metadata);
        dispatch({ type: 'ADD_FONT', payload: newFont });
        console.log(`EFDSP Action: New font '${newFont.name}' uploaded.`);
        return newFont;
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: `Font upload failed: ${err.message}` });
        return undefined;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    processFontForWeb: async (fontAssetId: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const job = await fontAssetManagerRef.current.processFontForWeb(fontAssetId);
        // Optionally update the font asset with new CDN URLs from the job
        const updatedFont = await fontRepoRef.current.update(fontAssetId, {
          cdnUrl: job.outputUrls.find(o => o.format === FontFormat.WOFF2)?.url || job.outputUrls[0]?.url,
        });
        if (updatedFont) {
          dispatch({ type: 'UPDATE_FONT', payload: updatedFont });
        }
        console.log(`EFDSP Action: Font '${fontAssetId}' processed for web.`);
        return job;
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: `Font web processing failed: ${err.message}` });
        return undefined;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    performLicenseAudit: async (brandId?: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        console.log(`EFDSP Action: Performing license audit for ${brandId || 'all brands'}.`);
        const licenses = await fontAssetManagerRef.current.conductLicenseAudit(brandId);
        // Dispatch an action to add this audit report to state
        dispatch({ type: 'SET_LOADING', payload: false }); // Reset loading here before dispatching report
        dispatch({ type: 'ADD_PAIRING', payload: { // Reusing 'ADD_PAIRING' for simplicity, ideally a dedicated 'ADD_AUDIT_REPORT' action
          id: uuidv4(),
          headlineFontId: 'N/A',
          bodyFontId: 'N/A',
          rationale: `License audit completed for ${brandId || 'all brands'}. Found ${licenses.length} licenses.`,
          compatibilityScore: 100,
          aestheticsScore: 100,
          readabilityScore: 100,
          contextSuitability: [],
          isApproved: true,
          comments: [],
          lastModified: new Date().toISOString(),
          associatedBrandId: brandId,
        }});
        console.log("EFDSP Action: License audit completed. Licenses reviewed:", licenses.length);
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: `License audit failed: ${err.message}` });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    simulateUserPreferenceUpdate: async (updates: Partial<UserPreferences>) => {
      dispatch({ type: 'SET_USER_PREFERENCES', payload: { ...state.userPreferences, ...updates } });
      console.log("EFDSP Action: User preferences updated.", updates);
      // Invented External Service 29: User Profile Service (Simulated)
      // Save to backend
      await new Promise(resolve => setTimeout(resolve, 200));
    },
  }), [state.userPreferences, state.aiProviderConfigs.gemini.apiKey, state.aiProviderConfigs.chatgpt.apiKey, state.aiProviderConfigs.chatgpt.fineTunedModel]);


  const contextValue = useMemo(() => ({
    state,
    dispatch,
    repositories: {
      fonts: fontRepoRef.current,
      pairings: pairingRepoRef.current,
      brands: brandRepoRef.current,
      licenses: licenseRepoRef.current,
      transcodingQueue: transcodingQueueRepoRef.current,
    },
    aiServices: {
      gemini: geminiServiceRef.current,
      chatgpt: chatgptServiceRef.current,
    },
    fontAssetManager: fontAssetManagerRef.current,
    actions,
  }), [state, actions]);

  return (
    <EnterpriseFontDesignStudioContext.Provider value={contextValue}>
      {children}
    </EnterpriseFontDesignStudioContext.Provider>
  );
};

// Invented Feature 48: useEnterpriseFontDesignStudio Hook
// Custom hook to consume the studio context, simplifying access to state and actions.
export const useEnterpriseFontDesignStudio = () => {
  const context = useContext(EnterpriseFontDesignStudioContext);
  if (context === undefined) {
    throw new Error('useEnterpriseFontDesignStudio must be used within an EnterpriseFontDesignStudioProvider');
  }
  return context;
};

// Invented Module 6: UI Components & Visualizations
// Purpose: Provide a rich user interface for interacting with the Type-Intelligence Nexus.
// This includes advanced font previewers, pairing dashboards, and AI interaction panels.

// Invented Feature 49: Advanced Typography Preview Component (ATPC)
// Allows real-time preview of font pairings with customizable text, sizes, and colors.
export const AdvancedTypographyPreview: React.FC<{
  headlineFont?: FontAsset;
  bodyFont?: FontAsset;
  headlineText?: string;
  bodyText?: string;
  mood?: FontMoodTag[];
  context?: FontUsageContext;
  showMetrics?: boolean;
}> = ({ headlineFont, bodyFont, headlineText, bodyText, mood = [], context = FontUsageContext.WEB, showMetrics = false }) => {
  const { state } = useEnterpriseFontDesignStudio();
  const currentHeadlineText = headlineText || state.currentTextSample;
  const currentBodyText = bodyText || state.currentTextSample;

  // Invented Feature 50: Dynamic Font Loading & Optimization
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const loadFonts = async () => {
      const fontFaces: FontFace[] = [];
      const fontIdsToLoad = new Set<string>();
      if (headlineFont) fontIdsToLoad.add(headlineFont.id);
      if (bodyFont && bodyFont.id !== headlineFont?.id) fontIdsToLoad.add(bodyFont.id);

      for (const fontId of Array.from(fontIdsToLoad)) {
        const font = state.allFonts.find(f => f.id === fontId);
        if (font && font.cdnUrl) {
          // Invented External Service 30: Google Fonts Loader (Web Font Loader) (Simulated)
          // Invented External Service 31: Font Face Observer (Simulated)
          try {
            const fontFace = new FontFace(font.name, `url(${font.cdnUrl})`);
            await fontFace.load();
            document.fonts.add(fontFace);
            console.log(`ATPC: Font '${font.name}' loaded dynamically.`);
          } catch (e) {
            console.error(`ATPC: Failed to load font '${font.name}':`, e);
          }
        }
      }
      setFontsLoaded(true);
    };
    loadFonts();
  }, [headlineFont, bodyFont, state.allFonts]);

  if (!fontsLoaded) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center p-8 bg-gray-100 rounded-lg shadow-inner text-gray-600"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Loading font assets for preview...</p>
      </motion.div>
    );
  }

  // Invented Feature 51: Real-time Contextual Styling
  const getDynamicStyles = (font?: FontAsset) => {
    if (!font) return {};
    return {
      fontFamily: `'${font.name}', sans-serif`, // Ensure fallback
      lineHeight: font.metrics.lineHeight || 1.5,
      // More dynamic styling based on context/mood/accessibility
      color: state.userPreferences.accessibilityMode ? '#333' : 'inherit',
      fontSize: context === FontUsageContext.HEADLINE ? '3rem' : (context === FontUsageContext.BODY_TEXT ? '1rem' : '1.5rem'),
      fontWeight: mood.includes(FontMoodTag.BOLD) ? 'bold' : 'normal',
      // Invented Feature 52: Variable Font Axis Control (if font supports it)
      fontVariationSettings: (font as any).variableAxes ? `'wght' ${state.userPreferences.preferredMoods.includes(FontMoodTag.BOLD) ? 700 : 400}` : 'normal',
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-xl shadow-2xl space-y-6 border border-gray-200"
    >
      <h2
        className="text-gray-900 font-extrabold mb-4 transition-all duration-300 ease-in-out"
        style={getDynamicStyles(headlineFont)}
      >
        {headlineFont?.name || 'Headline Font Preview'}
        <br />
        <span className="text-5xl">{currentHeadlineText}</span>
      </h2>
      <p
        className="text-gray-700 transition-all duration-300 ease-in-out"
        style={getDynamicStyles(bodyFont)}
      >
        {bodyFont?.name || 'Body Font Preview'}
        <br />
        <span className="text-base">{currentBodyText}</span>
      </p>

      {showMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 border-t pt-4 mt-6">
          {headlineFont && (
            <div>
              <h4 className="font-semibold text-gray-800">Headline Metrics:</h4>
              <p>X-Height: {headlineFont.metrics.xHeight}</p>
              <p>Cap-Height: {headlineFont.metrics.capHeight}</p>
              <p>Readability: {(headlineFont.metrics.readabilityScore * 100).toFixed(1)}%</p>
            </div>
          )}
          {bodyFont && (
            <div>
              <h4 className="font-semibold text-gray-800">Body Metrics:</h4>
              <p>X-Height: {bodyFont.metrics.xHeight}</p>
              <p>Cap-Height: {bodyFont.metrics.capHeight}</p>
              <p>Readability: {(bodyFont.metrics.readabilityScore * 100).toFixed(1)}%</p>
            </div>
          )}
          {state.accessibilityReport && (
            <div>
              <h4 className="font-semibold text-red-700">Accessibility Alerts:</h4>
              {state.accessibilityReport.contrastRatioIssues.map((issue, i) => (
                <p key={i} className="text-red-500 text-xs">Contrast: {issue.actual.toFixed(2)} (Req: {issue.required.toFixed(2)})</p>
              ))}
              {state.accessibilityReport.fontSizeIssues.map((issue, i) => (
                <p key={i} className="text-red-500 text-xs">Size ({issue.element}): {issue.actual} (Rec: {issue.recommended})</p>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Invented Feature 53: AI Suggestion Panel (AISP)
// Displays AI-generated font pairing suggestions with filtering and interaction.
export const AISuggestionPanel: React.FC = () => {
  const { state, actions } = useEnterpriseFontDesignStudio();
  const [filterMood, setFilterMood] = useState<FontMoodTag | 'All'>('All');
  const [filterContext, setFilterContext] = useState<FontUsageContext | 'All'>('All');
  const [numSuggestions, setNumSuggestions] = useState(5);

  const filteredSuggestions = useMemo(() => {
    return state.aiRecommendations.filter(pairing => {
      const moodMatch = filterMood === 'All' || pairing.contextSuitability.some(cs => cs.reason.includes(filterMood));
      const contextMatch = filterContext === 'All' || pairing.contextSuitability.some(cs => cs.context === filterContext);
      return moodMatch && contextMatch;
    }).slice(0, numSuggestions);
  }, [state.aiRecommendations, filterMood, filterContext, numSuggestions]);

  // Invented Feature 54: Predictive Filtering & Ranking
  const sortedSuggestions = useMemo(() => {
    // Rank by a weighted average of compatibility, aesthetics, and readability
    return [...filteredSuggestions].sort((a, b) => {
      const scoreA = (a.compatibilityScore * 0.4) + (a.aestheticsScore * 0.3) + (a.readabilityScore * 0.3);
      const scoreB = (b.compatibilityScore * 0.4) + (b.aestheticsScore * 0.3) + (b.readabilityScore * 0.3);
      return scoreB - scoreA;
    });
  }, [filteredSuggestions]);

  const handleGenerateSuggestions = useCallback(debounce(async () => {
    if (!state.activeBrand) {
      actions.dispatch({ type: 'SET_ERROR', payload: 'Please select an active brand to generate suggestions.' });
      return;
    }
    await actions.suggestFontPairings({
      brandIdentity: state.activeBrand,
      context: filterContext === 'All' ? FontUsageContext.WEB : filterContext,
      targetMoods: filterMood === 'All' ? [FontMoodTag.PROFESSIONAL, FontMoodTag.MODERN] : [filterMood],
      existingTextSample: state.currentTextSample,
      numSuggestions: numSuggestions,
    });
    confetti(); // Celebrate new suggestions! (Invented Feature 55: Gamified Feedback)
  }, 500), [state.activeBrand, filterContext, filterMood, numSuggestions, state.currentTextSample, actions]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-purple-50 to-indigo-100 p-8 rounded-xl shadow-2xl space-y-6 border border-purple-200"
    >
      <h3 className="text-3xl font-bold text-indigo-800 mb-4">AI Pairing Suggestions <span className="text-purple-500 text-base">(Powered by Gemini & ChatGPT)</span></h3>

      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="mood-filter" className="block text-sm font-medium text-gray-700">Filter by Mood</label>
          <select
            id="mood-filter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value as FontMoodTag | 'All')}
          >
            <option value="All">All Moods</option>
            {Object.values(FontMoodTag).map(mood => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="context-filter" className="block text-sm font-medium text-gray-700">Filter by Context</label>
          <select
            id="context-filter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            value={filterContext}
            onChange={(e) => setFilterContext(e.target.value as FontUsageContext | 'All')}
          >
            <option value="All">All Contexts</option>
            {Object.values(FontUsageContext).map(context => (
              <option key={context} value={context}>{context}</option>
            ))}
          </select>
        </div>
        <div className="flex-none w-24">
          <label htmlFor="num-suggestions" className="block text-sm font-medium text-gray-700">Count</label>
          <input
            type="number"
            id="num-suggestions"
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            value={numSuggestions}
            onChange={(e) => setNumSuggestions(Math.max(1, Math.min(10, parseInt(e.target.value))))} // Max 10 suggestions for demo
            min="1"
            max="10"
          />
        </div>
        <button
          onClick={handleGenerateSuggestions}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-colors duration-200 flex-shrink-0"
          disabled={state.loading}
        >
          {state.loading ? 'Generating...' : 'Generate AI Suggestions'}
        </button>
      </div>

      <AnimatePresence>
        {sortedSuggestions.length === 0 ? (
          <motion.p
            key="no-suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 italic text-center py-4"
          >
            No AI suggestions yet. Select a brand and generate some!
          </motion.p>
        ) : (
          <div className="space-y-4">
            {sortedSuggestions.map(pairing => {
              const headlineFont = state.allFonts.find(f => f.id === pairing.headlineFontId);
              const bodyFont = state.allFonts.find(f => f.id === pairing.bodyFontId);
              return (
                <motion.div
                  key={pairing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="flex-grow">
                    <p className="font-semibold text-lg text-indigo-700">
                      <span className="font-display" style={{ fontFamily: `'${headlineFont?.name}', sans-serif` }}>{headlineFont?.name || 'N/A'}</span> &{' '}
                      <span className="font-body" style={{ fontFamily: `'${bodyFont?.name}', sans-serif` }}>{bodyFont?.name || 'N/A'}</span>
                    </p>
                    <p className="text-sm text-gray-600 italic mt-1">{pairing.rationale}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <span>Comp: {pairing.compatibilityScore.toFixed(0)}% | </span>
                      <span>Aesth: {pairing.aestheticsScore.toFixed(0)}% | </span>
                      <span>Read: {pairing.readabilityScore.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex-none">
                    <button
                      onClick={() => actions.dispatch({ type: 'SET_ACTIVE_PAIRING', payload: pairing })}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-2 px-4 rounded-md transition-colors duration-200 mr-2"
                    >
                      Use Pairing
                    </button>
                    <button
                      onClick={() => actions.dispatch({ type: 'ADD_PAIRING', payload: pairing })} // Save to permanent pairings
                      className="bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded-md transition-colors duration-200"
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Invented Feature 56: Font Management Dashboard (FMD)
// Provides an overview and management interface for all font assets.
export const FontManagementDashboard: React.FC = () => {
  const { state, actions } = useEnterpriseFontDesignStudio();
  const [searchTerm, setSearchTerm] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [newFontMetadata, setNewFontMetadata] = useState<Partial<FontAsset>>({
    name: '', foundry: '', designer: [], licenseType: 'Trial', tags: [], classification: [], supportedLanguages: [], moodTags: []
  });

  const filteredFonts = useMemo(() => {
    return state.allFonts.filter(font =>
      font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      font.foundry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      font.designer.some(d => d.toLowerCase().includes(searchTerm.toLowerCase())) ||
      font.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [state.allFonts, searchTerm]);

  const handleFileUpload = async () => {
    if (!fileToUpload) {
      alert('Please select a font file to upload.');
      return;
    }
    await actions.uploadNewFont(fileToUpload, newFontMetadata);
    setFileToUpload(null);
    setNewFontMetadata({ name: '', foundry: '', designer: [], licenseType: 'Trial', tags: [], classification: [], supportedLanguages: [], moodTags: [] });
  };

  const handleProcessFont = async (fontId: string) => {
    await actions.processFontForWeb(fontId);
  };

  const handleLicenseAudit = async () => {
    await actions.performLicenseAudit(state.activeBrand?.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 space-y-8"
    >
      <h3 className="text-3xl font-bold text-gray-900 mb-6">Font Asset Management</h3>

      {/* Upload New Font Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-100">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Upload New Font</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="font-file" className="block text-sm font-medium text-gray-700">Font File (.ttf, .otf)</label>
            <input
              type="file"
              id="font-file"
              accept=".ttf,.otf"
              onChange={(e) => e.target.files && setFileToUpload(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div>
            <label htmlFor="font-name" className="block text-sm font-medium text-gray-700">Font Name</label>
            <input
              type="text"
              id="font-name"
              value={newFontMetadata.name}
              onChange={(e) => setNewFontMetadata({ ...newFontMetadata, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="font-foundry" className="block text-sm font-medium text-gray-700">Foundry</label>
            <input
              type="text"
              id="font-foundry"
              value={newFontMetadata.foundry}
              onChange={(e) => setNewFontMetadata({ ...newFontMetadata, foundry: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="font-license" className="block text-sm font-medium text-gray-700">License Type</label>
            <select
              id="font-license"
              value={newFontMetadata.licenseType}
              onChange={(e) => setNewFontMetadata({ ...newFontMetadata, licenseType: e.target.value as FontAsset['licenseType'] })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Trial">Trial</option>
              <option value="Open Source">Open Source</option>
              <option value="Commercial">Commercial</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleFileUpload}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-colors duration-200"
          disabled={state.loading || !fileToUpload || !newFontMetadata.name}
        >
          {state.loading ? 'Uploading...' : 'Upload Font Asset'}
        </button>
      </div>

      {/* Font List and Actions */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search fonts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mr-4"
        />
        <button
          onClick={handleLicenseAudit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-colors duration-200"
          disabled={state.loading}
        >
          {state.loading ? 'Auditing...' : 'Perform License Audit'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Font Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foundry</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFonts.map((font) => (
              <tr key={font.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{font.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{font.foundry}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{font.licenseType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{font.version}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleProcessFont(font.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    disabled={state.loading}
                    title="Process font for web (WOFF2, WOFF)"
                  >
                    {state.loading ? 'Processing...' : 'Process Web'}
                  </button>
                  <button
                    onClick={() => console.log('Edit font:', font.id)}
                    className="text-yellow-600 hover:text-yellow-900 mr-3"
                    title="Edit font details"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => actions.dispatch({ type: 'DELETE_FONT', payload: font.id })}
                    className="text-red-600 hover:text-red-900"
                    disabled={state.loading}
                    title="Delete font asset"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFonts.length === 0 && (
          <p className="text-center text-gray-500 py-4">No fonts found matching your criteria.</p>
        )}
      </div>
    </motion.div>
  );
};

// Invented Feature 57: Global Notification System (GNS)
// Displays transient messages, errors, and success notifications.
export const GlobalNotificationSystem: React.FC = () => {
  const { state, dispatch } = useEnterpriseFontDesignStudio();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state.error) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        dispatch({ type: 'SET_ERROR', payload: null });
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [state.error, dispatch]);

  if (!visible || !state.error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-xl z-50 flex items-center space-x-2"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{state.error}</span>
      <button onClick={() => dispatch({ type: 'SET_ERROR', payload: null })} className="ml-4 text-red-200 hover:text-white">
        &times;
      </button>
    </motion.div>
  );
};

// Invented Feature 58: Typography Lab Component Wrapper (TLCW)
// A more advanced wrapper around the original TypographyLab, providing additional context and controls.
// This is where the 'FontPairingTool' (alias for TypographyLab) could be rendered internally.
export const TypographyLabWrapper: React.FC = () => {
  const { state, actions } = useEnterpriseFontDesignStudio();
  const { FontPairingTool: OriginalTypographyLab } = (window as any).TypographyLabModule || {}; // Simulate dynamic import or global access to original TypographyLab

  const handleTextChange = useCallback(debounce((text: string) => {
    actions.dispatch({ type: 'SET_CURRENT_TEXT_SAMPLE', payload: text });
  }, 300), [actions]);

  if (!OriginalTypographyLab) {
    return (
      <div className="bg-orange-100 p-6 rounded-lg border-l-4 border-orange-500 text-orange-700">
        <p className="font-bold">Warning:</p>
        <p>The original `TypographyLab` (aliased as `FontPairingTool`) component could not be loaded. Please ensure `TypographyLab.tsx` is correctly configured and available.</p>
        <p>This wrapper is designed to enhance its capabilities, but requires the base component to function.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 space-y-6"
    >
      <h3 className="text-3xl font-bold text-gray-900 mb-4">Typography Lab Interface <span className="text-gray-500 text-base">(Enhanced by TIN)</span></h3>
      <div className="mb-4">
        <label htmlFor="text-sample" className="block text-sm font-medium text-gray-700">Text Sample for Preview:</label>
        <textarea
          id="text-sample"
          rows={3}
          defaultValue={state.currentTextSample}
          onChange={(e) => handleTextChange(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter text to preview fonts..."
        ></textarea>
      </div>
      {/* Here we would render the actual TypographyLab component, passing it props from our state */}
      <div className="border border-dashed border-gray-300 p-6 rounded-md text-center text-gray-600 italic">
        {/*
          Invented Feature 59: Dynamic TypographyLab Prop Injection
          In a real scenario, TypographyLab would accept props like:
          <OriginalTypographyLab
            activeHeadlineFont={state.allFonts.find(f => f.id === state.activePairing?.headlineFontId)}
            activeBodyFont={state.allFonts.find(f => f.id === state.activePairing?.bodyFontId)}
            previewText={state.currentTextSample}
            brandingColors={state.activeBrand?.primaryColors}
            // ... and many more
          />
          For this expansion, we simulate its integration.
        */}
        <p>The original <span className="font-semibold">TypographyLab</span> (aliased `FontPairingTool`) would render here,</p>
        <p>intelligently pre-populated and controlled by the EnterpriseFontDesignStudio's state.</p>
        <p className="text-sm mt-2">Example: Displaying {state.activePairing?.headlineFontId || 'default'} & {state.activePairing?.bodyFontId || 'default'} with "{state.currentTextSample.substring(0, 30)}..."</p>
      </div>
      {state.activePairing && (
        <AdvancedTypographyPreview
          headlineFont={state.allFonts.find(f => f.id === state.activePairing?.headlineFontId)}
          bodyFont={state.allFonts.find(f => f.id === state.activePairing?.bodyFontId)}
          headlineText={state.currentTextSample}
          bodyText={state.currentTextSample}
          showMetrics={state.userPreferences.accessibilityMode}
          mood={state.activeBrand?.brandTone || []}
          context={FontUsageContext.WEB} // or dynamically determined
        />
      )}
    </motion.div>
  );
};

// Invented Feature 60: Brand & Project Management Panel (BPMP)
// Manages brands, projects, and their associated typography guidelines.
export const BrandProjectManagementPanel: React.FC = () => {
  const { state, actions } = useEnterpriseFontDesignStudio();
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandIndustry, setNewBrandIndustry] = useState('');
  const [newBrandTargetAudience, setNewBrandTargetAudience] = useState<string[]>([]);
  const [newBrandCoreValues, setNewBrandCoreValues] = useState<string[]>([]);
  const [newBrandTone, setNewBrandTone] = useState<FontMoodTag[]>([]);
  const [newBrandPrimaryColor, setNewBrandPrimaryColor] = useState('#000000'); // Hex input

  const handleAddBrand = async () => {
    if (!newBrandName) {
      alert('Brand name is required.');
      return;
    }
    const newBrand: BrandIdentity = {
      id: uuidv4(),
      name: newBrandName,
      industry: newBrandIndustry,
      targetAudience: newBrandTargetAudience,
      coreValues: newBrandCoreValues,
      brandTone: newBrandTone,
      primaryColors: [newBrandPrimaryColor],
      secondaryColors: [],
    };
    await actions.repositories.brands.save(newBrand);
    actions.dispatch({ type: 'ADD_BRAND', payload: newBrand });
    setNewBrandName('');
    setNewBrandIndustry('');
    setNewBrandTargetAudience([]);
    setNewBrandCoreValues([]);
    setNewBrandTone([]);
    setNewBrandPrimaryColor('#000000');
  };

  const handleActiveBrandChange = (brandId: string) => {
    const brand = state.allBrands.find(b => b.id === brandId);
    actions.dispatch({ type: 'SET_ACTIVE_BRAND', payload: brand });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 space-y-6"
    >
      <h3 className="text-3xl font-bold text-gray-900 mb-4">Brand & Project Management</h3>

      {/* Active Brand Selector */}
      <div className="mb-6">
        <label htmlFor="active-brand-select" className="block text-sm font-medium text-gray-700">Active Brand:</label>
        <select
          id="active-brand-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
          value={state.activeBrand?.id || ''}
          onChange={(e) => handleActiveBrandChange(e.target.value)}
        >
          <option value="">Select a Brand</option>
          {state.allBrands.map(brand => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
        {state.activeBrand && (
          <div className="mt-2 p-3 bg-indigo-50 rounded-md text-sm text-indigo-800">
            <p><strong>Selected Brand:</strong> {state.activeBrand.name}</p>
            <p><strong>Industry:</strong> {state.activeBrand.industry}</p>
            <p><strong>Tone:</strong> {state.activeBrand.brandTone.join(', ')}</p>
          </div>
        )}
      </div>

      {/* Add New Brand Section */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-inner border border-blue-100">
        <h4 className="text-xl font-semibold text-blue-800 mb-4">Add New Brand Identity</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="new-brand-name" className="block text-sm font-medium text-gray-700">Brand Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="new-brand-name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="new-brand-industry" className="block text-sm font-medium text-gray-700">Industry</label>
            <input
              type="text"
              id="new-brand-industry"
              value={newBrandIndustry}
              onChange={(e) => setNewBrandIndustry(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="new-brand-audience" className="block text-sm font-medium text-gray-700">Target Audience (comma-separated)</label>
            <input
              type="text"
              id="new-brand-audience"
              value={newBrandTargetAudience.join(', ')}
              onChange={(e) => setNewBrandTargetAudience(e.target.value.split(',').map(s => s.trim()))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="new-brand-values" className="block text-sm font-medium text-gray-700">Core Values (comma-separated)</label>
            <input
              type="text"
              id="new-brand-values"
              value={newBrandCoreValues.join(', ')}
              onChange={(e) => setNewBrandCoreValues(e.target.value.split(',').map(s => s.trim()))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="new-brand-tone" className="block text-sm font-medium text-gray-700">Brand Tone</label>
            <select
              multiple
              id="new-brand-tone"
              value={newBrandTone}
              onChange={(e) => setNewBrandTone(Array.from(e.target.selectedOptions, option => option.value as FontMoodTag))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-24"
            >
              {Object.values(FontMoodTag).map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="new-brand-primary-color" className="block text-sm font-medium text-gray-700">Primary Brand Color</label>
            <input
              type="color"
              id="new-brand-primary-color"
              value={newBrandPrimaryColor}
              onChange={(e) => setNewBrandPrimaryColor(e.target.value)}
              className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleAddBrand}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-colors duration-200"
          disabled={state.loading || !newBrandName}
        >
          {state.loading ? 'Adding...' : 'Add Brand Identity'}
        </button>
      </div>

      {/* Listing existing brands */}
      <h4 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Existing Brands</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.allBrands.map(brand => (
              <tr key={brand.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{brand.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{brand.industry}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{brand.brandTone.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => actions.dispatch({ type: 'SET_ACTIVE_BRAND', payload: brand })}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    title="Set as Active Brand"
                  >
                    Set Active
                  </button>
                  <button
                    onClick={() => console.log('Edit brand:', brand.id)}
                    className="text-yellow-600 hover:text-yellow-900 mr-3"
                    title="Edit brand details"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => actions.repositories.brands.delete(brand.id).then(() => actions.dispatch({ type: 'SET_BRANDS', payload: state.allBrands.filter(b => b.id !== brand.id) }))}
                    className="text-red-600 hover:text-red-900"
                    disabled={state.loading}
                    title="Delete brand"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {state.allBrands.length === 0 && (
          <p className="text-center text-gray-500 py-4">No brands defined yet. Add one above!</p>
        )}
      </div>
    </motion.div>
  );
};


// Invented Module 7: The Grand Orchestrator - EnterpriseFontDesignStudio
// Purpose: This is the actual high-level component that brings all the modules together.
// It acts as the main application interface for the Type-Intelligence Nexus.

// Invented Feature 61: Main Studio Layout & Navigation
export const EnterpriseFontDesignStudio: React.FC = () => {
  const { state, actions } = useEnterpriseFontDesignStudio();
  const [activeTab, setActiveTab] = useState<'typography' | 'ai-suggestions' | 'font-management' | 'brands' | 'settings'>('typography');

  // Invented Feature 62: Dynamic Loading Indicator (based on global state)
  const LoadingOverlay: React.FC = () => (
    <AnimatePresence>
      {state.loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
        >
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
            <p className="mt-4 text-white text-lg font-semibold">
              {state.error ? 'Error encountered!' : 'Processing request...'}
            </p>
            {state.error && <p className="text-red-300 text-sm mt-2">{state.error}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Invented Feature 63: User Activity Tracking (UAT)
  // Tracks user interactions within the studio for analytics and personalization.
  useEffect(() => {
    // Invented External Service 32: Amplitude (Simulated)
    // Invented External Service 33: Mixpanel (Simulated)
    const trackActivity = debounce((eventName: string, properties: any) => {
      console.log(`UAT: User activity recorded: ${eventName}`, properties);
      // Actual tracking logic here
    }, 1000);

    const handleTabChange = (tabName: string) => {
      trackActivity('tab_viewed', { tab: tabName });
    };

    // Simulate initial load tracking
    trackActivity('studio_loaded', { initialTab: activeTab });

    return () => {
      // Cleanup if needed
    };
  }, [activeTab]); // Only re-run when activeTab changes for this effect

  // Invented Feature 64: Personalized UI Theming
  const studioThemeClasses = state.userPreferences.theme === 'dark'
    ? 'bg-gray-800 text-gray-100'
    : 'bg-gray-50 text-gray-900';

  return (
    <EnterpriseFontDesignStudioProvider>
      <div className={`min-h-screen ${studioThemeClasses} font-sans transition-colors duration-300`}>
        <GlobalNotificationSystem />
        <LoadingOverlay />

        <header className="bg-indigo-700 text-white p-4 shadow-lg sticky top-0 z-40">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-indigo-200">Citibank Demo</span> Enterprise Font Design Studio
            </h1>
            <nav className="space-x-4">
              <button onClick={() => setActiveTab('typography')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'typography' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}>Typography Lab</button>
              <button onClick={() => setActiveTab('ai-suggestions')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'ai-suggestions' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}>AI Suggestions</button>
              <button onClick={() => setActiveTab('font-management')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'font-management' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}>Font Management</button>
              <button onClick={() => setActiveTab('brands')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'brands' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}>Brands & Projects</button>
              <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}>Settings</button>
            </nav>
          </div>
        </header>

        <main className="container mx-auto p-8 py-10">
          {activeTab === 'typography' && (
            <TypographyLabWrapper />
          )}
          {activeTab === 'ai-suggestions' && (
            <AISuggestionPanel />
          )}
          {activeTab === 'font-management' && (
            <FontManagementDashboard />
          )}
          {activeTab === 'brands' && (
            <BrandProjectManagementPanel />
          )}
          {activeTab === 'settings' && (
            <SettingsPanel />
          )}
        </main>

        <footer className="bg-gray-800 text-gray-300 p-6 text-center text-sm shadow-inner mt-10">
          <p>&copy; {new Date().getFullYear()} Citibank Demo Business Inc. All rights reserved.</p>
          <p className="mt-2">Powered by Type-Intelligence Nexus (TIN) - An original invention of James Burvel O’Callaghan III.</p>
          <p>Integrated with Google Gemini, OpenAI ChatGPT, and {Object.keys(AIServiceProvider).length - 2} other simulated enterprise services.</p>
          {/* Invented Feature 65: Dynamic External Service Listing */}
          <div className="mt-4 text-xs text-gray-500">
            <p className="font-semibold">Simulated External Services in use:</p>
            <ul className="list-disc list-inside mt-1 max-w-xl mx-auto flex flex-wrap justify-center">
              {Object.values(FontStorageProvider).map((p, i) => <li key={i} className="mr-4">{p}</li>)}
              {Object.values(AIServiceProvider).map((p, i) => <li key={i+100} className="mr-4">{p}</li>)}
              <li className="mr-4">Immer</li>
              <li className="mr-4">Lodash Debounce</li>
              <li className="mr-4">UUID</li>
              <li className="mr-4">D3.js</li>
              <li className="mr-4">Canvas Confetti</li>
              <li className="mr-4">Moment.js</li>
              <li className="mr-4">Framer Motion</li>
              <li className="mr-4">Google Cloud Firestore</li>
              <li className="mr-4">AWS DynamoDB</li>
              <li className="mr-4">Azure Cosmos DB</li>
              <li className="mr-4">VirusTotal API</li>
              <li className="mr-4">Anti-Malware Scan Service</li>
              <li className="mr-4">Cloudinary Font Optimization</li>
              <li className="mr-4">Font Squirrel Generator API</li>
              <li className="mr-4">Legal Compliance Checker API</li>
              <li className="mr-4">Blockchain License Verification</li>
              <li className="mr-4">AWS Secrets Manager</li>
              <li className="mr-4">Azure Key Vault</li>
              <li className="mr-4">HashiCorp Vault</li>
              <li className="mr-4">Sentry</li>
              <li className="mr-4">LogRocket</li>
              <li className="mr-4">Datadog RUM</li>
              <li className="mr-4">Amplitude</li>
              <li className="mr-4">Mixpanel</li>
              <li className="mr-4">Google Fonts Loader</li>
              <li className="mr-4">Font Face Observer</li>
              <li className="mr-4">User Profile Service</li>
              {/* Add more as needed, aiming for the 'hundreds' concept */}
              <li className="mr-4">Figma Design System API</li> {/* Invented External Service 34 */}
              <li className="mr-4">Storybook API</li> {/* Invented External Service 35 */}
              <li className="mr-4">WCAG Accessibility API</li> {/* Invented External Service 36 */}
              <li className="mr-4">Brand Style Guide CMS</li> {/* Invented External Service 37 */}
              <li className="mr-4">Global CDN Network (Akamai, Cloudflare)</li> {/* Invented External Service 38 */}
              <li className="mr-4">Performance Budgeting Tool</li> {/* Invented External Service 39 */}
              <li className="mr-4">A/B Testing Platform (Optimizely, VWO)</li> {/* Invented External Service 40 */}
              <li className="mr-4">Customer Feedback (Qualaroo, Hotjar)</li> {/* Invented External Service 41 */}
              <li className="mr-4">Translation & Localization Services (DeepL, Google Translate API)</li> {/* Invented External Service 42 */}
              <li className="mr-4">CRM Integration (Salesforce) for Brand Context</li> {/* Invented External Service 43 */}
              <li className="mr-4">Marketing Automation (HubSpot) for Campaign-specific Fonts</li> {/* Invented External Service 44 */}
              <li className="mr-4">ERP Integration (SAP) for Licensing Cost Tracking</li> {/* Invented External Service 45 */}
              <li className="mr-4">Blockchain-based Digital Asset Management for Font Provenance</li> {/* Invented External Service 46 */}
              <li className="mr-4">Biometric User Authentication for Secure Access</li> {/* Invented External Service 47 */}
              <li className="mr-4">Quantum-Safe Encryption for Font Data</li> {/* Invented External Service 48 (Future-proofing) */}
              <li className="mr-4">Emotional AI for User Sentiment-driven Font Adaptation</li> {/* Invented External Service 49 */}
              <li className="mr-4">Predictive Analytics for Font Trend Forecasting</li> {/* Invented External Service 50 */}
              <li className="mr-4">Real-time Collab (WebSockets, Pusher)</li> {/* Invented External Service 51 */}
              <li className="mr-4">Version Control for Design (Abstract, Plant)</li> {/* Invented External Service 52 */}
              <li className="mr-4">Image Recognition for Context (Google Vision API)</li> {/* Invented External Service 53 */}
              <li className="mr-4">Natural Language Generation for Font Rationales</li> {/* Invented External Service 54 */}
              <li className="mr-4">Dynamic Content Personalization Engine</li> {/* Invented External Service 55 */}
              <li className="mr-4">Device Capability Detection (DeviceAtlas)</li> {/* Invented External Service 56 */}
              <li className="mr-4">Web Font Loading Optimization Service</li> {/* Invented External Service 57 */}
              <li className="mr-4">GDPR/CCPA Compliance Monitoring</li> {/* Invented External Service 58 */}
              <li className="mr-4">AI-powered Font Pairing Feedback Loop</li> {/* Invented External Service 59 */}
              <li className="mr-4">Micro-Frontends for UI Scaling</li> {/* Invented External Service 60 */}
              <li className="mr-4">Kubernetes Orchestration for Backend Services</li> {/* Invented External Service 61 */}
              <li className="mr-4">Serverless Functions for Event Processing</li> {/* Invented External Service 62 */}
              <li className="mr-4">GraphQL API Gateway for Data Aggregation</li> {/* Invented External Service 63 */}
              <li className="mr-4">OpenAPI/Swagger for API Documentation</li> {/* Invented External Service 64 */}
              <li className="mr-4">OAuth 2.0 for Secure API Access</li> {/* Invented External Service 65 */}
              <li className="mr-4">Single Sign-On (SSO) Integration</li> {/* Invented External Service 66 */}
              <li className="mr-4">Dark Mode Toggle Service</li> {/* Invented External Service 67 */}
              <li className="mr-4">User Onboarding & Walkthrough Tours</li> {/* Invented External Service 68 */}
              <li className="mr-4">Interactive Tutorials for New Features</li> {/* Invented External Service 69 */}
              <li className="mr-4">Contextual Help & Tooltips</li> {/* Invented External Service 70 */}
              <li className="mr-4">Multi-language Support (i18n)</li> {/* Invented External Service 71 */}
              <li className="mr-4">Time-series Database for Performance Metrics</li> {/* Invented External Service 72 */}
              <li className="mr-4">Vector Database for Font Feature Embeddings</li> {/* Invented External Service 73 */}
              <li className
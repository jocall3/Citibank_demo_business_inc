// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback, useEffect, useRef, createContext, useContext, useReducer } from 'react';
import { generateCodingChallengeStream } from '../../services/index.ts';
import { BeakerIcon } from '../icons.tsx';
import { LoadingSpinner } from '../shared/index.tsx';
import { MarkdownRenderer } from '../shared/index.tsx';

// --- Start of Massive Feature Expansion ---

// Story Arc 1: The Foundation - Establishing the Multi-Modal AI Core
// The journey began with a simple AI challenge generator. But President O'Callaghan III envisioned something
// far grander: a multi-modal, highly customizable, and deeply integrated learning platform.
// This first phase lays the groundwork for connecting to various cutting-edge AI models
// and defining a rich structure for challenges and user interactions.

// --- Core AI Model Enums and Types ---

/**
 * @invented AIModel
 * @description Represents the available Artificial Intelligence models for generating coding challenges.
 * This enum was invented to allow dynamic selection and integration of various large language models,
 * ensuring flexibility and future-proofing the platform against emerging AI technologies.
 */
export enum AIModel {
    GEMINI_PRO = 'GEMINI_PRO', // Google's powerful Gemini Pro model
    CHATGPT_4O = 'CHATGPT_4O', // OpenAI's latest GPT-4 Omni model
    CHATGPT_3_5 = 'CHATGPT_3_5_TURBO', // OpenAI's cost-effective GPT-3.5 Turbo model
    CLAUDE_3_OPUS = 'CLAUDE_3_OPUS', // Anthropic's state-of-the-art Claude 3 Opus
    LLAMA_3_8B = 'LLAMA_3_8B', // Meta's Llama 3 8B model, often self-hosted or via API
    COHERE_COMMAND_R_PLUS = 'COHERE_COMMAND_R_PLUS', // Cohere's powerful Command-R+ model
    CUSTOM_FINE_TUNED = 'CUSTOM_FINE_TUNED', // For internal or enterprise-specific fine-tuned models
}

/**
 * @invented ProgrammingLanguage
 * @description Defines the supported programming languages for challenge generation and solution evaluation.
 * This enum was developed to provide users with a comprehensive selection of languages,
 * facilitating tailored learning experiences across various development stacks.
 */
export enum ProgrammingLanguage {
    JAVASCRIPT = 'JAVASCRIPT',
    TYPESCRIPT = 'TYPESCRIPT',
    PYTHON = 'PYTHON',
    JAVA = 'JAVA',
    C_PLUS_PLUS = 'C_PLUS_PLUS',
    GO = 'GO',
    RUST = 'RUST',
    PHP = 'PHP',
    RUBY = 'RUBY',
    SWIFT = 'SWIFT',
    KOTLIN = 'KOTLIN',
    C_SHARP = 'C_SHARP',
    SCALA = 'SCALA',
    PERL = 'PERL',
    HASKELL = 'HASKELL',
    SQL = 'SQL',
    DART = 'DART',
    ELIXIR = 'ELIXIR',
    OCAML = 'OCAML',
    F_SHARP = 'F_SHARP',
    JULIA = 'JULIA',
    R = 'R',
    LISP = 'LISP',
    ASSEMBLY = 'ASSEMBLY', // For low-level enthusiasts
    SHELL = 'SHELL', // For scripting challenges
}

/**
 * @invented ChallengeDifficulty
 * @description Specifies the difficulty levels for coding challenges.
 * This enum was created to enable granular control over the complexity of generated problems,
 * catering to beginners, intermediate learners, and seasoned experts alike.
 */
export enum ChallengeDifficulty {
    NOOB = 'NOOB', // Extremely simple, for absolute beginners
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
    EXPERT = 'EXPERT',
    MASTER = 'MASTER', // Requires deep understanding and advanced techniques
    GOD_TIER = 'GOD_TIER', // System design, multi-component, complex constraints
}

/**
 * @invented ChallengeTopic
 * @description Categorizes the subject matter of coding challenges.
 * This comprehensive list of topics was designed to allow users to focus their learning
 * on specific areas of computer science and software engineering, making the platform
 * a versatile tool for skill development.
 */
export enum ChallengeTopic {
    ALGORITHMS = 'ALGORITHMS',
    DATA_STRUCTURES = 'DATA_STRUCTURES',
    WEB_DEVELOPMENT_FRONTEND = 'WEB_DEVELOPMENT_FRONTEND',
    WEB_DEVELOPMENT_BACKEND = 'WEB_DEVELOPMENT_BACKEND',
    MOBILE_DEVELOPMENT = 'MOBILE_DEVELOPMENT',
    AI_MACHINE_LEARNING = 'AI_MACHINE_LEARNING',
    DEVOPS = 'DEVOPS',
    CLOUD_COMPUTING = 'CLOUD_COMPUTING',
    BLOCKCHAIN_DECENTRALIZED_APPS = 'BLOCKCHAIN_DECENTRALIZED_APPS',
    CYBERSECURITY = 'CYBERSECURITY',
    DATABASE_SYSTEMS = 'DATABASE_SYSTEMS',
    OPERATING_SYSTEMS = 'OPERATING_SYSTEMS',
    NETWORKING = 'NETWORKING',
    SYSTEM_DESIGN = 'SYSTEM_DESIGN',
    GAME_DEVELOPMENT = 'GAME_DEVELOPMENT',
    COMPILER_DESIGN = 'COMPILER_DESIGN',
    EMBEDDED_SYSTEMS = 'EMBEDDED_SYSTEMS',
    PARALLEL_COMPUTING = 'PARALLEL_COMPUTING',
    QUANTUM_COMPUTING = 'QUANTUM_COMPUTING', // Future-proofing for advanced research
    FINANCIAL_ALGORITHMS = 'FINANCIAL_ALGORITHMS', // Citibank specific relevance
    DATA_SCIENCE_ANALYTICS = 'DATA_SCIENCE_ANALYTICS',
}

/**
 * @invented ChallengeType
 * @description Specifies the pedagogical type or goal of the coding challenge.
 * This enumeration was devised to offer diverse learning objectives, from bug fixing
 * to full system design, providing a well-rounded training experience.
 */
export enum ChallengeType {
    ALGORITHMIC_PUZZLE = 'ALGORITHMIC_PUZZLE',
    FEATURE_IMPLEMENTATION = 'FEATURE_IMPLEMENTATION',
    BUG_FIX = 'BUG_FIX',
    CODE_REFACTORING = 'CODE_REFACTORING',
    SYSTEM_DESIGN = 'SYSTEM_DESIGN',
    PERFORMANCE_OPTIMIZATION = 'PERFORMANCE_OPTIMIZATION',
    SECURITY_VULNERABILITY_IDENTIFICATION = 'SECURITY_VULNERABILITY_IDENTIFICATION',
    API_INTEGRATION = 'API_INTEGRATION',
    DATABASE_SCHEMA_DESIGN = 'DATABASE_SCHEMA_DESIGN',
    UNIT_TESTING_CHALLENGE = 'UNIT_TESTING_CHALLENGE',
    FRONTEND_UI_COMPONENT = 'FRONTEND_UI_COMPONENT',
    BACKEND_API_ENDPOINT = 'BACKEND_API_ENDPOINT',
    CONTAINERIZATION_DEVOPS = 'CONTAINERIZATION_DEVOPS',
}

/**
 * @invented IChallengeOptions
 * @description Interface defining the configurable parameters for generating a coding challenge.
 * This complex interface was engineered to provide users with unparalleled control over the
 * challenge generation process, allowing for highly specific and customized problem statements.
 */
export interface IChallengeOptions {
    model: AIModel;
    programmingLanguage: ProgrammingLanguage;
    difficulty: ChallengeDifficulty;
    topics: ChallengeTopic[];
    challengeType: ChallengeType;
    estimatedTimeMinutes?: number; // Optional, AI can suggest or user can request
    includeSpecificKeywords?: string[];
    excludeSpecificKeywords?: string[];
    maxLinesOfCode?: number;
    requireDataStructure?: string[]; // e.g., 'HashMap', 'LinkedList', 'Graph'
    requireAlgorithm?: string[]; // e.g., 'Dynamic Programming', 'Dijkstra', 'Merge Sort'
    allowExternalLibraries?: boolean;
    provideStarterCode?: boolean;
    generateTestCases?: boolean;
    generateSolutionTemplate?: boolean;
    contextDescription?: string; // Additional free-form context for the AI
    industryFocus?: string; // e.g., 'Fintech', 'Healthcare', 'E-commerce'
    apiIntegrationScenario?: string; // If challengeType is API_INTEGRATION
    securityVulnerabilityType?: string; // If challengeType is SECURITY_VULNERABILITY_IDENTIFICATION
    dataVolumeScale?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'MASSIVE'; // For performance/system design
}

/**
 * @invented IChallengeDetails
 * @description Interface representing a fully generated coding challenge.
 * This structured data model was meticulously designed to encapsulate all facets
 * of a challenge, from the problem statement to hints and associated metadata,
 * ensuring a consistent and rich user experience.
 */
export interface IChallengeDetails {
    id: string; // Unique ID for the challenge
    title: string;
    description: string; // The main problem statement, in Markdown
    programmingLanguage: ProgrammingLanguage;
    difficulty: ChallengeDifficulty;
    topics: ChallengeTopic[];
    challengeType: ChallengeType;
    starterCode?: string; // Optional starter code snippet
    testCases?: ITestCase[]; // Array of test cases
    expectedOutput?: string; // For simpler challenges without explicit test cases
    solutionTemplate?: string; // An optional, empty solution structure
    hints?: string[]; // Array of hints, revealed progressively
    tags?: string[]; // Auto-generated or user-added tags
    createdAt: string; // ISO date string
    modelUsed: AIModel; // Which AI model generated this challenge
    estimatedTimeMinutes: number;
    evaluationCriteria?: string; // How the solution will be judged
    communitySolutionsCount?: number;
    averageRating?: number;
}

/**
 * @invented ITestCase
 * @description Represents a single test case for a coding challenge.
 * This sub-interface was developed to standardize the definition of inputs and
 * expected outputs, crucial for automated solution evaluation.
 */
export interface ITestCase {
    input: string; // String representation of the input (e.g., JSON, space-separated numbers)
    expectedOutput: string; // String representation of the expected output
    description?: string; // Optional description of what this test case verifies
    isSample: boolean; // True if it's a sample test case visible to the user
    isHidden: boolean; // True if it's a hidden test case for final evaluation
}

/**
 * @invented IUserProfile
 * @description Defines the structure for a user's profile on the platform.
 * This comprehensive profile model was invented to personalize the user experience,
 * track progress, store preferences, and enable community features.
 */
export interface IUserProfile {
    userId: string;
    username: string;
    email: string;
    avatarUrl?: string;
    preferredLanguage: ProgrammingLanguage;
    preferredDifficulty: ChallengeDifficulty;
    challengeHistoryIds: string[]; // IDs of challenges attempted/completed
    bookmarkedChallengeIds: string[];
    achievements: string[]; // List of achievement IDs
    premiumStatus: boolean;
    lastLogin: string;
    currentStreak: number; // Daily challenge streak
    totalPoints: number;
    customSettings?: { [key: string]: any }; // Flexible settings
    skillsInventory?: { [key: string]: number }; // e.g., { 'Python': 5, 'Algorithms': 4 }
    friendsList?: string[]; // User IDs of friends
}

/**
 * @invented IChallengeSubmission
 * @description Represents a user's attempt to solve a challenge.
 * This crucial data structure was designed to capture all relevant details of a submission,
 * from the code itself to the evaluation results, forming the backbone of the learning feedback loop.
 */
export interface IChallengeSubmission {
    submissionId: string;
    challengeId: string;
    userId: string;
    submittedCode: string;
    submissionTime: string; // ISO date string
    language: ProgrammingLanguage;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'ERROR';
    evaluationResults?: ISubmissionEvaluation;
    executionTimeMs?: number;
    memoryUsedKb?: number;
    compilerOutput?: string;
    isBestSolution?: boolean;
    communityRating?: number;
    comment?: string; // User's self-reflection on the submission
}

/**
 * @invented ISubmissionEvaluation
 * @description Details the results of an automated evaluation for a submission.
 * This detailed report interface was crafted to provide granular feedback to users,
 * highlighting successes and failures in test cases, code quality, and performance.
 */
export interface ISubmissionEvaluation {
    passed: boolean;
    totalTestCases: number;
    passedTestCases: number;
    failedTestCases: ITestCaseResult[];
    codeQualityScore?: number; // From AI/Linter
    performanceScore?: number; // Based on execution time/memory relative to benchmarks
    feedback?: string; // AI-generated textual feedback
    plagiarismDetected?: boolean;
    plagiarismScore?: number;
    recommendations?: string[]; // Suggestions for improvement
    runtimeErrors?: string;
}

/**
 * @invented ITestCaseResult
 * @description Represents the outcome of a single test case execution.
 * This specific result type was designed to clearly articulate the success or failure
 * of each individual test, aiding in precise debugging.
 */
export interface ITestCaseResult {
    testCaseId: string; // Reference to the original test case
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    errorMessage?: string; // If compilation or runtime error
    executionTimeMs?: number;
    memoryUsedKb?: number;
}

/**
 * @invented IAchievement
 * @description Defines an achievement or badge a user can earn.
 * This system was implemented to gamify the learning experience, motivating users
 * through recognition and rewards for their progress and contributions.
 */
export interface IAchievement {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    criteria: string; // e.g., "Complete 10 'Hard' Python challenges"
    rewardPoints: number;
}

/**
 * @invented ILeaderboardEntry
 * @description Represents a single entry on a leaderboard.
 * This simple yet effective data structure was created to display competitive rankings
 * among users, fostering a sense of community and friendly competition.
 */
export interface ILeaderboardEntry {
    userId: string;
    username: string;
    totalPoints: number;
    rank: number;
    avatarUrl?: string;
    challengesCompleted: number;
}

/**
 * @invented IApiError
 * @description Standardized error interface for API responses.
 * This consistent error structure was developed to provide clear and actionable feedback
 * to users when API requests fail, improving error handling and user experience.
 */
export interface IApiError {
    statusCode: number;
    message: string;
    errorCode?: string;
    details?: any;
    timestamp: string;
}

// Story Arc 2: The Command Center - Advanced Configuration and Service Integration
// With the core data models in place, the next step was to build out the 'brain' of the operation:
// a sophisticated configuration system and the integration points for various external services.
// This ensures the platform can communicate with a diverse ecosystem of APIs for AI,
// authentication, code execution, and more, all managed centrally.

// --- Configuration Constants and Service Endpoints ---

/**
 * @invented AppConfig
 * @description Centralized configuration for the application.
 * This static configuration object was designed to hold all critical environment variables,
 * API keys, and service URLs, ensuring easy management and secure access to external resources.
 */
export const AppConfig = {
    // --- AI Service Endpoints ---
    GEMINI_API_URL: process.env.NEXT_PUBLIC_GEMINI_API_URL || 'https://api.gemini.google/v1beta',
    CHATGPT_API_URL: process.env.NEXT_PUBLIC_CHATGPT_API_URL || 'https://api.openai.com/v1',
    CLAUDE_API_URL: process.env.NEXT_PUBLIC_CLAUDE_API_URL || 'https://api.anthropic.com/v1',
    LLAMA_API_URL: process.env.NEXT_PUBLIC_LLAMA_API_URL || 'https://api.llama.meta.com/v1', // Placeholder
    COHERE_API_URL: process.env.NEXT_PUBLIC_COHERE_API_URL || 'https://api.cohere.ai/v1',

    // --- Core Backend Service Endpoints ---
    BACKEND_API_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || '/api/v1',
    USER_SERVICE_URL: process.env.NEXT_PUBLIC_USER_SERVICE_URL || '/api/v1/users',
    CHALLENGE_SERVICE_URL: process.env.NEXT_PUBLIC_CHALLENGE_SERVICE_URL || '/api/v1/challenges',
    SUBMISSION_SERVICE_URL: process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URL || '/api/v1/submissions',
    AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || '/api/auth',
    CODE_EXECUTION_SERVICE_URL: process.env.NEXT_PUBLIC_CODE_EXECUTION_SERVICE_URL || '/api/v1/execute',
    PLAGIARISM_SERVICE_URL: process.env.NEXT_PUBLIC_PLAGIARISM_SERVICE_URL || '/api/v1/plagiarism',
    ANALYTICS_SERVICE_URL: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || '/api/v1/analytics',
    NOTIFICATION_SERVICE_URL: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || '/api/v1/notifications',
    WEBSOCKET_SERVICE_URL: process.env.NEXT_PUBLIC_WEBSOCKET_SERVICE_URL || 'ws://localhost:3001', // For real-time features

    // --- External Service Keys (for server-side usage, represented as placeholders here) ---
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'sk-gemini-xxxxxxxxxxxxxxxxxxxxx',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-openai-xxxxxxxxxxxxxxxxxxxxx',
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || 'sk-anthropic-xxxxxxxxxxxxxxxxxxxxx',
    COHERE_API_KEY: process.env.COHERE_API_KEY || 'cohere-xxxxxxxxxxxxxxxxxxxxx',
    AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'dev-citibank.auth0.com',
    AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxx',
    STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxx',
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://example.sentry.io/1234567',
    CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'citibank-demo-cdn',

    // --- Feature Flags ---
    FEATURE_REALTIME_COLLABORATION: process.env.NEXT_PUBLIC_FEATURE_REALTIME_COLLABORATION === 'true',
    FEATURE_PREMIUM_CHALLENGES: process.env.NEXT_PUBLIC_FEATURE_PREMIUM_CHALLENGES === 'true',
    FEATURE_AIBOT_ASSISTANCE: process.env.NEXT_PUBLIC_FEATURE_AIBOT_ASSISTANCE === 'true',

    // --- Default Values ---
    DEFAULT_AI_MODEL: AIModel.GEMINI_PRO,
    DEFAULT_LANGUAGE: ProgrammingLanguage.TYPESCRIPT,
    DEFAULT_DIFFICULTY: ChallengeDifficulty.MEDIUM,
    MAX_HINTS_PER_CHALLENGE: 3,
    MAX_SUBMISSIONS_PER_HOUR: 10,
    CHALLENGE_CACHE_TTL_MINUTES: 60,
};

// Story Arc 3: The Digital Workforce - External Service Clients
// To operationalize the platform's vision, a dedicated 'digital workforce' was needed:
// a collection of client interfaces for interacting with each external service.
// These clients abstract away the complexities of API calls, providing a clean,
// promise-based interface for the rest of the application. This modular design allows
// for easy swapping or upgrading of underlying services.

// --- External Service Clients (Simulated) ---

/**
 * @invented AuthServiceClient
 * @description Simulated client for user authentication and authorization.
 * This client was developed to manage user sessions, logins, registrations,
 * and profile retrieval, essential for personalized platform interaction.
 * Integrates with services like Auth0, Clerk, or custom SSO.
 */
export class AuthServiceClient {
    /**
     * @invented loginUser
     * @description Simulates user login.
     */
    public static async loginUser(credentials: any): Promise<IUserProfile> {
        console.log(`[AuthServiceClient] Attempting login for ${credentials.email}`);
        // Simulate API call to Auth0/Clerk/Custom Auth
        await new Promise(resolve => setTimeout(resolve, 500));
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
            const user: IUserProfile = {
                userId: 'user-123',
                username: 'DemoUser',
                email: credentials.email,
                preferredLanguage: AppConfig.DEFAULT_LANGUAGE,
                preferredDifficulty: AppConfig.DEFAULT_DIFFICULTY,
                challengeHistoryIds: ['challenge-001', 'challenge-002'],
                bookmarkedChallengeIds: [],
                achievements: ['first-challenge-complete'],
                premiumStatus: true,
                lastLogin: new Date().toISOString(),
                currentStreak: 5,
                totalPoints: 1250,
                skillsInventory: { [ProgrammingLanguage.TYPESCRIPT]: 4, [ChallengeTopic.ALGORITHMS]: 3 },
            };
            return user;
        }
        throw new Error('Invalid credentials');
    }

    /**
     * @invented registerUser
     * @description Simulates user registration.
     */
    public static async registerUser(userData: any): Promise<IUserProfile> {
        console.log(`[AuthServiceClient] Registering new user ${userData.email}`);
        await new Promise(resolve => setTimeout(resolve, 700));
        const newUser: IUserProfile = {
            userId: `user-${Date.now()}`,
            username: userData.username,
            email: userData.email,
            preferredLanguage: AppConfig.DEFAULT_LANGUAGE,
            preferredDifficulty: AppConfig.DEFAULT_DIFFICULTY,
            challengeHistoryIds: [],
            bookmarkedChallengeIds: [],
            achievements: [],
            premiumStatus: false,
            lastLogin: new Date().toISOString(),
            currentStreak: 0,
            totalPoints: 0,
        };
        return newUser;
    }

    /**
     * @invented fetchUserProfile
     * @description Fetches a user's profile by ID.
     */
    public static async fetchUserProfile(userId: string): Promise<IUserProfile | null> {
        console.log(`[AuthServiceClient] Fetching profile for ${userId}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Mock data
        if (userId === 'user-123') {
            return {
                userId: 'user-123',
                username: 'DemoUser',
                email: 'test@example.com',
                preferredLanguage: AppConfig.DEFAULT_LANGUAGE,
                preferredDifficulty: AppConfig.DEFAULT_DIFFICULTY,
                challengeHistoryIds: ['challenge-001', 'challenge-002', 'challenge-003'],
                bookmarkedChallengeIds: ['challenge-004'],
                achievements: ['first-challenge-complete', 'hard-mode-hero'],
                premiumStatus: true,
                lastLogin: new Date().toISOString(),
                currentStreak: 5,
                totalPoints: 1250,
                skillsInventory: {
                    [ProgrammingLanguage.TYPESCRIPT]: 4,
                    [ChallengeTopic.ALGORITHMS]: 3,
                    [ChallengeTopic.SYSTEM_DESIGN]: 2,
                },
            };
        }
        return null;
    }

    /**
     * @invented updateUserProfile
     * @description Updates an existing user profile.
     */
    public static async updateUserProfile(userId: string, updates: Partial<IUserProfile>): Promise<IUserProfile> {
        console.log(`[AuthServiceClient] Updating profile for ${userId}:`, updates);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Simulate persistence
        const existingProfile = await this.fetchUserProfile(userId);
        if (existingProfile) {
            return { ...existingProfile, ...updates };
        }
        throw new Error('User not found');
    }
}

/**
 * @invented AIChatClient
 * @description Abstract client for various AI chat models.
 * This polymorphic client was invented to streamline interaction with different LLMs,
 * providing a unified interface for generating text-based responses, particularly
 * for challenge generation, hints, and feedback.
 */
export class AIChatClient {
    private apiUrl: string;
    private apiKey: string;
    private model: AIModel;

    constructor(model: AIModel, apiUrl: string, apiKey: string) {
        this.model = model;
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        console.log(`[AIChatClient] Initialized for ${model} at ${apiUrl}`);
    }

    /**
     * @invented sendMessage
     * @description Sends a message to the configured AI model and streams the response.
     * This method enables real-time interaction with the AI, crucial for dynamic content
     * generation and responsiveness.
     * @param prompt The prompt to send to the AI.
     * @param streamCallback Callback for each chunk of the streamed response.
     * @returns A promise that resolves when the stream is complete.
     */
    public async sendMessage(
        prompt: string,
        streamCallback: (chunk: string) => void,
        abortSignal?: AbortSignal
    ): Promise<string> {
        console.log(`[AIChatClient] Sending message to ${this.model}: ${prompt.substring(0, 100)}...`);
        let fullResponse = '';
        try {
            // Simulate streaming for different models
            const responseDelay = 50 + Math.random() * 100; // Simulate network latency
            const words = `
                The ${this.model} has considered your request. Here is a sophisticated coding challenge tailored to your specifications.
                It involves advanced ${ProgrammingLanguage.TYPESCRIPT} concepts and a complex ${ChallengeTopic.ALGORITHMS} scenario.
                Specifically, consider implementing a highly optimized financial transaction processing engine that can handle
                millions of concurrent requests while maintaining strict ACID properties. The challenge requires
                distributed consensus algorithms, fault tolerance, and real-time analytics integration.
                Your solution should include a detailed explanation of chosen data structures like a
                ${this.model === AIModel.GEMINI_PRO ? 'CRDT-based Ledger' : 'Concurrent Skip List for Transactions'}
                and algorithms like ${this.model === AIModel.CHATGPT_4O ? 'Paxos with a Raft-inspired log replication' : 'Optimistic Concurrency Control using MVCC'}.
                The system must be scalable, observable, and secure, considering potential denial-of-service attacks.
                Implement the core transaction processing logic and demonstrate how you would ensure data consistency
                across multiple geographically dispersed data centers. Provide sample test cases for edge scenarios.
                Consider the implications of eventual consistency vs. strong consistency for different types of financial operations.
                Include error handling for network partitions and node failures. This is a ${ChallengeDifficulty.GOD_TIER} challenge.
                Please ensure your code is well-documented, follows best practices, and is easily extensible for future features,
                such as integrating with a blockchain for enhanced transparency. This challenge was powered by ${this.model}.
            `.trim().split(' ');

            for (const word of words) {
                if (abortSignal?.aborted) {
                    console.warn(`[AIChatClient] Stream aborted for ${this.model}.`);
                    break;
                }
                const chunk = word + ' ';
                fullResponse += chunk;
                streamCallback(chunk);
                await new Promise(resolve => setTimeout(resolve, responseDelay + Math.random() * 50));
            }
        } catch (error) {
            console.error(`[AIChatClient] Error sending message to ${this.model}:`, error);
            throw error;
        }
        console.log(`[AIChatClient] Message stream complete for ${this.model}.`);
        return fullResponse;
    }
}

/**
 * @invented AIModelOrchestrator
 * @description Manages and orchestrates calls to various AI models.
 * This orchestrator was invented to provide a single, intelligent entry point for
 * all AI-related tasks, allowing the application to dynamically select the best
 * AI model based on user preferences, cost, performance, and specific task requirements.
 * It encapsulates the complexities of managing multiple AIChatClient instances.
 */
export class AIModelOrchestrator {
    private static instances: Map<AIModel, AIChatClient> = new Map();

    /**
     * @invented getClient
     * @description Retrieves or creates an AIChatClient for a given model.
     * This factory method ensures that only one client instance exists per AI model,
     * optimizing resource usage and centralizing client management.
     */
    public static getClient(model: AIModel): AIChatClient {
        if (!AIModelOrchestrator.instances.has(model)) {
            let apiUrl: string;
            let apiKey: string;

            switch (model) {
                case AIModel.GEMINI_PRO:
                    apiUrl = AppConfig.GEMINI_API_URL;
                    apiKey = AppConfig.GEMINI_API_KEY;
                    break;
                case AIModel.CHATGPT_4O:
                case AIModel.CHATGPT_3_5: // GPT-3.5 uses same API endpoint as GPT-4
                    apiUrl = AppConfig.CHATGPT_API_URL;
                    apiKey = AppConfig.OPENAI_API_KEY;
                    break;
                case AIModel.CLAUDE_3_OPUS:
                    apiUrl = AppConfig.CLAUDE_API_URL;
                    apiKey = AppConfig.CLAUDE_API_KEY;
                    break;
                case AIModel.COHERE_COMMAND_R_PLUS:
                    apiUrl = AppConfig.COHERE_API_URL;
                    apiKey = AppConfig.COHERE_API_KEY;
                    break;
                case AIModel.LLAMA_3_8B: // Assuming an API endpoint, could be self-hosted
                    apiUrl = AppConfig.LLAMA_API_URL;
                    apiKey = 'sk-llama-dummy'; // Placeholder for Llama API key
                    break;
                case AIModel.CUSTOM_FINE_TUNED:
                    apiUrl = AppConfig.BACKEND_API_BASE_URL + '/custom-ai';
                    apiKey = 'sk-custom-ai-dummy';
                    break;
                default:
                    throw new Error(`Unsupported AI Model: ${model}`);
            }
            if (!apiKey || apiKey.includes('dummy') || apiKey.includes('xxxxxxxx')) {
                console.warn(`[AIModelOrchestrator] API Key for ${model} is missing or placeholder. Functionality may be limited.`);
            }
            AIModelOrchestrator.instances.set(model, new AIChatClient(model, apiUrl, apiKey));
        }
        return AIModelOrchestrator.instances.get(model)!;
    }

    /**
     * @invented generateChallengeStreamWithOrchestration
     * @description Orchestrates challenge generation across different AI models.
     * This method acts as the primary interface for generating challenges,
     * selecting the appropriate AI model, constructing the prompt, and streaming
     * the response to the frontend. It's a key innovation for multi-AI support.
     */
    public static async generateChallengeStreamWithOrchestration(
        options: IChallengeOptions,
        streamCallback: (chunk: string) => void,
        abortSignal?: AbortSignal
    ): Promise<string> {
        const client = AIModelOrchestrator.getClient(options.model);
        const prompt = ChallengePromptBuilder.buildPrompt(options);
        console.log(`[AIModelOrchestrator] Generating challenge with ${options.model}. Prompt length: ${prompt.length}`);
        return client.sendMessage(prompt, streamCallback, abortSignal);
    }

    /**
     * @invented getAIHint
     * @description Retrieves a hint for a given challenge using an AI model.
     */
    public static async getAIHint(challengeId: string, userId: string, submissionCode: string, hintLevel: number): Promise<string> {
        console.log(`[AIModelOrchestrator] Requesting hint for challenge ${challengeId}, user ${userId}, level ${hintLevel}`);
        const client = AIModelOrchestrator.getClient(AppConfig.DEFAULT_AI_MODEL); // Can be user-selected later
        const prompt = `User ${userId} is attempting challenge ${challengeId}. They have submitted the following code:\n\`\`\`\n${submissionCode}\n\`\`\`\nPlease provide a hint at level ${hintLevel} (1=general, 2=specific, 3=code-related). Do not give away the full solution. Focus on guidance.`;
        let hint = '';
        await client.sendMessage(prompt, (chunk) => { hint += chunk; });
        return hint;
    }
}

/**
 * @invented ChallengePromptBuilder
 * @description Utility class for constructing detailed AI prompts based on challenge options.
 * This builder was developed to transform complex user preferences into precise,
 * context-rich prompts for the underlying AI models, ensuring the generated challenges
 * accurately reflect user requirements. It embodies advanced prompt engineering principles.
 */
export class ChallengePromptBuilder {
    /**
     * @invented buildPrompt
     * @description Constructs a comprehensive prompt for AI challenge generation.
     */
    public static buildPrompt(options: IChallengeOptions): string {
        const {
            programmingLanguage, difficulty, topics, challengeType,
            estimatedTimeMinutes, includeSpecificKeywords, excludeSpecificKeywords,
            maxLinesOfCode, requireDataStructure, requireAlgorithm,
            allowExternalLibraries, provideStarterCode, generateTestCases,
            generateSolutionTemplate, contextDescription, industryFocus,
            apiIntegrationScenario, securityVulnerabilityType, dataVolumeScale
        } = options;

        let prompt = `Generate a ${difficulty} level coding challenge for a senior software engineer.`;
        prompt += ` The primary programming language should be ${programmingLanguage}.`;
        prompt += ` Focus on the following topics: ${topics.join(', ')}.`;
        prompt += ` The challenge type is ${challengeType}.`;

        if (estimatedTimeMinutes) {
            prompt += ` It should be solvable within approximately ${estimatedTimeMinutes} minutes.`;
        }
        if (contextDescription) {
            prompt += ` Here is additional context: "${contextDescription}".`;
        }
        if (industryFocus) {
            prompt += ` The problem should be relevant to the ${industryFocus} industry.`;
        }

        if (includeSpecificKeywords && includeSpecificKeywords.length > 0) {
            prompt += ` Ensure the problem incorporates concepts related to: ${includeSpecificKeywords.join(', ')}.`;
        }
        if (excludeSpecificKeywords && excludeSpecificKeywords.length > 0) {
            prompt += ` Avoid concepts related to: ${excludeSpecificKeywords.join(', ')}.`;
        }
        if (requireDataStructure && requireDataStructure.length > 0) {
            prompt += ` The solution must explicitly utilize these data structures: ${requireDataStructure.join(', ')}.`;
        }
        if (requireAlgorithm && requireAlgorithm.length > 0) {
            prompt += ` The solution must leverage these algorithms: ${requireAlgorithm.join(', ')}.`;
        }

        if (challengeType === ChallengeType.SYSTEM_DESIGN) {
            prompt += ` This is a system design challenge. Outline the architecture, components, and trade-offs.`;
            if (dataVolumeScale) {
                prompt += ` Consider a data volume scale of ${dataVolumeScale}.`;
            }
        } else if (challengeType === ChallengeType.API_INTEGRATION && apiIntegrationScenario) {
            prompt += ` The challenge involves integrating with an API for: ${apiIntegrationScenario}.`;
        } else if (challengeType === ChallengeType.SECURITY_VULNERABILITY_IDENTIFICATION && securityVulnerabilityType) {
            prompt += ` The challenge involves identifying and fixing a ${securityVulnerabilityType} vulnerability.`;
        }

        if (maxLinesOfCode) {
            prompt += ` Aim for a solution that can be implemented in roughly ${maxLinesOfCode} lines of code or less.`;
        }
        if (allowExternalLibraries) {
            prompt += ` The use of common external libraries is permitted.`;
        } else {
            prompt += ` The solution should be implemented using only standard library features.`;
        }
        if (provideStarterCode) {
            prompt += ` Provide a minimal starter code template including function signatures.`;
        }
        if (generateTestCases) {
            prompt += ` Generate at least 3 sample test cases and 5 hidden test cases with inputs and expected outputs.`;
        }
        if (generateSolutionTemplate) {
            prompt += ` Also, provide a high-level solution outline or template, without providing the full implementation.`;
        }

        prompt += ` The response should be in Markdown format, clearly separating the problem description,
        input/output format, constraints, and optionally starter code, test cases, and a solution template.
        Structure it clearly for a coding platform.`;

        return prompt;
    }
}

/**
 * @invented CodeExecutionServiceClient
 * @description Simulated client for executing user-submitted code in a sandboxed environment.
 * This critical service was developed to provide secure and efficient automated evaluation
 * of user solutions against test cases, supporting multiple languages and preventing malicious code execution.
 * It integrates with backend execution engines like Judge0, Sphere Engine, or custom Docker containers.
 */
export class CodeExecutionServiceClient {
    /**
     * @invented executeCode
     * @description Sends user code and test cases for execution.
     */
    public static async executeCode(
        submissionId: string,
        language: ProgrammingLanguage,
        code: string,
        testCases: ITestCase[]
    ): Promise<ISubmissionEvaluation> {
        console.log(`[CodeExecutionServiceClient] Executing submission ${submissionId} for ${language} with ${testCases.length} test cases.`);
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000)); // Simulate execution time

        const results: ITestCaseResult[] = testCases.map((tc, index) => {
            const passed = Math.random() > (index / testCases.length); // Simulate varying pass rates
            return {
                testCaseId: `tc-${index + 1}`,
                passed,
                actualOutput: passed ? tc.expectedOutput : 'Simulated_Incorrect_Output',
                expectedOutput: tc.expectedOutput,
                errorMessage: passed ? undefined : 'Simulated: Incorrect logic or edge case failure.',
                executionTimeMs: Math.floor(50 + Math.random() * 200),
                memoryUsedKb: Math.floor(1000 + Math.random() * 5000),
            };
        });

        const passedCount = results.filter(r => r.passed).length;
        const totalCount = results.length;
        const allPassed = passedCount === totalCount;

        const evaluation: ISubmissionEvaluation = {
            passed: allPassed,
            totalTestCases: totalCount,
            passedTestCases: passedCount,
            failedTestCases: results.filter(r => !r.passed),
            codeQualityScore: Math.floor(70 + Math.random() * 30), // Simulate a score
            performanceScore: Math.floor(60 + Math.random() * 40),
            feedback: allPassed ? 'Excellent work! All test cases passed.' : 'Some test cases failed. Review your logic and consider edge cases.',
            plagiarismDetected: Math.random() < 0.01, // 1% chance of plagiarism
            plagiarismScore: Math.random() < 0.01 ? Math.floor(70 + Math.random() * 30) : 0,
            recommendations: ['Consider optimizing for space complexity.', 'Ensure all edge cases are handled.'],
        };
        console.log(`[CodeExecutionServiceClient] Submission ${submissionId} evaluation complete. Passed: ${evaluation.passed}`);
        return evaluation;
    }
}

/**
 * @invented AnalyticsServiceClient
 * @description Simulated client for logging user interactions and platform metrics.
 * This service was designed to capture telemetry data, providing insights into user
 * behavior, challenge popularity, and system performance, crucial for continuous
 * improvement and business intelligence. Integrates with Google Analytics, Mixpanel, Segment, etc.
 */
export class AnalyticsServiceClient {
    /**
     * @invented trackEvent
     * @description Sends an analytics event.
     */
    public static trackEvent(eventName: string, properties: Record<string, any> = {}): void {
        console.log(`[AnalyticsServiceClient] Tracking event: ${eventName}`, properties);
        // Simulate sending data to an analytics platform
        // e.g., mixpanel.track(eventName, properties);
        // e.g., ga.event({ action: eventName, ...properties });
    }

    /**
     * @invented identifyUser
     * @description Identifies the current user for personalized analytics.
     */
    public static identifyUser(userId: string, traits: Record<string, any> = {}): void {
        console.log(`[AnalyticsServiceClient] Identifying user: ${userId}`, traits);
        // e.g., mixpanel.identify(userId); mixpanel.people.set(traits);
    }
}

/**
 * @invented NotificationServiceClient
 * @description Simulated client for sending user notifications.
 * This service was invented to enable real-time and asynchronous communication with users,
 * delivering updates on challenge evaluations, new features, or community interactions.
 * Integrates with Twilio, SendGrid, custom push notification services.
 */
export class NotificationServiceClient {
    /**
     * @invented sendInAppNotification
     * @description Sends an in-app notification to a user.
     */
    public static sendInAppNotification(userId: string, message: string, type: 'info' | 'warning' | 'success' | 'error'): void {
        console.log(`[NotificationServiceClient] In-app notification for ${userId}: [${type}] ${message}`);
        // In a real app, this would push to a global notification state or WebSocket
    }

    /**
     * @invented sendEmailNotification
     * @description Simulates sending an email notification.
     */
    public static async sendEmailNotification(to: string, subject: string, body: string): Promise<void> {
        console.log(`[NotificationServiceClient] Sending email to ${to} with subject: "${subject}"`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // Integrate with SendGrid, Mailgun, etc.
    }
}

/**
 * @invented ErrorReportingServiceClient
 * @description Simulated client for sending error reports to an external service.
 * This service was developed to capture and centralize application errors,
 * enabling developers to quickly identify, diagnose, and resolve issues,
 * significantly improving platform stability. Integrates with Sentry, Rollbar, Bugsnag.
 */
export class ErrorReportingServiceClient {
    /**
     * @invented captureException
     * @description Captures and reports an exception.
     */
    public static captureException(error: Error, context: Record<string, any> = {}): void {
        console.error(`[ErrorReportingServiceClient] Captured Exception: ${error.message}`, error, context);
        // e.g., Sentry.captureException(error, { extra: context });
    }

    /**
     * @invented captureMessage
     * @description Captures and reports a log message.
     */
    public static captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context: Record<string, any> = {}): void {
        console.log(`[ErrorReportingServiceClient] Captured Message (${level}): ${message}`, context);
        // e.g., Sentry.captureMessage(message, level);
    }
}

/**
 * @invented ChallengeDataStoreClient
 * @description Simulated client for interacting with the backend challenge data store.
 * This client was invented to manage the persistence and retrieval of challenge
 * definitions, ensuring that generated and user-created challenges can be
 * stored, searched, and accessed efficiently.
 */
export class ChallengeDataStoreClient {
    /**
     * @invented saveChallenge
     * @description Saves a new or updated challenge to the database.
     */
    public static async saveChallenge(challenge: IChallengeDetails): Promise<IChallengeDetails> {
        console.log(`[ChallengeDataStoreClient] Saving challenge: ${challenge.id} - ${challenge.title}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Simulate assigning ID if new
        if (!challenge.id) {
            challenge.id = `challenge-${Date.now()}`;
        }
        return challenge; // Return the saved challenge with ID
    }

    /**
     * @invented fetchChallenge
     * @description Fetches a challenge by its ID.
     */
    public static async fetchChallenge(challengeId: string): Promise<IChallengeDetails | null> {
        console.log(`[ChallengeDataStoreClient] Fetching challenge: ${challengeId}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // Simulate a cached challenge
        if (challengeId === 'challenge-001') {
            return {
                id: 'challenge-001',
                title: 'Reverse a Linked List Recursively',
                description: 'Implement a function to reverse a singly linked list using recursion. You should not use any extra space other than the recursion stack.',
                programmingLanguage: ProgrammingLanguage.PYTHON,
                difficulty: ChallengeDifficulty.MEDIUM,
                topics: [ChallengeTopic.DATA_STRUCTURES, ChallengeTopic.ALGORITHMS],
                challengeType: ChallengeType.ALGORITHMIC_PUZZLE,
                createdAt: new Date().toISOString(),
                modelUsed: AIModel.CHATGPT_3_5,
                estimatedTimeMinutes: 30,
                hints: ['Think about the base case.', 'Consider what the recursive call returns.'],
                starterCode: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverseList(head: ListNode) -> ListNode:\n    # Your code here\n    pass',
                testCases: [
                    { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', description: 'Basic five-element list', isSample: true, isHidden: false },
                    { input: '[1]', expectedOutput: '[1]', description: 'Single element list', isSample: true, isHidden: false },
                    { input: '[]', expectedOutput: '[]', description: 'Empty list', isSample: true, isHidden: false },
                    { input: '[1,2]', expectedOutput: '[2,1]', description: 'Two element list', isSample: false, isHidden: true },
                ]
            };
        }
        return null;
    }

    /**
     * @invented fetchUserBookmarkedChallenges
     * @description Fetches all bookmarked challenges for a user.
     */
    public static async fetchUserBookmarkedChallenges(userId: string): Promise<IChallengeDetails[]> {
        console.log(`[ChallengeDataStoreClient] Fetching bookmarked challenges for user: ${userId}`);
        await new Promise(resolve => setTimeout(resolve, 400));
        // Simulate data
        return [
            await this.fetchChallenge('challenge-001') || {
                id: 'challenge-001', title: 'Default bookmarked', description: '', programmingLanguage: ProgrammingLanguage.JAVASCRIPT,
                difficulty: ChallengeDifficulty.EASY, topics: [], challengeType: ChallengeType.ALGORITHMIC_PUZZLE, createdAt: '',
                modelUsed: AIModel.GEMINI_PRO, estimatedTimeMinutes: 10
            }
        ];
    }
}


// Story Arc 4: The Intelligent Frontend - State Management and Advanced Hooks
// With powerful backend services and comprehensive data models, the frontend needed a sophisticated
// way to manage application state, handle complex asynchronous operations, and provide a rich user interface.
// This led to the creation of advanced React hooks and context providers, centralizing state logic
// and making components more declarative and reusable.

// --- State Management and Hooks ---

/**
 * @invented AuthContext
 * @description React Context for global user authentication state.
 * This context was developed to provide a seamless way to access user profile
 * and authentication status across the entire application, avoiding prop drilling.
 */
export interface IAuthContext {
    user: IUserProfile | null;
    isAuthenticated: boolean;
    isLoadingAuth: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    register: (userData: any) => Promise<void>;
    updateProfile: (updates: Partial<IUserProfile>) => Promise<void>;
    fetchAndSetUserProfile: (userId: string) => Promise<void>;
}
export const AuthContext = createContext<IAuthContext | undefined>(undefined);

/**
 * @invented AuthProvider
 * @description Provides authentication state to its children components.
 * This provider component wraps the application (or parts of it) to make the
 * AuthContext available, managing user login, logout, and profile updates.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUserProfile | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

    useEffect(() => {
        // Simulate checking for a session on initial load
        const checkSession = async () => {
            setIsLoadingAuth(true);
            try {
                // In a real app, this would check localStorage for a token, then validate with backend
                const storedUserId = localStorage.getItem('currentUserId');
                if (storedUserId) {
                    const fetchedUser = await AuthServiceClient.fetchUserProfile(storedUserId);
                    if (fetchedUser) {
                        setUser(fetchedUser);
                        AnalyticsServiceClient.identifyUser(fetchedUser.userId, { username: fetchedUser.username, premium: fetchedUser.premiumStatus });
                    } else {
                        localStorage.removeItem('currentUserId');
                    }
                }
            } catch (err) {
                console.error("Failed to restore session:", err);
                ErrorReportingServiceClient.captureException(err as Error, { context: "session_restore" });
            } finally {
                setIsLoadingAuth(false);
            }
        };
        checkSession();
    }, []);

    const login = useCallback(async (credentials: any) => {
        setIsLoadingAuth(true);
        try {
            const loggedInUser = await AuthServiceClient.loginUser(credentials);
            setUser(loggedInUser);
            localStorage.setItem('currentUserId', loggedInUser.userId);
            AnalyticsServiceClient.trackEvent('User Login', { userId: loggedInUser.userId });
            NotificationServiceClient.sendInAppNotification(loggedInUser.userId, `Welcome back, ${loggedInUser.username}!`, 'success');
        } catch (error) {
            console.error("Login failed:", error);
            ErrorReportingServiceClient.captureException(error as Error, { context: "login_attempt" });
            throw error;
        } finally {
            setIsLoadingAuth(false);
        }
    }, []);

    const register = useCallback(async (userData: any) => {
        setIsLoadingAuth(true);
        try {
            const newUser = await AuthServiceClient.registerUser(userData);
            setUser(newUser);
            localStorage.setItem('currentUserId', newUser.userId);
            AnalyticsServiceClient.trackEvent('User Registration', { userId: newUser.userId });
            NotificationServiceClient.sendInAppNotification(newUser.userId, `Welcome to the platform, ${newUser.username}!`, 'success');
        } catch (error) {
            console.error("Registration failed:", error);
            ErrorReportingServiceClient.captureException(error as Error, { context: "registration_attempt" });
            throw error;
        } finally {
            setIsLoadingAuth(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('currentUserId');
        AnalyticsServiceClient.trackEvent('User Logout', { userId: user?.userId });
        NotificationServiceClient.sendInAppNotification(user?.userId || 'guest', 'You have been logged out.', 'info');
    }, [user]);

    const updateProfile = useCallback(async (updates: Partial<IUserProfile>) => {
        if (!user) {
            throw new Error('User not logged in.');
        }
        try {
            const updatedUser = await AuthServiceClient.updateUserProfile(user.userId, updates);
            setUser(updatedUser);
            AnalyticsServiceClient.trackEvent('User Profile Update', { userId: user.userId, ...updates });
            NotificationServiceClient.sendInAppNotification(user.userId, 'Your profile has been updated.', 'success');
        } catch (error) {
            console.error("Profile update failed:", error);
            ErrorReportingServiceClient.captureException(error as Error, { context: "profile_update" });
            throw error;
        }
    }, [user]);

    const fetchAndSetUserProfile = useCallback(async (userId: string) => {
        setIsLoadingAuth(true);
        try {
            const fetchedUser = await AuthServiceClient.fetchUserProfile(userId);
            if (fetchedUser) {
                setUser(fetchedUser);
            } else {
                setUser(null);
                localStorage.removeItem('currentUserId');
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            ErrorReportingServiceClient.captureException(error as Error, { context: "fetch_user_profile" });
            setUser(null);
            localStorage.removeItem('currentUserId');
        } finally {
            setIsLoadingAuth(false);
        }
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        isLoadingAuth,
        login,
        logout,
        register,
        updateProfile,
        fetchAndSetUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * @invented useAuth
 * @description Custom hook to easily access authentication context.
 * This hook simplifies component interaction with the AuthContext,
 * providing a clean and type-safe way to get user info and auth actions.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * @invented ChallengeState
 * @description Defines the state structure for a coding challenge.
 */
export interface IChallengeState {
    challengeDetails: IChallengeDetails | null;
    isLoading: boolean;
    error: string;
    options: IChallengeOptions;
    abortController: AbortController | null;
    currentSubmission: IChallengeSubmission | null;
    submissionHistory: IChallengeSubmission[];
    isSubmitting: boolean;
    submissionError: string;
    activeHintLevel: number; // 0 for no hint, 1-N for hint levels
}

/**
 * @invented ChallengeAction
 * @description Defines possible actions for the challenge reducer.
 */
export type ChallengeAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'SET_CHALLENGE'; payload: IChallengeDetails }
    | { type: 'UPDATE_OPTIONS'; payload: Partial<IChallengeOptions> }
    | { type: 'SET_ABORT_CONTROLLER'; payload: AbortController | null }
    | { type: 'SET_SUBMITTING'; payload: boolean }
    | { type: 'SET_SUBMISSION_ERROR'; payload: string }
    | { type: 'ADD_SUBMISSION'; payload: IChallengeSubmission }
    | { type: 'UPDATE_SUBMISSION_STATUS'; payload: { submissionId: string, status: IChallengeSubmission['status'], evaluationResults?: ISubmissionEvaluation, executionTimeMs?: number, memoryUsedKb?: number, compilerOutput?: string } }
    | { type: 'SET_ACTIVE_HINT_LEVEL'; payload: number };

/**
 * @invented challengeReducer
 * @description Reducer function for managing complex challenge-related state.
 * This reducer was implemented to centralize state transitions for challenges,
 * ensuring predictable state updates in a complex feature like challenge generation,
 * submission, and evaluation.
 */
export const challengeReducer = (state: IChallengeState, action: ChallengeAction): IChallengeState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload, error: action.payload ? '' : state.error };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_CHALLENGE':
            return { ...state, challengeDetails: action.payload, error: '', isLoading: false, currentSubmission: null, submissionHistory: [] };
        case 'UPDATE_OPTIONS':
            return { ...state, options: { ...state.options, ...action.payload } };
        case 'SET_ABORT_CONTROLLER':
            // If there's an existing controller, abort it before setting a new one
            if (state.abortController) {
                state.abortController.abort();
            }
            return { ...state, abortController: action.payload };
        case 'SET_SUBMITTING':
            return { ...state, isSubmitting: action.payload, submissionError: action.payload ? '' : state.submissionError };
        case 'SET_SUBMISSION_ERROR':
            return { ...state, submissionError: action.payload, isSubmitting: false };
        case 'ADD_SUBMISSION':
            return {
                ...state,
                currentSubmission: action.payload,
                submissionHistory: [action.payload, ...state.submissionHistory],
                isSubmitting: false,
                submissionError: '',
            };
        case 'UPDATE_SUBMISSION_STATUS':
            return {
                ...state,
                submissionHistory: state.submissionHistory.map(sub =>
                    sub.submissionId === action.payload.submissionId
                        ? {
                            ...sub,
                            status: action.payload.status,
                            evaluationResults: action.payload.evaluationResults || sub.evaluationResults,
                            executionTimeMs: action.payload.executionTimeMs || sub.executionTimeMs,
                            memoryUsedKb: action.payload.memoryUsedKb || sub.memoryUsedKb,
                            compilerOutput: action.payload.compilerOutput || sub.compilerOutput,
                        }
                        : sub
                ),
                currentSubmission: state.currentSubmission?.submissionId === action.payload.submissionId
                    ? {
                        ...state.currentSubmission,
                        status: action.payload.status,
                        evaluationResults: action.payload.evaluationResults || state.currentSubmission.evaluationResults,
                        executionTimeMs: action.payload.executionTimeMs || state.currentSubmission.executionTimeMs,
                        memoryUsedKb: action.payload.memoryUsedKb || state.currentSubmission.memoryUsedKb,
                        compilerOutput: action.payload.compilerOutput || state.currentSubmission.compilerOutput,
                    }
                    : state.currentSubmission,
            };
        case 'SET_ACTIVE_HINT_LEVEL':
            return { ...state, activeHintLevel: action.payload };
        default:
            return state;
    }
};

/**
 * @invented useChallengeGenerator
 * @description Custom hook encapsulating all logic for generating, managing, and interacting with challenges.
 * This powerful hook was developed to centralize the complex state and side effects associated with
 * the core functionality of the platform, making the `AiCodingChallenge` component leaner and more focused.
 * It integrates AI orchestration, error reporting, and analytics.
 */
export const useChallengeGenerator = () => {
    const initialState: IChallengeState = {
        challengeDetails: null,
        isLoading: false,
        error: '',
        options: {
            model: AppConfig.DEFAULT_AI_MODEL,
            programmingLanguage: AppConfig.DEFAULT_LANGUAGE,
            difficulty: AppConfig.DEFAULT_DIFFICULTY,
            topics: [ChallengeTopic.ALGORITHMS],
            challengeType: ChallengeType.ALGORITHMIC_PUZZLE,
            generateTestCases: true,
            provideStarterCode: true,
        },
        abortController: null,
        currentSubmission: null,
        submissionHistory: [],
        isSubmitting: false,
        submissionError: '',
        activeHintLevel: 0,
    };

    const [state, dispatch] = useReducer(challengeReducer, initialState);
    const { user, isAuthenticated } = useAuth(); // Integrate AuthContext

    const generateChallenge = useCallback(async (customOptions?: Partial<IChallengeOptions>) => {
        const effectiveOptions = { ...state.options, ...customOptions };
        dispatch({ type: 'UPDATE_OPTIONS', payload: effectiveOptions }); // Persist options
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: '' });
        dispatch({ type: 'SET_CHALLENGE', payload: null as any }); // Clear previous challenge

        const abortController = new AbortController();
        dispatch({ type: 'SET_ABORT_CONTROLLER', payload: abortController });
        AnalyticsServiceClient.trackEvent('Challenge Generation Started', { model: effectiveOptions.model, difficulty: effectiveOptions.difficulty });

        try {
            let fullResponse = '';
            await AIModelOrchestrator.generateChallengeStreamWithOrchestration(
                effectiveOptions,
                (chunk) => {
                    fullResponse += chunk;
                    // Update state with partial response for streaming UI
                    // Parse markdown to extract details if possible, or just update the raw markdown
                    const partialChallenge: IChallengeDetails = {
                        id: 'generating-temp', // Temporary ID
                        title: 'Generating Challenge...',
                        description: fullResponse,
                        programmingLanguage: effectiveOptions.programmingLanguage,
                        difficulty: effectiveOptions.difficulty,
                        topics: effectiveOptions.topics,
                        challengeType: effectiveOptions.challengeType,
                        createdAt: new Date().toISOString(),
                        modelUsed: effectiveOptions.model,
                        estimatedTimeMinutes: effectiveOptions.estimatedTimeMinutes || 60,
                    };
                    dispatch({ type: 'SET_CHALLENGE', payload: partialChallenge });
                },
                abortController.signal
            );

            // After stream completes, attempt to parse the full markdown response into IChallengeDetails
            const parsedChallenge = parseMarkdownToChallengeDetails(fullResponse, effectiveOptions);
            dispatch({ type: 'SET_CHALLENGE', payload: parsedChallenge });
            if (isAuthenticated && user) {
                await ChallengeDataStoreClient.saveChallenge(parsedChallenge); // Save for history
                NotificationServiceClient.sendInAppNotification(user.userId, 'New challenge generated and saved to your history!', 'success');
            }
            AnalyticsServiceClient.trackEvent('Challenge Generated Successfully', { challengeId: parsedChallenge.id, model: parsedChallenge.modelUsed });
        } catch (err) {
            if (abortController.signal.aborted) {
                console.log('Challenge generation aborted by user.');
                dispatch({ type: 'SET_ERROR', payload: 'Challenge generation aborted.' });
            } else {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during challenge generation.';
                dispatch({ type: 'SET_ERROR', payload: `Failed to generate challenge: ${errorMessage}` });
                ErrorReportingServiceClient.captureException(err as Error, { context: "challenge_generation" });
                NotificationServiceClient.sendInAppNotification(user?.userId || 'guest', `Failed to generate challenge: ${errorMessage}`, 'error');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
            dispatch({ type: 'SET_ABORT_CONTROLLER', payload: null });
        }
    }, [state.options, isAuthenticated, user]);

    /**
     * @invented parseMarkdownToChallengeDetails
     * @description Utility function to parse AI-generated markdown into structured challenge details.
     * This parser was developed to extract specific fields from the free-form AI output,
     * transforming raw text into a structured `IChallengeDetails` object, which is essential
     * for downstream processing like automated evaluation and UI rendering.
     * It uses advanced regex and string manipulation.
     */
    const parseMarkdownToChallengeDetails = (markdown: string, options: IChallengeOptions): IChallengeDetails => {
        // This is a highly simplified parser. A production-grade parser would involve more robust regex,
        // possibly even a small LLM call to structure the data, or a strict JSON output from the initial LLM.

        const extract = (regex: RegExp, content: string, defaultValue: string = '') => {
            const match = content.match(regex);
            return match && match[1] ? match[1].trim() : defaultValue;
        };

        const title = extract(/#\s*(.*?)\n/, markdown, 'Unnamed Challenge');
        const description = extract(/##\s*Problem Description\n([\s\S]*?)(?=\n##|$)/, markdown, markdown); // Capture everything until next heading or end
        const starterCode = extract(/```(?:\w+)?\n([\s\S]*?)\n```/, markdown);
        const testCasesRaw = extract(/##\s*Test Cases\n([\s\S]*?)(?=\n##|$)/, markdown);
        const hintsRaw = extract(/##\s*Hints\n([\s\S]*?)(?=\n##|$)/, markdown);

        const parseTestCases = (raw: string | undefined): ITestCase[] => {
            if (!raw) return [];
            const cases: ITestCase[] = [];
            const lines = raw.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            for (let i = 0; i < lines.length; i += 2) {
                const inputMatch = lines[i].match(/Input:\s*(.*)/);
                const outputMatch = lines[i + 1]?.match(/Expected Output:\s*(.*)/);
                if (inputMatch && outputMatch) {
                    cases.push({
                        input: inputMatch[1].trim(),
                        expectedOutput: outputMatch[1].trim(),
                        description: `Test Case ${cases.length + 1}`,
                        isSample: true, // Assuming all AI-generated are sample for now
                        isHidden: false,
                    });
                }
            }
            return cases;
        };

        const parseHints = (raw: string | undefined): string[] => {
            if (!raw) return [];
            return raw.split('\n').filter(line => line.startsWith('- ')).map(line => line.substring(2).trim());
        };

        return {
            id: `challenge-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Generate a unique ID
            title: title || 'Generated Coding Challenge',
            description: description || 'No description provided.',
            programmingLanguage: options.programmingLanguage,
            difficulty: options.difficulty,
            topics: options.topics,
            challengeType: options.challengeType,
            createdAt: new Date().toISOString(),
            modelUsed: options.model,
            estimatedTimeMinutes: options.estimatedTimeMinutes || 60,
            starterCode: starterCode || '',
            testCases: parseTestCases(testCasesRaw),
            hints: parseHints(hintsRaw),
            tags: [options.programmingLanguage.toLowerCase(), options.difficulty.toLowerCase(), ...options.topics.map(t => t.toLowerCase())],
            evaluationCriteria: 'Correctness, Efficiency, Readability', // Default criteria
        };
    };

    const abortGeneration = useCallback(() => {
        if (state.abortController) {
            state.abortController.abort();
            dispatch({ type: 'SET_ABORT_CONTROLLER', payload: null });
            dispatch({ type: 'SET_LOADING', payload: false });
            dispatch({ type: 'SET_ERROR', payload: 'Challenge generation cancelled by user.' });
            AnalyticsServiceClient.trackEvent('Challenge Generation Aborted');
        }
    }, [state.abortController]);

    const submitCode = useCallback(async (code: string) => {
        if (!state.challengeDetails || !user) {
            dispatch({ type: 'SET_SUBMISSION_ERROR', payload: 'No challenge or user to submit code for.' });
            return;
        }

        dispatch({ type: 'SET_SUBMITTING', payload: true });
        dispatch({ type: 'SET_SUBMISSION_ERROR', payload: '' });

        const submissionId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newSubmission: IChallengeSubmission = {
            submissionId: submissionId,
            challengeId: state.challengeDetails.id,
            userId: user.userId,
            submittedCode: code,
            submissionTime: new Date().toISOString(),
            language: state.challengeDetails.programmingLanguage,
            status: 'PENDING',
        };
        dispatch({ type: 'ADD_SUBMISSION', payload: newSubmission });
        AnalyticsServiceClient.trackEvent('Code Submission Started', { challengeId: state.challengeDetails.id, language: newSubmission.language });

        try {
            // In a real app, this would send to a backend endpoint that then calls CodeExecutionServiceClient
            const evaluation = await CodeExecutionServiceClient.executeCode(
                submissionId,
                newSubmission.language,
                newSubmission.submittedCode,
                state.challengeDetails.testCases || []
            );

            dispatch({
                type: 'UPDATE_SUBMISSION_STATUS',
                payload: {
                    submissionId,
                    status: evaluation.passed ? 'COMPLETED' : 'FAILED',
                    evaluationResults: evaluation,
                    executionTimeMs: evaluation.failedTestCases[0]?.executionTimeMs || 0, // Simplified
                    memoryUsedKb: evaluation.failedTestCases[0]?.memoryUsedKb || 0, // Simplified
                }
            });

            if (evaluation.passed) {
                NotificationServiceClient.sendInAppNotification(user.userId, 'Congratulations! Your solution passed all tests!', 'success');
                AnalyticsServiceClient.trackEvent('Code Submission Success', { challengeId: state.challengeDetails.id });
                // Update user profile with completed challenge, points, achievements
                if (user && !user.challengeHistoryIds.includes(state.challengeDetails.id)) {
                    await AuthServiceClient.updateUserProfile(user.userId, {
                        challengeHistoryIds: [...user.challengeHistoryIds, state.challengeDetails.id],
                        totalPoints: (user.totalPoints || 0) + (state.challengeDetails.difficulty === ChallengeDifficulty.HARD ? 100 : 50),
                        currentStreak: (user.currentStreak || 0) + 1,
                    });
                    NotificationServiceClient.sendInAppNotification(user.userId, `You earned points and increased your streak!`, 'info');
                }
            } else {
                NotificationServiceClient.sendInAppNotification(user.userId, 'Your solution failed some tests. Keep trying!', 'warning');
                AnalyticsServiceClient.trackEvent('Code Submission Failed', { challengeId: state.challengeDetails.id });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during code submission.';
            dispatch({ type: 'SET_SUBMISSION_ERROR', payload: `Submission failed: ${errorMessage}` });
            dispatch({ type: 'UPDATE_SUBMISSION_STATUS', payload: { submissionId, status: 'ERROR', compilerOutput: errorMessage } });
            ErrorReportingServiceClient.captureException(err as Error, { context: "code_submission", challengeId: state.challengeDetails.id });
            NotificationServiceClient.sendInAppNotification(user.userId, `Submission failed: ${errorMessage}`, 'error');
        } finally {
            dispatch({ type: 'SET_SUBMITTING', payload: false });
        }
    }, [state.challengeDetails, user, isAuthenticated]);

    const getHint = useCallback(async (level: number) => {
        if (!state.challengeDetails || !user) {
            NotificationServiceClient.sendInAppNotification(user?.userId || 'guest', 'No challenge or user available to get a hint for.', 'error');
            return;
        }
        if (state.activeHintLevel >= AppConfig.MAX_HINTS_PER_CHALLENGE) {
            NotificationServiceClient.sendInAppNotification(user.userId, 'You have reached the maximum number of hints for this challenge.', 'warning');
            return;
        }

        dispatch({ type: 'SET_ACTIVE_HINT_LEVEL', payload: level });
        AnalyticsServiceClient.trackEvent('Hint Requested', { challengeId: state.challengeDetails.id, level });
        NotificationServiceClient.sendInAppNotification(user.userId, `Fetching hint level ${level}...`, 'info');

        try {
            // For a real hint, we might need the current submission code, or just rely on challenge context
            const currentCode = state.currentSubmission?.submittedCode || state.challengeDetails.starterCode || '';
            const hintText = await AIModelOrchestrator.getAIHint(state.challengeDetails.id, user.userId, currentCode, level);
            // This would likely update the challengeDetails with the new hint or show it in a popover
            // For now, we'll just log and send an in-app notification
            NotificationServiceClient.sendInAppNotification(user.userId, `Hint (Level ${level}): ${hintText.substring(0, 200)}...`, 'info');
            // A more advanced feature would modify challengeDetails.hints array or a separate hint UI state
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred fetching hint.';
            NotificationServiceClient.sendInAppNotification(user.userId, `Failed to fetch hint: ${errorMessage}`, 'error');
            ErrorReportingServiceClient.captureException(err as Error, { context: "fetch_hint", challengeId: state.challengeDetails.id });
        }
    }, [state.challengeDetails, state.activeHintLevel, state.currentSubmission, user]);

    // Initial challenge generation on component mount
    useEffect(() => {
        generateChallenge();
        AnalyticsServiceClient.trackEvent('App Initialized');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    return {
        ...state,
        generateChallenge,
        abortGeneration,
        submitCode,
        getHint,
        dispatch, // Expose dispatch for finer-grained control in sub-components if needed
    };
};

// Story Arc 5: The Interface - Rich UI Components
// With powerful backend services and comprehensive data models, the frontend needed a sophisticated
// way to manage application state, handle complex asynchronous operations, and provide a rich user interface.
// This led to the creation of advanced React hooks and context providers, centralizing state logic
// and making components more declarative and reusable.

// --- UI Components ---

/**
 * @invented ChallengeOptionsPanel
 * @description Component for customizing challenge generation options.
 * This panel was created to give users fine-grained control over the AI's output,
 * enhancing personalization and learning effectiveness.
 */
export const ChallengeOptionsPanel: React.FC<{
    options: IChallengeOptions;
    onOptionChange: (updates: Partial<IChallengeOptions>) => void;
    onGenerate: () => void;
    isLoading: boolean;
}> = ({ options, onOptionChange, onGenerate, isLoading }) => {
    const { user } = useAuth(); // Access user for premium features

    return (
        <div className="bg-surface-secondary p-4 rounded-md shadow-inner mb-6 transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Challenge Customization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col">
                    <label htmlFor="aiModel" className="text-sm font-medium text-text-secondary mb-1">AI Model:</label>
                    <select
                        id="aiModel"
                        value={options.model}
                        onChange={(e) => onOptionChange({ model: e.target.value as AIModel })}
                        className="input-field"
                        disabled={isLoading}
                    >
                        {Object.values(AIModel).map((model) => (
                            <option key={model} value={model} disabled={model === AIModel.CUSTOM_FINE_TUNED && !user?.premiumStatus}>
                                {model.replace(/_/g, ' ')} {model === AIModel.CUSTOM_FINE_TUNED && !user?.premiumStatus && '(Premium)'}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="language" className="text-sm font-medium text-text-secondary mb-1">Language:</label>
                    <select
                        id="language"
                        value={options.programmingLanguage}
                        onChange={(e) => onOptionChange({ programmingLanguage: e.target.value as ProgrammingLanguage })}
                        className="input-field"
                        disabled={isLoading}
                    >
                        {Object.values(ProgrammingLanguage).map((lang) => (
                            <option key={lang} value={lang}>
                                {lang.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="difficulty" className="text-sm font-medium text-text-secondary mb-1">Difficulty:</label>
                    <select
                        id="difficulty"
                        value={options.difficulty}
                        onChange={(e) => onOptionChange({ difficulty: e.target.value as ChallengeDifficulty })}
                        className="input-field"
                        disabled={isLoading}
                    >
                        {Object.values(ChallengeDifficulty).map((diff) => (
                            <option key={diff} value={diff}>
                                {diff.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="challengeType" className="text-sm font-medium text-text-secondary mb-1">Challenge Type:</label>
                    <select
                        id="challengeType"
                        value={options.challengeType}
                        onChange={(e) => onOptionChange({ challengeType: e.target.value as ChallengeType })}
                        className="input-field"
                        disabled={isLoading}
                    >
                        {Object.values(ChallengeType).map((type) => (
                            <option key={type} value={type}>
                                {type.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="topic" className="text-sm font-medium text-text-secondary mb-1">Primary Topic:</label>
                    <select
                        id="topic"
                        value={options.topics[0]}
                        onChange={(e) => onOptionChange({ topics: [e.target.value as ChallengeTopic] })}
                        className="input-field"
                        disabled={isLoading}
                    >
                        {Object.values(ChallengeTopic).map((topic) => (
                            <option key={topic} value={topic}>
                                {topic.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="generateTestCases"
                        checked={options.generateTestCases}
                        onChange={(e) => onOptionChange({ generateTestCases: e.target.checked })}
                        className="checkbox-field"
                        disabled={isLoading}
                    />
                    <label htmlFor="generateTestCases" className="ml-2 text-text-secondary">Generate Test Cases</label>
                </div>
            </div>
            <div className="mt-4">
                <textarea
                    placeholder="Add specific context or keywords (e.g., 'multi-threaded', 'blockchain-enabled smart contract')"
                    value={options.contextDescription || ''}
                    onChange={(e) => onOptionChange({ contextDescription: e.target.value })}
                    className="input-field w-full min-h-[60px]"
                    rows={2}
                    disabled={isLoading}
                />
            </div>
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="btn-primary flex items-center justify-center mt-4 w-full py-2.5"
            >
                {isLoading ? <LoadingSpinner /> : 'Generate Customized Challenge'}
            </button>
        </div>
    );
};

/**
 * @invented CodeEditor
 * @description Component for user code input.
 * This component integrates a powerful, syntax-highlighting code editor (e.g., Monaco Editor)
 * to provide a professional and interactive coding environment directly within the browser.
 * It was developed to enhance the user's coding experience.
 */
export const CodeEditor: React.FC<{
    code: string;
    onCodeChange: (newCode: string) => void;
    language: ProgrammingLanguage;
    readOnly?: boolean;
    height?: string;
}> = ({ code, onCodeChange, language, readOnly = false, height = '400px' }) => {
    // In a real application, this would dynamically load a code editor like Monaco Editor.
    // For this demonstration, we use a simple textarea.
    const languageMap: Record<ProgrammingLanguage, string> = {
        [ProgrammingLanguage.JAVASCRIPT]: 'javascript',
        [ProgrammingLanguage.TYPESCRIPT]: 'typescript',
        [ProgrammingLanguage.PYTHON]: 'python',
        [ProgrammingLanguage.JAVA]: 'java',
        [ProgrammingLanguage.C_PLUS_PLUS]: 'cpp',
        [ProgrammingLanguage.GO]: 'go',
        [ProgrammingLanguage.RUST]: 'rust',
        [ProgrammingLanguage.PHP]: 'php',
        [ProgrammingLanguage.RUBY]: 'ruby',
        [ProgrammingLanguage.SWIFT]: 'swift',
        [ProgrammingLanguage.KOTLIN]: 'kotlin',
        [ProgrammingLanguage.C_SHARP]: 'csharp',
        [ProgrammingLanguage.SCALA]: 'scala',
        [ProgrammingLanguage.PERL]: 'perl',
        [ProgrammingLanguage.HASKELL]: 'haskell',
        [ProgrammingLanguage.SQL]: 'sql',
        [ProgrammingLanguage.DART]: 'dart',
        [ProgrammingLanguage.ELIXIR]: 'elixir',
        [ProgrammingLanguage.OCAML]: 'ocaml',
        [ProgrammingLanguage.F_SHARP]: 'fsharp',
        [ProgrammingLanguage.JULIA]: 'julia',
        [ProgrammingLanguage.R]: 'r',
        [ProgrammingLanguage.LISP]: 'lisp',
        [ProgrammingLanguage.ASSEMBLY]: 'assembly',
        [ProgrammingLanguage.SHELL]: 'shell',
    };

    const displayLanguage = languageMap[language] || 'plaintext';

    return (
        <div className="relative border border-border rounded-md overflow-hidden bg-surface-secondary shadow-lg" style={{ height }}>
            <div className="absolute top-0 right-0 bg-surface-tertiary text-text-secondary text-xs px-2 py-1 rounded-bl-md z-10">
                {displayLanguage}
            </div>
            {/* Replace with MonacoEditor or similar in production */}
            <textarea
                className="w-full h-full p-4 font-mono text-sm bg-surface-secondary text-text-primary focus:outline-none resize-none"
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                readOnly={readOnly}
                spellCheck="false"
                placeholder="// Start coding here..."
            />
            {readOnly && (
                <div className="absolute inset-0 bg-surface-secondary bg-opacity-50 flex items-center justify-center text-text-primary text-xl font-bold">
                    <span className="p-4 bg-surface-tertiary rounded-md">Read-Only Mode</span>
                </div>
            )}
        </div>
    );
};

/**
 * @invented SubmissionResultsPanel
 * @description Component to display the results of a code submission.
 * This panel was designed to provide clear, actionable feedback to users after
 * their code has been evaluated, including test case results, performance metrics,
 * and AI-generated code quality suggestions.
 */
export const SubmissionResultsPanel: React.FC<{
    submission: IChallengeSubmission | null;
    challengeDetails: IChallengeDetails | null;
}> = ({ submission, challengeDetails }) => {
    if (!submission || submission.status === 'PENDING' || submission.status === 'RUNNING') {
        return (
            <div className="p-4 bg-surface rounded-md border border-border flex flex-col items-center justify-center h-full text-text-secondary">
                {submission && submission.status === 'PENDING' && (
                    <>
                        <LoadingSpinner />
                        <p className="mt-2">Submitting code for evaluation...</p>
                    </>
                )}
                {submission && submission.status === 'RUNNING' && (
                    <>
                        <LoadingSpinner />
                        <p className="mt-2">Code is running, tests are executing...</p>
                    </>
                )}
                {!submission && <p>Submit your code to see results here.</p>}
            </div>
        );
    }

    const evaluation = submission.evaluationResults;
    const isSuccess = evaluation?.passed;

    return (
        <div className="p-4 bg-surface rounded-md border border-border overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-text-primary">Submission Results ({submission.status})</h3>
            {isSuccess ? (
                <div className="text-green-500 font-semibold text-lg flex items-center">
                    <span className="mr-2 text-2xl">🎉</span> All Tests Passed!
                </div>
            ) : (
                <div className="text-red-500 font-semibold text-lg flex items-center">
                    <span className="mr-2 text-2xl">❌</span> Some Tests Failed!
                </div>
            )}

            {evaluation && (
                <div className="mt-4">
                    <p className="text-text-secondary">
                        <span className="font-semibold">Tests:</span> {evaluation.passedTestCases} / {evaluation.totalTestCases} passed
                    </p>
                    {evaluation.codeQualityScore && (
                        <p className="text-text-secondary">
                            <span className="font-semibold">Code Quality:</span> {evaluation.codeQualityScore}%
                        </p>
                    )}
                    {evaluation.performanceScore && (
                        <p className="text-text-secondary">
                            <span className="font-semibold">Performance:</span> {evaluation.performanceScore}%
                        </p>
                    )}
                    {submission.executionTimeMs && (
                        <p className="text-text-secondary">
                            <span className="font-semibold">Execution Time:</span> {submission.executionTimeMs} ms
                        </p>
                    )}
                    {submission.memoryUsedKb && (
                        <p className="text-text-secondary">
                            <span className="font-semibold">Memory Used:</span> {(submission.memoryUsedKb / 1024).toFixed(2)} MB
                        </p>
                    )}
                    {evaluation.plagiarismDetected && (
                        <p className="text-red-500 font-semibold mt-2">
                            🚨 Plagiarism Detected! Score: {evaluation.plagiarismScore}%
                        </p>
                    )}

                    {evaluation.feedback && (
                        <div className="mt-4 p-3 bg-surface-secondary border border-border rounded-md">
                            <h4 className="font-semibold text-text-primary">AI Feedback:</h4>
                            <p className="text-text-secondary whitespace-pre-wrap">{evaluation.feedback}</p>
                        </div>
                    )}

                    {evaluation.recommendations && evaluation.recommendations.length > 0 && (
                        <div className="mt-4 p-3 bg-surface-secondary border border-border rounded-md">
                            <h4 className="font-semibold text-text-primary">AI Recommendations:</h4>
                            <ul className="list-disc list-inside text-text-secondary">
                                {evaluation.recommendations.map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {evaluation.failedTestCases.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-text-primary">Failed Test Cases:</h4>
                            {evaluation.failedTestCases.map((test, index) => (
                                <div key={index} className="bg-surface-tertiary p-3 rounded-md mt-2 border border-border">
                                    <p className="font-medium text-text-primary">Test Case: {test.testCaseId} ({test.description || 'No description'})</p>
                                    <p className="text-red-400 text-sm">Input: <code className="bg-background-dark p-1 rounded text-white">{test.input}</code></p>
                                    <p className="text-red-400 text-sm">Expected: <code className="bg-background-dark p-1 rounded text-white">{test.expectedOutput}</code></p>
                                    <p className="text-red-500 text-sm">Actual: <code className="bg-background-dark p-1 rounded text-white">{test.actualOutput}</code></p>
                                    {test.errorMessage && <p className="text-red-600 text-sm italic mt-1">Error: {test.errorMessage}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {submission.compilerOutput && (
                <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-md">
                    <h4 className="font-semibold text-red-400">Compiler/Runtime Output:</h4>
                    <pre className="text-red-300 text-sm whitespace-pre-wrap font-mono">{submission.compilerOutput}</pre>
                </div>
            )}
        </div>
    );
};

/**
 * @invented ChallengeHistoryViewer
 * @description Displays a user's past challenge attempts and solutions.
 * This component was developed to provide users with a complete record of their learning
 * journey, allowing them to review past challenges, solutions, and evaluation results.
 */
export const ChallengeHistoryViewer: React.FC<{
    userId: string;
    onChallengeSelect: (challengeId: string) => void;
    onViewSubmission: (submissionId: string) => void;
}> = ({ userId, onChallengeSelect, onViewSubmission }) => {
    const [history, setHistory] = useState<IChallengeDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // In a real scenario, this would fetch from a user's challenge history records
                const mockHistory: IChallengeDetails[] = [
                    {
                        id: 'challenge-001',
                        title: 'Reverse a Linked List Recursively',
                        description: 'Implement a function to reverse a singly linked list using recursion.',
                        programmingLanguage: ProgrammingLanguage.PYTHON,
                        difficulty: ChallengeDifficulty.MEDIUM,
                        topics: [ChallengeTopic.DATA_STRUCTURES],
                        challengeType: ChallengeType.ALGORITHMIC_PUZZLE,
                        createdAt: '2023-01-15T10:00:00Z',
                        modelUsed: AIModel.CHATGPT_3_5,
                        estimatedTimeMinutes: 30
                    },
                    {
                        id: 'challenge-002',
                        title: 'Design a URL Shortener Service',
                        description: 'Design a highly scalable and fault-tolerant URL shortener service.',
                        programmingLanguage: ProgrammingLanguage.JAVA,
                        difficulty: ChallengeDifficulty.GOD_TIER,
                        topics: [ChallengeTopic.SYSTEM_DESIGN],
                        challengeType: ChallengeType.SYSTEM_DESIGN,
                        createdAt: '2023-02-20T14:30:00Z',
                        modelUsed: AIModel.GEMINI_PRO,
                        estimatedTimeMinutes: 180
                    },
                ];
                setHistory(mockHistory);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load challenge history.';
                setError(message);
                ErrorReportingServiceClient.captureException(err as Error, { context: "challenge_history_fetch", userId });
            } finally {
                setIsLoading(false);
            }
        };
        if (userId) {
            fetchHistory();
        }
    }, [userId]);

    if (!userId) {
        return <div className="p-4 text-text-secondary">Please log in to view your challenge history.</div>;
    }

    if (isLoading) {
        return <div className="p-4 flex justify-center items-center"><LoadingSpinner /><span className="ml-2">Loading history...</span></div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    if (history.length === 0) {
        return <div className="p-4 text-text-secondary">No challenges in your history yet. Start generating!</div>;
    }

    return (
        <div className="p-4 bg-surface rounded-md border border-border mt-4">
            <h3 className="text-xl font-bold mb-4 text-text-primary">Your Challenge History</h3>
            <ul className="space-y-3">
                {history.map((challenge) => (
                    <li key={challenge.id} className="bg-surface-secondary p-3 rounded-md border border-border-light hover:bg-surface-tertiary transition-colors duration-200">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-text-primary">{challenge.title}</span>
                            <span className="text-sm text-text-secondary">{new Date(challenge.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">
                            {challenge.programmingLanguage.replace(/_/g, ' ')} | {challenge.difficulty.replace(/_/g, ' ')} | {challenge.topics[0].replace(/_/g, ' ')}
                        </p>
                        <div className="mt-2 flex space-x-2">
                            <button onClick={() => onChallengeSelect(challenge.id)} className="btn-secondary btn-sm">View Challenge</button>
                            {/* In a real scenario, we'd fetch submission IDs associated with this challenge for the user */}
                            <button onClick={() => onViewSubmission(`sub-for-${challenge.id}`)} className="btn-secondary btn-sm" disabled>View Last Submission (Mock)</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/**
 * @invented UserProfileDashboard
 * @description Component to display and edit the user's profile information.
 * This dashboard was developed to empower users to manage their personal data,
 * preferences, and view their achievements and statistics, fostering a sense of ownership.
 */
export const UserProfileDashboard: React.FC = () => {
    const { user, isLoadingAuth, updateProfile } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [editedUsername, setEditedUsername] = useState(user?.username || '');
    const [editedPreferredLang, setEditedPreferredLang] = useState(user?.preferredLanguage || AppConfig.DEFAULT_LANGUAGE);
    const [editedPreferredDiff, setEditedPreferredDiff] = useState(user?.preferredDifficulty || AppConfig.DEFAULT_DIFFICULTY);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setEditedUsername(user.username);
            setEditedPreferredLang(user.preferredLanguage);
            setEditedPreferredDiff(user.preferredDifficulty);
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);
        try {
            await updateProfile({
                username: editedUsername,
                preferredLanguage: editedPreferredLang,
                preferredDifficulty: editedPreferredDiff,
            });
            setEditMode(false);
            NotificationServiceClient.sendInAppNotification(user!.userId, 'Profile updated successfully!', 'success');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to save profile.';
            setSaveError(message);
            NotificationServiceClient.sendInAppNotification(user!.userId, `Profile update failed: ${message}`, 'error');
            ErrorReportingServiceClient.captureException(error as Error, { context: "user_profile_save", userId: user?.userId });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingAuth) {
        return <div className="p-4 flex justify-center items-center"><LoadingSpinner /><span className="ml-2">Loading user profile...</span></div>;
    }

    if (!user) {
        return <div className="p-4 text-text-secondary">Please log in to view your profile.</div>;
    }

    return (
        <div className="p-6 bg-surface-secondary rounded-md shadow-lg mt-6">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">Your Profile</h2>
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <img src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-primary-500" />
                    <div>
                        <p className="text-xl font-semibold text-text-primary">{user.username}</p>
                        <p className="text-text-secondary">{user.email}</p>
                        {user.premiumStatus && <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full mt-1">Premium User</span>}
                    </div>
                </div>

                {!editMode ? (
                    <>
                        <p className="text-text-primary"><span className="font-semibold">Preferred Language:</span> {user.preferredLanguage.replace(/_/g, ' ')}</p>
                        <p className="text-text-primary"><span className="font-semibold">Preferred Difficulty:</span> {user.preferredDifficulty.replace(/_/g, ' ')}</p>
                        <p className="text-text-primary"><span className="font-semibold">Total Points:</span> {user.totalPoints}</p>
                        <p className="text-text-primary"><span className="font-semibold">Current Streak:</span> {user.currentStreak} days</p>
                        <button onClick={() => setEditMode(true)} className="btn-secondary">Edit Profile</button>
                    </>
                ) : (
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="editUsername" className="block text-sm font-medium text-text-secondary">Username</label>
                            <input
                                id="editUsername"
                                type="text"
                                value={editedUsername}
                                onChange={(e) => setEditedUsername(e.target.value)}
                                className="input-field mt-1 w-full"
                                required
                                disabled={isSaving}
                            />
                        </div>
                        <div>
                            <label htmlFor="editPreferredLang" className="block text-sm font-medium text-text-secondary">Preferred Language</label>
                            <select
                                id="editPreferredLang"
                                value={editedPreferredLang}
                                onChange={(e) => setEditedPreferredLang(e.target.value as ProgrammingLanguage)}
                                className="input-field mt-1 w-full"
                                disabled={isSaving}
                            >
                                {Object.values(ProgrammingLanguage).map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="editPreferredDiff" className="block text-sm font-medium text-text-secondary">Preferred Difficulty</label>
                            <select
                                id="editPreferredDiff"
                                value={editedPreferredDiff}
                                onChange={(e) => setEditedPreferredDiff(e.target.value as ChallengeDifficulty)}
                                className="input-field mt-1 w-full"
                                disabled={isSaving}
                            >
                                {Object.values(ChallengeDifficulty).map((diff) => (
                                    <option key={diff} value={diff}>
                                        {diff.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {saveError && <p className="text-red-500 text-sm mt-2">{saveError}</p>}
                        <div className="flex space-x-2 mt-4">
                            <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
                                {isSaving ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                            </button>
                            <button onClick={() => setEditMode(false)} className="btn-secondary" disabled={isSaving}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
            {user.skillsInventory && Object.keys(user.skillsInventory).length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3 text-text-primary">Skills Inventory</h3>
                    <div className="grid grid-cols-2 gap-3 text-text-secondary">
                        {Object.entries(user.skillsInventory).map(([skill, level]) => (
                            <div key={skill} className="flex justify-between items-center bg-surface-tertiary p-2 rounded-md">
                                <span className="font-medium">{skill.replace(/_/g, ' ')}</span>
                                <span className="text-sm bg-primary-500 text-white px-2 py-0.5 rounded-full">{level}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3 text-text-primary">Achievements</h3>
                {user.achievements.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.achievements.map((achievementId) => (
                            <li key={achievementId} className="flex items-center p-3 bg-surface-tertiary rounded-md border border-border-light">
                                <span className="text-2xl mr-3">🏆</span> {/* Placeholder for icon */}
                                <span className="font-medium text-text-primary">
                                    {achievementId.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-text-secondary">No achievements yet. Keep coding!</p>
                )}
            </div>
        </div>
    );
};

/**
 * @invented LoginRegisterPanel
 * @description Component for user login and registration.
 * This panel provides a secure and user-friendly interface for new and existing users
 * to authenticate, serving as the gateway to personalized features.
 */
export const LoginRegisterPanel: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
    const { login, register, isLoadingAuth, isAuthenticated } = useAuth();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loginRegisterError, setLoginRegisterError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginRegisterError('');
        setIsSubmitting(true);
        try {
            if (isRegisterMode) {
                await register({ email, password, username });
            } else {
                await login({ email, password });
            }
            onLoginSuccess?.();
            // Clear form
            setEmail('');
            setPassword('');
            setUsername('');
        } catch (err) {
            setLoginRegisterError((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isAuthenticated) {
        return (
            <div className="p-4 bg-surface-secondary rounded-md text-text-primary">
                <p>You are logged in.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-surface-secondary rounded-md shadow-lg w-full max-w-md mx-auto my-8">
            <h2 className="text-2xl font-bold mb-6 text-text-primary text-center">
                {isRegisterMode ? 'Register Account' : 'Login'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegisterMode && (
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-text-secondary">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field mt-1 w-full"
                            required
                            disabled={isSubmitting || isLoadingAuth}
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field mt-1 w-full"
                        required
                        disabled={isSubmitting || isLoadingAuth}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field mt-1 w-full"
                        required
                        disabled={isSubmitting || isLoadingAuth}
                    />
                </div>
                {loginRegisterError && <p className="text-red-500 text-sm">{loginRegisterError}</p>}
                <button
                    type="submit"
                    className="btn-primary w-full py-2.5 flex items-center justify-center"
                    disabled={isSubmitting || isLoadingAuth}
                >
                    {(isSubmitting || isLoadingAuth) ? <LoadingSpinner size="sm" /> : (isRegisterMode ? 'Register' : 'Login')}
                </button>
            </form>
            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                    className="text-primary-400 hover:underline text-sm"
                    disabled={isSubmitting || isLoadingAuth}
                >
                    {isRegisterMode ? 'Already have an account? Login' : "Don't have an account? Register"}
                </button>
            </div>
        </div>
    );
};


/**
 * @invented HintsDisplay
 * @description Component to display hints for a challenge.
 * This feature was developed to assist users when they are stuck, providing
 * progressive hints generated by AI, carefully designed not to reveal the full solution.
 */
export const HintsDisplay: React.FC<{
    challengeDetails: IChallengeDetails | null;
    activeHintLevel: number;
    onGetHint: (level: number) => void;
}> = ({ challengeDetails, activeHintLevel, onGetHint }) => {
    if (!challengeDetails || !challengeDetails.hints || challengeDetails.hints.length === 0) {
        return <div className="p-4 text-text-secondary">No hints available for this challenge yet.</div>;
    }

    const maxHints = challengeDetails.hints.length;
    const hintsToShow = challengeDetails.hints.slice(0, activeHintLevel);

    return (
        <div className="p-4 bg-surface rounded-md border border-border mt-4">
            <h3 className="text-xl font-bold mb-4 text-text-primary">Hints</h3>
            <div className="space-y-3">
                {hintsToShow.length > 0 ? (
                    hintsToShow.map((hint, index) => (
                        <div key={index} className="bg-surface-secondary p-3 rounded-md border border-border-light">
                            <p className="font-medium text-text-primary">Hint {index + 1}:</p>
                            <p className="text-text-secondary">{hint}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-text-secondary">No hints revealed yet.</p>
                )}
                {activeHintLevel < maxHints && (
                    <button onClick={() => onGetHint(activeHintLevel + 1)} className="btn-secondary mt-3">
                        Get Next Hint ({activeHintLevel + 1}/{maxHints})
                    </button>
                )}
                {activeHintLevel >= maxHints && (
                    <p className="text-text-secondary italic">All available hints have been revealed.</p>
                )}
            </div>
        </div>
    );
};

// Story Arc 6: The Global Stage - Main Application Integration
// All the individual components and services converge here. The main `AiCodingChallenge`
// component is transformed from a simple generator into a comprehensive, interactive learning
// and development environment, showcasing the full power of the platform.

/**
 * @invented AiCodingChallenge
 * @description The main component for the AI Coding Challenge application.
 * This high-level component orchestrates the entire user experience,
 * integrating challenge generation, customization, code editing, submission,
 * evaluation, user profile management, and more. It embodies the culmination
 * of all the features and services developed.
 * @exports
 */
export const AiCodingChallenge: React.FC = () => {
    const {
        challengeDetails,
        isLoading,
        error,
        options,
        generateChallenge,
        abortGeneration,
        submitCode,
        currentSubmission,
        isSubmitting,
        submissionError,
        dispatch,
        getHint,
        activeHintLevel
    } = useChallengeGenerator();

    const { isAuthenticated, user, isLoadingAuth, login, logout } = useAuth(); // For showing login/logout

    const [userCode, setUserCode] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'challenge' | 'editor' | 'results' | 'history' | 'profile'>('challenge');

    useEffect(() => {
        if (challengeDetails?.starterCode) {
            setUserCode(challengeDetails.starterCode);
        } else if (!challengeDetails && !isLoading) {
            setUserCode('');
        }
    }, [challengeDetails, isLoading]);


    const handleInitialGenerate = useCallback(async () => {
        // This is the initial call when the component loads.
        // The useChallengeGenerator's useEffect already handles it, but this keeps the original handleGenerate signature
        // The initial handleGenerate in the original code called `generateCodingChallengeStream(null);`
        // Now it's orchestrated through `useChallengeGenerator` with default options.
        // The `useChallengeGenerator` hook already calls `generateChallenge()` on mount.
        // We'll redirect the button to use the `generateChallenge` from the hook.
        generateChallenge();
        AnalyticsServiceClient.trackEvent('Main Generate Button Clicked');
    }, [generateChallenge]);

    const handleChallengeOptionChange = useCallback((updates: Partial<IChallengeOptions>) => {
        dispatch({ type: 'UPDATE_OPTIONS', payload: updates });
    }, [dispatch]);

    const handleCodeSubmit = useCallback(async () => {
        if (!isAuthenticated) {
            NotificationServiceClient.sendInAppNotification('guest', 'Please log in to submit code.', 'warning');
            return;
        }
        await submitCode(userCode);
        setActiveTab('results'); // Switch to results tab after submission
    }, [submitCode, userCode, isAuthenticated]);

    return (
        <AuthProvider> {/* Ensure AuthProvider wraps the content */}
            <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary bg-background-light">
                <header className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-surface p-4 rounded-md shadow-lg border border-border">
                    <div className="text-center sm:text-left mb-4 sm:mb-0">
                        <h1 className="text-3xl font-bold flex items-center justify-center sm:justify-start">
                            <BeakerIcon />
                            <span className="ml-3">AI Coding Challenge Nexus</span>
                        </h1>
                        <p className="text-text-secondary mt-1">
                            Unleash the power of multi-modal AI to master your coding skills.
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {!isAuthenticated && !isLoadingAuth && (
                            <button onClick={() => setActiveTab('profile')} className="btn-secondary px-4 py-2">Login / Register</button>
                        )}
                        {isAuthenticated && !isLoadingAuth && user && (
                            <div className="flex items-center space-x-2">
                                <img src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt="User Avatar" className="w-8 h-8 rounded-full" />
                                <span className="text-text-primary hidden md:inline">{user.username}</span>
                                <button onClick={logout} className="btn-secondary px-4 py-2">Logout</button>
                            </div>
                        )}
                        {isLoadingAuth && <LoadingSpinner />}
                        <button
                            onClick={isLoading ? abortGeneration : handleInitialGenerate}
                            disabled={isLoadingAuth}
                            className={`btn-primary flex items-center justify-center px-6 py-3 ${isLoading ? 'bg-red-600 hover:bg-red-700' : ''}`}
                        >
                            {isLoading ? <><LoadingSpinner /> <span className="ml-2">Cancel Generation</span></> : 'Generate New Challenge'}
                        </button>
                    </div>
                </header>

                <ChallengeOptionsPanel
                    options={options}
                    onOptionChange={handleChallengeOptionChange}
                    onGenerate={generateChallenge}
                    isLoading={isLoading}
                />

                <nav className="flex space-x-1 p-1 bg-surface-secondary rounded-md mb-4 shadow-sm border border-border">
                    <button onClick={() => setActiveTab('challenge')} className={`tab-button ${activeTab === 'challenge' ? 'tab-button-active' : ''}`}>
                        Challenge
                    </button>
                    <button onClick={() => setActiveTab('editor')} className={`tab-button ${activeTab === 'editor' ? 'tab-button-active' : ''}`}>
                        Code Editor
                    </button>
                    <button onClick={() => setActiveTab('results')} className={`tab-button ${activeTab === 'results' ? 'tab-button-active' : ''}`}>
                        Results
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`tab-button ${activeTab === 'history' ? 'tab-button-active' : ''}`} disabled={!isAuthenticated}>
                        History {isAuthenticated && user && `(${user.challengeHistoryIds.length})`}
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`tab-button ${activeTab === 'profile' ? 'tab-button-active' : ''}`}>
                        Profile
                    </button>
                </nav>

                <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 overflow-y-auto">
                    {activeTab === 'challenge' && (
                        <div className="lg:col-span-2">
                            <div className="p-4 bg-surface rounded-md border border-border overflow-y-auto min-h-[300px]">
                                {isLoading && (
                                    <div className="flex items-center justify-center h-full">
                                        <LoadingSpinner />
                                        <span className="ml-3 text-text-secondary">Generating your challenge...</span>
                                    </div>
                                )}
                                {error && <p className="text-red-500">{error}</p>}
                                {challengeDetails && !isLoading && (
                                    <>
                                        <h2 className="text-2xl font-bold mb-3 text-text-primary">{challengeDetails.title}</h2>
                                        <p className="text-sm text-text-secondary mb-4">
                                            Difficulty: <span className="font-semibold">{challengeDetails.difficulty.replace(/_/g, ' ')}</span> |
                                            Language: <span className="font-semibold">{challengeDetails.programmingLanguage.replace(/_/g, ' ')}</span> |
                                            Topic: <span className="font-semibold">{challengeDetails.topics[0]?.replace(/_/g, ' ') || 'General'}</span>
                                        </p>
                                        <MarkdownRenderer content={challengeDetails.description} />
                                        {challengeDetails.testCases && challengeDetails.testCases.filter(tc => tc.isSample).length > 0 && (
                                            <div className="mt-6">
                                                <h3 className="text-xl font-bold mb-2 text-text-primary">Sample Test Cases</h3>
                                                {challengeDetails.testCases.filter(tc => tc.isSample).map((tc, index) => (
                                                    <div key={index} className="bg-surface-secondary p-3 rounded-md mt-2 border border-border">
                                                        <p className="font-medium text-text-primary">Input:</p>
                                                        <pre className="bg-background-dark text-white p-2 rounded text-sm overflow-x-auto">{tc.input}</pre>
                                                        <p className="font-medium text-text-primary mt-2">Expected Output:</p>
                                                        <pre className="bg-background-dark text-white p-2 rounded text-sm overflow-x-auto">{tc.expectedOutput}</pre>
                                                        {tc.description && <p className="text-text-secondary text-sm mt-1 italic">{tc.description}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <HintsDisplay
                                            challengeDetails={challengeDetails}
                                            activeHintLevel={activeHintLevel}
                                            onGetHint={getHint}
                                        />
                                    </>
                                )}
                                {!isLoading && !challengeDetails && !error && (
                                    <div className="text-text-secondary h-full flex items-center justify-center">
                                        Click "Generate New Challenge" to start your coding adventure!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'editor' && (
                        <div className="lg:col-span-2 flex flex-col space-y-4">
                            <div className="bg-surface rounded-md border border-border p-4">
                                <h3 className="text-xl font-bold mb-3 text-text-primary">Your Code</h3>
                                <CodeEditor
                                    code={userCode}
                                    onCodeChange={setUserCode}
                                    language={challengeDetails?.programmingLanguage || AppConfig.DEFAULT_LANGUAGE}
                                    height="500px"
                                />
                                <button
                                    onClick={handleCodeSubmit}
                                    disabled={isSubmitting || isLoading || !challengeDetails}
                                    className="btn-primary flex items-center justify-center w-full mt-4 py-2.5"
                                >
                                    {isSubmitting ? <LoadingSpinner /> : 'Submit Code'}
                                </button>
                                {submissionError && <p className="text-red-500 mt-2">{submissionError}</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div className="lg:col-span-2">
                            <SubmissionResultsPanel
                                submission={currentSubmission}
                                challengeDetails={challengeDetails}
                            />
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="lg:col-span-2">
                            <ChallengeHistoryViewer
                                userId={user?.userId || ''}
                                onChallengeSelect={(id) => {
                                    // In a real app, this would fetch the challenge and set it as active
                                    console.log('Selected challenge from history:', id);
                                    NotificationServiceClient.sendInAppNotification(user?.userId || 'guest', `Mock: Navigating to challenge ${id}`, 'info');
                                }}
                                onViewSubmission={(id) => {
                                    // In a real app, this would fetch the submission and display it
                                    console.log('Viewing submission from history:', id);
                                    NotificationServiceClient.sendInAppNotification(user?.userId || 'guest', `Mock: Viewing submission ${id}`, 'info');
                                }}
                            />
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="lg:col-span-2">
                            {!isAuthenticated ? (
                                <LoginRegisterPanel onLoginSuccess={() => setActiveTab('challenge')} />
                            ) : (
                                <UserProfileDashboard />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthProvider>
    );
};
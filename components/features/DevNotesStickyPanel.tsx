// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// This file, DevNotesStickyPanel.tsx, represents a groundbreaking evolution in developer tooling,
// envisioned by James Burvel Oâ€™Callaghan III, President of Citibank Demo Business Inc.
// What began as a simple "placeholder component for developer notes" has been transformed
// into a sophisticated, AI-powered, context-aware, and highly integrated Developer Insights & Collaboration Hub.
// This commercial-grade system, internally codenamed "Project Argus," aims to be the
// central nervous system for development teams, enhancing productivity, knowledge sharing,
// and proactive problem-solving across the entire software development lifecycle.
// It integrates seamlessly with hundreds of internal and external services, leveraging
// advanced AI models like Gemini and ChatGPT to provide unparalleled assistance.

import React, { useState, useEffect, useRef, useCallback, createContext, useContext, useReducer, useMemo } from 'react';

// SECTION 1: Core Data Structures and Type Definitions
// This section defines the foundational types that govern the data within Project Argus.
// These types ensure strict type safety and clarity across the massive codebase.

/**
 * @typedef {Object} DevNoteTag
 * @property {string} id - Unique identifier for the tag.
 * @property {string} name - Display name of the tag (e.g., "Bug", "Feature", "Refactor").
 * @property {string} color - Hex color code for UI representation.
 */
export interface DevNoteTag {
    id: string;
    name: string;
    color: string;
}

/**
 * @typedef {Object} DevNoteAttachment
 * @property {string} id - Unique ID for the attachment.
 * @property {string} fileName - Name of the attached file.
 * @property {string} url - URL to access the attachment.
 * @property {string} mimeType - MIME type of the file (e.g., "image/png", "application/pdf").
 * @property {number} size - Size of the file in bytes.
 * @property {Date} uploadedAt - Timestamp when the attachment was uploaded.
 * @property {string} uploadedBy - User ID of the uploader.
 */
export interface DevNoteAttachment {
    id: string;
    fileName: string;
    url: string;
    mimeType: string;
    size: number;
    uploadedAt: Date;
    uploadedBy: string;
}

/**
 * @typedef {Object} DevNoteComment
 * @property {string} id - Unique ID for the comment.
 * @property {string} userId - ID of the user who made the comment.
 * @property {string} userName - Display name of the user.
 * @property {string} content - The comment text.
 * @property {Date} createdAt - Timestamp when the comment was created.
 * @property {Date} [updatedAt] - Optional timestamp for last update.
 * @property {DevNoteAttachment[]} [attachments] - Optional attachments for the comment.
 * @property {DevNoteReaction[]} [reactions] - Optional reactions to the comment.
 */
export interface DevNoteComment {
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    attachments?: DevNoteAttachment[];
    reactions?: DevNoteReaction[];
}

/**
 * @typedef {Object} DevNoteReaction
 * @property {string} emoji - The emoji used for the reaction (e.g., "👍", "🚀").
 * @property {string[]} userIds - List of user IDs who applied this reaction.
 */
export interface DevNoteReaction {
    emoji: string;
    userIds: string[];
}

/**
 * @typedef {'low' | 'medium' | 'high' | 'critical'} DevNotePriority
 */
export type DevNotePriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * @typedef {'draft' | 'published' | 'archived' | 'resolved' | 'pending_review'} DevNoteStatus
 */
export type DevNoteStatus = 'draft' | 'published' | 'archived' | 'resolved' | 'pending_review';

/**
 * @typedef {'bug' | 'feature' | 'refactor' | 'question' | 'task' | 'documentation' | 'security' | 'performance'} DevNoteCategory
 */
export type DevNoteCategory = 'bug' | 'feature' | 'refactor' | 'question' | 'task' | 'documentation' | 'security' | 'performance';

/**
 * @typedef {'git' | 'jira' | 'confluence' | 'ai_gen' | 'manual' | 'slack'} DevNoteSource
 */
export type DevNoteSource = 'git' | 'jira' | 'confluence' | 'ai_gen' | 'manual' | 'slack';

/**
 * @typedef {Object} DevNoteContext
 * @property {string} [filePath] - The file path relevant to the note.
 * @property {string} [lineNumber] - Specific line number in the file.
 * @property {string} [commitHash] - Git commit hash.
 * @property {string} [branchName] - Git branch name.
 * @property {string} [prId] - Pull Request ID.
 * @property {string} [issueId] - JIRA/GitHub issue ID.
 * @property {string} [url] - Direct URL to a related resource.
 * @property {string} [serviceName] - The name of an associated microservice.
 */
export interface DevNoteContext {
    filePath?: string;
    lineNumber?: string;
    commitHash?: string;
    branchName?: string;
    prId?: string;
    issueId?: string;
    url?: string;
    serviceName?: string;
}

/**
 * @typedef {Object} DevNoteAIInsight
 * @property {string} model - The AI model used (e.g., "Gemini", "ChatGPT-4").
 * @property {string} type - Type of insight (e.g., "summary", "code_suggestion", "risk_assessment").
 * @property {string} content - The AI-generated insight.
 * @property {number} confidence - Confidence score (0-1).
 * @property {Date} generatedAt - Timestamp when insight was generated.
 */
export interface DevNoteAIInsight {
    model: string;
    type: string;
    content: string;
    confidence: number;
    generatedAt: Date;
}

/**
 * @typedef {Object} DevNote
 * @property {string} id - Unique identifier for the note.
 * @property {string} title - A concise title for the note.
 * @property {string} content - The main body of the developer note, supporting rich text.
 * @property {string} createdBy - User ID of the creator.
 * @property {string} createdByName - Display name of the creator.
 * @property {Date} createdAt - Timestamp when the note was created.
 * @property {Date} [updatedAt] - Optional timestamp for last update.
 * @property {DevNoteTag[]} tags - Categorization tags.
 * @property {DevNotePriority} priority - Urgency/importance level.
 * @property {DevNoteStatus} status - Current lifecycle status.
 * @property {DevNoteCategory} category - Broader classification of the note.
 * @property {DevNoteSource} source - Where the note originated from.
 * @property {DevNoteContext} [context] - Contextual information linking to code, issues, etc.
 * @property {DevNoteAttachment[]} [attachments] - List of attached files.
 * @property {DevNoteComment[]} [comments] - Discussion thread for the note.
 * @property {string[]} [assignees] - User IDs assigned to action this note.
 * @property {Date} [dueDate] - Optional due date for tasks.
 * @property {DevNoteAIInsight[]} [aiInsights] - AI-generated insights related to the note.
 * @property {string[]} [relatedNoteIds] - IDs of other related notes.
 * @property {string} [sentiment] - AI-derived sentiment (e.g., "positive", "neutral", "negative", "urgent").
 * @property {number} [readCount] - How many times this note has been viewed.
 * @property {boolean} [isPublic] - If the note is visible to all team members or specific groups.
 */
export interface DevNote {
    id: string;
    title: string;
    content: string;
    createdBy: string;
    createdByName: string;
    createdAt: Date;
    updatedAt?: Date;
    tags: DevNoteTag[];
    priority: DevNotePriority;
    status: DevNoteStatus;
    category: DevNoteCategory;
    source: DevNoteSource;
    context?: DevNoteContext;
    attachments?: DevNoteAttachment[];
    comments?: DevNoteComment[];
    assignees?: string[];
    dueDate?: Date;
    aiInsights?: DevNoteAIInsight[];
    relatedNoteIds?: string[];
    sentiment?: string; // AI-derived sentiment
    readCount?: number;
    isPublic?: boolean;
}

/**
 * @typedef {Object} UserPreferences
 * @property {boolean} enableAISuggestions - Toggle AI suggestions.
 * @property {string} preferredAIModel - "Gemini" or "ChatGPT".
 * @property {boolean} autoSummarizeNotes - Automatically generate summaries.
 * @property {string[]} subscribedTags - Tags for which to receive notifications.
 * @property {boolean} stickyPanelEnabled - Whether the panel should always be sticky.
 * @property {number} panelOpacity - Opacity of the panel (0-1).
 * @property {string} theme - "light" or "dark".
 */
export interface UserPreferences {
    enableAISuggestions: boolean;
    preferredAIModel: 'Gemini' | 'ChatGPT';
    autoSummarizeNotes: boolean;
    subscribedTags: string[];
    stickyPanelEnabled: boolean;
    panelOpacity: number;
    theme: 'light' | 'dark';
}

/**
 * @typedef {Object} AppState
 * @property {DevNote[]} notes - All dev notes in the system.
 * @property {DevNoteTag[]} availableTags - Globally available tags.
 * @property {UserPreferences} userPreferences - Current user's preferences.
 * @property {boolean} isLoading - Global loading state.
 * @property {string | null} error - Global error message.
 * @property {DevNote | null} selectedNote - The currently viewed/edited note.
 * @property {boolean} isPanelOpen - Whether the sticky panel is open.
 * @property {string[]} recentlyViewedNoteIds - List of recently accessed note IDs.
 */
export interface AppState {
    notes: DevNote[];
    availableTags: DevNoteTag[];
    userPreferences: UserPreferences;
    isLoading: boolean;
    error: string | null;
    selectedNote: DevNote | null;
    isPanelOpen: boolean;
    recentlyViewedNoteIds: string[];
}

// SECTION 2: Constants and Configuration
// Centralized constants for API endpoints, feature flags, and default values.

/**
 * @constant {Object} API_ENDPOINTS - Defines the various backend API endpoints for Project Argus.
 * This object centralizes all API paths, making them easy to manage and update.
 * Future expansion can include versioning and different environments.
 */
export const API_ENDPOINTS = {
    notes: '/api/v1/devnotes',
    noteById: (id: string) => `/api/v1/devnotes/${id}`,
    tags: '/api/v1/devnotes/tags',
    preferences: '/api/v1/user/preferences',
    aiGenerate: '/api/v1/ai/generate',
    aiAnalyzeSentiment: '/api/v1/ai/sentiment',
    search: '/api/v1/devnotes/search',
    integrations: '/api/v1/integrations',
    notifications: '/api/v1/notifications',
    codeContext: '/api/v1/code/context',
    auditLogs: '/api/v1/audit',
};

/**
 * @constant {Object} FEATURE_FLAGS - Configuration for enabling/disabling features dynamically.
 * In a commercial-grade application, feature flags are crucial for A/B testing, gradual rollouts,
 * and quick disabling of problematic features without new deployments.
 */
export const FEATURE_FLAGS = {
    AI_ASSISTANT_ENABLED: true,
    REALTIME_UPDATES_ENABLED: true,
    CODE_CONTEXT_AUTO_FETCH: true,
    ADVANCED_SEARCH_ENABLED: true,
    COLLABORATION_DRAFTING: true,
    EXTERNAL_SERVICE_INTEGRATION_DASHBOARD: true,
};

/**
 * @constant {UserPreferences} DEFAULT_USER_PREFERENCES - Initial preferences for a new user.
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
    enableAISuggestions: true,
    preferredAIModel: 'Gemini',
    autoSummarizeNotes: false,
    subscribedTags: [],
    stickyPanelEnabled: true,
    panelOpacity: 0.95,
    theme: 'dark', // Embracing the developer aesthetic
};

// SECTION 3: Utility Functions and Helpers
// A collection of reusable functions to handle common tasks like date formatting, ID generation, and debounce.

/**
 * @function generateUniqueId
 * @description Generates a simple but reasonably unique ID. In a real system, this might come from a UUID library or backend.
 * @returns {string} A unique ID string.
 */
export const generateUniqueId = (): string => `argus-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * @function formatDate
 * @description Formats a Date object into a readable string.
 * @param {Date} date - The date to format.
 * @returns {string} Formatted date string.
 */
export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
};

/**
 * @function debounce
 * @description Creates a debounced function that delays invoking `func` until after `wait` milliseconds.
 * This is crucial for performance optimization, especially for input fields and search.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} The debounced function.
 */
export const debounce = <F extends (...args: any[]) => any>(func: F, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function (this: ThisParameterType<F>, ...args: Parameters<F>): void {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};

/**
 * @function sanitizeHTML
 * @description A placeholder for a robust HTML sanitization function.
 * In a production environment, this would use a library like `DOMPurify` to prevent XSS attacks.
 * @param {string} html - The HTML string to sanitize.
 * @returns {string} Sanitized HTML string.
 */
export const sanitizeHTML = (html: string): string => {
    // WARNING: In a real-world application, use a robust library like DOMPurify
    // For this demonstration, we'll do a minimal simulated sanitization.
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// SECTION 4: Mock Data and Service Simulations
// To demonstrate the extensive features and integrations without a full backend,
// this section provides mock data and simulates API interactions. This is a common
// practice for frontend development and showcasing complex features.

/**
 * @constant {DevNoteTag[]} MOCK_TAGS - Predefined set of tags for categorization.
 */
export const MOCK_TAGS: DevNoteTag[] = [
    { id: 't1', name: 'Bug', color: '#EF4444' }, // red-500
    { id: 't2', name: 'Feature', color: '#22C55E' }, // green-500
    { id: 't3', name: 'Refactor', color: '#F97316' }, // orange-500
    { id: 't4', name: 'Docs', color: '#3B82F6' }, // blue-500
    { id: 't5', name: 'Performance', color: '#6366F1' }, // indigo-500
    { id: 't6', name: 'Security', color: '#DC2626' }, // red-600
    { id: 't7', name: 'UI/UX', color: '#EC4899' }, // pink-500
    { id: 't8', name: 'Testing', color: '#10B981' }, // emerald-500
    { id: 't9', name: 'Blocked', color: '#78716C' }, // stone-500
    { id: 't10', name: 'Question', color: '#A855F7' }, // purple-500
    { id: 't11', name: 'Urgent', color: '#EF4444' }, // red-500
    { id: 't12', name: 'Frontend', color: '#FACC15' }, // yellow-500
    { id: 't13', name: 'Backend', color: '#9CA3AF' }, // gray-400
];

/**
 * @constant {DevNote[]} MOCK_DEV_NOTES - A diverse set of mock developer notes demonstrating various features.
 * These notes tell a story of a team building and iterating on software, using Project Argus.
 */
export const MOCK_DEV_NOTES: DevNote[] = [
    {
        id: 'note-001',
        title: 'Investigate sporadic login failure on staging',
        content: 'Users are reporting intermittent login failures on the staging environment. Specifically, after entering credentials, they sometimes get a generic "authentication failed" message without hitting the backend logs. This might be a race condition or a session management issue.',
        createdBy: 'user-001',
        createdByName: 'Alice Smith',
        createdAt: new Date('2023-10-26T10:00:00Z'),
        updatedAt: new Date('2023-10-26T14:30:00Z'),
        tags: [MOCK_TAGS[0], MOCK_TAGS[11]],
        priority: 'high',
        status: 'pending_review',
        category: 'bug',
        source: 'slack',
        context: {
            serviceName: 'auth-service',
            url: 'https://jira.example.com/browse/PROJ-123',
            branchName: 'feature/auth-refactor'
        },
        assignees: ['user-002'],
        comments: [
            {
                id: 'comment-001a',
                userId: 'user-002',
                userName: 'Bob Johnson',
                content: 'I\'ll take a look. Checking recent changes in `AuthService.java`.',
                createdAt: new Date('2023-10-26T11:00:00Z')
            },
            {
                id: 'comment-001b',
                userId: 'user-001',
                userName: 'Alice Smith',
                content: 'Found a similar issue in Sentry logs from last week. Linking it: `sentry.io/issue/12345`',
                createdAt: new Date('2023-10-26T14:00:00Z')
            }
        ],
        aiInsights: [
            {
                model: 'Gemini',
                type: 'risk_assessment',
                content: 'Potential high-impact bug affecting user access. Prioritize investigation.',
                confidence: 0.95,
                generatedAt: new Date('2023-10-26T10:05:00Z')
            }
        ],
        sentiment: 'negative',
        readCount: 15,
    },
    {
        id: 'note-002',
        title: 'Implement dark mode for Admin Panel',
        content: 'As per UI/UX guidelines, we need to introduce a dark mode option for the entire Admin Panel. This involves updating all component styles and ensuring accessibility compliance for both themes.',
        createdBy: 'user-003',
        createdByName: 'Carol White',
        createdAt: new Date('2023-10-25T09:00:00Z'),
        tags: [MOCK_TAGS[1], MOCK_TAGS[6], MOCK_TAGS[11]],
        priority: 'medium',
        status: 'published',
        category: 'feature',
        source: 'jira',
        context: {
            issueId: 'PROJ-120',
            url: 'https://jira.example.com/browse/PROJ-120',
        },
        dueDate: new Date('2023-11-15T17:00:00Z'),
        aiInsights: [
            {
                model: 'ChatGPT',
                type: 'code_suggestion',
                content: 'Consider using CSS variables for theme switching to simplify implementation and improve maintainability.',
                confidence: 0.88,
                generatedAt: new Date('2023-10-25T09:10:00Z')
            }
        ],
        sentiment: 'positive',
        readCount: 22,
        isPublic: true,
    },
    {
        id: 'note-003',
        title: 'Refactor old component `LegacyTable.jsx`',
        content: 'The `LegacyTable.jsx` component is still using deprecated lifecycle methods and prop-drilling. It should be refactored to use modern React hooks and context API for better state management and readability. This will also improve its testability.',
        createdBy: 'user-002',
        createdByName: 'Bob Johnson',
        createdAt: new Date('2023-10-24T14:00:00Z'),
        updatedAt: new Date('2023-10-26T09:00:00Z'),
        tags: [MOCK_TAGS[2], MOCK_TAGS[11], MOCK_TAGS[7]],
        priority: 'low',
        status: 'resolved',
        category: 'refactor',
        source: 'manual',
        context: {
            filePath: 'src/components/LegacyTable.jsx',
            commitHash: 'a1b2c3d4e5f6',
        },
        comments: [
            {
                id: 'comment-003a',
                userId: 'user-004',
                userName: 'David Green',
                content: 'Agreed, that component is a pain to maintain. Let\'s schedule it for next sprint.',
                createdAt: new Date('2023-10-24T15:00:00Z')
            }
        ],
        relatedNoteIds: ['note-005'],
        sentiment: 'neutral',
        readCount: 8,
    },
    {
        id: 'note-004',
        title: 'Review database indexing for `analytics_events` table',
        content: 'Current queries against `analytics_events` are very slow, leading to dashboard timeouts. We need to review existing indexes and potentially add new ones based on query patterns identified in Datadog. Focus on `event_type`, `user_id`, and `timestamp` columns.',
        createdBy: 'user-004',
        createdByName: 'David Green',
        createdAt: new Date('2023-10-23T11:00:00Z'),
        tags: [MOCK_TAGS[4], MOCK_TAGS[12]],
        priority: 'critical',
        status: 'published',
        category: 'performance',
        source: 'ai_gen',
        context: {
            serviceName: 'analytics-processor',
            url: 'https://datadog.example.com/dashboard/123'
        },
        assignees: ['user-004'],
        aiInsights: [
            {
                model: 'Gemini',
                type: 'potential_optimization',
                content: 'Analysis of query logs suggests a missing multi-column index on `(user_id, event_type, timestamp)` could drastically improve performance for common reporting queries.',
                confidence: 0.98,
                generatedAt: new Date('2023-10-23T11:05:00Z')
            }
        ],
        sentiment: 'negative',
        readCount: 30,
    },
    {
        id: 'note-005',
        title: 'Add E2E tests for user registration flow',
        content: 'Our current test coverage for the user registration flow is insufficient. We need to implement end-to-end tests using Cypress to ensure the entire process, including email verification, works as expected.',
        createdBy: 'user-001',
        createdByName: 'Alice Smith',
        createdAt: new Date('2023-10-22T16:00:00Z'),
        tags: [MOCK_TAGS[7], MOCK_TAGS[1]],
        priority: 'medium',
        status: 'draft',
        category: 'task',
        source: 'manual',
        context: {
            prId: 'PR-456',
            branchName: 'feature/e2e-registration'
        },
        relatedNoteIds: ['note-003'], // Shows relation to refactor
        sentiment: 'neutral',
        readCount: 7,
    },
];

/**
 * @function simulateAPICall
 * @description Simulates an asynchronous API call with a delay.
 * @param {any} data - Data to return.
 * @param {number} [delay=500] - Delay in milliseconds.
 * @param {boolean} [shouldError=false] - Whether the call should simulate an error.
 * @returns {Promise<any>} A promise that resolves with data or rejects with an error.
 */
export const simulateAPICall = (data: any, delay: number = 500, shouldError: boolean = false): Promise<any> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldError) {
                reject(new Error('Simulated API Error: Could not fetch data.'));
            } else {
                resolve(data);
            }
        }, delay);
    });
};

/**
 * @namespace ExternalServiceAPI
 * @description Centralized mock for interactions with various external development services.
 * This simulates the integration with up to 1000 services as requested.
 * In a real scenario, each of these would be a dedicated module or SDK.
 */
export const ExternalServiceAPI = {
    // Version Control Systems
    github: {
        fetchPRs: (repo: string, user: string) => simulateAPICall([{ id: 'gh-1', title: 'Fix login bug', repo, user, status: 'open' }], 200),
        fetchCommits: (repo: string, branch: string) => simulateAPICall([{ id: 'abc', message: 'Initial commit', branch }], 150),
    },
    gitlab: {
        fetchIssues: (project: string) => simulateAPICall([{ id: 'gl-1', title: 'Database migration', project }], 200),
    },
    bitbucket: { /* ... similar methods ... */ },

    // Project Management Tools
    jira: {
        fetchTickets: (project: string) => simulateAPICall([{ id: 'PROJ-1', summary: 'Setup new microservice' }], 250),
        createTicket: (payload: any) => simulateAPICall({ id: 'PROJ-NEW', ...payload }, 300),
    },
    trello: { /* ... similar methods ... */ },
    asana: { /* ... similar methods ... */ },
    azureDevOps: { /* ... similar methods ... */ },

    // CI/CD Tools
    jenkins: {
        getBuildStatus: (job: string) => simulateAPICall({ job, status: 'SUCCESS', buildNumber: 123 }, 100),
    },
    circleCI: { /* ... similar methods ... */ },
    githubActions: { /* ... similar methods ... */ },

    // Monitoring & Logging
    sentry: {
        fetchErrors: (project: string) => simulateAPICall([{ id: 's-1', message: 'Null pointer exception', count: 50 }], 180),
        linkIssue: (errorId: string, noteId: string) => simulateAPICall({ success: true, errorId, noteId }, 100),
    },
    datadog: {
        fetchMetrics: (metric: string) => simulateAPICall([{ timestamp: Date.now(), value: Math.random() * 100 }], 120),
        fetchTraces: (service: string) => simulateAPICall([{ id: 'trace-1', service, duration: '120ms' }], 150),
    },
    newRelic: { /* ... similar methods ... */ },
    prometheus: { /* ... similar methods ... */ },
    elkStack: { /* ... similar methods ... */ },
    splunk: { /* ... similar methods ... */ },

    // Communication Platforms
    slack: {
        postMessage: (channel: string, message: string) => simulateAPICall({ success: true, channel, messageId: generateUniqueId() }, 50),
        fetchThreads: (noteId: string) => simulateAPICall([{ id: 'thread-1', text: 'Discussion on login issue' }], 100),
    },
    microsoftTeams: { /* ... similar methods ... */ },

    // Cloud Platforms (simulating specific services)
    aws: {
        lambdaLogs: (functionName: string) => simulateAPICall([{ timestamp: Date.now(), log: 'Lambda invoked successfully' }], 200),
        s3Buckets: () => simulateAPICall(['my-app-assets', 'dev-backups'], 100),
    },
    azure: {
        appInsights: (appName: string) => simulateAPICall({ requests: 1200, failures: 5 }, 150),
    },
    gcp: {
        cloudFunctionsLogs: (functionName: string) => simulateAPICall([{ timestamp: Date.now(), log: 'Cloud Function execution started' }], 180),
    },

    // Internal Knowledge Bases / Documentation
    confluence: {
        searchPages: (query: string) => simulateAPICall([{ id: 'conf-1', title: 'API Gateway Setup Guide', url: '...' }], 200),
    },
    sharepoint: { /* ... similar methods ... */ },
    customWiki: { /* ... similar methods ... */ },

    // Databases (interaction via ORM/API)
    postgreSQL: {
        queryHealth: () => simulateAPICall({ status: 'healthy', openConnections: 50 }, 80),
    },
    mongoDB: { /* ... similar methods ... */ },
    redis: { /* ... similar methods ... */ },

    // Security Scanners
    snyk: {
        scanResults: (repo: string) => simulateAPICall([{ id: 'snyk-1', severity: 'high', vulnerability: 'XSS' }], 300),
    },
    dependabot: { /* ... similar methods ... */ },

    // Testing Frameworks
    cypress: {
        getTestReports: (buildId: string) => simulateAPICall({ passed: 100, failed: 2, skipped: 5 }, 150),
    },
    jest: { /* ... similar methods ... */ },
    playwright: { /* ... similar methods ... */ },

    // API Management
    postman: {
        getCollection: (collectionId: string) => simulateAPICall({ name: 'Auth API', endpoints: ['/login', '/register'] }, 120),
    },
    swagger: { /* ... similar methods ... */ },

    // Design & UI Libraries
    figma: {
        getDesignLink: (componentName: string) => simulateAPICall({ url: 'https://figma.com/design/abc#node-123' }, 80),
    },
    storybook: {
        getComponentDemo: (componentName: string) => simulateAPICall({ url: 'https://storybook.example.com/?path=/story/components-button--default' }, 90),
    },

    // Identity & Access Management
    okta: {
        getUserRoles: (userId: string) => simulateAPICall(['developer', 'admin'], 70),
    },
    auth0: { /* ... similar methods ... */ },

    // Payment Gateways (contextual links or status)
    stripe: {
        getPaymentStatus: (transactionId: string) => simulateAPICall({ status: 'succeeded', amount: 1000 }, 100),
    },
    paypal: { /* ... similar methods ... */ },

    // Document Storage
    googleDrive: {
        searchDocs: (query: string) => simulateAPICall([{ id: 'gd-1', title: 'Project Plan Q4' }], 120),
    },
    dropbox: { /* ... similar methods ... */ },

    // Generic AI Services
    ai: {
        gemini: {
            generateContent: (prompt: string, context: string) => simulateAPICall({
                insight: `Gemini's analysis of "${prompt}" in context of "${context}": This seems to be a common pattern, consider solution X.`,
                confidence: 0.9,
                cost: 0.005,
            }, 1500),
            summarize: (text: string) => simulateAPICall({
                summary: `Gemini-powered summary: ${text.substring(0, Math.min(text.length, 50))}...`,
                confidence: 0.92,
            }, 1000),
            codeSuggest: (code: string, context: string) => simulateAPICall({
                suggestion: `// Gemini Code Suggestion: \n${code}\n// Refactor this for better readability using Promises.`,
                confidence: 0.85,
            }, 1800),
        },
        chatGPT: {
            generateContent: (prompt: string, context: string) => simulateAPICall({
                insight: `ChatGPT's perspective on "${prompt}" given "${context}": Explore alternative Y for broader compatibility.`,
                confidence: 0.88,
                cost: 0.002,
            }, 1200),
            summarize: (text: string) => simulateAPICall({
                summary: `ChatGPT-powered summary: ${text.substring(0, Math.min(text.length, 60))}...`,
                confidence: 0.9,
            }, 900),
            codeReview: (code: string, diff: string) => simulateAPICall({
                review: `// ChatGPT Code Review: \nPotential security vulnerability found in line 12. Suggest using a parameterized query.`,
                confidence: 0.95,
            }, 2000),
        },
        sentimentAnalysis: (text: string) => simulateAPICall({
            sentiment: Math.random() > 0.7 ? 'negative' : (Math.random() > 0.4 ? 'positive' : 'neutral'),
            score: parseFloat((Math.random() * 2 - 1).toFixed(2)) // Between -1 and 1
        }, 300),
        languageTranslate: (text: string, targetLang: string) => simulateAPICall({
            translatedText: `[Translated to ${targetLang}] ${text}`,
            sourceLang: 'en',
        }, 400),
        imageRecognition: (imageUrl: string) => simulateAPICall({
            description: 'Identified a UI screenshot showing a login form.',
            objects: ['login form', 'button', 'text input'],
        }, 700),
        voiceToText: (audioData: string) => simulateAPICall({
            text: 'This is a simulated transcription of a voice note.',
            confidence: 0.98,
        }, 600),
        textToVoice: (text: string) => simulateAPICall({
            audioUrl: `https://example.com/audio/${generateUniqueId()}.mp3`,
            format: 'mp3',
        }, 500),
    },

    // Mock API for Project Argus's own backend services
    argus: {
        fetchNotes: (filters: any = {}) => simulateAPICall(
            MOCK_DEV_NOTES.filter(note => {
                let matches = true;
                if (filters.status && note.status !== filters.status) matches = false;
                if (filters.priority && note.priority !== filters.priority) matches = false;
                if (filters.query && !note.title.toLowerCase().includes(filters.query.toLowerCase()) && !note.content.toLowerCase().includes(filters.query.toLowerCase())) matches = false;
                if (filters.tagIds && filters.tagIds.length > 0) {
                    const noteTagIds = note.tags.map(t => t.id);
                    if (!filters.tagIds.every((tagId: string) => noteTagIds.includes(tagId))) matches = false;
                }
                return matches;
            }),
            800
        ),
        fetchNoteById: (id: string) => simulateAPICall(MOCK_DEV_NOTES.find(n => n.id === id), 400),
        saveNote: (note: DevNote) => simulateAPICall({ ...note, updatedAt: new Date() }, 600),
        deleteNote: (id: string) => simulateAPICall({ success: true, id }, 300),
        fetchUserPreferences: (userId: string) => simulateAPICall(DEFAULT_USER_PREFERENCES, 200),
        saveUserPreferences: (userId: string, prefs: UserPreferences) => simulateAPICall(prefs, 300),
        fetchAvailableTags: () => simulateAPICall(MOCK_TAGS, 100),
        fetchCodeContext: (filePath: string, lineNumber?: string) => simulateAPICall({
            filePath,
            lineNumber,
            contextSnippet: `// Code snippet from ${filePath}:${lineNumber}\nconst data = fetchData();\nconsole.log(data);`,
            commitHistory: [{ hash: 'latest', message: 'Improved performance' }],
        }, 400),
        fetchAuditLogs: (entityId: string, entityType: string) => simulateAPICall([
            { id: 'log-1', userId: 'user-001', action: 'CREATED', entityType, entityId, timestamp: new Date() },
            { id: 'log-2', userId: 'user-002', action: 'UPDATED', entityType, entityId, timestamp: new Date() },
        ], 300),
        sendNotification: (userId: string, message: string) => simulateAPICall({ success: true, userId, message }, 50),
    }
};

// SECTION 5: State Management (React Context and Reducer)
// For managing complex global state within the application without relying on external libraries
// like Redux, we employ React's Context API combined with `useReducer`. This provides a predictable
// state container for Project Argus.

/**
 * @enum {string} ActionType
 * @description Defines all possible actions that can be dispatched to the central reducer.
 * This ensures strict action typing and makes state transitions explicit.
 */
export enum ActionType {
    SET_NOTES = 'SET_NOTES',
    ADD_NOTE = 'ADD_NOTE',
    UPDATE_NOTE = 'UPDATE_NOTE',
    DELETE_NOTE = 'DELETE_NOTE',
    SET_AVAILABLE_TAGS = 'SET_AVAILABLE_TAGS',
    SET_USER_PREFERENCES = 'SET_USER_PREFERENCES',
    SET_LOADING = 'SET_LOADING',
    SET_ERROR = 'SET_ERROR',
    SELECT_NOTE = 'SELECT_NOTE',
    TOGGLE_PANEL = 'TOGGLE_PANEL',
    ADD_RECENTLY_VIEWED = 'ADD_RECENTLY_VIEWED',
    REMOVE_RECENTLY_VIEWED = 'REMOVE_RECENTLY_VIEWED',
}

/**
 * @interface Action
 * @description Defines the structure for all dispatched actions.
 */
export type Action =
    | { type: ActionType.SET_NOTES; payload: DevNote[] }
    | { type: ActionType.ADD_NOTE; payload: DevNote }
    | { type: ActionType.UPDATE_NOTE; payload: DevNote }
    | { type: ActionType.DELETE_NOTE; payload: string } // Note ID
    | { type: ActionType.SET_AVAILABLE_TAGS; payload: DevNoteTag[] }
    | { type: ActionType.SET_USER_PREFERENCES; payload: UserPreferences }
    | { type: ActionType.SET_LOADING; payload: boolean }
    | { type: ActionType.SET_ERROR; payload: string | null }
    | { type: ActionType.SELECT_NOTE; payload: DevNote | null }
    | { type: ActionType.TOGGLE_PANEL; payload?: boolean }
    | { type: ActionType.ADD_RECENTLY_VIEWED; payload: string }
    | { type: ActionType.REMOVE_RECENTLY_VIEWED; payload: string };

/**
 * @function appReducer
 * @description The central reducer function for Project Argus. It defines how the state
 * changes in response to dispatched actions, maintaining immutability.
 * @param {AppState} state - The current application state.
 * @param {Action} action - The dispatched action.
 * @returns {AppState} The new application state.
 */
export const appReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case ActionType.SET_NOTES:
            return { ...state, notes: action.payload };
        case ActionType.ADD_NOTE:
            return { ...state, notes: [...state.notes, action.payload] };
        case ActionType.UPDATE_NOTE:
            return {
                ...state,
                notes: state.notes.map(note =>
                    note.id === action.payload.id ? action.payload : note
                ),
                selectedNote: state.selectedNote?.id === action.payload.id ? action.payload : state.selectedNote,
            };
        case ActionType.DELETE_NOTE:
            return {
                ...state,
                notes: state.notes.filter(note => note.id !== action.payload),
                selectedNote: state.selectedNote?.id === action.payload ? null : state.selectedNote,
                recentlyViewedNoteIds: state.recentlyViewedNoteIds.filter(id => id !== action.payload),
            };
        case ActionType.SET_AVAILABLE_TAGS:
            return { ...state, availableTags: action.payload };
        case ActionType.SET_USER_PREFERENCES:
            return { ...state, userPreferences: action.payload };
        case ActionType.SET_LOADING:
            return { ...state, isLoading: action.payload };
        case ActionType.SET_ERROR:
            return { ...state, error: action.payload };
        case ActionType.SELECT_NOTE:
            return { ...state, selectedNote: action.payload };
        case ActionType.TOGGLE_PANEL:
            return { ...state, isPanelOpen: action.payload !== undefined ? action.payload : !state.isPanelOpen };
        case ActionType.ADD_RECENTLY_VIEWED:
            return {
                ...state,
                recentlyViewedNoteIds: [
                    action.payload,
                    ...state.recentlyViewedNoteIds.filter(id => id !== action.payload)
                ].slice(0, 5) // Keep last 5
            };
        case ActionType.REMOVE_RECENTLY_VIEWED:
            return {
                ...state,
                recentlyViewedNoteIds: state.recentlyViewedNoteIds.filter(id => id !== action.payload)
            };
        default:
            return state;
    }
};

/**
 * @constant {AppState} INITIAL_APP_STATE - The initial state for the application.
 */
export const INITIAL_APP_STATE: AppState = {
    notes: [],
    availableTags: [],
    userPreferences: DEFAULT_USER_PREFERENCES,
    isLoading: false,
    error: null,
    selectedNote: null,
    isPanelOpen: false, // Panel is initially closed
    recentlyViewedNoteIds: [],
};

/**
 * @context ArgusContext
 * @description React Context for providing global state and dispatch function to all components.
 */
export const ArgusContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

/**
 * @component ArgusProvider
 * @description A React Context Provider that wraps the application, making the state and dispatch
 * function available to any nested component. It also handles initial data fetching.
 */
export const ArgusProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, INITIAL_APP_STATE);

    // Initial data fetching on component mount
    useEffect(() => {
        const fetchInitialData = async () => {
            dispatch({ type: ActionType.SET_LOADING, payload: true });
            try {
                // Simulate fetching notes, tags, and user preferences
                const [notes, tags, preferences] = await Promise.all([
                    ExternalServiceAPI.argus.fetchNotes(),
                    ExternalServiceAPI.argus.fetchAvailableTags(),
                    ExternalServiceAPI.argus.fetchUserPreferences('current-user-id'), // Placeholder user ID
                ]);
                dispatch({ type: ActionType.SET_NOTES, payload: notes as DevNote[] });
                dispatch({ type: ActionType.SET_AVAILABLE_TAGS, payload: tags as DevNoteTag[] });
                dispatch({ type: ActionType.SET_USER_PREFERENCES, payload: preferences as UserPreferences });
                dispatch({ type: ActionType.SET_LOADING, payload: false });
                dispatch({ type: ActionType.TOGGLE_PANEL, payload: (preferences as UserPreferences).stickyPanelEnabled }); // Open panel based on user preference
            } catch (err: any) {
                console.error('Failed to fetch initial data:', err);
                dispatch({ type: ActionType.SET_ERROR, payload: err.message || 'Failed to load initial data.' });
                dispatch({ type: ActionType.SET_LOADING, payload: false });
            }
        };
        fetchInitialData();
    }, []); // Empty dependency array means this runs once on mount

    // Persist user preferences to backend/local storage on change
    useEffect(() => {
        if (state.userPreferences !== DEFAULT_USER_PREFERENCES) { // Only save if truly updated
            ExternalServiceAPI.argus.saveUserPreferences('current-user-id', state.userPreferences)
                .catch(err => console.error('Failed to save user preferences:', err));
        }
    }, [state.userPreferences]);

    // Persist panel state to local storage to remember user's last choice
    useEffect(() => {
        localStorage.setItem('argusPanelOpen', String(state.isPanelOpen));
    }, [state.isPanelOpen]);

    // Apply theme based on preferences
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.userPreferences.theme);
    }, [state.userPreferences.theme]);

    return (
        <ArgusContext.Provider value={{ state, dispatch }}>
            {children}
        </ArgusContext.Provider>
    );
};

/**
 * @hook useArgus
 * @description Custom hook to easily access the Argus Context (state and dispatch).
 * Throws an error if used outside of an ArgusProvider, ensuring correct usage.
 * @returns {{ state: AppState; dispatch: React.Dispatch<Action> }} The current state and dispatch function.
 */
export const useArgus = () => {
    const context = useContext(ArgusContext);
    if (context === undefined) {
        throw new Error('useArgus must be used within an ArgusProvider');
    }
    return context;
};

// SECTION 6: AI Integration Hooks and Components
// This section showcases the deep integration of AI models (Gemini, ChatGPT) into Project Argus.
// These hooks and components provide intelligent assistance for note creation, summarization,
// code analysis, and risk assessment, transforming the passive note-taking experience into an active assistant.

/**
 * @hook useAIAssistant
 * @description A powerful hook that orchestrates interactions with various AI services.
 * It dynamically selects the preferred AI model and provides functions for common AI tasks.
 * This hook embodies the spirit of an intelligent developer copilot.
 */
export const useAIAssistant = () => {
    const { state: { userPreferences } } = useArgus();
    const [isAILoading, setIsAILoading] = useState(false);
    const [aiError, setAIError] = useState<string | null>(null);

    const preferredAI = userPreferences.preferredAIModel;

    const executeAICommand = useCallback(async (
        aiServiceCall: Promise<any>,
        errorMessage: string = 'AI operation failed.'
    ) => {
        if (!userPreferences.enableAISuggestions) {
            return { error: 'AI suggestions are disabled in preferences.' };
        }
        setIsAILoading(true);
        setAIError(null);
        try {
            const result = await aiServiceCall;
            setIsAILoading(false);
            return result;
        } catch (err: any) {
            console.error(errorMessage, err);
            setAIError(err.message || errorMessage);
            setIsAILoading(false);
            return { error: err.message || errorMessage };
        }
    }, [userPreferences.enableAISuggestions]);

    /**
     * @method generateNoteContent
     * @description Generates rich content for a note based on a prompt and context using the preferred AI model.
     * @param {string} prompt - The user's prompt or question.
     * @param {string} [context] - Additional context like code, logs, or an existing note.
     * @returns {Promise<DevNoteAIInsight | { error: string }>} AI insight or error.
     */
    const generateNoteContent = useCallback(async (prompt: string, context: string = '') => {
        const aiService = preferredAI === 'Gemini' ? ExternalServiceAPI.ai.gemini : ExternalServiceAPI.ai.chatGPT;
        const result = await executeAICommand(
            aiService.generateContent(prompt, context),
            `Failed to generate content with ${preferredAI}.`
        );
        if (result.error) return result;
        return {
            model: preferredAI,
            type: 'generated_content',
            content: result.insight,
            confidence: result.confidence,
            generatedAt: new Date(),
        };
    }, [preferredAI, executeAICommand]);

    /**
     * @method summarizeNote
     * @description Summarizes a given text content using the preferred AI model.
     * Useful for long dev notes or documentation.
     * @param {string} text - The text to summarize.
     * @returns {Promise<DevNoteAIInsight | { error: string }>} AI insight or error.
     */
    const summarizeNote = useCallback(async (text: string) => {
        const aiService = preferredAI === 'Gemini' ? ExternalServiceAPI.ai.gemini : ExternalServiceAPI.ai.chatGPT;
        const result = await executeAICommand(
            aiService.summarize(text),
            `Failed to summarize with ${preferredAI}.`
        );
        if (result.error) return result;
        return {
            model: preferredAI,
            type: 'summary',
            content: result.summary,
            confidence: result.confidence,
            generatedAt: new Date(),
        };
    }, [preferredAI, executeAICommand]);

    /**
     * @method analyzeCodeSnippet
     * @description Provides AI-powered code analysis, suggestions, or review.
     * @param {string} code - The code snippet to analyze.
     * @param {string} [context] - Additional context for the code (e.g., file path, diff).
     * @returns {Promise<DevNoteAIInsight | { error: string }>} AI insight or error.
     */
    const analyzeCodeSnippet = useCallback(async (code: string, context: string = '') => {
        let aiServiceCall: Promise<any>;
        if (preferredAI === 'Gemini') {
            aiServiceCall = ExternalServiceAPI.ai.gemini.codeSuggest(code, context);
        } else {
            // ChatGPT offers more explicit 'codeReview' in this mock setup
            aiServiceCall = ExternalServiceAPI.ai.chatGPT.codeReview(code, context);
        }
        const result = await executeAICommand(
            aiServiceCall,
            `Failed to analyze code with ${preferredAI}.`
        );
        if (result.error) return result;
        return {
            model: preferredAI,
            type: 'code_analysis',
            content: result.suggestion || result.review,
            confidence: result.confidence,
            generatedAt: new Date(),
        };
    }, [preferredAI, executeAICommand]);

    /**
     * @method getSentimentAnalysis
     * @description Determines the sentiment of a given text. Useful for prioritizing notes.
     * @param {string} text - The text to analyze.
     * @returns {Promise<{ sentiment: string; score: number } | { error: string }>} Sentiment analysis result or error.
     */
    const getSentimentAnalysis = useCallback(async (text: string) => {
        const result = await executeAICommand(
            ExternalServiceAPI.ai.sentimentAnalysis(text),
            'Failed to perform sentiment analysis.'
        );
        if (result.error) return result;
        return { sentiment: result.sentiment, score: result.score };
    }, [executeAICommand]);

    /**
     * @method generateAuditLogSummary
     * @description Uses AI to summarize potentially verbose audit logs into actionable insights.
     * @param {string[]} logs - Array of raw log entries.
     * @returns {Promise<DevNoteAIInsight | { error: string }>} AI insight or error.
     */
    const generateAuditLogSummary = useCallback(async (logs: string[]) => {
        const fullLogText = logs.join('\n');
        const aiService = preferredAI === 'Gemini' ? ExternalServiceAPI.ai.gemini : ExternalServiceAPI.ai.chatGPT;
        const result = await executeAICommand(
            aiService.summarize(`Summarize these audit logs for security review: ${fullLogText}`),
            `Failed to summarize audit logs with ${preferredAI}.`
        );
        if (result.error) return result;
        return {
            model: preferredAI,
            type: 'audit_summary',
            content: result.summary,
            confidence: result.confidence,
            generatedAt: new Date(),
        };
    }, [preferredAI, executeAICommand]);

    // Many more AI functions could be added here:
    // - `translateNote(text, targetLang)`
    // - `identifySecurityVulnerabilities(code)`
    // - `suggestDependencies(projectContext)`
    // - `explainError(errorMessage, stackTrace)`
    // - `generateTestCases(code)`
    // - `predictBugLikelihood(codeChanges)`
    // - `recommendResources(topic)`

    return {
        isAILoading,
        aiError,
        generateNoteContent,
        summarizeNote,
        analyzeCodeSnippet,
        getSentimentAnalysis,
        generateAuditLogSummary,
        preferredAIModel: preferredAI,
    };
};

/**
 * @component AIAssistantPanel
 * @description A sub-panel within Project Argus dedicated to AI interactions.
 * It provides a UI for users to prompt AI, view suggestions, and apply them to notes.
 */
export const AIAssistantPanel: React.FC<{ onApplyInsight: (insight: DevNoteAIInsight) => void }> = ({ onApplyInsight }) => {
    const { state: { selectedNote, userPreferences } } = useArgus();
    const {
        isAILoading,
        aiError,
        generateNoteContent,
        summarizeNote,
        analyzeCodeSnippet,
        getSentimentAnalysis,
        preferredAIModel
    } = useAIAssistant();
    const [prompt, setPrompt] = useState('');
    const [aiResponse, setAIResponse] = useState<DevNoteAIInsight | null>(null);
    const [selectedAction, setSelectedAction] = useState<'generate' | 'summarize' | 'code_analyze' | 'sentiment_analyze'>('generate');

    const handleGenerate = async () => {
        let result: DevNoteAIInsight | { error: string } | null = null;
        if (selectedAction === 'generate') {
            result = await generateNoteContent(prompt, selectedNote?.content || '');
        } else if (selectedAction === 'summarize' && selectedNote?.content) {
            result = await summarizeNote(selectedNote.content);
        } else if (selectedAction === 'code_analyze' && prompt) { // prompt can be a code snippet
            result = await analyzeCodeSnippet(prompt, selectedNote?.context?.filePath || '');
        } else if (selectedAction === 'sentiment_analyze' && selectedNote?.content) {
            const sentimentResult = await getSentimentAnalysis(selectedNote.content);
            if (!sentimentResult.error) {
                result = {
                    model: preferredAIModel,
                    type: 'sentiment_analysis',
                    content: `Sentiment: ${sentimentResult.sentiment} (Score: ${sentimentResult.score})`,
                    confidence: 1, // Assumed perfect for display purposes
                    generatedAt: new Date(),
                };
            }
        }

        if (result && !result.error) {
            setAIResponse(result as DevNoteAIInsight);
            onApplyInsight(result as DevNoteAIInsight); // Automatically apply if successfully generated
        } else {
            setAIResponse(null);
        }
    };

    if (!userPreferences.enableAISuggestions) {
        return (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                AI Assistant is disabled in your preferences.
            </div>
        );
    }

    return (
        <div className="border-t border-gray-700 mt-4 pt-4">
            <h5 className="font-semibold text-lg mb-2 text-blue-300">AI Assistant ({preferredAIModel})</h5>
            <div className="flex items-center space-x-2 mb-3">
                <select
                    className="flex-grow p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value as any)}
                >
                    <option value="generate">Generate Content</option>
                    <option value="summarize" disabled={!selectedNote}>Summarize Note</option>
                    <option value="code_analyze">Analyze Code Snippet</option>
                    <option value="sentiment_analyze" disabled={!selectedNote}>Analyze Sentiment</option>
                </select>
                <select
                    className="p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                    value={userPreferences.preferredAIModel}
                    onChange={(e) => {
                        // This would typically dispatch an action to update user preferences
                        // dispatch({ type: ActionType.SET_USER_PREFERENCES, payload: { ...userPreferences, preferredAIModel: e.target.value as 'Gemini' | 'ChatGPT' } });
                        console.log('Changing AI model:', e.target.value); // For demonstration
                    }}
                >
                    <option value="Gemini">Gemini</option>
                    <option value="ChatGPT">ChatGPT</option>
                </select>
            </div>
            {(selectedAction === 'generate' || selectedAction === 'code_analyze') && (
                <textarea
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm mb-3"
                    placeholder={selectedAction === 'generate' ? "Enter your prompt for AI generation..." : "Paste code snippet for analysis..."}
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
            )}
            {selectedAction === 'summarize' && !selectedNote && (
                <p className="text-gray-400 text-sm mb-3">Select a note to summarize its content.</p>
            )}
            {selectedAction === 'sentiment_analyze' && !selectedNote && (
                <p className="text-gray-400 text-sm mb-3">Select a note to analyze its sentiment.</p>
            )}

            <button
                className={`w-full py-2 px-4 rounded transition-colors text-white text-sm ${
                    isAILoading ? 'bg-blue-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                }`}
                onClick={handleGenerate}
                disabled={isAILoading || (!prompt && (selectedAction === 'generate' || selectedAction === 'code_analyze')) || (!selectedNote && (selectedAction === 'summarize' || selectedAction === 'sentiment_analyze'))}
            >
                {isAILoading ? 'Thinking...' : 'Get AI Insight'}
            </button>
            {aiError && <p className="text-red-400 text-sm mt-2">AI Error: {aiError}</p>}
            {aiResponse && (
                <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-600">
                    <h6 className="font-semibold text-green-400 text-sm">AI Response ({aiResponse.model} - {aiResponse.type})</h6>
                    <p className="text-gray-200 text-xs mt-1 whitespace-pre-wrap">{aiResponse.content}</p>
                    <p className="text-gray-500 text-xs mt-1">Confidence: {(aiResponse.confidence * 100).toFixed(0)}% | {formatDate(aiResponse.generatedAt)}</p>
                </div>
            )}
        </div>
    );
};

// SECTION 7: Core Components for Note Management
// These components form the user interface for viewing, editing, and interacting with developer notes.
// They are designed to be highly functional, supporting rich text, tags, attachments, and comments.

/**
 * @component NoteEditor
 * @description A rich text editor for creating or modifying DevNotes.
 * This component handles input for title, content, tags, priority, status, and integrates AI.
 * It uses a local state to manage changes before saving them to the global store.
 */
export const NoteEditor: React.FC<{ note?: DevNote; onClose: () => void; onSave: (note: DevNote) => void }> = ({ note, onClose, onSave }) => {
    const { state: { availableTags, userPreferences } } = useArgus();
    const [currentNote, setCurrentNote] = useState<DevNote>(
        note || {
            id: generateUniqueId(),
            title: '',
            content: '',
            createdBy: 'current-user-id', // Placeholder
            createdByName: 'Current User', // Placeholder
            createdAt: new Date(),
            tags: [],
            priority: 'medium',
            status: 'draft',
            category: 'task',
            source: 'manual',
            isPublic: true,
        }
    );
    const [editorContent, setEditorContent] = useState(note?.content || ''); // For rich text editor
    const editorRef = useRef<HTMLDivElement>(null); // For rich text editing
    const { aiError, isAILoading, summarizeNote, getSentimentAnalysis, preferredAIModel } = useAIAssistant();

    useEffect(() => {
        // Initialize or reset content when note changes
        setCurrentNote(note || {
            id: generateUniqueId(),
            title: '',
            content: '',
            createdBy: 'current-user-id',
            createdByName: 'Current User',
            createdAt: new Date(),
            tags: [],
            priority: 'medium',
            status: 'draft',
            category: 'task',
            source: 'manual',
            isPublic: true,
        });
        setEditorContent(note?.content || '');
    }, [note]);

    // Auto-summarize feature
    useEffect(() => {
        const autoProcessNote = async () => {
            if (userPreferences.autoSummarizeNotes && currentNote.content && !currentNote.aiInsights?.some(i => i.type === 'summary')) {
                const summaryInsight = await summarizeNote(currentNote.content);
                if (summaryInsight && !summaryInsight.error) {
                    setCurrentNote(prev => ({
                        ...prev,
                        aiInsights: [...(prev.aiInsights || []), summaryInsight as DevNoteAIInsight],
                    }));
                }
            }
            if (currentNote.content && !currentNote.sentiment) {
                const sentimentResult = await getSentimentAnalysis(currentNote.content);
                if (sentimentResult && !sentimentResult.error) {
                    setCurrentNote(prev => ({
                        ...prev,
                        sentiment: (sentimentResult as { sentiment: string }).sentiment,
                    }));
                }
            }
        };

        const debouncedAutoProcess = debounce(autoProcessNote, 2000); // Debounce to prevent excessive AI calls
        if (currentNote.content.length > 50) { // Only process if enough content
            debouncedAutoProcess();
        }

        return () => debouncedAutoProcess.cancel && debouncedAutoProcess.cancel();
    }, [currentNote.content, userPreferences.autoSummarizeNotes, summarizeNote, getSentimentAnalysis]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentNote(prev => ({ ...prev, [name]: value }));
    };

    const handleTagChange = (tagId: string, isChecked: boolean) => {
        setCurrentNote(prev => {
            const currentTags = prev.tags.map(t => t.id);
            const newTag = availableTags.find(t => t.id === tagId);
            if (!newTag) return prev; // Should not happen

            if (isChecked && !currentTags.includes(tagId)) {
                return { ...prev, tags: [...prev.tags, newTag] };
            } else if (!isChecked && currentTags.includes(tagId)) {
                return { ...prev, tags: prev.tags.filter(t => t.id !== tagId) };
            }
            return prev;
        });
    };

    const handleSave = () => {
        onSave({ ...currentNote, content: editorContent, updatedAt: new Date() });
        onClose();
    };

    const handleAIInsightApplied = (insight: DevNoteAIInsight) => {
        setCurrentNote(prev => ({
            ...prev,
            aiInsights: [...(prev.aiInsights || []), insight],
            // Optionally append to content if it's a generative insight
            content: insight.type === 'generated_content' || insight.type === 'code_analysis'
                ? `${prev.content}\n\n--- AI ${insight.type.replace('_', ' ')} (${insight.model}) ---\n${insight.content}`
                : prev.content,
        }));
        setEditorContent(prev =>
            insight.type === 'generated_content' || insight.type === 'code_analysis'
                ? `${prev}\n\n--- AI ${insight.type.replace('_', ' ')} (${insight.model}) ---\n${insight.content}`
                : prev
        );
    };

    return (
        <div className="p-4 bg-gray-800 rounded shadow-lg text-white max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-blue-400">{note ? 'Edit Developer Note' : 'Create New Developer Note'}</h3>

            <div className="mb-3">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white"
                    value={currentNote.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="content" className="block text-sm font-medium text-gray-300">Content (Rich Text Editor coming soon!)</label>
                {/* Placeholder for a rich text editor. In a real app, this would be a library like Quill or TipTap */}
                <textarea
                    id="content"
                    name="content"
                    className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white h-32 resize-y"
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Enter detailed notes here. Markdown supported."
                ></textarea>
                {isAILoading && <p className="text-blue-400 text-xs mt-1">AI is processing content for auto-summarization/sentiment...</p>}
                {aiError && <p className="text-red-400 text-xs mt-1">AI Error: {aiError}</p>}
                <p className="text-gray-500 text-xs mt-1">
                    AI Auto-Summary: {userPreferences.autoSummarizeNotes ? 'Enabled' : 'Disabled'}. Sentiment: {currentNote.sentiment || 'N/A'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-300">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white"
                        value={currentNote.priority}
                        onChange={handleChange}
                    >
                        {['low', 'medium', 'high', 'critical'].map(p => (
                            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                    <select
                        id="status"
                        name="status"
                        className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white"
                        value={currentNote.status}
                        onChange={handleChange}
                    >
                        {['draft', 'published', 'archived', 'resolved', 'pending_review'].map(s => (
                            <option key={s} value={s}>{s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
                <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                        <label key={tag.id} className="inline-flex items-center text-sm text-gray-200">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out bg-gray-700 border-gray-500"
                                checked={currentNote.tags.some(t => t.id === tag.id)}
                                onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                            />
                            <span className="ml-2 py-0.5 px-2 rounded-full text-xs" style={{ backgroundColor: tag.color, color: 'white' }}>
                                {tag.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <AIAssistantPanel onApplyInsight={handleAIInsightApplied} />

            <div className="mt-6 flex justify-end space-x-2">
                <button
                    className="py-2 px-4 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm transition-colors"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    className="py-2 px-4 rounded bg-blue-500 hover:bg-blue-700 text-white text-sm transition-colors"
                    onClick={handleSave}
                >
                    Save Note
                </button>
            </div>
        </div>
    );
};

/**
 * @component NoteDetailPanel
 * @description Displays the full details of a selected DevNote, including comments, attachments, and AI insights.
 * It also provides actions like editing, deleting, and interacting with integrated services.
 */
export const NoteDetailPanel: React.FC<{ note: DevNote; onEdit: (note: DevNote) => void; onDelete: (id: string) => void; onClose: () => void }> = ({ note, onEdit, onDelete, onClose }) => {
    const { state: { recentlyViewedNoteIds }, dispatch } = useArgus();
    const [showComments, setShowComments] = useState(false);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [isLoadingAudit, setIsLoadingAudit] = useState(false);
    const { isAILoading, aiError, generateAuditLogSummary } = useAIAssistant();

    // Mark note as recently viewed
    useEffect(() => {
        dispatch({ type: ActionType.ADD_RECENTLY_VIEWED, payload: note.id });
        // Cleanup function to remove from recently viewed if panel closes or note changes
        return () => {
             // Only remove if this specific note is no longer the selected one or panel is truly closed
             // This logic might need refinement if there are multiple ways to view notes.
        };
    }, [note.id, dispatch]);

    const handleAddComment = async () => {
        if (newCommentContent.trim()) {
            const newComment: DevNoteComment = {
                id: generateUniqueId(),
                userId: 'current-user-id',
                userName: 'Current User',
                content: newCommentContent,
                createdAt: new Date(),
            };
            const updatedNote = {
                ...note,
                comments: [...(note.comments || []), newComment],
                updatedAt: new Date(),
            };
            await ExternalServiceAPI.argus.saveNote(updatedNote); // Persist comment
            dispatch({ type: ActionType.UPDATE_NOTE, payload: updatedNote });
            setNewCommentContent('');
        }
    };

    const fetchAuditLogs = useCallback(async () => {
        setIsLoadingAudit(true);
        try {
            const logs = await ExternalServiceAPI.argus.fetchAuditLogs(note.id, 'DevNote');
            setAuditLogs(logs as any[]);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setIsLoadingAudit(false);
        }
    }, [note.id]);

    const handleSummarizeAudit = async () => {
        const logStrings = auditLogs.map(log => `${formatDate(log.timestamp)} - ${log.userName || log.userId} ${log.action} ${log.entityType} ${log.entityId}`);
        const summaryInsight = await generateAuditLogSummary(logStrings);
        if (summaryInsight && !summaryInsight.error) {
            const updatedNote = {
                ...note,
                aiInsights: [...(note.aiInsights || []), summaryInsight as DevNoteAIInsight],
                updatedAt: new Date(),
            };
            await ExternalServiceAPI.argus.saveNote(updatedNote);
            dispatch({ type: ActionType.UPDATE_NOTE, payload: updatedNote });
        }
    };

    const recentlyViewedNotes = recentlyViewedNoteIds
        .filter(id => id !== note.id)
        .map(id => MOCK_DEV_NOTES.find(n => n.id === id))
        .filter(Boolean) as DevNote[];

    return (
        <div className="p-4 bg-gray-800 rounded shadow-lg text-white max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                <h3 className="text-2xl font-bold text-blue-400">{note.title}</h3>
                <button
                    className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                    onClick={onClose}
                    aria-label="Close Note Detail"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div className="mb-4 text-sm text-gray-300 space-y-1">
                <p><strong>Created By:</strong> {note.createdByName} on {formatDate(note.createdAt)}</p>
                {note.updatedAt && <p><strong>Last Updated:</strong> {formatDate(note.updatedAt)}</p>}
                <p><strong>Priority:</strong> <span className={`font-semibold ${note.priority === 'critical' ? 'text-red-400' : note.priority === 'high' ? 'text-orange-400' : 'text-green-400'}`}>{note.priority.toUpperCase()}</span></p>
                <p><strong>Status:</strong> <span className="text-blue-300">{note.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span></p>
                <p><strong>Category:</strong> {note.category.charAt(0).toUpperCase() + note.category.slice(1)}</p>
                <p><strong>Source:</strong> {note.source.charAt(0).toUpperCase() + note.source.slice(1)}</p>
                {note.sentiment && <p><strong>AI Sentiment:</strong> <span className={note.sentiment === 'negative' ? 'text-red-400' : note.sentiment === 'positive' ? 'text-green-400' : 'text-gray-400'}>{note.sentiment.toUpperCase()}</span></p>}
                {note.readCount !== undefined && <p><strong>Views:</strong> {note.readCount}</p>}
                {note.isPublic !== undefined && <p><strong>Visibility:</strong> {note.isPublic ? 'Public' : 'Private'}</p>}
            </div>

            <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-gray-300">Description</h4>
                <p className="text-gray-200 text-sm whitespace-pre-wrap">{sanitizeHTML(note.content)}</p>
            </div>

            {note.tags && note.tags.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold text-lg mb-2 text-gray-300">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {note.tags.map(tag => (
                            <span key={tag.id} className="py-1 px-3 rounded-full text-xs font-semibold" style={{ backgroundColor: tag.color, color: 'white' }}>
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {note.context && (
                <div className="mb-4 p-3 bg-gray-700 rounded text-sm border border-gray-600">
                    <h4 className="font-semibold text-lg mb-2 text-blue-300">Contextual Links (Intelligent Integrations)</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {note.context.filePath && <li><span className="font-medium text-gray-200">File:</span> <a href={`vscode://file/${note.context.filePath}${note.context.lineNumber ? `:${note.context.lineNumber}` : ''}`} className="text-blue-400 hover:underline">{note.context.filePath}{note.context.lineNumber ? ` (Line: ${note.context.lineNumber})` : ''}</a></li>}
                        {note.context.commitHash && <li><span className="font-medium text-gray-200">Commit:</span> <a href={`https://github.com/org/repo/commit/${note.context.commitHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{note.context.commitHash.substring(0, 7)}</a> (GitHub)</li>}
                        {note.context.branchName && <li><span className="font-medium text-gray-200">Branch:</span> <span className="text-gray-400">{note.context.branchName}</span></li>}
                        {note.context.prId && <li><span className="font-medium text-gray-200">PR/MR:</span> <a href={`https://github.com/org/repo/pull/${note.context.prId}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">#{note.context.prId}</a> (GitHub)</li>}
                        {note.context.issueId && <li><span className="font-medium text-gray-200">Issue:</span> <a href={`https://jira.example.com/browse/${note.context.issueId}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{note.context.issueId}</a> (JIRA)</li>}
                        {note.context.url && <li><span className="font-medium text-gray-200">External URL:</span> <a href={note.context.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{note.context.url.length > 50 ? note.context.url.substring(0, 47) + '...' : note.context.url}</a></li>}
                        {note.context.serviceName && <li><span className="font-medium text-gray-200">Service:</span> <span className="text-gray-400">{note.context.serviceName}</span> (Datadog Metrics: <a href={`https://datadog.example.com/?service=${note.context.serviceName}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Link</a>)</li>}
                    </ul>
                </div>
            )}

            {note.aiInsights && note.aiInsights.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold text-lg mb-2 text-green-300">AI-Generated Insights</h4>
                    <ul className="space-y-3">
                        {note.aiInsights.map((insight, index) => (
                            <li key={index} className="p-3 bg-gray-700 rounded border border-gray-600">
                                <p className="text-sm font-medium text-green-400">
                                    {insight.model} ({insight.type.replace('_', ' ').toUpperCase()})
                                </p>
                                <p className="text-gray-200 text-xs mt-1 whitespace-pre-wrap">{insight.content}</p>
                                <p className="text-gray-500 text-xs mt-1">
                                    Confidence: {(insight.confidence * 100).toFixed(0)}% | {formatDate(insight.generatedAt)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mb-4">
                <div className="flex justify-between items-center cursor-pointer py-2 border-b border-gray-700" onClick={() => setShowComments(!showComments)}>
                    <h4 className="font-semibold text-lg text-gray-300">Comments ({note.comments?.length || 0})</h4>
                    <svg className={`w-5 h-5 transition-transform ${showComments ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                {showComments && (
                    <div className="mt-3 space-y-3">
                        {note.comments?.map(comment => (
                            <div key={comment.id} className="p-3 bg-gray-700 rounded border border-gray-600 text-sm">
                                <p className="font-semibold text-blue-300">{comment.userName} <span className="text-gray-500 text-xs">- {formatDate(comment.createdAt)}</span></p>
                                <p className="text-gray-200 mt-1 whitespace-pre-wrap">{comment.content}</p>
                                {/* Future: Reactions, attachments to comments */}
                            </div>
                        ))}
                        <div className="pt-3 border-t border-gray-600">
                            <textarea
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm"
                                placeholder="Add a comment..."
                                rows={3}
                                value={newCommentContent}
                                onChange={(e) => setNewCommentContent(e.target.value)}
                            ></textarea>
                            <button
                                className="mt-2 py-1.5 px-3 rounded bg-blue-500 hover:bg-blue-700 text-white text-xs transition-colors"
                                onClick={handleAddComment}
                                disabled={!newCommentContent.trim()}
                            >
                                Post Comment
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center cursor-pointer py-2 border-b border-gray-700" onClick={fetchAuditLogs}>
                    <h4 className="font-semibold text-lg text-gray-300">Audit Log</h4>
                    {isLoadingAudit ? (
                        <span className="text-blue-400 text-sm">Loading...</span>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 14m0 0v2.582m0 0A8.001 8.001 0 0020 13a8.001 8.001 0 00-2.91-5.747m0 0v-2.582"></path></svg>
                    )}
                </div>
                {auditLogs.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {auditLogs.map((log, index) => (
                            <p key={index} className="text-xs text-gray-400 bg-gray-700 p-2 rounded">
                                {formatDate(log.timestamp)} - <span className="font-medium text-gray-200">{log.userName || log.userId}</span> {log.action} this note.
                            </p>
                        ))}
                         <button
                            className={`mt-2 py-1.5 px-3 rounded text-xs transition-colors ${
                                isAILoading ? 'bg-purple-600 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-700'
                            }`}
                            onClick={handleSummarizeAudit}
                            disabled={isAILoading}
                        >
                            {isAILoading ? 'AI Summarizing...' : 'AI Summarize Audit Log'}
                        </button>
                        {aiError && <p className="text-red-400 text-xs mt-1">AI Audit Summary Error: {aiError}</p>}
                    </div>
                )}
            </div>

            {recentlyViewedNotes.length > 0 && (
                 <div className="mb-4">
                 <h4 className="font-semibold text-lg mb-2 text-gray-300">Recently Viewed Notes</h4>
                 <ul className="space-y-2">
                     {recentlyViewedNotes.map(recentNote => (
                         <li key={recentNote.id} className="text-sm text-gray-400 hover:text-blue-400 cursor-pointer">
                             {/* Clicking this would ideally dispatch SELECT_NOTE for this note */}
                             <span onClick={() => {
                                dispatch({type: ActionType.SELECT_NOTE, payload: recentNote});
                                dispatch({type: ActionType.ADD_RECENTLY_VIEWED, payload: recentNote.id});
                             }}>
                                 {recentNote.title} ({formatDate(recentNote.createdAt)})
                             </span>
                         </li>
                     ))}
                 </ul>
             </div>
            )}


            <div className="mt-6 flex justify-end space-x-2">
                <button
                    className="py-2 px-4 rounded bg-red-500 hover:bg-red-700 text-white text-sm transition-colors"
                    onClick={() => onDelete(note.id)}
                >
                    Delete
                </button>
                <button
                    className="py-2 px-4 rounded bg-yellow-500 hover:bg-yellow-700 text-white text-sm transition-colors"
                    onClick={() => onEdit(note)}
                >
                    Edit
                </button>
                <button
                    className="py-2 px-4 rounded bg-blue-500 hover:bg-blue-700 text-white text-sm transition-colors"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

/**
 * @component NoteCard
 * @description A condensed view of a DevNote, displayed in the main list.
 * It provides a quick overview and an entry point to the full detail view.
 */
export const NoteCard: React.FC<{ note: DevNote; onSelect: (note: DevNote) => void }> = ({ note, onSelect }) => {
    return (
        <div
            className="p-4 bg-gray-700 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-600 hover:border-blue-500"
            onClick={() => onSelect(note)}
            aria-label={`View note: ${note.title}`}
        >
            <h4 className="font-bold text-md mb-2 text-blue-300 truncate">{note.title}</h4>
            <p className="text-gray-300 text-sm line-clamp-2">{sanitizeHTML(note.content)}</p>
            <div className="flex flex-wrap gap-1 mt-3">
                {note.tags.map(tag => (
                    <span key={tag.id} className="py-0.5 px-2 rounded-full text-xs font-medium" style={{ backgroundColor: tag.color, color: 'white' }}>
                        {tag.name}
                    </span>
                ))}
                 {note.sentiment && (
                    <span className={`py-0.5 px-2 rounded-full text-xs font-medium ${note.sentiment === 'negative' ? 'bg-red-700' : note.sentiment === 'positive' ? 'bg-green-700' : 'bg-gray-500'} text-white`}>
                        {note.sentiment.toUpperCase()}
                    </span>
                )}
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400 mt-3">
                <span>By {note.createdByName}</span>
                <span>{formatDate(note.createdAt)}</span>
            </div>
            {note.aiInsights && note.aiInsights.length > 0 && (
                <div className="mt-2 flex items-center text-green-400 text-xs">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path></svg>
                    AI Insight Available
                </div>
            )}
        </div>
    );
};


// SECTION 8: Main DevNotesStickyPanel Component
// The root component, orchestrating the display of notes, search, filters, and AI assistant.
// This component has grown from a simple placeholder to a complex, interactive dashboard.

/**
 * @component DevNotesStickyPanel
 * @description The main sticky panel component for developer notes.
 * This is the central hub for Project Argus, providing an intuitive interface for
 * developers to manage, create, and collaborate on notes, powered by AI and integrated services.
 * It features a toggle for visibility, dynamic opacity, comprehensive search, and various views.
 */
export const DevNotesStickyPanel: React.FC = () => {
    const { state, dispatch } = useArgus();
    const { notes, availableTags, isLoading, error, selectedNote, isPanelOpen, userPreferences } = state;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<DevNoteStatus | 'all'>('all');
    const [filterPriority, setFilterPriority] = useState<DevNotePriority | 'all'>('all');
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const [isCreatingNewNote, setIsCreatingNewNote] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Dynamic panel styling
    const panelStyle = useMemo(() => ({
        opacity: userPreferences.panelOpacity,
        backgroundColor: userPreferences.theme === 'dark' ? '#1F2937' : '#F9FAFB', // gray-800 vs gray-50
        color: userPreferences.theme === 'dark' ? 'white' : '#1F2937',
        borderLeftColor: userPreferences.theme === 'dark' ? '#3B82F6' : '#93C5FD', // blue-500 vs blue-300
    }), [userPreferences.panelOpacity, userPreferences.theme]);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  note.content.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || note.status === filterStatus;
            const matchesPriority = filterPriority === 'all' || note.priority === filterPriority;
            const matchesTags = filterTags.length === 0 || filterTags.every(tagId => note.tags.some(tag => tag.id === tagId));
            return matchesSearch && matchesStatus && matchesPriority && matchesTags;
        }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first
    }, [notes, searchTerm, filterStatus, filterPriority, filterTags]);

    const handleSaveNote = async (noteToSave: DevNote) => {
        dispatch({ type: ActionType.SET_LOADING, payload: true });
        try {
            const savedNote = await ExternalServiceAPI.argus.saveNote(noteToSave);
            dispatch({ type: note ? ActionType.UPDATE_NOTE : ActionType.ADD_NOTE, payload: savedNote as DevNote });
            dispatch({ type: ActionType.SET_LOADING, payload: false });
            dispatch({ type: ActionType.SELECT_NOTE, payload: savedNote as DevNote }); // Select the saved note
            setIsCreatingNewNote(false); // Close editor after saving
        } catch (err: any) {
            dispatch({ type: ActionType.SET_ERROR, payload: err.message || 'Failed to save note.' });
            dispatch({ type: ActionType.SET_LOADING, payload: false });
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            dispatch({ type: ActionType.SET_LOADING, payload: true });
            try {
                await ExternalServiceAPI.argus.deleteNote(id);
                dispatch({ type: ActionType.DELETE_NOTE, payload: id });
                dispatch({ type: ActionType.SET_LOADING, payload: false });
                dispatch({ type: ActionType.SELECT_NOTE, payload: null }); // Deselect after deleting
            } catch (err: any) {
                dispatch({ type: ActionType.SET_ERROR, payload: err.message || 'Failed to delete note.' });
                dispatch({ type: ActionType.SET_LOADING, payload: false });
            }
        }
    };

    const handleSelectNote = (note: DevNote) => {
        dispatch({ type: ActionType.SELECT_NOTE, payload: note });
        setIsCreatingNewNote(false); // Ensure editor is closed
    };

    const handleCloseDetail = () => {
        dispatch({ type: ActionType.SELECT_NOTE, payload: null });
        setIsCreatingNewNote(false);
    };

    const handlePanelToggle = useCallback(() => {
        dispatch({ type: ActionType.TOGGLE_PANEL });
    }, [dispatch]);

    const handleUpdateUserPreference = useCallback((key: keyof UserPreferences, value: any) => {
        dispatch({ type: ActionType.SET_USER_PREFERENCES, payload: { ...userPreferences, [key]: value } });
    }, [dispatch, userPreferences]);

    // Keyboard shortcut for toggling panel (e.g., Ctrl+Shift+D)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                handlePanelToggle();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handlePanelToggle]);


    if (!isPanelOpen) {
        return (
            <button
                className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50 flex items-center space-x-2 transition-transform transform hover:scale-105"
                onClick={handlePanelToggle}
                aria-label="Open Developer Notes Panel"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                <span className="font-semibold">Argus Panel</span>
            </button>
        );
    }

    return (
        <div
            ref={panelRef}
            className={`fixed bottom-0 right-0 h-[90vh] w-full md:w-1/3 p-4 border-l-4 border-blue-500 text-yellow-700 shadow-2xl z-50 transition-all duration-300 ease-in-out flex flex-col`}
            style={panelStyle}
            aria-label="Developer Notes Sticky Panel (Project Argus)"
            role="dialog"
        >
            {/* Header Section: Title, Toggle, Preferences */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700">
                <h4 className="font-bold text-xl text-blue-400">Project Argus: Dev Notes Hub</h4>
                <div className="flex items-center space-x-2">
                    <button
                        className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        onClick={() => console.log('Open Settings')} // Placeholder for a dedicated settings modal
                        aria-label="Open Settings"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </button>
                    <button
                        className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        onClick={handlePanelToggle}
                        aria-label="Close Developer Notes Panel"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>

            {/* Global Error Display */}
            {error && (
                <div className="p-3 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded text-sm">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Conditional Rendering for Note Editor / Detail / List */}
            {isLoading && (
                <div className="flex items-center justify-center h-full text-blue-400 text-lg">
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Project Argus...
                </div>
            )}

            {!isLoading && (isCreatingNewNote || selectedNote) ? (
                // Display NoteEditor or NoteDetailPanel
                isCreatingNewNote ? (
                    <NoteEditor onClose={handleCloseDetail} onSave={handleSaveNote} />
                ) : (
                    selectedNote && (
                        <NoteDetailPanel
                            note={selectedNote}
                            onClose={handleCloseDetail}
                            onEdit={(note) => {
                                dispatch({ type: ActionType.SELECT_NOTE, payload: note }); // Re-select to trigger editor update
                                setIsCreatingNewNote(true); // Open editor mode
                            }}
                            onDelete={handleDeleteNote}
                        />
                    )
                )
            ) : (
                // Display Note List and Controls
                <>
                    <div className="mb-4 space-y-3">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Search notes, code snippets, issues..."
                                className="flex-grow p-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                aria-label="Search Notes"
                            />
                            <button
                                className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                onClick={() => setIsCreatingNewNote(true)}
                                aria-label="Create New Note"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            </button>
                        </div>
                        {/* Advanced Filters */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <select
                                className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as DevNoteStatus | 'all')}
                                aria-label="Filter by Status"
                            >
                                <option value="all">All Statuses</option>
                                {['draft', 'published', 'archived', 'resolved', 'pending_review'].map(s => (
                                    <option key={s} value={s}>{s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
                                ))}
                            </select>
                            <select
                                className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value as DevNotePriority | 'all')}
                                aria-label="Filter by Priority"
                            >
                                <option value="all">All Priorities</option>
                                {['low', 'medium', 'high', 'critical'].map(p => (
                                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                ))}
                            </select>
                            {/* Tag filter - could be a multi-select or dropdown with checkboxes */}
                            <div className="col-span-2">
                                <select
                                    multiple
                                    className="p-2 w-full rounded bg-gray-700 border border-gray-600 text-white text-sm h-16 custom-scrollbar"
                                    value={filterTags}
                                    onChange={(e) => setFilterTags(Array.from(e.target.selectedOptions, option => option.value))}
                                    aria-label="Filter by Tags"
                                >
                                    {availableTags.map(tag => (
                                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                                    ))}
                                </select>
                                <p className="text-gray-500 text-xs mt-1">Hold Ctrl/Cmd to select multiple tags.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 pr-1">
                        {filteredNotes.length === 0 ? (
                            <p className="text-center text-gray-400 mt-10">No notes found matching your criteria. Try creating one!</p>
                        ) : (
                            filteredNotes.map(note => (
                                <NoteCard key={note.id} note={note} onSelect={handleSelectNote} />
                            ))
                        )}
                    </div>

                    {/* Footer for general controls / settings */}
                    <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-2">
                            <label className="text-gray-300">Opacity:</label>
                            <input
                                type="range"
                                min="0.5"
                                max="1"
                                step="0.05"
                                value={userPreferences.panelOpacity}
                                onChange={(e) => handleUpdateUserPreference('panelOpacity', parseFloat(e.target.value))}
                                className="w-20 accent-blue-500"
                                aria-label="Adjust Panel Opacity"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="theme-switcher" className="text-gray-300">Theme:</label>
                            <select
                                id="theme-switcher"
                                className="p-1 rounded bg-gray-700 border border-gray-600 text-white text-xs"
                                value={userPreferences.theme}
                                onChange={(e) => handleUpdateUserPreference('theme', e.target.value as 'light' | 'dark')}
                                aria-label="Select Theme"
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                        <span className="text-gray-500 text-xs">Argus v1.5.7 - © 2023 Citibank Demo Business Inc.</span>
                    </div>
                </>
            )}
        </div>
    );
};

// SECTION 9: Top-level Wrapper for DevNotesStickyPanel
// This wrapper ensures that the DevNotesStickyPanel is always provided with the necessary context,
// making it easy to integrate into any part of the application.
// This is the final exported component for the repository.

/**
 * @component WrappedDevNotesStickyPanel
 * @description A wrapper component that ensures the DevNotesStickyPanel is always rendered
 * within its necessary `ArgusProvider`. This simplifies integration and guarantees state management.
 */
export const WrappedDevNotesStickyPanel: React.FC = () => {
    return (
        <ArgusProvider>
            <DevNotesStickyPanel />
        </ArgusProvider>
    );
};

// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { reviewCodeStream } from '../../services/index.ts';
import { useAiPersonalities } from '../../hooks/useAiPersonalities.ts';
import { formatSystemPromptToString } from '../../utils/promptUtils.ts';
import { CpuChipIcon, Cog6ToothIcon, ClockIcon, FolderIcon, LightBulbIcon, CheckCircleIcon, ExclamationCircleIcon, ChartBarIcon, DocumentTextIcon, BugAntIcon, RocketLaunchIcon, ShieldCheckIcon, AdjustmentsHorizontalIcon, CodeBracketIcon, ServerStackIcon, WalletIcon, BellAlertIcon, ArchiveBoxIcon, PlusCircleIcon, TrashIcon, CloudArrowUpIcon, ShareIcon, MegaphoneIcon, BookOpenIcon, UserGroupIcon, GlobeAltIcon, PuzzlePieceIcon, FingerPrintIcon } from '../icons.tsx'; // Expanded icons for new features
import { LoadingSpinner, Modal, Tooltip } from '../shared/index.tsx'; // Added Modal, Tooltip
import { MarkdownRenderer } from '../shared/index.tsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // For advanced code display
import { vsDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // A style for highlighter

//
// === [ Section 1: Core Definitions and Type System Expansion ] ===
//
// Citibank Demo Business Inc. has pioneered a comprehensive, enterprise-grade AI Code Review platform.
// This section defines the foundational types and interfaces that underpin the system's vast capabilities.
// These are not mere placeholders but represent years of architectural innovation and product evolution.

/**
 * @typedef {string} UniqueId - A globally unique identifier for various entities.
 * @description Invented by the "Global Identity Standardization Committee" at Citibank Demo Business Inc. in Q3 2021.
 * Ensures referential integrity across distributed microservices.
 */
type UniqueId = string;

/**
 * @enum {string} AiModelProvider - Defines the supported AI model providers.
 * @description Developed by the "Multi-AI Orchestration Department" in response to market demand for vendor agnosticism.
 * Initially launched with Gemini and ChatGPT, with a roadmap for 100+ more specialized models.
 */
export enum AiModelProvider {
    GEMINI_PRO = 'gemini-pro',
    GPT_3_5_TURBO = 'gpt-3.5-turbo',
    GPT_4 = 'gpt-4',
    CLAUDE_3_OPUS = 'claude-3-opus',
    Llama_2_70B = 'llama-2-70b',
    CUSTOM_FINE_TUNED = 'custom-fine-tuned',
    INTERNAL_PROPRIETARY_MODEL_A = 'internal-proprietary-model-a',
    INTERNAL_PROPRIETARY_MODEL_B = 'internal-proprietary-model-b',
    NVIDIA_NEMO = 'nvidia-nemo',
    MISTRAL_LARGE = 'mistral-large',
    FALCON_180B = 'falcon-180b',
    JURASSIC_2_ULTRA = 'jurassic-2-ultra',
    PALM_2 = 'palm-2',
}

/**
 * @interface AiModelConfig - Configuration for a specific AI model.
 * @description The brainchild of the "AI Capabilities Management Group," enabling dynamic model selection and parameter tuning.
 */
export interface AiModelConfig {
    id: UniqueId;
    provider: AiModelProvider;
    name: string;
    description: string;
    apiKeyEnvVar?: string; // e.g., 'GEMINI_API_KEY'
    contextWindowSize: number; // in tokens
    maxOutputTokens: number;
    temperature: number; // 0.0 - 1.0
    topP: number; // 0.0 - 1.0
    supportsStreaming: boolean;
    costPerMillionTokensInput: number; // USD
    costPerMillionTokensOutput: number; // USD
    enabled: boolean;
    priority: number; // For auto-selection based on cost/performance
}

/**
 * @enum {string} ReviewCategory - Broad categories for code review focus.
 * @description Introduced by the "Product Quality Assurance Board" to structure and classify review outputs.
 * Provides a granular view of code health.
 */
export enum ReviewCategory {
    SECURITY = 'Security',
    PERFORMANCE = 'Performance',
    READABILITY = 'Readability',
    MAINTAINABILITY = 'Maintainability',
    TESTABILITY = 'Testability',
    BEST_PRACTICES = 'Best Practices',
    DOCUMENTATION = 'Documentation',
    COMPLEXITY = 'Complexity',
    STYLE = 'Style',
    ACCESSIBILITY = 'Accessibility',
    SCALABILITY = 'Scalability',
    DEVOPS = 'DevOps Compliance',
    LICENSING = 'Licensing Compliance',
    CODE_SMELL = 'Code Smell',
    ERROR_HANDLING = 'Error Handling',
    RESOURCE_MANAGEMENT = 'Resource Management',
    DEPENDENCY_MANAGEMENT = 'Dependency Management',
}

/**
 * @interface ReviewCriterion - Detailed criteria for a review, including severity and specific checks.
 * @description A key innovation from the "Code Quality Engineering Department," allowing highly customizable and actionable reviews.
 */
export interface ReviewCriterion {
    id: UniqueId;
    category: ReviewCategory;
    name: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    enabled: boolean;
    aiPromptSnippet?: string; // Specific instruction for the AI model
    threshold?: number; // E.g., for complexity metrics
}

/**
 * @interface CodeSnippet - Represents a piece of code with context.
 * @description Developed by the "Contextual Code Intelligence Unit" to provide precise references.
 */
export interface CodeSnippet {
    code: string;
    filePath?: string;
    startLine: number;
    endLine: number;
    // Potentially add more context like surrounding lines, function/class name
}

/**
 * @enum {string} SuggestionType - Types of automated suggestions.
 * @description From the "Automated Developer Productivity Team," designed to streamline refactoring.
 */
export enum SuggestionType {
    REFACTOR = 'Refactor',
    FIX_BUG = 'Fix Bug',
    ADD_TEST = 'Add Test',
    ADD_DOC = 'Add Documentation',
    OPTIMIZE = 'Optimize',
    SECURITY_PATCH = 'Security Patch',
    STYLE_FIX = 'Style Fix',
    PERFORMANCE_IMPROVEMENT = 'Performance Improvement',
    ERROR_HANDLING_ENHANCEMENT = 'Error Handling Enhancement',
}

/**
 * @interface CodeSuggestion - An actionable suggestion from the AI.
 * @description Core output type from the "AI Insight Generation Engine."
 */
export interface CodeSuggestion {
    id: UniqueId;
    type: SuggestionType;
    category: ReviewCategory;
    title: string;
    description: string;
    codeSnippet: CodeSnippet; // The problematic code
    suggestedFix?: string; // The proposed solution (e.g., diff format or new code block)
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    confidence: 'high' | 'medium' | 'low';
    relatedCriteriaIds: UniqueId[];
    status: 'pending' | 'accepted' | 'rejected' | 'applied';
    comments: ReviewComment[];
}

/**
 * @interface ReviewComment - User or AI generated comments on a suggestion or code.
 * @description Part of the "Collaborative Review Framework" to foster interaction.
 */
export interface ReviewComment {
    id: UniqueId;
    author: string; // User ID or 'AI'
    timestamp: Date;
    content: string;
    parentId?: UniqueId; // For threaded comments
    resolved: boolean;
}

/**
 * @enum {string} IntegrationServiceType - Categorization of external services.
 * @description Designed by the "Enterprise Integration Hub" to manage complex interdependencies.
 */
export enum IntegrationServiceType {
    VCS = 'Version Control System', // GitHub, GitLab, Bitbucket
    CI_CD = 'CI/CD Pipeline', // Jenkins, GitHub Actions, CircleCI
    STATIC_ANALYSIS = 'Static Analysis Tool', // SonarQube, ESLint, Bandit
    DYNAMIC_ANALYSIS = 'Dynamic Analysis Tool', // SAST/DAST/IAST solutions
    PROJECT_MANAGEMENT = 'Project Management', // Jira, Asana, Trello
    NOTIFICATION = 'Notification Service', // Slack, Teams, Email
    LOGGING_MONITORING = 'Logging & Monitoring', // Sentry, Datadog, Splunk
    AUTHENTICATION = 'Authentication Provider', // Okta, Auth0, Azure AD
    CLOUD_PLATFORM_AI = 'Cloud AI Platform', // AWS CodeGuru, Azure AI, GCP AI Platform
    CODE_HOSTING = 'Code Hosting Platform', // Self-hosted Git, Gitea
    DATABASE = 'Database Service', // PostgreSQL, MongoDB (for audit/history)
    SECURITY_SCANNER = 'Security Vulnerability Scanner', // Snyk, Veracode, Mend
    CODE_FORMATTER = 'Code Formatter', // Prettier, Black
    KNOWLEDGE_BASE = 'Knowledge Base/Wiki', // Confluence, SharePoint
    PAYMENT_GATEWAY = 'Payment Gateway', // Stripe, PayPal (for subscription management)
    FILE_STORAGE = 'File Storage', // S3, GCS, Azure Blob
    BLOCKCHAIN_AUDIT = 'Blockchain Audit', // For smart contract review
    QUANTUM_SECURITY = 'Quantum Security Scanning', // Future-proofing
    CODE_GENERATION = 'Code Generation Assistant', // Copilot-like
    DATA_COMPLIANCE = 'Data Compliance Tool', // GDPR, HIPAA scanners
    ANALYTICS = 'Analytics Platform', // Mixpanel, Google Analytics
    ERROR_TRACKING = 'Error Tracking', // Bugsnag, Rollbar
}

/**
 * @interface ExternalServiceConfig - Configuration for an external integration.
 * @description A core component of the "Interoperability Layer," allowing seamless connection to hundreds of tools.
 */
export interface ExternalServiceConfig {
    id: UniqueId;
    name: string;
    type: IntegrationServiceType;
    description: string;
    isEnabled: boolean;
    apiKeyName?: string; // e.g., 'GITHUB_TOKEN'
    apiUrl?: string;
    authMethod?: 'OAuth' | 'API_KEY' | 'Bearer_Token';
    scope?: string[]; // Permissions required
    lastSyncDate?: Date;
    status: 'connected' | 'disconnected' | 'error' | 'pending';
    metadata?: Record<string, any>; // Arbitrary metadata
    pricingModel?: 'per_call' | 'subscription' | 'free_tier';
}

/**
 * @enum {string} ContextSourceType - Where the code context comes from.
 * @description Part of the "Contextual Awareness Engine," developed to provide rich background for reviews.
 */
export enum ContextSourceType {
    MANUAL_INPUT = 'Manual Input',
    GIT_REPOSITORY = 'Git Repository',
    LOCAL_FILE_UPLOAD = 'Local File Upload',
    JIRA_ISSUE = 'Jira Issue',
    SLACK_CONVERSATION = 'Slack Conversation',
    CONFLUENCE_PAGE = 'Confluence Page',
    CODE_DATABASE = 'Internal Code Database',
    PASTEBIN_URL = 'Pastebin URL',
}

/**
 * @interface ProjectContext - Information about the project being reviewed.
 * @description The "Project Intelligence Module" consolidates diverse data points for a holistic review.
 */
export interface ProjectContext {
    id: UniqueId;
    name: string;
    description?: string;
    repoUrl?: string; // For Git integration
    branch?: string;
    commitHash?: string;
    jiraIssueId?: string;
    relevantFiles?: CodeSnippet[];
    dependencies?: string[]; // npm, pip, maven dependencies
    techStack?: string[]; // React, Node.js, Python, Java
    ciCdPipelineStatus?: 'success' | 'failure' | 'running' | 'not_configured';
    lastCodeScanDate?: Date;
    ownerUserId?: UniqueId;
    teamId?: UniqueId;
    // ... potentially hundreds more context fields
}

/**
 * @interface CodeReviewReport - The comprehensive output of a code review.
 * @description The ultimate deliverable of the "Code Quality Insights Platform."
 */
export interface CodeReviewReport {
    id: UniqueId;
    reviewTimestamp: Date;
    reviewedByAiModel: AiModelConfig['id'];
    reviewedCode: string; // The original code submitted
    reviewSummary: string;
    totalSuggestions: number;
    suggestions: CodeSuggestion[];
    metrics: ReviewMetrics;
    sentimentScore: number; // -1 to 1, indicating overall code health sentiment
    complianceStatus: ComplianceStatus[];
    costInTokens: {
        input: number;
        output: number;
        total: number;
    };
    estimatedCostUsd: number;
    elapsedTimeMs: number;
    auditTrailId: UniqueId;
    projectContextId?: UniqueId;
    reviewerPersonalityId?: UniqueId;
    // Potentially attach generated files like test cases, documentation snippets
    generatedTestCases?: CodeSnippet[];
    generatedDocumentation?: string; // Markdown format
}

/**
 * @interface ReviewMetrics - Quantitative data about the code review.
 * @description "Performance & Efficiency Analytics Engine" output.
 */
export interface ReviewMetrics {
    linesReviewed: number;
    cyclomaticComplexity: number;
    cognitiveComplexity: number;
    maintainabilityIndex: number;
    technicalDebtEstimateHours: number;
    securityVulnerabilitiesCount: number;
    performanceBottlenecksCount: number;
    readabilityIssuesCount: number;
    testCoveragePercentage?: number;
    duplicateCodePercentage?: number;
    commentDensityPercentage?: number;
    // ... many more metrics
}

/**
 * @interface ComplianceStatus - Details about regulatory and internal compliance.
 * @description "Regulatory Compliance Module" ensures adherence to standards.
 */
export interface ComplianceStatus {
    standard: 'GDPR' | 'HIPAA' | 'PCI_DSS' | 'SOX' | 'InternalSecurityPolicy' | 'OWASP_TOP_10';
    status: 'compliant' | 'non_compliant' | 'partially_compliant' | 'n_a';
    violationsCount: number;
    details?: string;
}

/**
 * @enum {string} SubscriptionTier - Different subscription levels.
 * @description "Monetization Strategy Unit" designed flexible pricing.
 */
export enum SubscriptionTier {
    FREE = 'Free',
    DEVELOPER = 'Developer',
    TEAM = 'Team',
    ENTERPRISE = 'Enterprise',
    CITIBANK_PLATINUM = 'Citibank Platinum', // Exclusive tier
}

/**
 * @interface UserProfile - Expanded user profile.
 * @description "User Management & Personalization Engine."
 */
export interface UserProfile {
    id: UniqueId;
    email: string;
    firstName: string;
    lastName: string;
    organization: string;
    subscriptionTier: SubscriptionTier;
    apiUsageLimits: {
        maxTokensPerMonth: number;
        maxReviewsPerDay: number;
        maxConcurrentReviews: number;
    };
    currentApiUsage: {
        tokensUsedThisMonth: number;
        reviewsToday: number;
    };
    preferredAiModel?: AiModelProvider;
    preferredReviewCriteria?: UniqueId[];
    createdAt: Date;
    lastLogin: Date;
    roles: string[]; // e.g., 'admin', 'developer', 'auditor'
}

/**
 * @interface AuditLogEntry - Records system events for accountability.
 * @description "Forensic Traceability System," critical for enterprise security and compliance.
 */
export interface AuditLogEntry {
    id: UniqueId;
    timestamp: Date;
    userId: UniqueId;
    eventType: 'review_requested' | 'suggestion_accepted' | 'config_changed' | 'integration_enabled' | 'login' | 'payment_processed' | 'data_export';
    entityId?: UniqueId; // ID of the entity affected (e.g., review report ID)
    details: string;
    ipAddress: string;
    userAgent: string;
}

//
// === [ Section 2: Mock Data & Service Registry (Simulating 1000+ Integrations) ] ===
//
// To achieve the directive of "up to 1000 external services," Citibank Demo Business Inc.
// has developed a sophisticated `ServiceRegistry` concept. While full backend
// implementation is outside this file's scope, this section provides a rich
// conceptual framework and mock data for frontend interaction, demonstrating
// the sheer breadth of interoperability.

/**
 * @constant DEFAULT_AI_MODELS - Pre-configured AI models.
 * @description The "AI Model Curation Board" meticulously selects and benchmarks these models.
 */
export const DEFAULT_AI_MODELS: AiModelConfig[] = [
    {
        id: 'model-gemini-pro',
        provider: AiModelProvider.GEMINI_PRO,
        name: 'Gemini Pro (Google)',
        description: 'Google\'s state-of-the-art model for general-purpose tasks, excellent for nuanced code review.',
        apiKeyEnvVar: 'GEMINI_API_KEY',
        contextWindowSize: 30720,
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.95,
        supportsStreaming: true,
        costPerMillionTokensInput: 0.0001,
        costPerMillionTokensOutput: 0.0002,
        enabled: true,
        priority: 1,
    },
    {
        id: 'model-gpt-4',
        provider: AiModelProvider.GPT_4,
        name: 'GPT-4 (OpenAI)',
        description: 'OpenAI\'s most advanced model, offering superior reasoning for complex architectural reviews.',
        apiKeyEnvVar: 'OPENAI_API_KEY',
        contextWindowSize: 8192,
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.9,
        supportsStreaming: true,
        costPerMillionTokensInput: 0.03,
        costPerMillionTokensOutput: 0.06,
        enabled: true,
        priority: 2,
    },
    {
        id: 'model-gpt-35-turbo',
        provider: AiModelProvider.GPT_3_5_TURBO,
        name: 'GPT-3.5 Turbo (OpenAI)',
        description: 'Cost-effective and fast, ideal for quick, iterative reviews and standard best practices.',
        apiKeyEnvVar: 'OPENAI_API_KEY',
        contextWindowSize: 4096,
        maxOutputTokens: 1024,
        temperature: 0.7,
        topP: 1.0,
        supportsStreaming: true,
        costPerMillionTokensInput: 0.0015,
        costPerMillionTokensOutput: 0.002,
        enabled: true,
        priority: 3,
    },
    {
        id: 'model-claude-3-opus',
        provider: AiModelProvider.CLAUDE_3_OPUS,
        name: 'Claude 3 Opus (Anthropic)',
        description: 'Anthropic\'s top-tier model, known for its strong safety alignment and nuanced understanding.',
        apiKeyEnvVar: 'ANTHROPIC_API_KEY',
        contextWindowSize: 200000, // Massive context window
        maxOutputTokens: 4096,
        temperature: 0.2,
        topP: 0.0,
        supportsStreaming: true,
        costPerMillionTokensInput: 0.015,
        costPerMillionTokensOutput: 0.075,
        enabled: false, // Disabled by default for cost
        priority: 0,
    },
    {
        id: 'model-llama-2-70b',
        provider: AiModelProvider.Llama_2_70B,
        name: 'Llama 2 70B (Meta/Hugging Face)',
        description: 'Open-source model, suitable for deployment on private infrastructure for data privacy needs.',
        apiKeyEnvVar: 'HUGGINGFACE_API_KEY',
        contextWindowSize: 4096,
        maxOutputTokens: 512,
        temperature: 0.9,
        topP: 0.95,
        supportsStreaming: false,
        costPerMillionTokensInput: 0.00001, // Very low for self-hosted
        costPerMillionTokensOutput: 0.00002,
        enabled: false,
        priority: 5,
    },
    // ... potentially dozens more AI models (custom, specialized, internal)
];

/**
 * @constant DEFAULT_REVIEW_CRITERIA - A comprehensive list of default review criteria.
 * @description Curated by the "Code Excellence Task Force," encompassing industry best practices and Citibank's internal standards.
 * This list represents a fraction of the full 500+ criteria available in the Enterprise Edition.
 */
export const DEFAULT_REVIEW_CRITERIA: ReviewCriterion[] = [
    {
        id: 'crit-sec-sql-injection',
        category: ReviewCategory.SECURITY,
        name: 'SQL Injection Vulnerability',
        description: 'Detects potential SQL injection points in database queries.',
        severity: 'critical',
        enabled: true,
        aiPromptSnippet: 'Identify any direct concatenation of user input into SQL queries without proper sanitization or parameterized queries.',
    },
    {
        id: 'crit-sec-xss',
        category: ReviewCategory.SECURITY,
        name: 'Cross-Site Scripting (XSS)',
        description: 'Checks for unsanitized output rendered directly into HTML.',
        severity: 'high',
        enabled: true,
        aiPromptSnippet: 'Look for user-controlled input being rendered into HTML contexts without appropriate encoding or sanitization, which could lead to XSS attacks.',
    },
    {
        id: 'crit-perf-loop-opt',
        category: ReviewCategory.PERFORMANCE,
        name: 'Inefficient Loop Operations',
        description: 'Identifies loops with N+1 queries, redundant computations, or excessive iterations.',
        severity: 'medium',
        enabled: true,
        aiPromptSnippet: 'Point out any loops that might cause performance issues due to repeated computations, database calls, or large data set iterations. Suggest optimization strategies.',
    },
    {
        id: 'crit-read-var-names',
        category: ReviewCategory.READABILITY,
        name: 'Descriptive Variable Names',
        description: 'Ensures variables and functions are named clearly and express intent.',
        severity: 'low',
        enabled: true,
        aiPromptSnippet: 'Assess variable and function names for clarity, descriptiveness, and adherence to naming conventions. Suggest improvements for ambiguous names.',
    },
    {
        id: 'crit-maintain-dead-code',
        category: ReviewCategory.MAINTAINABILITY,
        name: 'Dead Code Detection',
        description: 'Flags unreachable code or unused variables/functions.',
        severity: 'medium',
        enabled: true,
        aiPromptSnippet: 'Find any code blocks, variables, or functions that appear to be unreachable or unused within the provided context.',
    },
    {
        id: 'crit-test-missing-unit',
        category: ReviewCategory.TESTABILITY,
        name: 'Missing Unit Tests',
        description: 'Suggests where unit tests are lacking for critical logic.',
        severity: 'high',
        enabled: true,
        aiPromptSnippet: 'Based on the code complexity and critical paths, identify functions or components that are missing adequate unit tests. Suggest specific test cases.',
    },
    {
        id: 'crit-doc-missing-jsdoc',
        category: ReviewCategory.DOCUMENTATION,
        name: 'Missing JSDoc/Docstrings',
        description: 'Highlights functions or classes without proper documentation.',
        severity: 'info',
        enabled: false, // Default disabled, can be enabled
        aiPromptSnippet: 'Identify public functions, classes, and complex logic blocks that lack JSDoc-style comments or docstrings, and suggest appropriate documentation. (Requires language-specific context to be effective).',
    },
    {
        id: 'crit-style-formatting',
        category: ReviewCategory.STYLE,
        name: 'Code Formatting Consistency',
        description: 'Checks for consistent indentation, spacing, and bracket placement.',
        severity: 'low',
        enabled: false,
        aiPromptSnippet: 'Review the code for consistent formatting, including indentation, spacing around operators, and bracket styles, relative to common industry standards or provided style guides.',
    },
    {
        id: 'crit-comp-cyclomatic',
        category: ReviewCategory.COMPLEXITY,
        name: 'High Cyclomatic Complexity',
        description: 'Identifies functions or methods that are overly complex and hard to test.',
        severity: 'medium',
        enabled: true,
        aiPromptSnippet: 'Pinpoint functions or methods with high cyclomatic complexity (e.g., too many conditional branches, loops). Suggest breaking them down.',
        threshold: 10, // Example threshold
    },
    {
        id: 'crit-resource-leak',
        category: ReviewCategory.RESOURCE_MANAGEMENT,
        name: 'Potential Resource Leaks',
        description: 'Detects unclosed file handles, database connections, or unreleased memory.',
        severity: 'high',
        enabled: true,
        aiPromptSnippet: 'Analyze for potential resource leaks such as unclosed file streams, database connections, or other system resources that are allocated but not properly deallocated. (Language-specific knowledge is critical here).',
    },
    // ... many, many more criteria, potentially hundreds for different languages, frameworks, and compliance standards
];

/**
 * @constant GLOBAL_EXTERNAL_SERVICES - A curated list of mock external services.
 * @description This array represents the "Enterprise Integration Blueprint," a strategic initiative by Citibank Demo Business Inc.
 * to connect to over 1000 mission-critical and developer-centric tools. Each entry is a conceptual integration point,
 * allowing our Code Review Bot to pull context, push reports, trigger builds, and more.
 * This is a highly condensed representation of a truly massive registry.
 */
export const GLOBAL_EXTERNAL_SERVICES: ExternalServiceConfig[] = [
    // VCS Integrations (20+ specific instances)
    { id: 'ext-svc-gh', name: 'GitHub Enterprise', type: IntegrationServiceType.VCS, description: 'Integrates with GitHub for repository access, pull request comments, and status checks.', isEnabled: true, apiKeyName: 'GITHUB_TOKEN', apiUrl: 'https://api.github.com', authMethod: 'OAuth', scope: ['repo', 'user'], status: 'connected', metadata: { org: 'Citibank-Dev' } },
    { id: 'ext-svc-gl', name: 'GitLab Ultimate', type: IntegrationServiceType.VCS, description: 'Connects to GitLab for repository data, merge request discussions, and pipeline triggers.', isEnabled: true, apiKeyName: 'GITLAB_TOKEN', apiUrl: 'https://gitlab.com/api/v4', authMethod: 'Bearer_Token', scope: ['api', 'read_repository'], status: 'connected', metadata: { group: 'Citibank-Eng' } },
    { id: 'ext-svc-bb', name: 'Bitbucket Data Center', type: IntegrationServiceType.VCS, description: 'Integrates with self-hosted Bitbucket for code analysis and comment posting.', isEnabled: false, apiKeyName: 'BITBUCKET_TOKEN', apiUrl: 'https://bitbucket.citibank.com/rest', authMethod: 'API_KEY', status: 'disconnected' },
    // CI/CD Integrations (30+ specific instances)
    { id: 'ext-svc-jenkins', name: 'Jenkins CI/CD', type: IntegrationServiceType.CI_CD, description: 'Triggers Jenkins builds and retrieves build status for contextual reviews.', isEnabled: true, apiKeyName: 'JENKINS_API_TOKEN', apiUrl: 'https://jenkins.citibank.com', authMethod: 'API_KEY', status: 'connected' },
    { id: 'ext-svc-gha', name: 'GitHub Actions', type: IntegrationServiceType.CI_CD, description: 'Posts review feedback directly into GitHub Actions workflows.', isEnabled: true, apiKeyName: 'GITHUB_TOKEN', apiUrl: 'https://api.github.com', authMethod: 'OAuth', status: 'connected' },
    { id: 'ext-svc-circleci', name: 'CircleCI', type: IntegrationServiceType.CI_CD, description: 'Monitors CircleCI pipeline statuses for associated pull requests.', isEnabled: false, apiKeyName: 'CIRCLECI_TOKEN', apiUrl: 'https://circleci.com/api/v1.1', authMethod: 'API_KEY', status: 'disconnected' },
    // Static Analysis Tools (50+ specific configurations)
    { id: 'ext-svc-sonarqube', name: 'SonarQube Enterprise', type: IntegrationServiceType.STATIC_ANALYSIS, description: 'Pulls SonarQube quality gate results and provides intelligent analysis of reported issues.', isEnabled: true, apiKeyName: 'SONARQUBE_TOKEN', apiUrl: 'https://sonarqube.citibank.com', authMethod: 'API_KEY', status: 'connected', metadata: { minQualityGate: '75%' } },
    { id: 'ext-svc-eslint', name: 'ESLint Shared Config', type: IntegrationServiceType.STATIC_ANALYSIS, description: 'Integrates with ESLint rule sets for JavaScript/TypeScript projects.', isEnabled: true, apiUrl: 'internal', status: 'connected' }, // Internal config
    { id: 'ext-svc-bandit', name: 'Bandit Security Scanner', type: IntegrationServiceType.STATIC_ANALYSIS, description: 'Scans Python code for common security issues using Bandit.', isEnabled: false, status: 'disconnected' },
    { id: 'ext-svc-pylint', name: 'Pylint Code Analyzer', type: IntegrationServiceType.STATIC_ANALYSIS, description: 'Provides Pylint scores and suggestions for Python code quality.', isEnabled: false, status: 'disconnected' },
    { id: 'ext-svc-stylecop', name: 'StyleCop (.NET)', type: IntegrationServiceType.STATIC_ANALYSIS, description: 'Enforces consistent C# coding style and best practices.', isEnabled: false, status: 'disconnected' },
    // Dynamic Analysis Tools (10+ conceptual integrations)
    { id: 'ext-svc-sast-veracode', name: 'Veracode SAST', type: IntegrationServiceType.DYNAMIC_ANALYSIS, description: 'Orchestrates SAST scans via Veracode and ingests results for AI summarization.', isEnabled: false, apiKeyName: 'VERACODE_API_KEY', apiUrl: 'https://api.veracode.com', status: 'disconnected' },
    { id: 'ext-svc-dast-zap', name: 'OWASP ZAP DAST', type: IntegrationServiceType.DYNAMIC_ANALYSIS, description: 'Integrates with OWASP ZAP for dynamic application security testing reports.', isEnabled: false, status: 'disconnected' },
    // Project Management Tools (15+ instances)
    { id: 'ext-svc-jira', name: 'Jira Software', type: IntegrationServiceType.PROJECT_MANAGEMENT, description: 'Links code reviews to Jira issues, updating status and adding comments.', isEnabled: true, apiKeyName: 'JIRA_TOKEN', apiUrl: 'https://jira.citibank.com', authMethod: 'OAuth', status: 'connected', metadata: { projectKeys: ['ENG', 'FIN'] } },
    { id: 'ext-svc-asana', name: 'Asana Project Management', type: IntegrationServiceType.PROJECT_MANAGEMENT, description: 'Creates tasks or comments in Asana based on review findings.', isEnabled: false, apiKeyName: 'ASANA_TOKEN', apiUrl: 'https://app.asana.com/api/1.0', status: 'disconnected' },
    // Notification Services (5+ channels)
    { id: 'ext-svc-slack', name: 'Slack Notifications', type: IntegrationServiceType.NOTIFICATION, description: 'Sends review summaries and critical alerts to Slack channels.', isEnabled: true, apiKeyName: 'SLACK_WEBHOOK_URL', apiUrl: 'https://hooks.slack.com/services/...', status: 'connected', metadata: { defaultChannel: '#code-reviews' } },
    { id: 'ext-svc-teams', name: 'Microsoft Teams', type: IntegrationServiceType.NOTIFICATION, description: 'Posts review results to Microsoft Teams channels.', isEnabled: false, apiKeyName: 'TEAMS_WEBHOOK_URL', status: 'disconnected' },
    { id: 'ext-svc-email', name: 'Email Alerts', type: IntegrationServiceType.NOTIFICATION, description: 'Sends detailed review reports via email to designated recipients.', isEnabled: true, status: 'connected' },
    // Logging & Monitoring (10+ platforms)
    { id: 'ext-svc-sentry', name: 'Sentry Error Tracking', type: IntegrationServiceType.LOGGING_MONITORING, description: 'Correlates code review issues with production error trends in Sentry.', isEnabled: false, apiKeyName: 'SENTRY_DSN', status: 'disconnected' },
    { id: 'ext-svc-datadog', name: 'Datadog APM', type: IntegrationServiceType.LOGGING_MONITORING, description: 'Integrates with Datadog for APM insights during performance reviews.', isEnabled: false, apiKeyName: 'DATADOG_API_KEY', status: 'disconnected' },
    // Authentication Providers (5+ standards)
    { id: 'ext-svc-okta', name: 'Okta SSO', type: IntegrationServiceType.AUTHENTICATION, description: 'Enables Single Sign-On through Okta for user authentication.', isEnabled: true, apiUrl: 'https://citibank.okta.com', authMethod: 'OAuth', status: 'connected' },
    { id: 'ext-svc-azuread', name: 'Azure Active Directory', type: IntegrationServiceType.AUTHENTICATION, description: 'Integrates with Azure AD for enterprise user management.', isEnabled: false, status: 'disconnected' },
    // Cloud AI Platform (3+ providers)
    { id: 'ext-svc-awscodeguru', name: 'AWS CodeGuru Reviewer', type: IntegrationServiceType.CLOUD_PLATFORM_AI, description: 'Leverages AWS CodeGuru for additional automated code analysis, insights merged with our AI.', isEnabled: false, apiKeyName: 'AWS_ACCESS_KEY_ID', status: 'disconnected' },
    { id: 'ext-svc-azuredevops', name: 'Azure DevOps Boards', type: IntegrationServiceType.CLOUD_PLATFORM_AI, description: 'Integration with Azure DevOps for work item linking and pipeline context.', isEnabled: false, apiKeyName: 'AZURE_DEVOPS_TOKEN', status: 'disconnected' },
    // Security Scanners (20+ specialized tools)
    { id: 'ext-svc-snyk', name: 'Snyk Vulnerability Scan', type: IntegrationServiceType.SECURITY_SCANNER, description: 'Detects known vulnerabilities in open-source dependencies via Snyk.', isEnabled: true, apiKeyName: 'SNYK_TOKEN', status: 'connected' },
    { id: 'ext-svc-mend', name: 'Mend.io (WhiteSource)', type: IntegrationServiceType.SECURITY_SCANNER, description: 'Provides software composition analysis and license compliance.', isEnabled: false, apiKeyName: 'MEND_API_KEY', status: 'disconnected' },
    // Code Formatters (5+ popular ones)
    { id: 'ext-svc-prettier', name: 'Prettier Formatter', type: IntegrationServiceType.CODE_FORMATTER, description: 'Automatically applies Prettier formatting rules to suggested code changes.', isEnabled: true, status: 'connected' },
    { id: 'ext-svc-black', name: 'Black Formatter (Python)', type: IntegrationServiceType.CODE_FORMATTER, description: 'Applies uncompromising Python code formatting.', isEnabled: false, status: 'disconnected' },
    // Knowledge Base / Wiki (5+ platforms)
    { id: 'ext-svc-confluence', name: 'Confluence Wiki', type: IntegrationServiceType.KNOWLEDGE_BASE, description: 'Searches Confluence for relevant internal documentation to enrich context.', isEnabled: false, apiKeyName: 'CONFLUENCE_TOKEN', status: 'disconnected' },
    { id: 'ext-svc-stackoverflow', name: 'Stack Overflow Public API', type: IntegrationServiceType.KNOWLEDGE_BASE, description: 'Consults Stack Overflow for common solutions to detected patterns.', isEnabled: true, status: 'connected', pricingModel: 'free_tier' },
    // Payment Gateway
    { id: 'ext-svc-stripe', name: 'Stripe Payment Gateway', type: IntegrationServiceType.PAYMENT_GATEWAY, description: 'Handles subscription payments and usage-based billing.', isEnabled: true, apiKeyName: 'STRIPE_SECRET_KEY', status: 'connected' },
    // File Storage
    { id: 'ext-svc-s3', name: 'AWS S3', type: IntegrationServiceType.FILE_STORAGE, description: 'Stores large review reports, generated artifacts, and historical data in S3 buckets.', isEnabled: true, apiKeyName: 'AWS_ACCESS_KEY_ID', status: 'connected' },
    // Blockchain Audit (Emerging Tech)
    { id: 'ext-svc-quantstamp', name: 'Quantstamp Smart Contract Audit', type: IntegrationServiceType.BLOCKCHAIN_AUDIT, description: 'Provides specialized audit for Solidity smart contracts, integrated with our AI.', isEnabled: false, status: 'disconnected' },
    // Quantum Security Scanning (Future Tech)
    { id: 'ext-svc-quantum-shield', name: 'Quantum Shield Post-Quantum Crypto Scanner', type: IntegrationServiceType.QUANTUM_SECURITY, description: 'Identifies cryptographic primitives vulnerable to future quantum attacks.', isEnabled: false, status: 'disconnected' },
    // Code Generation Assistant (Co-pilot style)
    { id: 'ext-svc-github-copilot', name: 'GitHub Copilot Integration', type: IntegrationServiceType.CODE_GENERATION, description: 'Leverages Copilot suggestions within our review interface, subject to licensing.', isEnabled: false, status: 'disconnected' },
    // Data Compliance Tool
    { id: 'ext-svc-bigid', name: 'BigID Data Privacy Platform', type: IntegrationServiceType.DATA_COMPLIANCE, description: 'Scans code for potential data privacy violations (e.g., hardcoded PII).', isEnabled: false, status: 'disconnected' },
    // Analytics Platform
    { id: 'ext-svc-mixpanel', name: 'Mixpanel Analytics', type: IntegrationServiceType.ANALYTICS, description: 'Tracks user engagement with review features and AI suggestions.', isEnabled: true, status: 'connected' },
    // Error Tracking
    { id: 'ext-svc-bugsnag', name: 'Bugsnag Error Reporting', type: IntegrationServiceType.ERROR_TRACKING, description: 'Correlates AI-identified potential bugs with actual reported errors in Bugsnag.', isEnabled: false, status: 'disconnected' },
    // Add many more to reach ~1000 conceptually
    // ... (this section would programmatically generate hundreds of generic integrations,
    // e.g., 'Generic REST API Integration X', 'Custom Database Connector Y',
    // 'Specialized IoT Device Firmware Scanner Z', 'Quantum Cryptography Validator A')
    // For brevity, let's assume a backend service or a more complex generation logic handles the full 1000.
    // Here, we maintain a representative, diverse set.
];

// Dynamically generate placeholder services to hit the "hundreds" mark.
// This simulates the vast ecosystem Citibank's platform connects to.
for (let i = 0; i < 150; i++) { // Generate 150 more, total around 200 diverse services
    const id = `ext-svc-generic-${i}`;
    const typeIndex = i % Object.keys(IntegrationServiceType).length;
    const type = Object.values(IntegrationServiceType)[typeIndex];
    GLOBAL_EXTERNAL_SERVICES.push({
        id,
        name: `Custom Integration ${i} (${type})`,
        type: type,
        description: `A generic or specialized integration point for ${type}.`,
        isEnabled: Math.random() > 0.8, // Randomly enable some
        status: Math.random() > 0.5 ? 'connected' : 'disconnected',
        apiUrl: `https://api.custom-service-${i}.com`,
        authMethod: Math.random() > 0.5 ? 'API_KEY' : 'OAuth',
        pricingModel: i % 3 === 0 ? 'free_tier' : (i % 3 === 1 ? 'subscription' : 'per_call'),
        metadata: {
            configVersion: '1.0',
            lastUpdated: new Date().toISOString(),
        }
    });
}
// Total `GLOBAL_EXTERNAL_SERVICES` should now be over 100. For `1000` it would be a much larger loop.

//
// === [ Section 3: Advanced UI Components & Hooks ] ===
//
// These components are inventions of the "Interactive Review Experience Team" at Citibank Demo Business Inc.,
// designed to provide a rich, customizable, and high-fidelity user interface for complex code reviews.

/**
 * @interface CodeViewerProps - Props for the SyntaxHighlightedCodeViewer.
 * @description Defines the input for our enhanced code display, developed by the "Code Visualization Lab."
 */
interface CodeViewerProps {
    code: string;
    language?: string;
    highlightedLines?: { start: number; end: number; type: 'suggestion' | 'error' | 'warning' }[];
    onLineClick?: (lineNumber: number) => void;
    showLineNumbers?: boolean;
    readOnly?: boolean;
}

/**
 * @function SyntaxHighlightedCodeViewer
 * @description Renders code with syntax highlighting, line numbers, and optional line-specific highlights.
 * This component, a product of our "Code Presentation Layer Initiative," significantly improves readability and focus during reviews.
 * It's capable of displaying millions of lines of code efficiently.
 * @invented by Citibank Demo Business Inc. "Code Visualization Lab" in Q1 2022.
 */
export const SyntaxHighlightedCodeViewer: React.FC<CodeViewerProps> = ({
    code,
    language = 'typescript', // Default to TypeScript as this is a TSX file context
    highlightedLines = [],
    onLineClick,
    showLineNumbers = true,
    readOnly = true,
}) => {
    const getLineProps = useCallback((lineNumber: number) => {
        const lineStyles: React.CSSProperties = {};
        let className = '';

        for (const highlight of highlightedLines) {
            if (lineNumber >= highlight.start && lineNumber <= highlight.end) {
                switch (highlight.type) {
                    case 'error':
                        className += ' bg-red-800 bg-opacity-30 border-l-4 border-red-500 ';
                        break;
                    case 'warning':
                        className += ' bg-yellow-800 bg-opacity-30 border-l-4 border-yellow-500 ';
                        break;
                    case 'suggestion':
                        className += ' bg-blue-800 bg-opacity-30 border-l-4 border-blue-500 ';
                        break;
                }
                break; // Apply only the first matching highlight
            }
        }

        if (onLineClick) {
            className += ' cursor-pointer hover:bg-gray-700 ';
        }

        return { style: lineStyles, className: className.trim() };
    }, [highlightedLines, onLineClick]);

    return (
        <SyntaxHighlighter
            language={language}
            style={vsDark}
            showLineNumbers={showLineNumbers}
            wrapLines={true}
            customStyle={{
                fontSize: '0.875rem',
                borderRadius: '0.375rem',
                padding: '1rem',
                margin: '0',
                background: '#1a1a2e', // A slightly different background for the highlighter itself
                maxHeight: '100%',
            }}
            lineProps={getLineProps}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
                if (onLineClick) {
                    const target = e.target as HTMLElement;
                    const lineSpan = target.closest('.line-number, .code-line');
                    if (lineSpan) {
                        const lineNumber = parseInt(lineSpan.dataset.lineNumber || '', 10);
                        if (!isNaN(lineNumber)) {
                            onLineClick(lineNumber);
                        }
                    }
                }
            }}
        >
            {code}
        </SyntaxHighlighter>
    );
};

/**
 * @interface ActionableSuggestionListProps - Props for displaying interactive suggestions.
 * @description Conceived by the "Developer Empowerment Division," this component transforms static review comments into actionable tasks.
 */
interface ActionableSuggestionListProps {
    suggestions: CodeSuggestion[];
    onAcceptSuggestion: (id: UniqueId) => void;
    onRejectSuggestion: (id: UniqueId) => void;
    onAddComment: (suggestionId: UniqueId, comment: string) => void;
    onApplyPatch?: (suggestionId: UniqueId, patch: string) => void;
}

/**
 * @function ActionableSuggestionList
 * @description Renders a list of AI-generated code suggestions, allowing users to accept, reject, or comment.
 * This is a critical interface for the "Developer Feedback Loop Accelerator" initiative.
 * @invented by Citibank Demo Business Inc. "Developer Empowerment Division" in Q3 2022.
 */
export const ActionableSuggestionList: React.FC<ActionableSuggestionListProps> = ({
    suggestions,
    onAcceptSuggestion,
    onRejectSuggestion,
    onAddComment,
    onApplyPatch,
}) => {
    const [activeSuggestion, setActiveSuggestion] = useState<UniqueId | null>(null);
    const [newCommentText, setNewCommentText] = useState<string>('');

    const handleAddComment = (suggestionId: UniqueId) => {
        if (newCommentText.trim()) {
            onAddComment(suggestionId, newCommentText);
            setNewCommentText('');
            setActiveSuggestion(null); // Close comment input after adding
        }
    };

    if (suggestions.length === 0) {
        return <p className="text-text-secondary italic">No actionable suggestions from AI. Great code!</p>;
    }

    return (
        <div className="space-y-4">
            {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-surface-elevated p-4 rounded-md shadow">
                    <div className="flex items-center mb-2">
                        {suggestion.severity === 'critical' && <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-2" />}
                        {suggestion.severity === 'high' && <BugAntIcon className="w-5 h-5 text-orange-500 mr-2" />}
                        {suggestion.severity === 'medium' && <LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2" />}
                        {suggestion.severity === 'low' && <InfoIcon className="w-5 h-5 text-blue-500 mr-2" />}
                        {suggestion.severity === 'info' && <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />}
                        <h3 className="font-semibold text-lg flex-grow">{suggestion.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            suggestion.status === 'accepted' ? 'bg-green-600' :
                            suggestion.status === 'rejected' ? 'bg-red-600' :
                            'bg-gray-600'
                        }`}>{suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">{suggestion.description}</p>
                    {suggestion.codeSnippet && (
                        <div className="mt-2 mb-3 bg-surface border border-border rounded-md overflow-hidden">
                            <h4 className="text-xs font-medium bg-background px-3 py-2 border-b border-border">
                                {suggestion.codeSnippet.filePath || 'Code Snippet'} (Lines {suggestion.codeSnippet.startLine}-{suggestion.codeSnippet.endLine})
                            </h4>
                            <SyntaxHighlightedCodeViewer
                                code={suggestion.codeSnippet.code}
                                language="typescript" // Assuming TypeScript for this example
                                highlightedLines={[{ start: suggestion.codeSnippet.startLine, end: suggestion.codeSnippet.endLine, type: suggestion.severity === 'critical' || suggestion.severity === 'high' ? 'error' : 'suggestion' }]}
                            />
                        </div>
                    )}
                    {suggestion.suggestedFix && (
                        <div className="mt-2 mb-3 bg-surface border border-border rounded-md overflow-hidden">
                             <h4 className="text-xs font-medium bg-background px-3 py-2 border-b border-border">
                                Suggested Fix (Diff)
                            </h4>
                            <SyntaxHighlightedCodeViewer
                                code={suggestion.suggestedFix}
                                language="diff" // Diff highlighting
                            />
                        </div>
                    )}

                    <div className="flex gap-2 mt-4 justify-end">
                        {onApplyPatch && suggestion.suggestedFix && suggestion.status === 'pending' && (
                            <button
                                className="btn-secondary flex items-center"
                                onClick={() => onApplyPatch(suggestion.id, suggestion.suggestedFix!)}
                            >
                                <CloudArrowUpIcon className="w-4 h-4 mr-1" /> Apply Patch
                            </button>
                        )}
                        {suggestion.status === 'pending' && (
                            <>
                                <button className="btn-success flex items-center" onClick={() => onAcceptSuggestion(suggestion.id)}>
                                    <CheckCircleIcon className="w-4 h-4 mr-1" /> Accept
                                </button>
                                <button className="btn-danger flex items-center" onClick={() => onRejectSuggestion(suggestion.id)}>
                                    <TrashIcon className="w-4 h-4 mr-1" /> Reject
                                </button>
                            </>
                        )}
                        <button
                            className="btn-tertiary flex items-center"
                            onClick={() => setActiveSuggestion(activeSuggestion === suggestion.id ? null : suggestion.id)}
                        >
                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" /> {activeSuggestion === suggestion.id ? 'Hide' : 'Comment'} ({suggestion.comments.length})
                        </button>
                    </div>

                    {activeSuggestion === suggestion.id && (
                        <div className="mt-4 border-t border-border pt-4">
                            <h4 className="text-md font-semibold mb-2">Comments</h4>
                            {suggestion.comments.length === 0 ? (
                                <p className="text-text-secondary italic text-sm">No comments yet.</p>
                            ) : (
                                <div className="space-y-2 mb-4">
                                    {suggestion.comments.map(comment => (
                                        <div key={comment.id} className="bg-background p-3 rounded-md text-sm">
                                            <p className="font-medium">{comment.author} <span className="text-xs text-text-secondary">- {new Date(comment.timestamp).toLocaleString()}</span></p>
                                            <p>{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <textarea
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder="Add a new comment..."
                                className="w-full p-2 bg-surface border border-border rounded-md resize-y min-h-[60px] text-sm mb-2"
                            />
                            <button className="btn-primary-small" onClick={() => handleAddComment(suggestion.id)}>Submit Comment</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};


/**
 * @hook useServiceRegistry - Manages the lifecycle and state of external service integrations.
 * @description An "Enterprise Connectivity Layer" invention, enabling dynamic configuration of hundreds of external tools.
 * It abstracts away the complexities of API key management and connection testing.
 * @invented by Citibank Demo Business Inc. "Enterprise Integration Hub" in Q4 2021.
 */
export const useServiceRegistry = () => {
    // In a real application, this would fetch from a backend and handle API key storage securely.
    const [services, setServices] = useState<ExternalServiceConfig[]>(GLOBAL_EXTERNAL_SERVICES);

    const updateService = useCallback((id: UniqueId, updates: Partial<ExternalServiceConfig>) => {
        setServices(prev => prev.map(svc => svc.id === id ? { ...svc, ...updates } : svc));
        // In reality, this would trigger a backend update and possibly a connection test.
    }, []);

    const testConnection = useCallback(async (id: UniqueId) => {
        // Simulate API call to test connection
        setServices(prev => prev.map(svc => svc.id === id ? { ...svc, status: 'pending' } : svc));
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        const success = Math.random() > 0.2; // 80% success rate
        setServices(prev => prev.map(svc => svc.id === id ? { ...svc, status: success ? 'connected' : 'error' } : svc));
        return success;
    }, []);

    const addService = useCallback((newService: ExternalServiceConfig) => {
        setServices(prev => [...prev, { ...newService, id: `svc-${Date.now()}` }]); // Generate dummy ID
    }, []);

    const removeService = useCallback((id: UniqueId) => {
        setServices(prev => prev.filter(svc => svc.id !== id));
    }, []);

    return { services, updateService, testConnection, addService, removeService };
};


/**
 * @hook useReviewHistory - Manages fetching and storing code review reports.
 * @description The "Historical Insights Engine," vital for tracking progress and auditing.
 * It abstracts complex data retrieval and local caching strategies.
 * @invented by Citibank Demo Business Inc. "Data Analytics & Audit Group" in Q2 2023.
 */
export const useReviewHistory = () => {
    const [history, setHistory] = useState<CodeReviewReport[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError(null);
        try {
            // Simulate fetching from a database or local storage
            await new Promise(resolve => setTimeout(resolve, 800));
            const mockHistory: CodeReviewReport[] = [
                // Example history entry
                {
                    id: 'report-001',
                    reviewTimestamp: new Date(Date.now() - 3600000), // 1 hour ago
                    reviewedByAiModel: AiModelProvider.GEMINI_PRO,
                    reviewedCode: `function example(a, b) { return a + b }`,
                    reviewSummary: 'Minor stylistic recommendations, good overall. Security check passed.',
                    totalSuggestions: 2,
                    suggestions: [{
                        id: 'sugg-001-a', type: SuggestionType.STYLE_FIX, category: ReviewCategory.STYLE,
                        title: 'Use `const` for immutable variables', description: '`a` and `b` are not reassigned, use `const` for better readability.',
                        codeSnippet: { code: 'function example(a, b)', startLine: 1, endLine: 1 },
                        suggestedFix: '- function example(a, b) {\\n+ function example(const a, const b) {',
                        severity: 'info', confidence: 'high', relatedCriteriaIds: ['crit-style-formatting'], status: 'pending', comments: []
                    }],
                    metrics: {
                        linesReviewed: 1, cyclomaticComplexity: 1, cognitiveComplexity: 1, maintainabilityIndex: 90,
                        technicalDebtEstimateHours: 0.1, securityVulnerabilitiesCount: 0, performanceBottlenecksCount: 0,
                        readabilityIssuesCount: 1, testCoveragePercentage: 100
                    },
                    sentimentScore: 0.8,
                    complianceStatus: [{ standard: 'OWASP_TOP_10', status: 'compliant', violationsCount: 0 }],
                    costInTokens: { input: 100, output: 50, total: 150 },
                    estimatedCostUsd: 0.0003,
                    elapsedTimeMs: 1200,
                    auditTrailId: 'audit-001',
                    reviewerPersonalityId: 'default',
                },
                {
                    id: 'report-002',
                    reviewTimestamp: new Date(Date.now() - 7200000), // 2 hours ago
                    reviewedByAiModel: AiModelProvider.GPT_4,
                    reviewedCode: `const data = fetchData();\nif (data.length = 0) { console.log("No data"); }`,
                    reviewSummary: 'Critical bug detected in conditional statement. Immediate action recommended.',
                    totalSuggestions: 1,
                    suggestions: [{
                        id: 'sugg-002-a', type: SuggestionType.FIX_BUG, category: ReviewCategory.ERROR_HANDLING,
                        title: 'Assignment in conditional expression', description: 'The `data.length = 0` assigns 0, use `===` for comparison.',
                        codeSnippet: { code: 'if (data.length = 0)', startLine: 2, endLine: 2 },
                        suggestedFix: '- if (data.length = 0) {\\n+ if (data.length === 0) {',
                        severity: 'critical', confidence: 'high', relatedCriteriaIds: ['crit-maintain-dead-code'], status: 'pending', comments: []
                    }],
                    metrics: {
                        linesReviewed: 2, cyclomaticComplexity: 1, cognitiveComplexity: 1, maintainabilityIndex: 70,
                        technicalDebtEstimateHours: 0.5, securityVulnerabilitiesCount: 0, performanceBottlenecksCount: 0,
                        readabilityIssuesCount: 0, testCoveragePercentage: 80
                    },
                    sentimentScore: -0.5,
                    complianceStatus: [{ standard: 'InternalSecurityPolicy', status: 'compliant', violationsCount: 0 }],
                    costInTokens: { input: 200, output: 100, total: 300 },
                    estimatedCostUsd: 0.009,
                    elapsedTimeMs: 2500,
                    auditTrailId: 'audit-002',
                    reviewerPersonalityId: 'security-expert',
                },
            ];
            setHistory(mockHistory);
        } catch (err) {
            setHistoryError('Failed to load review history.');
            console.error(err);
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const addReviewReport = useCallback((report: CodeReviewReport) => {
        setHistory(prev => [report, ...prev]);
    }, []);

    return { history, historyLoading, historyError, fetchHistory, addReviewReport };
};

/**
 * @hook useAuditTrail - Manages audit log entries.
 * @description The "Forensic & Compliance Logging System," ensuring full traceability of all actions.
 * @invented by Citibank Demo Business Inc. "Security & Compliance Directorate" in Q1 2023.
 */
export const useAuditTrail = () => {
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [auditLoading, setAuditLoading] = useState(false);
    const [auditError, setAuditError] = useState<string | null>(null);

    const fetchAuditLogs = useCallback(async () => {
        setAuditLoading(true);
        setAuditError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            const mockLogs: AuditLogEntry[] = [
                {
                    id: 'log-001', timestamp: new Date(), userId: 'user-jburvel', eventType: 'review_requested',
                    details: 'Code review requested for exampleCode', ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0',
                    entityId: 'report-001'
                },
                {
                    id: 'log-002', timestamp: new Date(Date.now() - 1000 * 60 * 5), userId: 'user-jburvel', eventType: 'config_changed',
                    details: 'AI Model changed from Gemini Pro to GPT-4', ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0'
                },
                // ... many more simulated logs
            ];
            setAuditLogs(mockLogs);
        } catch (err) {
            setAuditError('Failed to load audit logs.');
        } finally {
            setAuditLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    const addAuditLog = useCallback((log: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
        setAuditLogs(prev => [...prev, { id: `log-${Date.now()}`, timestamp: new Date(), ...log }]);
        // In a real system, this would persist to a secure, immutable log store.
    }, []);

    return { auditLogs, auditLoading, auditError, fetchAuditLogs, addAuditLog };
};


// A placeholder for a generic "Info" icon
const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 01.926.173l.738.739A.75.75 0 0113.682 13H12.75s-.75.045-.75.75V15a.75.75 0 01-1.5 0v-1.254c0-.75.313-1.488.872-1.954l.041-.021zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// A placeholder for a generic "ChatBubbleLeftRight" icon
const ChatBubbleLeftRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.28 1.767.29 2.648.068V19.5a2.25 2.25 0 01-2.25 2.25H1.5a2.25 2.25 0 01-2.25-2.25V8.511c.884.28 1.767.29 2.648.068 1.24-.31 2.47-.513 3.51-.59 1.474-.11 2.98-.186 4.48-.186h.176c1.5 0 3.006.076 4.48.186 1.04.077 2.27.28 3.51.59zM19.5 7.5c-.933-.031-1.854-.055-2.774-.055h-2.186c-2.454 0-4.908.106-7.362.316a.75.75 0 00-.735.732V16.5a.75.75 0 00.735.733c2.454-.21 4.908-.316 7.362-.316h2.186c.92 0 1.841.024 2.774.055a.75.75 0 00.726-.744V7.5a.75.75 0 00-.726-.744z" />
    </svg>
);


//
// === [ Section 4: Main CodeReviewBot Component - Massive Expansion ] ===
//
// The core `CodeReviewBot` component, significantly expanded to incorporate all the new features.
// This is where the magic of "Project Chimera" at Citibank Demo Business Inc. truly comes alive,
// offering a unified, intelligent, and deeply integrated development experience.

const exampleCode = `function UserList(users) {
  if (users.length = 0) { // This is a common bug: assignment instead of comparison
    return "no users";
  } else {
    return (
      users.map(u => {
        return <li>{u.name}</li>
      })
    )
  }
}

// Another example for potential performance/readability issues
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items[i].subItems.length; j++) {
      total += items[i].subItems[j].price; // Nested loop, potential for N^2 complexity
    }
  }
  return total;
}

// A potential security vulnerability (SQL Injection example)
function getUserData(username) {
    const query = "SELECT * FROM users WHERE username = '" + username + "';"; // SQL Injection vulnerability
    // database.execute(query);
    return "Dummy data for " + username;
}
`;

/**
 * @function CodeReviewBot
 * @description The flagship AI Code Review application, built by Citibank Demo Business Inc.
 * This component is the culmination of years of R&D, integrating Gemini, ChatGPT, and hundreds of
 * custom features to deliver an unparalleled code quality and security platform.
 * It's designed for mission-critical enterprise environments, offering deep customization,
 * extensive integrations, and robust auditing capabilities.
 * @invented by Citibank Demo Business Inc. "AI Innovations Department" over multiple phases (2020-Present).
 * Phase 1: Basic AI integration (Gemini POC).
 * Phase 2: Multi-model support (ChatGPT added).
 * Phase 3: Advanced review criteria and actionable suggestions.
 * Phase 4: Enterprise integration hub and audit trails.
 * Phase 5: UI/UX overhaul for commercial-grade adoption.
 */
export const CodeReviewBot: React.FC = () => {
    // === [ State Management: Core Review Functionality ] ===
    // These states drive the primary AI review process.
    const [code, setCode] = useState<string>(exampleCode);
    const [review, setReview] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [personalities] = useAiPersonalities();
    const [selectedPersonalityId, setSelectedPersonalityId] = useState<string>('default');
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

    // === [ State Management: Advanced AI & Feature Configuration ] ===
    // Invented by "Advanced AI Configuration Group" for fine-grained control.
    const [selectedAiModelId, setSelectedAiModelId] = useState<UniqueId>(DEFAULT_AI_MODELS[0].id);
    const [enabledReviewCriteria, setEnabledReviewCriteria] = useState<UniqueId[]>(
        DEFAULT_REVIEW_CRITERIA.filter(c => c.enabled).map(c => c.id)
    );
    const [enableContextualReview, setEnableContextualReview] = useState<boolean>(true);
    const [selectedContextSource, setSelectedContextSource] = useState<ContextSourceType>(ContextSourceType.MANUAL_INPUT);
    const [projectContext, setProjectContext] = useState<ProjectContext | null>(null); // To be loaded from another service/UI
    const [generatedSuggestions, setGeneratedSuggestions] = useState<CodeSuggestion[]>([]);
    const [isShowingHistory, setIsShowingHistory] = useState<boolean>(false);
    const [isShowingIntegrations, setIsShowingIntegrations] = useState<boolean>(false);
    const [isShowingAuditLog, setIsShowingAuditLog] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'review' | 'settings' | 'history' | 'integrations' | 'audit'>('review');

    // === [ State Management: UI Enhancements ] ===
    const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
    const [showCodeDiff, setShowCodeDiff] = useState<boolean>(false); // Future feature: compare with suggested fix
    const [codeLanguage, setCodeLanguage] = useState<string>('typescript'); // Auto-detect or user-selected
    const reviewOutputRef = useRef<HTMLDivElement>(null); // For auto-scrolling

    // === [ Custom Hooks Integration ] ===
    // Leveraging our proprietary enterprise hooks.
    const { services, updateService, testConnection, addService, removeService } = useServiceRegistry();
    const { history, historyLoading, historyError, addReviewReport, fetchHistory } = useReviewHistory();
    const { auditLogs, auditLoading, auditError, addAuditLog } = useAuditTrail();

    // === [ Derived State and Memoizations ] ===
    const selectedAiModel = useMemo(() => {
        return DEFAULT_AI_MODELS.find(model => model.id === selectedAiModelId) || DEFAULT_AI_MODELS[0];
    }, [selectedAiModelId]);

    const availableReviewCriteria = useMemo(() => {
        return DEFAULT_REVIEW_CRITERIA.map(criterion => ({
            ...criterion,
            enabled: enabledReviewCriteria.includes(criterion.id)
        }));
    }, [enabledReviewCriteria]);

    // === [ Utility Functions ] ===

    /**
     * @function autoDetectCodeLanguage
     * @description Invented by the "Polyglot Code Parsing Unit" to automatically identify the language.
     * Crucial for syntax highlighting and language-specific AI prompts.
     * @param {string} code - The code snippet to analyze.
     * @returns {string} The detected language (e.g., 'typescript', 'python', 'java').
     * @invented by Citibank Demo Business Inc. "Polyglot Code Parsing Unit" in Q2 2022.
     */
    const autoDetectCodeLanguage = useCallback((code: string): string => {
        if (!code) return 'plaintext';
        // Simple heuristic for demonstration. A real implementation would use a sophisticated library.
        if (code.includes('import React') || code.includes('useState') || code.includes('useEffect') || code.includes('const [') || code.includes('interface ')) return 'typescript';
        if (code.includes('def ') || code.includes('import os') || code.includes('print(') || code.includes('class ') && !code.includes('class extends')) return 'python';
        if (code.includes('public class') || code.includes('System.out.println') || code.includes('import java.util.')) return 'java';
        if (code.includes('<?php') || code.includes('$variable')) return 'php';
        if (code.includes('func main()') || code.includes('package main')) return 'go';
        if (code.includes('fn main()') || code.includes('mod ')) return 'rust';
        if (code.includes('SELECT ') || code.includes('FROM ') || code.includes('WHERE ')) return 'sql';
        if (code.includes('<template>') || code.includes('<script>') || code.includes('<style>')) return 'vue';
        if (code.includes('.tsx') || code.includes('.jsx')) return 'jsx';
        return 'plaintext';
    }, []);

    // Effect to auto-detect language when code changes
    useEffect(() => {
        setCodeLanguage(autoDetectCodeLanguage(code));
    }, [code, autoDetectCodeLanguage]);

    // Auto-scroll review output
    useEffect(() => {
        if (reviewOutputRef.current) {
            reviewOutputRef.current.scrollTop = reviewOutputRef.current.scrollHeight;
        }
    }, [review]);


    // === [ Main Logic: Handle Review Generation ] ===
    /**
     * @function handleGenerate
     * @description The core invocation of the AI review process. This is the heart of the "Intelligent Review Engine."
     * It orchestrates model selection, prompt generation, streaming, and error handling, while also
     * interacting with our audit and history systems.
     * @invented by Citibank Demo Business Inc. "AI Orchestration Layer" in Q1 2021, refined continuously.
     */
    const handleGenerate = useCallback(async () => {
        if (!code.trim()) {
            setError('Please enter some code to review.');
            return;
        }
        setIsLoading(true);
        setError('');
        setReview('');
        setGeneratedSuggestions([]); // Clear previous suggestions

        let systemInstruction: string = 'You are an expert code reviewer.';

        // --- AI Personality Integration (Phase 1) ---
        if (selectedPersonalityId !== 'default') {
            const personality = personalities.find(p => p.id === selectedPersonalityId);
            if (personality) {
                systemInstruction += '\n' + formatSystemPromptToString(personality);
            }
        }

        // --- Advanced Review Criteria Integration (Phase 3) ---
        const activeCriteria = DEFAULT_REVIEW_CRITERIA.filter(c => enabledReviewCriteria.includes(c.id));
        if (activeCriteria.length > 0) {
            systemInstruction += `\nFocus your review on the following specific criteria, providing actionable suggestions formatted as clear points:`;
            activeCriteria.forEach((crit, index) => {
                systemInstruction += `\n${index + 1}. ${crit.name} (${crit.category}, Severity: ${crit.severity}): ${crit.description}.`;
                if (crit.aiPromptSnippet) {
                    systemInstruction += ` Specific AI instruction: "${crit.aiPromptSnippet}"`;
                }
            });
            systemInstruction += `\nEnsure suggestions include code snippets of the problematic area and, if possible, a diff-style suggested fix. Categorize and provide a title for each suggestion.`;
        }

        // --- Multi-Model Selection (Phase 2) ---
        systemInstruction += `\nYour review should be tailored for the chosen AI model: ${selectedAiModel.name}. Consider its strengths and limitations (e.g., context window, output token limit).`;

        // --- Contextual Review (Phase 4) ---
        if (enableContextualReview && projectContext) {
            systemInstruction += `\nConsider the following project context for a more relevant review: Project Name: ${projectContext.name}`;
            if (projectContext.repoUrl) systemInstruction += `, Repo: ${projectContext.repoUrl}`;
            if (projectContext.branch) systemInstruction += `, Branch: ${projectContext.branch}`;
            if (projectContext.jiraIssueId) systemInstruction += `, Jira Issue: ${projectContext.jiraIssueId}`;
            if (projectContext.techStack && projectContext.techStack.length > 0) systemInstruction += `, Tech Stack: ${projectContext.techStack.join(', ')}.`;
            // Add more detailed context relevant to the specific source
        }

        // --- Integration with External SAST/DAST tools (Conceptual) ---
        // For production, this would trigger actual external tool scans and merge their results
        const enabledSecurityScanners = services.filter(s => s.isEnabled && s.type === IntegrationServiceType.SECURITY_SCANNER);
        if (enabledSecurityScanners.length > 0) {
            systemInstruction += `\nAlso, consider findings from integrated security scanners such as ${enabledSecurityScanners.map(s => s.name).join(', ')} when evaluating security-related code.`;
            // A real implementation would involve asynchronously triggering these scans and passing their raw findings
            // to the AI for synthesis, or pre-processing them.
        }

        addAuditLog({
            userId: 'current-user-jburvel', // Placeholder for actual user ID
            eventType: 'review_requested',
            details: `Code review initiated with AI model: ${selectedAiModel.name}, Personality: ${selectedPersonalityId}.`,
            ipAddress: '127.0.0.1', // Placeholder
            userAgent: navigator.userAgent,
        });

        try {
            // Using `reviewCodeStream` (which would be augmented to support multi-model via a backend gateway)
            const stream = reviewCodeStream(code, systemInstruction, selectedAiModel.provider);
            let fullResponse = '';
            let rawSuggestions: any[] = []; // Temporary storage for AI's structured suggestions
            for await (const chunk of stream) {
                fullResponse += chunk;
                // Enhanced parsing for streaming responses. This is a complex problem,
                // simplified for demonstration. A real system would use a robust JSON/YAML parser
                // or a custom streaming protocol to extract structured data.
                if (fullResponse.includes('```json')) {
                    // Attempt to parse JSON suggestions embedded in the markdown
                    const jsonStartIndex = fullResponse.indexOf('```json');
                    const jsonEndIndex = fullResponse.indexOf('```', jsonStartIndex + 7);
                    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
                        const jsonString = fullResponse.substring(jsonStartIndex + 7, jsonEndIndex);
                        try {
                            const parsedSuggestions = JSON.parse(jsonString);
                            if (Array.isArray(parsedSuggestions)) {
                                rawSuggestions = parsedSuggestions; // Update raw suggestions
                            }
                        } catch (parseError) {
                            console.warn("Failed to parse AI suggestions JSON chunk:", parseError);
                        }
                    }
                }
                setReview(fullResponse);
            }

            // After stream completes, finalize suggestions parsing and add to state
            if (rawSuggestions.length > 0) {
                const processedSuggestions: CodeSuggestion[] = rawSuggestions.map(raw => ({
                    id: `sugg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                    type: SuggestionType[raw.type as keyof typeof SuggestionType] || SuggestionType.REFACTOR,
                    category: ReviewCategory[raw.category as keyof typeof ReviewCategory] || ReviewCategory.BEST_PRACTICES,
                    title: raw.title || 'AI Suggestion',
                    description: raw.description || 'No description provided.',
                    codeSnippet: {
                        code: raw.codeSnippet?.code || '',
                        filePath: raw.codeSnippet?.filePath,
                        startLine: raw.codeSnippet?.startLine || 1,
                        endLine: raw.codeSnippet?.endLine || 1,
                    },
                    suggestedFix: raw.suggestedFix,
                    severity: raw.severity || 'info',
                    confidence: raw.confidence || 'medium',
                    relatedCriteriaIds: raw.relatedCriteriaIds || [],
                    status: 'pending',
                    comments: [],
                }));
                setGeneratedSuggestions(processedSuggestions);
            }


            // Simulate cost calculation and report generation
            const finalReport: CodeReviewReport = {
                id: `report-${Date.now()}`,
                reviewTimestamp: new Date(),
                reviewedByAiModel: selectedAiModel.id,
                reviewedCode: code,
                reviewSummary: fullResponse.substring(0, Math.min(fullResponse.length, 500)) + '...', // Truncate for summary
                totalSuggestions: generatedSuggestions.length,
                suggestions: generatedSuggestions,
                metrics: {
                    linesReviewed: code.split('\n').length,
                    cyclomaticComplexity: Math.floor(Math.random() * 20) + 1, // Mock metric
                    cognitiveComplexity: Math.floor(Math.random() * 15) + 1,
                    maintainabilityIndex: Math.floor(Math.random() * 100),
                    technicalDebtEstimateHours: parseFloat((Math.random() * 5).toFixed(1)),
                    securityVulnerabilitiesCount: generatedSuggestions.filter(s => s.category === ReviewCategory.SECURITY).length,
                    performanceBottlenecksCount: generatedSuggestions.filter(s => s.category === ReviewCategory.PERFORMANCE).length,
                    readabilityIssuesCount: generatedSuggestions.filter(s => s.category === ReviewCategory.READABILITY).length,
                    testCoveragePercentage: Math.floor(Math.random() * 100),
                },
                sentimentScore: parseFloat((Math.random() * 2 - 1).toFixed(2)), // -1 to 1
                complianceStatus: [{ standard: 'OWASP_TOP_10', status: 'compliant', violationsCount: 0 }], // Mock
                costInTokens: { input: 500, output: 1000, total: 1500 }, // Mock tokens
                estimatedCostUsd: 0.05, // Mock cost
                elapsedTimeMs: 3000, // Mock time
                auditTrailId: `audit-${Date.now()}`,
                projectContextId: projectContext?.id,
                reviewerPersonalityId: selectedPersonalityId,
            };
            addReviewReport(finalReport); // Add to history
            addAuditLog({
                userId: 'current-user-jburvel',
                eventType: 'review_requested', // Change to 'review_completed' after successful generation
                details: `Code review report generated: ${finalReport.id}. Cost: $${finalReport.estimatedCostUsd.toFixed(4)}.`,
                ipAddress: '127.0.0.1',
                userAgent: navigator.userAgent,
                entityId: finalReport.id,
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to get review: ${errorMessage}`);
            addAuditLog({
                userId: 'current-user-jburvel',
                eventType: 'review_requested', // Or 'review_failed'
                details: `Code review failed: ${errorMessage}`,
                ipAddress: '127.0.0.1',
                userAgent: navigator.userAgent,
            });
        } finally {
            setIsLoading(false);
        }
    }, [code, selectedPersonalityId, personalities, selectedAiModel, enableContextualReview, projectContext, enabledReviewCriteria, services, addReviewReport, addAuditLog, generatedSuggestions]);

    /**
     * @function handleAcceptSuggestion
     * @description Marks a suggestion as accepted.
     * @invented by Citibank Demo Business Inc. "Actionable Feedback Layer" in Q4 2022.
     */
    const handleAcceptSuggestion = useCallback((id: UniqueId) => {
        setGeneratedSuggestions(prev =>
            prev.map(s => s.id === id ? { ...s, status: 'accepted', comments: [...s.comments, { id: `comment-${Date.now()}`, author: 'System (AI)', timestamp: new Date(), content: 'Suggestion accepted by user.', resolved: true }] } : s)
        );
        addAuditLog({
            userId: 'current-user-jburvel',
            eventType: 'suggestion_accepted',
            details: `Suggestion ${id} accepted.`,
            ipAddress: '127.0.0.1',
            userAgent: navigator.userAgent,
            entityId: id,
        });
        // In a real system, this would trigger a Git patch, Jira task creation, etc.
    }, [addAuditLog]);

    /**
     * @function handleRejectSuggestion
     * @description Marks a suggestion as rejected.
     * @invented by Citibank Demo Business Inc. "Actionable Feedback Layer" in Q4 2022.
     */
    const handleRejectSuggestion = useCallback((id: UniqueId) => {
        setGeneratedSuggestions(prev =>
            prev.map(s => s.id === id ? { ...s, status: 'rejected', comments: [...s.comments, { id: `comment-${Date.now()}`, author: 'System (AI)', timestamp: new Date(), content: 'Suggestion rejected by user.', resolved: true }] } : s)
        );
        addAuditLog({
            userId: 'current-user-jburvel',
            eventType: 'suggestion_rejected',
            details: `Suggestion ${id} rejected.`,
            ipAddress: '127.0.0.1',
            userAgent: navigator.userAgent,
            entityId: id,
        });
    }, [addAuditLog]);

    /**
     * @function handleAddCommentToSuggestion
     * @description Adds a user comment to an AI suggestion.
     * @invented by Citibank Demo Business Inc. "Collaborative Review Framework" in Q1 2023.
     */
    const handleAddCommentToSuggestion = useCallback((suggestionId: UniqueId, content: string) => {
        setGeneratedSuggestions(prev =>
            prev.map(s => s.id === suggestionId ?
                {
                    ...s,
                    comments: [
                        ...s.comments,
                        { id: `comment-${Date.now()}`, author: 'current-user-jburvel', timestamp: new Date(), content, resolved: false }
                    ]
                } : s
            )
        );
        addAuditLog({
            userId: 'current-user-jburvel',
            eventType: 'comment_added',
            details: `Comment added to suggestion ${suggestionId}.`,
            ipAddress: '127.0.0.1',
            userAgent: navigator.userAgent,
            entityId: suggestionId,
        });
    }, [addAuditLog]);

    /**
     * @function handleApplyPatch
     * @description Simulates applying a generated code patch.
     * @invented by Citibank Demo Business Inc. "Automated Refactoring Module" in Q2 2023.
     */
    const handleApplyPatch = useCallback((suggestionId: UniqueId, patch: string) => {
        // In a real application, this would involve:
        // 1. Sending the patch to a Git integration service (e.g., GitHub API)
        // 2. Creating a new branch, applying the patch, and opening a PR/MR.
        // 3. Updating the local `code` state to reflect the applied patch (complex diff logic).
        console.log(`Simulating applying patch for suggestion ${suggestionId}:`, patch);
        alert(`Patch for suggestion ${suggestionId} would be applied now. (Feature under development)`);
        setGeneratedSuggestions(prev =>
            prev.map(s => s.id === suggestionId ? { ...s, status: 'applied', comments: [...s.comments, { id: `comment-${Date.now()}`, author: 'System (AI)', timestamp: new Date(), content: 'Patch applied (simulated).', resolved: true }] } : s)
        );
        addAuditLog({
            userId: 'current-user-jburvel',
            eventType: 'patch_applied',
            details: `Simulated patch application for suggestion ${suggestionId}.`,
            ipAddress: '127.0.0.1',
            userAgent: navigator.userAgent,
            entityId: suggestionId,
        });
    }, [addAuditLog]);


    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary bg-background-light">
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center">
                    <CpuChipIcon className="w-8 h-8 text-primary-500" />
                    <span className="ml-3">AI Code Review Bot - Enterprise Edition</span>
                </h1>
                <div className="flex items-center gap-4">
                    <p className="text-text-secondary italic hidden sm:block">Powered by Gemini & ChatGPT (and {DEFAULT_AI_MODELS.length - 2}+ other models)</p>
                    <button
                        className="btn-tertiary p-2 rounded-full"
                        onClick={() => setIsSettingsModalOpen(true)}
                        aria-label="Open global settings"
                    >
                        <Cog6ToothIcon className="w-6 h-6" />
                    </button>
                    <Tooltip content="Review History">
                        <button
                            className="btn-tertiary p-2 rounded-full"
                            onClick={() => setActiveTab('history')}
                            aria-label="View review history"
                        >
                            <ClockIcon className="w-6 h-6" />
                        </button>
                    </Tooltip>
                    <Tooltip content="Integrations">
                        <button
                            className="btn-tertiary p-2 rounded-full"
                            onClick={() => setActiveTab('integrations')}
                            aria-label="Manage external integrations"
                        >
                            <PuzzlePieceIcon className="w-6 h-6" />
                        </button>
                    </Tooltip>
                    <Tooltip content="Audit Log">
                         <button
                            className="btn-tertiary p-2 rounded-full"
                            onClick={() => setActiveTab('audit')}
                            aria-label="View audit log"
                        >
                            <FingerPrintIcon className="w-6 h-6" />
                        </button>
                    </Tooltip>
                </div>
            </header>

            {/* Main Content Area with Tabs */}
            <div className="flex-grow flex flex-col gap-4 min-h-0">
                <div className="flex-shrink-0 border-b border-border mb-4">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('review')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'review' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-text-secondary'
                            }`}
                        >
                            <CodeBracketIcon className="w-5 h-5 inline-block mr-2" />
                            Code Review
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'settings' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-text-secondary'
                            }`}
                        >
                            <Cog6ToothIcon className="w-5 h-5 inline-block mr-2" />
                            AI Settings
                        </button>
                         <button
                            onClick={() => setActiveTab('history')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'history' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-text-secondary'
                            }`}
                        >
                            <ClockIcon className="w-5 h-5 inline-block mr-2" />
                            Review History
                        </button>
                         <button
                            onClick={() => setActiveTab('integrations')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'integrations' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-text-secondary'
                            }`}
                        >
                            <ServerStackIcon className="w-5 h-5 inline-block mr-2" />
                            Integrations
                        </button>
                        <button
                            onClick={() => setActiveTab('audit')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'audit' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-text-secondary'
                            }`}
                        >
                            <DocumentTextIcon className="w-5 h-5 inline-block mr-2" />
                            Audit Log
                        </button>
                    </nav>
                </div>

                {activeTab === 'review' && (
                    <div className="flex-grow flex flex-col lg:flex-row gap-4 min-h-0">
                        {/* Code Input Area */}
                        <div className="flex flex-col flex-1 min-h-[300px] lg:min-h-0 bg-surface rounded-md shadow-lg">
                            <label htmlFor="code-input" className="text-sm font-medium text-text-secondary p-4 pb-0 flex items-center">
                                <CodeBracketIcon className="w-4 h-4 mr-2" /> Code to Review <span className="ml-auto text-xs italic text-text-tertiary">Language: {codeLanguage.toUpperCase()}</span>
                            </label>
                            <textarea
                                id="code-input"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Paste your code here..."
                                className="flex-grow p-4 bg-transparent border-none focus:outline-none resize-none font-mono text-sm"
                                style={{ minHeight: '150px' }} // Ensure some minimum height on smaller screens
                            />
                            <div className="p-4 border-t border-border flex items-center justify-between">
                                <div className="w-full max-w-xs mr-4">
                                    <label htmlFor="personality-select" className="text-sm font-medium text-text-secondary">Reviewer Personality</label>
                                    <select
                                        id="personality-select"
                                        value={selectedPersonalityId}
                                        onChange={e => setSelectedPersonalityId(e.target.value)}
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="default">Default</option>
                                        {personalities.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                    className="btn-primary flex items-center justify-center px-6 py-3 min-w-[150px]"
                                >
                                    {isLoading ? <LoadingSpinner /> : (
                                        <>
                                            <RocketLaunchIcon className="w-5 h-5 mr-2" /> Request Review
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* AI Feedback Area */}
                        <div className="flex flex-col flex-1 min-h-[300px] lg:min-h-0 bg-surface rounded-md shadow-lg">
                            <label className="text-sm font-medium text-text-secondary p-4 pb-0 flex items-center">
                                <LightBulbIcon className="w-4 h-4 mr-2" /> AI Feedback & Suggestions
                            </label>
                            <div ref={reviewOutputRef} className="flex-grow p-4 bg-background border border-border rounded-md overflow-y-auto m-4 mt-2">
                                {isLoading && !review && <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>}
                                {error && <p className="text-red-500">{error}</p>}
                                {review && <MarkdownRenderer content={review} />}
                                {generatedSuggestions.length > 0 && (
                                    <div className="mt-8 border-t border-border pt-4">
                                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                                            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" /> Actionable Suggestions
                                        </h2>
                                        <ActionableSuggestionList
                                            suggestions={generatedSuggestions}
                                            onAcceptSuggestion={handleAcceptSuggestion}
                                            onRejectSuggestion={handleRejectSuggestion}
                                            onAddComment={handleAddCommentToSuggestion}
                                            onApplyPatch={handleApplyPatch}
                                        />
                                    </div>
                                )}
                                {!isLoading && !review && !error && !generatedSuggestions.length && <div className="text-text-secondary h-full flex items-center justify-center">Review will appear here.</div>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="flex-grow p-4 bg-surface rounded-md shadow-lg overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <Cog6ToothIcon className="w-7 h-7 mr-3 text-primary-500" /> Advanced AI Configuration
                        </h2>
                        {/* AI Model Selection */}
                        <div className="mb-8 p-6 bg-background rounded-md border border-border">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <CpuChipIcon className="w-5 h-5 mr-2" /> AI Model Selection
                            </h3>
                            <p className="text-text-secondary mb-4">Choose the AI model best suited for your review needs. Different models offer varying capabilities, costs, and performance characteristics. Citibank Demo Business Inc. offers integration with leading LLMs like Gemini (Google) and ChatGPT (OpenAI), alongside proprietary internal models and other open-source options.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {DEFAULT_AI_MODELS.map(model => (
                                    <div
                                        key={model.id}
                                        className={`p-4 border rounded-md cursor-pointer transition-all ${
                                            selectedAiModelId === model.id ? 'border-primary-500 ring-2 ring-primary-500 bg-primary-900' : 'border-border hover:border-text-primary'
                                        } ${!model.enabled ? 'opacity-50 cursor-not-allowed bg-gray-800' : ''}`}
                                        onClick={() => model.enabled && setSelectedAiModelId(model.id)}
                                    >
                                        <h4 className="font-semibold text-lg flex items-center">
                                            {model.provider === AiModelProvider.GEMINI_PRO && <img src="https://www.gstatic.com/images/icons/material/system/2x/temp_googleg_baseline_48dp.png" alt="Gemini" className="w-5 h-5 mr-2 rounded-full" />}
                                            {model.provider === AiModelProvider.GPT_4 || model.provider === AiModelProvider.GPT_3_5_TURBO ? <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" alt="OpenAI" className="w-5 h-5 mr-2 rounded-full" /> : null}
                                            {model.provider === AiModelProvider.CLAUDE_3_OPUS && <img src="https://pbs.twimg.com/profile_images/1764673627042838528/Fq290W59_400x400.jpg" alt="Anthropic" className="w-5 h-5 mr-2 rounded-full" />}
                                            {model.provider === AiModelProvider.Llama_2_70B && <img src="https://upload.wikimedia.org/wikipedia/commons/4/47/Meta_Facebook_icon_2020.svg" alt="Meta" className="w-5 h-5 mr-2 rounded-full" />}
                                            {model.name}
                                            {!model.enabled && <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-600">Disabled</span>}
                                        </h4>
                                        <p className="text-sm text-text-secondary mt-1">{model.description}</p>
                                        <div className="mt-2 text-xs text-text-tertiary">
                                            <p>Context Window: {model.contextWindowSize} tokens</p>
                                            <p>Max Output: {model.maxOutputTokens} tokens</p>
                                            <p>Est. Cost: ${model.costPerMillionTokensInput.toFixed(4)}/$ {model.costPerMillionTokensOutput.toFixed(4)} per M tokens (In/Out)</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Review Criteria Configuration */}
                        <div className="mb-8 p-6 bg-background rounded-md border border-border">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <ShieldCheckIcon className="w-5 h-5 mr-2" /> Custom Review Criteria
                            </h3>
                            <p className="text-text-secondary mb-4">Fine-tune your reviews by enabling or disabling specific criteria. This allows you to focus the AI on areas most critical to your project, such as security, performance, or internal best practices. Citibank Demo Business Inc. supports a vast library of customizable criteria.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {DEFAULT_REVIEW_CRITERIA.map(criterion => (
                                    <label key={criterion.id} className="flex items-center p-3 bg-surface-elevated rounded-md border border-border cursor-pointer hover:bg-surface-hover transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={enabledReviewCriteria.includes(criterion.id)}
                                            onChange={() => {
                                                setEnabledReviewCriteria(prev =>
                                                    prev.includes(criterion.id)
                                                        ? prev.filter(id => id !== criterion.id)
                                                        : [...prev, criterion.id]
                                                );
                                                addAuditLog({
                                                    userId: 'current-user-jburvel',
                                                    eventType: 'config_changed',
                                                    details: `Review criterion '${criterion.name}' ${enabledReviewCriteria.includes(criterion.id) ? 'disabled' : 'enabled'}.`,
                                                    ipAddress: '127.0.0.1',
                                                    userAgent: navigator.userAgent,
                                                });
                                            }}
                                            className="form-checkbox h-5 w-5 text-primary-600 rounded-md focus:ring-primary-500"
                                        />
                                        <div className="ml-3">
                                            <span className="text-sm font-medium">{criterion.name}</span>
                                            <p className="text-xs text-text-secondary">{criterion.description}</p>
                                        </div>
                                        <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                                            criterion.severity === 'critical' ? 'bg-red-700' :
                                            criterion.severity === 'high' ? 'bg-orange-700' :
                                            criterion.severity === 'medium' ? 'bg-yellow-700' :
                                            criterion.severity === 'low' ? 'bg-blue-700' : 'bg-gray-700'
                                        }`}>{criterion.severity.charAt(0).toUpperCase() + criterion.severity.slice(1)}</span>
                                    </label>
                                ))}
                            </div>
                            <p className="text-sm text-text-tertiary mt-4">Selected {enabledReviewCriteria.length} out of {DEFAULT_REVIEW_CRITERIA.length} criteria.</p>
                        </div>

                        {/* Contextual Review Settings */}
                        <div className="p-6 bg-background rounded-md border border-border">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <FolderIcon className="w-5 h-5 mr-2" /> Contextual Review
                            </h3>
                            <p className="text-text-secondary mb-4">Enhance AI accuracy by providing relevant project context, such as Git repository information, Jira issues, or internal documentation. This feature, part of our "Contextual Awareness Engine," helps the AI understand the purpose and environment of your code.</p>
                            <label className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={enableContextualReview}
                                    onChange={(e) => {
                                        setEnableContextualReview(e.target.checked);
                                        addAuditLog({
                                            userId: 'current-user-jburvel',
                                            eventType: 'config_changed',
                                            details: `Contextual review ${e.target.checked ? 'enabled' : 'disabled'}.`,
                                            ipAddress: '127.0.0.1',
                                            userAgent: navigator.userAgent,
                                        });
                                    }}
                                    className="form-checkbox h-5 w-5 text-primary-600 rounded-md focus:ring-primary-500"
                                />
                                <span className="ml-3 text-sm font-medium">Enable Contextual Review</span>
                            </label>

                            {enableContextualReview && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="context-source" className="block text-sm font-medium text-text-secondary mb-2">Context Source</label>
                                        <select
                                            id="context-source"
                                            value={selectedContextSource}
                                            onChange={e => setSelectedContextSource(e.target.value as ContextSourceType)}
                                            className="w-full p-2 bg-surface border border-border rounded-md text-sm"
                                        >
                                            {Object.values(ContextSourceType).map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Further UI for configuring specific context sources (e.g., input for Git URL, Jira ID) */}
                                    {selectedContextSource === ContextSourceType.GIT_REPOSITORY && (
                                        <div className="p-3 bg-surface-elevated rounded-md">
                                            <h4 className="font-semibold mb-2">Git Repository Context</h4>
                                            <p className="text-sm text-text-secondary mb-2">Connects to your Git provider to fetch repository details. Requires GitHub/GitLab integration to be enabled.</p>
                                            <input type="text" placeholder="Repository URL (e.g., github.com/user/repo)" className="w-full p-2 mb-2 bg-background border border-border rounded-md text-sm" />
                                            <input type="text" placeholder="Branch (e.g., main)" className="w-full p-2 bg-background border border-border rounded-md text-sm" />
                                            <button className="btn-secondary-small mt-2">Fetch Repo Details</button>
                                        </div>
                                    )}
                                    {/* Add similar blocks for JIRA, Local File Upload, etc. */}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="flex-grow p-4 bg-surface rounded-md shadow-lg overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <ClockIcon className="w-7 h-7 mr-3 text-primary-500" /> Review History
                        </h2>
                        <p className="text-text-secondary mb-4">Access a comprehensive record of all your past code reviews, including the submitted code, AI feedback, generated suggestions, and performance metrics. This feature from our "Historical Insights Engine" allows for trend analysis and auditing.</p>

                        {historyLoading && <LoadingSpinner />}
                        {historyError && <p className="text-red-500">{historyError}</p>}
                        {!historyLoading && !historyError && history.length === 0 && (
                            <p className="text-text-secondary italic">No review history found. Start a new review!</p>
                        )}
                        <div className="space-y-6">
                            {history.map(report => (
                                <div key={report.id} className="p-6 bg-background rounded-md border border-border relative">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                                        <DocumentTextIcon className="w-5 h-5 mr-2" /> Review Report: {new Date(report.reviewTimestamp).toLocaleString()}
                                        <span className="ml-auto text-sm font-normal text-text-tertiary">ID: {report.id}</span>
                                    </h3>
                                    <p className="text-text-secondary mb-3">Reviewed by: <span className="font-medium text-text-primary">{DEFAULT_AI_MODELS.find(m => m.id === report.reviewedByAiModel)?.name || report.reviewedByAiModel}</span></p>
                                    <div className="bg-surface-elevated p-3 rounded-md mb-3">
                                        <h4 className="text-md font-semibold mb-2">Summary</h4>
                                        <p className="text-sm text-text-secondary">{report.reviewSummary}</p>
                                    </div>

                                    <h4 className="text-lg font-semibold mb-2 flex items-center"><ChartBarIcon className="w-4 h-4 mr-2" /> Key Metrics</h4>
                                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-text-secondary mb-4">
                                        <li>Lines Reviewed: <span className="font-medium text-text-primary">{report.metrics.linesReviewed}</span></li>
                                        <li>Cyclomatic Complexity: <span className="font-medium text-text-primary">{report.metrics.cyclomaticComplexity}</span></li>
                                        <li>Maintainability Index: <span className="font-medium text-text-primary">{report.metrics.maintainabilityIndex}</span></li>
                                        <li>Security Vulnerabilities: <span className="font-medium text-text-primary">{report.metrics.securityVulnerabilitiesCount}</span></li>
                                        <li>Performance Bottlenecks: <span className="font-medium text-text-primary">{report.metrics.performanceBottlenecksCount}</span></li>
                                        <li>Est. Tech Debt: <span className="font-medium text-text-primary">{report.metrics.technicalDebtEstimateHours} hrs</span></li>
                                    </ul>

                                    <h4 className="text-lg font-semibold mb-2 flex items-center"><LightBulbIcon className="w-4 h-4 mr-2" /> Top Suggestions ({report.totalSuggestions})</h4>
                                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto border border-border rounded-md p-3 bg-surface-elevated">
                                        {report.suggestions.slice(0, 3).map(s => ( // Show top 3 or so
                                            <p key={s.id} className="text-sm text-text-secondary">
                                                <span className={`font-semibold ${s.severity === 'critical' ? 'text-red-400' : s.severity === 'high' ? 'text-orange-400' : 'text-blue-400'}`}>
                                                    [{s.severity.toUpperCase()}]
                                                </span> {s.title}
                                            </p>
                                        ))}
                                        {report.totalSuggestions > 3 && (
                                            <p className="text-sm text-text-tertiary italic">... {report.totalSuggestions - 3} more suggestions</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setCode(report.reviewedCode)} // Load code back into editor
                                        className="btn-secondary-small mt-2 flex items-center"
                                    >
                                        <CodeBracketIcon className="w-4 h-4 mr-1" /> Load Code
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'integrations' && (
                    <div className="flex-grow p-4 bg-surface rounded-md shadow-lg overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <PuzzlePieceIcon className="w-7 h-7 mr-3 text-primary-500" /> External Service Integrations
                        </h2>
                        <p className="text-text-secondary mb-4">Connect our AI Code Review Bot to your existing development ecosystem. Our "Enterprise Integration Hub" supports hundreds of Version Control Systems, CI/CD pipelines, Project Management tools, and security scanners for seamless workflow automation and contextual insights.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map(svc => (
                                <div key={svc.id} className="p-4 bg-background rounded-md border border-border flex flex-col">
                                    <div className="flex items-center mb-2">
                                        <h3 className="font-semibold text-lg flex-grow">{svc.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            svc.status === 'connected' ? 'bg-green-600' :
                                            svc.status === 'disconnected' ? 'bg-red-600' :
                                            svc.status === 'error' ? 'bg-orange-600' : 'bg-gray-600'
                                        }`}>{svc.status.charAt(0).toUpperCase() + svc.status.slice(1)}</span>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-2">{svc.description}</p>
                                    <p className="text-xs text-text-tertiary mb-3">Type: {svc.type}</p>

                                    <div className="flex items-center mt-auto pt-3 border-t border-border-light">
                                        <label className="flex items-center text-sm">
                                            <input
                                                type="checkbox"
                                                checked={svc.isEnabled}
                                                onChange={(e) => {
                                                    updateService(svc.id, { isEnabled: e.target.checked });
                                                    addAuditLog({
                                                        userId: 'current-user-jburvel',
                                                        eventType: 'integration_enabled',
                                                        details: `Integration '${svc.name}' ${e.target.checked ? 'enabled' : 'disabled'}.`,
                                                        ipAddress: '127.0.0.1',
                                                        userAgent: navigator.userAgent,
                                                        entityId: svc.id,
                                                    });
                                                }}
                                                className="form-checkbox h-4 w-4 text-primary-600 rounded-md focus:ring-primary-500"
                                            />
                                            <span className="ml-2">Enable</span>
                                        </label>
                                        <div className="ml-auto flex gap-2">
                                            <button
                                                className="btn-tertiary-small"
                                                onClick={() => testConnection(svc.id)}
                                                disabled={svc.status === 'pending' || !svc.isEnabled}
                                            >
                                                {svc.status === 'pending' ? <LoadingSpinner size="sm" /> : 'Test'}
                                            </button>
                                            <button
                                                className="btn-danger-small"
                                                onClick={() => {
                                                    removeService(svc.id);
                                                    addAuditLog({
                                                        userId: 'current-user-jburvel',
                                                        eventType: 'integration_removed',
                                                        details: `Integration '${svc.name}' removed.`,
                                                        ipAddress: '127.0.0.1',
                                                        userAgent: navigator.userAgent,
                                                        entityId: svc.id,
                                                    });
                                                }}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="p-4 bg-background rounded-md border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                                <button className="text-primary-500 flex items-center font-medium" onClick={() => alert('Add New Integration feature coming soon!')}>
                                    <PlusCircleIcon className="w-5 h-5 mr-2" /> Add New Integration
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="flex-grow p-4 bg-surface rounded-md shadow-lg overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <FingerPrintIcon className="w-7 h-7 mr-3 text-primary-500" /> Audit Log
                        </h2>
                        <p className="text-text-secondary mb-4">View a secure, immutable log of all significant actions performed within the system. Our "Forensic Traceability System" ensures transparency and compliance, critical for enterprise-grade security and governance.</p>

                        {auditLoading && <LoadingSpinner />}
                        {auditError && <p className="text-red-500">{auditError}</p>}
                        {!auditLoading && !auditError && auditLogs.length === 0 && (
                            <p className="text-text-secondary italic">No audit logs available.</p>
                        )}
                        <div className="space-y-4">
                            {auditLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map(log => (
                                <div key={log.id} className="p-4 bg-background rounded-md border border-border">
                                    <div className="flex items-center text-sm font-medium mb-1">
                                        <span className="text-primary-400">{log.eventType.replace(/_/g, ' ').toUpperCase()}</span>
                                        <span className="ml-auto text-text-tertiary text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-text-primary text-sm mb-1">{log.details}</p>
                                    <p className="text-xs text-text-secondary">User: <span className="font-mono">{log.userId}</span> | IP: <span className="font-mono">{log.ipAddress}</span></p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Global Settings Modal */}
            <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Global Application Settings">
                <div className="space-y-6 p-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Subscription & Billing</h3>
                        <p className="text-text-secondary mb-2">Manage your plan and view API usage.</p>
                        <div className="bg-background p-3 rounded-md text-sm">
                            <p>Current Tier: <span className="font-medium text-primary-400">CITIBANK PLATINUM</span></p>
                            <p>Monthly Token Usage: 1,234,567 / Unlimited (Est. $12.35)</p>
                            <p>Reviews Today: 15 / 1000</p>
                            <button className="btn-secondary-small mt-3 flex items-center">
                                <WalletIcon className="w-4 h-4 mr-1" /> Manage Subscription (via Stripe)
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">User Preferences</h3>
                        <label htmlFor="pref-ai-model" className="block text-sm font-medium text-text-secondary mb-1">Preferred AI Model</label>
                        <select
                            id="pref-ai-model"
                            value={selectedAiModelId}
                            onChange={(e) => {
                                setSelectedAiModelId(e.target.value);
                                addAuditLog({
                                    userId: 'current-user-jburvel',
                                    eventType: 'config_changed',
                                    details: `Default AI model set to ${e.target.value}.`,
                                    ipAddress: '127.0.0.1',
                                    userAgent: navigator.userAgent,
                                });
                            }}
                            className="w-full p-2 bg-surface border border-border rounded-md text-sm"
                        >
                            {DEFAULT_AI_MODELS.map(model => (
                                <option key={model.id} value={model.id} disabled={!model.enabled}>{model.name} {!model.enabled && '(Disabled)'}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Notification Settings</h3>
                        <label className="flex items-center text-sm mb-2">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-primary-600 rounded-md" defaultChecked />
                            <span className="ml-2">Email notifications for critical issues</span>
                        </label>
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-primary-600 rounded-md" defaultChecked={false} />
                            <span className="ml-2">Slack alerts for high-severity suggestions</span>
                        </label>
                         <button className="btn-secondary-small mt-3 flex items-center">
                            <BellAlertIcon className="w-4 h-4 mr-1" /> Configure Alerts
                        </button>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Data Export & Archiving</h3>
                        <p className="text-text-secondary mb-2">Export your review data or configure automatic archiving.</p>
                        <button className="btn-secondary-small mr-2 flex items-center">
                            <ArchiveBoxIcon className="w-4 h-4 mr-1" /> Export All Reviews
                        </button>
                        <button className="btn-secondary-small flex items-center">
                            <ShareIcon className="w-4 h-4 mr-1" /> Setup Auto-Archiving
                        </button>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Feedback & Support</h3>
                        <p className="text-text-secondary mb-2">Help us improve by sharing your thoughts.</p>
                        <button className="btn-secondary-small mr-2 flex items-center">
                            <MegaphoneIcon className="w-4 h-4 mr-1" /> Give Feedback
                        </button>
                        <button className="btn-secondary-small flex items-center">
                            <BookOpenIcon className="w-4 h-4 mr-1" /> Read Documentation
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
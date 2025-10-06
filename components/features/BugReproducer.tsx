// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { generateBugReproductionTestStream, generateFixSuggestionStream, analyzeCodeForVulnerabilitiesStream, getCodeContextFromAI, orchestrateMultiModelAIResponse, generateSecurityAuditReport } from '../../services/aiService.ts'; // Assuming these new AI services exist
import { BugAntIcon, CodeBracketSquareIcon, CommandLineIcon, BoltIcon, CloudArrowUpIcon, PuzzlePieceIcon, ShareIcon, HistoryIcon, Cog6ToothIcon, ShieldCheckIcon, PresentationChartLineIcon, BookOpenIcon, MegaphoneIcon, RocketLaunchIcon, CubeTransparentIcon, GlobeAltIcon, PaperClipIcon, LinkIcon, ClipboardDocumentIcon, KeyIcon } from '../icons.tsx'; // Assuming new icons exist
import { LoadingSpinner, MarkdownRenderer, DiffViewer, TabbedContainer, NotificationToast, CodeEditor, Dropdown, Modal, ConfirmDialog, ToggleSwitch } from '../shared/index.tsx'; // Assuming new shared components exist
import { ProjectConfiguration, BugReport, AICostEstimate, UserActivityLog, CollaborationSession, WorkflowDefinition, ModelPerformanceMetric } from '../../types/global.d.ts'; // Assuming new types exist

/**
 * @typedef {Object} FeatureFlag
 * @property {string} name - The name of the feature flag.
 * @property {boolean} isEnabled - Whether the feature is enabled.
 * @property {string} description - A brief description of the feature.
 * @property {('alpha'|'beta'|'ga')} status - The release status of the feature.
 */

// --- GLOBAL CONFIGURATION & FEATURE FLAGS ---
// This section represents a centralized configuration service, allowing for dynamic control
// over the application's capabilities, A/B testing, and phased rollouts.
// In a true commercial-grade system, this would be fetched from a dedicated microservice.
export const GLOBAL_APP_CONFIG = {
    MAX_AI_TOKEN_LIMIT: 4096, // Controls the maximum context size sent to AI models.
    DEFAULT_AI_MODEL: 'Gemini-Pro-1.5-Flash', // The primary AI model for general tasks.
    SECURITY_SCANNER_MODEL: 'OpenAI-GPT-4o-Mini', // Specialized AI for security analysis.
    PERFORMANCE_ANALYZE_MODEL: 'Anthropic-Claude-3.5-Sonnet', // Specialized AI for performance.
    MAX_CONCURRENT_AI_REQUESTS: 5, // Throttling AI API calls for cost and rate limit management.
    ENABLE_REALTIME_COLLABORATION: true,
    ENABLE_GIT_INTEGRATION: true,
    ENABLE_JIRA_INTEGRATION: true,
    ENABLE_SLACK_NOTIFICATIONS: true,
    ENABLE_COST_ESTIMATION: true,
    ENABLE_PROMPT_OPTIMIZATION_SERVICE: true,
    ENABLE_TELEMETRY: true,
    ENABLE_BUG_HISTORY: true,
    ENABLE_WORKFLOW_AUTOMATION: true,
    DEFAULT_GENERATED_TEST_FRAMEWORK: 'Jest',
    MAX_FILE_UPLOAD_SIZE_MB: 10,
    ENABLE_AI_AGENT_AUTONOMY_LEVEL: 3, // 0: fully manual, 5: fully autonomous
};

/**
 * @constant {FeatureFlag[]}
 * @description Manages the availability and status of various advanced features within the BugReproducer platform.
 * This array simulates a robust feature flag management system, crucial for A/B testing,
 * gradual rollouts, and enabling/disabling features without code deployments.
 * Invented by: James Burvel O'Callaghan III, during the Citibank Demo Business Inc. Hackathon of 2024.
 */
export const FEATURE_FLAGS: FeatureFlag[] = [
    { name: 'aiFixSuggestion', isEnabled: true, description: 'Enables AI to suggest code fixes.', status: 'ga' },
    { name: 'securityAudit', isEnabled: true, description: 'Enables AI-driven security vulnerability detection.', status: 'beta' },
    { name: 'performanceAnalysis', isEnabled: true, description: 'Enables AI to analyze code for performance bottlenecks.', status: 'beta' },
    { name: 'codeReviewAgent', isEnabled: true, description: 'Activates an AI agent to review proposed fixes.', status: 'alpha' },
    { name: 'documentationGenerator', isEnabled: true, description: 'Generates documentation for the bug and fix.', status: 'alpha' },
    { name: 'accessibilityChecker', isEnabled: true, description: 'Checks proposed fixes for accessibility compliance.', status: 'beta' },
    { name: 'multiModelOrchestration', isEnabled: true, description: 'Uses multiple AI models (Gemini, ChatGPT, specialized) for optimal results.', status: 'ga' },
    { name: 'realtimeCollaboration', isEnabled: GLOBAL_APP_CONFIG.ENABLE_REALTIME_COLLABORATION, description: 'Allows multiple users to collaborate on bug reproduction sessions.', status: 'beta' },
    { name: 'ciCdIntegration', isEnabled: true, description: 'Integrates with CI/CD pipelines to trigger builds or fetch logs.', status: 'beta' },
    { name: 'promptOptimization', isEnabled: GLOBAL_APP_CONFIG.ENABLE_PROMPT_OPTIMIZATION_SERVICE, description: 'Dynamically optimizes AI prompts for better accuracy and cost efficiency.', status: 'ga' },
    { name: 'workflowAutomation', isEnabled: GLOBAL_APP_CONFIG.ENABLE_WORKFLOW_AUTOMATION, description: 'Allows defining and executing automated bug resolution workflows.', status: 'beta' },
    { name: 'aiCostEstimation', isEnabled: GLOBAL_APP_CONFIG.ENABLE_COST_ESTIMATION, description: 'Provides real-time estimates of AI token usage and costs.', status: 'ga' },
    { name: 'enhancedContextExtraction', isEnabled: true, description: 'Intelligent extraction of context from various sources (Git, IDE, file system).', status: 'ga' },
    { name: 'idePluginIntegration', isEnabled: true, description: 'Mocks integration with a dedicated IDE plugin for streamlined workflow.', status: 'alpha' },
];

/**
 * @interface AIModelConfig
 * @description Configuration for a specific AI model, including its identifier, cost per token, and capabilities.
 * Invented as part of the Multi-Model AI Orchestration Layer.
 */
export interface AIModelConfig {
    id: string;
    name: string;
    provider: 'Google' | 'OpenAI' | 'Anthropic' | 'Custom';
    costPerKiloTokenInput: number;
    costPerKiloTokenOutput: number;
    capabilities: string[]; // e.g., 'code_generation', 'text_summarization', 'security_analysis'
}

/**
 * @constant {AIModelConfig[]}
 * @description Defines the available AI models, their providers, and associated costs.
 * This array simulates a dynamic model registry, allowing the platform to switch between
 * and orchestrate different AI providers (Gemini, ChatGPT, Claude, etc.) based on task,
 * cost, and performance requirements.
 * Invented by: The AI Strategy Unit of Citibank Demo Business Inc., 2024.
 */
export const AI_MODEL_REGISTRY: AIModelConfig[] = [
    { id: 'Gemini-Pro-1.5-Flash', name: 'Gemini 1.5 Flash', provider: 'Google', costPerKiloTokenInput: 0.00035, costPerKiloTokenOutput: 0.00105, capabilities: ['code_generation', 'text_summarization', 'image_analysis', 'multimodal'] },
    { id: 'OpenAI-GPT-4o-Mini', name: 'GPT-4o Mini', provider: 'OpenAI', costPerKiloTokenInput: 0.00015, costPerKiloTokenOutput: 0.00060, capabilities: ['code_generation', 'text_summarization', 'function_calling'] },
    { id: 'Anthropic-Claude-3.5-Sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', costPerKiloTokenInput: 0.003, costPerKiloTokenOutput: 0.015, capabilities: ['code_generation', 'reasoning', 'long_context'] },
    { id: 'BugFix-Specialist-v1', name: 'BugFix Specialist', provider: 'Custom', costPerKiloTokenInput: 0.001, costPerKiloTokenOutput: 0.003, capabilities: ['bug_fixing', 'test_generation'] },
    { id: 'Security-Auditor-v2', name: 'Security Auditor', provider: 'Custom', costPerKiloTokenInput: 0.002, costPerKiloTokenOutput: 0.005, capabilities: ['security_analysis', 'vulnerability_detection'] },
    { id: 'Performance-Profiler-v1', name: 'Performance Profiler', provider: 'Custom', costPerKiloTokenInput: 0.0015, costPerKiloTokenOutput: 0.004, capabilities: ['performance_analysis', 'bottleneck_identification'] },
    { id: 'CodeReview-Agent-v1', name: 'Code Review Agent', provider: 'Custom', costPerKiloTokenInput: 0.0018, costPerKiloTokenOutput: 0.0045, capabilities: ['code_review', 'refactoring_suggestions'] },
];

const exampleStackTrace = `TypeError: Cannot read properties of undefined (reading 'name')
    at UserProfile (UserProfile.jsx:5:21)
    at renderWithHooks (react-dom.development.js:14985:18)
    at mountIndeterminateComponent (react-dom.development.js:17811:13)
    at beginWork (react-dom.development.js:19049:16)`;

// --- EXTERNAL SERVICE ABSTRACTIONS (MOCKED) ---
// These classes represent highly technical and commercial-grade integrations with various
// external systems. In a real-world scenario, these would be separate modules or microservices.
// The goal is to illustrate the extensive network of dependencies and capabilities.

/**
 * @class GitHubIntegrationService
 * @description Manages interactions with GitHub, including fetching code, creating issues, and proposing pull requests.
 * Invented by: Code-Sync Solutions, a subsidiary of Citibank Demo Business Inc. (2023).
 */
export class GitHubIntegrationService {
    private apiKey: string;
    constructor(apiKey: string) { this.apiKey = apiKey; console.log("GitHubIntegrationService initialized."); }
    async fetchFileContent(repo: string, path: string, branch: string = 'main'): Promise<string> {
        if (!GLOBAL_APP_CONFIG.ENABLE_GIT_INTEGRATION) throw new Error("GitHub integration is disabled.");
        console.log(`Fetching ${path} from ${repo}/${branch} via GitHub...`);
        // Simulate API call delay and content retrieval
        await new Promise(resolve => setTimeout(resolve, 500));
        return `// Mock content for ${path} from GitHub
export const ${path.replace(/[^a-zA-Z0-9]/g, '')} = () => { /* ... relevant code ... */ };`;
    }
    async createPullRequest(repo: string, branch: string, title: string, body: string, changes: { path: string; content: string }[]): Promise<string> {
        if (!GLOBAL_APP_CONFIG.ENABLE_GIT_INTEGRATION) throw new Error("GitHub integration is disabled.");
        console.log(`Creating PR "${title}" in ${repo} with ${changes.length} file changes...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const prUrl = `https://github.com/${repo}/pull/${Math.floor(Math.random() * 1000)}`;
        // Log the detailed changes for auditability
        console.log(`GitHub PR created: ${prUrl}. Changes: `, changes);
        return prUrl;
    }
    async createIssue(repo: string, title: string, body: string, labels: string[] = []): Promise<string> {
        if (!GLOBAL_APP_CONFIG.ENABLE_GIT_INTEGRATION) throw new Error("GitHub integration is disabled.");
        console.log(`Creating GitHub issue "${title}" in ${repo} with labels: ${labels.join(', ')}...`);
        await new Promise(resolve => setTimeout(resolve, 800));
        const issueUrl = `https://github.com/${repo}/issues/${Math.floor(Math.random() * 100)}`;
        console.log(`GitHub Issue created: ${issueUrl}`);
        return issueUrl;
    }
}

/**
 * @class JiraIntegrationService
 * @description Manages interactions with Jira, for creating, updating, and linking bug tickets.
 * Invented by: TaskFlow Systems, a subsidiary of Citibank Demo Business Inc. (2022).
 */
export class JiraIntegrationService {
    private baseUrl: string;
    constructor(baseUrl: string) { this.baseUrl = baseUrl; console.log("JiraIntegrationService initialized."); }
    async createIssue(projectKey: string, summary: string, description: string, issueType: string = 'Bug', parentId?: string): Promise<string> {
        if (!GLOBAL_APP_CONFIG.ENABLE_JIRA_INTEGRATION) throw new Error("Jira integration is disabled.");
        console.log(`Creating Jira issue in ${projectKey}: ${summary}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const issueKey = `${projectKey}-${Math.floor(Math.random() * 10000)}`;
        console.log(`Jira Issue created: ${issueKey}`);
        return issueKey; // Returns Jira issue key
    }
    async linkIssue(sourceIssueKey: string, targetIssueKey: string, relationship: string = 'relates to'): Promise<boolean> {
        if (!GLOBAL_APP_CONFIG.ENABLE_JIRA_INTEGRATION) throw new Error("Jira integration is disabled.");
        console.log(`Linking Jira issues ${sourceIssueKey} and ${targetIssueKey} (${relationship})...`);
        await new Promise(resolve => setTimeout(resolve, 300));
        return true;
    }
}

/**
 * @class SlackNotificationService
 * @description Sends notifications to Slack channels for critical events or updates.
 * Invented by: CommsBridge Solutions, a subsidiary of Citibank Demo Business Inc. (2021).
 */
export class SlackNotificationService {
    private webhookUrl: string;
    constructor(webhookUrl: string) { this.webhookUrl = webhookUrl; console.log("SlackNotificationService initialized."); }
    async sendMessage(channel: string, message: string, attachments?: any[]): Promise<void> {
        if (!GLOBAL_APP_CONFIG.ENABLE_SLACK_NOTIFICATIONS) throw new Error("Slack notifications are disabled.");
        console.log(`Sending Slack message to ${channel}: ${message}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // In a real scenario, this would post to the webhookUrl
        console.log("Slack message sent successfully (mocked).");
    }
}

/**
 * @class TelemetryClient
 * @description Gathers anonymized usage data for product improvement, A/B testing, and feature adoption tracking.
 * Invented by: InsightMetrics Group, a subsidiary of Citibank Demo Business Inc. (2023).
 */
export class TelemetryClient {
    private sessionId: string;
    constructor() { this.sessionId = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; console.log("TelemetryClient initialized."); }
    async trackEvent(eventName: string, properties: Record<string, any>): Promise<void> {
        if (!GLOBAL_APP_CONFIG.ENABLE_TELEMETRY) return;
        console.log(`Telemetry Event: ${eventName}`, { sessionId: this.sessionId, ...properties });
        await new Promise(resolve => setTimeout(resolve, 50)); // Non-blocking
    }
    async logError(error: Error, context: Record<string, any>): Promise<void> {
        if (!GLOBAL_APP_CONFIG.ENABLE_TELEMETRY) return;
        console.error(`Telemetry Error: ${error.message}`, { sessionId: this.sessionId, ...context });
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

/**
 * @class VectorDatabaseService
 * @description Mocks a vector database for storing and retrieving code embeddings, bug patterns, and solutions.
 * Critical for RAG (Retrieval Augmented Generation) and advanced AI context provision.
 * Invented by: SemanticSearch Innovations, a subsidiary of Citibank Demo Business Inc. (2024).
 */
export class VectorDatabaseService {
    constructor() { console.log("VectorDatabaseService initialized (mocked)."); }
    async upsertEmbedding(id: string, vector: number[], metadata: Record<string, any>): Promise<void> {
        console.log(`Upserting embedding for ID: ${id}`);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    async querySimilar(vector: number[], topK: number = 5, filter?: Record<string, any>): Promise<{ id: string; score: number; metadata: Record<string, any> }[]> {
        console.log(`Querying similar items in vector DB (topK: ${topK})...`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // Simulate retrieving relevant past bugs or code snippets
        return [
            { id: 'bug-123', score: 0.95, metadata: { title: 'Previous NPE on UserProfile', solution: 'Added null check.', type: 'bug' } },
            { id: 'code-snippet-456', score: 0.88, metadata: { title: 'Safe property access utility', content: 'get(obj, path, defaultValue)', type: 'code' } },
        ];
    }
}

/**
 * @class AuthAndAccessControlService
 * @description Manages user authentication, authorization, and role-based access control (RBAC).
 * Essential for commercial-grade applications to ensure data security and compliance.
 * Invented by: SecureID Solutions, a subsidiary of Citibank Demo Business Inc. (2020).
 */
export class AuthAndAccessControlService {
    constructor() { console.log("AuthAndAccessControlService initialized (mocked)."); }
    isAuthenticated(): boolean {
        // In a real app, this would check tokens, sessions, etc.
        return true;
    }
    hasPermission(permission: string): boolean {
        // e.g., 'can_generate_fix', 'can_integrate_jira', 'can_administer_features'
        return true; // For demo, always true
    }
    getCurrentUserRoles(): string[] {
        return ['admin', 'developer', 'bug_hunter'];
    }
}

/**
 * @class PromptOptimizationService
 * @description Dynamically refines and optimizes AI prompts to improve response quality,
 * reduce token usage, and mitigate prompt injection risks.
 * Invented by: Cognitive Refinement Labs, a subsidiary of Citibank Demo Business Inc. (2024).
 */
export class PromptOptimizationService {
    constructor() { console.log("PromptOptimizationService initialized."); }
    async optimize(prompt: string, context: string, targetTask: string): Promise<string> {
        if (!GLOBAL_APP_CONFIG.ENABLE_PROMPT_OPTIMIZATION_SERVICE) return prompt;
        console.log(`Optimizing prompt for task: ${targetTask}...`);
        await new Promise(resolve => setTimeout(resolve, 150));
        // Simulate advanced prompt engineering techniques:
        // - Adding specific instructions based on task (e.g., "return only JSON")
        // - Injecting relevant examples from vector DB
        // - Sanitizing user input to prevent prompt injection
        // - Reducing verbosity for token efficiency
        const optimizedPrompt = `Given the following context and stack trace, provide a ${targetTask} adhering to best practices and brevity.
--- Context ---
${context}
--- Stack Trace ---
${prompt}
--- Task Instructions ---
- Ensure the output is directly actionable.
- If generating code, include necessary imports.
- Prioritize security and performance in suggestions.
- Be concise and precise.`;
        return optimizedPrompt;
    }
}

/**
 * @class RealtimeCollaborationService
 * @description Facilitates real-time multi-user collaboration on bug reproduction sessions.
 * Enables simultaneous editing, shared insights, and synchronized workflows.
 * Invented by: SyncFlow Technologies, a subsidiary of Citibank Demo Business Inc. (2024).
 */
export class RealtimeCollaborationService {
    constructor() { console.log("RealtimeCollaborationService initialized (mocked)."); }
    async joinSession(sessionId: string): Promise<CollaborationSession> {
        if (!GLOBAL_APP_CONFIG.ENABLE_REALTIME_COLLABORATION) throw new Error("Real-time collaboration is disabled.");
        console.log(`Joining collaboration session: ${sessionId}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Simulate WebSocket connection and state synchronization
        return {
            id: sessionId,
            participants: [{ id: 'user-1', name: 'Alice', status: 'online' }],
            sharedState: {},
            lastUpdated: new Date(),
        };
    }
    async leaveSession(sessionId: string): Promise<void> {
        if (!GLOBAL_APP_CONFIG.ENABLE_REALTIME_COLLABORATION) return;
        console.log(`Leaving collaboration session: ${sessionId}`);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    async updateSharedState(sessionId: string, newState: Partial<CollaborationSession>): Promise<void> {
        if (!GLOBAL_APP_CONFIG.ENABLE_REALTIME_COLLABORATION) return;
        console.log(`Updating shared state for session ${sessionId}:`, newState);
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

/**
 * @class WorkflowAutomationEngine
 * @description Enables users to define and execute complex, multi-step bug resolution workflows.
 * This integrates AI agents, external services, and human review steps.
 * Invented by: ProcessFlow Innovations, a subsidiary of Citibank Demo Business Inc. (2024).
 */
export class WorkflowAutomationEngine {
    constructor() { console.log("WorkflowAutomationEngine initialized (mocked)."); }
    async defineWorkflow(workflow: WorkflowDefinition): Promise<string> {
        if (!GLOBAL_APP_CONFIG.ENABLE_WORKFLOW_AUTOMATION) throw new Error("Workflow automation is disabled.");
        console.log(`Defining new workflow: ${workflow.name}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        return `workflow-${Math.random().toString(36).substr(2, 9)}`;
    }
    async executeWorkflow(workflowId: string, initialPayload: Record<string, any>): Promise<string> {
        if (!GLOBAL_APP_CONFIG.ENABLE_WORKFLOW_AUTOMATION) throw new Error("Workflow automation is disabled.");
        console.log(`Executing workflow ${workflowId} with payload:`, initialPayload);
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Simulate complex orchestration: calling AI, then Jira, then GitHub, etc.
        return `workflow-run-${Math.random().toString(36).substr(2, 9)}`;
    }
    async getActiveWorkflows(): Promise<WorkflowDefinition[]> {
        if (!GLOBAL_APP_CONFIG.ENABLE_WORKFLOW_AUTOMATION) return [];
        console.log("Fetching active workflows...");
        await new Promise(resolve => setTimeout(resolve, 100));
        return [
            { id: 'wf-auto-fix', name: 'Auto-Fix & Deploy', steps: ['generate_test', 'generate_fix', 'review_fix_ai', 'create_pr', 'trigger_ci'] },
            { id: 'wf-security-report', name: 'Security Audit & Report', steps: ['security_scan', 'generate_report', 'create_jira_issue'] },
        ];
    }
}

/**
 * @class CostManagementService
 * @description Provides detailed cost breakdowns for AI operations, helps manage budgets,
 * and suggests cost-optimization strategies.
 * Invented by: FinAI Solutions, a subsidiary of Citibank Demo Business Inc. (2024).
 */
export class CostManagementService {
    constructor() { console.log("CostManagementService initialized."); }
    async estimateCost(modelId: string, inputTokens: number, outputTokens: number): Promise<AICostEstimate> {
        if (!GLOBAL_APP_CONFIG.ENABLE_COST_ESTIMATION) return { totalCostUSD: 0, modelId, inputTokens, outputTokens };
        const model = AI_MODEL_REGISTRY.find(m => m.id === modelId);
        if (!model) throw new Error(`Model ${modelId} not found in registry.`);
        const inputCost = (inputTokens / 1000) * model.costPerKiloTokenInput;
        const outputCost = (outputTokens / 1000) * model.costPerKiloTokenOutput;
        const totalCostUSD = inputCost + outputCost;
        console.log(`Estimated cost for ${modelId}: $${totalCostUSD.toFixed(5)}`);
        return {
            modelId,
            inputTokens,
            outputTokens,
            inputCostUSD: inputCost,
            outputCostUSD: outputCost,
            totalCostUSD
        };
    }
    async getMonthlyUsage(userId: string): Promise<any> {
        if (!GLOBAL_APP_CONFIG.ENABLE_COST_ESTIMATION) return { totalUsageUSD: 0, breakdowns: [] };
        console.log(`Fetching monthly usage for user ${userId}...`);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { totalUsageUSD: 125.73, breakdowns: [{ model: 'Gemini-Pro', cost: 75.20 }, { model: 'GPT-4o-Mini', cost: 50.53 }] };
    }
}

/**
 * @class BugHistoryService
 * @description Stores, retrieves, and analyzes historical bug reproduction sessions and their outcomes.
 * Essential for learning from past incidents and improving AI models.
 * Invented by: ChronoDebug Systems, a subsidiary of Citibank Demo Business Inc. (2023).
 */
export class BugHistoryService {
    private history: BugReport[] = [];
    constructor() { console.log("BugHistoryService initialized."); }
    async saveBugReport(report: BugReport): Promise<void> {
        if (!GLOBAL_APP_CONFIG.ENABLE_BUG_HISTORY) return;
        report.id = `bug-rep-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        report.timestamp = new Date();
        this.history.push(report);
        console.log(`Bug report ${report.id} saved to history.`);
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    async getBugReports(filters?: Record<string, any>): Promise<BugReport[]> {
        if (!GLOBAL_APP_CONFIG.ENABLE_BUG_HISTORY) return [];
        console.log("Retrieving bug reports from history with filters:", filters);
        await new Promise(resolve => setTimeout(resolve, 200));
        return [...this.history].reverse(); // Return a copy, most recent first
    }
    async getBugReportById(id: string): Promise<BugReport | undefined> {
        if (!GLOBAL_APP_CONFIG.ENABLE_BUG_HISTORY) return undefined;
        console.log(`Retrieving bug report by ID: ${id}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.history.find(r => r.id === id);
    }
}

/**
 * @class UserFeedbackService
 * @description Collects explicit feedback from users on AI-generated outputs (tests, fixes).
 * This data is crucial for continuous improvement and fine-tuning of AI models.
 * Invented by: QualityLoop Analytics, a subsidiary of Citibank Demo Business Inc. (2024).
 */
export class UserFeedbackService {
    constructor() { console.log("UserFeedbackService initialized."); }
    async submitFeedback(reportId: string, feedback: { rating: number; comment?: string; issues?: string[] }): Promise<void> {
        console.log(`Feedback submitted for report ${reportId}:`, feedback);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Instantiate external services globally or as singletons.
// In a larger app, dependency injection would be used.
const gitHubService = new GitHubIntegrationService('ghp_mock_token');
const jiraService = new JiraIntegrationService('https://citibank-demo.atlassian.net');
const slackService = new SlackNotificationService('https://hooks.slack.com/services/mock');
const telemetryClient = new TelemetryClient();
const vectorDbService = new VectorDatabaseService();
const authService = new AuthAndAccessControlService();
const promptOptimizer = new PromptOptimizationService();
const collaborationService = new RealtimeCollaborationService();
const workflowEngine = new WorkflowAutomationEngine();
const costService = new CostManagementService();
const bugHistoryService = new BugHistoryService();
const userFeedbackService = new UserFeedbackService();

/**
 * @component BugReproducer
 * @description The flagship component of the Citibank Demo Business Inc. AI-powered Bug Resolution Platform.
 * This component orchestrates a multitude of advanced features, AI models (Gemini, ChatGPT, specialized),
 * and external service integrations to automate and streamline the entire bug lifecycle from
 * reproduction to fix deployment. It represents a commercial-grade, highly technical, and logical
 * solution designed for enterprise development teams.
 *
 * Invented by: James Burvel O'Callaghan III, President Citibank Demo Business Inc., and his elite team of AI engineers.
 * Initial conception: May 2024. Continuous feature expansion and iteration since.
 */
export const BugReproducer: React.FC = () => {
    // --- CORE STATE MANAGEMENT ---
    // Represents the initial core functionality. These are robustly managed and extended.
    const [stackTrace, setStackTrace] = useState(exampleStackTrace);
    const [context, setContext] = useState('// The UserProfile component code:\nconst UserProfile = ({ user }) => <div>{user.name}</div>;');
    const [generatedTest, setGeneratedTest] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentBugReportId, setCurrentBugReportId] = useState<string | null>(null);

    // --- AI ORCHESTRATION & MODEL SELECTION STATE ---
    // Features invented for multi-model AI orchestration and dynamic model selection.
    const [selectedAiModel, setSelectedAiModel] = useState<string>(GLOBAL_APP_CONFIG.DEFAULT_AI_MODEL);
    const [testGenerationModel, setTestGenerationModel] = useState<string>('BugFix-Specialist-v1');
    const [fixSuggestionModel, setFixSuggestionModel] = useState<string>('OpenAI-GPT-4o-Mini');
    const [securityAuditModel, setSecurityAuditModel] = useState<string>('Security-Auditor-v2');
    const [performanceAnalyzeModel, setPerformanceAnalyzeModel] = useState<string>('Performance-Profiler-v1');
    const [aiCostEstimate, setAiCostEstimate] = useState<AICostEstimate | null>(null);
    const [totalInputTokens, setTotalInputTokens] = useState(0);
    const [totalOutputTokens, setTotalOutputTokens] = useState(0);

    // --- ADVANCED INPUT & CONTEXT MANAGEMENT STATE ---
    // Features for sophisticated context gathering.
    const [linkedGitRepo, setLinkedGitRepo] = useState<string>('citibank-demo/bug-reproducer-project');
    const [linkedGitBranch, setLinkedGitBranch] = useState<string>('main');
    const [additionalFiles, setAdditionalFiles] = useState<{ name: string; content: string }[]>([]);
    const [autoFetchContext, setAutoFetchContext] = useState(true); // Toggle for AI-driven context fetching

    // --- AI-GENERATED OUTPUT STATE ---
    // State for new AI-driven outputs beyond just tests.
    const [proposedFix, setProposedFix] = useState<string>('');
    const [originalCodeForDiff, setOriginalCodeForDiff] = useState<string>('');
    const [securityReport, setSecurityReport] = useState<string>('');
    const [performanceInsights, setPerformanceInsights] = useState<string>('');
    const [codeReviewFeedback, setCodeReviewFeedback] = useState<string>('');
    const [generatedDocumentation, setGeneratedDocumentation] = useState<string>('');
    const [accessibilityIssues, setAccessibilityIssues] = useState<string>('');

    // --- INTEGRATION STATE ---
    // State for various external system integrations.
    const [jiraTicketId, setJiraTicketId] = useState<string>('');
    const [githubPrUrl, setGithubPrUrl] = useState<string>('');
    const [ciBuildStatus, setCiBuildStatus] = useState<string>('Not Started');
    const [slackChannel, setSlackChannel] = useState<string>('#bug-alerts');

    // --- UI/UX STATE ---
    const [activeTab, setActiveTab] = useState('input');
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [bugHistory, setBugHistory] = useState<BugReport[]>([]);
    const [selectedHistoryReport, setSelectedHistoryReport] = useState<BugReport | null>(null);
    const [showConfirmAction, setShowConfirmAction] = useState(false);
    const [confirmActionDetails, setConfirmActionDetails] = useState({ title: '', message: '', onConfirm: () => { } });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [collaborationSessionId, setCollaborationSessionId] = useState<string | null>(null);
    const [isCollaborating, setIsCollaborating] = useState(false);
    const [availableWorkflows, setAvailableWorkflows] = useState<WorkflowDefinition[]>([]);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
    const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
    const [userFeedbackRating, setUserFeedbackRating] = useState<number>(0);

    const inputTokensRef = useRef(0);
    const outputTokensRef = useRef(0);

    // --- MEMOIZED SERVICE INSTANCES ---
    // Ensures that service instances are not re-created on every render, preserving state
    // and optimizing resource usage. This is a common pattern in commercial-grade React apps.
    const authAndAccessControl = useMemo(() => authService, []);
    const gitHub = useMemo(() => gitHubService, []);
    const jira = useMemo(() => jiraService, []);
    const slack = useMemo(() => slackService, []);
    const telemetry = useMemo(() => telemetryClient, []);
    const vectorDb = useMemo(() => vectorDbService, []);
    const promptOpt = useMemo(() => promptOptimizer, []);
    const collaboration = useMemo(() => collaborationService, []);
    const workflowAutomation = useMemo(() => workflowEngine, []);
    const costMgmt = useMemo(() => costService, []);
    const bugHistoryMgr = useMemo(() => bugHistoryService, []);
    const feedbackService = useMemo(() => userFeedbackService, []);

    /**
     * @function updateAiTokenUsage
     * @description Tracks token usage for cost estimation. This is a crucial feature
     * for commercial AI platforms to provide transparency and manage operational costs.
     * Invented by: FinAI Solutions, 2024.
     */
    const updateAiTokenUsage = useCallback((modelId: string, input: number = 0, output: number = 0) => {
        inputTokensRef.current += input;
        outputTokensRef.current += output;
        setTotalInputTokens(prev => prev + input);
        setTotalOutputTokens(prev => prev + output);

        if (FEATURE_FLAGS.find(f => f.name === 'aiCostEstimation')?.isEnabled) {
            costMgmt.estimateCost(modelId, inputTokensRef.current, outputTokensRef.current)
                .then(setAiCostEstimate)
                .catch(err => telemetry.logError(err, { feature: 'cost_estimation' }));
        }
    }, [costMgmt, telemetry]);

    /**
     * @function handleGenerate
     * @description The core function to initiate AI-powered bug reproduction test generation.
     * This has been significantly enhanced to include multi-model AI orchestration,
     * prompt optimization, and robust error handling with telemetry.
     */
    const handleGenerate = useCallback(async () => {
        if (!stackTrace.trim()) {
            setError('Please provide a stack trace.');
            setNotification({ message: 'Stack trace is required.', type: 'error' });
            telemetry.trackEvent('generate_test_failed', { reason: 'empty_stack_trace' });
            return;
        }

        if (!authAndAccessControl.isAuthenticated()) {
            setError('Authentication required to generate tests.');
            setNotification({ message: 'Please log in to use AI features.', type: 'error' });
            telemetry.trackEvent('generate_test_failed', { reason: 'unauthenticated' });
            return;
        }

        setIsLoading(true);
        setError('');
        setGeneratedTest('');
        setProposedFix('');
        setSecurityReport('');
        setPerformanceInsights('');
        setCodeReviewFeedback('');
        setAiCostEstimate(null);
        inputTokensRef.current = 0;
        outputTokensRef.current = 0;
        setTotalInputTokens(0);
        setTotalOutputTokens(0);
        setCurrentBugReportId(null); // Reset for a new session
        telemetry.trackEvent('generate_test_started', { model: testGenerationModel, autoFetchContext });

        try {
            let effectiveContext = context;
            // Feature: Enhanced Context Extraction
            if (autoFetchContext && FEATURE_FLAGS.find(f => f.name === 'enhancedContextExtraction')?.isEnabled) {
                setNotification({ message: 'Intelligently fetching additional context...', type: 'info' });
                const fetchedContext = await getCodeContextFromAI(stackTrace, linkedGitRepo, linkedGitBranch, additionalFiles);
                effectiveContext += `\n\n// AI-fetched relevant context:\n${fetchedContext}`;
                updateAiTokenUsage(selectedAiModel, fetchedContext.length / 4, 0); // Estimate tokens
                setNotification({ message: 'Context enrichment complete.', type: 'success' });
            }

            // Feature: Prompt Optimization Service
            const optimizedStackTracePrompt = await promptOpt.optimize(stackTrace, effectiveContext, 'bug_reproduction_test_generation');
            updateAiTokenUsage(testGenerationModel, (optimizedStackTracePrompt.length - stackTrace.length) / 4, 0);

            setNotification({ message: 'Generating test with AI Orchestrator...', type: 'info' });

            // Feature: Multi-Model AI Orchestration for Test Generation
            const stream = await orchestrateMultiModelAIResponse(testGenerationModel, optimizedStackTracePrompt, effectiveContext, 'test_generation');
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setGeneratedTest(fullResponse);
                updateAiTokenUsage(testGenerationModel, 0, chunk.length / 4); // Estimate output tokens
            }

            setNotification({ message: 'Test generation complete.', type: 'success' });
            setActiveTab('generated-test');

            // --- Post-Generation Automated Steps (AI Agents & Integrations) ---
            const initialBugReport: BugReport = {
                stackTrace,
                context: effectiveContext,
                generatedTest: fullResponse,
                aiModelUsed: testGenerationModel,
                timestamp: new Date(),
            };
            await bugHistoryMgr.saveBugReport(initialBugReport);
            setCurrentBugReportId(initialBugReport.id || null);

            // Trigger follow-up AI analyses in parallel if enabled
            // These would typically be handled by a workflow engine or background jobs.
            if (FEATURE_FLAGS.find(f => f.name === 'aiFixSuggestion')?.isEnabled) {
                handleGenerateFixSuggestion(effectiveContext, fullResponse);
            }
            if (FEATURE_FLAGS.find(f => f.name === 'securityAudit')?.isEnabled) {
                handleSecurityAudit(effectiveContext, fullResponse);
            }
            if (FEATURE_FLAGS.find(f => f.name === 'performanceAnalysis')?.isEnabled) {
                handlePerformanceAnalysis(effectiveContext, fullResponse);
            }

            telemetry.trackEvent('generate_test_success', { model: testGenerationModel, tokens: { input: totalInputTokens, output: totalOutputTokens } });

        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during test generation.');
            setNotification({ message: err.message || 'Failed to generate test.', type: 'error' });
            telemetry.logError(err, { feature: 'test_generation', model: testGenerationModel });
        } finally {
            setIsLoading(false);
        }
    }, [stackTrace, context, autoFetchContext, linkedGitRepo, linkedGitBranch, additionalFiles, selectedAiModel, testGenerationModel, authAndAccessControl, telemetry, promptOpt, updateAiTokenUsage, bugHistoryMgr, totalInputTokens, totalOutputTokens]);

    /**
     * @function handleGenerateFixSuggestion
     * @description AI Agent for proposing code fixes. This runs after test generation.
     * Invented by: AutoFix Innovations, a subsidiary of Citibank Demo Business Inc. (2024).
     */
    const handleGenerateFixSuggestion = useCallback(async (currentContext: string, generatedTestCode: string) => {
        if (!FEATURE_FLAGS.find(f => f.name === 'aiFixSuggestion')?.isEnabled) return;
        setNotification({ message: 'AI is generating fix suggestions...', type: 'info' });
        try {
            // Retrieve original code for diffing (simulated)
            const filePath = stackTrace.match(/at ([^(]+) \(([^:]+):\d+:\d+\)/)?.[2] || 'src/components/UserProfile.jsx';
            // In a real system, this would fetch from Git or local file system
            const originalCode = await gitHub.fetchFileContent(linkedGitRepo, filePath, linkedGitBranch);
            setOriginalCodeForDiff(originalCode);

            const prompt = `Given the following stack trace, original code, and a failing reproduction test, propose a concise code fix.
            --- Stack Trace ---
            ${stackTrace}
            --- Original Code for ${filePath} ---
            ${originalCode}
            --- Failing Test ---
            ${generatedTestCode}
            --- Proposed Fix Guidelines ---
            - Provide ONLY the modified code block(s).
            - Do not include explanations in the code, use comments if necessary.
            - Focus on the minimal change to pass the test.
            - Prioritize robust, maintainable solutions.`;

            const optimizedFixPrompt = await promptOpt.optimize(prompt, currentContext, 'bug_fix_generation');
            updateAiTokenUsage(fixSuggestionModel, (optimizedFixPrompt.length - prompt.length) / 4, 0);

            const stream = await generateFixSuggestionStream(fixSuggestionModel, optimizedFixPrompt, currentContext);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setProposedFix(fullResponse);
                updateAiTokenUsage(fixSuggestionModel, 0, chunk.length / 4);
            }

            if (currentBugReportId) {
                await bugHistoryMgr.saveBugReport({ id: currentBugReportId, proposedFix: fullResponse });
            }

            setNotification({ message: 'Fix suggestion generated.', type: 'success' });
            setActiveTab('ai-fix');

            // Trigger AI Code Review
            if (FEATURE_FLAGS.find(f => f.name === 'codeReviewAgent')?.isEnabled) {
                handleCodeReview(originalCode, fullResponse, generatedTestCode);
            }

            // Trigger Accessibility Check
            if (FEATURE_FLAGS.find(f => f.name === 'accessibilityChecker')?.isEnabled) {
                handleAccessibilityCheck(fullResponse);
            }

        } catch (err: any) {
            console.error('Failed to generate fix suggestion:', err);
            setNotification({ message: 'Failed to generate fix suggestion.', type: 'error' });
            telemetry.logError(err, { feature: 'fix_suggestion', model: fixSuggestionModel });
        }
    }, [stackTrace, linkedGitRepo, linkedGitBranch, fixSuggestionModel, promptOpt, updateAiTokenUsage, gitHub, currentBugReportId, bugHistoryMgr, telemetry]);

    /**
     * @function handleSecurityAudit
     * @description AI Agent for security vulnerability detection. Runs in parallel with fix generation.
     * Invented by: SecureCode AI, a subsidiary of Citibank Demo Business Inc. (2024).
     */
    const handleSecurityAudit = useCallback(async (currentContext: string, generatedTestCode: string) => {
        if (!FEATURE_FLAGS.find(f => f.name === 'securityAudit')?.isEnabled) return;
        setNotification({ message: 'Running AI security audit...', type: 'info' });
        try {
            const auditPrompt = `Perform a security audit on the following code context and test case. Identify potential vulnerabilities,
            such as injection flaws, improper authentication/authorization, data exposure, insecure deserialization, etc.
            --- Code Context ---
            ${currentContext}
            --- Generated Test ---
            ${generatedTestCode}
            --- Audit Guidelines ---
            - Provide a summary of findings.
            - List specific vulnerabilities with affected code snippets.
            - Suggest remediation steps.
            - Rate severity (Critical, High, Medium, Low, Informational).`;

            const optimizedAuditPrompt = await promptOpt.optimize(auditPrompt, currentContext, 'security_audit');
            updateAiTokenUsage(securityAuditModel, (optimizedAuditPrompt.length - auditPrompt.length) / 4, 0);

            const stream = await analyzeCodeForVulnerabilitiesStream(securityAuditModel, optimizedAuditPrompt, currentContext);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setSecurityReport(fullResponse);
                updateAiTokenUsage(securityAuditModel, 0, chunk.length / 4);
            }

            if (currentBugReportId) {
                await bugHistoryMgr.saveBugReport({ id: currentBugReportId, securityAnalysis: fullResponse });
            }

            setNotification({ message: 'Security audit complete.', type: 'success' });
        } catch (err: any) {
            console.error('Failed to perform security audit:', err);
            setNotification({ message: 'Failed to perform security audit.', type: 'error' });
            telemetry.logError(err, { feature: 'security_audit', model: securityAuditModel });
        }
    }, [securityAuditModel, promptOpt, updateAiTokenUsage, currentBugReportId, bugHistoryMgr, telemetry]);

    /**
     * @function handlePerformanceAnalysis
     * @description AI Agent for performance bottleneck identification. Runs in parallel with fix generation.
     * Invented by: PerformanceInsight AI, a subsidiary of Citibank Demo Business Inc. (2024).
     */
    const handlePerformanceAnalysis = useCallback(async (currentContext: string, generatedTestCode: string) => {
        if (!FEATURE_FLAGS.find(f => f.name === 'performanceAnalysis')?.isEnabled) return;
        setNotification({ message: 'Running AI performance analysis...', type: 'info' });
        try {
            const analysisPrompt = `Analyze the following code context and test case for potential performance bottlenecks.
            Consider areas like inefficient loops, excessive API calls, large data processing,
            memory leaks, and unoptimized algorithms.
            --- Code Context ---
            ${currentContext}
            --- Generated Test ---
            ${generatedTestCode}
            --- Analysis Guidelines ---
            - Highlight specific performance hotspots.
            - Suggest optimizations with code examples.
            - Explain the performance impact of identified issues.`;

            const optimizedPerformancePrompt = await promptOpt.optimize(analysisPrompt, currentContext, 'performance_analysis');
            updateAiTokenUsage(performanceAnalyzeModel, (optimizedPerformancePrompt.length - analysisPrompt.length) / 4, 0);

            const stream = await orchestrateMultiModelAIResponse(performanceAnalyzeModel, optimizedPerformancePrompt, currentContext, 'performance_analysis');
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setPerformanceInsights(fullResponse);
                updateAiTokenUsage(performanceAnalyzeModel, 0, chunk.length / 4);
            }

            if (currentBugReportId) {
                await bugHistoryMgr.saveBugReport({ id: currentBugReportId, performanceAnalysis: fullResponse });
            }

            setNotification({ message: 'Performance analysis complete.', type: 'success' });
        } catch (err: any) {
            console.error('Failed to perform performance analysis:', err);
            setNotification({ message: 'Failed to perform performance analysis.', type: 'error' });
            telemetry.logError(err, { feature: 'performance_analysis', model: performanceAnalyzeModel });
        }
    }, [performanceAnalyzeModel, promptOpt, updateAiTokenUsage, currentBugReportId, bugHistoryMgr, telemetry]);

    /**
     * @function handleCodeReview
     * @description AI Agent for code review on proposed fixes.
     * Invented by: CodeGuard AI, a subsidiary of Citibank Demo Business Inc. (2024).
     */
    const handleCodeReview = useCallback(async (originalCode: string, proposedFixCode: string, testCode: string) => {
        if (!FEATURE_FLAGS.find(f => f.name === 'codeReviewAgent')?.isEnabled) return;
        setNotification({ message: 'AI Code Review Agent analyzing proposed fix...', type: 'info' });
        try {
            const reviewPrompt = `Perform a code review on the proposed fix, considering the original code and the failing test.
            Focus on correctness, readability, maintainability, potential side effects, and adherence to best practices.
            --- Original Code ---
            ${originalCode}
            --- Proposed Fix ---
            ${proposedFixCode}
            --- Failing Test (to ensure fix context) ---
            ${testCode}
            --- Review Guidelines ---
            - Identify potential bugs introduced by the fix.
            - Suggest refactorings or improvements.
            - Check for style guide violations.
            - Ensure the fix addresses the root cause implied by the stack trace.`;

            const optimizedReviewPrompt = await promptOpt.optimize(reviewPrompt, originalCode + proposedFixCode, 'code_review');
            updateAiTokenUsage('CodeReview-Agent-v1', (optimizedReviewPrompt.length - reviewPrompt.length) / 4, 0);

            const stream = await orchestrateMultiModelAIResponse('CodeReview-Agent-v1', optimizedReviewPrompt, originalCode + proposedFixCode, 'code_review');
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setCodeReviewFeedback(fullResponse);
                updateAiTokenUsage('CodeReview-Agent-v1', 0, chunk.length / 4);
            }

            if (currentBugReportId) {
                await bugHistoryMgr.saveBugReport({ id: currentBugReportId, codeReviewFeedback: fullResponse });
            }

            setNotification({ message: 'AI Code Review complete.', type: 'success' });
        } catch (err: any) {
            console.error('Failed to perform AI code review:', err);
            setNotification({ message: 'Failed to perform AI code review.', type: 'error' });
            telemetry.logError(err, { feature: 'code_review_agent' });
        }
    }, [promptOpt, updateAiTokenUsage, currentBugReportId, bugHistoryMgr, telemetry]);

    /**
     * @function handleAccessibilityCheck
     * @description AI Agent for checking accessibility impact of a proposed fix.
     * Invented by: AccessiFix AI, a subsidiary of Citibank Demo Business Inc. (2024).
     */
    const handleAccessibilityCheck = useCallback(async (proposedFixCode: string) => {
        if (!FEATURE_FLAGS.find(f => f.name === 'accessibilityChecker')?.isEnabled) return;
        setNotification({ message: 'AI Accessibility Checker analyzing proposed fix...', type: 'info' });
        try {
            const accessibilityPrompt = `Review the following proposed code fix for any potential accessibility issues.
            Consider ARIA attributes, semantic HTML, keyboard navigation, color contrast, and focus management if applicable.
            --- Proposed Fix ---
            ${proposedFixCode}
            --- Accessibility Guidelines ---
            - Identify specific violations of WCAG (Web Content Accessibility Guidelines).
            - Suggest concrete code changes for remediation.
            - Explain the impact on users with disabilities.`;

            const optimizedAccessibilityPrompt = await promptOpt.optimize(accessibilityPrompt, proposedFixCode, 'accessibility_check');
            updateAiTokenUsage(selectedAiModel, (optimizedAccessibilityPrompt.length - accessibilityPrompt.length) / 4, 0);

            const stream = await orchestrateMultiModelAIResponse(selectedAiModel, optimizedAccessibilityPrompt, proposedFixCode, 'accessibility_check');
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setAccessibilityIssues(fullResponse);
                updateAiTokenUsage(selectedAiModel, 0, chunk.length / 4);
            }

            if (currentBugReportId) {
                await bugHistoryMgr.saveBugReport({ id: currentBugReportId, accessibilityAnalysis: fullResponse });
            }

            setNotification({ message: 'AI Accessibility Check complete.', type: 'success' });
        } catch (err: any) {
            console.error('Failed to perform AI accessibility check:', err);
            setNotification({ message: 'Failed to perform AI accessibility check.', type: 'error' });
            telemetry.logError(err, { feature: 'accessibility_checker' });
        }
    }, [selectedAiModel, promptOpt, updateAiTokenUsage, currentBugReportId, bugHistoryMgr, telemetry]);


    /**
     * @function handleIntegrationAction
     * @description Centralized handler for all external integrations (Jira, GitHub, Slack).
     * This ensures consistent error handling, loading states, and telemetry.
     * Invented by: IntegrationLink Systems, a subsidiary of Citibank Demo Business Inc. (2023).
     */
    const handleIntegrationAction = useCallback(async (action: 'createJira' | 'createPR' | 'sendSlackNotification' | 'triggerCI', payload: any) => {
        setIsLoading(true);
        setNotification(null);
        setError('');
        try {
            switch (action) {
                case 'createJira':
                    if (!authAndAccessControl.hasPermission('can_integrate_jira')) { throw new Error('Insufficient permissions for Jira integration.'); }
                    const jiraKey = await jira.createIssue('PROJ', `Bug: ${stackTrace.split('\n')[0]}`, `Generated Test:\n\`\`\`javascript\n${generatedTest}\n\`\`\`\n\nProposed Fix:\n\`\`\`diff\n${proposedFix}\n\`\`\`\n\nAI Security Report:\n${securityReport}\n\nAI Performance Insights:\n${performanceInsights}`);
                    setJiraTicketId(jiraKey);
                    setNotification({ message: `Jira ticket ${jiraKey} created successfully.`, type: 'success' });
                    if (currentBugReportId) { await bugHistoryMgr.saveBugReport({ id: currentBugReportId, jiraTicketId: jiraKey }); }
                    telemetry.trackEvent('jira_issue_created', { jiraKey, bugReportId: currentBugReportId });
                    break;
                case 'createPR':
                    if (!authAndAccessControl.hasPermission('can_create_pr')) { throw new Error('Insufficient permissions for GitHub PR creation.'); }
                    const prUrl = await gitHub.createPullRequest(linkedGitRepo, linkedGitBranch, `Fix: ${stackTrace.split('\n')[0]}`, `Applies AI-generated fix for bug.\n\nGenerated Test:\n\`\`\`javascript\n${generatedTest}\n\`\`\`\n\nAI Security Report:\n${securityReport}\n\nAI Performance Insights:\n${performanceInsights}`, [{ path: 'src/components/UserProfile.jsx', content: proposedFix }]);
                    setGithubPrUrl(prUrl);
                    setNotification({ message: `GitHub PR created: ${prUrl}`, type: 'success' });
                    if (currentBugReportId) { await bugHistoryMgr.saveBugReport({ id: currentBugReportId, githubPrUrl: prUrl }); }
                    telemetry.trackEvent('github_pr_created', { prUrl, bugReportId: currentBugReportId });
                    break;
                case 'sendSlackNotification':
                    if (!authAndAccessControl.hasPermission('can_send_slack_notifications')) { throw new Error('Insufficient permissions for Slack notifications.'); }
                    await slack.sendMessage(slackChannel, `🚨 BugReproducer Alert: New fix proposed for bug in ${linkedGitRepo}! \nJira: ${jiraTicketId || 'N/A'}\nPR: ${githubPrUrl || 'N/A'}\nDetails: ${stackTrace.split('\n')[0]}`);
                    setNotification({ message: `Slack notification sent to ${slackChannel}.`, type: 'success' });
                    telemetry.trackEvent('slack_notification_sent', { channel: slackChannel, bugReportId: currentBugReportId });
                    break;
                case 'triggerCI':
                    if (!authAndAccessControl.hasPermission('can_trigger_ci')) { throw new Error('Insufficient permissions for CI/CD operations.'); }
                    setNotification({ message: 'Triggering CI pipeline...', type: 'info' });
                    setCiBuildStatus('Running');
                    // Simulate CI/CD service call (e.g., Jenkins, GitHub Actions API)
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    setCiBuildStatus('Passed'); // Or 'Failed' based on simulated outcome
                    setNotification({ message: 'CI pipeline triggered and passed (mocked).', type: 'success' });
                    if (currentBugReportId) { await bugHistoryMgr.saveBugReport({ id: currentBugReportId, ciBuildStatus: 'Passed' }); }
                    telemetry.trackEvent('ci_pipeline_triggered', { status: 'mocked_passed', bugReportId: currentBugReportId });
                    break;
            }
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during integration.');
            setNotification({ message: err.message || `Failed to integrate with ${action}.`, type: 'error' });
            telemetry.logError(err, { feature: `integration_${action}`, payload, bugReportId: currentBugReportId });
        } finally {
            setIsLoading(false);
        }
    }, [stackTrace, generatedTest, proposedFix, securityReport, performanceInsights, jiraTicketId, githubPrUrl, linkedGitRepo, linkedGitBranch, slackChannel, currentBugReportId, authAndAccessControl, jira, gitHub, slack, bugHistoryMgr, telemetry]);

    /**
     * @function handleRunWorkflow
     * @description Initiates an automated bug resolution workflow.
     * Invented by: ProcessFlow Innovations, 2024.
     */
    const handleRunWorkflow = useCallback(async () => {
        if (!selectedWorkflowId) {
            setNotification({ message: 'Please select a workflow to run.', type: 'warning' });
            return;
        }
        setIsWorkflowRunning(true);
        setNotification({ message: `Executing workflow: ${selectedWorkflowId}...`, type: 'info' });
        telemetry.trackEvent('workflow_started', { workflowId: selectedWorkflowId, bugReportId: currentBugReportId });
        try {
            // This is a highly complex orchestration. For a demo, it's mocked.
            // In reality, this would involve a state machine or BPMN engine.
            const runId = await workflowAutomation.executeWorkflow(selectedWorkflowId, {
                stackTrace,
                context,
                gitRepo: linkedGitRepo,
                gitBranch: linkedGitBranch,
                initialBugReportId: currentBugReportId,
            });
            setNotification({ message: `Workflow ${selectedWorkflowId} completed (Run ID: ${runId}).`, type: 'success' });
            telemetry.trackEvent('workflow_completed', { workflowId: selectedWorkflowId, runId, bugReportId: currentBugReportId });
            // After workflow, potentially update all state based on its outputs
            // (e.g., if it created a PR, generated a fix, etc.)
        } catch (err: any) {
            setError(err.message || 'An error occurred during workflow execution.');
            setNotification({ message: err.message || `Workflow ${selectedWorkflowId} failed.`, type: 'error' });
            telemetry.logError(err, { feature: 'workflow_execution', workflowId: selectedWorkflowId, bugReportId: currentBugReportId });
        } finally {
            setIsWorkflowRunning(false);
        }
    }, [selectedWorkflowId, stackTrace, context, linkedGitRepo, linkedGitBranch, currentBugReportId, workflowAutomation, telemetry]);

    /**
     * @function loadBugReportFromHistory
     * @description Populates the UI with data from a previously saved bug report.
     * Invented by: ChronoDebug Systems, 2023.
     */
    const loadBugReportFromHistory = useCallback((report: BugReport) => {
        setStackTrace(report.stackTrace);
        setContext(report.context || '');
        setGeneratedTest(report.generatedTest || '');
        setProposedFix(report.proposedFix || '');
        setOriginalCodeForDiff(report.originalCodeForDiff || ''); // Need to save this in report
        setSecurityReport(report.securityAnalysis || '');
        setPerformanceInsights(report.performanceAnalysis || '');
        setCodeReviewFeedback(report.codeReviewFeedback || '');
        setGeneratedDocumentation(report.generatedDocumentation || '');
        setAccessibilityIssues(report.accessibilityAnalysis || '');
        setJiraTicketId(report.jiraTicketId || '');
        setGithubPrUrl(report.githubPrUrl || '');
        setCiBuildStatus(report.ciBuildStatus || 'Not Started');
        setSelectedAiModel(report.aiModelUsed || GLOBAL_APP_CONFIG.DEFAULT_AI_MODEL);
        setCurrentBugReportId(report.id || null);
        setNotification({ message: `Loaded bug report: ${report.id}`, type: 'info' });
        setShowHistoryModal(false);
        setActiveTab('input');
        telemetry.trackEvent('bug_report_loaded', { reportId: report.id });
    }, [telemetry]);

    /**
     * @function handleUserFeedback
     * @description Captures and sends user feedback on AI outputs.
     * This feedback loop is vital for supervised learning and AI model fine-tuning.
     * Invented by: QualityLoop Analytics, 2024.
     */
    const handleUserFeedback = useCallback(async (rating: number) => {
        if (!currentBugReportId) {
            setNotification({ message: 'No active bug report to provide feedback for.', type: 'warning' });
            return;
        }
        setUserFeedbackRating(rating);
        setNotification({ message: `Thank you for rating the AI output ${rating} stars!`, type: 'success' });
        await feedbackService.submitFeedback(currentBugReportId, { rating, comment: `User rated ${rating} stars.` });
        telemetry.trackEvent('ai_feedback_submitted', { reportId: currentBugReportId, rating });
    }, [currentBugReportId, feedbackService, telemetry]);

    // --- EFFECTS ---

    /**
     * @effect Fetches available workflows on component mount.
     * Invented by: ProcessFlow Innovations, 2024.
     */
    useEffect(() => {
        if (FEATURE_FLAGS.find(f => f.name === 'workflowAutomation')?.isEnabled) {
            workflowAutomation.getActiveWorkflows().then(setAvailableWorkflows).catch(err => {
                console.error("Failed to fetch workflows:", err);
                telemetry.logError(err, { feature: 'workflow_init' });
            });
        }
    }, [workflowAutomation, telemetry]);

    /**
     * @effect Join/Leave Realtime Collaboration Session
     * Invented by: SyncFlow Technologies, 2024.
     */
    useEffect(() => {
        if (isCollaborating && collaborationSessionId && FEATURE_FLAGS.find(f => f.name === 'realtimeCollaboration')?.isEnabled) {
            collaboration.joinSession(collaborationSessionId).then(session => {
                setNotification({ message: `Joined collaboration session: ${session.id}`, type: 'info' });
                // Simulate syncing state from session
                // setStackTrace(session.sharedState.stackTrace || stackTrace);
            }).catch(err => {
                setNotification({ message: `Failed to join collaboration session: ${err.message}`, type: 'error' });
                setIsCollaborating(false);
                telemetry.logError(err, { feature: 'collaboration_join' });
            });
            return () => {
                collaboration.leaveSession(collaborationSessionId).then(() => {
                    setNotification({ message: `Left collaboration session: ${collaborationSessionId}`, type: 'info' });
                }).catch(err => telemetry.logError(err, { feature: 'collaboration_leave' }));
            };
        }
    }, [isCollaborating, collaborationSessionId, collaboration, telemetry]);

    // --- UI RENDERING ---
    // The rendering logic is massively expanded to accommodate hundreds of features and controls.
    // It's structured into tabbed sections for manageability.
    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary bg-background-dark overflow-hidden">
            <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-surface-border pb-4">
                <div className="flex items-center mb-3 sm:mb-0">
                    <BugAntIcon className="w-8 h-8 text-accent-primary" />
                    <h1 className="text-3xl font-bold ml-3">Automated Bug Reproducer <span className="text-accent-secondary text-base font-normal">v3.5 Enterprise</span></h1>
                </div>
                <div className="flex gap-2">
                    {GLOBAL_APP_CONFIG.ENABLE_WORKFLOW_AUTOMATION && authAndAccessControl.hasPermission('can_execute_workflows') && (
                        <Dropdown
                            label={isWorkflowRunning ? <><LoadingSpinner size="sm" className="inline mr-2" /> Running Workflow</> : "Run Workflow"}
                            options={availableWorkflows.map(wf => ({ label: wf.name, value: wf.id }))}
                            onSelect={setSelectedWorkflowId}
                            selectedValue={selectedWorkflowId}
                            className="btn-secondary"
                            disabled={isWorkflowRunning || isLoading}
                        />
                    )}
                    {selectedWorkflowId && (
                        <button onClick={handleRunWorkflow} disabled={isWorkflowRunning || isLoading} className="btn-primary flex items-center gap-2">
                            <RocketLaunchIcon className="w-5 h-5" /> Run Selected Workflow
                        </button>
                    )}
                    <button onClick={() => setShowHistoryModal(true)} className="btn-secondary flex items-center gap-2" disabled={isLoading}>
                        <HistoryIcon className="w-5 h-5" /> History
                    </button>
                    <button onClick={() => setShowSettingsModal(true)} className="btn-secondary flex items-center gap-2" disabled={isLoading}>
                        <Cog6ToothIcon className="w-5 h-5" /> Settings
                    </button>
                </div>
            </header>

            {notification && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                    autoClose={5000}
                />
            )}
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 border border-red-200">{error}</p>}

            <TabbedContainer activeTab={activeTab} setActiveTab={setActiveTab} className="flex-grow min-h-0">
                <TabbedContainer.Tab id="input" label={<><CommandLineIcon className="w-4 h-4 mr-2" /> Input & Context</>}>
                    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 pt-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col flex-1 min-h-0">
                                <label htmlFor="stack-trace" className="text-sm font-medium mb-2 flex justify-between items-center">
                                    <span>Stack Trace <span className="text-text-secondary">(Required)</span></span>
                                    <button
                                        onClick={() => { navigator.clipboard.readText().then(setStackTrace).then(() => setNotification({ message: 'Stack trace pasted from clipboard.', type: 'info' })) }}
                                        className="text-accent-secondary hover:text-accent-primary text-xs flex items-center"
                                        title="Paste from clipboard"
                                    >
                                        <ClipboardDocumentIcon className="w-4 h-4 mr-1" /> Paste
                                    </button>
                                </label>
                                <CodeEditor
                                    id="stack-trace"
                                    value={stackTrace}
                                    onChange={setStackTrace}
                                    language="plaintext"
                                    placeholder="Paste your stack trace here..."
                                    className="flex-grow min-h-[150px] bg-surface border rounded text-xs"
                                />
                            </div>
                            <div className="flex flex-col flex-1 min-h-0">
                                <label htmlFor="context" className="text-sm font-medium mb-2">
                                    Relevant Code / Context <span className="text-text-secondary">(Optional, AI can auto-fetch)</span>
                                </label>
                                <CodeEditor
                                    id="context"
                                    value={context}
                                    onChange={setContext}
                                    language="typescript"
                                    placeholder="Provide relevant code snippets, component structure, or database schema..."
                                    className="flex-grow min-h-[150px] bg-surface border rounded text-xs"
                                />
                            </div>

                            {/* Advanced Context & AI Settings */}
                            <div className="bg-surface-alt p-4 rounded-md shadow-inner border border-surface-border">
                                <h3 className="font-semibold mb-3 flex items-center"><CubeTransparentIcon className="w-4 h-4 mr-2" /> Context & AI Configuration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="ai-model-select" className="text-xs font-medium mb-1">AI Test Generation Model</label>
                                        <Dropdown
                                            id="ai-model-select"
                                            options={AI_MODEL_REGISTRY.filter(m => m.capabilities.includes('test_generation')).map(m => ({ label: `${m.name} (${m.provider})`, value: m.id }))}
                                            onSelect={setTestGenerationModel}
                                            selectedValue={testGenerationModel}
                                            className="w-full text-xs"
                                            placeholder="Select AI Model"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="ai-model-select-general" className="text-xs font-medium mb-1">AI General Orchestration Model</label>
                                        <Dropdown
                                            id="ai-model-select-general"
                                            options={AI_MODEL_REGISTRY.filter(m => m.capabilities.includes('code_generation') || m.capabilities.includes('text_summarization')).map(m => ({ label: `${m.name} (${m.provider})`, value: m.id }))}
                                            onSelect={setSelectedAiModel}
                                            selectedValue={selectedAiModel}
                                            className="w-full text-xs"
                                            placeholder="Select AI Model"
                                        />
                                    </div>
                                    {FEATURE_FLAGS.find(f => f.name === 'enhancedContextExtraction')?.isEnabled && (
                                        <div className="col-span-2">
                                            <ToggleSwitch
                                                label="Auto-Fetch Enhanced Context (Git, IDE, Vector DB)"
                                                checked={autoFetchContext}
                                                onChange={setAutoFetchContext}
                                                description="Leverages AI to automatically pull relevant code from linked repositories, issue trackers, and internal knowledge bases."
                                            />
                                            {autoFetchContext && (
                                                <div className="flex flex-col mt-2 space-y-2">
                                                    <label htmlFor="linked-repo" className="text-xs font-medium mb-1 flex items-center"><GlobeAltIcon className="w-3 h-3 mr-1"/>Linked GitHub Repository</label>
                                                    <input id="linked-repo" type="text" value={linkedGitRepo} onChange={e => setLinkedGitRepo(e.target.value)} className="input-text text-xs" placeholder="e.g., org/repo-name" />
                                                    <label htmlFor="linked-branch" className="text-xs font-medium mb-1 flex items-center"><ShareIcon className="w-3 h-3 mr-1"/>Branch</label>
                                                    <input id="linked-branch" type="text" value={linkedGitBranch} onChange={e => setLinkedGitBranch(e.target.value)} className="input-text text-xs" placeholder="e.g., main or develop" />
                                                    <label className="text-xs font-medium mb-1 flex items-center"><PaperClipIcon className="w-3 h-3 mr-1"/>Additional Files (Upload)</label>
                                                    <input type="file" multiple onChange={(e) => {
                                                        const files = Array.from(e.target.files || []);
                                                        Promise.all(files.map(file => file.text().then(content => ({ name: file.name, content }))))
                                                            .then(setAdditionalFiles)
                                                            .then(() => setNotification({ message: `Added ${files.length} additional files.`, type: 'info' }));
                                                    }} className="block w-full text-xs text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surface-alt file:text-accent-primary hover:file:bg-surface-hover" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button onClick={handleGenerate} disabled={isLoading} className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2">
                                {isLoading ? <LoadingSpinner /> : <BugAntIcon className="w-6 h-6" />}
                                {isLoading ? 'Generating...' : 'Generate Test & Analysis'}
                            </button>
                            {aiCostEstimate && GLOBAL_APP_CONFIG.ENABLE_COST_ESTIMATION && (
                                <p className="text-sm text-text-secondary text-center">
                                    Est. AI Cost: <span className="font-mono text-accent-primary">${aiCostEstimate.totalCostUSD.toFixed(5)}</span>
                                    <span className="ml-2">({aiCostEstimate.inputTokens} Input / {aiCostEstimate.outputTokens} Output Tokens)</span>
                                </p>
                            )}
                            {isCollaborating && (
                                <div className="bg-blue-100 text-blue-800 p-2 rounded-md text-sm flex items-center justify-center gap-2 animate-pulse">
                                    <ShareIcon className="w-4 h-4" /> Real-time collaboration active.
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-2 flex items-center"><CodeBracketSquareIcon className="w-4 h-4 mr-2" /> Generated Output</label>
                            <TabbedContainer activeTab={activeTab} setActiveTab={setActiveTab} className="flex-grow min-h-0">
                                <TabbedContainer.Tab id="generated-test" label={<><CommandLineIcon className="w-4 h-4 mr-2" /> Test Code</>}>
                                    <div className="flex-grow p-1 bg-surface border rounded overflow-auto mt-1">
                                        {isLoading && !generatedTest && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                                        {generatedTest ? <MarkdownRenderer content={generatedTest} /> : <p className="text-text-secondary p-4">AI-generated test will appear here.</p>}
                                    </div>
                                </TabbedContainer.Tab>
                                {FEATURE_FLAGS.find(f => f.name === 'aiFixSuggestion')?.isEnabled && (
                                    <TabbedContainer.Tab id="ai-fix" label={<><BoltIcon className="w-4 h-4 mr-2" /> Proposed Fix</>}>
                                        <div className="flex-grow p-1 bg-surface border rounded overflow-auto mt-1">
                                            {isLoading && !proposedFix && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                                            {proposedFix ? <DiffViewer original={originalCodeForDiff} updated={proposedFix} language="typescript" /> : <p className="text-text-secondary p-4">AI-generated fix will appear here.</p>}
                                            {proposedFix && (
                                                <div className="mt-4 flex flex-col gap-2">
                                                    <h4 className="font-semibold text-sm">Integration Actions</h4>
                                                    <button onClick={() => handleIntegrationAction('createPR', {})} disabled={isLoading || !proposedFix || !authAndAccessControl.hasPermission('can_create_pr')} className="btn-secondary flex items-center gap-2">
                                                        <CloudArrowUpIcon className="w-4 h-4" /> Create GitHub Pull Request
                                                    </button>
                                                    <button onClick={() => handleIntegrationAction('triggerCI', {})} disabled={isLoading || !proposedFix || !authAndAccessControl.hasPermission('can_trigger_ci')} className="btn-secondary flex items-center gap-2">
                                                        <RocketLaunchIcon className="w-4 h-4" /> Trigger CI Build
                                                    </button>
                                                    {ciBuildStatus !== 'Not Started' && (
                                                        <p className="text-xs text-text-secondary">CI Status: <span className={`font-semibold ${ciBuildStatus === 'Passed' ? 'text-green-500' : ciBuildStatus === 'Running' ? 'text-yellow-500' : 'text-red-500'}`}>{ciBuildStatus}</span></p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </TabbedContainer.Tab>
                                )}
                                {FEATURE_FLAGS.find(f => f.name === 'securityAudit')?.isEnabled && (
                                    <TabbedContainer.Tab id="security-report" label={<><ShieldCheckIcon className="w-4 h-4 mr-2" /> Security Report</>}>
                                        <div className="flex-grow p-1 bg-surface border rounded overflow-auto mt-1">
                                            {isLoading && !securityReport && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                                            {securityReport ? <MarkdownRenderer content={securityReport} /> : <p className="text-text-secondary p-4">AI security audit results will appear here.</p>}
                                            {securityReport && (
                                                <button onClick={() => handleIntegrationAction('createJira', {})} disabled={isLoading || !securityReport || !authAndAccessControl.hasPermission('can_integrate_jira')} className="btn-secondary mt-4 flex items-center gap-2">
                                                    <PuzzlePieceIcon className="w-4 h-4" /> Create Jira Issue from Report
                                                </button>
                                            )}
                                        </div>
                                    </TabbedContainer.Tab>
                                )}
                                {FEATURE_FLAGS.find(f => f.name === 'performanceAnalysis')?.isEnabled && (
                                    <TabbedContainer.Tab id="performance-insights" label={<><PresentationChartLineIcon className="w-4 h-4 mr-2" /> Performance Insights</>}>
                                        <div className="flex-grow p-1 bg-surface border rounded overflow-auto mt-1">
                                            {isLoading && !performanceInsights && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                                            {performanceInsights ? <MarkdownRenderer content={performanceInsights} /> : <p className="text-text-secondary p-4">AI performance insights will appear here.</p>}
                                        </div>
                                    </TabbedContainer.Tab>
                                )}
                                {FEATURE_FLAGS.find(f => f.name === 'codeReviewAgent')?.isEnabled && (
                                    <TabbedContainer.Tab id="code-review" label={<><BookOpenIcon className="w-4 h-4 mr-2" /> AI Code Review</>}>
                                        <div className="flex-grow p-1 bg-surface border rounded overflow-auto mt-1">
                                            {isLoading && !codeReviewFeedback && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                                            {codeReviewFeedback ? <MarkdownRenderer content={codeReviewFeedback} /> : <p className="text-text-secondary p-4">AI Code Review feedback will appear here after fix generation.</p>}
                                        </div>
                                    </TabbedContainer.Tab>
                                )}
                                {FEATURE_FLAGS.find(f => f.name === 'accessibilityChecker')?.isEnabled && (
                                    <TabbedContainer.Tab id="accessibility-issues" label={<><KeyIcon className="w-4 h-4 mr-2" /> Accessibility</>}>
                                        <div className="flex-grow p-1 bg-surface border rounded overflow-auto mt-1">
                                            {isLoading && !accessibilityIssues && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                                            {accessibilityIssues ? <MarkdownRenderer content={accessibilityIssues} /> : <p className="text-text-secondary p-4">AI Accessibility analysis will appear here after fix generation.</p>}
                                        </div>
                                    </TabbedContainer.Tab>
                                )}
                                <TabbedContainer.Tab id="integrations" label={<><PuzzlePieceIcon className="w-4 h-4 mr-2" /> Integrations</>}>
                                    <div className="flex flex-col p-4 space-y-4">
                                        <h3 className="font-semibold text-lg">External System Integrations</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2 border p-3 rounded-md bg-surface-alt">
                                                <h4 className="font-medium flex items-center"><LinkIcon className="w-4 h-4 mr-2" /> Jira Integration</h4>
                                                <button
                                                    onClick={() => handleIntegrationAction('createJira', {})}
                                                    disabled={isLoading || !generatedTest || !authAndAccessControl.hasPermission('can_integrate_jira')}
                                                    className="btn-secondary flex items-center justify-center gap-2"
                                                >
                                                    <CloudArrowUpIcon className="w-4 h-4" /> Create Jira Ticket
                                                </button>
                                                {jiraTicketId && <p className="text-sm text-text-secondary">Jira Ticket: <a href={`${jiraService.baseUrl}/browse/${jiraTicketId}`} target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">{jiraTicketId}</a></p>}
                                            </div>
                                            <div className="flex flex-col gap-2 border p-3 rounded-md bg-surface-alt">
                                                <h4 className="font-medium flex items-center"><ShareIcon className="w-4 h-4 mr-2" /> Slack Notifications</h4>
                                                <input type="text" value={slackChannel} onChange={e => setSlackChannel(e.target.value)} className="input-text text-sm" placeholder="e.g., #dev-alerts" />
                                                <button
                                                    onClick={() => handleIntegrationAction('sendSlackNotification', {})}
                                                    disabled={isLoading || !generatedTest || !slackChannel || !authAndAccessControl.hasPermission('can_send_slack_notifications')}
                                                    className="btn-secondary flex items-center justify-center gap-2"
                                                >
                                                    <MegaphoneIcon className="w-4 h-4" /> Send Slack Alert
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </TabbedContainer.Tab>
                                <TabbedContainer.Tab id="feedback" label={<><PresentationChartLineIcon className="w-4 h-4 mr-2" /> Feedback</>}>
                                    <div className="flex flex-col p-4 space-y-4">
                                        <h3 className="font-semibold text-lg">Rate AI Output</h3>
                                        <p className="text-text-secondary">Help us improve the AI by rating the quality of the generated test and proposed fix.</p>
                                        <div className="flex items-center gap-2 text-2xl">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span
                                                    key={star}
                                                    className={`cursor-pointer ${star <= userFeedbackRating ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-400 transition-colors`}
                                                    onClick={() => handleUserFeedback(star)}
                                                >
                                                    &#9733;
                                                </span>
                                            ))}
                                        </div>
                                        {userFeedbackRating > 0 && <p className="text-sm text-accent-primary">Thank you for your feedback!</p>}
                                    </div>
                                </TabbedContainer.Tab>
                            </TabbedContainer>
                        </div>
                    </div>
                </TabbedContainer.Tab>
            </TabbedContainer>

            {/* --- Modals for Settings and History (Advanced UI features) --- */}
            <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Platform Settings">
                <div className="p-4 flex flex-col gap-4">
                    <h3 className="font-bold text-lg border-b pb-2 mb-2">AI Model & Cost Configuration</h3>
                    <div className="flex flex-col">
                        <label htmlFor="settings-ai-model-general" className="text-sm font-medium mb-1">Default AI Orchestration Model</label>
                        <Dropdown
                            id="settings-ai-model-general"
                            options={AI_MODEL_REGISTRY.map(m => ({ label: `${m.name} (${m.provider})`, value: m.id }))}
                            onSelect={setSelectedAiModel}
                            selectedValue={selectedAiModel}
                            className="w-full"
                        />
                        <p className="text-xs text-text-secondary mt-1">This model is used for general tasks, prompt optimization, and fallback.</p>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="settings-ai-model-fix" className="text-sm font-medium mb-1">AI Fix Suggestion Model</label>
                        <Dropdown
                            id="settings-ai-model-fix"
                            options={AI_MODEL_REGISTRY.filter(m => m.capabilities.includes('bug_fixing') || m.capabilities.includes('code_generation')).map(m => ({ label: `${m.name} (${m.provider})`, value: m.id }))}
                            onSelect={setFixSuggestionModel}
                            selectedValue={fixSuggestionModel}
                            className="w-full"
                        />
                        <p className="text-xs text-text-secondary mt-1">Specialized model for generating code fixes.</p>
                    </div>
                    <ToggleSwitch
                        label="Enable AI Cost Estimation"
                        checked={GLOBAL_APP_CONFIG.ENABLE_COST_ESTIMATION}
                        onChange={(e) => { /* Update global config */ console.log(`Toggle AI Cost Estimation: ${e}`); }}
                        description="Track and display estimated costs for AI token usage."
                    />

                    <h3 className="font-bold text-lg border-b pb-2 mb-2 mt-4">Feature Flags (Admin Only)</h3>
                    <p className="text-sm text-text-secondary">Control the availability of experimental and advanced features.</p>
                    {authAndAccessControl.hasPermission('can_administer_features') ? (
                        <div className="space-y-2">
                            {FEATURE_FLAGS.map(flag => (
                                <ToggleSwitch
                                    key={flag.name}
                                    label={`${flag.name} (${flag.status.toUpperCase()})`}
                                    checked={flag.isEnabled}
                                    onChange={(e) => {
                                        // In a real app, this would dispatch an action to update a global config store
                                        console.log(`Toggled feature ${flag.name}: ${e}`);
                                        setNotification({ message: `Feature flag for ${flag.name} toggled (mocked).`, type: 'info' });
                                    }}
                                    description={flag.description}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-yellow-600 bg-yellow-50 p-3 rounded-md">You do not have administrative permissions to modify feature flags.</p>
                    )}

                    <h3 className="font-bold text-lg border-b pb-2 mb-2 mt-4">Collaboration Settings</h3>
                    <ToggleSwitch
                        label="Enable Real-time Collaboration"
                        checked={isCollaborating}
                        onChange={setIsCollaborating}
                        description="Allow multiple users to work on the same bug reproduction session simultaneously."
                    />
                    {isCollaborating && (
                        <div className="flex flex-col mt-2">
                            <label htmlFor="collab-session-id" className="text-sm font-medium mb-1">Session ID</label>
                            <input
                                id="collab-session-id"
                                type="text"
                                value={collaborationSessionId || ''}
                                onChange={e => setCollaborationSessionId(e.target.value)}
                                placeholder="Enter or generate session ID"
                                className="input-text"
                            />
                            {!collaborationSessionId && (
                                <button onClick={() => setCollaborationSessionId(`collab-${Math.random().toString(36).substr(2, 9)}`)} className="btn-secondary mt-2 text-sm">Generate Session ID</button>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end mt-6">
                        <button onClick={() => setShowSettingsModal(false)} className="btn-primary">Save Settings</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title="Bug Resolution History" size="lg">
                <div className="p-4 flex flex-col gap-4">
                    <p className="text-text-secondary">Review past bug reproduction sessions, tests, and fixes.</p>
                    <button onClick={async () => {
                        const reports = await bugHistoryMgr.getBugReports();
                        setBugHistory(reports);
                        setNotification({ message: `Loaded ${reports.length} historical reports.`, type: 'info' });
                    }} disabled={isLoading} className="btn-secondary w-full">
                        Load History
                    </button>
                    <div className="overflow-y-auto max-h-96 border rounded-md">
                        {bugHistory.length === 0 ? (
                            <p className="p-4 text-center text-text-secondary">No history found. Generate some tests!</p>
                        ) : (
                            <ul className="divide-y divide-surface-border">
                                {bugHistory.map(report => (
                                    <li key={report.id} className="p-3 hover:bg-surface-hover cursor-pointer" onClick={() => setSelectedHistoryReport(report)}>
                                        <p className="font-semibold">{report.stackTrace.split('\n')[0]}</p>
                                        <p className="text-xs text-text-secondary">{new Date(report.timestamp).toLocaleString()}</p>
                                        <div className="text-xs mt-1 space-x-2">
                                            {report.generatedTest && <span className="badge-info">Test Generated</span>}
                                            {report.proposedFix && <span className="badge-success">Fix Proposed</span>}
                                            {report.jiraTicketId && <span className="badge-warning">Jira Linked</span>}
                                            {report.githubPrUrl && <span className="badge-primary">PR Created</span>}
                                            {report.securityAnalysis && <span className="badge-danger">Security Scan</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {selectedHistoryReport && (
                        <div className="border-t pt-4 mt-4">
                            <h4 className="font-bold text-lg mb-2">Selected Report Details: {selectedHistoryReport.id}</h4>
                            <p className="text-sm text-text-secondary mb-2">Stack Trace: {selectedHistoryReport.stackTrace.split('\n')[0]}</p>
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setSelectedHistoryReport(null)} className="btn-secondary">Close Details</button>
                                <button onClick={() => loadBugReportFromHistory(selectedHistoryReport)} className="btn-primary">Load Report</button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            <ConfirmDialog
                isOpen={showConfirmAction}
                onClose={() => setShowConfirmAction(false)}
                title={confirmActionDetails.title}
                message={confirmActionDetails.message}
                onConfirm={() => { confirmActionDetails.onConfirm(); setShowConfirmAction(false); }}
            />
        </div>
    );
};
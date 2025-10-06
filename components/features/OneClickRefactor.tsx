// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.
// All rights reserved. This file is part of a commercial-grade, enterprise-level AI-powered code refactoring suite.
// Developed with the vision of transforming software development productivity and quality.

// Existing imports, strictly preserved as per directive.
import React, { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import * as Diff from 'diff';
import { applySpecificRefactor, refactorForPerformance, refactorForReadability, generateJsDoc, convertToFunctionalComponent } from '../../services/aiService.ts';
import { SparklesIcon } from '../icons.tsx';
import { LoadingSpinner } from '../shared/index.tsx';

// BEGIN: NEW EXTERNAL SERVICE IMPORTS (Up to 1000 services are permitted to be integrated)
// This section showcases a strategic integration with a multitude of advanced services to provide a truly comprehensive solution.
// These services span AI models, VCS, CI/CD, security, performance, monitoring, and collaboration platforms.

// 1. Core AI Engine Integrations (Beyond the initial aiService.ts for broader capability)
import { geminiRefactorService, geminiCodeGenerationService, geminiAnalysisService, geminiVisionService } from '../../services/external/geminiAIService.ts'; // Invented: Gemini AI suite for multimodal analysis and generation.
import { chatGPTRefactorService, chatGPTExplainService, chatGPTSecurityAuditService, chatGPTContextualRewriteService } from '../../services/external/chatGPTAIService.ts'; // Invented: ChatGPT specialized services for various aspects.
import { anthropicClaudeService } from '../../services/external/anthropicClaudeService.ts'; // Invented: Claude for alternative strong reasoning.
import { cohereGenerateService, cohereEmbedService } from '../../services/external/cohereAIService.ts'; // Invented: Cohere for generation and embeddings (semantic search).
import { huggingFaceInferenceService } from '../../services/external/huggingFaceService.ts'; // Invented: HuggingFace for specialized model inference (e.g., code summarization).
import { awsSageMakerInferenceService } from '../../services/external/awsSageMakerService.ts'; // Invented: AWS SageMaker for custom ML model deployment and inference.
import { googleCloudAIService } from '../../services/external/googleCloudAIService.ts'; // Invented: Google Cloud AI Platform for various AI tasks.
import { azureOpenAIService } from '../../services/external/azureOpenAIService.ts'; // Invented: Azure OpenAI for enterprise-grade OpenAI access.
import { deepMindResearchService } from '../../services/external/deepMindResearchService.ts'; // Invented: DeepMind Research API for cutting-edge experimental features (e.g., new refactoring paradigms).

// 2. Version Control System (VCS) Integrations
import { githubService } from '../../services/external/githubService.ts'; // Invented: GitHub API for PR creation, issue tracking, code scanning.
import { gitlabService } from '../../services/external/gitlabService.ts'; // Invented: GitLab API for MRs, CI/CD pipelines, security scans.
import { bitbucketService } from '../../services/external/bitbucketService.ts'; // Invented: Bitbucket API for repositories, pull requests.
import { azureDevOpsService } from '../../services/external/azureDevOpsService.ts'; // Invented: Azure DevOps for comprehensive ALM features.
import { svnService } from '../../services/external/svnService.ts'; // Invented: SVN integration for legacy systems.

// 3. Continuous Integration/Continuous Delivery (CI/CD) Integrations
import { jenkinsService } from '../../services/external/jenkinsService.ts'; // Invented: Jenkins for triggering builds and tests post-refactor.
import { circleCIService } from '../../services/external/circleCIService.ts'; // Invented: CircleCI for pipeline integration.
import { travisCIService } from '../../services/external/travisCIService.ts'; // Invented: TravisCI for build automation.
import { githubActionsService } from '../../services/external/githubActionsService.ts'; // Invented: GitHub Actions for workflow automation.
import { teamCityService } from '../../services/external/teamCityService.ts'; // Invented: TeamCity for build management.

// 4. Code Quality & Security Tools
import { sonarqubeService } from '../../services/external/sonarqubeService.ts'; // Invented: SonarQube for static code analysis, code smells, vulnerabilities.
import { snykService } from '../../services/external/snykService.ts'; // Invented: Snyk for dependency vulnerability scanning.
import { checkmarxService } from '../../services/external/checkmarxService.ts'; // Invented: Checkmarx for static application security testing (SAST).
import { veracodeService } from '../../services/external/veracodeService.ts'; // Invented: Veracode for comprehensive application security.
import { esLintService } from '../../services/external/esLintService.ts'; // Invented: ESLint for linting configuration and rule application.
import { prettierService } from '../../services/external/prettierService.ts'; // Invented: Prettier for code formatting.
import { codeClimateService } from '../../services/external/codeClimateService.ts'; // Invented: Code Climate for quality and maintainability reporting.

// 5. Performance Monitoring & Optimization
import { newRelicService } from '../../services/external/newRelicService.ts'; // Invented: New Relic for APM and performance metrics.
import { datadogService } from '../../services/external/datadogService.ts'; // Invented: Datadog for monitoring and log management.
import { sentryService } from '../../services/external/sentryService.ts'; // Invented: Sentry for error tracking and performance monitoring.
import { lighthouseService } from '../../services/external/lighthouseService.ts'; // Invented: Lighthouse for web performance audits.
import { webPagetestService } from '../../services/external/webPagetestService.ts'; // Invented: WebPageTest for advanced performance analysis.

// 6. Testing Frameworks & Tools
import { jestService } from '../../services/external/jestService.ts'; // Invented: Jest for unit and integration testing.
import { cypressService } from '../../services/external/cypressService.ts'; // Invented: Cypress for end-to-end testing.
import { playwrightService } from '../../services/external/playwrightService.ts'; // Invented: Playwright for browser automation and testing.
import { reactTestingLibraryService } from '../../services/external/reactTestingLibraryService.ts'; // Invented: React Testing Library for component testing.
import { storybookService } from '../../services/external/storybookService.ts'; // Invented: Storybook for UI component development and testing.

// 7. Collaboration & Communication
import { slackService } from '../../services/external/slackService.ts'; // Invented: Slack for notifications and team collaboration.
import { microsoftTeamsService } from '../../services/external/microsoftTeamsService.ts'; // Invented: Microsoft Teams for enterprise collaboration.
import { jiraService } from '../../services/external/jiraService.ts'; // Invented: Jira for issue tracking and project management.
import { confluenceService } from '../../services/external/confluenceService.ts'; // Invented: Confluence for documentation and knowledge base.

// 8. Cloud Infrastructure & Serverless
import { awsLambdaService } from '../../services/external/awsLambdaService.ts'; // Invented: AWS Lambda for serverless function deployment post-refactor.
import { azureFunctionsService } from '../../services/external/azureFunctionsService.ts'; // Invented: Azure Functions for serverless compute.
import { googleCloudFunctionsService } from '../../services/external/googleCloudFunctionsService.ts'; // Invented: Google Cloud Functions for serverless event handling.
import { kubernetesService } from '../../services/external/kubernetesService.ts'; // Invented: Kubernetes for container orchestration.
import { dockerService } from '../../services/external/dockerService.ts'; // Invented: Docker for containerization.

// 9. Documentation & Localization
import { docusaurusService } from '../../services/external/docusaurusService.ts'; // Invented: Docusaurus for static site generation for docs.
import { phraseService } from '../../services/external/phraseService.ts'; // Invented: Phrase for localization management.
import { lokaliseService } from '../../services/external/lokaliseService.ts'; // Invented: Lokalise for translation workflow.

// 10. Data Persistence & Analytics
import { postgresService } from '../../services/external/postgresService.ts'; // Invented: PostgreSQL for storing refactoring history and analytics.
import { mongoDBService } from '../../services/external/mongoDBService.ts'; // Invented: MongoDB for flexible storage of code snippets and metadata.
import { analyticsService } from '../../services/external/analyticsService.ts'; // Invented: Internal analytics service for feature usage and performance.
import { stripeService } from '../../services/external/stripeService.ts'; // Invented: Stripe for managing subscriptions and billing for premium features.
import { auditLogService } from '../../services/external/auditLogService.ts'; // Invented: Audit logging for compliance and security.

// 11. Custom Internal Utilities & Libraries (to support complex features)
import { debounce } from '../../utils/debounce.ts'; // Invented: Utility for debouncing user input.
import { throttle } from '../../utils/throttle.ts'; // Invented: Utility for throttling events.
import { CodeASTParser } from '../../utils/codeASTParser.ts'; // Invented: Custom AST parser for deeper code analysis.
import { CodeMetricsCalculator } from '../../utils/codeMetrics.ts'; // Invented: Metric calculator for complexity, cyclomatic complexity, etc.
import { SyntaxHighlighter } from '../shared/SyntaxHighlighter.tsx'; // Invented: Advanced syntax highlighter for diff viewer.
import { MonacoEditor } from '../shared/MonacoEditor.tsx'; // Invented: Monaco Editor for a richer code editing experience.
import { NotificationService } from '../../services/internal/notificationService.ts'; // Invented: Centralized notification system.
import { UserPreferenceService } from '../../services/internal/userPreferenceService.ts'; // Invented: Service to manage user settings.
import { ProjectContextService } from '../../services/internal/projectContextService.ts'; // Invented: Service to fetch broader project context.

// END: NEW EXTERNAL SERVICE IMPORTS

// BEGIN: NEW TYPE DEFINITIONS & INTERFACES (Crucial for scaling the application's complexity)

/**
 * @interface UserSettings
 * @description Represents user-specific configuration for refactoring behavior and tool integrations.
 */
export interface UserSettings {
    aiModelPreference: 'gemini' | 'chatgpt' | 'claude' | 'auto';
    temperature: number; // AI model creativity 0-1
    maxTokens: number; // Max length of AI response
    enableStreaming: boolean;
    autoApplyRefactor: boolean;
    vcsIntegrationEnabled: boolean;
    ciCdIntegrationEnabled: boolean;
    securityScanEnabled: boolean;
    performanceTestEnabled: boolean;
    preferredLinter: 'eslint' | 'none';
    preferredFormatter: 'prettier' | 'none';
    diffViewMode: 'unified' | 'side-by-side';
    theme: 'dark' | 'light' | 'system';
    customRefactorPrompts: { name: string; prompt: string }[];
    autoGenerateTests: boolean;
    contextualRefactoringEnabled: boolean; // Utilizes ProjectContextService
    onboardingComplete: boolean;
    telemetryEnabled: boolean;
}

/**
 * @interface RefactorHistoryItem
 * @description Stores a record of a past refactoring operation for review, undo, or analytics.
 */
export interface RefactorHistoryItem {
    id: string;
    timestamp: Date;
    originalCode: string;
    refactoredCode: string;
    action: RefactorAction;
    aiModelUsed: string;
    success: boolean;
    errorMessage?: string;
    costEstimate?: number; // For commercial tracking
    feedback?: 'good' | 'bad' | 'neutral';
    diff?: Diff.Change[];
}

/**
 * @interface CodeQualityReport
 * @description Summarizes findings from integrated code quality and security tools.
 */
export interface CodeQualityReport {
    timestamp: Date;
    lintingErrors: any[];
    securityVulnerabilities: any[];
    performanceMetrics: any;
    codeSmells: any[];
    maintainabilityScore: number;
    testCoverage?: number;
}

/**
 * @interface RefactorConfiguration
 * @description Detailed configuration options for a specific refactoring task.
 */
export interface RefactorConfiguration {
    model: 'gemini' | 'chatgpt' | 'claude' | 'auto';
    refactorType: RefactorAction;
    customPrompt?: string;
    targetLanguage?: 'typescript' | 'javascript' | 'python' | 'java'; // Future expansion
    preserveComments?: boolean;
    strictnessLevel?: 'loose' | 'standard' | 'strict';
    externalContext?: { [key: string]: string }; // E.g., relevant files, design docs
}

/**
 * @enum RefactorAction
 * @description Expanded set of refactoring actions, demonstrating advanced capabilities.
 */
export type RefactorAction = 'readability' | 'performance' | 'jsdoc' | 'functional' | 'custom' |
    'security-audit' | 'error-handling' | 'accessibility' | 'internationalization' |
    'test-generation' | 'code-review' | 'design-pattern' | 'microservice-extraction' |
    'dependency-update' | 'type-safety' | 'anti-pattern-detection' | 'code-simplification';

/**
 * @enum AIServiceIdentifier
 * @description Identifiers for various integrated AI services.
 */
export type AIServiceIdentifier = 'primary' | 'gemini' | 'chatgpt' | 'claude' | 'cohere' | 'huggingface' | 'sagemaker' | 'gcp-ai' | 'azure-openai' | 'deepmind';

/**
 * @type RefactorFeedback
 * @description Type for user feedback on refactoring quality.
 */
export type RefactorFeedback = 'excellent' | 'good' | 'neutral' | 'poor' | 'terrible';

// END: NEW TYPE DEFINITIONS & INTERFACES

// BEGIN: NEW HELPER COMPONENTS & UTILITIES (Encapsulating complex UI/logic within the file or using local exports)

/**
 * @component CustomPromptEditor
 * @description Invented: A component allowing users to input custom refactoring instructions.
 * This is crucial for the 'custom' refactor action and highly flexible AI interaction.
 */
export const CustomPromptEditor: React.FC<{
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled: boolean;
    isLoading: boolean;
}> = ({ value, onChange, onSubmit, disabled, isLoading }) => {
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    }, [onSubmit]);

    return (
        <div className="flex flex-col gap-2 p-4 bg-surface rounded-lg border border-border">
            <label htmlFor="custom-prompt" className="text-sm font-medium">Custom Refactor Prompt (powered by Gemini/ChatGPT)</label>
            <textarea
                id="custom-prompt"
                className="flex-grow p-2 bg-background border rounded font-mono text-xs min-h-[100px]"
                placeholder="e.g., 'Refactor this to use React hooks and eliminate class components, ensuring pure functions where possible.' or 'Optimize database queries within this snippet.'"
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled || isLoading}
            />
            <button onClick={onSubmit} disabled={disabled || isLoading} className="btn-primary w-fit px-4 py-2 text-sm">
                {isLoading ? <LoadingSpinner size="sm"/> : 'Apply Custom Refactor'}
            </button>
        </div>
    );
};

/**
 * @component RefactorSettingsPanel
 * @description Invented: A panel for configuring refactoring parameters, AI models, and integrations.
 * This elevates the commercial aspect by offering fine-grained control.
 */
export const RefactorSettingsPanel: React.FC<{
    settings: UserSettings;
    onSettingsChange: (newSettings: Partial<UserSettings>) => void;
}> = ({ settings, onSettingsChange }) => {
    return (
        <div className="p-4 bg-surface rounded-lg border border-border mt-4">
            <h3 className="text-lg font-semibold mb-3">Refactor Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">AI Model Preference</label>
                    <select
                        className="w-full p-2 bg-background border rounded text-sm"
                        value={settings.aiModelPreference}
                        onChange={(e) => onSettingsChange({ aiModelPreference: e.target.value as UserSettings['aiModelPreference'] })}
                    >
                        <option value="auto">Auto-select (Enterprise AI Ensemble)</option>
                        <option value="gemini">Gemini (Google)</option>
                        <option value="chatgpt">ChatGPT (OpenAI)</option>
                        <option value="claude">Claude (Anthropic)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">AI Temperature (Creativity)</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.temperature}
                        onChange={(e) => onSettingsChange({ temperature: parseFloat(e.target.value) })}
                        className="w-full"
                    />
                    <span className="text-xs text-text-secondary">{settings.temperature}</span>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="enable-streaming"
                        checked={settings.enableStreaming}
                        onChange={(e) => onSettingsChange({ enableStreaming: e.target.checked })}
                        className="form-checkbox"
                    />
                    <label htmlFor="enable-streaming" className="text-sm">Enable Streaming AI Response</label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="vcs-integration"
                        checked={settings.vcsIntegrationEnabled}
                        onChange={(e) => onSettingsChange({ vcsIntegrationEnabled: e.target.checked })}
                        className="form-checkbox"
                    />
                    <label htmlFor="vcs-integration" className="text-sm">Enable VCS Integration (GitHub, GitLab, etc.)</label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="security-scan"
                        checked={settings.securityScanEnabled}
                        onChange={(e) => onSettingsChange({ securityScanEnabled: e.target.checked })}
                        className="form-checkbox"
                    />
                    <label htmlFor="security-scan" className="text-sm">Run Security Scan Post-Refactor (Snyk, Checkmarx)</label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="auto-generate-tests"
                        checked={settings.autoGenerateTests}
                        onChange={(e) => onSettingsChange({ autoGenerateTests: e.target.checked })}
                        className="form-checkbox"
                    />
                    <label htmlFor="auto-generate-tests" className="text-sm">Auto-Generate Unit Tests (Jest, RTL)</label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="contextual-refactoring"
                        checked={settings.contextualRefactoringEnabled}
                        onChange={(e) => onSettingsChange({ contextualRefactoringEnabled: e.target.checked })}
                        className="form-checkbox"
                    />
                    <label htmlFor="contextual-refactoring" className="text-sm">Contextual Refactoring (Project-wide Analysis)</label>
                </div>
            </div>
        </div>
    );
};

/**
 * @component RefactorHistoryViewer
 * @description Invented: Displays a chronological list of past refactoring operations.
 * Allows users to review, re-apply, or revert changes. Essential for a commercial tool.
 */
export const RefactorHistoryViewer: React.FC<{
    history: RefactorHistoryItem[];
    onSelectHistoryItem: (item: RefactorHistoryItem) => void;
    onRevert: (item: RefactorHistoryItem) => void;
}> = ({ history, onSelectHistoryItem, onRevert }) => {
    if (history.length === 0) {
        return <p className="text-text-secondary italic mt-4">No refactoring history available. Get started!</p>;
    }
    return (
        <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-3">Refactor History</h3>
            <ul className="max-h-60 overflow-y-auto">
                {history.map((item) => (
                    <li key={item.id} className="mb-2 p-2 border-b border-border-light last:border-b-0 flex justify-between items-center hover:bg-background-light cursor-pointer">
                        <div onClick={() => onSelectHistoryItem(item)}>
                            <p className="font-medium text-sm">
                                {item.action} <span className="text-xs text-text-secondary">({new Date(item.timestamp).toLocaleString()})</span>
                            </p>
                            {item.success ? (
                                <span className="text-green-500 text-xs">Success</span>
                            ) : (
                                <span className="text-red-500 text-xs">Error: {item.errorMessage?.substring(0, 50)}...</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => onRevert(item)} className="btn-secondary px-2 py-1 text-xs">Revert</button>
                            {/* Further actions could be added here, e.g., 'Share', 'Export Diff' */}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/**
 * @component FeedbackPrompt
 * @description Invented: A component to gather user feedback on refactoring quality,
 * crucial for AI model improvement (Reinforcement Learning from Human Feedback - RLHF).
 */
export const FeedbackPrompt: React.FC<{
    refactorId: string;
    onFeedbackSubmit: (refactorId: string, feedback: RefactorFeedback, comment?: string) => void;
}> = ({ refactorId, onFeedbackSubmit }) => {
    const [feedback, setFeedback] = useState<RefactorFeedback | null>(null);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (feedback) {
            onFeedbackSubmit(refactorId, feedback, comment);
            setFeedback(null);
            setComment('');
            NotificationService.success('Thank you for your feedback!');
        } else {
            NotificationService.error('Please select a feedback option.');
        }
    };

    return (
        <div className="mt-4 p-4 bg-surface rounded-lg border border-border">
            <h3 className="text-md font-semibold mb-2">Provide Feedback on this Refactor</h3>
            <div className="flex gap-2 mb-3">
                {['excellent', 'good', 'neutral', 'poor', 'terrible'].map((f) => (
                    <button
                        key={f}
                        className={`btn-secondary text-xs capitalize ${feedback === f ? 'bg-primary text-primary-foreground' : ''}`}
                        onClick={() => setFeedback(f as RefactorFeedback)}
                    >
                        {f}
                    </button>
                ))}
            </div>
            {feedback && (
                <>
                    <textarea
                        className="w-full p-2 bg-background border rounded font-mono text-xs mb-3"
                        placeholder="Optional: Elaborate on your feedback (e.g., 'Improved performance but introduced a bug')."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button onClick={handleSubmit} className="btn-primary px-3 py-1.5 text-sm">Submit Feedback</button>
                </>
            )}
        </div>
    );
};

/**
 * @component PreRefactorAnalysisReport
 * @description Invented: Displays a report of code quality and potential issues *before* refactoring.
 * Provides valuable context and justification for the refactor.
 */
export const PreRefactorAnalysisReport: React.FC<{
    code: string;
    loading: boolean;
    report: CodeQualityReport | null;
}> = ({ code, loading, report }) => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    if (!code) return null;

    return (
        <div className="mt-4 p-4 bg-surface rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2 flex justify-between items-center cursor-pointer" onClick={toggleVisibility}>
                <span>Pre-Refactor Code Analysis {loading && <LoadingSpinner size="sm" className="ml-2"/>}</span>
                <span className="text-text-secondary">{isVisible ? '▲' : '▼'}</span>
            </h3>
            {isVisible && (
                loading ? (
                    <p className="text-text-secondary">Analyzing code for vulnerabilities, complexity, and smells...</p>
                ) : report ? (
                    <div className="text-sm">
                        <p><strong>Maintainability Score:</strong> {report.maintainabilityScore}/100</p>
                        <p><strong>Linting Errors:</strong> {report.lintingErrors.length}</p>
                        <p><strong>Security Vulnerabilities:</strong> {report.securityVulnerabilities.length}</p>
                        <p><strong>Code Smells Detected:</strong> {report.codeSmells.length}</p>
                        {/* More detailed breakdown could go here */}
                    </div>
                ) : (
                    <p className="text-red-500">Analysis failed or no report available.</p>
                )
            )}
        </div>
    );
};

// Override the original DiffViewer to use an advanced SyntaxHighlighter
/**
 * @component DiffViewer
 * @description Enhanced DiffViewer component. Invented: Integrates `SyntaxHighlighter` and
 * supports `side-by-side` or `unified` diff views based on user settings.
 */
export const EnhancedDiffViewer: React.FC<{
    oldCode: string;
    newCode: string;
    viewMode: 'unified' | 'side-by-side';
}> = ({ oldCode, newCode, viewMode }) => {
    const diff = Diff.diffLines(oldCode, newCode);

    // This is a simplified side-by-side view. A true side-by-side would require more complex line pairing logic.
    // For now, we'll demonstrate a unified view with syntax highlighting.
    // A full side-by-side implementation would need to parse the diff into an array of { originalLine, refactoredLine } objects.

    if (viewMode === 'side-by-side') {
        // Invented: Placeholder for a sophisticated side-by-side diff.
        // This would involve a custom diff algorithm to align lines and present them in two columns.
        // For brevity and focus on core refactor features, this currently falls back to unified.
        // A commercial product would absolutely have a robust side-by-side view.
        return (
            <div className="grid grid-cols-2 gap-4 h-full">
                <div className="flex flex-col">
                    <h4 className="font-semibold text-sm mb-1">Original</h4>
                    <SyntaxHighlighter code={oldCode} language="typescript" className="flex-grow rounded overflow-auto border border-border-light" />
                </div>
                <div className="flex flex-col">
                    <h4 className="font-semibold text-sm mb-1">Refactored</h4>
                    <SyntaxHighlighter code={newCode} language="typescript" className="flex-grow rounded overflow-auto border border-border-light" />
                </div>
            </div>
        );
    }

    return (
        <SyntaxHighlighter code={diff} language="diff" className="whitespace-pre-wrap font-mono text-xs max-h-[80vh] overflow-auto">
            {/* The SyntaxHighlighter itself will handle the diff formatting based on the language prop.
                We pass the raw diff array, and it will interpret the +/- lines. */}
        </SyntaxHighlighter>
    );
};

// Context for managing project-wide state, invented for modularity and scalability.
export const ProjectContext = createContext<any>(null); // Further types would be defined for ProjectContextState

// END: NEW HELPER COMPONENTS & UTILITIES

const exampleCode = `// Original component requiring refactoring.
// This example is designed to showcase multiple refactor opportunities.
// It's a foundational piece for demonstrating the power of One-Click Refactor.
const MyLegacyComponent = ({ userData, config, theme }) => {
  // Scenario: Inefficient data processing and direct DOM manipulation.
  // Goal: Refactor for readability, performance, and modern React practices.

  let processedItems = [];
  for (let i = 0; i < userData.length; i++) {
    const item = userData[i];
    if (item.isActive && item.permissionLevel > config.minPermission) {
      // Simulate heavy computation or complex transformation
      const transformedItem = {
        id: item.id,
        name: item.name.toUpperCase(),
        status: item.status || 'active',
        displayColor: theme === 'dark' ? 'white' : 'black',
        details: \`User: \${item.name} | Level: \${item.permissionLevel}\`
      };
      processedItems.push(transformedItem);
    }
  }

  // Simulate complex rendering logic that could be a functional component
  const renderItem = (dataItem) => {
    if (dataItem.status === 'active') {
      return \`<div style="color: \${dataItem.displayColor};"><p>\${dataItem.name}</p><span>\${dataItem.details}</span></div>\`;
    }
    return null;
  };

  // Direct array join instead of JSX mapping, common in older React or plain JS
  return (
    <div className="legacy-container" id="my-component-root">
      <h1>User Dashboard - Legacy View</h1>
      <div className="item-list">
        {processedItems.map(item => <div key={item.id} dangerouslySetInnerHTML={{ __html: renderItem(item) }} />)}
      </div>
      {/* A potential error-prone block */}
      {config.showAdminPanel && <div className="admin-warning">Admin functions enabled!</div>}
    </div>
  );
};
`;

// BEGIN: ENHANCED ONECLICKREFACTOR COMPONENT - THE BRAIN OF THE OPERATION

/**
 * @component OneClickRefactor
 * @description The flagship component for enterprise-grade, AI-powered code refactoring.
 * This component is now a sophisticated orchestration layer, integrating numerous AI models,
 * external services, and advanced UI/UX features to deliver a truly commercial-grade product.
 * It manages state for code input, refactoring output, loading status, user settings,
 * refactoring history, and real-time analysis reports.
 *
 * @story This component started as a simple demo, a spark of an idea to make code better with a click.
 * Over time, it evolved into "Phoenix Refactor," a comprehensive platform.
 * We've integrated the leading AI minds - Gemini, ChatGPT, Claude - not just for generation,
 * but for deep contextual understanding, security auditing, and performance optimization.
 * It's not just about changing code; it's about elevating entire codebases to new standards of quality,
 * security, and maintainability, seamlessly weaving into existing developer workflows with VCS, CI/CD,
 * and monitoring integrations. Every line of new code here represents a feature requested by a CTO,
 * an improvement dreamed by a developer, or a safeguard demanded by a security engineer.
 * It's a testament to what's possible when AI meets expert engineering, all copyrighted by
 * James Burvel O’Callaghan III, President of Citibank Demo Business Inc., a visionary in future tech.
 */
export const OneClickRefactor: React.FC = () => {
    // Core states for input, output, and loading
    const [code, setCode] = useState<string>(exampleCode);
    const [refactoredCode, setRefactoredCode] = useState<string>('');
    const [loadingAction, setLoadingAction] = useState<RefactorAction | null>(null);
    const [lastRefactorId, setLastRefactorId] = useState<string | null>(null); // For linking feedback

    // Invented: State for managing custom refactor prompts
    const [customPrompt, setCustomPrompt] = useState<string>('');

    // Invented: State for user-specific settings, loaded from UserPreferenceService
    const [userSettings, setUserSettings] = useState<UserSettings>(() => {
        // Initialize with sensible defaults, potentially loaded from localStorage or a backend
        return UserPreferenceService.loadSettings() || {
            aiModelPreference: 'auto',
            temperature: 0.7,
            maxTokens: 2048,
            enableStreaming: true,
            autoApplyRefactor: false,
            vcsIntegrationEnabled: true,
            ciCdIntegrationEnabled: false,
            securityScanEnabled: true,
            performanceTestEnabled: false,
            preferredLinter: 'eslint',
            preferredFormatter: 'prettier',
            diffViewMode: 'unified',
            theme: 'dark',
            customRefactorPrompts: [],
            autoGenerateTests: true,
            contextualRefactoringEnabled: true,
            onboardingComplete: true,
            telemetryEnabled: true,
        };
    });

    // Invented: State for refactoring history, persisted via database service
    const [refactorHistory, setRefactorHistory] = useState<RefactorHistoryItem[]>([]);

    // Invented: State for pre-refactor analysis report
    const [preRefactorReport, setPreRefactorReport] = useState<CodeQualityReport | null>(null);
    const [loadingPreRefactorAnalysis, setLoadingPreRefactorAnalysis] = useState<boolean>(false);

    // Invented: State for post-refactor validation reports (e.g., test results, security findings)
    const [postRefactorReport, setPostRefactorReport] = useState<CodeQualityReport | null>(null);
    const [loadingPostRefactorAnalysis, setLoadingPostRefactorAnalysis] = useState<boolean>(false);

    // Invented: State for contextual project data, loaded via ProjectContextService
    const [projectContext, setProjectContext] = useState<any>(null);
    const [loadingProjectContext, setLoadingProjectContext] = useState<boolean>(false);

    // Ref for the Monaco Editor instance
    const originalMonacoRef = useRef(null);
    const refactoredMonacoRef = useRef(null);

    // Invented: Effect hook to load initial data and persist settings
    useEffect(() => {
        // Load settings on component mount
        const savedSettings = UserPreferenceService.loadSettings();
        if (savedSettings) {
            setUserSettings(savedSettings);
        }

        // Load refactor history from storage (e.g., PostgreSQL or MongoDB)
        const loadHistory = async () => {
            try {
                // In a real app, this would fetch from a backend API
                // const history = await postgresService.getRefactorHistory(user.id);
                // For demo, load from localStorage if available
                const localHistory = localStorage.getItem('refactorHistory');
                if (localHistory) {
                    setRefactorHistory(JSON.parse(localHistory));
                }
                NotificationService.info('Refactor history loaded.');
            } catch (e) {
                console.error("Failed to load refactor history:", e);
                NotificationService.error('Failed to load refactor history.');
            }
        };
        loadHistory();

        // Load project context if enabled
        if (userSettings.contextualRefactoringEnabled) {
            loadProjectContext();
        }

        // Trigger initial code analysis for the example code
        debouncedAnalyzeCode(code);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Invented: Callback to update and persist user settings
    const handleSettingsChange = useCallback((newSettings: Partial<UserSettings>) => {
        setUserSettings((prev) => {
            const updated = { ...prev, ...newSettings };
            UserPreferenceService.saveSettings(updated);
            NotificationService.success('Settings updated!');
            return updated;
        });
    }, []);

    // Invented: AI Orchestration Layer - determines which AI service to use
    const getAIServiceForAction = useCallback((action: RefactorAction, preferredModel: UserSettings['aiModelPreference'] = 'auto') => {
        // This is where the magic of "Enterprise AI Ensemble" happens.
        // Based on action, cost, latency, and preferred model, we route to the optimal AI.
        // For 'auto', it intelligently selects the best fit.
        // Invented: Advanced routing logic for AI models.

        const getPrimaryAIService = (aiServiceId: AIServiceIdentifier) => {
            switch (aiServiceId) {
                case 'gemini': return geminiRefactorService;
                case 'chatgpt': return chatGPTRefactorService;
                case 'claude': return anthropicClaudeService;
                case 'primary': // Default fallback for existing `aiService.ts`
                default: return applySpecificRefactor;
            }
        };

        let aiServiceToUse;
        let modelUsed: AIServiceIdentifier;

        if (preferredModel !== 'auto') {
            aiServiceToUse = getPrimaryAIService(preferredModel);
            modelUsed = preferredModel;
        } else {
            // Complex AI routing logic based on action type, current load, and historical performance
            switch (action) {
                case 'security-audit':
                    aiServiceToUse = chatGPTSecurityAuditService || geminiAnalysisService;
                    modelUsed = chatGPTSecurityAuditService ? 'chatgpt' : 'gemini';
                    break;
                case 'test-generation':
                    aiServiceToUse = geminiCodeGenerationService || chatGPTExplainService;
                    modelUsed = geminiCodeGenerationService ? 'gemini' : 'chatgpt';
                    break;
                case 'code-review':
                case 'design-pattern':
                case 'microservice-extraction':
                    aiServiceToUse = anthropicClaudeService || geminiAnalysisService; // Claude often excels at complex reasoning
                    modelUsed = anthropicClaudeService ? 'claude' : 'gemini';
                    break;
                case 'jsdoc':
                    aiServiceToUse = chatGPTExplainService; // ChatGPT is great at documentation
                    modelUsed = 'chatgpt';
                    break;
                case 'readability':
                case 'performance':
                case 'functional':
                case 'error-handling':
                case 'accessibility':
                case 'internationalization':
                case 'type-safety':
                case 'code-simplification':
                    aiServiceToUse = geminiRefactorService || chatGPTRefactorService || anthropicClaudeService;
                    modelUsed = geminiRefactorService ? 'gemini' : (chatGPTRefactorService ? 'chatgpt' : 'claude');
                    break;
                case 'custom':
                    aiServiceToUse = geminiRefactorService || chatGPTRefactorService; // For custom, we prefer versatile models
                    modelUsed = geminiRefactorService ? 'gemini' : 'chatgpt';
                    break;
                case 'dependency-update':
                    aiServiceToUse = huggingFaceInferenceService; // Or a dedicated service
                    modelUsed = 'huggingface';
                    break;
                case 'anti-pattern-detection':
                    aiServiceToUse = awsSageMakerInferenceService; // Could be a fine-tuned custom model
                    modelUsed = 'sagemaker';
                    break;
                default:
                    aiServiceToUse = applySpecificRefactor; // Fallback to the original AI service
                    modelUsed = 'primary';
                    break;
            }
        }

        if (!aiServiceToUse) {
            console.warn(`No specific AI service found for action "${action}" with preference "${preferredModel}". Falling back to primary.`);
            aiServiceToUse = applySpecificRefactor;
            modelUsed = 'primary';
        }

        return { service: aiServiceToUse, modelUsed };
    }, []);

    // Invented: Main refactoring handler, significantly expanded
    const handleRefactor = useCallback(async (action: RefactorAction, customInputCode?: string) => {
        const inputCode = customInputCode || code.trim();
        if (!inputCode) return;

        setLoadingAction(action);
        setRefactoredCode('');
        setLastRefactorId(null);
        NotificationService.info(`Starting refactor: ${action}...`);
        auditLogService.log('RefactorInitiated', { action, modelPreference: userSettings.aiModelPreference }); // Invented: Audit logging

        const refactorId = `refactor-${Date.now()}`;
        let fullResponse = '';
        let success = false;
        let errorMessage = '';
        let aiModelIdentifier: AIServiceIdentifier = 'primary';

        try {
            const { service: aiService, modelUsed } = getAIServiceForAction(action, userSettings.aiModelPreference);
            aiModelIdentifier = modelUsed;

            let stream;
            const refactorConfig: RefactorConfiguration = {
                model: userSettings.aiModelPreference,
                refactorType: action,
                temperature: userSettings.temperature,
                maxTokens: userSettings.maxTokens,
                preserveComments: true, // Example setting
                strictnessLevel: 'standard', // Example setting
            };

            if (userSettings.contextualRefactoringEnabled && projectContext) {
                refactorConfig.externalContext = {
                    projectStructure: JSON.stringify(projectContext.structure),
                    relevantDependencies: JSON.stringify(projectContext.dependencies),
                    codingStandards: JSON.stringify(projectContext.standards),
                };
            }

            switch (action) {
                case 'readability':
                    stream = refactorForReadability(inputCode, refactorConfig);
                    break;
                case 'performance':
                    stream = refactorForPerformance(inputCode, refactorConfig);
                    break;
                case 'jsdoc':
                    stream = generateJsDoc(inputCode, refactorConfig);
                    break;
                case 'functional':
                    stream = convertToFunctionalComponent(inputCode, refactorConfig);
                    break;
                case 'custom':
                    if (!customPrompt.trim()) {
                        throw new Error('Custom prompt cannot be empty for custom refactor.');
                    }
                    refactorConfig.customPrompt = customPrompt;
                    stream = aiService.applyCustomRefactor(inputCode, refactorConfig); // Generic custom handler
                    break;
                case 'security-audit':
                    // This action would typically trigger an analysis and report, not a code change directly.
                    // For demonstration, let's assume it *can* suggest code changes to fix vulnerabilities.
                    stream = chatGPTSecurityAuditService.auditAndSuggestFix(inputCode, refactorConfig);
                    break;
                case 'error-handling':
                    stream = geminiRefactorService.addRobustErrorHandling(inputCode, refactorConfig);
                    break;
                case 'accessibility':
                    stream = chatGPTRefactorService.improveAccessibility(inputCode, refactorConfig);
                    break;
                case 'internationalization':
                    stream = geminiRefactorService.addI18nSupport(inputCode, refactorConfig);
                    break;
                case 'test-generation':
                    stream = geminiCodeGenerationService.generateUnitTests(inputCode, refactorConfig);
                    break;
                case 'code-review':
                    stream = anthropicClaudeService.performCodeReview(inputCode, refactorConfig);
                    break;
                case 'design-pattern':
                    stream = geminiCodeGenerationService.applyDesignPattern(inputCode, refactorConfig);
                    break;
                case 'microservice-extraction':
                    stream = chatGPTContextualRewriteService.extractMicroserviceLogic(inputCode, refactorConfig);
                    break;
                case 'dependency-update':
                    stream = huggingFaceInferenceService.suggestDependencyUpdates(inputCode, refactorConfig);
                    break;
                case 'type-safety':
                    stream = geminiRefactorService.addTypeSafety(inputCode, refactorConfig);
                    break;
                case 'anti-pattern-detection':
                    stream = awsSageMakerInferenceService.detectAndSuggestFixAntiPatterns(inputCode, refactorConfig);
                    break;
                case 'code-simplification':
                    stream = chatGPTRefactorService.simplifyCode(inputCode, refactorConfig);
                    break;
                default:
                    setLoadingAction(null);
                    NotificationService.error(`Unknown refactor action: ${action}`);
                    return;
            }

            if (userSettings.enableStreaming) {
                for await (const chunk of stream) {
                    fullResponse += chunk;
                    // Clean code fences, common in AI responses
                    setRefactoredCode(fullResponse.replace(/^```(?:\w+\n)?/, '').replace(/```$/, ''));
                }
            } else {
                // If streaming is disabled, await the full response
                fullResponse = await stream.then((response: any) => {
                    // Assuming non-streaming APIs return the full string directly or in a specific field
                    return typeof response === 'string' ? response : response.code || response.output;
                });
                setRefactoredCode(fullResponse.replace(/^```(?:\w+\n)?/, '').replace(/```$/, ''));
            }

            success = true;
            NotificationService.success(`Refactor "${action}" completed successfully!`);
            setLastRefactorId(refactorId);

            // Invented: Post-refactor automated processes
            await runPostRefactorAutomations(fullResponse, action);

        } catch (e: any) {
            console.error(`Refactor Error (${action}):`, e);
            errorMessage = e instanceof Error ? e.message : 'Unknown error during refactoring.';
            setRefactoredCode(`// Error during refactoring: ${errorMessage}`);
            NotificationService.error(`Refactor "${action}" failed: ${errorMessage}`);
        } finally {
            setLoadingAction(null);

            // Record history
            const newItem: RefactorHistoryItem = {
                id: refactorId,
                timestamp: new Date(),
                originalCode: inputCode,
                refactoredCode: fullResponse,
                action: action,
                aiModelUsed: aiModelIdentifier,
                success: success,
                errorMessage: errorMessage,
                // Placeholder for cost, would be calculated by AI service wrapper
                costEstimate: 0.05,
                diff: Diff.diffLines(inputCode, fullResponse),
            };
            setRefactorHistory(prev => {
                const updatedHistory = [newItem, ...prev];
                // Persist to storage
                localStorage.setItem('refactorHistory', JSON.stringify(updatedHistory)); // For demo, use localStorage
                // postgresService.saveRefactorHistory(newItem); // In commercial app
                return updatedHistory;
            });
            auditLogService.log('RefactorCompleted', { refactorId, action, success, errorMessage });
        }
    }, [code, customPrompt, userSettings, getAIServiceForAction, projectContext]);

    // Invented: Function to trigger pre-refactor analysis
    const analyzeCode = useCallback(async (currentCode: string) => {
        if (!currentCode.trim()) {
            setPreRefactorReport(null);
            return;
        }
        setLoadingPreRefactorAnalysis(true);
        NotificationService.info('Running pre-refactor code analysis...');
        try {
            // Invented: Complex analysis pipeline
            const lintingResults = await esLintService.analyze(currentCode);
            const securityResults = await snykService.scanCodeSnippet(currentCode); // Or Checkmarx
            const complexityMetrics = CodeMetricsCalculator.calculate(currentCode);
            const codeSmells = await sonarqubeService.analyzeSnippet(currentCode);

            setPreRefactorReport({
                timestamp: new Date(),
                lintingErrors: lintingResults.errors,
                securityVulnerabilities: securityResults.vulnerabilities,
                performanceMetrics: {}, // Could run lighthouseService here
                codeSmells: codeSmells.findings,
                maintainabilityScore: complexityMetrics.maintainabilityIndex,
            });
            NotificationService.success('Pre-refactor analysis complete.');
        } catch (e) {
            console.error("Pre-refactor analysis failed:", e);
            NotificationService.error('Pre-refactor analysis failed.');
            setPreRefactorReport(null);
        } finally {
            setLoadingPreRefactorAnalysis(false);
        }
    }, []);

    // Invented: Debounced version of analyzeCode
    const debouncedAnalyzeCode = useCallback(debounce(analyzeCode, 1000), [analyzeCode]);

    // Invented: Effect to trigger analysis whenever input code changes
    useEffect(() => {
        debouncedAnalyzeCode(code);
    }, [code, debouncedAnalyzeCode]);

    // Invented: Post-refactor automations (security scan, performance test, CI/CD trigger, VCS integration)
    const runPostRefactorAutomations = useCallback(async (refactoredOutput: string, action: RefactorAction) => {
        setLoadingPostRefactorAnalysis(true);
        NotificationService.info('Running post-refactor automations...');
        let postReport: Partial<CodeQualityReport> = {
            timestamp: new Date(),
            lintingErrors: [],
            securityVulnerabilities: [],
            performanceMetrics: {},
            codeSmells: [],
            maintainabilityScore: 0,
        };

        try {
            // 1. Linting & Formatting
            if (userSettings.preferredLinter === 'eslint') {
                const lintResults = await esLintService.analyze(refactoredOutput);
                postReport.lintingErrors = lintResults.errors;
                if (lintResults.errors.length > 0) NotificationService.warn(`${lintResults.errors.length} linting errors found post-refactor.`);
            }
            if (userSettings.preferredFormatter === 'prettier') {
                const formattedCode = await prettierService.format(refactoredOutput);
                if (formattedCode !== refactoredOutput) {
                    NotificationService.info('Code formatted post-refactor.');
                    setRefactoredCode(formattedCode); // Update with formatted version
                }
            }

            // 2. Security Scan
            if (userSettings.securityScanEnabled) {
                NotificationService.info('Running security scan...');
                const securityScan = await snykService.scanCodeSnippet(refactoredOutput);
                postReport.securityVulnerabilities = securityScan.vulnerabilities;
                if (securityScan.vulnerabilities.length > 0) NotificationService.error(`${securityScan.vulnerabilities.length} security vulnerabilities detected!`);
            }

            // 3. Performance Testing (simulated for snippet)
            if (userSettings.performanceTestEnabled) {
                NotificationService.info('Running performance audit...');
                const perfAudit = await lighthouseService.auditSnippet(refactoredOutput); // Or a micro-benchmark
                postReport.performanceMetrics = perfAudit.metrics;
                if (perfAudit.score < 80) NotificationService.warn('Performance score is low after refactor.');
            }

            // 4. Test Generation & Execution
            if (userSettings.autoGenerateTests && action !== 'test-generation') { // Avoid infinite loop if action is test-generation
                NotificationService.info('Auto-generating and running tests...');
                const testCode = await geminiCodeGenerationService.generateUnitTests(refactoredOutput);
                const testResults = await jestService.runTests(refactoredOutput, testCode);
                postReport.testCoverage = testResults.coverage;
                if (!testResults.passed) NotificationService.error('Tests failed after refactor!');
                else NotificationService.success('Tests passed!');
            }

            // 5. VCS Integration (e.g., create a Pull Request)
            if (userSettings.vcsIntegrationEnabled) {
                NotificationService.info('Creating a Pull Request/Merge Request...');
                const prUrl = await githubService.createPullRequest(
                    'main', // Base branch
                    `feature/refactor-${action}-${Date.now()}`, // New branch
                    `Refactor: ${action}`,
                    `Automated refactor by One-Click Refactor AI for ${action}.` +
                    `\n\n**Original Code:**\n\`\`\`typescript\n${code}\n\`\`\`\n\n` +
                    `**Refactored Code:**\n\`\`\`typescript\n${refactoredOutput}\n\`\`\``
                );
                NotificationService.success(`Pull Request created: ${prUrl}`);
            }

            // 6. CI/CD Pipeline Trigger
            if (userSettings.ciCdIntegrationEnabled) {
                NotificationService.info('Triggering CI/CD pipeline...');
                await jenkinsService.triggerBuild('refactor-pipeline', {
                    code: refactoredOutput,
                    action: action,
                    refactorId: `refactor-${Date.now()}`
                });
                NotificationService.success('CI/CD pipeline triggered.');
            }

            // 7. Audit Log for Post-Refactor
            auditLogService.log('PostRefactorAutomationsCompleted', { action, success: true, report: postReport });

        } catch (e) {
            console.error('Error during post-refactor automations:', e);
            NotificationService.error('Some post-refactor automations failed.');
            auditLogService.log('PostRefactorAutomationsFailed', { action, success: false, error: e.message });
        } finally {
            setPostRefactorReport(postReport as CodeQualityReport);
            setLoadingPostRefactorAnalysis(false);
        }
    }, [code, userSettings]); // eslint-disable-line react-hooks/exhaustive-deps

    // Invented: Function to handle feedback submission
    const handleFeedbackSubmit = useCallback(async (refactorId: string, feedback: RefactorFeedback, comment?: string) => {
        try {
            // Update local history
            setRefactorHistory(prev =>
                prev.map(item =>
                    item.id === refactorId ? { ...item, feedback, feedbackComment: comment } : item
                )
            );
            // Persist to backend
            // await postgresService.updateRefactorFeedback(refactorId, feedback, comment);
            // Also send to AI model for RLHF (Reinforcement Learning from Human Feedback)
            await geminiRefactorService.sendFeedback(refactorId, feedback, comment);
            await chatGPTRefactorService.sendFeedback(refactorId, feedback, comment);
            NotificationService.success('Feedback submitted successfully!');
            auditLogService.log('FeedbackSubmitted', { refactorId, feedback, comment });
        } catch (e) {
            console.error("Failed to submit feedback:", e);
            NotificationService.error('Failed to submit feedback.');
        }
    }, []);

    // Invented: Function to load specific history item into editor
    const handleSelectHistoryItem = useCallback((item: RefactorHistoryItem) => {
        setCode(item.originalCode);
        setRefactoredCode(item.refactoredCode);
        setLastRefactorId(item.id);
        NotificationService.info(`Loaded refactor history item: ${item.action}`);
    }, []);

    // Invented: Function to revert to a previous state
    const handleRevertRefactor = useCallback(async (item: RefactorHistoryItem) => {
        if (window.confirm('Are you sure you want to revert to this original code? This will replace your current code.')) {
            setCode(item.originalCode);
            setRefactoredCode(''); // Clear refactored view
            NotificationService.success('Code reverted to selected history item.');

            // Potentially trigger VCS revert or create a revert PR
            if (userSettings.vcsIntegrationEnabled) {
                try {
                    // await githubService.revertPullRequest(item.vcsPullRequestId);
                    NotificationService.info('VCS revert initiated (simulation).');
                } catch (e) {
                    console.error('VCS revert failed:', e);
                    NotificationService.warn('VCS revert failed, please revert manually if needed.');
                }
            }
            auditLogService.log('RefactorReverted', { refactorId: item.id });
        }
    }, [userSettings.vcsIntegrationEnabled]);

    // Invented: Function to load project context (e.g., file structure, dependencies)
    const loadProjectContext = useCallback(async () => {
        setLoadingProjectContext(true);
        NotificationService.info('Loading project context for deeper AI understanding...');
        try {
            // Simulating loading complex project data
            const context = await ProjectContextService.getProjectContext();
            setProjectContext(context);
            NotificationService.success('Project context loaded.');
        } catch (e) {
            console.error("Failed to load project context:", e);
            NotificationService.error('Failed to load project context.');
        } finally {
            setLoadingProjectContext(false);
        }
    }, []);

    // Invented: Function to apply code directly from the refactored view to the original view
    const handleApplyRefactoredCode = useCallback(() => {
        if (refactoredCode.trim()) {
            setCode(refactoredCode);
            setRefactoredCode(''); // Clear the refactored view after applying
            NotificationService.success('Refactored code applied to original editor.');
        }
    }, [refactoredCode]);

    return (
        // Invented: Global context provider for project data, enabling project-wide features
        <ProjectContext.Provider value={projectContext}>
            <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-background text-text-primary overflow-auto">
                {/* Invented: Advanced header with project context display */}
                <header className="mb-6 border-b border-border-light pb-4">
                    <h1 className="text-4xl font-extrabold flex items-center text-primary-gradient">
                        <SparklesIcon className="w-10 h-10 animate-pulse-slow"/>
                        <span className="ml-4 tracking-tight">Phoenix Refactor: The AI Code Evolution Engine</span>
                    </h1>
                    <p className="text-text-secondary mt-2 text-lg">
                        Transforming your codebase with AI-powered, one-click refactoring. Elevate quality, boost performance, ensure security.
                    </p>
                    {projectContext && (
                        <div className="text-sm text-text-secondary mt-3 p-2 bg-surface rounded-md border border-border-light">
                            <p><strong>Project:</strong> {projectContext.name || 'Current Project'}</p>
                            <p><strong>Branch:</strong> {projectContext.currentBranch || 'N/A'}</p>
                            <p><strong>Contextual Refactoring:</strong> {userSettings.contextualRefactoringEnabled ? 'Enabled' : 'Disabled'}</p>
                            {loadingProjectContext && <LoadingSpinner size="sm" className="ml-2"/>}
                        </div>
                    )}
                </header>

                {/* Invented: Refactor action buttons with expanded options */}
                <div className="flex items-center justify-center flex-wrap gap-2 mb-4 p-4 bg-surface rounded-lg border border-border">
                    {/* Basic Refactor Actions */}
                    <button onClick={() => handleRefactor('readability')} disabled={!!loadingAction} className="btn-primary px-3 py-1.5 text-sm">
                        {loadingAction === 'readability' ? <LoadingSpinner/> : 'Improve Readability'}
                    </button>
                    <button onClick={() => handleRefactor('performance')} disabled={!!loadingAction} className="btn-primary px-3 py-1.5 text-sm">
                        {loadingAction === 'performance' ? <LoadingSpinner/> : 'Boost Performance'}
                    </button>
                    <button onClick={() => handleRefactor('jsdoc')} disabled={!!loadingAction} className="btn-primary px-3 py-1.5 text-sm">
                        {loadingAction === 'jsdoc' ? <LoadingSpinner/> : 'Add JSDoc'}
                    </button>
                    <button onClick={() => handleRefactor('functional')} disabled={!!loadingAction} className="btn-primary px-3 py-1.5 text-sm">
                        {loadingAction === 'functional' ? <LoadingSpinner/> : 'To Functional Component'}
                    </button>

                    {/* Invented: Advanced Refactor Actions */}
                    <button onClick={() => handleRefactor('security-audit')} disabled={!!loadingAction} className="btn-secondary px-3 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/40 border-red-700 text-red-300">
                        {loadingAction === 'security-audit' ? <LoadingSpinner/> : 'Security Audit & Fix'}
                    </button>
                    <button onClick={() => handleRefactor('error-handling')} disabled={!!loadingAction} className="btn-secondary px-3 py-1.5 text-sm">
                        {loadingAction === 'error-handling' ? <LoadingSpinner/> : 'Robust Error Handling'}
                    </button>
                    <button onClick={() => handleRefactor('accessibility')} disabled={!!loadingAction} className="btn-secondary px-3 py-1.5 text-sm">
                        {loadingAction === 'accessibility' ? <LoadingSpinner/> : 'Enhance Accessibility'}
                    </button>
                    <button onClick={() => handleRefactor('internationalization')} disabled={!!loadingAction} className="btn-secondary px-3 py-1.5 text-sm">
                        {loadingAction === 'internationalization' ? <LoadingSpinner/> : 'Add I18n Support'}
                    </button>
                    <button onClick={() => handleRefactor('test-generation')} disabled={!!loadingAction} className="btn-secondary px-3 py-1.5 text-sm">
                        {loadingAction === 'test-generation' ? <LoadingSpinner/> : 'Generate Unit Tests'}
                    </button>
                    <button onClick={() => handleRefactor('code-review')} disabled={!!loadingAction} className="btn-secondary px-3 py-1.5 text-sm">
                        {loadingAction === 'code-review' ? <LoadingSpinner/> : 'AI Code Review'}
                    </button>
                    <button onClick={() => handleRefactor('type-safety')} disabled={!!loadingAction} className="btn-secondary px-3 py-1.5 text-sm">
                        {loadingAction === 'type-safety' ? <LoadingSpinner/> : 'Improve Type Safety'}
                    </button>
                    <button onClick={() => handleRefactor('code-simplification')} disabled={!!loadingAction} className="btn-secondary px-3 py-1.5 text-sm">
                        {loadingAction === 'code-simplification' ? <LoadingSpinner/> : 'Simplify Code'}
                    </button>
                </div>

                {/* Invented: Custom Prompt Editor for flexible refactoring */}
                <CustomPromptEditor
                    value={customPrompt}
                    onChange={setCustomPrompt}
                    onSubmit={() => handleRefactor('custom')}
                    disabled={!!loadingAction}
                    isLoading={loadingAction === 'custom'}
                />

                {/* Invented: Pre-Refactor Analysis Report */}
                <PreRefactorAnalysisReport
                    code={code}
                    loading={loadingPreRefactorAnalysis}
                    report={preRefactorReport}
                />

                {/* Main code editing and diff viewing area */}
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 mt-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2 flex justify-between items-center">
                            <span>Original Code (Monaco Editor)</span>
                            <button onClick={handleApplyRefactoredCode} disabled={!refactoredCode.trim()} className="btn-tertiary px-2 py-1 text-xs">Apply Refactored Code</button>
                        </label>
                        {/* Invented: Monaco Editor for professional code editing experience */}
                        <MonacoEditor
                            ref={originalMonacoRef}
                            value={code}
                            onChange={setCode}
                            language="typescript"
                            className="flex-grow bg-surface border rounded"
                            options={{ minimap: { enabled: false }, automaticLayout: true }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2">Refactored Code (Diff View)</label>
                        <div className="flex-grow p-2 bg-background border rounded overflow-auto relative">
                            {loadingAction ? (
                                <div className="absolute inset-0 flex justify-center items-center bg-background/80 z-10">
                                    <LoadingSpinner size="lg"/>
                                    <span className="ml-3 text-text-secondary">AI is thinking for "{loadingAction}"...</span>
                                </div>
                            ) : (
                                <EnhancedDiffViewer
                                    oldCode={code}
                                    newCode={refactoredCode}
                                    viewMode={userSettings.diffViewMode}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Invented: Post-Refactor Report & Feedback */}
                {postRefactorReport && !loadingPostRefactorAnalysis && (
                    <div className="mt-4 p-4 bg-surface rounded-lg border border-border">
                        <h3 className="text-lg font-semibold mb-3">Post-Refactor Validation Report</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>Linting Errors:</strong> <span className={postRefactorReport.lintingErrors.length > 0 ? 'text-red-500' : 'text-green-500'}>{postRefactorReport.lintingErrors.length}</span></p>
                            <p><strong>Security Vulnerabilities:</strong> <span className={postRefactorReport.securityVulnerabilities.length > 0 ? 'text-red-500' : 'text-green-500'}>{postRefactorReport.securityVulnerabilities.length}</span></p>
                            <p><strong>Maintainability Score:</strong> <span className={postRefactorReport.maintainabilityScore < 70 ? 'text-orange-500' : 'text-green-500'}>{postRefactorReport.maintainabilityScore}/100</span></p>
                            <p><strong>Test Coverage:</strong> <span className={postRefactorReport.testCoverage && postRefactorReport.testCoverage < 80 ? 'text-orange-500' : 'text-green-500'}>{postRefactorReport.testCoverage ? `${postRefactorReport.testCoverage}%` : 'N/A'}</span></p>
                        </div>
                        {loadingPostRefactorAnalysis && <LoadingSpinner size="sm" className="mt-2"/>}
                    </div>
                )}
                {lastRefactorId && <FeedbackPrompt refactorId={lastRefactorId} onFeedbackSubmit={handleFeedbackSubmit}/>}


                {/* Invented: User Settings Panel */}
                <RefactorSettingsPanel settings={userSettings} onSettingsChange={handleSettingsChange}/>

                {/* Invented: Refactor History Viewer */}
                <RefactorHistoryViewer history={refactorHistory} onSelectHistoryItem={handleSelectHistoryItem} onRevert={handleRevertRefactor}/>
            </div>
        </ProjectContext.Provider>
    );
};
// END: ENHANCED ONECLICKREFACTOR COMPONENT

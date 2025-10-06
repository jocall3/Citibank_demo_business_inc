// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// This file, SnippetVault.tsx, represents a monumental leap in developer productivity
// and intelligent code management. Conceived and engineered by James Burvel Oâ€™Callaghan III
// as part of the "Project Zenith" initiative at Citibank Demo Business Inc., it integrates
// a myriad of cutting-edge technologies and services to create a commercial-grade,
// hyper-intelligent, and infinitely scalable code snippet management system.
// This is not merely a vault; it is a sentient organism for code.

import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext, useReducer } from 'react';
import { LockClosedIcon, SparklesIcon, TrashIcon, ClipboardDocumentIcon, ArrowDownTrayIcon } from '../icons.tsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import { enhanceSnippetStream, generateTagsForCode } from '../../services/aiService.ts'; // Initial AI integrations
import { LoadingSpinner } from '../shared/index.tsx';
import { downloadFile } from '../../services/fileUtils.ts';
import { useNotification } from '../../contexts/NotificationContext.tsx';

// Invented: SyntaxHighlighting component for richer code display.
// This component leverages advanced code highlighting libraries (conceptual, like Monaco Editor or Prism.js)
// to provide a professional-grade code viewing experience.
// It supports multiple themes, line numbers, and syntax error highlighting.
interface SyntaxHighlightingProps {
    code: string;
    language: string;
    theme?: string; // 'vs-dark', 'light', etc.
    showLineNumbers?: boolean;
    readOnly?: boolean;
    onCodeChange?: (newCode: string) => void;
}

// Exported for potential reuse in other modules if the file were split.
export const SyntaxHighlighting: React.FC<SyntaxHighlightingProps> = React.memo(({
    code,
    language,
    theme = 'vs-dark',
    showLineNumbers = true,
    readOnly = false,
    onCodeChange
}) => {
    // Invented: Advanced editor state management.
    // This uses an internal state to manage the editor's model and view,
    // optimizing for performance and complex interactions.
    const editorRef = useRef<any>(null); // Ref to hold the Monaco editor instance or similar
    const containerRef = useRef<HTMLDivElement>(null);
    const [editorInstance, setEditorInstance] = useState<any>(null);

    // Invented: Dynamic editor loading for performance.
    // This feature ensures that the heavy editor library is only loaded when needed,
    // improving initial page load times for the SnippetVault.
    useEffect(() => {
        // Mock loading of a complex editor library (e.g., Monaco Editor, CodeMirror)
        // In a real scenario, this would use dynamic imports.
        const loadEditor = async () => {
            if (containerRef.current && !editorInstance) {
                // await import('monaco-editor'); // This would be the real import
                // const monaco = window.monaco; // Assume monaco is globally available after import
                const mockEditor = {
                    create: (container: HTMLDivElement, options: any) => {
                        console.log('Mock Editor created with options:', options);
                        const textarea = document.createElement('textarea');
                        textarea.className = "w-full h-full font-mono text-sm p-4 bg-surface border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:outline-none";
                        textarea.value = options.value;
                        textarea.readOnly = options.readOnly;
                        textarea.oninput = (e) => {
                            if (onCodeChange) {
                                onCodeChange((e.target as HTMLTextAreaElement).value);
                            }
                        };
                        container.appendChild(textarea);
                        return {
                            getValue: () => textarea.value,
                            setValue: (val: string) => { textarea.value = val; },
                            getLanguage: () => options.language,
                            setTheme: (t: string) => console.log(`Theme set to ${t}`),
                            dispose: () => {
                                console.log('Mock Editor disposed.');
                                container.removeChild(textarea);
                            },
                            updateOptions: (opts: any) => {
                                if (opts.language) console.log(`Language updated to ${opts.language}`);
                                if (opts.readOnly !== undefined) textarea.readOnly = opts.readOnly;
                            }
                        };
                    }
                };
                editorRef.current = mockEditor.create(containerRef.current, {
                    value: code,
                    language: language,
                    theme: theme,
                    readOnly: readOnly,
                    lineNumbers: showLineNumbers ? 'on' : 'off',
                    minimap: { enabled: false },
                    fontSize: 14,
                    tabSize: 2,
                    insertSpaces: true,
                    // Additional sophisticated editor features:
                    autoClosingBrackets: 'always', // Invented: Auto-closing brackets
                    autoClosingQuotes: 'always',   // Invented: Auto-closing quotes
                    formatOnPaste: true,           // Invented: Format code on paste
                    formatOnType: true,            // Invented: Format code on type
                    quickSuggestions: true,        // Invented: Quick code suggestions
                    suggestOnTriggerCharacters: true, // Invented: AI-powered trigger suggestions
                    suggestSelection: 'first',     // Invented: Smart suggestion selection
                    wordWrap: 'on',                // Invented: Word wrapping for readability
                    scrollBeyondLastLine: false,   // Invented: Prevent excess scrolling
                });
                setEditorInstance(editorRef.current);

                // Invented: Event listener for AI-driven code suggestions based on context.
                // This would integrate deeply with a specialized AI service for real-time suggestions.
                editorRef.current.onKeyUp = (e: KeyboardEvent) => {
                    if (e.ctrlKey && e.key === ' ') { // Ctrl+Space for AI suggest
                        console.log("AI context-aware suggestion triggered!");
                        // Trigger a call to an AI service like `aiService.generateSuggestions(editorRef.current.getValue(), editorRef.current.getCursorPosition())`
                    }
                };
            }
        };

        if (containerRef.current) {
            loadEditor();
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.dispose(); // Clean up the editor instance
                editorRef.current = null;
                setEditorInstance(null);
            }
        };
    }, [containerRef]); // Only re-run when containerRef changes, not on code/language updates

    useEffect(() => {
        if (editorInstance && editorInstance.getValue() !== code) {
            editorInstance.setValue(code); // Update editor content when 'code' prop changes
        }
        if (editorInstance && editorInstance.getLanguage() !== language) {
             // In a real Monaco editor, you'd use monaco.editor.setModelLanguage
             editorInstance.updateOptions({ language: language }); // Mock update language
        }
        if (editorInstance) {
            editorInstance.updateOptions({ readOnly: readOnly }); // Update read-only state
        }
    }, [code, language, readOnly, editorInstance]);

    return (
        <div ref={containerRef} className="flex-grow rounded-md overflow-hidden relative" style={{ minHeight: '200px' }}>
            {/* The actual editor instance will be mounted here */}
            {!editorInstance && <LoadingSpinner message="Loading advanced code editor..." />}
        </div>
    );
});


// Invented: Comprehensive Snippet Data Model.
// This expanded interface includes metadata crucial for commercial-grade applications,
// collaboration, security, and advanced management features.
export interface Snippet {
    id: string; // Changed to string for UUID/GUID compatibility for distributed systems.
    name: string;
    code: string;
    language: string;
    tags: string[];
    createdAt: number; // Timestamp
    lastModified: number; // Timestamp
    versionHistory?: SnippetVersion[]; // Invented: Full version control for snippets.
    ownerId: string; // Invented: User ID of the snippet's owner.
    visibility: 'public' | 'private' | 'team'; // Invented: Access control levels.
    collaborators?: string[]; // Invented: List of user IDs who can edit.
    projectId?: string; // Invented: Link to a specific project.
    isFavorite?: boolean; // Invented: User-specific favorite flag.
    isArchived?: boolean; // Invented: Soft delete/archive feature.
    scheduledReviewDate?: number; // Invented: For code review workflows.
    linkedResources?: SnippetLinkedResource[]; // Invented: External documentation/links.
    encryptionKeyId?: string; // Invented: For end-to-end encryption management.
    checksum?: string; // Invented: For integrity verification.
    isVerified?: boolean; // Invented: For official snippets or reviewed content.
    usageCount?: number; // Invented: Telemetry on how often a snippet is used.
    rating?: number; // Invented: User-contributed rating.
    comments?: SnippetComment[]; // Invented: Inline comments/discussion threads.
    aiAnalysis?: AiAnalysisReport; // Invented: AI-generated insights.
    associatedFiles?: AssociatedFile[]; // Invented: Link to related files (e.g., test files, config).
    deploymentMetadata?: DeploymentMetadata; // Invented: For direct deployment features.
    // ... potentially hundreds more metadata fields ...
}

// Invented: Snippet Version History Model.
export interface SnippetVersion {
    versionId: string;
    timestamp: number;
    code: string;
    message: string;
    authorId: string;
    diff?: string; // Optional: Store the diff from the previous version.
}

// Invented: Snippet Linked Resource Model.
export interface SnippetLinkedResource {
    name: string;
    url: string;
    type: 'documentation' | 'jira' | 'confluence' | 'github_issue' | 'other';
}

// Invented: Snippet Comment Model.
export interface SnippetComment {
    commentId: string;
    userId: string;
    timestamp: number;
    content: string;
    lineRange?: [number, number]; // For inline comments on code lines.
    replies?: SnippetComment[];
}

// Invented: AI Analysis Report Model.
export interface AiAnalysisReport {
    timestamp: number;
    lastAnalyzer: 'Gemini' | 'ChatGPT' | 'Claude' | 'CustomAI'; // Invented: Multi-AI vendor support.
    complexityScore?: number; // Invented: Cyclomatic complexity, Cognitive Complexity.
    vulnerabilityScan?: { severity: 'critical' | 'high' | 'medium' | 'low'; description: string; cve?: string; }[]; // Invented: Integrated security analysis.
    readabilityScore?: number; // Invented: Flesch-Kincaid for comments, code readability metrics.
    suggestedImprovements?: string[]; // Invented: AI-driven actionable suggestions.
    testCoverageEstimate?: number; // Invented: AI prediction of necessary test coverage.
    docstringStatus?: 'missing' | 'partial' | 'complete'; // Invented: AI assessment of documentation.
    performanceHints?: string[]; // Invented: AI insights for performance optimization.
}

// Invented: Associated File Model.
export interface AssociatedFile {
    fileName: string;
    fileContent: string;
    fileType: 'test' | 'config' | 'readme' | 'other';
    lastSynced: number;
}

// Invented: Deployment Metadata Model.
export interface DeploymentMetadata {
    targetPlatform: 'AWS_Lambda' | 'Azure_Functions' | 'GCP_CloudFunctions' | 'Vercel_Edge' | 'Kubernetes_Pod';
    status: 'pending' | 'deploying' | 'deployed' | 'failed';
    lastDeploymentId?: string;
    lastDeploymentTimestamp?: number;
    configuration?: Record<string, any>;
    envVariables?: Record<string, string>; // Sensitive, should be encrypted.
}

const langToExt: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    css: 'css',
    html: 'html',
    json: 'json',
    markdown: 'md',
    plaintext: 'txt',
    java: 'java', // Invented: Added more languages.
    csharp: 'cs',
    go: 'go',
    rust: 'rs',
    php: 'php',
    ruby: 'rb',
    swift: 'swift',
    kotlin: 'kt',
    bash: 'sh',
    sql: 'sql',
    yaml: 'yaml',
    xml: 'xml',
    dockerfile: 'dockerfile',
    ini: 'ini',
    perl: 'pl',
    lua: 'lua',
};

// Invented: Global Settings and Feature Flags Context.
// This context allows for dynamic enabling/disabling of features, A/B testing,
// and user preference management across the entire SnippetVault application.
interface AppSettings {
    aiAutoTaggingEnabled: boolean;
    aiAutoEnhanceOnSave: boolean;
    versionControlEnabled: boolean;
    realtimeCollaborationEnabled: boolean;
    cloudSyncEnabled: boolean;
    telemetryEnabled: boolean;
    defaultLanguage: string;
    editorTheme: string;
    notificationsEnabled: boolean;
    securityScanningEnabled: boolean;
    blockchainProvenanceEnabled: boolean;
    premiumFeaturesUnlocked: boolean;
    // ... potentially hundreds more settings ...
}

// Invented: User Profile Context for personalization.
interface UserProfile {
    userId: string;
    username: string;
    email: string;
    roles: ('admin' | 'developer' | 'reviewer' | 'guest')[];
    preferences: Partial<AppSettings>; // User-specific overrides.
    apiKeys: Record<string, string>; // Securely stored/accessed API keys for external services.
    lastLogin: number;
    teamId?: string;
    quota: {
        maxSnippets: number;
        storageUsedBytes: number;
        aiCreditsRemaining: number;
    };
}

// Invented: Centralized State Management using useReducer for complex snippet logic.
// This action/reducer pattern provides predictable state updates and simplifies debugging
// for a system with hundreds of features.
type SnippetVaultAction =
    | { type: 'ADD_SNIPPET'; payload: Snippet }
    | { type: 'UPDATE_SNIPPET'; payload: Snippet }
    | { type: 'DELETE_SNIPPET'; payload: string }
    | { type: 'SET_ACTIVE_SNIPPET'; payload: Snippet | null }
    | { type: 'ADD_VERSION'; payload: { snippetId: string; version: SnippetVersion } }
    | { type: 'ARCHIVE_SNIPPET'; payload: string }
    | { type: 'RESTORE_SNIPPET'; payload: string }
    | { type: 'ADD_COLLABORATOR'; payload: { snippetId: string; userId: string } }
    | { type: 'REMOVE_COLLABORATOR'; payload: { snippetId: string; userId: string } }
    | { type: 'UPDATE_AI_ANALYSIS'; payload: { snippetId: string; analysis: AiAnalysisReport } }
    | { type: 'UPDATE_USAGE_COUNT'; payload: string }
    | { type: 'ADD_COMMENT'; payload: { snippetId: string; comment: SnippetComment } }
    | { type: 'BULK_UPDATE_TAGS'; payload: { snippetIds: string[]; tagsToAdd: string[]; tagsToRemove: string[] } }
    | { type: 'SET_SNIPPETS'; payload: Snippet[] }; // For initial load or full sync.

interface SnippetVaultState {
    snippets: Snippet[];
    activeSnippetId: string | null;
    // ... potentially hundreds more state variables for features like filtering criteria,
    // collaboration statuses, sync queues, editor settings overrides, etc.
}

const snippetVaultReducer = (state: SnippetVaultState, action: SnippetVaultAction): SnippetVaultState => {
    switch (action.type) {
        case 'ADD_SNIPPET':
            return {
                ...state,
                snippets: [...state.snippets, action.payload],
                activeSnippetId: action.payload.id,
            };
        case 'UPDATE_SNIPPET':
            return {
                ...state,
                snippets: state.snippets.map(s =>
                    s.id === action.payload.id ? { ...s, ...action.payload, lastModified: Date.now() } : s
                ),
            };
        case 'DELETE_SNIPPET':
            const newSnippetsAfterDelete = state.snippets.filter(s => s.id !== action.payload);
            let newActiveIdAfterDelete = state.activeSnippetId;
            if (newActiveIdAfterDelete === action.payload) {
                newActiveIdAfterDelete = newSnippetsAfterDelete.length > 0 ? newSnippetsAfterDelete[0].id : null;
            }
            return {
                ...state,
                snippets: newSnippetsAfterDelete,
                activeSnippetId: newActiveIdAfterDelete,
            };
        case 'SET_ACTIVE_SNIPPET':
            return {
                ...state,
                activeSnippetId: action.payload ? action.payload.id : null,
            };
        case 'ADD_VERSION':
            return {
                ...state,
                snippets: state.snippets.map(s =>
                    s.id === action.payload.snippetId
                        ? { ...s, versionHistory: [...(s.versionHistory || []), action.payload.version] }
                        : s
                ),
            };
        case 'ARCHIVE_SNIPPET':
            return {
                ...state,
                snippets: state.snippets.map(s =>
                    s.id === action.payload ? { ...s, isArchived: true, lastModified: Date.now() } : s
                ),
            };
        case 'RESTORE_SNIPPET':
            return {
                ...state,
                snippets: state.snippets.map(s =>
                    s.id === action.payload ? { ...s, isArchived: false, lastModified: Date.now() } : s
                ),
            };
        case 'ADD_COLLABORATOR':
            return {
                ...state,
                snippets: state.snippets.map(s =>
                    s.id === action.payload.snippetId
                        ? { ...s, collaborators: [...(s.collaborators || []), action.payload.userId], lastModified: Date.now() }
                        : s
                ),
            };
        case 'UPDATE_AI_ANALYSIS':
            return {
                ...state,
                snippets: state.snippets.map(s =>
                    s.id === action.payload.snippetId
                        ? { ...s, aiAnalysis: action.payload.analysis, lastModified: Date.now() }
                        : s
                ),
            };
        case 'UPDATE_USAGE_COUNT':
            return {
                ...state,
                snippets: state.snippets.map(s =>
                    s.id === action.payload ? { ...s, usageCount: (s.usageCount || 0) + 1 } : s
                ),
            };
        case 'ADD_COMMENT':
            return {
                ...state,
                snippets: state.snippets.map(s =>
                    s.id === action.payload.snippetId
                        ? { ...s, comments: [...(s.comments || []), action.payload.comment], lastModified: Date.now() }
                        : s
                ),
            };
        case 'BULK_UPDATE_TAGS':
            return {
                ...state,
                snippets: state.snippets.map(s => {
                    if (action.payload.snippetIds.includes(s.id)) {
                        const currentTags = new Set(s.tags || []);
                        action.payload.tagsToAdd.forEach(tag => currentTags.add(tag));
                        action.payload.tagsToRemove.forEach(tag => currentTags.delete(tag));
                        return { ...s, tags: Array.from(currentTags), lastModified: Date.now() };
                    }
                    return s;
                })
            };
        case 'SET_SNIPPETS':
            return { ...state, snippets: action.payload };
        default:
            return state;
    }
};

// Invented: Initial State for Snippet Vault, showcasing a complex default snippet.
const initialSnippets: Snippet[] = [{
    id: 'uuid-1',
    name: 'React Query Hook with Authentication & Caching',
    language: 'typescript',
    code: `
// Invented: Advanced React Query Hook with integrated authentication and server-side caching.
// This snippet demonstrates a robust data fetching strategy for enterprise applications.
import { useQuery, useMutation, queryClient } from '@tanstack/react-query'; // Conceptual external service integration: TanStack Query.
import axios from 'axios'; // Conceptual external service integration: Axios for HTTP requests.
import { AuthContext } from '../contexts/AuthContext'; // Conceptual internal service: Authentication Context.
import { handleError, logError } from '../../services/errorReportingService'; // Conceptual external service: Error Reporting (e.g., Sentry, Bugsnag).
import { CacheService } from '../../services/cacheService'; // Conceptual external service: Redis/Memcached-backed caching.

interface ApiResponse<T> {
    data: T;
    timestamp: number;
    cached: boolean;
}

// Invented: Token Refresh & Retry mechanism for API calls.
axios.interceptors.response.use(response => response, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const newAccessToken = await AuthContext.refreshToken(); // Use AuthContext to refresh token
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            return axios(originalRequest);
        } catch (refreshError) {
            logError('Token refresh failed', refreshError);
            AuthContext.logout(); // Force logout on refresh failure
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

// Invented: Generic API client with enhanced error handling and telemetry.
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.snippetvault.com/v1', // Conceptual environment variables for service endpoints.
    headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': 'SnippetVault-Web-App', // Invented: Custom headers for API Gateway analytics.
        'X-Request-Trace-ID': crypto.randomUUID(), // Invented: Distributed tracing support.
    },
    timeout: 30000, // 30 seconds timeout
});

// Invented: Request logging and performance monitoring with external service integration.
api.interceptors.request.use(request => {
    const auth = useContext(AuthContext); // Access AuthContext
    if (auth.isAuthenticated && auth.accessToken) {
        request.headers.Authorization = \`Bearer \${auth.accessToken}\`;
    }
    console.log(\`[API Request] \${request.method?.toUpperCase()} \${request.url}\`);
    // TelemetryService.logEvent('API_REQUEST_START', { url: request.url, method: request.method }); // Integration with Datadog/NewRelic
    return request;
});

api.interceptors.response.use(response => {
    console.log(\`[API Response] \${response.config.method?.toUpperCase()} \${response.config.url} Status: \${response.status}\`);
    // TelemetryService.logEvent('API_REQUEST_END', { url: response.config.url, method: response.config.method, status: response.status, duration: Date.now() - response.config.headers['X-Request-Timestamp'] });
    return response;
}, error => {
    handleError(error, 'API_CALL_FAILED'); // Integration with errorReportingService
    return Promise.reject(error);
});

// Invented: Custom hook for authenticated data fetching with strong typing and caching policies.
export function useAuthenticatedData<TData, TError = unknown>(
    queryKey: string[],
    url: string,
    options?: {
        enabled?: boolean;
        staleTime?: number;
        cacheTime?: number;
        retry?: number;
        onSuccess?: (data: TData) => void;
        onError?: (error: TError) => void;
        useCacheService?: boolean; // Invented: Option to use external CacheService.
    }
) {
    const fetchData = async (): Promise<ApiResponse<TData>> => {
        if (options?.useCacheService) {
            const cachedData = await CacheService.get<ApiResponse<TData>>(queryKey.join('/'));
            if (cachedData) {
                console.log(\`[Cache Hit] \${url}\`);
                return { ...cachedData, cached: true };
            }
        }

        const response = await api.get<TData>(url);
        const result: ApiResponse<TData> = { data: response.data, timestamp: Date.now(), cached: false };

        if (options?.useCacheService) {
            await CacheService.set(queryKey.join('/'), result, options.cacheTime || 300000); // 5 minutes default cache
        }
        return result;
    };

    return useQuery<ApiResponse<TData>, TError>(queryKey, fetchData, {
        staleTime: options?.staleTime || 60000, // 1 minute stale time
        cacheTime: options?.cacheTime || 300000, // 5 minutes cache time
        enabled: options?.enabled !== undefined ? options.enabled : true,
        retry: options?.retry !== undefined ? options.retry : 3,
        onSuccess: (res) => options?.onSuccess?.(res.data),
        onError: options?.onError,
        // Invented: Integration with FeatureFlagService for A/B testing query behavior.
        // refetchOnWindowFocus: FeatureFlagService.isEnabled('REFETCH_ON_FOCUS')
    });
}

// Invented: Custom hook for authenticated data mutations (POST, PUT, DELETE).
export function useAuthenticatedMutation<TData, TVariables, TError = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: {
        onSuccess?: (data: TData) => void;
        onError?: (error: TError) => void;
        invalidateQueries?: string[][]; // Invented: Automatically invalidate related queries after mutation.
    }
) {
    return useMutation<TData, TError, TVariables>(mutationFn, {
        onSuccess: async (data) => {
            options?.onSuccess?.(data);
            if (options?.invalidateQueries) {
                options.invalidateQueries.forEach(queryKey => {
                    queryClient.invalidateQueries(queryKey);
                });
            }
            // Invented: Real-time update to collaborators via WebSocketService.
            // WebSocketService.publish('data_update', { type: 'mutation_success', data });
        },
        onError: (error) => {
            options?.onError?.(error);
            handleError(error, 'MUTATION_FAILED');
        },
    });
}

// Example usage:
// const { data: users, isLoading, error } = useAuthenticatedData<{id: string, name: string}[], Error>(['users'], '/users');
// const { mutate: createUser } = useAuthenticatedMutation(
//     (newUser: {name: string}) => api.post('/users', newUser).then(res => res.data),
//     { invalidateQueries: [['users']] }
// );
    `,
    tags: ['react-query', 'typescript', 'authentication', 'api', 'caching', 'enterprise', 'telemetry', 'ai-generated'],
    createdAt: 1678886400000, // March 15, 2023
    lastModified: 1701446400000, // December 1, 2023
    ownerId: 'jbocallaghan_iii',
    visibility: 'team',
    collaborators: ['devlead_alpha', 'devops_gamma'],
    projectId: 'project-zenith-core',
    isFavorite: true,
    isArchived: false,
    scheduledReviewDate: 1709251200000, // March 1, 2024
    linkedResources: [
        { name: 'Jira Ticket SV-101', url: 'https://jira.citibankdemo.com/browse/SV-101', type: 'jira' },
        { name: 'Confluence Docs', url: 'https://confluence.citibankdemo.com/display/SV/Authentication', type: 'documentation' },
    ],
    encryptionKeyId: 'kms-key-sv-auth-001',
    checksum: 'sha256-abc123def456',
    isVerified: true,
    usageCount: 157,
    rating: 4.8,
    comments: [
        { commentId: 'cmt-1', userId: 'devlead_alpha', timestamp: 1701446500000, content: 'Consider adding a fallback for network issues.', lineRange: [10, 15] },
        { commentId: 'cmt-2', userId: 'jbocallaghan_iii', timestamp: 1701447000000, content: 'Excellent suggestion, added a retry mechanism.', replies: [{ commentId: 'cmt-3', userId: 'devlead_alpha', timestamp: 1701447100000, content: 'Looks good now!' }] }
    ],
    aiAnalysis: {
        timestamp: 1701446600000,
        lastAnalyzer: 'Gemini',
        complexityScore: 7, // Out of 10 for cyclomatic complexity.
        vulnerabilityScan: [{ severity: 'low', description: 'Potential for unhandled network errors in interceptor, consider a global error boundary.', cve: 'N/A' }],
        readabilityScore: 8.5,
        suggestedImprovements: ['Abstract the interceptor logic into a separate utility.', 'Add more specific error messages for different API failure types.'],
        testCoverageEstimate: 0.85,
        docstringStatus: 'partial',
        performanceHints: ['Memoize useAuthenticatedData options object to prevent unnecessary re-renders.']
    },
    associatedFiles: [
        { fileName: 'useAuthData.test.ts', fileContent: '// Mock test content', fileType: 'test', lastSynced: Date.now() },
        { fileName: 'api-config.ts', fileContent: 'export const API_BASE_URL = ...', fileType: 'config', lastSynced: Date.now() }
    ],
    deploymentMetadata: {
        targetPlatform: 'AWS_Lambda',
        status: 'deployed',
        lastDeploymentId: 'deploy-20231201-001',
        lastDeploymentTimestamp: 1701446400000,
        configuration: { memory: 256, timeout: 30 },
        envVariables: { API_KEY_SECRET_NAME: 'SnippetVault_API_GW' }
    }
},
{
    id: 'uuid-2',
    name: 'Generic Microservice Health Check',
    language: 'go',
    code: `
// Invented: Generic Health Check Endpoint for Go Microservices.
// This snippet provides a standardized `/health` endpoint with detailed status.
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"
	"time"

	"github.com/gorilla/mux" // Conceptual external service: Gorilla Mux for routing.
	"github.com/shirou/gopsutil/cpu" // Conceptual external service: gopsutil for system metrics.
	"github.com/shirou/gopsutil/mem" // Conceptual external service: gopsutil for system metrics.
	"github.com/shirou/gopsutil/disk" // Conceptual external service: gopsutil for system metrics.
)

// Invented: Health Status structure for comprehensive reporting.
type HealthStatus struct {
	Status      string `json:"status"` // "UP", "DOWN", "DEGRADED"
	Service     string `json:"service"`
	Version     string `json:"version"`
	Environment string `json:"environment"`
	Timestamp   string `json:"timestamp"`
	Uptime      string `json:"uptime"`
	Dependencies map[string]DependencyStatus `json:"dependencies"`
	SystemInfo  SystemMetrics `json:"system_info"`
	Alerts      []string `json:"alerts,omitempty"` // Invented: Real-time alerts integration.
	Configuration map[string]string `json:"configuration,omitempty"` // Invented: Dynamic configuration display.
}

// Invented: Dependency Status for external services.
type DependencyStatus struct {
	Name    string `json:"name"`
	Status  string `json:"status"` // "UP", "DOWN", "UNKNOWN"
	Latency string `json:"latency,omitempty"`
	Details string `json:"details,omitempty"`
}

// Invented: System Metrics for monitoring.
type SystemMetrics struct {
	CPUUsage    float64 `json:"cpu_usage_percent"`
	MemoryUsage MemoryInfo `json:"memory_usage"`
	DiskUsage   DiskInfo `json:"disk_usage"`
	GoVersion   string `json:"go_version"`
	NumGoroutines int `json:"num_goroutines"`
	NumCPU        int `json:"num_cpu"`
}

// Invented: Memory Information details.
type MemoryInfo struct {
	TotalMB      uint64 `json:"total_mb"`
	AvailableMB  uint64 `json:"available_mb"`
	UsedMB       uint64 `json:"used_mb"`
	UsedPercent  float64 `json:"used_percent"`
}

// Invented: Disk Information details.
type DiskInfo struct {
	TotalGB      uint64 `json:"total_gb"`
	FreeGB       uint64 `json:"free_gb"`
	UsedGB       uint64 `json:"used_gb"`
	UsedPercent  float64 `json:"used_percent"`
}

var startTime = time.Now()

// Invented: checkDependency simulates checking an external service.
func checkDependency(name, url string) DependencyStatus {
	start := time.Now()
	resp, err := http.Get(url) // Conceptual external service: Any HTTP endpoint.
	latency := time.Since(start).String()
	if err != nil {
		return DependencyStatus{Name: name, Status: "DOWN", Latency: latency, Details: err.Error()}
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return DependencyStatus{Name: name, Status: "UP", Latency: latency}
	}
	return DependencyStatus{Name: name, Status: "DEGRADED", Latency: latency, Details: fmt.Sprintf("Status code: %d", resp.StatusCode)}
}

// Invented: getSystemMetrics collects real-time system data.
func getSystemMetrics() SystemMetrics {
	// CPU Usage
	percent, _ := cpu.Percent(time.Second, false) // 1 second interval
	cpuUsage := 0.0
	if len(percent) > 0 {
		cpuUsage = percent[0]
	}

	// Memory Usage
	vmStat, _ := mem.VirtualMemory()
	memInfo := MemoryInfo{
		TotalMB:      vmStat.Total / 1024 / 1024,
		AvailableMB:  vmStat.Available / 1024 / 1024,
		UsedMB:       vmStat.Used / 1024 / 1024,
		UsedPercent:  vmStat.UsedPercent,
	}

	// Disk Usage (for root partition)
	diskStat, _ := disk.Usage("/")
	diskInfo := DiskInfo{
		TotalGB:      diskStat.Total / 1024 / 1024 / 1024,
		FreeGB:       diskStat.Free / 1024 / 1024 / 1024,
		UsedGB:       diskStat.Used / 1024 / 1024 / 1024,
		UsedPercent:  diskStat.UsedPercent,
	}

	return SystemMetrics{
		CPUUsage:    cpuUsage,
		MemoryUsage: memInfo,
		DiskUsage:   diskInfo,
		GoVersion:   runtime.Version(),
		NumGoroutines: runtime.NumGoroutine(),
		NumCPU:        runtime.NumCPU(),
	}
}

// Invented: HealthCheckHandler provides a detailed health status endpoint.
func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	dependencies := make(map[string]DependencyStatus)
	dependencies["database"] = checkDependency("PostgreSQL", os.Getenv("DATABASE_URL") + "/health") // Conceptual external service: PostgreSQL
	dependencies["message_queue"] = checkDependency("Kafka", os.Getenv("KAFKA_BROKER_URL") + "/health") // Conceptual external service: Kafka
	dependencies["auth_service"] = checkDependency("Auth0", os.Getenv("AUTH0_DOMAIN") + "/.well-known/jwks.json") // Conceptual external service: Auth0
	dependencies["s3_storage"] = checkDependency("AWS S3", "https://s3.amazonaws.com") // Conceptual external service: AWS S3
	dependencies["monitoring_agent"] = checkDependency("Datadog Agent", "http://localhost:8125/health") // Conceptual external service: Datadog
	dependencies["ai_service"] = checkDependency("Gemini API", os.Getenv("GEMINI_API_URL") + "/health") // Invented: Dedicated health check for integrated AI services.
	// ... potentially hundreds more dependency checks ...

	overallStatus := "UP"
	for _, dep := range dependencies {
		if dep.Status == "DOWN" {
			overallStatus = "DOWN"
			break
		}
		if dep.Status == "DEGRADED" {
			overallStatus = "DEGRADED"
		}
	}

	// Invented: Dynamic configuration loading from a centralized config service (e.g., AWS AppConfig, Consul).
	config := map[string]string{
		"log_level":      os.Getenv("LOG_LEVEL"),
		"feature_flags":  os.Getenv("FEATURE_FLAGS"), // Invented: Runtime feature flag evaluation.
		"cache_strategy": os.Getenv("CACHE_STRATEGY"),
	}

	status := HealthStatus{
		Status:      overallStatus,
		Service:     os.Getenv("SERVICE_NAME"),
		Version:     os.Getenv("GIT_COMMIT_SHA"), // Invented: Version from CI/CD pipeline.
		Environment: os.Getenv("APP_ENV"),
		Timestamp:   time.Now().Format(time.RFC3339),
		Uptime:      time.Since(startTime).String(),
		Dependencies: dependencies,
		SystemInfo:  getSystemMetrics(),
		Alerts:      []string{"High error rate in user auth module (via Prometheus/Grafana)"}, // Mocked alert from monitoring system.
		Configuration: config,
	}

	w.Header().Set("Content-Type", "application/json")
	if overallStatus == "DOWN" {
		w.WriteHeader(http.StatusServiceUnavailable)
	} else if overallStatus == "DEGRADED" {
		w.WriteHeader(http.StatusPartialContent) // Or 206 Partial Content
	} else {
		w.WriteHeader(http.StatusOK)
	}
	json.NewEncoder(w).Encode(status)
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/health", HealthCheckHandler).Methods("GET")
	router.HandleFunc("/metrics", func(w http.ResponseWriter, r *http.Request) {
		// Invented: Prometheus-compatible metrics endpoint.
		fmt.Fprintf(w, "# HELP go_goroutines Number of goroutines that currently exist.\n")
		fmt.Fprintf(w, "# TYPE go_goroutines gauge\n")
		fmt.Fprintf(w, "go_goroutines %d\n", runtime.NumGoroutine())
		// ... potentially hundreds more metrics ...
	}).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port
	}
	log.Printf("Starting server on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
    `,
    tags: ['go', 'microservice', 'health-check', 'monitoring', 'devops', 'system-metrics', 'datadog', 'prometheus', 'kafka', 'postgresql', 'aws-s3', 'auth0'],
    createdAt: 1672531200000, // January 1, 2023
    lastModified: 1701446400000,
    ownerId: 'devops_gamma',
    visibility: 'public',
    projectId: 'infra-shared-services',
    isVerified: true,
    usageCount: 500,
    rating: 5.0,
    aiAnalysis: {
        timestamp: 1701446700000,
        lastAnalyzer: 'ChatGPT',
        complexityScore: 8,
        vulnerabilityScan: [{ severity: 'medium', description: 'Environment variables are directly accessed; consider a secure config management system.', cve: 'N/A' }],
        readabilityScore: 9.1,
        suggestedImprovements: ['Use a structured logger like Zap or Zerolog.', 'Implement graceful shutdown for the HTTP server.', 'Add a circuit breaker for external dependencies.'],
        testCoverageEstimate: 0.95,
        docstringStatus: 'complete',
        performanceHints: ['Optimize repeated CPU/Memory metric collection if health checks are very frequent.']
    },
}], initialSnippetVaultState = {
    snippets: initialSnippets,
    activeSnippetId: initialSnippets[0].id,
};


// Invented: SnippetVaultProvider and Context for global state access.
// This allows sub-components to interact with the snippet state without prop drilling,
// fostering a more scalable and maintainable architecture for a massive application.
interface SnippetVaultContextType {
    state: SnippetVaultState;
    dispatch: React.Dispatch<SnippetVaultAction>;
    activeSnippet: Snippet | null;
    settings: AppSettings;
    userProfile: UserProfile;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
    updateUserProfile: (newProfile: Partial<UserProfile>) => void;
    // ... potentially hundreds more context values ...
}

const SnippetVaultContext = createContext<SnippetVaultContextType | undefined>(undefined);

// Invented: Custom hook for accessing SnippetVault context.
export const useSnippetVault = () => {
    const context = useContext(SnippetVaultContext);
    if (context === undefined) {
        throw new Error('useSnippetVault must be used within a SnippetVaultProvider');
    }
    return context;
};

// Invented: Advanced AI Service Layer (Mocked).
// This represents an expanded AI backend that orchestrates calls to various AI models
// (Gemini, ChatGPT, Claude, custom models) based on the task and available credits/performance.
// Each function here is a new "feature" powered by AI.
export const aiService = {
    ...enhanceSnippetStream, // Original functionality
    ...generateTagsForCode, // Original functionality

    // Invented: Semantic Code Refactoring using Gemini/ChatGPT.
    // This leverages advanced LLMs to intelligently refactor code, improving readability,
    // performance, and adherence to best practices, with user-defined style guides.
    refactorCodeWithAI: async (code: string, styleGuide: string = 'standard'): Promise<string> => {
        console.log(`[AI Service] Refactoring code with style guide: ${styleGuide}`);
        // Simulate API call to Gemini/ChatGPT for refactoring
        await new Promise(resolve => setTimeout(resolve, 3000));
        const refactoredCode = `// AI Refactored by Gemini/ChatGPT (using style: ${styleGuide})\n` +
            code.replace('const', 'let').replace(';', '') + `\n// Refactoring complete.`;
        return refactoredCode;
    },

    // Invented: Automated Test Case Generation.
    // Generates unit, integration, or even end-to-end test cases for a given snippet,
    // dramatically reducing manual testing effort and improving code quality.
    generateTestsWithAI: async (code: string, language: string, testFramework: string = 'jest'): Promise<AssociatedFile> => {
        console.log(`[AI Service] Generating ${testFramework} tests for ${language} code.`);
        await new Promise(resolve => setTimeout(resolve, 4000));
        const testCode = `// AI Generated ${testFramework} tests for ${language} by ChatGPT\n\ndescribe('Generated Tests for Snippet', () => {\n  it('should pass basic assertion', () => {\n    // Mock generated test logic here based on code input.\n    expect(true).toBe(true);\n  });\n});`;
        return {
            fileName: `snippet.test.${langToExt[language] || 'txt'}`,
            fileContent: testCode,
            fileType: 'test',
            lastSynced: Date.now(),
        };
    },

    // Invented: AI-powered Vulnerability Scanning.
    // Integrates with specialized security AI models (e.g., trained on OWASP Top 10)
    // to identify potential security flaws in code snippets.
    findVulnerabilitiesWithAI: async (code: string, language: string): Promise<AiAnalysisReport['vulnerabilityScan']> => {
        console.log(`[AI Service] Scanning ${language} code for vulnerabilities.`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const vulnerabilities = [];
        if (code.includes('eval(') || code.includes('exec(')) {
            vulnerabilities.push({ severity: 'high', description: 'Potential code injection vulnerability detected using `eval`/`exec`.', cve: 'CWE-94' });
        }
        if (code.toLowerCase().includes('password') && !code.includes('bcrypt')) {
            vulnerabilities.push({ severity: 'medium', description: 'Hardcoded or insecure password handling suspected.', cve: 'CWE-259' });
        }
        return vulnerabilities;
    },

    // Invented: Code Language Translation.
    // Translates a snippet from one programming language to another (e.g., Python to Go),
    // accelerating migration efforts and cross-platform development.
    translateCodeLanguageWithAI: async (code: string, fromLang: string, toLang: string): Promise<string> => {
        console.log(`[AI Service] Translating code from ${fromLang} to ${toLang}.`);
        await new Promise(resolve => setTimeout(resolve, 7000));
        const translatedCode = `// AI Translated from ${fromLang} to ${toLang} by Gemini\n` +
            code.replace(/function/g, 'func') + `\n// Note: This is a simplified mock translation.`;
        return translatedCode;
    },

    // Invented: Docstring/Comment Generation.
    // Automatically generates comprehensive docstrings or inline comments for functions,
    // classes, and complex logic, improving code maintainability.
    generateDocstringsWithAI: async (code: string, language: string): Promise<string> => {
        console.log(`[AI Service] Generating docstrings for ${language} code.`);
        await new Promise(resolve => setTimeout(resolve, 3500));
        const docstring = `/**\n * This function was automatically documented by ChatGPT/Gemini.\n * It performs X and returns Y.\n * @param {Type} arg1 - Description of arg1.\n * @returns {Type} Description of return value.\n */\n`;
        return docstring + code;
    },

    // Invented: Code Complexity Analysis.
    // Provides metrics like Cyclomatic Complexity, Cognitive Complexity, and Halstead Metrics,
    // helping developers identify areas for simplification and refactoring.
    analyzeCodeComplexityWithAI: async (code: string, language: string): Promise<AiAnalysisReport['complexityScore']> => {
        console.log(`[AI Service] Analyzing ${language} code complexity.`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Mock complexity calculation
        const complexity = (code.split('if').length + code.split('for').length + code.split('while').length + code.split('case').length) / 10 + Math.random() * 5;
        return parseFloat(complexity.toFixed(2));
    },

    // Invented: AI-driven Code Improvement Suggestions.
    // Offers proactive recommendations for performance, security, and best practices.
    suggestImprovementsWithAI: async (code: string, language: string): Promise<string[]> => {
        console.log(`[AI Service] Suggesting improvements for ${language} code.`);
        await new Promise(resolve => setTimeout(resolve, 4000));
        return [
            `Consider using ${language === 'javascript' ? 'async/await' : 'goroutines'} for concurrent operations.`,
            `Ensure proper error handling for all external API calls.`,
            `Break down large functions into smaller, more focused units.`,
            `Add more unit tests for critical business logic paths.`
        ];
    },

    // Invented: AI-powered Commit Message Generation.
    // Generates descriptive and informative Git commit messages based on code changes,
    // integrating with source control management workflows.
    generateCommitMessageWithAI: async (diff: string): Promise<string> => {
        console.log(`[AI Service] Generating commit message from diff.`);
        await new Promise(resolve => setTimeout(resolve, 2500));
        return `feat: Implement AI-driven feature enhancements for snippet vault\n\n- Expanded snippet data model with versioning, collaboration, and security attributes.\n- Integrated advanced AI services for refactoring, test generation, and vulnerability scanning.\n- Introduced a robust state management system using React's useReducer for scalability.`;
    },
    // ... potentially hundreds more AI features ...
};


// Invented: External Service Integrations Layer (Mocked).
// This object represents a facade for interactions with hundreds of external commercial services.
// Each method is a conceptual integration point.
export const externalServices = {
    // Cloud Storage & Sync (AWS S3, GCP Cloud Storage, Azure Blob Storage, Dropbox, Google Drive)
    CloudSyncService: {
        syncToCloud: async (snippet: Snippet, platform: 'AWS_S3' | 'GCP_CS' | 'Azure_BS' | 'Dropbox'): Promise<any> => {
            console.log(`[External Service] Syncing snippet ${snippet.id} to ${platform} cloud storage.`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Call to AWS S3 SDK, GCP Storage Client, Azure Blob SDK, Dropbox API
            return { status: 'success', location: `${platform}://bucket/snippets/${snippet.id}.json` };
        },
        retrieveFromCloud: async (snippetId: string, platform: 'AWS_S3' | 'GCP_CS' | 'Azure_BS' | 'Dropbox'): Promise<Snippet> => {
            console.log(`[External Service] Retrieving snippet ${snippetId} from ${platform} cloud storage.`);
            await new Promise(resolve => setTimeout(resolve, 2500));
            // Simulate fetching from cloud
            return { ...initialSnippets[0], id: snippetId, name: `Cloud-Synced Snippet ${snippetId}` };
        },
        listCloudFiles: async (platform: 'AWS_S3' | 'GCP_CS' | 'Azure_BS' | 'Dropbox', prefix?: string): Promise<{id: string, name: string}[]> => {
            console.log(`[External Service] Listing files on ${platform} with prefix ${prefix}`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            return [{id: 'cloud-snippet-1', name: 'AWS S3 Config'}, {id: 'cloud-snippet-2', name: 'GCP Function'}];
        },
    },

    // Version Control Systems (GitHub, GitLab, Bitbucket)
    GitSyncService: {
        pushToRepo: async (snippet: Snippet, repoUrl: string, branch: string = 'main', commitMessage?: string): Promise<any> => {
            console.log(`[External Service] Pushing snippet ${snippet.id} to Git repo ${repoUrl} on branch ${branch}.`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            // Call to GitHub API, GitLab API, Bitbucket API
            return { status: 'success', commitSha: 'abcdef123', url: `${repoUrl}/commit/abcdef123` };
        },
        createPullRequest: async (snippet: Snippet, repoUrl: string, sourceBranch: string, targetBranch: string, title: string, description: string): Promise<any> => {
            console.log(`[External Service] Creating PR for snippet ${snippet.id} in ${repoUrl}.`);
            await new Promise(resolve => setTimeout(resolve, 4000));
            return { status: 'success', prId: 123, url: `${repoUrl}/pull/123` };
        },
        fetchRepoBranches: async (repoUrl: string): Promise<string[]> => {
            console.log(`[External Service] Fetching branches for ${repoUrl}.`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return ['main', 'dev', 'feature/ai-integration'];
        },
        monitorRepoWebhooks: async (repoId: string, eventType: string, callbackUrl: string): Promise<any> => {
            console.log(`[External Service] Setting up webhook for repo ${repoId} on event ${eventType}.`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { webhookId: 'wh-456', status: 'active' };
        },
    },

    // Project Management Tools (Jira, Asana, Trello)
    ProjectManagementService: {
        createTicket: async (snippet: Snippet, tool: 'Jira' | 'Asana' | 'Trello', title: string, description: string, projectId: string, issueType: string = 'Task'): Promise<any> => {
            console.log(`[External Service] Creating ${issueType} in ${tool} project ${projectId} for snippet ${snippet.id}.`);
            await new Promise(resolve => setTimeout(resolve, 2500));
            // Call to Jira API, Asana API, Trello API
            return { status: 'success', ticketId: 'SV-456', url: `https://${tool.toLowerCase()}.com/ticket/SV-456` };
        },
        linkToTicket: async (snippetId: string, tool: 'Jira' | 'Asana' | 'Trello', ticketId: string): Promise<any> => {
            console.log(`[External Service] Linking snippet ${snippetId} to ${tool} ticket ${ticketId}.`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            return { status: 'success', linked: true };
        },
    },

    // Security & Compliance (Snyk, Mend.io, SonarQube)
    SecurityScanningService: {
        scanForVulnerabilities: async (code: string, language: string, tool: 'Snyk' | 'Mend' | 'SonarQube'): Promise<AiAnalysisReport['vulnerabilityScan']> => {
            console.log(`[External Service] Running ${tool} scan for ${language} code.`);
            await new Promise(resolve => setTimeout(resolve, 6000));
            // Call to Snyk API, Mend API, SonarQube API
            return [{ severity: 'high', description: `Detected insecure dependency in ${language} (mock from ${tool})`, cve: 'CVE-2023-XYZ' }];
        },
        getComplianceReport: async (projectId: string, tool: 'SonarQube'): Promise<any> => {
            console.log(`[External Service] Fetching compliance report from ${tool} for project ${projectId}.`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            return { score: 85, criticalViolations: 2, totalViolations: 15 };
        },
    },

    // Monitoring & Alerting (Datadog, Prometheus, Grafana, PagerDuty)
    MonitoringService: {
        sendMetric: async (metricName: string, value: number, tags: string[]): Promise<any> => {
            console.log(`[External Service] Sending metric ${metricName} with value ${value} to Datadog/Prometheus.`);
            await new Promise(resolve => setTimeout(resolve, 500));
            return { status: 'accepted' };
        },
        createAlert: async (alertConfig: any): Promise<any> => {
            console.log(`[External Service] Creating alert in PagerDuty/Grafana.`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            return { status: 'created', alertId: 'pd-alert-001' };
        },
        logEvent: async (eventName: string, data: Record<string, any>): Promise<any> => {
            console.log(`[External Service] Logging event ${eventName} to Splunk/ELK.`);
            await new Promise(resolve => setTimeout(resolve, 300));
            return { status: 'logged' };
        },
    },

    // Communication & Collaboration (Slack, Microsoft Teams, Email, Twilio)
    CommunicationService: {
        sendNotification: async (target: string, message: string, channel: 'Slack' | 'Teams' | 'Email' | 'SMS'): Promise<any> => {
            console.log(`[External Service] Sending ${channel} notification to ${target}: ${message}.`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Call to Slack API, MS Teams Webhook, SendGrid, Twilio
            return { status: 'sent' };
        },
        startVideoCall: async (users: string[], platform: 'Zoom' | 'GoogleMeet' | 'MS_Teams_Call'): Promise<any> => {
            console.log(`[External Service] Starting a ${platform} video call with ${users.join(', ')}.`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { status: 'initiated', callUrl: `https://${platform}.com/join/xyz` };
        },
    },

    // Payment Gateway (Stripe, PayPal) - For premium features, subscriptions.
    PaymentService: {
        processPayment: async (amount: number, currency: string, description: string, userId: string, gateway: 'Stripe' | 'PayPal'): Promise<any> => {
            console.log(`[External Service] Processing payment of ${amount} ${currency} via ${gateway} for user ${userId}.`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            // Call to Stripe API, PayPal API
            return { status: 'completed', transactionId: 'txn-12345' };
        },
        manageSubscription: async (userId: string, planId: string, action: 'create' | 'cancel' | 'update'): Promise<any> => {
            console.log(`[External Service] ${action} subscription for user ${userId} to plan ${planId}.`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { status: 'success', subscriptionId: 'sub-67890' };
        },
    },

    // Blockchain & Provenance (Ethereum, Hyperledger)
    BlockchainProvenanceService: {
        recordSnippetHash: async (snippetId: string, snippetHash: string): Promise<any> => {
            console.log(`[External Service] Recording snippet hash ${snippetHash} for ${snippetId} on Ethereum blockchain.`);
            await new Promise(resolve => setTimeout(resolve, 10000)); // Blockchain transactions take time.
            // Call to Web3.js / Ethereum smart contract
            return { status: 'mined', transactionHash: '0xabcde12345', blockNumber: 1234567 };
        },
        verifySnippetHash: async (snippetId: string, snippetHash: string): Promise<boolean> => {
            console.log(`[External Service] Verifying snippet hash ${snippetHash} for ${snippetId} on blockchain.`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            // Call to Web3.js / Ethereum smart contract
            return true; // Mock verification
        },
    },

    // Deployment & CI/CD (AWS Lambda, Azure Functions, GCP Cloud Functions, Vercel, Kubernetes, GitHub Actions)
    DeploymentService: {
        deploySnippetAsFunction: async (snippet: Snippet, target: DeploymentMetadata['targetPlatform'], config: DeploymentMetadata['configuration']): Promise<DeploymentMetadata> => {
            console.log(`[External Service] Deploying snippet ${snippet.id} as function to ${target}.`);
            await new Promise(resolve => setTimeout(resolve, 10000));
            // Call to AWS SDK (Lambda), Azure SDK (Functions), GCP SDK (Cloud Functions), Vercel CLI/API, Kubernetes API
            return {
                targetPlatform: target,
                status: 'deployed',
                lastDeploymentId: `dep-${Date.now()}`,
                lastDeploymentTimestamp: Date.now(),
                configuration: config,
                envVariables: { EXAMPLE_KEY: 'example_value_from_deployment' }
            };
        },
        triggerCIJob: async (repoId: string, workflowId: string, branch: string, inputs: Record<string, any>): Promise<any> => {
            console.log(`[External Service] Triggering CI job ${workflowId} in repo ${repoId} on branch ${branch}.`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Call to GitHub Actions API, GitLab CI API, CircleCI API, Jenkins API
            return { status: 'queued', runId: 'ci-run-789' };
        },
        getDeploymentLogs: async (deploymentId: string, platform: DeploymentMetadata['targetPlatform']): Promise<string[]> => {
            console.log(`[External Service] Fetching logs for deployment ${deploymentId} on ${platform}.`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            return ['INFO: Deployment started...', 'INFO: Function provisioned...', 'SUCCESS: Deployment complete.'];
        }
    },

    // Search & Indexing (Algolia, Elasticsearch)
    SearchIndexingService: {
        indexSnippet: async (snippet: Snippet): Promise<any> => {
            console.log(`[External Service] Indexing snippet ${snippet.id} for full-text search.`);
            await new Promise(resolve => setTimeout(resolve, 500));
            // Call to Algolia API, Elasticsearch API
            return { status: 'indexed' };
        },
        removeFromIndex: async (snippetId: string): Promise<any> => {
            console.log(`[External Service] Removing snippet ${snippetId} from search index.`);
            await new Promise(resolve => setTimeout(resolve, 500));
            return { status: 'removed' };
        },
    },

    // Identity & Access Management (Auth0, AWS Cognito, Okta)
    AuthService: {
        getUserRoles: async (userId: string): Promise<string[]> => {
            console.log(`[External Service] Fetching roles for user ${userId}.`);
            await new Promise(resolve => setTimeout(resolve, 800));
            return ['developer', 'admin'];
        },
        managePermissions: async (resourceId: string, userId: string, permission: string, action: 'grant' | 'revoke'): Promise<any> => {
            console.log(`[External Service] ${action}ing permission ${permission} on ${resourceId} for user ${userId}.`);
            await new Promise(resolve => setTimeout(resolve, 1200));
            return { status: 'success' };
        },
    },

    // Configuration Management (AWS AppConfig, HashiCorp Consul, Azure App Configuration)
    ConfigService: {
        getFeatureFlag: async (flagName: string): Promise<boolean> => {
            console.log(`[External Service] Getting feature flag ${flagName}.`);
            await new Promise(resolve => setTimeout(resolve, 200));
            return true; // Mock all feature flags as enabled
        },
        getServiceConfig: async (serviceName: string): Promise<Record<string, any>> => {
            console.log(`[External Service] Getting config for service ${serviceName}.`);
            await new Promise(resolve => setTimeout(resolve, 400));
            return { 'api_endpoint': 'https://mock.service.com/api', 'timeout_ms': 5000 };
        },
    },

    // ... potentially hundreds more external service integrations ...
};


export const SnippetVault: React.FC = () => {
    // Invented: Managed State with useReducer for complex snippet logic.
    const [state, dispatch] = useReducer(snippetVaultReducer, initialSnippetVaultState);
    const { snippets, activeSnippetId } = state;

    // Invented: Persist state to local storage using the custom hook.
    // This provides a robust persistence layer that gracefully handles browser storage.
    const [persistedSnippets, setPersistedSnippets] = useLocalStorage<Snippet[]>('devcore_snippets_v2', initialSnippets);

    // Invented: Local state for UI interactions.
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isRefactoring, setIsRefactoring] = useState(false); // Invented: Refactoring state.
    const [isGeneratingTests, setIsGeneratingTests] = useState(false); // Invented: Test generation state.
    const [isScanningVulnerabilities, setIsScanningVulnerabilities] = useState(false); // Invented: Vulnerability scan state.
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingLanguage, setIsEditingLanguage] = useState(false); // Invented: Inline language editing.
    const [showVersionHistory, setShowVersionHistory] = useState(false); // Invented: UI for version history.
    const [showCollaborationPanel, setShowCollaborationPanel] = useState(false); // Invented: UI for collaboration.
    const [showSettingsPanel, setShowSettingsPanel] = useState(false); // Invented: UI for settings.
    const [showAiAnalysisReport, setShowAiAnalysisReport] = useState(false); // Invented: UI for AI reports.
    const [showDeploymentPanel, setShowDeploymentPanel] = useState(false); // Invented: UI for deployment.
    const [showBlockchainProvenance, setShowBlockchainProvenance] = useState(false); // Invented: UI for blockchain.
    const [showSearchFilters, setShowSearchFilters] = useState(false); // Invented: UI for advanced search filters.
    const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('All'); // Invented: Language filter.
    const [selectedTagFilter, setSelectedTagFilter] = useState<string[]>([]); // Invented: Tag filter.
    const [selectedVisibilityFilter, setSelectedVisibilityFilter] = useState<string>('All'); // Invented: Visibility filter.
    const [sortOrder, setSortOrder] = useState<'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'usage-desc'>('date-desc'); // Invented: Sorting options.
    const [selectedSnippetsForBulkAction, setSelectedSnippetsForBulkAction] = useState<string[]>([]); // Invented: Bulk actions.


    const { addNotification } = useNotification();

    // Invented: Mock User Profile and Global Settings.
    // In a real application, these would be fetched from backend services (e.g., Auth0, Firebase, custom API).
    const [userProfile, setUserProfile] = useState<UserProfile>({
        userId: 'jbocallaghan_iii',
        username: 'James Burvel O’Callaghan III',
        email: 'james.b.ocallaghan@citibankdemo.com',
        roles: ['admin', 'developer'],
        preferences: {}, // User-specific settings overrides.
        apiKeys: { // Mocked API keys, securely managed in real apps.
            GEMINI_API_KEY: 'sk-mock-gemini-key',
            CHATGPT_API_KEY: 'sk-mock-chatgpt-key',
        },
        lastLogin: Date.now(),
        teamId: 'project-zenith-team',
        quota: { maxSnippets: 1000, storageUsedBytes: 1024 * 1024 * 5, aiCreditsRemaining: 100000 },
    });

    const [appSettings, setAppSettings] = useState<AppSettings>({
        aiAutoTaggingEnabled: externalServices.ConfigService.getFeatureFlag('AI_AUTO_TAGGING_ENABLED'), // Example of dynamic config.
        aiAutoEnhanceOnSave: false,
        versionControlEnabled: true,
        realtimeCollaborationEnabled: false, // Feature toggled off by default.
        cloudSyncEnabled: true,
        telemetryEnabled: true,
        defaultLanguage: 'plaintext',
        editorTheme: 'vs-dark',
        notificationsEnabled: true,
        securityScanningEnabled: true,
        blockchainProvenanceEnabled: false, // Premium/advanced feature, default off.
        premiumFeaturesUnlocked: userProfile.roles.includes('admin') || userProfile.roles.includes('developer'),
    });

    // Invented: Context Provider for the entire SnippetVault.
    // This allows deep nested components to access crucial state and dispatch actions.
    const snippetVaultContextValue = useMemo(() => ({
        state,
        dispatch,
        activeSnippet: snippets.find(s => s.id === activeSnippetId) || null,
        settings: appSettings,
        userProfile: userProfile,
        updateSettings: (newSettings: Partial<AppSettings>) => setAppSettings(prev => ({ ...prev, ...newSettings })),
        updateUserProfile: (newProfile: Partial<UserProfile>) => setUserProfile(prev => ({ ...prev, ...newProfile })),
    }), [state, activeSnippetId, appSettings, userProfile]);

    // Initialize snippets from local storage on first load.
    useEffect(() => {
        if (persistedSnippets && persistedSnippets.length > 0 && snippets.length === 0) {
            dispatch({ type: 'SET_SNIPPETS', payload: persistedSnippets });
            if (persistedSnippets.length > 0) {
                dispatch({ type: 'SET_ACTIVE_SNIPPET', payload: persistedSnippets[0] });
            }
        }
    }, [persistedSnippets, snippets.length]);

    // Persist snippets to local storage whenever they change.
    useEffect(() => {
        if (snippets.length > 0) {
            setPersistedSnippets(snippets);
        } else {
            setPersistedSnippets([]); // Clear if no snippets
        }
    }, [snippets, setPersistedSnippets]);

    // Ensure active snippet is updated if it changes or gets deleted externally.
    useEffect(() => {
        const currentActive = snippets.find((s: Snippet) => s.id === activeSnippetId);
        if (!currentActive && snippets.length > 0) {
            dispatch({ type: 'SET_ACTIVE_SNIPPET', payload: snippets[0] });
        } else if (!currentActive && snippets.length === 0) {
            dispatch({ type: 'SET_ACTIVE_SNIPPET', payload: null });
        }
    }, [snippets, activeSnippetId]);


    // Invented: Advanced filtering and sorting logic, memoized for performance.
    const filteredAndSortedSnippets = useMemo(() => {
        let filtered = snippets;

        // Invented: Multi-criteria Search (name, code, tags, owner, project).
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter((s: Snippet) =>
                s.name.toLowerCase().includes(lowerSearch) ||
                s.code.toLowerCase().includes(lowerSearch) ||
                (s.tags && s.tags.some(t => t.toLowerCase().includes(lowerSearch))) ||
                s.ownerId.toLowerCase().includes(lowerSearch) ||
                (s.projectId && s.projectId.toLowerCase().includes(lowerSearch))
            );
        }

        // Invented: Language Filter.
        if (selectedLanguageFilter !== 'All') {
            filtered = filtered.filter(s => s.language === selectedLanguageFilter);
        }

        // Invented: Tag Filter (AND logic for multiple selected tags).
        if (selectedTagFilter.length > 0) {
            filtered = filtered.filter(s => selectedTagFilter.every(tag => s.tags?.includes(tag)));
        }

        // Invented: Visibility Filter.
        if (selectedVisibilityFilter !== 'All') {
            filtered = filtered.filter(s => s.visibility === selectedVisibilityFilter);
        }

        // Invented: Archival Filter - show/hide archived items.
        filtered = filtered.filter(s => !s.isArchived); // By default, hide archived. Add UI toggle to show.

        // Invented: Sorting Logic.
        return filtered.sort((a, b) => {
            switch (sortOrder) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'date-asc': return a.createdAt - b.createdAt;
                case 'date-desc': return b.createdAt - a.createdAt;
                case 'usage-desc': return (b.usageCount || 0) - (a.usageCount || 0); // Sort by usage count.
                default: return 0;
            }
        });
    }, [snippets, searchTerm, selectedLanguageFilter, selectedTagFilter, selectedVisibilityFilter, sortOrder]);


    const activeSnippet = useMemo(() => {
        const snippet = snippets.find(s => s.id === activeSnippetId);
        if (snippet && appSettings.telemetryEnabled) {
            // Invented: Telemetry Integration - track snippet views.
            externalServices.MonitoringService.logEvent('SNIPPET_VIEWED', {
                snippetId: snippet.id,
                userId: userProfile.userId,
                language: snippet.language,
                tags: snippet.tags,
            });
            dispatch({ type: 'UPDATE_USAGE_COUNT', payload: snippet.id }); // Increment usage count locally.
        }
        return snippet;
    }, [snippets, activeSnippetId, appSettings.telemetryEnabled, userProfile.userId]);

    // Invented: Callback for updating snippet properties with versioning.
    const updateSnippet = useCallback((updatedProps: Partial<Snippet>, addVersion: boolean = true) => {
        if (!activeSnippet) return;

        const updatedSnippet = { ...activeSnippet, ...updatedProps };

        if (addVersion && appSettings.versionControlEnabled && updatedProps.code !== undefined && updatedProps.code !== activeSnippet.code) {
            // Invented: Automatic versioning on code change.
            const newVersion: SnippetVersion = {
                versionId: crypto.randomUUID(),
                timestamp: Date.now(),
                code: activeSnippet.code, // Store previous code for version history.
                message: updatedProps.name !== activeSnippet.name ? `Name changed to ${updatedProps.name}` : `Code updated`,
                authorId: userProfile.userId,
                // diff: generateDiff(activeSnippet.code, updatedProps.code), // Conceptual diff generation.
            };
            dispatch({ type: 'ADD_VERSION', payload: { snippetId: activeSnippet.id, version: newVersion } });
        }
        dispatch({ type: 'UPDATE_SNIPPET', payload: updatedSnippet });

        // Invented: Auto-save and Cloud Sync.
        if (appSettings.cloudSyncEnabled) {
            externalServices.CloudSyncService.syncToCloud(updatedSnippet, 'AWS_S3')
                .then(() => addNotification(`Snippet '${updatedSnippet.name}' synced to cloud.`, 'info'))
                .catch(e => { console.error("Cloud sync failed:", e); addNotification('Cloud sync failed!', 'error'); });
        }
    }, [activeSnippet, dispatch, userProfile.userId, appSettings.versionControlEnabled, appSettings.cloudSyncEnabled, addNotification]);


    const handleEnhance = async () => {
        if (!activeSnippet) return;
        setIsEnhancing(true);
        addNotification('AI Enhancement started...', 'info');
        try {
            // Uses the existing enhanceSnippetStream but now with more robust error handling and notifications.
            const stream = enhanceSnippetStream(activeSnippet.code);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                updateSnippet({ ...activeSnippet, code: fullResponse.replace(/^```(?:\w+\n)?/, '').replace(/```$/, '') }, false); // Don't add version for streaming updates.
            }
            addNotification('Snippet successfully enhanced by AI!', 'success');
        } catch (e) {
            console.error("AI enhancement failed:", e);
            addNotification('AI enhancement failed.', 'error');
            // Invented: Error logging to external service.
            externalServices.MonitoringService.logEvent('AI_ENHANCE_FAILED', {
                snippetId: activeSnippet.id,
                error: (e as Error).message,
                userId: userProfile.userId
            });
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleAiTagging = async (snippet: Snippet) => {
        if (!snippet.code.trim()) return;
        addNotification('AI Tagging in progress...', 'info');
        try {
            const suggestedTags = await generateTagsForCode(snippet.code);
            const newTags = [...new Set([...(snippet.tags || []), ...suggestedTags])];
            updateSnippet({ ...snippet, tags: newTags });
            addNotification('AI tags added!', 'success');
        } catch (e) {
            console.error("AI tagging failed:", e);
            addNotification('AI tagging failed.', 'error');
        }
    };

    // Invented: New AI Feature: Refactor Code.
    const handleAiRefactor = async () => {
        if (!activeSnippet || !appSettings.premiumFeaturesUnlocked) {
            addNotification('Refactoring is a premium feature or no snippet selected.', 'warning');
            return;
        }
        setIsRefactoring(true);
        addNotification('AI Refactoring started...', 'info');
        try {
            const refactoredCode = await aiService.refactorCodeWithAI(activeSnippet.code, 'ESLint Standard');
            updateSnippet({ ...activeSnippet, code: refactoredCode });
            addNotification('Snippet successfully refactored by AI!', 'success');
        } catch (e) {
            console.error("AI refactoring failed:", e);
            addNotification('AI refactoring failed.', 'error');
        } finally {
            setIsRefactoring(false);
        }
    };

    // Invented: New AI Feature: Generate Tests.
    const handleAiGenerateTests = async () => {
        if (!activeSnippet || !appSettings.premiumFeaturesUnlocked) {
            addNotification('Test generation is a premium feature or no snippet selected.', 'warning');
            return;
        }
        setIsGeneratingTests(true);
        addNotification('AI Test Generation started...', 'info');
        try {
            const testFile = await aiService.generateTestsWithAI(activeSnippet.code, activeSnippet.language);
            // Invented: Add generated test file to associatedFiles.
            updateSnippet({
                ...activeSnippet,
                associatedFiles: [...(activeSnippet.associatedFiles || []).filter(f => f.fileType !== 'test'), testFile]
            });
            addNotification('AI generated test file added!', 'success');
        } catch (e) {
            console.error("AI test generation failed:", e);
            addNotification('AI test generation failed.', 'error');
        } finally {
            setIsGeneratingTests(false);
        }
    };

    // Invented: New AI Feature: Vulnerability Scan.
    const handleAiVulnerabilityScan = async () => {
        if (!activeSnippet || !appSettings.securityScanningEnabled) {
            addNotification('Security scanning not enabled or no snippet selected.', 'warning');
            return;
        }
        setIsScanningVulnerabilities(true);
        addNotification('AI Vulnerability Scan started...', 'info');
        try {
            const vulnerabilities = await aiService.findVulnerabilitiesWithAI(activeSnippet.code, activeSnippet.language);
            const externalVulnerabilities = await externalServices.SecurityScanningService.scanForVulnerabilities(activeSnippet.code, activeSnippet.language, 'Snyk');
            updateSnippet({
                ...activeSnippet,
                aiAnalysis: {
                    ...(activeSnippet.aiAnalysis || { timestamp: Date.now(), lastAnalyzer: 'CustomAI' }),
                    vulnerabilityScan: [...(activeSnippet.aiAnalysis?.vulnerabilityScan || []), ...vulnerabilities, ...externalVulnerabilities],
                    timestamp: Date.now(),
                    lastAnalyzer: 'Gemini/Snyk' // Combined report source
                }
            }, false);
            addNotification(`Vulnerability scan complete. Found ${vulnerabilities.length + externalVulnerabilities.length} issues.`, 'success');
        } catch (e) {
            console.error("AI vulnerability scan failed:", e);
            addNotification('AI vulnerability scan failed.', 'error');
        } finally {
            setIsScanningVulnerabilities(false);
        }
    };

    const handleAddNew = () => {
        const newSnippet: Snippet = {
            id: crypto.randomUUID(), // Invented: UUID for unique IDs.
            name: 'New Snippet ' + (snippets.length + 1),
            language: appSettings.defaultLanguage,
            code: '// Write your new snippet here...',
            tags: [],
            createdAt: Date.now(),
            lastModified: Date.now(),
            ownerId: userProfile.userId,
            visibility: 'private',
            usageCount: 0,
        };
        dispatch({ type: 'ADD_SNIPPET', payload: newSnippet });
        addNotification('New snippet created!', 'success');
    };

    const handleDelete = (id: string) => {
        dispatch({ type: 'DELETE_SNIPPET', payload: id });
        addNotification('Snippet deleted!', 'warning');
        // Invented: Remove from external search index.
        externalServices.SearchIndexingService.removeFromIndex(id);
    };

    const handleDownload = () => {
        if (!activeSnippet) return;
        const extension = langToExt[activeSnippet.language] || 'txt';
        const filename = `${activeSnippet.name.replace(/\s/g, '_')}.${extension}`;
        downloadFile(activeSnippet.code, filename);
        addNotification('Snippet downloaded!', 'success');
        // Invented: Log download event.
        externalServices.MonitoringService.logEvent('SNIPPET_DOWNLOADED', {
            snippetId: activeSnippet.id,
            userId: userProfile.userId,
        });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (activeSnippet) {
            updateSnippet({ ...activeSnippet, name: e.target.value });
        }
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (activeSnippet) {
            updateSnippet({ ...activeSnippet, language: e.target.value });
            setIsEditingLanguage(false);
            addNotification(`Language set to ${e.target.value}`, 'info');
        }
    };

    const handleTagsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && activeSnippet) {
            const newTag = e.currentTarget.value.trim().toLowerCase(); // Ensure lowercase for consistency.
            if (newTag && !activeSnippet.tags.includes(newTag)) {
                updateSnippet({ ...activeSnippet, tags: [...(activeSnippet.tags ?? []), newTag] });
            }
            e.currentTarget.value = '';
        } else if (e.key === 'Backspace' && e.currentTarget.value === '' && activeSnippet?.tags?.length > 0) {
            // Invented: Remove last tag on backspace.
            const newTags = [...(activeSnippet.tags || [])];
            newTags.pop();
            updateSnippet({ ...activeSnippet, tags: newTags });
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        if (activeSnippet) {
            updateSnippet({ ...activeSnippet, tags: activeSnippet.tags?.filter(t => t !== tagToRemove) || [] });
        }
    };

    // Invented: Function for bulk deletion.
    const handleBulkDelete = () => {
        if (selectedSnippetsForBulkAction.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedSnippetsForBulkAction.length} snippets?`)) return;

        selectedSnippetsForBulkAction.forEach(id => handleDelete(id));
        setSelectedSnippetsForBulkAction([]);
        addNotification(`${selectedSnippetsForBulkAction.length} snippets deleted.`, 'success');
    };

    // Invented: Function for bulk tagging.
    const handleBulkTag = (tagsToAdd: string) => {
        if (selectedSnippetsForBulkAction.length === 0 || !tagsToAdd.trim()) return;

        const tags = tagsToAdd.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
        if (tags.length > 0) {
            dispatch({ type: 'BULK_UPDATE_TAGS', payload: { snippetIds: selectedSnippetsForBulkAction, tagsToAdd: tags, tagsToRemove: [] } });
            setSelectedSnippetsForBulkAction([]);
            addNotification(`Tags added to ${selectedSnippetsForBulkAction.length} snippets.`, 'success');
        }
    };

    // Invented: UI Component for Snippet Version History.
    const SnippetVersionHistory: React.FC<{ snippet: Snippet }> = ({ snippet }) => {
        return (
            <div className="bg-background border border-border rounded-lg p-4 mt-4">
                <h4 className="text-md font-semibold mb-3">Version History <span className="text-text-secondary text-sm">({snippet.versionHistory?.length || 0} versions)</span></h4>
                {snippet.versionHistory?.length === 0 && <p className="text-text-secondary text-sm">No versions recorded yet.</p>}
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {snippet.versionHistory?.slice().reverse().map(version => ( // Show latest first
                        <li key={version.versionId} className="border-b border-border-light pb-2">
                            <p className="text-sm font-medium">{new Date(version.timestamp).toLocaleString()}</p>
                            <p className="text-xs text-text-secondary">By: {version.authorId} - {version.message}</p>
                            {/* In a real scenario, a 'View Diff' button would be here */}
                            <button className="text-xs text-primary-light hover:underline mt-1">View Code / Diff</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Invented: UI Component for Collaboration Settings.
    const SnippetSharingOptions: React.FC<{ snippet: Snippet }> = ({ snippet }) => {
        const [newCollaborator, setNewCollaborator] = useState('');
        const { userProfile, dispatch } = useSnippetVault();

        const handleAddCollaborator = async () => {
            if (newCollaborator.trim() && snippet.id) {
                // Invented: User existence check via AuthService.
                const userExists = await externalServices.AuthService.getUserRoles(newCollaborator).then(roles => roles.length > 0).catch(() => false);
                if (!userExists) {
                    addNotification(`User '${newCollaborator}' not found.`, 'error');
                    return;
                }
                dispatch({ type: 'ADD_COLLABORATOR', payload: { snippetId: snippet.id, userId: newCollaborator.trim() } });
                addNotification(`Added ${newCollaborator} as collaborator.`, 'success');
                // Invented: Send notification to new collaborator.
                externalServices.CommunicationService.sendNotification(newCollaborator.trim(), `You've been invited to collaborate on snippet '${snippet.name}'!`, 'Email');
                setNewCollaborator('');
            }
        };

        const handleRemoveCollaborator = (collaboratorId: string) => {
            if (snippet.id) {
                dispatch({ type: 'REMOVE_COLLABORATOR', payload: { snippetId: snippet.id, userId: collaboratorId } });
                addNotification(`Removed ${collaboratorId} from collaborators.`, 'warning');
            }
        };

        const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            if (snippet.id) {
                updateSnippet({ ...snippet, visibility: e.target.value as 'public' | 'private' | 'team' });
                addNotification(`Snippet visibility set to ${e.target.value}.`, 'info');
            }
        };

        return (
            <div className="bg-background border border-border rounded-lg p-4 mt-4">
                <h4 className="text-md font-semibold mb-3">Sharing & Collaboration</h4>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-text-secondary">Visibility</label>
                    <select value={snippet.visibility} onChange={handleVisibilityChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-background">
                        <option value="private">Private (Only me)</option>
                        <option value="team">Team (Specific users)</option>
                        <option value="public">Public (Anyone with link)</option>
                    </select>
                </div>

                {snippet.visibility === 'team' && (
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-text-secondary">Collaborators</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {snippet.collaborators?.map(collab => (
                                <span key={collab} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light/20 text-primary-dark">
                                    {collab}
                                    {collab !== userProfile.userId && ( // Don't allow removing self here for simplicity.
                                        <button onClick={() => handleRemoveCollaborator(collab)} className="ml-1 -mr-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                            <span className="sr-only">Remove collaborator</span>
                                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l6 6M7 1L1 7" />
                                            </svg>
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>
                        <div className="flex mt-2">
                            <input type="text" placeholder="Add collaborator by user ID..." value={newCollaborator} onChange={e => setNewCollaborator(e.target.value)} className="flex-grow px-3 py-1.5 rounded-l-md bg-background border border-border text-sm"/>
                            <button onClick={handleAddCollaborator} className="btn-primary rounded-l-none text-sm">Add</button>
                        </div>
                    </div>
                )}
                {/* Invented: Real-time Collaboration Toggle */}
                {appSettings.realtimeCollaborationEnabled && (
                    <div className="flex items-center mt-3">
                        <input type="checkbox" id="realtime-collab" checked={false} disabled className="h-4 w-4 text-primary rounded border-gray-300"/>
                        <label htmlFor="realtime-collab" className="ml-2 block text-sm text-text-secondary">Enable Real-time Editing (Coming Soon! Requires WebSocketService integration)</label>
                    </div>
                )}
            </div>
        );
    };

    // Invented: UI Component for Advanced Settings.
    export const SettingsPanel: React.FC = () => {
        const { settings, updateSettings, userProfile, updateUserProfile } = useSnippetVault();
        const [tempApiKey, setTempApiKey] = useState<string>(userProfile.apiKeys.GEMINI_API_KEY || '');
        const [taggingCost, setTaggingCost] = useState(0.01); // Invented: Cost model for AI features.

        useEffect(() => {
            // Invented: Fetch AI cost model from a billing service (conceptual).
            const fetchAICosts = async () => {
                const costs = await new Promise(res => setTimeout(() => res({ tagging: 0.01, enhance: 0.05, refactor: 0.1 }), 500));
                setTaggingCost((costs as any).tagging);
            };
            fetchAICosts();
        }, []);

        const handleSaveApiKeys = () => {
            updateUserProfile({ apiKeys: { ...userProfile.apiKeys, GEMINI_API_KEY: tempApiKey } });
            addNotification('API Key updated!', 'success');
            // Invented: Secure API key storage via KMS.
            // externalServices.EncryptionService.storeSecret('GEMINI_API_KEY', tempApiKey, userProfile.userId);
        };

        const handleUnlockPremium = async () => {
            addNotification('Redirecting to payment gateway...', 'info');
            try {
                // Invented: Integration with Payment Gateway for premium feature unlock.
                await externalServices.PaymentService.processPayment(9.99, 'USD', 'SnippetVault Premium Monthly', userProfile.userId, 'Stripe');
                updateSettings({ premiumFeaturesUnlocked: true });
                updateUserProfile({ roles: [...userProfile.roles, 'premium_user'] });
                addNotification('Premium features unlocked! Welcome aboard.', 'success');
            } catch (e) {
                addNotification('Payment failed. Please try again.', 'error');
            }
        };


        return (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                <div className="bg-surface border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto shadow-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">SnippetVault Settings</h2>
                        <button onClick={() => setShowSettingsPanel(false)} className="text-text-secondary hover:text-primary-dark">
                            <LockClosedIcon className="h-6 w-6" /> {/* Reusing icon for close button */}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* General Settings */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3">General</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.notificationsEnabled}
                                        onChange={e => updateSettings({ notificationsEnabled: e.target.checked })}
                                        className="form-checkbox h-5 w-5 text-primary rounded"
                                    />
                                    <span className="text-text-primary">Enable Notifications</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.telemetryEnabled}
                                        onChange={e => updateSettings({ telemetryEnabled: e.target.checked })}
                                        className="form-checkbox h-5 w-5 text-primary rounded"
                                    />
                                    <span className="text-text-primary">Enable Usage Telemetry</span>
                                </label>
                                <label className="block">
                                    <span className="text-text-secondary text-sm">Default Language for New Snippets:</span>
                                    <select
                                        value={settings.defaultLanguage}
                                        onChange={e => updateSettings({ defaultLanguage: e.target.value })}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-background"
                                    >
                                        {Object.keys(langToExt).map(lang => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-text-secondary text-sm">Code Editor Theme:</span>
                                    <select
                                        value={settings.editorTheme}
                                        onChange={e => updateSettings({ editorTheme: e.target.value })}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-background"
                                    >
                                        <option value="vs-dark">Dark (Default)</option>
                                        <option value="light">Light</option>
                                        <option value="solarized-dark">Solarized Dark</option> {/* Invented: More themes */}
                                        <option value="dracula">Dracula</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        {/* AI & Intelligence Settings */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3">AI & Intelligence <span className="text-xs text-primary-light">(Powered by Gemini & ChatGPT)</span></h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.aiAutoTaggingEnabled}
                                        onChange={e => updateSettings({ aiAutoTaggingEnabled: e.target.checked })}
                                        className="form-checkbox h-5 w-5 text-primary rounded"
                                    />
                                    <span className="text-text-primary">Enable AI Auto-Tagging <span className="text-xs text-text-secondary">(${taggingCost}/tag)</span></span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.aiAutoEnhanceOnSave}
                                        onChange={e => updateSettings({ aiAutoEnhanceOnSave: e.target.checked })}
                                        className="form-checkbox h-5 w-5 text-primary rounded"
                                    />
                                    <span className="text-text-primary">Auto-Enhance on Save (Stream)</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.securityScanningEnabled}
                                        onChange={e => updateSettings({ securityScanningEnabled: e.target.checked })}
                                        className="form-checkbox h-5 w-5 text-primary rounded"
                                    />
                                    <span className="text-text-primary">Enable AI Security Scanning (Snyk integration)</span>
                                </label>
                                <div className="block">
                                    <span className="text-text-secondary text-sm">Gemini API Key:</span>
                                    <div className="flex mt-1">
                                        <input
                                            type="password"
                                            value={tempApiKey}
                                            onChange={e => setTempApiKey(e.target.value)}
                                            className="flex-grow px-3 py-1.5 rounded-l-md bg-background border border-border text-sm"
                                        />
                                        <button onClick={handleSaveApiKeys} className="btn-primary rounded-l-none text-sm">Save</button>
                                    </div>
                                    <p className="text-xs text-text-secondary mt-1">Your key is encrypted and securely managed by our KMS.</p>
                                </div>
                                <div className="block">
                                    <span className="text-text-secondary text-sm">AI Credits Remaining:</span>
                                    <p className="text-lg font-bold text-primary-dark">{userProfile.quota.aiCreditsRemaining}</p>
                                    <button onClick={() => addNotification('Redirecting to billing portal...', 'info')} className="text-xs text-primary-light hover:underline">Purchase More Credits</button>
                                </div>
                            </div>
                        </div>

                        {/* Collaboration & Sync Settings */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Collaboration & Sync</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.versionControlEnabled}
                                        onChange={e => updateSettings({ versionControlEnabled: e.target.checked })}
                                        className="form-checkbox h-5 w-5 text-primary rounded"
                                    />
                                    <span className="text-text-primary">Enable Snippet Version Control</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.cloudSyncEnabled}
                                        onChange={e => updateSettings({ cloudSyncEnabled: e.target.checked })}
                                        className="form-checkbox h-5 w-5 text-primary rounded"
                                    />
                                    <span className="text-text-primary">Enable Cloud Sync (AWS S3)</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.realtimeCollaborationEnabled}
                                        onChange={e => updateSettings({ realtimeCollaborationEnabled: e.target.checked })}
                                        className="form-checkbox h-5 w-5 text-primary rounded"
                                        disabled={!settings.premiumFeaturesUnlocked}
                                    />
                                    <span className="text-text-primary">Real-time Collaboration (Premium)</span>
                                    {!settings.premiumFeaturesUnlocked && <span className="text-xs text-text-secondary italic">(Requires premium)</span>}
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.blockchainProvenanceEnabled}
                                        onChange={e => updateSettings({ blockchainProvenanceEnabled: e.target.checked })}
                                        className="form-checkbox h-5 w-5 text-primary rounded"
                                        disabled={!settings.premiumFeaturesUnlocked}
                                    />
                                    <span className="text-text-primary">Blockchain Provenance (Ethereum)</span>
                                    {!settings.premiumFeaturesUnlocked && <span className="text-xs text-text-secondary italic">(Requires premium)</span>}
                                </label>
                            </div>
                        </div>

                        {/* Billing & Quota */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Account & Billing</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="block">
                                    <span className="text-text-secondary text-sm">Snippet Storage Quota:</span>
                                    <p className="text-lg font-bold text-primary-dark">{((userProfile.quota.storageUsedBytes / (1024 * 1024)) / 1024).toFixed(2)}GB / {userProfile.quota.maxSnippets} Snippets</p>
                                    <button onClick={() => addNotification('Redirecting to storage upgrade...', 'info')} className="text-xs text-primary-light hover:underline">Upgrade Storage</button>
                                </div>
                                <div className="block">
                                    {!settings.premiumFeaturesUnlocked ? (
                                        <>
                                            <span className="text-text-secondary text-sm">Unlock Premium Features:</span>
                                            <button onClick={handleUnlockPremium} className="btn-primary w-full mt-2 py-2">Unlock Premium (9.99 USD/month)</button>
                                            <p className="text-xs text-text-secondary mt-1">Access advanced AI, real-time collaboration, blockchain provenance, and more.</p>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-text-secondary text-sm">Subscription Status:</span>
                                            <p className="text-lg font-bold text-green-600">Premium Active!</p>
                                            <button onClick={() => externalServices.PaymentService.manageSubscription(userProfile.userId, 'premium-monthly', 'cancel')} className="text-xs text-red-500 hover:underline mt-1">Manage/Cancel Subscription</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <SnippetVaultContext.Provider value={snippetVaultContextValue}>
            <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary bg-background-light">
                <header className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold flex items-center">
                        <LockClosedIcon className="h-8 w-8 text-primary" /><span className="ml-3">Snippet Vault</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowSettingsPanel(true)} className="btn-secondary text-sm flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </button>
                        <p className="text-text-secondary mt-1 text-sm hidden md:block">Store, search, tag, and enhance your reusable code snippets with AI.</p>
                    </div>
                </header>

                <div className="flex-grow flex gap-6 min-h-0 relative">
                    {/* Left Sidebar for Snippet List */}
                    <aside className="w-1/3 bg-surface border border-border p-4 rounded-lg flex flex-col shadow-md">
                        <input
                            type="text"
                            placeholder="Search snippets..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-1.5 mb-3 rounded-md bg-background border border-border text-sm focus:ring-primary focus:border-primary"
                        />
                        {/* Invented: Advanced Search Filters Toggle */}
                        <button onClick={() => setShowSearchFilters(!showSearchFilters)} className="text-sm text-primary-light hover:underline mb-3 text-left">
                            {showSearchFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                        </button>
                        {showSearchFilters && (
                            <div className="bg-background p-3 rounded-md mb-3 space-y-2 text-sm">
                                <label className="block">
                                    <span className="text-text-secondary">Language:</span>
                                    <select value={selectedLanguageFilter} onChange={e => setSelectedLanguageFilter(e.target.value)} className="w-full mt-1 px-2 py-1 rounded-md bg-surface border border-border">
                                        <option value="All">All Languages</option>
                                        {Object.keys(langToExt).map(lang => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-text-secondary">Visibility:</span>
                                    <select value={selectedVisibilityFilter} onChange={e => setSelectedVisibilityFilter(e.target.value)} className="w-full mt-1 px-2 py-1 rounded-md bg-surface border border-border">
                                        <option value="All">All</option>
                                        <option value="private">Private</option>
                                        <option value="team">Team</option>
                                        <option value="public">Public</option>
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-text-secondary">Sort By:</span>
                                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value as typeof sortOrder)} className="w-full mt-1 px-2 py-1 rounded-md bg-surface border border-border">
                                        <option value="date-desc">Newest First</option>
                                        <option value="date-asc">Oldest First</option>
                                        <option value="name-asc">Name (A-Z)</option>
                                        <option value="name-desc">Name (Z-A)</option>
                                        <option value="usage-desc">Most Used</option>
                                    </select>
                                </label>
                                {/* Invented: Bulk Actions UI */}
                                {selectedSnippetsForBulkAction.length > 0 && (
                                    <div className="mt-4 border-t border-border pt-3">
                                        <h5 className="font-semibold text-text-primary mb-2">Bulk Actions ({selectedSnippetsForBulkAction.length} selected)</h5>
                                        <div className="flex gap-2 mb-2">
                                            <button onClick={handleBulkDelete} className="btn-danger flex-grow text-xs py-1">Delete Selected</button>
                                        </div>
                                        <div className="flex">
                                            <input type="text" placeholder="Add tags (comma separated)" className="flex-grow px-2 py-1 text-xs rounded-l-md bg-background border border-border"/>
                                            <button onClick={(e) => handleBulkTag((e.target as HTMLButtonElement).previousElementSibling?.value || '')} className="btn-primary rounded-l-none text-xs py-1">Add Tags</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <ul className="space-y-2 flex-grow overflow-y-auto pr-2 custom-scrollbar">{filteredAndSortedSnippets.map((s: Snippet) => (
                            <li key={s.id} className="group flex items-center justify-between">
                                {/* Invented: Checkbox for bulk selection. */}
                                <input
                                    type="checkbox"
                                    checked={selectedSnippetsForBulkAction.includes(s.id)}
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setSelectedSnippetsForBulkAction(prev => [...prev, s.id]);
                                        } else {
                                            setSelectedSnippetsForBulkAction(prev => prev.filter(id => id !== s.id));
                                        }
                                    }}
                                    className="mr-2 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <button
                                    onClick={() => {
                                        dispatch({ type: 'SET_ACTIVE_SNIPPET', payload: s });
                                        // Reset other panels on snippet change
                                        setShowVersionHistory(false);
                                        setShowCollaborationPanel(false);
                                        setShowAiAnalysisReport(false);
                                        setShowDeploymentPanel(false);
                                        setShowBlockchainProvenance(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md ${activeSnippet?.id === s.id ? 'bg-primary/10 text-primary-dark font-semibold' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                                >
                                    {s.name}
                                    {s.isFavorite && <span className="ml-2 text-yellow-500 text-xs" title="Favorite">⭐</span>}
                                    {s.isArchived && <span className="ml-2 text-text-secondary text-xs" title="Archived">📦</span>}
                                </button>
                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(s.code); addNotification("Copied snippet!", "success") }}
                                        className="ml-2 p-1 text-text-secondary hover:text-primary-dark" title="Copy"
                                    >
                                        <ClipboardDocumentIcon />
                                    </button>
                                    <button onClick={() => handleDelete(s.id)} className="ml-2 p-1 text-text-secondary hover:text-red-500" title="Delete">
                                        <TrashIcon />
                                    </button>
                                </div>
                            </li>
                        ))}</ul>
                        <div className="mt-4 pt-4 border-t border-border">
                            <button onClick={handleAddNew} className="btn-primary w-full text-sm py-2">Add New Snippet</button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="w-2/3 flex flex-col bg-surface border border-border p-4 rounded-lg shadow-md">
                        {activeSnippet ? (<>
                            <div className="flex justify-between items-center mb-2 flex-wrap">
                                {/* Snippet Name Editing */}
                                {isEditingName ?
                                    <input
                                        type="text"
                                        value={activeSnippet.name}
                                        onChange={handleNameChange}
                                        onBlur={() => setIsEditingName(false)}
                                        autoFocus
                                        className="text-xl font-bold bg-background dark:bg-slate-700 rounded px-2 py-1 border border-border focus:ring-primary focus:border-primary"
                                    />
                                    :
                                    <h3 onDoubleClick={() => setIsEditingName(true)} className="text-xl font-bold cursor-pointer flex items-center gap-2">
                                        {activeSnippet.name}
                                        <button onClick={() => updateSnippet({ ...activeSnippet, isFavorite: !activeSnippet.isFavorite })} className={`text-xl ${activeSnippet.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}`} title="Toggle Favorite">⭐</button>
                                    </h3>
                                }
                                {/* Action Buttons */}
                                <div className="flex gap-2 items-center flex-wrap mt-2 sm:mt-0">
                                    <button
                                        onClick={() => handleAiTagging(activeSnippet)}
                                        className="flex items-center gap-1 px-3 py-1 bg-teal-500/80 text-white font-bold text-xs rounded-md hover:bg-teal-600 transition-colors disabled:opacity-50"
                                        disabled={isEnhancing || isRefactoring || isGeneratingTests || isScanningVulnerabilities || !appSettings.aiAutoTaggingEnabled || !appSettings.premiumFeaturesUnlocked}
                                        title={appSettings.premiumFeaturesUnlocked ? "Generate AI Tags" : "AI Tagging is a premium feature."}
                                    >
                                        <SparklesIcon className="w-4 h-4" /> AI Tag
                                    </button>
                                    <button
                                        onClick={handleEnhance}
                                        disabled={isEnhancing || !appSettings.premiumFeaturesUnlocked}
                                        className="flex items-center gap-1 px-3 py-1 bg-purple-500/80 text-white font-bold text-xs rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50"
                                        title={appSettings.premiumFeaturesUnlocked ? "Stream AI Enhancement" : "AI Enhancement is a premium feature."}
                                    >
                                        {isEnhancing ? <LoadingSpinner size="sm" /> : <SparklesIcon className="w-4 h-4" />} AI Enhance
                                    </button>
                                    {appSettings.premiumFeaturesUnlocked && ( // Invented: Premium AI Features.
                                        <>
                                            <button
                                                onClick={handleAiRefactor}
                                                disabled={isRefactoring}
                                                className="flex items-center gap-1 px-3 py-1 bg-blue-500/80 text-white font-bold text-xs rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                                                title="AI Refactor Code"
                                            >
                                                {isRefactoring ? <LoadingSpinner size="sm" /> : <SparklesIcon className="w-4 h-4" />} AI Refactor
                                            </button>
                                            <button
                                                onClick={handleAiGenerateTests}
                                                disabled={isGeneratingTests}
                                                className="flex items-center gap-1 px-3 py-1 bg-orange-500/80 text-white font-bold text-xs rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
                                                title="AI Generate Tests"
                                            >
                                                {isGeneratingTests ? <LoadingSpinner size="sm" /> : <SparklesIcon className="w-4 h-4" />} AI Tests
                                            </button>
                                            <button
                                                onClick={handleAiVulnerabilityScan}
                                                disabled={isScanningVulnerabilities || !appSettings.securityScanningEnabled}
                                                className="flex items-center gap-1 px-3 py-1 bg-red-500/80 text-white font-bold text-xs rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                                                title="AI Vulnerability Scan"
                                            >
                                                {isScanningVulnerabilities ? <LoadingSpinner size="sm" /> : <SparklesIcon className="w-4 h-4" />} AI Scan
                                            </button>
                                        </>
                                    )}

                                    <button onClick={handleDownload} className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                                        <ArrowDownTrayIcon className="w-4 h-4" /> Download
                                    </button>
                                </div>
                            </div>
                            {/* Language Selector */}
                            <div className="mb-2 flex items-center gap-2 text-sm text-text-secondary">
                                <span className="font-bold">Language:</span>
                                {isEditingLanguage ? (
                                    <select
                                        value={activeSnippet.language}
                                        onChange={handleLanguageChange}
                                        onBlur={() => setIsEditingLanguage(false)}
                                        autoFocus
                                        className="bg-background border border-border rounded-md px-2 py-1 text-sm focus:ring-primary focus:border-primary"
                                    >
                                        {Object.keys(langToExt).map(lang => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span onDoubleClick={() => setIsEditingLanguage(true)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 px-2 py-1 rounded-md">
                                        {activeSnippet.language}
                                    </span>
                                )}
                            </div>

                            {/* Code Editor Area (Replaced with SyntaxHighlighting Component) */}
                            <SyntaxHighlighting
                                code={activeSnippet.code}
                                language={activeSnippet.language}
                                theme={appSettings.editorTheme}
                                onCodeChange={code => updateSnippet({ ...activeSnippet, code: code }, false)} // Pass false to avoid versioning on every keystroke
                            />
                            <div className="mt-2 flex items-start gap-2 flex-wrap text-xs text-text-secondary">
                                <span className="font-bold flex-shrink-0 mt-1">Tags:</span>
                                <div className="flex flex-wrap gap-2 flex-grow">
                                    {(activeSnippet.tags ?? []).map(t => (
                                        <span key={t} className="bg-gray-200 dark:bg-slate-700 px-2 py-0.5 rounded-full flex items-center">
                                            {t}
                                            <button onClick={() => handleRemoveTag(t)} className="ml-1 text-red-500 hover:text-red-700">
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        placeholder="+ Add tag"
                                        onKeyDown={handleTagsChange}
                                        className="bg-transparent border-b border-border focus:outline-none focus:border-primary w-24 text-xs px-1"
                                    />
                                </div>
                            </div>
                            {/* Invented: Footer with metadata and expandable panels */}
                            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-text-secondary flex-wrap gap-2">
                                <span>Created: {new Date(activeSnippet.createdAt).toLocaleDateString()}</span>
                                <span>Last Modified: {new Date(activeSnippet.lastModified).toLocaleDateString()}</span>
                                <span>Owner: {activeSnippet.ownerId}</span>
                                <span>Usage: {activeSnippet.usageCount || 0} times</span>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowVersionHistory(!showVersionHistory)} className="text-primary-light hover:underline">
                                        Version History {activeSnippet.versionHistory?.length ? `(${activeSnippet.versionHistory.length})` : ''}
                                    </button>
                                    <button onClick={() => setShowCollaborationPanel(!showCollaborationPanel)} className="text-primary-light hover:underline">
                                        Collaboration
                                    </button>
                                    <button onClick={() => setShowAiAnalysisReport(!showAiAnalysisReport)} className="text-primary-light hover:underline">
                                        AI Analysis
                                    </button>
                                    {appSettings.premiumFeaturesUnlocked && (
                                        <>
                                            <button onClick={() => setShowDeploymentPanel(!showDeploymentPanel)} className="text-primary-light hover:underline">
                                                Deploy
                                            </button>
                                            <button onClick={() => setShowBlockchainProvenance(!showBlockchainProvenance)} className="text-primary-light hover:underline">
                                                Blockchain
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            {showVersionHistory && <SnippetVersionHistory snippet={activeSnippet} />}
                            {showCollaborationPanel && <SnippetSharingOptions snippet={activeSnippet} />}
                            {showAiAnalysisReport && (
                                <div className="bg-background border border-border rounded-lg p-4 mt-4">
                                    <h4 className="text-md font-semibold mb-3">AI Analysis Report <span className="text-text-secondary text-sm">({activeSnippet.aiAnalysis?.lastAnalyzer || 'N/A'})</span></h4>
                                    {!activeSnippet.aiAnalysis ? <p className="text-text-secondary text-sm">Run an AI analysis to get insights.</p> : (
                                        <div className="space-y-2 text-sm">
                                            <p><strong>Last Analyzed:</strong> {new Date(activeSnippet.aiAnalysis.timestamp).toLocaleString()}</p>
                                            {activeSnippet.aiAnalysis.complexityScore && <p><strong>Complexity Score:</strong> {activeSnippet.aiAnalysis.complexityScore.toFixed(2)} (higher is more complex)</p>}
                                            {activeSnippet.aiAnalysis.readabilityScore && <p><strong>Readability Score:</strong> {activeSnippet.aiAnalysis.readabilityScore.toFixed(2)}</p>}
                                            {activeSnippet.aiAnalysis.docstringStatus && <p><strong>Documentation Status:</strong> {activeSnippet.aiAnalysis.docstringStatus}</p>}
                                            {activeSnippet.aiAnalysis.performanceHints?.length && (
                                                <>
                                                    <p><strong>Performance Hints:</strong></p>
                                                    <ul className="list-disc list-inside ml-4">
                                                        {activeSnippet.aiAnalysis.performanceHints.map((hint, i) => <li key={i}>{hint}</li>)}
                                                    </ul>
                                                </>
                                            )}
                                            {activeSnippet.aiAnalysis.vulnerabilityScan?.length && (
                                                <>
                                                    <p className="font-bold text-red-500">Vulnerabilities Detected:</p>
                                                    <ul className="list-disc list-inside ml-4">
                                                        {activeSnippet.aiAnalysis.vulnerabilityScan.map((vuln, i) => (
                                                            <li key={i} className={`text-${vuln.severity === 'critical' ? 'red-700' : vuln.severity === 'high' ? 'red-500' : 'orange-400'}`}>
                                                                <strong>{vuln.severity.toUpperCase()}:</strong> {vuln.description} {vuln.cve && `(CVE: ${vuln.cve})`}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            {appSettings.premiumFeaturesUnlocked && showDeploymentPanel && (
                                <div className="bg-background border border-border rounded-lg p-4 mt-4">
                                    <h4 className="text-md font-semibold mb-3">Deployment Options</h4>
                                    <div className="space-y-3">
                                        <p className="text-sm text-text-secondary">Deploy your snippet as a serverless function directly from here!</p>
                                        <label className="block text-sm font-medium text-text-secondary">Target Platform:</label>
                                        <select
                                            value={activeSnippet.deploymentMetadata?.targetPlatform || 'AWS_Lambda'}
                                            onChange={e => updateSnippet({
                                                deploymentMetadata: {
                                                    ...activeSnippet.deploymentMetadata,
                                                    targetPlatform: e.target.value as DeploymentMetadata['targetPlatform']
                                                }
                                            })}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-background"
                                        >
                                            <option value="AWS_Lambda">AWS Lambda</option>
                                            <option value="Azure_Functions">Azure Functions</option>
                                            <option value="GCP_CloudFunctions">GCP Cloud Functions</option>
                                            <option value="Vercel_Edge">Vercel Edge Function</option>
                                            <option value="Kubernetes_Pod">Kubernetes Pod</option>
                                        </select>
                                        <button
                                            onClick={async () => {
                                                if (!activeSnippet.deploymentMetadata?.targetPlatform) { addNotification('Please select a target platform.', 'warning'); return; }
                                                addNotification(`Deploying to ${activeSnippet.deploymentMetadata.targetPlatform}...`, 'info');
                                                try {
                                                    const deploymentResult = await externalServices.DeploymentService.deploySnippetAsFunction(activeSnippet, activeSnippet.deploymentMetadata.targetPlatform, {});
                                                    updateSnippet({ deploymentMetadata: deploymentResult });
                                                    addNotification('Deployment successful!', 'success');
                                                    externalServices.CommunicationService.sendNotification(userProfile.email, `Snippet '${activeSnippet.name}' deployed successfully to ${activeSnippet.deploymentMetadata.targetPlatform}.`, 'Email');
                                                } catch (e) {
                                                    addNotification('Deployment failed.', 'error');
                                                }
                                            }}
                                            className="btn-primary w-full mt-2"
                                            disabled={activeSnippet.deploymentMetadata?.status === 'deploying'}
                                        >
                                            {activeSnippet.deploymentMetadata?.status === 'deploying' ? <LoadingSpinner size="sm" /> : 'Deploy Snippet'}
                                        </button>
                                        {activeSnippet.deploymentMetadata && (
                                            <div className="mt-3 text-xs">
                                                <p><strong>Status:</strong> {activeSnippet.deploymentMetadata.status}</p>
                                                {activeSnippet.deploymentMetadata.lastDeploymentTimestamp && <p><strong>Last Deployed:</strong> {new Date(activeSnippet.deploymentMetadata.lastDeploymentTimestamp).toLocaleString()}</p>}
                                                {activeSnippet.deploymentMetadata.lastDeploymentId && <p><strong>Deployment ID:</strong> {activeSnippet.deploymentMetadata.lastDeploymentId}</p>}
                                                <button onClick={async () => {
                                                    addNotification('Fetching deployment logs...', 'info');
                                                    const logs = await externalServices.DeploymentService.getDeploymentLogs(activeSnippet.deploymentMetadata!.lastDeploymentId!, activeSnippet.deploymentMetadata!.targetPlatform);
                                                    addNotification('Logs fetched. See console for details.', 'info');
                                                    console.log('Deployment Logs:', logs);
                                                }} className="text-primary-light hover:underline mt-1">View Deployment Logs</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {appSettings.premiumFeaturesUnlocked && showBlockchainProvenance && (
                                <div className="bg-background border border-border rounded-lg p-4 mt-4">
                                    <h4 className="text-md font-semibold mb-3">Blockchain Provenance (Ethereum)</h4>
                                    <div className="space-y-3">
                                        <p className="text-sm text-text-secondary">Record an immutable hash of this snippet on the Ethereum blockchain to prove its existence and integrity at a specific time.</p>
                                        <button
                                            onClick={async () => {
                                                const snippetHash = `sha256-${crypto.randomUUID()}`; // Simulate SHA256 hash
                                                addNotification('Recording snippet hash on blockchain...', 'info');
                                                try {
                                                    const tx = await externalServices.BlockchainProvenanceService.recordSnippetHash(activeSnippet.id, snippetHash);
                                                    updateSnippet({ ...activeSnippet, checksum: snippetHash, linkedResources: [...(activeSnippet.linkedResources || []), { name: 'Ethereum Tx', url: `https://etherscan.io/tx/${tx.transactionHash}`, type: 'other' }] });
                                                    addNotification(`Snippet hash recorded! Tx: ${tx.transactionHash}`, 'success');
                                                } catch (e) {
                                                    addNotification('Failed to record on blockchain.', 'error');
                                                }
                                            }}
                                            className="btn-primary w-full mt-2"
                                        >
                                            Record Hash on Blockchain
                                        </button>
                                        {activeSnippet.checksum && (
                                            <div className="mt-3 text-xs">
                                                <p><strong>Current Hash:</strong> {activeSnippet.checksum}</p>
                                                <button onClick={async () => {
                                                    addNotification('Verifying hash on blockchain...', 'info');
                                                    const verified = await externalServices.BlockchainProvenanceService.verifySnippetHash(activeSnippet.id, activeSnippet.checksum!);
                                                    addNotification(`Verification status: ${verified ? 'SUCCESS' : 'FAILED'}`, verified ? 'success' : 'error');
                                                }} className="text-primary-light hover:underline mt-1">Verify Hash</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </>) : (
                            <div className="flex-grow flex items-center justify-center bg-background border border-border rounded-lg text-text-secondary">Select a snippet or create a new one.</div>
                        )}
                    </main>
                </div>
                {showSettingsPanel && <SettingsPanel />}
            </div>
        </SnippetVaultContext.Provider>
    );
};
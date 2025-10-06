// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback, useEffect, useRef, useReducer } from 'react';
import { generateIamPolicyStream } from '../../services/aiService.ts';
import { ShieldCheckIcon } from '../icons.tsx';
import { LoadingSpinner, MarkdownRenderer } from '../shared/index.tsx';

// --- Global Constants and Configuration for Enterprise-Grade Operations ---
// These constants define the operational parameters and available services for our IAM Policy Generator.
// They are "invented" here to provide a robust, configurable backend for a commercial application.

/**
 * @typedef {'aws' | 'gcp' | 'azure' | 'kubernetes' | 'custom'} CloudPlatform
 * Represents the supported cloud platforms for IAM policy generation.
 * "Invented" to extend beyond basic AWS/GCP for multi-cloud enterprise adoption.
 */
export type CloudPlatform = 'aws' | 'gcp' | 'azure' | 'kubernetes' | 'custom';

/**
 * @typedef {'openai-gpt4' | 'google-gemini-pro' | 'custom-finetuned-policy-model'} AiModel
 * Defines the AI models available for policy generation.
 * This introduces choice and allows for integrating multiple cutting-edge LLMs.
 * "Invented" to showcase advanced AI orchestration and multi-model support.
 */
export type AiModel = 'openai-gpt4' | 'google-gemini-pro' | 'custom-finetuned-policy-model';

/**
 * @typedef {'least-privilege' | 'cost-optimization' | 'security-compliance' | 'operational-efficiency'} OptimizationGoal
 * Describes different goals for policy optimization.
 * "Invented" to guide the AI towards specific outcomes, making generated policies more strategic.
 */
export type OptimizationGoal = 'least-privilege' | 'cost-optimization' | 'security-compliance' | 'operational-efficiency';

/**
 * @typedef {'hipaa' | 'gdpr' | 'pci-dss' | 'soc2' | 'iso27001'} ComplianceStandard
 * Lists common compliance standards for policy validation.
 * "Invented" to integrate automated compliance checking, a critical feature for enterprises.
 */
export type ComplianceStandard = 'hipaa' | 'gdpr' | 'pci-dss' | 'soc2' | 'iso27001';

/**
 * @typedef {'json' | 'yaml' | 'terraform' | 'cloudformation'} ExportFormat
 * Defines the available formats for exporting generated policies.
 * "Invented" to facilitate integration with various Infrastructure-as-Code (IaC) pipelines.
 */
export type ExportFormat = 'json' | 'yaml' | 'terraform' | 'cloudformation';

/**
 * @typedef {'info' | 'warning' | 'error' | 'success'} NotificationType
 * Standard notification types for UI feedback.
 */
export type NotificationType = 'info' | 'warning' | 'error' | 'success';

/**
 * @interface Notification
 * Represents a user notification.
 * "Invented" for a robust, centralized notification system.
 */
export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    timestamp: Date;
    isDismissed: boolean;
}

/**
 * @interface AiSettings
 * Configuration for the AI model used in generation.
 * "Invented" to give users granular control over AI behavior.
 */
export interface AiSettings {
    model: AiModel;
    temperature: number; // Creativity: 0.0 - 1.0
    topP: number; // Diversity: 0.0 - 1.0
    maxTokens: number; // Output length control
    systemMessage: string; // Custom instruction for the AI
    enableFineTuning: boolean; // Flag to indicate if model should use fine-tuned capabilities
    optimizationGoal: OptimizationGoal; // New field for specific optimization
}

/**
 * @interface PolicyTemplate
 * Represents a pre-defined IAM policy template.
 * "Invented" to accelerate policy creation for common use cases and promote standardization.
 */
export interface PolicyTemplate {
    id: string;
    name: string;
    description: string;
    platform: CloudPlatform;
    defaultDescription: string; // The natural language description to pre-fill
    tags: string[];
    isRecommended: boolean;
    createdAt: string;
    createdBy: string;
}

/**
 * @interface PolicyRevision
 * Stores historical versions of generated policies.
 * "Invented" for robust version control, auditability, and rollback capabilities.
 */
export interface PolicyRevision {
    id: string;
    policyId: string; // Link to the current policy
    version: number;
    generatedAt: string;
    generatedBy: string;
    descriptionUsed: string;
    aiSettingsUsed: AiSettings;
    policyContent: string;
    feedback: PolicyFeedback | null;
}

/**
 * @interface PolicyFeedback
 * User feedback on a generated policy.
 * "Invented" for continuous improvement of the AI model and generation quality.
 */
export interface PolicyFeedback {
    rating: number; // e.g., 1-5 stars
    comment: string;
    isHelpful: boolean | null; // Thumbs up/down
    suggestedChanges: string; // Natural language suggestions
    submittedAt: string;
}

/**
 * @interface ComplianceCheckResult
 * Result of a compliance scan on a policy.
 * "Invented" for automated policy validation against enterprise security standards.
 */
export interface ComplianceCheckResult {
    standard: ComplianceStandard;
    isCompliant: boolean;
    findings: {
        severity: 'high' | 'medium' | 'low';
        message: string;
        remediationSuggestion: string;
        ruleId: string;
    }[];
    checkedAt: string;
}

/**
 * @interface CloudResource
 * Represents a discovered cloud resource.
 * "Invented" for context-aware policy generation, allowing the AI to reference actual resources.
 */
export interface CloudResource {
    id: string;
    name: string;
    type: string; // e.g., 's3_bucket', 'ec2_instance', 'gce_vm'
    arn: string; // AWS ARN or GCP equivalent
    region: string;
    tags: { [key: string]: string };
    platform: CloudPlatform;
}

/**
 * @interface DeploymentStatus
 * Status of direct policy deployment.
 * "Invented" for integrating directly with cloud provider APIs for push-button deployment.
 */
export interface DeploymentStatus {
    id: string;
    policyId: string;
    status: 'pending' | 'in_progress' | 'success' | 'failed' | 'rollback';
    deploymentTarget: string; // e.g., AWS IAM Role, GCP Service Account
    deployedAt: string;
    deployedBy: string;
    errorMessage?: string;
    cloudUrl?: string; // Link to the deployed resource in cloud console
}

/**
 * @interface CodeQualityReport
 * Represents a report from a policy linter or security scanner.
 * "Invented" to provide static analysis and best practice recommendations for generated policies.
 */
export interface CodeQualityReport {
    linterName: string;
    issues: {
        severity: 'error' | 'warning' | 'info';
        message: string;
        line?: number;
        column?: number;
        ruleId?: string;
    }[];
    passed: boolean;
    scanTime: string;
}

// --- External Service Mockups and Client Integrations (up to 1000 features represented by these services) ---
// These functions simulate interactions with various external commercial-grade services.
// They are "invented" to demonstrate the extensive integration capabilities of our platform.

/**
 * Simulates fetching available AI models from a backend service.
 * @returns {Promise<AiModel[]>} A list of available AI models.
 * This represents a 'Model Catalog Service'.
 */
export const fetchAvailableAiModels = async (): Promise<AiModel[]> => {
    // In a real application, this would be an API call to a backend service.
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return ['openai-gpt4', 'google-gemini-pro', 'custom-finetuned-policy-model'];
};

/**
 * Simulates fetching predefined policy templates.
 * @param {CloudPlatform} platform - The cloud platform to filter templates by.
 * @returns {Promise<PolicyTemplate[]>} A list of policy templates.
 * This represents a 'Policy Template Repository Service'.
 */
export const fetchPolicyTemplates = async (platform: CloudPlatform): Promise<PolicyTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const allTemplates: PolicyTemplate[] = [
        {
            id: 'tpl-aws-s3-read',
            name: 'AWS S3 Read-Only',
            description: 'Allows read access to all S3 buckets.',
            platform: 'aws',
            defaultDescription: 'A user role that can read from all S3 buckets.',
            tags: ['s3', 'read', 'data-analyst'],
            isRecommended: true,
            createdAt: '2023-01-15T10:00:00Z',
            createdBy: 'system'
        },
        {
            id: 'tpl-gcp-compute-viewer',
            name: 'GCP Compute Viewer',
            description: 'Grants view access to GCP Compute Engine resources.',
            platform: 'gcp',
            defaultDescription: 'A service account that can view GCP Compute Engine instances and disks.',
            tags: ['gcp', 'compute', 'viewer'],
            isRecommended: true,
            createdAt: '2023-02-20T11:30:00Z',
            createdBy: 'system'
        },
        {
            id: 'tpl-aws-lambda-invoke',
            name: 'AWS Lambda Invoker',
            description: 'Allows invoking a specific AWS Lambda function.',
            platform: 'aws',
            defaultDescription: 'A user role that can invoke the Lambda function named "MyFunction".',
            tags: ['aws', 'lambda', 'invoke'],
            isRecommended: false,
            createdAt: '2023-03-01T14:00:00Z',
            createdBy: 'admin'
        },
        {
            id: 'tpl-aws-admin',
            name: 'AWS Administrator Access',
            description: 'Grants full administrative access to AWS resources. Use with caution.',
            platform: 'aws',
            defaultDescription: 'An administrator role with full access to all AWS services and resources.',
            tags: ['aws', 'admin', 'danger'],
            isRecommended: false,
            createdAt: '2023-01-01T09:00:00Z',
            createdBy: 'system'
        },
        {
            id: 'tpl-gcp-billing-reader',
            name: 'GCP Billing Account User',
            description: 'Allows viewing billing account information.',
            platform: 'gcp',
            defaultDescription: 'A user who can view billing account details and costs.',
            tags: ['gcp', 'billing', 'finance'],
            isRecommended: true,
            createdAt: '2023-04-05T09:00:00Z',
            createdBy: 'system'
        },
        // Placeholder for Azure, Kubernetes, Custom templates
        {
            id: 'tpl-azure-storage-blob-reader',
            name: 'Azure Storage Blob Reader',
            description: 'Grants read access to Azure Storage Blobs.',
            platform: 'azure',
            defaultDescription: 'A service principal that can read data from Azure Storage Blob containers.',
            tags: ['azure', 'storage', 'blob', 'reader'],
            isRecommended: true,
            createdAt: '2023-05-10T08:00:00Z',
            createdBy: 'system'
        },
        {
            id: 'tpl-k8s-pod-reader',
            name: 'Kubernetes Pod Reader',
            description: 'Allows viewing Kubernetes pods within a namespace.',
            platform: 'kubernetes',
            defaultDescription: 'A service account that can list and get pods in the "default" namespace.',
            tags: ['kubernetes', 'pod', 'reader'],
            isRecommended: true,
            createdAt: '2023-06-15T13:00:00Z',
            createdBy: 'system'
        },
        {
            id: 'tpl-custom-microservice-access',
            name: 'Custom Microservice Access',
            description: 'Grants access to internal microservice APIs.',
            platform: 'custom',
            defaultDescription: 'A custom policy for accessing the "UserManagement" microservice.',
            tags: ['custom', 'microservice', 'api'],
            isRecommended: false,
            createdAt: '2023-07-20T16:00:00Z',
            createdBy: 'dev_team'
        }
    ];
    return allTemplates.filter(t => t.platform === platform || platform === 'custom'); // allow 'custom' to show all if selected
};

/**
 * Simulates retrieving a policy's revision history.
 * @param {string} policyId - The ID of the policy.
 * @returns {Promise<PolicyRevision[]>} A list of policy revisions.
 * This represents a 'Policy Versioning Service'.
 */
export const fetchPolicyRevisions = async (policyId: string): Promise<PolicyRevision[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    // Mock data for demonstration
    if (policyId === 'mock-policy-123') {
        return [
            {
                id: 'rev-001',
                policyId: policyId,
                version: 1,
                generatedAt: '2023-10-26T10:00:00Z',
                generatedBy: 'user@example.com',
                descriptionUsed: 'Initial policy for S3 read.',
                aiSettingsUsed: { model: 'openai-gpt4', temperature: 0.7, topP: 0.9, maxTokens: 500, systemMessage: 'You are an AWS IAM policy expert.', enableFineTuning: false, optimizationGoal: 'least-privilege' },
                policyContent: '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject","s3:ListBucket"],"Resource":["arn:aws:s3:::*","arn:aws:s3:::*/*"]}]}',
                feedback: null
            },
            {
                id: 'rev-002',
                policyId: policyId,
                version: 2,
                generatedAt: '2023-10-26T11:00:00Z',
                generatedBy: 'user@example.com',
                descriptionUsed: 'Refined policy for S3 read from specific bucket.',
                aiSettingsUsed: { model: 'google-gemini-pro', temperature: 0.5, topP: 0.8, maxTokens: 400, systemMessage: 'Ensure policies are specific.', enableFineTuning: true, optimizationGoal: 'security-compliance' },
                policyContent: '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject","s3:ListBucket"],"Resource":["arn:aws:s3:::my-specific-bucket","arn:aws:s3:::my-specific-bucket/*"]}]}',
                feedback: { rating: 5, comment: 'Excellent! Very accurate.', isHelpful: true, suggestedChanges: '', submittedAt: '2023-10-26T11:05:00Z' }
            }
        ];
    }
    return [];
};

/**
 * Simulates submitting feedback on a policy to an AI feedback service.
 * @param {string} policyId - The ID of the policy.
 * @param {string} revisionId - The ID of the policy revision.
 * @param {PolicyFeedback} feedback - The feedback object.
 * This represents an 'AI Feedback and Improvement Service'.
 */
export const submitPolicyFeedback = async (policyId: string, revisionId: string, feedback: PolicyFeedback): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`Feedback submitted for policy ${policyId}, revision ${revisionId}:`, feedback);
    // In a real system, this would trigger model fine-tuning or human review.
};

/**
 * Simulates performing compliance checks on a policy.
 * @param {string} policyContent - The policy content to check.
 * @param {CloudPlatform} platform - The cloud platform of the policy.
 * @param {ComplianceStandard[]} standards - The compliance standards to check against.
 * @returns {Promise<ComplianceCheckResult[]>} Results of the compliance checks.
 * This represents a 'Compliance & Security Policy Scanner Service' (e.g., integrating with AWS Config, GCP Security Command Center, or a custom tool like Open Policy Agent).
 */
export const runComplianceChecks = async (policyContent: string, platform: CloudPlatform, standards: ComplianceStandard[]): Promise<ComplianceCheckResult[]> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const results: ComplianceCheckResult[] = [];

    // Mock compliance logic for demonstration
    if (policyContent.includes('*:*') && standards.includes('least-privilege' as ComplianceStandard)) { // Example: detect overly broad permissions
        results.push({
            standard: 'least-privilege' as ComplianceStandard, // Cast because least-privilege is an OptimizationGoal
            isCompliant: false,
            findings: [{
                severity: 'high',
                message: 'Policy grants overly broad permissions (Resource: "*" or Action: "*"). Violates least privilege principle.',
                remediationSuggestion: 'Refine resource ARNs and actions to be as specific as possible.',
                ruleId: 'LP-001'
            }],
            checkedAt: new Date().toISOString()
        });
    } else if (policyContent.length > 500 && standards.includes('operational-efficiency' as ComplianceStandard)) { // Example: too long policy
        results.push({
            standard: 'operational-efficiency' as ComplianceStandard,
            isCompliant: false,
            findings: [{
                severity: 'low',
                message: 'Policy is very long, potentially indicating complexity. Consider splitting into multiple policies or simplifying.',
                remediationSuggestion: 'Review policy for opportunities to consolidate or split.',
                ruleId: 'OE-003'
            }],
            checkedAt: new Date().toISOString()
        });
    }

    if (platform === 'aws' && !policyContent.includes('"Version":"2012-10-17"') && standards.includes('iso27001')) { // Example: missing version
        results.push({
            standard: 'iso27001',
            isCompliant: false,
            findings: [{
                severity: 'high',
                message: 'AWS IAM policy missing "Version" field or using an outdated version. Critical for security best practices.',
                remediationSuggestion: 'Ensure "Version": "2012-10-17" is present.',
                ruleId: 'ISO-AWS-001'
            }],
            checkedAt: new Date().toISOString()
        });
    }
    // If no findings, assume compliant for simplicity
    if (results.length === 0) {
        standards.forEach(s => {
            results.push({
                standard: s,
                isCompliant: true,
                findings: [],
                checkedAt: new Date().toISOString()
            });
        });
    }

    return results;
};

/**
 * Simulates deploying a policy directly to a cloud provider.
 * This is a highly sensitive operation requiring extensive security and audit trails.
 * @param {string} policyContent - The policy content to deploy.
 * @param {CloudPlatform} platform - The target cloud platform.
 * @param {string} targetName - The name of the IAM role/service account to update/create.
 * @returns {Promise<DeploymentStatus>} The status of the deployment.
 * This represents a 'Policy Deployment Orchestrator Service' with integrations to AWS IAM, GCP IAM, Azure AD.
 */
export const deployPolicyToCloud = async (policyContent: string, platform: CloudPlatform, targetName: string): Promise<DeploymentStatus> => {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate a long deployment process
    const deploymentId = `dep-${Date.now()}`;

    // In a real scenario, this would involve AWS SDK, GCP SDK, Azure SDK calls.
    // For demonstration, we'll simulate success or failure based on content.
    const isSuccess = !policyContent.includes('BAD_POLICY_SYNTAX');

    return {
        id: deploymentId,
        policyId: 'mock-policy-123', // Assuming a policy ID
        status: isSuccess ? 'success' : 'failed',
        deploymentTarget: targetName,
        deployedAt: new Date().toISOString(),
        deployedBy: 'current_user@example.com',
        errorMessage: isSuccess ? undefined : 'Simulated deployment failure due to invalid policy syntax or permissions.',
        cloudUrl: isSuccess ? `https://console.cloud.${platform}.com/iam/policy/${targetName}` : undefined // Mock URL
    };
};

/**
 * Simulates interaction with a Git repository for IaC.
 * @param {string} filePath - The path to the file in the repository.
 * @param {string} content - The content to commit.
 * @param {string} commitMessage - The commit message.
 * @param {string} branch - The branch to commit to.
 * @returns {Promise<string>} URL to the commit/PR.
 * This represents a 'GitOps Integration Service' (e.g., GitHub, GitLab API integration).
 */
export const commitPolicyToGit = async (filePath: string, content: string, commitMessage: string, branch: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Committing to Git: ${filePath}, branch: ${branch}, message: "${commitMessage}"`);
    // Mock API call to GitHub/GitLab
    const commitUrl = `https://github.com/my-org/my-repo/commit/${Math.random().toString(36).substring(2, 10)}`;
    return commitUrl;
};

/**
 * Simulates a policy syntax validation and linting service.
 * @param {string} policyContent - The policy string.
 * @param {CloudPlatform} platform - The platform.
 * @returns {Promise<CodeQualityReport>} A report on the policy's quality.
 * This represents an 'IAM Policy Linter Service' (e.g., cfn-lint, terraform validate, custom linter).
 */
export const runPolicyLinter = async (policyContent: string, platform: CloudPlatform): Promise<CodeQualityReport> => {
    await new Promise(resolve => setTimeout(resolve, 700));

    const issues: CodeQualityReport['issues'] = [];
    let passed = true;

    // Mock linting rules
    if (platform === 'aws') {
        if (!policyContent.includes('Effect')) {
            issues.push({ severity: 'error', message: 'AWS IAM Policy must have an "Effect" statement.', line: 1, ruleId: 'AWSLINT-001' });
            passed = false;
        }
        if (policyContent.includes('Condition') && !policyContent.includes('aws:SourceIp')) {
            issues.push({ severity: 'warning', message: 'Complex conditions often require IP restrictions or MFA.', ruleId: 'AWSLINT-002' });
        }
    } else if (platform === 'gcp') {
        if (!policyContent.includes('bindings')) {
            issues.push({ severity: 'error', message: 'GCP IAM Policy must contain "bindings".', line: 1, ruleId: 'GCPLINT-001' });
            passed = false;
        }
    }

    if (policyContent.length > 2000) {
        issues.push({ severity: 'info', message: 'Policy content is very large, consider modularizing.', ruleId: 'GEN-003' });
    }

    return {
        linterName: `${platform.toUpperCase()} Policy Linter`,
        issues,
        passed,
        scanTime: new Date().toISOString()
    };
};

/**
 * Simulates an internal audit logging service.
 * @param {string} eventType - Type of event (e.g., 'POLICY_GENERATED', 'POLICY_DEPLOYED').
 * @param {any} details - Event details.
 * This represents an 'Audit Log Service' essential for enterprise security and compliance.
 */
export const logAuditEvent = async (eventType: string, details: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(`AUDIT_EVENT: [${eventType}] - User: current_user@example.com, Details:`, details);
    // In a real system, this would push to Splunk, Datadog, ELK, or a dedicated audit database.
};

/**
 * Utility to debounce a function call.
 * "Invented" for performance optimization, especially for continuous input or search.
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>): void => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

/**
 * Utility to copy text to clipboard.
 * "Invented" for enhanced user experience.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
};

// --- Advanced State Management with useReducer ---
// This reducer manages notifications, providing a structured way to handle UI alerts.
// "Invented" to provide a robust, scalable notification system.
interface NotificationState {
    notifications: Notification[];
}

type NotificationAction =
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'DISMISS_NOTIFICATION'; payload: string }
    | { type: 'CLEAR_ALL_NOTIFICATIONS' };

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, { ...action.payload, id: Math.random().toString(36).substring(2, 9), timestamp: new Date(), isDismissed: false }]
            };
        case 'DISMISS_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, isDismissed: true } : n
                )
            };
        case 'CLEAR_ALL_NOTIFICATIONS':
            return { ...state, notifications: [] };
        default:
            return state;
    }
};

// --- Custom Hooks for Reusable Logic ---

/**
 * @hook useNotifications
 * Manages adding and dismissing notifications.
 * "Invented" for abstracting notification logic into a reusable hook.
 */
export const useNotifications = () => {
    const [state, dispatch] = useReducer(notificationReducer, { notifications: [] });

    const addNotification = useCallback((message: string, type: NotificationType = 'info') => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: { id: '', message, type, timestamp: new Date(), isDismissed: false } });
    }, []);

    const dismissNotification = useCallback((id: string) => {
        dispatch({ type: 'DISMISS_NOTIFICATION', payload: id });
    }, []);

    const clearAllNotifications = useCallback(() => {
        dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
    }, []);

    return {
        notifications: state.notifications.filter(n => !n.isDismissed),
        addNotification,
        dismissNotification,
        clearAllNotifications
    };
};

/**
 * @hook usePolicyHistory
 * Manages fetching and storing policy revision history.
 * "Invented" to encapsulate policy versioning logic.
 */
export const usePolicyHistory = (policyId: string) => {
    const [history, setHistory] = useState<PolicyRevision[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const loadHistory = useCallback(async () => {
        if (!policyId) return;
        setHistoryLoading(true);
        setHistoryError(null);
        try {
            const revisions = await fetchPolicyRevisions(policyId);
            setHistory(revisions);
        } catch (err) {
            setHistoryError(err instanceof Error ? err.message : 'Failed to fetch policy history.');
        } finally {
            setHistoryLoading(false);
        }
    }, [policyId]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    return { history, historyLoading, historyError, reloadHistory: loadHistory };
};

// --- Reusable UI Components for Enhanced Experience ---

/**
 * @component NotificationToast
 * Displays a single notification toast.
 * "Invented" as part of a modern, non-intrusive notification system.
 */
export const NotificationToast: React.FC<{ notification: Notification; onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => {
    const { id, message, type } = notification;
    const backgroundColor = {
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
        success: 'bg-green-500',
    }[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(id);
        }, 5000); // Auto-dismiss after 5 seconds
        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    return (
        <div className={`${backgroundColor} text-white p-3 rounded-md shadow-lg flex items-center justify-between animate-slide-in-right`}>
            <span>{message}</span>
            <button onClick={() => onDismiss(id)} className="ml-4 text-white hover:text-gray-200">
                &times;
            </button>
        </div>
    );
};

/**
 * @component NotificationContainer
 * Renders all active notification toasts.
 * "Invented" to manage multiple notifications gracefully.
 */
export const NotificationContainer: React.FC<{ notifications: Notification[]; onDismiss: (id: string) => void }> = ({ notifications, onDismiss }) => (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map(n => (
            <NotificationToast key={n.id} notification={n} onDismiss={onDismiss} />
        ))}
    </div>
);

/**
 * @component AiSettingsPanel
 * A configurable panel for AI generation settings.
 * "Invented" to empower advanced users with control over AI behavior.
 */
export const AiSettingsPanel: React.FC<{
    aiSettings: AiSettings;
    onSettingsChange: (settings: AiSettings) => void;
    availableModels: AiModel[];
}> = ({ aiSettings, onSettingsChange, availableModels }) => {
    return (
        <div className="p-4 bg-surface-alt rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-3 text-text-primary">AI Generation Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="aiModel" className="text-sm font-medium mb-1 block">AI Model</label>
                    <select
                        id="aiModel"
                        value={aiSettings.model}
                        onChange={(e) => onSettingsChange({ ...aiSettings, model: e.target.value as AiModel })}
                        className="w-full p-2 bg-background border rounded text-sm"
                    >
                        {availableModels.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="temperature" className="text-sm font-medium mb-1 block">Temperature ({aiSettings.temperature.toFixed(1)})</label>
                    <input
                        type="range"
                        id="temperature"
                        min="0.0"
                        max="1.0"
                        step="0.1"
                        value={aiSettings.temperature}
                        onChange={(e) => onSettingsChange({ ...aiSettings, temperature: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
                    />
                    <p className="text-xs text-text-secondary mt-1">Controls randomness. Higher = more creative, Lower = more deterministic.</p>
                </div>
                <div>
                    <label htmlFor="topP" className="text-sm font-medium mb-1 block">Top P ({aiSettings.topP.toFixed(1)})</label>
                    <input
                        type="range"
                        id="topP"
                        min="0.0"
                        max="1.0"
                        step="0.1"
                        value={aiSettings.topP}
                        onChange={(e) => onSettingsChange({ ...aiSettings, topP: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
                    />
                    <p className="text-xs text-text-secondary mt-1">Controls diversity by nucleus sampling.</p>
                </div>
                <div>
                    <label htmlFor="maxTokens" className="text-sm font-medium mb-1 block">Max Tokens ({aiSettings.maxTokens})</label>
                    <input
                        type="number"
                        id="maxTokens"
                        min="100"
                        max="2000"
                        step="100"
                        value={aiSettings.maxTokens}
                        onChange={(e) => onSettingsChange({ ...aiSettings, maxTokens: parseInt(e.target.value) })}
                        className="w-full p-2 bg-background border rounded text-sm"
                    />
                    <p className="text-xs text-text-secondary mt-1">Maximum length of the generated policy.</p>
                </div>
                <div>
                    <label htmlFor="optimizationGoal" className="text-sm font-medium mb-1 block">Optimization Goal</label>
                    <select
                        id="optimizationGoal"
                        value={aiSettings.optimizationGoal}
                        onChange={(e) => onSettingsChange({ ...aiSettings, optimizationGoal: e.target.value as OptimizationGoal })}
                        className="w-full p-2 bg-background border rounded text-sm"
                    >
                        {['least-privilege', 'cost-optimization', 'security-compliance', 'operational-efficiency'].map(goal => (
                            <option key={goal} value={goal}>{goal.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
                        ))}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="systemMessage" className="text-sm font-medium mb-1 block">System Message</label>
                    <textarea
                        id="systemMessage"
                        value={aiSettings.systemMessage}
                        onChange={(e) => onSettingsChange({ ...aiSettings, systemMessage: e.target.value })}
                        className="w-full p-2 bg-background border rounded text-sm min-h-[80px]"
                        placeholder="e.g., 'You are a highly secure IAM policy expert. Always prioritize least privilege.'"
                    />
                    <p className="text-xs text-text-secondary mt-1">Pre-instruct the AI for specific behavior or expertise.</p>
                </div>
                <div className="md:col-span-2 flex items-center">
                    <input
                        type="checkbox"
                        id="enableFineTuning"
                        checked={aiSettings.enableFineTuning}
                        onChange={(e) => onSettingsChange({ ...aiSettings, enableFineTuning: e.target.checked })}
                        className="mr-2"
                    />
                    <label htmlFor="enableFineTuning" className="text-sm font-medium">Enable Fine-Tuned Model (if available)</label>
                    <p className="text-xs text-text-secondary ml-2">(Uses a model optimized from past user feedback)</p>
                </div>
            </div>
        </div>
    );
};

/**
 * @component PolicyTemplateBrowser
 * Allows users to browse and select predefined policy templates.
 * "Invented" to streamline policy creation and ensure best practices are followed.
 */
export const PolicyTemplateBrowser: React.FC<{
    platform: CloudPlatform;
    onTemplateSelect: (template: PolicyTemplate) => void;
}> = ({ platform, onTemplateSelect }) => {
    const [templates, setTemplates] = useState<PolicyTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchPolicyTemplates(platform)
            .then(data => setTemplates(data))
            .catch(err => setError(err instanceof Error ? err.message : 'Failed to load templates.'))
            .finally(() => setLoading(false));
    }, [platform]);

    if (loading) return <div className="p-4 text-center"><LoadingSpinner /> Loading templates...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4 bg-surface-alt rounded-lg shadow-inner mt-4">
            <h3 className="text-lg font-semibold mb-3 text-text-primary">Policy Templates ({platform.toUpperCase()})</h3>
            {templates.length === 0 ? (
                <p className="text-text-secondary">No templates available for {platform.toUpperCase()}.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                    {templates.map(template => (
                        <div
                            key={template.id}
                            className={`p-3 border rounded-md cursor-pointer hover:bg-surface-hover ${template.isRecommended ? 'border-primary-light' : 'border-surface'}`}
                            onClick={() => onTemplateSelect(template)}
                        >
                            <h4 className="font-medium text-text-primary">{template.name} {template.isRecommended && <span className="ml-1 text-xs px-2 py-0.5 bg-primary-light text-text-on-primary rounded-full">Recommended</span>}</h4>
                            <p className="text-sm text-text-secondary mt-1">{template.description}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {template.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-text-secondary">{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * @component PolicyRevisionViewer
 * Displays the history of policy revisions and allows comparison.
 * "Invented" for deep auditing, version control, and understanding policy evolution.
 */
export const PolicyRevisionViewer: React.FC<{
    policyId: string;
    currentPolicy: string;
    onSelectRevision: (revision: PolicyRevision) => void;
}> = ({ policyId, currentPolicy, onSelectRevision }) => {
    const { history, historyLoading, historyError, reloadHistory } = usePolicyHistory(policyId);
    const [selectedRevisionId, setSelectedRevisionId] = useState<string | null>(null);
    const [diffView, setDiffView] = useState(false);
    const selectedRevision = history.find(rev => rev.id === selectedRevisionId);

    // Placeholder for actual diffing logic. In a real app, use a diff library.
    const generateDiff = (oldContent: string, newContent: string): string => {
        // This is a simplified mock. A real diff library (e.g., 'diff' package) would be used.
        if (!oldContent || !newContent) return newContent;
        const oldLines = oldContent.split('\n');
        const newLines = newContent.split('\n');
        let diff = '';
        for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
            const oldLine = oldLines[i] || '';
            const newLine = newLines[i] || '';
            if (oldLine === newLine) {
                diff += `  ${oldLine}\n`;
            } else {
                if (oldLine) diff += `<span class="bg-red-200 text-red-800 block">- ${oldLine}</span>\n`;
                if (newLine) diff += `<span class="bg-green-200 text-green-800 block">+ ${newLine}</span>\n`;
            }
        }
        return diff;
    };

    if (historyLoading) return <div className="p-4 text-center"><LoadingSpinner /> Loading history...</div>;
    if (historyError) return <div className="p-4 text-red-500">Error: {historyError}</div>;

    return (
        <div className="p-4 bg-surface-alt rounded-lg shadow-inner mt-4">
            <h3 className="text-lg font-semibold mb-3 text-text-primary">Policy Revision History</h3>
            <button onClick={reloadHistory} className="btn-secondary text-sm mb-3">Refresh History</button>
            {history.length === 0 ? (
                <p className="text-text-secondary">No revisions yet for this policy.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="max-h-60 overflow-y-auto border rounded p-2 bg-background">
                        {history.map(revision => (
                            <div
                                key={revision.id}
                                className={`p-2 border-b last:border-b-0 cursor-pointer hover:bg-surface-hover ${selectedRevisionId === revision.id ? 'bg-primary-light text-text-on-primary' : ''}`}
                                onClick={() => {
                                    setSelectedRevisionId(revision.id);
                                    if (!diffView) {
                                        onSelectRevision(revision);
                                    }
                                }}
                            >
                                <p className="font-medium">Version {revision.version}</p>
                                <p className="text-xs text-text-secondary">Generated by {revision.generatedBy} on {new Date(revision.generatedAt).toLocaleString()}</p>
                                <p className="text-xs text-text-secondary italic line-clamp-1">{revision.descriptionUsed}</p>
                            </div>
                        ))}
                    </div>
                    {selectedRevision && (
                        <div className="flex flex-col border rounded p-2 bg-background">
                            <h4 className="font-semibold mb-2">Selected Revision (v{selectedRevision.version})</h4>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm">View:</span>
                                <button
                                    className={`px-3 py-1 rounded text-xs ${!diffView ? 'bg-primary text-text-on-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                                    onClick={() => { setDiffView(false); onSelectRevision(selectedRevision); }}
                                >
                                    Full
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-xs ${diffView ? 'bg-primary text-text-on-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                                    onClick={() => setDiffView(true)}
                                >
                                    Diff vs. Current
                                </button>
                            </div>
                            <div className="flex-grow overflow-auto text-sm bg-surface-alt p-2 rounded">
                                {diffView ? (
                                    <pre dangerouslySetInnerHTML={{ __html: generateDiff(selectedRevision.policyContent, currentPolicy) }} className="whitespace-pre-wrap text-xs" />
                                ) : (
                                    <MarkdownRenderer content={`\`\`\`json\n${selectedRevision.policyContent}\n\`\`\``} />
                                )}
                            </div>
                            {selectedRevision.feedback && (
                                <div className="mt-2 text-xs bg-surface p-2 rounded">
                                    <p className="font-semibold">User Feedback (v{selectedRevision.version}):</p>
                                    <p>Rating: {selectedRevision.feedback.rating}/5 {selectedRevision.feedback.isHelpful ? '👍' : '👎'}</p>
                                    <p>Comment: {selectedRevision.feedback.comment}</p>
                                    {selectedRevision.feedback.suggestedChanges && <p>Suggested: {selectedRevision.feedback.suggestedChanges}</p>}
                                </div>
                            )}
                            <button className="btn-secondary text-sm mt-3" onClick={() => onSelectRevision(selectedRevision)}>Revert to this version</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * @component PolicyActionButtons
 * Provides actions like copy, deploy, commit, and compliance checks.
 * "Invented" to centralize and manage various post-generation actions for a policy.
 */
export const PolicyActionButtons: React.FC<{
    policy: string;
    platform: CloudPlatform;
    onCopy: () => void;
    addNotification: (message: string, type?: NotificationType) => void;
}> = ({ policy, platform, onCopy, addNotification }) => {
    const [deploying, setDeploying] = useState(false);
    const [committing, setCommitting] = useState(false);
    const [checkingCompliance, setCheckingCompliance] = useState(false);
    const [linting, setLinting] = useState(false);
    const [complianceResults, setComplianceResults] = useState<ComplianceCheckResult[]>([]);
    const [linterReport, setLinterReport] = useState<CodeQualityReport | null>(null);

    const handleDeploy = useCallback(async () => {
        if (!policy) return;
        setDeploying(true);
        addNotification('Deployment initiated...', 'info');
        try {
            const status = await deployPolicyToCloud(policy, platform, 'MyGeneratedRole'); // Target name could be dynamic
            if (status.status === 'success') {
                addNotification(`Policy deployed successfully to ${status.deploymentTarget}!`, 'success');
                logAuditEvent('POLICY_DEPLOYED_SUCCESS', { policyId: status.policyId, target: status.deploymentTarget, cloudUrl: status.cloudUrl });
            } else {
                addNotification(`Deployment failed: ${status.errorMessage}`, 'error');
                logAuditEvent('POLICY_DEPLOYED_FAILURE', { policyId: status.policyId, target: status.deploymentTarget, errorMessage: status.errorMessage });
            }
        } catch (err) {
            addNotification(`Deployment error: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
            logAuditEvent('POLICY_DEPLOYED_ERROR', { errorMessage: err instanceof Error ? err.message : 'Unknown error' });
        } finally {
            setDeploying(false);
        }
    }, [policy, platform, addNotification]);

    const handleCommitToGit = useCallback(async () => {
        if (!policy) return;
        setCommitting(true);
        addNotification('Committing policy to Git...', 'info');
        try {
            const commitUrl = await commitPolicyToGit(`iam/${platform}/policy.json`, policy, `feat: Add new IAM policy for ${platform}`, 'main');
            addNotification(`Policy committed to Git! ${commitUrl}`, 'success');
            logAuditEvent('POLICY_COMMITTED_TO_GIT', { platform, commitUrl });
        } catch (err) {
            addNotification(`Failed to commit to Git: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
            logAuditEvent('POLICY_COMMIT_FAILURE', { platform, errorMessage: err instanceof Error ? err.message : 'Unknown error' });
        } finally {
            setCommitting(false);
        }
    }, [policy, platform, addNotification]);

    const handleRunComplianceChecks = useCallback(async () => {
        if (!policy) return;
        setCheckingCompliance(true);
        setComplianceResults([]);
        addNotification('Running compliance checks...', 'info');
        try {
            const results = await runComplianceChecks(policy, platform, ['hipaa', 'gdpr', 'iso27001', 'least-privilege' as ComplianceStandard, 'security-compliance' as ComplianceStandard]);
            setComplianceResults(results);
            const overallCompliant = results.every(r => r.isCompliant);
            addNotification(`Compliance checks completed: ${overallCompliant ? 'All standards met.' : 'Findings detected.'}`, overallCompliant ? 'success' : 'warning');
            logAuditEvent('POLICY_COMPLIANCE_CHECKED', { platform, results });
        } catch (err) {
            addNotification(`Compliance check error: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
            logAuditEvent('POLICY_COMPLIANCE_ERROR', { platform, errorMessage: err instanceof Error ? err.message : 'Unknown error' });
        } finally {
            setCheckingCompliance(false);
        }
    }, [policy, platform, addNotification]);

    const handleRunLinter = useCallback(async () => {
        if (!policy) return;
        setLinting(true);
        setLinterReport(null);
        addNotification('Running policy linter...', 'info');
        try {
            const report = await runPolicyLinter(policy, platform);
            setLinterReport(report);
            addNotification(`Policy linting completed: ${report.passed ? 'No major issues.' : 'Issues found.'}`, report.passed ? 'success' : 'warning');
            logAuditEvent('POLICY_LINTED', { platform, report });
        } catch (err) {
            addNotification(`Policy linter error: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
            logAuditEvent('POLICY_LINT_ERROR', { platform, errorMessage: err instanceof Error ? err.message : 'Unknown error' });
        } finally {
            setLinting(false);
        }
    }, [policy, platform, addNotification]);

    return (
        <div className="mt-4 p-4 bg-surface-alt rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-3 text-text-primary">Policy Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <button onClick={onCopy} disabled={!policy} className="btn-primary flex items-center justify-center">
                    <span className="material-icons mr-2">content_copy</span> Copy Policy
                </button>
                <button onClick={handleDeploy} disabled={!policy || deploying} className="btn-secondary flex items-center justify-center">
                    {deploying ? <LoadingSpinner size="sm" /> : <span className="material-icons mr-2">cloud_upload</span>} Deploy to Cloud
                </button>
                <button onClick={handleCommitToGit} disabled={!policy || committing} className="btn-secondary flex items-center justify-center">
                    {committing ? <LoadingSpinner size="sm" /> : <span className="material-icons mr-2">code</span>} Commit to Git
                </button>
                <button onClick={handleRunComplianceChecks} disabled={!policy || checkingCompliance} className="btn-secondary flex items-center justify-center">
                    {checkingCompliance ? <LoadingSpinner size="sm" /> : <span className="material-icons mr-2">security</span>} Check Compliance
                </button>
                <button onClick={handleRunLinter} disabled={!policy || linting} className="btn-secondary flex items-center justify-center">
                    {linting ? <LoadingSpinner size="sm" /> : <span className="material-icons mr-2">grading</span>} Run Linter
                </button>
                {/* Additional export buttons for different formats */}
                <button onClick={() => addNotification('Export to Terraform not implemented yet!', 'info')} disabled={!policy} className="btn-secondary flex items-center justify-center">
                    <span className="material-icons mr-2">description</span> Export Terraform
                </button>
                <button onClick={() => addNotification('Export to CloudFormation not implemented yet!', 'info')} disabled={!policy} className="btn-secondary flex items-center justify-center">
                    <span className="material-icons mr-2">description</span> Export CloudFormation
                </button>
            </div>

            {complianceResults.length > 0 && (
                <div className="mt-4 p-3 bg-surface border rounded">
                    <h4 className="font-semibold mb-2">Compliance Report</h4>
                    {complianceResults.map((res, index) => (
                        <div key={index} className={`mb-2 p-2 rounded ${res.isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <p className="font-medium">{res.standard}: {res.isCompliant ? 'Compliant' : 'Non-Compliant'}</p>
                            {res.findings.map((finding, fIdx) => (
                                <p key={fIdx} className="text-sm ml-2">
                                    <span className={`font-semibold ${finding.severity === 'high' ? 'text-red-700' : finding.severity === 'medium' ? 'text-yellow-700' : 'text-gray-700'}`}>
                                        [{finding.severity.toUpperCase()}]
                                    </span> {finding.message} ({finding.ruleId}) - <span className="italic">{finding.remediationSuggestion}</span>
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {linterReport && (
                <div className="mt-4 p-3 bg-surface border rounded">
                    <h4 className="font-semibold mb-2">{linterReport.linterName} Report</h4>
                    {linterReport.passed ? (
                        <p className="text-green-700">All checks passed. No major issues found.</p>
                    ) : (
                        <div>
                            {linterReport.issues.map((issue, index) => (
                                <p key={index} className={`mb-1 text-sm ${issue.severity === 'error' ? 'text-red-700' : issue.severity === 'warning' ? 'text-yellow-700' : 'text-gray-700'}`}>
                                    <span className="font-semibold">[{issue.severity.toUpperCase()}]</span> {issue.message} (Line: {issue.line || 'N/A'}) - Rule: {issue.ruleId || 'N/A'}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * @component PolicyFeedbackForm
 * A form for users to submit feedback on generated policies.
 * "Invented" to enable active learning and continuous improvement of AI models.
 */
export const PolicyFeedbackForm: React.FC<{
    policyId: string;
    revisionId: string;
    onFeedbackSubmitted: () => void;
    addNotification: (message: string, type?: NotificationType) => void;
}> = ({ policyId, revisionId, onFeedbackSubmitted, addNotification }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
    const [suggestedChanges, setSuggestedChanges] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitFeedback = useCallback(async () => {
        setSubmitting(true);
        try {
            const feedback: PolicyFeedback = {
                rating,
                comment,
                isHelpful,
                suggestedChanges,
                submittedAt: new Date().toISOString()
            };
            await submitPolicyFeedback(policyId, revisionId, feedback);
            addNotification('Thank you for your feedback!', 'success');
            logAuditEvent('POLICY_FEEDBACK_SUBMITTED', { policyId, revisionId, feedback });
            onFeedbackSubmitted();
            // Reset form
            setRating(5);
            setComment('');
            setIsHelpful(null);
            setSuggestedChanges('');
        } catch (err) {
            addNotification(`Failed to submit feedback: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
            logAuditEvent('POLICY_FEEDBACK_FAILURE', { policyId, revisionId, errorMessage: err instanceof Error ? err.message : 'Unknown error' });
        } finally {
            setSubmitting(false);
        }
    }, [rating, comment, isHelpful, suggestedChanges, policyId, revisionId, onFeedbackSubmitted, addNotification]);

    return (
        <div className="mt-4 p-4 bg-surface-alt rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-3 text-text-primary">Provide Feedback</h3>
            <div className="mb-3">
                <label className="text-sm font-medium mb-1 block">How accurate was this policy?</label>
                <div className="flex gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`cursor-pointer text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-400'}`} onClick={() => setRating(star)}>
                            ★
                        </span>
                    ))}
                </div>
            </div>
            <div className="mb-3">
                <label className="text-sm font-medium mb-1 block">Was this policy helpful?</label>
                <div className="flex gap-3">
                    <button
                        className={`btn-tertiary px-4 py-2 rounded-md ${isHelpful === true ? 'bg-green-500 text-white' : ''}`}
                        onClick={() => setIsHelpful(true)}
                    >
                        👍 Yes
                    </button>
                    <button
                        className={`btn-tertiary px-4 py-2 rounded-md ${isHelpful === false ? 'bg-red-500 text-white' : ''}`}
                        onClick={() => setIsHelpful(false)}
                    >
                        👎 No
                    </button>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="feedbackComment" className="text-sm font-medium mb-1 block">Comments (optional)</label>
                <textarea
                    id="feedbackComment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 bg-background border rounded text-sm min-h-[60px]"
                    placeholder="e.g., 'The policy correctly granted read access, but missed a specific resource tag requirement.'"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="suggestedChanges" className="text-sm font-medium mb-1 block">Suggested Refinements (natural language)</label>
                <textarea
                    id="suggestedChanges"
                    value={suggestedChanges}
                    onChange={(e) => setSuggestedChanges(e.target.value)}
                    className="w-full p-2 bg-background border rounded text-sm min-h-[60px]"
                    placeholder="e.g., 'Please add permissions for DynamoDB read-only access to table 'my-table-prod' in addition to S3.'"
                />
            </div>
            <button onClick={handleSubmitFeedback} disabled={submitting} className="btn-primary w-full py-2">
                {submitting ? <LoadingSpinner size="sm" /> : 'Submit Feedback'}
            </button>
        </div>
    );
};

// --- Main IamPolicyGenerator Component (Enhanced) ---
/**
 * @component IamPolicyGenerator
 * The core component for generating, refining, validating, and deploying IAM policies.
 * This is the central control panel, integrating all the "invented" features and services.
 * It's designed to be a comprehensive, commercial-grade tool for cloud security professionals.
 */
export const IamPolicyGenerator: React.FC = () => {
    // Core state management for the generator
    const [description, setDescription] = useState('A user role that can read from S3 buckets but not write or delete.');
    const [platform, setPlatform] = useState<CloudPlatform>('aws');
    const [policy, setPolicy] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [availableAiModels, setAvailableAiModels] = useState<AiModel[]>([]);
    const policyIdRef = useRef<string>(`policy-${Date.now()}`); // Unique ID for current policy session
    const currentRevisionIdRef = useRef<string>(`rev-${Date.now()}`); // Unique ID for current revision

    // Advanced AI Settings state
    const [aiSettings, setAiSettings] = useState<AiSettings>({
        model: 'openai-gpt4',
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 500,
        systemMessage: 'You are an expert in cloud IAM policies. Prioritize least privilege and follow best practices. Generate only the JSON/YAML policy.',
        enableFineTuning: false,
        optimizationGoal: 'least-privilege',
    });

    // Custom hook for notifications
    const { notifications, addNotification, dismissNotification, clearAllNotifications } = useNotifications();

    // Debounced description change for potential real-time suggestions (not fully implemented here but enabled by debounce)
    const debouncedSetDescription = useCallback(
        debounce((value: string) => {
            setDescription(value);
            // Here, one could trigger an AI-powered 'policy intent' analysis or suggest templates
            // addNotification(`Description updated: ${value.substring(0, 30)}...`, 'info');
        }, 500),
        []
    );

    // Effect to load available AI models on component mount
    useEffect(() => {
        fetchAvailableAiModels()
            .then(models => setAvailableAiModels(models))
            .catch(err => addNotification(`Failed to load AI models: ${err.message}`, 'error'));
    }, [addNotification]);

    /**
     * @function handleGenerate
     * Orchestrates the policy generation process using the selected AI model and settings.
     * This function is the core intelligence hub, deciding which AI to call,
     * how to format the prompt, and handling streaming responses.
     */
    const handleGenerate = useCallback(async () => {
        if (!description.trim()) {
            setError('Please provide a description.');
            addNotification('Policy description cannot be empty.', 'warning');
            return;
        }

        setIsLoading(true);
        setError('');
        setPolicy(''); // Clear previous policy
        currentRevisionIdRef.current = `rev-${Date.now()}`; // Generate a new revision ID for this attempt

        // Log the generation attempt for auditing purposes
        logAuditEvent('POLICY_GENERATION_INITIATED', {
            policyId: policyIdRef.current,
            description,
            platform,
            aiSettings
        });
        addNotification(`Generating ${platform.toUpperCase()} policy using ${aiSettings.model}...`, 'info');

        try {
            // Here, we can conditionally call different AI services based on aiSettings.model
            // For now, we'll route through generateIamPolicyStream as a unified interface.
            // In a real scenario, generateIamPolicyStream would abstract calls to Gemini, ChatGPT, etc.
            const stream = generateIamPolicyStream(
                description,
                platform,
                aiSettings.model, // Pass selected AI model
                aiSettings.temperature,
                aiSettings.topP,
                aiSettings.maxTokens,
                aiSettings.systemMessage,
                aiSettings.optimizationGoal
            );
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setPolicy(fullResponse);
            }
            logAuditEvent('POLICY_GENERATION_SUCCESS', {
                policyId: policyIdRef.current,
                revisionId: currentRevisionIdRef.current,
                generatedPolicy: fullResponse.substring(0, 500) + '...' // Log truncated policy
            });
            addNotification('Policy generated successfully!', 'success');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during policy generation.';
            setError(errorMessage);
            addNotification(`Policy generation failed: ${errorMessage}`, 'error');
            logAuditEvent('POLICY_GENERATION_FAILURE', {
                policyId: policyIdRef.current,
                errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    }, [description, platform, aiSettings, addNotification]);

    /**
     * @function handleSelectTemplate
     * Applies a selected policy template's description.
     * @param {PolicyTemplate} template - The selected template.
     */
    const handleSelectTemplate = useCallback((template: PolicyTemplate) => {
        setDescription(template.defaultDescription);
        setPlatform(template.platform);
        addNotification(`Applied template: ${template.name}`, 'info');
        logAuditEvent('TEMPLATE_APPLIED', { templateId: template.id, templateName: template.name });
    }, [addNotification]);

    /**
     * @function handleCopyPolicy
     * Copies the generated policy to the clipboard.
     * "Invented" for user convenience.
     */
    const handleCopyPolicy = useCallback(async () => {
        if (policy) {
            const success = await copyToClipboard(policy);
            if (success) {
                addNotification('Policy copied to clipboard!', 'success');
                logAuditEvent('POLICY_COPIED', { policyId: policyIdRef.current });
            } else {
                addNotification('Failed to copy policy to clipboard.', 'error');
            }
        }
    }, [policy, addNotification]);

    /**
     * @function handleRevertToRevision
     * Reverts the displayed policy to a selected historical revision.
     * @param {PolicyRevision} revision - The revision to revert to.
     */
    const handleRevertToRevision = useCallback((revision: PolicyRevision) => {
        setPolicy(revision.policyContent);
        setDescription(revision.descriptionUsed); // Update description to match for context
        setPlatform(revision.aiSettingsUsed.platform || platform); // If platform was part of revision, update it
        setAiSettings(revision.aiSettingsUsed); // Apply AI settings from that revision
        addNotification(`Reverted to version ${revision.version} (generated by ${revision.generatedBy})`, 'info');
        logAuditEvent('POLICY_REVERTED', { policyId: policyIdRef.current, targetRevisionId: revision.id, targetVersion: revision.version });
    }, [platform, addNotification]);

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary bg-background">
            <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold flex items-center">
                    <ShieldCheckIcon />
                    <span className="ml-3">IAM Policy Generator <span className="text-sm font-normal text-text-secondary">(v2.1.0 - Enterprise Edition)</span></span>
                </h1>
                <p className="text-text-secondary mt-1 sm:mt-0 sm:text-right">Generate, validate, and manage multi-cloud IAM policies with AI assistance.</p>
            </header>

            <div className="flex-grow grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0">
                {/* Input and Configuration Panel */}
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Cloud Platform Selector */}
                    <div>
                        <label htmlFor="platform" className="text-sm font-medium mb-2 block">Cloud Platform</label>
                        <div className="flex gap-2 p-1 bg-surface rounded-lg border">
                            {(['aws', 'gcp', 'azure', 'kubernetes', 'custom'] as CloudPlatform[]).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPlatform(p)}
                                    className={`flex-1 py-2 rounded-md text-sm transition-all duration-200 ${platform === p ? 'bg-primary text-text-on-primary shadow-md' : 'hover:bg-surface-hover text-text-secondary'}`}
                                >
                                    {p.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Policy Description Input */}
                    <div className="flex flex-col flex-1 min-h-0">
                        <label htmlFor="description" className="text-sm font-medium mb-2">Describe the desired permissions (Natural Language)</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={e => {
                                setDescription(e.target.value); // Immediate update for UI
                                debouncedSetDescription(e.target.value); // Debounced for potential heavy-lifting
                            }}
                            className="flex-grow p-2 bg-surface border rounded text-sm resize-y min-h-[120px]"
                            placeholder="e.g., 'An administrator role for S3 and EC2, limited to the 'us-east-1' region and resources tagged with 'environment:production'."
                        />
                    </div>

                    {/* AI Settings Panel */}
                    <AiSettingsPanel
                        aiSettings={aiSettings}
                        onSettingsChange={setAiSettings}
                        availableModels={availableAiModels}
                    />

                    {/* Policy Template Browser */}
                    <PolicyTemplateBrowser
                        platform={platform}
                        onTemplateSelect={handleSelectTemplate}
                    />

                    {/* Generate Button */}
                    <button onClick={handleGenerate} disabled={isLoading} className="btn-primary w-full py-3 mt-2 flex items-center justify-center">
                        {isLoading ? <LoadingSpinner size="sm" /> : <ShieldCheckIcon className="w-5 h-5 mr-2" />} Generate Policy
                    </button>
                </div>

                {/* Output and Action Panel */}
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Generated Policy Display */}
                    <div className="flex flex-col flex-1 min-h-0">
                        <label className="text-sm font-medium mb-2">Generated Policy (JSON / YAML)</label>
                        <div className="flex-grow p-1 bg-background border rounded overflow-auto min-h-[200px] relative">
                            {isLoading && !policy && (
                                <div className="absolute inset-0 flex justify-center items-center bg-background/70 z-10">
                                    <LoadingSpinner />
                                </div>
                            )}
                            {error && <p className="text-red-500 p-4">{error}</p>}
                            {policy ? (
                                <MarkdownRenderer content={`\`\`\`json\n${policy}\n\`\`\``} />
                            ) : !isLoading && !error && (
                                <p className="text-text-secondary p-4 text-center">Your generated policy will appear here.</p>
                            )}
                        </div>
                    </div>

                    {/* Policy Action Buttons */}
                    <PolicyActionButtons
                        policy={policy}
                        platform={platform}
                        onCopy={handleCopyPolicy}
                        addNotification={addNotification}
                    />

                    {/* Policy Revision History Viewer */}
                    <PolicyRevisionViewer
                        policyId={policyIdRef.current} // Use the session policy ID
                        currentPolicy={policy}
                        onSelectRevision={handleRevertToRevision}
                    />

                    {/* Policy Feedback Form */}
                    {policy && (
                        <PolicyFeedbackForm
                            policyId={policyIdRef.current}
                            revisionId={currentRevisionIdRef.current}
                            onFeedbackSubmitted={() => addNotification('Feedback submitted!', 'success')}
                            addNotification={addNotification}
                        />
                    )}
                </div>
            </div>

            {/* Global Notification Container */}
            <NotificationContainer notifications={notifications} onDismiss={dismissNotification} />
        </div>
    );
};

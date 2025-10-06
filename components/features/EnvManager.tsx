// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// Story of EnvManager 3000:
//
// In the year 2024, amidst the ever-growing complexity of microservices, serverless functions, and multi-cloud deployments,
// a critical bottleneck emerged for developers and DevOps engineers: environment variable management.
// Traditional `.env` files, while simple, lacked the sophistication required for enterprise-grade applications.
// Security vulnerabilities, configuration drift, manual errors, and the sheer overhead of managing hundreds of variables
// across dozens of environments became a constant source of friction.
//
// Enter "Project Chimera," an ambitious initiative spearheaded by James Burvel O'Callaghan III, President of Citibank Demo Business Inc.
// His vision was to create a "Universal Environment Orchestration Platform" – a single pane of glass for all configuration needs.
// This vision manifested as the "EnvManager 3000".
//
// The core team, led by Dr. Evelyn Reed (Chief Architect) and Dr. Kenji Tanaka (Lead AI/ML Engineer), embarked on an
// intense development cycle. Their goal: integrate the latest advancements in AI, cloud-native principles,
// robust security paradigms, and seamless developer experience into a single, cohesive system.
//
// EnvManager 3000 was designed from the ground up to be:
// 1.  **Intelligent:** Leveraging AI (Gemini, ChatGPT) for auto-documentation, security analysis, and predictive suggestions.
// 2.  **Secure:** Implementing multi-layered encryption, access control, and integration with leading secret managers (HashiCorp Vault, AWS Secrets Manager).
// 3.  **Resilient:** Featuring version control, audit trails, disaster recovery, and multi-cloud synchronization.
// 4.  **Collaborative:** Enabling real-time teamwork, approval workflows, and granular permissions.
// 5.  **Extensible:** With a plugin-based architecture for integrating with CI/CD pipelines, monitoring tools, and custom services.
// 6.  **Scalable:** Capable of handling millions of variables across thousands of projects and environments without performance degradation.
//
// This file, `EnvManager.tsx`, represents the pinnacle of the client-side interface for this ambitious platform.
// It's not just an `.env` file editor; it's a window into a universe of intelligent, secure, and collaborative
// environment variable orchestration. It showcases the initial foundational components, ready to integrate with
// an ecosystem of microservices including:
// -   `EnvProcessorService`: For variable parsing, validation, and transformation.
// -   `EnvSecurityService`: For encryption, decryption, and vulnerability scanning.
// -   `EnvAIService`: For Gemini/ChatGPT interactions, suggestions, and insights.
// -   `EnvSyncService`: For cloud provider integrations (AWS, Azure, GCP Secret Managers, ConfigMaps).
// -   `EnvAuditService`: For logging all changes and access attempts.
// -   `EnvProfileManagerService`: For managing different environment profiles (dev, stage, prod).
// -   `EnvVersionControlService`: For managing historical versions and rollbacks.
// -   `EnvNotificationService`: For integrating with Slack, Teams, email for alerts.
// -   And hundreds more, each contributing to the holistic "Universal Environment Orchestration Platform".
//
// This is the beginning of a new era for configuration management. Welcome to EnvManager 3000.

import React, { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext } from 'react';
import { downloadEnvFile } from '../../services/fileUtils.ts';
import { DocumentTextIcon, PlusIcon, TrashIcon, ArrowDownTrayIcon, KeyIcon, LockClosedIcon, LockOpenIcon, Cog6ToothIcon, ClockIcon, MagnifyingGlassIcon, CloudArrowUpIcon, CloudArrowDownIcon, CodeBracketIcon, ServerStackIcon, TagIcon, ExclamationTriangleIcon, LightBulbIcon, SparklesIcon, ShareIcon, EyeIcon, EyeSlashIcon, ArrowsRightLeftIcon } from '../icons.tsx';

// --- Core Data Structures (Invented for EnvManager 3000) ---

/**
 * @interface EnvVariableMetadata
 * @description Stores additional context and control parameters for an environment variable.
 *              Invented by Dr. Evelyn Reed during Project Chimera's initial design phase.
 */
export interface EnvVariableMetadata {
    type: 'string' | 'number' | 'boolean' | 'json' | 'array' | 'secret';
    description: string;
    tags: string[];
    sensitivity: 'low' | 'medium' | 'high' | 'critical';
    source: 'manual' | 'ai-generated' | 'imported' | 'system' | 'dynamic';
    lastModifiedBy: string;
    lastModifiedAt: string; // ISO 8601 string
    createdAt: string; // ISO 8601 string
    version: number;
    profileIds: string[]; // Which profiles this variable belongs to
    projectId: string; // Which project this variable belongs to
    encrypted: boolean;
    encryptionAlgorithm?: string; // e.g., 'AES256', 'RSA'
    validationRules: string[]; // e.g., 'required', 'url', 'email', 'min:5', 'max:255'
    isDynamic: boolean; // Can this variable's value change at runtime?
    dynamicSource?: 'API' | 'SystemEnv' | 'Vault'; // Where to fetch dynamic value from
    expirationDate?: string; // ISO 8601 string for time-based secrets
    status: 'active' | 'deprecated' | 'archived';
}

/**
 * @interface EnvVar
 * @description Represents a single environment variable with its core value and rich metadata.
 *              This expanded structure was a cornerstone of EnvManager 3000's "Data-Rich Configuration" principle.
 */
export interface EnvVar {
    id: string; // Using string for UUIDs for better distributed system compatibility
    key: string;
    value: string;
    metadata: EnvVariableMetadata;
    // History is stored externally for performance, but a quick ref to the latest change can be here
    latestHistoryEntryId?: string;
}

/**
 * @interface EnvProfile
 * @description Defines a specific environment configuration (e.g., 'development', 'staging', 'production').
 *              A key concept for multi-environment deployment, enabling "One Configuration, Many Deployments".
 */
export interface EnvProfile {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    isProtected: boolean; // Requires approval for changes, typically for production profiles
    createdBy: string;
    createdAt: string;
    lastUpdatedBy: string;
    lastUpdatedAt: string;
    associatedProjectIds: string[];
    syncTargets: EnvSyncTarget[]; // e.g., AWS Secrets Manager, Kubernetes ConfigMap
}

/**
 * @interface EnvProject
 * @description Represents a logical grouping of environment variables and profiles for a specific application or service.
 *              Introduced by Dr. Evelyn Reed to provide hierarchical organization.
 */
export interface EnvProject {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    createdAt: string;
    lastUpdatedAt: string;
    defaultProfileId: string;
    collaboratorIds: string[]; // Users who can access this project
    auditLogRetentionDays: number;
    securityPolicyId?: string; // Reference to a global security policy
}

/**
 * @interface EnvSyncTarget
 * @description Specifies an external service to synchronize environment variables with.
 *              A core feature of EnvManager 3000's "Cloud-Agnostic Synchronization" module.
 */
export interface EnvSyncTarget {
    id: string;
    name: string;
    type: 'AWS_SECRETS_MANAGER' | 'AZURE_KEY_VAULT' | 'GCP_SECRET_MANAGER' | 'KUBERNETES_CONFIGMAP' | 'VERCEL_ENV' | 'NETLIFY_ENV' | 'HASHICORP_VAULT' | 'CUSTOM_API' | 'GITHUB_ACTIONS_SECRETS' | 'GITLAB_CI_VARS' | 'JIRA_INTEGRATION_FIELD';
    configuration: Record<string, any>; // e.g., region, secretId, namespace, clusterName, repo, key_prefix
    lastSyncAt?: string;
    syncStatus: 'idle' | 'syncing' | 'succeeded' | 'failed' | 'pending_approval';
    syncFrequency: 'manual' | 'hourly' | 'daily' | 'on_change';
}

/**
 * @interface EnvAuditLogEntry
 * @description Records every significant action performed within EnvManager 3000 for compliance and traceability.
 *              Essential for "Compliance-as-Code" and forensic analysis.
 */
export interface EnvAuditLogEntry {
    id: string;
    timestamp: string;
    userId: string;
    action: 'CREATE_VAR' | 'UPDATE_VAR' | 'DELETE_VAR' | 'ENCRYPT_VAR' | 'DECRYPT_VAR' | 'SYNC_PROFILE' | 'IMPORT' | 'EXPORT' | 'PROFILE_CHANGE' | 'PROJECT_CHANGE' | 'ACCESS_DENIED' | 'AI_GENERATED' | 'SECURITY_SCAN' | 'ROLLBACK_VAR';
    targetId: string; // EnvVar.id, EnvProfile.id, EnvProject.id
    targetType: 'EnvVar' | 'EnvProfile' | 'EnvProject' | 'System';
    details: Record<string, any>; // OldValue, NewValue, SyncTarget, etc.
    ipAddress: string; // For security auditing
    userAgent: string; // For security auditing
}

/**
 * @interface EnvVersionHistoryEntry
 * @description Captures the state of an EnvVar at a specific point in time, enabling rollbacks.
 *              Part of EnvManager 3000's "Immutable Configuration Snapshots" design principle.
 */
export interface EnvVersionHistoryEntry {
    id: string;
    envVarId: string;
    version: number;
    key: string;
    value: string;
    metadataSnapshot: EnvVariableMetadata;
    modifiedBy: string;
    modifiedAt: string;
    reason: string; // "Manual edit", "AI suggestion", "Imported", "Rollback"
}

// --- Simulated External Services (Up to 1000 integrations conceived) ---
// These are placeholders for actual API calls to backend microservices of EnvManager 3000
// or directly to external cloud providers and AI models.

/**
 * @class EnvProcessorService
 * @description Simulates the backend service for processing environment variables.
 *              Responsible for validation, type conversions, and complex transformations.
 *              Developed by the 'EnvCore' team.
 */
export class EnvProcessorService {
    // Feature 1: Comprehensive variable validation
    static async validateEnvVar(envVar: EnvVar): Promise<{ isValid: boolean, errors: string[] }> {
        console.log(`[EnvProcessorService] Validating variable: ${envVar.key}`);
        const errors: string[] = [];
        if (!envVar.key || envVar.key.trim() === '') errors.push('Key cannot be empty.');
        // Feature 2: Strict key naming convention (uppercase, alphanumeric, underscores)
        if (!/^[A-Z_][A-Z0-9_]*$/.test(envVar.key)) errors.push('Key must be uppercase alphanumeric with underscores, starting with a letter or underscore.');

        envVar.metadata.validationRules.forEach(rule => {
            if (rule === 'required' && envVar.value.trim() === '') errors.push(`Value for '${envVar.key}' is required.`);
            if (rule === 'url' && envVar.value.trim() !== '' && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(envVar.value)) errors.push(`Value for '${envVar.key}' must be a valid URL.`);
            if (rule === 'email' && envVar.value.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(envVar.value)) errors.push(`Value for '${envVar.key}' must be a valid email address.`);
            if (rule.startsWith('min:') && envVar.value.length < parseInt(rule.split(':')[1])) errors.push(`Value for '${envVar.key}' must be at least ${rule.split(':')[1]} characters.`);
            if (rule.startsWith('max:') && envVar.value.length > parseInt(rule.split(':')[1])) errors.push(`Value for '${envVar.key}' must be at most ${rule.split(':')[1]} characters.`);
            if (rule === 'json' && envVar.value.trim() !== '') {
                try { JSON.parse(envVar.value); } catch { errors.push(`Value for '${envVar.key}' must be valid JSON.`); }
            }
            // ... dozens more validation rules can be added here, e.g., regex patterns, numeric ranges
        });

        // Feature 3: Cross-validation with AI-driven anomaly detection (simulated)
        if (envVar.metadata.type === 'secret' && envVar.value.length > 0 && !envVar.metadata.encrypted) {
            const aiScanResult = await EnvAIService.analyzeSecurityRisk(envVar.key, envVar.value);
            if (aiScanResult.riskLevel === 'high') {
                errors.push(`AI Security Warning: Value for '${envVar.key}' appears to be sensitive and unencrypted. Consider encryption. (${aiScanResult.reason})`);
            }
        }
        // Feature 4: Expiration date warning
        if (envVar.metadata.expirationDate && new Date(envVar.metadata.expirationDate) < new Date()) {
            errors.push(`Variable '${envVar.key}' has expired. Please update or renew.`);
        }

        return { isValid: errors.length === 0, errors };
    }

    // Feature 5: Value type transformation
    static async transformValue(envVar: EnvVar, targetType: EnvVariableMetadata['type']): Promise<string> {
        console.log(`[EnvProcessorService] Transforming value for ${envVar.key} to ${targetType}`);
        switch (targetType) {
            case 'number': return String(parseFloat(envVar.value) || 0);
            case 'boolean': return String(envVar.value.toLowerCase() === 'true');
            case 'json':
                try { JSON.parse(envVar.value); return envVar.value; }
                catch { return JSON.stringify({ error: 'Invalid JSON', original: envVar.value }); }
            case 'array':
                try {
                    const parsed = JSON.parse(envVar.value);
                    if (Array.isArray(parsed)) return env.value;
                    return JSON.stringify([envVar.value]);
                } catch {
                    return JSON.stringify(envVar.value.split(',').map(s => s.trim()));
                }
            default: return envVar.value;
        }
    }

    // Feature 6: Secret redaction for logging/display
    static redactSecret(value: string, displayLength: number = 4): string {
        if (!value) return '';
        if (value.length <= displayLength * 2) return '*'.repeat(value.length);
        return value.substring(0, displayLength) + '...PROTECTED_SECRET...' + value.substring(value.length - displayLength);
    }

    // Feature 7: AI-powered suggestion for dynamic variable sources (mocked)
    static async suggestDynamicSource(key: string): Promise<EnvVariableMetadata['dynamicSource'] | undefined> {
        if (key.includes('VAULT')) return 'Vault';
        if (key.includes('SYSTEM') || key.includes('OS')) return 'SystemEnv';
        if (key.includes('EXTERNAL_API')) return 'API';
        return undefined;
    }
}

/**
 * @class EnvSecurityService
 * @description Manages encryption, decryption, access control, and vulnerability scanning.
 *              The guardian of sensitive configurations within EnvManager 3000, built by the 'CipherGuard' team.
 */
export class EnvSecurityService {
    private static ENCRYPTION_KEY_SOURCE = 'EnvManager3000_MasterKey_Vault_Ref'; // Invented master key reference
    private static mockEncryptedValues: Record<string, string> = {}; // In-memory mock for demonstration

    // Feature 8: Client-side encryption of variable values (AES256 standard)
    static async encrypt(plainText: string, varId: string, algorithm: string = 'AES256'): Promise<string> {
        console.log(`[EnvSecurityService] Encrypting variable ${varId} with ${algorithm}...`);
        // In a real scenario, this would involve a robust cryptographic library and a secure key management system.
        // For demonstration, we'll use a simple base64 encoding combined with a hash to simulate encryption.
        const encodedData = btoa(plainText);
        const salt = btoa(Math.random().toString()); // Simulate unique salt
        const encryptedValue = `EM3K_ENC::${algorithm}::${salt}::${encodedData}::${Date.now()}`;
        this.mockEncryptedValues[varId] = encryptedValue; // Store mock encrypted value
        await EnvAuditService.log({
            id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: 'current_user',
            action: 'ENCRYPT_VAR', targetId: varId, targetType: 'EnvVar', details: { algorithm }
        });
        return encryptedValue;
    }

    // Feature 9: Client-side decryption of variable values
    static async decrypt(encryptedText: string, varId: string): Promise<string> {
        console.log(`[EnvSecurityService] Decrypting variable ${varId}...`);
        if (!encryptedText.startsWith('EM3K_ENC::')) {
            // Already decrypted or not encrypted by this system
            return encryptedText;
        }
        // In a real scenario, this would involve decrypting with the appropriate key.
        // For demonstration, we'll reverse the mock encryption.
        const parts = encryptedText.split('::');
        if (parts.length === 5 && parts[0] === 'EM3K_ENC') {
            const decoded = atob(parts[3]);
            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: 'current_user',
                action: 'DECRYPT_VAR', targetId: varId, targetType: 'EnvVar', details: {}
            });
            return decoded; // Return the mock plain text
        }
        return `DECRYPTION_FAILED::${encryptedText}`;
    }

    // Feature 10: Role-Based Access Control (RBAC) check (simulated)
    static async checkPermissions(userId: string, action: string, resourceId: string, resourceType: 'EnvVar' | 'EnvProfile' | 'EnvProject'): Promise<boolean> {
        console.log(`[EnvSecurityService] Checking permissions for user ${userId} to ${action} on ${resourceType}:${resourceId}`);
        // This would interact with an Identity and Access Management (IAM) service.
        // For demo, assume 'admin_user_id' has full control.
        const isAdmin = userId === 'admin_user_id';
        if (!isAdmin && ['DELETE_VAR', 'DECRYPT_VAR', 'SYNC_PROFILE', 'ROLLBACK_VAR', 'UPDATE_PROFILE', 'DELETE_PROFILE'].includes(action)) return false;
        if (!isAdmin && resourceType === 'EnvProfile' && _mockProfiles.find(p => p.id === resourceId)?.isProtected && ['UPDATE_VAR', 'ENCRYPT_VAR', 'DECRYPT_VAR'].includes(action)) return false;
        return true;
    }

    // Feature 11: Automated vulnerability scanning for credentials exposure (AI-enhanced)
    static async scanForVulnerabilities(envVars: EnvVar[]): Promise<string[]> {
        console.log('[EnvSecurityService] Initiating vulnerability scan...');
        const potentialIssues: string[] = [];
        for (const v of envVars) {
            if (v.metadata.type === 'secret' && !v.metadata.encrypted) {
                potentialIssues.push(`Unencrypted secret detected: ${v.key}. Value: ${EnvProcessorService.redactSecret(v.value)}`);
            }
            if (v.metadata.type !== 'secret' && (v.key.includes('PASSWORD') || v.key.includes('SECRET') || v.key.includes('TOKEN') || v.key.includes('KEY'))) {
                potentialIssues.push(`Warning: Variable '${v.key}' is named like a secret but not marked as 'secret' type. Consider changing type or encrypting.`);
            }
            if (v.metadata.status === 'deprecated' && v.metadata.profileIds.includes('prod-001')) {
                potentialIssues.push(`Deprecated variable '${v.key}' is still present in Production profile. Consider removal.`);
            }
            const aiAnalysis = await EnvAIService.analyzeSecurityRisk(v.key, v.value); // AI integration
            if (aiAnalysis.riskLevel === 'high' || aiAnalysis.riskLevel === 'medium') {
                potentialIssues.push(`AI identified potential sensitive data in ${v.key} with ${aiAnalysis.riskLevel} risk: ${aiAnalysis.reason}`);
            }
            // Feature 12: Pattern matching for common leakages (e.g., AWS keys, private keys, connection strings)
            if (v.value.match(/AKIA[0-9A-Z]{16}/) || v.value.match(/-----BEGIN (RSA|OPENSSH) PRIVATE KEY-----/i) || v.value.match(/mongodb:\/\/.+@.+:\d+\/.+/)) {
                potentialIssues.push(`Hardcoded sensitive pattern found in ${v.key}. Value: ${EnvProcessorService.redactSecret(v.value)}`);
            }
            // Feature 13: Time-based secret rotation reminder
            if (v.metadata.expirationDate && new Date(v.metadata.expirationDate).getTime() < Date.now() + (7 * 24 * 60 * 60 * 1000) && new Date(v.metadata.expirationDate) > new Date()) { // Expires in next 7 days
                potentialIssues.push(`Warning: Secret '${v.key}' is due to expire on ${new Date(v.metadata.expirationDate).toLocaleDateString()}. Plan for rotation.`);
            }
        }
        return potentialIssues;
    }

    // Feature 14: Multi-Factor Authentication (MFA) enforcement for critical actions
    static async enforceMFA(userId: string, action: string): Promise<boolean> {
        if (['DELETE_VAR', 'DECRYPT_VAR', 'SYNC_PROFILE', 'ROLLBACK_VAR', 'UPDATE_PROFILE', 'DELETE_PROFILE'].includes(action)) {
            console.warn(`[EnvSecurityService] MFA enforcement for user ${userId} for action: ${action}`);
            // In a real system, this would trigger an MFA flow (TOTP, FIDO, etc.)
            // For now, simulate success.
            return new Promise(resolve => setTimeout(() => resolve(true), 500)); // Simulate async MFA check
        }
        return true;
    }

    // Feature 15: Approval workflows for protected resources (simulated)
    static async requestApproval(userId: string, action: string, resourceId: string, reason: string): Promise<boolean> {
        console.log(`[EnvSecurityService] User ${userId} requested approval for ${action} on ${resourceId}. Reason: ${reason}`);
        // In a real system, this would trigger an approval process (e.g., Jira ticket, Slack notification).
        // For demo, auto-approve for admin, require manual confirmation for others.
        if (userId === 'admin_user_id') return true;
        // Simulate a delay for human approval
        return new Promise(resolve => setTimeout(() => {
            const approved = confirm(`[Mock Approval System] Approval requested for ${action} by ${userId}. Approve?`);
            resolve(approved);
        }, 1500));
    }
}

/**
 * @class EnvAIService
 * @description Integrates with Gemini and ChatGPT for intelligent assistance.
 *              A flagship innovation of EnvManager 3000, developed by Dr. Kenji Tanaka's 'CognitiveConfig' division.
 */
export class EnvAIService {
    private static GEMINI_API_ENDPOINT = 'https://api.gemini.ai/v1/config-assistant'; // Invented API endpoint
    private static CHATGPT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'; // Placeholder for OpenAI

    // Feature 16: Gemini-powered variable description generation
    static async generateDescription(key: string, value: string): Promise<string> {
        console.log(`[EnvAIService] Requesting Gemini to generate description for ${key}...`);
        // Simulating API call to Gemini
        return new Promise(resolve => setTimeout(() => {
            const prompt = `Given the environment variable key "${key}" and a sample value "${value}", generate a concise technical description.`;
            // Mocking different responses
            if (key.includes('API_KEY')) resolve('API key for authenticating with an external service. Highly sensitive and should be kept secret.');
            if (key.includes('DATABASE_URL')) resolve('Connection string for the primary database. Includes host, port, user, and password. Essential for database connectivity.');
            if (key.includes('FEATURE_TOGGLE')) resolve('Boolean flag to enable or disable a specific application feature during runtime.');
            if (key.includes('PORT')) resolve('Network port on which the application server listens for incoming connections.');
            resolve(`Automatically generated description by Gemini: Configures the ${key.toLowerCase().replace(/_/g, ' ')} setting, impacting core application behavior.`);
        }, 800));
    }

    // Feature 17: ChatGPT-powered value suggestion based on context
    static async suggestValue(key: string, context: string, profileName: string): Promise<string> {
        console.log(`[EnvAIService] Requesting ChatGPT to suggest value for ${key} in ${profileName} profile...`);
        // Simulating API call to ChatGPT
        return new Promise(resolve => setTimeout(() => {
            const prompt = `Suggest a suitable value for an environment variable with key "${key}" given the context "${context}" and current profile "${profileName}". Be concise and technical.`;
            if (key.includes('PORT')) resolve('8080');
            if (key.includes('DEBUG')) resolve(profileName === 'development' ? 'true' : 'false');
            if (key.includes('CACHE_TTL')) resolve('3600');
            if (key.includes('NODE_ENV')) resolve(profileName.toLowerCase().includes('prod') ? 'production' : 'development');
            resolve('Suggested by ChatGPT: default_value_here');
        }, 1200));
    }

    // Feature 18: AI-powered security risk analysis for variable values (Gemini-based)
    static async analyzeSecurityRisk(key: string, value: string): Promise<{ riskLevel: 'low' | 'medium' | 'high', reason: string }> {
        console.log(`[EnvAIService] Performing AI security risk analysis for ${key}...`);
        return new Promise(resolve => setTimeout(() => {
            const lowerCaseKey = key.toLowerCase();
            const lowerCaseValue = value.toLowerCase();

            if (lowerCaseKey.includes('password') || lowerCaseKey.includes('secret') || lowerCaseKey.includes('private_key') || lowerCaseKey.includes('token')) {
                if (value.length < 16) {
                    return resolve({ riskLevel: 'medium', reason: 'Value appears to be a short or weak secret.' });
                }
                if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,}$/)) {
                     // Check for common strong password patterns
                     return resolve({ riskLevel: 'medium', reason: 'Value appears to be a weak secret lacking complexity.' });
                }
                if (lowerCaseValue.includes(lowerCaseKey.split('_').join(''))) {
                    return resolve({ riskLevel: 'medium', reason: 'Value contains parts of the key, making it guessable.' });
                }
                if (value.length > 5 && value.startsWith('AKIA')) { // Example AWS key pattern
                    return resolve({ riskLevel: 'high', reason: 'Value looks like an unencrypted AWS Access Key ID.' });
                }
                return resolve({ riskLevel: 'low', reason: 'Value appears to be a strong secret based on complexity checks.' });
            }
            if (value.includes('http://') && !value.includes('localhost') && !value.match(/\b(127\.\d{1,3}\.\d{1,3}\.\d{1,3}|localhost)\b/)) {
                return resolve({ riskLevel: 'medium', reason: 'Non-HTTPS URL detected for an external service. Potential insecure connection.' });
            }
            if (value.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{2,5}/) && !lowerCaseKey.includes('host')) {
                return resolve({ riskLevel: 'low', reason: 'Raw IP:Port found in value. Not inherently risky, but consider FQDN for clarity.' });
            }
            resolve({ riskLevel: 'low', reason: 'No significant security risks identified by AI.' });
        }, 900));
    }

    // Feature 19: AI-driven auto-categorization and tagging
    static async autoCategorize(key: string, value: string): Promise<{ tags: string[], description: string }> {
        console.log(`[EnvAIService] Requesting AI to auto-categorize ${key}...`);
        return new Promise(resolve => setTimeout(() => {
            const tags: string[] = [];
            let description = '';
            if (key.includes('API_KEY') || key.includes('SECRET') || key.includes('TOKEN')) { tags.push('security', 'authentication'); description = 'Sensitive API credential for external service access.'; }
            else if (key.includes('URL') || key.includes('HOST') || key.includes('ENDPOINT')) { tags.push('network', 'endpoint'); description = 'Network endpoint configuration for service communication.'; }
            else if (key.includes('DB') || key.includes('DATABASE')) { tags.push('database', 'persistence'); description = 'Database connection details, typically including host, port, credentials.'; }
            else if (key.includes('FEATURE') || key.includes('TOGGLE')) { tags.push('feature-flag', 'configuration'); description = 'Application feature toggle to control functionality rollout.'; }
            else if (key.includes('PORT') || key.includes('LISTEN')) { tags.push('network'); description = 'Port number for network services.'; }
            else if (key.includes('STORAGE') || key.includes('BUCKET')) { tags.push('storage', 'cloud'); description = 'Cloud storage configuration, e.g., S3 bucket name.'; }
            else if (key.includes('QUEUE') || key.includes('MESSAGE_BROKER')) { tags.push('messaging', 'async'); description = 'Message queue connection settings.'; }
            else { tags.push('general'); description = 'General application setting, often related to core logic.'; }
            resolve({ tags: Array.from(new Set(tags)), description }); // Ensure unique tags
        }, 700));
    }

    // Feature 20: AI-powered compliance suggestions (e.g., GDPR, PCI-DSS implications)
    static async suggestComplianceMeasures(envVar: EnvVar): Promise<string[]> {
        console.log(`[EnvAIService] Suggesting compliance measures for ${envVar.key}...`);
        return new Promise(resolve => setTimeout(() => {
            const suggestions: string[] = [];
            if (envVar.metadata.type === 'secret' && !envVar.metadata.encrypted) {
                suggestions.push('PCI-DSS Requirement 3.4: Encrypt sensitive data at rest. Encrypt this secret immediately.');
                suggestions.push('ISO 27001 Annex A.12.3.1: Information backup. Ensure encrypted backups are in place.');
            }
            if (envVar.key.includes('USER_DATA') || envVar.key.includes('PII') || envVar.key.includes('CUSTOMER_INFO')) {
                suggestions.push('GDPR Article 5: Principle of data minimisation. Ensure only necessary PII is stored and processed.');
                suggestions.push('GDPR Article 32: Security of processing. Implement robust access controls and encryption.');
                suggestions.push('HIPAA Security Rule: If handling protected health information, ensure strict access, audit, and integrity controls.');
            }
            if (envVar.metadata.expirationDate && new Date(envVar.metadata.expirationDate) < new Date()) {
                suggestions.push('ISO 27001 Annex A.9.2.3: Password management. Review and update expired credentials immediately.');
            }
            if (envVar.metadata.type === 'url' && envVar.value.startsWith('http://') && !envVar.value.includes('localhost')) {
                suggestions.push('OWASP Top 10 (A05:2021) Security Misconfiguration: Use HTTPS for all external API endpoints to prevent data interception.');
            }
            return resolve(suggestions.length ? suggestions : ['No specific compliance suggestions identified by AI at this time for this variable.']);
        }, 1100));
    }
}

/**
 * @class EnvSyncService
 * @description Handles synchronization with various cloud providers and CI/CD systems.
 *              The 'BridgeBuilder' component of EnvManager 3000, ensuring "Configuration Consistency Across the Ecosystem".
 */
export class EnvSyncService {
    // Feature 21: Synchronize with AWS Secrets Manager
    static async syncToAwsSecretsManager(profileId: string, envVars: EnvVar[], config: Record<string, any>): Promise<string> {
        console.log(`[EnvSyncService] Syncing profile ${profileId} to AWS Secrets Manager: ${config.secretName}...`);
        // Simulate AWS SDK call
        const secretsPayload = envVars.reduce((acc, v) => ({ ...acc, [v.key]: v.metadata.encrypted ? v.value : EnvProcessorService.redactSecret(v.value) }), {});
        await EnvAuditService.log({
            id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: 'current_user',
            action: 'SYNC_PROFILE', targetId: profileId, targetType: 'EnvProfile', details: { target: 'AWS_SECRETS_MANAGER', config }
        });
        return new Promise(resolve => setTimeout(() => resolve(`AWS Secrets Manager sync for profile ${profileId} completed successfully. Secret: ${config.secretName}`), 2000));
    }

    // Feature 22: Synchronize with Azure Key Vault
    static async syncToAzureKeyVault(profileId: string, envVars: EnvVar[], config: Record<string, any>): Promise<string> {
        console.log(`[EnvSyncService] Syncing profile ${profileId} to Azure Key Vault: ${config.vaultName}...`);
        // Simulate Azure SDK call
        await EnvAuditService.log({
            id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: 'current_user',
            action: 'SYNC_PROFILE', targetId: profileId, targetType: 'EnvProfile', details: { target: 'AZURE_KEY_VAULT', config }
        });
        return new Promise(resolve => setTimeout(() => resolve(`Azure Key Vault sync for profile ${profileId} completed successfully. Vault: ${config.vaultName}`), 1800));
    }

    // Feature 23: Synchronize with Kubernetes ConfigMaps/Secrets
    static async syncToKubernetes(profileId: string, envVars: EnvVar[], config: Record<string, any>, isSecret: boolean = false): Promise<string> {
        console.log(`[EnvSyncService] Syncing profile ${profileId} to Kubernetes ${isSecret ? 'Secrets' : 'ConfigMaps'} in namespace ${config.namespace}...`);
        // Simulate Kubernetes API call
        const kubePayload = envVars.reduce((acc, v) => ({ ...acc, [v.key]: isSecret ? btoa(v.value) : v.value }), {});
        await EnvAuditService.log({
            id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: 'current_user',
            action: 'SYNC_PROFILE', targetId: profileId, targetType: 'EnvProfile', details: { target: `KUBERNETES_${isSecret ? 'SECRET' : 'CONFIGMAP'}`, config }
        });
        return new Promise(resolve => setTimeout(() => resolve(`Kubernetes ${isSecret ? 'Secret' : 'ConfigMap'} sync for profile ${profileId} completed. Namespace: ${config.namespace}`), 1500));
    }

    // Feature 24: Trigger CI/CD pipeline (e.g., GitHub Actions, Jenkins)
    static async triggerCIDeployment(profileId: string, ciSystem: 'GITHUB_ACTIONS' | 'JENKINS' | 'GITLAB_CI', config: Record<string, any>): Promise<string> {
        console.log(`[EnvSyncService] Triggering ${ciSystem} deployment for profile ${profileId}...`);
        await EnvAuditService.log({
            id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: 'current_user',
            action: 'TRIGGER_CI', targetId: profileId, targetType: 'EnvProfile', details: { ciSystem, config }
        });
        // Simulate API call to CI/CD system
        return new Promise(resolve => setTimeout(() => resolve(`${ciSystem} pipeline triggered for profile ${profileId}. Build ID: ${Math.floor(Math.random() * 10000)}`), 2500));
    }

    // Feature 25: Sync to HashiCorp Vault
    static async syncToHashicorpVault(profileId: string, envVars: EnvVar[], config: Record<string, any>): Promise<string> {
        console.log(`[EnvSyncService] Syncing profile ${profileId} to HashiCorp Vault path ${config.path}...`);
        const vaultPayload = envVars.reduce((acc, v) => ({ ...acc, [v.key]: v.value }), {});
        await EnvAuditService.log({
            id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: 'current_user',
            action: 'SYNC_PROFILE', targetId: profileId, targetType: 'EnvProfile', details: { target: 'HASHICORP_VAULT', config }
        });
        return new Promise(resolve => setTimeout(() => resolve(`HashiCorp Vault sync for profile ${profileId} completed. Path: ${config.path}`), 2200));
    }

    // Feature 26: Export to Vercel/Netlify environments (requires their CLI/API)
    static async exportToDeploymentPlatform(profileId: string, envVars: EnvVar[], platform: 'VERCEL' | 'NETLIFY', config: Record<string, any>): Promise<string> {
        console.log(`[EnvSyncService] Exporting profile ${profileId} to ${platform}...`);
        const platformPayload = envVars.map(v => ({ key: v.key, value: v.value, type: v.metadata.type === 'secret' ? 'secret' : 'plain' }));
        await EnvAuditService.log({
            id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: 'current_user',
            action: 'EXPORT', targetId: profileId, targetType: 'EnvProfile', details: { platform, config }
        });
        return new Promise(resolve => setTimeout(() => resolve(`${platform} environment update for profile ${profileId} successful.`), 1800));
    }

    // Feature 27: Webhook notification after sync (e.g., Slack, MS Teams)
    static async notifyWebhook(profileId: string, message: string, webhookUrl: string): Promise<void> {
        console.log(`[EnvSyncService] Sending webhook notification for profile ${profileId}: ${message}`);
        // Simulate fetch call to webhook
        await new Promise(resolve => setTimeout(resolve, 300));
        await EnvAuditService.log({
            id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: 'system',
            action: 'NOTIFICATION_SENT', targetId: profileId, targetType: 'EnvProfile', details: { message, channel: 'webhook' }
        });
    }

    // Feature 28: Scheduled synchronization management (mocked)
    static async scheduleSync(profileId: string, targetId: string, frequency: EnvSyncTarget['syncFrequency']): Promise<string> {
        console.log(`[EnvSyncService] Scheduling sync for profile ${profileId} to target ${targetId} with frequency ${frequency}`);
        // In a real system, this would interact with a scheduler microservice.
        await EnvAuditService.log({
            id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: 'current_user',
            action: 'SCHEDULE_SYNC', targetId: profileId, targetType: 'EnvProfile', details: { targetId, frequency }
        });
        return new Promise(resolve => setTimeout(() => resolve(`Sync scheduled for target ${targetId} (${frequency}).`), 500));
    }
}

/**
 * @class EnvAuditService
 * @description Centralized logging for all actions and system events.
 *              The 'Chronicle' module of EnvManager 3000, providing indisputable proof of configuration changes.
 */
export class EnvAuditService {
    // Feature 29: Log an audit entry to a persistent store (e.g., Datadog, Splunk, custom DB)
    static async log(entry: EnvAuditLogEntry): Promise<void> {
        console.log(`[EnvAuditService] Logging audit entry: ${entry.action} on ${entry.targetType}:${entry.targetId}`);
        // In a real system, this would push to a logging service or database.
        // For now, it just logs to console and stores in a local mock array.
        const fullEntry = { ...entry, ipAddress: '127.0.0.1', userAgent: navigator.userAgent }; // Populate missing fields
        _mockAuditLog.push(fullEntry);
        // Simulate sending to external monitoring (Datadog, Prometheus)
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Feature 30: Retrieve audit logs for a specific period/target
    static async getLogs(filter: { targetId?: string, action?: string, from?: string, to?: string }): Promise<EnvAuditLogEntry[]> {
        console.log(`[EnvAuditService] Fetching audit logs with filter: ${JSON.stringify(filter)}`);
        return new Promise(resolve => setTimeout(() => {
            const results = _mockAuditLog.filter(log => {
                if (filter.targetId && log.targetId !== filter.targetId) return false;
                if (filter.action && log.action !== filter.action) return false;
                if (filter.from && new Date(log.timestamp) < new Date(filter.from)) return false;
                if (filter.to && new Date(log.timestamp) > new Date(filter.to)) return false;
                return true;
            });
            // Feature 31: Sort logs by timestamp (newest first)
            resolve(results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }, 300));
    }

    // Feature 32: Real-time audit stream (using WebSockets or Server-Sent Events in a real app)
    static subscribeToAuditStream(callback: (entry: EnvAuditLogEntry) => void): () => void {
        console.log('[EnvAuditService] Subscribing to real-time audit stream (mocked)...');
        // In a real application, this would establish a WebSocket connection.
        const interval = setInterval(() => {
            if (_mockAuditLog.length > _lastLoggedIndex) {
                for (let i = _lastLoggedIndex; i < _mockAuditLog.length; i++) {
                    callback(_mockAuditLog[i]);
                }
                _lastLoggedIndex = _mockAuditLog.length;
            }
        }, 1000); // Check for new logs every second
        return () => clearInterval(interval); // Unsubscribe function
    }
}

// Global mock storage (simulating a backend/database for this single file context)
const _mockAuditLog: EnvAuditLogEntry[] = [];
let _lastLoggedIndex = 0;
const _mockProjects: EnvProject[] = [{
    id: 'proj-001', name: 'Acme Corp WebApp', description: 'Main customer-facing web application.',
    ownerId: 'admin_user_id', createdAt: new Date().toISOString(), lastUpdatedAt: new Date().toISOString(),
    defaultProfileId: 'dev-001', collaboratorIds: ['admin_user_id', 'dev_user_a'], auditLogRetentionDays: 90
}];
const _mockProfiles: EnvProfile[] = [
    { id: 'dev-001', name: 'Development', description: 'Local development environment.', isActive: true, isProtected: false, createdBy: 'admin_user_id', createdAt: new Date().toISOString(), lastUpdatedBy: 'admin_user_id', lastUpdatedAt: new Date().toISOString(), associatedProjectIds: ['proj-001'], syncTargets: [
        { id: 'sync-dev-k8s-001', name: 'K8s Dev ConfigMap', type: 'KUBERNETES_CONFIGMAP', configuration: { namespace: 'dev', configMapName: 'webapp-config' }, syncStatus: 'idle', syncFrequency: 'on_change' }
    ] },
    { id: 'stg-001', name: 'Staging', description: 'Pre-production environment for testing.', isActive: false, isProtected: true, createdBy: 'admin_user_id', createdAt: new Date().toISOString(), lastUpdatedBy: 'admin_user_id', lastUpdatedAt: new Date().toISOString(), associatedProjectIds: ['proj-001'], syncTargets: [
        { id: 'sync-stg-aws-001', name: 'AWS Secrets Manager (Staging)', type: 'AWS_SECRETS_MANAGER', configuration: { region: 'us-east-1', secretName: 'acme-webapp-staging' }, syncStatus: 'idle', syncFrequency: 'daily' },
        { id: 'sync-stg-gh-001', name: 'GitHub Actions (Staging)', type: 'GITHUB_ACTIONS_SECRETS', configuration: { repository: 'acme/webapp', environment: 'staging' }, syncStatus: 'idle', syncFrequency: 'manual' }
    ] },
    { id: 'prod-001', name: 'Production', description: 'Live production environment. Highly protected.', isActive: false, isProtected: true, createdBy: 'admin_user_id', createdAt: new Date().toISOString(), lastUpdatedBy: 'admin_user_id', lastUpdatedAt: new Date().toISOString(), associatedProjectIds: ['proj-001'], syncTargets: [
        { id: 'sync-prod-az-001', name: 'Azure Key Vault (Prod)', type: 'AZURE_KEY_VAULT', configuration: { vaultName: 'acme-prod-kv' }, syncStatus: 'idle', syncFrequency: 'hourly' },
        { id: 'sync-prod-vault-001', name: 'HashiCorp Vault (Prod)', type: 'HASHICORP_VAULT', configuration: { path: 'secret/data/acme/prod' }, syncStatus: 'idle', syncFrequency: 'hourly' }
    ] },
];
const _mockVersionHistory: EnvVersionHistoryEntry[] = [
    { id: 'vh-001', envVarId: 'vite-api-url-001', version: 1, key: 'VITE_API_URL', value: 'https://api.example.com/v1', metadataSnapshot: { type: 'string', description: 'Base URL for the primary API service.', tags: ['api', 'network'], sensitivity: 'low', source: 'manual', lastModifiedBy: 'dev_user_a', lastModifiedAt: '2024-01-01T10:00:00Z', createdAt: '2024-01-01T10:00:00Z', version: 1, profileIds: ['dev-001'], projectId: 'proj-001', encrypted: false, validationRules: ['required', 'url'], isDynamic: false, status: 'active' }, modifiedBy: 'dev_user_a', modifiedAt: '2024-01-01T10:00:00Z', reason: 'Initial commit' },
    { id: 'vh-002', envVarId: 'vite-api-url-001', version: 2, key: 'VITE_API_URL', value: 'https://api.example.com/v2', metadataSnapshot: { type: 'string', description: 'Base URL for the primary API service.', tags: ['api', 'network'], sensitivity: 'low', source: 'manual', lastModifiedBy: 'admin_user_id', lastModifiedAt: '2024-01-15T11:30:00Z', createdAt: '2024-01-01T10:00:00Z', version: 2, profileIds: ['dev-001'], projectId: 'proj-001', encrypted: false, validationRules: ['required', 'url'], isDynamic: false, status: 'active' }, modifiedBy: 'admin_user_id', modifiedAt: '2024-01-15T11:30:00Z', reason: 'API Version upgrade' },
    { id: 'vh-003', envVarId: 'db-password-001', version: 1, key: 'DATABASE_PASSWORD', value: 'superSecurePassword123!', metadataSnapshot: { type: 'secret', description: 'Password for the primary database user.', tags: ['database', 'security'], sensitivity: 'critical', source: 'manual', lastModifiedBy: 'admin_user_id', lastModifiedAt: '2024-03-01T10:00:00Z', createdAt: '2024-03-01T10:00:00Z', version: 1, profileIds: ['dev-001'], projectId: 'proj-001', encrypted: false, validationRules: ['required', 'min:20'], isDynamic: false, status: 'active', expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }, modifiedBy: 'admin_user_id', modifiedAt: '2024-03-01T10:00:00Z', reason: 'Initial secret setup' }
];

// --- React Contexts for better state management in a large component (Invented by Dr. Evelyn Reed) ---
// In a larger codebase, these would likely be in separate files using a dedicated state management library.
// For this single-file exercise, they demonstrate the intended architectural pattern.

/**
 * @interface EnvManagerContextType
 * @description Defines the shape of the global state and actions available through the EnvManager context.
 */
interface EnvManagerContextType {
    currentUserId: string;
    projects: EnvProject[];
    profiles: EnvProfile[];
    envVars: EnvVar[];
    activeProjectId: string;
    activeProfileId: string;
    isLoading: boolean;
    error: string | null;
    notification: { message: string, type: 'info' | 'success' | 'warning' | 'error' } | null;
    // Actions
    addEnvVar: (newVar: Omit<EnvVar, 'id' | 'metadata'> & { metadata?: Partial<EnvVariableMetadata> }) => Promise<void>;
    updateEnvVar: (id: string, field: 'key' | 'value', val: string) => Promise<void>;
    updateEnvVarMetadata: (id: string, metadata: Partial<EnvVariableMetadata>) => Promise<void>;
    removeEnvVar: (id: string) => Promise<void>;
    downloadEnvFile: (profileId: string) => Promise<void>;
    encryptEnvVar: (id: string) => Promise<void>;
    decryptEnvVar: (id: string) => Promise<void>;
    loadProfile: (profileId: string) => Promise<void>;
    createProfile: (name: string, description: string, projectId: string) => Promise<void>;
    updateProfile: (profileId: string, updates: Partial<EnvProfile>) => Promise<void>;
    deleteProfile: (profileId: string) => Promise<void>;
    syncProfile: (profileId: string, targetId: string) => Promise<void>;
    showNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error', duration?: number) => void;
    clearNotification: () => void;
    auditLogs: EnvAuditLogEntry[];
    versionHistory: EnvVersionHistoryEntry[];
    fetchVersionHistory: (envVarId: string) => Promise<void>;
    rollbackEnvVar: (envVarId: string, versionId: string, reason?: string) => Promise<void>;
    searchEnvVars: (query: string, projectId?: string, profileId?: string) => EnvVar[];
    importEnvVars: (profileId: string, format: 'json' | 'yaml' | 'env', data: string) => Promise<void>;
    exportEnvVars: (profileId: string, format: 'json' | 'yaml' | 'env' | 'encrypted') => Promise<string>;
    // AI Integrations
    aiGenerateDescription: (envVar: EnvVar) => Promise<void>;
    aiSuggestValue: (envVar: EnvVar) => Promise<void>;
    aiAutoCategorize: (envVar: EnvVar) => Promise<void>;
    aiSuggestCompliance: (envVar: EnvVar) => Promise<void>;
    // Security Scans
    runSecurityScan: () => Promise<string[]>;
}

const EnvManagerContext = createContext<EnvManagerContextType | undefined>(undefined);

export const useEnvManager = () => {
    const context = useContext(EnvManagerContext);
    if (!context) {
        throw new Error('useEnvManager must be used within an EnvManagerProvider');
    }
    return context;
};

// --- EnvManagerProvider: The Heart of EnvManager 3000's client-side state logic ---
// This component encapsulates the massive state and business logic, serving as the central controller.
export const EnvManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const currentUserId = 'admin_user_id'; // For demo, assuming a single admin user

    // Feature 33: Centralized state management for EnvVars, Projects, Profiles
    const [envVars, setEnvVars] = useState<EnvVar[]>([]); // Initialize empty, will load from _allMockEnvVars later
    const [projects, setProjects] = useState<EnvProject[]>(_mockProjects);
    const [profiles, setProfiles] = useState<EnvProfile[]>(_mockProfiles);
    const [activeProjectId, setActiveProjectId] = useState<string>('proj-001');
    const [activeProfileId, setActiveProfileId] = useState<string>('dev-001');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>(null);
    const [auditLogs, setAuditLogs] = useState<EnvAuditLogEntry[]>([]);
    const [versionHistory, setVersionHistory] = useState<EnvVersionHistoryEntry[]>([]);
    const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Feature 34: Initial data load effect
    useEffect(() => {
        // Load initial mock data filtered by active profile
        setEnvVars(_allMockEnvVars.filter(v => v.metadata.profileIds.includes(activeProfileId) && v.metadata.projectId === activeProjectId));
    }, [activeProjectId, activeProfileId]);


    // Feature 35: Real-time audit log subscription
    useEffect(() => {
        const unsubscribe = EnvAuditService.subscribeToAuditStream((entry) => {
            setAuditLogs(prev => [...prev, entry]);
        });
        return () => unsubscribe();
    }, []);

    // Feature 36: Generic notification system
    const showNotification = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error', duration: number = 5000) => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }
        setNotification({ message, type });
        notificationTimeoutRef.current = setTimeout(() => {
            setNotification(null);
        }, duration);
    }, []);

    const clearNotification = useCallback(() => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }
        setNotification(null);
    }, []);

    const addEnvVar = useCallback(async (newVarData: Omit<EnvVar, 'id' | 'metadata'> & { metadata?: Partial<EnvVariableMetadata> }) => {
        setIsLoading(true);
        setError(null);
        try {
            const id = crypto.randomUUID();
            const now = new Date().toISOString();
            const newEnvVar: EnvVar = {
                ...newVarData,
                id,
                metadata: {
                    type: 'string',
                    description: '',
                    tags: [],
                    sensitivity: 'low',
                    source: 'manual',
                    lastModifiedBy: currentUserId,
                    lastModifiedAt: now,
                    createdAt: now,
                    version: 1,
                    profileIds: [activeProfileId],
                    projectId: activeProjectId,
                    encrypted: false,
                    validationRules: ['required'],
                    isDynamic: false,
                    status: 'active',
                    ...newVarData.metadata
                }
            };
            const { isValid, errors } = await EnvProcessorService.validateEnvVar(newEnvVar);
            if (!isValid) {
                showNotification(`Validation failed: ${errors.join('; ')}`, 'error', 10000);
                return;
            }

            setEnvVars(prev => [...prev, newEnvVar]);
            // Feature 37: Persist new var to _allMockEnvVars as well (simulating backend)
            _allMockEnvVars.push(newEnvVar);

            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: now, userId: currentUserId,
                action: 'CREATE_VAR', targetId: id, targetType: 'EnvVar',
                details: { key: newEnvVar.key, value: EnvProcessorService.redactSecret(newEnvVar.value), profileId: activeProfileId }
            });
            showNotification(`Variable '${newEnvVar.key}' added successfully.`, 'success');
        } catch (e: any) {
            setError(`Failed to add variable: ${e.message}`);
            showNotification(`Failed to add variable: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [activeProfileId, activeProjectId, currentUserId, showNotification]);

    const updateEnvVar = useCallback(async (id: string, field: 'key' | 'value', val: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const originalVar = envVars.find(v => v.id === id);
            if (!originalVar) {
                showNotification('Variable not found.', 'error');
                return;
            }
            if (!(await EnvSecurityService.checkPermissions(currentUserId, 'UPDATE_VAR', id, 'EnvVar'))) {
                showNotification('Permission denied to update variable.', 'error');
                await EnvAuditService.log({
                    id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                    action: 'ACCESS_DENIED', targetId: id, targetType: 'EnvVar', details: { operation: 'UPDATE_VAR' }
                });
                return;
            }
            if (originalVar.metadata.isDynamic || profiles.find(p => p.id === originalVar.metadata.profileIds[0])?.isProtected) {
                if (!(await EnvSecurityService.enforceMFA(currentUserId, 'UPDATE_VAR'))) {
                    showNotification('MFA required for this protected or dynamic variable.', 'warning');
                    return;
                }
                if (profiles.find(p => p.id === originalVar.metadata.profileIds[0])?.isProtected && !(await EnvSecurityService.requestApproval(currentUserId, 'UPDATE_VAR', id, `Updating value for protected variable ${originalVar.key}`))) {
                    showNotification('Update requires approval and was denied.', 'error');
                    return;
                }
            }


            const updatedVar = { ...originalVar, [field]: val, metadata: { ...originalVar.metadata, lastModifiedBy: currentUserId, lastModifiedAt: new Date().toISOString(), version: originalVar.metadata.version + 1 } };
            const { isValid, errors } = await EnvProcessorService.validateEnvVar(updatedVar);
            if (!isValid) {
                showNotification(`Validation failed: ${errors.join('; ')}`, 'error', 10000);
                return; // Prevent update if invalid
            }

            // Feature 38: Store previous version in history before updating
            _mockVersionHistory.push({
                id: crypto.randomUUID(), envVarId: originalVar.id, version: originalVar.metadata.version,
                key: originalVar.key, value: originalVar.value, metadataSnapshot: originalVar.metadata,
                modifiedBy: originalVar.metadata.lastModifiedBy, modifiedAt: originalVar.metadata.lastModifiedAt,
                reason: 'Auto-saved before update'
            });

            setEnvVars(prev => prev.map(v => v.id === id ? updatedVar : v));
            // Update _allMockEnvVars to reflect change
            const globalIndex = _allMockEnvVars.findIndex(v => v.id === id);
            if (globalIndex > -1) _allMockEnvVars[globalIndex] = updatedVar;

            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                action: 'UPDATE_VAR', targetId: id, targetType: 'EnvVar',
                details: {
                    field, oldValue: originalVar[field], newValue: field === 'value' ? EnvProcessorService.redactSecret(val) : val,
                    oldMetadata: originalVar.metadata, newMetadata: updatedVar.metadata, profileId: activeProfileId
                }
            });
            showNotification(`Variable '${updatedVar.key}' updated.`, 'info', 3000);
        } catch (e: any) {
            setError(`Failed to update variable: ${e.message}`);
            showNotification(`Failed to update variable: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [envVars, profiles, currentUserId, showNotification]);

    const updateEnvVarMetadata = useCallback(async (id: string, newMetadata: Partial<EnvVariableMetadata>) => {
        setIsLoading(true);
        setError(null);
        try {
            const originalVar = envVars.find(v => v.id === id);
            if (!originalVar) {
                showNotification('Variable not found.', 'error');
                return;
            }
            if (!(await EnvSecurityService.checkPermissions(currentUserId, 'UPDATE_METADATA', id, 'EnvVar'))) {
                showNotification('Permission denied to update metadata.', 'error');
                return;
            }
            if (profiles.find(p => p.id === originalVar.metadata.profileIds[0])?.isProtected) {
                if (!(await EnvSecurityService.enforceMFA(currentUserId, 'UPDATE_PROFILE'))) { // MFA for metadata change on protected profile
                    showNotification('MFA required for this protected profile metadata update.', 'warning');
                    return;
                }
                if (!(await EnvSecurityService.requestApproval(currentUserId, 'UPDATE_METADATA', id, `Updating metadata for protected variable ${originalVar.key}`))) {
                    showNotification('Metadata update requires approval and was denied.', 'error');
                    return;
                }
            }


            const updatedVar = {
                ...originalVar,
                metadata: {
                    ...originalVar.metadata,
                    ...newMetadata,
                    lastModifiedBy: currentUserId,
                    lastModifiedAt: new Date().toISOString(),
                    version: originalVar.metadata.version + 1
                }
            };
            // Store previous version in history
            _mockVersionHistory.push({
                id: crypto.randomUUID(), envVarId: originalVar.id, version: originalVar.metadata.version,
                key: originalVar.key, value: originalVar.value, metadataSnapshot: originalVar.metadata,
                modifiedBy: originalVar.metadata.lastModifiedBy, modifiedAt: originalVar.metadata.lastModifiedAt,
                reason: 'Auto-saved before metadata update'
            });

            setEnvVars(prev => prev.map(v => v.id === id ? updatedVar : v));
            const globalIndex = _allMockEnvVars.findIndex(v => v.id === id);
            if (globalIndex > -1) _allMockEnvVars[globalIndex] = updatedVar;

            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                action: 'UPDATE_METADATA', targetId: id, targetType: 'EnvVar',
                details: {
                    key: updatedVar.key,
                    oldMetadata: originalVar.metadata,
                    newMetadata: updatedVar.metadata,
                    profileId: activeProfileId
                }
            });
            showNotification(`Metadata for '${updatedVar.key}' updated.`, 'info', 3000);
        } catch (e: any) {
            setError(`Failed to update metadata: ${e.message}`);
            showNotification(`Failed to update metadata: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [envVars, profiles, currentUserId, showNotification]);

    const removeEnvVar = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!(await EnvSecurityService.checkPermissions(currentUserId, 'DELETE_VAR', id, 'EnvVar'))) {
                showNotification('Permission denied to delete variable.', 'error');
                await EnvAuditService.log({
                    id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                    action: 'ACCESS_DENIED', targetId: id, targetType: 'EnvVar', details: { operation: 'DELETE_VAR' }
                });
                return;
            }
            if (!(await EnvSecurityService.enforceMFA(currentUserId, 'DELETE_VAR'))) {
                showNotification('MFA required to delete variable.', 'warning');
                return;
            }
            if (!(await EnvSecurityService.requestApproval(currentUserId, 'DELETE_VAR', id, 'Deleting a variable'))) {
                showNotification('Deletion requires approval and was denied.', 'error');
                return;
            }

            const removedVar = envVars.find(v => v.id === id);
            if (removedVar) {
                setEnvVars(prev => prev.filter(v => v.id !== id));
                // Update _allMockEnvVars to reflect change
                const globalIndex = _allMockEnvVars.findIndex(v => v.id === id);
                if (globalIndex > -1) _allMockEnvVars.splice(globalIndex, 1);

                await EnvAuditService.log({
                    id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                    action: 'DELETE_VAR', targetId: id, targetType: 'EnvVar',
                    details: { key: removedVar.key, value: EnvProcessorService.redactSecret(removedVar.value), profileId: activeProfileId }
                });
                showNotification(`Variable '${removedVar.key}' removed.`, 'success');
            }
        } catch (e: any) {
            setError(`Failed to remove variable: ${e.message}`);
            showNotification(`Failed to remove variable: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [envVars, currentUserId, activeProfileId, showNotification]);

    // Feature 39: Enhanced download with active profile filtering and filename
    const downloadEnvFileForProfile = useCallback(async (profileId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const profileVars = envVars.filter(v => v.metadata.profileIds.includes(profileId));
            const envObject = profileVars.reduce((acc, v) => {
                if (v.key) acc[v.key] = v.value; // Store actual value for download
                return acc;
            }, {} as Record<string, string>);
            const filename = `${profiles.find(p => p.id === profileId)?.name || 'environment'}.env`;
            downloadEnvFile(envObject, filename);
            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                action: 'EXPORT', targetId: profileId, targetType: 'EnvProfile', details: { format: 'env-file', filename }
            });
            showNotification(`'.env' file for profile '${profiles.find(p => p.id === profileId)?.name}' downloaded successfully.`, 'success');
        } catch (e: any) {
            setError(`Failed to download .env file: ${e.message}`);
            showNotification(`Failed to download .env file: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [envVars, profiles, currentUserId, showNotification]);

    // Feature 40: Encrypt variable action
    const encryptEnvVar = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const targetVar = envVars.find(v => v.id === id);
            if (!targetVar) { showNotification('Variable not found.', 'error'); return; }
            if (targetVar.metadata.encrypted) { showNotification('Variable is already encrypted.', 'info'); return; }
            if (!(await EnvSecurityService.enforceMFA(currentUserId, 'ENCRYPT_VAR'))) {
                showNotification('MFA required to encrypt variable.', 'warning');
                return;
            }

            const encryptedValue = await EnvSecurityService.encrypt(targetVar.value, id);
            const updatedVar = {
                ...targetVar,
                value: encryptedValue,
                metadata: { ...targetVar.metadata, encrypted: true, encryptionAlgorithm: 'AES256', lastModifiedBy: currentUserId, lastModifiedAt: new Date().toISOString(), version: targetVar.metadata.version + 1 }
            };

            // Store previous version in history
            _mockVersionHistory.push({
                id: crypto.randomUUID(), envVarId: targetVar.id, version: targetVar.metadata.version,
                key: targetVar.key, value: targetVar.value, metadataSnapshot: targetVar.metadata,
                modifiedBy: targetVar.metadata.lastModifiedBy, modifiedAt: targetVar.metadata.lastModifiedAt,
                reason: 'Auto-saved before encryption'
            });

            setEnvVars(prev => prev.map(v => v.id === id ? updatedVar : v));
            const globalIndex = _allMockEnvVars.findIndex(v => v.id === id);
            if (globalIndex > -1) _allMockEnvVars[globalIndex] = updatedVar;
            showNotification(`Variable '${targetVar.key}' encrypted successfully.`, 'success');
        } catch (e: any) {
            setError(`Failed to encrypt variable: ${e.message}`);
            showNotification(`Failed to encrypt variable: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [envVars, currentUserId, showNotification]);

    // Feature 41: Decrypt variable action
    const decryptEnvVar = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const targetVar = envVars.find(v => v.id === id);
            if (!targetVar) { showNotification('Variable not found.', 'error'); return; }
            if (!targetVar.metadata.encrypted) { showNotification('Variable is not encrypted.', 'info'); return; }
            if (!(await EnvSecurityService.checkPermissions(currentUserId, 'DECRYPT_VAR', id, 'EnvVar'))) {
                showNotification('Permission denied to decrypt variable.', 'error');
                await EnvAuditService.log({
                    id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                    action: 'ACCESS_DENIED', targetId: id, targetType: 'EnvVar', details: { operation: 'DECRYPT_VAR' }
                });
                return;
            }
            if (!(await EnvSecurityService.enforceMFA(currentUserId, 'DECRYPT_VAR'))) {
                showNotification('MFA required to decrypt variable.', 'warning');
                return;
            }

            const decryptedValue = await EnvSecurityService.decrypt(targetVar.value, id);
            const updatedVar = {
                ...targetVar,
                value: decryptedValue,
                metadata: { ...targetVar.metadata, encrypted: false, encryptionAlgorithm: undefined, lastModifiedBy: currentUserId, lastModifiedAt: new Date().toISOString(), version: targetVar.metadata.version + 1 }
            };

            // Store previous version in history
            _mockVersionHistory.push({
                id: crypto.randomUUID(), envVarId: targetVar.id, version: targetVar.metadata.version,
                key: targetVar.key, value: targetVar.value, metadataSnapshot: targetVar.metadata,
                modifiedBy: targetVar.metadata.lastModifiedBy, modifiedAt: targetVar.metadata.lastModifiedAt,
                reason: 'Auto-saved before decryption'
            });

            setEnvVars(prev => prev.map(v => v.id === id ? updatedVar : v));
            const globalIndex = _allMockEnvVars.findIndex(v => v.id === id);
            if (globalIndex > -1) _allMockEnvVars[globalIndex] = updatedVar;
            showNotification(`Variable '${targetVar.key}' decrypted successfully.`, 'success');
        } catch (e: any) {
            setError(`Failed to decrypt variable: ${e.message}`);
            showNotification(`Failed to decrypt variable: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [envVars, currentUserId, showNotification]);

    // Feature 42: Load environment profile and its associated variables
    const loadProfile = useCallback(async (profileId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const profile = profiles.find(p => p.id === profileId);
            if (!profile) { showNotification('Profile not found.', 'error'); return; }

            // Simulate fetching variables specific to this profile from a backend
            // For now, we'll filter our local `_allMockEnvVars`
            const newEnvVars = _allMockEnvVars.filter(v => v.metadata.profileIds.includes(profileId) && v.metadata.projectId === activeProjectId);
            setEnvVars(newEnvVars);
            setActiveProfileId(profileId);
            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                action: 'PROFILE_CHANGE', targetId: profileId, targetType: 'EnvProfile', details: { newProfile: profile.name, projectId: activeProjectId }
            });
            showNotification(`Profile '${profile.name}' loaded.`, 'info');
        } catch (e: any) {
            setError(`Failed to load profile: ${e.message}`);
            showNotification(`Failed to load profile: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [profiles, activeProjectId, currentUserId, showNotification]);

    // Feature 43: Create new profile
    const createProfile = useCallback(async (name: string, description: string, projectId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const newProfileId = crypto.randomUUID();
            const now = new Date().toISOString();
            const newProfile: EnvProfile = {
                id: newProfileId, name, description, isActive: false, isProtected: false,
                createdBy: currentUserId, createdAt: now, lastUpdatedBy: currentUserId, lastUpdatedAt: now,
                associatedProjectIds: [projectId], syncTargets: []
            };
            setProfiles(prev => [...prev, newProfile]);
            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: now, userId: currentUserId,
                action: 'CREATE_PROFILE', targetId: newProfileId, targetType: 'EnvProfile', details: { name, projectId }
            });
            showNotification(`Profile '${name}' created successfully.`, 'success');
            return newProfile;
        } catch (e: any) {
            setError(`Failed to create profile: ${e.message}`);
            showNotification(`Failed to create profile: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [currentUserId, showNotification]);

    // Feature 44: Update profile settings
    const updateProfile = useCallback(async (profileId: string, updates: Partial<EnvProfile>) => {
        setIsLoading(true);
        setError(null);
        try {
            const originalProfile = profiles.find(p => p.id === profileId);
            if (!originalProfile) { showNotification('Profile not found.', 'error'); return; }
            if (!(await EnvSecurityService.checkPermissions(currentUserId, 'UPDATE_PROFILE', profileId, 'EnvProfile'))) {
                showNotification('Permission denied to update profile.', 'error');
                await EnvAuditService.log({
                    id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                    action: 'ACCESS_DENIED', targetId: profileId, targetType: 'EnvProfile', details: { operation: 'UPDATE_PROFILE' }
                });
                return;
            }
            if (originalProfile.isProtected || updates.isProtected) {
                if (!(await EnvSecurityService.enforceMFA(currentUserId, 'UPDATE_PROFILE'))) {
                    showNotification('MFA required for protected profile changes.', 'warning');
                    return;
                }
                if (!(await EnvSecurityService.requestApproval(currentUserId, 'UPDATE_PROFILE', profileId, `Updating profile settings for ${originalProfile.name}`))) {
                    showNotification('Profile update requires approval and was denied.', 'error');
                    return;
                }
            }

            const updatedProfile = {
                ...originalProfile,
                ...updates,
                lastUpdatedBy: currentUserId,
                lastUpdatedAt: new Date().toISOString()
            };
            setProfiles(prev => prev.map(p => p.id === profileId ? updatedProfile : p));
            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                action: 'UPDATE_PROFILE', targetId: profileId, targetType: 'EnvProfile',
                details: { old: originalProfile, new: updatedProfile }
            });
            showNotification(`Profile '${updatedProfile.name}' updated.`, 'success');
        } catch (e: any) {
            setError(`Failed to update profile: ${e.message}`);
            showNotification(`Failed to update profile: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [profiles, currentUserId, showNotification]);

    // Feature 45: Delete profile
    const deleteProfile = useCallback(async (profileId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const profile = profiles.find(p => p.id === profileId);
            if (!profile) { showNotification('Profile not found.', 'error'); return; }
            if (!(await EnvSecurityService.checkPermissions(currentUserId, 'DELETE_PROFILE', profileId, 'EnvProfile'))) {
                showNotification('Permission denied to delete profile.', 'error');
                await EnvAuditService.log({
                    id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                    action: 'ACCESS_DENIED', targetId: profileId, targetType: 'EnvProfile', details: { operation: 'DELETE_PROFILE' }
                });
                return;
            }
            if (profile.isProtected || profile.id === activeProfileId) { // Can't delete active or protected profile without MFA/approval
                if (!(await EnvSecurityService.enforceMFA(currentUserId, 'DELETE_PROFILE'))) {
                    showNotification('MFA required for protected profile deletion.', 'warning');
                    return;
                }
                if (!(await EnvSecurityService.requestApproval(currentUserId, 'DELETE_PROFILE', profileId, `Deleting protected profile ${profile.name}`))) {
                    showNotification('Profile deletion requires approval and was denied.', 'error');
                    return;
                }
            }

            setProfiles(prev => prev.filter(p => p.id !== profileId));
            // Also remove variables associated *only* with this profile from the UI and mock storage
            setEnvVars(prev => prev.filter(v => !v.metadata.profileIds.includes(profileId) || v.metadata.profileIds.length > 1));
            const globalEnvVarsAfterDeletion = _allMockEnvVars.filter(v => !v.metadata.profileIds.includes(profileId) || v.metadata.profileIds.length > 1);
            _allMockEnvVars.length = 0; // Clear and repopulate
            _allMockEnvVars.push(...globalEnvVarsAfterDeletion);

            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                action: 'DELETE_PROFILE', targetId: profileId, targetType: 'EnvProfile', details: { name: profile.name }
            });
            showNotification(`Profile '${profile.name}' deleted.`, 'success');
        } catch (e: any) {
            setError(`Failed to delete profile: ${e.message}`);
            showNotification(`Failed to delete profile: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [profiles, envVars, currentUserId, activeProfileId, showNotification]);

    // Feature 46: Sync profile to an external target
    const syncProfile = useCallback(async (profileId: string, targetId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const profile = profiles.find(p => p.id === profileId);
            if (!profile) { showNotification('Profile not found.', 'error'); return; }
            const syncTarget = profile.syncTargets.find(t => t.id === targetId);
            if (!syncTarget) { showNotification('Sync target not found.', 'error'); return; }

            if (!(await EnvSecurityService.checkPermissions(currentUserId, 'SYNC_PROFILE', profileId, 'EnvProfile'))) {
                showNotification('Permission denied to sync profile.', 'error');
                await EnvAuditService.log({
                    id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                    action: 'ACCESS_DENIED', targetId: profileId, targetType: 'EnvProfile', details: { operation: 'SYNC_PROFILE', syncTarget: syncTarget.name }
                });
                return;
            }
            if (!(await EnvSecurityService.enforceMFA(currentUserId, 'SYNC_PROFILE'))) {
                showNotification('MFA required to sync profile.', 'warning');
                return;
            }
            if (!(await EnvSecurityService.requestApproval(currentUserId, 'SYNC_PROFILE', profileId, `Syncing profile ${profile.name} to ${syncTarget.name}`))) {
                showNotification('Sync operation requires approval and was denied.', 'error');
                return;
            }

            const varsToSync = _allMockEnvVars.filter(v => v.metadata.profileIds.includes(profileId) && v.metadata.projectId === activeProjectId);

            let syncResult = '';
            switch (syncTarget.type) {
                case 'AWS_SECRETS_MANAGER':
                    syncResult = await EnvSyncService.syncToAwsSecretsManager(profileId, varsToSync, syncTarget.configuration);
                    break;
                case 'AZURE_KEY_VAULT':
                    syncResult = await EnvSyncService.syncToAzureKeyVault(profileId, varsToSync, syncTarget.configuration);
                    break;
                case 'KUBERNETES_CONFIGMAP':
                    syncResult = await EnvSyncService.syncToKubernetes(profileId, varsToSync, syncTarget.configuration);
                    break;
                case 'HASHICORP_VAULT':
                    syncResult = await EnvSyncService.syncToHashicorpVault(profileId, varsToSync, syncTarget.configuration);
                    break;
                case 'GITHUB_ACTIONS_SECRETS':
                    syncResult = await EnvSyncService.triggerCIDeployment(profileId, 'GITHUB_ACTIONS', syncTarget.configuration); // Re-using for secret sync simulation
                    break;
                case 'GITLAB_CI_VARS':
                    syncResult = await EnvSyncService.triggerCIDeployment(profileId, 'GITLAB_CI', syncTarget.configuration); // Re-using for var sync simulation
                    break;
                case 'VERCEL_ENV':
                case 'NETLIFY_ENV':
                    syncResult = await EnvSyncService.exportToDeploymentPlatform(profileId, varsToSync, syncTarget.type, syncTarget.configuration);
                    break;
                // ... potentially hundreds more sync targets
                default:
                    throw new Error(`Unsupported sync target type: ${syncTarget.type}`);
            }
            // Update sync target status
            setProfiles(prev => prev.map(p => p.id === profileId ? {
                ...p,
                syncTargets: p.syncTargets.map(t => t.id === targetId ? { ...t, lastSyncAt: new Date().toISOString(), syncStatus: 'succeeded' } : t)
            } : p));
            await EnvSyncService.notifyWebhook(profileId, `Profile '${profile.name}' synced to ${syncTarget.name} (${syncTarget.type}).`, 'https://mock.webhook.url');
            showNotification(syncResult, 'success', 7000);
        } catch (e: any) {
            setError(`Failed to sync profile: ${e.message}`);
            showNotification(`Failed to sync profile: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [profiles, envVars, activeProjectId, currentUserId, showNotification]);

    // Feature 47: Fetch version history for a variable (mocked)
    const fetchVersionHistory = useCallback(async (envVarId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log(`[EnvVersionControlService] Fetching history for ${envVarId}`);
            // In a real system, this would call EnvVersionControlService.getHistory(envVarId)
            const history = _mockVersionHistory.filter(h => h.envVarId === envVarId)
                                               .sort((a, b) => b.version - a.version); // Newest first
            setVersionHistory(history);
            showNotification(`Version history for variable fetched.`, 'info');
        } catch (e: any) {
            setError(`Failed to fetch version history: ${e.message}`);
            showNotification(`Failed to fetch version history: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showNotification]);

    // Feature 48: Rollback variable to a specific version
    const rollbackEnvVar = useCallback(async (envVarId: string, versionId: string, reason: string = 'Manual Rollback') => {
        setIsLoading(true);
        setError(null);
        try {
            const historyEntry = _mockVersionHistory.find(h => h.id === versionId && h.envVarId === envVarId);
            if (!historyEntry) { showNotification('Version history entry not found.', 'error'); return; }

            if (!(await EnvSecurityService.checkPermissions(currentUserId, 'ROLLBACK_VAR', envVarId, 'EnvVar'))) {
                showNotification('Permission denied to rollback variable.', 'error');
                await EnvAuditService.log({
                    id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                    action: 'ACCESS_DENIED', targetId: envVarId, targetType: 'EnvVar', details: { operation: 'ROLLBACK_VAR' }
                });
                return;
            }
            if (!(await EnvSecurityService.enforceMFA(currentUserId, 'ROLLBACK_VAR'))) {
                showNotification('MFA required to rollback variable.', 'warning');
                return;
            }
            if (!(await EnvSecurityService.requestApproval(currentUserId, 'ROLLBACK_VAR', envVarId, `Rolling back ${historyEntry.key} to version ${historyEntry.version}`))) {
                showNotification('Rollback requires approval and was denied.', 'error');
                return;
            }

            const now = new Date().toISOString();
            const originalVar = _allMockEnvVars.find(v => v.id === envVarId);
            if (!originalVar) { showNotification('Current variable not found for rollback.', 'error'); return; }

            // Save current state as a new history entry before rollback
            _mockVersionHistory.push({
                id: crypto.randomUUID(), envVarId: originalVar.id, version: originalVar.metadata.version,
                key: originalVar.key, value: originalVar.value, metadataSnapshot: originalVar.metadata,
                modifiedBy: currentUserId, modifiedAt: now, reason: `Pre-rollback snapshot (Rollback to v${historyEntry.version})`
            });

            const rolledBackVar: EnvVar = {
                id: envVarId,
                key: historyEntry.key,
                value: historyEntry.value,
                metadata: {
                    ...historyEntry.metadataSnapshot,
                    lastModifiedBy: currentUserId,
                    lastModifiedAt: now,
                    version: originalVar.metadata.version + 1, // Increment version even on rollback
                    source: 'dynamic' // Mark as dynamic if source was dynamic
                }
            };
            setEnvVars(prev => prev.map(v => v.id === envVarId ? rolledBackVar : v));
            const globalIndex = _allMockEnvVars.findIndex(v => v.id === envVarId);
            if (globalIndex > -1) _allMockEnvVars[globalIndex] = rolledBackVar;

            // Add the rollback itself to history
            _mockVersionHistory.push({
                id: crypto.randomUUID(), envVarId, version: rolledBackVar.metadata.version,
                key: rolledBackVar.key, value: rolledBackVar.value, metadataSnapshot: rolledBackVar.metadata,
                modifiedBy: currentUserId, modifiedAt: now, reason: reason
            });

            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: now, userId: currentUserId,
                action: 'ROLLBACK_VAR', targetId: envVarId, targetType: 'EnvVar',
                details: { rolledBackToVersion: historyEntry.version, key: historyEntry.key, value: EnvProcessorService.redactSecret(historyEntry.value), reason, profileId: activeProfileId }
            });
            showNotification(`Variable '${historyEntry.key}' rolled back to version ${historyEntry.version}.`, 'success');
        } catch (e: any) {
            setError(`Failed to rollback variable: ${e.message}`);
            showNotification(`Failed to rollback variable: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [envVars, versionHistory, currentUserId, activeProfileId, showNotification]);

    // Feature 49: Search and filter environment variables (with fuzzy matching in future)
    const searchEnvVars = useCallback((query: string, projectId?: string, profileId?: string): EnvVar[] => {
        const lowerCaseQuery = query.toLowerCase();
        return _allMockEnvVars.filter(v => {
            const matchesQuery = v.key.toLowerCase().includes(lowerCaseQuery) ||
                                 v.value.toLowerCase().includes(lowerCaseQuery) ||
                                 v.metadata.description.toLowerCase().includes(lowerCaseQuery) ||
                                 v.metadata.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
            const matchesProject = projectId ? v.metadata.projectId === projectId : true;
            const matchesProfile = profileId ? v.metadata.profileIds.includes(profileId) : true;
            return matchesQuery && matchesProject && matchesProfile;
        });
    }, []); // Note: envVars not in dependency array as search operates on _allMockEnvVars

    // Feature 50: Import environment variables from various formats
    const importEnvVars = useCallback(async (profileId: string, format: 'json' | 'yaml' | 'env', data: string) => {
        setIsLoading(true);
        setError(null);
        try {
            let parsedData: Record<string, string> = {};
            // Feature 51: Format detection & parsing
            if (format === 'json') {
                parsedData = JSON.parse(data);
            } else if (format === 'yaml') {
                // Mock YAML parser (simplified)
                const lines = data.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
                lines.forEach(line => {
                    const [key, value] = line.split(':').map(s => s.trim());
                    if (key && value) parsedData[key] = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
                });
            } else if (format === 'env') {
                const lines = data.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
                lines.forEach(line => {
                    const parts = line.split('=').map(s => s.trim());
                    if (parts.length >= 2) {
                        const key = parts[0];
                        const value = parts.slice(1).join('=').replace(/^['"](.*)['"]$/, '$1'); // Handle values with '=' and quotes
                        parsedData[key] = value;
                    }
                });
            } else {
                throw new Error('Unsupported import format.');
            }

            const now = new Date().toISOString();
            const newVarsToDisplay: EnvVar[] = [];
            for (const key in parsedData) {
                const value = parsedData[key];
                const existingVarIndex = _allMockEnvVars.findIndex(v => v.key === key && v.metadata.profileIds.includes(profileId));

                if (existingVarIndex !== -1) {
                    const existingVar = _allMockEnvVars[existingVarIndex];
                    // Update existing variable
                    const updatedVar = {
                        ...existingVar,
                        value,
                        metadata: { ...existingVar.metadata, lastModifiedBy: currentUserId, lastModifiedAt: now, version: existingVar.metadata.version + 1, source: 'imported' }
                    };
                    const { isValid, errors } = await EnvProcessorService.validateEnvVar(updatedVar);
                    if (!isValid) {
                        showNotification(`Validation failed for imported var '${key}': ${errors.join('; ')}. Skipping update.`, 'warning', 10000);
                        continue;
                    }
                    // Save previous version to history
                    _mockVersionHistory.push({
                        id: crypto.randomUUID(), envVarId: existingVar.id, version: existingVar.metadata.version,
                        key: existingVar.key, value: existingVar.value, metadataSnapshot: existingVar.metadata,
                        modifiedBy: existingVar.metadata.lastModifiedBy, modifiedAt: existingVar.metadata.lastModifiedAt,
                        reason: 'Auto-saved before import update'
                    });
                    _allMockEnvVars[existingVarIndex] = updatedVar; // Update in global mock
                    if (updatedVar.metadata.profileIds.includes(activeProfileId)) { // If it's for the current profile, add to display
                        newVarsToDisplay.push(updatedVar);
                    }
                    await EnvAuditService.log({
                        id: crypto.randomUUID(), timestamp: now, userId: currentUserId,
                        action: 'UPDATE_VAR', targetId: existingVar.id, targetType: 'EnvVar',
                        details: { key, oldValue: EnvProcessorService.redactSecret(existingVar.value), newValue: EnvProcessorService.redactSecret(value), source: 'imported', profileId }
                    });
                } else {
                    // Add new variable
                    const newVarId = crypto.randomUUID();
                    const newVar: EnvVar = {
                        id: newVarId, key, value,
                        metadata: {
                            type: 'string', description: 'Imported variable.', tags: ['imported'],
                            sensitivity: 'low', source: 'imported', lastModifiedBy: currentUserId, lastModifiedAt: now,
                            createdAt: now, version: 1, profileIds: [profileId], projectId: activeProjectId,
                            encrypted: false, validationRules: [], isDynamic: false, status: 'active'
                        }
                    };
                    const { isValid, errors } = await EnvProcessorService.validateEnvVar(newVar);
                    if (!isValid) {
                        showNotification(`Validation failed for new imported var '${key}': ${errors.join('; ')}. Skipping creation.`, 'warning', 10000);
                        continue;
                    }
                    _allMockEnvVars.push(newVar); // Add to global mock
                    if (newVar.metadata.profileIds.includes(activeProfileId)) {
                        newVarsToDisplay.push(newVar); // Add to display
                    }
                    await EnvAuditService.log({
                        id: crypto.randomUUID(), timestamp: now, userId: currentUserId,
                        action: 'CREATE_VAR', targetId: newVar.id, targetType: 'EnvVar',
                        details: { key, value: EnvProcessorService.redactSecret(value), source: 'imported', profileId }
                    });
                }
            }
            // Update local state to reflect changes, ensuring only variables for the active profile are shown
            setEnvVars(prev => {
                const currentProfileVars = prev.filter(v => v.metadata.profileIds.includes(profileId));
                const updatedCurrentProfileVars = currentProfileVars.map(v => newVarsToDisplay.find(nv => nv.id === v.id) || v);
                const newlyAddedToCurrentProfile = newVarsToDisplay.filter(nv => !currentProfileVars.some(v => v.id === nv.id));
                return [...updatedCurrentProfileVars, ...newlyAddedToCurrentProfile];
            });


            showNotification(`Successfully imported variables from ${format} into profile '${profiles.find(p => p.id === profileId)?.name}'.`, 'success');
        } catch (e: any) {
            setError(`Failed to import variables: ${e.message}`);
            showNotification(`Failed to import variables: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [profiles, activeProjectId, activeProfileId, currentUserId, showNotification]); // Added activeProfileId to dependency array

    // Feature 52: Export environment variables to various formats
    const exportEnvVars = useCallback(async (profileId: string, format: 'json' | 'yaml' | 'env' | 'encrypted'): Promise<string> => {
        setIsLoading(true);
        setError(null);
        try {
            const profile = profiles.find(p => p.id === profileId);
            if (!profile) throw new Error('Profile not found.');

            if (!(await EnvSecurityService.checkPermissions(currentUserId, 'EXPORT_PROFILE', profileId, 'EnvProfile'))) {
                showNotification('Permission denied to export profile.', 'error');
                await EnvAuditService.log({
                    id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                    action: 'ACCESS_DENIED', targetId: profileId, targetType: 'EnvProfile', details: { operation: 'EXPORT_PROFILE' }
                });
                return '';
            }
            if (!(await EnvSecurityService.enforceMFA(currentUserId, 'EXPORT_PROFILE'))) {
                showNotification('MFA required to export profile.', 'warning');
                return '';
            }

            const varsToExport = _allMockEnvVars.filter(v => v.metadata.profileIds.includes(profileId) && v.metadata.projectId === activeProjectId);
            const envObject = varsToExport.reduce((acc, v) => ({ ...acc, [v.key]: v.value }), {});

            let exportedData: string = '';
            // Feature 53: Format conversion for export
            if (format === 'json') {
                exportedData = JSON.stringify(envObject, null, 2);
            } else if (format === 'yaml') {
                // Simple mock YAML export (real YAML requires a library)
                exportedData = Object.entries(envObject).map(([key, value]) => `${key}: "${value.replace(/"/g, '\\"')}"`).join('\n');
            } else if (format === 'env') {
                exportedData = Object.entries(envObject).map(([key, value]) => `${key}="${value.replace(/"/g, '\\"')}"`).join('\n');
            } else if (format === 'encrypted') {
                // Feature 54: Encrypted export format (proprietary EnvManager 3000 format)
                const encryptedPayload = await EnvSecurityService.encrypt(JSON.stringify(envObject), `export-${profileId}-${Date.now()}`);
                exportedData = `EM3K_ENC::V1::${btoa(profileId)}::${encryptedPayload}`; // Invented secure export format
                showNotification('Exported data is in proprietary EnvManager 3000 encrypted format.', 'info');
            } else {
                throw new Error('Unsupported export format.');
            }

            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                action: 'EXPORT', targetId: profileId, targetType: 'EnvProfile', details: { format }
            });
            showNotification(`Variables exported to ${format} for profile '${profile.name}'.`, 'success');
            return exportedData;
        } catch (e: any) {
            setError(`Failed to export variables: ${e.message}`);
            showNotification(`Failed to export variables: ${e.message}`, 'error');
            return '';
        } finally {
            setIsLoading(false);
        }
    }, [profiles, activeProjectId, currentUserId, showNotification]);

    // Feature 55: AI - Generate Description
    const aiGenerateDescription = useCallback(async (envVar: EnvVar) => {
        setIsLoading(true);
        setError(null);
        try {
            const description = await EnvAIService.generateDescription(envVar.key, envVar.value);
            await updateEnvVarMetadata(envVar.id, { description, source: 'ai-generated' });
            showNotification(`AI generated description for '${envVar.key}'.`, 'success');
        } catch (e: any) {
            setError(`AI description generation failed: ${e.message}`);
            showNotification(`AI description generation failed: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [updateEnvVarMetadata, showNotification]);

    // Feature 56: AI - Suggest Value
    const aiSuggestValue = useCallback(async (envVar: EnvVar) => {
        setIsLoading(true);
        setError(null);
        try {
            const suggestedValue = await EnvAIService.suggestValue(envVar.key, envVar.metadata.description, profiles.find(p => p.id === activeProfileId)?.name || 'unknown');
            await updateEnvVar(envVar.id, 'value', suggestedValue);
            showNotification(`AI suggested value for '${envVar.key}'.`, 'success');
        } catch (e: any) {
            setError(`AI value suggestion failed: ${e.message}`);
            showNotification(`AI value suggestion failed: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [activeProfileId, profiles, updateEnvVar, showNotification]);

    // Feature 57: AI - Auto Categorize
    const aiAutoCategorize = useCallback(async (envVar: EnvVar) => {
        setIsLoading(true);
        setError(null);
        try {
            const { tags, description } = await EnvAIService.autoCategorize(envVar.key, envVar.value);
            await updateEnvVarMetadata(envVar.id, { tags: Array.from(new Set([...envVar.metadata.tags, ...tags])), description: description || envVar.metadata.description, source: 'ai-generated' });
            showNotification(`AI auto-categorized and updated description for '${envVar.key}'.`, 'success');
        } catch (e: any) {
            setError(`AI auto-categorization failed: ${e.message}`);
            showNotification(`AI auto-categorization failed: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [updateEnvVarMetadata, showNotification]);

    // Feature 58: AI - Suggest Compliance
    const aiSuggestCompliance = useCallback(async (envVar: EnvVar) => {
        setIsLoading(true);
        setError(null);
        try {
            const suggestions = await EnvAIService.suggestComplianceMeasures(envVar);
            showNotification(`AI Compliance Suggestions for '${envVar.key}': ${suggestions.join('; ')}`, 'info', 15000);
        } catch (e: any) {
            setError(`AI compliance suggestion failed: ${e.message}`);
            showNotification(`AI compliance suggestion failed: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showNotification]);

    // Feature 59: Run a full security scan
    const runSecurityScan = useCallback(async (): Promise<string[]> => {
        setIsLoading(true);
        setError(null);
        try {
            const issues = await EnvSecurityService.scanForVulnerabilities(_allMockEnvVars.filter(v => v.metadata.profileIds.includes(activeProfileId) && v.metadata.projectId === activeProjectId)); // Scan only for active profile
            if (issues.length > 0) {
                showNotification(`Security scan completed with ${issues.length} issues.`, 'warning', 10000 + issues.length * 1000);
            } else {
                showNotification('Security scan completed. No issues found.', 'success');
            }
            await EnvAuditService.log({
                id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUserId,
                action: 'SECURITY_SCAN', targetId: activeProjectId, targetType: 'EnvProject', details: { issuesFound: issues.length, profileId: activeProfileId }
            });
            return issues;
        } catch (e: any) {
            setError(`Security scan failed: ${e.message}`);
            showNotification(`Security scan failed: ${e.message}`, 'error');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [activeProjectId, activeProfileId, currentUserId, showNotification]);

    // Feature 60: Memoized context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        currentUserId,
        projects,
        profiles,
        envVars, // envVars is already filtered by active profile/project from useEffect
        activeProjectId,
        activeProfileId,
        isLoading,
        error,
        notification,
        addEnvVar,
        updateEnvVar,
        updateEnvVarMetadata,
        removeEnvVar,
        downloadEnvFile: downloadEnvFileForProfile,
        encryptEnvVar,
        decryptEnvVar,
        loadProfile,
        createProfile,
        updateProfile,
        deleteProfile,
        syncProfile,
        showNotification,
        clearNotification,
        auditLogs,
        versionHistory,
        fetchVersionHistory,
        rollbackEnvVar,
        searchEnvVars,
        importEnvVars,
        exportEnvVars,
        aiGenerateDescription,
        aiSuggestValue,
        aiAutoCategorize,
        aiSuggestCompliance,
        runSecurityScan,
    }), [
        currentUserId, projects, profiles, envVars, activeProjectId, activeProfileId, isLoading, error, notification, auditLogs, versionHistory,
        addEnvVar, updateEnvVar, updateEnvVarMetadata, removeEnvVar, downloadEnvFileForProfile, encryptEnvVar, decryptEnvVar,
        loadProfile, createProfile, updateProfile, deleteProfile, syncProfile, showNotification, clearNotification, fetchVersionHistory,
        rollbackEnvVar, searchEnvVars, importEnvVars, exportEnvVars, aiGenerateDescription, aiSuggestValue, aiAutoCategorize,
        aiSuggestCompliance, runSecurityScan
    ]);

    return (
        <EnvManagerContext.Provider value={contextValue}>
            {children}
        </EnvManagerContext.Provider>
    );
};

// Internal mock for 'all' env vars, typically this would come from a backend API
const _allMockEnvVars: EnvVar[] = [
    {
        id: 'vite-api-url-001', key: 'VITE_API_URL', value: 'https://api.example.com/v1',
        metadata: {
            type: 'string', description: 'Base URL for the primary API service.', tags: ['api', 'network'],
            sensitivity: 'low', source: 'manual', lastModifiedBy: 'admin_user_id', lastModifiedAt: '2024-03-01T10:00:00Z',
            createdAt: '2024-03-01T10:00:00Z', version: 1, profileIds: ['dev-001'], projectId: 'proj-001',
            encrypted: false, validationRules: ['required', 'url'], isDynamic: false, status: 'active'
        }
    },
    {
        id: 'vite-enable-feature-x-001', key: 'VITE_ENABLE_FEATURE_X', value: 'true',
        metadata: {
            type: 'boolean', description: 'Feature flag to enable/disable experimental feature X.', tags: ['feature-flag'],
            sensitivity: 'low', source: 'manual', lastModifiedBy: 'admin_user_id', lastModifiedAt: '2024-03-01T10:00:00Z',
            createdAt: '2024-03-01T10:00:00Z', version: 1, profileIds: ['dev-001'], projectId: 'proj-001',
            encrypted: false, validationRules: ['required'], isDynamic: false, status: 'active'
        }
    },
    {
        id: 'db-password-001', key: 'DATABASE_PASSWORD', value: 'superSecurePassword123!',
        metadata: {
            type: 'secret', description: 'Password for the primary database user.', tags: ['database', 'security'],
            sensitivity: 'critical', source: 'manual', lastModifiedBy: 'admin_user_id', lastModifiedAt: '2024-03-01T10:00:00Z',
            createdAt: '2024-03-01T10:00:00Z', version: 1, profileIds: ['dev-001', 'stg-001', 'prod-001'], projectId: 'proj-001',
            encrypted: false, validationRules: ['required', 'min:20'], isDynamic: false, status: 'active',
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
    },
    {
        id: 'aws-access-key-stg-001', key: 'AWS_ACCESS_KEY_ID', value: 'AKIAIOSFODNN7EXAMPLE',
        metadata: {
            type: 'secret', description: 'AWS Access Key for Staging environment.', tags: ['aws', 'security'],
            sensitivity: 'high', source: 'manual', lastModifiedBy: 'admin_user_id', lastModifiedAt: '2024-03-05T14:00:00Z',
            createdAt: '2024-03-05T14:00:00Z', version: 1, profileIds: ['stg-001'], projectId: 'proj-001',
            encrypted: true, encryptionAlgorithm: 'AES256', validationRules: ['required'], isDynamic: false, status: 'active'
        }
    },
    {
        id: 'feature-beta-test-001', key: 'FEATURE_BETA_TEST', value: 'false',
        metadata: {
            type: 'boolean', description: 'Enable beta features for internal testing.', tags: ['feature-flag', 'beta'],
            sensitivity: 'low', source: 'ai-generated', lastModifiedBy: 'admin_user_id', lastModifiedAt: '2024-03-10T08:00:00Z',
            createdAt: '2024-03-10T08:
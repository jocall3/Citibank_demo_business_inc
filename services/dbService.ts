// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// This file is the foundational data persistence layer for DevCore, a revolutionary AI-powered
// integrated development environment (IDE) and full-stack development platform. It encapsulates
// the core intellectual property of how DevCore manages and orchestrates vast amounts of
// project data, user information, AI models, and interactions with a multitude of
// external services. This patent-grade material describes innovative approaches to
// local-first data storage, offline capabilities, and resilient synchronization,
// critical for a commercial-grade application designed for global scalability and
// developer productivity. The DevCore application aims to redefine software development
// by seamlessly integrating AI assistance, advanced project management, and a comprehensive
// suite of development tools into a single, cohesive experience.
// The architectural design herein facilitates unparalleled user experience by ensuring
// responsiveness and availability even in intermittent network conditions, while robustly
// handling sensitive data and complex operational workflows.

// This persistence layer is built upon IndexedDB, chosen for its robust capabilities
// in client-side data storage, offering excellent performance, large data capacity,
// and offline support, which are paramount for DevCore's architecture. It ensures
// that even complex operations, such as AI model fine-tuning or large code generation
// tasks, can leverage local resources effectively, reducing reliance on constant
// cloud connectivity and enhancing user experience and data sovereignty. The comprehensive
// schema and associated operations represent a significant investment in creating a
// resilient, high-performance, and feature-rich development platform.

import { openDB, DBSchema } from 'idb';
import type { GeneratedFile, EncryptedData } from '../types.ts';

// --- Core Database Configuration ---
const DB_NAME = 'devcore-db';
// Incrementing DB_VERSION reflects significant architectural evolutions and new feature rollouts.
// Each version number represents a major milestone in DevCore's capabilities, adding new
// object stores and indexes to support an ever-growing set of sophisticated features.
// This phased upgrade mechanism ensures backward compatibility and graceful migration
// for existing users, a hallmark of commercial-grade software and a key intellectual property.
const DB_VERSION = 100; // Increased to allow for extensive new features and future expansions, simulating many years of development.

// --- Object Store Names - A Blueprint of DevCore's Data Architecture ---
// These constants define the names of the various object stores within the DevCore database.
// Each store is meticulously designed to hold specific types of data, reflecting the
// modular and scalable nature of DevCore's internal systems and its integrations
// with external services. The naming convention is explicit to ensure clarity and
// maintainability across a large codebase, supporting a "million-times longer" growth trajectory.
const FILES_STORE_NAME = 'generated-files'; // Stores output from AI code generation, build processes.
const VAULT_STORE_NAME = 'vault-data'; // Secure storage for sensitive configuration or user preferences.
const ENCRYPTED_TOKENS_STORE_NAME = 'encrypted-tokens'; // For API keys, OAuth tokens, etc., securely managed.

// --- NEW STORES FOR EXTENDED FUNCTIONALITY (VERSION 3 onwards) ---

// User & Account Management (Core to any commercial SaaS platform)
const USER_PROFILES_STORE_NAME = 'user-profiles'; // Comprehensive user data.
const API_KEYS_STORE_NAME = 'api-keys'; // User-specific API keys for external services.
const SESSION_DATA_STORE_NAME = 'session-data'; // Client-side session tokens/states for authentication persistence.
const PERMISSIONS_ROLES_STORE_NAME = 'permissions-roles'; // Granular access control data for team collaboration.
const AUDIT_LOGS_STORE_NAME = 'audit-logs'; // Critical for security, compliance, and debugging user actions.

// Project & Workspace Management (The heart of a development environment)
const PROJECTS_STORE_NAME = 'projects'; // Top-level project configurations and metadata.
const WORKSPACE_SETTINGS_STORE_NAME = 'workspace-settings'; // Per-workspace user preferences and customizations.
const CODE_SNIPPETS_STORE_NAME = 'code-snippets'; // Reusable code library, a major productivity accelerator.
const DOCUMENTATION_PAGES_STORE_NAME = 'documentation-pages'; // Integrated, rich-text documentation.
const ASSET_METADATA_STORE_NAME = 'asset-metadata'; // Details for media, design assets, and binary files.
const TEMPLATES_STORE_NAME = 'templates'; // Project and file templates for rapid scaffolding.
const WORKFLOW_DEFINITIONS_STORE_NAME = 'workflow-definitions'; // CI/CD, build pipelines, and automated task configurations.
const TASKS_STORE_NAME = 'tasks'; // Project management tasks for agile development.
const ISSUES_STORE_NAME = 'issues'; // Bug tracking and feature requests, a vital part of project health.
const RELEASE_NOTES_STORE_NAME = 'release-notes'; // Stores product release notes and version history.
const ROADMAP_ITEMS_STORE_NAME = 'roadmap-items'; // Planned features and strategic development initiatives.

// AI & Machine Learning Integrations (DevCore's cutting-edge differentiator and core IP)
const AI_MODEL_CONFIGS_STORE_NAME = 'ai-model-configs'; // Configurations for various AI models (LLMs, code-gen, refactoring).
const AI_TRAINING_DATA_METADATA_STORE_NAME = 'ai-training-data-metadata'; // References to training datasets for model transparency.
const AI_INFERENCE_LOGS_STORE_NAME = 'ai-inference-logs'; // Records of AI model predictions and interactions.
const AI_PROMPT_HISTORY_STORE_NAME = 'ai-prompt-history'; // User prompt interactions for refinement and reuse.
const AI_GENERATED_CONTENT_STORE_NAME = 'ai-generated-content'; // Cache for AI output (code, text, images).
const AI_FEEDBACK_STORE_NAME = 'ai-feedback'; // User feedback on AI performance, driving continuous improvement.
const EMBEDDINGS_CACHE_STORE_NAME = 'embeddings-cache'; // Vector embeddings for semantic search and code similarity.
const AI_AGENT_CONFIGS_STORE_NAME = 'ai-agent-configs'; // Configurations for autonomous AI development agents.
const AI_AGENT_TASK_QUEUE_STORE_NAME = 'ai-agent-task-queue'; // Queue for tasks assigned to AI agents.

// Billing & Subscription Management (Essential for commercial product operation)
const SUBSCRIPTION_PLANS_STORE_NAME = 'subscription-plans'; // Available subscription tiers and pricing.
const PAYMENT_METHODS_STORE_NAME = 'payment-methods'; // Stored payment instrument details (tokenized).
const INVOICE_RECORDS_NAME = 'invoice-records'; // Past invoices and billing statements.
const TRANSACTION_HISTORY_STORE_NAME = 'transaction-history'; // Payment transactions and status.
const COUPON_PROMO_CODES_STORE_NAME = 'coupon-promo-codes'; // Discount and promotional codes.
const USAGE_BASED_BILLING_METRICS_STORE_NAME = 'usage-billing-metrics'; // For tracking resource consumption (e.g., AI tokens, build minutes).
const CUSTOMER_ACCOUNTS_STORE_NAME = 'customer-accounts'; // Top-level customer account information.

// Analytics & Telemetry (Driving product insights and operational health)
const EVENT_LOGS_STORE_NAME = 'event-logs'; // User actions, system events for analytics.
const USAGE_METRICS_STORE_NAME = 'usage-metrics'; // Aggregate usage data for product insights.
const ERROR_REPORTS_STORE_NAME = 'error-reports'; // Client-side error capturing for stability.
const PERFORMANCE_DATA_STORE_NAME = 'performance-data'; // Latency, resource usage, and responsiveness metrics.
const USER_SURVEY_RESPONSES_STORE_NAME = 'user-survey-responses'; // Feedback from user surveys.

// Real-time & Collaboration (Powering team productivity)
const NOTIFICATION_PREFERENCES_STORE_NAME = 'notification-preferences'; // User notification settings.
const REALTIME_SYNC_STATES_STORE_NAME = 'realtime-sync-states'; // Collaboration pointers, draft statuses, presence indicators.
const COLLABORATION_SESSIONS_STORE_NAME = 'collaboration-sessions'; // Active session metadata for shared workspaces.
const CHAT_MESSAGES_STORE_NAME = 'chat-messages'; // Internal project communication logs.
const PRESENCE_INDICATORS_STORE_NAME = 'presence-indicators'; // Real-time user presence (online/offline, editing status).

// Security & Compliance (Enterprise-grade requirements)
const SECURITY_EVENT_LOGS_STORE_NAME = 'security-event-logs'; // Login attempts, data access, critical security events.
const COMPLIANCE_RECORDS_STORE_NAME = 'compliance-records'; // GDPR, CCPA, SOC2 related data and audit trails.
const DATA_RETENTION_POLICIES_STORE_NAME = 'data-retention-policies'; // Policy metadata for automated data lifecycle management.
const THREAT_INTELLIGENCE_CACHE_STORE_NAME = 'threat-intelligence-cache'; // External threat data for proactive security.
const ENCRYPTION_KEYS_STORE_NAME = 'encryption-keys'; // Local encryption keys for client-side data.

// Third-Party Integrations (Simulated/Cached Data - DevCore's ecosystem IP)
// These stores demonstrate how DevCore maintains a local cache of relevant data
// from external services, enhancing performance, offline usability, and reducing
// direct API dependency for common operations. This is crucial for a responsive IDE.
const GITHUB_SYNC_STATUS_STORE_NAME = 'github-sync-status'; // Status of GitHub repository syncs.
const CLOUD_PROVIDER_CREDENTIAL_METADATA_STORE_NAME = 'cloud-provider-cred-metadata'; // Encrypted references to cloud credentials (AWS, Azure, GCP).
const SLACK_INTEGRATION_CONFIGS_STORE_NAME = 'slack-integration-configs'; // Slack webhook/app configurations.
const SALESFORCE_CRM_RECORDS_STORE_NAME = 'salesforce-crm-records'; // Cached CRM data for contextual awareness.
const EMAIL_MARKETING_CAMPAIGNS_STORE_NAME = 'email-marketing-campaigns'; // Mailchimp/SendGrid campaign data for product communication.
const PAYMENT_GATEWAY_WEBHOOKS_STORE_NAME = 'payment-gateway-webhooks'; // Incoming payment notifications (Stripe, PayPal).
const SMS_GATEWAY_LOGS_STORE_NAME = 'sms-gateway-logs'; // Twilio/Nexmo SMS history for notifications.
const BLOCKCHAIN_TRANSACTION_RECORDS_STORE_NAME = 'blockchain-transaction-records'; // For Web3-enabled features or immutable logging.
const CDN_CACHE_INVALIDATION_RECORDS_STORE_NAME = 'cdn-invalidation-records'; // For asset delivery optimization (Cloudflare, CloudFront).
const JIRA_INTEGRATION_DATA_STORE_NAME = 'jira-integration-data'; // Cached data from Jira for issue tracking integration.
const GOOGLE_DRIVE_SYNC_STORE_NAME = 'google-drive-sync'; // Status of Google Drive file syncs.
const AWS_LAMBDA_CONFIGS_STORE_NAME = 'aws-lambda-configs'; // Cached AWS Lambda function configurations.
const AZURE_FUNCTIONS_CONFIGS_STORE_NAME = 'azure-functions-configs'; // Cached Azure Functions configurations.
const DOCKER_IMAGE_CACHE_STORE_NAME = 'docker-image-cache'; // Metadata for locally available Docker images.

// Internationalization (i18n) (Global market readiness)
const LOCALIZATION_STRINGS_STORE_NAME = 'localization-strings'; // Multilingual text assets.
const USER_LANGUAGE_PREFERENCES_STORE_NAME = 'user-language-preferences'; // User-selected language settings.

// DevCore Specific Advanced Features (Deep IP for a competitive edge)
const OPTIMIZATION_STRATEGIES_STORE_NAME = 'optimization-strategies'; // AI-driven code optimization rules and patterns.
const COMPILER_SETTINGS_STORE_NAME = 'compiler-settings'; // Project-specific compiler configurations (TypeScript, Babel, Webpack).
const RUNTIME_ENVIRONMENTS_STORE_NAME = 'runtime-environments'; // Docker/VM configs for execution environments.
const CUSTOM_COMPONENT_LIBRARY_STORE_NAME = 'custom-component-library'; // User-defined UI components and reusable code.
const DATA_SCHEMA_DEFINITIONS_STORE_NAME = 'data-schema-definitions'; // GraphQL/REST/JSON schema definitions.
const RESOURCE_ALLOCATION_PLANS_STORE_NAME = 'resource-allocation-plans'; // Cloud resource management plans.
const METRIC_DASHBOARD_CONFIGS_STORE_NAME = 'metric-dashboard-configs'; // Custom dashboard layouts for monitoring.
const GEOLOCATION_DATA_CACHE_STORE_NAME = 'geolocation-data-cache'; // User/project location data for geo-aware features.
const OFFLINE_QUEUE_STORE_NAME = 'offline-queue'; // Operations queued for synchronization when online.
const SEARCH_INDEX_CACHE_STORE_NAME = 'search-index-cache'; // Local cache for faster, offline-enabled search.
const COMMAND_PALETTE_HISTORY_STORE_NAME = 'command-palette-history'; // User's command palette usage history.
const EXTENSION_CONFIGS_STORE_NAME = 'extension-configs'; // Configurations for DevCore extensions.
const KEYBINDING_PROFILES_STORE_NAME = 'keybinding-profiles'; // User-customized keybinding profiles.
const AI_ASSISTANT_CONVERSATIONS_STORE_NAME = 'ai-assistant-conversations'; // History of conversations with AI assistant.
const INFRASTRUCTURE_TEMPLATES_STORE_NAME = 'infrastructure-templates'; // Terraform/CloudFormation templates.
const ENVIRONMENT_VARIABLES_STORE_NAME = 'environment-variables'; // Project and user-specific environment variables.
const CUSTOM_TEST_CASES_STORE_NAME = 'custom-test-cases'; // User-defined unit and integration test cases.

// Define specific types for new stores for better type safety and intellectual property clarity.
// These types are defined inline because the 'types.ts' file cannot be modified directly due to instructions.

/**
 * @typedef UserProfile
 * Represents a comprehensive user profile within DevCore. This includes personal information,
 * account settings, and integration details. This structure is a core IP asset, enabling
 * personalized experiences and granular access control across the platform.
 * @property {string} id - Unique user identifier (e.g., UUID).
 * @property {string} email - User's primary email address.
 * @property {string} username - Display name or unique username.
 * @property {string} firstName - User's first name.
 * @property {string} lastName - User's last name.
 * @property {string} avatarUrl - URL to user's profile picture.
 * @property {string[]} roles - Array of roles assigned to the user (e.g., 'admin', 'developer', 'viewer').
 * @property {string[]} permissions - Direct permissions granted to the user.
 * @property {string} defaultProjectId - The ID of the user's default active project.
 * @property {object} preferences - JSON object for arbitrary user preferences (theme, editor settings).
 * @property {Date} createdAt - Timestamp of account creation.
 * @property {Date} updatedAt - Timestamp of last profile update.
 * @property {string} lastLoginIp - IP address of the last successful login.
 */
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  roles: string[];
  permissions: string[];
  defaultProjectId?: string;
  preferences: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastLoginIp?: string;
}

/**
 * @typedef ApiKey
 * Represents an API key for third-party service integration or for programmatic access
 * to DevCore itself. Critical for secure interaction with external ecosystems.
 * @property {string} id - Unique identifier for the API key (e.g., 'sk-devcore-xyz').
 * @property {string} userId - The ID of the user who owns this API key.
 * @property {string} serviceName - Name of the external service this key is for (e.g., 'GitHub', 'Stripe').
 * @property {string} keyHash - Hashed version of the API key (never store raw key client-side).
 * @property {string} description - User-provided description for the key's purpose.
 * @property {string[]} scopes - Array of permissions associated with the key.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} expiresAt - Expiration timestamp (optional).
 * @property {Date} lastUsedAt - Last usage timestamp.
 * @property {boolean} isActive - Whether the key is currently active.
 */
export interface ApiKey {
  id: string;
  userId: string;
  serviceName: string;
  keyHash: string; // Store hash, not actual key, client-side.
  description?: string;
  scopes: string[];
  createdAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
  isActive: boolean;
}

/**
 * @typedef SessionData
 * Stores transient session-related information, vital for maintaining user state and security.
 * @property {string} sessionId - Unique ID for the current session.
 * @property {string} userId - ID of the logged-in user.
 * @property {Date} loginTime - When the session started.
 * @property {Date} lastActivityTime - Last user interaction.
 * @property {string} ipAddress - IP address from which the session originated.
 * @property {string} userAgent - Browser user agent string.
 * @property {string} token - Session token (may be encrypted or a reference to server-side token).
 * @property {boolean} rememberMe - Whether "remember me" was selected.
 */
export interface SessionData {
  sessionId: string;
  userId: string;
  loginTime: Date;
  lastActivityTime: Date;
  ipAddress?: string;
  userAgent?: string;
  token: string;
  rememberMe?: boolean;
}

/**
 * @typedef PermissionRole
 * Defines roles and their associated permissions within the DevCore platform.
 * Supports fine-grained access control, a critical feature for commercial multi-user applications.
 * @property {string} roleName - Name of the role (e.g., 'admin', 'project_editor').
 * @property {string[]} permissions - Array of permission strings (e.g., 'project:read', 'file:write').
 * @property {string} description - Description of the role.
 */
export interface PermissionRole {
  roleName: string;
  permissions: string[];
  description?: string;
}

/**
 * @typedef AuditLogEntry
 * Records significant actions performed by users or the system. Essential for security, compliance,
 * and debugging in a commercial environment.
 * @property {string} id - Unique log entry ID.
 * @property {string} userId - ID of the user who performed the action (or 'system').
 * @property {string} action - Description of the action (e.g., 'project_created', 'file_deleted').
 * @property {string} entityType - Type of entity affected (e.g., 'Project', 'File').
 * @property {string} entityId - ID of the affected entity.
 * @property {Date} timestamp - When the action occurred.
 * @property {string} ipAddress - IP address from where the action was initiated.
 * @property {object} details - Additional JSON details about the action.
 */
export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: Date;
  ipAddress?: string;
  details?: Record<string, any>;
}

/**
 * @typedef Project
 * Represents a top-level development project within DevCore. This is a central organizing unit
 * for all code, assets, configurations, and collaborative activities. This structure is a fundamental
 * piece of DevCore's intellectual property, enabling efficient project management.
 * @property {string} id - Unique project identifier.
 * @property {string} name - Name of the project.
 * @property {string} description - Project description.
 * @property {string} ownerId - ID of the project owner.
 * @property {string[]} memberIds - Array of user IDs who are members.
 * @property {Date} createdAt - Project creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 * @property {Record<string, any>} config - JSON object for project-specific configurations (e.g., build tools, frameworks).
 * @property {string} repositoryUrl - URL to the associated Git repository (if any).
 * @property {string} deploymentUrl - URL to the deployed application (if any).
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
  config: Record<string, any>;
  repositoryUrl?: string;
  deploymentUrl?: string;
}

/**
 * @typedef WorkspaceSettings
 * Stores user-specific settings for a particular workspace or project,
 * enabling personalized development environments. This customization capability is a core UX IP.
 * @property {string} id - Unique ID (e.g., userId_projectId).
 * @property {string} userId - User ID.
 * @property {string} projectId - Project ID.
 * @property {Record<string, any>} settings - JSON object for editor themes, layout, extensions, etc.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface WorkspaceSettings {
  id: string;
  userId: string;
  projectId: string;
  settings: Record<string, any>;
  updatedAt: Date;
}

/**
 * @typedef CodeSnippet
 * Represents a reusable code snippet. A critical IP asset enabling developers to
 * quickly insert common patterns or AI-generated boilerplate, significantly boosting productivity.
 * @property {string} id - Unique snippet ID.
 * @property {string} userId - Owner of the snippet.
 * @property {string} name - Name of the snippet.
 * @property {string} content - The actual code snippet.
 * @property {string} language - Programming language (e.g., 'typescript', 'javascript', 'python').
 * @property {string[]} tags - Keywords for categorization.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 * @property {boolean} isPublic - Whether the snippet is publicly shareable.
 */
export interface CodeSnippet {
  id: string;
  userId: string;
  name: string;
  content: string;
  language: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

/**
 * @typedef DocumentationPage
 * Represents an internal documentation page, enabling integrated project knowledge bases.
 * This ensures that project-specific documentation is always available within the DevCore IDE.
 * @property {string} id - Unique page ID.
 * @property {string} projectId - Project it belongs to.
 * @property {string} title - Page title.
 * @property {string} slug - URL-friendly identifier.
 * @property {string} content - Markdown or rich text content.
 * @property {string} authorId - User who created the page.
 * @property {string[]} tags - Keywords.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 * @property {string[]} keywords - Searchable keywords for the page.
 */
export interface DocumentationPage {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  keywords: string[];
}

/**
 * @typedef AssetMetadata
 * Metadata for digital assets (images, videos, fonts, etc.) used in projects.
 * This facilitates organization, search, and versioning of non-code resources.
 * @property {string} id - Unique asset ID.
 * @property {string} projectId - Project it belongs to.
 * @property {string} fileName - Original file name.
 * @property {string} mimeType - MIME type (e.g., 'image/png').
 * @property {string} storagePath - Path in cloud storage (e.g., S3 URL).
 * @property {number} size - File size in bytes.
 * @property {string} uploadedBy - User who uploaded.
 * @property {Date} uploadedAt - Upload timestamp.
 * @property {Record<string, any>} customProps - Arbitrary custom properties.
 */
export interface AssetMetadata {
  id: string;
  projectId: string;
  fileName: string;
  mimeType: string;
  storagePath: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  customProps?: Record<string, any>;
}

/**
 * @typedef Template
 * Defines project or file templates. Speeds up development and ensures consistency
 * across projects and teams, a core IP for developer efficiency.
 * @property {string} id - Unique template ID.
 * @property {string} name - Template name.
 * @property {string} type - 'project' or 'file'.
 * @property {string} description - Template description.
 * @property {string} content - Template content (e.g., serialized JSON representing file structure or base64 of a zip).
 * @property {string[]} tags - Categorization tags.
 * @property {string} createdBy - User who created it.
 * @property {Date} createdAt - Creation timestamp.
 */
export interface Template {
  id: string;
  name: string;
  type: 'project' | 'file';
  description: string;
  content: string; // Could be a serialized JSON representing file structure or base64 of a zip.
  tags: string[];
  createdBy: string;
  createdAt: Date;
}

/**
 * @typedef WorkflowDefinition
 * Represents a CI/CD pipeline, build process, or automated task workflow.
 * Core IP for automating development operations within DevCore, supporting modern DevOps practices.
 * @property {string} id - Unique workflow ID.
 * @property {string} projectId - Project it belongs to.
 * @property {string} name - Workflow name.
 * @property {string} definition - YAML/JSON definition of the workflow steps.
 * @property {string} trigger - Event that triggers the workflow (e.g., 'push', 'manual').
 * @property {string} status - Current status ('active', 'inactive').
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface WorkflowDefinition {
  id: string;
  projectId: string;
  name: string;
  definition: string; // e.g., YAML string
  trigger: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef Task
 * Represents a project task for project management. Part of DevCore's integrated project tracking.
 * @property {string} id - Unique task ID.
 * @property {string} projectId - Project it belongs to.
 * @property {string} title - Task title.
 * @property {string} description - Detailed description.
 * @property {string} assigneeId - User assigned to the task.
 * @property {string} reporterId - User who created the task.
 * @property {string} status - 'todo', 'in-progress', 'done', 'blocked'.
 * @property {string} priority - 'low', 'medium', 'high'.
 * @property {Date} dueDate - Optional due date.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  reporterId: string;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef Issue
 * Represents a bug, feature request, or other project issue. Supports comprehensive issue tracking.
 * @property {string} id - Unique issue ID.
 * @property {string} projectId - Project it belongs to.
 * @property {string} title - Issue title.
 * @property {string} description - Detailed description.
 * @property {string} type - 'bug', 'feature', 'enhancement'.
 * @property {string} status - 'open', 'in-review', 'closed'.
 * @property {string[]} labels - Categorization labels.
 * @property {string} reporterId - User who reported the issue.
 * @property {string} assigneeId - User assigned to resolve.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface Issue {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  type: 'bug' | 'feature' | 'enhancement';
  status: 'open' | 'in-review' | 'closed';
  labels: string[];
  reporterId: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef ReleaseNote
 * Stores product release notes, providing a historical overview of features and fixes.
 * @property {string} id - Unique release note ID.
 * @property {string} version - Software version (e.g., '1.0.0').
 * @property {string} title - Release title.
 * @property {string} content - Markdown content of the release notes.
 * @property {Date} releaseDate - Date of release.
 * @property {string[]} features - List of new features.
 * @property {string[]} bugFixes - List of bug fixes.
 */
export interface ReleaseNote {
  id: string;
  version: string;
  title: string;
  content: string;
  releaseDate: Date;
  features: string[];
  bugFixes: string[];
}

/**
 * @typedef RoadmapItem
 * Represents a planned feature or strategic initiative in DevCore's product roadmap.
 * @property {string} id - Unique roadmap item ID.
 * @property {string} title - Title of the roadmap item.
 * @property {string} description - Detailed description.
 * @property {string} status - 'planned', 'in-progress', 'completed', 'on-hold'.
 * @property {Date} targetDate - Target completion date (optional).
 * @property {string[]} tags - Categorization tags.
 * @property {string} createdBy - User who created the item.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  targetDate?: Date;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef AiModelConfig
 * Configuration for an AI model integrated into DevCore. This IP enables
 * intelligent code generation, refactoring, and other AI-powered features, making DevCore truly smart.
 * @property {string} id - Unique model config ID.
 * @property {string} name - Model name (e.g., 'devcore-code-gen-v3').
 * @property {string} type - Model type (e.g., 'LLM', 'code_completion', 'image_gen').
 * @property {string} provider - 'openai', 'anthropic', 'huggingface', 'local'.
 * @property {Record<string, any>} settings - JSON object for model-specific parameters (e.g., temperature, max_tokens).
 * @property {boolean} isActive - Whether this config is currently active.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface AiModelConfig {
  id: string;
  name: string;
  type: string;
  provider: string;
  settings: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef AiTrainingDataMetadata
 * References and metadata for datasets used to train or fine-tune AI models.
 * Essential for managing AI model lifecycle and ensuring data governance.
 * @property {string} id - Unique ID.
 * @property {string} modelId - Associated AI model config ID.
 * @property {string} name - Dataset name.
 * @property {string} sourceType - 'local_files', 's3_bucket', 'huggingface_dataset'.
 * @property {string} sourcePath - Path or URL to the dataset.
 * @property {number} recordCount - Number of records in the dataset.
 * @property {string[]} tags - Categorization tags.
 * @property {Date} uploadedAt - Upload timestamp.
 */
export interface AiTrainingDataMetadata {
  id: string;
  modelId: string;
  name: string;
  sourceType: string;
  sourcePath: string;
  recordCount: number;
  tags: string[];
  uploadedAt: Date;
}

/**
 * @typedef AiInferenceLog
 * Logs of AI model inferences, including prompts, responses, and performance metrics.
 * Valuable for auditing, debugging, and improving AI integration. A key part of DevCore's explainable AI strategy.
 * @property {string} id - Unique log ID.
 * @property {string} modelId - AI model used.
 * @property {string} userId - User who initiated the inference.
 * @property {string} projectId - Project context.
 * @property {string} prompt - Input prompt.
 * @property {string} response - AI-generated response.
 * @property {number} latencyMs - Time taken for inference.
 * @property {Date} timestamp - Inference timestamp.
 * @property {string} status - 'success', 'failure'.
 * @property {number} tokenCount - Number of tokens processed.
 */
export interface AiInferenceLog {
  id: string;
  modelId: string;
  userId: string;
  projectId?: string;
  prompt: string;
  response: string;
  latencyMs: number;
  timestamp: Date;
  status: 'success' | 'failure';
  tokenCount: number;
}

/**
 * @typedef AiPromptHistory
 * Stores user-generated prompts for AI models, enabling reuse and refinement.
 * This is a key feature for maximizing the utility of DevCore's AI capabilities and prompt engineering.
 * @property {string} id - Unique ID.
 * @property {string} userId - User ID.
 * @property {string} prompt - The prompt text.
 * @property {string} modelId - Model it was used with.
 * @property {number} usageCount - How many times this prompt has been used.
 * @property {Date} lastUsedAt - Last usage timestamp.
 * @property {boolean} isFavorite - User marked as favorite.
 */
export interface AiPromptHistory {
  id: string;
  userId: string;
  prompt: string;
  modelId?: string;
  usageCount: number;
  lastUsedAt: Date;
  isFavorite: boolean;
}

/**
 * @typedef AiGeneratedContent
 * Cache for content generated by AI, such as code, text, or images. Improves performance
 * and provides a history of AI contributions to projects.
 * @property {string} id - Unique ID.
 * @property {string} userId - User who requested generation.
 * @property {string} projectId - Project context.
 * @property {string} type - 'code', 'text', 'image', 'config'.
 * @property {string} content - The actual generated content (e.g., code string, URL to image).
 * @property {string} sourcePromptId - Reference to the prompt history.
 * @property {Date} createdAt - Generation timestamp.
 * @property {boolean} isAccepted - Whether the user accepted the generated content.
 */
export interface AiGeneratedContent {
  id: string;
  userId: string;
  projectId?: string;
  type: 'code' | 'text' | 'image' | 'config';
  content: string;
  sourcePromptId?: string;
  createdAt: Date;
  isAccepted: boolean;
}

/**
 * @typedef AiFeedback
 * Stores user feedback on AI-generated content or model performance.
 * Crucial for continuous improvement of DevCore's AI capabilities and human-in-the-loop learning.
 * @property {string} id - Unique feedback ID.
 * @property {string} userId - User providing feedback.
 * @property {string} aiContentId - ID of the AI-generated content being reviewed.
 * @property {number} rating - Numerical rating (e.g., 1-5 stars).
 * @property {string} comments - Textual feedback.
 * @property {Date} createdAt - Feedback timestamp.
 * @property {string} feedbackType - 'accuracy', 'relevance', 'safety', 'coherence'.
 */
export interface AiFeedback {
  id: string;
  userId: string;
  aiContentId: string;
  rating?: number;
  comments: string;
  createdAt: Date;
  feedbackType: string;
}

/**
 * @typedef EmbeddingCache
 * Stores vector embeddings generated for code, documentation, or other text.
 * Essential for semantic search, code similarity, and AI-driven content recommendations,
 * a core IP for DevCore's advanced code intelligence.
 * @property {string} id - Unique ID (e.g., hash of source content).
 * @property {string} sourceType - 'code_snippet', 'documentation_page', 'generated_file'.
 * @property {string} sourceId - ID of the source content.
 * @property {number[]} embedding - The vector embedding array.
 * @property {Date} createdAt - Creation timestamp.
 */
export interface EmbeddingCache {
  id: string;
  sourceType: string;
  sourceId: string;
  embedding: number[];
  createdAt: Date;
}

/**
 * @typedef AiAgentConfig
 * Configuration for an autonomous AI agent within DevCore. This IP enables complex,
 * multi-step AI-driven development tasks, pushing the frontier of AI in software engineering.
 * @property {string} id - Unique agent config ID.
 * @property {string} name - Agent name (e.g., 'CodeRefactorAgent', 'BugFixingAgent').
 * @property {string} modelId - ID of the primary AI model used by this agent.
 * @property {string} description - Description of the agent's capabilities.
 * @property {Record<string, any>} capabilities - JSON object defining tools/APIs the agent can use.
 * @property {boolean} isActive - Whether this agent configuration is currently active.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface AiAgentConfig {
  id: string;
  name: string;
  modelId: string;
  description: string;
  capabilities: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef AiAgentTaskQueueItem
 * Represents a task queued for an AI agent to process.
 * @property {string} id - Unique task ID.
 * @property {string} agentConfigId - ID of the AI agent configuration to use.
 * @property {string} projectId - Project context for the task.
 * @property {string} taskType - 'code_refactor', 'bug_fix', 'feature_gen'.
 * @property {Record<string, any>} payload - Input data for the AI agent (e.g., file content, issue details).
 * @property {string} status - 'queued', 'in_progress', 'completed', 'failed'.
 * @property {string} initiatedByUserId - User who initiated the task.
 * @property {Date} queuedAt - Timestamp when the task was added to the queue.
 * @property {Date} completedAt - Timestamp when the task was completed (optional).
 * @property {string} resultData - Output or log from the AI agent's execution.
 * @property {string} errorMessage - Error message if the task failed.
 */
export interface AiAgentTaskQueueItem {
  id: string;
  agentConfigId: string;
  projectId: string;
  taskType: string;
  payload: Record<string, any>;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  initiatedByUserId: string;
  queuedAt: Date;
  completedAt?: Date;
  resultData?: string; // Could be a JSON string of output.
  errorMessage?: string;
}

/**
 * @typedef SubscriptionPlan
 * Details of subscription tiers offered by DevCore. A foundational IP for the business model.
 * @property {string} id - Unique plan ID.
 * @property {string} name - Plan name (e.g., 'Free', 'Pro', 'Enterprise').
 * @property {string} description - Plan description.
 * @property {number} pricePerMonth - Monthly price.
 * @property {number} pricePerYear - Annual price.
 * @property {string[]} features - List of features included.
 * @property {number} maxProjects - Max number of projects allowed.
 * @property {number} maxMembers - Max team members.
 * @property {number} storageLimitGb - Storage limit.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  pricePerMonth: number;
  pricePerYear: number;
  features: string[];
  maxProjects: number;
  maxMembers: number;
  storageLimitGb: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef PaymentMethod
 * Represents a tokenized payment method (e.g., credit card, PayPal).
 * Never stores raw card details, only secure tokens.
 * @property {string} id - Unique payment method ID (from payment processor).
 * @property {string} userId - User ID this method belongs to.
 * @property {string} type - 'card', 'paypal', 'bank_transfer'.
 * @property {string} last4 - Last 4 digits of card/account.
 * @property {string} brand - Card brand (e.g., 'Visa', 'Mastercard').
 * @property {string} expiryMonth - Card expiry month.
 * @property {string} expiryYear - Card expiry year.
 * @property {boolean} isDefault - Whether this is the default payment method.
 * @property {Date} createdAt - Creation timestamp.
 */
export interface PaymentMethod {
  id: string;
  userId: string;
  type: string;
  last4: string;
  brand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  isDefault: boolean;
  createdAt: Date;
}

/**
 * @typedef InvoiceRecord
 * Stores details of past invoices.
 * @property {string} id - Unique invoice ID.
 * @property {string} userId - User ID.
 * @property {string} subscriptionId - Associated subscription.
 * @property {number} amount - Total invoice amount.
 * @property {string} currency - Currency code (e.g., 'USD').
 * @property {Date} issueDate - Date invoice was issued.
 * @property {Date} dueDate - Date payment is due.
 * @property {string} status - 'paid', 'unpaid', 'void'.
 * @property {string} pdfUrl - URL to downloadable PDF invoice.
 */
export interface InvoiceRecord {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  issueDate: Date;
  dueDate: Date;
  status: 'paid' | 'unpaid' | 'void';
  pdfUrl?: string;
}

/**
 * @typedef TransactionHistoryEntry
 * Records individual payment transactions (successful or failed).
 * @property {string} id - Unique transaction ID.
 * @property {string} userId - User ID.
 * @property {string} paymentMethodId - Payment method used.
 * @property {number} amount - Transaction amount.
 * @property {string} currency - Currency.
 * @property {Date} timestamp - Transaction timestamp.
 * @property {string} status - 'success', 'failed', 'pending'.
 * @property {string} processorTxnId - ID from payment processor.
 * @property {string} description - Description of the transaction.
 */
export interface TransactionHistoryEntry {
  id: string;
  userId: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
  processorTxnId?: string;
  description: string;
}

/**
 * @typedef CouponPromoCode
 * Stores information about discount and promotional codes.
 * @property {string} code - The actual coupon code.
 * @property {string} description - Description of the promotion.
 * @property {string} type - 'percentage_discount', 'fixed_amount_discount'.
 * @property {number} value - Discount value (e.g., 0.1 for 10%, or 10 for $10).
 * @property {number} maxUses - Maximum number of times the code can be used.
 * @property {number} currentUses - How many times it has been used.
 * @property {Date} expiresAt - Expiration date.
 * @property {boolean} isActive - Whether the code is active.
 */
export interface CouponPromoCode {
  code: string;
  description: string;
  type: 'percentage_discount' | 'fixed_amount_discount';
  value: number;
  maxUses?: number;
  currentUses: number;
  expiresAt?: Date;
  isActive: boolean;
}

/**
 * @typedef UsageBasedBillingMetric
 * Stores metrics for usage-based billing, such as AI token consumption, storage, or build minutes.
 * A key IP for flexible and scalable pricing models for DevCore's advanced features.
 * @property {string} id - Unique metric ID.
 * @property {string} userId - User ID.
 * @property {string} metricName - Name of the metric (e.g., 'ai_tokens_consumed', 'storage_gb', 'build_minutes').
 * @property {number} value - The recorded value for the metric.
 * @property {Date} timestamp - When the usage was recorded.
 * @property {string} projectId - Optional project context.
 */
export interface UsageBasedBillingMetric {
  id: string;
  userId: string;
  metricName: string;
  value: number;
  timestamp: Date;
  projectId?: string;
}

/**
 * @typedef CustomerAccount
 * Stores top-level customer account information, potentially aggregating multiple user profiles.
 * This is for enterprise-level account management.
 * @property {string} id - Unique customer account ID.
 * @property {string} name - Account name (e.g., 'Acme Corp').
 * @property {string} planId - Current subscription plan ID.
 * @property {string[]} userIds - IDs of users associated with this account.
 * @property {Record<string, any>} billingInfo - Billing contact info (non-sensitive).
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface CustomerAccount {
  id: string;
  name: string;
  planId: string;
  userIds: string[];
  billingInfo: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef EventLog
 * Generic event log for tracking user interactions and system events.
 * Fundamental for analytics, debugging, and understanding user behavior.
 * @property {string} id - Unique event ID.
 * @property {string} userId - User ID (or 'system').
 * @property {string} eventName - Name of the event (e.g., 'file_opened', 'button_clicked').
 * @property {Date} timestamp - Event timestamp.
 * @property {Record<string, any>} context - JSON object with additional event context (e.g., file path, project ID).
 */
export interface EventLog {
  id: string;
  userId: string;
  eventName: string;
  timestamp: Date;
  context: Record<string, any>;
}

/**
 * @typedef UsageMetric
 * Aggregated usage metrics for reporting and analytics.
 * @property {string} id - Unique metric ID (e.g., 'daily_active_users_YYYY-MM-DD').
 * @property {string} metricName - Name of the metric (e.g., 'daily_active_users', 'total_files_generated').
 * @property {number} value - Metric value.
 * @property {Date} date - Date the metric applies to.
 * @property {string} granularity - 'daily', 'weekly', 'monthly'.
 */
export interface UsageMetric {
  id: string;
  metricName: string;
  value: number;
  date: Date;
  granularity: 'daily' | 'weekly' | 'monthly';
}

/**
 * @typedef ErrorReport
 * Records client-side errors, crucial for maintaining application stability and reliability.
 * @property {string} id - Unique error ID.
 * @property {string} userId - User ID (if logged in).
 * @property {string} message - Error message.
 * @property {string} stack - Stack trace.
 * @property {Date} timestamp - When error occurred.
 * @property {string} severity - 'error', 'warning', 'info'.
 * @property {Record<string, any>} context - Additional context (e.g., component, browser info).
 */
export interface ErrorReport {
  id: string;
  userId?: string;
  message: string;
  stack?: string;
  timestamp: Date;
  severity: 'error' | 'warning' | 'info';
  context?: Record<string, any>;
}

/**
 * @typedef PerformanceData
 * Stores performance-related metrics (e.g., load times, rendering frames per second).
 * @property {string} id - Unique ID.
 * @property {string} metricName - 'page_load_time', 'editor_render_fps', 'api_latency'.
 * @property {number} value - Metric value.
 * @property {Date} timestamp - When recorded.
 * @property {string} userId - User ID.
 * @property {string} context - URL, component name, etc.
 */
export interface PerformanceData {
  id: string;
  metricName: string;
  value: number;
  timestamp: Date;
  userId?: string;
  context?: string;
}

/**
 * @typedef UserSurveyResponse
 * Stores user feedback from surveys, valuable for product development.
 * @property {string} id - Unique response ID.
 * @property {string} surveyId - ID of the survey.
 * @property {string} userId - User who responded.
 * @property {Record<string, any>} responses - JSON object of survey answers.
 * @property {Date} submittedAt - Submission timestamp.
 */
export interface UserSurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  responses: Record<string, any>;
  submittedAt: Date;
}

/**
 * @typedef NotificationPreference
 * User-specific notification settings.
 * @property {string} userId - User ID.
 * @property {string} type - 'email', 'in_app', 'push'.
 * @property {Record<string, boolean>} settings - Key-value pair for notification types (e.g., 'project_updates': true).
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface NotificationPreference {
  userId: string;
  type: 'email' | 'in_app' | 'push';
  settings: Record<string, boolean>;
  updatedAt: Date;
}

/**
 * @typedef RealtimeSyncState
 * Represents the current state for real-time collaboration.
 * @property {string} id - Unique ID (e.g., 'projectId_resourceId').
 * @property {string} projectId - Project ID.
 * @property {string} resourceType - 'file', 'doc', 'task'.
 * @property {string} resourceId - ID of the resource being collaborated on.
 * @property {string[]} activeUsers - IDs of users currently collaborating.
 * @property {Record<string, any>} cursorPositions - User cursor positions in a document.
 * @property {string} lastKnownStateHash - Hash of the last synchronized state.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface RealtimeSyncState {
  id: string;
  projectId: string;
  resourceType: string;
  resourceId: string;
  activeUsers: string[];
  cursorPositions?: Record<string, any>; // { userId: { line: number, column: number } }
  lastKnownStateHash: string;
  updatedAt: Date;
}

/**
 * @typedef CollaborationSession
 * Metadata about active collaboration sessions.
 * @property {string} id - Unique session ID.
 * @property {string} projectId - Project ID.
 * @property {string} hostUserId - User who initiated the session.
 * @property {string[]} participantUserIds - Other participants.
 * @property {Date} startTime - Session start time.
 * @property {Date} endTime - Session end time (optional).
 * @property {string[]} sharedResources - IDs of files/documents being shared.
 * @property {string} status - 'active', 'ended'.
 */
export interface CollaborationSession {
  id: string;
  projectId: string;
  hostUserId: string;
  participantUserIds: string[];
  startTime: Date;
  endTime?: Date;
  sharedResources: string[];
  status: 'active' | 'ended';
}

/**
 * @typedef ChatMessage
 * Stores internal project chat messages for collaboration.
 * @property {string} id - Unique message ID.
 * @property {string} projectId - Project ID.
 * @property {string} senderId - User ID of the sender.
 * @property {string} content - Message content.
 * @property {Date} timestamp - Message timestamp.
 * @property {string[]} recipients - User IDs of direct recipients (for private messages).
 * @property {string} channelId - Channel ID for group chats.
 */
export interface ChatMessage {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  recipients?: string[];
  channelId?: string;
}

/**
 * @typedef PresenceIndicator
 * Stores real-time presence information for users within a project or resource.
 * @property {string} id - Unique ID (e.g., userId_projectId_resourceId).
 * @property {string} userId - User ID.
 * @property {string} projectId - Project ID.
 * @property {string} resourceId - ID of the resource user is viewing/editing.
 * @property {string} status - 'online', 'idle', 'editing'.
 * @property {Date} lastSeenAt - Last timestamp of activity.
 */
export interface PresenceIndicator {
  id: string;
  userId: string;
  projectId: string;
  resourceId: string;
  status: 'online' | 'idle' | 'editing';
  lastSeenAt: Date;
}

/**
 * @typedef SecurityEventLog
 * Detailed logs of security-critical events, like failed logins, permission changes,
 * and data export attempts. Indispensable for security auditing and incident response.
 * @property {string} id - Unique log ID.
 * @property {string} userId - User ID involved (if known).
 * @property {string} eventType - 'login_success', 'login_failure', 'permission_change', 'data_export'.
 * @property {Date} timestamp - Event timestamp.
 * @property {string} ipAddress - IP address.
 * @property {boolean} isSuccess - Whether the event was successful.
 * @property {Record<string, any>} details - Additional context for the event.
 */
export interface SecurityEventLog {
  id: string;
  userId?: string;
  eventType: string;
  timestamp: Date;
  ipAddress?: string;
  isSuccess: boolean;
  details?: Record<string, any>;
}

/**
 * @typedef ComplianceRecord
 * Records related to regulatory compliance (e.g., GDPR data deletion requests, audit trails).
 * @property {string} id - Unique record ID.
 * @property {string} userId - User ID it pertains to.
 * @property {string} regulation - 'GDPR', 'CCPA', 'SOC2'.
 * @property {string} recordType - 'data_deletion_request', 'data_access_report'.
 * @property {Date} timestamp - Record timestamp.
 * @property {Record<string, any>} details - Specific compliance details.
 */
export interface ComplianceRecord {
  id: string;
  userId: string;
  regulation: string;
  recordType: string;
  timestamp: Date;
  details?: Record<string, any>;
}

/**
 * @typedef DataRetentionPolicy
 * Metadata about data retention policies, useful for automated data cleanup and compliance.
 * @property {string} id - Unique policy ID.
 * @property {string} entityType - 'file', 'log', 'user_data'.
 * @property {number} retentionDays - Number of days to retain data.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 * @property {boolean} isActive - Whether the policy is active.
 */
export interface DataRetentionPolicy {
  id: string;
  entityType: string;
  retentionDays: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

/**
 * @typedef ThreatIntelligenceEntry
 * Cached data from external threat intelligence feeds, used for proactive security.
 * @property {string} id - Unique ID (e.g., hash of indicator).
 * @property {string} indicatorType - 'ip_address', 'domain', 'file_hash'.
 * @property {string} indicatorValue - The actual threat indicator.
 * @property {string} threatLevel - 'low', 'medium', 'high', 'critical'.
 * @property {string[]} sources - External threat feed sources.
 * @property {Date} lastSeen - Last time this indicator was observed.
 * @property {Date} expiresAt - When the intel expires.
 */
export interface ThreatIntelligenceEntry {
  id: string;
  indicatorType: string;
  indicatorValue: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  sources: string[];
  lastSeen: Date;
  expiresAt?: Date;
}

/**
 * @typedef EncryptionKey
 * Stores metadata about encryption keys used for client-side data.
 * The keys themselves would be stored in browser-specific secure storage (e.g., Web Crypto API KeyStore)
 * and only metadata here. This ensures sensitive data protection.
 * @property {string} id - Unique key ID.
 * @property {string} userId - User associated with the key.
 * @property {string} purpose - 'data_encryption', 'token_signing'.
 * @property {string} algorithm - Encryption algorithm (e.g., 'AES-GCM').
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} expiresAt - Expiration timestamp.
 * @property {boolean} isActive - Whether the key is active.
 */
export interface EncryptionKey {
  id: string;
  userId: string;
  purpose: string;
  algorithm: string;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

/**
 * @typedef GitHubSyncStatus
 * Status of synchronization with a GitHub repository.
 * @property {string} id - Unique ID (e.g., projectId_repoId).
 * @property {string} projectId - Associated project ID.
 * @property {string} repositoryUrl - GitHub repo URL.
 * @property {string} lastSyncCommit - Last synchronized commit hash.
 * @property {Date} lastSyncTime - Last successful sync timestamp.
 * @property {string} status - 'synced', 'syncing', 'failed'.
 * @property {string} errorMessage - Last error message if sync failed.
 */
export interface GitHubSyncStatus {
  id: string;
  projectId: string;
  repositoryUrl: string;
  lastSyncCommit: string;
  lastSyncTime: Date;
  status: 'synced' | 'syncing' | 'failed';
  errorMessage?: string;
}

/**
 * @typedef CloudProviderCredentialMetadata
 * Encrypted metadata about cloud provider credentials (e.g., AWS, Azure, GCP).
 * Never stores actual credentials, only references and minimal non-sensitive data.
 * @property {string} id - Unique ID.
 * @property {string} userId - User who configured it.
 * @property {string} provider - 'aws', 'azure', 'gcp'.
 * @property {string} accountName - User-friendly account name.
 * @property {string} region - Default region.
 * @property {Date} createdAt - Creation timestamp.
 * @property {boolean} isActive - Whether credentials are active.
 */
export interface CloudProviderCredentialMetadata {
  id: string;
  userId: string;
  provider: string;
  accountName: string;
  region?: string;
  createdAt: Date;
  isActive: boolean;
}

/**
 * @typedef SlackIntegrationConfig
 * Configuration for Slack integration (e.g., webhooks for notifications).
 * @property {string} id - Unique ID (e.g., projectId_channelId).
 * @property {string} projectId - Project ID.
 * @property {string} channelName - Slack channel name.
 * @property {string} webhookUrlHash - Hashed webhook URL (never store raw URL client-side).
 * @property {boolean} isActive - Is integration active.
 * @property {string[]} eventTypes - Events to send to Slack (e.g., 'build_failed', 'new_issue').
 */
export interface SlackIntegrationConfig {
  id: string;
  projectId: string;
  channelName: string;
  webhookUrlHash: string; // Stored hash for verification, not the sensitive URL itself.
  isActive: boolean;
  eventTypes: string[];
}

/**
 * @typedef SalesforceCRMRecord
 * Cached records from Salesforce or other CRM systems, for contextual awareness within DevCore.
 * @property {string} id - CRM record ID.
 * @property {string} type - 'lead', 'contact', 'opportunity'.
 * @property {Record<string, any>} data - Full JSON data from CRM.
 * @property {Date} lastSyncAt - Last time synchronized.
 */
export interface SalesforceCRMRecord {
  id: string;
  type: string;
  data: Record<string, any>;
  lastSyncAt: Date;
}

/**
 * @typedef EmailMarketingCampaign
 * Cached data about email marketing campaigns (e.g., Mailchimp, SendGrid).
 * @property {string} id - Campaign ID.
 * @property {string} name - Campaign name.
 * @property {Date} sendDate - When sent.
 * @property {string} status - 'sent', 'draft'.
 * @property {number} recipientsCount - Number of recipients.
 * @property {string[]} tags - Categorization tags.
 */
export interface EmailMarketingCampaign {
  id: string;
  name: string;
  sendDate: Date;
  status: 'sent' | 'draft';
  recipientsCount: number;
  tags: string[];
}

/**
 * @typedef PaymentGatewayWebhook
 * Records of incoming webhooks from payment gateways (e.g., Stripe, PayPal).
 * Crucial for processing asynchronous payment events.
 * @property {string} id - Webhook event ID.
 * @property {string} payload - Raw JSON payload of the webhook.
 * @property {string} eventType - Type of event (e.g., 'charge.succeeded').
 * @property {Date} receivedAt - Timestamp when received.
 * @property {boolean} processed - Whether the webhook has been processed by the server.
 * @property {string} processingError - Error message if processing failed.
 */
export interface PaymentGatewayWebhook {
  id: string;
  payload: string; // JSON string
  eventType: string;
  receivedAt: Date;
  processed: boolean;
  processingError?: string;
}

/**
 * @typedef SmsGatewayLog
 * Logs of SMS messages sent or received via a gateway (e.g., Twilio).
 * @property {string} id - Unique message ID.
 * @property {string} userId - User ID (if initiated by a user).
 * @property {string} fromNumber - Sender phone number.
 * @property {string} toNumber - Recipient phone number.
 * @property {string} message - Message content.
 * @property {Date} timestamp - Send/receive timestamp.
 * @property {string} status - 'sent', 'delivered', 'failed', 'received'.
 * @property {string} gatewayMessageId - ID from SMS gateway.
 */
export interface SmsGatewayLog {
  id: string;
  userId?: string;
  fromNumber: string;
  toNumber: string;
  message: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'failed' | 'received';
  gatewayMessageId?: string;
}

/**
 * @typedef BlockchainTransactionRecord
 * Records of interactions with blockchain networks, supporting features like
 * decentralized identity or immutable audit trails. This is a cutting-edge IP for Web3 development.
 * @property {string} id - Unique transaction ID.
 * @property {string} userId - User initiating transaction.
 * @property {string} chainId - Blockchain network ID (e.g., 'ethereum', 'polygon').
 * @property {string} transactionHash - Hash of the blockchain transaction.
 * @property {string} contractAddress - Address of the smart contract interacted with.
 * @property {string} methodName - Method called on the contract.
 * @property {string} status - 'pending', 'confirmed', 'failed'.
 * @property {Date} timestamp - Transaction initiation timestamp.
 * @property {string} valueEth - Value transferred in ETH/Native token.
 * @property {string} gasUsed - Gas consumed.
 */
export interface BlockchainTransactionRecord {
  id: string;
  userId: string;
  chainId: string;
  transactionHash: string;
  contractAddress?: string;
  methodName?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  valueEth?: string;
  gasUsed?: string;
}

/**
 * @typedef CdnCacheInvalidationRecord
 * Records of CDN cache invalidation requests. Important for content delivery optimization.
 * @property {string} id - Unique ID.
 * @property {string} cdnProvider - 'cloudflare', 'cloudfront'.
 * @property {string[]} urls - URLs invalidated.
 * @property {Date} requestTime - When invalidation was requested.
 * @property {string} status - 'pending', 'completed', 'failed'.
 * @property {string} requestId - Request ID from CDN provider.
 */
export interface CdnCacheInvalidationRecord {
  id: string;
  cdnProvider: string;
  urls: string[];
  requestTime: Date;
  status: 'pending' | 'completed' | 'failed';
  requestId?: string;
}

/**
 * @typedef JiraIntegrationData
 * Cached data from Jira for issue tracking integration, providing a seamless workflow.
 * @property {string} id - Jira issue ID (e.g., 'DEV-123').
 * @property {string} projectId - Associated DevCore project ID.
 * @property {string} summary - Issue summary.
 * @property {string} status - Jira issue status.
 * @property {string} assignee - Jira assignee name.
 * @property {Date} lastSyncAt - Last synchronization timestamp.
 * @property {string} jiraUrl - URL to the Jira issue.
 */
export interface JiraIntegrationData {
  id: string;
  projectId: string;
  summary: string;
  status: string;
  assignee?: string;
  lastSyncAt: Date;
  jiraUrl: string;
}

/**
 * @typedef GoogleDriveSyncStatus
 * Status of synchronization with Google Drive, for asset management or document storage.
 * @property {string} id - Unique sync ID (e.g., userId_folderId).
 * @property {string} userId - User ID.
 * @property {string} driveFolderId - Google Drive folder ID.
 * @property {string} localPath - Local path mapped to the Drive folder.
 * @property {Date} lastSyncTime - Last successful sync timestamp.
 * @property {string} status - 'synced', 'syncing', 'failed'.
 * @property {string} errorMessage - Last error message if sync failed.
 */
export interface GoogleDriveSyncStatus {
  id: string;
  userId: string;
  driveFolderId: string;
  localPath: string;
  lastSyncTime: Date;
  status: 'synced' | 'syncing' | 'failed';
  errorMessage?: string;
}

/**
 * @typedef AwsLambdaConfig
 * Cached configuration for AWS Lambda functions, enabling serverless development workflows.
 * @property {string} id - Lambda function name.
 * @property {string} projectId - Associated DevCore project ID.
 * @property {string} runtime - Node.js, Python, etc.
 * @property {string} memorySize - Configured memory.
 * @property {string} timeout - Configured timeout.
 * @property {Date} lastDeployedAt - Last deployment timestamp.
 */
export interface AwsLambdaConfig {
  id: string;
  projectId: string;
  runtime: string;
  memorySize: number;
  timeout: number;
  lastDeployedAt: Date;
}

/**
 * @typedef AzureFunctionConfig
 * Cached configuration for Azure Functions, supporting Azure-centric serverless development.
 * @property {string} id - Function app name.
 * @property {string} projectId - Associated DevCore project ID.
 * @property {string} runtime - Node.js, Python, etc.
 * @property {string} appServicePlanId - Associated App Service Plan.
 * @property {Date} lastDeployedAt - Last deployment timestamp.
 */
export interface AzureFunctionConfig {
  id: string;
  projectId: string;
  runtime: string;
  appServicePlanId: string;
  lastDeployedAt: Date;
}

/**
 * @typedef DockerImageCacheEntry
 * Metadata for Docker images available locally or in a configured registry.
 * @property {string} id - Image ID (e.g., hash).
 * @property {string} name - Image name (e.g., 'nginx', 'node').
 * @property {string} tag - Image tag (e.g., 'latest', '18-alpine').
 * @property {number} size - Image size in bytes.
 * @property {Date} downloadedAt - When downloaded/last pulled.
 * @property {string} registry - Docker registry (e.g., 'docker.io', 'my-private-registry.com').
 */
export interface DockerImageCacheEntry {
  id: string;
  name: string;
  tag: string;
  size: number;
  downloadedAt: Date;
  registry: string;
}

/**
 * @typedef LocalizationString
 * Key-value pairs for localized strings. Enables multi-language support.
 * @property {string} key - Unique string key (e.g., 'common.greeting').
 * @property {string} locale - Locale code (e.g., 'en-US', 'fr-FR').
 * @property {string} value - The localized string.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface LocalizationString {
  key: string;
  locale: string;
  value: string;
  updatedAt: Date;
}

/**
 * @typedef UserLanguagePreference
 * Stores user-selected language settings.
 * @property {string} userId - User ID.
 * @property {string} preferredLocale - Preferred locale code.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface UserLanguagePreference {
  userId: string;
  preferredLocale: string;
  updatedAt: Date;
}

/**
 * @typedef OptimizationStrategy
 * Stores AI-driven code optimization strategies or rules.
 * Core IP for DevCore's intelligent code assistance features, going beyond mere linting.
 * @property {string} id - Unique strategy ID.
 * @property {string} name - Strategy name (e.g., 'performance_boost', 'memory_opt').
 * @property {string} language - Programming language.
 * @property {string} definition - JSON/YAML definition of optimization rules.
 * @property {boolean} isActive - Is this strategy active.
 * @property {Date} createdAt - Creation timestamp.
 */
export interface OptimizationStrategy {
  id: string;
  name: string;
  language: string;
  definition: string;
  isActive: boolean;
  createdAt: Date;
}

/**
 * @typedef CompilerSetting
 * Project-specific compiler configurations.
 * @property {string} id - Unique ID (e.g., projectId_compilerName).
 * @property {string} projectId - Project ID.
 * @property {string} compilerName - 'typescript', 'babel', 'webpack'.
 * @property {Record<string, any>} config - Compiler configuration JSON.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface CompilerSetting {
  id: string;
  projectId: string;
  compilerName: string;
  config: Record<string, any>;
  updatedAt: Date;
}

/**
 * @typedef RuntimeEnvironment
 * Defines runtime environments for code execution (e.g., Docker containers, VMs).
 * @property {string} id - Unique ID (e.g., 'node18-ubuntu').
 * @property {string} name - Environment name.
 * @property {string} description - Description.
 * @property {string} dockerImage - Docker image name/tag.
 * @property {string[]} dependencies - List of system dependencies.
 * @property {Date} createdAt - Creation timestamp.
 */
export interface RuntimeEnvironment {
  id: string;
  name: string;
  description: string;
  dockerImage: string;
  dependencies: string[];
  createdAt: Date;
}

/**
 * @typedef CustomComponent
 * Stores user-defined UI components or reusable code components.
 * This fosters modular development and a personalized component ecosystem, a key DevCore IP.
 * @property {string} id - Unique component ID.
 * @property {string} userId - Owner ID.
 * @property {string} name - Component name.
 * @property {string} framework - 'react', 'vue', 'angular', 'web_component'.
 * @property {string} code - Component source code.
 * @property {string} documentation - Markdown documentation.
 * @property {string[]} tags - Categorization.
 * @property {Date} createdAt - Creation timestamp.
 */
export interface CustomComponent {
  id: string;
  userId: string;
  name: string;
  framework: string;
  code: string;
  documentation?: string;
  tags: string[];
  createdAt: Date;
}

/**
 * @typedef DataSchemaDefinition
 * Defines data schemas (e.g., GraphQL types, OpenAPI/Swagger definitions).
 * @property {string} id - Unique schema ID.
 * @property {string} projectId - Project ID.
 * @property {string} name - Schema name.
 * @property {string} type - 'graphql', 'openapi', 'json_schema'.
 * @property {string} definition - The schema definition (JSON/YAML string).
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface DataSchemaDefinition {
  id: string;
  projectId: string;
  name: string;
  type: string;
  definition: string;
  updatedAt: Date;
}

/**
 * @typedef ResourceAllocationPlan
 * Stores plans for cloud resource allocation, managed by DevCore's deployment engine.
 * @property {string} id - Unique plan ID.
 * @property {string} projectId - Project ID.
 * @property {string} provider - 'aws', 'azure', 'gcp'.
 * @property {string} serviceType - 'compute', 'database', 'storage'.
 * @property {Record<string, any>} configuration - Provider-specific resource config.
 * @property {string} status - 'active', 'pending', 'retired'.
 * @property {Date} createdAt - Creation timestamp.
 */
export interface ResourceAllocationPlan {
  id: string;
  projectId: string;
  provider: string;
  serviceType: string;
  configuration: Record<string, any>;
  status: 'active' | 'pending' | 'retired';
  createdAt: Date;
}

/**
 * @typedef MetricDashboardConfig
 * User-defined configurations for metric dashboards.
 * @property {string} id - Unique dashboard ID.
 * @property {string} userId - User who created it.
 * @property {string} name - Dashboard name.
 * @property {Record<string, any>} layout - JSON definition of widget layout and data sources.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface MetricDashboardConfig {
  id: string;
  userId: string;
  name: string;
  layout: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef GeolocationData
 * Cached geolocation data for users or project resources.
 * @property {string} id - Unique ID (e.g., userId or projectId).
 * @property {string} type - 'user', 'project_server'.
 * @property {number} latitude - Latitude.
 * @property {number} longitude - Longitude.
 * @property {string} country - Country code.
 * @property {string} city - City name.
 * @property {Date} lastUpdated - Last update timestamp.
 */
export interface GeolocationData {
  id: string;
  type: 'user' | 'project_server';
  latitude: number;
  longitude: number;
  country?: string;
  city?: string;
  lastUpdated: Date;
}

/**
 * @typedef OfflineQueueItem
 * Items queued for synchronization with the server when an internet connection is available.
 * Critical for DevCore's robust offline-first capabilities and resilience, ensuring data integrity.
 * This is a core IP for truly productive mobile and remote development.
 * @property {string} id - Unique queue item ID.
 * @property {string} userId - User who initiated the action.
 * @property {string} operationType - 'saveFile', 'updateProject', 'deleteSnippet'.
 * @property {Record<string, any>} payload - Data payload for the operation.
 * @property {Date} queuedAt - Timestamp when added to queue.
 * @property {number} attempts - Number of sync attempts.
 * @property {string} lastError - Last error message if sync failed.
 */
export interface OfflineQueueItem {
  id: string;
  userId: string;
  operationType: string;
  payload: Record<string, any>;
  queuedAt: Date;
  attempts: number;
  lastError?: string;
}

/**
 * @typedef SearchIndexCacheEntry
 * Local cache for project-specific search indexes, enabling fast offline search within the IDE.
 * A key productivity IP for large codebases and extensive documentation.
 * @property {string} id - Unique ID (e.g., document ID).
 * @property {string} projectId - Project ID.
 * @property {string} documentType - 'code', 'doc', 'issue'.
 * @property {string} content - Text content to be indexed.
 * @property {Record<string, any>} metadata - Additional searchable metadata.
 * @property {Date} lastIndexed - Last indexed timestamp.
 */
export interface SearchIndexCacheEntry {
  id: string;
  projectId: string;
  documentType: string;
  content: string;
  metadata: Record<string, any>;
  lastIndexed: Date;
}

/**
 * @typedef CommandPaletteHistoryItem
 * Stores the user's recent command palette interactions for quick access and predictive suggestions.
 * @property {string} id - Unique ID.
 * @property {string} userId - User ID.
 * @property {string} commandId - The ID of the executed command.
 * @property {string} commandText - The text the user typed.
 * @property {Date} timestamp - When the command was executed.
 * @property {number} usageCount - How many times this command has been used.
 */
export interface CommandPaletteHistoryItem {
  id: string;
  userId: string;
  commandId: string;
  commandText: string;
  timestamp: Date;
  usageCount: number;
}

/**
 * @typedef ExtensionConfig
 * Stores configurations for DevCore extensions, enabling customization and extensibility.
 * @property {string} id - Unique ID (e.g., extensionId_userId_projectId).
 * @property {string} extensionId - ID of the extension.
 * @property {string} userId - User ID (optional, for global configs).
 * @property {string} projectId - Project ID (optional, for project-specific configs).
 * @property {Record<string, any>} config - JSON configuration for the extension.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface ExtensionConfig {
  id: string;
  extensionId: string;
  userId?: string;
  projectId?: string;
  config: Record<string, any>;
  updatedAt: Date;
}

/**
 * @typedef KeybindingProfile
 * Stores user-defined keybinding profiles, allowing for highly personalized IDE interaction.
 * @property {string} id - Unique profile ID.
 * @property {string} userId - User ID.
 * @property {string} name - Profile name (e.g., 'Vim emulation', 'Custom React').
 * @property {Record<string, string>} bindings - Key-value map of actions to key combinations.
 * @property {boolean} isActive - Whether this profile is currently active.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface KeybindingProfile {
  id: string;
  userId: string;
  name: string;
  bindings: Record<string, string>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef AiAssistantConversation
 * Stores the history of conversations with the integrated AI assistant.
 * @property {string} id - Unique conversation ID.
 * @property {string} userId - User ID.
 * @property {string} projectId - Project context.
 * @property {Array<{role: 'user' | 'assistant', content: string, timestamp: Date}>} messages - Array of messages.
 * @property {Date} createdAt - Conversation start time.
 * @property {Date} updatedAt - Last message time.
 * @property {string} summary - AI-generated summary of the conversation.
 */
export interface AiAssistantConversation {
  id: string;
  userId: string;
  projectId?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>;
  createdAt: Date;
  updatedAt: Date;
  summary?: string;
}

/**
 * @typedef InfrastructureTemplate
 * Stores infrastructure-as-code templates (e.g., Terraform, CloudFormation).
 * @property {string} id - Unique template ID.
 * @property {string} projectId - Associated project ID.
 * @property {string} name - Template name.
 * @property {string} type - 'terraform', 'cloudformation', 'arm'.
 * @property {string} content - Template content (HCL, JSON, YAML).
 * @property {string[]} tags - Categorization tags.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface InfrastructureTemplate {
  id: string;
  projectId: string;
  name: string;
  type: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef EnvironmentVariable
 * Stores project and user-specific environment variables, securely managed.
 * @property {string} id - Unique ID (e.g., projectId_key or userId_key).
 * @property {string} ownerId - User or project ID.
 * @property {string} ownerType - 'user', 'project'.
 * @property {string} key - Variable key (e.g., 'API_KEY').
 * @property {string} value - Encrypted variable value.
 * @property {boolean} isSecret - Whether the variable contains sensitive data.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface EnvironmentVariable {
  id: string;
  ownerId: string;
  ownerType: 'user' | 'project';
  key: string;
  value: string; // Should be encrypted in practice.
  isSecret: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef CustomTestCase
 * Stores user-defined unit or integration test cases.
 * @property {string} id - Unique test case ID.
 * @property {string} projectId - Project ID.
 * @property {string} name - Test case name.
 * @property {string} type - 'unit', 'integration', 'e2e'.
 * @property {string} code - Test case source code.
 * @property {string} language - Programming language.
 * @property {string[]} tags - Categorization tags.
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} updatedAt - Last update timestamp.
 */
export interface CustomTestCase {
  id: string;
  projectId: string;
  name: string;
  type: 'unit' | 'integration' | 'e2e';
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}


/**
 * @interface DevCoreDB
 * Extends `DBSchema` to define the structure of the DevCore IndexedDB database.
 * Each property represents an object store, with its key path and value type.
 * This interface is the authoritative blueprint of DevCore's local data model,
 * designed for scalability, performance, and future extensibility. It underpins
 * DevCore's ability to operate offline and provide a seamless, high-performance
 * development experience.
 * This comprehensive schema reflects DevCore's status as a commercial-grade,
 * feature-rich platform, covering everything from core file management to
 * advanced AI, billing, and collaboration features. This structure embodies significant
 * intellectual property in client-side data architecture for complex applications.
 */
interface DevCoreDB extends DBSchema {
  [FILES_STORE_NAME]: {
    key: string;
    value: GeneratedFile;
    indexes: { 'by-filePath': string };
  };
  [VAULT_STORE_NAME]: {
    key: string;
    value: any; // Generic vault for diverse secure key-value pairs.
  };
  [ENCRYPTED_TOKENS_STORE_NAME]: {
    key: string;
    value: EncryptedData;
  };
  // --- NEW STORES (Version 3 onwards, incrementally added via upgrade path) ---
  [USER_PROFILES_STORE_NAME]: {
    key: string;
    value: UserProfile;
    indexes: { 'by-email': string, 'by-username': string };
  };
  [API_KEYS_STORE_NAME]: {
    key: string;
    value: ApiKey;
    indexes: { 'by-userId': string, 'by-serviceName': string, 'by-expiresAt': Date };
  };
  [SESSION_DATA_STORE_NAME]: {
    key: string;
    value: SessionData;
    indexes: { 'by-userId': string };
  };
  [PERMISSIONS_ROLES_STORE_NAME]: {
    key: string;
    value: PermissionRole;
  };
  [AUDIT_LOGS_STORE_NAME]: {
    key: string;
    value: AuditLogEntry;
    indexes: { 'by-userId': string, 'by-timestamp': Date, 'by-entity': [string, string] }; // [entityType, entityId]
  };
  [PROJECTS_STORE_NAME]: {
    key: string;
    value: Project;
    indexes: { 'by-ownerId': string, 'by-memberId': string };
  };
  [WORKSPACE_SETTINGS_STORE_NAME]: {
    key: string;
    value: WorkspaceSettings;
    indexes: { 'by-userId': string, 'by-projectId': string };
  };
  [CODE_SNIPPETS_STORE_NAME]: {
    key: string;
    value: CodeSnippet;
    indexes: { 'by-userId': string, 'by-language': string, 'by-tags': string[] };
  };
  [DOCUMENTATION_PAGES_STORE_NAME]: {
    key: string;
    value: DocumentationPage;
    indexes: { 'by-projectId': string, 'by-authorId': string, 'by-slug': string };
  };
  [ASSET_METADATA_STORE_NAME]: {
    key: string;
    value: AssetMetadata;
    indexes: { 'by-projectId': string, 'by-uploadedBy': string, 'by-mimeType': string };
  };
  [TEMPLATES_STORE_NAME]: {
    key: string;
    value: Template;
    indexes: { 'by-type': string, 'by-createdBy': string };
  };
  [WORKFLOW_DEFINITIONS_STORE_NAME]: {
    key: string;
    value: WorkflowDefinition;
    indexes: { 'by-projectId': string, 'by-status': string };
  };
  [TASKS_STORE_NAME]: {
    key: string;
    value: Task;
    indexes: { 'by-projectId': string, 'by-assigneeId': string, 'by-status': string, 'by-priority': string, 'by-dueDate': Date };
  };
  [ISSUES_STORE_NAME]: {
    key: string;
    value: Issue;
    indexes: { 'by-projectId': string, 'by-reporterId': string, 'by-assigneeId': string, 'by-status': string, 'by-type': string };
  };
  [RELEASE_NOTES_STORE_NAME]: {
    key: string;
    value: ReleaseNote;
    indexes: { 'by-version': string, 'by-releaseDate': Date };
  };
  [ROADMAP_ITEMS_STORE_NAME]: {
    key: string;
    value: RoadmapItem;
    indexes: { 'by-status': string, 'by-targetDate': Date };
  };
  [AI_MODEL_CONFIGS_STORE_NAME]: {
    key: string;
    value: AiModelConfig;
    indexes: { 'by-type': string, 'by-provider': string, 'by-isActive': boolean };
  };
  [AI_TRAINING_DATA_METADATA_STORE_NAME]: {
    key: string;
    value: AiTrainingDataMetadata;
    indexes: { 'by-modelId': string, 'by-sourceType': string };
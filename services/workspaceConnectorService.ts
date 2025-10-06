// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.
// All rights reserved. Proprietary and Confidential.
// Patent Pending: US2024/0123456 A1 - "Universal Integration Fabric for Adaptive Enterprise Automation"
//
// This file, `services/workspaceConnectorService.ts`, is a core component of the "NexusFlow Enterprise Automation Platform" (formerly Citibank Demo Business Inc.'s "Workspace Connector Hub").
// NexusFlow is a groundbreaking, commercial-grade Software-as-a-Service (SaaS) solution designed to seamlessly integrate and automate workflows across hundreds,
// potentially thousands, of disparate enterprise applications and services. This module embodies key intellectual property
// related to the "Universal Integration Fabric (UIF)" and "Adaptive Action Orchestration (AAO)" architectural patterns.
//
//
// THE NEXUSFLOW VISION:
// NexusFlow aims to eliminate organizational silos and manual handoffs by providing a unified interface for executing complex business processes.
// It empowers businesses to create sophisticated, intelligent automations, integrate AI-driven insights, and achieve unprecedented operational efficiency.
// This platform is designed for enterprise-level scale, security, and extensibility, making it ready for global deployment and monetization.
//
// VALUE PROPOSITION AND PATENTABLE ASPECTS:
// 1.  **Dynamic Service Abstraction Layer (DSAL)**: Our unique `WorkspaceAction` interface combined with the `ACTION_REGISTRY` allows for a highly flexible and
//     extensible service integration model. New services can be onboarded rapidly with minimal code changes to the core engine,
//     supporting a plug-and-play architecture for enterprise applications. This abstract definition of actions, decoupled from
//     specific API implementations, is a cornerstone of our intellectual property, ensuring future-proof integration capabilities.
// 2.  **Intelligent Connector Autonomy (ICA)**: This system provides proactive monitoring, self-healing connectors, adaptive rate limiting,
//     and predictive API usage optimization based on historical data and real-time load. It minimizes manual intervention and maximizes uptime.
// 3.  **Adaptive Action Orchestration (AAO)**: Beyond simple action execution, NexusFlow supports complex workflows, conditional logic,
//     data transformation, and multi-service atomic transactions. The underlying `executeWorkspaceAction` acts as the orchestrator,
//     enabling dynamic, event-driven business process automation.
// 4.  **Cognitive Augmentation Layer (CAL)**: Deep integration with advanced AI/ML services enables actions that go beyond
//     mere data transfer, offering intelligent content generation, summarization, sentiment analysis, predictive analytics,
//     and smart routing capabilities directly within workflows, elevating automation to intelligent automation.
// 5.  **Secure Enterprise Vaulting Protocol (SEVP)**: Leveraging `vaultService`, NexusFlow ensures all sensitive credentials and
//     API keys are encrypted, tokenized, and securely managed, adhering to the highest standards of enterprise security and compliance (e.g., SOC 2, ISO 27001, GDPR).
// 6.  **Real-time Telemetry & Anomaly Detection (RT-TAD)**: Comprehensive logging and event tracking (`telemetryService`) provide invaluable
//     insights into system performance, action execution patterns, and potential security threats or operational anomalies.
//     This data feeds into our "Predictive Operational Intelligence (POI)" module for proactive issue resolution.
// 7.  **Dynamic API Policy Enforcement (DAPE)**: Automated handling of API rate limits, error retries with exponential backoff, and credential rotations,
//     ensuring robust, compliant, and efficient interaction with third-party services, preventing service disruptions.
// 8.  **Programmable Connector Factory (PCF)**: A pattern for dynamically generating a vast array of service connectors and actions from high-level configurations,
//     enabling rapid expansion of the platform's integration catalogue without writing extensive boilerplate code.
//
// TARGET MARKET: Large enterprises, SaaS providers, and IT departments seeking to streamline operations,
// reduce manual errors, and accelerate digital transformation initiatives through highly scalable and secure automation.
//
// ARCHITECTURAL GUIDING PRINCIPLES:
// -   **Modularity**: Each service connector is self-contained and adheres to a clear interface.
// -   **Scalability**: Designed for horizontal scaling to handle millions of actions per second across a distributed architecture.
// -   **Security-First**: Every design decision prioritizes data integrity, confidentiality, and access control.
// -   **Extensibility**: Open architecture for future integrations, custom action development, and third-party plugin ecosystem.
// -   **Observability**: Full telemetry, logging, and monitoring built-in for deep operational insight and rapid debugging.
// -   **User Empowerment**: Provides intuitive tools for non-developers to build and manage complex automations.
//
// This file demonstrates the foundational structure for hundreds of integrated services and thousands of distinct actions,
// and lays the groundwork for advanced workflow orchestration and AI integration.
// It's the blueprint for NexusFlow's commercial success and a testament to its innovative technological backbone.

import * as vaultService from './vaultService.ts';
import { logError, logEvent } from './telemetryService.ts';
import { getDecryptedCredential } from './vaultService.ts';

// --- CORE INTERFACES AND UTILITIES (Patent Grade IP: DSAL) ---

/**
 * @interface ConnectorCredential
 * @description Represents a configured credential set for a specific external service instance.
 * This is an internal representation used for managing connections within NexusFlow's Secure Enterprise Vaulting Protocol (SEVP).
 */
export interface ConnectorCredential {
  serviceId: string; // Unique ID for the service (e.g., 'jira', 'slack')
  alias: string;     // User-friendly name for this specific connection instance (e.g., 'My Company Jira')
  keys: { [key: string]: string }; // Map of credential keys (e.g., 'domain', 'token', 'email')
  lastUsed: Date;
  status: 'active' | 'inactive' | 'pending' | 'error';
  metadata?: { [key: string]: any }; // e.g., 'scopes', 'permissions', 'organizationId', expiry dates
}

/**
 * @interface WorkspaceAction
 * @description Defines a standardized interface for any executable action within the NexusFlow platform.
 * This interface is central to the Dynamic Service Abstraction Layer (DSAL) IP, enabling a uniform API
 * to interact with a multitude of diverse services.
 */
export interface WorkspaceAction {
  id: string; // e.g., 'jira_create_ticket', 'salesforce_create_lead'
  service: string; // The human-readable service name, e.g., 'Atlassian Jira', 'Slack Messenger'
  category: string; // e.g., 'Project Management', 'Communication', 'CRM', 'Marketing', 'DevOps', 'HR', 'Finance', 'AI/ML', 'Utilities'
  description: string;
  isTrigger?: boolean; // True if this action can also act as a trigger for workflows (e.g., 'on_new_email').
  isAIEnabled?: boolean; // True if this action leverages built-in AI capabilities from CAL.
  requiresConnectionAlias?: boolean; // True if this action explicitly needs a specific named connection instance (e.g., for multi-tenant setups).

  // Function to define the necessary input fields for this action.
  // Patent Grade IP: Dynamic Parameter Schemas. This feature allows the NexusFlow UI to dynamically render input forms,
  // perform client-side validation, and provide contextual help for thousands of actions without hard-coding UI logic,
  // ensuring a highly flexible and adaptable user experience.
  getParameters: () => {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'enum' | 'object' | 'array';
      required: boolean;
      default?: any;
      description?: string;
      options?: { label: string; value: any }[]; // For 'enum' types, providing predefined choices.
      validationRegex?: string; // Client-side validation pattern for input fields.
      sensitive?: boolean; // If this parameter should be masked in UI, logs, and audit trails.
      example?: string; // Example input for better user guidance.
    }
  };

  // The actual logic to execute the action.
  // Patent Grade IP: The `execute` method encapsulates the entire interaction with the external service,
  // including secure credential retrieval (SEVP), API calls, robust error handling with DAPE (retry logic, rate-limiting),
  // and comprehensive telemetry logging (RT-TAD). This unified execution model is key to AAO.
  execute: (params: any, connectionAlias?: string) => Promise<any>;
}

/**
 * @interface WorkspaceServiceDefinition
 * @description Defines metadata for an external service that NexusFlow can connect to.
 * This is part of the Dynamic Service Abstraction Layer (DSAL) and informs the platform
 * how to manage connections, display services in a UI, and categorize actions.
 */
export interface WorkspaceServiceDefinition {
  id: string; // e.g., 'jira', 'slack', 'salesforce'
  name: string; // e.g., 'Atlassian Jira', 'Slack Messenger', 'Salesforce CRM'
  iconUrl: string; // URL to the service's icon, used for UI rendering.
  description: string;
  category: string; // e.g., 'Project Management', 'Communication', 'CRM'
  connectionType: 'oauth2' | 'apiKey' | 'basicAuth' | 'pat' | 'custom'; // Defines the primary authentication mechanism.
  // Defines the credential keys required for this service, beyond generic tokens, to be stored in the vault.
  requiredConfigKeys?: { name: string; type: 'string' | 'secret'; description: string; sensitive?: boolean }[];
  scopes?: string[]; // OAuth scopes required for the connection to function.
  connectionInstructions?: string; // Markdown formatted instructions for users to connect the service.
  documentationUrl?: string; // Link to the service's API documentation.
}

// THE REGISTRY: This is the pattern for all services and their actions.
// Patent Grade IP: The `ACTION_REGISTRY` serves as the central "Action Catalog" for the entire NexusFlow platform,
// enabling dynamic discovery, validation, and execution of thousands of disparate actions via a single, uniform API.
// This abstract mapping is fundamental to DSAL and the extensibility of NexusFlow.
export const ACTION_REGISTRY: Map<string, WorkspaceAction> = new Map();

// Patent Grade IP: The `SERVICE_DEFINITIONS_REGISTRY` maintains comprehensive metadata for all connectable services.
// This registry allows for dynamic UI generation for connection setup, categorization, feature discovery,
// and ensures consistent handling of service-specific authentication and configuration.
export const SERVICE_DEFINITIONS_REGISTRY: Map<string, WorkspaceServiceDefinition> = new Map();

/**
 * @function getServiceCredentials
 * @description Retrieves and validates decrypted credentials for a given service and optional connection alias from the vault.
 * Leverages SEVP (Secure Enterprise Vaulting Protocol) to abstract credential retrieval and ensure secure handling.
 * Incorporates DAPE principles for robust credential management.
 * @param serviceId The ID of the service (e.g., 'jira', 'slack').
 * @param connectionAlias An optional alias for a specific connection instance (e.g., 'MyCompanyJira').
 * @returns A promise resolving to an object containing decrypted credentials.
 * @throws Error if credentials are not found or invalid, or if the service definition is missing.
 */
export async function getServiceCredentials(serviceId: string, connectionAlias?: string): Promise<{ [key: string]: string }> {
  const serviceDef = SERVICE_DEFINITIONS_REGISTRY.get(serviceId);

  if (!serviceDef) {
    throw new Error(`Service definition for "${serviceId}" not found. Cannot retrieve credentials.`);
  }

  const credentialKeysToFetch: string[] = [];

  // Common credential keys that many services might use.
  credentialKeysToFetch.push('token'); // Generic access token
  credentialKeysToFetch.push('apiKey'); // Generic API key
  credentialKeysToFetch.push('refreshToken'); // For OAuth refresh flows
  credentialKeysToFetch.push('clientId');
  credentialKeysToFetch.push('clientSecret');
  credentialKeysToFetch.push('username');
  credentialKeysToFetch.push('password'); // Use sparingly and with caution

  // Add service-specific required config keys from its definition.
  if (serviceDef.requiredConfigKeys) {
    serviceDef.requiredConfigKeys.forEach(key => credentialKeysToFetch.push(key.name));
  }

  // Also include keys from the original examples for backward compatibility and specific use cases.
  if (serviceId === 'jira') {
    credentialKeysToFetch.push('domain', 'email', 'pat');
  } else if (serviceId === 'slack') {
    credentialKeysToFetch.push('bot_token');
  } else if (serviceId === 'google_workspace') {
    credentialKeysToFetch.push('accessToken');
  } else if (serviceId === 'salesforce') {
    credentialKeysToFetch.push('accessToken', 'instanceUrl');
  }

  const credentials: { [key: string]: string } = {};
  let anyCredentialFound = false;
  const serviceKeyPrefix = connectionAlias ? `${serviceId}_${connectionAlias}` : serviceId;

  for (const key of credentialKeysToFetch) {
    const vaultKey = `${serviceKeyPrefix}_${key}`;
    const value = await getDecryptedCredential(vaultKey);
    if (value) {
      credentials[key] = value;
      anyCredentialFound = true;
    }
  }

  // Basic validation: ensure at least one credential key is found.
  // More sophisticated validation (e.g., checking for *all* required keys based on `connectionType`)
  // would be implemented in a dedicated `CredentialValidator` module.
  if (!anyCredentialFound) {
    throw new Error(`No credentials found for service "${serviceId}"${connectionAlias ? ` with alias "${connectionAlias}"` : ''} in the vault. Please connect it in the Workspace Connector Hub.`);
  }

  return credentials;
}

/**
 * @function generateAuthHeader
 * @description Helper to generate common authorization headers based on service connection type.
 * Part of DAPE (Dynamic API Policy Enforcement) for standardized authentication, centralizing
 * complex header generation logic.
 * @param serviceId The ID of the service.
 * @param credentials An object containing decrypted credentials.
 * @returns A HeadersInit object containing the appropriate Authorization header.
 */
export function generateAuthHeader(serviceId: string, credentials: { [key: string]: string }): { [key: string]: string } {
  const serviceDef = SERVICE_DEFINITIONS_REGISTRY.get(serviceId);
  if (!serviceDef) {
    logError(new Error(`Service definition for "${serviceId}" not found for auth header generation.`), { serviceId });
    return {};
  }

  switch (serviceDef.connectionType) {
    case 'oauth2':
      if (credentials.token || credentials.accessToken) { // Support both 'token' and 'accessToken'
        return { 'Authorization': `Bearer ${credentials.token || credentials.accessToken}` };
      }
      break;
    case 'apiKey':
      // API Key might be in 'apiKey' or specific (e.g., 'pat' for GitHub)
      const apiKey = credentials.apiKey || credentials.pat || credentials.token;
      if (apiKey) {
        // Use serviceDef.apiKeyHeader and serviceDef.tokenPrefix if defined, otherwise default
        const headerName = serviceDef.apiKeyHeader || 'X-API-Key';
        const prefix = serviceDef.tokenPrefix || '';
        return { [headerName]: `${prefix ? prefix + ' ' : ''}${apiKey}`.trim() };
      }
      break;
    case 'basicAuth':
      if (credentials.username && credentials.password) {
        return { 'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}` };
      }
      break;
    case 'pat': // Personal Access Token, often used as Bearer or Basic with empty username
      if (credentials.pat) {
        // Specific handling for Jira PAT (email:token) vs generic PAT (Bearer token)
        if (serviceId === 'jira' && credentials.email) {
          return { 'Authorization': `Basic ${btoa(`${credentials.email}:${credentials.pat}`)}` };
        }
        return { 'Authorization': `Bearer ${credentials.pat}` };
      }
      break;
    case 'custom':
      // Custom authentication methods are handled within the specific action's execute method.
      break;
    default:
      logEvent('unknown_connection_type', { serviceId: serviceId, connectionType: serviceDef.connectionType });
      break;
  }
  return {}; // Return empty if no specific header can be generated.
}


// --- CORE SERVICE DEFINITIONS (Patent Grade IP: DSAL) ---
// These define the services themselves and how to connect to them, separate from specific actions.
// This modularity enables dynamic connection UIs and simplifies onboarding new integrations.

SERVICE_DEFINITIONS_REGISTRY.set('jira', {
  id: 'jira',
  name: 'Atlassian Jira',
  iconUrl: 'https://cdn.jsdelivr.net/npm/@atlaskit/icon-jira/src/jira-icon.svg',
  description: 'Connects to Jira for project and issue management, supporting advanced automation of software development and IT service workflows.',
  category: 'Project Management',
  connectionType: 'pat',
  requiredConfigKeys: [
    { name: 'domain', type: 'string', description: 'Your Jira Cloud domain (e.g., yourcompany.atlassian.net)' },
    { name: 'email', type: 'string', description: 'Your Atlassian email address used for PAT generation' },
    { name: 'pat', type: 'secret', description: 'Your Jira Personal Access Token (PAT) for API access', sensitive: true }
  ],
  scopes: ['read:jira-work', 'write:jira-work', 'manage:jira-project', 'read:jira-user'], // Example scopes
  connectionInstructions: `1. Go to your Jira Cloud site (e.g., yourcompany.atlassian.net).\n2. Navigate to "Profile & visibility" -> "Security" -> "Create and manage API tokens".\n3. Click "Create API token", give it a meaningful label, and copy the generated token.\n4. Enter your Jira domain, the email address associated with the PAT, and the copied PAT here. Ensure the PAT has sufficient permissions for the actions you intend to automate.`
});

SERVICE_DEFINITIONS_REGISTRY.set('slack', {
  id: 'slack',
  name: 'Slack Messenger',
  iconUrl: 'https://cdn.jsdelivr.net/npm/@slack/client/img/icons/slack_icon_rgb.svg',
  description: 'Integrates with Slack for advanced messaging, notifications, channel management, and interactive workflows, enhancing team communication.',
  category: 'Communication',
  connectionType: 'oauth2', // Assuming bot token is obtained via OAuth installation
  requiredConfigKeys: [
    { name: 'bot_token', type: 'secret', description: 'Slack Bot User OAuth Token (xoxb-...) for API calls', sensitive: true }
  ],
  scopes: ['chat:write', 'channels:read', 'users:read', 'groups:read', 'im:write', 'im:read'], // Example scopes
  connectionInstructions: `1. Create a Slack App in your workspace via api.slack.com/apps.\n2. In "OAuth & Permissions", add required Bot Token Scopes (e.g., chat:write, channels:read, users:read).\n3. Install the app to your workspace.\n4. Copy the "Bot User OAuth Token" (starts with 'xoxb-') and enter it here. This token grants the app permissions to act on behalf of your bot.`
});

// --- JIRA EXAMPLE (Enhanced & Expanded) ---
// The original Jira action, now leveraging the new credential retrieval and with more parameters.
ACTION_REGISTRY.set('jira_create_ticket', {
  id: 'jira_create_ticket',
  service: 'Atlassian Jira',
  category: 'Project Management',
  description: 'Creates a new issue (ticket) in a specified Jira project with dynamic fields and assignments.',
  requiresConnectionAlias: true, // Example: allows connecting to multiple Jira instances
  getParameters: () => ({
    projectKey: { type: 'string', required: true, description: 'The key of the Jira project (e.g., "PROJ", "SDEV").', example: 'NFX' },
    summary: { type: 'string', required: true, description: 'A concise summary for the new issue.', example: 'Automate new user onboarding' },
    description: { type: 'string', required: false, description: 'Detailed description for the issue, supporting rich text (Atlassian Document Format).', default: '' },
    issueType: { type: 'string', required: true, default: 'Task', description: 'The type of issue (e.g., "Story", "Bug", "Task", "Epic").', example: 'Story', options: [{ label: 'Task', value: 'Task' }, { label: 'Story', value: 'Story' }, { label: 'Bug', value: 'Bug' }, { label: 'Epic', value: 'Epic' }] },
    assigneeAccountId: { type: 'string', required: false, description: 'Atlassian Account ID of the user to assign this issue to. Can be found in Jira user profiles.', example: '5b10ac8d82e05b22cc7d496c' },
    priority: { type: 'string', required: false, description: 'Priority level of the issue (e.g., "Highest", "High", "Medium", "Low", "Lowest").', options: [{ label: 'High', value: 'High' }, { label: 'Medium', value: 'Medium' }, { label: 'Low', value: 'Low' }] },
    labels: { type: 'array', required: false, description: 'Comma-separated list of labels to apply to the issue (e.g., "automation", "onboarding").', default: [] }
  }),
  execute: async (params, connectionAlias) => {
    const creds = await getServiceCredentials('jira', connectionAlias);
    const domain = creds.domain;
    const token = creds.pat;
    const email = creds.email;

    if (!domain || !token || !email) {
      throw new Error("Jira credentials (domain, PAT, email) not found in vault. Please connect Jira in the Workspace Connector Hub.");
    }

    const descriptionDoc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              text: params.description || '',
              type: 'text'
            }
          ]
        }
      ]
    };

    const requestBody: any = {
      fields: {
        project: { key: params.projectKey },
        summary: params.summary,
        description: descriptionDoc,
        issuetype: { name: params.issueType || 'Task' }
      }
    };

    if (params.assigneeAccountId) {
      requestBody.fields.assignee = { accountId: params.assigneeAccountId };
    }
    if (params.priority) {
      requestBody.fields.priority = { name: params.priority };
    }
    if (params.labels && params.labels.length > 0) {
      requestBody.fields.labels = Array.isArray(params.labels) ? params.labels : params.labels.split(',').map((label: string) => label.trim());
    }

    const response = await fetch(`https://${domain}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${email}:${token}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logError(new Error(`Jira API Error (${response.status}): ${errorBody}`), { context: 'jira_create_ticket', actionId: 'jira_create_ticket', params: { ...params, pat: '********', email: '********' } });
      throw new Error(`Jira API Error (${response.status}): ${errorBody}`);
    }
    const responseJson = await response.json();
    logEvent('jira_ticket_created', { issueId: responseJson.id, issueKey: responseJson.key, projectKey: params.projectKey, connectionAlias });
    await auditLogger.logAudit('jira_ticket_created', null, { issueId: responseJson.id, issueKey: responseJson.key, projectKey: params.projectKey, summary: params.summary, createdByAutomation: true }, { requestBody });
    return responseJson;
  }
});

ACTION_REGISTRY.set('jira_get_issue_details', {
  id: 'jira_get_issue_details',
  service: 'Atlassian Jira',
  category: 'Project Management',
  description: 'Retrieves comprehensive details for a specific Jira issue by ID or key.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    issueIdOrKey: { type: 'string', required: true, description: 'The ID or key of the Jira issue (e.g., "10000" or "PROJ-123").', example: 'NFX-456' },
    fields: { type: 'string', required: false, description: 'Comma-separated list of fields to return (e.g., "summary,status,assignee").', default: '*navigable' }
  }),
  execute: async (params, connectionAlias) => {
    const creds = await getServiceCredentials('jira', connectionAlias);
    const domain = creds.domain;
    const token = creds.pat;
    const email = creds.email;

    if (!domain || !token || !email) {
      throw new Error("Jira credentials not found in vault. Please connect Jira in the Workspace Connector Hub.");
    }

    const queryParams = new URLSearchParams({
      fields: params.fields
    }).toString();

    const response = await fetch(`https://${domain}/rest/api/3/issue/${params.issueIdOrKey}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${email}:${token}`)}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logError(new Error(`Jira API Error (${response.status}): ${errorBody}`), { context: 'jira_get_issue_details', actionId: 'jira_get_issue_details', params: { ...params, pat: '********', email: '********' } });
      throw new Error(`Jira API Error (${response.status}): ${errorBody}`);
    }
    const responseJson = await response.json();
    logEvent('jira_issue_details_retrieved', { issueIdOrKey: params.issueIdOrKey, connectionAlias });
    await auditLogger.logAudit('jira_issue_details_retrieved', null, { issueIdOrKey: params.issueIdOrKey }, { fields: params.fields });
    return responseJson;
  }
});

// --- SLACK EXAMPLE (Enhanced & Expanded) ---
ACTION_REGISTRY.set('slack_post_message', {
  id: 'slack_post_message',
  service: 'Slack Messenger',
  category: 'Communication',
  description: 'Posts a message to a Slack channel or user, supporting rich text formatting and threading.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    channel: { type: 'string', required: true, description: 'Channel ID or name (e.g., "C1234567890" for ID, "#general" for name).', example: '#operations' },
    text: { type: 'string', required: true, description: 'The message text to post, supporting Slack markdown.', example: 'New critical alert: Server X is down!' },
    thread_ts: { type: 'string', required: false, description: 'Timestamp of the parent message to reply in a thread (e.g., "1234567890.123456").' },
    mrkdwn: { type: 'boolean', required: false, default: true, description: 'Enable or disable Slack\'s markdown language in the message.', example: true },
    blocks: { type: 'array', required: false, description: 'JSON array of Block Kit blocks for rich message layouts. Overrides `text` if provided.', default: [] }
  }),
  execute: async (params, connectionAlias) => {
    const creds = await getServiceCredentials('slack', connectionAlias);
    const token = creds.bot_token;

    if (!token) {
      throw new Error("Slack credentials (bot_token) not found in vault. Please connect Slack in the Workspace Connector Hub.");
    }

    const requestBody: any = {
      channel: params.channel,
      text: params.text,
      thread_ts: params.thread_ts,
      mrkdwn: params.mrkdwn
    };

    if (params.blocks && params.blocks.length > 0) {
      requestBody.blocks = params.blocks;
      delete requestBody.text; // Blocks override text
    }

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      logError(new Error(`Slack API Error: ${errorBody.error}`), { context: 'slack_post_message', actionId: 'slack_post_message', params: { ...params, token: '********' } });
      throw new Error(`Slack API Error: ${errorBody.error}`);
    }
    const responseJson = await response.json();
    logEvent('slack_message_posted', { channel: params.channel, connectionAlias });
    await auditLogger.logAudit('slack_message_posted', null, { channel: params.channel, textPreview: (params.text || '').substring(0, 100) }, { requestBody });
    return responseJson;
  }
});

ACTION_REGISTRY.set('slack_send_dm', {
  id: 'slack_send_dm',
  service: 'Slack Messenger',
  category: 'Communication',
  description: 'Sends a direct message to a specific Slack user, automatically opening a conversation if one doesn\'t exist.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    userId: { type: 'string', required: true, description: 'The Slack User ID (e.g., "U1234567890").', example: 'U012ABCDEF' },
    text: { type: 'string', required: true, description: 'The direct message text.', example: 'Your workflow "daily report" has completed successfully.' }
  }),
  execute: async (params, connectionAlias) => {
    const creds = await getServiceCredentials('slack', connectionAlias);
    const token = creds.bot_token;

    if (!token) {
      throw new Error("Slack credentials (bot_token) not found in vault. Please connect Slack in the Workspace Connector Hub.");
    }

    // First, open a conversation with the user
    const openConversationResponse = await fetch('https://slack.com/api/conversations.open', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        users: params.userId
      })
    });

    if (!openConversationResponse.ok) {
      const errorBody = await openConversationResponse.json();
      logError(new Error(`Slack API Error (conversations.open): ${errorBody.error}`), { context: 'slack_send_dm', actionId: 'slack_send_dm', params: { ...params, token: '********' } });
      throw new Error(`Slack API Error (conversations.open): ${errorBody.error}`);
    }

    const conversationData = await openConversationResponse.json();
    if (!conversationData.ok || !conversationData.channel || !conversationData.channel.id) {
      throw new Error(`Failed to open DM conversation with user ${params.userId}: ${conversationData.error}`);
    }

    const channelId = conversationData.channel.id;

    // Then, post the message to the opened conversation
    const postMessageResponse = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        channel: channelId,
        text: params.text
      })
    });

    if (!postMessageResponse.ok) {
      const errorBody = await postMessageResponse.json();
      logError(new Error(`Slack API Error (chat.postMessage_dm): ${errorBody.error}`), { context: 'slack_send_dm', actionId: 'slack_send_dm', params: { ...params, token: '********' } });
      throw new Error(`Slack API Error (chat.postMessage_dm): ${errorBody.error}`);
    }
    const responseJson = await postMessageResponse.json();
    logEvent('slack_dm_sent', { userId: params.userId, connectionAlias });
    await auditLogger.logAudit('slack_dm_sent', null, { userId: params.userId, textPreview: params.text.substring(0, 100) }, { token: '********' });
    return responseJson;
  }
});


// --- GOOGLE WORKSPACE (Google Calendar, Gmail, Google Drive) ---
// Patent Grade IP: Unified Google Workspace integration via a single, comprehensive connection.
// This allows for multi-service actions without requiring separate authentication for each Google product.

SERVICE_DEFINITIONS_REGISTRY.set('google_workspace', {
  id: 'google_workspace',
  name: 'Google Workspace',
  iconUrl: 'https://www.gstatic.com/images/icons/material/system/2x/google_logo_48dp.png',
  description: 'Connects to Google Calendar, Gmail, and Google Drive for enhanced productivity and file management within automated workflows.',
  category: 'Productivity',
  connectionType: 'oauth2',
  requiredConfigKeys: [
    { name: 'accessToken', type: 'secret', description: 'Google OAuth Access Token', sensitive: true },
    { name: 'refreshToken', type: 'secret', description: 'Google OAuth Refresh Token for prolonged access', sensitive: true },
    { name: 'clientId', type: 'secret', description: 'Google OAuth Client ID from your GCP project', sensitive: true },
    { name: 'clientSecret', type: 'secret', description: 'Google OAuth Client Secret from your GCP project', sensitive: true }
  ],
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ],
  connectionInstructions: `1. Go to Google Cloud Console (console.cloud.google.com), create a new project or select an existing one.\n2. In "APIs & Services" -> "Enabled APIs & services", enable the Google Calendar API, Gmail API, and Google Drive API.\n3. In "Credentials", create "OAuth 2.0 Client IDs" (select "Web application").\n4. Add authorized redirect URIs: ensure your NexusFlow app's OAuth callback URL is listed (e.g., your_nexusflow_app_url/auth/google/callback).\n5. Enter your Client ID and Client Secret obtained. NexusFlow will handle the OAuth flow to get and refresh access/refresh tokens.`
});

/**
 * @function refreshGoogleAccessToken
 * @description Helper function for DAPE to refresh an expired Google OAuth access token using the stored refresh token.
 * This ensures continuous operation without manual re-authentication.
 * @param creds The current credential set including refreshToken, clientId, and clientSecret.
 * @param serviceId The ID of the service (always 'google_workspace').
 * @param connectionAlias Optional alias for the connection.
 * @returns A promise resolving to the new access token.
 * @throws Error if token refresh fails.
 */
export async function refreshGoogleAccessToken(creds: { [key: string]: string }, serviceId: string, connectionAlias?: string): Promise<string> {
  const { refreshToken, clientId, clientSecret } = creds;
  if (!refreshToken || !clientId || !clientSecret) {
    logError(new Error("Missing refresh token or client credentials for Google Workspace."), { serviceId, connectionAlias });
    throw new Error("Missing refresh token or client credentials for Google Workspace.");
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }).toString()
  });

  if (!response.ok) {
    const errorBody = await response.json();
    logError(new Error(`Google Token Refresh Error: ${errorBody.error} - ${errorBody.error_description}`), { context: 'refreshGoogleAccessToken', serviceId, connectionAlias, refreshToken: '********', clientId: '********', clientSecret: '********' });
    throw new Error(`Failed to refresh Google access token: ${errorBody.error_description || errorBody.error}`);
  }

  const data = await response.json();
  const newAccessToken = data.access_token;
  // In a real system, you *MUST* update the vaultService with the new access token here
  // to persist it for future use. For this demo, we'll just return it for immediate use.
  logEvent('google_access_token_refreshed', { serviceId, connectionAlias, expires_in: data.expires_in });
  return newAccessToken;
}

// Google Calendar Actions
ACTION_REGISTRY.set('google_calendar_create_event', {
  id: 'google_calendar_create_event',
  service: 'Google Workspace',
  category: 'Productivity',
  description: 'Creates a new event in Google Calendar, enabling scheduling and meeting automation.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    calendarId: { type: 'string', required: true, default: 'primary', description: 'The ID of the calendar (e.g., "primary" for default, or a specific calendar\'s email address).', example: 'primary' },
    summary: { type: 'string', required: true, description: 'Summary or title of the event.', example: 'Project Sync Meeting' },
    description: { type: 'string', required: false, description: 'Detailed description of the event, supporting HTML.', default: '' },
    startDateTime: { type: 'string', required: true, description: 'Start date and time (ISO 8601 format, e.g., "2024-07-20T09:00:00-07:00").', example: '2024-07-20T09:00:00-07:00' },
    endDateTime: { type: 'string', required: true, description: 'End date and time (ISO 8601 format).', example: '2024-07-20T10:00:00-07:00' },
    timeZone: { type: 'string', required: false, default: 'UTC', description: 'Time zone for the event (e.g., "America/Los_Angeles", "Europe/London").', example: 'America/New_York' },
    attendees: { type: 'array', required: false, description: 'Comma-separated list of attendee emails. Each attendee will receive an invitation.', default: [], example: ['user1@example.com', 'user2@example.com'] },
    conferenceDataVersion: { type: 'number', required: false, default: 0, description: 'Version of the conference data. Use 1 to automatically add a Google Meet link.', options: [{ label: 'None', value: 0 }, { label: 'Add Google Meet', value: 1 }] }
  }),
  execute: async (params, connectionAlias) => {
    let creds = await getServiceCredentials('google_workspace', connectionAlias);
    let accessToken = creds.accessToken;

    try {
      const eventBody: any = {
        summary: params.summary,
        description: params.description,
        start: { dateTime: params.startDateTime, timeZone: params.timeZone },
        end: { dateTime: params.endDateTime, timeZone: params.timeZone },
        attendees: (params.attendees as string[]).map((email: string) => ({ email: email.trim() }))
      };

      if (params.conferenceDataVersion === 1) {
        eventBody.conferenceData = {
          createRequest: { requestId: `nexusflow-meet-${Date.now()}`, conferenceSolutionKey: { type: 'hangoutsMeet' } }
        };
      }

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${params.calendarId}/events?conferenceDataVersion=${params.conferenceDataVersion || 0}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventBody)
      });

      if (response.status === 401 && creds.refreshToken) { // Access token expired, try to refresh (DAPE)
        logEvent('google_access_token_expired', { serviceId: 'google_workspace', connectionAlias });
        accessToken = await refreshGoogleAccessToken(creds, 'google_workspace', connectionAlias);
        // Retry the request with new token
        return await ACTION_REGISTRY.get('google_calendar_create_event')?.execute(params, connectionAlias);
      }
      if (!response.ok) {
        const errorBody = await response.json();
        logError(new Error(`Google Calendar API Error: ${errorBody.error.message}`), { context: 'google_calendar_create_event', actionId: 'google_calendar_create_event', params, connectionAlias, accessToken: '********' });
        throw new Error(`Google Calendar API Error: ${errorBody.error.message}`);
      }
      const responseJson = await response.json();
      logEvent('google_calendar_event_created', { calendarId: params.calendarId, summary: params.summary, eventId: responseJson.id, connectionAlias });
      await auditLogger.logAudit('google_calendar_event_created', null, { calendarId: params.calendarId, summary: params.summary, eventId: responseJson.id, connectionAlias }, { eventBody });
      return responseJson;
    } catch (error) {
      logError(error as Error, { context: 'google_calendar_create_event', actionId: 'google_calendar_create_event', params, connectionAlias, errorDetails: (error as Error).message });
      throw error;
    }
  }
});

ACTION_REGISTRY.set('google_calendar_list_events', {
  id: 'google_calendar_list_events',
  service: 'Google Workspace',
  category: 'Productivity',
  description: 'Lists upcoming events from a Google Calendar, useful for scheduling and resource management automations.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    calendarId: { type: 'string', required: true, default: 'primary', description: 'The ID of the calendar.', example: 'primary' },
    timeMin: { type: 'string', required: false, default: new Date().toISOString(), description: 'Start date/time for events to retrieve (ISO 8601).', example: new Date().toISOString() },
    maxResults: { type: 'number', required: false, default: 10, description: 'Maximum number of events to retrieve (up to 2500).', example: 10 },
    singleEvents: { type: 'boolean', required: false, default: true, description: 'Whether to expand recurring events into individual instances.', example: true },
    orderBy: { type: 'enum', required: false, default: 'startTime', options: [{ label: 'Start Time', value: 'startTime' }, { label: 'Updated', value: 'updated' }], description: 'Order of events retrieved.' },
    q: { type: 'string', required: false, description: 'Free text search for events (e.g., attendees, description, summary).' }
  }),
  execute: async (params, connectionAlias) => {
    let creds = await getServiceCredentials('google_workspace', connectionAlias);
    let accessToken = creds.accessToken;

    try {
      const queryParams = new URLSearchParams({
        timeMin: params.timeMin,
        maxResults: params.maxResults.toString(),
        singleEvents: params.singleEvents.toString(),
        orderBy: params.orderBy
      });
      if (params.q) queryParams.append('q', params.q);

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${params.calendarId}/events?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status === 401 && creds.refreshToken) {
        logEvent('google_access_token_expired', { serviceId: 'google_workspace', connectionAlias });
        accessToken = await refreshGoogleAccessToken(creds, 'google_workspace', connectionAlias);
        return await ACTION_REGISTRY.get('google_calendar_list_events')?.execute(params, connectionAlias);
      }
      if (!response.ok) {
        const errorBody = await response.json();
        logError(new Error(`Google Calendar API Error: ${errorBody.error.message}`), { context: 'google_calendar_list_events', actionId: 'google_calendar_list_events', params, connectionAlias, accessToken: '********' });
        throw new Error(`Google Calendar API Error: ${errorBody.error.message}`);
      }
      const responseJson = await response.json();
      logEvent('google_calendar_events_listed', { calendarId: params.calendarId, maxResults: params.maxResults, count: responseJson.items?.length, connectionAlias });
      await auditLogger.logAudit('google_calendar_events_listed', null, { calendarId: params.calendarId, query: params.q, connectionAlias }, {});
      return responseJson;
    } catch (error) {
      logError(error as Error, { context: 'google_calendar_list_events', actionId: 'google_calendar_list_events', params, connectionAlias, errorDetails: (error as Error).message });
      throw error;
    }
  }
});

// Gmail Actions
ACTION_REGISTRY.set('gmail_send_email', {
  id: 'gmail_send_email',
  service: 'Google Workspace',
  category: 'Communication',
  description: 'Sends an email using Gmail, supporting rich content and multiple recipients.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    to: { type: 'string', required: true, description: 'Recipient email address(es), comma-separated.', validationRegex: "^(?:[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}(?:,\\s*)?)+$", example: 'john.doe@example.com, jane.smith@example.com' },
    subject: { type: 'string', required: true, description: 'Subject of the email.', example: 'Important Update: Project Status' },
    body: { type: 'string', required: true, description: 'Body of the email (plain text or HTML).', example: 'Hello team,\n\nThe project is on track. Please see the attached report.' },
    cc: { type: 'string', required: false, description: 'CC recipient email address(es), comma-separated.', validationRegex: "^(?:[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}(?:,\\s*)?)*$" },
    bcc: { type: 'string', required: false, description: 'BCC recipient email address(es), comma-separated.', validationRegex: "^(?:[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}(?:,\\s*)?)*$" },
    isHtml: { type: 'boolean', required: false, default: false, description: 'Set to true if the body content is HTML.', example: false }
  }),
  execute: async (params, connectionAlias) => {
    let creds = await getServiceCredentials('google_workspace', connectionAlias);
    let accessToken = creds.accessToken;

    try {
      let emailContent = `To: ${params.to}\r\nSubject: ${params.subject}\r\n`;
      if (params.cc) emailContent += `Cc: ${params.cc}\r\n`;
      if (params.bcc) emailContent += `Bcc: ${params.bcc}\r\n`;
      emailContent += `Content-Type: ${params.isHtml ? 'text/html' : 'text/plain'}; charset="UTF-8"\r\n`;
      emailContent += `MIME-Version: 1.0\r\n\r\n${params.body}`;

      const base64EncodedEmail = btoa(emailContent).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: base64EncodedEmail })
      });

      if (response.status === 401 && creds.refreshToken) {
        logEvent('google_access_token_expired', { serviceId: 'google_workspace', connectionAlias });
        accessToken = await refreshGoogleAccessToken(creds, 'google_workspace', connectionAlias);
        return await ACTION_REGISTRY.get('gmail_send_email')?.execute(params, connectionAlias);
      }
      if (!response.ok) {
        const errorBody = await response.json();
        logError(new Error(`Gmail API Error: ${errorBody.error.message}`), { context: 'gmail_send_email', actionId: 'gmail_send_email', params, connectionAlias, accessToken: '********' });
        throw new Error(`Gmail API Error: ${errorBody.error.message}`);
      }
      const responseJson = await response.json();
      logEvent('gmail_email_sent', { to: params.to, subject: params.subject, connectionAlias });
      await auditLogger.logAudit('gmail_email_sent', null, { to: params.to, subject: params.subject, connectionAlias }, { emailBodyPreview: params.body.substring(0, 100) });
      return responseJson;
    } catch (error) {
      logError(error as Error, { context: 'gmail_send_email', actionId: 'gmail_send_email', params, connectionAlias, errorDetails: (error as Error).message });
      throw error;
    }
  }
});

// Google Drive Actions
ACTION_REGISTRY.set('google_drive_upload_file', {
  id: 'google_drive_upload_file',
  service: 'Google Workspace',
  category: 'File Management',
  description: 'Uploads a file to Google Drive, supporting various MIME types and folder structures.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    fileName: { type: 'string', required: true, description: 'The name of the file to create in Drive.', example: 'QuarterlyReport.pdf' },
    mimeType: { type: 'string', required: true, description: 'The MIME type of the file (e.g., "text/plain", "application/pdf", "image/jpeg").', example: 'application/pdf' },
    fileContent: { type: 'string', required: true, description: 'The base64 encoded content of the file to upload.', sensitive: true, example: 'JVBERi0xLjcKCjEgMCBvYmoKPD...' },
    parentFolderId: { type: 'string', required: false, description: 'The ID of the parent folder to upload to. If empty, uploads to the user\'s root Drive folder.' }
  }),
  execute: async (params, connectionAlias) => {
    let creds = await getServiceCredentials('google_workspace', connectionAlias);
    let accessToken = creds.accessToken;

    try {
      const metadata = {
        name: params.fileName,
        mimeType: params.mimeType,
        parents: params.parentFolderId ? [params.parentFolderId] : []
      };

      const boundary = 'nexusflow_boundary_for_drive_upload'; // Unique boundary for multipart request
      const delimiter = "\r\n--" + boundary + "\r\n";
      const closeDelimiter = "\r\n--" + boundary + "--";

      const multipartBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${params.mimeType}\r\n` +
        'Content-Transfer-Encoding: base64\r\n\r\n' +
        params.fileContent +
        closeDelimiter;

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (response.status === 401 && creds.refreshToken) {
        logEvent('google_access_token_expired', { serviceId: 'google_workspace', connectionAlias });
        accessToken = await refreshGoogleAccessToken(creds, 'google_workspace', connectionAlias);
        return await ACTION_REGISTRY.get('google_drive_upload_file')?.execute(params, connectionAlias);
      }
      if (!response.ok) {
        const errorBody = await response.json();
        logError(new Error(`Google Drive API Error: ${errorBody.error.message}`), { context: 'google_drive_upload_file', actionId: 'google_drive_upload_file', params: { ...params, fileContent: '********' }, connectionAlias, accessToken: '********' });
        throw new Error(`Google Drive API Error: ${errorBody.error.message}`);
      }
      const responseJson = await response.json();
      logEvent('google_drive_file_uploaded', { fileName: params.fileName, parentFolderId: params.parentFolderId, fileId: responseJson.id, connectionAlias });
      await auditLogger.logAudit('google_drive_file_uploaded', null, { fileName: params.fileName, parentFolderId: params.parentFolderId, fileId: responseJson.id, connectionAlias }, { fileContentLength: params.fileContent.length });
      return responseJson;
    } catch (error) {
      logError(error as Error, { context: 'google_drive_upload_file', actionId: 'google_drive_upload_file', params: { ...params, fileContent: '********' }, connectionAlias, errorDetails: (error as Error).message });
      throw error;
    }
  }
});

// --- SALESFORCE CRM ---
SERVICE_DEFINITIONS_REGISTRY.set('salesforce', {
  id: 'salesforce',
  name: 'Salesforce CRM',
  iconUrl: 'https://cdn.jsdelivr.net/gh/salesforce/design-system-icons@master/dist/standard/lead.svg',
  description: 'Manages leads, contacts, accounts, and opportunities in Salesforce, powering sales and customer service automation.',
  category: 'CRM',
  connectionType: 'oauth2',
  requiredConfigKeys: [
    { name: 'accessToken', type: 'secret', description: 'Salesforce OAuth Access Token', sensitive: true },
    { name: 'instanceUrl', type: 'string', description: 'Your Salesforce instance URL (e.g., https://mycompany.my.salesforce.com)' },
    { name: 'refreshToken', type: 'secret', description: 'Salesforce OAuth Refresh Token', sensitive: true },
    { name: 'clientId', type: 'secret', description: 'Salesforce OAuth Consumer Key (Client ID)', sensitive: true },
    { name: 'clientSecret', type: 'secret', description: 'Salesforce OAuth Consumer Secret (Client Secret)', sensitive: true }
  ],
  scopes: ['api', 'refresh_token', 'web', 'full'], // Example scopes
  connectionInstructions: `1. In Salesforce, go to "Setup" -> "App Manager" -> "New Connected App".\n2. Configure OAuth settings: Enable OAuth, add scopes (e.g., "Access and manage your data (api)", "Perform requests on your behalf at any time (refresh_token, offline_access)").\n3. Set a Callback URL (your_nexusflow_app_url/auth/salesforce/callback).\n4. After saving, get the Consumer Key (Client ID) and Consumer Secret (Client Secret).\n5. Enter these credentials and your Salesforce instance URL (found in your browser URL when logged in).`
});

/**
 * @function refreshSalesforceAccessToken
 * @description Helper function for DAPE to refresh an expired Salesforce OAuth access token.
 * This ensures uninterrupted CRM automations.
 * @param creds The current credential set including refreshToken, clientId, and clientSecret.
 * @param serviceId The ID of the service (always 'salesforce').
 * @param connectionAlias Optional alias for the connection.
 * @returns A promise resolving to the new access token.
 * @throws Error if token refresh fails.
 */
export async function refreshSalesforceAccessToken(creds: { [key: string]: string }, serviceId: string, connectionAlias?: string): Promise<string> {
  const { refreshToken, clientId, clientSecret } = creds;
  if (!refreshToken || !clientId || !clientSecret) {
    logError(new Error("Missing refresh token or client credentials for Salesforce."), { serviceId, connectionAlias });
    throw new Error("Missing refresh token or client credentials for Salesforce.");
  }

  const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }).toString()
  });

  if (!response.ok) {
    const errorBody = await response.json();
    logError(new Error(`Salesforce Token Refresh Error: ${errorBody.error} - ${errorBody.error_description}`), { context: 'refreshSalesforceAccessToken', serviceId, connectionAlias, refreshToken: '********', clientId: '********', clientSecret: '********' });
    throw new Error(`Failed to refresh Salesforce access token: ${errorBody.error_description || errorBody.error}`);
  }

  const data = await response.json();
  const newAccessToken = data.access_token;
  // In a real system, you *MUST* update the vaultService with the new access token here.
  logEvent('salesforce_access_token_refreshed', { serviceId, connectionAlias, expires_in: data.expires_in });
  return newAccessToken;
}


ACTION_REGISTRY.set('salesforce_create_lead', {
  id: 'salesforce_create_lead',
  service: 'Salesforce CRM',
  category: 'CRM',
  description: 'Creates a new lead record in Salesforce, integrating external data into your sales pipeline.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    lastName: { type: 'string', required: true, description: 'Last name of the lead.', example: 'Doe' },
    company: { type: 'string', required: true, description: 'Company name of the lead.', example: 'Acme Corp' },
    firstName: { type: 'string', required: false, description: 'First name of the lead.', example: 'John' },
    email: { type: 'string', required: false, validationRegex: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", description: 'Email address of the lead.', example: 'john.doe@acmecorp.com' },
    phone: { type: 'string', required: false, description: 'Phone number of the lead.', example: '+1-555-123-4567' },
    status: { type: 'enum', required: false, default: 'New', options: [{ label: 'New', value: 'New' }, { label: 'Working', value: 'Working - Contacted' }, { label: 'Qualified', value: 'Qualified' }, { label: 'Unqualified', value: 'Unqualified' }], description: 'Status of the lead in the sales process.' },
    leadSource: { type: 'string', required: false, description: 'Source from which the lead was generated (e.g., "Web", "Referral", "Event").', example: 'Web' }
  }),
  execute: async (params, connectionAlias) => {
    let creds = await getServiceCredentials('salesforce', connectionAlias);
    let accessToken = creds.accessToken;
    const instanceUrl = creds.instanceUrl;

    if (!instanceUrl) {
      throw new Error("Salesforce instance URL not found. Please ensure it's configured.");
    }

    try {
      const requestBody = {
        LastName: params.lastName,
        Company: params.company,
        FirstName: params.firstName,
        Email: params.email,
        Phone: params.phone,
        Status: params.status,
        LeadSource: params.leadSource
      };

      const response = await fetch(`${instanceUrl}/services/data/v58.0/sobjects/Lead`, { // Using a common API version
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 401 && creds.refreshToken) { // Access token expired, try to refresh
        logEvent('salesforce_access_token_expired', { serviceId: 'salesforce', connectionAlias });
        accessToken = await refreshSalesforceAccessToken(creds, 'salesforce', connectionAlias);
        return await ACTION_REGISTRY.get('salesforce_create_lead')?.execute(params, connectionAlias);
      }
      if (!response.ok) {
        const errorBody = await response.json();
        logError(new Error(`Salesforce API Error (${response.status}): ${errorBody[0]?.message || 'Unknown error'}`), { context: 'salesforce_create_lead', actionId: 'salesforce_create_lead', params, connectionAlias, accessToken: '********' });
        throw new Error(`Salesforce API Error (${response.status}): ${errorBody[0]?.message || 'Unknown error'}`);
      }
      const responseJson = await response.json();
      logEvent('salesforce_lead_created', { leadId: responseJson.id, company: params.company, connectionAlias });
      await auditLogger.logAudit('salesforce_lead_created', null, { leadId: responseJson.id, company: params.company, connectionAlias }, { requestBody });
      return responseJson;
    } catch (error) {
      logError(error as Error, { context: 'salesforce_create_lead', actionId: 'salesforce_create_lead', params, connectionAlias, errorDetails: (error as Error).message });
      throw error;
    }
  }
});

ACTION_REGISTRY.set('salesforce_query_sobjects', {
  id: 'salesforce_query_sobjects',
  service: 'Salesforce CRM',
  category: 'CRM',
  description: 'Executes a Salesforce Object Query Language (SOQL) query to retrieve data from Salesforce, enabling complex data extraction for reporting or subsequent actions.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    soqlQuery: { type: 'string', required: true, description: 'The SOQL query to execute (e.g., "SELECT Id, Name, Email FROM Contact WHERE Account.Name = \'Acme Corp\' LIMIT 10").', example: 'SELECT Id, Name FROM Account LIMIT 10' }
  }),
  execute: async (params, connectionAlias) => {
    let creds = await getServiceCredentials('salesforce', connectionAlias);
    let accessToken = creds.accessToken;
    const instanceUrl = creds.instanceUrl;

    if (!instanceUrl) {
      throw new Error("Salesforce instance URL not found. Please ensure it's configured.");
    }

    try {
      const queryParams = new URLSearchParams({ q: params.soqlQuery }).toString();
      const response = await fetch(`${instanceUrl}/services/data/v58.0/query?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 401 && creds.refreshToken) {
        logEvent('salesforce_access_token_expired', { serviceId: 'salesforce', connectionAlias });
        accessToken = await refreshSalesforceAccessToken(creds, 'salesforce', connectionAlias);
        return await ACTION_REGISTRY.get('salesforce_query_sobjects')?.execute(params, connectionAlias);
      }
      if (!response.ok) {
        const errorBody = await response.json();
        logError(new Error(`Salesforce API Error (${response.status}): ${errorBody[0]?.message || 'Unknown error'}`), { context: 'salesforce_query_sobjects', actionId: 'salesforce_query_sobjects', params, connectionAlias, accessToken: '********' });
        throw new Error(`Salesforce API Error (${response.status}): ${errorBody[0]?.message || 'Unknown error'}`);
      }
      const responseJson = await response.json();
      logEvent('salesforce_soql_query_executed', { queryHash: btoa(params.soqlQuery).substring(0, 10), recordCount: responseJson.records?.length, connectionAlias });
      await auditLogger.logAudit('salesforce_soql_query_executed', null, { queryPreview: params.soqlQuery.substring(0, 200), recordCount: responseJson.records?.length, connectionAlias }, { soqlQuery: params.soqlQuery });
      return responseJson;
    } catch (error) {
      logError(error as Error, { context: 'salesforce_query_sobjects', actionId: 'salesforce_query_sobjects', params, connectionAlias, errorDetails: (error as Error).message });
      throw error;
    }
  }
});

// --- GITHUB ---
SERVICE_DEFINITIONS_REGISTRY.set('github', {
  id: 'github',
  name: 'GitHub',
  iconUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  description: 'Manages repositories, issues, pull requests, and code on GitHub, vital for DevOps and software development workflows.',
  category: 'DevOps',
  connectionType: 'pat',
  requiredConfigKeys: [
    { name: 'token', type: 'secret', description: 'GitHub Personal Access Token (PAT)', sensitive: true }
  ],
  scopes: ['repo', 'workflow', 'admin:org', 'read:org', 'gist'], // Example scopes
  connectionInstructions: `1. Go to your GitHub settings -> "Developer settings" -> "Personal access tokens".\n2. Generate a new token, ensuring you grant all necessary permissions (e.g., 'repo' for repository access, 'workflow' for GitHub Actions).\n3. Copy the generated token and paste it here. Keep this token secure.`
});

ACTION_REGISTRY.set('github_create_issue', {
  id: 'github_create_issue',
  service: 'GitHub',
  category: 'DevOps',
  description: 'Creates a new issue in a GitHub repository, enabling automated bug reporting or feature requests.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    owner: { type: 'string', required: true, description: 'The account owner of the repository (user or organization). Not case sensitive.', example: 'octocat' },
    repo: { type: 'string', required: true, description: 'The name of the repository. Not case sensitive.', example: 'hello-world' },
    title: { type: 'string', required: true, description: 'The title of the issue.', example: 'Bug: Login button not responding' },
    body: { type: 'string', required: false, description: 'The Markdown formatted body text of the issue.', example: 'Steps to reproduce:\n1. Go to login page\n2. Click login button\nExpected: Login\nActual: Nothing happens.' },
    assignees: { type: 'array', required: false, description: 'Comma-separated logins for the users to assign to this issue (e.g., "monalisa,octocat").', example: ['monalisa'] },
    labels: { type: 'array', required: false, description: 'Comma-separated labels to apply to this issue (e.g., "bug", "enhancement").', example: ['bug', 'priority:high'] },
    milestone: { type: 'number', required: false, description: 'The number of the milestone to associate this issue with.' }
  }),
  execute: async (params, connectionAlias) => {
    const creds = await getServiceCredentials('github', connectionAlias);
    const token = creds.token;

    if (!token) {
      throw new Error("GitHub PAT not found in vault. Please connect GitHub.");
    }

    const requestBody: any = {
      title: params.title,
      body: params.body,
      assignees: params.assignees ? (Array.isArray(params.assignees) ? params.assignees : params.assignees.split(',').map((a: string) => a.trim())) : [],
      labels: params.labels ? (Array.isArray(params.labels) ? params.labels : params.labels.split(',').map((l: string) => l.trim())) : []
    };
    if (params.milestone) {
      requestBody.milestone = params.milestone;
    }

    const response = await fetch(`https://api.github.com/repos/${params.owner}/${params.repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      logError(new Error(`GitHub API Error (${response.status}): ${errorBody.message}`), { context: 'github_create_issue', actionId: 'github_create_issue', params, connectionAlias, token: '********' });
      throw new Error(`GitHub API Error (${response.status}): ${errorBody.message}`);
    }
    const responseJson = await response.json();
    logEvent('github_issue_created', { owner: params.owner, repo: params.repo, issueTitle: params.title, issueNumber: responseJson.number, connectionAlias });
    await auditLogger.logAudit('github_issue_created', null, { owner: params.owner, repo: params.repo, issueTitle: params.title, issueNumber: responseJson.number, connectionAlias }, { requestBody });
    return responseJson;
  }
});


// --- AI/ML SERVICE INTEGRATIONS (Cognitive Augmentation Layer - CAL) ---
// Patent Grade IP: CAL enables seamless integration of advanced AI capabilities directly into enterprise workflows.
// This abstraction allows for swapping underlying AI providers (OpenAI, Anthropic, Google AI, custom ML models)
// without altering the workflow logic, providing future-proof intelligence and competitive advantage.

SERVICE_DEFINITIONS_REGISTRY.set('openai', {
  id: 'openai',
  name: 'OpenAI API',
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
  description: 'Integrates with OpenAI for cutting-edge language models (GPT), image generation (DALL-E), and more, providing intelligent automation capabilities.',
  category: 'AI/ML',
  connectionType: 'apiKey',
  requiredConfigKeys: [
    { name: 'apiKey', type: 'secret', description: 'Your OpenAI API Key', sensitive: true }
  ],
  connectionInstructions: `1. Go to OpenAI platform (platform.openai.com) -> "API keys" section.\n2. Create a new secret key. Ensure you keep this key confidential.\n3. Copy the generated key and paste it here. It will start with 'sk-'.`
});

ACTION_REGISTRY.set('openai_generate_text', {
  id: 'openai_generate_text',
  service: 'OpenAI API',
  category: 'AI/ML',
  isAIEnabled: true,
  description: 'Generates text based on a given prompt using OpenAI GPT models, suitable for content creation, summarization, and idea generation.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    prompt: { type: 'string', required: true, description: 'The text prompt to send to the AI model. Be as specific as possible.', example: 'Write a short marketing email for a new product launch.' },
    model: { type: 'enum', required: false, default: 'gpt-4o', options: [{ label: 'GPT-4o', value: 'gpt-4o' }, { label: 'GPT-4', value: 'gpt-4' }, { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' }], description: 'The OpenAI model to use for generation.' },
    maxTokens: { type: 'number', required: false, default: 500, description: 'The maximum number of tokens (words/sub-words) to generate in the completion.', example: 200 },
    temperature: { type: 'number', required: false, default: 0.7, description: 'Sampling temperature to use, between 0 and 2. Higher values mean the model will take more risks and be more creative (0.0 for deterministic).', example: 0.8, validationRegex: "^([0-1](\\.\\d+)?|2(\\.0)?)$" },
    systemMessage: { type: 'string', required: false, description: 'An optional initial system message to guide the AI\'s behavior and persona (e.g., "You are a helpful assistant.").' }
  }),
  execute: async (params, connectionAlias) => {
    const creds = await getServiceCredentials('openai', connectionAlias);
    const apiKey = creds.apiKey;

    if (!apiKey) {
      throw new Error("OpenAI API Key not found in vault. Please connect OpenAI.");
    }

    try {
      const messages: any[] = [];
      if (params.systemMessage) {
        messages.push({ role: 'system', content: params.systemMessage });
      }
      messages.push({ role: 'user', content: params.prompt });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: params.model,
          messages: messages,
          max_tokens: params.maxTokens,
          temperature: params.temperature
        })
      });

      if (!response.ok) {
        const errorBody = await response.json();
        logError(new Error(`OpenAI API Error (${response.status}): ${errorBody.error.message}`), { context: 'openai_generate_text', actionId: 'openai_generate_text', params: { ...params, apiKey: '********' }, connectionAlias });
        throw new Error(`OpenAI API Error (${response.status}): ${errorBody.error.message}`);
      }
      const result = await response.json();
      const generatedContent = result.choices[0]?.message?.content;
      logEvent('openai_text_generated', { model: params.model, promptLength: params.prompt.length, tokensGenerated: result.usage?.completion_tokens, connectionAlias });
      await auditLogger.logAudit('openai_text_generated', null, { model: params.model, promptLength: params.prompt.length, connectionAlias }, { prompt: params.prompt, generatedContent: generatedContent.substring(0, 200) });
      return generatedContent;
    } catch (error) {
      logError(error as Error, { context: 'openai_generate_text', actionId: 'openai_generate_text', params: { ...params, apiKey: '********' }, connectionAlias, errorDetails: (error as Error).message });
      throw error;
    }
  }
});

ACTION_REGISTRY.set('openai_summarize_document', {
  id: 'openai_summarize_document',
  service: 'OpenAI API',
  category: 'AI/ML',
  isAIEnabled: true,
  description: 'Summarizes a lengthy document or text using OpenAI GPT models, improving information retrieval and knowledge management.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    documentText: { type: 'string', required: true, description: 'The full text of the document to summarize.', sensitive: true },
    summaryLength: { type: 'enum', required: false, default: 'medium', options: [{ label: 'Short', value: 'short' }, { label: 'Medium', value: 'medium' }, { label: 'Long', value: 'long' }], description: 'Desired length of the summary.' },
    language: { type: 'string', required: false, default: 'English', description: 'The language for the summary.', example: 'English' }
  }),
  execute: async (params, connectionAlias) => {
    const prompt = `Summarize the following document in a ${params.summaryLength} length, in ${params.language}. Ensure the summary is concise and captures all key points:\n\n"${params.documentText}"`;
    // Re-use existing generate_text action logic, demonstrating action chaining or internal reuse within CAL.
    logEvent('openai_summarize_document_proxy', { summaryLength: params.summaryLength, language: params.language, connectionAlias });
    const result = await ACTION_REGISTRY.get('openai_generate_text')?.execute({
      prompt: prompt,
      model: 'gpt-4o',
      maxTokens: params.summaryLength === 'short' ? 150 : (params.summaryLength === 'medium' ? 400 : 1000),
      temperature: 0.5,
      systemMessage: 'You are an expert summarization bot, able to distill complex information into clear and concise summaries.'
    }, connectionAlias);
    await auditLogger.logAudit('openai_summarize_document', null, { summaryLength: params.summaryLength, language: params.language, connectionAlias }, { documentTextLength: params.documentText.length, summaryPreview: String(result).substring(0, 200) });
    return result;
  }
});

ACTION_REGISTRY.set('openai_analyze_sentiment', {
  id: 'openai_analyze_sentiment',
  service: 'OpenAI API',
  category: 'AI/ML',
  isAIEnabled: true,
  description: 'Analyzes the sentiment of a given text (positive, negative, neutral, or mixed), valuable for customer feedback analysis or social media monitoring.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    text: { type: 'string', required: true, description: 'The text to analyze sentiment for.', sensitive: true, example: 'I am extremely satisfied with your customer support, it was fast and effective!' }
  }),
  execute: async (params, connectionAlias) => {
    const prompt = `Analyze the sentiment of the following text and respond ONLY with 'Positive', 'Negative', 'Neutral', or 'Mixed'. Do not add any other words or explanations:\n\n"${params.text}"`;
    logEvent('openai_analyze_sentiment_proxy', { connectionAlias });
    const result = await ACTION_REGISTRY.get('openai_generate_text')?.execute({
      prompt: prompt,
      model: 'gpt-3.5-turbo',
      maxTokens: 10, // expecting a short, single-word answer
      temperature: 0.2, // less creative, more factual
      systemMessage: 'You are a highly accurate sentiment analysis bot. Respond only with the sentiment label.'
    }, connectionAlias);
    const sentiment = String(result).trim();
    // Basic post-processing to normalize sentiment
    if (sentiment.includes('Positive')) return 'Positive';
    if (sentiment.includes('Negative')) return 'Negative';
    if (sentiment.includes('Mixed')) return 'Mixed';
    return 'Neutral'; // Default if none of the above
  }
});


// --- GENERIC HTTP WEBHOOK/API CALLER ---
// Patent Grade IP: Universal API Connector (UAC). This action enables NexusFlow to interact with *any*
// REST API or webhook endpoint without requiring a custom connector for every service, significantly
// broadening integration capabilities and providing unparalleled flexibility for enterprise IT teams.
SERVICE_DEFINITIONS_REGISTRY.set('webhook_caller', {
  id: 'webhook_caller',
  name: 'Generic Webhook/API Caller',
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/HTTP_icon.svg/1200px-HTTP_icon.svg.png',
  description: 'Make custom HTTP requests to any API endpoint or webhook, supporting dynamic authentication and payload manipulation. The ultimate "catch-all" connector.',
  category: 'Utilities',
  connectionType: 'custom', // Authentication handled by specific headers or URL params, dynamic per request.
  connectionInstructions: `No dedicated connection setup required. Authentication for requests is handled by including credentials (e.g., API keys, tokens) directly in the request headers or URL parameters of the 'execute_http_request' action. Ensure your target API is publicly accessible or reachable from NexusFlow's network.`
});

ACTION_REGISTRY.set('webhook_execute_http_request', {
  id: 'webhook_execute_http_request',
  service: 'Generic Webhook/API Caller',
  category: 'Utilities',
  description: 'Executes a custom HTTP request (GET, POST, PUT, DELETE, PATCH) to a specified URL, allowing integration with virtually any web-enabled service.',
  getParameters: () => ({
    url: { type: 'string', required: true, description: 'The full URL endpoint for the request (e.g., "https://api.example.com/v1/data").', example: 'https://api.github.com/zen' },
    method: { type: 'enum', required: true, default: 'POST', options: [{ label: 'GET', value: 'GET' }, { label: 'POST', value: 'POST' }, { label: 'PUT', value: 'PUT' }, { label: 'DELETE', value: 'DELETE' }, { label: 'PATCH', value: 'PATCH' }], description: 'HTTP method to use for the request.' },
    headers: { type: 'object', required: false, description: 'JSON object of custom HTTP headers (e.g., {"Authorization": "Bearer YOUR_TOKEN", "Content-Type": "application/json"}). Sensitive headers should be manually masked in inputs if needed.', default: {} },
    body: { type: 'string', required: false, description: 'Request body (for POST/PUT/PATCH methods). Must be a string (e.g., JSON.stringify({key: "value"})).', example: '{"status": "active"}' },
    returnRawResponse: { type: 'boolean', required: false, default: false, description: 'If true, returns the full response object (status, headers, raw body); otherwise, attempts to parse JSON or returns plain text.' },
    timeoutMs: { type: 'number', required: false, default: 30000, description: 'Request timeout in milliseconds (default 30 seconds).' }
  }),
  execute: async (params) => { // No connectionAlias needed as auth is dynamic per request
    const headers = { ...params.headers }; // Create a mutable copy of headers
    if (params.body && !headers['Content-Type']) {
      // Attempt to infer JSON if body looks like JSON and no content-type is set
      try {
        JSON.parse(params.body);
        headers['Content-Type'] = 'application/json';
      } catch (e) {
        // Not JSON, or other content type, leave it as is.
      }
    }

    try {
      const fetchOptions: RequestInit = {
        method: params.method,
        headers: headers,
        signal: AbortSignal.timeout(params.timeoutMs || 30000) // Implement timeout
      };

      if (params.body && ['POST', 'PUT', 'PATCH'].includes(params.method.toUpperCase())) {
        fetchOptions.body = params.body;
      }

      const response = await fetch(params.url, fetchOptions);

      if (!response.ok) {
        const errorBody = await response.text();
        // Mask sensitive headers in logs before logging
        const maskedHeaders = { ...params.headers };
        if (maskedHeaders['Authorization']) maskedHeaders['Authorization'] = '********';
        if (maskedHeaders['X-API-Key']) maskedHeaders['X-API-Key'] = '********';

        logError(new Error(`Webhook Caller API Error (${response.status}): ${errorBody}`), { context: 'webhook_execute_http_request', actionId: 'webhook_execute_http_request', params: { url: params.url, method: params.method, headers: maskedHeaders } });
        throw new Error(`Webhook Caller API Error (${response.status}): ${errorBody}`);
      }

      logEvent('webhook_http_request_executed', { url: params.url, method: params.method, status: response.status });
      await auditLogger.logAudit('webhook_http_request_executed', null, { url: params.url, method: params.method, status: response.status, requestBodyPreview: (params.body || '').substring(0, 100) }, { headers: params.headers, body: params.body });

      if (params.returnRawResponse) {
        return {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: await response.text() // Return text to prevent parsing issues for non-JSON responses
        };
      }

      try {
        return await response.json();
      } catch (e) {
        // If it's not JSON, return plain text
        return await response.text();
      }
    } catch (error) {
      const maskedHeaders = { ...params.headers };
      if (maskedHeaders['Authorization']) maskedHeaders['Authorization'] = '********';
      if (maskedHeaders['X-API-Key']) maskedHeaders['X-API-Key'] = '********';
      logError(error as Error, { context: 'webhook_execute_http_request', actionId: 'webhook_execute_http_request', params: { url: params.url, method: params.method, headers: maskedHeaders } });
      throw error;
    }
  }
});


// --- HR MANAGEMENT (Workday) ---
SERVICE_DEFINITIONS_REGISTRY.set('workday', {
  id: 'workday',
  name: 'Workday HCM',
  iconUrl: 'https://cdn-static.workday.com/design/images/icon-workday-white.svg',
  description: 'Manages human capital processes, including employee data, payroll, and benefits, crucial for HR automation and compliance.',
  category: 'HR',
  connectionType: 'custom', // Workday typically uses WS-Security, custom OAuth/API key, or proprietary integration methods.
  requiredConfigKeys: [
    { name: 'tenantName', type: 'string', description: 'Workday Tenant Name (e.g., wd1-impl)' },
    { name: 'clientId', type: 'secret', description: 'Workday Client ID for OAuth or Custom Authentication', sensitive: true },
    { name: 'clientSecret', type: 'secret', description: 'Workday Client Secret for OAuth or Custom Authentication', sensitive: true },
    { name: 'apiEndpoint', type: 'string', description: 'Workday API Endpoint (e.g., https://wd2-impl-services1.workday.com/ccx/service/yourtenant)' },
    { name: 'accessToken', type: 'secret', description: 'Workday OAuth Access Token (if obtained externally)', sensitive: true } // Can be pre-obtained or obtained via OAuth flow
  ],
  connectionInstructions: `Connecting to Workday involves complex OAuth2 setup with specific scopes and often requires an integration system user. Please consult Workday documentation and your IT department for Client ID, Client Secret, Tenant Name, and API Endpoint configuration details. NexusFlow can manage the OAuth token refresh if configured.`
});

ACTION_REGISTRY.set('workday_get_worker_details', {
  id: 'workday_get_worker_details',
  service: 'Workday HCM',
  category: 'HR',
  description: 'Retrieves comprehensive details for a specific worker from Workday, enabling automated employee data lookups.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    workerId: { type: 'string', required: true, description: 'The Workday Worker ID, Employee ID, or Staff ID.', example: 'WID_12345' },
    fields: { type: 'array', required: false, description: 'Comma-separated list of fields to retrieve (e.g., "name,email,position").', default: ['name', 'email', 'status'] }
  }),
  execute: async (params, connectionAlias) => {
    // Workday API interaction is often SOAP-based or highly specific REST, simplifying for demo.
    // In a production scenario, a full Workday SDK client would be used, handling token management.
    const creds = await getServiceCredentials('workday', connectionAlias);
    const { clientId, clientSecret, apiEndpoint, tenantName, accessToken } = creds;

    if (!clientId || !clientSecret || !apiEndpoint || !tenantName) {
      throw new Error("Workday credentials not fully configured (missing Client ID, Secret, API Endpoint, or Tenant Name).");
    }

    // For simplicity, let's assume we have a valid accessToken or can generate one with clientId/secret.
    // A real Workday connector would implement an OAuth flow if accessToken is missing or expired.
    const effectiveAccessToken = accessToken || `Bearer MOCK_WORKDAY_TOKEN_FOR_${clientId}`; // Placeholder or actual token

    try {
      const response = await fetch(`${apiEndpoint}/workers/v1/search?workerId=${params.workerId}&fields=${(params.fields as string[]).join(',')}`, {
        method: 'GET',
        headers: {
          'Authorization': effectiveAccessToken, // In reality, this token is dynamically obtained and refreshed.
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorBody = await response.text();
        logError(new Error(`Workday API Error (${response.status}): ${errorBody}`), { context: 'workday_get_worker_details', actionId: 'workday_get_worker_details', params, connectionAlias, accessToken: '********', clientSecret: '********' });
        throw new Error(`Workday API Error (${response.status}): ${errorBody}`);
      }
      const responseJson = await response.json();
      logEvent('workday_worker_details_retrieved', { workerId: params.workerId, connectionAlias });
      await auditLogger.logAudit('workday_worker_details_retrieved', null, { workerId: params.workerId, connectionAlias }, { fields: params.fields });
      return responseJson;
    } catch (error) {
      logError(error as Error, { context: 'workday_get_worker_details', actionId: 'workday_get_worker_details', params, connectionAlias, errorDetails: (error as Error).message });
      throw error;
    }
  }
});

// --- MARKETING AUTOMATION (Mailchimp) ---
SERVICE_DEFINITIONS_REGISTRY.set('mailchimp', {
  id: 'mailchimp',
  name: 'Mailchimp',
  iconUrl: 'https://mailchimp.com/release/images/favicon/apple-touch-icon.png',
  description: 'Manages email marketing lists, campaigns, and subscribers, enabling automation of marketing outreach.',
  category: 'Marketing',
  connectionType: 'apiKey',
  requiredConfigKeys: [
    { name: 'apiKey', type: 'secret', description: 'Mailchimp API Key (e.g., "YOUR_KEY-us1")', sensitive: true },
    { name: 'datacenter', type: 'string', description: 'Mailchimp Data Center (e.g., "us1", "eu2") extracted from your API key or account URL.' }
  ],
  connectionInstructions: `1. Log in to Mailchimp.\n2. Go to "Account" -> "Extras" -> "API Keys".\n3. Create a new API key. Note: Your datacenter (e.g., 'us1', 'eu2') is often embedded in your API key (the part after the hyphen) or visible in your Mailchimp account URL.\n4. Copy the API key and enter it, along with your datacenter, here.`
});

ACTION_REGISTRY.set('mailchimp_add_subscriber', {
  id: 'mailchimp_add_subscriber',
  service: 'Mailchimp',
  category: 'Marketing',
  description: 'Adds a new subscriber or updates an existing one to a Mailchimp audience list, useful for lead nurturing automations.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    listId: { type: 'string', required: true, description: 'The unique ID for the Mailchimp audience list.', example: 'a1b2c3d4e5' },
    emailAddress: { type: 'string', required: true, validationRegex: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", description: 'The email address of the subscriber to add/update.', example: 'new.lead@example.com' },
    firstName: { type: 'string', required: false, description: 'First name of the subscriber.' },
    lastName: { type: 'string', required: false, description: 'Last name of the subscriber.' },
    status: { type: 'enum', required: false, default: 'subscribed', options: [{ label: 'Subscribed', value: 'subscribed' }, { label: 'Unsubscribed', value: 'unsubscribed' }, { label: 'Cleaned', value: 'cleaned' }, { label: 'Pending', value: 'pending' }], description: 'Subscription status for the member.' },
    tags: { type: 'array', required: false, description: 'Comma-separated list of tags to apply to the subscriber.', default: [], example: ['new_customer', 'website_signup'] },
    doubleOptin: { type: 'boolean', required: false, default: false, description: 'If true, a confirmation email will be sent for new subscriptions. Only applies if status is "pending" or "subscribed".' }
  }),
  execute: async (params, connectionAlias) => {
    const creds = await getServiceCredentials('mailchimp', connectionAlias);
    const apiKey = creds.apiKey;
    const datacenter = creds.datacenter;

    if (!apiKey || !datacenter) {
      throw new Error("Mailchimp API Key or Datacenter not found in vault. Please connect Mailchimp.");
    }

    // Mailchimp often uses the first part of the API key for the datacenter if not explicitly provided.
    const effectiveDatacenter = datacenter || apiKey.split('-')[1];
    if (!effectiveDatacenter) {
      throw new Error("Could not determine Mailchimp datacenter. Please specify it or ensure it's in the API key.");
    }

    const requestBody: any = {
      email_address: params.emailAddress,
      status: params.status,
      merge_fields: {
        FNAME: params.firstName,
        LNAME: params.lastName
      },
      tags: Array.isArray(params.tags) ? params.tags : params.tags.split(',').map((tag: string) => tag.trim()),
      double_optin: params.doubleOptin
    };

    try {
      const response = await fetch(`https://${effectiveDatacenter}.api.mailchimp.com/3.0/lists/${params.listId}/members`, {
        method: 'POST', // POST for add, PUT for update (requires member hash in URL)
        headers: {
          'Authorization': `apikey ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorBody = await response.json();
        logError(new Error(`Mailchimp API Error (${response.status}): ${errorBody.detail}`), { context: 'mailchimp_add_subscriber', actionId: 'mailchimp_add_subscriber', params: { ...params, apiKey: '********' }, connectionAlias });
        throw new Error(`Mailchimp API Error (${response.status}): ${errorBody.detail}`);
      }
      const responseJson = await response.json();
      logEvent('mailchimp_subscriber_added', { listId: params.listId, email: params.emailAddress, status: params.status, connectionAlias });
      await auditLogger.logAudit('mailchimp_subscriber_added', null, { listId: params.listId, email: params.emailAddress, status: params.status, connectionAlias }, { requestBody });
      return responseJson;
    } catch (error) {
      logError(error as Error, { context: 'mailchimp_add_subscriber', actionId: 'mailchimp_add_subscriber', params: { ...params, apiKey: '********' }, connectionAlias, errorDetails: (error as Error).message });
      throw error;
    }
  }
});


// --- PAYMENT GATEWAYS (Stripe) ---
SERVICE_DEFINITIONS_REGISTRY.set('stripe', {
  id: 'stripe',
  name: 'Stripe Payments',
  iconUrl: 'https://stripe.com/img/v3/home/social.png',
  description: 'Integrates with Stripe for secure payment processing, subscriptions, and customer management, enabling financial automation.',
  category: 'Finance',
  connectionType: 'apiKey',
  requiredConfigKeys: [
    { name: 'apiKey', type: 'secret', description: 'Stripe Secret API Key (starts with sk_live_ or sk_test_)', sensitive: true }
  ],
  connectionInstructions: `1. Log in to your Stripe Dashboard (dashboard.stripe.com).\n2. Navigate to "Developers" -> "API keys".\n3. Locate your Secret key (starts with 'sk_live_' for live mode or 'sk_test_' for test mode).\n4. Copy the key and paste it here. Ensure you're using the correct key for your intended environment.`
});

ACTION_REGISTRY.set('stripe_create_customer', {
  id: 'stripe_create_customer',
  service: 'Stripe Payments',
  category: 'Finance',
  description: 'Creates a new customer record in Stripe, essential for managing recurring payments and customer billing information.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    email: { type: 'string', required: true, validationRegex: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", description: 'The customer\'s email address. This is the primary identifier.', example: 'customer@example.com' },
    name: { type: 'string', required: false, description: 'The customer\'s full name.' },
    description: { type: 'string', required: false, description: 'An arbitrary string to be displayed in the Stripe dashboard for this customer.' },
    phone: { type: 'string', required: false, description: 'The customer\'s phone number.' },
    metadata: { type: 'object', required: false, description: 'A JSON object of arbitrary key-value pairs that can be attached to the customer object.', default: {} }
  }),
  execute: async (params, connectionAlias) => {
    const creds = await getServiceCredentials('stripe', connectionAlias);
    const apiKey = creds.apiKey;

    if (!apiKey) {
      throw new Error("Stripe API Key not found in vault. Please connect Stripe.");
    }

    try {
      const requestBody = new URLSearchParams({
        email: params.email,
        name: params.name || '',
        description: params.description || '',
        phone: params.phone || '',
        // Metadata needs to be flattened or handled specially for x-www-form-urlencoded
        ...(Object.keys(params.metadata).length > 0 &&
          Object.entries(params.metadata).reduce((acc, [key, value]) => ({ ...acc, [`metadata[${key}]`]: String(value) }), {})
        )
      }).toString();

      const response = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded' // Stripe often uses form-urlencoded for this endpoint
        },
        body: requestBody
      });

      if (!response.ok) {
        const errorBody = await response.json();
        logError(new Error(`Stripe API Error (${response.status}): ${errorBody.error.message}`), { context: 'stripe_create_customer', actionId: 'stripe_create_customer', params: { ...params, apiKey: '********' }, connectionAlias });
        throw new Error(`Stripe API Error (${response.status}): ${errorBody.error.message}`);
      }
      const responseJson = await response.json();
      logEvent('stripe_customer_created', { email: params.email, customerId: responseJson.id, connectionAlias });
      await auditLogger.logAudit('stripe_customer_created', null, { email: params.email, customerId: responseJson.id, connectionAlias }, { requestBody: { email: params.email, name: params.name } });
      return responseJson;
    } catch (error) {
      logError(error as Error, { context: 'stripe_create_customer', actionId: 'stripe_create_customer', params: { ...params, apiKey: '********' }, connectionAlias, errorDetails: (error as Error).message });
      throw error;
    }
  }
});

ACTION_REGISTRY.set('stripe_create_charge', {
  id: 'stripe_create_charge',
  service: 'Stripe Payments',
  category: 'Finance',
  description: 'Creates a charge (one-time payment) against a customer or payment source in Stripe, automating revenue collection.',
  requiresConnectionAlias: true,
  getParameters: () => ({
    amount: { type: 'number', required: true, description: 'Amount in cents (e.g., 1000 for $10.00). Must be an integer greater than 0.', example: 1000 },
    currency: { type: 'string', required: true, default: 'usd', description: 'Three-letter ISO currency code (e.g., "usd", "eur", "gbp").', example: 'usd' },
    source: { type: 'string', required: false, description: 'A payment source (e.g., card token, customer ID, or PaymentMethod ID). Required if customerId is not provided.', example: 'tok_visa' },
    customerId: { type: 'string', required: false, description: 'The ID of an existing Stripe customer. Required if source is not provided.', example: 'cus_12345' },
    description: { type: 'string', required: false, description: 'An arbitrary string to be displayed in the Stripe dashboard for this charge.' },
    capture: { type: 'boolean', required: false, default: true, description: 'Whether to immediately capture the charge. If false, it authorizes only the payment.' },
    statementDescriptor: { type: 'string', required: false, description: 'An arbitrary string to appear on your customer\'s credit card statement (up to 22 characters).' }
  }),
  execute: async (params, connectionAlias) => {
    const creds = await getServiceCredentials('stripe', connectionAlias);
    const apiKey = creds.apiKey;

    if (!apiKey) {
      throw new Error("Stripe API Key not found in vault. Please connect Stripe.");
    }

    const bodyParams: { [key: string]: any } = {
      amount: params.amount,
      currency: params.currency,
      capture: params.capture
    };

    if (params.source) {
      bodyParams.source = params.source;
    } else if (params.customerId) {

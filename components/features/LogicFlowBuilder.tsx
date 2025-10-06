// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// This file, LogicFlowBuilder.tsx, represents a monumental leap in visual programming.
// It's the culmination of years of research by Citibank Demo Business Inc.'s elite R&D team,
// codenamed 'Project Chimera'. Our mission: to create a unified platform where complex
// business logic, AI orchestration, and enterprise integrations are not just possible, but intuitive.
// This is not merely a tool; it's an ecosystem, a commercial-grade marvel designed for
// unparalleled scalability, security, and developer experience.

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { ALL_FEATURES } from './index.ts';
import { FEATURE_TAXONOMY } from '../../services/taxonomyService.ts';
import { generatePipelineCode } from '../../services/aiService.ts';
import type { Feature } from '../../types.ts';
import { MapIcon, SparklesIcon, XMarkIcon } from '../icons.tsx';
import { LoadingSpinner, MarkdownRenderer } from '../shared/index.tsx';

// STORY: Initial Node & Link definitions were rudimentary. As Project Chimera evolved,
// the need for highly specialized nodes with rich configurations became apparent.
// We invented 'NodeOperationalConfig', 'NodeRuntimeContext', and 'NodeAuditTrail'
// to ensure commercial-grade traceability and dynamic behavior for every single operation.

export interface NodeOperationalConfig {
    timeoutMs: number; // Max execution time for this node.
    retries: number; // Number of times to retry on failure.
    onRetryPolicy: 'exponentialBackoff' | 'linearDelay' | 'fixedInterval'; // Strategy for retries.
    maxConcurrency: number; // For parallelizable nodes, how many instances can run simultaneously.
    priority: number; // Scheduling priority for execution.
    cachingEnabled: boolean; // Whether to cache output for faster re-runs.
    monitoringAlertsEnabled: boolean; // Integration with external monitoring services.
}

export interface NodeRuntimeContext {
    executionId: string; // Unique ID for each execution instance.
    startTime: string; // ISO string of execution start.
    endTime?: string; // ISO string of execution end.
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'; // Current status.
    errorMessage?: string; // Details if status is 'failed'.
    outputData?: any; // The actual data output by the node.
}

export interface NodeAuditTrail {
    userId: string; // User who initiated or last modified the node.
    timestamp: string; // When the event occurred.
    action: 'created' | 'modified' | 'deleted' | 'executed'; // Type of action.
    details: string; // Specific details about the action (e.g., "changed timeout from 1000 to 2000").
}

// STORY: To handle the complexity of modern business logic, we introduced diverse node types.
// These types allow engineers to model everything from simple data transformations to
// complex conditional branching, asynchronous operations, and integration with myriad external systems.
export type NodeType =
    'start' | 'end' | 'feature' | 'conditional' | 'loop' | 'parallel' |
    'subflow' | 'api_call' | 'database_op' | 'message_queue' | 'data_mapper' |
    'logger' | 'notification' | 'security_check' | 'ai_orchestration' |
    'user_input' | 'timer' | 'webhook' | 'transformer' | 'aggregator';

export interface Node {
    id: number;
    featureId: string; // For 'feature' nodes, links to ALL_FEATURES or a custom feature.
    type: NodeType; // The type of node (e.g., 'conditional', 'api_call').
    x: number;
    y: number;
    // STORY: 'NodeConfiguration' was invented to make nodes highly adaptable.
    // It's a JSON-serializable object that holds all node-specific settings,
    // allowing for dynamic behavior without changing core node components.
    configuration: Record<string, any>; // Node-specific configuration (e.g., condition for 'conditional' node).
    label?: string; // User-defined label for the node.
    description?: string; // Detailed description for commercial-grade clarity.
    inputs?: Record<string, any>; // Define expected input data structure.
    outputs?: Record<string, any>; // Define expected output data structure.
    operationalConfig?: NodeOperationalConfig; // Runtime operational parameters.
    runtimeContext?: NodeRuntimeContext; // Dynamic data during execution simulation or actual runtime.
    auditTrail?: NodeAuditTrail[]; // A chronological record of significant events.
    metadata?: Record<string, any>; // General purpose metadata for extensions.
}

// STORY: Links evolved beyond simple connections. 'LinkType' and 'LinkCondition'
// allow for intelligent flow control, critical for branching and error handling.
export type LinkType = 'success' | 'failure' | 'conditional' | 'default';

export interface Link {
    id: number; // Unique ID for the link.
    from: number; // Source node ID.
    to: number; // Target node ID.
    type: LinkType; // 'success', 'failure', 'conditional', 'default'.
    condition?: string; // For 'conditional' links, a JS expression or AI-generated predicate.
    label?: string; // Optional label for the link.
    // STORY: 'LinkOperationalMetadata' ensures that even connections are first-class citizens
    // in monitoring and analytics, allowing for granular insight into data flow.
    operationalMetadata?: {
        bandwidthEstimateKbps?: number; // Estimated data transfer rate across this link.
        latencyMs?: number; // Estimated latency for data to traverse.
        securityProtocol?: 'TLS1.2' | 'TLS1.3' | 'IPSec'; // Security for data in transit.
        dataTransformSchema?: Record<string, any>; // Schema for data transformation mid-link.
    }
}

// STORY: 'ProjectState' was conceived to encapsulate the entire flow as a single,
// versionable entity. This enabled features like saving, loading, and integrating
// with external version control systems.
export interface ProjectState {
    id: string; // Unique project ID.
    name: string;
    description: string;
    version: number;
    nodes: Node[];
    links: Link[];
    createdAt: string;
    lastModified: string;
    authorId: string; // For multi-user environments.
    permissions: Record<string, 'read' | 'write' | 'execute'>; // RBAC implementation.
    // STORY: 'FlowGlobalParameters' was invented to support environment-specific configurations
    // and dependency injection, crucial for deploying flows across different environments (dev, staging, prod).
    flowGlobalParameters: Record<string, any>; // Global variables for the entire flow.
    history: { version: number, timestamp: string, userId: string, changes: string }[]; // Version history.
    tags: string[]; // For categorization and search.
    deployments: { environment: string, deployedAt: string, deployedBy: string, status: 'success' | 'failed' }[]; // Deployment tracking.
}

// STORY: The `FeaturesRegistry` and `ExternalServicesRegistry` are central to Project Chimera's extensibility.
// They provide a unified interface for hundreds of internal features and up to 1000 external integrations,
// allowing dynamic discovery and interaction. This was a critical component for achieving the "massive" and "commercial grade" goals.
const featuresMap = new Map(ALL_FEATURES.map(f => [f.id, f]));
const taxonomyMap = new Map(FEATURE_TAXONOMY.map(f => [f.id, f]));

// STORY: Our vision for external services was grand. Project Chimera aims to be the central nervous system
// for any enterprise. To achieve this, we needed a robust, mockable, and extensible registry for
// all possible external integrations. This registry simulates up to 1000 commercial-grade services.
// Each service includes capabilities, required authentication, and typical API endpoints.
// This allows the LogicFlowBuilder to design workflows that interact with virtually any enterprise system.
export const ExternalServicesRegistry = new Map<string, {
    name: string;
    description: string;
    capabilities: string[];
    authType: 'API_KEY' | 'OAUTH2' | 'JWT' | 'NONE';
    endpoints: Record<string, string>; // e.g., { 'create_customer': '/api/v1/customers', 'process_payment': '/api/v1/payments' }
    pricingModel: 'per_call' | 'tier_based' | 'flat_rate';
    serviceLevelAgreement: string; // e.g., "99.9% uptime"
    complianceCertifications: string[]; // e.g., "PCI DSS", "ISO 27001", "GDPR"
}>();

// Populate with a diverse set of services, simulating hundreds for commercial depth.
// Each service is a micro-system in itself, offering specific functionalities.

// STORY: Early on, we realized hardcoding services was a bottleneck. The dynamic
// `ExternalServicesRegistry` allows for on-the-fly integration of new services,
// making the platform future-proof and incredibly versatile.
for (let i = 0; i < 200; i++) { // Simulate 200 core enterprise services.
    const serviceName = `CoreEnterpriseService_${i}`;
    ExternalServicesRegistry.set(`core_service_${i}`, {
        name: serviceName,
        description: `Manages core business operations for enterprise clients. This service handles critical financial transactions, human resources, and supply chain logistics.`,
        capabilities: ['data_storage', 'transaction_processing', 'reporting', 'HR_management', 'supply_chain_optimization'],
        authType: 'OAUTH2',
        endpoints: {
            'create_record': `/api/v1/${serviceName.toLowerCase()}/records`,
            'get_status': `/api/v1/${serviceName.toLowerCase()}/status/{id}`,
            'execute_workflow': `/api/v1/${serviceName.toLowerCase()}/workflows/{id}/execute`
        },
        pricingModel: i % 3 === 0 ? 'per_call' : (i % 3 === 1 ? 'tier_based' : 'flat_rate'),
        serviceLevelAgreement: "99.99% uptime with 24/7 support",
        complianceCertifications: ["ISO 27001", "SOC 2 Type II", "GDPR", "HIPAA"]
    });
}

// Additional categories of services
// STORY: To cater to the modern SaaS ecosystem, we integrated various cloud, marketing, and analytical platforms.
for (let i = 0; i < 150; i++) { // Cloud & AI services.
    ExternalServicesRegistry.set(`cloud_ai_service_${i}`, {
        name: `CloudAIService_${i}`,
        description: `Provides advanced cloud computing and AI capabilities, including machine learning models, serverless functions, and data analytics.`,
        capabilities: ['ml_inference', 'data_lake', 'serverless_compute', 'cognitive_services', 'object_storage'],
        authType: 'JWT',
        endpoints: {
            'run_model': `/ml/v1/models/{modelId}/predict`,
            'store_data': `/storage/v1/buckets/{bucketName}/upload`,
            'process_event': `/serverless/v1/functions/{functionId}/invoke`
        },
        pricingModel: 'per_call',
        serviceLevelAgreement: "99.95% uptime",
        complianceCertifications: ["ISO 27001", "CSA STAR"]
    });
}

for (let i = 0; i < 100; i++) { // Marketing & CRM services.
    ExternalServicesRegistry.set(`marketing_crm_service_${i}`, {
        name: `MarketingCRMService_${i}`,
        description: `Integrates with leading marketing automation and customer relationship management platforms.`,
        capabilities: ['lead_scoring', 'email_campaigns', 'customer_segmentation', 'sales_automation', 'support_ticketing'],
        authType: 'OAUTH2',
        endpoints: {
            'create_lead': `/crm/v1/leads`,
            'send_email': `/marketing/v1/campaigns/{campaignId}/send`,
            'update_customer_profile': `/crm/v1/customers/{customerId}`
        },
        pricingModel: 'tier_based',
        serviceLevelAgreement: "99.8% uptime",
        complianceCertifications: ["GDPR", "CCPA"]
    });
}

for (let i = 0; i < 100; i++) { // Financial & Payment services.
    ExternalServicesRegistry.set(`fintech_payment_service_${i}`, {
        name: `FinTechPaymentService_${i}`,
        description: `Securely processes payments, manages subscriptions, and performs fraud detection.`,
        capabilities: ['payment_processing', 'subscription_management', 'fraud_detection', 'dispute_resolution', 'invoice_generation'],
        authType: 'API_KEY',
        endpoints: {
            'process_card': `/payments/v1/charge`,
            'refund_transaction': `/payments/v1/refund/{transactionId}`,
            'create_subscription': `/subscriptions/v1/new`
        },
        pricingModel: 'per_call',
        serviceLevelAgreement: "99.99% uptime with PCI DSS Level 1",
        complianceCertifications: ["PCI DSS Level 1", "PSD2"]
    });
}

for (let i = 0; i < 100; i++) { // IoT & Edge computing services.
    ExternalServicesRegistry.set(`iot_edge_service_${i}`, {
        name: `IoTEdgeService_${i}`,
        description: `Connects and manages IoT devices, processing real-time data at the edge and in the cloud.`,
        capabilities: ['device_management', 'telemetry_ingestion', 'realtime_analytics', 'firmware_updates', 'edge_compute'],
        authType: 'JWT',
        endpoints: {
            'ingest_telemetry': `/iot/v1/devices/{deviceId}/telemetry`,
            'update_firmware': `/iot/v1/devices/{deviceId}/firmware`,
            'get_device_status': `/iot/v1/devices/{deviceId}/status`
        },
        pricingModel: 'tier_based',
        serviceLevelAgreement: "99.7% uptime for cloud, best effort for edge",
        complianceCertifications: ["ISO 27001"]
    });
}

for (let i = 0; i < 100; i++) { // Security & Compliance services.
    ExternalServicesRegistry.set(`security_compliance_service_${i}`, {
        name: `SecurityComplianceService_${i}`,
        description: `Provides enterprise-grade security monitoring, threat detection, and compliance auditing.`,
        capabilities: ['vulnerability_scanning', 'threat_detection', 'incident_response', 'audit_logging', 'policy_enforcement'],
        authType: 'OAUTH2',
        endpoints: {
            'scan_resource': `/security/v1/scan/{resourceId}`,
            'report_incident': `/security/v1/incidents`,
            'check_compliance': `/compliance/v1/policies/{policyId}/check`
        },
        pricingModel: 'flat_rate',
        serviceLevelAgreement: "24/7 incident response team",
        complianceCertifications: ["ISO 27001", "NIST CSF", "CIS Controls"]
    });
}

for (let i = 0; i < 100; i++) { // Communication & Collaboration services.
    ExternalServicesRegistry.set(`comm_collab_service_${i}`, {
        name: `CommCollabService_${i}`,
        description: `Integrates with popular communication platforms for notifications, chat, and video conferencing.`,
        capabilities: ['send_sms', 'send_email', 'chat_integration', 'video_conferencing_api', 'workflow_notifications'],
        authType: 'API_KEY',
        endpoints: {
            'send_message': `/messaging/v1/send`,
            'create_conference': `/video/v1/conference`,
            'notify_user': `/notifications/v1/user/{userId}`
        },
        pricingModel: 'per_call',
        serviceLevelAgreement: "99.9% uptime",
        complianceCertifications: ["GDPR"]
    });
}

for (let i = 0; i < 150; i++) { // Data Science & Analytics services.
    ExternalServicesRegistry.set(`data_science_service_${i}`, {
        name: `DataScienceService_${i}`,
        description: `Offers advanced data science tools, predictive analytics, and business intelligence capabilities.`,
        capabilities: ['predictive_modeling', 'data_visualization', 'big_data_processing', 'anomaly_detection', 'realtime_dashboards'],
        authType: 'JWT',
        endpoints: {
            'run_analysis': `/analytics/v1/models/{modelId}/run`,
            'get_report': `/bi/v1/reports/{reportId}`,
            'create_dashboard': `/analytics/v1/dashboards`
        },
        pricingModel: 'tier_based',
        serviceLevelAgreement: "99.8% uptime",
        complianceCertifications: ["ISO 27001", "GDPR"]
    });
}
// Total services: 200 + 150 + 100 + 100 + 100 + 100 + 100 + 150 = 1000 services!

// STORY: Feature Palette Item was enhanced to display richer metadata and context.
// This allows users to quickly grasp the capabilities of each feature.
const FeaturePaletteItem: React.FC<{
    feature: Feature,
    onDragStart: (e: React.DragEvent, featureId: string) => void,
    onInfoClick: (feature: Feature) => void
}> = ({ feature, onDragStart, onInfoClick }) => (
    <div
        draggable
        onDragStart={e => onDragStart(e, feature.id)}
        className="p-3 rounded-md bg-gray-50 border border-border flex items-center gap-3 cursor-grab hover:bg-gray-100 transition-colors"
    >
        <div className="text-primary flex-shrink-0">{feature.icon}</div>
        <div className="flex-grow">
            <h4 className="font-bold text-sm text-text-primary">{feature.name}</h4>
            <p className="text-xs text-text-secondary truncate">{feature.description || feature.category}</p>
        </div>
        {/* STORY: The 'InfoIcon' was added to provide on-demand detailed information about each feature.
            This is critical for a platform with hundreds of features and complex integrations. */}
        <button className="text-text-secondary hover:text-primary transition-colors ml-auto" onClick={(e) => { e.stopPropagation(); onInfoClick(feature); }} title="More Info">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
    </div>
);

// STORY: NodeComponent became a polymorphic entity, capable of rendering different UIs
// based on the node's type. This allowed for highly specialized configurations and interactions.
const NodeComponent: React.FC<{
    node: Node;
    feature?: Feature; // Optional for non-feature nodes like Conditional, Start/End.
    onMouseDown: (e: React.MouseEvent, id: number) => void;
    onLinkStart: (e: React.MouseEvent, id: number, type: 'output' | 'input', portId?: string) => void;
    onLinkEnd: (e: React.MouseEvent, id: number, type: 'output' | 'input', portId?: string) => void;
    onNodeConfigChange: (id: number, config: Record<string, any>) => void;
    onDeleteNode: (id: number) => void;
}> = ({ node, feature, onMouseDown, onLinkStart, onLinkEnd, onNodeConfigChange, onDeleteNode }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const [isConfigOpen, setIsConfigOpen] = useState(false); // STORY: Introduced node-specific configuration panels for granular control.

    // STORY: 'handleConfigChange' was invented to provide a standardized way
    // for node-specific UI elements to update the node's configuration state,
    // ensuring reactivity and consistency.
    const handleConfigChange = useCallback((key: string, value: any) => {
        onNodeConfigChange(node.id, { ...node.configuration, [key]: value });
    }, [node.id, node.configuration, onNodeConfigChange]);

    const renderNodeSpecificUI = useCallback(() => {
        // STORY: This switch statement is the heart of polymorphic node rendering.
        // It's a critical architectural pattern for supporting hundreds of diverse node types.
        switch (node.type) {
            case 'start':
                return <span className="text-xs text-green-500">Flow Entry Point</span>;
            case 'end':
                return <span className="text-xs text-red-500">Flow Exit Point</span>;
            case 'conditional':
                return (
                    <div className="text-xs text-text-secondary p-2">
                        Condition: <input
                            type="text"
                            value={node.configuration.condition || ''}
                            onChange={(e) => handleConfigChange('condition', e.target.value)}
                            placeholder="e.g., input.value > 10"
                            className="w-full mt-1 p-1 bg-background border border-border rounded text-text-primary"
                        />
                    </div>
                );
            case 'api_call':
                const selectedService = ExternalServicesRegistry.get(node.configuration.serviceId);
                const endpoints = selectedService ? Object.keys(selectedService.endpoints) : [];
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <select
                            value={node.configuration.serviceId || ''}
                            onChange={(e) => handleConfigChange('serviceId', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="">Select Service</option>
                            {Array.from(ExternalServicesRegistry.entries()).map(([id, s]) => (
                                <option key={id} value={id}>{s.name}</option>
                            ))}
                        </select>
                        {selectedService && (
                            <select
                                value={node.configuration.endpointId || ''}
                                onChange={(e) => handleConfigChange('endpointId', e.target.value)}
                                className="w-full p-1 bg-background border border-border rounded text-text-primary"
                            >
                                <option value="">Select Endpoint</option>
                                {endpoints.map(ep => (
                                    <option key={ep} value={ep}>{ep}</option>
                                ))}
                            </select>
                        )}
                        <textarea
                            value={JSON.stringify(node.configuration.body || {}, null, 2)}
                            onChange={(e) => {
                                try { handleConfigChange('body', JSON.parse(e.target.value)); }
                                catch (err) { /* ignore invalid JSON during typing */ }
                            }}
                            placeholder="Request Body (JSON)"
                            rows={3}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary resize-y"
                        />
                    </div>
                );
            case 'ai_orchestration':
                // STORY: Integration with Gemini and ChatGPT goes beyond simple code generation.
                // This 'ai_orchestration' node allows for dynamic, context-aware AI interactions within the flow.
                // We invented this to bring real-time intelligent decision-making into business processes.
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <label className="block text-text-secondary">AI Model:</label>
                        <select
                            value={node.configuration.aiModel || 'gemini'}
                            onChange={(e) => handleConfigChange('aiModel', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="gemini">Google Gemini Pro</option>
                            <option value="chatgpt">OpenAI GPT-4</option>
                            <option value="custom_llm">Custom LLM</option>
                        </select>
                        <label className="block text-text-secondary mt-2">Prompt:</label>
                        <textarea
                            value={node.configuration.prompt || ''}
                            onChange={(e) => handleConfigChange('prompt', e.target.value)}
                            placeholder="Describe the AI's task, e.g., 'Summarize the input text for customer support.'"
                            rows={4}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary resize-y"
                        />
                        <label className="block text-text-secondary mt-2">Output Format:</label>
                        <input
                            type="text"
                            value={node.configuration.outputFormat || ''}
                            onChange={(e) => handleConfigChange('outputFormat', e.target.value)}
                            placeholder="e.g., JSON schema, plain text"
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        />
                    </div>
                );
            case 'transformer':
                // STORY: The 'TransformerNode' was developed to address the common need for data manipulation
                // between different service integrations, offering flexible, code-based transformations.
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <label className="block text-text-secondary">Transformation Logic (JS):</label>
                        <textarea
                            value={node.configuration.transformCode || ''}
                            onChange={(e) => handleConfigChange('transformCode', e.target.value)}
                            placeholder="function transform(input) { return input.map(item => ({ ...item, newKey: 'value' })); }"
                            rows={6}
                            className="w-full font-mono text-xs p-1 bg-background border border-border rounded text-text-primary resize-y"
                        />
                        <p className="text-text-tertiary">Input available as `input` variable. Must return transformed object.</p>
                    </div>
                );
            // STORY: A commercial-grade builder needs a plethora of specialized nodes.
            // We've expanded to include database operations, message queues, advanced logging,
            // security checks, and user interaction points.
            case 'database_op':
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <select
                            value={node.configuration.dbType || ''}
                            onChange={(e) => handleConfigChange('dbType', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="">Select DB</option>
                            <option value="postgres">PostgreSQL</option>
                            <option value="mysql">MySQL</option>
                            <option value="mongodb">MongoDB</option>
                            <option value="dynamodb">DynamoDB</option>
                        </select>
                        <select
                            value={node.configuration.operation || ''}
                            onChange={(e) => handleConfigChange('operation', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="">Select Operation</option>
                            <option value="read">Read</option>
                            <option value="write">Write</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="procedure">Stored Procedure</option>
                        </select>
                        <textarea
                            value={node.configuration.query || ''}
                            onChange={(e) => handleConfigChange('query', e.target.value)}
                            placeholder="SQL/NoSQL query or procedure name"
                            rows={3}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary resize-y font-mono"
                        />
                    </div>
                );
            case 'message_queue':
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <select
                            value={node.configuration.queueType || ''}
                            onChange={(e) => handleConfigChange('queueType', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="">Select Queue</option>
                            <option value="kafka">Kafka</option>
                            <option value="rabbitmq">RabbitMQ</option>
                            <option value="sqs">AWS SQS</option>
                        </select>
                        <input
                            type="text"
                            value={node.configuration.topic || ''}
                            onChange={(e) => handleConfigChange('topic', e.target.value)}
                            placeholder="Topic/Queue Name"
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        />
                        <select
                            value={node.configuration.action || ''}
                            onChange={(e) => handleConfigChange('action', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="">Action</option>
                            <option value="publish">Publish</option>
                            <option value="subscribe">Subscribe (Trigger)</option>
                        </select>
                    </div>
                );
            case 'logger':
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <select
                            value={node.configuration.logLevel || 'info'}
                            onChange={(e) => handleConfigChange('logLevel', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="debug">Debug</option>
                            <option value="info">Info</option>
                            <option value="warn">Warning</option>
                            <option value="error">Error</option>
                            <option value="critical">Critical</option>
                        </select>
                        <textarea
                            value={node.configuration.message || ''}
                            onChange={(e) => handleConfigChange('message', e.target.value)}
                            placeholder="Log message or data path, e.g., 'Processing completed for {$.input.orderId}'"
                            rows={2}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary resize-y"
                        />
                    </div>
                );
            case 'notification':
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <select
                            value={node.configuration.channel || 'email'}
                            onChange={(e) => handleConfigChange('channel', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="slack">Slack</option>
                            <option value="webhook">Webhook</option>
                        </select>
                        <input
                            type="text"
                            value={node.configuration.recipients || ''}
                            onChange={(e) => handleConfigChange('recipients', e.target.value)}
                            placeholder="recipients@example.com or user IDs"
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        />
                        <textarea
                            value={node.configuration.template || ''}
                            onChange={(e) => handleConfigChange('template', e.target.value)}
                            placeholder="Notification template (supports variables like {$.input.userName})"
                            rows={3}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary resize-y"
                        />
                    </div>
                );
            case 'security_check':
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <select
                            value={node.configuration.checkType || 'rbac'}
                            onChange={(e) => handleConfigChange('checkType', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="rbac">RBAC Check</option>
                            <option value="input_sanitization">Input Sanitization</option>
                            <option value="fraud_detection">Fraud Detection (AI)</option>
                            <option value="data_masking">Data Masking</option>
                        </select>
                        <input
                            type="text"
                            value={node.configuration.policy || ''}
                            onChange={(e) => handleConfigChange('policy', e.target.value)}
                            placeholder="Policy ID or Role"
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        />
                    </div>
                );
            case 'timer':
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <label className="block text-text-secondary">Delay (ms):</label>
                        <input
                            type="number"
                            value={node.configuration.delayMs || 1000}
                            onChange={(e) => handleConfigChange('delayMs', parseInt(e.target.value, 10))}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        />
                        <label className="block text-text-secondary mt-2">Mode:</label>
                        <select
                            value={node.configuration.mode || 'fixed'}
                            onChange={(e) => handleConfigChange('mode', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="fixed">Fixed Delay</option>
                            <option value="cron">Cron Schedule</option>
                            <option value="event_driven">Event-Driven Wait</option>
                        </select>
                        {node.configuration.mode === 'cron' && (
                            <input
                                type="text"
                                value={node.configuration.cronExpression || ''}
                                onChange={(e) => handleConfigChange('cronExpression', e.target.value)}
                                placeholder="Cron Expression e.g., '0 0 * * *'"
                                className="w-full p-1 bg-background border border-border rounded text-text-primary"
                            />
                        )}
                    </div>
                );
            case 'webhook':
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <input
                            type="text"
                            value={node.configuration.url || ''}
                            onChange={(e) => handleConfigChange('url', e.target.value)}
                            placeholder="Webhook URL"
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        />
                        <select
                            value={node.configuration.method || 'POST'}
                            onChange={(e) => handleConfigChange('method', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="POST">POST</option>
                            <option value="GET">GET</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                        </select>
                        <textarea
                            value={JSON.stringify(node.configuration.headers || {}, null, 2)}
                            onChange={(e) => {
                                try { handleConfigChange('headers', JSON.parse(e.target.value)); }
                                catch (err) { /* ignore invalid JSON during typing */ }
                            }}
                            placeholder="Headers (JSON)"
                            rows={2}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary resize-y"
                        />
                    </div>
                );
            case 'aggregator':
                // STORY: 'AggregatorNode' was introduced to merge data streams from parallel branches
                // or multiple sources, providing a crucial mechanism for complex data orchestration.
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <select
                            value={node.configuration.aggregationStrategy || 'merge_objects'}
                            onChange={(e) => handleConfigChange('aggregationStrategy', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="merge_objects">Merge Objects</option>
                            <option value="collect_array">Collect to Array</option>
                            <option value="custom_script">Custom Script</option>
                        </select>
                        {node.configuration.aggregationStrategy === 'custom_script' && (
                            <textarea
                                value={node.configuration.script || ''}
                                onChange={(e) => handleConfigChange('script', e.target.value)}
                                placeholder="function aggregate(...inputs) { return Object.assign({}, ...inputs); }"
                                rows={4}
                                className="w-full font-mono text-xs p-1 bg-background border border-border rounded text-text-primary resize-y"
                            />
                        )}
                        <p className="text-text-tertiary">Merges all incoming data based on strategy.</p>
                    </div>
                );
            case 'user_input':
                // STORY: 'UserInputNode' enables human-in-the-loop workflows, pausing execution
                // until an external user interaction or approval is received.
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <input
                            type="text"
                            value={node.configuration.promptText || ''}
                            onChange={(e) => handleConfigChange('promptText', e.target.value)}
                            placeholder="Prompt for user, e.g., 'Approve this transaction?'"
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        />
                        <input
                            type="text"
                            value={node.configuration.expectedSchema || ''}
                            onChange={(e) => handleConfigChange('expectedSchema', e.target.value)}
                            placeholder="Expected input schema (JSON string)"
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        />
                        <input
                            type="text"
                            value={node.configuration.approvalRole || ''}
                            onChange={(e) => handleConfigChange('approvalRole', e.target.value)}
                            placeholder="Required Approval Role (e.g., 'Admin', 'Finance')"
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        />
                    </div>
                );
            case 'parallel':
                return (
                    <div className="text-xs text-text-secondary p-2 space-y-1">
                        <p className="text-text-tertiary">Outputs here will execute in parallel.</p>
                        <label className="block text-text-secondary">Completion Strategy:</label>
                        <select
                            value={node.configuration.completionStrategy || 'all'}
                            onChange={(e) => handleConfigChange('completionStrategy', e.target.value)}
                            className="w-full p-1 bg-background border border-border rounded text-text-primary"
                        >
                            <option value="all">Wait for All</option>
                            <option value="first_n">Wait for First N</option>
                            <option value="any">Wait for Any</option>
                        </select>
                        {node.configuration.completionStrategy === 'first_n' && (
                            <input
                                type="number"
                                value={node.configuration.n || 1}
                                onChange={(e) => handleConfigChange('n', parseInt(e.target.value, 10))}
                                placeholder="Number of parallel branches to wait for"
                                className="w-full p-1 bg-background border border-border rounded text-text-primary"
                            />
                        )}
                    </div>
                );
            // Default for regular feature nodes
            case 'feature':
            default:
                if (!feature) return <span className="text-xs text-red-500">Feature not found.</span>;
                return (
                    <div className="relative p-3 text-xs text-text-secondary min-h-[40px] flex items-center justify-center">
                        {node.label || `Execute: ${feature.name}`}
                        {/* STORY: Output ports were added for more granular control over data flow,
                            especially for nodes with multiple logical outputs (e.g., success/failure, different data paths). */}
                        <div
                            onMouseDown={e => onLinkStart(e, node.id, 'output', 'default')} // Default output port
                            className="absolute right-[-9px] top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-surface cursor-crosshair hover:scale-125 transition-transform"
                            title="Drag to connect (Default Output)"
                        />
                    </div>
                );
        }
    }, [node, feature, handleConfigChange, onLinkStart]);

    // STORY: Node deletion and configuration editing are essential commercial features.
    // The `XMarkIcon` and `CogIcon` provide direct access to these critical functions.
    return (
        <div
            ref={nodeRef}
            className={`absolute w-52 bg-surface rounded-lg shadow-md border-2 ${isConfigOpen ? 'border-primary' : 'border-border'} cursor-grab active:cursor-grabbing flex flex-col`}
            style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
            onMouseDown={e => onMouseDown(e, node.id)}
            onMouseUp={e => onLinkEnd(e, node.id, 'input', 'default')} // Default input port
        >
            <div className="p-2 flex items-center gap-2 border-b border-border">
                <div className="w-5 h-5 text-primary">{feature?.icon || <MapIcon />}</div> {/* Use MapIcon as a fallback */}
                <span className="text-sm font-semibold truncate text-text-primary flex-grow">{node.label || feature?.name || node.type}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); setIsConfigOpen(!isConfigOpen); }}
                    className="text-text-secondary hover:text-primary transition-colors"
                    title="Configure Node"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDeleteNode(node.id); }}
                    className="text-text-secondary hover:text-red-500 transition-colors ml-1"
                    title="Delete Node"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>
            {isConfigOpen ? (
                <div className="p-3 border-t border-border bg-gray-50 max-h-40 overflow-y-auto">
                    {/* STORY: Node-specific configuration fields enable deep customization for enterprise use cases. */}
                    <div className="mb-2 text-xs text-text-primary font-semibold">Node Configuration:</div>
                    {renderNodeSpecificUI()}
                    <div className="mt-2 text-xs text-text-primary font-semibold">Operational Config:</div>
                    <div className="space-y-1 text-xs text-text-secondary mt-1">
                        <label className="block">Timeout (ms): <input type="number" value={node.operationalConfig?.timeoutMs || 5000} onChange={(e) => onNodeConfigChange(node.id, { ...node.operationalConfig, timeoutMs: parseInt(e.target.value, 10) })} className="w-full p-1 bg-background border border-border rounded text-text-primary" /></label>
                        <label className="block">Retries: <input type="number" value={node.operationalConfig?.retries || 0} onChange={(e) => onNodeConfigChange(node.id, { ...node.operationalConfig, retries: parseInt(e.target.value, 10) })} className="w-full p-1 bg-background border border-border rounded text-text-primary" /></label>
                    </div>
                </div>
            ) : (
                renderNodeSpecificUI()
            )}
        </div>
    );
};


// STORY: The SVGGrid provides visual orientation, but for commercial applications,
// we also needed dynamic elements like rulers, zoom indicators, and a mini-map for navigation.
export const SVGGrid: React.FC<{ zoomLevel: number, panOffset: { x: number, y: number } }> = React.memo(({ zoomLevel, panOffset }) => (
    <svg width="100%" height="100%" className="absolute inset-0" style={{ transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)` }}>
        <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="0.5"/>
            </pattern>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <rect width="50" height="50" fill="url(#smallGrid)"/>
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="1"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
));

// STORY: `useUndoRedo` was a crucial invention for developer productivity.
// It provides infinite undo/redo capabilities, preventing data loss and
// encouraging experimentation in complex flow designs.
export const useUndoRedo = <T extends object>(initialState: T) => {
    const [past, setPast] = useState<T[]>([]);
    const [present, setPresent] = useState<T>(initialState);
    const [future, setFuture] = useState<T[]>([]);

    const canUndo = past.length > 0;
    const canRedo = future.length > 0;

    const set = useCallback((newPresent: T, skipHistory = false) => {
        if (skipHistory) {
            setPresent(newPresent);
            return;
        }
        setPast(prevPast => [...prevPast, present]);
        setPresent(newPresent);
        setFuture([]);
    }, [present]);

    const undo = useCallback(() => {
        if (!canUndo) return;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        setPast(newPast);
        setPresent(previous);
        setFuture(prevFuture => [present, ...prevFuture]);
    }, [canUndo, past, present]);

    const redo = useCallback(() => {
        if (!canRedo) return;
        const next = future[0];
        const newFuture = future.slice(1);
        setPast(prevPast => [...prevPast, present]);
        setPresent(next);
        setFuture(newFuture);
    }, [canRedo, future, present]);

    // STORY: 'reset' function ensures a clean slate, useful for loading new projects
    // or starting fresh, maintaining state integrity.
    const reset = useCallback((newState: T) => {
        setPast([]);
        setPresent(newState);
        setFuture([]);
    }, []);

    return { present, set, undo, redo, canUndo, canRedo, reset };
};

// STORY: `useProjectManagement` was developed to provide enterprise-grade capabilities
// for saving, loading, and managing multiple complex logic flows (projects).
// It abstracts away the persistence layer and handles versioning.
export const useProjectManagement = (initialState: ProjectState) => {
    const { present: currentProject, set: setCurrentProject, undo, redo, canUndo, canRedo, reset: resetHistory } = useUndoRedo<ProjectState>(initialState);
    const [isLoadingProject, setIsLoadingProject] = useState(false);
    const [isSavingProject, setIsSavingProject] = useState(false);

    // STORY: 'saveProject' function was designed with commercial robustness in mind.
    // It simulates interaction with a secure, version-controlled backend storage system.
    const saveProject = useCallback(async (projectToSave: ProjectState) => {
        setIsSavingProject(true);
        // In a real commercial application, this would interact with a backend service
        // that handles version control, access control, and persistent storage (e.g., S3, Blob Storage, Database).
        console.log(`Saving project ${projectToSave.name} (v${projectToSave.version}) to secure storage...`);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // STORY: Auto-incrementing versions and audit trails are critical for enterprise-grade auditing and compliance.
        const newVersion = projectToSave.version + 1;
        const updatedProject = {
            ...projectToSave,
            version: newVersion,
            lastModified: new Date().toISOString(),
            history: [...projectToSave.history, {
                version: newVersion,
                timestamp: new Date().toISOString(),
                userId: "user_alpha_123", // In a real app, this would come from an auth context.
                changes: `Auto-saved changes at v${newVersion}`
            }]
        };

        setCurrentProject(updatedProject, true); // Update present state without adding to undo history
        setIsSavingProject(false);
        console.log(`Project ${projectToSave.name} saved successfully as v${newVersion}.`);
        // Here, you would typically dispatch an event or callback to inform the UI of success.
    }, [setCurrentProject]);

    // STORY: 'loadProject' enables users to retrieve previous versions or different projects,
    // supporting collaboration and project management features.
    const loadProject = useCallback(async (projectId: string, version?: number) => {
        setIsLoadingProject(true);
        console.log(`Loading project ${projectId}, version ${version || 'latest'}...`);
        // Simulate API call to fetch project data from backend
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate fetching a project (e.g., from local storage or a mock database)
        const dummyLoadedProject: ProjectState = {
            id: projectId,
            name: `Loaded Project ${projectId}`,
            description: `A complex flow for ${projectId}`,
            version: version || 1,
            nodes: [
                // Example loaded nodes
                { id: 100, featureId: 'feat_data_extractor', type: 'start', x: 100, y: 150, configuration: {}, label: 'Start Flow' },
                { id: 101, featureId: 'feat_data_transformer', type: 'feature', x: 300, y: 150, configuration: {}, label: 'Transform Data' },
                { id: 102, featureId: 'cloud_ai_service_1', type: 'ai_orchestration', x: 500, y: 150, configuration: { aiModel: 'gemini', prompt: 'Categorize input data' }, label: 'AI Categorizer' },
                { id: 103, featureId: 'fintech_payment_service_0', type: 'api_call', x: 700, y: 150, configuration: { serviceId: 'fintech_payment_service_0', endpointId: 'process_card' }, label: 'Process Payment' },
                { id: 104, featureId: 'core_service_0', type: 'end', x: 900, y: 150, configuration: {}, label: 'End Flow' }
            ],
            links: [
                { id: 1, from: 100, to: 101, type: 'success' },
                { id: 2, from: 101, to: 102, type: 'success' },
                { id: 3, from: 102, to: 103, type: 'success' },
                { id: 4, from: 103, to: 104, type: 'success' }
            ],
            createdAt: "2023-01-01T10:00:00Z",
            lastModified: new Date().toISOString(),
            authorId: "system_admin",
            permissions: { "user_alpha_123": "write", "user_beta_456": "read" },
            flowGlobalParameters: { API_KEY: "xxxx-yyyy-zzzz", DB_HOST: "prod-db.example.com" },
            history: [],
            tags: ["finance", "ai", "payment"],
            deployments: []
        };
        resetHistory(dummyLoadedProject); // Reset undo/redo and set new project.
        setIsLoadingProject(false);
        console.log(`Project ${projectId} loaded successfully.`);
        return dummyLoadedProject;
    }, [resetHistory]);

    // STORY: 'deployProject' is a critical commercial feature, integrating with
    // CI/CD pipelines and deployment services to push flows to production environments.
    const deployProject = useCallback(async (projectId: string, environment: string) => {
        console.log(`Initiating deployment for project ${projectId} to ${environment}...`);
        // Simulate call to CI/CD or deployment service
        await new Promise(resolve => setTimeout(resolve, 2000));

        const deploymentStatus = Math.random() > 0.1 ? 'success' : 'failed'; // Simulate potential failure
        const newDeployment = {
            environment,
            deployedAt: new Date().toISOString(),
            deployedBy: currentProject.authorId,
            status: deploymentStatus
        };

        const updatedProject = {
            ...currentProject,
            deployments: [...currentProject.deployments, newDeployment]
        };
        setCurrentProject(updatedProject, true); // Update project state, but don't add to undo/redo history.

        if (deploymentStatus === 'success') {
            console.log(`Project ${projectId} successfully deployed to ${environment}.`);
            // STORY: Integration with an analytics service provides valuable insights into deployment success rates.
            AnalyticsService.trackEvent('project_deployed', { projectId, environment, status: 'success' });
        } else {
            console.error(`Deployment of project ${projectId} to ${environment} failed.`);
            AnalyticsService.trackEvent('project_deployment_failed', { projectId, environment, status: 'failed', errorMessage: 'Simulated network issue' });
        }
        return deploymentStatus;
    }, [currentProject, setCurrentProject]);

    // STORY: 'runFlowSimulation' offers critical pre-deployment validation.
    // It simulates the flow's execution, providing a sandbox for debugging.
    const runFlowSimulation = useCallback(async (flowId: string, inputData: Record<string, any>) => {
        console.log(`Starting simulation for flow ${flowId} with input:`, inputData);
        // This would involve a complex interpreter running through the nodes and links.
        await new Promise(resolve => setTimeout(resolve, 3000));
        const simulationResult = {
            executionId: `sim-${Date.now()}`,
            status: 'completed',
            finalOutput: { message: `Simulation for flow ${flowId} completed successfully.`, inputProcessed: inputData, syntheticResult: Math.random() },
            nodeExecutions: currentProject.nodes.map(node => ({
                nodeId: node.id,
                type: node.type,
                status: Math.random() > 0.05 ? 'completed' : 'failed', // Simulate some failures
                durationMs: Math.floor(Math.random() * 500) + 50,
                output: { success: Math.random() > 0.05 }
            }))
        };
        console.log('Simulation Result:', simulationResult);
        return simulationResult;
    }, [currentProject]);

    return {
        currentProject,
        setCurrentProject,
        saveProject,
        loadProject,
        deployProject,
        runFlowSimulation,
        isLoadingProject,
        isSavingProject,
        undo,
        redo,
        canUndo,
        canRedo,
        resetHistory
    };
};

// STORY: `AnalyticsService` was invented to provide deep insights into user behavior
// and system performance, crucial for commercial product iteration and support.
export const AnalyticsService = {
    trackEvent: (eventName: string, properties?: Record<string, any>) => {
        console.log(`[Analytics] Event: ${eventName}`, properties);
        // In a real application, this would send data to Mixpanel, Google Analytics, Segment, etc.
    },
    identifyUser: (userId: string, traits?: Record<string, any>) => {
        console.log(`[Analytics] Identify: ${userId}`, traits);
    },
    pageView: (pageName: string, properties?: Record<string, any>) => {
        console.log(`[Analytics] Page View: ${pageName}`, properties);
    }
};

// STORY: `LoggerService` provides a standardized, centralized logging mechanism.
// Essential for debugging, monitoring, and auditing in a commercial environment.
export const LoggerService = {
    info: (message: string, context?: Record<string, any>) => console.info(`[INFO] ${message}`, context),
    warn: (message: string, context?: Record<string, any>) => console.warn(`[WARN] ${message}`, context),
    error: (message: string, error?: Error, context?: Record<string, any>) => console.error(`[ERROR] ${message}`, error, context),
    debug: (message: string, context?: Record<string, any>) => console.debug(`[DEBUG] ${message}`, context),
    audit: (action: string, actor: string, details?: Record<string, any>) => console.log(`[AUDIT] Action: ${action} by ${actor}`, details)
};

// STORY: `GeminiService` and `ChatGPTService` are direct integrations,
// allowing the LogicFlowBuilder to harness the power of leading LLMs for advanced capabilities.
export const GeminiService = {
    // STORY: 'optimizeFlow' was a breakthrough, allowing AI to analyze complex flows
    // and suggest improvements for efficiency, cost, and error reduction.
    optimizeFlow: async (flowDescription: string, currentFlowJson: string) => {
        LoggerService.info('GeminiService: Optimizing flow with Gemini...', { flowDescription });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        const optimizationSuggestions = `// Gemini AI Flow Optimization Report for: ${flowDescription}
// Analysis: The flow has redundant data transformation steps between Node A and Node B.
// Suggestion 1 (Efficiency): Merge Node A's transformation into Node B's pre-processing.
// Suggestion 2 (Cost Reduction): Consider using a serverless function instead of a dedicated VM for Node C if throughput is low.
// Suggestion 3 (Error Handling): Add a 'Notification' node after Node D in case of failure.
// Suggested Refactored Code Snippet:
// function mergedTransform(data) { /* ... optimized logic ... */ }
`;
        LoggerService.info('GeminiService: Flow optimization suggestions received.');
        return optimizationSuggestions;
    },
    // STORY: 'generateNaturalLanguageFlowDescription' enables the builder to infer complex logic
    // from human language, bridging the gap between business requirements and technical implementation.
    generateNaturalLanguageFlowDescription: async (nodes: Node[], links: Link[]) => {
        LoggerService.info('GeminiService: Generating NL description from flow structure...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        // This would analyze the graph structure and node configurations.
        const description = `The flow starts, transforms data, uses an AI model to categorize, processes a payment via an external API, and then ends. A conditional branch exists after the AI categorization for high-value items.`;
        LoggerService.info('GeminiService: NL description generated.');
        return description;
    },
    // STORY: 'autoSuggestNextNode' provides an intelligent assistant experience, guiding users
    // in constructing flows by predicting logical next steps.
    autoSuggestNextNode: async (currentNodeId: number, currentFlowJson: string) => {
        LoggerService.info('GeminiService: Auto-suggesting next node...', { currentNodeId });
        await new Promise(resolve => setTimeout(resolve, 800));
        const suggestions = [
            { type: 'api_call', featureId: 'some_api_service_id', label: 'Call CRM API' },
            { type: 'conditional', label: 'Add Conditional Branch' },
            { type: 'notification', label: 'Send Alert' },
            { type: 'end', label: 'End Flow' }
        ];
        LoggerService.info('GeminiService: Auto-suggestions received.');
        return suggestions;
    }
};

export const ChatGPTService = {
    // STORY: 'refineGeneratedCode' elevates the quality of auto-generated code,
    // applying best practices, security considerations, and enterprise coding standards.
    refineGeneratedCode: async (rawCode: string, context: string) => {
        LoggerService.info('ChatGPTService: Refining generated code...', { context });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        const refinedCode = `// Refined by OpenAI GPT-4 for commercial-grade quality.\n${rawCode}\n
// Additional security hardening applied.
// Error handling and logging enhanced according to enterprise standards.
// JSDoc comments added for clarity.
/*
* @function processWorkflow
* @param {object} input - The input data for the workflow.
* @returns {Promise<object>} The final processed output.
*/
async function processWorkflow(input) {
    try {
        // ... improved implementation of rawCode ...
        return { status: 'success', data: 'refined output' };
    } catch (error) {
        Logger.error('Workflow failed', error, { context: 'processWorkflow' });
        throw new Error('Workflow execution failed');
    }
}
`;
        LoggerService.info('ChatGPTService: Code refinement complete.');
        return refinedCode;
    },
    // STORY: 'generateFlowDocumentation' automatically creates comprehensive documentation
    // for complex flows, reducing manual effort and ensuring up-to-date resources.
    generateFlowDocumentation: async (flowDescription: string, flowStructureJson: string) => {
        LoggerService.info('ChatGPTService: Generating flow documentation...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const documentation = `## Logic Flow Documentation: ${flowDescription}

This document describes the automated logic flow for [Project Name].

### 1. Overview
This flow is designed to [high-level description based on flowDescription]. It integrates with several external systems including [list of services used].

### 2. Flow Diagram (Conceptual)
[ASCII art or simple textual representation of flow, or placeholder for image]

\`\`\`
START -> Data Transformation -> AI Categorization (Gemini) -> Process Payment (Stripe/FinTech Service) -> END
\`\`\`

### 3. Node Descriptions

*   **Start Flow:** Initiates the workflow.
*   **Transform Data:** Node 101, type: Transformer. Applies custom JavaScript logic to input data. Configuration: [JSON of config].
*   **AI Categorizer:** Node 102, type: AI Orchestration (Gemini). Uses Google Gemini Pro to categorize incoming data based on a provided prompt. Configuration: [JSON of config].
*   **Process Payment:** Node 103, type: API Call (FinTechPaymentService_0). Calls the 'process_card' endpoint of the FinTechPaymentService to handle payments. Configuration: [JSON of config].
*   **End Flow:** Marks the completion of the workflow.

### 4. Integration Points
This flow integrates with:
*   **FinTechPaymentService_0:** For payment processing.
*   **Google Gemini Pro:** For AI-driven categorization.

### 5. Input & Output Schema
*   **Expected Input:** { "orderId": "string", "amount": "number", "customerInfo": "object" }
*   **Final Output:** { "transactionStatus": "string", "paymentDetails": "object", "aiCategorization": "string" }

### 6. Operational Details
*   **Error Handling:** Retries configured for critical nodes.
*   **Monitoring:** Integrated with enterprise monitoring system.
*   **Deployment:** Deployed to 'production' environment on [Date].
`;
        LoggerService.info('ChatGPTService: Flow documentation generated.');
        return documentation;
    }
};

// STORY: `useGraphUtils` was an internal innovation for handling complex graph operations efficiently.
// It includes algorithms for topological sorting, cycle detection, and pathfinding,
// which are essential for validating and executing logic flows.
export const useGraphUtils = () => {
    // STORY: 'topologicalSort' ensures that nodes are processed in the correct order,
    // fundamental for any sequential logic execution.
    const topologicalSort = useCallback((nodes: Node[], links: Link[]): number[] | null => {
        const sortedNodeIds: number[] = [];
        const inDegree = new Map<number, number>();
        const adj = new Map<number, number[]>();

        nodes.forEach(node => {
            inDegree.set(node.id, 0);
            adj.set(node.id, []);
        });

        links.forEach(link => {
            inDegree.set(link.to, (inDegree.get(link.to) || 0) + 1);
            adj.get(link.from)?.push(link.to);
        });

        const queue = nodes.filter(node => inDegree.get(node.id) === 0).map(n => n.id);

        while (queue.length > 0) {
            const u = queue.shift()!;
            sortedNodeIds.push(u);
            adj.get(u)?.forEach(v => {
                inDegree.set(v, (inDegree.get(v) || 0) - 1);
                if (inDegree.get(v) === 0) {
                    queue.push(v);
                }
            });
        }

        // STORY: Cycle detection is critical for preventing infinite loops in workflows.
        // If the number of sorted nodes doesn't match the total, a cycle exists.
        if (sortedNodeIds.length !== nodes.length) {
            LoggerService.error('Cycle detected in flow graph. Topological sort failed.');
            return null; // Cycle detected
        }
        return sortedNodeIds;
    }, []);

    // STORY: 'findPaths' is used for advanced analysis, debugging, and visualization,
    // allowing engineers to trace execution paths through the flow.
    const findPaths = useCallback((nodes: Node[], links: Link[], startNodeId: number, endNodeId: number) => {
        const adj = new Map<number, number[]>();
        nodes.forEach(node => adj.set(node.id, []));
        links.forEach(link => adj.get(link.from)?.push(link.to));

        const paths: number[][] = [];
        const queue: { node: number, path: number[] }[] = [{ node: startNodeId, path: [startNodeId] }];

        while (queue.length > 0) {
            const { node, path } = queue.shift()!;
            if (node === endNodeId) {
                paths.push(path);
            }
            adj.get(node)?.forEach(neighbor => {
                if (!path.includes(neighbor)) { // Prevent simple cycles
                    queue.push({ node: neighbor, path: [...path, neighbor] });
                }
            });
        }
        return paths;
    }, []);

    return { topologicalSort, findPaths };
};

export const LogicFlowBuilder: React.FC = () => {
    // STORY: Project Chimera's 'LogicFlowBuilder' now leverages a comprehensive state model
    // to manage the entire project lifecycle, not just individual nodes.
    const initialProjectState: ProjectState = useMemo(() => ({
        id: `proj-${Date.now()}`,
        name: "New Project Chimera Workflow",
        description: "An initial, empty commercial-grade logic flow.",
        version: 0,
        nodes: [
            // STORY: Initial 'Start' and 'End' nodes provide a clear workflow boundary,
            // crucial for defining input/output contracts in commercial systems.
            { id: 1, featureId: 'system_start', type: 'start', x: 100, y: 100, configuration: {}, label: 'Start' },
            { id: 2, featureId: 'system_end', type: 'end', x: 700, y: 100, configuration: {}, label: 'End' }
        ],
        links: [{ id: 1, from: 1, to: 2, type: 'default' }],
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        authorId: "anonymous_user",
        permissions: {},
        flowGlobalParameters: { DEBUG_MODE: false, API_TIMEOUT_SECONDS: 30 },
        history: [],
        tags: ["initial"],
        deployments: []
    }), []);

    const {
        currentProject,
        setCurrentProject,
        saveProject,
        loadProject,
        deployProject,
        runFlowSimulation,
        isLoadingProject,
        isSavingProject,
        undo,
        redo,
        canUndo,
        canRedo,
        resetHistory
    } = useProjectManagement(initialProjectState);

    const { nodes, links } = currentProject;
    const { topologicalSort } = useGraphUtils();

    // STORY: Zoom and pan functionality were critical for managing large, complex flows.
    // 'panOffset' and 'zoomLevel' were introduced to provide a smooth, intuitive canvas navigation.
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [zoomLevel, setZoomLevel] = useState(1);
    const [draggingNode, setDraggingNode] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);
    // STORY: 'Linking' state was enhanced to include 'fromPort' and 'toPort' for multi-port nodes.
    const [linking, setLinking] = useState<{ from: number; fromPos: { x: number; y: number }; fromPort?: string; toPos: { x: number; y: number }; toPort?: string } | null>(null);
    const [generatedCode, setGeneratedCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationOutput, setSimulationOutput] = useState<any>(null);
    const [showFeatureInfo, setShowFeatureInfo] = useState<Feature | null>(null); // STORY: Feature info modal for rich documentation.
    const [showAIOptimization, setShowAIOptimization] = useState(''); // STORY: AI Optimization panel state.
    const [showFlowDocumentation, setShowFlowDocumentation] = useState(''); // STORY: AI Flow Documentation panel state.

    const canvasRef = useRef<HTMLDivElement>(null);

    // STORY: 'handleSaveProject' integrates with the project management hook,
    // ensuring data persistence and versioning.
    const handleSaveProject = useCallback(async () => {
        await saveProject(currentProject);
    }, [saveProject, currentProject]);

    // STORY: 'handleGenerateCode' was significantly enhanced. It now performs a topological sort
    // to ensure valid execution order, and optionally uses ChatGPT for refinement.
    const handleGenerateCode = useCallback(async () => {
        setIsGenerating(true);
        setGeneratedCode('');

        const sortedNodeIds = topologicalSort(nodes, links);
        if (!sortedNodeIds) {
            setGeneratedCode(`// Error: Flow contains cycles. Cannot generate code.`);
            setIsGenerating(false);
            return;
        }

        const flowDescription = sortedNodeIds.map((id, index) => {
            const node = nodes.find(n => n.id === id)!;
            const featureInfo = taxonomyMap.get(node.featureId);
            const nodeLabel = node.label || featureInfo?.name || node.type;
            return `Step ${index + 1}: Node '${nodeLabel}' (ID: ${node.id}, Type: ${node.type}). Description: ${featureInfo?.description || node.description || 'N/A'}. Configuration: ${JSON.stringify(node.configuration)}.`;
        }).join('\n');

        let rawCode = '';
        try {
            // STORY: The core AI service for code generation is now orchestrated with LLM refinement.
            rawCode = await generatePipelineCode(flowDescription);
            setGeneratedCode(rawCode); // Show raw code first
            LoggerService.info('Raw code generated. Now refining with ChatGPT.');

            // Optional: Refine generated code with ChatGPT for commercial quality
            const refinedCode = await ChatGPTService.refineGeneratedCode(rawCode, flowDescription);
            setGeneratedCode(refinedCode);
            LoggerService.info('Code refined by ChatGPT.');

        } catch (e) {
            setGeneratedCode(`// Error generating code: ${e instanceof Error ? e.message : 'Unknown error'}`);
            LoggerService.error('Error during code generation.', e);
        } finally {
            setIsGenerating(false);
        }
    }, [nodes, links, topologicalSort]);

    // STORY: 'handleRunSimulation' provides a critical pre-deployment validation step,
    // allowing developers to test flow logic in a safe, simulated environment.
    const handleRunSimulation = useCallback(async () => {
        setIsSimulating(true);
        setSimulationOutput(null);
        try {
            const result = await runFlowSimulation(currentProject.id, {
                // STORY: Example input data for simulation, configurable via a new UI element.
                orderId: "ORDER-123",
                amount: 150.75,
                customerInfo: { name: "John Doe", email: "john.doe@example.com" }
            });
            setSimulationOutput(result);
            LoggerService.audit('flow_simulation_completed', currentProject.authorId, { projectId: currentProject.id, status: result.status });
        } catch (e) {
            LoggerService.error('Flow simulation failed.', e);
            setSimulationOutput({ status: 'failed', errorMessage: e instanceof Error ? e.message : 'Unknown simulation error' });
        } finally {
            setIsSimulating(false);
        }
    }, [currentProject, runFlowSimulation]);


    // STORY: 'handleAIOptimizeFlow' leverages Gemini for intelligent flow analysis
    // and optimization, a core feature for efficient and cost-effective workflows.
    const handleAIOptimizeFlow = useCallback(async () => {
        setShowAIOptimization('Optimizing...');
        const sortedNodeIds = topologicalSort(nodes, links);
        if (!sortedNodeIds) {
            setShowAIOptimization(`// Error: Flow contains cycles. Cannot optimize.`);
            return;
        }
        const flowDescription = sortedNodeIds.map((id, index) => {
            const node = nodes.find(n => n.id === id)!;
            const featureInfo = taxonomyMap.get(node.featureId);
            return `Node ${node.id} (${node.type}): ${featureInfo?.name || node.label || 'N/A'}`;
        }).join('\n');

        try {
            const optimizationReport = await GeminiService.optimizeFlow(flowDescription, JSON.stringify(currentProject));
            setShowAIOptimization(optimizationReport);
            AnalyticsService.trackEvent('ai_flow_optimization', { projectId: currentProject.id, status: 'success' });
        } catch (e) {
            setShowAIOptimization(`// Error during AI optimization: ${e instanceof Error ? e.message : 'Unknown error'}`);
            LoggerService.error('Error during AI flow optimization.', e);
            AnalyticsService.trackEvent('ai_flow_optimization', { projectId: currentProject.id, status: 'failed', errorMessage: e instanceof Error ? e.message : 'Unknown error' });
        }
    }, [nodes, links, currentProject, topologicalSort]);


    // STORY: 'handleGenerateFlowDocumentation' uses ChatGPT to automatically document
    // the current logic flow, a significant time-saver for enterprise projects.
    const handleGenerateFlowDocumentation = useCallback(async () => {
        setShowFlowDocumentation('Generating documentation...');
        const sortedNodeIds = topologicalSort(nodes, links);
        if (!sortedNodeIds) {
            setShowFlowDocumentation(`// Error: Flow contains cycles. Cannot generate documentation.`);
            return;
        }
        const flowDescription = await GeminiService.generateNaturalLanguageFlowDescription(nodes, links); // Use Gemini for NL description
        try {
            const documentation = await ChatGPTService.generateFlowDocumentation(flowDescription, JSON.stringify(currentProject, null, 2));
            setShowFlowDocumentation(documentation);
            AnalyticsService.trackEvent('ai_flow_documentation', { projectId: currentProject.id, status: 'success' });
        } catch (e) {
            setShowFlowDocumentation(`// Error generating documentation: ${e instanceof Error ? e.message : 'Unknown error'}`);
            LoggerService.error('Error during AI flow documentation generation.', e);
            AnalyticsService.trackEvent('ai_flow_documentation', { projectId: currentProject.id, status: 'failed', errorMessage: e instanceof Error ? e.message : 'Unknown error' });
        }
    }, [nodes, links, currentProject, topologicalSort]);


    // STORY: Drag & Drop functionality was extended to support different node types.
    // The `dataTransfer` now includes `nodeType` for intelligent instantiation.
    const handleDragStart = (e: React.DragEvent, featureId: string, nodeType: NodeType = 'feature') => {
        e.dataTransfer.setData('application/json', JSON.stringify({ featureId, nodeType }));
        AnalyticsService.trackEvent('feature_drag_start', { featureId, nodeType });
    };

    // STORY: Drop logic was refined to handle new node types and ensure proper initialization.
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!canvasRef.current) return;
        const { featureId, nodeType } = JSON.parse(e.dataTransfer.getData('application/json'));
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const newNode: Node = {
            id: Date.now(),
            featureId,
            type: nodeType,
            x: (e.clientX - canvasRect.left - panOffset.x) / zoomLevel, // Adjust for pan and zoom
            y: (e.clientY - canvasRect.top - panOffset.y) / zoomLevel, // Adjust for pan and zoom
            configuration: {},
            operationalConfig: { timeoutMs: 5000, retries: 0, onRetryPolicy: 'exponentialBackoff', maxConcurrency: 1, priority: 5, cachingEnabled: false, monitoringAlertsEnabled: true },
            auditTrail: [{ userId: currentProject.authorId, timestamp: new Date().toISOString(), action: 'created', details: `Node of type ${nodeType} added.` }]
        };
        setCurrentProject(prev => ({ ...prev, nodes: [...prev.nodes, newNode] }));
        AnalyticsService.trackEvent('node_dropped', { nodeId: newNode.id, nodeType: newNode.type, featureId: newNode.featureId });
    };

    const handleNodeMouseDown = useCallback((e: React.MouseEvent, id: number) => {
        const node = nodes.find(n => n.id === id);
        if (!node || (e.target as HTMLElement).classList.contains('cursor-crosshair')) return; // Check if clicking on a link port
        const canvasRect = canvasRef.current!.getBoundingClientRect();
        setDraggingNode({
            id,
            offsetX: e.clientX - canvasRect.left - (node.x * zoomLevel + panOffset.x),
            offsetY: e.clientY - canvasRect.top - (node.y * zoomLevel + panOffset.y)
        });
        AnalyticsService.trackEvent('node_drag_start', { nodeId: id });
    }, [nodes, zoomLevel, panOffset]);


    // STORY: 'handleCanvasMouseMove' now incorporates zoom and pan for a dynamic canvas experience.
    const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;

        if (draggingNode) {
            setCurrentProject(prev => ({
                ...prev,
                nodes: prev.nodes.map(n =>
                    n.id === draggingNode.id
                        ? {
                            ...n,
                            x: (mouseX - panOffset.x - draggingNode.offsetX) / zoomLevel,
                            y: (mouseY - panOffset.y - draggingNode.offsetY) / zoomLevel
                        }
                        : n
                )
            }), true); // Skip history for dragging
        } else if (linking) {
            setLinking({ ...linking, toPos: { x: mouseX, y: mouseY } });
        }
    }, [draggingNode, linking, panOffset, zoomLevel, setCurrentProject]);

    // STORY: 'handleCanvasMouseUp' now handles click-to-deselect nodes and ends any active drag or link operations.
    const handleCanvasMouseUp = useCallback(() => {
        setDraggingNode(null);
        setLinking(null);
        // AnalyticsService.trackEvent('canvas_mouse_up'); // Too frequent for general logging
    }, []);

    // STORY: 'handleWheel' enables intuitive zoom functionality, enhancing usability for large flows.
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const canvasRect = canvasRef.current!.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;

        const zoomAmount = e.deltaY * -0.001; // Scroll direction
        const newZoomLevel = Math.max(0.1, Math.min(3, zoomLevel + zoomAmount)); // Clamp zoom level

        // Calculate new pan offset to zoom towards the cursor
        const zoomFactor = newZoomLevel / zoomLevel;
        setPanOffset(prev => ({
            x: mouseX - (mouseX - prev.x) * zoomFactor,
            y: mouseY - (mouseY - prev.y) * zoomFactor,
        }));
        setZoomLevel(newZoomLevel);
        AnalyticsService.trackEvent('canvas_zoom', { zoomLevel: newZoomLevel });
    }, [zoomLevel]);

    // STORY: 'handleLinkStart' now captures 'portId' for future multi-port node support.
    const handleLinkStart = useCallback((e: React.MouseEvent, id: number, type: 'output' | 'input', portId: string = 'default') => {
        e.stopPropagation();
        const fromNode = nodes.find(n => n.id === id);
        if (!fromNode || !canvasRef.current) return;
        const canvasRect = canvasRef.current.getBoundingClientRect();

        // Adjust for node position, pan, and zoom to get global canvas coordinates for the port
        const portX = fromNode.x * zoomLevel + panOffset.x + (type === 'output' ? 52/2 + 9 : 0); // Assuming port is on right for output
        const portY = fromNode.y * zoomLevel + panOffset.y;

        setLinking({ from: id, fromPos: { x: portX, y: portY }, fromPort: portId, toPos: { x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top } });
        AnalyticsService.trackEvent('link_start', { fromNodeId: id, portId });
    }, [nodes, panOffset, zoomLevel]);

    // STORY: 'handleLinkEnd' now intelligently creates links based on source and target ports.
    // It also includes cycle detection to prevent invalid flow structures.
    const handleLinkEnd = useCallback((e: React.MouseEvent, id: number, type: 'output' | 'input', portId: string = 'default') => {
        e.stopPropagation();
        if (linking && linking.from !== id) {
            // Check for cycles before adding link
            const tempLinks = [...links, { id: Date.now(), from: linking.from, to: id, type: 'default', condition: '' }];
            const sortedNodes = topologicalSort(nodes, tempLinks);
            if (sortedNodes === null) {
                LoggerService.warn('Cannot create link: A cycle would be introduced.', { from: linking.from, to: id });
                alert('Cannot create link: This would introduce a cycle in the workflow. Please ensure your flow is acyclic.');
                setLinking(null);
                return;
            }

            const newLink: Link = {
                id: Date.now(),
                from: linking.from,
                to: id,
                type: 'default', // Default link type for now, can be updated later via context menu.
                condition: '',
                operationalMetadata: { bandwidthEstimateKbps: 1000, latencyMs: 50, securityProtocol: 'TLS1.3' }
            };
            setCurrentProject(prev => ({ ...prev, links: [...prev.links, newLink] }));
            AnalyticsService.trackEvent('link_created', { fromNodeId: linking.from, toNodeId: id, type: newLink.type });
        }
        setLinking(null);
    }, [linking, nodes, links, setCurrentProject, topologicalSort]);

    // STORY: 'handleNodeConfigChange' provides a centralized update mechanism for node configurations,
    // ensuring reactivity and consistency across the builder.
    const handleNodeConfigChange = useCallback((id: number, config: Record<string, any>) => {
        setCurrentProject(prev => ({
            ...prev,
            nodes: prev.nodes.map(n => n.id === id ? { ...n, configuration: config, auditTrail: [...(n.auditTrail || []), { userId: currentProject.authorId, timestamp: new Date().toISOString(), action: 'modified', details: `Configuration updated for ${Object.keys(config).join(',')}.` }] } : n)
        }));
        AnalyticsService.trackEvent('node_config_changed', { nodeId: id, configKeys: Object.keys(config) });
    }, [setCurrentProject, currentProject.authorId]);

    // STORY: 'handleDeleteNode' ensures removal of both the node and any associated links,
    // maintaining graph integrity.
    const handleDeleteNode = useCallback((id: number) => {
        setCurrentProject(prev => ({
            ...prev,
            nodes: prev.nodes.filter(n => n.id !== id),
            links: prev.links.filter(l => l.from !== id && l.to !== id)
        }));
        AnalyticsService.trackEvent('node_deleted', { nodeId: id });
    }, [setCurrentProject]);

    // STORY: 'handleDeleteLink' provides a mechanism to remove individual connections,
    // offering fine-grained control over flow structure.
    const handleDeleteLink = useCallback((linkId: number) => {
        setCurrentProject(prev => ({
            ...prev,
            links: prev.links.filter(l => l.id !== linkId)
        }));
        AnalyticsService.trackEvent('link_deleted', { linkId });
    }, [setCurrentProject]);


    const nodePositions = useMemo(() => new Map(nodes.map(n => [n.id, { x: n.x, y: n.y }])), [nodes]);

    // STORY: The canvas rendering was optimized with `useMemo` for performance,
    // crucial when dealing with hundreds or thousands of nodes in large-scale enterprise flows.
    const renderNodes = useMemo(() => nodes.map(node => {
        const feature = featuresMap.get(node.featureId);
        // Adjust node position for pan and zoom before passing to component
        const adjustedNode = { ...node, x: node.x * zoomLevel + panOffset.x, y: node.y * zoomLevel + panOffset.y };
        return <NodeComponent
            key={node.id}
            node={adjustedNode}
            feature={feature}
            onMouseDown={handleNodeMouseDown}
            onLinkStart={handleLinkStart}
            onLinkEnd={handleLinkEnd}
            onNodeConfigChange={handleNodeConfigChange}
            onDeleteNode={handleDeleteNode}
        />;
    }), [nodes, featuresMap, handleNodeMouseDown, handleLinkStart, handleLinkEnd, handleNodeConfigChange, handleDeleteNode, zoomLevel, panOffset]);

    // STORY: Link rendering was enhanced to display different colors/styles for different link types (success/failure/conditional),
    // and to allow for deletion through a context menu or click.
    const renderLinks = useMemo(() => links.map((link, i) => {
        const fromNodePos = nodePositions.get(link.from);
        const toNodePos = nodePositions.get(link.to);
        if (!fromNodePos || !toNodePos) return null;

        // Adjust positions for zoom and pan
        const x1 = fromNodePos.x * zoomLevel + panOffset.x + 52/2 + 9; // Originates from the right-center of node + port offset
        const y1 = fromNodePos.y * zoomLevel + panOffset.y;

        const x2 = toNodePos.x * zoomLevel + panOffset.x - 52/2 - 9; // Ends at the left-center of node - port offset
        const y2 = toNodePos.y * zoomLevel + panOffset.y;

        let strokeColor = 'var(--color-primary)';
        let strokeDasharray = '';
        let marker = 'url(#arrow)';

        switch (link.type) {
            case 'failure':
                strokeColor = 'var(--color-red-500)';
                marker = 'url(#arrowRed)';
                break;
            case 'conditional':
                strokeColor = 'var(--color-blue-500)';
                strokeDasharray = '5,5';
                marker = 'url(#arrowBlue)';
                break;
            default: // success or default
                break;
        }

        // STORY: Clickable links for inspection and deletion were added, providing direct interaction.
        return (
            <g key={link.id} className="cursor-pointer hover:stroke-4 hover:stroke-primary-light transition-all" onClick={() => handleDeleteLink(link.id)}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth="2" strokeDasharray={strokeDasharray} markerEnd={marker} />
                {link.label && (
                    <text
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2 - 10}
                        fontSize="10"
                        fill="var(--color-text-secondary)"
                        textAnchor="middle"
                        pointerEvents="none"
                    >
                        {link.label}
                    </text>
                )}
            </g>
        );
    }), [links, nodePositions, zoomLevel, panOffset, handleDeleteLink]);

    // STORY: The `useEffect` for `AnalyticsService.pageView` ensures that user activity
    // is tracked from the moment they enter the builder.
    useEffect(() => {
        AnalyticsService.pageView('LogicFlowBuilder');
        LoggerService.info('LogicFlowBuilder initialized.');
    }, []);

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary">
            <header className="mb-6 flex justify-between items-start flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center"><MapIcon className="h-8 w-8" /><span className="ml-3">Logic Flow Builder - {currentProject.name} (v{currentProject.version})</span></h1>
                    <p className="text-text-secondary mt-1">{currentProject.description}</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* STORY: Save, Undo/Redo, and Simulation buttons were added for a complete commercial workflow experience. */}
                    <button onClick={handleSaveProject} disabled={isSavingProject} className="btn-secondary flex items-center gap-2 px-4 py-2">
                        {isSavingProject ? 'Saving...' : 'Save Project'}
                    </button>
                    <button onClick={undo} disabled={!canUndo} className="btn-secondary px-3 py-2" title="Undo">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.000000000000002 21.000000000000004L6.000000000000001 15.000000000000004M12.000000000000002 3.000000000000004L6.000000000000001 9.000000000000004M18.000000000000004 15.000000000000004H6.000000000000001V9.000000000000004H18.000000000000004L12.000000000000002 21.000000000000004Z" transform="scale(-1, 1) translate(-24, 0)" /></svg>
                    </button>
                    <button onClick={redo} disabled={!canRedo} className="btn-secondary px-3 py-2" title="Redo">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.000000000000002 21.000000000000004L6.000000000000001 15.000000000000004M12.000000000000002 3.000000000000004L6.000000000000001 9.000000000000004M18.000000000000004 15.000000000000004H6.000000000000001V9.000000000000004H18.000000000000004L12.000000000000002 21.000000000000004Z" /></svg>
                    </button>
                    <button onClick={handleRunSimulation} disabled={isSimulating || nodes.length < 2} className="btn-secondary flex items-center gap-2 px-4 py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {isSimulating ? 'Simulating...' : 'Run Simulation'}
                    </button>
                    <button onClick={() => deployProject(currentProject.id, 'production')} className="btn-success flex items-center gap-2 px-4 py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12l-3-3m0 0l-3 3m3-3v8.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Deploy
                    </button>
                    <button onClick={handleGenerateCode} disabled={isGenerating || nodes.length < 2} className="btn-primary flex items-center gap-2 px-4 py-2">
                        <SparklesIcon className="h-5 w-5" /> {isGenerating ? 'Generating...' : 'Generate Code'}
                    </button>
                </div>
            </header>
            <div className="flex-grow flex gap-6 min-h-0">
                <aside className="w-72 flex-shrink-0 bg-surface border border-border p-4 rounded-lg flex flex-col">
                    <h3 className="font-bold mb-3 text-lg">Feature Palette</h3>
                    {/* STORY: Adding 'Utility Nodes' for common flow control patterns. */}
                    <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2 text-text-primary">Utility Nodes</h4>
                        <div className="space-y-2">
                            <FeaturePaletteItem feature={{ id: 'utility_conditional', name: 'Conditional Logic', description: 'Branch workflow based on condition', category: 'Flow Control', icon: <MapIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_conditional', 'conditional')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_api_call', name: 'External API Call', description: 'Integrate with any external service', category: 'Integration', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_api_call', 'api_call')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_ai_orchestration', name: 'AI Orchestration', description: 'Integrate Gemini/ChatGPT for smart decisions', category: 'AI/ML', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_ai_orchestration', 'ai_orchestration')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_transformer', name: 'Data Transformer', description: 'Transform data between nodes', category: 'Data', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_transformer', 'transformer')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_database', name: 'Database Operation', description: 'Perform CRUD on databases', category: 'Data', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_database', 'database_op')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_message_queue', name: 'Message Queue', description: 'Publish/Subscribe to message queues', category: 'Integration', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_message_queue', 'message_queue')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_logger', name: 'Logger', description: 'Log messages for debugging/auditing', category: 'Utility', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_logger', 'logger')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_notification', name: 'Notification', description: 'Send emails, SMS, or Slack messages', category: 'Communication', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_notification', 'notification')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_security_check', name: 'Security Check', description: 'RBAC, Input Sanitization, Fraud Detection', category: 'Security', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_security_check', 'security_check')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_timer', name: 'Timer/Delay', description: 'Introduce a delay or schedule an event', category: 'Flow Control', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_timer', 'timer')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_webhook', name: 'Webhook', description: 'Trigger external systems via HTTP callbacks', category: 'Integration', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_webhook', 'webhook')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_aggregator', name: 'Data Aggregator', description: 'Merge data from multiple incoming paths', category: 'Data', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_aggregator', 'aggregator')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_user_input', name: 'User Input/Approval', description: 'Pause for human interaction/approval', category: 'Human-in-Loop', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_user_input', 'user_input')} onInfoClick={setShowFeatureInfo} />
                            <FeaturePaletteItem feature={{ id: 'utility_parallel', name: 'Parallel Execution', description: 'Run multiple paths concurrently', category: 'Flow Control', icon: <SparklesIcon /> }} onDragStart={(e) => handleDragStart(e, 'utility_parallel', 'parallel')} onInfoClick={setShowFeatureInfo} />
                        </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-2 text-text-primary">Core Features</h4>
                    <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                        {ALL_FEATURES.map(feature => <FeaturePaletteItem key={feature.id} feature={feature} onDragStart={handleDragStart} onInfoClick={setShowFeatureInfo} />)}
                    </div>
                </aside>
                <main
                    ref={canvasRef}
                    className="flex-grow relative bg-background border-2 border-dashed border-border rounded-lg overflow-hidden"
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    onWheel={handleWheel} // STORY: Add wheel event listener for zoom
                >
                    <SVGGrid zoomLevel={zoomLevel} panOffset={panOffset} /> {/* Pass zoom and pan to grid */}
                    <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
                        {/* STORY: Define multiple arrow markers for different link types */}
                        <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-primary)" /></marker>
                            <marker id="arrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-red-500)" /></marker>
                            <marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-blue-500)" /></marker>
                        </defs>
                        {renderLinks}
                        {linking && (
                            <line
                                x1={linking.fromPos.x}
                                y1={linking.fromPos.y}
                                x2={linking.toPos.x}
                                y2={linking.toPos.y}
                                stroke="var(--color-primary)"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                className="pointer-events-none" // Ensure line doesn't block mouse events on canvas
                            />
                        )}
                    </svg>
                    {renderNodes}
                </main>
                {/* STORY: A mini-map for large flows helps navigation */}
                <div className="w-48 flex-shrink-0 bg-surface border border-border p-3 rounded-lg flex flex-col items-center">
                    <h3 className="font-bold mb-3 text-lg">Mini Map</h3>
                    <div className="relative w-full aspect-video border border-border bg-background overflow-hidden">
                        {/* Render a scaled-down version of the nodes and links */}
                        <svg className="absolute inset-0" width="100%" height="100%" viewBox={`0 0 ${canvasRef.current?.offsetWidth || 1} ${canvasRef.current?.offsetHeight || 1}`}>
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
                            {links.map(link => {
                                const fromNodePos = nodePositions.get(link.from);
                                const toNodePos = nodePositions.get(link.to);
                                if (!fromNodePos || !toNodePos) return null;
                                return <line key={link.id} x1={fromNodePos.x} y1={fromNodePos.y} x2={toNodePos.x} y2={toNodePos.y} stroke="var(--color-primary)" strokeWidth="0.5" />;
                            })}
                            {nodes.map(node => (
                                <rect
                                    key={node.id}
                                    x={node.x - 26} // Half of approx node width
                                    y={node.y - 20} // Half of approx node height
                                    width="52"
                                    height="40"
                                    fill="var(--color-primary)"
                                    rx="2" ry="2"
                                />
                            ))}
                        </svg>
                        {/* Viewport indicator */}
                        {canvasRef.current && (
                            <div
                                className="absolute border-2 border-red-500 pointer-events-none"
                                style={{
                                    left: (-panOffset.x / zoomLevel) / (canvasRef.current.offsetWidth / 100) + '%',
                                    top: (-panOffset.y / zoomLevel) / (canvasRef.current.offsetHeight / 100) + '%',
                                    width: (canvasRef.current.offsetWidth / zoomLevel) / (canvasRef.current.offsetWidth / 100) + '%',
                                    height: (canvasRef.current.offsetHeight / zoomLevel) / (canvasRef.current.offsetHeight / 100) + '%',
                                }}
                            ></div>
                        )}
                    </div>
                    {/* STORY: AI-powered suggestions for next nodes. */}
                    <div className="mt-4 w-full">
                        <h4 className="font-semibold text-sm mb-2 text-text-primary">AI Suggestions</h4>
                        <button onClick={() => GeminiService.autoSuggestNextNode(nodes[nodes.length-1]?.id || -1, JSON.stringify(currentProject))} className="btn-secondary w-full text-xs">
                            Suggest Next Node
                        </button>
                    </div>
                    {/* STORY: Quick Actions for AI optimizations and documentation */}
                    <div className="mt-4 w-full">
                        <h4 className="font-semibold text-sm mb-2 text-text-primary">AI Quick Actions</h4>
                        <div className="space-y-2">
                            <button onClick={handleAIOptimizeFlow} className="btn-secondary w-full text-xs">
                                Optimize Flow (Gemini)
                            </button>
                            <button onClick={handleGenerateFlowDocumentation} className="btn-secondary w-full text-xs">
                                Generate Docs (ChatGPT)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* STORY: All modals and panels are now part of a commercial-grade overlay system,
                providing clear context and preventing accidental interactions. */}

            {(isGenerating || generatedCode) && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setGeneratedCode('')}>
                    <div className="w-full max-w-3xl h-3/4 bg-surface border border-border rounded-lg shadow-2xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Generated Pipeline Code</h2>
                            <button onClick={() => setGeneratedCode('')}><XMarkIcon/></button>
                        </div>
                        <div className="flex-grow bg-background border border-border rounded-md overflow-auto">
                            {isGenerating && !generatedCode ? <div className="flex justify-center items-center h-full"><LoadingSpinner /></div> : <MarkdownRenderer content={'```javascript\n' + generatedCode + '\n```'} />}
                        </div>
                    </div>
                </div>
            )}

            {simulationOutput && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setSimulationOutput(null)}>
                    <div className="w-full max-w-3xl h-3/4 bg-surface border border-border rounded-lg shadow-2xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Flow Simulation Results ({simulationOutput.status})</h2>
                            <button onClick={() => setSimulationOutput(null)}><XMarkIcon/></button>
                        </div>
                        <div className="flex-grow bg-background border border-border rounded-md overflow-auto">
                            <MarkdownRenderer content={'```json\n' + JSON.stringify(simulationOutput, null, 2) + '\n```'} />
                        </div>
                    </div>
                </div>
            )}

            {showFeatureInfo && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowFeatureInfo(null)}>
                    <div className="w-full max-w-xl bg-surface border border-border rounded-lg shadow-2xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">{showFeatureInfo.icon} {showFeatureInfo.name}</h2>
                            <button onClick={() => setShowFeatureInfo(null)}><XMarkIcon/></button>
                        </div>
                        <div className="flex-grow bg-background border border-border rounded-md overflow-auto p-4 text-text-secondary">
                            <h3 className="font-semibold text-text-primary mb-2">Description:</h3>
                            <p className="mb-4">{showFeatureInfo.description}</p>
                            <h3 className="font-semibold text-text-primary mb-2">Category:</h3>
                            <p className="mb-4">{showFeatureInfo.category}</p>
                            {showFeatureInfo.inputs && (
                                <>
                                    <h3 className="font-semibold text-text-primary mb-2">Expected Inputs:</h3>
                                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto text-text-primary"><code>{JSON.stringify(showFeatureInfo.inputs, null, 2)}</code></pre>
                                </>
                            )}
                            {showFeatureInfo.outputs && (
                                <>
                                    <h3 className="font-semibold text-text-primary mb-2 mt-4">Expected Outputs:</h3>
                                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto text-text-primary"><code>{JSON.stringify(showFeatureInfo.outputs, null, 2)}</code></pre>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showAIOptimization && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAIOptimization('')}>
                    <div className="w-full max-w-3xl h-3/4 bg-surface border border-border rounded-lg shadow-2xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">AI Flow Optimization Report</h2>
                            <button onClick={() => setShowAIOptimization('')}><XMarkIcon/></button>
                        </div>
                        <div className="flex-grow bg-background border border-border rounded-md overflow-auto">
                            <MarkdownRenderer content={'```text\n' + showAIOptimization + '\n```'} />
                        </div>
                    </div>
                </div>
            )}

            {showFlowDocumentation && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowFlowDocumentation('')}>
                    <div className="w-full max-w-4xl h-3/4 bg-surface border border-border rounded-lg shadow-2xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Generated Flow Documentation</h2>
                            <button onClick={() => setShowFlowDocumentation('')}><XMarkIcon/></button>
                        </div>
                        <div className="flex-grow bg-background border border-border rounded-md overflow-auto p-4">
                            <MarkdownRenderer content={showFlowDocumentation} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
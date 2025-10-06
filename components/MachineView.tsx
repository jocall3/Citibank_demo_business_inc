// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// This file, MachineView.tsx, represents the core operational console for the "DevCore Machine" – a revolutionary,
// commercially-grade, multi-dimensional processing and service orchestration platform.
// Invented by the visionary team at Citibank Demo Business Inc. under the guidance of James Burvel O'Callaghan III,
// this system is designed to integrate, manage, and optimize an unparalleled array of computational resources,
// external services, and advanced AI capabilities. Its architecture supports dynamic feature deployment,
// real-time diagnostics, and predictive analytics, making it a cornerstone for future financial innovation,
// global commerce, and potentially, inter-planetary resource management.
// The goal is to provide a single pane of glass for monitoring, configuring, and interacting with a system
// that can scale to hundreds, even thousands, of integrated features and services.

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { Feature } from '../types.ts';
import { SLOTS, type SlotCategory } from '../constants.tsx';
import { FEATURES_MAP } from './features/index.ts';

// --- Global Type Definitions (Invented for DevCore Machine's expansive ecosystem) ---
// These types define the data structures required for the DevCore Machine's complex operations.

/**
 * @typedef MachineStatus
 * Represents the comprehensive operational status of the DevCore Machine.
 * This includes core health, resource utilization, and various system metrics.
 * Invented as part of the "DevCore Operational Telemetry Standard (DOTS) v1.0".
 */
export interface MachineStatus {
    operationalState: 'online' | 'offline' | 'degraded' | 'maintenance' | 'critical';
    cpuUtilization: number; // Percentage 0-100
    memoryUtilization: number; // Percentage 0-100
    diskIOPS: number; // I/O Operations Per Second
    networkThroughputMbps: number; // Megabits per second
    powerConsumptionWatts: number; // Watts
    temperatureCelsius: number; // Core temperature
    uptimeSeconds: number; // Seconds since last boot
    securityAlerts: number; // Number of active security alerts
    activeProcesses: number;
    dataVolumeTB: number; // Total data processed/stored in Terabytes
}

/**
 * @typedef LogEntry
 * Standardized log entry format for all DevCore Machine components and services.
 * Invented as part of the "DevCore Universal Logging Protocol (DULP) v0.8".
 */
export interface LogEntry {
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'CRITICAL' | 'AUDIT';
    source: string; // e.g., 'CoreProcessor', 'NetworkAdapter', 'GeminiService'
    message: string;
    details?: Record<string, any>;
    traceId?: string; // For distributed tracing
}

/**
 * @typedef ServiceHealth
 * Represents the health status of an integrated external service.
 * Invented as part of the "DevCore External Service Health Indicator (DESHI) Specification".
 */
export interface ServiceHealth {
    serviceId: string;
    name: string;
    status: 'operational' | 'degraded' | 'outage' | 'unknown';
    latencyMs: number;
    lastChecked: string;
    errorsLastHour: number;
    dependencyStatus?: Record<string, 'healthy' | 'unhealthy'>;
}

/**
 * @typedef ResourceAllocation
 * Describes the allocation of resources for specific operational tasks or features.
 * Invented for "Dynamic Resource Orchestration System (DROS)".
 */
export interface ResourceAllocation {
    featureId: string;
    cpuCores: number;
    memoryGB: number;
    networkBandwidthMbps: number;
    storageGB: number;
    gpuUnits: number; // For AI/ML acceleration
}

/**
 * @typedef Notification
 * System-wide notification object.
 * Invented for the "DevCore Alerting and Notification Engine (DANE)".
 */
export interface Notification {
    id: string;
    type: 'alert' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    actions?: { label: string; action: string }[]; // e.g., { label: "Resolve", action: "resolve_alert_123" }
}

/**
 * @typedef TransactionRecord
 * A detailed record for financial or data transactions processed by the machine.
 * Essential for Citibank's core business, invented as "Universal Transaction Ledger (UTL) Entry".
 */
export interface TransactionRecord {
    transactionId: string;
    type: 'debit' | 'credit' | 'data_transfer' | 'resource_provision';
    initiator: string; // User ID, Service ID
    target: string; // Account ID, Service Endpoint
    amount?: number; // For financial transactions
    currency?: string;
    dataPayloadSizeKB?: number;
    timestamp: string;
    status: 'completed' | 'pending' | 'failed' | 'reverted';
    securityHash?: string; // For blockchain integration
}

// --- AI Service Integration Interfaces (Gemini & ChatGPT - Core AI Pillars) ---
// These interfaces define the interaction models for the integrated AI services,
// vital for intelligence, predictive capabilities, and natural language understanding.

/**
 * @interface GeminiAPIResponse
 * Standard response structure for interactions with the DevCore Gemini Integration Layer (DGIL).
 * This service, "Gemini Oracle Engine (GOE)", provides advanced data synthesis and prediction.
 */
export interface GeminiAPIResponse {
    status: 'success' | 'error';
    prediction?: any;
    insights?: string[];
    recommendations?: string[];
    rawOutput?: string;
    errorMessage?: string;
}

/**
 * @interface ChatGPTAPIResponse
 * Standard response structure for interactions with the DevCore ChatGPT Integration Protocol (DCIP).
 * This service, "Cognitive Dialogue Unit (CDU)", handles natural language queries, explanations, and command processing.
 */
export interface ChatGPTAPIResponse {
    status: 'success' | 'error';
    response: string;
    suggestedActions?: string[];
    contextTokensUsed?: number;
    errorMessage?: string;
}

// --- Placeholder for up to 1000 External Services ---
// This map will store configurations and simulated statuses for a vast array of integrated external services.
// The "DevCore Global Service Nexus (DGSN)" manages these connections.
export type ExternalServiceType = 'Cloud' | 'Payment' | 'Blockchain' | 'Monitoring' | 'Security' | 'Communication' | 'AI' | 'DataWarehouse' | 'IoT' | 'CRM' | 'DevOps' | 'Quantum' | 'BioMetric' | 'Environmental' | 'Robotics' | 'ARVR' | 'Neural' | 'AstroNavigation' | 'DarkMatterComm' | 'Compliance' | 'RiskManagement' | 'Identity' | 'SupplyChain';

export interface ExternalServiceConfig {
    id: string;
    name: string;
    type: ExternalServiceType;
    endpoint: string;
    apiKeyRef?: string; // Reference to a secure key store
    status: 'active' | 'inactive' | 'pending_setup';
    health?: ServiceHealth;
    description: string;
}

// Invented: "The Pantheon of Protocols" - a curated list of essential and advanced external services.
const INITIAL_EXTERNAL_SERVICES: ExternalServiceConfig[] = [
    { id: 'aws-s3-global', name: 'AWS S3 Global Storage', type: 'Cloud', endpoint: 'https://s3.amazonaws.com', status: 'active', description: 'Distributed object storage for global data assets.' },
    { id: 'azure-cosmosdb-apac', name: 'Azure CosmosDB AP-AC', type: 'Cloud', endpoint: 'https://cosmos.azure.com/apac', status: 'active', description: 'Globally distributed, multi-model database service.' },
    { id: 'gcp-bigquery-eur', name: 'GCP BigQuery Europe', type: 'DataWarehouse', endpoint: 'https://bigquery.cloud.google.com/eur', status: 'active', description: 'Petabyte-scale analytical data warehouse.' },
    { id: 'stripe-payments-v2', name: 'Stripe Payment Gateway v2', type: 'Payment', endpoint: 'https://api.stripe.com/v2', status: 'active', description: 'Secure online payment processing.' },
    { id: 'ethereum-mainnet-node', name: 'Ethereum Mainnet Node', type: 'Blockchain', endpoint: 'https://mainnet.infura.io/v3', status: 'active', description: 'Direct interface to the Ethereum blockchain network.' },
    { id: 'splunk-enterprise-siem', name: 'Splunk Enterprise SIEM', type: 'Monitoring', endpoint: 'https://splunk.corp.local', status: 'active', description: 'Security Information and Event Management for threat detection.' },
    { id: 'okta-idp-prod', name: 'Okta Identity Provider Prod', type: 'Security', endpoint: 'https://citibank.okta.com', status: 'active', description: 'Centralized identity and access management.' },
    { id: 'twilio-sms-api', name: 'Twilio SMS & Voice API', type: 'Communication', endpoint: 'https://api.twilio.com', status: 'active', description: 'Programmable SMS and voice communication.' },
    { id: 'salesforce-crm-core', name: 'Salesforce CRM Core', type: 'CRM', endpoint: 'https://citibank.salesforce.com', status: 'active', description: 'Customer Relationship Management platform.' },
    { id: 'jenkins-ci-cd-master', name: 'Jenkins CI/CD Master', type: 'DevOps', endpoint: 'https://jenkins.devcore.local', status: 'active', description: 'Continuous Integration and Continuous Deployment orchestration.' },
    { id: 'ibm-quantum-experience', name: 'IBM Quantum Experience', type: 'Quantum', endpoint: 'https://quantum-computing.ibm.com', status: 'inactive', description: 'Access to IBM quantum processors (experimental).' },
    { id: 'neural-link-monitor', name: 'Neural-Link Monitor', type: 'Neural', endpoint: 'https://api.neuro-link.com', status: 'pending_setup', description: 'Fictional: Monitors advanced human-machine neural interfaces.' },
    { id: 'devcore-internal-ledger-blockchain', name: 'DevCore Internal Ledger (DLT)', type: 'Blockchain', endpoint: 'https://dlt.devcore.local', status: 'active', description: 'Proprietary Distributed Ledger Technology for internal audits.' },
    { id: 'fintech-regulatory-ai', name: 'FinTech Regulatory AI', type: 'Compliance', endpoint: 'https://regtech.ai/citibank', status: 'active', description: 'AI-driven compliance monitoring and reporting.' },
    { id: 'global-risk-intelligence-feed', name: 'Global Risk Intelligence Feed', type: 'RiskManagement', endpoint: 'https://risk.feed.com/api', status: 'active', description: 'Real-time aggregated global financial risk data.' },
    { id: 'biometric-auth-gateway', name: 'Biometric Auth Gateway', type: 'BioMetric', endpoint: 'https://biometrics.devcore.local', status: 'active', description: 'Centralized gateway for multi-modal biometric authentication.' },
    { id: 'dark-matter-comm-array-alpha', name: 'Dark Matter Comm Array Alpha', type: 'DarkMatterComm', endpoint: 'dmcp://alpha.devcore.uni', status: 'inactive', description: 'Fictional: Experimental communication array utilizing theoretical dark matter properties for instantaneous interstellar data transfer.' },
    { id: 'astro-nav-telemetry-beta', name: 'Astro-Nav Telemetry Beta', type: 'AstroNavigation', endpoint: 'anp://beta.devcore.uni', status: 'inactive', description: 'Fictional: Telemetry system for celestial navigation and resource reconnaissance in deep space.' },
    { id: 'devcore-quantum-security-module', name: 'DevCore Quantum Security Module', type: 'Security', endpoint: 'qsk://devcore.local', status: 'active', description: 'Post-quantum cryptography module providing future-proof encryption for all internal communications.' },
    { id: 'predictive-maintenance-ai', name: 'Predictive Maintenance AI', type: 'AI', endpoint: 'https://pma.devcore.local', status: 'active', description: 'AI service predicting hardware failures and scheduling proactive maintenance.' },
    { id: 'supply-chain-optimizer', name: 'Supply Chain Optimizer', type: 'SupplyChain', endpoint: 'https://sco.devcore.local', status: 'active', description: 'Optimizes global logistics and supply chain operations for DevCore deployments.' },
    // Adding more to approach 1000... this is illustrative. In a real scenario, this would be loaded from a config service.
    // For demonstration, we'll generate many more generic cloud/payment/monitoring service instances.
    ...Array.from({ length: 980 }).map((_, i) => ({
        id: `generic-service-${i + 1}`,
        name: `Generic Service #${i + 1}`,
        type: ['Cloud', 'Payment', 'Monitoring', 'Security', 'AI', 'Blockchain', 'DataWarehouse'][i % 7] as ExternalServiceType,
        endpoint: `https://api.generic-service-${i + 1}.com`,
        status: (i % 5 === 0) ? 'inactive' : 'active',
        description: `Auto-generated placeholder service demonstrating the DevCore Machine's vast integration capabilities. This service handles data stream ${i+1}.`
    }))
];


interface InstalledFeatures {
    [key: string]: Feature | null;
}

const MachineSVG: React.FC = () => (
    // Invented: "DevCore Nexus Core Visualizer" - provides a stylized representation of the machine's operational heart.
    // The pulsating glow signifies active processing and data flow.
    <svg viewBox="0 0 300 200" className="w-full h-full">
        <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: 'rgba(56, 189, 248, 0.4)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(56, 189, 248, 0)', stopOpacity: 1 }} />
            </radialGradient>
            <linearGradient id="energyFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="blurGlow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            </filter>
        </defs>
        <rect x="50" y="30" width="200" height="140" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <circle cx="150" cy="100" r="40" fill="#0f172a" />
        <circle cx="150" cy="100" r="50" fill="url(#glow)" filter="url(#blurGlow)" /> {/* Added blur for softer glow */}
        <path d="M150 70 L150 130 M120 100 L180 100" stroke="url(#energyFlow)" strokeWidth="3" strokeLinecap="round" className="animate-pulse" /> {/* Thicker, gradient pulse */}
        <line x1="60" y1="50" x2="60" y2="150" stroke="#334155" strokeWidth="4" />
        <line x1="240" y1="50" x2="240" y2="150" stroke="#334155" strokeWidth="4" />
        {/* Animated Data Stream Lines - Invented "DevCore Data Conduit Visualization" */}
        <path d="M 60 70 C 80 60, 100 80, 120 70 S 160 90, 180 80 S 220 70, 240 80" fill="none" stroke="#67e8f9" strokeWidth="1" strokeDasharray="5,5" className="animate-dash" />
        <path d="M 60 130 C 80 140, 100 120, 120 130 S 160 110, 180 120 S 220 130, 240 120" fill="none" stroke="#f472b6" strokeWidth="1" strokeDasharray="5,5" className="animate-dash-reverse" />
        {/* Status Indicators */}
        <circle cx="230" cy="40" r="5" fill="#22c55e" className="animate-ping-slow" /> {/* Operational Status */}
        <circle cx="70" cy="40" r="5" fill="#facc15" className="animate-pulse" /> {/* Warning Status */}
        <text x="150" y="165" textAnchor="middle" fill="#94a3b8" fontSize="10">DevCore v7.1.3 (Quantum Enhanced)</text>
    </svg>
);

// --- New Core Components and Panels (Invented for enhanced operability) ---

/**
 * @exports OperationalDashboard
 * Invented: "DevCore Real-time Operational Dashboard (DRTOD)".
 * This component provides critical metrics and a high-level overview of the DevCore Machine's health.
 * It synthesizes data from the `MachineStatus` and `ServiceHealth` interfaces.
 */
export const OperationalDashboard: React.FC<{ status: MachineStatus; serviceHealths: ServiceHealth[] }> = ({ status, serviceHealths }) => {
    const getStatusColor = useCallback((state: MachineStatus['operationalState']) => {
        switch (state) {
            case 'online': return 'text-green-500';
            case 'degraded': return 'text-yellow-500';
            case 'critical': return 'text-red-500';
            case 'maintenance': return 'text-blue-500';
            default: return 'text-slate-400';
        }
    }, []);

    const healthyServices = serviceHealths.filter(s => s.status === 'operational').length;
    const totalServices = serviceHealths.length;

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center">
                <span className="mr-2 text-cyan-400">&#x2699;</span> Operational Dashboard
                <span className={`ml-auto text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor(status.operationalState)} bg-current/20`}>
                    {status.operationalState.toUpperCase()}
                </span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex flex-col">
                    <span className="text-slate-400">CPU Util.</span>
                    <span className="text-slate-200 font-mono text-lg">{status.cpuUtilization.toFixed(1)}%</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-400">Memory Util.</span>
                    <span className="text-slate-200 font-mono text-lg">{status.memoryUtilization.toFixed(1)}%</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-400">Network I/O</span>
                    <span className="text-slate-200 font-mono text-lg">{status.networkThroughputMbps.toFixed(0)} Mbps</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-400">Power Cons.</span>
                    <span className="text-slate-200 font-mono text-lg">{status.powerConsumptionWatts.toFixed(0)} W</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-400">Temperature</span>
                    <span className="text-slate-200 font-mono text-lg">{status.temperatureCelsius.toFixed(1)} °C</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-400">Uptime</span>
                    <span className="text-slate-200 font-mono text-lg">{Math.floor(status.uptimeSeconds / 3600)}h {(Math.floor(status.uptimeSeconds / 60) % 60)}m</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-400">Security Alerts</span>
                    <span className="text-slate-200 font-mono text-lg">{status.securityAlerts}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-400">Services Online</span>
                    <span className="text-slate-200 font-mono text-lg">{healthyServices} / {totalServices}</span>
                </div>
            </div>
        </div>
    );
};

/**
 * @exports AIDiagnosticsPanel
 * Invented: "Cognitive AI Diagnostic Interface (CAIDI)".
 * This panel integrates Gemini and ChatGPT for advanced diagnostics, predictive analysis, and natural language command processing.
 * It's the brain of the DevCore Machine's proactive maintenance and intelligent response system.
 */
export const AIDiagnosticsPanel: React.FC<{
    machineStatus: MachineStatus;
    installedFeatures: InstalledFeatures;
    externalServices: ExternalServiceConfig[];
    onChatGPTQuery: (query: string) => Promise<ChatGPTAPIResponse>;
    onGeminiAnalysis: (data: any) => Promise<GeminiAPIResponse>;
}> = ({ machineStatus, installedFeatures, externalServices, onChatGPTQuery, onGeminiAnalysis }) => {
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'AI'; message: string; timestamp: string; rawResponse?: any }[]>([]);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    // Invented: "AI Contextual Data Extractor (ACDE)" - prepares relevant data for AI models.
    const getAIContext = useCallback(() => {
        const featureNames = Object.values(installedFeatures).filter(f => f !== null).map(f => f!.name).join(', ');
        const serviceNames = externalServices.map(s => s.name).join(', ');
        return `Current Machine Status: ${machineStatus.operationalState}, CPU: ${machineStatus.cpuUtilization}%, Mem: ${machineStatus.memoryUtilization}%. Installed Features: ${featureNames}. Connected Services: ${serviceNames}. Temperature: ${machineStatus.temperatureCelsius}°C.`;
    }, [machineStatus, installedFeatures, externalServices]);

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage = chatInput.trim();
        const timestamp = new Date().toLocaleTimeString();

        setChatHistory(prev => [...prev, { sender: 'user', message: userMessage, timestamp }]);
        setChatInput('');
        setIsLoadingAI(true);

        try {
            // Invented: "Multi-Modal AI Router (MMAR)" - intelligently routes queries to appropriate AI.
            let aiResponse: ChatGPTAPIResponse | GeminiAPIResponse;
            let aiServiceUsed: 'ChatGPT' | 'Gemini';

            if (userMessage.toLowerCase().includes('analyze') || userMessage.toLowerCase().includes('predict') || userMessage.toLowerCase().includes('insights')) {
                // Route to Gemini for analytical tasks
                aiServiceUsed = 'Gemini';
                const analysisData = {
                    query: userMessage,
                    context: getAIContext(),
                    fullMachineStatus: machineStatus,
                    activeFeatures: installedFeatures,
                    activeServices: externalServices.filter(s => s.status === 'active').map(s => ({ id: s.id, name: s.name, health: s.health }))
                };
                const geminiResult = await onGeminiAnalysis(analysisData);
                aiResponse = {
                    status: geminiResult.status,
                    response: geminiResult.status === 'success' ? `Gemini Insight: ${geminiResult.insights?.join('. ')}. Recommendations: ${geminiResult.recommendations?.join('. ')}.` : `Gemini Error: ${geminiResult.errorMessage}`,
                    rawOutput: geminiResult
                } as ChatGPTAPIResponse; // Cast for now, will refine type if needed
            } else {
                // Route to ChatGPT for conversational, diagnostic, or command tasks
                aiServiceUsed = 'ChatGPT';
                const chatResult = await onChatGPTQuery(`${getAIContext()} User query: ${userMessage}`);
                aiResponse = chatResult;
            }

            setChatHistory(prev => [...prev, {
                sender: 'AI',
                message: aiResponse.status === 'success' ? aiResponse.response : `[${aiServiceUsed} ERROR] ${aiResponse.errorMessage || 'An unknown AI error occurred.'}`,
                timestamp: new Date().toLocaleTimeString(),
                rawResponse: aiResponse
            }]);
        } catch (error: any) {
            console.error("AI query failed:", error);
            setChatHistory(prev => [...prev, { sender: 'AI', message: `System Error: Failed to communicate with AI services. Details: ${error.message}`, timestamp: new Date().toLocaleTimeString() }]);
        } finally {
            setIsLoadingAI(false);
        }
    };

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [chatHistory]);


    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl h-[400px] flex flex-col">
            <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center">
                <span className="mr-2 text-purple-400">&#x26A1;</span> AI Diagnostics & Command
            </h2>
            <div ref={chatHistoryRef} className="flex-grow overflow-y-auto pr-2 mb-4 space-y-3 custom-scrollbar">
                {chatHistory.length === 0 && (
                    <p className="text-slate-500 text-center py-8">Ask the AI about machine status, diagnostics, or operational insights.</p>
                )}
                {chatHistory.map((entry, index) => (
                    <div key={index} className={`flex ${entry.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-[80%] text-sm ${entry.sender === 'user' ? 'bg-cyan-700 text-slate-100' : 'bg-slate-700 text-slate-200'}`}>
                            <p className="font-semibold mb-1">{entry.sender === 'user' ? 'You' : 'AI Assistant'}</p>
                            <p>{entry.message}</p>
                            <span className="block text-right text-xs mt-1 opacity-70">{entry.timestamp}</span>
                        </div>
                    </div>
                ))}
                {isLoadingAI && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-lg bg-slate-700 text-slate-200 text-sm">
                            <span className="animate-pulse">AI is thinking...</span>
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your command or query for the AI..."
                    className="flex-grow p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-cyan-500 outline-none text-slate-200 placeholder-slate-400"
                    disabled={isLoadingAI}
                />
                <button
                    type="submit"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
                    disabled={isLoadingAI || !chatInput.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

/**
 * @exports ServiceIntegrationPanel
 * Invented: "DevCore Global Service Nexus (DGSN) Manager".
 * This panel provides a comprehensive view and control interface for all integrated external services.
 * It allows operators to monitor health, configure, and manage dependencies.
 */
export const ServiceIntegrationPanel: React.FC<{
    services: ExternalServiceConfig[];
    onUpdateServiceStatus: (id: string, status: 'active' | 'inactive') => void;
    onViewServiceDetails: (service: ExternalServiceConfig) => void; // Placeholder for a more detailed view
}> = ({ services, onUpdateServiceStatus, onViewServiceDetails }) => {
    const [filterType, setFilterType] = useState<ExternalServiceType | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredServices = useMemo(() => {
        let currentServices = services;
        if (filterType !== 'All') {
            currentServices = currentServices.filter(s => s.type === filterType);
        }
        if (searchTerm) {
            currentServices = currentServices.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return currentServices;
    }, [services, filterType, searchTerm]);

    // Invented: "Service Health Indicator (SHI)" for visual status cues.
    const getServiceStatusIndicator = (status: ExternalServiceConfig['status']) => {
        switch (status) {
            case 'active': return <span className="text-green-500">&#x2B24;</span>; // Green circle
            case 'inactive': return <span className="text-red-500">&#x2B24;</span>;   // Red circle
            case 'pending_setup': return <span className="text-yellow-500">&#x2B24;</span>; // Yellow circle
            default: return <span className="text-slate-500">&#x2B24;</span>; // Grey circle
        }
    };

    const serviceTypes = useMemo(() => Array.from(new Set(INITIAL_EXTERNAL_SERVICES.map(s => s.type))), []);

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl flex flex-col">
            <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center">
                <span className="mr-2 text-orange-400">&#x2728;</span> External Service Integration Hub ({services.length} services)
            </h2>
            <div className="flex flex-wrap gap-4 mb-4">
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as ExternalServiceType | 'All')}
                    className="p-2 rounded-md bg-slate-700 border border-slate-600 text-slate-200 focus:border-cyan-500 outline-none"
                >
                    <option value="All">All Types</option>
                    {serviceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow p-2 rounded-md bg-slate-700 border border-slate-600 focus:border-cyan-500 outline-none text-slate-200 placeholder-slate-400"
                />
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 h-[300px]">
                {filteredServices.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No services match your criteria.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredServices.map(service => (
                            <div key={service.id} className="bg-slate-700 p-4 rounded-md border border-slate-600 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-semibold text-slate-100 flex items-center mb-1">
                                        {getServiceStatusIndicator(service.status)}
                                        <span className="ml-2">{service.name}</span>
                                    </h4>
                                    <p className="text-xs text-slate-400 mb-2 truncate">{service.description}</p>
                                    <p className="text-xs text-slate-500 font-mono">ID: {service.id}</p>
                                    <p className="text-xs text-slate-500 font-mono">Type: {service.type}</p>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className={`text-sm font-medium ${service.status === 'active' ? 'text-green-400' : service.status === 'inactive' ? 'text-red-400' : 'text-yellow-400'}`}>
                                        Status: {service.status.charAt(0).toUpperCase() + service.status.slice(1).replace('_', ' ')}
                                    </span>
                                    <button
                                        onClick={() => onUpdateServiceStatus(service.id, service.status === 'active' ? 'inactive' : 'active')}
                                        className={`px-3 py-1 text-xs rounded-md ${service.status === 'active' ? 'bg-red-700 hover:bg-red-600' : 'bg-green-700 hover:bg-green-600'} text-white transition-colors`}
                                    >
                                        {service.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    {/* <button
                                        onClick={() => onViewServiceDetails(service)}
                                        className="ml-2 px-3 py-1 text-xs rounded-md bg-blue-700 hover:bg-blue-600 text-white transition-colors"
                                    >
                                        Details
                                    </button> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <p className="text-xs text-slate-500 mt-4">Showing {filteredServices.length} of {services.length} services.</p>
        </div>
    );
};

/**
 * @exports SystemLogsViewer
 * Invented: "DevCore Unified Log Stream (DULS)".
 * Displays real-time and historical log entries for debugging, auditing, and compliance.
 */
export const SystemLogsViewer: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
    const logsEndRef = useRef<HTMLDivElement>(null);
    const [filterLevel, setFilterLevel] = useState<'All' | LogEntry['level']>('All');
    const [filterSource, setFilterSource] = useState<'All' | string>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    const filteredLogs = useMemo(() => {
        let currentLogs = logs;
        if (filterLevel !== 'All') {
            currentLogs = currentLogs.filter(log => log.level === filterLevel);
        }
        if (filterSource !== 'All') {
            currentLogs = currentLogs.filter(log => log.source === filterSource);
        }
        if (searchTerm) {
            currentLogs = currentLogs.filter(log =>
                log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return currentLogs.slice(-200); // Only show last 200 logs for performance in UI
    }, [logs, filterLevel, filterSource, searchTerm]);

    const logSources = useMemo(() => {
        const sources = new Set(logs.map(log => log.source));
        return Array.from(sources).sort();
    }, [logs]);

    const getLogLevelColor = useCallback((level: LogEntry['level']) => {
        switch (level) {
            case 'INFO': return 'text-blue-400';
            case 'WARN': return 'text-yellow-400';
            case 'ERROR': return 'text-red-500';
            case 'CRITICAL': return 'text-red-700 bg-red-200/20 rounded-sm px-1';
            case 'DEBUG': return 'text-purple-400';
            case 'AUDIT': return 'text-green-400';
            default: return 'text-slate-400';
        }
    }, []);

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl flex flex-col h-[500px]">
            <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center">
                <span className="mr-2 text-lime-400">&#x2318;</span> System Logs (DULS)
            </h2>
            <div className="flex flex-wrap gap-4 mb-4">
                <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value as 'All' | LogEntry['level'])}
                    className="p-2 rounded-md bg-slate-700 border border-slate-600 text-slate-200 focus:border-cyan-500 outline-none"
                >
                    <option value="All">All Levels</option>
                    {['INFO', 'WARN', 'ERROR', 'DEBUG', 'CRITICAL', 'AUDIT'].map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
                <select
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value as 'All' | string)}
                    className="p-2 rounded-md bg-slate-700 border border-slate-600 text-slate-200 focus:border-cyan-500 outline-none"
                >
                    <option value="All">All Sources</option>
                    {logSources.map(source => (
                        <option key={source} value={source}>{source}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search log messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow p-2 rounded-md bg-slate-700 border border-slate-600 focus:border-cyan-500 outline-none text-slate-200 placeholder-slate-400"
                />
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded-md border border-slate-700">
                {filteredLogs.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No log entries to display.</p>
                ) : (
                    filteredLogs.map((log, index) => (
                        <div key={index} className="flex items-start mb-1 leading-tight">
                            <span className="text-slate-500 w-[70px] flex-shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            <span className={`${getLogLevelColor(log.level)} w-[60px] flex-shrink-0 font-bold ml-2`}>{log.level.padEnd(8)}</span>
                            <span className="text-slate-400 w-[120px] flex-shrink-0 ml-2 truncate" title={log.source}>[{log.source}]</span>
                            <span className="ml-2 flex-grow">{log.message}</span>
                        </div>
                    ))
                )}
                <div ref={logsEndRef} />
            </div>
            <p className="text-xs text-slate-500 mt-4">Displaying {filteredLogs.length} recent log entries.</p>
        </div>
    );
};

// Invented: "The Transactor Panel" - For critical financial and data transaction monitoring.
export const TransactionMonitor: React.FC<{ transactions: TransactionRecord[] }> = ({ transactions }) => {
    const [filterStatus, setFilterStatus] = useState<'All' | TransactionRecord['status']>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = useMemo(() => {
        let currentTransactions = transactions;
        if (filterStatus !== 'All') {
            currentTransactions = currentTransactions.filter(t => t.status === filterStatus);
        }
        if (searchTerm) {
            currentTransactions = currentTransactions.filter(t =>
                t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.initiator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.target && t.target.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return currentTransactions.slice(-100); // Show last 100 for display
    }, [transactions, filterStatus, searchTerm]);

    const getStatusColor = useCallback((status: TransactionRecord['status']) => {
        switch (status) {
            case 'completed': return 'text-green-500';
            case 'pending': return 'text-yellow-500';
            case 'failed': return 'text-red-500';
            case 'reverted': return 'text-orange-500';
            default: return 'text-slate-400';
        }
    }, []);

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl flex flex-col h-[400px]">
            <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center">
                <span className="mr-2 text-emerald-400">&#x24B9;</span> Transaction Flow Monitor (UTL)
            </h2>
            <div className="flex flex-wrap gap-4 mb-4">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'All' | TransactionRecord['status'])}
                    className="p-2 rounded-md bg-slate-700 border border-slate-600 text-slate-200 focus:border-cyan-500 outline-none"
                >
                    <option value="All">All Statuses</option>
                    {['completed', 'pending', 'failed', 'reverted'].map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search transaction IDs/initiators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow p-2 rounded-md bg-slate-700 border border-slate-600 focus:border-cyan-500 outline-none text-slate-200 placeholder-slate-400"
                />
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded-md border border-slate-700">
                {filteredTransactions.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No transactions to display.</p>
                ) : (
                    filteredTransactions.map((tx, index) => (
                        <div key={index} className="flex items-center mb-1 leading-tight">
                            <span className="text-slate-500 w-[60px] flex-shrink-0">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className={`w-[70px] flex-shrink-0 font-bold ml-2 ${getStatusColor(tx.status)}`}>{tx.status.toUpperCase()}</span>
                            <span className="text-slate-400 w-[120px] flex-shrink-0 ml-2 truncate" title={tx.transactionId}>{tx.transactionId}</span>
                            <span className="ml-2 text-slate-300 w-[80px] flex-shrink-0 truncate" title={tx.initiator}>{tx.initiator}</span>
                            <span className="ml-2 text-slate-300 w-[80px] flex-shrink-0 truncate" title={tx.target}>{tx.target}</span>
                            {tx.amount && <span className="ml-2 text-slate-200 w-[60px] flex-shrink-0 text-right">{tx.amount.toFixed(2)} {tx.currency || 'USD'}</span>}
                            {tx.dataPayloadSizeKB && <span className="ml-2 text-slate-400 w-[50px] flex-shrink-0 text-right">{tx.dataPayloadSizeKB} KB</span>}
                        </div>
                    ))
                )}
            </div>
            <p className="text-xs text-slate-500 mt-4">Displaying {filteredTransactions.length} recent transactions.</p>
        </div>
    );
};


const DropZone: React.FC<{
    category: SlotCategory;
    feature: Feature | null;
    onDrop: (category: SlotCategory, feature: Feature) => void;
    onClear: (category: SlotCategory) => void;
    currentInstalledFeatures: InstalledFeatures; // Added to enable dependency checks
}> = ({ category, feature, onDrop, onClear, currentInstalledFeatures }) => {
    const [isOver, setIsOver] = useState(false);
    const [isInvalidDrop, setIsInvalidDrop] = useState(false);
    const [dependencyConflict, setDependencyConflict] = useState<string | null>(null); // Invented: "Dependency Conflict Resolver (DCR)"

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true); // Set isOver true here to provide immediate visual feedback
        const featureId = e.dataTransfer.getData('text/plain');
        const featureData = FEATURES_MAP.get(featureId);

        if (featureData) {
            // Invented: "Feature Dependency Graph (FDG) Analyzer"
            // This is a simplified check. A real system would have a complex graph analysis.
            const hasDependencies = featureData.dependencies && featureData.dependencies.length > 0;
            const unmetDependencies = hasDependencies
                ? featureData.dependencies!.filter(dep => !currentInstalledFeatures[dep])
                : [];

            if (unmetDependencies.length > 0) {
                setDependencyConflict(`Requires: ${unmetDependencies.map(depId => FEATURES_MAP.get(depId)?.name || depId).join(', ')}`);
            } else {
                setDependencyConflict(null);
            }

            if (featureData.category !== category && category === 'Core' && !SLOTS.includes(featureData.category)) {
                // Special case for 'Core' slot: allows any feature or a core-specific feature
                // This logic might need refinement based on actual 'Core' category design.
                setIsInvalidDrop(false); // Assume core can take anything for now for flexibility
            } else if (featureData.category !== category && category !== 'Core') {
                setIsInvalidDrop(true);
            } else if (unmetDependencies.length > 0) {
                setIsInvalidDrop(true); // Also invalid if dependencies are not met
            } else {
                setIsInvalidDrop(false);
            }
        } else {
            setIsInvalidDrop(true); // Invalid if no feature data
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setIsOver(false);
        setIsInvalidDrop(false); // Clear invalid state on leave
        setDependencyConflict(null); // Clear dependency conflict on leave
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        setDependencyConflict(null); // Clear conflict state after drop attempt
        try {
            const featureId = e.dataTransfer.getData('text/plain');
            const featureData = FEATURES_MAP.get(featureId);

            if (featureData) {
                const hasDependencies = featureData.dependencies && featureData.dependencies.length > 0;
                const unmetDependencies = hasDependencies
                    ? featureData.dependencies!.filter(dep => !currentInstalledFeatures[dep])
                    : [];

                if (featureData.category === category || category === 'Core') { // Allow any category in Core for flexibility
                    if (unmetDependencies.length === 0) {
                        onDrop(category, featureData);
                        setIsInvalidDrop(false);
                    } else {
                        console.warn(`Feature "${featureData.name}" cannot be installed. Missing dependencies: ${unmetDependencies.join(', ')}`);
                        setDependencyConflict(`Missing: ${unmetDependencies.map(depId => FEATURES_MAP.get(depId)?.name || depId).join(', ')}`);
                        setIsInvalidDrop(true);
                        setTimeout(() => { setIsInvalidDrop(false); setDependencyConflict(null); }, 3000); // Clear after delay
                    }
                } else {
                    console.warn(`Feature category "${featureData.category}" does not match slot "${category}"`);
                    setIsInvalidDrop(true);
                    setTimeout(() => setIsInvalidDrop(false), 400);
                }
            }
        } catch (error) {
            console.error("Failed to parse dropped data", error);
            setIsInvalidDrop(true);
            setTimeout(() => setIsInvalidDrop(false), 400);
        }
    };

    const borderClass = isInvalidDrop
        ? 'border-red-500'
        : isOver
        ? 'border-cyan-400'
        : 'border-slate-700';
    
    const animationClass = isInvalidDrop ? 'animate-shake' : '';


    return (
        <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative p-4 rounded-lg border-2 border-dashed transition-colors duration-200 ${borderClass} ${isOver ? 'bg-slate-700/50' : 'bg-slate-800/50'} ${animationClass}`}
        >
            <h3 className="text-lg font-bold text-slate-300 mb-2">{category} Slot</h3>
            {dependencyConflict && isOver && (
                <p className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-800 text-white text-xs rounded-md whitespace-nowrap z-10 animate-fade-in">
                    {dependencyConflict}
                </p>
            )}
            {feature ? (
                <div className="bg-slate-700 p-3 rounded-md text-left relative">
                     <button onClick={() => onClear(category)} className="absolute top-1 right-1 text-slate-500 hover:text-red-400 font-bold text-lg w-6 h-6 flex items-center justify-center">&times;</button>
                    <div className="flex items-center space-x-3">
                        <div className="text-cyan-400">{feature.icon}</div>
                        <div>
                            <p className="font-semibold text-slate-100">{feature.name}</p>
                            <p className="text-xs text-slate-400">{feature.description}</p>
                            {feature.dependencies && feature.dependencies.length > 0 && (
                                <p className="text-xs text-slate-500 mt-1">Requires: {feature.dependencies.map(depId => FEATURES_MAP.get(depId)?.name || depId).join(', ')}</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-slate-500 text-center py-6">
                    <p>Drag & Drop a feature here</p>
                    {isInvalidDrop && !isOver && ( // Only show persistent error if it's an invalid drop and not currently dragging over
                        <p className="mt-2 text-red-400 text-sm animate-fade-in">Invalid feature for this slot or missing dependencies!</p>
                    )}
                </div>
            )}
        </div>
    );
};


// --- MachineView: The Grand Orchestrator ---
/**
 * @exports MachineView
 * Invented: "The DevCore Global Orchestration Console (DGOC)".
 * This is the primary interface for managing the DevCore Machine.
 * It integrates all the sub-components, manages global state, and simulates complex interactions
 * with internal systems and thousands of external services.
 * This console is the command center for the "Citibank Demo Business Inc." operations,
 * representing a leap forward in enterprise-level, AI-driven, and highly resilient computational infrastructure.
 */
export const MachineView: React.FC = () => {
    // --- Core State Management (Invented: "DevCore Nexus State Manager - DSNM") ---
    const [installed, setInstalled] = useState<InstalledFeatures>({});
    const [machineStatus, setMachineStatus] = useState<MachineStatus>({
        operationalState: 'online',
        cpuUtilization: 15.0,
        memoryUtilization: 25.0,
        diskIOPS: 1200,
        networkThroughputMbps: 500,
        powerConsumptionWatts: 300,
        temperatureCelsius: 45.0,
        uptimeSeconds: 0,
        securityAlerts: 0,
        activeProcesses: 150,
        dataVolumeTB: 0
    });
    const [systemLogs, setSystemLogs] = useState<LogEntry[]>([]);
    const [externalServices, setExternalServices] = useState<ExternalServiceConfig[]>(INITIAL_EXTERNAL_SERVICES);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

    // --- Utility functions (Invented for internal DevCore operations) ---
    const addLog = useCallback((log: Omit<LogEntry, 'timestamp'>) => {
        setSystemLogs(prev => [...prev, { ...log, timestamp: new Date().toISOString() }]);
    }, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        setNotifications(prev => [...prev, { ...notification, id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, timestamp: new Date().toISOString(), isRead: false }]);
    }, []);

    const addTransaction = useCallback((tx: Omit<TransactionRecord, 'timestamp'>) => {
        setTransactions(prev => [...prev, { ...tx, timestamp: new Date().toISOString() }]);
    }, []);

    // --- Simulate Machine Operations (Invented: "DevCore Operational Simulator - DOSIM") ---
    useEffect(() => {
        // Simulate uptime and general resource fluctuation
        const interval = setInterval(() => {
            setMachineStatus(prev => {
                const newUptime = prev.uptimeSeconds + 1;
                // Minor fluctuations based on installed features
                const featureImpactCPU = Object.values(installed).filter(f => f).length * 0.5;
                const featureImpactMem = Object.values(installed).filter(f => f).length * 0.8;
                const featureImpactTemp = Object.values(installed).filter(f => f).length * 0.1;
                const featureImpactPower = Object.values(installed).filter(f => f).length * 5;

                const newCpu = Math.min(95, 15 + featureImpactCPU + Math.random() * 5 - 2.5);
                const newMem = Math.min(95, 25 + featureImpactMem + Math.random() * 10 - 5);
                const newTemp = Math.min(80, 45 + featureImpactTemp + Math.random() * 2 - 1);
                const newPower = Math.min(2000, 300 + featureImpactPower + Math.random() * 100 - 50);

                // Simulate data volume growth
                const newDataVolume = prev.dataVolumeTB + (Math.random() * 0.001); // 1GB per second on average

                // Simulate security alerts (rare)
                let newSecurityAlerts = prev.securityAlerts;
                if (Math.random() < 0.001) { // 1 in 1000 chance per second
                    newSecurityAlerts++;
                    addLog({ level: 'CRITICAL', source: 'SecurityModule', message: `Potential intrusion detected! Alert ID: SEC-${Date.now()}` });
                    addNotification({ type: 'alert', title: 'Security Breach', message: 'Anomalous network activity detected. Review logs immediately.' });
                }

                return {
                    ...prev,
                    uptimeSeconds: newUptime,
                    cpuUtilization: parseFloat(newCpu.toFixed(1)),
                    memoryUtilization: parseFloat(newMem.toFixed(1)),
                    temperatureCelsius: parseFloat(newTemp.toFixed(1)),
                    powerConsumptionWatts: parseFloat(newPower.toFixed(0)),
                    dataVolumeTB: parseFloat(newDataVolume.toFixed(3)),
                    securityAlerts: newSecurityAlerts,
                    operationalState: newCpu > 90 || newMem > 90 || newTemp > 75 ? 'degraded' : (newSecurityAlerts > 0 ? 'critical' : 'online')
                };
            });
        }, 1000); // Update every second

        // Simulate logging (Invented: "DevCore Autonomous Log Generator - DALG")
        const logInterval = setInterval(() => {
            const levels: LogEntry['level'][] = ['INFO', 'DEBUG', 'WARN', 'ERROR', 'AUDIT'];
            const sources = ['CoreProcessor', 'NetworkAdapter', 'StorageUnit', 'PowerRegulator', 'SecurityModule', 'AI_Cognition', 'TransactionEngine'];
            const messages = [
                'System heartbeat detected.',
                'Data pipeline throughput nominal.',
                'Cache invalidation successful.',
                'Resource allocation updated.',
                'External service query successful.',
                'Minor configuration drift detected.',
                'Attempted unauthorized access from IP 192.168.1.100.', // Simulating a security event
                'Module checksum mismatch, initiating self-repair.',
                'Transaction validation initiated.',
                'Predictive model update complete.',
                'Quantum state entanglement achieved.',
                'Neural network recalibration complete.'
            ];
            addLog({
                level: levels[Math.floor(Math.random() * levels.length)],
                source: sources[Math.floor(Math.random() * sources.length)],
                message: messages[Math.floor(Math.random() * messages.length)],
                details: Math.random() > 0.7 ? { param1: Math.random().toFixed(2), param2: 'value' } : undefined
            });

            // Simulate transactions periodically (Invented: "DevCore Automated Transaction Emitter - DATE")
            if (Math.random() < 0.1) { // 10% chance per log cycle
                addTransaction({
                    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    type: Math.random() > 0.5 ? 'debit' : 'credit',
                    initiator: `User_${Math.floor(Math.random() * 100)}`,
                    target: `Account_${Math.floor(Math.random() * 1000)}`,
                    amount: parseFloat((Math.random() * 1000).toFixed(2)),
                    currency: 'USD',
                    status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as TransactionRecord['status'],
                    securityHash: Math.random() > 0.8 ? `0x${Math.random().toString(16).substring(2, 12)}` : undefined
                });
            }
        }, 2000); // Log every 2 seconds

        // Simulate external service health checks (Invented: "DevCore Service Health Probe - DSHP")
        const serviceHealthInterval = setInterval(() => {
            setExternalServices(prevServices => prevServices.map(service => {
                if (service.status === 'active') {
                    const newStatus = Math.random() < 0.05 ? 'degraded' : (Math.random() < 0.01 ? 'outage' : 'operational');
                    const newLatency = Math.floor(Math.random() * 200) + (newStatus === 'degraded' ? 100 : 0);
                    const newErrors = newStatus !== 'operational' ? Math.floor(Math.random() * 10) : 0;
                    if (newStatus === 'outage') {
                        addLog({ level: 'ERROR', source: `ServiceHealth(${service.id})`, message: `External service "${service.name}" is experiencing an outage.` });
                        addNotification({ type: 'alert', title: `Service Outage: ${service.name}`, message: `Service ${service.name} (${service.type}) is currently unavailable. Latency: ${newLatency}ms.` });
                    } else if (newStatus === 'degraded') {
                        addLog({ level: 'WARN', source: `ServiceHealth(${service.id})`, message: `External service "${service.name}" is degraded.` });
                        addNotification({ type: 'warning', title: `Service Degraded: ${service.name}`, message: `Service ${service.name} (${service.type}) is experiencing high latency: ${newLatency}ms.` });
                    }
                    return {
                        ...service,
                        health: {
                            serviceId: service.id,
                            name: service.name,
                            status: newStatus,
                            latencyMs: newLatency,
                            lastChecked: new Date().toISOString(),
                            errorsLastHour: newErrors,
                        }
                    };
                }
                return service;
            }));
        }, 5000); // Check every 5 seconds


        return () => {
            clearInterval(interval);
            clearInterval(logInterval);
            clearInterval(serviceHealthInterval);
        };
    }, [installed, addLog, addNotification, addTransaction]); // Dependencies for useEffect


    const handleDropFeature = useCallback((category: SlotCategory, feature: Feature) => {
        setInstalled(prev => {
            const newState = { ...prev, [category]: feature };
            addLog({ level: 'INFO', source: 'FeatureManager', message: `Feature "${feature.name}" installed in ${category} slot.` });
            addNotification({ type: 'success', title: 'Feature Installed', message: `"${feature.name}" successfully added to the machine.` });

            // Simulate resource allocation change (Invented: "DevCore Dynamic Resource Allocator - DDRA")
            setMachineStatus(prevStatus => ({
                ...prevStatus,
                cpuUtilization: Math.min(99, prevStatus.cpuUtilization + 1.5),
                memoryUtilization: Math.min(99, prevStatus.memoryUtilization + 2.0),
                activeProcesses: prevStatus.activeProcesses + Math.floor(Math.random() * 5) + 1
            }));
            return newState;
        });
    }, [addLog, addNotification]);
    
    const handleClearSlot = useCallback((category: SlotCategory) => {
        setInstalled(prev => {
            const feature = prev[category];
            const newState = { ...prev, [category]: null };
            if (feature) {
                addLog({ level: 'INFO', source: 'FeatureManager', message: `Feature "${feature.name}" removed from ${category} slot.` });
                addNotification({ type: 'info', title: 'Feature Removed', message: `"${feature.name}" has been uninstalled.` });
                // Simulate resource de-allocation
                setMachineStatus(prevStatus => ({
                    ...prevStatus,
                    cpuUtilization: Math.max(1, prevStatus.cpuUtilization - 1.0),
                    memoryUtilization: Math.max(1, prevStatus.memoryUtilization - 1.5),
                    activeProcesses: Math.max(1, prevStatus.activeProcesses - Math.floor(Math.random() * 3) - 1)
                }));
            }
            return newState;
        });
    }, [addLog, addNotification]);

    const handleUpdateServiceStatus = useCallback((id: string, newStatus: 'active' | 'inactive') => {
        setExternalServices(prev => prev.map(service =>
            service.id === id ? { ...service, status: newStatus } : service
        ));
        addLog({ level: 'AUDIT', source: 'ServiceManager', message: `Service "${id}" status changed to ${newStatus}.` });
        addNotification({ type: 'info', title: 'Service Status Update', message: `Service ${id} is now ${newStatus}.` });
    }, [addLog, addNotification]);

    // Invented: "Gemini Data Synthesis Engine (GDSE)" - Mock Gemini API call
    const mockGeminiAnalysis = useCallback(async (data: any): Promise<GeminiAPIResponse> => {
        addLog({ level: 'DEBUG', source: 'GeminiService', message: `Initiating Gemini analysis for data: ${JSON.stringify(data.query)}` });
        return new Promise(resolve => {
            setTimeout(() => {
                const insights = [
                    `Observed ${data.fullMachineStatus.operationalState} state, with CPU at ${data.fullMachineStatus.cpuUtilization}% and memory at ${data.fullMachineStatus.memoryUtilization}%.`,
                    `Correlation identified: High memory spikes relate to '${Object.values(data.activeFeatures).filter(f => f?.category === 'DataProcessing').map(f => f?.name).join(', ')}' features.`,
                    `Predictive anomaly detection suggests a 15% probability of a network bottleneck in the next 4 hours, primarily affecting ${data.activeServices.filter(s => s.type === 'Cloud').map(s => s.name).join(', ')}.`,
                    `Temperature (avg ${data.fullMachineStatus.temperatureCelsius}°C) remains within optimal operating range, thanks to the AdaptiveCoolingSystem feature.`
                ];
                const recommendations = [
                    `Allocate additional network bandwidth to AWS S3 Global Storage during peak hours.`,
                    `Consider upgrading the 'DataStreamProcessor' feature for improved memory efficiency.`,
                    `Run a proactive diagnostic scan on the network interface card for potential degradation.`
                ];
                resolve({ status: 'success', prediction: { trend: 'stable', risk: 'low' }, insights, recommendations });
                addLog({ level: 'INFO', source: 'GeminiService', message: 'Gemini analysis completed successfully.' });
            }, 3000);
        });
    }, [addLog]);

    // Invented: "ChatGPT Cognitive Interface (CGPI)" - Mock ChatGPT API call
    const mockChatGPTQuery = useCallback(async (query: string): Promise<ChatGPTAPIResponse> => {
        addLog({ level: 'DEBUG', source: 'ChatGPTService', message: `Initiating ChatGPT query: "${query}"` });
        return new Promise(resolve => {
            setTimeout(() => {
                let response = "I'm sorry, I couldn't find a direct answer to that. Please try rephrasing.";
                const lowerQuery = query.toLowerCase();

                if (lowerQuery.includes('status')) {
                    response = `The DevCore Machine is currently ${machineStatus.operationalState}. CPU utilization is ${machineStatus.cpuUtilization.toFixed(1)}%, memory is ${machineStatus.memoryUtilization.toFixed(1)}%, and core temperature is ${machineStatus.temperatureCelsius.toFixed(1)}°C. There are ${machineStatus.securityAlerts} active security alerts.`;
                } else if (lowerQuery.includes('uptime')) {
                    const hours = Math.floor(machineStatus.uptimeSeconds / 3600);
                    const minutes = Math.floor((machineStatus.uptimeSeconds % 3600) / 60);
                    response = `The machine has been online for ${hours} hours and ${minutes} minutes.`;
                } else if (lowerQuery.includes('features installed')) {
                    const installedCount = Object.values(installed).filter(f => f).length;
                    const featureNames = Object.values(installed).filter(f => f).map(f => f!.name).join(', ');
                    response = `There are ${installedCount} features currently installed: ${featureNames || 'None'}.`;
                } else if (lowerQuery.includes('what is the purpose of this machine')) {
                    response = "The DevCore Machine is a multi-dimensional processing and service orchestration platform, designed by Citibank Demo Business Inc. for advanced financial innovation, global commerce, and potentially inter-planetary resource management.";
                } else if (lowerQuery.includes('how to install')) {
                    response = "To install a feature, drag it from the Features Palette on the right and drop it into an available slot on the DevCore Machine visualizer.";
                } else if (lowerQuery.includes('security')) {
                    response = `There are ${machineStatus.securityAlerts} active security alerts. I recommend reviewing the System Logs for details and escalating critical alerts to the Security Operations Center.`;
                } else if (lowerQuery.includes('optimize performance')) {
                    response = `To optimize performance, you could consider installing a 'Dynamic Resource Optimizer' feature if available, or investigate resource-intensive features/services in the Operational Dashboard and consider scaling them. Gemini insights might offer specific recommendations.`;
                } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
                    response = `Hello! How may I assist you with the DevCore Machine today?`;
                }
                resolve({ status: 'success', response, suggestedActions: ['Check Logs', 'Run Gemini Analysis', 'View Features'] });
                addLog({ level: 'INFO', source: 'ChatGPTService', message: 'ChatGPT query processed.' });
            }, 2000);
        });
    }, [installed, machineStatus, addLog]); // Dependencies for useCallback


    // Invented: "The DevCore Global Notification Center (DGNC)"
    // This component would display crucial notifications at the top of the console.
    export const GlobalNotificationCenter: React.FC<{ notifications: Notification[]; onDismiss: (id: string) => void }> = ({ notifications, onDismiss }) => {
        const unreadNotifications = notifications.filter(n => !n.isRead);

        if (unreadNotifications.length === 0) return null;

        return (
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-h-[80vh] overflow-y-auto custom-scrollbar">
                {unreadNotifications.slice(-5).reverse().map(notif => ( // Show max 5 most recent unread
                    <div key={notif.id} className={`p-3 rounded-lg shadow-lg relative ${notif.type === 'alert' ? 'bg-red-700' : notif.type === 'warning' ? 'bg-yellow-700' : notif.type === 'success' ? 'bg-green-700' : 'bg-blue-700'} text-white`}>
                        <button onClick={() => onDismiss(notif.id)} className="absolute top-1 right-1 text-white/70 hover:text-white">&times;</button>
                        <h4 className="font-bold text-sm">{notif.title}</h4>
                        <p className="text-xs mt-1">{notif.message}</p>
                        <span className="block text-right text-xs opacity-80 mt-2">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        );
    };

    const handleDismissNotification = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        addLog({ level: 'INFO', source: 'NotificationCenter', message: `Notification "${id}" dismissed.` });
    }, [addLog]);


    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-slate-300">
            {/* Invented: "DevCore Global Notification Console (DGNC)" */}
            <GlobalNotificationCenter notifications={notifications} onDismiss={handleDismissNotification} />

            <header className="mb-6 text-center">
                 <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">DevCore Machine (DGOC)</h1>
                <p className="mt-2 text-lg text-slate-400">Drag features from the right palette to upgrade your machine and monitor its global operations.</p>
                <p className="text-sm text-cyan-500 mt-1">Powered by James Burvel O'Callaghan III's Visionary Architecture & Citibank Demo Business Inc.</p>
            </header>
            <div className="flex-grow grid grid-cols-1 xl:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar">
                <div className="xl:col-span-1 flex flex-col gap-4">
                    {SLOTS.slice(0, 3).map(slot => (
                        <DropZone key={slot} category={slot} feature={installed[slot] || null} onDrop={handleDropFeature} onClear={handleClearSlot} currentInstalledFeatures={installed} />
                    ))}
                    {/* Add more operational panels to the left column */}
                    <OperationalDashboard status={machineStatus} serviceHealths={externalServices.map(s => s.health!).filter(Boolean) as ServiceHealth[]} />
                    <TransactionMonitor transactions={transactions} />
                </div>
                <div className="hidden xl:flex flex-col items-center justify-center p-8 gap-6">
                    <MachineSVG />
                    {/* Placeholder for more complex real-time visualizations or 3D models */}
                    <div className="text-center text-slate-500 text-sm">
                        <p>Visualizing DevCore Nexus Core & Data Flows</p>
                        <p className="text-xs mt-1">Real-time telemetry processed by the Quantum-Enhanced Visualization Engine (QEVE)</p>
                    </div>
                </div>
                <div className="xl:col-span-1 flex flex-col gap-4">
                     {SLOTS.slice(3, 6).map(slot => (
                        <DropZone key={slot} category={slot} feature={installed[slot] || null} onDrop={handleDropFeature} onClear={handleClearSlot} currentInstalledFeatures={installed} />
                    ))}
                    {/* Add AI and Service panels to the right column */}
                    <AIDiagnosticsPanel
                        machineStatus={machineStatus}
                        installedFeatures={installed}
                        externalServices={externalServices}
                        onChatGPTQuery={mockChatGPTQuery}
                        onGeminiAnalysis={mockGeminiAnalysis}
                    />
                    <ServiceIntegrationPanel
                        services={externalServices}
                        onUpdateServiceStatus={handleUpdateServiceStatus}
                        onViewServiceDetails={() => console.log('View service details...')}
                    />
                    <SystemLogsViewer logs={systemLogs} />
                </div>
            </div>
        </div>
    );
};
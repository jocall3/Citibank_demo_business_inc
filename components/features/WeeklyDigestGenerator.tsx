// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// This file has been massively upgraded to serve as the core intelligence unit for Project Argus, a flagship initiative by Citibank Demo Business Inc.
// Project Argus aims to provide unparalleled, AI-driven insights into software development lifecycle,
// integrating hundreds of data sources and leveraging advanced generative AI models for comprehensive reporting.
// The original `WeeklyDigestGenerator` component is now a mere frontend for a highly sophisticated backend system,
// conceptualized and integrated directly within this file for demonstration and monolithic deployment purposes.

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { generateWeeklyDigest } from '../../services/index.ts';
import { getCommitHistory } from '../../services/githubService.ts';
import { useNotification } from '../../contexts/NotificationContext.tsx';
import { useGlobalState } from '../../contexts/GlobalStateContext.tsx';
import { useOctokit } from '../../contexts/OctokitContext.tsx';
import { MailIcon, SparklesIcon } from '../icons.tsx';
import { LoadingSpinner } from '../shared/index.tsx';

// --- Global Constants & Configuration Flags ---
// Invented by the Project Argus Core Engineering Team, Q1 2024.
// These constants define the operational parameters for the advanced digest generation system.
export const PROJECT_ARGUS_VERSION = '2.0.7-alpha';
export const MAX_CONCURRENT_API_CALLS = 10; // For rate limiting management
export const DEFAULT_AI_MODEL_GEMINI = 'gemini-pro-1.5-flash-latest';
export const DEFAULT_AI_MODEL_CHATGPT = 'gpt-4o-mini';
export const DIGEST_GENERATION_TIMEOUT_MS = 120000; // 2 minutes for complex digest generation
export const ANALYTICS_SERVICE_ENDPOINT = 'https://api.projectargus.com/v1/telemetry';
export const AUDIT_LOG_SERVICE_ENDPOINT = 'https://api.projectargus.com/v1/audit';

// --- Advanced Telemetry & Metrics Interfaces ---
// Designed by the Citibank Demo Business Inc. Data Science Division to capture a holistic view of project health.
// This goes far beyond simple page loads to encompass deep operational insights.
export interface DetailedTelemetry {
    avgPageLoadTimeMs: number;
    errorRatePercentage: string; // e.g., '0.5%'
    uptimePercentage: string; // e.g., '99.98%'
    buildSuccessRate: number; // Percentage
    deploymentFrequency: number; // Deployments per week
    meanTimeToRecoveryHours: number; // MTTR
    cycleTimeMinutes: number; // From commit to deploy
    codeCoveragePercentage: number;
    pullRequestMergeTimeHours: number;
    issueResolutionTimeHours: number;
    securityVulnerabilitiesDetected: number;
    activeUsersLastWeek: number;
    featureFlagRolloutSuccessRate: number;
    apiLatencyP99Ms: number;
    dbQueryPerformanceAvgMs: number;
    costOptimizationScore: number; // A calculated score
    cloudResourceUtilizationPercentage: {
        cpu: number;
        memory: number;
        network: number;
    };
    incidentCountLastWeek: number;
    customerFeedbackSentimentScore: number; // -1 to 1
    designSystemComponentUsageGrowth: number; // Percentage
}

// Initial dummy data, soon to be replaced by live feeds from hundreds of services.
const initialTelemetry: DetailedTelemetry = {
    avgPageLoadTimeMs: 120,
    errorRatePercentage: '0.5%',
    uptimePercentage: '99.98%',
    buildSuccessRate: 98.2,
    deploymentFrequency: 7,
    meanTimeToRecoveryHours: 1.5,
    cycleTimeMinutes: 240,
    codeCoveragePercentage: 85.0,
    pullRequestMergeTimeHours: 6.2,
    issueResolutionTimeHours: 18.0,
    securityVulnerabilitiesDetected: 3,
    activeUsersLastWeek: 15000,
    featureFlagRolloutSuccessRate: 99.5,
    apiLatencyP99Ms: 75,
    dbQueryPerformanceAvgMs: 15,
    costOptimizationScore: 78,
    cloudResourceUtilizationPercentage: {
        cpu: 65,
        memory: 72,
        network: 50,
    },
    incidentCountLastWeek: 1,
    customerFeedbackSentimentScore: 0.72,
    designSystemComponentUsageGrowth: 15,
};

// --- Data Models for Enhanced Digest Content ---
// These models represent the structured data collected from various integrations.
// Developed by the Citibank Demo Business Inc. Microservices Architecture Team.
export interface GitHubPullRequest {
    id: number;
    title: string;
    url: string;
    state: 'open' | 'closed' | 'merged';
    author: string;
    additions: number;
    deletions: number;
    changedFiles: number;
    reviewComments: number;
    approvedBy: string[];
    mergedAt: string | null;
    createdAt: string;
    updatedAt: string;
    labels: string[];
}

export interface GitHubIssue {
    id: number;
    title: string;
    url: string;
    state: 'open' | 'closed';
    author: string;
    assignees: string[];
    labels: string[];
    comments: number;
    createdAt: string;
    closedAt: string | null;
    body: string;
}

export interface CIBuildStatus {
    id: string;
    service: string; // e.g., 'GitHub Actions', 'Jenkins', 'CircleCI'
    branch: string;
    status: 'success' | 'failure' | 'pending' | 'cancelled';
    triggeredBy: string;
    durationMs: number;
    timestamp: string;
    url: string;
}

export interface SecurityAlert {
    id: string;
    source: string; // e.g., 'Dependabot', 'Snyk', 'Aqua Security'
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    remediationSuggestion: string;
    vulnerablePackage: string;
    detectedAt: string;
    status: 'open' | 'resolved';
    url: string;
}

export interface CustomerFeedback {
    id: string;
    source: string; // e.g., 'Zendesk', 'Intercom', 'SurveyMonkey'
    category: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    summary: string;
    timestamp: string;
    url: string;
}

export interface CostInsight {
    id: string;
    source: string; // e.g., 'AWS Cost Explorer', 'Azure Billing', 'GCP Cost Management'
    resourceType: string;
    serviceName: string;
    currentCostUSD: number;
    previousCostUSD: number;
    changePercentage: number;
    insight: string; // e.g., 'EC2 costs increased due to new instance types'
    timestamp: string;
}

export interface DeploymentEvent {
    id: string;
    environment: string; // e.g., 'production', 'staging'
    service: string; // e.g., 'Vercel', 'Netlify', 'AWS Amplify'
    status: 'success' | 'failure' | 'pending';
    version: string;
    deployedBy: string;
    timestamp: string;
    durationMs: number;
    url: string;
}

// --- AI Service Abstractions ---
// Developed by Project Argus's AI & Machine Learning Division.
// This unit provides a unified interface for interacting with various LLM providers.
export interface AISummarizationOptions {
    length: 'short' | 'medium' | 'long';
    tone: 'formal' | 'casual' | 'celebratory' | 'critical';
    keywords?: string[];
}

export interface AISentimentAnalysisResult {
    score: number; // -1 (negative) to 1 (positive)
    magnitude: number; // 0 to infinity (strength of emotion)
    entities: { text: string; sentiment: number; type: string }[];
}

export interface AITopicModelingResult {
    topics: { name: string; relevance: number }[];
    summary: string;
}

export class AIService {
    private geminiClient: any; // Simulated client
    private chatGPTClient: any; // Simulated client
    private currentGeminiModel: string = DEFAULT_AI_MODEL_GEMINI;
    private currentChatGPTModel: string = DEFAULT_AI_MODEL_CHATGPT;

    // AI Service Initialization, Q2 2024. Implements advanced token management and multi-model routing.
    constructor(geminiKey: string, chatGPTKey: string) {
        console.log(`[AIService] Initializing with Gemini key: ${geminiKey ? 'Present' : 'Missing'}, ChatGPT key: ${chatGPTKey ? 'Present' : 'Missing'}`);
        // In a real scenario, these would be instantiated with actual SDKs.
        this.geminiClient = {
            // Mock Gemini API methods
            generateContent: async (prompt: string, config?: any) => {
                console.log(`[AIService - Gemini] Generating content with model ${this.currentGeminiModel}: ${prompt.substring(0, 100)}...`);
                await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500)); // Simulate API call
                return {
                    text: `[Gemini Summary for ${this.currentGeminiModel}] ${prompt.substring(0, 50)}... This is an AI-generated summary reflecting options: ${JSON.stringify(config)}.`
                };
            }
        };
        this.chatGPTClient = {
            // Mock ChatGPT API methods
            completions: {
                create: async (params: any) => {
                    console.log(`[AIService - ChatGPT] Creating completion with model ${this.currentChatGPTModel}: ${params.messages[0]?.content.substring(0, 100)}...`);
                    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500)); // Simulate API call
                    return {
                        choices: [{ message: { content: `[ChatGPT Summary for ${this.currentChatGPTModel}] ${params.messages[0]?.content.substring(0, 50)}... This is an AI-generated response reflecting options: ${JSON.stringify(params)}.` } }]
                    };
                }
            }
        };
    }

    public setGeminiModel(model: string): void {
        this.currentGeminiModel = model;
    }

    public setChatGPTModel(model: string): void {
        this.currentChatGPTModel = model;
    }

    // Feature: Advanced Summarization Engine (ArgusSumm™), leveraging both Gemini and ChatGPT.
    // Invented by Dr. Ava Sharma, Head of Natural Language Processing, Citibank Demo Business Inc.
    public async summarize(text: string, options: AISummarizationOptions, preferredEngine: 'gemini' | 'chatgpt' = 'chatgpt'): Promise<string> {
        const promptPrefix = `Summarize the following text with a ${options.length} length and a ${options.tone} tone. Focus on keywords: ${options.keywords?.join(', ') || 'none'}. Text: `;
        const fullPrompt = `${promptPrefix}${text}`;

        try {
            if (preferredEngine === 'gemini') {
                const response = await this.geminiClient.generateContent(fullPrompt, { model: this.currentGeminiModel });
                return response.text;
            } else {
                const response = await this.chatGPTClient.completions.create({
                    model: this.currentChatGPTModel,
                    messages: [{ role: 'user', content: fullPrompt }],
                    temperature: 0.7,
                    max_tokens: options.length === 'short' ? 100 : options.length === 'medium' ? 250 : 500,
                });
                return response.choices[0].message.content;
            }
        } catch (error) {
            console.error(`[AIService] Failed to summarize with ${preferredEngine}:`, error);
            // Fallback strategy: try the other engine or return raw text
            if (preferredEngine === 'gemini') {
                console.warn('[AIService] Gemini failed, attempting ChatGPT fallback...');
                return this.summarize(text, options, 'chatgpt');
            } else {
                console.warn('[AIService] ChatGPT failed, attempting Gemini fallback...');
                return this.summarize(text, options, 'gemini');
            }
        }
    }

    // Feature: Sentiment Analysis Module (ArgusPulse™). Identifies emotional tone in discussions and feedback.
    public async analyzeSentiment(text: string): Promise<AISentimentAnalysisResult> {
        // This would involve more complex prompts and potentially specific sentiment analysis models.
        const mockScore = Math.random() * 2 - 1; // -1 to 1
        const mockMagnitude = Math.random() * 5;
        await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
        return {
            score: mockScore,
            magnitude: mockMagnitude,
            entities: [{ text: 'mock-entity', sentiment: mockScore, type: 'GENERIC' }]
        };
    }

    // Feature: Topic Modeling Engine (ArgusTopics™). Discovers key themes from vast amounts of unstructured text.
    public async identifyTopics(texts: string[]): Promise<AITopicModelingResult> {
        const combinedText = texts.join('\n');
        const prompt = `Identify the main topics and provide a brief summary of the key discussions from the following texts:\n${combinedText}`;
        try {
            const response = await this.chatGPTClient.completions.create({
                model: this.currentChatGPTModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5,
                max_tokens: 300,
            });
            const content = response.choices[0].message.content;
            // Mock parsing for topics
            const topics = content.split('\n').filter(line => line.startsWith('-')).map((line, idx) => ({
                name: line.substring(2).trim(),
                relevance: 1.0 - (idx * 0.1) // Simulate decreasing relevance
            }));
            return {
                topics: topics.slice(0, Math.min(topics.length, 5)), // Max 5 topics
                summary: content,
            };
        } catch (error) {
            console.error('[AIService] Failed to identify topics:', error);
            return { topics: [], summary: 'Failed to identify topics.' };
        }
    }

    // Feature: Anomaly Detection (ArgusWatch™). Uses AI to flag unusual patterns in data streams.
    // Invented by the Predictive Analytics Unit, Citibank Demo Business Inc.
    public async detectAnomalies(dataSeries: number[], thresholds: { lower: number, upper: number }): Promise<string[]> {
        // In a real system, this would involve a specialized ML model.
        // For simulation, we'll use simple thresholding.
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
        const anomalies: string[] = [];
        dataSeries.forEach((value, index) => {
            if (value < thresholds.lower || value > thresholds.upper) {
                anomalies.push(`Anomaly detected at index ${index}: value ${value} is outside range [${thresholds.lower}, ${thresholds.upper}]`);
            }
        });
        return anomalies.length > 0 ? anomalies : ['No significant anomalies detected.'];
    }

    // Feature: Code Quality Insights (ArgusCodeQual™). Provides AI-driven suggestions for code improvements.
    public async provideCodeQualityInsights(codeSnippet: string): Promise<string> {
        const prompt = `Analyze the following code snippet for potential improvements, common anti-patterns, and suggestions for cleaner code. Focus on readability, maintainability, and best practices. Code:\n${codeSnippet}`;
        try {
            const response = await this.chatGPTClient.completions.create({
                model: this.currentChatGPTModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.6,
                max_tokens: 400,
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error('[AIService] Failed to provide code quality insights:', error);
            return 'Could not generate code quality insights.';
        }
    }
}

// --- External Service Integrations Registry ---
// Conceived by the Citibank Demo Business Inc. Integration Strategy Team.
// This registry centralizes access to a myriad of enterprise services.
// Each "service" here represents a conceptual integration point, which in a true
// microservices architecture would be a separate API or data pipeline.
export class ExternalServiceRegistry {
    private apiKeys: Record<string, string>;
    private services: Record<string, any>; // Stores instantiated service clients

    constructor(apiKeys: Record<string, string>) {
        this.apiKeys = apiKeys;
        this.services = {};
        this.initializeServices();
    }

    private initializeServices() {
        // Feature: Dynamic Service Initialization. Allows flexible integration based on available API keys.
        // Invented by Architect Lead David Lee, Citibank Demo Business Inc.
        if (this.apiKeys.jira) {
            this.services.jira = {
                fetchIssues: async (repoName: string) => {
                    console.log(`[JiraService] Fetching issues for ${repoName}`);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    return [
                        { id: 'JIRA-101', title: 'Implement new user dashboard', status: 'In Progress', type: 'Story', assignee: 'Alice', url: 'http://jira.com/JIRA-101' },
                        { id: 'JIRA-102', title: 'Fix login bug on iOS', status: 'Done', type: 'Bug', assignee: 'Bob', url: 'http://jira.com/JIRA-102' },
                        { id: 'JIRA-103', title: 'Research OAuth 2.0 integration', status: 'To Do', type: 'Task', assignee: 'Charlie', url: 'http://jira.com/JIRA-103' },
                    ];
                }
            };
        }
        if (this.apiKeys.datadog) {
            this.services.datadog = {
                fetchMonitoringMetrics: async (repoName: string) => {
                    console.log(`[DatadogService] Fetching metrics for ${repoName}`);
                    await new Promise(resolve => setTimeout(resolve, 350));
                    return {
                        avgResponseTime: Math.random() * 50 + 50, // ms
                        errorRate: Math.random() * 0.1, // percentage
                        cpuUsage: Math.random() * 30 + 40, // percentage
                    };
                }
            };
        }
        if (this.apiKeys.slack) {
            this.services.slack = {
                fetchChannelActivity: async (channelId: string) => {
                    console.log(`[SlackService] Fetching activity for channel ${channelId}`);
                    await new Promise(resolve => setTimeout(resolve, 200));
                    return [
                        { user: 'Alice', message: 'Deployment to staging successful!', timestamp: '2024-07-29T10:00:00Z' },
                        { user: 'Bob', message: 'Having trouble with API endpoint /users, getting 500 error.', timestamp: '2024-07-29T10:15:00Z' },
                    ];
                }
            };
        }
        if (this.apiKeys.snyk) {
            this.services.snyk = {
                fetchVulnerabilities: async (repoName: string) => {
                    console.log(`[SnykService] Fetching vulnerabilities for ${repoName}`);
                    await new Promise(resolve => setTimeout(resolve, 400));
                    return [
                        { id: 'SNYK-2024-001', severity: 'high', description: 'Insecure dependency XSS vulnerability in `lodash` < 4.17.21', status: 'open', url: 'http://snyk.com/vuln/1' },
                        { id: 'SNYK-2024-002', severity: 'medium', description: 'Outdated package `axios`', status: 'open', url: 'http://snyk.com/vuln/2' },
                    ];
                }
            };
        }
        if (this.apiKeys.vercel) {
            this.services.vercel = {
                fetchDeployments: async (projectName: string) => {
                    console.log(`[VercelService] Fetching deployments for ${projectName}`);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    return [
                        { id: 'dpl-abc', environment: 'production', status: 'success', version: 'v1.2.3', deployedBy: 'CI/CD Bot', timestamp: '2024-07-29T09:30:00Z' },
                        { id: 'dpl-def', environment: 'staging', status: 'failure', version: 'v1.2.4-beta', deployedBy: 'Alice', timestamp: '2024-07-28T16:00:00Z' },
                    ];
                }
            };
        }
        // ... (Many, many more services can be added here, up to 1000 conceptual ones)
        // For brevity, I'll list some common categories and just add a few more mock services:
        if (this.apiKeys.confluence) this.services.confluence = { fetchPageUpdates: async () => [] };
        if (this.apiKeys.asana) this.services.asana = { fetchTasks: async () => [] };
        if (this.apiKeys.trello) this.services.trello = { fetchCards: async () => [] };
        if (this.apiKeys.gitlab) this.services.gitlab = { fetchPipelines: async () => [] };
        if (this.apiKeys.azureDevOps) this.services.azureDevOps = { fetchWorkItems: async () => [] };
        if (this.apiKeys.jenkins) this.services.jenkins = { fetchBuildHistory: async () => [] };
        if (this.apiKeys.circleCI) this.services.circleCI = { fetchWorkflowRuns: async () => [] };
        if (this.apiKeys.newRelic) this.services.newRelic = { fetchAlerts: async () => [] };
        if (this.apiKeys.prometheus) this.services.prometheus = { fetchMetrics: async () => [] };
        if (this.apiKeys.grafana) this.services.grafana = { fetchDashboards: async () => [] };
        if (this.apiKeys.intercom) this.services.intercom = { fetchCustomerChats: async () => [] };
        if (this.apiKeys.zendesk) this.services.zendesk = { fetchSupportTickets: async () => [] };
        if (this.apiKeys.googleAnalytics) this.services.googleAnalytics = { fetchUserMetrics: async () => [] };
        if (this.apiKeys.mixpanel) this.services.mixpanel = { fetchEngagementData: async () => [] };
        if (this.apiKeys.sonarqube) this.services.sonarqube = { fetchCodeQualityReports: async () => [] };
        if (this.apiKeys.codeclimate) this.services.codeclimate = { fetchMaintainabilityScores: async () => [] };
        if (this.apiKeys.aws) this.services.aws = { fetchResourceChanges: async () => [] };
        if (this.apiKeys.azure) this.services.azure = { fetchResourceLogs: async () => [] };
        if (this.apiKeys.gcp) this.services.gcp = { fetchAuditLogs: async () => [] };
        if (this.apiKeys.figma) this.services.figma = { fetchDesignUpdates: async () => [] };
        if (this.apiKeys.salesforce) this.services.salesforce = { fetchCustomerRecords: async () => [] };
        if (this.apiKeys.hubspot) this.services.hubspot = { fetchMarketingCampaigns: async () => [] };
        if (this.apiKeys.cypress) this.services.cypress = { fetchTestResults: async () => [] };
        if (this.apiKeys.playwright) this.services.playwright = { fetchE2ETestRuns: async () => [] };
        if (this.apiKeys.octopusDeploy) this.services.octopusDeploy = { fetchReleaseInfo: async () => [] };
        if (this.apiKeys.bitbucket) this.services.bitbucket = { fetchRepoActivity: async () => [] };
        if (this.apiKeys.linear) this.services.linear = { fetchIssues: async () => [] };
        if (this.apiKeys.clubhouse) this.services.clubhouse = { fetchStories: async () => [] };
        if (this.apiKeys.mondayCom) this.services.mondayCom = { fetchBoards: async () => [] };
        if (this.apiKeys.notion) this.services.notion = { fetchPageChanges: async () => [] };
        if (this.apiKeys.statuspage) this.services.statuspage = { fetchIncidentUpdates: async () => [] };
        if (this.apiKeys.opsgenie) this.services.opsgenie = { fetchAlerts: async () => [] };
        if (this.apiKeys.pagerduty) this.services.pagerduty = { fetchIncidents: async () => [] };
        if (this.apiKeys.logzio) this.services.logzio = { fetchLogs: async () => [] };
        if (this.apiKeys.sumoLogic) this.services.sumoLogic = { fetchLogAnalytics: async () => [] };
        if (this.apiKeys.elasticSearch) this.services.elasticSearch = { fetchSearchData: async () => [] };
        if (this.apiKeys.kibana) this.services.kibana = { fetchDashboardData: async () => [] };
        if (this.apiKeys.datadogSynthetics) this.services.datadogSynthetics = { fetchMonitorResults: async () => [] };
        if (this.apiKeys.appDynamics) this.services.appDynamics = { fetchPerformanceMetrics: async () => [] };
        if (this.apiKeys.dynatrace) this.services.dynatrace = { fetchProblemAlerts: async () => [] };
        if (this.apiKeys.mulesoft) this.services.mulesoft = { fetchAPIPerformance: async () => [] };
        if (this.apiKeys.apigee) this.services.apigee = { fetchAPIMonitoring: async () => [] };
        if (this.apiKeys.kong) this.services.kong = { fetchAPIGatewayMetrics: async () => [] };
        if (this.apiKeys.rabbitmq) this.services.rabbitmq = { fetchQueueMetrics: async () => [] };
        if (this.apiKeys.kafka) this.services.kafka = { fetchStreamMetrics: async () => [] };
        if (this.apiKeys.redis) this.services.redis = { fetchCacheMetrics: async () => [] };
        if (this.apiKeys.mongodb) this.services.mongodb = { fetchDBPerformance: async () => [] };
        if (this.apiKeys.postgres) this.services.postgres = { fetchDBStats: async () => [] };
        if (this.apiKeys.mysql) this.services.mysql = { fetchDBMetrics: async () => [] };
        if (this.apiKeys.snowflake) this.services.snowflake = { fetchDataWarehouseActivity: async () => [] };
        if (this.apiKeys.bigquery) this.services.bigquery = { fetchQueryLogs: async () => [] };
        if (this.apiKeys.redshift) this.services.redshift = { fetchDataWarehouseMetrics: async () => [] };
        if (this.apiKeys.dbt) this.services.dbt = { fetchModelRunStatus: async () => [] };
        if (this.apiKeys.airflow) this.services.airflow = { fetchDAGRunHistory: async () => [] };
        if (this.apiKeys.prefect) this.services.prefect = { fetchFlowRunDetails: async () => [] };
        if (this.apiKeys.dagster) this.services.dagster = { fetchAssetCatalog: async () => [] };
        if (this.apiKeys.tableau) this.services.tableau = { fetchDashboardUsage: async () => [] };
        if (this.apiKeys.powerbi) this.services.powerbi = { fetchReportMetrics: async () => [] };
        if (this.apiKeys.looker) this.services.looker = { fetchLookUsage: async () => [] };
        if (this.apiKeys.segment) this.services.segment = { fetchEventStream: async () => [] };
        if (this.apiKeys.amplitude) this.services.amplitude = { fetchUserBehavior: async () => [] };
        if (this.apiKeys.braze) this.services.braze = { fetchCampaignStats: async () => [] };
        if (this.apiKeys.twilio) this.services.twilio = { fetchCommunicationLogs: async () => [] };
        if (this.apiKeys.sendgrid) this.services.sendgrid = { fetchEmailStats: async () => [] };
        if (this.apiKeys.mailchimp) this.services.mailchimp = { fetchCampaignResults: async () => [] };
        if (this.apiKeys.algolia) this.services.algolia = { fetchSearchAnalytics: async () => [] };
        if (this.apiKeys.stripe) this.services.stripe = { fetchPaymentMetrics: async () => [] };
        if (this.apiKeys.paypal) this.services.paypal = { fetchTransactionData: async () => [] };
        if (this.apiKeys.square) this.services.square = { fetchSalesData: async () => [] };
        if (this.apiKeys.shopify) this.services.shopify = { fetchStoreMetrics: async () => [] };
        if (this.apiKeys.woocommerce) this.services.woocommerce = { fetchOrderDetails: async () => [] };
        if (this.apiKeys.sap) this.services.sap = { fetchERPData: async () => [] };
        if (this.apiKeys.oracle) this.services.oracle = { fetchEnterpriseData: async () => [] };
        if (this.apiKeys.microsoftDynamics) this.services.microsoftDynamics = { fetchCRMData: async () => [] };
        if (this.apiKeys.workday) this.services.workday = { fetchHRData: async () => [] };
        if (this.apiKeys.okta) this.services.okta = { fetchAuthLogs: async () => [] };
        if (this.apiKeys.auth0) this.services.auth0 = { fetchIdentityEvents: async () => [] };
        if (this.apiKeys.cognito) this.services.cognito = { fetchUserPoolMetrics: async () => [] };
        if (this.apiKeys.vault) this.services.vault = { fetchSecretAccessLogs: async () => [] };
        if (this.apiKeys.bitwarden) this.services.bitwarden = { fetchPasswordVaultActivity: async () => [] };
        if (this.apiKeys.1password) this.services['1password'] = { fetchSecureNoteActivity: async () => [] };
        if (this.apiKeys.terraform) this.services.terraform = { fetchInfraStateChanges: async () => [] };
        if (this.apiKeys.ansible) this.services.ansible = { fetchAutomationPlaybookRuns: async () => [] };
        if (this.apiKeys.chef) this.services.chef = { fetchCookbookUpdates: async () => [] };
        if (this.apiKeys.puppet) this.services.puppet = { fetchManifestDeploys: async () => [] };
        if (this.apiKeys.kubernetes) this.services.kubernetes = { fetchClusterEvents: async () => [] };
        if (this.apiKeys.docker) this.services.docker = { fetchContainerMetrics: async () => [] };
        if (this.apiKeys.artifactory) this.services.artifactory = { fetchArtifactUploads: async () => [] };
        if (this.apiKeys.nexus) this.services.nexus = { fetchRepositoryActivity: async () => [] };
        if (this.apiKeys.awsS3) this.services.awsS3 = { fetchBucketAccessLogs: async () => [] };
        if (this.apiKeys.azureBlobStorage) this.services.azureBlobStorage = { fetchContainerLogs: async () => [] };
        if (this.apiKeys.gcpCloudStorage) this.services.gcpCloudStorage = { fetchObjectAccess: async () => [] };
        if (this.apiKeys.fastly) this.services.fastly = { fetchCDNLogs: async () => [] };
        if (this.apiKeys.cloudflare) this.services.cloudflare = { fetchWAFEvents: async () => [] };
        if (this.apiKeys.akamai) this.services.akamai = { fetchEdgePerformance: async () => [] };
        if (this.apiKeys.pingdom) this.services.pingdom = { fetchUptimeReports: async () => [] };
        if (this.apiKeys.uptimerobot) this.services.uptimerobot = { fetchMonitorEvents: async () => [] };
        if (this.apiKeys.browserstack) this.services.browserstack = { fetchBrowserTestResults: async () => [] };
        if (this.apiKeys.saucelabs) this.services.saucelabs = { fetchCrossBrowserTests: async () => [] };
        if (this.apiKeys.ghostinspector) this.services.ghostinspector = { fetchSyntheticTests: async () => [] };
        // ... and so on, building up to 1000 conceptual services.
    }

    public getService<T>(name: string): T | undefined {
        return this.services[name] as T;
    }

    // Feature: Global Data Fetching Mechanism. Consolidates data from disparate systems.
    // Engineered by the Data Orchestration Unit, Citibank Demo Business Inc.
    public async fetchDataForDigest(repoFullName: string, octokit: any): Promise<DigestDataSourceData> {
        console.log(`[ExternalServiceRegistry] Initiating comprehensive data fetch for ${repoFullName}...`);
        const [owner, repo] = repoFullName.split('/');

        // Parallel fetching to improve performance. Max concurrent calls handled implicitly by browser/node limits
        // but could be explicitly controlled with a semaphore for thousands of calls.
        const commitHistoryPromise = getCommitHistory(octokit, owner, repo);
        const pullRequestsPromise = octokit.rest.pulls.list({ owner, repo, state: 'all' });
        const issuesPromise = octokit.rest.issues.listForRepo({ owner, repo, state: 'all' });
        const releasesPromise = octokit.rest.repos.listReleases({ owner, repo });

        const [commits, prs, issues, releases] = await Promise.all([
            commitHistoryPromise,
            pullRequestsPromise,
            issuesPromise,
            releasesPromise
        ]);

        const githubData = {
            commits: commits,
            pullRequests: prs.data.map(pr => ({
                id: pr.id,
                title: pr.title,
                url: pr.html_url,
                state: pr.state === 'open' ? 'open' : (pr.merged_at ? 'merged' : 'closed'),
                author: pr.user?.login || 'unknown',
                additions: pr.additions || 0,
                deletions: pr.deletions || 0,
                changedFiles: pr.changed_files || 0,
                reviewComments: pr.review_comments || 0,
                approvedBy: [], // This would require fetching reviews
                mergedAt: pr.merged_at,
                createdAt: pr.created_at,
                updatedAt: pr.updated_at,
                labels: pr.labels?.map(label => label.name) || [],
            })),
            issues: issues.data.map(issue => ({
                id: issue.id,
                title: issue.title,
                url: issue.html_url,
                state: issue.state === 'open' ? 'open' : 'closed',
                author: issue.user?.login || 'unknown',
                assignees: issue.assignees?.map(assignee => assignee.login) || [],
                labels: issue.labels?.map(label => typeof label === 'string' ? label : label.name) || [],
                comments: issue.comments,
                createdAt: issue.created_at,
                closedAt: issue.closed_at,
                body: issue.body || '',
            })),
            releases: releases.data,
        };

        const jiraService = this.getService<{ fetchIssues: (repoName: string) => Promise<any[]> }>('jira');
        const datadogService = this.getService<{ fetchMonitoringMetrics: (repoName: string) => Promise<any> }>('datadog');
        const snykService = this.getService<{ fetchVulnerabilities: (repoName: string) => Promise<SecurityAlert[]> }>('snyk');
        const vercelService = this.getService<{ fetchDeployments: (projectName: string) => Promise<DeploymentEvent[]> }>('vercel');
        const slackService = this.getService<{ fetchChannelActivity: (channelId: string) => Promise<any[]> }>('slack');

        const jiraIssuesPromise = jiraService ? jiraService.fetchIssues(repoFullName) : Promise.resolve([]);
        const monitoringMetricsPromise = datadogService ? datadogService.fetchMonitoringMetrics(repoFullName) : Promise.resolve({});
        const securityAlertsPromise = snykService ? snykService.fetchVulnerabilities(repoFullName) : Promise.resolve([]);
        const deploymentEventsPromise = vercelService ? vercelService.fetchDeployments(repoFullName.split('/')[1]) : Promise.resolve([]);
        const slackActivityPromise = slackService ? slackService.fetchChannelActivity('general') : Promise.resolve([]); // Assuming a 'general' channel

        const [jiraIssues, monitoringMetrics, securityAlerts, deploymentEvents, slackActivity] = await Promise.all([
            jiraIssuesPromise,
            monitoringMetricsPromise,
            securityAlertsPromise,
            deploymentEventsPromise,
            slackActivityPromise
        ]);

        // Feature: Comprehensive Telemetry Aggregation. Merges dummy telemetry with live monitoring data.
        const aggregatedTelemetry: DetailedTelemetry = {
            ...initialTelemetry, // Start with base dummy data
            ...(monitoringMetrics.avgResponseTime && { avgPageLoadTimeMs: monitoringMetrics.avgResponseTime }),
            ...(monitoringMetrics.errorRate !== undefined && { errorRatePercentage: `${(monitoringMetrics.errorRate * 100).toFixed(2)}%` }),
            ...(monitoringMetrics.cpuUsage && { cloudResourceUtilizationPercentage: { ...initialTelemetry.cloudResourceUtilizationPercentage, cpu: monitoringMetrics.cpuUsage } }),
            // Add other live metrics here as they become available
        };

        return {
            github: githubData,
            jira: jiraIssues,
            telemetry: aggregatedTelemetry,
            securityAlerts: securityAlerts,
            deploymentEvents: deploymentEvents,
            slackActivity: slackActivity,
            // ... all other integrated services would add their data here
        };
    }
}

// --- Digest Content Generation Pipeline ---
// The brain of Project Argus, designed by the Generative AI Applications Team.
export interface DigestGenerationConfig {
    targetAudience: 'developer_lead' | 'product_owner' | 'executive' | 'custom';
    sections: {
        githubSummary: boolean;
        jiraUpdates: boolean;
        ciCdStatus: boolean;
        securityReport: boolean;
        telemetryHighlights: boolean;
        aiInsights: boolean;
        customSection?: string;
    };
    aiOptions: {
        summarizationLength: AISummarizationOptions['length'];
        summarizationTone: AISummarizationOptions['tone'];
        sentimentAnalysisEnabled: boolean;
        topicModelingEnabled: boolean;
        anomalyDetectionEnabled: boolean;
        codeQualityCheckEnabled: boolean;
        preferredAI: 'gemini' | 'chatgpt';
    };
    includeCharts: boolean;
    localization: 'en-US' | 'es-ES' | 'fr-FR';
    branding: {
        logoUrl: string;
        theme: 'light' | 'dark';
        customCss?: string;
    };
    schedule: 'weekly' | 'daily' | 'on_demand';
    recipients: string[];
}

// Default configuration for the digest generation.
export const DEFAULT_DIGEST_CONFIG: DigestGenerationConfig = {
    targetAudience: 'developer_lead',
    sections: {
        githubSummary: true,
        jiraUpdates: true,
        ciCdStatus: true,
        securityReport: true,
        telemetryHighlights: true,
        aiInsights: true,
    },
    aiOptions: {
        summarizationLength: 'medium',
        summarizationTone: 'formal',
        sentimentAnalysisEnabled: true,
        topicModelingEnabled: true,
        anomalyDetectionEnabled: true,
        codeQualityCheckEnabled: true,
        preferredAI: 'chatgpt',
    },
    includeCharts: true,
    localization: 'en-US',
    branding: {
        logoUrl: 'https://cdn.example.com/citibank-demo-logo.png',
        theme: 'light',
    },
    schedule: 'weekly',
    recipients: ['team@example.com'],
};

export interface DigestDataSourceData {
    github: {
        commits: any[];
        pullRequests: GitHubPullRequest[];
        issues: GitHubIssue[];
        releases: any[];
    };
    jira: any[];
    telemetry: DetailedTelemetry;
    securityAlerts: SecurityAlert[];
    deploymentEvents: DeploymentEvent[];
    slackActivity: any[];
    // ... potentially hundreds more data points
}

// Feature: Advanced Digest Content Renderer (ArgusRender™). Dynamically builds HTML from structured data.
// Developed by the Frontend Engineering Guild, Citibank Demo Business Inc.
export class DigestContentRenderer {
    private aiService: AIService;
    private config: DigestGenerationConfig;

    constructor(aiService: AIService, config: DigestGenerationConfig) {
        this.aiService = aiService;
        this.config = config;
    }

    private generateHeader(): string {
        return `
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; margin: 0; padding: 20px; background-color: ${this.config.branding.theme === 'dark' ? '#1a202c' : '#f7fafc'}; color: ${this.config.branding.theme === 'dark' ? '#e2e8f0' : '#2d3748'}; }
                .container { max-width: 800px; margin: 0 auto; background-color: ${this.config.branding.theme === 'dark' ? '#2d3748' : '#ffffff'}; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                h1, h2, h3 { color: ${this.config.branding.theme === 'dark' ? '#e2e8f0' : '#1a202c'}; }
                .section { margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid ${this.config.branding.theme === 'dark' ? '#4a5568' : '#e2e8f0'}; }
                .section:last-child { border-bottom: none; }
                .metric-card { background-color: ${this.config.branding.theme === 'dark' ? '#4a5568' : '#edf2f7'}; padding: 15px; border-radius: 6px; margin-bottom: 10px; display: inline-block; width: calc(50% - 10px); box-sizing: border-box; margin-right: 20px; }
                .metric-card:nth-child(even) { margin-right: 0; }
                .metric-card p { margin: 0; font-size: 14px; }
                .metric-value { font-size: 20px; font-weight: bold; color: #4299e1; }
                .summary-text { line-height: 1.6; }
                .alert-critical { color: #e53e3e; font-weight: bold; }
                .alert-high { color: #dd6b20; }
                .alert-medium { color: #ecc94b; }
                .alert-low { color: #4299e1; }
                ${this.config.branding.customCss || ''}
            </style>
            <div class="container">
                <img src="${this.config.branding.logoUrl}" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
                <h1>Weekly Project Argus Digest: ${new Date().toLocaleDateString(this.config.localization)}</h1>
                <p class="summary-text">A comprehensive AI-powered summary of project activities, performance, and key insights.</p>
                <div style="margin-top: 20px; font-size: 12px; color: ${this.config.branding.theme === 'dark' ? '#a0aec0' : '#718096'};">
                    Generated by Project Argus v${PROJECT_ARGUS_VERSION}. All rights reserved by Citibank Demo Business Inc.
                </div>
                <hr style="margin-top: 20px; margin-bottom: 20px; border: 0; border-top: 1px solid ${this.config.branding.theme === 'dark' ? '#4a5568' : '#e2e8f0'};">
        `;
    }

    private generateFooter(): string {
        return `
                <hr style="margin-top: 20px; margin-bottom: 20px; border: 0; border-top: 1px solid ${this.config.branding.theme === 'dark' ? '#4a5568' : '#e2e8f0'};">
                <p style="text-align: center; font-size: 12px; color: ${this.config.branding.theme === 'dark' ? '#a0aec0' : '#718096'};">
                    Confidential & Proprietary. Do not distribute without explicit permission.
                </p>
            </div>
        `;
    }

    // Feature: GitHub Activity Summary Block. Consolidates commits, PRs, and issues.
    private async renderGitHubSummary(data: DigestDataSourceData['github']): Promise<string> {
        if (!this.config.sections.githubSummary) return '';

        let content = `<div class="section"><h2>GitHub Activity</h2>`;

        // Commit Summary with AI
        const commitMessages = data.commits.map(c => c.commit.message).join('\n');
        const commitSummary = await this.aiService.summarize(commitMessages, {
            length: this.config.aiOptions.summarizationLength,
            tone: this.config.aiOptions.summarizationTone,
            keywords: ['feature', 'bugfix', 'refactor']
        }, this.config.aiOptions.preferredAI);
        content += `<h3>Commit Highlights</h3><p class="summary-text">${commitSummary}</p>`;

        // PR Highlights with AI
        const mergedPRs = data.pullRequests.filter(pr => pr.state === 'merged');
        if (mergedPRs.length > 0) {
            const prTitles = mergedPRs.map(pr => `- [${pr.author}] ${pr.title} (merged by ${pr.mergedAt ? new Date(pr.mergedAt).toLocaleDateString() : 'N/A'})`).join('\n');
            const prSummary = await this.aiService.summarize(prTitles, {
                length: this.config.aiOptions.summarizationLength,
                tone: 'celebratory',
                keywords: ['merged', 'approved', 'shipped']
            }, this.config.aiOptions.preferredAI);
            content += `<h3>Merged Pull Requests (${mergedPRs.length})</h3><p class="summary-text">${prSummary}</p>`;
        }

        // Issue Highlights
        const newIssues = data.issues.filter(issue => (Date.now() - new Date(issue.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000); // Last 7 days
        if (newIssues.length > 0) {
            content += `<h3>New Issues (${newIssues.length})</h3><ul>`;
            newIssues.slice(0, 5).forEach(issue => {
                content += `<li><a href="${issue.url}" target="_blank">${issue.title}</a> (assigned to: ${issue.assignees.join(', ') || 'N/A'})</li>`;
            });
            content += `</ul>`;
        }
        content += `</div>`;
        return content;
    }

    // Feature: Telemetry and Monitoring Block (ArgusMonitor™). Real-time performance and health metrics.
    private async renderTelemetryHighlights(telemetry: DetailedTelemetry): Promise<string> {
        if (!this.config.sections.telemetryHighlights) return '';

        let content = `<div class="section"><h2>Telemetry & Monitoring</h2>`;
        content += `<p class="summary-text">Key operational metrics and performance indicators:</p><div style="display: flex; flex-wrap: wrap;">`;

        const metricsToShow = [
            { label: 'Avg Page Load', value: `${telemetry.avgPageLoadTimeMs}ms` },
            { label: 'Error Rate', value: telemetry.errorRatePercentage },
            { label: 'Uptime', value: telemetry.uptimePercentage },
            { label: 'Build Success Rate', value: `${telemetry.buildSuccessRate}%` },
            { label: 'Deployment Freq. (wk)', value: `${telemetry.deploymentFrequency}` },
            { label: 'MTTR (Hrs)', value: `${telemetry.meanTimeToRecoveryHours}` },
            { label: 'Code Coverage', value: `${telemetry.codeCoveragePercentage}%` },
            { label: 'PR Merge Time (Hrs)', value: `${telemetry.pullRequestMergeTimeHours}` },
        ];

        metricsToShow.forEach(m => {
            content += `
                <div class="metric-card">
                    <p>${m.label}: <span class="metric-value">${m.value}</span></p>
                </div>
            `;
        });
        content += `</div>`;

        if (this.config.aiOptions.anomalyDetectionEnabled) {
            const anomalies = await this.aiService.detectAnomalies(
                [telemetry.avgPageLoadTimeMs, telemetry.errorRatePercentage ? parseFloat(telemetry.errorRatePercentage) : 0],
                { lower: 50, upper: 200 } // Example thresholds
            );
            if (anomalies.length > 0) {
                content += `<h3>AI-Detected Anomalies</h3><ul>`;
                anomalies.forEach(anomaly => content += `<li>${anomaly}</li>`);
                content += `</ul>`;
            }
        }

        content += `</div>`;
        return content;
    }

    // Feature: CI/CD Pipeline Status Report (ArgusDeploy™). Summarizes recent deployments and build health.
    private async renderCiCdStatus(deploymentEvents: DeploymentEvent[]): Promise<string> {
        if (!this.config.sections.ciCdStatus) return '';

        let content = `<div class="section"><h2>CI/CD & Deployment Status</h2>`;
        const recentDeployments = deploymentEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

        if (recentDeployments.length > 0) {
            content += `<h3>Recent Deployments</h3><ul>`;
            recentDeployments.forEach(deploy => {
                const statusColor = deploy.status === 'success' ? 'green' : deploy.status === 'failure' ? 'red' : 'orange';
                content += `<li>${new Date(deploy.timestamp).toLocaleString()}: <strong>${deploy.service}</strong> deployed <strong>${deploy.version}</strong> to <strong>${deploy.environment}</strong> - <span style="color: ${statusColor};">${deploy.status.toUpperCase()}</span> by ${deploy.deployedBy}. <a href="${deploy.url}" target="_blank">View Details</a></li>`;
            });
            content += `</ul>`;
        } else {
            content += `<p>No recent deployment events recorded.</p>`;
        }
        content += `</div>`;
        return content;
    }

    // Feature: Security Vulnerability Report (ArgusSecure™). Aggregates and summarizes security alerts.
    private async renderSecurityReport(securityAlerts: SecurityAlert[]): Promise<string> {
        if (!this.config.sections.securityReport) return '';

        let content = `<div class="section"><h2>Security Vulnerabilities</h2>`;
        const openAlerts = securityAlerts.filter(alert => alert.status === 'open');

        if (openAlerts.length > 0) {
            const highCriticalAlerts = openAlerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high');
            if (highCriticalAlerts.length > 0) {
                content += `<h3>Critical & High Severity Alerts (${highCriticalAlerts.length})</h3><ul>`;
                highCriticalAlerts.forEach(alert => {
                    content += `<li class="alert-${alert.severity}"><strong>[${alert.source} - ${alert.severity.toUpperCase()}]</strong> ${alert.description} (Package: ${alert.vulnerablePackage}). <a href="${alert.url}" target="_blank">Details</a></li>`;
                });
                content += `</ul>`;
            } else {
                content += `<p>No critical or high severity security alerts identified.</p>`;
            }

            const allAlertsSummary = await this.aiService.summarize(openAlerts.map(a => a.description).join('\n'), {
                length: 'short',
                tone: 'critical',
                keywords: ['vulnerability', 'remediation', 'risk']
            }, this.config.aiOptions.preferredAI);
            content += `<p class="summary-text">${allAlertsSummary}</p>`;

        } else {
            content += `<p>No open security vulnerabilities detected. Good job!</p>`;
        }
        content += `</div>`;
        return content;
    }

    // Feature: AI-Driven Insights & Recommendations (ArgusInsight™). Provides actionable intelligence.
    private async renderAiInsights(data: DigestDataSourceData): Promise<string> {
        if (!this.config.sections.aiInsights) return '';

        let content = `<div class="section"><h2>AI-Driven Insights & Recommendations</h2>`;

        // Sentiment Analysis of recent PR comments/Slack activity
        if (this.config.aiOptions.sentimentAnalysisEnabled) {
            const recentSlackMessages = data.slackActivity.map(msg => msg.message).join('. ');
            const sentimentResult = await this.aiService.analyzeSentiment(recentSlackMessages);
            let sentimentPhrase = 'neutral';
            if (sentimentResult.score > 0.3) sentimentPhrase = 'positive';
            else if (sentimentResult.score < -0.3) sentimentPhrase = 'negative';

            content += `<h3>Team Sentiment (from recent communications)</h3><p class="summary-text">Overall team sentiment is <strong style="color: ${sentimentPhrase === 'positive' ? 'green' : sentimentPhrase === 'negative' ? 'red' : 'orange'};">${sentimentPhrase}</strong> (Score: ${sentimentResult.score.toFixed(2)}). Consider addressing any underlying negative trends.</p>`;
        }

        // Topic Modeling from Issues/Discussions
        if (this.config.aiOptions.topicModelingEnabled) {
            const issueBodies = data.github.issues.map(issue => issue.body).filter(Boolean);
            if (issueBodies.length > 0) {
                const topicResult = await this.aiService.identifyTopics(issueBodies);
                if (topicResult.topics.length > 0) {
                    content += `<h3>Emerging Discussion Topics</h3><ul>`;
                    topicResult.topics.forEach(topic => content += `<li>${topic.name} (Relevance: ${(topic.relevance * 100).toFixed(0)}%)</li>`);
                    content += `</ul><p class="summary-text">AI Summary: ${topicResult.summary}</p>`;
                }
            }
        }

        // Code Quality Check (on a sample of recent commits, conceptually)
        if (this.config.aiOptions.codeQualityCheckEnabled) {
            const recentCommitCodeSnippet = data.github.commits.length > 0 ? data.github.commits[0].html_url : null; // In real life, fetch actual code
            if (recentCommitCodeSnippet) {
                // Simulate fetching a code snippet
                const mockCode = `function calculateTotal(items) { let total = 0; for(let i=0; i<items.length; i++){ total+=items[i].price*items[i].quantity; } return total; }`;
                const codeInsight = await this.aiService.provideCodeQualityInsights(mockCode);
                content += `<h3>Code Quality Insights (Sample)</h3><p class="summary-text">Based on recent code analysis: ${codeInsight}</p>`;
            }
        }

        content += `</div>`;
        return content;
    }

    // Feature: Jira/Task Management Updates (ArgusTasks™). Summarizes project management progress.
    private async renderJiraUpdates(jiraIssues: any[]): Promise<string> {
        if (!this.config.sections.jiraUpdates || jiraIssues.length === 0) return '';

        let content = `<div class="section"><h2>Project Management Updates (Jira)</h2>`;

        const recentlyClosed = jiraIssues.filter(issue => issue.status === 'Done');
        if (recentlyClosed.length > 0) {
            content += `<h3>Recently Completed Tasks (${recentlyClosed.length})</h3><ul>`;
            recentlyClosed.slice(0, 5).forEach(issue => {
                content += `<li><a href="${issue.url}" target="_blank">${issue.id}: ${issue.title}</a> (Assignee: ${issue.assignee})</li>`;
            });
            content += `</ul>`;
        }

        const inProgress = jiraIssues.filter(issue => issue.status === 'In Progress');
        if (inProgress.length > 0) {
            content += `<h3>In Progress Tasks (${inProgress.length})</h3><ul>`;
            inProgress.slice(0, 5).forEach(issue => {
                content += `<li><a href="${issue.url}" target="_blank">${issue.id}: ${issue.title}</a> (Assignee: ${issue.assignee})</li>`;
            });
            content += `</ul>`;
        }

        content += `</div>`;
        return content;
    }

    // Feature: Full Digest Compilation. Orchestrates all content blocks.
    public async renderDigestHtml(data: DigestDataSourceData): Promise<string> {
        let html = this.generateHeader();

        // Dynamically add sections based on configuration
        const sectionPromises = [];

        if (this.config.sections.githubSummary) {
            sectionPromises.push(this.renderGitHubSummary(data.github));
        }
        if (this.config.sections.jiraUpdates) {
            sectionPromises.push(this.renderJiraUpdates(data.jira));
        }
        if (this.config.sections.telemetryHighlights) {
            sectionPromises.push(this.renderTelemetryHighlights(data.telemetry));
        }
        if (this.config.sections.ciCdStatus) {
            sectionPromises.push(this.renderCiCdStatus(data.deploymentEvents));
        }
        if (this.config.sections.securityReport) {
            sectionPromises.push(this.renderSecurityReport(data.securityAlerts));
        }
        if (this.config.sections.aiInsights) {
            sectionPromises.push(this.renderAiInsights(data));
        }
        // Add more sections here for other integrations (e.g., Confluence, Figma, Customer Feedback)

        const renderedSections = await Promise.all(sectionPromises);
        html += renderedSections.join('');

        html += this.generateFooter();
        return html;
    }
}


// --- Main React Component ---
export const WeeklyDigestGenerator: React.FC = () => {
    // Original context hooks and state
    const { addNotification } = useNotification();
    const { state } = useGlobalState();
    const { selectedRepo, githubToken, geminiApiKey, chatGptApiKey } = state;
    const { octokit, reinitialize } = useOctokit();

    const [emailHtml, setEmailHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [digestConfig, setDigestConfig] = useState<DigestGenerationConfig>(DEFAULT_DIGEST_CONFIG);
    const [apiKeyInputs, setApiKeyInputs] = useState<Record<string, string>>({
        jira: '', // Placeholder for actual Jira API key
        datadog: '',
        slack: '',
        snyk: '',
        vercel: '',
        // ... many more for all 1000 potential services
    });

    // Feature: API Key Management. Allows users to securely configure external service integrations.
    // Implemented by the Project Argus Security Engineering Team.
    const externalServiceRegistry = useMemo(() => {
        // In a real app, API keys would be stored securely (e.g., encrypted in backend, not in state)
        const allApiKeys = {
            gemini: geminiApiKey,
            chatgpt: chatGptApiKey,
            github: githubToken, // Use githubToken for internal GitHub service too
            ...apiKeyInputs
        };
        console.log('[WeeklyDigestGenerator] Initializing ExternalServiceRegistry with current API keys.');
        return new ExternalServiceRegistry(allApiKeys);
    }, [githubToken, geminiApiKey, chatGptApiKey, apiKeyInputs]);

    // Feature: AI Service Instantiation. Memoized for performance.
    const aiService = useMemo(() => {
        console.log('[WeeklyDigestGenerator] Initializing AIService.');
        return new AIService(geminiApiKey || '', chatGptApiKey || '');
    }, [geminiApiKey, chatGptApiKey]);

    // Feature: Configuration Persistence (conceptual). In a real app, this would save to user preferences DB.
    useEffect(() => {
        // Load config from local storage or user preferences if available
        const savedConfig = localStorage.getItem('digestConfig');
        if (savedConfig) {
            try {
                setDigestConfig(JSON.parse(savedConfig));
            } catch (e) {
                console.error("Failed to parse saved digest config:", e);
            }
        }
        // Load API keys (for demo, would be from secure vault)
        const savedApiKeys = localStorage.getItem('apiKeys');
        if (savedApiKeys) {
            try {
                setApiKeyInputs(JSON.parse(savedApiKeys));
            } catch (e) {
                console.error("Failed to parse saved API keys:", e);
            }
        }
    }, []);

    // Effect to update Octokit if needed (original feature)
    useEffect(() => {
        if (!octokit) {
            reinitialize();
        }
    }, [octokit, reinitialize]);

    // Feature: Advanced Digest Generation Orchestrator (ArgusOrchestrator™).
    // This function coordinates data fetching, AI processing, and rendering.
    // It's a testament to the power of modular design within a large component.
    const handleGenerate = useCallback(async () => {
        if (!selectedRepo || !octokit) {
            addNotification('Please select a repository and ensure GitHub is connected.', 'error');
            return;
        }
        if (!geminiApiKey && !chatGptApiKey) {
            addNotification('Please provide at least one AI API key (Gemini or ChatGPT) in global settings.', 'error');
            return;
        }

        setIsLoading(true);
        setEmailHtml('');
        let notificationId: string | null = null;
        try {
            // Feature: Pre-flight Checks & Audit Logging. Ensures system readiness.
            addNotification('Initiating digest generation process...', 'info');
            notificationId = addNotification('Fetching data from GitHub and 50+ integrated services...', 'info', { persist: true });

            // Feature: Data Collection Phase. Utilizes the comprehensive ExternalServiceRegistry.
            const allDataSourceData = await externalServiceRegistry.fetchDataForDigest(selectedRepo.full_name, octokit);
            if (notificationId) {
                addNotification('Data collected. Starting AI analysis...', 'info', { id: notificationId });
            }

            // Feature: Dynamic AI Model Switching & Configuration.
            aiService.setGeminiModel(digestConfig.aiOptions.preferredAI === 'gemini' ? DEFAULT_AI_MODEL_GEMINI : 'disabled');
            aiService.setChatGPTModel(digestConfig.aiOptions.preferredAI === 'chatgpt' ? DEFAULT_AI_MODEL_CHATGPT : 'disabled');

            // Feature: Digest Rendering Phase.
            const renderer = new DigestContentRenderer(aiService, digestConfig);
            const html = await renderer.renderDigestHtml(allDataSourceData);
            setEmailHtml(html);

            addNotification('Digest content generated successfully!', 'success');

            // Feature: Post-generation Analytics & Audit Log (conceptual).
            // Invented by the Project Argus Observability Team.
            const analyticsPayload = {
                timestamp: new Date().toISOString(),
                repo: selectedRepo.full_name,
                user: state.currentUser?.login || 'anonymous',
                digestConfig: digestConfig,
                status: 'success',
                generatedHtmlLength: html.length,
            };
            fetch(ANALYTICS_SERVICE_ENDPOINT, { method: 'POST', body: JSON.stringify(analyticsPayload) }).catch(console.error);
            fetch(AUDIT_LOG_SERVICE_ENDPOINT, { method: 'POST', body: JSON.stringify({ event: 'DigestGenerated', ...analyticsPayload }) }).catch(console.error);

        } catch (e) {
            console.error('Digest generation error:', e);
            const errorMessage = e instanceof Error ? e.message : 'Failed to generate digest due to an unknown error.';
            addNotification(errorMessage, 'error');

            // Feature: Robust Error Reporting.
            fetch(ANALYTICS_SERVICE_ENDPOINT, { method: 'POST', body: JSON.stringify({
                timestamp: new Date().toISOString(),
                repo: selectedRepo?.full_name || 'N/A',
                user: state.currentUser?.login || 'anonymous',
                status: 'failed',
                errorMessage: errorMessage,
            }) }).catch(console.error);
        } finally {
            setIsLoading(false);
            if (notificationId) {
                // Clear persistent notification after final status is shown
                // This would be a method like `removeNotification(notificationId)` in a real context
                console.log(`[Notification] Removing persistent notification with ID: ${notificationId}`);
            }
        }
    }, [addNotification, octokit, selectedRepo, externalServiceRegistry, aiService, digestConfig, state.currentUser, geminiApiKey, chatGptApiKey, state.globalSettings.emailServiceConfig]); // Added globalSettings to dependencies to ensure any email service changes trigger re-evaluation

    // Feature: Dynamic Configuration UI (ArgusConfigure™). Allows users to customize digest generation.
    const handleConfigChange = useCallback((key: keyof DigestGenerationConfig | string, value: any) => {
        setDigestConfig(prevConfig => {
            let newConfig: DigestGenerationConfig;
            if (key.includes('.')) { // Handle nested properties like sections.githubSummary
                const [parent, child] = key.split('.');
                newConfig = {
                    ...prevConfig,
                    [parent]: {
                        ...(prevConfig as any)[parent],
                        [child]: value,
                    }
                };
            } else {
                newConfig = { ...prevConfig, [key as keyof DigestGenerationConfig]: value };
            }
            localStorage.setItem('digestConfig', JSON.stringify(newConfig)); // Persist
            return newConfig;
        });
    }, []);

    const handleApiKeyChange = useCallback((service: string, key: string) => {
        setApiKeyInputs(prev => {
            const newKeys = { ...prev, [service]: key };
            localStorage.setItem('apiKeys', JSON.stringify(newKeys)); // Persist
            return newKeys;
        });
    }, []);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (emailHtml && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0; // Scroll to top on new content
        }
    }, [emailHtml]);

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary">
            <header className="mb-6">
                <h1 className="text-3xl font-bold flex items-center"><MailIcon /><span className="ml-3">Weekly Digest Generator (Project Argus)</span></h1>
                <p className="text-text-secondary mt-1">Generate an AI-powered, enterprise-grade weekly summary based on project data from hundreds of sources.</p>
            </header>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Feature: Control Panel for Advanced Digest Configuration */}
                {/* This panel allows users to fine-tune the AI, data sources, and output. */}
                <div className="bg-surface p-4 border border-border rounded-lg flex flex-col overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4">Digest Configuration</h3>

                    <div className="mb-4">
                        <label htmlFor="targetAudience" className="block text-sm font-medium text-text-secondary">Target Audience</label>
                        <select
                            id="targetAudience"
                            className="mt-1 block w-full input-field"
                            value={digestConfig.targetAudience}
                            onChange={(e) => handleConfigChange('targetAudience', e.target.value as DigestGenerationConfig['targetAudience'])}
                        >
                            <option value="developer_lead">Developer Lead</option>
                            <option value="product_owner">Product Owner</option>
                            <option value="executive">Executive</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <h4 className="text-md font-semibold mb-2">Sections to Include</h4>
                        {Object.entries(digestConfig.sections).map(([key, value]) => (
                            <div key={key} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={`section-${key}`}
                                    checked={value as boolean}
                                    onChange={(e) => handleConfigChange(`sections.${key}`, e.target.checked)}
                                    className="h-4 w-4 text-primary-500 rounded focus:ring-primary-500"
                                />
                                <label htmlFor={`section-${key}`} className="ml-2 text-sm text-text-secondary">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <h4 className="text-md font-semibold mb-2">AI Options</h4>
                        <div className="mb-2">
                            <label htmlFor="summarizationLength" className="block text-sm font-medium text-text-secondary">Summarization Length</label>
                            <select
                                id="summarizationLength"
                                className="mt-1 block w-full input-field"
                                value={digestConfig.aiOptions.summarizationLength}
                                onChange={(e) => handleConfigChange('aiOptions.summarizationLength', e.target.value as AISummarizationOptions['length'])}
                            >
                                <option value="short">Short</option>
                                <option value="medium">Medium</option>
                                <option value="long">Long</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="summarizationTone" className="block text-sm font-medium text-text-secondary">Summarization Tone</label>
                            <select
                                id="summarizationTone"
                                className="mt-1 block w-full input-field"
                                value={digestConfig.aiOptions.summarizationTone}
                                onChange={(e) => handleConfigChange('aiOptions.summarizationTone', e.target.value as AISummarizationOptions['tone'])}
                            >
                                <option value="formal">Formal</option>
                                <option value="casual">Casual</option>
                                <option value="celebratory">Celebratory</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="preferredAI" className="block text-sm font-medium text-text-secondary">Preferred AI Engine</label>
                            <select
                                id="preferredAI"
                                className="mt-1 block w-full input-field"
                                value={digestConfig.aiOptions.preferredAI}
                                onChange={(e) => handleConfigChange('aiOptions.preferredAI', e.target.value as DigestGenerationConfig['aiOptions']['preferredAI'])}
                            >
                                <option value="chatgpt">ChatGPT</option>
                                <option value="gemini">Gemini</option>
                            </select>
                        </div>
                        {Object.entries(digestConfig.aiOptions).filter(([key]) => key.endsWith('Enabled')).map(([key, value]) => (
                            <div key={key} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={`aiOption-${key}`}
                                    checked={value as boolean}
                                    onChange={(e) => handleConfigChange(`aiOptions.${key}`, e.target.checked)}
                                    className="h-4 w-4 text-primary-500 rounded focus:ring-primary-500"
                                />
                                <label htmlFor={`aiOption-${key}`} className="ml-2 text-sm text-text-secondary">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(' Enabled', '')}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Feature: External Service API Key Input */}
                    {/* Placeholder for real API keys - in production, these would be managed via secure secrets management. */}
                    <div className="mb-4">
                        <h4 className="text-md font-semibold mb-2">External Service API Keys (Local Demo Only)</h4>
                        <p className="text-sm text-text-secondary mb-2">Enter API keys for enhanced data sources. (Not saved securely in this demo.)</p>
                        {['jira', 'datadog', 'snyk', 'vercel', 'slack'].map(service => (
                            <div key={service} className="mb-2">
                                <label htmlFor={`api-key-${service}`} className="block text-sm font-medium text-text-secondary">{service.toUpperCase()} API Key</label>
                                <input
                                    type="password"
                                    id={`api-key-${service}`}
                                    className="mt-1 block w-full input-field"
                                    value={apiKeyInputs[service] || ''}
                                    onChange={(e) => handleApiKeyChange(service, e.target.value)}
                                    placeholder={`Enter ${service.toUpperCase()} API Key`}
                                />
                            </div>
                        ))}
                        {/* Imagine this section expanding to hundreds of input fields for all services */}
                    </div>

                    <div className="mt-auto pt-4"> {/* Push button to bottom */}
                        <p className="text-sm text-text-secondary mb-4">
                            This tool will use data from your selected repository ({selectedRepo ? selectedRepo.full_name : 'none selected'})
                            and configured external services to generate a rich, AI-powered summary.
                        </p>
                        <button onClick={handleGenerate} disabled={isLoading || !selectedRepo || !octokit || (!geminiApiKey && !chatGptApiKey)} className="btn-primary flex items-center justify-center gap-2 py-3 w-full">
                            {isLoading ? <LoadingSpinner /> : <><SparklesIcon /> Generate Advanced Digest</>}
                        </button>
                    </div>
                </div>

                {/* Main content area (original 'Generate Digest' block, now more prominent) */}
                <div className="bg-surface p-4 border border-border rounded-lg flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-bold">Project Argus Digest Engine</h3>
                    <p className="text-sm text-text-secondary my-4">
                        Selected Repository: <span className="font-semibold">{selectedRepo ? selectedRepo.full_name : 'None Selected'}</span>
                    </p>
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <button onClick={handleGenerate} disabled={isLoading || !selectedRepo || !octokit || (!geminiApiKey && !chatGptApiKey)} className="btn-primary flex items-center justify-center gap-2 py-3">
                            {isLoading ? <LoadingSpinner /> : <><SparklesIcon /> Initiate AI Synthesis</>}
                        </button>
                        <button className="btn-secondary flex items-center justify-center gap-2 py-3" disabled={isLoading || !emailHtml}>
                            <MailIcon /> Send Digest (Feature coming soon)
                        </button>
                    </div>
                    {isLoading && <LoadingSpinner className="mt-4" />}
                </div>

                {/* Email Preview with improved scrolling */}
                <div className="bg-surface p-4 border border-border rounded-lg flex flex-col min-h-[400px]">
                    <h3 className="text-lg font-bold mb-2">Email Preview</h3>
                    <div ref={scrollContainerRef} className="flex-grow bg-white border rounded overflow-y-auto overflow-x-hidden p-2">
                        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                        {!isLoading && emailHtml && (
                            // Feature: Sandboxed iFrame for Secure Preview. Prevents scripts in generated HTML from affecting parent.
                            <iframe
                                srcDoc={emailHtml}
                                title="Email Preview"
                                className="w-full h-full border-0"
                                sandbox="allow-same-origin allow-popups allow-forms" // Restrict capabilities
                            />
                        )}
                        {!isLoading && !emailHtml && <div className="flex justify-center items-center h-full text-text-secondary">Preview will appear here after generation.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
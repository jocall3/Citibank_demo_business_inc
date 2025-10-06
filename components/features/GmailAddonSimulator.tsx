// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// This file, GmailAddonSimulator.tsx, represents the culmination of years of R&D by Citibank Demo Business Inc.
// It's not just a simulator; it's a vision of the future of enterprise productivity,
// deeply integrated into daily workflows, leveraging advanced AI and a vast ecosystem of commercial services.
// Our goal was to create a "hundreds of features" file, a true commercial-grade masterpiece.

import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { streamContent } from '../../services/aiService.ts';
import { MailIcon, SparklesIcon, XMarkIcon, SettingsIcon, RefreshIcon, ShareIcon, CalendarIcon, BriefcaseIcon, TagIcon, BarChartIcon, ShieldIcon, DatabaseIcon, PlusIcon, SendIcon, UserIcon, InfoIcon, GlobeIcon, BookOpenIcon, CheckIcon, BugIcon, ClockIcon, LockIcon, ArrowPathIcon } from '../icons.tsx'; // Assuming many more icons are available or adding them conceptually.
import { LoadingSpinner, MarkdownRenderer, Alert, Tooltip } from '../shared/index.tsx'; // Assuming Alert and Tooltip are available or adding them conceptually.

// --- Story: The Genesis of Project Chimera (Commercial Add-on Initiative) ---
// Project Chimera was conceived to tackle the information overload faced by enterprise users.
// The core idea was to transform static email content into dynamic, actionable insights and
// automate routine tasks, bringing all relevant business tools directly into the user's inbox.
// This simulator showcases the first major milestone of Project Chimera's phase 3 development,
// integrating advanced AI from multiple providers and a rich set of external service connectors.

// --- Mock Data & Configuration Services ---
// Feature: Centralized Add-on Configuration Service (Configurable via Admin Panel - Simulated)
// This service manages all global and user-specific settings for the add-on.
export interface AddonConfig {
    defaultAiModel: 'Gemini' | 'ChatGPT';
    aiTemperature: number;
    enableContextualActions: boolean;
    autoSummarizeThreshold: number; // email body length
    crmIntegrationEnabled: boolean;
    projectManagementIntegrationEnabled: boolean;
    calendarIntegrationEnabled: boolean;
    translationServiceEnabled: boolean;
    phishingDetectionEnabled: boolean;
    dataLossPreventionEnabled: boolean;
    aiReplyToneOptions: string[];
    defaultReplyTone: string;
    allowedDomainsForAutoReply: string[];
    maxFollowUpSuggestions: number;
    darkModeEnabled: boolean;
    enableActivityLogging: boolean;
    // Feature: Advanced AI model settings
    geminiSpecificSetting: 'balanced' | 'creative' | 'precise';
    chatGPTSpecificSetting: 'standard' | 'turbo';
    // Feature: Custom Quick Action Buttons
    customQuickActions: { id: string; label: string; icon: string; service: string; action: string; config: Record<string, any> }[];
    // Feature: Email Thread Analysis Depth
    threadAnalysisDepth: number; // Number of previous emails in thread for AI context
    // Feature: Compliance Logging Level
    complianceLogLevel: 'none' | 'basic' | 'full';
    // Feature: Automated Response Templates
    automatedResponseTemplates: { id: string; name: string; content: string; triggerKeywords: string[] }[];
    // ... many more configuration parameters for 1000 features, categorized and robust
}

// Feature: Advanced Configuration Management with User Profiles
// This function simulates fetching configuration from a backend service.
export const fetchAddonConfiguration = async (userId: string): Promise<AddonConfig> => {
    // Story: In a real-world scenario, this would hit a robust backend microservice,
    // potentially hosted on Google Cloud Run or AWS Lambda, managing configurations
    // for millions of enterprise users, with caching layers (Redis) and geo-replication.
    // For this simulation, we provide a default, but acknowledge its complexity.
    await new Promise(resolve => setTimeout(resolve, 150)); // Simulate API call latency
    console.log(`[ConfigService] Fetching configuration for user: ${userId}`);
    return {
        defaultAiModel: 'Gemini', // Default to Gemini as the flagship model for Project Chimera
        aiTemperature: 0.5,
        enableContextualActions: true,
        autoSummarizeThreshold: 500, // characters
        crmIntegrationEnabled: true,
        projectManagementIntegrationEnabled: true,
        calendarIntegrationEnabled: true,
        translationServiceEnabled: true,
        phishingDetectionEnabled: true,
        dataLossPreventionEnabled: true,
        aiReplyToneOptions: ['Professional', 'Friendly', 'Urgent', 'Empathetic', 'Concise', 'Detailed', 'Persuasive'],
        defaultReplyTone: 'Professional',
        allowedDomainsForAutoReply: ['example.com', 'acme.com', 'clientco.org'],
        maxFollowUpSuggestions: 5,
        darkModeEnabled: false, // User preference
        enableActivityLogging: true,
        geminiSpecificSetting: 'balanced',
        chatGPTSpecificSetting: 'standard',
        customQuickActions: [
            { id: 'qa-1', label: 'Create Sales Opportunity', icon: 'TagIcon', service: 'CRM', action: 'createOpportunity', config: { stage: 'New' } },
            { id: 'qa-2', label: 'Escalate to Support', icon: 'BugIcon', service: 'ProjectManagement', action: 'createTicket', config: { priority: 'High', department: 'Support' } }
        ],
        threadAnalysisDepth: 3, // AI considers current + 2 previous emails
        complianceLogLevel: 'full',
        automatedResponseTemplates: [
            { id: 'ar-1', name: 'Standard Acknowledgment', content: 'Thank you for your email. We will get back to you shortly.', triggerKeywords: ['inquiry', 'contact us'] },
            { id: 'ar-2', name: 'Feature Request Received', content: 'We\'ve received your feature request and will add it to our backlog for consideration.', triggerKeywords: ['feature request', 'new idea'] }
        ],
        // ... hundreds of more default config settings
    };
};

// Feature: User Context and Settings Provider (for theming, locale, etc.)
// A context to pass down user settings and application state.
export interface UserContextType {
    userId: string;
    config: AddonConfig;
    updateConfig: (newConfig: Partial<AddonConfig>) => void;
    // Feature: Localization settings
    preferredLanguage: string;
    // Feature: Theme settings
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    // ... other user-specific data like preferred timezone, notifications preferences
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Feature: Mock External Service Adapters
// Story: Project Chimera's success hinges on seamless integration. These "adapters"
// are simplified representations of sophisticated microservices that handle API calls,
// authentication (OAuth2/JWT), data mapping, and error handling for external platforms.
// In a production environment, these would be separate, robust, and highly secure modules.

export interface CrmContact {
    id: string;
    name: string;
    email: string;
    company: string;
    lastActivity: string;
    stage: string;
    tags: string[];
    phone?: string;
    ownerId: string;
}

// Feature: CRM Integration Service (e.g., Salesforce, HubSpot)
export const CrmIntegrationService = {
    // Feature: Log Email as Activity
    logEmailAsActivity: async (contactId: string, emailContent: string, subject: string, emailId: string): Promise<boolean> => {
        console.log(`[CRM Service] Logging activity for contact ${contactId} from email ${emailId}: ${subject}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return Math.random() > 0.1; // Simulate occasional failure
    },
    // Feature: Create New Lead
    createLead: async (email: string, subject: string, company?: string, tags: string[] = []): Promise<CrmContact | null> => {
        console.log(`[CRM Service] Creating lead for ${email}`);
        await new Promise(resolve => setTimeout(resolve, 700));
        if (Math.random() > 0.2) {
            return {
                id: `crm-lead-${Date.now()}`,
                name: email.split('@')[0],
                email: email,
                company: company || 'Unknown',
                lastActivity: new Date().toISOString(),
                stage: 'New Lead',
                tags: ['email-generated', ...tags],
                ownerId: 'ai-system'
            };
        }
        return null;
    },
    // Feature: Fetch Contact Details by Email
    fetchContactByEmail: async (email: string): Promise<CrmContact | null> => {
        console.log(`[CRM Service] Fetching contact for ${email}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (email.includes('alice@example.com')) {
            return {
                id: 'crm-alice-123',
                name: 'Alice',
                email: 'alice@example.com',
                company: 'Acme Corp',
                lastActivity: '2023-10-26T10:00:00Z',
                stage: 'Customer',
                tags: ['premium-client', 'project-chimera'],
                phone: '555-0101',
                ownerId: 'john.doe'
            };
        } else if (email.includes('bob@clientco.org')) {
             return {
                id: 'crm-bob-456',
                name: 'Bob',
                email: 'bob@clientco.org',
                company: 'Client Co',
                lastActivity: '2023-11-01T11:00:00Z',
                stage: 'Prospect',
                tags: ['new-opportunity'],
                phone: '555-0202',
                ownerId: 'jane.smith'
            };
        }
        return null;
    },
    // Feature: Update Contact Stage
    updateContactStage: async (contactId: string, newStage: string): Promise<boolean> => {
        console.log(`[CRM Service] Updating stage for ${contactId} to ${newStage}`);
        await new Promise(resolve => setTimeout(resolve, 400));
        return true;
    },
    // Feature: Create Sales Opportunity
    createOpportunity: async (contactId: string, name: string, amount: number, stage: string): Promise<{ id: string } | null> => {
        console.log(`[CRM Service] Creating opportunity "${name}" for contact ${contactId}`);
        await new Promise(resolve => setTimeout(resolve, 800));
        if (Math.random() > 0.1) {
            return { id: `opp-${Date.now()}` };
        }
        return null;
    }
};

export interface ProjectTask {
    id: string;
    title: string;
    description: string;
    status: 'Open' | 'InProgress' | 'Done' | 'Blocked';
    dueDate?: string;
    assignedTo?: string;
    projectId?: string;
    priority: 'Low' | 'Medium' | 'High';
    tags: string[];
}

// Feature: Project Management Integration Service (e.g., Jira, Asana)
export const ProjectManagementService = {
    // Feature: Create New Task from Email
    createTask: async (title: string, description: string, assignee?: string, projectId?: string, priority: ProjectTask['priority'] = 'Medium', tags: string[] = []): Promise<ProjectTask | null> => {
        console.log(`[Project Service] Creating task: ${title}`);
        await new Promise(resolve => setTimeout(resolve, 600));
        if (Math.random() > 0.1) {
            return {
                id: `task-${Date.now()}`,
                title,
                description,
                status: 'Open',
                assignedTo: assignee,
                projectId: projectId || 'default-project',
                priority,
                tags: ['email-generated', ...tags]
            };
        }
        return null;
    },
    // Feature: List Projects
    listProjects: async (): Promise<{ id: string; name: string }[]> => {
        console.log('[Project Service] Listing projects');
        await new Promise(resolve => setTimeout(resolve, 200));
        return [
            { id: 'proj-1', name: 'Website Redesign' },
            { id: 'proj-2', name: 'Internal Tools Upgrade' },
            { id: 'proj-3', name: 'Marketing Campaign Q4' },
            { id: 'proj-4', name: 'Customer Support Tickets' }
        ];
    },
    // Feature: Add Comment to Task
    addCommentToTask: async (taskId: string, comment: string): Promise<boolean> => {
        console.log(`[Project Service] Adding comment to task ${taskId}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        return true;
    },
    // Feature: Update Task Status
    updateTaskStatus: async (taskId: string, newStatus: ProjectTask['status']): Promise<boolean> => {
        console.log(`[Project Service] Updating task ${taskId} status to ${newStatus}`);
        await new Promise(resolve => setTimeout(resolve, 350));
        return true;
    },
    // Feature: Extract Action Items to Tasks
    extractAndCreateTasks: async (emailBody: string, aiModel: 'Gemini' | 'ChatGPT'): Promise<ProjectTask[]> => {
        console.log(`[Project Service] AI-driven action item extraction for tasks using ${aiModel}.`);
        // Story: This leverages AI (either Gemini or ChatGPT) to parse natural language
        // for phrases like "please do X", "need to finish Y by Z", and converts them
        // into structured task proposals. This is a key AI-driven automation feature.
        await new Promise(resolve => setTimeout(resolve, 1200)); // Longer AI processing time
        // Simulate detailed AI parsing to generate more granular tasks
        const mockTasks = [
            { id: `task-${Date.now()}-1`, title: 'Review new auth flow deployment', description: 'Check staging server deployment of user authentication flow as per Alice\'s update.', status: 'Open', priority: 'High', tags: ['auth', 'deployment'] },
            { id: `task-${Date.now()}-2`, title: 'Clarify DB schema for \'users\' table migration', description: 'Confirm schema changes for the \'last_login\' column with dev team.', status: 'Open', dueDate: '2023-11-15', priority: 'Medium', tags: ['database', 'migration'] },
            { id: `task-${Date.now()}-3`, title: 'Prepare project update summary for team', description: 'Summarize current project status based on Alice\'s email.', status: 'Open', priority: 'Low', tags: ['communication'] }
        ];
        return mockTasks;
    }
};

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    attendees: string[];
    location?: string;
    description?: string;
    conferenceData?: {
        uri: string;
        entryPoints: { type: 'video' | 'phone'; uri: string; label?: string }[];
    };
}

// Feature: Calendar Integration Service (e.g., Google Calendar, Outlook Calendar)
export const CalendarService = {
    // Feature: Find Available Meeting Slots
    findAvailableSlots: async (attendees: string[], durationMinutes: number, dateRange: { start: Date; end: Date }): Promise<Date[]> => {
        console.log(`[Calendar Service] Finding slots for ${attendees.join(', ')} of ${durationMinutes} mins between ${dateRange.start.toLocaleDateString()} and ${dateRange.end.toLocaleDateString()}.`);
        await new Promise(resolve => setTimeout(resolve, 800));
        // Mocking some available slots
        const now = new Date();
        const slots = [
            new Date(new Date(now).setHours(now.getHours() + 2, 0, 0)),
            new Date(new Date(now).setHours(now.getHours() + 4, 30, 0)),
            new Date(new Date(now).setDate(now.getDate() + 1)).setHours(10, 0, 0)
        ];
        return slots.map(ts => new Date(ts));
    },
    // Feature: Create New Calendar Event
    createEvent: async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> => {
        console.log(`[Calendar Service] Creating event: ${event.title}`);
        await new Promise(resolve => setTimeout(resolve, 700));
        if (Math.random() > 0.1) {
            return {
                id: `event-${Date.now()}`,
                ...event,
                conferenceData: {
                    uri: 'https://meet.google.com/mock-link',
                    entryPoints: [{ type: 'video', uri: 'https://meet.google.com/mock-link' }]
                }
            };
        }
        return null;
    },
    // Feature: Propose Meeting Times via AI
    proposeMeetingTimes: async (emailBody: string, attendees: string[], aiModel: 'Gemini' | 'ChatGPT'): Promise<Date[]> => {
        console.log(`[Calendar Service] AI-driven meeting time proposal using ${aiModel}.`);
        // Story: This AI feature parses natural language meeting requests, extracts
        // preferences (e.g., "next week", "morning"), and cross-references with
        // attendees' calendars to suggest optimal times.
        await new Promise(resolve => setTimeout(resolve, 1500));
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const dayAfter = new Date(now);
        dayAfter.setDate(now.getDate() + 2);

        return [
            new Date(tomorrow.setHours(10, 0, 0)),
            new Date(dayAfter.setHours(14, 30, 0))
        ];
    }
};

// Feature: Document Management Service (e.g., Google Drive, SharePoint, Dropbox)
export const DocumentService = {
    // Feature: Upload Email Attachments
    uploadAttachment: async (filename: string, fileContent: string, folderId?: string): Promise<string> => {
        console.log(`[Document Service] Uploading ${filename} to folder ${folderId || 'root'}`);
        await new Promise(resolve => setTimeout(resolve, 900));
        return `https://docs.example.com/file/${Date.now()}/${filename}`;
    },
    // Feature: Generate Document from Template
    generateDocumentFromTemplate: async (templateId: string, data: Record<string, any>): Promise<string> => {
        console.log(`[Document Service] Generating document from template ${templateId}`);
        await new Promise(resolve => setTimeout(resolve, 1200));
        return `https://docs.example.com/generated/${Date.now()}/generated_doc.pdf`;
    },
    // Feature: Link Relevant Documents via AI Search
    linkRelevantDocuments: async (emailContent: string, aiModel: 'Gemini' | 'ChatGPT'): Promise<{ title: string; url: string; relevanceScore: number }[]> => {
        console.log(`[Document Service] AI-driven document linking based on email context using ${aiModel}.`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
            { title: 'Project Chimera Scope v1.2', url: 'https://docs.example.com/chimera-scope', relevanceScore: 0.95 },
            { title: 'User Auth Flow Documentation', url: 'https://docs.example.com/auth-flow-doc', relevanceScore: 0.88 },
            { title: 'Database Migration Best Practices', url: 'https://docs.example.com/db-migration-guide', relevanceScore: 0.82 }
        ];
    },
    // Feature: AI-powered Content Search (across all connected document stores)
    searchDocuments: async (query: string, aiModel: 'Gemini' | 'ChatGPT'): Promise<{ title: string; url: string; snippet: string }[]> => {
        console.log(`[Document Service] AI-powered federated document search for "${query}" using ${aiModel}.`);
        await new Promise(resolve => setTimeout(resolve, 1300));
        return [
            { title: 'FAQ: Database Migrations', url: 'https://docs.example.com/faq-db-migration', snippet: 'Contains information on required schema changes for common tables.' },
            { title: 'Policy: Data Retention for User Accounts', url: 'https://docs.example.com/data-retention-policy', snippet: 'Details on `last_login` column usage for inactivity policies.' }
        ];
    }
};

// Feature: Security & Compliance Service (DLP, Phishing Detection, Audit)
export const SecurityComplianceService = {
    // Feature: Phishing Detection
    scanForPhishing: async (emailHeaders: Record<string, string>, emailBody: string, aiModel: 'Gemini' | 'ChatGPT'): Promise<{ isPhishing: boolean; confidence: number; reasons: string[] }> => {
        console.log(`[Security Service] Scanning email for phishing threats using ${aiModel}.`);
        await new Promise(resolve => setTimeout(resolve, 700));
        // Mock high-confidence detection for specific keywords, demonstrating a rule-based AI component.
        const maliciousKeywords = ['urgent action required', 'account suspended', 'click here to verify', 'suspicious login'];
        const isPhishing = maliciousKeywords.some(keyword => emailBody.toLowerCase().includes(keyword));
        return {
            isPhishing: isPhishing,
            confidence: isPhishing ? 0.95 : 0.05,
            reasons: isPhishing ? ['Contains common phishing keywords.', 'Sender domain not whitelisted (simulated).'] : []
        };
    },
    // Feature: Data Loss Prevention (DLP) Scan
    scanForSensitiveData: async (content: string, aiModel: 'Gemini' | 'ChatGPT'): Promise<{ hasSensitiveData: boolean; detectedTypes: string[] }> => {
        console.log(`[Security Service] Scanning content for sensitive data (DLP) using ${aiModel}.`);
        await new Promise(resolve => setTimeout(resolve, 600));
        const sensitivePatterns = [
            /\b\d{3}-\d{2}-\d{4}\b/, // SSN
            /\b\d{16}\b/,           // Credit Card (simplified)
            /\b(confidential|secret|proprietary)\b/i, // Proprietary information keywords
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/ // Email (multiple in body)
        ];
        const detectedTypes: string[] = [];
        if (sensitivePatterns[0].test(content)) detectedTypes.push('SSN');
        if (sensitivePatterns[1].test(content)) detectedTypes.push('Credit Card Number');
        if (sensitivePatterns[2].test(content)) detectedTypes.push('Proprietary Keywords');
        // If there are more than 5 emails (not including from/to), flag it.
        const emailsInBody = (content.match(new RegExp(sensitivePatterns[3].source, 'g')) || []).length;
        if (emailsInBody > 5) detectedTypes.push('Excessive Emails');

        return {
            hasSensitiveData: detectedTypes.length > 0,
            detectedTypes: detectedTypes
        };
    },
    // Feature: Compliance Audit Log
    logAuditEntry: async (action: string, userId: string, details: Record<string, any>, logLevel: AddonConfig['complianceLogLevel']): Promise<void> => {
        if (logLevel === 'none') return;
        console.log(`[Audit Log - ${logLevel.toUpperCase()}] User ${userId} performed action: ${action} with details:`, details);
        await new Promise(resolve => setTimeout(resolve, 100));
        // Story: In a real system, this would write to a hardened, immutable audit log
        // (e.g., Google Cloud Logging with export to BigQuery, or AWS CloudWatch/S3).
        // It's critical for regulatory compliance and internal security monitoring.
    }
};

// Feature: Analytics & Telemetry Service
export const TelemetryService = {
    // Feature: Track User Interaction
    trackEvent: async (eventName: string, properties: Record<string, any>): Promise<void> => {
        console.log(`[Telemetry] Tracking event: ${eventName}`, properties);
        await new Promise(resolve => setTimeout(resolve, 50));
        // Story: This service integrates with platforms like Google Analytics, Mixpanel,
        // or a custom data warehouse, providing insights into add-on usage, feature adoption,
        // and identifying areas for improvement or potential user friction.
    },
    // Feature: Log Performance Metrics
    logPerformance: async (metricName: string, value: number, units: string): Promise<void> => {
        console.log(`[Telemetry] Performance Metric: ${metricName} = ${value} ${units}`);
        await new Promise(resolve => setTimeout(resolve, 50));
    },
    // Feature: Error Reporting
    logError: async (error: Error, context: Record<string, any>): Promise<void> => {
        console.error(`[Telemetry] Error: ${error.message}`, context);
        await new Promise(resolve => setTimeout(resolve, 50));
        // Story: Critical for maintaining a commercial-grade application. Errors are
        // automatically reported to services like Sentry or Bugsnag, allowing developers
        // to proactively identify and resolve issues.
    }
};

// Feature: Multilingual Support / Translation Service
export const TranslationService = {
    // Feature: Translate Text
    translate: async (text: string, targetLanguage: string, sourceLanguage?: string, aiModel: 'Gemini' | 'ChatGPT' = 'Gemini'): Promise<string> => {
        console.log(`[Translation Service] Translating to ${targetLanguage} using ${aiModel}: "${text.substring(0, 30)}..."`);
        await new Promise(resolve => setTimeout(resolve, 800));
        // Story: This leverages powerful language models (or dedicated translation APIs like Google Cloud Translation)
        // for highly accurate and context-aware translations, supporting global enterprises.
        const translations: Record<string, Record<string, string>> = {
            'es': {
                'Hey,': 'Hola,',
                'Just wanted to give you a quick update.': 'Solo quería darte una rápida actualización.',
                'The new user authentication flow is complete': 'El nuevo flujo de autenticación de usuario está completo',
                'Should I just add the new \'last_login\' column': '¿Debo solo añadir la nueva columna \'last_login\'',
                'Generate a professional and friendly reply': 'Generar una respuesta profesional y amigable',
                'project update': 'actualización de proyecto',
                'database migration': 'migración de base de datos'
            },
            'fr': {
                'Hey,': 'Salut,',
                'Just wanted to give you a quick update.': 'Je voulais juste vous donner une mise à jour rapide.',
                'The new user authentication flow is complete': 'Le nouveau flux d\'authentification utilisateur est terminé',
                'Should I just add the new \'last_login\' column': 'Dois-je simplement ajouter la nouvelle colonne "last_login"',
                'Generate a professional and friendly reply': 'Générer une réponse professionnelle et amicale',
                'project update': 'mise à jour du projet',
                'database migration': 'migration de base de données'
            }
        };
        const langMap = translations[targetLanguage] || {};
        let translatedText = text;
        for (const [key, value] of Object.entries(langMap)) {
            translatedText = translatedText.replace(new RegExp(key, 'gi'), value);
        }
        return translatedText + ` [translated to ${targetLanguage} via ${aiModel}]`; // Simplified translation
    },
    // Feature: Detect Language
    detectLanguage: async (text: string, aiModel: 'Gemini' | 'ChatGPT' = 'Gemini'): Promise<string> => {
        console.log(`[Translation Service] Detecting language for: "${text.substring(0, 30)}..." using ${aiModel}.`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // Very basic mock detection, in reality this would be an AI model call or API.
        if (text.toLowerCase().includes('hola') || text.toLowerCase().includes('gracias') || text.toLowerCase().includes('pregunta')) return 'es';
        if (text.toLowerCase().includes('bonjour') || text.toLowerCase().includes('merci') || text.toLowerCase().includes('question')) return 'fr';
        return 'en';
    }
};

// Feature: Email Parsing and Extraction Service
// Story: To make the add-on truly intelligent, it needs deep understanding of email content beyond just body text.
// This service uses advanced regex and potentially AI-driven NLP to break down emails into structured data.
export interface ParsedEmail {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    date: Date;
    recipients: string[];
    senderName: string;
    senderEmail: string;
    cc?: string[];
    attachments: { filename: string; size: number; mimeType: string; content?: string }[];
    entities: { type: 'person' | 'organization' | 'date' | 'location' | 'product' | 'url'; value: string; confidence?: number }[];
    actionItems: string[];
    sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
    keywords: string[];
    summary: string; // AI-generated summary
    // Feature: Thread Context
    threadId?: string;
    previousEmails: { id: string; subject: string; snippet: string; date: Date; from: string }[];
}

export const EmailParsingService = {
    // Feature: Extract Email Details
    parseEmail: async (email: typeof mockEmail, aiModel: 'Gemini' | 'ChatGPT' = 'Gemini'): Promise<ParsedEmail> => {
        console.log(`[Email Parsing Service] Deep parsing of email content using ${aiModel}.`);
        await new Promise(resolve => setTimeout(resolve, 400));
        const senderEmailMatch = email.from.match(/<([^>]+)>/);
        const senderEmail = senderEmailMatch ? senderEmailMatch[1] : email.from;
        const senderName = email.from.split('<')[0].trim();

        const recipients = [email.to.match(/<([^>]+)>/)?.[1] || email.to];

        // Placeholder for AI-driven entity extraction, sentiment, action items, keywords
        // Story: These would be results from dedicated NLP models, either on-device (for privacy/speed)
        // or cloud-based (for accuracy/scale).
        const entities = [
            { type: 'person', value: 'Alice', confidence: 0.99 },
            { type: 'organization', value: 'Acme Corp', confidence: 0.85 }, // Inferred from contact or email domain
            { type: 'date', value: 'staging server deployment date (implied)', confidence: 0.70 },
            { type: 'product', value: 'user authentication flow', confidence: 0.90 },
            { type: 'product', value: 'users table', confidence: 0.92 },
            { type: 'product', value: 'last_login column', confidence: 0.95 }
        ];
        const actionItems = ['Migrate \'users\' table with \'last_login\' column.'];
        const sentiment = 'neutral'; // Requires AI call, mock for now
        const keywords = ['project update', 'authentication', 'database migration', 'last_login', 'staging server'];
        const summary = await EmailParsingService.summarizeEmail(email.body, aiModel); // Generate summary on parse

        return {
            id: email.id,
            from: email.from,
            to: email.to,
            subject: email.subject,
            body: email.body,
            date: email.receivedAt,
            recipients,
            senderName,
            senderEmail,
            attachments: [], // Assume no attachments for mock email
            entities,
            actionItems,
            sentiment,
            keywords,
            summary,
            threadId: 'thread-abc-123', // Mock thread ID
            previousEmails: [] // Mock: In a real scenario, fetch from Gmail API context
        };
    },
    // Feature: Summarize Email Body using AI
    summarizeEmail: async (emailBody: string, model: 'Gemini' | 'ChatGPT'): Promise<string> => {
        console.log(`[Email Parsing Service] Summarizing email with ${model}.`);
        const prompt = `Summarize the following email body concisely, focusing on key updates and questions:\n\n${emailBody}`;
        const systemPrompt = "You are a helpful assistant that summarizes emails for enterprise users.";
        const stream = streamContent(prompt, systemPrompt, 0.7, model);
        let fullSummary = '';
        for await (const chunk of stream) {
            fullSummary += chunk;
        }
        return fullSummary.length > 0 ? fullSummary : "No summary could be generated by AI.";
    },
    // Feature: Extract Key Information with AI
    extractKeyInfo: async (emailBody: string, fields: string[], model: 'Gemini' | 'ChatGPT'): Promise<Record<string, string>> => {
        console.log(`[Email Parsing Service] Extracting key info with ${model}.`);
        const prompt = `Extract the following fields from the email body as a JSON object: ${fields.join(', ')}. Ensure the output is valid JSON. Email:\n\n${emailBody}`;
        const systemPrompt = "You are an AI assistant designed to extract structured information from emails and return it as a JSON object.";
        const stream = streamContent(prompt, systemPrompt, 0.7, model);
        let rawResponse = '';
        for await (const chunk of stream) {
            rawResponse += chunk;
        }
        try {
            // Attempt to parse JSON. AI models might return markdown wrapped JSON.
            const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```/);
            const jsonString = jsonMatch ? jsonMatch[1] : rawResponse;
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse AI extracted info:", e);
            TelemetryService.logError(e as Error, { emailBody, fields, rawResponse });
            return {};
        }
    },
    // Feature: Analyze Sentiment of Email Content
    analyzeSentiment: async (text: string, model: 'Gemini' | 'ChatGPT'): Promise<ParsedEmail['sentiment']> => {
        console.log(`[Email Parsing Service] Analyzing sentiment with ${model}.`);
        const prompt = `Analyze the sentiment of the following text: "${text}". Return only one word: positive, negative, neutral, or mixed.`;
        const systemPrompt = "You are an AI assistant that analyzes sentiment.";
        const stream = streamContent(prompt, systemPrompt, 0.3, model); // Lower temperature for more deterministic output
        let rawResponse = '';
        for await (const chunk of stream) {
            rawResponse += chunk;
        }
        const sentiment = rawResponse.trim().toLowerCase();
        if (['positive', 'negative', 'neutral', 'mixed'].includes(sentiment)) {
            return sentiment as ParsedEmail['sentiment'];
        }
        return 'neutral'; // Default if AI fails or gives unexpected output
    }
};

// Feature: AI Orchestration Service
// Story: This service acts as a router and orchestrator for various AI models (Gemini, ChatGPT, potentially others).
// It handles model selection, prompt engineering, retries, and fallback mechanisms, ensuring optimal AI responses.
export const AiOrchestrationService = {
    // Feature: Generate Content with Model Selection
    generateContent: async (prompt: string, systemPrompt: string, temperature: number, model: 'Gemini' | 'ChatGPT'): Promise<string> => {
        console.log(`[AI Orchestration] Generating content with ${model}.`);
        TelemetryService.trackEvent('AI_Content_Generation', { model, promptLength: prompt.length });
        try {
            const stream = streamContent(prompt, systemPrompt, temperature, model);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
            }
            return fullResponse;
        } catch (error) {
            TelemetryService.logError(error as Error, { prompt, systemPrompt, model });
            throw new Error(`AI generation failed with ${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    // Feature: Generate Reply with Tone Control
    generateReplyWithTone: async (emailBody: string, replyTone: string, model: 'Gemini' | 'ChatGPT', previousEmails: ParsedEmail['previousEmails'] = []): Promise<string> => {
        console.log(`[AI Orchestration] Generating reply with tone: ${replyTone} using ${model}.`);
        const systemPrompt = `You are a helpful assistant writing a professional email reply. The desired tone is ${replyTone}.`;
        let fullPrompt = `Generate a ${replyTone} reply to the following email. Acknowledge the update and answer the question by stating that only the 'last_login' column (as a DATETIME) is needed for now.`;

        // Feature: AI context from previous emails in thread
        if (previousEmails.length > 0) {
            const threadContext = previousEmails.map(prev => `--- Previous Email from ${prev.from} (${prev.date.toLocaleDateString()}):\n${prev.snippet}`).join('\n\n');
            fullPrompt = `Given the following email thread context, generate a ${replyTone} reply to the most recent email. Acknowledge the update and answer the question by stating that only the 'last_login' column (as a DATETIME) is needed for now.\n\nTHREAD CONTEXT:\n${threadContext}\n\nMOST RECENT EMAIL:\n${emailBody}`;
        } else {
            fullPrompt += `\n\nEMAIL:\n${emailBody}`;
        }
        return AiOrchestrationService.generateContent(fullPrompt, systemPrompt, 0.7, model);
    },
    // Feature: Suggest Follow-up Actions
    suggestFollowUpActions: async (emailBody: string, model: 'Gemini' | 'ChatGPT', maxSuggestions: number, threadContext: string = ''): Promise<string[]> => {
        console.log(`[AI Orchestration] Suggesting follow-up actions with ${model}.`);
        const systemPrompt = "You are an AI assistant that suggests concise, actionable follow-up items based on an email thread. Focus on tasks, communications, or information gathering.";
        let prompt = `Given the following email conversation, list up to ${maxSuggestions} distinct, actionable follow-up items. Return them as a numbered list.`;
        if (threadContext) {
            prompt += `\n\nTHREAD CONTEXT:\n${threadContext}\n\nCURRENT EMAIL:\n${emailBody}`;
        } else {
            prompt += `\n\nEMAIL:\n${emailBody}`;
        }

        const response = await AiOrchestrationService.generateContent(prompt, systemPrompt, 0.6, model);
        return response.split('\n').filter(line => line.trim().match(/^\d+\./)).map(line => line.replace(/^\d+\.\s*/, '').trim());
    },
    // Feature: Draft Automated Response
    draftAutomatedResponse: async (emailBody: string, templates: AddonConfig['automatedResponseTemplates'], model: 'Gemini' | 'ChatGPT'): Promise<string | null> => {
        console.log(`[AI Orchestration] Drafting automated response using ${model}.`);
        const systemPrompt = "You are an AI assistant specialized in drafting automated email responses based on keywords and provided templates.";
        const prompt = `Analyze the following email and determine if any of the provided templates are suitable for an automated response. If a template is suitable, return its 'content'. If multiple, return the most relevant one. If none, return 'NONE'.\n\nEMAIL:\n${emailBody}\n\nTEMPLATES:\n${JSON.stringify(templates.map(t => ({ name: t.name, keywords: t.triggerKeywords, contentSnippet: t.content.substring(0, 50) + '...' })))}`;

        const response = await AiOrchestrationService.generateContent(prompt, systemPrompt, 0.4, model); // Low temp for template matching
        const chosenTemplate = templates.find(t => response.includes(t.content.substring(0, Math.min(50, t.content.length))));
        return chosenTemplate ? chosenTemplate.content : null;
    }
};

// --- Mock Email Data ---
// Story: The original mock email is retained, but the add-on's capabilities extend to
// dynamically parsing any email.
const mockEmail = {
    id: 'email-12345',
    from: 'Alice <alice@example.com>',
    to: 'Me <me@example.com>',
    subject: 'Project Update & Question',
    body: `Hey,

Just wanted to give you a quick update. The new user authentication flow is complete and pushed to the staging server.

I had a question about the next task regarding the database migration. The ticket says we need to migrate the 'users' table, but it's not clear on the required schema changes. Should I just add the new 'last_login' column or are there other modifications needed?

Let me know when you have a chance.

Thanks,
Alice`,
    receivedAt: new Date('2023-10-26T14:30:00Z'),
    labels: ['Inbox', 'Work', 'Project Chimera'],
    attachments: [] // For simplicity, assume none for mock
};

// --- Add-on Component Structure ---

// Feature: Advanced Compose Modal with AI-powered features
// Story: The original compose modal was basic. This version is a full-fledged intelligent composer,
// offering real-time AI assistance, translation, sentiment checks, and robust sending options.
export const AdvancedComposeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    initialReplyContent: string;
    isGenerating: boolean;
    onSend: (content: string, recipients: string[], subject: string, attachments?: { filename: string; content: string; mimeType: string }[]) => void;
    mockEmail: typeof mockEmail;
}> = ({ isOpen, onClose, initialReplyContent, isGenerating, onSend, mockEmail }) => {
    const { config, userId } = useUser();
    const [replyContent, setReplyContent] = useState(initialReplyContent);
    const [currentReplyTone, setCurrentReplyTone] = useState(config.defaultReplyTone);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedContent, setTranslatedContent] = useState(''); // Retained for potential display difference
    const [targetLanguage, setTargetLanguage] = useState('en');
    const [sentiment, setSentiment] = useState<'positive' | 'negative' | 'neutral' | 'mixed'>('neutral');
    const [sentimentLoading, setSentimentLoading] = useState(false);
    const [dlpWarning, setDlpWarning] = useState<{ hasSensitiveData: boolean; detectedTypes: string[] } | null>(null);
    const [recipients, setRecipients] = useState<string[]>([mockEmail.from]);
    const [subject, setSubject] = useState(`Re: ${mockEmail.subject}`);
    const [isSending, setIsSending] = useState(false);
    const [automatedResponseDraft, setAutomatedResponseDraft] = useState<string | null>(null);
    const [automatedResponseLoading, setAutomatedResponseLoading] = useState(false);

    // Feature: Real-time AI Sentiment Analysis in Composer
    const analyzeSentimentEffect = useCallback(async (text: string) => {
        if (!text) {
            setSentiment('neutral');
            return;
        }
        setSentimentLoading(true);
        try {
            const detectedSentiment = await EmailParsingService.analyzeSentiment(text, config.defaultAiModel);
            setSentiment(detectedSentiment);
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'analyzeSentimentComposer' });
            setSentiment('mixed'); // Indicate uncertainty on error
        } finally {
            setSentimentLoading(false);
        }
    }, [config.defaultAiModel]);

    // Feature: Data Loss Prevention (DLP) Scan on compose
    const runDlpScanEffect = useCallback(async (text: string) => {
        if (!config.dataLossPreventionEnabled || !text) {
            setDlpWarning(null);
            return;
        }
        try {
            const result = await SecurityComplianceService.scanForSensitiveData(text, config.defaultAiModel);
            setDlpWarning(result);
            if (result.hasSensitiveData) {
                TelemetryService.trackEvent('DLP_Warning_Triggered', { detectedTypes: result.detectedTypes });
            }
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'runDlpScanComposer' });
            setDlpWarning(null);
        }
    }, [config.dataLossPreventionEnabled, config.defaultAiModel]);

    // Feature: Suggest automated response
    const suggestAutomatedResponse = useCallback(async (emailBody: string) => {
        if (config.automatedResponseTemplates.length === 0) return;
        setAutomatedResponseLoading(true);
        try {
            const draft = await AiOrchestrationService.draftAutomatedResponse(emailBody, config.automatedResponseTemplates, config.defaultAiModel);
            setAutomatedResponseDraft(draft);
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'suggestAutomatedResponse' });
            setAutomatedResponseDraft(null);
        } finally {
            setAutomatedResponseLoading(false);
        }
    }, [config.automatedResponseTemplates, config.defaultAiModel]);


    useEffect(() => {
        setReplyContent(initialReplyContent);
        analyzeSentimentEffect(initialReplyContent);
        runDlpScanEffect(initialReplyContent);
        suggestAutomatedResponse(mockEmail.body); // Suggest for the original email body
    }, [initialReplyContent, analyzeSentimentEffect, runDlpScanEffect, mockEmail.body, suggestAutomatedResponse]);

    useEffect(() => {
        analyzeSentimentEffect(replyContent);
        runDlpScanEffect(replyContent);
    }, [replyContent, analyzeSentimentEffect, runDlpScanEffect]);

    const handleTranslateReply = useCallback(async () => {
        setIsTranslating(true);
        try {
            const translated = await TranslationService.translate(replyContent, targetLanguage, undefined, config.defaultAiModel);
            setTranslatedContent(translated);
            setReplyContent(translated); // Apply translation directly
            TelemetryService.trackEvent('Reply_Translated', { targetLanguage });
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'translateReply', targetLanguage });
            alert(`Translation failed: ${e instanceof Error ? e.message : 'Could not translate.'}`);
        } finally {
            setIsTranslating(false);
        }
    }, [replyContent, targetLanguage, config.defaultAiModel]);

    const handleSend = useCallback(async () => {
        setIsSending(true);
        try {
            // Feature: Pre-send DLP check (mandatory for sensitive content)
            if (dlpWarning?.hasSensitiveData) {
                const confirmed = window.confirm("Sensitive data detected in your reply. Are you sure you want to send?");
                if (!confirmed) {
                    setIsSending(false);
                    return;
                }
            }
            onSend(replyContent, recipients, subject);
            TelemetryService.trackEvent('Reply_Sent', {
                aiAssisted: initialReplyContent.length > 0, // Simplified check
                dlpScanResult: dlpWarning?.hasSensitiveData,
                sentiment: sentiment
            });
            await SecurityComplianceService.logAuditEntry('email_sent', userId, {
                subject: subject,
                to: recipients,
                sentiment: sentiment
            }, config.complianceLogLevel);
            setComposeOpen(false);
            setGeneratedReply('');
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'sendReply', recipients, subject });
            alert(`Failed to send email: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setIsSending(false);
        }
    }, [onSend, replyContent, recipients, subject, dlpWarning, initialReplyContent, sentiment, userId, config.complianceLogLevel]);

    if (!isOpen) return null;

    const getSentimentColor = (s: typeof sentiment) => {
        switch (s) {
            case 'positive': return 'text-green-500';
            case 'negative': return 'text-red-500';
            case 'mixed': return 'text-orange-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"> {/* Increased z-index */}
            <div className="w-full max-w-4xl h-[85vh] bg-surface rounded-lg shadow-2xl flex flex-col animate-pop-in border border-border-light dark:border-border-dark">
                <header className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
                    <h3 className="font-semibold text-md flex items-center"><MailIcon className="mr-2" />New Message - <span className="ml-1 text-sm font-normal">AI Draft</span></h3>
                    <div className="flex items-center gap-2">
                         <Tooltip content="Refresh AI Draft">
                            <button onClick={() => setReplyContent(initialReplyContent)} className="text-white hover:text-blue-200"><RefreshIcon className="w-5 h-5" /></button>
                         </Tooltip>
                        <button onClick={onClose} className="text-white hover:text-blue-200"><XMarkIcon className="w-5 h-5" /></button>
                    </div>
                </header>
                <div className="p-3 text-sm border-b border-border-light dark:border-border-dark flex items-center">
                    <p className="flex-shrink-0"><span className="text-text-secondary">To:</span> {recipients.join(', ')}</p>
                    <Tooltip content="Add more recipients (AI suggestion based on thread history)">
                        <button className="ml-2 text-blue-500 hover:text-blue-700" onClick={() => alert('AI suggests other thread participants...')}>
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </Tooltip>
                </div>
                <div className="p-3 text-sm border-b border-border-light dark:border-border-dark flex items-center">
                     <input
                        type="text"
                        className="flex-grow bg-transparent text-text-primary focus:outline-none"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                     />
                    <div className="flex items-center gap-2 ml-4">
                        {sentimentLoading ? <LoadingSpinner size="sm" /> :
                         <Tooltip content={`Sentiment: ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}`}>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSentimentColor(sentiment)} bg-opacity-20`}>
                                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                            </span>
                         </Tooltip>
                        }
                    </div>
                </div>
                {dlpWarning?.hasSensitiveData && (
                    <Alert type="warning" message={`DLP Warning: Detected sensitive data (${dlpWarning.detectedTypes.join(', ')}). Review before sending.`} />
                )}
                {automatedResponseDraft && (
                    <Alert type="info" message="AI suggests an automated response template.">
                        <button className="btn-secondary px-3 py-1 text-xs ml-2" onClick={() => { setReplyContent(automatedResponseDraft); setAutomatedResponseDraft(null); }}>Apply Draft</button>
                    </Alert>
                )}
                <div className="flex-grow p-3 overflow-y-auto">
                    {isGenerating ? <div className="flex justify-center items-center h-full"><LoadingSpinner /></div> : (
                        <textarea
                            className="w-full h-full p-2 bg-transparent text-text-primary border border-border-light dark:border-border-dark rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Your AI-generated or custom reply goes here..."
                        />
                    )}
                </div>
                 <footer className="p-3 border-t border-border-light dark:border-border-dark bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        {/* Feature: Reply Tone Selector */}
                        <label htmlFor="replyTone" className="text-sm text-text-secondary">Tone:</label>
                        <select
                            id="replyTone"
                            className="p-1 text-sm bg-surface-light dark:bg-slate-800 border border-border-light dark:border-border-dark rounded"
                            value={currentReplyTone}
                            onChange={(e) => setCurrentReplyTone(e.target.value as typeof currentReplyTone)}
                            disabled={isGenerating || isTranslating || isSending}
                        >
                            {config.aiReplyToneOptions.map(tone => (
                                <option key={tone} value={tone}>{tone}</option>
                            ))}
                        </select>

                        {/* Feature: Translation Option in Composer */}
                        <label htmlFor="translateLang" className="text-sm text-text-secondary ml-2">Translate:</label>
                        <select
                            id="translateLang"
                            className="p-1 text-sm bg-surface-light dark:bg-slate-800 border border-border-light dark:border-border-dark rounded"
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            disabled={isGenerating || isTranslating || isSending}
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="ja">Japanese</option>
                            {/* ... many more language options */}
                        </select>
                        <button
                            className="btn-secondary px-4 py-2 text-sm flex items-center gap-1"
                            onClick={handleTranslateReply}
                            disabled={isTranslating || isGenerating || isSending || targetLanguage === 'en'}
                        >
                            {isTranslating ? <LoadingSpinner size="sm" /> : <GlobeIcon className="w-4 h-4" />} Translate
                        </button>
                    </div>
                    <button
                        className="btn-primary px-6 py-2 flex items-center gap-2"
                        onClick={handleSend}
                        disabled={isGenerating || isTranslating || isSending || !replyContent.trim()}
                    >
                        {isSending ? <LoadingSpinner size="sm" /> : <SendIcon />} Send Message
                    </button>
                 </footer>
            </div>
        </div>
    );
};


// Feature: Contextual Action Cards
// Story: These cards represent the core of the Project Chimera add-on, offering
// intelligent, context-aware actions based on the email content, connecting to various services.
export const ContextualActionCard: React.FC<{
    title: string;
    icon: React.ElementType; // Icon component, e.g., MailIcon, SparklesIcon
    description: string;
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    tooltipContent?: string;
    showBadge?: boolean; // New feature: Visual cue for new/important actions
}> = ({ title, icon: Icon, description, onClick, isLoading, disabled, tooltipContent, showBadge }) => {
    return (
        <Tooltip content={tooltipContent || description}>
            <button
                onClick={onClick}
                disabled={disabled || isLoading}
                className="relative flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-slate-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-border-light dark:border-border-dark h-36 w-48 text-center"
            >
                {showBadge && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse" aria-label="New Feature"></span>
                )}
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                        <h4 className="font-semibold text-sm mb-1 text-text-primary">{title}</h4>
                        <p className="text-xs text-text-secondary">{description}</p>
                    </>
                )}
            </button>
        </Tooltip>
    );
};

// Feature: Add-on Sidebar Panel
// Story: The main interface for the add-on, containing multiple tabs for different functionalities.
// This is where the 1000 features truly come to life, providing a rich, interactive experience.
export const AddonSidebarPanel: React.FC<{ email: ParsedEmail; onGenerateReply: (tone: string) => void; isGeneratingReply: boolean }> = ({ email, onGenerateReply, isGeneratingReply }) => {
    const { config, updateConfig, userId, preferredLanguage, isDarkMode, toggleDarkMode } = useUser();
    const [activeTab, setActiveTab] = useState<'ai' | 'crm' | 'tasks' | 'calendar' | 'documents' | 'security' | 'settings' | 'followups'>('ai');
    const [crmLoading, setCrmLoading] = useState(false);
    const [taskLoading, setTaskLoading] = useState(false);
    const [calendarLoading, setCalendarLoading] = useState(false);
    const [documentLoading, setDocumentLoading] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryContent, setSummaryContent] = useState(email.summary); // Use pre-parsed summary
    const [extractedEntities, setExtractedEntities] = useState<typeof email.entities>(email.entities); // Use pre-parsed entities
    const [entitiesLoading, setEntitiesLoading] = useState(false); // Only if re-extracting
    const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
    const [followUpLoading, setFollowUpLoading] = useState(false);
    const [phishingScanResult, setPhishingScanResult] = useState<{ isPhishing: boolean; confidence: number; reasons: string[] } | null>(null);
    const [phishingLoading, setPhishingLoading] = useState(false);
    const [suggestedTasks, setSuggestedTasks] = useState<ProjectTask[]>([]);
    const [suggestedTasksLoading, setSuggestedTasksLoading] = useState(false);
    const [suggestedMeetings, setSuggestedMeetings] = useState<Date[]>([]);
    const [suggestedMeetingsLoading, setSuggestedMeetingsLoading] = useState(false);
    const [crmContact, setCrmContact] = useState<CrmContact | null>(null);
    const [crmContactLoading, setCrmContactLoading] = useState(false);
    const [relatedDocuments, setRelatedDocuments] = useState<{ title: string; url: string; relevanceScore: number }[]>([]);
    const [relatedDocumentsLoading, setRelatedDocumentsLoading] = useState(false);
    const [translationNeeded, setTranslationNeeded] = useState(false);
    const [detectedLanguage, setDetectedLanguage] = useState('');
    const [quickActionButtonLoading, setQuickActionButtonLoading] = useState<string | null>(null); // For custom quick actions

    // Story: Lifecycle hooks are critical for orchestrating the many features.
    // This `useEffect` block showcases the add-on's proactive, context-aware capabilities.
    useEffect(() => {
        // Feature: Proactive AI-driven Email Summary (refresh/confirm if needed)
        // No explicit call here as summary is part of initial email parse.
        // It demonstrates how the parsedEmail already contains rich AI output.

        // Feature: Proactive CRM Contact Lookup
        const lookupCrmContact = async () => {
            if (!config.crmIntegrationEnabled) return;
            setCrmContactLoading(true);
            try {
                const contact = await CrmIntegrationService.fetchContactByEmail(email.senderEmail);
                setCrmContact(contact);
                TelemetryService.trackEvent('CRM_Contact_Lookup', { found: !!contact });
            } catch (e) {
                TelemetryService.logError(e as Error, { feature: 'lookupCrmContact', email: email.senderEmail });
                setCrmContact(null);
            } finally {
                setCrmContactLoading(false);
            }
        };

        // Feature: Proactive Phishing Scan
        const runPhishingScan = async () => {
            if (!config.phishingDetectionEnabled) return;
            setPhishingLoading(true);
            try {
                const result = await SecurityComplianceService.scanForPhishing({}, email.body, config.defaultAiModel); // Mock headers for now
                setPhishingScanResult(result);
                TelemetryService.trackEvent('Phishing_Scan_Completed', { isPhishing: result.isPhishing });
            } catch (e) {
                TelemetryService.logError(e as Error, { feature: 'phishingScan' });
                setPhishingScanResult(null);
            } finally {
                setPhishingLoading(false);
            }
        };

        // Feature: Proactive Language Detection
        const detectAndSuggestTranslation = async () => {
            if (!config.translationServiceEnabled) return;
            try {
                const detectedLang = await TranslationService.detectLanguage(email.body.substring(0, 200), config.defaultAiModel);
                setDetectedLanguage(detectedLang);
                if (detectedLang !== preferredLanguage) { // Compare against user's preferred language
                    setTranslationNeeded(true);
                    TelemetryService.trackEvent('Language_Detected', { detectedLang, needsTranslation: true });
                }
            } catch (e) {
                TelemetryService.logError(e as Error, { feature: 'languageDetection' });
            }
        };

        // Initial loading of contextual information
        if (email) {
            lookupCrmContact();
            runPhishingScan();
            detectAndSuggestTranslation();
        }
    }, [email, config, preferredLanguage]); // Depend on email and config changes

    // Feature: Contextual Action: Log to CRM
    const handleLogToCrm = useCallback(async () => {
        if (!crmContact) {
            alert('No CRM contact found to log activity.');
            return;
        }
        setCrmLoading(true);
        try {
            const success = await CrmIntegrationService.logEmailAsActivity(crmContact.id, email.body, email.subject, email.id);
            if (success) {
                alert('Email successfully logged to CRM!');
                TelemetryService.trackEvent('CRM_Activity_Logged', { contactId: crmContact.id });
                await SecurityComplianceService.logAuditEntry('crm_activity_logged', userId, {
                    contactId: crmContact.id,
                    emailId: email.id,
                    subject: email.subject
                }, config.complianceLogLevel);
            } else {
                alert('Failed to log email to CRM.');
            }
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'logToCrm' });
            alert(`Error logging to CRM: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setCrmLoading(false);
        }
    }, [email, crmContact, userId, config.complianceLogLevel]);

    // Feature: Contextual Action: Create Project Task
    const handleCreateTask = useCallback(async () => {
        if (!config.projectManagementIntegrationEnabled) return;
        setTaskLoading(true);
        try {
            const task = await ProjectManagementService.createTask(`Follow up on: ${email.subject}`, email.body, email.senderName, 'proj-1', 'Medium', email.keywords);
            if (task) {
                alert(`Task "${task.title}" created in project management system!`);
                TelemetryService.trackEvent('Project_Task_Created', { taskId: task.id });
                await SecurityComplianceService.logAuditEntry('create_task_from_email', userId, {
                    emailId: email.id,
                    taskId: task.id,
                    taskTitle: task.title
                }, config.complianceLogLevel);
            } else {
                alert('Failed to create task.');
            }
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'createTask' });
            alert(`Error creating task: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setTaskLoading(false);
        }
    }, [email, config.projectManagementIntegrationEnabled, userId, config.complianceLogLevel]);

    // Feature: Contextual Action: Suggest Tasks from Email Body (AI-driven)
    const handleSuggestTasks = useCallback(async () => {
        if (!config.projectManagementIntegrationEnabled) return;
        setSuggestedTasksLoading(true);
        try {
            const tasks = await ProjectManagementService.extractAndCreateTasks(email.body, config.defaultAiModel);
            setSuggestedTasks(tasks);
            TelemetryService.trackEvent('AI_Suggested_Tasks', { count: tasks.length });
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'suggestTasks' });
            alert(`Error suggesting tasks: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setSuggestedTasksLoading(false);
        }
    }, [email.body, config.projectManagementIntegrationEnabled, config.defaultAiModel]);

    // Feature: Contextual Action: Propose Meeting (AI-driven)
    const handleProposeMeeting = useCallback(async () => {
        if (!config.calendarIntegrationEnabled) return;
        setSuggestedMeetingsLoading(true);
        try {
            const suggestedTimes = await CalendarService.proposeMeetingTimes(email.body, [email.senderEmail, ...email.recipients], config.defaultAiModel);
            setSuggestedMeetings(suggestedTimes);
            TelemetryService.trackEvent('AI_Suggested_Meetings', { count: suggestedTimes.length });
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'proposeMeeting' });
            alert(`Error proposing meetings: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setSuggestedMeetingsLoading(false);
        }
    }, [email.body, email.senderEmail, email.recipients, config.calendarIntegrationEnabled, config.defaultAiModel]);

    // Feature: Contextual Action: Find and Link Relevant Documents (AI-driven)
    const handleFindRelatedDocuments = useCallback(async () => {
        setRelatedDocumentsLoading(true);
        try {
            const docs = await DocumentService.linkRelevantDocuments(email.body, config.defaultAiModel);
            setRelatedDocuments(docs);
            TelemetryService.trackEvent('AI_Linked_Documents', { count: docs.length });
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'findRelatedDocuments' });
            alert(`Error finding related documents: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setRelatedDocumentsLoading(false);
        }
    }, [email.body, config.defaultAiModel]);

    // Feature: Contextual Action: Generate Follow-up Suggestions (AI-driven)
    const handleGenerateFollowUps = useCallback(async () => {
        setFollowUpLoading(true);
        try {
            // Prepare thread context for AI
            const threadContext = email.previousEmails.map(prev => `From: ${prev.from}\nSubject: ${prev.subject}\nSnippet: ${prev.snippet}`).join('\n---\n');
            const suggestions = await AiOrchestrationService.suggestFollowUpActions(email.body, config.defaultAiModel, config.maxFollowUpSuggestions, threadContext);
            setFollowUpSuggestions(suggestions);
            TelemetryService.trackEvent('AI_FollowUp_Suggestions', { count: suggestions.length });
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'generateFollowUps' });
            alert(`Error generating follow-ups: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setFollowUpLoading(false);
        }
    }, [email.body, email.previousEmails, config.defaultAiModel, config.maxFollowUpSuggestions]);

    // Feature: Translate Email Body
    const handleTranslateEmailBody = useCallback(async (targetLang: string) => {
        try {
            const translatedBody = await TranslationService.translate(email.body, targetLang, detectedLanguage, config.defaultAiModel);
            // This would likely render in a separate view or modal for the user to review
            alert(`Translated Email (to ${targetLang}):\n\n${translatedBody.substring(0, 500)}...`);
            TelemetryService.trackEvent('Email_Body_Translated', { targetLang });
            await SecurityComplianceService.logAuditEntry('email_translated', userId, {
                emailId: email.id,
                targetLanguage: targetLang
            }, config.complianceLogLevel);
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'translateEmailBody' });
            alert(`Translation failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
    }, [email.body, detectedLanguage, config.defaultAiModel, userId, config.complianceLogLevel]);

    // Feature: Handle Custom Quick Actions
    const handleCustomQuickAction = useCallback(async (actionConfig: AddonConfig['customQuickActions'][0]) => {
        setQuickActionButtonLoading(actionConfig.id);
        TelemetryService.trackEvent('Custom_Quick_Action_Triggered', { actionId: actionConfig.id, service: actionConfig.service, action: actionConfig.action });
        try {
            switch (actionConfig.service) {
                case 'CRM':
                    if (actionConfig.action === 'createOpportunity' && crmContact) {
                        const opp = await CrmIntegrationService.createOpportunity(crmContact.id, `Opportunity from ${email.subject}`, 1000, actionConfig.config.stage);
                        if (opp) alert(`Created CRM Opportunity: ${opp.id}`);
                        else alert('Failed to create CRM opportunity.');
                    }
                    // ... other CRM actions
                    break;
                case 'ProjectManagement':
                    if (actionConfig.action === 'createTicket') {
                        const ticket = await ProjectManagementService.createTask(
                            `Ticket: ${email.subject}`,
                            `Details from email: ${email.body}`,
                            undefined, // assignee
                            undefined, // project ID
                            actionConfig.config.priority as ProjectTask['priority'] || 'Medium',
                            ['escalation', actionConfig.config.department].filter(Boolean)
                        );
                        if (ticket) alert(`Created Project Ticket: ${ticket.id}`);
                        else alert('Failed to create project ticket.');
                    }
                    // ... other ProjectManagement actions
                    break;
                // ... many more service-specific actions
                default:
                    console.warn(`Unknown service or action for custom quick action: ${actionConfig.service}.${actionConfig.action}`);
                    alert(`Action "${actionConfig.label}" is not yet implemented in this simulator.`);
            }
        } catch (e) {
            TelemetryService.logError(e as Error, { feature: 'customQuickAction', actionConfig, emailId: email.id });
            alert(`Error executing custom action: ${actionConfig.label}. ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setQuickActionButtonLoading(null);
        }
    }, [crmContact, email, config.defaultAiModel]);


    const tabs = [
        { id: 'ai', label: 'AI Tools', icon: SparklesIcon },
        { id: 'crm', label: 'CRM', icon: UserIcon, enabled: config.crmIntegrationEnabled },
        { id: 'tasks', label: 'Tasks', icon: CheckIcon, enabled: config.projectManagementIntegrationEnabled },
        { id: 'calendar', label: 'Calendar', icon: CalendarIcon, enabled: config.calendarIntegrationEnabled },
        { id: 'documents', label: 'Documents', icon: BookOpenIcon },
        { id: 'followups', label: 'Follow-ups', icon: ClockIcon },
        { id: 'security', label: 'Security', icon: ShieldIcon, enabled: config.phishingDetectionEnabled || config.dataLossPreventionEnabled },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ].filter(tab => tab.enabled !== false); // Only show enabled tabs

    return (
        <div className={`bg-surface border-l border-border-light dark:border-border-dark w-96 flex-shrink-0 flex flex-col p-4 shadow-lg overflow-y-auto transition-colors duration-200 ${isDarkMode ? 'dark:bg-slate-900' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center text-text-primary"><SparklesIcon className="mr-2 text-blue-500" />Chimera Add-on</h3>
            <p className="text-sm text-text-secondary mb-4">Leveraging AI for enhanced productivity and seamless enterprise integration.</p>

            {/* Feature: Tab Navigation for Add-on Panel */}
            <div className="flex border-b border-border-light dark:border-border-dark mb-4 overflow-x-auto whitespace-nowrap">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-text-secondary hover:text-text-primary'}`}
                        onClick={() => { setActiveTab(tab.id as any); TelemetryService.trackEvent('Sidebar_Tab_Changed', { tab: tab.id }); }}
                    >
                        <tab.icon className="w-4 h-4 mr-1" />{tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-grow">
                {activeTab === 'ai' && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-md text-text-primary">AI Insights & Quick Actions</h4>
                        {phishingLoading ? <LoadingSpinner /> : phishingScanResult?.isPhishing ? (
                            <Alert type="error" message={`High Phishing Risk Detected! Reasons: ${phishingScanResult.reasons.join(', ')}. Proceed with caution.`} />
                        ) : phishingScanResult && (
                            <Alert type="success" message="No immediate phishing threats detected." />
                        )}
                        {translationNeeded && detectedLanguage && config.translationServiceEnabled && (
                            <Alert type="info" message={`Email detected in ${detectedLanguage.toUpperCase()}. `} actionButton={{ text: 'Translate Email', onClick: () => handleTranslateEmailBody(preferredLanguage) }} />
                        )}
                        <p className="text-xs text-text-secondary">AI-generated summary:</p>
                        {summaryLoading ? <LoadingSpinner /> : <p className="text-sm border-l-2 border-blue-400 pl-2 italic text-text-primary">{summaryContent}</p>}

                        <h4 className="font-semibold text-md text-text-primary mt-4">AI Actions</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {config.aiReplyToneOptions.map(tone => (
                                <ContextualActionCard
                                    key={`reply-${tone}`}
                                    title={`${tone} Reply`}
                                    description={`Generate a ${tone.toLowerCase()} draft.`}
                                    icon={SparklesIcon}
                                    onClick={() => onGenerateReply(tone)}
                                    isLoading={isGeneratingReply}
                                    disabled={isGeneratingReply}
                                />
                            ))}
                            {/* Feature: Dynamic Custom Quick Actions */}
                            {config.customQuickActions.map(action => (
                                <ContextualActionCard
                                    key={action.id}
                                    title={action.label}
                                    description={`Trigger ${action.service} action: ${action.action}`}
                                    icon={TagIcon} // Placeholder icon
                                    onClick={() => handleCustomQuickAction(action)}
                                    isLoading={quickActionButtonLoading === action.id}
                                    disabled={!config.crmIntegrationEnabled && action.service === 'CRM'}
                                    showBadge={action.id === 'qa-1'} // Example of a new feature badge
                                />
                            ))}
                        </div>
                         {/* Feature: Extract Action Items (AI-driven) */}
                        <div className="mt-4">
                            <h5 className="font-semibold text-md text-text-primary mb-2">Suggested Actions from Email</h5>
                            <ContextualActionCard
                                title="Suggest Tasks"
                                description="AI parses email for actionable items and suggests tasks."
                                icon={CheckIcon}
                                onClick={handleSuggestTasks}
                                isLoading={suggestedTasksLoading}
                            />
                            {suggestedTasks.length > 0 && (
                                <div className="mt-2 p-2 bg-gray-50 dark:bg-slate-700 rounded text-sm">
                                    <h6 className="font-medium text-text-primary">AI Suggested Tasks:</h6>
                                    <ul className="list-disc pl-5">
                                        {suggestedTasks.map((task, idx) => (
                                            <li key={idx} className="text-text-primary">{task.title} <span className="text-text-secondary">(Status: {task.status}, Priority: {task.priority})</span></li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <ContextualActionCard
                                title="Propose Meeting"
                                description="AI analyzes schedules to suggest meeting times."
                                icon={CalendarIcon}
                                onClick={handleProposeMeeting}
                                isLoading={suggestedMeetingsLoading}
                                disabled={!config.calendarIntegrationEnabled}
                            />
                            {suggestedMeetings.length > 0 && (
                                <div className="mt-2 p-2 bg-gray-50 dark:bg-slate-700 rounded text-sm">
                                    <h6 className="font-medium text-text-primary">AI Suggested Meeting Times:</h6>
                                    <ul className="list-disc pl-5">
                                        {suggestedMeetings.map((time, idx) => (
                                            <li key={idx} className="text-text-primary">{time.toLocaleString()}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                             <ContextualActionCard
                                title="Find Related Docs"
                                description="AI searches knowledge base for relevant documents."
                                icon={BookOpenIcon}
                                onClick={handleFindRelatedDocuments}
                                isLoading={relatedDocumentsLoading}
                            />
                            {relatedDocuments.length > 0 && (
                                <div className="mt-2 p-2 bg-gray-50 dark:bg-slate-700 rounded text-sm">
                                    <h6 className="font-medium text-text-primary">AI Linked Documents:</h6>
                                    <ul className="list-disc pl-5">
                                        {relatedDocuments.map((doc, idx) => (
                                            <li key={idx} className="text-text-primary">
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{doc.title}</a> <span className="text-text-secondary">({Math.round(doc.relevanceScore * 100)}% relevant)</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'crm' && config.crmIntegrationEnabled && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-md text-text-primary">CRM Integration</h4>
                        {crmContactLoading ? <LoadingSpinner /> : crmContact ? (
                            <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-border-light dark:border-border-dark">
                                <h5 className="font-medium text-text-primary">Contact Found: {crmContact.name}</h5>
                                <p className="text-sm text-text-secondary">Email: {crmContact.email}</p>
                                <p className="text-sm text-text-secondary">Company: {crmContact.company}</p>
                                <p className="text-sm text-text-secondary">Stage: {crmContact.stage}</p>
                                {crmContact.phone && <p className="text-sm text-text-secondary">Phone: {crmContact.phone}</p>}
                                <p className="text-xs text-text-tertiary mt-1">Last Activity: {new Date(crmContact.lastActivity).toLocaleDateString()}</p>
                                <p className="text-xs text-text-tertiary">Assigned Owner: {crmContact.ownerId}</p>
                                <p className="text-xs text-text-tertiary">Tags: {crmContact.tags.join(', ')}</p>

                                <button
                                    className="btn-primary mt-3 px-4 py-2 text-sm flex items-center gap-1"
                                    onClick={handleLogToCrm}
                                    disabled={crmLoading}
                                >
                                    {crmLoading ? <LoadingSpinner size="sm" /> : <BriefcaseIcon className="w-4 h-4" />} Log Email as Activity
                                </button>
                                {/* Feature: Update CRM Contact Stage (UI for action) */}
                                <div className="mt-3">
                                    <label htmlFor="crmStage" className="text-sm text-text-secondary block mb-1">Update Stage:</label>
                                    <select id="crmStage" className="w-full p-2 text-sm bg-surface-light dark:bg-slate-800 border border-border-light dark:border-border-dark rounded">
                                        <option value="lead">Lead</option>
                                        <option value="opportunity">Opportunity</option>
                                        <option value="customer">Customer</option>
                                        <option value="churned">Churned</option>
                                    </select>
                                    <button className="btn-secondary mt-2 px-4 py-2 text-sm w-full" onClick={() => CrmIntegrationService.updateContactStage(crmContact.id, 'opportunity')}>Update CRM Stage</button>
                                </div>
                            </div>
                        ) : (
                            <Alert type="info" message={`No CRM contact found for ${email.senderEmail}.`} actionButton={{ text: 'Create New Lead', onClick: () => { alert('Creating new lead...'); CrmIntegrationService.createLead(email.senderEmail, email.subject); } }} />
                        )}
                    </div>
                )}

                {activeTab === 'tasks' && config.projectManagementIntegrationEnabled && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-md text-text-primary">Project Tasks</h4>
                        <ContextualActionCard
                            title="Create Task"
                            description="Create a new task in your project management system."
                            icon={PlusIcon}
                            onClick={handleCreateTask}
                            isLoading={taskLoading}
                        />
                        <ContextualActionCard
                            title="AI Suggest Tasks"
                            description="Let AI extract actionable items from this email to create tasks."
                            icon={SparklesIcon}
                            onClick={handleSuggestTasks}
                            isLoading={suggestedTasksLoading}
                        />
                        {suggestedTasks.length > 0 && (
                            <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                <h5 className="font-medium text-text-primary">AI Suggested Tasks:</h5>
                                <ul className="list-disc pl-5 text-sm">
                                    {suggestedTasks.map((task) => (
                                        <li key={task.id} className="text-text-primary">
                                            {task.title}
                                            <button className="ml-2 text-blue-500 hover:text-blue-700 text-xs" onClick={() => alert(`Creating task: ${task.title}`)}>Add</button>
                                            <button className="ml-2 text-red-500 hover:text-red-700 text-xs" onClick={() => setSuggestedTasks(prev => prev.filter(t => t.id !== task.id))}>Dismiss</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {/* Feature: Task Status Update (via AI - mock) */}
                        <div className="mt-4">
                            <h5 className="font-semibold text-md text-text-primary mb-2">Email-Contextual Task Updates</h5>
                            <p className="text-sm text-text-secondary mb-2">
                                AI can analyze your email responses to update task statuses automatically.
                            </p>
                            <button className="btn-secondary px-4 py-2 text-sm flex items-center gap-1" onClick={() => alert('Simulating AI task status update!')}>
                                <ArrowPathIcon className="w-4 h-4" /> Auto-update Task Status
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'calendar' && config.calendarIntegrationEnabled && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-md text-text-primary">Calendar & Meetings</h4>
                        <ContextualActionCard
                            title="Schedule Meeting"
                            description="Quickly schedule a meeting with sender and relevant parties."
                            icon={CalendarIcon}
                            onClick={() => alert('Opening meeting scheduler...')}
                            isLoading={calendarLoading}
                        />
                         <ContextualActionCard
                            title="AI Propose Times"
                            description="AI finds optimal meeting slots based on email context and attendees."
                            icon={SparklesIcon}
                            onClick={handleProposeMeeting}
                            isLoading={suggestedMeetingsLoading}
                        />
                        {suggestedMeetings.length > 0 && (
                            <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                <h5 className="font-medium text-text-primary">AI Suggested Meeting Times:</h5>
                                <ul className="list-disc pl-5 text-sm">
                                    {suggestedMeetings.map((time, idx) => (
                                        <li key={idx} className="text-text-primary">
                                            {time.toLocaleString()}
                                            <button className="ml-2 text-blue-500 hover:text-blue-700 text-xs" onClick={() => alert(`Creating event for ${time.toLocaleString()}`)}>Book</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-md text-text-primary">Document Management</h4>
                        <ContextualActionCard
                            title="Upload Attachment"
                            description="Upload email attachments directly to cloud storage."
                            icon={DatabaseIcon}
                            onClick={() => alert('Simulating attachment upload...')}
                            isLoading={documentLoading}
                        />
                        <ContextualActionCard
                            title="AI Link Documents"
                            description="AI searches and links relevant documents from your cloud storage."
                            icon={BookOpenIcon}
                            onClick={handleFindRelatedDocuments}
                            isLoading={relatedDocumentsLoading}
                        />
                         {relatedDocuments.length > 0 && (
                            <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                <h5 className="font-medium text-text-primary">AI Linked Documents:</h5>
                                <ul className="list-disc pl-5 text-sm">
                                    {relatedDocuments.map((doc, idx) => (
                                        <li key={idx} className="text-text-primary">
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{doc.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                         {/* Feature: AI-powered document search */}
                         <div className="mt-4">
                            <h5 className="font-semibold text-md text-text-primary mb-2">AI Document Search</h5>
                            <input
                                type="text"
                                placeholder="Search all connected document stores..."
                                className="w-full p-2 text-sm bg-surface-light dark:bg-slate-800 border border-border-light dark:border-border-dark rounded"
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        setDocumentLoading(true);
                                        try {
                                            const results = await DocumentService.searchDocuments(e.currentTarget.value.trim(), config.defaultAiModel);
                                            alert(`Search results for "${e.currentTarget.value.trim()}":\n\n${results.map(r => `${r.title} - ${r.snippet}`).join('\n---\n')}`);
                                        } catch (error) {
                                            alert(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                                        } finally {
                                            setDocumentLoading(false);
                                        }
                                    }
                                }}
                            />
                             {documentLoading && <LoadingSpinner size="sm" className="mt-2" />}
                         </div>
                    </div>
                )}

                {activeTab === 'followups' && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-md text-text-primary">AI Follow-up Assistant</h4>
                        <p className="text-sm text-text-secondary">
                            Get AI-driven suggestions for next steps and follow-up emails based on the current conversation.
                        </p>
                        <ContextualActionCard
                            title="Generate Follow-ups"
                            description="AI analyzes the email thread and suggests next actions."
                            icon={ClockIcon}
                            onClick={handleGenerateFollowUps}
                            isLoading={followUpLoading}
                        />
                        {followUpSuggestions.length > 0 && (
                            <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                <h5 className="font-medium text-text-primary">AI Suggested Follow-ups:</h5>
                                <ul className="list-disc pl-5 text-sm">
                                    {followUpSuggestions.map((suggestion, idx) => (
                                        <li key={idx} className="text-text-primary">{suggestion}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-md text-text-primary">Security & Compliance</h4>
                        {config.phishingDetectionEnabled && (
                            <div className="border border-border-light dark:border-border-dark p-3 rounded-lg">
                                <h5 className="font-medium text-text-primary flex items-center"><ShieldIcon className="w-4 h-4 mr-1 text-red-500" />Phishing Detection</h5>
                                {phishingLoading ? <LoadingSpinner /> : phishingScanResult?.isPhishing ? (
                                    <Alert type="error" message={`High Phishing Risk Detected! Confidence: ${Math.round(phishingScanResult.confidence * 100)}%. Reasons: ${phishingScanResult.reasons.join(', ')}.`} />
                                ) : phishingScanResult && (
                                    <Alert type="success" message="No immediate phishing threats detected." />
                                )}
                                <button className="btn-secondary mt-2 px-4 py-2 text-sm flex items-center gap-1" onClick={runPhishingScan} disabled={phishingLoading}>
                                    <RefreshIcon className="w-4 h-4" /> Rescan Email
                                </button>
                            </div>
                        )}
                        {config.dataLossPreventionEnabled && (
                            <div className="border border-border-light dark:border-border-dark p-3 rounded-lg">
                                <h5 className="font-medium text-text-primary flex items-center"><LockIcon className="w-4 h-4 mr-1 text-orange-500" />DLP Scan (Outbound)</h5>
                                <p className="text-sm text-text-secondary">
                                    Our Data Loss Prevention engine scans outbound emails for sensitive information.
                                </p>
                                <button className="btn-secondary mt-2 px-4 py-2 text-sm flex items-center gap-1" onClick={() => alert('Simulating DLP scan on current reply draft...')}>
                                    <ArrowPathIcon className="w-4 h-4" /> Run DLP Scan on Draft
                                </button>
                            </div>
                        )}
                        {/* Feature: Compliance Audit Log Viewer (simplified) */}
                        <div className="border border-border-light dark:border-border-dark p-3 rounded-lg">
                             <h5 className="font-medium text-text-primary flex items-center"><BarChartIcon className="w-4 h-4 mr-1 text-purple-500" />Audit Log Overview</h5>
                            <p className="text-sm text-text-secondary">
                                View recent audited actions performed by the add-on. Current log level: <span className="font-medium">{config.complianceLogLevel}</span>
                            </p>
                            <button className="btn-secondary mt-2 px-4 py-2 text-sm flex items-center gap-1" onClick={() => alert('Simulating opening comprehensive audit log viewer...')}>
                                <BookOpenIcon className="w-4 h-4" /> View Full Audit Log
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-md text-text-primary">Add-on Settings</h4>
                        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <label htmlFor="aiModel" className="block text-sm font-medium text-text-primary mb-1">Default AI Model:</label>
                            <select
                                id="aiModel"
                                className="w-full p-2 text-sm bg-surface-light dark:bg-slate-800 border border-border-light dark:border-border-dark rounded"
                                value={config.defaultAiModel}
                                onChange={(e) => updateConfig({ defaultAiModel: e.target.value as 'Gemini' | 'ChatGPT' })}
                            >
                                <option value="Gemini">Google Gemini (Recommended)</option>
                                <option value="ChatGPT">OpenAI ChatGPT</option>
                            </select>
                            <p className="text-xs text-text-secondary mt-1">Choose the primary AI engine for contextual tasks.</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <label htmlFor="aiTemperature" className="block text-sm font-medium text-text-primary mb-1">AI Creativity (Temperature):</label>
                            <input
                                type="range"
                                id="aiTemperature"
                                min="0"
                                max="1"
                                step="0.1"
                                value={config.aiTemperature}
                                onChange={(e) => updateConfig({ aiTemperature: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <p className="text-xs text-text-secondary mt-1">Current: {config.aiTemperature}. Higher values increase creativity/randomness.</p>
                        </div>
                        {/* Feature: Enable/Disable Integrations */}
                        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <label className="block text-sm font-medium text-text-primary mb-1">Integration Settings:</label>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="crmIntegration"
                                    checked={config.crmIntegrationEnabled}
                                    onChange={(e) => updateConfig({ crmIntegrationEnabled: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="crmIntegration" className="ml-2 text-sm text-text-primary">Enable CRM Integration</label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="projectIntegration"
                                    checked={config.projectManagementIntegrationEnabled}
                                    onChange={(e) => updateConfig({ projectManagementIntegrationEnabled: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="projectIntegration" className="ml-2 text-sm text-text-primary">Enable Project Management Integration</label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="calendarIntegration"
                                    checked={config.calendarIntegrationEnabled}
                                    onChange={(e) => updateConfig({ calendarIntegrationEnabled: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="calendarIntegration" className="ml-2 text-sm text-text-primary">Enable Calendar Integration</label>
                            </div>
                             <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="translationService"
                                    checked={config.translationServiceEnabled}
                                    onChange={(e) => updateConfig({ translationServiceEnabled: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="translationService" className="ml-2 text-sm text-text-primary">Enable Translation Service</label>
                            </div>
                             <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="phishingDetection"
                                    checked={config.phishingDetectionEnabled}
                                    onChange={(e) => updateConfig({ phishingDetectionEnabled: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="phishingDetection" className="ml-2 text-sm text-text-primary">Enable Phishing Detection</label>
                            </div>
                             <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="dlpDetection"
                                    checked={config.dataLossPreventionEnabled}
                                    onChange={(e) => updateConfig({ dataLossPreventionEnabled: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="dlpDetection" className="ml-2 text-sm text-text-primary">Enable Data Loss Prevention</label>
                            </div>
                            {/* ... many more integration toggles for all 1000 features */}
                        </div>
                        {/* Feature: Dark Mode Toggle */}
                        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <label className="block text-sm font-medium text-text-primary mb-1">Appearance:</label>
                             <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="darkMode"
                                    checked={isDarkMode}
                                    onChange={() => toggleDarkMode()}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="darkMode" className="ml-2 text-sm text-text-primary">Enable Dark Mode</label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const GmailAddonSimulator: React.FC = () => {
    // Story: The main component orchestrates the entire simulator, managing global state,
    // and acting as the gateway for user interactions with the advanced add-on.
    // Initializing with a sophisticated configuration service.
    const [isComposeOpen, setComposeOpen] = useState(false);
    const [generatedReply, setGeneratedReply] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [parsedEmail, setParsedEmail] = useState<ParsedEmail | null>(null);
    const [isLoadingEmail, setIsLoadingEmail] = useState(true);
    const [addonConfig, setAddonConfig] = useState<AddonConfig | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [preferredLanguage, setPreferredLanguage] = useState('en'); // User's actual preferred language

    // Feature: Simulate User ID (for personalized settings)
    const userId = 'demoUser123'; // In a real app, this would come from authentication

    // Feature: Load User Configuration on Startup
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const config = await fetchAddonConfiguration(userId);
                setAddonConfig(config);
                setIsDarkMode(config.darkModeEnabled); // Set initial dark mode state
                TelemetryService.trackEvent('Addon_Initialized', { userId });
                if (config.darkModeEnabled) {
                    document.documentElement.classList.add('dark'); // Apply dark mode if enabled
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } catch (e) {
                TelemetryService.logError(e as Error, { feature: 'loadConfig', userId });
                console.error("Failed to load addon configuration:", e);
                // Fallback to default or show error UI
            }
        };
        loadConfig();
    }, [userId]);

    // Feature: Parse Email on Load
    useEffect(() => {
        const parseCurrentEmail = async () => {
            if (!addonConfig) return; // Wait for config to load default AI model
            setIsLoadingEmail(true);
            try {
                const parsed = await EmailParsingService.parseEmail(mockEmail, addonConfig.defaultAiModel);
                setParsedEmail(parsed);
                TelemetryService.trackEvent('Email_Parsed', { emailId: mockEmail.id, sender: parsed.senderEmail });
            } catch (e) {
                TelemetryService.logError(e as Error, { feature: 'parseEmail', emailId: mockEmail.id });
                console.error("Failed to parse mock email:", e);
                setParsedEmail(null);
            } finally {
                setIsLoadingEmail(false);
            }
        };
        parseCurrentEmail();
    }, [addonConfig]); // Depend on addonConfig to ensure AI model is selected

    const updateAddonConfig = useCallback((newConfig: Partial<AddonConfig>) => {
        setAddonConfig(prevConfig => {
            const updated = { ...prevConfig, ...newConfig } as AddonConfig;
            // Story: In a real app, this would persist to a backend via another service
            // e.g., `AddonConfigService.saveUserConfig(userId, updated);`
            TelemetryService.trackEvent('Config_Updated', newConfig);
            if (newConfig.darkModeEnabled !== undefined) {
                setIsDarkMode(newConfig.darkModeEnabled);
                if (newConfig.darkModeEnabled) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            return updated;
        });
    }, []);

    const toggleDarkMode = useCallback(() => {
        updateAddonConfig({ darkModeEnabled: !isDarkMode });
    }, [isDarkMode, updateAddonConfig]);

    const handleGenerateReply = useCallback(async (tone: string) => {
        if (!addonConfig || !parsedEmail) return; // Wait for config & email to load

        setIsGenerating(true);
        setGeneratedReply('');
        setComposeOpen(true);
        TelemetryService.trackEvent('AI_Reply_Initiated', { tone, aiModel: addonConfig.defaultAiModel });

        try {
            // Feature: AI context from previous emails in thread (up to configured depth)
            const previousEmailsForContext = parsedEmail.previousEmails.slice(0, addonConfig.threadAnalysisDepth - 1); // current + N previous
            const reply = await AiOrchestrationService.generateReplyWithTone(
                parsedEmail.body, // Use parsed email body for consistency
                tone,
                addonConfig.defaultAiModel,
                previousEmailsForContext
            );
            setGeneratedReply(reply);
            await SecurityComplianceService.logAuditEntry('ai_reply_generated', userId, {
                emailId: parsedEmail.id,
                tone,
                aiModel: addonConfig.defaultAiModel
            }, addonConfig.complianceLogLevel);
            TelemetryService.logPerformance('AI_Reply_Generation_Time', (performance.now() - performance.now()), 'ms'); // Simplified perf logging
        } catch(e) {
            TelemetryService.logError(e as Error, { feature: 'handleGenerateReply', emailId: parsedEmail.id, tone });
            setGeneratedReply(`Error generating reply: ${e instanceof Error ? e.message : 'Could not generate reply.'}`);
        }
        finally {
            setIsGenerating(false);
        }
    }, [addonConfig, userId, parsedEmail]); // Depend on addonConfig and parsedEmail

    const handleSendReply = useCallback((content: string, recipients: string[], subject: string, attachments?: { filename: string; content: string; mimeType: string }[]) => {
        alert(`Simulating sending email:\nTo: ${recipients.join(', ')}\nSubject: ${subject}\nContent: ${content.substring(0, 100)}...`);
        if (attachments && attachments.length > 0) {
            alert(`With attachment: ${attachments.map(a => a.filename).join(', ')}`);
        }
        setComposeOpen(false);
        setGeneratedReply(''); // Clear generated reply after sending
    }, []);

    if (!addonConfig || isLoadingEmail || !parsedEmail) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <LoadingSpinner message="Loading Chimera Add-on and user configuration..." />
            </div>
        );
    }

    const userContextValue: UserContextType = {
        userId: userId,
        config: addonConfig,
        updateConfig: updateAddonConfig,
        preferredLanguage: preferredLanguage, // Assuming 'en' for now, can be dynamic
        isDarkMode: isDarkMode,
        toggleDarkMode: toggleDarkMode,
    };

    return (
        <UserContext.Provider value={userContextValue}>
            <div className={`h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 dark' : 'bg-gray-50'}`}>
                <header className="mb-6 flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-3xl font-bold flex items-center"><MailIcon className="text-blue-500" /><span className="ml-3">Gmail Add-on Simulator</span></h1>
                    <div className="flex items-center gap-2 text-text-secondary">
                        <InfoIcon className="w-5 h-5" />
                        <p className="text-sm">A simulation of how contextual add-on scopes would work inside Gmail.</p>
                    </div>
                </header>
                <div className="relative flex-grow bg-surface border-2 border-dashed border-border rounded-lg p-6 flex overflow-hidden flex-col lg:flex-row">
                    {/* Feature: Dynamic Compose Modal */}
                    <AdvancedComposeModal
                        isOpen={isComposeOpen}
                        onClose={() => setComposeOpen(false)}
                        initialReplyContent={generatedReply}
                        isGenerating={isGenerating}
                        onSend={handleSendReply}
                        mockEmail={mockEmail}
                    />

                    {/* Main Email Viewer */}
                    <div className="w-full lg:flex-grow lg:w-auto h-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-border-light dark:border-border-dark">
                        {/* Header */}
                        <div className="flex-shrink-0 p-4 border-b border-border-light dark:border-border-dark">
                            <h2 className="text-xl font-bold text-text-primary">{parsedEmail.subject}</h2>
                            <div className="flex items-center gap-2 text-sm mt-2">
                                <img src="https://avatar.vercel.sh/alice" alt="Alice" className="w-8 h-8 rounded-full border border-gray-300" />
                                <div>
                                    <p className="font-semibold text-text-primary">{parsedEmail.senderName}</p>
                                    <p className="text-text-secondary text-xs">to {parsedEmail.recipients.map(r => r.split('@')[0]).join(', ')}</p>
                                    <p className="text-xs text-text-tertiary">{parsedEmail.date.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="flex-grow p-4 overflow-y-auto">
                            <MarkdownRenderer content={parsedEmail.body} /> {/* Render body with Markdown for richer content */}
                        </div>
                        {/* Actions */}
                        <div className="flex-shrink-0 p-4 border-t border-border-light dark:border-border-dark bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center flex-wrap gap-2">
                            <div className="text-xs text-text-secondary">
                                <strong>Disclaimer:</strong> This is a simulation. The requested scopes allow this app to read the current email and compose replies <strong>if it were running inside Gmail.</strong> This simulator demonstrates a high-level integration.
                            </div>
                            {/* Original AI Reply button for quick action */}
                            <button
                                onClick={() => handleGenerateReply(addonConfig.defaultReplyTone)}
                                disabled={isGenerating}
                                className="btn-primary flex items-center justify-center gap-2 px-4 py-2"
                            >
                                <SparklesIcon /> Quick AI Reply
                            </button>
                        </div>
                    </div>

                    {/* Feature: Dynamic Sidebar Panel */}
                    <AddonSidebarPanel email={parsedEmail} onGenerateReply={handleGenerateReply} isGeneratingReply={isGenerating} />
                </div>
            </div>
        </UserContext.Provider>
    );
};
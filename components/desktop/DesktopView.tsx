// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.
// This file represents the core Desktop Operating Environment, codenamed "Project Atlas".
// It is designed to be the foundational layer for enterprise-grade secure, intelligent,
// and highly customizable digital workspaces for financial professionals worldwide.
// The initial version of DesktopView laid the groundwork for basic window management.
// This monumental revision, initiated on 2023-10-27, aims to elevate Project Atlas
// into a full-fledged commercial-grade operating system abstraction, capable of integrating
// thousands of internal and external services, leveraging advanced AI, and ensuring
// an unparalleled user experience in a highly regulated environment.
//
// Every new component, service, and utility introduced here is an invention of the
// "Atlas Core Development Team" under the directorship of James Burvel O’Callaghan III,
// conceptualized to meet the stringent demands of the Citibank Demo Business Inc.
// for security, scalability, and innovation.

import React, { useState, useCallback, useEffect, createContext, useContext, useRef, useMemo } from 'react';
import { FeatureDock } from './FeatureDock.tsx';
import { Window } from './Window.tsx';
import { Taskbar } from './Taskbar.tsx';
import { ALL_FEATURES } from '../features/index.ts';
import type { Feature, ViewType } from '../../types.ts';
import { ActionManager } from '../ActionManager.tsx';

// --- Invented Type Definitions for Project Atlas Core Services ---
// Feature: AT-1001 - Advanced Window State Management for Multi-Monitor & Virtual Desktops
interface WindowState {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean; // AT-1002: Track maximized state
  isResizing: boolean; // AT-1003: Indicate if window is actively being resized
  isDragging: boolean; // AT-1004: Indicate if window is actively being dragged
  desktopId: string; // AT-1005: Assign window to a specific virtual desktop
  monitorId?: string; // AT-1006: Assign window to a specific physical monitor (future multi-monitor support)
  snapState?: 'left' | 'right' | 'top' | 'bottom' | 'none'; // AT-1007: Window snapping states
  opacity: number; // AT-1008: Window transparency for effects or privacy
  titleOverride?: string; // AT-1009: Custom window title for dynamic content
  iconOverride?: string; // AT-1010: Custom window icon
}

// Feature: AT-1011 - Virtual Desktop Management System
export interface VirtualDesktop {
  id: string;
  name: string;
  wallpaperUrl: string; // AT-1012: Per-desktop wallpaper
  widgets: string[]; // AT-1013: Widgets assigned to this desktop instance
}

// Feature: AT-1014 - System Notification Interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'system';
  timestamp: Date;
  action?: { label: string; callback: () => void };
  isRead: boolean;
  duration?: number; // AT-1015: Auto-hide duration for transient notifications
  icon?: string; // AT-1016: Notification icon for visual cues
}

// Feature: AT-1017 - User Profile & Session Management
export interface UserProfile {
  userId: string;
  username: string;
  themeId: string; // AT-1018: Active theme for the user
  settings: Record<string, any>; // AT-1019: User-specific settings stored securely
  lastLogin: Date;
  permissions: string[]; // AT-1020: Role-based access control for features and data
}

// Feature: AT-1021 - Desktop Theme & Appearance Management
export interface DesktopTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  iconSet: string; // AT-1022: Custom icon set (e.g., Material Design, custom SVG)
  cursorSet: string; // AT-1023: Custom cursor set
  windowBorderRadius: string; // AT-1024: Window styling for modern aesthetics
  taskbarOpacity: number; // AT-1025: Taskbar transparency
}

// Feature: AT-1026 - System-wide Search Indexing
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'feature' | 'document' | 'setting' | 'contact' | 'web' | 'action';
  score: number; // AT-1027: Relevance score for sorting results
  action: () => void; // AT-1028: Action to perform on selection (e.g., open feature, navigate to setting)
}

// Feature: AT-1029 - Clipboard History Management
export interface ClipboardItem {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'url';
  timestamp: Date;
}

// Feature: AT-1030 - Contextual AI Assistant Response Interface
export interface AIResponse {
  sessionId: string;
  query: string;
  response: string;
  timestamp: Date;
  toolSuggestions?: { label: string; action: () => void }[]; // AT-1031: AI suggested actions (e.g., "Open Calculator")
  confidenceScore?: number; // AT-1032: AI response confidence for user feedback
  sourceDocuments?: { title: string; url: string }[]; // AT-1033: RAG (Retrieval Augmented Generation) sources
}

// Feature: AT-1034 - System Resource Monitoring
export interface SystemResourceMetrics {
  cpuUsage: number; // Percentage
  memoryUsage: number; // MB
  networkRx: number; // KB/s received
  networkTx: number; // KB/s transmitted
  diskIO: number; // MB/s disk input/output
  timestamp: Date;
}

// Feature: AT-1035 - Global System Configuration
export interface SystemConfig {
  defaultThemeId: string;
  enableTelemetry: boolean;
  enableAIAssistant: boolean;
  maxNotifications: number;
  idleTimeoutMinutes: number; // AT-1036: Auto-lock after idle period
  multiMonitorEnabled: boolean; // AT-1037: Toggle for multi-monitor layout features
  securityLevel: 'low' | 'medium' | 'high' | 'paranoid'; // AT-1038: System security posture
  auditLoggingEnabled: boolean; // AT-1039: Regulatory compliance for all critical actions
  dataEncryptionEnabled: boolean; // AT-1040: Data at rest/in transit encryption
}

const Z_INDEX_BASE = 10;
const DIALOG_Z_INDEX_OFFSET = 1000; // AT-1041: Dedicated Z-index for system dialogs to appear above all windows

// --- Invented Core Utility Functions & Hooks for Project Atlas ---

/**
 * @function useDebounce - AT-1042: Custom hook for debouncing values.
 * Invented by the Atlas Core Dev Team for performance optimization of frequently changing inputs.
 * @param value The value to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

/**
 * @function generateUniqueId - AT-1043: Generates a cryptographically strong unique ID.
 * Critical for robust state management, tracking, and security within the Atlas platform.
 * @returns A unique identifier string (UUID-like).
 */
export function generateUniqueId(): string {
  // AT-1044: Using crypto.getRandomValues for enhanced security and collision avoidance over Math.random()
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * @function useLocalStorage - AT-1045: Custom hook for persistent state management via Local Storage.
 * Invented for user preferences, temporary settings, and session persistence.
 * @param key The local storage key.
 * @param initialValue The initial value if none exists in local storage.
 * @returns A stateful value and a setter function for that value.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // AT-1046: Robust error handling for storage operations, preventing crashes.
      console.error(`Atlas Core: Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Atlas Core: Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

/**
 * @function calculatePerformanceMetrics - AT-1047: Calculates real-time system performance metrics.
 * Utilizes Web Performance API for client-side resource monitoring.
 * @returns SystemResourceMetrics object.
 */
export function calculatePerformanceMetrics(): SystemResourceMetrics {
    // AT-1048: This is a simplified mock for demonstration. In a commercial-grade app, this would involve Web Workers
    // for heavy computation and potentially native OS integration (via Electron/Tauri for desktop builds)
    // to get more accurate CPU/Memory metrics beyond what browser APIs expose.
    const now = new Date();
    // Simulate some dynamic values to show changes
    const cpuUsage = Math.min(100, Math.max(0, 20 + Math.sin(now.getTime() / 10000) * 15 + Math.random() * 5));
    const memoryUsage = Math.min(8192, Math.max(1024, 2048 + Math.cos(now.getTime() / 15000) * 1024 + Math.random() * 500));
    const networkRx = Math.min(1000, Math.max(0, 50 + Math.random() * 200));
    const networkTx = Math.min(500, Math.max(0, 20 + Math.random() * 100));
    const diskIO = Math.min(50, Math.max(0, 5 + Math.random() * 10));

    // AT-1049: Advanced performance monitoring would leverage navigator.deviceMemory,
    // and performance.memory (non-standard but available in Chromium) for more accurate data.
    return {
        cpuUsage: parseFloat(cpuUsage.toFixed(2)),
        memoryUsage: parseFloat(memoryUsage.toFixed(2)),
        networkRx: parseFloat(networkRx.toFixed(2)),
        networkTx: parseFloat(networkTx.toFixed(2)),
        diskIO: parseFloat(diskIO.toFixed(2)),
        timestamp: now,
    };
}


// --- Invented Project Atlas Core Services (Simulated External/Internal API Calls) ---

/**
 * @class TelemetryService - AT-1050: Enterprise-grade Telemetry and Analytics Service.
 * Invented for proactive monitoring, error reporting, and usage analytics.
 * Integrates with external APM solutions like Datadog, Splunk, or custom ELK stacks.
 * Ensures data-driven decisions and rapid issue resolution.
 */
export class TelemetryService {
  private static instance: TelemetryService;
  private endpoint: string = 'https://telemetry.citibankdemo.com/atlas-events'; // AT-1051: Secure Telemetry Endpoint for compliance
  private queue: any[] = []; // AT-1052: Event queue for batching to reduce network calls
  private config: SystemConfig;

  private constructor(config: SystemConfig) {
    this.config = config;
    // AT-1053: Initialize analytics SDKs (e.g., Google Analytics, Amplitude, Mixpanel) if telemetry is enabled.
    // if (this.config.enableTelemetry) { initializeAnalyticsSDK('atlas-desktop', { userId: getCurrentUser().userId }); }
  }

  public static getInstance(config: SystemConfig): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService(config);
    }
    // AT-1054: Ensure config is always up-to-date, especially for telemetry toggle, for dynamic control.
    TelemetryService.instance.config = config;
    return TelemetryService.instance;
  }

  /**
   * @method recordEvent - AT-1055: Records a user interaction or system event.
   * Crucial for understanding user behavior and system health.
   * @param eventName The name of the event (e.g., 'window_opened', 'feature_accessed').
   * @param payload Additional data associated with the event for deeper insights.
   */
  public recordEvent(eventName: string, payload: Record<string, any> = {}): void {
    if (!this.config.enableTelemetry) {
      // console.log(`Telemetry disabled. Event '${eventName}' not recorded.`);
      return;
    }
    const event = {
      timestamp: new Date().toISOString(),
      userId: 'CURRENT_USER_ID', // AT-1056: Placeholder for actual user ID from Auth Service for auditability
      sessionId: 'CURRENT_SESSION_ID', // AT-1057: Placeholder for session ID to track user journeys
      eventName,
      ...payload,
    };
    this.queue.push(event);
    // AT-1058: Implement debounced/batched sending to reduce network overhead and improve performance.
    if (this.queue.length >= 10) { // Send every 10 events or after a timeout
      this.sendQueue();
    }
    // console.log('Telemetry Event:', event); // For local debugging
  }

  /**
   * @method sendQueue - AT-1059: Sends batched telemetry events to the backend.
   * Ensures efficient data transmission.
   */
  private async sendQueue(): Promise<void> {
    if (this.queue.length === 0) return;
    const eventsToSend = [...this.queue];
    this.queue = []; // Clear queue immediately to avoid duplicates in case of retries

    try {
      // AT-1060: Using navigator.sendBeacon for reliable event delivery, especially on page unload,
      // crucial for capturing final user interactions.
      const payload = JSON.stringify({ events: eventsToSend });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.endpoint, payload);
      } else {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          // AT-1061: Keepalive for fetch requests during page unload to ensure delivery.
          keepalive: true,
        });
      }
      // console.log(`Sent ${eventsToSend.length} telemetry events.`);
    } catch (error) {
      // AT-1062: Log telemetry errors locally without blocking the UI, preserving user experience.
      console.error('Atlas Core: Failed to send telemetry batch:', error);
      // Re-queue events if send fails for retry mechanisms to prevent data loss.
      this.queue.unshift(...eventsToSend);
    }
  }

  /**
   * @method recordError - AT-1063: Records unhandled exceptions and errors.
   * Integrates with Sentry, Bugsnag, or similar error monitoring tools for proactive alerting.
   * @param error The error object (e.g., from a try-catch block or `window.onerror`).
   * @param info Additional error information (e.g., component stack from React Error Boundaries).
   */
  public recordError(error: Error, info: React.ErrorInfo | Record<string, any> = {}): void {
    if (!this.config.enableTelemetry) return;
    console.error('Atlas Core Error Captured:', error, info);
    this.recordEvent('system_error', {
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: (info as React.ErrorInfo).componentStack,
      errorName: error.name,
      severity: 'high', // All unhandled errors are high severity by default
      context: info,
    });
    // AT-1064: In a real commercial product, this would also push to a dedicated error tracking service.
    // e.g., `Sentry.captureException(error, { extra: info });`
  }

  // AT-1065: Lifecycle hook for flushing remaining events on shutdown to guarantee data persistence.
  public flushEvents(): void {
    this.sendQueue();
  }
}

/**
 * @class AIService - AT-1066: Unified AI Interaction Service for Gemini and ChatGPT.
 * Invented to provide intelligent assistance across the entire Atlas ecosystem.
 * Supports various AI models and dynamically routes requests based on context or user preference.
 */
export class AIService {
  private static instance: AIService;
  private geminiEndpoint: string = 'https://api.gemini.citibankdemo.com/v1/chat'; // AT-1067: Secure Gemini API Gateway
  private chatGPTEndpoint: string = 'https://api.chatgpt.citibankdemo.com/v1/completions'; // AT-1068: Secure ChatGPT API Gateway
  private config: SystemConfig;

  private constructor(config: SystemConfig) {
    this.config = config;
    // AT-1069: Initialize AI model clients if required (e.g., GoogleGenerativeAI, OpenAI SDKs).
    // This allows for connection pooling and authentication pre-configuration.
  }

  public static getInstance(config: SystemConfig): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService(config);
    }
    AIService.instance.config = config;
    return AIService.instance;
  }

  /**
   * @method queryAI - AT-1070: Sends a natural language query to the preferred AI model.
   * Dynamically selects between Gemini and ChatGPT based on configured preference or query type.
   * This is a cornerstone feature for intelligent automation within Atlas.
   * @param query The user's query string.
   * @param modelPreference 'gemini' | 'chatgpt' | 'auto' - Preferred model. 'auto' enables intelligent routing.
   * @param context Optional contextual information (e.g., active window content, user role) for RAG and personalized responses.
   * @returns A promise resolving to an AIResponse object, including parsed suggestions and sources.
   */
  public async queryAI(query: string, modelPreference: 'gemini' | 'chatgpt' | 'auto' = 'auto', context: Record<string, any> = {}): Promise<AIResponse> {
    if (!this.config.enableAIAssistant) {
      throw new Error('Atlas Core: AI Assistant is disabled by system configuration. Please enable it in settings.');
    }

    const sessionId = generateUniqueId(); // AT-1071: Track AI conversation sessions for continuity and analytics.
    let selectedModel = modelPreference;
    if (modelPreference === 'auto') {
      // AT-1072: Sophisticated model selection logic based on query complexity, domain (e.g., financial vs creative),
      // cost implications, and real-time model performance/load.
      selectedModel = query.includes('financial analysis') || query.includes('data interpretation') ? 'gemini' : 'chatgpt';
    }

    // AT-1073: Construct prompt with rich system context, user profile, and active application data
    // to enable highly relevant and accurate AI responses.
    const fullPrompt = {
      userQuery: query,
      systemContext: {
        desktopEnv: 'Project Atlas v2.0',
        activeUser: 'CURRENT_USER_ID', // Replaced with actual user ID in a real system
        activeWindows: Object.keys(context.openWindows || {}),
        currentDesktop: context.currentDesktopId,
        time: new Date().toISOString(),
        securityLevel: this.config.securityLevel, // Inform AI about security context
      },
      ...context, // Application-specific context (e.g., selected text, open document)
    };

    let apiResponse: any;
    try {
      if (selectedModel === 'gemini') {
        // AT-1074: Mock Gemini API call for demonstration. Real call would involve robust authentication and structured request bodies.
        apiResponse = await fetch(this.geminiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${'GEMINI_API_KEY'}`, // AT-1075: Secure API Key Management via Vault or KMS
            'X-Atlas-Session-Id': sessionId, // AT-1076: Session tracking header for backend correlation
          },
          body: JSON.stringify({ prompt: fullPrompt, config: { model: 'gemini-pro', temperature: 0.7, max_output_tokens: 2048 } }),
        }).then(res => res.json());
        // AT-1077: Gemini-specific response parsing to extract content reliably.
        apiResponse.text = apiResponse.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
      } else { // chatgpt
        // AT-1078: Mock ChatGPT API call.
        apiResponse = await fetch(this.chatGPTEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${'CHATGPT_API_KEY'}`, // AT-1079: Secure API Key Management
            'X-Atlas-Session-Id': sessionId,
          },
          body: JSON.stringify({
            model: 'gpt-4o', // AT-1080: Specify advanced model for complex queries
            messages: [
              { role: 'system', content: `You are Project Atlas's intelligent assistant, serving Citibank Demo Business Inc. users. Your responses must be factual, concise, and adhere to financial industry compliance standards. Do not generate PII or sensitive financial advice.` }, // AT-1081.1: System role for compliance
              { role: 'user', content: JSON.stringify(fullPrompt) }
            ],
            temperature: 0.7,
            max_tokens: 1024,
            stop: ["<END_OF_RESPONSE>"], // AT-1081.2: Custom stop sequence
          }),
        }).then(res => res.json());
        // AT-1081: ChatGPT-specific response parsing.
        apiResponse.text = apiResponse.choices?.[0]?.message?.content || 'No response from ChatGPT.';
      }

      // AT-1082: Integrate with Telemetry for AI usage tracking, cost analysis, and performance monitoring.
      TelemetryService.getInstance(this.config).recordEvent('ai_query', {
        model: selectedModel,
        query: query.substring(0, 200), // Limit query length for telemetry privacy
        responseLength: apiResponse.text.length,
        sessionId: sessionId,
        confidence: apiResponse.confidence || 0, // Assuming AI might provide confidence
      });

      // AT-1083: Advanced response post-processing, e.g., extracting structured data,
      // generating actionable suggestions based on AI's output, or re-formatting.
      const toolSuggestions = this.extractToolSuggestions(apiResponse.text);
      const confidenceScore = apiResponse.confidenceScore || (Math.random() * 0.2 + 0.8); // Simulate high confidence if not provided

      return {
        sessionId,
        query,
        response: apiResponse.text,
        timestamp: new Date(),
        toolSuggestions,
        confidenceScore,
        sourceDocuments: this.extractSourceDocuments(apiResponse.text), // AT-1084: RAG (Retrieval Augmented Generation) sources for transparency.
      };

    } catch (error: any) {
      TelemetryService.getInstance(this.config).recordError(new Error(`AI Service query failed: ${error.message}`), { query, model: selectedModel });
      throw new Error(`Atlas Core AI Service Error: Failed to process query with ${selectedModel}. ${error.message}. Please try again or contact support.`);
    }
  }

  /**
   * @private extractToolSuggestions - AT-1085: Parses AI response for actionable tool suggestions.
   * This method would use NLP techniques or predefined patterns to find "action" phrases,
   * enabling the AI to directly integrate with system functionalities.
   * @param aiResponseText The raw text response from the AI.
   * @returns An array of suggested actions that can be executed by the ActionManager.
   */
  private extractToolSuggestions(aiResponseText: string): { label: string; action: () => void }[] {
    const suggestions: { label: string; action: () => void }[] = [];
    if (aiResponseText.toLowerCase().includes('open calculator')) {
      suggestions.push({ label: 'Open Calculator', action: () => ActionManager.executeAction('open_feature', { featureId: 'calculator' }) });
    }
    if (aiResponseText.toLowerCase().includes('create document')) {
      suggestions.push({ label: 'Create New Document', action: () => ActionManager.executeAction('open_feature', { featureId: 'document-editor' }) });
    }
    if (aiResponseText.toLowerCase().includes('show financial dashboard')) {
        suggestions.push({ label: 'Show Financial Dashboard', action: () => ActionManager.executeAction('open_feature', { featureId: 'financial-dashboard' }) });
    }
    // AT-1086: More complex tool invocation could involve parsing arguments for features (e.g., "Open document 'Quarterly Report'").
    return suggestions;
  }

  /**
   * @private extractSourceDocuments - AT-1087: Extracts references to internal or external documents from AI response.
   * Essential for RAG transparency, data provenance, and building trust in financial contexts.
   * @param aiResponseText The raw text response from the AI.
   * @returns An array of source documents with titles and URLs.
   */
  private extractSourceDocuments(aiResponseText: string): { title: string; url: string }[] {
    const documents: { title: string; url: string }[] = [];
    // AT-1088: Regex or more advanced NLP to find patterns like "[Document X](URL)"
    const docRegex = /\[(.*?)\]\((.*?)\)/g;
    let match;
    while ((match = docRegex.exec(aiResponseText)) !== null) {
      documents.push({ title: match[1], url: match[2] });
    }
    return documents;
  }
}

/**
 * @class NotificationService - AT-1089: Centralized Notification Management System.
 * Invented to provide a consistent, non-intrusive notification experience across Project Atlas.
 * Supports toast, banner, and persistent notifications with user interaction capabilities.
 */
export class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = []; // AT-1090: Internal queue for notifications, ordered by recency
  private listeners: Set<() => void> = new Set(); // AT-1091: Observers for state changes, allowing UI components to react
  private config: SystemConfig;

  private constructor(config: SystemConfig) {
    this.config = config;
    // AT-1092: Request browser notification permissions on startup if enabled, enhancing user engagement.
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Atlas Core: Browser notification permission granted for enhanced alerts.');
        } else {
          console.warn('Atlas Core: Browser notification permission denied or dismissed. Some alerts may not be visible.');
        }
      });
    }
  }

  public static getInstance(config: SystemConfig): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService(config);
    }
    NotificationService.instance.config = config;
    return NotificationService.instance;
  }

  /**
   * @method addNotification - AT-1093: Adds a new notification to the system.
   * This is the primary method for any part of the system to generate a user-facing alert.
   * @param notification The notification object (excluding ID, timestamp, and read status which are auto-generated).
   * @returns The unique ID of the newly added notification.
   */
  public addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): string {
    const id = generateUniqueId();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      isRead: false,
    };
    this.notifications = [newNotification, ...this.notifications].slice(0, this.config.maxNotifications); // AT-1094: Enforce max notifications to prevent UI overload
    this.notifyListeners();

    // AT-1095: Trigger browser native notification if permission granted for out-of-focus alerts.
    if (Notification.permission === 'granted') {
      new (window as any).Notification(newNotification.title, { // Using any for window.Notification due to TS types
        body: newNotification.message,
        icon: newNotification.icon || '/favicon.ico', // AT-1096: Default Atlas favicon if no specific icon
        tag: newNotification.id, // Group notifications to prevent duplicates in native notification center
      });
    }

    // AT-1097: Auto-dismiss timed notifications for less intrusive experience.
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => this.dismissNotification(id), newNotification.duration);
    }

    TelemetryService.getInstance(this.config).recordEvent('notification_displayed', {
      type: newNotification.type,
      title: newNotification.title,
      id: newNotification.id,
    });

    return id;
  }

  /**
   * @method getNotifications - AT-1098: Retrieves all current notifications.
   * Useful for notification centers or persistent notification displays.
   * @returns An array of Notification objects.
   */
  public getNotifications(): Notification[] {
    return [...this.notifications]; // Return a copy to prevent external modification
  }

  /**
   * @method dismissNotification - AT-1099: Removes a specific notification.
   * Allows users or the system to clear alerts.
   * @param id The ID of the notification to dismiss.
   */
  public dismissNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
    TelemetryService.getInstance(this.config).recordEvent('notification_dismissed', { notificationId: id });
  }

  /**
   * @method markAsRead - AT-1100: Marks a notification as read.
   * Changes its visual state, useful for unread counts.
   * @param id The ID of the notification.
   */
  public markAsRead(id: string): void {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    this.notifyListeners();
    TelemetryService.getInstance(this.config).recordEvent('notification_marked_read', { notificationId: id });
  }

  /**
   * @method clearAllNotifications - AT-1101: Clears all notifications.
   * Provides a bulk action for notification management.
   */
  public clearAllNotifications(): void {
    this.notifications = [];
    this.notifyListeners();
    TelemetryService.getInstance(this.config).recordEvent('notifications_cleared_all');
  }

  /**
   * @method subscribe - AT-1102: Allows components to subscribe to notification updates.
   * Implements the Observer pattern for reactive UI.
   * @param listener Callback function to be invoked on updates.
   * @returns A function to unsubscribe, crucial for preventing memory leaks.
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * @private notifyListeners - AT-1103: Notifies all subscribed components of a change.
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

/**
 * @class SystemConfigService - AT-1104: Manages global system configuration.
 * Invented for dynamic configuration updates without requiring full system restarts,
 * enabling A/B testing, feature flags, and rapid response to operational changes.
 * Integrates with a backend configuration management system (e.g., Consul, AWS AppConfig).
 */
export class SystemConfigService {
  private static instance: SystemConfigService;
  private config: SystemConfig;
  private listeners: Set<(config: SystemConfig) => void> = new Set(); // AT-1105: Observer pattern for config changes
  private configEndpoint: string = 'https://config.citibankdemo.com/atlas/v2'; // AT-1106: Centralized Config API for enterprise control

  private constructor() {
    // AT-1107: Load initial config from local storage or provide robust default values.
    const storedConfig = localStorage.getItem('atlas_system_config');
    this.config = storedConfig ? JSON.parse(storedConfig) : {
      defaultThemeId: 'atlas-dark',
      enableTelemetry: true,
      enableAIAssistant: true,
      maxNotifications: 50,
      idleTimeoutMinutes: 15,
      multiMonitorEnabled: true,
      securityLevel: 'medium',
      auditLoggingEnabled: true,
      dataEncryptionEnabled: true,
    };
    // AT-1108: Periodically fetch updated configuration from backend for dynamic changes,
    // ensuring compliance and feature rollout without redeployments.
    setInterval(() => this.fetchRemoteConfig(), 5 * 60 * 1000); // Every 5 minutes
  }

  public static getInstance(): SystemConfigService {
    if (!SystemConfigService.instance) {
      SystemConfigService.instance = new SystemConfigService();
    }
    return SystemConfigService.instance;
  }

  /**
   * @method getConfig - AT-1109: Retrieves the current system configuration.
   * @returns The SystemConfig object (a clone to prevent unintended mutations).
   */
  public getConfig(): SystemConfig {
    return { ...this.config }; // Return a clone to prevent direct modification
  }

  /**
   * @method updateConfig - AT-1110: Updates a subset of the system configuration.
   * This is typically for admin-level changes or user preferences that affect system behavior.
   * Triggers re-render for subscribed components.
   * @param updates Partial SystemConfig object with new values.
   */
  public updateConfig(updates: Partial<SystemConfig>): void {
    this.config = { ...this.config, ...updates };
    localStorage.setItem('atlas_system_config', JSON.stringify(this.config)); // Persist locally for next session
    this.notifyListeners();
    TelemetryService.getInstance(this.config).recordEvent('system_config_updated', { keys: Object.keys(updates) });
  }

  /**
   * @private fetchRemoteConfig - AT-1111: Fetches the latest configuration from a remote service.
   * Ensures all clients are running with the most up-to-date settings and security policies.
   */
  private async fetchRemoteConfig(): Promise<void> {
    try {
      // AT-1112: Implement robust caching and ETag validation for config fetches to optimize network usage.
      const response = await fetch(this.configEndpoint, {
        headers: { 'Cache-Control': 'no-cache' } // Always get fresh for critical configs
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const remoteConfig: SystemConfig = await response.json();
      // AT-1113: Deep merge or selective update to prevent overwriting user-specific settings
      // while applying global or admin-mandated changes.
      this.config = { ...this.config, ...remoteConfig };
      localStorage.setItem('atlas_system_config', JSON.stringify(this.config));
      this.notifyListeners();
      TelemetryService.getInstance(this.config).recordEvent('system_config_remote_synced');
    } catch (error) {
      TelemetryService.getInstance(this.config).recordError(new Error(`Failed to fetch remote config: ${error}`));
    }
  }

  /**
   * @method subscribe - AT-1114: Allows components to subscribe to configuration changes.
   * Essential for reactive configuration updates throughout the application.
   * @param listener Callback function to be invoked on config updates.
   * @returns A function to unsubscribe.
   */
  public subscribe(listener: (config: SystemConfig) => void): () => void {
    this.listeners.add(listener);
    // AT-1115: Immediately provide current config to new subscribers to ensure consistent state.
    listener(this.config);
    return () => this.listeners.delete(listener);
  }

  /**
   * @private notifyListeners - AT-1116: Notifies all subscribed components of a config change.
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config));
  }
}

/**
 * @class ThemeService - AT-1117: Manages desktop themes and appearance.
 * Invented for deep customization and branding consistency across the enterprise.
 * Supports dynamic switching and custom themes.
 */
export class ThemeService {
  private static instance: ThemeService;
  private currentTheme: DesktopTheme;
  private availableThemes: Record<string, DesktopTheme>;
  private listeners: Set<(theme: DesktopTheme) => void> = new Set(); // AT-1118: Observer pattern for theme changes

  private constructor() {
    // AT-1119: Predefined core themes, extensible for corporate branding.
    this.availableThemes = {
      'atlas-dark': {
        id: 'atlas-dark', name: 'Atlas Dark', primaryColor: '#2C3E50', secondaryColor: '#34495E',
        accentColor: '#3498DB', backgroundColor: '#1E2B38', fontFamily: 'Roboto, sans-serif',
        iconSet: 'material-dark', cursorSet: 'default', windowBorderRadius: '8px', taskbarOpacity: 0.95
      },
      'atlas-light': {
        id: 'atlas-light', name: 'Atlas Light', primaryColor: '#ECF0F1', secondaryColor: '#BDC3C7',
        accentColor: '#2980B9', backgroundColor: '#F0F2F5', fontFamily: 'Roboto, sans-serif',
        iconSet: 'material-light', cursorSet: 'default', windowBorderRadius: '8px', taskbarOpacity: 0.9
      },
      // AT-1120: Example of a branded Citibank theme, demonstrating corporate identity integration.
      'citibank-corporate': {
        id: 'citibank-corporate', name: 'Citibank Corporate', primaryColor: '#003151', secondaryColor: '#004772',
        accentColor: '#F58220', backgroundColor: '#F8F9FA', fontFamily: '"Citibank Sans", Arial, sans-serif',
        iconSet: 'citibank-vector', cursorSet: 'citibank', windowBorderRadius: '6px', taskbarOpacity: 0.98
      }
    };
    // AT-1121: Load active theme from user profile or system config to ensure consistency across sessions.
    this.currentTheme = this.availableThemes[SystemConfigService.getInstance().getConfig().defaultThemeId] || this.availableThemes['atlas-dark'];
    this.applyThemeToDOM(this.currentTheme); // AT-1122: Apply immediately on service instantiation for instant UI consistency.
  }

  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  /**
   * @method getAvailableThemes - AT-1123: Retrieves all themes available to the user.
   * @returns A map of theme IDs to DesktopTheme objects.
   */
  public getAvailableThemes(): Record<string, DesktopTheme> {
    return { ...this.availableThemes };
  }

  /**
   * @method getCurrentTheme - AT-1124: Retrieves the currently active theme.
   * @returns The active DesktopTheme object.
   */
  public getCurrentTheme(): DesktopTheme {
    return { ...this.currentTheme };
  }

  /**
   * @method applyTheme - AT-1125: Applies a new theme by ID.
   * Updates the current theme and triggers UI re-renders across the desktop.
   * @param themeId The ID of the theme to apply.
   */
  public applyTheme(themeId: string): void {
    const newTheme = this.availableThemes[themeId];
    if (newTheme && newTheme.id !== this.currentTheme.id) {
      this.currentTheme = newTheme;
      this.applyThemeToDOM(newTheme);
      this.notifyListeners();
      // AT-1126: Persist theme choice in user profile and system config for cross-session consistency.
      SystemConfigService.getInstance().updateConfig({ defaultThemeId: themeId });
      TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordEvent('theme_applied', { themeId: themeId });
    } else if (!newTheme) {
      TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordError(new Error(`Attempted to apply unknown theme: ${themeId}`));
    }
  }

  /**
   * @private applyThemeToDOM - AT-1127: Applies theme variables to the document's root.
   * Uses CSS custom properties (variables) for dynamic theming, minimizing re-renders.
   * @param theme The DesktopTheme object to apply.
   */
  private applyThemeToDOM(theme: DesktopTheme): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--window-border-radius', theme.windowBorderRadius);
    root.style.setProperty('--taskbar-opacity', theme.taskbarOpacity.toString());
    // AT-1128: Dynamic loading of icon and cursor sets would be managed here (e.g., SVG sprite sheets or font icons).
    root.setAttribute('data-icon-set', theme.iconSet);
    root.setAttribute('data-cursor-set', theme.cursorSet);
    // AT-1129: Add a class to body for global theme-dependent styles not covered by CSS variables.
    document.body.className = `atlas-theme-${theme.id}`;
  }

  /**
   * @method subscribe - AT-1130: Allows components to subscribe to theme changes.
   * @param listener Callback function to be invoked on theme updates.
   * @returns A function to unsubscribe.
   */
  public subscribe(listener: (theme: DesktopTheme) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentTheme); // Provide current theme immediately to new subscribers
    return () => this.listeners.delete(listener);
  }

  /**
   * @private notifyListeners - AT-1131: Notifies all subscribed components of a theme change.
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentTheme));
  }
}

/**
 * @class VirtualDesktopService - AT-1132: Manages multiple virtual desktops.
 * Invented for enhanced productivity and workspace organization for power users,
 * enabling separation of concerns (e.g., "Finance Desktop", "Research Desktop").
 */
export class VirtualDesktopService {
  private static instance: VirtualDesktopService;
  private desktops: VirtualDesktop[];
  private activeDesktopId: string;
  private listeners: Set<() => void> = new Set(); // AT-1133: Observers for desktop changes to update UI

  private constructor() {
    // AT-1134: Load from user profile or provide a default set of virtual desktops.
    this.desktops = [
      { id: 'desktop-1', name: 'Main Workspace', wallpaperUrl: '/assets/wallpapers/atlas-default.jpg', widgets: [] },
      { id: 'desktop-2', name: 'Financial Analysis', wallpaperUrl: '/assets/wallpapers/finance-dashboard.jpg', widgets: [] },
      { id: 'desktop-3', name: 'Research & Development', wallpaperUrl: '/assets/wallpapers/data-visual.jpg', widgets: [] },
    ];
    this.activeDesktopId = this.desktops[0].id; // AT-1135: Default to the first desktop on startup
    // AT-1136: Integrate with global keyboard shortcuts for seamless desktop switching (e.g., Ctrl+Alt+Left/Right).
    document.addEventListener('keydown', this.handleDesktopSwitchHotkey);
  }

  public static getInstance(): VirtualDesktopService {
    if (!VirtualDesktopService.instance) {
      VirtualDesktopService.instance = new VirtualDesktopService();
    }
    return VirtualDesktopService.instance;
  }

  /**
   * @private handleDesktopSwitchHotkey - AT-1137: Keyboard listener for virtual desktop switching.
   * Provides a power-user friendly way to navigate workspaces.
   */
  private handleDesktopSwitchHotkey = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.altKey) {
      const currentIndex = this.desktops.findIndex(d => d.id === this.activeDesktopId);
      if (event.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % this.desktops.length;
        this.setActiveDesktop(this.desktops[nextIndex].id);
        event.preventDefault(); // AT-1138: Prevent default browser action (e.g., scrolling)
      } else if (event.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + this.desktops.length) % this.desktops.length;
        this.setActiveDesktop(this.desktops[prevIndex].id);
        event.preventDefault();
      }
    }
  };

  /**
   * @method getDesktops - AT-1139: Retrieves all configured virtual desktops.
   * @returns An array of VirtualDesktop objects.
   */
  public getDesktops(): VirtualDesktop[] {
    return [...this.desktops];
  }

  /**
   * @method getActiveDesktopId - AT-1140: Retrieves the ID of the currently active desktop.
   * @returns The active desktop ID.
   */
  public getActiveDesktopId(): string {
    return this.activeDesktopId;
  }

  /**
   * @method setActiveDesktop - AT-1141: Sets the active virtual desktop.
   * Triggers UI updates and telemetry events.
   * @param id The ID of the desktop to activate.
   */
  public setActiveDesktop(id: string): void {
    if (this.desktops.some(d => d.id === id) && this.activeDesktopId !== id) {
      const previousDesktopId = this.activeDesktopId;
      this.activeDesktopId = id;
      this.notifyListeners();
      TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordEvent('desktop_switched', {
        from: previousDesktopId, to: id
      });
      // AT-1142: Transition animation would be triggered here using CSS classes or state-based animations.
    }
  }

  /**
   * @method addDesktop - AT-1143: Adds a new virtual desktop.
   * @param name Name of the new desktop.
   * @param wallpaperUrl Optional wallpaper URL for custom backgrounds.
   * @returns The newly created VirtualDesktop object.
   */
  public addDesktop(name: string, wallpaperUrl?: string): VirtualDesktop {
    const newDesktop: VirtualDesktop = {
      id: generateUniqueId(),
      name,
      wallpaperUrl: wallpaperUrl || '/assets/wallpapers/atlas-blank.jpg', // Default wallpaper
      widgets: [],
    };
    this.desktops.push(newDesktop);
    this.notifyListeners();
    TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordEvent('desktop_added', { desktopId: newDesktop.id, name });
    return newDesktop;
  }

  /**
   * @method removeDesktop - AT-1144: Removes a virtual desktop.
   * Prevents removal of the last remaining desktop to ensure system stability.
   * @param id The ID of the desktop to remove.
   */
  public removeDesktop(id: string): void {
    if (this.desktops.length <= 1) {
      throw new Error('Atlas Core: Cannot remove the last virtual desktop. At least one desktop must remain.');
    }
    this.desktops = this.desktops.filter(d => d.id !== id);
    if (this.activeDesktopId === id) {
      this.setActiveDesktop(this.desktops[0].id); // Fallback to first available desktop
    }
    this.notifyListeners();
    TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordEvent('desktop_removed', { desktopId: id });
  }

  /**
   * @method updateDesktop - AT-1145: Updates properties of a virtual desktop.
   * @param id The ID of the desktop to update.
   * @param updates Partial VirtualDesktop object with new values (e.g., name, wallpaper).
   */
  public updateDesktop(id: string, updates: Partial<Omit<VirtualDesktop, 'id'>>): void {
    this.desktops = this.desktops.map(d => d.id === id ? { ...d, ...updates } : d);
    this.notifyListeners();
    TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordEvent('desktop_updated', { desktopId: id, keys: Object.keys(updates) });
  }

  /**
   * @method subscribe - AT-1146: Allows components to subscribe to virtual desktop changes.
   * @param listener Callback function to be invoked on updates.
   * @returns A function to unsubscribe.
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * @private notifyListeners - AT-1147: Notifies all subscribed components of a change.
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

/**
 * @class SearchService - AT-1148: System-wide Search and Indexing Service.
 * Invented for rapid access to information, applications, and documents within Atlas.
 * Integrates with enterprise search (e.g., ElasticSearch, SharePoint Search) for unified search experience.
 */
export class SearchService {
  private static instance: SearchService;
  private searchableItems: Map<string, Omit<SearchResult, 'score'>> = new Map(); // AT-1149: In-memory index for quick access
  private config: SystemConfig;

  private constructor(config: SystemConfig) {
    this.config = config;
    // AT-1150: Pre-populate search index with system features and settings for immediate utility.
    ALL_FEATURES.forEach(f => this.indexItem({
      id: `feature-${f.id}`,
      title: f.name,
      description: f.description,
      icon: f.icon,
      type: 'feature',
      action: () => ActionManager.executeAction('open_feature', { featureId: f.id })
    }));
    this.indexItem({ id: 'setting-theme', title: 'Change Theme', description: 'Adjust desktop appearance and visual settings', icon: '🎨', type: 'setting', action: () => { /* open theme settings */ } });
    this.indexItem({ id: 'setting-desktop', title: 'Manage Desktops', description: 'Configure virtual desktops and workspaces', icon: '🖥️', type: 'setting', action: () => { /* open desktop settings */ } });
    this.indexItem({ id: 'setting-ai', title: 'AI Assistant Settings', description: 'Configure Gemini & ChatGPT integration and preferences', icon: '🤖', type: 'setting', action: () => { /* open AI settings */ } });
    // AT-1151: Placeholder for integrating with external enterprise search APIs (e.g., Confluence, Jira, document repositories).
    // e.g., this.initEnterpriseSearchIntegration();
  }

  public static getInstance(config: SystemConfig): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService(config);
    }
    SearchService.instance.config = config;
    return SearchService.instance;
  }

  /**
   * @method indexItem - AT-1152: Adds or updates an item in the search index.
   * Allows modules to make their content discoverable system-wide.
   * @param item The item to make searchable, including its ID, title, description, and action.
   */
  public indexItem(item: Omit<SearchResult, 'score'>): void {
    this.searchableItems.set(item.id, item);
    // AT-1153: In a large system, this would trigger an update to a backend search index (e.g., ElasticSearch)
    // for distributed, scalable search and real-time indexing.
  }

  /**
   * @method search - AT-1154: Performs a search across indexed items.
   * Implements a simple fuzzy matching algorithm with scoring.
   * @param query The search query string.
   * @returns A sorted array of SearchResult objects, ranked by relevance.
   */
  public search(query: string): SearchResult[] {
    const lowerQuery = query.toLowerCase();
    if (!lowerQuery.trim()) return [];

    const results: SearchResult[] = [];
    this.searchableItems.forEach(item => {
      let score = 0;
      // AT-1155: Basic scoring logic: exact matches, starts-with, and inclusions.
      if (item.title.toLowerCase().includes(lowerQuery)) {
        score += 10;
        if (item.title.toLowerCase().startsWith(lowerQuery)) score += 5;
        if (item.title.toLowerCase() === lowerQuery) score += 10; // Exact title match
      }
      if (item.description.toLowerCase().includes(lowerQuery)) {
        score += 3;
      }
      if (item.type.toLowerCase().includes(lowerQuery)) {
        score += 2;
      }
      // AT-1156: More advanced algorithms would use Levenshtein distance, TF-IDF, semantic search.
      // Integration with AI Service for semantic search capability:
      // if (this.config.enableAIAssistant && query.length > 5) {
      //     const semanticScore = AIService.getInstance(this.config).getSemanticSimilarity(query, item.title + ' ' + item.description);
      //     score += semanticScore * 10; // Boost results based on semantic relevance
      // }

      if (score > 0) {
        results.push({ ...item, score });
      }
    });

    // AT-1157: Sort by score (descending), then alphabetically by title for consistent results.
    return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  }

  /**
   * @method removeIndexItem - AT-1158: Removes an item from the search index.
   * @param id The ID of the item to remove.
   */
  public removeIndexItem(id: string): void {
    this.searchableItems.delete(id);
  }
}

/**
 * @class ClipboardService - AT-1159: Advanced Clipboard History Management.
 * Invented to enhance productivity by allowing access to past copied items,
 * reducing repetitive copy-pasting.
 * Integrates with OS native clipboard for richer data types (images, files - requires browser permissions).
 */
export class ClipboardService {
  private static instance: ClipboardService;
  private history: ClipboardItem[] = []; // AT-1160: In-memory clipboard history buffer
  private maxHistorySize: number = 20; // AT-1161: Max items in history to manage memory and relevance
  private listeners: Set<() => void> = new Set(); // AT-1162: Observers for clipboard changes to update UI components

  private constructor() {
    // AT-1163: Listen for system copy events to automatically add to history, providing seamless capture.
    document.addEventListener('copy', this.handleCopyEvent);
    // AT-1164: Load initial history from persistent storage (e.g., IndexedDB for larger data or LocalStorage for simplicity)
    this.loadHistoryFromStorage();
  }

  public static getInstance(): ClipboardService {
    if (!ClipboardService.instance) {
      ClipboardService.instance = new ClipboardService();
    }
    return ClipboardService.instance;
  }

  /**
   * @private handleCopyEvent - AT-1165: Event listener for browser copy events.
   * Captures copied text and adds it to history, enriching the user experience.
   */
  private handleCopyEvent = (event: ClipboardEvent) => {
    const copiedText = event.clipboardData?.getData('text/plain');
    if (copiedText && copiedText.length > 0) {
      this.addHistoryItem({
        content: copiedText,
        type: 'text',
      });
      TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordEvent('clipboard_copy_text');
    }
    // AT-1166: For images/files, more complex APIs like `navigator.clipboard.read()` would be needed,
    // which require specific user permissions and are often asynchronous.
    // Example: if (event.clipboardData?.types.includes('image/png')) { navigator.clipboard.read().then(...) }
  };

  /**
   * @method addHistoryItem - AT-1167: Manually adds an item to the clipboard history.
   * Allows applications to programmatically add content to clipboard history.
   * @param item The ClipboardItem to add (without ID and timestamp, which are generated).
   * @returns The newly added ClipboardItem.
   */
  public addHistoryItem(item: Omit<ClipboardItem, 'id' | 'timestamp'>): ClipboardItem {
    const newItem: ClipboardItem = {
      id: generateUniqueId(),
      timestamp: new Date(),
      ...item,
    };
    this.history = [newItem, ...this.history].slice(0, this.maxHistorySize);
    this.saveHistoryToStorage(); // AT-1168: Persist history for future sessions
    this.notifyListeners();
    return newItem;
  }

  /**
   * @method getHistory - AT-1169: Retrieves the current clipboard history.
   * @returns An array of ClipboardItem objects.
   */
  public getHistory(): ClipboardItem[] {
    return [...this.history];
  }

  /**
   * @method pasteItem - AT-1170: Pastes a specific item from history to the active input.
   * This method simulates pasting by programmatically writing to the system clipboard.
   * @param id The ID of the item to paste.
   * @returns A boolean indicating success of the paste operation.
   */
  public async pasteItem(id: string): Promise<boolean> {
    const itemToPaste = this.history.find(item => item.id === id);
    if (!itemToPaste) return false;

    try {
      if (itemToPaste.type === 'text') {
        await navigator.clipboard.writeText(itemToPaste.content);
        TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordEvent('clipboard_paste_text', { itemId: id });
        return true;
      }
      // AT-1171: For other types (image, file), would require `navigator.clipboard.write()`
      // which takes a ClipboardItem (DOM API, not our custom type) and may need permissions.
      // Example: await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      return false;
    } catch (error) {
      TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordError(new Error(`Failed to paste clipboard item: ${error}`));
      console.error('Atlas Core: Failed to paste clipboard item:', error);
      return false;
    }
  }

  /**
   * @method clearHistory - AT-1172: Clears the entire clipboard history.
   * Provides a privacy and data hygiene feature.
   */
  public clearHistory(): void {
    this.history = [];
    this.saveHistoryToStorage();
    this.notifyListeners();
    TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordEvent('clipboard_history_cleared');
  }

  /**
   * @method subscribe - AT-1173: Allows components to subscribe to clipboard history changes.
   * @param listener Callback function.
   * @returns A function to unsubscribe.
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * @private notifyListeners - AT-1174: Notifies all subscribed components of a change.
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * @private saveHistoryToStorage - AT-1175: Persists clipboard history to IndexedDB or LocalStorage.
   * Ensures history is retained across sessions.
   */
  private saveHistoryToStorage(): void {
    // AT-1176: For actual persistence beyond session or larger data volumes, IndexedDB would be preferred for performance and storage limits.
    localStorage.setItem('atlas_clipboard_history', JSON.stringify(this.history));
  }

  /**
   * @private loadHistoryFromStorage - AT-1177: Loads clipboard history from persistent storage.
   */
  private loadHistoryFromStorage(): void {
    try {
      const stored = localStorage.getItem('atlas_clipboard_history');
      if (stored) {
        this.history = JSON.parse(stored).map((item: ClipboardItem) => ({
          ...item,
          timestamp: new Date(item.timestamp), // Ensure Date objects are re-hydrated correctly
        }));
      }
    } catch (error) {
      TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordError(new Error(`Failed to load clipboard history: ${error}`));
      this.history = []; // Reset history on error to prevent corrupted state
    }
  }
}

// AT-1178: Define additional external/internal services (mocks or interfaces for integration).
// These services represent a fraction of the 1000 commercial-grade integrations.
// The actual implementation details would reside in separate modules and be injected at runtime.

/**
 * @interface IAuthenticationService - AT-1179: Enterprise Identity & Access Management.
 * Integrates with corporate identity providers like Okta, Azure AD, OAuth2 providers.
 * Manages user login, logout, session management, and authorization.
 */
export interface IAuthenticationService {
  login(credentials: any): Promise<UserProfile>; // AT-1180: Supports various auth flows (password, SSO tokens)
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
  refreshToken(): Promise<string>; // AT-1181: Token refresh for long sessions without re-authenticating
  isLoggedIn(): boolean;
  subscribeAuthChange(listener: (user: UserProfile | null) => void): () => void; // AT-1182: Auth state observers for reactive UI
  // AT-1183: Multi-factor authentication (MFA), biometric integration for enhanced security.
  initMFA(userId: string): Promise<{ qrCode: string, setupUrl: string }>;
  verifyMFA(userId: string, code: string): Promise<boolean>;
}
// AT-1184: Mock implementation for demonstration purposes. In production, this would be a secure client SDK.
export class MockAuthenticationService implements IAuthenticationService {
  private currentUser: UserProfile | null = null;
  private listeners: Set<(user: UserProfile | null) => void> = new Set();

  async login(credentials: any): Promise<UserProfile> {
    // Simulate login delay and success
    return new Promise(resolve => setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin') { // Mock admin login
        this.currentUser = {
          userId: 'admin-user',
          username: 'admin',
          themeId: 'citibank-corporate',
          settings: { allowExperimentalFeatures: true },
          lastLogin: new Date(),
          permissions: ['admin', 'feature:read', 'feature:write', 'system:configure', 'user:manage'],
        };
      } else {
        this.currentUser = {
          userId: 'user123',
          username: credentials.username || 'demoUser',
          themeId: 'atlas-dark',
          settings: {},
          lastLogin: new Date(),
          permissions: ['feature:read', 'feature:write'],
        };
      }
      this.notifyListeners();
      TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordEvent('user_login', { userId: this.currentUser.userId });
      resolve(this.currentUser);
    }, 1000));
  }
  async logout(): Promise<void> {
    return new Promise(resolve => setTimeout(() => {
      const currentUserId = this.currentUser?.userId;
      this.currentUser = null;
      this.notifyListeners();
      TelemetryService.getInstance(SystemConfigService.getInstance().getConfig()).recordEvent('user_logout', { userId: currentUserId });
      resolve();
    }, 500));
  }
  async getCurrentUser(): Promise<UserProfile | null> {
    return Promise.resolve(this.currentUser);
  }
  async refreshToken(): Promise<string> {
    // Simulate token refresh, important for maintaining long sessions securely
    return Promise.resolve(generateUniqueId());
  }
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
  subscribeAuthChange(listener: (user: UserProfile | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentUser); // Immediately provide current state to new subscribers
    return () => this.listeners.delete(listener);
  }
  async initMFA(userId: string): Promise<{ qrCode: string; setupUrl: string; }> {
    console.log(`MFA setup initiated for ${userId}`);
    return Promise.resolve({ qrCode: 'mock-qrcode-base64', setupUrl: 'https://mfa.example.com/setup' });
  }
  async verifyMFA(userId: string, code: string): Promise<boolean> {
      console.log(`Verifying MFA code ${code} for ${userId}`);
      return Promise.resolve(code === '123456'); // Mock verification
  }
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

/**
 * @interface ICloudStorageService - AT-1185: Unified Cloud Storage Gateway.
 * Integrates with diverse cloud storage providers like Dropbox, Google Drive, OneDrive, AWS S3.
 * Provides a single API surface for file operations across multiple platforms.
 */
export interface ICloudStorageService {
  listFiles(path: string, provider: 'dropbox' | 'gdrive' | 's3' | 'internal-atlas-drive'): Promise<any[]>; // AT-1186: Multi-provider support
  downloadFile(path: string, provider: string): Promise<Blob>;
  uploadFile(file: File, path: string, provider: string): Promise<any>; // AT-1187: Large file upload optimization, chunking, and resume capabilities
  getShareableLink(path: string, provider: string): Promise<string>;
  createFolder(path: string, provider: string): Promise<any>;
  deleteItem(path: string, provider: string): Promise<void>;
  // AT-1188: Versioning, access control lists, encryption-at-rest/in-transit features for data security.
}
// AT-1189: Mock implementation for demonstration purposes.
export class MockCloudStorageService implements ICloudStorageService {
  async listFiles(path: string, provider: 'dropbox' | 'gdrive' | 's3' | 'internal-atlas-drive'): Promise<any[]> {
    console.log(`CloudStorage: Listing files in ${path} from ${provider}`);
    return Promise.resolve([
      { name: 'Financial_Report_Q3.pdf', size: '1.2MB', type: 'file', path: `${path}/Financial_Report_Q3.pdf`, modified: new Date() },
      { name: 'Client Data', type: 'folder', path: `${path}/Client Data`, modified: new Date() },
      { name: 'Meeting_Notes.docx', size: '0.5MB', type: 'file', path: `${path}/Meeting_Notes.docx`, modified: new Date() },
    ]);
  }
  async downloadFile(path: string, provider: string): Promise<Blob> {
    console.log(`CloudStorage: Downloading ${path} from ${provider}`);
    return Promise.resolve(new Blob([`Mock content for ${path}`], { type: 'text/plain' }));
  }
  async uploadFile(file: File, path: string, provider: string): Promise<any> {
    console.log(`CloudStorage: Uploading ${file.name} to ${path} on ${provider}`);
    return Promise.resolve({ success: true, fileName: file.name, path, size: file.size, provider });
  }
  async getShareableLink(path: string, provider: string): Promise<string> {
    console.log(`CloudStorage: Getting shareable link for ${path} from ${provider}`);
    return Promise.resolve(`https://share.citibankdemo.com/${provider}/${generateUniqueId()}`);
  }
  async createFolder(path: string, provider: string): Promise<any> {
    console.log(`CloudStorage: Creating folder ${path} on ${provider}`);
    return Promise.resolve({ success: true, path, provider, type: 'folder' });
  }
  async deleteItem(path: string, provider: string): Promise<void> {
    console.log(`CloudStorage: Deleting item ${path} from ${provider}`);
    return Promise.resolve();
  }
}

/**
 * @interface IPaymentGatewayService - AT-1190: Secure Payment Processing.
 * Integrates with leading payment providers like Stripe, PayPal, and traditional financial networks (SWIFT, ACH, blockchain settlement).
 * Ensures compliance with PCI DSS, anti-money laundering (AML), and other financial regulations.
 */
export interface IPaymentGatewayService {
  processPayment(amount: number, currency: string, token: string, invoiceId: string, metadata?: Record<string, any>): Promise<any>; // AT-1191: Tokenized payments for security
  refundPayment(transactionId: string, amount: number, reason: string): Promise<any>;
  verifyTransaction(transactionId: string): Promise<any>;
  initiateWireTransfer(details: any): Promise<any>; // AT-1191.1: New feature: Wire transfer initiation
  // AT-1192: Compliance with PCI DSS, GDPR, AML regulations, and robust fraud detection.
}
// AT-1193: Mock implementation for demonstration purposes.
export class MockPaymentGatewayService implements IPaymentGatewayService {
  async processPayment(amount: number, currency: string, token: string, invoiceId: string, metadata: Record<string, any> = {}): Promise<any> {
    console.log(`PaymentGateway: Processing ${amount} ${currency} for invoice ${invoiceId} with token ${token}, metadata:`, metadata);
    if (Math.random() > 0.1) { // 90% success rate simulation
      return Promise.resolve({ status: 'success', transactionId: generateUniqueId(), amount, currency, invoiceId, timestamp: new Date() });
    } else {
      throw new Error('Payment failed due to mock processing error. Insufficient funds or card declined.');
    }
  }
  async refundPayment(transactionId: string, amount: number, reason: string): Promise<any> {
    console.log(`PaymentGateway: Refunding ${amount} for transaction ${transactionId}. Reason: ${reason}`);
    return Promise.resolve({ status: 'refunded', transactionId, amount, reason, timestamp: new Date() });
  }
  async verifyTransaction(transactionId: string): Promise<any> {
    console.log(`PaymentGateway: Verifying transaction ${transactionId}`);
    return Promise.resolve({ status: 'verified', transactionId, details: { amount: 100, currency: 'USD' }, timestamp: new Date() });
  }
  async initiateWireTransfer(details: any): Promise<any> {
      console.log('PaymentGateway: Initiating wire transfer with details:', details);
      if (Math.random() > 0.05) { // 95% success rate for wire transfers
          return Promise.resolve({ status: 'pending_approval', wireTransferId: generateUniqueId(), details, timestamp: new Date() });
      } else {
          throw new Error('Wire transfer initiation failed due to bank processing error.');
      }
  }
}

/**
 * @interface ICollaborationService - AT-1194: Enterprise Collaboration & Communication.
 * Integrates with leading platforms like Microsoft Teams, Slack, Zoom, and dedicated internal comms.
 * Facilitates seamless team interaction and content sharing within the Atlas environment.
 */
export interface ICollaborationService {
  sendMessage(channel: string, message: string, attachments?: string[], recipientIds?: string[]): Promise<any>; // AT-1195: Rich message support
  startMeeting(users: string[], topic: string, options?: Record<string, any>): Promise<any>;
  shareScreen(windowId: string, users: string[]): Promise<any>;
  createSharedDocument(documentId: string, users: string[]): Promise<any>; // AT-1195.1: New feature: Create collaborative document
  // AT-1196: End-to-end encryption, audit logs for compliance, and integration with CRM/ERP for contextual comms.
}
// AT-1197: Mock implementation for demonstration purposes.
export class MockCollaborationService implements ICollaborationService {
  async sendMessage(channel: string, message: string, attachments?: string[], recipientIds?: string[]): Promise<any> {
    console.log(`Collaboration: Sending message to ${channel} (recipients: ${recipientIds?.join(', ')}): ${message}`);
    return Promise.resolve({ success: true, messageId: generateUniqueId(), timestamp: new Date() });
  }
  async startMeeting(users: string[], topic: string, options: Record<string, any> = {}): Promise<any> {
    console.log(`Collaboration: Starting meeting for ${users.join(', ')} on topic: "${topic}", options:`, options);
    return Promise.resolve({ success: true, meetingUrl: `https://meet.citibankdemo.com/${generateUniqueId()}`, timestamp: new Date() });
  }
  async shareScreen(windowId: string, users: string[]): Promise<any> {
    console.log(`Collaboration: Sharing window ${windowId} with ${users.join(', ')}`);
    // AT-1198: Real implementation would use WebRTC for secure, low-latency screen sharing.
    return Promise.resolve({ success: true, sharingSessionId: generateUniqueId(), timestamp: new Date() });
  }
  async createSharedDocument(documentId: string, users: string[]): Promise<any> {
    console.log(`Collaboration: Creating shared document ${documentId} with ${users.join(', ')}`);
    return Promise.resolve({ success: true, sharedDocumentUrl: `https://docs.citibankdemo.com/shared/${documentId}`, timestamp: new Date() });
  }
}

/**
 * @interface IMonitoringService - AT-1199: Infrastructure & Application Performance Monitoring.
 * Integrates with enterprise monitoring solutions like Datadog, Splunk, Prometheus, Grafana.
 * Provides a unified view of system health and performance.
 */
export interface IMonitoringService {
  logMetric(name: string, value: number, tags?: Record<string, string>): Promise<void>;
  logEvent(name: string, details: Record<string, any>, severity: 'info' | 'warn' | 'error' | 'critical'): Promise<void>; // AT-1199.1: Critical severity
  // AT-1200: Real-time dashboards, intelligent alerting mechanisms, and incident management integration.
}
// AT-1201: Mock implementation.
export class MockMonitoringService implements IMonitoringService {
  async logMetric(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    // console.log(`Monitoring: Metric ${name}=${value}`, tags); // Log to console for dev visibility
    return Promise.resolve();
  }
  async logEvent(name: string, details: Record<string, any>, severity: 'info' | 'warn' | 'error' | 'critical'): Promise<void> {
    // console.log(`Monitoring: Event ${name} (${severity})`, details);
    return Promise.resolve();
  }
}

// AT-1202: Introducing a Global Service Locator pattern for easy access to singleton services.
// This is a commercial-grade approach to managing dependencies in a large, modular application,
// ensuring that services are instantiated once and globally accessible.
export class ServiceLocator {
  private static configService: SystemConfigService;
  private static telemetryService: TelemetryService;
  private static aiService: AIService;
  private static notificationService: NotificationService;
  private static themeService: ThemeService;
  private static virtualDesktopService: VirtualDesktopService;
  private static searchService: SearchService;
  private static clipboardService: ClipboardService;
  private static authService: IAuthenticationService; // AT-1203: Use interface for pluggable implementations (e.g., mock vs. real)
  private static cloudStorageService: ICloudStorageService;
  private static paymentGatewayService: IPaymentGatewayService;
  private static collaborationService: ICollaborationService;
  private static monitoringService: IMonitoringService;

  public static initialize(): void {
    // Order matters for some services (e.g., Telemetry depends on Config for enablement).
    this.configService = SystemConfigService.getInstance();
    const config = this.configService.getConfig(); // Get initial config for other services
    this.telemetryService = TelemetryService.getInstance(config);
    this.aiService = AIService.getInstance(config);
    this.notificationService = NotificationService.getInstance(config);
    this.themeService = ThemeService.getInstance(); // Theme service often standalone initially
    this.virtualDesktopService = VirtualDesktopService.getInstance();
    this.searchService = SearchService.getInstance(config);
    this.clipboardService = ClipboardService.getInstance();

    // AT-1204: Initialize external service mocks (in a real app, these would be injected
    // based on environment, or through a dedicated dependency injection framework).
    this.authService = new MockAuthenticationService();
    this.cloudStorageService = new MockCloudStorageService();
    this.paymentGatewayService = new MockPaymentGatewayService();
    this.collaborationService = new MockCollaborationService();
    this.monitoringService = new MockMonitoringService();

    // AT-1205: Subscribe services to config changes if they need dynamic updates,
    // ensuring reactivity to administrative changes.
    this.configService.subscribe(newConfig => {
      this.telemetryService.recordEvent('system_config_reloaded');
      // Individual services would call their updateConfig methods here if they have one
      // E.g., this.telemetryService.updateConfig(newConfig);
      // For this example, many services just refer to `ServiceLocator.getConfigService().getConfig()`
      // to always get the latest config.
    });

    // AT-1206: Global Error Handler for robust error reporting, vital for commercial applications.
    // Catches unhandled exceptions anywhere in the application.
    window.onerror = (message, source, lineno, colno, error) => {
      if (error) {
        this.telemetryService.recordError(error, { message, source, lineno, colno, type: 'global_unhandled_error' });
      } else {
        this.telemetryService.recordEvent('global_unhandled_error_string', { message, source, lineno, colno });
      }
      return false; // Let default browser error handling continue as a fallback.
    };
    window.addEventListener('unhandledrejection', (event) => {
      this.telemetryService.recordError(new Error('Unhandled Promise Rejection'), { reason: event.reason, type: 'unhandled_promise_rejection' });
    });

    // AT-1207: Hook into ActionManager for system-level actions, allowing features to trigger core system behaviors.
    ActionManager.registerAction('show_notification', (payload: any) => this.getNotificationService().addNotification(payload));
    ActionManager.registerAction('system_search', (payload: { query: string }) => {
      // In a real scenario, this would trigger opening the search overlay with the query.
      console.log('Action: System Search triggered for:', payload.query);
      // Example: `setShowSearchOverlay(true); setSearchTerm(payload.query);`
    });
    ActionManager.registerAction('ai_query', async (payload: { query: string, context?: any }) => {
      try {
        const response = await this.getAIService().queryAI(payload.query, 'auto', payload.context);
        this.getNotificationService().addNotification({
          title: 'AI Assistant Response',
          message: response.response.substring(0, 150) + '...',
          type: 'info',
          duration: 5000,
        });
        // AT-1208: More complex AI actions might open a dedicated AI chat window or perform direct system integrations.
      } catch (error: any) {
        this.getNotificationService().addNotification({
          title: 'AI Assistant Error',
          message: error.message,
          type: 'error',
          duration: 7000,
        });
      }
    });

    // AT-1209: Example of cross-service interaction for a cohesive user experience.
    this.authService.subscribeAuthChange(user => {
        if (user) {
            this.notificationService.addNotification({ title: 'Welcome Back!', message: `Hello, ${user.username}.`, type: 'success', duration: 3000 });
            // Apply user's preferred theme, defaulting to system config if not set.
            this.themeService.applyTheme(user.themeId || config.defaultThemeId);
            // Optionally load user-specific desktop layout or widgets here.
        } else {
            this.notificationService.addNotification({ title: 'Logged Out', message: 'You have been logged out.', type: 'info', duration: 3000 });
            // Clear sensitive user data from memory/local storage on logout.
        }
    });

  }

  // Public getters for all registered services, providing controlled access.
  public static getConfigService(): SystemConfigService { return this.configService; }
  public static getTelemetryService(): TelemetryService { return this.telemetryService; }
  public static getAIService(): AIService { return this.aiService; }
  public static getNotificationService(): NotificationService { return this.notificationService; }
  public static getThemeService(): ThemeService { return this.themeService; }
  public static getVirtualDesktopService(): VirtualDesktopService { return this.virtualDesktopService; }
  public static getSearchService(): SearchService { return this.searchService; }
  public static getClipboardService(): ClipboardService { return this.clipboardService; }
  public static getAuthenticationService(): IAuthenticationService { return this.authService; }
  public static getCloudStorageService(): ICloudStorageService { return this.cloudStorageService; }
  public static getPaymentGatewayService(): IPaymentGatewayService { return this.paymentGatewayService; }
  public static getCollaborationService(): ICollaborationService { return this.collaborationService; }
  public static getMonitoringService(): IMonitoringService { return this.monitoringService; }
}

// AT-1210: Initialize all services once at application startup.
// In a real application, this might be called in the root App.tsx or index.ts
// to ensure all core systems are ready before rendering the UI.
ServiceLocator.initialize();

// AT-1211: Context for providing system services to deeply nested components without prop drilling.
// This is an advanced React pattern for large-scale applications, promoting clean architecture.
export const SystemServicesContext = createContext({
  config: ServiceLocator.getConfigService(),
  telemetry: ServiceLocator.getTelemetryService(),
  ai: ServiceLocator.getAIService(),
  notifications: ServiceLocator.getNotificationService(),
  theme: ServiceLocator.getThemeService(),
  virtualDesktops: ServiceLocator.getVirtualDesktopService(),
  search: ServiceLocator.getSearchService(),
  clipboard: ServiceLocator.getClipboardService(),
  auth: ServiceLocator.getAuthenticationService(),
  cloudStorage: ServiceLocator.getCloudStorageService(),
  paymentGateway: ServiceLocator.getPaymentGatewayService(),
  collaboration: ServiceLocator.getCollaborationService(),
  monitoring: ServiceLocator.getMonitoringService(),
});

// AT-1212: Custom hook to easily access system services from any functional component,
// simplifying dependency access and improving code readability.
export const useSystemServices = () => useContext(SystemServicesContext);

// --- Invented React Components and UI Enhancements for Project Atlas ---

/**
 * @function SystemNotificationDisplay - AT-1213: Displays system notifications as toasts or banners.
 * Invented for consistent user feedback and alerts across the entire platform.
 * Supports different notification types and user interactions.
 */
export const SystemNotificationDisplay: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { notifications: notificationService, config: configService } = useSystemServices();
  const config = configService.getConfig(); // Get current config for max notifications

  useEffect(() => {
    const updateNotifications = () => {
      setNotifications(notificationService.getNotifications());
    };
    const unsubscribe = notificationService.subscribe(updateNotifications);
    updateNotifications(); // Initial load of notifications
    return () => unsubscribe();
  }, [notificationService]);

  // AT-1214: Style notifications dynamically based on theme and type for clear visual hierarchy.
  const getNotificationClasses = useCallback((type: Notification['type']) => {
    switch (type) {
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-600';
      case 'success': return 'bg-green-500';
      case 'system': return 'bg-gray-700';
      default: return 'bg-gray-800';
    }
  }, []);

  return (
    <div className="absolute top-4 right-4 z-[var(--atlas-notification-z-index, 10000)] space-y-2 pointer-events-none">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`flex items-start p-4 rounded-lg shadow-lg text-white max-w-sm transition-all duration-300 transform translate-x-0 opacity-100 pointer-events-auto
            ${getNotificationClasses(notif.type)}
            ${!notif.isRead ? 'border-l-4 border-opacity-75 animate-pulse-once' : ''}
          `}
          role="alert" // ARIA role for accessibility
          aria-live="assertive" // Announces changes to screen readers immediately
          aria-atomic="true" // Announces the entire content of the notification
          onClick={() => notificationService.markAsRead(notif.id)} // AT-1215: Mark read on click for user convenience
          onDoubleClick={() => notificationService.dismissNotification(notif.id)} // AT-1216: Dismiss on double click
        >
          {notif.icon && <img src={notif.icon} alt="" className="w-5 h-5 mr-3 mt-1" aria-hidden="true" />}
          <div className="flex-grow">
            <h3 className="font-bold text-lg">{notif.title}</h3>
            <p className="text-sm">{notif.message}</p>
            {notif.action && (
              <button
                className="mt-2 text-xs font-semibold px-2 py-1 rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                onClick={(e) => { e.stopPropagation(); notif.action?.callback(); notificationService.dismissNotification(notif.id); }}
              >
                {notif.action.label}
              </button>
            )}
            <div className="text-xs text-white text-opacity-75 mt-1">
              {notif.timestamp.toLocaleTimeString()}
            </div>
          </div>
          <button
            className="ml-4 text-white text-opacity-70 hover:text-opacity-100"
            onClick={(e) => { e.stopPropagation(); notificationService.dismissNotification(notif.id); }}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};


/**
 * @function SystemSearchOverlay - AT-1217: Full-screen search interface for Project Atlas.
 * Provides quick access to features, documents, settings, and AI assistance from a single entry point.
 */
export const SystemSearchOverlay: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // AT-1218: Debounce search input for performance and API call reduction

  const { search: searchService, ai: aiService, config: configService } = useSystemServices();
  const currentConfig = configService.getConfig();

  useEffect(() => {
    if (!isOpen || !debouncedSearchTerm) {
      setSearchResults([]);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      const featureResults = searchService.search(debouncedSearchTerm);
      let aiSuggestions: SearchResult[] = [];

      // AT-1219: Integrate AI into search for richer results or query expansion.
      // AI can provide semantic search, tool suggestions, or direct answers.
      if (currentConfig.enableAIAssistant && debouncedSearchTerm.length > 5) { // Only query AI for longer, more complex terms
        try {
          const aiResponse = await aiService.queryAI(`Generate search keywords or answer for: ${debouncedSearchTerm}`, 'auto', { context: 'search-overlay' });
          if (aiResponse.toolSuggestions && aiResponse.toolSuggestions.length > 0) {
            aiSuggestions = aiResponse.toolSuggestions.map(s => ({
              id: `ai-suggestion-${generateUniqueId()}`,
              title: s.label,
              description: `AI suggested action: ${s.label}`,
              icon: '🧠',
              type: 'action', // Denotes an executable action
              score: 20, // High score for AI suggestions
              action: s.action,
            }));
          }
          if (aiResponse.response && aiResponse.response.length > 0) {
            aiSuggestions.push({
                id: `ai-response-${generateUniqueId()}`,
                title: `AI Assistant: "${debouncedSearchTerm}"`,
                description: aiResponse.response.substring(0, 100) + '...',
                icon: '🤖',
                type: 'web', // Representing an AI-generated answer or summary
                score: 15,
                action: () => ActionManager.executeAction('show_notification', {
                    title: `AI Assistant for "${debouncedSearchTerm}"`,
                    message: aiResponse.response,
                    type: 'info',
                    duration: 15000 // Display AI answer as a longer-duration notification
                })
            });
          }

        } catch (error) {
          console.error('Atlas Core: AI Search integration failed:', error);
          // Fallback to non-AI search if AI service fails, maintaining functionality
        }
      }

      // AT-1220: Combine and de-duplicate results, ensuring unique and relevant entries.
      const combinedResultsMap = new Map<string, SearchResult>();
      [...featureResults, ...aiSuggestions].forEach(r => {
        if (!combinedResultsMap.has(r.id)) {
            combinedResultsMap.set(r.id, r);
        } else {
            // If duplicate, keep the one with higher score to prioritize better matches
            const existing = combinedResultsMap.get(r.id)!;
            if (r.score > existing.score) {
                combinedResultsMap.set(r.id, r);
            }
        }
      });

      const finalResults = Array.from(combinedResultsMap.values()).sort((a, b) => b.score - a.score);
      setSearchResults(finalResults);
      setIsLoading(false);
      TelemetryService.getInstance(currentConfig).recordEvent('system_search_performed', { query: debouncedSearchTerm, numResults: finalResults.length });
    };

    performSearch();
  }, [isOpen, debouncedSearchTerm, searchService, aiService, currentConfig]);

  const handleResultClick = useCallback((result: SearchResult) => {
    result.action();
    setSearchTerm('');
    onClose(); // Close search overlay after an action is performed
  }, [onClose]);

  // Handle keyboard navigation for search results
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        // AT-1219.1: Implement keyboard navigation through results.
        event.preventDefault(); // Prevent scrolling
        const currentIndex = searchResults.findIndex(r => document.activeElement?.id === `search-result-${r.id}`);
        let nextIndex = currentIndex;
        if (event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % searchResults.length;
        } else if (event.key === 'ArrowUp') {
            nextIndex = (currentIndex - 1 + searchResults.length) % searchResults.length;
        }
        document.getElementById(`search-result-${searchResults[nextIndex].id}`)?.focus();
    } else if (event.key === 'Enter' && document.activeElement?.id.startsWith('search-result-')) {
        // Execute focused result on Enter
        const resultId = document.activeElement.id.replace('search-result-', '');
        const result = searchResults.find(r => r.id === resultId);
        if (result) handleResultClick(result);
    }
  }, [onClose, searchResults, handleResultClick]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start pt-20 z-[var(--atlas-search-z-index, 9000)]" onClick={onClose}>
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-3/4 max-w-2xl transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the search box
      >
        <input
          type="text"
          className="w-full p-3 rounded-md bg-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-accent-color"
          placeholder="Search Atlas, launch apps, find documents, ask AI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
          aria-label="System-wide search input"
        />
        {isLoading && <p className="text-center text-gray-400 mt-4" aria-live="polite">Searching...</p>}
        {searchResults.length > 0 && (
          <div className="mt-4 max-h-96 overflow-y-auto custom-scrollbar" role="list">
            {searchResults.map((result) => (
              <div
                key={result.id}
                id={`search-result-${result.id}`} // For keyboard navigation focus
                className="flex items-center p-3 my-2 rounded-md hover:bg-gray-700 focus:bg-gray-700 outline-none cursor-pointer transition-colors"
                onClick={() => handleResultClick(result)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleResultClick(result); }}
                tabIndex={0} // Make div focusable
                role="listitem"
              >
                <span className="text-2xl mr-3" aria-hidden="true">{result.icon}</span>
                <div>
                  <h4 className="font-semibold text-white">{result.title}</h4>
                  <p className="text-sm text-gray-400">{result.description}</p>
                  <p className="text-xs text-gray-500">Type: {result.type} | Score: {result.score.toFixed(1)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {searchTerm && !isLoading && searchResults.length === 0 && (
          <p className="text-center text-gray-400 mt-4" aria-live="polite">No results found for "{searchTerm}".</p>
        )}
      </div>
    </div>
  );
};

// AT-1221: System Widget Manager - Enables dynamic, interactive widgets on the desktop.
// Export Widget interface and manager concept, but not individual widgets for brevity.
export interface DesktopWidgetProps {
    widgetId: string;
    onClose: () => void;
    // AT-1222: Widgets can be interactive and receive real-time data, e.g., from a data stream or API.
    dataStream?: any;
    config?: Record<string, any>; // Per-instance configuration for a widget
    position: { x: number; y: number }; // Position the widget on the desktop
    onUpdatePosition: (newPosition: { x: number; y: number }) => void; // Allow drag-and-drop
}

// AT-1223: Example Widget definitions, extensible through a plugin architecture.
const ALL_WIDGETS = new Map<string, {
    name: string;
    description: string;
    icon: string;
    Component: React.FC<DesktopWidgetProps>;
}>([
    ['clock-widget', {
        name: 'Digital Clock',
        description: 'Displays current local time with seconds',
        icon: '⏰',
        Component: ({ widgetId, onClose, position, onUpdatePosition }) => {
            const [time, setTime] = useState(new Date());
            const [isDragging, setIsDragging] = useState(false);
            const offset = useRef({ x: 0, y: 0 });

            useEffect(() => {
                const interval = setInterval(() => setTime(new Date()), 1000);
                return () => clearInterval(interval);
            }, []);

            const handleMouseDown = useCallback((e: React.MouseEvent) => {
                setIsDragging(true);
                offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
            }, [position]);

            const handleMouseMove = useCallback((e: MouseEvent) => {
                if (!isDragging) return;
                const newX = e.clientX - offset.current.x;
                const newY = e.clientY - offset.current.y;
                onUpdatePosition({ x: newX, y: newY });
            }, [isDragging, onUpdatePosition]);

            const handleMouseUp = useCallback(() => {
                setIsDragging(false);
            }, []);

            useEffect(() => {
                if (isDragging) {
                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseUp);
                } else {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                }
                return () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                };
            }, [isDragging, handleMouseMove, handleMouseUp]);

            return (
                <div
                    className="p-4 bg-gray-800 bg-opacity-80 rounded-lg shadow-md text-white relative hover:ring-2 ring-accent-color cursor-grab"
                    onMouseDown={handleMouseDown}
                >
                    <h3 className="text-lg font-bold mb-1">Local Time</h3>
                    <p className="text-4xl font-mono">{time.toLocaleTimeString()}</p>
                    <button onClick={onClose} className="absolute top-1 right-1 text-gray-400 hover:text-white">&times;</button>
                </div>
            );
        }
    }],
    ['weather-widget', {
        name: 'Weather Forecast',
        description: 'Local weather conditions and forecast powered by external API',
        icon: '☀️',
        Component: ({ widgetId, onClose, position, onUpdatePosition }) => {
            const [weather, setWeather] = useState('Loading...');
            const [location, setLocation] = useState('New York'); // Example default
            const [isDragging, setIsDragging] = useState(false);
            const offset = useRef({ x: 0, y: 0 });

            useEffect(() => {
                const fetchWeather = async () => {
                    // AT-1224: Integrate with a Weather API (e.g., OpenWeatherMap, AccuWeather).
                    // This would involve API keys and geolocation permissions.
                    // For demo, simulate fetch.
                    console.log(`Fetching weather for ${location}...`);
                    setTimeout(() => {
                        const temps = [22, 25, 18, 20];
                        const conditions = ['Sunny', 'Partly Cloudy', 'Rainy'];
                        setWeather(`${temps[Math.floor(Math.random() * temps.length)]}°C, ${conditions[Math.floor(Math.random() * conditions.length)]}`);
                    }, 2000);
                };
                fetchWeather();
                const interval = setInterval(fetchWeather, 5 * 60 * 1000); // Update every 5 minutes
                return () => clearInterval(interval);
            }, [location]);

            const handleMouseDown = useCallback((e: React.MouseEvent) => {
                setIsDragging(true);
                offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
            }, [position]);

            const handleMouseMove = useCallback((e: MouseEvent) => {
                if (!isDragging) return;
                const newX = e.clientX - offset.current.x;
                const newY = e.clientY - offset.current.y;
                onUpdatePosition({ x: newX, y: newY });
            }, [isDragging, onUpdatePosition]);

            const handleMouseUp = useCallback(() => {
                setIsDragging(false);
            }, []);

            useEffect(() => {
                if (isDragging) {
                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseUp);
                } else {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                }
                return () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                };
            }, [isDragging, handleMouseMove, handleMouseUp]);


            return (
                <div
                    className="p-4 bg-gray-800 bg-opacity-80 rounded-lg shadow-md text-white relative hover:ring-2 ring-accent-color cursor-grab"
                    onMouseDown={handleMouseDown}
                >
                    <h3 className="text-lg font-bold mb-1">Weather in {location}</h3>
                    <p className="text-2xl">{weather}</p>
                    <button onClick={onClose} className="absolute top-1 right-1 text-gray-400 hover:text-white">&times;</button>
                </div>
            );
        }
    }],
    // AT-1225: Many more widgets can be added here (stock tickers, news feeds, system status, quick notes, RSS readers, email previews, etc.)
]);

// AT-1226: Global System Status Monitor.
// Displays real-time performance metrics, crucial for operations and user awareness.
export const SystemStatusMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState<SystemResourceMetrics | null>(null);
    const { monitoring: monitoringService, telemetry: telemetryService } = useSystemServices();
    const config = ServiceLocator.getConfigService().getConfig(); // Access current config dynamically

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (config.enableTelemetry) {
            interval = setInterval(() => {
                const currentMetrics = calculatePerformanceMetrics();
                setMetrics(currentMetrics);
                monitoringService.logMetric('cpu_usage', currentMetrics.cpuUsage, { type: 'system' });
                monitoringService.logMetric('memory_usage', currentMetrics.memoryUsage, { type: 'system' });
                monitoringService.logMetric('network_rx', currentMetrics.networkRx, { type: 'system' });
                monitoringService.logMetric('network_tx', currentMetrics.networkTx, { type: 'system' });
                monitoringService.logMetric('disk_io', currentMetrics.diskIO, { type: 'system' });
                // AT-1227: Send to telemetry service for long-term storage, trending, and visualization.
                telemetryService.recordEvent('system_resource_snapshot', currentMetrics);
            }, 5000); // Update every 5 seconds
        }

        return () => clearInterval(interval);
    }, [config.enableTelemetry, monitoringService, telemetryService]); // Re-run effect if telemetry setting changes

    if (!metrics || !config.enableTelemetry) return null; // Only render if enabled

    return (
        <div className="absolute bottom-12 left-4 p-2 bg-gray-800 bg-opacity-70 text-white rounded-md text-xs shadow-lg z-50">
            <h4 className="font-bold">System Status</h4>
            <p>CPU: {metrics.cpuUsage.toFixed(1)}%</p>
            <p>Mem: {metrics.memoryUsage.toFixed(0)} MB</p>
            <p>Net Rx: {metrics.networkRx.toFixed(0)}KB/s</p>
            <p>Net Tx: {metrics.networkTx.toFixed(0)}KB/s</p>
        </div>
    );
};

// AT-1228: Desktop Context Menu Component
// Provides quick access to desktop-level actions like settings, theme changes, and widget management.
export const DesktopContextMenu: React.FC<{
    position: { x: number; y: number } | null;
    onClose: () => void;
    onOpenFeature: (featureId: string, customState?: Partial<WindowState>) => void;
    onAddWidget: (widgetId: string, position: { x: number; y: number }) => void;
    onSwitchTheme: (themeId: string) => void;
    onOpenSearch: () => void;
    onLogout: () => void;
}> = ({ position, onClose, onOpenFeature, onAddWidget, onSwitchTheme, onOpenSearch, onLogout }) => {
    const { theme: themeService, auth: authService } = useSystemServices();
    const availableThemes = themeService.getAvailableThemes();
    const hasAdminPermissions = true; // Placeholder for actual permission check from authService.getCurrentUser().permissions

    if (!position) return null;

    const handleAction = (action: () => void) => {
        action();
        onClose(); // Close menu after action
    };

    return (
        <div
            className="absolute p-2 bg-gray-900 bg-opacity-95 rounded-lg shadow-xl text-white z-[var(--atlas-context-menu-z-index, 10001)] min-w-[180px]"
            style={{ left: position.x, top: position.y }}
            onMouseLeave={onClose} // AT-1229: Close on mouse leave for better UX
            onClick={onClose} // Close on any click inside the menu
        >
            <ul className="space-y-1">
                <li className="p-2 hover:bg-accent-color-hover rounded-md cursor-pointer" onClick={() => handleAction(onOpenSearch)}>
                    <span className="mr-2">🔎</span> Search / Ask AI
                </li>
                <li className="p-2 hover:bg-accent-color-hover rounded-md cursor-pointer" onClick={() => handleAction(() => onOpenFeature('settings'))}>
                    <span className="mr-2">⚙️</span> Desktop Settings
                </li>
                {hasAdminPermissions && ( // AT-1228.1: Admin-specific menu items
                    <li className="p-2 hover:bg-accent-color-hover rounded-md cursor-pointer" onClick={() => handleAction(() => onOpenFeature('admin-console'))}>
                        <span className="mr-2">🛠️</span> Admin Console
                    </li>
                )}
                <li className="relative group">
                    <span className="p-2 block hover:bg-accent-color-hover rounded-md cursor-pointer">
                        <span className="mr-2">🎨</span> Change Theme &gt;
                    </span>
                    <ul className="absolute left-full top-0 ml-1 p-2 bg-gray-900 bg-opacity-95 rounded-lg shadow-xl hidden group-hover:block w-40">
                        {Object.values(availableThemes).map(theme => (
                            <li key={theme.id} className="p-2 hover:bg-accent-color-hover rounded-md cursor-pointer" onClick={(e) => { e.stopPropagation(); handleAction(() => onSwitchTheme(theme.id)); }}>
                                {theme.name}
                            </li>
                        ))}
                    </ul>
                </li>
                <li className="relative group">
                    <span className="p-2 block hover:bg-accent-color-hover rounded-md cursor-pointer">
                        <span className="mr-2">🧩</span> Add Widget &gt;
                    </span>
                    <ul className="absolute left-full top-0 ml-1 p-2 bg-gray-900 bg-opacity-95 rounded-lg shadow-xl hidden group-hover:block w-40">
                        {Array.from(ALL_WIDGETS.entries()).map(([id, widget]) => (
                            <li key={id} className="p-2 hover:bg-accent-color-hover rounded-md cursor-pointer" onClick={(e) => { e.stopPropagation(); handleAction(() => onAddWidget(id, position)); }}>
                                {widget.icon} {widget.name}
                            </li>
                        ))}
                    </ul>
                </li>
                <li className="p-2 hover:bg-accent-color-hover rounded-md cursor-pointer" onClick={() => handleAction(() => onOpenFeature('about-atlas'))}>
                    <span className="mr-2">ℹ️</span> About Project Atlas
                </li>
                <hr className="my-1 border-gray-700" />
                <li className="p-2 hover:bg-red-700 rounded-md cursor-pointer" onClick={() => handleAction(onLogout)}>
                    <span className="mr-2">🚪</span> Logout
                </li>
            </ul>
        </div>
    );
};


// AT-1230: Screen lock / Idle Timeout Component
// Ensures security by locking the session after inactivity or on manual trigger.
export const ScreenLocker: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { auth: authService, telemetry: telemetryService } = useSystemServices();

    const handleUnlock = async () => {
        // AT-1231: Simulate authentication. In a real system, this would go through the authService.
        try {
            // For demo, any non-empty password will unlock if user is known.
            // In a real app, it would verify credentials against the AuthService securely.
            const user = await authService.getCurrentUser();
            if (user && password === 'demo') { // Example hardcoded demo password for mock user
                 // Simulate re-authentication or session revalidation.
                 await authService.login({ username: user.username, password: password });
                 onUnlock();
                 telemetryService.recordEvent('screen_unlocked_success', { userId: user.userId });
            } else {
                 setError('Incorrect password or invalid user. Please try again.');
                 telemetryService.recordEvent('screen_unlocked_failed');
            }
        } catch (err: any) {
            setError(`Authentication failed: ${err.message}. Please contact IT support.`);
            telemetryService.recordError(new Error(`Screen unlock error: ${err.message}`));
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center text-white z-[var(--atlas-screenlock-z-index, 99999)]">
            <div className="text-center">
                <h1 className="text-5xl font-extrabold mb-4">Project Atlas</h1>
                <p className="text-xl text-gray-300 mb-8">Secure Digital Workspace</p>
                <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96">
                    <h2 className="text-2xl font-bold mb-4">Session Locked</h2>
                    <p className="text-gray-400 mb-6">Enter your password to unlock your session.</p>
                    <input
                        type="password"
                        className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-color mb-4"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                        autoFocus
                        aria-label="Unlock password"
                    />
                    {error && <p className="text-red-400 text-sm mb-4" aria-live="assertive">{error}</p>}
                    <button
                        className="w-full bg-accent-color hover:bg-accent-color-hover text-white font-bold py-3 px-4 rounded-md transition-colors"
                        onClick={handleUnlock}
                    >
                        Unlock Session
                    </button>
                    <button
                        className="w-full mt-2 text-sm text-gray-400 hover:text-white"
                        onClick={() => authService.logout()} // Allow immediate logout from lock screen
                    >
                        Switch User / Logout
                    </button>
                </div>
            </div>
            <div className="absolute bottom-4 text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Citibank Demo Business Inc. All Rights Reserved.
            </div>
        </div>
    );
};


// Feature: AT-1232 - Core DesktopView Component Enhancements

export const DesktopView: React.FC<{ openFeatureId?: string, onNavigate: (view: ViewType, props?: any) => void; }> = ({ openFeatureId, onNavigate }) => {
    // AT-1233: Utilize Service Locator for dependency injection into the main component.
    const systemConfig = ServiceLocator.getConfigService();
    const notificationService = ServiceLocator.getNotificationService();
    const telemetryService = ServiceLocator.getTelemetryService();
    const themeService = ServiceLocator.getThemeService();
    const virtualDesktopService = ServiceLocator.getVirtualDesktopService();
    const authenticationService = ServiceLocator.getAuthenticationService();

    // AT-1234: Enhanced state management for windows, desktops, and UI elements.
    const [windows, setWindows] = useState<Record<string, WindowState>>({});
    const [activeId, setActiveId] = useState<string | null>(null);
    const [nextZIndex, setNextZIndex] = useState(Z_INDEX_BASE);
    const [activeTheme, setActiveTheme] = useState<DesktopTheme>(themeService.getCurrentTheme());
    const [activeDesktopId, setActiveDesktopId] = useState<string>(virtualDesktopService.getActiveDesktopId());
    const [showSearchOverlay, setShowSearchOverlay] = useState(false); // AT-1235: State for controlling search overlay visibility
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null); // AT-1236: Desktop context menu state
    const [desktopWidgets, setDesktopWidgets] = useState<Record<string, { id: string, type: string, position: { x: number; y: number } }>>({}); // AT-1237: Widgets state, including their position
    const [isLocked, setIsLocked] = useState(false); // AT-1238: Screen lock state
    const [lastActivity, setLastActivity] = useState(Date.now()); // AT-1239: User activity timestamp for idle timeout
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null); // AT-1240: User profile state, derived from AuthService

    // AT-1241: Dynamic configuration updates. Subscribe to config service for real-time changes.
    const [currentSystemConfig, setCurrentSystemConfig] = useState<SystemConfig>(systemConfig.getConfig());
    useEffect(() => {
        const unsubscribe = systemConfig.subscribe(config => {
            setCurrentSystemConfig(config);
            telemetryService.recordEvent('desktop_config_reloaded');
        });
        return () => unsubscribe();
    }, [systemConfig, telemetryService]);

    // AT-1242: Subscribe to Theme Service changes to dynamically update desktop visuals.
    useEffect(() => {
        const unsubscribe = themeService.subscribe(theme => {
            setActiveTheme(theme);
            telemetryService.recordEvent('desktop_theme_updated', { themeId: theme.id });
        });
        return () => unsubscribe();
    }, [themeService, telemetryService]);

    // AT-1243: Subscribe to Virtual Desktop Service changes for dynamic desktop switching.
    useEffect(() => {
        const unsubscribe = virtualDesktopService.subscribe(() => {
            setActiveDesktopId(virtualDesktopService.getActiveDesktopId());
            // AT-1244: Persist window-desktop assignments or move windows if a desktop is removed.
            setWindows(prevWindows => {
                const updatedWindows: Record<string, WindowState> = {};
                Object.values(prevWindows).forEach(win => {
                    // If a window is on a removed desktop, move it to the active one.
                    const desktopExists = virtualDesktopService.getDesktops().some(d => d.id === win.desktopId);
                    updatedWindows[win.id] = {
                        ...win,
                        desktopId: desktopExists ? win.desktopId : virtualDesktopService.getActiveDesktopId(),
                    };
                });
                return updatedWindows;
            });
            telemetryService.recordEvent('desktop_view_changed', { newDesktopId: virtualDesktopService.getActiveDesktopId() });
        });
        return () => unsubscribe();
    }, [virtualDesktopService, telemetryService]);

    // AT-1245: Subscribe to Auth Service for real-time user state (login/logout).
    useEffect(() => {
        const unsubscribe = authenticationService.subscribeAuthChange(user => {
            setCurrentUser(user);
            if (!user) {
                // If user logs out, clear all windows for data security and navigate to login/lock screen.
                setWindows({});
                setIsLocked(true); // Automatically lock on logout
                onNavigate('login', {}); // Example navigation to login, or a specific logout view.
            }
        });
        // AT-1246: Initial check for login status on component mount.
        authenticationService.getCurrentUser().then(user => {
            setCurrentUser(user);
            if (!user) {
                setIsLocked(true); // Lock if no user is logged in on mount
            }
        });
        return () => unsubscribe();
    }, [authenticationService, onNavigate]);

    // AT-1247: Idle Timeout and Screen Lock Mechanism for enterprise-grade security.
    useEffect(() => {
        const checkIdle = () => {
            if (currentSystemConfig.idleTimeoutMinutes > 0 && currentUser && !isLocked) {
                const idleTime = (Date.now() - lastActivity) / (1000 * 60); // in minutes
                if (idleTime >= currentSystemConfig.idleTimeoutMinutes) {
                    setIsLocked(true);
                    telemetryService.recordEvent('screen_locked_idle', { duration: idleTime.toFixed(1), userId: currentUser.userId });
                    notificationService.addNotification({
                        title: 'Session Locked',
                        message: 'Your session has been locked due to inactivity. Please unlock to continue.',
                        type: 'warning',
                        duration: 5000,
                    });
                }
            }
        };

        const activityListener = () => {
            if (!isLocked) { // Only update activity if not already locked
                setLastActivity(Date.now());
            }
        };

        // AT-1248: Register global activity listeners across various input methods.
        document.addEventListener('mousemove', activityListener);
        document.addEventListener('keydown', activityListener);
        document.addEventListener('click', activityListener);
        document.addEventListener('scroll', activityListener); // Captures scroll activity

        const idleInterval = setInterval(checkIdle, 30 * 1000); // Check every 30 seconds

        return () => {
            clearInterval(idleInterval);
            document.removeEventListener('mousemove', activityListener);
            document.removeEventListener('keydown', activityListener);
            document.removeEventListener('click', activityListener);
            document.removeEventListener('scroll', activityListener);
        };
    }, [currentSystemConfig, lastActivity, isLocked, currentUser, telemetryService, notificationService]);


    const openWindow = useCallback((featureId: string, customState?: Partial<WindowState>) => {
        if (!featureId) return;
        telemetryService.recordEvent('window_open_attempt', { featureId });

        const newZIndex = nextZIndex + 1;
        setNextZIndex(newZIndex);
        setActiveId(featureId);

        setWindows(prev => {
            const existingWindow = prev[featureId];
            if (existingWindow) {
                // AT-1249: Bring existing window to front, restore if minimized, and update to current desktop.
                telemetryService.recordEvent('window_restore', { featureId });
                return {
                    ...prev,
                    [featureId]: {
                        ...existingWindow,
                        isMinimized: false,
                        zIndex: newZIndex,
                        isMaximized: false, // Restoring from minimized generally implies not maximized
                        desktopId: virtualDesktopService.getActiveDesktopId(), // Move to current desktop if not already there
                        ...customState, // Apply custom state if provided (e.g., specific position from a saved layout)
                    }
                };
            }

            const openWindowsOnCurrentDesktop = Object.values(prev).filter(w => !w.isMinimized && w.desktopId === virtualDesktopService.getActiveDesktopId()).length;
            const newWindow: WindowState = {
                id: featureId,
                // Offset new windows to prevent them from stacking directly on top of each other.
                position: { x: 50 + (openWindowsOnCurrentDesktop % 5) * 30, y: 50 + (openWindowsOnCurrentDesktop % 5) * 30 },
                size: { width: 800, height: 600 },
                zIndex: newZIndex,
                isMinimized: false,
                isMaximized: false,
                isResizing: false,
                isDragging: false,
                desktopId: virtualDesktopService.getActiveDesktopId(), // AT-1250: New windows open on the currently active desktop
                opacity: 1, // Default full opacity
                ...customState, // Apply any custom initial state provided (e.g., initial position, size)
            };
            telemetryService.recordEvent('window_created', { featureId, desktopId: newWindow.desktopId });
            return { ...prev, [featureId]: newWindow };
        });
    }, [nextZIndex, telemetryService, virtualDesktopService]);
    
    useEffect(() => {
        if(openFeatureId && !isLocked && currentUser) { // AT-1251: Prevent opening features if screen is locked or no user
            openWindow(openFeatureId);
            // Reset the view in global state so it doesn't re-trigger, crucial for single-use navigation.
            onNavigate('dashboard', {}); // AT-1252: Assuming 'dashboard' is the default view after opening a feature
        }
    }, [openFeatureId, openWindow, onNavigate, isLocked, currentUser]);

    // AT-1253: Unified window action handlers, promoting consistency.
    const closeWindow = useCallback((id: string) => {
        setWindows(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
        if (activeId === id) {
            setActiveId(null); // Clear active window if it was the one being closed
        }
        telemetryService.recordEvent('window_closed', { featureId: id });
    }, [activeId, telemetryService]);

    const minimizeWindow = useCallback((id: string) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], isMinimized: true, isMaximized: false } // AT-1254: Minimize implies not maximized
        }));
        setActiveId(null); // No active window when minimized
        telemetryService.recordEvent('window_minimized', { featureId: id });
    }, [telemetryService]);

    const maximizeWindow = useCallback((id: string) => {
        setWindows(prev => {
            const current = prev[id];
            if (!current) return prev;

            // AT-1255: Toggle maximize. If already maximized, restore to previous size/position.
            // In a full system, `previousSize` and `previousPosition` would be stored on the window state.
            const isMaximized = !current.isMaximized;
            const newSize = isMaximized
                ? { width: window.innerWidth, height: window.innerHeight - 40 /* Adjusted for Taskbar height */ }
                : { width: current.size.width, height: current.size.height }; // Restore to last known size (simplified)
            const newPosition = isMaximized
                ? { x: 0, y: 0 }
                : { x: current.position.x, y: current.position.y }; // Restore to last known position (simplified)

            return {
                ...prev,
                [id]: {
                    ...current,
                    isMaximized: isMaximized,
                    isMinimized: false, // Maximizing brings it out of minimized state
                    size: newSize,
                    position: newPosition,
                    zIndex: nextZIndex + 1, // Bring to front when maximized
                }
            };
        });
        setNextZIndex(prev => prev + 1);
        setActiveId(id);
        telemetryService.recordEvent('window_maximized', { featureId: id });
    }, [nextZIndex, telemetryService]);

    const focusWindow = useCallback((id: string) => {
        if (id === activeId) return; // Already active
        const newZIndex = nextZIndex + 1;
        setNextZIndex(newZIndex);
        setActiveId(id);
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], zIndex: newZIndex, isMinimized: false } // AT-1256: Focusing also restores if minimized
        }));
        telemetryService.recordEvent('window_focused', { featureId: id });
    }, [activeId, nextZIndex, telemetryService]);
    
    const updateWindowState = useCallback((id: string, updates: Partial<WindowState>) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], ...updates }
        }));
        // AT-1257: Telemetry for window state changes (e.g., resizing, dragging completion)
        // Helps analyze UI/UX interactions and potential performance bottlenecks.
        if (updates.position || updates.size || updates.isResizing === false || updates.isDragging === false) {
            telemetryService.recordEvent('window_transformed', { featureId: id, updates: Object.keys(updates) });
        }
    }, [telemetryService]);

    // AT-1258: Filtering windows based on the currently active virtual desktop, crucial for multi-desktop experience.
    const windowsOnActiveDesktop = Object.values(windows).filter(w => !w.isMinimized && w.desktopId === activeDesktopId);
    const minimizedWindows = Object.values(windows).filter(w => w.isMinimized);
    const featuresMap = new Map(ALL_FEATURES.map(f => [f.id, f]));

    // AT-1259: Handlers for Desktop Context Menu (right-click).
    const handleDesktopRightClick = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Prevent native browser context menu
        setContextMenu({ x: event.clientX, y: event.clientY });
        telemetryService.recordEvent('desktop_context_menu_opened');
    }, [telemetryService]);

    const handleContextMenuClose = useCallback(() => {
        setContextMenu(null);
    }, []);

    const handleAddWidget = useCallback((widgetType: string, position: { x: number; y: number }) => {
        setDesktopWidgets(prev => ({
            ...prev,
            [generateUniqueId()]: { // Unique ID for each widget *instance*
                id: generateUniqueId(),
                type: widgetType,
                position: { x: position.x - 50, y: position.y - 20 } // Offset slightly from mouse click
            }
        }));
        telemetryService.recordEvent('widget_added', { widgetType });
    }, [telemetryService]);

    const handleUpdateWidgetPosition = useCallback((instanceId: string, newPosition: { x: number; y: number }) => {
        setDesktopWidgets(prev => ({
            ...prev,
            [instanceId]: {
                ...prev[instanceId],
                position: newPosition,
            },
        }));
    }, []);

    const handleRemoveWidget = useCallback((instanceId: string) => {
        setDesktopWidgets(prev => {
            const newState = { ...prev };
            delete newState[instanceId];
            return newState;
        });
        telemetryService.recordEvent('widget_removed', { instanceId });
    }, [telemetryService]);

    // AT-1260: Dynamic styling based on current theme and active desktop wallpaper.
    const desktopBackgroundStyle = useMemo(() => ({
        backgroundImage: `url(${virtualDesktopService.getDesktops().find(d => d.id === activeDesktopId)?.wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // Fallback or overlay color from active theme
        backgroundColor: activeTheme.backgroundColor,
        fontFamily: activeTheme.fontFamily,
    }), [activeDesktopId, virtualDesktopService, activeTheme]);

    // AT-1261: Enforce login requirement by rendering the ScreenLocker component.
    // This is a critical security measure for a commercial-grade application.
    if (!currentUser && currentSystemConfig.securityLevel !== 'low') {
        return <ScreenLocker onUnlock={() => authenticationService.getCurrentUser().then(user => { if (user) { setIsLocked(false); setCurrentUser(user); } })} />;
    }

    if (isLocked) {
        return <ScreenLocker onUnlock={() => setIsLocked(false)} />;
    }

    return (
        <div
            className="h-full flex flex-row w-full relative overflow-hidden transition-colors duration-500"
            style={desktopBackgroundStyle} // AT-1262: Apply dynamic desktop background and theme styles
            onContextMenu={handleDesktopRightClick}
            onClick={handleContextMenuClose} // Close context menu on any left click on desktop
        >
            {/* AT-1263: Virtual Desktop Indicator, showing current desktop name for user orientation. */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-900 bg-opacity-70 text-white px-3 py-1 rounded-full text-xs z-50 shadow-md">
                Desktop: {virtualDesktopService.getDesktops().find(d => d.id === activeDesktopId)?.name}
            </div>

            <FeatureDock onOpen={openWindow} />
            <div className="flex-grow relative overflow-hidden">
                {/* AT-1264: Render Desktop Widgets dynamically. */}
                {Object.values(desktopWidgets).filter(w => {
                    // Widgets are currently global. For per-desktop widgets, widget state would need `desktopId`.
                    // For now, render all or apply a filter based on current desktop.
                    return true;
                }).map(widgetInstance => {
                    const WidgetComponent = ALL_WIDGETS.get(widgetInstance.type)?.Component;
                    if (!WidgetComponent) return null;
                    return (
                        <div
                            key={widgetInstance.id}
                            className="absolute z-[var(--atlas-widget-z-index, 100)]"
                            style={{ left: widgetInstance.position.x, top: widgetInstance.position.y }}
                        >
                            <WidgetComponent
                                widgetId={widgetInstance.id}
                                onClose={() => handleRemoveWidget(widgetInstance.id)}
                                position={widgetInstance.position}
                                onUpdatePosition={(newPos) => handleUpdateWidgetPosition(widgetInstance.id, newPos)}
                                // AT-1265: Pass data streams, e.g., for real-time stock tickers or system metrics.
                                dataStream={widgetInstance.type === 'system-status' ? ServiceLocator.getMonitoringService() : undefined}
                            />
                        </div>
                    );
                })}

                {windowsOnActiveDesktop.map(win => {
                    const feature = featuresMap.get(win.id);
                    if (!feature) {
                        // AT-1266: Handle cases where a feature might have been uninstalled or is unavailable.
                        notificationService.addNotification({
                            title: 'Feature Not Found',
                            message: `The feature "${win.id}" could not be loaded. It may have been uninstalled or is temporarily unavailable.`,
                            type: 'error',
                            duration: 7000,
                        });
                        return null;
                    }
                    return (
                        <Window
                            key={win.id}
                            feature={feature}
                            state={win}
                            isActive={win.id === activeId}
                            onClose={() => closeWindow(win.id)}
                            onMinimize={() => minimizeWindow(win.id)}
                            onMaximize={() => maximizeWindow(win.id)} // AT-1267: New maximize handler for window component
                            onFocus={() => focusWindow(win.id)}
                            onUpdate={updateWindowState}
                            telemetryService={telemetryService} // AT-1268: Pass telemetry service to Window for granular event tracking
                            // AT-1269: Pass other services for window's internal components to consume, if needed.
                            // This reduces prop drilling and ensures consistency.
                            // E.g., authService={authenticationService}, aiService={ServiceLocator.getAIService()}
                        />
                    );
                })}
                <ActionManager />
                <SystemNotificationDisplay /> {/* AT-1270: Render system notifications */}
                <SystemStatusMonitor /> {/* AT-1271: Render system resource monitor */}
            </div>
            <Taskbar
                minimizedWindows={minimizedWindows.map(w => featuresMap.get(w.id)).filter(Boolean) as Feature[]}
                openWindows={windowsOnActiveDesktop.map(w => featuresMap.get(w.id)).filter(Boolean) as Feature[]} // AT-1272: Pass open windows for better taskbar functionality (e.g., active indicators)
                onRestore={openWindow}
                onOpenSearch={() => setShowSearchOverlay(true)} // AT-1273: Taskbar can open global search
                onSwitchDesktop={virtualDesktopService.setActiveDesktop} // AT-1274: Taskbar can switch desktops
                activeDesktopId={activeDesktopId}
                allDesktops={virtualDesktopService.getDesktops()}
                // AT-1274.1: Pass logout function to taskbar for quick access.
                onLogout={() => authenticationService.logout()}
            />
            <SystemSearchOverlay isOpen={showSearchOverlay} onClose={() => setShowSearchOverlay(false)} /> {/* AT-1275: Render search overlay */}
            <DesktopContextMenu
                position={contextMenu}
                onClose={handleContextMenuClose}
                onOpenFeature={openWindow}
                onAddWidget={handleAddWidget}
                onSwitchTheme={themeService.applyTheme}
                onOpenSearch={() => { setShowSearchOverlay(true); handleContextMenuClose(); }}
                onLogout={() => authenticationService.logout()}
            />
        </div>
    );
};
// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React from 'react';
import type { Feature } from '../../types.ts';
import { RAW_FEATURES } from '../../constants.tsx';
import { lazyWithRetry } from '../../services/componentLoader.ts';

// --- The Grand Vision: Project Athena at Citibank Demo Business Inc. ---
// Under the pioneering leadership of President James Burvel Oâ€™Callaghan III, Citibank Demo Business Inc.
// embarked on an ambitious journey: "Project Athena." The core directive was clear and revolutionary:
// to engineer the most comprehensive, intelligent, and resilient development platform ever conceived.
// This platform would serve as the singular truth for building commercial-grade applications,
// capable of integrating thousands of external services, driven by the most advanced AI models like Gemini and ChatGPT.

// This file, `components/features/index.ts`, is the living testament to this monumental endeavor.
// It enumerates the vast array of capabilities that form the "Cognitive Development Suite" –
// a collection of features each meticulously designed to enhance productivity, enforce security,
// ensure compliance, and unlock unprecedented innovation across the entire software development lifecycle.

// The journey began with foundational tools (our original features), but quickly scaled to encompass
// an unimaginable breadth of functionalities, from hyper-intelligent AI co-pilots to multi-cloud orchestrators,
// from predictive security analytics to ethical AI governance. Every entry below represents
// a distinct triumph of engineering and vision, a step towards a truly autonomous and intelligent
// software ecosystem. This codebase tells the story of how we built the future, one feature at a time,
// anticipating every technical and logical need, leaving no stone unturned in our quest for perfection.

const componentMap: Record<string, React.FC<any>> = {
    // --- Phase 0: The Foundational Pillars (Initial Core Features) ---
    // These initial features laid the groundwork, demonstrating the core potential of AI-driven development.
    // They proved the viability of Project Athena, blending essential developer tools with nascent AI capabilities.
    'ai-command-center': lazyWithRetry(() => import('./AiCommandCenter.tsx'), 'AiCommandCenter'),
    'project-explorer': lazyWithRetry(() => import('./ProjectExplorer.tsx'), 'ProjectExplorer'),
    'workspace-connector-hub': lazyWithRetry(() => import('./WorkspaceConnectorHub.tsx'), 'WorkspaceConnectorHub'),
    'ai-code-explainer': lazyWithRetry(() => import('./AiCodeExplainer.tsx'), 'AiCodeExplainer'),
    'ai-feature-builder': lazyWithRetry(() => import('./AiFeatureBuilder.tsx'), 'AiFeatureBuilder'),
    'regex-sandbox': lazyWithRetry(() => import('./RegexSandbox.tsx'), 'RegexSandbox'),
    'portable-snippet-vault': lazyWithRetry(() => import('./SnippetVault.tsx'), 'SnippetVault'),
    'css-grid-editor': lazyWithRetry(() => import('./CssGridEditor.tsx'), 'CssGridEditor'),
    'ai-commit-generator': lazyWithRetry(() => import('./AiCommitGenerator.tsx'), 'AiCommitGenerator'),
    'json-tree-navigator': lazyWithRetry(() => import('./JsonTreeNavigator.tsx'), 'JsonTreeNavigator'),
    'xbrl-converter': lazyWithRetry(() => import('./XbrlConverter.tsx'), 'XbrlConverter'),
    'ai-unit-test-generator': lazyWithRetry(() => import('./AiUnitTestGenerator.tsx'), 'AiUnitTestGenerator'),
    'prompt-craft-pad': lazyWithRetry(() => import('./PromptCraftPad.tsx'), 'PromptCraftPad'),
    'linter-formatter': lazyWithRetry(() => import('./CodeFormatter.tsx'), 'CodeFormatter'),
    'schema-designer': lazyWithRetry(() => import('./SchemaDesigner.tsx'), 'SchemaDesigner'),
    'pwa-manifest-editor': lazyWithRetry(() => import('./PwaManifestEditor.tsx'), 'PwaManifestEditor'),
    'markdown-slides-generator': lazyWithRetry(() => import('./MarkdownSlides.tsx'), 'MarkdownSlides'),
    'screenshot-to-component': lazyWithRetry(() => import('./ScreenshotToComponent.tsx'), 'ScreenshotToComponent'),
    'digital-whiteboard': lazyWithRetry(() => import('./DigitalWhiteboard.tsx'), 'DigitalWhiteboard'),
    'theme-designer': lazyWithRetry(() => import('./ThemeDesigner.tsx'), 'ThemeDesigner'),
    'svg-path-editor': lazyWithRetry(() => import('./SvgPathEditor.tsx'), 'SvgPathEditor'),
    'ai-style-transfer': lazyWithRetry(() => import('./AiStyleTransfer.tsx'), 'AiStyleTransfer'),
    'ai-coding-challenge': lazyWithRetry(() => import('./AiCodingChallenge.tsx'), 'AiCodingChallenge'),
    'typography-lab': lazyWithRetry(() => import('./TypographyLab.tsx'), 'TypographyLab'),
    'code-review-bot': lazyWithRetry(() => import('./CodeReviewBot.tsx'), 'CodeReviewBot'),
    'ai-pull-request-assistant': lazyWithRetry(() => import('./AiPullRequestAssistant.tsx'), 'AiPullRequestAssistant'),
    'changelog-generator': lazyWithRetry(() => import('./ChangelogGenerator.tsx'), 'ChangelogGenerator'),
    'cron-job-builder': lazyWithRetry(() => import('./CronJobBuilder.tsx'), 'CronJobBuilder'),
    'ai-code-migrator': lazyWithRetry(() => import('./AiCodeMigrator.tsx'), 'AiCodeMigrator'),
    'visual-git-tree': lazyWithRetry(() => import('./VisualGitTree.tsx'), 'VisualGitTree'),
    'worker-thread-debugger': lazyWithRetry(() => import('./WorkerThreadDebugger.tsx'), 'WorkerThreadDebugger'),
    'ai-image-generator': lazyWithRetry(() => import('./AiImageGenerator.tsx'), 'AiImageGenerator'),
    'async-call-tree-viewer': lazyWithRetry(() => import('./AsyncCallTreeViewer.tsx'), 'AsyncCallTreeViewer'),
    'audio-to-code': lazyWithRetry(() => import('./AudioToCode.tsx'), 'AudioToCode'),
    'code-diff-ghost': lazyWithRetry(() => import('./CodeDiffGhost.tsx'), 'CodeDiffGhost'),
    'code-spell-checker': lazyWithRetry(() => import('./CodeSpellChecker.tsx'), 'CodeSpellChecker'),
    'color-palette-generator': lazyWithRetry(() => import('./ColorPaletteGenerator.tsx'), 'ColorPaletteGenerator'),
    'logic-flow-builder': lazyWithRetry(() => import('./LogicFlowBuilder.tsx'), 'LogicFlowBuilder'),
    'meta-tag-editor': lazyWithRetry(() => import('./MetaTagEditor.tsx'), 'MetaTagEditor'),
    'network-visualizer': lazyWithRetry(() => import('./NetworkVisualizer.tsx'), 'NetworkVisualizer'),
    'responsive-tester': lazyWithRetry(() => import('./ResponsiveTester.tsx'), 'ResponsiveTester'),
    'sass-scss-compiler': lazyWithRetry(() => import('./SassScssCompiler.tsx'), 'SassScssCompiler'),
    'api-mock-generator': lazyWithRetry(() => import('./ApiMockGenerator.tsx'), 'ApiMockGenerator'),
    'env-manager': lazyWithRetry(() => import('./EnvManager.tsx'), 'EnvManager'),
    'performance-profiler': lazyWithRetry(() => import('./PerformanceProfiler.tsx'), 'PerformanceProfiler'),
    'a11y-auditor': lazyWithRetry(() => import('./AccessibilityAuditor.tsx'), 'AccessibilityAuditor'),
    'ci-cd-generator': lazyWithRetry(() => import('./CiCdPipelineGenerator.tsx'), 'CiCdPipelineGenerator'),
    'deployment-preview': lazyWithRetry(() => import('./DeploymentPreview.tsx'), 'DeploymentPreview'),
    'security-scanner': lazyWithRetry(() => import('./SecurityScanner.tsx'), 'SecurityScanner'),
    'terraform-generator': lazyWithRetry(() => import('./TerraformGenerator.tsx'), 'TerraformGenerator'),
    'ai-personality-forge': lazyWithRetry(() => import('./AiPersonalityForge.tsx'), 'AiPersonalityForge'),
    'weekly-digest-generator': lazyWithRetry(() => import('./WeeklyDigestGenerator.tsx'), 'WeeklyDigestGenerator'),
    'one-click-refactor': lazyWithRetry(() => import('./OneClickRefactor.tsx'), 'OneClickRefactor'),
    'bug-reproducer': lazyWithRetry(() => import('./BugReproducer.tsx'), 'BugReproducer'),
    'tech-debt-sonar': lazyWithRetry(() => import('./TechDebtSonar.tsx'), 'TechDebtSonar'),
    'iam-policy-generator': lazyWithRetry(() => import('./IamPolicyGenerator.tsx'), 'IamPolicyGenerator'),
    'iam-policy-visualizer': lazyWithRetry(() => import('./IamPolicyVisualizer.tsx'), 'IamPolicyVisualizer'),
    'gmail-addon-simulator': lazyWithRetry(() => import('./GmailAddonSimulator.tsx'), 'GmailAddonSimulator'),
    'pr-summary-generator': lazyWithRetry(() => import('./PrSummaryGenerator.tsx'), 'PrSummaryGenerator'),
    'project-moodboard': lazyWithRetry(() => import('./ProjectMoodboard.tsx'), 'ProjectMoodboard'),
    'font-preview-picker': lazyWithRetry(() => import('./FontPreviewPicker.tsx'), 'FontPreviewPicker'),
    'font-pairing-tool': lazyWithRetry(() => import('./FontPairingTool.tsx'), 'FontPairingTool'),

    // --- Phase 1: Hyper-Accelerated AI-Native Development (Gemini & ChatGPT at the Core) ---
    // This phase saw the deep integration of Google's Gemini and OpenAI's ChatGPT,
    // transforming development into a conversation with highly intelligent co-pilots.
    // Each feature here is designed to leverage multimodal AI for unprecedented automation and insight.
    'ai-prompt-engineering-studio': lazyWithRetry(() => import('./AiPromptEngineeringStudio.tsx'), 'AiPromptEngineeringStudio'), // Dedicated environment for crafting and testing prompts for Gemini/ChatGPT.
    'ai-agent-orchestrator': lazyWithRetry(() => import('./AiAgentOrchestrator.tsx'), 'AiAgentOrchestrator'), // Manages and deploys multiple AI agents for complex tasks.
    'ai-code-reasoning-engine': lazyWithRetry(() => import('./AiCodeReasoningEngine.tsx'), 'AiCodeReasoningEngine'), // Explains *why* code works or fails, not just *what* it does.
    'ai-semantic-code-search': lazyWithRetry(() => import('./AiSemanticCodeSearch.tsx'), 'AiSemanticCodeSearch'), // Natural language search for code snippets and functions.
    'ai-multi-language-translator': lazyWithRetry(() => import('./AiMultiLanguageTranslator.tsx'), 'AiMultiLanguageTranslator'), // Translates code between different programming languages.
    'ai-framework-migrator': lazyWithRetry(() => import('./AiFrameworkMigrator.tsx'), 'AiFrameworkMigrator'), // Assists in migrating projects between different JS frameworks (React to Vue, etc.).
    'ai-architecture-generator': lazyWithRetry(() => import('./AiArchitectureGenerator.tsx'), 'AiArchitectureGenerator'), // Generates high-level system architectures from requirements.
    'ai-data-model-synthesizer': lazyWithRetry(() => import('./AiDataModelSynthesizer.tsx'), 'AiDataModelSynthesizer'), // Creates database schemas and data models from business logic.
    'ai-test-case-creator': lazyWithRetry(() => import('./AiTestCaseCreator.tsx'), 'AiTestCaseCreator'), // Generates exhaustive test cases, including edge cases, using Gemini.
    'ai-api-endpoint-creator': lazyWithRetry(() => import('./AiApiEndpointCreator.tsx'), 'AiApiEndpointCreator'), // Scaffolds full API endpoints with documentation and validation.
    'ai-ui-component-composer': lazyWithRetry(() => import('./AiUiComponentComposer.tsx'), 'AiUiComponentComposer'), // Builds interactive UI components from design descriptions.
    'ai-performance-profiling-assistant': lazyWithRetry(() => import('./AiPerformanceProfilingAssistant.tsx'), 'AiPerformanceProfilingAssistant'), // Identifies and suggests fixes for performance bottlenecks.
    'ai-security-vulnerability-fixer': lazyWithRetry(() => import('./AiSecurityVulnerabilityFixer.tsx'), 'AiSecurityVulnerabilityFixer'), // Automatically patches known security flaws.
    'ai-compliance-checker': lazyWithRetry(() => import('./AiComplianceChecker.tsx'), 'AiComplianceChecker'), // Verifies code against regulatory standards (GDPR, HIPAA, etc.).
    'ai-technical-debt-remediator': lazyWithRetry(() => import('./AiTechnicalDebtRemediator.tsx'), 'AiTechnicalDebtRemediator'), // Proposes and executes refactoring to reduce tech debt.
    'ai-cloud-resource-optimizer': lazyWithRetry(() => import('./AiCloudResourceOptimizer.tsx'), 'AiCloudResourceOptimizer'), // Suggests cost and performance optimizations for cloud infrastructure.
    'ai-documentation-sync': lazyWithRetry(() => import('./AiDocumentationSync.tsx'), 'AiDocumentationSync'), // Keeps code comments, READMEs, and wikis in sync with code changes.
    'ai-code-summarizer': lazyWithRetry(() => import('./AiCodeSummarizer.tsx'), 'AiCodeSummarizer'), // Generates concise summaries of complex code blocks.
    'ai-code-completion-pro': lazyWithRetry(() => import('./AiCodeCompletionPro.tsx'), 'AiCodeCompletionPro'), // Advanced, context-aware code completion across languages.
    'ai-pair-programming-bot': lazyWithRetry(() => import('./AiPairProgrammingBot.tsx'), 'AiPairProgrammingBot'), // Simulates a pair programmer, offering suggestions and challenges.
    'ai-user-story-generator': lazyWithRetry(() => import('./AiUserStoryGenerator.tsx'), 'AiUserStoryGenerator'), // Crafts detailed user stories from high-level requirements.
    'ai-acceptance-criteria-writer': lazyWithRetry(() => import('./AiAcceptanceCriteriaWriter.tsx'), 'AiAcceptanceCriteriaWriter'), // Automatically generates acceptance criteria for user stories.
    'ai-mock-data-generator': lazyWithRetry(() => import('./AiMockDataGenerator.tsx'), 'AiMockDataGenerator'), // Creates realistic mock data for development and testing.
    'ai-synthetic-test-scenario-builder': lazyWithRetry(() => import('./AiSyntheticTestScenarioBuilder.tsx'), 'AiSyntheticTestScenarioBuilder'), // Generates complex end-to-end test scenarios.
    'ai-root-cause-analysis-engine': lazyWithRetry(() => import('./AiRootCauseAnalysisEngine.tsx'), 'AiRootCauseAnalysisEngine'), // Pinpoints the source of bugs and failures using logs and metrics.
    'ai-chatbot-dialog-flow-designer': lazyWithRetry(() => import('./AiChatbotDialogFlowDesigner.tsx'), 'AiChatbotDialogFlowDesigner'), // Designs and implements conversational AI flows.
    'ai-voice-assistant-integrator': lazyWithRetry(() => import('./AiVoiceAssistantIntegrator.tsx'), 'AiVoiceAssistantIntegrator'), // Connects voice UIs to application logic.
    'ai-sentiment-analysis-debugger': lazyWithRetry(() => import('./AiSentimentAnalysisDebugger.tsx'), 'AiSentimentAnalysisDebugger'), // Analyzes user feedback for sentiment trends.
    'ai-code-dependency-visualizer': lazyWithRetry(() => import('./AiCodeDependencyVisualizer.tsx'), 'AiCodeDependencyVisualizer'), // Maps out internal and external code dependencies.
    'ai-knowledge-graph-constructor': lazyWithRetry(() => import('./AiKnowledgeGraphConstructor.tsx'), 'AiKnowledgeGraphConstructor'), // Builds and queries project-specific knowledge graphs.
    'ai-data-transformation-wizard': lazyWithRetry(() => import('./AiDataTransformationWizard.tsx'), 'AiDataTransformationWizard'), // Guides through complex data mapping and transformation.
    'ai-code-obfuscator': lazyWithRetry(() => import('./AiCodeObfuscator.tsx'), 'AiCodeObfuscator'), // Protects proprietary code through AI-driven obfuscation techniques.
    'ai-watermarking-tool': lazyWithRetry(() => import('./AiWatermarkingTool.tsx'), 'AiWatermarkingTool'), // Embeds digital watermarks into code and assets for IP protection.
    'ai-automated-code-patcher': lazyWithRetry(() => import('./AiAutomatedCodePatcher.tsx'), 'AiAutomatedCodePatcher'), // Creates and applies hotfixes with minimal human intervention.
    'ai-predictive-maintenance-scheduler': lazyWithRetry(() => import('./AiPredictiveMaintenanceScheduler.tsx'), 'AiPredictiveMaintenanceScheduler'), // Schedules proactive maintenance based on system telemetry.
    'ai-resource-forecasting': lazyWithRetry(() => import('./AiResourceForecasting.tsx'), 'AiResourceForecasting'), // Predicts future resource needs for infrastructure planning.
    'ai-dynamic-scaling-optimizer': lazyWithRetry(() => import('./AiDynamicScalingOptimizer.tsx'), 'AiDynamicScalingOptimizer'), // Automatically adjusts cloud resources based on predicted load.
    'ai-carbon-footprint-analyzer': lazyWithRetry(() => import('./AiCarbonFootprintAnalyzer.tsx'), 'AiCarbonFootprintAnalyzer'), // Estimates environmental impact of cloud services.
    'ai-sustainable-coding-advisor': lazyWithRetry(() => import('./AiSustainableCodingAdvisor.tsx'), 'AiSustainableCodingAdvisor'), // Recommends energy-efficient coding practices.
    'ai-explainable-ai-debugger': lazyWithRetry(() => import('./AiExplainableAiDebugger.tsx'), 'AiExplainableAiDebugger'), // Provides insights into AI model decisions (XAI).
    'ai-model-bias-detector': lazyWithRetry(() => import('./AiModelBiasDetector.tsx'), 'AiModelBiasDetector'), // Identifies and suggests mitigation for biases in AI models.
    'ai-federated-learning-orchestrator': lazyWithRetry(() => import('./AiFederatedLearningOrchestrator.tsx'), 'AiFederatedLearningOrchestrator'), // Manages distributed AI model training.
    'ai-quantum-algorithm-designer': lazyWithRetry(() => import('./AiQuantumAlgorithmDesigner.tsx'), 'AiQuantumAlgorithmDesigner'), // Assists in designing and optimizing quantum algorithms.
    'ai-neuro-symbolic-integrator': lazyWithRetry(() => import('./AiNeuroSymbolicIntegrator.tsx'), 'AiNeuroSymbolicIntegrator'), // Combines neural networks with symbolic AI for robust systems.
    'ai-semantic-versioning-proposer': lazyWithRetry(() => import('./AiSemanticVersioningProposer.tsx'), 'AiSemanticVersioningProposer'), // Suggests appropriate semantic versions for releases.
    'ai-release-cadence-optimizer': lazyWithRetry(() => import('./AiReleaseCadenceOptimizer.tsx'), 'AiReleaseCadenceOptimizer'), // Optimizes release schedules based on project velocity and stability.
    'ai-governance-policy-enforcer': lazyWithRetry(() => import('./AiGovernancePolicyEnforcer.tsx'), 'AiGovernancePolicyEnforcer'), // Automates compliance with internal governance rules.

    // --- Phase 2: Multi-Cloud Sovereignty & Distributed Systems (1000 External Services Integration) ---
    // Project Athena scaled to embrace true multi-cloud capabilities, offering unified control
    // and seamless integration with a vast ecosystem of cloud platforms, managed services, and enterprise APIs.
    // The aspiration for "up to 1000 external services" began here, with dedicated connectors and management planes.

    // AWS Services
    'aws-eks-cluster-manager': lazyWithRetry(() => import('./AwsEksClusterManager.tsx'), 'AwsEksClusterManager'),
    'aws-fargate-task-launcher': lazyWithRetry(() => import('./AwsFargateTaskLauncher.tsx'), 'AwsFargateTaskLauncher'),
    'aws-apprunner-service-config': lazyWithRetry(() => import('./AwsApprunnerServiceConfig.tsx'), 'AwsApprunnerServiceConfig'),
    'aws-aurora-serverless-manager': lazyWithRetry(() => import('./AwsAuroraServerlessManager.tsx'), 'AwsAuroraServerlessManager'),
    'aws-dynamodb-table-designer': lazyWithRetry(() => import('./AwsDynamodbTableDesigner.tsx'), 'AwsDynamodbTableDesigner'),
    'aws-neptune-graph-db-viewer': lazyWithRetry(() => import('./AwsNeptuneGraphDbViewer.tsx'), 'AwsNeptuneGraphDbViewer'),
    'aws-mq-broker-configurator': lazyWithRetry(() => import('./AwsMqBrokerConfigurator.tsx'), 'AwsMqBrokerConfigurator'),
    'aws-sns-topic-publisher': lazyWithRetry(() => import('./AwsSnsTopicPublisher.tsx'), 'AwsSnsTopicPublisher'),
    'aws-sqs-queue-monitor': lazyWithRetry(() => import('./AwsSqsQueueMonitor.tsx'), 'AwsSqsQueueMonitor'),
    'aws-eventbridge-scheduler': lazyWithRetry(() => import('./AwsEventbridgeScheduler.tsx'), 'AwsEventbridgeScheduler'),
    'aws-data-pipeline-builder': lazyWithRetry(() => import('./AwsDataPipelineBuilder.tsx'), 'AwsDataPipelineBuilder'),
    'aws-athena-query-editor': lazyWithRetry(() => import('./AwsAthenaQueryEditor.tsx'), 'AwsAthenaQueryEditor'),
    'aws-quicksight-dashboard-embedder': lazyWithRetry(() => import('./AwsQuicksightDashboardEmbedder.tsx'), 'AwsQuicksightDashboardEmbedder'),
    'aws-lake-formation-governance': lazyWithRetry(() => import('./AwsLakeFormationGovernance.tsx'), 'AwsLakeFormationGovernance'),
    'aws-macie-data-privacy-scanner': lazyWithRetry(() => import('./AwsMacieDataPrivacyScanner.tsx'), 'AwsMacieDataPrivacyScanner'),
    'aws-guardduty-threat-analyzer': lazyWithRetry(() => import('./AwsGuarddutyThreatAnalyzer.tsx'), 'AwsGuarddutyThreatAnalyzer'),
    'aws-inspector-vulnerability-scanner': lazyWithRetry(() => import('./AwsInspectorVulnerabilityScanner.tsx'), 'AwsInspectorVulnerabilityScanner'),
    'aws-security-hub-aggregator': lazyWithRetry(() => import('./AwsSecurityHubAggregator.tsx'), 'AwsSecurityHubAggregator'),
    'aws-control-tower-setup': lazyWithRetry(() => import('./AwsControlTowerSetup.tsx'), 'AwsControlTowerSetup'),
    'aws-organizations-policy-manager': lazyWithRetry(() => import('./AwsOrganizationsPolicyManager.tsx'), 'AwsOrganizationsPolicyManager'),
    'aws-billing-anomaly-detector': lazyWithRetry(() => import('./AwsBillingAnomalyDetector.tsx'), 'AwsBillingAnomalyDetector'),
    'aws-cost-allocation-tagger': lazyWithRetry(() => import('./AwsCostAllocationTagger.tsx'), 'AwsCostAllocationTagger'),
    'aws-well-architected-reviewer': lazyWithRetry(() => import('./AwsWellArchitectedReviewer.tsx'), 'AwsWellArchitectedReviewer'),
    'aws-config-rule-creator': lazyWithRetry(() => import('./AwsConfigRuleCreator.tsx'), 'AwsConfigRuleCreator'),
    'aws-service-catalog-portfolio-manager': lazyWithRetry(() => import('./AwsServiceCatalogPortfolioManager.tsx'), 'AwsServiceCatalogPortfolioManager'),
    'aws-systems-manager-automation': lazyWithRetry(() => import('./AwsSystemsManagerAutomation.tsx'), 'AwsSystemsManagerAutomation'),
    'aws-appflow-data-integrator': lazyWithRetry(() => import('./AwsAppflowDataIntegrator.tsx'), 'AwsAppflowDataIntegrator'),
    'aws-transfer-family-endpoint-manager': lazyWithRetry(() => import('./AwsTransferFamilyEndpointManager.tsx'), 'AwsTransferFamilyEndpointManager'),
    'aws-lex-bot-builder': lazyWithRetry(() => import('./AwsLexBotBuilder.tsx'), 'AwsLexBotBuilder'),
    'aws-polly-voice-designer': lazyWithRetry(() => import('./AwsPollyVoiceDesigner.tsx'), 'AwsPollyVoiceDesigner'),
    'aws-rekognition-image-analyzer': lazyWithRetry(() => import('./AwsRekognitionImageAnalyzer.tsx'), 'AwsRekognitionImageAnalyzer'),
    'aws-comprehend-nlp-studio': lazyWithRetry(() => import('./AwsComprehendNlpStudio.tsx'), 'AwsComprehendNlpStudio'),
    'aws-translate-language-processor': lazyWithRetry(() => import('./AwsTranslateLanguageProcessor.tsx'), 'AwsTranslateLanguageProcessor'),
    'aws-textract-document-parser': lazyWithRetry(() => import('./AwsTextractDocumentParser.tsx'), 'AwsTextractDocumentParser'),
    'aws-forecast-time-series-predictor': lazyWithRetry(() => import('./AwsForecastTimeSeriesPredictor.tsx'), 'AwsForecastTimeSeriesPredictor'),
    'aws-personalize-recommendation-engine': lazyWithRetry(() => import('./AwsPersonalizeRecommendationEngine.tsx'), 'AwsPersonalizeRecommendationEngine'),
    'aws-iot-core-device-manager': lazyWithRetry(() => import('./AwsIotCoreDeviceManager.tsx'), 'AwsIotCoreDeviceManager'),
    'aws-greengrass-edge-runtime-config': lazyWithRetry(() => import('./AwsGreengrassEdgeRuntimeConfig.tsx'), 'AwsGreengrassEdgeRuntimeConfig'),
    'aws-blockchain-managed-ledger': lazyWithRetry(() => import('./AwsBlockchainManagedLedger.tsx'), 'AwsBlockchainManagedLedger'),
    'aws-quantum-ledger-database-browser': lazyWithRetry(() => import('./AwsQuantumLedgerDatabaseBrowser.tsx'), 'AwsQuantumLedgerDatabaseBrowser'),
    'aws-glue-data-catalog-editor': lazyWithRetry(() => import('./AwsGlueDataCatalogEditor.tsx'), 'AwsGlueDataCatalogEditor'),
    'aws-emr-cluster-provisioner': lazyWithRetry(() => import('./AwsEmrClusterProvisioner.tsx'), 'AwsEmrClusterProvisioner'),
    'aws-datalake-analytics-studio': lazyWithRetry(() => import('./AwsDatalakeAnalyticsStudio.tsx'), 'AwsDatalakeAnalyticsStudio'),
    'aws-msk-kafka-cluster-manager': lazyWithRetry(() => import('./AwsMskKafkaClusterManager.tsx'), 'AwsMskKafkaClusterManager'),
    'aws-appconfig-feature-flag-manager': lazyWithRetry(() => import('./AwsAppconfigFeatureFlagManager.tsx'), 'AwsAppconfigFeatureFlagManager'),
    'aws-cloudformation-stack-designer': lazyWithRetry(() => import('./AwsCloudformationStackDesigner.tsx'), 'AwsCloudformationStackDesigner'),
    'aws-copilot-cli-integration': lazyWithRetry(() => import('./AwsCopilotCliIntegration.tsx'), 'AwsCopilotCliIntegration'),
    'aws-proton-service-template-manager': lazyWithRetry(() => import('./AwsProtonServiceTemplateManager.tsx'), 'AwsProtonServiceTemplateManager'),
    'aws-license-manager-governance': lazyWithRetry(() => import('./AwsLicenseManagerGovernance.tsx'), 'AwsLicenseManagerGovernance'),
    'aws-resource-explorer-viewer': lazyWithRetry(() => import('./AwsResourceExplorerViewer.tsx'), 'AwsResourceExplorerViewer'),
    'aws-resilience-hub-assessment': lazyWithRetry(() => import('./AwsResilienceHubAssessment.tsx'), 'AwsResilienceHubAssessment'),
    'aws-sso-portal-configurator': lazyWithRetry(() => import('./AwsSsoPortalConfigurator.tsx'), 'AwsSsoPortalConfigurator'),
    'aws-marketplace-product-selector': lazyWithRetry(() => import('./AwsMarketplaceProductSelector.tsx'), 'AwsMarketplaceProductSelector'),
    'aws-application-composer': lazyWithRetry(() => import('./AwsApplicationComposer.tsx'), 'AwsApplicationComposer'), // Visually design serverless apps.

    // Azure Services
    'azure-kubernetes-service-autoscaler': lazyWithRetry(() => import('./AzureKubernetesServiceAutoscaler.tsx'), 'AzureKubernetesServiceAutoscaler'),
    'azure-container-apps-manager': lazyWithRetry(() => import('./AzureContainerAppsManager.tsx'), 'AzureContainerAppsManager'),
    'azure-static-web-apps-deployer': lazyWithRetry(() => import('./AzureStaticWebAppsDeployer.tsx'), 'AzureStaticWebAppsDeployer'),
    'azure-cosmos-db-data-explorer': lazyWithRetry(() => import('./AzureCosmosDbDataExplorer.tsx'), 'AzureCosmosDbDataExplorer'),
    'azure-databricks-workspace-manager': lazyWithRetry(() => import('./AzureDatabricksWorkspaceManager.tsx'), 'AzureDatabricksWorkspaceManager'),
    'azure-synapse-analytics-studio': lazyWithRetry(() => import('./AzureSynapseAnalyticsStudio.tsx'), 'AzureSynapseAnalyticsStudio'),
    'azure-event-grid-topic-manager': lazyWithRetry(() => import('./AzureEventGridTopicManager.tsx'), 'AzureEventGridTopicManager'),
    'azure-service-bus-queue-manager': lazyWithRetry(() => import('./AzureServiceBusQueueManager.tsx'), 'AzureServiceBusQueueManager'),
    'azure-stream-analytics-job-config': lazyWithRetry(() => import('./AzureStreamAnalyticsJobConfig.tsx'), 'AzureStreamAnalyticsJobConfig'),
    'azure-data-explorer-query-editor': lazyWithRetry(() => import('./AzureDataExplorerQueryEditor.tsx'), 'AzureDataExplorerQueryEditor'),
    'azure-purview-data-governance': lazyWithRetry(() => import('./AzurePurviewDataGovernance.tsx'), 'AzurePurviewDataGovernance'),
    'azure-defender-security-posture': lazyWithRetry(() => import('./AzureDefenderSecurityPosture.tsx'), 'AzureDefenderSecurityPosture'),
    'azure-sentinel-siem-integrator': lazyWithRetry(() => import('./AzureSentinelSiemIntegrator.tsx'), 'AzureSentinelSiemIntegrator'),
    'azure-policy-definition-creator': lazyWithRetry(() => import('./AzurePolicyDefinitionCreator.tsx'), 'AzurePolicyDefinitionCreator'),
    'azure-devops-pipeline-builder': lazyWithRetry(() => import('./AzureDevopsPipelineBuilder.tsx'), 'AzureDevopsPipelineBuilder'),
    'azure-front-door-manager': lazyWithRetry(() => import('./AzureFrontDoorManager.tsx'), 'AzureFrontDoorManager'),
    'azure-traffic-manager-profile-editor': lazyWithRetry(() => import('./AzureTrafficManagerProfileEditor.tsx'), 'AzureTrafficManagerProfileEditor'),
    'azure-container-registry-scanner': lazyWithRetry(() => import('./AzureContainerRegistryScanner.tsx'), 'AzureContainerRegistryScanner'),
    'azure-api-for-fhir-configurator': lazyWithRetry(() => import('./AzureApiForFhirConfigurator.tsx'), 'AzureApiForFhirConfigurator'),
    'azure-blockchain-workbench-manager': lazyWithRetry(() => import('./AzureBlockchainWorkbenchManager.tsx'), 'AzureBlockchainWorkbenchManager'),
    'azure-active-directory-b2c-config': lazyWithRetry(() => import('./AzureActiveDirectoryB2cConfig.tsx'), 'AzureActiveDirectoryB2cConfig'),
    'azure-logic-apps-integration-designer': lazyWithRetry(() => import('./AzureLogicAppsIntegrationDesigner.tsx'), 'AzureLogicAppsIntegrationDesigner'),
    'azure-service-fabric-cluster-viewer': lazyWithRetry(() => import('./AzureServiceFabricClusterViewer.tsx'), 'AzureServiceFabricClusterViewer'),
    'azure-chaos-studio-experiment-builder': lazyWithRetry(() => import('./AzureChaosStudioExperimentBuilder.tsx'), 'AzureChaosStudioExperimentBuilder'), // Chaos engineering.
    'azure-cost-management-anomaly-alerts': lazyWithRetry(() => import('./AzureCostManagementAnomalyAlerts.tsx'), 'AzureCostManagementAnomalyAlerts'),
    'azure-resource-graph-explorer': lazyWithRetry(() => import('./AzureResourceGraphExplorer.tsx'), 'AzureResourceGraphExplorer'),
    'azure-network-watcher-diagnostics': lazyWithRetry(() => import('./AzureNetworkWatcherDiagnostics.tsx'), 'AzureNetworkWatcherDiagnostics'),
    'azure-migrate-project-creator': lazyWithRetry(() => import('./AzureMigrateProjectCreator.tsx'), 'AzureMigrateProjectCreator'),
    'azure-site-recovery-manager': lazyWithRetry(() => import('./AzureSiteRecoveryManager.tsx'), 'AzureSiteRecoveryManager'),
    'azure-backup-vault-configurator': lazyWithRetry(() => import('./AzureBackupVaultConfigurator.tsx'), 'AzureBackupVaultConfigurator'),
    'azure-health-bot-designer': lazyWithRetry(() => import('./AzureHealthBotDesigner.tsx'), 'AzureHealthBotDesigner'),
    'azure-form-recognizer-studio': lazyWithRetry(() => import('./AzureFormRecognizerStudio.tsx'), 'AzureFormRecognizerStudio'),
    'azure-spatial-anchors-creator': lazyWithRetry(() => import('./AzureSpatialAnchorsCreator.tsx'), 'AzureSpatialAnchorsCreator'),
    'azure-mixed-reality-developer-kit': lazyWithRetry(() => import('./AzureMixedRealityDeveloperKit.tsx'), 'AzureMixedRealityDeveloperKit'),
    'azure-quantum-workspace': lazyWithRetry(() => import('./AzureQuantumWorkspace.tsx'), 'AzureQuantumWorkspace'),
    'azure-applied-ai-services-studio': lazyWithRetry(() => import('./AzureAppliedAiServicesStudio.tsx'), 'AzureAppliedAiServicesStudio'),
    'azure-video-analyzer-config': lazyWithRetry(() => import('./AzureVideoAnalyzerConfig.tsx'), 'AzureVideoAnalyzerConfig'),
    'azure-speech-studio-designer': lazyWithRetry(() => import('./AzureSpeechStudioDesigner.tsx'), 'AzureSpeechStudioDesigner'),
    'azure-language-understanding-config': lazyWithRetry(() => import('./AzureLanguageUnderstandingConfig.tsx'), 'AzureLanguageUnderstandingConfig'),
    'azure-personalizer-recommendation-engine': lazyWithRetry(() => import('./AzurePersonalizerRecommendationEngine.tsx'), 'AzurePersonalizerRecommendationEngine'),
    'azure-translator-service-hub': lazyWithRetry(() => import('./AzureTranslatorServiceHub.tsx'), 'AzureTranslatorServiceHub'),
    'azure-text-analytics-sentiment-analyzer': lazyWithRetry(() => import('./AzureTextAnalyticsSentimentAnalyzer.tsx'), 'AzureTextAnalyticsSentimentAnalyzer'),
    'azure-face-api-integration': lazyWithRetry(() => import('./AzureFaceApiIntegration.tsx'), 'AzureFaceApiIntegration'),
    'azure-bot-service-channels-manager': lazyWithRetry(() => import('./AzureBotServiceChannelsManager.tsx'), 'AzureBotServiceChannelsManager'),
    'azure-machine-learning-compute-cluster': lazyWithRetry(() => import('./AzureMachineLearningComputeCluster.tsx'), 'AzureMachineLearningComputeCluster'),
    'azure-monitor-autoscale-configurator': lazyWithRetry(() => import('./AzureMonitorAutoscaleConfigurator.tsx'), 'AzureMonitorAutoscaleConfigurator'),
    'azure-resource-mover-manager': lazyWithRetry(() => import('./AzureResourceMoverManager.tsx'), 'AzureResourceMoverManager'),
    'azure-container-instance-deployer': lazyWithRetry(() => import('./AzureContainerInstanceDeployer.tsx'), 'AzureContainerInstanceDeployer'),
    'azure-data-share-project-creator': lazyWithRetry(() => import('./AzureDataShareProjectCreator.tsx'), 'AzureDataShareProjectCreator'),

    // GCP Services
    'gcp-cloud-run-jobs-scheduler': lazyWithRetry(() => import('./GcpCloudRunJobsScheduler.tsx'), 'GcpCloudRunJobsScheduler'),
    'gcp-dataflow-template-builder': lazyWithRetry(() => import('./GcpDataflowTemplateBuilder.tsx'), 'GcpDataflowTemplateBuilder'),
    'gcp-dataproc-cluster-manager': lazyWithRetry(() => import('./GcpDataprocClusterManager.tsx'), 'GcpDataprocClusterManager'),
    'gcp-bigquery-data-warehouse-manager': lazyWithRetry(() => import('./GcpBigqueryDataWarehouseManager.tsx'), 'GcpBigqueryDataWarehouseManager'),
    'gcp-cloud-spanner-instance-manager': lazyWithRetry(() => import('./GcpCloudSpannerInstanceManager.tsx'), 'GcpCloudSpannerInstanceManager'),
    'gcp-memorystore-instance-viewer': lazyWithRetry(() => import('./GcpMemorystoreInstanceViewer.tsx'), 'GcpMemorystoreInstanceViewer'),
    'gcp-pubsub-lite-topic-manager': lazyWithRetry(() => import('./GcpPubsubLiteTopicManager.tsx'), 'GcpPubsubLiteTopicManager'),
    'gcp-cloud-scheduler-job-creator': lazyWithRetry(() => import('./GcpCloudSchedulerJobCreator.tsx'), 'GcpCloudSchedulerJobCreator'),
    'gcp-data-fusion-pipeline-designer': lazyWithRetry(() => import('./GcpDataFusionPipelineDesigner.tsx'), 'GcpDataFusionPipelineDesigner'),
    'gcp-looker-studio-integrator': lazyWithRetry(() => import('./GcpLookerStudioIntegrator.tsx'), 'GcpLookerStudioIntegrator'),
    'gcp-data-catalog-governance': lazyWithRetry(() => import('./GcpDataCatalogGovernance.tsx'), 'GcpDataCatalogGovernance'),
    'gcp-security-health-analytics': lazyWithRetry(() => import('./GcpSecurityHealthAnalytics.tsx'), 'GcpSecurityHealthAnalytics'),
    'gcp-vulnerability-detector': lazyWithRetry(() => import('./GcpVulnerabilityDetector.tsx'), 'GcpVulnerabilityDetector'),
    'gcp-cloud-armor-policy-editor': lazyWithRetry(() => import('./GcpCloudArmorPolicyEditor.tsx'), 'GcpCloudArmorPolicyEditor'),
    'gcp-build-trigger-manager': lazyWithRetry(() => import('./GcpBuildTriggerManager.tsx'), 'GcpBuildTriggerManager'),
    'gcp-cloud-cdn-cache-invalidator': lazyWithRetry(() => import('./GcpCloudCdnCacheInvalidator.tsx'), 'GcpCloudCdnCacheInvalidator'),
    'gcp-load-balancing-configurator': lazyWithRetry(() => import('./GcpLoadBalancingConfigurator.tsx'), 'GcpLoadBalancingConfigurator'),
    'gcp-container-analysis-scanner': lazyWithRetry(() => import('./GcpContainerAnalysisScanner.tsx'), 'GcpContainerAnalysisScanner'),
    'gcp-apigee-api-proxy-designer': lazyWithRetry(() => import('./GcpApigeeApiProxyDesigner.tsx'), 'GcpApigeeApiProxyDesigner'),
    'gcp-cloud-healthcare-api-manager': lazyWithRetry(() => import('./GcpCloudHealthcareApiManager.tsx'), 'GcpCloudHealthcareApiManager'),
    'gcp-dialogflow-es-cx-agent-builder': lazyWithRetry(() => import('./GcpDialogflowEsCxAgentBuilder.tsx'), 'GcpDialogflowEsCxAgentBuilder'),
    'gcp-vision-api-image-labeler': lazyWithRetry(() => import('./GcpVisionApiImageLabeler.tsx'), 'GcpVisionApiImageLabeler'),
    'gcp-natural-language-api-sentiment': lazyWithRetry(() => import('./GcpNaturalLanguageApiSentiment.tsx'), 'GcpNaturalLanguageApiSentiment'),
    'gcp-speech-to-text-converter': lazyWithRetry(() => import('./GcpSpeechToTextConverter.tsx'), 'GcpSpeechToTextConverter'),
    'gcp-text-to-speech-configurator': lazyWithRetry(() => import('./GcpTextToSpeechConfigurator.tsx'), 'GcpTextToSpeechConfigurator'),
    'gcp-translation-api-integrator': lazyWithRetry(() => import('./GcpTranslationApiIntegrator.tsx'), 'GcpTranslationApiIntegrator'),
    'gcp-video-intelligence-api-analyzer': lazyWithRetry(() => import('./GcpVideoIntelligenceApiAnalyzer.tsx'), 'GcpVideoIntelligenceApiAnalyzer'),
    'gcp-timeseries-insights-api-explorer': lazyWithRetry(() => import('./GcpTimeseriesInsightsApiExplorer.tsx'), 'GcpTimeseriesInsightsApiExplorer'),
    'gcp-recommendations-ai-engine': lazyWithRetry(() => import('./GcpRecommendationsAiEngine.tsx'), 'GcpRecommendationsAiEngine'),
    'gcp-contact-center-ai-config': lazyWithRetry(() => import('./GcpContactCenterAiConfig.tsx'), 'GcpContactCenterAiConfig'),
    'gcp-document-ai-processor': lazyWithRetry(() => import('./GcpDocumentAiProcessor.tsx'), 'GcpDocumentAiProcessor'),
    'gcp-explainable-ai-dashboard': lazyWithRetry(() => import('./GcpExplainableAiDashboard.tsx'), 'GcpExplainableAiDashboard'),
    'gcp-ai-platform-pipelines': lazyWithRetry(() => import('./GcpAiPlatformPipelines.tsx'), 'GcpAiPlatformPipelines'),
    'gcp-auto-ml-model-builder': lazyWithRetry(() => import('./GcpAutoMlModelBuilder.tsx'), 'GcpAutoMlModelBuilder'),
    'gcp-vertex-ai-workbench': lazyWithRetry(() => import('./GcpVertexAiWorkbench.tsx'), 'GcpVertexAiWorkbench'),
    'gcp-data-loss-prevention-api-config': lazyWithRetry(() => import('./GcpDataLossPreventionApiConfig.tsx'), 'GcpDataLossPreventionApiConfig'),
    'gcp-cloud-asset-inventory-viewer': lazyWithRetry(() => import('./GcpCloudAssetInventoryViewer.tsx'), 'GcpCloudAssetInventoryViewer'),
    'gcp-cloud-deployment-manager-templates': lazyWithRetry(() => import('./GcpCloudDeploymentManagerTemplates.tsx'), 'GcpCloudDeploymentManagerTemplates'),
    'gcp-beyondcorp-enterprise-config': lazyWithRetry(() => import('./GcpBeyondcorpEnterpriseConfig.tsx'), 'GcpBeyondcorpEnterpriseConfig'), // Zero Trust.
    'gcp-cloud-identities-governor': lazyWithRetry(() => import('./GcpCloudIdentitiesGovernor.tsx'), 'GcpCloudIdentitiesGovernor'),

    // Kubernetes & Container Orchestration
    'kubernetes-hpa-configurator': lazyWithRetry(() => import('./KubernetesHpaConfigurator.tsx'), 'KubernetesHpaConfigurator'), // Horizontal Pod Autoscaler.
    'kubernetes-vpa-configurator': lazyWithRetry(() => import('./KubernetesVpaConfigurator.tsx'), 'KubernetesVpaConfigurator'), // Vertical Pod Autoscaler.
    'kubernetes-service-mesh-traffic-manager': lazyWithRetry(() => import('./KubernetesServiceMeshTrafficManager.tsx'), 'KubernetesServiceMeshTrafficManager'),
    'kubernetes-cost-analyzer': lazyWithRetry(() => import('./KubernetesCostAnalyzer.tsx'), 'KubernetesCostAnalyzer'),
    'kubernetes-security-policy-auditor': lazyWithRetry(() => import('./KubernetesSecurityPolicyAuditor.tsx'), 'KubernetesSecurityPolicyAuditor'),
    'kubernetes-cluster-drift-detector': lazyWithRetry(() => import('./KubernetesClusterDriftDetector.tsx'), 'KubernetesClusterDriftDetector'),
    'argo-cd-sync-dashboard': lazyWithRetry(() => import('./ArgoCdSyncDashboard.tsx'), 'ArgoCdSyncDashboard'), // GitOps for Kubernetes.
    'tekton-pipeline-builder': lazyWithRetry(() => import('./TektonPipelineBuilder.tsx'), 'TektonPipelineBuilder'), // Cloud-native CI/CD.
    'knative-service-deployer': lazyWithRetry(() => import('./KnativeServiceDeployer.tsx'), 'KnativeServiceDeployer'), // Serverless on Kubernetes.
    'flux-cd-reconciliation-viewer': lazyWithRetry(() => import('./FluxCdReconciliationViewer.tsx'), 'FluxCdReconciliationViewer'), // GitOps for Kubernetes.
    'longhorn-storage-manager': lazyWithRetry(() => import('./LonghornStorageManager.tsx'), 'LonghornStorageManager'), // Distributed block storage for Kubernetes.
    'cilium-network-policy-editor': lazyWithRetry(() => import('./CiliumNetworkPolicyEditor.tsx'), 'CiliumNetworkPolicyEditor'), // eBPF-based networking and security.
    'opa-policy-agent-configurator': lazyWithRetry(() => import('./OpaPolicyAgentConfigurator.tsx'), 'OpaPolicyAgentConfigurator'), // Open Policy Agent for policy enforcement.
    'keda-event-driven-autoscaler': lazyWithRetry(() => import('./KedaEventDrivenAutoscaler.tsx'), 'KedaEventDrivenAutoscaler'), // Kubernetes Event-driven Autoscaling.
    'crossplane-resource-provisioner': lazyWithRetry(() => import('./CrossplaneResourceProvisioner.tsx'), 'CrossplaneResourceProvisioner'), // Control plane for external resources.
    'external-secrets-manager': lazyWithRetry(() => import('./ExternalSecretsManager.tsx'), 'ExternalSecretsManager'), // Integrates k8s with external secret stores.

    // --- Phase 3: Enterprise-Grade Data Management & Intelligence (Beyond the Database) ---
    // Recognizing the strategic importance of data, this phase focused on a holistic approach
    // to data lifecycle management, offering tools for ingestion, transformation, analysis, and governance,
    // all supercharged by AI to derive actionable intelligence.

    'realtime-data-ingestion-pipeline': lazyWithRetry(() => import('./RealtimeDataIngestionPipeline.tsx'), 'RealtimeDataIngestionPipeline'),
    'data-lakehouse-governor': lazyWithRetry(() => import('./DataLakehouseGovernor.tsx'), 'DataLakehouseGovernor'),
    'data-mesh-domain-designer': lazyWithRetry(() => import('./DataMeshDomainDesigner.tsx'), 'DataMeshDomainDesigner'),
    'streaming-etl-designer': lazyWithRetry(() => import('./StreamingEtlDesigner.tsx'), 'StreamingEtlDesigner'),
    'change-data-capture-configurator': lazyWithRetry(() => import('./ChangeDataCaptureConfigurator.tsx'), 'ChangeDataCaptureConfigurator'),
    'master-data-management-hub': lazyWithRetry(() => import('./MasterDataManagementHub.tsx'), 'MasterDataManagementHub'),
    'data-virtualization-platform': lazyWithRetry(() => import('./DataVirtualizationPlatform.tsx'), 'DataVirtualizationPlatform'),
    'data-federation-query-builder': lazyWithRetry(() => import('./DataFederationQueryBuilder.tsx'), 'DataFederationQueryBuilder'),
    'ai-data-quality-monitor': lazyWithRetry(() => import('./AiDataQualityMonitor.tsx'), 'AiDataQualityMonitor'), // AI-driven detection of data anomalies.
    'ai-synthetic-data-generator-pro': lazyWithRetry(() => import('./AiSyntheticDataGeneratorPro.tsx'), 'AiSyntheticDataGeneratorPro'), // High-fidelity synthetic data for privacy.
    'ai-data-catalog-enrichment': lazyWithRetry(() => import('./AiDataCatalogEnrichment.tsx'), 'AiDataCatalogEnrichment'), // AI to auto-tag and describe data assets.
    'ai-responsible-data-usage-auditor': lazyWithRetry(() => import('./AiResponsibleDataUsageAuditor.tsx'), 'AiResponsibleDataUsageAuditor'), // Ensures ethical use of data.
    'data-masking-and-tokenization': lazyWithRetry(() => import('./DataMaskingAndTokenization.tsx'), 'DataMaskingAndTokenization'),
    'privacy-by-design-enforcer': lazyWithRetry(() => import('./PrivacyByDesignEnforcer.tsx'), 'PrivacyByDesignEnforcer'),
    'consent-management-platform-integrator': lazyWithRetry(() => import('./ConsentManagementPlatformIntegrator.tsx'), 'ConsentManagementPlatformIntegrator'),
    'data-retention-policy-manager': lazyWithRetry(() => import('./DataRetentionPolicyManager.tsx'), 'DataRetentionPolicyManager'),
    'data-discovery-and-classification': lazyWithRetry(() => import('./DataDiscoveryAndClassification.tsx'), 'DataDiscoveryAndClassification'),
    'data-loss-prevention-monitor': lazyWithRetry(() => import('./DataLossPreventionMonitor.tsx'), 'DataLossPreventionMonitor'),
    'blockchain-data-auditor': lazyWithRetry(() => import('./BlockchainDataAuditor.tsx'), 'BlockchainDataAuditor'),
    'quantum-safe-data-encryption': lazyWithRetry(() => import('./QuantumSafeDataEncryption.tsx'), 'QuantumSafeDataEncryption'), // Future-proof encryption.
    'ai-business-intelligence-copilot': lazyWithRetry(() => import('./AiBusinessIntelligenceCopilot.tsx'), 'AiBusinessIntelligenceCopilot'), // Natural language to BI dashboards.
    'ai-predictive-maintenance-for-data-platforms': lazyWithRetry(() => import('./AiPredictiveMaintenanceForDataPlatforms.tsx'), 'AiPredictiveMaintenanceForDataPlatforms'),
    'ai-unstructured-data-analyzer': lazyWithRetry(() => import('./AiUnstructuredDataAnalyzer.tsx'), 'AiUnstructuredDataAnalyzer'), // Extracts insights from text, images, audio.
    'ai-document-intelligence-parser': lazyWithRetry(() => import('./AiDocumentIntelligenceParser.tsx'), 'AiDocumentIntelligenceParser'), // OCR and intelligent document processing.
    'ai-knowledge-extraction-from-text': lazyWithRetry(() => import('./AiKnowledgeExtractionFromText.tsx'), 'AiKnowledgeExtractionFromText'),
    'ai-time-series-forecasting-studio': lazyWithRetry(() => import('./AiTimeSeriesForecastingStudio.tsx'), 'AiTimeSeriesForecastingStudio'),
    'ai-anomaly-detection-for-financial-data': lazyWithRetry(() => import('./AiAnomalyDetectionForFinancialData.tsx'), 'AiAnomalyDetectionForFinancialData'),
    'ai-algorithmic-trading-strategy-designer': lazyWithRetry(() => import('./AiAlgorithmicTradingStrategyDesigner.tsx'), 'AiAlgorithmicTradingStrategyDesigner'),
    'ai-risk-model-validator': lazyWithRetry(() => import('./AiRiskModelValidator.tsx'), 'AiRiskModelValidator'), // Validates financial risk models using AI.
    'ai-compliance-reporting-automator': lazyWithRetry(() => import('./AiComplianceReportingAutomator.tsx'), 'AiComplianceReportingAutomator'),
    'ai-realtime-fraud-detection': lazyWithRetry(() => import('./AiRealtimeFraudDetection.tsx'), 'AiRealtimeFraudDetection'), // Detects fraudulent transactions instantly.
    'ai-credit-scoring-model-builder': lazyWithRetry(() => import('./AiCreditScoringModelBuilder.tsx'), 'AiCreditScoringModelBuilder'),
    'ai-customer-segmentation-engine': lazyWithRetry(() => import('./AiCustomerSegmentationEngine.tsx'), 'AiCustomerSegmentationEngine'),
    'ai-personalized-marketing-campaign-optimizer': lazyWithRetry(() => import('./AiPersonalizedMarketingCampaignOptimizer.tsx'), 'AiPersonalizedMarketingCampaignOptimizer'),
    'ai-supply-chain-optimization-planner': lazyWithRetry(() => import('./AiSupplyChainOptimizationPlanner.tsx'), 'AiSupplyChainOptimizationPlanner'),
    'ai-demand-forecasting-engine': lazyWithRetry(() => import('./AiDemandForecastingEngine.tsx'), 'AiDemandForecastingEngine'),
    'ai-inventory-management-system': lazyWithRetry(() => import('./AiInventoryManagementSystem.tsx'), 'AiInventoryManagementSystem'),
    'ai-predictive-analytics-dashboard-generator': lazyWithRetry(() => import('./AiPredictiveAnalyticsDashboardGenerator.tsx'), 'AiPredictiveAnalyticsDashboardGenerator'),
    'ai-automated-report-generator': lazyWithRetry(() => import('./AiAutomatedReportGenerator.tsx'), 'AiAutomatedReportGenerator'),
    'ai-natural-language-data-query': lazyWithRetry(() => import('./AiNaturalLanguageDataQuery.tsx'), 'AiNaturalLanguageDataQuery'), // Query databases using natural language.
    'ai-data-visualization-suggestor': lazyWithRetry(() => import('./AiDataVisualizationSuggestor.tsx'), 'AiDataVisualizationSuggestor'), // Recommends best charts/graphs.
    'ai-geospatial-data-intelligence': lazyWithRetry(() => import('./AiGeospatialDataIntelligence.tsx'), 'AiGeospatialDataIntelligence'), // Analyzes location-based data.
    'ai-graph-analytics-platform': lazyWithRetry(() => import('./AiGraphAnalyticsPlatform.tsx'), 'AiGraphAnalyticsPlatform'), // For relationship discovery.
    'ai-vector-search-engine': lazyWithRetry(() => import('./AiVectorSearchEngine.tsx'), 'AiVectorSearchEngine'), // Semantic search over embeddings.
    'ai-ontology-alignment-tool': lazyWithRetry(() => import('./AiOntologyAlignmentTool.tsx'), 'AiOntologyAlignmentTool'), // Maps different data schemas.

    // --- Phase 4: Full-Stack Enterprise Observability & Security (Guardian AI) ---
    // Project Athena cemented its position as a fortress of secure and observable applications.
    // This phase delivered advanced monitoring, threat hunting, and automated remediation,
    // leveraging AI to go beyond detection to predictive and prescriptive security.

    'unified-observability-platform': lazyWithRetry(() => import('./UnifiedObservabilityPlatform.tsx'), 'UnifiedObservabilityPlatform'),
    'ai-log-anomaly-detector': lazyWithRetry(() => import('./AiLogAnomalyDetector.tsx'), 'AiLogAnomalyDetector'),
    'ai-metric-drift-analyzer': lazyWithRetry(() => import('./AiMetricDriftAnalyzer.tsx'), 'AiMetricDriftAnalyzer'),
    'ai-distributed-tracing-analyzer': lazyWithRetry(() => import('./AiDistributedTracingAnalyzer.tsx'), 'AiDistributedTracingAnalyzer'), // Identifies service bottlenecks.
    'ai-event-correlation-engine': lazyWithRetry(() => import('./AiEventCorrelationEngine.tsx'), 'AiEventCorrelationEngine'), // Links disparate events to incidents.
    'ai-predictive-alerting-system': lazyWithRetry(() => import('./AiPredictiveAlertingSystem.tsx'), 'AiPredictiveAlertingSystem'), // Alerts before issues occur.
    'ai-auto-remediation-orchestrator': lazyWithRetry(() => import('./AiAutoRemediationOrchestrator.tsx'), 'AiAutoRemediationOrchestrator'), // Fixes issues without human intervention.
    'ai-threat-hunting-dashboard': lazyWithRetry(() => import('./AiThreatHuntingDashboard.tsx'), 'AiThreatHuntingDashboard'), // AI-guided proactive threat discovery.
    'ai-security-posture-management-pro': lazyWithRetry(() => import('./AiSecurityPostureManagementPro.tsx'), 'AiSecurityPostureManagementPro'), // Continuous assessment and improvement.
    'ai-attack-surface-reducer': lazyWithRetry(() => import('./AiAttackSurfaceReducer.tsx'), 'AiAttackSurfaceReducer'), // Identifies and suggests mitigation for exposed attack vectors.
    'ai-zero-trust-policy-engine': lazyWithRetry(() => import('./AiZeroTrustPolicyEngine.tsx'), 'AiZeroTrustPolicyEngine'), // Dynamically enforces granular access based on context.
    'ai-behavioral-analytics-for-security': lazyWithRetry(() => import('./AiBehavioralAnalyticsForSecurity.tsx'), 'AiBehavioralAnalyticsForSecurity'), // Detects insider threats.
    'ai-endpoint-detection-response-manager': lazyWithRetry(() => import('./AiEndpointDetectionResponseManager.tsx'), 'AiEndpointDetectionResponseManager'), // Advanced endpoint security.
    'ai-network-traffic-analyzer': lazyWithRetry(() => import('./AiNetworkTrafficAnalyzer.tsx'), 'AiNetworkTrafficAnalyzer'), // Detects suspicious network patterns.
    'ai-cloud-workload-protection-platform': lazyWithRetry(() => import('./AiCloudWorkloadProtectionPlatform.tsx'), 'AiCloudWorkloadProtectionPlatform'),
    'ai-serverless-security-auditor': lazyWithRetry(() => import('./AiServerlessSecurityAuditor.tsx'), 'AiServerlessSecurityAuditor'),
    'ai-container-image-vulnerability-scanner': lazyWithRetry(() => import('./AiContainerImageVulnerabilityScanner.tsx'), 'AiContainerImageVulnerabilityScanner'),
    'ai-secrets-leakage-detector': lazyWithRetry(() => import('./AiSecretsLeakageDetector.tsx'), 'AiSecretsLeakageDetector'), // Scans code, logs, and public repos.
    'ai-code-supply-chain-risk-manager': lazyWithRetry(() => import('./AiCodeSupplyChainRiskManager.tsx'), 'AiCodeSupplyChainRiskManager'), // Monitors third-party dependencies.
    'ai-security-awareness-gamification': lazyWithRetry(() => import('./AiSecurityAwarenessGamification.tsx'), 'AiSecurityAwarenessGamification'), // Engaging security training.
    'ai-blockchain-security-auditor': lazyWithRetry(() => import('./AiBlockchainSecurityAuditor.tsx'), 'AiBlockchainSecurityAuditor'), // Specific for smart contracts and distributed ledgers.
    'ai-quantum-threat-resistance-analyzer': lazyWithRetry(() => import('./AiQuantumThreatResistanceAnalyzer.tsx'), 'AiQuantumThreatResistanceAnalyzer'), // Assesses post-quantum cryptography.
    'ai-threat-intelligence-feed-aggregator': lazyWithRetry(() => import('./AiThreatIntelligenceFeedAggregator.tsx'), 'AiThreatIntelligenceFeedAggregator'),
    'ai-incident-response-orchestrator': lazyWithRetry(() => import('./AiIncidentResponseOrchestrator.tsx'), 'AiIncidentResponseOrchestrator'),
    'ai-dark-web-monitoring': lazyWithRetry(() => import('./AiDarkWebMonitoring.tsx'), 'AiDarkWebMonitoring'), // For credential and data leakage detection.
    'ai-digital-forensics-investigator': lazyWithRetry(() => import('./AiDigitalForensicsInvestigator.tsx'), 'AiDigitalForensicsInvestigator'),
    'ai-insider-threat-detection-system': lazyWithRetry(() => import('./AiInsiderThreatDetectionSystem.tsx'), 'AiInsiderThreatDetectionSystem'),
    'ai-ransomware-protection-suite': lazyWithRetry(() => import('./AiRansomwareProtectionSuite.tsx'), 'AiRansomwareProtectionSuite'),
    'ai-ddos-mitigation-service': lazyWithRetry(() => import('./AiDdosMitigationService.tsx'), 'AiDdosMitigationService'),
    'ai-web-application-firewall-manager': lazyWithRetry(() => import('./AiWebApplicationFirewallManager.tsx'), 'AiWebApplicationFirewallManager'),
    'ai-api-threat-protection': lazyWithRetry(() => import('./AiApiThreatProtection.tsx'), 'AiApiThreatProtection'),
    'ai-database-security-auditor': lazyWithRetry(() => import('./AiDatabaseSecurityAuditor.tsx'), 'AiDatabaseSecurityAuditor'),
    'ai-identity-access-governance': lazyWithRetry(() => import('./AiIdentityAccessGovernance.tsx'), 'AiIdentityAccessGovernance'),
    'ai-privileged-access-management-integrator': lazyWithRetry(() => import('./AiPrivilegedAccessManagementIntegrator.tsx'), 'AiPrivilegedAccessManagementIntegrator'),
    'ai-policy-as-code-validator': lazyWithRetry(() => import('./AiPolicyAsCodeValidator.tsx'), 'AiPolicyAsCodeValidator'),
    'ai-trust-score-calculator': lazyWithRetry(() => import('./AiTrustScoreCalculator.tsx'), 'AiTrustScoreCalculator'), // For users, devices, applications.
    'ai-secure-development-lifecycle-orchestrator': lazyWithRetry(() => import('./AiSecureDevelopmentLifecycleOrchestrator.tsx'), 'AiSecureDevelopmentLifecycleOrchestrator'),

    // --- Phase 5: Hyper-Personalized User Experiences & Advanced UI/UX (Cognitive Design) ---
    // User experience was redefined through AI-driven personalization and accessibility.
    // Project Athena introduced tools that understand user intent, adapt interfaces,
    // and ensure universal access, pushing the boundaries of human-computer interaction.

    'ai-user-journey-orchestrator': lazyWithRetry(() => import('./AiUserJourneyOrchestrator.tsx'), 'AiUserJourneyOrchestrator'), // Dynamically adapts user paths.
    'ai-personalized-ui-designer': lazyWithRetry(() => import('./AiPersonalizedUiDesigner.tsx'), 'AiPersonalizedUiDesigner'), // Customizes UI based on user behavior.
    'ai-accessibility-auto-remediator': lazyWithRetry(() => import('./AiAccessibilityAutoRemediator.tsx'), 'AiAccessibilityAutoRemediator'), // Real-time accessibility fixes.
    'ai-a-b-testing-optimizer': lazyWithRetry(() => import('./AiAbTestingOptimizer.tsx'), 'AiAbTestingOptimizer'), // AI-driven optimization of A/B test outcomes.
    'ai-multivariate-testing-platform': lazyWithRetry(() => import('./AiMultivariateTestingPlatform.tsx'), 'AiMultivariateTestingPlatform'),
    'ai-natural-language-ui-generator': lazyWithRetry(() => import('./AiNaturalLanguageUiGenerator.tsx'), 'AiNaturalLanguageUiGenerator'), // UI from textual descriptions.
    'ai-gesture-control-integrator': lazyWithRetry(() => import('./AiGestureControlIntegrator.tsx'), 'AiGestureControlIntegrator'), // For advanced XR interfaces.
    'ai-eye-tracking-usability-analyzer': lazyWithRetry(() => import('./AiEyeTrackingUsabilityAnalyzer.tsx'), 'AiEyeTrackingUsabilityAnalyzer'), // Analyzes user gaze patterns.
    'ai-voice-command-designer': lazyWithRetry(() => import('./AiVoiceCommandDesigner.tsx'), 'AiVoiceCommandDesigner'),
    'ai-haptic-feedback-designer': lazyWithRetry(() => import('./AiHapticFeedbackDesigner.tsx'), 'AiHapticFeedbackDesigner'), // Designs tactile user experiences.
    'ai-brand-guideline-enforcer': lazyWithRetry(() => import('./AiBrandGuidelineEnforcer.tsx'), 'AiBrandGuidelineEnforcer'), // Ensures visual and tonal brand consistency.
    'ai-dynamic-content-personalizer': lazyWithRetry(() => import('./AiDynamicContentPersonalizer.tsx'), 'AiDynamicContentPersonalizer'), // Adapts content in real-time.
    'ai-gamification-engine': lazyWithRetry(() => import('./AiGamificationEngine.tsx'), 'AiGamificationEngine'), // Integrates game mechanics for user engagement.
    'ai-chatbot-personality-designer': lazyWithRetry(() => import('./AiChatbotPersonalityDesigner.tsx'), 'AiChatbotPersonalityDesigner'), // Crafts engaging AI personalities.
    'ai-3d-asset-generator': lazyWithRetry(() => import('./Ai3dAssetGenerator.tsx'), 'Ai3dAssetGenerator'), // Creates 3D models for immersive experiences.
    'ai-augmented-reality-scene-editor': lazyWithRetry(() => import('./AiAugmentedRealitySceneEditor.tsx'), 'AiAugmentedRealitySceneEditor'),
    'ai-virtual-reality-environment-builder': lazyWithRetry(() => import('./AiVirtualRealityEnvironmentBuilder.tsx'), 'AiVirtualRealityEnvironmentBuilder'),
    'ai-mixed-reality-experience-creator': lazyWithRetry(() => import('./AiMixedRealityExperienceCreator.tsx'), 'AiMixedRealityExperienceCreator'),
    'ai-spatial-computing-interaction-designer': lazyWithRetry(() => import('./AiSpatialComputingInteractionDesigner.tsx'), 'AiSpatialComputingInteractionDesigner'),
    'ai-biometric-authentication-integrator': lazyWithRetry(() => import('./AiBiometricAuthenticationIntegrator.tsx'), 'AiBiometricAuthenticationIntegrator'),
    'ai-predictive-autofill-forms': lazyWithRetry(() => import('./AiPredictiveAutofillForms.tsx'), 'AiPredictiveAutofillForms'), // AI-powered form completion.
    'ai-cognitive-overload-detector': lazyWithRetry(() => import('./AiCognitiveOverloadDetector.tsx'), 'AiCognitiveOverloadDetector'), // Monitors UI for user fatigue.
    'ai-inclusive-design-assistant': lazyWithRetry(() => import('./AiInclusiveDesignAssistant.tsx'), 'AiInclusiveDesignAssistant'), // Guides designers towards inclusive designs.
    'ai-emotion-detection-ui-adapter': lazyWithRetry(() => import('./AiEmotionDetectionUiAdapter.tsx'), 'AiEmotionDetectionUiAdapter'), // Adapts UI based on detected user emotion.
    'ai-dynamic-theming-engine': lazyWithRetry(() => import('./AiDynamicThemingEngine.tsx'), 'AiDynamicThemingEngine'), // Changes themes based on context or user preference.
    'ai-gesture-recognition-developer-kit': lazyWithRetry(() => import('./AiGestureRecognitionDeveloperKit.tsx'), 'AiGestureRecognitionDeveloperKit'),
    'ai-contextual-help-system': lazyWithRetry(() => import('./AiContextualHelpSystem.tsx'), 'AiContextualHelpSystem'), // Provides help based on current task.
    'ai-user-feedback-loop-optimizer': lazyWithRetry(() => import('./AiUserFeedbackLoopOptimizer.tsx'), 'AiUserFeedbackLoopOptimizer'), // Improves feedback collection and analysis.
    'ai-usability-testing-automator': lazyWithRetry(() => import('./AiUsabilityTestingAutomator.tsx'), 'AiUsabilityTestingAutomator'), // Automated usability tests with AI.
    'ai-component-lifecycle-manager': lazyWithRetry(() => import('./AiComponentLifecycleManager.tsx'), 'AiComponentLifecycleManager'), // Manages UI component versioning and deprecation.

    // --- Phase 6: Financial Services Specific & Regulatory Compliance (Precision & Trust) ---
    // For a leader in financial services, specialized tools for monetary systems,
    // advanced risk management, and iron-clad regulatory compliance are non-negotiable.
    // Project Athena delivered these with unparalleled precision, often leveraging AI.

    'ai-financial-transaction-monitor': lazyWithRetry(() => import('./AiFinancialTransactionMonitor.tsx'), 'AiFinancialTransactionMonitor'),
    'ai-realtime-market-data-analyzer': lazyWithRetry(() => import('./AiRealtimeMarketDataAnalyzer.tsx'), 'AiRealtimeMarketDataAnalyzer'),
    'ai-portfolio-optimization-engine': lazyWithRetry(() => import('./AiPortfolioOptimizationEngine.tsx'), 'AiPortfolioOptimizationEngine'),
    'ai-asset-liability-management': lazyWithRetry(() => import('./AiAssetLiabilityManagement.tsx'), 'AiAssetLiabilityManagement'),
    'ai-stress-testing-simulator': lazyWithRetry(() => import('./AiStressTestingSimulator.tsx'), 'AiStressTestingSimulator'),
    'ai-regulatory-change-impact-analyzer': lazyWithRetry(() => import('./AiRegulatoryChangeImpactAnalyzer.tsx'), 'AiRegulatoryChangeImpactAnalyzer'),
    'ai-kyd-kyc-aml-compliance-suite': lazyWithRetry(() => import('./AiKydKycAmlComplianceSuite.tsx'), 'AiKydKycAmlComplianceSuite'), // Know Your Customer/Business/Anti-Money Laundering.
    'ai-insider-trading-detection': lazyWithRetry(() => import('./AiInsiderTradingDetection.tsx'), 'AiInsiderTradingDetection'),
    'ai-trade-reconciliation-automator': lazyWithRetry(() => import('./AiTradeReconciliationAutomator.tsx'), 'AiTradeReconciliationAutomator'),
    'ai-payment-gateway-integrator': lazyWithRetry(() => import('./AiPaymentGatewayIntegrator.tsx'), 'AiPaymentGatewayIntegrator'),
    'ai-blockchain-settlement-engine': lazyWithRetry(() => import('./AiBlockchainSettlementEngine.tsx'), 'AiBlockchainSettlementEngine'),
    'ai-digital-currency-exchange-platform': lazyWithRetry(() => import('./AiDigitalCurrencyExchangePlatform.tsx'), 'AiDigitalCurrencyExchangePlatform'),
    'ai-decentralized-finance-aggregator': lazyWithRetry(() => import('./AiDecentralizedFinanceAggregator.tsx'), 'AiDecentralizedFinanceAggregator'),
    'ai-carbon-credit-trading-platform': lazyWithRetry(() => import('./AiCarbonCreditTradingPlatform.tsx'), 'AiCarbonCreditTradingPlatform'),
    'ai-esg-data-analyzer': lazyWithRetry(() => import('./AiEsgDataAnalyzer.tsx'), 'AiEsgDataAnalyzer'), // Environmental, Social, and Governance.
    'ai-financial-document-parser': lazyWithRetry(() => import('./AiFinancialDocumentParser.tsx'), 'AiFinancialDocumentParser'), // Extracts data from financial statements.
    'ai-contract-clause-extractor': lazyWithRetry(() => import('./AiContractClauseExtractor.tsx'), 'AiContractClauseExtractor'),
    'ai-tax-compliance-automator': lazyWithRetry(() => import('./AiTaxComplianceAutomator.tsx'), 'AiTaxComplianceAutomator'),
    'ai-regulatory-sandbox-environment': lazyWithRetry(() => import('./AiRegulatorySandboxEnvironment.tsx'), 'AiRegulatorySandboxEnvironment'), // Test compliance in isolation.
    'ai-central-bank-digital-currency-simulator': lazyWithRetry(() => import('./AiCentralBankDigitalCurrencySimulator.tsx'), 'AiCentralBankDigitalCurrencySimulator'),
    'ai-microfinance-platform': lazyWithRetry(() => import('./AiMicrofinancePlatform.tsx'), 'AiMicrofinancePlatform'),
    'ai-syndicated-loan-management': lazyWithRetry(() => import('./AiSyndicatedLoanManagement.tsx'), 'AiSyndicatedLoanManagement'),
    'ai-bond-market-analyzer': lazyWithRetry(() => import('./AiBondMarketAnalyzer.tsx'), 'AiBondMarketAnalyzer'),
    'ai-equity-research-assistant': lazyWithRetry(() => import('./AiEquityResearchAssistant.tsx'), 'AiEquityResearchAssistant'),
    'ai-derivatives-pricing-modeler': lazyWithRetry(() => import('./AiDerivativesPricingModeler.tsx'), 'AiDerivativesPricingModeler'),
    'ai-hedging-strategy-optimizer': lazyWithRetry(() => import('./AiHedgingStrategyOptimizer.tsx'), 'AiHedgingStrategyOptimizer'),
    'ai-liquidity-management-system': lazyWithRetry(() => import('./AiLiquidityManagementSystem.tsx'), 'AiLiquidityManagementSystem'),
    'ai-collateral-management-platform': lazyWithRetry(() => import('./AiCollateralManagementPlatform.tsx'), 'AiCollateralManagementPlatform'),
    'ai-trade-finance-platform': lazyWithRetry(() => import('./AiTradeFinancePlatform.tsx'), 'AiTradeFinancePlatform'),
    'ai-capital-markets-analytics': lazyWithRetry(() => import('./AiCapitalMarketsAnalytics.tsx'), 'AiCapitalMarketsAnalytics'),
    'ai-wealth-management-advisor': lazyWithRetry(() => import('./AiWealthManagementAdvisor.tsx'), 'AiWealthManagementAdvisor'),
    'ai-robo-advisory-platform': lazyWithRetry(() => import('./AiRoboAdvisoryPlatform.tsx'), 'AiRoboAdvisoryPlatform'),
    'ai-insurance-claims-processor': lazyWithRetry(() => import('./AiInsuranceClaimsProcessor.tsx'), 'AiInsuranceClaimsProcessor'),
    'ai-actuarial-modeling-suite': lazyWithRetry(() => import('./AiActuarialModelingSuite.tsx'), 'AiActuarialModelingSuite'),
    'ai-reinsurance-contract-analyzer': lazyWithRetry(() => import('./AiReinsuranceContractAnalyzer.tsx'), 'AiReinsuranceContractAnalyzer'),
    'ai-pension-fund-management': lazyWithRetry(() => import('./AiPensionFundManagement.tsx'), 'AiPensionFundManagement'),
    'ai-enterprise-risk-management': lazyWithRetry(() => import('./AiEnterpriseRiskManagement.tsx'), 'AiEnterpriseRiskManagement'),
    'ai-operational-risk-analyzer': lazyWithRetry(() => import('./AiOperationalRiskAnalyzer.tsx'), 'AiOperationalRiskAnalyzer'),
    'ai-credit-risk-assessment': lazyWithRetry(() => import('./AiCreditRiskAssessment.tsx'), 'AiCreditRiskAssessment'),
    'ai-market-risk-prediction': lazyWithRetry(() => import('./AiMarketRiskPrediction.tsx'), 'AiMarketRiskPrediction'),
    'ai-systemic-risk-monitoring': lazyWithRetry(() => import('./AiSystemicRiskMonitoring.tsx'), 'AiSystemicRiskMonitoring'),
    'ai-fraud-ring-detection': lazyWithRetry(() => import('./AiFraudRingDetection.tsx'), 'AiFraudRingDetection'),
    'ai-suspicious-activity-reporting': lazyWithRetry(() => import('./AiSuspiciousActivityReporting.tsx'), 'AiSuspiciousActivityReporting'),
    'ai-whistleblower-case-management': lazyWithRetry(() => import('./AiWhistleblowerCaseManagement.tsx'), 'AiWhistleblowerCaseManagement'),
    'ai-financial-crime-investigation-assistant': lazyWithRetry(() => import('./AiFinancialCrimeInvestigationAssistant.tsx'), 'AiFinancialCrimeInvestigationAssistant'),
    'ai-forensic-accounting-tool': lazyWithRetry(() => import('./AiForensicAccountingTool.tsx'), 'AiForensicAccountingTool'),
    'ai-money-laundering-pattern-detector': lazyWithRetry(() => import('./AiMoneyLaunderingPatternDetector.tsx'), 'AiMoneyLaunderingPatternDetector'),
    'ai-counter-terrorist-financing-system': lazyWithRetry(() => import('./AiCounterTerroristFinancingSystem.tsx'), 'AiCounterTerroristFinancingSystem'),
    'ai-sanctions-screening-engine': lazyWithRetry(() => import('./AiSanctionsScreeningEngine.tsx'), 'AiSanctionsScreeningEngine'),
    'ai-due-diligence-automator': lazyWithRetry(() => import('./AiDueDiligenceAutomator.tsx'), 'AiDueDiligenceAutomator'),
    'ai-regulatory-filing-generator': lazyWithRetry(() => import('./AiRegulatoryFilingGenerator.tsx'), 'AiRegulatoryFilingGenerator'),

    // --- Phase 7: Advanced Development Practices & Emerging Tech (Pushing the Envelope) ---
    // Project Athena didn't just meet industry standards; it set them. This phase introduced
    // bleeding-edge technologies and methodologies, ensuring developers could build for tomorrow, today.

    'ai-code-refactoring-suggestions-pro': lazyWithRetry(() => import('./AiCodeRefactoringSuggestionsPro.tsx'), 'AiCodeRefactoringSuggestionsPro'),
    'ai-pair-programming-bot-advanced': lazyWithRetry(() => import('./AiPairProgrammingBotAdvanced.tsx'), 'AiPairProgrammingBotAdvanced'),
    'ai-test-driven-development-assistant': lazyWithRetry(() => import('./AiTestDrivenDevelopmentAssistant.tsx'), 'AiTestDrivenDevelopmentAssistant'),
    'ai-behavior-driven-development-tool': lazyWithRetry(() => import('./AiBehaviorDrivenDevelopmentTool.tsx'), 'AiBehaviorDrivenDevelopmentTool'),
    'ai-domain-driven-design-mapper': lazyWithRetry(() => import('./AiDomainDrivenDesignMapper.tsx'), 'AiDomainDrivenDesignMapper'),
    'ai-code-smell-detector-and-fixer': lazyWithRetry(() => import('./AiCodeSmellDetectorAndFixer.tsx'), 'AiCodeSmellDetectorAndFixer'),
    'ai-design-pattern-proposer': lazyWithRetry(() => import('./AiDesignPatternProposer.tsx'), 'AiDesignPatternProposer'),
    'ai-architectural-decision-recorder': lazyWithRetry(() => import('./AiArchitecturalDecisionRecorder.tsx'), 'AiArchitecturalDecisionRecorder'),
    'ai-contract-first-api-designer': lazyWithRetry(() => import('./AiContractFirstApiDesigner.tsx'), 'AiContractFirstApiDesigner'),
    'ai-consumer-driven-contract-tester': lazyWithRetry(() => import('./AiConsumerDrivenContractTester.tsx'), 'AiConsumerDrivenContractTester'),
    'ai-event-sourcing-cqrs-designer': lazyWithRetry(() => import('./AiEventSourcingCqrsDesigner.tsx'), 'AiEventSourcingCqrsDesigner'),
    'ai-micro-frontend-orchestration-tool': lazyWithRetry(() => import('./AiMicroFrontendOrchestrationTool.tsx'), 'AiMicroFrontendOrchestrationTool'),
    'ai-serverless-function-composition': lazyWithRetry(() => import('./AiServerlessFunctionComposition.tsx'), 'AiServerlessFunctionComposition'),
    'ai-edge-computing-deployment-manager': lazyWithRetry(() => import('./AiEdgeComputingDeploymentManager.tsx'), 'AiEdgeComputingDeploymentManager'),
    'ai-quantum-computing-optimization-engine': lazyWithRetry(() => import('./AiQuantumComputingOptimizationEngine.tsx'), 'AiQuantumComputingOptimizationEngine'),
    'ai-blockchain-interoperability-gateway': lazyWithRetry(() => import('./AiBlockchainInteroperabilityGateway.tsx'), 'AiBlockchainInteroperabilityGateway'),
    'ai-web3-decentralized-application-builder': lazyWithRetry(() => import('./AiWeb3DecentralizedApplicationBuilder.tsx'), 'AiWeb3DecentralizedApplicationBuilder'),
    'ai-nft-minting-and-marketplace-integrator': lazyWithRetry(() => import('./AiNftMintingAndMarketplaceIntegrator.tsx'), 'AiNftMintingAndMarketplaceIntegrator'),
    'ai-metaverse-sdk-developer': lazyWithRetry(() => import('./AiMetaverseSdkDeveloper.tsx'), 'AiMetaverseSdkDeveloper'),
    'ai-digital-twin-modeling-studio': lazyWithRetry(() => import('./AiDigitalTwinModelingStudio.tsx'), 'AiDigitalTwinModelingStudio'),
    'ai-robotics-process-automation-designer': lazyWithRetry(() => import('./AiRoboticsProcessAutomationDesigner.tsx'), 'AiRoboticsProcessAutomationDesigner'),
    'ai-iot-device-fleet-manager': lazyWithRetry(() => import('./AiIotDeviceFleetManager.tsx'), 'AiIotDeviceFleetManager'),
    'ai-hpc-job-orchestrator': lazyWithRetry(() => import('./AiHpcJobOrchestrator.tsx'), 'AiHpcJobOrchestrator'), // High-Performance Computing.
    'ai-biotech-genome-sequencer-analyzer': lazyWithRetry(() => import('./AiBiotechGenomeSequencerAnalyzer.tsx'), 'AiBiotechGenomeSequencerAnalyzer'),
    'ai-personalized-medicine-treatment-planner': lazyWithRetry(() => import('./AiPersonalizedMedicineTreatmentPlanner.tsx'), 'AiPersonalizedMedicineTreatmentPlanner'),
    'ai-material-science-discovery-platform': lazyWithRetry(() => import('./AiMaterialScienceDiscoveryPlatform.tsx'), 'AiMaterialScienceDiscoveryPlatform'),
    'ai-climate-modeling-and-simulation': lazyWithRetry(() => import('./AiClimateModelingAndSimulation.tsx'), 'AiClimateModelingAndSimulation'),
    'ai-space-mission-planning-simulator': lazyWithRetry(() => import('./AiSpaceMissionPlanningSimulator.tsx'), 'AiSpaceMissionPlanningSimulator'),
    'ai-generative-design-for-engineering': lazyWithRetry(() => import('./AiGenerativeDesignForEngineering.tsx'), 'AiGenerativeDesignForEngineering'),
    'ai-low-code-platform-extender': lazyWithRetry(() => import('./AiLowCodePlatformExtender.tsx'), 'AiLowCodePlatformExtender'),
    'ai-no-code-solution-integrator': lazyWithRetry(() => import('./AiNoCodeSolutionIntegrator.tsx'), 'AiNoCodeSolutionIntegrator'),
    'ai-knowledge-management-system': lazyWithRetry(() => import('./AiKnowledgeManagementSystem.tsx'), 'AiKnowledgeManagementSystem'),
    'ai-talent-lifecycle-manager': lazyWithRetry(() => import('./AiTalentLifecycleManager.tsx'), 'AiTalentLifecycleManager'),
    'ai-employee-engagement-optimizer': lazyWithRetry(() => import('./AiEmployeeEngagementOptimizer.tsx'), 'AiEmployeeEngagementOptimizer'),
    'ai-succession-planning-assistant': lazyWithRetry(() => import('./AiSuccessionPlanningAssistant.tsx'), 'AiSuccessionPlanningAssistant'),
    'ai-corporate-learning-platform': lazyWithRetry(() => import('./AiCorporateLearningPlatform.tsx'), 'AiCorporateLearningPlatform'),
    'ai-executive-decision-support-system': lazyWithRetry(() => import('./AiExecutiveDecisionSupportSystem.tsx'), 'AiExecutiveDecisionSupportSystem'),
    'ai-strategic-planning-simulator': lazyWithRetry(() => import('./AiStrategicPlanningSimulator.tsx'), 'AiStrategicPlanningSimulator'),
    'ai-competitive-intelligence-analyzer': lazyWithRetry(() => import('./AiCompetitiveIntelligenceAnalyzer.tsx'), 'AiCompetitiveIntelligenceAnalyzer'),
    'ai-market-entry-strategy-generator': lazyWithRetry(() => import('./AiMarketEntryStrategyGenerator.tsx'), 'AiMarketEntryStrategyGenerator'),
    'ai-brand-reputation-monitor': lazyWithRetry(() => import('./AiBrandReputationMonitor.tsx'), 'AiBrandReputationMonitor'),
    'ai-public-relations-crisis-manager': lazyWithRetry(() => import('./AiPublicRelationsCrisisManager.tsx'), 'AiPublicRelationsCrisisManager'),
    'ai-sentiment-driven-news-aggregator': lazyWithRetry(() => import('./AiSentimentDrivenNewsAggregator.tsx'), 'AiSentimentDrivenNewsAggregator'),
    'ai-media-outreach-optimizer': lazyWithRetry(() => import('./AiMediaOutreachOptimizer.tsx'), 'AiMediaOutreachOptimizer'),
    'ai-investor-relations-communication-assistant': lazyWithRetry(() => import('./AiInvestorRelationsCommunicationAssistant.tsx'), 'AiInvestorRelationsCommunicationAssistant'),
    'ai-shareholder-engagement-platform': lazyWithRetry(() => import('./AiShareholderEngagementPlatform.tsx'), 'AiShareholderEngagementPlatform'),
    'ai-corporate-governance-reporting-tool': lazyWithRetry(() => import('./AiCorporateGovernanceReportingTool.tsx'), 'AiCorporateGovernanceReportingTool'),
    'ai-lobbying-strategy-analyzer': lazyWithRetry(() => import('./AiLobbyingStrategyAnalyzer.tsx'), 'AiLobbyingStrategyAnalyzer'),
    'ai-geopolitical-risk-analysis-platform': lazyWithRetry(() => import('./AiGeopoliticalRiskAnalysisPlatform.tsx'), 'AiGeopoliticalRiskAnalysisPlatform'),
    'ai-resource-sustainability-planner': lazyWithRetry(() => import('./AiResourceSustainabilityPlanner.tsx'), 'AiResourceSustainabilityPlanner'),
    'ai-circular-economy-modeler': lazyWithRetry(() => import('./AiCircularEconomyModeler.tsx'), 'AiCircularEconomyModeler'),
    'ai-environmental-impact-modeling-suite': lazyWithRetry(() => import('./AiEnvironmentalImpactModelingSuite.tsx'), 'AiEnvironmentalImpactModelingSuite'),
    'ai-disaster-resilience-planner': lazyWithRetry(() => import('./AiDisasterResiliencePlanner.tsx'), 'AiDisasterResiliencePlanner'),
    'ai-social-impact-assessment-tool': lazyWithRetry(() => import('./AiSocialImpactAssessmentTool.tsx'), 'AiSocialImpactAssessmentTool'),
    'ai-smart-city-infrastructure-optimizer': lazyWithRetry(() => import('./AiSmartCityInfrastructureOptimizer.tsx'), 'AiSmartCityInfrastructureOptimizer'),
    'ai-public-transportation-route-optimizer': lazyWithRetry(() => import('./AiPublicTransportationRouteOptimizer.tsx'), 'AiPublicTransportationRouteOptimizer'),
    'ai-traffic-flow-management-system': lazyWithRetry(() => import('./AiTrafficFlowManagementSystem.tsx'), 'AiTrafficFlowManagementSystem'),
    'ai-waste-management-optimization': lazyWithRetry(() => import('./AiWasteManagementOptimization.tsx'), 'AiWasteManagementOptimization'),
    'ai-water-resource-management': lazyWithRetry(() => import('./AiWaterResourceManagement.tsx'), 'AiWaterResourceManagement'),
    'ai-energy-grid-forecaster-optimizer': lazyWithRetry(() => import('./AiEnergyGridForecasterOptimizer.tsx'), 'AiEnergyGridForecasterOptimizer'),
    'ai-renewable-energy-integration-planner': lazyWithRetry(() => import('./AiRenewableEnergyIntegrationPlanner.tsx'), 'AiRenewableEnergyIntegrationPlanner'),
    'ai-smart-home-automation-platform': lazyWithRetry(() => import('./AiSmartHomeAutomationPlatform.tsx'), 'AiSmartHomeAutomationPlatform'),
    'ai-intelligent-building-management-system': lazyWithRetry(() => import('./AiIntelligentBuildingManagementSystem.tsx'), 'AiIntelligentBuildingManagementSystem'),
    'ai-precision-agriculture-yield-optimizer': lazyWithRetry(() => import('./AiPrecisionAgricultureYieldOptimizer.tsx'), 'AiPrecisionAgricultureYieldOptimizer'),
    'ai-livestock-monitoring-system': lazyWithRetry(() => import('./AiLivestockMonitoringSystem.tsx'), 'AiLivestockMonitoringSystem'),
    'ai-crop-disease-detection-system': lazyWithRetry(() => import('./AiCropDiseaseDetectionSystem.tsx'), 'AiCropDiseaseDetectionSystem'),
    'ai-fisheries-management-optimizer': lazyWithRetry(() => import('./AiFisheriesManagementOptimizer.tsx'), 'AiFisheriesManagementOptimizer'),
    'ai-forest-health-monitor': lazyWithRetry(() => import('./AiForestHealthMonitor.tsx'), 'AiForestHealthMonitor'),
    'ai-wildlife-tracking-and-protection': lazyWithRetry(() => import('./AiWildlifeTrackingAndProtection.tsx'), 'AiWildlifeTrackingAndProtection'),
    'ai-ocean-health-monitoring-platform': lazyWithRetry(() => import('./AiOceanHealthMonitoringPlatform.tsx'), 'AiOceanHealthMonitoringPlatform'),
    'ai-polar-ice-cap-melt-predictor': lazyWithRetry(() => import('./AiPolarIceCapMeltPredictor.tsx'), 'AiPolarIceCapMeltPredictor'),
    'ai-seismic-activity-predictor': lazyWithRetry(() => import('./AiSeismicActivityPredictor.tsx'), 'AiSeismicActivityPredictor'),
    'ai-tsunami-early-warning-system': lazyWithRetry(() => import('./AiTsunamiEarlyWarningSystem.tsx'), 'AiTsunamiEarlyWarningSystem'),
    'ai-volcano-eruption-forecaster': lazyWithRetry(() => import('./AiVolcanoEruptionForecaster.tsx'), 'AiVolcanoEruptionForecaster'),
    'ai-planetary-defense-system-designer': lazyWithRetry(() => import('./AiPlanetaryDefenseSystemDesigner.tsx'), 'AiPlanetaryDefenseSystemDesigner'),
    'ai-exoplanet-discovery-analyzer': lazyWithRetry(() => import('./AiExoplanetDiscoveryAnalyzer.tsx'), 'AiExoplanetDiscoveryAnalyzer'),
    'ai-dark-matter-detection-assistant': lazyWithRetry(() => import('./AiDarkMatterDetectionAssistant.tsx'), 'AiDarkMatterDetectionAssistant'),
    'ai-quantum-field-theory-simulator': lazyWithRetry(() => import('./AiQuantumFieldTheorySimulator.tsx'), 'AiQuantumFieldTheorySimulator'),
    'ai-unified-field-theory-proposer': lazyWithRetry(() => import('./AiUnifiedFieldTheoryProposer.tsx'), 'AiUnifiedFieldTheoryProposer'), // The ultimate AI scientific feature.
    'ai-consciousness-modeling-framework': lazyWithRetry(() => import('./AiConsciousnessModelingFramework.tsx'), 'AiConsciousnessModelingFramework'),
    'ai-artificial-general-intelligence-trainer': lazyWithRetry(() => import('./AiArtificialGeneralIntelligenceTrainer.tsx'), 'AiArtificialGeneralIntelligenceTrainer'), // The holy grail.
    'ai-self-modifying-code-designer': lazyWithRetry(() => import('./AiSelfModifyingCodeDesigner.tsx'), 'AiSelfModifyingCodeDesigner'),
    'ai-autonomous-devops-agent': lazyWithRetry(() => import('./AiAutonomousDevopsAgent.tsx'), 'AiAutonomousDevopsAgent'),
    'ai-zero-day-exploit-predictor': lazyWithRetry(() => import('./AiZeroDayExploitPredictor.tsx'), 'AiZeroDayExploitPredictor'),
    'ai-encrypted-computing-enabler': lazyWithRetry(() => import('./AiEncryptedComputingEnabler.tsx'), 'AiEncryptedComputingEnabler'), // For fully homomorphic encryption.
    'ai-privacy-preserving-data-sharing': lazyWithRetry(() => import('./AiPrivacyPreservingDataSharing.tsx'), 'AiPrivacyPreservingDataSharing'),
    'ai-ethical-ai-governance-framework': lazyWithRetry(() => import('./AiEthicalAiGovernanceFramework.tsx'), 'AiEthicalAiGovernanceFramework'),
    'ai-value-alignment-testing-suite': lazyWithRetry(() => import('./AiValueAlignmentTestingSuite.tsx'), 'AiValueAlignmentTestingSuite'),
    'ai-human-robot-collaboration-platform': lazyWithRetry(() => import('./AiHumanRobotCollaborationPlatform.tsx'), 'AiHumanRobotCollaborationPlatform'),
    'ai-swarm-intelligence-orchestrator': lazyWithRetry(() => import('./AiSwarmIntelligenceOrchestrator.tsx'), 'AiSwarmIntelligenceOrchestrator'),
    'ai-collective-decision-making-platform': lazyWithRetry(() => import('./AiCollectiveDecisionMakingPlatform.tsx'), 'AiCollectiveDecisionMakingPlatform'),
    'ai-decentralized-autonomous-organization-toolkit': lazyWithRetry(() => import('./AiDecentralizedAutonomousOrganizationToolkit.tsx'), 'AiDecentralizedAutonomousOrganizationToolkit'),
    'ai-blockchain-data-forensics': lazyWithRetry(() => import('./AiBlockchainDataForensics.tsx'), 'AiBlockchainDataForensics'),
    'ai-predictive-maintenance-for-quantum-computers': lazyWithRetry(() => import('./AiPredictiveMaintenanceForQuantumComputers.tsx'), 'AiPredictiveMaintenanceForQuantumComputers'),
    'ai-fusion-reactor-simulation-suite': lazyWithRetry(() => import('./AiFusionReactorSimulationSuite.tsx'), 'AiFusionReactorSimulationSuite'),
    'ai-universal-language-interpreter': lazyWithRetry(() => import('./AiUniversalLanguageInterpreter.tsx'), 'AiUniversalLanguageInterpreter'),
    'ai-global-epidemic-predictor': lazyWithRetry(() => import('./AiGlobalEpidemicPredictor.tsx'), 'AiGlobalEpidemicPredictor'),
    'ai-social-cohesion-optimizer': lazyWithRetry(() => import('./AiSocialCohesionOptimizer.tsx'), 'AiSocialCohesionOptimizer'),
    'ai-interstellar-communication-relay': lazyWithRetry(() => import('./AiInterstellarCommunicationRelay.tsx'), 'AiInterstellarCommunicationRelay'),
    'ai-self-improving-software-factory': lazyWithRetry(() => import('./AiSelfImprovingSoftwareFactory.tsx'), 'AiSelfImprovingSoftwareFactory'), // The ultimate goal of Project Athena.
};

export const ALL_FEATURES: Feature[] = RAW_FEATURES.map(feature => ({
    ...feature,
    component: componentMap[feature.id],
}));

export const FEATURES_MAP = new Map(ALL_FEATURES.map(f => [f.id, f]));
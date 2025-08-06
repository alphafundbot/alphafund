import type {
  FirebaseConfig,
  ServiceConfig,
  ServiceCategoryConfig, ServiceItem, MeshNode
} from './config-types';
import { LucideIcon, Users, Database, Code, Server, Vault, BarChart2, Bell, FlaskConical, AppWindow, BrainCircuit } from 'lucide-react';

export const defaultConfig: FirebaseConfig = {
  auth: {
    enableAuth: true,
    enablePhoneAuth: false,
    enableAnonymousAuth: false,
    enableMFA: true,
    customClaimsEnabled: true,
    identityPlatformEnabled: true,
  },
  firestore: {
    enable: true,
    offlinePersistence: true,
    indexManagement: true,
    rtdbEnabled: false,
  },
  functions: {
    enableHttpsTriggers: true,
    firestoreTriggers: true,
    pubSubHooks: true,
    schedulerEnabled: true,
  },
  hosting: {
    enableHosting: true,
    customDomains: true,
    previewChannels: true,
    ssrSupport: true,
    i18nRouting: false,
  },
  secrets: {
    useVault: true,
    useFunctionConfigStore: true,
    appCheckEnabled: true,
  },
  monitoring: {
    analyticsEnabled: true,
    perfMonitoring: true,
    crashlyticsEnabled: true,
    loggingEnabled: true,
  },
  messaging: {
    fcmEnabled: true,
    inAppMessaging: true,
  },
  testing: {
    emulatorSuiteEnabled: true,
    testLabIntegration: false,
  },
  distribution: {
    appDistribution: true,
    dynamicLinks: true,
    abTestingEnabled: true,
  },
  signal: {
    firestoreSignalRouting: true,
    aiFunctionHooks: true,
    strategistMemoryEnabled: true,
  },
};

export const serviceConfig: ServiceConfig = {
    auth: {
        title: "Authentication & Identity",
        description: "Manage user sign-in, security, and access control.",
        icon: Users,
        items: {
            enableAuth: { name: "Firebase Auth", description: "Email/password, OAuth, and SSO." } as ServiceItem,
            enablePhoneAuth: { name: "Phone Auth", description: "SMS-based user authentication." } as ServiceItem,
            enableAnonymousAuth: { name: "Anonymous Auth", description: "Temporary guest accounts." } as ServiceItem,
            enableMFA: { name: "Multi-factor Auth", description: "TOTP and device-level MFA." } as ServiceItem,
            customClaimsEnabled: { name: "Custom Claims", description: "Role and permission assignment." } as ServiceItem,
            identityPlatformEnabled: { name: "Identity Platform", description: "Enterprise-grade access federation." } as ServiceItem,
        }
    } as ServiceCategoryConfig,
    firestore: {
        title: "Realtime & Persistent Data",
        description: "Store and sync data for your application.",
        icon: Database,
        items: {
            enable: { name: "Firestore", description: "Document-based cloud database." } as ServiceItem,
            offlinePersistence: { name: "Offline Sync", description: "Local cache and persistence." } as ServiceItem,
            indexManagement: { name: "Firestore Indexes", description: "Composite & single-field queries." } as ServiceItem,
            rtdbEnabled: { name: "Realtime DB (Legacy)", description: "Legacy tree-based database." } as ServiceItem,
        }
    } as ServiceCategoryConfig,
    functions: {
        title: "Functions & Triggers",
        description: "Run backend logic in a serverless environment.",
        icon: Code,
        items: {
            enableHttpsTriggers: { name: "HTTPS Triggers", description: "Public REST API entrypoints." } as ServiceItem,
            firestoreTriggers: { name: "Firestore Triggers", description: "OnCreate, OnUpdate, OnDelete hooks." } as ServiceItem,
            pubSubHooks: { name: "Pub/Sub Integration", description: "Background task orchestration." } as ServiceItem,
            schedulerEnabled: { name: "Scheduler", description: "Cron-like task execution." } as ServiceItem,
        }
    } as ServiceCategoryConfig,
    hosting: {
        title: "Deployment & Hosting",
        description: "Deploy and host your web assets.",
        icon: Server,
        items: {
            enableHosting: { name: "Firebase Hosting", description: "CDN-backed static + dynamic hosting." } as ServiceItem,
            customDomains: { name: "Custom Domains", description: "Third-party domain routing." } as ServiceItem,
            previewChannels: { name: "Preview Channels", description: "Git-based preview deployments." } as ServiceItem,
            ssrSupport: { name: "SSR Support", description: "Server-side rendering hosting." } as ServiceItem,
            i18nRouting: { name: "i18n Routing", description: "Locale-aware path routing." } as ServiceItem,
        }
    } as ServiceCategoryConfig,
    secrets: {
        title: "Secrets, Config, Vaults",
        description: "Manage secrets and application configuration.",
        icon: Vault,
        items: {
            useVault: { name: "Vault-Backed Secrets", description: "Externalized API key storage." } as ServiceItem,
            useFunctionConfigStore: { name: "Functions Config Store", description: "Encrypted environment values." } as ServiceItem,
            appCheckEnabled: { name: "App Check", description: "Prevent abuse from non-trusted clients." } as ServiceItem,
        }
    } as ServiceCategoryConfig,
    monitoring: {
        title: "Monitoring & Analytics",
        description: "Track usage, performance, and errors.",
        icon: BarChart2,
        items: {
            analyticsEnabled: { name: "Firebase Analytics", description: "Web and mobile usage tracking." } as ServiceItem,
            perfMonitoring: { name: "Performance Monitoring", description: "Latency and error distribution." } as ServiceItem,
            crashlyticsEnabled: { name: "Crashlytics", description: "Runtime error diagnostics." } as ServiceItem,
            loggingEnabled: { name: "Logging Console", description: "Function and application logs." } as ServiceItem,
        }
    } as ServiceCategoryConfig,
    messaging: {
        title: "Messaging & Signals",
        description: "Engage users with push notifications and messages.",
        icon: Bell,
        items: {
            fcmEnabled: { name: "Cloud Messaging (FCM)", description: "Push and signal notifications." } as ServiceItem,
            inAppMessaging: { name: "In-App Messaging", description: "Contextual prompts in your UI." } as ServiceItem,
        }
    } as ServiceCategoryConfig,
    testing: {
        title: "Testing & QA",
        description: "Ensure quality with local and cloud testing.",
        icon: FlaskConical,
        items: {
            emulatorSuiteEnabled: { name: "Emulator Suite", description: "Local dev/testing environment." } as ServiceItem,
            testLabIntegration: { name: "Test Lab", description: "Device-based automated testing." } as ServiceItem,
        }
    } as ServiceCategoryConfig,
    distribution: {
        title: "App Distribution & Linking",
        description: "Distribute pre-release apps and create deep links.",
        icon: AppWindow,
        items: {
            appDistribution: { name: "App Distribution", description: "CI/CD for testers and stakeholders." } as ServiceItem,
            dynamicLinks: { name: "Dynamic Links", description: "Deep linking into applications." } as ServiceItem,
            abTestingEnabled: { name: "A/B Testing", description: "Split UI and logic experiments." } as ServiceItem,
        }
    } as ServiceCategoryConfig,
    signal: {
        title: "AI Signals Integration",
        description: "Orchestrate AI pipelines with Firestore Signals.",
        icon: BrainCircuit,
        items: {
            firestoreSignalRouting: { name: "Firestore Signals", description: "Document routing for AI." } as ServiceItem,
            aiFunctionHooks: { name: "Cloud Functions AI Hooks", description: "Trigger AI pipelines on signal change." } as ServiceItem,
            strategistMemoryEnabled: { name: "Modular Signal Memory", description: "Custom document-driven flows." } as ServiceItem,
        }
    } as ServiceCategoryConfig,
};

export const bootstrapNode: MeshNode = {
  nodeId: 'bootstrap-001',
  region: 'us-central1',
  telemetry: {
   status: 'healthy',
   version: '1.0.0',
 },
};

export const iconMap = {
  auth: Users,
  firestore: Database,
  functions: Code,
  hosting: Server,
  secrets: Vault,
  monitoring: BarChart2,
  messaging: Bell,
  testing: FlaskConical,
  distribution: AppWindow,
  signal: BrainCircuit
};


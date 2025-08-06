
import type { FirebaseConfig, ServiceConfig } from './types';
import {
  ShieldCheck, Smartphone, KeyRound, UserCog, Users, Database, DatabaseZap, ListTree, WifiOff,
  Code, Globe, FileCog, UserCheck, MessageSquare, Clock, Server, GitPullRequest, Globe2, Languages,
  Container, ShieldBan, Vault, BarChart2, Gauge, Bug, Terminal, Bell, MessageCircle, Laptop,
  FlaskConical, AppWindow, Link, GitCompareArrows, Signal, Bot, BrainCircuit
} from 'lucide-react';

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
            enableAuth: { name: "Firebase Auth", description: "Email/password, OAuth, and SSO." },
            enablePhoneAuth: { name: "Phone Auth", description: "SMS-based user authentication." },
            enableAnonymousAuth: { name: "Anonymous Auth", description: "Temporary guest accounts." },
            enableMFA: { name: "Multi-factor Auth", description: "TOTP and device-level MFA." },
            customClaimsEnabled: { name: "Custom Claims", description: "Role and permission assignment." },
            identityPlatformEnabled: { name: "Identity Platform", description: "Enterprise-grade access federation." }
        }
    },
    firestore: {
        title: "Realtime & Persistent Data",
        description: "Store and sync data for your application.",
        icon: Database,
        items: {
            enable: { name: "Firestore", description: "Document-based cloud database." },
            offlinePersistence: { name: "Offline Sync", description: "Local cache and persistence." },
            indexManagement: { name: "Firestore Indexes", description: "Composite & single-field queries." },
            rtdbEnabled: { name: "Realtime DB (Legacy)", description: "Legacy tree-based database." }
        }
    },
    functions: {
        title: "Functions & Triggers",
        description: "Run backend logic in a serverless environment.",
        icon: Code,
        items: {
            enableHttpsTriggers: { name: "HTTPS Triggers", description: "Public REST API entrypoints." },
            firestoreTriggers: { name: "Firestore Triggers", description: "OnCreate, OnUpdate, OnDelete hooks." },
            pubSubHooks: { name: "Pub/Sub Integration", description: "Background task orchestration." },
            schedulerEnabled: { name: "Scheduler", description: "Cron-like task execution." }
        }
    },
    hosting: {
        title: "Deployment & Hosting",
        description: "Deploy and host your web assets.",
        icon: Server,
        items: {
            enableHosting: { name: "Firebase Hosting", description: "CDN-backed static + dynamic hosting." },
            customDomains: { name: "Custom Domains", description: "Third-party domain routing." },
            previewChannels: { name: "Preview Channels", description: "Git-based preview deployments." },
            ssrSupport: { name: "SSR Support", description: "Server-side rendering hosting." },
            i18nRouting: { name: "i18n Routing", description: "Locale-aware path routing." }
        }
    },
    secrets: {
        title: "Secrets, Config, Vaults",
        description: "Manage secrets and application configuration.",
        icon: Vault,
        items: {
            useVault: { name: "Vault-Backed Secrets", description: "Externalized API key storage." },
            useFunctionConfigStore: { name: "Functions Config Store", description: "Encrypted environment values." },
            appCheckEnabled: { name: "App Check", description: "Prevent abuse from non-trusted clients." }
        }
    },
    monitoring: {
        title: "Monitoring & Analytics",
        description: "Track usage, performance, and errors.",
        icon: BarChart2,
        items: {
            analyticsEnabled: { name: "Firebase Analytics", description: "Web and mobile usage tracking." },
            perfMonitoring: { name: "Performance Monitoring", description: "Latency and error distribution." },
            crashlyticsEnabled: { name: "Crashlytics", description: "Runtime error diagnostics." },
            loggingEnabled: { name: "Logging Console", description: "Function and application logs." }
        }
    },
    messaging: {
        title: "Messaging & Signals",
        description: "Engage users with push notifications and messages.",
        icon: Bell,
        items: {
            fcmEnabled: { name: "Cloud Messaging (FCM)", description: "Push and signal notifications." },
            inAppMessaging: { name: "In-App Messaging", description: "Contextual prompts in your UI." }
        }
    },
    testing: {
        title: "Testing & QA",
        description: "Ensure quality with local and cloud testing.",
        icon: FlaskConical,
        items: {
            emulatorSuiteEnabled: { name: "Emulator Suite", description: "Local dev/testing environment." },
            testLabIntegration: { name: "Test Lab", description: "Device-based automated testing." }
        }
    },
    distribution: {
        title: "App Distribution & Linking",
        description: "Distribute pre-release apps and create deep links.",
        icon: AppWindow,
        items: {
            appDistribution: { name: "App Distribution", description: "CI/CD for testers and stakeholders." },
            dynamicLinks: { name: "Dynamic Links", description: "Deep linking into applications." },
            abTestingEnabled: { name: "A/B Testing", description: "Split UI and logic experiments." }
        }
    },
    signal: {
        title: "AI Signals Integration",
        description: "Orchestrate AI pipelines with Firestore Signals.",
        icon: BrainCircuit,
        items: {
            firestoreSignalRouting: { name: "Firestore Signals", description: "Document routing for AI." },
            aiFunctionHooks: { name: "Cloud Functions AI Hooks", description: "Trigger AI pipelines on signal change." },
            strategistMemoryEnabled: { name: "Modular Signal Memory", description: "Custom document-driven flows." }
        }
    }
};

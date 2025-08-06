import {
  LayoutDashboard, Settings, User, Cpu, Banknote, CandlestickChart, Cloud, 
  Router, Dna, Landmark, Brush, Shield, Sun, LucideIcon,
  Wrench, Signal, Server, KeyRound, MonitorPlay, GitBranch, ShieldCheck,
  Zap, BrainCircuit, LandmarkIcon, HandCoins, Building, FileClock, PiggyBank,
  Scale, ArrowLeftRight, Search, FileCog, FileStack, LineChart, Bot, Tv,
  Sigma, AreaChart, Network, HardDrive, GitCommitVertical, Code, Webhook,
  ServerCog, TowerControl, Car, Antenna, Ship, Wifi, Radio, LockKeyhole,
  Container, Stethoscope, Microscope, Brain, HeartPulse, DnaIcon, Activity,
  Gavel, Users, UserCog, Vote, Library, BookOpen, UserCheck, Palette,
  Monitor, PenTool, GitCompareArrows, SwatchBook, SunMoon, ScanSearch,
  BotMessageSquare, Lock, Fingerprint, ShieldAlert, Key, Siren, FolderLock,
  Route, ShieldQuestion, FileTerminal, DatabaseBackup, Star, Atom, Globe2,
  Gauge, Bug
} from 'lucide-react';

interface Module {
    title: string;
    slug: string;
    href: string;
    icon: LucideIcon;
}

interface Cluster {
    title: string;
    icon: LucideIcon;
    modules: Module[];
}

interface NavConfig {
    topNav: {
        href: string;
        label: string;
        icon: LucideIcon;
    }[];
    clusters: Cluster[];
}

const createModule = (title: string, icon: LucideIcon): Module => {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    return { title, slug, href: `/clusters/${slug}`, icon };
};

export const navConfig: NavConfig = {
    topNav: [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/settings', label: 'Settings', icon: Settings },
        { href: '/profile', label: 'Profile', icon: User },
    ],
    clusters: [
        {
            title: "Strategist Core",
            icon: Cpu,
            modules: [
                createModule("System Configurator", Wrench),
                createModule("Signal Router", Signal),
                createModule("Node Sync Monitor", Server),
                createModule("Vault Operations", KeyRound),
                createModule("Strategist Scripts", MonitorPlay),
                createModule("Latency Visualizer", GitBranch),
                createModule("Role-Based Access", ShieldCheck),
                createModule("Transcendental Engine", Zap),
                createModule("AI Console", BrainCircuit),
                createModule("Signal Memory", FileClock),
            ]
        },
        {
            title: "Finance & Monetization",
            icon: Banknote,
            modules: [
                createModule("Financial Orchestration", LandmarkIcon),
                createModule("Virtual Debit Suite", HandCoins),
                createModule("Token Economy", Building),
                createModule("Treasury Dashboard", PiggyBank),
                createModule("Asset Ledger", Scale),
                createModule("Subscription Manager", FileClock),
                createModule("Crypto-Fiat Bridge", ArrowLeftRight),
                createModule("Payment Flow Designer", Search),
                createModule("Fraud Intelligence", FileCog),
                createModule("Revenue Audit", FileStack),
            ]
        },
        {
            title: "Trading Intelligence",
            icon: CandlestickChart,
            modules: [
                createModule("Trading Suite", LineChart),
                createModule("Market Analyzer", Search),
                createModule("Backtesting Engine", FileCog),
                createModule("Portfolio Manager", PiggyBank),
                createModule("Exchange Sync", ArrowLeftRight),
                createModule("Trading Bots", Bot),
                createModule("Live Market Feed", Tv),
                createModule("Chart Studio", AreaChart),
                createModule("Signal Visualizer", Sigma),
                createModule("Risk Panel", ShieldAlert),
            ]
        },
        {
            title: "Cloud & DevOps",
            icon: Cloud,
            modules: [
                createModule("Cloud Hub", Network),
                createModule("CI/CD Manager", HardDrive),
                createModule("Firebase Studio", GitCommitVertical),
                createModule("Hosting Manager", Server),
                createModule("Quota Monitor", Gauge),
                createModule("Secret Vault", KeyRound),
                createModule("Multi-Region Deploy", Globe2),
                createModule("Runtime Debugger", Bug),
                createModule("Env Configurator", Code),
                createModule("Webhook Studio", Webhook),
            ]
        },
        {
            title: "Telecom & Autonomous",
            icon: Router,
            modules: [
                createModule("MVNO Panel", ServerCog),
                createModule("Signal Visualizer", Signal),
                createModule("Autonomous Console", Car),
                createModule("Lidar Feed", Antenna),
                createModule("IoT Manager", Ship),
                createModule("Signal Sovereignty", Wifi),
                createModule("SIM Vault", Radio),
                createModule("Mesh Designer", Network),
                createModule("Telecom Monetization", PiggyBank),
                createModule("Compliance Matrix", LockKeyhole),
            ]
        },
        {
            title: "Medical & Biometric",
            icon: Dna,
            modules: [
                createModule("Medical Vault", Container),
                createModule("Biometric Router", Fingerprint),
                createModule("Neural Interface", Brain),
                createModule("Health Sovereignty", HeartPulse),
                createModule("DNA Mapper", DnaIcon),
                createModule("Biofeedback Studio", Activity),
                createModule("Medical AI", Stethoscope),
                createModule("Jurisdictional Router", Gavel),
                createModule("Wellness Dashboard", UserCheck),
                createModule("Emergency Console", Siren),
            ]
        },
        {
            title: "Governance & Identity",
            icon: Landmark,
            modules: [
                createModule("Compliance Engine", Gavel),
                createModule("Identity Vault", KeyRound),
                createModule("Role Access Control", Users),
                createModule("Signal Citizenship", UserCog),
                createModule("Legal Router", BookOpen),
                createModule("DAO Console", Library),
                createModule("Consent Ledger", FileClock),
                createModule("Voting Studio", Vote),
                createModule("Compliance Visualizer", FileStack),
                createModule("Rights Engine", ShieldCheck),
            ]
        },
        {
            title: "Visuals & UX",
            icon: Brush,
            modules: [
                createModule("Dashboard Designer", Palette),
                createModule("Modular UI", Monitor),
                createModule("Live Preview", Tv),
                createModule("Chart Studio", AreaChart),
                createModule("Theme Manager", SwatchBook),
                createModule("Dark Mode", SunMoon),
                createModule("Signal Mapper", Network),
                createModule("Strategist HUD", ScanSearch),
                createModule("UX Feedback", BotMessageSquare),
                createModule("Visual AI", BrainCircuit),
            ]
        },
        {
            title: "Security & Privacy",
            icon: Shield,
            modules: [
                createModule("Vault Console", KeyRound),
                createModule("Encryption Studio", Lock),
                createModule("Firewall", ShieldAlert),
                createModule("Privacy Router", ShieldQuestion),
                createModule("Threat Panel", Siren),
                createModule("Lockdown Mode", FolderLock),
                createModule("Secure Transport", Route),
                createModule("Auth Hub", Users),
                createModule("Audit Trail", FileTerminal),
                createModule("Backup Engine", DatabaseBackup),
            ]
        },
        {
            title: "Nature & Planetary Systems",
            icon: Sun,
            modules: [
                createModule("Solar Router", Sun),
                createModule("Gravity Engine", Atom),
                createModule("Nature-AI Interface", BrainCircuit),
                createModule("Planetary Mapper", Globe2),
                createModule("Eco-Mesh Designer", Network),
                createModule("Resource Console", Container),
                createModule("Climate Vault", KeyRound),
                createModule("Habitat Manager", Building),
                createModule("Energy Engine", Zap),
                createModule("Cosmic Visualizer", Star),
            ]
        }
    ]
};

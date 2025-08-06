
import type { LucideIcon } from 'lucide-react';
import type { defaultConfig } from './config';

export type FirebaseConfig = typeof defaultConfig;

export type ServiceItem = {
    name: string;
    description: string;
};

export type ServiceCategoryConfig = {
    title: string;
    description: string;
    icon: LucideIcon;
    items: Record<string, ServiceItem>;
};

export type ServiceConfig = Record<keyof FirebaseConfig, ServiceCategoryConfig>;

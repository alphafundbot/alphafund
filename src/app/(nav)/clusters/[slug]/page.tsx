import { navConfig } from "@/lib/nav-config"
import { notFound } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export async function generateStaticParams() {
    const slugs = navConfig.clusters.flatMap(c => c.modules.map(m => m.slug));
    return slugs.map(slug => ({ slug }));
}

export default function ModulePage({ params }: { params: { slug: string } }) {
    const module = navConfig.clusters.flatMap(c => c.modules).find(m => m.slug === params.slug);
    const cluster = navConfig.clusters.find(c => c.modules.some(m => m.slug === params.slug));

    if (!module || !cluster) {
        notFound();
    }

    const Icon = module.icon;
    const ClusterIcon = cluster.icon;

    return (
        <div className="flex flex-col gap-4">
             <div className="flex items-center gap-4">
                <Icon className="h-8 w-8 text-primary" />
                <div>
                <h1 className="text-3xl font-bold font-headline">{module.title}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                    <ClusterIcon className="h-4 w-4" />
                    {cluster.title}
                </p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>This module is under construction. Check back later for updates!</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}

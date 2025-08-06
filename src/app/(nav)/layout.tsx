import { AppLayout } from '@/components/layout';

export default function NavLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppLayout>{children}</AppLayout>;
}

import { fetchConfig } from '@/app/actions';
import { FirebaseConfigClient } from '@/components/firebase-config-client';
import { Header } from '@/components/header';

export default async function Home() {
  const config = await fetchConfig();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <FirebaseConfigClient initialConfig={config} />
      </main>
    </div>
  );
}

import { fetchConfig } from '@/app/actions';
import { FirebaseConfigClient } from '@/components/firebase-config-client';
import { AppLayout } from '@/components/layout';

export default async function SettingsPage() {
  const config = await fetchConfig();

  return (
    <AppLayout>
        <FirebaseConfigClient initialConfig={config} />
    </AppLayout>
  );
}

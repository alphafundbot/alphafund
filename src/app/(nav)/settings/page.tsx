
import { fetchConfig } from '@/app/actions';
import { FirebaseConfigClient } from '@/components/firebase-config-client';

export default async function SettingsPage() {
  const config = await fetchConfig();

  return (
    <FirebaseConfigClient initialConfig={config} />
  );
}

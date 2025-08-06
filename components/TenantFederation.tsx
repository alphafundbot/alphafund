export function TenantFederation() {
  const tenants = [
    { name: 'AtlasAI', regions: ['us-west', 'us-east'], sharedVault: true },
    { name: 'SovereignMesh', regions: ['eu-central'], sharedVault: false },
  ];

  return (
    <div>
      <h2>🧭 Multi-Tenant Federation</h2>
      <ul>
        {tenants.map((t, idx) => (
          <li key={idx}>
            {t.name}: {t.regions.join(', ')} — Vault: {t.sharedVault ? 'Shared' : 'Isolated'}
          </li>
        ))}
      </ul>
    </div>
  );
}
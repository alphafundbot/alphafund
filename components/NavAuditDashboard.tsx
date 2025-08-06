import { auditNavItems } from '../lib/navAudit';

export function NavAuditDashboard() {
  const violations = auditNavItems();

  return (
    <div>
      <h2>📋 Nav Compliance Audit</h2>
      <ul>
        {Object.entries(violations).map(([id, issues]) => (
          <li key={id}>
            <strong>{id}</strong>
            <ul>
              {issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
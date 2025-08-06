import navRegistry from '../config/navRegistry.json';

export function auditNavItems(): Record<string, string[]> {
  const violations: Record<string, string[]> = {};

  navRegistry.forEach(item => {
    const issues: string[] = [];

    if (item.jurisdictionalImpact && item.auditStatus !== 'compliant') {
      issues.push('Jurisdictional Compliance Pending');
    }

    if (item.signalSensitive && item.auditStatus === 'violated') {
      issues.push('Signal Routing Violation');
    }

    if (issues.length > 0) {
      violations[item.id] = issues;
    }
  });

  return violations;
}
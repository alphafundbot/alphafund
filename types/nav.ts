export interface NavItem {
  id: string;
  label: string;
  route: string;
  category: 'core' | 'telecom' | 'compliance' | 'analytics' | 'experimental';
  jurisdictionalImpact?: boolean;
  signalSensitive?: boolean;
  auditStatus?: 'pending' | 'compliant' | 'violated';
}
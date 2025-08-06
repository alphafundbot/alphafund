import { StrategistDashboard } from '../components/StrategistDashboard';
import { JurisdictionEditor } from '../components/JurisdictionEditor';
import { ComplianceHeatmap } from '../components/ComplianceHeatmap';
import { NavAuditDashboard } from '../components/NavAuditDashboard';
import { TelecomRouting } from '../components/TelecomRouting';
import { MVNOManager } from '../components/MVNOManager';
import { QuantumVault } from '../components/QuantumVault';
import { SignalObservatory } from '../components/SignalObservatory';
import { CognitionStudio } from '../components/CognitionStudio';
import { TenantFederation } from '../components/TenantFederation';
import { ComplianceForecast } from '../components/ComplianceForecast';
import { VaultNegotiator } from '../components/VaultNegotiator';
import { SignalStressSimulator } from '../components/SignalStressSimulator';
import { CognitionReplay } from '../components/CognitionReplay';
import { SovereignRisk } from '../components/SovereignRisk';
import { FederationOrchestrator } from '../components/FederationOrchestrator';

export default function DashboardPage() {
  return (
    <div>
      <h1>🧠 Strategist Mesh Dashboard</h1>
      <StrategistDashboard />
      <ComplianceHeatmap />
      <NavAuditDashboard />
      <NavAuditDashboard />
      <TelecomRouting />
      <MVNOManager />
      <QuantumVault />
      <SignalObservatory />
      <CognitionStudio />      <VaultNegotiator />
      <SignalStressSimulator />
      <CognitionReplay />
      <SovereignRisk />
      <FederationOrchestrator />
      <TenantFederation />
      <ComplianceForecast />
      <JurisdictionEditor />
    </div>
  );
}
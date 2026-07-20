import { AppIcon, AppShell } from "../app-shell";
import { LocalDashboard } from "./local-dashboard";

export default function DashboardPage() {
  return (
    <AppShell
      active="painel"
      eyebrow="Visão geral"
      title="Sua mesa de estudos"
      headerAction={<a className="app-action app-action-primary" href="/simulados"><AppIcon name="plus" /> Novo simulado</a>}
    >
      <LocalDashboard />
    </AppShell>
  );
}

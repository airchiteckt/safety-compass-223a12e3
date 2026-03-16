import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { aziende, scadenze, tipoScadenzaLabels } from "@/data/mock";
import { Building2, AlertTriangle, CalendarClock, GraduationCap, Stethoscope, Leaf } from "lucide-react";

function KPICard({ icon: Icon, label, value, accent }: { icon: typeof Building2; label: string; value: string | number; accent?: string }) {
  return (
    <div className="fade-in-up rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent || "bg-primary/10 text-primary"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const scaduteCount = scadenze.filter((s) => s.status === "scaduto").length;
  const inScadenzaCount = scadenze.filter((s) => s.status === "in_scadenza").length;
  const aziendeConProblemi = aziende.filter((a) => a.status !== "ok").length;
  const avgCompliance = Math.round(aziende.reduce((sum, a) => sum + a.complianceScore, 0) / aziende.length);
  const corsiDaPianificare = scadenze.filter((s) => s.tipo === "formazione" && s.status !== "ok").length;
  const visiteDaPianificare = scadenze.filter((s) => s.tipo === "visita_medica" && s.status !== "ok").length;

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Panoramica generale sicurezza e compliance</p>
        </div>
        <div className="relative">
          <ComplianceGauge score={avgCompliance} />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard icon={Building2} label="Aziende gestite" value={aziende.length} />
        <KPICard icon={AlertTriangle} label="Con criticità" value={aziendeConProblemi} accent="bg-danger/10 text-danger" />
        <KPICard icon={CalendarClock} label="Scadenze urgenti" value={scaduteCount} accent="bg-danger/10 text-danger" />
        <KPICard icon={CalendarClock} label="In scadenza" value={inScadenzaCount} accent="bg-warning/10 text-warning" />
        <KPICard icon={GraduationCap} label="Corsi da pianificare" value={corsiDaPianificare} accent="bg-warning/10 text-warning" />
        <KPICard icon={Stethoscope} label="Visite da pianificare" value={visiteDaPianificare} accent="bg-warning/10 text-warning" />
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scadenze urgenti */}
        <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold text-foreground">Scadenze Critiche</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="sticky top-0 px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                  <th className="sticky top-0 px-4 py-3 text-left font-medium text-muted-foreground">Elemento</th>
                  <th className="sticky top-0 px-4 py-3 text-left font-medium text-muted-foreground">Azienda</th>
                  <th className="sticky top-0 px-4 py-3 text-left font-medium text-muted-foreground">Scadenza</th>
                  <th className="sticky top-0 px-4 py-3 text-left font-medium text-muted-foreground">Stato</th>
                </tr>
              </thead>
              <tbody>
                {scadenze
                  .filter((s) => s.status !== "ok")
                  .sort((a, b) => (a.status === "scaduto" ? -1 : 1))
                  .slice(0, 8)
                  .map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-150">
                      <td className="px-4 py-3 text-muted-foreground">{tipoScadenzaLabels[s.tipo]}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{s.elemento}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.azienda}</td>
                      <td className="px-4 py-3 text-foreground">{new Date(s.scadenza).toLocaleDateString("it-IT")}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aziende */}
        <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold text-foreground">Aziende Clienti</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="sticky top-0 px-4 py-3 text-left font-medium text-muted-foreground">Azienda</th>
                  <th className="sticky top-0 px-4 py-3 text-left font-medium text-muted-foreground">Dipendenti</th>
                  <th className="sticky top-0 px-4 py-3 text-left font-medium text-muted-foreground">Compliance</th>
                  <th className="sticky top-0 px-4 py-3 text-left font-medium text-muted-foreground">Stato</th>
                </tr>
              </thead>
              <tbody>
                {aziende.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-150">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{a.ragioneSociale}</p>
                      <p className="text-xs text-muted-foreground">{a.partner}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{a.numeroDipendenti}</td>
                    <td className="px-4 py-3">
                      <span className={`font-display font-bold ${a.complianceScore >= 80 ? "text-success" : a.complianceScore >= 50 ? "text-warning" : "text-danger"}`}>
                        {a.complianceScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

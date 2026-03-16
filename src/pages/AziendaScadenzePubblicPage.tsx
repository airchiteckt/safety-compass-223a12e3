import { StatusBadge } from "@/components/StatusBadge";
import { aziende, scadenze, tipoScadenzaLabels } from "@/data/mock";
import { useParams } from "react-router-dom";
import { Building2, Shield, CalendarClock, GraduationCap, Stethoscope, FileText, Wrench, Leaf, AlertTriangle, CheckCircle2 } from "lucide-react";

const tipoIcons: Record<string, typeof CalendarClock> = {
  formazione: GraduationCap,
  visita_medica: Stethoscope,
  documento: FileText,
  verifica_impianto: Wrench,
  ambiente: Leaf,
};

export default function AziendaScadenzePubblicPage() {
  const { id } = useParams<{ id: string }>();
  const azienda = aziende.find((a) => a.id === id);

  if (!azienda) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">Azienda non trovata.</p>
      </div>
    );
  }

  const azScadenze = scadenze.filter((s) => s.azienda === azienda.ragioneSociale);
  const scaduteCount = azScadenze.filter((s) => s.status === "scaduto").length;
  const inScadenzaCount = azScadenze.filter((s) => s.status === "in_scadenza").length;
  const okCount = azScadenze.filter((s) => s.status === "ok").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">Pegaso ERP</span>
          </div>
          <span className="text-xs text-muted-foreground">Portale Scadenze</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Company header */}
        <div className="fade-in-up mb-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">{azienda.ragioneSociale}</h1>
              <p className="text-sm text-muted-foreground">Situazione scadenze sicurezza e ambiente</p>
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="fade-in-up rounded-lg border border-border bg-card p-4 shadow-sm text-center">
            <AlertTriangle className="mx-auto h-5 w-5 text-danger" />
            <p className="mt-1 font-display text-2xl font-bold text-danger">{scaduteCount}</p>
            <p className="text-xs text-muted-foreground">Scadute</p>
          </div>
          <div className="fade-in-up rounded-lg border border-border bg-card p-4 shadow-sm text-center">
            <CalendarClock className="mx-auto h-5 w-5 text-warning" />
            <p className="mt-1 font-display text-2xl font-bold text-warning">{inScadenzaCount}</p>
            <p className="text-xs text-muted-foreground">In scadenza</p>
          </div>
          <div className="fade-in-up rounded-lg border border-border bg-card p-4 shadow-sm text-center">
            <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
            <p className="mt-1 font-display text-2xl font-bold text-success">{okCount}</p>
            <p className="text-xs text-muted-foreground">In regola</p>
          </div>
        </div>

        {/* Table */}
        <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold text-foreground">Tutte le Scadenze</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Elemento</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Riferimento</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Scadenza</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stato</th>
                </tr>
              </thead>
              <tbody>
                {azScadenze
                  .sort((a, b) => (a.status === "scaduto" ? -1 : b.status === "scaduto" ? 1 : 0))
                  .map((s) => {
                    const Icon = tipoIcons[s.tipo] || CalendarClock;
                    return (
                      <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{tipoScadenzaLabels[s.tipo]}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">{s.elemento}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.riferimento}</td>
                        <td className="px-4 py-3 text-foreground">{new Date(s.scadenza).toLocaleDateString("it-IT")}</td>
                        <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      </tr>
                    );
                  })}
                {azScadenze.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nessuna scadenza registrata.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Gestito da Pegaso Design · Consulenza Sicurezza e Ambiente
        </footer>
      </main>
    </div>
  );
}

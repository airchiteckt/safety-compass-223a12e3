import { CFTLayout } from "@/components/CFTLayout";
import { affiliati, pianoLabels, pianoColors, statoAbbonamentoLabels } from "@/data/cft-mock";
import { aziende } from "@/data/mock";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Building, Users, CreditCard, TrendingUp, ArrowRight,
  CheckCircle2, AlertTriangle, Clock, UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

function KPICard({ icon: Icon, label, value, accent }: {
  icon: typeof Building; label: string; value: string | number; accent?: string;
}) {
  return (
    <div className="fade-in-up rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
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

export default function CFTDashboard() {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const totalAffiliati = affiliati.length;
    const attivi = affiliati.filter(a => a.statoAbbonamento === "attivo").length;
    const totalAziende = new Set(affiliati.flatMap(a => a.aziendeAssegnateIds)).size;
    const totalUtenti = affiliati.reduce((sum, a) => sum + a.utenti.length, 0);
    const mrrTotale = affiliati
      .filter(a => a.statoAbbonamento === "attivo" || a.statoAbbonamento === "trial")
      .reduce((sum, a) => sum + a.feeMessile, 0);
    const inScadenza = affiliati.filter(a => a.statoAbbonamento === "in_scadenza").length;

    return { totalAffiliati, attivi, totalAziende, totalUtenti, mrrTotale, inScadenza };
  }, []);

  return (
    <CFTLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard CFT</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestione centralizzata degli affiliati ERP & SGSL
        </p>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard icon={Building} label="Affiliati" value={stats.totalAffiliati} />
        <KPICard icon={CheckCircle2} label="Attivi" value={stats.attivi} accent="bg-success/10 text-success" />
        <KPICard icon={AlertTriangle} label="In scadenza" value={stats.inScadenza} accent="bg-warning/10 text-warning" />
        <KPICard icon={Building} label="Aziende gestite" value={stats.totalAziende} />
        <KPICard icon={Users} label="Utenti totali" value={stats.totalUtenti} />
        <KPICard icon={CreditCard} label="MRR" value={`€${stats.mrrTotale.toLocaleString("it-IT")}`} accent="bg-primary/10 text-primary" />
      </div>

      {/* Affiliati Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-semibold text-foreground">Affiliati</h2>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <UserPlus className="h-4 w-4" />
            Nuovo Affiliato
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Affiliato</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Piano</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stato</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aziende</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Utenti</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fee/mese</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {affiliati.map((aff) => {
                const aziendeCount = aff.aziendeAssegnateIds.length;
                const statusMap: Record<string, "ok" | "in_scadenza" | "scaduto"> = {
                  attivo: "ok",
                  trial: "in_scadenza",
                  in_scadenza: "in_scadenza",
                  scaduto: "scaduto",
                };
                return (
                  <tr key={aff.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{aff.ragioneSociale}</p>
                        <p className="text-xs text-muted-foreground">{aff.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${pianoColors[aff.piano]}`}>
                        {pianoLabels[aff.piano]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={statusMap[aff.statoAbbonamento]} label={statoAbbonamentoLabels[aff.statoAbbonamento]} />
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">{aziendeCount}</td>
                    <td className="px-5 py-4 text-sm text-foreground">{aff.utenti.length}</td>
                    <td className="px-5 py-4 text-sm font-medium text-foreground">€{aff.feeMessile}/mo</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/cft/affiliati/${aff.id}`)}
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        Dettagli <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </CFTLayout>
  );
}

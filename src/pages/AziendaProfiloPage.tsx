import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { aziende, scadenze, dipendenti, attrezzature, tipoScadenzaLabels } from "@/data/mock";
import { useParams, Link } from "react-router-dom";
import {
  Building2, MapPin, Phone, Mail, Users, Shield, Stethoscope,
  ArrowLeft, ExternalLink, Copy, CalendarClock, Wrench, GraduationCap,
  FileText, Leaf, AlertTriangle, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const rischioColors = {
  basso: "bg-success/10 text-success",
  medio: "bg-warning/10 text-warning",
  alto: "bg-danger/10 text-danger",
};

const tipoIcons: Record<string, typeof CalendarClock> = {
  formazione: GraduationCap,
  visita_medica: Stethoscope,
  documento: FileText,
  verifica_impianto: Wrench,
  ambiente: Leaf,
};

export default function AziendaProfiloPage() {
  const { id } = useParams<{ id: string }>();
  const azienda = aziende.find((a) => a.id === id);
  const [tab, setTab] = useState<"scadenze" | "dipendenti" | "attrezzature">("scadenze");

  if (!azienda) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-muted-foreground">Azienda non trovata.</p>
          <Link to="/aziende" className="mt-4 text-sm text-primary hover:underline">← Torna alle aziende</Link>
        </div>
      </AppLayout>
    );
  }

  const azScadenze = scadenze.filter((s) => s.azienda === azienda.ragioneSociale);
  const azDipendenti = dipendenti.filter((d) => d.aziendaId === azienda.id);
  const azAttrezzature = attrezzature.filter((a) => a.aziendaId === azienda.id);

  const scaduteCount = azScadenze.filter((s) => s.status === "scaduto").length;
  const inScadenzaCount = azScadenze.filter((s) => s.status === "in_scadenza").length;
  const okCount = azScadenze.filter((s) => s.status === "ok").length;

  const clientLink = `${window.location.origin}/aziende/${azienda.id}/scadenze`;

  const copyLink = () => {
    navigator.clipboard.writeText(clientLink);
    toast({ title: "Link copiato!", description: "Puoi condividerlo con il cliente." });
  };

  const tabs = [
    { key: "scadenze" as const, label: "Scadenze", count: azScadenze.length },
    { key: "dipendenti" as const, label: "Dipendenti", count: azDipendenti.length },
    { key: "attrezzature" as const, label: "Attrezzature", count: azAttrezzature.length },
  ];

  return (
    <AppLayout>
      {/* Back */}
      <Link to="/aziende" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Torna alle aziende
      </Link>

      {/* Header */}
      <div className="fade-in-up mb-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">{azienda.ragioneSociale}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="font-mono text-xs">P.IVA {azienda.piva}</span>
                <span>·</span>
                <span>ATECO {azienda.codiceAteco}</span>
                <span>·</span>
                <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize", rischioColors[azienda.rischio])}>
                  Rischio {azienda.rischio}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{azienda.indirizzo}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{azienda.telefono}</span>
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{azienda.email}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={azienda.status} />
        </div>

        {/* Info grid */}
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Referente</p>
            <p className="text-sm font-medium text-foreground">{azienda.referente}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">RSPP</p>
            <p className="text-sm font-medium text-foreground">{azienda.rspp}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Medico Competente</p>
            <p className="text-sm font-medium text-foreground">{azienda.medicoCompetente}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Dipendenti</p>
            <p className="text-sm font-medium text-foreground">{azienda.numeroDipendenti}</p>
          </div>
        </div>
      </div>

      {/* Client link */}
      <div className="fade-in-up mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">🔗 Link per il cliente</p>
            <p className="text-xs text-muted-foreground mt-0.5">Condividi questo link con l'azienda per monitorare le proprie scadenze</p>
          </div>
          <div className="flex items-center gap-2">
            <code className="rounded-md bg-card border border-border px-3 py-1.5 text-xs text-muted-foreground max-w-[300px] truncate">
              {clientLink}
            </code>
            <button onClick={copyLink} className="rounded-md border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Copia link">
              <Copy className="h-4 w-4" />
            </button>
            <Link to={`/aziende/${azienda.id}/scadenze`} className="rounded-md border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Apri vista cliente">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI mini */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="fade-in-up rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <span className="text-sm text-muted-foreground">Scadute</span>
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-danger">{scaduteCount}</p>
        </div>
        <div className="fade-in-up rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-warning" />
            <span className="text-sm text-muted-foreground">In scadenza</span>
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-warning">{inScadenzaCount}</p>
        </div>
        <div className="fade-in-up rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-sm text-muted-foreground">In regola</span>
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-success">{okCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-card p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "scadenze" && (
        <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
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
      )}

      {tab === "dipendenti" && (
        <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dipendente</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mansione</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reparto</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Contratto</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Idoneità</th>
                </tr>
              </thead>
              <tbody>
                {azDipendenti.map((d) => (
                  <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{d.nome} {d.cognome}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{d.mansione}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.reparto}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.tipoContratto}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.idoneitaSanitaria} /></td>
                  </tr>
                ))}
                {azDipendenti.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nessun dipendente registrato.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "attrezzature" && (
        <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Matricola</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ultima Verifica</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Prossima Verifica</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ente</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stato</th>
                </tr>
              </thead>
              <tbody>
                {azAttrezzature.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-cyan-500" />
                        <span className="font-medium text-foreground">{a.tipo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.matricola}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(a.ultimaVerifica).toLocaleDateString("it-IT")}</td>
                    <td className="px-4 py-3 text-foreground">{new Date(a.prossimaVerifica).toLocaleDateString("it-IT")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.enteVerificatore}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
                {azAttrezzature.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Nessuna attrezzatura registrata.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

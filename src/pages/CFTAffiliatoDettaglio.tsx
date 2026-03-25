import { CFTLayout } from "@/components/CFTLayout";
import { affiliati, pianoLabels, pianoColors, statoAbbonamentoLabels } from "@/data/cft-mock";
import { aziende } from "@/data/mock";
import { StatusBadge } from "@/components/StatusBadge";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Building2, Users, Mail, Phone, MapPin,
  CreditCard, Calendar, UserPlus, Pencil, Trash2, Shield
} from "lucide-react";

export default function CFTAffiliatoDettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const affiliato = affiliati.find((a) => a.id === id);

  if (!affiliato) {
    return (
      <CFTLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-muted-foreground">Affiliato non trovato</p>
          <button onClick={() => navigate("/cft")} className="mt-4 text-sm text-primary hover:underline">
            Torna alla dashboard
          </button>
        </div>
      </CFTLayout>
    );
  }

  const aziendeAssegnate = aziende.filter((a) => affiliato.aziendeAssegnateIds.includes(a.id));

  const statusMap: Record<string, "ok" | "in_scadenza" | "scaduto"> = {
    attivo: "ok",
    trial: "in_scadenza",
    in_scadenza: "in_scadenza",
    scaduto: "scaduto",
  };

  const ruoloLabels: Record<string, string> = {
    admin: "Amministratore",
    consulente: "Consulente",
    operatore: "Operatore",
  };

  return (
    <CFTLayout>
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate("/cft")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-4 w-4" /> Torna alla dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{affiliato.ragioneSociale}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Affiliato ERP & SGSL</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${pianoColors[affiliato.piano]}`}>
              {pianoLabels[affiliato.piano]}
            </span>
            <StatusBadge status={statusMap[affiliato.statoAbbonamento]} label={statoAbbonamentoLabels[affiliato.statoAbbonamento]} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Info Card */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold text-foreground">Dati Anagrafici</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">P.IVA</p>
                <p className="text-sm font-medium text-foreground">{affiliato.piva}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Indirizzo</p>
                <p className="text-sm font-medium text-foreground">{affiliato.indirizzo}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Referente</p>
                <p className="text-sm font-medium text-foreground">{affiliato.referente}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{affiliato.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Telefono</p>
                <p className="text-sm font-medium text-foreground">{affiliato.telefono}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Abbonamento */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold text-foreground">Abbonamento</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Fee mensile</p>
                <p className="text-lg font-display font-bold text-foreground">€{affiliato.feeMessile}/mese</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Attivazione</p>
                <p className="text-sm font-medium text-foreground">{new Date(affiliato.dataAttivazione).toLocaleDateString("it-IT")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Scadenza</p>
                <p className="text-sm font-medium text-foreground">{new Date(affiliato.scadenzaAbbonamento).toLocaleDateString("it-IT")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Utenti */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold text-foreground">Utenti ({affiliato.utenti.length})</h2>
            <button className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <UserPlus className="h-3 w-3" /> Aggiungi
            </button>
          </div>
          <div className="p-4 space-y-2">
            {affiliato.utenti.map((utente) => (
              <div key={utente.id} className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {utente.nome[0]}{utente.cognome[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{utente.nome} {utente.cognome}</p>
                    <p className="text-xs text-muted-foreground">{utente.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{ruoloLabels[utente.ruolo]}</span>
                  <span className={`h-2 w-2 rounded-full ${utente.attivo ? "bg-success" : "bg-muted-foreground"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aziende assegnate */}
      <div className="mt-6 rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-semibold text-foreground">
            Aziende Assegnate ({aziendeAssegnate.length})
          </h2>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Building2 className="h-4 w-4" /> Assegna Azienda
          </button>
        </div>
        {aziendeAssegnate.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Azienda</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dipendenti</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rischio</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compliance</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stato</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {aziendeAssegnate.map((az) => (
                  <tr key={az.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-foreground">{az.ragioneSociale}</p>
                      <p className="text-xs text-muted-foreground">{az.indirizzo}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">{az.numeroDipendenti}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={az.rischio === "alto" ? "scaduto" : az.rischio === "medio" ? "in_scadenza" : "ok"} label={az.rischio.charAt(0).toUpperCase() + az.rischio.slice(1)} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${az.complianceScore}%`,
                              background: az.complianceScore >= 80 ? "hsl(var(--success))" : az.complianceScore >= 50 ? "hsl(var(--warning))" : "hsl(var(--danger))",
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">{az.complianceScore}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={az.status} />
                    </td>
                    <td className="px-5 py-4">
                      <Link to={`/aziende/${az.id}`} className="text-xs font-medium text-primary hover:underline">
                        Apri ERP →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Shield className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm">Nessuna azienda assegnata</p>
            <p className="text-xs mt-1">Assegna aziende per attivare l'ERP & SGSL</p>
          </div>
        )}
      </div>
    </CFTLayout>
  );
}

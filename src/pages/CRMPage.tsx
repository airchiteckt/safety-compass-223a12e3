import { AppLayout } from "@/components/AppLayout";
import { aziende } from "@/data/mock";
import { Briefcase, Phone, Mail, FileText } from "lucide-react";

const mockContratti = [
  { aziendaId: "1", tipo: "Consulenza annuale", valore: "€ 4.800/anno", inizio: "2024-01-01", rinnovo: "2026-01-01", stato: "attivo" },
  { aziendaId: "2", tipo: "Consulenza + Formazione", valore: "€ 12.000/anno", inizio: "2023-06-01", rinnovo: "2025-06-01", stato: "da_rinnovare" },
  { aziendaId: "3", tipo: "Consulenza base", valore: "€ 2.400/anno", inizio: "2024-03-01", rinnovo: "2026-03-01", stato: "attivo" },
  { aziendaId: "4", tipo: "Consulenza + RSPP esterno", valore: "€ 8.500/anno", inizio: "2023-01-15", rinnovo: "2025-01-15", stato: "scaduto" },
  { aziendaId: "5", tipo: "Consulenza + Ambiente", valore: "€ 6.200/anno", inizio: "2024-09-01", rinnovo: "2026-09-01", stato: "attivo" },
];

const statoColors: Record<string, string> = {
  attivo: "bg-success/10 text-success",
  da_rinnovare: "bg-warning/10 text-warning",
  scaduto: "bg-danger/10 text-danger",
};

const statoLabels: Record<string, string> = {
  attivo: "Attivo",
  da_rinnovare: "Da rinnovare",
  scaduto: "Scaduto",
};

export default function CRMPage() {
  const contratti = mockContratti.map((c) => ({
    ...c,
    azienda: aziende.find((a) => a.id === c.aziendaId),
  }));

  const attivi = contratti.filter((c) => c.stato === "attivo").length;
  const daRinnovare = contratti.filter((c) => c.stato === "da_rinnovare").length;

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">CRM</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {contratti.length} contratti · {attivi} attivi · {daRinnovare} da rinnovare
          </p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
          + Nuovo Contratto
        </button>
      </div>

      <div className="grid gap-4">
        {contratti.map((c, i) => (
          <div key={i} className="fade-in-up rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {c.azienda?.ragioneSociale}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{c.tipo}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      {c.valore}
                    </span>
                    <span>Inizio: {new Date(c.inizio).toLocaleDateString("it-IT")}</span>
                    <span>Rinnovo: {new Date(c.rinnovo).toLocaleDateString("it-IT")}</span>
                    {c.azienda && (
                      <>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {c.azienda.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {c.azienda.telefono}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${statoColors[c.stato]}`}>
                {statoLabels[c.stato]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

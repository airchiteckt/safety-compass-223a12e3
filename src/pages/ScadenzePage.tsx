import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { scadenze, tipoScadenzaLabels } from "@/data/mock";
import { useState } from "react";

type FilterStatus = "tutti" | "ok" | "in_scadenza" | "scaduto";
type FilterTipo = "tutti" | "formazione" | "visita_medica" | "documento" | "verifica_impianto";

export default function ScadenzePage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("tutti");
  const [filterTipo, setFilterTipo] = useState<FilterTipo>("tutti");

  const filtered = scadenze.filter((s) => {
    if (filterStatus !== "tutti" && s.status !== filterStatus) return false;
    if (filterTipo !== "tutti" && s.tipo !== filterTipo) return false;
    return true;
  });

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: "tutti", label: "Tutti" },
    { value: "scaduto", label: "🔴 Scaduto" },
    { value: "in_scadenza", label: "🟡 In Scadenza" },
    { value: "ok", label: "🟢 In Regola" },
  ];

  const tipoOptions: { value: FilterTipo; label: string }[] = [
    { value: "tutti", label: "Tutti i tipi" },
    { value: "formazione", label: "Formazione" },
    { value: "visita_medica", label: "Visite Mediche" },
    { value: "documento", label: "Documenti" },
    { value: "verifica_impianto", label: "Verifiche Impianti" },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Scadenze Normative</h1>
        <p className="mt-1 text-sm text-muted-foreground">{scadenze.length} scadenze totali · {scadenze.filter(s => s.status === "scaduto").length} scadute</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterStatus(opt.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                filterStatus === opt.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value as FilterTipo)}
          className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {tipoOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Elemento</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Azienda</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Riferimento</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Scadenza</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stato</th>
              </tr>
            </thead>
            <tbody>
              {filtered
                .sort((a, b) => (a.status === "scaduto" ? -1 : b.status === "scaduto" ? 1 : 0))
                .map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-150">
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {tipoScadenzaLabels[s.tipo]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{s.elemento}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.azienda}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.riferimento}</td>
                  <td className="px-4 py-3 text-foreground">{new Date(s.scadenza).toLocaleDateString("it-IT")}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Nessuna scadenza trovata con i filtri selezionati.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

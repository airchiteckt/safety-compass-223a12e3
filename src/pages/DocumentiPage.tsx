import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { scadenze } from "@/data/mock";
import { useState } from "react";
import { FileText, Search, Download } from "lucide-react";

export default function DocumentiPage() {
  const [search, setSearch] = useState("");

  const documenti = scadenze.filter((s) => s.tipo === "documento");
  const filtered = documenti.filter(
    (s) =>
      s.elemento.toLowerCase().includes(search.toLowerCase()) ||
      s.azienda.toLowerCase().includes(search.toLowerCase())
  );

  const scaduti = documenti.filter((s) => s.status === "scaduto").length;

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Archivio Documenti</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {documenti.length} documenti · {scaduti} scaduti
          </p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
          + Carica Documento
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cerca documento, azienda..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Documento</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Azienda</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Riferimento</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Scadenza</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stato</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filtered
                .sort((a, b) => (a.status === "scaduto" ? -1 : b.status === "scaduto" ? 1 : 0))
                .map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-amber-500" />
                        <span className="font-medium text-foreground">{s.elemento}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.azienda}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.riferimento}</td>
                    <td className="px-4 py-3 text-foreground">{new Date(s.scadenza).toLocaleDateString("it-IT")}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">
                      <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

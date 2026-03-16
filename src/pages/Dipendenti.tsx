import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { dipendenti } from "@/data/mock";
import { Search, Users } from "lucide-react";
import { useState } from "react";

export default function Dipendenti() {
  const [search, setSearch] = useState("");
  const filtered = dipendenti.filter(
    (d) =>
      `${d.nome} ${d.cognome}`.toLowerCase().includes(search.toLowerCase()) ||
      d.azienda.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dipendenti</h1>
          <p className="mt-1 text-sm text-muted-foreground">{dipendenti.length} dipendenti registrati</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors duration-150">
          + Nuovo Dipendente
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cerca dipendente o azienda..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((d) => (
          <div key={d.id} className="fade-in-up rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow duration-150 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{d.nome} {d.cognome}</p>
                  <p className="text-sm text-muted-foreground">{d.mansione} · {d.reparto}</p>
                  <p className="text-xs text-muted-foreground">{d.azienda}</p>
                </div>
              </div>
              <StatusBadge status={d.idoneitaSanitaria} />
            </div>

            {/* Formazione */}
            <div className="mt-4 flex flex-wrap gap-2">
              {d.formazione.map((f, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs">
                  <span className={`h-2 w-2 rounded-full ${f.status === "ok" ? "bg-success" : f.status === "in_scadenza" ? "bg-warning" : "bg-danger"}`} />
                  <span className="font-medium text-foreground">{f.corso}</span>
                  <span className="text-muted-foreground">· {new Date(f.scadenza).toLocaleDateString("it-IT")}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

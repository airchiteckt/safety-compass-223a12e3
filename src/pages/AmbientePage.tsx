import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import {
  praticheAmbientali,
  categoriaAmbientaleLabels,
  aziende,
  type CategoriaAmbientale,
} from "@/data/mock";
import { useState, useMemo } from "react";
import {
  Leaf, Search, FileCheck, Wind, Droplets, Trash2, Construction, Volume2,
  AlertTriangle, CalendarClock, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoriaIcons: Record<CategoriaAmbientale, typeof Leaf> = {
  autorizzazioni: FileCheck,
  emissioni: Wind,
  scarichi: Droplets,
  rifiuti: Trash2,
  bonifiche: Construction,
  rumore_ambiente: Volume2,
};

const categoriaColors: Record<CategoriaAmbientale, string> = {
  autorizzazioni: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  emissioni: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  scarichi: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  rifiuti: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  bonifiche: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  rumore_ambiente: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

type FilterCategoria = "tutte" | CategoriaAmbientale;
type FilterStatus = "tutti" | "ok" | "in_scadenza" | "scaduto";

export default function AmbientePage() {
  const [search, setSearch] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<FilterCategoria>("tutte");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("tutti");
  const [filterAzienda, setFilterAzienda] = useState<string>("tutte");

  const filtered = useMemo(() => {
    return praticheAmbientali.filter((p) => {
      if (filterCategoria !== "tutte" && p.categoria !== filterCategoria) return false;
      if (filterStatus !== "tutti" && p.status !== filterStatus) return false;
      if (filterAzienda !== "tutte" && p.azienda !== filterAzienda) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.elemento.toLowerCase().includes(q) ||
          p.azienda.toLowerCase().includes(q) ||
          p.riferimento.toLowerCase().includes(q) ||
          p.normativa.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filterCategoria, filterStatus, filterAzienda, search]);

  const totale = praticheAmbientali.length;
  const scadute = praticheAmbientali.filter((p) => p.status === "scaduto").length;
  const inScadenza = praticheAmbientali.filter((p) => p.status === "in_scadenza").length;
  const inRegola = praticheAmbientali.filter((p) => p.status === "ok").length;

  // Stats per categoria
  const statsByCategoria = useMemo(() => {
    const cats = Object.keys(categoriaAmbientaleLabels) as CategoriaAmbientale[];
    return cats.map((cat) => {
      const items = praticheAmbientali.filter((p) => p.categoria === cat);
      return {
        categoria: cat,
        totale: items.length,
        scadute: items.filter((p) => p.status === "scaduto").length,
        inScadenza: items.filter((p) => p.status === "in_scadenza").length,
        ok: items.filter((p) => p.status === "ok").length,
      };
    });
  }, []);

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: "tutti", label: "Tutti" },
    { value: "scaduto", label: "🔴 Scaduto" },
    { value: "in_scadenza", label: "🟡 In Scadenza" },
    { value: "ok", label: "🟢 In Regola" },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Sicurezza Ambientale</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestione compliance ambientale · D.Lgs. 152/2006 e normative correlate
          </p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
          + Nuova Pratica
        </button>
      </div>

      {/* KPI */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="fade-in-up rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-500" />
            <span className="text-sm text-muted-foreground">Pratiche totali</span>
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{totale}</p>
        </div>
        <div className="fade-in-up rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <span className="text-sm text-muted-foreground">Scadute</span>
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-danger">{scadute}</p>
        </div>
        <div className="fade-in-up rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-warning" />
            <span className="text-sm text-muted-foreground">In scadenza</span>
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-warning">{inScadenza}</p>
        </div>
        <div className="fade-in-up rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-sm text-muted-foreground">In regola</span>
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-success">{inRegola}</p>
        </div>
      </div>

      {/* Category cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {statsByCategoria.map((stat) => {
          const Icon = categoriaIcons[stat.categoria];
          const isActive = filterCategoria === stat.categoria;
          return (
            <button
              key={stat.categoria}
              onClick={() => setFilterCategoria(isActive ? "tutte" : stat.categoria)}
              className={cn(
                "rounded-lg border p-3 text-left transition-all",
                isActive
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
              )}
            >
              <div className={cn("mb-2 flex h-8 w-8 items-center justify-center rounded-lg border", categoriaColors[stat.categoria])}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-foreground leading-tight">{categoriaAmbientaleLabels[stat.categoria]}</p>
              <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                <span className="font-medium text-foreground">{stat.totale}</span>
                {stat.scadute > 0 && <span className="text-danger">·{stat.scadute} scad.</span>}
                {stat.inScadenza > 0 && <span className="text-warning">·{stat.inScadenza} in sc.</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cerca pratica, normativa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterStatus(opt.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                filterStatus === opt.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <select
          value={filterAzienda}
          onChange={(e) => setFilterAzienda(e.target.value)}
          className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="tutte">Tutte le aziende</option>
          {aziende.map((a) => (
            <option key={a.id} value={a.ragioneSociale}>{a.ragioneSociale}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Categoria</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Pratica</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Azienda</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Normativa</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ente</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Scadenza</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stato</th>
              </tr>
            </thead>
            <tbody>
              {filtered
                .sort((a, b) => (a.status === "scaduto" ? -1 : b.status === "scaduto" ? 1 : 0))
                .map((p) => {
                  const Icon = categoriaIcons[p.categoria];
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-medium", categoriaColors[p.categoria])}>
                          <Icon className="h-3 w-3" />
                          {categoriaAmbientaleLabels[p.categoria]}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{p.elemento}</p>
                        <p className="text-xs text-muted-foreground">{p.riferimento}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.azienda}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">{p.normativa}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.enteCompetente}</td>
                      <td className="px-4 py-3 text-foreground">{new Date(p.scadenza).toLocaleDateString("it-IT")}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    </tr>
                  );
                })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Nessuna pratica trovata con i filtri selezionati.
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

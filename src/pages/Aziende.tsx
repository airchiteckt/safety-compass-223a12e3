import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { aziende } from "@/data/mock";
import { Building2, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

const rischioColors = {
  basso: "bg-success/10 text-success",
  medio: "bg-warning/10 text-warning",
  alto: "bg-danger/10 text-danger",
};

export default function Aziende() {
  const [search, setSearch] = useState("");
  const filtered = aziende.filter((a) =>
    a.ragioneSociale.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Aziende Clienti</h1>
          <p className="mt-1 text-sm text-muted-foreground">{aziende.length} aziende registrate</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors duration-150">
          + Nuova Azienda
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cerca azienda..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Table */}
      <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ragione Sociale</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">P.IVA</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rischio</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dipendenti</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">RSPP</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Compliance</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stato</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-150 cursor-pointer" onClick={() => {}}>
                  <td className="px-4 py-3">
                    <Link to={`/aziende/${a.id}`} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{a.ragioneSociale}</p>
                        <p className="text-xs text-muted-foreground">{a.indirizzo}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.piva}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ${rischioColors[a.rischio]}`}>
                      {a.rischio}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{a.numeroDipendenti}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.rspp}</td>
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
    </AppLayout>
  );
}

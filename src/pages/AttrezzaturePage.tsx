import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { attrezzature } from "@/data/mock";
import { Wrench } from "lucide-react";

export default function AttrezzaturePage() {
  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Attrezzature</h1>
          <p className="mt-1 text-sm text-muted-foreground">{attrezzature.length} attrezzature registrate</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors duration-150">
          + Nuova Attrezzatura
        </button>
      </div>

      <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Matricola</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Azienda</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ultima Verifica</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Prossima Verifica</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ente</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stato</th>
              </tr>
            </thead>
            <tbody>
              {attrezzature.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-150 cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{a.tipo}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.matricola}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.azienda}</td>
                  <td className="px-4 py-3 text-foreground">{new Date(a.ultimaVerifica).toLocaleDateString("it-IT")}</td>
                  <td className="px-4 py-3 text-foreground">{new Date(a.prossimaVerifica).toLocaleDateString("it-IT")}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.enteVerificatore}</td>
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

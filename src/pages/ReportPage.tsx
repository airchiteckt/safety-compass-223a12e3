import { AppLayout } from "@/components/AppLayout";
import { aziende, scadenze, dipendenti, praticheAmbientali, tipoScadenzaLabels } from "@/data/mock";
import { FileText, Download, Building2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function generateCompanyPDF(aziendaId: string) {
  const azienda = aziende.find(a => a.id === aziendaId);
  if (!azienda) return;

  const doc = new jsPDF();
  const azScadenze = scadenze.filter(s => s.azienda === azienda.ragioneSociale);
  const azDipendenti = dipendenti.filter(d => d.aziendaId === aziendaId);
  const azPratiche = praticheAmbientali.filter(p => p.aziendaId === aziendaId);

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Report Compliance", 14, 22);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Generato il ${new Date().toLocaleDateString("it-IT")} — Pegaso ERP`, 14, 30);

  // Company info
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text(azienda.ragioneSociale, 14, 44);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  doc.text(`P.IVA: ${azienda.piva} | ATECO: ${azienda.codiceAteco}`, 14, 52);
  doc.text(`Indirizzo: ${azienda.indirizzo}`, 14, 58);
  doc.text(`RSPP: ${azienda.rspp} | Medico: ${azienda.medicoCompetente}`, 14, 64);
  doc.text(`Dipendenti: ${azienda.numeroDipendenti} | Rischio: ${azienda.rischio.toUpperCase()}`, 14, 70);

  // Compliance score
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text(`Compliance Score: ${azienda.complianceScore}%`, 14, 82);

  const statusLabels: Record<string, string> = { ok: "In Regola", in_scadenza: "In Scadenza", scaduto: "Scaduto" };

  // Scadenze table
  if (azScadenze.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Scadenze", 14, 94);
    autoTable(doc, {
      startY: 98,
      head: [["Tipo", "Elemento", "Riferimento", "Scadenza", "Stato"]],
      body: azScadenze.map(s => [
        tipoScadenzaLabels[s.tipo],
        s.elemento,
        s.riferimento,
        new Date(s.scadenza).toLocaleDateString("it-IT"),
        statusLabels[s.status],
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 55, 80] },
    });
  }

  // Pratiche ambientali
  if (azPratiche.length > 0) {
    const lastY = (doc as any).lastAutoTable?.finalY || 120;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Pratiche Ambientali", 14, lastY + 12);
    autoTable(doc, {
      startY: lastY + 16,
      head: [["Categoria", "Elemento", "Normativa", "Scadenza", "Stato"]],
      body: azPratiche.map(p => [
        p.categoria,
        p.elemento,
        p.normativa,
        new Date(p.scadenza).toLocaleDateString("it-IT"),
        statusLabels[p.status],
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 55, 80] },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Pegaso ERP — Pagina ${i} di ${pageCount}`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save(`Report_${azienda.ragioneSociale.replace(/\s/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

function generateGlobalPDF() {
  const doc = new jsPDF();
  const statusLabels: Record<string, string> = { ok: "In Regola", in_scadenza: "In Scadenza", scaduto: "Scaduto" };

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Report Generale Compliance", 14, 22);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Generato il ${new Date().toLocaleDateString("it-IT")} — Pegaso ERP`, 14, 30);

  // Summary
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("Riepilogo Aziende", 14, 44);

  autoTable(doc, {
    startY: 48,
    head: [["Azienda", "P.IVA", "Dipendenti", "Rischio", "Compliance", "Stato"]],
    body: aziende.map(a => [
      a.ragioneSociale,
      a.piva,
      a.numeroDipendenti.toString(),
      a.rischio.toUpperCase(),
      `${a.complianceScore}%`,
      statusLabels[a.status],
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 55, 80] },
  });

  // All critical deadlines
  const criticalScadenze = scadenze.filter(s => s.status === "scaduto");
  if (criticalScadenze.length > 0) {
    const lastY = (doc as any).lastAutoTable?.finalY || 80;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Scadenze Critiche (Scadute)", 14, lastY + 12);
    autoTable(doc, {
      startY: lastY + 16,
      head: [["Tipo", "Elemento", "Azienda", "Scadenza"]],
      body: criticalScadenze.map(s => [
        tipoScadenzaLabels[s.tipo],
        s.elemento,
        s.azienda,
        new Date(s.scadenza).toLocaleDateString("it-IT"),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [180, 40, 40] },
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Pegaso ERP — Pagina ${i} di ${pageCount}`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save(`Report_Generale_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function ReportPage() {
  const [selectedAzienda, setSelectedAzienda] = useState<string>("");

  const statusCounts = (aziendaId: string) => {
    const azScadenze = scadenze.filter(s => s.azienda === aziende.find(a => a.id === aziendaId)?.ragioneSociale);
    return {
      ok: azScadenze.filter(s => s.status === "ok").length,
      inScadenza: azScadenze.filter(s => s.status === "in_scadenza").length,
      scaduto: azScadenze.filter(s => s.status === "scaduto").length,
    };
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Report & Export</h1>
        <p className="mt-1 text-sm text-muted-foreground">Genera report di compliance in PDF per azienda o globale</p>
      </div>

      {/* Global report */}
      <div className="mb-6 fade-in-up rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Report Generale</h2>
              <p className="text-sm text-muted-foreground">Panoramica di tutte le aziende, compliance e scadenze critiche</p>
            </div>
          </div>
          <button
            onClick={generateGlobalPDF}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Scarica PDF
          </button>
        </div>
      </div>

      {/* Per-company reports */}
      <h2 className="font-display text-lg font-semibold text-foreground mb-4">Report per Azienda</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aziende.map(a => {
          const counts = statusCounts(a.id);
          return (
            <div key={a.id} className="fade-in-up rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">{a.ragioneSociale}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.indirizzo}</p>
                </div>
                <span className={`font-display text-lg font-bold ${a.complianceScore >= 80 ? "text-success" : a.complianceScore >= 50 ? "text-warning" : "text-danger"}`}>
                  {a.complianceScore}%
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span className="text-muted-foreground">{counts.ok}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  <span className="text-muted-foreground">{counts.inScadenza}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <XCircle className="h-3.5 w-3.5 text-danger" />
                  <span className="text-muted-foreground">{counts.scaduto}</span>
                </div>
              </div>
              <button
                onClick={() => generateCompanyPDF(a.id)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Download className="h-4 w-4" />
                Scarica Report PDF
              </button>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

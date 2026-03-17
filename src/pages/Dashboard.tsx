import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { aziende, scadenze, dipendenti, praticheAmbientali, tipoScadenzaLabels } from "@/data/mock";
import {
  Building2, AlertTriangle, CalendarClock, GraduationCap, Leaf, TrendingUp, TrendingDown,
  Zap, FileText, Download, ChevronRight, ShieldAlert, Clock, CheckCircle2, BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Helpers ──────────────────────────────────────────────────────
function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function priorityScore(s: { status: string; scadenza: string }) {
  if (s.status === "scaduto") return 1000 + Math.abs(daysUntil(s.scadenza));
  if (s.status === "in_scadenza") return 500 - daysUntil(s.scadenza);
  return 0;
}

// ─── Components ───────────────────────────────────────────────────
function KPICard({ icon: Icon, label, value, accent, trend, trendLabel }: {
  icon: typeof Building2; label: string; value: string | number; accent?: string;
  trend?: "up" | "down" | "neutral"; trendLabel?: string;
}) {
  return (
    <div className="fade-in-up rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent || "bg-primary/10 text-primary"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-center gap-2">
            <p className="font-display text-2xl font-bold text-foreground">{value}</p>
            {trend && trendLabel && (
              <span className={`flex items-center gap-0.5 text-xs font-medium ${trend === "up" ? "text-danger" : trend === "down" ? "text-success" : "text-muted-foreground"}`}>
                {trend === "up" ? <TrendingUp className="h-3 w-3" /> : trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                {trendLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SmartAlert({ icon: Icon, title, description, severity, action, onAction }: {
  icon: typeof Zap; title: string; description: string; severity: "critical" | "warning" | "info";
  action?: string; onAction?: () => void;
}) {
  const colors = {
    critical: "border-danger/30 bg-danger/5",
    warning: "border-warning/30 bg-warning/5",
    info: "border-primary/30 bg-primary/5",
  };
  const iconColors = {
    critical: "text-danger",
    warning: "text-warning",
    info: "text-primary",
  };
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${colors[severity]} fade-in-up`}>
      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${iconColors[severity]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {action && onAction && (
        <button onClick={onAction} className="shrink-0 text-xs font-medium text-primary hover:underline flex items-center gap-1">
          {action} <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeChart, setActiveChart] = useState<"compliance" | "scadenze" | "distribuzione">("compliance");

  // ── KPI calculations
  const scaduteCount = scadenze.filter((s) => s.status === "scaduto").length;
  const inScadenzaCount = scadenze.filter((s) => s.status === "in_scadenza").length;
  const aziendeConProblemi = aziende.filter((a) => a.status !== "ok").length;
  const corsiDaPianificare = scadenze.filter((s) => s.tipo === "formazione" && s.status !== "ok").length;
  const scadenzeAmbientali = scadenze.filter((s) => s.tipo === "ambiente" && s.status !== "ok").length;
  const avgCompliance = Math.round(aziende.reduce((sum, a) => sum + a.complianceScore, 0) / aziende.length);

  // ── Smart alerts (auto-generated insights)
  const smartAlerts = useMemo(() => {
    const alerts: { icon: typeof Zap; title: string; description: string; severity: "critical" | "warning" | "info"; action?: string; route?: string }[] = [];

    // Critical: expired items
    const expiredCount = scadenze.filter(s => s.status === "scaduto").length;
    if (expiredCount > 0) {
      alerts.push({
        icon: ShieldAlert, severity: "critical",
        title: `${expiredCount} adempimenti scaduti richiedono azione immediata`,
        description: `Le aziende ${[...new Set(scadenze.filter(s => s.status === "scaduto").map(s => s.azienda))].join(", ")} hanno scadenze non rinnovate.`,
        action: "Vedi scadenze", route: "/scadenze",
      });
    }

    // Warning: upcoming 30 days
    const next30 = scadenze.filter(s => {
      const d = daysUntil(s.scadenza);
      return d > 0 && d <= 30 && s.status === "in_scadenza";
    });
    if (next30.length > 0) {
      alerts.push({
        icon: Clock, severity: "warning",
        title: `${next30.length} scadenze nei prossimi 30 giorni`,
        description: `Pianifica per tempo: ${next30.slice(0, 3).map(s => s.elemento).join(", ")}${next30.length > 3 ? "..." : ""}`,
        action: "Calendario", route: "/calendario",
      });
    }

    // Warning: low compliance companies
    const lowCompliance = aziende.filter(a => a.complianceScore < 60);
    if (lowCompliance.length > 0) {
      alerts.push({
        icon: AlertTriangle, severity: "warning",
        title: `${lowCompliance.length} aziende sotto il 60% di compliance`,
        description: lowCompliance.map(a => `${a.ragioneSociale} (${a.complianceScore}%)`).join(", "),
        action: "Vedi aziende", route: "/aziende",
      });
    }

    // Info: environmental
    const envIssues = praticheAmbientali.filter(p => p.status !== "ok").length;
    if (envIssues > 0) {
      alerts.push({
        icon: Leaf, severity: "info",
        title: `${envIssues} pratiche ambientali da monitorare`,
        description: "Autorizzazioni, emissioni o rifiuti richiedono attenzione.",
        action: "Ambiente", route: "/ambiente",
      });
    }

    return alerts;
  }, []);

  // ── Chart data
  const complianceByCompany = aziende.map(a => ({
    name: a.ragioneSociale.split(" ")[0],
    compliance: a.complianceScore,
    fill: a.complianceScore >= 80 ? "hsl(var(--success))" : a.complianceScore >= 50 ? "hsl(var(--warning))" : "hsl(var(--danger))",
  }));

  const scadenzeByType = Object.entries(tipoScadenzaLabels).map(([key, label]) => ({
    name: label,
    scadute: scadenze.filter(s => s.tipo === key && s.status === "scaduto").length,
    inScadenza: scadenze.filter(s => s.tipo === key && s.status === "in_scadenza").length,
    ok: scadenze.filter(s => s.tipo === key && s.status === "ok").length,
  }));

  const distribuzionePie = [
    { name: "In regola", value: scadenze.filter(s => s.status === "ok").length, color: "hsl(var(--success))" },
    { name: "In scadenza", value: inScadenzaCount, color: "hsl(var(--warning))" },
    { name: "Scadute", value: scaduteCount, color: "hsl(var(--danger))" },
  ];

  // Simulated trend data (last 6 months)
  const trendData = [
    { month: "Ott", compliance: 72, scadute: 12 },
    { month: "Nov", compliance: 74, scadute: 10 },
    { month: "Dic", compliance: 71, scadute: 14 },
    { month: "Gen", compliance: 76, scadute: 9 },
    { month: "Feb", compliance: 75, scadute: 11 },
    { month: "Mar", compliance: avgCompliance, scadute: scaduteCount },
  ];

  // ── Prioritized deadlines
  const prioritizedScadenze = useMemo(() =>
    scadenze.filter(s => s.status !== "ok").sort((a, b) => priorityScore(b) - priorityScore(a)).slice(0, 6),
  []);

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard Intelligente</h1>
          <p className="mt-1 text-sm text-muted-foreground">Insights automatici, trend e azioni prioritizzate</p>
        </div>
        <button
          onClick={() => navigate("/report")}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <FileText className="h-4 w-4" />
          Report & Export
        </button>
      </div>

      {/* ── Smart Alerts ──────────────────────────────────────────── */}
      {smartAlerts.length > 0 && (
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Suggerimenti Intelligenti</h2>
          </div>
          {smartAlerts.map((alert, i) => (
            <SmartAlert
              key={i}
              {...alert}
              onAction={alert.route ? () => navigate(alert.route!) : undefined}
            />
          ))}
        </div>
      )}

      {/* ── KPIs ──────────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard icon={Building2} label="Aziende gestite" value={aziende.length} />
        <KPICard icon={BarChart3} label="Compliance media" value={`${avgCompliance}%`} accent="bg-primary/10 text-primary" trend={avgCompliance >= 75 ? "down" : "up"} trendLabel={avgCompliance >= 75 ? "stabile" : "sotto soglia"} />
        <KPICard icon={AlertTriangle} label="Con criticità" value={aziendeConProblemi} accent="bg-danger/10 text-danger" />
        <KPICard icon={CalendarClock} label="Scadute" value={scaduteCount} accent="bg-danger/10 text-danger" trend="up" trendLabel={`${scaduteCount} urgenti`} />
        <KPICard icon={GraduationCap} label="Formazione" value={corsiDaPianificare} accent="bg-warning/10 text-warning" />
        <KPICard icon={Leaf} label="Ambiente" value={scadenzeAmbientali} accent="bg-warning/10 text-warning" />
      </div>

      {/* ── Charts ────────────────────────────────────────────────── */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Trend compliance */}
        <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm lg:col-span-2">
          <div className="border-b border-border px-5 py-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-foreground">Trend & Analisi</h2>
            <div className="flex gap-1 rounded-lg bg-muted p-0.5">
              {(["compliance", "scadenze", "distribuzione"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveChart(tab)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${activeChart === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {tab === "compliance" ? "Trend Compliance" : tab === "scadenze" ? "Per Tipologia" : "Distribuzione"}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5" style={{ height: 280 }}>
            {activeChart === "compliance" && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="gradCompliance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  <Area type="monotone" dataKey="compliance" stroke="hsl(var(--primary))" fill="url(#gradCompliance)" strokeWidth={2} name="Compliance %" />
                  <Area type="monotone" dataKey="scadute" stroke="hsl(var(--danger))" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Scadute" />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {activeChart === "scadenze" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scadenzeByType} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  <Bar dataKey="scadute" fill="hsl(var(--danger))" radius={[4, 4, 0, 0]} name="Scadute" />
                  <Bar dataKey="inScadenza" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="In scadenza" />
                  <Bar dataKey="ok" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="In regola" />
                </BarChart>
              </ResponsiveContainer>
            )}
            {activeChart === "distribuzione" && (
              <div className="flex items-center justify-center h-full gap-8">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie data={distribuzionePie} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {distribuzionePie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {distribuzionePie.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ background: item.color }} />
                      <span className="text-sm text-foreground">{item.name}: <strong>{item.value}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Company ranking */}
        <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold text-foreground">Ranking Compliance</h2>
          </div>
          <div className="p-4 space-y-3">
            {aziende
              .sort((a, b) => b.complianceScore - a.complianceScore)
              .map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => navigate(`/aziende/${a.id}`)}
                  className="flex items-center gap-3 w-full rounded-lg p-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    i === 0 ? "bg-success/10 text-success" : i >= aziende.length - 1 ? "bg-danger/10 text-danger" : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.ragioneSociale}</p>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${a.complianceScore}%`,
                          background: a.complianceScore >= 80 ? "hsl(var(--success))" : a.complianceScore >= 50 ? "hsl(var(--warning))" : "hsl(var(--danger))",
                        }}
                      />
                    </div>
                  </div>
                  <span className={`text-sm font-display font-bold ${a.complianceScore >= 80 ? "text-success" : a.complianceScore >= 50 ? "text-warning" : "text-danger"}`}>
                    {a.complianceScore}%
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* ── Tables ────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Prioritized deadlines */}
        <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-foreground">🎯 Azioni Prioritarie</h2>
            <button onClick={() => navigate("/scadenze")} className="text-xs font-medium text-primary hover:underline">Vedi tutte</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priorità</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Elemento</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Azienda</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Giorni</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stato</th>
                </tr>
              </thead>
              <tbody>
                {prioritizedScadenze.map((s, i) => {
                  const days = daysUntil(s.scadenza);
                  return (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          i < 2 ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"
                        }`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{s.elemento}</p>
                        <p className="text-xs text-muted-foreground">{tipoScadenzaLabels[s.tipo]}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{s.azienda}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${days < 0 ? "text-danger" : "text-warning"}`}>
                          {days < 0 ? `${Math.abs(days)}g fa` : `${days}g`}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick company overview */}
        <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-foreground">Aziende Clienti</h2>
            <button onClick={() => navigate("/aziende")} className="text-xs font-medium text-primary hover:underline">Vedi tutte</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Azienda</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dip.</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Compliance</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stato</th>
                </tr>
              </thead>
              <tbody>
                {aziende.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/aziende/${a.id}`)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{a.ragioneSociale}</p>
                      <p className="text-xs text-muted-foreground">{a.partner}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{a.numeroDipendenti}</td>
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
      </div>
    </AppLayout>
  );
}

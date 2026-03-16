import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { scadenze, aziende, tipoScadenzaLabels } from "@/data/mock";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarClock, GraduationCap, Stethoscope, FileText, Wrench, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS_IT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const MONTHS_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

const tipoIcons: Record<string, typeof CalendarClock> = {
  formazione: GraduationCap,
  visita_medica: Stethoscope,
  documento: FileText,
  verifica_impianto: Wrench,
  ambiente: Leaf,
};

const tipoColors: Record<string, string> = {
  formazione: "bg-primary/10 text-primary border-primary/20",
  visita_medica: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  documento: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  verifica_impianto: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  ambiente: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday-based
}

export default function CalendarioPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(null);
  };

  // Group scadenze by date
  const scadenzeByDate = useMemo(() => {
    const map: Record<string, typeof scadenze> = {};
    scadenze.forEach((s) => {
      const d = s.scadenza; // "YYYY-MM-DD"
      if (!map[d]) map[d] = [];
      map[d].push(s);
    });
    return map;
  }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Build calendar grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const formatDateKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Events for selected date
  const selectedEvents = selectedDate ? (scadenzeByDate[selectedDate] || []) : [];

  // Monthly stats
  const monthScadenze = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    return scadenze.filter((s) => s.scadenza.startsWith(prefix));
  }, [year, month]);

  const monthScadute = monthScadenze.filter((s) => s.status === "scaduto").length;
  const monthInScadenza = monthScadenze.filter((s) => s.status === "in_scadenza").length;

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Calendario Operativo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pianificazione scadenze sicurezza e ambiente
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Calendar */}
        <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="font-display text-lg font-semibold text-foreground min-w-[200px] text-center">
                {MONTHS_IT[month]} {year}
              </h2>
              <button onClick={nextMonth} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button onClick={goToday} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              Oggi
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/30">
            {DAYS_IT.map((d) => (
              <div key={d} className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-border bg-muted/10" />;

              const dateKey = formatDateKey(day);
              const events = scadenzeByDate[dateKey] || [];
              const isToday = dateKey === todayKey;
              const isSelected = dateKey === selectedDate;
              const hasScaduto = events.some((e) => e.status === "scaduto");
              const hasInScadenza = events.some((e) => e.status === "in_scadenza");

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                  className={cn(
                    "min-h-[100px] border-b border-r border-border p-1.5 text-left transition-colors hover:bg-muted/40",
                    isSelected && "bg-primary/5 ring-1 ring-inset ring-primary/30",
                    isToday && !isSelected && "bg-primary/[0.03]"
                  )}
                >
                  <span className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                    isToday && "bg-primary text-primary-foreground",
                    !isToday && "text-foreground"
                  )}>
                    {day}
                  </span>

                  {/* Event pills */}
                  <div className="mt-1 space-y-0.5">
                    {events.slice(0, 3).map((ev) => {
                      const Icon = tipoIcons[ev.tipo] || CalendarClock;
                      return (
                        <div
                          key={ev.id}
                          className={cn(
                            "flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight border",
                            tipoColors[ev.tipo] || "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          <Icon className="h-3 w-3 shrink-0" />
                          <span className="truncate">{ev.elemento}</span>
                        </div>
                      );
                    })}
                    {events.length > 3 && (
                      <div className="px-1.5 text-[10px] font-medium text-muted-foreground">
                        +{events.length - 3} altri
                      </div>
                    )}
                  </div>

                  {/* Status dot indicator */}
                  {events.length > 0 && (
                    <div className="mt-1 flex gap-1">
                      {hasScaduto && <span className="h-1.5 w-1.5 rounded-full bg-danger" />}
                      {hasInScadenza && <span className="h-1.5 w-1.5 rounded-full bg-warning" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Monthly summary */}
          <div className="fade-in-up rounded-lg border border-border bg-card p-5 shadow-sm">
            <h3 className="font-display text-sm font-semibold text-foreground mb-3">
              Riepilogo {MONTHS_IT[month]}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Totale scadenze</span>
                <span className="font-semibold text-foreground">{monthScadenze.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-danger">Scadute</span>
                <span className="font-semibold text-danger">{monthScadute}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-warning">In scadenza</span>
                <span className="font-semibold text-warning">{monthInScadenza}</span>
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="fade-in-up rounded-lg border border-border bg-card p-5 shadow-sm">
            <h3 className="font-display text-sm font-semibold text-foreground mb-3">Legenda</h3>
            <div className="space-y-2">
              {Object.entries(tipoIcons).map(([tipo, Icon]) => (
                <div key={tipo} className="flex items-center gap-2">
                  <div className={cn("flex h-6 w-6 items-center justify-center rounded border", tipoColors[tipo])}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs text-muted-foreground">{tipoScadenzaLabels[tipo]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected day detail */}
          {selectedDate && (
            <div className="fade-in-up rounded-lg border border-border bg-card shadow-sm">
              <div className="border-b border-border px-5 py-3">
                <h3 className="font-display text-sm font-semibold text-foreground">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("it-IT", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
              </div>
              <div className="p-4">
                {selectedEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nessuna scadenza in questa data.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedEvents.map((ev) => {
                      const Icon = tipoIcons[ev.tipo] || CalendarClock;
                      return (
                        <div key={ev.id} className="rounded-lg border border-border p-3">
                          <div className="flex items-start gap-2">
                            <div className={cn("mt-0.5 flex h-7 w-7 items-center justify-center rounded border shrink-0", tipoColors[ev.tipo])}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground">{ev.elemento}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{ev.azienda}</p>
                              <p className="text-xs text-muted-foreground">{ev.riferimento}</p>
                              <div className="mt-2">
                                <StatusBadge status={ev.status} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

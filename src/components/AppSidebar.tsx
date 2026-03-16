import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Wrench,
  CalendarClock,
  GraduationCap,
  Stethoscope,
  FileText,
  ClipboardCheck,
  Calendar,
  Briefcase,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Generale",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Calendario", href: "/calendario", icon: Calendar },
    ],
  },
  {
    title: "Anagrafiche",
    items: [
      { label: "Aziende", href: "/aziende", icon: Building2 },
      { label: "Dipendenti", href: "/dipendenti", icon: Users },
      { label: "Attrezzature", href: "/attrezzature", icon: Wrench },
    ],
  },
  {
    title: "Scadenze",
    items: [
      { label: "Tutte le Scadenze", href: "/scadenze", icon: CalendarClock },
      { label: "Formazione", href: "/formazione", icon: GraduationCap },
      { label: "Visite Mediche", href: "/visite-mediche", icon: Stethoscope },
      { label: "Verifiche Impianti", href: "/verifiche", icon: ClipboardCheck },
    ],
  },
  {
    title: "Documenti",
    items: [
      { label: "Archivio", href: "/documenti", icon: FileText },
    ],
  },
  {
    title: "Commerciale",
    items: [
      { label: "CRM", href: "/crm", icon: Briefcase },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <Shield className="h-7 w-7 text-sidebar-primary" />
        <span className="font-display text-lg font-bold text-sidebar-primary-foreground">
          Pegaso ERP
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-2">
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted hover:text-sidebar-accent-foreground"
            >
              {group.title}
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  collapsed[group.title] && "-rotate-90"
                )}
              />
            </button>
            {!collapsed[group.title] && (
              <ul className="mt-1 space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-6 py-4">
        <p className="text-xs text-sidebar-muted">Admin Pegaso</p>
        <p className="text-xs text-sidebar-muted">v1.0.0</p>
      </div>
    </aside>
  );
}

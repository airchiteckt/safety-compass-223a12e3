import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  Users,
  CreditCard,
  Settings,
  ChevronDown,
  Globe,
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
      { label: "Dashboard CFT", href: "/cft", icon: LayoutDashboard },
    ],
  },
  {
    title: "Gestione",
    items: [
      { label: "Affiliati", href: "/cft/affiliati", icon: Building },
      { label: "Utenti", href: "/cft/utenti", icon: Users },
      { label: "Abbonamenti", href: "/cft/abbonamenti", icon: CreditCard },
    ],
  },
  {
    title: "Sistema",
    items: [
      { label: "Impostazioni", href: "/cft/impostazioni", icon: Settings },
    ],
  },
];

export function CFTSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-4">
        <Globe className="h-8 w-8 text-sidebar-primary" />
        <div className="flex flex-col">
          <span className="font-display text-base font-bold text-sidebar-primary-foreground leading-tight">
            CFT Platform
          </span>
          <span className="text-[10px] text-sidebar-muted leading-tight">
            Centro Federato Tecnico
          </span>
        </div>
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

      {/* ERP Link */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Vai a ERP & SGSL
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-6 py-4">
        <p className="text-xs text-sidebar-muted">Super Admin CFT</p>
        <p className="text-xs text-sidebar-muted">v1.0.0</p>
      </div>
    </aside>
  );
}

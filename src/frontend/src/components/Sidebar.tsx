import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Send,
  Users,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type View = "dashboard" | "subscribers" | "compose" | "campaigns";

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "subscribers", label: "Subscribers", icon: Users },
  { id: "compose", label: "Compose", icon: Send },
  { id: "campaigns", label: "Campaigns", icon: Mail },
];

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar-bg text-sidebar-fg">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-amber flex items-center justify-center">
            <Mail className="w-4 h-4 text-sidebar-bg" />
          </div>
          <span className="font-display font-700 text-xl tracking-tight text-sidebar-fg">
            Mail All
          </span>
        </div>
        <p className="mt-1.5 text-xs text-sidebar-muted pl-0.5">
          Email Marketing
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              data-ocid={`nav.${item.id}.link`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-active text-sidebar-fg"
                  : "text-sidebar-muted hover:text-sidebar-fg hover:bg-sidebar-active/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User / Logout */}
      {identity && (
        <div className="px-3 py-4 border-t border-sidebar-border">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingIn}
            data-ocid="nav.logout.button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-muted hover:text-sidebar-fg hover:bg-sidebar-active/60 transition-colors"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 shrink-0" />
            )}
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}

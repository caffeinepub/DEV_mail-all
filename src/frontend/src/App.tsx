import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import CampaignsList from "./components/CampaignsList";
import Compose from "./components/Compose";
import Dashboard from "./components/Dashboard";
import LoginScreen from "./components/LoginScreen";
import Sidebar from "./components/Sidebar";
import Subscribers from "./components/Subscribers";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";

const queryClient = new QueryClient();

type View = "dashboard" | "subscribers" | "compose" | "campaigns";

function AppShell() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  // Still initializing auth
  if (isInitializing || (isAuthenticated && adminLoading)) {
    return (
      <div className="min-h-screen bg-sidebar-bg flex items-center justify-center">
        <div className="space-y-3 w-64">
          <Skeleton className="h-4 w-full bg-sidebar-active" />
          <Skeleton className="h-4 w-3/4 bg-sidebar-active" />
          <Skeleton className="h-4 w-1/2 bg-sidebar-active" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <LoginScreen mode="unauthenticated" />;
  }

  // Logged in but not admin
  if (!isAdmin) {
    return <LoginScreen mode="not-admin" />;
  }

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "subscribers":
        return <Subscribers />;
      case "compose":
        return <Compose />;
      case "campaigns":
        return <CampaignsList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-10">{renderView()}</div>
        {/* Footer */}
        <footer className="border-t border-border px-8 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

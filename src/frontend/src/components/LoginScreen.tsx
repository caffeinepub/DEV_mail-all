import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Mail, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginScreenProps {
  mode: "unauthenticated" | "not-admin";
}

export default function LoginScreen({ mode }: LoginScreenProps) {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-sidebar-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber mb-4">
            <Mail className="w-7 h-7 text-sidebar-bg" />
          </div>
          <h1 className="font-display text-3xl font-700 text-sidebar-fg">
            Mail All
          </h1>
          <p className="mt-1 text-sidebar-muted text-sm">
            Email Marketing Platform
          </p>
        </div>

        <Card className="border-sidebar-border bg-sidebar-active shadow-xl">
          <CardContent className="pt-8 pb-8 px-8">
            {mode === "unauthenticated" ? (
              <>
                <h2 className="font-display text-xl font-600 text-sidebar-fg text-center mb-2">
                  Welcome back
                </h2>
                <p className="text-sidebar-muted text-sm text-center mb-8">
                  Sign in with Internet Identity to access the admin dashboard
                </p>
                <Button
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid="login.primary_button"
                  className="w-full bg-amber hover:bg-amber-dark text-sidebar-bg font-600 h-11"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in with Internet Identity"
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-3">
                    <ShieldAlert className="w-6 h-6 text-destructive" />
                  </div>
                  <h2 className="font-display text-xl font-600 text-sidebar-fg">
                    Access Restricted
                  </h2>
                  <p className="text-sidebar-muted text-sm mt-2">
                    Your account doesn't have admin privileges. Please contact
                    an existing admin to grant you access.
                  </p>
                </div>
                <div className="rounded-lg bg-sidebar-bg/40 px-4 py-3 text-xs text-sidebar-muted">
                  <strong className="text-sidebar-fg">Note:</strong> Admin
                  access is required to manage subscribers and send campaigns.
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-sidebar-muted/60 mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sidebar-muted transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}

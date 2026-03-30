import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Send, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useCampaigns, useDashboardStats } from "../hooks/useQueries";

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
  accentColor,
}: {
  title: string;
  value: string;
  icon: typeof Users;
  loading: boolean;
  accentColor: string;
}) {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="mt-2 h-9 w-20" />
            ) : (
              <p className="mt-1 text-3xl font-display font-700">{value}</p>
            )}
          </div>
          <div className={`p-2.5 rounded-lg ${accentColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();

  const recentCampaigns = campaigns?.slice(-5).reverse() ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-display font-700 text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your email marketing activity
        </p>
      </div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        data-ocid="dashboard.section"
      >
        <StatCard
          title="Total Subscribers"
          value={stats ? String(stats.totalSubscribers) : "0"}
          icon={Users}
          loading={statsLoading}
          accentColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Campaigns Sent"
          value={stats ? String(stats.totalCampaignsSent) : "0"}
          icon={TrendingUp}
          loading={statsLoading}
          accentColor="bg-amber/10 text-amber-dark"
        />
      </div>

      {/* Recent Campaigns */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base font-600 flex items-center gap-2">
            <Send className="w-4 h-4" />
            Recent Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {campaignsLoading ? (
            <div className="space-y-3" data-ocid="dashboard.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentCampaigns.length === 0 ? (
            <div
              className="py-12 text-center"
              data-ocid="dashboard.empty_state"
            >
              <Mail className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No campaigns sent yet
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Compose your first campaign to get started
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentCampaigns.map((c, i) => (
                <div
                  key={String(c.id)}
                  data-ocid={`dashboard.campaigns.item.${i + 1}`}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">
                      {c.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(c.sentAt)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-4 shrink-0">
                    {String(c.recipientCount)} recipients
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

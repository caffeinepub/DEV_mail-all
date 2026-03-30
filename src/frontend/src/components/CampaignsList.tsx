import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Mail, Users } from "lucide-react";
import { motion } from "motion/react";
import { useCampaigns } from "../hooks/useQueries";

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CampaignsList() {
  const { data: campaigns = [], isLoading } = useCampaigns();
  const sorted = [...campaigns].reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-display font-700">Campaigns</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          History of all sent campaigns ({campaigns.length} total)
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base font-600 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Sent Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="campaigns.loading_state">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div
              className="py-16 text-center"
              data-ocid="campaigns.empty_state"
            >
              <Mail className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No campaigns sent yet
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Go to Compose to send your first campaign
              </p>
            </div>
          ) : (
            <Table data-ocid="campaigns.table">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Subject</TableHead>
                  <TableHead>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Date Sent
                    </span>
                  </TableHead>
                  <TableHead className="pr-6">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Recipients
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((campaign, i) => (
                  <TableRow
                    key={String(campaign.id)}
                    data-ocid={`campaigns.item.${i + 1}`}
                  >
                    <TableCell className="pl-6">
                      <p className="font-medium">{campaign.subject}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(campaign.sentAt)}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge variant="secondary">
                        {String(campaign.recipientCount)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Send, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSendCampaign, useSubscriberCount } from "../hooks/useQueries";

export default function Compose() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [lastSentCount, setLastSentCount] = useState<bigint | null>(null);

  const { data: subscriberCount = BigInt(0) } = useSubscriberCount();
  const sendCampaign = useSendCampaign();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    try {
      const count = await sendCampaign.mutateAsync({
        subject: subject.trim(),
        body: body.trim(),
      });
      setLastSentCount(count);
      setSubject("");
      setBody("");
      toast.success(`Campaign sent to ${String(count)} subscribers!`);
    } catch {
      toast.error("Failed to send campaign");
    }
  };

  const charCount = body.length;
  const hasContent = subject.trim().length > 0 && body.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-2xl"
    >
      <div>
        <h1 className="text-2xl font-display font-700">Compose Campaign</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write and send an email campaign to all subscribers
        </p>
      </div>

      {/* Subscriber count notice */}
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-muted/50 border border-border">
        <Users className="w-4 h-4 text-muted-foreground shrink-0" />
        <p className="text-sm text-muted-foreground">
          This campaign will be sent to{" "}
          <span className="font-semibold text-foreground">
            {String(subscriberCount)} subscriber
            {subscriberCount !== BigInt(1) ? "s" : ""}
          </span>
        </p>
        <Badge variant="secondary" className="ml-auto shrink-0">
          {String(subscriberCount)} recipients
        </Badge>
      </div>

      {/* Success state */}
      <AnimatePresence>
        {lastSentCount !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            data-ocid="compose.success_state"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600" />
            <p className="text-sm font-medium">
              Campaign sent successfully to {String(lastSentCount)} subscribers!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compose form */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base font-600 flex items-center gap-2">
            <Send className="w-4 h-4" />
            New Campaign
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject Line
              </Label>
              <Input
                id="subject"
                placeholder="Your email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                data-ocid="compose.subject.input"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="body" className="text-sm font-medium">
                  Email Body
                </Label>
                <span className="text-xs text-muted-foreground">
                  {charCount} characters
                </span>
              </div>
              <Textarea
                id="body"
                placeholder="Write your email content here. Plain text is supported."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                data-ocid="compose.body.textarea"
                rows={12}
                required
                className="resize-y font-mono text-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Sending to <strong>{String(subscriberCount)}</strong> subscriber
                {subscriberCount !== BigInt(1) ? "s" : ""}
              </p>
              <Button
                type="submit"
                disabled={
                  sendCampaign.isPending ||
                  !hasContent ||
                  subscriberCount === BigInt(0)
                }
                data-ocid="compose.send_to_all.button"
                className="bg-amber hover:bg-amber-dark text-sidebar-bg font-600"
              >
                {sendCampaign.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send to All
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

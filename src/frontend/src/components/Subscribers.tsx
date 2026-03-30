import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Search, Trash2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddSubscriber,
  useRemoveSubscriber,
  useSubscribers,
} from "../hooks/useQueries";

export default function Subscribers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);

  const { data: subscribers = [], isLoading } = useSubscribers();
  const addSubscriber = useAddSubscriber();
  const removeSubscriber = useRemoveSubscriber();

  const filtered = subscribers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      await addSubscriber.mutateAsync({
        name: name.trim(),
        email: email.trim(),
      });
      setName("");
      setEmail("");
      toast.success("Subscriber added successfully");
    } catch {
      toast.error("Failed to add subscriber");
    }
  };

  const handleRemove = async (subEmail: string) => {
    setRemovingEmail(subEmail);
    try {
      await removeSubscriber.mutateAsync(subEmail);
      toast.success("Subscriber removed");
    } catch {
      toast.error("Failed to remove subscriber");
    } finally {
      setRemovingEmail(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-display font-700">Subscribers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your email subscribers ({subscribers.length} total)
        </p>
      </div>

      {/* Add Subscriber Form */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base font-600 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Subscriber
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAdd}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1">
              <Label htmlFor="sub-name" className="sr-only">
                Name
              </Label>
              <Input
                id="sub-name"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ocid="subscriber.name.input"
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="sub-email" className="sr-only">
                Email
              </Label>
              <Input
                id="sub-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="subscriber.email.input"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={addSubscriber.isPending}
              data-ocid="subscriber.add_button"
              className="bg-amber hover:bg-amber-dark text-sidebar-bg font-600 shrink-0"
            >
              {addSubscriber.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Subscriber
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Subscribers Table */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-display text-base font-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              All Subscribers
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="subscriber.search_input"
                className="pl-9 w-48 h-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="subscriber.loading_state">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="py-16 text-center"
              data-ocid="subscriber.empty_state"
            >
              <Users className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                {search
                  ? "No subscribers match your search"
                  : "No subscribers yet"}
              </p>
            </div>
          ) : (
            <Table data-ocid="subscriber.table">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-16 pr-6" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sub, i) => (
                  <TableRow
                    key={sub.email}
                    data-ocid={`subscriber.item.${i + 1}`}
                  >
                    <TableCell className="pl-6 font-medium">
                      {sub.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sub.email}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(sub.email)}
                        disabled={removingEmail === sub.email}
                        data-ocid={`subscriber.delete_button.${i + 1}`}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        {removingEmail === sub.email ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
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

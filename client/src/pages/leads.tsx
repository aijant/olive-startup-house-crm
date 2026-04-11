import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LeadCard } from "@/components/lead-card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchLeadsFromSupabase, LEADS_QUERY_KEY } from "@/lib/leads-supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createLead, createLeadBodySchema } from "@/actions/leads";
import { Plus, Search, Filter, TrendingUp, Users, Target, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Lead } from "@shared/schema";

const emptyLeadForm = { name: "", email: "", phone: "", location: "" };

export default function LeadsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusTab, setStatusTab] = useState("all");
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [leadForm, setLeadForm] = useState(emptyLeadForm);

  const createLeadMutation = useMutation({
    mutationFn: createLead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      setLeadForm(emptyLeadForm);
      setAddLeadOpen(false);
      toast({
        title: "Lead created",
        description: "The new lead has been added to your pipeline.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Could not create lead",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  function handleAddLeadOpenChange(open: boolean) {
    setAddLeadOpen(open);
    if (!open) setLeadForm(emptyLeadForm);
  }

  function handleSubmitLead(e: FormEvent) {
    e.preventDefault();
    const body = {
      name: leadForm.name.trim(),
      email: leadForm.email.trim(),
      phone: leadForm.phone.trim(),
      location: leadForm.location.trim(),
    };
    const parsed = createLeadBodySchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Check the form fields.";
      toast({ title: "Invalid input", description: first, variant: "destructive" });
      return;
    }
    createLeadMutation.mutate(parsed.data);
  }

  const { data: leads, isLoading, isError, error } = useQuery<Lead[]>({
    queryKey: LEADS_QUERY_KEY,
    queryFn: fetchLeadsFromSupabase,
    staleTime: 60_000,
  });

  const filteredLeads = leads?.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    const matchesStatus = statusTab === "all" || lead.status === statusTab;
    return matchesSearch && matchesSource && matchesStatus;
  });

  const leadsByStatus = {
    all: leads?.length || 0,
    New: leads?.filter(l => l.status === "New").length || 0,
    Contacted: leads?.filter(l => l.status === "Contacted").length || 0,
    Qualified: leads?.filter(l => l.status === "Qualified").length || 0,
    Converted: leads?.filter(l => l.status === "Converted").length || 0,
  };

  const totalBudget = leads?.reduce((sum, l) => sum + l.budget, 0) || 0;
  const avgBudget = leads?.length ? Math.round(totalBudget / leads.length) : 0;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lead Pipeline</h1>
          <p className="text-muted-foreground">Manage and track all incoming leads from various sources</p>
        </div>
        <Button
          type="button"
          data-testid="button-add-lead"
          onClick={() => setAddLeadOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Lead
        </Button>
      </div>

      <Dialog open={addLeadOpen} onOpenChange={handleAddLeadOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add new lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lead-name">Name</Label>
              <Input
                id="lead-name"
                value={leadForm.name}
                onChange={(e) => setLeadForm((f) => ({ ...f, name: e.target.value }))}
                autoComplete="name"
                disabled={createLeadMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                value={leadForm.email}
                onChange={(e) => setLeadForm((f) => ({ ...f, email: e.target.value }))}
                autoComplete="email"
                disabled={createLeadMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-phone">Phone</Label>
              <Input
                id="lead-phone"
                type="tel"
                value={leadForm.phone}
                onChange={(e) => setLeadForm((f) => ({ ...f, phone: e.target.value }))}
                autoComplete="tel"
                disabled={createLeadMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-location">Location</Label>
              <Input
                id="lead-location"
                value={leadForm.location}
                onChange={(e) => setLeadForm((f) => ({ ...f, location: e.target.value }))}
                autoComplete="address-level2"
                disabled={createLeadMutation.isPending}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddLeadOpenChange(false)}
                disabled={createLeadMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createLeadMutation.isPending}>
                {createLeadMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create lead"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load leads</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Something went wrong"}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leads?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leadsByStatus.New}</p>
                <p className="text-sm text-muted-foreground">New This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/30">
                <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leadsByStatus.Qualified}</p>
                <p className="text-sm text-muted-foreground">Qualified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">${avgBudget.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Avg Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-leads"
              />
            </div>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-source-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Booking.com">Booking.com</SelectItem>
                <SelectItem value="Airbnb">Airbnb</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="WOM">Word of Mouth</SelectItem>
                <SelectItem value="OTA">OTA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
        <div className="rounded-lg border bg-card">
          <div className="p-6 pb-3">
            <Tabs value={statusTab} onValueChange={setStatusTab}>
              <TabsList className="flex-wrap h-auto gap-1">
                <TabsTrigger value="all">
                  All Leads <Badge variant="secondary" className="ml-2">{leadsByStatus.all}</Badge>
                </TabsTrigger>
                <TabsTrigger value="New">
                  New <Badge variant="secondary" className="ml-2">{leadsByStatus.New}</Badge>
                </TabsTrigger>
                <TabsTrigger value="Contacted">
                  Contacted <Badge variant="secondary" className="ml-2">{leadsByStatus.Contacted}</Badge>
                </TabsTrigger>
                <TabsTrigger value="Qualified">
                  Qualified <Badge variant="secondary" className="ml-2">{leadsByStatus.Qualified}</Badge>
                </TabsTrigger>
                <TabsTrigger value="Converted">
                  Converted <Badge variant="secondary" className="ml-2">{leadsByStatus.Converted}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-2">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))
              ) : isError ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Fix the error above to see your pipeline.
                </div>
              ) : filteredLeads?.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mt-4">No leads found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredLeads?.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
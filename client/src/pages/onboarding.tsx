import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { OnboardingCard } from "@/components/onboarding-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  UserPlus,
  BookOpen,
  Receipt,
  FileText,
  CheckCircle,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import type { Onboarding } from "@shared/schema";

export default function OnboardingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: onboardings, isLoading } = useQuery<Onboarding[]>({
    queryKey: ["/api/onboardings"],
  });

  const filteredOnboardings = onboardings?.filter((onboarding) => {
    const matchesSearch = onboarding.memberName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || onboarding.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    orientation: onboardings?.filter(o => o.status === "Orientation").length || 0,
    invoiceSent: onboardings?.filter(o => o.status === "Invoice Sent").length || 0,
    docsPending: onboardings?.filter(o => o.status === "Docs Pending").length || 0,
    complete: onboardings?.filter(o => o.status === "Complete").length || 0,
  };

  const totalPending = onboardings?.filter(o => !o.invoicePaid).reduce((sum, o) => sum + o.monthlyRent, 0) || 0;
  const totalActive = onboardings?.filter(o => o.status !== "Complete").length || 0;

  const upcomingMoveIns = onboardings?.filter(o => {
    const moveIn = new Date(o.moveInDate);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return moveIn >= now && moveIn <= weekFromNow;
  }).length || 0;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Onboarding & Billing</h1>
          <p className="text-muted-foreground">Member orientation, documentation, and invoicing</p>
        </div>
        <Button data-testid="button-new-onboarding">
          <Plus className="h-4 w-4 mr-2" />
          New Member
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalActive}</p>
                <p className="text-sm text-muted-foreground">Active Onboarding</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/30">
                <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalPending.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Invoices Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingMoveIns}</p>
                <p className="text-sm text-muted-foreground">Move-ins This Week</p>
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
                <p className="text-2xl font-bold">{statusCounts.complete}</p>
                <p className="text-sm text-muted-foreground">Completed This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover-elevate cursor-pointer border-t-4 border-t-blue-500">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto text-blue-600 dark:text-blue-400" />
            <p className="text-2xl font-bold mt-2">{statusCounts.orientation}</p>
            <p className="text-sm text-muted-foreground">Orientation</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer border-t-4 border-t-amber-500">
          <CardContent className="p-4 text-center">
            <Receipt className="h-6 w-6 mx-auto text-amber-600 dark:text-amber-400" />
            <p className="text-2xl font-bold mt-2">{statusCounts.invoiceSent}</p>
            <p className="text-sm text-muted-foreground">Invoice Sent</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer border-t-4 border-t-purple-500">
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 mx-auto text-purple-600 dark:text-purple-400" />
            <p className="text-2xl font-bold mt-2">{statusCounts.docsPending}</p>
            <p className="text-sm text-muted-foreground">Docs Pending</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer border-t-4 border-t-emerald-500">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto text-emerald-600 dark:text-emerald-400" />
            <p className="text-2xl font-bold mt-2">{statusCounts.complete}</p>
            <p className="text-sm text-muted-foreground">Complete</p>
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
                placeholder="Search by member name..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-onboardings"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-status-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Orientation">Orientation</SelectItem>
                <SelectItem value="Invoice Sent">Invoice Sent</SelectItem>
                <SelectItem value="Docs Pending">Docs Pending</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Onboardings List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
              ))
            ) : filteredOnboardings?.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mt-4">No members found</p>
                <p className="text-sm text-muted-foreground">Add a new member or adjust your filters</p>
              </div>
            ) : (
              filteredOnboardings?.map((onboarding) => (
                <OnboardingCard key={onboarding.id} onboarding={onboarding} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScreeningCard } from "@/components/screening-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  ClipboardCheck,
  Bot,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";
import type { Screening } from "@shared/schema";

export default function ScreeningPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: screenings, isLoading } = useQuery<Screening[]>({
    queryKey: ["/api/screenings"],
  });

  const filteredScreenings = screenings?.filter((screening) => {
    const matchesSearch = screening.leadName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || screening.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    inProgress: screenings?.filter(s => s.status === "In Progress").length || 0,
    approved: screenings?.filter(s => s.status === "Approved").length || 0,
    flagged: screenings?.filter(s => s.status === "Flagged").length || 0,
    rejected: screenings?.filter(s => s.status === "Rejected").length || 0,
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Screening Tool</h1>
          <p className="text-muted-foreground">AI-powered interviewing and background verification</p>
        </div>
        <Button data-testid="button-new-screening">
          <Plus className="h-4 w-4 mr-2" />
          Start New Screening
        </Button>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover-elevate cursor-pointer border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                In Progress
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-3">{statusCounts.inProgress}</p>
            <p className="text-sm text-muted-foreground">Active screenings</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Approved
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-3">{statusCounts.approved}</p>
            <p className="text-sm text-muted-foreground">Ready to proceed</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Flagged
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-3">{statusCounts.flagged}</p>
            <p className="text-sm text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                Rejected
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-3">{statusCounts.rejected}</p>
            <p className="text-sm text-muted-foreground">Not approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Tools Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900/30">
                <Bot className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">AI Interviewer</h3>
                <p className="text-sm text-muted-foreground">Automated pre-screening interviews with intelligent Q&A</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                Active
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">{screenings?.filter(s => s.aiInterviewComplete).length || 0}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">{screenings?.filter(s => !s.aiInterviewComplete && s.status === "In Progress").length || 0}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">94%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Background Checker</h3>
                <p className="text-sm text-muted-foreground">Comprehensive identity and history verification</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                Active
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">{screenings?.filter(s => s.backgroundCheckComplete).length || 0}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">{screenings?.filter(s => !s.backgroundCheckComplete && s.status === "In Progress").length || 0}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">2.5d</p>
                <p className="text-xs text-muted-foreground">Avg Time</p>
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
                placeholder="Search by name..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-screenings"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-status-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Flagged">Flagged</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Screenings List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Screenings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-md" />
              ))
            ) : filteredScreenings?.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mt-4">No screenings found</p>
                <p className="text-sm text-muted-foreground">Start a new screening or adjust your filters</p>
              </div>
            ) : (
              filteredScreenings?.map((screening) => (
                <ScreeningCard key={screening.id} screening={screening} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  MessageSquare,
  Calendar,
  Plus,
  TrendingUp,
  Settings,
  ExternalLink,
  Send,
} from "lucide-react";
import { SiWhatsapp, SiTelegram } from "react-icons/si";
import type { CommunityEvent, CommunityStats } from "@shared/schema";

export default function CommunityPage() {
  const { data: events, isLoading: eventsLoading } = useQuery<CommunityEvent[]>({
    queryKey: ["/api/events"],
  });

  const { data: stats } = useQuery<CommunityStats>({
    queryKey: ["/api/community/stats"],
  });

  const upcomingEvents = events?.filter(e => new Date(e.date) >= new Date()) || [];
  const pastEvents = events?.filter(e => new Date(e.date) < new Date()) || [];

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Community Hub</h1>
          <p className="text-muted-foreground">Co-living & co-working engagement and post-sale CRM</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button data-testid="button-create-event">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-md bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats?.membersChange || 0}%
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-3">{stats?.activeMembers || 0}</p>
            <p className="text-sm text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                <SiWhatsapp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats?.engagementChange || 0}%
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-3">{stats?.whatsappEngagement || 0}%</p>
            <p className="text-sm text-muted-foreground">WhatsApp Engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <SiTelegram className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats?.groupsChange || 0}%
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-3">{stats?.telegramGroups || 0}</p>
            <p className="text-sm text-muted-foreground">Telegram Groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/30">
                <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats?.eventsChange || 0}%
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-3">{stats?.monthlyEvents || 0}</p>
            <p className="text-sm text-muted-foreground">Monthly Events</p>
          </CardContent>
        </Card>
      </div>

      {/* Messaging Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                <SiWhatsapp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">WhatsApp Integration</h3>
                <p className="text-sm text-muted-foreground">Connected to community groups</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                Active
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">4</p>
                <p className="text-xs text-muted-foreground">Groups</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">187</p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">{stats?.whatsappEngagement || 0}%</p>
                <p className="text-xs text-muted-foreground">Engagement</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Broadcast
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <SiTelegram className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Telegram Integration</h3>
                <p className="text-sm text-muted-foreground">Property-specific channels</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                Active
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">{stats?.telegramGroups || 0}</p>
                <p className="text-xs text-muted-foreground">Groups</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">156</p>
                <p className="text-xs text-muted-foreground">Subscribers</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">89%</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Announce
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Community Events</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
              <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {eventsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 w-full rounded-md" />
                  ))
                ) : upcomingEvents.length === 0 ? (
                  <div className="col-span-4 text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mt-4">No upcoming events</p>
                    <Button className="mt-4">Create Your First Event</Button>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pastEvents.length === 0 ? (
                  <div className="col-span-4 text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mt-4">No past events</p>
                  </div>
                ) : (
                  pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* CRM Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Post-Sale Engagement CRM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-md border border-border">
              <h4 className="font-medium">Satisfaction Surveys</h4>
              <p className="text-sm text-muted-foreground mt-1">Automated feedback collection</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-2xl font-bold">4.7</span>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                  Avg Rating
                </Badge>
              </div>
            </div>
            <div className="p-4 rounded-md border border-border">
              <h4 className="font-medium">Renewal Tracking</h4>
              <p className="text-sm text-muted-foreground mt-1">Lease renewal automation</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-2xl font-bold">92%</span>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                  Retention
                </Badge>
              </div>
            </div>
            <div className="p-4 rounded-md border border-border">
              <h4 className="font-medium">Referral Program</h4>
              <p className="text-sm text-muted-foreground mt-1">Member referral incentives</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-2xl font-bold">24</span>
                <Badge className="bg-primary/10 text-primary border-0">
                  This Month
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

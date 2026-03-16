import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import type { CommunityEvent, EventType } from "@shared/schema";

interface EventCardProps {
  event: CommunityEvent;
  onClick?: () => void;
}

const typeConfig: Record<EventType, { label: string; color: string }> = {
  networking: { 
    label: "networking", 
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
  },
  wellness: { 
    label: "wellness", 
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
  },
  workshop: { 
    label: "workshop", 
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" 
  },
  social: { 
    label: "social", 
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" 
  },
};

export function EventCard({ event, onClick }: EventCardProps) {
  const typeStyle = typeConfig[event.type];
  const attendancePercent = Math.round((event.attendees / event.capacity) * 100);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      className="p-4 rounded-md border border-border hover-elevate cursor-pointer transition-colors"
      onClick={onClick}
      data-testid={`event-card-${event.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant="secondary" className={`text-xs ${typeStyle.color}`}>
          {typeStyle.label}
        </Badge>
      </div>
      
      <h4 className="font-semibold text-sm mt-2">{event.title}</h4>
      <p className="text-xs text-muted-foreground mt-1">
        {formatDate(event.date)} at {event.time}
      </p>
      
      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
        <MapPin className="h-3 w-3" />
        {event.location}
      </p>
      
      <div className="flex items-center gap-1 mt-3 text-xs">
        <Users className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground">Attendance</span>
        <span className="font-medium">{event.attendees}/{event.capacity} ({attendancePercent}%)</span>
      </div>
    </div>
  );
}

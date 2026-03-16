import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Screening } from "@shared/schema";

interface ScreeningCardProps {
  screening: Screening;
  onClick?: () => void;
}

const statusColors: Record<string, string> = {
  "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Approved": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Flagged": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Rejected": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function ScreeningCard({ screening, onClick }: ScreeningCardProps) {
  const initials = screening.leadName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  return (
    <div
      className="p-4 rounded-md border border-border hover-elevate cursor-pointer transition-colors"
      onClick={onClick}
      data-testid={`screening-card-${screening.id}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={screening.leadAvatar} alt={screening.leadName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h4 className="font-medium text-sm truncate">{screening.leadName}</h4>
            <p className="text-xs text-muted-foreground">{formatTimeAgo(screening.timestamp)}</p>
          </div>
        </div>
        <Badge 
          variant="secondary" 
          className={cn("text-xs shrink-0", statusColors[screening.status])}
        >
          {screening.status}
        </Badge>
      </div>
      
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{screening.progress}%</span>
        </div>
        <Progress value={screening.progress} className="h-1.5" />
      </div>
    </div>
  );
}

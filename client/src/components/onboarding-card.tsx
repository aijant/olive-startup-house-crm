import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Onboarding } from "@shared/schema";

interface OnboardingCardProps {
  onboarding: Onboarding;
  onClick?: () => void;
}

const statusColors: Record<string, string> = {
  "Orientation": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Invoice Sent": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Docs Pending": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Complete": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function OnboardingCard({ onboarding, onClick }: OnboardingCardProps) {
  const initials = onboarding.memberName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className="flex items-center justify-between gap-3 p-3 rounded-md border border-border hover-elevate cursor-pointer transition-colors"
      onClick={onClick}
      data-testid={`onboarding-card-${onboarding.id}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={onboarding.memberAvatar} alt={onboarding.memberName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h4 className="font-medium text-sm truncate">{onboarding.memberName}</h4>
          <p className="text-xs text-muted-foreground">Move-in: {formatDate(onboarding.moveInDate)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <Badge 
          variant="secondary" 
          className={cn("text-xs", statusColors[onboarding.status])}
        >
          {onboarding.status}
        </Badge>
        <span className="text-sm font-medium text-primary">{formatCurrency(onboarding.monthlyRent)}</span>
      </div>
    </div>
  );
}

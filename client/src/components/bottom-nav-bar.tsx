import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  ClipboardCheck,
  UserPlus,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: " Communication", url: "/communication", icon: MessageSquare },
  { title: "Screening", url: "/screening", icon: ClipboardCheck },
  { title: "Onboarding", url: "/onboarding", icon: UserPlus },
];

export function BottomNavBar() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border bg-background">
      {navItems.map((item) => {
        const isActive =
          item.url === "/"
            ? location === "/"
            : location.startsWith(item.url);
        return (
          <Link
            key={item.title}
            href={item.url}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

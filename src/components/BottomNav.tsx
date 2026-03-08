import { Link, useLocation } from "react-router-dom";
import { PlusCircle, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", label: "Lisa kulu", icon: PlusCircle },
  { path: "/history", label: "Ajalugu", icon: Clock },
  { path: "/summary", label: "Kokkuvõte", icon: BarChart3 },
] as const;

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background safe-area-bottom">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const active = pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className={cn("h-6 w-6", active && "stroke-[2.5]")} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

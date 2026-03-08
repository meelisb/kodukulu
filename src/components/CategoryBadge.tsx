import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const categoryColors: Record<string, string> = {
  Ehitus: "bg-orange-100 text-orange-800 border-orange-200",
  Sisustus: "bg-blue-100 text-blue-800 border-blue-200",
  Haljastus: "bg-green-100 text-green-800 border-green-200",
  "Tööriistad/tarvikud": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Majapidamine: "bg-purple-100 text-purple-800 border-purple-200",
  Auto: "bg-red-100 text-red-800 border-red-200",
};

export default function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", categoryColors[category])}
    >
      {category}
    </Badge>
  );
}

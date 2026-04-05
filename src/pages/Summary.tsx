import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { useExpenses, useExpenseYears } from "@/hooks/useExpenses";
import { CATEGORIES, type Category } from "@/types/expense";
import { cn } from "@/lib/utils";

export default function Summary() {
  const [year, setYear] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: years = [] } = useExpenseYears();
  const { data: expenses = [], isLoading } = useExpenses({
    year: year && year !== "all" ? parseInt(year) : undefined,
  });

  const totals = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      return acc;
    },
    {} as Record<Category, number>
  );

  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  // Vendor breakdown for the selected category
  const vendorBreakdown = useMemo(() => {
    if (!selectedCategory) return [];
    const groups: Record<string, { vendor: string; count: number; total: number }> = {};
    expenses
      .filter((e) => e.category === selectedCategory)
      .forEach((e) => {
        if (!groups[e.vendor]) {
          groups[e.vendor] = { vendor: e.vendor, count: 0, total: 0 };
        }
        groups[e.vendor].count += 1;
        groups[e.vendor].total += Number(e.amount);
      });
    return Object.values(groups).sort((a, b) => b.total - a.total);
  }, [expenses, selectedCategory]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <h1 className="mb-4 text-2xl font-bold text-foreground">Kokkuvõte</h1>

      <Select value={year} onValueChange={setYear}>
        <SelectTrigger className="mb-4 h-11 w-full text-base">
          <SelectValue placeholder="Vali aasta" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Kõik aastad</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">Laadin...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-base font-semibold">
                Kategooria
              </TableHead>
              <TableHead className="text-right text-base font-semibold">
                Summa (€)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CATEGORIES.map((cat) => (
              <>
                <TableRow
                  key={cat}
                  className={cn(
                    "cursor-pointer transition-colors",
                    totals[cat] === 0 && "cursor-default opacity-50",
                    selectedCategory === cat && "bg-accent"
                  )}
                  onClick={() => totals[cat] > 0 && handleCategoryClick(cat)}
                >
                  <TableCell className="text-base">{cat}</TableCell>
                  <TableCell className="text-right text-base font-medium">
                    {totals[cat].toFixed(2)}
                  </TableCell>
                </TableRow>
                {selectedCategory === cat && vendorBreakdown.length > 0 && (
                  vendorBreakdown.map((v) => (
                    <TableRow key={`${cat}-${v.vendor}`} className="bg-muted/50">
                      <TableCell className="pl-8 text-sm text-muted-foreground">
                        {v.vendor}
                        <span className="ml-1 text-xs">({v.count})</span>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {v.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-base font-bold">Kokku</TableCell>
              <TableCell className="text-right text-base font-bold">
                {grandTotal.toFixed(2)} €
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}

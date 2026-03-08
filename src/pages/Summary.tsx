import { useState } from "react";
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

export default function Summary() {
  const [year, setYear] = useState<string>("");

  const { data: years = [] } = useExpenseYears();
  const { data: expenses = [], isLoading } = useExpenses({
    year: year ? parseInt(year) : undefined,
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

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <h1 className="mb-4 text-2xl font-bold text-foreground">Kokkuvõte</h1>

      {/* Year filter */}
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
              <TableRow key={cat}>
                <TableCell className="text-base">{cat}</TableCell>
                <TableCell className="text-right text-base font-medium">
                  {totals[cat].toFixed(2)}
                </TableCell>
              </TableRow>
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

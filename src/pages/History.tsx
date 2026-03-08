import { useState } from "react";
import { format } from "date-fns";
import { et } from "date-fns/locale";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CategoryBadge from "@/components/CategoryBadge";
import { useExpenses, useExpenseYears, exportToCSV } from "@/hooks/useExpenses";
import { CATEGORIES, type Category } from "@/types/expense";

export default function History() {
  const [year, setYear] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const { data: years = [] } = useExpenseYears();
  const { data: expenses = [], isLoading } = useExpenses({
    year: year && year !== "all" ? parseInt(year) : undefined,
    category: category && category !== "all" ? (category as Category) : "",
  });

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <h1 className="mb-4 text-2xl font-bold text-foreground">Ajalugu</h1>

      {/* Filters */}
      <div className="mb-4 flex gap-3">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="h-11 flex-1 text-base">
            <SelectValue placeholder="Aasta" />
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

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-11 flex-1 text-base">
            <SelectValue placeholder="Kategooria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Kõik</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* CSV Export */}
      <Button
        variant="outline"
        className="mb-4 h-11 w-full text-base"
        onClick={() => exportToCSV(expenses)}
        disabled={expenses.length === 0}
      >
        <Download className="mr-2 h-5 w-5" />
        Laadi alla CSV
      </Button>

      {/* List */}
      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">Laadin...</p>
      ) : expenses.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          Kulusid ei leitud
        </p>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-foreground">
                    {expense.vendor}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(expense.date), "dd.MM.yyyy", {
                      locale: et,
                    })}
                  </p>
                  {expense.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {expense.description}
                    </p>
                  )}
                  {expense.fuel_quantity && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      ⛽ {expense.fuel_quantity} l
                    </p>
                  )}
                </div>
                <div className="ml-3 text-right">
                  <p className="text-lg font-bold text-foreground">
                    {expense.amount.toFixed(2)} €
                  </p>
                  <CategoryBadge category={expense.category} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

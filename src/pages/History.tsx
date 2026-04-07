import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";
import { et } from "date-fns/locale";
import { ArrowDownUp, Download, Pencil, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CategoryBadge from "@/components/CategoryBadge";
import { useExpenses, useExpenseYears, exportToCSV, useUpdateExpense, useDeleteExpense } from "@/hooks/useExpenses";
import { CATEGORIES, type Category, type Expense } from "@/types/expense";
import { useCategories } from "@/hooks/useCategories";
import { ExpenseForm, type ExpenseFormData } from "@/components/ExpenseForm";
import { toast } from "@/components/ui/sonner";

export default function History() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [year, setYear] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [sortAsc, setSortAsc] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(
    searchParams.get("highlight")
  );
  const highlightRef = useRef<HTMLDivElement>(null);
  const highlightApplied = useRef(false);

  const { data: years = [] } = useExpenseYears();
  const { data: dbCategories = [] } = useCategories();
    year: year && year !== "all" ? parseInt(year) : undefined,
    category: category && category !== "all" ? (category as Category) : "",
    sortAscending: sortAsc,
  });

  // Auto-adjust year filter for highlighted expense
  useEffect(() => {
    if (!highlightId || highlightApplied.current) return;
    if (isLoading) return;
    
    // Clear the URL param
    searchParams.delete("highlight");
    setSearchParams(searchParams, { replace: true });

    // Find expense in unfiltered data — if not visible, reset filters
    const found = expenses.find((e) => e.id === highlightId);
    if (found) {
      const expYear = new Date(found.date).getFullYear().toString();
      if (year && year !== "all" && year !== expYear) {
        setYear(expYear);
      }
      setCategory("");
      setVendor("");
      setSearchQuery("");
      highlightApplied.current = true;
    } else if (year || category) {
      // Expense not in current filter set — clear filters to find it
      setYear("");
      setCategory("");
      setVendor("");
      setSearchQuery("");
    }
  }, [highlightId, expenses, isLoading]);

  // Fade highlight after 3 seconds
  useEffect(() => {
    if (!highlightId) return;
    const timer = setTimeout(() => setHighlightId(null), 3000);
    return () => clearTimeout(timer);
  }, [highlightId]);

  const vendors = useMemo(
    () => [...new Set(expenses.map((e) => e.vendor))].sort(),
    [expenses]
  );

  const filteredExpenses = useMemo(() => {
    let result = expenses;
    if (vendor && vendor !== "all") {
      result = result.filter((e) => e.vendor === vendor);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.vendor.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q))
      );
    }
    return result;
  }, [expenses, vendor, searchQuery]);

  // Scroll to highlighted card after list renders
  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightId, filteredExpenses]);

  const vendorSummary = useMemo(() => {
    if (!vendor || vendor === "all") return null;
    const count = filteredExpenses.length;
    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    return { count, total };
  }, [vendor, filteredExpenses]);

  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const handleDelete = () => {
    if (!deletingExpenseId) return;
    deleteExpense.mutate(deletingExpenseId, {
      onSuccess: () => {
        toast.success("Kulu kustutatud!");
        setDeletingExpenseId(null);
      },
      onError: () => {
        toast.error("Viga kustutamisel");
        setDeletingExpenseId(null);
      },
    });
  };

  const handleUpdate = (data: ExpenseFormData) => {
    if (!editingExpense) return;
    updateExpense.mutate(
      { id: editingExpense.id, ...data },
      {
        onSuccess: () => {
          toast.success("Kulu muudetud!");
          setEditingExpense(null);
        },
        onError: () => {
          toast.error("Viga muutmisel");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <h1 className="mb-4 text-2xl font-bold text-foreground">Ajalugu</h1>

      {/* Search + Download */}
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Otsi saaja või kirjelduse järgi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-9 text-base"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0"
          onClick={() => exportToCSV(filteredExpenses)}
          disabled={filteredExpenses.length === 0}
          title="Laadi alla CSV"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters + Sort + CSV */}
      <div className="mb-4 flex items-center gap-2">
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

        <Select value={vendor} onValueChange={setVendor}>
          <SelectTrigger className="h-11 flex-1 text-base">
            <SelectValue placeholder="Saaja" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Kõik saajad</SelectItem>
            {vendors.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0"
          onClick={() => setSortAsc((prev) => !prev)}
          title={sortAsc ? "Vanimad ees" : "Uusimad ees"}
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>

      </div>

      {/* Sort indicator */}
      {vendorSummary && (
        <div className="mb-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-foreground">
          {vendor}: {vendorSummary.count} kulu, kokku {vendorSummary.total.toFixed(2)} €
        </div>
      )}

      <p className="mb-3 text-xs text-muted-foreground">
        {sortAsc ? "↑ Vanimad ees" : "↓ Uusimad ees"}
        {searchQuery.trim() && ` · "${searchQuery.trim()}"`}
      </p>

      {/* List */}
      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">Laadin...</p>
      ) : filteredExpenses.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          Kulusid ei leitud
        </p>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              ref={expense.id === highlightId ? highlightRef : undefined}
              className={cn(
                "rounded-lg border border-border bg-card p-4 transition-all duration-700",
                expense.id === highlightId && "ring-2 ring-primary bg-primary/5"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-foreground">
                      {expense.vendor}
                    </p>
                    <button
                      onClick={() => setEditingExpense(expense)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-2"
                      aria-label="Muuda"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingExpenseId(expense.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2 ml-2"
                      aria-label="Kustuta"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
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

      <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Muuda kulu</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              initialData={editingExpense}
              onSubmit={handleUpdate}
              onCancel={() => setEditingExpense(null)}
              isSubmitting={updateExpense.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingExpenseId} onOpenChange={(open) => !open && setDeletingExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kas oled kindel?</AlertDialogTitle>
            <AlertDialogDescription>
              See tegevus on pöördumatu. Kulu kustutatakse jäädavalt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tühista</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Kustuta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

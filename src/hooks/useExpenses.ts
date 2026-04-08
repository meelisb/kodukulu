import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Expense, ExpenseWithCategory } from "@/types/expense";

interface ExpenseFilters {
  year?: number;
  categoryId?: string;
  sortAscending?: boolean;
}

export function useExpenses(filters: ExpenseFilters = {}) {
  return useQuery({
    queryKey: ["expenses", filters],
    queryFn: async () => {
      let query = supabase
        .from("expenses")
        .select("*, categories(name)")
        .order("date", { ascending: filters.sortAscending ?? false });

      if (filters.year) {
        query = query
          .gte("date", `${filters.year}-01-01`)
          .lte("date", `${filters.year}-12-31`);
      }

      if (filters.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ExpenseWithCategory[];
    },
  });
}

export function useAddExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: {
      date: string;
      vendor: string;
      description?: string;
      category_id: string;
      user_id: string;
      amount: number;
      fuel_quantity?: number | null;
    }) => {
      const { data, error } = await supabase
        .from("expenses")
        .insert(expense)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-years"] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...expense }: Partial<Expense> & { id: string }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update(expense)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-years"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-years"] });
    },
  });
}

export function useExpenseYears() {
  return useQuery({
    queryKey: ["expense-years"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("date")
        .order("date", { ascending: false });
      if (error) throw error;
      const years = new Set(data.map((e) => new Date(e.date).getFullYear()));
      return Array.from(years).sort((a, b) => b - a);
    },
  });
}

export function exportToCSV(expenses: ExpenseWithCategory[]) {
  const headers = ["Kuupäev", "Saaja", "Kirjeldus", "Kategooria", "Summa (€)", "Kütuse kogus (l)"];
  const rows = expenses.map((e) => [
    e.date,
    e.vendor,
    e.description || "",
    e.categories?.name || "",
    e.amount.toString().replace(".", ","),
    e.fuel_quantity?.toString().replace(".", ",") || "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(";"))
    .join("\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kodukulu_kulud.csv";
  a.click();
  URL.revokeObjectURL(url);
}

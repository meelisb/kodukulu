import type { Tables } from "@/integrations/supabase/types";

export type Expense = Tables<"expenses">;

/** Expense row with joined category name from the categories table. */
export type ExpenseWithCategory = Expense & {
  categories: { name: string } | null;
};

export type Category = string;

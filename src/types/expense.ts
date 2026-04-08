import type { Tables } from "@/integrations/supabase/types";

export type Expense = Tables<"expenses">;

// Category is now determined by category_id FK, not a text column.
export type Category = string;

import type { Tables } from "@/integrations/supabase/types";

export type Expense = Tables<"expenses">;

export const CATEGORIES = [
  "Ehitus",
  "Sisustus",
  "Haljastus",
  "Tööriistad/tarvikud",
  "Majapidamine",
  "Auto",
] as const;

export type Category = (typeof CATEGORIES)[number];

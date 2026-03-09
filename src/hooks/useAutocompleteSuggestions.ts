import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useVendorSuggestions() {
  return useQuery({
    queryKey: ["vendor-suggestions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("vendor")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Get unique vendors
      const uniqueVendors = Array.from(new Set(data.map((e) => e.vendor)));
      return uniqueVendors;
    },
  });
}

export function useDescriptionSuggestions() {
  return useQuery({
    queryKey: ["description-suggestions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("description")
        .not("description", "is", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Get unique descriptions
      const uniqueDescriptions = Array.from(
        new Set(data.map((e) => e.description).filter(Boolean) as string[])
      );
      return uniqueDescriptions;
    },
  });
}

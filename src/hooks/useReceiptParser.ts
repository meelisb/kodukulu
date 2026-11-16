import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { prepareReceiptFile } from "@/lib/prepareReceiptFile";

export interface ParsedReceipt {
  date?: string;
  vendor?: string;
  description?: string;
  amount?: number;
  fuel_liters?: number | null;
  category?: string | null;
}

export type ParseOutcome = { result: ParsedReceipt; error?: undefined } | { result: null; error: string };

/** supabase-js hides the function's JSON error body inside error.context (a Response). */
async function extractFunctionError(fnError: unknown): Promise<string> {
  const ctx = (fnError as { context?: unknown })?.context;
  if (ctx instanceof Response) {
    try {
      const body = await ctx.clone().json();
      if (body?.error) return String(body.error);
    } catch {
      // not JSON
    }
    return `Server vastas veaga (${ctx.status})`;
  }
  return fnError instanceof Error ? fnError.message : "Võrguühendus ebaõnnestus";
}

export function useReceiptParser() {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseReceipt = async (file: File): Promise<ParseOutcome> => {
    setIsParsing(true);
    setError(null);

    const fail = (message: string): ParseOutcome => {
      console.error("parseReceipt failed:", message);
      setError(message);
      return { result: null, error: message };
    };

    try {
      const body = await prepareReceiptFile(file);

      const { data, error: fnError } = await supabase.functions.invoke("parse-receipt", { body });

      if (fnError) return fail(await extractFunctionError(fnError));
      if (data?.error) return fail(String(data.error));

      const parsed = data as ParsedReceipt;
      const hasAnything = parsed && (parsed.amount != null || parsed.vendor || parsed.date || parsed.description);
      if (!hasAnything) return fail("Kviitungilt ei leitud andmeid. Proovi selgemat pilti või PDF-i.");

      return { result: parsed };
    } catch (err) {
      return fail(err instanceof Error ? err.message : "Kviitungi analüüsimine ebaõnnestus");
    } finally {
      setIsParsing(false);
    }
  };

  return { parseReceipt, isParsing, error };
}

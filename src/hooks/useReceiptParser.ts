import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ParsedReceipt {
  date?: string;
  vendor?: string;
  description?: string;
  amount?: number;
  fuel_liters?: number | null;
  category?: string | null;
}

export function useReceiptParser() {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseReceipt = async (file: File): Promise<ParsedReceipt | null> => {
    setIsParsing(true);
    setError(null);

    try {
      // Convert file to base64
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      const fileBase64 = btoa(binary);

      const { data, error: fnError } = await supabase.functions.invoke("parse-receipt", {
        body: {
          fileBase64,
          mimeType: file.type,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data as ParsedReceipt;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kviitungi analüüsimine ebaõnnestus";
      setError(message);
      return null;
    } finally {
      setIsParsing(false);
    }
  };

  return { parseReceipt, isParsing, error };
}

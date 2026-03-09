import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const { fileBase64, mimeType } = await req.json();

    if (!fileBase64 || !mimeType) {
      throw new Error("Missing fileBase64 or mimeType");
    }

    const prompt = `Extract the following fields from this receipt and return only JSON: date (YYYY-MM-DD), vendor (store/station name), description (product or service), amount (total paid as number), fuel_liters (liters as number, null if not applicable), category (use 'Auto' if fuel/car wash/windshield fluid, otherwise null)`;

    const mediaType = mimeType === "application/pdf" ? "application/pdf" : mimeType;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: mediaType === "application/pdf" ? "document" : "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: fileBase64,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.content?.find((c: { type: string }) => c.type === "text");
    const responseText = textContent?.text || "";

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Claude response");
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("parse-receipt error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

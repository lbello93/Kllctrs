// app/api/cards/valuate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const FREE_LIMIT = 3;

interface ValuationResult {
  low: number;
  mid: number;
  high: number;
  grade: string;
  trend: string;
  overview: string;
  recommendation: string;
  recommendationDetail: string;
  keyFactors: string[];
  recentSales: Array<{ label: string; price: string }>;
}

interface EbayComparable {
  title: string;
  price: number;
  condition: string;
  date?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    // 2. Check daily usage
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("valuation_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    const used = count ?? 0;

    // TODO: check if user has paid plan
    // const { data: profile } = await supabase
    //   .from("profiles")
    //   .select("plan")
    //   .eq("id", user.id)
    //   .single();
    // const isPaid = profile?.plan === "pro";
    const isPaid = false;

    if (!isPaid && used >= FREE_LIMIT) {
      return NextResponse.json(
        {
          error: "limit_reached",
          message: `You've used all ${FREE_LIMIT} free appraisals today. Upgrade for unlimited access.`,
          used,
          limit: FREE_LIMIT,
        },
        { status: 429 }
      );
    }

    // 3. Parse request
    const body = await req.json();

    if (!body.cardName) {
      return NextResponse.json({ error: "cardName required" }, { status: 400 });
    }

    // 4. Build Gemini prompt
    const compsText =
      body.ebayComps && body.ebayComps.length > 0
        ? body.ebayComps
            .map(
              (c: EbayComparable) =>
                `- ${c.title} | $${c.price} | ${c.condition} | ${c.date ?? "N/A"}`
            )
            .join("\n")
        : "No comparable sales data available.";

    const prompt = `You are a trading card market analyst. Analyze this card and provide a valuation.

Card Details:
- Name: ${body.cardName}
- Player/Character: ${body.player || "Unknown"}
- Year: ${body.year || "Unknown"}
- Brand/Set: ${body.brand || "Unknown"}
- Sport/Category: ${body.sport || "Unknown"}
- Condition/Grade: ${body.grade || "Raw (Ungraded)"}

Recent eBay Comparable Sales:
${compsText}

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "low": <number lowest realistic price>,
  "mid": <number most likely price>,
  "high": <number highest realistic price>,
  "grade": "<single letter A-F investment grade>",
  "trend": "<percentage trend over 6 months e.g. +5% or -10%>",
  "overview": "<2-3 sentence market overview>",
  "recommendation": "<Buy|Sell|Hold>",
  "recommendationDetail": "<1-2 sentence reasoning>",
  "keyFactors": ["<factor1>", "<factor2>", "<factor3>", "<factor4>"],
  "recentSales": [{"label": "<short description>", "price": "<price range string>"}]
}

Base your estimates on the comparable sales data when available. Be realistic and conservative.`;

    // 5. Call Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini error:", errText);
      return NextResponse.json({ error: "AI analysis failed" }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const rawText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = rawText.replace(/```json\s?|```/g, "").trim();

    let valuation: ValuationResult;
    try {
      valuation = JSON.parse(cleaned);
    } catch {
      console.error("Raw Gemini response:", rawText);
      const patched =
        cleaned.replace(/,\s*$/, "").replace(/("[^"]*?)$/, '$1"') + "]}";
      try {
        valuation = JSON.parse(patched);
      } catch {
        valuation = {
          low: 0,
          mid: 0,
          high: 0,
          grade: "C",
          trend: "0%",
          overview:
            "Unable to fully analyze. Try again with more specific card details.",
          recommendation: "Hold",
          recommendationDetail: "Insufficient data for a recommendation.",
          keyFactors: [
            "Try adding year, brand, and grade for better results",
          ],
          recentSales: [],
        };
      }
    }

    // 6. Record usage AFTER successful valuation
    await supabase.from("valuation_usage").insert({
  user_id: user.id,
  card_name: body.cardName,
  player: body.player ?? null,
  year: body.year ?? null,
  brand: body.brand ?? null,
  sport: body.sport ?? null,
  grade: body.grade ?? null,
  result_low: valuation.low,
  result_mid: valuation.mid,
  result_high: valuation.high,
  result_grade: valuation.grade,
  result_recommendation: valuation.recommendation,
});

    // 7. Return result with remaining count
    return NextResponse.json({
      ...valuation,
      remaining: isPaid ? null : FREE_LIMIT - used - 1,
    });
  } catch (err) {
    console.error("Valuation error:", err);
    return NextResponse.json({ error: "Valuation failed" }, { status: 500 });
  }
}

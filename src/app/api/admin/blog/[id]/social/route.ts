import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { ok: false as const, status: 403 };
  return { ok: true as const };
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });

  const { id } = await params;
  const { data: article, error } = await supabaseAdmin.from("content").select("id, title, body, meta_description, slug, status, source_event_id").eq("id", id).single();
  if (error || !article) return NextResponse.json({ error: "Article not found" }, { status: 404 });

  const sourceContext = article.source_event_id
    ? await supabaseAdmin.from("events").select("name, date_start, date_end, city, state, venue_name, website, source").eq("id", article.source_event_id).maybeSingle()
    : null;
  const trustedFacts = sourceContext?.data
    ? `\nVerified event source details: ${JSON.stringify(sourceContext.data)}`
    : "";
  const prompt = `Create platform-specific social drafts promoting this KLLCTRS community article. Treat the article and event details as the complete fact source. Do not add facts, prices, event claims, quotes, or endorsements that are not present. If a detail is missing, omit it. Keep the writing useful and natural, not salesy.\n\nTitle: ${article.title ?? "Untitled"}\nSummary: ${article.meta_description ?? ""}\nArticle body (may contain markdown):\n${article.body.slice(0, 14000)}${trustedFacts}\n\nPublic article URL: https://www.kllctrs.com/blog/${article.slug ?? ""}\n\nReturn only JSON with this exact shape:\n{\n  "instagram": {"caption": "Caption with a clear opening, short paragraphs, one relevant question or CTA, and the article URL", "carousel_slides": ["Cover slide text", "... 4 to 6 short slide texts total"], "hashtags": ["#..."] , "visual_brief": "A practical visual direction for a 4:5 carousel; do not imply unprovided photos exist"},\n  "linkedin": {"post": "Professional but conversational post with a strong first line, useful takeaway, CTA and article URL", "hashtags": ["#..."]}\n}\nInstagram caption must be concise and readable. LinkedIn post text including URL and hashtags should stay below 2,700 characters to leave room for edits. Hashtags should be relevant and limited. Carousel text must be short enough for a graphic. Do not include markdown fences.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" },
    });
    const raw = response.text ?? "";
    const parsed = JSON.parse(raw) as {
      instagram?: { caption?: string; carousel_slides?: string[]; hashtags?: string[]; visual_brief?: string };
      linkedin?: { post?: string; hashtags?: string[] };
    };
    if (!parsed.instagram?.caption || !parsed.linkedin?.post || !Array.isArray(parsed.instagram.carousel_slides)) {
      return NextResponse.json({ error: "Generated social drafts were incomplete. Please retry." }, { status: 502 });
    }
    const socialDrafts = {
      instagram: {
        caption: parsed.instagram.caption.slice(0, 2200),
        carousel_slides: parsed.instagram.carousel_slides.slice(0, 8).map((slide) => String(slide).slice(0, 180)),
        hashtags: (parsed.instagram.hashtags ?? []).slice(0, 12).map((tag) => String(tag).slice(0, 40)),
        visual_brief: String(parsed.instagram.visual_brief ?? "").slice(0, 500),
      },
      linkedin: {
        post: parsed.linkedin.post.slice(0, 2700),
        hashtags: (parsed.linkedin.hashtags ?? []).slice(0, 8).map((tag) => String(tag).slice(0, 40)),
      },
      generated_at: new Date().toISOString(),
      source_article_id: article.id,
    };
    const { error: saveError } = await supabaseAdmin.from("content").update({ social_drafts: socialDrafts }).eq("id", id);
    if (saveError) return NextResponse.json({ error: "Could not save generated drafts. Apply the content social_drafts migration first." }, { status: 500 });
    return NextResponse.json({ social_drafts: socialDrafts });
  } catch (cause) {
    console.error("Social draft generation failed", cause);
    return NextResponse.json({ error: "Draft generation failed. Please try again." }, { status: 502 });
  }
}

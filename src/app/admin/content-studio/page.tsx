import Link from "next/link";
import { Sparkles } from "lucide-react";

import { supabaseAdmin } from "@/lib/supabase/admin";
import ContentStudioClient from "@/page-components/AdminPage/ContentStudioClient";

export const metadata = { title: "Admin · Content Studio | KLLCTRS" };

export default async function ContentStudioPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: events }, { data: brands }] = await Promise.all([
    supabaseAdmin
      .from("events")
      .select("id, name, date_start, city, state")
      .eq("status", "approved")
      .gte("date_start", today)
      .order("date_start", { ascending: true })
      .limit(100),
    supabaseAdmin
      .from("sponsors")
      .select("id, name, category")
      .order("name", { ascending: true })
      .limit(200),
  ]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-white/70 p-4">
        <div>
          <p className="text-sm font-semibold text-[#2a1a5e]">New: Prompt Studio</p>
          <p className="text-xs text-[#4a3f6b]/70">
            Research a topic, then generate social posts, branded images and Claude video prompts.
          </p>
        </div>
        <Link
          href="/admin/content-studio/studio"
          className="inline-flex items-center gap-2 rounded-lg bg-[#5B18BE] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#4a1399]"
        >
          <Sparkles className="size-4" /> Open Prompt Studio
        </Link>
      </div>
      <ContentStudioClient events={events ?? []} brands={brands ?? []} />
    </>
  );
}

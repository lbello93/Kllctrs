import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const SITE_ORIGIN = "https://www.kllctrs.com";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    { url: SITE_ORIGIN, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_ORIGIN}/maps`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_ORIGIN}/shops`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_ORIGIN}/sponsors`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_ORIGIN}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_ORIGIN}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_ORIGIN}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return routes;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const fetchRecords = () => Promise.all([
    supabase.from("events").select("slug").eq("status", "approved").not("slug", "is", null).limit(5000),
    supabase.from("shops").select("slug").eq("status", "approved").not("slug", "is", null).limit(5000),
    supabase.from("content").select("slug, updated_at").eq("status", "published").eq("type", "blog").not("slug", "is", null).limit(5000),
    supabase.from("sponsors").select("slug").not("slug", "is", null).limit(2000),
  ]);
  let records: Awaited<ReturnType<typeof fetchRecords>>;
  try {
    records = await fetchRecords();
  } catch {
    return routes;
  }
  const [events, shops, articles, sponsors] = records;

  for (const event of events.data ?? []) routes.push({ url: `${SITE_ORIGIN}/maps/events/${event.slug}`, changeFrequency: "weekly", priority: 0.7 });
  for (const shop of shops.data ?? []) routes.push({ url: `${SITE_ORIGIN}/maps/shops/${shop.slug}`, changeFrequency: "monthly", priority: 0.6 });
  for (const sponsor of sponsors.data ?? []) routes.push({ url: `${SITE_ORIGIN}/sponsors/${sponsor.slug}`, changeFrequency: "monthly", priority: 0.6 });
  for (const article of articles.data ?? []) {
    routes.push({
      url: `${SITE_ORIGIN}/blog/${article.slug}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return routes;
}

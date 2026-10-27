import { supabaseAdmin } from "@/lib/supabase/admin";

export async function searchContent(args: { keyword: string; category?: string }) {
  const keyword = args.keyword.trim().replace(/[^\p{L}\p{N}\s'-]/gu, " ").replace(/\s+/g, " ").slice(0, 100);
  if (!keyword) return { found: false, total: 0, articles: [] };

  let query = supabaseAdmin
    .from("content")
    .select("title, slug, meta_description, body, category, author, published_at, type", { count: "exact" })
    .eq("status", "published")
    .eq("type", "blog")
    .not("slug", "is", null)
    .or(`title.ilike.%${keyword}%,meta_description.ilike.%${keyword}%,body.ilike.%${keyword}%`)
    .order("published_at", { ascending: false })
    .limit(50);

  const category = args.category?.trim().replace(/[^\p{L}\p{N}\s'-]/gu, " ").slice(0, 50);
  if (category) query = query.ilike("category", `%${category}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  const terms = keyword.toLocaleLowerCase().split(/\s+/).filter((term) => term.length > 2);
  const candidates = (data ?? []).map((article) => {
    const { body, ...metadata } = article;
    const titleText = (article.title ?? "").toLocaleLowerCase();
    const summaryText = (article.meta_description ?? "").toLocaleLowerCase();
    const categoryText = (article.category ?? "").toLocaleLowerCase();
    const bodyText = body.toLocaleLowerCase();
    const prominentText = `${titleText} ${summaryText} ${categoryText}`;
    const prominentMatches = terms.filter((term) => prominentText.includes(term)).length;
    const bodyOccurrences = terms.reduce((total, term) => {
      return total + (bodyText.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
    }, 0);
    const exactProminentMatch = prominentText.includes(keyword.toLocaleLowerCase());
    const relevant = exactProminentMatch || prominentMatches > 0 || bodyOccurrences >= Math.max(2, terms.length);
    const relevance = (exactProminentMatch ? 10 : 0) + prominentMatches * 3 + bodyOccurrences;

    return {
      ...metadata,
      excerpt: body.replace(/\s+/g, " ").slice(0, 900),
      article_url: `/blog/${article.slug}`,
      relevance,
      relevant,
    };
  }).filter((article) => article.relevant)
    .sort((a, b) => b.relevance - a.relevance || (b.published_at ?? "").localeCompare(a.published_at ?? ""));

  const articles = candidates.slice(0, 5).map(({ relevance: _relevance, relevant: _relevant, ...article }) => article);
  return {
    found: articles.length > 0,
    total: candidates.length,
    returned: articles.length,
    truncated: candidates.length > articles.length || (count ?? 0) > 50,
    articles,
  };
}

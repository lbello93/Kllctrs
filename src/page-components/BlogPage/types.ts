export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  meta_description?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  author?: string | null;
  type: string;
  category?: string | null;
}
import BlogCard from "./BlogCard";
import type { ContentItem } from "../ContentHubClient";

interface Props {
  content: ContentItem[];
}

export default function BlogGrid({ content }: Props) {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {content.map((item) => (
          <BlogCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

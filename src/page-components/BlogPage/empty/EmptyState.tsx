import { BookOpen, Search } from "lucide-react";

interface EmptyStateProps {
  search?: string;
}

export default function EmptyState({ search }: EmptyStateProps) {
  const hasSearch = search && search.trim().length > 0;

  return (
    <div className="flex min-h-[350px] items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        {/* Icon */}

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
          {hasSearch ? (
            <Search className="h-9 w-9 text-[#8B5CF6]" />
          ) : (
            <BookOpen className="h-9 w-9 text-[#8B5CF6]" />
          )}
        </div>

        {/* Title */}

        <h2 className="mb-3 text-2xl font-bold text-[#151E3C]">
          {hasSearch ? "No matching articles found" : "No articles available"}
        </h2>

        {/* Description */}

        <p className="text-sm leading-6 text-neutral-500">
          {hasSearch
            ? `No results were found for "${search}". Try another keyword.`
            : "There are currently no published articles to display."}
        </p>
      </div>
    </div>
  );
}

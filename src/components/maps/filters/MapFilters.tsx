"use client";

import { Search, Calendar, ShoppingBag, X } from "lucide-react";

interface Props {
  mode: "shows" | "shops";
  setMode: (mode: "shows" | "shops") => void;

  search: string;
  setSearch: (value: string) => void;

  city: string;
  setCity: (value: string) => void;

  cities: string[];

  category: string;
  setCategory: (value: string) => void;

  categories: string[];
}

export default function MapFilters({
  mode,
  setMode,
  search,
  setSearch,
  city,
  setCity,
  cities,
  category,
  setCategory,
  categories,
}: Props) {
  const hasActiveFilters = search !== "" || city !== "" || category !== "";

  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center gap-5">
      {/* Step 1: what are you looking for */}
      <div className="flex h-12 w-full max-w-[320px] overflow-hidden rounded-full border border-[#8B5CF6] bg-white p-1">
        <button
          onClick={() => setMode("shows")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors ${
            mode === "shows"
              ? "bg-[#8B5CF6] text-white"
              : "text-[#4a3f6b]/60 hover:text-[#8B5CF6]"
          }`}
        >
          <Calendar size={16} />
          Shows
        </button>

        <button
          onClick={() => setMode("shops")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors ${
            mode === "shops"
              ? "bg-[#8B5CF6] text-white"
              : "text-[#4a3f6b]/60 hover:text-[#8B5CF6]"
          }`}
        >
          <ShoppingBag size={16} />
          Shops
        </button>
      </div>

      {/* Step 2: search + narrow it down */}
      <div className="flex w-full flex-wrap items-end justify-center gap-4">
        {/* Search, always the biggest, most obvious control */}
        <div className="flex min-w-[280px] flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium text-[#4a3f6b]/50">
            Search by name
          </label>
          <div className="flex h-11 items-center gap-2 rounded-[10px] border border-[#B39EF9] bg-white px-4">
            <Search size={16} className="shrink-0 text-[#8B5CF6]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                mode === "shows"
                  ? "e.g. Nationals, Chicago Card Show..."
                  : "e.g. Dave & Adam's, The Compleat Strategist..."
              }
              className="flex-1 text-sm text-[#1E1E1E] outline-none placeholder:text-[#4a3f6b]/30"
            />
          </div>
        </div>

        {/* Category only makes sense for shops, so it only appears in shop mode */}
        {mode === "shops" && (
          <div className="flex w-[160px] flex-col gap-1.5">
            <label className="text-xs font-medium text-[#4a3f6b]/50">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 rounded-[10px] border border-[#B39EF9] bg-white px-3 text-sm text-[#1E1E1E]"
            >
              <option value="">All categories</option>
              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex w-[160px] flex-col gap-1.5">
          <label className="text-xs font-medium text-[#4a3f6b]/50">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-11 rounded-[10px] border border-[#B39EF9] bg-white px-3 text-sm text-[#1E1E1E]"
          >
            <option value="">All cities</option>
            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>

        {/* Clear only shows up once there's actually something to clear */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch("");
              setCity("");
              setCategory("");
            }}
            className="flex h-11 items-center gap-1.5 rounded-[10px] px-3 text-sm font-medium text-[#8B5CF6] hover:bg-[#F2EFFE] transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

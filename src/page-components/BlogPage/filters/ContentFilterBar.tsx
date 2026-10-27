"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

interface Props {
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  totalResults: number;
}

const FILTERS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Card",
    value: "card",
  },
  {
    label: "Brand",
    value: "brands",
  },
  {
    label: "Editorial",
    value: "editorial",
  },
  {
    label: "Community",
    value: "community",
  },
  {
    label: "Market-Intel",
    value: "market_intel",
  },
];

export default function ContentFilterBar({
  activeCategory,
  setActiveCategory,
  search,
  setSearch,
  totalResults,
}: Props) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selected =
    FILTERS.find((item) => item.value === activeCategory)?.label ?? "All";

  return (
    <section className="relative z-20 border-b border-violet-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-5">
        {/* ===================== DESKTOP ===================== */}

        <div className="hidden items-center justify-between gap-5 lg:flex">
          {/* Categories */}

          <div className="flex overflow-hidden rounded-full border border-[#8B5CF6]">
            {FILTERS.map((filter) => {
              const active = activeCategory === filter.value;

              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveCategory(filter.value)}
                  className={`
                    border-r
                    border-[#8B5CF6]
                    px-5
                    py-2
                    text-xs
                    font-medium
                    transition-all
                    last:border-r-0

                    ${
                      active
                        ? "bg-[#8B5CF6] text-white"
                        : "bg-white text-black hover:bg-violet-50"
                    }
                  `}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Right */}

          <div className="flex items-center gap-3">
            <div className="relative w-[390px]">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5CF6]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="h-11 w-full rounded-xl border border-[#B39EF9] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#8B5CF6]"
              />
            </div>

            <div className="flex h-11 items-center justify-center rounded-full bg-violet-100 px-4 text-xs font-semibold whitespace-nowrap text-[#8B5CF6]">
              {totalResults} Articles
            </div>
          </div>
        </div>

        {/* ===================== MOBILE ===================== */}

        <div className="flex flex-col gap-3 lg:hidden">
          {/* Search */}

          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5CF6]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="h-12 w-full rounded-xl border border-[#B39EF9] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#8B5CF6]"
            />
          </div>

          {/* Custom Dropdown */}

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex h-12 w-full items-center justify-between rounded-xl border"
            >
              <span>{selected}</span>

              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-[54px]
                  z-50
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#ECE7FF]
                  bg-white
                  shadow-xl
                "
              >
                {FILTERS.map((filter) => {
                  const active = activeCategory === filter.value;

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => {
                        setActiveCategory(filter.value);
                        setOpen(false);
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        border-b
                        border-neutral-100
                        px-4
                        py-3
                        text-left
                        text-sm
                        transition-colors
                        last:border-b-0
                        hover:bg-violet-50
                      "
                    >
                      <span>{filter.label}</span>

                      {active && <Check size={16} className="text-[#8B5CF6]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Count */}

          <div className="text-center text-xs font-semibold text-[#8B5CF6]">
            {totalResults} Articles
          </div>
        </div>
      </div>
    </section>
  );
}

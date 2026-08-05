"use client";

import type { Sponsor } from "@/types";

import SponsorsHero from "./hero/SponsorsHero";
import SponsorsFilters from "./filters/SponsorsFilters";
import SponsorsGrid from "./cards/SponsorsGrid";
import EmptySponsors from "./empty/EmptySponsors";

import { useSponsorsFilter } from "./hooks/useSponsorsFilter";

import { useState } from "react";

interface ShowSummary {
  id: string;
  name: string;
  slug: string;
  date_start: string;
}
interface Props {
  initialSponsors: Sponsor[];
  showsBySponsor: Record<string, ShowSummary[]>;
}

export default function SponsorsClients({
  initialSponsors,
  showsBySponsor,
}: Props) {
  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [tierFilter, setTierFilter] = useState("all");

  const [sortBy, setSortBy] = useState("shows_desc");

  const filtered = useSponsorsFilter({
    sponsors: initialSponsors,
    search,
    tierFilter,
    categoryFilter,
    sortBy,
  });

  return (
    <main className="min-h-screen bg-[#F8F8FC]">
      <SponsorsHero />

      <SponsorsFilters
        search={search}
        setSearch={setSearch}
        tierFilter={tierFilter}
        setTierFilter={setTierFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {filtered.length === 0 ? (
        <EmptySponsors />
      ) : (
        <SponsorsGrid sponsors={filtered} showsBySponsor={showsBySponsor} />
      )}
    </main>
  );
}

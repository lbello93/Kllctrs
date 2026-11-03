"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Store } from "lucide-react";
import type { Shop } from "@/types";
import ShopMap from "@/components/maps/map/ShopMap";
import ShopList from "@/components/shops/ShopList";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

interface Props {
  initialShops: Shop[];
  savedIds: string[];
}

export default function ShopsClient({ initialShops, savedIds }: Props) {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);

  const [stateFilter, setStateFilter] = useState("");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [specialty, setSpecialty] = useState("");

  const applyFilters = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (stateFilter) params.set("state", stateFilter);
    if (city) params.set("city", city);
    if (keyword) params.set("keyword", keyword);
    if (specialty) params.set("specialty", specialty);

    try {
      const res = await fetch(`/api/shops?${params}`);
      const json = await res.json();
      setShops(json.shops ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [stateFilter, city, keyword, specialty]);

  const resetFilters = () => {
    setStateFilter("");
    setCity("");
    setKeyword("");
    setSpecialty("");
    setShops(initialShops);
  };

  const selectClass =
    "h-9 px-3 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] pt-24">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-violet-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1a0a3d]">
            Card Shops
          </h1>
          <p className="text-[#4a3f6b]/60 mt-1 text-sm">
            {shops.length} shops across the US
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 border-b border-violet-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-[#5f2eea]">
                {shops.length}
              </p>
              <p className="text-[10px] font-medium text-[#4a3f6b]/40 uppercase tracking-wider">
                Shops
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-[#5f2eea]">
                {new Set(shops.map((s) => s.state)).size}
              </p>
              <p className="text-[10px] font-medium text-[#4a3f6b]/40 uppercase tracking-wider">
                States
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-[#5f2eea]">
                {new Set(shops.map((s) => s.city)).size}
              </p>
              <p className="text-[10px] font-medium text-[#4a3f6b]/40 uppercase tracking-wider">
                Cities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative z-40 border-b border-violet-100 bg-white/70 backdrop-blur-xl sticky top-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a3f6b]/30" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search shops..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm placeholder-[#4a3f6b]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors"
            />
          </div>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className={selectClass}
          >
            <option value="">All States</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="h-9 w-[120px] px-3 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm placeholder-[#4a3f6b]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors"
          />

          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className={selectClass}
          >
            <option value="">All Types</option>
            <option value="sports">Sports Cards</option>
            <option value="pokemon">Pokémon</option>
            <option value="both">Both</option>
          </select>

          <motion.button
            onClick={applyFilters}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-9 px-5 rounded-xl text-sm font-black text-white border-0 shadow-lg shadow-violet-500/20 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
          >
            Apply
          </motion.button>

          <button
            onClick={resetFilters}
            className="h-9 px-4 rounded-xl border border-violet-200 text-sm font-medium text-[#4a3f6b]/60 hover:text-[#1a0a3d] hover:border-violet-400 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Map */}
        <div
          className="rounded-2xl overflow-hidden border border-violet-100 shadow-xl shadow-violet-200/30"
          style={{ height: "480px" }}
        >
          <ShopMap
            shops={shops}
            selectedShop={selectedShop}
            onShopSelect={setSelectedShop}
          />
        </div>

        {/* Grid */}
        <div>
          <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase mb-4">
            All Shops
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-violet-100 bg-white/80 p-5"
                >
                  <motion.div
                    className="h-3 w-16 bg-violet-50 rounded-full mb-3"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.1,
                    }}
                  />
                  <motion.div
                    className="h-4 w-3/4 bg-violet-50 rounded-full mb-2"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.15,
                    }}
                  />
                  <motion.div
                    className="h-3 w-1/2 bg-violet-50 rounded-full"
                    animate={{ opacity: [0.4, 0.6, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.2,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-4">
                <Store className="w-7 h-7 text-[#5f2eea]/40" />
              </div>
              <p className="text-lg font-bold text-[#1a0a3d]">No shops found</p>
              <p className="text-sm text-[#4a3f6b]/40 mt-1">
                Try adjusting your filters.
              </p>
            </div>
          ) : (
            <ShopList
              shops={shops}
              selectedShop={selectedShop}
              onShopSelect={setSelectedShop}
              savedIds={savedIds}
            />
          )}
        </div>
      </div>
    </div>
  );
}

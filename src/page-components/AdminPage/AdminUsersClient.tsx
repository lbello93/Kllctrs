"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import type { Profile } from "@/types";
import {
  Users,
  Search,
  Shield,
  ShieldOff,
  Loader2,
  CalendarDays,
  Heart,
  MapPin,
} from "lucide-react";

interface Props {
  initialUsers: Profile[];
}

export default function AdminUsersClient({ initialUsers }: Props) {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.email?.toLowerCase().includes(q));
  }, [users, search]);

  const adminCount = users.filter((u) => u.role === "admin").length;

  const setRole = async (id: string, role: "user" | "admin") => {
    setBusy(id);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setBusy(null);

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      alert(e.error ?? "Failed to update role");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1a0a3d] tracking-tight">
          Users
        </h1>
        <p className="text-sm text-[#4a3f6b]/60 mt-1">
          {users.length} total · {adminCount} admin{adminCount === 1 ? "" : "s"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: Users },
          { label: "Admins", value: adminCount, icon: Shield },
          {
            label: "Regular Users",
            value: users.length - adminCount,
            icon: Users,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black tracking-[0.2em] text-[#4a3f6b]/40 uppercase">
                {label}
              </span>
              <Icon className="w-4 h-4 text-[#5f2eea]/30" />
            </div>
            <p className="text-3xl font-black text-[#5f2eea]">{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a3f6b]/30" />
          <input
            type="text"
            placeholder="Search by email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm placeholder-[#4a3f6b]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors"
          />
        </div>
      </div>

      {/* Users table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-violet-100 bg-white/80 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-3">
            <Users className="w-5 h-5 text-[#5f2eea]/40" />
          </div>
          <p className="text-sm font-bold text-[#1a0a3d]">
            {search ? "No users match your search." : "No users yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-violet-100 bg-[#f4f3fb]">
            <div className="col-span-4 text-[10px] font-black tracking-[0.2em] text-[#4a3f6b]/40 uppercase">
              Email
            </div>
            <div className="col-span-2 text-[10px] font-black tracking-[0.2em] text-[#4a3f6b]/40 uppercase hidden md:block">
              Role
            </div>
            <div className="col-span-3 text-[10px] font-black tracking-[0.2em] text-[#4a3f6b]/40 uppercase hidden lg:block">
              Saved
            </div>
            <div className="col-span-2 text-[10px] font-black tracking-[0.2em] text-[#4a3f6b]/40 uppercase hidden lg:block">
              Joined
            </div>
            <div className="col-span-1 text-[10px] font-black tracking-[0.2em] text-[#4a3f6b]/40 uppercase text-right">
              Action
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-violet-50">
            {filtered.map((u, i) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-violet-50/40 transition-colors"
              >
                {/* Email */}
                <div className="col-span-4 min-w-0">
                  <p className="text-sm font-medium text-[#1a0a3d] truncate">
                    {u.email}
                  </p>
                </div>

                {/* Role */}
                <div className="col-span-2 hidden md:block">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      u.role === "admin"
                        ? "bg-[#5f2eea]/10 text-[#5f2eea] border border-[#5f2eea]/20"
                        : "bg-violet-50 text-[#4a3f6b]/50 border border-violet-100"
                    }`}
                  >
                    {u.role ?? "user"}
                  </span>
                </div>

                {/* Saved */}
                <div className="col-span-3 hidden lg:flex items-center gap-3 text-xs text-[#4a3f6b]/40">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {u.saved_events?.length ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {u.saved_shops?.length ?? 0}
                  </span>
                </div>

                {/* Joined */}
                <div className="col-span-2 hidden lg:block text-xs text-[#4a3f6b]/35">
                  {u.created_at &&
                    format(new Date(u.created_at), "MMM d, yyyy")}
                </div>

                {/* Action */}
                <div className="col-span-1 flex justify-end">
                  {u.role === "admin" ? (
                    <button
                      onClick={() => {
                        if (adminCount <= 1) {
                          alert("Cannot demote the last admin.");
                          return;
                        }
                        if (
                          confirm("Remove admin privileges from this user?")
                        ) {
                          setRole(u.id, "user");
                        }
                      }}
                      disabled={busy === u.id}
                      title="Demote to user"
                      className="h-8 w-8 rounded-xl border border-amber-200 text-amber-500 hover:bg-amber-50 flex items-center justify-center disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      {busy === u.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ShieldOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (confirm("Make this user an admin?")) {
                          setRole(u.id, "admin");
                        }
                      }}
                      disabled={busy === u.id}
                      title="Make admin"
                      className="h-8 w-8 rounded-xl border border-violet-200 text-[#5f2eea] hover:bg-violet-50 flex items-center justify-center disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      {busy === u.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Shield className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

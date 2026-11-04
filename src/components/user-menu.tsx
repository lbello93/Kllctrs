"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { LogOut, Settings, UserRound } from "lucide-react";

import { getUser, signOut } from "@/lib/auth";

/** Header avatar + dropdown (profile, settings, logout). */
export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) {
    return (
      <Link href="/login" className="text-sm font-medium text-[#5B18BE] hover:underline">
        Sign in
      </Link>
    );
  }

  const label = (user.user_metadata?.display_name as string) || user.email || "Account";
  const initial = label.charAt(0).toUpperCase();

  const logout = async () => {
    await signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-full bg-amethyst-500 text-sm font-bold text-white"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initial}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-violet-100 bg-white py-1 shadow-lg"
        >
          <div className="truncate px-3 py-2 text-xs text-[#4a3f6b]/60">{label}</div>
          <Link href="/profile" role="menuitem" className="flex items-center gap-2 px-3 py-2 text-sm text-[#1a0a3d] hover:bg-violet-50">
            <UserRound className="size-4" /> Profile
          </Link>
          <Link href="/profile" role="menuitem" className="flex items-center gap-2 px-3 py-2 text-sm text-[#1a0a3d] hover:bg-violet-50">
            <Settings className="size-4" /> Settings
          </Link>
          <button onClick={logout} role="menuitem" className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { NavLink } from "./navbar-data";

interface MobileNavbarProps {
  pathname: string;
  navLinks: NavLink[];
  user?: User | null;
  isPro?: boolean;
  onSignOut?: () => void;
}

export default function MobileNavbar({
  pathname,
  navLinks,
  user,
  isPro,
  onSignOut,
}: MobileNavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-[9999] px-4">
        <nav className="mt-3 h-[56px] bg-[#F2EFFE] rounded-[14px] px-4 flex items-center justify-between shadow-lg">
          <Link href="/">
            <Image
              src="/Logo.png"
              alt="KLLCTRS"
              width={100}
              height={36}
              priority
              style={{ width: "auto" }}
            />
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/5 border border-black/10"
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[10000] bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-[85vw] max-w-[320px] bg-white flex flex-col z-[10001] transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold">Menu</h2>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-2">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium ${pathname === path ? "bg-purple-100 text-purple-700" : "text-gray-700"}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto border-t p-4 flex flex-col gap-2">
          <Link href="/pricing" onClick={() => setOpen(false)}>
            <button className="w-full h-11 rounded-xl bg-[#8B5CF6] text-white font-medium">
              {isPro ? "Pro Beta" : "Go Pro"}
            </button>
          </Link>

          {user ? (
            <button
              onClick={() => {
                setOpen(false);
                onSignOut?.();
              }}
              className="h-11 rounded-xl border font-medium"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}>
              <button className="w-full h-11 rounded-xl border font-medium">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

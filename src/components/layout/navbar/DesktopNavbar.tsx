"use client";

import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import type { NavLink } from "./navbar-data";

interface DesktopNavbarProps {
  pathname: string;
  navLinks: NavLink[];

  user?: User | null;
  isAdmin?: boolean;
  isPro?: boolean;
  isScrolled?: boolean;

  onSignOut?: () => void;
}

export default function DesktopNavbar({
  pathname,
  navLinks,
  user,
  isPro,
  isScrolled,
  onSignOut,
}: DesktopNavbarProps) {
  return (
    <header className="fixed top-4 left-0 right-0 z-[9999] flex justify-center px-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-[1370px] h-[50px] rounded-[14px] px-6 flex items-center transition-all duration-300
          ${
            isScrolled
              ? "bg-white/90 backdrop-blur-md shadow-xl"
              : "bg-[#F2EFFE] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          }
        `}
      >
        {/* LOGO */}
        <div className="flex items-center min-w-fit">
          <Link href="/">
            <Image
              src="/Logo.png"
              alt="KLLCTRS"
              width={104}
              height={36}
              priority
              style={{ width: "auto" }}
            />
          </Link>
        </div>

        {/* CENTER NAVIGATION */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1">
            {navLinks.map(({ path, label }) => {
              const isActive =
                path === "/" ? pathname === path : pathname.startsWith(path);

              return (
                <Link
                  key={path}
                  href={path}
                  className={` px-4 py-1.5  rounded-xl text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-black/5 text-black"
                        : "text-zinc-500 hover:text-black hover:bg-black/5"
                    }
                  `}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 min-w-fit">
          {/* EMAIL */}
          {user?.email && (
            <span className="max-w-[180px]  truncate text-xs text-zinc-500">
              {user.email}
            </span>
          )}

          {/* GO PRO */}
          <Link href="/pricing">
            <button className="  h-8 px-4 rounded-xl text-xs font-medium bg-[#8B5CF6] text-white hover:bg-[#7C4DF0] transition-colors">
              {isPro ? "Pro Beta" : "Go Pro"}
            </button>
          </Link>

          {/* AUTH ACTION */}
          {user ? (
            <button
              onClick={onSignOut}
              className=" h-8 px-3 rounded-xl text-xs font-medium transition-colors hover:bg-red-50 hover:text-red-600"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/login">
              <button className=" h-8 px-3 rounded-xl text-xs font-medium hover:bg-black/5 transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>
      </motion.nav>
    </header>
  );
}

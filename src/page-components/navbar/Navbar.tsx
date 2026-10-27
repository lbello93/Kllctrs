"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { buildNavLinks } from "./navbar-data";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const updateUser = async (currentUser: User | null) => {
      if (!isMounted) return;

      setUser(currentUser);
      setIsPro(currentUser?.user_metadata?.subscription_tier === "pro_beta");

      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (isMounted) {
        setIsAdmin(
          profile?.role === "admin" ||
            currentUser.app_metadata?.role === "admin",
        );
      }
    };

    void supabase.auth.getUser().then(({ data }) => updateUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      window.setTimeout(() => void updateUser(currentUser), 0);

      if (_event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [router, supabase]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await fetch("/auth/logout", { method: "POST" });
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = buildNavLinks(user);
  const navLinkClass = (path: string) => {
    const isActive =
      path === "/" ? pathname === path : pathname.startsWith(path);

    return `rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-black/5 text-black"
        : "text-zinc-500 hover:bg-black/5 hover:text-black"
    }`;
  };

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-[9999] px-4 lg:top-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          aria-label="Main navigation"
          className={`mx-auto flex h-14 max-w-[1370px] items-center justify-between rounded-[14px] px-4 transition-colors duration-300 lg:h-[50px] lg:px-6 ${
            isScrolled
              ? "bg-white/90 shadow-xl backdrop-blur-md"
              : "bg-[#F2EFFE] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          }`}
        >
          <Link href="/" aria-label="KLLCTRS home" className="min-w-fit">
            <Image
              src="/Logo.png"
              alt="KLLCTRS"
              width={104}
              height={36}
              priority
              className="h-auto w-[76px] lg:w-20"
            />
          </Link>

          <div className="hidden flex-1 justify-center lg:flex">
            <div className="flex items-center gap-1">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  href={path}
                  aria-current={pathname === path ? "page" : undefined}
                  className={navLinkClass(path)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden min-w-fit items-center gap-3 lg:flex">
            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-xl border border-violet-200 px-3 py-2 text-xs font-semibold text-violet-800 transition hover:bg-violet-50"
              >
                Admin
              </Link>
            )}
            {user?.email && (
              <span className="max-w-[180px] truncate text-xs text-zinc-500">
                {user.email}
              </span>
            )}
            <Link
              href="/pricing"
              className="rounded-xl bg-[#8B5CF6] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#7C4DF0]"
            >
              {isPro ? "Pro Beta" : "Go Pro"}
            </Link>
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl px-3 py-2 text-xs font-medium transition-colors hover:bg-red-50 hover:text-red-600"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-xs font-medium transition-colors hover:bg-black/5"
              >
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-black/5 lg:hidden"
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </motion.nav>
      </header>

      <div
        className={`fixed inset-0 z-[10000] bg-black/50 transition-opacity lg:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        id="mobile-navigation-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
        className={`fixed inset-y-0 right-0 z-[10001] flex w-[85vw] max-w-[320px] flex-col bg-white transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-semibold">Menu</h2>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex flex-1 flex-col gap-2 overflow-y-auto p-4"
        >
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              aria-current={pathname === path ? "page" : undefined}
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                pathname === path
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                pathname.startsWith("/admin")
                  ? "bg-purple-100 text-purple-700"
                  : "text-violet-800 hover:bg-violet-50"
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t p-4">
          <Link
            href="/pricing"
            className="flex h-11 items-center justify-center rounded-xl bg-[#8B5CF6] font-medium text-white"
          >
            {isPro ? "Pro Beta" : "Go Pro"}
          </Link>
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="h-11 rounded-xl border font-medium"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="flex h-11 items-center justify-center rounded-xl border font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

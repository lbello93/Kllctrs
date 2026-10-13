"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

import { buildNavLinks } from "./navbar-data";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        setIsAdmin(profile?.role === "admin" || user.app_metadata?.role === "admin");
      } else {
        setIsAdmin(false);
      }
      setIsPro(user?.user_metadata?.subscription_tier === "pro_beta");
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      setIsAdmin(session?.user?.app_metadata?.role === "admin");
      if (currentUser) {
        window.setTimeout(async () => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", currentUser.id)
            .maybeSingle();
          setIsAdmin(profile?.role === "admin" || currentUser.app_metadata?.role === "admin");
        }, 0);
      } else {
        setIsAdmin(false);
      }

      setIsPro(currentUser?.user_metadata?.subscription_tier === "pro_beta");

      if (_event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = buildNavLinks(user);

  return (
    <>
      <div className="hidden lg:block">
        <DesktopNavbar
          pathname={pathname}
          navLinks={navLinks}
          user={user}
          isAdmin={isAdmin}
          isPro={isPro}
          isScrolled={isScrolled}
          onSignOut={handleSignOut}
        />
      </div>

      <div className="block lg:hidden">
        <MobileNavbar
          pathname={pathname}
          navLinks={navLinks}
          user={user}
          isPro={isPro}
          isAdmin={isAdmin}
          onSignOut={handleSignOut}
        />
      </div>
    </>
  );
}

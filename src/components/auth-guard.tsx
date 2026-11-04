"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

import { getUser } from "@/lib/auth";

/**
 * Client-side protected-route wrapper. Redirects to sign-in when there is no
 * session. For server components prefer the server guards in `@/lib/auth/admin`.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<"checking" | "authed">("checking");

  useEffect(() => {
    let active = true;
    getUser().then((user) => {
      if (!active) return;
      if (user) setState("authed");
      else router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    });
    return () => {
      active = false;
    };
  }, [router, pathname]);

  if (state === "checking") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-amethyst-400" />
      </div>
    );
  }
  return <>{children}</>;
}

export default AuthGuard;

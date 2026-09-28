"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

// Pages that should not show the footer.
const HIDE_FOOTER_ON = ["/profile", "/admin", "/login"];

export default function FooterGate() {
  const pathname = usePathname() ?? "";

  const hidden = HIDE_FOOTER_ON.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (hidden) return null;

  return <Footer />;
}

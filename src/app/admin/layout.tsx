import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/admin";
import AdminNav from "@/page-components/AdminPage/layout/AdminNav";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb]">
      {/* Ambient blurs */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute right-[15%] top-[10%] h-[500px] w-[500px] rounded-full bg-violet-200/40 blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] h-[400px] w-[400px] rounded-full bg-fuchsia-200/30 blur-[120px]" />
      </div>

      {/* Admin nav band under the main navbar */}
      <div className="fixed left-0 right-0 top-0 z-[39] border-b border-violet-100 bg-white shadow-sm">
        <div className="h-[80px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdminNav />
        </div>
      </div>

      {/* Page content */}
      <main className="relative z-10 pt-[140px]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
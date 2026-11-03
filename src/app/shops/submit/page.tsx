import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubmitShopForm from "@/page-components/shop-finder/SubmitShopForm";

export const metadata: Metadata = {
  title: "Submit a Shop",
  description: "Add a hobby shop to the KLLCTRS directory.",
};

export default async function SubmitShopPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/shops/submit");

  return (
    <main className="min-h-screen bg-[#faf9ff] pt-[96px]">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-5">
          <h1 className="text-2xl font-black tracking-tight text-[#1a0a3d]">Submit a Shop</h1>
          <p className="mt-1 text-sm text-[#4a3f6b]/60">
            Know a shop that isn&apos;t listed? Add it below — submissions are reviewed before going live.
          </p>
        </header>
        <SubmitShopForm />
      </div>
    </main>
  );
}

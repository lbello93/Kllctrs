import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SubmitShopForm from "@/components/shops/SubmitShopForm";

export const metadata = {
  title: "Submit a Card Shop | KLLCTRS",
  description:
    "List your card shop on KLLCTRS. Reach thousands of collectors near you.",
};

export default async function SubmitShopPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/shops/submit");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] pt-24">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 border-b border-violet-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1a0a3d]">
            Submit a Card Shop
          </h1>
          <p className="text-sm text-[#4a3f6b]/60 mt-1">
            Add your shop to our directory. Submissions are reviewed within 48
            hours.
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubmitShopForm />
      </div>
    </div>
  );
}

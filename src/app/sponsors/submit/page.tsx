import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SubmitSponsorForm from "../../../components/sponsors/SubmitSponsorForm";

export const metadata = {
  title: "Become a Sponsor | KLLCTRS",
  description:
    "Partner with KLLCTRS and reach thousands of collectors, dealers, and hobbyists.",
};

export default async function SubmitSponsorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/sponsors/submit");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] pt-24">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 border-b border-violet-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1a0a3d]">
            Become a Sponsor
          </h1>
          <p className="text-sm text-[#4a3f6b]/60 mt-1">
            Partner with KLLCTRS and get your brand in front of the hobby
            community.
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubmitSponsorForm />
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import SubmitSponsorForm from "@/components/sponsors/SubmitSponsorForm";

export const metadata = {
  title: "Become a Sponsor | KLLCTRS",
  description: "Get your brand in front of the hobby community.",
};

const PERKS = [
  "Your own profile",
  "Linked to shows",
  "Higher tiers rank higher",
];

export default async function SubmitSponsorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/sponsors/submit");

  return (
    <div className="min-h-screen bg-[#FEF9FF] px-4 pb-16 pt-28">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-4">
          <Link
            href="/sponsors"
            className="inline-flex items-center gap-1.5 font-inter text-[14px] leading-[17px] text-[#8B5CF6] transition hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            All sponsors
          </Link>

          <h1 className="font-unica-one text-[36px] leading-[40px] tracking-[-0.01em] text-[#151E3C] sm:text-[48px] sm:leading-[57px]">
            Become a Sponsor
          </h1>

          <ul className="flex flex-wrap gap-2">
            {PERKS.map((perk) => (
              <li
                key={perk}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E5DFFD] bg-white px-3 py-1 font-inter text-[12px] leading-[15px] text-[#151E3C]/70"
              >
                <Check className="h-3 w-3 text-[#8B5CF6]" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <SubmitSponsorForm />
      </div>
    </div>
  );
}

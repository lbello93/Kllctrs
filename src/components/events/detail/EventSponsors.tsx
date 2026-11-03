import Link from "next/link";

export interface EventSponsor {
  id: string;
  slug: string | null;
  name: string;
  logo_url: string | null;
  tagline: string | null;
  category: string | null;
}

export interface SponsorTierGroup {
  tier: "title" | "gold" | "silver" | "exhibitor";
  sponsors: EventSponsor[];
}

const TIER_META: Record<SponsorTierGroup["tier"], { label: string; accent: string }> = {
  title: { label: "Title Sponsor", accent: "#5f2eea" },
  gold: { label: "Gold Sponsors", accent: "#f0a000" },
  silver: { label: "Silver Sponsors", accent: "#9aa2b1" },
  exhibitor: { label: "Exhibitors", accent: "#2ea86f" },
};

function SponsorCard({ sponsor }: { sponsor: EventSponsor }) {
  const inner = (
    <div className="flex h-full items-center gap-3 rounded-xl border border-[#EEE9F7] bg-white p-3 transition-colors hover:border-[#B39EF9]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F4F1FC]">
        {sponsor.logo_url ? (
          // Logos are arbitrary external URLs not guaranteed to match image remotePatterns.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sponsor.logo_url} alt={sponsor.name} className="h-full w-full object-contain" />
        ) : (
          <span className="text-base font-black text-[#5f2eea]">{sponsor.name.charAt(0)}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-[#151E3C]">{sponsor.name}</p>
        {sponsor.tagline && <p className="truncate text-xs text-[#46506B]/60">{sponsor.tagline}</p>}
      </div>
    </div>
  );

  return sponsor.slug ? (
    <Link href={`/sponsors/${sponsor.slug}`} className="block">{inner}</Link>
  ) : (
    inner
  );
}

/**
 * Sponsor grid grouped by tier. Falls back to plain name chips (from the legacy
 * events.sponsors array) when the junction has no rows for this event.
 */
export default function EventSponsors({
  tiers,
  fallbackNames = [],
}: {
  tiers: SponsorTierGroup[];
  fallbackNames?: string[];
}) {
  const hasTiered = tiers.some((t) => t.sponsors.length > 0);

  if (!hasTiered && fallbackNames.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[#EEE9F7] bg-[#FAF8FF] p-5 sm:p-6">
      <h2 className="mb-4 font-space-grotesk text-lg font-bold tracking-tight text-[#151E3C]">Sponsors</h2>

      {hasTiered ? (
        <div className="space-y-5">
          {tiers
            .filter((t) => t.sponsors.length > 0)
            .map((group) => (
              <div key={group.tier}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: TIER_META[group.tier].accent }} />
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-[#46506B]/60">
                    {TIER_META[group.tier].label}
                  </h3>
                </div>
                <div
                  className={`grid gap-3 ${
                    group.tier === "title" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {group.sponsors.map((s) => (
                    <SponsorCard key={s.id} sponsor={s} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {fallbackNames.map((name) => (
            <span
              key={name}
              className="rounded-full border border-[#EEE9F7] bg-white px-3 py-1.5 text-sm text-[#46506B]"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

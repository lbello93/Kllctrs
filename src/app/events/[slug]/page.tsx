import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import Link from "next/link";

import EventHero from "@/components/events/detail/EventHero";
import EventQuickFacts from "@/components/events/detail/EventQuickFacts";
import EventAbout from "@/components/events/detail/EventAbout";
import EventReviews from "@/components/events/detail/EventReviews";
import EventReviewCTA from "@/components/events/detail/EventReviewCTA";
import RecommendedShows from "@/components/events/detail/RecommendedShows";

import type { Event, EventReview } from "@/types";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("name, city, state, date_start, venue_name")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Event Not Found | KLLCTRS" };

  const title = `${data.name} — ${data.city}, ${data.state} | KLLCTRS`;
  const description = `${data.name} on ${format(parseISO(data.date_start), "MMM d, yyyy")} at ${data.venue_name ?? data.city}. Find sports card shows on KLLCTRS.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !event) notFound();

  const typedEvent = event as Event;

  const [{ data: reviewsData }, { data: profile }] = await Promise.all([
    supabase
      .from("event_reviews")
      .select("*")
      .eq("event_id", typedEvent.id)
      .order("created_at", { ascending: false }),
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { data: null };
      return supabase
        .from("profiles")
        .select("saved_events")
        .eq("id", user.id)
        .single();
    })(),
  ]);

  const reviews = (reviewsData ?? []) as EventReview[];
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  const today = new Date().toISOString().split("T")[0];

  // Same state first, closest date first. If that comes up short, fill in with
  // the closest upcoming shows nationwide so the section isn't left half empty.
  const { data: sameStateRows } = await supabase
    .from("events")
    .select("*")
    .eq("state", typedEvent.state)
    .neq("id", typedEvent.id)
    .gte("date_start", today)
    .order("date_start", { ascending: true })
    .limit(3);

  let nearbyEvents = (sameStateRows ?? []) as Event[];

  if (nearbyEvents.length < 2) {
    const { data: fallbackRows } = await supabase
      .from("events")
      .select("*")
      .neq("id", typedEvent.id)
      .gte("date_start", today)
      .order("date_start", { ascending: true })
      .limit(4);

    const seen = new Set(nearbyEvents.map((e) => e.id));
    for (const row of (fallbackRows ?? []) as Event[]) {
      if (nearbyEvents.length >= 3) break;
      if (!seen.has(row.id)) {
        nearbyEvents.push(row);
        seen.add(row.id);
      }
    }
  }

  const dateRange =
    typedEvent.date_end && typedEvent.date_end !== typedEvent.date_start
      ? `${format(parseISO(typedEvent.date_start), "MMM d")} – ${format(parseISO(typedEvent.date_end), "MMM d, yyyy")}`
      : format(parseISO(typedEvent.date_start), "MMMM d, yyyy");

  const savedEventIds: string[] = profile?.saved_events ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: typedEvent.name,
    startDate: typedEvent.date_start,
    endDate: typedEvent.date_end ?? typedEvent.date_start,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: typedEvent.venue_name ?? `${typedEvent.city}, ${typedEvent.state}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: typedEvent.venue_address ?? "",
        addressLocality: typedEvent.city,
        addressRegion: typedEvent.state,
        postalCode: typedEvent.zip_code ?? "",
        addressCountry: "US",
      },
      ...(typedEvent.lat &&
        typedEvent.lng && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: typedEvent.lat,
            longitude: typedEvent.lng,
          },
        }),
    },
    url: typedEvent.website ?? undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        <EventHero
          event={typedEvent}
          isSaved={savedEventIds.includes(typedEvent.id)}
        />

        <div className="mx-auto flex max-w-[1241px] flex-col gap-8 px-6 py-8 md:gap-10 md:px-0 md:py-14">
          <Link
            href="/events"
            className="text-sm text-[#8B5CF6] hover:underline"
          >
            ← All shows
          </Link>

          <EventQuickFacts
            event={typedEvent}
            dateRange={dateRange}
            avgRating={avgRating}
            reviewCount={reviews.length}
          />

          <div className="flex flex-col gap-10 md:flex-row md:gap-[119px]">
            <EventAbout event={typedEvent} />
            <EventReviews reviews={reviews} />
          </div>

          <EventReviewCTA eventId={typedEvent.id} />

          <RecommendedShows
            events={nearbyEvents}
            savedEventIds={savedEventIds}
          />
        </div>
      </div>
    </>
  );
}

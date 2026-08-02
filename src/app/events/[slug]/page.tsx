import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
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

  if (!data) return { title: "Event Not Found | KLLCTBLS" };

  const title = `${data.name} — ${data.city}, ${data.state} | KLLCTBLS`;
  const description = `${data.name} on ${format(new Date(data.date_start), "MMM d, yyyy")} at ${data.venue_name ?? data.city}. Find sports card shows on KLLCTBLS.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .order("date_start", { ascending: false });

  if (error || !events || events.length === 0) notFound();

  const event = events[0] as Event;
  if (!event) notFound();

  const { data: reviewsData } = await supabase
    .from("event_reviews")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });

  const reviews = (reviewsData ?? []) as EventReview[];
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  const { data: nearbyData } = await supabase
    .from("events")
    .select("*")
    .eq("state", event.state)
    .neq("id", event.id)
    .gte("date_start", new Date().toISOString().split("T")[0])
    .order("date_start", { ascending: true })
    .limit(2);

  const nearbyEvents = (nearbyData ?? []) as Event[];

  const dateRange =
    event.date_end && event.date_end !== event.date_start
      ? `${format(new Date(event.date_start), "MMM d")} – ${format(new Date(event.date_end), "MMM d, yyyy")}`
      : format(new Date(event.date_start), "MMMM d, yyyy");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.date_start,
    endDate: event.date_end ?? event.date_start,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue_name ?? `${event.city}, ${event.state}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.venue_address ?? "",
        addressLocality: event.city,
        addressRegion: event.state,
        postalCode: event.zip_code ?? "",
        addressCountry: "US",
      },
      ...(event.lat &&
        event.lng && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: event.lat,
            longitude: event.lng,
          },
        }),
    },
    url: event.website ?? undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        <EventHero event={event} />

        <div className="mx-auto flex max-w-[1241px] flex-col gap-8 px-6 py-8 md:gap-10 md:px-0 md:py-14">
          <Link
            href="/events"
            className="text-sm text-[#8B5CF6] hover:underline"
          >
            ← All shows
          </Link>

          <EventQuickFacts
            event={event}
            dateRange={dateRange}
            avgRating={avgRating}
            reviewCount={reviews.length}
          />

          <div className="flex flex-col gap-10 md:flex-row md:gap-[119px]">
            <EventAbout event={event} />
            <EventReviews reviews={reviews} />
          </div>

          <EventReviewCTA eventId={event.id} />

          <RecommendedShows events={nearbyEvents} />
        </div>
      </div>
    </>
  );
}

import { redirect } from "next/navigation";

interface Params { params: Promise<{ slug: string }> }

export default async function LegacySlugRedirect({ params }: Params) {
  const { slug } = await params;
  redirect(`/maps/events/${slug}`);
}

import { redirect } from "next/navigation";

interface Params { params: Promise<{ slug: string }> }

export default async function LegacyBrandSlugRedirect({ params }: Params) {
  const { slug } = await params;
  redirect(`/brands/${slug}`);
}

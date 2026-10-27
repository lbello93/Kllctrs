import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SubmitEventForm from "@/components/events/SubmitEventForm";

export const metadata = {
  title: "Submit a Card Show | KLLCTRS",
  description:
    "List your sports card show on KLLCTRS. Reach thousands of collectors.",
};

export default async function SubmitEventPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/events/submit");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-medium mb-2">Submit a Card Show</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below. Submissions are reviewed by our team and
            typically approved within 48 hours.
          </p>
        </div>
        <SubmitEventForm />
      </div>
    </div>
  );
}

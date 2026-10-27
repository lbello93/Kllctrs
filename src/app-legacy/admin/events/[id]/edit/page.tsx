import SubmitEventForm from "@/components/events/SubmitEventForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  //----------------------------------------------------
  // Authentication
  //----------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  //----------------------------------------------------
  // Role
  //----------------------------------------------------

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    notFound();
  }

  //----------------------------------------------------
  // Load Event
  //----------------------------------------------------

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-medium">Review Imported Event</h1>

          <p className="text-muted-foreground">
            Review and edit before approval.
          </p>
        </div>

        <SubmitEventForm mode="edit" eventId={event.id} initialValues={event} />
      </div>
    </div>
  );
}

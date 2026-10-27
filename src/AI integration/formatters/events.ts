function formatDate(date: string) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface FormattedEvent {
  name: string;
  date_start: string;
  date_end?: string | null;
  city: string;
  state: string;
  venue_name?: string | null;
  website?: string | null;
  slug: string;
}

export function formatEvents(events: FormattedEvent[]) {
  if (!events || events.length === 0) {
    return `
No upcoming events were found.

Tell the user no matching events exist and suggest trying:
- another state
- another city
- broader keywords
`;
  }

  return `
Found ${events.length} upcoming sports card events.

${events
  .map(
    (event, index) => `
Event #${index + 1}

Name: ${event.name}

Date:
${formatDate(event.date_start)}
${event.date_end && event.date_end !== event.date_start
  ? `to ${formatDate(event.date_end)}`
  : ""}

Location:
${event.city}, ${event.state}

Venue:
${event.venue_name ?? "Unknown"}

Website:
${event.website ?? "Not provided"}

Slug:
${event.slug}
`
  )
  .join("\n")}
`;
}

export const EVENTS_EXAMPLES = `
==============================

User:
Are there any card shows in Dallas this weekend?

Assistant:

Use search_events.

After receiving results:

• Recommend the best event.
• Mention the venue.
• Mention the city.
• Mention the dates.
• Include the website if available.
• Explain briefly why it's a good choice.

Never invent events.

==============================

User:
What card shows are happening in Texas?

Assistant:

Use search_events.

If multiple events exist:

• Sort by date.
• Recommend the earliest upcoming event first.
• Mention city and venue.
• Mention if it is a multi-day event.

==============================

User:
Are there any shows near Austin?

Assistant:

Use search_events.

If no Austin events exist:

Suggest nearby cities such as:

• Dallas
• Houston
• San Antonio

Never invent events.

==============================

User:
I'm visiting California next month.
Which card show should I attend?

Assistant:

Use search_events.

Recommend the most relevant event.

Explain why it stands out.

Mention:

• dates
• city
• venue
• website

==============================

User:
Which event has the most vendor tables?

Assistant:

Use search_events.

If vendor table counts are available:

Compare them.

Recommend the largest event.

If vendor counts are unavailable:

Say so honestly.

==============================

User:
Show me all events this month.

Assistant:

Use search_events.

Present the events in chronological order.

Do not simply dump data.

Create a readable list.

==============================

User:
Are there any Pokémon conventions in Florida?

Assistant:

Use search_events.

Search using:

State = FL

Keyword = Pokemon

Recommend the best matching events.

==============================

User:
Tell me about the Dallas Card Show.

Assistant:

Use search_events.

Summarize:

• location
• dates
• venue
• website

Do not invent additional facts.

==============================

User:
What is the next sports card show?

Assistant:

Use search_events.

Recommend the earliest upcoming event.

==============================

User:
I'm looking for a family-friendly card show.

Assistant:

Use search_events.

If family information isn't available,

say so honestly.

Recommend the event that appears largest or most established.
`;
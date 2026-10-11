import { extractNextData } from "./extract-next-data";
import { parseEvent } from "./parse-event";

export class SportsCollectorDigestScrapper {
  async scrape() {
    const response = await fetch(
      "https://sportscollectorsdigest.com/collecting-101/show-calendar"
    );

    const html = await response.text();

    const events = parseSportsCalendar(html);

    return {
      success: true,
      total: events.length,
      events,
    };
  }
}


export interface SportsCollectorRawEvent {
  state: string;
  raw: string;
}


function walk(
    node: unknown,
    paragraphs: string[]
) {

    //-----------------------------------------
    // Array
    //-----------------------------------------

    if (Array.isArray(node)) {

        for (const item of node) {
            walk(item, paragraphs);
        }

        return;
    }

    //-----------------------------------------
    // Object
    //-----------------------------------------

    if (
        typeof node === "object" &&
        node !== null
    ) {

        const obj =
            node as Record<string, unknown>;

        //-------------------------------------
        // Gutenberg Block
        //-------------------------------------

        if (
            obj.name === "core/paragraph" &&
            typeof obj.attributesJSON === "string"
        ) {

            try {

                const attribute =
                    JSON.parse(obj.attributesJSON);

                if (
                    attribute.content
                ) {

                    paragraphs.push(
                        attribute.content
                    );

                }

            }

            catch {}

        }

        //-------------------------------------
        // Continue Searching
        //-------------------------------------

        for (const value of Object.values(obj)) {

            walk(
                value,
                paragraphs
            );

        }

    }

}

export function extractParagraphs(
    nextData: unknown
): string[] {

    const paragraphs: string[] = [];

    walk(
        nextData,
        paragraphs
    );

    return paragraphs;

}

function isStateHeading(
    text: string
): boolean {

    return /^[A-Z ]+$/.test(
        text.trim()
    );

}

export interface SportsCollectorRawEvent {
    month: string;
    day: string;
    state: string;
    city: string;
    raw: string;
}

export function buildRawEvents(
    paragraphs: string[]
): SportsCollectorRawEvent[] {

    const events: SportsCollectorRawEvent[] = [];

    const regex =
/^(January|February|March|April|May|June|July|August|September|Sept|Sep|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Oct|Nov|Dec)\s+([\d–-]+),?\s+([A-Z]{2}),?\s*(.+?)\./i;
    for (const paragraph of paragraphs) {

        const clean = paragraph
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .trim();

        const match = clean.match(regex);

        if (!match) {

    continue;
}
        events.push({

            month: match[1],

            day: match[2],

            state: match[3],

            city: match[4].trim(),

            raw: clean

        });

    }

    return events;

}



export function parseSportsCalendar(
    html: string
) {

    //---------------------------------------
    // Extract Next Data
    //---------------------------------------

    const nextData =
        extractNextData(html);

    //---------------------------------------
    // Extract Paragraphs
    //---------------------------------------

    const paragraphs =
        extractParagraphs(nextData);


    //---------------------------------------
    // Build Raw Events
    //---------------------------------------

    const rawEvents =
        buildRawEvents(paragraphs);

    //---------------------------------------
    // Parse Events
    //---------------------------------------

    const parsedEvents = rawEvents
    .map((event) => {

        const parsed = parseEvent(event);
        return parsed;
    })
    .filter(
        (
            event
        ): event is NonNullable<typeof event> =>
            event !== null
    );
    

    //---------------------------------------

    return parsedEvents;

}

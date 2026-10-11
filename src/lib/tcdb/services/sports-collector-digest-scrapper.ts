import { parseSportsCalendar } from "../parser/sports-calendar-parser";
import { buildSportsDatabaseEvents }
from "../pipeline/sports-database-builder";
export class SportsCollectorDigestScraper {

    private readonly url =
        "https://sportscollectorsdigest.com/collecting-101/show-calendar";

    async scrape() {

        const response = await fetch(this.url,{
            headers:{
                "User-Agent":"Mozilla/5.0"
            },
            signal: AbortSignal.timeout(20_000),
        });

        if (!response.ok) {
            throw new Error(`Sports Collector Digest returned ${response.status}.`);
        }

        const html = await response.text();

        const parsedEvents =
    parseSportsCalendar(html);

const databaseEvents =
    buildSportsDatabaseEvents(parsedEvents);

console.log("Database Events:", databaseEvents.length);

return {

    success: true,

    total: databaseEvents.length,

    events: databaseEvents

};
}

}

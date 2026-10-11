
export function parseSportsCalendar(_html: string) {
    return [];
}

export function extractNextData(html: string): unknown {

    const match = html.match(
        /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
    );

    if (!match) {
        throw new Error("__NEXT_DATA__ not found");
    }

    return JSON.parse(match[1]);

}

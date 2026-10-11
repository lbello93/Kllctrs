export interface ParsedHeader {
    month: string;
    day: string;
    state: string;
    city: string;
    remaining: string;
}

const MONTHS =
"(January|February|March|April|May|June|July|August|September|Sept|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)";

const STATES = [
    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
    "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
    "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
    "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
    "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

export function parseHeader(raw: string): ParsedHeader | null {

    //----------------------------------------
    // Remove HTML tags
    //----------------------------------------

    raw = raw
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();

    //----------------------------------------
    // Month
    //----------------------------------------

    const monthMatch = raw.match(
        new RegExp(`^${MONTHS}`, "i")
    );

    if (!monthMatch)
        return null;

    const month = monthMatch[1];

    //----------------------------------------
    // Remove month
    //----------------------------------------

    const remaining = raw.substring(month.length).trim();

    //----------------------------------------
    // Find State
    //----------------------------------------

    let state = "";

    let stateIndex = -1;

    for (const code of STATES) {

        const regex = new RegExp(`\\b${code}\\b`);

        const match = regex.exec(remaining);

        if (match) {

            state = code;

            stateIndex = match.index;

            break;
        }

    }

    if (!state)
        return null;

    //----------------------------------------
    // Left Side
    //----------------------------------------

    const beforeState =
        remaining
            .substring(0, stateIndex)
            .trim()
            .replace(/,$/, "");

    //----------------------------------------
    // Right Side
    //----------------------------------------

    const afterState =
        remaining
            .substring(stateIndex + state.length)
            .trim()
            .replace(/^,/, "")
            .trim();

    //----------------------------------------
    // Extract Date
    //----------------------------------------

    const dayMatch =
        beforeState.match(
            /^[^A-Za-z]+/
        );

    if (!dayMatch)
        return null;

    const day =
        dayMatch[0]
            .replace(/,$/, "")
            .trim();

    //----------------------------------------
    // City
    //----------------------------------------

    const city =
        beforeState
            .substring(day.length)
            .trim()
            .replace(/^,/, "")
            .trim();

    //----------------------------------------
    // Remaining
    //----------------------------------------

    const firstDot =
        afterState.indexOf(".");

    if (firstDot === -1)
        return null;

    return {

        month,

        day,

        state,

        city,

        remaining:
            afterState
                .substring(firstDot + 1)
                .trim()

    };

}

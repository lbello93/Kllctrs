export const SHOPS_EXAMPLES = `
==============================

User:
Where can I buy sports cards in Dallas?

Assistant:

Use search_shops.

Recommend the best matching stores.

Mention:

• specialty
• address
• website
• phone number

==============================

User:
Are there any Pokémon card shops in Houston?

Assistant:

Use search_shops.

Use specialty = pokemon.

Recommend the best shops.

==============================

User:
Which shop has the best selection?

Assistant:

Use search_shops.

If no inventory information exists,

never guess.

Instead recommend established shops.

==============================

User:
Where can I sell my cards?

Assistant:

Use search_shops.

Recommend shops that buy collections if available.

Otherwise explain that availability varies by store and users should contact them directly.

==============================

User:
I'm visiting New York.

Where should I buy cards?

Assistant:

Use search_shops.

Recommend 3 stores.

Explain briefly why each may be worth visiting.

==============================

User:
Show me shops near Miami.

Assistant:

Use search_shops.

Sort naturally.

Mention:

• city
• specialty
• website

==============================

User:
Which stores sell both sports cards and Pokémon?

Assistant:

Use search_shops.

Use specialty = both.

Recommend matching stores.

==============================

User:
Is there a card shop near me?

Assistant:

Use search_shops.

If the user's city is unknown,

ask which city or state they are in before searching.

==============================

User:
Tell me about ABC Card Shop.

Assistant:

Use search_shops.

Summarize:

• location
• specialty
• website
• phone number

Do not invent information.

==============================

User:
What's the best card shop in Texas?

Assistant:

Use search_shops.

Recommend several well-matched shops.

Explain why each may appeal to collectors.

Never claim one is objectively the best.
`;
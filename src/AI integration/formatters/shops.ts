interface FormattedShop {
  name: string;
  city: string;
  state: string;
  specialty?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
}

export function formatShops(shops: FormattedShop[]) {
  if (!shops || shops.length === 0) {
    return `
No card shops were found.

Tell the user no matching shops exist and suggest searching another city.
`;
  }

  return `
Found ${shops.length} card shops.

${shops
  .map(
    (shop, index) => `
Shop #${index + 1}

Name:
${shop.name}

Location:
${shop.city}, ${shop.state}

Specialty:
${shop.specialty ?? "General"}

Address:
${shop.address ?? "Unknown"}

Phone:
${shop.phone ?? "Not available"}

Website:
${shop.website ?? "Not available"}
`
  )
  .join("\n")}
`;
}

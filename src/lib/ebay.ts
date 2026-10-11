const APP_ID = process.env.EBAY_APP_ID!
const CERT_ID = process.env.EBAY_CERT_ID!

let cachedToken: { token: string; expiresAt: number } | null = null

async function getEbayToken(): Promise<string> {
  // Reuse cached token if still valid (with 60s buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token
  }

  const credentials = Buffer.from(`${APP_ID}:${CERT_ID}`).toString('base64')

  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`eBay OAuth failed: ${res.status} ${err}`)
  }

  const data = await res.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  }
  return cachedToken.token
}

interface EbayItem {
  title: string
  price: { value: string; currency: string }
  itemWebUrl: string
  image?: { imageUrl: string }
  condition?: string
  itemEndDate?: string
}

export async function searchEbayListings(query: string, limit = 10): Promise<EbayItem[]> {
  const token = await getEbayToken()

  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    filter: 'buyingOptions:{FIXED_PRICE|AUCTION},itemLocationCountry:US',
    sort: 'newlyListed',
  })

  const res = await fetch(
    `https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
      },
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`eBay search failed: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.itemSummaries ?? []
}

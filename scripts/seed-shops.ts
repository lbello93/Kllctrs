/**
 * One-time seeding script — fetches card shops from Google Places API
 * and inserts them into Supabase with status 'approved'.
 *
 * Run: npx tsx scripts/seed-shops.ts
 */

import { createClient } from '@supabase/supabase-js'
import slugify from 'slugify'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLACES_KEY = process.env.GOOGLE_PLACES_KEY!

// Major US metros to search — expandable
const SEARCH_TARGETS = [
  'New York NY', 'Los Angeles CA', 'Chicago IL', 'Houston TX', 'Phoenix AZ',
  'Philadelphia PA', 'San Antonio TX', 'San Diego CA', 'Dallas TX', 'Austin TX',
  'Jacksonville FL', 'Fort Worth TX', 'Columbus OH', 'Charlotte NC',
  'San Francisco CA', 'Indianapolis IN', 'Seattle WA', 'Denver CO',
  'Boston MA', 'Nashville TN', 'Detroit MI', 'Las Vegas NV',
  'Miami FL', 'Atlanta GA', 'Minneapolis MN',
]

// Search queries to run for each metro
const QUERIES = [
  'sports card shop',
  'pokemon card store',
  'trading card store',
]

interface PlaceResult {
  id: string
  displayName: { text: string }
  formattedAddress?: string
  location: { latitude: number; longitude: number }
  internationalPhoneNumber?: string
  websiteUri?: string
  addressComponents?: { types: string[]; longText: string; shortText: string }[]
}

async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.internationalPhoneNumber,places.websiteUri,places.addressComponents',
    },
    body: JSON.stringify({
      textQuery: query,
      regionCode: 'US',
      maxResultCount: 10,
    }),
  })

  if (!res.ok) {
    console.error(`  ✗ ${query} — ${res.status} ${res.statusText}`)
    return []
  }

  const data = await res.json()
  return data.places ?? []
}

function inferSpecialty(name: string): 'sports' | 'pokemon' | 'both' {
  const n = name.toLowerCase()
  const hasPokemon = /pokemon|pok[éeè]mon|tcg/.test(n)
  const hasSports = /sport|baseball|basketball|football|hockey/.test(n)
  if (hasPokemon && !hasSports) return 'pokemon'
  if (hasSports && !hasPokemon) return 'sports'
  return 'both'
}
function extractAddressParts(place: PlaceResult): { state: string; city: string; zip: string } {
  let state = ''
  let city = ''
  let zip = ''
  for (const comp of place.addressComponents ?? []) {
    const types = comp.types ?? []
    if (types.includes('administrative_area_level_1')) state = comp.shortText ?? ''
    if (types.includes('locality')) city = comp.longText ?? ''
    if (types.includes('postal_code')) zip = comp.longText ?? ''
  }
  return { state, city, zip }
}

async function main() {

  const allPlaces = new Map<string, PlaceResult>()

  for (const metro of SEARCH_TARGETS) {
    for (const q of QUERIES) {
      const query = `${q} ${metro}`
      const results = await searchPlaces(query)
      for (const p of results) {
        if (!allPlaces.has(p.id)) allPlaces.set(p.id, p)
      }
      await new Promise(r => setTimeout(r, 200)) // rate limit
    }
  }


  let inserted = 0
  let skipped = 0
  let failed = 0

  for (const place of allPlaces.values()) {
    const { state, city, zip } = extractAddressParts(place)
    if (!state || !city) {
      skipped++
      continue
    }

    const name = place.displayName.text
    const slug = slugify(`${name}-${city}-${state}`, { lower: true, strict: true }).slice(0, 100)

    const row = {
      name,
      slug,
      address: place.formattedAddress ?? null,
      city,
      state,
      zip_code: zip || null,
      lat: place.location.latitude,
      lng: place.location.longitude,
      phone: place.internationalPhoneNumber ?? null,
      website: place.websiteUri ?? null,
      google_place_id: place.id,
      specialty: inferSpecialty(name),
      status: 'approved',
      source: 'places',
    }

    const { error } = await supabase
      .from('shops')
      .upsert(row, { onConflict: 'google_place_id' })

    if (error) {
      console.error(`  ✗ ${name} — ${error.message}`)
      failed++
    } else {
      inserted++
    }
  }

}

main().catch(e => {
  console.error('Fatal:', e)
  process.exit(1)
})

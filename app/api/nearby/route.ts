import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type NearbyType = 'hotel' | 'landmark' | 'hospital' | 'police'

function detectType(tags: Record<string, string>): NearbyType | null {
  if (tags.amenity === 'hospital' || tags.amenity === 'clinic') return 'hospital'
  if (tags.amenity === 'police') return 'police'
  if (tags.tourism === 'hotel' || tags.tourism === 'hostel' || tags.tourism === 'guest_house') return 'hotel'
  if (
    tags.tourism === 'attraction' ||
    tags.tourism === 'museum' ||
    tags.tourism === 'viewpoint' ||
    tags.historic ||
    tags.leisure === 'park'
  ) return 'landmark'
  return null
}

export async function GET(request: NextRequest) {
  const lat = Number(request.nextUrl.searchParams.get('lat'))
  const lng = Number(request.nextUrl.searchParams.get('lng'))
  const radius = Math.min(Math.max(Number(request.nextUrl.searchParams.get('radius')) || 4000, 500), 8000)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: 'Invalid coordinates.' }, { status: 400 })
  }

  const query = `[out:json][timeout:20];(
    nwr(around:${radius},${lat},${lng})[amenity~"^(hospital|clinic|police)$"];
    nwr(around:${radius},${lat},${lng})[tourism~"^(hotel|hostel|guest_house|attraction|museum|viewpoint)$"];
    nwr(around:${radius},${lat},${lng})[historic][name];
    nwr(around:${radius},${lat},${lng})[leisure=park][name];
  );out center tags;`

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent': 'SafeRoute college prototype/1.0',
      },
      body: new URLSearchParams({ data: query }),
      cache: 'no-store',
    })

    if (!response.ok) throw new Error(`Overpass returned ${response.status}`)
    const data = (await response.json()) as { elements?: Array<Record<string, any>> }

    const seen = new Set<string>()
    const places = (data.elements || [])
      .map((element) => {
        const tags = (element.tags || {}) as Record<string, string>
        const type = detectType(tags)
        const itemLat = Number(element.lat ?? element.center?.lat)
        const itemLng = Number(element.lon ?? element.center?.lon)
        const name = tags.name || tags['name:en']
        if (!type || !name || !Number.isFinite(itemLat) || !Number.isFinite(itemLng)) return null

        const key = `${type}:${name.toLowerCase()}:${itemLat.toFixed(4)}:${itemLng.toFixed(4)}`
        if (seen.has(key)) return null
        seen.add(key)

        return {
          id: `osm-${element.type}-${element.id}`,
          name,
          type,
          lat: itemLat,
          lng: itemLng,
          address: [tags['addr:suburb'], tags['addr:city'], tags['addr:state']].filter(Boolean).join(', '),
        }
      })
      .filter(Boolean)
      .slice(0, 80)

    return NextResponse.json({ places })
  } catch (error) {
    console.error('Nearby places failed:', error)
    return NextResponse.json({ error: 'Nearby places are temporarily unavailable.' }, { status: 502 })
  }
}

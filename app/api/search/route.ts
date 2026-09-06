import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', q)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '6')

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SafeRoute college prototype/1.0',
        'Accept-Language': 'en',
      },
      cache: 'no-store',
    })

    if (!response.ok) throw new Error(`Nominatim returned ${response.status}`)

    const raw = (await response.json()) as Array<Record<string, any>>
    const results = raw.map((item) => ({
      id: String(item.place_id),
      name: item.name || item.display_name?.split(',')[0] || q,
      displayName: item.display_name || q,
      lat: Number(item.lat),
      lng: Number(item.lon),
      kind: item.type || item.category || 'place',
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Location search failed:', error)
    return NextResponse.json({ error: 'Location search is temporarily unavailable.' }, { status: 502 })
  }
}

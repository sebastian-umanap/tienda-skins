// app/api/proxy/route.ts
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get('url')
  if (!imageUrl) {
    return new Response('Missing URL parameter', { status: 400 })
  }

  try {
    const res = await fetch(imageUrl)
    const contentType = res.headers.get('content-type') || 'image/png'
    const buffer = await res.arrayBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400'
      }
    })
  } catch (err) {
    return new Response('Error fetching image', { status: 500 })
  }
}

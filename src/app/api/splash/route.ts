// app/api/splash/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json')
  const data = await res.json()
  return NextResponse.json(data)
}

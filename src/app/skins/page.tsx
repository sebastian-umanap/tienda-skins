'use client'
import { useEffect, useState } from 'react'

type DiscountedSkin = {
  name: string
  price: number
  new_price: number
  discount: number
  startDate: string
  endDate: string
  itemId: number
}

type SplashSkin = {
  id: number
  splashPath: string
}

export default function SkinsPage() {
  const [skins, setSkins] = useState<DiscountedSkin[]>([])
  const [splashMap, setSplashMap] = useState<Record<number, string>>({})

  // 1. Obtener skins en descuento
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/sebastian-umanap/json-data/refs/heads/main/CHAMPION_SKIN_FILTERED.json")
      .then(res => res.json())
      .then(setSkins)
  }, [])

  // 2. Obtener splashPaths desde nuestra API interna
  useEffect(() => {
    fetch("/api/splash")
      .then(res => res.json())
      .then((data: Record<number, SplashSkin>) => {
        const map: Record<number, string> = {}
        Object.values(data).forEach((skin) => {
          if (skin.splashPath) {
            const url = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default" +
              skin.splashPath.toLowerCase().replace("/lol-game-data/assets/assets", "/assets")
            map[skin.id] = url
          }
        })
        setSplashMap(map)
      })
  }, [])

  return (
    <div className="p-6 bg-gray-950 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Skins en Oferta</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {skins.map((skin, index) => {
          const imageUrl = splashMap[skin.itemId]
          return (
            <div
              key={index}
              className="bg-gray-900 rounded-xl p-4 shadow-lg hover:scale-105 transition"
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={skin.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-semibold text-cyan-400">{skin.name}</h2>
              <p><b>Precio original:</b> {skin.price}</p>
              <p><b>Precio con descuento:</b> {skin.new_price}</p>
              <p><b>Descuento:</b> {(skin.discount * 100).toFixed(0)}%</p>
              <p><b>Desde:</b> {new Date(skin.startDate).toLocaleDateString()}</p>
              <p><b>Hasta:</b> {new Date(skin.endDate).toLocaleDateString()}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

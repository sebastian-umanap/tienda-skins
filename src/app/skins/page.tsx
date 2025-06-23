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
  tilePath: string
}

export default function SkinsPage() {
  const [skins, setSkins] = useState<DiscountedSkin[]>([])
  const [tileMap, setTileMap] = useState<Record<number, string>>({})

  // ✅ Obtener JSON desde GitHub API en tiempo real
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("https://api.github.com/repos/sebastian-umanap/json-data/contents/CHAMPION_SKIN_FILTERED.json", {
        cache: "no-store"
      })
      const data = await res.json()

      // ✅ Decodificación correcta UTF-8
      const base64 = data.content.replace(/\n/g, '')
      const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
      const decoded = new TextDecoder("utf-8").decode(binary)
      const parsed = JSON.parse(decoded)

      setSkins(parsed)
    } catch (err) {
      console.error("❌ Error cargando skins desde GitHub API:", err)
    }
  }

  fetchData()
}, [])

  useEffect(() => {
    fetch("/api/splash")
      .then(res => res.json())
      .then((data: Record<number, SplashSkin>) => {
        const map: Record<number, string> = {}
        Object.values(data).forEach((skin) => {
          if (skin.tilePath) {
            const url = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default" +
              skin.tilePath.toLowerCase().replace("/lol-game-data/assets/assets", "/assets")
            map[skin.id] = url
          }
        })
        setTileMap(map)
      })
  }, [])

  return (
    <div className="bg-gray-950 text-white min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Skins en Oferta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr_150px] gap-4">
        {/* Anuncio lateral izquierdo */}
        <div className="hidden lg:block bg-gray-800 text-center p-4 rounded shadow">
          <p className="text-sm text-gray-400">Anuncio Izquierdo</p>
        </div>

        {/* Grid de skins */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {skins.map((skin, index) => {
            const imageUrl = tileMap[skin.itemId]
            const discount = (skin.discount * 100).toFixed(0)
            return (
              <div
                key={index}
                className="relative rounded overflow-hidden shadow-lg group"
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={skin.name}
                    className="w-full h-full object-cover group-hover:brightness-75 transition duration-300"
                  />
                )}

                <div className="absolute top-1 left-1 bg-red-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  -{discount}%
                </div>

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent px-3 py-4">
                  <h2 className="text-sm font-semibold text-yellow-300 leading-tight drop-shadow">
                    {skin.name}
                  </h2>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1">
                    {skin.new_price}
                    <img
                      src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/currencies/images/riot-points-icon.svg"
                      alt="RP"
                      className="w-3 h-3 inline"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Anuncio lateral derecho */}
        <div className="hidden lg:block bg-gray-800 text-center p-4 rounded shadow">
          <p className="text-sm text-gray-400">Anuncio Derecho</p>
        </div>
      </div>

      {/* Anuncio inferior */}
      <div className="bg-gray-800 mt-6 text-center p-4 rounded shadow">
        <p className="text-sm text-gray-400">Anuncio Inferior</p>
      </div>
    </div>
  )
}

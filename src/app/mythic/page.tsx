'use client'
import { useEffect, useState } from 'react'

type Item = {
  name: string
  id: string // contentId
  price: number | null
}

type MythicSection = {
  name: string
  description: string
  startDate: string
  endDate: string
  items: Item[]
}

type SplashSkin = {
  id: number
  contentId: string
  tilePath: string
  isBase: boolean
}

export default function MythicPage() {
  const [sections, setSections] = useState<MythicSection[]>([])
  const [skinMap, setSkinMap] = useState<Record<string, string>>({})
  const [chromaMap, setChromaMap] = useState<Record<string, string>>({})

  // Cargar tienda mítica
useEffect(() => {
  const fetchData = () => {
    fetch(`https://raw.githubusercontent.com/sebastian-umanap/json-data/refs/heads/main/MYTHIC_SHOP_FILTERED.json?ts=${Date.now()}`, {
      cache: "no-store"
    })
      .then(res => res.json())
      .then(setSections)
      .catch(err => console.error("❌ Error cargando tienda mítica:", err))
  }

  fetchData() // Carga inicial
  const interval = setInterval(fetchData, 30000) // Actualiza cada 30s

  return () => clearInterval(interval) // Limpia al desmontar
}, [])


  // Cargar skins y cromas
  useEffect(() => {
    fetch("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json")
      .then(res => res.json())
      .then((data: Record<string, SplashSkin>) => {
        const skins: Record<string, string> = {}
        const chromas: Record<string, string> = {}

        Object.values(data).forEach((skin) => {
          if (!skin.contentId) return

          // Skins
          if (skin.tilePath) {
            const url = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default" +
              skin.tilePath.toLowerCase().replace("/lol-game-data/assets/assets", "/assets")
            skins[skin.contentId] = url
          }

          // Cromas → imagen fija (vía proxy para evitar CORS)
          if (!skin.isBase) {
            const fixed = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-chroma-images/1/1013.png"
            chromas[skin.contentId] = `/api/proxy?url=${encodeURIComponent(fixed)}`
          }
        })

        setSkinMap(skins)
        setChromaMap(chromas)
      })
      .catch(err => console.error("❌ Error cargando skins/cromas:", err))
  }, [])

  return (
    <div className="p-6 bg-gray-950 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Tienda Mítica</h1>

      {sections.map((section, index) => (
        <div key={index} className="mb-10">
          <h2 className="text-2xl text-pink-400 font-semibold mb-3 border-b border-pink-500 pb-1">
            {section.description || section.name}
          </h2>
          <p className="text-sm text-gray-400 mb-3">
            Disponible del {new Date(section.startDate).toLocaleDateString()} al {new Date(section.endDate).toLocaleDateString()}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {section.items.map((item, i) => {
              const sectionName = section.name.toLowerCase()
              let imageUrl: string | null = null

              if (sectionName.includes("biweekly") || sectionName.includes("bisemanal")) {
                imageUrl = skinMap[item.id]
              } else if (sectionName.includes("weekly") || sectionName.includes("semanal")) {
                imageUrl = chromaMap[item.id]
              }

              console.log(`[${section.name}] ${item.name} (${item.id}) → ${imageUrl}`)

              return (
                <div key={i} className="relative rounded overflow-hidden shadow-lg group">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:brightness-75 transition duration-300"
                    />
                  ) : (
                    <div className="bg-gray-800 w-full h-full flex items-center justify-center p-6 text-gray-300 text-center">
                      {item.name}
                    </div>
                  )}

                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent px-3 py-4">
                    <h3 className="text-sm font-semibold text-fuchsia-300 leading-tight drop-shadow">
                      {item.name}
                    </h3>
                    {item.price !== null ? (
                      <div className="flex items-center gap-1 text-purple-300 text-xs mt-1">
                        {item.price}
                        <img
                          src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/currencies/images/mythic-essence-icon.svg"
                          alt="Mythic Essence"
                          className="w-4 h-4 inline"
                        />
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 mt-1 italic">Gratis</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'

type Item = {
  name: string
  id: string
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
}

export default function MythicPage() {
  const [sections, setSections] = useState<MythicSection[]>([])
  const [contentMap, setContentMap] = useState<Record<string, string>>({})

  // Cargar datos de la tienda mítica
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/sebastian-umanap/json-data/refs/heads/main/MYTHIC_SHOP_FILTERED.json")
      .then(res => res.json())
      .then(setSections)
  }, [])

  // Cargar imágenes por contentId (solo para skins bisemanales)
  useEffect(() => {
    fetch("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json")
      .then(res => res.json())
      .then((data: Record<string, SplashSkin>) => {
        const map: Record<string, string> = {}
        Object.values(data).forEach((skin) => {
          if (skin.contentId && skin.tilePath) {
            const url = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default" +
              skin.tilePath.toLowerCase().replace("/lol-game-data/assets/assets", "/assets")
            map[skin.contentId] = url
          }
        })
        setContentMap(map)
      })
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
              const isSkinSection = section.name.toLowerCase().includes("biweekly") || section.name.toLowerCase().includes("bisemanal")
              const imageUrl = isSkinSection ? contentMap[item.id] : null

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
                    {item.price !== null && (
                      <div className="flex items-center gap-1 text-purple-300 text-xs mt-1">
                        {item.price}
                        <img
                          src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/currencies/images/mythic-essence-icon.svg"
                          alt="Mythic Essence"
                          className="w-4 h-4 inline"
                        />
                      </div>
                    )}
                    {item.price === null && (
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

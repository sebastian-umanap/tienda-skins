'use client'
import { useEffect, useState } from 'react'

// === Tipos ===
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

type Chroma = {
  id: number
  contentId: string
  tilePath: string
  name: string
}

type SplashSkin = {
  id: number
  contentId: string
  tilePath: string
  isBase: boolean
  chromas?: Chroma[]
}

type Icon = {
  id: number
  contentId: string
  name: string
  description: string
}

// === Componente principal ===
export default function MythicPage() {
  const [sections, setSections] = useState<MythicSection[]>([])
  const [skinMap, setSkinMap] = useState<Record<string, string>>({})
  const [chromaMap, setChromaMap] = useState<Record<string, string>>({})
  const [iconMap, setIconMap] = useState<Record<string, string>>({})

  // === Cargar tienda mítica desde GitHub ===
  const fetchData = async () => {
    try {
      const res = await fetch("https://api.github.com/repos/sebastian-umanap/json-data/contents/MYTHIC_SHOP_FILTERED.json", {
        cache: "no-store"
      })
      const data = await res.json()
      const decoded = atob(data.content.replace(/\n/g, ''))
      const parsed = JSON.parse(decoded)
      setSections(parsed)
    } catch (err) {
      console.error("❌ Error cargando tienda mítica desde GitHub API:", err)
    }
  }

  // === Cargar datos al inicio y cada 30s ===
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // === Cargar imágenes de skins y cromas ===
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
          // Cromas
          if (skin.chromas) {
            skin.chromas.forEach((chroma: Chroma) => {
              if (chroma.contentId && chroma.tilePath) {
                const cleanedPath = chroma.tilePath.replace(/^\/lol-game-data\/assets/i, '')
                const chromaUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default" + cleanedPath
                chromas[chroma.contentId] = chromaUrl
              }
            })
          }
        })

        setSkinMap(skins)
        setChromaMap(chromas)
      })
      .catch(err => console.error("❌ Error cargando skins/cromas:", err))
  }, [])

  // === Cargar íconos de invocador ===
// === Cargar íconos de invocador cuando sections esté listo ===
useEffect(() => {
  if (sections.length === 0) return

  // 1. Obtener todos los contentIds usados en la tienda (que podrían ser íconos)
  const iconContentIds = new Set<string>()
  sections.forEach(section => {
    section.items.forEach(item => {
      iconContentIds.add(item.id)
    })
  })

  console.log("🎯 Buscando íconos para IDs:", Array.from(iconContentIds))

  // 2. Cargar el JSON de íconos y filtrar solo los que están en la tienda
  fetch("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/es_mx/v1/summoner-icons.json")
    .then(res => res.json())
    .then((data: Icon[]) => {
      const icons: Record<string, string> = {}

      data.forEach(icon => {
        if (iconContentIds.has(icon.contentId)) {
          const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${icon.id}.jpg`
          icons[icon.contentId] = url
          console.log(`✅ Icono mapeado: ${icon.contentId} → ${url}`)
        }
      })

      setIconMap(icons)
    })
    .catch(err => console.error("❌ Error cargando íconos:", err))
}, [sections])





  // === Funciones de detección por tipo ===
  function isChromaSection(name: string) {
    return name.toLowerCase().includes("weekly") || name.toLowerCase().includes("semanal")
  }

  function isSkinSection(name: string) {
    return name.toLowerCase().includes("biweekly") || name.toLowerCase().includes("bisemanal")
  }

  function isIconSection(name: string) {
    return name.toLowerCase().includes("icon")
  }

 // === Render ===
return (
  <div className="p-6 bg-gray-950 text-white min-h-screen">
    <h1 className="text-3xl font-bold text-center mb-8">Tienda Mítica</h1>

    {sections.map((section, index) => (
      <div key={index} className="mb-10">
        <h2 className="text-2xl text-pink-400 font-semibold mb-3 border-b border-pink-500 pb-1">
          {section.description || section.name}
        </h2>
        <p className="text-sm text-gray-400 mb-3">
          Disponible del {new Date(section.startDate).toLocaleDateString()} al{" "}
          {new Date(section.endDate).toLocaleDateString()}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {section.items.map((item, i) => {
            let imageUrl: string | null = null

            if (isSkinSection(section.name)) {
              imageUrl = skinMap[item.id]
            } else if (isChromaSection(section.name)) {
              imageUrl = chromaMap[item.id]
           } else if (iconMap[item.id]) {
  imageUrl = iconMap[item.id]

}

            // Debug íconos
           if (isIconSection(section.name)) {
  if (!iconMap[item.id]) {
    console.warn(
      `⚠️ Icono NO encontrado para: ${item.name} (contentId=${item.id})`
    )
  } else {
    console.log(
      `🟢 Icono encontrado para: ${item.name} → ${iconMap[item.id]}`
    )
  }
}

console.log("🖼️ Renderizando item:", {
  name: item.name,
  id: item.id,
  imageUrl,
  section: section.name,
  isIcon: isIconSection(section.name)
});



            return (
  <div
    key={i}
    className="relative rounded overflow-hidden shadow-lg group bg-gray-800 p-4 flex flex-col items-center justify-between"
  >
    {imageUrl ? (
      isIconSection(section.name) ? (
        <img
          src={imageUrl}
          alt={item.name}
          className="w-24 h-24 object-contain rounded-full border-2 border-fuchsia-400 shadow mb-4"
        />
      ) : (
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:brightness-75 transition duration-300"
        />
      )
    ) : (
      <div
        className={`bg-gray-800 w-full ${
          isIconSection(section.name) ? "h-[120px]" : "h-[200px]"
        } flex items-center justify-center p-6 text-gray-300 text-center`}
      >
        {item.name}
      </div>
    )}

    <div className="w-full mt-2 text-center">
      <h3 className="text-sm font-semibold text-fuchsia-300 leading-tight drop-shadow break-words min-h-[3rem]">
  {item.name}
</h3>
      {item.price !== null ? (
        <div className="flex items-center justify-center gap-1 text-purple-300 text-xs mt-1">
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

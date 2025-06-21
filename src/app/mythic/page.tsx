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

export default function MythicPage() {
  const [sections, setSections] = useState<MythicSection[]>([])

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/sebastian-umanap/json-data/refs/heads/main/MYTHIC_SHOP_FILTERED.json")
      .then(res => res.json())
      .then(setSections)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Tienda Mítica</h1>
      {sections.map((section, index) => (
        <div key={index} className="mb-10">
          <h2 className="text-2xl text-orange-400 font-semibold mb-3 border-b border-orange-500 pb-1">
            {section.description || section.name}
          </h2>
          <p className="text-sm text-gray-400 mb-3">
            Disponible del {new Date(section.startDate).toLocaleDateString()} al {new Date(section.endDate).toLocaleDateString()}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {section.items.map((item, i) => (
              <div key={i} className="bg-gray-900 text-white rounded-xl p-4 shadow-lg hover:scale-105 transition">
                <h3 className="text-xl text-purple-300 font-bold">{item.name}</h3>
                <p><b>Precio:</b> {item.price ?? "Gratis"}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

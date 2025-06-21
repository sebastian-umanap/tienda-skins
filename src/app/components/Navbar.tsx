'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const [countdown, setCountdown] = useState("")
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    if (pathname !== "/skins") return

    fetch("https://raw.githubusercontent.com/sebastian-umanap/json-data/refs/heads/main/CHAMPION_SKIN_FILTERED.json")
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const fecha = new Date(data[0].endDate)
          setEndDate(fecha)
        }
      })
  }, [pathname])

  useEffect(() => {
    if (!endDate) return

    const updateCountdown = () => {
      const now = new Date()
      const diff = endDate.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown("Oferta terminada")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)

      setCountdown(`${days}d ${hours}h ${minutes}m`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000)
    return () => clearInterval(interval)
  }, [endDate])

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-center">
        
        {/* Enlaces de navegación */}
        <div className="flex justify-center md:justify-start gap-6">
          <Link href="/skins" className="hover:text-cyan-400 transition">Skins</Link>
          <Link href="/mythic" className="hover:text-orange-400 transition">Tienda Mítica</Link>
        </div>

        {/* Contador */}
        {pathname === "/skins" && countdown && (
          <div className="text-sm text-gray-300">
            ⏳ Termina en: {countdown}
          </div>
        )}

        {/* Logo */}

      </div>
    </nav>
  )
}

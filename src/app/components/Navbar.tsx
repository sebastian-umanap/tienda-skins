'use client'
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-cyan-400">🎮 Tienda de Skins</h1>
        <div className="space-x-4">
          <Link href="/skins" className="hover:text-cyan-400 transition">Skins</Link>
          <Link href="/mythic" className="hover:text-orange-400 transition">Tienda Mítica</Link>
        </div>
      </div>
    </nav>
  )
}

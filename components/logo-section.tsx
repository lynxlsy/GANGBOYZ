"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function LogoSection() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)

  // Detectar scroll para fade do logo
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-black py-4">
      <div className="container mx-auto px-4 flex justify-center">
        <button 
          onClick={() => router.push("/")}
          className="flex items-center"
        >
          <img
            src="/logo-gang-boyz-new.svg"
            alt="Gang BoyZ"
            className="h-auto w-[200px] md:w-[250px] lg:w-[300px] cursor-pointer hover:opacity-80 transition-opacity duration-300"
            style={{
              opacity: Math.max(0, 1 - (scrollY / 200)), // Fade out over 200px
              transform: `translateY(${Math.min(scrollY * 0.4, 40)}px)` // Move down slightly
            }}
          />
        </button>
      </div>
    </div>
  )
}

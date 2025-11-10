"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  favorites: string[]
  addToFavorites: (productId: string) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("gang-boyz-user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        
        // Load favorites for this user
        const savedFavorites = localStorage.getItem(`favorites_${userData.id}`)
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites))
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        localStorage.removeItem("gang-boyz-user")
      }
    }
    setLoading(false)
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites))
    }
  }, [favorites, user?.id])

  const addToFavorites = (productId: string) => {
    if (user && !favorites.includes(productId)) {
      setFavorites(prev => [...prev, productId])
    }
  }

  const removeFromFavorites = (productId: string) => {
    if (user) {
      setFavorites(prev => prev.filter(id => id !== productId))
    }
  }

  const isFavorite = (productId: string) => {
    return favorites.includes(productId)
  }

  return (
    <UserContext.Provider value={{
      user,
      isLoading: loading,
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Verificar se estamos no cliente
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error)
    }
  }

  return [storedValue, setValue] as const
}

export function useLocalStorageEffect<T>(
  key: string,
  callback: (value: T | null) => void,
  dependencies: any[] = []
) {
  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return
    
    try {
      const item = window.localStorage.getItem(key)
      const value = item ? JSON.parse(item) : null
      callback(value)
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error)
      callback(null)
    }
  }, dependencies)
}

export function useLocalStorageListener<T>(
  key: string,
  callback: (value: T | null) => void
) {
  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const value = e.newValue ? JSON.parse(e.newValue) : null
          callback(value)
        } catch (error) {
          console.error(`Erro ao processar mudança em ${key}:`, error)
          callback(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange')
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, callback])
}






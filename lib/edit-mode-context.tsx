"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

interface EditModeContextType {
  isEditMode: boolean
  toggleEditMode: () => void
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined)

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false)

  // Initialize from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEditMode = localStorage.getItem('edit-mode-enabled')
      if (savedEditMode === 'true') {
        setIsEditMode(true)
      }
    }
  }, [])

  const toggleEditMode = () => {
    const newEditMode = !isEditMode
    setIsEditMode(newEditMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('edit-mode-enabled', newEditMode.toString())
    }
  }

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  // Return a default context if we're not in a provider (SSR or missing provider)
  try {
    const context = useContext(EditModeContext)
    if (context === undefined) {
      // Fallback for SSR or when context is not available
      if (typeof window !== 'undefined') {
        const savedEditMode = localStorage.getItem('edit-mode-enabled') === 'true'
        return {
          isEditMode: savedEditMode,
          toggleEditMode: () => {
            const newEditMode = !savedEditMode
            localStorage.setItem('edit-mode-enabled', newEditMode.toString())
            // Refresh the page to ensure all components update
            window.location.reload()
          }
        }
      }
      // Default values for SSR
      return {
        isEditMode: false,
        toggleEditMode: () => {}
      }
    }
    return context
  } catch (error) {
    console.warn("EditMode context error:", error)
    // Fallback implementation
    if (typeof window !== 'undefined') {
      const savedEditMode = localStorage.getItem('edit-mode-enabled') === 'true'
      return {
        isEditMode: savedEditMode,
        toggleEditMode: () => {
          const newEditMode = !savedEditMode
          localStorage.setItem('edit-mode-enabled', newEditMode.toString())
          window.location.reload()
        }
      }
    }
    // Default values for SSR
    return {
      isEditMode: false,
      toggleEditMode: () => {}
    }
  }
}
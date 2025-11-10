"use client"

import { useState, useEffect, useRef } from 'react'
import { updateContentById } from '@/lib/editable-content-utils'
import { editableContentSyncService } from '@/lib/editable-content-sync'
import { useEditMode } from '@/lib/edit-mode-context'
import '../styles/editable-button.css'

interface EditableButtonProps {
  id: string
  defaultText: string
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export function EditableButton({ 
  id, 
  defaultText, 
  className = "", 
  style = {}, 
  onClick 
}: EditableButtonProps) {
  const { isEditMode } = useEditMode()
  const [isEditing, setIsEditing] = useState(false)
  const [buttonText, setButtonText] = useState(defaultText)
  const [tempText, setTempText] = useState(defaultText)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load content from Firebase or localStorage
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Try to get content from Firebase first
        const firebaseContent = await editableContentSyncService.getContentFromFirebase(id)
        if (firebaseContent) {
          setButtonText(firebaseContent)
          setTempText(firebaseContent)
        } else {
          // Fallback to default text
          setButtonText(defaultText)
          setTempText(defaultText)
        }
      } catch (error) {
        console.warn(`Failed to load content for ${id}:`, error)
        // Use default text as fallback
        setButtonText(defaultText)
        setTempText(defaultText)
      }
    }

    loadContent()
  }, [id, defaultText])

  // Listen for real-time updates
  useEffect(() => {
    const unsubscribe = editableContentSyncService.listenToContentChanges(id, (content) => {
      if (content) {
        setButtonText(content)
        setTempText(content)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [id])

  const handleEditClick = () => {
    if (!isEditMode) {
      // Normal click behavior when not in edit mode
      if (onClick) onClick()
      return
    }
    
    // Enter edit mode
    setIsEditing(true)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, 100)
  }

  const handleSave = async () => {
    try {
      await updateContentById(id, tempText)
      setButtonText(tempText)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save button text:', error)
      // Revert to previous text on error
      setTempText(buttonText)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setTempText(buttonText)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Determine if we're on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  return (
    <div className="relative inline-block">
      {isEditing && isEditMode ? (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="editable-button__input"
            style={style}
          />
          <button
            onClick={handleSave}
            className="editable-button__control editable-button__save"
            aria-label="Save"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            className="editable-button__control editable-button__cancel"
            aria-label="Cancel"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          ref={buttonRef}
          onClick={handleEditClick}
          className={`editable-button ${isMobile ? 'editable-button--mobile' : 'editable-button--desktop'} ${isEditMode ? 'editable-button--edit-mode' : ''} ${className}`}
          style={style}
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}
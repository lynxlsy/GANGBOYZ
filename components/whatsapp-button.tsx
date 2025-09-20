"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface WhatsAppButtonProps {
  className?: string
}

export function WhatsAppButton({ className = "" }: WhatsAppButtonProps) {
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/5511999999999")

  useEffect(() => {
    // Carregar link do WhatsApp dos contatos
    const loadWhatsAppLink = () => {
      const savedContacts = localStorage.getItem("gang-boyz-contacts")
      if (savedContacts) {
        const contacts = JSON.parse(savedContacts)
        const whatsappContact = contacts.find((contact: any) => contact.id === 'whatsapp')
        if (whatsappContact && whatsappContact.isActive) {
          setWhatsappLink(whatsappContact.url)
        }
      }
    }

    loadWhatsAppLink()

    // Escutar atualizações de contatos
    const handleContactsUpdate = () => {
      loadWhatsAppLink()
    }

    window.addEventListener('contactsUpdated', handleContactsUpdate)
    
    return () => {
      window.removeEventListener('contactsUpdated', handleContactsUpdate)
    }
  }, [])

  const handleWhatsAppClick = () => {
    // Abrir WhatsApp em nova aba
    window.open(whatsappLink, "_blank")
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`fixed bottom-6 left-6 z-50 p-2 transition-all duration-300 hover:scale-110 group ${className}`}
      title="Fale conosco no WhatsApp"
    >
      <Image
        src="/WhatsApp.svg"
        alt="WhatsApp"
        width={51}
        height={51}
        className="text-white"
      />
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Fale conosco no WhatsApp
        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  )
}

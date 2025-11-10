"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, getDocs } from "firebase/firestore"
import { db } from "./firebase-config"

// Interfaces para dados administrativos
export interface AboutInfo {
  id?: string
  title: string
  subtitle: string
  description: string
  features: {
    icon: string
    title: string
    description: string
  }[]
  createdAt?: any
  updatedAt?: any
}

export interface Service {
  id?: string
  icon: string
  title: string
  subtitle: string
  isActive: boolean
  createdAt?: any
  updatedAt?: any
}

export interface ContactInfo {
  id?: string
  type: string
  value: string
  isActive: boolean
  createdAt?: any
  updatedAt?: any
}

export interface Recommendation {
  id?: string
  title: string
  description: string
  image: string
  isActive: boolean
  createdAt?: any
  updatedAt?: any
}

// Serviço Firebase para dados administrativos
class FirebaseAdminService {
  // ===== INFORMAÇÕES SOBRE =====
  async getAboutInfo(): Promise<AboutInfo | null> {
    try {
      const querySnapshot = await getDocs(collection(db, 'aboutInfo'))
      if (querySnapshot.empty) return null
      
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as AboutInfo
    } catch (error) {
      console.error('Erro ao buscar informações sobre:', error)
      return null
    }
  }

  async saveAboutInfo(aboutInfo: Omit<AboutInfo, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const existing = await this.getAboutInfo()
      
      if (existing) {
        // Atualizar existente
        const aboutRef = doc(db, 'aboutInfo', existing.id!)
        await updateDoc(aboutRef, {
          ...aboutInfo,
          updatedAt: serverTimestamp()
        })
      } else {
        // Criar novo
        await addDoc(collection(db, 'aboutInfo'), {
          ...aboutInfo,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Erro ao salvar informações sobre:', error)
      throw error
    }
  }

  // ===== SERVIÇOS =====
  async getServices(): Promise<Service[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Service[]
    } catch (error) {
      console.error('Erro ao buscar serviços:', error)
      return []
    }
  }

  async saveServices(services: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    try {
      // Limpar serviços existentes
      const existingServices = await this.getServices()
      for (const service of existingServices) {
        await deleteDoc(doc(db, 'services', service.id!))
      }

      // Adicionar novos serviços
      for (const service of services) {
        await addDoc(collection(db, 'services'), {
          ...service,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Erro ao salvar serviços:', error)
      throw error
    }
  }

  // ===== CONTATOS =====
  async getContacts(): Promise<ContactInfo[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'contacts'))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as ContactInfo[]
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
      return []
    }
  }

  async saveContacts(contacts: Omit<ContactInfo, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    try {
      // Limpar contatos existentes
      const existingContacts = await this.getContacts()
      for (const contact of existingContacts) {
        await deleteDoc(doc(db, 'contacts', contact.id!))
      }

      // Adicionar novos contatos
      for (const contact of contacts) {
        await addDoc(collection(db, 'contacts'), {
          ...contact,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Erro ao salvar contatos:', error)
      throw error
    }
  }

  // ===== RECOMENDAÇÕES =====
  async getRecommendations(): Promise<Recommendation[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'recommendations'))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Recommendation[]
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error)
      return []
    }
  }

  async saveRecommendations(recommendations: Omit<Recommendation, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    try {
      // Limpar recomendações existentes
      const existingRecommendations = await this.getRecommendations()
      for (const recommendation of existingRecommendations) {
        await deleteDoc(doc(db, 'recommendations', recommendation.id!))
      }

      // Adicionar novas recomendações
      for (const recommendation of recommendations) {
        await addDoc(collection(db, 'recommendations'), {
          ...recommendation,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Erro ao salvar recomendações:', error)
      throw error
    }
  }

  // ===== MIGRAÇÃO DO LOCALSTORAGE =====
  async migrateFromLocalStorage(): Promise<void> {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return
    
    try {
      // Migrar informações sobre
      const aboutInfo = localStorage.getItem("gang-boyz-about-info")
      if (aboutInfo) {
        const parsedAboutInfo = JSON.parse(aboutInfo)
        await this.saveAboutInfo(parsedAboutInfo)
        localStorage.removeItem("gang-boyz-about-info")
        console.log('Informações sobre migradas para Firebase')
      }

      // Migrar serviços
      const services = localStorage.getItem("gang-boyz-services")
      if (services) {
        const parsedServices = JSON.parse(services)
        await this.saveServices(parsedServices)
        localStorage.removeItem("gang-boyz-services")
        console.log('Serviços migrados para Firebase')
      }

      // Migrar contatos
      const contacts = localStorage.getItem("gang-boyz-contacts")
      if (contacts) {
        const parsedContacts = JSON.parse(contacts)
        await this.saveContacts(parsedContacts)
        localStorage.removeItem("gang-boyz-contacts")
        console.log('Contatos migrados para Firebase')
      }

      // Migrar recomendações
      const recommendations = localStorage.getItem("gang-boyz-recommendations")
      if (recommendations) {
        const parsedRecommendations = JSON.parse(recommendations)
        await this.saveRecommendations(parsedRecommendations)
        localStorage.removeItem("gang-boyz-recommendations")
        console.log('Recomendações migradas para Firebase')
      }

      console.log('Migração do localStorage para Firebase concluída!')
    } catch (error) {
      console.error('Erro na migração:', error)
    }
  }
}

// Instância do serviço
export const firebaseAdminService = new FirebaseAdminService()

// Hooks para usar o serviço
export function useFirebaseAboutInfo() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAboutInfo = async () => {
      setLoading(true)
      try {
        const info = await firebaseAdminService.getAboutInfo()
        setAboutInfo(info)
      } catch (error) {
        console.error('Erro ao carregar informações sobre:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAboutInfo()
  }, [])

  const saveAboutInfo = async (info: Omit<AboutInfo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await firebaseAdminService.saveAboutInfo(info)
      setAboutInfo({ ...info, id: 'current', createdAt: new Date(), updatedAt: new Date() })
    } catch (error) {
      console.error('Erro ao salvar informações sobre:', error)
      throw error
    }
  }

  return { aboutInfo, loading, saveAboutInfo }
}

export function useFirebaseServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true)
      try {
        const servicesData = await firebaseAdminService.getServices()
        setServices(servicesData)
      } catch (error) {
        console.error('Erro ao carregar serviços:', error)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  const saveServices = async (servicesData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    try {
      await firebaseAdminService.saveServices(servicesData)
      setServices(servicesData.map((service, index) => ({
        ...service,
        id: `temp-${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })))
    } catch (error) {
      console.error('Erro ao salvar serviços:', error)
      throw error
    }
  }

  return { services, loading, saveServices }
}

export function useFirebaseContacts() {
  const [contacts, setContacts] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true)
      try {
        const contactsData = await firebaseAdminService.getContacts()
        setContacts(contactsData)
      } catch (error) {
        console.error('Erro ao carregar contatos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [])

  const saveContacts = async (contactsData: Omit<ContactInfo, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    try {
      await firebaseAdminService.saveContacts(contactsData)
      setContacts(contactsData.map((contact, index) => ({
        ...contact,
        id: `temp-${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })))
    } catch (error) {
      console.error('Erro ao salvar contatos:', error)
      throw error
    }
  }

  return { contacts, loading, saveContacts }
}

export function useFirebaseRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true)
      try {
        const recommendationsData = await firebaseAdminService.getRecommendations()
        setRecommendations(recommendationsData)
      } catch (error) {
        console.error('Erro ao carregar recomendações:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  const saveRecommendations = async (recommendationsData: Omit<Recommendation, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    try {
      await firebaseAdminService.saveRecommendations(recommendationsData)
      setRecommendations(recommendationsData.map((recommendation, index) => ({
        ...recommendation,
        id: `temp-${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })))
    } catch (error) {
      console.error('Erro ao salvar recomendações:', error)
      throw error
    }
  }

  return { recommendations, loading, saveRecommendations }
}

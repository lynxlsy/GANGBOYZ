"use client"

import Link from "next/link"
import { Shirt, ShoppingCart, User, Plus, Edit3, Save, X, Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { useEditMode } from "@/lib/edit-mode-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { useFirebaseCategories, FirebaseCategory } from "@/lib/firebase-categories-service"
import { ref, uploadString, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase-config"

interface Category {
  id: string
  name: string
  image: string
  href: string
  description: string
  isActive?: boolean
  order?: number
}

const defaultCategories: Category[] = [
  {
    id: "oversized",
    name: "Oversized",
    image: "/placeholder-category-circle.png",
    href: "/explore/oversized",
    description: "",
    isActive: true,
    order: 1
  },
  {
    id: "estampas",
    name: "Estampas",
    image: "/placeholder-category-circle.png",
    href: "/explore/estampas",
    description: "",
    isActive: true,
    order: 2
  },
  {
    id: "lisos",
    name: "Lisos",
    image: "/placeholder-category-circle.png",
    href: "/explore/lisos",
    description: "",
    isActive: true,
    order: 3
  },
  {
    id: "shorts",
    name: "Shorts",
    image: "/placeholder-category-circle.png",
    href: "/explore/shorts",
    description: "",
    isActive: true,
    order: 4
  },
  {
    id: "verao",
    name: "Verão",
    image: "/placeholder-category-circle.png",
    href: "/explore/verao",
    description: "",
    isActive: true,
    order: 5
  },
  {
    id: "inverno",
    name: "Inverno",
    image: "/placeholder-category-circle.png",
    href: "/explore/inverno",
    description: "",
    isActive: true,
    order: 6
  }
]

export function CategoryShowcase({ isEditMode = false }: { isEditMode?: boolean }) {
  // Use the prop if provided, otherwise fallback to the context
  const { isEditMode: contextEditMode } = useEditMode()
  const effectiveIsEditMode = isEditMode || contextEditMode
  const { categories: firebaseCategories, loading, error, addCategory, updateCategory, deleteCategory } = useFirebaseCategories()
  
  // Debug logging
  console.log('🔄 CategoryShowcase render - Firebase categories:', firebaseCategories?.length, 'Loading:', loading, 'Error:', error);
  
  // Mount effect for debugging
  useEffect(() => {
    console.log('📦 CategoryShowcase mounted');
    return () => {
      console.log('🧨 CategoryShowcase unmounted');
    };
  }, []);
  
  // Validate image URL
  const validateImageUrl = (imageUrl: string | undefined): string | null => {
    // Check for null, undefined, or empty strings
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      console.log('⚠️ No valid image URL provided, using placeholder');
      return null;
    }
    
    // Trim the URL
    const trimmedUrl = imageUrl.trim();
    
    // Check if it's a valid URL
    if (trimmedUrl.startsWith('http')) {
      console.log(`✅ Valid HTTP URL: ${trimmedUrl}`);
      return trimmedUrl;
    }
    
    // Check if it's a valid local path
    if (trimmedUrl.startsWith('/')) {
      console.log(`✅ Valid local path: ${trimmedUrl}`);
      return trimmedUrl;
    }
    
    // Check if it's base64 data
    if (trimmedUrl.startsWith('data:')) {
      console.log(`✅ Valid base64 data URL`);
      return trimmedUrl;
    }
    
    // Check if it's a valid data URL (handle cases where it might not start with 'data:' but is still valid)
    if (trimmedUrl.includes('base64')) {
      console.log(`✅ Valid base64 data URL (alternative check): ${trimmedUrl}`);
      return trimmedUrl;
    }
    
    // For any other case, log it and return the URL as is (might be a valid relative path)
    console.log(`ℹ️ Using image URL as is: ${trimmedUrl}`);
    return trimmedUrl;
  };
  
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [editingCategories, setEditingCategories] = useState<Category[]>(defaultCategories)
  const [isEditing, setIsEditing] = useState(false)
  const [newCategory, setNewCategory] = useState({
    id: "",
    name: "",
    image: "/placeholder-category-circle.png",
    href: "",
    description: ""
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [firebaseSynced, setFirebaseSynced] = useState(false)

  // Carregar categorias do Firebase e localStorage
  useEffect(() => {
    const loadCategories = () => {
      if (typeof window !== 'undefined') {
        try {
          // Debug logging
          console.log('🔄 Carregando categorias - Firebase:', firebaseCategories?.length, 'Loading:', loading, 'Error:', error);
          
          // Sempre priorizar Firebase quando disponível (mesmo que esteja carregando)
          if (firebaseCategories && firebaseCategories.length > 0) {
            console.log('✅ Usando categorias do Firebase (prioridade máxima):', firebaseCategories.length);
            // Converter o formato do Firebase para o formato usado no componente
            const formattedCategories = firebaseCategories.map((cat: FirebaseCategory) => ({
              id: cat.id,
              name: cat.name,
              image: validateImageUrl(cat.image) || cat.image || "/placeholder-category-circle.png",
              href: cat.href || `/explore/${cat.id}`,
              description: cat.description || ""
            }))
            setCategories(formattedCategories)
            setEditingCategories(formattedCategories)
            console.log('📊 Categorias carregadas do Firebase:', formattedCategories);
            
            // Log detalhado das categorias do Firebase
            firebaseCategories.forEach((cat, index) => {
              console.log(`📊 Firebase Categoria ${index}: ID=${cat.id}, Name=${cat.name}, Image=${cat.image}`);
            });
          } else if (!loading && !error) {
            // Apenas usar localStorage se Firebase estiver definitivamente vazio e não estiver carregando
            console.log('⚠️ Firebase vazio ou não disponível, usando localStorage');
            const savedCategories = localStorage.getItem("gang-boyz-categories")
            if (savedCategories) {
              try {
                const parsedCategories = JSON.parse(savedCategories)
                // Converter o formato do localStorage para o formato usado no componente
                const formattedCategories = parsedCategories.map((cat: any) => ({
                  id: cat.id.toLowerCase(),
                  name: cat.name,
                  image: validateImageUrl(cat.image) || cat.image || "/placeholder-category-circle.png",
                  href: cat.href || `/explore/${cat.id.toLowerCase()}`,
                  description: cat.description || ""
                }))
                setCategories(formattedCategories)
                setEditingCategories(formattedCategories)
                console.log('📊 Categorias carregadas do localStorage:', formattedCategories);
              } catch (error) {
                console.error('Erro ao carregar categorias:', error)
                setCategories(defaultCategories)
                setEditingCategories(defaultCategories)
              }
            } else {
              // Salvar categorias padrão no localStorage para uso futuro
              try {
                const localStorageFormat = defaultCategories.map(cat => ({
                  id: cat.id.toUpperCase(),
                  name: cat.name,
                  image: cat.image || "/placeholder-category-circle.png",
                  href: cat.href || `/explore/${cat.id}`,
                  description: cat.description || "",
                  products: []
                }));
                localStorage.setItem("gang-boyz-categories", JSON.stringify(localStorageFormat));
                console.log('💾 Categorias padrão salvas no localStorage');
              } catch (storageError) {
                console.error('Erro ao salvar categorias padrão no localStorage:', storageError);
              }
              setCategories(defaultCategories)
              setEditingCategories(defaultCategories)
              console.log('📊 Usando categorias padrão');
            }
          } else if (loading) {
            // Enquanto carrega, usar categorias padrão temporariamente
            console.log('⏳ Firebase carregando, usando categorias padrão temporariamente');
            setCategories(defaultCategories)
            setEditingCategories(defaultCategories)
          } else if (error) {
            // Se houver erro, tentar usar localStorage ou categorias padrão
            console.log('❌ Erro no Firebase, tentando usar localStorage');
            const savedCategories = localStorage.getItem("gang-boyz-categories")
            if (savedCategories) {
              try {
                const parsedCategories = JSON.parse(savedCategories)
                const formattedCategories = parsedCategories.map((cat: any) => ({
                  id: cat.id.toLowerCase(),
                  name: cat.name,
                  image: validateImageUrl(cat.image) || cat.image || "/placeholder-category-circle.png",
                  href: cat.href || `/explore/${cat.id.toLowerCase()}`,
                  description: cat.description || ""
                }))
                setCategories(formattedCategories)
                setEditingCategories(formattedCategories)
                console.log('📊 Categorias carregadas do localStorage (fallback):', formattedCategories);
              } catch (localStorageError) {
                console.error('Erro ao carregar categorias do localStorage:', localStorageError)
                setCategories(defaultCategories)
                setEditingCategories(defaultCategories)
              }
            } else {
              // Salvar categorias padrão no localStorage para uso futuro
              try {
                const localStorageFormat = defaultCategories.map(cat => ({
                  id: cat.id.toUpperCase(),
                  name: cat.name,
                  image: cat.image || "/placeholder-category-circle.png",
                  href: cat.href || `/explore/${cat.id}`,
                  description: cat.description || "",
                  products: []
                }));
                localStorage.setItem("gang-boyz-categories", JSON.stringify(localStorageFormat));
                console.log('💾 Categorias padrão salvas no localStorage (fallback)');
              } catch (storageError) {
                console.error('Erro ao salvar categorias padrão no localStorage (fallback):', storageError);
              }
              setCategories(defaultCategories)
              setEditingCategories(defaultCategories)
              console.log('📊 Usando categorias padrão (fallback)');
            }
          }
        } catch (error) {
          console.error('Erro ao acessar localStorage:', error)
          setCategories(defaultCategories)
          setEditingCategories(defaultCategories)
        }
      }
    }

    loadCategories()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      // Handle both StorageEvent and CustomEvent
      if ((e instanceof StorageEvent && e.key === "gang-boyz-categories") || 
          (e instanceof CustomEvent && e.type === 'storage')) {
        console.log('🔄 Recarregando categorias devido a mudança no storage');
        setFirebaseSynced(false); // Resetar sincronização para forçar rechecagem
        loadCategories()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [firebaseCategories, loading, error])

  // Verificação adicional para garantir que o Firebase seja priorizado
  useEffect(() => {
    if (firebaseCategories && firebaseCategories.length > 0 && !firebaseSynced) {
      console.log('🔁 Sincronizando categorias do Firebase');
      // Forçar atualização se houver categorias no Firebase mas não estiverem sendo exibidas
      const formattedCategories = firebaseCategories.map((cat: FirebaseCategory) => ({
        id: cat.id,
        name: cat.name,
        image: validateImageUrl(cat.image) || cat.image || "/placeholder-category-circle.png",
        href: cat.href || `/explore/${cat.id}`,
        description: cat.description || ""
      }));
      setCategories(formattedCategories);
      setEditingCategories(formattedCategories);
      setFirebaseSynced(true);
    }
  }, [firebaseCategories, firebaseSynced]);

  const handleSaveCategories = async () => {
    console.log('💾 Salvando todas as categorias:', editingCategories);
    // Salvar no estado
    setCategories(editingCategories)
    
    // Salvar no localStorage no formato esperado pelo sistema
    // Only store essential data to avoid quota issues
    const localStorageFormat = editingCategories.map(cat => ({
      id: cat.id.toUpperCase(),
      name: cat.name,
      // Store image path or base64 data
      image: cat.image || "/placeholder-category-circle.png",
      href: cat.href || `/explore/${cat.id}`,
      description: cat.description,
      products: [] // Array vazio de produtos
    }))
    
    try {
      localStorage.setItem("gang-boyz-categories", JSON.stringify(localStorageFormat))
      console.log('💾 Categorias salvas no localStorage');
      
      // Indicar que o processo de salvamento começou
      toast({
        title: "Salvando categorias",
        description: "Salvando categorias no Firebase..."
      });
      
      // Salvar no Firebase
      let firebaseSuccess = true;
      let firebaseErrorCount = 0;
      
      for (const cat of editingCategories) {
        try {
          console.log(`💾 Processando categoria ${cat.id} para Firebase`);
          console.log(`📋 Dados da categoria:`, cat);
          
          // Verificar se a categoria já existe no Firebase (tentar atualizar primeiro)
          try {
            // Verificar se é uma imagem base64 para upload
            if (cat.image && cat.image.startsWith('data:image')) {
              console.log(`📤 Fazendo upload da imagem da categoria ${cat.id}`);
              // Upload da imagem para o Firebase Storage
              const storageRef = ref(storage, `categories/${cat.id}.jpg`);
              await uploadString(storageRef, cat.image, 'data_url');
              const downloadURL = await getDownloadURL(storageRef);
              console.log(`✅ Imagem da categoria ${cat.id} carregada:`, downloadURL);
              
              // Atualizar categoria com URL da imagem
              await updateCategory(cat.id, {
                name: cat.name,
                image: downloadURL,
                href: cat.href || `/explore/${cat.id}`,
                description: cat.description || "",
                isActive: true
              });
            } else {
              console.log(`🔗 Usando URL existente para categoria ${cat.id}:`, cat.image);
              // Atualizar categoria com URL existente
              await updateCategory(cat.id, {
                name: cat.name,
                image: cat.image || "/placeholder-category-circle.png",
                href: cat.href || `/explore/${cat.id}`,
                description: cat.description || "",
                isActive: true
              });
            }
            console.log(`✅ Categoria ${cat.id} atualizada no Firebase`);
          } catch (updateError: any) {
            // Se a atualização falhar, tentar adicionar como nova categoria
            if (updateError.code === 'not-found') {
              console.log(`🆕 Categoria ${cat.id} não existe, adicionando como nova...`);
              
              // Verificar se é uma imagem base64 para upload
              let imageUrl = cat.image || "/placeholder-category-circle.png";
              if (cat.image && cat.image.startsWith('data:image')) {
                console.log(`📤 Fazendo upload da imagem da nova categoria ${cat.id}`);
                const storageRef = ref(storage, `categories/${cat.id}.jpg`);
                await uploadString(storageRef, cat.image, 'data_url');
                imageUrl = await getDownloadURL(storageRef);
                console.log(`✅ Imagem da nova categoria ${cat.id} carregada:`, imageUrl);
              }
              
              // Adicionar nova categoria
              await addCategory({
                name: cat.name,
                image: imageUrl,
                href: cat.href || `/explore/${cat.id}`,
                description: cat.description || "",
                isActive: true
              });
              console.log(`✅ Nova categoria ${cat.id} adicionada ao Firebase`);
            } else {
              // Se for outro tipo de erro, relançar
              throw updateError;
            }
          }
        } catch (firebaseError: any) {
          firebaseSuccess = false;
          firebaseErrorCount++;
          console.warn(`Erro ao salvar categoria ${cat.id} no Firebase:`, firebaseError);
          if (firebaseError.code) {
            console.error(`Código do erro: ${firebaseError.code}`);
            console.error(`Mensagem do erro: ${firebaseError.message}`);
          }
        }
      }
      
      // Disparar evento para atualizar outros componentes
      window.dispatchEvent(new Event('storage'))
      
      // Forçar atualização das categorias do Firebase
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'))
      }, 1000)
      
      setIsEditing(false)
      
      // Mostrar feedback apropriado
      if (firebaseSuccess) {
        toast({
          title: "Categorias atualizadas",
          description: "As categorias foram salvas com sucesso no Firebase e localStorage."
        })
      } else if (firebaseErrorCount < editingCategories.length) {
        toast({
          title: "Categorias parcialmente atualizadas",
          description: `Algumas categorias foram salvas com sucesso. ${firebaseErrorCount} categorias tiveram problemas de sincronização.`
        })
      } else {
        toast({
          title: "Erro na sincronização",
          description: "As categorias foram salvas localmente, mas houve problemas ao sincronizar com o Firebase.",
          variant: "destructive"
        })
      }
      
      // Resetar sincronização para forçar rechecagem
      setFirebaseSynced(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as categorias devido ao limite de armazenamento. Tente remover algumas categorias ou imagens.",
          variant: "destructive"
        })
      } else {
        console.error('Erro ao salvar categorias:', error)
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar as categorias.",
          variant: "destructive"
        })
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingCategories(categories)
    setIsEditing(false)
    setShowAddForm(false)
  }

  const handleAddCategory = async () => {
    console.log('➕ Adicionando nova categoria:', newCategory);
    if (!newCategory.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria é obrigatório.",
        variant: "destructive"
      })
      return
    }

    const categoryId = newCategory.id || newCategory.name.toLowerCase().replace(/\s+/g, '-')
    const newCat: Category = {
      id: categoryId,
      name: newCategory.name,
      image: newCategory.image,
      href: newCategory.href || `/explore/${categoryId}`,
      description: newCategory.description
    }

    const updatedCategories = [...editingCategories, newCat]
    setEditingCategories(updatedCategories)
    // Também atualizar o estado categories para refletir imediatamente
    setCategories(updatedCategories)
    
    // Save to localStorage immediately
    const localStorageFormat = updatedCategories.map(cat => ({
      id: cat.id.toUpperCase(),
      name: cat.name,
      // Store image path or base64 data
      image: cat.image || "/placeholder-category-circle.png",
      href: cat.href || `/explore/${cat.id}`,
      description: cat.description,
      products: [] // Array vazio de produtos
    }))
    
    try {
      localStorage.setItem("gang-boyz-categories", JSON.stringify(localStorageFormat))
      console.log('💾 Categoria salva no localStorage');
      
      // Indicar que o processo de salvamento começou
      toast({
        title: "Adicionando categoria",
        description: "Salvando categoria no Firebase..."
      });
      
      // Salvar no Firebase
      let firebaseSuccess = true;
      try {
        let imageUrl = newCategory.image;
        
        // Verificar se é uma imagem base64 para upload
        if (newCategory.image && newCategory.image.startsWith('data:image')) {
          console.log('📤 Fazendo upload da imagem para Firebase Storage');
          // Upload da imagem para o Firebase Storage
          const storageRef = ref(storage, `categories/${categoryId}.jpg`);
          await uploadString(storageRef, newCategory.image, 'data_url');
          imageUrl = await getDownloadURL(storageRef);
          console.log('✅ Imagem carregada com sucesso:', imageUrl);
        }
        
        // Adicionar categoria no Firebase
        const categoryData = {
          name: newCategory.name,
          image: imageUrl || newCategory.image || "/placeholder-category-circle.png",
          href: newCategory.href || `/explore/${categoryId}`,
          description: newCategory.description || "",
          isActive: true
        };
        
        console.log('💾 Salvando categoria no Firebase:', categoryData);
        await addCategory(categoryData);
        console.log('✅ Categoria adicionada ao Firebase com sucesso');
      } catch (firebaseError: any) {
        // Se a categoria já existir, tentar atualizar
        if (firebaseError.code === 'already-exists') {
          try {
            console.log(`🔄 Categoria ${categoryId} já existe, atualizando...`);
            
            // Verificar se é uma imagem base64 para upload
            let imageUrl = newCategory.image;
            if (newCategory.image && newCategory.image.startsWith('data:image')) {
              const storageRef = ref(storage, `categories/${categoryId}.jpg`);
              await uploadString(storageRef, newCategory.image, 'data_url');
              imageUrl = await getDownloadURL(storageRef);
            }
            
            // Atualizar categoria existente
            await updateCategory(categoryId, {
              name: newCategory.name,
              image: imageUrl || newCategory.image || "/placeholder-category-circle.png",
              href: newCategory.href || `/explore/${categoryId}`,
              description: newCategory.description || "",
              isActive: true
            });
            
            firebaseSuccess = true; // Sucesso ao atualizar
            console.log('✅ Categoria atualizada no Firebase com sucesso');
          } catch (updateError: any) {
            firebaseSuccess = false;
            console.warn('Erro ao atualizar categoria no Firebase:', updateError);
            if (updateError.code) {
              console.error(`Código do erro: ${updateError.code}`);
              console.error(`Mensagem do erro: ${updateError.message}`);
            }
          }
        } else {
          firebaseSuccess = false;
          console.warn('Erro ao salvar categoria no Firebase:', firebaseError);
          if (firebaseError.code) {
            console.error(`Código do erro: ${firebaseError.code}`);
            console.error(`Mensagem do erro: ${firebaseError.message}`);
          }
          
          // Mostrar mensagem de erro mais amigável
          toast({
            title: "Erro ao salvar no Firebase",
            description: "A categoria foi salva localmente, mas houve um problema ao sincronizar com o Firebase. Verifique sua conexão e as permissões do Firestore.",
            variant: "destructive"
          });
        }
      }
      
      // Disparar evento para atualizar outros componentes
      window.dispatchEvent(new Event('storage'))
      
      // Forçar atualização das categorias do Firebase
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'))
      }, 1000)
      
      setNewCategory({
        id: "",
        name: "",
        image: "/placeholder-category-circle.png",
        href: "",
        description: ""
      })
      setShowAddForm(false)
      
      // Mostrar feedback apropriado
      if (firebaseSuccess) {
        toast({
          title: "Categoria adicionada",
          description: `A categoria "${newCategory.name}" foi adicionada com sucesso no Firebase e localStorage.`
        })
      } else {
        toast({
          title: "Categoria adicionada localmente",
          description: `A categoria "${newCategory.name}" foi adicionada localmente, mas houve problemas ao sincronizar com o Firebase.`,
          variant: "destructive"
        })
      }
      
      // Resetar sincronização para forçar rechecagem
      setFirebaseSynced(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a categoria devido ao limite de armazenamento.",
          variant: "destructive"
        })
      } else {
        console.error('Erro ao salvar categoria:', error)
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar a categoria.",
          variant: "destructive"
        })
      }
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      const updatedCategories = editingCategories.filter(cat => cat.id !== categoryId)
      setEditingCategories(updatedCategories)
      // Também atualizar o estado categories para refletir imediatamente
      setCategories(updatedCategories)
      
      // Save to localStorage immediately
      const localStorageFormat = updatedCategories.map(cat => ({
        id: cat.id.toUpperCase(),
        name: cat.name,
        // Store image path or base64 data
        image: cat.image || "/placeholder-category-circle.png",
        href: cat.href || `/explore/${cat.id}`,
        description: cat.description,
        products: [] // Array vazio de produtos
      }))
      
      try {
        localStorage.setItem("gang-boyz-categories", JSON.stringify(localStorageFormat))
        
        // Indicar que o processo de exclusão começou
        toast({
          title: "Excluindo categoria",
          description: "Excluindo categoria do Firebase..."
        });
        
        // Deletar do Firebase
        let firebaseSuccess = true;
        try {
          await deleteCategory(categoryId);
        } catch (firebaseError: any) {
          firebaseSuccess = false;
          console.warn('Erro ao deletar categoria do Firebase:', firebaseError);
          if (firebaseError.code) {
            console.error(`Código do erro: ${firebaseError.code}`);
            console.error(`Mensagem do erro: ${firebaseError.message}`);
          }
          
          // Mostrar mensagem de erro mais amigável
          toast({
            title: "Erro ao excluir do Firebase",
            description: "A categoria foi excluída localmente, mas houve um problema ao sincronizar com o Firebase. Verifique sua conexão e as permissões do Firestore.",
            variant: "destructive"
          });
        }
        
        // Disparar evento para atualizar outros componentes
        window.dispatchEvent(new Event('storage'))
        
        // Mostrar feedback apropriado
        if (firebaseSuccess) {
          toast({
            title: "Categoria excluída",
            description: "A categoria foi excluída com sucesso do Firebase e localStorage."
          })
        } else {
          toast({
            title: "Categoria excluída localmente",
            description: "A categoria foi excluída localmente, mas houve problemas ao sincronizar com o Firebase.",
            variant: "destructive"
          })
        }
        
        // Resetar sincronização para forçar rechecagem
        setFirebaseSynced(false);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          toast({
            title: "Erro ao salvar",
            description: "Não foi possível salvar a exclusão devido ao limite de armazenamento.",
            variant: "destructive"
          })
        } else {
          console.error('Erro ao salvar exclusão:', error)
          toast({
            title: "Erro ao salvar",
            description: "Ocorreu um erro ao salvar a exclusão.",
            variant: "destructive"
          })
        }
      }
    }
  }

  const handleUpdateCategory = async (index: number, field: keyof Category, value: string) => {
    console.log(`🔄 Atualizando categoria no índice ${index}, campo: ${field}, valor: ${value}`);
    const updatedCategories = [...editingCategories]
    updatedCategories[index] = { ...updatedCategories[index], [field]: value }
    
    // Ensure href consistency when name changes
    if (field === 'name' || field === 'id') {
      const categoryId = updatedCategories[index].id || updatedCategories[index].name.toLowerCase().replace(/\s+/g, '-')
      updatedCategories[index].href = `/explore/${categoryId}`
      console.log(`🔗 Atualizando href para categoria: ${categoryId}`);
    }
    
    setEditingCategories(updatedCategories)
    // Também atualizar o estado categories para refletir imediatamente
    setCategories(updatedCategories)
    
    // Save to localStorage immediately
    const localStorageFormat = updatedCategories.map(cat => ({
      id: cat.id.toUpperCase(),
      name: cat.name,
      // Store image path or base64 data
      image: cat.image || "/placeholder-category-circle.png",
      href: cat.href || `/explore/${cat.id}`,
      description: cat.description,
      products: [] // Array vazio de produtos
    }))
    
    try {
      localStorage.setItem("gang-boyz-categories", JSON.stringify(localStorageFormat))
      
      // Salvar no Firebase
      const category = updatedCategories[index];
      console.log(`📋 Categoria a ser atualizada:`, category);
      let firebaseSuccess = true;
      try {
        let imageUrl = category.image;
        
        // Verificar se é uma imagem base64 para upload
        if (field === 'image' && category.image && category.image.startsWith('data:image')) {
          console.log(`📤 Upload de imagem para categoria ${category.id}`);
          // Upload da imagem para o Firebase Storage
          const storageRef = ref(storage, `categories/${category.id}.jpg`);
          await uploadString(storageRef, category.image, 'data_url');
          imageUrl = await getDownloadURL(storageRef);
          console.log(`✅ Imagem carregada: ${imageUrl}`);
        }
        
        // Atualizar categoria no Firebase
        const updateData = {
          name: category.name,
          image: imageUrl || category.image || "/placeholder-category-circle.png",
          href: category.href || `/explore/${category.id}`,
          description: category.description || "",
          isActive: true
        };
        
        console.log(`💾 Atualizando categoria ${category.id} no Firebase:`, updateData);
        await updateCategory(category.id, updateData);
      } catch (firebaseError: any) {
        // Se a categoria não existir, tentar adicionar como nova
        if (firebaseError.code === 'not-found') {
          try {
            console.log(`🆕 Categoria ${category.id} não existe, adicionando como nova...`);
            
            // Verificar se é uma imagem base64 para upload
            let imageUrl = category.image || "/placeholder-category-circle.png";
            if (field === 'image' && category.image && category.image.startsWith('data:image')) {
              const storageRef = ref(storage, `categories/${category.id}.jpg`);
              await uploadString(storageRef, category.image, 'data_url');
              imageUrl = await getDownloadURL(storageRef);
            }
            
            // Adicionar nova categoria
            await addCategory({
              name: category.name,
              image: imageUrl,
              href: category.href || `/explore/${category.id}`,
              description: category.description || "",
              isActive: true
            });
            
            firebaseSuccess = true; // Sucesso ao adicionar
            console.log(`✅ Nova categoria ${category.id} adicionada ao Firebase`);
          } catch (addError: any) {
            firebaseSuccess = false;
            console.warn(`Erro ao adicionar nova categoria ${category.id} no Firebase:`, addError);
            if (addError.code) {
              console.error(`Código do erro: ${addError.code}`);
              console.error(`Mensagem do erro: ${addError.message}`);
            }
          }
        } else {
          firebaseSuccess = false;
          console.warn(`Erro ao atualizar categoria ${category.id} no Firebase:`, firebaseError);
          if (firebaseError.code) {
            console.error(`Código do erro: ${firebaseError.code}`);
            console.error(`Mensagem do erro: ${firebaseError.message}`);
          }
          
          // Mostrar mensagem de erro mais amigável
          toast({
            title: "Erro ao atualizar no Firebase",
            description: `A categoria foi atualizada localmente, mas houve um problema ao sincronizar com o Firebase. Verifique sua conexão e as permissões do Firestore.`,
            variant: "destructive"
          });
        }
      }
      
      // Disparar evento para atualizar outros componentes
      window.dispatchEvent(new Event('storage'))
      
      // Mostrar feedback se for uma atualização importante
      if (!firebaseSuccess) {
        toast({
          title: "Problema na sincronização",
          description: `A categoria foi atualizada localmente, mas houve problemas ao sincronizar com o Firebase.`,
          variant: "destructive"
        })
      }
      
      // Resetar sincronização para forçar rechecagem
      setFirebaseSynced(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a atualização devido ao limite de armazenamento.",
          variant: "destructive"
        })
      } else {
        console.error('Erro ao salvar atualização:', error)
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar a atualização.",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">NOSSAS CATEGORIAS</h2>
          <div className="w-16 h-1 bg-red-600 mx-auto"></div>
        </div>
        
        {/* Botões de edição no modo de edição */}
        {effectiveIsEditMode && (
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Editar Categorias
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Categoria
            </Button>
          </div>
        )}
        
        {/* Formulário de adição de nova categoria */}
        {effectiveIsEditMode && showAddForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Adicionar Nova Categoria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Nome</label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Nome da categoria"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-800 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">ID (opcional)</label>
                <Input
                  value={newCategory.id}
                  onChange={(e) => setNewCategory({...newCategory, id: e.target.value})}
                  placeholder="ID da categoria (deixe em branco para gerar automaticamente)"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-800 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">URL (opcional)</label>
                <Input
                  value={newCategory.href}
                  onChange={(e) => setNewCategory({...newCategory, href: e.target.value})}
                  placeholder="URL da categoria (ex: /minha-categoria)"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-800 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Imagem</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Usar a mesma abordagem eficiente dos banners
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        const response = await fetch('/api/uploads', {
                          method: 'POST',
                          body: formData,
                        });

                        if (!response.ok) {
                          throw new Error('Erro no upload');
                        }

                        const { url } = await response.json();
                        setNewCategory({...newCategory, image: url});
                      } catch (error) {
                        console.error("Erro no upload da imagem:", error);
                        toast({
                          title: "Erro no upload",
                          description: "Erro ao fazer upload da imagem da categoria",
                          variant: "destructive"
                        });
                      }
                    }
                  }}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-red-500"
                />
                {newCategory.image && newCategory.image.trim() !== "" && newCategory.image !== "/placeholder-category-circle.png" && (
                  <div className="mt-2">
                    <img src={newCategory.image} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                onClick={() => setShowAddForm(false)} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddCategory} 
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        )}
        
        {/* Interface de edição de categorias */}
        {effectiveIsEditMode && isEditing && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Editar Categorias</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {editingCategories.slice(0, 3).map((category, index) => (
                <div key={category.id} className="p-4 border rounded-lg bg-gray-50 border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">Nome</label>
                      <Input
                        value={category.name}
                        onChange={(e) => handleUpdateCategory(index, 'name', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">ID</label>
                      <Input
                        value={category.id}
                        onChange={(e) => handleUpdateCategory(index, 'id', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">URL</label>
                      <Input
                        value={category.href}
                        onChange={(e) => handleUpdateCategory(index, 'href', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-800 bg-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={() => handleDeleteCategory(category.id)}
                        variant="outline" 
                        className="text-red-600 border-red-600 hover:bg-red-50 w-full"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-900 mb-1">Imagem</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Usar a mesma abordagem eficiente dos banners
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            const response = await fetch('/api/uploads', {
                              method: 'POST',
                              body: formData,
                            });

                            if (!response.ok) {
                              throw new Error('Erro no upload');
                            }

                            const { url } = await response.json();
                            handleUpdateCategory(index, 'image', url);
                          } catch (error) {
                            console.error("Erro no upload da imagem:", error);
                            toast({
                              title: "Erro no upload",
                              description: "Erro ao fazer upload da imagem da categoria",
                              variant: "destructive"
                            });
                          }
                        }
                      }}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-red-500"
                    />
                    {category.image && category.image.trim() !== "" && category.image !== "/placeholder-category-circle.png" && (
                      <div className="mt-2">
                        <img src={category.image} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {editingCategories.slice(3, 6).map((category, index) => (
                <div key={category.id} className="p-4 border rounded-lg bg-gray-50 border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">Nome</label>
                      <Input
                        value={category.name}
                        onChange={(e) => handleUpdateCategory(index + 3, 'name', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">ID</label>
                      <Input
                        value={category.id}
                        onChange={(e) => handleUpdateCategory(index + 3, 'id', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">URL</label>
                      <Input
                        value={category.href}
                        onChange={(e) => handleUpdateCategory(index + 3, 'href', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-800 bg-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={() => handleDeleteCategory(category.id)}
                        variant="outline" 
                        className="text-red-600 border-red-600 hover:bg-red-50 w-full"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-900 mb-1">Imagem</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Usar a mesma abordagem eficiente dos banners
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            const response = await fetch('/api/uploads', {
                              method: 'POST',
                              body: formData,
                            });

                            if (!response.ok) {
                              throw new Error('Erro no upload');
                            }

                            const { url } = await response.json();
                            handleUpdateCategory(index + 3, 'image', url);
                          } catch (error) {
                            console.error("Erro no upload da imagem:", error);
                            toast({
                              title: "Erro no upload",
                              description: "Erro ao fazer upload da imagem da categoria",
                              variant: "destructive"
                            });
                          }
                        }
                      }}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-red-500"
                    />
                    {category.image && category.image.trim() !== "" && category.image !== "/placeholder-category-circle.png" && (
                      <div className="mt-2">
                        <img src={category.image} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                onClick={handleCancelEdit} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveCategories} 
                className="bg-red-600 hover:bg-red-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Todas
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4 md:items-center md:justify-center">
          {(isEditing ? editingCategories : categories).slice(0, 3).map((category) => (
            <div key={category.id} className="menu-item flex flex-col items-center justify-center">
              <Link
                href={category.href}
                className="menu-figure block relative overflow-hidden rounded-full w-24 h-24 md:w-32 md:h-32 flex-shrink-0"
              >
                <img 
                  src={validateImageUrl(category.image) || "/placeholder-category-circle.png"} 
                  alt={category.name} 
                  className="image w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    console.log(`❌ Erro ao carregar imagem para categoria ${category.name}:`, category.image);
                    // Fallback para placeholder
                    (e.target as HTMLImageElement).src = "/placeholder-category-circle.png";
                  }}
                />
              </Link>
              <Link 
                href={category.href}
                className="menu-label block text-center mt-2 text-sm font-medium text-gray-900 hover:text-red-600 transition-colors"
              >
                {category.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 md:items-center md:justify-center mt-4">
          {(isEditing ? editingCategories : categories).slice(3, 6).map((category) => (
            <div key={category.id} className="menu-item flex flex-col items-center justify-center">
              <Link
                href={category.href}
                className="menu-figure block relative overflow-hidden rounded-full w-24 h-24 md:w-32 md:h-32 flex-shrink-0"
              >
                <img 
                  src={validateImageUrl(category.image) || "/placeholder-category-circle.png"} 
                  alt={category.name} 
                  className="image w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    console.log(`❌ Erro ao carregar imagem para categoria ${category.name}:`, category.image);
                    // Fallback para placeholder
                    (e.target as HTMLImageElement).src = "/placeholder-category-circle.png";
                  }}
                />
              </Link>
              <Link 
                href={category.href}
                className="menu-label block text-center mt-2 text-sm font-medium text-gray-900 hover:text-red-600 transition-colors"
              >
                {category.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
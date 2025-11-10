"use client"

import { useState, useEffect } from "react"
import { generateID } from "@/lib/unified-id-system"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function TestProductID() {
  const [generatedID, setGeneratedID] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    // Generate a test ID on component mount
    const newID = generateID('product')
    setGeneratedID(newID)
  }, [])

  const handleGenerateNewID = () => {
    const newID = generateID('product')
    setGeneratedID(newID)
  }

  const handleSearch = () => {
    // This would normally use the unified search system
    // For now, we'll just show a message
    setSearchResults([
      { id: generatedID, name: "Produto Teste", type: "product" }
    ])
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Teste de Geração de ID de Produto</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">ID Gerado Automaticamente:</label>
        <Input 
          value={generatedID} 
          readOnly 
          className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
        />
        <Button onClick={handleGenerateNewID} className="mt-2">
          Gerar Novo ID
        </Button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Pesquisar por ID:</label>
        <div className="flex gap-2">
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite um ID para pesquisar"
            className="flex-1 bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
          />
          <Button onClick={handleSearch}>
            Buscar
          </Button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Resultados da Pesquisa:</h3>
          <ul className="bg-white p-3 rounded-lg">
            {searchResults.map((result, index) => (
              <li key={index} className="py-2 border-b last:border-b-0">
                <div className="font-mono text-sm">ID: {result.id}</div>
                <div className="text-sm">Nome: {result.name}</div>
                <div className="text-sm">Tipo: {result.type}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
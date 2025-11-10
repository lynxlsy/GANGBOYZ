"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"

interface AdminEditModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  fields: {
    name: string
    label: string
    value: string
    type?: 'text' | 'textarea' | 'number'
  }[]
  onSave: (updatedFields: Record<string, string>) => void
}

export function AdminEditModal({ 
  isOpen, 
  onClose, 
  title, 
  fields, 
  onSave 
}: AdminEditModalProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(
    fields.reduce((acc, field) => {
      acc[field.name] = field.value
      return acc
    }, {} as Record<string, string>)
  )

  const handleSave = () => {
    onSave(fieldValues)
    onClose()
  }

  const handleFieldChange = (name: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <Textarea
                  value={fieldValues[field.name]}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className="min-h-[120px]"
                />
              ) : (
                <Input
                  type={field.type || 'text'}
                  value={fieldValues[field.name]}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
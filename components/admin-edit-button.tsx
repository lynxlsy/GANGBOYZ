"use client"

import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminEditButtonProps {
  onClick: () => void
  className?: string
}

export function AdminEditButton({ onClick, className = "" }: AdminEditButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`absolute top-2 right-2 z-10 bg-white/80 hover:bg-white border border-gray-300 shadow-md ${className}`}
    >
      <Pencil className="h-4 w-4 text-gray-700" />
    </Button>
  )
}
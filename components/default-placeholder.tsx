"use client"

interface DefaultPlaceholderProps {
  width?: number
  height?: number
  className?: string
  text?: string
}

export function DefaultPlaceholder({ 
  width = 400, 
  height = 400, 
  className = "",
  text = "ADICIONE SUA IMAGEM AQUI"
}: DefaultPlaceholderProps) {
  return (
    <div 
      className={`bg-gray-800 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center ${className}`}
      style={{ width, height }}
    >
      {/* Ícone de imagem */}
      <div className="mb-4">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
          <rect x="0" y="0" width="60" height="40" rx="4" fill="#6B7280" stroke="#9CA3AF" strokeWidth="2"/>
          <circle cx="15" cy="10" r="4" fill="#9CA3AF"/>
          <path d="M0 30L15 15L30 25L60 5V35H0V30Z" fill="#9CA3AF"/>
        </svg>
      </div>
      
      {/* Texto principal */}
      <p className="text-gray-400 text-sm font-medium text-center mb-1">
        {text}
      </p>
      
      {/* Texto secundário */}
      <p className="text-gray-500 text-xs text-center">
        Clique para fazer upload
      </p>
    </div>
  )
}



"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Info,
  ArrowRight,
  Zap
} from "lucide-react"


interface BannerSyncInstructionsProps {
  onSync?: () => void
  onMigrate?: () => void
  isSyncing?: boolean
  lastSync?: Date | null
}

export function BannerSyncInstructions({ 
  onSync, 
  onMigrate, 
  isSyncing = false, 
  lastSync 
}: BannerSyncInstructionsProps) {
  const [showInstructions, setShowInstructions] = useState(false)

  return (
    <div className="space-y-4">
      {/* Botão para mostrar/ocultar instruções */}
      <Button
        onClick={() => setShowInstructions(!showInstructions)}
        variant="outline"
        className="w-full"
      >
        <Info className="h-4 w-4 mr-2" />
        {showInstructions ? 'Ocultar Instruções' : 'Como Sincronizar com Firebase'}
      </Button>

      {showInstructions && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Sincronização em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Instruções passo a passo */}
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800">Como funciona:</h4>
              
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <p>Altere as imagens dos banners Hero 1 e Hero 2 usando o editor acima</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <p>As alterações são salvas automaticamente no localStorage</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <p>Clique em <strong>"Sincronizar Firebase"</strong> para enviar as mudanças para todos os usuários</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <p>As mudanças aparecerão imediatamente na homepage para todos os usuários</p>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-blue-200">
              <Button
                onClick={onSync}
                disabled={isSyncing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Cloud className="h-4 w-4 mr-2" />
                    Sincronizar Firebase
                  </>
                )}
              </Button>
              
              <Button
                onClick={onMigrate}
                disabled={isSyncing}
                variant="outline"
                className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <CloudOff className="h-4 w-4 mr-2" />
                Migrar para Firebase
              </Button>
            </div>

            {/* Informações adicionais */}
            <div className="text-xs text-blue-600 bg-blue-100 p-3 rounded-lg">
              <p><strong>💡 Dica:</strong> Use "Migrar para Firebase" apenas na primeira vez. Depois disso, use "Sincronizar Firebase" para atualizações.</p>
              <p><strong>⚡ Tempo real:</strong> Após sincronizar, as mudanças aparecem instantaneamente na homepage para todos os usuários.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

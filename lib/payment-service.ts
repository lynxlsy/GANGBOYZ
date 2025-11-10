// Payment Service - Sistema Real de Pagamento
import { toast } from "sonner"

export interface PaymentData {
  amount: number
  description: string
  payerEmail: string
  payerName: string
  items: Array<{
    id: string
    title: string
    quantity: number
    unit_price: number
  }>
  metadata: {
    orderId: string
    userId: string
    address: string
    city: string
    state: string
    cep: string
    phone: string
  }
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  qrCode?: string
  qrCodeBase64?: string
  paymentUrl?: string
  error?: string
}

class PaymentService {
  private accessToken: string
  private baseUrl: string = 'https://api.mercadopago.com'

  constructor() {
    // Em produção, use variáveis de ambiente
    this.accessToken = process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN || 'TEST-1234567890'
  }

  // Criar preferência de pagamento
  async createPaymentPreference(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      const preference = {
        items: paymentData.items,
        payer: {
          name: paymentData.payerName,
          email: paymentData.payerEmail,
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12
        },
        back_urls: {
          success: `${window.location.origin}/checkout/success`,
          failure: `${window.location.origin}/checkout/failure`,
          pending: `${window.location.origin}/checkout/pending`
        },
        auto_return: 'approved',
        external_reference: paymentData.metadata.orderId,
        metadata: paymentData.metadata
      }

      const response = await fetch(`${this.baseUrl}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preference)
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        paymentId: data.id,
        paymentUrl: data.init_point,
        qrCode: data.qr_code,
        qrCodeBase64: data.qr_code_base64
      }

    } catch (error) {
      console.error('Erro ao criar preferência de pagamento:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  // Processar pagamento PIX
  async processPixPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      const pixData = {
        transaction_amount: paymentData.amount,
        description: paymentData.description,
        payment_method_id: 'pix',
        payer: {
          email: paymentData.payerEmail,
          first_name: paymentData.payerName.split(' ')[0],
          last_name: paymentData.payerName.split(' ').slice(1).join(' '),
        },
        metadata: paymentData.metadata
      }

      const response = await fetch(`${this.baseUrl}/v1/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pixData)
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        paymentId: data.id,
        qrCode: data.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: data.point_of_interaction?.transaction_data?.qr_code_base64
      }

    } catch (error) {
      console.error('Erro ao processar PIX:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  // Verificar status do pagamento
  async checkPaymentStatus(paymentId: string): Promise<{ status: string; approved: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        status: data.status,
        approved: data.status === 'approved'
      }

    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error)
      return {
        status: 'error',
        approved: false
      }
    }
  }

  // Simular pagamento (para desenvolvimento)
  async simulatePayment(paymentData: PaymentData): Promise<PaymentResult> {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simular sucesso 90% das vezes
    const success = Math.random() > 0.1
    
    if (success) {
      return {
        success: true,
        paymentId: `sim_${Date.now()}`,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        qrCodeBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      }
    } else {
      return {
        success: false,
        error: 'Pagamento recusado pelo banco'
      }
    }
  }
}

export const paymentService = new PaymentService()

// Hook para usar o serviço de pagamento
export function usePayment() {
  const processPayment = async (paymentData: PaymentData, method: 'pix' | 'card' | 'simulate' = 'simulate') => {
    try {
      let result: PaymentResult

      switch (method) {
        case 'pix':
          result = await paymentService.processPixPayment(paymentData)
          break
        case 'card':
          result = await paymentService.createPaymentPreference(paymentData)
          break
        case 'simulate':
        default:
          result = await paymentService.simulatePayment(paymentData)
          break
      }

      if (result.success) {
        toast.success('Pagamento processado com sucesso!')
        return result
      } else {
        toast.error(result.error || 'Erro ao processar pagamento')
        return null
      }
    } catch (error) {
      console.error('Erro no processamento de pagamento:', error)
      toast.error('Erro interno do sistema')
      return null
    }
  }

  const checkPaymentStatus = async (paymentId: string) => {
    return await paymentService.checkPaymentStatus(paymentId)
  }

  return {
    processPayment,
    checkPaymentStatus
  }
}





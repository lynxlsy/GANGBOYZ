"use client"

import { Clock, Package, Truck, CreditCard } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: Clock,
      title: "ATENDIMENTO",
      subtitle: "Segunda à sexta das 9h00 às 17h00"
    },
    {
      icon: Package,
      title: "TROCAS E DEVOLUÇÕES",
      subtitle: "Primeira troca é grátis"
    },
    {
      icon: Truck,
      title: "FRETE",
      subtitle: "Grátis acima de R$349"
    },
    {
      icon: CreditCard,
      title: "PARCELAMENTO",
      subtitle: "Em até 10x sem juros no cartão"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <service.icon className="h-12 w-12 text-black" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2 uppercase">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {service.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}




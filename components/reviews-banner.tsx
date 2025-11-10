"use client"

import { Star } from "lucide-react"
import { useState, useEffect } from "react"

export function ReviewsBanner() {
  const customerReviews = [
    // 5 estrelas - Comentários excelentes
    {
      id: 1,
      name: "carlos_silva_92",
      comment: "chegou rapido demais, qualidade top",
      rating: 5
    },
    {
      id: 2,
      name: "ana_ribeiro",
      comment: "amo demais essa marca, sempre compro aqui",
      rating: 5
    },
    {
      id: 3,
      name: "pedro_oliveira",
      comment: "produto chegou certinho, recomendo",
      rating: 5
    },
    {
      id: 4,
      name: "julia_santos",
      comment: "primeira vez comprando e ja virei cliente",
      rating: 5
    },
    {
      id: 5,
      name: "rafael_costa",
      comment: "qualidade incrivel, vale cada centavo",
      rating: 5
    },
    {
      id: 6,
      name: "mariana_ferreira",
      comment: "entrega super rapida, produto lindo",
      rating: 5
    },
    // 4 estrelas - Comentários bons com pequenas ressalvas
    {
      id: 7,
      name: "lucas_mendes",
      comment: "produto bom, mas demorou um pouco pra chegar",
      rating: 4
    },
    {
      id: 8,
      name: "beatriz_alves",
      comment: "gostei do produto, qualidade ok",
      rating: 4
    },
    {
      id: 9,
      name: "gabriel_lima",
      comment: "produto legal, mas poderia ser mais barato",
      rating: 4
    },
    {
      id: 10,
      name: "camila_rocha",
      comment: "qualidade boa, entrega demorou um pouco",
      rating: 4
    },
    // 3 estrelas - Comentários medianos
    {
      id: 11,
      name: "diego_martins",
      comment: "produto ok, nada demais",
      rating: 3
    },
    {
      id: 12,
      name: "larissa_carvalho",
      comment: "produto mediano, esperava mais",
      rating: 3
    },
    {
      id: 13,
      name: "bruno_pereira",
      comment: "produto razoavel, entrega demorou",
      rating: 3
    },
    {
      id: 14,
      name: "fernanda_gomes",
      comment: "produto comum, qualidade media",
      rating: 3
    }
  ]

  const [currentReview, setCurrentReview] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % customerReviews.length)
    }, 2000) // Muda a cada 2 segundos

    return () => clearInterval(interval)
  }, [customerReviews.length])

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            VEJA O QUE OS CLIENTES DIZEM
          </h2>
          <div className="w-32 h-1 red-bg mx-auto rounded"></div>
        </div>

        {/* Review em destaque com layout organizado */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
            <div className="text-center">
              {/* Nome do usuário e estrelas na mesma linha */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-white font-semibold text-lg">
                  {customerReviews[currentReview].name}
                </span>
                <div className="flex">
                  {[...Array(customerReviews[currentReview].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  {/* Estrelas vazias para completar 5 */}
                  {[...Array(5 - customerReviews[currentReview].rating)].map((_, i) => (
                    <Star key={`empty-${i}`} className="h-5 w-5 text-gray-400" />
                  ))}
                </div>
              </div>
              
              {/* Comentário */}
              <p className="text-gray-200 text-xl italic leading-relaxed">
                "{customerReviews[currentReview].comment}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

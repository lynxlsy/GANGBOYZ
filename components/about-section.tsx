"use client"

export function AboutSection() {
  return (
    <section className="bg-black">
      {/* Seção Sobre */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              SOBRE A GANG BOYZ
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div className="max-w-5xl mx-auto mb-20">
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed text-left">
              Mais do que uma loja, uma referência no mercado quando falamos em excelência, 
              trazemos as peças mais exclusivas e sempre estamos por dentro da moda atual 
              para nossos clientes não ficarem para trás. Com +20 mil pedidos enviados, 
              +15 mil clientes atendidos, +1000 envios todo mês, hoje não há dúvida que 
              escolher a Gang Boyz é a escolha certa para seu guarda-roupa.
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold text-red-600 mb-4 tracking-tight">
                +20K
              </div>
              <p className="text-white font-bold text-xl mb-2">Pedidos Enviados</p>
              <p className="text-gray-500 text-base">Milhares de entregas realizadas</p>
            </div>

            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold text-red-600 mb-4 tracking-tight">
                +15K
              </div>
              <p className="text-white font-bold text-xl mb-2">Clientes Atendidos</p>
              <p className="text-gray-500 text-base">Pessoas que confiam na nossa marca</p>
            </div>

            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold text-red-600 mb-4 tracking-tight">
                +1K
              </div>
              <p className="text-white font-bold text-xl mb-2">Envios por Mês</p>
              <p className="text-gray-500 text-base">Entregas mensais garantidas</p>
            </div>
          </div>

          {/* Missão */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">
              NOSSA MISSÃO
            </h3>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto text-left">
              Ser a marca de streetwear mais autêntica do Brasil, representando a cultura 
              urbana com qualidade, estilo e inovação. Queremos que cada peça conte uma história 
              e que nossos clientes se sintam parte de uma comunidade que valoriza a expressão 
              individual através da moda.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

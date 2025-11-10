// Script para inicializar os conteúdos editáveis
const editableContents = [
  {
    id: "explore-title",
    title: "Título Explore",
    content: "EXPLORE NA GANG BOYZ"
  },
  {
    id: "explore-categories",
    title: "Categorias Explore",
    content: "Oversized\nEstampas\nLisos\nShorts\nVerão\nInverno"
  },
  {
    id: "offers-title",
    title: "Título Ofertas",
    content: "OFERTAS"
  },
  {
    id: "season-highlights-title",
    title: "Título Destaques da Temporada",
    content: "DESTAQUES DA TEMPORADA"
  },
  {
    id: "season-highlights-description",
    title: "Descrição Destaques da Temporada",
    content: "Explore nossas coleções mais populares e descubra peças únicas que definem o estilo urbano"
  },
  {
    id: "about-title",
    title: "Título Sobre",
    content: "SOBRE A GANG BOYZ"
  },
  {
    id: "about-description",
    title: "Descrição Sobre",
    content: "Mais do que uma loja, uma referência no mercado quando falamos em excelência, trazemos as peças mais exclusivas e sempre estamos por dentro da moda atual para nossos clientes não ficarem para trás. Com +20 mil pedidos enviados, +15 mil clientes atendidos, +1000 envios todo mês, hoje não há dúvida que escolher a Gang Boyz é a escolha certa para seu guarda-roupa."
  },
  {
    id: "about-stats-orders",
    title: "Estatísticas Pedidos",
    content: "+20K\nPedidos Enviados\nMilhares de entregas realizadas"
  },
  {
    id: "about-stats-clients",
    title: "Estatísticas Clientes",
    content: "+15K\nClientes Atendidos\nPessoas que confiam na nossa marca"
  },
  {
    id: "about-stats-monthly",
    title: "Estatísticas Mensais",
    content: "+1K\nEnvios por Mês\nEntregas mensais garantidas"
  },
  {
    id: "mission-title",
    title: "Título Missão",
    content: "NOSSA MISSÃO"
  },
  {
    id: "mission-description",
    title: "Descrição Missão",
    content: "Ser a marca de streetwear mais autêntica do Brasil, representando a cultura urbana com qualidade, estilo e inovação. Queremos que cada peça conte uma história e que nossos clientes se sintam parte de uma comunidade que valoriza a expressão individual através da moda."
  },
  {
    id: "services",
    title: "Serviços",
    content: "ATENDIMENTO\nSegunda à sexta das 9h00 às 17h00\n\nTROCAS E DEVOLUÇÕES\nPrimeira troca é grátis\n\nFRETE\nGrátis acima de R$349\n\nPARCELAMENTO\nEm até 10x sem juros no cartão"
  },
  {
    id: "banner-strip-texts",
    title: "Textos da Faixa de Promoção",
    content: "FRETE GRÁTIS ACIMA DE R$349\n10% OFF NA PRIMEIRA COMPRA\nTROCA GRÁTIS NA PRIMEIRA TROCA\nPARCELAMENTO EM ATÉ 10X SEM JUROS"
  },
  {
    id: "footer-description",
    title: "Descrição do Footer",
    content: "A marca de streetwear que representa a cultura urbana brasileira com estilo e autenticidade."
  }
];

// Salvar no localStorage
if (typeof window !== 'undefined') {
  localStorage.setItem("gang-boyz-editable-contents", JSON.stringify(editableContents));
  console.log("Conteúdos editáveis inicializados com sucesso!");
}

// Exportar para uso em Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = editableContents;
}
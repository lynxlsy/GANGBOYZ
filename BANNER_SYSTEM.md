# Sistema Unificado de Banners

Este sistema permite criar e gerenciar banners de forma rápida e eficiente, com configuração flexível baseada em proporções e características específicas.

## 🚀 Características Principais

- **Configuração Flexível**: Defina banners apenas especificando proporção e informações básicas
- **Sistema Unificado**: Um único sistema para todos os tipos de banner
- **Gerenciamento Automático**: Upload, crop, preview e sincronização automáticos
- **Responsivo**: Adapta-se automaticamente a diferentes tamanhos de tela
- **Real-time Sync**: Atualizações em tempo real entre admin e frontend

## 📁 Estrutura do Sistema

```
lib/
├── banner-config.ts          # Configurações dos banners
hooks/
├── use-banner.ts            # Hook universal para banners
components/
├── banner-renderer.tsx      # Componente universal de renderização
├── banner-strip-unified.tsx # Componente para faixas de aviso
└── banner-admin-unified.tsx # Painel de administração unificado
```

## 🛠️ Como Usar

### 1. Criar um Novo Banner

```typescript
// Em lib/banner-config.ts
export const BANNER_CONFIGS: BannerConfig[] = [
  // ... outros banners
  {
    id: "meu-banner",
    name: "Meu Banner",
    description: "Descrição do banner",
    aspectRatio: "16:9",
    dimensions: "1920x1080px",
    position: "Posição do banner",
    defaultImage: "/minha-imagem.svg",
    mediaTypes: ['image', 'video', 'gif'],
    maxFileSize: {
      image: "5MB",
      video: "10MB"
    },
    cropEnabled: true,
    storageKey: "meu-storage-key",
    eventName: "meuEvento"
  }
]
```

### 2. Usar o Banner no Frontend

```typescript
// Opção 1: Componente universal
<BannerRenderer
  bannerId="meu-banner"
  className="minha-classe"
  style={{ aspectRatio: '16/9' }}
  onClick={() => console.log('Clicado!')}
  showOverlay={true}
  overlayContent={<div>Conteúdo do overlay</div>}
/>

// Opção 2: Componente específico
export function MeuBanner({ className = "" }) {
  return (
    <BannerRenderer
      bannerId="meu-banner"
      className={`minha-classe ${className}`}
      style={{ aspectRatio: '16/9' }}
    />
  )
}
```

### 3. Gerenciar no Admin

```typescript
// Em app/admin/banners/meu-banner/page.tsx
<BannerAdmin
  storageKey="meu-storage-key"
  eventName="meuEvento"
  bannerConfigs={[meuBannerConfig]}
  stripConfig={BANNER_STRIP_CONFIGS.homepage} // opcional
/>
```

## 🎨 Componentes Disponíveis

### BannerRenderer
Componente universal para renderizar qualquer banner.

**Props:**
- `bannerId`: ID do banner na configuração
- `className`: Classes CSS adicionais
- `style`: Estilos inline
- `onClick`: Função de clique
- `showOverlay`: Mostrar overlay
- `overlayContent`: Conteúdo do overlay
- `fallbackContent`: Conteúdo de fallback

### Componentes Específicos
- `OffersBanner`: Banner de ofertas especiais (1248x624px)
- `FooterBanner`: Banner do footer (1200x400px)
- `HeroBanner`: Banner principal (1920x1080px)

### Faixas de Aviso
- `HomepageBannerStrip`: Faixa da homepage
- `CategoryBannerStrip`: Faixa das páginas de categoria

## ⚙️ Configuração de Faixas de Aviso

```typescript
// Em lib/banner-config.ts
export const BANNER_STRIP_CONFIGS = {
  homepage: {
    id: "homepage-banner-strip",
    name: "Faixa de Aviso Superior",
    storageKey: "gang-boyz-homepage-banner-strip",
    eventName: "bannerStripUpdated",
    defaultSettings: {
      text: "SITE DEMONSTRATIVO",
      isActive: true,
      emoji: "",
      bgColor: "black",
      height: 38,
      speed: 50,
      repetitions: 4
    }
  }
}
```

## 🔧 Hook useBanner

```typescript
const { banner, loading, error, config, updateBanner, deleteBanner } = useBanner("meu-banner")

// Atualizar banner
updateBanner({ currentImage: "nova-imagem.jpg" })

// Deletar banner
deleteBanner()
```

## 🎯 Exemplos de Uso Rápido

### Banner Quadrado (1:1)
```typescript
const squareBanner = createBannerConfig(
  "square-banner",
  "Banner Quadrado",
  "Banner com proporção 1:1",
  "1:1",
  "800x800px",
  "Seção de produtos"
)
```

### Banner Retrato (3:4)
```typescript
const portraitBanner = createBannerConfig(
  "portrait-banner",
  "Banner Retrato",
  "Banner com proporção 3:4",
  "3:4",
  "600x800px",
  "Sidebar"
)
```

### Banner Panorâmico (21:9)
```typescript
const wideBanner = createBannerConfig(
  "wide-banner",
  "Banner Panorâmico",
  "Banner ultra-wide",
  "21:9",
  "2100x900px",
  "Header principal"
)
```

## 🚀 Vantagens do Sistema

1. **Rapidez**: Crie banners em segundos
2. **Consistência**: Padrão unificado em todo o sistema
3. **Flexibilidade**: Suporte a qualquer proporção
4. **Manutenibilidade**: Fácil de atualizar e expandir
5. **Performance**: Carregamento otimizado e cache inteligente
6. **UX**: Interface intuitiva para administradores

## 📱 Responsividade

O sistema se adapta automaticamente a diferentes tamanhos de tela:
- Desktop: Tamanho completo
- Tablet: Proporção mantida, tamanho reduzido
- Mobile: Otimizado para touch

## 🔄 Sincronização

- **Real-time**: Mudanças refletem instantaneamente
- **Cross-tab**: Sincronização entre abas do navegador
- **Event-driven**: Sistema baseado em eventos customizados
- **localStorage**: Persistência local otimizada

## 🎨 Personalização

- **Cores**: Suporte a temas personalizados
- **Animações**: Transições suaves e efeitos hover
- **Overlays**: Gradientes e conteúdos customizados
- **Crop**: Recorte inteligente com preview

---

**Sistema criado para máxima eficiência e flexibilidade na criação de banners!** 🎯







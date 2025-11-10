#!/bin/bash

# 🚀 Script de Deploy Automático para Vercel
# Gang BoyZ E-commerce

echo "🚀 Iniciando deploy para Vercel..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    print_error "Execute este script na pasta raiz do projeto!"
    exit 1
fi

# Verificar se o git está configurado
if [ ! -d ".git" ]; then
    print_warning "Inicializando repositório Git..."
    git init
    git add .
    git commit -m "Initial commit - Gang BoyZ E-commerce"
fi

# Verificar se há alterações não commitadas
if [ -n "$(git status --porcelain)" ]; then
    print_status "Fazendo commit das alterações..."
    git add .
    git commit -m "Deploy para Vercel - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Verificar se está logado no Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Faça login no Vercel primeiro:"
    echo "vercel login"
    exit 1
fi

print_status "Iniciando deploy..."

# Deploy para produção
if vercel --prod; then
    print_success "Deploy concluído com sucesso!"
    print_success "Seu site está online!"
    
    # Obter URL do projeto
    PROJECT_URL=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)
    
    if [ ! -z "$PROJECT_URL" ]; then
        echo ""
        print_success "🎉 LINKS IMPORTANTES:"
        echo "🏠 Site Principal: $PROJECT_URL"
        echo "🔧 Dashboard Admin: $PROJECT_URL/admin"
        echo "🧹 Limpeza Admin: $PROJECT_URL/admin/limpar-tudo"
        echo ""
        print_success "📋 Envie estes links para o cliente:"
        echo "   • Site: $PROJECT_URL"
        echo "   • Admin: $PROJECT_URL/admin"
        echo ""
    fi
    
else
    print_error "Erro durante o deploy!"
    print_error "Verifique os logs acima para mais detalhes."
    exit 1
fi

print_success "✅ Deploy finalizado!"
print_status "Acesse o dashboard do Vercel para configurar variáveis de ambiente se necessário."


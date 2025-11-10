# 🚀 Script de Deploy Automático para Vercel (PowerShell)
# Gang BoyZ E-commerce

Write-Host "🚀 Iniciando deploy para Vercel..." -ForegroundColor Blue

# Verificar se está na pasta correta
if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] Execute este script na pasta raiz do projeto!" -ForegroundColor Red
    exit 1
}

# Verificar se o git está configurado
if (-not (Test-Path ".git")) {
    Write-Host "[WARNING] Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - Gang BoyZ E-commerce"
}

# Verificar se há alterações não commitadas
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "[INFO] Fazendo commit das alterações..." -ForegroundColor Blue
    git add .
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Deploy para Vercel - $timestamp"
}

# Verificar se o Vercel CLI está instalado
try {
    vercel --version | Out-Null
} catch {
    Write-Host "[WARNING] Vercel CLI não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g vercel
}

# Verificar se está logado no Vercel
try {
    vercel whoami | Out-Null
} catch {
    Write-Host "[WARNING] Faça login no Vercel primeiro:" -ForegroundColor Yellow
    Write-Host "vercel login" -ForegroundColor Cyan
    exit 1
}

Write-Host "[INFO] Iniciando deploy..." -ForegroundColor Blue

# Deploy para produção
try {
    vercel --prod
    
    Write-Host ""
    Write-Host "🎉 DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
    Write-Host "Seu site está online!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
    Write-Host "1. Acesse o dashboard do Vercel" -ForegroundColor White
    Write-Host "2. Configure as variáveis de ambiente" -ForegroundColor White
    Write-Host "3. Teste o site e admin" -ForegroundColor White
    Write-Host "4. Envie o link para o cliente" -ForegroundColor White
    
    Write-Host ""
    Write-Host "✅ Deploy finalizado!" -ForegroundColor Green
    Write-Host "Acesse o dashboard do Vercel para configurar variáveis de ambiente se necessário." -ForegroundColor Blue
    
} catch {
    Write-Host "[ERROR] Erro durante o deploy!" -ForegroundColor Red
    Write-Host "Verifique os logs acima para mais detalhes." -ForegroundColor Red
    exit 1
}


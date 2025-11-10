# 🚀 GUIA COMPLETO - DEPLOY NO VERCEL

## 📋 **PRÉ-REQUISITOS**

### **1. Conta no Vercel**
- ✅ Criar conta em: https://vercel.com
- ✅ Conectar com GitHub (recomendado)

### **2. Projeto no GitHub**
- ✅ Fazer commit de todas as alterações
- ✅ Push para o repositório GitHub

---

## 🎯 **MÉTODO 1: DEPLOY AUTOMÁTICO (RECOMENDADO)**

### **Passo 1: Preparar o Repositório**
```bash
# 1. Fazer commit de todas as alterações
git add .
git commit -m "Preparando para deploy no Vercel"
git push origin main
```

### **Passo 2: Conectar no Vercel**
1. **Acesse**: https://vercel.com/dashboard
2. **Clique em**: "New Project"
3. **Import Git Repository**: Selecione seu repositório
4. **Framework Preset**: Next.js (detectado automaticamente)
5. **Root Directory**: `./` (deixe como está)
6. **Build Command**: `npm run build` (automático)
7. **Output Directory**: `.next` (automático)

### **Passo 3: Configurar Variáveis de Ambiente**
No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```env
# Firebase (obrigatório)
FIREBASE_API_KEY=AIzaSyCMDmonQ6CyRCOuR-RQIBKwfneW9DCioag
FIREBASE_AUTH_DOMAIN=gang-boyz-ecommerce.firebaseapp.com
FIREBASE_PROJECT_ID=gang-boyz-ecommerce
FIREBASE_STORAGE_BUCKET=gang-boyz-ecommerce.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=1004653350686
FIREBASE_APP_ID=1:1004653350686:web:a3875f8d2861d8fcf2030f
FIREBASE_MEASUREMENT_ID=G-8MLJLG28G7

# NextAuth (opcional)
NEXTAUTH_URL=https://seu-projeto.vercel.app
NEXTAUTH_SECRET=sua_chave_secreta_aqui
```

### **Passo 4: Deploy**
1. **Clique em**: "Deploy"
2. **Aguarde**: 2-3 minutos para build
3. **Acesse**: O link gerado (ex: `https://gang-boyz-ecommerce.vercel.app`)

---

## 🎯 **MÉTODO 2: DEPLOY VIA CLI**

### **Passo 1: Instalar Vercel CLI**
```bash
npm i -g vercel
```

### **Passo 2: Login no Vercel**
```bash
vercel login
```

### **Passo 3: Deploy**
```bash
# Na pasta do projeto
vercel

# Seguir as instruções:
# ? Set up and deploy "~/gang-boyz-ecommerce"? [Y/n] y
# ? Which scope do you want to deploy to? [Seu usuário]
# ? Link to existing project? [N/y] n
# ? What's your project's name? gang-boyz-ecommerce
# ? In which directory is your code located? ./
```

### **Passo 4: Configurar Variáveis**
```bash
# Adicionar variáveis de ambiente
vercel env add FIREBASE_API_KEY
vercel env add FIREBASE_AUTH_DOMAIN
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_STORAGE_BUCKET
vercel env add FIREBASE_MESSAGING_SENDER_ID
vercel env add FIREBASE_APP_ID
vercel env add FIREBASE_MEASUREMENT_ID
```

### **Passo 5: Deploy de Produção**
```bash
vercel --prod
```

---

## 🔧 **CONFIGURAÇÕES IMPORTANTES**

### **1. Arquivo vercel.json** ✅
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "/admin/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### **2. Next.js Config** ✅
```javascript
// next.config.mjs
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}
```

### **3. Package.json** ✅
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

---

## 🌐 **DOMÍNIO PERSONALIZADO (OPCIONAL)**

### **1. Comprar Domínio**
- **Recomendado**: Namecheap, GoDaddy, ou Registro.br
- **Exemplo**: `gangboyz.com.br`

### **2. Configurar no Vercel**
1. **Vá em**: Project Settings > Domains
2. **Adicione**: Seu domínio personalizado
3. **Configure DNS**: Conforme instruções do Vercel

---

## 📱 **TESTANDO O DEPLOY**

### **1. Site Principal**
- ✅ Acesse: `https://seu-projeto.vercel.app`
- ✅ Verifique: Homepage carregando
- ✅ Teste: Navegação entre páginas

### **2. Dashboard Admin**
- ✅ Acesse: `https://seu-projeto.vercel.app/admin`
- ✅ Verifique: Interface admin funcionando
- ✅ Teste: Limpeza de dados (`/admin/limpar-tudo`)

### **3. Funcionalidades**
- ✅ Produtos: Carregamento e exibição
- ✅ Banners: Sistema funcionando
- ✅ Carrinho: Adicionar/remover produtos
- ✅ Favoritos: Sistema funcionando

---

## 🎯 **LINK PARA O CLIENTE**

### **URLs Importantes:**
```
🏠 Site Principal: https://seu-projeto.vercel.app
🔧 Dashboard Admin: https://seu-projeto.vercel.app/admin
🧹 Limpeza Admin: https://seu-projeto.vercel.app/admin/limpar-tudo
```

### **Credenciais de Acesso:**
- **Admin**: Acesso direto via URL `/admin`
- **Limpeza**: Use `/admin/limpar-tudo` para limpar dados de teste
- **Firebase**: Já configurado e funcionando

---

## 🚨 **SOLUÇÃO DE PROBLEMAS**

### **Erro de Build:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Erro de Variáveis:**
- ✅ Verificar se todas as variáveis estão configuradas
- ✅ Re-deploy após adicionar variáveis

### **Erro de Firebase:**
- ✅ Verificar configurações do Firebase
- ✅ Testar conexão local primeiro

---

## 📊 **MONITORAMENTO**

### **1. Vercel Analytics**
- ✅ Acesse: Dashboard do projeto
- ✅ Veja: Métricas de performance
- ✅ Monitore: Erros e logs

### **2. Firebase Console**
- ✅ Acesse: https://console.firebase.google.com
- ✅ Veja: Dados em tempo real
- ✅ Monitore: Uso e performance

---

## 🎉 **RESULTADO FINAL**

Após o deploy, você terá:
- ✅ **Site funcionando** em produção
- ✅ **Dashboard admin** limpo e profissional
- ✅ **Link público** para o cliente acessar
- ✅ **Sistema completo** de e-commerce
- ✅ **Firebase integrado** e funcionando

**🎯 Link para enviar ao cliente:**
```
https://seu-projeto.vercel.app
```

**🔧 Link do admin (para você):**
```
https://seu-projeto.vercel.app/admin
```


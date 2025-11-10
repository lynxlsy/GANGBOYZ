# 🔐 CONFIGURAÇÃO DE AUTENTICAÇÃO - INSTRUÇÕES COMPLETAS

## ✅ **STATUS ATUAL**
- ✅ NextAuth configurado com Google OAuth
- ✅ Páginas de login e registro criadas
- ✅ Contexto de usuário implementado
- ✅ Botões de favorito e carrinho criados
- ✅ Header atualizado com autenticação

## 🛠️ **PRÓXIMOS PASSOS PARA CONFIGURAR GOOGLE OAUTH**

### **1. Criar Projeto no Google Cloud Console**

1. **Acesse**: https://console.cloud.google.com/
2. **Crie um novo projeto** ou selecione um existente
3. **Nome do projeto**: `gang-boyz-ecommerce-auth`

### **2. Habilitar Google+ API**

1. **Vá para**: APIs & Services > Library
2. **Procure por**: "Google+ API"
3. **Clique em**: "Enable"

### **3. Configurar OAuth Consent Screen**

1. **Vá para**: APIs & Services > OAuth consent screen
2. **Escolha**: "External" (para usuários externos)
3. **Preencha**:
   - App name: `Gang BoyZ E-commerce`
   - User support email: `seu@email.com`
   - Developer contact: `seu@email.com`
4. **Clique em**: "Save and Continue"

### **4. Criar Credenciais OAuth**

1. **Vá para**: APIs & Services > Credentials
2. **Clique em**: "Create Credentials" > "OAuth 2.0 Client IDs"
3. **Application type**: "Web application"
4. **Name**: `Gang BoyZ Web Client`
5. **Authorized redirect URIs**:
   ```
   http://localhost:3001/api/auth/callback/google
   https://seudominio.com/api/auth/callback/google
   ```
6. **Clique em**: "Create"

### **5. Copiar Credenciais**

Após criar, você receberá:
- **Client ID**: `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abcdefghijklmnop`

### **6. Configurar Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=sua_chave_secreta_aqui

# Firebase Configuration (já configurado)
FIREBASE_API_KEY=AIzaSyCMDmonQ6CyRCOuR-RQIBKwfneW9DCioag
FIREBASE_AUTH_DOMAIN=gang-boyz-ecommerce.firebaseapp.com
FIREBASE_PROJECT_ID=gang-boyz-ecommerce
FIREBASE_STORAGE_BUCKET=gang-boyz-ecommerce.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=1004653350686
FIREBASE_APP_ID=1:1004653350686:web:a3875f8d2861d8fcf2030f
FIREBASE_MEASUREMENT_ID=G-8MLJLG28G7
```

### **7. Gerar NEXTAUTH_SECRET**

Execute no terminal:
```bash
openssl rand -base64 32
```

Use o resultado como `NEXTAUTH_SECRET`

## 🎯 **FUNCIONALIDADES IMPLEMENTADAS**

### **✅ Autenticação:**
- **Login com Google**: OAuth 2.0 completo
- **Login com Email**: Formulário tradicional
- **Registro**: Criação de conta
- **Logout**: Sair da conta

### **✅ Interface de Usuário:**
- **Header**: Botão de login/logout dinâmico
- **Dropdown**: Menu do usuário com opções
- **Páginas**: Login e registro estilizadas
- **Responsivo**: Funciona em mobile e desktop

### **✅ Funcionalidades de Usuário:**
- **Favoritos**: Curtir produtos (salvo no localStorage)
- **Carrinho**: Adicionar produtos (integração com sistema existente)
- **Perfil**: Informações do usuário
- **Pedidos**: Histórico de compras

### **✅ Componentes Criados:**
- **AuthButton**: Botão de login/logout no header
- **FavoriteButton**: Botão de curtir produtos
- **AddToCartButton**: Botão de adicionar ao carrinho
- **UserProvider**: Contexto para gerenciar estado do usuário

## 🚀 **COMO TESTAR**

### **1. Configurar Credenciais:**
1. Siga os passos 1-6 acima
2. Configure o arquivo `.env.local`
3. Reinicie o servidor: `npm run dev`

### **2. Testar Login:**
1. **Acesse**: http://localhost:3001
2. **Clique em**: "Entrar" no header
3. **Teste**: Login com Google
4. **Verifique**: Dropdown do usuário aparece

### **3. Testar Funcionalidades:**
1. **Favoritos**: Clique no coração nos produtos
2. **Carrinho**: Adicione produtos ao carrinho
3. **Perfil**: Acesse menu do usuário

## 🔧 **ESTRUTURA DE ARQUIVOS**

```
app/
├── auth/
│   ├── signin/page.tsx          # Página de login
│   └── signup/page.tsx          # Página de registro
├── api/auth/[...nextauth]/
│   └── route.ts                 # API route do NextAuth
components/
├── auth-button.tsx              # Botão de autenticação
├── favorite-button.tsx          # Botão de favorito
└── add-to-cart-button.tsx       # Botão de carrinho
lib/
├── auth.ts                      # Configuração NextAuth
└── user-context.tsx             # Contexto do usuário
```

## 🎉 **RESULTADO FINAL**

✅ **Sistema Completo de Autenticação:**
- Login com Google OAuth
- Login com email/senha
- Registro de usuários
- Favoritos por usuário
- Carrinho integrado
- Interface responsiva

**Após configurar as credenciais do Google, o sistema estará funcionando completamente!** 🚀






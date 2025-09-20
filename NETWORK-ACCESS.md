# 🌐 Acesso em Rede - Gang Boyz E-commerce

## 📋 Como Rodar o Projeto para Acesso Externo

### 🚀 Desenvolvimento (com hot reload)
```bash
npm run dev:network
```

### 🏗️ Produção (build + start)
```bash
npm run build
npm run start:network
```

## 🔗 URLs de Acesso

### 📱 Rede Local (mesma rede WiFi)
- **IP Local**: `http://[SEU_IP_LOCAL]:3000`
- **Exemplo**: `http://192.168.1.100:3000`

### 🌍 Acesso Externo (Internet)
Para acesso externo, você precisará de um túnel. Recomendamos:

#### Opção 1: ngrok (Mais fácil)
1. Instale o ngrok: https://ngrok.com/download
2. Execute: `ngrok http 3000`
3. Use a URL fornecida (ex: `https://abc123.ngrok.io`)

#### Opção 2: Cloudflare Tunnel
1. Instale: `npm install -g cloudflared`
2. Execute: `cloudflared tunnel --url http://localhost:3000`

## 🔧 Configurações Importantes

### 🛡️ Firewall
- Certifique-se de que a porta 3000 está liberada no firewall
- Windows: Permitir aplicação através do firewall

### 📡 Rede
- O projeto agora roda em `0.0.0.0:3000` (todas as interfaces)
- Funciona tanto em WiFi quanto cabo ethernet
- Compatível com dispositivos móveis na mesma rede

## 📱 Testando o Acesso

1. **Rede Local**: Acesse `http://[SEU_IP]:3000` de qualquer dispositivo na mesma rede
2. **Externo**: Use ngrok ou similar para criar um túnel público
3. **Mobile**: Teste em smartphones/tablets conectados à mesma rede

## ⚠️ Notas de Segurança

- **Desenvolvimento**: Use apenas em redes confiáveis
- **Produção**: Configure HTTPS e autenticação adequada
- **Dados**: Não exponha dados sensíveis em desenvolvimento

## 🆘 Solução de Problemas

### Porta já em uso
```bash
# Encontrar processo usando porta 3000
netstat -ano | findstr :3000

# Matar processo (Windows)
taskkill /PID [PID_NUMBER] /F
```

### Não consegue acessar externamente
1. Verifique firewall
2. Confirme que está usando `dev:network` ou `start:network`
3. Teste primeiro na rede local antes de usar túnel externo




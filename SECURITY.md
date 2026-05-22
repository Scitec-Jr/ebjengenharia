# Guia de Segurança - Deployment Production

## Checklist de Segurança Implementado ✅

### Críticos
- [x] **Autenticação obrigatória** em rotas de escrita (POST, PUT, DELETE)
  - Middleware valida tokens JWT em todas as operações
  - Sem token = 401 Unauthorized
  
- [x] **Rate Limiting no Login**
  - Máximo 5 tentativas em 15 minutos por IP
  - Retorna status 429 (Too Many Requests)
  
- [x] **JWT_SECRET obrigatório**
  - Aplicação falha ao iniciar sem a variável de ambiente
  - Evita uso de secret padrão fraco

- [x] **Validação de Content-Type**
  - API valida `application/json` em requisições POST/PUT
  - Rejeita requisições com content-type inválido

### Médios
- [x] **CORS configurado**
  - Apenas origens permitidas podem consumir a API
  - Whitelist de domínios em variável de ambiente
  
- [x] **Prepared Statements**
  - Proteção contra SQL Injection
  - Todos os queries usam placeholders `?`

- [x] **Cookies HttpOnly**
  - Tokens JWT em cookies seguros
  - `Secure` flag ativa em production
  - `SameSite=lax` contra CSRF

## Variáveis de Ambiente Obrigatórias

Criar arquivo `.env.local` (não fazer commit):

```env
DB_HOST=seu_host
DB_USER=seu_user
DB_PASSWORD=sua_senha_forte
DB_NAME=ebjengenharia
JWT_SECRET=uma_chave_muito_segura_com_minimo_32_caracteres_aleatorios
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
ALLOWED_ORIGINS=https://ebjengenharia.com.br,https://www.ebjengenharia.com.br
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://ebjengenharia.com.br
```

**Gerar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Checklist de Deployment

### Antes de ir para Production

- [ ] Variáveis de ambiente definidas no servidor
- [ ] JWT_SECRET contém mínimo 32 caracteres aleatórios
- [ ] Database com backup configurado
- [ ] HTTPS habilitado em todo o domínio
- [ ] NODE_ENV=production no servidor
- [ ] Logs configurados em arquivo
- [ ] Monitoramento de erros ativo (Sentry, etc)
- [ ] Database credentials em variáveis de ambiente, não hardcoded
- [ ] Banco de dados com user específico (não root)
- [ ] User do banco com permissões mínimas (só SELECT, INSERT, UPDATE, DELETE necessários)

### Configuração do Servidor

**1. Proteger arquivo .env.local:**
```bash
chmod 600 .env.local
```

**2. Verificar permissões:**
```bash
# Rodando como user não-root
whoami
# Output: seu_app_user (não root)
```

**3. Configurar rate limiting em produção:**
- Considerar usar Redis em lugar de memória
- Implementação atual em memória reseta a cada restart
- Para scale com múltiplos servidores, use Redis

**4. Logs e Monitoramento:**
```bash
# Monitorar processo
npm install -g pm2
pm2 start "npm start" --name "ebjengenharia"
pm2 logs ebjengenharia
```

## Endpoints Protegidos

| Método | Endpoint | Requer Auth |
|--------|----------|-------------|
| GET | `/api/servicos` | ❌ Público |
| POST | `/api/servicos` | ✅ Sim |
| PUT | `/api/servicos/[id]` | ✅ Sim |
| DELETE | `/api/servicos/[id]` | ✅ Sim |
| POST | `/api/user` | ❌ Login |
| POST | `/api/user/create` | ❌ Criação |
| GET | `/api/user/verify` | ✅ Sim |
| POST | `/api/user/logout` | ✅ Sim |

## Resposta de Erros

**400 Bad Request:**
```json
{ "error": "Nome e senha são obrigatórios" }
```

**401 Unauthorized:**
```json
{ "error": "Token inválido ou expirado" }
```

**429 Too Many Requests:**
```json
{ "error": "Muitas tentativas de login. Tente novamente em alguns minutos." }
```

## Monitoramento Recomendado

- Logs de login (sucessos e falhas)
- Alertas para múltiplas tentativas de login falhadas
- Backup diário do banco de dados
- Monitoramento de uptime
- Alertas para erros 5xx

## Futuras Melhorias

1. **Rate Limiting distribuído:**
   - Implementar com Redis para suportar múltiplas instâncias

2. **Auditoria de ações:**
   - Log de quem criou/editou/deletou serviços
   - Timestamps e IPs

3. **2FA (Two-Factor Authentication):**
   - Autenticação em dois passos

4. **OAuth2/OIDC:**
   - Integração com provedores de identidade

5. **API Keys para integrações:**
   - Permissões granulares por chave

6. **CSRF Tokens:**
   - Implementar tokens CSRF para formulários

---

**Última atualização:** 22 de Maio, 2026
**Status:** Pronto para Production ✅

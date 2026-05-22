# Segurança - Resumo das Alterações

## O que foi implementado:

### 1. **Autenticação em Rotas de API** ✅
- Middleware em `src/middleware.ts` protege todos os endpoints
- POST/PUT/DELETE em `/api/*` requerem JWT válido
- GET de dados públicos não requerem autenticação

### 2. **Rate Limiting no Login** ✅
- Máximo 5 tentativas em 15 minutos por IP
- Retorna 429 Too Many Requests quando excedido
- Implementado em `src/lib/rateLimit.ts`

### 3. **JWT_SECRET Obrigatório** ✅
- Aplicação falha ao iniciar sem `JWT_SECRET` definido
- Evita usar secrets padrão fracos
- Verificação em `src/lib/auth.ts`

### 4. **CORS Configurado** ✅
- Apenas domínios permitidos podem consumir a API
- Whitelist controlada por `ALLOWED_ORIGINS`
- Implementado em `src/lib/cors.ts`

### 5. **Validação de Content-Type** ✅
- API valida `application/json` em POST/PUT
- Rejeita requisições com tipo inválido
- Implementado em cada endpoint

### 6. **Proteção de Upload** ✅
- Validação de tipos de arquivo (apenas imagens)
- Limite de tamanho: 10MB por arquivo
- Content-type check para multipart/form-data

---

## Arquivos Criados/Modificados:

### Novos Arquivos:
- `src/middleware.ts` - Proteção de rotas
- `src/lib/rateLimit.ts` - Rate limiting
- `src/lib/cors.ts` - Configuração CORS
- `src/lib/csrf.ts` - Tokens CSRF (preparado para uso futuro)
- `.env.example` - Template de variáveis
- `SECURITY.md` - Guia completo de segurança

### Modificados:
- `src/lib/auth.ts` - JWT_SECRET obrigatório
- `src/app/api/user/route.ts` - Rate limiting + validações
- `src/app/api/servicos/route.ts` - CORS + validações
- `src/app/api/servicos/[id]/route.ts` - CORS + validações
- `src/app/api/servicos/reorder/route.ts` - CORS + validações
- `src/app/api/servicos/upload/route.ts` - Validações de arquivo
- `package.json` - Adicionado `jose` para JWT

---

## Como Deployar:

### 1. **Instalar dependências:**
```bash
npm install
```

### 2. **Configurar .env.local** (não fazer commit):
```bash
cp .env.example .env.local
# Editar com valores reais:
# - DB_PASSWORD: senha forte
# - JWT_SECRET: gerar com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# - CLOUDINARY_API_KEY e API_SECRET
# - ALLOWED_ORIGINS: seus domínios
```

### 3. **Testar localmente:**
```bash
npm run dev
# Testar endpoints em http://localhost:3000
```

### 4. **Build para produção:**
```bash
npm run build
npm start
# Ou com PM2:
pm2 start "npm start" --name "ebjengenharia"
```

### 5. **Verificar variáveis de ambiente:**
- [ ] DB_HOST, DB_USER, DB_PASSWORD, DB_NAME definidos
- [ ] JWT_SECRET definido (mín 32 caracteres)
- [ ] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME definido
- [ ] CLOUDINARY_API_KEY e API_SECRET definidos
- [ ] ALLOWED_ORIGINS configurado com seus domínios
- [ ] NODE_ENV=production

---

## Testando a Segurança:

### 1. **Rate Limiting (tentar logar 6x em 15min):**
```bash
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/user \
    -H "Content-Type: application/json" \
    -d '{"nome":"test","senha":"test"}'
done
# Deve retornar 429 na 6ª tentativa
```

### 2. **Autenticação (sem token):**
```bash
curl -X POST http://localhost:3000/api/servicos \
  -H "Content-Type: application/json" \
  -d '{"nome":"test","valor":100}'
# Deve retornar 401 Unauthorized
```

### 3. **CORS (domínio não permitido):**
```bash
curl -X GET http://localhost:3000/api/servicos \
  -H "Origin: http://another-domain.com"
# Headers CORS não aparecem se origem não está permitida
```

### 4. **Content-Type (inválido):**
```bash
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: text/plain" \
  -d 'nome=test&senha=test'
# Deve retornar 400 Bad Request
```

---

## Próximos Passos Recomendados:

1. **Rate Limiting Distribuído:**
   - Para múltiplos servidores, implementar com Redis

2. **Monitoramento:**
   - Sentry para erros
   - Datadog/CloudWatch para logs
   - Alertas para tentativas suspeitas

3. **Backup Automático:**
   - Backup diário do banco de dados
   - Retenção de 30 dias

4. **2FA (Two-Factor Authentication):**
   - Adicionar verificação em 2 passos

5. **Auditoria:**
   - Log de todas as ações admin
   - Quem criou/editou/deletou e quando

---

## Documentação Completa:
Ver `SECURITY.md` para guia de segurança em produção.

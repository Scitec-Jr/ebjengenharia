# Sistema de Autenticação - EBJ Engenharia

## Estrutura Implementada

### 📁 Arquivos Criados

#### 1. **Banco de Dados**
- `src/server/db/connection.ts` - Gerenciador de conexões MySQL
- `src/server/db/seed-admin.sql` - Script para inserir usuário de teste

#### 2. **Autenticação**
- `src/lib/auth.ts` - Funções de hash, JWT, cookies e verificação

#### 3. **APIs**
- `src/app/api/user/route.ts` - **POST /api/user** - Login do usuário
- `src/app/api/user/verify/route.ts` - **GET /api/user/verify** - Verifica autenticação
- `src/app/api/user/logout/route.ts` - **POST /api/user/logout** - Logout

#### 4. **Páginas**
- `src/app/adm/login/page.tsx` - Página de login
- `src/app/adm/page.tsx` - Home do admin (protegida)

#### 5. **Middleware**
- `src/middleware.ts` - Proteção de rotas (redireciona não autenticados para login)

#### 6. **Configuração**
- `.env.local` - Variáveis de ambiente

---

## 🔐 Fluxo de Autenticação

```
1. Usuário acessa /adm
   ↓
2. Middleware verifica token nos cookies
   ↓
3. Se não houver token → Redireciona para /adm/login
   ↓
4. Usuário faz login em /adm/login
   ↓
5. POST /api/user com (nome, senha)
   ↓
6. Backend valida credenciais no banco
   ↓
7. Se válido → Gera JWT e define cookie httpOnly
   ↓
8. Redireciona para /adm
   ↓
9. Middleware valida token → Permite acesso
```

---

## 📝 Configuração Inicial

### 1. **Variáveis de Ambiente** (`.env.local`)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ebjengenharia
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 2. **Criar Tabela `user` no Banco de Dados**
```sql
CREATE TABLE user (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(90) NOT NULL UNIQUE,
    senha VARCHAR(90) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. **Criar Usuário de Teste**

**Opção A - Usando o script (Recomendado)**
```bash
npm run create-user admin admin123
```

**Opção B - Executar SQL Diretamente**
```sql
-- Insira o usuário de teste com senha criptografada
INSERT INTO user (nome, senha) VALUES 
('admin', '$2b$10$YIjlrJxHUHyYx.XGxB8Kie0PeS/gD9K2xZL5Pk3Kq.VCzZ0K9K26i');
-- Senha: admin123
```

---

## 🚀 Como Usar

### **Desenvolvimento**
```bash
npm run dev
```

### **Acessar o Painel de Admin**
1. Navegue para `http://localhost:3000/adm`
2. Será redirecionado para `http://localhost:3000/adm/login`
3. Login com as credenciais:
   - **Usuário:** admin
   - **Senha:** admin123
4. Após autenticado, terá acesso ao painel em `/adm`

### **Criar Novo Usuário**
```bash
npm run create-user <nome> <senha>
```

**Exemplo:**
```bash
npm run create-user gerente senha123
```

### **Fazer Logout**
Clique no botão "Logout" no painel do admin.

---

## 🔒 Recursos de Segurança

✅ **Senha com Hash Bcrypt** - Senhas nunca são armazenadas em texto plano
✅ **JWT com Expiração** - Token expira em 24 horas
✅ **Cookies HttpOnly** - Protegido contra XSS
✅ **Middleware de Proteção** - Rotas `/adm` protegidas automaticamente
✅ **Secure Flag** - Cookie seguro em produção
✅ **CSRF Protection** - SameSite Lax

---

## 📡 Endpoints da API

### **POST /api/user** - Login
```bash
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -d '{"nome":"admin","senha":"admin123"}'
```

**Resposta (200):**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "nome": "admin"
  }
}
```

**Resposta (401):**
```json
{
  "error": "Usuário ou senha inválidos"
}
```

### **GET /api/user/verify** - Verificar Autenticação
```bash
curl http://localhost:3000/api/user/verify \
  -H "Cookie: auth-token=<seu-jwt>"
```

**Resposta (200):**
```json
{
  "authenticated": true,
  "user": {
    "userId": 1,
    "nome": "admin"
  }
}
```

**Resposta (401):**
```json
{
  "error": "Não autenticado"
}
```

### **POST /api/user/logout** - Logout
```bash
curl -X POST http://localhost:3000/api/user/logout
```

**Resposta (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 🛠️ Próximas Melhorias

- [ ] Dashboard com estatísticas
- [ ] Gerenciamento de usuários (CRUD)
- [ ] Controle de permissões por role
- [ ] Auditoria de login
- [ ] Recuperação de senha
- [ ] 2FA (Autenticação em Duas Etapas)
- [ ] Refresh token automático

---

## ⚠️ Notas Importantes

1. **Altere `JWT_SECRET`** em produção com uma chave segura
2. **Ative HTTPS** em produção para cookies Secure
3. **Configure variáveis de ambiente** corretamente
4. **Backup do banco de dados** regularmente
5. **Use HTTPS** em produção (força automaticamente Secure flag)

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do:
- [Next.js](https://nextjs.org/docs)
- [JWT](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)

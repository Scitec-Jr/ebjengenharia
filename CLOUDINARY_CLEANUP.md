# Limpeza Automática do Cloudinary

## Implementação Concluída ✅

Agora quando você **deleta** ou **atualiza** serviços com imagens, as pastas antigas no Cloudinary são automaticamente deletadas para liberar espaço.

---

## Como Funciona

### 1. **Ao DELETAR um serviço:**
```
1. Serviço é deletado do banco de dados
2. Pasta inteira no Cloudinary é deletada (todas as imagens)
3. Prioridades são reordenadas
4. Resposta é enviada ao cliente (sem esperar a limpeza do Cloudinary)
```

**Fluxo no Cloudinary:**
- Busca todos os arquivos na pasta `ebjengenharia/servicos/{slug}`
- Deleta cada arquivo individualmente
- Pasta fica vazia e é removida automaticamente

### 2. **Ao fazer UPDATE com novas imagens:**
```
1. Usuário faz upload das novas imagens (para um novo slug/caminho)
2. Usuário atualiza o serviço enviando o novo caminho_imagens
3. Pasta antiga é deletada do Cloudinary
4. Banco de dados é atualizado com o novo caminho
```

**Exemplos:**

#### Caso 1: Renomear serviço (muda o slug)
```json
// Antes
{
  "slug": "casa_azul",
  "caminho_imagens": "ebjengenharia/servicos/casa_azul",
  "quantidade_imagens": 3
}

// UPDATE com novo nome
{
  "nome": "Casa Azul Reformada"  // novo slug: casa_azul_reformada
}

// Resultado
// - Pasta "ebjengenharia/servicos/casa_azul" é deletada do Cloudinary
// - Serviço agora aponta para "ebjengenharia/servicos/casa_azul_reformada"
// - (novas imagens precisam ser feitas upload separadamente)
```

#### Caso 2: Atualizar imagens
```json
// Novo upload feito com novo caminho
POST /api/servicos/upload
FormData: nome="Casa Azul", files=[nova_imagem_1, nova_imagem_2]
Response: { caminho_imagens: "ebjengenharia/servicos/casa_azul_reformada_v2" }

// UPDATE enviando novo caminho
PUT /api/servicos/123
{
  "caminho_imagens": "ebjengenharia/servicos/casa_azul_reformada_v2",
  "quantidade_imagens": 2
}

// Resultado
// - Pasta antiga "ebjengenharia/servicos/casa_azul_reformada" é deletada
// - Banco de dados atualizado com novo caminho
```

---

## Arquivos Modificados

### 1. **Novo arquivo:**
- `src/lib/cloudinaryUtils.ts` - Funções para deletar pastas/arquivos

### 2. **Atualizados:**
- `src/app/api/servicos/[id]/route.ts`
  - DELETE: Deleta pasta ao remover serviço
  - PUT: Deleta pasta antiga ao atualizar caminho/imagens
- `src/types/servico.ts`
  - Adicionado `caminho_imagens?` ao `AtualizarServicoInput`

---

## Comportamento de Erros

### Se a limpeza do Cloudinary falhar:
- ✅ Operação no banco de dados é **mantida**
- ✅ Cliente recebe resposta de sucesso (200/201/204)
- ⚠️ Erro é **logado no console** do servidor
- ⚠️ Pasta fica orphan no Cloudinary (ocupa espaço)

**Por quê?** Porque é melhor ter dados no banco/Cloudinary do que perder dados do serviço.

### Solução se tiver pastas orphans:
```javascript
// Script para limpar pastas órfãs (conexão direta Cloudinary):
const cloudinary = require('cloudinary').v2;

async function limparOrphans() {
  const resources = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'ebjengenharia/servicos/'
  });
  
  // Verificar quais pastas não têm correspondência no BD
  // E deletá-las manualmente via painel Cloudinary
}
```

---

## Fluxo Recomendado para o Usuário

### Para CRIAR um novo serviço:
```
1. POST /api/servicos (criar sem imagens)
   → Retorna: id do serviço

2. POST /api/servicos/upload?nome=Nome
   → Upload das imagens
   → Retorna: caminho_imagens

3. PUT /api/servicos/{id}
   → Atualiza com caminho_imagens e quantidade
   → Imagens aparecem no site
```

### Para EDITAR imagens:
```
1. POST /api/servicos/upload?nome=Nome (com novas imagens)
   → Retorna: novo caminho_imagens

2. PUT /api/servicos/{id}
   → Envia novo caminho_imagens e quantidade
   → Pasta antiga é deletada automaticamente
   → Novas imagens aparecem
```

### Para DELETAR:
```
1. DELETE /api/servicos/{id}
   → Serviço removido do BD
   → Pasta inteira do Cloudinary é removida
   → Espaço é liberado
```

---

## Monitoramento

Para monitorar limpezas do Cloudinary, verifique os logs do servidor:

```bash
# Sucesso
[Serviço deletado] → Pasta "ebjengenharia/servicos/casa_azul" removida do Cloudinary

# Erro
[Erro ao deletar pasta do Cloudinary] → Verificar credenciais/permissões

# Verificar uso de espaço
https://console.cloudinary.com → Media Library → Storage
```

---

## Segurança

- ✅ Limpeza é **assíncrona** (não bloqueia resposta)
- ✅ Erros de limpeza **não afetam** dados do BD
- ✅ Requer **autenticação** (token JWT válido)
- ✅ Credenciais Cloudinary são **variáveis de ambiente**

---

## Resumo de Benefícios

| Antes | Depois |
|-------|--------|
| Pastas acumulavam no Cloudinary | Pastas antigas são deletadas |
| Espaço era desperdiçado | Espaço é liberado automaticamente |
| Usuário tinha que limpar manualmente | Automático ao deletar/atualizar |
| Sem log de limpeza | Logs disponíveis no console |

---

**Status:** Pronto para produção ✅

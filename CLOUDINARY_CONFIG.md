# Configuração de Variáveis de Ambiente

## Cloudinary (Serviços/Imóveis com Imagens)

Adicione as seguintes variáveis ao `.env.local`:

```env
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

### Como obter as credenciais:

1. Crie uma conta em [cloudinary.com](https://cloudinary.com)
2. Acesse o Dashboard
3. Na seção "API Keys", você encontrará:
    - **Cloud Name**: seu nome de nuvem único
    - **API Key**: chave pública (pode ser exposta no frontend)
    - **API Secret**: chave secreta (NÃO exponha, use apenas no backend)

## Banco de Dados

O projeto já está configurado com as variáveis:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=ebjengenharia
JWT_SECRET=sua_chave_secreta
```

## Estrutura de Imagens no Cloudinary

As imagens são organizadas assim:

```
ebjengenharia/
├── servicos/
│   ├── casa-alto-padrao/
│   │   ├── 1 (imagem 1)
│   │   ├── 2 (imagem 2)
│   │   └── 3 (imagem 3)
│   └── residencial-mercurio/
│       ├── 1
│       └── 2
```

**Importante**: O banco de dados armazena apenas:

- `caminho_imagens`: `"ebjengenharia/servicos/casa-alto-padrao"`
- `quantidade_imagens`: `3`

O frontend gera automaticamente as URLs: `${caminho}/1`, `${caminho}/2`, etc.

# Auraviva — Status de integração API

## ✅ Concluído — ligado ao banco de dados

### Autenticação e conta
- Login (Spring Security)
- Cadastro de cliente e de funcionário
- Esqueci minha senha (solicitar código → validar código → nova senha)
- Atualizar nome e telefone do perfil (`PUT /usuarios/me`)
- Alterar senha própria (`PUT /usuarios/me/alterar-senha`)

### Endereços
- Listar, criar, editar e excluir endereços de entrega (`/enderecos`)

### Lista de desejos (Wishlist)
- Listar, adicionar e remover produtos favoritos (`/wishlist`)

### Newsletter
- Inscrição pelo rodapé da home (`POST /newsletter/inscrever`)
- Listagem de inscritos (painel de funcionários)

### Catálogo de produtos
- Criar, editar, ativar e inativar produtos pelo painel do funcionário

### Blog
- Listar artigos do banco na página Blog (com fallback para estáticos)
- Abrir artigo por id do banco (`/artigos/bd-{id}`)
- Criar, editar e inativar artigos pelo painel do funcionário (aba "Blog e conteúdos")

### Pedidos e rastreio
- Criar pedido, atualizar etapa e cancelar
- Salvar código de rastreio, previsão de entrega e endereço de entrega (`PUT /vendas/{id}/rastreio`)

### Fale conosco
- Mensagens enviadas ao banco (`POST /mensagens/enviar`)

---

## 🔲 Não ligado ao banco (ficou em localStorage para o TCC)

- Upload binário de foto de perfil (localStorage)
- Avaliações de produtos (localStorage)
- Movimentações de estoque (localStorage)
- Rastreio de entrega por código externo (correios / transportadora) — apenas salva o código internamente
- Relatórios (calculados dos dados locais)

---

## 🗄️ Novas tabelas no banco (acrescentar ao Somee)

Se o banco já foi criado, rode o trecho adicionado ao final de `database/bd_auraviva_sqlserver.sql`:
- `dbo.Endereco`
- `dbo.Wishlist`
- `dbo.Newsletter`
- Novas colunas em `dbo.Venda`: `codigoRastreio`, `previsaoEntrega`, `enderecoEntrega`
- Nova coluna em `dbo.Blog`: `imagemUrl`

---

## 🚀 Para publicar

1. **Banco** → execute `database/bd_auraviva_sqlserver.sql` inteiro no Somee (SQL Server).
2. **API** → faça o deploy do `backend/` no Railway, Render ou Azure. Edite `backend/.env`.
3. **Front-end** → edite `frontend/.env` com a URL da API e faça o deploy no Vercel, Netlify ou GitHub Pages.

# AuraViva - Backend (Spring Boot)

API REST em **Java 21 + Spring Boot 4 + SQL Server**.

## Requisitos
- JDK 21 (`java -version` deve mostrar 21)
- Banco SQL Server criado (veja `../database/README.md`), por exemplo no Somee

## Como rodar

1. Crie as tabelas: execute `database/bd_auraviva_sqlserver.sql` no seu banco.
2. Copie `.env.example` para `.env` e preencha com os dados do painel do Somee (o Spring lê esse arquivo sozinho).
3. Inicie a API (dentro da pasta `backend`):

```
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

A API sobe em http://localhost:8080

## Usuários de teste (senha: 12345678)
- admin@auraviva.com.br (ADMIN)
- funcionario@auraviva.com.br (FUNCIONARIO)
- maria@email.com (USER / cliente)

## Variáveis do `.env`
`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `CODIGO_FUNCIONARIO`, `CORS_ORIGINS`, `SESSION_SAMESITE`, `SESSION_SECURE`, `MAIL_USER`, `MAIL_PASSWORD`.
O e-mail é opcional (só a recuperação de senha depende dele).

## Níveis de acesso
| Nível | Quem é | O que pode |
|---|---|---|
| `USER` | cliente | comprar, ver os próprios pedidos |
| `FUNCIONARIO` | equipe | produtos, blog, pedidos de todos, mensagens, lista de clientes |
| `ADMIN` | administrador | tudo do funcionário + editar usuários |

## Principais rotas

| Rota | Quem acessa |
|---|---|
| `POST /login`, `POST /logout` | público |
| `POST /usuarios/create` | público (cadastro de cliente) |
| `POST /usuarios/create-funcionario` + header `X-Codigo-Funcionario` | público, exige o código da empresa |
| `GET /produtos/all`, `/produtos/estacao/{VERAO\|INVERNO}`, `/produtos/destaques`, `/produtos/{id}` | público |
| `GET /blogs/all`, `/blogs/{id}` | público |
| `POST /mensagens/enviar` | público (formulário "Fale conosco") |
| `POST /recuperar-senha/solicitar-codigo`, `/validar-codigo`, `/redefinir-senha` | público |
| `GET /usuarios/me`, `POST /vendas`, `GET /vendas/pedidos` | usuário logado |
| `GET /vendas/{id}`, `/vendas/{id}/itens` | dono do pedido ou equipe |
| `POST/PUT /produtos`, `POST/PUT /blogs`, `GET /vendas/pedidos/todos`, `PUT /vendas/{id}/status`, `GET /usuarios/all`, `GET /mensagens/**` | ADMIN ou FUNCIONARIO |
| `PUT /usuarios/{id}` e demais `PUT /usuarios/**` | somente ADMIN |

### Pedido (`POST /vendas`)
```json
{ "itens": [ { "idProduto": 1, "quantidade": 2 } ] }
```
O preço vem do banco (não do navegador), o estoque é conferido e baixado, e o cancelamento devolve os itens ao estoque.

## Estrutura do código (`src/main/java/br/itb/projeto/auraviva`)
```
config/      SecurityConfig, CorsConfig, tratamento de erros
controller/  rotas da API
dto/         objetos de resposta (UsuarioDTO, PedidoDTO...)
model/entity/      entidades (tabelas)
model/repository/  acesso ao banco
service/     regras de negócio
```

## Publicar a API
O Somee guarda só o **banco**; ele não roda Java. Publique o backend em um serviço que rode Java/Docker (Render, Railway, Azure...) com as mesmas variáveis do `.env` e, se o site e a API ficarem em domínios diferentes (HTTPS), use `SESSION_SAMESITE=None`, `SESSION_SECURE=true` e coloque a URL do site em `CORS_ORIGINS`.

## Problemas comuns

| Erro | Causa / solução |
|---|---|
| `Login failed for user` | Usuário/senha do `.env` diferentes dos do painel do Somee. |
| `The TCP/IP connection to the host ... has failed` | `DB_HOST` errado. Copie o host exato do painel. |
| `Invalid object name 'Usuario'` | O script SQL não foi executado nesse banco. |
| `release version 21 not supported` | JDK mais antigo que 21. Instale o JDK 21 e confira o `JAVA_HOME`. |
| `Port 8080 was already in use` | Feche o outro programa que usa a porta 8080. |
| `mvnw: Permission denied` (Linux/macOS) | `chmod +x mvnw` |

# AuraViva - TCC

Site de venda de sementes: front-end em **React**, API em **Spring Boot** e banco **SQL Server** (hospedado no **Somee**).

## Estrutura do projeto

```
auraviva-tcc/
├── backend/     API Spring Boot (Java 21)
├── frontend/    Site em React + Vite
├── database/    Scripts SQL Server e documentação do banco
├── docs/        Documentação do TCC (diagramas, textos, apresentação, referências)
├── AGENTS.md    Guia rápido da estrutura e convenções do repositório
└── package.json Atalhos para rodar o frontend a partir da raiz
```

## O que instalar

| Programa | Versão | Conferir com |
|---|---|---|
| JDK | 21 | `java -version` |
| Node.js | 20.19+ ou 22.12+ | `node -v` |
| Banco SQL Server | no Somee (ou local) | painel do Somee |

## Como rodar (passo a passo)

### 1. Banco de dados (só na primeira vez)
1. No painel do Somee, crie o banco **SQL Server** e anote host, nome do banco, usuário e senha.
2. Execute `database/bd_auraviva_sqlserver.sql` nesse banco (SSMS, Azure Data Studio ou o editor do painel).

Detalhes em [`database/README.md`](database/README.md).

### 2. Backend
Copie `backend/.env.example` para `backend/.env` e preencha `DB_HOST`, `DB_NAME`, `DB_USER` e `DB_PASSWORD` com os dados do Somee. Troque também o `CODIGO_FUNCIONARIO`.

```
cd backend
.\mvnw.cmd spring-boot:run      (Windows)
./mvnw spring-boot:run          (Linux/macOS)
```
API em http://localhost:8080

### 3. Frontend
Copie `frontend/.env.example` para `frontend/.env` (já aponta para `http://localhost:8080`) e rode:
```
npm run dev
```
Pode ser rodado direto na raiz (instala as dependências sozinho) ou dentro de `frontend/`.
Site em http://localhost:5173

## Usuários de teste (senha: 12345678)
- admin@auraviva.com.br (ADMIN)
- funcionario@auraviva.com.br (FUNCIONARIO)
- maria@email.com (cliente)

Para criar uma conta de **funcionário** pelo site (aba "Funcionário" > Cadastre-se) é preciso informar o `CODIGO_FUNCIONARIO` definido no `backend/.env` (padrão: `AURAVIVA-FUNC-2026`).

## O que já usa o banco de dados
Cadastro e login (cliente e funcionário), "Fale conosco", finalização do pedido (preço e estoque conferidos no servidor), "Meus pedidos", painel do funcionário (pedidos, mudança de etapa e lista de clientes).

O que ainda fica só no navegador (localStorage) está em [`docs/PROXIMOS_PASSOS.md`](docs/PROXIMOS_PASSOS.md).

## Documentação por pasta
- [`backend/README.md`](backend/README.md) - rotas, variáveis e estrutura do código
- [`frontend/README.md`](frontend/README.md) - scripts e páginas
- [`database/README.md`](database/README.md) - tabelas, diagrama ER e passo a passo do Somee
- [`docs/README.md`](docs/README.md) - material do TCC

## Problemas comuns

| Erro | Solução |
|---|---|
| `npm run dev` diz que o Vite exige outra versão do Node | Atualize o Node para 20.19+ ou 22.12+ |
| `npm error enoent package.json` | Rode na raiz do projeto ou dentro de `frontend/` |
| Backend: `Login failed for user` / `connection ... failed` | Confira o `backend/.env` com os dados do painel do Somee (veja `database/README.md`) |
| Backend: `release version 21 not supported` | Instale o JDK 21 |
| Site: "Não foi possível conectar ao servidor" | O backend não está rodando ou `VITE_API_URL` está errado |

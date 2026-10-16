# AuraViva - Frontend (React + Vite)

Site da AuraViva feito com React 19, React Router e Bootstrap.

## Requisitos
- **Node.js 20.19+ ou 22.12+** (confira com `node -v`). Versões mais antigas fazem o Vite falhar.

## Como rodar

```
cd frontend
npm install
npm run dev
```

O site abre em http://localhost:5173

Também funciona na raiz do projeto: `npm run dev` (instala as dependências automaticamente).

## Scripts
| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | gera a versão final em `dist/` |
| `npm run preview` | testa a versão final |
| `npm run lint` | verifica o código com ESLint |

## Estrutura (`src/`)
```
components/  componentes reutilizáveis (ex.: AccessibilityWidget)
pages/       uma pasta por página (Home, Blog, Produto, Carrinho, Perfil...)
routes/      AppRoutes.jsx (todas as rotas do site)
utils/       funções auxiliares (carrinho.js)
```

## Observação
Nesta versão o site usa dados fixos e `localStorage` (login e carrinho simulados no navegador); ele ainda não consome a API do backend.

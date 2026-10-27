# AGENTS.md

## 1. Visão Geral
Este é um projeto em Next.js com TypeScrift e Tailwind CSS.
O objetivo é criar uma aplicação web para gerenciamento de uma biblioteca escolar

## 2. Tecnologias 
Next.js 15 (App Router)
TypeScript
Tailwind CSS
(quando necessário)

## 3. Como executar
'''bash
npm install
npm run dev

## 4. Estrutural de Pastas
app/  páginas e rotas (App Router).
componentes/ componentes reutilizáveis.
lib/ Funções e configs.
publics/ Arquivos estáticos (imagens, icones).

## 5. Padrões de Código
-Usar TypeScript em todos os arquivos.
-Seguir o padrão de componentes do shadcn/ui.
-Nomes de arquivos em inglês e kebab-case.
-Manter o código simples e bem organizado.

## 6. Instruções para o Agente
-Sempre usar o contexto desse arquivo.
-Priorizar soluções com Next.js, TypeScript e Tailwind.
-Explicar o que está fazendo de forma didática.
-Evitar bibliotecas desconhecidas.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

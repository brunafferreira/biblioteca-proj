# Refúgio Literário — Gestão de Biblioteca Escolar

## Visão Geral

Desenvolver uma aplicação web para gestão e controlo de operações e rotinas de biblioteca utilizando:

* Next.js
* React
* TypeScript
* Tailwind CSS
* LocalStorage

O projeto será exclusivamente Front-end e terá como objetivo resolver os problemas de processos manuais no fluxo da biblioteca.

O utilizador poderá registar novas ações operacionais (ex: empréstimos de livros, reservas de exemplares, devoluções e registo de multas) fornecendo título e descrição, visualizar o histórico de ações, marcar pendências como finalizadas, reabrir solicitações e filtrá-las por estado.

Quando qualquer alteração for realizada (criação de registo, alteração de estado ou remoção), o estado das ações operacionais será gravado automaticamente no LocalStorage para garantir a persistência dos dados entre recarregamentos da página.

---

# S — Situação

A inatividade e o desgaste dos processos manuais na biblioteca geram filas, perda de livros, descontrolo sobre quem está com determinado exemplar e atritos desnecessários entre a administração da biblioteca e os alunos devido a cobranças de multas imprecisas.

É necessário criar um sistema simples de gestão de operações para organizar a rotina do acervo e dos utilizadores.

O sistema deverá permitir:

* Registar ações operacionais com **Título** (ex: "Empréstimo do Livro Dom Casmurro") e **Descrição** (ex: "Aluno: João Silva - Prazo: 7 dias").
* Listar claramente todas as ações operacionais registadas no acervo.
* Alterar o estado das ações operacionais (Concluir/Finalizar e Reabrir).
* Eliminar registos operacionais permanentemente.
* Filtrar a visualização das ações (Todas, Pendentes, Concluídas).

---

# C — Contexto

## Tecnologias obrigatórias

Utilizar:

* Next.js
* App Router
* Hooks (`useState`, `useEffect`)
* TypeScript
* Tailwind CSS
* LocalStorage

Não adicionar bibliotecas sem necessidade.

---

## Arquitetura

O projeto será exclusivamente Front-end.

Não utilizar:

* Backend
* Banco de dados
* Autenticação
* API própria
* Serviços externos

Este projeto representa apenas uma interface interativa com persistência local no navegador.

---

# O — Objetivos e Funcionalidades

A aplicação deverá possuir as seguintes funcionalidades principais:

1. **Criar:** Registo de novas ações operacionais da biblioteca (ex: empréstimo, devolução, renovação) fornecendo título e descrição.
2. **Visualizar:** Listagem clara e organizada de todas as operações e pendências cadastradas.
3. **Concluir:** Marcação visual e lógica de ações como finalizadas (ex: livro devolvido ou multa quitada).
4. **Reabrir:** Restauração de ações concluídas para o estado pendente (ex: pedido de reavaliação de empréstimo).
5. **Excluir:** Remoção permanente de registos e históricos indesejados do armazenamento.
6. **Filtrar:** Organização e exibição seletiva da lista operatória (ex: Todas, Pendentes, Concluídas).

---

# P — Processo de Desenvolvimento

O desenvolvimento da aplicação seguirá as seguintes etapas:

* **Estrutura:** Construção do esqueleto HTML para posicionar campos de formulário, botões de ação e a lista operacional na tela.
* **Tipos:** Definição do formato e tipos do objeto `AcaoBiblioteca` em TypeScript (ex: `id`, `titulo`, `descricao`, `status`).
* **Formulário:** Captura das informações introduzidas pelo utilizador e prevenção do comportamento padrão de recarregamento da página (`preventDefault`).
* **Estado:** Gestão do estado em memória JavaScript (`useState`), que serve como a fonte da verdade da aplicação.
* **Listagem:** Mapeamento e transformação das ações do estado em elementos visuais no ecrã.
* **Persistência:** Salvamento e carregamento automático dos dados no `localStorage` do navegador (`useEffect`).
* **Filtros:** Exibição seletiva das ações operacionais com base no estado selecionado pelo utilizador.
* **Testes:** Verificação manual de que todas as rotinas funcionam corretamente e os registos permanecem salvos após a atualização da página.
**Função adicional** Controle de acesso, criar 2 usuários(id, nome, email, senha) 
crie os usuários: (crie os usuários no arquivo auth.ts)
01, suzany, suzany@gmail.com, 12345678
02, maria, maria@gmail.com, 13457609
**livros** Cadastro de livros, criar 2 livros (id, titulo, autor, ano)
crie os livros: (crie os livros no arquivo books.ts)
01, Dom Casmurro, Machado de Assis, 1899
02, Mulher em Queda, Colleen Hoover, 2026
03, A Empregada, Freida McFadden, 2023

# E — Expectativas do Projeto

As expectativas de entrega e funcionamento da aplicação estão divididas nos seguintes pontos:

### 1. Criação e Persistência de Registos
* Ao preencher o título do procedimento (ex: "Devolução de exemplar") e os detalhes em descrição e submeter o formulário, a nova ação operacional deve ser imediatamente exibida no ecrã.
* Ao atualizar ou fechar o navegador, o registo de operações da biblioteca **não deve desaparecer**, devendo ser recarregado a partir do `localStorage`.

### 2. Conclusão e Reabertura de Processos
* Ao clicar no botão de concluir (ex: confirmar devolução), o estado visual da ação deve ser alterado de forma clara (ex: risco no texto, alteração de cor ou indicação de finalizado).
* Ao reabrir uma operação concluída, o seu estado deve voltar a ser pendente e a visualização deve ser atualizada no painel da biblioteca.
* A alteração de estado (pendente/concluída) deve ser refletida e guardada imediatamente no `localStorage`.

### 3. Exclusão de Registos
* Ao acionar a opção de apagar, o registo operacional deve ser removido permanentemente do ecrã e do `localStorage`.

### 4. Filtragem
* Ao clicar nos botões de filtro (**Todas**, **Pendentes** ou **Concluídas**), o painel deve apresentar exclusivamente as ações operacionais correspondentes ao estado selecionado.

---


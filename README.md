# Sistema de Chat com IA

Este projeto é um sistema de chat com assistentes da OpenAI, desenvolvido utilizando Clerk para autenticação, Supabase para persistência de dados e integração com Supabase Realtime. O objetivo é oferecer uma experiência semelhante ao ChatGPT, com suporte a múltiplos chats por usuário autenticado.

---

## Checklist de Tarefas

### 1\. **Autenticação com Clerk**

- [ ] Migrar o sistema atual de autenticação de `next-auth` para `Clerk`.
- [ ] Adicionar suporte à autenticação de terceiros (exemplo: Google).

### 2\. **Listagem de Chats**

- [x] Criar um dashboard que exiba os chats existentes do usuário autenticado.

### 3\. **Persistência de Dados**

- [x] Armazenar os chats no banco de dados utilizando Supabase.

### 4\. **Criação de Chats**

- [x] Implementar a funcionalidade para criar novos chats.
- [x] Permitir que o usuário inicie uma conversa com o assistente ou continue um chat já existente.

### 5\. **Integração com OpenAI Assistants**

- [x] Configurar os chats para se comunicarem com assistentes da OpenAI.

### 6\. **Layout e Design**

- [x] Criar um layout personalizado **Fiz com as cores da marca Zatten**.

### 7\. **API para Criação de Chats**

- [ ] Expor um endpoint API para criar um novo chat. O endpoint deve:
  - [ ] Receber o `id` ou `email` do usuário e um título para o chat.
  - [ ] Criar a thread no banco de dados e vincular ao usuário.
  - [ ] Utilizar Supabase Realtime para atualizar a listagem ao vivo no dashboard.

### 8\. **Migração para Supabase Realtime**

- [ ] Migrar o sistema para utilizar Supabase Realtime em vez do DrizzleORM.

## Tecnologias Utilizadas

- **Next-auth** para autenticação.
- **Supabase** para banco de dados.
- **OpenAI Assistants** para geração de respostas nos chats.
- **DrizzleORM** (em migração para Supabase Realtime).
- **Next.js** para desenvolvimento front-end.

---

### Observação

Tomei a decisão de fazer toda a arquitetura do banco com drizzleORM para ajudar na agilidade mas não atendeu todas as funcionalidades (a questão do realtime do supabase para funcionar 100% o observer do insert dos dados precisa ser feito com SDK deles mesmo a melhor opção.)

A aplicação está funcional, mas algumas melhorias ainda estão pendentes, principalmente a migração next-auth para o clerk, drizzleORM para Supabase Realtime e a criação do endpoint da API.

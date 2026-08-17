# AnimeGeek API

## Sobre o Projeto

O AnimeGeek API é uma API REST desenvolvida como Trabalho de Conclusão de Curso (TCC), com o objetivo de fornecer os recursos necessários para uma plataforma social voltada à comunidade de animes.

A aplicação permite que usuários criem contas, publiquem conteúdos, interajam com outros usuários, troquem mensagens privadas, participem de tópicos de discussão e criem rankings personalizados de seus animes favoritos.

## Tecnologias Utilizadas

* Node.js
* TypeScript
* Express.js
* Prisma ORM
* SQLite
* JWT (JSON Web Token)
* Bcrypt
* Dotenv
* Cors

## Estrutura do Projeto

```bash
src/
├── controllers/
│   ├── animeRanks.ts
│   ├── auth.ts
│   ├── follows.ts
│   ├── likes.ts
│   ├── messages.ts
│   ├── posts.ts
│   ├── topics.ts
│   └── users.ts
│
├── helpers/
│   ├── hash.ts
│   ├── jwt.ts
│   └── prisma.ts
│
├── middlewares/
│   ├── auth.ts
│   └── error.ts
│
├── routes/
│   ├── animeRanks.routes.ts
│   ├── auth.routes.ts
│   ├── follow.routes.ts
│   ├── like.routes.ts
│   ├── messages.routes.ts
│   ├── post.routes.ts
│   ├── topics.routes.ts
│   └── user.routes.ts
│
├── app.ts
└── index.ts

prisma/
└── schema.prisma
```

## Funcionalidades

### Autenticação

* Cadastro de usuários
* Login de usuários
* Geração de token JWT
* Proteção de rotas privadas

### Usuários

* Visualização de perfil
* Atualização de perfil
* Sistema de seguidores

### Publicações

* Criação de posts
* Listagem de publicações
* Comentários em posts

### Curtidas

* Curtir publicações
* Consulta de curtidas

### Seguidores

* Seguir usuários
* Visualizar seguidores

### Mensagens

* Envio de mensagens privadas
* Consulta de conversas
* Caixa de entrada

### Tópicos

* Criação de tópicos de discussão
* Respostas em tópicos
* Exclusão de tópicos

### Ranking de Animes

* Cadastro de rankings personalizados
* Atualização de posições
* Exclusão de rankings

## Modelos do Banco de Dados

O sistema possui os seguintes modelos:

* User
* Post
* Comment
* Follow
* Like
* Bookmark
* Message
* Topic
* TopicReply
* AnimeRank

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta"
PORT=8080
```

## Instalação

Instale as dependências do projeto:

```bash
npm install
```

## Configuração do Banco de Dados

Gerar o Prisma Client:

```bash
npx prisma generate
```

Criar ou atualizar as tabelas do banco:

```bash
npx prisma db push
```

Abrir o Prisma Studio:

```bash
npx prisma studio
```

## Executando o Projeto

Modo de desenvolvimento:

```bash
npm run dev
```

Compilar o projeto:

```bash
npm run build
```

Executar em produção:

```bash
npm start
```

Ao iniciar corretamente, a API ficará disponível em:

```text
http://localhost:8080
```

Resposta da rota principal:

```json
{
  "message": "AnimeGeek API"
}
```

## Endpoints da API

### Autenticação

| Método | Endpoint       | Descrição           |
| ------ | -------------- | ------------------- |
| POST   | /auth/register | Cadastro de usuário |
| POST   | /auth/login    | Login de usuário    |

### Usuários

| Método | Endpoint             | Descrição                |
| ------ | -------------------- | ------------------------ |
| GET    | /users/:id           | Buscar perfil            |
| PUT    | /users/:id           | Atualizar perfil         |
| POST   | /users/:id/follow    | Seguir usuário           |
| GET    | /users/:id/following | Verificar relacionamento |

### Publicações

| Método | Endpoint                | Descrição           |
| ------ | ----------------------- | ------------------- |
| POST   | /posts                  | Criar publicação    |
| GET    | /posts                  | Listar publicações  |
| POST   | /posts/:postId/comments | Comentar publicação |

### Curtidas

| Método | Endpoint   | Descrição          |
| ------ | ---------- | ------------------ |
| POST   | /likes/:id | Curtir publicação  |
| GET    | /likes/:id | Consultar curtidas |

### Seguidores

| Método | Endpoint              | Descrição         |
| ------ | --------------------- | ----------------- |
| POST   | /follow/:id           | Seguir usuário    |
| GET    | /follow/:id/followers | Listar seguidores |

### Mensagens

| Método | Endpoint           | Descrição        |
| ------ | ------------------ | ---------------- |
| POST   | /messages          | Enviar mensagem  |
| GET    | /messages/inbox    | Caixa de entrada |
| GET    | /messages/:otherId | Buscar conversa  |

### Tópicos

| Método | Endpoint            | Descrição        |
| ------ | ------------------- | ---------------- |
| GET    | /topics             | Listar tópicos   |
| GET    | /topics/:id         | Buscar tópico    |
| POST   | /topics             | Criar tópico     |
| POST   | /topics/:id/replies | Responder tópico |
| DELETE | /topics/:id         | Excluir tópico   |

### Ranking de Animes

| Método | Endpoint             | Descrição                 |
| ------ | -------------------- | ------------------------- |
| GET    | /anime-ranks/:userId | Listar ranking do usuário |
| POST   | /anime-ranks         | Criar ranking             |
| PUT    | /anime-ranks/:id     | Atualizar ranking         |
| DELETE | /anime-ranks/:id     | Excluir ranking           |

## Objetivo

O AnimeGeek API foi desenvolvido para servir como backend de uma plataforma social voltada ao universo dos animes. O sistema busca promover a interação entre usuários por meio de publicações, comentários, mensagens privadas, tópicos de discussão e rankings personalizados de animes favoritos.

## Autores

Projeto desenvolvido pelos integrantes do Trabalho de Conclusão de Curso (TCC) AnimeGeek.
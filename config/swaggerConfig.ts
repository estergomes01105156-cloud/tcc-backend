const userSchema = {
type: "object",
properties: {
id: { type: "string" },
username: { type: "string" },
email: { type: "string" },
bio: { type: "string" },
avatar: { type: "string" },
createdAt: {
type: "string",
format: "date-time",
},
posts: {
type: "array",
items: {
type: "object",
properties: {
id: { type: "string" },
content: { type: "string" },
imageUrl: { type: "string" },
createdAt: {
type: "string",
format: "date-time",
},
},
},
},
},
};

const initialRoute = {
get: {
tags: ["Inicial"],
summary: "Rota inicial da API",
responses: {
200: {
description: "API funcionando",
content: {
"application/json": {
schema: {
type: "object",
properties: {
message: {
type: "string",
},
},
example: {
message: "AnimeGeek API",
},
},
},
},
},
},
},
};

const usersRoutesNoId = {
get: {
tags: ["Usuários"],
summary: "Listar usuários",
responses: {
200: {
description: "Lista de usuários",
content: {
"application/json": {
schema: {
type: "array",
items: {
$ref: "#/components/schemas/User",
},
},
example: [
{
id: "f4e8c2f5",
username: "esterzinha",
email: "[ester@gmail.com](mailto:ester@gmail.com)",
bio: "Fã de animes",
avatar: "https://avatar.com/img.png",
createdAt: "2026-06-17T10:00:00.000Z",
},
],
},
},
},
},
},

post: {
tags: ["Usuários"],
summary: "Cadastrar usuário",
requestBody: {
required: true,
content: {
"application/json": {
schema: {
type: "object",
properties: {
username: { type: "string" },
email: { type: "string" },
password: { type: "string" },
},
},
example: {
username: "esterzinha",
email: "[ester@gmail.com](mailto:ester@gmail.com)",
password: "123456",
},
},
},
},
responses: {
201: {
description: "Usuário criado com sucesso",
content: {
"application/json": {
schema: {
$ref: "#/components/schemas/User",
},
example: {
id: "f4e8c2f5",
username: "esterzinha",
email: "[ester@gmail.com](mailto:ester@gmail.com)",
bio: null,
avatar: null,
createdAt: "2026-06-17T10:00:00.000Z",
},
},
},
},
},
},
};

export default {
userSchema,
initialRoute,
usersRoutesNoId,
};
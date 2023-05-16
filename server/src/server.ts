/* eslint-disable prettier/prettier */
// Iniciamos importando o framework fastify
import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

// Iniciamos a criação da nossa API
const app = fastify()
// Instanciamos Nosso DB
const prisma = new PrismaClient()

// Primeiro método: GET (Toda vez que quero listar algo)
app.get('/getusers', async () => {
    const users = await prisma.user.findMany()
  return users
})

// Primeiramente definimos o server que ficará ouvindo http onde nosso front vai fazer requisições http
app
  .listen({
    // Se acessarmos localhost 3333 vamos bater aqui (pelo menos enquanto estamos em desenvolvimento)
    port: 3333,
    // listen devolve uma promise (algo que ainda virá) e o then() "ouve" quando o listen estiver finalizado e ENTÃO faz alguma coisa (no nosso caso executamos uma função () => {})
    // Relembrando () => {} é uma arrow/anonymous function
  })
  .then(() => {
    console.log('Http server running on http://localhost:3333')
  })

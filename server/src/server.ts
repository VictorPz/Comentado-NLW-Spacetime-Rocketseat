/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

const app = fastify()

app.register(memoriesRoutes) // registra um arquivo de rotas
app.register(cors, {
  origin: true
})

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

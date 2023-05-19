/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  // Primeiro método: Ver as memórias
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({ // procura as memorias e ordena por criação
      orderBy: {
        createdAt: 'asc',
      }
    })
    return memories.map(memory => { // aqui estou retornando coisas específicas da memória, não ela toda
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...') // retorna um resumo da memória (substring define de 0 a 110 caracteres e concat concatenado com ...)
      }
    })
  })
  // Nesta rota vamos receber a descrição da memória, por isso o :id pra pegar a memória exata que buscamos = Read
  app.get('/memories:id', async (request) => {
    // nosso request sempre vai ser um objeto, por isso desestruturamos ele logo a baixo para verificar o id
    // criamos nosso paramsSchema que é um zobject que verifica se nosso id é uma string e um uuid
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    // jogamos nosso request.params dentro do paramsSchema para ver se ele passa na validação
    const { id } = paramsSchema.parse(request.params)

    // Agora tentaremos encontrar a memória passando o id para o prisma, como é uma memória unica podemos usar o find unique or throw que ja para o código em caso de erro
    const memory = await prisma.memory.findUniqueOrThrow({
      // Encontrando uma memória unica, ONDE o id é igual o id que estou retornando
      where: {
        id,
      }
    })
    return memory
  })

  // Criar memória = Create
  // Criar um usuário é bem parecido com a busca de id da memória. Também vamos depender da request e precisamos validar os dados que foram passados nela
  app.post('/memories', async (request) => {
    // Aqui criamos o que esperamos do nosso body
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      // Nem sempre recebemos um true or false, pode ser um valor equivalente a true or false por exemplo 1 ou 0. Por isso usamos coerce, e como fazer Boolean(valor)
      isPublic: z.coerce.boolean().default(false)
    })

    // Validamos se esses elementos do body da nossa request correspondem ao esperado
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    // Podemos então criar uma nova memória com eles
    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        // id mocado com o que criei no db pois ainda não temos como pegar o id de um usuário logado
        userId: 'a623c908-2a81-40db-8211-a35e1a2364d9'
      }
    })
    return memory
  })

  // Modificar memória = Update
  app.put('/memories:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    // Quero atualizar uma memory onde o id é este que recebi na requisição e os dados são estes
    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic
      },
    })

    return memory
  })


  // Remover memória = Delete
  app.delete('/memories:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    // Aqui não precisamos retornar nada só deletar o id que foi passado
    await prisma.memory.delete({
      where: {
        id,
      }
    })
  })
}

/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import axios from 'axios'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
    app.post('/register', async (request) => {
        const bodySchema = z.object({
            code: z.string(),
        })

        const { code } = bodySchema.parse(request.body)

        // Aqui vou enviar a requisição ao github e esperar o token em json de volta
        const acessTokenResponse = await axios.post(
            // primeiro parametro do axios post: url
            'http://github.com/login/oauth/access_token',
            // segundo parametro: body (mas não precisei passar nada)
            null,
            // terceiro: parametros da requisição (em vez de passar na url posso passar aqui e ele completa lá automaticamente, então passei o client id, secret e code)
            {
                params: {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                },

                // Passei aqui no header o formato de resposta que espero: json
                headers: {
                    Accept: 'application/json'
                }
            }
        )

        // Aqui ja convertemos nosso code em acess_token
        const { access_token } = acessTokenResponse.data

        // Usamos nosso acess_token para obter um usuário
        const userResponse = await axios.get(
            'https://api.github.com/user',
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        // Validamos o usuário e os dados que estamos recebendo
        const userSchema = z.object({
            id: z.number(),
            login: z.string(),
            name: z.string(),
            avatar_url: z.string().url()
        })

        const userData = userSchema.parse(userResponse.data)

        // Conferimos se ja existe no banco de dados
        // Usamos let pois vai variar
        let user = await prisma.user.findUnique({
            where: {
                githubId: userData.id,
            }
        })

        // Se não existir um usuário no db, salvamos ele
        if(!user) {
            user =  await prisma.user.create({
                data: {
                    githubId: userData.id,
                    name: userData.name,
                    login: userData.login,
                    avatarUrl: userData.avatar_url
                }
            })
        }

        // Criando o jwt token
        // sign possui 2 objetos:
        const token = app.jwt.sign(
            // No 1 objeto passamos quais informações do usuário queremos / vamos utilizar. Cuidado para não passar informações sensíveis pois não é criptografado
            {
                name: user.name,
                avatarUrl: user.avatarUrl
        },
        // No 2 objeto precisamos de algo unico do usuário um subject (sub) e quanto tempo o token vai durar
        {
            sub: user.id,
            expiresIn: '30 days'
        })

        return {token}
    })
}

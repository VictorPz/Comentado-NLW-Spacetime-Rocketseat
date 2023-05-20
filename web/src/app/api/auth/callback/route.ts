import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  const registerResponse = await api.post('/register', {
    code,
  })

  const { token } = registerResponse.data

  const redirectURL = new URL('/', request.url)

  // Um cookie dura somente uma sessão ou pode ter sua duração definida com max-age. Porém max-age só le a duração em segundos do cookie
  const cookieAgeSecondsToMonth = 60 * 60 * 24 * 30

  return NextResponse.redirect(redirectURL, {
    headers: {
      // Set-Cookie cria um novo cookie
      'Set-Cookie': `token=${token}; Path=/; max-age=${cookieAgeSecondsToMonth};`, // esse path=/ significa que podemos usar esse token em toda aplicação, se fosse path=/auth só onde começar com auth e assim por diante
    },
  })
}

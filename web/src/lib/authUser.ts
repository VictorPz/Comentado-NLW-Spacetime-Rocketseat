import decode from 'jwt-decode'
import { cookies } from 'next/headers'

interface User {
  sub: string
  name: string
  avatarUrl: string
}

export function getUser(): User {
  // .get por si só não retorna o token, precisa usar value que é opcional
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('Unauthenticated')
  }

  const user: User = decode(token) // precisa do : User pro ts entender o que vai voltar
  return user
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const redirectURL = new URL('/', request.url) // ainda redirecionamos para a home

  return NextResponse.redirect(redirectURL, {
    headers: {
      'Set-Cookie': `token=; Path=/; max-age=0;`, // basicamente deixamos o token sem valor e o max-agr no 0
    },
  })
}

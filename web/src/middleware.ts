import { NextRequest, NextResponse } from 'next/server'

const singInURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    // Caso o usuário não esteja logado, mandamos ele pra pagina de logIn, registramos o endereço que ele tentou acessar nos cookies e depois redirecionamos para a pagina desejada
    // Para isto passamos esse cookie redirectTo lá na nossa route que cuida do login (callback/route)
    return NextResponse.redirect(singInURL, {
      headers: {
        'Set-Cookie': `redirectTo=${request.url}; Path=/; HttpOnly; max-age:20;`,
      },
    })
  }

  // Se o usuário estiver logado, esse .next() deixa o usuário seguir o caminho desejado
  return NextResponse.next()
}

export const config = {
  // Esse match significa que o middleware será chamado quando o usuário tentar acessar qualquer rota que comece com /memories por isso o :path* (pode ter qualquer coisa depois)
  matcher: '/memories/:path*',
}

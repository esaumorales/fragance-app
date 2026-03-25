import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sesión de Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;

  // 1. Prevenir Login doble: Si el usuario ya está autenticado y trata de ir a /auth/*, redirigir a su perfil
  if (user && path.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/cuenta'
    return NextResponse.redirect(url)
  }
  
  // 2. Proteger rutas privadas: Si no está autenticado y trata de ir a checkout, cuenta o admin, redirigir al login
  const isProtectedRoute = path.startsWith('/cuenta') || path.startsWith('/checkout') || path.startsWith('/admin');
  
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

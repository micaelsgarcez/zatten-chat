import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/login(.*)', '/register(.*)'])

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url)
  console.log('url :', url)

  // Ignore rotas que começam com /api/webhook
  if (url.pathname.startsWith('/api/webhook')) {
    console.log('Middleware ignorado para:', url.pathname)
    return // Não executa o middleware
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
}

import { getChatsByUserId } from '@/lib/db/queries'
import { currentUser } from '@clerk/nextjs/server'

export async function GET() {
  const user = await currentUser()

  if (!user || !user.externalId) {
    return new Response('Unauthorized', { status: 401 })
  }

  // biome-ignore lint: Forbidden non-null assertion.
  const chats = await getChatsByUserId({ id: user.externalId })
  return Response.json(chats)
}

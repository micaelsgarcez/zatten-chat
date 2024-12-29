import { auth } from '@/app/(auth)/auth'
import { getMessageId, saveMessages } from '@/lib/db/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const messageId = searchParams.get('messageId')

  const session = await auth()

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!messageId) {
    return new Response('Not Found', { status: 200 })
  }

  const message = await getMessageId({ id: messageId })

  return Response.json(message, { status: 200 })
}

export async function POST(request: Request) {
  const {
    id,
    role,
    message,
    chatId
  }: { id: string; message: string; role: string; chatId: string } =
    await request.json()

  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  await saveMessages({
    messages: [
      {
        id,
        chatId,
        role,
        content: message,
        createdAt: new Date()
      }
    ]
  })
}

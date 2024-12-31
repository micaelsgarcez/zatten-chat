import { getMessageId, saveMessages } from '@/lib/db/queries'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const messageId = searchParams.get('messageId')

  const { userId } = await auth()

  if (!userId) {
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

  const { userId } = await auth()

  if (!userId) {
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

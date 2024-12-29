import { auth } from '@/app/(auth)/auth'
import { getChatById, saveChat, saveMessages } from '@/lib/db/queries'
import { generateUUID } from '@/lib/utils'
import { AssistantResponse } from 'ai'
import OpenAI from 'openai'
import { generateTitleFromUserMessage } from '../../actions'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(request: Request) {
  const {
    id,
    message,
    assistantId
  }: { id: string; message: string; assistantId: string } = await request.json()

  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const chat = await getChatById({ id })

  let threadId =
    chat && chat.threadId
      ? chat.threadId
      : (await openai.beta.threads.create({})).id
  if (!chat) {
    const title = await generateTitleFromUserMessage({
      message: {
        role: 'user',
        content: message
      }
    })

    await saveChat({
      id,
      userId: session.user.id,
      title,
      modelId: 'assistant',
      assistantId,
      threadId
    })
  }

  const messageId = generateUUID()
  await saveMessages({
    messages: [
      {
        id: messageId,
        chatId: id,
        role: 'user',
        content: message,
        createdAt: new Date()
      }
    ]
  })

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: message
  })

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream, sendDataMessage }) => {
      // Run the assistant on the thread
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId
      })

      // forward run status would stream message deltas
      let runResult = await forwardStream(runStream)

      if (runResult?.status === 'completed') {
        runStream.finalMessages().then(async (finalMessages) => {
          console.log('finalMessages :', finalMessages)
          const messageAssistantId = generateUUID()

          await saveMessages({
            messages: [
              {
                id: messageAssistantId,
                chatId: id,
                role: 'assistant',
                content: [
                  {
                    type: 'text',
                    // @ts-ignore
                    text: finalMessages[0].content[0].text.value
                  }
                ],
                createdAt: new Date()
              }
            ]
          })
        })
      }
    }
  )
}

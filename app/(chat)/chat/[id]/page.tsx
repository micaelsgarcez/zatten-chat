import { notFound } from 'next/navigation'

import ChatAssistant from '@/components/assistant'
import { Chat } from '@/components/chat'
import { DataStreamHandler } from '@/components/data-stream-handler'
import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models'
import { getChatById, getMessagesByChatId } from '@/lib/db/queries'
import { convertToUIMessages } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const { id } = params
  const chat = await getChatById({ id })

  if (!chat) {
    notFound()
  }

  const { userId } = await auth()

  if (chat.visibility === 'private') {
    if (!userId) {
      return notFound()
    }

    if (userId !== chat.userId) {
      return notFound()
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id
  })

  const selectedModelId =
    models.find((model) => model.id === chat.modelId)?.id || DEFAULT_MODEL_NAME

  return (
    <>
      {selectedModelId === 'assistant' ? (
        <ChatAssistant
          key={id}
          id={id}
          defaultAssistantId={chat.assistantId ?? undefined}
          initialMessages={convertToUIMessages(messagesFromDb)}
          selectedModelId={selectedModelId}
          selectedVisibilityType='private'
          isReadonly={false}
        />
      ) : (
        <Chat
          key={id}
          id={id}
          initialMessages={convertToUIMessages(messagesFromDb)}
          selectedModelId={selectedModelId}
          selectedVisibilityType='private'
          isReadonly={false}
        />
      )}
      <DataStreamHandler id={id} />
    </>
  )
}

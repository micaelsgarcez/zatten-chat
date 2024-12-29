'use client'

import { useBlockSelector } from '@/hooks/use-block'
import { Message, useAssistant } from 'ai/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { ChatHeader } from './chat-header'
import { Messages } from './messages'
import { VisibilityType } from './visibility-selector'

export default function ChatAssistant({
  id,
  defaultAssistantId,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
  isReadonly
}: {
  id: string
  defaultAssistantId?: string
  initialMessages: Array<Message>
  selectedModelId: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
}) {
  const { status, messages, input, submitMessage, handleInputChange, error } =
    useAssistant({ api: '/api/assistant' })

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const isBlockVisible = useBlockSelector((state) => state.isVisible)

  return (
    <>
      <div className='flex flex-col min-w-0 h-dvh bg-background'>
        <ChatHeader
          chatId={id}
          messagesCount={messages.length}
          selectedModelId={selectedModelId}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          isLoading={status === 'in_progress'}
          messages={messages}
          isReadonly={isReadonly}
          isBlockVisible={isBlockVisible}
        />
        <div>
          <form onSubmit={submitMessage}>
            <input
              disabled={status !== 'awaiting_message'}
              value={input}
              placeholder='What is the temperature in the living room?'
              onChange={handleInputChange}
            />
          </form>
        </div>
      </div>
    </>
  )
}

'use client'

import type { Attachment, Message } from 'ai'
import { useChat } from 'ai/react'
import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { ChatHeader } from '@/components/chat-header'
import type { Vote } from '@/lib/db/schema'
import { fetcher } from '@/lib/utils'

import { useBlockSelector } from '@/hooks/use-block'
import { Block } from './block'
import { Messages } from './messages'
import { MultimodalInput } from './multimodal-input'
import { VisibilityType } from './visibility-selector'

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
  isChatInitiated = false
}: {
  id: string
  initialMessages: Array<Message>
  selectedModelId: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
  isChatInitiated?: boolean
}) {
  const { mutate } = useSWRConfig()

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload
  } = useChat({
    id,
    body: { id, modelId: selectedModelId },
    initialMessages,
    experimental_throttle: 100,
    onFinish: () => {
      mutate('/api/history')
    }
  })

  const { data: votes } = useSWR<Array<Vote>>(`/api/vote?chatId=${id}`, fetcher)

  const [attachments, setAttachments] = useState<Array<Attachment>>([])
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
          isChatInitiated={isChatInitiated}
        />

        <Messages
          chatId={id}
          isLoading={isLoading}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isBlockVisible={isBlockVisible}
        />

        <form className='flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl'>
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>

      <Block
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  )
}

'use client'

import { useBlockSelector } from '@/hooks/use-block'
import { Message, useAssistant } from 'ai/react'
import { cx } from 'class-variance-authority'
import { ArrowUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { ChatHeader } from './chat-header'
import { StopIcon } from './icons'
import { Messages } from './messages'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { VisibilityType } from './visibility-selector'

export default function ChatAssistant({
  id,
  defaultAssistantId,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
  isChatInitiated
}: {
  id: string
  defaultAssistantId?: string
  initialMessages: Array<Message>
  selectedModelId: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
  isChatInitiated?: boolean
}) {
  const [assistantId, setAssistantId] = useState(defaultAssistantId ?? '')

  const { mutate } = useSWRConfig()

  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    error,
    stop,
    setMessages
  } = useAssistant({
    api: '/api/assistant',
    body: {
      id,
      assistantId
    }
  })

  useEffect(() => {
    setMessages(initialMessages)
  }, [])

  useEffect(() => {
    if (messages.length < 3) {
      mutate('/api/history')
    }
  }, [messages, mutate])

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
          isChatInitiated={isChatInitiated}
        />

        <Messages
          chatId={id}
          isLoading={status === 'in_progress'}
          messages={messages}
          isReadonly={isReadonly}
          isBlockVisible={isBlockVisible}
        />

        <form
          onSubmit={(event) => {
            event.preventDefault()
            window.history.replaceState({}, '', `/chat/${id}`)
            if (input.length === 0 || assistantId.length > 0) {
              submitMessage()
            }
          }}
          className='flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl'
        >
          {!isReadonly && (
            <div className='flex flex-col w-full gap-6'>
              <div className='relative w-full flex flex-col gap-4'>
                <Input
                  className='bg-muted dark:border-zinc-700'
                  placeholder='Coloque o ID do Assistant'
                  value={assistantId}
                  onChange={(event) => {
                    setAssistantId(event.target.value)
                  }}
                  required
                  type={defaultAssistantId ? 'hidden' : 'text'}
                />
                <Textarea
                  placeholder='Envie uma mensagem...'
                  value={input}
                  onChange={handleInputChange}
                  className={cx(
                    'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700'
                  )}
                  rows={2}
                  autoFocus
                  required
                />
                <div className='absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end'>
                  {status === 'in_progress' ? (
                    <Button
                      className='rounded-full p-1.5 h-fit border dark:border-zinc-600'
                      onClick={(event) => {
                        event.preventDefault()
                        stop()
                      }}
                    >
                      <StopIcon size={14} />
                    </Button>
                  ) : (
                    <Button
                      className='rounded-full p-1.5 h-fit border bg-secondary dark:border-zinc-600'
                      type='submit'
                      disabled={input.length === 0 || assistantId.length === 0}
                    >
                      <ArrowUpIcon size={14} stroke='#000' />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  )
}

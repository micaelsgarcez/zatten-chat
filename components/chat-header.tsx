'use client'

import { useRouter } from 'next/navigation'
import { useWindowSize } from 'usehooks-ts'

import { ModelSelector } from '@/components/model-selector'
import { SidebarToggle } from '@/components/sidebar-toggle'
import { Button } from '@/components/ui/button'
import { memo } from 'react'
import { PlusIcon } from './icons'
import { useSidebar } from './ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { VisibilitySelector, VisibilityType } from './visibility-selector'

function PureChatHeader({
  chatId,
  messagesCount,
  selectedModelId,
  selectedVisibilityType,
  isReadonly
}: {
  chatId: string
  messagesCount: number
  selectedModelId: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
}) {
  const router = useRouter()
  const { open } = useSidebar()

  const { width: windowWidth } = useWindowSize()

  return (
    <header className='flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2'>
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              className='order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0'
              onClick={() => {
                router.push('/')
                router.refresh()
              }}
            >
              <PlusIcon />
              <span className='md:sr-only'>Novo Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Novo Chat</TooltipContent>
        </Tooltip>
      )}

      {!isReadonly && (
        <div
          className={`${
            messagesCount > 0 ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <ModelSelector
            selectedModelId={selectedModelId}
            className='order-1 md:order-2'
          />
        </div>
      )}

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          className='order-1 md:order-3'
        />
      )}
    </header>
  )
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId
})

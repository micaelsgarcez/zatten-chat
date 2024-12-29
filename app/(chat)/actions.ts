'use server'

import { type CoreUserMessage, generateText } from 'ai'
import { cookies } from 'next/headers'

import { VisibilityType } from '@/components/visibility-selector'
import { customModel } from '@/lib/ai'
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById
} from '@/lib/db/queries'

export async function saveModelId(model: string) {
  const cookieStore = await cookies()
  cookieStore.set('model-id', model)
}

export async function generateTitleFromUserMessage({
  message
}: {
  message: CoreUserMessage
}) {
  const { text: title } = await generateText({
    model: customModel('gpt-4o-mini'),
    system: `\n
    - você gerará um título curto com base na primeira mensagem com a qual um usuário inicia uma conversa
    - certifique-se de que não tenha mais de 80 caracteres
    - o título deve ser um resumo da mensagem do usuário
    - não use aspas ou dois pontos
    - sempre em português`,
    prompt: JSON.stringify(message)
  })

  return title
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id })

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt
  })
}

export async function updateChatVisibility({
  chatId,
  visibility
}: {
  chatId: string
  visibility: VisibilityType
}) {
  await updateChatVisiblityById({ chatId, visibility })
}

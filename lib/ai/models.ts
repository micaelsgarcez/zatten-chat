// Define your models here.

export interface Model {
  id: string
  label: string
  apiIdentifier: string
  description: string
}

export const models: Array<Model> = [
  {
    id: 'gpt-4o-mini',
    label: 'GPT 4o mini',
    apiIdentifier: 'gpt-4o-mini',
    description: 'Modelo pequeno para tarefas rápidas e leves'
  },
  {
    id: 'gpt-4o',
    label: 'GPT 4o',
    apiIdentifier: 'gpt-4o',
    description: 'Para tarefas complexas e com várias etapas'
  },
  {
    id: 'assistant',
    label: 'Assistant Próprio',
    apiIdentifier: 'assistant',
    description: 'Para respostas personalizadas'
  }
] as const

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini'

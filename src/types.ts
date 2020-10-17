import {SanityDocument} from '@sanity/types'

export interface Config {
  projectId: string
  dataset: string
  listen?: boolean
  overlayDrafts?: boolean
}

export interface Subscription {
  unsubscribe: () => void
}

export type MutationEvent = {
  type: 'mutation'
  documentId: string
  eventId: string
  identity: string
  mutations: unknown[]
  previousRev?: string
  resultRev?: string
  result?: SanityDocument | null
  previous?: SanityDocument | null
  effects?: {apply: unknown[]; revert: unknown[]}
  timestamp: string
  transactionId: string
  transition: 'update' | 'appear' | 'disappear'
}

export interface GroqSubscription {
  query: string
  params: Record<string, unknown>
  previousResult?: any
  callback: (res: any) => void
}

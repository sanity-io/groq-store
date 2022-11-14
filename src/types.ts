import {SanityDocument} from '@sanity/types'
import EventSourcePolyfill from 'eventsource'

export interface Subscription {
  unsubscribe: () => Promise<void>
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
  callback: (err: Error | undefined, result?: any) => void
}

export interface EnvImplementations {
  EventSource: typeof EventSource | typeof EventSourcePolyfill
  getDocuments: (options: {
    projectId: string
    dataset: string
    token?: string
    documentLimit?: number
    allowTypes?: string[]
  }) => Promise<SanityDocument[]>
}

export interface Config {
  projectId: string
  dataset: string
  listen?: boolean
  token?: string
  documentLimit?: number
  overlayDrafts?: boolean
  subscriptionThrottleMs?: number
  EventSource?: EnvImplementations['EventSource']
  allowTypes?: string[]
}
export interface GroqStore {
  query: <R = any>(groqQuery: string, params?: Record<string, unknown> | undefined) => Promise<R>
  getDocument: (documentId: string) => Promise<SanityDocument | null>
  getDocuments: (documentIds: string[]) => Promise<(SanityDocument | null)[]>
  subscribe: <R = any>(
    groqQuery: string,
    params: Record<string, unknown>,
    callback: (err: Error | undefined, result?: R) => void
  ) => Subscription
  close: () => Promise<void>
}

export interface ApiError {
  statusCode: number
  error: string
  message: string
}

export interface StreamError {
  error: {
    description?: string
    type: string
  }
}

export type StreamResult = SanityDocument | StreamError

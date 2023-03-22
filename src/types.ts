import type {SanityDocument} from '@sanity/types'
import type BrowserEventSource from '@sanity/eventsource/browser'
import type NodeEventSource from '@sanity/eventsource/node'

/** @public */
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

/** @public */
export interface EnvImplementations {
  EventSource: typeof NodeEventSource | typeof BrowserEventSource | typeof window.EventSource
  getDocuments: (
    options: Pick<Config, 'projectId' | 'dataset' | 'token' | 'documentLimit' | 'includeTypes'>
  ) => Promise<SanityDocument[]>
}

/** @public */
export interface Config {
  projectId: string
  dataset: string
  /**
   * Keep dataset up to date with remote changes.
   * @defaultValue true
   */
  listen?: boolean
  /**
   * Optional token, if you want to receive drafts, or read data from private datasets
   * NOTE: Needs custom EventSource to work in browsers
   */
  token?: string
  /**
   * Optional limit on number of documents, to prevent using too much memory unexpectedly
   * Throws on the first operation (query, retrieval, subscription) if reaching this limit.
   */
  documentLimit?: number
  /**
   * "Replaces" published documents with drafts, if available.
   * Note that document IDs will not reflect draft status, currently
   */
  overlayDrafts?: boolean
  /**
   * Throttle the event emits to batch updates.
   * @defaultValue 50
   */
  subscriptionThrottleMs?: number
  /**
   * Optional EventSource. Necessary to authorize using token in the browser, since
   * the native window.EventSource does not accept headers.
   */
  EventSource?: EnvImplementations['EventSource']
  /**
   * Optional allow list filter for document types. You can use this to limit the amount of documents by declaring the types you want to sync. Note that since you're fetching a subset of your dataset, queries that works against your Content Lake might not work against the local groq-store.
   * @example ['page', 'product', 'sanity.imageAsset']
   */
  includeTypes?: string[]
}

/** @public */
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

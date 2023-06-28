import {Subscription, MutationEvent, Config, ApiError, EnvImplementations} from './types'
import type BrowserEventSource from '@sanity/eventsource/browser'
import type NodeEventSource from '@sanity/eventsource/node'

type EventSourceInstance = InstanceType<EnvImplementations['EventSource']>

// The events used by Content Lake: https://www.sanity.io/docs/listening
export interface SharedEventSourceEventMap {
  welcome: MessageEvent
  mutation: MessageEvent
  channelError: MessageEvent
  disconnect: MessageEvent
  error: Event
}
declare module 'event-source-polyfill' {
  export interface EventSourceEventMap extends SharedEventSourceEventMap {}
}

const isNativeBrowserEventSource = (
  eventSource: EventSourceInstance
): eventSource is InstanceType<typeof globalThis.EventSource> =>
  typeof window !== 'undefined' &&
  eventSource.addEventListener === window.EventSource.prototype.addEventListener

const isPolyfillEventSource = (
  eventSource: EventSourceInstance
): eventSource is InstanceType<typeof BrowserEventSource | typeof NodeEventSource> =>
  !isNativeBrowserEventSource(eventSource)

const addEventSourceListener = (
  eventSource: EventSourceInstance,
  type: keyof SharedEventSourceEventMap,
  listener: EventListener
): void => {
  if (isPolyfillEventSource(eventSource)) {
    // Polyfilled event source does not accept option parameter
    eventSource.addEventListener(type, listener as any)
  } else {
    eventSource.addEventListener(type, listener, false)
  }
}

const encodeQueryString = ({
  query,
  params = {},
  options = {effectFormat: 'mendoza'},
}: {
  query: string
  params?: Record<string, unknown>
  options?: Record<string, unknown>
}) => {
  const searchParams = new URLSearchParams()
  searchParams.set('query', query)

  // Iterate params, the keys are prefixed with `$` and their values JSON stringified
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(`$${key}`, JSON.stringify(value))
  }
  // Options are passed as-is
  for (const [key, value] of Object.entries(options)) {
    // Skip falsy values
    if (value) searchParams.set(key, `${value}`)
  }

  return `?${searchParams}`
}

export function listen(
  EventSourceImpl: EnvImplementations['EventSource'],
  config: Config,
  handlers: {
    open: () => void
    error: (err: Error) => void
    next: (event: MutationEvent) => void
  }
): Subscription {
  const {projectId, dataset, token, includeTypes} = config
  const headers = token ? {Authorization: `Bearer ${token}`} : undefined

  // Make sure we only listen to mutations on documents part of the `includeTypes` allowlist, if provided
  const searchParams = encodeQueryString(
    Array.isArray(includeTypes) && includeTypes.length > 0
      ? {query: `*[_type in $includeTypes]`, params: {includeTypes}}
      : {query: '*'}
  )
  const url = `https://${projectId}.api.sanity.io/v1/data/listen/${dataset}${searchParams}`
  const es = new EventSourceImpl(url, {withCredentials: true, headers})

  addEventSourceListener(es, 'welcome', handlers.open)

  addEventSourceListener(es, 'mutation', getMutationParser(handlers.next))

  addEventSourceListener(es, 'channelError', (msg: any) => {
    es.close()

    let data
    try {
      data = JSON.parse(msg.data) as ApiError
    } catch (err) {
      handlers.error(new Error('Unknown error parsing listener message'))
      return
    }

    handlers.error(
      new Error(data.message || data.error || `Listener returned HTTP ${data.statusCode}`)
    )
  })

  addEventSourceListener(es, 'error', (err: Event) => {
    const origin = typeof window !== 'undefined' && window.location.origin
    const hintSuffix = origin ? `, and that the CORS-origin (${origin}) is allowed` : ''
    const errorMessage = isErrorLike(err) ? ` (${err.message})` : ''
    handlers.error(
      new Error(
        `Error establishing listener - check that the project ID and dataset are correct${hintSuffix}${errorMessage}`
      )
    )
  })

  return {
    unsubscribe: (): Promise<void> => Promise.resolve(es.close()),
  }
}

function getMutationParser(cb: (event: MutationEvent) => void): (msg: any) => void {
  return (msg: any) => {
    let data
    try {
      data = JSON.parse(msg.data)
    } catch (err) {
      // intentional noop
      return
    }

    cb(data)
  }
}

function isErrorLike(err: unknown): err is {message: string} {
  return typeof err === 'object' && err !== null && 'message' in err
}

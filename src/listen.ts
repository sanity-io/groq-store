import {Subscription, MutationEvent, Config, ApiError, EnvImplementations} from './types'

type EventSourceInstance = InstanceType<EnvImplementations['EventSource']>

const isNativeBrowserEventSource = (
  eventSource: EventSourceInstance
): eventSource is InstanceType<typeof globalThis.EventSource> =>
  typeof window !== 'undefined' &&
  eventSource.addEventListener === window.EventSource.prototype.addEventListener

const addEventSourceListener = (
  eventSource: EventSourceInstance,
  type: string,
  listener: EventListener
): void => {
  if (isNativeBrowserEventSource(eventSource)) {
    // eslint-disable-next-line
    console.log('😱😱😱 isNativeBrowserEventSource 😱😱😱')
    eventSource.addEventListener(type, listener, false)
  }

  // Polyfilled event source does not accept option parameter
  eventSource.addEventListener(type, listener)
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
  const {projectId, dataset, token} = config
  const headers = token ? {Authorization: `Bearer ${token}`} : undefined
  const url = `https://${projectId}.api.sanity.io/v1/data/listen/${dataset}?query=*&effectFormat=mendoza`
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

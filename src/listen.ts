import {Subscription, MutationEvent, Config, ApiError} from './types'

export function listen(
  EventSourceImpl: typeof EventSource,
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
  const es = new EventSourceImpl(url, {withCredentials: true, headers} as any)

  es.addEventListener('welcome', handlers.open, false)

  es.addEventListener('mutation', getMutationParser(handlers.next), false)

  es.addEventListener(
    'channelError',
    ((msg: MessageEvent<string>) => {
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
    }) as any,
    false
  )

  es.addEventListener(
    'error',
    () => handlers.error(new Error('Error establishing listener - check project ID and dataset')),
    false
  )

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

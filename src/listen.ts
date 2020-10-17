import {Subscription, MutationEvent, Config} from './types'

export function listen(
  EventSourceImpl: typeof EventSource,
  config: Config,
  handlers: {
    open: () => void
    error: (err: Event) => void
    next: (event: MutationEvent) => void
  }
): Subscription {
  const {projectId, dataset} = config
  const url = `https://${projectId}.api.sanity.io/v1/data/listen/${dataset}?query=*&effectFormat=mendoza`
  const es = new EventSourceImpl(url, {withCredentials: true})
  es.addEventListener('welcome', handlers.open, false)
  es.addEventListener('error', handlers.error, false)
  es.addEventListener('mutation', getMutationParser(handlers.next), false)
  return {unsubscribe: es.close}
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

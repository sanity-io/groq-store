import EventSource from 'eventsource'
import {groqStore as groqStoreApi} from '../groqStore'
import {Config, EnvImplementations, GroqStore} from '../types'
import {getDocuments} from './getDocuments'
import {assertEnvSupport} from './support'

export function groqStore(config: Config): GroqStore {
  assertEnvSupport()

  return groqStoreApi(config, {
    // Need to use eventsource library to enable authentication with token (e.g. Firefox and Safari)
    // Native EventSource implementation does not accept headers
    EventSource: (EventSource as any) as EnvImplementations['EventSource'],
    getDocuments,
  })
}

export {default as groq} from 'groq'
export {Subscription, GroqStore} from '../types'

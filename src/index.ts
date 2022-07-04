/**
 * Note: Entry point for _browser_ build is in browser/index.ts
 */
import EventSourcePolyfill from 'eventsource'
import {groqStore as groqStoreApi} from './groqStore'
import {Config, GroqStore} from './types'
import {getDocuments} from './node/getDocuments'
import {assertEnvSupport} from './node/support'

export function groqStore(config: Config): GroqStore {
  assertEnvSupport()

  return groqStoreApi(config, {
    EventSource: config.EventSource ?? EventSourcePolyfill,
    getDocuments,
  })
}

export {default as groq} from 'groq'
export {Subscription, GroqStore} from './types'

/**
 * Note: Entry point for _browser_ build is in browser/index.ts
 */
import EventSourcePolyfill from '@sanity/eventsource/node'
import {groqStore as groqStoreApi} from './groqStore'
import {Config, GroqStore} from './types'
import {getDocuments} from './node/getDocuments'
import {assertEnvSupport} from './node/support'

/** @public */
export function groqStore(config: Config): GroqStore {
  assertEnvSupport()

  return groqStoreApi(config, {
    EventSource: config.EventSource ?? EventSourcePolyfill,
    getDocuments,
  })
}

export {default as groq} from 'groq'
export type {Subscription, GroqStore, Config, EnvImplementations} from './types'

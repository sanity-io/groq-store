/**
 * Note: Entry point for _browser_ build is in browser/index.ts
 */
import EventSourcePolyfill from '@sanity/eventsource/node'

import {groqStore as groqStoreApi} from './groqStore'
import {getDocuments} from './node/getDocuments'
import {assertEnvSupport} from './node/support'
import {Config, GroqStore} from './types'

/** @public */
export function groqStore(config: Config): GroqStore {
  assertEnvSupport()

  return groqStoreApi(config, {
    EventSource: config.EventSource ?? EventSourcePolyfill,
    getDocuments,
  })
}

export type {Config, EnvImplementations, GroqStore, Subscription} from './types'
export {default as groq} from 'groq'

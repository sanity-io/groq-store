import {groqStore as groqStoreApi} from '../groqStore'
import {Config, GroqStore} from '../types'
import {getDocuments} from './getDocuments'
import {assertEnvSupport} from './support'

export function groqStore(config: Config): GroqStore {
  assertEnvSupport()

  const EventSource = config.EventSource ?? window.EventSource

  if (config.token && EventSource === window.EventSource) {
    throw new Error('When`token` option is used, `EventSource` option must also be provided. EventSource cannot be `window.EventSource`, as it does not support passing a token.')
  }

  return groqStoreApi(config, {
    EventSource,
    getDocuments,
  })
}

export {default as groq} from 'groq'
export {Subscription, GroqStore} from '../types'

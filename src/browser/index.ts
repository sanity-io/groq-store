import {memQuery as configurableMemQuery} from '../memquery'
import {Config, MemQueryApi} from '../types'
import {getDocuments} from './getDocuments'
import {assertEnvSupport} from './support'

export function memQuery(config: Config): MemQueryApi {
  assertEnvSupport()

  if (config.token) {
    throw new Error('`token` option not currently supported in browser')
  }

  return configurableMemQuery(config, {
    EventSource: window.EventSource,
    getDocuments,
  })
}

export {default as groq} from 'groq'
export {Subscription} from '../types'

import EventSource from 'eventsource'
import {memQuery as configurableMemQuery} from '../memquery'
import {Config, EnvImplementations, MemQueryApi} from '../types'
import {getDocuments} from './getDocuments'
import {assertEnvSupport} from './support'

export function memQuery(config: Config): MemQueryApi {
  assertEnvSupport()

  return configurableMemQuery(config, {
    EventSource: (EventSource as any) as EnvImplementations['EventSource'],
    getDocuments,
  })
}

export {default as groq} from 'groq'
export {Subscription} from '../types'

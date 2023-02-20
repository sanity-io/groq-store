import {EventEmitter} from 'events'
import {SanityDocument} from '@sanity/types'

type Events = {
  /**
   * Emitted after the dataset was loaded.
   */
  datasetLoaded: {
    dataset: string
    documents: SanityDocument[]
  }

  /**
   * Emitted each time the dataset changes. This happens when the dataset
   * is initialised, and after mutations are applied through listeners.
   */
  datasetChanged: {
    dataset: string
    documents: SanityDocument[]
  }
}

export interface TypedEventEmitter extends EventEmitter {
  on<K extends keyof Events>(s: K, listener: (v: Events[K]) => void): this
  emit<K extends keyof Events>(eventName: K, params: Events[K]): boolean
}

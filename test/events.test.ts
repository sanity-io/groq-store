import EventSource from 'eventsource'
import {groqStore as groqStoreApi} from '../src/groqStore'
import {EnvImplementations, Config} from '../src/types'
import * as baseConfig from './config'
import * as listener from '../src/listen'
import {MutationEvent} from '@sanity/client'

describe('events', () => {
  it('datasetLoaded fires when dataset is loaded', async () => {
    const config: Config = {
      ...baseConfig,
      token: 'my-token',
    }

    const getDocuments = jest.fn().mockResolvedValue([{_id: 'foo', value: 'bar'}])
    const datasetLoadedCb = jest.fn()

    const store = groqStoreApi(config, {
      EventSource: EventSource as any as EnvImplementations['EventSource'],
      getDocuments,
    })

    store.on('datasetLoaded', datasetLoadedCb)

    await store.query('*')

    expect(datasetLoadedCb).toBeCalledTimes(1)
    expect(datasetLoadedCb).toBeCalledWith({
      dataset: 'fixture',
      documents: [{_id: 'foo', value: 'bar'}],
    })
  })

  it('datasetChanged fires each time the dataset changes', async () => {
    const config: Config = {
      ...baseConfig,
      listen: true,
      token: 'my-token',
    }

    jest.useFakeTimers()
    jest.spyOn(listener, 'listen').mockImplementation((_esImpl, _config, handlers) => {
      handlers.open()

      // Call `next()` a little bit later to imitate a mutation received event
      // eslint-disable-next-line max-nested-callbacks
      setTimeout(() => handlers.next({} as any as MutationEvent), 50)

      return {
        unsubscribe: () => Promise.resolve(),
      }
    })

    const getDocuments = jest.fn().mockResolvedValue([
      {_id: 'foo', value: 'bar'},
      // {_id: 'bar', value: 'foo'},
    ])
    const datasetChangedCb = jest.fn()

    const store = groqStoreApi(config, {
      EventSource: EventSource as any as EnvImplementations['EventSource'],
      getDocuments,
    })

    store.on('datasetChanged', datasetChangedCb)

    await store.query('*')

    expect(datasetChangedCb).toBeCalledTimes(1)
    expect(datasetChangedCb).toBeCalledWith({
      dataset: 'fixture',
      documents: [{_id: 'foo', value: 'bar'}],
    })

    jest.advanceTimersByTime(100)

    expect(datasetChangedCb).toBeCalledTimes(2)
  })
})

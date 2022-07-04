import EventSource from 'eventsource'
import {groqStore as groqStoreApi} from '../src/groqStore'
import {EnvImplementations, Config} from '../src/types'
import * as baseConfig from './config'

describe('getDocuments', () => {
  it('calls it with the configured token', async () => {
    const config: Config = {
      ...baseConfig,
      token: 'my-token',
    }

    const getDocuments = jest.fn().mockResolvedValue([])

    const store = groqStoreApi(config, {
      EventSource: EventSource as any as EnvImplementations['EventSource'],
      getDocuments,
    })

    await store.query('*')
    expect(getDocuments).toBeCalledWith(
      expect.objectContaining({
        token: 'my-token',
      })
    )
  })
})

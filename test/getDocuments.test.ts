import EventSource from '@sanity/eventsource'
import {describe, expect, it, vi} from 'vitest'

import {groqStore as groqStoreApi} from '../src/groqStore'
import {Config} from '../src/types'
import * as baseConfig from './config'

describe('getDocuments', () => {
  it('calls it with the configured token', async () => {
    const config: Config = {
      ...baseConfig,
      token: 'my-token',
    }

    const getDocuments = vi.fn().mockResolvedValue([])

    const store = groqStoreApi(config, {
      EventSource,
      getDocuments,
    })

    await store.query('*')
    expect(getDocuments).toBeCalledWith(
      expect.objectContaining({
        token: 'my-token',
      }),
    )
  })
})

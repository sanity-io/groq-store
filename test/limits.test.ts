import {afterAll, beforeAll, describe, expect, test} from 'vitest'

import {groqStore} from '../src'
import {GroqStore} from '../src/types'
import * as config from './config'

describe(
  'limits',
  () => {
    let store: GroqStore

    beforeAll(() => {
      store = groqStore({...config, listen: false, overlayDrafts: true, documentLimit: 5})
    })

    afterAll(async () => {
      await store.close()
    })

    test('limits number of documents, if specified', async () => {
      let error
      try {
        const result = await store.query('*[0]')
        expect(result).not.toBeTruthy()
      } catch (err) {
        error = err
      }

      expect(error).toBeInstanceOf(Error)
      if (error instanceof Error) {
        expect(error.message).toMatch(/limit/i)
      }
    })
  },
  {timeout: 30000},
)

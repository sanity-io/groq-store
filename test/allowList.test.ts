import * as config from './config'
import {groqStore, groq} from '../src'
import {GroqStore} from '../src/types'
import {describe, beforeAll, afterAll, test, expect} from 'vitest'

describe(
  'allowList',
  () => {
    let store: GroqStore

    beforeAll(() => {
      store = groqStore({...config, listen: false, overlayDrafts: true, includeTypes: ['product']})
    })

    afterAll(async () => {
      await store.close()
    })

    test('only allow product documents in store', async () => {
      expect(await store.query(groq`count(*[_type == "vendor"])`)).toEqual(0)
      expect(await store.query(groq`count(*[_type == "product"])`)).toEqual(12)
    })
  },
  {timeout: 30000}
)

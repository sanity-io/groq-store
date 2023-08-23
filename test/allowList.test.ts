import {afterAll, beforeAll, describe, expect, test} from 'vitest'

import {groq, groqStore} from '../src'
import {GroqStore} from '../src/types'
import * as config from './config'

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
      expect(await store.query(groq`count(*[_type == "product"])`)).toEqual(11)
    })
  },
  {timeout: 30000},
)

import * as config from './config'
import {groqStore, groq} from '../src'
import {GroqStore} from '../src/types'

describe('allowList', () => {
  jest.setTimeout(30000)

  let store: GroqStore

  beforeAll(() => {
    store = groqStore({...config, listen: false, overlayDrafts: true, allowTypes: ['product']})
  })

  afterAll(async () => {
    await store.close()
  })

  test('only allow product documents in store', async () => {
    expect(await store.query(groq`count(*[_type == "vendor"])`)).toEqual(0)
    expect(await store.query(groq`count(*[_type == "product"])`)).toEqual(11)
  })
})

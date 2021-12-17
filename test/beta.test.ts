import * as config from './config'
import {groqStore} from '../src'
import {GroqStore} from '../src/types'

describe('beta', () => {
  jest.setTimeout(30000)

  let store: GroqStore
  let betaStore: GroqStore

  beforeAll(() => {
    store = groqStore({...config, listen: false, useGroqBeta: false})
    betaStore = groqStore({...config, listen: false, useGroqBeta: true})
  })

  afterAll(async () => {
    await store.close()
    await betaStore.close()
  })

  test('can use both beta and non-beta versions', async () => {
    const result = await store.query('*[0]')
    const betaResult = await betaStore.query('*[0]')

    expect(result).toMatchObject(betaResult)
  })
})

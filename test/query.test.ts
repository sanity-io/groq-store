import * as config from './config'
import {memQuery, groq} from '../src/node'
import {MemQueryApi} from '../src/types'

describe('query', () => {
  jest.setTimeout(30000)

  let store: MemQueryApi

  beforeAll(() => {
    store = memQuery({...config, listen: false, overlayDrafts: true})
  })

  afterAll(async () => {
    await store.close()
  })

  test('can query', async () => {
    expect(await store.query(groq`*[_type == "vendor"][].title | order(@ asc)`)).toEqual([
      'Cadbury',
      'Chocolates Garoto',
      'Ferrero',
      'Freia',
      'Katjes',
      'Kracie',
      'Malaco',
      'Nestlè',
      'Totte Gott',
    ])

    expect(await store.query(groq`*[_type == "vendor"][].title | order(@ asc) | [3]`)).toEqual(
      'Freia'
    )
  })
})

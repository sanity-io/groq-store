import * as config from './config'
import {groqStore, groq} from '../src'
import {GroqStore} from '../src/types'
import {describe, beforeAll, afterAll, test, expect} from 'vitest'

describe(
  'query',
  () => {
    let store: GroqStore

    beforeAll(() => {
      store = groqStore({...config, listen: false, overlayDrafts: true})
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

      expect(await store.query(groq`*[_type == "vendor"][].title | order(@ asc) [3]`)).toEqual(
        'Freia'
      )
      expect(await store.query(groq`array::unique(*._type)`)).toEqual([
        'category',
        'product',
        'sanity.imageAsset',
        'vendor',
      ])
    })
  },
  {timeout: 30000}
)

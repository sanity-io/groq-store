import {afterAll, beforeAll, describe, expect, test} from 'vitest'

import {groq, groqStore} from '../src'
import {GroqStore} from '../src/types'
import * as config from './config'

describe(
  'query with overlayDrafts',
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
        'Freia',
      )
      expect(new Set(await store.query(groq`array::unique(*._type)`))).toEqual(
        new Set(['category', 'product', 'sanity.imageAsset', 'vendor']),
      )
    })

    test('populates _originalId', async () => {
      const id = await store.query(groq`*[_type == "vendor"][0]._originalId`)
      expect(id).toBe('01ca40b6-e7fd-4676-af25-33f591de51c0')
    })

    test('sorts based on _id', async () => {
      const titles = await store.query(groq`*[_type == "vendor"].title`)
      expect(titles).toEqual([
        'Kracie',
        'Nestlè',
        'Ferrero',
        'Freia',
        'Malaco',
        'Chocolates Garoto',
        'Katjes',
        'Cadbury',
        'Totte Gott',
      ])
    })
  },
  {timeout: 30000},
)

describe('query without overlayDrafts', () => {
  let store: GroqStore

  beforeAll(() => {
    store = groqStore({...config, listen: false, overlayDrafts: false})
  })

  afterAll(async () => {
    await store.close()
  })

  test('sorts based on _id', async () => {
    const titles = await store.query(groq`*[_type == "vendor"].title`)
    expect(titles).toEqual([
      'Kracie',
      'Nestlè',
      'Ferrero',
      'Freia',
      'Malaco',
      'Chocolates Garoto',
      'Katjes',
      'Cadbury',
      'Totte Gott',
    ])
  })
})

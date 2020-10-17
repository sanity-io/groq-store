import groq from 'groq'
import deepEqual from 'fast-deep-equal'
import {SanityDocument} from '@sanity/types'
import {parse, evaluate} from 'groq-js'
import {listen} from './browser/listen'
import {Config, GroqSubscription, Subscription} from './types'
import {getSyncingDataset} from './syncingDataset'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function memQuery(config: Config) {
  checkBrowserSupport()

  let documents: SanityDocument[] = []
  const activeSubscriptions: GroqSubscription[] = []
  const dataset = getSyncingDataset(config, (docs) => {
    documents = docs
    executeAllSubscriptions()
  })

  async function query<R = any>(groqQuery: string, params?: Record<string, unknown>): Promise<R> {
    await dataset.loaded
    const tree = parse(groqQuery)
    const result = await evaluate(tree, {dataset: documents, params})
    return result.get()
  }

  async function getDocument(documentId: string): Promise<SanityDocument | null> {
    await dataset.loaded
    return query(groq`*[_id == $id][0]`, {id: documentId})
  }

  async function getDocuments(documentIds: string[]): Promise<(SanityDocument | null)[]> {
    await dataset.loaded
    const subQueries = documentIds.map((id) => `*[_id == "${id}"][0]`).join(',\n')
    return query(`[${subQueries}]`)
  }

  function subscribe(
    groqQuery: string,
    params: Record<string, unknown>,
    next: (result: any) => void
  ): Subscription {
    if (!listen) {
      throw new Error('Cannot use `subscribe()` without `listen: true`')
    }

    // @todo Execute the query against an empty dataset for validation purposes

    // Store the subscription so we can re-run the query on new data
    const subscription = {query: groqQuery, params, callback: next}
    activeSubscriptions.push(subscription)

    let unsubscribed = false
    const unsubscribe = () => {
      if (unsubscribed) {
        return
      }

      unsubscribed = true
      activeSubscriptions.splice(activeSubscriptions.indexOf(subscription), 1)
    }

    executeQuerySubscription(subscription)
    return {unsubscribe}
  }

  function executeQuerySubscription(subscription: GroqSubscription) {
    return query(subscription.query, subscription.params).then((res) => {
      if ('previousResult' in subscription && deepEqual(subscription.previousResult, res)) {
        return
      }

      subscription.previousResult = res
      subscription.callback(res)
    })
  }

  function executeAllSubscriptions() {
    activeSubscriptions.forEach(executeQuerySubscription)
  }

  function close() {
    if (dataset) {
      dataset.unsubscribe()
    }
  }

  return {query, getDocument, getDocuments, subscribe, close}
}

function checkBrowserSupport() {
  const required = ['EventSource', 'ReadableStream', 'fetch']
  const unsupported = required.filter((api) => !(api in window))

  if (unsupported.length > 0) {
    throw new Error(`Browser not supported. Missing browser APIs: ${unsupported.join(', ')}`)
  }
}

export {groq, Subscription}

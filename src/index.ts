import groq from 'groq'
import {SanityDocument} from '@sanity/types'
import {parse, evaluate} from 'groq-js'
import {getDocuments as getRemoteDocuments} from './browser/getDocuments'

export interface Config {
  projectId: string
  dataset: string
  listen?: boolean
  overlayDrafts?: boolean
}

export interface Subscription {
  unsubscribe: () => void
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function memQuery(config: Config) {
  checkBrowserSupport()

  const {projectId, dataset, listen, overlayDrafts} = config
  let documents: SanityDocument[] = []

  const load = getRemoteDocuments(projectId, dataset).then((docs) => {
    documents = docs
  })

  async function query<R = any>(groqQuery: string, params?: Record<string, unknown>): Promise<R> {
    await load
    const tree = parse(groqQuery)
    const result = await evaluate(tree, {dataset: documents, params})
    return result.get()
  }

  async function getDocument(documentId: string): Promise<SanityDocument | null> {
    await load
    return query(groq`*[_id == $id][0]`, {id: documentId})
  }

  async function getDocuments(documentIds: string[]): Promise<(SanityDocument | null)[]> {
    await load
    const subQueries = documentIds.map((id) => `*[_id == "${id}"][0]`).join(',\n')
    return query(`[${subQueries}]`)
  }

  function subscribe(
    groqQuery: string,
    params: Record<string, unknown>,
    next: (result: any) => void
  ): Subscription {
    query(groqQuery, params).then(next)
    const unsubscribe = () => {}
    return {unsubscribe}
  }

  function close() {
    // do nothing
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

export {groq}

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

export interface MemQueryApi {
  query: (query: string, params?: Record<string, unknown>) => Promise<SanityDocument>
  getDocument: (id: string) => Promise<SanityDocument | null>
  getDocuments: (ids: string[]) => Promise<(SanityDocument | null)[]>
  close: () => void
}

export function memQuery(config: Config): MemQueryApi {
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

  function close() {
    // do nothing
  }

  return {query, getDocument, getDocuments, close}
}

export {groq}

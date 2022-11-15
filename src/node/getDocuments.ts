import split from 'split2'
import get from 'simple-get'
import {SanityDocument} from '@sanity/types'
import {EnvImplementations, StreamResult} from '../types'
import {getError, isRelevantDocument, isStreamError} from '../exportUtils'

export const getDocuments: EnvImplementations['getDocuments'] = function getDocuments({
  projectId,
  dataset,
  token,
  documentLimit,
  includeTypes = [],
}: {
  projectId: string
  dataset: string
  token?: string
  documentLimit?: number
  includeTypes?: string[]
}): Promise<SanityDocument[]> {
  const baseUrl = `https://${projectId}.api.sanity.io/v1/data/export/${dataset}`
  const params =
    includeTypes.length > 0 ? new URLSearchParams({types: includeTypes?.join(',')}) : ''
  const url = `${baseUrl}?${params}`
  const headers = token ? {Authorization: `Bearer ${token}`} : undefined

  return new Promise((resolve, reject) => {
    get({url, headers}, (err, response) => {
      if (err) {
        reject(err)
        return
      }

      response.setEncoding('utf8')

      const chunks: Buffer[] = []
      if (response.statusCode !== 200) {
        response
          .on('data', (chunk: Buffer) => chunks.push(chunk))
          .on('end', () => {
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
            reject(new Error(`Error streaming dataset: ${getError(body)}`))
          })
        return
      }

      const documents: SanityDocument[] = []
      response
        .pipe(split(JSON.parse))
        .on('data', (doc: StreamResult) => {
          if (isStreamError(doc)) {
            reject(new Error(`Error streaming dataset: ${doc.error}`))
            return
          }

          if (doc && isRelevantDocument(doc)) {
            documents.push(doc)
          }

          if (documentLimit && documents.length > documentLimit) {
            reject(
              new Error(`Error streaming dataset: Reached limit of ${documentLimit} documents`)
            )
            response.destroy()
          }
        })
        .on('end', () => resolve(documents))
    })
  })
}

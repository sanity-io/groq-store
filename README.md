# @sanity/groq-store

[![npm stat](https://img.shields.io/npm/dm/@sanity/groq-store.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@sanity/groq-store)
[![npm version](https://img.shields.io/npm/v/@sanity/groq-store.svg?style=flat-square)](https://www.npmjs.com/package/@sanity/groq-store)
[![gzip size][gzip-badge]][bundlephobia]
[![size][size-badge]][bundlephobia]

In-memory GROQ store. Streams all available documents from Sanity into an in-memory database and allows you to query them there.

## Targets

- Node.js >= 14
- Modern browsers (Edge >= 14, Chrome, Safari, Firefox etc)

## Caveats

- Streams _entire_ dataset to memory, so generally not recommended for large datasets
- Needs custom event source to work with tokens in browser

## Installation

```bash
npm i @sanity/groq-store
```

## Usage

```js
import {groqStore, groq} from '@sanity/groq-store'
// import SanityEventSource from '@sanity/eventsource'

const store = groqStore({
  projectId: 'abc123',
  dataset: 'blog',

  // Keep dataset up to date with remote changes. Default: false
  listen: true,

  // "Replaces" published documents with drafts, if available.
  // Note that document IDs will not reflect draft status, currently
  overlayDrafts: true,

  // Optional token, if you want to receive drafts, or read data from private datasets
  // NOTE: Needs custom EventSource to work in browsers
  token: 'someAuthToken',

  // Optional limit on number of documents, to prevent using too much memory unexpectedly
  // Throws on the first operation (query, retrieval, subscription) if reaching this limit.
  documentLimit: 10000,

  // Optional EventSource. Necessary to authorize using token in the browser, since
  // the native window.EventSource does not accept headers.
  // EventSource: SanityEventSource,

  // Optional allow list filter for document types. You can use this to limit the amount of documents by declaring the types you want to sync. Note that since you're fetching a subset of your dataset, queries that works against your Content Lake might not work against the local groq-store.
  // You can quickly list all your types using this query: `array::unique(*[]._type)`
  includeTypes: ['post', 'page', 'product', 'sanity.imageAsset'],
})

store.query(groq`*[_type == "author"]`).then((docs) => {
  console.log(docs)
})

store.getDocument('grrm').then((grrm) => {
  console.log(grrm)
})

store.getDocuments(['grrm', 'jrrt']).then(([grrm, jrrt]) => {
  console.log(grrm, jrrt)
})

const sub = store.subscribe(
  groq`*[_type == $type][] {name}`, // Query
  {type: 'author'}, // Params
  (err, result) => {
    if (err) {
      console.error('Oh no, an error:', err)
      return
    }

    console.log('Result:', result)
  }
)

// Later, to close subscription:
sub.unsubscribe()

// Later, to close listener:
store.close()
```

## License

MIT © [Sanity.io](https://www.sanity.io/)

## Release new version

Run ["CI & Release" workflow](https://github.com/sanity-io/groq-store/actions).
Make sure to select the main branch and check "Release new version".

Version will be automatically bumped based on [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) since the last release.

Semantic release will only release on configured branches, so it is safe to run release on any branch.

Note: commits with `chore:` will be ignored. If you want updated dependencies to trigger
a new version, use `fix(deps):` instead.

[gzip-badge]: https://img.shields.io/bundlephobia/minzip/@sanity/groq-store?label=gzip%20size&style=flat-square
[size-badge]: https://img.shields.io/bundlephobia/min/@sanity/groq-store?label=size&style=flat-square
[bundlephobia]: https://bundlephobia.com/package/@sanity/groq-store

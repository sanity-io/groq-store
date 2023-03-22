import {groqStore, Subscription} from '../src/browser'

//
;(function () {
  // Yep
  const queryEl = document.getElementById('query') as HTMLTextAreaElement
  const resultEl = document.getElementById('result') as HTMLTextAreaElement
  const clearBtnEl = document.getElementById('clear') as HTMLButtonElement
  const executeBtnEl = document.getElementById('execute') as HTMLButtonElement
  const subscribeBtnEl = document.getElementById('subscribe') as HTMLButtonElement

  attach()
  populate()

  let subscription: Subscription | null | undefined
  const store = groqStore({
    projectId: 'groqstore',
    dataset: 'fixture',
    listen: true,
    overlayDrafts: true,
  })

  store.on('datasetLoaded', ({dataset, documents}) => {
    // eslint-disable-next-line no-console
    console.info(`Dataset "${dataset}" loaded with ${documents.length} documents`)
  })

  function attach() {
    clearBtnEl.addEventListener('click', clear, false)
    executeBtnEl.addEventListener('click', execute, false)
    subscribeBtnEl.addEventListener('click', subscribe, false)
    queryEl.addEventListener('keyup', onKeyUp, false)
  }

  function populate() {
    if (!localStorage.groqStore) {
      return
    }

    queryEl.value = localStorage.groqStore
  }

  async function execute() {
    resultEl.value = '… querying …'
    localStorage.setItem('groqStore', queryEl.value)
    try {
      onResult(await store.query(queryEl.value))
    } catch (err: any) {
      onError(err.message || 'Unknown error')
    }
  }

  function subscribe() {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
      subscribeBtnEl.textContent = 'Subscribe'
      executeBtnEl.disabled = false
      clear()
    } else {
      resultEl.value = '… querying …'
      executeBtnEl.disabled = true
      subscribeBtnEl.textContent = 'Unsubscribe'
      subscription = store.subscribe(queryEl.value, {}, onResult)
    }
  }

  function onResult(queryResult: any) {
    const json = JSON.stringify(queryResult, null, 2)
    resultEl.value = json
  }

  function onError(msg: string) {
    resultEl.value = `/*** ERROR ***/\n\n${msg}`
  }

  function onKeyUp(evt: KeyboardEvent) {
    if (evt.ctrlKey && evt.key === 'Enter') {
      execute()
    }
  }

  function clear() {
    resultEl.value = ''
  }
})()

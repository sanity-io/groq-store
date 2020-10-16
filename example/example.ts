import {memQuery, groq} from '../../src'

//
;(async function () {
  // Yep
  const queryEl = document.getElementById('query') as HTMLTextAreaElement
  const resultEl = document.getElementById('result') as HTMLTextAreaElement
  const clearBtnEl = document.getElementById('clear') as HTMLButtonElement
  const executeBtnEl = document.getElementById('execute') as HTMLButtonElement

  attach()
  const dataset = memQuery({projectId: 'memquery', dataset: 'fixture'})

  function attach() {
    clearBtnEl.addEventListener('click', clear, false)
    executeBtnEl.addEventListener('click', execute, false)
  }

  async function execute() {
    resultEl.value = '… querying …'
    const results = await dataset.query(queryEl.value)
    const json = JSON.stringify(results, null, 2)
    resultEl.value = json
  }

  function clear() {
    resultEl.value = ''
  }
})()

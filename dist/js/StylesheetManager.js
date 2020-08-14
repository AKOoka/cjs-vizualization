class StylesheetManager {
  constructor () {
    this.context = null
  }

  setContext (context) {
    this.context = context
  }

  changeStyleForJob (jobId) {
    const rule = `.job-${jobId}.range { filter: brightness(80%); border: 2px dashed black; color: white; font-weight: bold; }`

    this.context.stylesheet.sheet.insertRule(rule, 0)
    console.log(this.stylesheet.sheet)
  }

  changeStyleForAtomicCounter (acId) {

  }

  removeStyleOfJob (jobId) {
    // there is weird behaviour of deleteRule - it deletes first rule if doesn't find rule that was searched
    this.context.stylesheet.sheet.deleteRule(`.job-${jobId}.range`)
  }
}

export { StylesheetManager }

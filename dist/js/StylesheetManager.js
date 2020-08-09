class StylesheetManager {
  constructor () {
    this.stylesheet = document.querySelector('#range-styles')
  }

  changeStyleForJob (jobId) {
    this.stylesheet.sheet.insertRule(`.job-${jobId}.range { filter: brightness(80%); border: 2px dashed black; color: white; font-weight: bold; }`, 0)
    console.log(this.stylesheet.sheet)
  }

  changeStyleForAtomicCounter (acId) {

  }

  removeStyleOfJob (jobId) {
    // there is weird behaviour of deleteRule - it deletes first rule if doesn't find rule that was searched
    this.stylesheet.sheet.deleteRule(`.job-${jobId}.range`)
  }
}

export { StylesheetManager }

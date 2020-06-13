class StylesheetManager {
  constructor () {
    this.stylesheet = document.querySelector('#range-styles')
  }

  changeStyleForJobRanges (jobId) {
    this.stylesheet.sheet.insertRule(`.job-${jobId}.range { background-color: green; }`, 0)
    console.log(this.stylesheet.sheet)
  }

  changeStyleForJobSpawns (jobId) {
    this.stylesheet.sheet.insertRule(`.job-${jobId}.range { background-color: green; }`, 0)
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

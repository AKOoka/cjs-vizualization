class StylesheetManager {
  constructor () {
    this.stylsheet = document.querySelector('#range-styles')
  }

  changeStyleForJobRanges (jobId) {
    this.stylesheet.innerHTML += `job-${jobId} { background-color: green; }`
  }

  changeStyleForJobSpawns (jobId) {

  }

  changeStyleForAtomicCounter (acId) {

  }
}

export { StylesheetManager }

import { ContextualMenu } from './ContextualMenu.js'
import { JobSelector } from './JobSelector.js'
import { StylesheetManager } from './StylesheetManager.js'

function getIndex (div) {
  return div.className.match(/job-\d+/)[0].slice(4)
}

class ActionControlls {
  constructor () {
    this.selectedJobs = new Set()
    this.selectedJobDOMElements = new Set()
    this.contextualMenu = new ContextualMenu()
    this.jobSelector = new JobSelector()
    this.stylesheetManager = new StylesheetManager()
  }

  setActionControlls (domRoot) {
    this.contextualMenu.createMenuDOM({
      showJobRangesListener: this.showJobRangesListener,
      showJobSpawnsListener: this.showJobSpawnsListener,
      showAtomicCounterListener: this.showAtomicCounterListener
    })

    const { deselectJob, selectJob, deselectAllJobs } = this.jobSelector

    domRoot.oncontextmenu = event => {
      event.preventDefault()

      this.contextualMenu.hideMenu()

      this.contextualMenu.showMenu(event)
    }

    domRoot.onclick = ({ ctrlKey, target }) => {
      const isRange = target.className.includes('range')

      this.contextualMenu.hideMenu()

      if (ctrlKey && isRange) {
        deselectJob(getIndex(target), target, this.selectedJobs, this.selectedJobDOMElements)
      } else if (isRange) {
        selectJob(getIndex(target), target, this.selectedJobs, this.selectedJobDOMElements)
      } else {
        deselectAllJobs(this.selectedJobs, this.selectedJobDOMElements)
      }
    }
  }

  showJobRangesListener () {
    console.log('showJobRangesListener')
    this.selectedJobs.forEach(jobId => {
      this.stylesheetManager.changeStyleForJobRanges(jobId)
    })
  }

  showJobSpawnsListener () {
    console.log('showJobSpawnsListener')
    this.selectedJobs.forEach(jobId => {
      this.stylesheetManager.changeStyleForJobSpawns(jobId)
    })
  }

  showAtomicCounterListener (acId) {

  }
}

export { ActionControlls }

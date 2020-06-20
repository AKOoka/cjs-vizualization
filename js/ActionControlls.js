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
      showJobRangesListener: () => {
        this.showJobRangesListener(this.stylesheetManager)
      },
      showJobSpawnsListener: () => {
        this.showJobSpawnsListener(this.stylesheetManager)
      },
      showAtomicCounterListener: () => {
        this.showAtomicCounterListener(this.stylesheetManager)
      },
      hideDependencesListener: () => {
        this.hideDependencesListener(this.stylesheetManager)
      }
    })

    const { deselectJob, selectJob, deselectAllJobs } = this.jobSelector

    domRoot.oncontextmenu = event => {
      event.preventDefault()

      this.contextualMenu.hideMenu()

      this.contextualMenu.showMenu(event)
    }

    domRoot.onmousedown = ({ ctrlKey, target }) => {
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

  showJobRangesListener (stylesheetManager) {
    console.log('showJobRangesListener')
    this.selectedJobs.forEach(jobId => {
      stylesheetManager.changeStyleForJobRanges(jobId)
    })

    this.contextualMenu.hideMenu()
  }

  showJobSpawnsListener (stylesheetManager) {
    console.log('showJobSpawnsListener')
    this.selectedJobs.forEach(jobId => {
      stylesheetManager.changeStyleForJobSpawns(jobId)
    })

    this.contextualMenu.hideMenu()
  }

  showAtomicCounterListener (stylesheetManager) {

  }

  hideDependencesListener (stylesheetManager) {
    console.log('showJobSpawnsListener')
    this.selectedJobs.forEach(jobId => {
      stylesheetManager.removeStyleOfJob(jobId)
    })

    this.contextualMenu.hideMenu()
  }
}

export { ActionControlls }

import { ContextualMenu } from './ContextualMenu.js'
import { JobSelector } from './JobSelector.js'
import { StylesheetManager } from './StylesheetManager.js'

function getIndex (div) {
  return div.className.match(/job-\d+/)[0].slice(4)
}

class MouseActionControlls {
  constructor () {
    this.model = null
    this.selectedJobs = new Set()
    this.selectedJobDOMElements = new Set()
    this.contextualMenu = new ContextualMenu()
    this.jobSelector = new JobSelector()
    this.stylesheetManager = new StylesheetManager()
  }

  setContext (context) {
    const { deselectJob, selectJob, deselectAllJobs } = this.jobSelector

    for (const processor of context.values()) {
      processor.oncontextmenu = event => {
        event.preventDefault()

        this.contextualMenu.hideMenu()

        this.contextualMenu.showMenu(event)
      }

      processor.onmousedown = ({ ctrlKey, target }) => {
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
  }

  setModel (model) {
    this.contextualMenu.createMenuDOM({
      showJobRangesListener: () => {
        this.showJobRangesListener(this.stylesheetManager)
      },
      showJobSpawnsListener: () => {
        this.showJobSpawnsListener(this.stylesheetManager, model)
      },
      showAtomicCounterListener: () => {
        this.showAtomicCounterListener(this.stylesheetManager, model)
      },
      hideDependencesListener: () => {
        this.hideDependencesListener(this.stylesheetManager)
      }
    })
  }

  showJobRangesListener (stylesheetManager) {
    console.log('showJobRangesListener')
    this.selectedJobs.forEach(jobId => {
      stylesheetManager.changeStyleForJob(jobId)
    })

    this.contextualMenu.hideMenu()
  }

  showJobSpawnsListener (stylesheetManager, model) {
    console.log('showJobSpawnsListener')

    this.selectedJobs.forEach(jobId => {
      model.spawnedJobs.get(parseInt(jobId, 10)).forEach(spawnedJobs => {
        spawnedJobs.jobs.forEach(job => {
          stylesheetManager.changeStyleForJob(job)
        })
      })
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

export { MouseActionControlls }

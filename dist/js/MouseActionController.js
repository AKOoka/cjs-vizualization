import { ContextualMenu } from './ContextualMenu.js'
import { StylesheetManager } from './StylesheetManager.js'

class MouseActionController {
  constructor () {
    this.selectedJobs = new Set()
    this.selectedJobsDom = new Set()
    this.contextualMenu = new ContextualMenu()
    this.stylesheetManager = new StylesheetManager()
  }

  setContext (context, processorsContainer) {
    this.contextualMenu.setContext(context)

    for (const processor of processorsContainer.values()) {
      processor.oncontextmenu = this.showContextualMenu.bind(this)
      processor.onmousedown = this.mouseSelection.bind(this)
    }
  }

  setModel (model) {
    this.contextualMenu.createMenuDOM({
      showJobRangesListener: this.showJobRanges.bind(this),
      showJobSpawnsListener: this.showJobSpawns.bind(this, model),
      showAtomicCounterListener: this.showAtomicCounter.bind(this, model),
      hideDependencesListener: this.hideDependences.bind(this)
    })
  }

  showContextualMenu (event) {
    event.preventDefault()

    this.contextualMenu.hideMenu()
    this.contextualMenu.showMenu(event)
  }

  mouseSelection ({ ctrlKey, target }) {
    const isRange = target.className.includes('range')

    this.contextualMenu.hideMenu()

    if (ctrlKey && isRange) {
      this.deselectJob(target)
    } else if (isRange) {
      this.selectJob(target)
    } else {
      this.deselectAllJobs()
    }
  }

  getIndex (job) {
    return job.match(/job-\d+/)[0].slice(4)
  }

  selectJob (job) {
    this.selectedJobs.add(this.getIndex(job.className))

    job.classList.add('selected')

    this.selectedJobsDom.add(job)
  }

  deselectJob (job) {
    this.selectedJobs.delete(this.getIndex(job.className))

    job.classList.remove('selected')

    this.selectedJobsDom.delete(job)
  }

  deselectAllJobs () {
    this.selectedJobs.clear()

    for (const job of this.selectedJobsDom) {
      job.classList.remove('selected')
    }

    this.selectedJobsDom.clear()
  }

  showJobRanges () {
    console.log('showJobRangesListener')

    this.selectedJobs.forEach(jobId => {
      this.stylesheetManager.changeStyleForJob(jobId)
    })

    this.contextualMenu.hideMenu()
  }

  showJobSpawns (model) {
    console.log('showJobSpawnsListener')

    this.selectedJobs.forEach(jobId => {
      model.spawnedJobs.get(parseInt(jobId, 10)).forEach(spawnedJobs => {
        spawnedJobs.jobs.forEach(job => {
          this.stylesheetManager.changeStyleForJob(job)
        })
      })
    })

    this.contextualMenu.hideMenu()
  }

  showAtomicCounter (model) {

  }

  hideDependences () {
    console.log('showJobSpawnsListener')

    this.selectedJobs.forEach(jobId => {
      this.stylesheetManager.removeStyleOfJob(jobId)
    })

    this.contextualMenu.hideMenu()
  }
}

export { MouseActionController }

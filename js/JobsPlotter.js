import { JobsSelector } from './JobsSelector.js'

class JobsPlotter {
  constructor () {
    this.drawRange = {
      start: 0,
      end: 1
    }

    this.visibleRanges = null
    this.context = null
    this.selector = new JobsSelector()
    this.domComposer = null
  }

  setContext (context) {
    this.context = context
  }

  setDOMComposer (domComposer) {
    this.domComposer = domComposer

    this.visibleRanges = new Array(this.domComposer.jobsDOMModel.length).fill(true)

    const visibleDOMRanges = new Map()

    for (let i = 0; i < this.visibleRanges.length; i++) {
      if (this.visibleRanges[i]) {
        visibleDOMRanges.set(i, this.domComposer.jobsDOMModel[i])
      }
    }

    const plotterWidth = this.context.domRoot.offsetWidth
    const min = this.domComposer.jobModel.meta.startTime
    const max = this.domComposer.jobModel.meta.endTime

    for (const [key, value] of visibleDOMRanges.entries()) {
      const { job, rangeCounter } = this.domComposer.jobModel.jobRanges[key]
      const { beginTimestamp, endTimestamp } = this.domComposer.jobModel.jobRecords.get(job).ranges[rangeCounter]

      value.style.left = (beginTimestamp / (max - min)) * plotterWidth - min / (max - min) * plotterWidth + 'px'
      value.style.width = ((endTimestamp / (max - min)) * plotterWidth) - ((beginTimestamp / (max - min)) * plotterWidth) + 'px'
    }

    for (const model of visibleDOMRanges.values()) {
      this.context.domRoot.append(model)
    }
  }

  moveRangeTo ({ start, end }) {}
}

const jobsPlotter = new JobsPlotter()

export { jobsPlotter }

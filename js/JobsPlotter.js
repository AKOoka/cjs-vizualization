import { JobsPlotterRenderer } from './JobsPlotterRenderer.js'

class JobsPlotter {
  constructor () {
    this.context = null
    this.model = null
    this.jobsPlotterRenderer = new JobsPlotterRenderer()
  }

  setContext (context) {
    this.context = context

    this.jobsPlotterRenderer.setDOMRoot(context.domRoot)
  }

  setModel (model) {
    this.model = model

    this.jobsPlotterRenderer.setModel(model)
  }

  setDOMComposer (domComposer) {
    this.domComposer = domComposer

    this.visibleRanges = []

    this.domComposer.jobsDOMModel.forEach((value, index) => { this.visibleRanges.push(index) })

    const visibleDOMRanges = new Map()

    this.visibleRanges.forEach(index => {
      visibleDOMRanges.set(index, this.domComposer.jobsDOMModel[index])
    })

    const plotterWidth = this.context.domRoot.offsetWidth
    const min = this.domComposer.jobModel.meta.startTime
    const max = this.domComposer.jobModel.meta.endTime

    for (const [key, value] of visibleDOMRanges.entries()) {
      const { job, rangeCounter } = this.domComposer.jobModel.jobRanges[key]
      const { beginTimestamp, endTimestamp } = this.domComposer.jobModel.jobRecords.get(job).ranges[rangeCounter]

      const divWidth = (endTimestamp - beginTimestamp) / (max - min) * plotterWidth

      value.style.left = (beginTimestamp - min) / (max - min) * plotterWidth + 'px'
      value.style.width = Math.max(1, divWidth) + 'px'
    }

    for (const model of visibleDOMRanges.values()) {
      this.context.domRoot.append(model)
    }

    this.rangesAS = []

    for (let i = 0; i < this.domComposer.jobModel.jobRanges.length; i++) {
      const { job, rangeCounter } = this.domComposer.jobModel.jobRanges[i]
      const { beginTimestamp, endTimestamp } = this.domComposer.jobModel.jobRecords.get(job).ranges[rangeCounter]

      this.rangesAS.push({ index: i, time: beginTimestamp })
      this.rangesAS.push({ index: i, time: endTimestamp })
    }
  }
}

const jobsPlotter = new JobsPlotter()

export { jobsPlotter }

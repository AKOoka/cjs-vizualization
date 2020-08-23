import { JobsPlotter } from './JobsPlotter.js'
import { JobsDomComposer } from './JobsDomComposer.js'
import { MouseDomActionController } from './MouseDomActionController.js'

class JobsDomPlotter extends JobsPlotter {
  constructor () {
    super()

    this.plotterContainer = null
    this.processorsContainer = new Map()
    this.jobsComposer = new JobsDomComposer()
    this.mouseActionController = new MouseDomActionController()
    this.visibleRanges = []
    this.rangesAS = []
  }

  setContext (context) {
    super.setContext(context)

    this.plotterContainer = this.createPlotterContainer()

    this.context.jobsPlotter.append(this.plotterContainer)
  }

  setModel (model) {
    super.setModel(model)

    this.mouseActionController.setContext(this.context, this.processorsContainer)
    this.mouseActionController.setModel(model)
  }

  createPlotterContainer () {
    const plotterContainer = document.createElement('div')

    plotterContainer.id = 'jobs-plotter-container'

    return plotterContainer
  }

  createProcessor () {
    const processor = document.createElement('div')

    processor.classList.add('processor')

    return processor
  }

  appendRange (range, processorId) {
    const processor = this.processorsContainer.get(processorId)

    if (processor) {
      processor.append(range)
    } else {
      const newProcessor = this.createProcessor()

      newProcessor.append(range)

      this.processorsContainer.set(processorId, newProcessor)
    }
  }

  createJobsRanges () {
    if (this.plotterContainer.children.length > 0) {
      this.changeContainer('plotterContainer', this.createPlotterContainer())
    }
    if (this.processorLabelsContainer.children.length > 0) {
      this.changeContainer('processorLabelsContainer', this.createProcessorLabelsContainer())
    }

    this.processorsContainer = new Map()

    this.visibleRanges = []
    this.rangesAS = []

    this.jobsComposer.jobsModel.forEach(({ range, processorId }, index) => {
      const { job, rangeCounter } = this.model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

      this.rangesAS.push({ processorId, index, time: beginTimestamp })
      this.rangesAS.push({ processorId, index, time: endTimestamp })

      this.appendRange(range, processorId)
      this.visibleRanges.push({ index, processorId })
    })

    const sortedProcessorsContainer = [...this.processorsContainer.entries()].sort(([key1], [key2]) => key1 - key2)

    for (const [processorId, processor] of sortedProcessorsContainer) {
      const processorLabel = this.createProcessorLabel(processorId)

      this.plotterContainer.append(processor)
      this.processorLabelsContainer.append(processorLabel)
    }
  }

  watchRangeChanges (startPos, endPos) {
    const newVisible = []
    const nonVisibleRanges = new Map()
    const newVisibleRanges = new Map()

    for (const { processorId, index, time } of this.rangesAS) {
      if (time >= startPos && time <= endPos) {
        newVisible.push({ processorId, index })

        if (!this.visibleRanges.some(range => range.index === index) && !newVisibleRanges.has(index)) {
          newVisibleRanges.set(index, processorId)
        }
      }
    }

    for (const { index, processorId } of this.visibleRanges) {
      if (!newVisible.some(range => range.index === index) && !nonVisibleRanges.has(index)) {
        nonVisibleRanges.set(index, processorId)
      }
    }

    for (const [index, processorId] of nonVisibleRanges.entries()) {
      this.processorsContainer.get(processorId).removeChild(this.jobsComposer.jobsModel[index].range)
    }

    for (const [index, processorId] of newVisibleRanges.entries()) {
      this.appendRange(this.jobsComposer.jobsModel[index].range, processorId)
    }

    this.visibleRanges = newVisible
  }

  adjustRanges (scaleWidthFactor, translateFactor, translateStart) {
    this.visibleRanges.forEach(({ index }) => {
      const { range } = this.jobsComposer.jobsModel[index]
      const { job, rangeCounter } = this.model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

      const width = (endTimestamp - beginTimestamp) * scaleWidthFactor
      const pos = (beginTimestamp - translateStart) * scaleWidthFactor - translateFactor

      range.style.left = pos + 'px'
      range.style.width = Math.max(1, width) + 'px'

      if (width <= 40) {
        range.classList.add('hiddeText')
      } else {
        range.classList.remove('hiddeText')
      }
    })
  }
}

export { JobsDomPlotter }

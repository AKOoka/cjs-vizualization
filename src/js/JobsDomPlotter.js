import { JobsPlotter } from './JobsPlotter.js'
import { JobsDomBuilder } from './JobsDomBuilder.js'
import { MouseDomActionController } from './MouseDomActionController.js'

class JobsDomPlotter extends JobsPlotter {
  constructor () {
    super()

    this._plotterContainer = null
    this._jobsBuilder = new JobsDomBuilder()
    this._mouseActionController = new MouseDomActionController()
    this._visibleRanges = []
    this._rangesAs = []
  }

  _createPlotterContainer () {
    const plotterContainer = document.createElement('div')

    plotterContainer.id = 'jobs-plotter-container'

    return plotterContainer
  }

  _createJobsRanges () {
    if (this._plotterContainer.children.length > 0) {
      this._changeContainer('_plotterContainer', this._createPlotterContainer())
    }
    if (this._processorLabelsContainer.children.length > 0) {
      this._changeContainer('_processorLabelsContainer', this._createProcessorLabelsContainer())
    }

    this._visibleRanges = []
    this._rangesAs = []

    this._jobsBuilder.jobsModel.forEach(({ processorId }, index) => {
      const { job, rangeCounter } = this._model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this._model.jobRecords.get(job).ranges[rangeCounter]

      this._rangesAs.push({ processorId, index, time: beginTimestamp })
      this._rangesAs.push({ processorId, index, time: endTimestamp })

      this._visibleRanges.push({ index, processorId })
    })

    const sortedProcessorsContainer = [...this._jobsBuilder.processors.entries()].sort(([key1], [key2]) => key1 - key2)

    for (const [processorId, processor] of sortedProcessorsContainer) {
      this._plotterContainer.append(processor)
      this._processorLabelsContainer.append(this._createProcessorLabel(processorId))
    }
  }

  _watchRangeChanges (startPos, endPos) {
    const newVisible = []
    const nonVisibleRanges = new Map()
    const newVisibleRanges = new Map()

    for (const { processorId, index, time } of this._rangesAs) {
      if (time >= startPos && time <= endPos) {
        newVisible.push({ processorId, index })

        if (!this._visibleRanges.some(range => range.index === index) && !newVisibleRanges.has(index)) {
          newVisibleRanges.set(index, processorId)
        }
      }
    }

    for (const { index, processorId } of this._visibleRanges) {
      if (!newVisible.some(range => range.index === index) && !nonVisibleRanges.has(index)) {
        nonVisibleRanges.set(index, processorId)
      }
    }

    for (const [index, processorId] of nonVisibleRanges.entries()) {
      this._jobsBuilder.processors.get(processorId).removeChild(this._jobsBuilder.jobsModel[index].range)
    }

    for (const [index, processorId] of newVisibleRanges.entries()) {
      this._jobsBuilder.processors.get(processorId).append(this._jobsBuilder.jobsModel[index].range)
    }

    this._visibleRanges = newVisible
  }

  _adjustRanges (scaleWidthFactor, translateFactor, translateStart) {
    this._visibleRanges.forEach(({ index }) => {
      const { range } = this._jobsBuilder.jobsModel[index]
      const { job, rangeCounter } = this._model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this._model.jobRecords.get(job).ranges[rangeCounter]

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

  setContext (context) {
    super.setContext(context)

    this._plotterContainer = this._createPlotterContainer()

    this._context.jobsPlotter.append(this._plotterContainer)
  }

  setModel (model) {
    super.setModel(model)

    this._mouseActionController.setContext(this._context, this._jobsBuilder.processors)
    this._mouseActionController.setModel(model)
  }

  updateRange () {
    if (!this._model) {
      return
    }

    const startTime = this._model.meta.startTime.getTime()
    const timeSpan = this._model.meta.timeSpan.getTime()
    const startPos = this._viewRange.start * timeSpan + startTime
    const endPos = this._viewRange.end * timeSpan + startTime

    const contextWidth = this._context.jobsPlotter.offsetWidth
    const scaleFactor = 1 / this._viewRange.width
    const scaleWidthFactor = 1 / (timeSpan) * scaleFactor * contextWidth
    const translateFactor = this._viewRange.start * scaleFactor * contextWidth

    this._watchRangeChanges(startPos, endPos)
    this._adjustRanges(scaleWidthFactor, translateFactor, startTime)
  }
}

export { JobsDomPlotter }

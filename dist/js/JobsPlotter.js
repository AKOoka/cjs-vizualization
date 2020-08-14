import { JobsDomComposer } from './JobsDomComposer.js'
import { MouseActionController } from './MouseActionController.js'

class JobsPlotter {
  constructor () {
    this.context = null
    this.model = null
    this.plotterContainer = null
    this.processorsContainer = null
    this.processorLabelsContainer = null
    this.jobsDomComposer = new JobsDomComposer()
    this.mouseActionController = new MouseActionController()
    this.viewRange = null
    this.visibleRanges = null
    this.rangesAS = null
  }

  setContext (context) {
    this.context = context

    this.plotterContainer = this.createPlotterContainer()
    this.processorLabelsContainer = this.createProcessorLabelsContainer()

    this.context.jobsPlotter.append(this.plotterContainer)
    this.context.processorLabels.append(this.processorLabelsContainer)

    this.context.jobsPlotter.onwheel = this.zoomEventListener.bind(this)
  }

  setModel (model) {
    this.model = model

    this.jobsDomComposer.createDomModel(model)

    this.createRanges()
    this.updateRange()

    this.mouseActionController.setContext(this.context, this.processorsContainer)
    this.mouseActionController.setModel(model)
  }

  setViewRange (viewRange) {
    this.viewRange = viewRange
  }

  zoomRange (relMouseX, zoomDirection) {
    const pivot = relMouseX / this.context.jobsPlotter.offsetWidth
    const zoomVelocity = 0.1 * this.viewRange.width

    const startPos = Math.max(0, this.viewRange.start + zoomDirection * zoomVelocity * pivot * -1)
    const endPos = Math.min(1, this.viewRange.end + zoomDirection * zoomVelocity * (1 - pivot))

    return { startPos, endPos }
  }

  zoomEventListener (event) {
    event.preventDefault()

    let newRange = null

    if (event.deltaY < 0) {
      newRange = this.zoomRange(event.clientX - this.context.jobsPlotter.offsetLeft, -1)
    } else if (event.deltaY > 0) {
      newRange = this.zoomRange(event.clientX - this.context.jobsPlotter.offsetLeft, 1)
    }

    this.viewRange.setRange(newRange.startPos, newRange.endPos)
  }

  createPlotterContainer () {
    // private
    const plotterContainer = document.createElement('div')

    plotterContainer.id = 'jobs-plotter-container'

    return plotterContainer
  }

  createProcessor () {
    // private
    const processor = document.createElement('div')

    processor.classList.add('processor')

    return processor
  }

  createProcessorLabel (processorId) {
    // private
    const processorLabel = document.createElement('div')

    processorLabel.classList.add('processor-label')
    processorLabel.append(`core #${processorId}`)

    return processorLabel
  }

  createProcessorLabelsContainer () {
    // private
    const processorLabelsContainer = document.createElement('div')

    processorLabelsContainer.classList.add('processor-labels-container')

    return processorLabelsContainer
  }

  changeContainer (key, container) {
    this[key].replaceWith(container)
    this[key] = container
  }

  appendRange (range, processorId) {
    // private
    const processor = this.processorsContainer.get(processorId)

    if (processor) {
      processor.append(range)
    } else {
      const newProcessor = this.createProcessor()

      newProcessor.append(range)

      this.processorsContainer.set(processorId, newProcessor)
    }
  }

  createRanges () {
    // private
    if (this.plotterContainer.children.length > 0) {
      this.changeContainer('plotterContainer', this.createPlotterContainer())
    }
    if (this.processorLabelsContainer.children.length > 0) {
      this.changeContainer('processorLabelsContainer', this.createProcessorLabelsContainer())
    }

    this.processorsContainer = new Map()

    this.visibleRanges = []
    this.rangesAS = []

    this.jobsDomComposer.jobsDomModel.forEach(({ range, processorId }, index) => {
      const { job, rangeCounter } = this.model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

      this.rangesAS.push({ processorId, index, time: beginTimestamp })
      this.rangesAS.push({ processorId, index, time: endTimestamp })

      this.appendRange(range, processorId)
      this.visibleRanges.push({ index, processorId })
    })

    const sortedProcessorsContainer = [...this.processorsContainer.entries()].sort(([k1], [k2]) => k1 - k2)

    for (const [processorId, processor] of sortedProcessorsContainer) {
      const processorLabel = this.createProcessorLabel(processorId)

      this.plotterContainer.append(processor)
      this.processorLabelsContainer.append(processorLabel)
    }
  }

  watchRangeChanges (startPos, endPos) {
    // private
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
      this.processorsContainer.get(processorId).removeChild(this.jobsDomComposer.jobsDomModel[index].range)
    }

    for (const [index, processorId] of newVisibleRanges.entries()) {
      this.appendRange(this.jobsDomComposer.jobsDomModel[index].range, processorId)
    }

    this.visibleRanges = newVisible
  }

  adjustRanges (scaleWidthFactor, translateFactor, traslateStart) {
    // private
    this.visibleRanges.forEach(({ index }) => {
      const { range } = this.jobsDomComposer.jobsDomModel[index]
      const { job, rangeCounter } = this.model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

      const width = (endTimestamp - beginTimestamp) * scaleWidthFactor
      const pos = (beginTimestamp - traslateStart) * scaleWidthFactor - translateFactor

      range.style.left = pos + 'px'
      range.style.width = Math.max(1, width) + 'px'

      if (width <= 40) {
        range.classList.add('hiddeText')
      } else {
        range.classList.remove('hiddeText')
      }
    })
  }

  updateRange () {
    if (!this.model) {
      return
    }

    const { startTime, timeSpan } = this.model.meta
    const startPos = this.viewRange.start * timeSpan + startTime
    const endPos = this.viewRange.end * timeSpan + startTime

    this.watchRangeChanges(startPos, endPos)

    const containerWidth = this.plotterContainer.offsetWidth
    const scaleFactor = 1 / this.viewRange.width
    const scaleWidthFactor = 1 / (timeSpan) * scaleFactor * containerWidth
    const translateFactor = this.viewRange.start * scaleFactor * containerWidth

    this.adjustRanges(scaleWidthFactor, translateFactor, startTime)
  }
}

export { JobsPlotter }

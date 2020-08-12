import { JobsDOMComposer } from './JobsDOMComposer.js'

class JobsPlotter {
  constructor () {
    this.context = null
    this.model = null
    this.plotterContainer = null
    this.domContainerProcessors = null
    this.jobsDomComposer = new JobsDOMComposer()
    this.viewRange = null
    this.visibleRanges = null
    this.rangesAS = null
  }

  setContext (context) {
    this.context = context

    this.plotterContainer = this.createDomContainer()
    this.context.jobsPlotter.append(this.plotterContainer)
  }

  setModel (model) {
    this.model = model

    this.jobsDomComposer.createDomModel(model)

    this.createDomRange()
  }

  setViewRange (viewRange) {
    this.viewRange = viewRange
  }

  createDomContainer () {
    // private
    const domContainer = document.createElement('div')

    domContainer.id = 'jobs-plotter-container'

    return domContainer
  }

  createDomProcessor () {
    // private
    const domProcessor = document.createElement('div')

    domProcessor.classList.add('processor')

    return domProcessor
  }

  createDomProcessorLabel (processorId) {
    // private
    const domProcessorLabel = document.createElement('div')

    domProcessorLabel.classList.add('processor-label')
    domProcessorLabel.append(`core-#${processorId}`)

    return domProcessorLabel
  }

  appendRangeDom (rangeDom, processorId) {
    // private
    const processor = this.domContainerProcessors.get(processorId)

    if (processor) {
      processor.append(rangeDom)
    } else {
      const processor = this.createDomProcessor()
      const processorLabel = this.createDomProcessorLabel(processorId)

      this.domContainerProcessors.set(processorId, processor)

      processor.append(rangeDom)

      this.plotterContainer.append(processor)
      this.context.processorLabelsContainer.append(processorLabel)
    }
  }

  createDomRange () {
    // private
    if (this.plotterContainer.children.length > 0) {
      const plotterContainer = this.createDomContainer()

      this.plotterContainer.replaceWith(plotterContainer)
      this.plotterContainer = plotterContainer
    }

    this.domContainerProcessors = new Map()

    this.visibleRanges = []
    this.rangesAS = []

    this.jobsDomComposer.jobsDomModel.forEach(({ rangeDom, processorId }, index) => {
      const { job, rangeCounter } = this.model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

      this.rangesAS.push({ processorId, index, time: beginTimestamp })
      this.rangesAS.push({ processorId, index, time: endTimestamp })

      this.appendRangeDom(rangeDom, processorId)
      this.visibleRanges.push({ index, processorId })
    })
  }

  watchDomChanges (startPos, endPos) {
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
      this.domContainerProcessors.get(processorId).removeChild(this.jobsDomComposer.jobsDomModel[index].rangeDom)
    }

    for (const [index, processorId] of newVisibleRanges.entries()) {
      this.appendRangeDom(this.jobsDomComposer.jobsDomModel[index].rangeDom, processorId)
    }

    this.visibleRanges = newVisible
  }

  adjustDomRanges (scaleWidthFactor, translateFactor, traslateStart) {
    // private
    this.visibleRanges.forEach(({ index }) => {
      const { rangeDom } = this.jobsDomComposer.jobsDomModel[index]
      const { job, rangeCounter } = this.model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

      const domWidth = (endTimestamp - beginTimestamp) * scaleWidthFactor
      const pos = (beginTimestamp - traslateStart) * scaleWidthFactor - translateFactor

      rangeDom.style.left = pos + 'px'
      rangeDom.style.width = Math.max(1, domWidth) + 'px'

      if (domWidth <= 40) {
        rangeDom.classList.add('hiddeText')
      } else {
        rangeDom.classList.remove('hiddeText')
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

    this.watchDomChanges(startPos, endPos)

    const containerWidth = this.plotterContainer.offsetWidth
    const scaleFactor = 1 / this.viewRange.width
    const scaleWidthFactor = 1 / (timeSpan) * scaleFactor * containerWidth
    const translateFactor = this.viewRange.start * scaleFactor * containerWidth

    this.adjustDomRanges(scaleWidthFactor, translateFactor, startTime)
  }
}

export { JobsPlotter }

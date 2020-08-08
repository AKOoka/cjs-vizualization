import { MouseActionControlls } from './MouseActionControlls.js'
import { JobsDOMComposer } from './JobsDOMComposer.js'

class JobsPlotter {
  constructor () {
    this.context = null
    this.model = null
    this.domContainer = null
    this.domContainerProcessors = null
    this.jobsDomComposer = new JobsDOMComposer()
    this.MouseActionControlls = new MouseActionControlls()
    this.viewRange = null
    this.visibleRanges = null
    this.rangesAS = null
  }

  setContext (context) {
    this.context = context

    this.domContainer = this.createDOMContainer()

    this.context.domRoot.append(this.domContainer)

    this.MouseActionControlls.setContext(this.context.domRoot) // change this.context.domRoot to this.domContainer
  }

  setModel (model) {
    this.model = model

    this.jobsDomComposer.createDOMModel(model)
    this.MouseActionControlls.setModel(model)
    this.createDOMRange()
  }

  setViewRange (viewRange) {
    this.viewRange = viewRange
  }

  createDOMContainer () {
    const domContainer = document.createElement('section')

    domContainer.classList.add('jobs-plotter-container')

    return domContainer
  }

  createDOMProcessor () {
    const domProcessor = document.createElement('section')

    domProcessor.classList.add('processor')

    return domProcessor
  }

  appendRangeDOM (domContainerProcessors, domContainer, rangeDom, processorId) {
    const processor = domContainerProcessors.get(processorId)

    if (processor) {
      processor.append(rangeDom)
    } else {
      const processor = this.createDOMProcessor()

      domContainerProcessors.set(processorId, processor)

      processor.append(rangeDom)

      domContainer.append(processor)
    }
  }

  createDOMRange () {
    this.domContainerProcessors = new Map()

    this.domContainer.remove()
    this.domContainer = this.createDOMContainer()

    this.context.domRoot.append(this.domContainer)

    this.visibleRanges = []
    this.rangesAS = []

    this.jobsDomComposer.jobsDOMModel.forEach(({ rangeDom, processorId }, index) => {
      const { job, rangeCounter } = this.model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

      this.rangesAS.push({ processorId, index, time: beginTimestamp })
      this.rangesAS.push({ processorId, index, time: endTimestamp })

      this.appendRangeDOM(this.domContainerProcessors, this.domContainer, rangeDom, processorId)
      this.visibleRanges.push({ index, processorId })
    })
  }

  watchDomChanges (startPos, endPos) {
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
      this.domContainerProcessors.get(processorId).removeChild(this.jobsDomComposer.jobsDOMModel[index].rangeDom)
    }

    for (const [index, processorId] of newVisibleRanges.entries()) {
      this.appendRangeDOM(this.domContainerProcessors, this.domContainer, this.jobsDomComposer.jobsDOMModel[index].rangeDom, processorId)
    }

    this.visibleRanges = newVisible
  }

  adjustDomRanges (visibleRanges, jobsDomComposer, model, scaleWidthFactor, translateFactor, traslateStart) {
    visibleRanges.forEach(({ index }) => {
      const { rangeDom } = jobsDomComposer.jobsDOMModel[index]
      const { job, rangeCounter } = model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = model.jobRecords.get(job).ranges[rangeCounter]

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

    const min = this.model.meta.startTime
    const max = this.model.meta.endTime
    const width = max - min

    const startPos = this.viewRange.start * width + min
    const endPos = this.viewRange.end * width + min

    this.watchDomChanges(startPos, endPos)

    const scaleFactor = 1 / (this.viewRange.end - this.viewRange.start)
    const scaleWidthFactor = 1 / (width) * scaleFactor * this.domContainer.offsetWidth
    const translateFactor = this.viewRange.start * scaleFactor * this.domContainer.offsetWidth

    this.adjustDomRanges(this.visibleRanges, this.jobsDomComposer, this.model, scaleWidthFactor, translateFactor, min)
  }
}

const jobsPlotter = new JobsPlotter()

export { jobsPlotter }

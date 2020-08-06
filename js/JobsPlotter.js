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

    console.log(this.jobsDomComposer)
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

  appendRangeDOM (domContainerProcessors, rangeDOM, processorId) {
    const processor = domContainerProcessors.get(processorId)

    if (processor) {
      processor.append(rangeDOM)
    } else {
      const processor = this.createDOMProcessor()

      processor.append(rangeDOM)

      domContainerProcessors.set(processorId, processor)
    }
  }

  createDOMRange () {
    this.domContainerProcessors = new Map()

    this.domContainer.remove()
    this.domContainer = this.createDOMContainer()

    this.context.domRoot.append(this.domContainer)

    this.visibleRanges = []

    this.jobsDomComposer.jobsDOMModel.forEach(({ rangeDOM, processorId }, index) => {
      // this.domContainer.append(rangeDOM)
      this.appendRangeDOM(this.domContainerProcessors, rangeDOM, processorId)
      this.visibleRanges.push({ index, processorId })
    })

    this.domContainerProcessors.forEach(processor => {
      this.domContainer.append(processor)
    })

    this.rangesAS = []

    for (let i = 0; i < this.model.jobRanges.length; i++) {
      const { job, rangeCounter } = this.model.jobRanges[i]
      const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

      this.rangesAS.push({ index: i, time: beginTimestamp })
      this.rangesAS.push({ index: i, time: endTimestamp })
    }
  }

  watchDomChanges (visibleRanges, rangesAS, jobsDomComposer, domContainerProcessors, startViewRange, endViewRange) {
    const newRanges = []
    const nonVisibleRanges = new Set()
    const newVisibleRanges = new Set()

    for (const { time, index } of rangesAS) {
      if (time >= startViewRange && time <= endViewRange) {
        newRanges.push(visibleRanges[index])

        if (!visibleRanges.some(range => range.index === index)) {
          newVisibleRanges.add(visibleRanges[index])
        }
      }
    }

    visibleRanges.forEach(range => {
      if (!newRanges.some(({ index }) => index === range.index)) {
        nonVisibleRanges.add(range)
      }
    })

    nonVisibleRanges.forEach(({ index, processorId }) => {
      // this.domContainer.removeChild(this.jobsDomComposer.jobsDOMModel[range])
      domContainerProcessors.get(processorId).removeChild(jobsDomComposer.jobsDOMModel[index].rangeDOM)
    })

    newVisibleRanges.forEach(({ index, processorId }) => {
      // this.domContainer.append(this.jobsDomComposer.jobsDOMModel[range])
      this.appendRangeDOM(domContainerProcessors, jobsDomComposer.jobsDOMModel[index].rangeDOM, processorId)
    })

    visibleRanges = newRanges
  }

  adjustDomRanges (visibleRanges, jobsDomComposer, model, scaleWidthFactor, translateFactor, traslateStart) {
    visibleRanges.forEach(({ index }) => {
      const { rangeDOM } = jobsDomComposer.jobsDOMModel[index]
      const { job, rangeCounter } = model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = model.jobRecords.get(job).ranges[rangeCounter]

      const domWidth = (endTimestamp - beginTimestamp) * scaleWidthFactor
      const pos = (beginTimestamp - traslateStart) * scaleWidthFactor - translateFactor

      rangeDOM.style.left = pos + 'px'
      rangeDOM.style.width = Math.max(1, domWidth) + 'px'

      if (domWidth <= 40) {
        rangeDOM.classList.add('hiddeText')
      } else {
        rangeDOM.classList.remove('hiddeText')
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

    this.watchDomChanges(this.visibleRanges, this.rangesAS, this.jobsDomComposer, this.domContainerProcessors, startPos, endPos)

    const scaleFactor = 1 / (this.viewRange.end - this.viewRange.start)
    const scaleWidthFactor = 1 / (width) * scaleFactor * this.domContainer.offsetWidth
    const translateFactor = this.viewRange.start * scaleFactor * this.domContainer.offsetWidth

    this.adjustDomRanges(this.visibleRanges, this.jobsDomComposer, this.model, scaleWidthFactor, translateFactor, min)
  }
}

const jobsPlotter = new JobsPlotter()

export { jobsPlotter }

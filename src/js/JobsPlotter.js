import { MouseArea } from './MouseArea.js'
import { app } from './App.js'

class JobsPlotter {
  constructor () {
    this.context = null
    this.model = null
    this.jobsComposer = null
    this.mouseActionController = null
    this.processorLabelsContainer = null
    this.viewRange = null
  }

  setContext (context) {
    this.context = context

    this.processorLabelsContainer = this.createProcessorLabelsContainer()

    this.context.processorLabels.append(this.processorLabelsContainer)

    const plotterMouseArea = new MouseArea(this.context.jobsPlotter)

    plotterMouseArea.setWheel(mouseState => {
      const { startPos, endPos } = this.zoomRange(
        mouseState.getX() - this.context.jobsPlotter.offsetLeft,
        mouseState.getMouseWheelValue()
      )
      this.viewRange.setRange(startPos, endPos)
    })

    app.getMouseEventManager().subscribe(plotterMouseArea)
  }

  setModel (model) {
    this.model = model

    this.jobsComposer.createModel(model)

    this.createJobsRanges()
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

  createProcessorLabel (processorId) {
    const processorLabel = document.createElement('div')

    processorLabel.classList.add('processor-label')
    processorLabel.append(`core #${processorId}`)

    return processorLabel
  }

  createProcessorLabelsContainer () {
    const processorLabelsContainer = document.createElement('div')

    processorLabelsContainer.classList.add('processor-labels-container')

    return processorLabelsContainer
  }

  changeContainer (key, container) {
    this[key].replaceWith(container)
    this[key] = container
  }

  createJobsRanges () {}

  watchRangeChanges (startPos, endPos) {}

  adjustRanges (scaleWidthFactor, translateFactor, traslateStart) {}

  updateRange () {
    if (!this.model) {
      return
    }

    const startTime = this.model.meta.startTime.getTime()
    const timeSpan = this.model.meta.timeSpan.getTime()
    const startPos = this.viewRange.start * timeSpan + startTime
    const endPos = this.viewRange.end * timeSpan + startTime

    const contextWidth = this.context.jobsPlotter.offsetWidth
    const scaleFactor = 1 / this.viewRange.width
    const scaleWidthFactor = 1 / (timeSpan) * scaleFactor * contextWidth
    const translateFactor = this.viewRange.start * scaleFactor * contextWidth

    this.watchRangeChanges(startPos, endPos)
    this.adjustRanges(scaleWidthFactor, translateFactor, startTime)
  }
}

export { JobsPlotter }

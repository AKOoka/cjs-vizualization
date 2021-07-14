export class JobsPlotter {
  constructor () {
    this._context = null
    this._model = null
    this._mouseActionController = null
    this._processorLabelsContainer = null
    this._viewRange = null
  }

  private _zoomRange (relMouseX: number, zoomDirection: number) {
    const pivot = relMouseX / this._context.jobsPlotter.offsetWidth
    const zoomVelocity = 0.1 * this._viewRange.width

    const startPos = Math.max(0, this._viewRange.start + zoomDirection * zoomVelocity * pivot * -1)
    const endPos = Math.min(1, this._viewRange.end + zoomDirection * zoomVelocity * (1 - pivot))

    return { startPos, endPos }
  }

  private _createProcessorLabel (processorId: number): HTMLDivElement {
    const processorLabel = document.createElement('div')

    processorLabel.classList.add('processor-label')
    processorLabel.append(`core #${processorId}`)

    return processorLabel
  }

  private _createProcessorLabelsContainer (): HTMLDivElement {
    const processorLabelsContainer = document.createElement('div')

    processorLabelsContainer.classList.add('processor-labels-container')

    return processorLabelsContainer
  }

  private _replaceContainer (key, container): void {
    this[key].replaceWith(container)
    this[key] = container
  }

  // private _createJobsRanges () {}

  setContext (context) {
    this._context = context

    this._processorLabelsContainer = this._createProcessorLabelsContainer()

    this._context.processorLabels.append(this._processorLabelsContainer)

    const plotterMouseArea = new MouseArea(this._context.jobsPlotter)

    plotterMouseArea.setWheel(mouseState => {
      const { startPos, endPos } = this._zoomRange(
        mouseState.x - this._context.jobsPlotter.offsetLeft,
        mouseState.getMouseWheelValue()
      )
      this._viewRange.setRange(startPos, endPos)
    })

    app.getMouseEventManager().subscribe(plotterMouseArea)
  }

  setModel (model) {
    this._model = model

    this._jobsBuilder.createModel(model)

    this._createJobsRanges()
  }

  setViewRange (viewRange) {
    this._viewRange = viewRange
  }

  // updateRange () {}
}
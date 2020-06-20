class MouseWheelController {
  constructor (viewRange) {
    this.context = null
    this.viewRange = viewRange
  }

  zoom (pivot, zoomDirection) {
    console.log('Out')
    const { domRoot } = this.context

    const point = pivot / domRoot.offsetWidth
    const rangeWidth = this.viewRange.end - this.viewRange.start
    const invRangeWidth = 1 / rangeWidth

    const dx1 = point - this.viewRange.start
    const dx2 = this.viewRange.end - point
    const dx1Ratio = dx1 * invRangeWidth
    const dx2Raito = dx2 * invRangeWidth

    const zoomVelocity = 0.1 * rangeWidth

    const startPos = Math.max(0, this.viewRange.start + zoomDirection * zoomVelocity * dx1Ratio * -1)
    const endPos = Math.min(1, this.viewRange.end + zoomDirection * zoomVelocity * dx2Raito)

    console.log(startPos, endPos)

    return { startPos, endPos }
  }

  setContext (context) {
    this.context = context

    const { domRoot } = this.context

    domRoot.onwheel = event => {
      event.preventDefault()

      let newRange = null

      if (event.deltaY < 0) {
        newRange = this.zoom(event.clientX - domRoot.offsetLeft, -1)
      } else if (event.deltaY > 0) {
        newRange = this.zoom(event.clientX - domRoot.offsetLeft, 1)
      }

      console.log(`mouse = ${event.clientX - domRoot.offsetLeft}\nstart = ${newRange.startPos}\nend = ${newRange.endPos}`)

      this.viewRange.setRange(newRange.startPos, newRange.endPos, this)
    }
  }

  updateRange () {}
}

export { MouseWheelController }

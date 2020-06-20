class MouseWheelController {
  constructor (viewRange) {
    this.context = null
    this.viewRange = viewRange
  }

  zoom (relMouseX, zoomDirection) {
    console.log('Out')
    const { domRoot } = this.context

    const rangeWidth = this.viewRange.end - this.viewRange.start
    const pivot = relMouseX / domRoot.offsetWidth
    const zoomVelocity = 0.1 * rangeWidth

    const startPos = Math.max(0, this.viewRange.start + zoomDirection * zoomVelocity * pivot * -1)
    const endPos = Math.min(1, this.viewRange.end + zoomDirection * zoomVelocity * (1 - pivot))

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

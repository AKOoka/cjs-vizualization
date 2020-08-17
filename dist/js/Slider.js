import { DomElementWrapper } from './DomElementWrapper.js'
import { MouseArea } from './MouseArea.js'
import { app } from './App.js'

class Slider {
  constructor () {
    this.context = null
    this.viewRange = null

    this.leftAnchor = null
    this.centerAnchor = null
    this.rightAnchor = null

    this.lastTarget = 0
  }

  getX () {
    return this.context.slider.offsetLeft
  }

  getWidth () {
    return this.context.slider.offsetWidth
  }

  setContext (context) {
    this.context = context
    this.leftAnchor = new DomElementWrapper('anchor', 0, 4)
    this.rightAnchor = new DomElementWrapper('anchor', this.getWidth(), 4)
    this.centerAnchor = new DomElementWrapper('center-anchor', 0, this.getWidth())

    const leftAnchorMouseArea = new MouseArea(this.leftAnchor.getDomElement())

    leftAnchorMouseArea.setMouseMove(mouseState => {
      const target = mouseState.getX() - this.getX()
      const endPos = this.rightAnchor.getX()
      const startPos = Math.max(0, Math.min(target, endPos - this.leftAnchor.getWidth() / 2))

      this.viewRange.setRange(startPos / this.getWidth(), endPos / this.getWidth())
    })

    const rightAnchorMouseArea = new MouseArea(this.rightAnchor.getDomElement())

    rightAnchorMouseArea.setMouseMove(mouseState => {
      const target = mouseState.getX() - this.getX()
      const startPos = this.leftAnchor.getX()
      const endPos = Math.min(this.getWidth(), Math.max(target, startPos + this.leftAnchor.getWidth() / 2))

      this.viewRange.setRange(startPos / this.getWidth(), endPos / this.getWidth())
    })

    const centerAnchorMouseArea = new MouseArea(this.centerAnchor.getDomElement())

    centerAnchorMouseArea.setMouseDown(mouseState => {
      this.lastTarget = mouseState.getX() - this.getX()
    })
    centerAnchorMouseArea.setMouseMove(mouseState => {
      const target = mouseState.getX() - this.getX()

      let startPos = this.leftAnchor.getX()
      let endPos = this.rightAnchor.getX()
      let moveVelocity = target - this.lastTarget

      if (startPos + moveVelocity < 0) {
        moveVelocity = -startPos
      } else if (endPos + moveVelocity > this.getWidth()) {
        moveVelocity = this.getWidth() - endPos
      }

      startPos += moveVelocity
      endPos += moveVelocity

      this.lastTarget = target

      this.viewRange.setRange(startPos / this.getWidth(), endPos / this.getWidth())
    })

    app.getMouseEventManager().subscribe(leftAnchorMouseArea)
    app.getMouseEventManager().subscribe(rightAnchorMouseArea)
    app.getMouseEventManager().subscribe(centerAnchorMouseArea)

    this.context.slider.append(this.leftAnchor.getDomElement())
    this.context.slider.append(this.centerAnchor.getDomElement())
    this.context.slider.append(this.rightAnchor.getDomElement())
  }

  setViewRange (viewRange) {
    this.viewRange = viewRange
  }

  updateRange () {
    this.drawSlider(
      this.viewRange.start * this.getWidth(),
      this.viewRange.end * this.getWidth()
    )
  }

  drawSlider (startPos, endPos) {
    this.leftAnchor.setX(startPos)
    this.rightAnchor.setX(endPos)

    this.centerAnchor.setX(startPos)
    this.centerAnchor.setWidth(endPos - startPos)
  }
}

export { Slider }

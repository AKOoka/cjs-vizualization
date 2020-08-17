import { MouseArea } from './MouseArea.js'
import { app } from './App.js'

class Slider {
  constructor (anchorWidth = 4) {
    this.context = null
    this.viewRange = null

    this.anchorWidth = anchorWidth
    this.anchorHalfWidth = Math.round(anchorWidth / 2)

    this.startAnchor = null
    this.centerAnchor = null
    this.endAnchor = null

    this.lastTarget = 0
  }

  createSliderSideAnchorDom (anchorName, anchorPosition) {
    const sideAnchorDom = document.createElement('div')

    sideAnchorDom.id = `${anchorName}-slider`

    sideAnchorDom.classList.add('anchor')

    sideAnchorDom.style.width = `${this.anchorWidth}px`
    sideAnchorDom.style.left = `${anchorPosition}px`

    return sideAnchorDom
  }

  createSliderCenterAnchorDom (leftPosition, rightPosition) {
    const centerAnchorDom = document.createElement('div')

    centerAnchorDom.id = 'center-slider'

    centerAnchorDom.style.left = `${leftPosition}px`
    centerAnchorDom.style.right = `${rightPosition}px`

    return centerAnchorDom
  }

  setContext (context) {
    this.context = context

    this.startAnchor = this.createSliderSideAnchorDom('start', 0)
    this.endAnchor = this.createSliderSideAnchorDom('end', this.context.slider.offsetWidth)
    this.centerAnchor = this.createSliderCenterAnchorDom(0, 0)

    // test start
    this.startAnchorIsDragged = false
    this.endAnchorIsDragged = false
    this.centerAnchorIsDragged = false

    this.startAnchorMouseArea = new MouseArea(
      this.startAnchor,
      () => {
        this.startAnchorIsDragged = true
      },
      (mouseState) => {
        const target = mouseState.getX() - this.context.slider.offsetLeft
        this.moveRangeTo(target)
      },
      () => {
        this.startAnchorIsDragged = false
      }
    )
    this.endAnchorMouseArea = new MouseArea(
      this.endAnchor,
      () => {
        this.endAnchorIsDragged = true
      },
      (mouseState) => {
        const target = mouseState.getX() - this.context.slider.offsetLeft
        this.moveRangeTo(target)
      },
      () => {
        this.endAnchorIsDragged = false
      }
    )
    this.centerAnchorMouseArea = new MouseArea(
      this.centerAnchor,
      (mouseState) => {
        this.centerAnchorIsDragged = true
        this.lastTarget = mouseState.getX() - this.context.slider.offsetLeft
      },
      (mouseState) => {
        const target = mouseState.getX() - this.context.slider.offsetLeft
        this.moveRangeTo(target)
        this.lastTarget = target
      },
      () => {
        this.centerAnchorIsDragged = false
      }
    )

    app.getMouseEventManager().subscribe(this.startAnchorMouseArea)
    app.getMouseEventManager().subscribe(this.endAnchorMouseArea)
    app.getMouseEventManager().subscribe(this.centerAnchorMouseArea)
    // test ends

    this.context.slider.append(this.startAnchor)
    this.context.slider.append(this.centerAnchor)
    this.context.slider.append(this.endAnchor)
  }

  setViewRange (viewRange) {
    this.viewRange = viewRange
  }

  getSliderPosition (target) {
    // this function CHANGE slider position, NOT GET slider position

    let startPos = parseInt(this.startAnchor.style.left)
    let endPos = parseInt(this.endAnchor.style.left)

    if (this.startAnchorIsDragged) {
      startPos = Math.max(0, Math.min(target, endPos - this.anchorHalfWidth))
    } else if (this.endAnchorIsDragged) {
      endPos = Math.min(this.context.slider.offsetWidth, Math.max(target, startPos + this.anchorHalfWidth))
    } else {
      let moveVelocity = target - this.lastTarget

      if (startPos + moveVelocity < 0) {
        moveVelocity = -startPos
      } else if (endPos + moveVelocity > this.context.slider.offsetWidth) {
        moveVelocity = this.context.slider.offsetWidth - endPos
      }

      startPos += moveVelocity
      endPos += moveVelocity
    }

    return { startPos, endPos }
  }

  updateRange () {
    this.drawSlider(
      this.viewRange.start * this.context.slider.offsetWidth,
      this.viewRange.end * this.context.slider.offsetWidth
    )
  }

  drawSlider (startPos, endPos) {
    this.startAnchor.style.left = `${startPos}px`
    this.endAnchor.style.left = `${endPos}px`

    this.centerAnchor.style.left = this.startAnchor.style.left
    this.centerAnchor.style.width = `${endPos - startPos}px`
  }

  moveRangeTo (target) { // divide an destroy this method
    const { startPos, endPos } = this.getSliderPosition(target)

    this.drawSlider(startPos, endPos)

    this.viewRange.setRange(startPos / this.context.slider.offsetWidth, endPos / this.context.slider.offsetWidth, this)
  }
}

export { Slider }

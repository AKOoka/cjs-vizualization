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
    this.dragged = null
  }

  createSliderSideAnchorDom (anchorName, anchorPosition) {
    const sideAnchorDom = document.createElement('div')

    sideAnchorDom.id = `${anchorName}-slider`

    sideAnchorDom.classList.add('anchor')

    sideAnchorDom.style.width = `${this.anchorWidth}px`
    sideAnchorDom.style.left = `${anchorPosition}px`

    sideAnchorDom.onmousedown = event => {
      onMousedown(event, this)
    }

    return sideAnchorDom
  }

  createSliderCenterAnchorDom (leftPosition, rightPosition) {
    const centerAnchorDom = document.createElement('div')

    centerAnchorDom.id = 'center-slider'

    centerAnchorDom.style.left = `${leftPosition}px`
    centerAnchorDom.style.right = `${rightPosition}px`

    centerAnchorDom.onmousedown = event => {
      onMousedown(event, this)
    }

    return centerAnchorDom
  }

  setContext (context) {
    this.context = context

    this.startAnchor = this.createSliderSideAnchorDom('start', 0, onMousedown)
    this.endAnchor = this.createSliderSideAnchorDom('end', this.context.slider.offsetWidth, onMousedown)
    this.centerAnchor = this.createSliderCenterAnchorDom(0, 0, onMousedown)

    this.context.slider.append(this.startAnchor)
    this.context.slider.append(this.centerAnchor)
    this.context.slider.append(this.endAnchor)

    document.addEventListener('mousemove', event => {
      onMousemove(event, this)
    })
    document.addEventListener('mouseup', event => {
      onMouseup(event, this)
    })
  }

  setViewRange (viewRange) {
    this.viewRange = viewRange
  }

  getSliderPosition (target) {
    // this function CHANGE slider position, NOT GET slider position

    let startPos = parseInt(this.startAnchor.style.left)
    let endPos = parseInt(this.endAnchor.style.left)

    if (this.dragged === 'start-slider') {
      startPos = Math.max(0, Math.min(target, endPos - this.anchorHalfWidth))
    } else if (this.dragged === 'end-slider') {
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

  moveRangeTo (target) {
    const { startPos, endPos } = this.getSliderPosition(target)

    this.drawSlider(startPos, endPos)

    this.viewRange.setRange(startPos / this.context.slider.offsetWidth, endPos / this.context.slider.offsetWidth, this)
  }
}

function onMousedown (event, slider) {
  slider.dragged = event.target.id
}

function onMousemove (event, slider) {
  const target = event.clientX - slider.context.slider.offsetLeft

  if (slider.dragged) {
    // slider.moveSliderTo(target)
    slider.moveRangeTo(target)
    if (slider.dragged === 'center-slider') {
      event.target.style.cursor = 'grabbing'
    }
  }

  slider.lastTarget = target
}

function onMouseup (event, slider) {
  if (slider.dragged) {
    const target = event.clientX - slider.context.slider.offsetLeft

    slider.moveRangeTo(target)

    if (slider.dragged === 'center-slider') {
      event.target.style.cursor = 'grab'
    }

    slider.dragged = null
  }
}

export { Slider }

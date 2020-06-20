class Slider {
  constructor (viewRange, anchorWidth, anchorVelocity) {
    this.anchorWidth = anchorWidth
    this.anchorHalfWidth = Math.round(anchorWidth / 2)

    this.anchorVelocity = anchorVelocity

    this.viewRange = viewRange

    this.container = null
    this.startAnchor = null
    this.centerAnchor = null
    this.endAnchor = null

    this.dragged = null
    this.lastTarget = 0
  }

  getSliderPosition (target) {
    // this function CHANGE slider position, NOT GET slider position

    let startPos = parseInt(this.startAnchor.style.left)
    let endPos = parseInt(this.endAnchor.style.left)

    if (this.dragged === 'start-slider') {
      startPos = Math.max(0, Math.min(target, endPos - this.anchorHalfWidth))
    } else if (this.dragged === 'end-slider') {
      endPos = Math.min(this.container.offsetWidth, Math.max(target, startPos + this.anchorHalfWidth))
    } else {
      let moveVelocity = target - this.lastTarget

      if (startPos + moveVelocity < 0) {
        moveVelocity = -startPos
      } else if (endPos + moveVelocity > this.container.offsetWidth) {
        moveVelocity = this.container.offsetWidth - endPos
      }

      startPos += moveVelocity
      endPos += moveVelocity
    }

    return { startPos, endPos }
  }

  updateRange (start, end, eventTrigger) {
    // need to rethink observer patern because only slider needs to change something exept viewRange.start and veiwRange.end
    if (eventTrigger === this) {
      return
    }

    this.drawSlider(start * this.container.offsetWidth, end * this.container.offsetWidth)
  }

  drawSlider (startPos, endPos) {
    this.startAnchor.style.left = `${startPos}px`
    this.endAnchor.style.left = `${endPos}px`

    this.centerAnchor.style.left = this.startAnchor.style.left
    this.centerAnchor.style.width = `${endPos - startPos}px`
  }

  // moveSliderTo (target) {
  //   const { startPos, endPos } = this.getSliderPosition(target)

  //   this.drawSlider(startPos, endPos)
  // }

  moveRangeTo (target) {
    const { startPos, endPos } = this.getSliderPosition(target)

    this.drawSlider(startPos, endPos)

    this.viewRange.setRange(startPos / this.container.offsetWidth, endPos / this.container.offsetWidth, this)
  }

  static createSliderAnchorDOM (slider, anchorName, anchorWidth, anchorPosition, onMousedown) {
    const anchorDiv = document.createElement('div')

    anchorDiv.id = `${anchorName}-slider`

    anchorDiv.classList.add('anchor')

    anchorDiv.style.width = `${anchorWidth}px`
    anchorDiv.style.left = `${anchorPosition}px`

    anchorDiv.addEventListener('mousedown', event => { onMousedown(event, slider) })

    return anchorDiv
  }

  static createSliderMiddleAreaDOM (slider, leftPosition, rightPosition, onMousedown) {
    const sliderCenterDiv = document.createElement('div')

    sliderCenterDiv.id = 'center-slider'

    sliderCenterDiv.style.left = `${leftPosition}px`
    sliderCenterDiv.style.right = `${rightPosition}px`

    sliderCenterDiv.addEventListener('mousedown', event => { onMousedown(event, slider) })

    return sliderCenterDiv
  }

  static createSliderDOM (sliderContainer, slider) {
    slider.container = sliderContainer
    slider.startAnchor = Slider.createSliderAnchorDOM(slider, 'start', slider.anchorWidth, 0, onMousedown)
    slider.endAnchor = Slider.createSliderAnchorDOM(slider, 'end', slider.anchorWidth, slider.container.offsetWidth, onMousedown)
    slider.centerAnchor = Slider.createSliderMiddleAreaDOM(slider, 0, 0, onMousedown)

    slider.container.append(slider.startAnchor)
    slider.container.append(slider.centerAnchor)
    slider.container.append(slider.endAnchor)

    this.sliderWidth = slider.offsetWidth
    this.mapToGraphRation = this.sliderWidth / this.graphWidth

    document.addEventListener('mousemove', event => {
      onMousemove(event, slider)
    })
    document.addEventListener('mouseup', event => {
      onMouseup(event, slider)
    })
  }
}

function onMousedown (event, slider) {
  slider.dragged = event.target.id
}

function onMousemove (event, slider) {
  const target = event.clientX - slider.container.offsetLeft

  if (slider.dragged) {
    // slider.moveSliderTo(target)
    slider.moveRangeTo(target)
  }

  slider.lastTarget = target
}

function onMouseup (event, slider) {
  if (slider.dragged) {
    const target = event.clientX - slider.container.offsetLeft

    slider.moveRangeTo(target)
    slider.dragged = null
  }
}

export { Slider }

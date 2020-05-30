class SliderChangeIntreface {
  update (event) {}
}

class SliderChangeListener extends SliderChangeIntreface {
  update (zoomEvent) {
    super.update(zoomEvent)

    for (const processor of graphContainer.children) {
      processor.replaceWith(processor.cloneNode(false))
    }

    const { meta, jobsMap, processorsMap } = userData
    const sliderStart = scalePosition(slider.zoomStart, sliderContainer.offsetWidth, graphWidth) + meta.startingPoint
    const sliderEnd = scalePosition(slider.zoomEnd, sliderContainer.offsetWidth, graphWidth) + meta.startingPoint

    drawGraph(graphContainer, processorsMap, getGraphZoom(jobsMap, processorsMap, sliderStart, sliderEnd, sliderContainer.offsetWidth))
  }
}

class Slider {
  constructor (graphWidth, anchorWidth, zoomVelocity, zoomStart, zoomEnd) {
    this.subscribers = []

    this.graphWidth = graphWidth
    this.sliderWidth = 0
    this.mapToGraphRation = graphWidth

    this.anchorWidth = anchorWidth
    this.anchorHalfWidth = Math.round(anchorWidth / 2)

    this.zoomVelocity = zoomVelocity

    this.zoomStart = zoomStart
    this.zoomEnd = zoomEnd

    this.container = null
    this.startAnchor = null
    this.centerAnchor = null
    this.endAnchor = null
    this.sliderBackground = null

    this.anime = false
    this.dragged = null
    this.target = 0
  }

  triggerSliderChangeEvent (zoomEvent) {
    this.subscribers.forEach(sub => {
      sub.update(zoomEvent)
    })
  }

  subscribe (subscriber) {
    this.subscribers.push(subscriber)
  }

  update () {
    if (!this.anime) {
      return
    }

    const startPos = parseInt(this.startAnchor.style.left)
    const endPos = parseInt(this.endAnchor.style.left)

    let newStart = startPos
    let newEnd = endPos

    const selectorWidth = (endPos - startPos) / 2

    if (this.dragged.id === 'start-slider') {
      newStart += (this.target - startPos) * this.zoomVelocity
    } else if (this.dragged.id === 'end-slider') {
      newEnd += (this.target - endPos) * this.zoomVelocity
    } else {
      if (this.target - selectorWidth < 0) {
        newStart += (-this.anchorHalfWidth - startPos) * this.zoomVelocity

        newEnd += (-this.anchoHalfWidth + selectorWidth * 2 - endPos) * this.zoomVelocity
      } else if (this.target + selectorWidth > this.container.offsetWidth) {
        newStart += (this.anchorHalfWidth + this.container.offsetWidth - selectorWidth * 2 - startPos) * this.zoomVelocity

        newEnd += (this.anchorHalfWidth + this.container.offsetWidth - endPos) * this.zoomVelocity
      } else {
        newStart += (this.target - selectorWidth - startPos) * this.zoomVelocity

        newEnd += (this.target + selectorWidth - endPos) * this.zoomVelocity
      }
    }

    newStart = Math.round(newStart)
    newEnd = Math.round(newEnd)

    this.startAnchor.style.left = `${newStart}px`
    this.endAnchor.style.left = `${newEnd}px`

    this.centerAnchor.style.left = this.startAnchor.style.left
    this.centerAnchor.style.right = `${this.container.offsetWidth - newEnd}px`

    this.zoomStart = this.mapToGraphRation * newStart
    this.zoomEnd = this.mapToGraphRation * newEnd

    this.triggerSliderChangeEvent({ zoomStart: this.zoomStart, zoomEnd: this.zoomEnd })

    // requestAnimationFrame(this.update())
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

  static createSliderDOM (sliderContainer, slider, eventListeners) {
    const { onMousedown, onMousemove, onMouseup } = eventListeners

    const sliderBackground = document.createElement('div')

    sliderBackground.id = 'slider-background'

    slider.container = sliderContainer
    slider.sliderBackground = sliderBackground
    slider.startAnchor = Slider.createSliderAnchorDOM(slider, 'start', slider.anchorWidth, 0, onMousedown)
    slider.endAnchor = Slider.createSliderAnchorDOM(slider, 'end', slider.anchorWidth, slider.container.offsetWidth, onMousedown)
    slider.centerAnchor = Slider.createSliderMiddleAreaDOM(slider, 0, 0, onMousedown)

    slider.container.append(slider.sliderBackground)
    slider.container.append(slider.startAnchor)
    slider.container.append(slider.centerAnchor)
    slider.container.append(slider.endAnchor)

    this.sliderWidth = slider.offsetWidth
    this.mapToGraphRation = this.sliderWidth / this.graphWidth

    document.addEventListener('mousemove', event => { onMousemove(event, slider) })
    document.addEventListener('mouseup', () => { onMouseup(slider) })
  }
}

const sliderEventListeners = {
  onMousedown,
  onMousemove,
  onMouseup
}

function onMousedown (event, slider) {
  slider.anime = true
  slider.dragged = event.target

  slider.update()

  // console.log('onMousedown')
}

function onMousemove (event, slider) {
  if (!slider.anime) {
    return
  }

  const {
    startAnchor,
    endAnchor,
    container,
    anchorHalfWidth,
    dragged
  } = slider

  const startPosition = parseInt(startAnchor.style.left)
  const endPosition = parseInt(endAnchor.style.left)

  slider.target = event.clientX - container.offsetLeft

  if (dragged.id === 'start-slider' && slider.target > endPosition) {
    slider.target = endPosition
  } else if (dragged.id === 'end-slider' && slider.target < startPosition) {
    slider.target = startPosition
  } else if (slider.target <= 0) {
    slider.target = 0
  } else if (slider.target >= container.offsetWidth) {
    slider.target = container.offsetWidth - anchorHalfWidth
  }

  console.log(event.mouseLeft)

  slider.update()

  // console.log('onMousemove')
}

function onMouseup (slider) {
  slider.dragged = null
  slider.anime = false

  // console.log('onMouseup')
}

export { sliderEventListeners, Slider, SliderChangeListener }

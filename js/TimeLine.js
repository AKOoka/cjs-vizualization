class TimeLine {
  constructor (viewRange) {
    this.viewRange = viewRange
    this.context = null
    this.plotterWidth = null
    this.timeLineInterval = 20
  }

  updateRange (start, end, eventTrigger) {
    this.clearDOM()
    this.createDOM()
  }

  setContext (context) {
    this.context = context

    // this.createDOM()
  }

  setMeta ({ startTime, endTime }) {
    this.plotterWidth = endTime - startTime

    this.clearDOM()
    this.createDOM()
  }

  clearDOM () {
    // need to make container for which i will remove instead manually delete all children
    while (this.context.children.length > 0) {
      this.context.children[0].remove()
    }
  }

  convertTime (time, timeIntervalLength) {
    let outputTime = time

    if (timeIntervalLength < 100) {
      outputTime = outputTime.toString() + 'μs'
    } else if (timeIntervalLength > 100 && timeIntervalLength < 1000) {
      outputTime = (outputTime / 1000).toFixed(2).toString() + 'ms'
    } else if (timeIntervalLength > 1000 && timeIntervalLength < 100000) {
      outputTime = Math.round(outputTime / 1000).toString() + 'ms'
    } else if (timeIntervalLength > 100000 && timeIntervalLength < 1000000) {
      outputTime = (outputTime / 1000000).toFixed(2).toString() + 's'
    } else if (timeIntervalLength > 1000000) {
      outputTime = Math.round(outputTime / 1000000).toString() + 's'
    }

    return outputTime
  }

  createDOM () {
    const timeInterval = (this.viewRange.end - this.viewRange.start) / this.timeLineInterval
    const timeIntervalLength = timeInterval * this.plotterWidth
    const positionInterval = this.context.offsetWidth / this.timeLineInterval

    for (let i = 0; i <= this.timeLineInterval; i++) {
      const markerPosition = i * positionInterval
      const markerTime = Math.round((this.viewRange.start + i * timeInterval) * this.plotterWidth)

      this.context.append(this.createTimeMarkerDOM(markerPosition, this.convertTime(markerTime, timeIntervalLength)))
    }
  }

  createTimeMarkerDOM (position, time) {
    const timeMarker = document.createElement('div')
    const markerLine = document.createElement('div')
    const markerText = document.createElement('span')

    timeMarker.classList.add('time-marker')
    markerLine.classList.add('marker-line')
    markerText.classList.add('marker-text')

    markerText.textContent = time

    timeMarker.style.left = `${position}px`
    timeMarker.append(markerText, markerLine)

    return timeMarker
  }
}

export { TimeLine }

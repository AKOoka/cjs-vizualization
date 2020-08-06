import { TimeLineInfo } from './TimeLineInfo.js'

class TimeLine {
  constructor (viewRange) {
    this.viewRange = viewRange
    this.context = null
    this.domContainer = null
    this.timeMarkersContainer = null
    this.startTimeMarker = null
    this.endTimeMarker = null
    this.timeLineInfo = null
    this.timeSpan = null
    this.markerStep = 1000
  }

  updateRange () {
    this.clearTimeMarkers()

    const rangeWidth = this.viewRange.end - this.viewRange.start
    const viewRangeTimeSpan = rangeWidth * this.timeSpan
    const startTimeRange = this.viewRange.start * this.timeSpan
    const endTimeRange = this.viewRange.end * this.timeSpan
    const a = (1 / rangeWidth) * this.timeMarkersContainer.offsetWidth / this.timeSpan
    const b = -this.viewRange.start * (1 / rangeWidth) * this.timeMarkersContainer.offsetWidth

    const timeToPlotter = (time) => {
      return time * a + b
    }

    this.timeLineInfo.changeRangeTime(this.convertTime(viewRangeTimeSpan))
    this.startTimeMarker.textContent = this.convertTime(startTimeRange)
    this.endTimeMarker.textContent = this.convertTime(endTimeRange)

    this.markerStep = 100000
    const markerCond = viewRangeTimeSpan / 26

    while (this.markerStep > markerCond) {
      this.markerStep /= 2
    }

    let markerTime = Math.floor(startTimeRange / this.markerStep + 1) * this.markerStep

    for (markerTime; markerTime <= endTimeRange; markerTime += this.markerStep) {
      this.timeMarkersContainer.append(this.createTimeMarker(this.convertTime(markerTime), timeToPlotter(markerTime)))
    }
  }

  setContext (context) {
    const staticTimeMarkersContainer = document.createElement('section')

    staticTimeMarkersContainer.classList.add('static-markers-container')

    this.timeMarkersContainer = document.createElement('section')

    this.domContainer = document.createElement('section')
    this.domContainer.classList.add('time-line') // it should be named 'time-line-container'
    this.domContainer.append(this.timeMarkersContainer, staticTimeMarkersContainer)

    this.context = context
    this.context.append(this.domContainer)

    this.startTimeMarker = this.createSideTimeMarker(0)
    this.endTimeMarker = this.createSideTimeMarker(staticTimeMarkersContainer.offsetWidth)
    this.timeLineInfo = new TimeLineInfo()

    staticTimeMarkersContainer.append(this.startTimeMarker, this.timeLineInfo.domContainer, this.endTimeMarker)
  }

  setMeta (meta) {
    this.timeSpan = meta.endTime - meta.startTime

    this.timeLineInfo.changeTotalTime(this.convertTime(this.timeSpan))
    this.updateRange()
  }

  clearTimeMarkers () {
    this.timeMarkersContainer.remove()

    this.timeMarkersContainer = document.createElement('section')
    this.timeMarkersContainer.classList.add('time-markers-container')

    this.domContainer.append(this.timeMarkersContainer)
  }

  convertTime (time) {
    let outputTime = time

    if (time <= 100) {
      outputTime = outputTime.toString() + 'μs'
    } else if (time > 100 && time <= 1000) {
      outputTime = (outputTime / 1000).toFixed(2).toString() + 'ms'
    } else if (time > 1000 && time <= 100000) {
      outputTime = Math.round(outputTime / 1000).toString() + 'ms'
    } else if (time > 100000 && time <= 1000000) {
      outputTime = (outputTime / 1000000).toFixed(2).toString() + 's'
    } else if (time > 1000000) {
      outputTime = Math.round(outputTime / 1000000).toString() + 's'
    }

    return outputTime
  }

  createTimeMarker (text, domPosition) {
    const domText = document.createElement('span')
    const domTimeMarker = document.createElement('div')
    const domTimeLine = document.createElement('div')

    domTimeLine.classList.add('marker-line')

    domText.classList.add('marker-text')
    domText.textContent = text

    // should correct width of timeLine
    domTimeMarker.style.left = `${domPosition}px`
    domTimeMarker.classList.add('time-marker')
    domTimeMarker.append(domText, domTimeLine)

    return domTimeMarker
  }

  createSideTimeMarker (domPosition) {
    const domTimeMarker = document.createElement('div')

    domTimeMarker.classList.add('side-time-marker')
    domTimeMarker.style.left = `${domPosition}px`

    return domTimeMarker
  }
}

export { TimeLine }

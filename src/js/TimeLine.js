import { SummaryTimeBar } from './SummaryTimeBar.js'

class TimeLine {
  constructor (viewRange) {
    this.viewRange = viewRange
    this.context = null
    this.totalTimeSpan = null
    this.summaryTimeBar = null
  }

  setContext (context) {
    this.context = context

    this.summaryTimeBar = new SummaryTimeBar()

    this.changeContext('summaryTimeBar', this.summaryTimeBar.summaryTimeBarDom)
  }

  setModel (model) {
    const timeSpan = this.convertTime(model.meta.timeSpan)

    this.totalTimeSpan = model.meta.timeSpan

    this.summaryTimeBar.changeRangeTimeSpan(timeSpan)
    this.summaryTimeBar.changeTotalTime(timeSpan)

    this.changeContext('timeMarkersContainer', this.createTimeMarkersContainer())
    this.changeContext('timeLinesContainer', this.createTimeLinesContainer())

    this.updateRange()
  }

  createTimeMarkersContainer () {
    const timeMarkersContainer = document.createElement('div')

    timeMarkersContainer.id = 'time-markers-container'

    return timeMarkersContainer
  }

  createTimeLinesContainer () {
    const timeLinesContainer = document.createElement('div')

    timeLinesContainer.id = 'time-lines-container'

    return timeLinesContainer
  }

  changeContext (key, domValue) {
    this.context[key].replaceWith(domValue)
    this.context[key] = domValue
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
    const domTimeMarker = document.createElement('div')

    domTimeMarker.classList.add('time-marker')
    domTimeMarker.append(text)
    domTimeMarker.style.left = `${domPosition}px`

    return domTimeMarker
  }

  createTimeLine (domPosition) {
    const domTimeLine = document.createElement('div')

    domTimeLine.classList.add('time-line')
    domTimeLine.style.left = `${domPosition}px`

    return domTimeLine
  }

  updateRange () {
    this.changeContext('timeLinesContainer', this.createTimeLinesContainer())
    this.changeContext('timeMarkersContainer', this.createTimeMarkersContainer())

    const viewRangeTimeSpan = this.viewRange.width * this.totalTimeSpan
    const startTimeRange = this.viewRange.start * this.totalTimeSpan
    const endTimeRange = this.viewRange.end * this.totalTimeSpan
    const a = (1 / this.viewRange.width) * this.context.timeMarkersContainer.offsetWidth / this.totalTimeSpan
    const b = -this.viewRange.start * (1 / this.viewRange.width) * this.context.timeMarkersContainer.offsetWidth

    const timeToPlotter = (time) => {
      return time * a + b
    }

    this.summaryTimeBar.changeRangeTimeSpan(this.convertTime(viewRangeTimeSpan))
    this.summaryTimeBar.changeStartRangeTime(this.convertTime(startTimeRange))
    this.summaryTimeBar.changeEndRangeTime(this.convertTime(endTimeRange))

    const markerCond = viewRangeTimeSpan / 26

    let markerStep = 100000

    while (markerStep > markerCond) {
      markerStep /= 2
    }

    let markerTime = Math.floor(startTimeRange / markerStep + 1) * markerStep

    for (markerTime; markerTime <= endTimeRange; markerTime += markerStep) {
      this.context.timeMarkersContainer.append(this.createTimeMarker(this.convertTime(markerTime), timeToPlotter(markerTime)))
      this.context.timeLinesContainer.append(this.createTimeLine(timeToPlotter(markerTime)))
    }
  }
}

export { TimeLine }

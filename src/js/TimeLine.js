import { SummaryTimeBar } from './SummaryTimeBar.js'
import { Time } from './Time.js'

class TimeLine {
  constructor () {
    this.viewRange = null
    this.context = null
    this.totalTimeSpan = null
    this.summaryTimeBar = null
    this.timeMarkersContainer = null
    this.timeLinesContainer = null
  }

  setContext (context) {
    this.summaryTimeBar = new SummaryTimeBar()
    this.timeMarkersContainer = this.createTimeMarkersContainer()
    this.timeLinesContainer = this.createTimeLinesContainer()

    this.context = context
    this.context.timeLineInfo.append(this.summaryTimeBar.summaryTimeBarContainer)
    this.context.timeLineInfo.append(this.timeMarkersContainer)
    this.context.jobsPlotter.append(this.timeLinesContainer)
  }

  setViewRange (viewRange) {
    this.viewRange = viewRange
  }

  setModel (model) {
    const timeSpan = model.meta.timeSpan.convertTime()

    this.totalTimeSpan = model.meta.timeSpan.getTime()

    this.summaryTimeBar.changeRangeTimeSpan(timeSpan)
    this.summaryTimeBar.changeTotalTime(timeSpan)

    if (this.timeMarkersContainer.children.length > 0) {
      this.changeContainer('timeMarkersContainer', this.createTimeMarkersContainer())
    }
    if (this.timeLinesContainer.children.length > 0) {
      this.changeContainer('timeLinesContainer', this.createTimeLinesContainer())
    }

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

  changeContainer (key, container) {
    this[key].replaceWith(container)
    this[key] = container
  }

  createTimeMarker (text, domPosition) {
    const timeMarker = document.createElement('div')

    timeMarker.classList.add('time-marker')
    timeMarker.append(text)
    timeMarker.style.left = `${domPosition}px`

    return timeMarker
  }

  createTimeLine (domPosition) {
    const timeLine = document.createElement('div')

    timeLine.classList.add('time-line')
    timeLine.style.left = `${domPosition}px`

    return timeLine
  }

  updateRange () {
    this.changeContainer('timeLinesContainer', this.createTimeLinesContainer())
    this.changeContainer('timeMarkersContainer', this.createTimeMarkersContainer())

    const viewRangeTimeSpan = this.viewRange.width * this.totalTimeSpan
    const startTimeRange = this.viewRange.start * this.totalTimeSpan
    const endTimeRange = this.viewRange.end * this.totalTimeSpan
    const a = (1 / this.viewRange.width) * this.timeMarkersContainer.offsetWidth / this.totalTimeSpan
    const b = -this.viewRange.start * (1 / this.viewRange.width) * this.timeMarkersContainer.offsetWidth

    const timeToPlotter = (time) => {
      return time * a + b
    }

    this.summaryTimeBar.changeRangeTimeSpan(new Time(viewRangeTimeSpan).convertTime())
    this.summaryTimeBar.changeStartRangeTime(new Time(startTimeRange).convertTime())
    this.summaryTimeBar.changeEndRangeTime(new Time(endTimeRange).convertTime())

    const markerCond = viewRangeTimeSpan / 26

    let markerStep = 100000

    while (markerStep > markerCond) {
      markerStep /= 2
    }

    let markerTime = Math.floor(startTimeRange / markerStep + 1) * markerStep

    for (markerTime; markerTime <= endTimeRange; markerTime += markerStep) {
      this.timeMarkersContainer.append(this.createTimeMarker(new Time(markerTime).convertTime(), timeToPlotter(markerTime)))
      this.timeLinesContainer.append(this.createTimeLine(timeToPlotter(markerTime)))
    }
  }
}

export { TimeLine }

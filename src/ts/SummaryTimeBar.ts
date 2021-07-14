export class SummaryTimeBar {
  constructor (rangeTime = 0, totalTime = 0, selectedTime = 0) {
    this.rangeTimeSpan = this.createTimeSpan(rangeTime)
    this.totalTimeSpan = this.createTimeSpan(totalTime)
    this.selectedTimeSpan = this.createTimeSpan(selectedTime)

    this.timeSpansContainer = this.createTimeSpanContainer(
      this.rangeTimeSpan,
      this.totalTimeSpan,
      this.selectedTimeSpan
    )

    this.startRange = this.createRangeTimeMarker()
    this.endRange = this.createRangeTimeMarker()

    this.summaryTimeBarContainer = this.createSummaryTimeBarContainer(
      this.startRange,
      this.timeSpansContainer,
      this.endRange
    )
  }

  createTimeSpan (time) {
    const timeSpan = document.createElement('span')

    timeSpan.append(time)

    return timeSpan
  }

  createTimeSpanContainer (rangeTimeSpanTextDom, totalTimeSpanTextDom, selectedTimeSpanTextDom) {
    const timeSpansContainer = document.createElement('div')

    timeSpansContainer.id = 'sumary-time-span-container'
    timeSpansContainer.append(rangeTimeSpanTextDom, '/', totalTimeSpanTextDom, '/', selectedTimeSpanTextDom)

    return timeSpansContainer
  }

  createRangeTimeMarker () {
    const rangeTimeMarker = document.createElement('div')

    rangeTimeMarker.classList.add('summary-range-time-marker')

    return rangeTimeMarker
  }

  createSummaryTimeBarContainer (startRange, timeSpansContainer, endRange) {
    const summaryTimeBarContainer = document.createElement('div')

    summaryTimeBarContainer.id = 'summary-time-bar'
    summaryTimeBarContainer.append(startRange, timeSpansContainer, endRange)

    return summaryTimeBarContainer
  }

  changeStartRangeTime (time) {
    this.startRange.textContent = time
  }

  changeEndRangeTime (time) {
    this.endRange.textContent = time
  }

  changeRangeTimeSpan (time) {
    this.rangeTimeSpan.textContent = time
  }

  changeTotalTime (time) {
    this.totalTimeSpan.textContent = time
  }

  changeSelectedTime (time) {
    this.selectedTimeSpan.textContent = time
  }
}

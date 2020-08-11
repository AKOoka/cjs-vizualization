class SummaryTimeBar {
  constructor (rangeTime = 0, totalTime = 0, selectedTime = 0) {
    this.rangeTimeSpanText = this.createTextDom(rangeTime)
    this.totalTimeSpanText = this.createTextDom(totalTime)
    this.selectedTimeSpanText = this.createTextDom(selectedTime)

    this.timeSpansContainer = this.createTimeSpanContainer(
      this.rangeTimeSpanText,
      this.totalTimeSpanText,
      this.selectedTimeSpanText
    )

    this.startRange = this.createRangeTimeMarker()
    this.endRange = this.createRangeTimeMarker()

    this.summaryTimeBarDom = this.createSummaryBarDom(
      this.startRange,
      this.timeSpansContainer,
      this.endRange
    )
  }

  createTextDom (text) {
    const textDom = document.createElement('span')

    textDom.append(text)

    return textDom
  }

  createTimeSpanContainer (rangeTimeSpanTextDom, totalTimeSpanTextDom, selectedTimeSpanTextDom) {
    const timeSpansContainer = document.createElement('div')

    timeSpansContainer.id = 'sumary-time-span-container'
    timeSpansContainer.append(rangeTimeSpanTextDom, '/', totalTimeSpanTextDom, '/', selectedTimeSpanTextDom)

    return timeSpansContainer
  }

  createRangeTimeMarker () {
    const rangeTimeMarkerDom = document.createElement('div')

    rangeTimeMarkerDom.classList.add('summary-range-time-marker')

    return rangeTimeMarkerDom
  }

  createSummaryBarDom (startRange, timeSpansContainer, endRange) {
    const summaryBarDom = document.createElement('div')

    summaryBarDom.id = 'summary-time-bar'
    summaryBarDom.append(startRange, timeSpansContainer, endRange)

    return summaryBarDom
  }

  changeStartRangeTime (time) {
    this.startRange.textContent = time
  }

  changeEndRangeTime (time) {
    this.endRange.textContent = time
  }

  changeRangeTimeSpan (time) {
    this.rangeTimeSpanText.textContent = time
  }

  changeTotalTime (time) {
    this.totalTimeSpanText.textContent = time
  }

  changeSelectedTime (time) {
    this.selectedTimeSpanText.textContent = time
  }
}

export { SummaryTimeBar }

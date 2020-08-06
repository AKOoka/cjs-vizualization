class TimeLineInfo {
  constructor (rangeTime = 0, totalTime = 0, selectedTime = 0) {
    this.rangeTimeSpanTextDOM = document.createElement('span')
    this.totalTimeSpanTextDOM = document.createElement('span')
    this.selectedTimeSpanTextDOM = document.createElement('span')
    this.domContainer = document.createElement('section')

    this.rangeTimeSpanTextDOM.textContent = rangeTime
    this.totalTimeSpanTextDOM.textContent = totalTime
    this.selectedTimeSpanTextDOM.textContent = selectedTime

    this.domContainer.classList.add('time-line-info')
    this.domContainer.append(this.rangeTimeSpanTextDOM, this.totalTimeSpanTextDOM, this.selectedTimeSpanTextDOM)
  }

  changeRangeTime (time) {
    this.rangeTimeSpanTextDOM.textContent = time
  }

  changeTotalTime (time) {
    this.totalTimeSpanTextDOM.textContent = time
  }

  changeSelectedTime (time) {
    this.selectedTimeSpanTextDOM.textContent = time
  }
}

export { TimeLineInfo }

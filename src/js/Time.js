class Time {
  constructor (time) {
    this.time = time
  }

  getTime () {
    return this.time
  }

  changeTime (time) {
    this.time = time
  }

  addTime (time) {
    this.time += time
  }

  convertTime () {
    let outputTime = this.time

    if (this.time <= 100) {
      outputTime = outputTime.toString() + 'μs'
    } else if (this.time > 100 && this.time <= 1000) {
      outputTime = (outputTime / 1000).toFixed(2).toString() + 'ms'
    } else if (this.time > 1000 && this.time <= 100000) {
      outputTime = Math.round(outputTime / 1000).toString() + 'ms'
    } else if (this.time > 100000 && this.time <= 1000000) {
      outputTime = (outputTime / 1000000).toFixed(2).toString() + 's'
    } else if (this.time > 1000000) {
      outputTime = Math.round(outputTime / 1000000).toString() + 's'
    }

    return outputTime
  }
}

export { Time }

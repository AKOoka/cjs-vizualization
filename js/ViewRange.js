class ViewRange {
  constructor () {
    this.start = 0
    this.end = 1
    this.subscribers = []
  }

  // add method and value for rangeWidth

  subscribe (sub) {
    this.subscribers.push(sub)
  }

  setRange (start, end, eventTrigger) {
    this.start = start
    this.end = end

    this.subscribers.forEach(sub => {
      sub.updateRange(start, end, eventTrigger)
    })
  }
}

export { ViewRange }

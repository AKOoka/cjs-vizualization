class ViewRange {
  constructor () {
    this.start = 0
    this.end = 1
    this.subscribers = []
  }

  subscribe (sub) {
    this.subscribers.push(sub)
  }

  setRange (start, end) {
    this.start = start
    this.end = end

    this.triggerViewRangeEvent(start, end)
  }

  triggerViewRangeEvent (start, end) {
    this.subscribers.forEach(sub => {
      sub.updateRange({ start, end })
    })
  }
}

export { ViewRange }

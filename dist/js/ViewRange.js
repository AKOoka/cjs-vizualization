class ViewRange {
  constructor () {
    this.start = 0
    this.end = 1
    this.width = 0
    this.subscribers = []
  }

  subscribe (sub) {
    this.subscribers.push(sub)
  }

  notify () {
    this.subscribers.forEach(sub => {
      sub.updateRange()
    })
  }

  setRange (start, end) {
    this.start = start
    this.end = end
    this.width = end - start

    this.notify()
  }
}

export { ViewRange }

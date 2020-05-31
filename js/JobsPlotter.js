import { JobsSelector } from './JobsSelector.js'

class JobsPlotter {
  constructor () {
    this.drawRange = {
      start: 0,
      end: 1
    }

    this.visibleRanges = null
    this.context = null
    this.selector = new JobsSelector()
    this.domComposer = null
  }

  setContext (context) {
    this.context = context

    this.selector.setContext(context)
  }

  changeJobColor (color) {
    this.selector.doAction(job => {
      // this.context.styleData.sheet.insertRule(`#job-${job} { background-color: ${color} }`, 0)
      this.context.styleData.innerHTML += `.job-${job}.range { background-color: ${color} }`

      console.log(this.context.styleData)
    })
  }

  setDOMComposer (domComposer) {
    this.domComposer = domComposer

    this.visibleRanges = []

    this.domComposer.jobsDOMModel.forEach((value, index) => { this.visibleRanges.push(index) })

    const visibleDOMRanges = new Map()

    this.visibleRanges.forEach(index => {
      visibleDOMRanges.set(index, this.domComposer.jobsDOMModel[index])
    })

    const plotterWidth = this.context.domRoot.offsetWidth
    const min = this.domComposer.jobModel.meta.startTime
    const max = this.domComposer.jobModel.meta.endTime

    for (const [key, value] of visibleDOMRanges.entries()) {
      const { job, rangeCounter } = this.domComposer.jobModel.jobRanges[key]
      const { beginTimestamp, endTimestamp } = this.domComposer.jobModel.jobRecords.get(job).ranges[rangeCounter]

      const divWidth = (endTimestamp - beginTimestamp) / (max - min) * plotterWidth

      value.style.left = (beginTimestamp - min) / (max - min) * plotterWidth + 'px'
      value.style.width = Math.max(1, divWidth) + 'px'
    }

    for (const model of visibleDOMRanges.values()) {
      this.context.domRoot.append(model)
    }
  }

  moveRangeTo ({ start, end }) {
    const min = this.domComposer.jobModel.meta.startTime
    const max = this.domComposer.jobModel.meta.endTime
    const width = max - min

    const startPos = start * width + min
    const endPos = end * width + min

    const ranges = []

    for (let i = 0; i < this.domComposer.jobModel.jobRanges.length; i++) {
      const { job, rangeCounter } = this.domComposer.jobModel.jobRanges[i]
      const { beginTimestamp, endTimestamp } = this.domComposer.jobModel.jobRecords.get(job).ranges[rangeCounter]

      ranges.push({ index: i, time: beginTimestamp })
      ranges.push({ index: i, time: endTimestamp })
    }

    const visible = ranges.filter(({ index, time }) => time >= startPos && time <= endPos)
    const allNewVisibleRanges = []

    visible.forEach(({ index, time }) => { allNewVisibleRanges.push(index) })

    const nonVisibleRanges = this.visibleRanges.filter(range => !allNewVisibleRanges.includes(range))
    const newVisibleRanges = allNewVisibleRanges.filter(range => !this.visibleRanges.includes(range))

    this.visibleRanges = allNewVisibleRanges

    new Set(nonVisibleRanges).forEach(index => {
      this.context.domRoot.removeChild(this.domComposer.jobsDOMModel[index])
    })

    new Set(newVisibleRanges).forEach(index => {
      this.context.domRoot.append(this.domComposer.jobsDOMModel[index])
    })

    this.visibleRanges.forEach(index => {
      const range = this.domComposer.jobsDOMModel[index]
      const { job, rangeCounter } = this.domComposer.jobModel.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this.domComposer.jobModel.jobRecords.get(job).ranges[rangeCounter]

      const scaleFactor = (1 - (end - start)) / (end - start)

      const divWidth = (endTimestamp - beginTimestamp) / (max - min) * scaleFactor * this.context.domRoot.offsetWidth

      range.style.left = ((beginTimestamp - min) / (max - min) - start) * scaleFactor * this.context.domRoot.offsetWidth + 'px'
      range.style.width = Math.max(1, divWidth) + 'px'
    })

    // zoom out doesn't work properly
  }
}

const jobsPlotter = new JobsPlotter()

export { jobsPlotter }

import { ActionControlls } from './ActionControlls.js'
import { JobsDOMComposer } from './JobsDOMComposer.js'

class JobsPlotter {
  constructor () {
    this.context = null
    this.model = null
    this.jobsDOMComposer = new JobsDOMComposer()
    this.actionCotrolls = new ActionControlls()
    this.viewRange = null
    this.visibleRanges = null
    this.rangesAS = null
  }

  setContext (context) {
    this.context = context

    this.actionCotrolls.setActionControlls(this.context.domRoot)
  }

  setModel (model) {
    this.model = model

    this.jobsDOMComposer.createDOMModel(model)
  }

  setViewRange (viewRange) {
    this.viewRange = viewRange
  }

  setDOMComposer (domComposer) {
    this.domComposer = domComposer

    this.visibleRanges = []

    this.domComposer.jobsDOMModel.forEach((value, index) => {
      this.visibleRanges.push(index)
    })

    const visibleDOMRanges = new Map()

    this.visibleRanges.forEach(index => {
      visibleDOMRanges.set(index, this.domComposer.jobsDOMModel[index])
    })

    const plotterWidth = this.context.domRoot.offsetWidth
    const min = this.model.meta.startTime
    const max = this.model.meta.endTime

    for (const [key, value] of visibleDOMRanges.entries()) {
      const { job, rangeCounter } = this.model.jobRanges[key]
      const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

      const divWidth = (endTimestamp - beginTimestamp) / (max - min) * plotterWidth

      value.style.left = (beginTimestamp - min) / (max - min) * plotterWidth + 'px'
      value.style.width = Math.max(1, divWidth) + 'px'
    }

    for (const model of visibleDOMRanges.values()) {
      this.context.domRoot.append(model)
    }

    this.rangesAS = []

    for (let i = 0; i < this.model.jobRanges.length; i++) {
      const { job, rangeCounter } = this.model.jobRanges[i]
      const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

      this.rangesAS.push({ index: i, time: beginTimestamp })
      this.rangesAS.push({ index: i, time: endTimestamp })
    }
  }

  // maybe we should use somthing like http://pixijs.download/release/docs/index.html to increase performance
  updateRange () {
    if (!this.model) {
      return
    }

    const min = this.model.meta.startTime
    const max = this.model.meta.endTime
    const width = max - min

    const startPos = this.viewRange.start * width + min
    const endPos = this.viewRange.end * width + min

    const visible = this.rangesAS.filter(({ index, time }) => time >= startPos && time <= endPos)
    const allNewVisibleRanges = []

    visible.forEach(({ index }) => { allNewVisibleRanges.push(index) })

    const nonVisibleRanges = this.visibleRanges.filter(range => !allNewVisibleRanges.includes(range))
    const newVisibleRanges = allNewVisibleRanges.filter(range => !this.visibleRanges.includes(range))

    this.visibleRanges = allNewVisibleRanges

    new Set(nonVisibleRanges).forEach(index => {
      this.context.domRoot.removeChild(this.jobsDOMComposer.jobsDOMModel[index])
    })

    new Set(newVisibleRanges).forEach(index => {
      this.context.domRoot.append(this.jobsDOMComposer.jobsDOMModel[index])
    })

    const scaleFactor = 1 / (this.viewRange.end - this.viewRange.start)
    const scaleWidthFactor = 1 / (width) * scaleFactor * this.context.domRoot.offsetWidth
    const translateFactor = this.viewRange.start * scaleFactor * this.context.domRoot.offsetWidth

    this.visibleRanges.forEach(index => {
      const range = this.jobsDOMComposer.jobsDOMModel[index]
      const { job, rangeCounter } = this.model.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

      const divWidth = (endTimestamp - beginTimestamp) * scaleWidthFactor
      const pos = (beginTimestamp - min) * scaleWidthFactor - translateFactor

      range.style.left = pos + 'px'
      range.style.width = Math.max(1, divWidth) + 'px'

      if (divWidth <= 40) {
        range.classList.add('hiddeText')
      } else {
        range.classList.remove('hiddeText')
      }
    })
  }
}

const jobsPlotter = new JobsPlotter()

export { jobsPlotter }

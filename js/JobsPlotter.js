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


      this.rangesAS = []

      for (let i = 0; i < this.domComposer.jobModel.jobRanges.length; i++) {
          const { job, rangeCounter } = this.domComposer.jobModel.jobRanges[i]
          const { beginTimestamp, endTimestamp } = this.domComposer.jobModel.jobRecords.get(job).ranges[rangeCounter]

          this.rangesAS.push({ index: i, time: beginTimestamp })
          this.rangesAS.push({ index: i, time: endTimestamp })
      }
  }
    //maybe we should use somthing like http://pixijs.download/release/docs/index.html to increase performance
  moveRangeTo ({ start, end }) {
    const min = this.domComposer.jobModel.meta.startTime
    const max = this.domComposer.jobModel.meta.endTime
    const width = max - min

    const startPos = start * width + min
    const endPos = end * width + min

    const visible = this.rangesAS.filter(({ index, time }) => time >= startPos && time <= endPos)
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
        const scaleFactor = 1 / (end - start)
        const scaleWidthFactor = 1 / (width) * scaleFactor * this.context.domRoot.offsetWidth;
        const translateFactor = start * scaleFactor * this.context.domRoot.offsetWidth

    this.visibleRanges.forEach(index => {
      const range = this.domComposer.jobsDOMModel[index]
      const { job, rangeCounter } = this.domComposer.jobModel.jobRanges[index]
      const { beginTimestamp, endTimestamp } = this.domComposer.jobModel.jobRecords.get(job).ranges[rangeCounter]

      const divWidth = (endTimestamp - beginTimestamp) * scaleWidthFactor
      const pos = (beginTimestamp - min) * scaleWidthFactor - translateFactor
      range.style.left = pos + 'px'
      range.style.width = Math.max(1, divWidth) + 'px'
    })
  }
}

const jobsPlotter = new JobsPlotter()

export { jobsPlotter }

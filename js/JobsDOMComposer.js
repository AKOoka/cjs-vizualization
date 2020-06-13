import { JobColorGenerator } from './JobColorGenerator.js'

class JobsDOMComposer {
  constructor () {
    this.jobsDOMModel = []
  }

  createDOMModel (model) {
    for (const { job, rangeCounter } of model.jobRanges.values()) {
      const { name, ranges } = model.jobRecords.get(job)
      const { beginTimestamp, endTimestamp, processorId } = ranges[rangeCounter]

      const rangeDiv = document.createElement('div')
      // const rangeText = document.createElement('span')
      const rangeWidth = endTimestamp - beginTimestamp

      rangeDiv.textContent = name

      rangeDiv.classList.add(`processor-${processorId}`)
      rangeDiv.classList.add(`job-${job}`)
      rangeDiv.classList.add('range')
      rangeDiv.classList.add(`range-${rangeCounter}`)
      rangeDiv.title = name
      rangeDiv.style.left = `${beginTimestamp}px`
      rangeDiv.style.width = `${rangeWidth}px`

      if (rangeWidth <= 40) {
        rangeDiv.classList.add('hiddeText')
      }

      // rangeDiv.append(rangeText)

      this.jobsDOMModel.push(rangeDiv)
    }
  }
}

export { JobsDOMComposer }

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

      rangeDiv.classList.add(`processor-${processorId}`)
      rangeDiv.classList.add(`job-${job}`)
      rangeDiv.classList.add('range')
      rangeDiv.classList.add(`range-${rangeCounter}`)
      rangeDiv.textContent = name
      rangeDiv.title = name
      rangeDiv.style.left = `${beginTimestamp}px`
      rangeDiv.style.width = `${endTimestamp - beginTimestamp}px`

      this.jobsDOMModel.push(rangeDiv)
    }
  }
}

export { JobsDOMComposer }

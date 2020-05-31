import { JobColorGenerator } from './JobColorGenerator.js'

class JobsDOMComposer {
  constructor (model) {
    this.jobsDOMModel = []
    this.jobModel = model

    for (const { job, rangeCounter } of this.jobModel.jobRanges.values()) {
      const { name, ranges } = this.jobModel.jobRecords.get(job)
      const { beginTimestamp, endTimestamp, processorId } = ranges[rangeCounter]

      const rangeDiv = document.createElement('div')

      rangeDiv.classList.add(`processor-${processorId}`)
      rangeDiv.classList.add(`job-${job}`)
      rangeDiv.classList.add('range')
      rangeDiv.classList.add(`range-${rangeCounter}`)
      rangeDiv.textContent = name
      rangeDiv.style.left = `${beginTimestamp}px`
      rangeDiv.style.width = `${endTimestamp - beginTimestamp}px`

      this.jobsDOMModel.push(rangeDiv)
    }
  }

  static composeFrom (model) {
    return new JobsDOMComposer(model)
  }
}

export { JobsDOMComposer }

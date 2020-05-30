import { JobColorGenerator } from './JobColorGenerator.js'

class JobsDOMComposer {
  constructor (model) {
    this.jobsDOMModel = []
    this.jobModel = model

    // const { job, rangeCounter } = this.domComposer.jobModel.jobRanges[key]
    //   const { beginTimeStamp, endTimeStamp } = this.domComposer.jobModel.jobRegords.get(job).ranges[rangeCounter]
    // need to change this.jobsDOMModel.push(rangeDiv)
    for (const [key, { name, ranges }] of model.jobRecords.entries()) {
      for (let i = 0; i < ranges.length; i++) {
        const { beginTimestamp, endTimestamp, processorId } = ranges[i]

        const rangeDiv = document.createElement('div')

        rangeDiv.classList.add(`processor-${processorId}`)
        rangeDiv.classList.add(`job-${key}`)
        rangeDiv.classList.add('range')
        rangeDiv.classList.add(`range-${i}`)
        rangeDiv.textContent = name
        rangeDiv.style.left = `${beginTimestamp}px`
        rangeDiv.style.width = `${endTimestamp - beginTimestamp}px`

        this.jobsDOMModel.push(rangeDiv)
      }
    }
  }

  static composeFrom (model) {
    return new JobsDOMComposer(model)
  }
}

export { JobsDOMComposer }

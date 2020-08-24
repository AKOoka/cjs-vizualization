import { JobsComposer, rgbToString } from './JobsComposer.js'

class JobsDomComposer extends JobsComposer {
  createJobsModelRange (jobId, rangeCounter, jobName, jobTimeSpan, color) {
    const range = document.createElement('div')

    range.classList.add(`job-${jobId}`)
    range.classList.add('range')
    range.classList.add(`range-${rangeCounter}`)
    range.textContent = jobName
    range.title = `job name: ${jobName}\njob time span: ${jobTimeSpan}`
    range.style.backgroundColor = `rgb(${rgbToString(color)})`

    return range
  }

  createModel (model) {
    const jobColors = this.generateColorsByModel(model)

    this.jobsModel = []

    for (const { job, rangeCounter } of model.jobRanges.values()) {
      const { name: jobName, ranges, meta } = model.jobRecords.get(job)
      const { processorId } = ranges[rangeCounter]

      const range = this.createJobsModelRange(
        job,
        rangeCounter,
        jobName,
        meta.timeSpan.convertTime(),
        jobColors.get(jobName)
      )

      this.jobsModel.push({ processorId, range })
    }
  }
}

export { JobsDomComposer }

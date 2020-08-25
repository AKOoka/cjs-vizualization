import { JobsBuilder } from './JobsBuilder.js'

class JobsDomBuilder extends JobsBuilder {
  _createJobsModelRange (jobId, rangeCounter, jobName, jobTimeSpan, color) {
    const range = document.createElement('div')

    range.classList.add(`job-${jobId}`)
    range.classList.add('range')
    range.classList.add(`range-${rangeCounter}`)
    range.textContent = jobName
    range.title = `job name: ${jobName}\njob time span: ${jobTimeSpan}`
    range.style.backgroundColor = `rgb(${color.hsvToRgbString()})`

    return range
  }

  _createProcessor () {
    const processor = document.createElement('div')

    processor.classList.add('processor')

    return processor
  }

  _appendRangeToProcessor (range, processorId) {
    const processor = this._processors.get(processorId)

    if (processor) {
      processor.append(range)
    } else {
      const newProcessor = this._createProcessor()

      newProcessor.append(range)

      this._processors.set(processorId, newProcessor)
    }
  }

  createModel (model) {
    const jobColors = this._generateColorsByModel(model)

    this._jobsModel = []
    this._processors = new Map()

    for (const { job, rangeCounter } of model.jobRanges.values()) {
      const { name: jobName, ranges, meta } = model.jobRecords.get(job)
      const { processorId } = ranges[rangeCounter]

      const range = this._createJobsModelRange(
        job,
        rangeCounter,
        jobName,
        meta.timeSpan.convertTime(),
        jobColors.get(jobName)
      )

      this._appendRangeToProcessor(range, processorId)

      this._jobsModel.push({ processorId, range })
    }
  }
}

export { JobsDomBuilder }

import { Color } from './Color'
import { JobsBuilder } from './Jobsbuilder'

class JobsDomBuilder extends JobsBuilder {
  private _createJobsModelRange (jobId: number, rangeCounter: number, jobName: string, jobTimeSpan: number, color: Color): HTMLDivElement {
    const range = document.createElement('div')

    range.classList.add(`job-${jobId}`)
    range.classList.add('range')
    range.classList.add(`range-${rangeCounter}`)
    range.textContent = jobName
    range.title = `job name: ${jobName}\njob time span: ${jobTimeSpan}`
    range.style.backgroundColor = `rgb(${color.hsvToRgbString()})`

    return range
  }

  private _createProcessor (): HTMLDivElement {
    const processor: HTMLDivElement = document.createElement('div')

    processor.classList.add('processor')

    return processor
  }

  private _appendRangeToProcessor (range: HTMLDivElement, processorId: number): void {
    const processor = this._processors.get(processorId)

    if (processor !== undefined) {
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

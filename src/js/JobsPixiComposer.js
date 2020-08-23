import { JobsComposer } from './JobsComposer.js'

class JobsPixiComposer extends JobsComposer {
  constructor () {
    super()

    this.jobRangesInfo = new Map()
    this.processor = new Map()
  }

  createJobsModelRange (jobId, beginTimestamp, endTimestamp, processorId) {
    const rangeWidth = endTimestamp - beginTimestamp
    const range = {
      x: beginTimestamp,
      width: rangeWidth,
      jobId,
      processorId
    }

    return range
  }

  createModel (model) {
    // generateColorsByModel maybe use in parsing or somewhere else!

    const jobColors = this.generateColorsByModel(model)
    const uniqueProcessorIds = new Set()

    this.jobsModel = []

    for (const { job, rangeCounter } of model.jobRanges.values()) {
      const { name: jobName, ranges, meta } = model.jobRecords.get(job)
      const { beginTimestamp, endTimestamp, processorId } = ranges[rangeCounter]

      if (!this.jobRangesInfo.has(job)) {
        this.jobRangesInfo.set(job, {
          color: jobColors.get(jobName),
          jobName,
          jobTimeSpan: meta.timeSpan.convertTime()
        })
      }

      const range = this.createJobsModelRange(job, beginTimestamp, endTimestamp, processorId)

      this.jobsModel.push(range)

      uniqueProcessorIds.add(processorId)
    }

    const sortedUniqueProcessorIds = [...uniqueProcessorIds.values()].sort()

    sortedUniqueProcessorIds.forEach((processorId, index) => {
      this.processor.set(processorId, index * 28)
    })
  }
}

export { JobsPixiComposer }

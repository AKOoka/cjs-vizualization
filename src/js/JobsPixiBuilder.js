import { JobsBuilder } from './JobsBuilder.js'

class JobsPixiBuilder extends JobsBuilder {
  createModel (model) {
    const uniqueProcessorIds = new Set()

    this._jobsModel = this._generateColorsByModel(model)
    this._processors = new Map()

    for (const { job, rangeCounter } of model.jobRanges.values()) {
      const { processorId } = model.jobRecords.get(job).ranges[rangeCounter]

      uniqueProcessorIds.add(processorId)
    }

    const sortedProcessorsIds = [...uniqueProcessorIds.values()].sort()

    for (let i = 0; i < sortedProcessorsIds.length; i++) {
      this._processors.set(sortedProcessorsIds[i], i * 28 + 4)
    }

    console.log('pixiBuilder model', this._jobsModel)
    console.log('pixiBuilder processors', this._processors)
  }
}

export { JobsPixiBuilder }

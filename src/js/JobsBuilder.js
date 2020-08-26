import { Color } from './Color.js'

class JobsBuilder {
  constructor () {
    this._jobsModel = null
    this._processors = null
  }

  get jobsModel () {
    return this._jobsModel
  }

  get processors () {
    return this._processors
  }

  _generateColorsByModel (model) {
    // make generation maps key jobId not jobName
    const jobNames = new Set()
    const jobColors = new Map()

    for (const { name } of model.jobRecords.values()) {
      jobNames.add(name)
    }

    const sortedJobNames = [...jobNames.values()]
    const hueStep = 120 / sortedJobNames.length * 4

    let saturation = 60
    let value = 75

    for (let i = 0; i < sortedJobNames.length; i++) {
      const hue = i * hueStep

      if (hue > 360) {
        if (saturation === 60) {
          saturation = 100
        } else if (value === 75) {
          value = 100
        } else {
          value = 100
          saturation = 60
        }
      }

      jobColors.set(sortedJobNames[i], new Color({ hue, saturation, value }))
    }

    return jobColors
  }

  createModel (model) {}
}

export { JobsBuilder }

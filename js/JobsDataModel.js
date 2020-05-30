class JobsDataModel {
  constructor (meta, jobRanges, jobRecords, spawnedJobs, atomicCounterRecords) {
    this.meta = meta
    this.jobRanges = jobRanges
    this.jobRecords = jobRecords
    this.spawnedJobs = spawnedJobs
    this.atomicCounterRecords = atomicCounterRecords
  }

  static fromParseData (data) {
    return new JobsDataModel(
      data.meta,
      data.processorsMap,
      data.jobsMap,
      data.spawnedJobsMap,
      data.atomicCountersMap
    )
  }
}

export { JobsDataModel }

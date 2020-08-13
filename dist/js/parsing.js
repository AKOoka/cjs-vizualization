function readJobRegProfileData (storage, data) {
  data.forEach(({ jobId, name }) => {
    storage.set(jobId, { name, ranges: [] })
  })
}

function readRangeData (jobRecords, jobRanges, data) {
  const openRange = new Set()

  // it should be sorted before going through

  data.forEach(({ job, processorId, timestamp }) => {
    const jobRecordsRanges = jobRecords.get(job).ranges
    const rangeCounter = jobRecordsRanges.length

    if (openRange.has(job)) {
      jobRecordsRanges[rangeCounter - 1].endTimestamp = timestamp

      openRange.delete(job)

      return
    }

    jobRanges.push({ job, rangeCounter })

    jobRecordsRanges.push({ beginTimestamp: timestamp, processorId })

    openRange.add(job)
  })
}

function readJobSpawnsData (storage, data) {
  data.forEach(({ ac, jobs, spawnerJob, timestamp }) => {
    const spawner = storage.get(spawnerJob)
    const spawnEvent = { ac, jobs, timestamp }

    if (!spawner) {
      storage.set(spawnerJob, [spawnEvent])
    } else {
      spawner.push(spawnEvent)
    }
  })
}

function readAtomicCounterData (storage, data) {
  data.forEach(({ acId, job, timestamp, value }) => {
    const ac = storage.get(acId)

    if (!ac) {
      storage.set(acId, {
        created: { job, timestamp, value },
        changing: []
      })
    } else {
      ac.changing.push({ job, timestamp, value })
    }
  })
}

function parseData ({
  atomicCounterEventsProfileData,
  jobRegProfileData,
  jobSpawnsProfileData,
  rangeBeginEndEventProfileData
}) {
  const meta = {
    startTime: rangeBeginEndEventProfileData[0].timestamp,
    endTime: rangeBeginEndEventProfileData[rangeBeginEndEventProfileData.length - 1].timestamp,
    timeSpan: rangeBeginEndEventProfileData[rangeBeginEndEventProfileData.length - 1].timestamp - rangeBeginEndEventProfileData[0].timestamp
  }
  const jobRanges = []
  const jobRecords = new Map()
  const spawnedJobs = new Map()
  const atomicCounterRecords = new Map()

  readJobRegProfileData(jobRecords, jobRegProfileData)
  readRangeData(jobRecords, jobRanges, rangeBeginEndEventProfileData)
  readJobSpawnsData(spawnedJobs, jobSpawnsProfileData)
  readAtomicCounterData(atomicCounterRecords, atomicCounterEventsProfileData)

  return {
    meta,
    jobRanges,
    jobRecords,
    spawnedJobs,
    atomicCounterRecords
  }
}

export { parseData }

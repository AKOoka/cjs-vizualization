function toStringObject (obj) {
  let outputString = '\n{\n'

  Object.entries(obj).forEach(([key, value]) => {
    outputString += `\t${key}: ${value}\n`
  })

  outputString += '}\n'

  return outputString
}

function readJobRegProfileData (storage, data) {
  data.forEach(({ jobId, name }) => {
    storage.set(jobId, { name, ranges: [] })
  })
}

function readRangeData (storage, data) {
  const sortedData = data.sort((a, b) => a.processorId - b.processorId)

  for (let i = 0; i < sortedData.length / 2; i += 2) {
    const cur = sortedData[i]
    const next = sortedData[i + 1]

    if (cur.job === next.job) {
      storage.get(cur.job).ranges.push({
        processorId: cur.processorId,
        beginTimestamp: cur.timestamp,
        endTimestamp: next.timestamp
      })
    } else {
      alert ('Different jobIds for one range')

      // log names of jobs instead of current and next
      throw new Error(`\n current: ${toStringObject(cur)};\n next: ${toStringObject(next)};`)
    }
  }
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
  const jobsMap = new Map()
  const spawnedJobsMap = new Map()
  const atomicCountersMap = new Map()

  readJobRegProfileData(jobsMap, jobRegProfileData)
  readRangeData(jobsMap, rangeBeginEndEventProfileData)
  readJobSpawnsData(spawnedJobsMap, jobSpawnsProfileData)
  readAtomicCounterData(atomicCountersMap, atomicCounterEventsProfileData)

  return {
    jobsMap,
    spawnedJobsMap,
    atomicCountersMap
  }
}

export { parseData }

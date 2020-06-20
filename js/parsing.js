// function toStringObject (obj) {
//   let outputString = '\n{\n'

//   Object.entries(obj).forEach(([key, value]) => {
//     outputString += `\t${key}: ${value}\n`
//   })

//   outputString += '}\n'

//   return outputString
// }

function readJobRegProfileData (storage, data) {
  data.forEach(({ jobId, name }) => {
    const n = name[0].toUpperCase() + name.slice(1)

    storage.set(jobId, { name: n, ranges: [] })
  })
}

function readRangeData (jobsMap, processorsMap, data) {
  const openRange = new Set()

  // it should be sorted before going through

  data.forEach(({ job, processorId, timestamp }) => {
    const jobRanges = jobsMap.get(job).ranges
    const rangeCounter = jobRanges.length

    if (openRange.has(job)) {
      jobRanges[rangeCounter - 1].endTimestamp = timestamp

      openRange.delete(job)

      return
    }

    // const processor = processorsMap.get(processorId)
    // const processorRange = { job, rangeCounter }

    // if (!processor) {
    //   processorsMap.set(processorId, [processorRange])
    // } else {
    //   processor.push(processorRange)
    // }

    processorsMap.push({ job, rangeCounter })

    jobRanges.push({ beginTimestamp: timestamp, processorId })

    openRange.add(job)
  })

  // console.log(data)
  // const sortedData = data.sort((a, b) => a.processorId - b.processorId)
  // console.log(sortedData)

  // for (let i = 0; i < data.length / 2; i += 2) {
  //   const cur = data[i]
  //   const next = data[i + 1]

  //   if (cur.job === next.job) {
  //     const processorRange = {
  //       jobId: cur.job
  //     }

  //     const processor = processorsMap.get(cur.processorId)

  //     if (!processor) {
  //       processorRange.rangeCounter = 0

  //       processorsMap.set(cur.processorId, [processorRange])
  //     } else {
  //       processorRange.rangeCounter = processor.length

  //       processor.push(processorRange)
  //     }

  //     jobsMap.get(cur.job).ranges.push({
  //       beginTimestamp: cur.timestamp,
  //       endTimestamp: next.timestamp
  //     })
  //   } else {
  //     alert ('Different jobIds for one range')

  //     throw new Error(`\n ${jobsMap.get(cur.job).name}: ${toStringObject(cur)};\n ${jobsMap.get(next.job).name}: ${toStringObject(next)};`)
  //   }
  // }
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
    timeUnit: 'ms'
  }
  const processorsMap = []
  const jobsMap = new Map()
  const spawnedJobsMap = new Map()
  const atomicCountersMap = new Map()

  readJobRegProfileData(jobsMap, jobRegProfileData)
  readRangeData(jobsMap, processorsMap, rangeBeginEndEventProfileData)
  readJobSpawnsData(spawnedJobsMap, jobSpawnsProfileData)
  readAtomicCounterData(atomicCountersMap, atomicCounterEventsProfileData)

  return {
    meta,
    processorsMap,
    jobsMap,
    spawnedJobsMap,
    atomicCountersMap
  }
}

export { parseData }

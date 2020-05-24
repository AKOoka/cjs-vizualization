function createSpawnedJobs (jobsMap, jobIds, spawnTimeStamp) {
  const spawnedJobs = []

  jobIds.forEach(job => {
    spawnedJobs.push({ jobId: job, spawnTimeStamp, ranges: jobsMap.get(job) })
  })

  return spawnedJobs
}

function createAC (jobsMap, creatorJobId, spawnTimeStamp, jobIds) {
  const ac = {
    created: {
      jobId: creatorJobId,
      value: jobIds.length,
      spawnTimeStamp
    },
    changing: {
      jobIds,
      endTimeOfSpawnedJob: []
    }
  }

  jobIds.forEach(id => {
    const j = jobsMap.get(id)

    ac.changing.endTimeOfSpawnedJob.push(j[j.length - 1].endTimestamp)
  })

  return ac
}

function createACWaiting (rangeCounter, awaitedTimeStamp) {
  return {
    jobRanges: `range${rangeCounter}`,
    awaitedTimeStamp
  }
}

class ProfilingDataModel {
    constructor() {
        const processorsMap = new Map()
        const jobsMap = new Map()
        const spawnedJobsMap = new Map()
        const atomicCountersMap = new Map()
    }

    getSpawnedRanges(jobId) {

    }

    getAllRanges(jobId) {

    }

    getAllJobsAllProcessors() {

    }

}

function parseData({
    atomicCounterEventsProfileData,
    jobRegProfileData,
    jobSpawnsProfileData,
    samplesPerProcessor
}) {
  const processorsMap = new Map()
  const jobsMap = new Map()
  const spawnedJobsMap = new Map()
  const atomicCountersMap = new Map()

    const samplesPerProcessor = new Map()
    


    for (let i = 0; i < 8; i++) {
        processorsMap.set(i, [])
    }
    let j = 0;
    for (var i = 0; i < samplesPerProcessor.size / 2; i += 2) {
        let current = samplesPerProcessor[i]
        let next = samplesPerProcessor[i + 1]
        //{ jobId, jobName: name, rangeCount: i, beginTimestamp, endTimestamp }
        processorsMap.get(current.processorId).push(samplesPerProcessor[i].timestamp
    }

    
  //for (let i = 0; i < meta.processorsCount; i++) {
  //  processorsMap.set(i, [])
  //}



  

    

  jobProfile.forEach(({ jobId, computeTimeRanges, name }) => {
    const jobRanges = []

    for (let i = 0; i < computeTimeRanges.length; i++) {
      const { beginTimestamp, endTimestamp, processorId } = computeTimeRanges[i]

      const processor = processorsMap.get(processorId)

      processor.push({ jobId, jobName: name, rangeCount: i, beginTimestamp, endTimestamp })

      jobRanges.push({ beginTimestamp, endTimestamp })
    }

    jobsMap.set(jobId, jobRanges)
  })

  jobProfile.forEach(({ jobId, computeTimeRanges, jobSpawns, awaitedACs }) => {
    jobSpawns.forEach(({ jobIds, spawnTimeStamp, acId }) => {
      const spawnerJob = spawnedJobsMap.get(jobId)

      if (spawnerJob) {
        jobIds.forEach(job => {
          spawnerJob.push({ jobId: job, spawnTimeStamp })
        })
      } else {
        spawnedJobsMap.set(jobId, createSpawnedJobs(jobsMap, jobIds, spawnTimeStamp))
      }

      atomicCountersMap.set(acId, createAC(jobsMap, jobId, spawnTimeStamp, jobIds))
    })

    for (let i = 0; i < awaitedACs.length; i++) {
      const ac = atomicCountersMap.get(awaitedACs[i].acId)

      ac.waiting = createACWaiting(i, awaitedACs[i].awaitedTimeStamp)
    }
  })

  return {
    processorsMap,
    jobsMap,
    spawnedJobsMap,
    atomicCountersMap
  }
}

export { parseData }

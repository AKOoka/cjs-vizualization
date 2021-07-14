import { Time } from './Time.js'

export class Parser {
  readJobRegProfileData (jobRecords, data) {
    data.forEach(({ jobId, name }) => {
      jobRecords.set(jobId, {
        name,
        ranges: [],
        meta: {
          timeSpan: new Time(0)
        }
      })
    })
  }

  readRangeData (jobRecords, jobRanges, data) {
    const openRange = new Set()

    // it should be sorted before going through

    data.forEach(({ job, processorId, timestamp }) => {
      const jobRecord = jobRecords.get(job)
      const rangeCounter = jobRecord.ranges.length

      if (openRange.has(job)) {
        const range = jobRecord.ranges[rangeCounter - 1]

        range.endTimestamp = timestamp

        jobRecord.meta.timeSpan.addTime(range.endTimestamp - range.beginTimestamp)

        openRange.delete(job)

        return
      }

      jobRanges.push({ job, rangeCounter })

      jobRecord.ranges.push({ beginTimestamp: timestamp, processorId })

      openRange.add(job)
    })
  }

  readJobSpawnsData (storage, data) {
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

  readAtomicCounterData (storage, data) {
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

  parseData ({
    atomicCounterEventsProfileData,
    jobRegProfileData,
    jobSpawnsProfileData,
    rangeBeginEndEventProfileData
  }) {
    const meta = {
      startTime: new Time(rangeBeginEndEventProfileData[0].timestamp),
      endTime: new Time(rangeBeginEndEventProfileData[rangeBeginEndEventProfileData.length - 1].timestamp),
      timeSpan: new Time(rangeBeginEndEventProfileData[rangeBeginEndEventProfileData.length - 1].timestamp - rangeBeginEndEventProfileData[0].timestamp)
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
}

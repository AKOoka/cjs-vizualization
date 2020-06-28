class JobsDOMComposer {
  constructor () {
    this.jobsDOMModel = null
  }

  generateColorsByModel (model) {
    const jobColors = new Map()
    const hStep = 360 / model.jobRecords.size
    const sStep = 75 / model.jobRecords.size
    const lStep = 50 / model.jobRecords.size

    let i = 0

    const jobs = [...model.jobRecords.keys()]

    while (jobs.length > 0) {
      const jobIndex = Math.floor(Math.random() * jobs.length)
      const jobId = jobs[jobIndex]

      jobColors.set(jobId, `${hStep * i}, ${sStep * i + 25}%, ${lStep * i + 25}%`)

      jobs.splice(jobIndex, 1)

      i++
    }

    return jobColors
  }

  createDOMModel (model) {
    const jobColors = this.generateColorsByModel(model)

    this.jobsDOMModel = []

    for (const { job, rangeCounter } of model.jobRanges.values()) {
      const { name, ranges } = model.jobRecords.get(job)
      const { beginTimestamp, endTimestamp, processorId } = ranges[rangeCounter]

      const rangeDiv = document.createElement('div')
      // const rangeText = document.createElement('span')
      const rangeWidth = endTimestamp - beginTimestamp

      rangeDiv.textContent = name

      rangeDiv.classList.add(`processor-${processorId}`)
      rangeDiv.classList.add(`job-${job}`)
      rangeDiv.classList.add('range')
      rangeDiv.classList.add(`range-${rangeCounter}`)
      rangeDiv.title = name
      rangeDiv.style.left = `${beginTimestamp}px`
      rangeDiv.style.width = `${rangeWidth}px`
      rangeDiv.style.backgroundColor = `hsl(${jobColors.get(job)})`

      if (rangeWidth <= 40) {
        rangeDiv.classList.add('hiddeText')
      }

      // rangeDiv.append(rangeText)

      this.jobsDOMModel.push(rangeDiv)
    }
  }
}

export { JobsDOMComposer }

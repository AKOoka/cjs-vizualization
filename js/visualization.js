function createProcessorDiv (id) {
  const processor = document.createElement('div')

  processor.classList.add('processor-line')
  processor.id = `processor-${id}`

  return processor
}

function randomColor (range, itemInRange) {

}

function binarySearch (jobsRange, number, range) {
  const length = range.length - 1

  let index = Math.round(length / 2)
  let step = index / 2

  while (true) {
    const { job, rangeCounter } = range[index]
    const { beginTimestamp, endTimestamp } = jobsRange.get(job).ranges[rangeCounter]

    if (number >= beginTimestamp && number <= endTimestamp) {
      return index
    } else if (number < beginTimestamp) {
      index = Math.floor(index - step)
    } else {
      index = Math.round(index + step)
    }

    step /= 2

    if (index < 0 || index > range.length - 1) {
      return false
    }
  }
}

function getGraphZoom (jobsRange, processorsMap, sliderStart, sliderEnd, sliderWidth) {
  const processorsMapIndexes = []

  processorsMap.forEach(processor => {
    const startIndex = binarySearch(jobsRange, sliderStart, processor)
    const endIndex = binarySearch(jobsRange, sliderEnd, processor)

    if (startIndex && endIndex) {
      processorsMapIndexes.push({ startIndex, endIndex })
    } else {
      processorsMapIndexes.push(null)
    }
  })

  return processorsMapIndexes
}

function createSmallRangeView (jobId, rangeCounter, beginTimestamp, rangeWidth) {
  const rangeDiv = document.createElement('div')

  rangeDiv.classList.add(`job#${jobId}`)
  rangeDiv.classList.add('range')
  rangeDiv.classList.add(`range${rangeCounter}`)
  rangeDiv.style.left = `${beginTimestamp}px`
  rangeDiv.style.width = `${rangeWidth}px`

  return rangeDiv
}

function createMediumRangeView (jobId, rangeCounter, beginTimestamp, rangeWidth, name) {
  const rangeDiv = document.createElement('div')

  rangeDiv.classList.add(`job#${jobId}`)
  rangeDiv.classList.add('range')
  rangeDiv.classList.add(`range${rangeCounter}`)
  rangeDiv.textContent = name
  rangeDiv.style.left = `${beginTimestamp}px`
  rangeDiv.style.width = `${rangeWidth}px`

  return rangeDiv
}

function drawSliderBackground (sliderBackgroundDiv, processorsMap, jobsMap) {
  processorsMap.forEach(processor => {
    const sliderProcessorDiv = document.createElement('div')

    sliderProcessorDiv.classList.add('slider-processor')

    processor.forEach(({ job, rangeCounter }) => {
      const { beginTimestamp, endTimestamp } = jobsMap.get(job).ranges[rangeCounter]

      sliderProcessorDiv.append(createSmallRangeView(job, rangeCounter, beginTimestamp, endTimestamp - beginTimestamp))
    })

    sliderBackgroundDiv.append(sliderProcessorDiv)
  })
}

function drawGraph (graphContainer, graphZoom, processorsMap, jobsMap) {
  let processorsCounter = 0

  for (const [key, value] of processorsMap.entries()) {
    if (!graphZoom[processorsCounter]) {
      continue
    }

    const processorDiv = graphContainer.querySelector(`#processor-${key}`)

    const { startIndex, endIndex } = graphZoom[processorsCounter]

    for (let i = startIndex; i <= endIndex; i++) {
      const { jobId, rangeCounter } = value[i]
      const { name, ranges } = jobsMap.get(jobId)
      const { beginTimestamp, endTimestamp } = ranges[rangeCounter]

      const rangeWidth = endTimestamp - beginTimestamp

      let rangeView = null

      if (rangeWidth < 1) {
        rangeView = createSmallRangeView(jobId, rangeCounter, beginTimestamp, rangeWidth)
      } else {
        rangeView = createMediumRangeView(jobId, rangeCounter, beginTimestamp, rangeWidth, name)
      }

      processorDiv.append(rangeView)
    }

    processorsCounter++
  }
}

export { drawSliderBackground, getGraphZoom, drawGraph, createProcessorDiv, binarySearch }

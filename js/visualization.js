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

  for (let i = 0; i < 100; i++) {
    const { job, rangeCounter } = range[index]
    const { beginTimestamp, endTimestamp } = jobsRange.get(job).ranges[rangeCounter]

    if (number >= beginTimestamp && number <= endTimestamp) {
      return index
    } else if (number < beginTimestamp) {
      index = Math.floor(index / 2)
    } else {
      index = Math.round(index + index / 2)
    }

    if (index < 0 || index > range.length - 1) {
      return false
    }
  }
}

function getGraphZoom (sliderStart, sliderEnd, sliderWidth, processorsMap) {
  const processorsMapIndexes = []

  processorsMap.forEach(processor => {
    const startIndex = binarySearch(sliderStart, processor)
    const endIndex = binarySearch(sliderEnd, processor)

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

function drawSliderBackground (sliderBackgroundDiv, jobsMap, processorsMap) {
  processorsMap.forEach(processor => {
    const sliderProcessorDiv = document.createElement('div')

    sliderProcessorDiv.classList.add('slider-processor')

    processor.forEach(({ jobId, rangeCounter }) => {
      const { beginTimestamp, endTimestamp } = jobsMap.get(jobId).ranges[rangeCounter]

      sliderProcessorDiv.append(createSmallRangeView(jobId, rangeCounter, beginTimestamp, endTimestamp - beginTimestamp))
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

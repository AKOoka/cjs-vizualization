function createProcessorDiv (id) {
  const processor = document.createElement('div')

  processor.classList.add('processor-line')
  processor.id = `processor-${id}`

  return processor
}

function randomColor (range, itemInRange) {

}

function getProcessorsMapWidth (processorsMap) {
  let min = processorsMap.get(0)[0].beginTimestamp
  let max = min

  processorsMap.forEach(processor => {
    processor.forEach(({ beginTimestamp, endTimestamp }) => {
      if (beginTimestamp < min) {
        min = beginTimestamp
      }
      if (endTimestamp > max) {
        max = endTimestamp
      }
    })
  })

  return max - min
}

function binarySearch (number, range, rangeProp) {
  const length = range.length - 1

  let index = Math.round(length / 2)

  for (let i = 0; i < 100; i++) {
    const curNum = range[index][rangeProp]

    if (curNum > number) {
      index = Math.floor(index / 2)
    } else if (curNum < number) {
      index = Math.round(index + index / 2)
    } else {
      return index
    }

    const prevNum = range[index - 1]
    const nextNum = range[index + 1]

    if (index <= 0) {
      return 0
    } else if (index > length) {
      return length
    } else if (nextNum && curNum < number && nextNum[rangeProp] > number) {
      return index
    } else if (prevNum && curNum > number && prevNum[rangeProp] < number) {
      return index - 1
    }
  }
}

function getGraphViewRange (sliderStart, sliderEnd, sliderWidth, processorsMap) {
  const processorsMapIndexes = []

  processorsMap.forEach(processor => {
    if (sliderStart < processor[0].beginTimestamp && sliderEnd < processor[processor.length - 1].beginTimestamp) {
      processorsMapIndexes.push(null)
      return
    } else if (sliderStart > processor[processor.length - 1].endTimestamp && sliderEnd > processor[processor.length - 1].endTimestamp) {
      processorsMapIndexes.push(null)
      return
    }

    const startIndex = binarySearch(sliderStart, processor, 'beginTimestamp')
    const endIndex = binarySearch(sliderEnd, processor, 'endTimestamp')

    processorsMapIndexes.push({ startIndex, endIndex })
  })

  return processorsMapIndexes
}

function createSmallRangeView (jobId, rangeCount, beginTimestamp, rangeWidth) {
  const rangeDiv = document.createElement('div')

  rangeDiv.classList.add(`job#${jobId}`)
  rangeDiv.classList.add('range')
  rangeDiv.classList.add(`range${rangeCount}`)
  rangeDiv.style.left = `${beginTimestamp}px`
  rangeDiv.style.width = `${rangeWidth}px`

  return rangeDiv
}

function createMediumRangeView (jobId, jobName, rangeCount, beginTimestamp, rangeWidth) {
  const rangeDiv = document.createElement('div')

  rangeDiv.classList.add(`job#${jobId}`)
  rangeDiv.classList.add('range')
  rangeDiv.classList.add(`range${rangeCount}`)
  rangeDiv.textContent = jobName
  rangeDiv.style.left = `${beginTimestamp}px`
  rangeDiv.style.width = `${rangeWidth}px`

  return rangeDiv
}

function drawSliderBackground (sliderBackgroundDiv, processorsMap) {
  processorsMap.forEach(processor => {
    const sliderProcessorDiv = document.createElement('div')

    sliderProcessorDiv.classList.add('slider-processor')

    processor.forEach(range => {
      const { jobId, rangeCount, beginTimestamp, endTimestamp } = range
      sliderProcessorDiv.append(createSmallRangeView(jobId, rangeCount, beginTimestamp, endTimestamp - beginTimestamp))
    })

    sliderBackgroundDiv.append(sliderProcessorDiv)
  })
}

function drawGraph (graph, processorsMap, processorsMapRange) {
  let processorsCounter = 0

  processorsMap.forEach(processor => {
    if (!processorsMapRange[processorsCounter]) {
      return
    }

    const processorDiv = graph.querySelector(`#processor-${processorsCounter}`)

    const { startIndex, endIndex } = processorsMapRange[processorsCounter]

    for (let i = startIndex; i <= endIndex; i++) {
      const { jobId, jobName, rangeCount, beginTimestamp, endTimestamp } = processor[i]

      const rangeWidth = endTimestamp - beginTimestamp

      let rangeView = null

      if (rangeWidth < 1) {
        rangeView = createSmallRangeView(jobId, rangeCount, beginTimestamp, rangeWidth)
      } else {
        rangeView = createMediumRangeView(jobId, jobName, rangeCount, beginTimestamp, rangeWidth)
      }

      processorDiv.append(rangeView)
    }

    processorsCounter++
  })
}

export { drawSliderBackground, getGraphViewRange, drawGraph, getProcessorsMapWidth, createProcessorDiv }

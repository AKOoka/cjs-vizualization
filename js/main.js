import { parseData } from './parsing.js'
import { sliderEventListeners, Slider, SliderChangeIntreface } from './slider.js'
import { drawSliderBackground, getGraphZoom, drawGraph, createProcessorDiv, binarySearch } from './visualization.js'

// function generateData (processorsCount, size) {
//   const data = {
//     meta: {
//       processorsCount: size
//     },
//     jobProfile: []
//   }

//   for (let i = 0; i < size; i++) {
//     data.jobProfile.push({
//       awaitedACs: {},
//       computeTimeRanges: [
//         {
//           beginTimestamp: i * 3,
//           endTimestamp: (i + 3) * 3,
//           processorId: Math.floor(Math.random() * processorsCount + 1)
//         },
//         {
//           beginTimestamp: (i + 4) * 3,
//           endTimestamp: (i + 5) * 3,
//           processorId: Math.floor(Math.random() * processorsCount + 1)
//         }
//       ],
//       jobId: i,
//       jobSpawns: [],
//       name: `job #${i}`
//     })
//   }

//   return data
// }

// const userData = generateData(6, 2000)
// console.log(userData)

// ;(function changeStyle () {
//   const styles = document.getElementById('range-styles')
//   console.log(styles)
// })()

function logUserData ({ meta, processorsMap, jobsMap, spawnedJobsMap, atomicCountersMap }) {
  console.log('-----meta-----')
  console.log(meta)
  console.log('----------')
  console.log('-----processorsMap-----')
  console.log(processorsMap)
  console.log('----------')
  console.log('-----jobsMap-----')
  console.log(jobsMap)
  console.log('----------')
  console.log('-----spawnedJobsMap-----')
  console.log(spawnedJobsMap)
  console.log('----------')
  console.log('-----atomicCountersMap-----')
  console.log(atomicCountersMap)
  console.log('----------')
}

const graphContainer = document.getElementById('graph')
const sliderContainer = document.getElementById('slider')

let userData = {
  meta: null,
  processorsMap: null,
  jobsMap: null,
  spawnedJobsMap: null,
  atomicCountersMap: null
}

let slider = null
let graphWidth = null

function initSlider (graphContainer, sliderContainer, sliderEventListeners) {
  const sl = new Slider(graphContainer.offsetWidth, 5, 1.5, 0, sliderContainer.offsetWidth)

  Slider.createSliderDOM(sliderContainer, sl, sliderEventListeners)

  const sliderChangeListener = new SliderChangeListener()

  sl.subscribe(sliderChangeListener)

  return sl
}

function scalePosition (position, sliderWidth, graphWidth) {
  return sliderWidth / graphWidth * position
}

function removeAllChildren (containerChildren) {
  while (containerChildren.length > 0) {
    containerChildren[0].remove()
  }
}

async function onFileInput (event) {
  const file = event.target.files[0]
  const text = await file.text()
  const json = await JSON.parse(text)

  console.time('parse')

  userData = parseData(json)

  const { meta, processorsMap } = userData

  graphWidth = meta.graphWidth

  logUserData(userData)

  slider = initSlider(graphContainer, sliderContainer, sliderEventListeners)

  const sliderBackground = sliderContainer.querySelector('#slider-background')

  removeAllChildren(sliderBackground.children)
  removeAllChildren(graphContainer.children)

  for (const key of processorsMap.keys()) {
    graphContainer.append(createProcessorDiv(key))
  }

  const sliderStart = scalePosition(slider.zoomStart, sliderContainer.offsetWidth, graphWidth)
  const sliderEnd = scalePosition(slider.zoomEnd, sliderContainer.offsetWidth, graphWidth)

  drawGraph(graphContainer, processorsMap, getGraphZoom(sliderStart, sliderEnd, sliderContainer.offsetWidth, processorsMap))
  drawSliderBackground(sliderBackground, processorsMap)

  console.timeEnd('parse')
}

class SliderChangeListener extends SliderChangeIntreface {
  update (zoomEvent) {
    super.update(zoomEvent)

    for (const processor of graphContainer.children) {
      processor.replaceWith(processor.cloneNode(false))
    }

    const sliderStart = scalePosition(slider.zoomStart, sliderContainer.offsetWidth, graphWidth)
    const sliderEnd = scalePosition(slider.zoomEnd, sliderContainer.offsetWidth, graphWidth)

    drawGraph(graphContainer, userData.processorsMap, getGraphZoom(sliderStart, sliderEnd, sliderContainer.offsetWidth, userData.processorsMap))
  }
}

document.querySelector('#user-json').onchange = onFileInput

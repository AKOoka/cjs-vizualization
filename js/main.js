import { parseData } from './parsing.js'
import { sliderEventListeners, Slider, SliderChangeIntreface } from './slider.js'
import { drawSliderBackground, getGraphViewRange, drawGraph, getProcessorsMapWidth, createProcessorDiv } from './visualization.js'

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

function logUserData ({ processorsMap, jobsMap, spawnedJobsMap, atomicCountersMap }) {
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

  graphWidth = getProcessorsMapWidth(userData.processorsMap)

  const sliderBackground = sliderContainer.querySelector('#slider-background')

  removeAllChildren(sliderBackground.children)
  removeAllChildren(graphContainer.children)

  for (let i = 0; i < json.meta.processorsCount; i++) {
    graphContainer.append(createProcessorDiv(i))
  }

  const sliderStart = scalePosition(slider.zoomStart, sliderContainer.offsetWidth, graphWidth)
  const sliderEnd = scalePosition(slider.zoomEnd, sliderContainer.offsetWidth, graphWidth)

  drawGraph(graphContainer, userData.processorsMap, getGraphViewRange(sliderStart, sliderEnd, sliderContainer.offsetWidth, userData.processorsMap))
  drawSliderBackground(sliderBackground, userData.processorsMap)

  logUserData(userData)

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

    drawGraph(graphContainer, userData.processorsMap, getGraphViewRange(sliderStart, sliderEnd, sliderContainer.offsetWidth, processorsMap))
  }
}

document.querySelector('#user-json').onchange = onFileInput

slider = initSlider(graphContainer, sliderContainer, sliderEventListeners)

const file = "C:/Users/anton/source/repos/GameEngineProject/ConcurrentJobSystem/samplePreFinaleRev3x64Debug.json"
const text = fetch(file).then((a) => a.text()).then((b) => JSON.parse(b));
userData = parseData(text)
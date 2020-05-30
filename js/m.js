import { parseData } from './parsing.js'
import { sliderEventListeners, Slider } from './Slider.js'
import { jobsPlotter } from './JobsPlotter.js'
import { drawSliderBackground, getGraphZoom, drawGraph, createProcessorDiv } from './visualization.js'

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

jobsPlotter.setContext(document.getElementById('graph'))

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

  const { meta, processorsMap, jobsMap } = userData

  graphWidth = meta.graphWidth

  logUserData(userData)

  slider = initSlider(graphContainer, sliderContainer, sliderEventListeners)

  const sliderBackground = sliderContainer.querySelector('#slider-background')

  removeAllChildren(sliderBackground.children)
  removeAllChildren(graphContainer.children)

  for (const key of processorsMap.keys()) {
    graphContainer.append(createProcessorDiv(key))
  }

  const sliderStart = scalePosition(slider.zoomStart, sliderContainer.offsetWidth, graphWidth) + meta.startingPoint
  const sliderEnd = scalePosition(slider.zoomEnd, sliderContainer.offsetWidth, graphWidth) + meta.startingPoint

  drawGraph(graphContainer, processorsMap, getGraphZoom(jobsMap, processorsMap, sliderStart, sliderEnd, sliderContainer.offsetWidth))
  drawSliderBackground(sliderBackground, processorsMap, jobsMap)

  console.timeEnd('parse')
}

document.querySelector('#user-json').onchange = onFileInput

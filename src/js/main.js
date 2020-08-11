import { parseData } from './parsing.js'
import { JobsDataModel } from './JobsDataModel.js'
import { jobsPlotter } from './JobsPlotter.js'
import { ViewRange } from './ViewRange.js'
import { Slider } from './Slider.js'
import { TimeLine } from './TimeLine.js'
import { MouseWheelController } from './MouseWheelController.js'

async function readJson (jsonFile) {
  const file = jsonFile
  const text = await file.text()
  const json = await JSON.parse(text)

  console.time('parse')

  viewRange.setRange(0, 1, null)

  // jobsDataModel isn't very usefull class
  model = JobsDataModel.fromParseData(parseData(json))

  jobsPlotter.setModel(model)
  jobsPlotter.updateRange()

  console.log(model)
}

function onJsonInput (event) {
  readJson(event.target.files[0])
}

function onJsonUpdate () {
  readJson(jsonInput.files[0])
}

const jsonInput = document.querySelector('#json-select')
const jsonUpdate = document.querySelector('#json-update')

const viewRange = new ViewRange()
const slider = new Slider(viewRange, 5, 0.15)
const mouseWheelController = new MouseWheelController(viewRange)
const timeLine = new TimeLine(viewRange)

let model = null

viewRange.subscribe(jobsPlotter)
viewRange.subscribe(slider)
viewRange.subscribe(mouseWheelController)
viewRange.subscribe(timeLine)

Slider.createSliderDOM(document.querySelector('#slider'), slider)

jobsPlotter.setTimeLine(timeLine)
jobsPlotter.setViewRange(viewRange)
jobsPlotter.setContext({
  domRoot: document.querySelector('#job-plotter'),
  plotterContainer: document.querySelector('#job-plotter-container'),
  processorLabelsDomContainer: document.querySelector('#processor-labels-container'),
  timeLineInfo: document.querySelector('#time-line-info'),
  timeLinesContainer: document.querySelector('#time-lines-container'),
  summaryTimeBar: document.querySelector('#summary-time-bar'),
  timeMarkersContainer: document.querySelector('#time-markers-container')
})

mouseWheelController.setContext(jobsPlotter.context)

jsonInput.onchange = onJsonInput
jsonUpdate.onclick = onJsonUpdate

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

  timeLine.setMeta(model.meta)

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

timeLine.setContext(document.querySelector('#time-line-container'))

Slider.createSliderDOM(document.querySelector('#slider'), slider)

jobsPlotter.setContext({
  domRoot: document.querySelector('#job-plotter'),
  plotterContainer: document.querySelector('#job-plotter-container'),
  processorLabelsDomContainer: document.querySelector('#processor-labels-container'),
  timeLineInfo: document.querySelector('#time-line-info')
})
jobsPlotter.setViewRange(viewRange)

mouseWheelController.setContext(jobsPlotter.context)

jsonInput.onchange = onJsonInput
jsonUpdate.onclick = onJsonUpdate

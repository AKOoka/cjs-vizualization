import { parseData } from './parsing.js'
import { JobsDataModel } from './JobsDataModel.js'
import { JobsDOMComposer } from './JobsDOMComposer.js'
import { jobsPlotter } from './JobsPlotter.js'
import { ViewRange } from './ViewRange.js'
import { Slider } from './Slider.js'
import { TimeLine } from './TimeLine.js'
import { MouseWheelController } from './MouseWheelController.js'

async function onJsonInput (event) {
  const file = event.target.files[0]
  const text = await file.text()
  const json = await JSON.parse(text)

  console.time('parse')

  model = JobsDataModel.fromParseData(parseData(json))

  jobsPlotter.setModel(model)
  jobsPlotter.setDOMComposer(new JobsDOMComposer(model))
  jobsPlotter.updateRange()

  timeLine.setMeta(model.meta)

  console.log(model)
}

function onJsonUpdate () {
  jsonInput.files[0].text().then(res => console.log(res))
}

const jsonInput = document.querySelector('#json-input')
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

timeLine.setContext(document.querySelector('#time-line'))

Slider.createSliderDOM(document.querySelector('#slider'), slider)

jobsPlotter.setContext({
  domRoot: document.querySelector('#job-plotter')
})
jobsPlotter.setViewRange(viewRange)

mouseWheelController.setContext(jobsPlotter.context)

jsonInput.onchange = onJsonInput
jsonUpdate.onclick = onJsonUpdate

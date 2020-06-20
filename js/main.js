import { parseData } from './parsing.js'
import { JobsDataModel } from './JobsDataModel.js'
import { JobsDOMComposer } from './JobsDOMComposer.js'
import { jobsPlotter } from './JobsPlotter.js'
import { ViewRange } from './ViewRange.js'
import { Slider } from './Slider.js'
import { MouseWheelController } from './MouseWheelController.js'

async function onFileInput (event) {
  const file = event.target.files[0]
  const text = await file.text()
  const json = await JSON.parse(text)

  console.time('parse')

  model = JobsDataModel.fromParseData(parseData(json))

  jobsPlotter.setModel(model)
  jobsPlotter.setDOMComposer(new JobsDOMComposer(model))
  jobsPlotter.updateRange()

  console.log(model)
}

let model = null

const viewRange = new ViewRange()
const slider = new Slider(viewRange, 5, 0.15)
const mouseWheelController = new MouseWheelController(viewRange)

viewRange.subscribe(jobsPlotter)
viewRange.subscribe(slider)
viewRange.subscribe(mouseWheelController)

Slider.createSliderDOM(document.querySelector('#slider'), slider)

jobsPlotter.setContext({
  domRoot: document.querySelector('#job-plotter')
})
jobsPlotter.setViewRange(viewRange)

mouseWheelController.setContext(jobsPlotter.context)

document.querySelector('#user-json').onchange = onFileInput

document.querySelector('#change-range').onclick = () => {
  const start = document.querySelector('#start-range').value
  const end = document.querySelector('#end-range').value

  jobsPlotter.updateRange({ start, end })
}

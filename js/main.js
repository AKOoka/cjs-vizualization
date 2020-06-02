import { parseData } from './parsing.js'
import { JobsDataModel } from './JobsDataModel.js'
import { JobsDOMComposer } from './JobsDOMComposer.js'
import { jobsPlotter } from './JobsPlotter.js'

let model = null

async function onFileInput (event) {
  const file = event.target.files[0]
  const text = await file.text()
  const json = await JSON.parse(text)

  console.time('parse')

  model = JobsDataModel.fromParseData(parseData(json))

  jobsPlotter.setModel(model)
  jobsPlotter.setDOMComposer(new JobsDOMComposer(model))

  console.log(model)
}

jobsPlotter.setContext({
  domRoot: document.querySelector('#jobPlotter'),
  styleData: document.querySelector('#range-styles')
})

document.querySelector('#user-json').onchange = onFileInput

document.querySelector('#test').onclick = () => { jobsPlotter.changeJobColor('green') }

document.querySelector('#change-range').onclick = () => {
  const start = document.querySelector('#start-range').value
  const end = document.querySelector('#end-range').value

  jobsPlotter.moveRangeTo({ start, end })
}

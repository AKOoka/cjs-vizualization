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

  jobsPlotter.setDOMComposer(JobsDOMComposer.composeFrom(model))

  console.log(model)
}

jobsPlotter.setContext({ domRoot: document.getElementById('graph') })

document.querySelector('#user-json').onchange = onFileInput

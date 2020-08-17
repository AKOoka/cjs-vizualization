import { MouseArea } from './MouseArea.js'
import { app } from './App.js'

class FileManager {
  constructor () {
    this.context = null
    this.jsonUpdateButton = null
    this.jsonInput = null
  }

  createJsonUpdateButton () {
    const jsonUpdateButton = document.createElement('button')

    jsonUpdateButton.id = 'json-update'
    jsonUpdateButton.append('Update File')

    return jsonUpdateButton
  }

  createJsonInput () {
    const jsonInput = document.createElement('input')

    jsonInput.id = 'json-input'
    jsonInput.type = 'file'
    jsonInput.accept = '.json'

    return jsonInput
  }

  setContext (context) {
    this.context = context
    this.jsonUpdateButton = this.createJsonUpdateButton()
    this.jsonInput = this.createJsonInput()

    this.context.fileManager.append(this.jsonUpdateButton, this.jsonInput)
  }

  async readJson (jsonFile) {
    const file = jsonFile
    const json = await file.text()
    const data = await JSON.parse(json)

    return data
  }

  setUpdateButtonEvent (eventListeners) {
    const jsonUpdateButtonMouseArea = new MouseArea(this.jsonUpdateButton)

    jsonUpdateButtonMouseArea.setClick(async () => {
      const data = await this.readJson(this.jsonInput.files[0])

      eventListeners.fetchModelData(data)
      eventListeners.setViewRange(0, 1)
    })

    app.getMouseEventManager().subscribe(jsonUpdateButtonMouseArea)
  }

  setJsonInputEvent (eventListeners) {
    const jsonInputMouseArea = new MouseArea(this.jsonInput)

    jsonInputMouseArea.setChange(async () => {
      const data = await this.readJson(this.jsonInput.files[0])

      eventListeners.fetchModelData(data)
      eventListeners.setViewRange(0, 1)
    })

    app.getMouseEventManager().subscribe(jsonInputMouseArea)
  }
}

export { FileManager }

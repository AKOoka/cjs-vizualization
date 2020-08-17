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
    this.jsonUpdateButton.onclick = async () => {
      const data = await this.readJson(this.jsonInput.files[0])

      eventListeners.fetchModelData(data)
      eventListeners.setViewRange(0, 1)
    }
  }

  setJsonInputEvent (eventListeners) {
    this.jsonInput.onchange = async () => {
      const data = await this.readJson(this.jsonInput.files[0])

      eventListeners.fetchModelData(data)
      eventListeners.setViewRange(0, 1)
    }
  }
}

export { FileManager }

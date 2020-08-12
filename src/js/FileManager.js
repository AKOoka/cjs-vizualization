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

    this.context.fileManagment.append(this.jsonUpdateButton, this.jsonInput)
  }

  async readJson (jsonFile) {
    const file = jsonFile
    const json = await file.text()
    const data = await JSON.parse(json)

    return data
  }

  setUpdateButtonEvent (eventListener) {
    this.jsonUpdateButton.onclick = async () => {
      const data = await this.readJson(this.jsonInput.files[0])

      eventListener(data)
    }
  }

  setJsonInputEvent (eventListener) {
    this.jsonInput.onchange = async () => {
      const data = await this.readJson(this.jsonInput.files[0])

      eventListener(data)
    }
  }
}

export { FileManager }

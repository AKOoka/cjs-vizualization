class FileManagment {
  constructor () {
    this.context = null
    this.jsonUpdateButton = null
    this.jsonInput = null
  }

  createJsonUpdateButton () {
    const jsonUpdateButton = document.createElement('button')

    jsonUpdateButton.id = 'json-update'

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

    this.context.append(this.jsonUpdateButton, this.jsonInput)
  }
}

export { FileManagment }

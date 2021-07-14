export class FileManager {
  private _context
  private _jsonUpdateButton: HTMLButtonElement
  private _jsonInput: HTMLInputElement

  init (context): void {
    this._context = context
    this._jsonUpdateButton = this.createJsonUpdateButton()
    this._jsonInput = this.createJsonInput()

    this._context.fileManager.append(this._jsonUpdateButton, this._jsonInput)
  }

  createJsonUpdateButton (): HTMLButtonElement {
    const jsonUpdateButton = document.createElement('button')

    jsonUpdateButton.id = 'json-update'
    jsonUpdateButton.append('Update File')

    return jsonUpdateButton
  }

  createJsonInput (): HTMLInputElement {
    const jsonInput = document.createElement('input')

    jsonInput.id = 'json-input'
    jsonInput.type = 'file'
    jsonInput.accept = '.json'

    return jsonInput
  }

  async readJson (jsonFile) {
    const json = await jsonFile.text()
    const data = await JSON.parse(json)

    return data
  }

  setUpdateButtonEvent (eventListeners): void {
    this._jsonUpdateButton.onclick = async () => {
      const data = await this.readJson(this._jsonInput.files[0])

      eventListeners.fetchModelData(data)
      eventListeners.setViewRange(0, 1)
    }
  }

  setJsonInputEvent (eventListeners): void {
    this._jsonInput.onchange = async () => {
      const data = await this.readJson(this._jsonInput.files[0])

      eventListeners.fetchModelData(data)
      eventListeners.setViewRange(0, 1)
    }
  }
}

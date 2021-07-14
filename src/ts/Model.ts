export class Model {
  constructor (modelProvider = null) {
    this.model = null
    this.modelProvider = modelProvider
  }

  setModelProvider (modelProvider) {
    this.modelProvider = modelProvider
  }

  fetchData (data) {
    this.model = this.modelProvider(data)
  }

  getModel () {
    return this.model
  }
}

import { Model } from './Model.js'

class ObservableModel {
  constructor (model = new Model()) {
    this.wrappedModel = model
    this.subscribers = []
  }

  setModelProvider (modelProvider) {
    this.wrappedModel.setModelProvider(modelProvider)
  }

  fetchData (data) {
    this.wrappedModel.fetchData(data)

    console.log(this.getModel())
    this.notify()
  }

  getModel () {
    return this.wrappedModel.getModel()
  }

  subscribe (subscriber) {
    this.subscribers.push(subscriber)
  }

  notify () {
    const model = this.getModel()

    for (const subscriber of this.subscribers) {
      subscriber.setModel(model)
    }
  }
}

export { ObservableModel }

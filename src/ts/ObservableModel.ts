import { Model } from './Model'

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

    console.log('data model', this.getModel())
    this.notify()
  }

  getModel () {
    return this.wrappedModel.getModel()
  }

  subscribe (subscriber) {
    this.subscribers.push(subscriber)
  }

  notify (): void {
    const model = this.getModel()

    for (const subscriber of this.subscribers) {
      subscriber.setModel(model)
    }
  }
}

export { ObservableModel }

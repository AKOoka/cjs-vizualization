import { parseData } from './parsing.js'
import { ObservableModel } from './ObservableModel.js'
import { FileManager } from './FileManager.js'
import { JobsPlotter } from './JobsPlotter.js'
import { TimeLine } from './TimeLine.js'
import { Slider } from './Slider.js'
import { Mouse } from './Mouse.js'
import { ViewRange } from './ViewRange.js'

class App {
  constructor () {
    this.domRoot = null
    this.context = null
    this.model = new ObservableModel()
    this.fileManager = new FileManager()
    this.jobsPlotter = new JobsPlotter()
    this.timeLine = new TimeLine()
    this.slider = new Slider()
    this.mouse = new Mouse()
    this.viewRange = new ViewRange()
  }

  createJobsPlotterDom () {
    const jobsPlotterDom = document.createElement('section')

    jobsPlotterDom.id = 'jobs-plotter'

    return jobsPlotterDom
  }

  createTimeLineInfoDom () {
    const timeLineInfoDom = document.createElement('section')

    timeLineInfoDom.id = 'time-line-info'

    return timeLineInfoDom
  }

  createProcessorLabelsContainer () {
    const processorLabelsContainer = document.createElement('section')

    processorLabelsContainer.id = 'processor-labels-container'

    return processorLabelsContainer
  }

  createSliderDom () {
    const sliderDom = document.createElement('section')

    sliderDom.id = 'slider'

    return sliderDom
  }

  createFileManagmentDom () {
    const fileManagmentDom = document.createElement('section')

    fileManagmentDom.id = 'file-managment'

    return fileManagmentDom
  }

  setDomRoot (domRoot) {
    this.context = {
      fileManagment: this.createFileManagmentDom(),
      jobsPlotter: this.createJobsPlotterDom(),
      processorLabelsDomContainer: this.createProcessorLabelsContainer(),
      timeLineInfo: this.createTimeLineInfoDom(),
      slider: this.createSliderDom()
    }

    this.domRoot = domRoot
    this.domRoot.append(
      this.context.fileManagment,
      this.context.jobsPlotter,
      this.context.processorLabelsDomContainer,
      this.context.timeLineInfo,
      this.context.slider
    )

    this.model.setModelProvider(parseData)
    this.model.subscribe(this.jobsPlotter)
    this.model.subscribe(this.timeLine)

    this.fileManager.setContext(this.context)
    this.fileManager.setJsonInputEvent(this.model.fetchData.bind(this.model))
    this.fileManager.setUpdateButtonEvent(this.model.fetchData.bind(this.model))

    this.viewRange.subscribe(this.jobsPlotter)
    this.viewRange.subscribe(this.slider)
    // this.viewRange.subscribe(mouseWheelController)
    this.viewRange.subscribe(this.timeLine)

    this.jobsPlotter.setViewRange(this.viewRange)
    this.slider.setViewRange(this.viewRange)
    this.timeLine.setViewRange(this.viewRange)

    this.jobsPlotter.setContext(this.context)
    this.timeLine.setContext(this.context)
    this.slider.setContext(this.context)

    console.log(this)
  }
}

const app = new App()

export { app }

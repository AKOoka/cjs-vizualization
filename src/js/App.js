import { parseData } from './parsing.js'
import { ObservableModel } from './ObservableModel.js'
import { FileManager } from './FileManager.js'
import { JobsPlotter } from './JobsPlotter.js'
import { TimeLine } from './TimeLine.js'
import { Slider } from './Slider.js'
import { MouseEventManager } from './MouseEventManager.js'
import { ViewRange } from './ViewRange.js'

class App {
  constructor () {
    this.contextRoot = null
    this.context = null
    this.model = new ObservableModel()
    this.fileManager = new FileManager()
    this.jobsPlotter = new JobsPlotter()
    this.timeLine = new TimeLine()
    this.slider = new Slider()
    this.mouseEventManager = new MouseEventManager()
    this.viewRange = new ViewRange()
  }

  createJobsPlotterContext () {
    const jobsPlotterContext = document.createElement('section')

    jobsPlotterContext.id = 'jobs-plotter'

    return jobsPlotterContext
  }

  createTimeLineInfoContext () {
    const timeLineInfoContext = document.createElement('section')

    timeLineInfoContext.id = 'time-line-info'

    return timeLineInfoContext
  }

  createProcessorLabelsContext () {
    const processorLabelsContext = document.createElement('section')

    processorLabelsContext.id = 'processor-labels'

    return processorLabelsContext
  }

  createSliderContext () {
    const sliderContext = document.createElement('section')

    sliderContext.id = 'slider'

    return sliderContext
  }

  createFileManagerContext () {
    const fileManagerContext = document.createElement('section')

    fileManagerContext.id = 'file-managment'

    return fileManagerContext
  }

  createStylesheetContext () {
    const stylesheetContext = document.createElement('style')

    return stylesheetContext
  }

  setContextRoot (contextRoot) {
    this.context = {
      fileManager: this.createFileManagerContext(),
      jobsPlotter: this.createJobsPlotterContext(),
      timeLineInfo: this.createTimeLineInfoContext(),
      processorLabels: this.createProcessorLabelsContext(),
      slider: this.createSliderContext(),
      stylesheet: this.createStylesheetContext()
    }

    this.contextRoot = contextRoot
    this.contextRoot.append(
      this.context.fileManager,
      this.context.jobsPlotter,
      this.context.timeLineInfo,
      this.context.processorLabels,
      this.context.slider,
      this.context.stylesheet
    )

    this.model.setModelProvider(parseData)
    this.model.subscribe(this.jobsPlotter)
    this.model.subscribe(this.timeLine)

    this.fileManager.setContext(this.context)
    this.jobsPlotter.setContext(this.context)
    this.timeLine.setContext(this.context)
    this.slider.setContext(this.context)
    this.mouseEventManager.setContext()

    this.fileManager.setJsonInputEvent({
      fetchModelData: this.model.fetchData.bind(this.model),
      setViewRange: this.viewRange.setRange.bind(this.viewRange)
    })
    this.fileManager.setUpdateButtonEvent({
      fetchModelData: this.model.fetchData.bind(this.model),
      setViewRange: this.viewRange.setRange.bind(this.viewRange)
    })

    this.jobsPlotter.setViewRange(this.viewRange)
    this.timeLine.setViewRange(this.viewRange)
    this.slider.setViewRange(this.viewRange)

    this.viewRange.subscribe(this.jobsPlotter)
    this.viewRange.subscribe(this.timeLine)
    this.viewRange.subscribe(this.slider)

    console.log(this)
  }

  getMouseEventManager () {
    return this.mouseEventManager
  }
}

const app = new App()

export { app }

import { JobsPlotter } from './JobsPlotter.js'
// import { JobsPixiComposer } from './JobsPixiComposer.js'
import { PixiRenderer } from './PixiRenderer.js'
import { MousePixiActionController } from './MousePixiActionController.js'

class JobsPixiPlotter extends JobsPlotter {
  constructor () {
    super()

    // this.jobsComposer = new JobsPixiComposer()
    this.renderer = new PixiRenderer()
    this.mouseActionController = new MousePixiActionController()
  }

  setContext (context) {
    super.setContext(context)

    // this.context.jobsPlotter.append(this.renderer.getScene())
    // this.mouseActionController.setContext()
  }

  setModel (model) {
    super.setModel(model)

    // this.mouseActionController.setModel()
    this.createJobsRanges()
  }

  createJobsRanges () {
    if (this.processorLabelsContainer.children.length > 0) {
      this.changeContainer('processorLabelsContainer', this.createProcessorLabelsContainer())
    }

    for (const job of this.model.jobRecords.values()) {
      this.renderer.addJob(job)
    }

    this.renderer.setScene(this.context.jobsPlotter.offsetWidth, 8 * 28)

    this.context.jobsPlotter.append(this.renderer.getScene())
  }

  watchRangeChanges (startPos, endPos) {

  }

  adjustRanges (scaleFactor, translateFactor, translateStart) {
    // const { range } = this.jobsComposer.jobsModel[index]
    // const { job, rangeCounter } = this.model.jobRanges[index]
    // const { beginTimestamp, endTimestamp } = this.model.jobRecords.get(job).ranges[rangeCounter]

    // const width = (endTimestamp - beginTimestamp) * scaleWidthFactor
    // const pos = (beginTimestamp - traslateStart) * scaleWidthFactor - translateFactor

    // range.style.left = pos + 'px'
    // range.style.width = Math.max(1, width) + 'px'

    // if (width <= 40) {
    //   range.classList.add('hiddeText')
    // } else {
    //   range.classList.remove('hiddeText')
    // }

    this.renderer.transformRanges(translateStart * scaleFactor, translateFactor, scaleFactor)
    // this.renderer.scaleRanges(scaleFactor)
    // this.renderer.translateRange(translateStart * scaleFactor, translateFactor)
  }
}

export { JobsPixiPlotter }

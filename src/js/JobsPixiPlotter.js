import { JobsPlotter } from './JobsPlotter.js'
import { JobsPixiComposer } from './JobsPixiComposer.js'
import { PixiRenderer } from './PixiRenderer.js'
import { MousePixiActionController } from './MousePixiActionController.js'

class JobsPixiPlotter extends JobsPlotter {
  constructor () {
    super()

    this.jobsComposer = new JobsPixiComposer()
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
  }

  createJobsRanges () {
    if (this.processorLabelsContainer.children.length > 0) {
      this.changeContainer('processorLabelsContainer', this.createProcessorLabelsContainer())
    }

    for (const processorId of this.jobsComposer.processors.keys()) {
      this.processorLabelsContainer.append(this.createProcessorLabel(processorId))
    }

    this.renderer.setScene(this.context.jobsPlotter.offsetWidth, this.jobsComposer.processors.size * 28)
  }

  watchRangeChanges (startPos, endPos) {

  }

  adjustRanges (scaleFactor, translateFactor, traslateStart) {
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

    this.renderer.scaleRanges(scaleFactor)
    this.renderer.translateRange(traslateStart * scaleFactor, translateFactor)
  }
}

export { JobsPixiPlotter }

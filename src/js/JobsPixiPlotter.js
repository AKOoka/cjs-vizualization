import { JobsPlotter } from './JobsPlotter.js'
import { JobsPixiBuilder } from './JobsPixiBuilder.js'
import { PixiRenderer } from './PixiRenderer.js'
import { MousePixiActionController } from './MousePixiActionController.js'

class JobsPixiPlotter extends JobsPlotter {
    constructor() {
        super()

        this._jobsBuilder = new JobsPixiBuilder()
        this._renderer = new PixiRenderer()
        this._mouseActionController = new MousePixiActionController()
    }

    _createJobsRanges() {
        if (this._processorLabelsContainer.children.length > 0) {
            this._changeContainer('_processorLabelsContainer', this._createProcessorLabelsContainer())
        }

        for (const job of this._model.jobRecords.values()) {
            const { name, ranges } = job
            const jobColor = this._jobsBuilder.jobsModel.get(name).hsvToRgb()

            for (const range of ranges) {
                const { beginTimestamp, endTimestamp, processorId } = range

                this._renderer.addRange(
                    beginTimestamp,
                    this._jobsBuilder.processors.get(processorId),
                    endTimestamp - beginTimestamp,
                    20,
                    jobColor
                )
            }
        }

        this._renderer.setScene(this._context.jobsPlotter.offsetWidth, 8 * 28)

        this._context.jobsPlotter.append(this._renderer.getScene())
    }

    setContext(context) {
        super.setContext(context)

        // this._context.jobsPlotter.append(this.renderer.getScene())
        // this._mouseActionController.setContext()
    }

    setModel(model) {
        super.setModel(model)

        // this._mouseActionController.setModel()
    }

    updateRange() {
        if (!this._model) {
            return
        }

        const scaleFactor = 1 / this._viewRange.width

        const scaleWidthFactor = 1 / this._model.meta.timeSpan.getTime() * scaleFactor * this._context.jobsPlotter.offsetWidth
        const translateFactor = this._viewRange.start * scaleFactor * this._context.jobsPlotter.offsetWidth
        const translateStart = this._model.meta.startTime.getTime() * scaleWidthFactor

        this._renderer.transformRanges(translateStart, translateFactor, scaleWidthFactor)
    }
}

export { JobsPixiPlotter }
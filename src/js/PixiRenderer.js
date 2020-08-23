/* global PIXI */

class PixiRenderer {
  constructor () {
    this.scene = null
    this.scalableContainer = new PIXI.Graphics()
    this.nonScalableContainer = new PIXI.Graphics()
  }

  addRange (x, y, width, color) {
    this.scalableContainer.beginFill(color)
    this.scalableContainer.drawRect(x, y, width, 20)
    this.scalableContainer.endFill()
  }

  scaleRanges (scaleFactor) {
    this.scalableContainer.scale(scaleFactor)
  }

  translateRange (translateStart, translateFactor) {
    this.scalableContainer.translate(-translateFactor)
    this.scalableContainer.translate(-translateStart)
    this.nonScalableContainer.translate(-translateFactor)
    this.nonScalableContainer.translate(-translateStart)
  }

  getScene () {
    return this.scene?.view
  }

  setScene (width, height) {
    this.scene = new PIXI.Application({ width, height })
    this.scene.stage.addChild(this.scalableContainer, this.nonScalableContainer)
  }

  clearScene () {
    this.scalableContainer.clear()
    this.nonScalableContainer.clear()
  }
}

export { PixiRenderer }

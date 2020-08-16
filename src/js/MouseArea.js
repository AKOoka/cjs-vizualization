class MouseArea {
  constructor (
    domElementOwner,
    onMouseDown = () => {},
    onMouseMove = () => {},
    onMouseUp = () => {}
  ) {
    this.domElementOwner = domElementOwner
    this.onMouseDown = onMouseDown
    this.onMouseMove = onMouseMove
    this.onMouseUp = onMouseUp
  }

  getDomElementOwner () {
    return this.domElementOwner
  }

  getMouseDown () {
    return this.onMouseDown
  }

  getMouseMove () {
    return this.onMouseMove
  }

  getMouseUp () {
    return this.onMouseUp
  }
}

export { MouseArea }

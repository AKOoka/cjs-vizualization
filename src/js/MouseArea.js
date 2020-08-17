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

  setMouseDown (callback) {
    this.onMouseDown = callback
  }

  getMouseMove () {
    return this.onMouseMove
  }

  setMouseMove (callback) {
    this.onMouseMove = callback
  }

  getMouseUp () {
    return this.onMouseUp
  }

  setMouseUp (callback) {
    this.onMouseUp = callback
  }
}

export { MouseArea }

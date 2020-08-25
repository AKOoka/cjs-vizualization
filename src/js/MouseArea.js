class MouseArea {
  constructor (
    domElementOwner,
    onMouseDown = () => {},
    onMouseMove = () => {},
    onMouseUp = () => {},
    onWheel = () => {},
    onContextMenu = () => {},
    onClick = () => {}
  ) {
    this.domElementOwner = domElementOwner
    this.onMouseDown = onMouseDown
    this.onMouseMove = onMouseMove
    this.onMouseUp = onMouseUp
    this.onWheel = onWheel
    this.onContextMenu = onContextMenu
    this.onClick = onClick
  }

  getDomElementOwner () {
    return this.domElementOwner
  }

  setMouseDown (eventListener) {
    this.onMouseDown = eventListener
  }

  setMouseMove (eventListener) {
    this.onMouseMove = eventListener
  }

  setMouseUp (eventListener) {
    this.onMouseUp = eventListener
  }

  setWheel (eventListener) {
    this.onWheel = eventListener
  }

  setContextMenu (eventListener) {
    this.onContextMenu = eventListener
  }

  setClick (eventListener) {
    this.onClick = eventListener
  }
}

export { MouseArea }

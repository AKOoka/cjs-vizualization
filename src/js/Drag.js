class Drag {
  constructor (startPos, onMouseMove, onMouseUp) {
    this._startPos = startPos
    this._onMouseMove = onMouseMove
    this._onMouseUp = onMouseUp
  }

  get startPos () {
    return this._startPos
  }

  get onMouseMove () {
    return this._onMouseMove
  }

  get onMouseUp () {
    return this._onMouseUp
  }
}

export { Drag }

import { MouseButtonState } from './MouseButtonState.js'

class MouseState {
  constructor (x, y, mouseWheelValue, target, keyState, mouseButtonState) {
    this._x = x
    this._y = y
    this._mouseWheelValue = mouseWheelValue
    this._target = target
    this._keyState = keyState
    this._mouseButtonState = mouseButtonState
  }

  get x () {
    return this._x
  }

  get y () {
    return this._y
  }

  get target () {
    return this._target
  }

  get files () {
    return this._files
  }

  get keyState () {
    return this._keyState
  }

  get mouseButtonState () {
    return this._mouseButtonState
  }

  getPosition () {
    return { x: this._x, y: this._y }
  }

  getMouseWheelValue () {
    if (this._mouseWheelValue > 0) {
      return 1
    } else if (this._mouseWheelValue < 0) {
      return -1
    } else {
      return this._mouseWheelValue
    }
  }

  static getMouseState (event, keyState) {
    return new MouseState(
      event.clientX,
      event.clientY,
      event.deltaY,
      event.target,
      keyState,
      new MouseButtonState(event.button)
    )
  }
}

export { MouseState }

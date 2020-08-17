import { MouseButtonState } from './MouseButtonState.js'

class MouseState {
  constructor (x, y, mouseWheelValue, target, ctrlKey, mouseButtonState) {
    this.x = x
    this.y = y
    this.mouseWheelValue = mouseWheelValue
    this.target = target
    this.ctrlKey = ctrlKey
    this.mouseButtonState = mouseButtonState
  }

  getX () {
    return this.x
  }

  getY () {
    return this.y
  }

  getPosition () {
    return { x: this.x, y: this.y }
  }

  getMouseWheelValue () {
    if (this.mouseWheelValue > 0) {
      return 1
    } else if (this.mouseWheelValue < 0) {
      return -1
    } else {
      return this.mouseWheelValue
    }
  }

  getTarget () {
    return this.target
  }

  getCtrlKey () {
    return this.ctrlKey
  }

  getFiles () {
    return this.files
  }

  getMouseButtonState () {
    return this.mouseButtonState
  }

  static getMouseState (event) {
    return new MouseState(
      event.clientX,
      event.clientY,
      event.deltaY,
      event.target,
      event.ctrlKey,
      new MouseButtonState(event.button)
    )
  }
}

export { MouseState }

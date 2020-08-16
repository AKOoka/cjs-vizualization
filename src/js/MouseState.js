import { MouseButtonState } from './MouseButtonState.js'

class MouseState {
  constructor (x, y, mouseWheelValue, mouseButtonState) {
    this.x = x
    this.y = y
    this.mouseWheelValue = mouseWheelValue
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

  getRelativePosition (offset) {}

  getMouseWheelValue () {
    return this.mouseWheelValue
  }

  getMouseButtonState () {
    return this.mouseButtonState
  }

  static getMouseState (event) {
    const { clientX, clientY, deltaY, button } = event

    const isLeftDown = button === 0
    const isMiddleDown = button === 1
    const isRightDown = button === 2

    const mouseButtonState = new MouseButtonState(isLeftDown, isMiddleDown, isRightDown)

    return new MouseState(clientX, clientY, deltaY, mouseButtonState)
  }
}

export { MouseState }

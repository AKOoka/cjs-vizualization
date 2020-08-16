import { MouseState } from './MouseState.js'

class MouseEventManager {
  constructor () {
    this.activeElements = []
  }

  setContext () {
    document.onmousemove = this.onMouseMoveWorker.bind(this)
    document.onmouseup = this.onMouseUpWorker.bind(this)
  }

  subscribe (mouseArea) {
    mouseArea.getDomElementOwner().onmousedown = event => {
      mouseArea.onMouseDown(MouseState.getMouseState(event))

      this.activeElements.push(mouseArea)
    }
  }

  onMouseMoveWorker (event) {
    const mouseState = MouseState.getMouseState(event)

    for (const activeElement of this.activeElements) {
      activeElement.onMouseMove(mouseState)
    }
  }

  onMouseUpWorker (event) {
    const mouseState = MouseState.getMouseState(event)

    for (const activeElement of this.activeElements) {
      activeElement.onMouseUp(mouseState)
    }

    this.activeElements = []
  }
}

export { MouseEventManager }

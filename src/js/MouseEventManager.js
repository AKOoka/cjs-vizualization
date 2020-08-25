import { MouseState } from './MouseState.js'
import { KeyState } from './KeyState.js'

class MouseEventManager {
  constructor () {
    this._activeElements = []
    this._keyState = new KeyState()
    this._draggedElement = null
  }

  setContext () {
    document.onmousemove = this._onMouseMoveWorker.bind(this)
    document.onmouseup = this._onMouseUpWorker.bind(this)
    document.onkeydown = this._onKeyDownWorker.bind(this)
    document.onkeyup = this._onKeyUpWorker.bind(this)
  }

  subscribe (mouseArea) {
    mouseArea.getDomElementOwner().onmousedown = event => {
      event.preventDefault()

      this._draggedElement = mouseArea.onMouseDown(MouseState.getMouseState(event, this._keyState))
      this._activeElements.push(mouseArea)
    }
    mouseArea.getDomElementOwner().onwheel = event => {
      event.preventDefault()

      mouseArea.onWheel(MouseState.getMouseState(event, this._keyState))
    }
    mouseArea.getDomElementOwner().oncontextmenu = event => {
      event.preventDefault()

      mouseArea.onContextMenu(MouseState.getMouseState(event, this._keyState))
    }
    mouseArea.getDomElementOwner().onclick = event => {
      mouseArea.onClick(MouseState.getMouseState(event, this._keyState))
    }
  }

  _onMouseMoveWorker (event) {
    event.preventDefault()

    const mouseState = MouseState.getMouseState(event, this._keyState)

    for (const activeElement of this._activeElements) {
      activeElement.onMouseMove(mouseState)
    }

    if (this._draggedElement) {
      this._draggedElement.onMouseMove(mouseState)
    }
  }

  _onMouseUpWorker (event) {
    const mouseState = MouseState.getMouseState(event, this._keyState)

    for (const activeElement of this._activeElements) {
      activeElement.onMouseUp(mouseState)
    }

    if (this._draggedElement) {
      this._draggedElement.onMouseUp(mouseState)
    }

    this._activeElements = []
  }

  _onKeyDownWorker (event) {
    this._keyState.pressKey(event.code)
  }

  _onKeyUpWorker (event) {
    this._keyState.releaseKey(event.code)
  }
}

export { MouseEventManager }

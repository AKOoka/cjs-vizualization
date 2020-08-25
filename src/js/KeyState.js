class KeyState {
  constructor () {
    this._spaceKey = false
    this._shiftKey = false
    this._crtlKey = false
  }

  pressKey (keyCode) {
    switch (keyCode) {
      case 'Space':
        this._spaceKey = true
        break

      case 'ShiftLeft':
        this._shiftKey = true
        break

      case 'ControlLeft':
        this._crtlKey = true
        break
    }
  }

  releaseKey (keyCode) {
    switch (keyCode) {
      case 'Space':
        this._spaceKey = false
        break

      case 'ShiftLeft':
        this._shiftKey = false
        break

      case 'ControlLeft':
        this._crtlKey = false
        break
    }
  }

  get spaceKey () {
    return this._spaceKey
  }

  get shiftKey () {
    return this._shiftKey
  }

  get ctrlKey () {
    return this._crtlKey
  }
}

export { KeyState }

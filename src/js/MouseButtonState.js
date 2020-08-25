class MouseButtonState {
  constructor (buttonState) {
    this._buttonState = buttonState
  }

  isLeftDown () {
    return this._buttonState === 0
  }

  isMiddleDown () {
    return this._buttonState === 1
  }

  isRightDown () {
    return this._buttonState === 2
  }
}

export { MouseButtonState }

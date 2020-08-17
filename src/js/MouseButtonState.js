class MouseButtonState {
  constructor (buttonState) {
    this.buttonState = buttonState
  }

  isLeftDown () {
    return this.buttonState === 0
  }

  isMiddleDown () {
    return this.buttonState === 1
  }

  isRightDown () {
    return this.buttonState === 2
  }
}

export { MouseButtonState }

class MouseButtonState {
  constructor (isLeftDown, isMiddleDown, isRightDown) {
    this.isLeftDown = isLeftDown
    this.isMiddleDown = isMiddleDown
    this.isRightDown = isRightDown
  }

  isLeftDown () {
    return this.isLeftDown
  }

  isMiddleDown () {
    return this.isMiddleDown
  }

  isRightDown () {
    return this.isRightDown
  }
}

export { MouseButtonState }

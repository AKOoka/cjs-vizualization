class DomElementWrapper {
  constructor (id, x, width) {
    this.x = x
    this.width = width

    this.domElement = document.createElement('div')
    this.domElement.classList.add(id)
    this.domElement.style.left = `${x}px`
    this.domElement.style.width = `${width}px`
  }

  getDomElement () {
    return this.domElement
  }

  getX () {
    return this.x
  }

  setX (x) {
    this.x = x
    this.domElement.style.left = `${x}px`
  }

  getWidth () {
    return this.width
  }

  setWidth (width) {
    this.width = width
    this.domElement.style.width = `${width}px`
  }
}

export { DomElementWrapper }

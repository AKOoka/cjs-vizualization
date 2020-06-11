class ContextualMenu {
  constructor () {
    this.menuDOM = null
    this.menuDOMActive = false
  }

  showMenu ({ pageX, pageY }) {
    this.menuDOM.style.left = `${pageX}px`
    this.menuDOM.style.top = `${pageY}px`

    document.body.append(this.menuDOM)

    this.menuDOMActive = true
  }

  hideMenu () {
    if (this.menuDOMActive) {
      this.menuDOM.remove()
    }
  }

  createMenuDOM ({ showJobRangesListener, showJobSpawnsListener, showAtomicCounterListener }) {
    const menuDOM = document.createElement('section')

    menuDOM.classList.add('plotter-menu')

    const showJobRangesButton = this.createMenuOptionDOM('show job ranges', showJobRangesListener)
    const showJobSpawnsButton = this.createMenuOptionDOM('show job spawns', showJobSpawnsListener)
    const showAtomicCounterButton = this.createMenuOptionDOM('show atomic counters', showAtomicCounterListener)

    menuDOM.append(showJobRangesButton)
    menuDOM.append(showJobSpawnsButton)
    menuDOM.append(showAtomicCounterButton)

    this.menuDOM = menuDOM
  }

  createMenuOptionDOM (text, eventListener) {
    const menuOptionDOM = document.createElement('button')

    menuOptionDOM.classList.add('plotter-menu__option')
    menuOptionDOM.textContent = text
    menuOptionDOM.onclick = eventListener

    return menuOptionDOM
  }
}

export { ContextualMenu }

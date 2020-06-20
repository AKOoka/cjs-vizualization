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

  createMenuDOM ({ showJobRangesListener, showJobSpawnsListener, showAtomicCounterListener, hideDependencesListener }) {
    const menuDOM = document.createElement('section')

    menuDOM.oncontextmenu = event => {
      event.preventDefault()
    }

    menuDOM.classList.add('plotter-menu')

    const showJobRangesButton = this.createMenuOptionDOM('Select Job', showJobRangesListener)
    const showJobSpawnsButton = this.createMenuOptionDOM('Show job spawns', showJobSpawnsListener)
    const showAtomicCounterButton = this.createMenuOptionDOM('Show atomic counters', showAtomicCounterListener)
    const hideDependencesButton = this.createMenuOptionDOM('Hide job dependences', hideDependencesListener)

    menuDOM.append(showJobRangesButton)
    menuDOM.append(showJobSpawnsButton)
    menuDOM.append(showAtomicCounterButton)
    menuDOM.append(hideDependencesButton)

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

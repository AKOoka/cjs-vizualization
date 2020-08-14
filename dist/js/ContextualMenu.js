class ContextualMenu {
  constructor () {
    this.menu = null
    this.menuIsAcitve = false
  }

  showMenu ({ pageX, pageY }) {
    this.menu.style.left = `${pageX}px`
    this.menu.style.top = `${pageY}px`

    document.body.append(this.menu)

    this.menuIsAcitve = true
  }

  hideMenu () {
    if (this.menuIsAcitve) {
      this.menu.remove()
    }
  }

  createMenu ({ showJobRangesListener, showJobSpawnsListener, showAtomicCounterListener, hideDependencesListener }) {
    const menu = document.createElement('section')

    menu.oncontextmenu = event => {
      event.preventDefault()

      this.hideMenu()
    }

    menu.classList.add('plotter-menu')

    menu.append(this.createMenuOption('Select Job', showJobRangesListener))
    menu.append(this.createMenuOption('Show Job Spawns', showJobSpawnsListener))
    menu.append(this.createMenuOption('Show Atomic Counters', showAtomicCounterListener))
    menu.append(this.createMenuOption('Hide Job Dependences', hideDependencesListener))

    this.menu = menu
  }

  createMenuOption (text, eventListener) {
    const menuOption = document.createElement('button')

    menuOption.classList.add('plotter-menu__option')
    menuOption.textContent = text
    menuOption.onclick = eventListener

    return menuOption
  }
}

export { ContextualMenu }

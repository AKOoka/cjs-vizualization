class JobSelector {
  selectJob (id, div, selectedJobs, selectedJobDOMElements) {
    selectedJobs.add(id)

    div.classList.add('selected')

    selectedJobDOMElements.add(div)
  }

  deselectJob (id, div, selectedJobs, selectedJobDOMElements) {
    selectedJobs.delete(id)

    div.classList.remove('selected')

    selectedJobDOMElements.delete(div)
  }

  deselectAllJobs (selectedJobs, selectedJobDOMElements) {
    selectedJobs.clear()

    for (const div of selectedJobDOMElements) {
      div.classList.remove('selected')
    }

    selectedJobDOMElements.clear()
  }

  // selectAllJobs () {
  // }
}

export { JobSelector }

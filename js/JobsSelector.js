function getIndex (div) {
  return div.className.match(/job-\d+/)[0].slice(4)
}

class JobsSelector {
  constructor () {
    this.context = null
    this.selectedJobs = new Set()
    this.selectedJobDOMElements = new Set()
  }

  setContext (context) {
    this.context = context

    this.context.domRoot.onclick = ({ ctrlKey, target }) => {
      const isRange = target.className.includes('range')

      if (ctrlKey && isRange) {
        const jobId = getIndex(target)

        this.deselectJob(jobId)
        this.deselectJobDOM(target)
      } else if (isRange) {
        const jobId = getIndex(target)

        this.selectJob(jobId)
        this.selectJobDOM(target)
      } else {
        this.deselectAllJobs()
        this.deselectAllJobsDOM()
      }

      console.log(this.selectedJobs)
    }
  }

  deselectJobDOM (div) {
    div.classList.remove('selected')

    this.selectedJobDOMElements.delete(div)
  }

  selectJobDOM (div) {
    div.classList.add('selected')

    this.selectedJobDOMElements.add(div)
  }

  deselectAllJobsDOM () {
    for (const div of this.selectedJobDOMElements) {
      div.classList.remove('selected')
    }

    this.selectedJobDOMElements.clear()
  }

  selectJob (id) {
    this.selectedJobs.add(id)
  }

  deselectJob (id) {
    this.selectedJobs.delete(id)
  }

  // selectAllJobs () {

  // }

  deselectAllJobs () {
    this.selectedJobs.clear()
  }

  doAction (action) {
    this.selectedJobs.forEach(job => {
      action(job)
    })
  }
}

export { JobsSelector }

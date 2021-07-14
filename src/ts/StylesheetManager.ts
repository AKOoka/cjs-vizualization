export class StylesheetManager {
  private _context

  setContext (context: StyleSheet): void {
    this._context = context
  }

  changeStyleForJob (jobId: number): void {
    const rule = `.job-${jobId}.range { filter: brightness(80%); border: 2px dashed black; color: white; font-weight: bold; }`

    this._context.stylesheet.sheet.insertRule(rule, 0)
    console.log(this._context.stylesheet.sheet)
  }

  // changeStyleForAtomicCounter (acId: number) {

  // }

  removeStyleOfJob (jobId: number) {
    // there is weird behavior of deleteRule - it deletes first rule if doesn't find rule that was searched
    this.context.stylesheet.sheet.deleteRule(`.job-${jobId}.range`)
  }
}

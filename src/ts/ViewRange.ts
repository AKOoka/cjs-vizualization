export class ViewRange {
  private _start: number
  private _end: number
  private _width: number
  private readonly _subscribers: []

  constructor () {
    this._start = 0
    this._end = 1
    this._width = 1
    this._subscribers = []
  }

  get start (): number {
    return this._start
  }

  get end (): number {
    return this._end
  }

  get width (): number {
    return this._width
  }

  subscribe (sub): void {
    this._subscribers.push(sub)
  }

  notifySubscribers (): void {
    for (const sub of this._subscribers) {
      sub.updateRange()
    }
  }

  setRange (start: number, end: number): void {
    this._start = start
    this._end = end
    this._width = end - start

    this.notifySubscribers()
  }
}

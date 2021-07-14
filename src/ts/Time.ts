export class Time {
  private _time: number

  constructor (time: number) {
    this._time = time
  }

  get time (): number {
    return this._time
  }

  set time (value: number) {
    this._time = value
  }

  convertTime (): string {
    if (this._time <= 100) {
      return this._time.toString() + 'μs'
    } else if (this._time > 100 && this._time <= 1000) {
      return (this._time / 1000).toFixed(2).toString() + 'ms'
    } else if (this._time > 1000 && this._time <= 100000) {
      return Math.round(this._time / 1000).toString() + 'ms'
    } else if (this._time > 100000 && this._time <= 1000000) {
      return (this._time / 1000000).toFixed(2).toString() + 's'
    } else if (this._time > 1000000) {
      return Math.round(this._time / 1000000).toString() + 's'
    }

    throw new Error("can't convert time")
  }
}

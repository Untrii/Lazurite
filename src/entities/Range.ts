export default class Range {
  name: string
  from: number
  to: number
  step: number
  constructor(from: number, to: number, step: number) {
    this.name = 'Range'
    this.from = from
    this.to = to
    if (step) this.step = step
    else this.step = to > 10 ? 1 : 0.01
  }
}

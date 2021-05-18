export default class RendererResolution {
  readonly sourceWidth: number
  readonly sourceHeight: number
  private _scale: number

  get targetWidth(): number {
    return this.sourceWidth * this._scale
  }
  set targetWidth(val) {
    this._scale = val / this.sourceWidth
  }

  get targetHeight(): number {
    return this.sourceHeight * this._scale
  }
  set targetHeight(val) {
    this._scale = val / this.sourceHeight
  }

  get scale() {
    return this._scale
  }
  set scale(val) {
    this._scale = val
  }

  constructor(sourceWidth: number, sourceHeight: number, scale = 1) {
    this.sourceWidth = sourceWidth
    this.sourceHeight = sourceHeight
    this._scale = scale
  }
}

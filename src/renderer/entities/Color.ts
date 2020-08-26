import IColor from './IColor'

export default class Color {
  public r: number
  public g: number
  public b: number
  public a: number
  public isTransparet = false

  public constructor(isTransparent?: boolean) {
    if (isTransparent) this.isTransparet = true
    else isTransparent = false
    this.r = 0
    this.g = 0
    this.b = 0
    this.a = 1
  }

  public fromHex(hex: string) {
    hex = hex.replace('#', '')
    let hexNum = parseInt(hex, 16)

    this.r = Math.floor(hexNum / 0x10000)
    this.g = Math.floor((hexNum % 0x10000) / 0x100)
    this.b = Math.floor(hexNum % 0x100)

    return this
  }

  public fromRgb(r: number, g: number, b: number, a?: number) {
    this.r = r
    this.g = g
    this.b = b
    if (a) this.a = a

    return this
  }

  public fromOther(color: IColor) {
    this.r = color.r
    this.g = color.g
    this.b = color.b
    this.a = color.a ?? 1
  }

  public toHex(): string {
    return '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1)
  }

  public toCssColor(): string {
    if (this.isTransparet) return 'transparent'
    return `rgba(${this.r},${this.g},${this.b},${this.a})`
  }

  public equals(color: IColor): boolean {
    if (this.r == color.r && this.g == color.g && this.b == color.b) return true
    return false
  }
}

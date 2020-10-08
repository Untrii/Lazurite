import IColor from './IColor'

export default class Color {
  public r: number
  public g: number
  public b: number
  public a: number

  public constructor(isTransparent?: boolean) {
    this.r = 0
    this.g = 0
    this.b = 0
    this.a = isTransparent ? 0 : 1
  }

  public fromHex(hex: string): Color {
    hex = hex.replace('#', '')
    let hexNum = parseInt(hex, 16)

    this.r = Math.floor(hexNum / 0x10000)
    this.g = Math.floor((hexNum % 0x10000) / 0x100)
    this.b = Math.floor(hexNum % 0x100)

    return this
  }
  public static fromHex(hex: string) {
    let result = new Color()
    hex = hex.replace('#', '')
    let hexNum = parseInt(hex, 16)

    result.r = Math.floor(hexNum / 0x10000)
    result.g = Math.floor(hexNum % 0x10000) / 0x100
    result.b = Math.floor(hexNum % 0x100)

    return result
  }

  public fromRgb(r: number, g: number, b: number, a?: number): Color {
    this.r = r
    this.g = g
    this.b = b
    if (a) this.a = a

    return this
  }
  public static fromRgb(r: number, g: number, b: number, a?: number) {
    let result = new Color()
    result.r = r
    result.g = g
    result.b = b

    return result
  }

  public fromOther(color: IColor): Color {
    this.r = color.r
    this.g = color.g
    this.b = color.b
    this.a = color.a ?? 1
    return this
  }
  public static fromOther(color: IColor): Color {
    let result = new Color()
    result.r = color.r
    result.g = color.g
    result.b = color.b
    result.a = color.a ?? 1
    return result
  }

  public toHex(): string {
    return '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1)
  }

  public toCssColor(): string {
    if (this.a == 0) return 'transparent'
    return `rgba(${this.r},${this.g},${this.b},${this.a})`
  }

  public equals(color: IColor): boolean {
    if (this.r == color.r && this.g == color.g && this.b == color.b) return true
    return false
  }

  public static get random(): Color {
    return new Color().fromRgb(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    )
  }
}

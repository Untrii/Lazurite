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

  public static fromHex(hex: string) {
    const result = new Color()
    hex = hex.replace('#', '')
    const hexNum = parseInt(hex, 16)

    result.r = Math.floor(hexNum / 0x10000)
    result.g = Math.floor(hexNum % 0x10000) / 0x100
    result.b = Math.floor(hexNum % 0x100)

    return result
  }

  public static fromRgb(r: number, g: number, b: number, a?: number) {
    const result = new Color()
    result.r = r
    result.g = g
    result.b = b

    return result
  }

  public copy(): Color {
    const result = new Color()
    result.r = this.r
    result.g = this.g
    result.b = this.b
    result.a = this.a ?? 1
    return result
  }

  public toHex(): string {
    return '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1)
  }

  public toCssColor(): string {
    if (this.a == 0) return 'transparent'
    return `rgba(${this.r},${this.g},${this.b},${this.a})`
  }

  public equals(color: Color): boolean {
    if (this.r == color.r && this.g == color.g && this.b == color.b) return true
    return false
  }

  public static get random(): Color {
    return Color.fromRgb(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    )
  }
}

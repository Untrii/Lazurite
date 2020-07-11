export default class Color {
  public r: number
  public g: number
  public b: number

  public constructor() {
    this.r = 0
    this.g = 0
    this.b = 0
  }

  public fromHex(hex: string) {
    hex = hex.replace('#', '')
    let hexNum = parseInt(hex, 16)

    this.r = Math.floor(hexNum / 0x10000)
    this.g = Math.floor(hexNum % 0x10000) / 0x100
    this.b = Math.floor(hexNum % 0x100)

    return this
  }

  public fromRgb(r: number, g: number, b: number, a?: number) {
    this.r = r
    this.g = g
    this.b = b

    return this
  }

  public toHex(): string {
    return (
      '#' +
      ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b)
        .toString(16)
        .slice(1)
    )
  }

  public toCssRgb(): string {
    return `rgb(${this.r},${this.g},${this.b})`
  }
}

class Color {
  r
  g
  b

  constructor() {
    this.r = 0
    this.g = 0
    this.b = 0
  }

  fromHex(hex) {
    hex = hex.replace('#', '')
    let hexNum = parseInt(hex, 16)

    this.r = Math.floor(hexNum / 0x10000)
    this.g = Math.floor((hexNum % 0x10000) / 0x100)
    this.b = Math.floor(hexNum % 0x100)

    return this
  }

  static fromHex(hex) {
    let result = new Color()
    hex = hex.replace('#', '')
    let hexNum = parseInt(hex, 16)

    result.r = Math.floor(hexNum / 0x10000)
    result.g = Math.floor(hexNum % 0x10000) / 0x100
    result.b = Math.floor(hexNum % 0x100)

    return result
  }

  fromRgb(r, g, b, a) {
    this.r = r
    this.g = g
    this.b = b

    return this
  }

  static fromRgb(r, g, b, a) {
    let result = new Color()
    result.r = r
    result.g = g
    result.b = b

    return result
  }

  toHex() {
    return '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1)
  }

  toCssColor() {
    return `rgb(${this.r},${this.g},${this.b})`
  }
}

exports.default = Color

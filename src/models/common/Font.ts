export type FontType = 'normal' | 'italic'
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export interface FontVariant {
  type: FontType
  weight: FontWeight
  source: string
}

export default class Font {
  name: string
  variants: FontVariant[]
  previewSource: string

  get types() {
    const result = new Set<string>()
    for (const variant of this.variants) {
      result.add(variant.type)
    }
    return Array.from(result)
  }

  get weights() {
    const result = new Set<number>()
    for (const variant of this.variants) {
      result.add(variant.weight)
    }
    return Array.from(result)
  }

  constructor(name?: string, variants?: FontVariant[], previewSource?: string) {
    this.name = name ?? 'null-font'
    this.variants = variants ?? []
    this.previewSource = previewSource ?? 'null://fontPreview'
  }
}

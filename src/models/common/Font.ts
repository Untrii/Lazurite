export type FontType = 'normal' | 'italic'
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export interface FontVariant {
  type: FontType
  weight: FontWeight
  source: string
}

export default interface Font {
  name: string
  variants: FontVariant[]
  previewSource: string
}

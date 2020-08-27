export default interface IFontPreset {
  name: string
  family: string
  size: number
  weight: number
}

export function getBlankPreset(): IFontPreset {
  return {
    name: 'New preset',
    family: 'Alegreya',
    size: 48,
    weight: 400,
  }
}

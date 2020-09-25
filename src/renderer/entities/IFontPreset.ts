import randomString from '@/utils/StringGenerator'

export default interface IFontPreset {
  name: string
  family: string
  size: number
  weight: number
  id: string
}

export function getBlankPreset(): IFontPreset {
  return {
    name: 'New preset',
    family: 'Alegreya',
    size: 48,
    weight: 400,
    id: randomString(8),
  }
}

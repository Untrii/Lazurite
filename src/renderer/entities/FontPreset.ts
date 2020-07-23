export default interface FontPreset {
  name: string
  family: string
  size: number
  weight: number
}

export function getBlankPreset(): FontPreset {
  return {
    name: 'New preset',
    family: 'Alegreya',
    size: 48,
    weight: 400,
  }
}

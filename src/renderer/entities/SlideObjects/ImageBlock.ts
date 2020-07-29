import ColorCorrector, { getDefaultCorrection } from './hocs/ColorCorrector'

export default interface ImageBlock extends ColorCorrector {
  src: string
}

export function getBlankObject() {
  let result = {
    src: '',
    ...getDefaultCorrection(),
  }
  result.type = 'ImageBlock'
  return result
}

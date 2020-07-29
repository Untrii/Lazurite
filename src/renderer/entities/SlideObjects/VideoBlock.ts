import ColorCorrector, { getDefaultCorrection } from './hocs/ColorCorrector'

export default interface LocalVideo extends ColorCorrector {
  src: string
}

export function getBlankObject() {
  let result = {
    src: '',
    ...getDefaultCorrection(),
  }
  result.type = 'VideoBlock'
  return result
}

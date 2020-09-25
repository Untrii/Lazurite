import ColorCorrector, { getDefaultCorrection } from './hocs/ColorCorrector'

export default interface IVideoBlock extends ColorCorrector {
  src: string
}

export function getBlankObject(): IVideoBlock {
  let result = {
    src: '',
    ...getDefaultCorrection(),
  }
  result.type = 'VideoBlock'
  return result
}

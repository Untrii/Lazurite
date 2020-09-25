import ColorCorrector, { getDefaultCorrection } from './hocs/ColorCorrector'

export default interface IVideoBlock extends ColorCorrector {
  url: string
}

export function getBlankObject(): IVideoBlock {
  let result = {
    url: '',
    ...getDefaultCorrection(),
  }
  result.type = 'EmbeddedVideoBlock'
  return result
}

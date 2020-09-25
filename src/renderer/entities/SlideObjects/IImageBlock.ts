import ColorCorrector, { getDefaultCorrection } from './hocs/ColorCorrector'

export default interface IImageBlock extends ColorCorrector {
  src: string
}

export function getBlankObject(): IImageBlock {
  let result = {
    src: '',
    ...getDefaultCorrection(),
  }
  result.type = 'ImageBlock'
  return result
}

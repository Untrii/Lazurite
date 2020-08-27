import SlideObject from '@/entities/ISlideObject'
import Color from '@/entities/color'

export default interface TextBlock extends SlideObject {
  fontFamily: string
  fontSize: number
  fontWeight: number
  content: string
  color: Color
  backgroundColor?: Color
  backgroundOpacity: number
  showBorder: boolean
  borderStyle?: BorderStyle
  borderRadius?: number
  borderSize?: number
  verticalAlign: string
  horizontalAlign: string
}

export function getBlankObject(): TextBlock {
  return {
    id: '',
    type: 'TextBlock',
    top: 450,
    left: 750,
    width: 420,
    height: 180,
    verticalAlign: 'flex-start',
    horizontalAlign: 'left',
    content: 'Type here',
    fontFamily: 'pjs0',
    fontSize: 0,
    fontWeight: 400,
    color: new Color(),
    backgroundColor: new Color(true),
    backgroundOpacity: 0,
    showBorder: false,
    borderStyle: BorderStyle.Solid,
    borderRadius: 0,
    borderSize: 0,
  }
}

enum BorderStyle {
  Solid,
  Dotted,
  Dashed,
  Double,
}

import TextStyle from '@/models/presentation/slideObjects/base/TextStyle'

const canvasContext = document.createElement('canvas').getContext('2d')

export default function getTextWidth(textStyle: TextStyle, text: string) {
  const { fontSize, fontWeight, fontFamily } = textStyle
  canvasContext.font = `normal ${fontWeight} ${fontSize}px ${fontFamily}`
  return canvasContext.measureText(text).width
}

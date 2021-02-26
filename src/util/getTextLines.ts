import TextStyle from '@/models/presentation/slideObjects/base/TextStyle'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import getTextWidth from './getTextWidth'

function measureLines(text: string, textStyle: TextStyle, maxWidth: number) {
  const lines = []
  const words = text.split(' ')
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    let word = words[i]
    let width = getTextWidth(textStyle, currentLine + ' ' + word)
    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

export default function getTextLines(textBlock: TextSlideObject) {
  const text = textBlock.content
  const lines = []

  const wrappedLines = text.split('\n')
  wrappedLines.forEach((value) => lines.push(...measureLines(value, textBlock.style, textBlock.width)))

  return lines
}

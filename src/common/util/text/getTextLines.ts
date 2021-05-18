import TextStyle from 'common/models/presentation/slideObjects/base/TextStyle'
import TextSlideObject from 'common/models/presentation/slideObjects/TextSlideObject'
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
      lines.push(currentLine + ' ')
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

export default function getTextLines(textBlock: TextSlideObject, saveReturns = false) {
  const text = textBlock.content
  const lines: string[] = []

  const wrappedLines = text.split('\n')
  wrappedLines.forEach((value, index) => {
    const measuredLines = measureLines(value, textBlock.style, textBlock.width)
    if (saveReturns && index != wrappedLines.length - 1) measuredLines[measuredLines.length - 1] += '\n'
    lines.push(...measuredLines)
  })

  return lines
}

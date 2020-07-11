import Theme, { getBlankTheme } from './Theme'
import SlideObject from './SlideObject'
import Scenary from './Scenary'

export default interface Presentation {
  theme: Theme
  slides: Map<string, SlideObject>[]
  scenaries: Scenary[]
}

export function getBlankPresentation() {
  return {
    theme: getBlankTheme(),
    slides: [],
    scenaries: [],
  }
}

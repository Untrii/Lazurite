import Theme, { getBlankTheme } from './ITheme'
import SlideObject from './ISlideObject'
import Scenary from './IScenary'

export default interface IPresentation {
  theme: Theme;
  slides: Map<string, SlideObject>[];
  scenaries: Scenary[];
}

export function getBlankPresentation() {
  return {
    theme: getBlankTheme(),
    slides: [],
    scenaries: [],
  }
}

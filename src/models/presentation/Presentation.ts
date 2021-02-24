import SlideObject from './slideObjects/base/SlideObject'
import Theme from './theme/Theme'

type SlidesCollection = {
  [id: string]: SlideObject
}[]

export default class Presentation {
  theme = new Theme()
  slides = [] as SlidesCollection[]
}

import Theme from './theme/Theme'
import Slide from './Slide'

export default class Presentation {
  theme = new Theme()
  slides = [] as Slide[]
  resolution = {
    width: 1920,
    height: 1080,
  }
  name = 'My presentation'
  author = 'Lazurite dev'
}

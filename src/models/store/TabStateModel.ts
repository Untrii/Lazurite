import Presentation from '../presentation/Presentation'
import Slide from '../presentation/Slide'

export type EditorWindowName = 'constructor' | 'design' | 'start'

export default class TabStateModel {
  openedPresentation: Presentation
  selectedSlideIndex = 0
  openedEditorWindow = 'constructor' as EditorWindowName
  isStartScreen = false

  get currentSlide(): Slide | undefined {
    return this.openedPresentation.slides[this.selectedSlideIndex]
  }

  get name() {
    if (this.isStartScreen) return 'Start'
    else return this.openedPresentation.name
  }

  constructor(presentation = new Presentation()) {
    this.openedPresentation = presentation
  }

  static get startScreen() {
    const result = new TabStateModel()
    result.isStartScreen = true
    result.openedEditorWindow = 'start'
    return result
  }
}

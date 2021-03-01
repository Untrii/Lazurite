import Presentation from '../presentation/Presentation'
import Slide from '../presentation/Slide'

export type EditorWindowName = 'constructor' | 'design'

export default class TabStateModel {
  openedPresentation: Presentation
  selectedSlideIndex = 0
  openedEditorWindow = 'constructor' as EditorWindowName

  get currentSlide(): Slide | undefined {
    return this.openedPresentation.slides[this.selectedSlideIndex]
  }

  constructor(presentation = new Presentation()) {
    this.openedPresentation = presentation
  }
}

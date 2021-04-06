import ObjectSelection from '../editor/ObjectSelection'
import { AnyTool, PointerTool } from '../editor/Tool'
import Presentation from '../presentation/Presentation'
import Slide from '../presentation/Slide'

export type EditorWindowName = 'constructor' | 'design' | 'start'
export type DesignTab = 'color' | 'typography'
export type ConstructorTab = 'add' | 'edit'

export default class TabStateModel {
  presentationPath: string
  openedPresentation: Presentation
  isStartScreen = false
  openedEditorWindow = 'constructor' as EditorWindowName

  selectedSlideIndex = 0
  openedConstructorTab = 'add' as ConstructorTab
  addTabToolIndex = [0, 0] as [number, number]
  tool = null as AnyTool | null
  selection = new ObjectSelection()

  openededDesignTab = 'color' as DesignTab

  get currentSlide(): Slide | undefined {
    return this.openedPresentation.slides[this.selectedSlideIndex]
  }

  get name() {
    if (this.isStartScreen) return 'Start'
    else return this.openedPresentation.name
  }

  constructor(presentation = new Presentation(), path = null) {
    this.openedPresentation = presentation
    this.presentationPath = path
  }

  static get startScreen() {
    const result = new TabStateModel()
    result.isStartScreen = true
    result.openedEditorWindow = 'start'
    return result
  }
}

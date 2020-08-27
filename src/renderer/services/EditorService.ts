import ReactiveService from './ReactiveService'
import CommonRepository from '@/repositories/CommonRepository'
import VisualisationService from './VisualisationService'
import BlankObjects from '@/entities/slideObjects/BlankObjects'
import ConstructorService from './ConstructorService'
import RuntimeRepository from '@/repositories/RuntimeRepository'
import SlideObject from '@/entities/ISlideObject'

export default class EditorService extends ReactiveService {
  constructor() {
    let currentObj: any = super('EditorService', [CommonRepository, RuntimeRepository])
    return currentObj
  }
  private getObjectFields(obj: object) {
    let result: string[] = []
    for (const key in obj) {
      result.push(key)
    }
    return result
  }

  get isOneElementSelected() {
    return RuntimeRepository.selectedObjectsIds.size == 1
  }

  get selectedElement(): SlideObject | any {
    let vs = new VisualisationService()
    for (const entry of RuntimeRepository.selectedObjectsIds) {
      return vs.elementById(entry)
    }
    return {}
  }

  get isGridEnabled() {
    return RuntimeRepository.isGridEnabled
  }

  get gridSize() {
    return RuntimeRepository.gridSize
  }

  /**
   * Disable or enable grid
   * @param newVal New state
   */
  changeGridState(newVal: boolean) {
    RuntimeRepository.isGridEnabled = newVal
  }

  /**
   * Changes grid size. Variants: 16*9(144) or 32*18(576)
   * @param newVal New size
   */
  changeGridSize(newVal: 144 | 576) {
    RuntimeRepository.gridSize = newVal
  }

  changeSelectedObjectProperty(propertyName: string, newVal: any) {
    let service = new ConstructorService()
    service.changeObjectProperty(service.selectedObjectId ?? '', propertyName, newVal)
  }

  getEditableProperties(elementType: string) {
    console.log('here')
    return this.getObjectFields(BlankObjects[elementType])
  }
}

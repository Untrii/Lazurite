import ReactiveService from './ReactiveService'
import CommonRepository from '@/repositories/CommonRepository'
import VisualisationService from './VisualisationService'
import { getBlankObject as getBlankTextBlock } from '@/entities/SlideObjects/TextBlock'
import { getBlankObject as getBlankImageBlock } from '@/entities/SlideObjects/ImageBlock'
import { getBlankObject as getBlankVideoBlock } from '@/entities/SlideObjects/VideoBlock'
import { getBlankObject as getBlankSpreadsheet } from '@/entities/SlideObjects/Spreadsheet'
import { getBlankObject as getBlankRectangle } from '@/entities/SlideObjects/Rectangle'
import ConstructorService from './ConstructorService'
import RuntimeRepository from '@/repositories/RuntimeRepository'
import SlideObject from '@/entities/SlideObject'

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
    switch (elementType) {
      case 'TextBlock':
        return this.getObjectFields(getBlankTextBlock())
      case 'ImageBlock':
        return this.getObjectFields(getBlankImageBlock())
      case 'VideoBlock':
        return this.getObjectFields(getBlankVideoBlock())
      case 'Spreadsheet':
        return this.getObjectFields(getBlankSpreadsheet())
      case 'Rectangle':
        return this.getObjectFields(getBlankRectangle())
    }
    return []
  }
}

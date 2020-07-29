import ReactiveService from './ReactiveService'
import { Instance } from '@/repositories/CommonRepository'
import VisualisationService from './VisualisationService'
import { getBlankObject as getBlankTextBlock } from '@/entities/SlideObjects/TextBlock'
import { getBlankObject as getBlankImageBlock } from '@/entities/SlideObjects/ImageBlock'
import { getBlankObject as getBlankVideoBlock } from '@/entities/SlideObjects/VideoBlock'
import { getBlankObject as getBlankSpreadsheet } from '@/entities/SlideObjects/Spreadsheet'
import ConstructorService from './ConstructorService'

export default class ResourceService extends ReactiveService {
  private getObjectFields(obj: object) {
    let result: string[] = []
    for (const key in obj) {
      result.push(key)
    }
    return result
  }

  get isOneElementSelected() {
    return Instance.variables.selectedObjectsIds.size == 1
  }

  get selectedElement() {
    let vs = new VisualisationService()
    for (const entry of Instance.variables.selectedObjectsIds) {
      return vs.elementById(entry)
    }
    return {}
  }

  changeSelectedObjectProperty(propertyName: string, newVal: any) {
    let service = new ConstructorService()
    service.changeObjectProperty(
      service.selectedObjectId ?? '',
      propertyName,
      newVal
    )
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
    }
    return []
  }
}

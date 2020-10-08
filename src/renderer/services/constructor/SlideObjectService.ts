import PresentationRepository from '@/repositories/PresentationRepository'
import RuntimeRepository from '@/repositories/RuntimeRepository'
import ISlideObject, { getBlankObject } from '@/entities/ISlideObject'
import ElementPreset from '@/entities/ElementPreset'
import randomString from '@/utils/StringGenerator'
import ConstructorStore from '@/services/store/ConstructorStore'

let presentation = PresentationRepository.Instance
let runtimeData = RuntimeRepository.Instance.data

export default class SlideObjectService {
  async createObject(preset: ElementPreset): Promise<ISlideObject | undefined> {
    let slideObject: any = getBlankObject()

    let parameters = await preset.getParameters()
    for (const key of parameters.keys()) {
      slideObject[key] = parameters.get(key)
    }
    slideObject.id = randomString(12)

    presentation.slides[runtimeData.selectedSlideIndex].set(slideObject.id, slideObject)
    return slideObject
  }
  selectObject(id: string) {
    runtimeData.selectedObjectsIds.add(id)
  }
  deselectObject(id: string) {
    runtimeData.selectedObjectsIds.delete(id)
  }
  deselectAllObjects() {
    runtimeData.selectedObjectsIds.clear()
  }
  deleteObjects(objectIds: Set<string> | string[]) {
    let slides = presentation.slides

    let deletedObjects: ISlideObject[] = []

    for (let objectId of objectIds) {
      let object = slides[runtimeData.selectedSlideIndex].get(objectId)
      if (object) {
        deletedObjects.push(object)
        slides[runtimeData.selectedSlideIndex].delete(objectId)
      }
    }
    return deletedObjects
  }
  copyObjects(objectIds: Set<string>) {
    runtimeData.clipboard.clear()
    let slides = presentation.slides

    for (let objectId of objectIds)
      if (slides[runtimeData.selectedSlideIndex].has(objectId)) {
        let obj = slides[runtimeData.selectedSlideIndex].get(objectId)
        if (obj) runtimeData.clipboard.add(obj)
      }
  }

  pasteObjects() {
    for (const element of runtimeData.clipboard) {
      let elementPreset = new ElementPreset('', '', element.type, element)
      this.createObject(elementPreset)
    }
  }

  changeObjectProperty(objectId: string, propertyName: string, newVal: any) {
    let slides = presentation.slides

    for (let slideMapId in slides) {
      if (slides[slideMapId].has(objectId)) {
        let obj: any = slides[slideMapId].get(objectId)
        obj[propertyName] = newVal
        return
      }
    }
    throw new Error(
      'Unable to change property "' +
        propertyName +
        '" of object with ID ' +
        objectId +
        "\nObject with this ID doesn't exists."
    )
  }

  changeSelectedObjectProperty(propertyName: string, newVal: any) {
    let store = new ConstructorStore()
    this.changeObjectProperty(store.selectedObjectId ?? '', propertyName, newVal)
  }

  changeObjectProperties(objectId: string, properties: any) {
    for (const key in properties) {
      this.changeObjectProperty(objectId, key, properties[key])
    }
  }
}

import PresentationRepository from '@/repositories/PresentationRepository'
import RuntimeRepository from '@/repositories/RuntimeRepository'
import ISlideObject, { getBlankObject } from '@/entities/ISlideObject'
import ElementPreset from '@/entities/ElementPreset'
import randomString from '@/utils/StringGenerator'
import ConstructorStore from '@/services/store/ConstructorStore'

const presentation = PresentationRepository.Instance
const runtimeData = RuntimeRepository.Instance.data

export default class SlideObjectService {
  get maxZIndex() {
    const currentSlide = presentation.slides[runtimeData.selectedSlideIndex]
    let result = -1
    for (const object of currentSlide.values()) {
      result = Math.max(result, object.zIndex)
    }
    return result
  }

  async createObject(preset: ElementPreset): Promise<ISlideObject | undefined> {
    console.log('creating object ' + preset.type)
    const slideObject: any = getBlankObject()

    const parameters = await preset.getParameters()
    for (const key of parameters.keys()) {
      slideObject[key] = parameters.get(key)
    }
    slideObject.id = randomString(12)
    slideObject.zIndex = this.maxZIndex + 1

    presentation.slides[runtimeData.selectedSlideIndex].set(slideObject.id, slideObject)
    return slideObject
  }
  selectObject(id: string) {
    console.log('Object select')
    runtimeData.selectedObjectsIds.add(id)
  }
  deselectObject(id: string) {
    runtimeData.selectedObjectsIds.delete(id)
  }
  deselectAllObjects() {
    runtimeData.selectedObjectsIds.clear()
  }
  deleteObjects(objectIds: Set<string> | string[]) {
    const slides = presentation.slides

    const deletedObjects: ISlideObject[] = []

    for (const objectId of objectIds) {
      const object = slides[runtimeData.selectedSlideIndex].get(objectId)
      if (object) {
        deletedObjects.push(object)
        slides[runtimeData.selectedSlideIndex].delete(objectId)
      }
    }
    return deletedObjects
  }
  copyObjects(objectIds: Set<string>) {
    runtimeData.clipboard.clear()
    const slides = presentation.slides

    for (const objectId of objectIds)
      if (slides[runtimeData.selectedSlideIndex].has(objectId)) {
        const obj = slides[runtimeData.selectedSlideIndex].get(objectId)
        if (obj) runtimeData.clipboard.add(obj)
      }
  }

  async pasteObjects(): Promise<ISlideObject[]> {
    let result: ISlideObject[] = []
    for (const element of runtimeData.clipboard) {
      const elementPreset = new ElementPreset('', '', element.type, element)
      let createdElement = await this.createObject(elementPreset)
      if (createdElement) result.push(createdElement)
    }
    return result
  }

  changeObjectProperty(objectId: string, propertyName: string, newVal: any) {
    const slides = presentation.slides

    for (const slideMapId in slides) {
      if (slides[slideMapId].has(objectId)) {
        const obj: any = slides[slideMapId].get(objectId)
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
    const store = new ConstructorStore()
    this.changeObjectProperty(store.selectedObjectId ?? '', propertyName, newVal)
  }

  changeObjectProperties(objectId: string, properties: any) {
    for (const key in properties) {
      this.changeObjectProperty(objectId, key, properties[key])
    }
  }

  changeObjectZIndex(objectId: string, delta: number) {
    if (delta == 0) return
    const store = new ConstructorStore()
    const currentSlide = store.slideByIndex(store.selectedSlideIndex)
    const targetObject = currentSlide.get(objectId)
    if (!targetObject) return
    const oldZIndex = targetObject.zIndex
    let newZIndex = oldZIndex + delta
    newZIndex = Math.max(newZIndex, 0)
    newZIndex = Math.min(newZIndex, currentSlide.size - 1)
    for (const object of currentSlide.values()) {
      if (delta < 0) {
        console.log(`${object.zIndex} -> ${object.zIndex + 1}`)
        if (object.zIndex < oldZIndex && object.zIndex >= newZIndex) object.zIndex++
      }
      if (delta > 0) {
        console.log(`${object.zIndex} -> ${object.zIndex - 1}`)
        if (object.zIndex <= newZIndex && object.zIndex > oldZIndex) object.zIndex--
      }
    }
    targetObject.zIndex = newZIndex
    console.log(`${oldZIndex} -> ${newZIndex}`)
  }
}

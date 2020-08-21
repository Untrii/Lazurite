import CommonRepository from '@/repositories/CommonRepository'
import ReactiveService from './ReactiveService'
import { getBlankObject } from '@/entities/SlideObject'
import Presentation from '@/entities/Presentation'
import ElementPreset from '@/entities/ElementPreset'
import randomString from '@/utils/StringGenerator'
import RuntimeRepository from '@/repositories/RuntimeRepository'

export default class ConstructorService extends ReactiveService {
  constructor() {
    super()
    CommonRepository.addOnChangeListener(() => this.onChange())
    RuntimeRepository.addOnChangeListener(() => this.onChange())
  }

  selectSlide(index: number) {
    RuntimeRepository.selectedSlideIndex = index
    this.deselectAllObjects()
    CommonRepository.onChange()
  }
  createSlide() {
    if (!CommonRepository.isPresentationOpened) return
    let presentation = CommonRepository.openedPresentation
    presentation?.slides.push(new Map())
    CommonRepository.commitPresentationChanges()
  }
  deleteSlide(index: number) {
    if (!CommonRepository.isPresentationOpened) return
    let slides = CommonRepository.openedPresentation?.slides
    slides = slides?.splice(index, 1)
    CommonRepository.commitPresentationChanges()
  }

  async createObject(preset: ElementPreset) {
    console.log('Creating ' + preset.type + '...')
    if (!CommonRepository.openedPresentation || this.selectedSlideIndex == undefined) return
    let slideObject: any = getBlankObject()
    slideObject.id = randomString(12)
    slideObject.type = preset.type

    let parameters = await preset.getParameters()
    for (const key of parameters.keys()) {
      slideObject[key] = parameters.get(key)
    }
    CommonRepository.openedPresentation.slides[this.selectedSlideIndex].set(slideObject.id, slideObject)
    CommonRepository.commitPresentationChanges()
  }
  selectObject(id: string) {
    RuntimeRepository.selectedObjectsIds.add(id)
    CommonRepository.onChange()
  }
  deselectObject(id: string) {
    RuntimeRepository.selectedObjectsIds.delete(id)
    CommonRepository.onChange()
  }
  deselectAllObjects() {
    RuntimeRepository.selectedObjectsIds.clear()
    CommonRepository.onChange()
  }
  deleteObjects(objectIds: Set<string> | string[]) {
    if (!CommonRepository.openedPresentation) return
    let slides = CommonRepository.openedPresentation.slides

    for (let objectId of objectIds)
      if (slides[RuntimeRepository.selectedSlideIndex].has(objectId)) {
        slides[RuntimeRepository.selectedSlideIndex].delete(objectId)
      }
    CommonRepository.commitPresentationChanges()
  }
  copyObjects(objectIds: Set<string>) {
    RuntimeRepository.clipboard.clear()
    if (CommonRepository.openedPresentation == undefined) return
    let slides = CommonRepository.openedPresentation.slides

    for (let objectId of objectIds)
      if (slides[RuntimeRepository.selectedSlideIndex].has(objectId)) {
        let obj = slides[RuntimeRepository.selectedSlideIndex].get(objectId)
        if (obj) RuntimeRepository.clipboard.add(obj)
      }
    CommonRepository.commitPresentationChanges()
  }

  changeObjectProperty(objectId: string, propertyName: string, newVal: any, notReactive?: boolean) {
    if (!CommonRepository.openedPresentation) return
    let slides = CommonRepository.openedPresentation.slides

    for (let slideMapId in slides) {
      if (slides[slideMapId].has(objectId)) {
        let obj: any = slides[slideMapId].get(objectId)
        obj[propertyName] = newVal
        if (!notReactive) CommonRepository.commitPresentationChanges()
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

  changeObjectProperties(objectId: string, properties: any) {
    for (const key in properties) {
      this.changeObjectProperty(objectId, key, properties[key], true)
    }
    CommonRepository.commitPresentationChanges()
  }

  changePreviewModuleSize(newSize: number) {
    if (CommonRepository.settings) CommonRepository.settings.previewModuleSize = newSize
    this.onChange()
  }
  changeInstrumentsModuleSize(newSize: number) {
    if (CommonRepository.settings) CommonRepository.settings.instrumentsModuleSize = newSize
    this.onChange()
  }
  changeTimelineModuleSize(newSize: number) {
    if (CommonRepository.settings) CommonRepository.settings.timelineModuleSize = newSize
    this.onChange()
  }

  get selectedSlideIndex(): number | undefined {
    return RuntimeRepository.selectedSlideIndex
  }
  get selectedObjectId(): string | undefined {
    if (RuntimeRepository.selectedObjectsIds.size == 1)
      for (let index of RuntimeRepository.selectedObjectsIds) return index
    return undefined
  }
  get selectedObjectIds(): string[] {
    return Array.from(RuntimeRepository.selectedObjectsIds.values())
  }

  get previewModuleSize(): number | undefined {
    return CommonRepository.settings?.previewModuleSize
  }
  get instrumentsModuleSize(): number | undefined {
    return CommonRepository.settings?.instrumentsModuleSize
  }
  get timelineModuleSize(): number | undefined {
    return CommonRepository.settings?.timelineModuleSize
  }

  get presentation(): Presentation | undefined {
    return CommonRepository.openedPresentation
  }
}

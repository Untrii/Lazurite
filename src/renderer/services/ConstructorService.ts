import { Instance } from '@/repositories/CommonRepository'
import ReactiveService from './ReactiveService'
import { getBlankObject } from '@/entities/SlideObject'
import Presentation from '@/entities/Presentation'
import ElementPreset from '@/entities/ElementPreset'
import randomString from '@/utils/StringGenerator'

export default class ConstructorService extends ReactiveService {
  constructor() {
    super()
  }

  selectSlide(index: number) {
    Instance.variables.selectedSlideIndex = index
    Instance.onChange()
  }
  createSlide() {
    if (!Instance.isPresentationOpened) return
    let presentation = Instance.openedPresentation
    presentation?.slides.push(new Map())
    Instance.commitPresentationChanges()
  }
  deleteSlide(index: number) {
    if (!Instance.isPresentationOpened) return
    let slides = Instance.openedPresentation?.slides
    slides = slides?.splice(index, 1)
    Instance.commitPresentationChanges()
  }

  async createObject(preset: ElementPreset) {
    console.log('Creating ' + preset.type + '...')
    if (!Instance.openedPresentation || this.selectedSlideIndex == undefined)
      return
    let slideObject: any = getBlankObject()
    slideObject.id = randomString(12)
    slideObject.type = preset.type

    let parameters = await preset.getParameters()
    for (const key of parameters.keys()) {
      slideObject[key] = parameters.get(key)
    }
    Instance.openedPresentation.slides[this.selectedSlideIndex].set(
      slideObject.id,
      slideObject
    )
    Instance.commitPresentationChanges()
  }
  selectObject(id: string) {
    Instance.variables.selectedObjectsIds.add(id)
    Instance.onChange()
  }
  deselectObject(id: string) {
    Instance.variables.selectedObjectsIds.delete(id)
    Instance.onChange()
  }
  deselectAllObjects() {
    Instance.variables.selectedObjectsIds.clear()
    Instance.onChange()
  }
  deleteObjects(objectIds: Set<string> | string[]) {
    if (!Instance.openedPresentation) return
    let slides = Instance.openedPresentation.slides

    for (let objectId of objectIds)
      if (slides[Instance.variables.selectedSlideIndex].has(objectId)) {
        slides[Instance.variables.selectedSlideIndex].delete(objectId)
      }
    Instance.commitPresentationChanges()
  }
  copyObjects(objectIds: Set<string>) {
    Instance.variables.clipboard.clear()
    if (Instance.openedPresentation == undefined) return
    let slides = Instance.openedPresentation.slides

    for (let objectId of objectIds)
      if (slides[Instance.variables.selectedSlideIndex].has(objectId)) {
        let obj = slides[Instance.variables.selectedSlideIndex].get(objectId)
        if (obj) Instance.variables.clipboard.add(obj)
      }
    Instance.commitPresentationChanges()
  }

  changeObjectProperty(objectId: string, propertyName: string, newVal: any) {
    if (!Instance.openedPresentation) return
    let slides = Instance.openedPresentation.slides

    for (let slideMapId in slides) {
      if (slides[slideMapId].has(objectId)) {
        let obj: any = slides[slideMapId].get(objectId)
        obj[propertyName] = newVal
        Instance.commitPresentationChanges()
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
      this.changeObjectProperty(objectId, key, properties[key])
    }
  }

  changePreviewModuleSize(newSize: number) {
    if (Instance.settings) Instance.settings.previewModuleSize = newSize
    this.onChange()
  }
  changeInstrumentsModuleSize(newSize: number) {
    if (Instance.settings) Instance.settings.instrumentsModuleSize = newSize
    this.onChange()
  }
  changeTimelineModuleSize(newSize: number) {
    if (Instance.settings) Instance.settings.timelineModuleSize = newSize
    this.onChange()
  }

  get selectedSlideIndex(): number | undefined {
    return Instance.variables.selectedSlideIndex
  }
  get selectedObjectId(): string | undefined {
    if (Instance.variables.selectedObjectsIds.size == 1)
      for (let index of Instance.variables.selectedObjectsIds) return index
    return undefined
  }
  get selectedObjectIds(): string[] {
    return Array.from(Instance.variables.selectedObjectsIds.values())
  }

  get previewModuleSize(): number | undefined {
    return Instance.settings?.previewModuleSize
  }
  get instrumentsModuleSize(): number | undefined {
    return Instance.settings?.instrumentsModuleSize
  }
  get timelineModuleSize(): number | undefined {
    return Instance.settings?.timelineModuleSize
  }

  get presentation(): Presentation | undefined {
    return Instance.openedPresentation
  }
}

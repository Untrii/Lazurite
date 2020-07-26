import { Instance } from '@/repositories/CommonRepository'
import ReactiveService from './ReactiveService'
import SlideObject, { getBlankObject } from '@/entities/SlideObject'
import Presentation from '@/entities/Presentation'
import ElementPreset from '@/entities/ElementPreset'
import randomString from '@/utils/StringGenerator'

export default class ConstructorService extends ReactiveService {
  private _selectedObjectIds: Set<string>
  private clipboard: Set<SlideObject>

  constructor() {
    super()
    Instance.variables.selectedSlideIndex = 0
    this._selectedObjectIds = new Set()
    this.clipboard = new Set()
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

  createObject(preset: ElementPreset) {
    console.log('Creating ' + preset.type + '...')
    if (!Instance.openedPresentation || this.selectedSlideIndex == undefined)
      return
    let slideObject: any = getBlankObject()
    slideObject.id = randomString(12)
    slideObject.type = preset.type
    for (const key of preset.prameters.keys()) {
      slideObject[key] = preset.prameters.get(key)
    }
    Instance.openedPresentation.slides[this.selectedSlideIndex].set(
      slideObject.id,
      slideObject
    )
    Instance.commitPresentationChanges()
  }
  selectObject(id: string) {
    this._selectedObjectIds.add(id)
    this.onChange()
  }
  deselectObject(id: string) {
    this._selectedObjectIds.delete(id)
    this.onChange()
  }
  deselectAllObjects() {
    this._selectedObjectIds.clear()
    this.onChange()
  }
  deleteObjects(objectIds: Set<string>) {
    if (!Instance.openedPresentation) return
    let slides = Instance.openedPresentation.slides

    for (let objectId of objectIds)
      if (slides[Instance.variables.selectedSlideIndex].has(objectId)) {
        slides[Instance.variables.selectedSlideIndex].delete(objectId)
      }
    Instance.commitPresentationChanges()
  }
  copyObjects(objectIds: Set<string>) {
    this.clipboard.clear()
    if (Instance.openedPresentation == undefined) return
    let slides = Instance.openedPresentation.slides

    for (let objectId of objectIds)
      if (slides[Instance.variables.selectedSlideIndex].has(objectId)) {
        let obj = slides[Instance.variables.selectedSlideIndex].get(objectId)
        if (obj) this.clipboard.add(obj)
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
    if (this._selectedObjectIds.size == 1)
      for (let index of this._selectedObjectIds) return index
    return undefined
  }
  get selectedObjectIds(): string[] {
    return Array.from(this._selectedObjectIds.values())
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

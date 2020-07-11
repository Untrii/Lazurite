import { Instance } from '../repository/CommonRepository'
import ReactiveService from './ReactiveService'
import SlideObject from '../entities/SlideObject'
import Presentation from '../entities/Presentation'

export default class ConstructorService extends ReactiveService {
  private _selectedSlideIndex: number
  private _selectedObjectIds: Set<string>
  private clipboard: Set<SlideObject>

  constructor() {
    super()
    this._selectedSlideIndex = 0
    this._selectedObjectIds = new Set()
    this.clipboard = new Set()

    Instance.addOnChangeListener(() => {
      this.onChange()
    })
  }

  selectSlide(index: number) {
    this._selectedSlideIndex = index
    this.onChange()
  }
  createSlide() {
    if (!Instance.isPresentationOpened) return
    let presentation = Instance.openedPresentation
    presentation?.slides.push(new Map())
    Instance.openedPresentation = Instance.openedPresentation
    this.onChange()
  }
  deleteSlide(index: number) {
    if (!Instance.isPresentationOpened) return
    let slides = Instance.openedPresentation?.slides
    slides = slides?.splice(index, 1)
    Instance.openedPresentation = Instance.openedPresentation
    this.onChange()
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
      if (slides[this._selectedSlideIndex].has(objectId)) {
        slides[this._selectedSlideIndex].delete(objectId)
      }
    Instance.openedPresentation = Instance.openedPresentation
    this.onChange()
  }
  copyObjects(objectIds: Set<string>) {
    this.clipboard.clear()
    if (Instance.openedPresentation == undefined) return
    let slides = Instance.openedPresentation.slides

    for (let objectId of objectIds)
      if (slides[this._selectedSlideIndex].has(objectId)) {
        let obj = slides[this._selectedSlideIndex].get(objectId)
        if (obj) this.clipboard.add(obj)
      }
    Instance.openedPresentation = Instance.openedPresentation
    this.onChange()
  }

  changeObjectProperty(objectId: string, propertyName: string, newVal: any) {
    if (!Instance.openedPresentation) return
    let slides = Instance.openedPresentation.slides

    for (let slideMapId in slides) {
      if (slides[slideMapId].has(objectId)) {
        let obj: any = slides[slideMapId].get(objectId)
        obj[propertyName] = newVal
        Instance.openedPresentation = Instance.openedPresentation
        this.onChange()
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
    return this._selectedSlideIndex
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

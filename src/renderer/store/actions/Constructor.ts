import { requireResourceAsync } from '@/dataLoader'
import Font from 'common/models/common/Font'
import { AnyTool } from 'common/models/editor/Tool'
import SlideObject from 'common/models/presentation/slideObjects/base/SlideObject'
import ImageSlideObject from 'common/models/presentation/slideObjects/ImageSlideObject'
import TextSlideObject from 'common/models/presentation/slideObjects/TextSlideObject'
import store, { StoreType } from '@/store'
import getFontFamilyName from 'common/util/text/getFontFamilyName'

export default class ConstructorActions {
  async createSlide(this: StoreType) {
    this.currentTab.openedPresentation.slides.push([])
    await this.saveCurrentPresentation()
  }

  async deleteSlide(this: StoreType, index: number) {
    store.currentTab.selection.clear()

    const slides = store.currentTab.openedPresentation.slides
    if (index >= 0 && index < slides.length) {
      const [slide] = slides.splice(index, 1)
      this.clearEventListeners('slideChange', slide)
    }
    await this.saveCurrentPresentation()
  }

  selectSlide(this: StoreType, index: number) {
    if (this.currentTab.selectedSlideIndex == index) return

    this.currentTab.selectedSlideIndex = index
    this.currentTab.selection.clear()
    this.currentTab.hoveredObject = null
    this.onCurrentSlideChange()
  }

  setTool(this: StoreType, index: [number, number], tool: AnyTool) {
    this.currentTab.addTabToolIndex = index
    this.currentTab.tool = tool
  }

  async addObjectOnSlide(this: StoreType, object: SlideObject) {
    const slide = this.getCurrentSlide()
    if (slide) {
      slide.push(object)
    }
    this.onCurrentSlideChange()
    await this.saveCurrentPresentation()
  }

  async ifSingle<T extends SlideObject>(
    this: StoreType,
    callback: (item: T) => Promise<void> | void,
    ctor?: { new (): T }
  ) {
    const objects = this.getSelectedObjects()
    if (objects.length != 1) return
    const object = objects[0]
    if (ctor && object.type != ctor.name) return

    let result = callback(object as T)
    if (result instanceof Promise) await result
  }

  async changeSelectedObjectProperty<T extends SlideObject>(this: StoreType, propertyName: keyof T, value: T[keyof T]) {
    await this.ifSingle(async (object) => {
      if (typeof object?.[propertyName as string] == 'undefined') return
      ;(object as T)[propertyName] = value
      this.onCurrentSlideChange()
      await this.saveCurrentPresentation()
    })
  }

  async changeFontWeight(this: StoreType, newWeight: number) {
    await this.ifSingle(async (object) => {
      const font = this.getFontBySource(object.style.fontSource)
      for (const variant of font.variants) {
        if (variant.weight == newWeight && variant.type == object.style.fontType) {
          object.style.fontWeight = newWeight
          object.style.fontSource = variant.source
          object.style.fontFamily = getFontFamilyName(variant.source)
        }
      }
      this.onCurrentSlideChange()
      await this.saveCurrentPresentation()
    }, TextSlideObject)
  }

  async changeFontFamily(this: StoreType, font: Font) {
    await this.ifSingle(async (object) => {
      let isChanged = false

      for (const variant of font.variants) {
        if (variant.weight == object.style.fontWeight && variant.type == object.style.fontType) {
          object.style.fontSource = variant.source
          object.style.fontFamily = getFontFamilyName(variant.source)
          isChanged = true
        }
      }

      if (!isChanged) {
        const variant = font.defaultVariant
        object.style.fontSource = variant.source
        object.style.fontFamily = getFontFamilyName(variant.source)
        object.style.fontWeight = variant.weight
        object.style.fontType = variant.type
      }

      this.onCurrentSlideChange()
      await this.saveCurrentPresentation()
    }, TextSlideObject)
  }

  async restoreImageProportions(this: StoreType) {
    await this.ifSingle(async (object) => {
      const resource = (await requireResourceAsync(object.src)) as HTMLImageElement
      object.height = (object.width * resource.naturalHeight) / resource.naturalWidth

      this.onCurrentSlideChange()
      await this.saveCurrentPresentation()
    }, ImageSlideObject)
  }

  async restoreImageSize(this: StoreType) {
    await this.ifSingle(async (object) => {
      const resource = (await requireResourceAsync(object.src)) as HTMLImageElement
      object.height = resource.naturalHeight
      object.width = resource.naturalWidth

      this.onCurrentSlideChange()
      await this.saveCurrentPresentation()
    }, ImageSlideObject)
  }
}

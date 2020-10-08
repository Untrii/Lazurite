import PresentationRepository from '@/repositories/PresentationRepository'
import RuntimeRepository from '@/repositories/NewRuntimeRepository'
import IPresentation from '@/entities/IPresentation'
import ISlideObject, { getBlankObject } from '@/entities/ISlideObject'
import BlankObjects from '@/entities/slideObjects/BlankObjects'
import { promises as fs } from 'fs'

let presentation = PresentationRepository.Instance
let runtimeData = RuntimeRepository.Instance.data

export default class ConstrctorStore {
  get selectedSlideIndex(): number | undefined {
    return runtimeData.selectedSlideIndex
  }
  get selectedObjectId(): string | undefined {
    if (runtimeData.selectedObjectsIds.size == 1)
      for (let index of runtimeData.selectedObjectsIds) return index
    return undefined
  }
  get selectedObjectIds(): string[] {
    return Array.from(runtimeData.selectedObjectsIds.values())
  }

  get previewModuleSize(): number {
    return runtimeData.previewModuleSize
  }
  get instrumentsModuleSize(): number {
    return runtimeData.instrumentsModuleSize
  }
  get timelineModuleSize(): number {
    return runtimeData.timelineModuleSize
  }

  get presentation(): IPresentation {
    return presentation
  }

  get isOneElementSelected() {
    return runtimeData.selectedObjectsIds.size == 1
  }

  get selectedElement(): ISlideObject | any {
    for (const entry of runtimeData.selectedObjectsIds) {
      return this.elementById(entry)
    }
    return {}
  }

  get isGridEnabled() {
    return runtimeData.isGridEnabled
  }

  get gridSize() {
    return runtimeData.gridSize
  }

  get resourceFolder() {
    return presentation.presentationPath + '/workspace'
  }

  elementById(id: string): ISlideObject {
    for (let slide of presentation.slides) {
      if (slide.has(id)) {
        let res = slide.get(id)
        if (res) return res
      }
    }
    return getBlankObject()
  }

  slideByIndex(index: number): Map<string, ISlideObject> {
    if (index >= 0) {
      if (presentation.slides.length <= index) return new Map()
      let res: any = presentation.slides
      return new Map(res[index])
    }
    return new Map()
  }

  private getObjectFields(obj: object) {
    let result: string[] = []
    for (const key in obj) {
      result.push(key)
    }
    return result
  }
  getEditableProperties(elementType: string) {
    console.log('here')
    return this.getObjectFields(BlankObjects[elementType])
  }

  async getResourceFiles(type: 'image' | 'video'): Promise<string[]> {
    try {
      let stats = await fs.lstat(this.resourceFolder)
      if (!stats.isDirectory()) return []

      let allFiles = await fs.readdir(this.resourceFolder)
      let filteredFiles: string[] = []
      for (const item of allFiles) {
        if (type == 'image') {
          if (item.endsWith('.jpg') || item.endsWith('.png')) {
            filteredFiles.push(item)
          }
        } else {
          if (item.endsWith('.mp4')) {
            filteredFiles.push(item)
          }
        }
      }
      return filteredFiles
    } catch {
      return []
    }
  }
}

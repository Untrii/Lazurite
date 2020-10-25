import IHistoryRecord from '@/entities/history/IHistoryRecord'
import IWaybackProperties from '@/entities/history/IWaybackProperties'
import IHistoryDeclarationInfo from '@/entities/history/IHistoryDeclarationInfo'
import IHistoryRecordInfo from '@/entities/history/IHistoryRecordInfo'
import ISlideObject from '@/entities/ISlideObject'
import SlideObjectService from './SlideObjectService'
import SlideService from './SlideService'
import HistoryRepository from '@/repositories/HistoryRepository'
import PresentationRepository from '@/repositories/PresentationRepository'

const slideObjectService = new SlideObjectService()
const slideService = new SlideService()

const history = HistoryRepository.Instance
const presentation = PresentationRepository.Instance

export default class HistoryService {
  getHistory(): IHistoryDeclarationInfo {
    console.log('here')
    const undoInfo: IHistoryRecordInfo[] = []
    const redoInfo: IHistoryRecordInfo[] = []

    const undo = [...history.undo].reverse()
    const redo = history.redo

    const getIconByType = function(type: string) {
      switch (type) {
        case 'resizeElement':
          return 'resize'
        case 'moveElement':
          return 'move'
        case 'changeElementProperty':
          return 'logo'
        case 'textChange':
          return 'draw'
        case 'colorCorrectionChange':
          return 'rgb'
        case 'deleteSlide':
        case 'deleteElement':
          return 'delete_element'
        case 'createSlide':
        case 'createElement':
          return 'add_element'
        default:
          return 'logo'
      }
    }

    for (let i = 0; i < undo.length; i++) {
      undoInfo.push({
        icon: getIconByType(undo[i].actionType),
        actionType: undo[i].actionType,
        index: i,
      })
    }
    for (let i = 0; i < redo.length; i++) {
      redoInfo.push({
        icon: getIconByType(redo[i].actionType),
        actionType: redo[i].actionType,
        index: i,
      })
    }

    return {
      redo: redoInfo,
      undo: undoInfo,
    }
  }

  async undo(count: number) {
    const undo = history.undo
    const redo = history.redo
    for (let i = 0; i < count; i++) {
      const record = undo.pop()
      if (record) {
        redo.push(record)
        this[record.waybackFunction](record)
      }
    }
  }
  async redo(count: number) {
    const undo = history.undo
    const redo = history.redo
    for (let i = 0; i < count; i++) {
      const record = redo.pop()
      if (record) {
        undo.push(record)
        this[record.waybackFunction](record, true)
      }
    }
  }

  /**
   * Adds in history resize action
   * @param id Element id
   * @param oldVal Old value
   * @param newVal New value
   */
  registerElementResize(
    id: string,
    oldVal: {
      height: number
      width: number
      top: number
      left: number
    },
    newVal: {
      height: number
      width: number
      top: number
      left: number
    }
  ) {
    let isChanged = false
    for (const key in oldVal) {
      if (oldVal[key] != newVal[key]) isChanged = true
    }
    if (isChanged) this.registerAction('resizeElement', { id }, oldVal, newVal)
  }

  /**
   * Adds in history move action
   * @param id Element id
   * @param oldVal Old value
   * @param newVal New value
   */
  registerElementMove(id: string, oldVal: { top: number; left: number }, newVal: { top: number; left: number }) {
    let isChanged = false
    for (const key in oldVal) {
      if (oldVal[key] != newVal[key]) isChanged = true
    }
    if (isChanged) this.registerAction('moveElement', { id }, oldVal, newVal)
  }

  registerPropertyChange(id: string, propertyName: string, oldVal: any, newVal: any) {
    const old: any = {}
    old[propertyName] = oldVal

    const rnew: any = {}
    rnew[propertyName] = newVal

    this.registerAction('changeElementProperty', { id }, old, rnew)
  }

  registerTextChange(id: string, oldVal: string, newVal: string) {
    this.registerAction('textChange', { id }, { content: oldVal }, { content: newVal })
  }

  registerColorCorrection(id: string, parameter: string, oldVal: string, newVal: string) {
    this.registerAction('colorCorrectionChange', { id }, { [parameter]: oldVal }, { [parameter]: newVal })
  }

  registerSlideDelete(index: number, slideData: Map<string, ISlideObject>) {
    console.log('registering slide delete')
    this.registerAction('deleteSlide', { index }, slideData, {})
  }

  registerSlideCreate() {
    this.registerAction('createSlide', { index: presentation.slides.length }, null, null)
  }

  registerElementDelete(elements: ISlideObject[], slideIndex: number) {
    const ids: string[] = []
    for (const item of elements) {
      ids.push(item.id)
    }
    this.registerAction('deleteElement', { id: ids.join(';'), index: slideIndex }, elements, null)
  }

  registerElementCreate(element: ISlideObject, slideIndex: number) {
    this.registerAction('createElement', { id: element.id, index: slideIndex }, element, null)
  }

  async registerAction(actionType: string, waybackArgs: IWaybackProperties, oldValue: any, newValue: any) {
    console.log('registering action')
    const newRecord: IHistoryRecord = {
      actionType,
      timeStamp: new Date().getTime(),
      waybackFunction: 'nullWayback',
      waybackArguments: waybackArgs,
      oldValue: oldValue,
      newValue: newValue,
    }

    let isStackAllowed = false

    switch (actionType) {
      case 'resizeElement':
      case 'moveElement':
      case 'changeElementProperty':
      case 'textChange':
      case 'colorCorrectionChange':
        newRecord.waybackFunction = 'changeElementWayback'
        isStackAllowed = true
        break
      case 'deleteSlide':
        newRecord.waybackFunction = 'deleteSlideWayback'
        break
      case 'createSlide':
        newRecord.waybackFunction = 'createSlideWayback'
        break
      case 'deleteElement':
        newRecord.waybackFunction = 'deleteElementWayback'
        break
      case 'createElement':
        newRecord.waybackFunction = 'createElementWayback'
        break
    }

    history.redo
    if (isStackAllowed && history.undo.length > 0) {
      const lastElem = history.undo[history.undo.length - 1]
      if (
        lastElem.actionType == newRecord.actionType &&
        lastElem.waybackArguments.id == newRecord.waybackArguments.id &&
        newRecord.timeStamp - lastElem.timeStamp < 500
      ) {
        const popped = history.undo.pop()
        newRecord.oldValue = popped?.oldValue
      }
    }
    history.undo.push(newRecord)
  }

  /**
   * Wayback function for move, resize, property change
   * @param record History record
   * @param reverse true for redo
   */
  changeElementWayback(record: IHistoryRecord, reverse?: boolean) {
    //args: any, oldValue: object, newValue: object
    const id = record.waybackArguments?.id ?? 'null'
    slideObjectService.changeObjectProperties(id, reverse ? record.newValue : record.oldValue)
  }

  deleteSlideWayback(record: IHistoryRecord, reverse?: boolean) {
    if (!reverse) {
      const newSlideArray: Map<string, ISlideObject>[] = []
      const oldSlideArray = presentation.slides
      for (let i = 0; i < oldSlideArray.length; i++) {
        const slide = oldSlideArray[i]
        if (i == record.waybackArguments.index) newSlideArray.push(record.oldValue)
        newSlideArray.push(slide)
      }
      if (record.waybackArguments.index == oldSlideArray.length) newSlideArray.push(record.oldValue)
      presentation.slides = newSlideArray
    } else {
      slideService.deleteSlide(record.waybackArguments.index ?? 0)
    }
  }

  createSlideWayback(record: IHistoryRecord, reverse?: boolean) {
    if (!reverse) {
      if (record.waybackArguments.index) slideService.deleteSlide(record.waybackArguments.index)
    } else {
      slideService.createSlide()
    }
  }

  deleteElementWayback(record: IHistoryRecord, reverse?: boolean) {
    if (!reverse) {
      const slide = presentation.slides[record.waybackArguments.index ?? 0]
      for (const item of record.oldValue) {
        slide.set(item.id, item)
      }
    } else {
      const slide = presentation.slides[record.waybackArguments.index ?? 0]
      for (const item of record.oldValue) {
        try {
          slide.delete(item.id)
        } catch {}
      }
    }
  }

  createElementWayback(record: IHistoryRecord, reverse?: boolean) {
    const slide = presentation.slides[record.waybackArguments.index ?? 0]
    if (!reverse) {
      slide.delete(record.waybackArguments.id ?? '')
    } else {
      slide.set(record.oldValue.id, record.oldValue)
    }
  }
}

import HistoryRepository from '@/repositories/HistoryRepository'
import ReactiveService from '@/services/ReactiveService'
import HistoryRecord from '@/entities/history/HistoryRecord'
import ConstructorService from './ConstructorService'
import WaybackProperties from '@/entities/history/WaybackProperties'
import HistoryDeclarationInfo from '@/entities/history/HistoryDeclarationInfo'
import HistoryRecordInfo from '@/entities/history/HistoryRecordInfo'
import SlideObject from '@/entities/SlideObject'
import CommonRepository from '@/repositories/CommonRepository'

let constructorService = new ConstructorService()

export default class HistoryService extends ReactiveService {
  constructor() {
    super()
    HistoryRepository.addOnChangeListener(() => this.onChange())
  }
  async getHistory(): Promise<HistoryDeclarationInfo> {
    console.log('here')
    let undoInfo: HistoryRecordInfo[] = []
    let redoInfo: HistoryRecordInfo[] = []

    let history = await HistoryRepository.getFile()
    let undo = [...history.undo].reverse()
    let redo = history.redo

    /* | 'resizeElement'
      | 'moveElement'
      | 'changeElementProperty'
      | 'textChange'
      | 'colorCorrectionChange'
      | 'deleteSlide'
      | 'createSlide'
      | 'deleteElement'
      | 'createElement',*/

    let getIconByType = function(type: string) {
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
    let history = await HistoryRepository.getFile()
    let undo = history.undo
    let redo = history.redo
    for (let i = 0; i < count; i++) {
      let record = undo.pop()
      if (record) {
        redo.push(record)
        this[record.waybackFunction](record)
      }
    }
    await HistoryRepository.setFile(history)
  }
  async redo(count: number) {
    let history = await HistoryRepository.getFile()
    let undo = history.undo
    let redo = history.redo
    for (let i = 0; i < count; i++) {
      let record = redo.pop()
      if (record) {
        undo.push(record)
        this[record.waybackFunction](record, true)
      }
    }

    await HistoryRepository.setFile(history)
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
    let old: any = {}
    old[propertyName] = oldVal

    let rnew: any = {}
    rnew[propertyName] = newVal

    this.registerAction('changeElementProperty', { id }, old, rnew)
  }

  registerTextChange(id: string, oldVal: string, newVal: string) {
    this.registerAction('textChange', { id }, { content: oldVal }, { content: newVal })
  }

  registerColorCorrection(id: string, parameter: string, oldVal: string, newVal: string) {
    this.registerAction('colorCorrectionChange', { id }, { [parameter]: oldVal }, { [parameter]: newVal })
  }

  registerSlideDelete(index: number, slideData: Map<string, SlideObject>) {
    console.log('registering slide delete')
    this.registerAction('deleteSlide', { index }, slideData, {})
  }

  registerSlideCreate() {
    this.registerAction('createSlide', { index: CommonRepository.openedPresentation?.slides.length }, null, null)
  }

  registerElementDelete(elements: SlideObject[], slideIndex: number) {
    let ids: string[] = []
    for (const item of elements) {
      ids.push(item.id)
    }
    this.registerAction('deleteElement', { id: ids.join(';'), index: slideIndex }, elements, null)
  }

  registerElementCreate(element: SlideObject, slideIndex: number) {
    this.registerAction('createElement', { id: element.id, index: slideIndex }, element, null)
  }

  async registerAction(
    actionType:
      | 'resizeElement'
      | 'moveElement'
      | 'changeElementProperty'
      | 'textChange'
      | 'colorCorrectionChange'
      | 'deleteSlide'
      | 'createSlide'
      | 'deleteElement'
      | 'createElement',

    waybackArgs: WaybackProperties,
    oldValue: any,
    newValue: any
  ) {
    console.log('registering action')
    let newRecord: HistoryRecord = {
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
    let history = await HistoryRepository.getFile()
    history.redo = []
    if (isStackAllowed && history.undo.length > 0) {
      let lastElem = history.undo[history.undo.length - 1]
      if (
        lastElem.actionType == newRecord.actionType &&
        lastElem.waybackArguments.id == newRecord.waybackArguments.id &&
        newRecord.timeStamp - lastElem.timeStamp < 500
      ) {
        let popped = history.undo.pop()
        newRecord.oldValue = popped?.oldValue
      }
    }
    history.undo.push(newRecord)

    await HistoryRepository.setFile(history)
    this.onChange()
  }

  /**
   * Wayback function for move, resize, property change
   * @param record History record
   * @param reverse true for redo
   */
  changeElementWayback(record: HistoryRecord, reverse?: boolean) {
    //args: any, oldValue: object, newValue: object
    let id = record.waybackArguments?.id ?? 'null'
    constructorService.changeObjectProperties(id, reverse ? record.newValue : record.oldValue)
  }

  deleteSlideWayback(record: HistoryRecord, reverse?: boolean) {
    if (!CommonRepository.openedPresentation) return
    if (!reverse) {
      let newSlideArray: Map<string, SlideObject>[] = []
      let oldSlideArray = CommonRepository.openedPresentation.slides
      for (let i = 0; i < oldSlideArray.length; i++) {
        const slide = oldSlideArray[i]
        if (i == record.waybackArguments.index) newSlideArray.push(record.oldValue)
        newSlideArray.push(slide)
      }
      if (record.waybackArguments.index == oldSlideArray.length) newSlideArray.push(record.oldValue)
      CommonRepository.openedPresentation.slides = newSlideArray
      CommonRepository.commitPresentationChanges()
    } else {
      constructorService.deleteSlide(record.waybackArguments.index ?? 0)
    }
  }

  createSlideWayback(record: HistoryRecord, reverse?: boolean) {
    if (!CommonRepository.openedPresentation) return
    if (!reverse) {
      if (record.waybackArguments.index) constructorService.deleteSlide(record.waybackArguments.index)
    } else {
      constructorService.createSlide()
    }
  }

  deleteElementWayback(record: HistoryRecord, reverse?: boolean) {
    if (!CommonRepository.openedPresentation) return
    if (!reverse) {
      let slide = CommonRepository.openedPresentation.slides[record.waybackArguments.index ?? 0]
      for (const item of record.oldValue) {
        slide.set(item.id, item)
      }
      CommonRepository.commitPresentationChanges()
    } else {
      let slide = CommonRepository.openedPresentation.slides[record.waybackArguments.index ?? 0]
      for (const item of record.oldValue) {
        try {
          slide.delete(item.id)
        } catch {}
      }
      CommonRepository.commitPresentationChanges()
    }
  }

  createElementWayback(record: HistoryRecord, reverse?: boolean) {
    if (!CommonRepository.openedPresentation) return
    let slide = CommonRepository.openedPresentation.slides[record.waybackArguments.index ?? 0]
    if (!reverse) {
      slide.delete(record.waybackArguments.id ?? '')
    } else {
      slide.set(record.oldValue.id, record.oldValue)
    }
    CommonRepository.commitPresentationChanges()
  }
}

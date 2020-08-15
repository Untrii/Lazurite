import { Instance as HistoryRepository } from '@/repositories/HistoryRepository'
import ReactiveService from '@/services/ReactiveService'
import HistoryRecord from '@/entities/history/HistoryRecord'
import ConstructorService from './ConstructorService'
import WaybackProperties from '@/entities/history/WaybackProperties'

export default class HistoryService extends ReactiveService {
  async getHistory() {}

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
  }
  async redo(count: number) {}

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
    this.registerAction('resizeElement', { id }, oldVal, newVal)
  }

  /**
   * Adds in history move action
   * @param id Element id
   * @param oldVal Old value
   * @param newVal New value
   */
  registerElementMove(
    id: string,
    oldVal: { top: number; left: number },
    newVal: { top: number; left: number }
  ) {
    this.registerAction('moveElement', { id }, oldVal, newVal)
  }

  registerPropertyChange(
    id: string,
    propertyName: string,
    oldVal: any,
    newVal: any
  ) {
    let old: any = {}
    old[propertyName] = oldVal

    let rnew: any = {}
    rnew[propertyName] = newVal

    this.registerAction('changeElementProperty', { id }, old, rnew)
  }

  async registerAction(
    actionType: 'resizeElement' | 'moveElement' | 'changeElementProperty',
    waybackArgs: WaybackProperties,
    oldValue: any,
    newValue: any
  ) {
    let newRecord: HistoryRecord = {
      actionType,
      timeStamp: new Date().getTime(),
      waybackFunction: 'nullWayback',
      waybackArguments: waybackArgs,
      oldValue: oldValue,
      newValue: newValue,
    }

    switch (actionType) {
      case 'resizeElement':
      case 'moveElement':
      case 'changeElementProperty':
        newRecord.waybackFunction = 'changeElementWayback'
        break
    }
    let history = await HistoryRepository.getFile()
    history.redo = []
    if (history.undo.length > 0) {
      let lastElem = history.undo[history.undo.length - 1]
      if (
        lastElem.actionType == newRecord.actionType &&
        lastElem.waybackArguments.id == newRecord.waybackArguments.id &&
        newRecord.timeStamp - lastElem.timeStamp < 500
      )
        history.undo.pop()
    }
    history.undo.push(newRecord)

    HistoryRepository.setFile(history)
    this.onChange()
  }

  /**
   * Wayback function for move, resize, property change
   * @param record History record
   * @param reverse true for redo
   */
  changeElementWayback(record: HistoryRecord, reverse?: boolean) {
    //args: any, oldValue: object, newValue: object
    let service = new ConstructorService()
    let id = record.waybackArguments?.id ?? 'null'
    service.changeObjectProperties(
      id,
      reverse ? record.newValue : record.oldValue
    )
  }
}

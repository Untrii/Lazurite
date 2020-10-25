import IHistoryDeclaration, { getBlankHistory } from '@/entities/history/IHistoryDeclaration'
import ModelVerificator from '@/utils/ModelVerificator'
import SingletoneRepository from './base/SingletoneRepository'
import ReactiveFileHandle from './fileSystems/ReactiveFileHandle'

export default class HistoryRepository extends SingletoneRepository implements IHistoryDeclaration {
  static init(filePath: string) {
    const model = getBlankHistory()
    const verificator = ModelVerificator.createVerificator(model)
    const fileHandle = ReactiveFileHandle.create(filePath, verificator, model)
    this.setInstance(new HistoryRepository(fileHandle))
  }

  static get Instance(): HistoryRepository {
    return this.getInstanse()
  }

  constructor(fileHandle: ReactiveFileHandle<IHistoryDeclaration>) {
    super()
    this._fileHandle = fileHandle
  }

  private _fileHandle: ReactiveFileHandle<IHistoryDeclaration>

  get undo() {
    return this._fileHandle.syncronizedObject.undo
  }
  set undo(val) {
    this._fileHandle.syncronizedObject.undo = val
  }

  get redo() {
    return this._fileHandle.syncronizedObject.redo
  }
  set redo(val) {
    this._fileHandle.syncronizedObject.redo = val
  }
}

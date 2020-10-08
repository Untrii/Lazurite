import IBackgroundCollection, { getBlankCollection } from '@/entities/IBackgroundCollection'
import ModelVerificator from '@/utils/ModelVerificator'
import SingletoneRepository from './base/SingletoneRepository'
import ReactiveFileHandle from './fileSystems/ReactiveFileHandle'

export default class BackgroundsRepository extends SingletoneRepository
  implements IBackgroundCollection {
  static init(filePath: string) {
    let model = getBlankCollection()
    let verificator = ModelVerificator.createVerificator(model)
    let fileHandle = ReactiveFileHandle.create(filePath, verificator, model)
    this.setInstance(new BackgroundsRepository(fileHandle))
  }

  static get Instance(): BackgroundsRepository {
    return this.getInstanse()
  }

  constructor(fileHandle: ReactiveFileHandle<IBackgroundCollection>) {
    super()
    this._fileHandle = fileHandle
  }

  private _fileHandle: ReactiveFileHandle<IBackgroundCollection>

  get custom() {
    return this._fileHandle.syncronizedObject.custom
  }
  set custom(val) {
    this._fileHandle.syncronizedObject.custom = val
  }

  get default() {
    return this._fileHandle.syncronizedObject.default
  }
  set default(val) {
    this._fileHandle.syncronizedObject.default = val
  }
}

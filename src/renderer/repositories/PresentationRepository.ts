import IPresentation, { getBlankPresentation } from '@/entities/IPresentation'
import ModelVerificator from '@/utils/ModelVerificator'
import ReactiveFileHandle from './fileSystems/ReactiveFileHandle'
import SingletoneRepository from './base/SingletoneRepository'

export default class PresentationRepository extends SingletoneRepository implements IPresentation {
  static init(filePath: string) {
    let model = getBlankPresentation()
    let verificator = ModelVerificator.createVerificator(model)
    let fileHandle = ReactiveFileHandle.create(filePath, verificator, model)
    this.setInstance(new PresentationRepository(fileHandle))
  }

  static get Instance(): PresentationRepository {
    return this.getInstanse()
  }

  constructor(fileHandle: ReactiveFileHandle<IPresentation>) {
    super()
    this._fileHandle = fileHandle
  }

  private _fileHandle: ReactiveFileHandle<IPresentation>

  get theme() {
    return this._fileHandle.syncronizedObject.theme
  }
  set theme(val) {
    this._fileHandle.syncronizedObject.theme = val
  }

  get slides() {
    return this._fileHandle.syncronizedObject.slides
  }
  set slides(val) {
    this._fileHandle.syncronizedObject.slides = val
  }

  get scenaries() {
    return this._fileHandle.syncronizedObject.scenaries
  }
  set scenaries(val) {
    this._fileHandle.syncronizedObject.scenaries = val
  }

  get presentationPath() {
    return this._fileHandle.filePath
  }
}

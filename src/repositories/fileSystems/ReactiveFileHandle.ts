import FileObject from './FileObject'
import DefaultFileSystem from './DefaultFileSystem'
import { reactive, watch } from 'vue'
import IFileSystem from '@/entities/IFileSystem'

console.log('reactove file handle')
export default class ReactiveFileHandle<T extends Record<string, any>> {
  _object!: T
  _filePath!: string
  _handle!: FileObject
  _attachedObjects: any[][] = []

  _reflection!: any
  private get reflection(): T {
    if (!this._reflection) {
      this._reflection = reactive(this._object)
      watch(this._reflection, (newState, oldState) => {
        this._handle.push(newState)
      })
    }
    return this._reflection
  }

  get syncronizedObject(): T {
    return this.reflection
  }

  get filePath() {
    return this._filePath
  }

  openFile(filePath: string, fileSystem?: IFileSystem) {
    this._filePath = filePath

    if (fileSystem) this._handle = new FileObject(fileSystem, filePath)
    else this._handle = new FileObject(new DefaultFileSystem(), filePath)
    const pulled: T = this._handle.pullSync()
    this._object = pulled
  }

  verifyModel(modelVerificator: Function): ModelState {
    return modelVerificator(this._object) ? ModelState.Correct : ModelState.Corruptted
  }

  fixFile(defaultObject: T) {
    for (const key in defaultObject) {
      if (typeof defaultObject[key] != typeof this._object[key]) {
        this._object[key] = defaultObject[key]
      }
    }
  }

  static create<ModelType>(
    filePath: string,
    modelVerificator?: Function,
    defaultModel?: ModelType,
    fileSystem?: IFileSystem
  ): ReactiveFileHandle<ModelType> {
    console.log(filePath)
    const result = new ReactiveFileHandle<ModelType>()
    result.openFile(filePath, fileSystem)
    if (modelVerificator) {
      const verificationResult = result.verifyModel(modelVerificator)
      if (verificationResult == ModelState.Corruptted) {
        if (defaultModel) {
          result.fixFile(defaultModel)
        }
      }
    }
    return result
  }
}

//interface ModelType extends Object{}

enum ModelState {
  Correct,
  Corruptted,
}

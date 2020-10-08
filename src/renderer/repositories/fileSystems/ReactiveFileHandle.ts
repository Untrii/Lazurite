import FileObject from './FileObject'
import DefaultFileSystem from './DefaultFileSystem'
import Vue from 'vue'
import IFileSystem from '@/entities/IFileSystem'

export default class ReactiveFileHandle<T extends Object> {
  _object!: T
  _filePath!: string
  _handle!: FileObject
  _attachedObjects: any[][] = []

  _reflection!: T
  private get reflection(): T {
    if (!this._reflection) {
      this._reflection = this.proxyObject(this._object)
      new Vue({ data: this._object })
    }
    return this._reflection
  }

  private copyArray(sourceArray: any[]) {
    let result: any[] = []
    for (let i = 0; i < sourceArray.length; i++) {
      result.push(this.copyObject(sourceArray[i]))
    }
    return result
  }

  private copyMap(sourceMap: Map<any, any>) {
    let result = new Map()
    for (const key of sourceMap.entries()) {
      result.set(key, this.copyObject(sourceMap.get(key)))
    }
    return result
  }

  private copySet(sourceSet: Set<any>) {
    let result = new Set()
    for (const key of sourceSet.entries()) {
      result.add(this.copyObject(key))
    }
    return result
  }

  private copyObject(sourceObject): any {
    if (typeof sourceObject == 'object') {
      if (Array.isArray(sourceObject)) return this.copyArray(sourceObject)
      if (sourceObject.constructor.name == 'Map') return this.copyMap(sourceObject)
      if (sourceObject.constructor.name == 'Set') return this.copySet(sourceObject)

      let result = {}
      try {
        for (const key of sourceObject) {
          result[key] = this.copyObject(sourceObject[key])
        }
      } catch {}
      return result
    } else return sourceObject
  }

  private _proxyCache = new Map()

  private sourceKeyword = '__attached-source__'
  private proxyObject<TargetType extends Object>(target: TargetType, path: string = '') {
    return new Proxy<TargetType>(target, {
      get: (target, prop) => {
        if (prop == this.sourceKeyword) {
          return path
        }
        if (typeof target[prop] == 'object') {
          let fullPath = path == '' ? prop.toString() : `${path}.${prop.toString()}`
          if (!this._proxyCache.has(fullPath))
            this._proxyCache.set(fullPath, this.proxyObject(target[prop], fullPath))
          return this._proxyCache.get(fullPath)
        }
        return target[prop]
      },
      set: (target, prop, value) => {
        let parsedPath = path.split('.')
        //parsedPath.push(prop)

        let originalObject = this._object
        for (const prop of parsedPath) {
          if (prop != '') originalObject = originalObject[prop]
        }

        if (!(path == '' && originalObject[prop] == undefined)) {
          if (typeof value != 'object') {
            originalObject[prop] = value
          } else originalObject[prop] = this.copyObject(value)

          if (typeof target == 'object' && typeof prop == 'string') Vue.set(target, prop, value)
          this._handle.push(this._object)
          return true
        } else {
          if (typeof target == 'object' && typeof prop == 'string') Vue.set(target, prop, value)
          return true
        }
      }
      // ,
      // apply: (target: TargetType, thisArg, argArray) => {
      //   let path = target[this.sourceKeyword] ?? ''
      //   let parsedPath = path.split('.')

      //   let originalObject: any = this._object
      //   for (const prop of parsedPath) {
      //     if (prop != '') originalObject = originalObject[prop]
      //   }
      //   if (typeof originalObject == 'function') originalObject(...argArray)
      //   if (typeof target == 'function') return target(...argArray)
      // }
    })
  }

  get syncronizedObject(): T {
    return new Proxy<T>(this.reflection, {})
  }

  get filePath() {
    return this._filePath
  }

  openFile(filePath: string, fileSystem?: IFileSystem) {
    this._filePath = filePath

    if (fileSystem) this._handle = new FileObject(fileSystem, filePath)
    else this._handle = new FileObject(new DefaultFileSystem(), filePath)
    let pulled: T = this._handle.pullSync()
    this._object = pulled
  }

  verifyModel(modelVerificator: Function): ModelState {
    return modelVerificator(this._object) ? ModelState.Correct : ModelState.Corruptted
  }

  fixFile(defaultObject: T) {
    for (const key in this._object) {
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
    let result = new ReactiveFileHandle<ModelType>()
    result.openFile(filePath, fileSystem)
    if (modelVerificator) {
      let verificationResult = result.verifyModel(modelVerificator)
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
  Corruptted
}

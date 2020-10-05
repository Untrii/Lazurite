import FileObject from './FileObject'
import DefaultFileSystem from './DefaultFileSystem'
import Vue from 'vue'

export default class ReactiveFileHandle<T extends Object> {
  _object!: T
  _filePath!: string
  _handle!: FileObject
  _attachedObjects: any[][] = []

  _reflection!: T
  private get reflection(): T {
    if (!this._reflection) {
      this._reflection = this.proxyObject(this.copyObject(this._object))
      new Vue({ data: this._reflection })
    }
    return this._reflection
  }

  private copyObject(sourceObject: object, path?: string): any {
    if (!path || path == '') {
      let result = {}
      for (const property in sourceObject) {
        result[property.toString()] = this.copyObject(sourceObject, property)
      }
      return result
    } else {
      let parsedPath = path.split('.')
      let obj: any = this._object
      for (const property of parsedPath) {
        obj = obj[property]
      }
      if (typeof obj == 'object') {
        if (Array.isArray(obj)) {
          let result: any = []
          for (const key in obj) {
            result.push(this.copyObject(sourceObject, path + '.' + key))
          }
          return result
        }
        if (obj.constructor.name == 'Map') {
          let objMap: Map<any, any> = obj
          let result = new Map()
          for (const item of objMap.entries()) {
            result.set(item[0], item[1])
          }
          return result
        }
        if (obj.constructor.name == 'Set') {
          let objSet: Set<any> = obj
          let result = new Set()
          for (const item of objSet.entries()) {
            result.add(item)
          }
          return result
        }
        let result = {}
        if (obj['__proto__']) result['__proto__'] = obj.prototype
        for (const key in obj) {
          result[key.toString()] = this.copyObject(sourceObject, path + '.' + key)
        }
        return result
      } else return obj
    }
  }

  private clearObject() {}

  private proxyObject<TargetType extends Object>(target: TargetType, path: string = '') {
    let sourceKeyword = '__attached-source__'
    return new Proxy<TargetType>(target, {
      get: (target, prop) => {
        if (prop == sourceKeyword) {
          return path
        }
        if (typeof target[prop] == 'object' || typeof target[prop] == 'function') {
          return this.proxyObject(
            target[prop],
            path == '' ? prop.toString() : path + '.' + prop.toString()
          )
        }
        return target[prop]
      },
      set: (target, prop, value) => {
        let path = target[sourceKeyword] ?? ''
        let parsedPath = path.split('.')
        //parsedPath.push(prop)

        let originalObject = this._object
        for (const prop of parsedPath) {
          if (prop != '') originalObject = originalObject[prop]
        }

        if (path != '' || originalObject[prop] != undefined) {
          if (typeof value != 'object') {
            originalObject[prop] = value
          } else originalObject[prop] = this.copyObject(value)

          if (typeof target == 'object' && typeof prop == 'string') Vue.set(target, prop, value)
          this._handle.push(this._object)
          return true
        } else return false
      },
      apply: (target: TargetType, thisArg, argArray) => {
        let path = target[sourceKeyword] ?? ''
        let parsedPath = path.split('.')

        let originalObject: any = this._object
        for (const prop of parsedPath) {
          originalObject = originalObject[prop]
        }
        originalObject.apply(thisArg, argArray)
        if (typeof target == 'function') return target.apply(thisArg, argArray)
      }
    })
  }

  get syncronizedObject(): T {
    return new Proxy<T>(this.reflection, {})
  }

  get filePath() {
    return this._filePath
  }

  async openFile(filePath: string) {
    this._filePath = filePath

    this._handle = new FileObject(new DefaultFileSystem(), filePath)
    let pulled: T = await this._handle.pull()
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

  static async create<ModelType>(
    filePath: string,
    modelVerificator?: Function,
    defaultModel?: ModelType
  ): Promise<ReactiveFileHandle<ModelType>> {
    let result = new ReactiveFileHandle<ModelType>()
    await result.openFile(filePath)
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

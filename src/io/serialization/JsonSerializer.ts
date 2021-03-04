import info from './info'

interface IModelConstructor {
  new (): object
}

const typeKeyword = '__x-lz-type'
const rootKeyword = '__x-lz-root'
const versionKeyword = '__x-lz-version'
const reservedKeys = [typeKeyword, rootKeyword, versionKeyword]
const currentVersion = info.version

function codeFilesFilter(value: string) {
  return value.endsWith('.ts') || value.endsWith('.js')
}

function getConstructors(ctx: __WebpackModuleApi.RequireContext, paths: string[]) {
  let result = {} as { [constructorName: string]: IModelConstructor }
  for (const path of paths) {
    let requireResult = ctx(path).default
    if (typeof requireResult == 'function') {
      let ctor = requireResult as IModelConstructor
      result[ctor.name] = ctor
    }
  }
  return result
}

const modelsContext = require.context('@/models')
const modelFiles = modelsContext.keys().filter(codeFilesFilter)
const modelConstructors = getConstructors(modelsContext, modelFiles)

export default class JsonSerializer {
  private static toNewVersion(version: string, object: object) {
    return object
  }

  private static fromObject(obj: object): object {
    let result = obj

    if (typeof obj[versionKeyword] == 'string' && obj[versionKeyword] != currentVersion)
      return this.toNewVersion(currentVersion, obj)

    if (typeof obj[typeKeyword] == 'string') {
      const type = obj[typeKeyword]

      if (type == 'Date') return new Date(obj['time'])
      if (type == 'Object') {
        delete obj[typeKeyword]
        return obj
      }

      if (!modelConstructors[type]) console.error('Parse error.\nUnknown type ' + type)
      else result = new modelConstructors[type]()
      for (const key in obj) {
        if (!reservedKeys.includes(key)) {
          if (typeof obj[key] == 'object') result[key] = this.fromObject(obj[key])
          else result[key] = obj[key]
        }
      }
    }
    return result
  }

  private static toObject(obj: object, isRoot = false): object {
    let result: { [key: string]: any } = {}
    if (obj instanceof Date) {
      result = { time: obj.getTime() }
    }
    if (Array.isArray(obj)) {
      result = new Array(obj.length)
      for (let i = 0; i < (obj as any[]).length; i++) {
        if (typeof obj[i] == 'object') result[i] = this.toObject(obj[i])
        else result[i] = obj[i]
      }
      return result
    }
    for (const key in obj) {
      if (typeof obj[key] == 'object') result[key] = this.toObject(obj[key])
      else result[key] = obj[key]
    }
    if (isRoot) result[versionKeyword] = currentVersion
    if (obj.constructor.name) result[typeKeyword] = obj.constructor.name
    return result
  }

  public static toJSON<T extends object>(data: T): string {
    return JSON.stringify(this.toObject(data, true))
  }
  public static fromJSON<T extends object>(data: string): T {
    try {
      return this.fromObject(JSON.parse(data)) as T
    } catch {
      return null
    }
  }
}

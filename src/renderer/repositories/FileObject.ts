import FileSystem from '@/entities/FileSystem'
import serialize from 'serialize-javascript'

function deserialize(serializedJavascript) {
  return eval('(' + serializedJavascript + ')')
}

export default class FileObject {
  private fileName: string
  private fs: FileSystem
  private ioActive: boolean
  private isSaveSchedulled = false
  private lastSync: Date
  private syncRate: number //milliseconds
  private cachedObject: any

  constructor(fs: FileSystem, fileName: string) {
    this.fs = fs
    this.fileName = fileName
    this.lastSync = new Date(1980, 1, 1)
    this.ioActive = false

    this.syncRate = 2000
  }

  private async pullFromFs(): Promise<string> {
    this.ioActive = true
    let data = await this.fs.readFile(this.fileName)
    this.ioActive = false
    return data
  }

  private async pushToFs(data: string): Promise<void> {
    this.ioActive = true
    await this.fs.writeFile(this.fileName, data)
    this.ioActive = false
  }

  async pull(): Promise<any> {
    if (!this.cachedObject) {
      let data = await this.pullFromFs()
      let obj: any
      try {
        obj = deserialize(data)
      } catch {
        obj = new Object()
      }
      this.cachedObject = obj
      return obj
    } else return { ...this.cachedObject }
  }

  async push<T>(obj: T) {
    this.cachedObject = { ...obj }

    if (new Date().getTime() - this.lastSync.getTime() > this.syncRate) {
      let data = serialize(obj)
      if (!this.isSaveSchedulled) {
        this.isSaveSchedulled = true
        setTimeout(() => {
          this.pushToFs(serialize(this.cachedObject))
          this.isSaveSchedulled = false
        }, this.syncRate)
      }
    }
  }

  get isIoActive() {
    return this.ioActive
  }
}

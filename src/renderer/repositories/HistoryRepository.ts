import ReactiveRepository from './ReactiveRepository'
import FileObject from './FileObject'
import LocalFileSystem from './LocalFileSystem'
import HistoryDeclaration from '@/entities/history/HistoryDeclaration'

export default class HistoryRepository extends ReactiveRepository {
  private _handle!: FileObject
  private _isFileOpened = false

  get isFileOpened(): boolean {
    return this._isFileOpened
  }

  async openFile(fileName: string) {
    this._handle = new FileObject(new LocalFileSystem(), fileName)
    this._isFileOpened = true
    this.onChange()
  }

  async getFile(): Promise<HistoryDeclaration> {
    let result = await this._handle.pull()
    if (Array.isArray(result.undo) && Array.isArray(result.redo)) return result
    else
      await this.setFile({
        undo: [],
        redo: [],
      })
    return {
      undo: [],
      redo: [],
    }
  }
  async setFile(file: HistoryDeclaration) {
    await this._handle.push(file)
    this.onChange()
  }
}

function getInstance(): HistoryRepository {
  let win: any = window
  if (!win.__historyInstance) win.__historyInstance = new HistoryRepository()
  return win.__historyInstance
}

export let Instance = getInstance()

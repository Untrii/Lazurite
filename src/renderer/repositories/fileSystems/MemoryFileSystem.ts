import IFileSystem from '@/entities/IFileSystem'
import magicWords from '@/utils/magicWords'

let memoryFileSystemStore = magicWords.memoryFileSystemStore
export default class LocalFileSystem implements IFileSystem {
  public readFileSync(fileName: string) {
    let win: any = window
    if (!win[memoryFileSystemStore]) win[memoryFileSystemStore] = {}
    if (!win[memoryFileSystemStore][fileName]) return ''
    return win[memoryFileSystemStore][fileName]
  }
  public async readFile(fileName) {
    return this.readFileSync(fileName)
  }
  public async writeFile(fileName: string, data: string) {
    let win: any = window
    if (!win[memoryFileSystemStore]) win[memoryFileSystemStore] = {}
    win[memoryFileSystemStore][fileName] = data
  }
}

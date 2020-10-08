import IFileSystem from '@/entities/IFileSystem'
import magicWords from '@/utils/magicWords'

let memoryFileSystemStore = magicWords.memoryFileSystemStore
export default class LocalFileSystem implements IFileSystem {
  public async readFile(fileName: string) {
    let win: any = window
    if (!win[memoryFileSystemStore]) win[memoryFileSystemStore] = {}
    if (!win[memoryFileSystemStore][fileName]) return ''
    return win[memoryFileSystemStore][fileName]
  }
  public async writeFile(fileName: string, data: string) {
    let win: any = window
    if (!win[memoryFileSystemStore]) win[memoryFileSystemStore] = {}
    win[memoryFileSystemStore][fileName] = data
  }
}

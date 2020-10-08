import IFileSystem from '@/entities/IFileSystem'
import fs from 'fs'

export default class LocalFileSystem implements IFileSystem {
  public async readFile(fileName: string) {
    try {
      return (await fs.promises.readFile(fileName)).toString()
    } catch {
      return ''
    }
  }
  public async writeFile(fileName: string, data: string) {
    try {
      await fs.promises.unlink(fileName)
    } catch {}
    await fs.promises.writeFile(fileName, data)
  }
}

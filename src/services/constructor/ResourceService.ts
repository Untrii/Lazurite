import ConstructorStore from '@/services/store/ConstructorStore'
import { promises as fs } from 'fs'

const store = new ConstructorStore()

export default class ResourceSercvice {
  async addResourceFile(fileName: string) {
    const shortFileName =
      fileName
        .split('\\')
        ?.pop()
        ?.split('/')
        .pop() ?? 'fileName'

    fs.mkdir(store.resourceFolder)
    fs.copyFile(fileName, store.resourceFolder + '/' + shortFileName)
  }

  getTypeFilter(filesType: string) {
    return (fileName: string) => {
      switch (filesType) {
        case 'image':
          return fileName.endsWith('.jpg') || fileName.endsWith('png')
        case 'video':
          return fileName.endsWith('.mp4') || fileName.endsWith('.avi')
      }
      return false
    }
  }

  async getFiles(filesType: string) {
    console.log('getting files with type ' + filesType)
    let files = await fs.readdir(store.resourceFolder)
    let filter = this.getTypeFilter(filesType)
    return files.filter(filter)
  }
}

import ConstructorStore from '@/services/store/ConstructorStore'
import { promises as fs } from 'fs'

let store = new ConstructorStore()

export default class ResourceSercvice {
  async addResourceFile(fileName: string) {
    let shortFileName =
      fileName
        .split('\\')
        ?.pop()
        ?.split('/')
        .pop() ?? 'fileName'

    fs.copyFile(fileName, store.resourceFolder + '/' + shortFileName)
  }
}

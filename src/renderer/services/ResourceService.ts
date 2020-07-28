import ReactiveService from './ReactiveService'
import { Instance } from '@/repositories/CommonRepository'
import { promises as fs } from 'fs'
import randomString from '@/utils/StringGenerator'

export default class ResourceService extends ReactiveService {
  async getResourceFiles(type: 'image' | 'video'): Promise<string[]> {
    if (!Instance.workspaceDataFolder) return []
    try {
      let stats = await fs.lstat(Instance.workspaceDataFolder)
      if (!stats.isDirectory()) return []

      let files = await fs.readdir(Instance.workspaceDataFolder)
      return files
    } catch {
      return []
    }
  }

  async isResourceExists(): Promise<boolean> {
    return false
  }

  async addResourceFile(fileName: string) {
    let shortFileName =
      fileName
        .split('\\')
        ?.pop()
        ?.split('/')
        .pop() ?? 'fileName'

    fs.copyFile(fileName, this.resourceFolder + '/' + shortFileName)
    this.onChange()
  }

  getImageSize(fileName: string) {
    let image = document.createElement('img')
    image.src = this.resourceFolder + '/' + fileName
    image.naturalHeight

    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
    }
  }

  get resourceFolder(): string {
    return Instance.workspaceDataFolder ?? ''
  }
}

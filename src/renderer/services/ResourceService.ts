import ReactiveService from './ReactiveService'
import { Instance } from '@/repositories/CommonRepository'
import { promises as fs } from 'fs'

export default class ResourceService extends ReactiveService {
  constructor() {
    super()
    Instance.addOnChangeListener(() => this.onChange())
  }
  async getResourceFiles(type: 'image' | 'video'): Promise<string[]> {
    if (!Instance.workspaceDataFolder) return []
    try {
      let stats = await fs.lstat(Instance.workspaceDataFolder)
      if (!stats.isDirectory()) return []

      let allFiles = await fs.readdir(Instance.workspaceDataFolder)
      let filteredFiles: string[] = []
      for (const item of allFiles) {
        if (type == 'image') {
          if (item.endsWith('.jpg') || item.endsWith('.png')) {
            filteredFiles.push(item)
          }
        } else {
          if (item.endsWith('.mp4')) {
            filteredFiles.push(item)
          }
        }
      }
      return filteredFiles
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

    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
    }
  }

  getVideoSize(fileName: string): Promise<{ width: number; height: number }> {
    let video = document.createElement('video')
    video.src = this.resourceFolder + '/' + fileName

    let container = document.createElement('x-internal')
    container.style.display = 'none'
    container.appendChild(video)
    document.body.appendChild(container)

    let onGotMetadata
    let result: Promise<{
      width: number
      height: number
    }> = new Promise((resolve, reject) => {
      onGotMetadata = resolve
    })

    video.addEventListener('loadedmetadata', () => {
      onGotMetadata({
        width: video.videoWidth,
        height: video.videoHeight,
      })
    })

    return result
  }

  get resourceFolder(): string {
    return Instance.workspaceDataFolder ?? ''
  }
}

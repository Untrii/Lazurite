import ReactiveService from './ReactiveService'
import { Instance } from '@/repositories/CommonRepository'
import { promises as fs } from 'fs'

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
}

import Presentation from '@/models/presentation/Presentation'
import IoManager from './IoManager'
import { existsSync, promises } from 'fs'
import path from 'path'
import JsonSerializer from './serialization/JsonSerializer'
import Background from '@/models/presentation/theme/Background'
import { remote } from 'electron'

const { dialog } = remote

const { mkdir, readFile, writeFile } = promises

const fileNames = {
  openedPresentations: 'opndpres.json',
  recentPresentations: 'recpres.json',
  userBackgrounds: 'usrcol.json',
}

type IDiff<T> = {
  [key in keyof T]?: IDiff<T[key]>
}

function applyDiff<T>(obj: T, diff: IDiff<T>) {
  for (const key in diff) {
    if (typeof diff[key] == 'object') {
      if (Array.isArray(diff[key])) obj[key] = [...(diff[key] as any)] as any
      else if (diff[key] instanceof Map) obj[key] = new Map(diff[key] as any) as any
      else if (diff[key] instanceof Set) obj[key] = new Set(diff[key] as any) as any
      else applyDiff(obj[key], diff[key])
    } else obj[key] = diff[key] as any
  }
}

export default class ElectronIO extends IoManager {
  private _presentations = new Map<string, Presentation>()

  private isAppdataPathCreated = false
  private async getAppDataPath() {
    if (process.platform == 'win32') {
      const result = process.env.APPDATA.split('\\').join('/') + '/Lazurite'

      if (!this.isAppdataPathCreated) {
        if (!existsSync(result)) await mkdir(result)
        this.isAppdataPathCreated = true
      }

      return result
    }
    throw new Error('There is no default app data path for this OS')
  }

  private async mustExist(filePath: string): Promise<string> {
    if (!existsSync(filePath)) await writeFile(filePath, '')
    return filePath
  }

  private async getOpenedPresentationsFile() {
    return await this.mustExist(path.join(await this.getAppDataPath(), fileNames.openedPresentations))
  }
  private async getRecentPresentationsFile() {
    return await this.mustExist(path.join(await this.getAppDataPath(), fileNames.recentPresentations))
  }
  private async getUserBackgroundsFile() {
    return await this.mustExist(path.join(await this.getAppDataPath(), fileNames.userBackgrounds))
  }

  private async loadPresentationPaths(filePath: string) {
    const json = (await readFile(filePath)).toString()
    const [result, isValid] = this.validatePresentationIds(JsonSerializer.fromJSON(json))

    if (!isValid) await writeFile(filePath, JsonSerializer.toJSON(result))
    return result
  }

  async loadOpenedPresentationPaths() {
    const filePath = await this.getOpenedPresentationsFile()
    return await this.loadPresentationPaths(filePath)
  }
  async saveOpenedPresentationPaths(paths: string[]) {
    const filePath = await this.getOpenedPresentationsFile()
    await writeFile(filePath, JsonSerializer.toJSON(paths))
  }

  async loadRecentPresentationPaths() {
    const filePath = await this.getRecentPresentationsFile()
    return await this.loadPresentationPaths(filePath)
  }
  async saveRecentPresentationPaths(paths: string[]) {
    const filePath = await this.getRecentPresentationsFile()
    await writeFile(filePath, JSON.stringify(paths))
  }

  fileCache = new Map<string, any>()
  private writeSchedule = new Set<string>()
  private async writeFileSchedulled(path: string, immediately: boolean) {
    if (this.writeSchedule.has(path)) return
    else {
      this.writeSchedule.add(path)
      setTimeout(
        async () => {
          const writePath = path.replace('local://', '')
          const data = JsonSerializer.toJSON(this.fileCache.get(path))
          await writeFile(writePath, data)

          this.writeSchedule.delete(path)
        },
        immediately ? 0 : 5000
      )
    }
  }
  async loadPresentation(path: string) {
    if (this.fileCache.has(path)) return this.fileCache.get(path)

    try {
      let text = await (await fetch(path)).text()
      let presentation = JsonSerializer.fromJSON<Presentation>(text)
      this.fileCache.set(path, JsonSerializer.fromJSON(text))
      return presentation
    } catch {
      let paths = await this.loadOpenedPresentationPaths()
      paths = paths.filter((item) => item != path)
      await this.saveOpenedPresentationPaths(paths)

      throw new Error('Presentation file is not available')
    }
  }
  async savePresentation(path: string, presentation: Presentation, immediately = false) {
    presentation.lastEditDate = new Date()
    if (path.startsWith('https://')) throw new Error('Web presentations not supported at this moment')
    else if (path.startsWith('local://')) {
      this.fileCache.set(path, presentation)
      this.writeFileSchedulled(path, immediately)
    }
  }

  async loadUserBackgrounds() {
    const filePath = await this.getUserBackgroundsFile()

    const json = (await readFile(filePath)).toString()
    const [result, isValid] = this.validateUserBackgrounds(JsonSerializer.fromJSON(json))

    if (!isValid) await writeFile(filePath, JsonSerializer.toJSON(result))
    return result
  }
  async saveUserBackgrounds(bgs: Background[]) {
    const filePath = await this.getUserBackgroundsFile()
    await writeFile(filePath, JsonSerializer.toJSON(bgs))
  }

  async createNewPresentaiton(name: string, author: string) {
    const dialogResult = await dialog.showOpenDialog({
      title: 'Choose folder to save presentation project',
      properties: ['openDirectory'],
    })

    if (dialogResult.filePaths.length == 0) throw new Error('Folder not selected')
    const folderPath = dialogResult.filePaths[0]

    const projectFolderPath = path.join(folderPath, name)
    const resourcesPath = path.join(projectFolderPath, 'resources')
    const projectPath = path.join(projectFolderPath, 'project.json')

    await mkdir(projectFolderPath)
    await mkdir(resourcesPath)

    const presentation = new Presentation()
    presentation.name = name
    presentation.author = author
    const lPath = 'local://' + projectPath
    await this.savePresentation(lPath, presentation, true)
    return [presentation, lPath] as [Presentation, string]
  }
}

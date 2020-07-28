import FileObject from './FileObject'
import Presentation from '@/entities/Presentation'
import LocalFileSystem from './LocalFileSystem'
import AppSettings, { defaultSettings } from '@/entities/AppSettings'
import SlideObject from '@/entities/SlideObject'
import { promises as fs } from 'fs'
import fsSync from 'fs'

import BackgroundCollection, {
  getBlankCollection,
} from '@/entities/BackgroundCollection'
import track from '@/utils/ReactiveTrack'
import ReactiveRepository from './ReactiveRepository'

const settingsFileName = 'data/settings.json'
const backgroundCollectionFileName = 'data/bg.json'
const paletteCollectionFileName = 'data/palettes.json'

interface FontRecord {
  name: string
  variants: string[]
}

//Singleton that contains app state
export default class CommonRepository extends ReactiveRepository {
  private _isFileOpened: boolean
  private _openedPresentationFile: string | undefined
  private _openedPresentationHandle: FileObject | undefined
  private _openedPresentation: Presentation | undefined

  private _fontsList: any[] = []

  private _settingsFileHandle: FileObject | undefined
  private _settingsFile: AppSettings | undefined

  private _backgroundCollectionFileHandle: FileObject | undefined
  private _backgroundCollectionFile: BackgroundCollection | undefined

  private _paletteCollectionFileHandle: FileObject | undefined
  private _paletteCollectionFile: string[][] | undefined

  public variables = {
    selectedSlideIndex: 0,
    selectedObjectsIds: new Set<string>(),
    clipboard: new Set<SlideObject>(),
    showDialog: 'none',
    dialogType: 'image',
    choseFileDialogResolve: (fileName: string) => {},
    choseFileDialogReject: () => {},
  }

  constructor() {
    super()
    this._isFileOpened = false
  }

  async load() {
    let dt = new Date()
    await Promise.all([
      this.openSettings(),
      this.openBackgroundCollection(),
      this.openPaletteCollection(),
      this.getFontList(),
    ])
    console.info(
      `Program has loaded in ${new Date().getTime() - dt.getTime()}ms`
    )
  }

  get workspaceDataFileName() {
    return this._openedPresentationFile + '.meta'
  }
  get workspaceDataFolder(): string | undefined {
    if (this._openedPresentationFile == undefined) return undefined
    let path = this._openedPresentationFile.split('/')
    path.pop()
    path.push('workspace')
    let result = path.join('/')
    try {
      fsSync.mkdirSync(result)
    } catch {}
    return result
  }
  get openedPresentation(): Presentation | undefined {
    return this._openedPresentation
  }
  set openedPresentation(file: Presentation | undefined) {
    this._openedPresentationHandle?.push(file)
    this.onChange()
  }
  get isPresentationOpened(): boolean {
    return this._isFileOpened
  }
  get openedPresentationFile(): string | undefined {
    if (!this._isFileOpened) return undefined
    return this._openedPresentationFile
  }

  commitPresentationChanges() {
    this.openedPresentation = this.openedPresentation
  }

  async openPresentation(fileName: string) {
    this._openedPresentationFile = fileName.split('\\').join('/')

    this._openedPresentationHandle = new FileObject(
      new LocalFileSystem(),
      fileName
    )
    this._openedPresentation = await this._openedPresentationHandle.pull()
    this._isFileOpened = true
    this.onChange()
  }
  async openSettings() {
    this._settingsFileHandle = new FileObject(
      new LocalFileSystem(),
      settingsFileName
    )
    let sfile: any = { ...defaultSettings }
    let pulled = await this._settingsFileHandle.pull()
    for (let field in pulled) {
      sfile[field] = pulled[field]
    }
    this.settings = sfile
    this.onChange()
  }
  async openBackgroundCollection() {
    this._backgroundCollectionFileHandle = new FileObject(
      new LocalFileSystem(),
      backgroundCollectionFileName
    )
    let sfile: any = { ...getBlankCollection() }
    let pulled = await this._backgroundCollectionFileHandle.pull()
    for (let field in pulled) {
      sfile[field] = pulled[field]
    }
    this.backgroundCollection = sfile
  }
  async openPaletteCollection() {
    this._paletteCollectionFileHandle = new FileObject(
      new LocalFileSystem(),
      paletteCollectionFileName
    )
    let sfile: any = []
    let pulled = await this._paletteCollectionFileHandle.pull()
    if (Array.isArray(pulled)) sfile = pulled

    this.paletteCollection = sfile
  }

  get settings(): AppSettings | undefined {
    let p = this._settingsFile
    if (p == undefined) return undefined
    return track<AppSettings>({ ...p }, () => (this.settings = p))
  }
  set settings(settings: AppSettings | undefined) {
    if (!this._settingsFileHandle) {
      this._settingsFileHandle = new FileObject(
        new LocalFileSystem(),
        settingsFileName
      )
    }
    this._settingsFile = settings
    this._settingsFileHandle.push(settings)
    this.onChange()
  }

  get backgroundCollection(): BackgroundCollection | undefined {
    let p = this._backgroundCollectionFile
    return p
  }
  set backgroundCollection(collection: BackgroundCollection | undefined) {
    if (!this._backgroundCollectionFileHandle) {
      this._backgroundCollectionFileHandle = new FileObject(
        new LocalFileSystem(),
        backgroundCollectionFileName
      )
    }
    this._backgroundCollectionFile = collection
    this._backgroundCollectionFileHandle.push(collection)
    this.onChange()
  }

  get paletteCollection(): string[][] | undefined {
    return this._paletteCollectionFile
  }
  set paletteCollection(collection: string[][] | undefined) {
    let handle = (this._paletteCollectionFileHandle =
      this._paletteCollectionFileHandle ||
      new FileObject(new LocalFileSystem(), paletteCollectionFileName))
    this._paletteCollectionFile = collection
    handle.push(collection)
    this.onChange()
  }

  async getFontList() {
    if (this._fontsList.length != 0) return this._fontsList

    let styles: string[] = []
    let fontList: FontRecord[] = []
    let dataDir =
      process
        .cwd()
        .split('\\')
        .join('/') + '/data'
    let files = await fs.readdir(dataDir + '/fonts')
    console.log(files.length)
    for (let fileName of files) {
      let entry = fileName.replace('.ttf', '').split('__')

      let fontWeight = entry[1]
      let fontStyle = 'regular'
      let fontFamily = entry[0].split('_').join(' ')

      if (entry[1] == 'regular' || entry[1] == 'italic') fontWeight = '400'
      if (entry[1].includes('italic')) fontStyle = 'italic'

      fontWeight = fontWeight.replace('italic', '')
      let styleString = `@font-face { font-family: '${fontFamily}';font-style: ${fontStyle};font-weight: ${fontWeight};font-display: swap;src: url('${dataDir}/fonts/${fileName}');}`
      styles.push(styleString)

      let found = false
      if (fontStyle == 'regular') {
        for (let font of fontList) {
          if (font.name == fontFamily) {
            font.variants.push(fontWeight)
            found = true
          }
        }
        if (!found) {
          let newEntry = {
            name: fontFamily,
            variants: [fontWeight],
          }
          fontList.push(newEntry)
        }
      }
    }

    for (let i = 0; i < fontList.length; i++) {
      fontList[i].variants.sort((a, b) => parseInt(a) - parseInt(b))
    }

    let fontsLoader = {
      push(item) {
        let win: any = window
        if (win.__setupedFontsLoaded) return
        let styleSheet = document.createElement('style')
        styleSheet.type = 'text/css'
        styleSheet.innerText = item
        document.head.appendChild(styleSheet)
        win.__setupedFontsLoaded = true
      },
    }

    let stylePack: string[] = []
    for (let i = 0; i < styles.length; i++) {
      stylePack.push(styles[i])
    }

    fontsLoader.push(stylePack.join(''))
    this._fontsList = fontList
    return fontList
  }
}

function getInstance(): CommonRepository {
  let win: any = window
  if (!win.__repoInstance) win.__repoInstance = new CommonRepository()
  return win.__repoInstance
}

export let Instance = getInstance()

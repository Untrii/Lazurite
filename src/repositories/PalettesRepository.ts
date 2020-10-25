import IColor from '@/entities/IColor'
import Color from '@/entities/Color'
import SingletoneRepository from './base/SingletoneRepository'
import ReactiveFileHandle from './fileSystems/ReactiveFileHandle'

export default class PalettesRepository extends SingletoneRepository {
  static init(filePath: string) {
    const fileHandle: ReactiveFileHandle<string[][]> = ReactiveFileHandle.create(filePath)
    this.setInstance(new PalettesRepository(fileHandle))
  }

  static get Instance(): PalettesRepository {
    return this.getInstanse(() => this.init('data/palettes.json'))
  }

  constructor(fileHandle: ReactiveFileHandle<string[][]>) {
    super()
    this._fileHandle = fileHandle
  }

  private _fileHandle: ReactiveFileHandle<string[][]>

  get data() {
    return this._fileHandle.syncronizedObject
  }

  get parsedData() {
    const parsedData: IColor[][] = []

    for (const palette of this.data) {
      const parsedPalette: Color[] = []
      for (const color of palette) {
        parsedPalette.push(Color.fromHex(color))
      }
      parsedData.push(parsedPalette)
    }
    return parsedData
  }
}

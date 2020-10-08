import ISlideObject from '@/entities/ISlideObject'
import ModelVerificator from '@/utils/ModelVerificator'
import SingletoneRepository from './base/SingletoneRepository'
import ReactiveFileHandle from './fileSystems/ReactiveFileHandle'
import MemoryFileSystem from './fileSystems/MemoryFileSystem'

interface RuntimeData {
  selectedSlideIndex: number
  selectedObjectsIds: Set<string>
  clipboard: Set<ISlideObject>
  showDialog: string
  dialogType: string
  choseFileDialogResolve: Function
  choseFileDialogReject: Function

  isGridEnabled: boolean
  gridSize: 144 | 576

  previewModuleSize: number
  instrumentsModuleSize: number
  timelineModuleSize: number
}

let defaultModel: RuntimeData = {
  selectedSlideIndex: 0,
  selectedObjectsIds: new Set<string>(),
  clipboard: new Set<ISlideObject>(),
  showDialog: 'none',
  dialogType: 'image',
  choseFileDialogResolve: (fileName: string) => {},
  choseFileDialogReject: () => {},

  isGridEnabled: false,
  gridSize: 144,

  previewModuleSize: 280,
  instrumentsModuleSize: 280,
  timelineModuleSize: 200
}
export default class RuntimeRepository extends SingletoneRepository {
  static get Instance(): RuntimeRepository {
    return this.getInstanse(() => {
      let verificator = ModelVerificator.createVerificator(defaultModel)
      let fileHandle = ReactiveFileHandle.create(
        'runtime',
        verificator,
        defaultModel,
        new MemoryFileSystem()
      )
      this.setInstance(new RuntimeRepository(fileHandle))
    })
  }

  constructor(fileHandle: ReactiveFileHandle<any>) {
    super()
    this._fileHandle = fileHandle
  }

  get data(): RuntimeData {
    return this._fileHandle.syncronizedObject
  }

  private _fileHandle: ReactiveFileHandle<any>
}

import ReactiveRepository from './ReactiveRepository'
import SlideObject from '@/entities/SlideObject'

export class RuntimeRepository extends ReactiveRepository {
  selectedSlideIndex = 0
  selectedObjectsIds = new Set<string>()
  clipboard = new Set<SlideObject>()
  showDialog = 'none'
  dialogType = 'image'
  choseFileDialogResolve = (fileName: string) => {}
  choseFileDialogReject = () => {}

  isGridEnabled = false
  gridSize = 144
}

function getInstance(): RuntimeRepository {
  let win: any = window
  if (!win.__rtrepoInstance) win.__rtrepoInstance = new RuntimeRepository()
  return win.__rtrepoInstance
}
export default getInstance()

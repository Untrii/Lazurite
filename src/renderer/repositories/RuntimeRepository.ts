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
}

function getInstance(): RuntimeRepository {
  let win: any = window
  if (!win.__repoInstance) win.__repoInstance = new RuntimeRepository()
  return win.__repoInstance
}
export default getInstance()

import ReactiveService from './ReactiveService'
import { Instance } from '@/repositories/CommonRepository'

export default class DialogService extends ReactiveService {
  constructor() {
    super()
    //this.addOnChangeListener()
  }

  private handleChooseFileDialog(resolve, reject) {
    Instance.variables.choseFileDialogResolve = resolve
    Instance.variables.choseFileDialogReject = reject
    Instance.onChange()
  }

  openChooseFileDialog(type: 'image' | 'video'): Promise<string> {
    let promise: Promise<string> = new Promise(this.handleChooseFileDialog)
    Instance.variables.showDialog = 'chooseFile'
    Instance.variables.dialogType = type
    Instance.onChange()
    return promise
  }

  get isChooseFileDialogOpened() {
    return Instance.variables.showDialog == 'chooseFile'
  }

  get chooseFileDialogType(): 'image' | 'video' {
    if (Instance.variables.dialogType == 'video') return 'video'
    return 'image'
  }

  onFileChosen(fileName: string) {
    Instance.variables.choseFileDialogResolve(fileName)
    Instance.variables.showDialog = 'none'
    Instance.onChange()
  }

  onChooseRejected() {
    Instance.variables.choseFileDialogReject()
    Instance.variables.showDialog = 'none'
  }
}

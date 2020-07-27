import ReactiveService from './ReactiveService'
import { Instance } from '@/repositories/CommonRepository'

export default class DialogService extends ReactiveService {
  constructor() {
    super()
    //this.addOnChangeListener()
  }

  private handleChooseFileDialog(resolve, reject) {
    Instance.variables.choseFileDialogResolve = resolve
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
    switch (Instance.variables.dialogType) {
      case 'video':
        return Instance.variables.dialogType
    }
    return 'image'
  }

  onFileChosen(fileName: string) {
    Instance.variables.choseFileDialogResolve(fileName)
  }
}

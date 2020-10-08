import CommonRepository from '@/repositories/CommonRepository'
import RuntimeRepository from '@/repositories/RuntimeRepository'

export default class DialogService {
  private handleChooseFileDialog(resolve, reject) {
    RuntimeRepository.choseFileDialogResolve = resolve
    RuntimeRepository.choseFileDialogReject = reject
    CommonRepository.onChange()
  }

  openChooseFileDialog(type: 'image' | 'video'): Promise<string> {
    let promise: Promise<string> = new Promise(this.handleChooseFileDialog)
    RuntimeRepository.showDialog = 'chooseFile'
    RuntimeRepository.dialogType = type
    CommonRepository.onChange()
    return promise
  }

  get isChooseFileDialogOpened() {
    return RuntimeRepository.showDialog == 'chooseFile'
  }

  get chooseFileDialogType(): 'image' | 'video' {
    if (RuntimeRepository.dialogType == 'video') return 'video'
    return 'image'
  }

  onFileChosen(fileName: string) {
    RuntimeRepository.choseFileDialogResolve(fileName)
    RuntimeRepository.showDialog = 'none'
    CommonRepository.onChange()
  }

  onChooseRejected() {
    RuntimeRepository.choseFileDialogReject()
    RuntimeRepository.showDialog = 'none'
  }
}

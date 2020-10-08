import RuntimeRepository from '@/repositories/RuntimeRepository'

let runtimeData = RuntimeRepository.Instance.data

export default class DialogService {
  private handleChooseFileDialog(resolve, reject) {
    runtimeData.choseFileDialogResolve = resolve
    runtimeData.choseFileDialogReject = reject
  }

  openChooseFileDialog(type: 'image' | 'video'): Promise<string> {
    let promise: Promise<string> = new Promise(this.handleChooseFileDialog)
    runtimeData.showDialog = 'chooseFile'
    runtimeData.dialogType = type
    return promise
  }

  get isChooseFileDialogOpened() {
    return runtimeData.showDialog == 'chooseFile'
  }

  get chooseFileDialogType(): 'image' | 'video' {
    if (runtimeData.dialogType == 'video') return 'video'
    return 'image'
  }

  onFileChosen(fileName: string) {
    runtimeData.choseFileDialogResolve(fileName)
    runtimeData.showDialog = 'none'
  }

  onChooseRejected() {
    runtimeData.choseFileDialogReject()
    runtimeData.showDialog = 'none'
  }
}

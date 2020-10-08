import Hotkeys from '@/utils/Hotkeys'
import SlideObjectService from './SlideObjectService'
import RuntimeRepository from '@/repositories/RuntimeRepository'

let runtimeData = RuntimeRepository.Instance.data

export default class HotkeysService {
  bindDefaultConstructorHotkeys() {
    let sos = new SlideObjectService()
    Hotkeys.bind('ctrl+v', () => sos.pasteObjects())
    Hotkeys.bind('ctrl+c', () => {
      sos.copyObjects(new Set(runtimeData.selectedObjectsIds))
    })
    Hotkeys.bind('ctrl+x', () => {
      sos.copyObjects(new Set(runtimeData.selectedObjectsIds))
      sos.deleteObjects(runtimeData.selectedObjectsIds)
    })
  }

  unbindDefaultConstructorHotkeys() {
    Hotkeys.unbind('ctrl+v')
    Hotkeys.unbind('ctrl+c')
    Hotkeys.unbind('ctrl+x')
  }
}

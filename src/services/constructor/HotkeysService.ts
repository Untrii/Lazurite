import Hotkeys from '@/utils/Hotkeys'
import SlideObjectService from './SlideObjectService'
import RuntimeRepository from '@/repositories/RuntimeRepository'
import HistoryService from './HistoryService'
import ConstrctorStore from '../store/ConstructorStore'

const runtimeData = RuntimeRepository.Instance.data

export default class HotkeysService {
  bindDefaultConstructorHotkeys() {
    const sos = new SlideObjectService()
    const historyService = new HistoryService()
    const store = new ConstrctorStore()
    Hotkeys.bind('ctrl+v', async () => {
      const pastedObjects = await sos.pasteObjects()
      historyService.registerPaste(pastedObjects, runtimeData.selectedSlideIndex)
    })
    Hotkeys.bind('ctrl+c', () => {
      sos.copyObjects(new Set(runtimeData.selectedObjectsIds))
    })
    Hotkeys.bind('ctrl+x', () => {
      sos.copyObjects(new Set(runtimeData.selectedObjectsIds))
      let deletedElements = Array.from(runtimeData.selectedObjectsIds).map((id) => store.elementById(id))
      historyService.registerCut(deletedElements, runtimeData.selectedSlideIndex)
      sos.deleteObjects(runtimeData.selectedObjectsIds)
    })
  }

  unbindDefaultConstructorHotkeys() {
    Hotkeys.unbind('ctrl+v')
    Hotkeys.unbind('ctrl+c')
    Hotkeys.unbind('ctrl+x')
  }
}

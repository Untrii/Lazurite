import ReactiveService from './ReactiveService'
import { Instance } from '@/repositories/CommonRepository'
import VisualisationService from './VisualisationService'

export default class ResourceService extends ReactiveService {
  get isOneElementSelected() {
    return Instance.variables.selectedObjectsIds.size == 1
  }

  get selectedElement() {
    let vs = new VisualisationService()
    for (const entry of Instance.variables.selectedObjectsIds) {
      return vs.elementById(entry)
    }
    return {}
  }
}

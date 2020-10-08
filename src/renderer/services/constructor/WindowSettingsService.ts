import RuntimeRepository from '@/repositories/NewRuntimeRepository'

let runtimeData = RuntimeRepository.Instance.data

export default class WindowSettingsService {
  changePreviewModuleSize(newSize: number) {
    runtimeData.previewModuleSize = newSize
  }
  changeInstrumentsModuleSize(newSize: number) {
    runtimeData.instrumentsModuleSize = newSize
  }
  changeTimelineModuleSize(newSize: number) {
    runtimeData.timelineModuleSize = newSize
  }

  /**
   * Disable or enable grid
   * @param newVal New state
   */
  changeGridState(newVal: boolean) {
    runtimeData.isGridEnabled = newVal
  }

  /**
   * Changes grid size. Variants: 16*9(144) or 32*18(576)
   * @param newVal New size
   */
  changeGridSize(newVal: 144 | 576) {
    runtimeData.gridSize = newVal
  }
}

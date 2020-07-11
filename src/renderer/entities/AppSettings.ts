export default interface AppSettings {
  selectedLoacale: Locale
  previewModuleSize: number
  instrumentsModuleSize: number
  timelineModuleSize: number
  autoSaveInterval: number
}

export enum Locale {
  English,
  Russian,
}

export let defaultSettings: AppSettings = {
  selectedLoacale: Locale.English,
  previewModuleSize: 280,
  instrumentsModuleSize: 320,
  timelineModuleSize: 200,
  autoSaveInterval: 10000,
}

import ElectronIO from './ElectronIO'
import isElectron from 'common/util/isElectron'

let defaultIO = isElectron() ? new ElectronIO() : null

export default defaultIO

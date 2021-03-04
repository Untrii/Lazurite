import Color from '@/models/common/Color'
import Presentation from '@/models/presentation/Presentation'
import ElectronIO from './ElectronIO'
import IIoManager from './IoManager'
import isElectron from './isElectron'

let defaultIO = isElectron() ? new ElectronIO() : null

export default defaultIO

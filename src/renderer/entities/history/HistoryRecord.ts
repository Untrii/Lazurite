import WaybackProperties from './WaybackProperties'

export default interface HistoryRecord {
  actionType: string
  timeStamp: number
  waybackFunction: string
  waybackArguments: WaybackProperties
  oldValue: any
  newValue: any
}

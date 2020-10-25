import IWaybackProperties from './IWaybackProperties'

export default interface IHistoryRecord {
  actionType: string;
  timeStamp: number;
  waybackFunction: string;
  waybackArguments: IWaybackProperties;
  oldValue: any;
  newValue: any;
}

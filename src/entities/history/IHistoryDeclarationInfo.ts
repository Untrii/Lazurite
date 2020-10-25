import IHistoryRecordInfo from './IHistoryRecordInfo'

export default interface IHistoryDeclarationInfo {
  undo: IHistoryRecordInfo[];
  redo: IHistoryRecordInfo[];
}

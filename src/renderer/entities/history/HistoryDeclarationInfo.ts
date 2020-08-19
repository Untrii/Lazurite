import HistoryRecordInfo from './HistoryRecordInfo'

export default interface HistoryDeclarationInfo {
  undo: HistoryRecordInfo[]
  redo: HistoryRecordInfo[]
}

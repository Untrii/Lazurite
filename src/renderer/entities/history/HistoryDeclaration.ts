import HistoryRecord from './HistoryRecord'

export default interface HistoryDeclaration {
  undo: HistoryRecord[]
  redo: HistoryRecord[]
}

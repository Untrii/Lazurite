import IHistoryRecord from './IHistoryRecord'

export default interface IHistoryDeclaration {
  undo: IHistoryRecord[];
  redo: IHistoryRecord[];
}

export function getBlankHistory(): IHistoryDeclaration {
  return {
    undo: [],
    redo: []
  }
}

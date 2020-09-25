import ISlideObject from '@/entities/ISlideObject'
import Color from '@/entities/color'

export default interface ISpreadsheet extends ISlideObject {
  rowCount: number
  columnCount: number
  fontSize: number
  content: string[][]
  rowSizes: number[]
  columnSizes: number[]
  highlightTop: boolean
  highlightBottom: boolean
  highlightLeft: boolean
  highlightRight: boolean
  stripHorizontally: boolean
  stripVertically: boolean
  darkStyle: boolean
  borderRadius: number
  color: Color
  showBorders: boolean
}

export function getBlankObject(): ISpreadsheet {
  return {
    id: '',
    type: 'spreadsheet/placeholder',
    color: new Color().fromRgb(0, 0, 0),
    rowCount: 5,
    columnCount: 5,
    rowSizes: [0.2, 0.2, 0.2, 0.2, 0.2],
    columnSizes: [0.2, 0.2, 0.2, 0.2, 0.2],
    highlightTop: true,
    highlightBottom: false,
    highlightLeft: false,
    highlightRight: false,
    stripHorizontally: true,
    stripVertically: false,
    darkStyle: false,
    borderRadius: 10,
    content: [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ],
    top: 270,
    left: 480,
    width: 960,
    height: 540,
    fontSize: 44,
    showBorders: true,
  }
}

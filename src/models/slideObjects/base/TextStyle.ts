import Color from '@/models/common/Color'

type TextStyle =
  | {
      presetName: string
    }
  | {
      fontFamily: string
      fontSize: number
      fontWeight: number
      color: Color
    }

export default TextStyle

export default interface ISlideObject {
  id: string
  width: number
  height: number
  top: number
  left: number
  type: string
}

export function getBlankObject(): ISlideObject {
  return {
    id: 'null',
    type: 'placeholder',
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  }
}

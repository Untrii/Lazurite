import randomString from '@/util/randomString'

export default class SlideObject {
  id = randomString()
  type = 'placeholder'
  top = 0
  left = 0
  width = 0
  height = 0
  zIndex = 0

  get bottom(): number {
    return this.top + this.height
  }

  get right(): number {
    return this.left + this.width
  }
}

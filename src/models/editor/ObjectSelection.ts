import SlideObject from '../presentation/slideObjects/base/SlideObject'

export default class ObjectSelection {
  private _items: Set<SlideObject> = new Set()

  setSelection(item: SlideObject) {
    console.log('selection changed')
    this._items.clear()
    this._items.add(item)
  }

  addItem(item: SlideObject) {
    console.log('selection changed')
    this._items.add(item)
  }

  deleteItem(item: SlideObject) {
    console.log('selection changed')
    this._items.delete(item)
  }

  isInSelection(item: SlideObject) {
    return this._items.has(item)
  }

  clear() {
    console.log('selection changed')
    this._items.clear()
  }

  get top(): number {
    return Math.min(...Array.from(this._items).map((item) => item.top))
  }

  get left(): number {
    return Math.min(...Array.from(this._items).map((item) => item.left))
  }

  get bottom(): number {
    return Math.max(...Array.from(this._items).map((item) => item.bottom))
  }

  get right(): number {
    return Math.max(...Array.from(this._items).map((item) => item.right))
  }

  get isEmpty(): boolean {
    return this._items.size === 0
  }
}
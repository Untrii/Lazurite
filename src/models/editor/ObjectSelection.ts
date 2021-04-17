import SlideObject from '../presentation/slideObjects/base/SlideObject'

export default class ObjectSelection {
  private _items: Set<SlideObject> = new Set()

  setSelection(item: SlideObject) {
    this._items.clear()
    this._items.add(item)
  }

  addItem(item: SlideObject) {
    this._items.add(item)
  }

  deleteItem(item: SlideObject) {
    this._items.delete(item)
  }

  isInSelection(item: SlideObject) {
    return this._items.has(item)
  }

  clear() {
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

  get size() {
    return this._items.size
  }

  get items(): SlideObject[] {
    return Array.from(this._items)
  }
}

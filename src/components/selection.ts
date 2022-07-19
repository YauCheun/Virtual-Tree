export class SelectionModel<T> {
  /** 已经选中的值。*/
  private _selections = new Set<T>();

  /** 缓存选定项的数组值。 */
  private _selected: T[] | null = [];
  get selected(): T[] {
    if (!this._selected) {
      this._selected = Array.from(this._selections.values());
    }
    return this._selected;
  }
  constructor(private _multiple = false, initiallySelectedValues?: T[]) {
    if (initiallySelectedValues && initiallySelectedValues.length) {
      if (_multiple) {
        initiallySelectedValues.forEach((value) => this._markSelected(value));
      } else {
        this._markSelected(initiallySelectedValues[0]);
      }
    }
  }
  /** 是否已经选择 */
  private _isSelected(value: T) {
    return this._selections.has(value);
  }
  /** 选中值 */
  private _markSelected(value: T) {
    if (!this._isSelected(value)) {
      // 这里写如果不是多选，则先清空所有被选择的
      if (!this._multiple) {
        // this._unMarkAll()
      }
      this._selections.add(value);
    }
  }
}

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
  /** 选中值,外部方法 */
  select(...values: T[]) {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._markSelected(value));
  }
  /** 删除选择值，外部方法 */
  deselect(...values: T[]) {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._unmarkSelected(value));
  }
  /** 是否已经选择 */
  isSelected(value: T) {
    return this._selections.has(value);
  }
  /** 选择是否为空 */
  isEmpty(): boolean {
    return this._selections.size === 0;
  }
  /**
   * 切换选择和取消选择之间的值。
   */
  toggle(value: T): void {
    this.isSelected(value) ? this.deselect(value) : this.select(value);
  }
  /**   验证值分配,如果指定的值数组被抛出错误包括多个值,而选择模型不支持多个值 */
  private _verifyValueAssignment(values: T[]) {
    if (values.length > 1 && !this._multiple) {
      throw getMultipleValuesInSingleSelectionError();
    }
  }
  /** 取消选择 */
  private _unmarkSelected(value: T) {
    if (this.isSelected(value)) {
      this._selections.delete(value);
    }
  }
  /** 清除所有选择 */
  private _unMarkAll() {
    if (!this.isEmpty) {
      this._selections.forEach((value) => this._unmarkSelected(value));
    }
  }

  /** 选中值 */
  private _markSelected(value: T) {
    if (!this.isSelected(value)) {
      // 这里写如果不是多选，则先清空所有被选择的
      if (!this._multiple) {
        this._unMarkAll();
      }
      this._selections.add(value);
    }
  }
}
export function getMultipleValuesInSingleSelectionError() {
  return Error(
    "Cannot pass multiple values into SelectionModel with single-value mode."
  );
}

/* eslint-disable @typescript-eslint/no-empty-function */
import { ref } from "vue";
import { SelectionModel } from "../selection";
import {
  nodeKey,
  RequiredTreeNodeOptions,
  TreeNodeOptions,
  TypeWithNull,
} from "./types";

class TreeService {
  selectedNodes = ref(new SelectionModel<RequiredTreeNodeOptions>());
  checkedNodeKeys = ref(new SelectionModel<nodeKey>(true));
  expandedKeys = ref(new SelectionModel<nodeKey>(true));
  disabledKeys = ref(new SelectionModel<nodeKey>(true));

  defaultSelectedKey: nodeKey = "";
  defaultCheckedKeys: nodeKey[] = [];
  defaultExpandedKeys: nodeKey[] = [];
  defaultDisabledKeys: nodeKey[] = [];
  constructor() {}
  flattenTree = (
    source: TreeNodeOptions[],
    defaultSelectedKey: nodeKey,
    defaultCheckedKeys: nodeKey[],
    defaultExpandedKeys: nodeKey[],
    defaultDisabledKeys: nodeKey[],
    checkStrictly = false,
    parent: TypeWithNull<RequiredTreeNodeOptions> = null
  ): RequiredTreeNodeOptions[] => {
    const result: RequiredTreeNodeOptions[] = [];
    const recursion = (
      list: TreeNodeOptions[],
      parent: TypeWithNull<RequiredTreeNodeOptions> = null
    ): RequiredTreeNodeOptions[] => {
      this.defaultSelectedKey = defaultSelectedKey;
      this.defaultCheckedKeys = defaultCheckedKeys;
      this.defaultExpandedKeys = defaultExpandedKeys;
      this.defaultDisabledKeys = defaultDisabledKeys;
      return list.map((item) => {
        const childrenSize = item.children?.length || 0;
        const flatNode: RequiredTreeNodeOptions = {
          ...item,
          level: parent ? parent.level + 1 : item.level || 0,
          loading: false,
          hasChildren: item.hasChildren || childrenSize > 0,
          children: item.children || [],
          parentKey: parent?.nodeKey || null,
        };
        let goon = true;
        if (parent) {
          if (defaultExpandedKeys.includes(parent.nodeKey)) {
            if (!checkStrictly && defaultCheckedKeys.includes(parent.nodeKey)) {
              // 默认展开并选中了
              defaultCheckedKeys.push(flatNode.nodeKey);
              this.checkedNodeKeys.value.select(flatNode.nodeKey);
            }
            result.push(flatNode);
          } else {
            goon = false;
          }
        } else {
          result.push(flatNode);
        }
        if (defaultDisabledKeys.includes(flatNode.nodeKey)) {
          this.disabledKeys.value.select(flatNode.nodeKey);
        }
        if (defaultSelectedKey === flatNode.nodeKey) {
          this.selectedNodes.value.select(flatNode);
        }
        if (defaultExpandedKeys.includes(flatNode.nodeKey)) {
          this.expandedKeys.value.select(flatNode.nodeKey);
        }

        if (defaultCheckedKeys.includes(flatNode.nodeKey)) {
          this.checkedNodeKeys.value.select(flatNode.nodeKey);
        }

        if (goon && childrenSize) {
          flatNode.children = recursion(flatNode.children, flatNode);
        }
        return flatNode;
      });
    };

    recursion(source, parent);
    return result;
  };
  updateDownwards = (node: RequiredTreeNodeOptions, check: boolean) => {
    const update = (children: RequiredTreeNodeOptions[]) => {
      if (children.length) {
        children.forEach((item) => {
          const checkFunc = check ? "select" : "deselect";
          this.checkedNodeKeys.value[checkFunc](item.nodeKey);
          if (!check) {
            this.removeDefaultCheckedKeys(item);
          }
          if (item.children?.length) {
            update(item.children as RequiredTreeNodeOptions[]);
          }
        });
      }
    };
    update(node.children as RequiredTreeNodeOptions[]);
  };
  updateUpwards = (
    node: RequiredTreeNodeOptions,
    flatList: RequiredTreeNodeOptions[]
  ) => {
    const update = (currentNode: RequiredTreeNodeOptions) => {
      // 说明是子节点
      if (currentNode.parentKey) {
        const parentNode = flatList.find(
          (i) => i.nodeKey === currentNode.parentKey
        )!;
        const parentChecked = (
          parentNode.children as RequiredTreeNodeOptions[]
        ).every((child) =>
          this.checkedNodeKeys.value.isSelected(child.nodeKey)
        );

        if (
          parentChecked !==
          this.checkedNodeKeys.value.isSelected(parentNode.nodeKey)
        ) {
          // 父节点变了的话，就还要继续向上更新
          this.checkedNodeKeys.value.toggle(parentNode.nodeKey);
          if (!parentChecked) {
            this.removeDefaultCheckedKeys(parentNode);
          }
          update(parentNode);
        }
      }
    };
    update(node);
  };
  resetDefaultSelectedKey(key: nodeKey = "") {
    this.defaultSelectedKey = key;
  }

  resetDefaultDisabledKeys(keys: nodeKey[]) {
    this.defaultDisabledKeys = keys;
  }

  resetDefaultCheckedKeys(keys: nodeKey[]) {
    this.defaultCheckedKeys = keys;
  }

  resetDefaultExpandedKeys(keys: nodeKey[]) {
    this.defaultExpandedKeys = keys;
  }
  removeDefaultCheckedKeys(node: RequiredTreeNodeOptions) {
    const inDefaultIndex = this.defaultCheckedKeys.findIndex(
      (item) => item === node.nodeKey
    );
    if (inDefaultIndex > -1) {
      this.defaultCheckedKeys.splice(inDefaultIndex, 1);
    }
  }
  removeDefaultExpandedKeys(key: nodeKey) {
    const inDefaultIndex = this.defaultExpandedKeys.findIndex(
      (item) => item === key
    );
    if (inDefaultIndex > -1) {
      this.defaultExpandedKeys.splice(inDefaultIndex, 1);
    }
  }
  getCheckedNodes(
    source: TreeNodeOptions[],
    checkedKeys: nodeKey[],
    checkStrictly = false
  ): TreeNodeOptions[] {
    const result: TreeNodeOptions[] = [];
    const checkedSize = checkedKeys.length;
    // console.log('checkedSize :>> ', checkedSize);
    let count = 0;
    // console.log('flatSourceTree :>> ', this.flatSourceTree);
    const recursion = (
      list: TreeNodeOptions[],
      parent: TypeWithNull<TreeNodeOptions> = null
    ) => {
      for (const item of list) {
        let goon = true;
        if (parent) {
          if (checkedKeys.includes(item.nodeKey)) {
            // 本身就在checkedKeys里的让它走正常流程
            count++;
            result.push(item);
          } else {
            if (
              !checkStrictly &&
              result.map((rItem) => rItem.nodeKey).includes(parent.nodeKey)
            ) {
              result.push(item); // 爹已选中 但自身不在checkedKeys里的让它跟爹走
            } else {
              if (count >= checkedSize) {
                // 爹和自己都没选中，如果checkedKeys里的内容找齐了，结束
                goon = false;
              }
            }
          }
        } else {
          if (checkedKeys.includes(item.nodeKey)) {
            count++;
            result.push(item);
          } else {
            if (count >= checkedSize) {
              goon = false;
            }
          }
        }
        if (goon) {
          if (item.children?.length) {
            recursion(item.children, item);
          }
        } else {
          break;
        }
      }
    };
    if (checkedSize) {
      recursion(source);
    }
    return result;
  }
}

export { TreeService };

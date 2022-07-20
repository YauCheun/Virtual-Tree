/* eslint-disable @typescript-eslint/no-empty-function */
import { ref } from "vue";
import { SelectionModel } from "../selection";
import { nodeKey, RequiredTreeNodeOptions } from "./types";

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
  // flattenTree = (source: TreeNodeOptions[]): RequiredTreeNodeOptions[] => {
  //   const result: RequiredTreeNodeOptions[] = [];
  //   const recursion = (
  //     list: TreeNodeOptions[],
  //     level = 0,
  //     parent: RequiredTreeNodeOptions | null = null
  //   ): RequiredTreeNodeOptions[] => {
  //     return list.map((item) => {
  //       const node: RequiredTreeNodeOptions = {
  //         ...item,
  //         level,
  //         loading: false,
  //         disabled: item.disabled || false,
  //         expanded: item.expanded || false,
  //         selected: item.selected || false,
  //         checked: item.checked || false,
  //         hasChildren: item.hasChildren || false,
  //         children: item.children || [],
  //         parentKey: parent?.nodeKey || null,
  //       };
  //       result.push(node);
  //       if (node.selected) {
  //         selectedKey.value = node.nodeKey;
  //       }
  //       if (item.expanded && node.children.length) {
  //         node.children = recursion(node.children, level + 1, node);
  //       }
  //       return node;
  //     });
  //   };
  //   if (source.length) {
  //     recursion(source);
  //   }
  //   return result;
  // };
}
export { TreeService };

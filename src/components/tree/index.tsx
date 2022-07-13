/* eslint-disable prettier/prettier */
import { defineComponent, PropType, ref, watch } from "vue";
import { cloneDeep } from "lodash";

import { nodeKey, RequiredTreeNodeOptions, TreeNodeOptions } from "./types";
import "./index.scss";
import ATreeNode from "./node";
const flattenTree = (source: TreeNodeOptions[]): RequiredTreeNodeOptions[] => {
  const result: RequiredTreeNodeOptions[] = [];
  const recursion = (
    list: TreeNodeOptions[],
    level = 0,
    parent: RequiredTreeNodeOptions | null = null
  ): RequiredTreeNodeOptions[] => {
    return list.map((item) => {
      const node: RequiredTreeNodeOptions = {
        ...item,
        level,
        loading: false,
        disabled: item.disabled || false,
        expanded: item.expanded || false,
        selected: item.selected || false,
        checked: item.checked || false,
        hasChildren: item.hasChildren || false,
        children: item.children || [],
        parentKey: parent?.nodeKey || null,
      };
      result.push(node);
      if (item.expanded && node.children.length) {
        node.children = recursion(node.children, level + 1, node);
      }
      return node;
    });
  };
  if (source.length) {
    recursion(source);
  }
  return result;
};

export default defineComponent({
  name: "ATree",
  props: {
    source: {
      type: Array as PropType<TreeNodeOptions[]>,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const flatList = ref<RequiredTreeNodeOptions[]>([]);
    const ExpandNode = (node: RequiredTreeNodeOptions) => {
      const trueChildren = cloneDeep(node.children);
      node.children = trueChildren.map((item) => {
        return {
          ...item,
          level: item.level || node.level + 1,
          loading: false,
          disabled: item.disabled || false,
          expanded: item.expanded || false,
          selected: item.selected || false,
          // ?? 可选链
          checked: item.checked ?? node.checked,
          hasChildren: item.hasChildren || false,
          children: item.children || [],
          parentKey: node.nodeKey || null,
        };
      });
      const targetIndex = flatList.value.findIndex(
        (i) => i.nodeKey === node.nodeKey
      );
      if (targetIndex > -1) {
        flatList.value.splice(
          targetIndex + 1,
          0,
          ...(node.children as RequiredTreeNodeOptions[])
        );
      }
    };
    const collapseNode = (node: RequiredTreeNodeOptions) => {
      const delKeys: nodeKey[] = [];
      const recursion = (currentNode: RequiredTreeNodeOptions) => {
        if (currentNode.children.length) {
          currentNode.children.forEach((item) => {
            delKeys.push(item.nodeKey);
            if (item.expanded) {
              item.expanded = false;
              recursion(item as RequiredTreeNodeOptions);
            }
          });
        }
        if (delKeys.length) {
          flatList.value = flatList.value.filter(
            (i) => !delKeys.includes(i.nodeKey)
          );
        }
      };
      node.expanded
      recursion(node);
    };
    const handleToggleExpand = (node: RequiredTreeNodeOptions) => {
      node.expanded = !node.expanded;
      if (node.expanded) {
        // 展开
        // 有可能是用户第一次展开，没有把children处理成RequiredTreeNodeOptions类型
        if (node.children.length) {
          ExpandNode(node);
        } else {
          // 懒加载
        }
      } else {
        // 收起
        collapseNode(node);
      }
    };
    watch(
      () => props.source,
      (newVal) => {
        flatList.value = flattenTree(newVal);
        console.log(flatList.value, newVal);
      },
      { immediate: true }
    );
    return () => {
      return (
        <div class="ant-tree-wrap">
          <div class="ant-tree">
            {flatList.value.map((node, index) => {
              return (
                <ATreeNode
                  key={node.nodeKey}
                  node={node}
                  onToggleExpand={handleToggleExpand}
                />
              );
            })}
          </div>
        </div>
      );
    };
  },
});

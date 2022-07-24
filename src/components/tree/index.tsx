/* eslint-disable prettier/prettier */
import { defineComponent, PropType, ref, watch } from "vue";
import { cloneDeep, uniq } from "lodash";

import {
  nodeKey,
  RenderFunc,
  RequiredTreeNodeOptions,
  TreeNodeInstance,
  TreeNodeOptions,
  TypeWithNull,
  TypeWithUndefined,
} from "./types";
import "./index.scss";
import VirTreeNode from "./node";
import { TreeService } from "./service";

export default defineComponent({
  name: "ATree",
  props: {
    source: {
      type: Array as PropType<TreeNodeOptions[]>,
      default: () => [],
    },
    defaultExpandedKeys: {
      type: Array as PropType<nodeKey[]>,
      default: () => [],
    },
    defaultSelectedKey: {
      type: [String, Number],
      default: "",
    },
    defaultCheckedKeys: {
      type: Array as PropType<nodeKey[]>,
      default: () => [],
    },
    defaultDisabledKeys: {
      type: Array as PropType<nodeKey[]>,
      default: () => [],
    },
    size: {
      type: Number,
      default: 27,
    },
    remain: {
      type: Number,
      default: 8,
    },
    lazyLoad: {
      type: Function as PropType<
        (
          node: RequiredTreeNodeOptions,
          callback: (children: TreeNodeOptions[]) => void
        ) => void
      >,
    },
    render: {
      type: Function as PropType<RenderFunc>,
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    checkStrictly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["selectChange", "checkChange", "toggleExpand"],
  setup(props, ctx) {
    const flatList = ref<RequiredTreeNodeOptions[]>([]);
    const loading = ref(false);
    const service = new TreeService();
    watch(
      () => props.source,
      (newVal) => {
        flatList.value = service.flattenTree(
          newVal,
          props.defaultSelectedKey,
          props.defaultCheckedKeys,
          props.defaultExpandedKeys,
          props.defaultDisabledKeys,
          props.checkStrictly
        );
        console.log(flatList.value, newVal);
      },
      { immediate: true }
    );
    watch(
      () => props.defaultExpandedKeys,
      (newVal) => {
        service.resetDefaultExpandedKeys(newVal);
        service.expandedKeys.value.clear();
        service.expandedKeys.value.select(...newVal);
        flatList.value = service.flattenTree(
          props.source,
          props.defaultSelectedKey,
          props.defaultCheckedKeys,
          props.defaultExpandedKeys,
          props.defaultDisabledKeys
        );
      }
    );

    watch(
      () => props.defaultDisabledKeys,
      (newVal) => {
        service.resetDefaultDisabledKeys(newVal);
        service.disabledKeys.value.clear();
        service.disabledKeys.value.select(...newVal);
      }
    );
    watch(
      () => props.defaultSelectedKey,
      (newVal) => {
        service.resetDefaultSelectedKey(newVal);
        const target = flatList.value.find((item) => item.nodeKey === newVal);
        if (target) {
          service.selectedNodes.value.clear();
          service.selectedNodes.value.select(target);
        }
      }
    );
    watch(
      () => props.defaultCheckedKeys,
      (newVal) => {
        service.resetDefaultCheckedKeys(newVal);
        if (newVal.length) {
          service.checkedNodeKeys.value.clear();
          service.checkedNodeKeys.value.select(...newVal);
        }
      }
    );
    const ExpandNode = (
      node: RequiredTreeNodeOptions,
      children: TreeNodeOptions[] = []
    ) => {
      const trueChildren = children.length
        ? children
        : cloneDeep(node.children)!;
      const selectedKey =
        service.selectedNodes.value.selected[0]?.nodeKey ||
        service.defaultSelectedKey;
      const allExpandedKeys = service.expandedKeys.value.selected.concat(
        service.defaultExpandedKeys
      );
      const allCheckedKeys = service.checkedNodeKeys.value.selected.concat(
        service.defaultCheckedKeys
      );
      // !props.checkStrictly &&
      if (
        !props.checkStrictly &&
        service.checkedNodeKeys.value.isSelected(node.nodeKey)
      ) {
        allCheckedKeys.push(...trueChildren.map((item) => item.nodeKey));
      }
      node.children = service.flattenTree(
        trueChildren,
        selectedKey,
        uniq(allCheckedKeys),
        allExpandedKeys,
        props.defaultDisabledKeys,
        props.checkStrictly,
        node
      );
      const targetIndex = flatList.value.findIndex(
        (item) => item.nodeKey === node.nodeKey
      );
      flatList.value.splice(
        targetIndex + 1,
        0,
        ...(node.children as RequiredTreeNodeOptions[])
      );
    };
    const collapseNode = (node: RequiredTreeNodeOptions) => {
      const delKeys: nodeKey[] = [];
      const recursion = (currentNode: RequiredTreeNodeOptions) => {
        if (currentNode.children.length) {
          currentNode.children.forEach((item) => {
            delKeys.push(item.nodeKey);
            if (service.expandedKeys.value.isSelected(item.nodeKey)) {
              service.expandedKeys.value.deselect(item.nodeKey);
              recursion(item as RequiredTreeNodeOptions);
            }
          });
        }
      };
      if (delKeys.length) {
        flatList.value = flatList.value.filter(
          (i) => !delKeys.includes(i.nodeKey)
        );
      }
      recursion(node);
    };
    const handleToggleExpand = (node: RequiredTreeNodeOptions) => {
      if (loading.value) return;
      service.expandedKeys.value.toggle(node.nodeKey);
      if (service.expandedKeys.value.isSelected(node.nodeKey)) {
        // 展开
        // 有可能是用户第一次展开，没有把children处理成RequiredTreeNodeOptions类型
        if (node.children?.length) {
          ExpandNode(node);
        } else {
          // 懒加载
          if (props.lazyLoad) {
            loading.value = true;
            node.loading = true;
            props.lazyLoad(node, (children) => {
              ExpandNode(node, children);
              loading.value = false;
              node.loading = false;
            });
          }
        }
      } else {
        service.removeDefaultExpandedKeys(node.nodeKey);
        // 收起
        collapseNode(node);
      }
      ctx.emit("toggleExpand", {
        status: service.expandedKeys.value.isSelected(node.nodeKey),
        node,
      });
    };
    const handleSelectChange = (node: RequiredTreeNodeOptions) => {
      const preSelectedNode = service.selectedNodes.value.selected[0];
      let currentNode: TypeWithNull<TreeNodeOptions> = node;
      if (service.selectedNodes.value.isSelected(node)) {
        service.selectedNodes.value.clear();
        currentNode = null;
        service.resetDefaultSelectedKey();
      } else {
        service.selectedNodes.value.select(node);
      }
      ctx.emit("selectChange", {
        preSelectedNode,
        node: currentNode,
      });
    };
    const handleCheckChange = ([checked, node]: [
      boolean,
      RequiredTreeNodeOptions
    ]) => {
      service.checkedNodeKeys.value.toggle(node.nodeKey);
      if (!checked) {
        service.removeDefaultCheckedKeys(node);
      }
      if (!props.checkStrictly) {
        service.updateDownwards(node, checked);
        service.updateUpwards(node, flatList.value);
      }
      // console.log('checkChange defaultCheckedKeys:>> ', service.defaultCheckedKeys);
      // console.log('checkChange selected:>> ', service.checkedNodeKeys.value.selected);
      ctx.emit("checkChange", { checked, node });
    };

    const nodeRefs = ref<TreeNodeInstance[]>([]);
    const setRef = (index: number, node: any) => {
      if (node) {
        nodeRefs.value[index] = node as TreeNodeInstance;
      }
    };
    ctx.expose({
      getSelectedNode: (): TypeWithUndefined<TreeNodeOptions> => {
        return service.selectedNodes.value.selected[0];
      },
      getCheckedNodes: (): TreeNodeOptions[] => {
        return props.lazyLoad
          ? flatList.value.filter((item) =>
              service.checkedNodeKeys.value.selected.includes(item.nodeKey)
            )
          : service.getCheckedNodes(
              props.source,
              service.checkedNodeKeys.value.selected,
              props.checkStrictly
            );
      },
      getHalfCheckedNodes: (): TreeNodeOptions[] => {
        return nodeRefs.value
          .filter((item) => item.halfChecked())
          .map((item) => item.rawNode);
      },
      getExpandedKeys: (): nodeKey[] => {
        return service.expandedKeys.value.selected;
      },
    });
    return () => {
      return (
        <div class="vir-tree">
          <vir-list
            v-slots={{
              default: (data: {
                item: RequiredTreeNodeOptions;
                index: number;
              }) => (
                <VirTreeNode
                  ref={setRef.bind(null, data.index)}
                  node={data.item}
                  selectedNodes={service.selectedNodes.value.selected}
                  checkedNodeKeys={service.checkedNodeKeys.value.selected}
                  expandedKeys={service.expandedKeys.value.selected}
                  disabledKeys={service.disabledKeys.value.selected}
                  iconSlot={ctx.slots.icon}
                  showCheckbox={props.showCheckbox}
                  render={props.render}
                  checkStrictly={props.checkStrictly}
                  onToggleExpand={handleToggleExpand}
                  onSelectChange={handleSelectChange}
                  onCheckChange={handleCheckChange}
                />
              ),
            }}
            size={props.size}
            remain={props.remain}
            list={flatList.value}
          ></vir-list>
        </div>
      );
    };
  },
});

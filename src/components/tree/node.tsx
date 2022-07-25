/* eslint-disable prettier/prettier */
import { computed, defineComponent, onMounted, PropType, Slot, watch } from "vue";
import {
  CustomEventFuncType,
  nodeKey,
  RenderFunc,
  RequiredTreeNodeOptions,
} from "./types";
import RenderNode from "./render";
import ACheckBox from "../Checkbox/index";
export default defineComponent({
  name: "VirTreeNode",
  props: {
    node: {
      type: Object as PropType<RequiredTreeNodeOptions>,
      required: true,
    },
    selectedNodes: {
      type: Array as PropType<RequiredTreeNodeOptions[]>,
      required: true,
    },
    checkedNodeKeys: {
      type: Array as PropType<nodeKey[]>,
      required: true,
    },
    expandedKeys: {
      type: Array as PropType<nodeKey[]>,
      required: true,
    },
    disabledKeys: {
      type: Array as PropType<nodeKey[]>,
      required: true,
    },
    onToggleExpand: {
      type: Function as CustomEventFuncType<RequiredTreeNodeOptions>,
    },
    onSelectChange: {
      type: Function as CustomEventFuncType<RequiredTreeNodeOptions>,
    },
    onCheckChange: {
      type: Function as CustomEventFuncType<[boolean, RequiredTreeNodeOptions]>,
    },
    render: {
      type: Function as PropType<RenderFunc>,
    },
    iconSlot: {
      type: Function as PropType<Slot>,
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
  emits: ["toggle-expand", "select-change", "check-change"],
  setup(props, ctx) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const getCheckedChildrenSize = (): number => {
      let result = 0;
      if (!props.checkStrictly && props.node.hasChildren) {
        const { children } = props.node;
        const checkedChildren = (children as RequiredTreeNodeOptions[])!.filter(
          (item) => props.checkedNodeKeys.includes(item.nodeKey)
        );
        result = checkedChildren.length;
      }
      return result;
    };

    const textCls = computed(() => {
      let result = "node-title";
      if (props.disabledKeys.includes(props.node.nodeKey)) {
        result += " disabled";
      }
      if (
        props.selectedNodes[0].nodeKey === props.node.nodeKey &&
        !props.showCheckbox
      ) {
        result += " selected";
      }
      return result;
    });
    const halfChecked = computed(() => {
      let result = false;
      const checkedChildrenSize = getCheckedChildrenSize();
      result =
        checkedChildrenSize > 0 &&
        checkedChildrenSize < props.node.children!.length;
      return result;
    });
    const handleExpand = () => {
      ctx.emit("toggle-expand", props.node);
    };
    const handleSelect = (e: Event) => {
      e.stopPropagation();
      if (!props.disabledKeys.includes(props.node.nodeKey)) {
        ctx.emit("select-change", props.node);
      }
    };
    const handleCheckChange = (checked: boolean) => {
      ctx.emit("check-change", [checked, props.node]);
    };
    const setCheckedStatus = () => {
      const checkedChildrenSize = getCheckedChildrenSize();
      const shouldChecked =
        checkedChildrenSize > 0 &&
        checkedChildrenSize === props.node.children!.length;
      if (
        shouldChecked &&
        !props.checkedNodeKeys.includes(props.node.nodeKey)
      ) {
        console.log(shouldChecked)
        handleCheckChange(shouldChecked);
      }
    };
    watch(() => props.node, () => {
      setCheckedStatus();
    });

    watch(() => props.checkedNodeKeys, newVal => {
      setCheckedStatus();
    });
    onMounted(() => {
      console.log(11)
      setCheckedStatus();
    });
    const RenderArrow = (): JSX.Element => {
      return (
        <div
          class={[
            "node-arrow",
            props.expandedKeys.includes(props.node.nodeKey) ? "expanded" : "",
          ]}
        >
          {props.node.hasChildren ? (
            props.iconSlot ? (
              props.iconSlot(props.node.loading)
            ) : props.node.loading ? (
              <i class="iconfont iconloading ico-loading"></i>
            ) : (
              <i class="iconfont iconExpand"></i>
            )
          ) : null}
        </div>
      );
    };
    const normalContent = (): JSX.Element => {
      return props.render ? (
        <RenderNode render={props.render} node={props.node} />
      ) : (
        <div class={textCls.value}>{props.node.name}</div>
      );
    };
    const RenderContent = (): JSX.Element => {
      if (props.showCheckbox) {
        return (
          <ACheckBox
            class="node-content node-text"
            modelValue={props.checkedNodeKeys.includes(props.node.nodeKey)}
            disabled={props.disabledKeys.includes(props.node.nodeKey)}
            halfChecked={halfChecked.value}
            onChange={handleCheckChange}
          >
            {normalContent()}
          </ACheckBox>
        );
      }
      return (
        <div class="node-content node-text" onClick={handleSelect}>
          {normalContent()}
        </div>
      );
    };
    return () => {
      return (
        <div
          class="vir-tree-node"
          style={{ paddingLeft: props.node.level * 18 + "px" }}
          onClick={handleExpand}
        >
          {RenderArrow()}
          {RenderContent()}
        </div>
      );
    };
  },
});

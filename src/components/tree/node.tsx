/* eslint-disable prettier/prettier */
import { computed, defineComponent, PropType, Slot } from "vue";
import { RenderFunc, RequiredTreeNodeOptions } from "./types";
import RenderNode from "./render";
type CustomEventType<T> = (arg: T) => void;
export default defineComponent({
  name: "ATreeNode",
  props: {
    node: {
      type: Object as PropType<RequiredTreeNodeOptions>,
      required: true,
    },
    onToggleExpand: {
      type: Function as PropType<CustomEventType<RequiredTreeNodeOptions>>,
    },
    onSelectChange: {
      type: Function as PropType<CustomEventType<RequiredTreeNodeOptions>>,
    },
    render: {
      type: Function as PropType<RenderFunc>,
    },
    iconSlot: {
      type: Function as PropType<Slot>,
    },
  },
  emits: ["toggle-expand", "select-change"],
  setup(props, ctx) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { node, render, iconSlot } = props;
    const textCls = computed(() => {
      let result = "node-title";
      if (node.disabled) {
        result += " disabled";
      }
      if (node.selected) {
        result += " selected";
      }
      return result;
    });
    const handleExpand = () => {
      ctx.emit("toggle-expand", node);
    };
    const handleSelect = (e: Event) => {
      e.stopPropagation();
      if (!node.disabled) {
        ctx.emit("select-change", node);
      }
    };
    const RenderArrow = (): JSX.Element => {
      return (
        <div class={["node-arrow", node.expanded ? "expanded" : ""]}>
          {node.hasChildren ? (
            iconSlot ? (
              iconSlot(node.loading)
            ) : node.loading ? (
              <i class="iconfont iconloading ico-loading"></i>
            ) : (
              <i class="iconfont iconExpand"></i>
            )
          ) : null}
        </div>
      );
    };
    const RenderContent = (): JSX.Element => {
      return (
        <div class="node-content node-text" onClick={handleSelect}>
          {render ? (
            <RenderNode render={render} node={node} />
          ) : (
            <div class={textCls.value}>{node.name}</div>
          )}
        </div>
      );
    };
    return () => {
      return (
        <div
          class="ant-tree-node"
          style={{ paddingLeft: node.level * 18 + "px" }}
          onClick={handleExpand}
        >
          {RenderArrow()}
          {RenderContent()}
        </div>
      );
    };
  },
});

/* eslint-disable prettier/prettier */
import { computed, defineComponent, PropType } from "vue";
import { RequiredTreeNodeOptions } from "./types";

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
  },
  emits: ["toggle-expand", "select-change"],
  setup(props, ctx) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { node } = props;
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
            node.loading ? (
              <i class="iconfont iconloading ico-loading"></i>
            ) : (
              <i class="iconfont iconExpand"></i>
            )
          ) : null}
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
          <div class="node-content node-text" onClick={handleSelect}>
            <div class={textCls.value}>{node.name}</div>
          </div>
        </div>
      );
    };
  },
});

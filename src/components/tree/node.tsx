/* eslint-disable prettier/prettier */
import { computed, defineComponent, PropType } from "vue";
import { RequiredTreeNodeOptions } from "./types";

export default defineComponent({
  name: "ATreeNode",
  props: {
    node: {
      type: Object as PropType<RequiredTreeNodeOptions>,
      required: true,
    },
    onToggleExpand: {
      type: Function as PropType<(arg: RequiredTreeNodeOptions) => void>,
    },
  },
  emits: ["toggle-expand"],
  setup(props, ctx) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { node } = props;
    const textCls = computed(() => {
      let result = "node-title";
      if (node.disabled) {
        result += " disabled";
      }
      return result;
    });
    const handleExpand = () => {
      ctx.emit("toggle-expand", node);
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
          <div class="node-content node-text">
            <div class={textCls.value}>{node.name}</div>
          </div>
        </div>
      );
    };
  },
});

/* eslint-disable prettier/prettier */
import { defineComponent, PropType, ref, toRefs, watch } from "vue";
import { RequiredTreeNodeOptions, TreeNodeOptions } from "./types";

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
    const handleExpand = () => {
      ctx.emit("toggle-expand", node);
    };
    const RenderArrow = (): JSX.Element => {
      return (
        <div
          class={["node-arrow", node.expanded ? "expanded" : ""]}
          onClick={handleExpand}
        >
          {node.hasChildren ? <i class="iconfont iconExpand"></i> : null}
        </div>
      );
    };
    return () => {
      return (
        <div
          class="ant-tree-node"
          style={{ paddingLeft: node.level * 18 + "px" }}
        >
          {RenderArrow()}
          <div class="node-content node-text">
            <div class="node-title">{node.name}</div>
          </div>
        </div>
      );
    };
  },
});

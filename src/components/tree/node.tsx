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
  },
  setup(props, ctx) {
    const node = toRefs(props.node);
    console.log(node.name);
    return () => {
      return (
        <div class="ant-tree-node">
          <div class="node-arrow">
            {node.hasChildren.value ? <i class="iconfont iconExpand"></i> : null}
          </div>
          <div class="node-content node-text">
            <div class="node-title">{node.name.value}</div>
          </div>
        </div>
      );
    };
  },
});

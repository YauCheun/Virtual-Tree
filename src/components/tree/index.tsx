/* eslint-disable prettier/prettier */
import { defineComponent, PropType } from "vue";
import { TreeNodeOptions } from "./types";
export default defineComponent({
  name: "ATree",
  props: {
    source: {
      type: Array as PropType<TreeNodeOptions[]>,
      default: ()=> []
    }
  },
  setup(props,ctx) {
    return ()=>{
      return (
        <div class="ant-tree-wrap">
          <div class="ant-tree">
            <div class="ant-tree-node">
              <div class="tree-content">aaaa</div>
            </div>
            <div class="ant-tree-node">
              <div class="tree-content">aaaa</div>
            </div>
          </div>
        </div>
      )
    }
  },
});

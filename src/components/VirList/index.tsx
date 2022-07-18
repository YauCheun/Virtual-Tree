import { defineComponent, computed, onMounted, ref, markRaw, watch } from "vue";
import { ZoneInfo } from "./types";

export default defineComponent({
  name: "VirList",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    customForOf: {
      type: Boolean,
      default: false,
    },
    // 节点高度
    size: {
      type: Number,
      required: true,
    },
    // 渲染节点个数
    remain: {
      type: Number,
      required: true,
    },
    start: {
      type: Number,
      default: 0,
    },
    offset: {
      // 设置scrollTop
      type: Number,
      default: 0,
    },
    additional: {
      // 额外渲染多少个节点？
      type: Number,
      default: 0,
    },
    dataKey: {
      type: String,
      default: "id",
    },
  },
  emits: ["update:modelValue", "range"],
  setup(props, { emit, slots }) {
    const root = ref<HTMLElement | null>(null);
    const base = markRaw({
      start: 0,
      end: 0,
      scrollTop: 0,
      paddingTop: 0,
      paddingBottom: 0,
    });
    const visibleList = ref<any[]>([]);
    const keeps = computed(
      () => props.remain + (props.additional || props.remain)
    );
    const maxHeight = computed(() => props.size * props.remain);
    const getEndIndex = (start: number): number => {
      const end = start + keeps.value - 1;
      return props.list.length ? Math.min(props.list.length - 1, end) : end;
    };
    const getZone = (startIndex: number): ZoneInfo => {
      let start = Math.max(0, startIndex);
      const remainCount = props.list.length - keeps.value;
      const isLastZone = start >= remainCount;
      if (isLastZone) {
        start = Math.max(0, remainCount);
      }
      return {
        start,
        end: getEndIndex(start),
        isLastZone,
      };
    };
    const updateZone = (offset: number, forceUpdate = false) => {
      console.log("updateZone", offset, forceUpdate);
      const startIndex = Math.floor(offset / props.size); //从第几个开始
      const zone = getZone(startIndex);
      // const additional = props.additional || props.remain;
      // let shouldRefresh = false;
      // if (forceUpdate) {
      //   shouldRefresh = true;
      // } else {
      //   if (startIndex < base.start) {
      //     // 向上滚
      //     shouldRefresh = true;
      //   } else {
      //     if (zone.isLastZone) {
      //       if (base.start !== zone.start || base.end !== zone.end) {
      //         shouldRefresh = true;
      //       }
      //     } else {
      //       shouldRefresh = startIndex >= base.start + additional;
      //     }
      //   }
      // }
      // if (shouldRefresh) {
      //   base.start = zone.start;
      //   base.end = zone.end;
      //   updateContainer();
      //   updateVisibleList();
      // }
    };

    watch(
      () => props.list,
      (newVal: any[]) => {
        if (props.list.length > keeps.value) {
          updateZone(root.value!.scrollTop, true);
          // console.dir(root.value);
        } else {
          // refresh();
        }
      },
      {
        deep: true,
      }
    );
    const boxContent = () => {
      if (props.customForOf) {
        return slots.default!();
      }
      return visibleList.value.map((item, index) => {
        return (
          <div key={item[props.dataKey]}>
            {slots.default!({ item, index: base.start + index })}
          </div>
        );
      });
    };
    return () => {
      return (
        <div
          class="vir-list"
          ref={root}
          // onScroll={onScroll}
          style={{ maxHeight: maxHeight.value + "px", overflowY: "auto" }}
        >
          <div
            class="main-box"
            style={{
              paddingTop: base.paddingTop + "px",
              paddingBottom: base.paddingBottom + "px",
            }}
          >
            {boxContent()}
          </div>
        </div>
      );
    };
  },
});

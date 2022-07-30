import {
  defineComponent,
  computed,
  onMounted,
  ref,
  markRaw,
  watch,
  HtmlHTMLAttributes,
} from "vue";
import { ZoneInfo } from "./types";
import "../../assets/styles/index.scss";
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
    const visibleList = ref<any[]>([]);
    const base = markRaw({
      start: 0,
      end: 0,
      scrollTop: 0,
      paddingTop: 0,
      paddingBottom: 0,
    });
    const keeps = computed(() => {
      return props.remain + (props.additional || props.remain);
    });
    const maxHeight = computed(() => {
      return props.remain * props.size;
    });
    const getEndIndex = (start: number): number => {
      const end = start + keeps.value - 1;
      return props.list.length < end ? props.list.length - 1 : end;
    };
    const getArea = (startIndex: number): ZoneInfo => {
      let start = Math.max(0, startIndex);
      const remainCount = props.list.length - keeps.value;
      const isLastZone = start >= remainCount;
      if (isLastZone) {
        start = Math.max(0, remainCount);
      }
      return {
        start,
        isLastZone,
        end: getEndIndex(start),
      };
    };
    const filterNodes = () => {
      if (props.list.length) {
        const nodes = [];
        for (let a = base.start; a < base.end; a++) {
          nodes.push(props.list[a]);
        }
        return nodes;
      }
      return [];
    };
    // 重新计算展示的虚拟数据
    const updateVisibleList = () => {
      if (props.customForOf) {
        emit("range", {
          start: base.start,
          end: base.end,
        });
      } else {
        visibleList.value = filterNodes();
        console.log(visibleList.value);
      }
    };
    // 重新计算页面style
    const updateContainer = () => {
      const total = props.list.length;
      const needPadding = total > keeps.value;
      const paddingTop = props.size * (needPadding ? base.start : 0);
      let paddingBottom =
        props.size * (needPadding ? total - keeps.value : 0) - paddingTop;
      if (paddingBottom < props.size) {
        paddingBottom = 0;
      }
      base.paddingTop = paddingTop;
      base.paddingBottom = paddingBottom;
    };
    // 重置
    const refresh = (init = false) => {
      if (init) {
        base.start =
          props.list.length > base.start + keeps.value ? props.start : 0;
      } else {
        base.start = 0;
      }
      base.end = getEndIndex(base.start);
      updateContainer();
      updateVisibleList();
    };
    // 重新更新展示区域
    const updateZone = (offset: number, forceUpdate = false) => {
      let shouldRefresh = false;
      const startIndex = Math.floor(offset / props.size);
      const area = getArea(startIndex);
      const additional = keeps.value - props.remain;
      if (forceUpdate) {
        shouldRefresh = true;
      } else {
        if (startIndex < base.start) {
          //向上滚动
          shouldRefresh = true;
        } else {
          if (area.isLastZone) {
            if (area.start != base.start || area.end != base.end) {
              shouldRefresh = true;
            }
          } else {
            // 滚动距离超出虚拟高度区域
            shouldRefresh = startIndex >= base.start + additional;
          }
        }
      }
      if (shouldRefresh) {
        base.start = area.start;
        base.end = area.end;
        updateContainer();
        updateVisibleList();
      }
    };

    watch(
      () => props.list,
      (newVal: any[]) => {
        if (props.list.length > keeps.value) {
          updateZone(root.value!.scrollTop, true);
          // console.dir(root.value);
        } else {
          refresh();
        }
      },
      {
        deep: true,
      }
    );
    onMounted(() => {
      if (props.list.length) {
        refresh(true);
      }
      if (props.start) {
        const start = getArea(props.start).start;
        setScrollTop(start * props.size);
      } else {
        setScrollTop(props.offset);
      }
    });
    const setScrollTop = (scrollTop: number) => {
      root.value!.scrollTop = scrollTop;
    };
    const onScroll = () => {
      if (props.list.length > keeps.value) {
        updateZone(root.value!.scrollTop);
      } else {
        refresh();
      }
    };
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
          onScroll={onScroll}
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

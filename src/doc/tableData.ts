const columns = [
  {
    title: "参数",
    dataIndex: "argument",
  },
  {
    title: "说明",
    dataIndex: "description",
  },
  {
    title: "类型",
    dataIndex: "type",
  },
  {
    title: "默认值",
    dataIndex: "defaultValue",
  },
];
const methodColumns = [
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "说明",
    dataIndex: "description",
  },
  {
    title: "参数",
    dataIndex: "type",
  },
];
const slotColumns = [
  {
    title: "插槽名",
    dataIndex: "argument",
  },
  {
    title: "说明",
    dataIndex: "description",
  },
  {
    title: "参数",
    dataIndex: "type",
  },
];
const slotData = [
  {
    argument: "icon",
    description: "返回一个loading,用来标识是否是加载状态",
    type: "loading:true or false",
  },
  {
    argument: "node",
    description: "返回当前node节点数据",
    type: "详见TreeNodeOptions",
  },
];

const propData = [
  {
    argument: "size",
    description: "用于虚拟计算，每个节点的高度",
    type: "number",
    defaultValue: 27,
  },
  {
    argument: "remain",
    description: "用于虚拟计算，可视区内显示多少个节点",
    type: "number",
    defaultValue: 8,
  },
  {
    argument: "source",
    description: "数据源",
    type: "TreeNodeOptions[]",
    defaultValue: "[]",
  },
  {
    argument: "showCheckbox",
    description: "勾选模式",
    type: "boolean",
    defaultValue: "false",
  },
  {
    argument: "checkStrictly",
    description: "勾选时，父子不联动",
    type: "boolean",
    defaultValue: "false",
  },
  {
    argument: "loadData",
    description: "异步加载",
    type: "(node: TreeNodeOptions, callback: (children: TreeNodeOptions[]) => void) => void",
    defaultValue: "undefined",
  },
  {
    argument: "render",
    description: "自定义渲染节点",
    type: "() => JSX.Element",
    defaultValue: "undefined",
  },
  {
    argument: "defaultExpandedKeys",
    description: "默认展开的nodeKey数组",
    type: "Array<string | number>",
    defaultValue: "[]",
    version: "4.0.0",
  },
  {
    argument: "defaultDisabledKeys",
    description: "默认禁用的nodeKey数组",
    type: "Array<string | number>",
    defaultValue: "[]",
    version: "4.0.0",
  },
  {
    argument: "defaultCheckedKeys",
    description: "默认勾选的nodeKey数组",
    type: "Array<string | number>",
    defaultValue: "[]",
    version: "4.0.0",
  },
  {
    argument: "defaultSelectedKey",
    description: "默认选中的nodeKey",
    type: "string | number",
    defaultValue: "",
    version: "4.0.0",
  },
];
const eventData = [
  {
    name: "selectChange",
    description: "选择节点时触发",
    type: "{ preSelectedNode: TreeNodeOptions; node: TreeNodeOptions; }，preSelectedNode和node分别是之前选中和当前选中的节点",
  },
  {
    name: "checkChange",
    description: "勾选节点时触发",
    type: "{ checked: boolean; node: TreeNodeOptions }",
  },
  {
    name: "toggleExpand",
    description: "展开收起时触发",
    type: "{ status: boolean; node: TreeNodeOptions; }，status是当前的展开状态",
  },
];
const methodData = [
  {
    name: "getSelectedNode",
    description: "获取选中的节点",
    type: "() => TreeNodeOptions | undefined",
  },
  {
    name: "getCheckedNodes",
    description: "获取已勾选的节点",
    type: "() => TreeNodeOptions",
  },
  {
    name: "getHalfCheckedNodes",
    description: "获取半勾选的节点",
    type: "() => TreeNodeOptions",
  },
  {
    name: "getExpandedKeys",
    description: "获取已展开的nodeKeys",
    type: "() => Array<string | number>",
    version: "4.0.0",
  },
];
const nodeOptionData = [
  {
    argument: "nodeKey",
    description: "必传，节点的唯一标识",
    type: "string | number",
  },
  {
    argument: "name",
    description: "必传，显示的节点名称",
    type: "string",
  },
  {
    argument: "hasChildren",
    description: "必传，用于判断是否还有children，控制展开图标的显示",
    type: "boolean",
  },
  {
    argument: "level",
    description: "层级，内部计算",
    type: "number",
  },
  {
    argument: "loading",
    description: "是否正在加载数据",
    type: "boolean",
    defaultValue: "false",
  },
  {
    argument: "children",
    description: "子集",
    type: "TreeNodeOptions[]",
    defaultValue: "[]",
  },
  {
    argument: "parentKey",
    description: "父节点的nodeKey, 组件内部自动设置",
    type: "string | number | null",
    defaultValue: "null",
  },
];
const listColumns = [
  {
    title: "参数",
    dataIndex: "argument",
  },
  {
    title: "说明",
    dataIndex: "description",
  },
  {
    title: "类型",
    dataIndex: "type",
  },
  {
    title: "默认值",
    dataIndex: "defaultValue",
  },
];
const listOptionData = [
  {
    argument: "list",
    description: "必传，节点的源数据",
    type: "array",
    defaultValue: "[]",
  },
  {
    argument: "size",
    description: "必传，用于虚拟计算，每个节点的高度",
    type: "number",
    defaultValue: 27,
  },
  {
    argument: "remain",
    description: "必传，用于虚拟计算，可视区内显示多少个节点",
    type: "number",
    defaultValue: 8,
  },
  {
    argument: "start",
    description: "可选，从第几个节点开始显示",
    type: "number",
    defaultValue: 0,
  },
  {
    argument: "offset",
    description:
      "可选，用于设置滚动条默认scrollTop，start存在会优先考虑start值",
    type: "number",
    defaultValue: 0,
  },
  {
    argument: "additional",
    description: "可选， 额外渲染多少个节点",
    type: "number",
    defaultValue: 0,
  },
  {
    argument: "dataKey",
    description: "可选，节点的唯一标识",
    type: "string",
    defaultValue: "id",
  },
];

export {
  columns,
  methodColumns,
  propData,
  eventData,
  methodData,
  nodeOptionData,
  slotData,
  slotColumns,
  listColumns,
  listOptionData,
};

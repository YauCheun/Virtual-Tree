import { ElMessage } from "element-plus";
import { TreeInstance, TreeNodeOptions } from "../../components";

function getSelectedNode(tree: TreeInstance) {
  const node = tree.getSelectedNode();
  console.log("selected node", node);
  if (node) {
    ElMessage.info(`选中了${node.name}`);
  } else {
    ElMessage.info("未选中节点");
  }
}

function getHalfCheckNodes(tree: TreeInstance) {
  const checks = tree.getHalfCheckedNodes();
  console.log("checks", checks);
  ElMessage.info(`${checks.length}个半选节点`);
}

function getCheckNodes(tree: TreeInstance) {
  const checks = tree.getCheckedNodes();
  console.log("checks", checks);
  ElMessage.info(`选中了${checks.length}条数据`);
}

export { getCheckNodes, getSelectedNode, getHalfCheckNodes };

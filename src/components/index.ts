import VirTree from "./tree/index";
import VirList from "./VirList/index";
import { App } from "vue";

const components = [VirTree, VirList];

export { VirList, VirTree };
export * from "./tree/types";
export default function (app: App) {
  components.forEach((item) => app.component(item.name, item));
}

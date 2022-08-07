import VirTree from "./tree/index";
import VirList from "./VirList/index";
import { App } from "vue";

export { VirList, VirTree };
export * from "./tree/types";

const components = [VirTree, VirList];

export default function (app: App) {
  components.forEach((item) => app.component(item.name, item));
}

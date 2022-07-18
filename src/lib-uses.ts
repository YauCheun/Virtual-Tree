import { App } from "vue";
import tree from "./components/tree";
import VirList from "./components/VirList";
const components = [tree, VirList];

export default function (app: App) {
  components.forEach((item) => app.component(item.name, item));
}

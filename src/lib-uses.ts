import { App } from "vue";
import tree from "./components/tree";
const components = [tree];

export default function (app: App) {
  components.forEach((item) => app.component(item.name, item));
}

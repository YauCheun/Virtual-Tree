import { App } from "vue";
import { VirList, VirTree } from "./components";
const components = [VirList, VirTree];

export default function (app: App) {
  components.forEach((item) => app.component(item.name, item));
}

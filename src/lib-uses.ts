import { App } from "vue";

const components: any[] = [];

export default function (app: App) {
  components.forEach((item) => app.component(item.name, item));
}

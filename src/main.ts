import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/index.scss";
// import libUse from "./lib-uses";
import VirTree from "./components/index";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
createApp(App).use(VirTree).use(ElementPlus).mount("#app");

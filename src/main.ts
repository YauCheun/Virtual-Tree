import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/index.scss";
import libUse from "./lib-uses";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
createApp(App).use(ElementPlus).use(libUse).mount("#app");

import { createApp } from "vue";
import LilIcon from "@lil-ui/components/icon";
import "@lil-ui/theme/src/index.scss";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);
app.use(LilIcon);
app.mount("#app");

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { useWindowStore } from "./state/store.ts";
import { programs } from "./programs";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");

const store = useWindowStore();

// Initialize desktop icons from program registry
programs.forEach((program) => {
  if (program.desktopIcon) {
    store.addDesktopIcon(program.id);
  }
});

// Open specific windows on page load
store.openProgram("welcome");
store.openProgram("social-links");

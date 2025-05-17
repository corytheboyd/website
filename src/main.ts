import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { useWindowStore } from "./state/store.ts";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");

const store = useWindowStore();

store.addWindow({
  name: "Earth",
  width: 300,
  height: 300,
  position: { x: 40, y: 150 },
  icon: "/win98icon/world-0.png",
  component: "EarthWindowContent",
});
store.addWindow({
  name: "Social Links",
  width: 300,
  height: 115,
  resizable: false,
  position: { x: 70, y: 300 },
  icon: "/win98icon/users-0.png",
  component: "SocialLinksWindowContent",
});
for (let i = 0; i < 1; i++) {
  store.addWindow({
    name: "Hello World",
    width: 300,
    height: 115,
    resizable: false,
    position: { x: 10, y: 10 },
    icon: "/win98icon/file_windows-1.png",
    component: "WelcomeWindowContent",
  });
}

store.addDesktopIcon({
  name: "Hello World",
  icon: "/win98icon/file_windows-0.png",
  component: "WelcomeWindowContent",
});
store.addDesktopIcon({
  name: "Earth",
  icon: "/win98icon/world-0.png",
  component: "EarthWindowContent",
});
store.addDesktopIcon({
  name: "Social Links",
  icon: "/win98icon/users-0.png",
  component: "SocialLinksWindowContent",
});

import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { Quasar, Dialog } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import "@/assets/scss/dialoglayout.scss";
import "@/assets/scss/loading.scss";

createApp(App)
  .use(Quasar, quasarUserOptions)
  .use(store)
  .use(router)
  .use(Quasar, {
    plugins: {
      Dialog,
    },
  })
  .mount("#app");

// .use(Quasar, {
//   plugins: {
//     AppFullscreen,
//   },
// })

import "vue-toastification/dist/index.css";
import "../assets/css/app.css";

import { directiveAny, directiveCan } from "@/utils/helpers";

import Toast from "vue-toastification";
import VueTheMask from "vue-the-mask";
import { createPinia } from "pinia";
import router from "../router";
import vuetify from "./vuetify";

export function registerPlugins(app) {
  app
    .directive("can", directiveCan)
    .directive("any", directiveAny)
    .use(vuetify)
    .use(router)
    .use(createPinia())
    .use(VueTheMask)
    .use(Toast, {
      position: "top-center",
      hideProgressBar: true,
    });
}

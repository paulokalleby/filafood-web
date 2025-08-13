import { URL, fileURLToPath } from "node:url";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

import Components from "unplugin-vue-components/vite";
import ViteFonts from "unplugin-fonts/vite";
import Vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    Vuetify(),
    Components(),
    ViteFonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
      custom: {
        families: [
          {
            name: "Material Design Icons",
            src: [
              "./src/assets/fonts/materialdesignicons-webfont.woff2",
              "./src/assets/fonts/materialdesignicons-webfont.woff",
              "./src/assets/fonts/materialdesignicons-webfont.ttf",
            ],
            preload: true, // habilita preload correto
            display: "swap", // melhora performance de renderização
            crossorigin: "anonymous", // necessário para fonts cross-origin
          },
        ],
      },
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3002,
    host: "0.0.0.0",
    watch: {
      usePolling: true,
    },
    hmr: {
      protocol: "ws",
      host: "0.0.0.0",
      clientPort: 3002,
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern-compiler",
      },
    },
  },
  optimizeDeps: {
    include: [
      "vuetify/lib/components/VSwitch/index.mjs",
      "vuetify/lib/components/VAlert/index.mjs",
      "vuetify/lib/components/VDivider/index.mjs",
      "vuetify/lib/components/VCheckbox/index.mjs",
      "vuetify/lib/components/VExpansionPanel/index.mjs",
      "vuetify/lib/components/VForm/index.mjs",
      "vuetify/lib/components/VAppBar/index.mjs",
      "vuetify/lib/components/VBtn/index.mjs",
      "vuetify/lib/components/VGrid/index.mjs",
      "vuetify/lib/components/VIcon/index.mjs",
      "vuetify/lib/components/VList/index.mjs",
      "vuetify/lib/components/VMain/index.mjs",
      "vuetify/lib/components/VMenu/index.mjs",
      "vuetify/lib/components/VNavigationDrawer/index.mjs",
      "vuetify/lib/components/VBreadcrumbs/index.mjs",
      "vuetify/lib/components/VCard/index.mjs",
      "vuetify/lib/components/VResponsive/index.mjs",
      "vuetify/lib/components/VTextField/index.mjs",
      "vuetify/lib/components/VChip/index.mjs",
      "vuetify/lib/components/VPagination/index.mjs",
      "vuetify/lib/components/VSelect/index.mjs",
      "vuetify/lib/components/VTable/index.mjs",
      "vuetify/lib/components/VDialog/index.mjs",
      "vuetify/lib/components/VCombobox/index.mjs",
      "vuetify/lib/components/VTextarea/index.mjs",
      "vuetify/lib/components/transitions/index.mjs",
      "vuetify/lib/components/VApp/index.mjs",
      "vuetify/lib/components/VProgressCircular/index.mjs",
      "vuetify/lib/components/VImg/index.mjs",
      "vuetify/lib/components/VOtpInput/index.mjs",
    ],
  },
});

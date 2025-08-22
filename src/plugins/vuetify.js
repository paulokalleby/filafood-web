import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labs from "vuetify/labs/components";
import * as lucideIcons from "lucide-vue-next";

import { createVuetify } from "vuetify";
import { h } from "vue";
import { md3 } from "vuetify/blueprints";
import { mdi } from "vuetify/iconsets/mdi";

export default createVuetify({
  blueprint: md3,
  icons: {
    defaultSet: "mdi",
    aliases: {
      dropdown: "lucide:ChevronDown",
    },
    sets: {
      mdi,
      lucide: {
        component: (props) => {
          const iconName = props.icon.replace(/^lucide:/, "");
          const LucideIcon = lucideIcons[iconName];
          return LucideIcon ? h(LucideIcon) : h("span", {}, `?${iconName}`);
        },
      },
    },
  },
  defaults: {
    global: {
      ripple: true,
      style: {
        //fontFamily: "Poppins, sans-serif",
      },
    },
    VNavigationDrawer: {
      VList: {
        VListItem: {
          rounded: "lg",
          class: "custom-list-item",
        },
      },
    },
    VAppBar: {
      density: "compact",
      elevation: 0,
      rounded: false,
      VAppBarNavIcon: {
        //size: "large",
        rounded: "lg",
      },
    },
    VCard: {
      elevation: 0,
    },
    VTextField: {
      color: "primary",
      variant: "outlined",
      rounded: "lg",
      density: "compact",
      clearIcon: "lucide:CircleX",
    },
    VNumberInput: {
      color: "primary",
      variant: "outlined",
      rounded: "lg",
      density: "compact",
      clearIcon: "lucide:CircleX",
      VBtn: {
        rounded: "",
        variant: "",
        class: "text-subtitle-2",
      },
    },
    VTextarea: {
      color: "primary",
      variant: "outlined",
      rounded: "lg",
      density: "compact",
      clearIcon: "lucide:CircleX",
    },
    VSelect: {
      color: "primary",
      variant: "outlined",
      rounded: "lg",
      density: "compact",
      // prependIcon: "lucideHome",
      dropdown: "lucide:ChevronDown",
      clearIcon: "lucide:CircleX",
    },
    VCombobox: {
      color: "primary",
      variant: "outlined",
      rounded: "lg",
      density: "compact",
      dropdown: "lucide:ChevronDown",
      clearIcon: "lucide:CircleX",
    },
    VSwitch: {
      color: "primary",
      density: "compact",
      ripple: false,
      flat: true,
    },
    VCheckbox: {
      color: "primary",
      density: "compact",
      ripple: false,
      flat: true,
      clearIcon: "lucide:CircleX",
    },
    VBtn: {
      rounded: "lg",
      variant: "flat",
      class: "text-subtitle-2 shadow-lg",
    },
    VBreadcrumbs: {
      divider: "/",
      density: "compact",
      class: "text-body-2",
    },
    VTable: {
      hover: true,
      VChip: {
        rounded: "pill",
      },
    },
    VPagination: {
      color: "dark",
    },
  },
  components: {
    ...labs,
    ...components,
  },
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#3b82f6", // #00BB85 - #3b82f6 -#f97316 - #EA2F2B
          secondary: "#f9f9f9",
          white: "#fff",
          light: "#fff",
          danger: "#ef4444",
          success: "#00BB85",
          background: "#fff",
          surface: "#fff",
          sidebar: "#0A0A0A",
        },
        variables: {
          "border-radius-root": "12px",
          "global-transition": "all 0.3s ease-in-out",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#3b82f6",
          secondary: "#212121",
          white: "#0A0A0A",
          light: "#fff",
          danger: "#ef4444",
          success: "#00BB85",
          background: "#0A0A0A",
          surface: "#0A0A0A",
          sidebar: "#0A0A0A",
        },
        variables: {
          "border-radius-root": "12px", // Bordas arredondadas
          "global-transition": "all 0.3s ease-in-out", // Definir variável global
        },
      },
    },
  },
});

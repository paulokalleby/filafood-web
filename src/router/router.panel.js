export default {
  component: () => import("@/layouts/PanelLayout.vue"),
  redirect: { name: "dashboard.index" },
  path: "/",
  children: [
    {
      path: "/dashboard",
      name: "dashboard.index",
      component: () => import("@/pages/dashboard/DashboardIndex.vue"),
      meta: { title: "Dashboard" },
    },

    {
      path: "/commands",
      name: "commands.index",
      component: () => import("@/pages/commands/CommandsIndex.vue"),
      meta: { permission: "commands.index", title: "Comandas" },
    },

    {
      path: "/locations",
      name: "locations.index",
      component: () => import("@/pages/locations/LocationsIndex.vue"),
      meta: { permission: "locations.index", title: "Locais de Preparo" },
    },

    {
      path: "/categories",
      name: "categories.index",
      component: () => import("@/pages/categories/CategoriesIndex.vue"),
      meta: { permission: "categories.index", title: "Categorias" },
    },

    {
      path: "/products",
      name: "products.index",
      component: () => import("@/pages/products/ProductsIndex.vue"),
      meta: { permission: "products.index", title: "Produtos" },
    },

    {
      path: "/tables",
      name: "tables.index",
      component: () => import("@/pages/tables/TablesIndex.vue"),
      meta: { permission: "tables.index", title: "Mesas" },
    },

    {
      path: "/settings",
      name: "settings.index",
      component: () => import("@/pages/settings/Settings.vue"),
      meta: { permission: "settings.index", title: "Configurações" },
    },

    {
      path: "/roles",
      name: "roles.index",
      component: () => import("@/pages/roles/RolesIndex.vue"),
      meta: { permission: "roles.index", title: "Papéis" },
    },
    {
      path: "/users",
      name: "users.index",
      component: () => import("@/pages/users/UsersIndex.vue"),
      meta: { permission: "users.index", title: "Usuários" },
    },
  ],
  meta: { auth: true },
};

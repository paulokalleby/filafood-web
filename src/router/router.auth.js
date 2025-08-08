export default {
  path: "/auth",
  component: () => import("@/layouts/AuthLayout.vue"),
  redirect: { name: "auth.login" },
  children: [
    {
      path: "login",
      name: "auth.login",
      component: () => import("@/pages/auth/Login.vue"),
      meta: { title: "Entrar" },
    },
    {
      path: "register",
      name: "auth.register",
      component: () => import("@/pages/auth/Register.vue"),
      meta: { title: "Registre-se" },
    },
    {
      path: "recover-password",
      name: "auth.recover-password",
      component: () => import("@/pages/auth/RecoverPassword.vue"),
      meta: { title: "Recuperar Senha" },
    },
  ],
};

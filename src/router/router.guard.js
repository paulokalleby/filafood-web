import { hasPermission } from "@/utils/helpers";
import { useAuthStore } from "@/stores/auth";

export async function handleRouteGuard(to, from, next) {
  document.title = to.meta.title || "Larafy";
  const auth = useAuthStore();

  if (to.meta?.auth) {
    if (auth.token && auth.user) {
      const isAuthenticated = await auth.checkToken();

      if (!isAuthenticated) return next({ name: "auth.login" });

      auth.setUser(isAuthenticated.data);

      if (to.meta?.permission && !hasPermission(to.meta.permission)) {
        return next({ name: "home.index" });
      }
    } else {
      return next({ name: "auth.login" });
    }
  }

  next();
}

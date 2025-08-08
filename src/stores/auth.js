import { computed, ref } from "vue";

import { defineStore } from "pinia";
import http from "@/http";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export const useAuthStore = defineStore("auth", () => {
  const toast = useToast();
  const router = useRouter();

  const loading = ref(false);
  const creating = ref(false);
  const updating = ref(false);
  const token = ref(localStorage.getItem("token"));
  const user = ref(JSON.parse(localStorage.getItem("user")));

  const setToken = (tokenValue) => {
    localStorage.setItem("token", tokenValue);
    token.value = tokenValue;
  };

  const login = async (payload) => {
    loading.value = true;
    try {
      const response = await http.post("/auth/login", payload);
      setToken(response.data.token);
      setUser(response.data.data);
      toast.success(`Olá ${response.data.data.name}, bem vindo!`);
      router.push({ name: "dashboard.index" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Falha no login");
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload) => {
    creating.value = true;
    try {
      await http.post("/auth/register", payload);
      toast.success("Registro realizada com sucesso!");
      router.push({ name: "auth.login" });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Falha ao realizar registro"
      );
    } finally {
      creating.value = false;
    }
  };

  const updateProfile = async (payload) => {
    updating.value = true;
    try {
      await http.put("/auth/profile", payload);
      toast.success("Conta atualizada com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao atualizar usuário");
    } finally {
      updating.value = false;
    }
  };

  const setUser = (userValue) => {
    localStorage.setItem("user", JSON.stringify(userValue));
    user.value = userValue;
  };

  const checkToken = async () => {
    try {
      const { data } = await http.get("/auth/me");
      return data;
    } catch (error) {
      return false;
    }
  };

  async function logout() {
    try {
      const { response } = await http.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      token.value = "";
      user.value = "";
      window.location = "/auth/login";
    } catch (error) {
      return false;
    }
  }

  const isAuthenticated = computed(() => {
    return token.value && user.value;
  });

  return {
    token,
    user,
    login,
    register,
    updateProfile,
    setToken,
    setUser,
    checkToken,
    isAuthenticated,
    logout,
    loading,
    updating,
    creating,
  };
});

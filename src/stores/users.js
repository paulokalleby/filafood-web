import { reactive, ref } from "vue";

import _ from "lodash";
import { defineStore } from "pinia";
import http from "@/http";
import { useToast } from "vue-toastification";

export const useUsersStore = defineStore("users", () => {
  const toast = useToast();
  const creating = ref(false);
  const updating = ref(false);
  const deleting = ref(false);
  const loading = ref(true);

  const users = reactive({
    data: [],
    meta: {
      last_page: 0,
      current_page: 1,
      total: 0,
      per_page: 8,
    },
  });

  const search = reactive({
    name: "",
    active: "",
  });

  const roles = ref([]);

  const getUsers = async (page = 1) => {
    loading.value = true;
    try {
      users.meta.current_page = page;
      const response = await http.get("/users", {
        params: {
          paginate: users.meta.per_page,
          page: users.meta.current_page,
          with: "roles",
          name: search.name || undefined,
          active: search.active || undefined,
        },
      });

      users.data = response?.data.data || {};
      users.data.roles = users.roles?.map((role) => role.id) || [];
      users.meta = response.data.meta || {};
    } catch (error) {
      toast.error("Erro ao buscar registros");
    } finally {
      loading.value = false;
    }
  };

  const getRoles = async () => {
    try {
      const response = await http.get("/roles");
      roles.value = response.data.data;
    } catch (error) {
      toast.error("Erro ao carregar papéis");
    }
  };

  const findUserById = async (id) => {
    let user = users.data.find((user) => user.id == id);
    if (!user) {
      loading.value = true;
      try {
        const response = await http.get(`/users/${id}`);
        user = response?.data.data || {};
      } catch (error) {
        toast.error("Erro ao buscar registro");
      } finally {
        loading.value = false;
      }
    }
    return user;
  };

  const createUser = async (payload) => {
    creating.value = true;
    try {
      const response = await http.post("/users", {
        ...payload,
        roles: payload.roles.map((role) => role.id),
      });
      users.data.push(response.data.data);
      toast.success("Registro criado com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao criar registro");
    } finally {
      creating.value = false;
    }
  };

  const updateUser = async (id, payload) => {
    updating.value = true;
    try {
      const response = await http.put(`/users/${id}`, {
        ...payload,
        roles: payload.roles.map((role) => role.id),
      });
      const index = users.data.findIndex((user) => user.id == id);
      if (index !== -1) {
        users.data[index] = response.data.data;
      }
      toast.success("Registro atualizado com sucesso!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao atualizar registro"
      );
    } finally {
      updating.value = false;
    }
  };

  const deleteUser = async (id) => {
    deleting.value = true;
    try {
      await http.delete(`/users/${id}`);
      users.data = users.data.filter((user) => user.id !== id);
      toast.success("Registro excluído com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao excluir registro");
    } finally {
      deleting.value = false;
    }
  };

  const clearSearch = async () => {
    Object.keys(search).forEach((key) => (search[key] = ""));
    await getUsers(1);
  };

  const doResearch = _.debounce(() => {
    getUsers(1);
  }, 500);

  return {
    users,
    roles,
    search,
    loading,
    creating,
    updating,
    deleting,
    getUsers,
    getRoles,
    findUserById,
    createUser,
    updateUser,
    deleteUser,
    clearSearch,
    doResearch,
  };
});

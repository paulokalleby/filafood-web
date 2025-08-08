import { reactive, ref } from "vue";

import _ from "lodash";
import { defineStore } from "pinia";
import http from "@/http";
import { useToast } from "vue-toastification";

export const useRolesStore = defineStore("roles", () => {
  const toast = useToast();
  const creating = ref(false);
  const updating = ref(false);
  const deleting = ref(false);
  const loading = ref(false);

  const roles = reactive({
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

  const resources = ref([]);

  const getRoles = async (page = 1) => {
    loading.value = true;
    try {
      roles.meta.current_page = page;
      const response = await http.get("/roles", {
        params: {
          paginate: roles.meta.per_page,
          page: roles.meta.current_page,
          with: "permissions,users",
          name: search.name || undefined,
          active: search.active || undefined,
        },
      });

      roles.data =
        response.data.data.map((role) => ({
          ...role,
          permissions:
            role.permissions?.map((permission) => permission.id) || [],
        })) || [];

      roles.meta = response.data.meta || {};
    } catch (error) {
      toast.error("Erro ao buscar registros");
    } finally {
      loading.value = false;
    }
  };

  const getResources = async () => {
    try {
      const response = await http.get("/resources");
      resources.value = response.data.data;
    } catch (error) {
      toast.error("Erro ao carregar recursos");
    }
  };

  const findRoleById = async (id) => {
    let role = roles.data.find((role) => role.id === id);
    if (!role) {
      loading.value = true;
      try {
        const response = await http.get(`/roles/${id}`);
        role = response.data.data || {};
        // role.permissions =
        //   role.permissions?.map((permission) => permission.id) || [];
      } catch (error) {
        toast.error("Erro ao buscar registro");
      } finally {
        loading.value = false;
      }
    }
    return role;
  };

  const createRole = async (payload) => {
    creating.value = true;
    try {
      const response = await http.post("/roles", payload);
      const createdRole = response.data.data || {};
      createdRole.permissions =
        createdRole.permissions?.map((permission) => permission.id) || [];
      roles.data.push(createdRole);
      toast.success("Registro criado com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao criar registro");
    } finally {
      creating.value = false;
    }
  };

  const updateRole = async (id, payload) => {
    updating.value = true;
    try {
      const response = await http.put(`/roles/${id}`, payload);
      const updatedUser = response.data.data;
      updatedUser.permissions =
        updatedUser.permissions?.map((permission) => permission.id) || [];
      const index = roles.data.findIndex((role) => role.id == id);
      if (index !== -1) {
        roles.data[index] = updatedUser;
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

  const deleteRole = async (id) => {
    deleting.value = true;
    try {
      await http.delete(`/roles/${id}`);
      roles.data = roles.data.filter((role) => role.id !== id);
      toast.success("Registro excluído com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao excluir registro");
    } finally {
      deleting.value = false;
    }
  };

  const clearSearch = async () => {
    Object.keys(search).forEach((key) => (search[key] = ""));
    await getRoles(1);
  };

  const doResearch = _.debounce(() => {
    getRoles(1);
  }, 500);

  return {
    roles,
    resources,
    search,
    loading,
    creating,
    updating,
    deleting,
    getRoles,
    getResources,
    findRoleById,
    createRole,
    updateRole,
    deleteRole,
    clearSearch,
    doResearch,
  };
});

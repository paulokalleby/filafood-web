import { reactive, ref } from "vue";

import _ from "lodash";
import { defineStore } from "pinia";
import http from "@/http";
import { useToast } from "vue-toastification";

export const useTablesStore = defineStore("tables", () => {
  const toast = useToast();
  const creating = ref(false);
  const updating = ref(false);
  const deleting = ref(false);
  const loading = ref(true);

  const tables = reactive({
    data: [],
    meta: {
      last_page: 0,
      current_page: 1,
      total: 0,
      per_page: 8,
    },
  });

  const search = reactive({
    number: "",
    description: "",
    status: "",
    active: "",
  });

  const getTables = async (page = 1) => {
    loading.value = true;
    try {
      tables.meta.current_page = page;
      const response = await http.get("/tables", {
        params: {
          paginate: tables.meta.per_page,
          page: tables.meta.current_page,
          number: search.number || undefined,
          description: search.description || undefined,
          status: search.status || undefined,
          active: search.active || undefined,
        },
      });
      tables.data = response.data.data || [];
      tables.meta = response.data.meta || {};
    } catch (error) {
      toast.error("Erro ao buscar registros");
    } finally {
      loading.value = false;
    }
  };

  const findTableById = async (id) => {
    let table = tables.data.find((table) => table.id == id);
    if (!table) {
      loading.value = true;
      try {
        const response = await http.get(`/tables/${id}`);
        table = response?.data.data || {};
      } catch (error) {
        toast.error("Erro ao buscar registro");
      } finally {
        loading.value = false;
      }
    }
    return table;
  };

  const createTable = async (payload) => {
    creating.value = true;
    try {
      const response = await http.post("/tables", payload);
      const newTable = response.data.data;
      tables.data.push(newTable);
      toast.success("Registro criado com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao criar registro");
    } finally {
      creating.value = false;
    }
  };

  const updateTable = async (id, payload) => {
    updating.value = true;
    try {
      const response = await http.put(`/tables/${id}`, payload);
      const updatedTable = response.data.data;
      const index = tables.data.findIndex((module) => module.id === id);
      if (index !== -1) {
        tables.data[index] = updatedTable;
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

  const deleteTable = async (id) => {
    deleting.value = true;
    try {
      await http.delete(`/tables/${id}`);
      tables.meta.total = tables.meta.total - 1;
      tables.data = tables.data.filter((table) => table.id !== id);
      toast.success("Registro excluído com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao excluir registro");
    } finally {
      deleting.value = false;
    }
  };

  const clearSearch = async () => {
    Object.keys(search).forEach((key) => (search[key] = ""));
    await getTables(1);
  };

  const doResearch = _.debounce(() => {
    getTables(1);
  }, 500);

  return {
    tables,
    search,
    loading,
    creating,
    updating,
    deleting,
    getTables,
    findTableById,
    createTable,
    updateTable,
    deleteTable,
    clearSearch,
    doResearch,
  };
});

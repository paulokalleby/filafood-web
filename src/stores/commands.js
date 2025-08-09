import { reactive, ref } from "vue";

import _ from "lodash";
import { defineStore } from "pinia";
import http from "@/http";
import { useToast } from "vue-toastification";

export const useCommandsStore = defineStore("commands", () => {
  const toast = useToast();
  const creating = ref(false);
  const updating = ref(false);
  const deleting = ref(false);
  const loading = ref(true);

  const commands = reactive({
    data: [],
    meta: {
      last_page: 0,
      current_page: 1,
      total: 0,
      per_page: 8,
    },
  });

  const tables = ref([]);
  const payments = ref([]);

  const search = reactive({
    identify: "",
    table: "",
    status: "",
  });

  const getCommands = async (page = 1) => {
    loading.value = true;
    try {
      commands.meta.current_page = page;
      const response = await http.get("/commands", {
        params: {
          paginate: commands.meta.per_page,
          page: commands.meta.current_page,
          table_id: search.table || undefined,
          identify: search.identify || undefined,
          status: search.status || undefined,
        },
      });
      commands.data = response.data.data || [];
      commands.meta = response.data.meta || {};
    } catch (error) {
      toast.error("Erro ao buscar registros");
    } finally {
      loading.value = false;
    }
  };

  const getTables = async () => {
    try {
      const response = await http.get("/tables");
      tables.value = response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao carregar categorias"
      );
    }
  };

  const getPayments = async () => {
    try {
      const response = await http.get("/payments");
      payments.value = response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao carregar meios de pagamento"
      );
    }
  };

  const findCommandById = async (id) => {
    let command = commands.data.find((command) => command.id == id);
    if (!command) {
      loading.value = true;
      try {
        const response = await http.get(`/commands/${id}`);
        command = response?.data.data || {};
      } catch (error) {
        toast.error("Erro ao buscar registro");
      } finally {
        loading.value = false;
      }
    }
    return command;
  };

  const createCommand = async (payload) => {
    creating.value = true;
    try {
      const response = await http.post("/commands", payload);
      const newCommand = response.data.data;
      commands.data.push(newCommand);
      toast.success("Registro criado com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao criar registro");
    } finally {
      creating.value = false;
    }
  };

  const updateCommand = async (id, payload) => {
    updating.value = true;
    try {
      const response = await http.put(`/commands/${id}`, payload);
      const updatedCommand = response.data.data;
      const index = commands.data.findIndex((module) => module.id === id);
      if (index !== -1) {
        commands.data[index] = updatedCommand;
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

  const cancelCommand = async (id) => {
    updating.value = true;
    try {
      const response = await http.put(`/commands/${id}`, {
        status: "Cancelled",
      });
      const updatedCommand = response.data.data;
      const index = commands.data.findIndex((module) => module.id === id);
      if (index !== -1) {
        commands.data[index] = updatedCommand;
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

  const clearSearch = async () => {
    Object.keys(search).forEach((key) => (search[key] = ""));
    await getCommands(1);
  };

  const doResearch = _.debounce(() => {
    getCommands(1);
  }, 500);

  return {
    commands,
    tables,
    payments,
    search,
    loading,
    creating,
    updating,
    deleting,
    getCommands,
    getTables,
    getPayments,
    findCommandById,
    createCommand,
    updateCommand,
    cancelCommand,
    clearSearch,
    doResearch,
  };
});

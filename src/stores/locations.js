import { reactive, ref } from "vue";

import _ from "lodash";
import { defineStore } from "pinia";
import http from "@/http";
import { useToast } from "vue-toastification";

export const useLocationsStore = defineStore("locations", () => {
  const toast = useToast();
  const creating = ref(false);
  const updating = ref(false);
  const deleting = ref(false);
  const loading = ref(true);

  const locations = reactive({
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

  const getLocations = async (page = 1) => {
    loading.value = true;
    try {
      locations.meta.current_page = page;
      const response = await http.get("/locations", {
        params: {
          paginas: locations.meta.per_page,
          page: locations.meta.current_page,
          name: search.name || undefined,
          active: search.active || undefined,
        },
      });
      locations.data = response.data.data || [];
      locations.meta = response.data.meta || {};
    } catch (error) {
      toast.error("Erro ao buscar registros");
    } finally {
      loading.value = false;
    }
  };

  const findLocationById = async (id) => {
    let location = locations.data.find((location) => location.id == id);
    if (!location) {
      loading.value = true;
      try {
        const response = await http.get(`/locations/${id}`);
        location = response?.data.data || {};
      } catch (error) {
        toast.error("Erro ao buscar registro");
      } finally {
        loading.value = false;
      }
    }
    return location;
  };

  const createLocation = async (payload) => {
    creating.value = true;
    try {
      const response = await http.post("/locations", payload);
      const newLocation = response.data.data;
      locations.data.push(newLocation);
      toast.success("Registro criado com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao criar registro");
    } finally {
      creating.value = false;
    }
  };

  const updateLocation = async (id, payload) => {
    updating.value = true;
    try {
      const response = await http.put(`/locations/${id}`, payload);
      //const updatedLocation = response.data.data;
      const index = locations.data.findIndex((module) => module.id === id);
      if (index !== -1) {
        locations.data[index] = payload;
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

  const deleteLocation = async (id) => {
    deleting.value = true;
    try {
      await http.delete(`/locations/${id}`);
      locations.meta.total = locations.meta.total - 1;
      locations.data = locations.data.filter((location) => location.id !== id);
      toast.success("Registro excluído com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao excluir registro");
    } finally {
      deleting.value = false;
    }
  };

  const clearSearch = async () => {
    Object.keys(search).forEach((key) => (search[key] = ""));
    await getLocations(1);
  };

  const doResearch = _.debounce(() => {
    getLocations(1);
  }, 500);

  return {
    locations,
    locations,
    search,
    loading,
    creating,
    updating,
    deleting,
    getLocations,
    getLocations,
    findLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
    clearSearch,
    doResearch,
  };
});

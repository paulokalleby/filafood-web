import { defineStore } from "pinia";
import http from "@/http";
import { ref } from "vue";
import { useToast } from "vue-toastification";

export const useSettingsStore = defineStore("settings", () => {
  const toast = useToast();
  const updating = ref(false);
  const loading = ref(false);
  const settings = ref([]);

  const getSettings = async () => {
    loading.value = true;
    try {
      const response = await http.get("/settings");
      settings.value = response.data.data;
      console.log(settings.value);
    } catch (error) {
      toast.error("Erro ao buscar registros");
    } finally {
      loading.value = false;
    }
  };

  const updateSetting = async (payload) => {
    updating.value = true;
    try {
      await http.put("/settings", payload);
      settings.value = payload;
      toast.success("Configurações atualizadas com sucesso!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao atualizar configurações"
      );
    } finally {
      updating.value = false;
    }
  };
  return {
    settings,
    loading,
    updating,
    getSettings,
    updateSetting,
  };
});

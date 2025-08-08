import { reactive, ref } from "vue";

import _ from "lodash";
import { defineStore } from "pinia";
import http from "@/http";
import { useToast } from "vue-toastification";

export const useCategoriesStore = defineStore("categories", () => {
  const toast = useToast();
  const creating = ref(false);
  const updating = ref(false);
  const deleting = ref(false);
  const loading = ref(false);

  const categories = reactive({
    data: [],
    meta: {
      last_page: 0,
      current_page: 1,
      total: 0,
      per_page: 8,
    },
  });

  const departments = ref([]);

  const search = reactive({
    name: "",
    department: "",
    active: "",
  });

  const getCategories = async (page = 1) => {
    loading.value = true;
    try {
      categories.meta.current_page = page;
      const response = await http.get("/categories", {
        params: {
          paginas: categories.meta.per_page,
          page: categories.meta.current_page,
          name: search.name || undefined,
          department: search.department || undefined,
          active: search.active || undefined,
        },
      });
      categories.data = response.data.data || [];
      categories.meta = response.data.meta || {};
    } catch (error) {
      toast.error("Erro ao buscar registros");
    } finally {
      loading.value = false;
    }
  };

  const getDepartments = async () => {
    try {
      const response = await http.get("/departments");
      departments.value = response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao carregar departamentos"
      );
    }
  };

  const findCategoryById = async (id) => {
    let category = categories.data.find((category) => category.id == id);
    if (!category) {
      loading.value = true;
      try {
        const response = await http.get(`/categories/${id}`);
        category = response?.data.data || {};
      } catch (error) {
        toast.error("Erro ao buscar registro");
      } finally {
        loading.value = false;
      }
    }
    return category;
  };

  const createCategory = async (payload) => {
    creating.value = true;
    try {
      const response = await http.post("/categories", payload);
      const newCategory = response.data.data;
      categories.data.push(newCategory);
      toast.success("Registro criado com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao criar registro");
    } finally {
      creating.value = false;
    }
  };

  const updateCategory = async (id, payload) => {
    updating.value = true;
    payload.department =
      typeof payload.department === "object"
        ? payload.department?.value ?? ""
        : payload.department;

    try {
      const response = await http.put(`/categories/${id}`, payload);
      const updatedCategory = response.data.data;
      const index = categories.data.findIndex((module) => module.id === id);
      if (index !== -1) {
        categories.data[index] = updatedCategory;
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

  const deleteCategory = async (id) => {
    deleting.value = true;
    try {
      await http.delete(`/categories/${id}`);
      categories.meta.total = categories.meta.total - 1;
      categories.data = categories.data.filter(
        (category) => category.id !== id
      );
      toast.success("Registro excluído com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao excluir registro");
    } finally {
      deleting.value = false;
    }
  };

  const clearSearch = async () => {
    Object.keys(search).forEach((key) => (search[key] = ""));
    await getCategories(1);
  };

  const doResearch = _.debounce(() => {
    getCategories(1);
  }, 500);

  return {
    categories,
    departments,
    search,
    loading,
    creating,
    updating,
    deleting,
    getCategories,
    getDepartments,
    findCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    clearSearch,
    doResearch,
  };
});

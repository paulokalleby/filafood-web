import { reactive, ref } from "vue";

import _ from "lodash";
import { defineStore } from "pinia";
import http from "@/http";
import { useToast } from "vue-toastification";

export const useProductsStore = defineStore("products", () => {
  const toast = useToast();
  const creating = ref(false);
  const updating = ref(false);
  const deleting = ref(false);
  const loading = ref(true);

  const file = ref(null);

  const isDragging = ref(false);

  const products = reactive({
    data: [],
    meta: {
      last_page: 0,
      current_page: 1,
      total: 0,
      per_page: 8,
    },
  });

  const categories = ref([]);

  const search = reactive({
    category: "",
    name: "",
    active: "",
  });

  const getProducts = async (page = 1) => {
    loading.value = true;
    try {
      products.meta.current_page = page;
      const response = await http.get("/products", {
        params: {
          paginate: products.meta.per_page,
          page: products.meta.current_page,
          name: search.name || undefined,
          category_id: search.category || undefined,
          active: search.active || undefined,
        },
      });
      products.data = response.data.data || [];
      products.meta = response.data.meta || {};
    } catch (error) {
      toast.error("Erro ao buscar registros");
    } finally {
      loading.value = false;
    }
  };

  const getCategories = async () => {
    try {
      const response = await http.get("/categories");
      categories.value = response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao carregar categorias"
      );
    }
  };

  const findProductById = async (id) => {
    let product = products.data.find((product) => product.id == id);
    if (!product) {
      loading.value = true;
      try {
        const response = await http.get(`/products/${id}`);
        product = response?.data.data || {};
      } catch (error) {
        toast.error("Erro ao buscar registro");
      } finally {
        loading.value = false;
      }
    }
    return product;
  };

  const createProduct = async (payload) => {
    creating.value = true;
    try {
      const formData = new FormData();
      if (file.value) {
        formData.append("image", file.value);
      }
      formData.append("name", payload.name);
      formData.append("category_id", payload.category?.id);
      formData.append("price", payload.price);
      formData.append("description", payload.description);
      formData.append("preparation", payload.preparation ? 1 : 0);
      formData.append("active", payload.active ? 1 : 0);

      const response = await http.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newProduct = response.data.data;
      products.data.push(newProduct);
      toast.success("Registro criado com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao criar registro");
    } finally {
      creating.value = false;
    }
  };

  const updateProduct = async (id, payload) => {
    updating.value = true;
    try {
      const formData = new FormData();

      if (file.value) {
        formData.append("image", file.value);
      }

      formData.append("_method", "PUT");
      formData.append("name", payload.name);
      formData.append("category_id", payload.category?.id);
      formData.append("price", payload.price);
      formData.append("description", payload.description);
      formData.append("preparation", payload.preparation ? 1 : 0);
      formData.append("active", payload.active ? 1 : 0);

      const response = await http.post("/products/" + id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      //const updateProduct = response.data.data;
      payload.image = response.data.data.image;
      const index = products.data.findIndex((product) => product.id === id);
      if (index !== -1) products.data[index] = payload;
      toast.success("Registro atualizado com sucesso!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao atualizar registro"
      );
    } finally {
      updating.value = false;
    }
  };

  const deleteProduct = async (id) => {
    deleting.value = true;
    try {
      await http.delete(`/products/${id}`);
      products.meta.total = products.meta.total - 1;
      products.data = products.data.filter((product) => product.id !== id);
      toast.success("Registro excluído com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao excluir registro");
    } finally {
      deleting.value = false;
    }
  };

  const handleFileChange = (event) => {
    file.value = event.target.files[0];
  };

  const handleDragOver = () => {
    isDragging.value = true;
  };

  const handleDragLeave = () => {
    isDragging.value = false;
  };

  const handleDrop = (event) => {
    isDragging.value = false;
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length) {
      file.value = droppedFiles[0];
    }
  };

  const setFile = (value) => {
    file.value = value;
  };

  const clearSearch = async () => {
    Object.keys(search).forEach((key) => (search[key] = ""));
    await getProducts(1);
  };

  const doResearch = _.debounce(() => {
    getProducts(1);
  }, 500);

  return {
    products,
    categories,
    search,
    loading,
    creating,
    updating,
    deleting,
    getProducts,
    getCategories,
    findProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    clearSearch,
    doResearch,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setFile,
  };
});

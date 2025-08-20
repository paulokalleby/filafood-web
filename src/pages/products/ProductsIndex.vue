<script setup>
import { onMounted, ref, computed } from "vue";
import dayjs from "@/plugins/dayjs";
import { useProductsStore } from "@/stores/products";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import { formatCurrency, getImageSrc } from "@/utils/helpers";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import EmptyData from "@/components/EmptyData.vue";
import ProductsShowDialog from "./ProductsShowDialog.vue";
import ProductsCreateDialog from "./ProductsCreateDialog.vue";
import ProductsEditDialog from "./ProductsEditDialog.vue";

onMounted(async () => {
  await store.getCategories();
  await store.getProducts();
});

const store = useProductsStore();
const selectedIdForDelete = ref(null);
const selectedIdForShow = ref(null);
const selectedIdForEdit = ref(null);

const showDialog = ref(false);
const createDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(null);

const openCreateDialog = () => {
  createDialog.value = true;
};

const openEditDialog = (id) => {
  if (!id || typeof id !== "string") return;
  selectedIdForEdit.value = id;
  editDialog.value = true;
};
const openShowDialog = (id) => {
  selectedIdForShow.value = id;
  showDialog.value = true;
};

const openDeleteDialog = (id) => {
  selectedIdForDelete.value = id;
  deleteDialog.value.openModal();
};

const categoriesWithAll = computed(() => {
  return [{ name: "Todas", id: "" }, ...store.categories];
});
</script>

<template>
  <ConfirmDeleteModal
    :itemId="selectedIdForDelete"
    :deleting="store.deleting"
    ref="deleteDialog"
    @confirm-delete="store.deleteProduct"
  />

  <ProductsCreateDialog v-model="createDialog" />
  <ProductsEditDialog v-model="editDialog" :id="selectedIdForEdit" />
  <ProductsShowDialog v-model="showDialog" :id="selectedIdForShow" />

  <v-row class="mb-8">
    <v-col cols="12">
      <v-breadcrumbs class="py-0 px-0">
        <v-breadcrumbs-item :to="'/'"> Dashboard </v-breadcrumbs-item>
        <v-breadcrumbs-divider />
        <v-breadcrumbs-item disabled> Produtos </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>
  </v-row>

  <v-row class="my-4">
    <v-col cols="12" md="3" class="py-0">
      <v-text-field
        v-model="store.search.name"
        @keyup="store.doResearch"
        label="Pesquisar"
        prepend-inner-icon="lucide:Search"
      />
    </v-col>

    <v-col cols="12" md="3" class="py-0">
      <v-select
        v-model="store.search.category"
        @update:model-value="store.doResearch"
        label="Categoria"
        :items="categoriesWithAll"
        item-title="name"
        item-value="id"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col cols="12" md="2" class="py-0">
      <v-select
        v-model="store.search.active"
        @update:model-value="store.doResearch"
        label="Status"
        :items="[
          { name: 'Todos', value: '' },
          { name: 'Ativo', value: '1' },
          { name: 'Inativo', value: '0' },
        ]"
        item-title="name"
        item-value="value"
      />
    </v-col>

    <v-col cols="12" md="4" class="py-0 mb-3">
      <v-btn
        variant="text"
        size="small"
        icon="lucide:RefreshCw"
        @click="store.clearSearch"
        color="dark"
      />

      <v-btn
        v-can="'products.store'"
        prepend-icon="lucide:Plus"
        @click.prevent="openCreateDialog()"
        variant="flat"
        class="float-end"
        text="Novo"
      />
    </v-col>
  </v-row>

  <SkeletonLoader v-if="store.loading" :rows="store.products.meta.per_page" />

  <div v-else>
    <EmptyData v-if="store.products.data.length <= 0" />

    <v-card class="border mt-4" v-else>
      <v-table density="default">
        <thead>
          <tr>
            <th class="text-left">
              <b>Imagem</b>
            </th>
            <th class="text-left">
              <b>Nome</b>
            </th>
            <th class="text-left">
              <b>Categoria</b>
            </th>
            <th>
              <b>Preço</b>
            </th>
            <th class="text-left">
              <b>Atualizado</b>
            </th>
            <th class="text-left">
              <b>Status</b>
            </th>
            <th class="text-right"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in store.products.data" :key="product.id">
            <td>
              <v-img
                :aspect-ratio="1"
                class="bg-light my-2"
                :src="getImageSrc(product.image)"
                width="38"
                cover
                rounded
              ></v-img>
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.category?.name }}</td>
            <td>{{ formatCurrency(product.price) }}</td>
            <td>{{ dayjs(product.updated).fromNow() }}</td>
            <td>
              <v-chip
                :color="product.active ? 'green' : 'red'"
                :text="product.active ? 'Ativo' : 'Inativo'"
                size="x-small"
                label
              ></v-chip>
            </td>
            <td class="text-right td-actions">
              <v-tooltip text="Visualizar">
                <template #activator="{ props }">
                  <v-btn
                    v-can="'products.show'"
                    @click.prevent="openShowDialog(product.id)"
                    icon
                    size="small"
                    variant="text"
                    color="dark"
                    v-bind="props"
                  >
                    <v-icon size="18">lucide:Eye</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="Editar">
                <template #activator="{ props }">
                  <v-btn
                    v-can="'products.update'"
                    @click.prevent="openEditDialog(product.id)"
                    icon
                    size="small"
                    variant="text"
                    color="dark"
                    v-bind="props"
                  >
                    <v-icon size="18">lucide:Pencil</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="Excluir">
                <template #activator="{ props }">
                  <v-btn
                    v-can="'products.destroy'"
                    @click="openDeleteDialog(product.id)"
                    icon
                    size="small"
                    variant="text"
                    color="dark"
                    v-bind="props"
                  >
                    <v-icon size="18">lucide:Trash2</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <div class="text-center mt-3">
      <v-pagination
        v-if="store.products.meta.total > store.products.meta.per_page"
        @update:model-value="store.getProducts"
        v-model="store.products.meta.current_page"
        :length="store.products.meta.last_page"
        :total-visible="store.products.meta.per_page"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        size="small"
      />
    </div>
  </div>
</template>

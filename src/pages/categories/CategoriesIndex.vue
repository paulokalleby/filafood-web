<script setup>
import { onMounted, ref, computed } from "vue";
import dayjs from "@/plugins/dayjs";
import { useCategoriesStore } from "@/stores/categories";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import EmptyData from "@/components/EmptyData.vue";
import CategoriesShowDialog from "./CategoriesShowDialog.vue";
import CategoriesCreateDialog from "./CategoriesCreateDialog.vue";
import CategoriesEditDialog from "./CategoriesEditDialog.vue";

onMounted(async () => {
  await store.getCategories();
  await store.getLocations();
});

const store = useCategoriesStore();
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

const locationsWithAll = computed(() => {
  return [{ name: "Todos", id: "" }, ...store.locations];
});
</script>

<template>
  <ConfirmDeleteModal
    :itemId="selectedIdForDelete"
    :deleting="store.deleting"
    ref="deleteDialog"
    @confirm-delete="store.deleteCategory"
  />

  <CategoriesCreateDialog v-model="createDialog" />
  <CategoriesEditDialog v-model="editDialog" :id="selectedIdForEdit" />
  <CategoriesShowDialog v-model="showDialog" :id="selectedIdForShow" />

  <v-row class="mb-8">
    <v-col cols="12">
      <v-breadcrumbs class="py-0 px-0">
        <v-breadcrumbs-item :to="'/'"> Dashboard </v-breadcrumbs-item>
        <v-breadcrumbs-divider />
        <v-breadcrumbs-item disabled> Categorias </v-breadcrumbs-item>
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
        v-model="store.search.location"
        @update:model-value="store.doResearch"
        label="Local de Preparo"
        :items="locationsWithAll"
        item-title="name"
        item-value="id"
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
        variant="plain"
        size="small"
        icon="lucide:RefreshCw"
        @click="store.clearSearch"
        color="dark"
      />

      <v-btn
        v-can="'categories.store'"
        prepend-icon="lucide:Plus"
        @click.prevent="openCreateDialog()"
        variant="flat"
        class="float-end"
        text="Novo"
      />
    </v-col>
  </v-row>

  <SkeletonLoader v-if="store.loading" :rows="store.categories.meta.per_page" />

  <div v-else>
    <EmptyData v-if="store.categories.data.length <= 0" />

    <v-card class="border mt-4" v-else>
      <v-table density="default">
        <thead>
          <tr>
            <th class="text-left">
              <b>Nome</b>
            </th>
            <th class="text-left">
              <b>Local de Preparo</b>
            </th>
            <th class="text-left">
              <b>Confirmação</b>
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
          <tr v-for="category in store.categories.data" :key="category.id">
            <td>{{ category.name }}</td>
            <td>{{ category.location.name }}</td>
            <td>{{ category.confirmation ? "Sim" : "Não" }}</td>
            <td>{{ dayjs(category.updated).fromNow() }}</td>
            <td>
              <v-chip
                :color="category.active ? 'green' : 'red'"
                :text="category.active ? 'Ativo' : 'Inativo'"
                size="x-small"
                label
              ></v-chip>
            </td>
            <td class="text-right td-actions">
              <v-tooltip text="Visualizar">
                <template #activator="{ props }">
                  <v-btn
                    v-can="'categories.show'"
                    @click.prevent="openShowDialog(category.id)"
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
                    v-can="'categories.update'"
                    @click.prevent="openEditDialog(category.id)"
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
                    v-can="'categories.destroy'"
                    @click="openDeleteDialog(category.id)"
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
        v-if="store.categories.meta.total > store.categories.meta.per_page"
        @update:model-value="store.getCategories"
        v-model="store.categories.meta.current_page"
        :length="store.categories.meta.last_page"
        :total-visible="store.categories.meta.per_page"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        size="small"
      />
    </div>
  </div>
</template>

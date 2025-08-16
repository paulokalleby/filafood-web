<script setup>
import { onMounted, ref } from "vue";
import dayjs from "@/plugins/dayjs";
import { useTablesStore } from "@/stores/tables";
import EmptyData from "@/components/EmptyData.vue";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import TablesShowDialog from "./TablesShowDialog.vue";
import TablesCreateDialog from "./TablesCreateDialog.vue";
import TablesEditDialog from "./TablesEditDialog.vue";

onMounted(() => {
  store.getTables();
});

const store = useTablesStore();
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
</script>

<template>
  <ConfirmDeleteModal
    :itemId="selectedIdForDelete"
    :deleting="store.deleting"
    ref="deleteDialog"
    @confirm-delete="store.deleteTable"
  />

  <TablesCreateDialog v-model="createDialog" />
  <TablesEditDialog v-model="editDialog" :id="selectedIdForEdit" />
  <TablesShowDialog v-model="showDialog" :id="selectedIdForShow" />

  <v-row class="mb-8">
    <v-col cols="12">
      <v-breadcrumbs class="py-0 px-0">
        <v-breadcrumbs-item :to="'/'"> Dashboard </v-breadcrumbs-item>
        <v-breadcrumbs-divider />
        <v-breadcrumbs-item disabled> Mesas </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>
  </v-row>

  <v-row class="mt-4">
    <v-col cols="12" md="3" class="py-0">
      <v-text-field
        v-model="store.search.number"
        @keyup="store.doResearch"
        label="Pesquisar"
        prepend-inner-icon="lucide:Search"
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

    <v-col cols="12" md="7" class="py-0 mb-3">
      <v-btn
        variant="text"
        size="small"
        icon="lucide:RefreshCw"
        @click="store.clearSearch"
        color="dark"
      />

      <v-btn
        v-can="'tables.store'"
        prepend-icon="lucide:Plus"
        @click.prevent="openCreateDialog()"
        variant="flat"
        class="float-end"
        text="Novo"
      />
    </v-col>
  </v-row>
  <SkeletonLoader v-if="store.loading" :rows="store.tables.meta.per_page" />

  <div v-else>
    <EmptyData v-if="store.tables.data.length <= 0" />

    <v-card class="border mt-4" v-else>
      <v-table density="default">
        <thead>
          <tr>
            <th class="text-left">
              <b>Número</b>
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
          <tr v-for="table in store.tables.data" :key="table.id">
            <td>{{ String(table.number).padStart(2, "0") }}</td>
            <td>{{ dayjs(table.updated).fromNow() }}</td>
            <td>
              <v-chip
                :color="table.active ? 'green' : 'red'"
                :text="table.active ? 'Ativo' : 'Inativo'"
                size="x-small"
                label
              ></v-chip>
            </td>
            <td class="text-right td-actions">
              <v-tooltip text="Visualizar">
                <template #activator="{ props }">
                  <v-btn
                    v-can="'tables.show'"
                    @click.prevent="openShowDialog(table.id)"
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
                    v-can="'tables.update'"
                    @click.prevent="openEditDialog(table.id)"
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
                    v-can="'tables.destroy'"
                    @click="openDeleteDialog(table.id)"
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
        v-if="store.tables.meta.total > store.tables.meta.per_page"
        @update:model-value="store.getTables"
        v-model="store.tables.meta.current_page"
        :length="store.tables.meta.last_page"
        :total-visible="store.tables.meta.per_page"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        size="small"
      />
    </div>
  </div>
</template>

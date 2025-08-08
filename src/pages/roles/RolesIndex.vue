<script setup>
import { onMounted, ref } from "vue";
import dayjs from "@/plugins/dayjs";
import { useRolesStore } from "@/stores/roles";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import RolesShowDialog from "./RolesShowDialog.vue";
import RolesCreateDialog from "./RolesCreateDialog.vue";
import RolesEditDialog from "./RolesEditDialog.vue";

onMounted(() => {
  store.getRoles();
  store.getResources();
});

const store = useRolesStore();
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
    @confirm-delete="store.deleteRole"
  />

  <RolesCreateDialog v-model="createDialog" />
  <RolesEditDialog v-model="editDialog" :id="selectedIdForEdit" />
  <RolesShowDialog v-model="showDialog" :id="selectedIdForShow" />

  <v-row class="mb-8">
    <v-col cols="12">
      <v-breadcrumbs class="py-0 px-0">
        <v-breadcrumbs-item :to="'/'"> Home </v-breadcrumbs-item>
        <v-breadcrumbs-divider />
        <v-breadcrumbs-item disabled> Papéis </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>
  </v-row>

  <v-row class="mt-4">
    <v-col cols="12" md="3" class="py-0">
      <v-text-field
        v-model="store.search.name"
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

    <v-col cols="12" md="7" class="py-0">
      <v-btn
        variant="text"
        size="small"
        color="dark"
        icon="lucide:RefreshCw"
        @click="store.clearSearch"
      />

      <v-btn
        v-can="'roles.store'"
        prepend-icon="lucide:Plus"
        @click.prevent="openCreateDialog()"
        color="primary"
        variant="flat"
        class="float-end"
        text="Novo"
      />
    </v-col>
  </v-row>

  <SkeletonLoader v-if="store.loading" :rows="store.roles.meta.per_page" />

  <div v-else>
    <EmptyData v-if="store.roles.data.length <= 0" />

    <v-card class="border mt-4" v-else>
      <v-table density="default">
        <thead>
          <tr>
            <th class="text-left">
              <b>Nome</b>
            </th>
            <th class="text-left">
              <b>Usuários</b>
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
          <tr v-for="role in store.roles.data" :key="role.id">
            <td>{{ role.name }}</td>
            <td>
              {{ role.count_users }}
            </td>
            <td>{{ dayjs(role.updated).fromNow() }}</td>
            <td>
              <v-chip
                :color="role.active ? 'green' : 'red'"
                :text="role.active ? 'Ativo' : 'Inativo'"
                size="x-small"
                label
              ></v-chip>
            </td>
            <td class="text-right">
              <v-tooltip text="Visualizar">
                <template #activator="{ props }">
                  <v-btn
                    v-can="'roles.show'"
                    @click.prevent="openShowDialog(role.id)"
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
                    v-can="'roles.update'"
                    @click.prevent="openEditDialog(role.id)"
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
                    v-can="'roles.destroy'"
                    @click="openDeleteDialog(role.id)"
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
        v-if="store.roles.meta.total > store.roles.meta.per_page"
        @update:model-value="store.getRoles"
        v-model="store.roles.meta.current_page"
        :length="store.roles.meta.last_page"
        :total-visible="store.roles.meta.per_page"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        size="small"
      />
    </div>
  </div>
</template>

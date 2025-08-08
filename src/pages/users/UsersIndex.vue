<script setup>
import { onMounted, ref } from "vue";
import dayjs from "@/plugins/dayjs";
import { useUsersStore } from "@/stores/users";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import EmptyData from "@/components/EmptyData.vue";
import UsersShowDialog from "./UsersShowDialog.vue";
import UsersCreateDialog from "./UsersCreateDialog.vue";
import UsersEditDialog from "./UsersEditDialog.vue";

onMounted(() => {
  store.getUsers();
});

const store = useUsersStore();
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
    @confirm-delete="store.deleteUser"
  />

  <UsersCreateDialog v-model="createDialog" />
  <UsersEditDialog v-model="editDialog" :id="selectedIdForEdit" />
  <UsersShowDialog v-model="showDialog" :id="selectedIdForShow" />

  <v-row class="mb-8">
    <v-col cols="12">
      <v-breadcrumbs class="py-0 px-0">
        <v-breadcrumbs-item :to="'/'"> Home </v-breadcrumbs-item>
        <v-breadcrumbs-divider />
        <v-breadcrumbs-item disabled> Usuários </v-breadcrumbs-item>
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
        v-can="'users.store'"
        prepend-icon="lucide:Plus"
        @click.prevent="openCreateDialog()"
        color="primary"
        variant="flat"
        class="float-end"
        text="Novo"
      />
    </v-col>
  </v-row>

  <SkeletonLoader v-if="store.loading" :rows="store.users.meta.per_page" />

  <div v-else>
    <EmptyData v-if="store.users.data.length <= 0" />

    <v-card class="border mt-4" v-else>
      <v-table density="default">
        <thead>
          <tr>
            <th class="text-left">
              <b>Nome</b>
            </th>
            <th class="text-left">
              <b>Email</b>
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
          <tr v-for="user in store.users.data" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ dayjs(user.updated).fromNow() }}</td>
            <td>
              <v-chip
                :color="user.active ? 'green' : 'red'"
                :text="user.active ? 'Ativo' : 'Inativo'"
                size="x-small"
                label
              ></v-chip>
            </td>
            <td class="text-right">
              <v-tooltip text="Visualizar">
                <template #activator="{ props }">
                  <v-btn
                    v-can="'users.show'"
                    @click.prevent="openShowDialog(user.id)"
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
                    v-can="'users.update'"
                    @click.prevent="openEditDialog(user.id)"
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
                    v-can="'users.destroy'"
                    @click="openDeleteDialog(user.id)"
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
        v-if="store.users.meta.total > store.users.meta.per_page"
        @update:model-value="store.getUsers"
        v-model="store.users.meta.current_page"
        :length="store.users.meta.last_page"
        :total-visible="store.users.meta.per_page"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        size="small"
      />
    </div>
  </div>
</template>

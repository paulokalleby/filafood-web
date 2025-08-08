<script setup>
import { onMounted, ref } from "vue";
import dayjs from "@/plugins/dayjs";
import { useCommandsStore } from "@/stores/commands";
import EmptyData from "@/components/EmptyData.vue";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import CommandsShowDialog from "./CommandsShowDialog.vue";
import CommandsEditDialog from "./CommandsEditDialog.vue";
import { formatCurrency } from "@/utils/helpers";

onMounted(async () => {
  await store.getTables();
  await store.tables.unshift({ number: "Todas", id: "" });
  await store.getCommands();
});

const store = useCommandsStore();
const selectedIdForShow = ref(null);

const showDialog = ref(false);

const openShowDialog = (id) => {
  selectedIdForShow.value = id;
  showDialog.value = true;
};
</script>

<template>
  <CommandsShowDialog v-model="showDialog" :id="selectedIdForShow" />

  <v-row class="mb-8">
    <v-col cols="12">
      <v-breadcrumbs class="py-0 px-0">
        <v-breadcrumbs-item :to="'/'"> Dashboard </v-breadcrumbs-item>
        <v-breadcrumbs-divider />
        <v-breadcrumbs-item disabled> Comandas </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>
  </v-row>

  <v-row class="mt-4">
    <v-col cols="12" md="3" class="py-0">
      <v-text-field
        v-model="store.search.identify"
        @keyup="store.doResearch"
        label="Pesquisar"
        prepend-inner-icon="lucide:Search"
      />
    </v-col>

    <v-col cols="12" md="2" class="py-0">
      <v-select
        v-model="store.search.table"
        @update:model-value="store.doResearch"
        label="Mesa"
        :items="store.tables"
        item-title="number"
        item-value="id"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col cols="12" md="2" class="py-0">
      <v-select
        v-model="store.search.status"
        @update:model-value="store.doResearch"
        label="Status"
        :items="[
          { name: 'Todos', value: '' },
          { name: 'Aberto', value: 'Open' },
          { name: 'Pago', value: 'Closed' },
          { name: 'Cancelado', value: 'Cancelled' },
        ]"
        item-title="name"
        item-value="value"
      />
    </v-col>

    <v-col cols="12" md="5" class="py-0 mb-3">
      <v-btn
        variant="text"
        size="small"
        icon="lucide:RefreshCw"
        @click="store.clearSearch"
        color="dark"
      />

      <v-btn
        prepend-icon="lucide:ConciergeBell"
        variant="flat"
        class="float-end"
        text="Gestão de Mesas"
      />
    </v-col>
  </v-row>

  <SkeletonLoader v-if="store.loading" :rows="store.commands.meta.per_page" />

  <div v-else>
    <EmptyData v-if="store.commands.data.length <= 0" />

    <v-card class="border mt-4" v-else>
      <v-table density="default">
        <thead>
          <tr>
            <th class="text-left">
              <b>Comanda</b>
            </th>
            <th class="text-left">
              <b>Mesa</b>
            </th>
            <th class="text-left">
              <b>Total</b>
            </th>
            <th class="text-left">
              <b>Abertura</b>
            </th>
            <th class="text-left">
              <b>Status</b>
            </th>
            <th class="text-right"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="command in store.commands.data" :key="command.id">
            <td>{{ command.identify }}</td>
            <td>
              <b>{{ String(command.table.number).padStart(2, "0") }}</b>
            </td>
            <td>{{ formatCurrency(command.total) }}</td>
            <td>{{ dayjs(command.created).format("DD/MM/YYYY - HH:mm") }}</td>
            <td>
              <v-chip
                :color="command.status.color"
                :text="command.status.label"
                size="x-small"
                label
              ></v-chip>
            </td>
            <td class="text-right">
              <v-tooltip text="Detalhes">
                <template #activator="{ props }">
                  <v-btn
                    v-can="'commands.show'"
                    @click.prevent="openShowDialog(command.id)"
                    icon
                    size="small"
                    variant="text"
                    color="dark"
                    v-bind="props"
                  >
                    <v-icon size="18">lucide:Ticket</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <!-- 
              <v-tooltip text="Editar">
                <template #activator="{ props }">
                  <v-btn
                    v-can="'commands.update'"
                    @click.prevent="openEditDialog(command.id)"
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
                    v-can="'commands.destroy'"
                    @click="openDeleteDialog(command.id)"
                    icon
                    size="small"
                    variant="text"
                    color="dark"
                    v-bind="props"
                  >
                    <v-icon size="18">lucide:Trash2</v-icon>
                  </v-btn>
                </template>
              </v-tooltip> -->
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <div class="text-center mt-3">
      <v-pagination
        v-if="store.commands.meta.total > store.commands.meta.per_page"
        @update:model-value="store.getCommands"
        v-model="store.commands.meta.current_page"
        :length="store.commands.meta.last_page"
        :total-visible="store.commands.meta.per_page"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        size="small"
      />
    </div>
  </div>
</template>

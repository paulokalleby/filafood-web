<script setup>
import { ref, watch, computed } from "vue";
import { useCommandsStore } from "@/stores/commands";
import { formatCurrency } from "@/utils/helpers";

const props = defineProps({
  modelValue: Boolean,
  id: String,
});
const emit = defineEmits(["update:modelValue"]);
const store = useCommandsStore();
const data = ref(null);

const close = () => emit("update:modelValue", false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

watch(
  () => props.id,
  async (id) => {
    if (props.modelValue && id) {
      data.value = null;
      data.value = await store.findCommandById(id);
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-navigation-drawer
    location="right"
    temporary
    width="400"
    v-model="isOpen"
    :scrim="true"
    :fullscreen="false"
  >
    <v-card class="d-flex flex-column h-100">
      <v-toolbar color="white">
        <v-toolbar-title class="font-weight-bold">Comanda</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close" variant="text">
          <v-icon>lucide:X</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="px-5 flex-grow-1 overflow-y-auto">
        <p>
          <strong>{{ data?.identify }}</strong>
        </p>
        <p>
          <strong>Mesa:</strong>
          {{ String(data?.table.number).padStart(2, "0") }}
        </p>

        <v-chip
          class="mt-4"
          :color="data?.status.color"
          :text="data?.status.label"
          size="x-small"
          label
        />

        <div v-if="data?.items.length > 0">
          <h3 class="mb-2 mt-6">Produtos:</h3>

          <v-card
            v-for="item in data?.items"
            :key="item.id"
            class="rounded-b-0 border-b py-2"
          >
            <p class="text-body-2">
              <strong>{{ item.product }}</strong>
            </p>
            <p class="text-caption">
              {{ item.quantity }} x {{ formatCurrency(item.price) }}
            </p>
          </v-card>
        </div>
      </v-card-text>

      <v-card-actions class="px-5 py-4 border-t">
        <!-- <v-btn
          @click="close"
          class="float-start"
          text="Cancelar"
          color="dark"
          variant="plain"
        />
       -->
        <h3>{{ formatCurrency(data?.total) }}</h3>
        <v-spacer />
        <v-btn
          variant="flat"
          color="primary"
          text="Encerrar"
          append-icon="lucide:MoveRight"
          class="px-4"
        />
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

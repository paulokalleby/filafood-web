<script setup>
import { ref, watch, computed } from "vue";
import { useProductsStore } from "@/stores/products";
import {
  formatCurrency,
  getImagePlaceholder,
  getImageSrc,
} from "@/utils/helpers";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  id: {
    type: String,
    required: false,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const store = useProductsStore();
const data = ref(null);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

watch(
  () => props.id,
  async (id) => {
    if (props.modelValue && id) {
      data.value = null;
      data.value = await store.findProductById(id);
    }
  },
  { immediate: true }
);

const close = () => emit("update:modelValue", false);
</script>

<template>
  <v-navigation-drawer
    location="right"
    temporary
    width="500"
    v-model="isOpen"
    :scrim="true"
    :fullscreen="false"
  >
    <v-card :loading="store.loading">
      <v-toolbar color="white">
        <v-toolbar-title class="font-weight-bold">Produto</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close" variant="plain">
          <v-icon>lucide:X</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="px-5" v-if="data">
        <v-img
          :aspect-ratio="1"
          class="bg-light mb-4"
          :lazy-src="getImagePlaceholder()"
          :src="getImageSrc(data?.image)"
          width="92"
          height="92"
          cover
          rounded
        />
        <p><strong>Nome:</strong> {{ data?.name }}</p>
        <p><strong>Categoria:</strong> {{ data?.category?.name }}</p>
        <p><strong>Preço:</strong> {{ formatCurrency(data?.price) }}</p>
        <p><strong>Descrição:</strong> {{ data?.description }}</p>

        <v-chip
          class="mt-4"
          :color="data?.active ? 'green' : 'red'"
          :text="data?.active ? 'Ativo' : 'Inativo'"
          size="x-small"
          label
        />
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

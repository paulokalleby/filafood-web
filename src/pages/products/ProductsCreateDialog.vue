<script setup>
import useVuelidate from "@vuelidate/core";
import { productRules } from "@/validations/product.rules";
import { useProductsStore } from "@/stores/products";
import { getImagePlaceholder } from "@/utils/helpers";
import { ref, computed } from "vue";

const store = useProductsStore();

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const previewUrl = ref(null);
const fileInput = ref(null);

const data = ref({
  product: "",
  name: "",
  price: "",
  description: "",
  active: true,
});

const resetForm = () => {
  data.value = {
    product: "",
    name: "",
    price: "",
    description: "",
    active: true,
  };
  v$.value.$reset();
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const handleImageSelected = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewUrl.value = reader.result;
    store.setFile(file);
  };
  reader.readAsDataURL(file);
};

const v$ = useVuelidate(productRules, data.value);

const handlerStore = async () => {
  if (!(await v$.value.$validate())) return;
  await store.createProduct(data.value);
  close();
};

const close = () => {
  previewUrl.value = null;
  resetForm();
  emit("update:modelValue", false);
};
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
    <v-card class="d-flex flex-column h-100">
      <v-toolbar color="white">
        <v-toolbar-title class="font-weight-bold"
          >Cadastrar Produto</v-toolbar-title
        >
        <v-spacer />
        <v-btn icon @click="close" variant="plain">
          <v-icon>lucide:X</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="px-5 flex-grow-1 overflow-y-auto">
        <v-form @submit.prevent="handlerStore" class="my-3">
          <v-row>
            <v-col cols="12" class="pb-6 ml-0">
              <v-img
                :src="previewUrl || getImagePlaceholder()"
                max-height="100"
                max-width="100"
                :aspect-ratio="1"
                min-width="92"
                min-height="92"
                cover
                rounded="lg"
                class="cursor-pointer bg-light"
                @click="fileInput?.click()"
              />

              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="d-none"
                @change="handleImageSelected"
              />
            </v-col>
            <v-col cols="12" md="7" class="pb-0">
              <v-select
                v-model="data.category"
                label="Categoria"
                :items="store.categories"
                item-title="name"
                item-value="id"
                :error-messages="v$.category.$errors.map((e) => e.$message)"
                @input="v$.category.$touch"
                @blur="v$.category.$touch"
                density="compact"
              />
            </v-col>

            <v-col cols="12" md="5" class="pb-0">
              <v-text-field
                v-model="data.price"
                :error-messages="v$.price.$errors.map((e) => e.$message)"
                @input="v$.price.$touch"
                @blur="v$.price.$touch"
                label="Preço"
                density="compact"
              />
            </v-col>

            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="data.name"
                :error-messages="v$.name.$errors.map((e) => e.$message)"
                @input="v$.name.$touch"
                @blur="v$.name.$touch"
                label="Nome"
                density="compact"
              />
            </v-col>

            <v-col cols="12" class="pb-0">
              <v-textarea
                v-model="data.description"
                :error-messages="v$.description.$errors.map((e) => e.$message)"
                @input="v$.description.$touch"
                @blur="v$.description.$touch"
                label="Descrição"
                density="compact"
                clearable
                rows="2"
              />
            </v-col>

            <v-col cols="12" class="py-0 ml-2">
              <v-switch v-model="data.active" label="Ativo" hide-details />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-5 py-4 border-t">
        <v-btn
          :loading="store.creating"
          @click="handlerStore"
          variant="flat"
          class="float-start mr-2"
          text="Salvar"
        />

        <v-btn
          @click="close"
          class="float-start"
          text="Cancelar"
          color="dark"
          variant="plain"
        />
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

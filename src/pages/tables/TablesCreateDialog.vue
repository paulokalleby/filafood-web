<script setup>
import useVuelidate from "@vuelidate/core";
import { tableRules } from "@/validations/table.rules";
import { useTablesStore } from "@/stores/tables";
import { ref, computed } from "vue";

const store = useTablesStore();

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const data = ref({
  number: 0,
  active: true,
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const resetForm = () => {
  data.value = {
    number: 0,
    active: true,
  };
  v$.value.$reset();
};

const v$ = useVuelidate(tableRules, data.value);

const handlerStore = async () => {
  if (!(await v$.value.$validate())) return;
  await store.createTable(data.value);
  close();
};

const close = () => {
  resetForm();
  emit("update:modelValue", false);
};
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
        <v-toolbar-title class="font-weight-bold"
          >Cadastrar Mesa</v-toolbar-title
        >
        <v-spacer />
        <v-btn icon @click="close" variant="plain">
          <v-icon>lucide:X</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="px-5 flex-grow-1 overflow-y-auto">
        <v-form @submit.prevent="handlerStore" class="my-3">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-number-input
                v-model="data.number"
                :error-messages="v$.number.$errors.map((e) => e.$message)"
                @input="v$.number.$touch"
                @blur="v$.number.$touch"
                :reverse="false"
                label="Número da mesa"
                :hideInput="false"
                :inset="false"
                variant="outlined"
                :min="0"
                :max="99"
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

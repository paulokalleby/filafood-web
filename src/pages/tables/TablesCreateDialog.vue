<script setup>
import useVuelidate from "@vuelidate/core";
import { tableRules, tableBatchRules } from "@/validations/table.rules";
import { useTablesStore } from "@/stores/tables";
import { ref, computed, watch, nextTick } from "vue";

const store = useTablesStore();

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const data = ref({
  number: 0,
  active: true,
});

const dataBatch = ref({
  start_number: 1,
  end_number: 1,
});

const isBatch = ref(false);

const formRef = ref(null);
const formValid = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const v$ = useVuelidate(
  computed(() => (isBatch.value ? tableBatchRules : tableRules)),
  computed(() => (isBatch.value ? dataBatch.value : data.value))
);

const resetForm = () => {
  data.value = { number: 0, active: true };
  dataBatch.value = { start_number: 1, end_number: 1 };
  v$.value.$reset();
  formRef.value?.resetValidation();
};

const handlerStore = async () => {
  if (!(await v$.value.$validate())) return;

  if (isBatch.value) {
    await store.createTablesInBatch(dataBatch.value);
  } else {
    await store.createTable(data.value);
  }

  close();
};

const close = () => {
  isBatch.value = false;
  resetForm();
  emit("update:modelValue", false);
};

watch(isBatch, () => {
  resetForm();
});
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
        <v-toolbar-title class="font-weight-bold">
          Cadastrar Mesa
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close" variant="plain">
          <v-icon>lucide:X</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="px-5 flex-grow-1 overflow-y-auto">
        <v-form
          @submit.prevent="handlerStore"
          class="my-3"
          ref="formRef"
          v-model="formValid"
        >
          <div v-if="isBatch">
            <v-number-input
              v-model="dataBatch.start_number"
              :error-messages="v$.start_number.$errors.map((e) => e.$message)"
              @input="v$.start_number.$touch"
              @blur="v$.start_number.$touch"
              :reverse="false"
              label="Número inicial"
              :hideInput="false"
              :inset="false"
              variant="outlined"
              :min="0"
              :max="99"
            />
            <v-number-input
              class="mt-3"
              v-model="dataBatch.end_number"
              :error-messages="v$.end_number.$errors.map((e) => e.$message)"
              @input="v$.end_number.$touch"
              @blur="v$.end_number.$touch"
              :reverse="false"
              label="Número final"
              :hideInput="false"
              :inset="false"
              variant="outlined"
              :min="0"
              :max="99"
            />
          </div>

          <v-number-input
            v-else
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

          <v-btn
            @click="isBatch = !isBatch"
            class="float-end mt-1"
            :text="isBatch ? 'Criar manual' : 'Criar em lote'"
            color="dark"
            variant="plain"
          />

          <v-switch
            v-if="!isBatch"
            v-model="data.active"
            label="Ativo"
            hide-details
          />
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

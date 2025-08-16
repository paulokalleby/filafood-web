<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { profileRules } from "@/validations/auth/profile.rules";
import { useAuthStore } from "@/stores/auth";

onMounted(() => {
  Object.assign(data.value, store.user);
});

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const store = useAuthStore();

const passwordFieldType = ref(true);
const confirmPasswordFieldType = ref(true);

const data = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const rules = computed(() => profileRules(data.value.password || ""));
const v$ = useVuelidate(rules, reactive(data));

const handlerUpdate = async () => {
  if (!(await v$.value.$validate())) return;
  if (store.updateProfile(data.value)) {
    data.value.password = "";
    data.value.confirmPassword = "";
  }
};

const resetForm = () => {
  Object.assign(data.value, store.user);
  data.value.password = "";
  data.value.confirmPassword = "";
  v$.value.$reset();
};

const close = () => {
  resetForm();
  emit("update:modelValue", false);
};
</script>

<template>
  <v-dialog v-model="isOpen" max-width="700">
    <v-card class="d-flex flex-column">
      <v-toolbar color="white">
        <v-toolbar-title class="font-weight-bold">Meus Dados</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close" variant="plain">
          <v-icon>lucide:X</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="px-5 pb-0">
        <v-form @submit.prevent="handlerUpdate" class="my-3">
          <v-row>
            <v-col cols="12" md="12" class="pb-0">
              <v-text-field
                v-model="data.name"
                :error-messages="v$.name.$errors.map((e) => e.$message)"
                @input="v$.name.$touch"
                @blur="v$.name.$touch"
                label="Nome"
                density="compact"
              />
            </v-col>

            <v-col cols="12" md="12" class="pb-0">
              <v-text-field
                v-model="data.email"
                :error-messages="v$.email.$errors.map((e) => e.$message)"
                @input="v$.email.$touch"
                @blur="v$.email.$touch"
                label="Email"
                density="compact"
              />
            </v-col>

            <v-col cols="12" md="6" class="pb-0">
              <v-text-field
                v-model="data.password"
                :error-messages="v$.password.$errors.map((e) => e.$message)"
                @input="v$.password.$touch"
                @blur="v$.password.$touch"
                @click:append-inner="passwordFieldType = !passwordFieldType"
                :append-inner-icon="
                  passwordFieldType ? 'lucide:Eye' : 'lucide:EyeOff'
                "
                :type="passwordFieldType ? 'password' : 'text'"
                label="Senha"
                density="compact"
              />
            </v-col>

            <v-col cols="12" md="6" class="pb-0">
              <v-text-field
                v-model="data.confirmPassword"
                :error-messages="
                  v$.confirmPassword.$errors.map((e) => e.$message)
                "
                @input="v$.confirmPassword.$touch"
                @blur="v$.confirmPassword.$touch"
                @click:append-inner="
                  confirmPasswordFieldType = !confirmPasswordFieldType
                "
                :append-inner-icon="
                  confirmPasswordFieldType ? 'lucide:Eye' : 'lucide:EyeOff'
                "
                :type="confirmPasswordFieldType ? 'password' : 'text'"
                label="Confirmar Senha"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-5 pb-4">
        <v-btn
          :loading="store.updating"
          type="submit"
          variant="flat"
          color="primary"
          @click="handlerUpdate"
          text="Salvar"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

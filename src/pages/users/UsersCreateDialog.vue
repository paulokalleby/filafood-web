<script setup>
import useVuelidate from "@vuelidate/core";
import { userStoreRules } from "@/validations/user.rules";
import { useUsersStore } from "@/stores/users";
import { ref, onMounted, computed } from "vue";

onMounted(() => {
  store.getRoles();
});

const store = useUsersStore();

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const data = ref({
  name: "",
  email: "",
  password: "",
  roles: [],
  active: true,
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const resetForm = () => {
  data.value = {
    name: "",
    email: "",
    password: "",
    roles: [],
    active: true,
  };
  v$.value.$reset();
};

const v$ = useVuelidate(userStoreRules, data.value);

const handlerStore = async () => {
  if (!(await v$.value.$validate())) return;
  await store.createUser(data.value);
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
          >Cadastrar Usuário</v-toolbar-title
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
              <v-text-field
                v-model="data.name"
                :error-messages="v$.name.$errors.map((e) => e.$message)"
                @input="v$.name.$touch"
                @blur="v$.name.$touch"
                label="Nome"
              />
            </v-col>

            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="data.email"
                :error-messages="v$.email.$errors.map((e) => e.$message)"
                @input="v$.email.$touch"
                @blur="v$.email.$touch"
                label="Email"
              />
            </v-col>

            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="data.password"
                :error-messages="v$.password.$errors.map((e) => e.$message)"
                @input="v$.password.$touch"
                @blur="v$.password.$touch"
                label="Senha"
                type="password"
              />
            </v-col>

            <v-col cols="12" class="pb-0">
              <v-combobox
                v-model="data.roles"
                label="Papéis"
                :items="store.roles"
                item-title="name"
                item-value="id"
                clearable
                multiple
                chips
              />
            </v-col>

            <v-col cols="12" class="py-0 ml-1">
              <v-switch
                v-model="data.active"
                label="Ativo"
                hide-details
                color="primary"
                :ripple="false"
                :flat="true"
              />
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

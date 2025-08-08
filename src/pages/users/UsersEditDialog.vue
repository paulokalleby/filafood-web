<script setup>
import { ref, watch, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { userUpdateRules } from "@/validations/user.rules";
import { useUsersStore } from "@/stores/users";

const props = defineProps({
  modelValue: Boolean,
  id: String,
});
const emit = defineEmits(["update:modelValue"]);

const store = useUsersStore();

const data = ref({
  name: "",
  email: "",
  password: "",
  roles: [],
  active: false,
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const v$ = useVuelidate(userUpdateRules, data);

const handlerUpdate = async () => {
  if (!(await v$.value.$validate())) return;
  await store.updateUser(props.id, data.value);
  close();
};

const close = () => emit("update:modelValue", false);

watch(
  () => props.id,
  async (id) => {
    if (props.modelValue && id) {
      data.value = await store.findUserById(id);
      await store.getRoles();
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
        <v-toolbar-title class="font-weight-bold"
          >Editar Usuário</v-toolbar-title
        >
        <v-spacer />
        <v-btn icon @click="close" variant="plain">
          <v-icon>lucide:X</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="px-5 flex-grow-1 overflow-y-auto">
        <v-form @submit.prevent="handlerUpdate" class="my-3">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="data.name"
                :error-messages="v$.name.$errors.map((e) => e.$message)"
                @input="v$.name.$touch"
                @blur="v$.name.$touch"
                label="Nome"
                :loading="store.loading"
              />
            </v-col>

            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="data.email"
                :error-messages="v$.email.$errors.map((e) => e.$message)"
                @input="v$.email.$touch"
                @blur="v$.email.$touch"
                label="Email"
                :loading="store.loading"
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
                :loading="store.loading"
                chips
              />
            </v-col>

            <v-col cols="12" class="py-0 ml-2">
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
          :loading="store.updating"
          type="submit"
          variant="flat"
          color="primary"
          @click="handlerUpdate"
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

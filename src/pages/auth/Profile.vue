<script setup>
import { onMounted, ref, computed, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { profileRules } from "@/validations/auth/profile.rules";
import { useAuthStore } from "@/stores/auth";

onMounted(() => {
  Object.assign(data.value, store.user);
});

const store = useAuthStore();

const passwordFieldType = ref("password");
const confirmPasswordFieldType = ref("password");
const locked = ref(true);

const data = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const rules = computed(() => profileRules(data.value.password || ""));
const v$ = useVuelidate(rules, reactive(data));

const toggleLocked = () => {
  locked.value = !locked.value;
};

const handlerUpdate = async () => {
  if (!(await v$.value.$validate())) return;
  if (store.updateProfile(data.value)) {
    data.value.password = "";
    data.value.confirmPassword = "";
  }
};
</script>

<template>
  <v-row class="mb-8">
    <v-col cols="12">
      <v-breadcrumbs class="py-0 px-0">
        <v-breadcrumbs-item :to="'/'"> Home </v-breadcrumbs-item>
        <v-breadcrumbs-divider />
        <v-breadcrumbs-item disabled> Meus Dados </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>
  </v-row>

  <v-form @submit.prevent="handlerUpdate" class="my-3">
    <v-row>
      <v-col cols="12" md="6" class="pb-0">
        <v-text-field
          v-model="data.name"
          :error-messages="v$.name.$errors.map((e) => e.$message)"
          @input="v$.name.$touch"
          @blur="v$.name.$touch"
          label="Nome"
          density="compact"
          :loading="store.loading"
          :disabled="locked"
        >
        </v-text-field>
      </v-col>

      <v-col cols="12" md="6" class="pb-0">
        <v-text-field
          v-model="data.email"
          :error-messages="v$.email.$errors.map((e) => e.$message)"
          @input="v$.email.$touch"
          @blur="v$.email.$touch"
          label="Email"
          density="compact"
          :loading="store.loading"
          :disabled="locked"
        >
        </v-text-field>
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
          :disabled="locked"
        />
      </v-col>

      <v-col cols="12" md="6" class="pb-0">
        <v-text-field
          v-model="data.confirmPassword"
          :error-messages="v$.confirmPassword.$errors.map((e) => e.$message)"
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
          :disabled="locked"
        />
      </v-col>

      <v-col cols="12">
        <v-btn
          :loading="store.updating"
          type="submit"
          color="primary"
          variant="flat"
          class="float-start mr-2"
          :disabled="locked"
        >
          Alterar
        </v-btn>
        <v-btn
          variant="text"
          :icon="locked ? 'lucide:Lock' : 'lucide:LockOpen'"
          class="float-end"
          @click.prevent="toggleLocked"
          :ripple="false"
          size="small"
          color="dark"
        >
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

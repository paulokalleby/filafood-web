<script setup>
import useVuelidate from "@vuelidate/core";
import loginRules from "@/validations/auth/login.rules";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import PreLoader from "@/components/PreLoader.vue";

const store = useAuthStore();
const passwordFieldType = ref("password");

const data = ref({
  email: "",
  password: "",
  device: "webapp",
});

const v$ = useVuelidate(loginRules, data.value);

const handlerLogin = async () => {
  if (!(await v$.value.$validate())) return;
  await store.login(data.value);
};
</script>

<template>
  <v-form @submit.prevent="handlerLogin">
    <v-row class="pa-xl-12 pa-lg-8 pa-6">
      <v-col cols="12" class="text-start pb-4">
        <h1>Login</h1>
        <p>Informe suas credencias para acessar</p>
      </v-col>
      <v-col cols="12" class="text-start pt-0 pb-2">
        <v-text-field
          v-model="data.email"
          :error-messages="v$.email.$errors.map((e) => e.$message)"
          @input="v$.email.$touch"
          @blur="v$.email.$touch"
          label="Email"
          density="compact"
        />
      </v-col>
      <v-col cols="12" class="text-start pt-0 pb-0">
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
      <v-col cols="12" class="pt-0 pb-1">
        <v-btn
          type="submit"
          color="primary"
          flat
          block
          class="mb-3 float-start"
          :loading="store.loading"
          text="Entrar"
        >
        </v-btn>
      </v-col>
      <v-col cols="12" class="pt-0 pb-1 text-center">
        <v-btn
          :to="{ name: 'auth.register' }"
          variant="plain"
          text="Registre-se"
          color="dark"
        ></v-btn>
        |
        <v-btn
          :to="{ name: 'auth.recover-password' }"
          variant="plain"
          text="Esqueci a senha"
          color="dark"
        >
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import useVuelidate from "@vuelidate/core";
import registerRules from "@/validations/auth/register.rules";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();
const passwordFieldType = ref("password");

const data = ref({
  company: "",
  name: "",
  email: "",
  cellphone: "",
  document: "",
  password: "",
});

const v$ = useVuelidate(registerRules, data.value);

const handlerRegister = async () => {
  if (!(await v$.value.$validate())) return;
  await store.register(data.value);
};
</script>

<template>
  <v-form @submit.prevent="handlerRegister">
    <v-row class="pa-xl-12 pa-lg-8 pa-6">
      <v-col cols="12" class="text-start pb-4">
        <h1>Registre-se</h1>
        <p>Se inscreva para ter acesso</p>
      </v-col>

      <v-col cols="12" class="text-start pt-0 pb-2">
        <v-text-field
          v-model="data.company"
          :error-messages="v$.company.$errors.map((e) => e.$message)"
          @input="v$.company.$touch"
          @blur="v$.company.$touch"
          label="Empresa"
          density="compact"
        />
      </v-col>

      <v-col cols="12" class="text-start pt-0 pb-2">
        <v-text-field
          v-model="data.name"
          :error-messages="v$.name.$errors.map((e) => e.$message)"
          @input="v$.name.$touch"
          @blur="v$.name.$touch"
          label="Nome"
          density="compact"
        />
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
      <v-col cols="12" class="text-start pt-0 pb-2">
        <v-text-field
          v-model="data.cellphone"
          :error-messages="v$.cellphone.$errors.map((e) => e.$message)"
          @input="v$.cellphone.$touch"
          @blur="v$.cellphone.$touch"
          label="Celular"
          density="compact"
        />
      </v-col>
      <v-col cols="12" class="text-start pt-0 pb-2">
        <v-text-field
          v-model="data.document"
          :error-messages="v$.document.$errors.map((e) => e.$message)"
          @input="v$.document.$touch"
          @blur="v$.document.$touch"
          label="CPF ou CNPJ"
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
          :loading="store.creating"
          text="Registrar"
        >
        </v-btn>
      </v-col>
      <v-col cols="12" class="pt-0 pb-1 text-center">
        <v-btn
          :to="{ name: 'auth.login' }"
          variant="plain"
          text="Entrar"
          color="dark"
        ></v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

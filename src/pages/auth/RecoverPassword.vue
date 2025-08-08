<script setup>
import { useRouter } from "vue-router";
import { computed, reactive } from "vue";
import { useToast } from "vue-toastification";
import useVuelidate from "@vuelidate/core";
import {
  forgotRules,
  verifyRules,
  resetRules,
} from "@/validations/auth/recover-password.rules";
import http from "@/http";
import PreLoader from "@/components/PreLoader.vue";

const toast = useToast();
const router = useRouter();

const state = reactive({
  data: {
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  },
  passwordFieldType: "password",
  confirmPasswordFieldType: "password",
  step: 1,
  loading: false,
});

const f$ = useVuelidate(forgotRules, state);
const v$ = useVuelidate(verifyRules, state);
const rules = computed(() => resetRules(state.data.password));
const r$ = useVuelidate(rules, state);

const handlerForgotPassword = async () => {
  if (!(await f$.value.$validate())) return;
  state.loading = true;
  try {
    const response = await http.post("/auth/password/code", {
      email: state.data.email,
    });
    state.step = 2;
    state.description = "Informe o código recebido por email";
    toast.success(response.data.message);
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "Falha ao enviar email para redefinição!"
    );
  } finally {
    state.loading = false;
  }
};

const handlerVerifyCode = async () => {
  if (!(await v$.value.$validate())) return;
  state.loading = true;
  try {
    const response = await http.post("/auth/password/verify", {
      email: state.data.email,
      code: state.data.code,
    });
    state.step = 3;
    state.description = "Informe a senha desejada";
    toast.success(response.data.message);
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Falha verificação do código!"
    );
  } finally {
    state.loading = false;
  }
};

const handlerResetPassword = async () => {
  if (!(await r$.value.$validate())) return;
  state.loading = true;
  try {
    const response = await http.post("/auth/password/reset", {
      email: state.data.email,
      code: state.data.code,
      password: state.data.password,
    });
    state.step = 1;
    toast.success(response.data.message);
    router.push({ name: "auth.login" });
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Falha na alteração da senha!"
    );
  } finally {
    state.loading = false;
  }
};
</script>

<template>
  <v-form v-if="state.step == 1" @submit.prevent="handlerForgotPassword">
    <v-row class="pa-xl-12 pa-lg-8 pa-6">
      <v-col cols="12" class="text-start pb-4">
        <h1>Recuperar Senha</h1>
        <p>Informe os dados solicitados</p>
      </v-col>
      <v-col cols="12" class="text-start pt-0 pb-2">
        <v-text-field
          v-model="state.data.email"
          :error-messages="f$.data.email.$errors.map((e) => e.$message)"
          @input="f$.data.email.$touch"
          @blur="f$.data.email.$touch"
          label="Email da conta"
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
          :loading="state.loading"
          text="Enviar"
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

  <v-form v-if="state.step == 2" @submit.prevent="handlerVerifyCode">
    <v-row class="pa-xl-12 pa-lg-8 pa-6">
      <v-col cols="12" class="text-start pb-4">
        <h1>Recuperar Senha</h1>
        <p>Informe o código recebido por email</p>
      </v-col>

      <v-col cols="12" class="text-start pt-0 pb-2">
        <v-otp-input v-model="state.data.code" class="w-100"></v-otp-input>
      </v-col>
      <v-col cols="12" class="pt-0 pb-1">
        <v-btn
          :disabled="state.data.code.length < 5 || loading"
          type="submit"
          color="primary"
          flat
          block
          class="mb-3 float-start"
          :loading="state.loading"
          text="Verificar Código"
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

  <v-form v-if="state.step == 3" @submit.prevent="handlerResetPassword">
    <v-row class="pa-xl-12 pa-lg-8 pa-6">
      <v-col cols="12" class="text-start pb-4">
        <h1>Recuperar Senha</h1>
        <p>Informe a senha desejada</p>
      </v-col>
      <v-col cols="12" class="text-start pt-0 pb-2">
        <v-text-field
          v-model="state.data.password"
          :error-messages="r$.data.password.$errors.map((e) => e.$message)"
          @input="r$.data.password.$touch"
          @blur="r$.data.password.$touch"
          @click:append-inner="
            state.passwordFieldType = !state.passwordFieldType
          "
          :append-inner-icon="
            state.passwordFieldType ? 'lucide:Eye' : 'lucide:EyeOff'
          "
          :type="state.passwordFieldType ? 'password' : 'text'"
          label="Senha"
          density="compact"
        />
      </v-col>
      <v-col cols="12" class="text-start pt-0 pb-0">
        <v-text-field
          v-model="state.data.confirmPassword"
          :error-messages="
            r$.data.confirmPassword.$errors.map((e) => e.$message)
          "
          @input="r$.data.confirmPassword.$touch"
          @blur="r$.data.confirmPassword.$touch"
          @click:append-inner="
            state.confirmPasswordFieldType = !state.confirmPasswordFieldType
          "
          :append-inner-icon="
            state.confirmPasswordFieldType ? 'lucide:Eye' : 'lucide:EyeOff'
          "
          :type="state.confirmPasswordFieldType ? 'password' : 'text'"
          label="Confirmar Senha"
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
          :loading="state.loading"
          text="Salvar"
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

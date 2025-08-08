<script setup>
import { onBeforeMount } from "vue";
import { useDark } from "@vueuse/core";

const isDark = useDark();

onBeforeMount(() => {
  document.title = "Pagina Não Encontrada";
});
</script>

<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-container
      fluid
      class="error-container d-flex flex-column align-center justify-center text-center"
    >
      <v-icon size="80" class="text-primary">mdi-alert-circle-outline</v-icon>
      <h1 class="text-h2 font-weight-bold mt-4">404</h1>
      <p class="text-h6 text-grey-darken-1">Ops! Página não encontrada.</p>
      <v-btn
        color="primary"
        variant="outlined"
        class="mt-4"
        :to="{ name: 'start' }"
      >
        Voltar para a página inicial
      </v-btn>
    </v-container>
  </v-app>
</template>

<style scoped>
.error-container {
  height: 100vh; /* Garante que o container ocupe 100% da altura da tela */
  display: flex;
}
</style>

<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-container class="pa-0" fluid>
      <v-row no-gutters class="h-100">
        <v-col
          sm="12"
          cols="12"
          md="8"
          xl="8"
          class="d-none d-md-flex align-center justify-center"
        >
          <v-img
            src="@/assets/img/placeholder.svg"
            alt="Imagem de Login"
            cover
            class="image-full"
          />
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="4"
          xl="4"
          class="d-flex align-center justify-center pa-xl-18 pa-lg-12"
        >
          <router-view></router-view>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
@media (min-width: 960px) {
  .logo {
    position: relative;
    top: -100px;
  }
}
.image-full {
  width: 100%;
  height: 100vh;
}
</style>

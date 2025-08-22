<script setup>
import { useAuthStore } from "@/stores/auth.js";
const auth = useAuthStore();
</script>

<template>
  <v-row class="mb-8">
    <v-col cols="12">
      <!-- <v-breadcrumbs class="py-0 px-0">
        <v-breadcrumbs-item disabled> Dashboard </v-breadcrumbs-item>
      </v-breadcrumbs> -->
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" md="3">
      <v-card
        class="border"
        append-icon="lucide:ReceiptText"
        subtitle="Pedidos"
      >
        <v-card-text>
          <h1>99</h1>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-card class="border" append-icon="lucide:Hamburger" subtitle="Produtos">
        <v-card-text>
          <h1>40</h1>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-card class="border" append-icon="lucide:QrCode" subtitle="Mesas">
        <v-card-text>
          <h1>13</h1>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-card class="border" append-icon="lucide:Users" subtitle="Usuários">
        <v-card-text>
          <h1>03</h1>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" md="12">
      <v-card class="py-3 px-3 border" variant="outlined">
        <v-card-title>
          <v-icon class="me-1 mb-1" icon="lucide:User" size="22"></v-icon>
          {{ auth.user.name }}
        </v-card-title>

        <v-card-text class="py-0">
          <p>{{ auth.user.email }}</p>
        </v-card-text>

        <v-card-actions class="pb-0">
          <v-btn
            color="dark"
            variant="text"
            prepend-icon="lucide:Power"
            text="Sair"
            @click.prevent="auth.logout"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

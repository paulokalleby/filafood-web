<script setup>
defineProps({
  rows: {
    type: Number,
    default: 10,
  },
});
</script>

<template>
  <v-card class="border mt-4">
    <v-skeleton-loader type="table-thead"></v-skeleton-loader>

    <v-skeleton-loader v-for="n in rows" :key="n" type="table-row" />
  </v-card>
</template>

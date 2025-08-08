<script setup>
const props = defineProps({
    show: Boolean,
})
</script>

<template>
    <div v-if="show" class="d-flex justify-content-center wrapper">
        <v-progress-circular indeterminate color="primary" size="large"></v-progress-circular>
    </div>
</template>

<style scoped>
.wrapper {
    z-index: 11111 !important;
    width: 100% !important;
    height: 100% !important;
    left: 0 !important;
    position: fixed !important;
    top: 0 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
}
</style>
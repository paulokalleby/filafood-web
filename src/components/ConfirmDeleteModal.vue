<script setup>
import { ref } from "vue";

const props = defineProps({
  itemId: {
    required: false,
    default: null,
  },
  deleting: {
    required: false,
    default: false,
  },
});
const emit = defineEmits(["confirm-delete"]);

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const confirmDelete = () => {
  if (props.itemId !== null) {
    emit("confirm-delete", props.itemId);
    closeModal();
  }
};

defineExpose({ openModal });
</script>

<template>
  <v-dialog v-model="isModalOpen" persistent max-width="400">
    <v-card :loading="props.deleting" class="shadow-lg">
      <v-card-title class="text-h6">Confirmar Exclusão</v-card-title>
      <v-card-text class="px-4 text-body-2">
        Deseja excluir o registro? Esta ação não pode ser desfeita.
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-btn color="danger" variant="flat" @click="confirmDelete">
          Confirmar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="dark" variant="text" @click="closeModal">
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

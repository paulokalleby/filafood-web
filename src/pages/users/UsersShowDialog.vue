<script setup>
import { ref, watch, computed } from "vue";
import { useUsersStore } from "@/stores/users";

const props = defineProps({
  modelValue: Boolean,
  id: String,
});
const emit = defineEmits(["update:modelValue"]);

const store = useUsersStore();
const data = ref(null);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

watch(
  () => props.id,
  async (id) => {
    if (props.modelValue && id) {
      data.value = null;
      data.value = await store.findUserById(id);
    }
  },
  { immediate: true }
);

const close = () => emit("update:modelValue", false);
</script>

<template>
  <v-navigation-drawer
    location="right"
    temporary
    width="400"
    v-model="isOpen"
    :scrim="true"
    :fullscreen="false"
  >
    <v-card :loading="store.loading">
      <v-toolbar color="white">
        <v-toolbar-title class="font-weight-bold">Usuário</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close" variant="plain">
          <v-icon>lucide:X</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="px-5" v-if="data">
        <p><strong>Nome:</strong> {{ data.name }}</p>
        <p><strong>Email:</strong> {{ data.email }}</p>

        <div v-if="data.roles.length > 0">
          <p><strong>Papéis:</strong></p>
          <p v-for="role in data.roles" :key="role.id">
            <v-chip size="x-small" label>
              {{ role.name }}
            </v-chip>
          </p>
        </div>
        <v-chip
          class="mt-4"
          :color="data.active ? 'green' : 'red'"
          :text="data.active ? 'Ativo' : 'Inativo'"
          size="x-small"
          label
        />
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

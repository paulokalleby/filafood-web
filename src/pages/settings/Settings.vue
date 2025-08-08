<script setup>
import { onMounted, ref } from "vue";
// import useVuelidate from "@vuelidate/core";
// import { tableRules } from "@/validations/table.rules";
import { useSettingsStore } from "@/stores/settings";

onMounted(async () => {
  await store.getSettings();
  data.value = store.settings;
});

const store = useSettingsStore();

const data = ref({
  name: "",
  subdomain: "",
  Image: "",
  active: false,
  payments: [],
});

// const v$ = useVuelidate(tableRules, data);

const handlerUpdate = async () => {
  // if (!(await v$.value.$validate())) return;
  // await store.updateTable(props.id, data.value);
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-breadcrumbs class="py-0 px-0">
        <v-breadcrumbs-item :to="'/'"> Dashboard </v-breadcrumbs-item>
        <v-breadcrumbs-divider />
        <v-breadcrumbs-item disabled> Configurações </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>
  </v-row>

  <v-form @submit.prevent="handlerUpdate" class="my-3">
    <v-row>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12" md="12" class="pb-0">
            <v-text-field v-model="data.name" label="Estabelecimento">
            </v-text-field>
          </v-col>

          <v-col cols="12" md="12" class="pb-0">
            <v-text-field
              v-model="data.subdomain"
              label="Subdomínio"
              prefix="https://"
              suffix=".filafood.com.br"
              :persistent-hint="true"
              hint="Informe um subdomínio válido, o mesmo será usado para acessar a plataforma"
            >
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn
              :loading="store.updating"
              type="submit"
              variant="flat"
              class="float-start mr-2"
              text="Salvar"
            >
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

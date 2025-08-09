<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { useDark, useToggle } from "@vueuse/core";
import { useRoute } from "vue-router";
// import { getImageSrc } from "@/utils/helpers";

const isDark = useDark();
const toggleDark = useToggle(isDark);
const auth = useAuthStore();
const route = useRoute();
const isDrawerOpen = ref(true);

const pageTitle = computed(() => route.meta.title || "");
</script>

<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-navigation-drawer v-model="isDrawerOpen" class="px-4" :width="270">
      <!-- <v-list>
        <v-list-item class="mt-3 ms-n2">
          <v-row align="center" no-gutters>
            <v-col cols="auto" class="mr-2">
              <v-avatar
                :image="getImageSrc(auth.user.tenant.image)"
                color="surface-variant"
                size="38"
              ></v-avatar>
            </v-col>
            <v-col>
              <v-app-bar-title class="font-weight-black">{{
                auth.user.tenant.name
              }}</v-app-bar-title>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list> -->

      <v-list>
        <v-list-item class="mt-3">
          <v-app-bar-title class="font-weight-black">{{
            auth.user.tenant.name
          }}</v-app-bar-title>
        </v-list-item>
      </v-list>

      <v-list nav>
        <v-list-item
          key="dashboard.index"
          prepend-icon="lucide:Home"
          :to="{ name: 'dashboard.index' }"
          title="Dashboard"
          density="compact"
        >
          <template v-slot:prepend>
            <v-icon size="20" />
          </template>
        </v-list-item>

        <v-list-item
          key="commands.index"
          v-can="'commands.index'"
          prepend-icon="lucide:ReceiptText"
          :to="{ name: 'commands.index' }"
          title="Comandas"
          density="compact"
        >
          <template v-slot:prepend>
            <v-icon size="20" />
          </template>
        </v-list-item>

        <v-list-item
          key="categories.index"
          v-can="'categories.index'"
          prepend-icon="lucide:Layers"
          :to="{ name: 'categories.index' }"
          title="Categorias"
          density="compact"
        >
          <template v-slot:prepend>
            <v-icon size="20" />
          </template>
        </v-list-item>

        <v-list-item
          key="products.index"
          v-can="'products.index'"
          prepend-icon="lucide:Hamburger"
          :to="{ name: 'products.index' }"
          title="Produtos"
          density="compact"
        >
          <template v-slot:prepend>
            <v-icon size="20" />
          </template>
        </v-list-item>

        <v-list-item
          key="tables.index"
          v-can="'tables.index'"
          prepend-icon="lucide:Grip"
          :to="{ name: 'tables.index' }"
          title="Mesas"
          density="compact"
        >
          <template v-slot:prepend>
            <v-icon size="20" />
          </template>
        </v-list-item>

        <v-list-subheader
          v-any="['roles.index', 'users.index']"
          class="text-uppercase"
          title="Controle de Acessos"
        />

        <v-list-item
          key="roles.index"
          v-can="'roles.index'"
          prepend-icon="lucide:ShieldUser"
          :to="{ name: 'roles.index' }"
          title="Papéis"
          density="compact"
        >
          <template v-slot:prepend>
            <v-icon size="20" />
          </template>
        </v-list-item>

        <v-list-item
          key="user.index"
          v-can="'users.index'"
          prepend-icon="lucide:Users"
          :to="{ name: 'users.index' }"
          title="Usuários"
          density="compact"
        >
          <template v-slot:prepend>
            <v-icon size="20" />
          </template>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list nav class="mb-4">
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="lucide:User"
                append-icon="lucide:ChevronsUpDown"
                :title="auth.user?.name"
                density="compact"
                :ripple="false"
              >
                <template v-slot:prepend>
                  <v-icon size="20" />
                </template>
                <template v-slot:append>
                  <v-icon size="16" />
                </template>
              </v-list-item>
            </template>
            <v-list
              nav
              :lines="false"
              density="compact"
              min-width="200px"
              class="border rounded-lg mb-2"
              elevation="0"
            >
              <!-- <v-list-item link :to="{ name: 'settings.index' }">
                <v-icon icon="lucide:Settings" size="16" class="mt-n1"/>
                Configurações
              </v-list-item> -->
              <v-list-item link :to="{ name: 'profile' }">
                <v-icon icon="lucide:CircleUser" size="16" class="mt-n1" />
                Minha Conta
              </v-list-item>
              <v-list-item link @click.prevent="auth.logout">
                <v-icon icon="lucide:Power" size="16" class="mt-n1" />
                Sair
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-responsive>
      <v-main>
        <v-container fluid class="px-lg-12 py-lg-6 px-6">
          <v-row>
            <v-col class="d-flex align-center ml-n2 pb-0 mb-0" cols="auto">
              <v-btn
                variant="text"
                @click="isDrawerOpen = !isDrawerOpen"
                :icon="
                  isDrawerOpen ? 'lucide:PanelLeft' : 'lucide:PanelLeftOpen'
                "
                size="small"
                color="dark"
              >
              </v-btn>
              <h2 class="mb-4_ font-weight-black ml-1">
                {{ pageTitle }}
              </h2>
            </v-col>
            <v-spacer></v-spacer>

            <v-col class="d-flex align-center mr-n2 pb-0 mb-0" cols="auto">
              <!-- <div class="me-1">
              <v-btn
                variant="text"
                icon="lucide:Bell"
                size="small"
                color="dark"
              ></v-btn>
            </div> -->
              <div class="me-1">
                <v-btn
                  variant="text"
                  @click="toggleDark()"
                  :icon="isDark ? 'lucide:MoonStar' : 'lucide:Sun'"
                  size="small"
                  color="dark"
                ></v-btn>
              </div>
            </v-col>
          </v-row>

          <router-view />
        </v-container>
      </v-main>
    </v-responsive>
  </v-app>
</template>

<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

function logout() {
  userStore.clearUser()
  router.push({ name: 'welcome' })
}
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 mb-5 flex justify-between items-center p-2 bg-gray-800 text-white position-fixed"
  >
    <!-- Logo po lewej -->
    <div class="flex-1">
      <img src="@/assets/ceny_paliwek_logo.png" alt="Logo" class="w-10 h-auto" />
    </div>

    <!-- Nazwa strony w środku -->
    <div class="flex-1 text-center">
      <RouterLink to="/" class="text-white hover:text-primary text-4xl font-bold"
        >Ceny Paliwek</RouterLink
      >
    </div>

    <!-- Przycisk logowania po prawej -->
    <div class="flex-1 text-right">
      <button
        @click="router.push({ name: 'login' })"
        v-if="!userStore.isLoggedIn"
        class="bg-primary hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
      >
        Zaloguj się
      </button>

      <button
        @click="logout"
        v-else
        class="bg-white hover:bg-green-600 hover:text-white text-primary font-semibold py-2 px-4 rounded"
      >
        Wyloguj się
      </button>
    </div>
  </nav>
</template>

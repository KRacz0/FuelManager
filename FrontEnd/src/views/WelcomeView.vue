<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import { onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'

const userStore = useUserStore()

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  if (token) {
    try {
      userStore.setUser(token)
      useToast().default(`Zalogowano`)
      router.push({ name: 'home' })
    } catch {
      useToast().default(`Błąd logowania`)
      router.push({ name: 'login' })
    }
  }
})
</script>

<template>
  <div class="flex flex-col items-center bg-gray-100">
    <!-- Logo -->
    <div class="mb-8">
      <img src="@/assets/ceny_paliwek_logo.png" alt="Logo strony" class="w-40" />
    </div>

    <!-- Powitanie -->
    <div class="mb-4">
      <h1 class="text-3xl font-semibold text-gray-800">Witaj na naszej stronie!</h1>
    </div>

    <!-- Opis strony -->
    <div class="mb-8 text-center px-4 max-w-md">
      <p class="text-lg text-gray-600">
        Gorące ceny paliw w Twojej okolicy! Zarejestruj się i tankuj już dziś!
      </p>
    </div>

    <!-- Przycisk rejestracji -->

    <div class="bg-primary hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
      <RouterLink to="/register" class="text-white">Zarejestruj się</RouterLink>
    </div>
  </div>
</template>

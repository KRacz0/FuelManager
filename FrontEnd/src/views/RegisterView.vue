<script setup lang="ts">
import http from '@/http'
import router from '@/router'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

function register() {
  validate()
  if (errorMessage.value != '') {
    return
  }
  const request = { email: email.value, password: password.value }
  http.post('api/register', request).then((response) => {
    router.push({ name: 'login' })
  })
}

function validate() {
  errorMessage.value = ''
  if (email.value == '') {
    errorMessage.value = 'Należy podać email'
    return
  }

  if (password.value == '') {
    errorMessage.value = 'Należy podać hasło'
    return
  }
}
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-center text-primary mb-6">Zarejestruj się</h2>

    <div v-if="errorMessage" class="text-red-600 text-center mb-4">{{ errorMessage }}</div>

    <form @submit.prevent="register">
      <div class="mb-4">
        <input
          type="email"
          v-model="email"
          placeholder="Wpisz email"
          class="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div class="mb-6">
        <input
          type="password"
          v-model="password"
          placeholder="Wpisz hasło"
          class="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div class="mb-4 text-center">
        <button
          type="submit"
          class="w-full py-3 bg-primary hover:bg-green-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Zarejestruj się
        </button>
      </div>
      <div class="w-full text-gray-400 text-sm text-center">
        Masz już konto? <RouterLink to="/login" class="text-primary">Zaloguj się</RouterLink>
      </div>
    </form>
  </div>
</template>

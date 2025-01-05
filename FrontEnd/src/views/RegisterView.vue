<script setup lang="ts">
import http from '@/http'
import router from '@/router'
import { ref } from 'vue'
import LoginView from './LoginView.vue'

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
  <div>Rejestracja</div>
  <div class="text-red-600">{{ errorMessage }}</div>
  <form @submit.prevent="register">
    <div><input type="email" v-model="email" placeholder="Wpisz email" /></div>
    <div><input type="password" v-model="password" placeholder="Wpisz hasło" /></div>
    <div><button type="submit">Zarejestruj się</button></div>
  </form>
</template>

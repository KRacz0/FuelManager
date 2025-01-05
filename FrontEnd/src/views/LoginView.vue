<script setup lang="ts">
import http from '@/http'
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

function decodeJwt(token: string) {
  const base64Url = token.split('.')[1] // Wyciągamy część payload (druga część)
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  const jsonPayload = atob(base64) // Dekodowanie Base64
  return JSON.parse(jsonPayload) // Przekształcamy w obiekt JSON
}

function login() {
  validate()
  if (errorMessage.value != '') {
    return
  }
  const request = { email: email.value, password: password.value }
  http.post('api/login', request).then((response) => {
    localStorage.setItem('token', response.data.token)
    if (response.data.token) {
      const decodedData = decodeJwt(response.data.token) // Dekodowanie tokenu
      const email = decodedData.email
      const role = decodedData.role
      useToast().default(`Zalogowano jako ${email} z rolą ${role}`)
    }
  })
}

function testAdmin() {
  http
    .get('/api/admin')
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
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
  <div>Login</div>
  <div class="text-red-600">{{ errorMessage }}</div>
  <form @submit.prevent="login">
    <div><input type="email" v-model="email" placeholder="Wpisz email" /></div>
    <div><input type="password" v-model="password" placeholder="Wpisz hasło" /></div>
    <div><button type="submit">Zaloguj się</button></div>
  </form>
  <div><button @click="testAdmin">Admin Test</button></div>
</template>

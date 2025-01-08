<script setup lang="ts">
import { onMounted } from 'vue'
import * as jose from 'jose'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'
import { useToast } from 'vue-toast-notification'

const userStore = useUserStore()

//Robimy to w celach pokazowych, realnie powinno to wszystko byc załatwione przez backend - dodanie użytkownika do bazy danych i uzyskanie Jwt token
//Używamy paczki jose bo jsonwebtoken nie chciało działać
async function simulateUserCreation(userInfo: any) {
  const token = await new jose.SignJWT({ id: userInfo.id, email: userInfo.email, role: 'user' })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' }) // Algorytm podpisu
    .setIssuedAt() // Czas wygenerowania
    .setExpirationTime('1d')
    .sign(new TextEncoder().encode('secret code'))

  return token
}

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (!code) {
    useToast().default(`Błąd logowania`)
    router.push({ name: 'login' })
    return
  }
  try {
    // Wymiana kodu autoryzacyjnego na token dostępu
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID
    const appSecret = import.meta.env.VITE_FACEBOOK_APP_SECRET
    const redirectUri = encodeURIComponent(import.meta.env.VITE_FACEBOOK_CALLBACK_URL)

    const response = await fetch(
      `https://graph.facebook.com/v16.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`,
    )
    if (!response.ok) {
      useToast().default(`Błąd logowania`)
      router.push({ name: 'login' })
      return
    }

    const data = await response.json()
    const accessToken = data.access_token

    if (!accessToken) {
      useToast().default(`Błąd logowania`)
      router.push({ name: 'login' })
      return
    }
    // Pobranie danych użytkownika
    const userInfoResponse = await fetch(
      `https://graph.facebook.com/me?fields=name,email&access_token=${accessToken}`,
    )
    const userInfo = await userInfoResponse.json()
    const token = await simulateUserCreation(userInfo)
    userStore.setUser(token)
    router.push({ name: 'home' })
  } catch (err) {
    console.error('Błąd podczas logowania:', err)
  }
})
</script>

<template>
  <div>
    <h1>Przetwarzanie danych...</h1>
  </div>
</template>

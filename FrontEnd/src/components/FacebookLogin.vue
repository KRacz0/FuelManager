<script setup lang="ts">
function loginWithFacebook() {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID // Podaj App ID z Facebook Developers
  const redirectUri = encodeURIComponent(import.meta.env.VITE_FACEBOOK_CALLBACK_URL) // URL przekierowania po logowaniu
  const fbLoginUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=email,public_profile`

  // Przekieruj użytkownika na stronę logowania Facebooka
  window.location.href = fbLoginUrl
}
</script>

<template>
  <button
    class="w-full flex items-center justify-center bg-blue-600 text-white py-0 px-0 rounded-md hover:bg-blue-700 transition duration-300"
    @click="loginWithFacebook"
  >
    <img src="@/assets/facebook_logo.png" alt="Facebook" class="w-10 h-auto" />
    Zaloguj się z Facebook
  </button>
</template>

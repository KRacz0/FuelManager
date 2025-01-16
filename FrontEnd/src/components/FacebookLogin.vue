<script setup lang="ts">
async function loginWithFacebook() {
  window.location.href = import.meta.env.VITE_API_URL + '/api/auth/facebook'
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

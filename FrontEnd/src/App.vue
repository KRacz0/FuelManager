<script setup lang="ts">
import AppNavbar from './components/AppNavbar.vue'
import AppSidebar from './components/AppSidebar.vue'
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>

<template>
  <AppNavbar />
  <AppSidebar v-if="userStore.isLoggedIn" />
  <div
    :class="[
      'min-h-screen pt-20 border-red border-1 border-solid',
      { 'pl-[400px] text-center': userStore.isLoggedIn },
    ]"
  >
    <div class="mt-32"><RouterView /></div>
    <div class="fixed left-0 bottom-0">
      <!-- do testowania -->
      <RouterLink to="/">Welcome&nbsp;</RouterLink>
      <RouterLink to="/register">Register&nbsp;</RouterLink>
      <RouterLink to="/login">Login&nbsp;</RouterLink>
      <RouterLink to="/home">Home&nbsp;</RouterLink>
      <RouterLink to="/map">Map&nbsp;</RouterLink>
      <RouterLink to="/list">List&nbsp;</RouterLink>
      <RouterLink to="/update-station">UpdateStation&nbsp;</RouterLink>
      <RouterLink to="/fuel-proposal">FuelProposal&nbsp;</RouterLink>
      <RouterLink to="/admin">Admin&nbsp;</RouterLink>
    </div>
  </div>
</template>

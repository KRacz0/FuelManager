<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <AppNavbar />
  <div>
    <RouterLink to="/">Welcome </RouterLink>
    <RouterLink to="/home">Home </RouterLink>
    <RouterLink to="/register">Register </RouterLink>
    <RouterLink to="/login">Login </RouterLink>
    <RouterLink to="/admin">Admin </RouterLink>
  </div>
  <RouterView />
</template>

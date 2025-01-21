<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>

<template>
  <div>
    <div v-if="userStore.isAdmin">Witaj Administratorze, życzymy miłego dnia.</div>

    <div v-else>Witaj Użytkowniku, życzymy miłego dnia.</div>
  </div>
</template>
